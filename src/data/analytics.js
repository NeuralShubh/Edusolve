// Analytics engine for the Project Report.
// Builds a deterministic 30-day problem dataset, merges it with the live data
// stored in this browser, and returns everything the report charts need.
// No backend, no network — everything is computed in the browser.

import { CATEGORIES } from './categories'

export const REPORT_DAYS = 30
export const RANGE_OPTIONS = [7, 14, 30]

export const SCOPES = [
  { id: 'all', en: 'All data', mr: 'सर्व माहिती' },
  { id: 'project', en: 'Project dataset', mr: 'प्रकल्प माहिती' },
  { id: 'device', en: 'This device', mr: 'या डिव्हाइसवर' },
]

export const SOURCES = [
  { id: 'solver', en: 'AI Problem Solver', mr: 'AI समस्या सोडवणूक' },
  { id: 'dashboard', en: 'Dashboard', mr: 'डॅशबोर्ड' },
]

/* ------------------------------------------------------------------ */
/* How often each problem type occurs, and how often it gets solved.  */
/* ------------------------------------------------------------------ */
export const CATEGORY_PROFILE = {
  otp: { weight: 30, solve: 0.83 },
  payment: { weight: 27, solve: 0.44 },
  'doc-upload': { weight: 23, solve: 0.66 },
  'file-size': { weight: 19, solve: 0.89 },
  submission: { weight: 17, solve: 0.51 },
  'form-entry': { weight: 15, solve: 0.76 },
  photo: { weight: 13, solve: 0.85 },
  internet: { weight: 12, solve: 0.71 },
  server: { weight: 11, solve: 0.55 },
  password: { weight: 9, solve: 0.88 },
  reload: { weight: 8, solve: 0.62 },
  other: { weight: 7, solve: 0.66 },
}

export const CHART_COLORS = {
  solved: '#16a34a',
  pending: '#f59e0b',
  accent: '#6d28d9',
  neutral: '#cbd5e1',
}

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */
function mulberry32(seed) {
  let a = seed
  return function () {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export function dayKey(d) {
  const dt = d instanceof Date ? d : new Date(d)
  const y = dt.getFullYear()
  const m = String(dt.getMonth() + 1).padStart(2, '0')
  const day = String(dt.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function shortDayLabel(key) {
  const [, m, d] = key.split('-')
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  return `${Number(d)} ${months[Number(m) - 1]}`
}

export function weekdayLabel(key, lang = 'en') {
  const dt = new Date(key + 'T00:00:00')
  const names = lang === 'mr'
    ? ['रविवार', 'सोमवार', 'मंगळवार', 'बुधवार', 'गुरुवार', 'शुक्रवार', 'शनिवार']
    : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  return names[dt.getDay()]
}

/* Map a free-text feedback title back to a category id. */
const TITLE_INDEX = (() => {
  const map = new Map()
  for (const c of CATEGORIES) {
    map.set(c.title.en.trim().toLowerCase(), c.id)
    if (c.title.mr) map.set(c.title.mr.trim().toLowerCase(), c.id)
  }
  return map
})()

export function matchCategory(text) {
  if (!text) return 'other'
  const t = String(text).trim().toLowerCase()
  if (TITLE_INDEX.has(t)) return TITLE_INDEX.get(t)
  for (const c of CATEGORIES) {
    if (t.includes(c.title.en.toLowerCase())) return c.id
    if (c.title.mr && t.includes(c.title.mr.trim().toLowerCase())) return c.id
  }
  return 'other'
}

/* ------------------------------------------------------------------ */
/* Deterministic 30-day dataset                                        */
/* ------------------------------------------------------------------ */
const PROFILE_ENTRIES = Object.entries(CATEGORY_PROFILE)
const TOTAL_WEIGHT = PROFILE_ENTRIES.reduce((s, [, p]) => s + p.weight, 0)

function pickCategory(rand) {
  let r = rand() * TOTAL_WEIGHT
  for (const [id, p] of PROFILE_ENTRIES) {
    r -= p.weight
    if (r <= 0) return id
  }
  return 'other'
}

/** Deterministic sample dataset — the same every time, so the report is stable. */
export function buildProjectDataset(now = Date.now(), days = REPORT_DAYS) {
  const rand = mulberry32(20251022)
  const rows = []
  const baseDate = new Date(now)
  baseDate.setHours(0, 0, 0, 0)
  const base = baseDate.getTime()

  for (let i = days - 1; i >= 0; i--) {
    const dayStart = base - i * 86400000
    const dow = new Date(dayStart).getDay()
    const weekend = dow === 0 ? 0.5 : dow === 6 ? 0.62 : 1
    const growth = 1 + ((days - i) / days) * 0.5
    const noise = 0.82 + rand() * 0.36
    const count = Math.max(5, Math.round(34 * weekend * growth * noise))

    for (let k = 0; k < count; k++) {
      const cat = pickCategory(rand)
      const solved = rand() < CATEGORY_PROFILE[cat].solve
      const hour = 8 + Math.floor(rand() * 16)
      const minute = Math.floor(rand() * 60)
      rows.push({
        at: dayStart + hour * 3600000 + minute * 60000,
        cat,
        verdict: solved ? 'solved' : 'unsolved',
        source: rand() < 0.63 ? 'solver' : 'dashboard',
      })
    }
  }
  return rows
}

/* ------------------------------------------------------------------ */
/* Live device data                                                    */
/* ------------------------------------------------------------------ */
export function readDeviceData() {
  const read = (key, fallback) => {
    try {
      const v = JSON.parse(localStorage.getItem(key))
      return v ?? fallback
    } catch {
      return fallback
    }
  }
  const feedback = read('edusolve_feedback', [])
  const visits = read('edusolve_visits_daily', {})
  const recent = read('edusolve_recent', [])
  const checks = read('edusolve_checks', [])

  const rows = (Array.isArray(feedback) ? feedback : []).map((f) => ({
    at: f.at || Date.now(),
    cat: matchCategory(f.title),
    verdict: f.verdict === 'solved' ? 'solved' : 'unsolved',
    source: f.source === 'dashboard' ? 'dashboard' : 'solver',
  }))

  return {
    rows,
    visits: visits && typeof visits === 'object' ? visits : {},
    opened: (Array.isArray(recent) ? recent : []).map((r) => r.id).filter(Boolean),
    checks: Array.isArray(checks) ? checks : [],
  }
}

/* ------------------------------------------------------------------ */
/* Aggregation                                                         */
/* ------------------------------------------------------------------ */
export function buildAnalytics({ scope = 'all', days = REPORT_DAYS, now = Date.now(), device } = {}) {
  const dev = device || readDeviceData()
  const projectRows = scope === 'device' ? [] : buildProjectDataset(now, REPORT_DAYS)
  const deviceRows = scope === 'project' ? [] : dev.rows
  const allRows = [...projectRows, ...deviceRows]

  const from = new Date(now)
  from.setHours(0, 0, 0, 0)
  const fromTime = from.getTime() - (days - 1) * 86400000

  const rows = allRows.filter((r) => r.at >= fromTime && r.at <= now)

  /* --- daily buckets --- */
  const dailyMap = new Map()
  for (let i = 0; i < days; i++) {
    const t = fromTime + i * 86400000
    const key = dayKey(t)
    dailyMap.set(key, { key, at: t, solved: 0, pending: 0, total: 0 })
  }
  for (const r of rows) {
    const key = dayKey(r.at)
    const bucket = dailyMap.get(key)
    if (!bucket) continue
    bucket.total++
    if (r.verdict === 'solved') bucket.solved++
    else bucket.pending++
  }

  const daily = [...dailyMap.values()].map((b) => ({
    ...b,
    label: shortDayLabel(b.key),
    weekday: weekdayLabel(b.key),
    rate: b.total ? Math.round((b.solved / b.total) * 100) : 0,
    visits: dev.visits[b.key] || 0,
  }))

  /* --- totals --- */
  const solved = rows.filter((r) => r.verdict === 'solved').length
  const pending = rows.length - solved
  const reported = rows.length

  /* --- per category --- */
  const catMap = new Map()
  for (const c of CATEGORIES) {
    catMap.set(c.id, {
      id: c.id,
      icon: c.icon,
      title: { en: c.title.en, mr: c.title.mr },
      total: 0,
      solved: 0,
      pending: 0,
    })
  }
  for (const r of rows) {
    const c = catMap.get(r.cat) || catMap.get('other')
    if (!c) continue
    c.total++
    if (r.verdict === 'solved') c.solved++
    else c.pending++
  }
  const categories = [...catMap.values()].map((c) => ({
    ...c,
    rate: c.total ? Math.round((c.solved / c.total) * 100) : 0,
    share: reported ? Math.round((c.total / reported) * 1000) / 10 : 0,
  }))
  const ranked = [...categories].sort((a, b) => b.total - a.total || b.solved - a.solved)
  const pendingRanked = [...categories].sort((a, b) => b.pending - a.pending || b.total - a.total)

  /* --- per source --- */
  const sources = SOURCES.map((s) => {
    const list = rows.filter((r) => r.source === s.id)
    const sSolved = list.filter((r) => r.verdict === 'solved').length
    return {
      ...s,
      count: list.length,
      solved: sSolved,
      pending: list.length - sSolved,
      rate: list.length ? Math.round((sSolved / list.length) * 100) : 0,
    }
  })

  /* --- weekly buckets --- */
  const weekCount = Math.ceil(days / 7)
  const weekly = []
  for (let w = 0; w < weekCount; w++) {
    const slice = daily.slice(w * 7, w * 7 + 7)
    const wSolved = slice.reduce((s, d) => s + d.solved, 0)
    const wPending = slice.reduce((s, d) => s + d.pending, 0)
    weekly.push({
      label: `W${w + 1}`,
      from: slice.length ? slice[0].label : '—',
      to: slice.length ? slice[slice.length - 1].label : '—',
      solved: wSolved,
      pending: wPending,
      total: wSolved + wPending,
      rate: wSolved + wPending ? Math.round((wSolved / (wSolved + wPending)) * 100) : 0,
    })
  }

  /* --- cumulative solved --- */
  let acc = 0
  const cumulative = daily.map((d) => {
    acc += d.solved
    return { key: d.key, label: d.label, value: acc }
  })

  /* --- highlights --- */
  const activeDays = daily.filter((d) => d.total > 0)
  const avgSolved = activeDays.length ? Math.round((solved / activeDays.length) * 10) / 10 : 0
  const avgReported = activeDays.length ? Math.round((reported / activeDays.length) * 10) / 10 : 0
  const bestDay = daily.reduce((best, d) => (d.solved > (best?.solved ?? -1) ? d : best), null)
  const busiestDay = daily.reduce((best, d) => (d.total > (best?.total ?? -1) ? d : best), null)
  const streak = (() => {
    let n = 0
    for (let i = daily.length - 1; i >= 0; i--) {
      if (daily[i].solved > 0) n++
      else break
    }
    return n
  })()

  return {
    scope,
    days,
    generatedAt: now,
    totals: {
      reported,
      solved,
      pending,
      rate: reported ? Math.round((solved / reported) * 100) : 0,
      categories: CATEGORIES.length,
      avgSolved,
      avgReported,
      streak,
      bestDay,
      busiestDay,
    },
    daily,
    categories,
    ranked,
    pendingRanked,
    sources,
    weekly,
    cumulative,
    hasDeviceData: dev.rows.length > 0,
    deviceCount: dev.rows.length,
    projectCount: projectRows.length,
  }
}

/* ------------------------------------------------------------------ */
/* Markdown export of the graphical report                             */
/* ------------------------------------------------------------------ */
export function analyticsMarkdown(a, lang = 'en') {
  const t = (en, mr) => (lang === 'mr' ? mr : en)
  const out = []
  out.push('# EduSolve AI — ' + t('Problem Resolution Report', 'समस्या निराकरण अहवाल'))
  out.push('')
  out.push(`- **Window:** last ${a.days} days`)
  out.push(`- **Scope:** ${a.scope}`)
  out.push(`- **Generated:** ${new Date(a.generatedAt).toLocaleString('en-GB')}`)
  out.push('')
  out.push('## ' + t('Headline numbers', 'मुख्य आकडे'))
  out.push('')
  out.push('| Metric | Value |')
  out.push('|---|---|')
  out.push(`| ${t('Problems reported', 'नोंदवलेल्या समस्या')} | ${a.totals.reported} |`)
  out.push(`| ${t('Problems solved', 'सोडवलेल्या समस्या')} | ${a.totals.solved} |`)
  out.push(`| ${t('Problems pending', 'प्रलंबित समस्या')} | ${a.totals.pending} |`)
  out.push(`| ${t('Solve rate', 'सोडवणी दर')} | ${a.totals.rate}% |`)
  out.push(`| ${t('Average solved per day', 'दररोज सरासरी सोडवलेल्या')} | ${a.totals.avgSolved} |`)
  out.push('')
  out.push('## ' + t('Problems solved per day', 'दररोज सोडवलेल्या समस्या'))
  out.push('')
  out.push('| Day | ' + t('Solved', 'सोडवले') + ' | ' + t('Pending', 'प्रलंबित') + ' | ' + t('Total', 'एकूण') + ' |')
  out.push('|---|---|---|---|')
  for (const d of a.daily) out.push(`| ${d.label} | ${d.solved} | ${d.pending} | ${d.total} |`)
  out.push('')
  out.push('## ' + t('Most frequently generated problems', 'सर्वाधिक वार नोंदवलेल्या समस्या'))
  out.push('')
  out.push('| # | ' + t('Problem', 'समस्या') + ' | ' + t('Total', 'एकूण') + ' | ' + t('Solved', 'सोडवले') + ' | ' + t('Pending', 'प्रलंबित') + ' | ' + t('Solve rate', 'सोडवणी दर') + ' |')
  out.push('|---|---|---|---|---|---|')
  a.ranked.forEach((c, i) => {
    const title = lang === 'mr' ? c.title.mr : c.title.en
    out.push(`| ${i + 1} | ${title} | ${c.total} | ${c.solved} | ${c.pending} | ${c.rate}% |`)
  })
  out.push('')
  return out.join('\n')
}
