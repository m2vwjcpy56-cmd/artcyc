import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './ArtCycCoach.jsx';
import Landing from './Landing.jsx';
import { I18nProvider } from './lib/i18n.jsx';
import { initErrorReporter } from './lib/errorReporter.js';
import { ErrorBoundary } from './lib/ErrorBoundary.jsx';
import './index.css';
import { registerSW } from 'virtual:pwa-register';

// Frontend-Fehler im Hintergrund an den Entwickler mailen.
// Muss vor dem Render passieren, damit window.onerror/unhandledrejection
// auch frühe Crashes (z. B. beim Bootstrap) einfangen.
initErrorReporter();

// Notfall-Bypass: ?sw_reset=1 in der URL → Service Worker komplett
// deregistrieren + Caches löschen + Reload. Hilft wenn ein alter SW
// die Update-Detection blockiert.
if (typeof window !== 'undefined' && window.location.search.includes('sw_reset=1')) {
  (async () => {
    try {
      if ('serviceWorker' in navigator) {
        const regs = await navigator.serviceWorker.getRegistrations();
        await Promise.all(regs.map(r => r.unregister()));
      }
      if ('caches' in window) {
        const keys = await caches.keys();
        await Promise.all(keys.map(k => caches.delete(k)));
      }
    } catch { /* ignore */ }
    window.location.replace('/');
  })();
}

// Periodischer Update-Check zusätzlich zum vite-pwa-Default — hilft auf
// iOS PWA, das den Auto-Update sonst manchmal Tage lang ignoriert.
if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
  const checkUpdate = async () => {
    try {
      const regs = await navigator.serviceWorker.getRegistrations();
      for (const r of regs) await r.update();
    } catch { /* ignore */ }
  };
  checkUpdate();
  setInterval(checkUpdate, 60000);
}

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

// Routing: Web-App unter /web (und /app), sowie bei Auth-Rückleitungen
// (Passwort-Reset/Magic-Link landen mit ?type=recovery / ?code / #access_token —
// die MUSS die App rendern, nicht die Landingpage). Sonst: öffentliche Landingpage.
const _p = window.location.pathname;
const _s = window.location.search;
const _h = window.location.hash;
const _isApp = /^\/(web|app)(\/|$)/.test(_p)
  || /[?&](code|type)=/.test(_s)
  || /(access_token|type=recovery)/.test(_h);
const Root = _isApp ? App : Landing;

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <I18nProvider>
        <Root />
      </I18nProvider>
    </ErrorBoundary>
  </React.StrictMode>,
);
