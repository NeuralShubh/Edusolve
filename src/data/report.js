// Project report content for the in-app Report section.
// Bilingual: every user-visible string is { en, mr }. A table cell may be a plain
// string (language independent) or { en, mr } (auto-switching).
import { CATEGORIES, SOLUTIONS } from './categories'

export const REPORT_META = {
  title: 'EduSolve AI',
  subtitle: {
    en: 'AI-Based Solution System for Difficulties Faced by College Students While Using Online Educational Services',
    mr: 'महाविद्यालयीन विद्यार्थ्यांना ऑनलाइन शैक्षणिक सेवांचा वापर करताना येणाऱ्या अडचणींसाठी AI-आधारित समाधान प्रणाली',
  },
  tagline: {
    en: 'Step-by-step student guidance. English + Marathi. Frontend only. Works offline. Nothing is uploaded.',
    mr: 'विद्यार्थ्यांसाठी टप्प्याटप्प्याने मार्गदर्शन. इंग्रजी + मराठी. फक्त फ्रंटएंड. ऑफलाइन चालते. काहीही अपलोड होत नाही.',
  },
  version: '1.0.0',
  type: 'College Project — Frontend-only demonstration',
  typeMr: 'कॉलेज प्रकल्प — फक्त फ्रंटएंड डेमो',
  repo: 'https://github.com/NeuralShubh/Edusolve',
  live: 'https://neuralshubh.github.io/Edusolve/',
  academicYear: '2025 — 2026',
  institution: 'Department of Computer Engineering',
}

export const REPORT_SECTIONS = [
  {
    id: 'abstract',
    no: '01',
    icon: 'bookmark',
    en: 'Abstract',
    mr: 'सारांश',
    blocks: [
      {
        t: 'p',
        en: 'Indian college students interact with online scholarship, admission and examination portals every year. A large share of their time and money is lost to a small set of recurring, well-documented problems: OTP messages that never arrive, photographs rejected for wrong dimensions or excessive file size, documents refused because the extension or size is wrong, payments deducted with no receipt, forms whose submit button does nothing, and pages that lose everything on a refresh. Official help desks are frequently unreachable, and general search results are crowded by fraudulent agents who demand money for "guaranteed approval".',
        mr: 'भारतीय महाविद्यालयीन विद्यार्थी दरवर्षी ऑनलाइन शिष्यवृत्ती, प्रवेश व परीक्षा पोर्टल वापरतात. त्यांचा मोठा वेळ व पैसा काही ठराविक, नेहमीच्या अडचणींमध्ये जातो: OTP कधीच येत नाही, फोटो चुकीच्या आकारामुळे नाकारला जातो, कागदपत्र चुकीच्या प्रकार व आकारामुळे रद्द होते, पैसे कपात होऊन पावती मिळत नाही, सबमिट बटण काम करत नाही, आणि पेज रिफ्रेश केल्यावर सर्व माहिती जाते. अधिकृत मदत कक्षांवर नेहमीच प्रश्न नाहीत, आणि शोध निकालांत "मंजुरीची हमी" देणारे फसदार एजंट भरलेले असतात.',
      },
      {
        t: 'p',
        en: 'EduSolve AI is a bilingual (English + Marathi) web application that gives a student a clear, categorised, step-by-step answer to these problems. It detects the likely problem type from the student\'s own sentence using a transparent keyword-scoring engine, asks two short clarifying questions, and returns a structured answer containing probable causes, an ordered fix, prevention advice and an alternative route if the fix fails. Alongside the guidance, the application ships genuinely functional browser tools: a file extension and size validator that reads the real file metadata, and a Canvas-based photo and signature resizer that produces and downloads a real JPEG at the exact dimensions and size the portal demands. A separate admin console aggregates student Solved / Not Solved feedback, solved-rate analytics, a daily visit chart and per-category feature flags.',
        mr: 'EduSolve AI ही द्विभाषिक (इंग्रजी + मराठी) वेब ॲप्लिकेशन आहे जे विद्यार्थ्याला या अडचणींचे स्पष्ट, वर्गीकृत आणि टप्प्याटप्प्याने उत्तर देते. विद्यार्थ्याच्या स्वतःच्या वाक्यातून पारदर्शक कीवर्ड-स्कोरिंग इंजिनद्वारे समस्येचा प्रकार ओळखते, दोन छोटी स्पष्टीकरण प्रश्न विचारते, आणि संभाव्य कारणे, क्रमानुसार उपाय, प्रतिबंध टिपा आणि पर्यायी मार्ग यांचे संरचित उत्तर देते. या मार्गदर्शनासोबत ॲपमध्ये खरे काम करणारी ब्राउझर साधनेही आहेत: फाइलची प्रत्यक्ष माहिती तपासणारा प्रकार व आकार तपासणी साधन, आणि Canvas-आधारित फोटो व सही रिसायझर जे पोर्टलला हवी तेवढ्या आकारात खरा JPEG तयार करून डाउनलोड करते. एक स्वतंत्र प्रशासन कॅबिनेट विद्यार्थ्यांचा सोडवले / सुटले नाही अभिप्राय, सोडवलेल्या दराची आकडेवारी, दैनंदिन भेटींचा आलेख आणि प्रकारानुसार फीचर फ्लॅग एकत्र करते.',
      },
      {
        t: 'p',
        en: 'The project is deliberately frontend-only. There is no backend, no database and no external AI API. Every byte of student data stays in the student\'s own browser through localStorage, and every file operation runs on the user\'s own device. The result is a system that is fast, free to run, works offline, transparent enough to defend in an examination, and safe by construction.',
        mr: 'हे प्रकल्प जाणीवपूर्वक फक्त फ्रंटएंड आहे. कोणतेही बॅकएंड, डेटाबेस किंवा बाह्य AI API नाही. विद्यार्थ्याचा प्रत्येक डेटा त्याच्या स्वतःच्या ब्राउझरमध्ये localStorage मध्ये सुरक्षित राहतो, आणि प्रत्येक फाइल ऑपरेशन त्याच्या स्वतःच्या डिव्हाइसवरच चालते. परिणामी ही प्रणाली वेगवान, विनामूल्य, ऑफलाइन चालणारी, परीक्षेसाठी पुरेसी पारदर्शक आणि स्वतःच्या रचनेमुळे सुरक्षित ठरते.',
      },
    ],
  },
  {
    id: 'problem',
    no: '02',
    icon: 'alert',
    en: 'Problem Statement',
    mr: 'समस्येचे निवेदन',
    blocks: [
      {
        t: 'p',
        en: 'Online educational services in India — the National Scholarship Portal, state scholarship portals, university admission portals, and examination portals — are designed for a wide range of users but are operated by first-time applicants with no technical support, usually on a low-end Android phone and frequently on a slow or metered connection. The result is a gap: the student knows exactly what they want to submit, but the portal rejects the submission for a reason that is never explained.',
        mr: 'भारतातील ऑनलाइन शैक्षणिक सेवा — राष्ट्रीय शिष्यवृत्ती पोर्टल, राज्य शिष्यवृत्ती पोर्टल, विद्यापीठ प्रवेश पोर्टल आणि परीक्षा पोर्टल — मोठ्या प्रकारातील वापरकर्त्यांसाठी तयार केलेली असतात, पण त्यांचा वापर अस्सलेला फार जून, तांत्रिक सहाय्य नसलेला विद्यार्थी सामान्यतः कमी क्षमतेच्या Android फोनवर आणि बरेचदा मर्यादित किंवा हळू कनेक्शनवर करतो. त्यामुळे एक खरीली तळबी वाटते: विद्यार्थ्याला नेमके काय सबमिट करायचे आहे हे माहीत असते, पण पोर्टल ते कधीही कारण न सांगता नाकारते.',
      },
      {
        t: 'p',
        en: 'The specific failure modes observed and handled by this project are enumerated in Section 05 — The Twelve Problem Categories. They were chosen because they are the issues most frequently raised by first-year students and most often resolved by a short, well-ordered set of steps that no official document provides.',
        mr: 'या प्रकल्पाने हाताळलेल्या विशिष्ट अडचणींची यादी कलम ०५ — बारा समस्या प्रकारांमध्ये दिली आहे. या प्रकार निवडले कारण ते पहिल्या वर्षाच्या विद्यार्थ्यांकडून सर्वाधिक विचारले जाणारे प्रश्न आहेत आणि ते अधिकृत कोणत्याही कागदपत्रात सापडणार नसलेल्या थोड्या, नीट क्रमानुसार पायऱ्यांनी सोडवता येतात.',
      },
      {
        t: 'ul',
        en: [
          'No official troubleshooting guide exists for individual error messages.',
          'Help desks are reachable only during working hours and only by phone.',
          'Generic web results surface paid agents, not instructions.',
          'Common Service Centres (where students often apply) frequently have slow or no internet.',
          'The student cannot tell whether a payment actually succeeded or the money is simply lost.',
        ],
        mr: [
          'प्रत्येक तपशीलवार त्रुटीसंदेशासाठी अधिकृत मदत मार्गदर्शकन नाही.',
          'मदत कक्ष केवळ कार्यवेळातच आणि फोनवरच उपलब्ध असतात.',
          'सामान्य वेब शोधात पैसे घेणारे एजंट येतात, सूचना नाहीत.',
          'ज्या ठिकाणी विद्यार्थी अर्ज करतात अशा सामान्य सेवा केंद्रांत इंटरनेट अनेकदा हळू किंवा नसते.',
          'पेमेंट खरंच झाले की पैसा नष्ट झाला, हे विद्यार्थ्याला कळत नाही.',
        ],
      },
    ],
  },
  {
    id: 'objectives',
    no: '03',
    icon: 'target',
    en: 'Objectives',
    mr: 'उद्देश',
    blocks: [
      {
        t: 'ol',
        en: [
          'Identify and classify the recurring categories of difficulty faced by college students while using online educational services.',
          'Provide an easy, jargon-free, step-by-step remedy for each identified category.',
          'Offer practical utilities that genuinely reduce the friction of online form submission — file validation, image resizing and document checklists.',
          'Support the target user base in their own language — English and Marathi, with a single toggle.',
          'Collect structured feedback so that the effectiveness of each solution can be measured.',
          'Guarantee privacy and safety: no credentials, no uploads, no server-side data collection.',
          'Keep the system simple enough to demonstrate, deploy and explain within a college project.',
        ],
        mr: [
          'महाविद्यालयीन विद्यार्थ्यांना ऑनलाइन शैक्षणिक सेवांचा वापर करताना येणार्या नेहमीच्या अडचणींचा प्रकार ओळखणे आणि वर्गीकृत करणे.',
          'प्रत्येक ओळखलेल्या प्रकारासाठी सोपा, तांत्रिक शब्दांमुक्त, टप्प्याटप्प्याने उपाय पुरवणे.',
          'ऑनलाइन फॉर्म भरण्याची अडचणी खरी कमी करणारी व्यावहारिक साधने देणे — फाइल तपासणी, प्रतिमा रिसायझिंग आणि कागदपत्र याद्या.',
          'वापरकर्ता वर्गाला त्याच्याच भाषेत सहाय्य देणे — इंग्रजी आणि मराठी, एका बटणाने.',
          'संरचित अभिप्राय गोळा करणे जेणेकरून प्रत्येक उपायाची कार्यक्षमता मोजता यावी.',
          'गोपनीयता आणि सुरक्षा हमी दिली: पासवर्ड नाहीत, अपलोड नाही, सर्व्हर-साइड डेटा संचयन नाही.',
          'प्रणाली कॉलेज प्रकल्पाच्या आतल्या आवृत्तीत दाखवण्यासारखी, उपयोजित करण्यासारखी आणि स्पष्ट करण्यासारखी सोपी ठेवणे.',
        ],
      },
    ],
  },
  {
    id: 'scope',
    no: '04',
    icon: 'compass',
    en: 'Scope of the Project',
    mr: 'प्रकल्पाची व्याप्ती',
    blocks: [
      {
        t: 'h3',
        en: 'In scope',
        mr: 'व्याप्तीत',
      },
      {
        t: 'ul',
        en: [
          'Twelve predefined problem categories with complete bilingual solution content.',
          'A rule-based natural-language classifier for those categories, with bilingual keyword sets.',
          'A conversational guidance flow with two clarifying follow-up questions.',
          'A student dashboard with search, recently viewed, saved solutions and progress checklists.',
          'Six Smart Tools, of which two perform genuine local file processing.',
          'A standalone admin console with feedback analytics and category feature flags.',
          'Progressive Web App support — installable and offline-capable.',
          'Full English + Marathi localisation with a single toggle.',
        ],
        mr: [
          'संपूर्ण द्विभाषिक उपाय मजकूरासह बारा पूर्वनिश्चित समस्या प्रकार.',
          'त्या प्रकारांसाठी नियमाधारित नैसर्गिक भाषा वर्गीकारक, द्विभाषिक कीवर्ड संचासह.',
          'दोन स्पष्टीकरण प्रश्नांसह संवादी मार्गदर्शन प्रवाह.',
          'शोध, अलीकडे पाहिलेले, जतन केलेले उपाय आणि प्रगती याद्यांसह विद्यार्थी डॅशबोर्ड.',
          'सहा स्मार्ट साधने, ज्यांत दोन खरे स्थानिक फाइल प्रक्रिया करतात.',
          'अभिप्राय आकडेवारी आणि प्रकार फीचर फ्लॅगसह स्वतंत्र प्रशासन कॅबिनेट.',
          'प्रोग्रेसिव्ह वेब ॲप सपोर्ट — इन्स्टॉल करता येणारे आणि ऑफलाइन वापरता येणारे.',
          'एका बटणाने संपूर्ण इंग्रजी + मराठी स्थानीकरण.',
        ],
      },
      {
        t: 'h3',
        en: 'Explicitly out of scope',
        mr: 'स्पष्टपणे व्याप्तीबाहेर',
      },
      {
        t: 'ul',
        en: [
          'Any connection to a real government, university or payment website.',
          'Any real AI or large-language-model integration.',
          'Payment verification or transaction confirmation.',
          'Repairing, scraping or automating third-party portals.',
          'Real user accounts, authentication, or a shared database.',
          'Cloud analytics or cross-device synchronisation.',
        ],
        mr: [
          'कोणत्याही शासकीय, विद्यापीठीय किंवा पेमेंट वेबसाइटशी कोणताही जोडणी.',
          'कोणतेही खरे AI किंवा मोठ्या भाषा मॉडेलचे एकात्मीकरण.',
          'पेमेंट पुष्टी किंवा व्यवहार सत्यापन.',
          'तृतीय पक्षाच्या पोर्टलांची दुरुस्ती, स्क्रॅपिंग किंवा स्वयंचालन.',
          'खरे वापरकर्ता खाते, प्रमाणीकरण किंवा सामायिक डेटाबेस.',
          'क्लाउड ॲनालिटिक्स किंवा डिव्हाइसंतील सिंक्रोनायझेशन.',
        ],
      },
    ],
  },
  {
    id: 'tech',
    no: '05',
    icon: 'cpu',
    en: 'Technology Stack & Languages',
    mr: 'तंत्रज्ञान स्टॅक व भाषा',
    blocks: [
      {
        t: 'h3',
        en: 'Programming languages used',
        mr: 'वापरलेल्या प्रोग्रॅमिंग भाषा',
      },
      {
        t: 'table',
        head: ['Language', 'Extension', 'Where it is used', 'Purpose'],
        rows: [
          ['JavaScript (ES2022)', '.js', 'vite.config.js, admin-app/vite.config.js, public/sw.js', 'Build configuration, service worker, all non-JSX logic'],
          ['JSX', '.jsx', 'All 11 component files across src/ and admin-app/src/', 'Every React component'],
          ['CSS', '.css', 'src/index.css (34.4 KB), admin-app/src/admin.css (19.7 KB)', 'The entire design system — no framework, no preprocessor'],
          ['HTML', '.html', 'index.html, admin-app/index.html', 'Minimal SPA shells with an inline SVG favicon'],
          ['JSON', '.json', 'package.json, vercel.json, manifest.webmanifest', 'Package metadata, SPA rewrite rules, PWA manifest'],
          ['Batch (Windows)', '.bat', 'start-edusolve.bat', 'One-click development launcher'],
        ],
      },
      {
        t: 'h3',
        en: 'Frameworks and libraries',
        mr: 'फ्रेमवर्क आणि लायब्ररी',
      },
      {
        t: 'table',
        head: ['Package', 'Version', 'Role'],
        rows: [
          ['react', '^18.3.1', 'Component model, hooks, context'],
          ['react-dom', '^18.3.1', 'DOM renderer, createRoot'],
          ['react-router-dom', '^6.23.1', 'HashRouter, Routes, Route, Link, NavLink, useNavigate, useSearchParams'],
          ['vite', '^5.4.8 (dev)', 'Dev server with HMR, production bundler, import.meta.env.PROD'],
          ['@vitejs/plugin-react', '^4.3.3 (dev)', 'JSX transform and React Fast Refresh'],
        ],
      },
      {
        t: 'note',
        en: 'Total runtime dependencies: 3. No UI library, no icon package (43 hand-written inline SVG icons), no state library, no HTTP client, no date library. The entire student bundle is 240 KB raw / 82 KB gzipped.',
        mr: 'एकूण रनटाइम डिपेंडन्सी: 3. कोणतीही UI लायब्ररी नाही, आयकॉन पॅकेज नाही (४३ हाताने लिहिलेले इनलाइन SVG आयकॉन), स्टेट लायब्ररी नाही, HTTP क्लायंट नाही, तारीख लायब्ररी नाही. संपूर्ण विद्यार्थी बंडल २४० KB (८२ KB gzipped) आहे.',
      },
      {
        t: 'h3',
        en: 'User-interface languages',
        mr: 'वापरकर्ता-इंटरफेस भाषा',
      },
      {
        t: 'table',
        head: ['Code', 'Language', 'Script', 'Coverage'],
        rows: [
          ['en', { en: 'English', mr: 'इंग्रजी' }, 'Latin', '100% — every UI string, category, solution and tool'],
          ['mr', { en: 'Marathi', mr: 'मराठी' }, 'Devanagari', '100% — every UI string, category, solution and tool'],
        ],
      },
      {
        t: 'p',
        en: 'The interface ships in exactly two languages, switched by one button present in the navbar, the sidebar, the mobile menu and the mobile tab bar. The choice is persisted to localStorage under edusolve_lang, and document.documentElement.lang is kept accurate so screen readers announce the correct language. The admin console maintains an independent toggle under edusolve_admin_lang. Marathi copy is deliberately written at spoken, first-year-student level rather than in administrative Marathi, so that it can be acted upon without translation.',
        mr: 'इंटरफेस अगदी दोन भाषांत येते, जे नॅवबार, साइडबार, मोबाईल मेनू आणि मोबाईल टॅबबारमधील एका बटणाने बदलते. निवड localStorage मध्ये edusolve_lang या नावाअंतर जतन होते, आणि document.documentElement.lang अचूक ठेवला जातो जेणेकरून स्क्रीन रीडर योग्य भाषा सांगतो. प्रशासन कॅबिनेटसुद्धा edusolve_admin_lang या स्वतंत्र कीवर्डसह स्वतंत्र टॉगल ठेवते. मराठी मजकूर जाणीवपूर्वक प्रशासकीय मराठी न करता बोलल्यास्या, पहिल्या वर्षाच्या विद्यार्थ्याच्या पातळीवर लिहिलेला आहे, जेणेकरून अनुवाद न करता कृती करता यावे.',
      },
      {
        t: 'h3',
        en: 'Browser APIs used (no library required)',
        mr: 'वापरलेली ब्राउझर API (लायब्ररी नाही)',
      },
      {
        t: 'table',
        head: ['API', 'Used for', 'Location'],
        rows: [
          ['localStorage', 'All persistence — language, saves, recents, checklists, feedback, visits, flags, admin session', 'src/lib/store.js and src/pages/*'],
          ['URL.createObjectURL', 'Preview the selected photo without uploading it', 'src/pages/Tools.jsx'],
          ['Canvas + toDataURL', 'Real photo/signature resizing and JPEG encoding', 'src/pages/Tools.jsx'],
          ['File.size / File.name', 'Real file size and extension validation', 'src/pages/Tools.jsx'],
          ['navigator.serviceWorker', 'Offline PWA support, production builds only', 'src/main.jsx'],
          ['Clipboard / Blob + download', 'Export the report as a Markdown file', 'src/pages/Report.jsx'],
        ],
      },
    ],
  },
  {
    id: 'architecture',
    no: '06',
    icon: 'grid',
    en: 'System Architecture',
    mr: 'प्रणाली आर्किटेक्चर',
    blocks: [
      {
        t: 'p',
        en: 'The system is two independent React applications that share one dependency tree, one data layer and one browser storage origin.',
        mr: 'प्रणाली म्हणजे दोन स्वतंत्र React ॲप्लिकेशनस् आहेत जे एकच डिपेंडन्सी ट्री, एकच डेटा स्तर आणि एकच ब्राउझर स्टोरेज ओरिजिन वापरतात.',
      },
      {
        t: 'code',
        text: `┌──────────────────────── STUDENT APP (src/) ────────────────────────┐
│  LanguageProvider (en | mr, persisted to localStorage)                 │
│      ↓                                                                 │
│  HashRouter → Layout (Sidebar · Navbar · main · MobileTabBar)          │
│      ↓                                                                 │
│  ┌──────────┬───────────┬──────────┬──────────┐                        │
│  │  Home    │ Dashboard │  Solver  │  Tools   │                        │
│  └──────────┴─────┬─────┴────┬─────┴────┬─────┘                        │
│                   │           │          │                              │
│            categories.js  solverEngine.js  Canvas + File API           │
│                   └───────────┴──────────┘                              │
│                          │                                             │
│                    addFeedback()  ─────────────┐                        │
└────────────────────────────────────────────────┼────────────────────────┘
                                                 │ localStorage
┌──────────────── ADMIN APP (admin-app/) ─────────▼────────────────────────┐
│  Login (demo PIN 1234)                                                   │
│  Overview · Feedback Inbox · Category Manager · Settings                 │
│  Reads and writes the same origin's localStorage                         │
└──────────────────────────────────────────────────────────────────────────┘`,
      },
      {
        t: 'table',
        head: ['Aspect', 'Student app', 'Admin app'],
        rows: [
          ['Source root', 'src/', 'admin-app/'],
          ['Vite config', 'vite.config.js', 'admin-app/vite.config.js'],
          ['Entry point', 'src/main.jsx', 'admin-app/src/main.jsx'],
          ['Routing', 'HashRouter (react-router-dom)', 'None — local useState tab switch'],
          ['Language store', 'edusolve_lang via LanguageContext', 'edusolve_admin_lang via local useState'],
          ['Stylesheet', 'src/index.css', 'admin-app/src/admin.css'],
          ['Build output', 'dist/', 'dist-admin/'],
          ['Development script', 'npm run dev', 'npm run dev:admin'],
          ['PWA', 'Yes — manifest and service worker', 'No — robots noindex'],
        ],
      },
      {
        t: 'p',
        en: 'The two applications import three modules directly from the student app — CATEGORIES, the Icon set and lib/store — so categories, icons and storage keys can never drift apart between the two.',
        mr: 'दोन्ही ॲप्लिकेशन विद्यार्थी ॲपमधून तीन मॉड्यूल थेट आयात करतात — CATEGORIES, आयकॉन संच आणि lib/store — जेणेकरून प्रकार, आयकॉन आणि स्टोरेज कीज दोन्हीत कधीही विचलन होऊ नये.',
      },
    ],
  },
  {
    id: 'categories',
    no: '07',
    icon: 'listcheck',
    en: 'The Twelve Problem Categories',
    mr: 'बारा समस्या प्रकार',
    blocks: [
      {
        t: 'p',
        en: 'Twelve categories were defined from the failure modes that first-year students actually raise. Each carries an identifier, an icon, a bilingual title and description, a bilingual keyword list, and a complete solution set — three causes, five steps, two prevention tips, one alternative and two follow-up questions — in both languages. That is 180 content strings per language.',
        mr: 'पहिल्या वर्षाच्या विद्यार्थ्यांनी प्रत्यक्ष उपस्थित केलेल्या अडचणींवरून बारा प्रकार परिभाषित केले आहेत. प्रत्येक प्रकारात ओळख क्रमांक, आयकॉन, द्विभाषिक शीर्षक व वर्णन, द्विभाषिक कीवर्ड यादी आणि संपूर्ण उपाय संच असतो — तीन कारणे, पाच पायऱ्या, दोन प्रतिबंध टिपा, एक पर्यायी उपाय आणि दोन पाठपुरावे प्रश्न — दोन्ही भाषांत. प्रति भाषा १८० मजकूर strings.',
      },
      { t: 'categories' },
      {
        t: 'p',
        en: 'Categories were chosen for genuine separation of meaning rather than visual variety. Where two categories could plausibly compete — payment versus submission, file size versus photo — the keyword sets were deliberately made disjoint and the higher-signal term was given the longer, higher-scoring form.',
        mr: 'प्रकार दृश्य विविधतेसाठी नव्हे तर खरे अर्थ विभेदनासाठी निवडले आहेत. जिथे दोन प्रकार स्पष्टपणे स्पर्ध करू शकतात — पेमेंट विरुद्ध सबमिशन, फाइल आकार विरुद्ध फोटो — तिथे कीवर्ड संच जाणीवपूर्वक विभाजित केले आणि अधिक संकेत देणारा शब्द लांब व अधिक भारांकित रूप दिले.',
      },
    ],
  },
  {
    id: 'engine',
    no: '08',
    icon: 'bot',
    en: 'The Guidance Engine',
    mr: 'मार्गदर्शन इंजिन',
    blocks: [
      {
        t: 'p',
        en: 'The "AI" is a deterministic, transparent keyword-scoring classifier — no neural network, no API call, no randomness. The same input always produces the same output, and every decision can be traced back to a specific keyword in a specific category.',
        mr: 'आमचा "AI" हा एक निश्चित, पारदर्शक कीवर्ड-स्कोरिंग वर्गीकारक आहे — कोणतीही न्यूरल नेटवर्क नाही, कोणतीही API कॉल नाही, कोणताही कrandom नाही. त्याच इनपुटसाठी त्याचच आउटपुट येते आणि प्रत्येक निर्णय एका विशिष्ट प्रकारातील एका विशिष्ट कीवर्डकडे वळवता येतो.',
      },
      {
        t: 'code',
        text: `detectCategory(text):
    t ← lowercase(text)
    best ← 'other';  bestScore ← 0

    for each category c in CATEGORIES where c.id ≠ 'other':
        score ← 0
        for each keyword k in c.keywords:
            if t contains k (case-insensitive substring match):
                score ← score + ( length(k) > 4 ? 2 : 1 )
        if score > bestScore:
            bestScore ← score
            best ← c.id

    return { id: best, confident: bestScore ≥ 2 }`,
      },
      {
        t: 'h3',
        en: 'Scoring rules',
        mr: 'स्कोरिंग नियम',
      },
      {
        t: 'ul',
        en: [
          'Matching is case-insensitive substring matching, so "OTP", "Otp" and "otp" all match, and "payment" matches inside "payment failed".',
          'A keyword longer than four characters scores 2 points; a shorter one scores 1. "payment" therefore outranks a stray "pay".',
          'All hits accumulate — the highest total wins, and earlier categories win ties.',
          'A score of 2 or more is reported as confident; below that the assistant asks for confirmation before answering.',
          'Marathi keywords are included per category, so a student typing in Marathi is classified correctly.',
          'No match at all resolves to the "other" category, which still returns a usable five-step procedure.',
          'Inputs shorter than four characters are rejected with a rephrase prompt rather than guessed at.',
        ],
        mr: [
          'जुळणी case-insensitive substring मिलिंग आहे, त्यामुळे "OTP", "Otp" आणि "otp" सर्व जुळतात आणि "payment" हे "payment failed" मध्येही जुळते.',
          'चार अक्षरांपेक्षा जास्त लांब कीवर्डला २ गुण, लहान कीवर्डला १ गुण. त्यामुळे "payment" हे एका "pay" पेक्षा जास्त भारांकित.',
          'सर्व जुळणी जमा होतात — सर्वोत्तम गुण जिंकतो आणि समान गुणांच्या वेळी आधीचा प्रकार विजयी होतो.',
          '२ किंवा अधिक गुण मिळाल्यास तो confident म्हणून सांगितला जातो; त्याखाली उत्तर देण्यापूर्वी स्पष्टीकरण विचारले जाते.',
          'प्रत्येक प्रकारासाठी मराठी कीवर्डही समाविष्ट आहेत, त्यामुळे मराठीत लिहिणारा विद्यार्थी योग्यरित्या वर्गीकृत होतो.',
          'एकही जुळणी नाही तर "other" प्रकार निवडला जातो, जो अजूनही उपयुक्त पाच पायऱ्यांची कृतीत येतो.',
          'चार अक्षरांपेक्षा कमी इनपुट चुकीचा अंदाज लावण्याऐवजी पुन्हा लिहायला सांगितले जाते.',
        ],
      },
      {
        t: 'h3',
        en: 'Conversation flow',
        mr: 'संवादाचा प्रवाह',
      },
      {
        t: 'ol',
        en: [
          'The student types the problem in their own words, clicks an example prompt, or arrives through a deep link with ?q=.',
          'handleUserText pushes the user bubble. Inputs under four characters return the "rewrite in one line" prompt.',
          'startSession runs detectCategory and returns a session: { categoryId, confident, stepIndex: 0, answers: [], followups }.',
          'After a 350 ms beat the assistant confirms the category, using a softer wording when confidence is low.',
          'Follow-up question 1 is pushed with its option chips. Selecting an option increments stepIndex.',
          'Follow-up question 2 follows 300 ms later.',
          'When the follow-up list is exhausted, buildSolution assembles the content in the active language and SolutionCard renders it.',
          'The student marks Problem Solved or Not Solved, which is written to the feedback store and surfaced in the admin console.',
        ],
        mr: [
          'विद्यार्थी स्वतःच्या शब्दांत समस्या लिहितो, उदाहरण बटण दाबतो, किंवा ?q= deep link मार्गत येतो.',
          'handleUserText युजर बबल जोडतो. चार अक्षरांपेक्षा कमी इनपुटला "एका वाक्यात पुन्हा लिहा" सूचना दिली जाते.',
          'startSession हा detectCategory चालवतो आणि सत्र परत करतो: { categoryId, confident, stepIndex: 0, answers: [], followups }.',
          '३५० ms पडतीनंतर सहाय्यक प्रकाराची खात्री करतो — confident कमी असल्यास सौम्य शब्द वापरते.',
          'पहिला पाठपुरावा प्रश्न त्याच्या पर्याय चिप्ससह जोडला जातो. पर्याय निवडल्यावर stepIndex वाढतो.',
          'दुसरा पाठपुरावा प्रश्न ३०० ms नंतर येतो.',
          'पाठपुरावा यादी संपल्यावर buildSolution सक्रिय भाषेत मजकूर जमा करतो आणि SolutionCard तो दाखवतो.',
          'विद्यार्थी "समस्या सुटली" किंवा "सुटली नाही" निवडतो, जे फीडबॅक स्टोअरमध्ये लिहिले जाते आणि प्रशासन कॅबिनेटमध्ये दिसते.',
        ],
      },
    ],
  },
  {
    id: 'modules',
    no: '09',
    icon: 'folder',
    en: 'Module Description',
    mr: 'मॉड्यूल वर्णन',
    blocks: [
      {
        t: 'table',
        head: ['Module / file', 'Responsibility', 'Key implementation'],
        rows: [
          ['src/data/categories.js', 'The content hub — 12 category descriptors, the full bilingual solution bank, detectCategory()', 'Weighted keyword scoring; bilingual keyword arrays'],
          ['src/engine/solverEngine.js', 'Session lifecycle, content assembly and the fallback answer', 'startSession, buildSolution, fallbackSolution, getCategoryById'],
          ['src/i18n/translations.js', 'STRINGS.en and STRINGS.mr — 60 UI keys per language', 'Plain object, no i18n library'],
          ['src/context/LanguageContext.jsx', 'Language state, persistence and <html lang> synchronisation', 'useLang() hook, try/catch localStorage access'],
          ['src/lib/store.js', 'The only module that owns cross-cutting localStorage data', 'Feedback, visits, featured flags, admin session, clearAllAppData'],
          ['src/components/ui.jsx', 'Layout shell and the shared SolutionCard / CategoryCard widgets', 'Layout, Navbar, Sidebar, MobileTabBar, Logo'],
          ['src/components/PremiumUI.jsx', 'Searchable combobox with full keyboard support, plus toasts', 'SearchSelect with ↑ ↓ Enter Esc, Toast, useToast'],
          ['src/components/icons.jsx', 'The 43-icon inline SVG set and the <Icon> renderer', 'currentColor stroke icons, graceful fallback to bulb'],
          ['src/pages/*', 'The five student screens — Home, Dashboard, Solver, Tools, Report', 'Route-driven, each self-contained'],
          ['src/lib/store.js → admin-app/src/App.jsx', 'Admin panels: Login, Overview, FeedbackInbox, CategoriesAdmin, SettingsAdmin', 'local useState tabs, seeded demo data, SVG donut gauge'],
          ['public/sw.js', 'Offline-first service worker — app shell and runtime caching', 'Network-first for navigation, cache-first for assets, cache edusolve-v5'],
        ],
      },
      {
        t: 'h3',
        en: 'Student pages',
        mr: 'विद्यार्थी पाने',
      },
      {
        t: 'table',
        head: ['Page', 'Purpose', 'Highlights'],
        rows: [
          ['Home', 'Orientation and entry points', 'Hero, 4 quick actions, 4 popular categories, 3-step How It Works, feature grid, CTA banner'],
          ['Dashboard', 'The problem library', 'SearchSelect whose index includes keywords; 12 cards; active SolutionCard; recents; saves; 5-item checklist with progress bar'],
          ['AI Problem Solver', 'The conversational core', 'Classification, two follow-ups, structured solution, five example prompts, Solved / Not Solved, save, clear'],
          ['Smart Tools', 'Practical utilities', '6 tools; real File.size and File.name validation; real Canvas resize with a genuine download'],
          ['Report', 'This document', 'Scroll-spy table of contents, print-to-PDF stylesheet, Markdown export'],
        ],
      },
    ],
  },
  {
    id: 'features',
    no: '10',
    icon: 'sparkles',
    en: 'Features Delivered',
    mr: 'दिलेली वैशिष्ट्ये',
    blocks: [
      {
        t: 'h3',
        en: 'Smart Tools — what genuinely works',
        mr: 'स्मार्ट साधने — खरी काम करणारी',
      },
      {
        t: 'table',
        head: ['Tool', 'Real or informational', 'What it does'],
        rows: [
          ['Document preparation checklist', 'Real, persisted', '5 bilingual items, per-item checkboxes, progress bar, stored under tool_docprep'],
          ['File extension and size checker', 'Real', 'Reads the actual file name and size from the File API, validates extension against a preset and size against the limit, prints a pass/fail verdict. Nothing is uploaded.'],
          ['Photo and signature resizer', 'Real', 'Decodes the image, redraws it to a Canvas with cover-crop and high-quality smoothing, exports a real JPEG at 0.6 / 0.8 / 0.92 quality, measures the true output size and offers a real download.'],
          ['Form-filling checklist', 'Real, persisted', '5 bilingual items, stored under tool_formfill'],
          ['Pre-submission verification', 'Real, persisted', '5 bilingual items, stored under tool_presubmit'],
          ['Required-document checklist', 'Session only', 'Scholarship, Admission and Exam services with 5 to 8 documents each; state resets on reload'],
        ],
      },
      {
        t: 'h3',
        en: 'File size presets',
        mr: 'फाइल आकार प्रीसेट',
      },
      {
        t: 'table',
        head: ['Preset', 'Allowed extensions', 'Maximum size'],
        rows: [
          ['PDF for scholarship documents', 'pdf', '200 KB'],
          ['Passport photo JPG', 'jpg, jpeg', '50 KB'],
          ['Signature JPG', 'jpg, jpeg', '30 KB'],
          ['General image', 'jpg, jpeg, png', '200 KB'],
        ],
      },
      {
        t: 'h3',
        en: 'Cross-cutting features',
        mr: 'संपूर्ण ॲपमधील वैशिष्ट्ये',
      },
      {
        t: 'ul',
        en: [
          'Bilingual interface with a single toggle, persisted across reloads.',
          'Responsive mobile-first layout — bottom tab bar with a raised centre action on phones, left sidebar from 961 px, tablet layout from 768 px.',
          'Progressive Web App — installable on Android, iOS and Windows, with an offline app shell.',
          'Visit tracking, one increment per page load per day.',
          'Structured Solved / Not Solved feedback capture with a 300-record cap.',
          'Zero emoji and zero image icons — 43 hand-drawn inline SVGs, all currentColor-driven.',
          'Searchable comboboxes with full keyboard navigation and an empty-state message.',
          'Toast notifications with a 2.6-second auto-dismiss.',
          'This Report section — printable to PDF and exportable as Markdown.',
        ],
        mr: [
          'एका टॉगलसह द्विभाषिक इंटरफेस, रीलोडनंतरही जतन.',
          'मोबाईल-फर्स्ट प्रतिसाददार लेआउट — फोनवर बॉटम टॅबबार व मध्ये उंचावलेली कृती, ९६१ px पासून डावीकडील साइडबार, ७६८ px पासून टॅब्लेट लेआउट.',
          'प्रोग्रेसिव्ह वेब ॲप — Android, iOS आणि Windows वर इन्स्टॉल करता येते, ऑफलाइन ॲप शेलसह.',
          'भेटींचा मागोवा, प्रत्येक पान लोड व दिवस यानुसार एक वाढ.',
          'सोडवले / सुटले नाही या संरचित अभिप्रायाची नोंद, ३०० नोंदींचा मर्यादा.',
          'शून्य इमोजी आणि शून्य प्रतिमा आयकॉन — ४३ हाताने काढलेले इनलाइन SVG, सर्व currentColor ठढव.',
          'पूर्ण कीबोर्ड नेविगेशन आणि रिकाम्या स्थितीच्या सूचनेसह शोधता येणारे कॉम्बोबॉक्स.',
          '२.६ सेकंदात आपोआप बंद होणारी टोस्ट सूचना.',
          'हा रिपोर्ट विभाग — PDF मध्ये छापता येतो आणि Markdown म्हणून निर्यात करता येतो.',
        ],
      },
    ],
  },
  {
    id: 'storage',
    no: '11',
    icon: 'box',
    en: 'Data Storage & Privacy',
    mr: 'डेटा स्टोरेज व गोपनीयता',
    blocks: [
      {
        t: 'p',
        en: 'Every piece of persistent data lives in the browser under the edusolve_ prefix. There is no server to send it to, and no analytics or tracking script anywhere in the codebase.',
        mr: 'चालू ठेवला जाणारा प्रत्येक डेटा ब्राउझरमध्ये edusolve_ या उत्पादनापूर्व साठीत राहतो. तो पाठवण्यासाठी कोणताही सर्व्हर नाही, आणि कोडबेसमध्ये कोणतीही ॲनालिटिक्स किंवा ट्रॅकिंग स्क्रिप्ट नाही.',
      },
      { t: 'storage' },
      {
        t: 'note',
        en: 'clearAllAppData() removes every edusolve_ key except edusolve_lang, so the language preference survives a data reset.',
        mr: 'clearAllAppData() हे edusolve_lang वगळता प्रत्येक edusolve_ कीज हटवते, त्यामुळे डेटा रीसेट केल्यावरही भाषेची निवड टिकते.',
      },
      {
        t: 'h3',
        en: 'Safety, privacy and honesty guarantees',
        mr: 'सुरक्षा, गोपनीयता आणि प्रामाणिकपणा यांची हमी',
      },
      {
        t: 'ul',
        en: [
          'Never asks for a password, OTP, CVV or bank PIN — stated in the Solver sidebar and the admin Safety card.',
          'Files are never uploaded. The File API is read locally and the resizer works entirely on a Canvas.',
          'No backend, no database, no analytics server, no third-party scripts.',
          'No login is required for students.',
          'The demo nature is disclosed in the interface rather than hidden.',
          'Payment advice is conservative — the app tells the student to check their bank or UPI app and contact the official helpline with the UTR; it never claims a payment succeeded.',
          'Anti-fraud guidance is built into the "other" category: never pay agents who promise guaranteed approval.',
          'The admin console is marked noindex and should be hosted behind access control.',
        ],
        mr: [
          'पासवर्ड, OTP, CVV किंवा बँक PIN कधीही मागत नाही — फूटर बॅज, सोल्व्हर साइडबार आणि प्रशासन सुरक्षा कार्डमध्ये हे स्पष्ट सांगितले आहे.',
          'फाइल्स कधीही अपलोड होत नाहीत. File API स्थानिक पातळीवर वाचली जाते आणि रिसायझर पूर्णपणे Canvas वर चालतो.',
          'कोणतेही बॅकएंड, डेटाबेस, ॲनालिटिक्स सर्व्हर किंवा तृतीय पक्ष स्क्रिप्ट नाही.',
          'विद्यार्थ्यांसाठी कोणतेही लॉगिन आवश्यक नाही.',
          'डेमो स्वरूपाची माहिती लपवलेली नाही, वापरकर्त्याला दिसते.',
          'पेमेंटबाबतचा सल्ला काळजीपूर्वक — विद्यार्थ्याला बँक किंवा UPI अ‍ॅप तपासण्यास व UTR सह अधिकृत हेल्पलाइनला संपर्क साधण्यास सांगितले जाते; अ‍ॅप कधीही पेमेंट यशस्वी झाल्याचा दावा करत नाही.',
          '"other" प्रकारात फसदारी-विरोधी मार्गदर्शन आहे: "हमीसह मंजुरी" देणार्या एजंटांना पैसे देऊ नका.',
          'प्रशासन कॅबिनेटवर noindex आहे आणि ते प्रवेश नियंत्रणाखाली ठेवावे.',
        ],
      },
    ],
  },
  {
    id: 'design',
    no: '12',
    icon: 'bulb',
    en: 'Design System',
    mr: 'डिझाइन सिस्टम',
    blocks: [
      {
        t: 'p',
        en: 'The visual language is an "ink and paper" base with a deep violet accent — chosen so the interface reads as calm and official rather than as a chatbot toy, and so the accent carries meaning (active state, primary action, solved).',
        mr: 'दृश्य भाषा "शाईल आणि कागद" या पायाभूत रंगासह गाढी व्हिओलेट ऍक्सेंटवर आधारित आहे — जेणेकरून इंटरफेस शांत आणि अधिकृत वाटेल, चॅटबॉट खेळण्यासारखे न वाटेल, आणि ऍक्सेंटला अर्थ दिला जावा (सक्रिय स्थिती, मुख्य कृती, सोडवले).',
      },
      { t: 'design' },
      {
        t: 'p',
        en: 'Breakpoints follow a mobile-first strategy: the base stylesheet is the phone layout, and each media query only adds to it — 600 px for small tablets, 768 px for tablets, and 961 px for desktop where the left sidebar replaces the bottom tab bar.',
        mr: 'Breakpoints मोबाईल-फर्स्ट धोरणाचे आहेत: मूळ stylesheet हा फोन लेआउट आहे आणि प्रत्येक media query त्यातच भर घालतो — ६०० px लहान टॅब्लेटसाठी, ७६८ px टॅब्लेटसाठी आणि ९६१ px डेस्कटॉपसाठी जिथे बॉटम टॅबबारच्या जागी डावीकडील साइडबार येतो.',
      },
    ],
  },
  {
    id: 'testing',
    no: '13',
    icon: 'checkcircle',
    en: 'Testing & Verification',
    mr: 'चाचणी व पडताळणी',
    blocks: [
      {
        t: 'p',
        en: 'The project has no automated test suite — there is no Jest, Vitest, Playwright or Cypress dependency. Verification is manual and is documented as a written checklist in the project documentation, so any reviewer can reproduce it.',
        mr: 'या प्रकल्पात स्वयंचालित चाचणी संच नाही — Jest, Vitest, Playwright किंवा Cypress यांपैकी कोणताही dependency नाही. पडताळणी स्वतःची केली जाते आणि प्रकल्पाच्या कागदपत्रात लिहिलेल्या यादीनुसार केली जाते, जेणेकरून कोणताही तपासणारा ती पुन्हा करू शकतो.',
      },
      {
        t: 'h3',
        en: 'Student site — verified behaviours',
        mr: 'विद्यार्थी साइट — पडताळलेल्या गोष्टी',
      },
      {
        t: 'ul',
        en: [
          'All five routes render; unknown routes fall back to Home.',
          'The language toggle switches every chrome string and every content string, and the choice survives a reload.',
          'The classifier resolves all twelve categories from their canonical example sentences, in both English and Marathi.',
          'The file checker returns a correct verdict for both format and size, including the failing path.',
          'The resizer produces a real JPEG at the requested pixel dimensions with a correctly measured file size and a working download.',
          'Save, recents, checklists, language and feedback all persist across reloads.',
          'The service worker registers in production builds and the app shell loads offline.',
          'Layouts adapt correctly at 375 px, 768 px and 1280 px.',
        ],
        mr: [
          'सर्व पाच राउट दिसतात; अज्ञात राउट Home वर परत जातो.',
          'भाषा टॉगल सर्व chrome strings आणि सर्व content strings बदलतो आणि निवड रीलोडनंतरही टिकते.',
          'वर्गीकारक सर्व बारा प्रकार त्यांच्या प्रातिनिधिक वाक्यांवरून इंग्रजी आणि मराठी दोन्हींत ओळखतो.',
          'फाइल तपासणी प्रकार व आकार दोन्हींसाठी योग्य निर्णय देतो, अपयशी मार्गासह.',
          'रिसायझर मागणारे pixel आकारात खरा JPEG तयार करतो, सही आकार मोजतो आणि काम करणारा डाउनलोड देतो.',
          'Save, recents, checklists, भाषा आणि feedback सर्व reload नंतरही टिकतात.',
          'Production build मध्ये service worker नोंदणी होते आणि ॲप shell ऑफलाइन लोड होतो.',
          '३७५ px, ७६८ px आणि १२८० px वर लेआउट योग्यरित्या जुळतो.',
        ],
      },
      {
        t: 'h3',
        en: 'Admin console — verified behaviours',
        mr: 'प्रशासन कॅबिनेट — पडताळलेल्या गोष्टी',
      },
      {
        t: 'ul',
        en: [
          'A wrong PIN is rejected with a clear error; the correct PIN opens the console.',
          'The overview renders all four KPI cards, the 7-day bar chart and the donut gauge.',
          'The feedback inbox searches by title and filters by Solved / Open.',
          'Category feature flags persist and the switch reflects the stored state.',
          'The admin language toggle is independent of the student site.',
          'Logout and the local-data reset both correctly restore a clean state.',
        ],
        mr: [
          'चुकीचा PIN स्पष्ट तपशीलासह नाकारला जातो; योग्य PIN कॅबिनेट उघडतो.',
          'ओव्हरव्ह्यूमध्ये चार KPI कार्ड, ७ दिवसांचा बार चार्ट आणि डोनट गेज सर्व दिसतात.',
          'फीडबॅक इनबॉक्स शीर्षकावरून शोधतो आणि सोडवले / उरले यानुसार फिल्टर करतो.',
          'प्रकार फीचर फ्लॅग जतन होतात आणि स्विच जतन केलेली स्थिती दाखवतो.',
          'प्रशासन भाषा टॉगल विद्यार्थी साइटपासून स्वतंत्र आहे.',
          'लॉगआउट आणि स्थानिक डेटा रीसेट दोन्ही योग्यरित्या स्वच्छ स्थिती आणतात.',
        ],
      },
    ],
  },
  {
    id: 'limitations',
    no: '14',
    icon: 'info',
    en: 'Limitations',
    mr: 'मर्यादा',
    blocks: [
      {
        t: 'ul',
        en: [
          'The classifier is keyword-based. A novel phrasing that avoids every listed keyword falls back to the "other" category, which still yields a usable answer.',
          'Feedback and visit statistics are per-browser and per-origin. They are not real multi-user analytics.',
          'The admin PIN 1234 is hard-coded in the source for demonstration. A production system needs server-side authentication.',
          'The photo resizer always cover-crops the source to the target aspect ratio; it does not pad with letterbox bars.',
          'There is no automated test suite, so regression coverage is manual.',
          'The admin console and the student site share data only when served from the same origin.',
        ],
        mr: [
          'वर्गीकारक keyword-आधारित आहे. प्रत्येक सूचीबद्ध कीवर्ड टाळणारी नवीन मांडणी "other" प्राकाराकडे जाते, जी अजूनही उपयुक्त उत्तर देते.',
          'फीडबॅक व भेट आकडेवारी प्रति-ब्राउझर आणि प्रति-ओरिजिन असते. ही खरी अनेक-वापरकर्ता ॲनालिटिक्स नाही.',
          'प्रशासन PIN 1234 दाखवण्यासाठी स्रोतात हार्ड-कोड केलेला आहे. प्रक्रियेसाठी सर्व्हर-साइड प्रमाणीकरण आवश्यक.',
          'फोटो रिसायझर नेहमी स्रोताला लक्ष्य पक्षांभोवत crop करतो; तो letterbox पट्टी जोडत नाही.',
          'स्वयंचालित चाचणी संच नाही, त्यामुळे regression coverage स्वतःची केली जाते.',
          'प्रशासन कॅबिनेट आणि विद्यार्थी साइट एकाच ओरिजिनवरून चालल्यावरच डेटा शेअर करतात.',
        ],
      },
    ],
  },
  {
    id: 'future',
    no: '15',
    icon: 'rocket',
    en: 'Future Scope',
    mr: 'भविष्यातील वाट',
    blocks: [
      {
        t: 'ul',
        en: [
          'A real AI layer — replace detectCategory and buildSolution with a hosted language model while keeping the SolutionCard contract, so the interface needs no change.',
          'A lightweight backend with a relational database for shared feedback and cross-device analytics, plus proper authentication for the admin console.',
          'More interface languages — Hindi, Bengali, Telugu, Kannada, Malayalam, Gujarati, Punjabi, Odia, Urdu — with right-to-left support where required.',
          'A portal profile so that each student sees their own institution\'s file limits and photo dimensions instead of generic ones.',
          'A deadline tracker with countdowns and a days-remaining action plan.',
          'A printable "handoff card" for the Common Service Centre, generated offline for the moment the internet is down.',
          'A document expiry radar for caste, income and domicile certificates.',
          'A real content editor inside the admin console, so guidance can be improved without a code change.',
          'Automated testing — Vitest for the engine and store, Playwright for the end-to-end flows.',
          'A full WCAG 2.1 AA accessibility audit and a screen-reader test pass.',
        ],
        mr: [
          'खरे AI स्तर — SolutionCard चा करार सोबतच detectCategory आणि buildSolution ची जागा होस्ट केलेल्या भाषा मॉडेलने घेणे, जेणेकरून इंटरफेस बदलण्याची गरज नाही.',
          'हलके बॅकएंड आणि रिलेशनल डेटाबेस — सामायिक फीडबॅक, डिव्हाइसंतील आकडेवारी आणि प्रशासन कॅबिनेटसाठी योग्य प्रमाणीकरण.',
          'अधिक इंटरफेस भाषा — हिंदी, बंगाली, तेलुगू, कन्नड़, मलयाळम, गुजराती, पंजाबी, ओडिया, उर्दू — आवश्यक ठिकाणी right-to-left सपोर्टसह.',
          'पोर्टल प्रोफाइल — प्रत्येक विद्यार्थ्याला सामान्य ऐवजी त्याच्या संस्थेच्या फाइल मर्यादा आणि फोटो आकार दिसतील.',
          'मुदत मागोवा — उलटवारी गणना आणि उरलेल्या दिवसांनुसार कृती योजना.',
          'Common Service Centre साठी छापण्यायोग्य "हस्तांतरण पत्रिका" — इंटरनेट बंद असताना ऑफलाइन तयार करता येणारी.',
          'जात, उत्पन्न आणि रहिवासी दाखल्यांसाठी मुदत संपण्याचा रेडार.',
          'प्रशासन कॅबिनेटमध्ये खरा कंटेंट एडिटर, जेणेकरून कोड बदलण्याशिवाय मार्गदर्शन सुधारता यावे.',
          'स्वयंचालित चाचणी — इंजिन आणि स्टोअरसाठी Vitest, end-to-end प्रवाहांसाठी Playwright.',
          'पूर्ण WCAG 2.1 AA प्रवाहजन्यता लेखापरीक्षण आणि स्क्रीन रीडर चाचणी.',
        ],
      },
    ],
  },
  {
    id: 'viva',
    no: '16',
    icon: 'help',
    en: 'Viva Questions & Answers',
    mr: 'विद्यार्थी परीक्षेतील प्रश्न व उत्तरे',
    blocks: [
      {
        t: 'qa',
        items: [
          {
            q: {
              en: 'Is this real AI?',
              mr: 'हे खरे AI आहे का?',
            },
            a: {
              en: 'No. It is a rule-based natural-language classifier — a weighted keyword scorer with a deterministic scoring function, bilingual keyword sets and a confidence threshold. The project deliberately uses this so it runs offline, costs nothing, is fully explainable and is transparent about its own behaviour. The SolutionCard contract was designed so a real language model could be dropped in later without touching the interface.',
              mr: 'नाही. हा नियमाधारित नैसर्गिक भाषा वर्गीकारक आहे — निश्चित स्कोरिंग फंक्शन, द्विभाषिक कीवर्ड संच आणि confident चा वाघासह असलेला वजनयुक्त कीवर्ड स्कोअर. प्रकल्पाने हे जाणीवपूर्वक निवडले आहे, जेणेकरून ते ऑफलाइन चाले, कोणताही खर्च न यावा, पूर्णपणे स्पष्ट सांगता यावे आणि त्याचे स्वतःचे वर्तन पारदर्शक राहावे. SolutionCard चा करार अशा पद्धतीने तयार केला आहे की भविष्यात खरं भाषा मॉडेल इंटरफेस बदलल्याशिवाय जोडता येईल.',
            },
          },
          {
            q: {
              en: 'Why is there no backend?',
              mr: 'बॅकएंड का नाही?',
            },
            a: {
              en: 'To guarantee privacy and to keep the project deployable as a static site. All data lives in localStorage. The trade-off is that analytics are per-browser; the architecture documentation describes the API seam where a backend would attach.',
              mr: 'गोपनीयता हमी देण्यासाठी आणि प्रकल्प स्टॅटिक साइट म्हणून उपयोजित करण्यासाठी. सर्व डेटा localStorage मध्ये राहतो. त्याचा तोटा म्हणजे आकडेवारी प्रति-ब्राउझर; आर्किटेक्चर दस्तऐवजात बॅकएंड कुठे जोडला जाईल ते API जागा स्पष्ट केले आहे.',
            },
          },
          {
            q: {
              en: 'How does it know which problem the student has?',
              mr: 'विद्यार्थ्याला कोणती समस्या आहे हे कसे कळते?',
            },
            a: {
              en: 'It lowercases the input, then for each of the eleven scorable categories adds one point per matching keyword and two points per keyword longer than four characters. The highest-scoring category wins; a score of two or more is reported as confident. Marathi keywords are included so the same works in both languages.',
              mr: 'इनपुट lowercase केला जातो, आणि स्कोर करता येणाऱ्या अकरा प्रकारांसाठी जुळणार्या प्रत्येक कीवर्डला एक गुण आणि चार अक्षरांपेक्षा लांब प्रत्येक कीवर्डला दोन गुण दिले जातात. सर्वोत्तम गुण असलेला प्रकार जिंकतो; दोन किंवा अधिक गुण मिळाल्यास तो confident म्हणून सांगितला जातो. मराठी कीवर्डही समाविष्ट आहेत त्यामुळे दोन्ही भाषांत हे चालते.',
            },
          },
          {
            q: {
              en: 'What actually works, versus what is just text?',
              mr: 'खरे काम करणारे काय आहे आणि फक्त मजकूर काय?',
            },
            a: {
              en: 'The file checker reads the real File.size and the file extension through the File API and returns a genuine pass/fail verdict. The photo resizer genuinely decodes the image, redraws it to a Canvas at the target dimensions with cover-crop, re-encodes it as JPEG at a chosen quality, measures the true output byte size and offers a real download. The checklists genuinely persist. The solution content is curated guidance, not computation.',
              mr: 'फाइल तपासणी File API मार्फत खऱा File.size आणि फाइल एक्स्टेंशन वाचून खरा pass/fail निर्णय देतो. फोटो रिसायझर खरेच प्रतिमा decode करतो, तिला लक्ष्य आकारात Canvas वर cover-crop ने काढून पुन्हा draw करतो, निवडलेल्या quality वर JPEG म्हणून encode करतो, खरा आउटपुट आकार मोजतो आणि खरा डाउनलोड देतो. याद्या खऱ्या सतत टिकतात. उपायांचा मजकूर सावक केलेला मार्गदर्शन आहे, गणित नाही.',
            },
          },
          {
            q: {
              en: 'Are student files uploaded anywhere?',
              mr: 'विद्यार्थ्यांच्या फाइल्स कुठेही अपलोड होतात का?',
            },
            a: {
              en: 'No. The File API is read locally, and the image processing happens on an on-page Canvas. There is no fetch call to any server anywhere in src/.',
              mr: 'नाही. File API स्थानिक पातळीवर वाचली जाते, आणि प्रतिमा प्रक्रिया पानावरील Canvas वरच होते. src/ मध्ये कुठल्याही सर्व्हरकडे fetch कॉल नाही.',
            },
          },
          {
            q: {
              en: 'How is the privacy requirement enforced rather than just promised?',
              mr: 'गोपनीयता आवश्यकता केवळ प्रतिज्ञा न करता कशी लागू केली जाते?',
            },
            a: {
              en: 'Structurally. There is no server to send data to, no analytics script, no login, and no file-upload code path. The Solver sidebar and the admin Safety card state the rules in the interface itself.',
              mr: 'रचनेमुळेच. डेटा पाठवण्यासाठी कोणताही सर्व्हर नाही, कोणतीही ॲनालिटिक्स स्क्रिप्ट नाही, कोणतेही लॉगिन नाही आणि फाइल-अपलोड कोड मार्ग नाही. फूटर बॅज, सोल्व्हर साइडबार आणि प्रशासन सुरक्षा कार्डमध्ये नियम इंटरफेसमध्येच सांगितलेले आहेत.',
            },
          },
          {
            q: {
              en: 'Why is the admin a separate application?',
              mr: 'प्रशासन स्वतंत्र ॲप्लिकेशन का आहे?',
            },
            a: {
              en: 'So the student bundle contains no admin code and no admin navigation, and so the admin interface can be deployed on a restricted host independently. Both apps share the same node_modules, the same package.json and the same data modules through relative imports.',
              mr: 'म्हणजे विद्यार्थी बंडलमध्ये प्रशासन कोड किंवा प्रशासन नेव्हिगेशन नाही, आणि प्रशासन इंटरफेस स्वतंत्रपणे प्रतिबंधित होस्टवर deploy करता यावा. दोन्ही ॲप्स एकच node_modules, एकच package.json आणि संबंधित import द्वारे एकच डेटा मॉड्यूल वापरतात.',
            },
          },
          {
            q: {
              en: 'Why hash routing and a relative base path?',
              mr: 'हॅश राउटिंग आणि संबंधित base path का?',
            },
            a: {
              en: 'HashRouter lets a single dist/ work on GitHub Pages sub-paths, Vercel, Netlify and even file://, without server rewrite rules. Combined with base: "./", one build deploys everywhere. The vercel.json rewrite is included anyway as a safety net.',
              mr: 'HashRouter मुळे एकच dist/ GitHub Pages sub-path, Vercel, Netlify आणि file:// वरही सर्व्हर rewrite नियमांशिवाय चालतो. base: "./" सोबत एकच build सगळीकडे deploy होतो. सुरक्षेसाठी vercel.json rewrite तरी देण्यात आले आहे.',
            },
          },
          {
            q: {
              en: 'How would you make the classification better?',
              mr: 'वर्गीकरण अधिक चांगले कसे कराल?',
            },
            a: {
              en: 'Add phrase matching and synonyms, weight rarer keywords higher, score a bag-of-words similarity against a corpus of example sentences per category, and — most effectively — retrain on the real feedback already being collected through the Solved and Not Solved buttons.',
              mr: 'वाक्य-जुळणी आणि पर्यायवाची शब्दे जोडणे, कमी आढळणारे कीवर्ड जास्त भारांकित करणे, प्रत्येक प्रकारासाठी उदाहरण वाक्यांच्या संग्रहावर bag-of-words समानता मोजणे आणि सर्वात प्रभावी म्हणजे सोडवले / सुटले नाही बटणांमधून आधीच जमा होणारा प्रत्यक्ष फीडबॅकवर पुन्हा प्रशिक्षण देणे.',
            },
          },
          {
            q: {
              en: 'What would a production version look like?',
              mr: 'उत्पादन आवृत्ती कशी असेल?',
            },
            a: {
              en: 'This React client plus a small Node/Express API and a relational database; proper authentication for the admin console; an LLM-backed solver behind the existing buildSolution contract; multi-language content packs; and a service worker that syncs a versioned content pack for offline use.',
              mr: 'हा React क्लायंट अधिक लहान Node/Express API आणि रिलेशनल डेटाबेस; प्रशासन कॅबिनेटसाठी योग्य प्रमाणीकरण; अस्तित्वात असलेल्या buildSolution करारामागे LLM-आधारित सोल्व्हर; बहुभाषिक कंटेंट पॅक; आणि ऑफलाइन वापरासाठी versioned कंटेंट पॅक सिंक करणारा service worker.',
            },
          },
        ],
      },
    ],
  },
  {
    id: 'conclusion',
    no: '17',
    icon: 'check',
    en: 'Conclusion',
    mr: 'निष्कर्ष',
    blocks: [
      {
        t: 'p',
        en: 'EduSolve AI addresses a real, recurring and poorly-served problem for Indian college students with a solution that is simple enough to trust and complete enough to be useful. Its twelve bilingual problem categories, weighted keyword engine, genuinely functional file tools, measurable feedback loop and privacy-first architecture together form a coherent, demonstrable and defensible college project that is ready for deployment.',
        mr: 'EduSolve AI भारतीय महाविद्यालयीन विद्यार्थ्यांच्या खऱ्या, नेहमीच्या आणि कमी सेवा दिलेल्या प्रश्नाला असा उपाय देतो जो विश्वास ठेवण्यासाठी पुरेसा सोपा आणि उपयुक्त ठेवण्यासाठी पुरेसा पूर्ण आहे. बारा द्विभाषिक समस्या प्रकार, वजनयुक्त कीवर्ड इंजिन, खरे काम करणारी फाइल साधने, मोजता येणारा फीडबॅक फक्तो आणि गोपनीयता-प्रथम आर्किटेक्चर यांचे मिळून एक coherent, दाखवता येणारे आणि defend करता येणारे कॉलेज प्रकल्प साकार झाला आहे.',
      },
    ],
  },
]

// --- Live statistics derived from the actual modules, so the report can never drift ---
export function reportStats() {
  const catIds = CATEGORIES.map((c) => c.id)
  const sol = SOLUTIONS
  const causes = catIds.reduce((n, id) => n + (sol[id]?.causes?.en?.length || 0), 0)
  const steps = catIds.reduce((n, id) => n + (sol[id]?.steps?.en?.length || 0), 0)
  const prevention = catIds.reduce((n, id) => n + (sol[id]?.prevention?.en?.length || 0), 0)
  const alternative = catIds.reduce((n, id) => n + (sol[id]?.alternative?.en ? 1 : 0), 0)
  const followups = catIds.reduce((n, id) => n + (sol[id]?.followups?.length || 0), 0)
  const keywords = CATEGORIES.reduce((n, c) => n + c.keywords.length, 0)
  const perLang = catIds.length * 2 + causes + steps + prevention + alternative + followups
  return {
    categories: CATEGORIES.length,
    causes,
    steps,
    prevention,
    alternative,
    followups,
    keywords,
    perLang,
    totalStrings: perLang * 2,
  }
}

export const STORAGE_KEYS = [
  ['edusolve_lang', 'LanguageContext', '"en" | "mr"', 'Student-site language'],
  ['edusolve_admin_lang', 'admin-app/src/App.jsx', '"en" | "mr"', 'Admin console language'],
  ['edusolve_recent', 'Dashboard, Solver', '[{ id, at }]', 'Recently viewed categories (max 6)'],
  ['edusolve_saved', 'Dashboard, Solver', '[categoryId]', 'Saved solutions'],
  ['edusolve_checks', 'Dashboard', '[bool × 5]', 'Dashboard task checklist state'],
  ['tool_docprep', 'Tools', '[index]', 'Document preparation checklist state'],
  ['tool_formfill', 'Tools', '[index]', 'Form-filling checklist state'],
  ['tool_presubmit', 'Tools', '[index]', 'Pre-submission checklist state'],
  ['edusolve_feedback', 'store.addFeedback', '[{ id, title, verdict, source, at }]', 'Solved / Not Solved records (max 300)'],
  ['edusolve_featured', 'store.toggleFeatured', '[categoryId]', 'Featured-category flags'],
  ['edusolve_visits_daily', 'store.trackVisit', '{ "YYYY-MM-DD": count }', 'Daily visit counter'],
  ['edusolve_admin', 'store.adminLogin', '{ name, at }', 'Admin demo session'],
]

export const DESIGN_TOKENS = [
  ['--paper', '#f6f5f2', '#f6f5f2', 'Page background'],
  ['--card', '#ffffff', '#fff', 'Card surface'],
  ['--ink / --text', '#15171e / #1a1d26', 'same', 'Primary text'],
  ['--muted', '#6e7180', '#6e7180', 'Secondary text'],
  ['--line / --line-soft', '#e6e4df / #eeece7', 'same', 'Borders'],
  ['--accent', '#6d28d9', '#6d28d9', 'Violet accent — active state, primary action'],
  ['--accent-deep', '#5b21b6', '#5b21b6', 'Accent hover / pressed'],
  ['--accent-soft', '#f5f3ff', '#f5f3ff', 'Accent tint background'],
  ['--accent-line', '#ddd6fe', '#ddd6fe', 'Accent tint border'],
  ['--radius', '14px', '16px', 'Control corner radius'],
  ['--radius-card', '20px', '—', 'Card corner radius'],
  ['--shadow-sm / --shadow / --shadow-lg', '3 elevation levels', '2 levels', 'Card shadows'],
  ['--green / --amber', '—', '#15803d / #b45309', 'Admin status colours'],
]
