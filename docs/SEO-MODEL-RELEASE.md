# SEO and model enrichment — release 4.3.1

September 18, 2026. Both requested phases are deployed to the existing Bike Portal test Worker. Current Cloudflare version: `4f414fec-3600-44c7-bb85-dc8bdad94f79`. Upload 153.50 KiB (gzip 41.61 KiB), startup 1 ms. Previous SEO-only release 4.3.0: `c8a98a7f-7d7e-4af9-9c83-2d204332843d`.

## SEO changes

- Added server-rendered hubs and standalone guide, event, brand and model URLs. Existing application/hash links continue working; ID URLs redirect to existing slugs and missing documents return HTTP 404.
- Unique titles, descriptions, canonical URLs, Open Graph metadata and breadcrumbs. Reviewed guide pages have Article markup. Event markup is restricted to future verified events with venue, address and recorded verification date; it is not a rich-result guarantee.
- Deliberate robots and sitemap routes. This workers.dev test site remains `noindex, nofollow`, with an empty sitemap. Future indexing requires both explicit `PUBLIC_INDEXING=enabled` and a valid, matching HTTPS `PUBLIC_ORIGIN` on the approved permanent domain. Query URLs, APIs, account tools, diagnostics and unapproved content remain excluded. Brand/model pages remain excluded pending editorial approval.
- Removed internal planning language from six guide bodies through runtime overlays. Expanded and organized the inner-tube flat-repair guide with steps, preparation, repeat-failure guidance, limitations, source links and honest AI-assistance/review disclosure. The other 15 guides have not all received a full technical review. No expert credentials or original photography are claimed.
- Rechecked selected fields for Midnight Massacre, Conquer the Coast and Cotton Patch Challenge with official organizers/registration sources. Review fields and outstanding route conflicts are visible. This is not a refresh of all 72 event records.
- Added About, editorial standards, community guidelines and truthful data-use information. These are not final legal policies. Omitted three known test discussions from the homepage without deleting them.

## Model enrichment

All 25 existing model families now have 71 selected manufacturer facts, concise riding context, exact version/market scope, source URLs, review dates, caveats and explicit unknown fields. Models can be browsed at `/bikes`, filtered by brand/model/riding style, reached through `/brands`, and opened directly from homepage search.

`data/model-enrichment.json` is the new structured dataset. `src/model-data.js` joins it to the existing catalog by immutable model ID. It does not replace Stage 3 data or modify D1. The family slug remains the URL identity; trim/year details are explicitly scoped within each entry. Prices, complete-bike weights and full size geometry remain unknown, rather than being inferred across builds. There are no fabricated offers, ratings, availability promises or hands-on review claims.

Manufacturer content was inspected through web retrieval/search results. Cervelo Caledonia and Trek Verve explicitly flag limited direct retrieval and search-index evidence. Some sources document older or international builds; the corresponding pages disclose this instead of labeling them current US stock.

Notable source differences: Brompton C Line gear-option text conflicts within the manufacturer page; Giant's Defy Advanced 1 PDF lists both 38 and 40 mm maximum tire sizes. Both remain unresolved. Surly tire limits are deliberately not collapsed across differing documents/generations. Domane SL/SLR Gen 5 facts correctly distinguish it from Gen 4, including the removal of IsoSpeed and internal storage.

The date is a review date for listed facts, not proof that every field, stock status or every model in the family is current. These directory pages still need editorial publication review before search indexing. Primary links and source scope are retained per record so future updates can target individual facts.

## Changed files

New: `src/seo.js`, `src/editorial.js`, `src/public-pages.js`, `src/model-data.js`, `data/model-enrichment.json`, `tests/seo.test.js`, `tests/models.test.js`, this report and live evidence.

Updated: `src/worker.js`, `src/portal.js`, `src/portal-client.js`, `src/portal-styles.js`, generated browser source, `tests/portal.test.js`, package version/check scripts, README, REDEPLOY, checkpoint and manifest. Existing schemas, seed files, Cloudflare configuration, resource bindings and user records are preserved.

## Validation

- Syntax and generated-client checks passed.
- All 31 automated tests passed. Coverage includes existing account/community isolation, public routing, escaping, malformed source URLs, indexing opt-in/negative cases, sitemap rules, model coverage/scope/conflicts/unknowns, filtering, all model pages and internal links across the recovered content.
- Wrangler dry-run and compiled Worker/client-equivalence verification passed. Native esbuild encountered the known Windows ancestor-path access problem; the official matching esbuild 0.28.1 WASM implementation completed normal Wrangler builds through the existing workspace-local preload. No installed Wrangler code or project dependencies were altered for that workaround.
- Local browser: brands → models → filter → detail; homepage search → model destination; responsive model layout at 390 px without horizontal overflow. Existing signed-in live Garage opens from a new model page.
- 41 read-only live HTTP checks passed, including all 25 model detail URLs, canonicals, enriched catalog, guide and trust pages, missing model 404, private-library 401, noindex, staged sitemap and exact deployed browser-script equality. Evidence: `test-evidence/seo-models-live-2026-09-18.json`.
- Live browser confirmed filtered model list, Domane generation facts, standalone flat-repair guide and the existing Garage. No user records were added, edited or removed during live verification.

No Lighthouse/CrUX measurement, Search Console verification, ranking/traffic outcome, full manufacturer link audit or new comprehensive Stage 4 live acceptance is claimed.

## Remaining launch requirements and next step

Continue with a small publication-ready Texas event/guide set: recheck future event details, complete technical guide review and resolve model source conflicts. Choose the permanent domain and supply operator/contact details; finalize policy/retention/deletion decisions. Email verification and password-recovery delivery remain blocked because the user has no email provider. Broader live Stage 4 gates remain in `STAGE4_REMAINING_CHECKS.md`.

Only after those decisions and publication approval should indexing be enabled and Search Console/organic landing and useful-action measurement begin. No domain, credentials or provider was invented. Stop here with the two requested implementation phases deployed.
