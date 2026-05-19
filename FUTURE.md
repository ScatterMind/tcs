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

## Archive

_Completed items move here from `## Backlog` once ME-confirmed.
Newest on top. Keep entries indefinitely — pruning is a manual
call by ME when the section gets too long._

(empty)
