# Bike Portal decisions

## 2026-10-15 — Enrich the local historical master from the user-provided BikeBook archive

Decision: retain the existing 11,120-row historical reference and add only source-provided manufacturer URL and catalog-photo URL references from `bikebook-main.zip` (SHA-256 `e6f1d0cfeb0c0dfe013056e03eb8decf73abb3d1567eadcd03617b56c9049bdf`). Seal the enriched `brand-model-master.json` as Historical Master List v1.3.0. Preserve null type, legal manufacturer entity, and separate trim fields because the supplied records do not establish them. Do not download, embed, or publish catalog images, and do not deploy the data.

Reason: the user requested extraction of all needed source data for historical use. The archive exactly matched 10,255 existing historical model-year rows and provides 10,188 manufacturer URLs plus 9,466 catalog-photo URL references, but it cannot support inferred bicycle classifications or identity claims.

## 2026-10-06 — Use a filtered historical master projection for the local `/bikes` browser

Decision: replace the root `/bikes` list with a generated, RockAuto-style brand-to-model browser backed by `data/historical-bike-page-index.json`. It projects 5,463 historical model names across 25 brands from Historical Master List v1.2 and intentionally withholds the 235 candidates still flagged as possible frames/modules. Keep legacy individual model URLs and the pilot hierarchy intact; do not migrate D1, embed source images, or deploy this broader worktree.

Reason: the user requested a complete-bike model browser based on the established master. The unresolved candidates cannot safely be represented as complete bicycles, and the catalog sources remain historical reference evidence rather than cleared public-data or image licenses.

## 2026-10-06 — Retain catalog photo URLs as evidence references, not image assets

Decision: add `photo_url` and `photo_sources` to the sealed Historical Master List v1.2 using only the pinned BikeBook `stock_photo_url` and `stock_photo_small` fields. Keep all observed source variants and exact pinned-file provenance. The newest catalog-year full image becomes the convenience `photo_url`; no image is downloaded, copied, embedded, or used for public display.

Reason: the user requested relevant photo URLs for each historical brand/model pair. Source URLs improve future ingestion-method design while preserving the distinction between source reference and image rights. Null remains correct where the source has no full photo URL.

## 2026-10-06 — Remove only source-backed explicit framesets from Historical Master List v1

Decision: advance the sealed historical master to v1.1.0 after recoverably excluding 255 additional incomplete entries. Each added exclusion has both an explicit `frameset` model label and a matching linked manufacturer-domain catalog URL containing an explicit frameset/frame identifier. The source URL and pinned BikeBook JSON provenance are retained for every removal. The raw source remains unchanged.

Reason: this confirms the least ambiguous frame-only subset without treating generic use of “frame,” catalog photo filenames, editions, stale links or an inaccessible current manufacturer page as proof. The remaining 235 frame/module leads stay in the master and audit for model-specific source review.

## 2026-10-06 — Designate Historical Master List v1 as the project working baseline

Decision: designate `reports/historical-trim-master/brand-model-master.json`, sealed by `historical-master-list-v1.json`, as the canonical project historical master for designing and testing future ingestion methods. The release accepts the established 5,953 brand/model pairs and their source-provenanced year associations without requiring U.S. availability. It retains recoverable confirmed exclusions, flagged frame/module candidates, punctuation collisions, source-status distinctions and blank model-source fields.

Reason: the user requested one stable historical base rather than a second queue. The source evidence supports a reproducible working list, not a universal or manufacturer-official census. This designation does not promote unverified catalog links to official evidence and does not authorize database ingestion, public display, deployment or source-license reuse without a later review.

## 2026-10-06 — Historical catalog reference is separate from verified ingestion records

User requested BikeBook master trim reference and research into other catalogs, explicitly not an ingestion plan. Assemble the pinned public model index as a partial historical reference, retaining original combined model/build names rather than inventing trim splits. Unknown type, manufacturer entity, trim and US market stay null; catalog-reported years are not official verification. Do not alter frozen candidates or the official manufacturer collections. Preserve BikeBook repository license; do not presume its data shares bike_data's ODbL license. Proprietary catalogs remain discovery/permission leads, not copied datasets. Completeness and ingestion readiness remain unproven.


## 2026-10-02 — Preserve separately offered SPEED catalog trims

Decision: retain Exploro TEAM SPEED FORCE1 and SPEED TEAM FORCE separately because official US catalog capture 20200618124749 lists both as named complete-bike configurations simultaneously. This supersedes the earlier provisional word-order alias normalization. Exact catalog names control; equipment differences alone do not create records. Older Speed TEAM FORCE wording maps to SPEED TEAM FORCE. Years remain null.

Evidence: https://web.archive.org/web/20200618124749/https://us.3t.bike/en/217-exploro-proteamltd. Collection now has 100 records; schema-keyword validation, normalized deduplication and seven negative tests passed. No application data integration or publication.

## 2026-09-30 — Freeze Candidate Index v1; separate discovery from manufacturer verification

Decision: freeze the U.S. manufacturer discovery index at 545 normalized canonical candidates after adding 15 evidence-backed omissions, and establish five separate manufacturer-level verified records for Trek, Specialized, Giant, Cannondale, and Schwinn. Three pre-existing aliases were removed from canonical queues and retained for review. Do not turn the index into a bulk import or treat it as an exhaustive census.

Reason: discovery directories and retailer lists are valuable for gap detection but cannot safely establish ownership, active years, complete model lines, or exact U.S. availability. Official U.S. identity evidence is sufficient for a manufacturer record, while exact year/trim catalog rows need their own official U.S.-market evidence. This preserves the existing additive, no-migration catalog boundary.

## 2026-09-29 — Add a local canonical bicycle-catalog pilot without replacing legacy models

Decision: retain the existing Stage 3 `brands`/`bike_models` directory and add a separate, JSON-backed canonical catalog pipeline for a two-record Trek pilot (one conventional, one electric). Keep a deliberately conflicting candidate in review only. Do not migrate D1, bulk-import external data, enable indexing, or deploy.

Reason: current model records are family-level overlays and cannot safely be reinterpreted as year/trim records. The pilot proves the normalization/provenance/navigation contract while preserving legacy URLs and existing Garage relationships.

## 2026-09-29 — Establish a local Git baseline without a remote

Decision: initialize this integration copy as a standalone local Git repository on `main`, with no remote, push, deployment, or hosting change. The initial baseline was committed locally as `7b8bacf` after the user selected the repository-local author identity.

Reason: version control protects the prepared Texas integration while keeping the archived original source and external Cloudflare state unchanged.

## 2026-09-29 — Keep SEO launch gated by verified owner facts

Decision: retain default noindex behavior and avoid public canonical claims until the owner supplies and verifies a canonical domain, public identity, monitored contact, and implementable policies.

Reason: static source and local tests cannot prove a public deployment or justify invented public-facing facts. See `reports/factual-exceptions.md` and `reports/seo-assessment.md`.

## 2026-09-29 — Record supplied public identity and contact for future launch work

Decision: use `m36` as the public operator identity and `m36@inzernet.com` as the monitored contact channel when the authorized public policy and launch work is performed.

Reason: the owner supplied both values directly. A canonical domain and final retention/deletion decisions remain unresolved, so no public indexing or deployment follows from this record.

## 2026-10-02 - Intended remote and documentation repair

Decision: retain https://github.com/Potterpariah/Bike-Portal.git as Bike Portal's intended remote. The user approved private repositories under Potterpariah for other real standalone projects; that broader policy does not authorize creating repositories in this repair. The two Bike Portal integration folders share one Git store and remain separate worktrees with preserved changes.

The user also approved local documentation-only repairs: STATUS.md owns current state and one next outcome; old checkpoints and prompts are historical; shared workflow links point to the existing canonical reference. This does not select a canonical Bike Portal history or authorize push, unrelated-history merge, reset, deployment, indexing, account/security changes, credentials or login. Provider deployment triggers must be checked before a future push.

## 2026-10-02 - Retain catalog and archive older main

Decision: the user said, "oh, keep the one with more commits and archive the other." Retain `C:\Development\bike-portal-texas-catalog-integration` on `texas-catalog-integration` at `6f70517beb1270dda087a85a2c7986e741c8d557` as the development source. Older `main` at `696cdcc8ece505ec0d28041958b581ef0d665669` is inactive and has a verified recoverable snapshot at `C:\Archived-Projects\2026-10-07-development-quarantine\_archive\2026-10-02-bike-portal-main-inactive-20261002T201004Z`. Both dirty worktrees are preserved.

Reason for physical layout: the older main directory owns the common .git required by the retained worktree, so it remains in place with no worktree move/removal, ref or index change. This supersedes the GitHub-rooted candidate proposal. The intended Potterpariah/Bike-Portal remote is unchanged, but no synchronization, unrelated-history merge, force-push, credentials, provider changes or deployment is authorized. The Saved badge difference is a risk to assess, not permission to override the user's source selection.

## 2026-10-02 - Minimal manufacturer collection contract

Decision: follow the established candidate index in physical list order, beginning with 3T, and do not advance while manufacturer coverage remains unresolved. Store only type, manufacturer, brand, model, trim and nullable model year as bicycle data, with evidence kept separately inside each record. Use the independent `data/manufacturer-collection/record.schema.json` contract rather than expanding the previously rejected specification-heavy pilot or wiring new records into runtime data.

Reason: the user explicitly narrowed the required fields and requested manufacturer-by-manufacturer completeness. Official product names can contain build-identifying component or wheel strings; retain those only as trim identifiers, not as separate specifications. Announcement dates are not model years. Alias/build uncertainty stays in a review queue without invented identities or years. Account usage readings are rounded and shared; a conservative stop at 48% from the 44% baseline reserves margin under the user's five-percentage-point run limit.

## 2026-10-15 — Exclude source-confirmed incomplete catalog identities from Historical Master v1.4.0

Decision: remove from the retained historical master only records whose BikeBook source label explicitly names `Frame`, `frameset`, `frame only`, or `Module`; retain each removal in `master-review-decisions.json` with archive provenance and linked catalog/manufacturer URL references. Do not delete source-clue-only candidates or infer standalone component status from a name. No matching explicit standalone fork, wheelset, crankset, handlebar, or seatpost labels remain.

Reason: explicit source labels distinguish incomplete catalog products from complete bicycles. The matcher was widened to word boundaries so seven parenthesized `(Frame)`/`(frame only)` labels were captured without fuzzy inference. Historical Master v1.4.0 retains 5,497 pairs, moves 460 identities to recoverable exclusions, and withholds 34 ambiguous source-clue records for later review.


## 2026-10-02 - North Texas event-discovery pilot

User selected Bike Portal on Cloudflare; domain undecided. Reuse the existing /texas/events catalog and templates, overlay four matching slugs and add six entries without D1 seed/schema changes. North Texas offers a mix of road, gravel, MTB, paved trail, bikepacking and randonneuring. Cancellation notices override future-date headers; keep source conflicts visible. Cloudflare Web Analytics lacks custom events, so prepare a disabled first-party Analytics Engine component and defer production activation/export acceptance to the approved release. Human journey testing and the 28-day audience observation are separate from local automated tests. Fix the existing calendar end-date error because it affected event utility. Preserve the manufacturer collection as separate work; no Git reconciliation or deployment is implied.

## 2026-10-02 — Event location interaction
Reuse the home-page logo and existing event datasets. Vendor pinned Leaflet 1.9.4 under its license; serve code and CSS locally, permit only tile.openstreetmap.org for map imagery, retain attribution and browser caching. Venue clicks use local fragment destinations so the in-app browser does not intercept them as external navigation. Map pins use cached reviewed geocodes, explicit approximate-area fallback, and shared-location grouping. Organizer links use normal same-tab anchors; all official-source detail links retain organizer-click measurement. Preserve existing preview data by testing on a separate port.

## 2026-10-02 - Bike Portal-only coordinated implementation

The user removed the two-implementation cap while requiring all active work to stay on one project unless otherwise authorized. Current project is Bike Portal. Independent work uses distinct file ownership and serial integration before final tests; cross-project work needs explanation and approval. Event UI and organizer-refresh work remain distinct; no production activation or unrelated repository setup is implied.
