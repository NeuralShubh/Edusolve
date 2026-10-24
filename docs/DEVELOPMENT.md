?# Development Guide — EduSolve AI

How to set up, run, modify and extend the project.

---

## 1. Environment setup

### Requirements

| Tool | Minimum | Check with |
|---|---|---|
| Node.js | 18 LTS | `node -v` |
| npm | 9 | `npm -v` |
| Git | any | `git --version` |

### Install

```bash
cd Taniya
npm install
```

This installs exactly 5 packages (3 runtime + 2 dev) plus their transitive dependencies. `package-lock.json` is committed, so `npm ci` gives a reproducible install.

### Run

```bash
npm run dev          # student site  → http://localhost:5173
npm run dev:admin    # admin console → next free port (usually 5174)
```

Open two terminals so both can run at once.

### Windows shortcut

`start-edusolve.bat`:
```bat
@echo off
cd /d "%~dp0"
echo Starting EduSolve AI...
echo Keep this window OPEN, then open http://localhost:5173/ in your browser.
npm run dev -- --port 5173 --host localhost
pause
```
Double-click it. The `pause` keeps the window open so you can read Vite's errors.

---

## 2. Project layout

```
Taniya/
├── index.html               Student HTML shell
├── package.json             npm scripts + dependencies
├── vite.config.js           Student Vite config
├── vercel.json              SPA rewrite
├── start-edusolve.bat       Windows launcher
├── public/                  Copied verbatim into dist/
├── src/                     Student application
├── admin-app/               Admin application (separate Vite root)
├── dist/                    Built student app   (git-ignored)
└── dist-admin/              Built admin app     (git-ignored)
```

**Two Vite roots, one `package.json`.** `admin-app/vite.config.js` sets `root: admin-app` and `outDir: ../dist-admin`, so `npm run build:admin` produces a separate bundle without a second `package.json`.

---

## 3. Two apps, shared code

`admin-app/src/App.jsx` imports from the student app:

```js
import { CATEGORIES } from '../../src/data/categories'
import { Icon } from '../../src/components/icons'
import { isAdmin, adminLogin, /* … */ } from '../../src/lib/store'
```

That is why there is only one `node_modules` and one `package.json`. If you move `src/`, update these three import paths.

---

## 4. Common tasks

### 4.1 Add a problem category

**Step 1** — add to `CATEGORIES` in `src/data/categories.js`:

```js
{
  id: 'wifi',                       // unique, kebab-case
  icon: 'globe',                    // must exist in PATHS
  title: { en: 'Wi-Fi Signal Problems', mr: 'वाय-फाय सिग्नल समस्या' },
  short: { en: 'Wi-Fi', mr: 'वाय-फाय' },   // short label for the Dashboard tab switcher
  desc:  { en: 'Weak signal, frequent drops.', mr: 'कमकुवत सिग्नल, वारंवार तुटते.' },
  keywords: ['wifi signal', 'weak signal', 'disconnect', 'वायफाय', 'सिग्नल'],
}
```

> The `short` pair is **required** — the Dashboard tab switcher renders `short[lang]` on each tab, so a category without it has no tab label. Keep it to one or two words.

**Step 2** — add the matching entry to `SOLUTIONS`:

```js
wifi: {
  causes:     { en: [/* 5 */], mr: [/* 5 */] },
  steps:      { en: [/* 5 */], mr: [/* 5 */] },
  prevention: { en: [/* 2 */], mr: [/* 2 */] },
  alternative:{ en: '…', mr: '…' },
  followups: [
    { q: { en: '…', mr: '…' }, options: ['Yes', 'No'] },
    { q: { en: '…', mr: '…' }, options: ['Yes', 'No'] },
  ],
},
```

**Step 3** — nothing else. The Dashboard tab switcher, the Dashboard grid, the Home popular list, the admin category manager and the detector all read `CATEGORIES` / `SOLUTIONS` automatically.

> The Home "Popular" strip is a hard-coded slice: `CATEGORIES.slice(5, 9)`. Move the slice indices if you want different categories featured.

### 4.2 Add a UI string

1. Add the key to **both** `STRINGS.en` and `STRINGS.mr` in `src/i18n/translations.js`.
2. Use it: `const t = STRINGS[lang]` → `{t.my_new_key}`.

### 4.3 Add a Smart Tool

In `src/pages/Tools.jsx`:

```js
const TOOLS = [
  // …
  { id: 'mytool', icon: 'wrench', en: 'My Tool', mr: 'माझे साधन' },
]
```

Then add a render branch inside the tool card:

```jsx
{active === 'mytool' && <MyTool lang={lang} />}
```

The tool tab switcher is built from `TOOLS`, so a new entry shows up as a tab on its own — nothing else to wire up. For a persistent checklist, copy the `Checklist` pattern (it stores under `tool_<id>`).

### 4.4 Add an icon

`src/components/icons.jsx`:

```js
const PATHS = {
  // …
  myicon: (<><circle cx="12" cy="12" r="8" /><path d="M8 12l3 3 5-6" /></>),
}
```

Use `<Icon name="myicon" size={20} />`. Unknown names fall back to `bulb`.

### 4.5 Add a route

`src/App.jsx`:

```jsx
import Help from './pages/Help'
// …
<Route path="/help" element={<Help />} />
```

Create `src/pages/Help.jsx` with a default-exported component. The `Layout` (sidebar, navbar) wraps it automatically.

### 4.6 Edit the in-app project report

The on-screen report is **graphical**. Two files drive it:

| File | What lives there |
|---|---|
| `src/data/analytics.js` | Every aggregate over the **real** recorded data — `buildAnalytics({ scope, days })` returns totals, daily buckets, per-category, per-source, weekly and cumulative series |
| `src/components/Charts.jsx` | The SVG chart primitives — `DonutChart`, `ColumnChart`, `AreaChart`, `BarList`, `SplitBar`, `Sparkline`, `Gauge`, `Legend` |
| `src/pages/Report.jsx` | The page itself — syncs real data from the API, then renders KPI cards, panels, tables, controls and the bilingual labels |
| `src/data/report.js` | The long written document (`REPORT_SECTIONS`), still exportable as Markdown |

**The numbers are real.** Reports come from the EduSolve API (Supabase `feedback` + `visits_daily` tables) and are cached in `localStorage` (`edusolve_feedback`, merged with this browser's own `edusolve_feedback_local` ledger). The report window is **fixed at the last 15 days** (15 days ago → today, `REPORT_DAYS = 15`); the server accepts `?days=N` on `GET /api/feedback` and `GET /api/visits` to limit what it sends, and `buildAnalytics()` slices the cached data client-side to that window. There is no seeded sample dataset anymore.

**To add a chart**, drop a new component in `src/components/Charts.jsx` (or reuse an existing one) and add a `<Panel>` to `src/pages/Report.jsx`. Every chart measures its own container with `useWidth()`, so no fixed pixel width is needed.

**Always add the Marathi version too** — `src/pages/Report.jsx` keeps its own `TXT.en` / `TXT.mr` label table, so a missing `mr` string shows the English one.

**To edit the written document**, the section format is:

```js
{
  id: 'problem', no: '02', icon: 'alert',
  en: 'Problem Statement', mr: 'समस्येचे निवेदन',
  blocks: [
    { t: 'p', en: '…', mr: '…' },
    { t: 'ul', en: ['…'], mr: ['…'] },
    { t: 'table', head: ['A', 'B'], rows: [['x', 'y']] },
    { t: 'code', text: '…' },
    { t: 'qa', items: [{ q: { en, mr }, a: { en, mr } }] },
  ],
}
```

Supported block types: `p`, `h3`, `ul`, `ol`, `table`, `note`, `code`, `qa`, plus three live blocks — `categories`, `storage`, `design` — generated at render time from `CATEGORIES`, `STORAGE_KEYS` and `DESIGN_TOKENS`.

A table cell can be a plain string (language independent) or `{ en, mr }` (auto-switching).

### 4.7 Add an admin tab

`admin-app/src/App.jsx`:

```js
const NAV = [
  // …
  { id: 'reports', en: 'Reports', mr: 'अहवाल', icon: 'cpu' },
]
```

Add a `Reports` panel component and a render branch:
```jsx
{tab === 'reports' && <Reports lang={lang} />}
```

### 4.8 Change the theme colour

Edit the `:root` block at the top of `src/index.css` **and** `admin-app/src/admin.css`:

```css
:root {
  --accent: #6d28d9;
  --accent-deep: #5b21b6;
  --accent-soft: #f5f3ff;
  --accent-line: #ddd6fe;
}
```

Also update `theme-color` in `index.html`, `admin-app/index.html`, `public/manifest.webmanifest`, and the favicon data-URI.

---

## 5. Coding conventions used in this project

- **Single quotes** for strings, **no semicolon-free style** — actually the codebase uses semicolons only where needed; match the surrounding file.
- **2-space indentation.**
- **ES modules** everywhere; no `require()`.
- **Named exports** for utilities and components; **default exports** for page components.
- **Bilingual objects** `{ en, mr }` for any user-visible string.
- **All `localStorage` access is wrapped in `try/catch`** — private-browsing modes throw on access.
- **No network calls** anywhere in `src/`.
- **Icons, never emojis or images** in the UI.
- **Comments only for non-obvious logic** (e.g. the SW cache strategy, the resize maths).

### The two `load` / `save` helpers

`src/lib/store.js` has `loadJSON`/`saveJSON` internally. `src/pages/Dashboard.jsx`, `src/pages/Solver.jsx` and `src/pages/Tools.jsx` each define their own tiny local `load`/`save`/`store` pair with the same semantics:

```js
function load(key, fallback) {
  try { const v = JSON.parse(localStorage.getItem(key)); return v ?? fallback } catch { return fallback }
}
function save(key, val) { try { localStorage.setItem(key, JSON.stringify(val)) } catch {} }
```

Follow this pattern for new persistence.

---

## 6. Testing and verification

There is **no automated test suite** (no Jest, Vitest, Playwright or Cypress in the project). Verification is manual. Use this checklist after any change:

### Student site

| Check | How |
|---|---|
| App boots | `npm run dev` → open the printed URL → no console errors |
| Routing | Visit `#/`, `#/dashboard`, `#/solver`, `#/tools`, `#/xyz` |
| Language toggle | Toggle in navbar → sidebar → mobile menu; switch → reload → still selected |
| Detection | In Solver type "my payment failed" → expects the Payment category |
| Marathi detection | Type "OTP येत नाही" → expects the OTP category |
| Follow-ups | Answer both follow-up questions → the Solution card appears |
| Feedback | Click Solved → open the admin console → the entry appears (same origin) |
| Save | Save a solution → Dashboard "Saved solutions" lists it |
| Recent | Open 3 categories → Dashboard "Recently viewed" lists them |
| File checker | Pick a 2 MB PDF against the `pdf200` preset → red "Size OK" fails |
| File checker | Pick a 40 KB JPG against `img50` → both checks pass |
| Resizer | Pick a photo → Resize 200×230 → Download → the JPG opens and is ~200×230 |
| Resizer warning | Resize a 50×50 image to 800×800 → the "softer" warning appears |
| Checklists | Tick items → reload → the ticks persist |
| PWA | Build → serve → DevTools → Application → manifest + service worker registered |
| Offline | Build → serve → go offline → reload → the app still loads |
| Report | Open `#/report` → all 17 sections render, the TOC highlights on scroll, tables and viva Q&A appear |
| Report print | Click Print → the navbar, sidebar and tab bar are hidden and every viva answer is expanded |
| Report export | Click Download Markdown → a `.md` file downloads containing all 17 sections |
| Report bilingual | Toggle the language → every heading, paragraph, list and table cell switches |
| Responsive | Resize to 375 / 768 / 1280 px — tab bar, sidebar and grid all adapt |

### Admin console

| Check | How |
|---|---|
| Login | Wrong PIN → the error shows; `1234` → the console opens |
| Seed data | First login shows 5 demo feedback rows |
| Overview | The KPI numbers, the 7-day bar chart and the donut gauge render |
| Feedback filter | Filter by Solved / Open; search by title |
| Clear feedback | Click Clear → confirm → the list empties |
| Category flags | Toggle Featured → the switch turns green |
| Language | The admin toggle switches independently of the student site |
| Logout | Logout → the login screen returns |
| Reset data | Settings → Reset data → confirm → feedback, visits and flags are cleared |

### Production build

```bash
npm run build && npm run build:admin
npm run preview
```

Check the console for warnings and confirm `dist/` and `dist-admin/` both contain an `index.html` plus an `assets/` folder.

---

## 7. Common problems

| Symptom | Cause | Fix |
|---|---|---|
| `Cannot find module 'react'` | Dependencies not installed | `npm install` |
| Blank page, red console error | A syntax error in a recent edit | Check the browser console; the error names the file and line |
| Admin shows no student feedback | Different port ⇒ different origin ⇒ different `localStorage` | Serve the admin from the same host/port, or accept that they are independent |
| `npm run dev:admin` fails | `admin-app/vite.config.js` resolves `outDir` relative to itself | It uses `path.resolve(dir, '../dist-admin')` — keep that pattern |
| Service worker serves stale files | Old cache `edusolve-v5` | Bump `CACHE` in `public/sw.js`, or DevTools → Application → Unregister |
| Changes do not hot-reload | Editing a file outside `src/` | The admin app has its own root; edit files under `admin-app/` |
| Dev server will not start | Port 5173 is taken | `npm run dev -- --port 5174` |
| GitHub Pages shows a blank page | Wrong base path | `base: './'` must stay relative; publish `dist/` to the branch root |
| Marathi text shows boxes | Font not loaded | `Noto Sans Devanagari` must be in the `@import` and the `font-family` chain |

---

## 8. Git workflow

```bash
git status
git add src/ docs/
git commit -m "Add comprehensive project documentation"
git push origin main
```

The `gh-pages` branch holds the built student site and is updated separately:

```bash
npm run build
git checkout gh-pages
# copy dist/ contents here
git add -A && git commit -m "Deploy" && git push origin gh-pages
git checkout main
```

**Never commit** `node_modules`, `dist`, `dist-admin` — they are already in `.gitignore`.

---

## 9. Performance notes

- The whole student bundle is small (no UI library, no icon package, no HTTP client).
- `SolutionCard` and the category grid re-render on language change — negligible for 12 items.
- The resizer's canvas work is synchronous and runs once per click.
- The service worker uses **network-first for navigation** so users always get fresh HTML when online, and the cached shell when offline.
- `trackVisit()` writes to `localStorage` once per page load — a tiny synchronous write.

---

## 10. Accessibility notes

- All icons are `aria-hidden="true"` decorative SVGs; the accessible name comes from the surrounding text or `aria-label`.
- Interactive elements are real `<button>` / `<a>` / `<input>` elements — keyboard accessible by default.
- `TabSwitcher` and `Segmented` render every option as a real `<button>`, so the tabs are keyboard reachable in reading order and each one announces its own icon + label. There is no popup listbox any more, so no arrow-key navigation is needed.
- `Toast` uses `role="status"` so it is announced.
- `document.documentElement.lang` is kept accurate for screen readers.
- Colour is never the only signal — verdicts pair colour with an icon and text.
