import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './ArtCycCoach.jsx';
import { I18nProvider } from './lib/i18n.jsx';
import './index.css';
import { registerSW } from 'virtual:pwa-register';

// PWA-Update: zeigt einen Reload-Banner wenn neue Version verfügbar.
// skipWaiting+clientsClaim in vite.config.js sorgt dafür, dass die neue
// Version sofort übernommen wird sobald der User reload bestätigt.
registerSW({
  immediate: true,
  onNeedRefresh() {
    // Banner einblenden
    const existing = document.getElementById('artcyc-update-banner');
    if (existing) return;
    const div = document.createElement('div');
    div.id = 'artcyc-update-banner';
    div.style.cssText = 'position:fixed;left:0;right:0;bottom:env(safe-area-inset-bottom);z-index:100;display:flex;justify-content:center;padding:8px;font-family:-apple-system,system-ui,sans-serif;pointer-events:none';
    div.innerHTML = `
      <div style="pointer-events:auto;background:#0F172A;color:#fff;border-radius:9999px;padding:10px 16px;display:flex;align-items:center;gap:12px;font-size:14px;font-weight:500;box-shadow:0 8px 24px rgba(0,0,0,0.25)">
        <span>Neue Version verfügbar</span>
        <button id="artcyc-update-reload" style="background:#FF9500;color:#fff;border:0;border-radius:9999px;padding:6px 14px;font-weight:600;font-size:13px;cursor:pointer">Aktualisieren</button>
      </div>`;
    document.body.appendChild(div);
    document.getElementById('artcyc-update-reload').onclick = () => location.reload();
  },
  onOfflineReady() {
    // Optional: könnte einen "Offline-bereit"-Hinweis zeigen — sparen wir uns
  }
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <I18nProvider>
      <App />
    </I18nProvider>
  </React.StrictMode>,
);
