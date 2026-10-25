"use strict";

/* PULSE NEWS — bilingual interface and language-specific news feeds.
   Created by Sayeef Adnan. Data: ./data/news.json */

const DATA_URL = "./data/news.json";
const $ = (id) => document.getElementById(id);

const DEFAULT_CATEGORIES = [
  "World News", "Bangladesh", "Technology", "Science",
  "Artificial Intelligence", "Space", "Sports", "Cricket",
  "Football", "Entertainment", "Movies & TV", "Gaming",
  "Business", "Economy", "Markets & Finance", "Health",
  "Education", "Environment & Climate", "Politics", "Cybersecurity"
];

const translations = {
  en: {
    documentTitle: "Pulse News — Global News Intelligence",
    tagline: "YOUR WORLD. ONE FEED.", heading1: "News moves fast.", heading2: "Stay ahead.",
    intro: "Explore headlines from publishers around the world, organized in one place.",
    search: "Search headlines, topics or publishers...", loading: "Loading the latest collected stories…",
    checking: "Checking latest updates", explore: "Explore coverage",
    exploreDesc: "Choose a topic to personalize your feed.", latest: "Latest",
    saved: "★ Saved", refresh: "↻ Refresh", newsroom: "THE NEWSROOM",
    topStories: "Top Stories", allNews: "✦ All News", loadMore: "Load more stories",
    allLoaded: "All stories loaded", noStories: "No stories found",
    noStoriesDesc: "Try another category or search term.", savedTitle: "Saved Stories",
    storyCount: "stories collected", results: "results", justNow: "Just now",
    minutesAgo: "m ago", hoursAgo: "h ago", daysAgo: "d ago",
    unavailable: "Time unavailable", read: "Read original article ↗",
    publisher: "News publisher", fallback: "Open the original source to read this story.",
    connecting: "Connecting to the news feed…",
    loadError: "Could not load news data. Check data/news.json and run the GitHub Actions collector.",
    emptyData: "No stories collected yet. Run the GitHub Actions workflow to populate the feed.",
    footerDesc: "Independent news discovery. Stories belong to their respective publishers.",
    footerCredit: "Built by Sayeef Adnan · Powered by RSS",
    footerNote: "Headlines and links are provided for discovery. Visit the original publisher for full articles.",
    savedButton: "Save story", unsaveButton: "Remove bookmark",
    updated: "Collection updated",
    categories: {
      "World News":"World News","Bangladesh":"Bangladesh","Technology":"Technology","Science":"Science",
      "Artificial Intelligence":"Artificial Intelligence","Space":"Space","Sports":"Sports","Cricket":"Cricket",
      "Football":"Football","Entertainment":"Entertainment","Movies & TV":"Movies & TV","Gaming":"Gaming",
      "Business":"Business","Economy":"Economy","Markets & Finance":"Markets & Finance","Health":"Health",
      "Education":"Education","Environment & Climate":"Environment & Climate","Politics":"Politics",
      "Cybersecurity":"Cybersecurity"
    }
  },
  bn: {
    documentTitle: "পালস নিউজ — সর্বশেষ সংবাদ", tagline: "আপনার দুনিয়া, এক জায়গায়",
    heading1: "খবরের গতি দ্রুত।", heading2: "থাকুন এগিয়ে।",
    intro: "বিশ্বের বিভিন্ন সংবাদমাধ্যমের সর্বশেষ খবর এক জায়গায় পড়ুন।",
    search: "শিরোনাম, বিষয় বা সংবাদমাধ্যম খুঁজুন...", loading: "সংগৃহীত খবর লোড হচ্ছে…",
    checking: "সর্বশেষ আপডেট দেখা হচ্ছে", explore: "খবরের বিভাগ",
    exploreDesc: "আপনার পছন্দের বিষয় নির্বাচন করুন।", latest: "সর্বশেষ",
    saved: "★ সংরক্ষিত", refresh: "↻ রিফ্রেশ", newsroom: "সংবাদকক্ষ",
    topStories: "শীর্ষ সংবাদ", allNews: "✦ সব খবর", loadMore: "আরও খবর দেখুন",
    allLoaded: "সব খবর দেখানো হয়েছে", noStories: "কোনো খবর পাওয়া যায়নি",
    noStoriesDesc: "অন্য বিভাগ বা শব্দ দিয়ে খুঁজে দেখুন।", savedTitle: "সংরক্ষিত খবর",
    storyCount: "টি খবর সংগ্রহ করা হয়েছে", results: "টি ফলাফল", justNow: "এইমাত্র",
    minutesAgo: " মিনিট আগে", hoursAgo: " ঘণ্টা আগে", daysAgo: " দিন আগে",
    unavailable: "সময় পাওয়া যায়নি", read: "মূল সংবাদ পড়ুন ↗",
    publisher: "সংবাদমাধ্যম", fallback: "মূল সংবাদ পড়তে প্রকাশকের ওয়েবসাইটে যান।",
    connecting: "সংবাদ লোড হচ্ছে…",
    loadError: "সংবাদ লোড করা যায়নি। data/news.json ফাইল এবং GitHub Actions পরীক্ষা করুন।",
    emptyData: "এখনো কোনো খবর সংগ্রহ হয়নি। GitHub Actions workflow চালু করুন।",
    footerDesc: "বিভিন্ন সংবাদমাধ্যমের খবর এক জায়গায়। প্রতিটি খবর সংশ্লিষ্ট প্রকাশকের নিজস্ব।",
    footerCredit: "নির্মাতা: সাঈফ আদনান · RSS দ্বারা পরিচালিত",
    footerNote: "সম্পূর্ণ সংবাদ পড়তে মূল প্রকাশকের ওয়েবসাইটে যান।",
    savedButton: "খবর সংরক্ষণ করুন", unsaveButton: "সংরক্ষিত খবর থেকে সরান",
    updated: "সর্বশেষ সংগ্রহ:",
    categories: {
      "World News":"বিশ্ব সংবাদ","Bangladesh":"বাংলাদেশ","Technology":"প্রযুক্তি","Science":"বিজ্ঞান",
      "Artificial Intelligence":"কৃত্রিম বুদ্ধিমত্তা","Space":"মহাকাশ","Sports":"খেলাধুলা","Cricket":"ক্রিকেট",
      "Football":"ফুটবল","Entertainment":"বিনোদন","Movies & TV":"সিনেমা ও টিভি","Gaming":"গেমিং",
      "Business":"ব্যবসা-বাণিজ্য","Economy":"অর্থনীতি","Markets & Finance":"শেয়ারবাজার ও অর্থায়ন",
      "Health":"স্বাস্থ্য","Education":"শিক্ষা","Environment & Climate":"পরিবেশ ও জলবায়ু",
      "Politics":"রাজনীতি","Cybersecurity":"সাইবার নিরাপত্তা"
    }
  }
};

let currentLanguage = "en";
let allNews = [];
let categories = [...DEFAULT_CATEGORIES];
let activeCategory = "all";
let mode = "latest";
let visibleLimit = 24;
let isLoading = false;
let savedIds = new Set();

try {
  const lang = localStorage.getItem("pulse-language");
  if (lang === "bn" || lang === "en") currentLanguage = lang;
  if (localStorage.getItem("pulse-theme") === "light") document.body.classList.add("light");
  const saved = JSON.parse(localStorage.getItem("pulse-saved") || "[]");
  if (Array.isArray(saved)) savedIds = new Set(saved.filter(x => typeof x === "string"));
} catch (_) {}

function esc(value = "") {
  return String(value).replace(/[&<>"']/g, ch => ({
    "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;"
  })[ch]);
}
function t(key) { return translations[currentLanguage][key] ?? translations.en[key] ?? key; }
function categoryLabel(category) {
  return translations[currentLanguage].categories[category] || category ||
    (currentLanguage === "bn" ? "অন্যান্য" : "Other");
}
function getId(item) { return String(item.id || item.url || ""); }
function safeUrl(value) {
  try {
    const u = new URL(value, location.href);
    return (u.protocol === "https:" || u.protocol === "http:") ? u.href : "";
  } catch (_) { return ""; }
}
function formatNumber(n) {
  return new Intl.NumberFormat(currentLanguage === "bn" ? "bn-BD" : "en-US").format(n);
}
function formatDate(value) {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return t("unavailable");
  return d.toLocaleDateString(currentLanguage === "bn" ? "bn-BD" : "en-US",
    {year:"numeric", month:"short", day:"numeric"});
}
function relativeTime(value) {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return t("unavailable");
  const seconds = Math.max(0, (Date.now() - d.getTime()) / 1000);
  if (seconds < 60) return t("justNow");
  if (seconds < 3600) return formatNumber(Math.floor(seconds / 60)) + t("minutesAgo");
  if (seconds < 86400) return formatNumber(Math.floor(seconds / 3600)) + t("hoursAgo");
  return formatNumber(Math.floor(seconds / 86400)) + t("daysAgo");
}

function applyLanguage(language, persist = true) {
  currentLanguage = language === "bn" ? "bn" : "en";
  document.documentElement.lang = currentLanguage;
  document.title = t("documentTitle");
  const select = $("languageSelect");
  if (select) select.value = currentLanguage;
  setText(".eyebrow", t("tagline"));
  const h1 = document.querySelector(".hero h1");
  if (h1) h1.innerHTML = `${esc(t("heading1"))}<br><span>${esc(t("heading2"))}</span>`;
  const heroP = document.querySelector(".hero > p");
  if (heroP) heroP.textContent = t("intro");
  const search = $("searchInput");
  if (search) search.placeholder = t("search");
  setText("#storyCount", t("loading"));
  setText("#updatedAt", t("checking"));
  const toolbarH = document.querySelector(".toolbar h2");
  if (toolbarH) toolbarH.textContent = t("explore");
  const toolbarP = document.querySelector(".toolbar p");
  if (toolbarP) toolbarP.textContent = t("exploreDesc");
  setText("#latestBtn", t("latest"));
  setText("#savedBtn", t("saved"));
  setText("#refreshBtn", t("refresh"));
  setText(".section-kicker", t("newsroom"));
  setText("#feedTitle", t("topStories"));
  setText("#loadMoreBtn", t("loadMore"));
  setText(".footer-brand", currentLanguage === "bn" ? "পালস নিউজ" : "PulseNews");
  const footer = document.querySelectorAll("footer p");
  if (footer[0]) footer[0].textContent = t("footerDesc");
  if (footer[1]) footer[1].textContent = t("footerCredit");
  if (footer[2]) footer[2].textContent = t("footerNote");
  const nav = $("categoryNav");
  if (nav) nav.setAttribute("aria-label", currentLanguage === "bn" ? "সংবাদের বিভাগ" : "News categories");
  if (persist) {
    try { localStorage.setItem("pulse-language", currentLanguage); } catch (_) {}
  }
  visibleLimit = 24;
  renderCategories();
  renderNews();
  updateStatus();
}
function setText(selector, value) {
  const el = document.querySelector(selector);
  if (el) el.textContent = value;
}

function filteredNews() {
  const query = ($("searchInput")?.value || "").trim().toLocaleLowerCase(
    currentLanguage === "bn" ? "bn-BD" : "en-US");
  let items = allNews.filter(item => {
    const categoryMatch = activeCategory === "all" || item.category === activeCategory;
    const savedMatch = mode !== "saved" || savedIds.has(getId(item));
    const text = `${item.title || ""} ${item.summary || ""} ${item.publisher || ""} ${item.category || ""}`.toLocaleLowerCase(
      currentLanguage === "bn" ? "bn-BD" : "en-US");
    return categoryMatch && savedMatch && (!query || text.includes(query));
  });
  return items.sort((a, b) => new Date(b.published || 0) - new Date(a.published || 0));
}

function renderCategories() {
  const nav = $("categoryNav");
  if (!nav) return;
  nav.innerHTML = `<button class="category-chip ${activeCategory === "all" ? "active" : ""}" data-category="all">${esc(t("allNews"))}</button>` +
    categories.map(category => `<button class="category-chip ${activeCategory === category ? "active" : ""}" data-category="${esc(category)}">${esc(categoryLabel(category))}</button>`).join("");
}

function cardTemplate(item) {
  const id = getId(item), url = safeUrl(item.url);
  if (!url) return "";
  const saved = savedIds.has(id);
  const title = esc(item.title || "");
  const summary = esc(item.summary || t("fallback"));
  const publisher = esc(item.publisher || t("publisher"));
  const time = esc(relativeTime(item.published));
  const saveLabel = saved ? t("unsaveButton") : t("savedButton");
  return `<article class="news-card">
    <div class="card-top">
      <span class="category-label">${esc(categoryLabel(item.category))}</span>
      <button type="button" class="save-btn ${saved ? "saved" : ""}" data-save="${esc(id)}"
        aria-label="${esc(saveLabel)}" aria-pressed="${saved}" title="${esc(saveLabel)}">${saved ? "★" : "☆"}</button>
    </div>
    <h3><a href="${esc(url)}" target="_blank" rel="noopener noreferrer">${title}</a></h3>
    <p class="summary">${summary}</p>
    <div class="card-bottom">
      <span class="publisher">${publisher}</span>
      <span class="time" title="${esc(formatDate(item.published))}">${time}</span>
      <a class="read-link" href="${esc(url)}" target="_blank" rel="noopener noreferrer">${esc(t("read"))}</a>
    </div>
  </article>`;
}

function renderNews() {
  const grid = $("newsGrid");
  if (!grid) return;
  const items = filteredNews();
  const shown = items.slice(0, visibleLimit);
  setText("#storyCount", `${formatNumber(allNews.length)} ${t("storyCount")}`);
  setText("#resultCount", `${formatNumber(items.length)} ${t("results")}`);
  setText("#feedTitle", mode === "saved" ? t("savedTitle") :
    activeCategory === "all" ? t("topStories") : categoryLabel(activeCategory));
  grid.innerHTML = shown.length ? shown.map(cardTemplate).join("") :
    `<div class="empty-state"><h3>${esc(t("noStories"))}</h3><p>${esc(t("noStoriesDesc"))}</p></div>`;
  const more = $("loadMoreBtn");
  if (more) {
    more.disabled = shown.length >= items.length;
    more.textContent = shown.length >= items.length ? t("allLoaded") : t("loadMore");
  }
  const latest = $("latestBtn"), saved = $("savedBtn");
  if (latest) { latest.classList.toggle("active", mode === "latest"); latest.setAttribute("aria-pressed", String(mode === "latest")); }
  if (saved) { saved.classList.toggle("active", mode === "saved"); saved.setAttribute("aria-pressed", String(mode === "saved")); }
}

function updateStatus(message = "") {
  const status = $("statusMessage");
  if (!status) return;
  if (message) {
    status.textContent = message;
    status.style.display = "block";
    status.classList.remove("error");
  } else if (isLoading) {
    status.textContent = t("loading");
    status.style.display = "block";
    status.classList.remove("error");
  } else if (allNews.length === 0) {
    status.textContent = t("emptyData");
    status.style.display = "block";
    status.classList.remove("error");
  } else {
    status.textContent = "";
    status.style.display = "none";
  }
}

async function loadNews(options = {}) {
  const quiet = options.quiet === true;
  if (isLoading) return;
  isLoading = true;
  const refreshButton = $("refreshBtn");
  if (refreshButton) refreshButton.disabled = true;
  if (!quiet) updateStatus(t("loading"));
  try {
    const response = await fetch(`${DATA_URL}?v=${Date.now()}`, {
      cache: "no-store", headers: {Accept:"application/json"}
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    if (!data || (!Array.isArray(data.articles) && !data.articlesByLanguage)) {
      throw new Error("Invalid news JSON structure");
    }

    // Preferred format: collector stores independent English and Bengali lists.
    // Legacy JSON is supported, but old articles cannot be automatically translated.
    const languageArticles = data.articlesByLanguage?.[currentLanguage];
    const rawArticles = Array.isArray(languageArticles)
      ? languageArticles
      : (Array.isArray(data.articles) ? data.articles.filter(item =>
          !item.lang || item.lang === currentLanguage) : []);

    allNews = rawArticles.filter(item => item && typeof item === "object" &&
      typeof item.title === "string" && typeof item.url === "string" && safeUrl(item.url));

    if (Array.isArray(data.categories) && data.categories.length) {
      categories = data.categories.filter(x => typeof x === "string" && x.trim());
    } else {
      categories = [...new Set([...DEFAULT_CATEGORIES, ...allNews.map(x => x.category).filter(Boolean)])];
    }
    if (activeCategory !== "all" && !categories.includes(activeCategory)) activeCategory = "all";
    renderCategories();
    renderNews();
    const updated = $("updatedAt");
    if (updated) updated.textContent = `${t("updated")} ${relativeTime(data.updatedAt)}`;
    updateStatus();
  } catch (error) {
    console.error("Pulse News loading error:", error);
    updateStatus(t("loadError"));
    const status = $("statusMessage");
    if (status) status.classList.add("error");
  } finally {
    isLoading = false;
    if (refreshButton) refreshButton.disabled = false;
  }
}

function persistSaved() {
  try { localStorage.setItem("pulse-saved", JSON.stringify([...savedIds])); } catch (_) {}
}
function toggleSaved(id) {
  if (!id) return;
  if (savedIds.has(id)) savedIds.delete(id); else savedIds.add(id);
  persistSaved();
  renderNews();
}
function applyTheme(theme, persist = true) {
  const light = theme === "light";
  document.body.classList.toggle("light", light);
  const button = $("themeBtn");
  if (button) {
    button.textContent = light ? "☀" : "☾";
    button.setAttribute("aria-label", currentLanguage === "bn"
      ? (light ? "ডার্ক মোড চালু করুন" : "লাইট মোড চালু করুন")
      : (light ? "Enable dark mode" : "Enable light mode"));
  }
  if (persist) {
    try { localStorage.setItem("pulse-theme", light ? "light" : "dark"); } catch (_) {}
  }
}

function bindEvents() {
  const languageSelect = $("languageSelect");
  if (languageSelect) {
    languageSelect.value = currentLanguage;
    languageSelect.addEventListener("change", () => {
      const newLanguage = languageSelect.value === "bn" ? "bn" : "en";
      applyLanguage(newLanguage);
      // Re-load the correct language's actual news list, not just translated labels.
      loadNews();
    });
  }
  $("categoryNav")?.addEventListener("click", event => {
    const button = event.target.closest("[data-category]");
    if (!button) return;
    activeCategory = button.dataset.category;
    visibleLimit = 24;
    renderCategories(); renderNews();
  });
  $("newsGrid")?.addEventListener("click", event => {
    const button = event.target.closest("[data-save]");
    if (button) toggleSaved(button.dataset.save);
  });
  $("searchInput")?.addEventListener("input", () => { visibleLimit = 24; renderNews(); });
  $("clearSearch")?.addEventListener("click", () => {
    const input = $("searchInput");
    if (input) { input.value = ""; renderNews(); input.focus(); }
  });
  $("latestBtn")?.addEventListener("click", () => { mode = "latest"; visibleLimit = 24; renderNews(); });
  $("savedBtn")?.addEventListener("click", () => { mode = "saved"; visibleLimit = 24; renderNews(); });
  $("refreshBtn")?.addEventListener("click", () => loadNews());
  $("loadMoreBtn")?.addEventListener("click", () => { visibleLimit += 24; renderNews(); });
  $("themeBtn")?.addEventListener("click", () =>
    applyTheme(document.body.classList.contains("light") ? "dark" : "light"));
  const backTop = $("backTop");
  if (backTop) {
    window.addEventListener("scroll", () => backTop.classList.toggle("show", window.scrollY > 500));
    backTop.addEventListener("click", () => window.scrollTo({top:0, behavior:"smooth"}));
  }
}

function initPulseNews() {
  applyTheme(document.body.classList.contains("light") ? "light" : "dark", false);
  bindEvents();
  applyLanguage(currentLanguage, false);
  loadNews();
}
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initPulseNews, {once:true});
} else {
  initPulseNews();
}
