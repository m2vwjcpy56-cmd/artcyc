// Prüft die Programm-Validierung gegen das Reglement.
//
//     node docs/reglement-test.mjs
//
// Die Fälle sind klein und einzeln lesbar: jede Zeile ist eine Übungsfolge und
// die Zahl der Befunde, die dabei herauskommen MUSS. Entsteht beim nächsten
// Reglement eine neue Tabelle, zeigt dieser Lauf sofort, was sich verschoben hat.
//
// Die Tabellen selbst (Folgeübungen, „Einzeln", Schreibfehler) prüft
// `python3 docs/reglement-tabellen.py --check` gegen den ganzen Katalog.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const REPO = path.dirname(path.dirname(fileURLToPath(import.meta.url)));

// uciRules.js zieht supabase.js nach — hier nicht vorhanden und nicht nötig.
const quelle = fs.readFileSync(path.join(REPO, 'src/lib/uciRules.js'), 'utf8')
  .replace(/^import .*supabase\.js.*$/m, 'const supabase = null;');
const tmp = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'artcyc-')), 'rules.mjs');
fs.writeFileSync(tmp, quelle);
const { validateProgram, disciplineKey, isOnOneWheel2er, ERSTE_AUF_EINEM_RAD_2ER,
        ageClassKey, istSchueler, AGE_CLASSES } = await import(tmp);

let ok = 0, fehlt = 0;
const pruefe = (name, bedingung, zusatz = '') => {
  if (bedingung) { ok++; console.log(`  ✓ ${name}`); }
  else { fehlt++; console.log(`  ✗ ${name}${zusatz ? '  — ' + zusatz : ''}`); }
};

const befunde = (codes, disc = '2er', age = 'elite') =>
  validateProgram({ discipline: disc, exercises: codes.map(c => ({ code: c, name: c })) },
                  { ageClass: age }).errors;
const zahl = (codes, regel, disc = '2er') => befunde(codes, disc).filter(e => e.rule === regel).length;

// ── 8.2.028 Pflicht-Folgeübungen
console.log('\n8.2.028 — Pflicht-Folgeübung nach einem Übergang');
[
  ['Übergang + richtige Folgeübung', ['2236a', '2161a'], 0],
  ['Übergang + falsche Folgeübung', ['2236a', '2131a'], 1],
  ['Übergang als letzte Übung', ['2131a', '2236a'], 1],
  ['Standdrehung zählt als Folgeübung', ['2236a', '2211a'], 0],
  ['1er: Übergang + richtig', ['1283a', '1226a'], 0],
  ['1er: Übergang + falsch', ['1283a', '1201a'], 1],
  ['Ziel Fronthang schränkt nicht ein', ['1281b', '1001a'], 0],
  ['Einrad-Übergang 2471a richtig', ['2471a', '2426a'], 0],
  ['Einrad-Übergang 2471a falsch', ['2471a', '2161a'], 1],
  ['kein Übergang hinter Übergang', ['1283a', '1286a', '1236a'], 1],
].forEach(([name, codes, soll]) => {
  const ist = zahl(codes, 'follow_up', codes[0][0] === '1' ? '1er' : '2er');
  pruefe(`${name} (${soll})`, ist === soll, `gefunden ${ist}`);
});

// Ein echtes Programm mit acht Übergängen — jede Folgeübung sitzt richtig.
const echtes1er = ['1103a', '1123l', '1284a', '1237a', '1282a', '1248c', '1281a', '1236e',
  '1202f', '1212b', '1217b', '1102a', '1285a', '1249d', '1104o', '1121a', '1105a', '1124c',
  '1203g', '1204d', '1290a', '1229d', '1228e', '1292b', '1238c', '1291a', '1246b', '1239a',
  '1289a', '1247b'];
pruefe('echtes 30er-Programm ohne Befund', befunde(echtes1er, '1er').length === 0,
       JSON.stringify(befunde(echtes1er, '1er').map(e => e.rule)));

// ── 8.1.020 „Einzeln" und Standdrehungen
console.log('\n8.1.020 — „Einzeln" und Standdrehungen');
pruefe('3 × Einzeln sind erlaubt', zahl(['2067a', '2068a', '2069a'], 'too_many_einzeln') === 0);
pruefe('4 × Einzeln sind zu viel', zahl(['2067a', '2068a', '2069a', '2071a'], 'too_many_einzeln') === 1);
pruefe('Übergang „einzeln" zählt nicht mit',
       zahl(['2067a', '2068a', '2069a', '2242a'], 'too_many_einzeln') === 0);
pruefe('„Einzeln" greift ohne deutschen Namen',
       validateProgram({ discipline: '2er', exercises:
         ['2067a', '2068a', '2069a', '2071a'].map(c => ({ code: c, name: 'alone' })) },
         { ageClass: 'elite' }).errors.some(e => e.rule === 'too_many_einzeln'));
pruefe('3 Standdrehungen erlaubt, auch mit je 3 Drehungen',
       zahl(['2215c', '2214c', '2212c'], 'too_many_standdrehung') === 0);
pruefe('4 Standdrehungen sind zu viel',
       zahl(['2215c', '2214c', '2212c', '2211a'], 'too_many_standdrehung') === 1);

// ── Disziplin-Schreibweise: beide Apps schreiben in dieselbe Tabelle
console.log('\nDisziplin — „2er" und „2er Kunstrad" müssen gleich geprüft werden');
pruefe('disciplineKey („2er Kunstrad")', disciplineKey('2er Kunstrad') === '2er');
pruefe('disciplineKey („4er-OB")', disciplineKey('4er-OB') === '4er');
pruefe('disciplineKey (Unsinn)', disciplineKey('Einrad') === null);
const zuViele = ['2067a', '2068a', '2069a', '2071a'];
pruefe('„2er Kunstrad" findet dieselben Befunde wie „2er"',
       zahl(zuViele, 'too_many_einzeln', '2er Kunstrad') === zahl(zuViele, 'too_many_einzeln', '2er'));
pruefe('Höchstzahl greift auch bei „1er Kunstrad"',
       befunde(Array.from({ length: 31 }, (_, i) => `1${String(100 + i)}a`), '1er Kunstrad')
         .some(e => e.rule === 'count_max'));

// ── Radgrenze im 2er
console.log('\n8.2.002 / 8.2.006 — Radzahl');
pruefe(`Grenze steht bei ${ERSTE_AUF_EINEM_RAD_2ER}`, ERSTE_AUF_EINEM_RAD_2ER === 2261);
pruefe('2261 steht auf einem Rad', isOnOneWheel2er({ code: '2261a' }));
pruefe('2250 steht auf zwei Rädern', !isOnOneWheel2er({ code: '2250a' }));
pruefe('ein Radwechsel ist erlaubt',
       zahl(['2001a', '2002a', '2261a', '2262a'], 'wheel_change') === 0);
pruefe('zwei Radwechsel sind einer zu viel',
       zahl(['2001a', '2261a', '2002a', '2262a'], 'wheel_change') === 1);

// ── Altersklassen: fünf Klassen, zwei Grenzsätze
console.log('\n8.1.010 / 8.2.002 / 8.2.003 — Altersklassen');
pruefe('fünf Klassen', AGE_CLASSES.length === 5, AGE_CLASSES.join(', '));
pruefe('U13 ist eine Schülerklasse', istSchueler('u13'));
pruefe('Junioren sind keine Schülerklasse', !istSchueler('junioren'));
pruefe('Alt-Wert „schueler" bleibt eine Schülerklasse', istSchueler(ageClassKey('schueler')));
pruefe('leere Angabe wird Elite', ageClassKey(null) === 'elite');
const einer26 = Array.from({ length: 26 }, (_, i) => `1${String(100 + i)}a`);
pruefe('26 Übungen: für Elite erlaubt',
       !befunde(einer26, '1er', 'elite').some(e => e.rule === 'count_max'));
['u15', 'u13', 'u11'].forEach(k =>
  pruefe(`26 Übungen: für ${k} zu viele`,
         befunde(einer26, '1er', k).some(e => e.rule === 'count_max')));
pruefe('Junioren rechnen wie Elite',
       befunde(einer26, '1er', 'junioren').length === befunde(einer26, '1er', 'elite').length);
pruefe('Schüler dürfen 4 Übungen auf einem Rad',
       !befunde(['2001a', '2261a', '2262a', '2263a', '2264a'], '2er', 'u11')
         .some(e => e.rule === 'two_split_min'));
pruefe('Elite nicht — dort sind 8 das Minimum',
       befunde(['2001a', '2261a', '2262a', '2263a', '2264a'], '2er', 'elite')
         .some(e => e.rule === 'two_split_min'));

// ── Schreibfehler des Reglements
console.log('\nSuche — die vier Verschreiber in den Übungstabellen');
const jsx = fs.readFileSync(path.join(REPO, 'src/ArtCycCoach.jsx'), 'utf8');
const block = jsx.slice(jsx.indexOf('REGLEMENT_SCHREIBFEHLER = ['), jsx.indexOf('// erzeugt:ende'));
const paare = [...block.matchAll(/\['([^']+)',\s*'([^']+)'\]/g)].map(m => [m[1], m[2]]);
const fold = s => paare.reduce((t, [f, r]) => t.split(f).join(r), String(s).toLowerCase());
pruefe('vier Paare erzeugt', paare.length === 4, `gefunden ${paare.length}`);
[['Reitsitz', 'Frontlenkerstanddrehung 1-fach aus Reitzsitz T (8,8)'],
 ['Reitsitzsteiger', 'Reisitzsteiger rw. frh. / Brustschwebehang R.'],
 ['Seitvorhebehalte', 'Seitvorhabehalte Deutscher Sattellenkerhandstand Einzeln HR.'],
 ['Brustschwebehang', 'Reitsitz rw. / Brustschwegehang R.'],
].forEach(([suche, name]) =>
  pruefe(`„${suche}" findet „${name.slice(0, 32)}…"`, fold(name).includes(fold(suche))));

fs.rmSync(path.dirname(tmp), { recursive: true, force: true });
console.log(`\n${ok} von ${ok + fehlt} Prüfungen bestanden.`);
process.exit(fehlt ? 1 : 0);
