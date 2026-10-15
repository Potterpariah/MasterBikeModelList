// Extracts URL references only from the pinned BikeBook checkout. No images are downloaded.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';

const root = process.argv[2];
assert(root, 'Provide the pinned BikeBook checkout path');
const folder = new URL('../reports/historical-trim-master/', import.meta.url);
const reference = JSON.parse(await fs.readFile(new URL('master-trim-reference.json', folder), 'utf8'));
const normalize = value => value.normalize('NFKC').trim().replace(/\s+/g, ' ').toLowerCase();
const key = row => JSON.stringify([normalize(row.brand), normalize(row.model)]);
const pairs = new Map();
async function walk(dir) {
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) await walk(file);
    else if (entry.name.endsWith('.json')) {
      const doc = JSON.parse(await fs.readFile(file, 'utf8'));
      if (!doc.bike?.manufacturer || !doc.bike?.frame_model || !Number.isInteger(doc.bike?.year)) continue;
      const image = doc.bike.stock_photo_url;
      if (typeof image !== 'string' || !image.startsWith('https://')) continue;
      const row = { brand: doc.bike.manufacturer, model: doc.bike.frame_model };
      const id = key(row);
      if (!pairs.has(id)) pairs.set(id, { ...row, photo_sources: new Map() });
      const source = `https://github.com/bikeindex/bikebook/blob/${reference.source_revision}/${path.relative(root, file).split(path.sep).join('/')}`;
      if (!pairs.get(id).photo_sources.has(image)) pairs.get(id).photo_sources.set(image, { photo_url: image, thumbnail_url: typeof doc.bike.stock_photo_small === 'string' && doc.bike.stock_photo_small.startsWith('https://') ? doc.bike.stock_photo_small : null, years: [], catalog_source_urls: [] });
      const photo = pairs.get(id).photo_sources.get(image);
      if (!photo.years.includes(doc.bike.year)) photo.years.push(doc.bike.year);
      if (!photo.catalog_source_urls.includes(source)) photo.catalog_source_urls.push(source);
    }
  }
}
await walk(path.join(root, 'bike_data'));
const records = [...pairs.values()].map(row => ({
  brand: row.brand,
  model: row.model,
  status: 'catalog_photo_reference',
  checked_on: '2026-10-06',
  photo_sources: [...row.photo_sources.values()].map(photo => ({ ...photo, years: photo.years.sort((a, b) => b - a), catalog_source_urls: photo.catalog_source_urls.sort() })).sort((a, b) => b.years[0] - a.years[0] || a.photo_url.localeCompare(b.photo_url))
})).sort((a, b) => a.brand.localeCompare(b.brand) || a.model.localeCompare(b.model));
const document = { source: 'BikeBook', source_revision: reference.source_revision, checked_on: '2026-10-06', purpose: 'Catalog image URL references only; no image files downloaded or licensed for publication', records };
await fs.writeFile(new URL('bikebook-photo-sources.json', folder), JSON.stringify(document, null, 2) + '\n');
console.log(JSON.stringify({pairs_with_catalog_photo_urls: records.length, catalog_photo_urls: records.reduce((sum, row) => sum + row.photo_sources.length, 0)}));
