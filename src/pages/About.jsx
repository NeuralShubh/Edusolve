import { useLang } from '../context/LanguageContext'
import { STRINGS } from '../i18n/translations'
import { Icon } from '../components/icons'

export default function About() {
  const { lang } = useLang()
  const t = STRINGS[lang]
  return (
    <div>
      <h2 className="with-icon" style={{ margin: '4px 0' }}><Icon name="gradcap" size={26} /> {t.about_title}</h2>
      <p className="muted">{t.footer_tag}</p>
      <div className="grid cols2" style={{ marginTop: 16 }}>
        <div className="card">
          <h3 className="with-icon"><Icon name="target" size={19} /> {lang === 'mr' ? 'EduSolve AI काय करते' : 'What EduSolve AI does'}</h3>
          <p className="muted">{t.hero_desc}</p>
          <ul className="muted small" style={{ lineHeight: 1.8 }}>
            <li>{lang === 'mr' ? 'संपूर्ण तुमच्या ब्राउझरमध्ये चालते. खाते, डेटाबेस किंवा लॉगिन नाही.' : 'Runs fully in your browser. No account, database or login.'}</li>
            <li>{lang === 'mr' ? 'नियम-आधारित मार्गदर्शन इंजिन + पाठपुरावे प्रश्न.' : 'Rule-based guidance engine + follow-up questions.'}</li>
            <li>{lang === 'mr' ? 'खरे ब्राउझर फाइल तपासणे + इमेज रिसायझिंग.' : 'Real in-browser file checks + image resizing.'}</li>
            <li>{lang === 'mr' ? 'मार्गदर्शन शिक्षणासाठी सिम्युलेटेड आहे.' : 'Guidance is simulated for learning.'}</li>
          </ul>
        </div>
        <div className="card">
          <h3 className="with-icon"><Icon name="help" size={19} /> {t.footer_help}</h3>
          <p className="muted small">{t.footer_help_text}</p>
          <h3 className="with-icon"><Icon name="shield" size={19} /> {t.footer_privacy}</h3>
          <p className="muted small">{t.footer_privacy_text}</p>
          <h3 className="with-icon"><Icon name="cpu" size={19} /> {lang === 'mr' ? 'तंत्रज्ञान' : 'Tech used'}</h3>
          <p className="muted small">React 18 + Vite 5 + React Router 6 • CSS only (no UI framework) • localStorage for preferences • Canvas API for resizing • GitHub Pages ready.</p>
        </div>
      </div>
      <div className="card" style={{ marginTop: 16 }}>
        <h3 className="with-icon" style={{ marginTop: 0 }}><Icon name="shield" size={19} /> {lang === 'mr' ? 'विद्यार्थ्यांसाठी सुरक्षित सूचना' : 'Safety note for students'}</h3>
        <p className="muted small">
          {lang === 'mr'
            ? 'EduSolve AI तिसऱ्या पक्षाच्या वेबसाइट दुरुस्त करत नाही आणि पेमेंट स्थितीची पुष्टी करत नाही. अधिकृत पोर्टलच वापरा, अनोळखी लिंक/एजंट टाळा आणि पासवर्ड, OTP, CVV किंवा बँक PIN कोणालाही देऊ नका.'
            : 'EduSolve AI does not repair third-party websites or confirm external payment status. Use only official portals, avoid unknown links/agents, and never share passwords, OTPs, CVV or bank PINs with anyone.'}
        </p>
      </div>
    </div>
  )
}
