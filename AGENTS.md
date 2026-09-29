# Bike Portal continuation

Continue the existing Stage 4.1 portal. Read `STATUS.md`, `DECISIONS.md`, `README.md`, `TEST-DEPLOYMENT.md`, and `docs/checkpoint.md` first. Preserve the backend, existing bindings and Stage 3 data. Build the client before bundling. Never rerun remote schema or seed migrations for this homepage update. Keep test deployments noindex. Local tests use temporary SQLite; they do not certify Cloudflare D1/R2 or real Turnstile. Record live acceptance separately. Do not infer source-data freshness from successful software tests.

## SEO and release records

`STATUS.md` is the current operational record and `DECISIONS.md` is the durable decision log. Keep unresolved or conflicting public facts in `reports/factual-exceptions.md`, record material technical-SEO findings in `reports/seo-assessment.md`, and maintain one executable next action in `docs/gpt-ready-prompts/current-stage-or-next-gate.md`.

Do not enable indexing, change a canonical domain, publish, deploy, run migrations, or make an external write without separate authorization. Preserve the default noindex behavior until an owner-supplied canonical HTTPS domain, operator identity, contact channel, policies, and the required implementation are verified.
