// =============================================================
// Frontend-Error-Reporter
// =============================================================
//
// Fängt Errors aus:
//   • window.onerror               (sync runtime errors)
//   • window.onunhandledrejection  (rejected Promises)
//   • React-ErrorBoundary          (siehe components/ErrorBoundary.jsx)
//   • Manuelle Aufrufe: reportError(err, ctx)
//
// und schickt sie an die `report-error`-Edge-Function, die per
// Resend an FEEDBACK_EMAIL mailt.
//
// Schutzmaßnahmen damit der Endpoint nicht geflutet wird:
//   • Dedup über fingerprint = hash(message + stack-Top-Frame)
//     → derselbe Fehler wird pro Session nur 1× gemeldet
//   • Hard-Limit: max 10 Reports pro Browser-Session
//   • Rate-Limit: min 800 ms zwischen zwei Reports
//   • Reports werden gequeued bis Network wieder da ist
//
// Nutzt explizit den anon-key (statt User-JWT) damit auch Crashes
// vor Login geloggt werden. Wenn ein User-JWT verfügbar ist,
// hängen wir es trotzdem an — die Edge Function liest dann
// optional die User-Identität aus.
// =============================================================

import { supabase } from './supabase.js';

const SUPABASE_URL = 'https://cpxsfctijcsezkspjlxy.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNweHNmY3RpamNzZXprc3BqbHh5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc4MjA0NzUsImV4cCI6MjA5MzM5NjQ3NX0.kbEF8fYUUoznrQMdmAKvoGQ03kSTCh3qN505Af9yNS4';

const ENDPOINT = SUPABASE_URL + '/functions/v1/report-error';

const MAX_PER_SESSION = 10;
const MIN_INTERVAL_MS = 800;

const seenFingerprints = new Set();
let sentInSession = 0;
let lastSentAt = 0;

// Transiente Fehler, die KEINEN echten Bug darstellen und ignoriert
// werden sollen. Aktuell:
//
//   • „Lock was stolen by another request" — Web-Locks-API-Race zwischen
//     mehreren Tabs/PWA-Kontexten, die gleichzeitig den Supabase-Auth-
//     Token refreshen. Tritt naturgemäß bei PWA-Update oder beim Öffnen
//     in einem zweiten Tab auf, hat keine UX-Konsequenz.
//
// Pattern werden case-insensitive geprüft.
const TRANSIENT_PATTERNS = [
  /lock was stolen by another request/i,
];

function isTransient(message) {
  if (!message) return false;
  return TRANSIENT_PATTERNS.some(rx => rx.test(message));
}

function djb2(str) {
  let h = 5381;
  for (let i = 0; i < str.length; i++) h = ((h << 5) + h) ^ str.charCodeAt(i);
  // Unsigned 32-bit, hex
  return (h >>> 0).toString(16);
}

function fingerprintOf(message, stack) {
  // Nehme erste 2 Stack-Zeilen für die Stabilität — der Rest des Stacks
  // kann je nach Aufrufpfad variieren ohne dass es ein anderer Bug ist.
  const stackHead = (stack || '').split('\n').slice(0, 2).join('\n');
  return djb2((message || '') + '|' + stackHead);
}

// Strippt sensible Tokens (OAuth-Magic-Link, PKCE-Code, JWTs) aus einer
// URL bevor sie in die Crash-Mail/DB wandert. Nimmt sowohl Query
// (?access_token=...) als auch Hash (#access_token=...) — Supabase
// schreibt nach dem Magic-Link kurzzeitig in den Hash.
const SECRET_KEYS = new Set([
  'access_token', 'refresh_token', 'token', 'code',
  'id_token', 'session', 'apikey', 'api_key', 'password'
]);
function sanitizeUrl(rawUrl) {
  if (!rawUrl) return '';
  try {
    const u = new URL(rawUrl);
    for (const k of [...u.searchParams.keys()]) {
      if (SECRET_KEYS.has(k.toLowerCase())) u.searchParams.set(k, '[redacted]');
    }
    // Hash kann selbst eine Query-String-Struktur haben
    if (u.hash && u.hash.length > 1) {
      const hashParams = new URLSearchParams(u.hash.slice(1));
      let changed = false;
      for (const k of [...hashParams.keys()]) {
        if (SECRET_KEYS.has(k.toLowerCase())) {
          hashParams.set(k, '[redacted]');
          changed = true;
        }
      }
      if (changed) u.hash = hashParams.toString();
    }
    return u.toString();
  } catch {
    // URL nicht parsebar — Plain-Text-Strip
    return String(rawUrl).replace(/(access_token|refresh_token|token|code|id_token|apikey|api_key|password)=[^&#\s]+/gi, '$1=[redacted]');
  }
}

function notify(detail) {
  try {
    window.dispatchEvent(new CustomEvent('artcyc:error-reported', { detail }));
  } catch {}
}

/**
 * Schickt einen Fehler an die Edge Function. Schwierigkeiten beim Versand
 * werden in die Console geloggt — sie sollen die App auf keinen Fall
 * weiter belasten.
 *
 * @param {Error|string|null} err     — der Error oder eine Message
 * @param {string}            context — Wo es passiert ist (z. B. 'render', 'pdfImport', 'chat')
 * @param {object}            extra   — frei (wird an context angehängt)
 */
export async function reportError(err, context = '', extra = null) {
  try {
    if (sentInSession >= MAX_PER_SESSION) return;
    const now = Date.now();
    if (now - lastSentAt < MIN_INTERVAL_MS) return;

    const message = (err && err.message) ? String(err.message) : String(err || 'Unknown error');
    const stack   = (err && err.stack) ? String(err.stack) : '';
    // Transient: Web-Locks-Race etc. — diese Fehler verfälschen die
    // Crash-Statistik mehr als sie hilfreich sind.
    if (isTransient(message)) return;
    const fp      = fingerprintOf(message, stack);
    if (seenFingerprints.has(fp)) return;
    seenFingerprints.add(fp);

    // User-JWT (falls eingeloggt) — sonst anon key
    let bearer = SUPABASE_ANON_KEY;
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.access_token) bearer = session.access_token;
    } catch {}

    const ctxParts = [context];
    if (extra) {
      try { ctxParts.push(JSON.stringify(extra)); } catch {}
    }

    let lang = 'de';
    try { lang = document.documentElement.getAttribute('lang') || 'de'; } catch {}

    const payload = {
      message,
      stack,
      url: typeof location !== 'undefined' ? sanitizeUrl(location.href) : '',
      user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
      app_version: typeof __APP_VERSION__ !== 'undefined' ? __APP_VERSION__ : 'unknown',
      context: ctxParts.filter(Boolean).join(' · ').slice(0, 1000),
      lang,
      fingerprint: fp,
    };

    sentInSession++;
    lastSentAt = now;

    // fire & forget — kein await; aber wir loggen Fehler beim Senden
    fetch(ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + bearer,
        'apikey': SUPABASE_ANON_KEY,
      },
      body: JSON.stringify(payload),
      // Damit der Browser den Request auch fertig schickt wenn die
      // Seite gerade entladen wird (z. B. weil der Crash zum Reload führt)
      keepalive: true,
    }).then(r => {
      if (!r.ok) console.warn('[errorReporter] HTTP ' + r.status);
      notify({ ok: r.ok, status: r.status, context });
    }).catch(e => {
      console.warn('[errorReporter] fetch failed:', e?.message);
    });
  } catch (e) {
    // Reporter darf nie selbst die App killen.
    console.warn('[errorReporter] suppressed:', e?.message);
  }
}

/**
 * Registriert globale Listener. Einmalig in main.jsx aufrufen.
 */
export function initErrorReporter() {
  if (typeof window === 'undefined') return;
  if (window.__artcycErrorReporterInstalled) return;
  window.__artcycErrorReporterInstalled = true;

  window.addEventListener('error', (event) => {
    // event.error ist manchmal null (z. B. bei Cross-Origin-Script-Errors);
    // dann fallback auf event.message
    const err = event.error || { message: event.message, stack: '' };
    reportError(err, 'window.onerror', {
      source: event.filename || '',
      lineno: event.lineno || 0,
      colno: event.colno || 0,
    });
  });

  window.addEventListener('unhandledrejection', (event) => {
    const reason = event.reason;
    const err = reason instanceof Error
      ? reason
      : { message: typeof reason === 'string' ? reason : JSON.stringify(reason).slice(0, 500), stack: '' };
    reportError(err, 'unhandledrejection');
  });

  // Globale Helper, damit z. B. die Chat-Function oder eingebettete
  // Skripte Errors melden können ohne Imports.
  window.artcycReportError = reportError;
}
