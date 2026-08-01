#!/usr/bin/env node
// =============================================================
// UCI-Reglement-PDF parsen → SQL-Updates für name_<lang>
// =============================================================
//
// Aufruf:
//   node scripts/parse-uci-pdf.mjs <url> <lang>
//
// Beispiel:
//   node scripts/parse-uci-pdf.mjs \
//     https://kunstradreglement.com/images/PDF/datenfiles_kufa/2026/UCI-Reglement%20Kunstrad%202026%20deutsch.pdf \
//     de
//
// Schreibt docs/uci-exercises-<lang>-seed.sql mit idempotenten UPDATEs
// auf die name_<lang>-Spalte der uci_exercises-Tabelle.
//
// Strategie:
//   • PDF runterladen
//   • pdf-parse → Volltext
//   • Regex auf Zeilen wie "1001 a Reitsitz HR. 0,5" oder
//     "1001 a Side saddle HR. 0.5" (UCI EN-Format)
//   • Map<code, name>
//   • SQL-Output
//
// Anti-Halluzination: das Skript schreibt NUR Namen, die es im PDF
// tatsächlich gefunden hat. Codes ohne Match werden übersprungen
// (mit Warnung). Für Verifizierung gibt's einen --stats-Modus.
// =============================================================

import { writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
// pdf-parse 2.x — Klasse PDFParse statt Default-Export
const { PDFParse } = require('pdf-parse');

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

const args = process.argv.slice(2);
if (args.length < 2) {
  console.error('Usage: node scripts/parse-uci-pdf.mjs <pdf-url> <lang>');
  process.exit(1);
}
const [pdfUrl, lang] = args;
if (!['de', 'en', 'fr'].includes(lang)) {
  console.error('lang muss de | en | fr sein');
  process.exit(1);
}

console.error(`→ Lade PDF: ${pdfUrl}`);
const res = await fetch(pdfUrl);
if (!res.ok) { console.error(`HTTP ${res.status}`); process.exit(1); }
const buf = Buffer.from(await res.arrayBuffer());
console.error(`  geladen: ${(buf.length / 1024).toFixed(0)} kB`);

console.error('→ Extrahiere Text…');
const parser = new PDFParse({ data: buf });
const parsed = await parser.getText();
const text = parsed.text;
console.error(`  Seiten: ${parsed.pages?.length ?? '?'}, Zeichen: ${text.length}`);

// =============================================================
// Auswertung Zeile für Zeile. Wichtig: der Punktwert ist die LETZTE Zahl der
// Zeile — bei taktischen Übungen steht die Basis HINTER der Klammer:
//
//   1001 a  Reitsitz HR. 0,5
//   1175 b  Drehsprung 2-fach T (7,5 - 8,2 - 8,9 - 9,6 - 10,3) 6,8
//                                 └─ Aufwertungsstufen ─┘      └ Basis
//
// Eine faule Regex über den Volltext würde hier nach „(7,5 -" abbrechen und
// 8,2 als Punktwert nehmen. Deshalb: pro Zeile, mit Anker am Zeilenende.
// Manche Einträge sind im PDF umgebrochen (Name endet auf „T", Klammer und
// Punktwert stehen darunter) — die werden über die Folgezeilen eingesammelt.
// =============================================================
const lines = text.split(/\r?\n/);
// Code (4 Ziffern) + ein ODER ZWEI Suffixbuchstaben — „2070aa" ist ein
// eigener Eintrag („aus Reitsitz“) und darf nicht auf „2070a" fallen.
const FULL = /^\s*(\d{4})\s*([a-z]{1,2})\s+(\S.*?)\s+(\d{1,2}[.,]\d)\s*$/;
const HEAD = /^\s*(\d{4})\s*([a-z]{1,2})\s+(\S.*?)\s*$/;
const NUM  = /^\s*(\d{1,2}[.,]\d)\s*$/;

// Disziplin aus erstem Code-Zeichen ableiten (UCI-Konvention)
const DISC_BY_FIRST = { '1': '1er', '2': '2er', '4': '4er', '6': '6er' };

const map = new Map(); // code → { name, points, discipline }
let total = 0, wrapped = 0, skipped = 0;

const clean = (s) => s.replace(/\s+/g, ' ').trim();

/** Übernimmt einen Treffer, wenn er plausibel ist. */
function accept(code, name, pts) {
  // Plausibilitätscheck: Punktwerte zwischen 0.1 und 25.0
  if (!(pts >= 0.1 && pts <= 25)) { skipped++; return; }
  const discipline = DISC_BY_FIRST[code[0]];
  if (!discipline) { skipped++; return; }
  // Überschriften und Reglement-Absätze aussperren („§ 2 2er Kunstradsport"),
  // die sonst als Übung mit der Absatznummer als Punktwert durchrutschen.
  if (/§/.test(name) || name.length < 3) { skipped++; return; }
  // Klammern müssen paarig sein — sonst ist der Name abgeschnitten.
  if ((name.match(/\(/g) || []).length !== (name.match(/\)/g) || []).length) { skipped++; return; }
  total++;
  // Bei mehreren Hits für denselben Code: ersten Treffer nehmen (Reglement
  // wiederholt Codes manchmal in Beispiel-Tabellen)
  if (!map.has(code)) map.set(code, { name, points: pts, discipline });
}

for (let i = 0; i < lines.length; i++) {
  const m = FULL.exec(lines[i]);
  if (m) { accept(m[1] + m[2], clean(m[3]), parseFloat(m[4].replace(',', '.'))); continue; }

  // Umbrochener Eintrag: Kopfzeile ohne Punktwert, darunter (Klammer und)
  // Punktwert. Höchstens drei Folgezeilen weit schauen.
  const h = HEAD.exec(lines[i]);
  if (!h) continue;
  let name = clean(h[3]);
  let pts = null;
  for (let j = i + 1; j <= i + 3 && j < lines.length; j++) {
    const nxt = (lines[j] || '').trim();
    if (!nxt) continue;
    if (HEAD.test(nxt) && FULL.test(nxt)) break;   // schon der nächste Eintrag
    const n = NUM.exec(nxt);
    if (n) { pts = parseFloat(n[1].replace(',', '.')); break; }
    // Fortsetzung mit den Aufwertungsstufen — mal „(7,7 - …)", mal „T (12,0 - …)",
    // je nachdem, wo das PDF umbricht.
    if (/^(T\s*)?\(/.test(nxt)) { name += ' ' + clean(nxt); continue; }
    break;
  }
  if (pts !== null) { wrapped++; accept(h[1] + h[2], name, pts); }
}
console.error(`→ Gefunden: ${map.size} eindeutige Codes (${total} Treffer, davon ${wrapped} umbrochen, ${skipped} verworfen)`);

// =============================================================
// SQL-Output
// =============================================================
const esc = (s) => s.replace(/'/g, "''");
const colName = 'name_' + lang;

const header = `-- =============================================================
-- UCI-Übungen: ${colName}-Updates aus PDF
-- =============================================================
-- Quelle: ${pdfUrl}
-- Geparst: ${new Date().toISOString()}
-- Treffer: ${map.size} Codes
--
-- Auto-generiert von scripts/parse-uci-pdf.mjs — NICHT manuell editieren.
-- Idempotent (ON CONFLICT DO UPDATE).
-- =============================================================

`;

// DE-Modus: kombinierte INSERT-ON-CONFLICT-Statements — bringt neue Codes
// rein und aktualisiert die Namen. EN/FR: nur UPDATE auf den Sprach-Spalten,
// damit fehlende EN-Übersetzungen nicht den Code aus DE überschreiben.
const sortedEntries = [...map.entries()].sort(([a], [b]) => a.localeCompare(b));

const stmts = lang === 'de'
  ? sortedEntries.map(([code, { name, points, discipline }]) =>
      `insert into public.uci_exercises (code, discipline, points, name_de, version)\n` +
      `  values ('${code}', '${discipline}', ${points}, '${esc(name)}', '2026')\n` +
      `  on conflict (code, version) do update set\n` +
      `    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();`
    ).join('\n')
  : sortedEntries.map(([code, { name }]) =>
      `update public.uci_exercises set ${colName} = '${esc(name)}', updated_at = now() where code = '${code}' and version = '2026';`
    ).join('\n');

const footer = `\n\n-- Verifizieren:\n--   select code, ${colName}, name_de from public.uci_exercises where version = '2026' and ${colName} is not null limit 10;\n--   select count(*) from public.uci_exercises where version = '2026' and ${colName} is not null;\n--   -- erwartet: ~${map.size}\n`;

const out = header + stmts + footer;
const outPath = resolve(ROOT, `docs/uci-exercises-${lang}-seed.sql`);
await writeFile(outPath, out, 'utf8');
console.error(`✓ Geschrieben: docs/uci-exercises-${lang}-seed.sql (${(out.length / 1024).toFixed(0)} kB)`);
