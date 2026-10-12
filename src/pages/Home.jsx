import { useNavigate } from 'react-router-dom'
import { useLang } from '../context/LanguageContext'
import { STRINGS } from '../i18n/translations'
import { CATEGORIES } from '../data/categories'
import { Icon } from '../components/icons'

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
  const features = [
    { icon: 'listcheck', t: t.feat_1_t, d: t.feat_1_d },
    { icon: 'wrench', t: t.feat_2_t, d: t.feat_2_d },
    { icon: 'languages', t: t.feat_3_t, d: t.feat_3_d },
    { icon: 'shield', t: t.feat_4_t, d: t.feat_4_d },
  ]
  const actions = [
    { icon: 'chat', t: lang === 'mr' ? 'AI ला विचारा' : 'Ask AI', d: lang === 'mr' ? 'समस्या लिहा, उपाय मिळवा' : 'Describe it, get steps', to: '/solver' },
    { icon: 'box', t: lang === 'mr' ? 'फाइल तपासा' : 'Check file', d: lang === 'mr' ? 'आकार व प्रकार' : 'Size and format', to: '/tools' },
    { icon: 'photo', t: lang === 'mr' ? 'फोटो ठरवा' : 'Fix photo', d: lang === 'mr' ? 'आकार बदला' : 'Resize it', to: '/tools' },
    { icon: 'grid', t: lang === 'mr' ? 'प्रकार पाहा' : 'Browse issues', d: lang === 'mr' ? '१२ समस्या प्रकार' : '12 categories', to: '/dashboard' },
  ]

  return (
    <div>
      <section className="hero">
        <div>
          <span className="badge"><Icon name="sparkles" size={14} /> {t.hero_badge}</span>
          <h1>{t.hero_title_a} <span>{t.hero_title_b.split(' ')[0]} {t.hero_title_b.split(' ')[1] || ''}</span> <span className="violet">{t.hero_title_b.split(' ').slice(2).join(' ')}</span></h1>
          <p>{t.hero_desc}</p>
          <div className="btn-row">
            <button className="btn primary" onClick={() => nav('/solver')}><Icon name="rocket" size={17} /> {t.start_solving}</button>
            <button className="btn" onClick={() => nav('/dashboard')}><Icon name="compass" size={17} /> {t.explore_problems}</button>
          </div>
          <div className="hero-stats">
            {stats.map((s) => <div key={s.s} className="stat"><b>{s.b}</b><span>{s.s}</span></div>)}
          </div>
          <div><span className="demo-pill"><Icon name="alert" size={14} /> {t.demo_note}</span></div>
        </div>
        <div className="hero-art">
          <span className="float-chip c1"><Icon name="checkcircle" size={14} /> {lang === 'mr' ? 'टप्प्याटप्प्याने उपाय' : 'Step-by-step fix'}</span>
          <span className="float-chip c2"><Icon name="languages" size={14} /> EN + मराठी</span>
          <div className="chat-mock">
            <div className="bubble user">{lang === 'mr' ? 'माझा शिष्यवृत्ती फॉर्म सबमिट होत नाही.' : 'My scholarship form is not submitting.'}</div>
            <div className="bubble bot">{lang === 'mr' ? 'समजले! ही “फॉर्म सबमिशन” समस्या वाटते. २ सोपे प्रश्न विचारू का?' : 'Got it! This looks like a “Form Submission” issue. May I ask 2 quick questions?'}</div>
            <div className="bubble user">{lang === 'mr' ? 'हो, विचारा.' : 'Yes, go ahead.'}</div>
            <div className="bubble bot">{lang === 'mr' ? 'Preview + घोषणा टिक + एकदाच Final Submit. पूर्ण उपाय तयार आहे!' : 'Preview + declaration tick + one Final Submit. Full steps ready!'}</div>
            <div className="typing">EduSolve demo assistant • frontend only</div>
          </div>
        </div>
      </section>

      <section className="quick-grid" aria-label="Quick actions">
        {actions.map((a) => (
          <button key={a.t} className="quick-card" onClick={() => nav(a.to)}>
            <span className="quick-icon"><Icon name={a.icon} size={22} /></span>
            <span className="quick-text"><b>{a.t}</b><small>{a.d}</small></span>
            <Icon name="chevron" size={16} />
          </button>
        ))}
      </section>

      <section className="section">
        <span className="eyebrow"><Icon name="bookmark" size={13} /> {lang === 'mr' ? 'लोकप्रिय' : 'Popular'}</span>
        <h2>{t.popular_title}</h2>
        <p className="sub">{t.popular_sub}</p>
        <div className="grid cats">
          {popular.map((c) => (
            <button key={c.id} className="cat-card" onClick={() => nav(`/dashboard?cat=${c.id}`)}>
              <span className="cat-icon"><Icon name={c.icon} size={24} /></span>
              <span className="cat-title">{c.title[lang] || c.title.en}</span>
              <span className="cat-desc">{c.desc[lang] || c.desc.en}</span>
            </button>
          ))}
        </div>
        <div className="btn-row">
          <button className="btn secondary" onClick={() => nav('/dashboard')}>{t.view_all} <Icon name="chevron" size={15} /></button>
        </div>
      </section>

      <section className="section">
        <span className="eyebrow"><Icon name="cpu" size={13} /> {lang === 'mr' ? 'प्रक्रिया' : 'Process'}</span>
        <h2>{t.how_title}</h2>
        <p className="sub">{t.how_sub}</p>
        <div className="grid cols3">
          <div className="card"><div className="how-num">1</div><h3>{t.how_1_t}</h3><p className="muted">{t.how_1_d}</p></div>
          <div className="card"><div className="how-num">2</div><h3>{t.how_2_t}</h3><p className="muted">{t.how_2_d}</p></div>
          <div className="card"><div className="how-num">3</div><h3>{t.how_3_t}</h3><p className="muted">{t.how_3_d}</p></div>
        </div>
      </section>

      <section className="section">
        <span className="eyebrow"><Icon name="sparkles" size={13} /> {lang === 'mr' ? 'वैशिष्ट्ये' : 'Features'}</span>
        <h2>{t.feat_title}</h2>
        <p className="sub">{t.feat_sub}</p>
        <div className="grid cols2">
          {features.map((f) => (
            <div key={f.t} className="card"><div className="feat-icon"><Icon name={f.icon} size={24} /></div><h3>{f.t}</h3><p className="muted">{f.d}</p></div>
          ))}
        </div>
      </section>

      <section className="cta-banner">
        <div>
          <h2>{lang === 'mr' ? 'तुमची फॉर्म समस्या आजच सोडवा' : 'Fix your form problem today'}</h2>
          <p>{lang === 'mr' ? 'डेमो सहाय्यकाला विचारा किंवा स्मार्ट साधनांनी फाइल तपासा.' : 'Ask the demo assistant or verify your files with Smart Tools.'}</p>
        </div>
        <div className="btn-row" style={{ marginTop: 0 }}>
          <button className="btn" onClick={() => nav('/solver')}><Icon name="chat" size={16} /> {t.start_solving}</button>
          <button className="btn secondary" onClick={() => nav('/tools')}><Icon name="wrench" size={16} /> {t.nav_tools}</button>
        </div>
      </section>
    </div>
  )
}
