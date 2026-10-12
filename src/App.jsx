import { HashRouter, Routes, Route } from 'react-router-dom'
import { LanguageProvider } from './context/LanguageContext'
import { Layout } from './components/ui'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import Solver from './pages/Solver'
import Tools from './pages/Tools'
import About from './pages/About'

export default function App() {
  return (
    <LanguageProvider>
      <HashRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/solver" element={<Solver />} />
            <Route path="/tools" element={<Tools />} />
            <Route path="/about" element={<About />} />
            <Route path="*" element={<Home />} />
          </Routes>
        </Layout>
      </HashRouter>
    </LanguageProvider>
  )
}
