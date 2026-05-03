const xlsx = require('xlsx');
const fp = process.argv[2];
const wb = xlsx.readFile(fp);
for (const name of wb.SheetNames) {
  const ws = wb.Sheets[name];
  const range = xlsx.utils.decode_range(ws['!ref'] || 'A1:A1');
  console.log('===', name, '— rows:', range.e.r + 1, 'cols:', range.e.c + 1, '===');
  const json = xlsx.utils.sheet_to_json(ws, { header: 1, defval: null, raw: false });
  for (let i = 0; i < Math.min(json.length, 10); i++) {
    console.log(i, JSON.stringify(json[i]));
  }
  console.log('... (' + json.length + ' total)');
  if (json.length > 10) {
    console.log('LAST 3:');
    for (let i = json.length - 3; i < json.length; i++) console.log(i, JSON.stringify(json[i]));
  }
}
