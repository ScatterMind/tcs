/* Trade-mechanics scenarios for The Coin Shack employee drills.
 *
 * Each scenario describes what a customer says, then encodes the
 * expected operator handling. Math uses placeholder symbols
 * (MID/ASK/BID/s) — the operator fills in real numbers from the
 * shop's live feed and policy. Shop spread, confirmation counts,
 * quote validity windows, and any specific SOPs stay out of this
 * file. */

(function () {
  // direction: which way the value flows
  //   "c2b" — customer pays cash, receives BTC
  //   "b2c" — customer sends BTC, receives cash
  //
  // constraint: which side the customer pinned
  //   "cash-in"  — fixed cash they're handing over (c2b)
  //   "btc-out"  — fixed BTC they want to receive (c2b)
  //   "btc-in"   — fixed BTC they're sending (b2c)
  //   "cash-out" — fixed cash they want to receive (b2c)
  //   "round"    — approximate ("about $500 worth"); needs clarification
  //
  // edge: optional modifier
  //   "stale-quote"  — they were quoted earlier, now stale
  //   "mid-move"     — price moved during the transaction
  //   "mid-vs-ask"   — customer is comparing your price to a public mid feed

  const scenarios = [
    {
      id: "c2b-cash-in",
      tag: "Cash → BTC · customer pinned cash in",
      line: "I've got $500 cash. Give me bitcoin.",
      clarify: [
        "Do you have a wallet ready? Can you pull up the receive address?",
        "Confirm denomination breakdown of the cash before counting.",
      ],
      math: "BTC_out = $500 / ASK",
      procedure: [
        "Customer shows receive address; you read it back to them — never trust clipboard.",
        "Count cash; verify quality (no obvious counterfeits, no banded bricks without explanation).",
        "Pull live MID from the reference feed; compute ASK.",
        "State the BTC amount and the ASK price out loud; get verbal accept.",
        "Send BTC; show the broadcast txid to the customer.",
        "Print/record the transaction per shop record-keeping policy.",
      ],
      pitfalls: [
        "Clipboard-swap malware: always read the address aloud and have the customer confirm character groups.",
        "ASK ≠ what they saw on Google. Be ready to explain the spread up front, not after they object.",
        "Customer asks you to type the address — you can read, they type/scan. Avoid touching their device.",
      ],
    },
    {
      id: "c2b-btc-out",
      tag: "Cash → BTC · customer pinned BTC out",
      line: "I want exactly 0.025 BTC.",
      clarify: [
        "Confirm 0.025 BTC exactly (read decimal places back to them).",
        "Wallet ready?",
      ],
      math: "cash_in = 0.025 × ASK  (round UP to the nearest cent per shop rounding policy)",
      procedure: [
        "Confirm wallet address as in the cash-pinned case.",
        "Pull live MID; compute ASK; multiply.",
        "Quote the cash amount; get verbal accept.",
        "Customer hands over cash; count and verify before sending BTC.",
        "Send BTC; show txid; record.",
      ],
      pitfalls: [
        "Customer brings exact bills but came in expecting a different BTC amount — re-clarify which side they pinned.",
        "Rounding asymmetry: if you round BTC down and cash up the shop wins by a hair every time. Be explicit so it doesn't read as sneaky.",
      ],
    },
    {
      id: "c2b-mid-vs-ask",
      tag: "Cash → BTC · mid-vs-ask framing",
      line: "Bitcoin's at $90,000 right now — how much do I get for $500?",
      clarify: [
        "Anchor expectation: the $90k they saw is mid-market. The shop sells at ASK, which is MID + spread.",
        "Show them the breakdown if they want it: MID, spread %, ASK, resulting BTC.",
      ],
      math: "ASK = MID × (1 + s);  BTC_out = $500 / ASK",
      procedure: [
        "Open with the spread before they ask — 'our price is X% over the live market for cash settlement'.",
        "Quote ASK and BTC_out together.",
        "If they push back, offer the comparison transparently — don't hide it.",
      ],
      pitfalls: [
        "Don't fudge the math to make ASK look like MID — destroys trust if they spot it later.",
        "Don't argue about whether the spread is 'fair'. Quote it; let them decide.",
      ],
    },
    {
      id: "b2c-btc-in",
      tag: "BTC → Cash · customer pinned BTC in",
      line: "I'm sending 0.05 BTC. How much cash do I get?",
      clarify: [
        "Confirm 0.05 BTC exactly.",
        "Confirm method: scan operator deposit QR vs. paste address.",
      ],
      math: "cash_out = 0.05 × BID",
      procedure: [
        "Generate a fresh deposit address in the operator wallet (never reuse).",
        "Show the QR; have customer scan and stage the send on their device.",
        "Pull live MID; compute BID; quote cash_out; get verbal accept.",
        "Customer broadcasts. Wait for confirmations per shop policy before paying.",
        "Count and hand over cash; record the transaction.",
      ],
      pitfalls: [
        "Zero-conf payout = double-spend risk. Confirmation count is policy, not negotiable.",
        "Customer's mempool fee is too low → tx stuck. Have a policy line for what to do (wait? RBF guidance? send back?).",
        "Customer sends to the wrong address (theirs, not yours): you cannot recover. Verify they're scanning YOUR QR, not their own previous one.",
      ],
    },
    {
      id: "b2c-cash-out",
      tag: "BTC → Cash · customer pinned cash out",
      line: "I need exactly $1,000 in cash. How much BTC do I send?",
      clarify: [
        "Confirm $1,000 exact (not 'about').",
        "Decide rounding direction with them: round BTC up so they're guaranteed ≥ $1,000, or round to a clean BTC amount and accept a few dollars over/under.",
      ],
      math: "BTC_in = $1,000 / BID  (round to satoshi per shop rounding policy)",
      procedure: [
        "Quote the BTC amount with the cash payout side-by-side.",
        "Generate deposit address; show QR; customer sends EXACTLY the quoted BTC.",
        "Wait for confirmations per shop policy.",
        "Pay out $1,000; record.",
      ],
      pitfalls: [
        "Customer eyeballs the amount and sends approximate BTC. If under, top-up or partial refund — have a policy. If over, refund the overage in cash or BTC per policy.",
        "Customer asks to be paid in a specific denomination mix — check till has it before quoting.",
      ],
    },
    {
      id: "round-ask",
      tag: "Either direction · round-number approximation",
      line: "Give me, like, $500-ish of bitcoin. Whatever's clean.",
      clarify: [
        "Pin one side before computing. Ask: 'Do you want $500 cash even, or a round BTC amount that's near $500?'",
        "If they truly don't care, default to round cash on their side — easier for cash handling.",
      ],
      math: "Once a side is pinned, it collapses to one of the standard cases.",
      procedure: [
        "Convert 'about' into 'exactly'. Restate before computing.",
        "Proceed with whichever standard case the clarification produced.",
      ],
      pitfalls: [
        "Don't compute on 'about'. Customers later remember the exact number you said and ignore that you asked.",
        "Round-asks are the most common source of after-the-fact disputes. Restate the exact pinned number out loud before pulling a quote.",
      ],
      edge: "round",
    },
    {
      id: "stale-quote",
      tag: "Either direction · stale quote",
      line: "You quoted me 12 minutes ago. I'll take it.",
      clarify: [
        "Acknowledge the earlier quote but pull a fresh one — quotes expire per shop validity policy.",
        "If they're upset: explain the price moved both ways during that time; the shop holds quotes for X minutes precisely because of this.",
      ],
      math: "Recompute with current MID. Old quote is reference only.",
      procedure: [
        "Pull fresh MID; recompute ASK or BID.",
        "Compare side-by-side with the prior quote so the change is visible.",
        "If new quote is better for them: hand them the win, build trust.",
        "If worse: stand on the validity policy, don't negotiate it case-by-case.",
      ],
      pitfalls: [
        "Honoring stale quotes ad-hoc trains customers to stall and lock in good moves.",
        "Per-shop policy varies — write it down so all employees say the same thing.",
      ],
      edge: "stale-quote",
    },
    {
      id: "mid-move",
      tag: "Either direction · price moved mid-transaction",
      line: "(BTC moved 1.5% between your quote and the customer finishing the cash count.)",
      clarify: [
        "Did the move cross the shop's re-quote threshold?",
        "Move in customer's favor or shop's favor?",
      ],
      math: "If within re-quote threshold: honor the quote. If outside: pull a fresh quote and explain.",
      procedure: [
        "Within tolerance: complete the trade at the quoted price. Eat the small swing — it averages out and customer trust is worth more.",
        "Outside tolerance: stop the count. Explain the move, show the new price, ask if they want to proceed at the new number.",
      ],
      pitfalls: [
        "Always re-quoting on micro-moves looks predatory. Always honoring on big moves bleeds the shop.",
        "Per-shop policy: define the tolerance % and write it visibly so it's not a judgment call mid-trade.",
      ],
      edge: "mid-move",
    },
    {
      id: "wallet-not-ready",
      tag: "Cash → BTC · customer has no wallet",
      line: "I want to buy bitcoin. Wait — do I need a wallet?",
      clarify: [
        "Yes — shop never holds custody after the trade. They need a wallet they control.",
        "Are they comfortable installing one now, or want to come back?",
      ],
      math: "(No trade until wallet exists.)",
      procedure: [
        "Hand them the shop's wallet-setup printout (recommended wallets, plain instructions).",
        "They set up the wallet THEMSELVES — never type a seed phrase, never see a seed phrase, never touch their device.",
        "When wallet is set up, they show you the receive address; trade proceeds as cash-in / btc-out standard case.",
      ],
      pitfalls: [
        "Touching their phone or seeing their seed phrase puts the shop on the hook for any future loss. Hands off — always.",
        "Don't recommend a custodial wallet as 'easier' — defeats the point and creates KYC ambiguity.",
        "If they don't want to set one up now: refund and walk them out friendly. No trade.",
      ],
      edge: "round",
    },
    {
      id: "direction-confusion",
      tag: "Either direction · terminology confusion",
      line: "Can I buy cash with my bitcoin?",
      clarify: [
        "Restate the direction in plain terms: 'You want to sell bitcoin and receive cash — that's BTC → cash. Is that right?'",
        "Confirm before any math.",
      ],
      math: "(Standard b2c once direction is confirmed.)",
      procedure: [
        "Mirror their language but use unambiguous terms when you restate.",
        "Proceed with standard b2c flow.",
      ],
      pitfalls: [
        "'Buy' and 'sell' are reversed in some customers' heads — confirm in customer-facing language, not trader jargon.",
        "If they say one thing but the math implies another, stop and re-confirm.",
      ],
    },
  ];

  // Random pick respecting the edge-case filter.
  function pickScenario(includeEdge) {
    const pool = includeEdge ? scenarios : scenarios.filter((s) => !s.edge);
    return pool[Math.floor(Math.random() * pool.length)];
  }

  window.TCSDrills = { scenarios, pickScenario };
})();
