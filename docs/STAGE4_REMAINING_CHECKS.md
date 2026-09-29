# Stage 4: what remains after the homepage update

**Current, September 18: 4.3.2** deployed as `be407246-d41f-47b2-b257-1e3b2f0a2be8`. Texas starter content, three reference-reviewed guides and scoped model conflict handling are validated; see PUBLICATION-SET-RELEASE.md. This does not close the live account/moderation/security gates below. LAUNCH-DECISIONS.md contains proposed domain/policy/retention decisions; owner identity/contact and deletion choice remain pending. Email verification and recovery delivery remain blocked because no provider exists.

**September 18:** 4.2.1 Garage navigation and named Saved index are deployed and agent-verified live; see SAVED-LIBRARY-UPDATE.md.

**Stage 4.2 update:** Deployed version `12b81299-0947-4fd4-aeef-3264a8a597ad` includes profile/avatar, garage removal, saved/followed items, helpful/report controls, moderator queue and visible notification count. Local coverage is 17 automated tests plus focused browser checks. Live results below distinguish the earlier Stage 4.1 checks from subsequent Stage 4.2 confirmation. Rate-limit bindings are deployed; enforcement checks remain pending.

The earlier conversation deferred functional checks to allow a test deployment. Instructions to perform a check are not evidence that it passed. This record therefore leaves all unconfirmed live checks open.

## Confirmed context

- September 17 continuation: pasted Wrangler output confirms deployed version `f384cd62-6b0c-4701-b6ff-3724aef0570f` at https://bike-portal-stage4.m25-f6b.workers.dev/. The user confirmed homepage, gravel search/guide/event views, health and diagnostics passed. In a subsequent reply, the user confirmed all five instructed account/garage/event checks passed. Results below are user-reported live acceptance, not independent agent browser checks.

- The earlier deployment output showed the Worker deployed with D1 and R2 bindings.
- The Downloads source contains the PBKDF2 fix at 100,000 iterations, which this update preserves.
- This task passed local rendering/API tests and a Wrangler dry run. These are not live production check-offs.

## Live checks, in order

| Done | Check | Pass condition |
|---|---|---|
| [x] | Homepage and diagnostics | User confirmed `/`, `/api/health`, `/stage4-test`, search and guide/event views passed after the September 17 deployment. |
| [x] | Signup and Turnstile flow | User confirmed new-account signup with the production verification flow passed. Invalid-token rejection was not separately tested live. |
| [x] | Login/session/logout journey | User confirmed refresh retains login and logout/re-login succeeds. User subsequently confirmed `/api/garage` and `/api/notifications` both deny access after logout without displaying account data. |
| [x] | Profile display name and bio persistence | September 18: user confirmed Stage 4.2 profile edits survive refresh and logout/re-login. Location and website controls have local test coverage; separate live edits remain unconfirmed. |
| [x] | Bike Garage addition and persistence | User confirmed adding Portal test bike and finding it after logout/re-login. September 18: user also confirmed disposable-bike deletion and absence after reload. |
| [x] | R2 avatar upload and persistence | September 18: user confirmed a supported avatar uploads and remains visible after logout/re-login in Stage 4.2. |
| [ ] | R2 avatar rejection cases | Invalid type/signature and oversized files pass local automated checks; live rejection checks remain pending. |
| [x] | Texas event status | User confirmed Interested and Going survive refresh/reopen, and Completed survives logout/re-login/reopen on the same event. |
| [x] | Discussion persistence | Agent observed the saved portal test discussion across live page navigation and reload during account-switch and notification inspection. |
| [x] | Second-account comments | Agent observed preview_rider's saved reply on Test Rider's portal test discussion and the corresponding author notification. |
| [x] | Notifications | Agent observed Test Rider's inbox showing preview_rider's reply notification for portal test discussion and a matching discussion link. User subsequently confirmed Mark as read remained Read after refresh. |
| [x] | Own-account reactions, follows, saves | September 18: user confirmed Save/Follow/Helpful persistence, opening Saved, and Unsave/Unfollow persistence. Named Saved index, title search and destination link were agent-verified live after 4.2.1 deployment. |
| [ ] | Cross-account community isolation | Ensure one account cannot modify another account's records; local tests pass, live acceptance remains pending. |
| [ ] | Reports | A member reports a test item; moderators can see the report. |
| [ ] | Moderator permissions | A normal member is denied moderator endpoints; an already authorized moderator can resolve a test report. |

Stage 4.2 supplies profile/avatar, garage-removal, saved/followed-item, discussion helpful/report, and moderator-queue interfaces. The notification header is user-confirmed visible; its new live unread-count update remains to be checked with a new reply.

## Implementation work before a broader public launch

These are not simply unchecked tests:

- **Rate limiting:** AUTH_LIMITER and WRITE_LIMITER bindings are deployed; local denial/fail-closed tests pass. Live enforcement remains unverified. Existing dashboard/WAF controls were not inspected.
- **Password reset:** no reset routes, recovery-token lifecycle, or transactional-email integration are present in this source.
- **Email verification:** no verification routes or verification-email workflow are present in this source.
- **Community policies:** basic community guidelines and truthful test-site data-use facts are published. Effective terms/privacy, operator/contact and implemented deletion/retention commitments remain open; see LAUNCH-DECISIONS.md.
- **Event freshness:** reviewed overlays now cover five October events, with only two selected as publication-ready. Other seed entries are not freshly certified; recheck selected events by their deadlines and resolve the three documented incomplete/conflicting entries. Guide review covers three articles only.

Do not mark Stage 4 fully signed off until the live checks pass and these remaining launch requirements are resolved or explicitly accepted for the intended beta scope.
