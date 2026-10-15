// Extracts only the approved historical-reference fields from a user-supplied
// BikeBook checkout. It does not download images, infer types/trims, or publish.
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';

const [sourceRoot, archivePath] = process.argv.slice(2);
assert(sourceRoot, 'Provide the extracted BikeBook source root');
assert(archivePath, 'Provide the original ZIP path');

const output = new URL('../reports/historical-trim-master/bikebook-record-details.json', import.meta.url);
const checkedOn = '2026-10-15';
const records = [];
let filesScanned = 0;
let skippedIndexes = 0;
const normalize = value => value.normalize('NFKC').trim().replace(/\s+/g, ' ').toLowerCase();

async function walk(directory) {
  for (const entry of await fs.readdir(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) await walk(file);
    else if (entry.name.endsWith('.json')) {
      if (entry.name === 'index.json' || entry.name === 'model_list.json') {
        skippedIndexes++;
        continue;
      }
      filesScanned++;
      const document = JSON.parse(await fs.readFile(file, 'utf8'));
      const bike = document.bike;
      if (!bike?.manufacturer || !bike?.frame_model || !Number.isInteger(bike?.year)) continue;
      const relativePath = path.relative(path.dirname(sourceRoot), file).split(path.sep).join('/');
      records.push({
        type: null,
        manufacturer: null,
        brand: bike.manufacturer,
        model: bike.frame_model,
        trim: null,
        year: bike.year,
        evidence: {
          source: 'BikeBook user-provided archive',
          archive_source_path: relativePath,
          manufacturer_url: typeof bike.manufacturers_url === 'string' ? bike.manufacturers_url : null,
          catalog_photo_url: typeof bike.stock_photo_url === 'string' ? bike.stock_photo_url : null,
          catalog_thumbnail_url: typeof bike.stock_photo_small === 'string' ? bike.stock_photo_small : null,
          checked_on: checkedOn,
          market: null,
          status: 'catalog_reported'
        },
        review: {
          source_manufacturer_label: bike.manufacturer,
          identity_status: 'catalog_candidate',
          model_trim_split: 'unresolved',
          complete_bicycle: 'not_verified',
          type: 'not_provided_by_source',
          manufacturer_entity: 'not_provided_by_source'
        }
      });
    }
  }
}

await walk(path.join(sourceRoot, 'bike_data'));
records.sort((a, b) => a.brand.localeCompare(b.brand) || a.model.localeCompare(b.model) || a.year - b.year);
const keys = new Set(records.map(row => JSON.stringify([normalize(row.brand), normalize(row.model), row.year])));
assert.equal(keys.size, records.length, 'Duplicate normalized brand/model/year record in supplied archive');
const archiveSha256 = createHash('sha256').update(await fs.readFile(archivePath)).digest('hex');
const document = {
  title: 'BikeBook record details from user-provided archive',
  checked_on: checkedOn,
  archive_file: path.basename(archivePath),
  archive_sha256: archiveSha256,
  source_root: path.basename(sourceRoot),
  scope: 'Approved historical-reference fields only; no type, legal manufacturer entity, or separate trim is inferred.',
  rights: 'Archive is retained as source evidence only. Catalog image URLs are references, not copied assets or permission to display images.',
  summary: {
    files_scanned: filesScanned,
    index_or_model_list_files_skipped: skippedIndexes,
    valid_bicycle_records: records.length,
    brands: new Set(records.map(row => normalize(row.brand))).size,
    records_with_manufacturer_url: records.filter(row => row.evidence.manufacturer_url).length,
    records_with_catalog_photo_url: records.filter(row => row.evidence.catalog_photo_url).length
  },
  records
};
await fs.writeFile(output, JSON.stringify(document, null, 2) + '\n');
const saved = JSON.parse(await fs.readFile(output, 'utf8'));
assert.equal(saved.records.length, records.length);
console.log(JSON.stringify({ validation: 'PASS', ...document.summary, archive_sha256: archiveSha256 }));
