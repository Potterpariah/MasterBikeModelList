# Bike Portal decisions

## 2026-09-29 — Establish a local Git baseline without a remote

Decision: initialize this integration copy as a standalone local Git repository on `main`, with no remote, push, deployment, or hosting change. Leave the initial commit staged until a local Git author identity is selected.

Reason: version control protects the prepared Texas integration while keeping the archived original source and external Cloudflare state unchanged.

## 2026-09-29 — Keep SEO launch gated by verified owner facts

Decision: retain default noindex behavior and avoid public canonical claims until the owner supplies and verifies a canonical domain, public identity, monitored contact, and implementable policies.

Reason: static source and local tests cannot prove a public deployment or justify invented public-facing facts. See `reports/factual-exceptions.md` and `reports/seo-assessment.md`.
