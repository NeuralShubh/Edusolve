const FB = 'edusolve_feedback'
const SESSION = 'edusolve_admin'
const FEATURED = 'edusolve_featured'
const VISITS = 'edusolve_visits_daily'

function loadJSON(key, fallback) {
  try { const v = JSON.parse(localStorage.getItem(key)); return v ?? fallback } catch { return fallback }
}
function saveJSON(key, val) { try { localStorage.setItem(key, JSON.stringify(val)) } catch {} }

export function isAdmin() { return !!localStorage.getItem(SESSION) }
export function adminLogin(name) { localStorage.setItem(SESSION, JSON.stringify({ name: name || 'Admin', at: Date.now() })) }
export function adminLogout() { localStorage.removeItem(SESSION) }
export function adminName() { const s = loadJSON(SESSION, null); return s ? s.name : '' }

export function addFeedback({ title, verdict, source, at }) {
  const list = loadJSON(FB, [])
  list.unshift({ id: Date.now() + Math.random(), title, verdict, source, at: at || Date.now() })
  saveJSON(FB, list.slice(0, 300))
}
export function getFeedback() { return loadJSON(FB, []) }
export function clearFeedback() { saveJSON(FB, []) }

export function getFeatured() { return loadJSON(FEATURED, []) }
export function toggleFeatured(id) {
  const list = getFeatured()
  const next = list.includes(id) ? list.filter((x) => x !== id) : [...list, id]
  saveJSON(FEATURED, next)
  return next
}

export function trackVisit() {
  const key = new Date().toISOString().slice(0, 10)
  const d = loadJSON(VISITS, {})
  d[key] = (d[key] || 0) + 1
  saveJSON(VISITS, d)
}
export function getVisits() { return loadJSON(VISITS, {}) }

export function last7Days() {
  const out = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date(); d.setDate(d.getDate() - i)
    out.push(d.toISOString().slice(0, 10))
  }
  return out
}

export function relativeTime(ts) {
  const s = Math.floor((Date.now() - ts) / 1000)
  if (s < 60) return 'just now'
  if (s < 3600) return Math.floor(s / 60) + ' min ago'
  if (s < 86400) return Math.floor(s / 3600) + ' hr ago'
  return Math.floor(s / 86400) + ' d ago'
}

export function clearAllAppData() {
  Object.keys(localStorage).filter((k) => k.startsWith('edusolve_') && k !== 'edusolve_lang').forEach((k) => localStorage.removeItem(k))
}
