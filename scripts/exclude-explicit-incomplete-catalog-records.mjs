// Excludes only catalog records whose original source label explicitly identifies
// an incomplete frame/module or standalone component. Exclusions stay recoverable.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';

const folder = new URL('../reports/historical-trim-master/', import.meta.url);
const [masterRaw, decisionsRaw, detailsRaw] = await Promise.all([
  fs.readFile(new URL('brand-model-master.json', folder), 'utf8'),
  fs.readFile(new URL('master-review-decisions.json', folder), 'utf8'),
  fs.readFile(new URL('bikebook-record-details.json', folder), 'utf8')
]);
const master = JSON.parse(masterRaw);
const decisions = JSON.parse(decisionsRaw);
const details = JSON.parse(detailsRaw);
const normalize = value => value.normalize('NFKC').trim().replace(/\s+/g, ' ').toLowerCase();
const key = row => JSON.stringify([normalize(row.brand), normalize(row.model)]);
const explicitIncomplete = /\b(?:frame(?:set|-only)?|module)\b/i;
const explicitComponent = /\b(?:fork|wheelset|crankset|handlebar|seatpost)\b/i;
const detailByKey = new Map();
for (const detail of details.records) {
  const id = key(detail);
  if (!detailByKey.has(id)) detailByKey.set(id, []);
  detailByKey.get(id).push(detail);
}
const existing = new Set(decisions.exclusions.map(key));
const additions = [];
for (const row of master) {
  const matchesIncomplete = explicitIncomplete.test(row.model);
  const matchesComponent = explicitComponent.test(row.model);
  if (existing.has(key(row)) || (!matchesIncomplete && !matchesComponent)) continue;
  const sourceRows = detailByKey.get(key(row)) ?? [];
  const catalogSourceUrls = [...new Set([
    ...(row.photo_sources || []).flatMap(source => source.catalog_source_urls || []),
    ...((row.manufacturer_source?.catalog_links || []).map(link => link.catalog_source_url).filter(Boolean))
  ])].sort();
  assert(sourceRows.length > 0 || catalogSourceUrls.length > 0, `Missing user-archive source record for ${row.brand} ${row.model}`);
  const category = matchesIncomplete ? 'frame/module' : 'standalone component';
  additions.push({
    brand: row.brand,
    model: row.model,
    reason: `BikeBook catalog label explicitly identifies a ${category}; not a complete bicycle`,
    archive_sha256: details.archive_sha256,
    archive_source_paths: [...new Set([
      ...sourceRows.map(detail => detail.evidence.archive_source_path),
      ...catalogSourceUrls
    ].filter(Boolean))].sort(),
    manufacturer_urls: [...new Set([
      ...sourceRows.map(detail => detail.evidence.manufacturer_url),
      ...((row.manufacturer_source?.catalog_links || []).map(link => link.source_url))
    ].filter(Boolean))].sort(),
    evidence_status: 'user_archive_explicit_incomplete_catalog_label'
  });
}
assert(additions.length > 0, 'No new explicit incomplete records found');
assert(additions.every(item => explicitIncomplete.test(item.model) || explicitComponent.test(item.model)));
decisions.exclusions.push(...additions);
await fs.writeFile(new URL('master-review-decisions.json', folder), JSON.stringify(decisions, null, 2) + '\n');
console.log(JSON.stringify({
  validation: 'PASS',
  added_recoverable_exclusions: additions.length,
  explicit_frame_or_module_records: additions.filter(item => explicitIncomplete.test(item.model)).length,
  explicit_component_records: additions.filter(item => explicitComponent.test(item.model)).length,
  by_brand: Object.fromEntries([...new Set(additions.map(item => item.brand))].sort().map(brand => [brand, additions.filter(item => item.brand === brand).length]))
}));
