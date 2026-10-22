?# Languages — EduSolve AI

This document answers every "which language" question about the project, and shows how to add a new UI language.

---

## 1. Programming languages used

| # | Language | Extension(s) | Where it appears | Purpose |
|---|---|---|---|---|
| 1 | **JavaScript (ES2022, ES modules)** | `.js` | `vite.config.js`, `admin-app/vite.config.js`, `public/sw.js` | Build configuration, service worker, all non-JSX logic |
| 2 | **JSX** | `.jsx` | `src/main.jsx`, `src/App.jsx`, `src/context/LanguageContext.jsx`, `src/components/*.jsx`, `src/pages/*.jsx`, `admin-app/src/main.jsx`, `admin-app/src/App.jsx` | All React components |
| 3 | **CSS** | `.css` | `src/index.css` (34.4 KB), `admin-app/src/admin.css` (19.7 KB) | The entire design system — no preprocessor, no framework |
| 4 | **HTML** | `.html` | `index.html`, `admin-app/index.html` | Minimal SPA shells with an inline SVG data-URI favicon |
| 5 | **JSON** | `.json` | `package.json`, `package-lock.json`, `vercel.json`, `public/manifest.webmanifest` | Package metadata, lockfile, SPA rewrite rules, PWA manifest |
| 6 | **Batch / CMD** | `.bat` | `start-edusolve.bat` | Windows double-click dev launcher |
| 7 | **XML** | `.webmanifest` | `public/manifest.webmanifest` | W3C Web App Manifest (JSON syntax, XML-style file extension) |

**Not used:** TypeScript, Python, Java, PHP, Node/Express, MongoDB, MySQL, Tailwind, Bootstrap, Sass/Less, Redux, Axios, any icon or UI library.

`package.json` declares `"type": "module"`, so every `.js` file is an ES module and `import`/`export` work everywhere.

---

## 2. Frameworks, libraries and tools

### Runtime dependencies (3)

| Package | Version | Role |
|---|---|---|
| `react` | `^18.3.1` | Component model, hooks, context |
| `react-dom` | `^18.3.1` | DOM renderer, `createRoot` |
| `react-router-dom` | `^6.23.1` | `HashRouter`, `Routes`, `Route`, `Link`, `NavLink`, `useNavigate`, `useSearchParams` |

### Dev dependencies (2)

| Package | Version | Role |
|---|---|---|
| `vite` | `^5.4.8` | Dev server (HMR), production bundler, `import.meta.env.PROD` |
| `@vitejs/plugin-react` | `^4.3.3` | JSX transform + React Fast Refresh |

### Build / deploy tooling

| Tool | Config file | Notes |
|---|---|---|
| **Vite 5** | `vite.config.js`, `admin-app/vite.config.js` | Both use `base: './'` for relative asset URLs |
| **Vercel** | `vercel.json` | `rewrites` → SPA fallback |
| **GitHub Pages** | `gh-pages` branch | Publishes the built `dist/` |
| **Service Worker** | `public/sw.js` | Offline app shell, cache `edusolve-v5` |
| **Web App Manifest** | `public/manifest.webmanifest` | PWA installability |
| **Google Fonts** | CSS `@import` | Sora, Manrope, Noto Sans Devanagari |

---

## 3. Human-facing UI languages

The application ships in **two** interface languages, both complete (no half-translated screens).

| Code | Language | Native name | Script | Direction |
|---|---|---|---|---|
| `en` | English | English | Latin | Left-to-right |
| `mr` | Marathi | मराठी | Devanagari | Left-to-right |

### Where each language lives

| Content | File | Coverage |
|---|---|---|
| UI chrome (nav, hero, buttons, footer, headings) | `src/i18n/translations.js` → `STRINGS.en` / `STRINGS.mr` | 60 keys × 2 languages |
| Category titles & descriptions | `src/data/categories.js` → `title: {en, mr}`, `desc: {en, mr}` | 12 × 2 × 2 |
| Solution content (causes, steps, prevention, alternative) | `src/data/categories.js` → `SOLUTIONS[*]` | 12 categories × 2 languages |
| Follow-up questions | `src/data/categories.js` → `followups[].q.{en,mr}` | 24 questions × 2 languages |
| Detection keywords | `src/data/categories.js` → `keywords[]` | English **and** Marathi keywords per category |
| Tool checklists | `src/pages/Tools.jsx` → `LISTS[*]` items `{ en, mr }` | 15 items × 2 languages |
| Tool names & descriptions | `src/pages/Tools.jsx` → `TOOLS[*]` `{ en, mr }` | 6 tools × 2 languages |
| Dashboard checklist | `src/pages/Dashboard.jsx` → `DASH_CHECKS` | 5 items × 2 languages |
| Fallback solution | `src/engine/solverEngine.js` → `fallbackSolution(lang)` | Full EN and MR versions |
| Admin console UI | `admin-app/src/App.jsx` | Inline `lang === 'mr' ? … : …` per panel |

### Where the choice is stored

| Surface | `localStorage` key | Default |
|---|---|---|
| Student site | `edusolve_lang` | `"en"` |
| Admin console | `edusolve_admin_lang` | `"en"` |

The two are **independent** — an operator can run the admin cabinet in Marathi while the student site stays in English.

### Accessibility detail

On every language change the app sets `document.documentElement.lang` to `"en"` or `"mr"`. This makes screen readers announce the correct language and lets Chrome/Firefox offer a page translation only when it would actually help.

### Fonts

| Font | Weights | Used for |
|---|---|---|
| **Sora** | 500, 600, 700, 800 | Headings, brand wordmark, KPI numbers |
| **Manrope** | 400, 500, 600, 700, 800 | Body copy, buttons, inputs, tables |
| **Noto Sans Devanagari** | 400, 500, 600, 700 | Every Marathi string (falls back to it automatically) |

Fallback stack for all three: `'Segoe UI', system-ui, -apple-system, Arial, sans-serif`.

---

## 4. Language detection & keyword matching

The category detector is **bilingual by design**. Each category carries Marathi keywords, so a student typing in Marathi is classified correctly.

| Category | English keywords | Marathi keywords |
|---|---|---|
| `internet` | internet, wifi, wi-fi, network, data, slow, timeout, time out, offline | इंटरनेट, नेट, वायफाय, स्लो |
| `server` | server, 500, 404, loading, load, crash, down, blank, error, deadline | सर्व्हर, लोड, त्रुटी, साइट |
| `otp` | otp, login, log in, sign in, mobile, number, verify, verification, resend | लॉगिन, ओटीपी, मोबाईल, पडताळणी |
| `password` | password, forgot, reset, locked, remember | पासवर्ड, विसर |
| `form-entry` | instruction, entry, field, name, dob, date of birth, mismatch, spell, column, form fill | माहिती, नाव, सूचना, फॉर्म |
| `doc-upload` | upload, attach, document, certificate, caste, income, domicile, marksheet | अपलोड, कागदपत्र, दाखला |
| `file-size` | size, large, kb, mb, format, pdf, jpg, jpeg, png, extension, limit | आकार, प्रकार, फॉरमॅट |
| `photo` | photo, signature, selfie, background, pixel, dimension, blur | फोटो, सही |
| `payment` | payment, pay, upi, card, transaction, deduct, failed, receipt, refund | पेमेंट, पैसे, पावती |
| `submission` | submit, submission, acknowledg, reference, final submit, preview | सबमिट, पोच |
| `reload` | reload, refresh, reset, back, lost, erase, wiped, draft, save draft | रिफ्रेश, रीसेट, माहिती गेली |
| `other` | *(none — the fallback)* | — |

Matching is **substring-based** (`text.includes(keyword)`) after lowercasing, so `"OTP"`, `"Otp"` and `"otp"` all match, and `"payment"` matches inside `"payment failed"`.

---

## 5. Adding a new UI language (e.g. Hindi)

Six steps. The whole i18n system is a plain object — no library, no build step, no key extraction.

### Step 1 — Extend `STRINGS` in `src/i18n/translations.js`

```js
export const STRINGS = {
  en: { /* … unchanged … */ },
  mr: { /* … unchanged … */ },
  hi: {
    nav_home: 'होम',
    nav_dashboard: 'डैशबोर्ड',
    nav_solver: 'AI समस्या समाधानकर्ता',
    nav_tools: 'स्मार्ट टूल्स',
    nav_about: 'परिचय',
    hero_badge: 'छात्रों के लिए चरण-दर-चरण समाधान',
    hero_title_a: 'अपनी ऑनलाइन शिक्षा',
    hero_title_b: 'समस्याओं को AI से हल करें',
    hero_desc: '…',
    start_solving: 'हल करना शुरू करें',
    explore_problems: 'समस्याएँ देखें',
    // … add ALL remaining keys from the en branch …
  },
}
```

> **Rule: every key present in `en` must exist in the new language.** The UI reads `STRINGS[lang].some_key` directly, so a missing key renders `undefined`. A quick check:
> ```bash
> node -e "const s=require('./src/i18n/translations.js')"   # ESM — use: node --input-type=module -e "..."
> ```

### Step 2 — Teach the context about the new code

`src/context/LanguageContext.jsx`:

```js
const LANGUAGES = [
  { code: 'en', label: 'English', native: 'English' },
  { code: 'mr', label: 'Marathi', native: 'मराठी' },
  { code: 'hi', label: 'Hindi',   native: 'हिन्दी' },
]

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => {
    try { return localStorage.getItem('edusolve_lang') || 'en' } catch { return 'en' }
  })
  useEffect(() => {
    try { localStorage.setItem('edusolve_lang', lang) } catch {}
    document.documentElement.lang = lang
  }, [lang])
  const toggle = () => setLang((l) => (l === 'en' ? 'mr' : 'en'))   // ← replace with a cycle over LANGUAGES
  ...
}
```

A single button with 2 languages toggles between them; with 3+, replace the `toggle` with a dropdown or cycle through `LANGUAGES`.

### Step 3 — Add the content for the new language

`src/data/categories.js` — for each of the 12 categories:

```js
title: { en: '…', mr: '…', hi: '…' },
desc:  { en: '…', mr: '…', hi: '…' },
keywords: [ …, 'इंटरनेट', 'नेट', …, 'इंटरनेट' /* Hindi variants */ ],
```

and in `SOLUTIONS`:

```js
causes:     { en: [...], mr: [...], hi: [...] },
steps:      { en: [...], mr: [...], hi: [...] },
prevention: { en: [...], mr: [...], hi: [...] },
alternative:{ en: '…', mr: '…', hi: '…' },
followups: [ { q: { en: '…', mr: '…', hi: '…' }, options: [...] }, … ],
```

### Step 4 — Translate the checklists

`src/pages/Tools.jsx` (`LISTS`, `TOOLS`) and `src/pages/Dashboard.jsx` (`DASH_CHECKS`): add a third key to every `{ en, mr }` object.

### Step 5 — Update the fallback

`src/engine/solverEngine.js` → `fallbackSolution(lang)` currently handles only `en` and `mr`. Generalise it:

```js
export function fallbackSolution(lang = 'en') {
  const pack = {
    en: { title: 'Other Educational Service Problems', /* … */ },
    mr: { title: 'इतर शैक्षणिक सेवा समस्या', /* … */ },
    hi: { title: 'अन्य शैक्षणिक सेवा समस्याएँ', /* … */ },
  }
  const p = pack[lang] || pack.en
  return { categoryId: 'other', icon: 'bulb', causes: p.causes, steps: p.steps, prevention: p.prevention, alternative: p.alternative }
}
```

### Step 6 — Fonts and the admin console

- **Font:** Devanagari fonts already cover Hindi. For a non-Devanagari script (Bengali, Tamil, Telugu, Gujarati, Kannada, Malayalam, Odia, Punjabi) add a Google Font for that script to the `@import` at the top of `src/index.css` and `admin-app/src/admin.css`, and add it to the `font-family` fallback chain.
- **Admin console:** `admin-app/src/App.jsx` has its own `lang` state and inline `lang === 'mr' ? … : …` expressions. Translate those too, or refactor them to a `STRINGS`-style object first.
- **`<html lang>`:** set to the new code so screen readers and browser translation prompts behave.

### Checklist before shipping a new language

- [ ] Every key in `STRINGS.en` exists in the new branch.
- [ ] All 12 categories have `title`, `desc` and translations for `causes`, `steps`, `prevention`, `alternative`, `followups[].q`.
- [ ] Marathi/Hindi keywords added to `keywords[]` for every category.
- [ ] `LISTS`, `TOOLS`, `DASH_CHECKS` items translated.
- [ ] `fallbackSolution()` handles the new code.
- [ ] `document.documentElement.lang` set correctly.
- [ ] A script-appropriate font is loaded and listed in the `font-family` chain.
- [ ] The admin console was translated too.
- [ ] Toggle tested: switch language → reload → the choice persisted.

---

## 6. Internationalisation summary table

| Aspect | Current state | How to extend |
|---|---|---|
| UI strings | `STRINGS.en` / `STRINGS.mr` in one file | Add a branch to `STRINGS` |
| Content strings | Bilingual objects inline in `categories.js` / `Tools.jsx` / `Dashboard.jsx` | Add a key to each object |
| Language persistence | `localStorage['edusolve_lang']` | Unchanged — the key stores whatever code you set |
| `<html lang>` | Set from the `LanguageContext` effect | Use the raw code instead of the `en/mr` ternary |
| Toggle UI | One button in 4 places (navbar, sidebar, mobile menu, mobile tab bar) | For 3+ languages, convert to a dropdown |
| Font coverage | Latin + Devanagari | Add a font per script |
| RTL support | Not implemented (no RTL language yet) | Add `[dir="rtl"]` CSS rules for Arabic/Hebrew/Urdu |
| Number/date locale | `toLocaleDateString('en-GB', …)` in the admin console | Pass the active locale code instead |
