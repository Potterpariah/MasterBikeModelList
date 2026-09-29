# Bike Portal — Stage 4.3.2

The Texas starter set is deployed at `/texas-rides`: two reviewed October events and three technically reviewed guides. Five event records were refreshed; model conflicts are resolved by scope where supported and otherwise remain explicit unknowns. Current Cloudflare version: `be407246-d41f-47b2-b257-1e3b2f0a2be8` (September 18, 2026).

36 automated tests and 29 read-only live HTTP checks passed, plus focused desktop/mobile browser and bundle checks. See [release scope/evidence](docs/PUBLICATION-SET-RELEASE.md), [launch decisions](docs/LAUNCH-DECISIONS.md), [checkpoint](docs/checkpoint.md) and [redeployment](REDEPLOY.md). Test noindex stays enabled; no migrations or seed imports are needed. Operator/contact, policy implementation, owned domain, email delivery and broader live Stage 4 gates remain open.

The sections below preserve the earlier homepage/setup reference.

## Homepage release

- `/` now serves a responsive, server-rendered Bike Portal homepage.
- Upcoming Texas events, published maintenance guides, brands, and recent discussions come from the existing D1 database.
- Search, readable guide/event/discussion views, brand discovery, signup/login, Bike Garage, event plans, replies, and notifications use same-origin APIs.
- Added read-only `/api/portal/catalog` for published guide content and bike/brand discovery.
- `/stage4-test`, all previous API handlers, D1/R2 bindings, and the 100,000-iteration password-hashing fix are preserved.
- The browser script is generated automatically before every Wrangler deployment.
- No new database migration is needed. No production data is modified by the build or tests.

See [homepage validation](docs/HOMEPAGE_VALIDATION.md) and [remaining Stage 4 checks](docs/STAGE4_REMAINING_CHECKS.md).

## Original Stage 4 setup reference

**The setup commands below are historical instructions for a new installation. For this existing Worker, use REDEPLOY.md instead.**

This package implements the persistent layer for the **Blog Microsite Workflow** while keeping the Texas event tracker as an embedded **Data Track/Filter Microsite Workflow** module.

## What Stage 4 adds

- User registration, sign-in, sessions and logout
- Public profiles
- Bike Garage
- Avatar storage in Cloudflare R2
- Texas event browsing from the completed Stage 3 seed
- Interested / Going / Completed event status
- Discussions and threaded comments
- Helpful/like reactions
- Generic follows and saved items
- Notifications for discussion replies
- Reporting and basic moderator workflow
- Persistent D1 schema and Stage 3 data import
- Diagnostic `/stage4-test` page

The original package supplied the backend/application foundation. The Stage 4.1 release above adds the public homepage.

## Why Wrangler is required

This version uses Cloudflare **D1 and R2 bindings**, so it cannot be deployed as a simple static drag-and-drop upload. Deploy it with Wrangler.

## Windows PowerShell setup

Install Node.js first if needed, then open PowerShell in this folder.

```powershell
npm install -g wrangler
wrangler login
wrangler d1 create bike-portal-db
wrangler r2 bucket create bike-portal-media
```

The `d1 create` command prints a database ID. Copy that ID into `wrangler.toml` in place of:

`REPLACE_WITH_D1_DATABASE_ID`

Create a Turnstile widget in Cloudflare and replace:

`REPLACE_WITH_TURNSTILE_SITE_KEY`

Then save the Turnstile secret securely:

```powershell
wrangler secret put TURNSTILE_SECRET
```

Apply the schema and Stage 3 seed:

```powershell
wrangler d1 execute bike-portal-db --remote --file=./migrations/0001_schema.sql
wrangler d1 execute bike-portal-db --remote --file=./migrations/0002_seed_stage3.sql
```

Deploy:

```powershell
wrangler deploy
```

Wrangler will return the Worker URL.

## First tests

Open:

`https://YOUR-WORKER.workers.dev/api/health`

Expected:

```json
{"ok":true,"stage":4,"schemaVersion":"1"}
```

Then open:

`https://YOUR-WORKER.workers.dev/stage4-test`

Use that diagnostic page to:

1. Create an account.
2. Confirm the session persists with **Who am I?**
3. Load Texas events.
4. Create a discussion.
5. Log out and log back in.

## Create the first admin

After creating your own account, promote it with D1:

```powershell
wrangler d1 execute bike-portal-db --remote --command="UPDATE users SET role='admin' WHERE email='YOUR_EMAIL';"
```

Do not leave shared/public accounts as admin.

## Local development

For local testing, change `ENVIRONMENT = "production"` to `ENVIRONMENT = "development"` in `wrangler.toml` and run:

```powershell
wrangler dev
```

You still need local D1 migrations. Cloudflare's local bindings are separate from production.

## Important launch limitation

Email verification and password-reset delivery are **not** simulated in this package. A real transactional email provider must be chosen before those flows are enabled. Core registration/sign-in works without inventing an email service.

## Stage 4 acceptance tests

Stage 4 is ready to hand to the next workflow stage when these pass on the deployed Worker:

- D1 health check succeeds.
- New account can register.
- Same account can log out and log back in.
- Profile edit persists.
- Bike Garage entry persists.
- Avatar uploads and reloads from R2.
- Texas events load from the Stage 3 database.
- Event attendance status persists.
- Discussion persists.
- Comment persists and generates a notification for the discussion owner.
- Report can be submitted.
- Admin/moderator can view and resolve a report.
- No duplicate Stage 3 events are introduced by the seed migration.
