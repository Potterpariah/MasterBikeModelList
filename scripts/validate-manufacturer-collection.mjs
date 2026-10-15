import { readFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';

// Dependency-free validation of the keywords used by record.schema.json.
// Unknown keywords fail closed; this is not a general JSON Schema engine.
export function validate(value, schema, path = '$') {
  const supported = new Set(['$schema', 'title', 'type', 'additionalProperties', 'required', 'properties', 'minLength', 'minimum', 'maximum', 'format', 'pattern', 'const']);
  for (const key of Object.keys(schema)) assert(supported.has(key), `${path}: unsupported schema keyword ${key}`);
  if ('const' in schema) assert.deepEqual(value, schema.const, `${path}: const`);
  const types = Array.isArray(schema.type) ? schema.type : schema.type ? [schema.type] : [];
  const matches = type => type === 'null' ? value === null : type === 'integer' ? Number.isInteger(value) : type === 'object' ? value !== null && typeof value === 'object' && !Array.isArray(value) : typeof value === type;
  if (types.length) assert(types.some(matches), `${path}: type`);
  if (value === null) return;
  if (typeof value === 'string') {
    if (schema.minLength !== undefined) assert([...value].length >= schema.minLength && value.trim(), `${path}: minLength`);
    if (schema.pattern) assert(new RegExp(schema.pattern).test(value), `${path}: pattern`);
    if (schema.format === 'uri') assert(new URL(value).protocol, `${path}: URI`);
    if (schema.format === 'date') assert(/^\d{4}-\d{2}-\d{2}$/.test(value) && new Date(value).toISOString().slice(0, 10) === value, `${path}: date`);
  }
  if (typeof value === 'number') {
    if (schema.minimum !== undefined) assert(value >= schema.minimum, `${path}: minimum`);
    if (schema.maximum !== undefined) assert(value <= schema.maximum, `${path}: maximum`);
  }
  if (schema.properties) {
    for (const key of schema.required ?? []) assert(Object.hasOwn(value, key), `${path}: missing ${key}`);
    for (const key of Object.keys(value)) {
      if (schema.additionalProperties === false) assert(Object.hasOwn(schema.properties, key), `${path}: extra ${key}`);
      if (schema.properties[key]) validate(value[key], schema.properties[key], `${path}.${key}`);
    }
  }
}

export async function checkCollection(file = new URL('../data/manufacturer-collection/3t.json', import.meta.url)) {
  const schema = JSON.parse(await readFile(new URL('../data/manufacturer-collection/record.schema.json', import.meta.url), 'utf8'));
  const collection = JSON.parse(await readFile(file, 'utf8'));
  assert(Array.isArray(collection.records) && collection.records.length, 'records required');
  const identities = new Set();
  const normalize = s => typeof s === 'string' ? s.normalize('NFKC').trim().replace(/\s+/g, ' ').toLowerCase() : s;
  for (const [index, record] of collection.records.entries()) {
    validate(record, schema, `records[${index}]`);
    assert.equal(record.manufacturer, collection.manufacturer, 'manufacturer mismatch');
    const identity = JSON.stringify(['type', 'manufacturer', 'brand', 'model', 'trim', 'year'].map(key => normalize(record[key])));
    assert(!identities.has(identity), `duplicate: ${identity}`);
    identities.add(identity);
  }
  const sample = collection.records[0];
  const bad = [
    { ...sample, model: '' }, { ...sample, year: 1989 }, { ...sample, year: '2020' },
    { ...sample, extra: true }, { ...sample, evidence: { ...sample.evidence, market: 'EU' } },
    { ...sample, evidence: { ...sample.evidence, checked_on: '2026-02-30' } },
    { ...sample, evidence: { ...sample.evidence, source_url: 'http://example.com' } },
  ];
  for (const record of bad) assert.throws(() => validate(record, schema), 'invalid sample accepted');
  return { records: collection.records.length, schema: 'PASS (all used keywords)', normalizedDeduplication: 'PASS', negativeTests: bad.length, advanceAllowed: collection.coverage.advance_allowed };
}

if (typeof process !== 'undefined' && process.argv[1] === fileURLToPath(import.meta.url)) console.log(await checkCollection(process.argv[2]));
