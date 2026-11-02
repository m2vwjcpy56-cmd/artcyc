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
// Code (lowercase) → feste Aufwertungs-Skala der taktischen Übungen ([] = taktisch ohne Skala).
const TAKT_BY_CODE = new Map();

/**
 * Taktische Aufwertung laut Reglement für eine Übungsnummer:
 * null = keine taktische Übung (oder Katalog noch nicht geladen);
 * [] = taktisch ohne feste Skala; sonst die Punktstufen.
 */
export function getTaktScale(code) {
  if (!code) return null;
  const hit = TAKT_BY_CODE.get(String(code).trim().toLowerCase());
  return hit === undefined ? null : hit;
}

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
        .select('code, discipline, points, name_de, name_en, name_fr, taktisch, takt_scale')
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
    // Taktik-Kennzeichnung cachen (Code → feste Aufwertungs-Skala), damit der
    // Wertungsbogen-Editor ohne Props-Durchreichen nachschlagen kann.
    TAKT_BY_CODE.clear();
    for (const r of all) {
      if (r.taktisch) {
        const scale = Array.isArray(r.takt_scale) ? r.takt_scale.map(Number).filter(v => v > 0) : [];
        TAKT_BY_CODE.set(String(r.code).toLowerCase(), scale);
      }
    }
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

// Die fünf Altersklassen des Reglements, einzeln — Art. 8.1.010:
//   A. Elite (über 18) · B. Junioren U19 · C./D./E. Schüler U15 / U13 / U11
// Bei der Übungsanzahl fasst das Reglement sie zu zwei Gruppen zusammen
// (8.2.002 für Elite und Junioren, 8.2.003 für alle Schülerklassen) — das heißt
// aber nicht, dass ein Programm nur zu einer Gruppe gehört. Bis zum 01.11.2026
// konnte man „Schüler" nur pauschal angeben (Ruben: „bitte alle Altersklassen
// separat, nicht zusammenfassen").
export const AGE_CLASSES = ['elite', 'junioren', 'u15', 'u13', 'u11'];

const SCHUELER = new Set(['u15', 'u13', 'u11']);
export function istSchueler(ageClass) { return SCHUELER.has(ageClass); }

// Alt-Programme trugen „schueler" für alle drei Schülerklassen. Die Grenzen sind
// dort ohnehin gleich; gewählt wird die höchste, damit aus einer fehlenden
// Angabe nicht versehentlich Elite wird.
export function ageClassKey(raw) {
  if (AGE_CLASSES.includes(raw)) return raw;
  return raw === 'schueler' ? 'u15' : 'elite';
}

// Max. Übungsanzahl je Disziplin (Art. 8.2.002 / 8.2.003)
const MAX_EXERCISES = {
  '1er': { normal: 30, schueler: 25 },
  '2er': { normal: 25, schueler: 20 },
  '4er': { normal: 25, schueler: 25 },
  '6er': { normal: 25, schueler: 25 },
};

// 2er-Splitting: Anzahl Übungen auf einem Rad muss in diesem
// Bereich liegen (Art. 8.2.002 / 8.2.003).
const TWO_ON_ONE_WHEEL_RANGE = {
  normal:   { min: 8, max: 15 },
  schueler: { min: 4, max: 12 },
};

const DISCIPLINE_PREFIX = { '1er': '1', '2er': '2', '4er': '4', '6er': '6' };

// „2er Kunstrad" → „2er". Beide Apps schreiben in DIESELBE `programs`-Tabelle,
// aber in verschiedener Schreibweise: die native App legt „2er Kunstrad" ab, die
// Web-App „2er". Ohne diese Zeile fiel jedes nativ angelegte Programm aus der
// Prüfung — `MAX_EXERCISES['2er Kunstrad']` ist undefined, und `discipline === '2er'`
// ist falsch. Damit galten Höchstzahl, Disziplin-Prüfung, Einzeln, Standdrehungen,
// die 8-bis-15-Regel und der Radwechsel für die Hälfte aller Programme NICHT —
// stillschweigend, ohne eine einzige Fehlermeldung. Nachgewiesen am 01.11.2026 an
// den echten Programmen in der Datenbank.
// Auch der Programm-Import liefert eigene Schreibweisen („4er-OB" für die
// Oberstufe) — die Übungstabelle und damit die Höchstzahl ist dieselbe wie im 4er.
// Deshalb auf die führende Kennung prüfen, nicht auf exakte Gleichheit.
export function disciplineKey(discipline) {
  const m = String(discipline || '').trim().match(/^([1246]er)\b/i);
  return m ? m[1].toLowerCase() : null;
}

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

// Steht diese 2er-Übung „auf einem Rad"?
//
// Das war bis 01.11.2026 eine Heuristik („Codes ≥ 2300") und damit FALSCH.
// Nachgemessen am offiziellen PDF, Kapitel V, über die Abschnittsüberschriften:
//   8.5.007–8.5.011  „… auf zwei Rädern"  → 2001 … 2250 (endet mit Schlussübung)
//   8.5.012–8.5.014  „… auf einem Rad"    → ab 2261
// Die sechzehn Nummern 2261 bis 2296 lagen damit auf der falschen Seite, und
// die 8-bis-15-Regel aus 8.2.002 rechnete bei jedem Programm mit, das eine
// davon enthält. Dazwischen vergibt das Reglement keine Nummer.
//
// Trägt das Programm-Item ein `subgroup`-Feld, geht das vor.
export const ERSTE_AUF_EINEM_RAD_2ER = 2261;

export function isOnOneWheel2er(exercise) {
  if (!exercise) return false;
  if (exercise.subgroup === 'on_one') return true;
  if (exercise.subgroup === 'on_two') return false;
  const stem = parseInt(codeStem(exercise.code || ''), 10);
  if (!Number.isFinite(stem)) return false;
  return stem >= ERSTE_AUF_EINEM_RAD_2ER && stem <= 2999;
}

// Schlussübungen — 8.5.006 (Einer: Übungsnummer 1301) und 8.5.011 (Zweier: 2250).
// Für 4er/6er führt das Reglement keinen eigenen Abschnitt.
export function isSchlussuebung(code) {
  const stem = parseInt(codeStem(code || ''), 10);
  return stem === 1301 || stem === 2250;
}

// Standdrehungen im Zweier — Abschnitt 8.5.009, Nummern 2211 bis 2216.
export function isStanddrehung2er(code) {
  const stem = parseInt(codeStem(code || ''), 10);
  return stem >= 2211 && stem <= 2216;
}

// Übergänge auf zwei Rädern — Abschnitt 8.5.010, Nummern 2236 bis 2243.
// 8.1.020 nimmt sie von der „Einzeln"-Obergrenze ausdrücklich aus.
export function isUebergangZweiRaeder(code) {
  const stem = parseInt(codeStem(code || ''), 10);
  return stem >= 2236 && stem <= 2243;
}

// Regeln, die nicht EINE Übungsnummer sperren, sondern eine ganze GRUPPE
// begrenzen. 8.1.020 lässt im Zweier höchstens drei Standdrehungen und höchstens
// drei „Einzeln"-Übungen zu.
//
// Als Tabelle, weil zwei Stellen sie brauchen: die Prüfung unten und die
// Übungssuche, die die Höchstzahl schon beim Auswählen meldet. Parität zu
// `ProgramRules.kontingente` der nativen App.
export function kontingente(discipline) {
  if (disciplineKey(discipline) !== '2er') return [];
  return [
    { id: 'standdrehung', rule: 'too_many_standdrehung', article: '8.1.020',
      label: 'Standdrehungen', max: 3, enthaelt: (code) => isStanddrehung2er(code) },
    // Über die Nummer, nicht über den Namen: „Einzeln" steht nur im deutschen
    // Namen, der Katalog liegt in acht Sprachen vor.
    { id: 'einzeln', rule: 'too_many_einzeln', article: '8.1.020',
      label: 'Übungen „Einzeln"', max: 3,
      enthaelt: (code) => EINZELN_CODES.has(String(code || '').trim().toLowerCase())
                          && !isUebergangZweiRaeder(code) },
  ];
}

// Welcher Reglement-Artikel hinter einer Regel steht. Die Meldungen selbst
// tragen ihn nicht; die Übungssuche schreibt ihn an die Zeile, damit man vor dem
// Antippen sieht, WORAN es liegt, ohne den ganzen Satz zu lesen.
export const REGEL_ARTIKEL = {
  count_max: '8.2.002',
  duplicate_stem: '8.1.019',
  wrong_discipline: '8.1.019',
  follow_up: '8.2.028',
  too_many_einzeln: '8.1.020',
  too_many_standdrehung: '8.1.020',
  two_split_min: '8.2.002',
  two_split_max: '8.2.002',
  two_split_no_two: '8.2.002',
  wheel_change: '8.2.006',
  schluss_position: '8.2.011',
};

// Pflicht-Folgeübungen — Art. 8.2.028 „Übergänge":
//   „Ist die Endstellung eine Steigerposition, muss in dieser Steigerart die
//    Folgeübung gefahren werden. Beginn und Ende eines Überganges ist die in
//    dem jeweiligen Übungsnamen angegebene Anfangsstellung und Endstellung."
//
// Die Tabelle ist nicht eingetippt, sondern aus unserem eigenen Katalog erzeugt
// (`docs/reglement-tabellen.py`): aus „Übergang <Von> <Nach>" wird die Zielstellung
// gelesen und es werden die Stammnummern derselben Disziplin gesucht, deren Name
// mit <Nach> beginnt — gefiltert auf dieselbe Radzahl, denn ein Übergang ist kein
// Radwechsel. Bei der nächsten Reglement-Ausgabe läuft das Skript erneut.
//
// Warum als Tabelle und nicht zur Laufzeit hergeleitet: die Herleitung hängt am
// deutschen Übungsnamen, der Katalog liegt in acht Sprachen vor. Nummern sind
// international, Namen nicht.
//
// „Einzeln"-Übungen (Art. 8.1.020) aus demselben Grund über die Nummer statt über
// den Namen — „einzeln" steht nur im deutschen Namen.
// erzeugt:anfang — docs/reglement-tabellen.py --write
const FOLLOW_UP_GROUPS = {
  '1281a': [1236, 1237],                                // Übergang Fronthang Steuerrohrsteiger
  '1282a': [1248, 1249],                                // Übergang Fronthang Kehrstandsteiger
  '1283a': [1226, 1227],                                // Übergang Reitsitzsteiger Lenkersitzsteiger
  '1283b': [1201, 1202],                                // Übergang Lenkersitzsteiger Reitsitzsteiger
  '1284a': [1236, 1237],                                // Übergang Reitsitzsteiger Steuerrohrsteiger
  '1284b': [1201, 1202],                                // Übergang Steuerrohrsteiger Reitsitzsteiger
  '1285a': [1248, 1249],                                // Übergang Reitsitzsteiger Kehrstandsteiger
  '1285b': [1201, 1202],                                // Übergang Kehrstandsteiger Reitsitzsteiger
  '1286a': [1236, 1237],                                // Übergang Lenkersitzsteiger Steuerrohrsteiger
  '1286b': [1226, 1227],                                // Übergang Steuerrohrsteiger Lenkersitzsteiger
  '1287a': [1248, 1249],                                // Übergang Steuerrohrsteiger Kehrstandsteiger
  '1287b': [1236, 1237],                                // Übergang Kehrstandsteiger Steuerrohrsteiger
  '1288a': [1238, 1239],                                // Übergang Kehrhang Kehrsteuerrohrsteiger
  '1289a': [1246, 1247],                                // Übergang Kehrhang Standsteiger
  '1290a': [1228, 1229],                                // Übergang Kehrreitsitz Kehrlenkersitzsteiger
  '1291a': [1246, 1247],                                // Übergang Kehrlenkersitzsteiger Standsteiger
  '1291b': [1228, 1229],                                // Übergang Standsteiger Kehrlenkersitzsteiger
  '1292a': [1228, 1229],                                // Übergang Kehrsteuerrohrsteiger Kehrlenkersitzsteiger
  '1292b': [1238, 1239],                                // Übergang Kehrlenkersitzsteiger Kehrsteuerrohrsteiger
  '1293a': [1238, 1239],                                // Übergang Standsteiger Kehrsteuerrohrsteiger
  '1293b': [1246, 1247],                                // Übergang Kehrsteuerrohrsteiger Standsteiger
  '2236a': [2161, 2162, 2163, 2164, 2211],              // Übergang Reitsitzsteiger Lenkersitzsteiger
  '2236b': [2131, 2132, 2133, 2134],                    // Übergang Lenkersitzsteiger Reitsitzsteiger
  '2237a': [2176, 2177, 2178, 2179, 2213],              // Übergang Reitsitzsteiger Steuerrohrsteiger
  '2237b': [2131, 2132, 2133, 2134],                    // Übergang Steuerrohrsteiger Reitsitzsteiger
  '2238a': [2176, 2177, 2178, 2179, 2213],              // Übergang Lenkersitzsteiger Steuerrohrsteiger
  '2238b': [2161, 2162, 2163, 2164, 2211],              // Übergang Steuerrohrsteiger Lenkersitzsteiger
  '2239a': [2195, 2196, 2197, 2198, 2216],              // Übergang Steuerrohrsteiger Kehrstandsteiger
  '2239b': [2176, 2177, 2178, 2179, 2213],              // Übergang Kehrstandsteiger Steuerrohrsteiger
  '2240a': [2180, 2181, 2182, 2183, 2214],              // Übergang Standsteiger Kehrsteuerrohrsteiger
  '2240b': [2191, 2192, 2193, 2194, 2215],              // Übergang Kehrsteuerrohrsteiger Standsteiger
  '2241a': [2165, 2166, 2167, 2168, 2212],              // Übergang Kehrsteuerrohrsteiger Kehrlenkersitzsteiger
  '2241b': [2180, 2181, 2182, 2183, 2214],              // Übergang Kehrlenkersitzsteiger Kehrsteuerrohrsteiger
  '2242a': [2191, 2192, 2193, 2194, 2215],              // Übergang Kehrhang Standsteiger einzeln
  '2243a': [2180, 2181, 2182, 2183, 2214],              // Übergang Kehrhang Kehrsteuerrohrsteiger einzeln
  '2471a': [2426, 2427, 2428, 2429],                    // Übergang Reitsitzsteiger Lenkersitzsteiger / Schultersitz
  '2471b': [2426, 2427, 2428, 2429],                    // Übergang Reitsitzsteiger Lenkersitzsteiger / Schulterstand
  '2472a': [2436, 2437, 2438, 2439],                    // Übergang Reitsitzsteiger Steuerrohrsteiger / Schultersitz
  '2472b': [2436, 2437, 2438, 2439],                    // Übergang Reitsitzsteiger Steuerrohrsteiger / Schulterstand
  '2473a': [2436, 2437, 2438, 2439],                    // Übergang Lenkersitzsteiger Steuerrohrsteiger / Schultersitz
  '2473b': [2436, 2437, 2438, 2439],                    // Übergang Lenkersitzsteiger Steuerrohrsteiger / Schulterstand
}

const EINZELN_CODES = new Set([
  '2067a', '2067b', '2068a', '2068b', '2069a', '2069b',
  '2070a', '2070aa', '2070b', '2070ba', '2071a', '2071b',
  '2073a', '2073b', '2074a', '2074b', '2076a', '2076b',
  '2076d', '2076e', '2076g', '2076h', '2076j', '2076k',
  '2077a', '2077b', '2077d', '2077e', '2077g', '2077h',
  '2077j', '2077k', '2077m', '2077n', '2079a', '2081a',
  '2242a', '2243a',
])
// erzeugt:ende

function pushErr(arr, rule, message, extra = {}) {
  arr.push({ rule, message, ...extra });
}

export function validateProgram(program, options = {}) {
  const errors = [];
  const warnings = [];
  if (!program || typeof program !== 'object') {
    return { valid: false, errors: [{ rule: 'input', message: 'Programm fehlt.' }], warnings };
  }
  const discipline = disciplineKey(program.discipline);
  const exercises = Array.isArray(program.exercises) ? program.exercises : [];
  const ageClass = ageClassKey(options.ageClass);
  // Für die Grenzen zählt nur: Schülerklasse oder nicht.
  const grenzen = istSchueler(ageClass) ? 'schueler' : 'normal';
  const expectedPrefix = DISCIPLINE_PREFIX[discipline];

  // Regel 1 — Übungsanzahl-Cap
  const caps = MAX_EXERCISES[discipline];
  const cap = caps ? caps[grenzen] : null;
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
        { exerciseIndex: idx, exerciseCode: ex.code,
          positions: [seenStems.get(stem) + 1, idx + 1] });
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
          { exerciseIndex: idx, exerciseCode: code, positions: [idx + 1] });
      }
    });
  }

  // Regel 11 — 8.2.028 „Übergänge": endet der Übergang in einer Steigerposition,
  // muss die nächste Übung in genau dieser Steigerart gefahren werden. Ein Übergang
  // als letzte Übung ist ebenfalls ein Fehler — die geforderte Folgeübung fehlt dann.
  exercises.forEach((ex, idx) => {
    const code = String((ex && ex.code) || '').trim().toLowerCase();
    const erlaubt = FOLLOW_UP_GROUPS[code];
    if (!erlaubt) return;
    // Die naechste Zeile MIT Uebungsnummer. Eine leere Zeile ist ein Platzhalter
    // im Editor, keine Uebung — mitgezaehlt meldete sie hinter jedem Uebergang
    // eine fehlende Folgeuebung, die der Nutzer nur noch nicht eingetragen hat.
    let n = idx + 1;
    while (n < exercises.length && !codeStem(exercises[n] && exercises[n].code)) n++;
    const next = n < exercises.length ? exercises[n] : null;
    const nextStem = next ? parseInt(codeStem(next.code || ''), 10) : NaN;
    if (!erlaubt.includes(nextStem)) {
      pushErr(errors, 'follow_up',
        `Nach dem Übergang ${ex.code} (Position ${idx + 1}) muss eine Übung aus ${erlaubt.join(', ')} folgen — dort endet der Übergang.`,
        // Beide Zeilen: der Übergang UND die Zeile, die ihm folgen müsste. Sonst
        // merkt die Vorschau nicht, dass die Kandidatin selbst die falsche ist.
        { exerciseIndex: idx, exerciseCode: ex.code,
          positions: next ? [idx + 1, n + 1] : [idx + 1] });
    }
  });

  // Regel 6 — 8.1.020: die beiden Kontingente des Zweiers (höchstens 3 Übungen
  // „Einzeln", höchstens 3 Standdrehungen). Beide kommen aus derselben Tabelle
  // wie die Vorab-Warnung in der Übungssuche — getrennt gezählt liefen sie beim
  // nächsten Reglement auseinander.
  kontingente(discipline).forEach(k => {
    const treffer = exercises
      .map((ex, idx) => ({ ex, idx }))
      .filter(({ ex }) => k.enthaelt(ex && ex.code));
    if (treffer.length > k.max) {
      pushErr(errors, k.rule, `${treffer.length} ${k.label} — höchstens ${k.max} erlaubt.`,
        { positions: treffer.map(({ idx }) => idx + 1) });
    }
  });

  if (discipline === '2er') {
    // Regel 4 — 2er-Splitting (Anzahl auf einem Rad)
    const onOne = exercises.filter(isOnOneWheel2er);
    // „Auf zwei Rädern" wird nur unter den Übungen MIT Nummer gezählt — eine selbst
    // angelegte Zeile ohne Nummer ist keine Übung auf zwei Rädern, sie ist unbekannt.
    // (Parität zu ProgramRules.swift, das dafür `mitCode` nimmt.)
    const onTwo = exercises.filter(ex => codeStem(ex && ex.code) && !isOnOneWheel2er(ex)).length;
    const range = TWO_ON_ONE_WHEEL_RANGE[grenzen];
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

  // Regel 7 — 8.2.006: „Während des Fahrprogramms dürfen die Sportler die Räder
  // nicht verlassen. Ausnahme 2er Kunstradsport: DER EINMALIGE Wechsel von zwei
  // Rädern auf ein Rad oder von einem Rad auf zwei Räder."
  // Einmalig heisst: die Übungen auf einem Rad stehen am Stück. Wer zwischendurch
  // zurückwechselt, bräuchte einen zweiten Wechsel.
  if (discipline === '2er' && exercises.length > 1) {
    // Auch hier nur die Zeilen MIT Nummer: eine leere Zeile zaehlte als „auf zwei
    // Raedern" und erzeugte damit Radwechsel, die niemand gefahren ist.
    const mitCode = exercises.map((ex, idx) => ({ ex, idx }))
      .filter(({ ex }) => codeStem(ex && ex.code));
    const wechsel = [];
    for (let i = 1; i < mitCode.length; i++) {
      if (isOnOneWheel2er(mitCode[i].ex) !== isOnOneWheel2er(mitCode[i - 1].ex)) {
        wechsel.push(mitCode[i].idx + 1);
      }
    }
    if (wechsel.length > 1) {
      pushErr(errors, 'wheel_change',
        `${wechsel.length} Radwechsel (Position ${wechsel.join(', ')}) — erlaubt ist nur einer. Die Übungen auf einem Rad müssen am Stück stehen.`,
        { positions: wechsel });
    }
  }

  // Regel 8 — „maximal 3 Standdrehungen" steht oben bei Regel 6, zusammen mit
  // der zweiten Höchstzahl desselben Artikels.

  // Regel 9 — 8.2.011: „Schlussübungen können nur vor dem Radwechsel oder als
  // letzte Übung gezeigt werden."
  exercises.forEach((ex, idx) => {
    if (!isSchlussuebung(ex && ex.code)) return;
    const istLetzte = idx === exercises.length - 1;
    const vorWechsel = discipline === '2er' && idx + 1 < exercises.length
      && isOnOneWheel2er(ex) !== isOnOneWheel2er(exercises[idx + 1]);
    if (!istLetzte && !vorWechsel) {
      pushErr(errors, 'schluss_position',
        `Schlussübung an Position ${idx + 1}: nur als letzte Übung oder direkt vor dem Radwechsel.`,
        { exerciseIndex: idx, exerciseCode: ex && ex.code, positions: [idx + 1] });
    }
  });

  // SHOULD — Regel 10: Programm-Vollständigkeit (< 70% der Cap)
  if (cap != null && exercises.length > 0 && exercises.length < Math.round(cap * 0.7)) {
    warnings.push({
      rule: 'underfilled',
      message: `Nur ${exercises.length} von max. ${cap} Übungen genutzt — taktisch ggf. suboptimal.`,
    });
  }

  return { valid: errors.length === 0, errors, warnings };
}
