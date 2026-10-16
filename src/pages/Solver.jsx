import { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useLang } from '../context/LanguageContext'
import { STRINGS } from '../i18n/translations'
import { SOLUTIONS } from '../data/categories'
import { startSession, buildSolution, fallbackSolution, getCategoryById } from '../engine/solverEngine'
import { SolutionCard } from '../components/ui'
import { Icon } from '../components/icons'
import { addFeedback } from '../lib/store'

function load(k, f) { try { const v = JSON.parse(localStorage.getItem(k)); return v ?? f } catch { return f } }
function store(k, v) { try { localStorage.setItem(k, JSON.stringify(v)) } catch {} }

export default function Solver() {
  const { lang } = useLang()
  const t = STRINGS[lang]
  const [params] = useSearchParams()
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState([
    { from: 'bot', text: lang === 'mr' ? 'नमस्ते! मी EduSolve डेमो सहाय्यक आहे. तुमची समस्या सोप्या शब्दांत लिहा (उदा. “माझा शिष्यवृत्ती फॉर्म सबमिट होत नाही”).' : 'Hello! I am the EduSolve demo assistant. Describe your problem simply (e.g. “My scholarship form is not submitting”).' },
  ])
  const [session, setSession] = useState(null)
  const [solution, setSolution] = useState(null)
  const [savedIds, setSavedIds] = useState(() => load('edusolve_saved', []))
  const [feedback, setFeedback] = useState('')
  const bodyRef = useRef(null)

  useEffect(() => { bodyRef.current?.scrollTo(0, 99999) }, [messages, solution])
  useEffect(() => {
    const q = params.get('q')
    if (q) handleUserText(q)
    // eslint-disable-next-line
  }, [])

  const push = (msgs) => setMessages((m) => [...m, ...msgs])

  const handleUserText = (text) => {
    const clean = (text || '').trim()
    if (!clean) return
    push([{ from: 'user', text: clean }])
    setSolution(null); setFeedback('')
    if (clean.length < 4) {
      push([{ from: 'bot', text: fallbackSolution(lang).steps[0] }])
      return
    }
    const s = startSession(clean)
    const cat = getCategoryById(s.categoryId)
    setSession(s)
    setTimeout(() => {
      const label = cat.title[lang] || cat.title.en
      if (!s.confident) {
        push([{ from: 'bot', text: lang === 'mr' ? `समजले. ही “${label}” सारखी वाटते, पण खात्रीसाठी २ प्रश्न विचारतो.` : `Got it. This looks like “${label}”, but let me confirm with 2 questions.` }])
      } else {
        push([{ from: 'bot', text: lang === 'mr' ? `ओळखले! ही “${label}” समस्या वाटते. २ सोपे प्रश्न विचारतो.` : `Identified! This looks like a “${label}” issue. Let me ask 2 quick questions.` }])
      }
      askFollowup({ ...s })
    }, 350)
  }

  const askFollowup = (s) => {
    const sol = SOLUTIONS[s.categoryId]
    const fu = sol?.followups?.[s.stepIndex]
    if (!fu) { finishSolution(s); return }
    push([{ from: 'bot', text: fu.q[lang] || fu.q.en, options: fu.options }])
  }

  const answerOption = (opt) => {
    if (!session) return
    push([{ from: 'user', text: opt }])
    const next = { ...session, answers: [...session.answers, opt], stepIndex: session.stepIndex + 1 }
    setSession(next)
    setTimeout(() => askFollowup(next), 300)
  }

  const finishSolution = (s) => {
    const sol = buildSolution(s.categoryId, lang)
    setSolution(sol)
    const recent = load('edusolve_recent', [])
    store('edusolve_recent', [{ id: s.categoryId, at: Date.now() }, ...recent.filter((r) => r.id !== s.categoryId)].slice(0, 6))
    push([{ from: 'bot', text: lang === 'mr' ? 'तुमचा टप्प्याटप्प्याने उपाय तयार आहे. खाली पाहा आणि Solved / Not Solved दाबा.' : 'Your step-by-step solution is ready below. Please mark Solved / Not Solved afterwards.' }])
    setSession(null)
  }

  const send = () => { handleUserText(input); setInput('') }
  const isSaved = solution && savedIds.includes(solution.categoryId)
  const toggleSave = () => {
    if (!solution) return
    const next = isSaved ? savedIds.filter((s) => s !== solution.categoryId) : [...savedIds, solution.categoryId]
    setSavedIds(next); store('edusolve_saved', next)
  }

  return (
    <div>
      <h2 className="with-icon" style={{ margin: '4px 0' }}><Icon name="bot" size={26} /> {t.solver_title}</h2>
      <p className="muted">{t.solver_sub}</p>
      <div className="solver-layout">
        <div className="card">
          <h3 className="with-icon" style={{ marginTop: 0 }}><Icon name="sparkles" size={18} /> {lang === 'mr' ? 'उदाहरणे वापरून पहा' : 'Try an example'}</h3>
          {['My scholarship form is not submitting.', 'OTP is not coming on my mobile.', 'Payment deducted but no receipt.', 'Photo upload rejected, file too large.', 'Page refresh erased my form data.'].map((ex) => (
            <div key={ex} style={{ marginBottom: 8 }}><button className="pill" onClick={() => handleUserText(ex)}>{ex}</button></div>
          ))}
          <hr style={{ border: 0, borderTop: '1px solid var(--line)', margin: '14px 0' }} />
          <p className="muted small with-icon"><Icon name="alert" size={14} /> {t.demo_note}</p>
          <p className="muted small with-icon"><Icon name="shield" size={14} /> {lang === 'mr' ? 'पासवर्ड, OTP किंवा बँक तपशील कधीही टाकू नका.' : 'Never type passwords, OTPs or bank details here.'}</p>
          <button className="btn small" onClick={() => { setMessages(messages.slice(0, 1)); setSolution(null); setSession(null); setFeedback('') }}><Icon name="trash" size={14} /> {t.clear}</button>
        </div>
        <div>
          <div className="chat">
            <div className="chat-head"><span className="avatar"><Icon name="bot" size={20} /></span><div><b>EduSolve</b><br /><span className="muted small">demo assistant • frontend only</span></div></div>
            <div className="chat-body" ref={bodyRef}>
              {messages.map((m, i) => (
                <div key={i} style={{ display: 'contents' }}>
                  <div className={'msg ' + m.from}>{m.text}</div>
                  {m.options && (
                    <div className="opt-row">
                      {m.options.map((o) => <button key={o} className="opt" onClick={() => answerOption(o)}>{o}</button>)}
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="chat-input">
              <input value={input} onChange={(e) => setInput(e.target.value)} placeholder={t.solver_ph}
                onKeyDown={(e) => e.key === 'Enter' && send()} />
              <button className="btn primary" onClick={send}><Icon name="send" size={16} /> {t.send}</button>
            </div>
          </div>
          {solution && (
            <SolutionCard solution={solution} saved={isSaved} onSave={toggleSave}
              onSolved={() => { addFeedback({ title: solution.title, verdict: 'solved', source: 'solver' }); setFeedback(lang === 'mr' ? 'छान! तुमचा अभिप्राय जतन केला. आणखी मदत हवी असल्यास स्मार्ट साधने वापरा.' : 'Great! Feedback noted. For extra help, try the Smart Tools.') }}
              onUnsolved={() => { addFeedback({ title: solution.title, verdict: 'unsolved', source: 'solver' }); setFeedback(lang === 'mr' ? 'समजले. जवळचा दुसरा प्रकार डॅशबोर्डमध्ये उघडा किंवा कॉलेज हेल्पडेस्कशी स्क्रीनशॉटसह संपर्क साधा. पैसे कपात झाल्यास UTR जतन करा.' : 'Understood. Open a nearby category in the Dashboard or contact the college helpdesk with screenshots. If money was deducted, keep the UTR.') }} />
          )}
          {feedback && <div className="result ok">{feedback}</div>}
        </div>
      </div>
    </div>
  )
}
