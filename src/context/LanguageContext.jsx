import React, { createContext, useContext, useEffect, useState } from 'react'

const LanguageContext = createContext({ lang: 'en', setLang: () => {}, toggle: () => {} })

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => {
    try { return localStorage.getItem('edusolve_lang') || 'en' } catch { return 'en' }
  })
  useEffect(() => {
    try { localStorage.setItem('edusolve_lang', lang) } catch {}
    document.documentElement.lang = lang === 'mr' ? 'mr' : 'en'
  }, [lang])
  const toggle = () => setLang((l) => (l === 'en' ? 'mr' : 'en'))
  return <LanguageContext.Provider value={{ lang, setLang, toggle }}>{children}</LanguageContext.Provider>
}

export function useLang() {
  return useContext(LanguageContext)
}
