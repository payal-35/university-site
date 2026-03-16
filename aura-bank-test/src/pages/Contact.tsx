import { motion, AnimatePresence } from "motion/react";
import { Mail, MapPin, Phone, Send, Shield, X, AlertCircle, CheckCircle2, Check } from "lucide-react";
import React, { useState, useEffect } from "react";

function EmailPreferencesForm({ email }: { email: string }) {
  const [alreadyExists, setAlreadyExists] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [cookiePrefs, setCookiePrefs] = useState({
    analytics: false,
    marketing: false,
    preference: false,
  });
  const [emailPrefs, setEmailPrefs] = useState({
    notifications: true,
    promotional: false,
    financial: true,
    security: true,
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const savedUserPrefs = localStorage.getItem(`user_prefs_${email}`);
    if (savedUserPrefs) {
      try {
        const parsed = JSON.parse(savedUserPrefs);
        setCookiePrefs(parsed.cookiePreferences || cookiePrefs);
        setEmailPrefs(parsed.emailPreferences || emailPrefs);
        setAlreadyExists(true);
        setIsEditing(false);
      } catch (e) {}
    } else {
      setAlreadyExists(false);
      setIsEditing(true);
      const loadPrefs = () => {
        const savedPrefs = localStorage.getItem('bank_cookie_preferences');
        if (savedPrefs) {
          try {
            setCookiePrefs(JSON.parse(savedPrefs));
          } catch (e) {}
        }
      };
      loadPrefs();
      window.addEventListener('preferencesUpdated', loadPrefs);
      return () => window.removeEventListener('preferencesUpdated', loadPrefs);
    }
  }, [email]);

  const handleCookieToggle = (key: keyof typeof cookiePrefs) => {
    if (!isEditing) return;
    setCookiePrefs(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleEmailToggle = (key: keyof typeof emailPrefs) => {
    if (!isEditing) return;
    setEmailPrefs(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = async () => {
    try {
      // 1. Load form purposes
      const formResponse = await fetch('https://arcompli.com/api/v1/forms/3b425527455a76afa6d4d5c48a192e64');
      const form = await formResponse.json();

      // 2. Record consent
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
            // Map our specific cookie preferences to the purposes, defaulting to true
            let granted = true;
            const name = (p.name || '').toLowerCase();
            if (name.includes('analytic')) granted = cookiePrefs.analytics;
            else if (name.includes('marketing')) granted = cookiePrefs.marketing;
            else if (name.includes('preference')) granted = cookiePrefs.preference;
            return { purpose_id: p.id, granted };
          }),
        }),
      });
    } catch (error) {
      console.error("Failed to record consent with arcompli API:", error);
    }
    
    const finalData = {
      email,
      cookiePreferences: cookiePrefs,
      emailPreferences: emailPrefs,
    };
    
    console.log("Saving preferences:", finalData);
    localStorage.setItem(`user_prefs_${email}`, JSON.stringify(finalData));
    
    // Save to global cookie preferences so the Settings popup picks it up
    localStorage.setItem('bank_cookie_preferences', JSON.stringify(cookiePrefs));
    localStorage.setItem('bank_user_email', email);
    window.dispatchEvent(new Event('preferencesUpdated'));

    setSaved(true);
    setIsEditing(false);
    setAlreadyExists(true);
  };

  if (saved && !isEditing) {
    return (
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-center">
        <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-bold text-slate-900 mb-2">Preferences Saved</h3>
        <p className="text-slate-600 text-sm mb-6">Your communication and privacy preferences have been updated successfully.</p>
        <button
          onClick={() => { setSaved(false); setIsEditing(true); }}
          className="px-6 py-2.5 bg-slate-100 text-slate-700 rounded-xl font-semibold hover:bg-slate-200 transition-colors"
        >
          Edit Preferences
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm text-left">
      <h3 className="text-xl font-bold text-slate-900 mb-3">
        {isEditing ? "Communication Preferences" : "Saved Preferences"}
      </h3>
      <p className="text-sm text-slate-600 mb-6">
        {isEditing 
          ? "Please review your privacy settings and select how you'd like us to communicate with you."
          : `Here are the preferences saved for ${email}.`}
      </p>

      <div className="space-y-8">
        {/* Detailed Cookie Preferences */}
        <div className="space-y-6">
          <h4 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">Privacy Settings</h4>
          
          {/* Necessary Cookies */}
          <div className="flex items-start gap-4 bg-white">
            <div className="mt-0.5 text-[#1e3a8a] shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-slate-900 mb-1">Necessary Cookies <span className="text-red-500">*</span></h3>
              <p className="text-sm text-slate-600">Required for secure login, transactions, and core banking services.</p>
            </div>
          </div>

          {/* Analytics Cookies */}
          <label className={`flex items-start gap-4 bg-white ${isEditing ? 'cursor-pointer group' : 'cursor-default'}`}>
            <div className="relative flex items-center mt-0.5 shrink-0">
              <input
                type="checkbox"
                checked={cookiePrefs.analytics}
                onChange={() => handleCookieToggle('analytics')}
                disabled={!isEditing}
                className={`peer appearance-none w-5 h-5 border border-slate-300 rounded checked:bg-[#1e3a8a] checked:border-[#1e3a8a] transition-all ${isEditing ? 'cursor-pointer' : 'cursor-default opacity-70'}`}
              />
              <Check className="absolute w-3.5 h-3.5 text-white left-[3px] top-[3px] pointer-events-none opacity-0 peer-checked:opacity-100 stroke-[3]" />
            </div>
            <div className="flex-1">
              <h3 className={`font-semibold text-slate-900 mb-1 transition-colors ${isEditing ? 'group-hover:text-[#1e3a8a]' : ''}`}>Analytics Cookies</h3>
              <p className="text-sm text-slate-600">Help us understand how customers interact with our banking services.</p>
            </div>
          </label>

          {/* Marketing Cookies */}
          <label className={`flex items-start gap-4 bg-white ${isEditing ? 'cursor-pointer group' : 'cursor-default'}`}>
            <div className="relative flex items-center mt-0.5 shrink-0">
              <input
                type="checkbox"
                checked={cookiePrefs.marketing}
                onChange={() => handleCookieToggle('marketing')}
                disabled={!isEditing}
                className={`peer appearance-none w-5 h-5 border border-slate-300 rounded checked:bg-[#1e3a8a] checked:border-[#1e3a8a] transition-all ${isEditing ? 'cursor-pointer' : 'cursor-default opacity-70'}`}
              />
              <Check className="absolute w-3.5 h-3.5 text-white left-[3px] top-[3px] pointer-events-none opacity-0 peer-checked:opacity-100 stroke-[3]" />
            </div>
            <div className="flex-1">
              <h3 className={`font-semibold text-slate-900 mb-1 transition-colors ${isEditing ? 'group-hover:text-[#1e3a8a]' : ''}`}>Marketing Cookies</h3>
              <p className="text-sm text-slate-600">Used to send banking offers, loan promotions, and financial product updates.</p>
            </div>
          </label>

          {/* Preference Cookies */}
          <label className={`flex items-start gap-4 bg-white ${isEditing ? 'cursor-pointer group' : 'cursor-default'}`}>
            <div className="relative flex items-center mt-0.5 shrink-0">
              <input
                type="checkbox"
                checked={cookiePrefs.preference}
                onChange={() => handleCookieToggle('preference')}
                disabled={!isEditing}
                className={`peer appearance-none w-5 h-5 border border-slate-300 rounded checked:bg-[#1e3a8a] checked:border-[#1e3a8a] transition-all ${isEditing ? 'cursor-pointer' : 'cursor-default opacity-70'}`}
              />
              <Check className="absolute w-3.5 h-3.5 text-white left-[3px] top-[3px] pointer-events-none opacity-0 peer-checked:opacity-100 stroke-[3]" />
            </div>
            <div className="flex-1">
              <h3 className={`font-semibold text-slate-900 mb-1 transition-colors ${isEditing ? 'group-hover:text-[#1e3a8a]' : ''}`}>Preference Cookies</h3>
              <p className="text-sm text-slate-600">Remember user settings such as language and dashboard preferences.</p>
            </div>
          </label>
        </div>

        {/* Email Preferences */}
        <div className="space-y-4">
          <h4 className="text-sm font-bold text-slate-900 mb-2 border-b border-slate-100 pb-2">Email Subscriptions</h4>
          
          <label className={`flex items-center gap-3 ${isEditing ? 'cursor-pointer group' : 'cursor-default'}`}>
            <div className="relative flex items-center">
              <input type="checkbox" checked={emailPrefs.notifications} onChange={() => handleEmailToggle('notifications')} disabled={!isEditing} className={`peer appearance-none w-5 h-5 border border-slate-300 rounded checked:bg-[#111827] checked:border-[#111827] transition-all ${isEditing ? 'cursor-pointer' : 'cursor-default opacity-70'}`} />
              <Check className="absolute w-3.5 h-3.5 text-white left-[3px] top-[3px] pointer-events-none opacity-0 peer-checked:opacity-100 stroke-[3]" />
            </div>
            <span className={`text-sm text-slate-600 ${isEditing ? 'group-hover:text-slate-900' : ''}`}>Account Notifications</span>
          </label>
          
          <label className={`flex items-center gap-3 ${isEditing ? 'cursor-pointer group' : 'cursor-default'}`}>
            <div className="relative flex items-center">
              <input type="checkbox" checked={emailPrefs.promotional} onChange={() => handleEmailToggle('promotional')} disabled={!isEditing} className={`peer appearance-none w-5 h-5 border border-slate-300 rounded checked:bg-[#111827] checked:border-[#111827] transition-all ${isEditing ? 'cursor-pointer' : 'cursor-default opacity-70'}`} />
              <Check className="absolute w-3.5 h-3.5 text-white left-[3px] top-[3px] pointer-events-none opacity-0 peer-checked:opacity-100 stroke-[3]" />
            </div>
            <span className={`text-sm text-slate-600 ${isEditing ? 'group-hover:text-slate-900' : ''}`}>Promotional Offers & Loans</span>
          </label>
          
          <label className={`flex items-center gap-3 ${isEditing ? 'cursor-pointer group' : 'cursor-default'}`}>
            <div className="relative flex items-center">
              <input type="checkbox" checked={emailPrefs.financial} onChange={() => handleEmailToggle('financial')} disabled={!isEditing} className={`peer appearance-none w-5 h-5 border border-slate-300 rounded checked:bg-[#111827] checked:border-[#111827] transition-all ${isEditing ? 'cursor-pointer' : 'cursor-default opacity-70'}`} />
              <Check className="absolute w-3.5 h-3.5 text-white left-[3px] top-[3px] pointer-events-none opacity-0 peer-checked:opacity-100 stroke-[3]" />
            </div>
            <span className={`text-sm text-slate-600 ${isEditing ? 'group-hover:text-slate-900' : ''}`}>Financial Updates & News</span>
          </label>
          
          <label className="flex items-center gap-3 cursor-not-allowed group">
            <div className="relative flex items-center">
              <input type="checkbox" checked={emailPrefs.security} disabled className="peer appearance-none w-5 h-5 border border-slate-200 rounded bg-slate-200 checked:bg-slate-200 checked:border-slate-200 cursor-not-allowed" />
              <Check className="absolute w-3.5 h-3.5 text-white left-[3px] top-[3px] pointer-events-none opacity-100 stroke-[3]" />
            </div>
            <span className="text-sm text-slate-400">Security Alerts (Required)</span>
          </label>
        </div>

        {isEditing ? (
          <button
            onClick={handleSave}
            className="w-full bg-[#111827] text-white py-3.5 rounded-xl font-semibold hover:bg-slate-800 transition-colors mt-2"
          >
            Save Preferences
          </button>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="w-full bg-white border-2 border-[#111827] text-[#111827] py-3.5 rounded-xl font-semibold hover:bg-slate-50 transition-colors mt-2"
          >
            Edit Preferences
          </button>
        )}
      </div>
    </div>
  );
}

export default function Contact() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [submittedEmail, setSubmittedEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [showConsentBanner, setShowConsentBanner] = useState(false);
  const [consentGranted, setConsentGranted] = useState(false);

  useEffect(() => {
    const email = formData.email.trim();
    const name = formData.name.trim();

    if (email) {
      const hasConsent = localStorage.getItem(`consent_granted_${email}`);
      if (hasConsent === 'true') {
        setConsentGranted(true);
        setShowConsentBanner(false);
        return;
      }
    }

    setConsentGranted(false);

    if (email.length > 0 || name.length > 0) {
      setShowConsentBanner(true);
    } else {
      setShowConsentBanner(false);
    }
  }, [formData.email, formData.name]);

  const handleAcceptConsent = async () => {
    try {
      // 1. Load form purposes
      const formResponse = await fetch('https://arcompli.com/api/v1/forms/6778f25c013dc03d5da3bc74379d735e');
      const form = await formResponse.json();

      // 2. Record consent
      await fetch('https://arcompli.com/api/v1/consent', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer arc_live_...',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          form_token: '6778f25c013dc03d5da3bc74379d735e',
          subject_email: formData.email || 'user@example.com',
          consents: form.purposes.map((p: any) => ({ purpose_id: p.id, granted: true })),
        }),
      });
    } catch (error) {
      console.error("Failed to record consent:", error);
    }

    localStorage.setItem(`consent_granted_${formData.email.trim()}`, 'true');
    setConsentGranted(true);
    setShowConsentBanner(false);
  };

  const handleDeclineConsent = () => {
    setShowConsentBanner(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!consentGranted) return;
    
    setStatus("loading");
    setSubmittedEmail(formData.email);
    localStorage.setItem('last_used_email', formData.email.trim());

    try {
      // 1. Load form purposes
      try {
        const form = await fetch('https://arcompli.com/api/v1/forms/3b425527455a76afa6d4d5c48a192e64').then(r => r.json());

        // 2. Record consent
        await fetch('https://arcompli.com/api/v1/consent', {
          method: 'POST',
          headers: {
            'Authorization': 'Bearer arc_live_...',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            form_token: '3b425527455a76afa6d4d5c48a192e64',
            subject_email: formData.email,
            consents: form.purposes.map((p: any) => ({ purpose_id: p.id, granted: true })),
          }),
        });
      } catch (consentError) {
        console.error("Failed to record arcompli consent:", consentError);
      }

      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setStatus("success");
        setFormData({ name: "", email: "", message: "" });
        setConsentGranted(false);
      } else {
        setStatus("error");
      }
    } catch (error) {
      setStatus("error");
    }
  };

  return (
    <div className="w-full bg-slate-50 py-24 sm:py-32 relative overflow-hidden">
      {/* Corporate Background Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] -right-[10%] w-[50%] h-[50%] rounded-full bg-blue-100/50 blur-3xl mix-blend-multiply" />
        <div className="absolute bottom-[10%] -left-[10%] w-[50%] h-[50%] rounded-full bg-red-100/30 blur-3xl mix-blend-multiply" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-blue-900 mb-6">
              Get in touch
            </h1>
            <p className="text-lg text-slate-600 mb-12 leading-relaxed">
              Whether you have a question about our products, pricing, or anything else, our team is ready to answer all your questions.
            </p>

            <div className="space-y-8">
              <div className="flex items-start gap-4 group">
                <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100 text-blue-900 group-hover:scale-110 group-hover:shadow-md transition-all">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-1">Headquarters</h3>
                  <p className="text-slate-600">
                    123 Financial District<br />
                    Mumbai, MH 400001
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 group">
                <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100 text-red-600 group-hover:scale-110 group-hover:shadow-md transition-all">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-1">Phone</h3>
                  <p className="text-slate-600">
                    1800 123 4567<br />
                    Mon-Fri from 8am to 5pm
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 group">
                <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100 text-blue-600 group-hover:scale-110 group-hover:shadow-md transition-all">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-1">Email</h3>
                  <p className="text-slate-600">
                    support@aurabank.com<br />
                    We'll respond within 24 hours
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white p-8 sm:p-10 rounded-[2.5rem] shadow-xl shadow-blue-900/5 border border-slate-100 relative"
          >
            <div className="absolute top-0 left-0 w-full h-2 bg-blue-900 rounded-t-[2.5rem]" />
            <form onSubmit={handleSubmit} className="space-y-6 mt-2">
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-slate-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-900 focus:border-blue-900 outline-none transition-all bg-slate-50 focus:bg-white"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-900 focus:border-blue-900 outline-none transition-all bg-slate-50 focus:bg-white"
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-semibold text-slate-700 mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-900 focus:border-blue-900 outline-none transition-all bg-slate-50 focus:bg-white resize-none"
                  placeholder="How can we help you?"
                />
              </div>

              <div className="flex flex-col items-center gap-4 pt-4">
                <button
                  type="submit"
                  disabled={!consentGranted || status === "loading"}
                  className="w-full inline-flex justify-center items-center gap-2 bg-blue-900 text-white px-8 py-4 rounded-xl text-base font-bold hover:bg-blue-800 hover:shadow-lg hover:shadow-blue-900/20 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:hover:scale-100 disabled:cursor-not-allowed"
                >
                  {status === "loading" ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      Send Message <Send className="w-4 h-4" />
                    </>
                  )}
                </button>

                <div className="flex items-center gap-2 text-sm font-medium">
                  {consentGranted ? (
                    <>
                      <div className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span className="text-emerald-600">Email Consent Granted ✓</span>
                    </>
                  ) : (
                    <>
                      <div className="w-2 h-2 rounded-full bg-red-500" />
                      <span className="text-red-500">Email consent required for submission</span>
                    </>
                  )}
                </div>
              </div>

              {status === "success" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <p className="text-emerald-600 text-sm font-semibold text-center bg-emerald-50 py-3 rounded-xl border border-emerald-100">
                    Message sent successfully! We'll be in touch soon.
                  </p>
                  
                  <EmailPreferencesForm email={submittedEmail} />
                </motion.div>
              )}

              {status === "error" && (
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-600 text-sm font-semibold text-center bg-red-50 py-3 rounded-xl border border-red-100"
                >
                  Something went wrong. Please try again later.
                </motion.p>
              )}
            </form>
          </motion.div>
        </div>
      </div>

      {/* Consent Banner */}
      <AnimatePresence>
        {showConsentBanner && (
          <motion.div 
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 right-0 bg-white border-t-4 border-blue-900 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] z-50"
          >
            <div className="max-w-7xl mx-auto p-6 md:p-8 flex flex-col md:flex-row gap-8 items-start md:items-center justify-between">
              <div className="flex gap-5 items-start flex-1">
                <div className="mt-1">
                  <Shield className="w-7 h-7 text-blue-900" />
                </div>
                <div className="space-y-4 flex-1">
                  <h3 className="font-bold text-blue-950 text-xl tracking-tight">Secure Email Communication Authorization</h3>
                  <p className="text-sm text-slate-600 leading-relaxed max-w-3xl">
                    To proceed with your request, we require your authorization to use your provided information for secure communication regarding your banking inquiry, account services, or related updates.
                  </p>
                  <div className="bg-slate-50 p-5 rounded-lg border border-slate-200">
                    <p className="text-sm font-semibold text-slate-800 mb-3">Information to be processed with your authorization:</p>
                    <div className="space-y-2.5">
                      <div className="flex items-center gap-3 text-sm text-slate-700">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-900" />
                        <span className="font-medium">Full Name:</span> 
                        <span className="font-mono bg-white border border-slate-200 px-2 py-0.5 rounded text-slate-800">{formData.name || "..."}</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-slate-700">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-900" />
                        <span className="font-medium">Email Address:</span> 
                        <span className="font-mono bg-white border border-slate-200 px-2 py-0.5 rounded text-slate-800">{formData.email || "..."}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <AlertCircle className="w-4 h-4 text-blue-900/60" />
                    <p>Your information will be handled securely in accordance with our privacy and data protection policies.</p>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto justify-end shrink-0">
                <button 
                  onClick={handleDeclineConsent}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-lg border border-slate-300 text-slate-700 font-semibold hover:bg-slate-50 transition-colors"
                >
                  Decline
                </button>
                <button 
                  onClick={handleAcceptConsent}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-blue-900 text-white font-semibold hover:bg-blue-800 shadow-sm transition-colors"
                >
                  Authorize / Accept
                </button>
                <button onClick={() => setShowConsentBanner(false)} className="hidden sm:block p-2 text-slate-400 hover:text-slate-600 ml-2">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
