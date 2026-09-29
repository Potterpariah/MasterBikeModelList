# Bike Portal decisions

## 2026-09-29 — Establish a local Git baseline without a remote

Decision: initialize this integration copy as a standalone local Git repository on `main`, with no remote, push, deployment, or hosting change. The initial baseline was committed locally as `7b8bacf` after the user selected the repository-local author identity.

Reason: version control protects the prepared Texas integration while keeping the archived original source and external Cloudflare state unchanged.

## 2026-09-29 — Keep SEO launch gated by verified owner facts

Decision: retain default noindex behavior and avoid public canonical claims until the owner supplies and verifies a canonical domain, public identity, monitored contact, and implementable policies.

Reason: static source and local tests cannot prove a public deployment or justify invented public-facing facts. See `reports/factual-exceptions.md` and `reports/seo-assessment.md`.

## 2026-09-29 — Record supplied public identity and contact for future launch work

Decision: use `m36` as the public operator identity and `m36@inzernet.com` as the monitored contact channel when the authorized public policy and launch work is performed.

Reason: the owner supplied both values directly. A canonical domain and final retention/deletion decisions remain unresolved, so no public indexing or deployment follows from this record.
