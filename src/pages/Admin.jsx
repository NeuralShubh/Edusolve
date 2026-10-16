import { useMemo, useState } from 'react'
import { useLang } from '../context/LanguageContext'
import { STRINGS } from '../i18n/translations'
import { CATEGORIES } from '../data/categories'
import { Icon } from '../components/icons'
import {
  isAdmin, adminLogin, adminLogout, adminName,
  getFeedback, clearFeedback, addFeedback,
  getFeatured, toggleFeatured,
  getVisits, last7Days, relativeTime, clearAllAppData,
} from '../lib/store'

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
  demo.forEach((d, i) => addFeedback({ ...d, id: now - i }))
}

function AdminLogin() {
  const { lang } = useLang()
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
    <div className="admin-login">
      <form className="card admin-login-card" onSubmit={submit}>
        <span className="admin-lock"><Icon name="lock" size={24} /></span>
        <h2>Admin panel</h2>
        <p className="muted small">Frontend demo access. No real accounts or server data.</p>
        <label>{lang === 'mr' ? 'तुमचे नाव' : 'Your name'}</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Admin" />
        <label style={{ marginTop: 12 }}>{lang === 'mr' ? 'डेमो PIN' : 'Demo PIN'}</label>
        <input type="password" value={pin} onChange={(e) => setPin(e.target.value)} placeholder="1234" inputMode="numeric" />
        {err && <p className="admin-err">{err}</p>}
        <button className="btn primary" type="submit" style={{ width: '100%', marginTop: 16 }}>
          <Icon name="lock" size={16} /> {lang === 'mr' ? 'लॉगिन करा' : 'Sign in'}
        </button>
        <p className="demo-pill" style={{ width: '100%', justifyContent: 'center', marginTop: 14 }}>
          <Icon name="alert" size={13} /> Demo PIN: 1234
        </p>
      </form>
    </div>
  )
}

function Kpi({ icon, label, value, sub }) {
  return (
    <div className="kpi">
      <span className="kpi-ico"><Icon name={icon} size={20} /></span>
      <b>{value}</b>
      <span className="kpi-label">{label}</span>
      {sub && <small className="muted">{sub}</small>}
    </div>
  )
}

function Overview() {
  const { lang } = useLang()
  const fb = getFeedback()
  const visits = getVisits()
  const days = last7Days()
  const solved = fb.filter((f) => f.verdict === 'solved').length
  const rate = fb.length ? Math.round((solved / fb.length) * 100) : 0
  const week = days.map((d) => visits[d] || 0)
  const weekTotal = week.reduce((a, b) => a + b, 0)
  const maxV = Math.max(...week, 1)
  return (
    <div>
      <div className="kpi-grid">
        <Kpi icon="chat" label={lang === 'mr' ? 'प्रतिसाद' : 'Feedback entries'} value={fb.length} sub="localStorage (this device)" />
        <Kpi icon="checkcircle" label={lang === 'mr' ? 'सोडवले' : 'Marked solved'} value={solved + '%'} sub={rate + '% resolution rate'} />
        <Kpi icon="grid" label={lang === 'mr' ? 'समस्या प्रकार' : 'Categories'} value={CATEGORIES.length} sub={lang === 'mr' ? 'लाइव्ह सामग्री' : 'Live content'} />
        <Kpi icon="history" label={lang === 'mr' ? '७ दिवस भेटी' : 'Visits (7 days)'} value={weekTotal} sub={lang === 'mr' ? 'या उपकरणावर' : 'on this device'} />
      </div>
      <div className="card" style={{ marginTop: 14 }}>
        <h3 className="with-icon"><Icon name="history" size={18} /> {lang === 'mr' ? 'दैनंदिन भेटी' : 'Daily visits'}</h3>
        <div className="bars">
          {days.map((d, i) => (
            <div key={d} className="bar-col">
              <div className="bar" style={{ height: Math.max(6, (week[i] / maxV) * 100) + '%' }} title={week[i]} />
              <span>{d.slice(5)}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="card" style={{ marginTop: 14 }}>
        <h3 className="with-icon"><Icon name="chat" size={18} /> {lang === 'mr' ? 'अलीकडील प्रतिसाद' : 'Recent feedback'}</h3>
        {fb.length === 0 && <p className="muted small">No feedback yet.</p>}
        {fb.slice(0, 5).map((f) => (
          <div key={f.id} className="fb-row">
            <span className={'verdict ' + f.verdict}>{f.verdict === 'solved' ? 'Solved' : 'Unsolved'}</span>
            <b>{f.title}</b>
            <span className="muted small">{f.source}</span>
            <span className="muted small">{relativeTime(f.at)}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function FeedbackInbox() {
  const { lang } = useLang()
  const [q, setQ] = useState('')
  const [askClear, setAskClear] = useState(false)
  const fb = getFeedback()
  const list = q.trim() ? fb.filter((f) => f.title.toLowerCase().includes(q.trim().toLowerCase())) : fb
  return (
    <div className="card">
      <div className="row" style={{ justifyContent: 'space-between' }}>
        <h3 className="with-icon" style={{ margin: 0 }}><Icon name="chat" size={18} /> {lang === 'mr' ? 'प्रतिसाद इनबॉक्स' : 'Feedback inbox'} ({fb.length})</h3>
        {fb.length > 0 && (askClear
          ? <div className="row"><button className="btn small primary" onClick={() => { clearFeedback(); window.location.reload() }}><Icon name="check" size={14} /> {lang === 'mr' ? 'होय, साफ करा' : 'Yes, clear'}</button>
            <button className="btn small" onClick={() => setAskClear(false)}><Icon name="x" size={14} /> {lang === 'mr' ? 'रद्द' : 'Cancel'}</button></div>
          : <button className="btn small" onClick={() => setAskClear(true)}><Icon name="trash" size={14} /> {lang === 'mr' ? 'साफ करा' : 'Clear all'}</button>)}
      </div>
      <input className="admin-search" value={q} onChange={(e) => setQ(e.target.value)} placeholder={lang === 'mr' ? 'शीर्षक शोधा...' : 'Search by title...'} style={{ width: '100%', marginTop: 12 }} />
      <div style={{ marginTop: 10 }}>
        {list.length === 0 && <p className="muted small">Nothing here.</p>}
        {list.map((f) => (
          <div key={f.id} className="fb-row">
            <span className={'verdict ' + f.verdict}>{f.verdict === 'solved' ? 'Solved' : 'Unsolved'}</span>
            <b>{f.title}</b>
            <span className="muted small">{f.source}</span>
            <span className="muted small">{relativeTime(f.at)}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function CategoriesAdmin() {
  const { lang } = useLang()
  const [q, setQ] = useState('')
  const [featured, setFeatured] = useState(() => getFeatured())
  const list = useMemo(() => {
    const s = q.trim().toLowerCase()
    if (!s) return CATEGORIES
    return CATEGORIES.filter((c) => (c.title.en + c.title.mr + c.desc.en).toLowerCase().includes(s))
  }, [q])
  return (
    <div className="card">
      <h3 className="with-icon" style={{ marginTop: 0 }}><Icon name="grid" size={18} /> {lang === 'mr' ? 'समस्या प्रकार व्यवस्थापन' : 'Category manager'} ({CATEGORIES.length})</h3>
      <input className="admin-search" value={q} onChange={(e) => setQ(e.target.value)} placeholder={lang === 'mr' ? 'प्रकार शोधा...' : 'Search categories...'} style={{ width: '100%', marginTop: 8 }} />
      <div style={{ marginTop: 10 }}>
        {list.map((c) => (
          <div key={c.id} className="fb-row">
            <span className="cat-mini"><Icon name={c.icon} size={15} /></span>
            <b style={{ flex: 1, minWidth: 0 }}>{c.title[lang] || c.title.en}</b>
            <button className={'switch' + (featured.includes(c.id) ? ' on' : '')} onClick={() => setFeatured(toggleFeatured(c.id))} aria-label="Toggle featured">
              <span />
            </button>
            <span className="muted small">{featured.includes(c.id) ? 'Featured' : 'Standard'}</span>
          </div>
        ))}
      </div>
      <p className="muted small" style={{ marginTop: 12 }}>
        <Icon name="alert" size={13} /> Feature flag is saved on this device only (frontend demo, no database).
      </p>
    </div>
  )
}

function SettingsAdmin() {
  const { lang } = useLang()
  const [askReset, setAskReset] = useState(false)
  return (
    <div className="grid cols2">
      <div className="card">
        <h3 className="with-icon" style={{ marginTop: 0 }}><Icon name="shield" size={18} /> Session</h3>
        <p className="muted small">Signed in as <b>{adminName()}</b>. Access is stored only in this browser.</p>
        <button className="btn small" onClick={() => { adminLogout(); window.location.reload() }}>
          <Icon name="lock" size={14} /> {lang === 'mr' ? 'लॉगआउट' : 'Log out'}
        </button>
      </div>
      <div className="card">
        <h3 className="with-icon" style={{ marginTop: 0 }}><Icon name="trash" size={18} /> {lang === 'mr' ? 'डेटा' : 'Local data'}</h3>
        <p className="muted small">Clears feedback, visits, checks and saved items on this device. Language is kept.</p>
        {askReset
          ? <div className="row"><button className="btn small primary" onClick={() => { clearAllAppData(); window.location.reload() }}><Icon name="check" size={14} /> {lang === 'mr' ? 'होय, रीसेट' : 'Yes, reset'}</button>
            <button className="btn small" onClick={() => setAskReset(false)}><Icon name="x" size={14} /> {lang === 'mr' ? 'रद्द' : 'Cancel'}</button></div>
          : <button className="btn small secondary" onClick={() => setAskReset(true)}><Icon name="refresh" size={14} /> {lang === 'mr' ? 'सर्व रीसेट करा' : 'Reset app data'}</button>}
      </div>
      <div className="card">
        <h3 className="with-icon" style={{ marginTop: 0 }}><Icon name="info" size={18} /> Build info</h3>
        <p className="muted small">EduSolve AI admin. React + Vite frontend demo. No backend, no database, no real AI. Data you see is browser storage plus demo seeds.</p>
      </div>
      <div className="card">
        <h3 className="with-icon" style={{ marginTop: 0 }}><Icon name="shield" size={18} /> Safety</h3>
        <p className="muted small">This panel never asks for real passwords, OTPs, UPI or bank details. Do not enter such data anywhere in the app.</p>
      </div>
    </div>
  )
}

export default function Admin() {
  const { lang } = useLang()
  const [tab, setTab] = useState('overview')
  if (!isAdmin()) return <AdminLogin />
  seedOnce()
  const tabs = [
    { id: 'overview', label: lang === 'mr' ? 'ओव्हरव्ह्यू' : 'Overview', icon: 'sparkles' },
    { id: 'feedback', label: lang === 'mr' ? 'प्रतिसाद' : 'Feedback', icon: 'chat' },
    { id: 'cats', label: lang === 'mr' ? 'प्रकार' : 'Categories', icon: 'grid' },
    { id: 'settings', label: lang === 'mr' ? 'सेटिंग्ज' : 'Settings', icon: 'shield' },
  ]
  return (
    <div>
      <div className="admin-head">
        <div>
          <h2 className="with-icon" style={{ margin: 0 }}><Icon name="lock" size={24} /> {lang === 'mr' ? 'अ‍ॅडमिन पॅनल' : 'Admin panel'}</h2>
          <p className="muted">{lang === 'mr' ? 'नमुना प्रकल्प व्यवस्थापन. सर्व माहिती फक्त या ब्राउझरमध्ये.' : 'Demo project management. All data stays in this browser only.'}</p>
        </div>
        <div className="row">
          <span className="admin-badge"><Icon name="lock" size={13} /> {adminName()}</span>
          <button className="btn small" onClick={() => { adminLogout(); window.location.reload() }}><Icon name="lock" size={14} /> {lang === 'mr' ? 'बाहेर' : 'Log out'}</button>
        </div>
      </div>
      <div className="tool-nav admin-tabs">
        {tabs.map((tb) => (
          <button key={tb.id} className={tab === tb.id ? 'active' : ''} onClick={() => setTab(tb.id)}>
            <span className="with-icon"><Icon name={tb.icon} size={15} /> {tb.label}</span>
          </button>
        ))}
      </div>
      {tab === 'overview' && <Overview />}
      {tab === 'feedback' && <FeedbackInbox />}
      {tab === 'cats' && <CategoriesAdmin />}
      {tab === 'settings' && <SettingsAdmin />}
    </div>
  )
}
