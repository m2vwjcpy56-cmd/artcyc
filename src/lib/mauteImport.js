// =============================================================
// MAUTE-WETTKAMPFSTATISTIK IMPORTIEREN (Web)
// =============================================================
// Gegenstück zu mauteExport.js: dieselbe Zellen-Geometrie, rückwärts gelesen.
// 1:1-Port von MauteImport.swift (native App) — Änderungen bitte in BEIDEN.
//
// Was das Blatt hergibt: je Wettkampf Name, Datum, Anzahl Kampfgerichte und je Übung
// die SUMME der Fehlerzeichen über alle Kampfgerichte plus die Zahl der 10/50/100-%-
// Abwertungen. Die Aufteilung auf einzelne Kampfgerichte kennt das Blatt nicht mehr —
// deshalb entstehen Wettkämpfe im Gesamt-Modus (Abzüge einmal erfasst, ÷ Kampfgerichte).
// Das ist exakt Mautes Formel: (SUM(X)*0,2)/Anz.
import { unzipSync, strFromU8 } from 'fflate';

const MAX_EXERCISES = 30;   // 30 Positionen × 2 Zeilen
const MAX_COMPS = 15;       // 15 Blöcke à 9 Spalten

// ---- Zellen lesen -------------------------------------------------------

export function colLetter(n) {
  let s = '';
  while (n > 0) { const m = (n - 1) % 26; s = String.fromCharCode(65 + m) + s; n = Math.floor((n - 1) / 26); }
  return s;
}

function sharedStrings(xml) {
  const out = [];
  const re = /<si>([\s\S]*?)<\/si>/g;
  let m;
  while ((m = re.exec(xml))) {
    let text = '';
    const tre = /<t[^>]*>([\s\S]*?)<\/t>/g;
    let t;
    while ((t = tre.exec(m[1]))) text += t[1];
    out.push(unescapeXml(text));
  }
  return out;
}

function unescapeXml(s) {
  return s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'").replace(/&amp;/g, '&');
}

// Zellen eines Blatts als { "A4": "Text" }. Inline-Strings (unser Export) und
// sharedStrings (Excel) werden beide gelesen; Formelzellen liefern ihren Wert.
function parseCells(xml, shared) {
  const cells = {};
  const re = /<c r="([A-Z]+\d+)"([^>]*?)(?:\/>|>([\s\S]*?)<\/c>)/g;
  let m;
  while ((m = re.exec(xml))) {
    const ref = m[1], attrs = m[2] || '', inner = m[3] || '';
    let val = null;
    const isMatch = /<is>[\s\S]*?<t[^>]*>([\s\S]*?)<\/t>[\s\S]*?<\/is>/.exec(inner);
    if (isMatch) val = unescapeXml(isMatch[1]);
    else {
      const vMatch = /<v>([\s\S]*?)<\/v>/.exec(inner);
      if (vMatch) {
        val = vMatch[1];
        if (/t="s"/.test(attrs)) val = shared[Number(val)] ?? '';
        else val = unescapeXml(val);
      }
    }
    if (val != null) cells[ref] = String(val);
  }
  return cells;
}

/// Mautes Blatt erkennt man am Kopf: Zeile 3 hat „Pkt." in B und „i.P." in C,
/// und in A3/A64 steht „Erstellt von Bundestrainer Dieter Maute".
export function looksLikeMaute(cells) {
  const c3 = cells.C3 || '', b3 = cells.B3 || '', a3 = cells.A3 || '', a64 = cells.A64 || '';
  return c3.startsWith('i.P') || b3.startsWith('Pkt') || a3.includes('Maute') || a64.includes('Maute');
}

// ---- Datei → Zellen -----------------------------------------------------

/// Lokal lesbar sind nur ZIP-basierte Dateien (.xlsx/.xlsm). Das ALTE Binärformat
/// (.xls) und Numbers kann nur der Server lesen. null = „nicht lokal lesbar".
export function readLocalCells(arrayBuffer) {
  let files;
  try { files = unzipSync(new Uint8Array(arrayBuffer)); } catch { return null; }
  const sharedKey = 'xl/sharedStrings.xml';
  const shared = files[sharedKey] ? sharedStrings(strFromU8(files[sharedKey])) : [];
  // Das Blatt heißt in der Vorlage „Programm", liegt aber je nach Speicherweg unter
  // sheet1 … sheetN — deshalb ALLE Blätter ansehen und das mit Mautes Kopfzeile nehmen.
  const sheets = Object.keys(files)
    .filter(k => /^xl\/worksheets\/sheet\d+\.xml$/.test(k))
    .sort((a, b) => Number(a.replace(/\D/g, '')) - Number(b.replace(/\D/g, '')));
  for (const key of sheets) {
    const cells = parseCells(strFromU8(files[key]), shared);
    if (looksLikeMaute(cells)) return cells;
  }
  return null;
}

/// Datei zum Server: er liest jedes Excel-Format (SheetJS) und gibt die Zellen des
/// Programm-Blatts als Text zurück. Dieselbe Edge Function wie die native App.
export async function parseRemoteCells(file, supabaseUrl, anonKey) {
  const buf = await file.arrayBuffer();
  let binary = '';
  const bytes = new Uint8Array(buf);
  const CHUNK = 0x8000;   // in Stücken, sonst sprengt apply() den Stack
  for (let i = 0; i < bytes.length; i += CHUNK) {
    binary += String.fromCharCode.apply(null, bytes.subarray(i, i + CHUNK));
  }
  const res = await fetch(supabaseUrl + '/functions/v1/parse-maute', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', apikey: anonKey, Authorization: 'Bearer ' + anonKey },
    body: JSON.stringify({ file: btoa(binary) }),
  });
  if (!res.ok) return null;
  const json = await res.json().catch(() => null);
  return (json && json.cells) ? json.cells : null;
}

// ---- Zellen → Wettkämpfe ------------------------------------------------

/// Getrennt vom Datei-Lesen, damit Tests ohne Datei arbeiten können.
export function competitionsFromCells(cells) {
  const s = (col, row) => String(cells[colLetter(col) + row] ?? '').trim();
  const n = (col, row) => Number(String(s(col, row)).replace(',', '.')) || 0;

  // Übungszeilen 4 … 63: Haupt- UND Zweitzeilen. Spalte A Name (mit Nummer davor),
  // Spalte B Punkte. Eine leere Vorlage trägt in A der Zweitzeilen eine 0.
  const rows = [];
  for (let r = 4; r <= 3 + 2 * MAX_EXERCISES; r++) {
    const a = s(1, r);
    if (!a || a === '0') continue;
    if (a.startsWith('Übung ') && n(2, r) <= 0) continue;
    const { code, name } = splitName(a);
    rows.push({ row: r, code, name, points: n(2, r) });
  }

  // i.P. steht in der Vorlage als FORMEL: Block 1 = „1, wenn Punkte > 0", jeder weitere
  // Block = „wie im Block davor". Fehlt der gespeicherte Wert (Datei nie durchgerechnet),
  // rechnen wir die Formel selbst nach. Eine von Hand getippte 0/1 hat Vorrang.
  const ipMemo = new Map();
  function iP(k, row, points) {
    const key = k + ':' + row;
    if (ipMemo.has(key)) return ipMemo.get(key);
    const base = 3 + 9 * k;
    const raw = cells[colLetter(base) + row];
    let v;
    if (raw != null && raw !== '' && !Number.isNaN(Number(String(raw).replace(',', '.')))) {
      v = Number(String(raw).replace(',', '.'));
    } else {
      v = k === 0 ? (points > 0 ? 1 : 0) : iP(k - 1, row, points);
    }
    ipMemo.set(key, v);
    return v;
  }

  const out = [];
  for (let k = 0; k < MAX_COMPS; k++) {
    const base = 3 + 9 * k;   // i.P.; +1 T, +2 X, +3 ~, +4 |, +5 ○, +6/7/8 = 10/50/100 %
    const rawName = s(base + 2, 1);
    if (!rawName || /^Wettkampf \d+$/.test(rawName)) continue;
    // Das Datum steht als Excel-Zahl DIREKT UNTER dem Namen (Zeile 2, gleiche Spalte);
    // zur Sicherheit auch die Zelle rechts daneben ansehen.
    const { name, iso } = splitDate(rawName, s(base + 2, 2), s(base + 3, 2));
    const anz = Math.round(n(base + 1, 2));
    const kg = Math.max(1, Math.min(4, anz === 0 ? 2 : anz));
    const exercises = [];
    for (const row of rows) {
      if (iP(k, row.row, row.points) < 0.5) continue;
      exercises.push({
        code: row.code, name: row.name, points: row.points,
        t: n(base + 1, row.row),
        cross: n(base + 2, row.row), wave: n(base + 3, row.row),
        bar: n(base + 4, row.row), circle: n(base + 5, row.row),
        p10: Math.round(n(base + 6, row.row)),
        p50: Math.round(n(base + 7, row.row)),
        p100: Math.round(n(base + 8, row.row)),
      });
    }
    if (!exercises.length) continue;
    out.push({ id: 'blk' + k, name, dateISO: iso, kampfgerichte: kg, exercises, column: k + 1 });
  }
  return out;
}

/// Trainer tragen Trainingsdurchläufe als Block „Training" ein — die gehören in der
/// App zu den Trainings-Wertungen, nicht zu den Wettkämpfen.
export function isTraining(c) {
  return String(c.name || '').toLowerCase().startsWith('training');
}

/// Ein Block ohne ein einziges Fehlerzeichen, ohne Abwertung und ohne Zuschlag ist eine
/// unbenutzte Spalte — die i.P.-Formeln schleppen nur die 1er mit.
export function hasMarks(c) {
  return (c.exercises || []).some(e =>
    e.cross + e.wave + e.bar + e.circle > 0 || e.p10 + e.p50 + e.p100 > 0 || e.t > 0);
}

/// Wertungstabelle im Gesamt-Modus: Fehlerzeichen als Summe, %-Stufen als Liste
/// (schwHits) plus Summe (schwPct) — genau so legt es der Editor bei „Gesamt" ab.
export function scoreEntries(c) {
  return (c.exercises || []).map(e => {
    const hits = [];
    for (let i = 0; i < Math.max(0, e.p10); i++) hits.push(10);
    for (let i = 0; i < Math.max(0, e.p50); i++) hits.push(50);
    for (let i = 0; i < Math.max(0, e.p100); i++) hits.push(100);
    return {
      cross: e.cross > 0 ? e.cross : null,
      wave: e.wave > 0 ? e.wave : null,
      bar: e.bar > 0 ? e.bar : null,
      circle: e.circle > 0 ? e.circle : null,
      schwPct: hits.length ? hits.reduce((a, b) => a + b, 0) : null,
      schwHits: hits.length ? hits : null,
      // Die T-Spalte trägt den ZUSCHLAG einer taktischen Aufwertung; der ist laut
      // Reglement immer positiv (Abwertungen laufen über die %-Spalten). Ein negativer
      // Wert ist ein Erfassungsfehler im Blatt und wird nicht übernommen.
      taktischePunkte: e.t > 0 ? e.points + e.t : null,
      points: e.points,
      name: e.name,
      code: e.code || undefined,
    };
  });
}

/// Übungen als Programm-Schnappschuss — damit die Wertung auch ohne verknüpftes
/// Programm rechnet (wie beim Scan-Import).
export function programSnapshot(c) {
  return (c.exercises || []).map(e => ({ name: e.name, code: e.code || undefined, points: e.points }));
}

// ---- Text-Helfer --------------------------------------------------------

/// „1104o. Frontlenkerstanddrehung" → (1104o, Frontlenkerstanddrehung);
/// „7. Sattelstand" (ohne Nummer exportiert) → (null, Sattelstand).
export function splitName(a) {
  let m = /^([0-9]{3,4}[a-zA-Z]?)\.\s*/.exec(a);
  if (m) return { code: m[1], name: a.slice(m[0].length).trim() };
  m = /^\d{1,2}\.\s*/.exec(a);
  if (m) return { code: null, name: a.slice(m[0].length).trim() };
  return { code: null, name: a };
}

/// Datum aus dem Namen („Kreismeisterschaft 14.06.26", so exportiert die App) oder aus
/// der Zelle darunter (Text oder Excel-Seriennummer). Fehlt beides: null.
export function splitDate(raw, alt, alt2 = '') {
  const m = /\s+(\d{1,2})\.(\d{1,2})\.(\d{2}|\d{4})$/.exec(raw);
  if (m) {
    const iso = parseGermanDate(m[0].trim());
    if (iso) return { name: raw.slice(0, m.index).trim(), iso };
  }
  for (const cand of [alt, alt2]) {
    const iso = parseGermanDate(cand) || parseISODate(cand) || parseSerial(cand);
    if (iso) return { name: raw, iso };
  }
  return { name: raw, iso: null };
}

function pad(v) { return String(v).padStart(2, '0'); }

function parseGermanDate(s) {
  const p = String(s || '').split('.');
  if (p.length !== 3) return null;
  const d = Number(p[0]), m = Number(p[1]);
  let y = Number(p[2]);
  if (!d || !m || !y || d < 1 || d > 31 || m < 1 || m > 12) return null;
  if (y < 100) y += 2000;
  return `${y}-${pad(m)}-${pad(d)}`;
}

/// „2023-04-02" bleibt. Ein voller Zeitpunkt („2023-04-01T23:00:00.000Z", so liefert
/// SheetJS Datumszellen aus Numbers) wird als Kalendertag in deutscher Zeit gelesen —
/// 23:00 UTC ist schon der nächste Tag.
function parseISODate(s) {
  const str = String(s || '');
  if (!/^\d{4}-\d{2}-\d{2}/.test(str)) return null;
  if (str.length <= 10) return str.slice(0, 10);
  const d = new Date(str);
  if (Number.isNaN(d.getTime())) return str.slice(0, 10);
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Berlin', year: 'numeric', month: '2-digit', day: '2-digit',
  }).format(d);
  return parts;   // en-CA liefert YYYY-MM-DD
}

/// Excel zählt Tage ab dem 30.12.1899.
function parseSerial(s) {
  const v = Number(String(s || '').replace(',', '.'));
  if (!v || v <= 20000 || v >= 80000) return null;
  const base = Date.UTC(1899, 11, 30);
  const d = new Date(base + Math.round(v) * 86400000);
  return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}`;
}

// ---- Einstieg -----------------------------------------------------------

export const ImportError = {
  notReadable: 'Die Datei konnte nicht gelesen werden. Erwartet wird eine Maute-Wettkampfstatistik (.xlsm, .xlsx, .xls oder Numbers).',
  noSheet: 'In der Datei ist kein Blatt mit Mautes Wettkampfstatistik (Kopfzeile „Pkt. / i.P.") zu finden.',
  noCompetitions: 'Im Blatt steht kein Wettkampf mit Übungen.',
  offline: 'Diese Datei kann nur online gelesen werden (altes Excel-Format oder Numbers).',
};

/// Erst lokal (ZIP), dann Server — der eine Weg für Ansicht und Prüfung.
export async function loadCompetitions(file, { supabaseUrl, anonKey, isOnline = true } = {}) {
  const buf = await file.arrayBuffer();
  let cells = readLocalCells(buf);
  if (!cells) {
    if (!isOnline) { const e = new Error(ImportError.offline); e.code = 'offline'; throw e; }
    cells = await parseRemoteCells(file, supabaseUrl, anonKey);
    if (!cells) { const e = new Error(ImportError.notReadable); e.code = 'notReadable'; throw e; }
    if (!looksLikeMaute(cells)) { const e = new Error(ImportError.noSheet); e.code = 'noSheet'; throw e; }
  }
  const comps = competitionsFromCells(cells);
  if (!comps.length) { const e = new Error(ImportError.noCompetitions); e.code = 'noCompetitions'; throw e; }
  return comps;
}
