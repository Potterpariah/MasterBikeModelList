import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
const folder = new URL('../reports/historical-trim-master/', import.meta.url);
const source = JSON.parse(await fs.readFile(new URL('master-trim-reference.json', folder), 'utf8'));
const confirmations = JSON.parse(await fs.readFile(new URL('year-confirmations.json', folder), 'utf8'));
const corrections = JSON.parse(await fs.readFile(new URL('master-review-decisions.json', folder), 'utf8'));
const photos = JSON.parse(await fs.readFile(new URL('bikebook-photo-sources.json', folder), 'utf8'));
const recordDetails = JSON.parse(await fs.readFile(new URL('bikebook-record-details.json', folder), 'utf8'));
const normalize = value => value.normalize('NFKC').trim().replace(/\s+/g, ' ').toLowerCase();
const key = row => JSON.stringify([normalize(row.brand), normalize(row.model)]);
const photosByKey = new Map(photos.records.map(row => [key(row), row]));
const unique = new Map();
for (const record of source.records) {
  assert(typeof record.brand === 'string' && record.brand.trim());
  assert(typeof record.model === 'string' && record.model.trim());
  const key = JSON.stringify([normalize(record.brand), normalize(record.model)]);
  if (!unique.has(key)) unique.set(key, {brand:record.brand, model:record.model, years:[], year_evidence:[]});
  const row = unique.get(key);
  assert(Number.isInteger(record.year));
  if (!row.years.includes(record.year)) row.years.push(record.year);
}
for (const row of unique.values()) {
  row.year_evidence.push({source:'BikeBook',years:[...row.years].sort((a,b)=>a-b),source_url:source.records[0].evidence.source_url,status:'catalog_reported',checked_on:'2026-10-06'});
}
let matchedConfirmations = 0;
for (const item of confirmations.confirmations) {
  const key = JSON.stringify([normalize(item.brand),normalize(item.model)]);
  assert(unique.has(key), 'Confirmation must match an existing pair: '+item.model);
  const row = unique.get(key);
  for (const year of item.years) if (!row.years.includes(year)) row.years.push(year);
  row.year_evidence.push({source:item.source,years:item.years,source_url:item.source_url,status:'official_model_year_confirmed',checked_on:'2026-10-06',note:item.note});
  matchedConfirmations++;
}
for (const row of unique.values()) row.years.sort((a,b)=>a-b);
for (const row of unique.values()) {
 const photo = photosByKey.get(key(row));
 row.photo_url = photo?.photo_sources[0]?.photo_url ?? null;
 row.photo_sources = photo?.photo_sources ?? [];
 row.manufacturer_url_references = [];
}
for (const detail of recordDetails.records) {
 const row = unique.get(key(detail));
 if (!row || !detail.evidence.manufacturer_url) continue;
 const existing = row.manufacturer_url_references.find(item => item.url === detail.evidence.manufacturer_url);
 const reference = existing ?? {url:detail.evidence.manufacturer_url,years:[],archive_source_paths:[]};
 if (!existing) row.manufacturer_url_references.push(reference);
 if (!reference.years.includes(detail.year)) reference.years.push(detail.year);
 if (!reference.archive_source_paths.includes(detail.evidence.archive_source_path)) reference.archive_source_paths.push(detail.evidence.archive_source_path);
}
for (const row of unique.values()) for (const reference of row.manufacturer_url_references) {
 reference.years.sort((a,b)=>a-b);
 reference.archive_source_paths.sort();
}
const excludedKeys = new Set(corrections.exclusions.map(r=>JSON.stringify([normalize(r.brand),normalize(r.model)])));
const removed = [...unique.values()].filter(r=>excludedKeys.has(JSON.stringify([normalize(r.brand),normalize(r.model)]))).map(r=>({...r,exclusion:corrections.exclusions.find(e=>normalize(e.brand)===normalize(r.brand)&&normalize(e.model)===normalize(r.model))}));
assert.equal(removed.length,excludedKeys.size);
const records = [...unique.values()].filter(r=>!excludedKeys.has(JSON.stringify([normalize(r.brand),normalize(r.model)]))).sort((a,b)=>a.brand.localeCompare(b.brand)||a.model.localeCompare(b.model));
for (const row of records) {
 const official = row.year_evidence.find(e=>new URL(e.source_url).hostname.endsWith('specialized.com'));
 const extra = corrections.manufacturer_sources.find(e=>normalize(e.brand)===normalize(row.brand)&&normalize(e.model)===normalize(row.model));
 const linked = (corrections.catalog_manufacturer_links||[]).find(e=>normalize(e.brand)===normalize(row.brand)&&normalize(e.model)===normalize(row.model));
 row.manufacturer_source = official ? {source_url:official.source_url,status:'official_model_source',checked_on:'2026-10-06'} : extra ? {source_url:extra.source_url,status:'official_model_source',checked_on:'2026-10-06'} : linked ? {source_url:linked.links[0].source_url,status:'catalog_link_unverified',checked_on:linked.checked_on,catalog_links:linked.links} : null;
}
await fs.writeFile(new URL('removed-frame-module-records.json',folder),JSON.stringify(removed,null,2)+'\n');
const target = new URL('brand-model-master.json', folder);
await fs.writeFile(target, JSON.stringify(records, null, 2)+'\n');
const saved = JSON.parse(await fs.readFile(target, 'utf8'));
assert.equal(saved.length + removed.length, unique.size);
assert(saved.every(row=>Object.keys(row).join(',') === 'brand,model,years,year_evidence,photo_url,photo_sources,manufacturer_url_references,manufacturer_source'));
assert(saved.every(row=>row.years.length && row.years.every(Number.isInteger) && new Set(row.years).size===row.years.length));
const keys = new Set(saved.map(row=>JSON.stringify([normalize(row.brand), normalize(row.model)])));
assert.equal(keys.size, saved.length);
assert(saved.every(r=>!r.manufacturer_source || ['official_model_source','catalog_link_unverified'].includes(r.manufacturer_source.status)));
assert(saved.every(r=>!r.manufacturer_source || ['http:','https:'].includes(new URL(r.manufacturer_source.source_url).protocol)));
assert(saved.every(r=>!r.manufacturer_source || r.manufacturer_source.status!=='catalog_link_unverified' || r.manufacturer_source.catalog_links.every(l=>l.catalog_source_url.includes(source.source_revision)&&l.years.every(Number.isInteger))));
assert(saved.every(r=>r.photo_url===null || r.photo_sources.some(photo=>photo.photo_url===r.photo_url)));
assert(saved.every(r=>r.photo_sources.every(photo=>photo.photo_url.startsWith('https://') && photo.years.every(Number.isInteger) && photo.catalog_source_urls.every(url=>url.includes(source.source_revision)))));
assert(saved.every(r=>r.manufacturer_url_references.every(reference=>['http:','https:'].includes(new URL(reference.url).protocol) && reference.years.every(Number.isInteger) && reference.archive_source_paths.every(value=>value.startsWith('bikebook-main/bike_data/')))));
assert(source.records.every(row=>keys.has(JSON.stringify([normalize(row.brand), normalize(row.model)]))||excludedKeys.has(JSON.stringify([normalize(row.brand),normalize(row.model)]))));
const savedByKey = new Map(saved.map(r=>[JSON.stringify([normalize(r.brand),normalize(r.model)]),r]));
assert(source.records.every(r=>excludedKeys.has(JSON.stringify([normalize(r.brand),normalize(r.model)]))||savedByKey.get(JSON.stringify([normalize(r.brand),normalize(r.model)])).years.includes(r.year)));
console.log(JSON.stringify({validation:'PASS',source_records:source.records.length,brand_model_pairs:saved.length,removed_confirmed_frame_modules:removed.length,manufacturer_sources_filled:saved.filter(r=>r.manufacturer_source).length,manufacturer_sources_unresolved:saved.filter(r=>!r.manufacturer_source).length,records_with_photo_urls:saved.filter(r=>r.photo_url).length,records_without_photo_urls:saved.filter(r=>!r.photo_url).length,records_with_archive_manufacturer_urls:saved.filter(r=>r.manufacturer_url_references.length).length,archive_manufacturer_urls:saved.reduce((n,r)=>n+r.manufacturer_url_references.length,0),year_associations:saved.reduce((n,r)=>n+r.years.length,0),all_original_pairs_accounted_or_recoverably_excluded:true}));
