import { useEffect, useMemo, useRef, useState } from 'react'
import { Icon } from './icons'

export function SearchSelect({ label, value, onChange, options, placeholder = 'Search...' }) {
  const [open, setOpen] = useState(false)
  const [q, setQ] = useState('')
  const [hi, setHi] = useState(0)
  const box = useRef(null)
  const inp = useRef(null)

  const list = useMemo(() => {
    const s = q.trim().toLowerCase()
    if (!s) return options
    return options.filter((o) => (o.search || o.label).toLowerCase().includes(s))
  }, [q, options])

  const cur = options.find((o) => o.value === value)

  useEffect(() => {
    if (open) { setQ(''); setHi(0); setTimeout(() => inp.current?.focus(), 30) }
  }, [open])

  useEffect(() => {
    if (!open) return
    const onDoc = (e) => { if (box.current && !box.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', onDoc)
    document.addEventListener('touchstart', onDoc, { passive: true })
    return () => { document.removeEventListener('mousedown', onDoc); document.removeEventListener('touchstart', onDoc) }
  }, [open])

  const pick = (v) => { onChange(v); setOpen(false) }
  const onKey = (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setHi((h) => Math.min(h + 1, list.length - 1)) }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setHi((h) => Math.max(h - 1, 0)) }
    else if (e.key === 'Enter') { e.preventDefault(); if (list[hi]) pick(list[hi].value) }
    else if (e.key === 'Escape') setOpen(false)
  }

  return (
    <div className="ss" ref={box}>
      {label && <span className="ss-label">{label}</span>}
      <button type="button" className={'ss-field' + (open ? ' open' : '')} onClick={() => setOpen(!open)} aria-haspopup="listbox" aria-expanded={open}>
        <span className="ss-value">{cur ? <span className="with-icon"><Icon name={cur.icon || 'check'} size={14} /> {cur.label}</span> : placeholder}</span>
        <Icon name="chevron" size={16} />
      </button>
      {open && (
        <div className="ss-pop" role="listbox">
          <div className="ss-search">
            <Icon name="search" size={15} />
            <input ref={inp} value={q} onChange={(e) => { setQ(e.target.value); setHi(0) }} onKeyDown={onKey} placeholder={placeholder} />
          </div>
          <ul className="ss-list">
            {list.length === 0 && <li className="ss-empty">No match found</li>}
            {list.map((o, i) => (
              <li key={o.value} className={'ss-opt' + (i === hi ? ' hi' : '') + (o.value === value ? ' sel' : '')}
                onMouseEnter={() => setHi(i)} onMouseDown={(e) => { e.preventDefault(); pick(o.value) }}>
                <span className="with-icon">{o.icon && <Icon name={o.icon} size={15} />} {o.label}</span>
                {o.value === value && <Icon name="check" size={15} />}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export function Toast({ msg, onDone }) {
  useEffect(() => {
    const id = setTimeout(onDone, 2600)
    return () => clearTimeout(id)
  }, [msg, onDone])
  return (
    <div className="toast" role="status">
      <span className="toast-icon"><Icon name="check" size={16} /></span>
      {msg}
    </div>
  )
}

export function useToast() {
  const [msg, setMsg] = useState(null)
  const node = msg ? <Toast msg={msg} onDone={() => setMsg(null)} /> : null
  return [node, setMsg]
}
