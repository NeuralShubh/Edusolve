import { useEffect, useMemo, useState } from 'react'
import { useLang } from '../context/LanguageContext'
import { CATEGORIES } from '../data/categories'
import {
  REPORT_META, REPORT_SECTIONS, STORAGE_KEYS, DESIGN_TOKENS, reportStats,
} from '../data/report'
import { Icon } from '../components/icons'

function pick(value, lang) {
  if (value && typeof value === 'object' && 'en' in value && 'mr' in value) {
    return value[lang] || value.en
  }
  return value
}

function Cell({ value, lang }) {
  const text = pick(value, lang)
  return <>{text}</>
}

/* ------------------------------------------------------------------ */
/* Markdown export — the whole report as a downloadable .md file       */
/* ------------------------------------------------------------------ */
function buildMarkdown(lang) {
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

function downloadMarkdown(lang) {
  const md = buildMarkdown(lang)
  const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `EduSolve-AI-Project-Report-${lang}.md`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */
export default function Report() {
  const { lang } = useLang()
  const [active, setActive] = useState(REPORT_SECTIONS[0].id)
  const stats = useMemo(() => reportStats(), [])

  const L = (v) => pick(v, lang)

  // Scroll spy
  useEffect(() => {
    const onScroll = () => {
      const top = window.scrollY + 140
      let current = REPORT_SECTIONS[0].id
      for (const s of REPORT_SECTIONS) {
        const el = document.getElementById(`rep-${s.id}`)
        if (el && el.offsetTop <= top) current = s.id
      }
      setActive(current)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const go = (id) => {
    const el = document.getElementById(`rep-${id}`)
    if (el) window.scrollTo({ top: el.offsetTop - 96, behavior: 'smooth' })
  }

  const printReport = () => window.print()

  return (
    <div className="report">
      {/* ---------- Hero ---------- */}
      <section className="report-hero">
        <span className="badge"><Icon name="bookmark" size={14} /> {lang === 'mr' ? 'प्रकल्प अहवाल' : 'Project Report'}</span>
        <h1>{REPORT_META.title}</h1>
        <p className="report-sub">{L(REPORT_META.subtitle)}</p>
        <p className="muted">{L(REPORT_META.tagline)}</p>

        <div className="report-actions">
          <button className="btn primary" onClick={printReport}>
            <Icon name="listcheck" size={16} /> {lang === 'mr' ? 'प्रिंट / PDF' : 'Print / Save as PDF'}
          </button>
          <button className="btn" onClick={() => downloadMarkdown(lang)}>
            <Icon name="download" size={16} /> {lang === 'mr' ? 'Markdown डाउनलोड' : 'Download Markdown'}
          </button>
          <a className="btn secondary" href={REPORT_META.repo} target="_blank" rel="noreferrer">
            <Icon name="cpu" size={16} /> {lang === 'mr' ? 'रिपॉझिटरी' : 'Repository'}
          </a>
        </div>

        <div className="report-meta-grid">
          <div><span>{lang === 'mr' ? 'आवृत्ती' : 'Version'}</span><b>{REPORT_META.version}</b></div>
          <div><span>{lang === 'mr' ? 'प्रकार' : 'Type'}</span><b>{lang === 'mr' ? REPORT_META.typeMr : REPORT_META.type}</b></div>
          <div><span>{lang === 'mr' ? 'शैक्षणिक वर्ष' : 'Academic year'}</span><b>{REPORT_META.academicYear}</b></div>
          <div><span>{lang === 'mr' ? 'विभाग' : 'Department'}</span><b>{REPORT_META.institution}</b></div>
        </div>

        <div className="report-stats">
          <div><b>{stats.categories}</b><span>{lang === 'mr' ? 'समस्या प्रकार' : 'Problem categories'}</span></div>
          <div><b>{stats.perLang}</b><span>{lang === 'mr' ? 'प्रति भाषा मजकूर' : 'Content strings / language'}</span></div>
          <div><b>{stats.followups}</b><span>{lang === 'mr' ? 'पाठपुरावे प्रश्न' : 'Follow-up questions'}</span></div>
          <div><b>{stats.keywords}</b><span>{lang === 'mr' ? 'कीवर्ड' : 'Detection keywords'}</span></div>
          <div><b>2</b><span>{lang === 'mr' ? 'UI भाषा' : 'UI languages'}</span></div>
          <div><b>3</b><span>{lang === 'mr' ? 'रनटाइम निर्भरता' : 'Runtime dependencies'}</span></div>
        </div>
      </section>

      {/* ---------- Body ---------- */}
      <div className="report-layout">
        {/* Table of contents */}
        <aside className="report-toc">
          <span className="side-eyebrow">{lang === 'mr' ? 'अनुक्रमणिका' : 'Contents'}</span>
          <nav>
            {REPORT_SECTIONS.map((s) => (
              <button
                key={s.id}
                className={'toc-link' + (active === s.id ? ' active' : '')}
                onClick={() => go(s.id)}
              >
                <span className="toc-no">{s.no}</span>
                <span className="toc-label">{L({ en: s.en, mr: s.mr })}</span>
              </button>
            ))}
          </nav>
          <div className="toc-foot">
            <button className="btn small" onClick={() => downloadMarkdown(lang)}>
              <Icon name="download" size={14} /> {lang === 'mr' ? '.md' : 'Export'}
            </button>
            <button className="btn small" onClick={printReport}>
              <Icon name="listcheck" size={14} /> {lang === 'mr' ? 'प्रिंट' : 'Print'}
            </button>
          </div>
        </aside>

        {/* Sections */}
        <main className="report-body">
          {REPORT_SECTIONS.map((sec) => (
            <section key={sec.id} id={`rep-${sec.id}`} className="rep-sec">
              <h2 className="rep-h2">
                <span className="rep-no">{sec.no}</span>
                <Icon name={sec.icon} size={22} />
                {L({ en: sec.en, mr: sec.mr })}
              </h2>

              {sec.blocks.map((b, i) => {
                if (b.t === 'p') {
                  return <p key={i} className="rep-p">{L(b)}</p>
                }
                if (b.t === 'h3') {
                  return <h3 key={i} className="rep-h3">{L(b)}</h3>
                }
                if (b.t === 'ul') {
                  const items = b[lang] || b.en
                  return <ul key={i} className="rep-ul">{items.map((x, j) => <li key={j}>{x}</li>)}</ul>
                }
                if (b.t === 'ol') {
                  const items = b[lang] || b.en
                  return <ol key={i} className="rep-ol">{items.map((x, j) => <li key={j}>{x}</li>)}</ol>
                }
                if (b.t === 'note') {
                  return (
                    <div key={i} className="rep-note">
                      <Icon name="info" size={16} />
                      <span>{L(b)}</span>
                    </div>
                  )
                }
                if (b.t === 'code') {
                  return <pre key={i} className="rep-code"><code>{b.text}</code></pre>
                }
                if (b.t === 'table') {
                  return (
                    <div key={i} className="rep-table-wrap">
                      <table className="rep-table">
                        <thead>
                          <tr>{b.head.map((h, j) => <th key={j}><Cell value={h} lang={lang} /></th>)}</tr>
                        </thead>
                        <tbody>
                          {b.rows.map((row, j) => (
                            <tr key={j}>{row.map((c, k) => <td key={k}><Cell value={c} lang={lang} /></td>)}</tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )
                }
                if (b.t === 'qa') {
                  return (
                    <div key={i} className="rep-qa">
                      {b.items.map((item, j) => (
                        <details key={j} className="rep-q" open={j === 0}>
                          <summary>
                            <span className="q-mark">Q{j + 1}</span>
                            <span className="q-text">{L(item.q)}</span>
                          </summary>
                          <div className="q-answer">
                            <span className="a-mark">A</span>
                            <p>{L(item.a)}</p>
                          </div>
                        </details>
                      ))}
                    </div>
                  )
                }
                if (b.t === 'categories') {
                  return (
                    <div key={i} className="rep-table-wrap">
                      <table className="rep-table">
                        <thead>
                          <tr>
                            <th>#</th>
                            <th>id</th>
                            <th>{lang === 'mr' ? 'चिन्ह' : 'Icon'}</th>
                            <th>{lang === 'mr' ? 'शीर्षक' : 'Title'}</th>
                            <th>{lang === 'mr' ? 'कीवर्ड' : 'Keywords'}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {CATEGORIES.map((c, j) => (
                            <tr key={c.id}>
                              <td>{j + 1}</td>
                              <td><code>{c.id}</code></td>
                              <td><span className="cat-mini"><Icon name={c.icon} size={15} /></span></td>
                              <td><b>{pick(c.title, lang)}</b><br /><span className="muted small">{pick(c.desc, lang)}</span></td>
                              <td className="kw-cell">{(c.keywords || []).slice(0, 6).join(', ')}{(c.keywords || []).length > 6 ? ` +${c.keywords.length - 6}` : ''}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )
                }
                if (b.t === 'storage') {
                  return (
                    <div key={i} className="rep-table-wrap">
                      <table className="rep-table">
                        <thead>
                          <tr>
                            <th>{lang === 'mr' ? 'की' : 'Key'}</th>
                            <th>{lang === 'mr' ? 'मॉड्यूल' : 'Module'}</th>
                            <th>{lang === 'mr' ? 'रूप' : 'Shape'}</th>
                            <th>{lang === 'mr' ? 'उपयोग' : 'Purpose'}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {STORAGE_KEYS.map((r) => (
                            <tr key={r[0]}>
                              <td><code>{r[0]}</code></td>
                              <td>{r[1]}</td>
                              <td><code>{r[2]}</code></td>
                              <td>{r[3]}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )
                }
                if (b.t === 'design') {
                  return (
                    <div key={i} className="rep-table-wrap">
                      <table className="rep-table">
                        <thead>
                          <tr>
                            <th>Token</th>
                            <th>{lang === 'mr' ? 'विद्यार्थी' : 'Student'}</th>
                            <th>{lang === 'mr' ? 'प्रशासन' : 'Admin'}</th>
                            <th>{lang === 'mr' ? 'उपयोग' : 'Purpose'}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {DESIGN_TOKENS.map((r) => (
                            <tr key={r[0]}>
                              <td><code>{r[0]}</code></td>
                              <td><code>{r[1]}</code></td>
                              <td><code>{r[2]}</code></td>
                              <td>{r[3]}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )
                }
                return null
              })}
            </section>
          ))}

          <section className="rep-end">
            <Icon name="check" size={18} />
            <span>
              {lang === 'mr'
                ? 'प्रकल्पाचा संपूर्ण अहवाल — प्रिंट करून PDF म्हणून जतन करा किंवा Markdown डाउनलोड करा.'
                : 'End of the project report — print to save as PDF, or download the Markdown copy.'}
            </span>
          </section>
        </main>
      </div>
    </div>
  )
}
