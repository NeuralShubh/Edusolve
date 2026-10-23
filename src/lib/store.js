const FB = 'edusolve_feedback'
const SESSION = 'edusolve_admin'
const FEATURED = 'edusolve_featured'
const VISITS = 'edusolve_visits_daily'

const API = (
  import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV ? 'http://localhost:4000' : 'https://edusolve-api.onrender.com')
).replace(/\/$/, '')

function loadJSON(key, fallback) {
  try { const v = JSON.parse(localStorage.getItem(key)); return v ?? fallback } catch { return fallback }
}
function saveJSON(key, val) { try { localStorage.setItem(key, JSON.stringify(val)) } catch {} }

async function request(path, options) {
  try {
    const res = await fetch(API + path, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    })
    if (!res.ok || res.status === 204) return null
    return await res.json()
  } catch {
    return null
  }
}

export function isAdmin() { return !!localStorage.getItem(SESSION) }
export function adminLogin(name) { localStorage.setItem(SESSION, JSON.stringify({ name: name || 'Admin', at: Date.now() })) }
export function adminLogout() { localStorage.removeItem(SESSION) }
export function adminName() { const s = loadJSON(SESSION, null); return s ? s.name : '' }

export function addFeedback({ title, verdict, source, at }, { localOnly = false } = {}) {
  const list = loadJSON(FB, [])
  const entry = { id: Date.now() + Math.random(), title, verdict, source, at: at || Date.now() }
  list.unshift(entry)
  saveJSON(FB, list.slice(0, 300))
  if (!localOnly) {
    request('/api/feedback', { method: 'POST', body: JSON.stringify({ title, verdict, source, at: entry.at }) })
  }
}
export function getFeedback() { return loadJSON(FB, []) }
export function clearFeedback() {
  saveJSON(FB, [])
  request('/api/feedback', { method: 'DELETE' })
}

export function getFeatured() { return loadJSON(FEATURED, []) }
export function toggleFeatured(id) {
  const list = getFeatured()
  const next = list.includes(id) ? list.filter((x) => x !== id) : [...list, id]
  saveJSON(FEATURED, next)
  request('/api/featured/toggle', { method: 'POST', body: JSON.stringify({ category_id: id }) })
  return next
}

export function trackVisit() {
  const key = new Date().toISOString().slice(0, 10)
  const d = loadJSON(VISITS, {})
  d[key] = (d[key] || 0) + 1
  saveJSON(VISITS, d)
  request('/api/visits', { method: 'POST' })
}
export function getVisits() { return loadJSON(VISITS, {}) }

export async function pullFromServer() {
  const [feedback, visits, featured] = await Promise.all([
    request('/api/feedback'),
    request('/api/visits'),
    request('/api/featured'),
  ])
  if (Array.isArray(feedback)) saveJSON(FB, feedback)
  if (visits && typeof visits === 'object') saveJSON(VISITS, visits)
  if (Array.isArray(featured)) saveJSON(FEATURED, featured)
  if (typeof window !== 'undefined') window.dispatchEvent(new Event('edusolve:sync'))
}

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
