?# EduSolve AI

**AI-Based Solution System for Difficulties Faced by College Students While Using Online Educational Services.**

A college project. **Frontend only.** No backend, no database, no real AI. A demo rule-based engine plus genuinely working in-browser file tools.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack — All Languages & Tools](#2-tech-stack--all-languages--tools)
3. [UI Languages Supported](#3-ui-languages-supported)
4. [Features](#4-features)
5. [The 12 Problem Categories](#5-the-12-problem-categories)
6. [Project Structure](#6-project-structure)
7. [Architecture & Data Flow](#7-architecture--data-flow)
8. [Getting Started](#8-getting-started)
9. [Build & Deploy](#9-build--deploy)
10. [The Admin Console](#10-the-admin-console)
11. [Data & Storage Reference](#11-data--storage-reference)
12. [Design System](#12-design-system)
13. [Safety, Privacy & Honesty Notes](#13-safety-privacy--honesty-notes)
14. [Limitations](#14-limitations)
15. [Documentation Index](#15-documentation-index)

---

## 1. Project Overview

### Problem statement

Indian college students regularly lose hours and money on online scholarship, admission and exam portals: OTPs that never arrive, forms that reject photos, documents rejected for being "too large", payments deducted with no receipt, and data wiped by a stray page refresh. Most of these problems are simple and well known — but the official help desks are unreachable, and search results are full of fraud agents.

### What EduSolve AI does

EduSolve AI gives the student a **clear, step-by-step, plain-language answer** for each of 12 recurring problem types, plus **real tools that actually work in the browser**:

| Layer | What it does |
|---|---|
| **Guidance engine** | Detects the problem category from the student's own sentence, asks 2 clarifying questions, then returns causes → steps → prevention → alternative. |
| **Smart Tools** | Real file size/format validation, a real Canvas-based photo & signature resizer with a working download, and persisted checklists. |
| **Student site** | Home, Dashboard (12 category tabs, recent, saved, progress), AI Solver (chat), Smart Tools. |
| **Admin console** | A **completely separate** React app: feedback inbox, solved-rate KPI, 7-day visit chart, category manager with feature flags, settings/data reset. |
| **Bilingual** | Full English + Marathi interface with a single toggle, persisted to `localStorage`. |

### Key non-goals (deliberate)

- It does **not** connect to any government or college website.
- It does **not** call any AI API. The "AI" is a transparent keyword-matching rule engine.
- It does **not** ask for passwords, OTPs, CVVs or bank PINs.
- It does **not** upload any file the student selects. All file work is local to the browser.
- It does **not** repair third-party sites or confirm that a payment succeeded.

---

## 2. Tech Stack — All Languages & Tools

### Programming languages used

| Language | Where it is used | Notes |
|---|---|---|
| **JavaScript (ES2022)** | All application logic — `src/`, `admin-app/src/`, all `vite.config.js` files | Written in JSX (`.jsx` files). `package.json` declares `"type": "module"` so everything is an ES module. |
| **JSX** | Every React component file (`.jsx`) | React 18's JSX transform — no `import React` required except where hooks are used directly. |
| **CSS** | `src/index.css` (34.4 KB, student site), `admin-app/src/admin.css` (19.7 KB, admin) | Plain modern CSS with CSS custom properties. **No CSS framework, no Tailwind, no Sass.** |
| **HTML** | `index.html`, `admin-app/index.html` | Minimal shells with an inline SVG data-URI favicon. |
| **JSON** | `package.json`, `package-lock.json`, `vercel.json`, `public/manifest.webmanifest`, `public/*.webmanifest` | Web App Manifest for PWA install. |
| **Batch (Windows)** | `start-edusolve.bat` | One-click dev launcher for Windows users. |
| **JavaScript (Service Worker)** | `public/sw.js` | Offline-first app shell + runtime caching. |

### Frameworks & libraries

| Package | Version | Purpose |
|---|---|---|
| `react` | `^18.3.1` | UI runtime for both apps. |
| `react-dom` | `^18.3.1` | DOM renderer. |
| `react-router-dom` | `^6.23.1` | Routing (student site uses `HashRouter`). |
| `vite` | `^5.4.8` (dev) | Dev server + production bundler for both apps. |
| `@vitejs/plugin-react` | `^4.3.3` (dev) | React Fast Refresh + JSX transform. |

**Total runtime dependencies: 3.** No UI library, no icon package (43 hand-written inline SVG icons), no state library, no HTTP client, no date library.

### Browser APIs used (no libraries needed)

| API | Used for | Where |
|---|---|---|
| `localStorage` | All persistence (language, saves, recents, checklists, feedback, visits, flags, admin session) | `src/lib/store.js`, `src/pages/*` |
| `URL.createObjectURL` | Preview the selected photo without uploading it | `src/pages/Tools.jsx:119` |
| `<canvas>` + `toDataURL('image/jpeg', q)` | Real photo/signature resizing and encoding | `src/pages/Tools.jsx:122-140` |
| `File.size` / `File.name` | Real file size + extension validation | `src/pages/Tools.jsx:79-85` |
| `navigator.serviceWorker` | Offline PWA support (production builds only) | `src/main.jsx:12-16` |
| `navigator.onLine`-free `fetch` | Service-worker runtime caching | `public/sw.js` |
| `Intl` / `toLocaleDateString` | Admin date chips | `admin-app/src/App.jsx:363` |

### Web fonts (loaded from Google Fonts CDN)

`Sora` (600/700/800, headings) · `Manrope` (400–800, body) · `Noto Sans Devanagari` (400–700, Marathi) — with `Segoe UI` / `system-ui` fallbacks.

---

## 3. UI Languages Supported

The interface ships in **two languages**, toggled by one button in the navbar, sidebar, mobile menu and mobile tab bar.

| Code | Language | Script | Coverage |
|---|---|---|---|
| `en` | English | Latin | 100% — every UI string, every category, every solution |
| `mr` | मराठी (Marathi) | Devanagari | 100% — every UI string, every category, every solution |

- Toggle state is stored in `localStorage` under **`edusolve_lang`**.
- `document.documentElement.lang` is set to `en`/`mr` on every change, so screen readers and the browser's translation prompt follow the right language.
- The admin console has its **own independent** language toggle stored under **`edusolve_admin_lang`** (so an admin can run it in Marathi while the student site stays in English).
- Marathi content is written in **simple, spoken-level Marathi** — deliberately, so a first-year student can act on it without translating jargon.

### Adding a third language (Hindi, Bengali, etc.)

The i18n system is a plain object — no library, no build step. See [`docs/LANGUAGES.md`](docs/LANGUAGES.md) for the full 6-step recipe with code.

---

## 4. Features

### 4.1 Student site (`/`)

| Route | Page | What it contains |
|---|---|---|
| `/` | **Home** | Hero + CTA, 4 quick-action cards, Popular categories (4), How It Works (3 steps), Features (4), closing CTA banner |
| `/dashboard` | **Dashboard** | Category tab switcher (12 tabs), 12 category cards, active solution panel, Recently viewed (max 6), Saved solutions, 5-item task checklist with progress % |
| `/solver` | **AI Problem Solver** | Chat interface with keyword detection, 2 follow-up questions, structured solution card, 5 one-click example prompts, Solved / Not Solved feedback, save, clear |
| `/tools` | **Smart Tools** | Tool tab switcher (6 tabs) + 6 tools (see below) |
| `/report` | **Project Report** | A fully graphical analytics report — solved / pending / most-frequent / per-day charts, KPI cards and tables, print-to-PDF, Excel export |
| `*` | Home | Any unknown route falls back to Home |

### 4.2 Smart Tools (the parts that genuinely work)

Pick a tool from the **tab switcher** at the top of the page — six tabs, nothing to type. Inside a tool, small choices (the file preset, the photo quality) are made with a compact **segmented switcher**.

| Tool | Real or informational? | What it does |
|---|---|---|
| **Document preparation checklist** | Real, persisted | 5 bilingual items, per-item checkboxes, progress bar, saved under `tool_docprep` |
| **File extension and size checker** | **Real** | Reads the actual file's `name` + `size` from the File API, validates the extension against the preset picked in the **Preset** switcher and the size against that preset's limit, prints a pass/fail verdict. Nothing is uploaded. |
| **Photo & signature guidance + resizer** | **Real** | Loads the image via `URL.createObjectURL`, draws it to a `<canvas>` with cover-crop, `imageSmoothingQuality: 'high'`, exports real JPEG at the quality picked in the **Quality** switcher (0.6 / 0.8 / 0.92), measures the true output size in KB, and offers a genuine **Download resized JPG** link (`edusolve-{w}x{h}.jpg`). Warns when the output is upscaled and therefore soft. |
| **Form-filling checklist** | Real, persisted | 5 bilingual items, `tool_formfill` |
| **Pre-submission verification** | Real, persisted | 5 bilingual items, `tool_presubmit` |
| **Required-document checklist** | Session-only | 3 services (Scholarship / Admission / Exam) with 5–8 documents each; switching service resets the check state |

### 4.3 The Project Report section (`/report`)

A **graphical** analytics report built into the app, driven by **real recorded data** — every number on the page is a chart, a KPI card or a table built from actual problem reports, never from a sample dataset.

The page opens with a **slim toolbar** (the data-source switch, a fixed "last 15 days" pill, Refresh, Print and the two downloads) — there is no long text header, so the report starts straight with the numbers. On open it syncs live data from the EduSolve API and shows a colour-coded sync status (loading / live / offline). The report only ever covers **the last 15 days, up to today**.

| Chart / card | What it shows |
|---|---|
| **KPI cards (6)** | Problems reported · Problems solved · Problems pending · Solve rate % · Solved per day · Most frequent problem — each with a sparkline where a trend exists |
| **Solved vs pending (donut)** | Share of every reported problem, with the exact solved / pending / total counts |
| **Solve rate (gauge)** | Radial speedometer plus best day, busiest day, solved-day streak and daily average |
| **Problems solved in one day (stacked columns)** | Day-by-day solved (green) on top of still-pending (amber), with the total above every column |
| **Most frequently generated problems (bars)** | All 12 problem types ranked by how often they come up, each bar split into solved / pending |
| **Solve rate by problem type (bars)** | Percentage closed per problem type, colour-coded green / amber |
| **Cumulative problems solved (area)** | Running total of solved problems across the window |
| **Weekly comparison (columns)** | Solved vs pending, week over week |
| **Where problems are reported from (split bars)** | AI Problem Solver vs Dashboard, with counts and rate |
| **Pending problems — help desk list (table)** | Problem types with the biggest open queue |
| **Day-wise result (table)** | Solved, pending, total and rate for every single day |

| Control | What it does |
|---|---|
| **Data source** | `All data` (everything synced from the server + this browser) · `This device` (only what you recorded here) |
| **Time window** | Fixed at the **last 15 days** (15 days ago → today) — shown as a pill in the toolbar, not a switcher |
| **Refresh data** | Re-pulls the latest reports and visits from the EduSolve API |
| **Print / Save as PDF** | A dedicated `@media print` stylesheet strips the navbar, sidebar and tab bar and lays the charts out on A4 |
| **Download Excel (.xlsx)** | Downloads the current report as a real Excel workbook with 5 sheets — `Summary`, `Daily`, `By Problem Type`, `By Source`, `Weekly`. Numbers stay numeric so they can be summed, columns are sized, the header row is frozen and every label is in the language you are viewing. |
| **Full document (.md)** | Downloads the long written project document that lives in `docs/` |

The long-form written document is still available as a one-click Markdown export, and the chart code lives in `src/components/Charts.jsx` — hand-written SVG, **no chart library and no new dependency**.

The Excel workbook is produced by `src/lib/xlsx.js` — a **dependency-free XLSX writer**: it builds the ZIP container and the OOXML parts by hand (CRC-32, stored entries, inline strings, frozen header row, column widths, merged title row), so the app still ships with 3 runtime dependencies and works fully offline. `src/data/reportSheets.js` turns the analytics model into the 5 sheet definitions.

The data is produced by `src/data/analytics.js` over **real reports only**: the Report page calls `pullFromServer({ days: 30 })` (`src/lib/store.js`), which fetches `GET /api/feedback?days=…` and `GET /api/visits?days=…` from the Express/Supabase API and caches them in `localStorage`, merged with this browser's own entries. `buildAnalytics({ scope, days })` then windows and aggregates them client-side — no seeded sample data anywhere.


### 4.4 File size presets (built into the checker)

Pick one from the **Preset** switcher inside the file checker.

| Preset | Allowed extensions | Max size |
|---|---|---|
| `pdf200` — PDF for scholarship docs | `pdf` | 200 KB |
| `img50` — Passport photo JPG | `jpg`, `jpeg` | 50 KB |
| `sign30` — Signature JPG | `jpg`, `jpeg` | 30 KB |
| `img200` — General image | `jpg`, `jpeg`, `png` | 200 KB |

### 4.5 The guidance engine (the "AI")

A transparent, rule-based classifier — no neural network, no API call.

```
User sentence
      │
      ▼
lowercase + tokenise
      │
      ▼
for each of 11 categories (excluding "other"):
    score += 1 per keyword hit
    score += 2 per keyword hit longer than 4 characters
      │
      ▼
highest score wins  →  confident = (score ≥ 2)
      │
      ▼
ask follow-up question #1 → answer → follow-up question #2 → answer
      │
      ▼
render SolutionCard: causes · steps · prevention · alternative
      │
      ▼
student marks Solved / Not Solved → written to the admin feedback inbox
```

- **Keywords are bilingual.** Each category carries English *and* Marathi keywords, so a student typing Marathi is classified correctly.
- **Longer keywords score higher**, so `"payment"` (2 points) beats a stray `"pay"` (1 point).
- **No match → `other`** → the fallback solution, which asks the student to rewrite the issue, take a screenshot, and visit the college office / CSC.
- **Inputs under 4 characters** are rejected with the "rewrite in one line" prompt instead of guessing.

### 4.6 Cross-cutting features

- **Visit tracking** — one visit is counted per page load, per day, under `edusolve_visits_daily`.
- **Feedback capture** — every Solved / Not Solved click is recorded with title, verdict (`solved`/`unsolved`), source (`dashboard`/`solver`) and timestamp. Capped at 300 records.
- **PWA** — installable on Android/Windows/iOS, offline app shell via `public/sw.js`.
- **Responsive** — mobile-first with a bottom tab bar (centre FAB on Solver), a left sidebar from 961 px, and a tablet layout from 768 px.
- **Zero-emoji, zero-image icons** — 43 hand-drawn inline SVG icons in `src/components/icons.jsx`, all `stroke`-style and `currentColor`-driven.

---

## 5. The 12 Problem Categories

Defined in `src/data/categories.js`. Each has an `id`, `icon`, bilingual `title`, a bilingual `short` label (the compact name used by the Dashboard tab switcher), bilingual `desc`, and a bilingual `keywords` array. Each also has a full solution set: bilingual `causes`, `steps`, `prevention`, `alternative` and two bilingual `followups`.

| # | id | Icon | Title (EN) | Title (MR) |
|---|---|---|---|---|
| 1 | `internet` | `globe` | Internet Connectivity Problems | इंटरनेट कनेक्टिव्हिटी समस्या |
| 2 | `server` | `server` | Website Loading and Server Errors | वेबसाइट लोडिंग व सर्व्हर त्रुटी |
| 3 | `otp` | `lock` | Login and OTP Problems | लॉगिन व OTP समस्या |
| 4 | `password` | `key` | Forgotten Password | पासवर्ड विसरणे |
| 5 | `form-entry` | `edit` | Form Instructions and Information Entry | फॉर्म सूचना व माहिती भरणे |
| 6 | `doc-upload` | `upload` | Document Upload Problems | कागदपत्र अपलोड समस्या |
| 7 | `file-size` | `box` | File Size and Format Problems | फाइल आकार व प्रकार समस्या |
| 8 | `photo` | `photo` | Photo and Signature Upload Problems | फोटो व सही अपलोड समस्या |
| 9 | `payment` | `card` | Payment Failures | पेमेंट अयशस्वी |
| 10 | `submission` | `checkcircle` | Form Submission Failures | फॉर्म सबमिशन अयशस्वी |
| 11 | `reload` | `refresh` | Form Reload and Reset Problems | फॉर्म रीलोड व रीसेट समस्या |
| 12 | `other` | `bulb` | Other Educational Service Problems | इतर शैक्षणिक सेवा समस्या |

Each category ships with **3 causes, 5 steps, 2 prevention tips, 1 alternative and 2 follow-up questions** in both languages — 15 strings per category per language, 180 per language, 360 in total.

---

## 6. Project Structure

```
Taniya/                          ← repository root (project folder name)
├── index.html                   Student site HTML shell
├── package.json                 Workspace manifest + npm scripts
├── package-lock.json
├── vite.config.js               Student site Vite config (base: './')
├── vercel.json                  SPA rewrite for Vercel
├── start-edusolve.bat           One-click Windows dev launcher
├── README.md                    This file
├── .gitignore
│
├── public/                      Static assets copied verbatim to dist/
│   ├── manifest.webmanifest     PWA manifest
│   ├── sw.js                    Service worker (cache 'edusolve-v5')
│   ├── pwa-192.png              PWA icon 192×192
│   ├── pwa-512.png              PWA icon 512×512
│   ├── maskable-512.png         Maskable PWA icon 512×512
│   └── apple-touch-icon.png     iOS home-screen icon
│
├── src/                         ── STUDENT APP ──
│   ├── main.jsx                 React root + service-worker registration
│   ├── App.jsx                  LanguageProvider → HashRouter → Layout → Routes
│   ├── index.css                Student design system + all component styles
│   ├── components/
│   │   ├── icons.jsx            46 inline SVG icons + <Icon> component
│   │   ├── ui.jsx               Layout, Navbar, Sidebar, MobileMenu,
│   │   │                        MobileTabBar, Logo, CategoryCard, SolutionCard
│   │   ├── PremiumUI.jsx        TabSwitcher + Segmented (tab / pill switchers), Toast, useToast
│   │   └── Charts.jsx           Hand-written SVG charts: Donut, Column, Area,
│   │                            BarList, SplitBar, Sparkline, Gauge, Legend
│   ├── context/
│   │   └── LanguageContext.jsx  en/mr provider + useLang() hook
│   ├── data/
│   │   ├── categories.js        12 categories (id, icon, title, short, desc, keywords)
│   │   │                        + full solution bank + detectCategory()
│   │   ├── report.js            Project report content, live stats, storage + design tables
│   │   ├── analytics.js         Real-data report aggregates (fixed 15-day window)
│   │   ├── reportSheets.js      Analytics → 5 Excel sheet definitions (bilingual)
│   │   └── reportExport.js      Markdown export of the written document
│   ├── engine/
│   │   └── solverEngine.js      startSession / buildSolution / fallbackSolution
│   ├── i18n/
│   │   └── translations.js      STRINGS.en + STRINGS.mr (62 keys each)
│   ├── lib/
│   │   ├── store.js             localStorage helpers (admin, feedback, visits)
│   │   └── xlsx.js              Dependency-free XLSX writer (ZIP + OOXML, no npm dep)
│   └── pages/
│       ├── Home.jsx             Hero, popular, how-it-works, features, CTA
│       ├── Dashboard.jsx        Category tabs, solution, recent, saved, checklist
│       ├── Solver.jsx           Chat flow, follow-ups, solution card, feedback
│       ├── Tools.jsx            6 tools in a tab switcher incl. real file checker + canvas resizer
│       └── Report.jsx           Graphical analytics report — KPI cards, charts, tables
│
├── admin-app/                   ── SEPARATE ADMIN APP ──
│   ├── index.html               Admin HTML shell (noindex, no PWA)
│   ├── vite.config.js           root=admin-app, base='./', outDir=../dist-admin
│   └── src/
│       ├── main.jsx             React root (separate entry from the student app)
│       ├── App.jsx              Login, Overview, FeedbackInbox, CategoriesAdmin, SettingsAdmin
│       └── admin.css            Admin design system + panels, KPI cards, chart, ring gauge
│
├── dist/                        Built student app (git-ignored)
└── dist-admin/                  Built admin app (git-ignored)
```

> The admin app **imports** `src/data/categories.js`, `src/components/icons.jsx` and `src/lib/store.js` from the student app via relative paths (`../../src/...`). It shares the same `node_modules` and the same `package.json`.

---

## 7. Architecture & Data Flow

```
┌──────────────────────── STUDENT APP ────────────────────────┐
│                                                             │
│  LanguageProvider (en|mr)                                  │
│        │  provides { lang, setLang, toggle }                 │
│        ▼                                                    │
│  HashRouter                                                 │
│   ├─ /            → Home                                    │
│   ├─ /dashboard   → Dashboard ─┐                            │
│   ├─ /solver      → Solver ───┤                             │
│   └─ /tools       → Tools      │                             │
│                            │  │                              │
│                     detectCategory()  ◄── src/data/categories.js
│                            │  │                              │
│                            │  └── SOLUTIONS → SolutionCard  │
│                            ▼                                │
│                      addFeedback() ──────────┐               │
└─────────────────────────────────────────────┼───────────────┘
                                              │
┌──────────────────────── ADMIN APP ──────────▼───────────────┐
│  Login (demo PIN 1234) → Overview / Feedback / Categories /   │
│  Settings  — all read the SAME localStorage origin          │
└─────────────────────────────────────────────────────────────┘
```

- **Routing**: `HashRouter` (`#/dashboard`) so the built `dist/` works on any static host or sub-path — GitHub Pages (`/Edusolve/`), Vercel, Netlify — with no server rewrite rules needed.
- **Layout**: `Layout` renders `Sidebar` (desktop) + `Navbar` + `<main>` + `MobileTabBar` (mobile) around every route.
- **State**: React `useState`/`useMemo`/`useRef` only. No Redux, no Context besides `LanguageContext`.
- **Data flow for a solution**: `Solver` → `startSession(text)` → `detectCategory()` → 2 × `answerOption()` → `finishSolution()` → `buildSolution(categoryId, lang)` → `<SolutionCard>`.
- **Deep links**: Dashboard → Solver via `?q=<encoded title>`; Solver reads `?q=` on mount and auto-runs it.
- **Feedback loop**: `Solved`/`Not Solved` → `addFeedback()` → `edusolve_feedback` → admin console reads it on the same browser origin.

See [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) for the full module-by-module breakdown.

---

## 8. Getting Started

### Prerequisites

- **Node.js 18+** (check with `node -v`)
- **npm 9+** (bundled with Node 18+)
- A modern browser: Chrome / Edge / Firefox / Safari

### Install & run the student site

```bash
npm install
npm run dev
```

Vite prints the local URL — normally **http://localhost:5173**.

### Windows one-click

Double-click **`start-edusolve.bat`**. It changes to the project folder and runs `npm run dev -- --port 5173 --host localhost`. Keep the window open.

### Run the admin console (in a second terminal)

```bash
npm run dev:admin
```

The admin Vite config has no explicit port, so Vite picks the next free port (typically **5174**). Use the URL Vite prints.

> Because both apps read the same `localStorage` **origin**, the admin console shows the student site's real feedback only when it is served from the **same host and port** as the student site. On different ports they are different origins and will show independent (seeded) data. See [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md) → "Admin console origin note".

### All npm scripts

| Script | Command | Output / Port |
|---|---|---|
| `npm run dev` | `vite` | Dev server at `http://localhost:5173` |
| `npm run build` | `vite build` | `dist/` |
| `npm run preview` | `vite preview` | Serves the built `dist/` |
| `npm run dev:admin` | `vite --config admin-app/vite.config.js` | Admin dev server (auto port) |
| `npm run build:admin` | `vite build --config admin-app/vite.config.js` | `dist-admin/` |

---

## 9. Build & Deploy

### Production build

```bash
npm run build          # student app → dist/
npm run build:admin    # admin app   → dist-admin/
```

Both configs use `base: './'` (relative asset paths), so the output works from a domain root **and** from a sub-folder.

### Deploy the student site

**Vercel (recommended)**
1. Import the GitHub repo at [vercel.com](https://vercel.com).
2. Framework preset: **Vite**. Build command: `npm run build`. Output directory: `dist`.
3. `vercel.json` already rewrites all routes to `/` for the SPA.
4. No environment variables are needed.

**GitHub Pages**
1. `npm run build`.
2. Push `dist/` to the `gh-pages` branch (this repo already has a `gh-pages` branch).
3. Enable Pages → branch `gh-pages`, folder `/` (root).
4. Because `base: './'` and routing is hash-based, no custom domain or path fix is required.

**Netlify / Firebase / any static host**
- Build command `npm run build`, publish directory `dist`, no rewrites needed (hash routing).

### Deploy the admin console

Build with `npm run build:admin` → publish `dist-admin/` as a **separate static site**. Keep it on a different hostname from the student site so it can be access-restricted (Vercel Password Protection, Netlify Basic Auth, or Cloudflare Access).

### Live site

**https://neuralshubh.github.io/Edusolve/** — the published `dist/` from the `gh-pages` branch.

---

## 10. The Admin Console

A **completely separate** React + Vite application in `admin-app/`, built to a separate `dist-admin/` output. It was split out of the student site (commit `03b17af`) so it never appears in the student navigation.

### Sign-in

Name + demo PIN **`1234`**. The session is written to `localStorage` under `edusolve_admin` as `{ name, at }`. There are no real accounts and no server-side authentication — this is a **demo cabinet**.

### Tabs

| Tab | Contents |
|---|---|
| **Overview** | 4 KPI cards (feedback entries, solved rate %, category count, 7-day visits), a 7-day CSS bar chart of daily visits, a recent-feedback panel, a solved-vs-open donut gauge (SVG `strokeDasharray`), and a source split (Dashboard / Solver). |
| **Feedback** | The full feedback inbox. Search by title, filter by All / Solved / Open, and clear all entries (with a confirm step). |
| **Categories** | Category manager: search the 12 categories and flip a **Featured** flag on each. Flags persist under `edusolve_featured`. |
| **Settings** | Session card (shows the signed-in admin name + logout), local data reset (`clearAllAppData()` — clears every `edusolve_*` key except the language), build info, and a safety reminder. |

### Seed data

If the feedback store is empty, `seedOnce()` injects 5 realistic demo feedback entries (2 hours to 44 hours old) so the dashboard is never empty during a presentation. Real feedback immediately appends to the same list.

---

## 11. Data & Storage Reference

Everything lives in `localStorage` under the `edusolve_` prefix. Nothing is ever sent to a server.

| Key | Written by | Shape | Purpose |
|---|---|---|---|
| `edusolve_lang` | `LanguageContext` | `"en"` \| `"mr"` | Student-site language |
| `edusolve_admin_lang` | admin `App.jsx` | `"en"` \| `"mr"` | Admin language |
| `edusolve_recent` | Dashboard, Solver | `[{ id, at }]` | Recently viewed categories (max 6) |
| `edusolve_saved` | Dashboard, Solver | `[categoryId]` | Saved solutions |
| `edusolve_checks` | Dashboard | `[bool × 5]` | Dashboard task checklist state |
| `tool_docprep` / `tool_formfill` / `tool_presubmit` | Tools | `[index]` | Smart Tools checklist state |
| `edusolve_feedback` | `addFeedback()` | `[{ id, title, verdict, source, at }]` | Solved / Not Solved records (max 300) |
| `edusolve_featured` | admin | `[categoryId]` | Featured-category flags |
| `edusolve_visits_daily` | `trackVisit()` | `{ "YYYY-MM-DD": count }` | Daily visit counter |
| `edusolve_admin` | `adminLogin()` | `{ name, at }` | Admin demo session |
| — | Tools (`RequiredDocs`) | not persisted | Required-docs check state resets on reload |

`clearAllAppData()` removes every `edusolve_*` key **except** `edusolve_lang`.

---

## 12. Design System

Shared tokens live at the top of `src/index.css` and `admin-app/src/admin.css`.

| Token | Student | Admin |
|---|---|---|
| `--paper` | `#f6f5f2` | `#f6f5f2` |
| `--card` | `#ffffff` | `#fff` |
| `--ink` / `--text` | `#15171e` / `#1a1d26` | same |
| `--muted` | `#6e7180` | `#6e7180` |
| `--line` / `--line-soft` | `#e6e4df` / `#eeece7` | same |
| `--accent` | `#6d28d9` (violet) | `#6d28d9` |
| `--accent-deep` | `#5b21b6` | `#5b21b6` |
| `--accent-soft` | `#f5f3ff` | `#f5f3ff` |
| `--accent-line` | `#ddd6fe` | `#ddd6fe` |
| `--radius` / `--radius-sm` / `--radius-card` | `14px` / `10px` / `20px` | `16px` / `11px` / — |
| `--shadow-sm` / `--shadow` / `--shadow-lg` | 3 elevation levels | 2 levels |
| `--green` / `--amber` (status) | — | `#15803d` / `#b45309` |

**Breakpoints** (mobile-first):
- base — phone (bottom tab bar, centred FAB)
- `@media (min-width: 600px)` — small tablets
- `@media (min-width: 768px)` — tablets
- `@media (min-width: 961px)` — desktop (left sidebar appears, tab bar hides)
- Admin: `@media (min-width: 960px)` and a `960–1100px` compaction for the feedback table grid.

---

## 13. Safety, Privacy & Honesty Notes

These are enforced in the UI, not just described:

1. **Never asks for passwords, OTPs, CVVs or bank PINs.** Stated in the Solver sidebar and the admin Safety card.
2. **Files are never uploaded.** The File API is read locally; the resizer works entirely on a `<canvas>`.
3. **No backend, no database, no analytics, no tracking server.** `localStorage` only.
4. **No login for students.** The student site requires no account.
5. **The demo nature is disclosed.** The Solver panel shows: *"Guidance is simulated for learning. EduSolve does not connect to real AI or any government or college website."*
6. **Payment advice is conservative.** For deducted money the app says to check your bank/UPI app and contact the official helpline with the UTR — it never claims a payment succeeded.
7. **Anti-fraud guidance.** The `other` category explicitly warns: *"Never pay agents who promise 'guaranteed approval'. Use only official links."*
8. **Admin app is `noindex`** and should be deployed on a restricted host.

---

## 14. Limitations

- The "AI" is keyword matching — it will not understand a novel phrasing that avoids every listed keyword (it falls back to `other`, which still gives a useful answer).
- Feedback and visit stats are per-browser, per-origin. They are not real analytics.
- The admin PIN `1234` is hard-coded in `admin-app/src/App.jsx:40` for demonstration only. A production system needs server-side auth.
- The photo resizer always covers (crops) the source to the target aspect ratio; it does not pad with letterbox bars.
- There is no automated test suite. Verification is manual.
- The admin console and the student site share data only when served from the same origin.

---

## 15. Documentation Index

| Document | Contents |
|---|---|
| [`README.md`](README.md) | This file — the master overview |
| [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) | Module-by-module breakdown, data flow, state model, extension points |
| [`docs/LANGUAGES.md`](docs/LANGUAGES.md) | Every language in the project, how i18n works, how to add Hindi/Bengali/etc. |
| [`docs/API_REFERENCE.md`](docs/API_REFERENCE.md) | Every exported function, component, constant and prop |
| [`docs/DEVELOPMENT.md`](docs/DEVELOPMENT.md) | Setup, scripts, adding a category, adding a tool, adding a language, adding an icon |
| [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md) | Vercel, GitHub Pages, Netlify, PWA, admin deployment, troubleshooting |
| [`docs/USER_GUIDE.md`](docs/USER_GUIDE.md) | End-user guide for students and for the admin operator |
| [`docs/COLLEGE_REPORT.md`](docs/COLLEGE_REPORT.md) | Project abstract, objectives, scope, module description, future scope, viva Q&A — also rendered live inside the app at `#/report` |

---

**EduSolve AI** · Step-by-Step Student Guidance · College project demo
Repository: `https://github.com/NeuralShubh/Edusolve` · Live: `https://neuralshubh.github.io/Edusolve/`
