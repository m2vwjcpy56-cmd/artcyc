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
// Ziel-Adresse für den mailto:-Fallback (öffnet das System-Mail-Programm
// falls der Cloud-Upload fehlschlägt). Kann via Vite-Env-Var
// VITE_FEEDBACK_EMAIL überschrieben werden. Bewusst leer als Default,
// damit keine Privat-Mail im Repo steht — der Cloud-Upload (Edge
// Function) ist der primäre Pfad, der mailto-Fallback nur Notlösung.
export const FEEDBACK_EMAIL = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_FEEDBACK_EMAIL) || '';

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

export function submitFeedback({ text, category = 'other', source = 'user', attachments = null }) {
  const t = (text || '').trim();
  if (!t) return null;
  const id = 'fb_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8);
  // Attachments werden NICHT in localStorage gespeichert (zu groß) — nur
  // ein Hinweis-Stub mit Name+Größe, damit die History sieht dass was
  // angehängt war. Der tatsächliche Inhalt geht nur an die Edge-Function.
  const attachmentStubs = Array.isArray(attachments) && attachments.length
    ? attachments.map(a => ({ name: a.name, type: a.type, size: a.size }))
    : null;
  const entry = {
    id,
    text: t,
    category,
    source,
    created_at: new Date().toISOString(),
    app_version: 'stufe8',
    user_agent: typeof navigator !== 'undefined' ? navigator.userAgent.slice(0, 200) : '',
    url: typeof location !== 'undefined' ? location.href : '',
    attachments: attachmentStubs,
    synced: false // wird auf true gesetzt sobald Cloud-Upload geklappt hat
  };
  const list = getFeedback();
  list.unshift(entry); // neueste oben
  saveFeedback(list);
  return id;
}

/**
 * Schickt einen Eintrag an die submit-feedback-Edge-Function (DB +
 * Auto-Mail an FEEDBACK_EMAIL). Markiert den localStorage-Eintrag als
 * synced=true bei Erfolg. Schlägt der Upload fehl, bleibt synced=false —
 * dann kann der User immer noch den Mail-Knopf nutzen.
 *
 * @param supabaseClient — der getCurrentSession-Provider (gibt JWT raus)
 * @param entry          — der localStorage-Eintrag aus submitFeedback()
 * @param attachments    — optionales Array von { name, type, content_base64 }
 *                         (NICHT im localStorage gespeichert, nur Live übergeben)
 * @returns {ok, mail_sent, error?}
 */
export async function pushFeedbackToCloud(supabaseClient, entry, attachments = null) {
  if (!supabaseClient || !entry) return { ok: false, error: 'invalid input' };
  try {
    const { data: { session } } = await supabaseClient.auth.getSession();
    const token = session?.access_token;
    if (!token) return { ok: false, error: 'not authenticated' };
    const SUPABASE_URL = 'https://cpxsfctijcsezkspjlxy.supabase.co';
    const res = await fetch(SUPABASE_URL + '/functions/v1/submit-feedback', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token,
      },
      body: JSON.stringify({
        text: entry.text,
        category: entry.category,
        source: entry.source,
        app_version: entry.app_version,
        user_agent: entry.user_agent,
        url: entry.url,
        attachments: Array.isArray(attachments) ? attachments : undefined,
      }),
    });
    const result = await res.json().catch(() => ({}));
    if (!res.ok) return { ok: false, error: result.error || ('HTTP ' + res.status) };
    // Eintrag als synced markieren + Mail-Status mitschreiben
    const list = getFeedback().map(e => e.id === entry.id ? {
      ...e,
      synced: true,
      cloud_id: result.id,
      mail_sent: !!result.mail_sent,
      mail_error: result.mail_error || null,
      attachment_warning: result.attachment_warning || null
    } : e);
    saveFeedback(list);
    return {
      ok: true,
      mail_sent: !!result.mail_sent,
      mail_error: result.mail_error || null,
      attachment_warning: result.attachment_warning || null
    };
  } catch (e) {
    return { ok: false, error: e.message || String(e) };
  }
}

// =============================================================
// Datei → base64 für Resend-Anhänge.
// Wir verwenden FileReader.readAsDataURL und schneiden den
// "data:...;base64,"-Prefix ab — was übrigbleibt ist reines base64.
// =============================================================
export function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(reader.error);
    reader.onload = () => {
      const result = reader.result;
      if (typeof result !== 'string') {
        reject(new Error('FileReader gab kein DataURL zurück'));
        return;
      }
      const comma = result.indexOf(',');
      resolve(comma >= 0 ? result.slice(comma + 1) : result);
    };
    reader.readAsDataURL(file);
  });
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
