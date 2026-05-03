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

(async () => {
  const data = new Uint8Array(fs.readFileSync(process.argv[2] || '../uploads/113_Wertungsbericht_Geyer__Ruben_Qualifikation_Elite-EM_2026.pdf'));
  const pdf = await pdfjsLib.getDocument({ data }).promise;
  const all = [];
  for (let p = 1; p <= pdf.numPages; p++) {
    const page = await pdf.getPage(p);
    const viewport = page.getViewport({ scale: 1 });
    const txt = await page.getTextContent();
    for (const it of txt.items) {
      const x = it.transform[4];
      const yBaseline = it.transform[5];
      const y = viewport.height - yBaseline;
      all.push({
        text: it.str.trim(),
        x: x,
        y: y,
        width: it.width || 0,
        height: it.height || 0,
        page: p
      });
    }
  }
  console.log('Total items:', all.length);

  const sorted = all.slice().sort((a, b) => a.y - b.y);
  const lines = [];
  for (const it of sorted) {
    const last = lines[lines.length - 1];
    if (last && Math.abs(it.y - last.y) <= 5) {
      last.items.push(it);
    } else {
      lines.push({ y: it.y, items: [it] });
    }
  }
  console.log('Lines:', lines.length);

  const anchorLines = [];
  for (const line of lines) {
    const anchor = line.items.find(it => {
      const xMid = it.x + (it.width || 0) / 2;
      if (Math.abs(xMid - 339.3) >= 12) return false;
      if (!/^\d+,\d+$/.test(it.text)) return false;
      const val = parseFloat(it.text.replace(',', '.'));
      return val >= 0.5 && val <= 20;
    });
    if (anchor) anchorLines.push({ line, anchor });
  }
  console.log('Anchors:', anchorLines.length);

  console.log('\n=== Ex 1 line (anchor "5,7") ===');
  const ex1 = anchorLines[0];
  ex1.line.items.sort((a,b) => a.x - b.x).forEach(it => {
    const xMid = it.x + (it.width || 0) / 2;
    const col = classifyColumn(xMid, 15);
    console.log('  x=' + it.x.toFixed(1) + ' w=' + it.width.toFixed(1) + ' mid=' + xMid.toFixed(1) + ' text="' + it.text + '" col=' + (col || '?'));
  });

  console.log('\n=== Ex 2 line (anchor "13,6") ===');
  const ex2 = anchorLines[1];
  ex2.line.items.sort((a,b) => a.x - b.x).forEach(it => {
    const xMid = it.x + (it.width || 0) / 2;
    const col = classifyColumn(xMid, 15);
    console.log('  x=' + it.x.toFixed(1) + ' w=' + it.width.toFixed(1) + ' mid=' + xMid.toFixed(1) + ' text="' + it.text + '" col=' + (col || '?'));
  });

  console.log('\n=== Ex 16 line (anchor "7,3" mit Taktisch) ===');
  const ex16 = anchorLines.find(a => parseFloat(a.anchor.text.replace(',', '.')) === 7.3);
  if (ex16) {
    ex16.line.items.sort((a,b) => a.x - b.x).forEach(it => {
      const xMid = it.x + (it.width || 0) / 2;
      const col = classifyColumn(xMid, 15);
      console.log('  x=' + it.x.toFixed(1) + ' w=' + it.width.toFixed(1) + ' mid=' + xMid.toFixed(1) + ' text="' + it.text + '" col=' + (col || '?'));
    });
  }

  let withKg1 = 0, withKg2 = 0, withSchw = 0, withTakt = 0;
  for (const { line, anchor } of anchorLines) {
    const kg1 = {}, kg2 = {};
    for (const it of line.items) {
      if (it === anchor) continue;
      if (it.x < 330) continue;
      const xMid = it.x + (it.width || 0) / 2;
      const col = classifyColumn(xMid, 15);
      if (!col || col === 'Pkte') continue;
      const num = parseFloat(it.text.replace(',', '.'));
      if (isNaN(num)) continue;
      const kg = col[col.length - 1];
      const prefix = col.slice(0, -1);
      if (kg === '1') kg1[prefix] = num;
      if (kg === '2') kg2[prefix] = num;
    }
    if (kg1.X || kg1.W || kg1.S || kg1.K) withKg1++;
    if (kg2.X || kg2.W || kg2.S || kg2.K) withKg2++;
    if (kg1.p || kg2.p) withSchw++;
    if (kg1.T || kg2.T) withTakt++;
  }
  console.log('\nDIAGNOSE: KG1 ' + withKg1 + '× KG2 ' + withKg2 + '× Schw ' + withSchw + '× Takt ' + withTakt + '×');
})();
