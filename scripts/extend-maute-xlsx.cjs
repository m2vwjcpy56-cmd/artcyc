// Liest Maute-Sprung Statistik.xlsx, ergänzt die Sessions vom Screenshot
// (17.04. - 30.04.2026) und schreibt eine neue Datei.
const xlsx = require('xlsx');
const path = require('path');

const SRC = process.argv[2];
const OUT = process.argv[3];
if (!SRC || !OUT) { console.error('Usage: node extend-maute-xlsx.cjs <src.xlsx> <out.xlsx>'); process.exit(1); }

const wb = xlsx.readFile(SRC, { cellDates: false });
const sheet = wb.SheetNames[0];
const ws = wb.Sheets[sheet];
// raw: false → Datums-Zellen werden als formatierte Strings ausgegeben (z.B. "2024-01-27")
const rows = xlsx.utils.sheet_to_json(ws, { defval: null, raw: false });

// Letzte ID ermitteln
const lastId = rows.reduce((m, r) => Math.max(m, Number(r['ID']) || 0), 0);
console.log('Bestehende Sessions:', rows.length, '— letzte ID:', lastId);

// Neue Sessions ab Screenshot
const newRows = [
  ['2026-04-17', 8, 2, 0],
  ['2026-04-20', 8, 2, 0],
  ['2026-04-22', 5, 4, 1],
  ['2026-04-27', 10, 0, 0],
  ['2026-04-29', 6, 3, 1],
  ['2026-04-30', 5, 5, 0],
  ['2026-04-30', 8, 2, 0]
];

let id = lastId;
for (const [datum, geklappt, getroffen, gefaehrlich] of newRows) {
  id += 1;
  const total = geklappt + getroffen + gefaehrlich;
  rows.push({
    'ID': String(id),
    'Datum': datum,
    'Geklappt': String(geklappt),
    'Getroffen': String(getroffen),
    'Gefährlich': String(gefaehrlich),
    'Gesamt': String(total),
    'Quote Geklappt %': String(Math.round((geklappt / total) * 100)),
    'Quote Getroffen %': String(Math.round((getroffen / total) * 100)),
    'Quote Gefährlich %': String(Math.round((gefaehrlich / total) * 100))
  });
}

console.log('Neue Sessions:', newRows.length);
console.log('Total nach Update:', rows.length);

// Header in der erwarteten Reihenfolge
const header = ['ID', 'Datum', 'Geklappt', 'Getroffen', 'Gefährlich', 'Gesamt', 'Quote Geklappt %', 'Quote Getroffen %', 'Quote Gefährlich %'];
const newWs = xlsx.utils.json_to_sheet(rows, { header });
const newWb = xlsx.utils.book_new();
xlsx.utils.book_append_sheet(newWb, newWs, 'Serien');
xlsx.writeFile(newWb, OUT);
console.log('Geschrieben:', OUT);

// Kontroll-Output: letzte 10 Zeilen
console.log('\nLetzte 10 Sessions:');
for (const r of rows.slice(-10)) {
  console.log(' ', r['ID'], r['Datum'], r['Geklappt'] + 'g/' + r['Getroffen'] + 't/' + r['Gefährlich'] + 'gef');
}
