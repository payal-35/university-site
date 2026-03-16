/* =================================================================
   consent.js — Core Consent Logic for Admissions/Form Page
   =================================================================
   FLOW:
   1. DOMContentLoaded → load ARC form purposes (with auth header)
   2. Any form field input → update banner data list in real time
                           → if email already consented → auto-grant, skip banner
                           → else → show banner
   3. "Accept All" → save to localStorage FIRST (guaranteed)
                   → then try ARC API (best-effort, non-blocking)
                   → unlock submit button
   4. "Decline"    → hide banner, keep submit disabled
   5. Form submit  → validate → show success modal
   ================================================================= */

(function () {
  'use strict';

  /* ─── ARC API CONFIG ─────────────────────────────────────────── */
  const ARC_TOKEN = 'arc_live_cbb9cecb070b6ebeda1ba066bb9beacd';
  const FORM_TOKEN = '588579c793ebace6b6cfe223c394781a';
  const API_BASE = 'https://arcompli.com/api/v1';

  /* ─── STATE ──────────────────────────────────────────────────── */
  let arcPurposes = [];
  let bannerVisible = false;
  let consentGranted = false;

  /* ─── DOM REFS ────────────────────────────────────────────────── */
  let form, banner, bannerDataList, acceptBtn, declineBtn,
    submitBtn, consentStatus, nameField, emailField, phoneField,
    programField, messageField;

  /* ─── INIT ───────────────────────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', async () => {
    form = document.getElementById('admissionsForm');
    banner = document.getElementById('cookieBanner');
    bannerDataList = document.getElementById('bannerDataList');
    acceptBtn = document.getElementById('acceptCookies');
    declineBtn = document.getElementById('declineCookies');
    submitBtn = document.getElementById('formSubmitBtn');
    consentStatus = document.getElementById('consentStatus');
    nameField = document.getElementById('fullName');
    emailField = document.getElementById('email');
    phoneField = document.getElementById('phone');
    programField = document.getElementById('program');
    messageField = document.getElementById('message');

    // Guard: log if banner element is missing
    if (!banner) {
      console.error('[Consent] CRITICAL: #cookieBanner element not found in DOM!');
    }

    await loadArcPurposes();
    bindFormInputs();

    if (acceptBtn) acceptBtn.addEventListener('click', handleAccept);
    if (declineBtn) declineBtn.addEventListener('click', handleDecline);
    if (form) form.addEventListener('submit', handleFormSubmit);

    const closeBannerBtn = document.getElementById('closeBanner');
    if (closeBannerBtn) closeBannerBtn.addEventListener('click', handleDecline);
  });

  /* ─── LOAD ARC FORM PURPOSES ─────────────────────────────────── */
  async function loadArcPurposes() {
    try {
      const resp = await fetch(`${API_BASE}/forms/${FORM_TOKEN}`, {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Authorization': `Bearer ${ARC_TOKEN}`,
          'Content-Type': 'application/json'
        }
      });
      if (!resp.ok) throw new Error(`HTTP ${resp.status}: ${await resp.text()}`);
      const data = await resp.json();
      arcPurposes = data.purposes || data.data?.purposes || [];
      console.log('[Consent] Loaded', arcPurposes.length, 'ARC purposes:', arcPurposes);
    } catch (err) {
      console.warn('[Consent] Could not load ARC purposes (using fallback):', err.message);
      arcPurposes = [
        { id: 'b18e5ff7-f3eb-4f7e-9a08-c34198031031', name: 'Communication' },
      ];
    }
  }

  /* ─── BIND FORM INPUT LISTENERS ─────────────────────────────── */
  function bindFormInputs() {
    [nameField, emailField, phoneField, programField, messageField].forEach(f => {
      if (!f) return;
      f.addEventListener('input', handleAnyInput);
      f.addEventListener('change', handleAnyInput);
    });
  }

  /* ─── ON ANY FORM INPUT ─────────────────────────────────────── */
  function handleAnyInput() {
    updateBannerData();

    if (consentGranted) return; // already accepted, no need to show banner

    const emailVal = emailField ? emailField.value.trim() : '';
    if (emailVal && isEmailAlreadyConsented(emailVal)) {
      grantConsentSilently(emailVal);
      return;
    }

    const hasAnyInput = [nameField, emailField, phoneField, messageField]
      .some(f => f && f.value.trim() !== '');

    if (hasAnyInput && !bannerVisible) {
      showBanner();
    }
  }

  /* ─── UPDATE BANNER DATA LIST ─────────────────────────────────── */
  function updateBannerData() {
    if (!bannerDataList) return;
    const rows = [];

    const name = nameField?.value.trim();
    const email = emailField?.value.trim();
    const phone = phoneField?.value.trim();
    const program = programField?.value.trim();

    if (name) rows.push(`<li><span class="bd-label">Full Name:</span>     <span class="bd-value">${escapeHtml(name)}</span></li>`);
    if (email) rows.push(`<li><span class="bd-label">Email Address:</span> <span class="bd-value">${escapeHtml(email)}</span></li>`);
    if (phone) rows.push(`<li><span class="bd-label">Phone Number:</span>  <span class="bd-value">${escapeHtml(phone)}</span></li>`);
    if (program) rows.push(`<li><span class="bd-label">Program:</span>       <span class="bd-value">${escapeHtml(program)}</span></li>`);

    bannerDataList.innerHTML = rows.length
      ? rows.join('')
      : '<li class="bd-empty">Fill in the form to see data reflected here\u2026</li>';
  }

  /* ─── SHOW / HIDE BANNER ─────────────────────────────────────── */
  function showBanner() {
    if (!banner) {
      console.warn('[Consent] Cannot show banner — #cookieBanner element is missing from HTML!');
      return;
    }
    banner.classList.add('visible');
    bannerVisible = true;
  }

  function hideBanner() {
    if (!banner) return;
    banner.classList.remove('visible');
    bannerVisible = false;
  }

  /* ─── ACCEPT ALL ─────────────────────────────────────────────── */
  async function handleAccept() {
    const emailVal = emailField?.value.trim() || 'unknown@greenfield.edu';

    // Disable button + show loading state
    if (acceptBtn) {
      acceptBtn.disabled = true;
      acceptBtn.textContent = 'Processing\u2026';
    }

    // 1. Save to localStorage FIRST — this is guaranteed, API failure won't affect it
    saveConsentToLocalStorage(emailVal);

    // 2. Try ARC API (best-effort — we don't block on failure)
    try {
      await postConsentToArc(emailVal);
      console.log('[Consent] ✅ ARC API consent POST succeeded for:', emailVal);
    } catch (err) {
      console.group('%c[Consent] ❌ ARC API POST Failed', 'color:red;font-weight:bold;');
      console.error('Message   :', err.message);
      console.error('Email     :', emailVal);
      console.error('Form Token:', FORM_TOKEN);
      console.error('API Base  :', API_BASE);
      console.error('Full error:', err);
      console.groupEnd();
      console.info('[Consent] ℹ️  Consent was still saved to localStorage successfully.');
    }

    // 3. Grant consent in the UI regardless of API outcome
    grantConsentUI(emailVal);
    hideBanner();
  }

  /* ─── DECLINE ─────────────────────────────────────────────────── */
  function handleDecline() {
    hideBanner();
    if (consentStatus) {
      consentStatus.textContent = '';
      consentStatus.className = 'consent-status';
    }
  }

  /* ─── POST CONSENT TO ARC API ─────────────────────────────────── */
  async function postConsentToArc(email) {
    const body = {
      form_token: FORM_TOKEN,
      subject_email: email,
      consents: arcPurposes.map(p => ({ purpose_id: p.id, granted: true }))
    };

    console.log('[Consent] POST /consent body:', JSON.stringify(body, null, 2));

    const resp = await fetch(`${API_BASE}/consent`, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Authorization': `Bearer ${ARC_TOKEN}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(body)
    });

    const txt = await resp.text();
    console.log('[Consent] ARC API response:', resp.status, txt);

    if (!resp.ok) {
      throw new Error(`${resp.status}: ${txt}`);
    }

    try { return JSON.parse(txt); } catch { return {}; }
  }

  /* ─── GRANT CONSENT UI ────────────────────────────────────────── */
  function grantConsentUI(email) {
    consentGranted = true;

    if (consentStatus) {
      consentStatus.innerHTML = '\u25cf Email consent granted \u2713';
      consentStatus.className = 'consent-status granted';
    }

    if (submitBtn) {
      submitBtn.style.display = 'flex';
      submitBtn.disabled = false;
      submitBtn.classList.add('enabled');
    }

    if (acceptBtn) acceptBtn.textContent = 'Consented \u2713';
  }

  /* ─── SILENT GRANT (email already consented) ─────────────────── */
  function grantConsentSilently(email) {
    if (consentGranted) return;
    hideBanner();
    grantConsentUI(email);
    console.log('[Consent] Email already consented \u2014 banner skipped for:', email);
  }

  /* ─── FORM SUBMIT ─────────────────────────────────────────────── */
  function handleFormSubmit(e) {
    e.preventDefault();
    if (!consentGranted) return;

    const name = nameField?.value.trim();
    const email = emailField?.value.trim();
    const program = programField?.value.trim();

    if (!name || !email || !program) {
      alert('Please fill in all required fields.');
      return;
    }

    showSuccessModal(name, email);
    form.reset();
    consentGranted = false;
    bannerVisible = false;

    if (submitBtn) { submitBtn.style.display = 'none'; submitBtn.disabled = true; submitBtn.classList.remove('enabled'); }
    if (consentStatus) { consentStatus.textContent = ''; consentStatus.className = 'consent-status'; }
    if (acceptBtn) { acceptBtn.disabled = false; acceptBtn.textContent = 'I Consent \u2713'; }

    updateBannerData();
  }

  /* ─── SUCCESS MODAL ───────────────────────────────────────────── */
  function showSuccessModal(name, email) {
    const modal = document.getElementById('successModal');
    const msg = document.getElementById('successMsg');
    if (msg) msg.innerHTML = `
      <strong>${escapeHtml(name)}</strong>, your application has been submitted!<br>
      We\u2019ll send a confirmation to <strong>${escapeHtml(email)}</strong> shortly.<br><br>
      <span style="color:var(--teal-dark);font-size:.87rem;">\u25cf Email consent recorded in our system.</span>
    `;
    if (modal) {
      modal.style.display = 'flex';
      const closeBtn = modal.querySelector('.modal-close');
      if (closeBtn) {
        // Remove previous listeners to avoid stacking
        const newClose = closeBtn.cloneNode(true);
        closeBtn.parentNode.replaceChild(newClose, closeBtn);
        newClose.addEventListener('click', () => { modal.style.display = 'none'; });
      }
    }
  }

  /* ─── LOCALSTORAGE ────────────────────────────────────────────── */
  function isEmailAlreadyConsented(email) {
    return getConsentedEmails().some(e => e.email.toLowerCase() === email.toLowerCase());
  }

  function saveConsentToLocalStorage(email) {
    // Deduplicated list of consented emails
    const list = getConsentedEmails();
    if (!list.some(e => e.email.toLowerCase() === email.toLowerCase())) {
      list.push({ email, date: Date.now(), purpose: 'Communication' });
      localStorage.setItem('gu_consented_emails', JSON.stringify(list));
    }

    // Always log to history (even repeat consents)
    const history = getConsentHistory();
    history.push({ type: 'granted', email, timestamp: Date.now(), purpose: 'Communication' });
    localStorage.setItem('gu_consent_history', JSON.stringify(history));

    console.log('[Consent] \ud83d\udce6 Saved to localStorage:', email);
  }

  function getConsentedEmails() {
    try { return JSON.parse(localStorage.getItem('gu_consented_emails') || '[]'); } catch { return []; }
  }

  function getConsentHistory() {
    try { return JSON.parse(localStorage.getItem('gu_consent_history') || '[]'); } catch { return []; }
  }

  /* ─── UTIL ────────────────────────────────────────────────────── */
  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

})();
