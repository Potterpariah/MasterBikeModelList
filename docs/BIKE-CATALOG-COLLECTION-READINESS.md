# Bicycle catalogue rebuild — collection readiness

Status: selected source paths only. No credentials were supplied or used; no manufacturer, model, variant, or specification data was collected.

## Selected sources

1. **HLC Catalog API** — primary current North American dealer feed candidate. Its documentation exposes brands, product catalog, variants, inventory, pricing, and product specifications through an API-key-protected dealer API. It is the selected source for its real-time US/Canada-oriented product catalog potential.
2. **DST Platform** — complementary current EU/Benelux dealer feed candidate. It describes supplier-uploaded, DST-standard-validated product data in CSV/JSON, including complete lifecycle coverage and an explicit brand list. It is selected to extend non-North-American manufacturer coverage.

This is not a claim that the combined feeds are globally complete. Completeness must be measured after authorized manufacturer-list exports are available. HLC requires an API key through its B2B portal; DST requires credentials or an approved data request. Their agreements must explicitly permit the intended storage, transformation, and public presentation before collection begins.

## Required authorization gate

Before running any collection:

- HLC dealer/API access and written confirmation of permitted storage, transformation, retention, product-text use, product-image use, and public display.
- DST credentials and written confirmation that Bike Portal's intended use is permitted by DST and the contributing suppliers.
- A defined target market and an operator-approved rule for whether prices, inventory, descriptions, images, and discontinued records are stored or displayed.

Do not provide API keys in chat, source control, documentation, test fixtures, or browser URLs. Store any approved credential only in the deployment platform's secret manager or an untracked local secret file.

## Collection sequence after authorization

1. Pull each provider's manufacturer/brand list and save a timestamped, access-controlled raw snapshot with provider and license reference.
2. Normalize manufacturer names using deterministic aliases; retain provider brand IDs rather than merging by name alone.
3. Produce a reviewable crosswalk: HLC brand ID ↔ DST brand ID ↔ normalized manufacturer. Ambiguous names remain unmatched.
4. For each approved manufacturer, collect model families, then year, trim, color/size variants, GTIN/MPN, and source URLs. Preserve provider record IDs and payload hashes.
5. Deduplicate only where manufacturer identity, model family, model year, trim/variant, and stable source identifiers agree. Otherwise create a conflict/review record.
6. Enrich/verify each public fact against the manufacturer product page, official catalog, manual, or archive. Provider facts are acquisition evidence, not final factual authority.
7. Publish no records automatically. First generate a local review report with manufacturer → type/category → family → model year → model/trim counts, unresolved matches, duplicate candidates, source freshness, and rights status.
8. Only after the review report passes can a manually invoked pilot adapter be implemented. D1 migration, public URLs, sitemap changes, indexing, deployment, and automation remain separate approvals.

## Canonical collection keys

`manufacturer_id + category + model_family + model_year + model_or_trim + provider_variant_id`

Required retained provenance: provider, provider record ID, original manufacturer ID, raw snapshot ID/hash, source URL, source type, retrieval time, market/currency, authorization reference, verification status, last verified date, and change history.

## Sources

- [HLC developer documentation](https://developer.hlc.bike/) documents API-key access, a Brands endpoint, catalog products, variants, specifications, real-time inventory, and pricing.
- [DST Platform](https://www.dstexport.eu/) documents credentialed access, supplier-uploaded standardized product data, JSON/CSV export, detailed e-bike/bike data, lifecycle coverage, and participating brands.
- [DST API guidance](https://www.stichtingdst.nl/kennisbank/) describes supplier authorization and retailer API retrieval.
