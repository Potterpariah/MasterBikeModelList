# North Texas discovery cycle

The user selected Bike Portal on Cloudflare. This procedure uses the existing public catalog, page templates, local SQLite preview and tests. It requires no remote schema or seed import.

## Delivery and audience gates

Delivery: ten complete, source-checked initial records; deduplicated rendered pages; working filters and organizer links; three independent human journeys; approved identified production release; working measurement; a refresh of all ten plus five additional events using this same process.

Audience evidence is reported separately. Do not set a traffic threshold or infer registration/attendance from outbound clicks. Zero observed traffic is a result; unavailable data is not zero.

Preparation budget: five working days beginning October 2, 2026, targeting October 8 if October 2 counts as day one. Pause the calendar for required owner decisions rather than pretending a launch occurred. The 28-day observation window begins only after the approved release and live measurement acceptance. Record exact start and end instants; do not use today's date as a substitute for launch.

## Records and refresh

`data/discovery-pilot.json` owns the pilot records, official source URLs, date checked, visible caveats and declared expected count. Runtime overlays the original catalog by slug, retaining legacy identities. One event with several route lengths counts once. Old Dennis's two distances are one event entry. Region North covers the existing North Texas grouping; this batch uses Cooke, Dallas, Denton, Ellis, Johnson and Parker counties.

1. Start a hands-on timer before a human's research/edit/review work. Log active human minutes separately from agent elapsed time and unattended checks. Never infer one from the other.
2. Read the official organizer or organizer-linked registration page, including cancellation notices and lower-page updates. Check name, date, city/venue, discipline, organizer link and participation limits. Record URLs and review date; quote only minimal evidence when necessary.
3. Refresh the existing slug instead of creating another event. Record corrections with field, old/new value and reason. Surface unresolved material discrepancies in `notes`; hold an entry if even a caveat cannot make it useful.
4. Recheck all sources immediately before release. Expired events leave upcoming results automatically; mark them completed in the refresh. Keep historical records and log cancellations.
5. Run `node scripts/validate-discovery.mjs YYYY-MM-DD`, `npm.cmd run check`, `npm.cmd test`, and `wrangler deploy --dry-run --outdir build-check`, then `node scripts/verify-bundle.js`. These are local checks, not release approval.
6. During the observation window, refresh the original ten and add five distinct upcoming North Texas events. Set expectedCount to 15 and phase to repeat; keep the same renderer, validator and measurement schema. Do not count earlier checks in this task as the repeat run.

For the efficiency comparison, divide active human research, editing and publication minutes by verified events actually published in each run. Record shared setup separately and report both inclusive and steady-state costs. Also report corrections, holds, manual interventions and their causes. If initial timing is missing, mark comparison unavailable; begin a prospective timed baseline rather than reconstructing invented minutes.

## Three independent testers

Run `node scripts/preview.js` from the project; open `http://localhost:8788/texas/events?region=North&measurement=off` on this computer. Localhost is not a remotely shareable link. Three people can test separately on this computer, or use a later approved saved preview. Start each tester at the listing without coaching, a preselected detail page or instructions naming the answer.

Give each person this task: "Find an upcoming North Texas cycling event that suits your preferred date, riding surface and distance. Tell me its date and starting location, explain any uncertainty you noticed, and open its official organizer page."

Record anonymized tester label, device, stated preference, event chosen, completion without help, elapsed seconds, whether the organizer destination opened, friction, and corrections required. Use the supplied tester-results.txt. Do not substitute agent/browser checks for these three people. Fix failures and retest before requesting production approval.

## Measurement definition and setup

Cloudflare Web Analytics does not support custom events. The prepared first-party component uses Workers Analytics Engine; it is disabled by default and no production binding has been added. Check account plan/allowances at approval time. No paid upgrade is authorized. References: https://developers.cloudflare.com/web-analytics/faq/ and https://developers.cloudflare.com/analytics/analytics-engine/pricing/ .

For local acceptance only, run `node scripts/preview.js --discovery-measurement`. The console emits LOCAL TEST METRIC records into memory/output, never remote storage. One visible list load, one pilot-detail load and one organizer activation should produce discovery_view, detail_view and organizer_click. Only the first click per page load is recorded. Keyboard activation and middle click are supported; opening via context menus is not measured. No cookies or visitor identifiers are written. Requests contain only action and path; the server adds batch. Privacy signals, JS blockers, failed requests and sampling can reduce counts. Basic bot checks and rate limits are not proof of human traffic or fraud prevention.

For an approved production activation, the operator must review the data-use notice and verify the free allowance, then add DISCOVERY_MEASUREMENT="enabled" under [vars] and a new [[analytics_engine_datasets]] binding DISCOVERY_METRICS to dataset bike_portal_discovery. Keep existing bindings intact. The dataset is created at first write. Export/report access requires Account Analytics Read; current Wrangler OAuth did not list that permission. Credentials remain outside source and chat. Review Cloudflare's then-current retention/limits and export through the observation window.

Data layout: blob1=action, blob2=page path, blob3=batch; double1=1; index1=batch. No account, IP, referrer, query string or arbitrary URL is stored by this application component. Cloudflare still processes connection information; this is not an account-wide privacy guarantee. Testers use measurement=off, which disables collection for that browser tab session; a fresh tab session is needed to restore it. For live acceptance, export the recorded test actions separately and use a later timestamp for the audience window.

Report discovery-page views and pilot event-detail views as page loads, not unique visitors or sessions. Report first organizer activations per detail-page load and click/view ratio = organizer_click / detail_view * 100, with undefined when denominator is zero. This is not a user conversion or registration rate. Raw click count is capped at one per page load. Query counts by action and page for the exact half-open window using COUNT() for stored rows and SUM(_sample_interval) for weighted counts. If any sample interval exceeds one, label weighted totals and ratios as estimates; do not call them exact counts. Export raw and weighted counts, missing-data intervals and exclusions.

Example SQL (replace timestamps only after launch):

```sql
SELECT blob1 AS action, blob2 AS page,
 COUNT() AS stored_rows, SUM(_sample_interval) AS weighted_count,
 MAX(_sample_interval) AS max_sample_interval
FROM bike_portal_discovery
WHERE timestamp >= toDateTime('START_UTC') AND timestamp < toDateTime('END_UTC')
GROUP BY action, page
```

Search Console: use only a verified Bike Portal property under the user's m36@inzernet.com access. The currently connected texascyclinghub.m36438958.chatgpt.site property measures another site. Domain is undecided and workers.dev is noindex. Record Bike Portal GSC metrics as unavailable until a correct verified property exists. After launch, export impressions and clicks for the pilot URLs and the matching dates; retain Google's reporting timezone and incomplete-data cutoff. Do not combine unrelated property traffic.

## Release and 28 days

Before approval, provide candidate hash, change list, local evidence, three tester results, source recheck date, planned hostname/indexing state and measurement activation/export proof. Stop for production approval. Deploy only the approved candidate, then record Cloudflare version ID and verify health, ten pages, filters, destinations, robots headers, canonical host and intended indexing. Noindex must remain unless the project launch prerequisites and separate indexing approval are satisfied. A noindex observation can test direct referrals but cannot be sold as an SEO audience test.

After acceptance, observe 28 full days. Check measurement health and source freshness during the window, complete the refresh-and-add run, then publish a report with delivery status, actual audience evidence, efficiency comparison and one bounded Inzer transfer lesson. Consider standardizing the proven procedure as workflow-verified-event-discovery only after the repeat demonstrates reuse.
