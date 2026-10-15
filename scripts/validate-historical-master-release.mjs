// Validates the sealed working baseline; it does not ingest or publish data.
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import fs from 'node:fs/promises';

const folder = new URL('../reports/historical-trim-master/', import.meta.url);
const read = name => fs.readFile(new URL(name, folder), 'utf8');
const [raw, manifestRaw, auditRaw, decisionsRaw] = await Promise.all([
  read('brand-model-master.json'),
  read('historical-master-list-v1.json'),
  read('identity-audit.json'),
  read('master-review-decisions.json')
]);
const rows = JSON.parse(raw);
const manifest = JSON.parse(manifestRaw);
const audit = JSON.parse(auditRaw);
const decisions = JSON.parse(decisionsRaw);
const sha256 = createHash('sha256').update(raw).digest('hex');
assert.equal(manifest.version, '1.4.0');
assert.equal(manifest.canonical_file, 'brand-model-master.json');
assert.equal(sha256, manifest.canonical_file_sha256);
assert.equal(rows.length, manifest.counts.brand_model_pairs);
assert.equal(rows.reduce((n, row) => n + row.years.length, 0), manifest.counts.year_associations);
assert.equal(rows.filter(row => row.manufacturer_source?.status === 'official_model_source').length, manifest.counts.official_model_sources);
assert.equal(rows.filter(row => row.manufacturer_source?.status === 'catalog_link_unverified').length, manifest.counts.catalog_links_unverified);
assert.equal(rows.filter(row => row.manufacturer_source === null).length, manifest.counts.blank_model_sources);
assert.equal(rows.filter(row => row.photo_url !== null).length, manifest.counts.records_with_photo_urls);
assert.equal(rows.filter(row => row.photo_url === null).length, manifest.counts.records_without_photo_urls);
assert.equal(decisions.exclusions.length, manifest.counts.recoverable_confirmed_exclusions);
assert.equal(decisions.brand_identity_verifications.length, manifest.counts.brand_identity_verifications);
assert.equal(audit.possible_frame_module_entries, manifest.counts.possible_frame_module_flags);
assert.equal(audit.punctuation_only_collision_groups, manifest.counts.punctuation_collision_groups);
assert(rows.every(row => Array.isArray(row.years) && row.years.length && row.years.every(Number.isInteger)));
assert(rows.every(row => row.manufacturer_source === null || ['official_model_source', 'catalog_link_unverified'].includes(row.manufacturer_source.status)));
assert(rows.every(row => row.photo_url === null || row.photo_sources.some(photo => photo.photo_url === row.photo_url)));
assert(rows.every(row => Array.isArray(row.manufacturer_url_references)));
assert.equal(manifest.counts.brand_model_pairs_with_archive_manufacturer_url, rows.filter(row => row.manufacturer_url_references.length).length);
assert.equal(manifest.counts.archive_manufacturer_url_references, rows.reduce((n, row) => n + row.manufacturer_url_references.length, 0));
console.log(JSON.stringify({validation:'PASS',version:manifest.version,sha256,counts:manifest.counts,ingestion_status:manifest.ingestion_status}));
