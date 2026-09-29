# Stage 4 security choices

- Passwords use PBKDF2-HMAC-SHA256 with 100,000 iterations and a unique 128-bit salt, matching the existing deployed-runtime compatibility fix. This test-deployment preparation does not change password storage or hashing behavior.
- This test package sends `X-Robots-Tag: noindex, nofollow`. Keep this restriction until a production indexing decision is made; it does not restrict access to the site.
- Session cookies are HttpOnly + SameSite=Lax and Secure in production.
- Only a SHA-256 hash of each session token is stored in D1.
- Unsafe same-origin requests reject mismatched `Origin` headers.
- Signup uses Cloudflare Turnstile when configured; production refuses signup if its secret is missing.
- Turnstile validation is server-side, not only client-side.
- Avatar uploads are restricted to JPEG/PNG/WebP and 5 MB.
- Public media is served with `X-Content-Type-Options: nosniff`.
- Role-gated moderator endpoints are included.
- Reports, blocks and moderation audit records have dedicated tables.
- Arbitrary HTML is not accepted for posts/comments; the API stores plain text/Markdown-like source for future safe rendering.
- Password-reset email and email verification are intentionally not faked; those require a real transactional email provider.
- Stage 4.2 configures AUTH_LIMITER and WRITE_LIMITER with fail-closed production handling. Validate their live deployment before release; see STAGE4-2-ACCEPTANCE.md for shared-IP and per-location limits.
