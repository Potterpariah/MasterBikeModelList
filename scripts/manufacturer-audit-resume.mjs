import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
import assert from 'node:assert/strict';

const digest = bytes => createHash('sha256').update(bytes).digest('hex');
const list = (value, name) => {
  assert(value === undefined || Array.isArray(value), `${name} must be an array`);
  return value ?? [];
};

// Exact URL keys deliberately preserve archive timestamps, query strings and paths.
// References describe saved evidence, never a count of network requests.
export function buildResume(collection) {
  assert(collection && typeof collection === 'object', 'collection required');
  assert(typeof collection.manufacturer === 'string', 'manufacturer required');
  assert(Array.isArray(collection.records), 'records array required');
  const coverage = collection.coverage ?? {};
  const sources = new Map();
  const add = (url, kind, path, detail) => {
    assert(typeof url === 'string', `${path}: URL string required`);
    const parsed = new URL(url);
    assert(parsed.protocol === 'https:' && !parsed.username && !parsed.password,
      `${path}: expected HTTPS URL without embedded credentials`);
    if (!sources.has(url)) sources.set(url, { url, references: [] });
    sources.get(url).references.push({ kind, path, detail });
  };
  collection.records.forEach((record, index) => {
    assert(record?.evidence?.source_url, `records[${index}]: evidence source required`);
    add(record.evidence.source_url, 'record', `records[${index}]`, {
      type: record.type, manufacturer: record.manufacturer, brand: record.brand,
      model: record.model, trim: record.trim, year: record.year,
      checked_on: record.evidence.checked_on,
    });
  });
  for (const [field, kind] of [['identity_review', 'review'], ['excluded_source_findings', 'exclusion']]) {
    list(coverage[field], field).forEach((entry, index) => {
      assert(entry && typeof entry === 'object', `${field}[${index}]: object required`);
      const path = `coverage.${field}[${index}]`;
      if (entry.source_url) add(entry.source_url, kind, path, entry);
      list(entry.related_source_urls, `${path}.related_source_urls`).forEach((url, n) =>
        add(url, kind, `${path}.related_source_urls[${n}]`, entry));
    });
  }
  list(coverage.pending_sources, 'pending_sources').forEach((url, index) =>
    add(url, 'pending', `coverage.pending_sources[${index}]`, null));
  list(coverage.same_identity_source_urls, 'same_identity_source_urls').forEach((url, index) =>
    add(url, 'identity-alternative', `coverage.same_identity_source_urls[${index}]`, null));
  if (coverage.live_inventory_review?.source_url) {
    add(coverage.live_inventory_review.source_url, 'inventory', 'coverage.live_inventory_review', coverage.live_inventory_review);
  }
  const groups = [...sources.values()].map(group => {
    const counts = {};
    for (const ref of group.references) counts[ref.kind] = (counts[ref.kind] ?? 0) + 1;
    const flags = [];
    if (counts.pending && group.references.some(ref => ref.kind !== 'pending')) flags.push('pending-with-saved-evidence');
    if (counts.review && counts.exclusion) flags.push('review-and-exclusion-overlap');
    if (counts.review > 1) flags.push('multiple-review-entries');
    if (counts.pending > 1) flags.push('repeated-pending-reference');
    return { ...group, counts, flags };
  });
  return {
    manufacturer: collection.manufacturer,
    coverage: {
      status: coverage.status ?? 'unknown',
      nextManufacturer: coverage.next_manufacturer ?? null,
      savedAdvanceAllowed: coverage.advance_allowed ?? null,
      notes: list(coverage.notes, 'notes'),
    },
    counts: {
      records: collection.records.length,
      distinctRecordSources: groups.filter(group => group.counts.record).length,
      distinctSavedSources: groups.length,
      savedUrlReferences: groups.reduce((sum, group) => sum + group.references.length, 0),
      pendingEntries: list(coverage.pending_sources, 'pending_sources').length,
      distinctPendingSources: groups.filter(group => group.counts.pending).length,
      reviewEntries: list(coverage.identity_review, 'identity_review').length,
      exclusionEntries: list(coverage.excluded_source_findings, 'excluded_source_findings').length,
      flaggedSources: groups.filter(group => group.flags.length).length,
    },
    pending: [...new Set(list(coverage.pending_sources, 'pending_sources'))].map(url => {
      const { counts, flags } = groups.find(group => group.url === url);
      return { url, counts, flags };
    }),
    sources: groups,
    limits: 'Offline saved-reference analysis only. Overlap is a review lead, not proof of contradiction or resolution. No completeness, freshness, schema-validation, advance permission, or network-request claims. URLs mentioned only inside prose are not indexed; inspect the linked saved entries and coverage notes.',
  };
}

export async function readSnapshot(file) {
  const bytes = await readFile(file);
  const report = buildResume(JSON.parse(bytes.toString('utf8').replace(/^\uFEFF/, '')));
  let endingHash = null;
  try { endingHash = digest(await readFile(file)); } catch { /* writer may replace file */ }
  return { snapshot: { file: resolve(file), sha256: digest(bytes), bytes: bytes.length,
    changedDuringRead: endingHash !== digest(bytes) }, ...report };
}

export function formatResume(report) {
  const c = report.counts;
  const lines = [
    `${report.manufacturer}: ${report.coverage.status}; saved advance_allowed=${JSON.stringify(report.coverage.savedAdvanceAllowed)} (not changed or independently verified).`,
    `${c.records} records / ${c.distinctRecordSources} record sources; ${c.savedUrlReferences} structured URL references / ${c.distinctSavedSources} distinct saved sources.`,
    `${c.pendingEntries} pending entries; ${c.reviewEntries} review entries; ${c.exclusionEntries} exclusions; ${c.flaggedSources} sources flagged for local comparison.`,
    `Snapshot SHA-256: ${report.snapshot.sha256}; changed during read: ${report.snapshot.changedDuringRead}.`,
    '', 'Pending sources (saved order, exact URL deduplication):',
    ...report.pending.map(group => `- ${group.url}\n  ${JSON.stringify(group.counts)}${group.flags.length ? '; ' + group.flags.join(', ') : ''}`),
    '', 'Saved-source overlaps (first 10; --json includes all):',
    ...report.sources.filter(group => group.flags.length).slice(0, 10).map(group =>
      `- ${group.url}\n  ${group.flags.join(', ')}; ${group.references.map(ref => ref.path).join(', ')}`),
    '', 'Resume: inspect a flagged URL with --source URL before reopening it; compare saved record/review/exclusion entries. Resolve meaning manually in the existing owning record. For a genuinely missing fact, choose a bounded source batch from the existing pending list. Keep the existing minimal-field contract and validator. Do not advance merely because a source appears in multiple sections.',
    report.limits,
  ];
  return lines.join('\n');
}

const help = `Offline manufacturer research resume report; never writes files or fetches URLs.
Usage: node scripts/manufacturer-audit-resume.mjs [--file COLLECTION.json] [--json] [--source EXACT_HTTPS_URL]
Default collection: ../data/manufacturer-collection/3t.json relative to this script.
--source prints all saved references for one exact URL, including their original paths and text.
--json prints the full derived report; it is not a new tracker or authority record.
Read the current owning records before deciding whether an old review is resolved.
Run the existing validate-manufacturer-collection.mjs separately for schema/dedup checks.`;

export async function main(args = process.argv.slice(2)) {
  let file = fileURLToPath(new URL('../data/manufacturer-collection/3t.json', import.meta.url));
  let json = false;
  let source;
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--help') { console.log(help); return; }
    if (args[i] === '--json') json = true;
    else if (args[i] === '--file' || args[i] === '--source') {
      const flag = args[i];
      assert(args[i + 1] && !args[i + 1].startsWith('--'), `${flag} requires a value`);
      if (flag === '--file') file = args[++i]; else source = args[++i];
    } else throw new Error(`Unknown option: ${args[i]}`);
  }
  const report = await readSnapshot(file);
  if (source !== undefined) {
    const group = report.sources.find(item => item.url === source);
    assert(group, 'Exact source URL not present in saved structured references');
    console.log(JSON.stringify({ snapshot: report.snapshot, source: group, limits: report.limits }, null, 2));
  } else console.log(json ? JSON.stringify(report, null, 2) : formatResume(report));
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch(error => { console.error(`Resume report failed: ${error.message}`); process.exitCode = 1; });
}
