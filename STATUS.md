# Bike Portal status

Updated: 2026-10-15

## Historical master archive-enrichment checkpoint — 2026-10-15

User-supplied `C:\Users\WS 6\Downloads\bikebook-main.zip` was extracted to a disposable local directory and SHA-256 verified as `e6f1d0cfeb0c0dfe013056e03eb8decf73abb3d1567eadcd03617b56c9049bdf`. Its 10,255 detailed BikeBook records matched the existing historical reference exactly. Historical Master List v1.3.0 now carries 10,188 source-provided manufacturer URL references and 9,466 catalog-photo URL references, while retaining explicit nulls for type, legal manufacturer entity, and trim when the source does not provide them. No images were copied, no DB was changed, and no deployment or publication occurred. Evidence and counts: `reports/historical-trim-master/bikebook-record-details.json`, `historical-master-list-v1.json`, and `source-assessment.json`.

Validation: detail extraction, exact row matching, master assembly, identity audit, release validation, and public-page-index generation passed. Next: obtain Bike Index/BikeBook written reuse permission before treating this local historical reference as deployable public data.

## Historical master incomplete-bike audit — 2026-10-15

Applied only explicit BikeBook catalog labels identifying `Frame`, `frameset`, `frame only`, or `Module`. This added 201 recoverable exclusions (194 initial labels across 14 brands, then 7 parenthesized `Frame` labels from Kona and SE Bikes), for 460 recoverable exclusions total. No catalog label identifies a standalone fork, wheelset, crankset, handlebar, or seatpost. Historical Master List v1.4.0 has 5,497 brand/model pairs, 10,472 year associations, and 34 remaining source-clue-only candidates withheld from the public index. The index remains 5,463 models across 25 brands because all newly excluded rows were already withheld.

Validation passed: assembly accounting, identity audit (zero exact-normalized duplicates; zero named frame/module flags; zero component flags), release validator, page-index build, and focused browser/catalog tests. The checkout has extensive existing unrelated dirty work and no configured Git remote, so no commit or push was attempted. Next: confirm the authorized remote and source-use authority before public synchronization.

## Local historical bike-browser checkpoint — 2026-10-06

The `/bikes` root page now locally replaces its former short seed-model list with a RockAuto-style brand → model browser. It is generated from the sealed Historical Master List v1.2 through `data/historical-bike-page-index.json`: 25 brands and 5,463 model families, with catalog-reported years where known. The 235 possible frame/module candidates remain in the research audit and are explicitly withheld from this complete-bike browse view. Existing legacy individual model routes and the pilot hierarchy are preserved; no D1 change, source-image display, deployment, indexing, or publication occurred.

Verification: focused browser/list tests passed (7/7), the full suite passed (93/93), `npm run check` passed, and a local browser journey confirmed the root brand chooser plus Trek's 1,047 models with no `Frameset` entry or console errors. Source/license and factual-completeness limits remain in force. Next action: resolve the flagged source identities or obtain source/publication rights before treating this local historical reference as a deployable public catalog.

## Current deployed optimization-only release

The user explicitly approved deployment of the exact narrowed candidate on 2026-10-05. **Deployed and independently verified** at https://bike-portal-stage4.m25-f6b.workers.dev/: version `b1bb12f9-5056-4c56-aaea-cee4cf90c86b`, 100% traffic, deployment created 2026-10-05T19:41:25.433Z. Source: `C:\Users\WS 6\Documents\Codex\2026-10-02\task\bike-portal-optimization-candidate`. The broader dirty retained worktree was not published.

Included: shared bicycle-logo/header, responsive styling, real venue maps, clearer filters, accessible contextual help and calendar/date correctness fixes. Eight Trek pilot routes now return noindex 404 without redirects. Existing 25 model families (including legacy Trek), original 11 curated events, backend/account functions, bindings and noindex remain. The six deferred event slugs remain 404; overlay/measurement/automatic expansion and cron are absent. All 121 minimal 3T research records and full deferred source remain recoverable in this retained worktree.

Fresh predeployment build and downloaded deployed source match the approved bundle SHA-256 `96aa58d7e17edcc2f69382136e5982f73364252db66275acd9f5a7e107c52411` byte-for-byte. Downloaded configuration is unchanged. Baseline/rollback version `db976d98-7696-435a-a7e7-3f5d2c1598a5` and its downloaded source/configuration are preserved under `C:\Users\WS 6\Documents\Codex\2026-10-02\task\release-baseline-download`.

Candidate evidence: 61/61 tests, syntax/client build, dry-run and bundle checks; 354 differential route targets, 50 local browser cases and 45 keyboard-help passes. **Actual live evidence:** 52 route checks, five assets, unchanged public catalogue with all 25 model pages; 20 desktop/mobile browser cases, 18 keyboard-help passes, marker/detail/Back/Escape and blocked-map fallbacks; 48 successful tile responses. No live failure remains in these checks. Read-only health/catalogue checks do not certify every authenticated D1/R2/Turnstile workflow; no sign-in or production test-data writes occurred.

Deployment report and evidence: `C:\Users\WS 6\Documents\Codex\2026-10-02\task\deployment-evidence\deployment-review.md`. Original narrowed-release review remains under `narrow-evidence/release-review.md`. Existing research, dirty application source, Git history/refs and broader audit evidence are preserved. No migrations, indexing, DNS, credentials, spending, remote push or scheduling changes occurred. Older discovery/collection checkpoints below are historical, not current expansion authority.

## Source selection — 2026-10-02

The user selected `texas-catalog-integration` (11 additional commits) as the retained Bike Portal development source and requested that older local `main` be archived. This is the retained active development worktree.

The archive is a verified recoverable source snapshot at `C:\Archived-Projects\2026-10-07-development-quarantine\_archive\2026-10-02-bike-portal-main-inactive-20261002T201004Z`, not a physical worktree move. Both dirty worktrees, including untracked non-secret source files and existing deletions, were preserved. The original `C:\Development\bike-portal-texas-integration` folder stays in place because its `.git` is the shared repository storage required by the retained catalog worktree. Do not remove or relocate it as if it were an independent duplicate. The archive contains a verified Git bundle of all 18 referenced/reflog-reachable commits and all three refs, plus worktree-specific patches and source hashes.

This selection supersedes the earlier proposal to create a candidate rooted at GitHub. GitHub history remains unchanged; its Saved badge discrepancy remains a known risk, not authorization to replace the selected source. No branch/ref/index, remote configuration, application file, ignored secret/cache data or provider setting changed.

## Verified current state

Bike Portal is the user's selected growth project and a standalone proof of value. The company site is inzer.com; no backend access or approval to change that site is available. This file owns current state and the single next outcome for this worktree. Earlier instructions and acceptance results quoted below are historical, not current authorization or fresh test results.

| Repository fact | Verified local value |
| --- | --- |
| Worktree | `C:\Development\bike-portal-texas-catalog-integration` |
| Branch | `texas-catalog-integration` |
| HEAD at documentation repair | `6f70517beb1270dda087a85a2c7986e741c8d557` |
| Shared Git store | `C:\Development\bike-portal-texas-integration\.git` |
| Companion worktree | `C:\Development\bike-portal-texas-integration` |
| Configured remotes | None |
| Intended remote, approved by user | `https://github.com/Potterpariah/Bike-Portal.git` |

The two integration folders are worktrees of one repository, not independent repositories. The catalog branch is 11 committed changes ahead of local main (0/11 left/right); both worktrees have pre-existing tracked and untracked changes. Preserve both separately. This worktree retains the Trek pilot, manufacturer research, assets and application changes; its deleted checkpoint and handoff remain absent.

The cached `refs/remotes/github/main` is `e1ffbeb768e6af6e3e93454ba3b503892c6b2521`. Local main has no common ancestor with that cached lineage in this non-shallow Git store. The parent task independently verified that the current private GitHub main matches this cached commit. The user subsequently selected the catalog worktree as the local development source; this does not reconcile the separate GitHub history or authorize a merge or remote change.

The recorded Bike Portal Worker URL is https://bike-portal-stage4.m25-f6b.workers.dev/. No live service was contacted during this repair. Texas Cycling Hub remains a separate source/deployment lineage. Historical deployment evidence below does not certify either integration worktree as deployed.

## Boundaries and unresolved evidence

The exact optimization-only deployment described above was approved and completed. Further feature expansion, indexing, scheduler/measurement activation, DNS, credentials, spending, destructive work, Git history reconciliation and remote pushes remain outside scope. Preserve the retained dirty source, research, existing bindings, noindex and rollback artifact.

## Event-discovery cycle — 2026-10-02

User chose Bike Portal on Cloudflare (m25@inzernet.com); domain remains undecided. Search Console access currently exposes only the separate Texas Cycling Hub property, not Bike Portal. No domain, indexing, provider or deployment changes made.

Local candidate: ten North Texas records checked against official sources, four refreshed and six added; existing curated listing and detail pages reused with filters and visible caveats. Local check/test/bundle results and mobile/desktop evidence are in reports/discovery-cycle-2026-10-02.json and reports/discovery-browser-2026-10-02.json. First-party measurement is disabled by default; only local test actions have been observed. The existing calendar-file exclusive end date was corrected to avoid zero-day all-day entries. Older catalog/manufacturer work is preserved; its prior next outcome and full status are retained in reports/status-before-discovery-2026-10-02.md.

Live read-only checks: /api/health, /texas/events and /robots.txt returned 200, noindex/nofollow. Latest Cloudflare deployment observed: db976d98-7696-435a-a7e7-3f5d2c1598a5, created 2026-10-01T22:04:52.747Z. This is existing production, not the local candidate.

Delivery gate incomplete: three independent tester results, source recheck, approved production release, remote measurement persistence/export, and repeat run outstanding. Audience gate: unobserved, not zero. Bike Portal GSC property/domain and 28-day window remain pending. Initial hands-on minutes were not recorded; no efficiency gain is claimed.

## Single next outcome

Review the deployed optimization-only site with the user and address concrete feedback within its existing functions. Keep expansion, indexing, measurement and scheduling inactive; no additional deployment or production-account test is implied.

## Checkpoint log

### 2026-10-06 — Historical Master List v1.2: catalog photo references attached

Added source-provenanced image-reference fields to the canonical master, without downloading or publishing any images. `photo_url` selects the newest retained BikeBook full-photo URL for convenience; `photo_sources` retains every observed full-photo URL, thumbnail URL, associated catalog years and pinned JSON provenance. Of 5,698 retained pairs, 5,328 have a primary full-photo URL, 370 correctly remain null and 9,947 distinct photo-source variants remain represented. Photo URL accessibility, maker ownership, exact year-match and reuse/hotlink rights are not asserted. `source-assessment.json` now records that boundary. Next: resolve the 235 retained incomplete-bike leads from exact model sources; photo references do not change their status.

### 2026-10-06 — Historical Master List v1.1: source-backed incomplete entries removed recoverably

Confirmed and recoverably excluded 255 additional frame-only entries using two saved, matching facts: explicit `frameset` label plus an explicit frameset/frame identifier in the corresponding linked manufacturer-domain catalog URL. This batch spans Bianchi 17, Cannondale 1, Fuji 44, Giant 37, Leader 1, SE Bikes 29, Specialized 95 and Trek 31. The derived master is now 5,698 pairs and 10,758 year associations; 259 total exclusions remain fully recoverable in `removed-frame-module-records.json`. No original source rows were deleted.

`historical-master-list-v1.json` now records version 1.1.0 and its new hash. Audit retains 235 unconfirmed possible frame/module leads, 155 punctuation collisions and zero exact normalized duplicates. The remaining leads—including generic `frame` wording, `frame only`, URL/photo-only clues and no-link historical labels—were not removed by this batch. Kona archive search found later (2016) official Big Unit and Raijin frame-only pages, but no exact 2013–14 source for the five saved Kona rows; no backward inference or removal. Next: use an exact-year Kona archive/catalog source for those five, then continue only when the source explicitly confirms incomplete sale form.

### 2026-10-06 — Historical Master List v1 sealed as working baseline

User designated the established historical reference as the project working base for future ingestion methods, without U.S.-availability gating. `reports/historical-trim-master/historical-master-list-v1.json` now seals `brand-model-master.json` as the canonical project baseline with an SHA-256 and explicit acceptance/non-claim boundaries. It retains 5,953 pairs, 11,121 source-reported year associations, four recoverable confirmed exclusions, 490 possible frame/module flags, 160 punctuation collision groups, 17 official model sources, 5,873 unverified catalog links and 63 blank model-source fields. `node scripts/validate-historical-master-release.mjs` validates the release fingerprint and counts; it does not ingest or publish. Source rights remain a required later gate for production data use.

### 2026-10-06 — Flagged historical entries retained; source-level and brand-level evidence kept separate

All 63 entries lacking a recovered model link remain in `brand-model-master.json` with `manufacturer_source: null`; none were excluded or converted to a complete bicycle. The existing identity audit retains source-review flags and now reports 490 possible frame/module entries: 456 from names, 173 from catalog URL/photo clues, with overlap. Eight listed brands received provenance-scoped identity checks in existing `master-review-decisions.json`: official brand/complete-bike or distribution evidence for Cinelli, Detroit Bikes, Fairdale, Identiti, New Albion, NS Bikes and Soma; Pake remains documented through the 2019 industry directory/Merry Sales because no accessible official historical source was found. These checks deliberately do not fill model-source blanks, establish legal manufacturer entities, or verify a frameset as a complete bike.

Audit PASS: 5,953 records, zero exact normalized duplicate groups, 160 punctuation collision groups retained. Next: resolve individual flagged models only from model-specific official archive/catalog evidence, starting with Airwolf as already recorded; do not infer a model's sale form from brand-level verification.

### 2026-10-06 — Quick frame screening and existing-source link recovery

Reused the pinned BikeBook revision `cdad71a96c1cf6e77a0306b3276c31704381f55f`, downloading one archive and processing it sequentially offline. Exact normalized brand/model matching found underlying records for every original pair. Existing review decisions now retain catalog manufacturer URLs, per-link source JSON provenance and associated catalog years. Derived master fills 5,873 previously empty manufacturer-source fields with `catalog_link_unverified`; preserves 17 `official_model_source` entries; 63 remain null. These historical links are not live accessibility, official-domain, US-market, complete-bike or year confirmations. Alternative links remain retained rather than silently discarded. Other previously assessed proprietary catalogs were not copied.

Existing `identity-audit.json` flags 490 distinct possible frame/module entries from names or catalog URL/photo clues (456 name flags, 173 URL/photo flags, overlapping). All are review leads only; no deletion or merge in this pass. Master remains 5,953 pairs and 11,121 year associations, with four prior recoverable exclusions. Syntax checks, generator schema/provenance/URL checks and identity audit PASS; zero exact normalized duplicate groups; 160 punctuation collision groups unresolved. Existing app and dirty Git state preserved. Next: inspect linked official evidence for flagged Airwolf, whose saved photo filename suggests a frame, without assuming that filename proves frame-only sales. No live checks of the 5,873 recovered links yet.

### 2026-10-06 — Historical reference: All-City bounded source review

Removed All City Def Wish from the derived master: official archive `https://allcitycycles.com/bikes/archive/def_wish_1` explicitly identifies frame-only sales. Full excluded row remains recoverable in `reports/historical-trim-master/removed-frame-module-records.json`; raw catalog unchanged. Added model-specific official manufacturer sources for Big Block, Macho Man and Nature Boy Zona in existing review decisions. No inferred model years or entity ownership. Macho Man remains because the official sparkle-black archive explicitly offers a complete bicycle despite another generation's frameset-only availability.

Generator validation PASS: 5,954 -> 5,953 pairs; 4 cumulative confirmed exclusions; 17 manufacturer sources filled, 5,936 unresolved; 11,121 year associations; all original pairs accounted for or recoverably excluded. Identity audit: zero exact normalized duplicate groups; 160 punctuation-only collision groups remain unmerged. Source fields for Macho Man Disc and Mr. Pink unchanged after archive-body retrieval timeouts. Airwolf official lead inaccessible and frame-only status unconfirmed: retained, source null. Next exact question: confirm Airwolf complete-bike versus frame-only status from an accessible official archive/manual, using a changed retrieval method rather than repeating the failed page request. Remaining All-City Nature Boy, Space Horse and Thunderdome sources also pending. Historical reference only; no ingestion, application, publication or original manufacturer coverage-gate change.

### 2026-10-06 — Confirmed frame-only removal and manufacturer-source coverage

- User requested confirmed frame/module removal and model-specific manufacturer-source fill. Removed three officially confirmed Langster frameset pairs from brand-model-master.json: Pro Frameset, Pro Frameset Ltd, Steel Frameset. Recoverable full records and source/reasons saved in removed-frame-module-records.json; raw BikeBook and original historical reference untouched. Remaining 456 name-based frame/module flags are not yet source-confirmed; no speculative deletions.
- Master now 5,954 pairs, 11,122 year associations. Added manufacturer_source object or null to every remaining row; filled 14 from saved official Specialized product/archive/recall documents and Cannondale US road catalog exact Supersix 3/4/5 model columns. CPSC alone not treated as manufacturer-hosted source; brand homepage not substituted for exact model evidence.
- 5,940 manufacturer-source fields remain null/unresolved. Field does not establish legal manufacturer entity, complete history or every stored year. Source research remains incomplete, not a finished fill operation. No sources fabricated, no alias merging or ingestion change.
- Validation PASS: all original pairs retained or recoverably excluded, original retained years intact, exact fields, normalized dedup and JSON roundtrip. Refreshed audit: zero exact duplicate groups, 160 formatting collision groups, 485 flagged pairs including 456 frame/module and 35 edition/custom labels.
- Next: inspect underlying BikeBook manufacturers_url leads for unfilled rows and corroborate exact official model pages; confirm remaining frame/module flags before removal. Scope remains historical reference, not runtime ingestion.


### 2026-10-06 — Allez US year batch and SuperSix collision review

- Added official US 2014 year corroboration for Allez, Allez Elite, Allez Comp Smartweld; 21 confirmed pairs total. Year association total unchanged at 11,128 (all three already catalog-reported). Explicit product headings used, not reviewer dates or regional pages. Official Allez Race 2014 absent from exact master pairs; validator caught attempted unmatched confirmation before output write. Removed from confirmations and preserved as discovery finding, not automatically equated with another build or added.
- Alias review: official 2012 Cannondale US road catalog supports SUPERSIX spelling and distinct 3 Ultegra / 4 Rival / 5 105 builds; not proof that all Super Six/Supersix multi-year pairs can merge. Saved exact source/remaining question in existing year-confirmations identity_review. Component 2014 alloy value is not model year.
- Final generation/validation PASS with prior original years retained; whole-list screening unchanged: 5,957 pairs, zero exact duplicates, 160 formatting collision groups, 488 flagged records. No merges/deletions/ingestion changes.
- Next: seek exact official US model/year source for retained Allez Race Smartweld label before linking it to Allez Race; continue unconfirmed Allez labels. Specialized and collision review remain incomplete.


### 2026-10-06 — Specialized archive batch and whole-master identity screening

- Official US product heading confirms Allez Sport 2014; official Langster family archive provides exact years for seven retained labels: Langster, Pro, Steel, Street, Pro Frameset, Pro Frameset Ltd, Steel Frameset. Added eight source confirmations (18 confirmed pairs total), seven previously missing year associations (11,128 total). Frameset year evidence explicitly not complete-bike evidence. Langster Durango/Atlantis/Rio/SF not added as new pairs because outside requested existing-list enrichment.
- Current on-disk master was brand/model-only despite prior enriched-script checkpoint. Preserved snapshot brand-model-before-archive-review-2026-10-06.json, rebuilt all existing 5,957 pairs with saved years; no pair dropped. Cause of reversion unknown; did not overwrite source research or alter Git settings.
- Validation PASS: every 11,120 original year association retained; exact keys, integer years, normalized dedup, JSON roundtrip. Optimized year-retention lookup to a keyed map without changing output semantics.
- Entire-master non-destructive screening: zero exact normalized duplicate groups; 160 punctuation/spacing collision groups; 488 unique flagged records, including 459 frame/module labels and 36 edition/custom labels (overlap). No component-name flags in this limited pattern screen; not proof no component/other false leads. Cannondale Super Six / Supersix spelling collisions require source-based review, not automatic merging. Report: reports/historical-trim-master/identity-audit.json. Nothing deleted or merged.
- Scope limitation: only this bounded archive batch checked, not all 1,337 Specialized pairs or all archive pages. Next: continue exact historical Specialized archive matches and independently resolve the 160 formatting collision groups. Existing official manufacturer coverage gates unchanged; no ingestion/site changes.


### 2026-10-06 — Attach known years and begin stronger year confirmation

- Existing brand-model-master.json now retains all 5,957 pairs with sorted years arrays and separate year_evidence. All 11,120 original BikeBook brand/name/year associations accounted; no invented gaps or production ranges.
- First official batch: three Globe Vienna pairs confirmed for 2009 from manufacturer-hosted CPSC captions; seven exact CruX/Tarmac pairs confirmed for 2012/2013 from final CPSC recall 13-102. Draft manufacturer PDF with placeholder recall date not used. Original names retained, case-only matching; generic family recall scope not spread across all trims.
- Existing year-confirmations.json holds exact evidence and stronger archive entry points. Recall dates/sale dates not model years. Official US Specialized archive and Trek/Gary Fisher 2002–2009 archive identified; landing pages do not verify individual pairs.
- Validation: generator checks original pair and year retention, sorted unique integer years, exact fields, normalized dedup and JSON roundtrip. Result in turn report. Official confirmation remains partial (10 pairs); remaining 5,947 pairs need exact-source checks. No ingestion/runtime changes.
- Next: inspect Specialized US archive exact model-year entries for remaining saved Specialized pairs, retaining US/caption evidence and leaving unsupported years unconfirmed.


### 2026-10-06 — Brand/model-only historical master

- User requested a brand/model JSON derived from the browse/filter reference, plus assessment of year and bike-type/trim enrichment; not ingestion.
- reports/historical-trim-master/brand-model-master.json contains 5,957 normalized unique brand/model pairs across 29 source brands; only brand and model keys. Every one of the 11,120 source entries maps to an output pair. JSON roundtrip, required string checks, exact key checks and normalized dedup PASS.
- Original combined build labels preserved without guessed family/trim split. Existing source retains catalog-reported years 2002–2014; year enrichment can reuse it rather than researching from scratch, but does not prove complete production ranges or US availability. Bike type and separate trim need source inspection and identity reconciliation; framesets/custom builds remain review risks.
- Next: map all saved catalog years back to these pairs, then inspect underlying BikeBook records for usable type and official catalog links. Verify gaps from original catalogs; leave unresolved values unknown. No ingestion or runtime changes. Elevated Git status encountered ownership mismatch; no Git configuration changed.


### 2026-10-06 — Historical master-reference foundation from BikeBook

- New scope is catalog-based historical reference, not ingestion. reports/historical-trim-master contains JSON, filterable HTML, original index, license and source assessment; frozen candidates and official 199 records untouched.
- Pinned BikeBook index: 11,120 brand/name/year entries, 5,957 distinct labels, 29 brands, 2002–2014. Original combined labels retained; type/trim/manufacturer entity/US market unknown. Complete-bike status unverified; not exhaustive history.
- Validation: all index rows accounted, normalized duplicate count zero, JSON roundtrip PASS. Existing official-US collection schema intentionally not used to certify unresolved reference.
- Other catalogs researched: Bicycle Blue Book/99 Spokes copying restricted; BikePedia inaccessible through reader; Bikalog original-document discovery lead. No proprietary catalog bulk-copied. Slow ZIP download canceled; compact public index successfully downloaded, no source code executed.
- Next: expand missing brand/year ranges from accessible original manufacturer catalogs, resolving family/trim and complete-bike identities. No ingestion implementation or deployment.


### 2026-10-05 — Loaded builder inventory; Allied coverage stop

- Archive inventory finished: 12 URLs, all 12 visible, Next disabled. Captured ALLROAD builders cover only retained Dura Ace Di2 and Force AXS identities; missing mechanical Dura Ace / Record / Super Record / generic Ultegra corroboration not found in this inventory. Supersedes prior loading-shell observation, not proof no evidence exists elsewhere.
- No additions/corrections; 68 records. Existing schema/dedup PASS and seven negative tests; advance_allowed false.
- Required official build evidence remains inaccessible/unresolved across three bounded checks. Stop without declaring completeness or moving to All-City.
- Next required input: an accessible official historical ALLROAD catalog/product document resolving these named builds and generic Ultegra versus Ultegra 8000. Save it here or provide its official URL; then resume this gate.


### 2026-10-05 — Alternate ALLROAD retrieval check

- No additions/corrections to 68 bicycle identities. Browser independently confirms official Dura Ace builder URL is not archived; prior Record blocker remains. Super Record reader failure is not proof of no archive. Component-only search results excluded.
- Domain-capture inventory reached through the archive's visible link but observed only a table shell, not usable captures; no zero-capture claim. Existing JSON saves exact methods/URLs and uncertainty; no new queue.
- Validation: Allied schema/dedup PASS, seven negative tests; advance_allowed false.
- Next question: can https://web.archive.org/web/*/https://builder.alliedcycleworks.com/* expose a usable ALLROAD complete-build capture? Otherwise official catalog evidence is needed. Required build coverage remains blocked; no advancement.


### 2026-10-05 — Original ALLROAD alias reconciliation; builder coverage blocked

- Official archived ALLROAD body uses ALFA ALLROAD / ALFA ALL ROAD / ALLROAD interchangeably; retain ALLROAD without duplicate model aliases. No bicycle records added (68 retained).
- Evidence: https://web.archive.org/web/20190718003055/https://alliedcycleworks.com/pages/allied-alfa-allroad . Original older link replayed an official 404; visible replacement navigation supplied the source. Named complete-build menu exposes Dura Ace, Campagnolo Record and Super Record leads; Record builder explicitly not archived. Generic Ultegra versus retained Ultegra 8000 remains unresolved. No year inferred.
- Validation: existing schema/dedup validator run for Allied; result recorded in this turn's report. advance_allowed remains false.
- Next: find alternate official ALLROAD product/catalog evidence for Campagnolo Record / Super Record and Dura Ace; do not repeat the unarchived builder URL unchanged. Stop this batch on inaccessible required build evidence; no manufacturer advancement or completeness claim.


### 2026-10-05 — Original ALFA factory build table recovered

- Added original ALFA Road trims Ultegra, Ultegra Di2, Dura Ace 9100, Dura Ace Di2 9150, SRAM Force, SRAM RED eTap from six-column archived official complete build table. Allied 62 → 68 records. Names differ from later retained ALFA trims; no invented generation suffix/year. Plus headtube, sizes and finish choices excluded as trims.
- Original homepage navigation timeout recovered by inspecting existing tab, not restarting. Actual July 2017 captures saved as sources, never model years. Original ALFA ALL ROAD and custom-geometry ECHO need historical model/alias coverage reconciliation; no advancement. Schema/deduplication and seven negative tests PASS.
- Next exact source: https://web.archive.org/web/20170704155615/https://alliedcycleworks.com/allied-alfa-all-road/; verify named complete builds and whether ALFA ALL ROAD aliases later ALLROAD before adding or merging identities.

### 2026-10-05 — ECHO named complete edition confirmed; two BC40 framesets excluded

- Added ECHO / All-road / Dark Nebula Limited Edition / null, official archived fixed complete Red XPLR/ENVE build body verified. Allied 61 → 62 records. No price/spec/color fields added; named complete edition not an arbitrary finish duplicate.
- OZ BC40 and Lea Davison BC40 bodies explicitly framesets; no named factory complete trim. Saved two source-backed exclusions in existing collection. Do not derive complete builds from Bike URLs, pictures or buyer-directed chat customization. Schema/deduplication and seven negative tests PASS.
- Remaining historical coverage includes original rim-brake ALFA and earlier official named builds; advance false. Next exact question/source discovery: locate official original ALFA rim-brake complete-build catalog or launch body, rather than assume later ALFA/ALFA DISC records cover it.

### 2026-10-05 — ECHO Shimano and later ALFA DISC named trims confirmed

- Added ECHO Dura-Ace R9200 Di2 / Ultegra R8100 Di2; ALFA DISC Dura-Ace R9200 Di2 / Ultegra R8100 Di2 / Ultegra 8020 Mechanical / Rival AXS. Six archived official complete bodies verified; Allied 55 → 61 records. Explicit named series trims and models preserved; all years null. Actual Rival source includes automatically selected variant query, not another size-based record.
- Schema/deduplication and seven negative tests PASS. Original rim-brake ALFA, remaining historical/ltd build coverage and unknown model years remain unresolved; no advancement/completeness claim.
- Next exact source: https://web.archive.org/web/20240518074219/https://alliedcycleworks.com/products/echo-dark-nebula-limited-edition; determine official named complete build versus frameset or paint-only option.

### 2026-10-05 — Consistent historical GX identity and related builds confirmed

- Added BC40 SRAM GX Eagle AXS, SRAM XX1 Eagle AXS, SRAM X01 Eagle AXS; ABLE CLASSIFIED Force AXS and Ekar. Allied 50 → 55 records. Five contemporaneous archived official complete-product bodies verified, all years null. X01 normalized numeral zero preserves source XO1 alias; distinct from newer X0 Transmission.
- Required historical GX identity resolved by consistent 2022 heading/table, independently of inconsistent 2024 source. Both historical AXS and current Transmission records retained. Other historical coverage gaps remain; advance false. Schema/deduplication and seven negative tests PASS.
- Next exact source: https://web.archive.org/web/20220814211156/https://alliedcycleworks.com/products/echo-dura-ace-r9200-di2-complete-bike; verify older ECHO Shimano build bodies and retain distinct named trims.

### 2026-10-05 — Rapha RCC factory complete-build evidence recovered

- Ordering-link homepage observation supplies changed contemporaneous GX source: August 14, 2022 menu explicitly GX Eagle AXS Complete Bike without Transmission. Next source supersedes Dark Nebula: https://web.archive.org/web/20220814220415/https://alliedcycleworks.com/products/bc40-gx-eagle-axs-complete-bike; verify body to resolve GX historical identity. Other menu-only build leads remain unconfirmed.

- Added ABLE / Gravel / Rapha RCC Edition (SRAM Force AXS) / null from official Rapha launch archive: expressly member-preordered complete bicycles and complete equipment list, not customer/racer build. Allied 49 → 50 records. Saved actual August 18, 2022 capture without treating it as model year.
- Combined U.S. evidence preserved: previously verified Allied dollar storefront menu lists RCC ABLE; official Allied designer interview corroborates edition. Rapha archive is GB-localized, not claimed US-localized. Named edition/group combination normalized in trim; Rapha not a separate bicycle brand. Prior inaccessible Allied URL retained as failure history; complete-identity blocker superseded by new source.
- Schema/deduplication and seven negative tests PASS; no advancement while GX and other historical coverage remain unresolved. Next exact source: archived official ECHO Dark Nebula product linked from https://web.archive.org/web/20240518074219/https://alliedcycleworks.com/products/bc40-sram-xx-sl-flight-attendant-bike; determine complete named build versus frameset/paint-only.

### 2026-10-05 — Rapha official design evidence checked; no factory-trim inference

- No additions/corrections; Allied remains 49 records. Existing helper inspected saved Rapha review before research. Changed official source, Allied Jess Money interview, confirms RCC ABLE frame/graphic collaboration but no complete factory trim or year. Dealer customer builds, racer equipment and private listings not promoted to official factory identities.
- Required factory-trim evidence remains inaccessible/unsupported; stop without advancement. Saved source and precise distinction in existing allied.json. Schema/deduplication and seven negative tests PASS.
- Next exact question: does a contemporaneous official RCC product/launch body establish frameset-only, ordinary complete-build paint option, or separately named factory complete trim? Do not retry unarchived Allied URL without changed source/method.

### 2026-10-05 — ABLE flat-bar identity verified; Rapha required evidence inaccessible

- Added ABLE / Gravel / AXS Flat Bar / null year from archived official complete-product body. Actual resolved December 3, 2020 capture retained, not model year. Named flat-bar factory build distinct from drop-bar drivetrain trims; Flat Bar ABLE is not a separate model. Allied 48 → 49 records.
- Saved historical Rapha RCC collaboration lead archive reports URL never archived. Menu alone insufficient; no record added. Precise failure/source retained in existing identity_review, no new tracker. Stop for inaccessible required evidence; GX and other historical coverage gaps still gate advancement.
- Schema/deduplication and seven negative tests PASS. Next exact question: can official Rapha collaboration/launch evidence establish the named complete ABLE RCC build and required trim? Use that changed source instead of repeating failed Allied archive URL.

### 2026-10-05 — Historical ALFA DISC and ABLE named builds confirmed

- Added ALFA DISC road trims Red AXS, Force AXS, Dura Ace Di2, Ultegra Di2, Ultegra 8000; separately retained from later ALFA. Added ABLE gravel trims GRX 815 Di2, GRX 810, Force 1. Eight archived official complete-product bodies verified; Allied 40 → 48 records. All years null, actual source captures retained.
- Generic Shimano GRX Mechanical conflicting 820/810 source not silently equated to independently named historical GRX 810. GX heading/table conflict, older rim-brake ALFA and other historical variants remain unresolved; advance false. Schema/deduplication and seven negative tests PASS.
- Next exact source: https://web.archive.org/web/20200930210800/https://alliedcycleworks.com/products/axs-flat-bar-complete-bike; confirm model/type and named trim from body, not ABLE navigation position alone.

### 2026-10-05 — Historical ALLROAD trim evidence recovered

- Added five body-verified archived official ALLROAD all-road complete builds: Ultegra Di2, Ultegra 8000, Dura Ace Di2, Red AXS, Force AXS. Allied 35 → 40 records. Years null; actual resolved captures retained. External discovery lead not used as record evidence.
- ALLROAD trim blocker resolved for these five named builds only; GX heading/table conflict and historical completeness remain unresolved. No advancement. Existing helper ran before research; no new queue/tracker. Schema/deduplication and seven negative tests PASS.
- Next exact source: https://web.archive.org/web/20200930220241/https://alliedcycleworks.com/products/alfa-disc-red-axs-complete-bike, linked from verified ALLROAD page; confirm ALFA DISC product body before adding.

### 2026-10-05 — Offline resume recovered; precise Allied identity stop

- Existing offline helper ran successfully, unchanged snapshot: 35 records, two pending entries, no structured overlap flags. Previous execution prerequisite resolved; source mentions in prose are outside helper indexing. Reused saved archived BC40 XX SL and XO/X0 evidence as aliases of retained Transmission names; no duplicates added.
- Alternate browser verification of archived GX complete body finds Transmission heading versus older GX Eagle AXS table conflict. Official ALLROAD article confirms model but no required trim. Precise source URLs/blockers saved in existing allied.json; 35 records unchanged, advance_allowed false. No new tracker or completeness claim.
- Schema/deduplication and seven negative tests PASS. Next exact question: which contemporaneous official GX build source resolves the conflicting heading/table, and which official historical ALFA Disc/ALLROAD build catalog supplies named trims? Stop for unresolved identity/coverage evidence.

### 2026-10-05 — Compact-resume prerequisite blocked; Allied gate preserved

- No bicycle additions/corrections in this requested resume. Allied remains 35 records, in_progress, advance_allowed false. Required offline helper execution failed in shell setup and available Node runtime; no successful helper report claimed.
- Saved pending list contains only current ECHO collection/homepage despite unresolved historical BC40 aliases and original ALFA Disc/ALLROAD coverage. Precise blocker saved in allied.json; no new tracker, repeat network retrievals or advancement. Existing saved evidence must be reconciled before claiming manufacturer completion.
- Next exact question: do saved archived BC40 XX SL/X0/GX Transmission bodies map to retained canonical identities, and what official complete-build source establishes original ALFA Disc/ALLROAD trims? First restore execution of scripts/manufacturer-audit-resume.mjs --file data/manufacturer-collection/allied.json. Schema/deduplication and seven negative tests PASS after blocker-only edit.

### 2026-10-05 — Archived Allied BC40 Shimano and Flight Attendant builds

- Official archived bodies verify BC40 Shimano XTR M9100, Shimano XT M8100, SRAM XX SL Flight Attendant. Named factory Flight Attendant build is explicitly described/table-supported, with complete-build enquiry by chat; no contact or transaction made. Retain separately from current Transmission trim.
- Allied 32 → 35 records; 15 additional records in this continuation. Required identities only, years null; source evidence separately retained. Schema/deduplication PASS and seven negative tests PASS. Remaining SRAM BC40 alias reconciliation, earlier models/years and original ALFA Disc/ALLROAD still pending, so advance remains false.

### 2026-10-05 — Archived Allied ABLE and ECHO XPLR bodies verified

- Four additional ABLE complete gravel builds: SRAM Red AXS, SRAM Force AXS, SRAM Rival AXS, Shimano GRX Mechanical. GRX title/prose 820 conflicts with RX810/RX812 table; consistent generic official trim retained, equipment series not asserted. Archived ECHO SRAM RED XPLR AXS 1x body now verified after loading, superseding title-only pending note.
- Allied 27 → 32 records; 12 additions across this continued ALFA/ECHO/ABLE verification batch. All added years null. Schema/deduplication and seven negative tests PASS. Remaining historical BC40 and original ALFA Disc/ALLROAD prevent advance; no full-history completion claimed.

### 2026-10-05 — Archived Allied ECHO named-build reconciliation

- Direct archived official bodies confirm flip-chip ECHO SRAM Rival AXS, SRAM Force AXS and SRAM RED AXS complete all-road builds. Allied 24 → 27 records (seven additions across this ALFA/ECHO batch); all added years null. Current XPLR identities remain separate. Red XPLR 1x archive title alone is insufficient; full body pending.
- Allied schema and normalized deduplication PASS with all seven negative validator tests. Historical ABLE, BC40, original ALFA Disc/ALLROAD and remaining ECHO leads still pending; advance remains false. No deployment, usage polling or unrelated changes.

### 2026-10-05 — Archived Allied ALFA complete-build reconciliation

- Direct official archived product bodies verified four additional ALFA road trims: Ultegra R8100 Di2, Force AXS, Red AXS and Rival AXS. Saved actual resolved capture URLs, not requested timestamps. Allied 20 → 24 minimal-field records; all four years null because archive dates do not establish model years.
- ALFA five listed archived complete builds now supported, including previously retained Dura-Ace. Historical ECHO, ABLE, BC40 and original ALFA Disc/ALLROAD remain pending; Allied stays in progress and All-City is not started. Preserve unrelated local work; no publication or usage checks.

### 2026-10-05 — Archived official Allied ALFA Dura-Ace verified

- Original official ALFA Dura-Ace product archive resolves to actual May 23, 2024 capture (not requested June date). Direct browser body names ALFA DURA-ACE R9200 DI2 COMPLETE BIKE, dollar retail offer and US-made ALLIED road-racing bicycle. Saved minimal Road / Allied / ALLIED / ALFA / Dura-Ace R9200 Di2 / null identity. Capture/footer dates not model year. Allied now 20 records. Temporary verified tab closed.
- Next: follow linked original ALFA Red, Ultegra, Force and Rival complete-bike captures, then historical ALLROAD/ECHO. Historical coverage remains incomplete; no integration/publication.


### 2026-10-05 — Earlier ECHO live failure / historical manual gate

- Direct original ECHO link fails with too many redirects, ending at echo-red-axs-complete-bike; conflicting reader body cannot be presented as live verification. No uncertain historical identity added. Official assembly page independently documents factory ALFA Disc/ALLROAD bicycle assembly but not drivetrain trims or model years. Saved evidence limitation and archive-required next step; Allied remains 19 records.
- Next: retrieve original official historical catalog/launch evidence for named ALFA/ALLROAD builds and earlier ECHO. Do not repeat identical failed live URL without changed evidence. No publication/integration.


### 2026-10-05 — Historical Allied ECHO / ALFA source discrepancies

- Opened original ECHO Red XPLR 1x lead: reader now returns flip-chip ECHO SRAM RED AXS with Red E1 body, not prior indexed XPLR wording. Historical menu exposes ALFA and older BC40 build leads; ALFA Dura-Ace linked product redirects to homepage. Saved discrepancies and exact URLs rather than inferring trims from obsolete slugs or historical menus. No new records; Allied remains 19.
- Next: verify original ECHO body directly in browser before adding its historical named build, then follow official ALFA/ALLROAD archives. Coverage remains incomplete; no deployment/integration.


### 2026-10-05 — Allied outlet identity reconciliation completed

- Read seven remaining outlet complete-bike bodies. Required model/trim identities map to saved ABLE Force Mullet, ABLE EX Rival Mullet, ECHO Force XPLR, FITZ X0 and FITZ XT Di2. Size/condition/custom Payson paint and differing equipment do not justify duplicates of the required identifiers. Preserved all exact URLs and wording caveats; obsolete XX SL slug does not override current small XT Di2 body. No extra records; Allied remains 19.
- Historical source queue saved for ALFA Disc/ALLROAD and original flip-chip ECHO. Next: verify historical named complete-build configurations from those first-party sources/archives. Coverage remains incomplete; no publication/integration.


### 2026-10-05 — Allied all-products pagination / FITZ XT Di2

- Followed official visible Next links sequentially through page 16 (terminal no Next); earlier reader pages 1/2 reported 17 while later reported 16, so no stable exact product census claimed. Main build identities already retained; build groups/components/framesets/apparel not bicycle records. Outlet surfaced distinct FITZ XT Di2 complete bike, confirmed by direct official new-bike product body and saved without size/condition/spec fields or inferred component generation/year. Allied now 19 records.
- Next: reconcile repeated outlet size/condition listings, then historical ALFA/ALLROAD and original ECHO sources. Current title traversal is not proof of exhaustive history. No publication or integration.


### 2026-10-05 — Allied inventory outside main collections

- Official all-products page has 17 pages, so four main collections do not prove current inventory completeness. Page 1 surfaced ABLE EX Force XPLR official complete-bike outlet offer; direct product body verifies named drivetrain and assembled bicycle configuration, one-ride demo condition. Saved build identity without size/condition/price/specification fields or inferred AXS/speed/year. Allied now 18 records. This outlet offer does not prove a standard production trim existed beyond the listed demo.
- Historical official-source leads found: ALFA Disc/ALLROAD assembly manual, Allroad-versus-Able article and original flip-chip ECHO Red XPLR 1x product. These require generation/build reconciliation rather than merging with current ECHO automatically. Next continue current all-products pagination, then historical sources. No exhaustive coverage claim, publication or integration.


### 2026-10-05 — Allied FITZ builds verified

- Individually checked official FITZ XX SL Eagle Transmission, X0 Transmission and GX Eagle AXS Transmission complete-bike bodies. Saved three required-field identities; type Trail mountain, years null. X0 uses numeral zero as corroborated by descriptive body and build bullet despite XO heading spelling. Frameset and optional component/size/paint selections excluded. Allied now 17 records across five model labels (ECHO, ABLE, ABLE EX, BC40, FITZ).
- Next: reconcile official current inventory against these saved builds and review historical Allied models/launches before All-City. Coverage remains incomplete; no publication or integration.


### 2026-10-05 — Allied BC40 current builds verified

- Individually read five official BC40 product bodies: XX SL Eagle Transmission, XTR M9200 Di2, X0 Eagle Transmission, GX Eagle Transmission and XT M8200. Saved required fields only, type Cross-country mountain; all years null. Allied now 14 records. Current XTR heading is M9200 despite legacy M9100 URL; no historical M9100 identity inferred. GX introductory paragraph incorrectly says X0, but product heading, build bullet and dedicated build section consistently confirm GX; no duplicate X0 inferred. Frameset excluded.
- Next: verify FITZ, then reconcile current inventory and historical Allied sources before All-City. Coverage remains incomplete; no publication/integration.


### 2026-10-05 — Allied ABLE named complete builds verified

- Individually reviewed six official US complete-bike product bodies linked from ABLE collection. Saved ABLE Red XPLR AXS, Red AXS Mullet, Force XPLR AXS, Force AXS Mullet, Rival AXS Mullet and separately named ABLE EX Rival AXS Mullet. Allied now nine records; years null. Force E1 title/URL versus heading wording retained as alias review, not duplicate. Two framesets excluded; no component permutations or extra specifications collected.
- Next: verify BC40 named builds, then FITZ and historical coverage before All-City. Manufacturer coverage remains incomplete; no integration/publication.


### 2026-10-05 — Allied current ECHO named builds verified

- Individually checked official ECHO Force XPLR AXS and Rival XPLR AXS complete-bike product bodies and saved both minimal-field records. Together with Red, Allied now has three named current ECHO builds; years remain null. Frameset and optional component/size/finish permutations are not bike trim records. Current and historical Allied coverage remains incomplete.
- Next: verify ABLE current named builds, followed by BC40/FITZ and historical Allied launches before advancing to All-City. No publication or runtime integration.


### 2026-10-05 — 3T supported pass handed off; Allied begun

- 3T supported-source pass closed with gaps, NOT exhaustive historical completion: 131 records, 26 model labels, three types, all years unknown. Current official US inventory reconciled; relevant discovered launch/build leads reconciled. Explicit handoff retains inaccessible leaflets/expired offers, unverified US Rival Plus/G42/Levante/Haute Route editions, contradictory WPNT GRX and Primo-generation uncertainty. New official evidence can reopen gaps; previous in-progress audit snapshots remain historical.
- Advanced in established order to Allied. Saved first official US ECHO SRAM Red XPLR AXS complete-bike build, type All-road, year null. Official homepage offers US shipping; linked product identifies complete build. No equipment fields, colors, sizes or optional component permutations collected. Allied current and historical coverage remains incomplete; next verify remaining ECHO named builds, then ABLE/BC40/FITZ and historical launches before All-City.
- No deployment, publication or runtime integration. Local changes preserved.


### 2026-10-05 — Final 3T migrated index and team unveiling reviewed

- Read final live news index in browser (12 entries, earliest September 2016). Read outstanding Aqua Blue sponsorship and SRAM team-unveiling bodies: frame paint/team assembly and London reveal, not another supported US factory retail trim. Recorded sources and exclusions, with no race-season model year inferred. Temporary tab closed.
- Collection remains 131 records. Next: consolidate reviewed index leads, unavailable original leaflets/offers and unverified US special editions into an explicit coverage handoff before Allied. No claim of exhaustive historical coverage or every travel article reviewed.


### 2026-10-05 — Earliest 3T team sources and Haute Route gap

- Reviewed Q+M, Panaracer/Stan's and Haute Route official bodies. Team articles establish US racing but no additional factory retail trim. Haute Route names genuine PRO/TEAM complete-bike editions offered with France event packages and euro pricing; historical US availability is not established. Saved both as explicit review leads, not confirmed US records. Collection remains 131 records.
- Page-11 browser index read successfully after web-reader failure; temporary tab closed. Page-12 web reader currently fails, requiring browser review next. Historical coverage remains in progress; no publication or integration.


### 2026-10-05 — 3T page-10 custom/design/demo leads reconciled

- Reviewed Diamond in the Rough, both Future Bike essays and Innsbruck demo announcement. These identify custom paint, design/use discussion, same-spec TEAM Force color changes or European demonstrations, not additional supported US factory retail trims. Preserved exact sources and exclusions. No records added; 131 remain.
- Next: review remaining earliest indexed launch leads on pages 11/12, then consolidate supported coverage and explicit source gaps. Historical completeness is not proven. No integration or publication.


### 2026-10-05 — 3T older history/component/rider leads reviewed

- Reviewed five outstanding page-9 bodies: BE FIRST, Left Front Right, Everest preparation, Dolomitica victory and Escape from Austria. Company chronology, bottle cages, racing activity and personal Vienna shop assembly establish no additional named US factory complete-bike trim. Stored exact URLs and source-backed exclusions. Previously reconciled page-9 launch builds remain unchanged.
- Collection remains 131 records; next review relevant page-10 leads. Historical coverage remains incomplete, with known inaccessible and US-evidence gaps preserved. No deployment or runtime changes.


### 2026-10-05 — 3T page-8 race and technical leads reconciled

- Read Strada Mountain Champion, World Championships and Hottubes articles. These establish owner modification advice or sponsored race use of existing bikes, not additional named US factory retail trims. Stored exact official URLs and exclusion rationale; no extra identities or inferred model years. Collection remains 131 records.
- Next: reconcile remaining relevant page-9 older launch/team leads, without treating travel, component advice or custom paint as factory configurations. Supported historical pass remains in progress; no exhaustive-history claim or publication.


### 2026-10-05 — 3T page-7 expired sale leads reviewed

- Read the two outstanding April/May 2020 official Strada sale bodies. Both now contain expired-offer notices rather than original configurations; no recoverable extra trim or historical US offer established. Recorded this source limitation instead of deriving a bike from the URL or sale title. Collection remains 131 records, all years null; no exhaustive-history claim.
- Next: finish remaining relevant older news-index leads; keep unavailable offer and leaflet content explicitly unresolved. No runtime integration or publication.


### 2026-10-05 — Early Boost dropbar/flatbar aliases reconciled

- Compared original May 2022 official US complete-bike offers directly with March 2023 US archive bodies. Earlier EXPLORO RACEMAX BOOST DROPBAR corresponds to retained RACE GRX DROPBAR; earlier FLATBAR corresponds to retained MAX GRX FLATBAR. Frame, motor, drivetrain, wheels and corresponding cockpit agree; price changes do not establish extra trims. Preserved headings and all three evidence URLs in identity review rather than adding duplicates. Required bike fields remain unchanged; 131 records, coverage still in progress.
- Next: finish the remaining relevant historical launch-source review and retain explicit inaccessible/US-evidence gaps before closing the supported 3T pass. No claim of exhaustive history, publication or integration.


### 2026-10-05 — 3T early Boost ULTRALIGHT confirmed

- Added one independently supported US factory complete-bike identity: Electric gravel / 3T / 3T / Racemax Boost / ULTRALIGHT / year null. Original May 7, 2022 archived official US catalog gives named build, USD offer and assembled delivery; frame wording distinguishes non-Italia Boost from later Italia SUPERLIGHT. No capture-date model year or equipment fields inferred.
- Collection now 131 records; no advancement to Allied while supported historical reconciliation remains in progress. Preserve current live-inventory review and explicit unresolved US-source gaps. No deployment, publication or integration.
- Validation passed for all 131 records: required-field schema, normalized deduplication and seven negative test cases. Next: reconcile early Boost dropbar/flatbar naming against retained RACE GRX and MAX GRX builds before considering additional records.


### 2026-10-05 — Atalanta Boost US offering resolved

- Official US Boost catalog actual May 7, 2022 capture names Atalanta Boost flatbar with USD complete-bike offer, assembled delivery and GRX configuration. Added Electric gravel / 3T / 3T / Exploro / FOR ATALANTA BOOST FLATBAR; year null. Total 129 -> 130 (54 snapshot-current, 76 outside snapshot). Delivery date not model year; no inferred dropbar variant. Earlier Atalanta Boost US gap superseded.
- Temporary browser closed. Next: reconcile same catalog's Ultralight/base Boost headings against later saved range, then remaining historical gaps before Allied. No usage polling, runtime, deployment or Git changes.


### 2026-10-05 — Current US storefront refreshed

- Sequential live official US-USD storefront review: 167 products across six pages; 56 complete-bike entries including extra-wheelset bundle, 55 excluding it, 54 distinct bike titles after repeated Primo Rival. Manually reviewed current titles match saved current range; no added identity. Fenders, frame listing, cover, framesets/components/apparel and extra-wheelset bundle excluded. Total collection remains 129.
- Preserved October 2 snapshot/fingerprint and added dated refresh separately; no new hash comparison claimed. Temporary browser closed. Next: final remaining historical source/alias-gap audit before deciding supported manufacturer pass and Allied transition; history still incomplete. No usage polling, runtime, deployment or Git changes.


### 2026-10-05 — Finite 3T coverage audit recorded

- Audited saved JSON: 129 records, 26 model labels, three type labels; all years null, all evidence market labels US. These are file assertions, not independent new source verification or exhaustive historical coverage. Added explicit coverage-audit limits and finite remaining-work register.
- Current title snapshot is still October 2; next: refresh official current title set before closing supported current coverage, then address documented historical leads/gaps. Allied not started; advance_allowed false. No usage polling, runtime, release or Git changes.


### 2026-10-05 — Conflicting GRX archive and Archive navigation checked

- Wayback reports exact Racemax WPNT GRX 1X12 URL unarchived; live 404 and earlier contradictory content remain a documented identity gap. Saved exact failed query to avoid repeat attempts, no speculative trim.
- Official ARCHIVE link is current Black Friday sale, not historical document archive. Supported named bike entries already retained; frameset, wheelset bundle and apparel excluded. Total remains 129. Temporary archive tab closed.
- Next: remaining independently accessible historical US evidence and consolidated manufacturer coverage audit before Allied. No usage polling, runtime, release or Git changes.


### 2026-10-05 — Source queue reconciled

- Removed completed Primo Apex and obsolete all-products page-9 tasks; evidence preserved. Old combined Strada conflict note superseded by resolved Force/Red findings, not a remaining task.
- Fresh Racemax WPNT GRX 1X12 URL returns 404; earlier 1X order-title/Di2 2X body conflict unresolved. Queued exact source; no inferred record/alias. Total remains 129. Next: original archived evidence for this conflict and remaining historical US gaps before Allied. No usage polling, runtime, deployment or Git changes.


### 2026-10-05 — Strada Red PM/Torno conflict resolved

- Original official US product archive actually returned January 23, 2025 capture. One RED XPLR AXS 1X13 353 NSW title; crank body explicitly permits Torno or SRAM Power Meter at order time. Resolved older PM/Torno expanded names as selectable-option aliases, retaining one existing bicycle identity. Current global product redirect cannot replace historical evidence; US launch USD offer independently establishes market presence despite archived CAD header.
- Records remain 129; no inferred model year/specification fields. Temporary browser closed. Next: clean resolved-source queue and assess remaining historical US gaps/current coverage before Allied. No usage polling, runtime, deployment or Git changes.


### 2026-10-05 — Strada Italia Force aliases resolved

- Official USD product title FORCE 1X13 XPLR SHARQ and body explicitly identify E1, with Sharq 42/57 selectable during order. Resolved expanded Force/E1/wheel headings as aliases of retained trim, not additional records. Collection's six ITALIA/ITALIA_X complete-bike titles already saved; framesets excluded. Total remains 129.
- Rechecked Red launch body: two USD wheel-build offerings already retained. Older PM/Torno headings remain unresolved, not inferred from current Force evidence. Next: Red product/archived title comparison and remaining 3T gaps before Allied. No usage polling, runtime, deployment or Git changes.


### 2026-10-05 — Post-launch US Ekar catalog reconciled

- Verified original official US June 3, 2022 PRO/TEAM catalog (actual returned capture, not requested June 1). Six complete-bike headings match retained records. Base Ekar has Fulcrum wheels, no named Levante offer; original USD catalog corroborates base configurations, not US limited-edition availability. Saved exact source and absence limitation, no new record/year. Total remains 129.
- Temporary browser tab closed. Next: unresolved current Strada Italia title/alias conflicts, then remaining historical US leads before Allied. No usage polling, runtime, deployment or Git changes.


### 2026-10-05 — Levante limited-edition lead assessed

- Official Desert Sage Ekar/Levante announcement names a produced complete-bike edition, but euro/VAT and generic shipping do not establish US offering. Base TEAM EKAR already retained; preserved named edition as unresolved US lead rather than adding a speculative trim or treating wheel naming alone as a separate bike. Total remains 129.
- Next: reconcile remaining supported US historical leads/aliases and catalog availability; final manufacturer coverage must distinguish verified inventory from unresolved historical editions before Allied. No usage polling, runtime integration, deployment or Git changes.


### 2026-10-05 — Historical Primo Apex saved independently

- Official Primo Apex body explicitly offers US-dollar Americas pricing and names Primo/Apex XPLR AXS with 1X wireless setup. Added supported historical identity under exact model/build wording; no inferred speed/wheel details/year. Total 128 -> 129 (54 current snapshot, 75 outside snapshot).
- Later WPNT CARBON model/title remains separately saved; equivalence unresolved and not a reason to suppress independently supported historical Primo. Existing October 2023 US archive corroborates offer; failed exact-selector archive lookup not market absence. Focused Rival Plus/G42 official searches yielded no additional explicit US evidence, so those gaps remain.
- Next: remaining US launch/generation gaps and early archived catalogs before Allied. No usage polling, runtime integration, deployment or Git changes.


### 2026-10-05 — Cole Coatings source resolved

- Direct official browser verified London workshop's individually commissioned RTP Strada finish, explicitly distinguished from factory finish. Saved exclusion and superseding reader-gap resolution; no extra US trim/year. Temporary tab closed. Collection remains 128 records.
- Next: reconcile remaining historical US availability/alias gaps (Primo Apex, PRO Rival Plus, G42 and launch configurations) and unavailable early catalogs before Allied. No usage polling, runtime, release or Git changes.


### 2026-10-05 — Orca Pod resolved and 2018 custom stories checked

- Direct browser verified Orca Pod personal RTP frame before assembly; temporary tab closed. Seven further official custom-paint/show-bike stories reviewed (Australian Gold, Rolling Dreamers, Kogel, Ross Piper, Flecha ON, Velovas, Warbasse). Saved exclusions; factory retail identity not inferred from custom or Limited Edition titles. Total remains 128.
- Cole Coatings Workshop reader returns unrelated current content, so remains unreviewed rather than presumed excluded. Next: direct Cole check, then unresolved historical US trim/alias evidence and early catalogs before Allied. No usage polling, runtime integration, release or Git changes.


### 2026-10-05 — Page 9 custom-build exclusions and document availability

- Confirmed five official custom/RTP/owner-paint stories are not extra factory bicycle trims. Saved exact exclusions; 128 records remain. Orca Pod returned unrelated reader content and remains unreviewed.
- Both official early leaflets timed out again; bounded direct Strada retrieval terminated with host connection failure. No live download remains and no full-PDF review claimed. Avoid repeating identical attempts; next: alternate document reader or original archived source, plus remaining page-10/11 relevant custom leads before Allied. No usage polling, runtime or deployment changes.


### 2026-10-05 — Early official leads and showroom cross-check

- Official December 2018 body explicitly equates TEAM Force Green/Black specifications; saved paint aliases without duplicate. Focused early-source lookup found two official 2018 leaflets, but full PDF fetches timed out; queued exact URLs and did not treat snippets as full catalog proof.
- Official August 2022 USD showroom sale supports retained Ekar, MAX GRX and RACE Rival builds; Enough is frameset, paint/wheels not extra records. Documented conflicting Rival image label versus heading rather than inventing a trim. Total unchanged at 128; 3T historical coverage incomplete.
- Next: inspect the two early official leaflets through an available reader and resolve remaining source/alias gaps before Allied. No usage polling, runtime integration, publication or Git changes.


### 2026-10-05 — Earliest migrated 3T archive reached

- Triaged pages 11/12 through earliest listed September 2016 article. Rechecked Strada PRO launch against existing US-supported record; March 2018 Flatmount is frameset launch, January paint options are frames, December 2017 prize lacks verified trim/US retail offer. Saved exclusions and archive limitations. Records remain 128.
- Pagination snapshots overlap; final index is not proof of exhaustive launch/catalog coverage. Next: original earliest US complete-bike catalogs and remaining relevant customer/team stories, then unresolved US aliases/configurations before Allied. No usage polling, runtime or deployment changes.


### 2026-10-05 — 2018/2019 launch coverage reconciliation

- Reviewed five official launch articles: Red AXS, Force AXS, Exploro Speed, Exploro TEAM Force and initial Strada Due. Named complete builds already retained; Red launch body explicitly lists US retailers. April Exploro Force demo is expressly not a factory offer; July 2018 Due is frameset/team-use only. Saved exclusions and aliases without generating speculative builds/years. Records remain 128.
- Triaged archive page 10; next: remaining relevant page-9/10 custom/retail stories, then pages 11/12 and unresolved historical US configurations before Allied. No usage polling, runtime integration, deployment or Git changes.


### 2026-10-05 — NEOS offer adds supported Strada build

- Added Strada TEAM FORCE 1X11 mechanical from official Introducing NEOS 3T offer, whose body explicitly offers US delivery. Total 127 -> 128 (54 snapshot-current, 74 outside snapshot). Electronic Force AXS already retained; NEOS furniture bundle and Stealth paint preserved in identity review, not extra bicycle records. Year null; order/delivery dates not model years.
- Triaged archive page 9 and rechecked Strada Due Ultegra launch against existing record. Linked old global Strada page inaccessible; offer body itself establishes US complete-bike delivery. No runtime integration/deployment or Git change. Next: remaining 2019 launch/custom leads on page 9, then earlier archives before Allied. No usage polling under newest instruction.


### 2026-10-05 — Collection resumed under newest instruction

- User explicitly replaced the usage stop: stop polling usage and continue established-list required-field verification until records confirmed. Previous percentage allowance/checkpoint stop is historical, not a current collection gate. No model change, parallel/background jobs or publication implied.
- Reviewed six official 2019 Get Creative stories: Giraffacorn, Isaac, Black Knight, Razzle Dazzle, Contender Baby Blue and Io Sono Etrusco. All describe personal/customer paint or assembly; none establishes an extra named factory complete-bike trim. Saved exact source URLs and exclusions. Retained 127 records; no unsupported additions or year inference.
- Collection next action: earlier official archive page 9 and remaining unresolved US historical configurations before Allied. 3T remains incomplete. Independent deployed-site review outcome above is preserved; collection data stays outside runtime.


### 2026-10-05 — Usage stop and 3T team-source findings

- Reviewed Mountain Champion, World Championship medals and Hottubes official stories. First is component-modification guidance, others team-use evidence, not additional named factory retail trims. Saved source exclusions; records remain 127, coverage incomplete, Allied not started.
- Usage reached 44% versus baseline 40%: conservative research stop reached. No more collection under this allowance; absolute maximum 45% unchanged. A fresh explicit allowance is required to resume research; automatic goal continuations grant none. Next research action after authorization: remaining page-8 custom/retail leads, then earlier official archive pages. No runtime, release, Git, model or background-job changes.


### 2026-10-05 — Force/Eagle identity resolved

- Original official US Speed catalog capture 20191114190555 simultaneously offers separate TEAM FORCE/EAGLE eTAP and eTAP Torno complete-bike headings. Bodies distinguish standard crank from named Torno Special Edition. Preserve both records, not aliases; no added fields, duplicates or inferred year. Total stays 127.
- Verified visible archive in one temporary browser tab after page-reader failures; tab closed. Saved resolved review finding. Next: remaining 2019 champion/team/custom leads and earlier official archive pages before Allied; 3T coverage remains incomplete.
- Latest account usage 43%, renewed baseline 40%; stop research at 44%, absolute maximum 45%. No model, background job, runtime, release or Git changes.


### 2026-10-05 — 3T 2019 launch identity lead

- Triaged archive page 8 and rechecked PRO Rival/Force-Eagle launches; 127 records retained. Identified possible semantic overlap between TEAM FORCE/EAGLE ETAP and TORNO headings; compare original November 2019 Speed and November 2020 PRO/TEAM/LTD build bodies before merging. String deduplication alone cannot prove equivalence. Saved sources/review queue; do not claim all 127 records proven semantically distinct.
- Next: paired US catalog identity comparison, then remaining historical leads before Allied. Latest usage 43%, baseline 40%, research stop 44%, absolute maximum 45%. No runtime, release or Git changes.


### 2026-10-05 — 3T expired historical offer checks

- Checked three official 2020 offer bodies: Strada May discount and April carbon-wheel offer retain only expired notices; March Bergamo fundraising recap names bundles, not a complete-bike trim. Saved source URLs and limitation; current recommendation cards are not evidence of historical configurations. No inferred additions; 127 records retained.
- Validation passed: all used schema keywords, normalized deduplication and seven negative cases; advance_allowed remains false.
- Next: earlier official archive pages and remaining supported US historical gaps. 3T remains incomplete; Allied not started. Latest account usage 43% against baseline 40%, research stop 44%, maximum 45%. No runtime, release or Git changes.


### 2026-10-05 — 3T archive page 7 build triage

- Reviewed official archive index covering June 2020 to December 2019. Rechecked PRO 105 and Frank Schleck complete-bike announcements against retained identities; no duplicate added. Excluded Cody Mann's personally assembled Exploro LTD as a custom build, not a verified factory retail trim. Records remain 127 before/after; years unchanged/null.
- Validation passed: all used schema keywords, normalized deduplication and seven negative cases; advance_allowed remains false.
- Next source action: review sale/special-offer articles on page 7 for historical factory headings, then earlier archive pages. Index remains pending; 3T incomplete, Allied not started. Saved explicit triage findings to avoid repeating known build checks.
- Account usage 43%, baseline 40%; conservative research stop 44%, absolute maximum 45%. Sequential public-page research only, no background jobs, model change, runtime catalogue changes or deployment. Independent release state and local changes preserved.


### 2026-10-05 — 3T historical alias/source reconciliation

- Retained 127 minimal bicycle records (127 before/after). Reviewed official PRO GRX announcement: general groupset options are not extra factory trims; its selected mechanical 1X bicycle is already retained with original US catalog evidence. Removed this reviewed source from the pending queue.
- Validation passed: 127 records, every used schema keyword, normalized deduplication and seven negative cases; advance_allowed remains false.
- Reviewed Strada THM Project: frame-kit/custom assembly evidence and non-US launch retailers do not verify an additional named US complete-bike offer. Historical suggested-build link redirects to modern Strada WPNT; recorded exclusion and US evidence gap rather than adding a speculative bike/year.
- Recorded failed exact historical Primo Apex archive selector so it is not repeatedly researched. Historical Apex versus later WPNT CARBON remains unresolved; 3T remains in progress and Allied is not started.
- Usage check: 42% account-wide, versus renewed-run baseline 40%; conservative research stop 44%, absolute maximum 45%. No model change, background jobs, publication, runtime catalogue changes or deployment performed by this collection batch. Preserved independent release updates and local changes.


- 2026-10-05: Added three historical Racemax ITALIA US complete-bike identities: RED XPLR AXS 1X13 ZIPP 303 XPLR SW (archive 20250212224619); GRX Di2 2X12 DISCUS 45/40 CTi (20250123045545); FORCE XPLR AXS 1X12 DISCUS 45/40 CTi (20250213001007). Original US storefront captures show CA/CAD, but each product's expanded terms explicitly include US orders; domain/currency alone not proof. EVO/Project X finishes and selectable cranks not extra trims; old Italia not merged into squared Italia_X without evidence. Total 124 -> 127, years null; schema, normalized deduplication and seven negative cases passed. WPNT introduction clarifies Primo paint refresh and newer carbon build; exact older Apex equivalence remains pending, five colors excluded. Removed resolved Speed announcement from pending queue. Temporary browser closed; no app/release/Git changes. Latest account usage 41% against baseline 40%, stop 44%; rounded and shared. Next: old Primo Apex build identity or other supported official gaps before Allied.

- 2026-10-05: User-approved exact narrowed candidate deployed as `b1bb12f9-5056-4c56-aaea-cee4cf90c86b`. Downloaded code matches approved hash, configuration unchanged; 52 live routes, 25 preserved model pages, eight retired/six excluded 404s, 20 live browser cases, 18 help toggles and 48 successful map tiles verified. Rollback baseline preserved; no migrations or activation. Next: review live site and concrete feedback.

- 2026-10-05: Resumed detail verification with token-conscious source batches. Added three Extrema ITALIA historical US builds from official catalog capture 20240229154400: RIVAL GX EAGLE AXS; TORNO RIVAL GX EAGLE AXS DROPPER POST; TORNO FORCE D2 XX SL EAGLE AXS DROPPER POST. Four complete-bike offers collapse to three required-field identities because Force D2 1961/Project X differ by finish; preserve both labels in review queue. Frameset/colors/sizes/specifications excluded; years null. Total 121 -> 124 (54 retained current-snapshot records, 70 outside that snapshot). EVO is explicitly a colourway, not another model; its Red 1X13/Zipp offer remains queued for US evidence and old/current platform identity reconciliation. Evidence: original US-dollar assembled-bike offers, schema-keyword checks, normalized deduplication and seven negative cases passed for 124 rows. Existing dirty application/release work preserved and uncommitted; no runtime integration or deployment. Next: resolve historical Racemax Italia Red 1X13 US offer and remaining build aliases. Latest usage 40%, baseline 40%, stop 44%; equal rounded readings do not mean zero token cost.

- 2026-10-05: Isolated optimization-only candidate verified against downloaded deployed source; Trek pilot retired only in candidate, 25 families and 121 research records preserved. Evidence: 61 tests, dry-run/bundle pass, 354 differential routes, 50 browser cases, 45 keyboard-help checks and map fallback journeys. No deployment. Next: scoped release review and separate approval.

- 2026-10-05: User-approved status reconciliation and earlier-feature review completed. Latest aggregate 92/92 tests and dry-run bundle pass; fresh focused review 32/32 tests, 121-row manufacturer validation with seven negative cases, ten-record discovery structural validation, six browser click/Back cases and direct live/local route comparisons pass. Eight Trek pilot routes are already live; six discovery slugs remain local-only. No deployment, activation or expansion. Next: resolve release scope and remaining source/human acceptance.

- 2026-10-02: Local event functionality corrections and mobile verification completed; full suite 69/69, build/syntax checks passed, 15 rendered desktop/mobile cases plus missing-map-library fallback. Added tested inert organizer refresh/review foundation; no live event writes or daily activation. See reports/event-functionality-2026-10-02.md. Next: source-adapter and canonical-writer acceptance, then daily activation approval.

- 2026-10-02: Prepared the North Texas event-discovery pilot locally. Evidence: 47 tests, check/build and dry-run bundle passed; ten pages checked at desktop/mobile widths; three local measurement actions observed. No release, GSC result, human test or efficiency claim. Next: three independent tester journeys.

- 2026-10-02: Usage telemetry recovered at 3% (new-run baseline 0%, conservative stop 4%). Reconciled Racemax Boost Italia 1961 as paint/logo finish naming for the retained Rival XPLR/Discus 45/40 identity, not another canonical bicycle or model year. Classified G42 official post links a named Racemax Rival AXS 1X12 bicycle, but global product selector now redirects and focused US archive lookup near November 2023 returns actual capture 20230529215043, before launch, with no G42 heading. Focused official US search returned no further source. Added exact unresolved selector/source limitation to identity queue, not an unsupported bicycle or wheel-only company/record. Total 121 unchanged; next resolve other first-party launch/build gaps, including Extrema Italia launch configurations, while retaining G42 US-evidence gap. Git status/HEAD checked: 6f70517beb1270dda087a85a2c7986e741c8d557, existing dirty tracked/untracked work and deletions preserved; no commit or app/deployment changes.

- 2026-10-02: Added five verified Strada ITALIA complete-bike trims from original official US catalog capture https://web.archive.org/web/20240519131255/https://us.3t.bike/en/246-strada-italia: RIVAL AXS 2X12 CARBON WHEELS; ULTEGRA Di2 2X12 3T DISCUS WHEELS; FORCE D2 2X12 3T DISCUS WHEELS; FORCE D2 2X12 3T DISCUS WHEELS PROJECT X; RED E1 AXS 2X12 ZIPP 353 NSW PROJECT X. Explicit US-dollar complete-bike offers resolve migrated launch-page US uncertainty. Project X Force is a separately named factory build, not merely a selectable finish; no separate model or equipment fields created. Total 121 (54 current, 67 outside current inventory); schema-keyword checks, normalized deduplication and seven negative tests passed; all added years null. Strada Italia launch global links now redirect to modern collections, so current global redirects are not historical US evidence. Next: verify the official Classified G42 Launch Edition bicycle offer and reconcile Racemax Boost Italia 1961 finish naming, before advancing beyond 3T. Usage last confirmed 2%, baseline 0%, conservative stop 4%; subsequent refresh stalled and was cancelled. Research stopped pending reliable usage telemetry to protect the user cap. No application/Git/deployment changes.

- 2026-10-02: Reviewed official November/December 2017 Aqua Blue Strada launch and training-camp sources. They describe London team-bike unveiling, mechanic-assembled team bikes and personalized champion paint on RTP frames, not named US retail trim offers. Excluded as additional US identities; US rider nationality and explicit 2018 season do not establish US model year. Total 116 unchanged; schema-keyword checks, normalized deduplication and seven negative tests passed. Next: remaining official retail launch/build gaps, not team custom-bike duplicates. New-run latest usage 2%, baseline 0%, conservative stop 4%.

- 2026-10-02: Later-date US Bikes archive lookup resolves to actual capture 20230328154801, not a 2024 catalog. Its Made in Italy link opens first-party microsite https://web.archive.org/web/20230404224940/https://3tmadeinitaly.bike/, which confirms the five already saved Racemax ITALIA drivetrain builds and describes XXX/RTP/Italian color variants as finishes. No duplicate finish/component records added. Total 116 unchanged; schema-keyword checks, normalized deduplication and seven negative tests passed. Next: inspect remaining official historical launch/source gaps rather than repeat these resolved families. New-run usage latest 2%, baseline 0%, conservative stop 4%.

- 2026-10-02: Resolved remaining three RACE/MAX/Racemax names at required-field scope by official build descriptions: retained RACE Rival and later Rival 2X12/700C both name RaceMax platform/Rival AXS; MAX Ekar matches Ekar 1X13/650B; MAX Eagle matches Eagle AXS 1X/650B. Preserved later labels as aliases, not equipment-based duplicate records. No identical-ID/full-spec/model-year claim for these three. Combined with two shared-ID aliases and the separately saved non-Torno Force trim, all six entries in this archive group are reconciled. Total 116 unchanged; schema-keyword checks, normalized deduplication and seven negative tests passed. Next: later archive-family gaps and unresolved historic Apex/Plus US identity evidence before Allied. New-run usage latest 2%, baseline 0%, conservative stop 4%.

- 2026-10-02: Compared visible heading/public product IDs across official US RaceMax capture 20220817060639, RACE 20220124064330 and MAX 20211129122041. Confirmed Ekar 700C alias via shared 749 and Force 2X 700C via 722. Added separately named Racemax FORCE AXS 1X 700C (949), unlike earlier TORNO trim. Rival 2X, Ekar 650B and Eagle 650B remain under review; older out-of-stock controls expose no matching public IDs. Total 116 (54 current, 62 outside current inventory); schema-keyword checks, normalized deduplication and seven negative tests passed. Years null. Next: remaining three RACE/MAX aliases using official build descriptions, then later family gaps before Allied. New-run latest usage 2%, baseline 0%, conservative stop 4%.

- 2026-10-02: Reviewed eleven complete-bike configurations and one excluded frameset in official US RaceMax capture https://web.archive.org/web/20220817060639/https://us.3t.bike/en/223-exploro-racemax. Added five missing Racemax ITALIA trims: RED AXS 1X12, FORCE AXS 2X12, RIVAL AXS 2X12, EKAR 1X13, RIVAL XPLR 1X12. Six non-Italia builds queued against historical Exploro RACE/MAX identities to avoid probable renamed duplicates. Explicit USD bike offers; years null. Total 115 (54 current, 61 outside current inventory); schema-keyword checks, normalized deduplication and seven negative tests passed. Next: resolve those six RACE/MAX/Racemax aliases before further archive-family coverage. New-run usage latest 1%, baseline 0%, conservative stop 4%.

## Older local checkpoint retained

- 2026-10-02: Reviewed three linked official US archive catalogs: Ultra capture 20230325061118 (two complete bikes, one frameset excluded); Boost dropbar 20230328151806 (two complete bikes); Boost flatbar 20230328155103 (two complete bikes). Added six missing identities: Ultra EAGLE, EKAR 650B; Racemax Boost FORCE AXS 1X12 700C, RACE GRX DROPBAR, MAX GRX FLATBAR, X BALLY FLATBAR. Explicit USD complete-bike offers support US presence; no prices/specifications collected and years null. Total 110 (54 current, 56 outside current inventory); schema-keyword checks, normalized deduplication and seven negative tests passed. Next: later archived RaceMax range and remaining historical gaps before Allied. New-run latest usage 1%, baseline 0%, conservative stop 4%.

- 2026-10-02: Followed later archived official Strada navigation through captured 301 to https://web.archive.org/web/20230325061119/https://us.3t.bike/en/219-new-strada. Reviewed all three USD complete-bike offerings; added Strada RIVAL XPLR 1X12, RIVAL AXS 2X12 and FORCE AXS 2X12. Retained New Strada source wording in identity review, not inferred model year or duplicate model; older Strada Due identities remain distinct. Total 104 (54 current, 50 outside current inventory); schema-keyword checks, normalized deduplication and seven negative tests passed. Next: later archived gravel/e-bike families and unresolved historical Apex/Plus gaps before Allied. New-run latest usage 1%, baseline 0%, conservative stop 4%.


Older checkpoints retained in reports/status-before-discovery-2026-10-02.md.

## Historical evidence — superseded continuation instructions

The following prior status is retained verbatim as quoted evidence. Its old next actions, authority lists, checkpoint paths, launch prompts and test claims must not be treated as current instructions. Use the current sections above; do not recreate retired trackers.

> # Bike Portal status
>
> Updated: 2026-09-29
>
> ## Verified current state
>
> This local repository preserves the Bike Portal Stage 4.1 Texas integration source at `C:\Development\bike-portal-texas-integration`. Its initial local baseline is commit `7b8bacf` (`Establish Bike Portal SEO baseline`) on branch `main`. It has no configured remote and has not been deployed, published, or connected to a public domain by this repository setup.
>
> Git verification after the baseline commit: `git fsck --full` found no corruption; `git status --short` was clean. The initial commit records 68 tracked files. Git reported only unreachable temporary objects left by pre-commit staging edits; they are outside the committed history and require no corrective action.
>
> The existing integration adds source-attributed Texas pages for events, cities, and trails while retaining the Stage 4 backend, bindings, migrations, and default noindex behavior. The prior checkpoint records local `npm.cmd run check` and `npm.cmd test` success (38/38); those results are historical evidence and were not rerun during Git initialization.
>
> ## SEO delivery state
>
> - Stable public routes, canonical metadata, internal links, breadcrumbs, structured data, source links, and a gated sitemap are implemented in the tracked source.
> - Indexing remains intentionally disabled until an owner-approved canonical HTTPS non-`workers.dev` domain and truthful public policies are available. The owner supplied the future public operator identity `m36` and monitored contact channel `m36@inzernet.com` on 2026-09-29; do not present them on public pages until the matching public-policy and launch work is authorized.
> - No local source check proves live Cloudflare behavior, public indexability, search-console ownership, crawling, traffic, or ranking.
>
> ## Current priority
>
> Preserve the baseline and prepare only owner-authorized public-launch work. Resolve the factual and operational launch gaps in `reports/factual-exceptions.md` before enabling indexing or deployment.
>
> ## Single next outcome
>
> Choose and register a verified canonical public domain, then obtain final deletion/retention decisions; implement only the agreed policy behavior and validate the actual deployed robots, sitemap, canonical URLs, and indexing directives.
>
>
> ## Migrated checkpoint evidence
>
> # Bike Portal checkpoint — September 18, 2026
>
> ## Current: canonical bicycle hierarchy pilot prepared locally — September 29, 2026
>
> ### Candidate Index v1 and five manufacturer records — September 30, 2026
>
> - The authoritative discovery document `docs/US-BICYCLE-MANUFACTURER-MASTER-CANDIDATES.md` is now frozen as Candidate Index v1. Its normalized count moved from 530 to 545 after a source-scoped gap audit; the 15 additions are 6KU, 9:ZERO:7, Bike Friday, Biria, Borealis, Brooklyn Bicycle Co., CEEPO, Citizen Bike, Corratec, Detroit Bikes, Dynamic Bicycles, Shinola, Tokyobike, Valdora, and Ventum. The audit also removed three pre-existing aliases (`Gocycle`, `Scott USA`, and `Diamond Back`) from canonical queues while retaining them in alias review; `Gocycle` was already a case-insensitive duplicate of `GoCycle`, so its removal does not alter the normalized total.
> - The pass used Bike Index only as a non-imported discovery/component-only lead, the dated Bicycle Retailer 2019 directory, PeopleForBikes membership context, and retailer lists only as leads. Each addition has complete-bicycle and plausible or documented U.S.-market evidence recorded in the candidate index. No directory CSV, retailer data, marketing copy, source image, or wholesale listing was copied.
> - `docs/VERIFIED-MANUFACTURER-RECORDS-V1.md` establishes manufacturer-level records for Trek, Specialized, Giant, Cannondale, and Schwinn from official U.S. pages. Trek has existing exact-model pilot evidence; no model catalog was harvested for the other four. Ownership and active dates remain unknown, and non-U.S. archives are explicitly not treated as proof of U.S. model availability.
> - No D1 data, legacy record, route, binding, migration, source feed, indexing setting, deployment, or external system changed. Validation is recorded separately after the local check/test pass.
>
> ### Reset note — September 30, 2026
>
> The previous local canonical pilot is not approved as the foundation for a full catalogue redesign. `docs/BIKE-CATALOG-SOURCE-AUDIT-2026-09-30.md` records the ten-source authority, access, and licensing review. No existing data, route, D1 record, source feed, or deployment was changed during this reset/research step. The replacement must begin with manufacturer-origin evidence and an authorized feed, if one is selected.
>
> - The existing 25 family-level `bike_models` rows, their `/bikes/{slug}` URLs, and D1/Garage relationships remain untouched. A separate canonical catalog pipeline now has two verified Trek pilot records: a conventional MY23 Fuel EX 9.8 XT Gen 6 and an electric MY23 Fuel EXe 9.8. It retains source URL/type, retrieval date, deterministic content fingerprint, review status, explicit null specifications, and e-bike fields.
> - The new hierarchy is available locally at `/bikes/trek`, `/bikes/trek/mountain`, `/bikes/trek/fuel-ex`, `/bikes/trek/fuel-ex/2023`, and exact model routes. It remains `noindex, nofollow`, has no sitemap entry, and does not replace existing URLs or enable public indexing.
> - A deliberately inconsistent Gen 5-source/Gen 6-label candidate is preserved as a review-only conflict and cannot overwrite a canonical record. Bike Index taxonomy and BikeBook were researched only; licensing obligations were not accepted or implemented, so no external dataset was imported. Bicycle Blue Book remains excluded pending a commercial license.
> - Details, row evidence, parity mapping, and future-adapter contract: `docs/BICYCLE-CATALOG-EXPANSION.md`. No migration, remote write, deployment, seed import, or automated ingestion was performed.
> - Validation on September 29: `npm.cmd run check` passed; `npm.cmd test` passed 43/43 tests. This is local SQLite/source validation only, not proof of a deployed Worker, D1 migration, public indexing, or external ingestion.
> - Read-only parity continuation: `reports/legacy-bike-parity.json` now inventories all 25 current legacy records with manufacturer, model family, disciplines, source, legacy URL, brand link, specification/image relationship, SEO behavior, explicit destination, and migration status. The matrix test checks every row against the local seed. Validation after this addition: `npm.cmd run check` passed; `npm.cmd test` passed 44/44 tests.
>
> ## Single next action
>
> For a legacy family, add an exact year/trim canonical record only after authoritative evidence and a reviewed per-row destination amendment; preserve every other legacy family URL in place. Before full catalog work, select one of the verified manufacturers and identify one exact U.S.-market year/trim source.
>
> GPT-ready command prompt: In `C:\Development\bike-portal-texas-catalog-integration`, extend the bicycle catalog only for one additional manufacturer or one legacy family after reading `AGENTS.md`, `docs/checkpoint.md`, `docs/BICYCLE-CATALOG-EXPANSION.md`, `reports/legacy-bike-parity.json`, `DECISIONS.md`, `src/bike-catalog.js`, `data/bike-catalog-pilot.json`, `src/public-pages.js`, the legacy `bike_models` schema, and all catalog tests. Use only authoritative permitted sources. Add a limited raw-source → normalized → canonical → public pilot with row-level evidence, source-license disposition, explicit nulls, and a reviewed amendment to the parity matrix. Preserve legacy URLs unless an exact approved destination exists. Do not migrate D1, replace legacy data, bulk-import third-party data, enable indexing, deploy, or schedule ingestion. Run `npm.cmd run check` and `npm.cmd test`, update the checkpoint/decision log/expansion document with exact results, and stop before a destructive migration or external deployment.
>
> ## Current: Texas Cycling Hub public-catalog integration prepared locally — September 28, 2026
>
> - Created a separate writable release copy at `C:\Development\bike-portal-texas-integration`; the original Bike Portal checkout under the archived conversation path remains unchanged.
> - Imported the Texas Cycling Hub's public, source-attributed catalog only: 11 curated events, 13 city guides, 7 legacy trail summaries, 15 detailed routes, and 15 route highlights. The generated `src/texas-cycling-data.js` retains source URLs, source labels, review dates, route cues, official-map references, and route-data scope. No private accounts, submissions, D1 records, credentials, media, or unreviewed canonical occurrences were copied.
> - Added stable public paths: `/texas`, `/texas/events`, `/texas/events/:slug`, `/texas/cities`, `/texas/cities/:slug`, `/trails`, and `/trails/:slug`. These provide internal links, canonical metadata, BreadcrumbList and collection/item structured data, official source links, event-date context, and explicit map/route limitations. Existing Bike Portal events, guides, models, accounts, D1/R2 bindings, migrations, and noindex behavior remain unchanged.
> - The existing indexing guard still requires an explicit `PUBLIC_INDEXING=enabled` and a verified HTTPS non-`workers.dev` `PUBLIC_ORIGIN`. When that launch decision is legitimately configured, the sitemap includes the eligible public Texas routes, city guides, and upcoming Texas Cycling Hub event pages. This integration does not enable indexing, register a domain, deploy, alter remote data, or make a production claim.
> - Validation passed: `npm.cmd run check` and `npm.cmd test` completed with 38/38 tests passing. The new Texas-catalog tests verify preserved record counts, source protocols, Longview GIS-scope disclosure, the corrected Pedal in the Pines date, default noindex behavior, and gated sitemap inclusion.
>
> ## Single next action
>
> Obtain the owner-approved canonical public domain, public operator identity, monitored contact channel, and finalized deletion/retention decisions; then configure those values, make the crawlable public pages indexable, validate the deployed robots/sitemap/canonicals, and submit the sitemap only after the deployment is live.
>
> GPT-ready command prompt: In `C:\Development\bike-portal-texas-integration`, prepare the validated Texas catalog and Bike Portal public pages for an intentional production SEO launch. First inspect `AGENTS.md`, `docs/checkpoint.md`, `docs/LAUNCH-DECISIONS.md`, `src/seo.js`, `src/public-pages.js`, and `src/texas-cycling-data.js`. Use only owner-supplied, verified values for the canonical HTTPS domain, public operator identity, monitored contact channel, and deletion/retention choices; do not invent them or use a `workers.dev` URL as the canonical origin. Configure `PUBLIC_ORIGIN` and `PUBLIC_INDEXING` only after the domain is actually attached and the public policy pages truthfully match implemented behavior. Validate `npm.cmd run check`, `npm.cmd test`, a fresh Wrangler dry-run/bundle check, and live GET/HEAD responses for `/texas`, representative city/route/event pages, `robots.txt`, and `sitemap.xml`; confirm canonical URLs, `index, follow` only on eligible pages, noindex on APIs/accounts/diagnostics, and sitemap coverage. Stop without deployment if the domain, owner facts, policy implementation, email blocker, or live validation is unresolved. Update this checkpoint and the GPT-ready prompt with exact results; do not run migrations or alter existing user data.
>
> ## Current: Texas publication set deployed — 4.3.2
>
> September 18, 2026, version `be407246-d41f-47b2-b257-1e3b2f0a2be8`. `/texas-rides` selects Texas Gravel Champs (October 3) and Camp Spinistry (October 17–18), alongside flat repair, pre-ride safety and event-week guides. Five event overlays refreshed. Pure Country Pedal, Goliad and Bonham remain outside the selected set for documented missing/conflicting details. Selection expires after source-review deadlines; no source-monitoring automation was created.
>
> Brompton current gear options resolved by exact-build scope; folded dimensions remain unknown because current pages differ. Giant Defy maximum clearance remains unknown: the current exact model page still contradicts itself (38/40 mm). See docs/PUBLICATION-SET-RELEASE.md for source evidence and implementation scope. Guide review is reference-based, without hands-on mechanic sign-off.
>
> 36 tests passed; focused five tests passed again after final markup correction. Syntax, fresh WASM Wrangler dry-run and bundle/client checks passed. Local guide/hub navigation and 390px layout passed. 29 live read-only HTTP checks passed; browser observed hub/event navigation. Evidence: test-evidence/publication-live-2026-09-18.json. No migration/seed import or live account/content/media changes. Existing bindings and test noindex preserved.
>
> docs/LAUNCH-DECISIONS.md recommends bikefieldnotes.com and concrete retention/deletion choices. Awaiting real operator identity, jurisdiction, public contact, domain/name decision and public-post deletion choice; never invent them or publish unimplemented retention commitments. Email verification and password recovery remain blocked because no email provider exists. Other gates remain in STAGE4_REMAINING_CHECKS.md. Next: obtain owner decisions, implement/test agreed lifecycle handling, finalize policies, configure owned domain and resolve outstanding primary-source questions. Earlier release statuses below are historical.
>
> ## Current: both requested phases deployed — 4.3.1
>
> User clarified to continue directly from SEO implementation into model enrichment. Completed both; stop here. Current version `4f414fec-3600-44c7-bb85-dc8bdad94f79`, September 18, 2026. All 25 recovered model families now have standalone detail pages and a searchable hub, with 71 scoped manufacturer facts, source links, dates, conflicts and explicit unknowns. New data is an additive checked-in overlay; no remote migrations, seed imports or user-record mutations. Test noindex and all existing bindings remain.
>
> 31/31 automated tests, syntax, Wrangler WASM dry-run and bundle equivalence passed. Local desktop/mobile navigation/filter/search checks and live model/guide/Garage browser checks passed. 41 live read-only HTTP checks passed including every model page and deployed-client equality. Detailed scope, source limitations, changed files and remaining launch gates: [SEO-MODEL-RELEASE.md](SEO-MODEL-RELEASE.md). Evidence: `test-evidence/seo-models-live-2026-09-18.json`.
>
> Next logical step is editorial/public-launch preparation: broader guide/event review, unresolved manufacturer conflicts, permanent domain, operator/contact/final policies and the explicit email-provider blocker. No indexing or full Stage 4 acceptance is implied. Earlier statuses below are retained as history and superseded where applicable.
>
> ## September 18: SEO phase deployed; model enrichment in progress
>
> SEO release 4.3.0 deployed as c8a98a7f-7d7e-4af9-9c83-2d204332843d (124.08 KiB, gzip 35.89 KiB, startup 1 ms). 27 tests, syntax, Wrangler WASM dry-run and compiled client checks passed. Live homepage, standalone guide, enriched featured event, editorial page, robots and sitemap checks passed. Test noindex remains. Added public guide/event/brand hubs and details, per-page metadata/canonicals/breadcrumbs, gated Event markup, publication allowlist, editorial cleanup and source notes, truthful about/editorial/community/data-use pages. Known test posts omitted from homepage only; records retained. Three featured September 19 events received field-specific source-checked overlays. Original schemas/seeds/account data preserved; no migrations. Public domain, operator/contact, final terms/privacy and email delivery remain launch gates. Empty staged sitemap deliberately publishes no indexable URLs.
>
> User clarified to CONTINUE into model-data enrichment after SEO deployment. Next work: verify the 25 existing model families against manufacturer sources, add scoped factual details and source dates, preserve unknowns and source conflicts; test and deploy the result.
>
> ## Stage 4.2.1 deployed and focused live checks passed
>
> September 18, 2026: agent completed the user-authorized deployment to https://bike-portal-stage4.m25-f6b.workers.dev/. Cloudflare version `9ae154f2-ba5f-4af5-91bb-c746cf09229f`; upload 99.92 KiB / gzip 28.14 KiB, startup 1 ms. Existing DB, MEDIA, AUTH_LIMITER and WRITE_LIMITER bindings preserved. No migrations, seed imports, role changes or user-content mutations performed.
>
> Syntax/generated-client checks, all 20 automated tests, Wrangler dry-run and compiled bundle verification passed. Native esbuild remained blocked by Windows ancestor-directory access even after permissions; the same official esbuild 0.28.1 WebAssembly implementation completed the normal Wrangler bundling/deployment process. The session-local preload is `../../work/deploy-tools/wrangler-wasm.cjs`; installed Wrangler and project dependencies/configuration were not modified. A preliminary wrapper invocation did not launch Wrangler and bundle verification correctly rejected the old build; the corrected preload invocation rebuilt successfully before deployment.
>
> Agent live verification: top Bike Garage link opens the existing garage; Saved shows the existing saved/followed discussion by its title with numbered rows, types, dates and counts; title search filters correctly; the saved link opens its matching discussion. Live JS and CSS exactly match source. Homepage/health/assets return 200, noindex remains, and anonymous /api/me/library returns 401 with no-store. Existing signed-in session was used for read-only browser checks. The initial notification-count loading state settled to zero. Removal controls have prior local coverage; they were not exercised against the user's live saved records in this deployment check.
>
> This closes the 4.2.1 Garage/Saved deployment task. Broader Stage 4 acceptance gates remain in STAGE4_REMAINING_CHECKS.md; email delivery remains explicitly blocked pending a provider. The earlier deployment restrictions and pending-4.2.1 statements below are historical and superseded by this result.
>
> ## September 18: Garage navigation and named Saved index (4.2.1)
>
> User reported all four instructed live checks passed: disposable garage bike deletion, Save/Follow/Helpful persistence after reload, opening a saved discussion, and Unsave/Unfollow persistence. This confirms those journeys only; cross-account isolation, moderator/report acceptance, live limit enforcement and remaining avatar rejection cases are still open.
>
> The user then requested a Bike Garage link among the main links and reported Saved did not identify saved content. Release 4.2.1 adds that navigation link and an authenticated saved-library API resolving titles, types, dates, counts and destinations. Saved now provides numbered lists, search, Unsave/Unfollow, and safe unavailable-item handling. Long titles wrap on mobile. Asset URLs carry the release version to avoid stale styles/scripts immediately after deployment.
>
> Local automated suite: 20/20 passed. Local browser checks: Garage navigation, named lists, title search and empty search, discussion destination, Unsave/Unfollow persistence and 390px responsive layout. These local results do not establish live acceptance of 4.2.1.
>
> Latest confirmed live release remains 4.2.0, version `12b81299-0947-4fd4-aeef-3264a8a597ad`. Release 4.2.1 is prepared, not deployed. No schema/seed migrations or remote data changes. Email delivery remains a launch blocker by explicit user direction; no provider exists. Continue with docs/SAVED-LIBRARY-UPDATE.md.
>
> ## Prior continuation: Stage 4.2 deployed, live acceptance in progress
>
> User authorized following through with the remaining Stage 4 work. New interfaces and backend validation/rate limits are implemented; 17 tests pass and focused local browser journeys pass. User's pasted Wrangler output confirms Stage 4.2 deployment: version `12b81299-0947-4fd4-aeef-3264a8a597ad`, upload 95.03 KiB / gzip 26.93 KiB, startup 1 ms. Existing DB/MEDIA and AUTH_LIMITER (20 requests/60s), WRITE_LIMITER (60 requests/60s) are listed. This supersedes the earlier agent-side build restriction as a deployment blocker; runtime behavior of the new bindings still needs live acceptance. See STAGE4-2-ACCEPTANCE.md for exact scope and live gates.
>
> Agent refreshed the live homepage and observed signed-out navigation, then opened the login form. No credentials were entered by the agent. On September 18, user reported "all passed" to the five-step Stage 4.2 sequence: sign-in and new header, profile editor with username, display-name/bio save and refresh, supported avatar upload, and persistence of those fields/avatar after logout/re-login. These are user-confirmed live results. Avatar rejection cases and location/website edits were not part of that sequence and remain live-unconfirmed. Next: garage deletion and community save/follow/helpful persistence, followed by reports/moderator acceptance and live request-limit checks.
>
> User confirmed no transactional email provider exists and explicitly requested email delivery remain a launch blocker. No live roles, credentials, schema, seed data or existing service resources were changed. Current drafts cover community guidelines and implementation privacy facts; owner/contact/retention/terms decisions remain open. The detailed acceptance history below applies to Stage 4.1, not proof of the new features in production.
>
> Continue from this separate Stage 4.1 test-deployment copy. Original source under the mirrored ChatGPT project and the verified transfer archives remain unchanged. Start with `../TEST-DEPLOYMENT.md`.
>
> - Source syntax and generated client checks: passed.
> - Existing tests: 8/8 passed before changes. Current suite: 10/10 passed after changes.
> - Edge desktop/mobile browser checks against source preview: 10/10 passed, no uncaught errors. Screenshots reviewed for mobile layout; desktop screenshot retained.
> - Wrangler 4.131.2 dry run and bundle verification: user reported completion in their own PowerShell after this agent environment was blocked by filesystem permissions. Individual output was not supplied.
> - Deployment: CONFIRMED by pasted Wrangler success output. Worker `bike-portal-stage4`, version `f384cd62-6b0c-4701-b6ff-3724aef0570f`, upload 81.66 KiB / gzip 23.56 KiB, startup 1 ms; existing D1 and R2 bindings listed.
> - Live URL: https://bike-portal-stage4.m25-f6b.workers.dev/
> - User-confirmed live checks: homepage; search for gravel and guide/event views; `/api/health`; `/stage4-test` all passed. These are user-reported checks, not an independent browser inspection by the agent.
> - Agent read-only remote requests were blocked by network permissions earlier. That restriction does not negate the subsequent deployment evidence and user checks.
> - Migrations, database resets, seed imports: NOT PERFORMED.
>
> Subsequent live account acceptance: user replied "all passed" to the five-step signup, session refresh, garage addition, logout/re-login with garage persistence, and Interested event status refresh/reopen sequence. Record those journeys as passed. This does not certify avatar uploads, profile editing, invalid Turnstile tokens, protected-endpoint rejection after logout, bike deletion, other attendance statuses, discussions, notifications or moderation.
>
> Account-switch troubleshooting: user subsequently reported being stuck as Test Rider. Agent inspected the live in-app browser, observed Test Rider in the account navigation, clicked Log out, observed Log in/Join the ride, refreshed and observed the signed-out navigation again, then opened the empty login form for the user. Logout worked in this observed attempt; the earlier reported cause is not established. No account was created, no credentials were entered, and no code or deployment was changed. Second-account identity and cross-account notification acceptance remain pending.
>
> Next action: test a discussion by account A, a reply by account B, and account A's notification plus persistent read status. Then complete the remaining live checklist. No new product features were started. The test-deployment ZIP and earlier readiness reports are historical preparation artifacts; this checkpoint contains the subsequent deployment results. Do not redeploy just to run acceptance checks.
>
> Notification inspection: after the user reported not seeing a notification, the agent inspected the live discussion and saw a reply attributed to preview_rider under Test Rider's discussion. The account navigation showed Test Rider. Opening the footer Notifications link displayed `preview_rider replied to "portal test discussion"`, a matching View discussion link, and Mark as read. Receipt/display is now independently observed. Read-status persistence remains pending; the agent did not mark the notification read. The current UI has a footer inbox link but no header unread badge or proactive notification popup, which makes new notifications easy to miss.
>
> Notification follow-up: user replied "pass" to marking the notification read, refreshing and confirming it remained Read. Notification receipt/display and persistent read status are now passed for this two-account journey. The preceding pending status is superseded. Other remaining acceptance items and the notification visibility improvement remain open.
>
> Event-status follow-up: user replied "pass" to Going surviving close/refresh/reopen and Completed surviving logout/re-login/reopen on the same event. Together with the earlier Interested check, the instructed event-status journey is passed. Live checklist also reconciled the previously observed saved discussion and second-account reply. Next acceptance check: after logout, protected garage and notification endpoints deny access. Profile editing, avatar upload, reactions/follows/saves, reports and moderator checks remain open; no source code or deployment changed.
>
> Signed-out access follow-up: user reported "both blocked" for `/api/garage` and `/api/notifications` after logout. Both protected-endpoint denial checks are passed by user report; this supersedes the preceding pending action. Basic homepage/account/garage/event/discussion/notification journeys are now checked for this test deployment. This is not full Stage 4 or production sign-off: profile persistence, avatar upload and validation, garage deletion, reactions/follows/saves and ownership isolation, reports and moderation remain open, along with documented launch implementation gaps. Notification visibility remains a known usability issue. No new code or deployment was performed in this follow-up.
>
> Historical HOMEPAGE_VALIDATION.md and REDEPLOY.md refer to the earlier Stage 4.1 run; they do not establish acceptance of this new build. Current evidence is in test-evidence/. Keep the test noindex header until intentionally preparing production indexing.
>
> 4.2.1 build boundary: agent Wrangler dry-run was blocked by sandbox filesystem permissions (log-directory EPERM and esbuild ancestor access). Syntax, generated client, 20 automated tests and local browser checks pass. Run dry-run and bundle verification in the user PowerShell before deployment.
>
>
> ## Next outcome
>
> Migrated from the prior executable handoff:
>
> # Current stage or next gate
>
> Objective: prepare Bike Portal's Texas catalog for a deliberate public SEO launch without changing external systems until owner facts and authorization exist.
>
> Verified state: this repository has a local Git baseline at `7b8bacf` with the prepared Texas event, city, and trail pages. The owner supplied public identity `m36` and monitored contact `m36@inzernet.com`; indexing remains disabled because no canonical public domain is configured and final policies are unresolved.
>
> Scope and authorities: read `AGENTS.md`, `STATUS.md`, `DECISIONS.md`, `reports/factual-exceptions.md`, `reports/seo-assessment.md`, `docs/checkpoint.md`, `docs/LAUNCH-DECISIONS.md`, `src/seo.js`, `src/public-pages.js`, and `src/texas-cycling-data.js`. Use only owner-supplied facts and source-attributed content.
>
> Action: choose and record the owner-approved canonical HTTPS domain and final deletion/retention decisions. Implement only behavior and policy text that the verified domain, `m36`, `m36@inzernet.com`, and owner decisions support; then run the focused local checks and tests.
>
> Stop conditions: stop before domain registration, DNS, deployment, public indexing, sitemap submission, migrations, external account changes, or publication without separate authorization. Do not invent identity, policy, legal, retention, or source facts.
>
> Required record update: update `STATUS.md`, `DECISIONS.md`, `reports/factual-exceptions.md`, `reports/seo-assessment.md`, and this prompt with exact evidence and the next single highest-priority action.

## Event links and maps checkpoint — 2026-10-02

Local-only update: shared bicycle logo restored on public pages; event facts and sources linked; Leaflet 1.9.4 map dialog includes 25 upcoming catalog/legacy events with shared-location grouping and labeled approximate pins. Known-cancelled Ray Porter is excluded. Browser checked all ten pilot detail/location journeys and mobile overflow, zoom, loaded tiles. 48 automated tests and syntax/build checks passed; dry-run Worker bundle and both served browser scripts verified. Original preview on 8788 was preserved with its existing temporary data; updated isolated bundled preview runs on 8790. No deployment or indexing change. Next: user tests the corrected local journey.

## 2026-10-15 — Reliable local preview startup
The localhost:8790 link failed because the prior chat-launched process was absent; both localhost and 127.0.0.1 refused connections and the previous log contained no Worker exception. Added scripts/start-bike-preview.ps1 in the designated project source. Windows Task Scheduler task 'Bike Portal Local Preview' launches it at current-user sign-in, runs with limited interactive-user rights, has no time limit, permits battery operation, ignores duplicate launches, and is configured to restart on nonzero exit (one-minute interval). No passwords or cloud credentials are stored in the launcher. Verified task Running and HTTP 200 for health, event listing and map assets. Automatic recovery after a real failure and a reboot have not been exercised. Local test database remains disposable and resets at process restart. No deployment or indexing change.
Preservation: saved locally, not committed or remotely synchronized. Existing source/remote hold remains; git status also reports that this checkout must be run in a work tree, requiring separate repository diagnosis before any commit. Next: user verifies the page opens in their browser.

## 2026-10-15 — Cloudflare noindex release prepared
User explicitly authorized deployment to Cloudflare while keeping noindex. Checked existing Worker bike-portal-stage4 and existing DB/MEDIA/rate-limit bindings; no migrations planned. Source checks, 93 automated tests, dry-run build and both browser-script bundle verifications pass. Corrected tests/site-audit.test.js assertion that wrongly matched the substring '0 matching upcoming events' within '10 matching upcoming events'; now checks a positive integer in the status paragraph. Built Worker SHA-256 A81675CC27537C9D96D908F65E8FB25E725DF538C594EB10B117EB302CD1AAE3. workers.dev remains excluded by canIndex. Wrangler authentication expired and refresh failed; interactive login launched for m25@inzernet.com and waiting for the user. No deployment occurred. Source saved locally; commit/push remains held, and git still reports the selected checkout is not a work tree. Next: complete Cloudflare login, verify account and previous deployed version, deploy authorized source, then check live HTTP status and noindex headers.

## 2026-10-15 — Cloudflare release verified
User-authorized noindex deployment completed to https://bike-portal-stage4.m25-f6b.workers.dev under m25@inzernet.com, account f6b254ef4e3fc6c7a45e8a4f54b7fec9. Current deployed version f512882e-ab82-44af-9e39-1d6d8511ff7c; previous version b1bb12f9-5056-4c56-aaea-cee4cf90c86b remains in Cloudflare history. This supersedes the earlier same-day pending-login/deployment checkpoint. Source checks, 93 automated tests, dry-run build and generated browser-script equivalence passed. Live GET checks: homepage, health, North Texas listing, ten pilot detail pages, three map assets, robots and sitemap all HTTP 200 and X-Robots-Tag noindex, nofollow. Health ok=true, stage=4, schemaVersion=1; sitemap lists zero URLs. Listing contains bicycle home logo, map assets and organizer links. Existing DB/MEDIA/rate-limit bindings retained; no migration, seed, custom-domain, indexing, or account creation operation performed. Local temporary accounts were not copied to Cloudflare. Evidence: reports/cloudflare-release-2026-10-15.json. Remote artifact is the deployed Cloudflare Worker; source changes and evidence remain locally saved and uncommitted, with GitHub synchronization still unresolved. Next: user tests the hosted event discovery journey; existing three-tester, measurement and refresh-cycle gates remain separate and incomplete.
