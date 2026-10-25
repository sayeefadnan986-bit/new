Pulse News — bilingual news website
Created by Sayeef Adnan. Static GitHub Pages frontend + Python RSS collector.
Files and paths (keep these exact)
.
├── index.html
├── styles.css
├── app.js
├── feeds.json
├── data/
│   └── news.json
├── scripts/
│   └── collect_feeds.py
└── .github/
    └── workflows/
        └── collect-news.yml
Install on GitHub
Open https://github.com/sayeefadnan986-bit/news and select the main branch.
Upload/replace the files and folders above, preserving their exact names and paths. Do not upload collect_feeds.py to the repository root; it must be scripts/collect_feeds.py.
Commit all files to main.
Open Settings → Pages and set Build and deployment → Source to GitHub Actions.
Open Actions → Collect and Deploy Pulse News → Run workflow.
Wait for a green Success status. If it fails, open the failed job and read the first actual error above the final exit code line.
How language switching works
The language selector changes the entire interface and selects data.articlesByLanguage.en or data.articlesByLanguage.bn. The collector makes separate Google News RSS searches using English and Bengali/Bangladesh locale parameters. It does not machine-translate English articles; it fetches separate language-targeted results. Search providers may occasionally return a story in a different language, so no RSS-based system can guarantee every publisher headline will match the chosen language.
Important reliability notes
GitHub Pages only hosts static files. Python runs in GitHub Actions, not in the visitor's browser.
The workflow verifies that the required files exist, validates feeds.json, compiles the Python collector, collects news, then deploys the site.
RSS providers may rate-limit or change feeds. The collector is designed to tolerate individual source failures, but a completely offline/provider-wide outage can leave the dataset empty or stale.
In Settings → Pages, choose GitHub Actions; otherwise this deploy workflow may not publish the site.
No API keys are required. News article content and rights remain with their publishers; the site links users to original articles.
