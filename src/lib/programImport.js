// =============================================================
// Programm-Import — XML / XQZ / PDF aus Hallenradsport-Tools
// =============================================================
//
// Unterstützte Formate:
//
//   1. BDR-Meldung (Kunstradmeldung-XML, kunstradmeldung.xsd)
//      Root: <Kunstradmeldung>
//      Liefert: Wettbewerbsname, Disziplin, Übungen mit UCI-Nr +
//      deutschem Text + Punktwert direkt aus der Datei.
//
//   2. WeBo2008-Meldung (Meldung-XML)
//      Root: <Meldung>
//      Liefert: nur UCI-Übungsnummern. Deutscher Name + Punktwert
//      werden über die UCI-DB (UCI_DB_2026) nachgeschlagen.
//
//   3. WeBo .xqz — exakt das WeBo-XML in zlib-Deflate verpackt mit
//      einem 4-Byte Big-Endian-Length-Prefix. Wir entpacken via
//      DecompressionStream und parsen dann wie WeBo-XML.
//
//   4. PDF — Meldebogen + Wertungsbogen-Seiten. Wir extrahieren den
//      Text und matchen Zeilen vom Schema:
//        "<Lfd-Nr> <UCI-Nr> <Übungstext> <Punkte>"
//
// Rückgabe vom Hauptentry parseProgramFile:
//   { ok: true,  name, discipline, exercises: [{ nr, code, name, points }] }
//   { ok: false, error: 'msg' }
// =============================================================

const DISCIPLINE_IDS = ['1er', '2er', '4er', '6er', '4er-OB', '6er-OB'];

/** Disziplin-String → kanonische Disziplin-ID. */
function normalizeDiscipline(raw) {
  if (!raw) return '1er';
  const s = String(raw).toLowerCase();
  // Reihenfolge: spezifischste zuerst (4er-OB vor 4er)
  if (/4er.?ob|4er.?ober/i.test(raw)) return '4er-OB';
  if (/6er.?ob|6er.?ober/i.test(raw)) return '6er-OB';
  if (s.includes('1er')) return '1er';
  if (s.includes('2er')) return '2er';
  if (s.includes('4er')) return '4er';
  if (s.includes('6er')) return '6er';
  return '1er';
}

/** UCI-Übungsnummer (z. B. "1124c") aus String extrahieren. */
function extractUciCode(raw) {
  if (!raw) return null;
  const m = String(raw).match(/(\d{4}[a-z]?)/i);
  return m ? m[1].toLowerCase() : null;
}

/** XML parsen über native DOMParser. Wirft bei Fehler. */
function parseXmlString(xmlText) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xmlText, 'application/xml');
  const err = doc.querySelector('parsererror');
  if (err) throw new Error('XML-Fehler: ' + err.textContent.slice(0, 100));
  return doc;
}

function textOf(el, tag) {
  if (!el) return '';
  const child = el.getElementsByTagName(tag)[0];
  return child ? (child.textContent || '').trim() : '';
}

function numOf(s) {
  if (!s) return 0;
  const n = parseFloat(String(s).replace(',', '.'));
  return isNaN(n) ? 0 : n;
}

// =============================================================
// BDR Kunstradmeldung-XML
// =============================================================
export function parseBdrXml(doc) {
  const root = doc.documentElement;
  if (!root || root.tagName !== 'Kunstradmeldung') {
    throw new Error('Kein Kunstradmeldung-XML');
  }

  const wettbewerbName = textOf(root.getElementsByTagName('Wettbewerb')[0], 'Wettbewerbsname');
  const starter = root.getElementsByTagName('Starter')[0];
  if (!starter) throw new Error('Keine Starter-Sektion');

  const kopf = starter.getElementsByTagName('Kopf')[0];
  const disziplinRaw = textOf(kopf, 'Disziplin');
  const startername = textOf(kopf, 'Startername');

  const uebungenContainer = starter.getElementsByTagName('Uebungen')[0];
  const uebungEls = uebungenContainer ? Array.from(uebungenContainer.getElementsByTagName('Uebung')) : [];
  const exercises = uebungEls.map((u, i) => {
    const reihenfolge = parseInt(textOf(u, 'Reihenfolge'), 10) || (i + 1);
    const nrRaw = textOf(u, 'Nr');
    const code = extractUciCode(nrRaw);
    const name = textOf(u, 'Deutsch') || code || '?';
    const points = numOf(textOf(u, 'Punkte'));
    return { nr: reihenfolge, code, name, points };
  }).sort((a, b) => a.nr - b.nr);

  return {
    name: [wettbewerbName, startername].filter(Boolean).join(' — ') || 'Importiertes Programm',
    discipline: normalizeDiscipline(disziplinRaw),
    exercises
  };
}

// =============================================================
// WeBo2008-Meldung-XML (UCI-Code-only)
// `uciLookup`: Funktion code → { n, p } | null aus der UCI-DB
// =============================================================
export function parseWeboXml(doc, uciLookup) {
  const root = doc.documentElement;
  if (!root || root.tagName !== 'Meldung') {
    throw new Error('Kein WeBo-Meldung-XML');
  }

  const wettkampfName = textOf(root.getElementsByTagName('Wettkampf')[0], 'Name');
  const startposEl = root.getElementsByTagName('Startpositionen')[0];
  const starterEl  = startposEl ? startposEl.getElementsByTagName('Starter')[0] : null;
  if (!starterEl) throw new Error('Keine Starter-Sektion');

  const kopfdaten = starterEl.getElementsByTagName('Kopfdaten')[0];
  const disziplinRaw = textOf(kopfdaten, 'Disziplin');
  const wbName       = textOf(kopfdaten, 'WBName');

  const bogen = starterEl.getElementsByTagName('Wertungsbogen')[0];
  const uebungEls = bogen ? Array.from(bogen.getElementsByTagName('Uebung')) : [];
  const exercises = uebungEls.map((u, i) => {
    const reihenfolge = parseInt(textOf(u, 'LaufendeNummer'), 10) || (i + 1);
    const code = extractUciCode(textOf(u, 'Uebungsnummer'));
    let name = code || '?';
    let points = 0;
    if (code && uciLookup) {
      const hit = uciLookup(code);
      if (hit) { name = hit.n || name; points = hit.p || 0; }
    }
    return { nr: reihenfolge, code, name, points };
  }).sort((a, b) => a.nr - b.nr);

  return {
    name: [wettkampfName, wbName].filter(Boolean).join(' — ') || 'Importiertes Programm',
    discipline: normalizeDiscipline(disziplinRaw),
    exercises
  };
}

// =============================================================
// .xqz — zlib-Deflate (raw) mit 4-Byte Big-Endian Length-Prefix
// =============================================================
async function inflateXqz(buffer) {
  const u8 = new Uint8Array(buffer);
  if (u8.length < 6) throw new Error('XQZ zu kurz');
  // Erstes 4-Byte-Length-Prefix überspringen
  const payload = u8.slice(4);
  // Erkennen: zlib-Header (78 da / 78 9c / 78 01) → 'deflate', sonst raw 'deflate-raw'
  const isZlib = payload[0] === 0x78;
  if (typeof DecompressionStream === 'undefined') {
    throw new Error('Browser unterstützt DecompressionStream nicht — bitte XML/PDF nutzen.');
  }
  const stream = new Blob([payload]).stream().pipeThrough(
    new DecompressionStream(isZlib ? 'deflate' : 'deflate-raw')
  );
  const decoded = await new Response(stream).arrayBuffer();
  return new TextDecoder('utf-8').decode(decoded);
}

// =============================================================
// PDF — Text-basiertes Matching aus dem Wertungsbogen
//
// Wir suchen Zeilen vom Schema:
//   <lfdNr> <UCI-Nr> <Übungstext...> <Punktwert>
// Die Übungstexte können Klammern und Sonderzeichen enthalten
// (z. B. "Frontlenkerstanddrehung 1½fach T (7,2 - 7,7 - 8,2 - 8,7)").
// Punktwert ist immer am Ende der Zeile vor optionalen Spalten-
// Markern (Takt-Punkte, Schwierigkeit etc.) — die im Meldebogen-PDF
// leer bleiben.
// =============================================================
const UCI_LINE_RE = /(?:^|\n|\s)(\d{1,2})\s+(\d{4}[a-z])\s+([^\n]+?)\s+(\d+,\d+)/g;
const DISCIPLINE_LINE_RE = /Disziplin:?\s*([^\n,]+)/i;
const WETTBEWERB_RE      = /Wettbewerb:?\s*([^\n,]+)/i;

export function parseProgramPdfText(text) {
  const lines = text.split(/[\n\r]+/);
  let disziplinRaw = '';
  let wettbewerbName = '';
  const m1 = text.match(DISCIPLINE_LINE_RE); if (m1) disziplinRaw = m1[1].trim();
  const m2 = text.match(WETTBEWERB_RE);      if (m2) wettbewerbName = m2[1].trim();

  // Zeilen-basiert matchen: 1 Lfd-Nr + 1 UCI-Code + Übungstext + 1 Punktwert
  const exercises = [];
  const seen = new Set();
  const rowRe = /^\s*(\d{1,2})\s+(\d{4}[a-z])\s+(.+?)\s+(\d+,\d+)\s*$/;
  for (const raw of lines) {
    const line = raw.trim();
    if (!line) continue;
    const m = line.match(rowRe);
    if (!m) continue;
    const nr     = parseInt(m[1], 10);
    const code   = m[2].toLowerCase();
    const name   = m[3].trim();
    const points = numOf(m[4]);
    // Doppelte Reihenfolge-Nummern (z. B. von einer 2. Seite) skippen
    if (seen.has(nr)) continue;
    seen.add(nr);
    exercises.push({ nr, code, name, points });
  }
  exercises.sort((a, b) => a.nr - b.nr);

  return {
    name: wettbewerbName || 'Importiertes Programm',
    discipline: normalizeDiscipline(disziplinRaw),
    exercises
  };
}

// =============================================================
// Hauptentry: erkennt das Format und parsed.
//   file         — File aus <input type="file">
//   uciLookup    — Funktion code → { n, p } | null (für WeBo-XML)
//   extractPdf   — Funktion(file) → Promise<string> (für PDFs)
// =============================================================
export async function parseProgramFile(file, { uciLookup, extractPdfText }) {
  if (!file) return { ok: false, error: 'Keine Datei' };
  const name = (file.name || '').toLowerCase();
  try {
    if (name.endsWith('.xqz')) {
      const buf = await file.arrayBuffer();
      const xml = await inflateXqz(buf);
      const doc = parseXmlString(xml);
      const parsed = parseWeboXml(doc, uciLookup);
      return finish(parsed);
    }
    if (name.endsWith('.xml')) {
      const text = await file.text();
      const doc = parseXmlString(text);
      const root = doc.documentElement && doc.documentElement.tagName;
      let parsed;
      if (root === 'Kunstradmeldung') parsed = parseBdrXml(doc);
      else if (root === 'Meldung')    parsed = parseWeboXml(doc, uciLookup);
      else throw new Error('XML-Root „' + (root || '?') + '" wird nicht unterstützt');
      return finish(parsed);
    }
    if (name.endsWith('.pdf')) {
      if (!extractPdfText) throw new Error('PDF-Parser nicht verfügbar');
      const text = await extractPdfText(file);
      return finish(parseProgramPdfText(text));
    }
    return { ok: false, error: 'unknownFormat' };
  } catch (e) {
    return { ok: false, error: (e && e.message) || 'Parse-Fehler' };
  }
}

function finish(parsed) {
  if (!parsed.exercises || parsed.exercises.length === 0) {
    return { ok: false, error: 'noExercises' };
  }
  return { ok: true, ...parsed };
}

export { DISCIPLINE_IDS };
