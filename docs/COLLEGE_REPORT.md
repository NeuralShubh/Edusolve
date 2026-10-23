?# College Report — EduSolve AI

A report-style summary suitable for a project submission, viva or documentation file.

---

## 1. Project title

**EduSolve AI — AI-Based Solution System for Difficulties Faced by College Students While Using Online Educational Services**

---

## 2. Abstract

Indian college students interact with online scholarship, admission and examination portals every year. A large share of their time and money is lost to recurring, well-documented problems: OTP messages that never arrive, photographs rejected for wrong dimensions or excessive file size, documents refused because the extension or size is wrong, payments deducted with no receipt, forms whose submit button does nothing, and pages that lose everything on a refresh. Official help desks are frequently unreachable, and general search results are crowded by fraudulent agents who demand money for "guaranteed approval".

**EduSolve AI** is a bilingual (English + Marathi) web application that gives a student a clear, categorised, step-by-step answer to these problems. It detects the likely problem type from the student's own sentence using a transparent keyword-scoring engine, asks two short clarifying questions, and returns a structured answer containing probable causes, an ordered fix, prevention advice and an alternative route if the fix fails. Alongside the guidance, the app ships **genuinely functional browser tools**: a file extension and size validator that reads the real file metadata, and a Canvas-based photo and signature resizer that produces and downloads a real JPEG at the exact dimensions and size the portal demands. A **separate admin console** aggregates student Solved / Not Solved feedback, solved-rate analytics, a daily visit chart and per-category feature flags.

The project is deliberately **frontend-only**. There is no backend, no database and no external AI API. Every byte of student data stays in the student's own browser through `localStorage`, and every file operation runs on the user's own device. The result is a system that is fast, free to run, works offline, transparent enough to defend in an examination, and safe by construction.

---

## 3. Objectives

1. Identify and classify the recurring categories of difficulty faced by college students while using online educational services.
2. Provide an easy, jargon-free, step-by-step remedy for each identified category.
3. Offer practical utilities that genuinely reduce the friction of online form submission (file validation, image resizing, document checklists).
4. Support the target user base in their own language — English and Marathi, with a single toggle.
5. Collect structured feedback so that the effectiveness of each solution can be measured.
6. Guarantee privacy and safety: no credentials, no uploads, no server-side data collection.
7. Keep the system simple enough to demonstrate, deploy and explain within a college project.

---

## 4. Scope

### In scope
- 12 predefined problem categories with full bilingual solution content.
- A rule-based natural-language classifier for those categories.
- A conversational guidance flow with follow-up questions.
- A student dashboard with a category tab switcher, recents, saves and progress checklists.
- Six smart tools, of which two perform real local file processing.
- A standalone admin console with feedback analytics and content flags.
- Progressive Web App support (installable, offline app shell).
- Full English + Marathi localisation.

### Out of scope
- Any connection to a real government, university or payment website.
- Any real AI/LLM integration.
- Payment verification or transaction confirmation.
- Repairing or automating third-party portals.
- Real user accounts, authentication, or a shared database.
- Cloud analytics or cross-device synchronisation.

---

## 5. Technology selection and justification

| Layer | Chosen | Why |
|---|---|---|
| UI framework | **React 18** | Component model suits the reusable `SolutionCard` / `CategoryCard` widgets; hooks give the whole state layer without a library. |
| Build tool | **Vite 5** | Instant HMR, tiny config, native ESM, and it builds two independent apps from one dependency tree. |
| Routing | **react-router-dom 6** (`HashRouter`) | Hash routing lets one `dist/` work on GitHub Pages sub-paths, Vercel, Netlify and `file://` with no server rewrites. |
| Language | **JavaScript + JSX** | Fastest iteration for a student team; no TypeScript build step. |
| Styling | **Plain CSS with custom properties** | Full control over the design system with zero framework overhead; ~54 KB of CSS covers both apps. |
| Icons | **43 hand-written inline SVG** | No icon package, no network request, themeable via `currentColor`. |
| State | **React `useState` + `localStorage`** | The data volume is tiny; a global store would be over-engineering. |
| Language/i18n | **Plain object** | `STRINGS.en` / `STRINGS.mr` needs no dependency and can be handed to a Marathi translator as one file. |
| Image processing | **HTML5 Canvas** | Resizing and re-encoding stay on the device; no server, no upload, no cost. |
| Offline | **Service Worker + Web App Manifest** | Installable PWA that works on a weak connection at an exam hall or a rural campus. |

**Total runtime dependencies: 3.**

---

## 6. System architecture

```
┌──────────────────────── STUDENT APP (src/) ────────────────────────┐
│  LanguageProvider (en | mr, persisted)                            │
│      ↓                                                            │
│  HashRouter → Layout (Sidebar · Navbar · main · TabBar)           │
│      ↓                                                            │
│  ┌──────────┬───────────┬──────────┬──────────┐                   │
│  │  Home    │ Dashboard │  Solver  │  Tools   │                   │
│  └──────────┴─────┬─────┴────┬─────┴────┬─────┘                   │
│                   │           │          │                          │
│            categories.js  solverEngine.js  Canvas + File API      │
│                   └───────────┴──────────┘                          │
│                          │                                        │
│                    addFeedback()  ─────────────┐                   │
└────────────────────────────────────────────────┼───────────────────┘
                                                 │ localStorage
┌──────────────── ADMIN APP (admin-app/) ─────────▼─────────────────┐
│  Login (demo PIN 1234)                                            │
│  Overview · Feedback Inbox · Category Manager · Settings          │
│  Reads the same origin's localStorage                             │
└───────────────────────────────────────────────────────────────────┘
```

### Module responsibilities

| Module | Responsibility |
|---|---|
| `src/data/categories.js` | The content hub: 12 category descriptors, the full bilingual solution bank, and `detectCategory()`. |
| `src/engine/solverEngine.js` | Session lifecycle (`startSession`), content assembly (`buildSolution`) and the fallback (`fallbackSolution`). |
| `src/i18n/translations.js` | `STRINGS.en` / `STRINGS.mr` — 60 UI keys per language. |
| `src/context/LanguageContext.jsx` | Language state, persistence and `<html lang>` synchronisation. |
| `src/lib/store.js` | The only module that touches `localStorage` for cross-cutting data. |
| `src/components/ui.jsx` | Layout shell and the shared `SolutionCard` / `CategoryCard` widgets. |
| `src/components/PremiumUI.jsx` | `TabSwitcher` (a scrollable strip of tab buttons) and `Segmented` (a compact pill switcher) — the two selection controls used across the app — plus `Toast` / `useToast`. |
| `src/components/icons.jsx` | the 43-icon SVG set and the `<Icon>` renderer. |
| `src/pages/*` | The four student screens. |
| `admin-app/src/App.jsx` | Login gate, four admin panels and the admin language toggle. |

---

## 7. The classification algorithm

Given the input text `t` (lowercased):

```
best ← 'other';  bestScore ← 0
for each category c in CATEGORIES where c.id ≠ 'other':
    score ← 0
    for each keyword k in c.keywords:
        if t contains k (case-insensitive substring):
            score ← score + (|k| > 4 ? 2 : 1)
    if score > bestScore:
        bestScore ← score;  best ← c.id
return { id: best, confident: bestScore ≥ 2 }
```

**Properties**
- **Bilingual.** Every category carries Marathi keywords as well, so Marathi input is classified correctly.
- **Weighted.** Longer, more specific keywords score double, so `"payment"` (2) outranks a stray `"pay"` (1).
- **Explainable.** The winning keyword set can be printed for any input — no black box.
- **Safe fallback.** Zero matches → the `other` category, which still delivers a usable 5-step procedure.
- **Guarded.** Inputs under 4 characters are rejected with a rephrase prompt rather than guessed at.

**Accuracy note.** With the shipped keyword sets the detector resolves all 12 categories on their canonical example sentences and correctly separates common confusions (`payment` vs. `submission` vs. `file-size`). It is a demonstration of the technique, not an NLP benchmark.

---

## 8. Module description

### 8.1 Student site

| Page | Purpose | Key implementation |
|---|---|---|
| **Home** | Orientation and entry points | Hero, 4 quick actions, 4 popular categories (`CATEGORIES.slice(5, 9)`), a 3-step "How It Works", a 4-card feature grid, closing CTA |
| **Dashboard** | The problem library | A `TabSwitcher` listing all 12 categories as tabs, each labelled with the category's short bilingual name and icon; 12 `CategoryCard`s; the active `SolutionCard`; recents (max 6); saves; a 5-item checklist with a progress bar |
| **AI Problem Solver** | The conversational core | `handleUserText` → `startSession` → `detectCategory` → 2 `answerOption` steps → `finishSolution` → `buildSolution` → `SolutionCard`; 350 ms / 300 ms simulated thinking delays; auto-scrolling chat; 5 example prompts; Solved / Not Solved capture; deep link via `?q=` |
| **Project Report** | The graphical analytics report, rendered live inside the app | 6 KPI cards with sparklines; donut (solved vs pending), gauge (solve rate), stacked columns (solved per day), ranked bars (most frequent problems), per-type rate bars, cumulative area, weekly columns, source split bars; pending help-desk table and day-wise table; data-source and time-window switches; hand-written SVG charts in `src/components/Charts.jsx`; `@media print` stylesheet for Save-as-PDF; one-click Excel export — a dependency-free XLSX writer in `src/lib/xlsx.js` produces a 5-sheet workbook (`Summary`, `Daily`, `By Problem Type`, `By Source`, `Weekly`) from `src/data/reportSheets.js`, plus the full written document as Markdown |
| **Smart Tools** | Practical utilities | 6 tools chosen from a `TabSwitcher` of 6 tabs; `FileChecker` reads real `File.size` and `File.name` and compares them with the preset picked in a `Segmented` switcher; `PhotoResizer` draws to a Canvas with cover-crop, `imageSmoothingQuality: 'high'`, exports a real JPEG at the quality picked in a `Segmented` switcher and measures its true byte size; `Checklist` persists per-tool state under `tool_<id>` |

### 8.2 Admin console (separate app)

| Panel | Purpose |
|---|---|
| **Login** | Name + demo PIN `1234`; session persisted under `edusolve_admin` |
| **Overview** | 4 KPI cards, a 7-day CSS bar chart, recent feedback, an SVG donut gauge (`strokeDasharray`), and a source split |
| **Feedback Inbox** | Search, All/Solved/Open filter, clear-all with confirmation |
| **Category Manager** | Search the 12 categories, toggle a Featured flag per category |
| **Settings** | Session, local-data reset, build info, safety notice |

### 8.3 Content statistics

| Measure | Count |
|---|---|
| Problem categories | 12 |
| Solution blocks (causes + steps + prevention + alternative) | 12 per category set × 2 languages |
| Causes per category | 3 |
| Steps per category | 5 |
| Prevention tips per category | 2 |
| Follow-up questions per category | 2 (24 total) |
| Content strings (categories + solutions + follow-ups) | 180 per language → 360 total |
| UI translation keys | 60 × 2 languages |
| SVG icons | 43 |
| Smart Tools | 6 (2 with real file processing) |
| Runtime dependencies | 3 |

---

## 9. Data storage

All persistence uses `localStorage` under the `edusolve_` prefix.

| Key | Purpose |
|---|---|
| `edusolve_lang` | Student language (`en` / `mr`) |
| `edusolve_admin_lang` | Admin language |
| `edusolve_recent` | Recently viewed categories (max 6) |
| `edusolve_saved` | Saved solutions |
| `edusolve_checks` | Dashboard checklist state (5 booleans) |
| `tool_docprep`, `tool_formfill`, `tool_presubmit` | Tool checklist state |
| `edusolve_feedback` | Solved / Not Solved records (max 300) |
| `edusolve_featured` | Featured-category flags |
| `edusolve_visits_daily` | `{ 'YYYY-MM-DD': count }` |
| `edusolve_admin` | Admin demo session |

There is **no database and no server**. The trade-off is that data is per-browser and per-origin; a production version would require a backend API.

---

## 10. Testing

The project has no automated test suite; verification is manual and documented in [`DEVELOPMENT.md § 6`](DEVELOPMENT.md#6-testing-and-verification), which lists 22 checks for the student site and 10 for the admin console, plus a 12-step post-deployment checklist.

Manual verification performed includes:
- All 5 routes render; unknown routes fall back to Home.
- Language toggle switches all chrome and all content; the choice survives a reload.
- The detector resolves all 12 categories from their canonical example sentences, in both English and Marathi.
- File checker returns a correct verdict for both format and size, including the "fail" path.
- The resizer produces a real JPEG at the requested pixel dimensions with a correctly measured file size, and downloads with the filename `edusolve-<w>x<h>.jpg`.
- All checklist, save, recent and feedback state persists across reloads.
- The service worker registers in production builds and the app shell loads offline.
- Layouts adapt correctly at 375 px, 768 px and 1280 px.

---

## 11. Limitations and future scope

### Limitations
1. The classifier is keyword-based; an unusual phrasing that avoids every keyword falls back to `other`.
2. Feedback and visit analytics are per-browser, not real multi-user analytics.
3. The admin PIN is hard-coded for demonstration — no server-side authentication.
4. The resizer always cover-crops; it does not pad with letterbox bars.
5. The admin console and student site share data only when served from the same origin.
6. No automated regression tests.

### Future scope
1. **A real AI layer** — replace `detectCategory`/`buildSolution` with a hosted LLM while keeping the `SolutionCard` contract, so the UI needs no change.
2. **A lightweight backend** — a REST/GraphQL service plus a real database for shared feedback and cross-device analytics, with proper authentication for the admin console.
3. **More languages** — Hindi, Bengali, Telugu, Kannada, Malayalam, Gujarati, Punjabi, Odia, Urdu, plus RTL support.
4. **A 13th–20th category** and a category editor inside the admin console.
5. **Offline content sync** — a versioned JSON content pack cached by the service worker.
6. **A deadline tracker** — a calendar of scholarship and admission deadlines with local notifications.
7. **A "print-ready checklist" generator** — export a checklist as a PDF for a CSC centre.
8. **Per-college customisation** — institution-specific portal names, helpline numbers and file-size rules.
9. **Automated testing** — Vitest for the engine and store, Playwright for the end-to-end flows.
10. **Accessibility audit** — WCAG 2.1 AA verification and a screen-reader test pass.

---

## 12. Viva questions and answers

**Q1. Is this real AI?**
No. It is a rule-based natural-language classifier — a weighted keyword scorer with a deterministic scoring function, bilingual keyword sets and a confidence threshold. The project deliberately uses this so it runs offline, costs nothing, is fully explainable and is transparent about its own behaviour. The `SolutionCard` contract was designed so a real LLM could be dropped in later without touching the UI.

**Q2. Why is there no backend?**
To guarantee privacy and to keep the project deployable as a static site. All data lives in `localStorage`. The trade-off is that analytics are per-browser; the architecture document describes the API seam where a backend would attach.

**Q3. How does it know which problem the student has?**
It lowercases the input, then for each of the 11 scorable categories adds 1 point per matching keyword and 2 points per keyword longer than four characters. The highest-scoring category wins; a score of 2 or more is reported as confident. Marathi keywords are included so the same works in both languages.

**Q4. What actually works, versus what is just text?**
The file checker reads the real `File.size` and file extension through the File API and returns a genuine pass/fail verdict. The photo resizer genuinely decodes the image, redraws it to a Canvas at the target dimensions with cover-crop, re-encodes it as JPEG at a chosen quality, measures the true output byte size and offers a real download. The checklists genuinely persist. The solution content is curated guidance, not computation.

**Q5. Are student files uploaded anywhere?**
No. The File API is read locally, and the image processing happens on an on-page Canvas. There is no `fetch` to any server anywhere in `src/`.

**Q6. How is the privacy requirement enforced rather than just promised?**
Structurally: there is no server to send data to, no analytics script, no login, and no file-upload code path. The Solver sidebar and the admin Safety card state the rules in the UI itself.

**Q7. Why is the admin a separate application?**
So the student bundle contains no admin code and no admin navigation, and so the admin interface can be deployed on a restricted host independently. Both apps share the same `node_modules`, the same `package.json` and the same data modules through relative imports.

**Q8. Why hash routing?**
`HashRouter` lets a single `dist/` work on GitHub Pages sub-paths, Vercel, Netlify and even `file://`, without server rewrite rules. Combined with `base: './'`, one build deploys everywhere.

**Q9. How would you make the classification better?**
Add phrase matching and synonyms, weight rarer keywords higher, use a small bag-of-words similarity score against a corpus of example sentences per category, and — most effectively — retrain on the real feedback already being collected via the Solved / Not Solved buttons.

**Q10. What would a production version look like?**
A React client (this one) plus a small Node/Express API and a relational database; a proper authentication service for the admin console; an LLM-backed solver behind the existing `buildSolution` contract; multi-language content packs; and a service worker that syncs a versioned content pack for offline use.

---

## 13. Conclusion

EduSolve AI addresses a real, recurring and poorly-served problem for Indian college students with a solution that is simple enough to trust and complete enough to be useful. Its 12 bilingual problem categories, weighted keyword engine, genuinely functional file tools, measurable feedback loop and privacy-first architecture together form a coherent, demonstrable and defensible college project that is ready for deployment.
