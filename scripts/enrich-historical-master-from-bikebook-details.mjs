// Adds user-supplied-archive URLs to matching historical rows without
// inventing type, trim, legal manufacturer, complete-bike, or market facts.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';

const folder = new URL('../reports/historical-trim-master/', import.meta.url);
const referenceUrl = new URL('master-trim-reference.json', folder);
const detailsUrl = new URL('bikebook-record-details.json', folder);
const reference = JSON.parse(await fs.readFile(referenceUrl, 'utf8'));
const details = JSON.parse(await fs.readFile(detailsUrl, 'utf8'));
const normalize = value => value.normalize('NFKC').trim().replace(/\s+/g, ' ').toLowerCase();
const key = row => JSON.stringify([normalize(row.brand), normalize(row.model), row.year]);
const byKey = new Map(details.records.map(row => [key(row), row]));
assert.equal(byKey.size, details.records.length, 'Detail records must be normalized-unique');
let matched = 0;
for (const row of reference.records) {
  const detail = byKey.get(key(row));
  row.evidence.manufacturer_url = detail?.evidence.manufacturer_url ?? null;
  row.evidence.catalog_photo_url = detail?.evidence.catalog_photo_url ?? null;
  row.evidence.catalog_thumbnail_url = detail?.evidence.catalog_thumbnail_url ?? null;
  row.evidence.archive_source_path = detail?.evidence.archive_source_path ?? null;
  row.evidence.archive_sha256 = detail ? details.archive_sha256 : null;
  if (detail) matched++;
}
assert.equal(matched, details.records.length, 'Every supplied detail must match exactly one historical master row');
reference.version = '0.2';
reference.checked_on = '2026-10-15';
reference.limitations = [...new Set([...reference.limitations, 'Only a partial user-supplied checkout included per-bike manufacturer and catalog-photo URL fields; missing URL fields remain null rather than inferred.'])];
reference.detail_enrichment = {
  source: 'BikeBook user-provided archive',
  archive_file: details.archive_file,
  archive_sha256: details.archive_sha256,
  checked_on: details.checked_on,
  matched_records: matched,
  unmatched_master_records: reference.records.length - matched,
  source_scope: 'manufacturer URL and catalog-photo URL references only; type, trim, legal manufacturer entity, complete-bike status, and market remain unresolved unless separately sourced.'
};
await fs.writeFile(referenceUrl, JSON.stringify(reference, null, 2) + '\n');
const saved = JSON.parse(await fs.readFile(referenceUrl, 'utf8'));
assert.equal(saved.detail_enrichment.matched_records, details.records.length);
assert(saved.records.every(row => ['manufacturer_url','catalog_photo_url','catalog_thumbnail_url','archive_source_path','archive_sha256'].every(field => field in row.evidence)));
console.log(JSON.stringify({validation:'PASS',matched_records:matched,unmatched_master_records:reference.records.length-matched,records_with_manufacturer_url:saved.records.filter(row=>row.evidence.manufacturer_url).length,records_with_catalog_photo_url:saved.records.filter(row=>row.evidence.catalog_photo_url).length}));
