# Visual audit of the deployed Bike Portal — 2026-10-05

**Verdict:** the site has a coherent, readable foundation, but it is not yet convincingly modern and sleek. The homepage has a stronger visual identity than the rest of the site. Most secondary pages resemble a reference document inside a repeated header, help panel and card grid. The next improvement should be hierarchy and density, not more features or decorative effects.

Audited https://bike-portal-stage4.m25-f6b.workers.dev/, deployed version `b1bb12f9-5056-4c56-aaea-cee4cf90c86b`. This is an audit and bounded proposal only. Application source, configuration, deployment, data and STATUS were not changed. Only this report and supporting audit evidence were written. Passing earlier functional tests was not treated as evidence of visual polish.

## Evidence and coverage

Fresh rendered captures used installed Chrome on the user's Windows execution computer, with isolated temporary browser profiles. Desktop was **1440 × 1000** and mobile **390 × 1000** CSS pixels. The report's measurements come from rendered DOM boxes and computed styles, not estimates from source. No horizontal overflow appeared in the captured states.

The evidence folder `site-audit-evidence/visual-live-2026-10-05/` contains **114 fresh screenshots**, including repeated dialog checks and palette measurements, plus metrics, contact sheets and capture scripts. Coverage comprises 32 page/query/hash cases plus the login dialog: homepage; event list/filter/empty/help; legacy event detail and cancellation; curated list/detail; real map and settled popup; bikes/empty, brands/brand/model; guides/guide article; Texas hub; cities/city detail; clubs/city-club/detail; trails and route details with/without GPX; reviewed rides; about/editorial/community/data-use; retired-route 404; public search; login and signup. Top/body/footer/menu states were captured where useful. Core screens were inspected individually; remaining repeated template variants were inspected in contact sheets.

This is template/state coverage, not inspection of every event, model or paragraph. The viewport height is taller than many phones; an ordinary shorter phone shows even less content before scrolling. Reference-site mobile layouts, signed-in account screens, production form validation/submission, Safari/Firefox, assistive-technology behavior, zoom and every hover state were not visually audited. Signup was only viewed; its Turnstile widget showed a transient “Verifying…” state, which is not evidence of failure. No credentials or account actions were submitted.

## Reference direction

The parent reference review inspected official desktop pages at about 1165 × 747; these are reference observations supplied to this audit, not claims that the portal has those products' features.

| Reference | Useful direction for existing Bike Portal functions | Avoid |
| --- | --- | --- |
| [JNews Sport](https://jnews.jegstudio.com/sport/) | One dominant lead, supporting content with clear priority, regular card anatomy and recognizable editorial sections. | Its oversized/stacked masthead and dense legacy navigation; adding feeds, modules or copied assets. |
| [Strava](https://www.strava.com/) | Compact single-row navigation, decisive primary action, sparse accent use and concise result hierarchy. | Copying orange branding or implying activity tracking, subscriptions or successful Strava map verification. |
| [Komoot discovery](https://www.komoot.com/discover/road-cycling-routes) | Calm neutral canvas, restrained green/olive actions, consistent landscape crops, regular metadata and compact discovery controls. | New routing/planning functions, copied imagery, or reproducing the whole application. `/plan` was WebGL-limited in the reference review. |

Use JNews for editorial priority, Strava for navigation discipline, and Komoot for calm outdoor presentation. Bike Portal can keep its own bicycle logo and green identity.

## Must fix: visible clarity and trust

| ID | Visible finding and impact | Bounded correction | Screenshot evidence |
| --- | --- | --- | --- |
| M1 | `/events` says **“Browse the refreshed North Texas event selection”**, although the refresh overlay was explicitly excluded from this release. It also adds another line before the filters; the arrow wraps alone on mobile. | Rename the existing link to describe the existing curated Texas list accurately. Keep the same destination and records. | `main/1440-events-top.png`, `main/390-events-top.png` |
| M2 | Curated Bike Around the Bay detail displays **Discipline: Charity** and **Ride type: Charity**, while the help explains that fundraising is a purpose. The duplicated facts visually contradict the new classification model. | Render discipline as unspecified when absent; show the supported fundraising purpose and original ride label distinctly. Do not invent terrain or mutate source data. | `main/1440-curated-detail-top.png`, `main/390-curated-detail-top.png` |
| M3 | The cancelled Ray Porter page gives the large title/date and generic help priority; its cancellation appears only in a subdued dashed box farther down. At 390px the notice begins around the lower part of the first 1000px screen, below substantial introductory material. The archived “verified” record below can further confuse a skim reader. | Move the existing cancellation message directly below the title, give it a clear status label and restrained warning treatment, and visually distinguish archived facts. Preserve the page, records and caveat wording. | `main/390-event-archived-top.png`, `main/1440-event-archived-top.png` |

## High-value visual polish, in priority order

| ID | Visible finding and impact | Bounded optimization | Evidence |
| --- | --- | --- | --- |
| P1 | **The calendar starts too late.** First legacy event card: y≈886 desktop, **y≈1471 mobile**. Curated first card: y≈879 / **1482**. The five stacked mobile filters, repeated explanation, two preliminary links and map instructions consume the opening experience. This is the largest gap from a focused discovery product. | Reduce page-intro spacing; keep one concise visible caveat and an accessible help disclosure. Place result count and existing map action beside the filter heading. Arrange short filters in a responsive two-column layout where they fit; keep event/city full width. Preserve all labels, query parameters and controls. Aim for a first result near or within the initial 900px mobile view, not by shrinking touch targets. | `main/390-events-top.png`, `main/390-events-body.png`, `main/1440-events-top.png` |
| P2 | **Header and menu consume too much space.** Header is 93px desktop and **127px mobile**, with account actions on a partly empty second row. The desktop menu is a very large scrolling panel; the mobile panel shows only part of the navigation and floats above visible page fragments. Main destinations remain hidden behind Explore even on wide screens. | Aim for a 64–76px header, maintaining a 32–40px logo mark and 44px controls. Surface a few existing primary destinations on desktop. Group existing utility/account links more compactly within Explore; make the open menu's boundaries and dismissal clear. Retain every destination and keyboard access. | `main/1440-home-menu.png`, `main/390-home-menu.png`, `main/390-home-top.png` |
| P3 | **Help is visually over-prominent and repetitive.** Pale-green panels precede almost every useful section; expanded calendar help fills more than a mobile screen. The 404 even displays model-family guidance. Important caveats blend into the same treatment as optional explanations. | Keep essential caveats visible, but distinguish a compact information line from detailed “How to use” content. Group the expanded explanation into short headings. Suppress irrelevant section guidance on 404s. Give real cancellation/status messages stronger priority. | `main/390-events-help-open.png`, `main/1440-not-found-top.png`, `main/1440-guide-detail-top.png` |
| P4 | **Interior headings use near-hero scale everywhere.** Desktop H1 is 57.6px/64.5px; long guide titles occupy two lines before several more blocks. Hierarchy then drops sharply to 16px body and 12px metadata. | Reserve the 72px homepage treatment for the hero. Try 40–48px interior H1, 32–36px mobile, 22–28px section headings and 16–18px card headings. These are proposed design values, not reference-site measurements. Retain a single intentional sans family; a font download is not required. | `main/1440-guide-detail-top.png`, `main/1440-model-detail-top.png`, `main/390-trail-detail-top.png` |
| P5 | **Cards lack a common information hierarchy.** Event tags compete with titles; guide cards are text-only boxes of similar weight; brand cards devote large areas to just a name and count. Metadata sits at inconsistent vertical positions. The Texas hub puts four cards in a 3+1 arrangement inside the narrow reading column, leaving a large unused right side. | Define card anatomy: one small category line, title, concise description, aligned metadata/action. Use compact brand rows/cards, a balanced 2×2 hub grid and consistent padding/baselines. Keep all existing records; do not introduce rating, weather, price or image placeholders. | `main/1440-guides-top.png`, `main/1440-brands-top.png`, `main/1440-bikes-top.png`, `main/1440-texas-top.png` |
| P6 | **Details look like long administrative forms.** On mobile, every fact label and value becomes a widely spaced two-line block. Date/city/venue/address plus repeated map links take most of a screen. Curated descriptions and many facts are fully underlined links, producing visual noise. | Group existing date/location/distance facts into a compact summary; use a consistent label/value rhythm and a deliberate mobile stack. Keep links clearly identifiable, but give source/map actions a named location rather than underlining a whole descriptive paragraph. Preserve every fact and destination. | `main/390-event-detail-top.png`, `main/390-curated-detail-top.png`, `main/1440-curated-detail-top.png`, `main/390-trail-detail-body.png` |
| P7 | **The map works but still looks like an added utility.** The dialog uses a browser-like square Close button beside rounded portal controls, a small popup title/date, repeated instructions, and “1 upcoming events.” The list-to-map action is visually detached from filter/result context. | Use the existing dialog/button design consistently, improve popup type hierarchy, fix singular/plural labels and tighten supporting text. Place the existing map action with results. Keep attribution, source/precision notes and 44px zoom controls. A split-screen planner or a new persistent map is not necessary. | `map-review/1440-events-filter-map-popup.png`, `map-review/390-events-filter-map-popup.png` |
| P8 | **Empty and short pages feel unfinished.** Bike no-results text occupies one narrow grid cell on a wide canvas. Calendar zero-results repeats counts and still offers an empty map. The 404 has unrelated help, ordinary page-sized whitespace and recovery links to events/guides rather than a visually clear general return. | Let the empty state span its container; use a concise heading and promote the existing Clear/Home/directory navigation. Keep honest empty states and 404 status; no misleading redirect. Position the footer consistently on short pages. | `main/1440-bikes-empty-top.png`, `main/390-events-empty-top.png`, `main/1440-not-found-top.png` |
| P9 | **Small text and technical formatting reduce finish.** General metadata is 12.16px and tags 11.52px; source dates are ISO strings; “1 model families” appears on brand cards. The desktop event/city select truncates “All current Texas events.” Arrows vary between → and ↗ for similar internal actions. | Use 13–14px metadata with clear spacing, human-readable display dates, correct plurals, sufficient field width and one icon convention. Preserve stored ISO dates and link semantics. Do not shrink controls to achieve density. | `main/1440-events-top.png`, `main/1440-brands-top.png`, `main/1440-trails-top.png` |
| P10 | **Footer and secondary sections have a different level of finish from the hero.** The homepage has a branded CTA band and stronger section rhythm; interior footers use a small plain text wordmark and scattered utility links. Sparse policies are readable but their column placement/footer can look accidental. | Reuse one footer structure, align its groups to the page grid, retain readable policy columns, and use a deliberate minimum-height layout on short pages. Keep policy limitations honest. | `main/1440-home-footer.png`, `main/1440-about-footer.png`, contact sheets for policies/club-city |

## What is already acceptable and should be retained

- **Identity and palette:** the bicycle logo is consistent and identifiable; the neutral canvas, white cards and restrained green actions already support a calm outdoor identity. There is no need to copy Strava orange or replace everything with Komoot olive.
- **Measured contrast:** rendered body `#172622` on `#f5f6f4` is approximately **14.49:1**; secondary `#52615a` on the same canvas **6.02:1**; white on button `#235d43` **7.73:1**; tag `#28543b` on `#edf3ee` **7.70:1**. These sampled pairs are healthy. Small text, hierarchy and spacing remain issues despite the ratios. This is not a complete WCAG audit.
- **Borders and shadows:** quiet card borders and restrained shadows are appropriate. Avoid adding heavy shadows, gradients or more containers. Consolidate the existing corner/control treatments instead.
- **Home image:** the existing cycling image loads, and desktop/mobile crops retain the main group and banner. It gives the homepage useful energy. Most other pages have no imagery, which partly explains the editorial-design gap, but fabricated placeholders or unreviewed stock images would not improve this release. Improve composition and card hierarchy first; any new imagery is separate asset work.
- **Reading and interactions:** 16px body text with roughly 26.4px line height is comfortable. The real map, source/precision caveats, accessible disclosure, clear form labels and login form have a useful foundation. A translucent popup seen in an immediate capture was animation, not a defect: settled desktop/mobile recaptures show the normal white popup.
- **Truthful restraint:** no fake scores, stock availability, community activity or model photographs appear. Keep that standard while improving presentation.

## Bounded optimization proposal

Work on no more than two implementation tasks at once, if subsequently authorized:

1. **Shared layout and typography:** compact header/menu, interior heading scale, help hierarchy, card/grid anatomy, facts and footer. Validate homepage, events, guide, hub, model, empty and 404 screens at 320/390/768/1440px. No new modules, data, assets, account behavior or navigation destinations.
2. **Calendar and status presentation:** fix M1–M3, put existing filters/results/map actions into a compact hierarchy, improve current popup/button styling, dates/plurals and empty states. Preserve source labels, event records, all existing filter meanings, map attribution/fallbacks and retired-route behavior.

Acceptance must include side-by-side screenshots of the same live/current baseline and candidate, not just test totals. Check that the first result appears materially earlier, important status is visible before optional help, long labels and titles remain intact, no horizontal overflow is introduced, tap targets remain usable, and the 25-model/11-curated-event data and current scope remain unchanged. A later deploy still needs authorization. No recommendation here authorizes a rewrite in WordPress, route planning, feature expansion or changes to production.

---

# Earlier audit record — historical context

The earlier report below describes a previous deployment and broad local worktree. Its “local, not deployed” statements and release-approval discussion are historical. The deployed identity for this visual audit is stated above; current operational state remains owned by STATUS.md.


# Bike Portal deployed-site audit and local corrections

## Outcome and boundary

The deployed site at https://bike-portal-stage4.m25-f6b.workers.dev/ was audited read-only. Corrections are **local, not deployed** in `C:\Development\bike-portal-texas-catalog-integration`, branch `texas-catalog-integration`, HEAD `6f70517beb1270dda087a85a2c7986e741c8d557`. Existing dirty work, historical worktrees, database records, provider bindings and default noindex were preserved. No WordPress/Spark Spin work, catalogue expansion, geocoding, scheduler activation, credentials, migration, domain or production mutation occurred.

The configured Worker name matches the deployed hostname; public route/content lineage matches. This is not a claim that the dirty local tree equals the deployed source. The live browser assets report release 4.3.6; package.json reports 4.3.2. Previous deployment approval remains unresolved and is not supplied by this audit request.

## Authority audit — approval needed before rewriting

Read `C:\Development\AGENTS.md`, `_system\WORKFLOW.md`, project `AGENTS.md` and current `STATUS.md` first. No C:\AGENTS.md or nested project instruction files were found; no project .agents skill was available to apply.

- STATUS's single next outcome still directs daily refresh work, superseded by the current audit request.
- STATUS records 69 tests; the prior continuation verified 77, and this candidate now passes 92.
- TEST-DEPLOYMENT/REDEPLOY historical release headings describe 4.3.2 while live assets identify 4.3.6. Historical quoted instructions are explicitly not current authority.
- Project boundaries remain coherent with local-only work: backend/bindings/data preservation and noindex. There is no need to loosen them.

No authority/status rewrite was made. Proposed reconciliation for approval: update current outcome to this site audit, record local-only candidate and current evidence, retain historical material as history, and reconcile release/package labels during a separately authorized release.

## Baseline findings

| Area | Independently observed deployed result |
| --- | --- |
| Routes | 187 reachable public HTML paths, all HTTP 200 and noindex. Roots: homepage 1; events 57; Texas 50; bikes 26; guides 17; brands 17; trails 14; reviewed rides 1; policy/about pages 4. |
| Linked variants | 164 linked query variants, one empty-result query and two versioned browser assets passed HTTP checks. No broken internal HTTP targets found. |
| Branding | Only homepage had the bicycle SVG logo; all 186 secondary pages had text-only branding. |
| Map | No deployed page loaded Leaflet. `/events` rendered an SVG coordinate plot with 10 starts and 46 unpinned events. It had no tiles, streets or geographic pan/zoom. |
| Map cause | `event-start-map.js` normalizes min/max coordinates into an SVG plane. `/events` called that renderer. The newer local Leaflet integration had only been connected to curated `/texas/events`; it was not deployed. |
| Categories | Live selector had 38 mixed labels. Preserved Stage 3 data has 72 records, 35 event-type labels and 10 discipline labels; the old selector merged both axes. |
| Visuals | Floating menu overlapped content; local baseline homepage search/art was clipped inside its container at 320px even though document-level overflow detection was false. Secondary branding differed. |

Queries/fragments, public assets and browser interactions are separate evidence scopes. Initial crawler requests without its explicit audit user-agent received 403; the consistently identified read-only crawler returned the results above. No external-link freshness or authenticated production journey is certified.

## Local corrections

- Preserved homepage bicycle logo and reused it in every public frame. Shared header menu replaces the floating side tab; responsive typography, spacing, cards, restrained green/neutral palette, visible focus, reduced motion and 44px controls are consistent.
- `/events` now uses pinned, already-vendored Leaflet 1.9.4 and existing reviewed coordinates. Same filters drive list and map. Unlocated results remain listed; located/total count is shown. Markers disclose venue vs approximate area and link to event details. Geographic dragging/zooming, Escape/focus restoration and map/list navigation work.
- Tile URL/attribution live in `config/event-map.json`; provider changes also require matching CSP review. OSM requests are viewport-only with no prefetch/offline behavior added. Public tiles are best-effort, not an SLA. Library/tile errors retain usable links/list. No addresses were newly geocoded.
- Added versioned presentation taxonomy, retaining raw source labels and unknown values. Current local upcoming records expose 3 disciplines (Road, Gravel, Mountain bike), 7 formats and 3 purposes, instead of one mixed selector. Mountain/MTB aliases deduplicate; fundraising is separate. Ambiguous Tour/Challenge/Gran fondo do not imply race status. Old category URLs and custom search values retain visible selections. No data migration occurred. A focused follow-up consolidated Ride, Noncompetitive ride and Social/community ride into General/social ride (mapping v2); the original generic, casual, untimed and community subtypes remain available. Former filter URLs retain their narrower semantics. Challenge, Gran fondo, Rally and Tour remain distinct because equivalence or competitive status is not established by those names.
- Known Ray Porter cancellation was already documented in the existing factual-exceptions record and excluded from the local map. It is now also withheld from upcoming `/events` and homepage cards, while its archived detail retains provenance and a prominent cancellation caveat. Recorded source status is labelled as such, not a live guarantee.
- Added concise contextual guidance with always-visible essential caveats and native keyboard-operable disclosure controls. Long paragraphs have bounded line lengths.

## Help coverage

| Section | Guidance |
| --- | --- |
| Home/account tools | Search vs calendar; public Garage/profile scope; Save/Follow/Helpful; in-site notifications; no implied email/event-change alerts. Public footers link to the home explanation. Existing modal-specific prompts remain. |
| Event lists/details | Discipline vs format vs purpose, common category meanings, submit/clear behavior, location coverage, venue vs course, review dates vs freshness, event date vs registration deadline. |
| Curated event calendar | All-day downloads are not confirmed start times and do not automatically update. |
| Map | Green venue vs amber approximate area; unlocated entries stay in list; organizer confirmation; attribution; failure message and fallback links. |
| Bikes/brands | Family vs exact year/build/market, unknown not absent, fact-specific review scope, no stock/price claim. |
| Trails/routes | Surface/distance and GPX scope; access/closure checks; route line is a planning reference, not guaranteed navigation. |
| Clubs/cities/Texas | Listing scope, current schedules/meeting rules, directory vs smaller reviewed selection. |
| Guides | AI-assisted/reference scope, exact equipment instructions, qualified assistance when needed. |
| About/editorial/community/data-use | Existing explanatory prose retained; redundant accordions intentionally omitted. |

The current UI has no route-routing engine, map-area Search Here, live tracking or subscription service. Those were not implied by the comparison sites or added.

## Verification

- `npm run check` and **92/92 tests passed**. The old date-sensitive SVG test now fixes its clock and verifies geographic-map behavior. New tests cover raw-label preservation, aliases, separate category filters, unknowns, filtered/empty maps, cancellation display and contextual help.
- Fresh Wrangler **dry run only** and compiled Worker/browser-script equality passed. Bundle log is included. Existing D1/R2/rate-limit bindings were preserved; no remote database tests were run.
- Local crawl: **378 targets** = 357 HTML responses (200 unique HTML paths, including query variants) plus 21 ICS/GPX downloads. All returned 200; every HTML response had one H1, SVG homepage logo, valid main target and noindex. Five referenced browser assets also passed. All 187 live paths were included. Seven pre-existing catalogue hierarchy paths required explicit source inventory because the main directory does not link into them.
- Browser: installed Chrome with isolated temporary profiles and disposable local SQLite. 50 initial live/local baseline captures; 48 additional live template captures; 120 local template/viewport cases; 35 targeted remaining-template/control checks. Widths 320, 375, 390, 768 and 1280. No document overflow in final checks; final measured controls >=44px. Human image inspection covered representative home/list/detail/policy/hierarchy/map and expanded-help views, not every screenshot pixel.
- Actual map test observed **117 tile responses, all 200**, with visible street tiles/attribution, markers and zoom at all five widths. Marker opens correct detail; Back restores Austin filter; Escape closes and restores opener focus. Drag changed map transform from (0,0) to (91,27); no runtime exceptions in that focused run. Tile and library blocking tests showed expected fallback; empty results had zero markers and clear message.
- Signed-out Garage/Saved/Notifications/discussion/invite/profile/moderation/login dialogs opened with appropriate login prompts. Existing disposable-data tests cover account operations; no live sign-in or user-record changes occurred.
- Help: 50 final page/viewport cases, **45/45 applicable disclosures opened with keyboard Space**, visible focus and zero overflow/undersized controls. Five policy-page cases intentionally have no extra disclosure. An earlier Enter CDP simulation did not activate native details; it is not counted as a passing keyboard check.
- Sampled contrast: body text 14.49:1, muted text 6.02:1, button text 7.73:1, green links 7.13:1, focus 3.89–5.31:1. This is not full WCAG certification.

## Remaining limitations and review points

- Production still contains the baseline problems until a separate, scoped deployment is approved. This candidate sits on a previously dirty tree; this report's normalized diff isolates 14 audit files and must not be mistaken for approval to deploy every earlier change.
- No physical mobile device, Safari, screen reader, authenticated live acceptance, exhaustive external-source recheck or performance audit was completed. Screenshots use responsive desktop Chrome.
- Local fixture does not contain the live R2 hero image; the blank preview image existed before these changes. Live image and local placeholder are not equivalent evidence.
- The mobile filter form is readable but long; this version favors explicit controls over a new hidden advanced-filter workflow.
- Parent research reports Texas Gravel Champs now has a December 6 header but retains postponement/makeup-TBD prose. Treat that as unresolved source conflict, not a silently confirmed reschedule. No date replacement or broad event-refresh job was performed here. Registration closing times must not be mistaken for event start times.
- About/policy/operator/domain/email launch gaps remain as previously documented. Scheduler and indexing remain disabled. Authority reconciliation is pending approval.

## Evidence and original design references

`site-audit-evidence/` contains compact crawl results, browser JSON/screenshots, scripts, test/build logs and SHA manifest. `site-audit.diff` is a normalized-text task-only diff against exact pre-audit snapshots; the manifest records byte hashes. New files are explicit.

Comparison research supplied by parent used official public sources. Adapted original design ideas only: JNews editorial hierarchy/shared branding, Bikemap compact discovery filters and labelled detail facts, Strava explicit map/list selection concepts. No theme assets/code, route data, API integration or paid functionality was reused. Parent observed failures in the comparison sites' interactive map rendering, so their mobile behavior was not claimed verified.

- https://leafletjs.com/ and https://operations.osmfoundation.org/policies/tiles/
- https://www.uci.org/uci-the-federation/7xhBYbVFdymwzNedJF36Wx and https://www.cyclinguk.org/event-listing (no universal event-type taxonomy)
- https://jnews.io/sport/ and https://support.jegtheme.com/documentation/header-option-3/
- https://web.bikemap.net/discover and https://www.bikemap.net/en/r/17754924/
- https://support.strava.com/en-us/articles/15401756-how-do-community-routes-on-strava-work and https://support.strava.com/en-us/articles/15401716-points-of-interest-and-start-points

## Focused format simplification follow-up

Current upcoming list: 55 records; format choices reduced from 9 to 7. Counts by displayed format: Bikepacking 1; Challenge 3; General/social ride 16; Gran fondo 1; Race 22; Rally 2; Tour 6. Counts are memberships, not a completeness assertion: records with no supported format remain available in All events. Former groups were Ride 1, Noncompetitive ride 2 and Social/community ride 13. Raw labels are retained; generic Ride does not establish noncompetitive status. Unknown formats are not guessed. Three discipline and three purpose choices are unchanged.

The aggregate suite now passes 92 tests. Focused tests cover consolidation, subtype preservation, narrow legacy URL semantics, ambiguous named formats and rendered selected options/help. Six desktop/320px browser cases cover new and former format links. The same local preview on port 8795 was refreshed; it is accessible only from the execution computer. No deployment or authority changes occurred.
