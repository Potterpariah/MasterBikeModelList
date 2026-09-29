# Bike Portal checkpoint — September 18, 2026

## Current: Texas Cycling Hub public-catalog integration prepared locally — September 28, 2026

- Created a separate writable release copy at `C:\Development\bike-portal-texas-integration`; the original Bike Portal checkout under the archived conversation path remains unchanged.
- Imported the Texas Cycling Hub's public, source-attributed catalog only: 11 curated events, 13 city guides, 7 legacy trail summaries, 15 detailed routes, and 15 route highlights. The generated `src/texas-cycling-data.js` retains source URLs, source labels, review dates, route cues, official-map references, and route-data scope. No private accounts, submissions, D1 records, credentials, media, or unreviewed canonical occurrences were copied.
- Added stable public paths: `/texas`, `/texas/events`, `/texas/events/:slug`, `/texas/cities`, `/texas/cities/:slug`, `/trails`, and `/trails/:slug`. These provide internal links, canonical metadata, BreadcrumbList and collection/item structured data, official source links, event-date context, and explicit map/route limitations. Existing Bike Portal events, guides, models, accounts, D1/R2 bindings, migrations, and noindex behavior remain unchanged.
- The existing indexing guard still requires an explicit `PUBLIC_INDEXING=enabled` and a verified HTTPS non-`workers.dev` `PUBLIC_ORIGIN`. When that launch decision is legitimately configured, the sitemap includes the eligible public Texas routes, city guides, and upcoming Texas Cycling Hub event pages. This integration does not enable indexing, register a domain, deploy, alter remote data, or make a production claim.
- Validation passed: `npm.cmd run check` and `npm.cmd test` completed with 38/38 tests passing. The new Texas-catalog tests verify preserved record counts, source protocols, Longview GIS-scope disclosure, the corrected Pedal in the Pines date, default noindex behavior, and gated sitemap inclusion.

## Single next action

Obtain the owner-approved canonical public domain, public operator identity, monitored contact channel, and finalized deletion/retention decisions; then configure those values, make the crawlable public pages indexable, validate the deployed robots/sitemap/canonicals, and submit the sitemap only after the deployment is live.

GPT-ready command prompt: In `C:\Development\bike-portal-texas-integration`, prepare the validated Texas catalog and Bike Portal public pages for an intentional production SEO launch. First inspect `AGENTS.md`, `docs/checkpoint.md`, `docs/LAUNCH-DECISIONS.md`, `src/seo.js`, `src/public-pages.js`, and `src/texas-cycling-data.js`. Use only owner-supplied, verified values for the canonical HTTPS domain, public operator identity, monitored contact channel, and deletion/retention choices; do not invent them or use a `workers.dev` URL as the canonical origin. Configure `PUBLIC_ORIGIN` and `PUBLIC_INDEXING` only after the domain is actually attached and the public policy pages truthfully match implemented behavior. Validate `npm.cmd run check`, `npm.cmd test`, a fresh Wrangler dry-run/bundle check, and live GET/HEAD responses for `/texas`, representative city/route/event pages, `robots.txt`, and `sitemap.xml`; confirm canonical URLs, `index, follow` only on eligible pages, noindex on APIs/accounts/diagnostics, and sitemap coverage. Stop without deployment if the domain, owner facts, policy implementation, email blocker, or live validation is unresolved. Update this checkpoint and the GPT-ready prompt with exact results; do not run migrations or alter existing user data.

## Current: Texas publication set deployed — 4.3.2

September 18, 2026, version `be407246-d41f-47b2-b257-1e3b2f0a2be8`. `/texas-rides` selects Texas Gravel Champs (October 3) and Camp Spinistry (October 17–18), alongside flat repair, pre-ride safety and event-week guides. Five event overlays refreshed. Pure Country Pedal, Goliad and Bonham remain outside the selected set for documented missing/conflicting details. Selection expires after source-review deadlines; no source-monitoring automation was created.

Brompton current gear options resolved by exact-build scope; folded dimensions remain unknown because current pages differ. Giant Defy maximum clearance remains unknown: the current exact model page still contradicts itself (38/40 mm). See docs/PUBLICATION-SET-RELEASE.md for source evidence and implementation scope. Guide review is reference-based, without hands-on mechanic sign-off.

36 tests passed; focused five tests passed again after final markup correction. Syntax, fresh WASM Wrangler dry-run and bundle/client checks passed. Local guide/hub navigation and 390px layout passed. 29 live read-only HTTP checks passed; browser observed hub/event navigation. Evidence: test-evidence/publication-live-2026-09-18.json. No migration/seed import or live account/content/media changes. Existing bindings and test noindex preserved.

docs/LAUNCH-DECISIONS.md recommends bikefieldnotes.com and concrete retention/deletion choices. Awaiting real operator identity, jurisdiction, public contact, domain/name decision and public-post deletion choice; never invent them or publish unimplemented retention commitments. Email verification and password recovery remain blocked because no email provider exists. Other gates remain in STAGE4_REMAINING_CHECKS.md. Next: obtain owner decisions, implement/test agreed lifecycle handling, finalize policies, configure owned domain and resolve outstanding primary-source questions. Earlier release statuses below are historical.

## Current: both requested phases deployed — 4.3.1

User clarified to continue directly from SEO implementation into model enrichment. Completed both; stop here. Current version `4f414fec-3600-44c7-bb85-dc8bdad94f79`, September 18, 2026. All 25 recovered model families now have standalone detail pages and a searchable hub, with 71 scoped manufacturer facts, source links, dates, conflicts and explicit unknowns. New data is an additive checked-in overlay; no remote migrations, seed imports or user-record mutations. Test noindex and all existing bindings remain.

31/31 automated tests, syntax, Wrangler WASM dry-run and bundle equivalence passed. Local desktop/mobile navigation/filter/search checks and live model/guide/Garage browser checks passed. 41 live read-only HTTP checks passed including every model page and deployed-client equality. Detailed scope, source limitations, changed files and remaining launch gates: [SEO-MODEL-RELEASE.md](SEO-MODEL-RELEASE.md). Evidence: `test-evidence/seo-models-live-2026-09-18.json`.

Next logical step is editorial/public-launch preparation: broader guide/event review, unresolved manufacturer conflicts, permanent domain, operator/contact/final policies and the explicit email-provider blocker. No indexing or full Stage 4 acceptance is implied. Earlier statuses below are retained as history and superseded where applicable.

## September 18: SEO phase deployed; model enrichment in progress

SEO release 4.3.0 deployed as c8a98a7f-7d7e-4af9-9c83-2d204332843d (124.08 KiB, gzip 35.89 KiB, startup 1 ms). 27 tests, syntax, Wrangler WASM dry-run and compiled client checks passed. Live homepage, standalone guide, enriched featured event, editorial page, robots and sitemap checks passed. Test noindex remains. Added public guide/event/brand hubs and details, per-page metadata/canonicals/breadcrumbs, gated Event markup, publication allowlist, editorial cleanup and source notes, truthful about/editorial/community/data-use pages. Known test posts omitted from homepage only; records retained. Three featured September 19 events received field-specific source-checked overlays. Original schemas/seeds/account data preserved; no migrations. Public domain, operator/contact, final terms/privacy and email delivery remain launch gates. Empty staged sitemap deliberately publishes no indexable URLs.

User clarified to CONTINUE into model-data enrichment after SEO deployment. Next work: verify the 25 existing model families against manufacturer sources, add scoped factual details and source dates, preserve unknowns and source conflicts; test and deploy the result.

## Stage 4.2.1 deployed and focused live checks passed

September 18, 2026: agent completed the user-authorized deployment to https://bike-portal-stage4.m25-f6b.workers.dev/. Cloudflare version `9ae154f2-ba5f-4af5-91bb-c746cf09229f`; upload 99.92 KiB / gzip 28.14 KiB, startup 1 ms. Existing DB, MEDIA, AUTH_LIMITER and WRITE_LIMITER bindings preserved. No migrations, seed imports, role changes or user-content mutations performed.

Syntax/generated-client checks, all 20 automated tests, Wrangler dry-run and compiled bundle verification passed. Native esbuild remained blocked by Windows ancestor-directory access even after permissions; the same official esbuild 0.28.1 WebAssembly implementation completed the normal Wrangler bundling/deployment process. The session-local preload is `../../work/deploy-tools/wrangler-wasm.cjs`; installed Wrangler and project dependencies/configuration were not modified. A preliminary wrapper invocation did not launch Wrangler and bundle verification correctly rejected the old build; the corrected preload invocation rebuilt successfully before deployment.

Agent live verification: top Bike Garage link opens the existing garage; Saved shows the existing saved/followed discussion by its title with numbered rows, types, dates and counts; title search filters correctly; the saved link opens its matching discussion. Live JS and CSS exactly match source. Homepage/health/assets return 200, noindex remains, and anonymous /api/me/library returns 401 with no-store. Existing signed-in session was used for read-only browser checks. The initial notification-count loading state settled to zero. Removal controls have prior local coverage; they were not exercised against the user's live saved records in this deployment check.

This closes the 4.2.1 Garage/Saved deployment task. Broader Stage 4 acceptance gates remain in STAGE4_REMAINING_CHECKS.md; email delivery remains explicitly blocked pending a provider. The earlier deployment restrictions and pending-4.2.1 statements below are historical and superseded by this result.

## September 18: Garage navigation and named Saved index (4.2.1)

User reported all four instructed live checks passed: disposable garage bike deletion, Save/Follow/Helpful persistence after reload, opening a saved discussion, and Unsave/Unfollow persistence. This confirms those journeys only; cross-account isolation, moderator/report acceptance, live limit enforcement and remaining avatar rejection cases are still open.

The user then requested a Bike Garage link among the main links and reported Saved did not identify saved content. Release 4.2.1 adds that navigation link and an authenticated saved-library API resolving titles, types, dates, counts and destinations. Saved now provides numbered lists, search, Unsave/Unfollow, and safe unavailable-item handling. Long titles wrap on mobile. Asset URLs carry the release version to avoid stale styles/scripts immediately after deployment.

Local automated suite: 20/20 passed. Local browser checks: Garage navigation, named lists, title search and empty search, discussion destination, Unsave/Unfollow persistence and 390px responsive layout. These local results do not establish live acceptance of 4.2.1.

Latest confirmed live release remains 4.2.0, version `12b81299-0947-4fd4-aeef-3264a8a597ad`. Release 4.2.1 is prepared, not deployed. No schema/seed migrations or remote data changes. Email delivery remains a launch blocker by explicit user direction; no provider exists. Continue with docs/SAVED-LIBRARY-UPDATE.md.

## Prior continuation: Stage 4.2 deployed, live acceptance in progress

User authorized following through with the remaining Stage 4 work. New interfaces and backend validation/rate limits are implemented; 17 tests pass and focused local browser journeys pass. User's pasted Wrangler output confirms Stage 4.2 deployment: version `12b81299-0947-4fd4-aeef-3264a8a597ad`, upload 95.03 KiB / gzip 26.93 KiB, startup 1 ms. Existing DB/MEDIA and AUTH_LIMITER (20 requests/60s), WRITE_LIMITER (60 requests/60s) are listed. This supersedes the earlier agent-side build restriction as a deployment blocker; runtime behavior of the new bindings still needs live acceptance. See STAGE4-2-ACCEPTANCE.md for exact scope and live gates.

Agent refreshed the live homepage and observed signed-out navigation, then opened the login form. No credentials were entered by the agent. On September 18, user reported "all passed" to the five-step Stage 4.2 sequence: sign-in and new header, profile editor with username, display-name/bio save and refresh, supported avatar upload, and persistence of those fields/avatar after logout/re-login. These are user-confirmed live results. Avatar rejection cases and location/website edits were not part of that sequence and remain live-unconfirmed. Next: garage deletion and community save/follow/helpful persistence, followed by reports/moderator acceptance and live request-limit checks.

User confirmed no transactional email provider exists and explicitly requested email delivery remain a launch blocker. No live roles, credentials, schema, seed data or existing service resources were changed. Current drafts cover community guidelines and implementation privacy facts; owner/contact/retention/terms decisions remain open. The detailed acceptance history below applies to Stage 4.1, not proof of the new features in production.

Continue from this separate Stage 4.1 test-deployment copy. Original source under the mirrored ChatGPT project and the verified transfer archives remain unchanged. Start with `../TEST-DEPLOYMENT.md`.

- Source syntax and generated client checks: passed.
- Existing tests: 8/8 passed before changes. Current suite: 10/10 passed after changes.
- Edge desktop/mobile browser checks against source preview: 10/10 passed, no uncaught errors. Screenshots reviewed for mobile layout; desktop screenshot retained.
- Wrangler 4.131.2 dry run and bundle verification: user reported completion in their own PowerShell after this agent environment was blocked by filesystem permissions. Individual output was not supplied.
- Deployment: CONFIRMED by pasted Wrangler success output. Worker `bike-portal-stage4`, version `f384cd62-6b0c-4701-b6ff-3724aef0570f`, upload 81.66 KiB / gzip 23.56 KiB, startup 1 ms; existing D1 and R2 bindings listed.
- Live URL: https://bike-portal-stage4.m25-f6b.workers.dev/
- User-confirmed live checks: homepage; search for gravel and guide/event views; `/api/health`; `/stage4-test` all passed. These are user-reported checks, not an independent browser inspection by the agent.
- Agent read-only remote requests were blocked by network permissions earlier. That restriction does not negate the subsequent deployment evidence and user checks.
- Migrations, database resets, seed imports: NOT PERFORMED.

Subsequent live account acceptance: user replied "all passed" to the five-step signup, session refresh, garage addition, logout/re-login with garage persistence, and Interested event status refresh/reopen sequence. Record those journeys as passed. This does not certify avatar uploads, profile editing, invalid Turnstile tokens, protected-endpoint rejection after logout, bike deletion, other attendance statuses, discussions, notifications or moderation.

Account-switch troubleshooting: user subsequently reported being stuck as Test Rider. Agent inspected the live in-app browser, observed Test Rider in the account navigation, clicked Log out, observed Log in/Join the ride, refreshed and observed the signed-out navigation again, then opened the empty login form for the user. Logout worked in this observed attempt; the earlier reported cause is not established. No account was created, no credentials were entered, and no code or deployment was changed. Second-account identity and cross-account notification acceptance remain pending.

Next action: test a discussion by account A, a reply by account B, and account A's notification plus persistent read status. Then complete the remaining live checklist. No new product features were started. The test-deployment ZIP and earlier readiness reports are historical preparation artifacts; this checkpoint contains the subsequent deployment results. Do not redeploy just to run acceptance checks.

Notification inspection: after the user reported not seeing a notification, the agent inspected the live discussion and saw a reply attributed to preview_rider under Test Rider's discussion. The account navigation showed Test Rider. Opening the footer Notifications link displayed `preview_rider replied to "portal test discussion"`, a matching View discussion link, and Mark as read. Receipt/display is now independently observed. Read-status persistence remains pending; the agent did not mark the notification read. The current UI has a footer inbox link but no header unread badge or proactive notification popup, which makes new notifications easy to miss.

Notification follow-up: user replied "pass" to marking the notification read, refreshing and confirming it remained Read. Notification receipt/display and persistent read status are now passed for this two-account journey. The preceding pending status is superseded. Other remaining acceptance items and the notification visibility improvement remain open.

Event-status follow-up: user replied "pass" to Going surviving close/refresh/reopen and Completed surviving logout/re-login/reopen on the same event. Together with the earlier Interested check, the instructed event-status journey is passed. Live checklist also reconciled the previously observed saved discussion and second-account reply. Next acceptance check: after logout, protected garage and notification endpoints deny access. Profile editing, avatar upload, reactions/follows/saves, reports and moderator checks remain open; no source code or deployment changed.

Signed-out access follow-up: user reported "both blocked" for `/api/garage` and `/api/notifications` after logout. Both protected-endpoint denial checks are passed by user report; this supersedes the preceding pending action. Basic homepage/account/garage/event/discussion/notification journeys are now checked for this test deployment. This is not full Stage 4 or production sign-off: profile persistence, avatar upload and validation, garage deletion, reactions/follows/saves and ownership isolation, reports and moderation remain open, along with documented launch implementation gaps. Notification visibility remains a known usability issue. No new code or deployment was performed in this follow-up.

Historical HOMEPAGE_VALIDATION.md and REDEPLOY.md refer to the earlier Stage 4.1 run; they do not establish acceptance of this new build. Current evidence is in test-evidence/. Keep the test noindex header until intentionally preparing production indexing.

4.2.1 build boundary: agent Wrangler dry-run was blocked by sandbox filesystem permissions (log-directory EPERM and esbuild ancestor access). Syntax, generated client, 20 automated tests and local browser checks pass. Run dry-run and bundle verification in the user PowerShell before deployment.
