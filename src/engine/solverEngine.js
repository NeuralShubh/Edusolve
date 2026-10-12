// Demo solution engine: rule-based, frontend only. No real AI.
import { SOLUTIONS, detectCategory, CATEGORIES } from '../data/categories'

export function getCategoryById(id) {
  return CATEGORIES.find((c) => c.id === id) || CATEGORIES.find((c) => c.id === 'other')
}

export function startSession(userText) {
  const { id, confident } = detectCategory(userText)
  const sol = SOLUTIONS[id]
  return {
    categoryId: id,
    confident,
    stepIndex: 0,
    answers: [],
    followups: sol.followups || [],
  }
}

export function buildSolution(categoryId, lang = 'en') {
  const cat = getCategoryById(categoryId)
  const sol = SOLUTIONS[categoryId] || SOLUTIONS.other
  const pick = (obj) => obj[lang] || obj.en
  return {
    categoryId,
    title: cat.title[lang] || cat.title.en,
    icon: cat.icon,
    causes: pick(sol.causes),
    steps: pick(sol.steps),
    prevention: pick(sol.prevention),
    alternative: pick(sol.alternative),
  }
}

export function fallbackSolution(lang = 'en') {
  if (lang === 'mr') {
    return {
      categoryId: 'other',
      title: 'इतर शैक्षणिक सेवा समस्या',
      icon: '💡',
      causes: ['समस्या स्पष्ट नाही — अधिक माहिती हवी', 'पोर्टल-विशिष्ट सूचना वाचली नाही'],
      steps: ['तुमची अडचण एका वाक्यात पुन्हा लिहा (कोणता फॉर्म + काय होते).', 'स्क्रीनशॉट घ्या आणि त्रुटी संदेश जसाच्या तसा लिहा.', 'डॅशबोर्डवरील १२ प्रकारांपैकी जवळचा प्रकार उघडा.', 'कॉलेज कार्यालय/CSC मध्ये आधार + अर्ज ID सह जा.', 'पासवर्ड, OTP किंवा बँक PIN कोणालाही देऊ नका.'],
      prevention: ['अधिकृत सूचना PDF आधी वाचा.', 'प्रत्येक टप्प्याचा स्क्रीनशॉट ठेवा.'],
      alternative: 'शिक्षक किंवा CSC ऑपरेटरसोबत १५ मिनिटे फॉर्म भरा.',
    }
  }
  return {
    categoryId: 'other',
    title: 'Other Educational Service Problems',
    icon: '💡',
    causes: ['Problem is unclear — needs one more detail', 'Portal-specific instruction not read yet'],
    steps: ['Rewrite your issue in one line (which form + what happens).', 'Take a screenshot and copy the exact error message.', 'Open the closest of the 12 categories in the Dashboard.', 'Visit college office/CSC with Aadhaar + application ID.', 'Never share passwords, OTPs or bank PINs with anyone.'],
    prevention: ['Read the official instruction PDF first.', 'Keep a screenshot of every step.'],
    alternative: 'Fill the form for 15 minutes with a teacher or CSC operator.',
  }
}
