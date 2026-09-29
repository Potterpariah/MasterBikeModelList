# Texas integration next-stage assessment — 2026-09-29

## Delivered compatible functions

Bike Hub now has source-attributed public Texas city, event, route, trail, highlight, and club discovery under additive routes. It also includes an event review crosswalk, reviewed map links for eight events, downloadable iCalendar files, map-verified GPX downloads, city-to-club links, structured public club pages, and sitemap support behind Bike Hub's existing public-indexing gate.

## Work that should happen next

1. **Review the event crosswalk, then attach evidence to canonical Bike Hub events.** Eight candidate matches require a field-by-field official-source comparison. Bike Around the Bay, Rattlesnake Gravel Grind, and East Texas Showdown remain explicit holds. Do not create Texas duplicate cards in `/events`.
2. **Resolve the Longview source discrepancy.** The revalidated v35 source has 12 city guides and 13 routes, while the supplied inventory says 13 and 15. Recover or re-review the missing Longview records only from their current authoritative sources; do not infer routes or locations.
3. **Revalidate time-sensitive public facts before opening indexing.** Event dates, club sites, safety/closure notes, and route access change. Preserve each record's review date and source URL, and hold failed or conflicting checks out of canonical calendar data.
4. **Perform a public-indexing launch review.** Before setting Bike Hub's indexing configuration, approve canonical public origin, robots policy, sitemap coverage, and the remaining event evidence. Current deployment is intentionally live but non-indexable.

## Optional compatible enhancements

- A Bike Hub-native map viewer for routes with reviewed geometry, with the same closure/safety disclaimers. Planning-only records must stay text-and-link only.
- Event-level source evidence panels on approved canonical Bike Hub event pages, without adopting Texas organizer accounts or data ownership.
- Club freshness tooling that checks outbound links and flags stale records for editorial review; it must not auto-publish changes.
- Date-specific calendar semantics review before broader calendar use: all-day iCalendar `DTEND` is exclusive and should be emitted as the following date.

## Explicitly out of scope

Do not transplant Texas Cycling Hub's Next/Vinext runtime, ChatGPT sign-in, D1/R2 schema, user saves, member records, messages, organizer claims, roles, submissions, moderation, challenges, uploads, or workflow state. Bike Hub retains its own authentication, storage, calendar, and save/ride-plan behavior.
