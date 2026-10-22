import { useEffect, useState } from 'react'
import { Icon } from './icons'

export function TabSwitcher({ label, value, onChange, options, className = '' }) {
  return (
    <div className={'tab-switch ' + className}>
      {label && <span className="ss-label">{label}</span>}
      <div className="tabs" role="tablist">
        {options.map((o) => (
          <button
            key={o.value}
            type="button"
            role="tab"
            aria-selected={value === o.value}
            className={'tab-btn' + (value === o.value ? ' on' : '')}
            onClick={() => onChange(o.value)}
          >
            {o.icon && <Icon name={o.icon} size={15} />}
            <span>{o.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

export function Segmented({ label, value, onChange, options }) {
  return (
    <div className="seg-switch">
      {label && <span className="ss-label">{label}</span>}
      <div className="seg-ctl" role="group">
        {options.map((o) => (
          <button
            key={o.value}
            type="button"
            className={value === o.value ? 'on' : ''}
            aria-pressed={value === o.value}
            onClick={() => onChange(o.value)}
          >
            {o.icon && <Icon name={o.icon} size={14} />}
            <span>{o.label}</span>
          </button>
        ))}
      </div>
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
