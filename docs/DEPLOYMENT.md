# Deployment Guide — EduSolve AI

How to build, publish and host both apps, including the PWA and the admin console.

---

## 1. Build artefacts

| Command | Output | Contents |
|---|---|---|
| `npm run build` | `dist/` | `index.html`, `assets/index-<hash>.js`, `assets/index-<hash>.css`, plus everything in `public/` (`manifest.webmanifest`, `sw.js`, the 4 PNG icons) |
| `npm run build:admin` | `dist-admin/` | `index.html`, `assets/index-<hash>.js`, `assets/index-<hash>.css` |

Both are git-ignored. Both are plain static files — any static host works.

---

## 2. Why `base: './'`

Both Vite configs set:

```js
base: './'
```

This makes every asset URL **relative** (`./assets/index-abc123.js`) instead of absolute (`/assets/...`). That single decision means the exact same build works when served:

- from a domain root — `https://example.com/`
- from a sub-folder — `https://user.github.io/Edusolve/`
- from a nested path on a shared host — `https://example.com/projects/edusolve/`

Do not change it to `/` unless you deploy only at a domain root.

---

## 3. Deploy the student site

### 3.1 Vercel (recommended)

1. Go to [vercel.com](https://vercel.com) → **Add New → Project** → import `https://github.com/NeuralShubh/Edusolve`.
2. Framework preset: **Vite**.
3. Build command: `npm run build`
4. Output directory: `dist`
5. Install command: `npm install`
6. **Deploy.**

`vercel.json` is already committed and handles the SPA fallback:
```json
{ "rewrites": [{ "source": "/(.*)", "destination": "/" }] }
```

**No environment variables are required.** There is no backend, no API key and no database.

To deploy the admin console as a second Vercel project, use:
- Root directory: `admin-app`
- Build command: `npm run build:admin`
- Output directory: `dist-admin` (relative to the repo root — if Vercel resolves it relative to the root directory, set it to `../dist-admin` or change `outDir` to `dist-admin` inside `admin-app`).

### 3.2 GitHub Pages (already live)

The repo has a `gh-pages` branch that holds the built `dist/`.

```bash
npm run build
git checkout gh-pages
# copy the contents of dist/ into the branch root
git add -A
git commit -m "Deploy to GitHub Pages"
git push origin gh-pages
git checkout main
```

On GitHub: **Settings → Pages → Source: Deploy from a branch → `gh-pages` / `root`**.

Live site: **https://neuralshubh.github.io/Edusolve/**

Because routing is hash-based (`#/dashboard`), no 404 fallback file is needed on Pages.

### 3.3 Netlify

| Setting | Value |
|---|---|
| Build command | `npm run build` |
| Publish directory | `dist` |
| Node version | 18 or newer (set `NODE_VERSION` env var if prompted) |

No redirect rules needed (hash routing).

### 3.4 Firebase Hosting

```bash
npm run build
firebase deploy --only hosting
```
`firebase.json`:
```json
{
  "hosting": { "public": "dist", "ignore": ["firebase.json", "**/.*", "**/node_modules/**"] }
}
```

### 3.5 Any static host

Upload the **contents** of `dist/` to the web root. Done.

---

## 4. Deploy the admin console

Build it separately and publish `dist-admin/` as its own site:

```bash
npm run build:admin
```

Recommended: deploy it on a **different hostname** than the student site and put it behind access control.

| Host | How to restrict access |
|---|---|
| **Vercel** | Project → Settings → **Password Protection**, or an IP allowlist on the deployment |
| **Netlify** | Site settings → **Access control → Visitor access → Password** |
| **Cloudflare** | Zero Trust → Access → Applications → Add an application for the admin hostname |
| **GitHub Pages** | Not private — keep it on a separate, unlinked deployment |

The admin HTML already carries `<meta name="robots" content="noindex" />` so it will not be indexed by search engines.

### Admin console origin note — important

The admin console reads the student site's feedback from `localStorage`, and `localStorage` is scoped **per origin** (scheme + host + port).

| Deployment | Same origin? | Result |
|---|---|---|
| Student at `example.com` + admin at `admin.example.com` | **No** | Different origins → the admin shows only its own seeded data |
| Student at `example.com` + admin at `example.com/admin/` | **Yes** | The admin sees the real feedback |
| Both served from `localhost:5173` in dev | **Yes** | Shared data |

This is a **demo limitation**, not a bug — the project has no server, so there is no shared database. For a production version you would add a small backend and replace `src/lib/store.js` with API calls; the admin UI would not need to change beyond its data source.

---

## 5. PWA / installability

The student site ships as an installable PWA.

### Files

| File | Role |
|---|---|
| `public/manifest.webmanifest` | Name, colours, icons, `display: standalone`, `start_url: ./` |
| `public/sw.js` | Service worker: offline app shell + runtime caching |
| `public/pwa-192.png` | 192×192 any-purpose icon |
| `public/pwa-512.png` | 512×512 any-purpose icon |
| `public/maskable-512.png` | 512×512 maskable icon (Android adaptive) |
| `public/apple-touch-icon.png` | iOS home-screen icon (180×180) |
| `index.html` | `<link rel="manifest">`, `<link rel="apple-touch-icon">`, `apple-mobile-web-app-*` meta tags, `theme-color` |

### How it is registered

`src/main.jsx`:
```js
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js').catch(() => {})
  })
}
```
Only in production builds — during development the service worker would fight with Vite's HMR.

### Install on Android / Chrome

1. Visit the deployed site over **HTTPS**.
2. Chrome shows an "Install app" prompt, or use **⋮ → Add to Home screen**.
3. The app opens standalone with the `pwa-192.png` icon and the `#6d28d9` theme colour.

### Install on iOS / Safari

Share → **Add to Home Screen**.

### Install on Windows / Edge

The address bar shows an install icon → click it.

### Verify in DevTools

`Application` tab:
- **Manifest** — name, icons, colours parsed without errors.
- **Service Workers** — `sw.js` registered and *activated*.
- **Cache Storage** — cache `edusolve-v5` containing `index.html` and the manifest.

### Offline behaviour

| Request type | Strategy | Offline result |
|---|---|---|
| Navigation (any route) | network-first, cache fallback to `./index.html` | The app shell loads and the hash router still works |
| JS / CSS / images | cache-first, then network | Cached assets are served instantly |

### Updating the service worker

Bump the cache name in `public/sw.js` whenever you change the shell:
```js
const CACHE = 'edusolve-v5'   // → 'edusolve-v6'
```
The `activate` handler deletes every cache with a different name, so users get the new shell on the next load.

---

## 6. Environment variables

**None are required.** The project reads no environment variables.

`import.meta.env.PROD` is used in `src/main.jsx` only to gate the service-worker registration. If you later add a backend, Vite exposes variables prefixed with `VITE_` (for example `VITE_API_URL`) — but nothing of the sort exists today.

---

## 7. Post-deploy checklist

| # | Check | Expected |
|---|---|---|
| 1 | Open the deployed URL | The Home hero renders with the violet theme and Sora/Manrope fonts |
| 2 | Open the browser console | **No errors** (no 404s for the manifest, icons or `sw.js`) |
| 3 | Toggle the language | The entire UI switches to Marathi |
| 4 | Navigate to `#/dashboard`, `#/solver`, `#/tools` | All three render |
| 5 | Type "payment failed" in the Solver | The Payment category is detected and 2 follow-ups appear |
| 6 | Use the file checker | A real size/format verdict appears |
| 7 | Resize a photo | A real JPG downloads at the requested dimensions |
| 8 | Refresh the page | Language, saved solutions, checklists and recents all persist |
| 9 | Install as an app (Android/Edge) | The standalone window opens with the correct icon |
| 10 | Go offline and reload | The app shell still loads |

---

## 8. Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| 404 on `/assets/...` | `base` was changed to `/` | Restore `base: './'` and rebuild |
| Blank page after deploy on Pages | Wrong publish folder | Publish the branch root containing `index.html`, not `dist/dist` |
| Manifest shows an error | `manifest.webmanifest` not copied | It must be in `public/` (Vite copies `public/` verbatim) |
| Service worker not registering | Dev mode, or non-HTTPS | Build for production and serve over HTTPS |
| Stale content after a deploy | Old cache | Bump `CACHE` in `public/sw.js`; or DevTools → Application → Clear storage |
| Fonts fall back to a serif | Google Fonts blocked/offline | Acceptable — the `Segoe UI`/`system-ui` fallback stack applies |
| Admin shows no feedback | Different origin | See §4 |
| `npm run build:admin` outputs to the wrong place | `outDir` is resolved from `admin-app/` | Keep `path.resolve(dir, '../dist-admin')` |
