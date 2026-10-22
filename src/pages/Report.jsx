import { useMemo, useState } from 'react'
import { useLang } from '../context/LanguageContext'
import { REPORT_META } from '../data/report'
import { buildAnalytics, RANGE_OPTIONS, SCOPES, CHART_COLORS } from '../data/analytics'
import { buildReportSheets, reportFileBaseName } from '../data/reportSheets'
import { downloadReportMarkdown } from '../data/reportExport'
import { downloadXlsx } from '../lib/xlsx'
import {
  AreaChart, BarList, ColumnChart, DonutChart, Gauge, Legend, Sparkline, SplitBar,
} from '../components/Charts'
import { Icon } from '../components/icons'
import { useToast } from '../components/PremiumUI'

const TXT = {
  en: {
    title: 'EduSolve AI',
    subtitle: 'Problem Resolution Report',
    print: 'Print / PDF',
    downloadExcel: 'Download Excel (.xlsx)',
    downloadDoc: 'Full document (.md)',
    repo: 'Repository',
    source: 'Data source',
    window: 'Time window',
    days: (n) => `${n} days`,
    lastDays: (n) => `last ${n} days`,
    reported: 'Problems reported',
    solved: 'Problems solved',
    pending: 'Problems pending',
    rate: 'Solve rate',
    perDay: 'Solved per day',
    topProblem: 'Most frequent problem',
    solvedVsPending: 'Solved vs pending',
    solvedVsPendingSub: 'Share of every reported problem',
    solvedOneDay: 'Problems solved in one day',
    solvedOneDaySub: 'Stacked: solved and still pending, day by day',
    frequent: 'Most frequently generated problems',
    frequentSub: 'Which problem types come up again and again',
    rateByCat: 'Solve rate by problem type',
    rateByCatSub: 'How much of each type the assistant could close',
    cumulative: 'Cumulative problems solved',
    cumulativeSub: 'Running total of solved problems',
    weekly: 'Weekly comparison',
    weeklySub: 'Solved and pending, week over week',
    sources: 'Where the problems are reported from',
    sourcesSub: 'Dashboard versus AI Problem Solver',
    pendingList: 'Pending problems — help desk list',
    pendingListSub: 'Problem types with the biggest open queue',
    dayWise: 'Day-wise result',
    dayWiseSub: 'Solved, pending and rate for each day',
    legendSolved: 'Solved',
    legendPending: 'Pending / not solved',
    bestDay: 'Best day',
    busiestDay: 'Busiest day',
    streak: 'Solved-day streak',
    total: 'Total',
    problem: 'Problem type',
    day: 'Day',
    rateCol: 'Rate',
    open: 'open',
    noData: 'No data for this selection yet. Solve a problem or switch the data source.',
    insight: 'Key finding',
    topInsight: (n, total, pct, r) => `${n} is the most frequently generated problem — ${total} reports (${pct}% of all) — and ${r}% of them were solved.`,
    pendingInsight: (n, c) => `${n} has the largest pending queue: ${c} problems are still not solved.`,
    scopeAll: 'All data',
    scopeProject: 'Project dataset',
    scopeDevice: 'This device',
    datasetNote: 'The project dataset is a 30-day sample collected during testing. Anything you solve in this browser is added on top of it.',
    deviceNote: 'Only the problems recorded in this browser are counted.',
    printHint: 'Tip: use your browser’s print dialogue and choose “Save as PDF”.',
    backToTop: 'Top of report',
  },
  mr: {
    title: 'EduSolve AI',
    subtitle: 'समस्या निराकरण अहवाल',
    print: 'प्रिंट / PDF',
    downloadExcel: 'एक्सेल डाउनलोड (.xlsx)',
    downloadDoc: 'संपूर्ण दस्तऐवज (.md)',
    repo: 'रिपॉझिटरी',
    source: 'माहितीचा स्रोत',
    window: 'कालावधी',
    days: (n) => `${n} दिवस`,
    lastDays: (n) => `गेल्या ${n} दिवस`,
    reported: 'नोंदवलेल्या समस्या',
    solved: 'सोडवलेल्या समस्या',
    pending: 'प्रलंबित समस्या',
    rate: 'सोडवणी दर',
    perDay: 'दररोज सोडवलेल्या',
    topProblem: 'सर्वाधिक नोंदवलेली समस्या',
    solvedVsPending: 'सोडवलेल्या विरुद्ध प्रलंबित',
    solvedVsPendingSub: 'नोंदवलेल्या प्रत्येक समस्येतील वाटा',
    solvedOneDay: 'एका दिवसात सोडवलेल्या समस्या',
    solvedOneDaySub: 'दिवसानुवारे सोडवलेल्या आणि प्रलंबित',
    frequent: 'सर्वाधिक वार नोंदवलेल्या समस्या',
    frequentSub: 'कोणत्या प्रकारच्या समस्या पुन्हा पुन्हा येतात',
    rateByCat: 'प्रकारनिहाय सोडवणी दर',
    rateByCatSub: 'प्रत्येक प्रकारच्या किती समस्या सोडवल्या गेल्या',
    cumulative: 'संचयित सोडवलेल्या समस्या',
    cumulativeSub: 'सोडवलेल्या समस्यांचा चालू एकूण',
    weekly: 'साप्ताहिक तुलना',
    weeklySub: 'सोडवलेल्या विरुद्ध प्रलंबित, आठवड्यानुवारे',
    sources: 'समस्या कुठून नोंदवल्या जातात',
    sourcesSub: 'डॅशबोर्ड विरुद्ध AI समस्या सोडवणूक',
    pendingList: 'प्रलंबित समस्या — हेल्प डेस्क यादी',
    pendingListSub: 'सर्वाधिक प्रलंबित असलेले प्रकार',
    dayWise: 'दिवसनिहाय निकाल',
    dayWiseSub: 'प्रत्येक दिवसाचा सोडवलेला, प्रलंबित आणि दर',
    legendSolved: 'सोडवलेल्या',
    legendPending: 'प्रलंबित / सुटले नाही',
    bestDay: 'सर्वोत्तम दिवस',
    busiestDay: 'सर्वाधिक समस्या असलेला दिवस',
    streak: 'सलगीत दिवस',
    total: 'एकूण',
    problem: 'समस्येचा प्रकार',
    day: 'दिवस',
    rateCol: 'दर',
    open: 'प्रलंबित',
    noData: 'या निवडीसाठी अजून माहिती नाही. एखादी समस्या सोडवा किंवा माहितीचा स्रोत बदला.',
    insight: 'मुख्य निष्कर्ष',
    topInsight: (n, total, pct, r) => `${n} ही सर्वाधिक वार नोंदवलेली समस्या आहे — ${total} नोंदी (एकूण ${pct}%) — आणि त्यांच्या ${r}% सोडवल्या गेल्या.`,
    pendingInsight: (n, c) => `${n} यात सर्वाधिक प्रलंबित आहे: ${c} समस्या अजून सोडवलेल्या नाहीत.`,
    scopeAll: 'सर्व माहिती',
    scopeProject: 'प्रकल्प माहिती',
    scopeDevice: 'या डिव्हाइसवर',
    datasetNote: 'प्रकल्प माहिती ही चाचणीच्या दरम्यान गोळा केलेली ३० दिवसांची नमुना माहिती आहे. तुम्ही या ब्राउझरमध्ये सोडवलेल्या समस्या त्यात जोडल्या जातात.',
    deviceNote: 'फक्त या ब्राउझरमध्ये नोंदवलेल्या समस्यांची गणती केली आहे.',
    printHint: 'टीप: ब्राउझरच्या प्रिंट संवादात “Save as PDF” निवडा.',
    backToTop: 'अहवालाची सुरुवात',
  },
}

function Panel({ icon, title, sub, right, className = '', children }) {
  return (
    <section className={'an-panel ' + className}>
      <div className="an-panel-head">
        <div>
          <h3 className="with-icon">{icon && <Icon name={icon} size={17} />} {title}</h3>
          {sub && <p className="muted small">{sub}</p>}
        </div>
        {right}
      </div>
      {children}
    </section>
  )
}

function Kpi({ icon, label, value, sub, color, spark, sparkColor }) {
  return (
    <div className="an-kpi">
      <div className="an-kpi-top">
        <span className="an-kpi-ico" style={color ? { color } : undefined}><Icon name={icon} size={17} /></span>
        {spark && spark.length > 1 && <Sparkline data={spark} color={sparkColor || color || CHART_COLORS.accent} />}
      </div>
      <b className="an-kpi-val" style={color ? { color } : undefined}>{value}</b>
      <span className="an-kpi-label">{label}</span>
      {sub && <span className="an-kpi-sub">{sub}</span>}
    </div>
  )
}

export default function Report() {
  const { lang } = useLang()
  const t = TXT[lang] || TXT.en
  const [scope, setScope] = useState('all')
  const [days, setDays] = useState(30)
  const [toast, showToast] = useToast()

  const a = useMemo(() => buildAnalytics({ scope, days }), [scope, days])
  const { totals } = a

  const titleOf = (c) => (lang === 'mr' ? c.title.mr : c.title.en)

  const top = a.ranked[0]
  const worstPending = a.pendingRanked[0]
  const empty = totals.reported === 0

  const dailyChart = a.daily.map((d) => ({
    key: d.key,
    label: d.label,
    total: d.total,
    parts: [
      { key: 'solved', name: t.legendSolved, value: d.solved, color: CHART_COLORS.solved },
      { key: 'pending', name: t.legendPending, value: d.pending, color: CHART_COLORS.pending },
    ],
  }))

  const weeklyChart = a.weekly.map((w) => ({
    key: w.label,
    label: w.label,
    total: w.total,
    parts: [
      { key: 'solved', name: t.legendSolved, value: w.solved, color: CHART_COLORS.solved },
      { key: 'pending', name: t.legendPending, value: w.pending, color: CHART_COLORS.pending },
    ],
  }))

  const frequentItems = a.ranked.map((c) => ({
    key: c.id,
    label: titleOf(c),
    fullLabel: titleOf(c),
    value: c.total,
    parts: [
      { key: 'solved', name: t.legendSolved, value: c.solved, color: CHART_COLORS.solved },
      { key: 'pending', name: t.legendPending, value: c.pending, color: CHART_COLORS.pending },
    ],
    sub: `${c.solved} ${lang === 'mr' ? 'सोडवलेल्या' : 'solved'} · ${c.pending} ${t.open} · ${c.rate}%`,
  }))

  const rateItems = [...a.ranked]
    .filter((c) => c.total > 0)
    .sort((x, y) => y.rate - x.rate)
    .map((c) => ({
      key: c.id,
      label: titleOf(c),
      value: c.rate,
      suffix: '%',
      color: c.rate >= 70 ? CHART_COLORS.solved : c.rate >= 50 ? '#eab308' : CHART_COLORS.pending,
      sub: `${c.solved}/${c.total}`,
    }))

  const downloadExcel = () => {
    const sheets = buildReportSheets(a, lang)
    downloadXlsx(`${reportFileBaseName(lang)}.xlsx`, sheets, {
      title: `${t.title} — ${t.subtitle}`,
      creator: 'EduSolve AI',
    })
    showToast(lang === 'mr'
      ? `एक्सेल फाइल तयार झाली (${sheets.length} शीट).`
      : `Excel file ready — ${sheets.length} sheets.`)
  }

  return (
    <div className="report an-report">
      {/* ---------------- Slim toolbar ---------------- */}
      <h1 className="sr-only">{t.title} — {t.subtitle}</h1>

      <section className="an-toolbar">
        <div className="an-control">
          <span className="an-control-label">{t.source}</span>
          <div className="an-seg">
            {SCOPES.map((s) => (
              <button key={s.id} className={scope === s.id ? 'on' : ''} onClick={() => setScope(s.id)}>
                {lang === 'mr' ? s.mr : s.en}
              </button>
            ))}
          </div>
        </div>

        <div className="an-control">
          <span className="an-control-label">{t.window}</span>
          <div className="an-seg">
            {RANGE_OPTIONS.map((n) => (
              <button key={n} className={days === n ? 'on' : ''} onClick={() => setDays(n)}>
                {t.days(n)}
              </button>
            ))}
          </div>
        </div>

        <div className="an-toolbar-actions">
          <button className="btn primary small" onClick={() => window.print()}>
            <Icon name="listcheck" size={15} /> {t.print}
          </button>
          <button className="btn small" onClick={downloadExcel}>
            <Icon name="download" size={15} /> {t.downloadExcel}
          </button>
          <button className="btn small" onClick={() => downloadReportMarkdown(lang)}>
            <Icon name="bookmark" size={15} /> {t.downloadDoc}
          </button>
          <a className="btn small secondary" href={REPORT_META.repo} target="_blank" rel="noreferrer">
            <Icon name="cpu" size={15} /> {t.repo}
          </a>
        </div>

        <p className="an-scope-note">
          <Icon name="info" size={13} /> {scope === 'device' ? t.deviceNote : t.datasetNote}
        </p>
      </section>

      {/* ---------------- Headline sentence ---------------- */}
      <section className="an-headline">
        <Icon name="sparkles" size={18} />
        <p>
          {lang === 'mr'
            ? `मागील ${days} दिवसांत एकूण ${totals.reported} सम्या नोंदवल्या गेल्या. यांपैकी ${totals.solved} सोडवल्या गेल्या (${totals.rate}%) आणि ${totals.pending} प्रलंबित आहेत.`
            : `In the last ${days} days ${totals.reported} problems were reported. ${totals.solved} of them were solved (${totals.rate}%) and ${totals.pending} are still pending.`}
        </p>
      </section>

      {/* ---------------- KPI cards ---------------- */}
      <div className="an-kpi-grid">
        <Kpi icon="chat" label={t.reported} value={totals.reported} sub={t.lastDays(days)} />
        <Kpi icon="checkcircle" label={t.solved} value={totals.solved} color={CHART_COLORS.solved}
          spark={a.daily.map((d) => d.solved)} sparkColor={CHART_COLORS.solved}
          sub={`${totals.rate}% ${lang === 'mr' ? 'दर' : 'of all reports'}`} />
        <Kpi icon="alert" label={t.pending} value={totals.pending} color={CHART_COLORS.pending}
          spark={a.daily.map((d) => d.pending)} sparkColor={CHART_COLORS.pending}
          sub={`${totals.reported ? Math.round((totals.pending / totals.reported) * 100) : 0}% ${lang === 'mr' ? 'प्रलंबित' : 'still open'}`} />
        <Kpi icon="target" label={t.rate} value={totals.rate + '%'} color={CHART_COLORS.accent}
          sub={`${totals.avgSolved} ${lang === 'mr' ? 'दररोज' : 'per day'}`} />
        <Kpi icon="history" label={t.perDay} value={totals.avgSolved}
          sub={`${totals.streak} ${lang === 'mr' ? 'दिवस सलगीत' : 'day streak'}`} />
        <Kpi icon="grid" label={t.topProblem} value={top && top.total > 0 ? top.total : '—'}
          sub={top && top.total > 0 ? titleOf(top) : '—'} />
      </div>

      {empty ? (
        <div className="an-empty">
          <Icon name="info" size={18} />
          <span>{t.noData}</span>
        </div>
      ) : (
        <>
          {/* ---------------- Chart grid ---------------- */}
          <div className="an-grid">
            {/* Solved vs pending */}
            <Panel icon="checkcircle" title={t.solvedVsPending} sub={t.solvedVsPendingSub}>
              <div className="an-donut-wrap">
                <DonutChart
                  size={190}
                  segments={[
                    { key: 'solved', label: t.legendSolved, value: totals.solved, color: CHART_COLORS.solved },
                    { key: 'pending', label: t.legendPending, value: totals.pending, color: CHART_COLORS.pending },
                  ]}
                  center={(
                    <>
                      <text x="95" y="92" className="ch-donut-num" textAnchor="middle">{totals.rate}%</text>
                      <text x="95" y="112" className="ch-donut-cap" textAnchor="middle">{lang === 'mr' ? 'सोडवणी दर' : 'solved'}</text>
                    </>
                  )}
                />
                <div className="an-donut-side">
                  <div className="an-stat">
                    <span className="an-dot" style={{ background: CHART_COLORS.solved }} />
                    <div>
                      <b>{totals.solved}</b>
                      <span>{t.legendSolved}</span>
                    </div>
                  </div>
                  <div className="an-stat">
                    <span className="an-dot" style={{ background: CHART_COLORS.pending }} />
                    <div>
                      <b>{totals.pending}</b>
                      <span>{t.legendPending}</span>
                    </div>
                  </div>
                  <div className="an-stat">
                    <span className="an-dot" style={{ background: CHART_COLORS.neutral }} />
                    <div>
                      <b>{totals.reported}</b>
                      <span>{t.total}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Panel>

            {/* Solve rate gauge */}
            <Panel icon="target" title={t.rate} sub={t.solvedVsPendingSub}>
              <div className="an-gauge-wrap">
                <Gauge value={totals.rate} size={210} color={CHART_COLORS.solved}
                  label={lang === 'mr' ? 'सोडवणी दर' : 'solve rate'} />
                <div className="an-mini-stats">
                  <div><span>{t.bestDay}</span><b>{totals.bestDay ? `${totals.bestDay.label} (${totals.bestDay.solved})` : '—'}</b></div>
                  <div><span>{t.busiestDay}</span><b>{totals.busiestDay ? `${totals.busiestDay.label} (${totals.busiestDay.total})` : '—'}</b></div>
                  <div><span>{t.streak}</span><b>{totals.streak} {lang === 'mr' ? 'दिवस' : 'days'}</b></div>
                  <div><span>{t.perDay}</span><b>{totals.avgSolved}</b></div>
                </div>
              </div>
            </Panel>

            {/* Daily chart — full width */}
            <Panel icon="history" title={t.solvedOneDay} sub={t.solvedOneDaySub} className="span2">
              <ColumnChart data={dailyChart} height={250} />
              <Legend items={[
                { key: 's', label: t.legendSolved, color: CHART_COLORS.solved, value: totals.solved },
                { key: 'p', label: t.legendPending, color: CHART_COLORS.pending, value: totals.pending },
              ]} />
            </Panel>

            {/* Frequent problems */}
            <Panel icon="grid" title={t.frequent} sub={t.frequentSub}>
              <BarList items={frequentItems} />
              <div className="an-legend-inline">
                <span><i style={{ background: CHART_COLORS.solved }} /> {t.legendSolved}</span>
                <span><i style={{ background: CHART_COLORS.pending }} /> {t.legendPending}</span>
              </div>
            </Panel>

            {/* Solve rate by category */}
            <Panel icon="target" title={t.rateByCat} sub={t.rateByCatSub}>
              <BarList items={rateItems} suffix="%" />
            </Panel>

            {/* Cumulative */}
            <Panel icon="sparkles" title={t.cumulative} sub={t.cumulativeSub}>
              <AreaChart data={a.cumulative} height={240} color={CHART_COLORS.accent} />
            </Panel>

            {/* Weekly */}
            <Panel icon="listcheck" title={t.weekly} sub={t.weeklySub}>
              <ColumnChart data={weeklyChart} height={240} />
              <Legend items={[
                { key: 's', label: t.legendSolved, color: CHART_COLORS.solved, value: totals.solved },
                { key: 'p', label: t.legendPending, color: CHART_COLORS.pending, value: totals.pending },
              ]} />
            </Panel>

            {/* Sources */}
            <Panel icon="chat" title={t.sources} sub={t.sourcesSub} className="span2">
              <div className="an-source-grid">
                {a.sources.map((s) => (
                  <div className="an-source" key={s.id}>
                    <div className="an-source-head">
                      <b>{lang === 'mr' ? s.mr : s.en}</b>
                      <span>{s.count} {lang === 'mr' ? 'नोंदी' : 'reports'}</span>
                    </div>
                    <SplitBar segments={[
                      { key: 's', label: t.legendSolved, value: s.solved, color: CHART_COLORS.solved },
                      { key: 'p', label: t.legendPending, value: s.pending, color: CHART_COLORS.pending },
                    ]} />
                    <div className="an-source-foot">
                      <span>{t.legendSolved} <b>{s.solved}</b></span>
                      <span>{t.legendPending} <b>{s.pending}</b></span>
                      <span>{t.rateCol} <b>{s.rate}%</b></span>
                    </div>
                  </div>
                ))}
              </div>
            </Panel>

            {/* Pending list */}
            <Panel icon="alert" title={t.pendingList} sub={t.pendingListSub} className="span2">
              <div className="rep-table-wrap">
                <table className="rep-table">
                  <thead>
                    <tr>
                      <th>{t.problem}</th>
                      <th>{t.total}</th>
                      <th>{t.solved}</th>
                      <th>{t.pending}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {a.pendingRanked.map((c) => (
                      <tr key={c.id}>
                        <td>
                          <span className="an-td-cat"><Icon name={c.icon} size={15} /> {titleOf(c)}</span>
                        </td>
                        <td>{c.total}</td>
                        <td style={{ color: CHART_COLORS.solved, fontWeight: 700 }}>{c.solved}</td>
                        <td style={{ color: CHART_COLORS.pending, fontWeight: 700 }}>{c.pending}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Panel>

            {/* Day-wise table */}
            <Panel icon="calendar" title={t.dayWise} sub={t.dayWiseSub} className="span2">
              <div className="rep-table-wrap">
                <table className="rep-table">
                  <thead>
                    <tr>
                      <th>{t.day}</th>
                      <th>{t.solved}</th>
                      <th>{t.pending}</th>
                      <th>{t.total}</th>
                      <th>{t.rateCol}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {a.daily.slice().reverse().map((d) => (
                      <tr key={d.key}>
                        <td><b>{d.label}</b> <span className="muted small">({d.weekday})</span></td>
                        <td style={{ color: CHART_COLORS.solved, fontWeight: 700 }}>{d.solved}</td>
                        <td style={{ color: CHART_COLORS.pending, fontWeight: 700 }}>{d.pending}</td>
                        <td>{d.total}</td>
                        <td>{d.rate}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Panel>
          </div>

          {/* ---------------- Insight ---------------- */}
          <section className="an-insight">
            <span className="an-insight-ico"><Icon name="sparkles" size={18} /></span>
            <div>
              <h3>{t.insight}</h3>
              <ul>
                {top && top.total > 0 && (
                  <li>{t.topInsight(titleOf(top), top.total, top.share, top.rate)}</li>
                )}
                {worstPending && worstPending.pending > 0 && (
                  <li>{t.pendingInsight(titleOf(worstPending), worstPending.pending)}</li>
                )}
                <li>
                  {lang === 'mr'
                    ? `सरासरी ${totals.avgReported} समस्या दररोज नोंदवल्या जातात आणि ${totals.avgSolved} सोडवल्या जातात.`
                    : `On average ${totals.avgReported} problems are reported per day and ${totals.avgSolved} of them get solved.`}
                </li>
              </ul>
            </div>
          </section>

          {/* ---------------- Category reference table ---------------- */}
          <section className="an-panel">
            <div className="an-panel-head">
              <div>
                <h3 className="with-icon"><Icon name="listcheck" size={17} /> {t.problem} — {t.total}</h3>
                <p className="muted small">{lang === 'mr' ? 'प्रत्येक प्रकाराचा सविस्तर आकडा' : 'Full number for every problem type'}</p>
              </div>
            </div>
            <div className="rep-table-wrap">
              <table className="rep-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>{t.problem}</th>
                    <th>{t.total}</th>
                    <th>{t.solved}</th>
                    <th>{t.pending}</th>
                    <th>{t.rateCol}</th>
                  </tr>
                </thead>
                <tbody>
                  {a.ranked.map((c, i) => (
                    <tr key={c.id}>
                      <td>{i + 1}</td>
                      <td>
                        <span className="an-td-cat"><Icon name={c.icon} size={15} /> {titleOf(c)}</span>
                      </td>
                      <td>{c.total}</td>
                      <td style={{ color: CHART_COLORS.solved, fontWeight: 700 }}>{c.solved}</td>
                      <td style={{ color: CHART_COLORS.pending, fontWeight: 700 }}>{c.pending}</td>
                      <td>
                        <span className="an-rate-cell">
                          <span className="an-rate-track"><span style={{ width: c.rate + '%' }} /></span>
                          <b>{c.rate}%</b>
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}

      <section className="rep-end">
        <Icon name="check" size={18} />
        <span>
          {lang === 'mr'
            ? 'संपूर्ण आकडेवारी अहवाल — प्रिंट करून PDF म्हणून जतन करा किंवा एक्सेल शीट डाउनलोड करा.'
            : 'End of the graphical report — print it to save as PDF, or download the Excel workbook.'}
          {' '}{t.printHint}
        </span>
      </section>
      {toast}
    </div>
  )
}
