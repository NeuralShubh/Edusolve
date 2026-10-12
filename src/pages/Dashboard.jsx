import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useLang } from '../context/LanguageContext'
import { STRINGS } from '../i18n/translations'
import { CATEGORIES } from '../data/categories'
import { buildSolution } from '../engine/solverEngine'
import { CategoryCard, SolutionCard } from '../components/ui'
import { Icon } from '../components/icons'

function load(key, fallback) {
  try { const v = JSON.parse(localStorage.getItem(key)); return v ?? fallback } catch { return fallback }
}
function save(key, val) { try { localStorage.setItem(key, JSON.stringify(val)) } catch {} }

const DASH_CHECKS = [
  { en: 'Aadhaar + marksheet kept beside me', mr: 'आधार + मार्कशीट समोर ठेवले' },
  { en: 'Scanned documents under size limit (checked in Smart Tools)', mr: 'स्कॅन कागदपत्रे आकार मर्यादेखाली (स्मार्ट साधनांत तपासले)' },
  { en: 'Photo <50KB + signature <30KB ready', mr: 'फोटो <50KB + सही <30KB तयार' },
  { en: 'Saved draft after each section', mr: 'प्रत्येक भागानंतर ड्राफ्ट जतन केला' },
  { en: 'Preview checked + acknowledgement downloaded', mr: 'Preview तपासले + पोच डाउनलोड केली' },
]

export default function Dashboard() {
  const { lang } = useLang()
  const t = STRINGS[lang]
  const nav = useNavigate()
  const [params] = useSearchParams()
  const [query, setQuery] = useState('')
  const [activeCat, setActiveCat] = useState(params.get('cat') || '')
  const [recent, setRecent] = useState(() => load('edusolve_recent', []))
  const [savedIds, setSavedIds] = useState(() => load('edusolve_saved', []))
  const [checks, setChecks] = useState(() => load('edusolve_checks', [true, true, false, false, false]))

  useEffect(() => {
    const c = params.get('cat')
    if (c) setActiveCat(c)
  }, [params])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return CATEGORIES
    return CATEGORIES.filter((c) =>
      (c.title.en + c.title.mr + c.desc.en + c.desc.mr + c.keywords.join(' ')).toLowerCase().includes(q)
    )
  }, [query])

  const openCat = (id) => {
    setActiveCat(id)
    const next = [{ id, at: Date.now() }, ...recent.filter((r) => r.id !== id)].slice(0, 6)
    setRecent(next); save('edusolve_recent', next)
  }

  const activeSolution = activeCat ? buildSolution(activeCat, lang) : null
  const isSaved = activeCat && savedIds.includes(activeCat)
  const toggleSave = () => {
    if (!activeCat) return
    const next = isSaved ? savedIds.filter((s) => s !== activeCat) : [...savedIds, activeCat]
    setSavedIds(next); save('edusolve_saved', next)
  }
  const toggleCheck = (i) => {
    const next = checks.map((c, idx) => (idx === i ? !c : c))
    setChecks(next); save('edusolve_checks', next)
  }
  const progress = Math.round((checks.filter(Boolean).length / checks.length) * 100)

  const askAI = () => nav('/solver' + (query.trim() ? `?q=${encodeURIComponent(query.trim())}` : ''))

  const catById = (id) => CATEGORIES.find((x) => x.id === id)

  return (
    <div>
      <div className="dash-head">
        <h2 className="with-icon" style={{ margin: 0 }}><Icon name="sparkles" size={24} /> {t.welcome}</h2>
        <p className="muted">{t.dash_sub}</p>
        <div className="search-row">
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t.search_ph} onKeyDown={(e) => e.key === 'Enter' && askAI()} />
          <button className="btn primary" onClick={askAI}><Icon name="chat" size={16} /> {t.ask_ai}</button>
        </div>
        <div className="pill-list">
          {['OTP', 'payment failed', 'photo upload', 'form not submitting', 'file too large'].map((s) => (
            <button key={s} className="pill" onClick={() => { setQuery(s) }}>{s}</button>
          ))}
        </div>
      </div>

      <div className="section">
        <h2 className="with-icon"><Icon name="grid" size={24} /> {lang === 'mr' ? 'समस्या प्रकार (१२)' : 'Problem categories (12)'}</h2>
        <p className="sub">{t.popular_sub}</p>
        <div className="grid cats">
          {filtered.map((c) => (
            <CategoryCard key={c.id} icon={c.icon} title={c.title[lang] || c.title.en} desc={c.desc[lang] || c.desc.en}
              active={activeCat === c.id} onClick={() => openCat(c.id)} />
          ))}
        </div>
        {filtered.length === 0 && <p className="muted">No matches. Try “OTP”, “payment”, “photo”…</p>}
      </div>

      {activeSolution && (
        <div className="section">
          <SolutionCard solution={activeSolution} saved={isSaved} onSave={toggleSave}
            onSolved={() => alert(lang === 'mr' ? 'छान! अभिप्राय नोंदवला.' : 'Great! Feedback noted.')}
            onUnsolved={() => nav(`/solver?q=${encodeURIComponent(activeSolution.title)}`)} />
        </div>
      )}

      <div className="section grid cols3">
        <div className="card">
          <h3 className="with-icon"><Icon name="history" size={18} /> {t.recent}</h3>
          {recent.length === 0 ? <p className="muted small">{t.empty_recent}</p> :
            recent.map((r) => {
              const c = catById(r.id)
              if (!c) return null
              return <div key={r.id} className="list-item"><Icon name={c.icon} size={17} /><button className="pill" onClick={() => openCat(r.id)}>{c.title[lang] || c.title.en}</button></div>
            })}
        </div>
        <div className="card">
          <h3 className="with-icon"><Icon name="bookmark" size={18} /> {t.saved}</h3>
          {savedIds.length === 0 ? <p className="muted small">{t.empty_saved}</p> :
            savedIds.map((id) => {
              const c = catById(id)
              if (!c) return null
              return <div key={id} className="list-item"><Icon name={c.icon} size={17} /><button className="pill" onClick={() => openCat(id)}>{c.title[lang] || c.title.en}</button></div>
            })}
        </div>
        <div className="card">
          <h3 className="with-icon"><Icon name="listcheck" size={18} /> {t.progress} ({progress}%)</h3>
          <div className="progress"><div style={{ width: progress + '%' }} /></div>
          {DASH_CHECKS.map((c, i) => (
            <label key={i} className="check"><input type="checkbox" checked={!!checks[i]} onChange={() => toggleCheck(i)} /> {c[lang] || c.en}</label>
          ))}
        </div>
      </div>
    </div>
  )
}
