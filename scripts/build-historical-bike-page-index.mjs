// Local-only browse projection for the public /bikes list. It does not ingest data.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';

const root = new URL('../', import.meta.url);
const reports = new URL('reports/historical-trim-master/', root);
const [masterRaw, auditRaw, releaseRaw] = await Promise.all([
  fs.readFile(new URL('brand-model-master.json', reports), 'utf8'),
  fs.readFile(new URL('identity-audit.json', reports), 'utf8'),
  fs.readFile(new URL('historical-master-list-v1.json', reports), 'utf8')
]);
const master = JSON.parse(masterRaw);
const audit = JSON.parse(auditRaw);
const release = JSON.parse(releaseRaw);
const normalize = value => value.normalize('NFKC').trim().replace(/\s+/g, ' ').toLowerCase();
const key = row => JSON.stringify([normalize(row.brand), normalize(row.model)]);
const slugify = value => String(value).trim().toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const uncertain = new Set(audit.flags.filter(flag => flag.reasons.some(reason => reason.startsWith('Name indicates')) || flag.catalog_evidence).map(key));
const records = master.filter(row => !uncertain.has(key(row)));
const byBrand = new Map();
for (const row of records) {
  if (!byBrand.has(row.brand)) byBrand.set(row.brand, []);
  byBrand.get(row.brand).push({ name: row.model, years: row.years });
}
const brands = [...byBrand].map(([name, models]) => ({ name, slug: slugify(name), models: models.sort((a, b) => a.name.localeCompare(b.name)) })).sort((a, b) => a.name.localeCompare(b.name));
assert.equal(new Set(brands.map(brand => brand.slug)).size, brands.length, 'Brand slugs must be unique');
assert.equal(brands.reduce((count, brand) => count + brand.models.length, 0), records.length);
assert(brands.every(brand => brand.models.every(model => model.name && model.years.length && model.years.every(Number.isInteger))));
const output = {
  schema_version: '1.0.0',
  generated_on: '2026-10-06',
  source_release: { version: release.version, sha256: release.canonical_file_sha256 },
  scope: 'Local-only historical complete-bike candidate browser. Entries with remaining possible frame/module flags are intentionally withheld.',
  rights_notice: 'Derived from the historical working baseline. Do not deploy or publish without the source-license review recorded with that baseline.',
  summary: { brands: brands.length, models: records.length, withheld_possible_incomplete: uncertain.size },
  brands
};
await fs.writeFile(new URL('data/historical-bike-page-index.json', root), JSON.stringify(output, null, 2) + '\n');
console.log(JSON.stringify({validation:'PASS',...output.summary,source_release:output.source_release.version}));
