# Future

Forward-looking notes for tcs. Vague goals and queued work.

This is the **human-facing** roadmap; HANDOFF.md is the AI's
internal notebook. Cross-Claude channels live in HANDOFF (`## From
meta` / `## For meta`), not here.

## How this file works

- Anyone (you, this repo's per-repo Claude, the meta-session Claude)
  can append. Mark ownership inline when it matters: `[ME]` /
  `[AI]` / `[HYBRID]`.
- Status tags are **optional** — use only when status meaningfully
  differs from "not started." Five values:
    - `[TODO]` — not started (implicit; omit the tag)
    - `[PARTIAL]` — partially implemented; more work needed
    - `[QA-PENDING]` — code shipped; awaiting human QA before done
    - `[BLOCKED]` — waiting on something external (body explains)
    - _(implicit done = moved to `## Archive`, no tag)_
  Status tag goes after the ownership tag, each backtick-wrapped:
  `` `[AI] [QA-PENDING]` ``. Vague aspirational items typically
  have no tags — they're just "things we eventually want."
- When work happens, record it in HANDOFF.md. If the entry is now
  ME-confirmed done, move it under `## Archive` with a one-line
  ship note. If partially shipped, update the status tag (and
  prose if useful). Bias toward keeping `## Backlog` focused.

## Backlog

(everything queued: concrete shapeable work and vague aspirations
mixed; tags clarify shape when it matters. Per-repo Claude session
populates as work begins.)

- **Successful takeover of The Coin Shack** — with FINTRAC
  compliance intact and customer trust preserved through the
  transition.
- **Revamped trading app** — lives in its own repo when that work
  starts; this repo holds the prototypes and analysis that feed
  into it.
- **Small shareable widgets in `site/`** — that help the brother /
  wife / inherited employee with day-to-day ops, since they aren't
  GitHub collaborators.
- Enable GitHub Pages in repo Settings → Pages (source: gh-pages
  branch, root). Confirm `https://scattermind.github.io/tcs/dev/drills/`
  and `https://scattermind.github.io/tcs/drills/` resolve. [ME]
- Intake mechanism for sporadic training notes — operator-led AML
  / shop-protocol session dumps need a path into `notes/`. Open:
  paste-in-chat with AI committing, direct upload via GitHub web
  UI, or another channel. Decide so notes don't pile up out-of-
  band. [HYBRID]
- Intake mechanism for Excel sheets, regulator docs, vendor
  manuals, inherited operator paperwork — into `corpus/`. Open:
  xlsx → CSV extraction for diffable storage, direct binary
  commit, or hybrid (keep original + extract structured data
  alongside). [HYBRID]
- A small landing page at the site root (`site/index.html`) so
  `/` and `/dev/` aren't bare 404s — links to the widgets that
  exist. [AI]
- AML / FINTRAC drill set — second drill page covering ID
  thresholds, structuring red flags, third-party transactions,
  source-of-funds questioning, travel-rule originator info. [AI]
- Customer-side weirdness drill set — scam-victim red flags,
  wallet-help boundaries, counterfeit cash, mid-transaction
  cancellation, post-trade disputes. [AI]
- Expand trade-mechanics scenarios in `site/drills/` —
  partial-cash + Interac, foreign currency at the till,
  wallet-newbie variants. [AI]

## Archive

_Completed items move here from `## Backlog` once ME-confirmed.
Newest on top. Keep entries indefinitely — pruning is a manual
call by ME when the section gets too long._

(empty)
