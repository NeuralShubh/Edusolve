import { useMemo, useState } from 'react'
import { CATEGORIES } from '../../src/data/categories'
import { Icon } from '../../src/components/icons'
import {
  isAdmin, adminLogin, adminLogout, adminName,
  getFeedback, clearFeedback, addFeedback,
  getFeatured, toggleFeatured,
  getVisits, last7Days, relativeTime, clearAllAppData,
} from '../../src/lib/store'

function seedOnce() {
  if (getFeedback().length > 0) return
  const now = Date.now(); const H = 3600000
  const demo = [
    { title: 'Login and OTP Problems', verdict: 'solved', source: 'dashboard', at: now - 2 * H },
    { title: 'File Size and Format Problems', verdict: 'solved', source: 'solver', at: now - 8 * H },
    { title: 'Payment and Fee Issues', verdict: 'unsolved', source: 'dashboard', at: now - 20 * H },
    { title: 'Document Upload Problems', verdict: 'solved', source: 'solver', at: now - 30 * H },
    { title: 'Form Instructions and Information Entry', verdict: 'solved', source: 'dashboard', at: now - 44 * H },
  ]
  demo.forEach((d) => addFeedback(d))
}

function Brand({ compact }) {
  return (
    <div className={'brand' + (compact ? ' compact' : '')}>
      <span className="brand-mark"><Icon name="gradcap" size={compact ? 18 : 20} strokeWidth={2.2} /></span>
      <b>EduSolve <span>Admin</span></b>
    </div>
  )
}

function Login({ lang }) {
  const [name, setName] = useState('')
  const [pin, setPin] = useState('')
  const [err, setErr] = useState('')
  const submit = (e) => {
    e.preventDefault()
    if (!name.trim()) { setErr(lang === 'mr' ? 'नाव लिहा.' : 'Enter your name.'); return }
    if (pin.trim() !== '1234') { setErr(lang === 'mr' ? 'चूक PIN. डेमो PIN 1234 आहे.' : 'Wrong PIN. Demo PIN is 1234.'); return }
    adminLogin(name.trim())
    window.location.reload()
  }
  return (
    <div className="login-wrap">
      <div className="login-side">
        <Brand />
        <div>
          <h1>{lang === 'mr' ? 'वेगळे ॲडमिन कॅबिनेट' : 'Separate admin cabinet'}</h1>
          <p>{lang === 'mr' ? 'विद्यार्थी साइटपासून संपूर्णपणा वेगळी. फक्त ब्राउझर डेटा, सर्व्हर नाही.' : 'Fully apart from the student site. Browser data only, zero server.'}</p>
          <ul className="login-points">
            <li><Icon name="check" size={15} /> {lang === 'mr' ? 'प्रतिसाद इनबॉक्स व सोडवलेला दर' : 'Feedback inbox and solved rate'}</li>
            <li><Icon name="check" size={15} /> {lang === 'mr' ? 'दैनंदिन भेटींचा आलेख' : 'Daily visit chart'}</li>
            <li><Icon name="check" size={15} /> {lang === 'mr' ? 'समस्या प्रकार व्यवस्थापन' : 'Category manager'}</li>
          </ul>
        </div>
      </div>
      <form className="login-card" onSubmit={submit}>
        <span className="admin-lock"><Icon name="lock" size={24} /></span>
        <h2>{lang === 'mr' ? 'प्रवेश करा' : 'Sign in'}</h2>
        <p className="muted small">{lang === 'mr' ? 'डेमो सत्र. खरे खाते नाही.' : 'Demo session. No real accounts.'}</p>
        <label>{lang === 'mr' ? 'तुमचे नाव' : 'Your name'}</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Admin" />
        <label style={{ marginTop: 12 }}>{lang === 'mr' ? 'डेमो PIN' : 'Demo PIN'}</label>
        <input type="password" value={pin} onChange={(e) => setPin(e.target.value)} placeholder="1234" inputMode="numeric" />
        {err && <p className="admin-err">{err}</p>}
        <button className="btn primary block" type="submit"><Icon name="lock" size={16} /> {lang === 'mr' ? 'लॉगिन करा' : 'Sign in'}</button>
        <p className="pin-chip"><Icon name="alert" size={13} /> {lang === 'mr' ? 'डेमो PIN' : 'Demo PIN'}: 1234</p>
      </form>
    </div>
  )
}

function Kpi({ icon, label, value, sub }) {
  return (
    <div className="kpi">
      <div className="kpi-top">
        <span className="kpi-ico"><Icon name={icon} size={18} /></span>
        <span className="kpi-dot" />
      </div>
      <b>{value}</b>
      <span className="kpi-label">{label}</span>
      <small className="muted">{sub}</small>
    </div>
  )
}

function Overview({ lang, goFeedback }) {
  const fb = getFeedback()
  const visits = getVisits()
  const days = last7Days()
  const solved = fb.filter((f) => f.verdict === 'solved').length
  const unsolved = fb.length - solved
  const rate = fb.length ? Math.round((solved / fb.length) * 100) : 0
  const week = days.map((d) => visits[d] || 0)
  const weekTotal = week.reduce((a, b) => a + b, 0)
  const maxV = Math.max(...week, 1)
  const bySource = (s) => fb.filter((f) => f.source === s).length
  const dayLabel = (d) => {
    const [m, dd] = d.slice(5).split('-')
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    return dd + ' ' + months[+m - 1]
  }
  return (
    <div>
      <div className="kpi-grid">
        <Kpi icon="chat" label={lang === 'mr' ? 'प्रतिसाद' : 'Feedback entries'} value={fb.length} sub="app + this device" />
        <Kpi icon="checkcircle" label={lang === 'mr' ? 'सोडवलेला दर' : 'Solved rate'} value={rate + '%'} sub={solved + ' solved, ' + unsolved + ' open'} />
        <Kpi icon="grid" label={lang === 'mr' ? 'समस्या प्रकार' : 'Categories'} value={CATEGORIES.length} sub="live content" />
        <Kpi icon="history" label={lang === 'mr' ? '७ दिवस भेटी' : 'Visits, 7 days'} value={weekTotal} sub="same browser origin" />
      </div>

      <div className="panel chart-panel">
        <div className="panel-head">
          <div>
            <h3><Icon name="history" size={17} /> {lang === 'mr' ? 'दैनंदिन भेटी' : 'Daily visits'}</h3>
            <p className="muted small">{lang === 'mr' ? 'गेल्या ७ दिवस' : 'Last 7 days on this device'}</p>
          </div>
          <span className="chip">{weekTotal} total</span>
        </div>
        <div className="chart">
          <div className="chart-grid"><span /><span /><span /></div>
          <div className="bars">
            {days.map((d, i) => (
              <div key={d} className="bar-col">
                <span className="bar-val">{week[i] || 0}</span>
                <div className="bar-track"><div className="bar" style={{ height: Math.max(8, (week[i] / maxV) * 100) + '%' }} /></div>
                <span className="bar-label">{dayLabel(d)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="split">
        <div className="panel">
          <div className="panel-head">
            <div>
              <h3><Icon name="chat" size={17} /> {lang === 'mr' ? 'अलीकडील प्रतिसाद' : 'Recent feedback'}</h3>
              <p className="muted small">{lang === 'mr' ? 'विद्यार्थी साइटवरून' : 'From the student site'}</p>
            </div>
            <button className="btn small" onClick={goFeedback}>{lang === 'mr' ? 'सर्व पहा' : 'View all'} <Icon name="chevron" size={13} /></button>
          </div>
          {fb.length === 0 && <p className="muted small">No feedback yet.</p>}
          {fb.slice(0, 5).map((f) => (
            <div key={f.id} className="fb-row">
              <span className={'verdict ' + f.verdict}>{f.verdict === 'solved' ? 'Solved' : 'Unsolved'}</span>
              <b>{f.title}</b>
              <span className="src-pill">{f.source}</span>
              <span className="muted small time">{relativeTime(f.at)}</span>
            </div>
          ))}
        </div>

        <div className="panel">
          <div className="panel-head">
            <div>
              <h3><Icon name="checkcircle" size={17} /> {lang === 'mr' ? 'उकाडा' : 'Breakdown'}</h3>
              <p className="muted small">{lang === 'mr' ? 'सोडवले बनाम उरले' : 'Solved versus open'}</p>
            </div>
          </div>
          <div className="rate-ring">
            <b>{rate}<span>%</span></b>
            <div>
              <span className="legend green"><i /> {lang === 'mr' ? 'सोडवले' : 'Solved'} <b>{solved}</b></span>
              <span className="legend amber"><i /> {lang === 'mr' ? 'उरले' : 'Open'} <b>{unsolved}</b></span>
            </div>
          </div>
          <div className="split-bar"><div style={{ width: rate + '%' }} /></div>
          <div className="src-list">
            <div className="src-item"><span className="cat-mini"><Icon name="grid" size={14} /></span> Dashboard <b>{bySource('dashboard')}</b></div>
            <div className="src-item"><span className="cat-mini"><Icon name="chat" size={14} /></span> Solver <b>{bySource('solver')}</b></div>
          </div>
        </div>
      </div>
    </div>
  )
}

function FeedbackInbox({ lang }) {
  const [q, setQ] = useState('')
  const [filter, setFilter] = useState('all')
  const [askClear, setAskClear] = useState(false)
  const fb = getFeedback()
  const list = fb
    .filter((f) => filter === 'all' || f.verdict === filter)
    .filter((f) => !q.trim() || f.title.toLowerCase().includes(q.trim().toLowerCase()))
  return (
    <div className="panel">
      <div className="panel-head">
        <div>
          <h3><Icon name="chat" size={17} /> {lang === 'mr' ? 'प्रतिसाद इनबॉक्स' : 'Feedback inbox'}</h3>
          <p className="muted small">{fb.length} {lang === 'mr' ? 'नोंदी' : 'entries'} stored locally</p>
        </div>
        {fb.length > 0 && (askClear
          ? <div className="row"><button className="btn small primary" onClick={() => { clearFeedback(); window.location.reload() }}><Icon name="check" size={13} /> {lang === 'mr' ? 'होय' : 'Yes, clear'}</button>
            <button className="btn small" onClick={() => setAskClear(false)}><Icon name="x" size={13} /> {lang === 'mr' ? 'रद्द' : 'Cancel'}</button></div>
          : <button className="btn small" onClick={() => setAskClear(true)}><Icon name="trash" size={13} /> {lang === 'mr' ? 'साफ करा' : 'Clear'}</button>)}
      </div>
      <div className="fb-tools">
        <div className="search"><Icon name="search" size={15} /><input value={q} onChange={(e) => setQ(e.target.value)} placeholder={lang === 'mr' ? 'शीर्षक शोधा...' : 'Search by title...'} /></div>
        <div className="seg">
          {[['all', lang === 'mr' ? 'सर्व' : 'All'], ['solved', lang === 'mr' ? 'सोडवले' : 'Solved'], ['unsolved', lang === 'mr' ? 'उरले' : 'Open']].map(([id, lb]) => (
            <button key={id} className={filter === id ? 'on' : ''} onClick={() => setFilter(id)}>{lb}</button>
          ))}
        </div>
      </div>
      <div className="fb-table">
        <div className="fb-head-row"><span>{lang === 'mr' ? 'स्थिती' : 'Status'}</span><span>{lang === 'mr' ? 'समस्या' : 'Problem'}</span><span>{lang === 'mr' ? 'स्रोत' : 'Source'}</span><span>{lang === 'mr' ? 'वेळ' : 'Time'}</span></div>
        {list.length === 0 && <p className="muted small" style={{ padding: '14px 0' }}>Nothing here.</p>}
        {list.map((f) => (
          <div key={f.id} className="fb-row">
            <span className={'verdict ' + f.verdict}>{f.verdict === 'solved' ? 'Solved' : 'Unsolved'}</span>
            <b>{f.title}</b>
            <span className="src-pill">{f.source}</span>
            <span className="muted small time">{relativeTime(f.at)}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function CategoriesAdmin({ lang }) {
  const [q, setQ] = useState('')
  const [featured, setFeatured] = useState(() => getFeatured())
  const list = useMemo(() => {
    const s = q.trim().toLowerCase()
    if (!s) return CATEGORIES
    return CATEGORIES.filter((c) => (c.title.en + c.title.mr + c.desc.en).toLowerCase().includes(s))
  }, [q])
  return (
    <div className="panel">
      <div className="panel-head">
        <div>
          <h3><Icon name="grid" size={17} /> {lang === 'mr' ? 'समस्या प्रकार व्यवस्थापन' : 'Category manager'}</h3>
          <p className="muted small">{CATEGORIES.length} {lang === 'mr' ? 'प्रकार, ' : 'types, '}{featured.length} {lang === 'mr' ? 'वैशिष्ट्यपूर्ण' : 'featured'}</p>
        </div>
        <span className="chip">{lang === 'mr' ? 'फीचर फ्लॅग' : 'Feature flags'}</span>
      </div>
      <div className="fb-tools">
        <div className="search"><Icon name="search" size={15} /><input value={q} onChange={(e) => setQ(e.target.value)} placeholder={lang === 'mr' ? 'प्रकार शोधा...' : 'Search categories...'} /></div>
      </div>
      <div className="fb-table">
        <div className="fb-head-row"><span /><span>{lang === 'mr' ? 'प्रकार' : 'Category'}</span><span>{lang === 'mr' ? 'स्थिती' : 'State'}</span><span>{lang === 'mr' ? 'तरतूद' : 'Flag'}</span></div>
        {list.map((c) => (
          <div key={c.id} className="fb-row">
            <span className="cat-mini"><Icon name={c.icon} size={15} /></span>
            <b>{c.title[lang] || c.title.en}</b>
            <span className={'verdict ' + (featured.includes(c.id) ? 'solved' : 'open')}>{featured.includes(c.id) ? 'Featured' : 'Standard'}</span>
            <button className={'switch' + (featured.includes(c.id) ? ' on' : '')} onClick={() => setFeatured(toggleFeatured(c.id))} aria-label="Toggle featured"><span /></button>
          </div>
        ))}
      </div>
      <p className="muted small" style={{ marginTop: 12 }}><Icon name="alert" size={13} /> {lang === 'mr' ? 'फ्लॅग या ब्राउझरमध्येच जतन होतात (फ्रंटएंड डेमो).' : 'Flags are saved in this browser only (frontend demo).'}</p>
    </div>
  )
}

function SettingsAdmin({ lang }) {
  const [askReset, setAskReset] = useState(false)
  return (
    <div className="grid two">
      <div className="panel flat">
        <span className="set-ico"><Icon name="shield" size={18} /></span>
        <h3>{lang === 'mr' ? 'सत्र' : 'Session'}</h3>
        <p className="muted small">Signed in as <b>{adminName()}</b>. Stored only in this browser.</p>
        <button className="btn small" onClick={() => { adminLogout(); window.location.reload() }}><Icon name="lock" size={13} /> {lang === 'mr' ? 'लॉगआउट' : 'Log out'}</button>
      </div>
      <div className="panel flat">
        <span className="set-ico"><Icon name="trash" size={18} /></span>
        <h3>{lang === 'mr' ? 'स्थानिक डेटा' : 'Local data'}</h3>
        <p className="muted small">Clears feedback, visits and flags in this browser.</p>
        {askReset
          ? <div className="row"><button className="btn small primary" onClick={() => { clearAllAppData(); window.location.reload() }}><Icon name="check" size={13} /> {lang === 'mr' ? 'होय, रीसेट' : 'Yes, reset'}</button>
            <button className="btn small" onClick={() => setAskReset(false)}><Icon name="x" size={13} /> {lang === 'mr' ? 'रद्द' : 'Cancel'}</button></div>
          : <button className="btn small secondary" onClick={() => setAskReset(true)}><Icon name="refresh" size={13} /> {lang === 'mr' ? 'रीसेट करा' : 'Reset data'}</button>}
      </div>
      <div className="panel flat">
        <span className="set-ico"><Icon name="info" size={18} /></span>
        <h3>{lang === 'mr' ? 'बिल्ड माहिती' : 'Build info'}</h3>
        <p className="muted small">EduSolve Admin, separate React + Vite app. No backend, no database, no real AI. Student site lives at the main URL.</p>
      </div>
      <div className="panel flat">
        <span className="set-ico"><Icon name="alert" size={18} /></span>
        <h3>{lang === 'mr' ? 'सुरक्षा' : 'Safety'}</h3>
        <p className="muted small">Never enter real passwords, OTPs, UPI or bank details here. This is a college demo only.</p>
      </div>
    </div>
  )
}

const NAV = [
  { id: 'overview', en: 'Overview', mr: 'ओव्हरव्ह्यू', icon: 'sparkles' },
  { id: 'feedback', en: 'Feedback', mr: 'प्रतिसाद', icon: 'chat' },
  { id: 'cats', en: 'Categories', mr: 'प्रकार', icon: 'grid' },
  { id: 'settings', en: 'Settings', mr: 'सेटिंग्ज', icon: 'shield' },
]

export default function App() {
  const [lang, setLang] = useState(() => localStorage.getItem('edusolve_admin_lang') || 'en')
  const setLanguage = (l) => { setLang(l); localStorage.setItem('edusolve_admin_lang', l) }
  const [tab, setTab] = useState('overview')

  if (!isAdmin()) return <Login lang={lang} />
  seedOnce()

  const title = NAV.find((n) => n.id === tab)
  return (
    <div className="shell">
      <aside className="sidebar">
        <Brand />
        <nav className="side-nav">
          <span className="side-eyebrow">{lang === 'mr' ? 'मेनू' : 'Menu'}</span>
          {NAV.map((n) => (
            <button key={n.id} className={'side-link' + (tab === n.id ? ' active' : '')} onClick={() => setTab(n.id)}>
              <span className="side-ico"><Icon name={n.icon} size={17} /></span>
              {n[lang] || n.en}
            </button>
          ))}
        </nav>
        <div className="side-foot">
          <button className="lang-btn" onClick={() => setLanguage(lang === 'en' ? 'mr' : 'en')}>
            <Icon name="languages" size={14} /> {lang === 'en' ? 'मराठी' : 'English'}
          </button>
          <div className="user-card">
            <span className="user-av"><Icon name="lock" size={15} /></span>
            <div><b>{adminName()}</b><small>{lang === 'mr' ? 'डेमो अ‍ॅडमिन' : 'Demo admin'}</small></div>
          </div>
          <button className="btn small ghost block" onClick={() => { adminLogout(); window.location.reload() }}>
            <Icon name="lock" size={13} /> {lang === 'mr' ? 'लॉगआउट' : 'Log out'}
          </button>
        </div>
      </aside>

      <div className="content">
        <header className="topbar">
          <Brand compact />
          <div className="row">
            <button className="lang-btn" onClick={() => setLanguage(lang === 'en' ? 'mr' : 'en')}>
              <Icon name="languages" size={14} /> {lang === 'en' ? 'मराठी' : 'English'}
            </button>
            <button className="btn small" onClick={() => { adminLogout(); window.location.reload() }}><Icon name="lock" size={13} /> {lang === 'mr' ? 'बाहेर' : 'Log out'}</button>
          </div>
        </header>

        <main className="page">
          <div className="page-head">
            <div>
              <span className="eyebrow"><Icon name="sparkles" size={12} /> EduSolve {lang === 'mr' ? 'व्यवस्थापन' : 'console'}</span>
              <h1>{title[lang] || title.en}</h1>
              <p className="muted">{lang === 'mr' ? 'सर्व माहिती फक्त या ब्राउझरमध्ये. कोणताही सर्व्हर नाही.' : 'Everything lives in this browser only. No server anywhere.'}</p>
            </div>
            <span className="chip tall"><span className="live-dot" /> {lang === 'mr' ? 'लाइव्ह डेमो' : 'Live demo'}</span>
          </div>

          <div className="mobile-nav">
            {NAV.map((n) => (
              <button key={n.id} className={tab === n.id ? 'on' : ''} onClick={() => setTab(n.id)}>
                <span className="with-icon"><Icon name={n.icon} size={14} /> {n[lang] || n.en}</span>
              </button>
            ))}
          </div>

          {tab === 'overview' && <Overview lang={lang} goFeedback={() => setTab('feedback')} />}
          {tab === 'feedback' && <FeedbackInbox lang={lang} />}
          {tab === 'cats' && <CategoriesAdmin lang={lang} />}
          {tab === 'settings' && <SettingsAdmin lang={lang} />}
        </main>
      </div>
    </div>
  )
}
