#!/usr/bin/env node
// =============================================================
// Extrahiert UCI_DB_2026 aus src/ArtCycCoach.jsx und schreibt
// docs/uci-exercises-seed.sql mit allen 2011 INSERTs.
//
// Idempotent: ON CONFLICT (code, version) DO UPDATE — wir können
// das Skript also auch nach Code-Änderungen erneut laufen lassen.
// =============================================================

import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

const src = await readFile(resolve(ROOT, 'src/ArtCycCoach.jsx'), 'utf8');

// Region zwischen "const UCI_DB_2026 = [" und "];" extrahieren
const startIdx = src.indexOf('const UCI_DB_2026 = [');
if (startIdx < 0) { console.error('UCI_DB_2026 nicht gefunden'); process.exit(1); }
const endIdx = src.indexOf('\n];', startIdx);
const region = src.slice(startIdx, endIdx);

// Zeilen wie {c:'1001a',n:'Reitsitz HR.',p:0.5,d:'1er'}
const re = /\{c:'([^']+)',n:'([^']*)',p:([0-9.]+),d:'([1-9]er)'\}/g;
const rows = [];
let m;
while ((m = re.exec(region)) !== null) {
  rows.push({ code: m[1], name: m[2], points: parseFloat(m[3]), disc: m[4] });
}
console.error(`Gefunden: ${rows.length} Übungen`);

const esc = (s) => s.replace(/'/g, "''");

const header = `-- =============================================================
-- UCI-Übungen 2026 — Seed der name_de-Spalte
-- =============================================================
-- Auto-generiert von scripts/seed-uci-db.mjs aus UCI_DB_2026
-- in src/ArtCycCoach.jsx. NICHT manuell editieren — bei Code-
-- Änderungen Script neu laufen lassen:
--   node scripts/seed-uci-db.mjs > docs/uci-exercises-seed.sql
-- =============================================================

`;

const stmts = rows.map(r =>
  `insert into public.uci_exercises (code, discipline, points, name_de, version)\n` +
  `  values ('${esc(r.code)}', '${r.disc}', ${r.points}, '${esc(r.name)}', '2026')\n` +
  `  on conflict (code, version) do update set\n` +
  `    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();`
).join('\n');

const footer = `\n\n-- Seed-Verifizierung:\n--   select count(*) from public.uci_exercises where version = '2026';\n--   -- erwartet: ${rows.length}\n`;

const out = header + stmts + footer;
await writeFile(resolve(ROOT, 'docs/uci-exercises-seed.sql'), out, 'utf8');
console.error(`Geschrieben: docs/uci-exercises-seed.sql (${rows.length} INSERTs, ${(out.length / 1024).toFixed(0)} kB)`);
