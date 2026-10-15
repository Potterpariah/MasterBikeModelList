import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
const root=process.argv[2]; assert(root,'Provide pinned BikeBook checkout');
const folder=new URL('../reports/historical-trim-master/',import.meta.url);
const reference=JSON.parse(await fs.readFile(new URL('master-trim-reference.json',folder),'utf8'));
const decisions=JSON.parse(await fs.readFile(new URL('master-review-decisions.json',folder),'utf8'));
const norm=s=>s.normalize('NFKC').trim().replace(/\s+/g,' ').toLowerCase();
const key=r=>JSON.stringify([norm(r.brand),norm(r.model)]);
const byIdentity=new Map();
async function walk(dir){for(const entry of await fs.readdir(dir,{withFileTypes:true})){const p=path.join(dir,entry.name);if(entry.isDirectory())await walk(p);else if(entry.name.endsWith('.json')){const doc=JSON.parse(await fs.readFile(p,'utf8'));if(doc.bike){const k=key({brand:doc.bike.manufacturer,model:doc.bike.frame_model});if(!byIdentity.has(k))byIdentity.set(k,[]);byIdentity.get(k).push({doc,p});}}}}
await walk(path.join(root,'bike_data'));
const links=[],flags=[],seen=new Set(); let unmatched=0;
for(const row of reference.records){const k=key(row);if(seen.has(k))continue;seen.add(k);const entries=byIdentity.get(k)||[];if(!entries.length){unmatched++;continue;}const urls=new Map(),clues=[];
 for(const {doc,p} of entries){const b=doc.bike;const provenance='https://github.com/bikeindex/bikebook/blob/'+reference.source_revision+'/'+path.relative(root,p).split(path.sep).join('/');
  if(b.manufacturers_url){try{const u=new URL(b.manufacturers_url);if(['http:','https:'].includes(u.protocol)){if(!urls.has(u.href))urls.set(u.href,{source_url:u.href,catalog_source_url:provenance,years:[]});urls.get(u.href).years.push(b.year);}}catch{}}
  if(/(?:^|[\/_-])(?:frameset|frame|module)(?:[\/_.-]|$)/i.test([b.manufacturers_url,b.stock_photo_url].filter(Boolean).join(' ')))clues.push({catalog_source_url:provenance,reason:'Catalog-linked URL or photo filename suggests frame/module; not proof of frame-only sales'});
 }
 if(urls.size)links.push({brand:row.brand,model:row.model,status:'catalog_link_unverified',checked_on:'2026-10-06',links:[...urls.values()].map(v=>({...v,years:[...new Set(v.years)].sort((a,b)=>a-b)}))});
 if(clues.length)flags.push({brand:row.brand,model:row.model,evidence:clues});
}
decisions.catalog_manufacturer_links=links;decisions.catalog_frame_review_flags=flags;
await fs.writeFile(new URL('master-review-decisions.json',folder),JSON.stringify(decisions,null,2)+'\n');
console.log(JSON.stringify({linked_pairs:links.length,catalog_url_frame_flags:flags.length,unmatched_pairs:unmatched}));
