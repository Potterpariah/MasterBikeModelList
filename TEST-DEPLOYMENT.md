> Current release: 4.3.2, deployed and checked September 18, 2026. Use README.md, REDEPLOY.md and docs/PUBLICATION-SET-RELEASE.md. Older preparation/release notes below are history.

> Current release is 4.3.1, deployed and validated September 18, 2026. Use README.md, REDEPLOY.md and docs/SEO-MODEL-RELEASE.md. The original preparation history below is superseded.

# Bike Portal test-deployment handoff — September 17, 2026

**Subsequent status:** The user deployed version `f384cd62-6b0c-4701-b6ff-3724aef0570f` successfully and confirmed homepage, search/content, health and diagnostics passed. See `docs/checkpoint.md` for current acceptance status. The preparation/deployment instructions below are retained as history; proceed with account and persistence testing, not another deployment.

The source package is prepared and locally tested. Publishing is still gated on a successful Wrangler dry run on your computer. This environment could not complete that step because Wrangler/esbuild was denied access while resolving the project path. This is not a successful bundle validation. No deployment occurred.

This updates the existing `bike-portal-stage4` Worker. It uses its existing database, media bucket and Turnstile configuration. This is not an isolated database: live signup/community tests will write test records to the existing service. Keep the existing service secret; never paste it into source or chat. No schema migration, seed import, new database/bucket or admin promotion is required.

## 1. Open the prepared folder

On this computer, open PowerShell and run:

```powershell
Set-Location 'C:\Users\WS 6\Documents\Codex\2026-09-17\referenced-chatgpt-conversation-this-is-an-4\outputs\bike-portal-test-ready'
node --version
```

Use Node 24 for the included local tests. If using the portable ZIP on another computer, extract it first and open PowerShell in the folder containing `package.json` and `wrangler.toml`.

## 2. Install the pinned tools and verify locally

Run these one at a time. Stop if any fails.

```powershell
npm.cmd ci
npm.cmd run check
npm.cmd test
.\node_modules\.bin\wrangler.cmd deploy --dry-run --outdir .\build-check
node .\scripts\verify-bundle.js
```

Expected: JavaScript checks pass; 10 tests pass; Wrangler builds without errors and lists the existing DB/MEDIA bindings; bundle verification reports the compiled HTML and browser script passed. The dry run does not publish. Do not use an older compiled Worker if this fails.

## 3. Confirm the destination and publish when ready

Read `wrangler.toml`. Confirm in your Cloudflare account that `bike-portal-stage4`, `bike-portal-db`, and `bike-portal-media` are the intended existing resources. The configured database ID and public site key were preserved from the source; they were not verified against the live account during this task. `ENVIRONMENT = "production"` must remain set for secure cookies and mandatory server-side verification, even though this is a test release.

When the checks above pass and you are ready to publish this update:

```powershell
.\node_modules\.bin\wrangler.cmd deploy
```

If authentication is requested, use `wrangler.cmd login` from the same local tool folder and repeat. Expected: Wrangler prints the deployed Worker URL. Do not run the historical setup/migration commands in the older README.

## 4. Verify the deployed result

Open the URL printed by Wrangler. The recorded address is https://bike-portal-stage4.m25-f6b.workers.dev/ but this task could not verify current remote availability.

1. Homepage: see “Your next ride starts here”; search for gravel and read a guide/event.
2. `/api/health`: expect `ok: true`, `stage: 4`, `schemaVersion: "1"`.
3. `/stage4-test`: expect the original diagnostic page.
4. In browser Developer Tools → Network, inspect the homepage response: expect `X-Robots-Tag: noindex, nofollow`.
5. Use designated test accounts to check real Turnstile signup, login/logout, session persistence, garage and event status.
6. Complete `docs/STAGE4_REMAINING_CHECKS.md` for profile persistence, R2 avatars, two-account comments/notifications and moderator permissions. Do not mark those passed based on local tests.

If a check fails, record the route, action and error and stop further publication changes. Keep the previous version available in Cloudflare deployment history. Do not reseed or reset data to troubleshoot an update.

## Validation and limits

Current source checks: 10/10 automated tests and 10/10 source-preview browser checks passed. Browser checks cover desktop/mobile rendering, search/results/empty states, guide reading, local signup, session and garage persistence, logout/login, event filtering and failed catalog loading. No uncaught browser exceptions occurred. Screenshots and browser results are in `docs/test-evidence/`.

Local preview uses temporary SQLite and development authentication. It does not certify the Cloudflare runtime, real Turnstile, remote D1/R2, email or moderation. The old bundle copied from Stage 4.1 was removed from this package to avoid mistaking it for a newly validated build. The original source and previous transfer backup retain that historical artifact.

Changes: test noindex response header; two regression tests; security documentation corrected to the existing 100,000 password-hash iterations; current instructions/checkpoint. No schema, event content, credential, binding or account-flow change. Password reset, email verification, rate limiting, community policies, current event research and broader production acceptance remain open.
