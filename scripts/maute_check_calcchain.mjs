import { readFileSync } from 'fs';
import { unzipSync, strFromU8 } from 'fflate';
import { fillMauteTemplateBytes } from '../src/lib/mauteExport.js';
const tpl = readFileSync(new URL('../public/wettkampfstatistik-vorlage.xlsm', import.meta.url));
const comps = [{ name:'WK1', date:'2025-03-01', kampfgerichte:2,
  exercises:[{id:'e1',nr:'1186a',name:'Maute-Sprung',points:5},{id:'e2',nr:'1102d',name:'Sattelstand',points:4}],
  table1:[{exerciseId:'e1',cross:1},{exerciseId:'e2',wave:2}], table2:[{exerciseId:'e1',cross:1},{exerciseId:'e2',wave:0}] }];
const files = unzipSync(fillMauteTemplateBytes(tpl, { competitions: comps }));
const has = (n) => n in files;
console.log('calcChain.xml entfernt?      ', has('xl/calcChain.xml') ? '❌ NOCH DA' : '✅ weg');
const rels = files['xl/_rels/workbook.xml.rels'] ? strFromU8(files['xl/_rels/workbook.xml.rels']) : '';
console.log('rels ohne calcChain?         ', rels.includes('calcChain') ? '❌ Ref da' : '✅ sauber');
const ct = files['[Content_Types].xml'] ? strFromU8(files['[Content_Types].xml']) : '';
console.log('[Content_Types] ohne calcChain?', ct.includes('calcChain') ? '❌ Ref da' : '✅ sauber');
const s1 = strFromU8(files['xl/worksheets/sheet1.xml']);
console.log('sheet1 hat Daten (A4)?       ', s1.includes('Maute-Sprung') ? '✅ ja' : '❌ nein');
console.log('workbook fullCalcOnLoad?     ', strFromU8(files['xl/workbook.xml']).includes('fullCalcOnLoad') ? '✅ ja' : '❌ nein');
