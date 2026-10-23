?# Architecture — EduSolve AI

A deep, module-by-module description of how EduSolve AI is put together.

---

## 1. Design principles

1. **Zero server.** No API calls, no database, no telemetry. The whole product is static files.
2. **Rule-based, not magic.** The "AI" is a deterministic keyword scorer. Every answer is traceable to a category in `src/data/categories.js`.
3. **Local-first privacy.** Files are read through the File API and processed in-page. Nothing leaves the device.
4. **One shared source of truth.** The admin console imports the student app's data modules directly, so both always agree on categories, icons and storage keys.
5. **Mobile-first.** Base CSS is the phone layout; breakpoints only add to it.

---

## 2. Two applications, one repository

| | Student app | Admin app |
|---|---|---|
| Source root | `src/` | `admin-app/` |
| Vite config | `vite.config.js` | `admin-app/vite.config.js` |
| Entry HTML | `index.html` | `admin-app/index.html` |
| Entry JS | `src/main.jsx` | `admin-app/src/main.jsx` |
| Router | `HashRouter` (react-router-dom) | None (local `useState` tab switch) |
| Language | `edusolve_lang` via `LanguageContext` | `edusolve_admin_lang` via local `useState` |
| Styles | `src/index.css` | `admin-app/src/admin.css` |
| Output | `dist/` | `dist-admin/` |
| Dev script | `npm run dev` | `npm run dev:admin` |
| PWA | Yes (manifest + service worker) | No (`noindex`) |

They share:
- `node_modules` and the root `package.json`
- `src/data/categories.js`
- `src/components/icons.jsx`
- `src/lib/store.js`

---

## 3. Student app — module graph

```
main.jsx
 ├── React.StrictMode
 ├── App
 │    ├── LanguageProvider (context/LanguageContext.jsx)
 │    └── HashRouter
 │         └── Layout (components/ui.jsx)
 │              ├── Sidebar
 │              ├── Navbar ── Logo, MobileMenu
 │              ├── <main>{routes}</main>
│              │    ├── Home      (pages/Home.jsx)
│              │    ├── Dashboard (pages/Dashboard.jsx)
│              │    ├── Solver    (pages/Solver.jsx)
│              │    ├── Tools     (pages/Tools.jsx)
│              │    └── Report    (pages/Report.jsx)
 │              └── MobileTabBar
 └── serviceWorker.register('sw.js')   [production only]
```

### 3.1 `src/main.jsx`
- Mounts `<App />` into `#root` with `React.StrictMode`.
- Registers the service worker **only** when `import.meta.env.PROD` is true, and swallows registration errors with `.catch(() => {})` so a missing `sw.js` never breaks the app.

### 3.2 `src/App.jsx`
- Wraps everything in `LanguageProvider` → `HashRouter` → `Layout`.
- Routes: `/`, `/dashboard`, `/solver`, `/tools`, `/report`, `*` → `Home`.
- `HashRouter` was chosen deliberately: the same `dist/` works on GitHub Pages sub-paths, Vercel, Netlify and `file://` with zero server configuration.

### 3.3 `src/context/LanguageContext.jsx`
```js
const LanguageContext = createContext({ lang: 'en', setLang: () => {}, toggle: () => {} })
```
- Initial state: `localStorage.getItem('edusolve_lang') || 'en'`, wrapped in `try/catch` (private-mode browsers can throw on `localStorage` access).
- `useEffect` writes the value back and sets `document.documentElement.lang` to `'mr'` or `'en'`.
- `toggle()` flips `en ↔ mr`.
- Exported hook: `useLang()` → `{ lang, setLang, toggle }`.

### 3.4 `src/i18n/translations.js`
- A single exported object `STRINGS` with exactly two branches, `en` and `mr`.
- 60 keys per language, e.g. `nav_home`, `hero_title_a`, `feat_3_t`, `dash_sub`.
- Consumed as `const t = STRINGS[lang]`.
- Several components still inline `lang === 'mr' ? '…' : '…'` for strings that are more readable as inline conditionals (category list headers, admin labels).

### 3.5 `src/components/icons.jsx`
- 43 icon definitions in a `PATHS` object, each a JSX fragment of `<path>` / `<circle>` / `<rect>` elements.
- `<Icon name size strokeWidth className />` renders a `<span className="icon">` wrapper containing a 24×24 `viewBox` SVG with `fill="none" stroke="currentColor"`.
- Unknown names fall back to `PATHS.bulb`, so a typo never renders an empty box.

Icon inventory: `globe, server, lock, key, edit, upload, box, photo, card, checkcircle, refresh, bulb, home, grid, chat, wrench, info, search, languages, menu, rocket, compass, check, x, heart, alert, shield, download, scissors, sparkles, history, bookmark, target, cpu, eye, listcheck, folder, send, bot, trash, help, gradcap, chevron`.

### 3.6 `src/components/ui.jsx`
| Export | Purpose |
|---|---|
| `Logo` | Home link with the graduation-cap mark and the "EduSolve **AI**" wordmark. |
| `Navbar` | Top bar: logo, 4 nav links, language toggle, "Start Solving" CTA, hamburger for mobile. |
| `MobileMenu` | Slide-down menu for phones (private component in the same file). |
| `Layout` | The app shell. Calls `trackVisit()` once on mount. |
| `Sidebar` | Fixed left rail from 961 px; logo, 4 links, "Quick → Start Solving" CTA, language toggle. |
| `MobileTabBar` | Bottom tab bar for phones; the Solver tab is a raised centre FAB. |
| `CategoryCard` | The tappable category tile used on Home and Dashboard. |
| `SolutionCard` | The core output widget: icon + title + Save button, then a 4-block grid (Causes / Steps / Prevention / Alternative), then Solved / Not Solved buttons. |

### 3.7 `src/components/PremiumUI.jsx`
| Export | Purpose |
|---|---|
| `TabSwitcher` | A horizontally scrollable strip of tab buttons: every option renders as an icon + label button, the option whose `value` matches `value` is the active tab, and the strip scrolls sideways on a narrow screen. Props: `label, value, onChange, options, className`. Each option is `{ value, label, icon }`. |
| `Segmented` | A compact pill switcher for a small set of choices (file preset, photo quality). Every option renders as a pill with an optional icon and the active one is highlighted. Props: `label, value, onChange, options`. Each option is `{ value, label, icon }`. |
| `Toast` | A 2.6-second auto-dismissing status pill. |
| `useToast` | Hook returning `[node, setMsg]` — drop `node` into JSX, call `setMsg('…')` to show a toast. |

Neither switcher has a filter input or a popup: every option is rendered up front, so there is no empty state to handle.

### 3.8 `src/lib/store.js`
The single place that knows about persistence. Internal helpers `loadJSON(key, fallback)` and `saveJSON(key, value)` swallow exceptions.

| Function | Returns | Effect |
|---|---|---|
| `isAdmin()` | `boolean` | read-only |
| `adminLogin(name)` | — | writes `edusolve_admin` |
| `adminLogout()` | — | removes `edusolve_admin` |
| `adminName()` | `string` | read-only |
| `addFeedback({ title, verdict, source, at })` | — | unshifts a record; caps the list at 300 |
| `getFeedback()` | `Array` | read-only |
| `clearFeedback()` | — | writes `[]` |
| `getFeatured()` | `Array` | read-only |
| `toggleFeatured(id)` | `Array` | adds/removes the id, returns the new list |
| `trackVisit()` | — | increments today's counter |
| `getVisits()` | `Object` | read-only |
| `last7Days()` | `string[7]` | ISO `YYYY-MM-DD` for the last 7 days |
| `relativeTime(ts)` | `string` | `"just now"` / `"N min ago"` / `"N hr ago"` / `"N d ago"` |
| `clearAllAppData()` | — | removes every `edusolve_*` key except `edusolve_lang` |

### 3.9 `src/data/categories.js`
Three exports:

**`CATEGORIES`** — array of 12 objects:
```js
{ id: 'internet', icon: 'globe',
  title: { en: '…', mr: '…' },
  short: { en: 'Internet', mr: 'इंटरनेट' },   // short label for the tab switcher
  desc:  { en: '…', mr: '…' },
  keywords: ['internet', 'wifi', …, 'इंटरनेट', 'नेट', 'वायफाय', 'स्लो'] }
```
The `other` category has an empty `keywords` array. The `short` pair is the compact one-or-two-word name shown on the Dashboard tab switcher instead of the full `title`.

**`SOLUTIONS`** — object keyed by category id:
```js
internet: {
  causes:    { en: [...], mr: [...] },   // 3 items
  steps:     { en: [...], mr: [...] },   // 5 items
  prevention:{ en: [...], mr: [...] },   // 2 items
  alternative:{ en: '…', mr: '…' },     // 1 string
  followups: [                           // 2 questions
    { q: { en: '…', mr: '…' }, options: ['Yes','No','Not sure'] },
    { q: { en: '…', mr: '…' }, options: [...] },
  ],
}
```

**`detectCategory(text)`** → `{ id, confident }`
```js
const t = (text || '').toLowerCase()
let best = 'other', bestScore = 0
for (const c of CATEGORIES) {
  if (c.id === 'other') continue
  let score = 0
  for (const k of c.keywords) {
    if (k && t.includes(k.toLowerCase())) score += k.length > 4 ? 2 : 1
  }
  if (score > bestScore) { bestScore = score; best = c.id }
}
return { id: best, confident: bestScore >= 2 }
```
Scoring rules:
- Substring match, case-insensitive — so `"OTP"` matches `"otp"`.
- A keyword of **more than 4 characters scores 2**, otherwise **1**. `"payment"` → 2, `"pay"` → 1.
- All hits add up; the highest total wins. Ties keep the earlier category (the array order is the tie-break order).
- `confident` is `true` when the winning score is at least 2.
- No match at all → `{ id: 'other', confident: false }`.

### 3.10 `src/engine/solverEngine.js`
| Export | Signature | Behaviour |
|---|---|---|
| `getCategoryById(id)` | `(id) => Category` | Falls back to the `other` category if the id is unknown. |
| `startSession(userText)` | `(userText) => Session` | Runs `detectCategory`, returns `{ categoryId, confident, stepIndex: 0, answers: [], followups }`. |
| `buildSolution(categoryId, lang)` | `(id, lang) => Solution` | Returns `{ categoryId, title, icon, causes, steps, prevention, alternative }` with `obj[lang] \|\| obj.en` language fallback. |
| `fallbackSolution(lang)` | `(lang) => Solution` | A hard-coded "other" answer in English or Marathi, used for inputs under 4 characters and as the safety net. |

### 3.11 Pages

#### `pages/Home.jsx`
Sections in order: **Hero** (badge, headline, description, 2 CTAs) → **Quick actions** (4 cards: Ask AI / Check file / Fix photo / Browse issues) → **Popular categories** (`CATEGORIES.slice(5, 9)` — File Size, Photo, Payment, Submission) → **How It Works** (3 numbered cards) → **Features** (4 cards) → **CTA banner**.

Every category card navigates to `/dashboard?cat=<id>`.

#### `pages/Dashboard.jsx`
State: `activeCat`, `recent` (`edusolve_recent`), `savedIds` (`edusolve_saved`), `checks` (`edusolve_checks`, 5 booleans), plus a toast.
- A `TabSwitcher` lists all 12 categories as tabs, each labelled with the category's short `short[lang]` label and its `icon`. Clicking a tab calls `openCat(id)`.
- `openCat(id)` pushes the category to `recent` (dedup, max 6) and persists it.
- The active solution is rendered by `SolutionCard` via `buildSolution(activeCat, lang)`.
- **Solved** → `addFeedback({ source: 'dashboard' })` + toast.
- **Not Solved** → `addFeedback({ source: 'dashboard' })` + navigates to `/solver?q=<title>`.
- The same 12 categories are also listed below as `CategoryCard`s; clicking a card opens the same category.
- Three panels: Recently viewed, Saved, and Task progress with 5 checklist items and a percentage bar.

#### `pages/Solver.jsx`
The chat flow, in order:
1. The user types a problem (or clicks one of the 5 example pills, or arrives via `?q=`).
2. `handleUserText` pushes the user bubble. If `clean.length < 4`, it replies with the fallback's first step and stops.
3. `startSession(clean)` classifies the text. After a 350 ms delay the bot says either *"Identified! This looks like a … issue"* or *"Got it. This looks like … but let me confirm with 2 questions."* (the low-confidence variant).
4. `askFollowup(session)` pushes follow-up question #1 with its option chips.
5. `answerOption(opt)` pushes the chosen option, increments `stepIndex`, and after 300 ms asks follow-up question #2.
6. When `followups[stepIndex]` is exhausted, `finishSolution` builds the solution, pushes it into `edusolve_recent`, and shows the `SolutionCard`.
7. **Solved / Not Solved** writes feedback with `source: 'solver'`. "Not Solved" shows guidance about the dashboard, the college helpdesk and keeping the UTR.

The chat body auto-scrolls to the bottom on every `messages` / `solution` change.

#### `pages/Tools.jsx`
Local sub-components inside the same file: `Checklist`, `FileChecker`, `PhotoResizer`, `RequiredDocs`.

- A `TabSwitcher` lists the 6 tools as tabs (icon + bilingual label); the active tab's tool is rendered in the card below it.
- **`Checklist`** — reads `localStorage['tool_' + id]`, renders checkboxes and a progress bar.
- **`FileChecker`** — four presets picked with a `Segmented` switcher; reads `file.name` for the extension and `file.size / 1024` for KB; produces `{ ext, kb, okExt, okSize, ok }` and renders a green/red verdict.
- **`PhotoResizer`** — the most involved component:
  ```js
  const scale = Math.max(w / img.width, h / img.height)   // cover crop
  const dw = Math.round(img.width * scale), dh = Math.round(img.height * scale)
  const dx = Math.round((w - dw) / 2), dy = Math.round((h - dh) / 2)
  ctx.drawImage(img, dx, dy, dw, dh)
  const url = canvas.toDataURL('image/jpeg', quality)
  const bytes = Math.round((url.length * 3) / 4)          // real byte estimate
  ```
  White background is filled first, `imageSmoothingQuality = 'high'`. The output link is `download={edusolve-${w}x${h}.jpg}`. If the source was smaller than the target, a warning explains that the result will look soft. Width and height are plain number inputs; the quality (0.6 / 0.8 / 0.92) is picked with a `Segmented` switcher.
- **`RequiredDocs`** — three services with 5–8 documents each; the check state is **not** persisted.

#### `pages/Report.jsx`
The **graphical** analytics report. It renders no prose sections — every fact is a KPI card, a chart or a table.
- **Data** comes from `src/data/analytics.js` → `buildAnalytics({ scope, days })`, which merges a deterministic seeded 30-day dataset with the real Solved / Not-Solved feedback stored in this browser and returns totals, daily buckets, per-category counts, per-source counts, weekly buckets and a cumulative series.
- **Controls** — a data-source switch (`all` / `project` / `device`) and a time window (7 / 14 / 30 days). Both re-compute through `useMemo`. They live in a slim toolbar at the top of the page; there is no text header — the report starts with the numbers, and the page title is a screen-reader-only `h1`.
- **Charts** are hand-written SVG in `src/components/Charts.jsx`: `DonutChart`, `ColumnChart` (stacked), `AreaChart`, `BarList`, `SplitBar`, `Sparkline`, `Gauge`, `Legend`. No chart library, no extra dependency. Each chart measures its container with a `ResizeObserver` (`useWidth`) and redraws.
- **Exports** — `buildReportSheets(a, lang)` (in `src/data/reportSheets.js`) turns the analytics model into five Excel sheet definitions, and `downloadXlsx(filename, sheets)` (in `src/lib/xlsx.js`) writes them as a real `.xlsx`. `downloadReportMarkdown(lang)` (in `src/data/reportExport.js`) still exports the long written document from `REPORT_SECTIONS`.
- **The XLSX writer is dependency-free** — `src/lib/xlsx.js` builds the ZIP container (CRC-32, stored entries) and the OOXML parts (`[Content_Types].xml`, `_rels`, `xl/workbook.xml`, `xl/styles.xml`, one `xl/worksheets/sheetN.xml` per sheet) by hand. Inline strings are used, so Marathi text round-trips as UTF-8 without a shared-strings table. The project still ships with 3 runtime dependencies.
- **`window.print()`** plus the `@media print` block in `src/index.css` produces a clean A4 document: chrome hidden, charts and tables kept whole.

### 3.12 `src/index.css`
- One `@import` for Google Fonts (Sora, Manrope, Noto Sans Devanagari).
- `:root` design tokens (see the README design-system table).
- Layout: `.app-shell` (sidebar + content grid), `.navbar`, `.sidebar`, `.tabbar`.
- Components: `.btn` (+`.primary` `.secondary` `.small` `.block` `.ghost`), `.card`, `.cat-card`, `.sol-grid`, `.solution`, `.chat`, `.msg` (+`.user` `.bot`), `.opt-row`, the tab-switcher strip and the segmented pill styles, `.toast`, `.progress`, `.check`, `.pill`, `.chip`, `.file-chip`, `.result` (+`.ok` `.bad`), `.kpi` (admin), `.bar` / `.bar-col` / `.chart` (admin), `.ring` (admin donut).
- Report section: `.report-hero`, `.report-layout`, `.report-toc`, `.toc-link`, `.rep-sec`, `.rep-h2`, `.rep-h3`, `.rep-p`, `.rep-ul`, `.rep-ol`, `.rep-note`, `.rep-code`, `.rep-table`, `.rep-qa`, `.rep-q`, `.rep-end`, `.report-promo`.
- Graphical report: `.an-hero`, `.an-controls`, `.an-seg`, `.an-headline`, `.an-kpi-grid`, `.an-kpi`, `.an-grid`, `.an-panel`, `.an-donut-wrap`, `.an-gauge-wrap`, `.an-mini-stats`, `.an-source-grid`, `.an-insight`, `.an-td-cat`, `.an-rate-cell`.
- Chart primitives: `.ch-wrap`, `.ch-svg`, `.ch-grid`, `.ch-axis-label`, `.ch-bar`, `.ch-arc`, `.ch-donut-num`, `.ch-gauge-num`, `.ch-barlist`, `.ch-track`, `.ch-fill`, `.ch-split`, `.ch-splitbar`, `.ch-spark`, `.ch-legend`.
- Breakpoints at 600 / 768 / 961 px, plus a dedicated `@media print` block for the report.

---

## 4. Admin app architecture

```
admin-app/src/main.jsx
 └── App
      ├── (not admin) → Login          [name + PIN 1234]
      └── (admin)     → Shell
           ├── Sidebar (brand, 4 tabs, language toggle, user card, logout)
           ├── Topbar (compact brand, language toggle, logout, date chip, live chip)
           └── Page
                ├── Overview          → KPI grid + 7-day bar chart + recent feedback + donut gauge
                ├── FeedbackInbox    → search + verdict filter + clear
                ├── CategoriesAdmin   → search + featured toggle per category
                └── SettingsAdmin     → session / local data reset / build info / safety
```

- **Tab state** is a local `useState('overview')`; there is no URL routing.
- **Language** is a local `useState` persisted to `edusolve_admin_lang`, independent of the student site.
- **`seedOnce()`** runs on every render *after* login but returns immediately once feedback exists, so it injects exactly 5 demo rows the first time only.
- **The donut gauge** is an SVG circle with `r = 42` (circumference ≈ 264) and `strokeDasharray = (rate * 2.639) + ' 264'`.
- **The bar chart** is pure CSS: bar height is `(value / max) * 100` %, with a 4 % minimum so zero-days still show a baseline.
- **Logout and data reset** both call `window.location.reload()` so every panel re-reads `localStorage` from scratch.

---

## 5. State model

| State | Where it lives | Persisted? |
|---|---|---|
| Active route | React Router (`HashRouter`) | No |
| Active tab (admin) | `useState` | No |
| Language | `LanguageContext` | Yes (`edusolve_lang`) |
| Admin language | `useState` | Yes (`edusolve_admin_lang`) |
| Chat messages | `useState` in Solver | No |
| Session (`stepIndex`, `answers`) | `useState` in Solver | No |
| Active category | `useState` + `?cat=` query param | URL |
| Recent / Saved / Checks | `useState` seeded from `localStorage` | Yes |
| Tool checklists | `useState` seeded from `localStorage` | Yes |
| Feedback / Visits / Featured / Admin session | `localStorage` only | Yes |

Pattern: every persistent list is read with a `load()` helper that returns a fallback on a JSON parse error, and written with a `save()` helper that silently ignores quota errors.

---

## 6. Offline / PWA behaviour

`public/sw.js` uses cache name **`edusolve-v5`**:
- **Install** — precaches `./`, `./index.html`, `./manifest.webmanifest`, then `skipWaiting()`.
- **Activate** — deletes every cache except `edusolve-v5`, then `clients.claim()`.
- **Fetch** — only same-origin GETs are intercepted.
  - **Navigation requests** → network-first, and the response is written to `./index.html`; on failure it falls back to the cached `index.html`. This makes the SPA work offline from any route.
  - **Other requests** → cache-first; misses are fetched and cached if `res.ok`.

---

## 7. Extension points

| To add… | Edit | Notes |
|---|---|---|
| A new problem category | `src/data/categories.js` | Add to `CATEGORIES` (with bilingual title/short/desc/keywords) and add a matching `SOLUTIONS[id]` block with both `followups`. The `short` label is what the Dashboard tab switcher shows. |
| A new UI string | `src/i18n/translations.js` | Add the key to **both** `en` and `mr`. |
| A new language | `src/i18n/translations.js` + `LanguageContext.jsx` | See [`LANGUAGES.md`](LANGUAGES.md). |
| A new tool | `src/pages/Tools.jsx` | Add to `TOOLS` — the tool tab switcher picks it up automatically — then add a render branch in the tool card. |
| A new icon | `src/components/icons.jsx` | Add a `PATHS` entry. |
| A new route | `src/App.jsx` | Add a `<Route>` and a page under `src/pages/`. |
| New report content | `src/data/report.js` | Add a section to `REPORT_SECTIONS`, or a new block type in `src/pages/Report.jsx`. |
| A new admin tab | `admin-app/src/App.jsx` | Add to `NAV`, then a panel component and a render branch. |
| Real AI later | `src/engine/solverEngine.js` | Replace `detectCategory` / `buildSolution` with API calls; keep the `SolutionCard` contract (`{ title, icon, causes[], steps[], prevention[], alternative }`) so the UI needs no change. |

---

## 8. Why these choices

- **HashRouter over BrowserRouter** — one `dist/` deployable to GitHub Pages, Vercel, Netlify and `file://` without server rewrites.
- **Plain objects over i18n libraries** — no dependency, no key extraction, and a Marathi translator can edit one file.
- **localStorage over IndexedDB** — the data volume is tiny (a few KB) and synchronous access keeps the code simple.
- **Rule engine over an AI API** — the project must run offline, cost nothing, and be explainable in a viva.
- **Separate admin app** — the student site stays clean, and the admin bundle never ships to students.
- **Canvas instead of a server image service** — keeps student files on their own device.
