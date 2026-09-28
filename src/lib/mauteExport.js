// =============================================================
// ArtCyc Coach — Voller Export in die offizielle Maute-Wettkampfstatistik
// =============================================================
// Befüllt die ORIGINAL-Vorlage (.xlsm) „chirurgisch": Es werden nur die
// Werte-Zellen im Blatt „Programm" (sheet1.xml) ersetzt — Diagramme, VBA-
// Makros, Formeln und alle anderen Blätter bleiben unangetastet. Excel
// rechnet beim Öffnen alles neu (fullCalcOnLoad).
//
// Layout „Programm" (aus der Vorlage abgeleitet):
//  • 15 Wettkampf-Blöcke à 9 Spalten, Block k beginnt bei Spalte 3+9*(k-1).
//    Spalten je Block: i.P.(+0, FORMEL → nicht anfassen), T(+1), X(+2),
//    ~(+3), |(+4), ○(+5), 10%(+6), 50%(+7), 100%(+8).
//  • Block-Kopf: Name in Zeile 1 (Spalte +2), „Anz." (Kampfgerichte) in
//    Zeile 2 (Spalte +1).
//  • 30 Übungs-Slots in geraden Zeilen 4,6,…,62. Spalte A = Name, B = Punkte
//    (treibt die i.P.-Formel).
//  • Abwertungen = GESAMTSUMME aller Kampfgerichte (KG1 + KG2) — laut Maute-
//    Anleitung. %-Spalten zählen, in wie vielen KGs die Stufe vergeben wurde.
// =============================================================

import { unzipSync, zipSync, strToU8, strFromU8 } from 'fflate';

const VORLAGE_URL = ((typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.BASE_URL) || '/') + 'wettkampfstatistik-vorlage.xlsm';
const MAX_EXERCISES = 30;
const MAX_COMPS = 15;

function colLetter(n) {
  let s = '';
  while (n > 0) { const m = (n - 1) % 26; s = String.fromCharCode(65 + m) + s; n = Math.floor((n - 1) / 26); }
  return s;
}
function xmlEsc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
function dateShort(iso) {
  const m = String(iso || '').match(/^(\d{4})-(\d{2})-(\d{2})/);
  return m ? m[3] + '.' + m[2] + '.' + m[1].slice(2) : (iso || '');
}

// Normalisierter Übungs-Schlüssel (wie im Statistiken-Tab): Übungsnummer/Code, sonst Name.
function normName(s) {
  return String(s || '').toLowerCase().replace(/\s+/g, ' ').replace(/[ .]+$/, '').trim();
}
function exKey(ex) {
  const c = String(ex.nr || ex.code || '').trim();
  return c ? c.toLowerCase() : normName(ex.name);
}

// Baut die Map ref → { kind:'n'|'s', val } der zu setzenden Zellen.
//
// NEU (Maute-konform): Die Übungs-Zeilen sind die VEREINIGUNG aller in den
// gewählten Wettkämpfen tatsächlich geturnten Übungen (per Übungsnummer/Name,
// Reihenfolge egal). Pro Wettkampf wird die Spalte „i.P." (im Programm) gezielt
// auf 1/0 gesetzt — 1, wenn die Übung im Programm DIESES Wettkampfs war, sonst 0.
// So bildet der Export Programmwechsel über die Saison korrekt ab (statt alles an
// EIN gewähltes Programm zu binden). Jeder Wettkampf `c` trägt sein eigenes
// `c.exercises` (Programm-Übungen, index-treu zu table1..4).
// Zeilen-Belegung: 30 Positionen × 2 Zeilen (Parität zur nativen App, MauteExport.layout).
//
// Die Vorlage hat pro Position ZWEI Zeilen: die Hauptzeile (4, 6, … 62) für die
// Übung, mit der die Saison begann, und darunter (5, 7, … 63) eine Zweitzeile für
// die Übung, die sie später ersetzt hat. Welche der beiden pro Wettkampf gilt, sagt
// die 1 in „i.P." — so bildet Maute Programmwechsel ab. Beide Zeilen sind
// vollwertig (eigene Formeln, Summen, Schwierigkeitsblock).
//
// Regeln, die erste die greift gilt:
//  a) an der eigenen Programmposition wurde eine Übung ersetzt → deren Zweitzeile
//  b) die eigene Position ist noch leer (erstes Programm) → Hauptzeile
//  c) irgendeine Position, deren Übung in diesem Wettkampf fehlt → deren Zweitzeile
//  d) irgendeine freie Zeile — Hauptsache, die Übung hat eine (gemeldet)
//  e) alle 60 Zeilen belegt → fällt heraus (gemeldet)
const primaryRow = (i) => 4 + 2 * i;
const secondaryRow = (i) => 5 + 2 * i;

// Chronologisch, ältester zuerst — so liest Maute das Blatt. Erst kappen, dann
// sortieren, sonst fielen bei >15 gewählten die neuesten heraus.
function orderedSelection(comps) {
  return (comps || []).slice(0, MAX_COMPS).slice().sort((a, b) => {
    const da = a.date || '9999', db = b.date || '9999';
    if (da !== db) return da < db ? -1 : 1;
    return String(a.created_at || a.createdAt || '') < String(b.created_at || b.createdAt || '') ? -1 : 1;
  });
}
const compLabel = (c) => (String(c.name || '').trim() || c.date || '?');

export function layoutMaute(comps) {
  const selected = orderedSelection(comps);
  const slots = Array.from({ length: MAX_EXERCISES }, () => ({ primary: null, secondary: null }));
  const placed = new Map();
  const compsOf = new Map();
  const replaced = [], displaced = [], droppedKeys = [];
  selected.forEach((c) => {
    const exs = c.exercises || [];
    const keys = new Set(exs.map(exKey).filter(Boolean));
    const cname = compLabel(c);
    exs.forEach((ex, pos) => {
      const k = exKey(ex);
      if (!k) return;
      if (!compsOf.has(k)) compsOf.set(k, []);
      compsOf.get(k).push(cname);
      if (placed.has(k)) return;
      const u = { key: k, nr: ex.nr || ex.code || '', name: ex.name || '', points: Number(ex.points || 0) };
      const gone = (j) => !!slots[j].primary && !keys.has(slots[j].primary.key);
      const n = MAX_EXERCISES;
      if (pos < n && !slots[pos].secondary && gone(pos)) {                               // a
        slots[pos].secondary = u; placed.set(k, pos);
        replaced.push({ pos: pos + 1, from: slots[pos].primary.name, to: u.name, since: cname }); return;
      }
      if (pos < n && !slots[pos].primary) { slots[pos].primary = u; placed.set(k, pos); return; }   // b
      let j = slots.findIndex((s, i) => !s.secondary && gone(i));                          // c
      if (j >= 0) { slots[j].secondary = u; placed.set(k, j); replaced.push({ pos: j + 1, from: slots[j].primary.name, to: u.name, since: cname }); return; }
      j = slots.findIndex(s => !s.primary);                                                // d
      if (j >= 0) { slots[j].primary = u; placed.set(k, j); displaced.push({ name: u.name, pos: j + 1, wanted: pos + 1 }); return; }
      j = slots.findIndex(s => !s.secondary);                                              // d
      if (j >= 0) { slots[j].secondary = u; placed.set(k, j); displaced.push({ name: u.name, pos: j + 1, wanted: pos + 1 }); return; }
      placed.set(k, -1); droppedKeys.push({ key: k, name: u.name || 'Übung' });            // e
    });
  });
  const rows = [];
  slots.forEach((s, i) => {
    if (s.primary) rows.push({ row: primaryRow(i), ex: s.primary });
    if (s.secondary) rows.push({ row: secondaryRow(i), ex: s.secondary });
  });
  const dropped = droppedKeys.map(d => ({ name: d.name, comps: compsOf.get(d.key) || [] }));
  return { selected, rows, replaced, displaced, dropped, total: placed.size };
}

function buildCellMap(comps) {
  const map = new Map();
  const L = layoutMaute(comps);
  const selected = L.selected;

  // 2) Stammdaten je Zeile: Name (A) + Punkte (B) — Haupt- UND Zweitzeilen. Die Punkte
  //    der Zweitzeile zählen in der Vorlage über i.P. in „Aufgestellt" und im
  //    Schwierigkeitsblock; sie müssen da sein.
  L.rows.forEach(({ row: r, ex: u }) => {
    const pos = (r - 4 >> 1) + 1;
    const nr = u.nr ? u.nr + '. ' : pos + '. ';
    map.set('A' + r, { kind: 's', val: nr + (u.name || ('Übung ' + pos)) });
    map.set('B' + r, { kind: 'n', val: u.points });
  });

  // 3) Pro Wettkampf: i.P. (1/0) je Übung + Abzüge, wenn im Programm.
  selected.forEach((c, k) => {
    const base = 3 + 9 * k;                 // 1-basierte Spalte von i.P.
    const iPcol = colLetter(base);          // Spalte „i.P." (C, L, …) — wird jetzt gesetzt
    const nameCol = colLetter(base + 2);    // E, N, …
    const anzCol = colLetter(base + 1);     // D, M, …
    const n = Math.max(1, Math.min(4, Number(c.kampfgerichte || 2)));
    const gesamt = isGesamt(c);
    // Name in Zeile 1, Datum als Excel-Seriennummer in die Datumszelle darunter (Zeile 2,
    // Datumsformat der Vorlage) — so führen es die echten Maute-Dateien. Parität zu iOS.
    map.set(nameCol + '1', { kind: 's', val: c.name || 'Wettkampf' });
    const serial = excelSerial(c.date);
    if (serial != null) map.set(nameCol + '2', { kind: 'n', val: serial });
    map.set(anzCol + '2', { kind: 'n', val: n });

    const allTables = [c.table1, c.table2, c.table3, c.table4];
    const usedTables = gesamt ? [c.table1 || []] : allTables.slice(0, n).map(t => t || []);

    const D = colLetter(base + 1), E = colLetter(base + 2), F = colLetter(base + 3),
      G = colLetter(base + 4), H = colLetter(base + 5), I = colLetter(base + 6),
      J = colLetter(base + 7), K = colLetter(base + 8);

    // Übungen DIESES Wettkampfs: Schlüssel → { ex, j } (j = Index in table1..4).
    const idxByKey = new Map();
    (c.exercises || []).forEach((ex, j) => {
      const kk = exKey(ex);
      if (kk && !idxByKey.has(kk)) idxByKey.set(kk, { ex, j });
    });

    // Randabzüge (vor der ersten / nach der letzten Übung) haben in der offiziellen
    // Statistik KEINE eigene Zeile. Sie werden auf die erste bzw. letzte Übung DIESES
    // Wettkampfs angerechnet — sonst fehlten sie im Blatt und die Summe läge unter dem
    // Ergebnis in der App. Randeinträge tragen nur Fehlerzeichen, keine Schwierigkeit
    // und keine Aufwertung; die %-Spalten bleiben also unberührt.
    const extra = new Map();                       // Übungs-Schlüssel → { cross, wave, bar, circle }
    const edgeRow = (t, kind) => (t || []).find(e => e && e.edge === kind) || null;
    const addEdge = (kind, ex) => {
      const kk = ex ? exKey(ex) : '';
      if (!kk) return;
      const acc = extra.get(kk) || { cross: 0, wave: 0, bar: 0, circle: 0 };
      usedTables.forEach((t) => {
        const e = edgeRow(t, kind);
        if (!e) return;
        acc.cross += Number(e.cross || 0); acc.wave += Number(e.wave || 0);
        acc.bar += Number(e.bar || 0); acc.circle += Number(e.circle || 0);
      });
      extra.set(kk, acc);
    };
    const own = c.exercises || [];
    addEdge('pre', own[0]);
    addEdge('post', own[own.length - 1]);

    // Jede belegte Zeile bekommt pro Wettkampf ihre 1 oder 0 — auch die Zweitzeile.
    L.rows.forEach(({ row: r, ex: u }) => {
      const hit = idxByKey.get(u.key);
      if (!hit) { map.set(iPcol + r, { kind: 'n', val: 0 }); return; } // nicht im Programm → i.P.=0
      map.set(iPcol + r, { kind: 'n', val: 1 });                       // im Programm → i.P.=1
      const ex = hit.ex, idx = hit.j;
      // Nur über die ID zuordnen, wenn die Übung eine HAT — sonst ist
      // `undefined === undefined` wahr und jede Zeile bekäme die Abzüge der
      // ersten Zeile (so bei gescannten Wettkämpfen ohne Übungs-IDs).
      const pick = (t) => ((ex.id && t.find(e => e && e.exerciseId === ex.id)) || t[idx] || {});
      const entries = usedTables.map(pick);
      const sum = (kp) => entries.reduce((acc, e) => acc + Number(kp(e) || 0), 0);
      const bonus = (e) => {
        const tp = Number(e.taktischePunkte || 0);
        return (tp > 0 && tp !== Number(ex.points || 0)) ? (tp - Number(ex.points || 0)) : 0;
      };
      const pctCount = (p) => {
        if (gesamt) {
          const e = pick(c.table1 || []);
          const hits = Array.isArray(e.schwHits) ? e.schwHits : null;
          if (hits && hits.length) return hits.filter(v => Number(v) === p).length;
          return Number(e.schwPct || 0) === p ? 1 : 0;
        }
        return entries.filter(e => Number(e.schwPct || 0) === p).length;
      };
      const setN = (col, v) => { if (v) map.set(col + r, { kind: 'n', val: Math.round(v * 1000) / 1000 }); };
      setN(D, Math.max(0, ...entries.map(bonus)));
      const add = extra.get(u.key) || { cross: 0, wave: 0, bar: 0, circle: 0 };
      setN(E, sum(e => e.cross) + add.cross); // X (inkl. Randabzug)
      setN(F, sum(e => e.wave) + add.wave);   // ~
      setN(G, sum(e => e.bar) + add.bar);     // |
      setN(H, sum(e => e.circle) + add.circle); // ○
      setN(I, pctCount(10));      // 10%
      setN(J, pctCount(50));      // 50%
      setN(K, pctCount(100));     // 100%
    });
  });
  addCachedResults(map, selected.length);
  return map;
}

// Excel-Datumsseriennummer (Tage seit 1899-12-30) für ein ISO-Datum.
function excelSerial(iso) {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(iso || ''));
  if (!m) return null;
  return Math.round((Date.UTC(+m[1], +m[2] - 1, +m[3]) - Date.UTC(1899, 11, 30)) / 86400000);
}

// Rechnet die Formeln der Vorlage vor und legt die Werte als Cache in die Formelzellen
// (Formeln bleiben stehen). iPhone-Vorschau und Numbers rechnen nicht nach und zeigten
// überall 0 („keine Abzüge, Punktzahl 00", Ruben 28.09.). Zeilen 4…62 = Übungen;
// Schwierigkeitsblock: F(r+72) = (B+T)·i.P., I/J/K(r+71) = Flag·(B+T)·0,1/0,5/1·i.P.;
// F75 = Σ = „Aufgestellt"; Zeile 63 = Summen je Fehlerart ÷ Anz.; J64 = Ergebnis;
// Zeilen 75+k, Spalten A–E = Übersicht je Wettkampf. Parität zu iOS `addCachedResults`.
function addCachedResults(map, blocks) {
  const num = (ref) => { const t = map.get(ref); return t && t.kind === 'n' ? Number(t.val) || 0 : 0; };
  const r3 = (v) => Math.round(v * 1000) / 1000;
  const cached = (ref, v) => map.set(ref, { kind: 'c', val: r3(v) });
  let pointsListed = 0;
  for (let r = 4; r <= 62; r++) pointsListed += num('B' + r);
  cached('B63', pointsListed);
  for (let k = 0; k < blocks; k++) {
    const base = 3 + 9 * k;
    const C = colLetter(base), D = colLetter(base + 1), E = colLetter(base + 2), F = colLetter(base + 3),
      G = colLetter(base + 4), H = colLetter(base + 5), I = colLetter(base + 6),
      J = colLetter(base + 7), K = colLetter(base + 8);
    const n = Math.max(1, num(D + '2'));
    let aufgestellt = 0, sumX = 0, sumW = 0, sumB = 0, sumO = 0, s10 = 0, s50 = 0, s100 = 0;
    for (let r = 4; r <= 62; r++) {
      const ip = num(C + r), pts = num('B' + r) + num(D + r);
      const f = pts * ip;
      cached(F + (r + 72), f); aufgestellt += f;
      const d10 = num(I + r) * pts * 0.1 * ip, d50 = num(J + r) * pts * 0.5 * ip, d100 = num(K + r) * pts * ip;
      cached(I + (r + 71), d10); cached(J + (r + 71), d50); cached(K + (r + 71), d100);
      s10 += d10; s50 += d50; s100 += d100;
      sumX += num(E + r); sumW += num(F + r); sumB += num(G + r); sumO += num(H + r);
    }
    const row63 = [[E, sumX * 0.2 / n], [F, sumW * 0.5 / n], [G, sumB / n], [H, sumO * 2 / n], [I, s10 / n], [J, s50 / n], [K, s100 / n]];
    let deductions = 0;
    row63.forEach(([col, v]) => { cached(col + '63', v); deductions += v; });
    const ergebnis = aufgestellt - deductions;
    cached(F + '75', aufgestellt); cached(E + '64', aufgestellt); cached(J + '64', ergebnis);
    cached(K + '73', ergebnis < aufgestellt ? 1 : 0);
    const nm = map.get(E + '1');
    if (nm && nm.kind === 's') map.set('A' + (75 + k), { kind: 'ct', val: nm.val });
    cached('B' + (75 + k), aufgestellt); cached('C' + (75 + k), ergebnis); cached('E' + (75 + k), aufgestellt - ergebnis);
  }
}

// „Gesamt"-Modus: Marker gesetzt ODER höchstens EIN Kampfgericht mit Eingaben
// (analog isEffectiveGesamt in ArtCycCoach). Robust gegen verlorenen Marker.
function isGesamt(c) {
  if (c.abzug_gesamt || c.abzugGesamt) return true;
  const n = Math.max(1, Math.min(4, Number(c.kampfgerichte || 2)));
  const tables = [c.table1, c.table2, c.table3, c.table4];
  let cnt = 0;
  for (let i = 0; i < n; i++) {
    const has = (tables[i] || []).some(e => e && (
      Number(e.cross || 0) + Number(e.wave || 0) + Number(e.bar || 0) + Number(e.circle || 0) > 0
      || Number(e.schwPct || 0) > 0 || Number(e.taktischePunkte || 0) > 0));
    if (has) cnt++;
  }
  return cnt <= 1;
}

// Ersetzt in einem Durchlauf alle vorhandenen Zellen, deren Ref in der Map
// steht — Stil (s="…") bleibt erhalten. Zellen, die nicht in der Map sind,
// bleiben unverändert.
function applyCells(xml, cellMap) {
  return xml.replace(/<c r="([A-Z]+\d+)"([^>]*?)(?:\/>|>[\s\S]*?<\/c>)/g, (full, ref, attr) => {
    const target = cellMap.get(ref);
    if (!target) return full;
    const sAttr = (attr.match(/ s="\d+"/) || [''])[0];
    if (target.kind === 's') {
      return '<c r="' + ref + '"' + sAttr + ' t="inlineStr"><is><t xml:space="preserve">' + xmlEsc(target.val) + '</t></is></c>';
    }
    // Formel der Vorlage (falls vorhanden) — für Cache-Werte bleibt sie stehen.
    const formula = (full.match(/<f[^>]*\/>|<f[^>]*>[\s\S]*?<\/f>/) || [''])[0];
    if (target.kind === 'c') {
      return '<c r="' + ref + '"' + sAttr + '>' + formula + '<v>' + target.val + '</v></c>';
    }
    if (target.kind === 'ct') {
      return formula
        ? '<c r="' + ref + '"' + sAttr + ' t="str">' + formula + '<v>' + xmlEsc(target.val) + '</v></c>'
        : '<c r="' + ref + '"' + sAttr + ' t="inlineStr"><is><t xml:space="preserve">' + xmlEsc(target.val) + '</t></is></c>';
    }
    return '<c r="' + ref + '"' + sAttr + '><v>' + target.val + '</v></c>';
  });
}

// Entfernt die (nach dem Bearbeiten veraltete) calcChain.xml + ihre Verweise in
// workbook.xml.rels und [Content_Types].xml. Sonst zeigt Excel beim Öffnen einen
// „Inhalt beschädigt – wiederherstellen?"-Dialog. Excel baut die calcChain beim
// Öffnen neu (fullCalcOnLoad ist gesetzt).
function stripCalcChain(files) {
  delete files['xl/calcChain.xml'];
  const rk = 'xl/_rels/workbook.xml.rels';
  if (files[rk]) {
    let s = strFromU8(files[rk]).replace(/<Relationship\b[^>]*Target="calcChain\.xml"[^>]*\/>/g, '');
    files[rk] = strToU8(s);
  }
  const ck = '[Content_Types].xml';
  if (files[ck]) {
    let s = strFromU8(files[ck]).replace(/<Override\b[^>]*PartName="\/xl\/calcChain\.xml"[^>]*\/>/g, '');
    files[ck] = strToU8(s);
  }
}

// Hauptfunktion (Browser): Vorlage holen, befüllen, .xlsm zum Download geben.
export async function exportMauteVorlage({ competitions, athleteName, filename }) {
  if (!(competitions || []).length) throw new Error('Keine Wettkämpfe gewählt');
  const resp = await fetch(VORLAGE_URL);
  if (!resp.ok) throw new Error('Vorlage nicht gefunden (' + resp.status + ')');
  const buf = new Uint8Array(await resp.arrayBuffer());
  const files = unzipSync(buf);

  const sheetKey = 'xl/worksheets/sheet1.xml';
  if (!files[sheetKey]) throw new Error('Vorlage-Struktur unerwartet (sheet1 fehlt)');
  let sheet = strFromU8(files[sheetKey]);
  sheet = applyCells(sheet, buildCellMap(competitions));
  files[sheetKey] = strToU8(sheet);

  // Excel beim Öffnen vollständig neu rechnen lassen (Formeln + Diagramme).
  if (files['xl/workbook.xml']) {
    let wbx = strFromU8(files['xl/workbook.xml']);
    if (/<calcPr[^>]*\/>/.test(wbx)) {
      wbx = wbx.replace(/<calcPr([^>]*?)\/>/, (m, a) => a.includes('fullCalcOnLoad') ? m : '<calcPr' + a + ' fullCalcOnLoad="1"/>');
    }
    files['xl/workbook.xml'] = strToU8(wbx);
  }

  stripCalcChain(files);
  const out = zipSync(files, { level: 6 });
  const blob = new Blob([out], { type: 'application/vnd.ms-excel.sheet.macroEnabled.12' });
  let base = (filename && String(filename).trim())
    || ('Wettkampfstatistik' + (athleteName ? '_' + String(athleteName).replace(/\s+/g, '_') : '')
        + '_' + ((competitions[0] && (competitions[0].date || '').slice(0, 4)) || new Date().getFullYear()));
  base = base.replace(/[\\/:*?"<>|]+/g, '').replace(/\.xlsm$/i, '');
  const fname = base + '.xlsm';
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = fname;
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Für Tests (Node): nur befüllen, Bytes zurückgeben.
export function fillMauteTemplateBytes(templateBytes, { competitions }) {
  const files = unzipSync(new Uint8Array(templateBytes));
  let sheet = strFromU8(files['xl/worksheets/sheet1.xml']);
  sheet = applyCells(sheet, buildCellMap(competitions));
  files['xl/worksheets/sheet1.xml'] = strToU8(sheet);
  if (files['xl/workbook.xml']) {
    let wbx = strFromU8(files['xl/workbook.xml']);
    wbx = wbx.replace(/<calcPr([^>]*?)\/>/, (m, a) => a.includes('fullCalcOnLoad') ? m : '<calcPr' + a + ' fullCalcOnLoad="1"/>');
    files['xl/workbook.xml'] = strToU8(wbx);
  }
  stripCalcChain(files);
  return zipSync(files, { level: 6 });
}
