# Stage 4 deployment checklist

## Cloudflare resources
- [ ] D1 database named `bike-portal-db`
- [ ] R2 bucket named `bike-portal-media`
- [ ] Turnstile widget for the Worker/custom domain
- [ ] D1 database ID copied into `wrangler.toml`
- [ ] Turnstile site key copied into `wrangler.toml`
- [ ] Turnstile secret stored with `wrangler secret put TURNSTILE_SECRET`

## Database
- [ ] Run `0001_schema.sql`
- [ ] Run `0002_seed_stage3.sql`
- [ ] Confirm 72 rows in `events`
- [ ] Confirm 18 rows in `brands`
- [ ] Confirm 25 rows in `bike_models`

## Deploy
- [ ] Run `wrangler deploy`
- [ ] Open `/api/health`
- [ ] Open `/stage4-test`

## Functional tests
- [ ] Sign up
- [ ] Session persists
- [ ] Logout
- [ ] Login
- [ ] Edit profile
- [ ] Add Bike Garage record
- [ ] Upload avatar
- [ ] Load Texas events
- [ ] Set event to Interested / Going / Completed
- [ ] Create discussion
- [ ] Add comment from second test user
- [ ] Confirm notification appears
- [ ] Submit report
- [ ] Promote one controlled test account to admin
- [ ] Resolve report from moderator endpoint

## Before public launch
- [ ] Add authentication/write-route rate limiting or equivalent WAF controls
- [ ] Choose real transactional email service for verification/password resets
- [ ] Re-verify Texas event data
- [ ] Add terms/community guidelines/privacy notice
- [ ] Test moderation tools with a non-admin moderator account
