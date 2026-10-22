?# API Reference — EduSolve AI

Every exported symbol in the project, with signatures, parameters, return values and behaviour.

---

## 1. `src/data/categories.js`

### `CATEGORIES` — `Array<Category>`

12 category descriptors, in array order (which is also the tie-break order for detection).

```ts
type Category = {
  id: string            // 'internet' | 'server' | 'otp' | 'password' | 'form-entry'
                        // | 'doc-upload' | 'file-size' | 'photo' | 'payment'
                        // | 'submission' | 'reload' | 'other'
  icon: string          // key into PATHS in src/components/icons.jsx
  title: { en: string, mr: string }
  desc:  { en: string, mr: string }
  keywords: string[]    // English + Marathi trigger words; [] for 'other'
}
```

| # | id | icon | keywords (count) |
|---|---|---|---|
| 1 | `internet` | `globe` | 14 |
| 2 | `server` | `server` | 14 |
| 3 | `otp` | `lock` | 14 |
| 4 | `password` | `key` | 6 |
| 5 | `form-entry` | `edit` | 14 |
| 6 | `doc-upload` | `upload` | 13 |
| 7 | `file-size` | `box` | 14 |
| 8 | `photo` | `photo` | 9 |
| 9 | `payment` | `card` | 13 |
| 10 | `submission` | `checkcircle` | 8 |
| 11 | `reload` | `refresh` | 13 |
| 12 | `other` | `bulb` | 0 |

### `SOLUTIONS` — `Object<categoryId, SolutionSet>`

```ts
type SolutionSet = {
  causes:     { en: string[], mr: string[] }   // 3 items
  steps:      { en: string[], mr: string[] }   // 5 items
  prevention: { en: string[], mr: string[] }   // 2 items
  alternative:{ en: string,   mr: string }     // 1 string
  followups: FollowUp[]                       // exactly 2
}

type FollowUp = {
  q:       { en: string, mr: string }
  options: string[]                            // 2–3 chips, English labels
}
```

Every category id is a key. There are exactly 12.

### `detectCategory(text)` → `{ id: string, confident: boolean }`

| Parameter | Type | Notes |
|---|---|---|
| `text` | `string` | The student's raw sentence. `null`/`undefined` are tolerated. |

| Return field | Meaning |
|---|---|
| `id` | The winning category id, or `'other'` when nothing matched. |
| `confident` | `true` when the winning score is **≥ 2**, else `false`. |

Scoring:
- Text is lowercased; keywords are lowercased for comparison.
- A keyword hit adds **1**, or **2** if the keyword is longer than 4 characters.
- All hits accumulate; the highest total wins. Earlier categories win ties.
- `'other'` is never scored — it is only the default.

```js
detectCategory('My scholarship form is not submitting')
// → { id: 'submission', confident: true }   (hits: 'submit' → 2, 'form' is not a keyword here)
detectCategory('OTP is not coming')
// → { id: 'otp', confident: true }           ('otp' → 2, 'coming' no hit)
detectCategory('xyz')
// → { id: 'other', confident: false }
```

---

## 2. `src/engine/solverEngine.js`

### `getCategoryById(id: string) → Category`

Returns the matching category, or the `other` category when `id` is unknown.

### `startSession(userText: string) → Session`

```ts
type Session = {
  categoryId: string
  confident: boolean
  stepIndex: number      // always 0 at creation
  answers: string[]      // chosen follow-up options, in order
  followups: FollowUp[]  // copied from SOLUTIONS[categoryId]
}
```

Calls `detectCategory(userText)` and packages the result.

### `buildSolution(categoryId: string, lang: string = 'en') → Solution`

```ts
type Solution = {
  categoryId: string
  title: string
  icon: string
  causes: string[]
  steps: string[]
  prevention: string[]
  alternative: string
}
```

Language selection uses `obj[lang] || obj.en`, so an unknown language code silently falls back to English. An unknown `categoryId` falls back to the `other` solution set.

### `fallbackSolution(lang: string = 'en') → Solution`

Returns a hard-coded `other` solution. Fully written in English (`'en'`) and Marathi (`'mr'`); any other language code returns the English version. Used when:
- the user's input is shorter than 4 characters, and
- as the safety net for an unmatched category.

---

## 3. `src/lib/store.js`

All functions are synchronous and operate on `localStorage`.

| Function | Signature | Returns | Side effect |
|---|---|---|---|
| `isAdmin` | `() => boolean` | `true` if `edusolve_admin` exists | — |
| `adminLogin` | `(name: string) => void` | — | writes `edusolve_admin = { name: name \|\| 'Admin', at: Date.now() }` |
| `adminLogout` | `() => void` | — | removes `edusolve_admin` |
| `adminName` | `() => string` | the admin name, or `''` | — |
| `addFeedback` | `(entry: { title, verdict, source, at? }) => void` | — | unshifts `{ id: Date.now() + Math.random(), title, verdict, source, at }`; keeps the newest **300** |
| `getFeedback` | `() => Feedback[]` | array (newest first) | — |
| `clearFeedback` | `() => void` | — | writes `[]` |
| `getFeatured` | `() => string[]` | featured category ids | — |
| `toggleFeatured` | `(id: string) => string[]` | the new list | adds or removes `id` |
| `trackVisit` | `() => void` | — | increments `edusolve_visits_daily[today]` |
| `getVisits` | `() => Record<string, number>` | `{ 'YYYY-MM-DD': count }` | — |
| `last7Days` | `() => string[]` | 7 ISO dates, oldest → newest | — |
| `relativeTime` | `(ts: number) => string` | `'just now'` \| `'N min ago'` \| `'N hr ago'` \| `'N d ago'` | — |
| `clearAllAppData` | `() => void` | — | removes every `edusolve_*` key **except** `edusolve_lang` |

```ts
type Feedback = {
  id: number
  title: string
  verdict: 'solved' | 'unsolved'
  source: 'dashboard' | 'solver'
  at: number      // epoch ms
}
```

---

## 4. `src/context/LanguageContext.jsx`

| Export | Signature | Notes |
|---|---|---|
| `LanguageProvider` | `({ children }) => JSX.Element` | Provides `{ lang, setLang, toggle }`; persists `edusolve_lang`; sets `document.documentElement.lang`. |
| `useLang` | `() => { lang: 'en' \| 'mr', setLang: Function, toggle: Function }` | Consumer hook. Safe defaults if no provider is mounted. |

---

## 5. `src/i18n/translations.js`

### `STRINGS` — `{ en: Record<string,string>, mr: Record<string,string> }`

60 keys per language. Full list:

`nav_home` · `nav_dashboard` · `nav_solver` · `nav_tools` · `nav_about` · `hero_badge` · `hero_title_a` · `hero_title_b` · `hero_desc` · `start_solving` · `explore_problems` · `demo_note` · `popular_title` · `popular_sub` · `view_all` · `how_title` · `how_sub` · `how_1_t` · `how_1_d` · `how_2_t` · `how_2_d` · `how_3_t` · `how_3_d` · `feat_title` · `feat_sub` · `feat_1_t` · `feat_1_d` · `feat_2_t` · `feat_2_d` · `feat_3_t` · `feat_3_d` · `feat_4_t` · `feat_4_d` · `footer_tag` · `footer_help` · `footer_privacy` · `footer_help_text` · `footer_privacy_text` · `search_ph` · `ask_ai` · `welcome` · `dash_sub` · `recent` · `saved` · `progress` · `empty_recent` · `empty_saved` · `solver_title` · `solver_sub` · `solver_ph` · `send` · `solved` · `not_solved` · `save` · `saved_label` · `tools_title` · `tools_sub` · `about_title` · `lang_label` · `clear`

---

## 6. `src/components/icons.jsx`

### `<Icon />`

| Prop | Type | Default | Notes |
|---|---|---|---|
| `name` | `string` | — | Key in `PATHS`. Unknown → falls back to `bulb`. |
| `size` | `number` | `20` | Sets the wrapper's width/height and the SVG's width/height. |
| `strokeWidth` | `number` | `2` | SVG stroke width. |
| `className` | `string` | `''` | Appended to the wrapper class `icon`. |

```jsx
<Icon name="rocket" size={17} strokeWidth={2.2} />
```

### `PATHS` (internal)

43 icon definitions. See [`LANGUAGES.md`](LANGUAGES.md#2-frameworks-libraries-and-tools) → the icon inventory in [`ARCHITECTURE.md`](ARCHITECTURE.md#35-srccomponentsiconsjsx).

---

## 7. `src/components/ui.jsx`

### `<Logo />`
No props. Renders a home link: icon mark + "EduSolve **AI**".

### `<Navbar />`
No props. Uses `useLang()` and `useNavigate()`. Contains the language toggle and the "Start Solving" CTA.

### `<Footer />`
No props. Four columns + a bottom bar with `new Date().getFullYear()`.

### `<Layout />`
| Prop | Type | Notes |
|---|---|---|
| `children` | `ReactNode` | The routed page. |

Calls `trackVisit()` once on mount. Renders `Sidebar`, `Navbar`, `<main className="main">`, `Footer`, `MobileTabBar`.

### `<Sidebar />`
No props. Desktop left rail. Rendered inside `Layout` but always in the DOM — CSS hides it below 961 px.

### `<MobileTabBar />`
No props. Bottom tab bar; the Solver tab renders as a raised centre FAB.

### `<CategoryCard />`
| Prop | Type | Notes |
|---|---|---|
| `icon` | `string` | Icon name. |
| `title` | `string` | Category title (already localised). |
| `desc` | `string` | Category description (already localised). |
| `onClick` | `() => void` | Called on click. |
| `active` | `boolean` | Adds the `active` class. |

### `<SolutionCard />`
| Prop | Type | Notes |
|---|---|---|
| `solution` | `Solution` | The object from `buildSolution()`. Renders `null` if absent. |
| `onSolved` | `() => void` | Optional — the Solved button is hidden if both callbacks are absent. |
| `onUnsolved` | `() => void` | Optional — same. |
| `saved` | `boolean` | Switches the button between "Save" and "Saved". |
| `onSave` | `() => void` | Called on the Save/Saved button. |

Layout: header (icon, "Problem identified", title, Save) → 4-block grid (Possible causes / Step-by-step solution / Prevention tips / Alternative solution) → footer with **Problem Solved** and **Not Solved**.

---

## 8. `src/components/PremiumUI.jsx`

### `<SearchSelect />`
| Prop | Type | Default | Notes |
|---|---|---|---|
| `label` | `string` | — | Label above the field. Hidden if falsy. |
| `value` | `string \| number` | — | The currently selected option's `value`. |
| `onChange` | `(value) => void` | — | Fired with the new `value` when an option is picked. |
| `options` | `{ value, label, icon?, search? }[]` | — | `search` overrides the text used for filtering. |
| `placeholder` | `string` | `'Search...'` | Shown in the field when nothing is selected, and in the filter input. |

Behaviour: click to open; type to filter; ↑/↓ to move the highlight; Enter to pick; Esc to close; click outside to close; hover to highlight; "No match found" when the filter is empty.

### `<Toast />`
| Prop | Type | Notes |
|---|---|---|
| `msg` | `string` | The message text. |
| `onDone` | `() => void` | Called after 2600 ms. |

### `useToast()` → `[node, setMsg]`
Returns the JSX node to render (or `null`) and a setter. Example:
```jsx
const [toast, showToast] = useToast()
<button onClick={() => showToast('Saved!')}>Save</button>
{toast}
```

---

## 9. Page components (default exports)

| File | Export | Key props |
|---|---|---|
| `src/pages/Home.jsx` | `Home` | none |
| `src/pages/Dashboard.jsx` | `Dashboard` | none (reads `?cat=` via `useSearchParams`) |
| `src/pages/Solver.jsx` | `Solver` | none (reads `?q=` via `useSearchParams`) |
| `src/pages/Tools.jsx` | `Tools` | none |
| `src/pages/Report.jsx` | `Report` | none (reads the data source and time window from component state) |
| `admin-app/src/App.jsx` | `App` | none |

### Query parameters

| Parameter | Page | Effect |
|---|---|---|
| `?cat=<id>` | Dashboard | Pre-selects and opens that category. Used by the Home "Popular" cards. |
| `?q=<text>` | Solver | Auto-submits the text as the user's first message on mount. Used by the Dashboard "Ask AI" button and by "Not Solved". |

---

## 10. URL routing table

| URL | Page | Notes |
|---|---|---|
| `#/` | Home | — |
| `#/dashboard` | Dashboard | — |
| `#/dashboard?cat=payment` | Dashboard | Opens the Payment category |
| `#/solver` | Solver | — |
| `#/solver?q=My%20form%20is%20not%20submitting` | Solver | Auto-runs the query |
| `#/tools` | Tools | — |
| `#/report` | Report | The graphical analytics report — KPI cards, charts, tables, data-source and time-window switches, print, Markdown export |
| `#/<anything else>` | Home | Catch-all fallback |

---

## 11. `src/data/report.js`

### `REPORT_META` — `object`
| Key | Type | Notes |
|---|---|---|
| `title` | `string` | `EduSolve AI` |
| `subtitle` | `{ en, mr }` | The full project title in both languages |
| `tagline` | `{ en, mr }` | One-line summary |
| `version` | `string` | `1.0.0` |
| `type` / `typeMr` | `string` | Project type (English / Marathi) |
| `repo` / `live` | `string` | Repository and live-site URLs |
| `academicYear` / `institution` | `string` | Academic year and department |

### `REPORT_SECTIONS` — `Array<Section>`
```ts
type Section = {
  id: string        // 'abstract', 'problem', 'objectives', 'scope', 'tech',
                    // 'architecture', 'categories', 'engine', 'modules',
                    // 'features', 'storage', 'design', 'testing',
                    // 'limitations', 'future', 'viva', 'conclusion'
  no: string        // '01' … '17'
  icon: string      // key into PATHS
  en: string
  mr: string
  blocks: Block[]
}

type Block =
  | { t: 'p' | 'h3' | 'note'; en: string; mr: string }
  | { t: 'ul' | 'ol'; en: string[]; mr: string[] }
  | { t: 'table'; head: (string | {en,mr})[]; rows: (string | {en,mr})[][] }
  | { t: 'code'; text: string }
  | { t: 'qa'; items: { q: {en,mr}, a: {en,mr} }[] }
  | { t: 'categories' | 'storage' | 'design' }   // live blocks
```

### `reportStats()` → `object`
```ts
{
  categories: number    // 12
  causes: number        // 36
  steps: number         // 60
  prevention: number    // 24
  alternative: number   // 12
  followups: number     // 24
  keywords: number      // 127
  perLang: number       // 180 content strings per language
  totalStrings: number  // 360
}
```
Computed live from `CATEGORIES` and `SOLUTIONS` — it can never drift from the code.

### `STORAGE_KEYS` — `string[][]`
12 rows of `[key, module, shape, purpose]`.

### `DESIGN_TOKENS` — `string[][]`
13 rows of `[token, studentValue, adminValue, purpose]`.

---

## 12. `src/data/analytics.js` — the report data engine

### Exports

| Export | Type | Notes |
|---|---|---|
| `REPORT_DAYS` | `number` | `30` — the length of the generated dataset |
| `RANGE_OPTIONS` | `number[]` | `[7, 14, 30]` — the time windows offered on the page |
| `SCOPES` | `{ id, en, mr }[]` | `all`, `project`, `device` |
| `SOURCES` | `{ id, en, mr }[]` | `solver`, `dashboard` |
| `CATEGORY_PROFILE` | `object` | Per-category `weight` (how often it comes up) and `solve` (share solved) |
| `CHART_COLORS` | `object` | `solved` green, `pending` amber, `accent` violet, `neutral` grey |
| `buildProjectDataset(now?, days?)` | `Array<Row>` | Deterministic seeded 30-day sample |
| `readDeviceData()` | `object` | Reads feedback, visits, recents and checklist from `localStorage` |
| `buildAnalytics({ scope, days, now, device })` | `object` | The whole report model |
| `analyticsMarkdown(a, lang)` | `string` | The current numbers as Markdown |
| `matchCategory(text)` | `string` | Maps a free-text title back to a category id |
| `dayKey(date)` / `shortDayLabel(key)` / `weekdayLabel(key, lang)` | `string` | Date helpers |

### `buildAnalytics()` — the report model
```ts
{
  scope: 'all' | 'project' | 'device'
  days: number
  generatedAt: number
  totals: {
    reported: number, solved: number, pending: number, rate: number,
    categories: number, avgSolved: number, avgReported: number, streak: number,
    bestDay: Day | null, busiestDay: Day | null
  }
  daily: { key, label, weekday, at, solved, pending, total, rate, visits }[]
  categories: { id, icon, title: {en, mr}, total, solved, pending, rate, share }[]
  ranked: Category[]        // categories sorted by total (most frequent first)
  pendingRanked: Category[] // categories sorted by pending
  sources: { id, en, mr, count, solved, pending, rate }[]
  weekly: { label, from, to, solved, pending, total, rate }[]
  cumulative: { key, label, value }[]
  hasDeviceData: boolean
  deviceCount: number
  projectCount: number
}
```

### `src/components/Charts.jsx` — chart primitives

| Component | Props | Renders |
|---|---|---|
| `useWidth(fallback)` | — | `[ref, width]` — a `ResizeObserver` width hook |
| `DonutChart` | `segments, size, thickness, gap, center` | Ring chart built from `stroke-dasharray` circles |
| `ColumnChart` | `data, height, series, valueOnTop` | Stacked columns with grid, axis and value labels |
| `AreaChart` | `data, height, color, valueKey, labelKey` | Gradient area + line + points |
| `BarList` | `items, max, suffix` | Ranked horizontal bars, optionally split into parts |
| `SplitBar` | `segments, height` | One 100 % stacked bar |
| `Sparkline` | `data, width, height, color` | Tiny trend line for the KPI cards |
| `Gauge` | `value, size, thickness, color, label` | 180° speedometer with a needle |
| `Legend` | `items` | Colour key with counts |

---

## 13. `public/sw.js` — Service Worker

| Event | Behaviour |
|---|---|
| `install` | Precache `./`, `./index.html`, `./manifest.webmanifest` into cache `edusolve-v5`; then `skipWaiting()`. |
| `activate` | Delete all caches except `edusolve-v5`; then `clients.claim()`. |
| `fetch` (navigation) | Network-first; the response is cached as `./index.html`; on network failure the cached `index.html` is returned. |
| `fetch` (other same-origin GET) | Cache-first; on a miss the response is fetched and cached if `res.ok`. |
| `fetch` (cross-origin or non-GET) | Ignored — the browser handles it. |

---

## 14. `public/manifest.webmanifest`

| Field | Value |
|---|---|
| `name` | `EduSolve AI - Solve Your Online Education Problems` |
| `short_name` | `EduSolve AI` |
| `description` | AI-based demo guidance for college students… |
| `id` / `start_url` / `scope` | `./` |
| `display` | `standalone` |
| `orientation` | `portrait` |
| `background_color` | `#f6f5f2` |
| `theme_color` | `#6d28d9` |
| `icons` | `pwa-192.png` (192×192, any), `pwa-512.png` (512×512, any), `maskable-512.png` (512×512, maskable) |

---

## 15. `vercel.json`

```json
{ "rewrites": [{ "source": "/(.*)", "destination": "/" }] }
```
All routes fall back to `/index.html`. Not strictly required (hash routing), but it keeps deep links safe if the router is ever switched to `BrowserRouter`.

---

## 16. npm scripts API

| Script | Command | Effect |
|---|---|---|
| `npm run dev` | `vite` | Student dev server with HMR, default port 5173 |
| `npm run build` | `vite build` | Production bundle → `dist/` |
| `npm run preview` | `vite preview` | Serves the built `dist/` locally |
| `npm run dev:admin` | `vite --config admin-app/vite.config.js` | Admin dev server, auto port |
| `npm run build:admin` | `vite build --config admin-app/vite.config.js` | Admin bundle → `dist-admin/` |
