// Offline reference assembly only: no database, ingestion or application changes.
import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
const [input, output] = process.argv.slice(2);
assert(input && output, 'Provide downloaded BikeBook index and output directory');
const index = JSON.parse(await fs.readFile(input, 'utf8'));
const revision = 'cdad71a96c1cf6e77a0306b3276c31704381f55f';
const checked = '2026-10-06';
const rows = [], seen = new Map();
const normalize = value => value.normalize('NFKC').trim().replace(/\s+/g, ' ').toLowerCase();
let sourceRows = 0;
for (const [manufacturer, years] of Object.entries(index)) {
  for (const [yearText, entries] of Object.entries(years)) {
    const year = Number(yearText);
    assert(Number.isInteger(year), 'Invalid source year');
    for (const entry of entries) {
      sourceRows++;
      const name = entry.name ?? entry.text;
      assert(typeof name === 'string' && name.trim() && typeof entry.id === 'string');
      const key = JSON.stringify([normalize(manufacturer), normalize(name), year]);
      if (seen.has(key)) { seen.get(key).evidence.source_ids.push(entry.id); continue; }
      const row = {type:null, manufacturer:null, brand:manufacturer, model:name, trim:null, year,
        evidence:{source:'BikeBook',source_url:`https://github.com/bikeindex/bikebook/blob/${revision}/public/index.json`,source_ids:[entry.id],checked_on:checked,market:null},
        review:{source_manufacturer_label:manufacturer,identity_status:'catalog_candidate',model_trim_split:'unresolved',complete_bicycle:'not_verified',us_market:'not_verified',manufacturer_entity:'not_verified'}};
      seen.set(key,row); rows.push(row);
    }
  }
}
rows.sort((a,b)=>a.brand.localeCompare(b.brand)||a.model.localeCompare(b.model)||a.year-b.year);
assert.equal(rows.length,seen.size);
assert(rows.every(r=>r.trim===null && r.evidence.market===null));
const summary = {source_rows:sourceRows,unique_brand_name_year_records:rows.length,normalized_duplicates:sourceRows-rows.length,brands:new Set(rows.map(r=>normalize(r.brand))).size,distinct_brand_name_labels:new Set(rows.map(r=>JSON.stringify([normalize(r.brand),normalize(r.model)]))).size,year_min:Math.min(...rows.map(r=>r.year)),year_max:Math.max(...rows.map(r=>r.year)),pre_1990_records:rows.filter(r=>r.year<1990).length};
const document={title:'Historical master model/trim reference — BikeBook foundation',version:'0.1',checked_on:checked,source_revision:revision,purpose:'Historical reference only; not ingestion-ready or official verified collection',limitations:['Combined source names preserved; no invented family/trim split','Source manufacturer labels treated as brands, not legal manufacturer entities','Unknown type/trim/manufacturer/market remain null','Complete bike versus frame-only requires review','Year is catalog-reported, not official-source verified','No claim of complete manufacturer or historical coverage','AGPL-3.0 repository license retained; downstream reuse rights require review'],summary,records:rows};
const escape=s=>String(s??'Unknown').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
await fs.mkdir(output,{recursive:true});
await fs.writeFile(path.join(output,'master-trim-reference.json'),JSON.stringify(document,null,2)+'\n');
await fs.writeFile(path.join(output,'master-trim-reference.html'),`<!doctype html><html lang="en"><meta charset="utf-8"><title>Historical model/trim reference</title><style>body{font:16px system-ui;margin:2rem}table{border-collapse:collapse;width:100%}td,th{padding:.5rem;border:1px solid #ddd;text-align:left}th{position:sticky;top:0;background:#eee}input{padding:.6rem;width:24rem}</style><h1>Historical model/trim reference</h1><p>${rows.length} catalog-reported brand/name/year records. Reference only, not ingestion-ready. Model contains original combined model/build name; trim, type, manufacturer entity and US market are unresolved. Years are source-reported.</p><p>BikeBook snapshot ${revision}; AGPL-3.0 repository license. No images, prices, geometry or component specifications included.</p><label>Filter brand, name or year <input id="filter" type="search"></label><table><thead><tr><th>Brand</th><th>Model / original build label</th><th>Year</th><th>Type</th><th>Manufacturer</th><th>Trim split</th></tr></thead><tbody>${rows.map(r=>`<tr><td>${escape(r.brand)}</td><td>${escape(r.model)}</td><td>${r.year}</td><td>Unknown</td><td>Unknown</td><td>Unresolved</td></tr>`).join('')}</tbody></table><script>document.getElementById('filter').addEventListener('input',e=>{const q=e.target.value.toLowerCase();document.querySelectorAll('tbody tr').forEach(r=>r.hidden=!r.textContent.toLowerCase().includes(q))})</script></html>`);
const reread=JSON.parse(await fs.readFile(path.join(output,'master-trim-reference.json'),'utf8'));
assert.equal(reread.records.length,rows.length);
console.log(JSON.stringify({validation:'PASS',...summary}));
