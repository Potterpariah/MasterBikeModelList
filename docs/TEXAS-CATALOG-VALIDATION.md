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
- Full Worker regression suite: passed, 38/38 tests.
- No migration or seed file changed; no remote D1/R2 access, deployment, or publication occurred.

The source checkout used for review has unrelated local edits. It was read only; this branch was created from Bike Portal commit `696cdcc`, not from that checkout's working-tree state.
