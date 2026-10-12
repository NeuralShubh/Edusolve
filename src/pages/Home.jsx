import { useNavigate } from 'react-router-dom'
import { useLang } from '../context/LanguageContext'
import { STRINGS } from '../i18n/translations'
import { CATEGORIES } from '../data/categories'

export default function Home() {
  const { lang } = useLang()
  const t = STRINGS[lang]
  const nav = useNavigate()
  const popular = CATEGORIES.slice(5, 9)
  const stats = [
    { b: '12', s: lang === 'mr' ? 'समस्या प्रकार' : 'Problem categories' },
    { b: '6', s: lang === 'mr' ? 'स्मार्ट साधने' : 'Smart tools' },
    { b: '2', s: lang === 'mr' ? 'भाषा (EN + MR)' : 'Languages (EN + MR)' },
    { b: '100%', s: lang === 'mr' ? 'फ्रंटएंड डेमो' : 'Frontend demo' },
  ]

  return (
    <div>
      <section className="hero">
        <div>
          <span className="badge">✨ {t.hero_badge}</span>
          <h1>{t.hero_title_a} <span>{t.hero_title_b.split(' ')[0]} {t.hero_title_b.split(' ')[1] || ''}</span> <span className="violet">{t.hero_title_b.split(' ').slice(2).join(' ')}</span></h1>
          <p>{t.hero_desc}</p>
          <div className="btn-row">
            <button className="btn primary" onClick={() => nav('/solver')}>🚀 {t.start_solving}</button>
            <button className="btn" onClick={() => nav('/dashboard')}>🔍 {t.explore_problems}</button>
          </div>
          <div className="hero-stats">
            {stats.map((s) => <div key={s.s} className="stat"><b>{s.b}</b><span>{s.s}</span></div>)}
          </div>
          <div><span className="demo-pill">⚠️ {t.demo_note}</span></div>
        </div>
        <div className="hero-art">
          <span className="float-chip c1">✅ {lang === 'mr' ? 'टप्प्याटप्प्याने उपाय' : 'Step-by-step fix'}</span>
          <span className="float-chip c2">🌐 EN + मराठी</span>
          <div className="chat-mock">
            <div className="bubble user">{lang === 'mr' ? 'माझा शिष्यवृत्ती फॉर्म सबमिट होत नाही.' : 'My scholarship form is not submitting.'}</div>
            <div className="bubble bot">{lang === 'mr' ? '🤖 समजले! ही “फॉर्म सबमिशन” समस्या वाटते. २ सोपे प्रश्न विचारू का?' : '🤖 Got it! This looks like a “Form Submission” issue. May I ask 2 quick questions?'}</div>
            <div className="bubble user">{lang === 'mr' ? 'हो, विचारा.' : 'Yes, go ahead.'}</div>
            <div className="bubble bot">{lang === 'mr' ? '🪜 Preview + घोषणा टिक + एकदाच Final Submit… पूर्ण उपाय तयार आहे!' : '🪜 Preview + declaration tick + one Final Submit… full steps ready!'}</div>
            <div className="typing">EduSolve demo assistant • frontend only</div>
          </div>
        </div>
      </section>

      <section className="section">
        <span className="eyebrow">📌 {lang === 'mr' ? 'लोकप्रिय' : 'Popular'}</span>
        <h2>{t.popular_title}</h2>
        <p className="sub">{t.popular_sub}</p>
        <div className="grid cats">
          {popular.map((c) => (
            <button key={c.id} className="cat-card" onClick={() => nav(`/dashboard?cat=${c.id}`)}>
              <span className="cat-icon">{c.icon}</span>
              <span className="cat-title">{c.title[lang] || c.title.en}</span>
              <span className="cat-desc">{c.desc[lang] || c.desc.en}</span>
            </button>
          ))}
        </div>
        <div className="btn-row">
          <button className="btn secondary" onClick={() => nav('/dashboard')}>{t.view_all} →</button>
        </div>
      </section>

      <section className="section">
        <span className="eyebrow">⚙️ {lang === 'mr' ? 'प्रक्रिया' : 'Process'}</span>
        <h2>{t.how_title}</h2>
        <p className="sub">{t.how_sub}</p>
        <div className="grid cols3">
          <div className="card"><div className="how-num">1</div><h3>{t.how_1_t}</h3><p className="muted">{t.how_1_d}</p></div>
          <div className="card"><div className="how-num">2</div><h3>{t.how_2_t}</h3><p className="muted">{t.how_2_d}</p></div>
          <div className="card"><div className="how-num">3</div><h3>{t.how_3_t}</h3><p className="muted">{t.how_3_d}</p></div>
        </div>
      </section>

      <section className="section">
        <span className="eyebrow">💎 {lang === 'mr' ? 'वैशिष्ट्ये' : 'Features'}</span>
        <h2>{t.feat_title}</h2>
        <p className="sub">{t.feat_sub}</p>
        <div className="grid cols2">
          <div className="card"><div className="feat-icon">🪜</div><h3>{t.feat_1_t}</h3><p className="muted">{t.feat_1_d}</p></div>
          <div className="card"><div className="feat-icon">🧰</div><h3>{t.feat_2_t}</h3><p className="muted">{t.feat_2_d}</p></div>
          <div className="card"><div className="feat-icon">🌐</div><h3>{t.feat_3_t}</h3><p className="muted">{t.feat_3_d}</p></div>
          <div className="card"><div className="feat-icon">🔒</div><h3>{t.feat_4_t}</h3><p className="muted">{t.feat_4_d}</p></div>
        </div>
      </section>

      <section className="cta-banner">
        <div>
          <h2>{lang === 'mr' ? 'तुमची फॉर्म समस्या आजच सोडवा 🎓' : 'Fix your form problem today 🎓'}</h2>
          <p>{lang === 'mr' ? 'डेमो सहाय्यकाला विचारा किंवा स्मार्ट साधनांनी फाइल तपासा.' : 'Ask the demo assistant or verify your files with Smart Tools.'}</p>
        </div>
        <div className="btn-row" style={{ marginTop: 0 }}>
          <button className="btn" onClick={() => nav('/solver')}>🤖 {t.start_solving}</button>
          <button className="btn secondary" onClick={() => nav('/tools')}>🧰 {t.nav_tools}</button>
        </div>
      </section>
    </div>
  )
}
