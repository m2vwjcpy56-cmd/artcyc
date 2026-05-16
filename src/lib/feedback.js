// =============================================================
// Feedback-Modul für ArtCyc Coach
// =============================================================
//
// Speichert User- und KI-Coach-Feedback in localStorage. Per Mail-Knopf
// kann der User die gesammelte Liste an den Entwickler schicken.
//
// API:
//   submitFeedback({ text, category, source }) -> id   speichert Eintrag
//   getFeedback() -> Eintrag[]                          liest alle
//   clearFeedback()                                     löscht alle
//   buildFeedbackMailto(entries, locale) -> mailto-URL  baut Mail-Link
//
// Quellen ('source'):
//   'user' — manuell vom User über Settings
//   'ai'   — vom KI-Coach im Hintergrund vermerkt
//
// Die globale Funktion `window.artcycSubmitFeedback` wird im
// I18nProvider attached, sodass der KI-Coach (Edge-Function-Antwort)
// einen einfachen Call-Hook hat.
// =============================================================

export const FEEDBACK_KEY = 'artcyc:feedback';
export const FEEDBACK_EMAIL = 'info@neue-weberei.de';

export function getFeedback() {
  try {
    const raw = localStorage.getItem(FEEDBACK_KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr : [];
  } catch { return []; }
}

export function saveFeedback(list) {
  try { localStorage.setItem(FEEDBACK_KEY, JSON.stringify(list)); } catch {}
}

export function submitFeedback({ text, category = 'other', source = 'user' }) {
  const t = (text || '').trim();
  if (!t) return null;
  const id = 'fb_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8);
  const entry = {
    id,
    text: t,
    category,
    source,
    created_at: new Date().toISOString(),
    app_version: 'stufe8',
    user_agent: typeof navigator !== 'undefined' ? navigator.userAgent.slice(0, 200) : '',
    url: typeof location !== 'undefined' ? location.href : ''
  };
  const list = getFeedback();
  list.unshift(entry); // neueste oben
  saveFeedback(list);
  return id;
}

export function clearFeedback() {
  saveFeedback([]);
}

export function deleteFeedbackEntry(id) {
  saveFeedback(getFeedback().filter(e => e.id !== id));
}

/** Baut einen mailto:-Link mit allen Einträgen als pre-filled Mailtext. */
export function buildFeedbackMailto(entries) {
  const subject = encodeURIComponent('ArtCyc Coach — Feedback (' + entries.length + ' Einträge)');
  const lines = ['Feedback aus ArtCyc Coach:', ''];
  for (const e of entries) {
    const date = e.created_at ? new Date(e.created_at).toLocaleString('de-DE') : '?';
    lines.push('— ' + date + ' · ' + (e.category || 'other') + ' · von ' + (e.source === 'ai' ? 'KI-Coach' : 'User'));
    lines.push(e.text);
    lines.push('');
  }
  lines.push('---');
  lines.push('App-Version: stufe8');
  lines.push('Browser: ' + (typeof navigator !== 'undefined' ? navigator.userAgent : '?'));
  const body = encodeURIComponent(lines.join('\n'));
  return 'mailto:' + FEEDBACK_EMAIL + '?subject=' + subject + '&body=' + body;
}

/**
 * Wird einmalig vom I18nProvider aufgerufen. Hängt eine globale Funktion
 * an `window` damit der KI-Coach-Chat (oder andere Helfer) Feedback
 * ohne React-Context absetzen kann.
 */
export function attachGlobalFeedbackBridge() {
  if (typeof window === 'undefined') return;
  window.artcycSubmitFeedback = (text, category, source) => submitFeedback({
    text,
    category: category || 'other',
    source: source || 'ai'
  });
}
