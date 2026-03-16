/* ==========================================================
   settings.js — Settings Panel Logic (all pages)
   ========================================================== */

(function () {
  'use strict';

  /* ── Inject Settings Button & Panel HTML ─────────────── */
  function injectSettingsUI() {
    const btn = document.createElement('button');
    btn.className = 'settings-btn';
    btn.id = 'settingsBtn';
    btn.title = 'Privacy Settings';
    btn.innerHTML = '⚙';
    btn.setAttribute('aria-label', 'Open privacy settings');
    document.body.appendChild(btn);

    const panel = document.createElement('div');
    panel.className = 'settings-panel';
    panel.id = 'settingsPanel';
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-label', 'Privacy Settings Panel');
    panel.innerHTML = `
      <h3>🔒 Privacy &amp; Cookie Settings</h3>

      <!-- Cookie Type Toggles -->
      <div class="settings-section">
        <h4>Cookie Preferences</h4>
        <div class="cookie-toggle">
          <input type="checkbox" id="ct-analytics" checked>
          <div>
            <label for="ct-analytics">Analytics Cookies</label>
            <div class="ct-desc">Help us understand how you use our site</div>
          </div>
        </div>
        <div class="cookie-toggle">
          <input type="checkbox" id="ct-marketing">
          <div>
            <label for="ct-marketing">Marketing Cookies</label>
            <div class="ct-desc">Used for targeted advertising and promotions</div>
          </div>
        </div>
        <div class="cookie-toggle">
          <input type="checkbox" id="ct-preference">
          <div>
            <label for="ct-preference">Preference Cookies</label>
            <div class="ct-desc">Remember your settings and preferences</div>
          </div>
        </div>
      </div>

      <!-- Consented Emails -->
      <div class="settings-section">
        <h4>Email Communication Consent</h4>
        <div id="consentedEmailsList">
          <p class="empty-state">No active consents yet.</p>
        </div>
      </div>

      <!-- Consent History -->
      <div class="settings-section">
        <h4>Consent History</h4>
        <div id="consentHistoryList" class="consent-history-list">
          <p class="empty-state">No history recorded yet.</p>
        </div>
        <button class="export-csv-btn" id="exportCsvBtn">⬇ Export Full History (CSV)</button>
      </div>
    `;
    document.body.appendChild(panel);
  }

  /* ── Toggle Panel ─────────────────────────────────────── */
  function bindToggle() {
    const btn   = document.getElementById('settingsBtn');
    const panel = document.getElementById('settingsPanel');

    btn.addEventListener('click', () => {
      const isOpen = panel.classList.contains('open');
      if (!isOpen) {
        refreshPanel();
        panel.classList.add('open');
        btn.style.transform = 'rotate(60deg)';
      } else {
        panel.classList.remove('open');
        btn.style.transform = '';
      }
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!panel.contains(e.target) && e.target !== btn) {
        panel.classList.remove('open');
        btn.style.transform = '';
      }
    });
  }

  /* ── Refresh Panel Data from localStorage ─────────────── */
  function refreshPanel() {
    renderConsentedEmails();
    renderConsentHistory();
  }

  /* ── Render Consented Emails ──────────────────────────── */
  function renderConsentedEmails() {
    const container = document.getElementById('consentedEmailsList');
    const emails    = getConsentedEmails();  // array of { email, date, purpose }

    if (!emails.length) {
      container.innerHTML = '<p class="empty-state">No active consents yet.</p>';
      return;
    }

    container.innerHTML = emails.map((entry, idx) => `
      <div class="consent-email-card" id="email-card-${idx}">
        <div class="email-addr">${escapeHtml(entry.email)}</div>
        <div class="email-status">✓ Active consent since ${formatDate(entry.date)}</div>
        <div class="email-meta">Purpose: ${escapeHtml(entry.purpose || 'Marketing and product updates')}</div>
        <div class="email-meta">Recent Activity: Consented &nbsp;&nbsp; ${formatDate(entry.date)}</div>
        <button class="revoke-btn" data-email="${escapeHtml(entry.email)}">Revoke</button>
      </div>
    `).join('');

    // Bind revoke buttons
    container.querySelectorAll('.revoke-btn').forEach(rBtn => {
      rBtn.addEventListener('click', () => {
        revokeConsent(rBtn.dataset.email);
        refreshPanel();
      });
    });
  }

  /* ── Render Consent History ───────────────────────────── */
  function renderConsentHistory() {
    const container = document.getElementById('consentHistoryList');
    const history   = getConsentHistory();  // array of { type, email, timestamp }

    if (!history.length) {
      container.innerHTML = '<p class="empty-state">No history recorded yet.</p>';
      return;
    }

    container.innerHTML = `
      <div class="consent-history-list">
        ${history.slice().reverse().map(h => `
          <div class="history-entry">
            <div>
              <span class="he-type">granted (email)</span>
              <div class="he-email">${escapeHtml(h.email)}</div>
            </div>
            <span class="he-time">${formatDateTime(h.timestamp)}</span>
          </div>
        `).join('')}
      </div>
    `;
  }

  /* ── Export CSV ───────────────────────────────────────── */
  function bindExportCsv() {
    document.getElementById('exportCsvBtn').addEventListener('click', () => {
      const history = getConsentHistory();
      if (!history.length) { alert('No consent history to export.'); return; }

      const rows = [
        ['Type', 'Email', 'Timestamp', 'Purpose'],
        ...history.map(h => [
          'granted (email)',
          h.email,
          formatDateTime(h.timestamp),
          h.purpose || 'Marketing and product updates'
        ])
      ];

      const csv  = rows.map(r => r.map(c => `"${c}"`).join(',')).join('\n');
      const blob = new Blob([csv], { type: 'text/csv' });
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement('a');
      a.href     = url;
      a.download = `consent_history_${Date.now()}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    });
  }

  /* ── LocalStorage Helpers ─────────────────────────────── */
  function getConsentedEmails() {
    try { return JSON.parse(localStorage.getItem('gu_consented_emails') || '[]'); }
    catch { return []; }
  }

  function getConsentHistory() {
    try { return JSON.parse(localStorage.getItem('gu_consent_history') || '[]'); }
    catch { return []; }
  }

  function revokeConsent(email) {
    const emails = getConsentedEmails().filter(e => e.email !== email);
    localStorage.setItem('gu_consented_emails', JSON.stringify(emails));

    // Add revoke to history
    const history = getConsentHistory();
    history.push({ type: 'revoked', email, timestamp: Date.now(), purpose: 'Marketing and product updates' });
    localStorage.setItem('gu_consent_history', JSON.stringify(history));
  }

  /* ── Utility ──────────────────────────────────────────── */
  function formatDate(ts) {
    if (!ts) return '—';
    return new Date(ts).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  }
  function formatDateTime(ts) {
    if (!ts) return '—';
    return new Date(ts).toLocaleString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  }
  function escapeHtml(str) {
    return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  /* ── Init ─────────────────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', () => {
    injectSettingsUI();
    bindToggle();
    // bind export CSV after panel is injected
    setTimeout(bindExportCsv, 50);
  });

})();
