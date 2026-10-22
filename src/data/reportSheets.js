// Turns the Project Report analytics object into spreadsheet sheet definitions.
// Pure data module: no React, no DOM, no browser APIs, so it can be imported
// in Node as well as in the browser. Numbers stay numbers, so Excel can sum them.

const LABELS = {
  reportTitle: { en: 'EduSolve AI — Problem Resolution Report', mr: 'EduSolve AI — समस्या निराकरण अहवाल' },
  summaryTitle: { en: 'Summary', mr: 'सारांश' },
  dailyTitle: { en: 'Daily breakdown', mr: 'दैनिक तपशील' },
  problemTypeTitle: { en: 'Problems by problem type', mr: 'समस्या प्रकारानुसार' },
  sourceTitle: { en: 'Problems by source', mr: 'स्रोतानुसार समस्या' },
  weeklyTitle: { en: 'Weekly comparison', mr: 'साप्ताहिक तुलना' },
  metric: { en: 'Metric', mr: 'निकष' },
  value: { en: 'Value', mr: 'मूल्य' },
  reported: { en: 'Problems reported', mr: 'नोंदवलेल्या समस्या' },
  solved: { en: 'Problems solved', mr: 'सोडवलेल्या समस्या' },
  pending: { en: 'Problems pending', mr: 'प्रलंबित समस्या' },
  solveRate: { en: 'Solve Rate %', mr: 'सोडवणी दर %' },
  rate: { en: 'Rate %', mr: 'दर %' },
  avgSolved: { en: 'Average solved per day', mr: 'दररोज सरासरी सोडवलेल्या' },
  avgReported: { en: 'Average reported per day', mr: 'दररोज सरासरी नोंदवलेल्या' },
  streak: { en: 'Solved-day streak (days)', mr: 'सलगीत दिवस (दिवस)' },
  bestDay: { en: 'Best day', mr: 'सर्वोत्तम दिवस' },
  busiestDay: { en: 'Busiest day', mr: 'सर्वाधिक समस्या असलेला दिवस' },
  problemTypes: { en: 'Problem types covered', mr: 'समाविष्ट समस्या प्रकार' },
  scope: { en: 'Data scope', mr: 'माहितीचा दायरा' },
  window: { en: 'Time window', mr: 'कालावधी' },
  generatedAt: { en: 'Generated at', mr: 'तयार करण्याची वेळ' },
  day: { en: 'Day', mr: 'दिवस' },
  weekday: { en: 'Weekday', mr: 'आठवडीचा दिवस' },
  total: { en: 'Total', mr: 'एकूण' },
  solvedCol: { en: 'Solved', mr: 'सोडवलेल्या' },
  pendingCol: { en: 'Pending', mr: 'प्रलंबित' },
  visits: { en: 'Visits', mr: 'भेटी' },
  rank: { en: 'Rank', mr: 'क्रमांक' },
  problemType: { en: 'Problem Type', mr: 'समस्येचा प्रकार' },
  share: { en: 'Share %', mr: 'वाटा %' },
  source: { en: 'Source', mr: 'स्रोत' },
  reports: { en: 'Reports', mr: 'नोंदी' },
  week: { en: 'Week', mr: 'आठवडा' },
  from: { en: 'From', mr: 'पासून' },
  to: { en: 'To', mr: 'पर्यंत' },
  scopeAll: { en: 'All data', mr: 'सर्व माहिती' },
  scopeProject: { en: 'Project dataset', mr: 'प्रकल्प माहिती' },
  scopeDevice: { en: 'This device', mr: 'या डिव्हाइसवर' },
}

// Strings that need values folded in — kept private so the public label map
// only ever contains ready-to-print text.
const TEMPLATES = {
  lastDays: { en: 'last {n} days', mr: 'गेल्या {n} दिवस' },
  bestDay: { en: '{label} ({weekday}) — {n} solved', mr: '{label} ({weekday}) — {n} सोडवलेल्या' },
  busiestDay: { en: '{label} ({weekday}) — {n} reported', mr: '{label} ({weekday}) — {n} नोंदी' },
  noteAll: {
    en: 'Data source: the 30-day project dataset ({p} rows) plus the problems solved in this browser ({d} rows).',
    mr: 'माहितीचा स्रोत: 30 दिवसांची प्रकल्प माहिती ({p} नोंदी) आणि या ब्राउझरमध्ये सोडवलेल्या समस्या ({d} नोंदी).',
  },
  noteProject: {
    en: 'Data source: the 30-day project dataset collected during testing ({p} rows).',
    mr: 'माहितीचा स्रोत: चाचणीच्या दरम्यान गोळा केलेली 30 दिवसांची प्रकल्प माहिती ({p} नोंदी).',
  },
  noteDevice: {
    en: 'Data source: only the problems recorded in this browser ({d} rows).',
    mr: 'माहितीचा स्रोत: फक्त या ब्राउझरमध्ये नोंदवलेल्या समस्या ({d} नोंदी).',
  },
}

const MONTHS = {
  en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  mr: ['जाने', 'फेब्रु', 'मार्च', 'एप्रि', 'मे', 'जून', 'जुलै', 'ऑग', 'सप्टें', 'ऑक्टो', 'नोव्हें', 'डिसे'],
}

const WEEKDAYS = {
  en: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  mr: ['रविवार', 'सोमवार', 'मंगळवार', 'बुधवार', 'गुरुवार', 'शुक्रवार', 'शनिवार'],
}

const FORBIDDEN = /[:\\/?*[\]]/g

/* ------------------------------------------------------------------ */
/* Small helpers                                                       */
/* ------------------------------------------------------------------ */
function isMr(lang) {
  return lang === 'mr'
}

function pick(value, lang) {
  if (!value || typeof value !== 'object') return value == null ? '' : String(value)
  if (isMr(lang)) return value.mr || value.en || ''
  return value.en || value.mr || ''
}

function fill(template, vars) {
  return String(template).replace(/\{(\w+)\}/g, (match, key) => (key in vars ? String(vars[key]) : match))
}

function num(value) {
  return typeof value === 'number' && Number.isFinite(value) ? value : 0
}

function pad(n) {
  return String(n).padStart(2, '0')
}

function safeName(name) {
  return String(name).replace(FORBIDDEN, '-').slice(0, 31)
}

/* Day labels come from the ISO day key so both languages stay in sync. */
function dayLabel(key, lang) {
  const parts = String(key || '').split('-')
  const month = Number(parts[1])
  const day = Number(parts[2])
  if (!month || !day) return String(key || '')
  return `${day} ${MONTHS[isMr(lang) ? 'mr' : 'en'][month - 1]}`
}

function weekdayOf(key, lang) {
  const dt = new Date(`${key}T00:00:00`)
  if (Number.isNaN(dt.getTime())) return ''
  return WEEKDAYS[isMr(lang) ? 'mr' : 'en'][dt.getDay()]
}

function formatStamp(ms, lang) {
  const d = new Date(ms)
  if (Number.isNaN(d.getTime())) return ''
  const label = `${d.getDate()} ${MONTHS[isMr(lang) ? 'mr' : 'en'][d.getMonth()]} ${d.getFullYear()}`
  return `${label}, ${pad(d.getHours())}:${pad(d.getMinutes())}`
}

/* ------------------------------------------------------------------ */
/* Public label map                                                    */
/* ------------------------------------------------------------------ */
export function reportSheetLabels(lang = 'en') {
  const out = {}
  for (const [key, value] of Object.entries(LABELS)) out[key] = pick(value, lang)
  return out
}

export function reportFileBaseName(lang = 'en') {
  return `EduSolve-AI-Analytics-Report-${isMr(lang) ? 'mr' : 'en'}`
}

/* ------------------------------------------------------------------ */
/* Sheet builders                                                      */
/* ------------------------------------------------------------------ */
function scopeLabel(scope, L) {
  if (scope === 'project') return L.scopeProject
  if (scope === 'device') return L.scopeDevice
  return L.scopeAll
}

function scopeNote(a, lang) {
  const key = a.scope === 'project' ? 'noteProject' : a.scope === 'device' ? 'noteDevice' : 'noteAll'
  return fill(TEMPLATES[key][isMr(lang) ? 'mr' : 'en'], { p: num(a.projectCount), d: num(a.deviceCount) })
}

function dayHighlight(day, templateKey, lang, field) {
  if (!day) return '—'
  const text = TEMPLATES[templateKey][isMr(lang) ? 'mr' : 'en']
  return fill(text, {
    label: dayLabel(day.key, lang),
    weekday: weekdayOf(day.key, lang),
    n: num(day[field]),
  })
}

function summarySheet(a, lang, L) {
  const t = a.totals || {}
  const rows = [
    [L.reported, num(t.reported)],
    [L.solved, num(t.solved)],
    [L.pending, num(t.pending)],
    [L.solveRate, num(t.rate)],
    [L.avgSolved, num(t.avgSolved)],
    [L.avgReported, num(t.avgReported)],
    [L.streak, num(t.streak)],
    [L.bestDay, dayHighlight(t.bestDay, 'bestDay', lang, 'solved')],
    [L.busiestDay, dayHighlight(t.busiestDay, 'busiestDay', lang, 'total')],
    [L.problemTypes, num(t.categories)],
    [L.scope, scopeLabel(a.scope, L)],
    [L.window, fill(TEMPLATES.lastDays[isMr(lang) ? 'mr' : 'en'], { n: num(a.days) })],
    [L.generatedAt, formatStamp(a.generatedAt, lang)],
  ]
  return {
    name: safeName('Summary'),
    title: L.reportTitle,
    columns: [
      { header: L.metric, width: 34 },
      { header: L.value, width: 22 },
    ],
    rows,
    note: scopeNote(a, lang),
  }
}

function dailySheet(a, lang, L) {
  const daily = a.daily || []
  const hasVisits = daily.some((d) => num(d.visits) > 0)
  const columns = [
    { header: L.day, width: 14 },
    { header: L.weekday, width: 14 },
    { header: L.solvedCol, width: 11 },
    { header: L.pendingCol, width: 11 },
    { header: L.total, width: 10 },
    { header: L.rate, width: 10 },
  ]
  if (hasVisits) columns.push({ header: L.visits, width: 10 })

  const rows = daily.map((d) => {
    const row = [
      dayLabel(d.key, lang),
      weekdayOf(d.key, lang),
      num(d.solved),
      num(d.pending),
      num(d.total),
      num(d.rate),
    ]
    if (hasVisits) row.push(num(d.visits))
    return row
  })

  return {
    name: safeName('Daily'),
    title: `${L.reportTitle} — ${L.dailyTitle}`,
    columns,
    rows,
  }
}

function problemTypeSheet(a, lang, L) {
  const ranked = a.ranked || []
  const columns = [
    { header: L.rank, width: 8 },
    { header: L.problemType, width: 38 },
    { header: L.total, width: 10 },
    { header: L.solvedCol, width: 11 },
    { header: L.pendingCol, width: 11 },
    { header: L.solveRate, width: 13 },
    { header: L.share, width: 11 },
  ]
  const rows = ranked.map((c, i) => [
    i + 1,
    pick(c.title, lang),
    num(c.total),
    num(c.solved),
    num(c.pending),
    num(c.rate),
    num(c.share),
  ])
  return {
    name: safeName('By Problem Type'),
    title: `${L.reportTitle} — ${L.problemTypeTitle}`,
    columns,
    rows,
  }
}

function sourceSheet(a, lang, L) {
  const sources = a.sources || []
  const columns = [
    { header: L.source, width: 30 },
    { header: L.reports, width: 12 },
    { header: L.solvedCol, width: 11 },
    { header: L.pendingCol, width: 11 },
    { header: L.solveRate, width: 13 },
  ]
  const rows = sources.map((s) => [
    pick(s, lang),
    num(s.count),
    num(s.solved),
    num(s.pending),
    num(s.rate),
  ])
  return {
    name: safeName('By Source'),
    title: `${L.reportTitle} — ${L.sourceTitle}`,
    columns,
    rows,
  }
}

function weeklySheet(a, lang, L) {
  const weekly = a.weekly || []
  const daily = a.daily || []
  const columns = [
    { header: L.week, width: 10 },
    { header: L.from, width: 14 },
    { header: L.to, width: 14 },
    { header: L.solvedCol, width: 11 },
    { header: L.pendingCol, width: 11 },
    { header: L.total, width: 10 },
    { header: L.rate, width: 10 },
  ]
  const rows = weekly.map((w, i) => {
    const slice = daily.slice(i * 7, i * 7 + 7)
    const from = slice.length ? dayLabel(slice[0].key, lang) : (w.from || '—')
    const to = slice.length ? dayLabel(slice[slice.length - 1].key, lang) : (w.to || '—')
    return [
      w.label || `W${i + 1}`,
      from,
      to,
      num(w.solved),
      num(w.pending),
      num(w.total),
      num(w.rate),
    ]
  })
  return {
    name: safeName('Weekly'),
    title: `${L.reportTitle} — ${L.weeklyTitle}`,
    columns,
    rows,
  }
}

/* ------------------------------------------------------------------ */
/* Entry point                                                         */
/* ------------------------------------------------------------------ */
export function buildReportSheets(a, lang = 'en') {
  if (!a) return []
  const L = reportSheetLabels(lang)
  return [
    summarySheet(a, lang, L),
    dailySheet(a, lang, L),
    problemTypeSheet(a, lang, L),
    sourceSheet(a, lang, L),
    weeklySheet(a, lang, L),
  ]
}
