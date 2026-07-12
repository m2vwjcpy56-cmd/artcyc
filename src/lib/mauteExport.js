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
function buildCellMap(comps) {
  const map = new Map();
  const selected = (comps || []).slice(0, MAX_COMPS);
  const rowOf = (i) => 4 + 2 * i; // Übung i (0-basiert) → Zeile

  // 1) Vereinigung aller Übungen über alle gewählten Wettkämpfe.
  const union = [];
  const unionIdx = new Map();
  selected.forEach((c) => {
    (c.exercises || []).forEach((ex) => {
      const k = exKey(ex);
      if (!k) return;
      if (!unionIdx.has(k)) {
        unionIdx.set(k, union.length);
        union.push({ key: k, nr: ex.nr || ex.code || '', name: ex.name || '', points: Number(ex.points || 0) });
      }
    });
  });
  const U = union.slice(0, MAX_EXERCISES);

  // 2) Stammdaten je Übung: Name (A) + Punkte (B).
  U.forEach((u, i) => {
    const r = rowOf(i);
    const nr = u.nr ? u.nr + '. ' : (i + 1) + '. ';
    map.set('A' + r, { kind: 's', val: nr + (u.name || ('Übung ' + (i + 1))) });
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
    map.set(nameCol + '1', { kind: 's', val: (c.name || 'Wettkampf') + (c.date ? ' ' + dateShort(c.date) : '') });
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

    U.forEach((u, i) => {
      const r = rowOf(i);
      const hit = idxByKey.get(u.key);
      if (!hit) { map.set(iPcol + r, { kind: 'n', val: 0 }); return; } // nicht im Programm → i.P.=0
      map.set(iPcol + r, { kind: 'n', val: 1 });                       // im Programm → i.P.=1
      const ex = hit.ex, idx = hit.j;
      const pick = (t) => (t.find(e => e && e.exerciseId === ex.id) || t[idx] || {});
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
      setN(E, sum(e => e.cross)); // X
      setN(F, sum(e => e.wave));  // ~
      setN(G, sum(e => e.bar));   // |
      setN(H, sum(e => e.circle)); // ○
      setN(I, pctCount(10));      // 10%
      setN(J, pctCount(50));      // 50%
      setN(K, pctCount(100));     // 100%
    });
  });
  return map;
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
