import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useLang } from '../context/LanguageContext'
import { STRINGS } from '../i18n/translations'

export function Logo() {
  return (
    <Link to="/" className="logo">
      <span className="logo-mark">E</span>
      <span className="logo-text">EduSolve <b>AI</b></span>
    </Link>
  )
}

export function Navbar() {
  const { lang, toggle } = useLang()
  const t = STRINGS[lang]
  const nav = useNavigate()
  const link = ({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')
  return (
    <header className="navbar">
      <div className="nav-inner">
        <Logo />
        <nav className="nav-links">
          <NavLink to="/" className={link}>{t.nav_home}</NavLink>
          <NavLink to="/dashboard" className={link}>{t.nav_dashboard}</NavLink>
          <NavLink to="/solver" className={link}>{t.nav_solver}</NavLink>
          <NavLink to="/tools" className={link}>{t.nav_tools}</NavLink>
          <NavLink to="/about" className={link}>{t.nav_about}</NavLink>
        </nav>
        <div className="nav-actions">
          <button className="lang-btn" onClick={toggle} title="Switch language">
            🌐 {lang === 'en' ? 'मराठी' : 'English'}
          </button>
          <button className="nav-cta" onClick={() => nav('/solver')}>🚀 {t.start_solving}</button>
          <MobileMenu t={t} toggle={toggle} lang={lang} />
        </div>
      </div>
    </header>
  )
}

import { useState } from 'react'
function MobileMenu({ t, toggle, lang }) {
  const [open, setOpen] = useState(false)
  const nav = useNavigate()
  const go = (p) => { setOpen(false); nav(p) }
  return (
    <div className="mobile-wrap">
      <button className="hamburger" onClick={() => setOpen(!open)} aria-label="Menu">☰</button>
      {open && (
        <div className="mobile-menu">
          <button onClick={() => go('/')}>{t.nav_home}</button>
          <button onClick={() => go('/dashboard')}>{t.nav_dashboard}</button>
          <button onClick={() => go('/solver')}>{t.nav_solver}</button>
          <button onClick={() => go('/tools')}>{t.nav_tools}</button>
          <button onClick={() => go('/about')}>{t.nav_about}</button>
          <button onClick={() => { toggle(); setOpen(false) }}>🌐 {lang === 'en' ? 'मराठी' : 'English'}</button>
        </div>
      )}
    </div>
  )
}

export function Footer() {
  const { lang } = useLang()
  const t = STRINGS[lang]
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div>
          <div className="footer-logo">EduSolve <b>AI</b></div>
          <p className="muted">{t.footer_tag}</p>
          <p className="demo-pill">⚠️ {t.demo_note}</p>
        </div>
        <div>
          <h4>🆘 {t.footer_help}</h4>
          <p className="muted small">{t.footer_help_text}</p>
        </div>
        <div>
          <h4>🔒 {t.footer_privacy}</h4>
          <p className="muted small">{t.footer_privacy_text}</p>
        </div>
      </div>
      <div className="footer-bottom">EduSolve AI • College Project Demo • Frontend only • {new Date().getFullYear()}</div>
    </footer>
  )
}

export function Layout({ children }) {
  return (
    <div className="app-shell">
      <Navbar />
      <main className="main">{children}</main>
      <Footer />
    </div>
  )
}

export function CategoryCard({ icon, title, desc, onClick, active }) {
  return (
    <button className={'cat-card' + (active ? ' active' : '')} onClick={onClick}>
      <span className="cat-icon">{icon}</span>
      <span className="cat-title">{title}</span>
      <span className="cat-desc">{desc}</span>
    </button>
  )
}

export function SolutionCard({ solution, onSolved, onUnsolved, saved, onSave }) {
  const { lang } = useLang()
  const t = STRINGS[lang]
  if (!solution) return null
  return (
    <div className="solution">
      <div className="solution-head">
        <span className="sol-icon">{solution.icon}</span>
        <div>
          <div className="muted small">{lang === 'mr' ? 'ओळखलेली समस्या' : 'Problem identified'}</div>
          <h3>{solution.title}</h3>
        </div>
        <button className={'btn small' + (saved ? ' secondary' : '')} onClick={onSave}>{saved ? `✓ ${t.saved_label}` : `♡ ${t.save}`}</button>
      </div>
      <div className="sol-grid">
        <div className="sol-block">
          <h4>🔍 {lang === 'mr' ? 'संभाव्य कारणे' : 'Possible causes'}</h4>
          <ul>{solution.causes.map((c, i) => <li key={i}>{c}</li>)}</ul>
        </div>
        <div className="sol-block highlight">
          <h4>🪜 {lang === 'mr' ? 'टप्प्याटप्प्याने उपाय' : 'Step-by-step solution'}</h4>
          <ol>{solution.steps.map((s, i) => <li key={i}>{s}</li>)}</ol>
        </div>
        <div className="sol-block">
          <h4>🛡️ {lang === 'mr' ? 'प्रतिबंध टिपा' : 'Prevention tips'}</h4>
          <ul>{solution.prevention.map((p, i) => <li key={i}>{p}</li>)}</ul>
        </div>
        <div className="sol-block">
          <h4>🔁 {lang === 'mr' ? 'पर्यायी उपाय' : 'Alternative solution'}</h4>
          <p>{solution.alternative}</p>
        </div>
      </div>
      {(onSolved || onUnsolved) && (
        <div className="sol-feedback">
          <button className="btn primary" onClick={onSolved}>✅ {t.solved}</button>
          <button className="btn" onClick={onUnsolved}>❌ {t.not_solved}</button>
        </div>
      )}
    </div>
  )
}
