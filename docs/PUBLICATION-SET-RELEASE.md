# Texas publication set — release 4.3.2

Deployed September 18, 2026 to https://bike-portal-stage4.m25-f6b.workers.dev/. Cloudflare version `be407246-d41f-47b2-b257-1e3b2f0a2be8`; upload 170.84 KiB / gzip 46.96 KiB; startup 1 ms. This is a reviewed content set on the existing **noindex test site**, not public-launch or full Stage 4 acceptance.

## Delivered content

`/texas-rides` connects two source-reviewed upcoming events with three practical guides. Ordinary links from the event and guide hubs make it discoverable. Eligibility expires automatically when an event passes or its recheck deadline is missed; this is request-time filtering, not an automated source-monitoring job.

| Event | Review result | Next source check |
|---|---|---|
| Texas Gravel Champs, Whitney, October 3 | Selected. Organizer registration page confirms venue/address, 35/55/80-mile options, differing category times, self-support and untimed e-bike participation. | October 2 |
| Camp Spinistry Bikepacking Kickoff, Gainesville, October 17–18 | Selected. Saturday date and staging address verified; Sunday date derived explicitly from the weekend schedule. Approximately 30/60 miles remain descriptive, excluded from exact-distance filters. Self-navigation, gear options and October 10 registration deadline disclosed. | October 8 |
| Pure Country Pedal, Breckenridge, October 3 | Updated five distances and route start times. Outside the selected set until exact start entrance/address and e-bike rules are confirmed. Organizer-linked registration checkout was not tested. | October 2 |
| Missions Tour de Goliad, October 17 | Current homepage confirms date, four routes and start time. Linked information PDF is an older edition; its detailed location/rules were not presented as current. Outside selected set. | October 10 |
| Autumn in Bonham, October 3 | Updated paved/gravel route options, superseding old 68/48-mile entries. Family route is described both as 2.7 miles and a 5K link label; excluded from numeric filters. Exact starting address still needs confirmation. Outside selected set. | October 2 |

Primary event references: [Texas Gravel Champs](https://runsignup.com/Race/TX/Whitney/TexasGravelChamps2026), [Camp Spinistry](https://runsignup.com/Race/TX/Gainesville/CampSpinistryBikepackingKickoffWeekend), [Pure Country Pedal](https://purecountrypedal.com/) and [FAQ](https://purecountrypedal.com/faqs/), [Missions Tour](https://www.missionstourdegoliad.com/), [Autumn in Bonham](https://autumninbonham.com/). Checked September 18, 2026. Registration inventory/payment, organizers' future changes, and day-of conditions are not certified.

Guides reviewed: inner-tube flat repair, pre-ride safety check and event-week preparation. Added scope, preparation before steps, component-specific instructions, brake/wheel precautions, pressure limits, stop conditions and primary technical references. This was a reference-based technical review, **not hands-on mechanic sign-off**. Park Tool, League of American Bicyclists, Trek's March 2026 owner manual and Electra references are linked in each applicable guide and retained in `src/publication-data.js`. Other recovered guides are outside this technical review.

## Model conflict disposition

- **Brompton C Line gearing:** resolved by restricting the claim to the current US buyer guide and named 4-/12-speed roller-rack builds. Older mixed family options are not asserted to describe every current model. Sources: [buyer guide](https://us.brompton.com/bikes/help-me-choose), [4-speed](https://us.brompton.com/p/1759/c-line-4-speed-with-roller-rack), [12-speed](https://us.brompton.com/p/1758/c-line-with-roller-rack-12-speed).
- **Brompton folded size:** newly exposed source conflict. Family and individual-build pages differ; a universal folded dimension was removed and remains unknown. Exact build/handlebar/seatpost configuration needs manufacturer confirmation. Contradictory component text on the 4-speed page was excluded.
- **Giant Defy Advanced 1, US 2025:** the [exact model page](https://www.giant-bicycles.com/us/defy-advanced-1-2025) still publishes both 38 and 40 mm clearance claims. The existing specification PDF does not establish which statement supersedes the other. Maximum clearance remains `null`, with both claims disclosed. No manufacturer answer was invented or message sent.

The model directory retains 25 families and 71 scoped selected facts. Model pages remain outside the production indexing allowlist pending broader editorial approval.

## Validation and preservation

- All 36 automated tests passed. Five new tests cover guide preparation order, immutable seeds, revised event API/HTML, explicit unknowns and expiry/publication filtering. The five focused tests were rerun after the final HTML markup correction and passed.
- Syntax/generated-client checks, fresh Wrangler WASM dry run and compiled Worker/client equivalence passed. Wrangler's native Windows bundler limitation is still handled by the existing session-local official esbuild WASM preload; dependency/configuration files were not modified for that workaround.
- Local browser: all three guide pages, ordinary guide navigation, two-event hub, and 390px guide/hub layout checked. Temporary viewport restored. Preview data was memory-only.
- Live: 29 read-only HTTP checks passed, covering all five event overlays, selected hub membership, three guides, two conflict pages, 25-model catalog, noindex/empty sitemap, 404 handling, anonymous protected endpoints and exact generated client. Evidence: `test-evidence/publication-live-2026-09-18.json`. Live browser independently followed hub → event → guide links successfully; notification count settled to zero after loading, with no console warnings/errors observed. Combined local/build/browser evidence: `test-evidence/publication-validation-2026-09-18.json`.
- Original seed data, migrations and `wrangler.toml` are unchanged; no remote migration, seed import, account/content/media mutation or role change. Existing D1, R2, rate limit and Turnstile bindings preserved. Prior release ZIPs remain intact.

Changed implementation/data files: `src/publication-data.js` (new), `src/editorial.js`, `src/public-pages.js`, `data/model-enrichment.json`, `src/seo.js`, `package.json`, `package-lock.json`, and `tests/publication.test.js` (new). Release/checkpoint, manifest, launch-decision and evidence documents are updated. The build regenerates the existing client artifact without changing its application behavior.

## Remaining launch work

[LAUNCH-DECISIONS.md](LAUNCH-DECISIONS.md) recommends `bikefieldnotes.com` and concrete retention/deletion policy choices. Its RDAP observation is not ownership or a purchase. Owner identity, jurisdiction, monitored contact, public name/domain choice and public-post deletion semantics remain unanswered. Policy numbers are proposals, not implemented guarantees. Do not publish effective policies or enable indexing until the owner decisions and implementation agree.

Email verification and password-recovery delivery remain blocked: no provider exists. Broader live gates remain in [STAGE4_REMAINING_CHECKS.md](STAGE4_REMAINING_CHECKS.md). Next: obtain owner details/decisions, implement and test agreed deletion/retention behavior, finalize truthful public policies, configure an owned domain, and obtain unresolved organizer/manufacturer clarifications.
