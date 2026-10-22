// Markdown export helpers for the Project Report.
// The long-form written document lives in src/data/report.js and is exported
// as a .md file, so nothing is lost when the on-screen report becomes charts.

import { CATEGORIES } from './categories'
import { REPORT_META, REPORT_SECTIONS, STORAGE_KEYS, DESIGN_TOKENS } from './report'

function pick(value, lang) {
  if (value && typeof value === 'object' && 'en' in value && 'mr' in value) {
    return value[lang] || value.en
  }
  return value
}

export function buildReportMarkdown(lang) {
  const L = (v) => pick(v, lang)
  const out = []
  out.push(`# ${REPORT_META.title}`)
  out.push('')
  out.push(`**${L(REPORT_META.subtitle)}**`)
  out.push('')
  out.push(`> ${L(REPORT_META.tagline)}`)
  out.push('')
  out.push(`- **Version:** ${REPORT_META.version}`)
  out.push(`- **Type:** ${L({ en: REPORT_META.type, mr: REPORT_META.typeMr })}`)
  out.push(`- **Repository:** ${REPORT_META.repo}`)
  out.push(`- **Live site:** ${REPORT_META.live}`)
  out.push(`- **Academic year:** ${REPORT_META.academicYear}`)
  out.push(`- **Department:** ${REPORT_META.institution}`)
  out.push('')
  out.push('---')
  out.push('')

  for (const sec of REPORT_SECTIONS) {
    out.push(`## ${sec.no}. ${L({ en: sec.en, mr: sec.mr })}`)
    out.push('')
    for (const b of sec.blocks || []) {
      if (b.t === 'p') { out.push(L(b)); out.push('') }
      else if (b.t === 'h3') { out.push(`### ${L(b)}`); out.push('') }
      else if (b.t === 'ul') { (b[lang] || b.en).forEach((x) => out.push(`- ${x}`)); out.push('') }
      else if (b.t === 'ol') { (b[lang] || b.en).forEach((x, i) => out.push(`${i + 1}. ${x}`)); out.push('') }
      else if (b.t === 'note') { out.push(`> **Note:** ${L(b)}`); out.push('') }
      else if (b.t === 'code') { out.push('```'); out.push(b.text); out.push('```'); out.push('') }
      else if (b.t === 'table') {
        out.push(`| ${b.head.join(' | ')} |`)
        out.push(`|${b.head.map(() => '---').join('|')}|`)
        for (const row of b.rows) out.push(`| ${row.map((c) => pick(c, lang)).join(' | ')} |`)
        out.push('')
      } else if (b.t === 'qa') {
        for (const item of b.items) { out.push(`**${L(item.q)}**`); out.push(''); out.push(L(item.a)); out.push('') }
      } else if (b.t === 'categories') {
        out.push('| # | id | Icon | Title |')
        out.push('|---|---|---|---|')
        CATEGORIES.forEach((c, i) => {
          out.push(`| ${i + 1} | \`${c.id}\` | \`${c.icon}\` | ${pick(c.title, lang)} |`)
        })
        out.push('')
      } else if (b.t === 'storage') {
        out.push('| Key | Module | Shape | Purpose |')
        out.push('|---|---|---|---|')
        for (const r of STORAGE_KEYS) out.push(`| \`${r[0]}\` | ${r[1]} | \`${r[2]}\` | ${r[3]} |`)
        out.push('')
      } else if (b.t === 'design') {
        out.push('| Token | Student | Admin | Purpose |')
        out.push('|---|---|---|---|')
        for (const r of DESIGN_TOKENS) out.push(`| \`${r[0]}\` | \`${r[1]}\` | \`${r[2]}\` | ${r[3]} |`)
        out.push('')
      }
    }
    out.push('---')
    out.push('')
  }
  return out.join('\n')
}

export function downloadText(filename, text, mime = 'text/markdown;charset=utf-8') {
  const blob = new Blob([text], { type: mime })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

export function downloadReportMarkdown(lang) {
  downloadText(`EduSolve-AI-Project-Report-${lang}.md`, buildReportMarkdown(lang))
}
