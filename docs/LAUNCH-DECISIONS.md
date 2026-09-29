# Public launch decisions — prepared September 18, 2026

Status: owner information and decisions pending. This is a concrete proposal for review, not a public policy or a claim that deletion/retention automation exists. Do not enable indexing or substitute invented identities.

## Domain and identity

Recommended permanent domain: **bikefieldnotes.com**, with the existing Bike Portal identity retained until the owner chooses a public name. The name accommodates maintenance, models and community beyond Texas, with Texas events as the initial editorial focus. Preserve existing route paths when changing domains.

Verisign's authoritative .com RDAP endpoint returned HTTP 404 (no registration object) at 2026-09-18 23:09:59 UTC: `https://rdap.verisign.com/com/v1/domain/bikefieldnotes.com`. This is a point-in-time registry observation, not a purchase, reservation, price quote, trademark clearance or guarantee of availability. No domain was registered and no DNS/canonical configuration was changed. Confirm ownership and pricing before purchase; no spending authorization was provided.

Required owner-supplied values: public operator name (person or legal entity), publishing jurisdiction, public site name, working public contact channel, and domain ownership. Do not derive these from a Windows username, Cloudflare account identifier or another project. Once supplied, put the identity/contact in About, privacy and terms consistently. Use an existing monitored address initially if suitable; do not advertise an invented `privacy@` mailbox.

## Recommended decisions

| Area | Proposed decision | Current implementation / prerequisite |
|---|---|---|
| Audience | Adult-account beta initially; public informational pages remain readable | No age attestation or enforcement exists. Owner must choose age policy before making a promise. |
| Account/profile data | Keep while the account is active; authenticated deletion removes profile, email, password hash and private activity | No account-deletion endpoint; implement and test before publishing this commitment. |
| Public posts | On deletion, preserve discussion continuity under an anonymous author; remove identifying profile fields and support removal/redaction of personal information in post bodies | Awaiting owner's choice between anonymization and deleting posts. Do not claim text becomes anonymous merely by changing its author label. |
| Deletion handling | Reauthenticate, show exact consequences, revoke all sessions immediately, then remove active account/media data; target completion within 30 days of a validated request | Proposed service target, not a legal deadline or implemented guarantee. Requires a monitored request channel, deletion implementation and failure tracking. |
| Sessions | Keep current 30-day maximum; purge expired rows routinely and revoke on logout/deletion | Authentication already checks expiry. Cleanup currently runs during login; no scheduled purge exists. |
| Avatars | Delete replaced avatars after successful replacement; remove all account-owned media on account deletion | Old R2 assets currently remain. D1 deletion does not itself remove R2 objects. |
| Notifications | Purge read entries after 90 days, unread after 180 days | Proposed; no automated purge exists. |
| Saved items / event plans / garage | Retain until removed or account deletion | Individual removals work; account deletion pending. Garage is currently PUBLIC through user profiles. |
| Reports and moderation audit | Restricted access; proposed 12 months after resolution, with documented case-specific exceptions | Retention automation and handling of open cases require implementation; schema uses user foreign keys. |
| Logs | Avoid storing request bodies, credentials or unnecessary IP data; propose 30 days for application security logs if introduced | Actual Cloudflare account logging configuration and retention have not been verified. Do not promise account-wide limits. |
| Backups | Explain active-data deletion separately from backup expiry; reapply deletion records before restoring a backup to service | Cloudflare D1 Time Travel history can persist up to 30 days. Verify the account plan and other exports/backups; no restore procedure has been implemented here. |
| Marketing and tracking | No newsletter, ad profiling or sale of user data in the current application; reassess before adding them | Do not generalize this code review to unknown provider/account configuration. |

Recommended technical order: choose deletion semantics → implement reauthentication/session revocation and D1 transaction → delete all owned R2 assets with retry tracking → verify public profiles, notifications, post text and other users' references → add retention jobs → test backup-restoration handling → publish only the commitments actually implemented.

## Concrete policy drafts to finalize

Privacy notice: identify the operator/contact; explain email and password-hash storage, public profile/garage/posts, private saved items/plans/notifications, restricted reports, session cookies, Cloudflare D1/R2 and Turnstile. State actual retention periods, deletion workflow, backup limits, request verification and contact route. Describe applicable rights only after jurisdiction/audience/business applicability is checked. Avoid promising delivery of recovery or verification emails while no provider exists.

Community terms: user retains ownership of submitted material; proposed limited non-exclusive permission to host/display it for the service; require rights to uploads, prohibit abuse/spam/impersonation/private information, describe reports/moderation and appeals to the operator. Event organizers control participation, routes and registration. Manufacturer manuals control equipment instructions; guides are reference-based and do not certify a bicycle safe. Commercial reuse, age rules, liability and dispute provisions require operator decisions and appropriate review.

These drafts are not effective terms, consent records, waivers or legal sign-off. Keep the existing truthful test-site pages until identity, policies and implementation agree.

## Sources and verification limits

- [Cloudflare D1 Time Travel](https://developers.cloudflare.com/d1/reference/time-travel/): backup/history behavior; does not prove this account's export or logging configuration.
- [Texas Attorney General privacy resources](https://www.texasattorneygeneral.gov/consumer-protection/file-consumer-complaint/consumer-privacy-rights): starting point for applicable privacy obligations. No assertion that every listed law applies to this operator.
- Application facts checked against `migrations/0001_schema.sql` and `src/worker.js` on September 18, 2026.

Email verification/password recovery remains an explicit launch blocker. No email provider was configured, no messages were sent, and no existing accounts, roles, content or media were deleted.
