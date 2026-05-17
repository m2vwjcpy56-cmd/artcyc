// =============================================================
// UCI-Reglement-Layer
// =============================================================
//
// Lädt die mehrsprachige UCI-Übungs-DB aus Supabase (`uci_exercises`)
// und fällt zur Fallback-Strategie wieder auf den hartcodierten
// UCI_DB_2026-Snapshot in ArtCycCoach.jsx zurück.
//
// API:
//   loadUciExercisesFromDb(lang)  -> Promise<[{c, n, p, d}, ...]>
//     Lädt aus DB und mappt auf das vom Rest der App erwartete Shape.
//     lang ∈ 'de' | 'en' | 'fr' — wenn name_<lang> fehlt, fällt auf
//     name_en, dann name_de zurück. So sieht der User in jeder
//     Sprache mindestens lesbare Namen.
//
//   getRulesLanguage(appLang, pref)
//     Entscheidet welche Reglement-Sprache effektiv genutzt wird.
//     pref='auto' → appLang, fallback 'en' wenn appLang ∉ {de,en,fr}.
//
//   fetchActiveNotices()         -> Promise<Notice[]>
//   dismissNotice(id)            -> Promise<void>
// =============================================================

import { supabase } from './supabase.js';

export const RULES_LANG_KEY = 'artcyc:rulesLang';   // 'auto' | 'de' | 'en' | 'fr'
export const SUPPORTED_RULES_LANGS = ['de', 'en', 'fr'];

/**
 * Effektive Reglement-Sprache. Wenn der User „auto" gewählt hat,
 * versuchen wir die App-Sprache zu spiegeln — falls die nicht
 * unterstützt wird (z. B. ja/cs/hu), fallback auf en.
 */
export function getRulesLanguage(appLang, pref) {
  if (pref && pref !== 'auto' && SUPPORTED_RULES_LANGS.includes(pref)) return pref;
  if (SUPPORTED_RULES_LANGS.includes(appLang)) return appLang;
  return 'en';
}

/**
 * Lädt die UCI-Übungen aus der `uci_exercises`-Tabelle und mappt
 * sie auf das vom Rest der App erwartete Shape {c, n, p, d}.
 *
 * Bei Fehler: gibt null zurück — der Aufrufer fällt dann auf den
 * hartcodierten UCI_DB_2026 zurück.
 */
export async function loadUciExercisesFromDb(lang) {
  try {
    const { data, error } = await supabase
      .from('uci_exercises')
      .select('code, discipline, points, name_de, name_en, name_fr')
      .eq('version', '2026')
      .order('code');
    if (error) {
      console.warn('[uciRules] DB-Read failed:', error.message);
      return null;
    }
    if (!Array.isArray(data) || data.length === 0) return null;
    return data.map(r => ({
      c: r.code,
      // Reglement-Sprache + Fallback-Kaskade: pref → en → de
      n: r['name_' + lang] || r.name_en || r.name_de || r.code,
      p: Number(r.points),
      d: r.discipline,
    }));
  } catch (e) {
    console.warn('[uciRules] DB-Load exception:', e?.message);
    return null;
  }
}

/**
 * Aktive App-Notices (UCI-Reglement-Update etc.) holen, ohne die
 * vom aktuellen User bereits weggeklickten.
 */
export async function fetchActiveNotices() {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];
    const [{ data: notices }, { data: dismissed }] = await Promise.all([
      supabase.from('app_notices').select('*').eq('active', true).order('created_at', { ascending: false }),
      supabase.from('app_notices_dismissed').select('notice_id').eq('user_id', user.id),
    ]);
    if (!Array.isArray(notices) || notices.length === 0) return [];
    const dismissedIds = new Set((dismissed || []).map(d => d.notice_id));
    return notices.filter(n => !dismissedIds.has(n.id));
  } catch (e) {
    console.warn('[uciRules] fetchActiveNotices failed:', e?.message);
    return [];
  }
}

export async function dismissNotice(noticeId) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;
    const { error } = await supabase
      .from('app_notices_dismissed')
      .insert({ user_id: user.id, notice_id: noticeId });
    return !error;
  } catch {
    return false;
  }
}
