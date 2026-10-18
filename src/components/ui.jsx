import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useLang } from '../context/LanguageContext'
import { STRINGS } from '../i18n/translations'
import { Icon } from './icons'

export function Logo() {
  return (
    <Link to="/" className="logo">
      <span className="logo-mark"><Icon name="gradcap" size={22} strokeWidth={2.2} /></span>
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
        </nav>
        <div className="nav-actions">
          <button className="lang-btn" onClick={toggle} title="Switch language">
            <Icon name="languages" size={15} /> {lang === 'en' ? 'मराठी' : 'English'}
          </button>
          <button className="nav-cta" onClick={() => nav('/solver')}><Icon name="rocket" size={15} /> {t.start_solving}</button>
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
      <button className="hamburger" onClick={() => setOpen(!open)} aria-label="Menu"><Icon name="menu" size={20} /></button>
      {open && (
        <div className="mobile-menu">
          <button onClick={() => go('/')}>{t.nav_home}</button>
          <button onClick={() => go('/dashboard')}>{t.nav_dashboard}</button>
          <button onClick={() => go('/solver')}>{t.nav_solver}</button>
          <button onClick={() => go('/tools')}>{t.nav_tools}</button>
          <button onClick={() => { toggle(); setOpen(false) }}>{lang === 'en' ? 'मराठी' : 'English'}</button>
        </div>
      )}
    </div>
  )
}

export function Footer() {
  const { lang } = useLang()
  const t = STRINGS[lang]
  const nav = useNavigate()
  const links = [
    { to: '/', label: t.nav_home, icon: 'home' },
    { to: '/dashboard', label: t.nav_dashboard, icon: 'grid' },
    { to: '/solver', label: t.nav_solver, icon: 'chat' },
    { to: '/tools', label: t.nav_tools, icon: 'wrench' },
  ]
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <div className="footer-logo">EduSolve <b>AI</b></div>
          <p className="muted">{t.footer_tag}</p>
          <span className="footer-badge"><Icon name="shield" size={14} /> {lang === 'mr' ? 'पासवर्ड, OTP किंवा PIN कधीही मागत नाही.' : 'Never asks for passwords, OTPs or PINs.'}</span>
        </div>
        <div className="footer-col">
          <h4 className="with-icon"><Icon name="grid" size={16} /> {lang === 'mr' ? 'मेनू' : 'Menu'}</h4>
          <nav className="footer-links">
            {links.map((l) => (
              <button key={l.to} className="footer-link" onClick={() => nav(l.to)}>
                <Icon name={l.icon} size={15} /> {l.label}
              </button>
            ))}
          </nav>
        </div>
        <div className="footer-col">
          <h4 className="with-icon"><Icon name="help" size={17} /> {t.footer_help}</h4>
          <p className="muted small">{t.footer_help_text}</p>
        </div>
        <div className="footer-col">
          <h4 className="with-icon"><Icon name="shield" size={17} /> {t.footer_privacy}</h4>
          <p className="muted small">{t.footer_privacy_text}</p>
        </div>
      </div>
      <div className="footer-bottom">EduSolve AI • Step-by-Step Student Guidance • {new Date().getFullYear()}</div>
    </footer>
  )
}

import { useEffect } from 'react'
import { trackVisit } from '../lib/store'

export function Layout({ children }) {
  useEffect(() => { trackVisit() }, [])
  return (
    <div className="app-shell">
      <Sidebar />
      <div className="content-col">
        <Navbar />
        <main className="main">{children}</main>
        <Footer />
      </div>
      <MobileTabBar />
    </div>
  )
}

export function Sidebar() {
  const { lang, toggle } = useLang()
  const t = STRINGS[lang]
  const nav = useNavigate()
  const items = [
    { to: '/', label: t.nav_home, icon: 'home' },
    { to: '/dashboard', label: t.nav_dashboard, icon: 'grid' },
    { to: '/solver', label: t.nav_solver, icon: 'chat' },
    { to: '/tools', label: t.nav_tools, icon: 'wrench' },
  ]
  return (
    <aside className="sidebar" aria-label="Side menu">
      <div className="side-top"><Logo /></div>
      <nav className="side-nav">
        <span className="side-eyebrow">{lang === 'mr' ? 'मेनू' : 'Menu'}</span>
        {items.map((it) => (
          <NavLink key={it.to} to={it.to} className={({ isActive }) => 'side-link' + (isActive ? ' active' : '')}>
            <span className="side-ico"><Icon name={it.icon} size={19} /></span>
            {it.label}
          </NavLink>
        ))}
        <span className="side-eyebrow" style={{ marginTop: 14 }}>{lang === 'mr' ? 'पटकन' : 'Quick'}</span>
        <button className="side-cta" onClick={() => nav('/solver')}>
          <Icon name="sparkles" size={17} /> {t.start_solving}
        </button>
      </nav>
      <div className="side-foot">
        <button className="lang-btn side-lang" onClick={toggle}>
          <Icon name="languages" size={15} /> {lang === 'en' ? 'मराठी' : 'English'}
        </button>
      </div>
    </aside>
  )
}

export function MobileTabBar() {
  const { lang } = useLang()
  const t = STRINGS[lang]
  const tabs = [
    { to: '/', label: t.nav_home, icon: 'home' },
    { to: '/dashboard', label: t.nav_dashboard, icon: 'grid' },
    { to: '/solver', label: t.nav_solver, icon: 'chat', fab: true },
    { to: '/tools', label: t.nav_tools, icon: 'wrench' },
  ]
  return (
    <nav className="tabbar" aria-label="Primary">
      {tabs.map((tab) => (
        <NavLink key={tab.to} to={tab.to} className={({ isActive }) => 'tab' + (isActive ? ' active' : '') + (tab.fab ? ' fab-tab' : '')}>
          {tab.fab ? <span className="fab-circle"><Icon name={tab.icon} size={24} /></span> : <Icon name={tab.icon} size={21} />}
          <span>{tab.label}</span>
        </NavLink>
      ))}
    </nav>
  )
}

export function CategoryCard({ icon, title, desc, onClick, active }) {
  return (
    <button className={'cat-card' + (active ? ' active' : '')} onClick={onClick}>
      <span className="cat-icon"><Icon name={icon} size={24} /></span>
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
        <span className="sol-icon"><Icon name={solution.icon} size={26} /></span>
        <div>
          <div className="muted small">{lang === 'mr' ? 'ओळखलेली समस्या' : 'Problem identified'}</div>
          <h3>{solution.title}</h3>
        </div>
        <button className={'btn small' + (saved ? ' secondary' : '')} onClick={onSave}>
          <Icon name={saved ? 'bookmark' : 'heart'} size={14} /> {saved ? t.saved_label : t.save}
        </button>
      </div>
      <div className="sol-grid">
        <div className="sol-block">
          <h4 className="with-icon"><Icon name="search" size={16} /> {lang === 'mr' ? 'संभाव्य कारणे' : 'Possible causes'}</h4>
          <ul>{solution.causes.map((c, i) => <li key={i}>{c}</li>)}</ul>
        </div>
        <div className="sol-block highlight">
          <h4 className="with-icon"><Icon name="listcheck" size={16} /> {lang === 'mr' ? 'टप्प्याटप्प्याने उपाय' : 'Step-by-step solution'}</h4>
          <ol>{solution.steps.map((s, i) => <li key={i}>{s}</li>)}</ol>
        </div>
        <div className="sol-block">
          <h4 className="with-icon"><Icon name="shield" size={16} /> {lang === 'mr' ? 'प्रतिबंध टिपा' : 'Prevention tips'}</h4>
          <ul>{solution.prevention.map((p, i) => <li key={i}>{p}</li>)}</ul>
        </div>
        <div className="sol-block">
          <h4 className="with-icon"><Icon name="refresh" size={16} /> {lang === 'mr' ? 'पर्यायी उपाय' : 'Alternative solution'}</h4>
          <p>{solution.alternative}</p>
        </div>
      </div>
      {(onSolved || onUnsolved) && (
        <div className="sol-feedback">
          <button className="btn primary" onClick={onSolved}><Icon name="check" size={16} /> {t.solved}</button>
          <button className="btn" onClick={onUnsolved}><Icon name="x" size={16} /> {t.not_solved}</button>
        </div>
      )}
    </div>
  )
}
