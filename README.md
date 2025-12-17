# Hypertrophy Research Tracker 🧠💪

A Chrome extension that automatically fetches, organizes, and presents the latest **hypertrophy-related medical research** from PubMed in a clean, searchable, and bookmarkable interface.

Designed as a real-world **product-grade browser extension**, not a demo.

---

## ✨ Features

- 🔄 **Automated PubMed Fetch**
  - Fetches latest resistance training & hypertrophy studies using NCBI E-utilities API
  - Runs in a background service worker (Manifest V3 compliant)

- 📚 **Clean Research Viewer**
  - Displays study title, journal, year, and abstract
  - One-click access to full PubMed articles

- 🔍 **Live Search**
  - Search across titles, abstracts, and journals
  - Instant filtering with no refetching

- 🎯 **Advanced Filters**
  - Filter by publication year
  - Filter by journal name

- ⭐ **Persistent Bookmarks**
  - Bookmark studies of interest
  - Stored locally using Chrome Storage API

- 🌙 **Dark Mode**
  - System-friendly dark/light theme toggle
  - Preference persisted across sessions

- 📌 **Sticky Header**
  - Always-accessible controls while scrolling

---

## 🧱 Architecture Overview

```
Chrome Extension (Manifest V3)
│
├── Background Service Worker
│   ├── Fetches PubMed IDs (JSON)
│   ├── Fetches article details (XML)
│   ├── Parses XML into structured objects
│   └── Stores processed data in chrome.storage
│
├── Popup UI
│   ├── HTML + CSS (theming, layout)
│   ├── JavaScript (stateful UI, filtering, search)
│   └── Reads data from chrome.storage
│
└── Storage
    ├── Cached research data
    ├── User bookmarks
    └── Theme preference

