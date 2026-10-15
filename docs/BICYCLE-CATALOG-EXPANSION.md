# Bicycle catalog expansion — local pilot

Updated September 29, 2026. This is an additive local implementation. It does not migrate D1, replace the Stage 3 `bike_models` table, alter Garage records, publish, or enable indexing.

## Verified starting state and parity

The existing public directory is 25 seed-backed model-family records joined to 18 brands through `bike_models` and `brands`. Its durable public model URL is `/bikes/{family-slug}`; the existing `/bikes/{id}` redirect remains in place. The current data is an enrichment overlay (`data/model-enrichment.json`), not a canonical year/trim catalog.

The complete 25-row, read-only parity matrix is [reports/legacy-bike-parity.json](../reports/legacy-bike-parity.json). It is checked against the local Stage 3 seed by `tests/legacy-bike-parity.test.js`. Existing fields map as follows: brand → manufacturer, model name → model family, discipline array → category candidate, source URL → retained legacy provenance, and the existing slug route → its explicit unchanged destination. `bike_models` stores no image relationship, so every matrix row records `null` rather than inventing one. The source directory and matrix remain `noindex, nofollow` and absent from the sitemap.

## Canonical architecture

`source adapter/raw record → normalization → validation → canonical record → public presentation`

`data/bike-catalog-pilot.json` is the manually invoked source-adapter output. `src/bike-catalog.js` supplies deterministic slugs and canonical IDs, required-field/null validation, source-content fingerprints, change history, deduplication, and review-only conflict reporting. `src/public-pages.js` is the presentation boundary. This permits a later adapter to emit the same raw contract without changing the schema or route renderer.

The canonical record includes manufacturer, category, family, year, model, trim, subtype, frame/wheel/tire/drivetrain/brake/suspension/weight/MSRP fields, electric flag, source URL/type, retrieval date, content fingerprint, verification status, and change history. Unknown values are JSON `null`. Electric records additionally carry every requested e-bike field, nullable where the source did not establish it.

## Pilot and evidence rows

| Source | Normalized record | Canonical ID | Public output |
| --- | --- | --- | --- |
| Trek MY23 Fuel EX Gen 6 FAQ | Trek / Mountain / Fuel EX / 2023 / Fuel EX 9.8 XT Gen 6 | `bike:trek:fuel-ex:2023:fuel-ex-9-8-xt-gen-6` | `/bikes/trek/fuel-ex/2023/fuel-ex-9-8-xt-gen-6` |
| Trek Fuel EXe 9.8 product page | Trek / Mountain / Fuel EXe / 2023 / Fuel EXe 9.8 | `bike:trek:fuel-exe:2023:fuel-exe-9-8` | `/bikes/trek/fuel-exe/2023/fuel-exe-9-8` |

The third raw Fuel EX candidate deliberately names Gen 6 while citing a Gen 5 URL. It is preserved in the conflict report with `review` status and cannot overwrite the verified canonical row. This demonstrates fail-closed duplicate/conflict handling.

The pilot's navigation is `/bikes/trek/`, `/bikes/trek/mountain/`, `/bikes/trek/fuel-ex/`, `/bikes/trek/fuel-ex/2023/`, and its exact-model URL above. It is intentionally `noindex, nofollow`; hierarchy availability does not create indexable thin pages. Existing model URLs stay canonical for their legacy data until a documented per-row migration destination exists.

## Source and licensing disposition

Only official Trek sources supply pilot specifications. Bike Index's `bike_data` repository describes its data files as ODbL-1.0, which entails attribution/share-alike obligations that have not been designed into this product; it is discovery/taxonomy research only. Bike Index's BikeBook repository is AGPL-3.0; no code or data is imported. Bicycle Blue Book says commercial users should contact it for a license, so it is excluded. No source was scraped, bulk-imported, or scheduled.

## Acceptance status and migration risk

September 29 local validation passed: `npm.cmd run check` and `npm.cmd test` (44/44 tests). Coverage includes schema contract, canonical IDs/slugs, model-year separation, conventional and e-bike nullable fields, provenance/fingerprint persistence, conflict review, hierarchy routing, legacy URL compatibility, parity completeness, and noindex behavior. Sitemap remains empty under the existing indexing gate, so the pilot cannot enter it. A future migration must map a legacy family only after it has a reviewed exact year/trim record, add a reversible D1 migration only after review, and then separately authorize a deployment.
