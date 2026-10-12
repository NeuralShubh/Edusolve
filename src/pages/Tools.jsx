import { useState } from 'react'
import { useLang } from '../context/LanguageContext'
import { STRINGS } from '../i18n/translations'

const TOOLS = [
  { id: 'docprep', en: '📋 Document preparation checklist', mr: '📋 कागदपत्र तयारी यादी' },
  { id: 'filecheck', en: '📦 File extension & size checker', mr: '📦 फाइल प्रकार व आकार तपासणी' },
  { id: 'photo', en: '🖼️ Photo & signature guidance + resizer', mr: '🖼️ फोटो व सही मार्गदर्शन + रिसायझर' },
  { id: 'formfill', en: '📝 Form-filling checklist', mr: '📝 फॉर्म भरणे यादी' },
  { id: 'presubmit', en: '✅ Pre-submission verification', mr: '✅ सबमिशनपूर्व पडताळणी' },
  { id: 'required', en: '📁 Required-document checklist', mr: '📁 आवश्यक कागदपत्र यादी' },
]

const LISTS = {
  docprep: [
    { en: 'Aadhaar card scan (PDF/JPG, under limit)', mr: 'आधार कार्ड स्कॅन (PDF/JPG, मर्यादेखाली)' },
    { en: 'Marksheet / LC scan is clear and straight', mr: 'मार्कशीट / LC स्कॅन स्पष्ट आणि सरळ' },
    { en: 'Caste / income / domicile certificates valid', mr: 'जात / उत्पन्न / अधिवास दाखले वैध' },
    { en: 'Files renamed simply: income.pdf, caste.jpg', mr: 'फाइल नावे सोपी: income.pdf, caste.jpg' },
    { en: 'One backup folder on phone + PC', mr: 'फोन + PC मध्ये एक बॅकअप फोल्डर' },
  ],
  formfill: [
    { en: 'Read instruction PDF fully once', mr: 'सूचना PDF एकदा पूर्ण वाचा' },
    { en: 'Name/DOB copied letter-by-letter from Aadhaar', mr: 'नाव/जन्मतारीख आधारवरून अक्षरशः कॉपी' },
    { en: 'All mandatory (*) fields filled', mr: 'सर्व आवश्यक (*) फील्ड भरले' },
    { en: 'Mobile + email entered correctly, OTP tested', mr: 'मोबाईल + ईमेल बरोबर, OTP तपासला' },
    { en: 'Save Draft after every page', mr: 'प्रत्येक पानानंतर Save Draft' },
  ],
  presubmit: [
    { en: 'Preview page scrolled fully, no red errors', mr: 'Preview पूर्ण स्क्रोल, लाल त्रुटी नाहीत' },
    { en: 'Photo/signature preview opens clearly', mr: 'फोटो/सही preview स्पष्ट उघडते' },
    { en: 'Declaration checkbox ticked', mr: 'घोषणा चेकबॉक्स टिक केला' },
    { en: 'Payment receipt / UTR saved (if paid)', mr: 'पेमेंट पावती / UTR जतन (भरले असल्यास)' },
    { en: 'Acknowledgement will be downloaded after submit', mr: 'सबमिटनंतर पोच डाउनलोड करणार' },
  ],
}

const REQUIRED_DOCS = {
  Scholarship: ['Aadhaar card', 'Previous marksheet', 'Income certificate', 'Caste certificate (if applicable)', 'Domicile certificate', 'Bank passbook first page', 'Passport photo + signature', 'Admission receipt'],
  Admission: ['10th + 12th marksheets', 'Leaving certificate (LC)', 'Aadhaar card', 'Passport photo + signature', 'Caste/income docs (if quota/scholarship)', 'Migration certificate (if other board)'],
  Exam: ['College ID / PRN number', 'Previous hall ticket', 'Fees receipt', 'Passport photo', 'Aadhaar (if asked)'],
}

function Checklist({ id, lang }) {
  const [done, setDone] = useState(() => {
    try { return JSON.parse(localStorage.getItem('tool_' + id)) || [] } catch { return [] }
  })
  const items = LISTS[id] || []
  const toggle = (i) => {
    const next = done.includes(i) ? done.filter((x) => x !== i) : [...done, i]
    setDone(next)
    try { localStorage.setItem('tool_' + id, JSON.stringify(next)) } catch {}
  }
  const pct = items.length ? Math.round((done.length / items.length) * 100) : 0
  return (
    <div>
      <div className="progress"><div style={{ width: pct + '%' }} /></div>
      <p className="muted small">{done.length}/{items.length} done — {pct}%</p>
      {items.map((it, i) => (
        <label key={i} className="check"><input type="checkbox" checked={done.includes(i)} onChange={() => toggle(i)} /> {it[lang] || it.en}</label>
      ))}
    </div>
  )
}

function FileChecker({ lang }) {
  const [file, setFile] = useState(null)
  const [preset, setPreset] = useState('pdf200')
  const presets = {
    pdf200: { label: 'PDF ≤ 200 KB (scholarship docs)', exts: ['pdf'], maxKB: 200 },
    img50: { label: 'Photo JPG ≤ 50 KB', exts: ['jpg', 'jpeg'], maxKB: 50 },
    sign30: { label: 'Signature JPG ≤ 30 KB', exts: ['jpg', 'jpeg'], maxKB: 30 },
    img200: { label: 'Image ≤ 200 KB (JPG/PNG)', exts: ['jpg', 'jpeg', 'png'], maxKB: 200 },
  }
  const p = presets[preset]
  let verdict = null
  if (file) {
    const ext = (file.name.split('.').pop() || '').toLowerCase()
    const kb = file.size / 1024
    const okExt = p.exts.includes(ext)
    const okSize = kb <= p.maxKB
    verdict = { ext, kb, okExt, okSize, ok: okExt && okSize }
  }
  return (
    <div>
      <div className="row">
        <div><label>Preset</label><br /><select value={preset} onChange={(e) => setPreset(e.target.value)}>{Object.entries(presets).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}</select></div>
        <div><label>{lang === 'mr' ? 'फाइल निवडा (अपलोड होत नाही)' : 'Choose a file (never uploaded)'}</label><br /><input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} /></div>
      </div>
      {!file && <p className="muted small" style={{ marginTop: 12 }}>Select a file on your device. It is checked locally in your browser only.</p>}
      {verdict && (
        <div className={'result ' + (verdict.ok ? 'ok' : 'bad')}>
          <b>{file.name}</b> — {(verdict.kb).toFixed(1)} KB, .{verdict.ext}<br />
          {verdict.okExt ? '✅ Format OK' : `❌ Format must be: ${p.exts.join('/').toUpperCase()}`} • {verdict.okSize ? '✅ Size OK' : `❌ Must be ≤ ${p.maxKB} KB`}<br />
          {verdict.ok ? (lang === 'mr' ? '🎉 ही फाइल अपलोडसाठी तयार आहे.' : '🎉 This file is ready to upload.') :
            (lang === 'mr' ? '💡 टीप: 150 DPI ब्लॅक-व्हाइट पुन्हा स्कॅन करा किंवा Photo resizer वापरा.' : '💡 Tip: re-scan at 150 DPI black-white, or use the Photo resizer below.')}
        </div>
      )}
    </div>
  )
}

function PhotoResizer({ lang }) {
  const [src, setSrc] = useState(null)
  const [out, setOut] = useState(null)
  const [w, setW] = useState(200)
  const [h, setH] = useState(230)
  const [quality, setQuality] = useState(0.8)

  const onFile = (f) => {
    if (!f) return
    const url = URL.createObjectURL(f)
    setSrc(url); setOut(null)
  }
  const resize = () => {
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = w; canvas.height = h
      const ctx = canvas.getContext('2d')
      ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, w, h)
      // contain-fit draw
      const scale = Math.min(w / img.width, h / img.height)
      const dw = img.width * scale, dh = img.height * scale
      ctx.drawImage(img, (w - dw) / 2, (h - dh) / 2, dw, dh)
      const url = canvas.toDataURL('image/jpeg', quality)
      // real byte size of output
      const bytes = Math.round((url.length * 3) / 4)
      setOut({ url, kb: bytes / 1024 })
    }
    img.src = src
  }
  return (
    <div>
      <p className="muted small">{lang === 'mr' ? 'फोटो: पांढरी पार्श्वभूमी, दिवसाचा प्रकाश. सही: कोऱ्या कागदावर काळा पेन. फाइल निवडा, आकार ठरवा, Resize दाबा, नंतर डाउनलोड करा — सर्व काही तुमच्या ब्राउझरमध्येच होते.' : 'Photo: white background, daylight. Signature: black pen on plain paper. Choose file, set size, press Resize, then Download — everything happens in your browser.'}</p>
      <div className="row">
        <input type="file" accept="image/*" onChange={(e) => onFile(e.target.files?.[0])} />
        <div><label>Width px</label><br /><input type="number" value={w} onChange={(e) => setW(+e.target.value || 200)} style={{ width: 90 }} /></div>
        <div><label>Height px</label><br /><input type="number" value={h} onChange={(e) => setH(+e.target.value || 230)} style={{ width: 90 }} /></div>
        <div><label>Quality</label><br /><select value={quality} onChange={(e) => setQuality(+e.target.value)}><option value={0.6}>0.6 (smaller)</option><option value={0.8}>0.8</option><option value={0.92}>0.92 (clearer)</option></select></div>
        <button className="btn primary small" disabled={!src} onClick={resize}>✂️ Resize</button>
      </div>
      {src && <div><p className="muted small">Original:</p><img className="preview-img" src={src} alt="original" /></div>}
      {out && (
        <div className="result ok">
          ✅ Resized to {w}×{h}px — ~{out.kb.toFixed(1)} KB (real output, measured locally).<br />
          <img className="preview-img" src={out.url} alt="resized" /><br /><br />
          <a className="btn primary small" href={out.url} download={`edusolve-${w}x${h}.jpg`}>⬇️ Download resized JPG</a>
        </div>
      )}
    </div>
  )
}

function RequiredDocs() {
  const [service, setService] = useState('Scholarship')
  const [done, setDone] = useState([])
  const items = REQUIRED_DOCS[service]
  return (
    <div>
      <div className="row">{Object.keys(REQUIRED_DOCS).map((s) => <button key={s} className={'pill'} onClick={() => { setService(s); setDone([]) }} style={service === s ? { background: '#2563eb', color: '#fff' } : {}}>{s}</button>)}</div>
      <p className="muted small">{done.length}/{items.length} ready</p>
      {items.map((d, i) => (
        <label key={d} className="check"><input type="checkbox" checked={done.includes(i)} onChange={() => setDone(done.includes(i) ? done.filter((x) => x !== i) : [...done, i])} /> {d}</label>
      ))}
    </div>
  )
}

export default function Tools() {
  const { lang } = useLang()
  const t = STRINGS[lang]
  const [active, setActive] = useState('docprep')
  return (
    <div>
      <h2 style={{ margin: '4px 0' }}>🧰 {t.tools_title}</h2>
      <p className="muted">{t.tools_sub}</p>
      <div className="tool-nav">
        {TOOLS.map((tool) => <button key={tool.id} className={active === tool.id ? 'active' : ''} onClick={() => setActive(tool.id)}>{tool[lang] || tool.en}</button>)}
      </div>
      <div className="card">
        <h3 style={{ marginTop: 0 }}>{TOOLS.find((x) => x.id === active)?.[lang]}</h3>
        {active === 'docprep' && <Checklist id="docprep" lang={lang} />}
        {active === 'filecheck' && <FileChecker lang={lang} />}
        {active === 'photo' && <PhotoResizer lang={lang} />}
        {active === 'formfill' && <Checklist id="formfill" lang={lang} />}
        {active === 'presubmit' && <Checklist id="presubmit" lang={lang} />}
        {active === 'required' && <RequiredDocs />}
      </div>
    </div>
  )
}
