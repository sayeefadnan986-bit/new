#!/usr/bin/env python3
"""Collect English and Bengali news into data/news.json for PulseNews."""
import concurrent.futures
import datetime as dt
import email.utils
import hashlib
import html
import json
import re
import urllib.parse
import urllib.request
import xml.etree.ElementTree as ET
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CONFIG_PATH = ROOT / "feeds.json"
DATA_PATH = ROOT / "data" / "news.json"
USER_AGENT = "PulseNewsRSS/2.0 (GitHub Actions bilingual RSS reader)"
REQUEST_TIMEOUT = 18
MAX_WORKERS = 16
RETENTION_DAYS = 14

# One Bengali-language Google News query per category. These are deliberately
# topic searches (not restricted to English-language publisher domains).
BENGALI_QUERIES = {
    "World News": "বিশ্ব সংবাদ আন্তর্জাতিক খবর",
    "Bangladesh": "বাংলাদেশের সর্বশেষ সংবাদ",
    "Technology": "প্রযুক্তি প্রযুক্তি উদ্ভাবন গ্যাজেট",
    "Science": "বিজ্ঞান গবেষণা আবিষ্কার",
    "Artificial Intelligence": "কৃত্রিম বুদ্ধিমত্তা এআই মেশিন লার্নিং",
    "Space": "মহাকাশ জ্যোতির্বিজ্ঞান নাসা",
    "Sports": "খেলাধুলা ক্রীড়া সর্বশেষ খবর",
    "Cricket": "ক্রিকেট খেলার খবর",
    "Football": "ফুটবল খেলার খবর",
    "Entertainment": "বিনোদন সংগীত তারকা সংস্কৃতি",
    "Movies & TV": "সিনেমা চলচ্চিত্র টিভি সিরিজ",
    "Gaming": "ভিডিও গেম গেমিং খবর",
    "Business": "ব্যবসা বাণিজ্য কোম্পানি",
    "Economy": "অর্থনীতি মুদ্রাস্ফীতি অর্থনৈতিক খবর",
    "Markets & Finance": "শেয়ারবাজার পুঁজিবাজার অর্থায়ন",
    "Health": "স্বাস্থ্য চিকিৎসা গবেষণা",
    "Education": "শিক্ষা স্কুল বিশ্ববিদ্যালয়",
    "Environment & Climate": "পরিবেশ জলবায়ু পরিবর্তন",
    "Politics": "রাজনীতি নির্বাচন সরকার",
    "Cybersecurity": "সাইবার নিরাপত্তা তথ্য চুরি অনলাইন নিরাপত্তা",
}

def utc_now():
    return dt.datetime.now(dt.timezone.utc)

def iso_date(value):
    if not value:
        return None
    try:
        parsed = email.utils.parsedate_to_datetime(value)
        if parsed.tzinfo is None:
            parsed = parsed.replace(tzinfo=dt.timezone.utc)
        return parsed.astimezone(dt.timezone.utc).isoformat()
    except (TypeError, ValueError, OverflowError):
        try:
            parsed = dt.datetime.fromisoformat(value.replace("Z", "+00:00"))
            if parsed.tzinfo is None:
                parsed = parsed.replace(tzinfo=dt.timezone.utc)
            return parsed.astimezone(dt.timezone.utc).isoformat()
        except (TypeError, ValueError, AttributeError):
            return None

def clean_text(value):
    value = html.unescape(value or "")
    value = re.sub(r"<[^>]+>", " ", value)
    return re.sub(r"\s+", " ", value).strip()

def child_text(element, names):
    for child in element:
        if child.tag.split("}")[-1].lower() in names and child.text:
            return child.text.strip()
    return ""

def article_id(url):
    return hashlib.sha256(url.encode("utf-8")).hexdigest()[:20]

def read_existing():
    try:
        data = json.loads(DATA_PATH.read_text(encoding="utf-8"))
        # New format has language-specific lists; merge them as well.
        if isinstance(data.get("articlesByLanguage"), dict):
            merged = []
            for lang in ("en", "bn"):
                merged.extend(data["articlesByLanguage"].get(lang, []))
            merged.extend(data.get("articles", []))
            return merged
        return data.get("articles", [])
    except (OSError, json.JSONDecodeError, AttributeError):
        return []

def fetch_source(category, keywords, domain=None, limit=8, language="en"):
    if language == "bn":
        query = keywords
        locale = {"hl": "bn", "gl": "BD", "ceid": "BD:bn"}
    else:
        query = f"{keywords} site:{domain}" if domain else keywords
        locale = {"hl": "en-US", "gl": "US", "ceid": "US:en"}

    params = urllib.parse.urlencode({"q": query, **locale})
    feed_url = "https://news.google.com/rss/search?" + params
    request = urllib.request.Request(
        feed_url,
        headers={"User-Agent": USER_AGENT,
                 "Accept": "application/rss+xml, application/xml, text/xml"}
    )
    try:
        with urllib.request.urlopen(request, timeout=REQUEST_TIMEOUT) as response:
            if response.status != 200:
                return []
            payload = response.read(3_000_000)
        root = ET.fromstring(payload)
        elements = [node for node in root.iter()
                    if node.tag.split("}")[-1].lower() in ("item", "entry")]
        results = []
        for entry in elements[:limit]:
            title = clean_text(child_text(entry, {"title"}))
            link = child_text(entry, {"link"})
            summary = clean_text(child_text(entry, {"description", "summary", "content"}))
            published_raw = child_text(entry, {"pubdate", "published", "updated", "date"})
            if not link:
                for node in entry:
                    if node.tag.split("}")[-1].lower() == "link":
                        href = node.attrib.get("href", "")
                        rel = node.attrib.get("rel", "alternate")
                        if href and (rel == "alternate" or not link):
                            link = href
                            if rel == "alternate":
                                break
            source = ""
            for node in entry:
                if node.tag.split("}")[-1].lower() == "source":
                    source = clean_text(node.text or node.attrib.get("title", ""))
                    break
            link = link.strip()
            if not title or not link or not link.startswith(("https://", "http://")):
                continue
            results.append({
                "id": article_id(link),
                "title": title[:400],
                "summary": summary[:900],
                "url": link,
                "publisher": source or domain or "Google News",
                "category": category,
                "published": iso_date(published_raw) or utc_now().isoformat(),
                "lang": language
            })
        return results
    except Exception as exc:
        print(f"[WARN] {language} | {category} | {domain or 'topic'}: {type(exc).__name__}: {exc}")
        return []

def normalized_published(item):
    value = item.get("published", "")
    try:
        parsed = dt.datetime.fromisoformat(value.replace("Z", "+00:00"))
        return parsed.replace(tzinfo=dt.timezone.utc) if parsed.tzinfo is None else parsed
    except (ValueError, TypeError, AttributeError):
        return utc_now()

def main():
    config = json.loads(CONFIG_PATH.read_text(encoding="utf-8"))
    category_configs = config["categories"]
    per_source = int(config.get("max_articles_per_source", 8))
    per_category = int(config.get("max_articles_per_category", 100))
    total_limit = int(config.get("max_total_articles", 1800))

    jobs = []
    for category in category_configs:
        name, keywords = category["name"], category["query"]
        for domain in category.get("sources", []):
            jobs.append((name, keywords, domain, per_source, "en"))
        # Bengali query is independent of English publisher domain filters.
        bn_query = BENGALI_QUERIES.get(name, name)
        jobs.append((name, bn_query, None, per_source * 3, "bn"))

    print(f"Starting bilingual Pulse News collection: {len(jobs)} searches")
    fresh = []
    with concurrent.futures.ThreadPoolExecutor(max_workers=MAX_WORKERS) as executor:
        futures = [executor.submit(fetch_source, *job) for job in jobs]
        for future in concurrent.futures.as_completed(futures):
            try:
                fresh.extend(future.result())
            except Exception as exc:
                print(f"[WARN] Worker failed: {exc}")

    cutoff = utc_now() - dt.timedelta(days=RETENTION_DAYS)
    combined = read_existing() + fresh
    deduped = {}
    for raw in combined:
        if not isinstance(raw, dict):
            continue
        item = dict(raw)
        url = item.get("url", "")
        title = clean_text(item.get("title", ""))
        if not url.startswith(("https://", "http://")) or not title:
            continue
        published = normalized_published(item)
        if published < cutoff:
            continue
        lang = item.get("lang", "en")
        if lang not in ("en", "bn"):
            lang = "en"
        item["lang"] = lang
        item["title"] = title[:400]
        item["summary"] = clean_text(item.get("summary", ""))[:900]
        item["id"] = item.get("id") or article_id(url)
        item["published"] = published.astimezone(dt.timezone.utc).isoformat()
        # Keep one version per URL AND language; same URL may surface in both searches.
        key = (lang, url)
        if key not in deduped or published > normalized_published(deduped[key]):
            deduped[key] = item

    by_language = {"en": [], "bn": []}
    for item in deduped.values():
        by_language[item["lang"]].append(item)

    for lang in by_language:
        by_language[lang].sort(key=lambda item: item.get("published", ""), reverse=True)
        counts = {}
        selected = []
        for item in by_language[lang]:
            category = item.get("category", "")
            if counts.get(category, 0) >= per_category:
                continue
            counts[category] = counts.get(category, 0) + 1
            selected.append(item)
        by_language[lang] = selected[:total_limit]

    # "articles" remains available for compatibility with older front ends.
    articles = sorted(by_language["en"], key=lambda item: item.get("published", ""), reverse=True)
    output = {
        "updatedAt": utc_now().isoformat(),
        "categories": [category["name"] for category in category_configs],
        "total": len(articles),
        "languageTotals": {key: len(value) for key, value in by_language.items()},
        "articlesByLanguage": by_language,
        "articles": articles
    }
    DATA_PATH.parent.mkdir(parents=True, exist_ok=True)
    DATA_PATH.write_text(json.dumps(output, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Collection complete: EN={len(by_language['en'])}, BN={len(by_language['bn'])}")
    print(f"Output written to: {DATA_PATH}")

if __name__ == "__main__":
    main()
