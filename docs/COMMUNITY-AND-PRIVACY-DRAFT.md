> September 18 update: basic community guidelines and data-use facts are now on the test site. This file remains the earlier drafting record, not effective terms/privacy. See LAUNCH-DECISIONS.md for current owner questions and proposed lifecycle decisions.

# Community guidelines and privacy facts — unpublished draft

These are proposed community rules and facts checked against the current implementation. They are not a published privacy policy or complete terms of service. Before publication, the operator must supply their identity, contact channel, retention/deletion process and final terms.

## Proposed community guidelines

Share practical cycling experience respectfully. Do not post harassment, threats, spam, impersonation or another person's private information. Distinguish personal experience from manufacturer instructions and verified event information. Include sources when correcting a factual claim. Use the report action for content that needs moderator attention. Do not post passwords, account tokens or sensitive personal information. Use only images you have permission to share.

## Current data handling

- Registration stores an email address, username and salted password hash. Session tokens are stored as hashes; the browser receives a session cookie.
- Display name, username, bio, location, website, avatar and garage are exposed through public profiles. Discussions and replies are public. The profile editor explains public visibility.
- Email addresses, saved/followed item lists, event plans and notifications use authenticated account endpoints. Reports are available through moderator-only endpoints.
- Cloudflare D1 stores application records. R2 stores uploaded avatars. Public avatar URLs can be read without signing in. Turnstile is used for production signup verification.
- Removing a garage entry deletes that entry. Replacing an avatar currently retains earlier stored image assets; there is no implemented self-service account deletion or asset-retention cleanup.
- Password recovery and verification email are not available. No working email-delivery service is configured by this update.
- The application uses authentication cookies; this inspection does not establish account-wide Cloudflare log retention, other third-party policies or legal jurisdiction.

## Owner decisions still needed

Identify the responsible operator and a contact for account/privacy/moderation requests. Decide retention periods and implement the deletion process before promising them. Define age/access requirements, terms, content rights and any commercial use. Confirm which Cloudflare services/logs are enabled on the account. Publish final documents only after these points are resolved.
