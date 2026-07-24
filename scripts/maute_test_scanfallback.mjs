// Beweist den Fix: gescannter Wettkampf (nur program_snapshot, KEIN passendes
// Programm in der Liste) muss im Maute-Export seine i.P.-Spalte gefüllt bekommen.
// Vorher (exercisesFor ohne Fallback) blieb der ganze WK2-Block leer.
import { readFileSync } from 'fs';
import { unzipSync, strFromU8 } from 'fflate';
import { fillMauteTemplateBytes } from '../src/lib/mauteExport.js';

const tpl = readFileSync(new URL('../public/wettkampfstatistik-vorlage.xlsm', import.meta.url));

// mauteExKey identisch zu ArtCycCoach.jsx
function mauteExKey(ex) {
  const c = String((ex && (ex.nr || ex.code)) || '').trim();
  return c ? c.toLowerCase() : String((ex && ex.name) || '').toLowerCase().replace(/\s+/g, ' ').replace(/[ .]+$/, '').trim();
}

// nur Programm A ist in der Liste bekannt (WK2 nutzt ein Programm, das es hier NICHT gibt → Scan/gelöscht)
const programs = [{ id: 'pA', exercises: [
  { id: 'e1', nr: '1186a', name: 'Maute-Sprung', points: 5 },
  { id: 'e2', nr: '1102d', name: 'Sattelstand', points: 4 },
]}];

const comp1 = { name: 'Kreismeisterschaft', date: '2025-03-01', kampfgerichte: 2, program_id: 'pA',
  table1: [{ exerciseId: 'e1', cross: 1 }, { exerciseId: 'e2', wave: 2 }],
  table2: [{ exerciseId: 'e1', cross: 1 }, { exerciseId: 'e2', wave: 0 }] };

// WK2: gescannt — kein program_id, nur program_snapshot
const comp2 = { name: 'Bezirksmeisterschaft', date: '2025-06-01', kampfgerichte: 2, program_id: null,
  program_snapshot: [
    { id: 'e1', nr: '1186a', name: 'Maute-Sprung', points: 5 },
    { id: 'e3', nr: '1249d', name: 'Kehrstandsteiger', points: 6 },
  ],
  table1: [{ exerciseId: 'e1', bar: 1 }, { exerciseId: 'e3', circle: 1 }],
  table2: [{ exerciseId: 'e1', bar: 1 }, { exerciseId: 'e3', circle: 0 }] };

const oldExercisesFor = (c) => { const p = programs.find(pp => pp.id === c.program_id); return (p && p.exercises) || []; };
const newExercisesFor = (c) => {
  const p = programs.find(pp => pp.id === c.program_id);
  if (p && Array.isArray(p.exercises) && p.exercises.length) return p.exercises;
  const ref = c.pdf_ref || null;
  const snap = c.program_snapshot || (ref && ref.program_snapshot) || null;
  if (Array.isArray(snap) && snap.length) return snap;
  const pick = (t) => (Array.isArray(t) && t.some(e => Number(e && e.points) > 0)) ? t : null;
  const src = pick(c.table1) || pick(c.table2) || [];
  const derived = src.map(e => ({ name: e && e.name, code: (e && (e.code || e.nr)) || undefined, points: Number(e && e.points) || 0 }));
  return derived.some(e => mauteExKey(e)) ? derived : [];
};

function cell(sheet, ref) {
  const m = sheet.match(new RegExp('<c r="' + ref + '"[^>]*?(?:/>|>([\\s\\S]*?)</c>)'));
  if (!m) return '(leer)';
  const inner = m[1] || '';
  const t = inner.match(/<t[^>]*>([\s\S]*?)<\/t>/); if (t) return t[1];
  const v = inner.match(/<v>([\s\S]*?)<\/v>/); return v ? v[1] : '(leer)';
}

function run(exFor) {
  const comps = [comp1, comp2].map(c => ({ ...c, exercises: exFor(c) }));
  const out = fillMauteTemplateBytes(tpl, { competitions: comps });
  const sheet = strFromU8(unzipSync(out)['xl/worksheets/sheet1.xml']);
  // WK2-Block k=1: i.P.-Spalte = L. Union-Zeilen: 1186a=4, 1102d=6, 1249d=8
  return { L4: cell(sheet, 'L4'), L6: cell(sheet, 'L6'), L8: cell(sheet, 'L8') };
}

const before = run(oldExercisesFor);
const after = run(newExercisesFor);
console.log('WK2 i.P. (gescannt) — VORHER (ohne Fallback):', before);
console.log('WK2 i.P. (gescannt) — NACHHER (mit Fallback):  ', after);

const pass = after.L4 === '1' && after.L6 === '0' && after.L8 === '1'
  && (before.L4 === '(leer)' || before.L4 === '0');
console.log(pass
  ? '\n✅ Fix bestätigt: WK2 wird jetzt gefüllt (1186a=1, 1102d=0 rausgenommen, 1249d=1 neu). Vorher leer.'
  : '\n❌ Erwartung nicht erfüllt.');
process.exit(pass ? 0 : 1);
