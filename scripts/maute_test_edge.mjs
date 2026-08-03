// Randabzüge im Maute-Export: Fehler VOR der ersten und NACH der letzten Übung
// haben in der offiziellen Statistik keine eigene Zeile. Sie müssen auf die erste
// bzw. letzte Übung DIESES Wettkampfs angerechnet werden — sonst fehlen sie im
// Blatt und die Summe liegt unter dem Ergebnis in der App.
import { readFileSync } from 'fs';
import { unzipSync, strFromU8 } from 'fflate';
import { fillMauteTemplateBytes } from '../src/lib/mauteExport.js';

const tpl = readFileSync(new URL('../public/wettkampfstatistik-vorlage.xlsm', import.meta.url));

// Drei Übungen. Randeinträge stehen HINTER den Übungen und tragen den Marker.
//   KG1: vor Übung 1 → 2 Wellen · nach Übung 3 → 1 Strich
//   KG2: vor Übung 1 → 1 Kreuz
// Dazu je Übung ein normaler Abzug, damit die Addition sichtbar wird.
const comps = [{
  name: 'Randabzug-Test', date: '2026-08-03', kampfgerichte: 2,
  exercises: [
    { id: 'e1', nr: '1186a', name: 'Maute-Sprung', points: 5 },
    { id: 'e2', nr: '1102d', name: 'Sattelstand', points: 4 },
    { id: 'e3', nr: '1249d', name: 'Kehrstandsteiger', points: 6 },
  ],
  table1: [
    { exerciseId: 'e1', cross: 1 },
    { exerciseId: 'e2', wave: 1 },
    { exerciseId: 'e3', bar: 1 },
    { edge: 'pre', wave: 2 },
    { edge: 'post', bar: 1 },
  ],
  table2: [
    { exerciseId: 'e1', cross: 2 },
    { exerciseId: 'e2' },
    { exerciseId: 'e3' },
    { edge: 'pre', cross: 1 },
    { edge: 'post' },
  ],
}];

const out = fillMauteTemplateBytes(tpl, { competitions: comps });
const sheet = strFromU8(unzipSync(out)['xl/worksheets/sheet1.xml']);

function cell(ref) {
  const m = sheet.match(new RegExp('<c r="' + ref + '"[^>]*?(?:/>|>([\\s\\S]*?)</c>)'));
  if (!m) return '';
  const inner = m[1] || '';
  const t = inner.match(/<t[^>]*>([\s\S]*?)<\/t>/);
  if (t) return t[1];
  const v = inner.match(/<v>([\s\S]*?)<\/v>/);
  return v ? v[1] : '';
}

// Block 1: i.P.=C, T=D, X=E, ~=F, |=G, ○=H. Übung i → Zeile 4+2i.
const checks = [
  // Übung 1 (Zeile 4): X = 1 (KG1) + 2 (KG2) = 3, dazu 1 Kreuz vom Rand (KG2) → 4
  ['E4', '4', 'Übung 1: Kreuze inkl. Randabzug vor Übung 1'],
  // ~ = 0 aus der Übung, aber 2 Wellen vom Rand (KG1) → 2
  ['F4', '2', 'Übung 1: Wellen kommen komplett vom Randabzug'],
  // Übung 2 (Zeile 6): unverändert 1 Welle, kein Rand
  ['F6', '1', 'Übung 2: unberührt'],
  ['E6', '', 'Übung 2: keine Kreuze'],
  // Übung 3 (Zeile 8): | = 1 (KG1) + 1 Strich vom Rand nach Übung 3 → 2
  ['G8', '2', 'Übung 3: Striche inkl. Randabzug nach der letzten Übung'],
];

let bad = 0;
for (const [ref, want, label] of checks) {
  const got = cell(ref);
  const ok = String(got) === String(want);
  if (!ok) bad++;
  console.log(`${ok ? '✓' : '✗'} ${ref} = ${got === '' ? '(leer)' : got}  (erwartet ${want === '' ? '(leer)' : want})  — ${label}`);
}

// Gegenprobe: die Summe der Abzugspunkte im Blatt muss dem Ergebnis der App
// entsprechen. Gewichte laut Vorlage: X 0,2 · ~ 0,5 · | 1,0 · ○ 2,0.
const w = { E: 0.2, F: 0.5, G: 1.0, H: 2.0 };
let sheetSum = 0;
for (const col of Object.keys(w)) {
  for (const row of [4, 6, 8]) sheetSum += Number(cell(col + row) || 0) * w[col];
}
// App-Rechnung: alle Zeichen aus BEIDEN Kampfgerichten, Randeinträge eingeschlossen.
const appSum = [...comps[0].table1, ...comps[0].table2].reduce((a, e) =>
  a + Number(e.cross || 0) * 0.2 + Number(e.wave || 0) * 0.5
    + Number(e.bar || 0) * 1.0 + Number(e.circle || 0) * 2.0, 0);
const sumOk = Math.abs(sheetSum - appSum) < 0.0001;
if (!sumOk) bad++;
console.log(`${sumOk ? '✓' : '✗'} Summe Blatt ${sheetSum.toFixed(2)} = App ${appSum.toFixed(2)} — kein Abzug geht verloren`);

console.log(bad === 0 ? '\nAlle Prüfungen bestanden.' : `\n${bad} Prüfung(en) fehlgeschlagen.`);
process.exit(bad === 0 ? 0 : 1);
