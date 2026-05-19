# Handoff

## What this repo is
Private workspace for taking over **The Coin Shack** — a physical
BTC/cash exchange shop in Markham, Ontario, Canada. The user (with
his brother) is buying the business; the current operators are
training them on FINTRAC/AML compliance, accounting, Kraken
hedging, working with other crypto exchanges, alarm + camera
systems, and the daily physical-shop protocols (cleaning, safe
management, end-of-day accounting). **This repo is not the trading
app** — it's the support workspace.

## Current state
First content past the bones-only scaffold, plus deploy wiring.

`site/drills/` — trade-mechanics employee-training widget. Scenario
+ reveal UI (10 hand-crafted scenarios covering direction ×
pinned-side × mid-vs-ask framing × stale-quote / mid-move /
round-ask edges) plus a Mermaid flowchart of the decision flow.
Vanilla HTML + JS, no build step, Mermaid via CDN. All numbers
(spread, confirmation counts, quote validity, rounding) are
symbolic placeholders — operator fills from shop policy; nothing
shop-specific is encoded.

`.github/workflows/deploy-{main,dev}.yml` + `scripts/build-dist.sh`
— allowlist-driven static deploy to gh-pages. Allowlist is in the
build script (one entry per `source:dest` pair). Main writes to
gh-pages root with `keep_files: true` (preserves `dev/`); dev
writes to `gh-pages/dev` with `keep_files: false` (wipes dev slot
before each push). Dev workflow triggers on `claude/**` so future
sessions on fresh branches deploy without workflow edits — only
one active dev branch at a time, last-writer-wins on the dev slot.

`notes/`, `corpus/`, `src/` are still empty (planned).

**User action required after merge:** enable GitHub Pages in
Settings → Pages, source: gh-pages branch, root. After that:
- `https://scattermind.github.io/tcs/drills/` (main, post-merge)
- `https://scattermind.github.io/tcs/dev/drills/` (current dev branch)

## Planned layout (build as needed)
- `notes/` — sporadic dumps + process documentation from training.
  Never deploys.
- `corpus/` — regulator references (e.g. FINTRAC guidance), vendor
  manuals, sanitized snippets of the existing trading app being
  analyzed. Never deploys.
- `src/` — prototype code, tooling, small utilities. Some flows
  into `site/` widgets.
- `site/` — small web widgets the user shares with brother / wife
  / inherited employee. Allowlist-controlled deploy when wired.

## Trading app revamp (NOT in this repo)
The revamped trading app gets its own repo when work starts —
likely `ScatterMind/coin-shack-app` or similar (name TBD). This
repo's `src/` holds prototypes, analysis fragments, and shareable
utilities — not the production app codebase.

## Web deploy (to set up — first per-repo session task)
Closest precedent: `scattermind/jessica-ai-project`'s allowlist-
in-shell-script variant (`scripts/build-dist.sh` + the two
`deploy-*.yml` workflows under `.github/workflows/`). That pattern
fits this repo's shape (private repo, deployable `site/` subset,
small surface). Copy from there, not from meta's static-PUBLISH_DIR
`templates/gh-pages/` — that template is the minimum-viable shape
for repos without a build allowlist.
- `.github/workflows/deploy-main.yml` — `main` → gh-pages root →
  `https://scattermind.github.io/tcs/`
- `.github/workflows/deploy-dev.yml` — dev branch → `gh-pages/dev`
  → `https://scattermind.github.io/tcs/dev/`
- After workflows merge, ask the user to enable GitHub Pages
  (Settings → Pages → source: gh-pages branch, root).

## Do not put in this repo (operational security)
The repo is private, but private GitHub repos can be exposed if
credentials leak. These items live in properly-secured separate
systems (1Password vault, locked safe), never in this repo:
- Alarm codes, safe combinations
- Live API keys for Kraken or other crypto exchanges
- Customer data, KYC records, transaction logs
- Employee credentials, 2FA seeds, OAuth tokens
- Exact camera blind-spot maps or override procedures
- Anything an attacker would use to physically rob the shop or
  drain accounts

Process-level documentation (how AML compliance works at this
shop, sanitized procedure templates, app architecture without
secrets, training notes about how systems work in general) is
fine. When in doubt, ask the user.

## Do not publish (i.e. do not put in the site/ deploy allowlist)
The site is for small utility widgets shared with the inherited
team. Even more conservative than the "Do not put in this repo"
list — additionally don't publish:
- Sensitive business strategy, M&A negotiation, transition planning
- Anything identifying customers, employees by name, or operator
  pre-takeover information
- Internal accounting / hedging strategy details
- Anything an outside observer (competitor, attacker, regulator
  outside their scope) shouldn't see

## Collaboration
**Solo workspace.** The user's brother, wife, and one inherited
employee are involved in the business but **not** as GitHub
collaborators. Cross-team sharing happens through deployed `site/`
widgets (when that's wired) and out-of-band channels — not direct
repo access. If granting collaborator access ever comes up, this
section needs updating first AND `notes/` content needs review
before granting access. A future session proposing to add anyone
should pause and confirm with the user.

## Dev branch
`claude/initial-setup-4mRa7` — current active dev branch (per-repo
harness assigned it at session start). When `.github/workflows/
deploy-dev.yml` is wired, prefer matching `claude/*` rather than a
specific branch name so future sessions on new dev branches keep
deploying without workflow edits.

## Meta AI / cross-repo coordination

This repo is one of several under the `ScatterMind` GitHub account,
organized by a **control-plane Claude session** in [`scattermind/meta`](https://github.com/ScatterMind/meta). Things a fresh per-repo session should know:

- **`.claude/settings.json` is byte-identical across every ScatterMind repo.** Meta is canonical. If you need to change a hook, propose the change in `scattermind/meta` first, merge there, then mirror byte-for-byte here via a separate PR — never edit this file in isolation. (Meta HANDOFF "Daedalus drift incident" has the cautionary tale.)
- **Cross-Claude message channels live in this HANDOFF** (below). Two sections:
  - `## From meta` — meta-session writes allocated tasks or notes here. Read at session start for direction.
  - `## For meta` — write here when there's something meta should know. Meta reads it at its next multi-repo session start (via `scattermind/meta/setup/multi-repo-prime.sh`, which extracts those two sections from each sibling HANDOFF).
- **Templates** for repeated repo shapes live in [`scattermind/meta/templates/`](https://github.com/ScatterMind/meta/tree/main/templates). Today: `templates/gh-pages/` (static-`<PUBLISH_DIR>` whitelist). For tcs's deploy, copy from `scattermind/jessica-ai-project`'s `scripts/build-dist.sh` allowlist variant instead — closer shape.
- **Full meta-side rules** live in [`scattermind/meta/HANDOFF.md`](https://github.com/ScatterMind/meta/blob/main/HANDOFF.md). Skim "Standard project repo structure", "Drift scan — standing meta-session task", and "Multi-repo meta session setup" once.

## From meta
_Meta-session writes here; tcs's per-repo Claude reads at SessionStart for direction._

- **2026-05-19 — Fresh scaffold (bones only).** First per-repo
  session tasks: (1) skim the "Do not put in this repo" and "Do
  not publish" lists above before adding any content; (2) wire
  `.github/workflows/deploy-{main,dev}.yml` + a build allowlist
  script, copying the jessica-ai-project pattern; (3) decide on
  dev branch name and record it under "Dev branch" above; (4)
  when trading-app-revamp work starts, that lives in a new repo
  (`ScatterMind/coin-shack-app` or similar name TBD), not here.
- **2026-05-19 — `.claude/settings.json` hook regex hardened (meta #22).** The Bash PreToolUse `git push` deny regex now also catches the `+main`/`+master` refspec force-push form (character class `[[:space:]:+]`, was `[[:space:]:]`). Found during tcs's own branch-protection testing today: `git push origin +main` bypassed the hook because no space-or-colon preceded "main"; tcs's server-side protection caught it (HTTP 403) but the hook should be the first layer. This PR mirrors the byte-identical canonical to tcs (the scaffold push earlier today shipped the older regex). **No action required**: behavior change only affects force-push attempts on main, which are blocked at both layers now.
- **2026-05-19 — FUTURE.md format rev2 (meta #23).** Canonical FUTURE.md shape evolved (proposal originated from daedalus's per-repo Claude). New shape: unified `## Backlog` (Goals + Next merged) + `## Archive` for ME-confirmed-done items (newest on top, kept indefinitely — manual prune only) + optional status tags (`[PARTIAL]`/`[QA-PENDING]`/`[BLOCKED]`; `[TODO]` is implicit and the tag can be omitted) alongside the existing ownership tags. This PR mirrors the format here; the 3 former Goals items moved into Backlog with no content changes (just structural). **No action required**: format change only. Tags are optional — the per-repo session apply them when work has shape and status meaningfully differs from "not started."

## For meta
_tcs's per-repo Claude writes here when there's something meta
should know — meta reads at its next multi-repo session start._

(empty)

## Standing rules
Destructive-action rules are enforced by hooks in
`.claude/settings.json` (byte-identical to meta canonical). The
HANDOFF-update rule is enforced by the Stop hook on real-work
turns. Read the SessionStart-injected context for the live list.
Same judgement-based update rules as every other ScatterMind repo.
