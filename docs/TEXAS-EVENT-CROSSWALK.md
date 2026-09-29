# Next stage: Texas event crosswalk

## Purpose and boundary

This is a review queue for a later, explicit calendar integration. It does not add any Texas event to `/events`, does not create or update D1 rows, and does not expose Texas events to saved/ride-plan behavior. Bike Portal remains the canonical event record whenever a match is approved.

## Candidate identities

| Texas event | Bike Portal candidate | Initial disposition |
| --- | --- | --- |
| Bike Around the Bay (2026-10-17) | `event_2026_10_17_bike_around_the_bay` | Same title/date; verify city/venue and reviewed fields. |
| Tour de Cure: Texas (2026-10-24) | `event_2026_10_24_tour_de_cure_texas` | Same title/date/city; verify field-level differences. |
| Park to Port Bike Ride (2026-10-24) | `event_2026_10_24_park_to_port_bike_ride` | Same title/date/city; compare current official-registration evidence before attachment. |
| rideATAXIA Dallas (2026-11-07) | `event_2026_11_07_rideataxia_dallas_2026` | Year suffix differs; verify identity and route distances. |
| Pedal in the Pines (2026-11-07) | `event_2026_11_07_pedal_in_the_pines` | Same title/date/city; verify reviewed fields. |
| 44th Annual Denton Turkey Roll (2026-11-21) | `event_2026_11_21_turkey_roll_bicycle_rally` | Naming variant; verify organizer and route information. |
| Texas Chainring Massacre (2027-01-23) | `event_2027_01_23_2027_texas_chainring_massacre` | Year-prefix naming variant; verify current source fields. |
| Valley of Tears Gravel (2027-03-05) | `event_2027_03_05_valley_of_tears_gravel` | Same title/date/city; verify multiday scope. |
| Rattlesnake Gravel Grind (2027-03-20) | `event_2027_03_18_rattlesnake_gravel_grind_and_xcmtb` | Hold: conflicting date and title variant. |
| East Texas Showdown (2027-03-26) | None identified | Hold: no canonical Bike Portal candidate. |
| Castell Grind (2027-04-10) | `event_2027_04_10_castell_grind_2027` | Year-suffix naming variant; verify fields. |

## Admission rule

For each candidate, compare date(s), city/venue, organizer, title/edition, status, distances, and source URLs. Attach Texas evidence only when it is newer and non-conflicting. A disagreement remains in this review queue; it must not overwrite Bike Portal data or create a second calendar card.

Only an approved canonical Bike Portal ID may enable existing save/ride-plan controls. No Texas user save, account record, role, organizer data, message, submission, moderation data, or challenge state may be migrated.

## Required next-stage checks

1. Add focused crosswalk tests for every candidate and conflict hold.
2. Re-run the portal suite, catalog suite, URL/sitemap checks, desktop/mobile snapshots, and anonymous/signed-in smoke flows.
3. Confirm no migrations or seed edits before staging comparison.
4. Compare the staged calendar to the current Bike Hub calendar before any release. Deployment remains a separate, user-authorized step.
