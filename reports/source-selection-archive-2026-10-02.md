# Bike Portal source selection and archive — 2026-10-02

User decision: "oh, keep the one with more commits and archive the other."

Retained development source: `C:\Development\bike-portal-texas-catalog-integration`, branch `texas-catalog-integration`, HEAD `6f70517beb1270dda087a85a2c7986e741c8d557`. Older `C:\Development\bike-portal-texas-integration` on main at `696cdcc8ece505ec0d28041958b581ef0d665669` is inactive for development.

## Actual archive and physical layout

Recoverable source archive: `C:\Development\_archive\2026-10-02-bike-portal-main-inactive-20261002T201004Z`. This is a snapshot, not a worktree move. Both original folders remain intact. Main's `.git` remains the common repository infrastructure used by catalog; it must not be removed as an apparent duplicate. Ignored `.wrangler` secret/cache categories remain in place and were not read, copied or deleted.

The archive contains 76 main-worktree files and 90 catalog-worktree files, including both newly observed manufacturer-collection files. SHA-256 verification covers every included tracked/untracked non-secret source file and records the two catalog tracker deletions as absent. Worktree-specific staged/unstaged binary patches and status listings preserve dirty-state distinctions. The bundle preserves all 18 commits reachable through refs/reflogs and all three refs, including the separate cached GitHub lineage. It is not a credential backup or a copy of ignored runtime caches.

## Validation and changes

Disposable bundle clones recovered both worktrees: staged/unstaged patches applied, tracked content matched (with source snapshots restoring exact original text line endings), untracked files matched and deletions remained absent. Full bundle recovery, archived bundle verification and retained catalog `git fsck --full` passed. No application tests or project scripts ran.

This task changed only STATUS.md and DECISIONS.md in each original worktree. The earlier documentation repairs remain intact; historical checkpoints were not reactivated. This dated report is new evidence. Another process subsequently changed or added 4 catalog source/record paths: `DECISIONS.md`, `STATUS.md`, `data\manufacturer-collection\3t.json`, `scripts\validate-manufacturer-collection.mjs`. Catalog STATUS.md received a manufacturer-collection next outcome and checkpoint after this task's selection update; those later edits were preserved, not overwritten, and the user's catalog selection remains intact. Original snapshot bytes remain preserved; supplemental copies preserve the later captured revisions. Exact before/after hashes and attribution are recorded in selection-manifest.json. All other inventoried application, asset, test, configuration and unrelated file hashes stayed unchanged at verification. Git refs, HEADs, indexes and worktree registration stayed unchanged. Verification details and exact four-file task diff are in the archive's `selection-manifest.json` and `source-selection.diff`; original preservation metadata is `archive-manifest.json`. This is a point-in-time archive, not a freeze on the other task's continuing changes.

## Superseded proposal and remaining gaps

The earlier GitHub-rooted candidate proposal is superseded by this explicit catalog selection. No candidate based on GitHub was created. Disposable clones were recovery checks only, not development candidates. No transfer, unrelated-history merge, reset, push, remote configuration, global security change, deployment or service access occurred.

Intended remote remains https://github.com/Potterpariah/Bike-Portal.git. Its separate e1ffbeb lineage and Saved badge behavior remain an unresolved synchronization risk; they do not override the selected local source. Provider deployment triggers remain unverified. No source synchronization or restoration of that feature is authorized by this archive operation. Workspace inventory completeness still awaits the URL list.

Recovery instructions are in `C:\Development\_archive\2026-10-02-bike-portal-main-inactive-20261002T201004Z\RECOVERY.md`. Neither original folder was physically archived or deleted.
