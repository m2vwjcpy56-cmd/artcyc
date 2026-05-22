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
    // PostgREST/Supabase liefert per Default nur 1000 Rows pro Query —
    // bei 2034 Übungen würden 1034 fehlen. Wir paginieren über .range()
    // bis nichts mehr kommt.
    const PAGE = 1000;
    const all = [];
    for (let from = 0; ; from += PAGE) {
      const { data, error } = await supabase
        .from('uci_exercises')
        .select('code, discipline, points, name_de, name_en, name_fr')
        .eq('version', '2026')
        .order('code')
        .range(from, from + PAGE - 1);
      if (error) {
        console.warn('[uciRules] DB-Read failed:', error.message);
        return null;
      }
      if (!Array.isArray(data) || data.length === 0) break;
      all.push(...data);
      if (data.length < PAGE) break; // letzte Seite
    }
    if (all.length === 0) return null;
    return all.map(r => ({
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

// =============================================================
// Programm-Validierung nach UCI-Reglement 2026
// =============================================================
//
// Implementiert die in `docs/UCI-2026-PROGRAMM-VALIDIERUNG.md`
// dokumentierten Regeln. Quellen-Artikel (8.x.xxx) beziehen sich
// auf UCI 8-INA-2026-G (BDR-deutsche Fassung).
//
// API:
//   validateProgram(program, options) -> { valid, errors, warnings }
//     program:  { discipline: '1er'|'2er'|'4er'|'6er',
//                 exercises: [{ code, name, points, ... }] }
//     options:  { ageClass: 'elite' | 'junioren' | 'schueler' }
//                — ageClass darf null sein; Default ist 'elite'
//                  (= permissivste Caps, weniger false positives).
//     errors:   [{ rule, message, exerciseIndex?, exerciseCode? }] — hart
//     warnings: [{ rule, message, exerciseIndex?, exerciseCode? }] — weich
//
// Zwischen-Helper sind exportiert, damit Unit-Tests einzelne
// Bausteine prüfen können.
// =============================================================

// Max. Übungsanzahl je Disziplin × Altersklasse (Art. 8.2.002 / 8.2.003)
const MAX_EXERCISES = {
  '1er': { elite: 30, junioren: 30, schueler: 25 },
  '2er': { elite: 25, junioren: 25, schueler: 20 },
  '4er': { elite: 25, junioren: 25, schueler: 25 },
  '6er': { elite: 25, junioren: 25, schueler: 25 },
};

// 2er-Splitting: Anzahl Übungen auf einem Rad muss in diesem
// Bereich liegen (Art. 8.2.002 / 8.2.003).
const TWO_ON_ONE_WHEEL_RANGE = {
  elite:    { min: 8, max: 15 },
  junioren: { min: 8, max: 15 },
  schueler: { min: 4, max: 12 },
};

const DISCIPLINE_PREFIX = { '1er': '1', '2er': '2', '4er': '4', '6er': '6' };

// Stamm-Code = Code ohne den nachgestellten Buchstaben.
// Beispiel: '1001a' -> '1001', '2074b' -> '2074'.
// Bei Codes ohne Buchstabe Rückgabe = Code selbst.
export function codeStem(code) {
  if (!code) return '';
  const m = String(code).match(/^(\d+)/);
  return m ? m[1] : String(code);
}

// Disziplin-Erkennung aus einem Code — siehe DISCIPLINE_PREFIX.
export function disciplineFromCode(code) {
  if (!code) return null;
  const c = String(code);
  if (c.startsWith('1')) return '1er';
  if (c.startsWith('2')) return '2er';
  if (c.startsWith('4')) return '4er';
  if (c.startsWith('6')) return '6er';
  return null;
}

// Heuristik: Ist eine 2er-Übung „auf einem Rad"? Laut Kapitel V
// liegen die Codes der Einrad-Gruppen bei 8.5.012 (Niederrad 1 Rad),
// 8.5.013 (Steiger 1 Rad), 8.5.014 (Übergänge 1 Rad). Nach den
// üblichen Code-Bereichen sind das Codes ≥ 2300.
// Wenn das Programm-Item ein `subgroup`-Feld trägt, bevorzugen
// wir das (zukünftige Erweiterung).
export function isOnOneWheel2er(exercise) {
  if (!exercise) return false;
  if (exercise.subgroup === 'on_one') return true;
  if (exercise.subgroup === 'on_two') return false;
  const stem = parseInt(codeStem(exercise.code || ''), 10);
  if (!Number.isFinite(stem)) return false;
  return stem >= 2300;
}

function pushErr(arr, rule, message, extra = {}) {
  arr.push({ rule, message, ...extra });
}

export function validateProgram(program, options = {}) {
  const errors = [];
  const warnings = [];
  if (!program || typeof program !== 'object') {
    return { valid: false, errors: [{ rule: 'input', message: 'Programm fehlt.' }], warnings };
  }
  const discipline = program.discipline;
  const exercises = Array.isArray(program.exercises) ? program.exercises : [];
  const ageClass = options.ageClass || 'elite';
  const expectedPrefix = DISCIPLINE_PREFIX[discipline];

  // Regel 1 — Übungsanzahl-Cap
  const caps = MAX_EXERCISES[discipline];
  const cap = caps ? caps[ageClass] : null;
  if (cap != null && exercises.length > cap) {
    pushErr(errors, 'count_max', `Zu viele Übungen: ${exercises.length} / max. ${cap} (${discipline}, ${ageClass}).`);
  }

  // Regel 2 — identische Stamm-Codes nicht doppelt
  const seenStems = new Map();   // stem -> first index
  exercises.forEach((ex, idx) => {
    const stem = codeStem(ex && ex.code);
    if (!stem) return;
    if (seenStems.has(stem)) {
      pushErr(errors, 'duplicate_stem',
        `Übungsnummer ${stem} kommt mehrfach vor (Position ${seenStems.get(stem) + 1} und ${idx + 1}).`,
        { exerciseIndex: idx, exerciseCode: ex.code });
    } else {
      seenStems.set(stem, idx);
    }
  });

  // Regel 3 — Disziplin-Konsistenz der Codes
  if (expectedPrefix) {
    exercises.forEach((ex, idx) => {
      const code = ex && ex.code;
      if (!code) return; // selbst angelegte Übungen ohne UCI-Code überspringen
      if (!String(code).startsWith(expectedPrefix)) {
        pushErr(errors, 'wrong_discipline',
          `Übung ${code} passt nicht zur Disziplin ${discipline}.`,
          { exerciseIndex: idx, exerciseCode: code });
      }
    });
  }

  // Regel 6 — 2er: max. 3 „einzeln"-Übungen
  if (discipline === '2er') {
    const einzelnExercises = exercises
      .map((ex, idx) => ({ ex, idx }))
      .filter(({ ex }) => /einzeln/i.test(String(ex && ex.name || '')));
    if (einzelnExercises.length > 3) {
      pushErr(errors, 'too_many_einzeln',
        `Max. 3 Übungen mit „einzeln" im Namen erlaubt (gefunden: ${einzelnExercises.length}).`);
    }

    // Regel 4 — 2er-Splitting (Anzahl auf einem Rad)
    const onOne = exercises.filter(isOnOneWheel2er);
    const onTwo = exercises.length - onOne.length;
    const range = TWO_ON_ONE_WHEEL_RANGE[ageClass];
    if (range) {
      if (onOne.length < range.min) {
        pushErr(errors, 'two_split_min',
          `2er: mindestens ${range.min} Übungen auf einem Rad erforderlich (aktuell: ${onOne.length}).`);
      }
      if (onOne.length > range.max) {
        pushErr(errors, 'two_split_max',
          `2er: höchstens ${range.max} Übungen auf einem Rad (aktuell: ${onOne.length}).`);
      }
      if (onTwo === 0 && exercises.length > 0) {
        pushErr(errors, 'two_split_no_two',
          `2er: mindestens eine Übung auf zwei Rädern erforderlich.`);
      }
    }
  }

  // SHOULD — Regel 10: Programm-Vollständigkeit (< 70% der Cap)
  if (cap != null && exercises.length > 0 && exercises.length < Math.round(cap * 0.7)) {
    warnings.push({
      rule: 'underfilled',
      message: `Nur ${exercises.length} von max. ${cap} Übungen genutzt — taktisch ggf. suboptimal.`,
    });
  }

  return { valid: errors.length === 0, errors, warnings };
}
