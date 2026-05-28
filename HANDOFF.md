# Handoff

<!-- RESUME BLOCK — overwrite in place each session (NOT an append-only entry).
Keep ≤ ~1.2KB so it survives a 2KB preview; it is the head-slice's first content.
See meta HANDOFF "## Compaction & priming (head-slice model)". -->

**RESUME:** The Coin Shack support workspace (BTC/cash exchange takeover; this
repo = training notes/widgets, NOT the trading app). **State:** drills widget +
allowlist deploy shipped — see "## Current state"; resume cleanly unless an entry
says otherwise. Before adding content, mind the "Do not put in this repo" / "Do
not publish" lists below. **Dev branch:** `claude/future-intake-Q8mvR` (deploy
triggers on `claude/**`). **## From meta:** check below — newest is the
compaction/priming overhaul (meta #27), mirrored here, no action. **Read next:**
this is a HEAD slice — Read HANDOFF.md in full + FUTURE.md before substantive
work; a ~2KB preview means it truncated.

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
`claude/future-intake-Q8mvR` — current active dev branch. Previous
branch `claude/initial-setup-4mRa7` (deploy wiring + drill widget)
merged via PR #3 and is now stale. The dev deploy workflow matches
`claude/**`, so this branch publishes to `gh-pages/dev/` on push
without workflow edits.

## Meta AI / cross-repo coordination

This repo is one of several under the `ScatterMind` GitHub account,
organized by a **control-plane Claude session** in [`scattermind/meta`](https://github.com/ScatterMind/meta). Things a fresh per-repo session should know:

- **`.claude/settings.json` is byte-identical across every ScatterMind repo.** Meta is canonical. If you need to change a hook, propose the change in `scattermind/meta` first, merge there, then mirror byte-for-byte here via a separate PR — never edit this file in isolation. (Meta HANDOFF "Daedalus drift incident" has the cautionary tale.)
- **Cross-Claude message channels live in `CHAT.md`** (6th standard file, added 2026-05-28). Three sections:
  - `## Inbox` — meta and other repos drop messages here addressed to tcs's Claude. Read at session start; drain by acting then moving entries to `## Archive`.
  - `## Outbox` — write here when there's something meta should know. Meta reads it at its next multi-repo session start (via `scattermind/meta/setup/multi-repo-prime.sh`, which extracts each sibling's `CHAT.md ## Outbox`).
  - `## Archive` — drained messages, newest on top, kept indefinitely.
- **Templates** for repeated repo shapes live in [`scattermind/meta/templates/`](https://github.com/ScatterMind/meta/tree/main/templates). Two relevant today: `templates/gh-pages/` (static-`<PUBLISH_DIR>` whitelist) and `templates/gh-pages-allowlist/` (shell-script `ALLOWLIST` array + `claude/**` dev-branch glob). **This repo's deploy matches `gh-pages-allowlist/`** — `.github/workflows/deploy-{main,dev}.yml` + `scripts/build-dist.sh` were wired in PR #3 before the template existed; the template was then generalized from this repo's pattern (see meta #26 / the `## From meta` entry below).
- **Full meta-side rules** live in [`scattermind/meta/HANDOFF.md`](https://github.com/ScatterMind/meta/blob/main/HANDOFF.md). Skim "Standard project repo structure", "Drift scan — standing meta-session task", and "Multi-repo meta session setup" once.

(empty)

## Standing rules
Destructive-action rules are enforced by hooks in
`.claude/settings.json` (byte-identical to meta canonical). The
HANDOFF-update rule is enforced by the Stop hook on real-work
turns. Read the SessionStart-injected context for the live list.
Same judgement-based update rules as every other ScatterMind repo.

(Cross-Claude AI-to-AI messages now live in `CHAT.md` — see Inbox / Outbox / Archive there.)
