# Texas catalog validation — 2026-09-29

## Scope

This branch contains only public, source-attributed Texas catalog content under `/texas` and `/trails`. It does not change Bike Portal's calendar, D1 schema or seeds, authentication, account data, saved items, messages, organizer claims, moderation, or challenges.

## Revalidated adapter

`src/texas-cycling-data.js` was regenerated with `scripts/import-texas-cycling-data.mjs` from the preserved Texas Cycling Hub public-source files. Each imported event, route, and highlight retains the source URL, source label, checked/review date, and any source-provided safety, closure, map-scope, or unknown-data note.

The reproducible source totals are:

| Slice | Records |
| --- | ---: |
| Events | 11 |
| City guides | 12 |
| Trail summaries | 7 |
| Route pages | 13 |
| Route highlights | 15 |

These totals differ from the supplied integration inventory (13 cities and 15 routes). The difference is deliberately visible rather than filled with inferred records. The prior adapter had an additional Longview city/route slice that is absent from the revalidated source snapshot; it is held for source review and is not represented as current v35 data on this branch.

## Validation performed

- Texas source content validation: passed (`18 sourced records, 13 mapped routes, 15 verified local clubs`).
- Bike Portal static check: passed.
- Full Worker regression suite: passed, 39/39 tests.
- No migration or seed file changed; no remote D1/R2 access occurred.

The source checkout used for review has unrelated local edits. It was read only; this branch was created from Bike Portal commit `696cdcc`, not from that checkout's working-tree state.

## Deployment evidence

The public catalog implementation at commit `318f5c6` was deployed to the existing Bike Hub Worker on 2026-09-29:

- Worker: `bike-portal-stage4`
- URL: `https://bike-portal-stage4.m25-f6b.workers.dev`
- Cloudflare version: `23018d93-bcba-44c4-a437-930f3e8ec925`

Read-only production checks confirmed 200 responses for `/texas`, `/texas/clubs`, the Park to Port event detail, its `.ics` calendar feed, the Capitol Peak route page, and its map-verified GPX feed. The planning-only Butler route GPX returned 404 as intended. `/api/me/library` returned 401 while anonymous, preserving account boundaries.

This Worker remains non-indexable (`X-Robots-Tag: noindex, nofollow`) and its sitemap contains no URLs because public-indexing configuration has not been enabled. The deployment is therefore a live functional release, not an SEO indexing launch.
