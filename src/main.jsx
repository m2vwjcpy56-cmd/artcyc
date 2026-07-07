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

// PWA-Update: neue Version SOFORT anwenden + neu laden (kein Banner, das man im
// iOS-In-App-Browser leicht übersieht). Der Editor-Zustand liegt in localStorage,
// geht beim Reload also nicht verloren. skipWaiting+clientsClaim (vite.config.js)
// aktivieren den neuen SW sofort; updateSW(true) erzwingt Aktivierung + Reload.
const updateSW = registerSW({
  immediate: true,
  onNeedRefresh() { updateSW(true); },
  onOfflineReady() { /* optional */ }
});

// Update-Erkennung: zusätzlich zum vite-pwa-Default aktiv nach neuen Versionen
// suchen. Wichtig auf iOS: setInterval PAUSIERT im Hintergrund, darum auch beim
// Zurückkehren in den Vordergrund (visibilitychange) und bei bfcache-Restore
// (pageshow.persisted) prüfen — sonst hängt eine geöffnete App auf altem Stand.
if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
  const checkUpdate = async () => {
    try {
      const regs = await navigator.serviceWorker.getRegistrations();
      for (const r of regs) await r.update();
    } catch { /* ignore */ }
  };
  checkUpdate();
  setInterval(checkUpdate, 60000);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) checkUpdate(); });
  window.addEventListener('pageshow', (e) => { if (e.persisted) checkUpdate(); });
}

// Routing: Web-App unter /web (und /app), sowie bei Auth-Rückleitungen
// (Passwort-Reset/Magic-Link landen mit ?type=recovery / ?code / #access_token —
// die MUSS die App rendern, nicht die Landingpage). Sonst: öffentliche Landingpage.
const _p = window.location.pathname;
const _s = window.location.search;
const _h = window.location.hash;
const _appPath = /^\/(web|app)(\/|$)/.test(_p);
const _authCb = /[?&](code|type)=/.test(_s) || /(access_token|type=recovery)/.test(_h);

// Installierte PWA (Homescreen-App) IMMER in die App leiten, nie auf die
// Landingpage. Bereits installierte PWAs haben start_url '/' gecacht — daher
// hier zur Laufzeit umleiten, sonst öffnet die App-Kachel die Landingpage.
const _standalone = (typeof window.matchMedia === 'function'
    && window.matchMedia('(display-mode: standalone)').matches)
  || window.navigator.standalone === true;
if (_standalone && !_appPath && !_authCb) {
  window.location.replace('/web');
}

const _isApp = _appPath || _authCb;
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
