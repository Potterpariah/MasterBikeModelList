# Stage 4.2 implementation and acceptance

This continues the deployed Stage 4.1 portal without rebuilding it. User-supplied Wrangler output confirms Stage 4.2 deployed as `12b81299-0947-4fd4-aeef-3264a8a597ad`, with both rate-limit bindings and existing DB/MEDIA. Local validation passed; acceptance of the new live features is still in progress. The preparation/build history below is retained and must not be mistaken for current deployment status.

## Delivered

- Header Notifications link with full unread count. Refreshes at sign-in, when the window regains focus/becomes visible, every 60 seconds while visible, and after marking a notification read. Failed refresh displays an unavailable count rather than a false zero. No email, push or real-time delivery is implied.
- Profile editor: display name, bio, location, website and public avatar upload; username is shown to distinguish accounts with similar display names.
- Avatar MIME/size checks plus file-signature validation before storage. This verifies basic type consistency, not a full image decode or malware scan.
- Garage removal with an explicit confirmation in the UI. Backend deletion remains scoped to the owner.
- Save/unsave and follow/unfollow on events and discussions; helpful reactions and reports on discussions. A Saved page lists saved and followed items. Following currently stores a bookmark-like relationship; it does not subscribe a follower to discussion-author notifications.
- Moderator-only report queue and close-with-reason flow. Closing records an outcome/audit entry; it does not hide or remove content. Existing moderator roles are required; no live user was promoted.
- Per-account activity retrieval, existing-target validation for community writes, exact unread count beyond the first 100 displayed notifications, and no-store API responses.
- Cloudflare rate-limit bindings and handlers: 20 authentication attempts per minute per connecting IP; 60 write requests per minute per authenticated account. Logout remains available. Missing required production bindings fail closed; tests use explicit substitutes. Shared-network login users share the authentication allowance. These are per-location Cloudflare counters, not a global abuse-prevention guarantee.

Rate-limit API reference: https://developers.cloudflare.com/workers/runtime-apis/bindings/rate-limit/

## Validation

17 automated tests pass (10 retained/updated and 7 added). New tests cover profile/session persistence and role isolation; public-profile privacy; avatar upload/retrieval using a local R2-shaped memory adapter, invalid type/signature/size; garage ownership/deletion; idempotent reactions/follows/saves and isolation; author-only reply notification, read isolation and unread totals; report validation, moderator denial/resolution and audit trail; rate-limit rejection, missing binding and logout behavior.

Browser checks used the in-app browser against loopback-only temporary SQLite/media, with disposable author/moderator fixtures. Observed: profile save and reload; account identity; discussion creation; saved/followed/helpful state after reload; report submission; moderator queue and report closure; second-account reply; header unread count changing from 1 to 0 after read; mobile header layout at 390px with no horizontal overflow. This is not an end-to-end Cloudflare runtime check. Avatar storage and garage deletion were tested programmatically, not through a browser file picker/deletion confirmation.

Wrangler 4.131.2 dry run was attempted again and blocked by this agent environment: esbuild could not read an ancestor directory while resolving the Worker. Build acceptance must be repeated in the user's PowerShell. No new version was deployed by this task.

## Publish and live acceptance

In PowerShell, from this project folder, run each command separately and stop on an error:

```powershell
npm.cmd run check
npm.cmd test
.\node_modules\.bin\wrangler.cmd deploy --dry-run --outdir .\build-check
node .\scripts\verify-bundle.js
.\node_modules\.bin\wrangler.cmd deploy
```

The final command publishes; the others do not. Expect 17 passing tests and both `AUTH_LIMITER` and `WRITE_LIMITER` in the deployment bindings in addition to existing DB/MEDIA. Preserve the full configuration and existing Turnstile secret. No SQL migration/seed import is required. Namespace IDs 417201/417202 were selected for this app; keys include the app prefix. Account-wide namespace ownership was not independently inspected.

After deployment:

1. Sign in, confirm the account/profile and Notifications links work. Edit a test display name/bio, log out/in and confirm persistence.
2. From Profile, upload a disposable PNG/JPEG/WebP under 5 MB; refresh/re-login and verify the avatar. Confirm an invalid/oversized file is rejected. This is the outstanding real R2 check.
3. Add a clearly named disposable garage bike, remove it with confirmation, and verify it is gone after refresh. Do not remove the user's real bikes.
4. Save/follow a test discussion, mark helpful, refresh; check Saved. Unsave/unfollow and verify persistence. Verify a second account has independent choices.
5. Reply from a second account; return to the author and confirm a visible unread count. Mark read and verify zero/read after refresh.
6. Submit a clearly labeled test report. An already-authorized moderator opens Profile → Moderation reports, reviews and closes it with a reason. A normal member must be denied `/api/mod/reports`. Do not grant live moderator access as a test shortcut.
7. Confirm ordinary signup/login/writes work with rate bindings. Controlled limit-exhaustion checks remain pending live; do not stress real users or create large batches of public content.

## Remaining launch gates

- User explicitly chose to leave password-reset and email-verification delivery blocked until a transactional email provider/sender domain exists. Those routes and token workflows remain unimplemented; no fake delivery was added.
- Real R2 and moderator acceptance and the new rate bindings need live verification after this update.
- Community guidelines and privacy facts are drafted in COMMUNITY-AND-PRIVACY-DRAFT.md. Operator/contact, retention/deletion process and final terms still need owner decisions before publication.
- Existing Stage 3 organizer/product facts were preserved, not refreshed. The site continues to disclose date/source limitations. Current event research is a separate content-release gate.
- Profile/garage data and avatars are public under the existing API. Moderation remains the original basic report workflow, not a complete content-removal/admin system.

Do not mark all Stage 4 or public production acceptance complete from local tests alone.
