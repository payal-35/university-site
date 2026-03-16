import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Settings, X, Globe, CheckCircle2, Check } from 'lucide-react';

const translations = {
  en: {
    title: "Privacy & Consent Management",
    description: "We use cookies and data preferences to provide secure banking services, analyze platform usage, and improve customer experience. You can manage how your data is used for analytics, marketing communication, and personalized banking services.",
    necessary: "Necessary Cookies",
    necessaryDesc: "Required for secure login, transactions, and core banking services.",
    analytics: "Analytics Cookies",
    analyticsDesc: "Help us understand how customers interact with our banking services.",
    marketing: "Marketing Cookies",
    marketingDesc: "Used to send banking offers, loan promotions, and financial product updates.",
    preference: "Preference Cookies",
    preferenceDesc: "Remember user settings such as language and dashboard preferences.",
    reset: "Reset All",
    save: "Save & Close",
    edit: "Edit Preferences",
    historyTitle: "Consent History",
    on: "On",
    off: "Off"
  },
  hi: {
    title: "गोपनीयता और सहमति प्रबंधन",
    description: "हम सुरक्षित बैंकिंग सेवाएं प्रदान करने, प्लेटफ़ॉर्म उपयोग का विश्लेषण करने और ग्राहक अनुभव को बेहतर बनाने के लिए कुकीज़ और डेटा प्राथमिकताओं का उपयोग करते हैं। आप प्रबंधित कर सकते हैं कि आपके डेटा का उपयोग एनालिटिक्स, मार्केटिंग संचार और व्यक्तिगत बैंकिंग सेवाओं के लिए कैसे किया जाता है।",
    necessary: "आवश्यक कुकीज़",
    necessaryDesc: "सुरक्षित लॉगिन, लेनदेन और मुख्य बैंकिंग सेवाओं के लिए आवश्यक।",
    analytics: "एनालिटिक्स कुकीज़",
    analyticsDesc: "हमें यह समझने में मदद करें कि ग्राहक हमारी बैंकिंग सेवाओं के साथ कैसे इंटरैक्ट करते हैं।",
    marketing: "मार्केटिंग कुकीज़",
    marketingDesc: "बैंकिंग ऑफ़र, ऋण प्रचार और वित्तीय उत्पाद अपडेट भेजने के लिए उपयोग किया जाता है।",
    preference: "प्राथमिकता कुकीज़",
    preferenceDesc: "भाषा और डैशबोर्ड प्राथमिकताओं जैसी उपयोगकर्ता सेटिंग्स याद रखें।",
    reset: "सभी रीसेट करें",
    save: "सहेजें और बंद करें",
    edit: "प्राथमिकताएं संपादित करें",
    historyTitle: "सहमति इतिहास",
    on: "चालू",
    off: "बंद"
  },
  mr: {
    title: "गोपनीयता आणि संमती व्यवस्थापन",
    description: "आम्ही सुरक्षित बँकिंग सेवा प्रदान करण्यासाठी, प्लॅटफॉर्म वापराचे विश्लेषण करण्यासाठी आणि ग्राहक अनुभव सुधारण्यासाठी कुकीज आणि डेटा प्राधान्यांचा वापर करतो. आपण विश्लेषण, विपणन संप्रेषण आणि वैयक्तिकृत बँकिंग सेवांसाठी आपला डेटा कसा वापरला जातो हे व्यवस्थापित करू शकता.",
    necessary: "आवश्यक कुकीज",
    necessaryDesc: "सुरक्षित लॉगिन, व्यवहार आणि मुख्य बँकिंग सेवांसाठी आवश्यक.",
    analytics: "अॅनालिटिक्स कुकीज",
    analyticsDesc: "ग्राहक आमच्या बँकिंग सेवांशी कसा संवाद साधतात हे समजून घेण्यास आम्हाला मदत करा.",
    marketing: "मार्केटिंग कुकीज",
    marketingDesc: "बँकिंग ऑफर, कर्ज जाहिराती आणि आर्थिक उत्पादन अद्यतने पाठविण्यासाठी वापरले जाते.",
    preference: "प्राधान्य कुकीज",
    preferenceDesc: "भाषा आणि डॅशबोर्ड प्राधान्यांसारख्या वापरकर्ता सेटिंग्ज लक्षात ठेवा.",
    reset: "सर्व रीसेट करा",
    save: "जतन करा आणि बंद करा",
    edit: "प्राधान्ये संपादित करा",
    historyTitle: "संमती इतिहास",
    on: "चालू",
    off: "बंद"
  }
};

type Language = 'en' | 'hi' | 'mr';

export default function PrivacySettings() {
  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [lang, setLang] = useState<Language>('en');
  const [preferences, setPreferences] = useState({
    analytics: false,
    marketing: false,
    preference: false,
  });

  useEffect(() => {
    if (isOpen) {
      const savedPrefs = localStorage.getItem('bank_cookie_preferences');
      if (savedPrefs) {
        try {
          setPreferences(JSON.parse(savedPrefs));
          setIsEditing(false);
        } catch (e) {
          console.error("Failed to parse preferences");
          setIsEditing(true);
        }
      } else {
        setIsEditing(true);
      }
      const savedLang = localStorage.getItem('bank_language');
      if (savedLang && (savedLang === 'en' || savedLang === 'hi' || savedLang === 'mr')) {
        setLang(savedLang as Language);
      }
    }
  }, [isOpen]);

  const handleToggle = (key: keyof typeof preferences) => {
    if (!isEditing) return;
    setPreferences((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleReset = () => {
    setPreferences({
      analytics: false,
      marketing: false,
      preference: false,
    });
  };

  const handleSave = async () => {
    localStorage.setItem('bank_cookie_preferences', JSON.stringify(preferences));
    localStorage.setItem('bank_language', lang);
    
    // Sync with arcompli API if we have an email
    const email = localStorage.getItem('bank_user_email');
    if (email) {
      try {
        const formResponse = await fetch('https://arcompli.com/api/v1/forms/3b425527455a76afa6d4d5c48a192e64');
        const form = await formResponse.json();

        await fetch('https://arcompli.com/api/v1/consent', {
          method: 'POST',
          headers: {
            'Authorization': 'Bearer arc_live_...',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            form_token: '3b425527455a76afa6d4d5c48a192e64',
            subject_email: email,
            consents: form.purposes.map((p: any) => {
              let granted = true;
              const name = (p.name || '').toLowerCase();
              if (name.includes('analytic')) granted = preferences.analytics;
              else if (name.includes('marketing')) granted = preferences.marketing;
              else if (name.includes('preference')) granted = preferences.preference;
              return { purpose_id: p.id, granted };
            }),
          }),
        });
      } catch (error) {
        console.error("Failed to record consent with arcompli API:", error);
      }
    }

    // Dispatch event so other components (like Contact form) can know preferences updated
    window.dispatchEvent(new Event('preferencesUpdated'));
    setIsEditing(false);
    setIsOpen(false);
  };

  const t = translations[lang];

  return (
    <>
      {/* Floating Settings Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 left-6 z-40 p-3 bg-blue-900 text-white rounded-full shadow-lg hover:bg-blue-800 hover:scale-105 transition-all focus:outline-none focus:ring-2 focus:ring-blue-900 focus:ring-offset-2"
        aria-label="Privacy Settings"
      >
        <Settings className="w-6 h-6" />
      </button>

      {/* Slide-in Popup Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50"
            />

            {/* Panel */}
            <motion.div
              initial={{ x: -20, opacity: 0, scale: 0.95 }}
              animate={{ x: 0, opacity: 1, scale: 1 }}
              exit={{ x: -20, opacity: 0, scale: 0.95 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed bottom-24 left-6 w-[calc(100%-3rem)] max-w-[400px] bg-white shadow-2xl z-50 flex flex-col overflow-hidden rounded-2xl max-h-[calc(100vh-8rem)]"
            >
              {/* Header */}
              <div className="flex items-start justify-between p-6 pb-4 gap-4">
                <h2 className="text-2xl font-bold text-slate-900 leading-tight max-w-[220px]">{t.title}</h2>
                <div className="flex items-center gap-3 shrink-0 mt-1">
                  <div className="flex items-center gap-1.5 text-sm text-slate-700 border border-slate-200 rounded-md px-2 py-1.5 bg-white">
                    <Globe className="w-4 h-4 text-slate-500" />
                    <select 
                      value={lang}
                      onChange={(e) => setLang(e.target.value as Language)}
                      className="bg-transparent outline-none font-semibold text-slate-700 cursor-pointer text-sm pr-1"
                    >
                      <option value="en">English</option>
                      <option value="hi">Hindi</option>
                      <option value="mr">Marathi</option>
                    </select>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
                    aria-label="Close"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6 pt-2 space-y-6">
                <p className="text-sm text-slate-600 leading-relaxed">
                  {t.description}
                </p>

                <div className="space-y-6">
                  {/* Necessary Cookies */}
                  <div className="flex items-start gap-4 bg-white">
                    <div className="mt-0.5 text-[#1e3a8a] shrink-0">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-900 mb-1">{t.necessary} <span className="text-red-500">*</span></h3>
                      <p className="text-sm text-slate-600">{t.necessaryDesc}</p>
                    </div>
                  </div>

                  {/* Analytics Cookies */}
                  <label className={`flex items-start gap-4 bg-white ${isEditing ? 'cursor-pointer group' : 'cursor-default'}`}>
                    <div className="relative flex items-center mt-0.5 shrink-0">
                      <input
                        type="checkbox"
                        checked={preferences.analytics}
                        onChange={() => handleToggle('analytics')}
                        disabled={!isEditing}
                        className={`peer appearance-none w-5 h-5 border border-slate-300 rounded checked:bg-[#1e3a8a] checked:border-[#1e3a8a] transition-all ${isEditing ? 'cursor-pointer' : 'cursor-default opacity-70'}`}
                      />
                      <Check className="absolute w-3.5 h-3.5 text-white left-[3px] top-[3px] pointer-events-none opacity-0 peer-checked:opacity-100 stroke-[3]" />
                    </div>
                    <div className="flex-1">
                      <h3 className={`font-semibold text-slate-900 mb-1 transition-colors ${isEditing ? 'group-hover:text-[#1e3a8a]' : ''}`}>{t.analytics}</h3>
                      <p className="text-sm text-slate-600">{t.analyticsDesc}</p>
                    </div>
                  </label>

                  {/* Marketing Cookies */}
                  <label className={`flex items-start gap-4 bg-white ${isEditing ? 'cursor-pointer group' : 'cursor-default'}`}>
                    <div className="relative flex items-center mt-0.5 shrink-0">
                      <input
                        type="checkbox"
                        checked={preferences.marketing}
                        onChange={() => handleToggle('marketing')}
                        disabled={!isEditing}
                        className={`peer appearance-none w-5 h-5 border border-slate-300 rounded checked:bg-[#1e3a8a] checked:border-[#1e3a8a] transition-all ${isEditing ? 'cursor-pointer' : 'cursor-default opacity-70'}`}
                      />
                      <Check className="absolute w-3.5 h-3.5 text-white left-[3px] top-[3px] pointer-events-none opacity-0 peer-checked:opacity-100 stroke-[3]" />
                    </div>
                    <div className="flex-1">
                      <h3 className={`font-semibold text-slate-900 mb-1 transition-colors ${isEditing ? 'group-hover:text-[#1e3a8a]' : ''}`}>{t.marketing}</h3>
                      <p className="text-sm text-slate-600">{t.marketingDesc}</p>
                    </div>
                  </label>

                  {/* Preference Cookies */}
                  <label className={`flex items-start gap-4 bg-white ${isEditing ? 'cursor-pointer group' : 'cursor-default'}`}>
                    <div className="relative flex items-center mt-0.5 shrink-0">
                      <input
                        type="checkbox"
                        checked={preferences.preference}
                        onChange={() => handleToggle('preference')}
                        disabled={!isEditing}
                        className={`peer appearance-none w-5 h-5 border border-slate-300 rounded checked:bg-[#1e3a8a] checked:border-[#1e3a8a] transition-all ${isEditing ? 'cursor-pointer' : 'cursor-default opacity-70'}`}
                      />
                      <Check className="absolute w-3.5 h-3.5 text-white left-[3px] top-[3px] pointer-events-none opacity-0 peer-checked:opacity-100 stroke-[3]" />
                    </div>
                    <div className="flex-1">
                      <h3 className={`font-semibold text-slate-900 mb-1 transition-colors ${isEditing ? 'group-hover:text-[#1e3a8a]' : ''}`}>{t.preference}</h3>
                      <p className="text-sm text-slate-600">{t.preferenceDesc}</p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-slate-200 bg-white flex items-center gap-4">
                {isEditing ? (
                  <>
                    <button
                      onClick={handleReset}
                      className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-semibold hover:bg-slate-50 hover:border-slate-400 transition-colors"
                    >
                      {t.reset}
                    </button>
                    <button
                      onClick={handleSave}
                      className="flex-1 px-4 py-2.5 rounded-xl bg-[#1e3a8a] text-white font-semibold hover:bg-blue-800 shadow-sm transition-colors"
                    >
                      {t.save}
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="w-full px-4 py-2.5 rounded-xl border-2 border-[#1e3a8a] text-[#1e3a8a] font-semibold hover:bg-slate-50 transition-colors"
                  >
                    {t.edit}
                  </button>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
