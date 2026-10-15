# Bike Portal (Texas catalog integration)

Type: application with marketing/SEO site. Host: Cloudflare (existing bindings; D1, R2, Turnstile).
Optional features in use: none.

## Boundaries
- Continue the existing Stage 4.1 portal. Preserve the backend, existing bindings, and Stage 3 data. Build the client before bundling.
- Do not run remote schema or seed migrations unless the current request asks for one.
- Test deployments stay noindex. Keep the default noindex until an owner-supplied canonical HTTPS domain, operator identity, contact channel, policies, and the required implementation are verified.
- Local tests use temporary SQLite and do not certify Cloudflare D1/R2 or real Turnstile. Record live acceptance separately. Do not infer source-data freshness from passing software tests.

## Records
- STATUS.md: current state and the one next outcome. DECISIONS.md: material choices.
- Unresolved or conflicting public facts: reports/factual-exceptions.md. Material technical-SEO findings: reports/seo-assessment.md.

## Docs
Read when relevant: TEST-DEPLOYMENT.md (preparing a test deployment), README.md (setup).