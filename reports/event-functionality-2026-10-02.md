# Bike Portal event functionality and refresh — 2026-10-02

## Source and scope
Retained worktree: C:\Development\bike-portal-texas-catalog-integration, branch texas-catalog-integration, committed baseline 6f70517beb1270dda087a85a2c7986e741c8d557 plus preserved pre-existing uncommitted work. This report concerns the local candidate, not the deployed Worker. All repository setup outside Bike Portal remains paused. No event records, migrations, credentials, provider settings, indexing, deployments or remote Git were changed.

## Reproduced and corrected
- Ongoing multi-day events disappeared after their first day: range filtering now includes events through their recorded end date.
- ICS exported cancelled events as CONFIRMED and completed events as CANCELLED: these meanings are corrected. Invalid dates and postponed/TBD dates return 409 rather than a misleading dated export. Existing all-day exclusive end and stable slug UID remain.
- Curated /texas/events map had 25 records with one or zero filtered cards: map now shares the filtered rows (one/one and zero/zero reproduced in browser). The separate legacy /events global schematic remains explicitly global.
- Empty map no longer calls fitBounds with no points. Blocked tiles show a warning; missing Leaflet leaves a readable venue and working external location link.
- Mobile Expand map button measured 37.27px at 375/390px: increased to at least 44px. Dialog buttons, Leaflet zoom and marker hit areas enlarged; event-type filtering targets are also enlarged on narrow layouts.

## Evidence
Original seven focused event tests passed. Two new regression groups first failed on the actual old implementation. Final full suite: 69/69 passed, zero skipped or failed. npm run check and syntax checks on the new refresh scripts passed. Tests use in-memory SQLite and disposable fixture files, not Cloudflare services.

Actual headless Chrome checks: 15 rendered cases over widths 1280, 320, 375, 390 and 768. Filtered list, empty result and legacy event page checked at each width. No horizontal overflow or measured visible form/button target below 44px remained. Curated map open/Escape/focus-return, blocked-tile fallback, event-detail navigation and Back preserving filters passed. Separate missing-library check retained an actionable venue link. Screenshots captured; 320px curated screenshot visually inspected. Evidence: event-ui-2026-10-02/after.json, library-fallback.json, PNGs and tests.tap. Browser harness is WS7-specific, points to the retained source and uses a disposable local server/profile with external HTTPS blocked. Initial harness attempts were invalid (extension background target); only the final page-target results count.

Not established: real phone hardware, Safari/iOS, screen-reader acceptance, calendar-app import/update semantics, every event detail, recurrence, month/week calendar grid, user sort/pagination, or production data freshness. The current calendar is a dated list with filtering and individual ICS downloads; a month/week grid is absent, not a failing test. No load/performance certification is claimed.

## Refresh foundation and remaining work
scripts/event-refresh.mjs and scripts/run-event-refresh.mjs implement an inert local review pipeline. Registry config/event-refresh-sources.json reuses ten existing organizer URLs, enabled=false, frequency=daily, America/Chicago, localTime=null. It does not register a cron or change the Worker.

Validated with 18 fixture tests: exact title identity, source hash/retrieval evidence, strict dates and explicit timestamps normalized to the organizer timezone, DST/UTC date boundaries, cancellation/postponement conflict quarantine, stable slug grouping, conflicting-source quarantine, daily local-date idempotency, bounded exponential retries/Retry-After, content size/type rejection, last-known-good preservation, exclusive local lock and audit-first atomic state update. A retrieved candidate is needs_review, never automatically verified or published. Interrupted locks require manual review.

The named Texas Gravel Champs synthetic regression is supported by a fresh official source check: https://www.bikesignup.com/Race/TX/Whitney/TexasGravelChamps2026. Header/signup still advertise October 4; an October 2 notice in Event Description says postponed for flooding with makeup date TBD. No event-data mutation was made. Conservative notice detection may also quarantine unrelated cancellation wording; this is deliberate pending source-specific adapters.

Existing scheduler inspected and left unchanged: C:\Development\Texas-Bike-Hub-Staging-Worker\cloudflare-staging-worker. It belongs to the separate Texas Cycling Hub staging lineage, calls a protected fixture endpoint, has a two-success cap and D1 lease/audit state. Its 17:00 UTC placeholder is not Bike Portal's approved time. Local config alone does not prove whether that external scheduler is active.

Remaining before daily operation: validate the ten real source adapters (JSON-LD coverage is not established), bootstrap current canonical/last-known-good data, define and test the approved canonical writer/review policy, choose the Bike Portal execution host and daily time, then obtain production schedule/deployment activation approval. Suggested discussion point: once daily at 06:00 America/Chicago, with DST handled explicitly; no time has been selected. No duplicate ChatGPT automation was created. This is a tested acquisition/review foundation, NOT a finished daily public-data updater.

## Review and continuation
Review event-functionality-2026-10-02.diff for this task's source changes; it reconstructs the known edits with normalized line endings and excludes pre-existing changes, regenerated map asset and evidence. Existing app-data hashes remained unchanged. Continue only Bike Portal; independent work may run in parallel with distinct file ownership and serial integration, per latest user instruction. Cross-project work requires explanation and approval. Prior three-human-tester and production acceptance gates remain outstanding.
