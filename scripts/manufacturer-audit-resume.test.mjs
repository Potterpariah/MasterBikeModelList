import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, writeFile, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { buildResume, readSnapshot, formatResume } from './manufacturer-audit-resume.mjs';

const url = 'https://example.com/catalog?page=1';
const fixture = () => ({ manufacturer: 'Fixture', records: [
  { type: 'road', manufacturer: 'Fixture', brand: 'Fixture', model: 'A', trim: 'Speed', year: null,
    evidence: { source_url: url, checked_on: '2026-10-05' } },
  { type: 'road', manufacturer: 'Fixture', brand: 'Fixture', model: 'A', trim: 'Other Speed', year: null,
    evidence: { source_url: url, checked_on: '2026-10-05' } },
], coverage: { status: 'in_progress', advance_allowed: false, next_manufacturer: 'Next',
  pending_sources: [url, url],
  identity_review: [{ source_url: url, issue: 'Unreviewed' }, { source_url: url, issue: 'Resolved later' }],
  excluded_source_findings: [{ source_url: url, reason: 'Custom build', related_source_urls: ['https://example.com/custom'] }],
} });

test('groups evidence without merging identities or resolving contradictory notes', () => {
  const value = fixture(); const before = JSON.stringify(value); const report = buildResume(value);
  assert.equal(JSON.stringify(value), before);
  assert.equal(report.counts.records, 2);
  assert.equal(report.counts.distinctRecordSources, 1);
  assert.equal(report.counts.pendingEntries, 2);
  assert.equal(report.pending.length, 1);
  assert.equal(report.coverage.savedAdvanceAllowed, false);
  const group = report.sources.find(group => group.url === url);
  assert.equal(group.references.filter(ref => ref.kind === 'record').length, 2);
  assert.deepEqual(group.flags, ['pending-with-saved-evidence', 'review-and-exclusion-overlap', 'multiple-review-entries', 'repeated-pending-reference']);
  assert.equal(group.references.find(ref => ref.kind === 'exclusion').path, 'coverage.excluded_source_findings[0]');
  assert.match(JSON.stringify(group), /Unreviewed/);
  assert.match(JSON.stringify(group), /Resolved later/);
});

test('does not collapse pagination, archive captures, or meaningful URL variants', () => {
  const value = fixture();
  value.coverage.pending_sources = ['https://example.com/catalog?page=2',
    'https://web.archive.org/web/20200101/https://example.com/catalog',
    'https://web.archive.org/web/20210101/https://example.com/catalog'];
  assert.equal(buildResume(value).pending.length, 3);
  assert.deepEqual(buildResume(value).pending.map(group => group.url), value.coverage.pending_sources);
  assert.equal(buildResume(value).counts.distinctSavedSources, 5);
});

test('pending order remains the owning queue order even when reviews use a different order', () => {
  const value = fixture();
  value.coverage.pending_sources = ['https://example.com/new-lead', url];
  assert.deepEqual(buildResume(value).pending.map(group => group.url), value.coverage.pending_sources);
});

test('missing coverage is unknown, never permission to advance', () => {
  const value = fixture(); delete value.coverage;
  const report = buildResume(value);
  assert.equal(report.coverage.savedAdvanceAllowed, null);
  assert.equal(report.coverage.status, 'unknown');
  assert.equal(report.pending.length, 0);
});

test('malformed data and credential-bearing URLs fail without echoing credentials', () => {
  const value = fixture(); value.coverage.pending_sources = 'invalid';
  assert.throws(() => buildResume(value), /must be an array/);
  value.coverage.pending_sources = ['https://user:secret@example.com/'];
  assert.throws(() => buildResume(value), error => /embedded credentials/.test(error.message) && !/secret/.test(error.message));
  assert.throws(() => buildResume({ manufacturer: 'Fixture' }), /records array required/);
});

test('real CLI reads a disposable snapshot without modifying it; detail and argument errors work', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'manufacturer-resume-test-'));
  try {
    const file = join(directory, 'fixture.json');
    const original = '\uFEFF' + JSON.stringify(fixture(), null, 2);
    await writeFile(file, original);
    const report = await readSnapshot(file);
    assert.equal(report.snapshot.changedDuringRead, false);
    assert.match(formatResume(report), /not proof of contradiction/);
    const script = fileURLToPath(new URL('./manufacturer-audit-resume.mjs', import.meta.url));
    const run = args => spawnSync(process.execPath, [script, '--file', file, ...args], { encoding: 'utf8' });
    const all = run(['--json']); assert.equal(all.status, 0, all.stderr);
    assert.equal(JSON.parse(all.stdout).counts.records, 2);
    const detail = run(['--source', url]); assert.equal(detail.status, 0, detail.stderr);
    assert.equal(JSON.parse(detail.stdout).source.counts.review, 2);
    assert.equal(run(['--source', 'https://example.com/missing']).status, 1);
    assert.equal(run(['--source']).status, 1);
    assert.equal(run(['--unknown']).status, 1);
    assert.equal(await readFile(file, 'utf8'), original);
  } finally { await rm(directory, { recursive: true, force: true }); }
});
