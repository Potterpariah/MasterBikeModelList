// Adds only recoverable exclusions supported by an explicit frameset label and
// a matching linked manufacturer-domain catalog URL already retained in the master.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';

const folder = new URL('../reports/historical-trim-master/', import.meta.url);
const [masterRaw, decisionsRaw] = await Promise.all([
  fs.readFile(new URL('brand-model-master.json', folder), 'utf8'),
  fs.readFile(new URL('master-review-decisions.json', folder), 'utf8')
]);
const master = JSON.parse(masterRaw);
const decisions = JSON.parse(decisionsRaw);
const normalize = value => value.normalize('NFKC').trim().replace(/\s+/g, ' ').toLowerCase();
const key = row => JSON.stringify([normalize(row.brand), normalize(row.model)]);
const expectedHosts = new Map([
  ['Bianchi', ['www.bianchiusa.com']],
  ['Cannondale', ['www.cannondale.com']],
  ['Fuji', ['archive.fujibikes.com', 'www.fujibikes.com']],
  ['Giant', ['www.giant-bicycles.com']],
  ['Leader', ['www.leaderbikes.com']],
  ['SE Bikes', ['www.sebikes.com']],
  ['Specialized', ['www.specialized.com']],
  ['Trek', ['www.trekbikes.com']]
]);
const existing = new Set(decisions.exclusions.map(key));
const additions = [];
for (const row of master) {
  if (existing.has(key(row)) || !/frame\s*set/i.test(row.model)) continue;
  const source = row.manufacturer_source;
  if (source?.status !== 'catalog_link_unverified') continue;
  const url = new URL(source.source_url);
  if (!expectedHosts.get(row.brand)?.includes(url.hostname)) continue;
  if (!/frame[._/-]?set|frame$/i.test(source.source_url)) continue;
  additions.push({
    brand: row.brand,
    model: row.model,
    reason: 'Historical catalog label and linked manufacturer-domain catalog URL explicitly identify a frameset; not a complete bicycle',
    source_url: source.source_url,
    catalog_source_url: source.catalog_links[0].catalog_source_url,
    evidence_status: 'linked_manufacturer_catalog_explicit_frameset'
  });
}
assert(additions.length > 0, 'No new explicit framesets found');
assert(additions.every(item => /frame\s*set/i.test(item.model) && /frame[._/-]?set|frame$/i.test(item.source_url)));
decisions.exclusions.push(...additions);
await fs.writeFile(new URL('master-review-decisions.json', folder), JSON.stringify(decisions, null, 2) + '\n');
console.log(JSON.stringify({added_recoverable_exclusions:additions.length, by_brand:Object.fromEntries([...expectedHosts.keys()].map(brand => [brand, additions.filter(item => item.brand === brand).length]).filter(([, count]) => count))}));
