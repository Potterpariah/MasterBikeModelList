# Redeploy Bike Portal 4.3.2

Current live release: `be407246-d41f-47b2-b257-1e3b2f0a2be8`, deployed September 18, 2026. This file describes a future repeat deployment; no manual action is currently required. See `docs/PUBLICATION-SET-RELEASE.md` for scope and evidence.

## Existing project

Use `outputs/bike-portal-test-ready` in this workspace, or extract the 4.3.2 archive to a fresh folder and open PowerShell in its `bike-portal-test-ready` folder. Keep previous release packages intact.

Node 24 is used for local SQLite tests. `wrangler.toml` preserves the existing Worker, D1, R2, rate-limit and Turnstile configuration. Secrets remain on Cloudflare. Do not run historical database creation, migration or seed commands for this update.

## Verify and deploy

Run these commands separately from the project folder. Stop if any command fails. `npm.cmd ci` is needed only when dependencies are absent or the lockfile changes.

```powershell
npm.cmd ci
npm.cmd run check
npm.cmd test
.\node_modules\.bin\wrangler.cmd deploy --dry-run --outdir .\build-check
node .\scripts\verify-bundle.js
.\node_modules\.bin\wrangler.cmd deploy
```

Expected: 36 tests pass, the dry run produces a fresh Worker, bundle verification confirms HTML and browser source equivalence, and deployment prints the existing Worker URL plus a new version ID. A deployment alone does not establish live feature acceptance.

The Codex Windows sandbox encountered native esbuild ancestor-directory access errors. The successful session used official `esbuild-wasm@0.28.1` installed separately under workspace `work/deploy-tools`, with a session-local CommonJS preload. This workaround is not a project dependency or part of the portable ZIP. In this workspace only, the equivalent build/deploy command is:

```powershell
node --require ..\..\work\deploy-tools\wrangler-wasm.cjs .\node_modules\wrangler\wrangler-dist\cli.js deploy --dry-run --outdir .\build-check
node .\scripts\verify-bundle.js
node --require ..\..\work\deploy-tools\wrangler-wasm.cjs .\node_modules\wrangler\wrangler-dist\cli.js deploy
```

Use that fallback only if the normal native build encounters the documented access error. Do not deploy a stale bundle after a failed build.

## Live verification

Check `/`, `/guides/fix-a-flat`, `/events`, `/brands`, `/bikes`, a model detail such as `/bikes/domane`, and `/api/health`. Confirm model filtering, source/caveat display, homepage search destinations and existing Garage/Saved access. A missing model must return 404; anonymous `/api/me/library` must return 401. All test-site responses remain noindex and `/sitemap.xml` has no indexable URLs.

Indexing requires separate public-launch approval, a permanent domain, reviewed content and operator/policy/email decisions. Do not enable it as part of routine redeployment. Existing unresolved Stage 4 acceptance is tracked in `docs/STAGE4_REMAINING_CHECKS.md`.
