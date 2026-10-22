// 12 required problem categories + demo solutions (EN + MR, simple language).
export const CATEGORIES = [
  {
    id: 'internet', icon: 'globe',
    short: { en: 'Internet', mr: 'इंटरनेट' },
    title: { en: 'Internet Connectivity Problems', mr: 'इंटरनेट कनेक्टिव्हिटी समस्या' },
    desc: { en: 'Pages time out, Wi-Fi drops, mobile data is slow during forms.', mr: 'पेजेस उघडत नाहीत, वाय-फाय तुटते, फॉर्म भरताना डेटा स्लो असतो.' },
    keywords: ['internet', 'wifi', 'wi-fi', 'network', 'data', 'slow', 'timeout', 'time out', 'offline', 'इंटरनेट', 'नेट', 'वायफाय', 'स्लो'],
  },
  {
    id: 'server', icon: 'server',
    short: { en: 'Server', mr: 'सर्व्हर' },
    title: { en: 'Website Loading and Server Errors', mr: 'वेबसाइट लोडिंग व सर्व्हर त्रुटी' },
    desc: { en: '500/404 errors, blank pages, site crashes near deadlines.', mr: '500/404 त्रुटी, कोरी पेजेस, शेवटच्या तारखेजवळ साइट बंद पडते.' },
    keywords: ['server', '500', '404', 'loading', 'load', 'crash', 'down', 'blank', 'error', 'deadline', 'सर्व्हर', 'लोड', 'त्रुटी', 'साइट'],
  },
  {
    id: 'otp', icon: 'lock',
    short: { en: 'Login & OTP', mr: 'लॉगिन व OTP' },
    title: { en: 'Login and OTP Problems', mr: 'लॉगिन व OTP समस्या' },
    desc: { en: 'OTP not received, expired, wrong mobile number linked.', mr: 'OTP येत नाही, कालबाह्य होतो, चुकीचा मोबाईल नंबर लिंक असतो.' },
    keywords: ['otp', 'login', 'log in', 'sign in', 'mobile', 'number', 'verify', 'verification', 'resend', 'लॉगिन', 'ओटीपी', 'मोबाईल', 'पडताळणी'],
  },
  {
    id: 'password', icon: 'key',
    short: { en: 'Password', mr: 'पासवर्ड' },
    title: { en: 'Forgotten Password', mr: 'पासवर्ड विसरणे' },
    desc: { en: 'Forgot password, reset link not working, account locked.', mr: 'पासवर्ड विसरलात, रीसेट लिंक चालत नाही, खाते लॉक झाले.' },
    keywords: ['password', 'forgot', 'reset', 'locked', 'remember', 'पासवर्ड', 'विसर'],
  },
  {
    id: 'form-entry', icon: 'edit',
    short: { en: 'Form Entry', mr: 'फॉर्म भरणे' },
    title: { en: 'Form Instructions and Information Entry', mr: 'फॉर्म सूचना व माहिती भरणे' },
    desc: { en: 'Confusing instructions, name/date mismatches, field errors.', mr: 'गोंधळलेल्या सूचना, नाव/तारीख चुका, फील्ड त्रुटी.' },
    keywords: ['instruction', 'entry', 'field', 'name', 'dob', 'date of birth', 'mismatch', 'spell', 'column', 'form fill', 'माहिती', 'नाव', 'सूचना', 'फॉर्म'],
  },
  {
    id: 'doc-upload', icon: 'upload',
    short: { en: 'Doc Upload', mr: 'कागदपत्र अपलोड' },
    title: { en: 'Document Upload Problems', mr: 'कागदपत्र अपलोड समस्या' },
    desc: { en: 'Upload button stuck, file not attaching, progress freezes.', mr: 'अपलोड बटण अडकते, फाइल लागत नाही, प्रगती थांबते.' },
    keywords: ['upload', 'attach', 'document', 'certificate', 'caste', 'income', 'domicile', 'marksheet', 'अपलोड', 'कागदपत्र', 'दाखला'],
  },
  {
    id: 'file-size', icon: 'box',
    short: { en: 'File Size', mr: 'फाइल आकार' },
    title: { en: 'File Size and Format Problems', mr: 'फाइल आकार व प्रकार समस्या' },
    desc: { en: '"File too large", only PDF/JPG allowed, unclear limits.', mr: '“फाइल खूप मोठी”, फक्त PDF/JPG चालते, मर्यादा स्पष्ट नाहीत.' },
    keywords: ['size', 'large', 'kb', 'mb', 'format', 'pdf', 'jpg', 'jpeg', 'png', 'extension', 'limit', 'आकार', 'प्रकार', 'फॉरमॅट'],
  },
  {
    id: 'photo', icon: 'photo',
    short: { en: 'Photo', mr: 'फोटो' },
    title: { en: 'Photo and Signature Upload Problems', mr: 'फोटो व सही अपलोड समस्या' },
    desc: { en: 'Photo rejected: background, size, blur, signature unclear.', mr: 'फोटो नाकारला: पार्श्वभूमी, आकार, अस्पष्टता, सही स्पष्ट नाही.' },
    keywords: ['photo', 'signature', 'selfie', 'background', 'pixel', 'dimension', 'blur', 'फोटो', 'सही'],
  },
  {
    id: 'payment', icon: 'card',
    short: { en: 'Payment', mr: 'पेमेंट' },
    title: { en: 'Payment Failures', mr: 'पेमेंट अयशस्वी' },
    desc: { en: 'UPI/card fails, money deducted but receipt not shown.', mr: 'UPI/कार्ड अयशस्वी, पैसे कपात पण पावती नाही.' },
    keywords: ['payment', 'pay', 'upi', 'card', 'transaction', 'deduct', 'failed', 'receipt', 'refund', 'पेमेंट', 'पैसे', 'पावती'],
  },
  {
    id: 'submission', icon: 'checkcircle',
    short: { en: 'Submission', mr: 'सबमिशन' },
    title: { en: 'Form Submission Failures', mr: 'फॉर्म सबमिशन अयशस्वी' },
    desc: { en: 'Submit button does nothing, no acknowledgement number.', mr: 'सबमिट बटण काम करत नाही, पोच क्रमांक मिळत नाही.' },
    keywords: ['submit', 'submission', 'acknowledg', 'reference', 'final submit', 'preview', 'सबमिट', 'पोच'],
  },
  {
    id: 'reload', icon: 'refresh',
    short: { en: 'Reload', mr: 'रिफ्रेश' },
    title: { en: 'Form Reload and Reset Problems', mr: 'फॉर्म रीलोड व रीसेट समस्या' },
    desc: { en: 'Page refresh wipes data, back button loses progress.', mr: 'पेज रिफ्रेशने माहिती जाते, बॅक बटणाने प्रगती हरवते.' },
    keywords: ['reload', 'refresh', 'reset', 'back', 'lost', 'erase', 'wiped', 'draft', 'save draft', 'रिफ्रेश', 'रीसेट', 'माहिती गेली'],
  },
  {
    id: 'other', icon: 'bulb',
    short: { en: 'Other', mr: 'इतर' },
    title: { en: 'Other Educational Service Problems', mr: 'इतर शैक्षणिक सेवा समस्या' },
    desc: { en: 'Portal navigation, deadlines, helpline, print issues.', mr: 'पोर्टल वापर, मुदती, हेल्पलाइन, प्रिंट समस्या.' },
    keywords: [],
  },
]

export const SOLUTIONS = {
  internet: {
    causes: { en: ['Weak mobile signal or Wi-Fi dropout', 'Too many tabs/apps using bandwidth', 'Trying during peak hours on slow data'], mr: ['कमकुवत मोबाईल सिग्नल किंवा वाय-फाय खंड', 'जास्त टॅब/अ‍ॅप्समुळे स्पीड कमी', 'पीक वेळेत स्लो डेटावर प्रयत्न'] },
    steps: { en: ['Move closer to the router or switch to mobile data (or vice versa).', 'Close extra tabs, pause downloads/video, turn off VPN.', 'Reload once. If it fails twice, wait 10-15 min and retry.', 'Fill the form during morning hours; save draft after each section.', 'On mobile, enable “Desktop site” only if buttons are hidden.'], mr: ['राउटरजवळ जा किंवा मोबाईल डेटा बदला.', 'जादा टॅब बंद करा, डाउनलोड/व्हिडिओ थांबवा, VPN बंद करा.', 'एकदा रीलोड करा. दोनदा अयशस्वी झाल्यास १०-१५ मिनिटांनी पुन्हा प्रयत्न करा.', 'सकाळी फॉर्म भरा; प्रत्येक भागानंतर ड्राफ्ट जतन करा.', 'मोबाईलवर बटणे दिसत नसतील तरच “Desktop site” चालू करा.'] },
    prevention: { en: ['Keep a 1-2 GB data buffer on deadline days.', 'Keep screenshots of each filled section.'], mr: ['मुदतीच्या दिवशी १-२ GB डेटा राखून ठेवा.', 'प्रत्येक भरलेल्या भागाचा स्क्रीनशॉट ठेवा.'] },
    alternative: { en: 'Use a college computer lab / CSC centre with wired internet and fill the form there.', mr: 'कॉलेज कॉम्प्युटर लॅब / CSC केंद्रातील वायर्ड इंटरनेट वापरा.' },
    followups: [
      { q: { en: 'Are you on mobile data or Wi-Fi?', mr: 'तुम्ही मोबाईल डेटा वापरता की वाय-फाय?' }, options: ['Mobile data', 'Wi-Fi', 'Both are slow'] },
      { q: { en: 'Does the page partly load or show “connection timed out”?', mr: 'पेज अर्धवट उघडते की “connection timed out” दिसते?' }, options: ['Partly loads', 'Timed out', 'Blank page'] },
    ],
  },
  server: {
    causes: { en: ['Portal overloaded near deadline', 'Old cached page or browser incompatibility', 'Scheduled maintenance window'], mr: ['मुदतीजवळ पोर्टलवर जास्त लोड', 'जुनी कॅश पेज किंवा ब्राउझर समस्या', 'नियोजित देखभाल वेळ'] },
    steps: { en: ['Hard-refresh (Ctrl+Shift+R) and clear cache for that site only.', 'Try Chrome/Edge latest version; disable ad-blocker for the portal.', 'Retry in off-peak hours (before 10am). Do not spam the Submit button.', 'Check the portal notice board / Twitter for “maintenance” announcements.', 'If 500 persists for 24 hrs, email the helpdesk with screenshot + time.'], mr: ['हार्ड-रिफ्रेश (Ctrl+Shift+R) करा आणि त्या साइटची कॅश साफ करा.', 'नवीन Chrome/Edge वापरा; पोर्टलसाठी अ‍ॅड-ब्लॉकर बंद करा.', 'गर्दी नसलेल्या वेळी (सकाळी १० पूर्वी) प्रयत्न करा. सबमिट वारंवार दाबू नका.', '“देखभाल” सूचना नोटीस बोर्डवर तपासा.', '२४ तास 500 त्रुटी राहिल्यास स्क्रीनशॉट + वेळेसह हेल्पडेस्कला ईमेल करा.'] },
    prevention: { en: ['Never wait for the last day; submit 2-3 days early.', 'Bookmark the official portal (avoid fake links).'], mr: ['शेवटच्या दिवसाची वाट पाहू नका; २-३ दिवस आधी सबमिट करा.', 'अधिकृत पोर्टल बुकमार्क करा (बनावट लिंक टाळा).'] },
    alternative: { en: 'Try the portal from a different device/network once, then return to your main device.', mr: 'एकदा वेगळ्या डिव्हाइस/नेटवर्कवरून प्रयत्न करा, नंतर मुख्य डिव्हाइसवर परत या.' },
    followups: [
      { q: { en: 'Do you see a number like 500, 503 or 404?', mr: 'तुम्हाला 500, 503 किंवा 404 असा क्रमांक दिसतो का?' }, options: ['Yes, 500/503', 'Yes, 404', 'No number, just stuck'] },
      { q: { en: 'Is it the last date rush (deadline today/tomorrow)?', mr: 'आज/उद्या शेवटची तारीख आहे का?' }, options: ['Yes', 'No'] },
    ],
  },
  otp: {
    causes: { en: ['Wrong/old mobile number linked to account', 'SMS inbox full or DND blocking', 'OTP expired (usually 5-10 min validity)'], mr: ['खात्याला चुकीचा/जुना मोबाईल नंबर लिंक', 'SMS इनबॉक्स भरलेला किंवा DND ब्लॉक', 'OTP कालबाह्य (साधारण ५-१० मिनिटे वैध)'] },
    steps: { en: ['Wait 60-90 seconds, then tap Resend OTP only once.', 'Check SMS inbox space; turn off SMS spam-blocker; keep network on 4G.', 'Confirm you entered the correct mobile number (no +91 twice).', 'Never share OTP with anyone. College staff never ask for it.', 'If OTP never arrives after 3 tries, update your mobile number via college helpdesk.'], mr: ['६०-९० सेकंद थांबा, नंतर एकदाच Resend OTP दाबा.', 'SMS जागा तपासा; स्पॅम-ब्लॉकर बंद करा; 4G चालू ठेवा.', 'बरोबर मोबाईल नंबर टाकला आहे का ते तपासा.', 'OTP कोणालाही सांगू नका. कर्मचारी कधीही मागत नाहीत.', '३ प्रयत्नांनंतरही OTP न आल्यास कॉलेज हेल्पडेस्कमधून नंबर अपडेट करा.'] },
    prevention: { en: ['Keep the SIM that is linked inside the phone during the whole process.', 'Save the helpline number before starting.'], mr: ['संपूर्ण प्रक्रियेदरम्यान लिंक असलेले सिम फोनमध्ये ठेवा.', 'सुरुवातीपूर्वी हेल्पलाइन नंबर जतन करा.'] },
    alternative: { en: 'If available, use “login with email + password” or CSC-assisted verification.', mr: 'शक्य असल्यास “ईमेल + पासवर्ड लॉगिन” किंवा CSC मदत वापरा.' },
    followups: [
      { q: { en: 'Did you receive any OTP at all?', mr: 'तुम्हाला कोणताही OTP मिळाला का?' }, options: ['No OTP at all', 'OTP comes late', 'OTP says invalid/expired'] },
      { q: { en: 'Is the linked mobile number with you right now?', mr: 'लिंक केलेला मोबाईल नंबर सध्या तुमच्याजवळ आहे का?' }, options: ['Yes', 'No, old number'] },
    ],
  },
  password: {
    causes: { en: ['Forgotten exact password (caps/spelling)', 'Reset email goes to spam', 'Account temporarily locked after many tries'], mr: ['अचूक पासवर्ड आठवत नाही (कॅप्स/स्पेलिंग)', 'रीसेट ईमेल स्पॅममध्ये जातो', 'जास्त प्रयत्नांमुळे खाते तात्पुरते लॉक'] },
    steps: { en: ['Use “Forgot Password” once; check Inbox + Spam/Promotions folder.', 'Reset with a new 10+ character password; write it on paper temporarily.', 'Wait 30 minutes if locked, then try once.', 'Do not create a second account. It causes name mismatches later.', 'If email access is lost, contact college admin for reset.'], mr: ['एकदाच “Forgot Password” वापरा; इनबॉक्स + स्पॅम फोल्डर तपासा.', '१०+ अक्षरांचा नवीन पासवर्ड ठेवा; तात्पुरता कागदावर लिहा.', 'लॉक झाल्यास ३० मिनिटे थांबा, नंतर एकदाच प्रयत्न करा.', 'दुसरे खाते बनवू नका. नंतर नावात चुका होतात.', 'ईमेल उपलब्ध नसल्यास कॉलेज प्रशासनाशी संपर्क साधा.'] },
    prevention: { en: ['Store the password in a notebook + phone notes.', 'Link both email and mobile before deadlines.'], mr: ['पासवर्ड वही + फोन नोट्समध्ये ठेवा.', 'मुदतीपूर्वी ईमेल आणि मोबाईल दोन्ही लिंक करा.'] },
    alternative: { en: 'Ask your college computer operator to guide the reset on the official helpdesk email.', mr: 'अधिकृत हेल्पडेस्क ईमेलवर रीसेटसाठी कॉलेज ऑपरेटरची मदत घ्या.' },
    followups: [
      { q: { en: 'Do you still have access to the registered email?', mr: 'नोंदणीकृत ईमेलमध्ये तुम्हाला प्रवेश आहे का?' }, options: ['Yes', 'No'] },
      { q: { en: 'Is the account locked or just wrong password?', mr: 'खाते लॉक आहे की फक्त पासवर्ड चुकीचा?' }, options: ['Locked', 'Wrong password'] },
    ],
  },
  'form-entry': {
    causes: { en: ['Name/DOB does not match Aadhaar/marksheet', 'Mandatory (*) fields missed or wrong format', 'Instructions misunderstood (e.g. annual vs monthly income)'], mr: ['नाव/जन्मतारीख आधार/मार्कशीटशी जुळत नाही', 'आवश्यक (*) फील्ड राहिले किंवा चुकीचा फॉरमॅट', 'सूचना न समजणे (उदा. वार्षिक विरुद्ध मासिक उत्पन्न)'] },
    steps: { en: ['Keep Aadhaar + marksheet beside you; copy name/DOB letter-by-letter.', 'Fill mandatory (*) fields first. Use DD-MM-YYYY where asked.', 'Enter income exactly as written on the income certificate.', 'Use “Save Draft” after each page; review in Preview before final submit.', 'If a dropdown lacks your caste/category, stop and confirm with college office first.'], mr: ['आधार + मार्कशीट समोर ठेवा; नाव/जन्मतारीख अक्षरशः कॉपी करा.', 'आधी आवश्यक (*) फील्ड भरा. विचारल्यास DD-MM-YYYY वापरा.', 'उत्पन्न दाखल्यावर लिहिल्याप्रमाणेच उत्पन्न टाका.', 'प्रत्येक पानानंतर “Save Draft” करा; अंतिम सबमिटपूर्वी Preview तपासा.', 'ड्रॉपडाउनमध्ये तुमची जात/प्रवर्ग नसल्यास थांबा आणि आधी कॉलेज कार्यालयात विचारा.'] },
    prevention: { en: ['Read the official instruction PDF once fully before typing.', 'Keep one photocopy set ready for cross-checking.'], mr: ['टाइप करण्यापूर्वी अधिकृत सूचना PDF एकदा पूर्ण वाचा.', 'तपासणीसाठी एक झेरॉक्स सेट तयार ठेवा.'] },
    alternative: { en: 'Fill the form together with a teacher/CSC operator and let them verify Preview.', mr: 'शिक्षक/CSC ऑपरेटरसोबत फॉर्म भरा आणि Preview तपासून घ्या.' },
    followups: [
      { q: { en: 'Which field shows the error?', mr: 'कोणत्या फील्डमध्ये त्रुटी दिसते?' }, options: ['Name / DOB', 'Income / category', 'Other field'] },
      { q: { en: 'Do you have Aadhaar + marksheet with you now?', mr: 'सध्या आधार + मार्कशीट तुमच्याजवळ आहे का?' }, options: ['Yes', 'No'] },
    ],
  },
  'doc-upload': {
    causes: { en: ['Unsupported browser or slow network during upload', 'File name has spaces/special characters', 'Session expired while uploading'], mr: ['अपलोडवेळी असमर्थित ब्राउझर किंवा स्लो नेटवर्क', 'फाइल नावात स्पेस/विशेष चिन्हे', 'अपलोडवेळी सत्र कालबाह्य'] },
    steps: { en: ['Rename file simply: e.g. income.pdf (no spaces).', 'Use latest Chrome; upload one file at a time; wait for 100% + green tick.', 'If stuck at 99%, cancel, refresh, log in again and retry.', 'Keep each file under the stated KB limit (use Smart Tools → File Checker).', 'After upload, click the eye/preview icon to confirm it opens.'], mr: ['फाइलचे नाव सोपे ठेवा: उदा. income.pdf (स्पेस नको).', 'नवीन Chrome वापरा; एकावेळी एक फाइल अपलोड करा; १००% + हिरवी टिक येईपर्यंत थांबा.', '९९% वर अडकल्यास रद्द करा, रिफ्रेश करा, पुन्हा लॉगिन करून प्रयत्न करा.', 'प्रत्येक फाइल KB मर्यादेखाली ठेवा (स्मार्ट साधने → File Checker वापरा).', 'अपलोडनंतर डोळा/preview चिन्हाने फाइल उघडते का ते तपासा.'] },
    prevention: { en: ['Scan at 150 DPI, black-white for documents (smaller size).', 'Keep originals + one backup folder on phone.'], mr: ['कागदपत्रे 150 DPI, ब्लॅक-व्हाइट स्कॅन करा (आकार लहान).', 'मूळ प्रती + फोनमध्ये एक बॅकअप फोल्डर ठेवा.'] },
    alternative: { en: 'Compress/scan again at a cyber café and upload from their PC if home network fails.', mr: 'घरचे नेटवर्क अयशस्वी झाल्यास सायबर कॅफेत स्कॅन/कॉम्प्रेस करून तिथून अपलोड करा.' },
    followups: [
      { q: { en: 'What happens when you upload?', mr: 'अपलोड करताना काय होते?' }, options: ['Stuck / freezing', 'Error message', 'Uploads but preview broken'] },
      { q: { en: 'What is your file type?', mr: 'तुमची फाइल कोणत्या प्रकारची आहे?' }, options: ['PDF', 'JPG/PNG', 'Not sure'] },
    ],
  },
  'file-size': {
    causes: { en: ['Scan too high-resolution (300+ DPI colour)', 'Phone camera photo is 2-5 MB', 'Portal accepts only PDF/JPG under e.g. 200 KB'], mr: ['स्कॅन खूप उच्च रिझोल्यूशन (300+ DPI रंगीत)', 'फोन फोटो २-५ MB असतो', 'पोर्टल फक्त उदा. 200 KB खालील PDF/JPG स्वीकारते'] },
    steps: { en: ['Check the exact limit written near the upload box (e.g. “max 200 KB, PDF only”).', 'Use Smart Tools → File Checker to test your file for real.', 'For PDFs: re-scan at 150 DPI black-white, or print-to-PDF at lower quality.', 'For images: use Smart Tools → Photo resizer to shrink to the target KB.', 'Re-check the new file, then upload. Keep old + new copies.'], mr: ['अपलोड बॉक्सजवळ लिहिलेली अचूक मर्यादा पाहा (उदा. “max 200 KB, PDF only”).', 'स्मार्ट साधने → File Checker ने तुमची फाइल खरोखर तपासा.', 'PDF साठी: 150 DPI ब्लॅक-व्हाइट पुन्हा स्कॅन करा.', 'इमेजसाठी: स्मार्ट साधने → Photo resizer ने लक्ष्य KB पर्यंत लहान करा.', 'नवीन फाइल पुन्हा तपासा, नंतर अपलोड करा. जुनी + नवीन दोन्ही ठेवा.'] },
    prevention: { en: ['Always scan documents in black-white unless colour is required.', 'Name files with limit, e.g. income-180kb.pdf.'], mr: ['रंग आवश्यक नसल्यास कागदपत्रे ब्लॅक-व्हाइट स्कॅन करा.', 'फाइल नावात मर्यादा लिहा, उदा. income-180kb.pdf.'] },
    alternative: { en: 'Use a free offline compressor on your own PC; avoid uploading sensitive docs to random sites.', mr: 'तुमच्याच PC वर ऑफलाइन कॉम्प्रेसर वापरा; संवेदनशील कागदपत्रे अनोळखी साइटवर टाकू नका.' },
    followups: [
      { q: { en: 'What does the error say?', mr: 'त्रुटी काय सांगते?' }, options: ['File too large', 'Invalid format', 'Both / not sure'] },
      { q: { en: 'How big is your file?', mr: 'तुमची फाइल किती मोठी आहे?' }, options: ['Under 500 KB', 'Over 1 MB', "Don't know"] },
    ],
  },
  photo: {
    causes: { en: ['Wrong background/dimensions (e.g. needs 200×230 px, white background)', 'Blurry/dark selfie or scanned photo', 'Signature on ruled paper or in blue ink too light'], mr: ['चुकीची पार्श्वभूमी/आकार (उदा. 200×230 px, पांढरी पार्श्वभूमी हवी)', 'अस्पष्ट/अंधुक सेल्फी किंवा स्कॅन फोटो', 'रेघोट्या कागदावर सही किंवा फिकट निळी शाई'] },
    steps: { en: ['Read the exact spec: size in KB, dimensions in px, JPG only etc.', 'Photo: white wall, daylight, face centred, no cap/goggles; crop shoulders-up.', 'Signature: black pen on plain white paper, medium size, scan straight.', 'Use Smart Tools → Photo & Signature resizer to match px + KB, then download.', 'Upload the resized file and zoom the preview to confirm clarity.'], mr: ['अचूक नियम वाचा: KB आकार, px परिमाण, फक्त JPG इ.', 'फोटो: पांढरी भिंत, दिवसाचा प्रकाश, चेहरा मध्यभागी; टोपी/गॉगल नको.', 'सही: कोऱ्या पांढऱ्या कागदावर काळ्या पेनने, मध्यम आकारात, सरळ स्कॅन.', 'स्मार्ट साधने → Photo & Signature resizer ने px + KB जुळवा, नंतर डाउनलोड करा.', 'आकार बदललेली फाइल अपलोड करा आणि preview झूम करून स्पष्टता तपासा.'] },
    prevention: { en: ['Keep one passport photo <50 KB JPG always ready.', 'Keep signature scan <30 KB JPG ready.'], mr: ['एक पासपोर्ट फोटो <50 KB JPG नेहमी तयार ठेवा.', 'सही स्कॅन <30 KB JPG तयार ठेवा.'] },
    alternative: { en: 'Get one studio photo + signature scan at a studio and reuse for all forms.', mr: 'स्टुडिओत एक फोटो + सही स्कॅन करून सर्व फॉर्मसाठी वापरा.' },
    followups: [
      { q: { en: 'Which file is rejected?', mr: 'कोणती फाइल नाकारली जात आहे?' }, options: ['Photo', 'Signature', 'Both'] },
      { q: { en: 'Do you know the required size/dimensions?', mr: 'आवश्यक आकार/परिमाण तुम्हाला माहित आहे का?' }, options: ['Yes', 'No'] },
    ],
  },
  payment: {
    causes: { en: ['Bank/UPI server busy or daily limit reached', 'Back/refresh pressed during payment', 'Session expired before gateway responded'], mr: ['बँक/UPI सर्व्हर व्यस्त किंवा दैनिक मर्यादा संपली', 'पेमेंटवेळी बॅक/रिफ्रेश दाबले', 'गेटवे उत्तरापूर्वी सत्र कालबाह्य'] },
    steps: { en: ['Do NOT pay again immediately. Wait 30-60 minutes.', 'Check your bank/UPI app statement + SMS for “debit” entry.', 'On the portal, open “Payment History / My Applications” to see status.', 'Save/Download any receipt or transaction ID (UTR). Take screenshots.', 'If debited but portal shows “failed/pending” after 24 hrs, raise a grievance with UTR on the official helpline. Do not share card PIN/CVV/OTP with anyone.'], mr: ['लगेच पुन्हा पैसे भरू नका. ३०-६० मिनिटे थांबा.', 'बँक/UPI अ‍ॅप स्टेटमेंट + SMS मध्ये “debit” नोंद तपासा.', 'पोर्टलवर “Payment History / My Applications” मध्ये स्थिती पाहा.', 'पावती किंवा व्यवहार ID (UTR) जतन/डाउनलोड करा. स्क्रीनशॉट घ्या.', 'पैसे कपात होऊन २४ तासांनंतरही “failed/pending” दिसल्यास UTR सह अधिकृत हेल्पलाइनवर तक्रार करा. कार्ड PIN/CVV/OTP कोणालाही देऊ नका.'] },
    prevention: { en: ['Pay 2-3 days before deadline, morning hours, stable network.', 'Keep UPI daily limit in mind; keep second payment option ready.'], mr: ['मुदतीच्या २-३ दिवस आधी, सकाळी, स्थिर नेटवर्कवर भरा.', 'UPI दैनिक मर्यादा लक्षात ठेवा; दुसरा पेमेंट पर्याय तयार ठेवा.'] },
    alternative: { en: 'If UPI fails, try net-banking/card once later, or pay at an authorised centre if the portal allows.', mr: 'UPI अयशस्वी झाल्यास नंतर एकदा नेट-बँकिंग/कार्ड वापरा किंवा परवानगी असल्यास अधिकृत केंद्रात भरा.' },
    followups: [
      { q: { en: 'Was money deducted from your account?', mr: 'तुमच्या खात्यातून पैसे कपात झाले का?' }, options: ['Yes, deducted', 'No', 'Not sure'] },
      { q: { en: 'What did you use?', mr: 'तुम्ही काय वापरले?' }, options: ['UPI', 'Card / net-banking', 'Other'] },
    ],
  },
  submission: {
    causes: { en: ['Mandatory step skipped (preview/declaration unchecked)', 'Hidden field error on an earlier tab', 'Double-clicking Submit or session timeout'], mr: ['आवश्यक पायरी राहिली (preview/घोषणा टिक नाही)', 'मागील टॅबवर लपलेली फील्ड त्रुटी', 'सबमिट दोनदा दाबणे किंवा सत्र कालबाह्य'] },
    steps: { en: ['Go to Preview; scroll fully; tick declaration/consent checkbox.', 'Look for red borders or (!) on all tabs; fix each one.', 'Click Final Submit ONCE and wait 30-60 seconds without refresh.', 'After success, download/print acknowledgement + note the application number.', 'If no acknowledgement: check “My Applications” before refilling. Your data may already be saved.'], mr: ['Preview उघडा; पूर्ण स्क्रोल करा; घोषणा/संमती टिक करा.', 'सर्व टॅबवर लाल बॉर्डर किंवा (!) शोधा; प्रत्येक दुरुस्त करा.', 'Final Submit एकदाच दाबा आणि रिफ्रेश न करता ३०-६० सेकंद थांबा.', 'यशानंतर पोच डाउनलोड/प्रिंट करा + अर्ज क्रमांक लिहा.', 'पोच न मिळाल्यास पुन्हा भरण्यापूर्वी “My Applications” तपासा. माहिती जतन झालेली असू शकते.'] },
    prevention: { en: ['Use “Save Draft” after every section.', 'Submit in the morning, not at 11:59 pm.'], mr: ['प्रत्येक भागानंतर “Save Draft” वापरा.', 'रात्री ११:५९ ऐवजी सकाळी सबमिट करा.'] },
    alternative: { en: 'Fill with a CSC/college operator watching the Preview page so no checkbox is missed.', mr: 'Preview पेज ऑपरेटरसमोर भरा म्हणजे कोणतीही टिक राहणार नाही.' },
    followups: [
      { q: { en: 'Do you get an acknowledgement / application number?', mr: 'तुम्हाला पोच / अर्ज क्रमांक मिळतो का?' }, options: ['No', 'Yes but no download', 'Error on clicking Submit'] },
      { q: { en: 'Did you tick the declaration checkbox in Preview?', mr: 'Preview मधील घोषणा चेकबॉक्स टिक केला का?' }, options: ['Yes', 'No / not sure'] },
    ],
  },
  reload: {
    causes: { en: ['Accidental refresh/back or browser crash', 'Portal session timeout (15-30 min idle)', 'Draft never saved'], mr: ['चुकून रिफ्रेश/बॅक किंवा ब्राउझर क्रॅश', 'पोर्टल सत्र कालबाह्य (१५-३० मिनिटे निष्क्रिय)', 'ड्राफ्ट कधीही जतन केला नाही'] },
    steps: { en: ['Log in again; open “My Applications / Drafts”. Your data may be there.', 'Do not refill blindly; resume the draft if present.', 'Refill missing parts from your screenshots/notes.', 'Press Save Draft every 5 minutes from now on.', 'Keep one tab only and avoid the Back button. Use the portal Next/Previous buttons.'], mr: ['पुन्हा लॉगिन करा; “My Applications / Drafts” उघडा. माहिती तिथे असू शकते.', 'आंधळेपणाने पुन्हा भरू नका; ड्राफ्ट असल्यास तिथून पुढे जा.', 'स्क्रीनशॉट/नोंदींवरून राहिलेले भाग भरा.', 'आतापासून दर ५ मिनिटांनी Save Draft दाबा.', 'एकच टॅब ठेवा; बॅक बटण टाळा. पोर्टलचे Next/Previous वापरा.'] },
    prevention: { en: ['Type long answers in Notes first, then paste.', 'Keep laptop charged / auto-lock off during forms.'], mr: ['लांब उत्तरे आधी Notes मध्ये लिहा, नंतर पेस्ट करा.', 'फॉर्मवेळी लॅपटॉप चार्ज ठेवा / ऑटो-लॉक बंद करा.'] },
    alternative: { en: 'Ask the helpdesk to restore/confirm your draft using your application ID.', mr: 'अर्ज ID वापरून ड्राफ्ट पुनर्संचयित/पुष्टी करण्यासाठी हेल्पडेस्कला विचारा.' },
    followups: [
      { q: { en: 'Did you click “Save Draft” earlier?', mr: 'तुम्ही आधी “Save Draft” दाबले होते का?' }, options: ['Yes', 'No', 'Not sure'] },
      { q: { en: 'What caused the reset?', mr: 'रीसेट कशामुळे झाले?' }, options: ['Refresh / back button', 'Session expired', 'Browser closed'] },
    ],
  },
  other: {
    causes: { en: ['Unclear portal navigation or deadline info', 'Printing/download option hidden', 'Need human help (helpline/college office)'], mr: ['पोर्टल वापर किंवा मुदत माहिती अस्पष्ट', 'प्रिंट/डाउनलोड पर्याय लपलेला', 'मानवी मदत हवी (हेल्पलाइन/कॉलेज कार्यालय)'] },
    steps: { en: ['Note your exact issue in one sentence + take a screenshot.', 'Check Notice/Circular section for deadline and user manual PDF.', 'Use Dashboard search with keywords (e.g. “print”, “deadline”).', 'Visit college office/CSC with Aadhaar + application ID + screenshots.', 'Never pay agents who promise “guaranteed approval”. Use only official links.'], mr: ['तुमची अडचण एका वाक्यात लिहा + स्क्रीनशॉट घ्या.', 'मुदत आणि वापरकर्ता माहिती PDF साठी Notice/Circular विभाग तपासा.', 'डॅशबोर्ड शोधात कीवर्ड वापरा (उदा. “print”, “deadline”).', 'आधार + अर्ज ID + स्क्रीनशॉटसह कॉलेज कार्यालय/CSC मध्ये जा.', '“हमीसह मंजुरी” सांगणाऱ्या एजंटांना पैसे देऊ नका. फक्त अधिकृत लिंक वापरा.'] },
    prevention: { en: ['Save the official helpline + user manual before starting.', 'Keep a folder: PDFs, photos, receipts, IDs in one place.'], mr: ['सुरुवातीपूर्वी अधिकृत हेल्पलाइन + माहिती PDF जतन करा.', 'एक फोल्डर ठेवा: PDF, फोटो, पावत्या, ID एकाच ठिकाणी.'] },
    alternative: { en: 'Ask a teacher or CSC operator to sit with you for 15 minutes.', mr: '१५ मिनिटे शिक्षक किंवा CSC ऑपरेटरला सोबत बसायला सांगा.' },
    followups: [
      { q: { en: 'Is it about deadlines, printing, or finding the right page?', mr: 'मुदत, प्रिंट की योग्य पेज शोधण्याबद्दल आहे?' }, options: ['Deadline', 'Printing', 'Navigation'] },
      { q: { en: 'Do you have your application ID?', mr: 'तुमच्याकडे अर्ज ID आहे का?' }, options: ['Yes', 'No'] },
    ],
  },
}

export function detectCategory(text) {
  const t = (text || '').toLowerCase()
  let best = 'other'
  let bestScore = 0
  for (const c of CATEGORIES) {
    if (c.id === 'other') continue
    let score = 0
    for (const k of c.keywords) {
      if (k && t.includes(k.toLowerCase())) score += k.length > 4 ? 2 : 1
    }
    if (score > bestScore) { bestScore = score; best = c.id }
  }
  return { id: best, confident: bestScore >= 2 }
}
