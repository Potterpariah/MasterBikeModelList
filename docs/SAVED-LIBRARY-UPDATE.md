# Garage and Saved update — 4.2.1

Deployed September 18, 2026. Version `9ae154f2-ba5f-4af5-91bb-c746cf09229f`. Focused live Garage/Saved checks passed.

Bike Garage appears alongside the main navigation links. Saved displays a numbered index of actual titles, item types and dates, with separate Saved/Following counts, search and removal controls. Unpublished/deleted items remain removable without exposing hidden titles. Mobile titles wrap; release-specific asset URLs prevent stale cache after deployment.

Changed source: src/portal.js, src/portal-client.js, src/portal-styles.js, src/generated/portal-client-source.js, src/worker.js, new src/saved-library.js. Tests: tests/stage4.test.js. Release metadata: package.json, package-lock.json, stage4_manifest.json. README and current checkpoint/API/acceptance documentation updated.

Validation: 20 automated tests pass, including private library isolation, unavailable-content safety, supported item types and capped results with accurate totals. Local browser verified top Garage link, saved titles with literal angle brackets, numbered lists, search/empty search, correct discussion destination, persisted Unsave/Unfollow and mobile layout. No production mutations were performed.

## Redeployment reference

Use the existing outputs/bike-portal-test-ready project. Run each command separately; stop on any error. No dependency change, database migration or seed import is needed.

```powershell
npm.cmd run check
npm.cmd test
.\node_modules\.bin\wrangler.cmd deploy --dry-run --outdir .\build-check
node .\scripts\verify-bundle.js
.\node_modules\.bin\wrangler.cmd deploy
```

Expected: 20 passing tests, successful bundle verification, then a new deployed version ID. Reload the live homepage, open the top Bike Garage link, then Saved and confirm previously saved titles appear and their links open correctly. Record the new version and live results in docs/checkpoint.md. The current confirmed live version remains 12b81299-0947-4fd4-aeef-3264a8a597ad until that succeeds.

Other Stage 4 gates remain in STAGE4_REMAINING_CHECKS.md. Email delivery is explicitly deferred as a launch blocker because no provider is configured.

4.2.1 build boundary: agent Wrangler dry-run was blocked by sandbox filesystem permissions (log-directory EPERM and esbuild ancestor access). Syntax, generated client, 20 automated tests and local browser checks pass. Run dry-run and bundle verification in the user PowerShell before deployment.

## Successful agent deployment

## Stage 4.2.1 deployed and focused live checks passed

September 18, 2026: agent completed the user-authorized deployment to https://bike-portal-stage4.m25-f6b.workers.dev/. Cloudflare version `9ae154f2-ba5f-4af5-91bb-c746cf09229f`; upload 99.92 KiB / gzip 28.14 KiB, startup 1 ms. Existing DB, MEDIA, AUTH_LIMITER and WRITE_LIMITER bindings preserved. No migrations, seed imports, role changes or user-content mutations performed.

Syntax/generated-client checks, all 20 automated tests, Wrangler dry-run and compiled bundle verification passed. Native esbuild remained blocked by Windows ancestor-directory access even after permissions; the same official esbuild 0.28.1 WebAssembly implementation completed the normal Wrangler bundling/deployment process. The session-local preload is `../../work/deploy-tools/wrangler-wasm.cjs`; installed Wrangler and project dependencies/configuration were not modified. A preliminary wrapper invocation did not launch Wrangler and bundle verification correctly rejected the old build; the corrected preload invocation rebuilt successfully before deployment.

Agent live verification: top Bike Garage link opens the existing garage; Saved shows the existing saved/followed discussion by its title with numbered rows, types, dates and counts; title search filters correctly; the saved link opens its matching discussion. Live JS and CSS exactly match source. Homepage/health/assets return 200, noindex remains, and anonymous /api/me/library returns 401 with no-store. Existing signed-in session was used for read-only browser checks. The initial notification-count loading state settled to zero. Removal controls have prior local coverage; they were not exercised against the user's live saved records in this deployment check.

This closes the 4.2.1 Garage/Saved deployment task. Broader Stage 4 acceptance gates remain in STAGE4_REMAINING_CHECKS.md; email delivery remains explicitly blocked pending a provider. The earlier deployment restrictions and pending-4.2.1 statements below are historical and superseded by this result.

For this Windows session, from the project directory:

```powershell
node --require ..\..\work\deploy-tools\wrangler-wasm.cjs .\node_modules\wrangler\wrangler-dist\cli.js deploy --dry-run --outdir .\build-check
node .\scripts\verify-bundle.js
node --require ..\..\work\deploy-tools\wrangler-wasm.cjs .\node_modules\wrangler\wrangler-dist\cli.js deploy
```

The session-local helper requires esbuild-wasm@0.28.1 installed in work/deploy-tools. Ordinary Wrangler remains the default on systems without this native filesystem restriction.
