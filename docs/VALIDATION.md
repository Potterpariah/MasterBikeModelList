# Stage 4 Validation Report

Validated on September 11, 2026 before handoff.

## Static/runtime checks passed

- `src/worker.js` passes `node --check`.
- `0001_schema.sql` executes cleanly against a fresh SQLite database.
- `0002_seed_stage3.sql` executes cleanly after the schema migration.
- Seeded relational counts:
  - 18 brands
  - 25 bike-model families
  - 20 maintenance topics
  - 16 launch-ready guides
  - 72 Texas event records
- Duplicate event slugs after import: 0.

## Not yet testable without your Cloudflare account

These require real Cloudflare resources and therefore remain deployment acceptance tests:

- D1 binding from the deployed Worker.
- R2 avatar upload/read.
- Production Turnstile widget + Siteverify secret.
- Production session cookie behavior on the workers.dev/custom domain.
- End-to-end signup/login/profile persistence against remote D1.
- Discussion/comment notification persistence.
- Moderator/report workflow against remote D1.

Use `/stage4-test` after deployment to run the first end-to-end checks.
