// Debug: Was passiert beim Import von Jonas's PDF?
// Reproduziert die Parser+applyImport-Logik außerhalb von React.
const pdfjsLib = require('pdfjs-dist/legacy/build/pdf.js');
const fs = require('fs');

const WERTUNGSBERICHT_COLS = {
  Pkte: 339.3,
  T1: 364.7, T2: 390.3, T3: 415.8,
  p1: 441.3, p2: 466.9, p3: 492.4,
  X1: 517.8, X2: 543.4, X3: 569.0,
  W1: 594.4, W2: 620.0, W3: 645.6,
  S1: 670.9, S2: 696.5, S3: 722.1,
  K1: 747.4, K2: 773.0, K3: 798.6
};
function classifyColumn(xMid, maxDist = 12) {
  let best = null, bestD = 999;
  for (const [name, cx] of Object.entries(WERTUNGSBERICHT_COLS)) {
    const d = Math.abs(xMid - cx);
    if (d < bestD) { best = name; bestD = d; }
  }
  return bestD < maxDist ? best : null;
}
function parseRows(items) {
  const sorted = items.slice().sort((a, b) => a.y - b.y);
  const lines = [];
  for (const it of sorted) {
    const last = lines[lines.length - 1];
    if (last && Math.abs(it.y - last.y) <= 5) last.items.push(it);
    else lines.push({ y: it.y, items: [it] });
  }
  const rows = [];
  for (const line of lines) {
    const anchor = line.items.find(it => {
      const xMid = it.x + (it.width || 0) / 2;
      if (Math.abs(xMid - 339.3) >= 12) return false;
      if (!/^\d+,\d+$/.test(it.text)) return false;
      const val = parseFloat(it.text.replace(',', '.'));
      return val >= 0.5 && val <= 20;
    });
    if (!anchor) continue;
    const row = { y: anchor.y, points: parseFloat(anchor.text.replace(',', '.')), kg1: {}, kg2: {}, code: null, name: '' };
    const nameTokens = [];
    for (const it of line.items) {
      if (it === anchor) continue;
      if (it.x < 60) {
        const m = it.text.match(/^\d{0,2}(\d{4}[a-z]?)$/);
        if (m) row.code = m[1];
        continue;
      }
      if (it.x < 330) { nameTokens.push({ x: it.x, text: it.text }); continue; }
      const xMid = it.x + (it.width || 0) / 2;
      const col = classifyColumn(xMid, 15);
      if (!col || col === 'Pkte') continue;
      const num = parseFloat(it.text.replace(',', '.'));
      if (isNaN(num)) continue;
      const kg = col[col.length - 1];
      const prefix = col.slice(0, -1);
      const target = row['kg' + kg];
      if (target) target[prefix] = num;
    }
    nameTokens.sort((a, b) => a.x - b.x);
    row.name = nameTokens.map(t => t.text).join(' ').replace(/\s+/g, ' ').trim();
    rows.push(row);
  }
  return rows;
}

// Maute Program (= prog_default for Ruben/admin user)
const MAUTE = [
  { code: '1103a', points: 5.7 }, { code: '1123l', points: 13.6 }, { code: '1284a', points: 5.3 },
  { code: '1237a', points: 4.4 }, { code: '1282a', points: 7.0 }, { code: '1248c', points: 6.5 },
  { code: '1281a', points: 5.0 }, { code: '1236e', points: 5.1 }, { code: '1202f', points: 6.5 },
  { code: '1212b', points: 6.2 }, { code: '1217b', points: 6.0 }, { code: '1117c', points: 6.5 },
  { code: '1102a', points: 6.5 }, { code: '1285a', points: 6.4 }, { code: '1249d', points: 8.8 },
  { code: '1104o', points: 7.3 }, { code: '1121a', points: 4.4 }, { code: '1124c', points: 8.8 },
  { code: '1203g', points: 5.7 }, { code: '1204d', points: 7.8 }, { code: '1290a', points: 5.1 },
  { code: '1229d', points: 7.4 }, { code: '1228e', points: 5.5 }, { code: '1292b', points: 5.8 },
  { code: '1238c', points: 5.5 }, { code: '1291a', points: 6.8 }, { code: '1246b', points: 4.6 },
  { code: '1239a', points: 4.8 }, { code: '1289a', points: 6.1 }, { code: '1247b', points: 5.9 }
];

(async () => {
  const file = process.argv[2] || '../uploads/109_Beiter.pdf';
  const data = new Uint8Array(fs.readFileSync(file));
  const pdf = await pdfjsLib.getDocument({ data }).promise;
  const items = [];
  for (let p = 1; p <= pdf.numPages; p++) {
    const page = await pdf.getPage(p);
    const viewport = page.getViewport({ scale: 1 });
    const txt = await page.getTextContent();
    for (const it of txt.items) {
      items.push({ text: it.str.trim(), x: it.transform[4], y: viewport.height - it.transform[5], width: it.width || 0 });
    }
  }
  const rows = parseRows(items);
  console.log('Anchors:', rows.length);
  console.log('\n=== Jonas PDF rows vs Maute prog_default ===');
  console.log('Idx | PDF code  | PDF pts | Maute code | Maute pts | match?');
  console.log('----|-----------|---------|------------|-----------|------');
  let allMatch = true;
  for (let i = 0; i < Math.max(rows.length, MAUTE.length); i++) {
    const r = rows[i] || {};
    const m = MAUTE[i] || {};
    const codeMatch = (r.code || '') === (m.code || '');
    const pointsMatch = Math.abs(Number(r.points || 0) - Number(m.points || 0)) < 0.01;
    const both = codeMatch && pointsMatch;
    if (!both) allMatch = false;
    console.log(
      String(i).padStart(2) + '  | ' +
      String(r.code || '?').padEnd(9) + ' | ' +
      String((r.points || 0).toFixed(1)).padEnd(7) + ' | ' +
      String(m.code || '?').padEnd(10) + ' | ' +
      String((m.points || 0).toFixed(1)).padEnd(9) + ' | ' +
      (both ? 'OK' : 'NO')
    );
  }
  console.log('\nmatchesExactly würde liefern:', allMatch ? 'TRUE → prog_default wird wiederverwendet' : 'FALSE → frisches Programm wird erzeugt');

  // Was ist dann Aufgestellt?
  console.log('\n=== Aufgestellt-Berechnung ===');
  let pdfBaseSum = 0, pdfTaktSum = 0;
  for (const r of rows) {
    pdfBaseSum += r.points;
    const t = r.kg1?.T || 0;
    pdfTaktSum += (t > 0 ? t : r.points);
  }
  console.log('Basis-Summe PDF:', pdfBaseSum.toFixed(2), '(soll Programm-Summe werden bei frischem Programm)');
  console.log('Mit taktischer Aufwertung:', pdfTaktSum.toFixed(2));

  // Simuliere prog_default-Pfad: Aufgestellt = sum von (taktischePunkte || prog_default.points)
  let progDefaultAuf = 0;
  for (let i = 0; i < rows.length; i++) {
    const t = rows[i].kg1?.T || 0;
    progDefaultAuf += (t > 0 ? t : MAUTE[i].points);
  }
  console.log('Aufgestellt mit prog_default-Punkten + Jonas-Taktisch:', progDefaultAuf.toFixed(2),
    '(< erwartet wenn das Bug-Symptom 190.80 ist)');
})();
