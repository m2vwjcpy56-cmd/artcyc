import { readFileSync, writeFileSync } from 'fs';
import { fillMauteTemplateBytes } from '../src/lib/mauteExport.js';
const tpl = readFileSync(new URL('../public/wettkampfstatistik-vorlage.xlsm', import.meta.url));
const comps = [
  { name:'Kreismeisterschaft', date:'2025-03-01', kampfgerichte:2,
    exercises:[{id:'e1',nr:'1186a',name:'Maute-Sprung',points:5},{id:'e2',nr:'1102d',name:'Sattelstand',points:4}],
    table1:[{exerciseId:'e1',cross:1},{exerciseId:'e2',wave:2}], table2:[{exerciseId:'e1',cross:1},{exerciseId:'e2',wave:0}] },
  { name:'Bezirksmeisterschaft', date:'2025-06-01', kampfgerichte:2,
    exercises:[{id:'e1',nr:'1186a',name:'Maute-Sprung',points:5},{id:'e3',nr:'1249d',name:'Kehrstandsteiger',points:6}],
    table1:[{exerciseId:'e1',bar:1},{exerciseId:'e3',circle:1}], table2:[{exerciseId:'e1',bar:1},{exerciseId:'e3',circle:0}] },
];
const out = fillMauteTemplateBytes(tpl, { competitions: comps });
const dest = '/private/tmp/claude-501/-Users-rubengeyer-Library-Mobile-Documents-com-apple-CloudDocs-ArtCyc/3aa23bc2-abc1-4412-90d6-a0fc5aa9bdee/scratchpad/Beispiel_Programmwechsel.xlsm';
writeFileSync(dest, out);
console.log('geschrieben:', dest, out.length, 'bytes');
