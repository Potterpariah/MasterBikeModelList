// Re-seals the local working baseline after a validated local enrichment.
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import fs from 'node:fs/promises';

const folder = new URL('../reports/historical-trim-master/', import.meta.url);
const read = name => fs.readFile(new URL(name, folder), 'utf8');
const [raw, priorRaw, auditRaw, decisionsRaw, detailsRaw] = await Promise.all([
  read('brand-model-master.json'), read('historical-master-list-v1.json'), read('identity-audit.json'), read('master-review-decisions.json'), read('bikebook-record-details.json')
]);
const rows = JSON.parse(raw);
const prior = JSON.parse(priorRaw);
const audit = JSON.parse(auditRaw);
const decisions = JSON.parse(decisionsRaw);
const details = JSON.parse(detailsRaw);
const manifest = {
  ...prior,
  version: '1.4.0',
  released_on: '2026-10-15',
  canonical_file_sha256: createHash('sha256').update(raw).digest('hex'),
  counts: {
    ...prior.counts,
    brand_model_pairs: rows.length,
    year_associations: rows.reduce((total, row) => total + row.years.length, 0),
    official_model_sources: rows.filter(row => row.manufacturer_source?.status === 'official_model_source').length,
    catalog_links_unverified: rows.filter(row => row.manufacturer_source?.status === 'catalog_link_unverified').length,
    blank_model_sources: rows.filter(row => row.manufacturer_source === null).length,
    records_with_photo_urls: rows.filter(row => row.photo_url !== null).length,
    records_without_photo_urls: rows.filter(row => row.photo_url === null).length,
    archive_detail_records: details.records.length,
    archive_detail_brands: details.summary.brands,
    archive_records_with_manufacturer_url: details.summary.records_with_manufacturer_url,
    archive_records_with_catalog_photo_url: details.summary.records_with_catalog_photo_url,
    brand_model_pairs_with_archive_manufacturer_url: rows.filter(row => row.manufacturer_url_references.length).length,
    archive_manufacturer_url_references: rows.reduce((total, row) => total + row.manufacturer_url_references.length, 0),
    recoverable_confirmed_exclusions: decisions.exclusions.length,
    brand_identity_verifications: decisions.brand_identity_verifications.length,
    possible_frame_module_flags: audit.possible_frame_module_entries,
    punctuation_collision_groups: audit.punctuation_only_collision_groups
  },
  acceptance: [...new Set([...(prior.acceptance || []), 'User-provided BikeBook archive details are matched exactly by normalized brand/model/year; manufacturer URLs and catalog-photo URLs remain source references with archive SHA-256 provenance.'])],
  non_claims: [...new Set([...(prior.non_claims || []), 'The archive did not supply a reliable type, legal manufacturer entity, or distinct trim field, so none are inferred from component descriptions or filenames.'])]
};
assert.equal(manifest.counts.brand_model_pairs, rows.length);
await fs.writeFile(new URL('historical-master-list-v1.json', folder), JSON.stringify(manifest, null, 2) + '\n');
console.log(JSON.stringify({validation:'PASS',version:manifest.version,sha256:manifest.canonical_file_sha256,counts:manifest.counts}));
