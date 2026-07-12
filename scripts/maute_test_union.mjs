import { readFileSync } from 'fs';
import { unzipSync, strFromU8 } from 'fflate';
import { fillMauteTemplateBytes } from '../src/lib/mauteExport.js';

const tpl = readFileSync(new URL('../public/wettkampfstatistik-vorlage.xlsm', import.meta.url));

// Szenario: Programmwechsel über die Saison.
// WK1: 1186a (Maute-Sprung) + 1102d (Sattelstand)
// WK2: 1186a (Maute-Sprung) + 1249d (Kehrstandsteiger)  <- 1102d RAUS, 1249d REIN
const comps = [
  {
    name: 'Kreismeisterschaft', date: '2025-03-01', kampfgerichte: 2,
    exercises: [
      { id: 'e1', nr: '1186a', name: 'Maute-Sprung', points: 5 },
      { id: 'e2', nr: '1102d', name: 'Sattelstand', points: 4 },
    ],
    table1: [{ exerciseId: 'e1', cross: 1 }, { exerciseId: 'e2', wave: 2 }],
    table2: [{ exerciseId: 'e1', cross: 1 }, { exerciseId: 'e2', wave: 0 }],
  },
  {
    name: 'Bezirksmeisterschaft', date: '2025-06-01', kampfgerichte: 2,
    exercises: [
      { id: 'e1', nr: '1186a', name: 'Maute-Sprung', points: 5 },
      { id: 'e3', nr: '1249d', name: 'Kehrstandsteiger', points: 6 },
    ],
    table1: [{ exerciseId: 'e1', bar: 1 }, { exerciseId: 'e3', circle: 1 }],
    table2: [{ exerciseId: 'e1', bar: 1 }, { exerciseId: 'e3', circle: 0 }],
  },
];

const out = fillMauteTemplateBytes(tpl, { competitions: comps });
const sheet = strFromU8(unzipSync(out)['xl/worksheets/sheet1.xml']);

function cell(ref) {
  const m = sheet.match(new RegExp('<c r="' + ref + '"[^>]*?(?:/>|>([\\s\\S]*?)</c>)'));
  if (!m) return '(leer)';
  const inner = m[1] || '';
  const t = inner.match(/<t[^>]*>([\s\S]*?)<\/t>/);
  if (t) return t[1];
  const v = inner.match(/<v>([\s\S]*?)<\/v>/);
  return v ? v[1] : '(leer)';
}

const rows = [
  ['A4 (Übung Zeile1)', cell('A4'), '1186a. Maute-Sprung'],
  ['A6 (Übung Zeile2)', cell('A6'), '1102d. Sattelstand'],
  ['A8 (Übung Zeile3)', cell('A8'), '1249d. Kehrstandsteiger'],
  ['B4/B6/B8 (Punkte)', cell('B4') + '/' + cell('B6') + '/' + cell('B8'), '5/4/6'],
  ['E1 (WK1 Name)', cell('E1'), 'Kreismeisterschaft 01.03.25'],
  ['N1 (WK2 Name)', cell('N1'), 'Bezirksmeisterschaft 01.06.25'],
  ['D2/M2 (Anz KG)', cell('D2') + '/' + cell('M2'), '2/2'],
  ['--- WK1 i.P. (C) ---', '', ''],
  ['C4 (1186a in WK1?)', cell('C4'), '1'],
  ['C6 (1102d in WK1?)', cell('C6'), '1'],
  ['C8 (1249d in WK1?)', cell('C8'), '0  ← nicht im Programm'],
  ['E4 (WK1 X für 1186a)', cell('E4'), '2  (KG1+KG2 cross)'],
  ['F6 (WK1 ~ für 1102d)', cell('F6'), '2'],
  ['--- WK2 i.P. (L) ---', '', ''],
  ['L4 (1186a in WK2?)', cell('L4'), '1'],
  ['L6 (1102d in WK2?)', cell('L6'), '0  ← rausgenommen'],
  ['L8 (1249d in WK2?)', cell('L8'), '1  ← neu aktiviert'],
  ['P4 (WK2 | für 1186a)', cell('P4'), '2  (bar KG1+KG2)'],
  ['Q8 (WK2 ○ für 1249d)', cell('Q8'), '1  (circle)'],
];
let ok = 0, total = 0;
for (const [label, got, exp] of rows) {
  if (!exp) { console.log('\n' + label); continue; }
  const expVal = exp.split(' ')[0];
  const pass = String(got) === expVal;
  total++; if (pass) ok++;
  console.log(`${pass ? '✅' : '❌'} ${label.padEnd(24)} = ${String(got).padEnd(28)} (erwartet ${exp})`);
}
console.log(`\n${ok}/${total} korrekt`);
