# Future

Forward-looking notes for tcs. Vague goals and queued work.

This is the **human-facing** roadmap; HANDOFF.md is the AI's
internal notebook. Cross-Claude channels live in HANDOFF (`## From
meta` / `## For meta`), not here.

## How this file works

- Anyone (you, this repo's per-repo Claude, the meta-session Claude)
  can append. Mark ownership inline when it matters: `[ME]` /
  `[AI]` / `[HYBRID]`.
- When work happens, record it in HANDOFF.md and prune / update
  the matching FUTURE entry. Keep this file short.

## Goals

(open-ended; vague is OK)

- Successful takeover of The Coin Shack with FINTRAC compliance
  intact and customer trust preserved through the transition.
- A revamped trading app — lives in its own repo when that work
  starts; this repo holds the prototypes and analysis that feed
  into it.
- Small shareable widgets in `site/` that help the brother / wife
  / inherited employee with day-to-day ops, since they aren't
  GitHub collaborators.

## Next

(concrete, near-term — first per-repo Claude session populates as
work begins)

- Enable GitHub Pages in repo Settings → Pages (source: gh-pages
  branch, root) after the deploy-wiring PR merges. Confirm
  `https://scattermind.github.io/tcs/dev/drills/` and
  `https://scattermind.github.io/tcs/drills/` resolve. [ME]
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
