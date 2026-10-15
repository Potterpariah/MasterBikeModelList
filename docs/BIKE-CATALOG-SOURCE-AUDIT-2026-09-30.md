# Bicycle model catalog reset — source authority audit

Status: research complete; no source has been imported, scraped, licensed, or deployed. The prior local pilot is rejected as the future catalog foundation. Existing Stage 3 model data and URLs remain intact while a replacement is designed.

## Decision

Build a new catalog from **manufacturer-origin product records and official archives/manuals**. Treat a licensed dealer feed as an optional accelerator, not the authority for facts. Use open sources only for taxonomy/discovery and never promote a discovery result to a public specification without manufacturer evidence.

There is no legitimate "copy ten sites into one database" shortcut. Reproducing catalogue data, product copy, or images from services that only grant personal/non-commercial access risks copyright, database-rights, contract, and trademark problems. Automated collection can also breach terms even where pages are public. Obtain a written license or supplier authorization before any bulk ingest.

## Ten authoritative or high-value catalogue candidates

| Rank | Source | Authority / coverage | Use recommendation | Rights and access disposition |
| --- | --- | --- | --- | --- |
| 1 | Official manufacturer current product pages | Primary source for the exact current build, market, MSRP, components, battery/motor, and media | Required fact source; capture a source URL and retrieval record per model/variant | Do not bulk scrape or reuse text/images without permission. Prefer manufacturer feed/API or written approval. |
| 2 | Official manufacturer archives, manuals, catalogs, and geometry/spec PDFs | Primary historical evidence, normally better than current family pages for discontinued years | Required for historical models; retain original document URL and applicable market/year | Rights remain with manufacturer; archive documents are evidence, not automatically reusable content. Cervélo's archive is an example of an official past-and-present catalogue. |
| 3 | HLC Catalog API | Dealer product, variants, inventory, images, and pricing API | Strong commercial feed candidate for supported US brands, after dealer/API agreement | Credentialed B2B access; do not use without authorization or publish fields beyond the agreement. |
| 4 | DST Platform | Supplier-fed, validated lifecycle product data for bikes, e-bikes, parts, apparel, and more | Strong EU/Benelux feed candidate; evaluate coverage by target market and supplier | Credentialed retailer/supplier access and supplier-controlled authorization; use only under its agreement. |
| 5 | BIDEX BikeData / Datacenter | Industry product-data standard with model/variant, geometry, motor, media, and product attributes | Excellent target interchange format and possible German/EU feed | Format and Datacenter are rights-controlled; platform-only use restrictions and image/text rights need separate authorization. |
| 6 | Veloconnect VC 1.5 Catalog | Neutral B2B catalog transport standard covering variants and media | Integration protocol, not a standalone complete catalogue; use when an authorized supplier supports it | Open schemas do not grant rights to a supplier's product payload. Requires supplier credentials/agreement. |
| 7 | Bike Index `bike_data` | Open manufacturer, activity, component, brake, wheel, and attribute taxonomy | Optional taxonomy/alias seed only; never source exact retail model specifications from it | Data files are ODbL 1.0. Attribution and share-alike obligations require product/legal review before ingestion. |
| 8 | BikeBook (Bike Index repository) | Historical flat-file models by manufacturer/year and model-detail lookup | Discovery and historical lead generation only; verify every public fact elsewhere | Repository is AGPL-3.0. Do not copy its data or run/modify it as a closed catalogue without a compatible legal strategy or permission. |
| 9 | Bicycle Blue Book | Broad used-bike/model and valuation reference | Exclude unless a negotiated commercial license explicitly permits the intended model-data use | Its terms limit site materials to personal, non-commercial use and prohibit commercial reuse/derivatives; it offers licensing contact. |
| 10 | 99 Spokes | Broad consumer model-comparison discovery reference | Exclude from ingestion; use only manually as a lead to locate primary manufacturer sources | Terms grant personal, noncommercial access and prohibit copying, commercial exploitation, and building a similar/competitive site. |

## Source evidence

- [HLC Catalog API](https://developer.hlc.bike/docs/apiref/catalog) documents brands, categories, products, variants, inventory, images, and pricing, with access requested through its B2B portal.
- [DST](https://www.dstexport.eu/) describes supplier-uploaded, validated product data available in CSV/JSON and lifecycle coverage; its [knowledge base](https://www.stichtingdst.nl/kennisbank/) describes authorization and API exchange.
- [BIDEX BikeData documentation](https://www.bidex.bike/BikeData-Documentation) describes model/variant and structured specifications. Its [terms](https://www.bidex.bike/AGB) say data is provided through a REST API to eligible retailers and note separate rights for product images and marketing text.
- [Veloconnect catalog documentation](https://www.veloconnect.de/en/documentation) identifies VC 1.5 as the extended catalog module. It is a transport standard, not a grant to redistribute received supplier data.
- [Bike Index bike_data](https://github.com/bikeindex/bike_data) identifies ODbL 1.0 for its data files. [BikeBook](https://github.com/bikeindex/bikebook) is an AGPL-licensed comparison application with flat-file historical data.
- [Bicycle Blue Book terms](https://www.bicyclebluebook.com/terms-of-use/) expressly limit ordinary use to personal/non-commercial purposes and direct commercial users to seek a license.
- [99 Spokes terms](https://99spokes.com/terms) grant only personal/noncommercial site access and prohibit copying, commercial exploitation, and building a similar/competitive site.
- [Cervélo's Bike Archive](https://www.cervelo.com/en-US/support/archive) demonstrates the preferred historical evidence pattern: an official archive cataloguing past and present models.

## Rebuild requirements before implementation

1. Select initial market, manufacturer cohort, and approved source path. Do not assume supplier coverage is global.
2. Obtain written authorization or an executed agreement for every bulk feed and any product-media reuse.
3. Define one source contract: source record → evidence/fact record → normalized manufacturer/family/year/trim/variant → public projection. Facts must preserve source, market, retrieval date, source hash, license/authorization reference, and review state.
4. Define a fact-level conflict policy: primary manufacturer evidence wins; disagreement never silently overwrites a prior fact; uncertain matches are review-only.
5. Map one legacy URL at a time only when a replacement has a verified exact destination. Otherwise preserve the current URL.
6. Use a manually invoked adapter and small manufacturer pilot before automation, a D1 migration, sitemap entry, or indexing.

## Recommendation

For Bike Portal, start with official Trek, Specialized, Giant, Cannondale, and Bosch/Shimano e-bike documentation for manufacturer-owned pilot records. In parallel, contact HLC and DST/BIDEX only if a dealer or supplier relationship can authorize a product-data feed. This gives current coverage plus an e-bike evidence path without inheriting a consumer-comparison site's licensing risk.
