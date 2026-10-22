// Lightweight SVG chart primitives for the Project Report.
// No chart library, no dependencies — everything is drawn by hand so the app
// stays fully offline and frontend-only.

import { useEffect, useId, useRef, useState } from 'react'

/* ------------------------------------------------------------------ */
/* Width measuring hook — charts re-render on container resize         */
/* ------------------------------------------------------------------ */
export function useWidth(fallback = 320) {
  const ref = useRef(null)
  const [w, setW] = useState(fallback)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const update = () => {
      const cw = el.getBoundingClientRect().width
      if (cw > 0) setW(cw)
    }
    update()
    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', update)
      return () => window.removeEventListener('resize', update)
    }
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])
  return [ref, w]
}

function niceCeil(v) {
  if (v <= 0) return 1
  const mag = Math.pow(10, Math.floor(Math.log10(v)))
  const n = v / mag
  const step = n <= 1 ? 1 : n <= 2 ? 2 : n <= 2.5 ? 2.5 : n <= 5 ? 5 : 10
  return step * mag
}

function roundedTopPath(x, y, w, h, r) {
  const rr = Math.max(0, Math.min(r, w / 2, h))
  return `M${x},${y + h} L${x},${y + rr} Q${x},${y} ${x + rr},${y} L${x + w - rr},${y} Q${x + w},${y} ${x + w},${y + rr} L${x + w},${y + h} Z`
}

/** Index set for x-axis labels — keeps the last tick and avoids overlap. */
function labelIndexes(count, step) {
  const set = new Set()
  for (let i = 0; i < count; i += step) set.add(i)
  set.add(count - 1)
  const arr = [...set].sort((a, b) => a - b)
  if (arr.length > 1 && arr[arr.length - 1] - arr[arr.length - 2] < step * 0.65) {
    set.delete(arr[arr.length - 2])
  }
  return set
}

/* ------------------------------------------------------------------ */
/* Donut chart — solved vs pending                                      */
/* ------------------------------------------------------------------ */
export function DonutChart({ segments, size = 190, thickness = 20, gap = 3, center }) {
  const total = segments.reduce((s, x) => s + (x.value || 0), 0)
  const r = (size - thickness) / 2
  const circ = 2 * Math.PI * r
  let acc = 0

  return (
    <svg className="ch-donut" width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label="Donut chart">
      <g transform={`rotate(-90 ${size / 2} ${size / 2})`}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--line)" strokeWidth={thickness} />
        {segments.map((s) => {
          if (!s.value) return null
          const frac = s.value / (total || 1)
          const len = Math.max(0.5, frac * circ - gap)
          const el = (
            <circle
              key={s.key}
              cx={size / 2} cy={size / 2} r={r}
              fill="none" stroke={s.color} strokeWidth={thickness}
              strokeDasharray={`${len} ${circ - len}`}
              strokeDashoffset={-acc * circ}
              strokeLinecap="round"
              className="ch-arc"
            >
              <title>{`${s.label}: ${s.value} (${Math.round(frac * 100)}%)`}</title>
            </circle>
          )
          acc += frac
          return el
        })}
      </g>
      {center}
    </svg>
  )
}

/* ------------------------------------------------------------------ */
/* Stacked column chart — problems per day                              */
/* ------------------------------------------------------------------ */
export function ColumnChart({ data, height = 230, series = [], valueOnTop = true }) {
  const [ref, w] = useWidth(340)
  const padL = 36
  const padR = 8
  const padT = 18
  const padB = 26
  const innerW = Math.max(40, w - padL - padR)
  const innerH = Math.max(60, height - padT - padB)
  const max = niceCeil(Math.max(1, ...data.map((d) => d.total || 0)))
  const band = innerW / Math.max(1, data.length)
  const barW = Math.min(band * 0.66, 30)
  const maxLabels = Math.max(3, Math.floor(innerW / 46))
  const step = Math.max(1, Math.ceil(data.length / maxLabels))
  const shown = labelIndexes(data.length, step)
  const ticks = [0, 0.25, 0.5, 0.75, 1]

  return (
    <div className="ch-wrap" ref={ref}>
      <svg className="ch-svg" width={w} height={height} viewBox={`0 0 ${w} ${height}`} role="img" aria-label="Column chart">
        {ticks.map((t) => {
          const y = padT + innerH - innerH * t
          return (
            <g key={t}>
              <line x1={padL} x2={w - padR} y1={y} y2={y} className="ch-grid" />
              <text x={padL - 8} y={y + 3.5} className="ch-axis-label" textAnchor="end">
                {Math.round(max * t)}
              </text>
            </g>
          )
        })}

        {data.map((d, i) => {
          const x = padL + band * i + (band - barW) / 2
          let cursor = padT + innerH
          const parts = (d.parts || []).filter((p) => p.value > 0)
          return (
            <g key={d.key || i}>
              {parts.map((p, pi) => {
                const h = (p.value / max) * innerH
                cursor -= h
                const isTop = pi === parts.length - 1
                const path = isTop
                  ? roundedTopPath(x, cursor, barW, Math.max(1, h), 4)
                  : `M${x},${cursor} h${barW} v${Math.max(1, h)} h${-barW} Z`
                return (
                  <path key={p.key || pi} d={path} fill={p.color} className="ch-bar">
                    <title>{`${d.label} · ${p.name}: ${p.value}`}</title>
                  </path>
                )
              })}
              {valueOnTop && d.total > 0 && (
                <text x={x + barW / 2} y={cursor - 6} className="ch-value" textAnchor="middle">{d.total}</text>
              )}
              {shown.has(i) && (
                <text x={x + barW / 2} y={height - 8} className="ch-axis-label" textAnchor="middle">{d.label}</text>
              )}
            </g>
          )
        })}
      </svg>
      {series.length > 0 && (
        <div className="ch-legend">
          {series.map((s) => (
            <span key={s.key} className="ch-legend-item">
              <i style={{ background: s.color }} /> {s.label} <b>{s.value}</b>
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Area + line chart — cumulative trend                                 */
/* ------------------------------------------------------------------ */
export function AreaChart({ data, height = 230, color = '#6d28d9', valueKey = 'value', labelKey = 'label' }) {
  const [ref, w] = useWidth(340)
  const gid = 'grad' + useId().replace(/:/g, '')
  const padL = 40
  const padR = 10
  const padT = 16
  const padB = 26
  const innerW = Math.max(40, w - padL - padR)
  const innerH = Math.max(60, height - padT - padB)
  const max = niceCeil(Math.max(1, ...data.map((d) => d[valueKey] || 0)))
  const stepX = data.length > 1 ? innerW / (data.length - 1) : innerW
  const pt = (d, i) => {
    const x = padL + (data.length > 1 ? stepX * i : innerW / 2)
    const y = padT + innerH - (d[valueKey] || 0) / max * innerH
    return [x, y]
  }
  const pts = data.map(pt)
  const line = pts.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`).join(' ')
  const area = `${line} L${(padL + innerW).toFixed(1)},${padT + innerH} L${padL.toFixed(1)},${padT + innerH} Z`
  const maxLabels = Math.max(3, Math.floor(innerW / 52))
  const lstep = Math.max(1, Math.ceil(data.length / maxLabels))
  const shown = labelIndexes(data.length, lstep)

  return (
    <div className="ch-wrap" ref={ref}>
      <svg className="ch-svg" width={w} height={height} viewBox={`0 0 ${w} ${height}`} role="img" aria-label="Area chart">
        <defs>
          <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.32" />
            <stop offset="100%" stopColor={color} stopOpacity="0.02" />
          </linearGradient>
        </defs>
        {[0, 0.25, 0.5, 0.75, 1].map((t) => {
          const y = padT + innerH - innerH * t
          return (
            <g key={t}>
              <line x1={padL} x2={w - padR} y1={y} y2={y} className="ch-grid" />
              <text x={padL - 8} y={y + 3.5} className="ch-axis-label" textAnchor="end">{Math.round(max * t)}</text>
            </g>
          )
        })}
        <path d={area} fill={`url(#${gid})`} />
        <path d={line} fill="none" stroke={color} strokeWidth="2.4" strokeLinejoin="round" strokeLinecap="round" />
        {pts.map(([x, y], i) => (
          <g key={i}>
            <circle cx={x} cy={y} r={3.2} fill="#fff" stroke={color} strokeWidth="2">
              <title>{`${data[i][labelKey]}: ${data[i][valueKey]}`}</title>
            </circle>
            {shown.has(i) && (
              <text x={x} y={height - 8} className="ch-axis-label" textAnchor="middle">{data[i][labelKey]}</text>
            )}
          </g>
        ))}
      </svg>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Horizontal bar list (HTML based — easier text layout)                 */
/* ------------------------------------------------------------------ */
export function BarList({ items, max, suffix = '' }) {
  const peak = max || Math.max(1, ...items.map((i) => i.value || 0))
  return (
    <div className="ch-barlist">
      {items.map((it) => (
        <div className="ch-barrow" key={it.key || it.label}>
          <div className="ch-barhead">
            <span className="ch-barlabel" title={it.fullLabel || it.label}>{it.label}</span>
            <b className="ch-barvalue">{it.value}{suffix}</b>
          </div>
          <div className="ch-track">
            {it.parts && it.parts.length > 0 ? (
              <div className="ch-split" style={{ width: `${((it.value || 0) / peak) * 100}%` }}>
                {it.parts.filter((p) => p.value > 0).map((p) => (
                  <span key={p.key} style={{ flex: p.value, background: p.color }} title={`${p.name}: ${p.value}`} />
                ))}
              </div>
            ) : (
              <div className="ch-fill" style={{ width: `${((it.value || 0) / peak) * 100}%`, background: it.color }} />
            )}
          </div>
          {it.sub && <span className="ch-barsub">{it.sub}</span>}
        </div>
      ))}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Single stacked bar (100%)                                            */
/* ------------------------------------------------------------------ */
export function SplitBar({ segments, height = 18 }) {
  const total = segments.reduce((s, x) => s + (x.value || 0), 0) || 1
  return (
    <div className="ch-splitbar" style={{ height }}>
      {segments.map((s) => (
        s.value > 0 ? (
          <span
            key={s.key}
            style={{ width: `${(s.value / total) * 100}%`, background: s.color }}
            title={`${s.label}: ${s.value}`}
          />
        ) : null
      ))}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Sparkline (KPI cards)                                                */
/* ------------------------------------------------------------------ */
export function Sparkline({ data, width = 88, height = 30, color = '#6d28d9' }) {
  const gid = 'sp' + useId().replace(/:/g, '')
  if (!data || data.length < 2) return <svg width={width} height={height} />
  const max = Math.max(1, ...data)
  const min = Math.min(0, ...data)
  const span = max - min || 1
  const stepX = width / (data.length - 1)
  const pts = data.map((v, i) => [i * stepX, height - 3 - ((v - min) / span) * (height - 6)])
  const line = pts.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`).join(' ')
  const area = `${line} L${width},${height} L0,${height} Z`
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="ch-spark" aria-hidden="true">
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.35" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${gid})`} />
      <path d={line} fill="none" stroke={color} strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round" />
      <circle cx={pts[pts.length - 1][0]} cy={pts[pts.length - 1][1]} r="2.4" fill={color} />
    </svg>
  )
}

/* ------------------------------------------------------------------ */
/* Radial gauge — solve rate (180° speedometer)                        */
/* ------------------------------------------------------------------ */
export function Gauge({ value, size = 170, thickness = 13, color = '#16a34a', label }) {
  const H = Math.round(size * 0.72)
  const r = (size - thickness) / 2
  const cx = size / 2
  const cy = H - 34
  const circ = 2 * Math.PI * r
  const arcLen = Math.PI * r
  const v = Math.max(0, Math.min(100, value || 0))
  const filled = (v / 100) * arcLen
  const polar = (deg, radius) => {
    const a = (deg * Math.PI) / 180
    return [cx + radius * Math.cos(a), cy + radius * Math.sin(a)]
  }
  const ang = 180 + (180 * v) / 100
  const [nx, ny] = polar(ang, r - thickness / 2 - 3)
  const [tx, ty] = polar(180, r - thickness / 2 - 3)

  return (
    <svg width={size} height={H} viewBox={`0 0 ${size} ${H}`} className="ch-gauge" role="img" aria-label={`${v}%`}>
      <g transform={`rotate(180 ${cx} ${cy})`}>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--line)" strokeWidth={thickness} strokeDasharray={`${arcLen} ${circ}`} />
      </g>
      <g transform={`rotate(180 ${cx} ${cy})`}>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth={thickness} strokeLinecap="round"
          strokeDasharray={`${filled} ${circ}`} className="ch-arc" />
      </g>
      <line x1={tx} y1={ty} x2={nx} y2={ny} stroke="var(--ink)" strokeWidth="2.6" strokeLinecap="round" />
      <circle cx={nx} cy={ny} r="4.6" fill="var(--ink)" />
      <text x={cx} y={cy - 4} className="ch-gauge-num" textAnchor="middle">{v}%</text>
      {label && <text x={cx} y={cy + 18} className="ch-gauge-label" textAnchor="middle">{label}</text>}
    </svg>
  )
}

/* ------------------------------------------------------------------ */
/* Legend                                                               */
/* ------------------------------------------------------------------ */
export function Legend({ items }) {
  return (
    <div className="ch-legend">
      {items.map((s) => (
        <span key={s.key} className="ch-legend-item">
          <i style={{ background: s.color }} /> {s.label} <b>{s.value}</b>
        </span>
      ))}
    </div>
  )
}
