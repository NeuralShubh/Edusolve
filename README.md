# EduSolve AI

**AI-Based Solution System for Difficulties Faced by College Students While Using Online Educational Services.**

College project. **Frontend only.** No backend, no database, no real AI. Demo rule-based engine + real in-browser file tools.

## Features
- Home: hero, popular categories, How It Works, features
- Dashboard: search, 12 categories, recently viewed, saved, checklists (localStorage)
- AI Problem Solver: chatbot, keyword detection, 2 follow-up questions, causes / steps / prevention / alternative, Solved / Not Solved, fallback
- Smart Tools: doc checklist, real file size/format checker, photo+signature resizer (Canvas, real download), form-filling + pre-submission + required-docs checklists
- English + Marathi toggle (persisted)
- Responsive blue/white + violet theme with SVG icons

## The 12 categories
Internet, Server errors, Login/OTP, Forgotten password, Form entry, Document upload, File size/format, Photo/signature, Payment failures, Submission failures, Reload/reset, Other.

## Run locally
```bash
npm install
npm run dev
```
Open the URL shown (usually http://localhost:5173).

## Build
```bash
npm run build
```
Output goes to `dist/`. Preview with `npm run preview`.

## Live site (GitHub Pages)
Built `dist` output is published from the `gh-pages` branch:
https://neuralshubh.github.io/Edusolve/

## Deploy on Vercel
1. Go to vercel.com, Add New, Project, import your GitHub repo.
2. Framework Preset: **Vite**. Build command: `npm run build`. Output: `dist`.
3. Deploy. No env variables needed.

## Safety / honesty notes
- Never asks for passwords, OTPs, CVVs or bank PINs.
- Does not repair third-party sites or confirm payments. For deducted money, check bank/UPI app + official helpline with UTR.
- Files are checked locally; nothing is uploaded.
