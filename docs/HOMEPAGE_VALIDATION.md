# Homepage validation — Stage 4.1

## Passed

- JavaScript syntax checks for Worker, homepage renderer, client source, and stylesheet module.
- Eight automated tests using the original Stage 4 schema and Stage 3 seed in local in-memory SQLite.
- Server-rendered homepage, correct content types, HEAD behavior, security headers, and meaningful unavailable/empty states.
- Published guide filtering: 16 full articles; 18 brands and 25 model families from the seed.
- Upcoming Texas filtering, cancelled/pending/unverified exclusions, sorting, and America/Chicago day-boundary handling.
- Escaping of persisted content and the public configuration embedded in HTML.
- Existing health, diagnostic, event, authentication, discussion/comment, garage, and event-status workflows against the local database.
- Comparison against the original Downloads Worker: the old backend source is unchanged after removing the new import and route block.
- Wrangler 4.131.2 `deploy --dry-run`: 81.62 KiB upload / 23.54 KiB gzip at validation, with existing D1/R2/vars bindings.
- Compiled Worker serves the exact generated browser source, with no dependency on bundler helper functions; generated script syntax passes.
- Browser inspection at desktop size and 390×844 mobile size; mobile document has no horizontal overflow.
- Browser checks of guide reading, search, local account signup, event detail display, and persisted event status after reopening the detail view. Search also checked against the compiled bundle.

## Scope and practical limits

- No live redeployment or production database writes were performed.
- Tests use local SQLite through a small D1-shaped adapter; they are not Cloudflare runtime integration tests.
- Production Turnstile, R2 uploads, cross-account notifications, moderation, rate limiting, recovery email, and verification email are not certified by these checks.
- Event data is reused, not newly verified with organizers.
- “Popular maintenance guides” is a curated topic selection, not a traffic-based ranking.
- Search covers published guides, brands/models, up to 100 upcoming events, and 50 latest discussions. The result view states that scope.
- Homepage section highlights are rendered on page load. Reload to refresh the latest discussions/content after writing.
- Detail views use URL fragments and require JavaScript. The homepage highlights remain readable with JavaScript disabled. This is not a full set of independently indexed guide/detail routes.

See `REDEPLOY.md` for repeatable checks and `STAGE4_REMAINING_CHECKS.md` for live sign-off.
