# Cycling Hub advantage assessment and Bike Portal plan — 2026-09-29

## Deployment baseline

Bike Portal navigation release `eca137e` is deployed to `bike-portal-stage4` as Cloudflare version `4989e947-4712-4fd8-b8a1-336769e8416c`. Read-only checks confirmed the persistent menu on `/`, `/texas`, and `/texas/clubs`.

The Worker remains live but non-indexable. `X-Robots-Tag` is `noindex, nofollow`, and sitemap publication is still gated behind Bike Portal's existing explicit public-origin configuration.

## Advantages worth recreating

| Priority | Cycling Hub advantage | Bike Portal state | Safe Bike Portal re-creation |
| --- | --- | --- | --- |
| P0 | Source freshness and exception workflow | Review dates and source URLs are stored, but no editorial stale-record queue exists. | Add a local editorial report that flags expired event, club, route, and closure reviews; it must never auto-publish or overwrite canonical event data. |
| P1 | Searchable, filterable route explorer | Route pages are browseable but `/trails` has no text search, category filters, or map-verified filter. | Add client-side filters for route type, city/region, surface, and map-verified availability, with an accessible empty state and permanent links left unchanged. |
| P1 | Statewide trail coverage map | Bike Portal has source links and bounded GPX only; no statewide visual discovery. | Add a progressive-enhancement map that shows reviewed route geometry separately from official coverage markers. No coordinate may be inferred; planning-only geometry must remain visibly distinct. |
| P1 | Interactive route-detail map | Detail pages expose planning context and official links, but not an embedded map. | Add an optional interactive map only on route records with reviewed geometry; include source, status, closure note, reset view, and a no-map fallback. |
| P2 | Embedded event start-location map | Bike Portal safely offers reviewed Google Maps search links for eight events. | Consider an accessible, lazy-loaded map preview using only the already-vetted start query. Records without an explicit vetted query retain the current unavailable state. |
| P2 | Broader local guide taxonomy | Bike Portal has general maintenance guides plus cities/routes, while Cycling Hub groups local safety, county, trail, event, and training guidance. | Inventory candidate Texas guidance one topic at a time; create permanent Bike Portal guide pages only after source, review date, scope, and editorial ownership are established. |
| P2 | Public indexing readiness | Bike Portal has technical sitemap/robots gates but has not approved a public origin or indexing launch. | Complete public-launch review: domain/origin, operator and correction contact, legal/privacy completion, source freshness, sitemap sample, structured-data check, and Search Console verification. |

## Capabilities that are not a direct integration target

Cycling Hub also contains rider messaging, ride logs, challenges, event/club submissions, organizer claims, route/photo submissions, role-specific moderation workflows, ChatGPT sign-in, and a separate D1/R2 model. These are not advantages to transplant into Bike Portal: they would create a new product surface with identity, abuse, retention, consent, and schema implications.

Bike Portal already owns profiles, Garage, saves, ride-plan status, discussions, notifications, and its own moderation controls. Any expansion of member functions should be a separately approved Bike Portal product plan, built natively against its existing account model rather than migrated from Cycling Hub.

## Re-creation sequence

### Phase 1 — Discovery controls

1. Add route explorer filters and a visible map-data status filter.
2. Add tests for combined filters, no-results behavior, keyboard operation, and stable detail URLs.
3. Run desktop/mobile layout snapshots and anonymous/signed-in smoke checks.

### Phase 2 — Maps with evidence boundaries

1. Reconcile the Longview discrepancy before expanding route coverage: the current imported snapshot has 13 route pages while prior reviewed source material includes three additional Longview trail records.
2. Define a small map data adapter containing only reviewed geometry or an official coverage-marker center, source URL, review date, and status.
3. Build route-detail maps first, then the statewide map. Use a no-JavaScript fallback of the existing route list and official source links.
4. Verify mobile gestures, keyboard controls, external map attribution, map load failure, closure-note visibility, and that no planning-only record offers downloadable navigation geometry.

### Phase 3 — Editorial freshness and content depth

1. Produce a review-only freshness report with categories: current, due, stale, conflict, and unavailable.
2. Resolve the 11-event crosswalk before attaching any Texas evidence to Bike Portal canonical calendar entries.
3. Add local guide pages only from individually reviewed sources, beginning with Texas heat-safety and event preparation where Bike Portal already has related content.

### Phase 4 — Public indexing decision

1. Obtain explicit approval for canonical public origin and indexing.
2. Complete operator/contact and data-use launch requirements, then verify robots, sitemap, canonicals, structured data, and a representative URL set in staging.
3. Enable indexing only after the above review; measure crawl/index coverage separately from traffic or engagement.

## Acceptance rule

No phase may introduce D1 migrations, seeds, authentication changes, Texas user data, organizer claims, submissions, messaging, or moderation workflows unless separately approved. Route coordinates and event map locations fail closed when authoritative evidence is incomplete or conflicting.
