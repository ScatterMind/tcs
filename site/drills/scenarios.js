/* Procedural drill generator for The Coin Shack counter training.
 *
 * Two categories:
 *   "trade"   — trade-mechanics conversions. 4 types (direction ×
 *               which side the customer pins) across 4 CAD price
 *               tiers. Amount is randomized within the tier and the
 *               phrasing rotates so trainees can't memorize a fixed
 *               set.
 *   "redflag" — AML red flags. Currently: structuring (smurfing) —
 *               a customer trying to split transactions under the
 *               $1k ID line and $10k reporting line. The drill
 *               teaches recognition + the compliant response, never
 *               how to accommodate it.
 *
 * Pricing math stays symbolic (MID/ASK/BID/s) — the operator pulls
 * the live number. Curated tier amounts were sized to land in their
 * CAD bucket at a rough working price; no shop rate, spread, or SOP
 * is encoded here (see HANDOFF "Do not publish"). */

(function () {
  const pick = (a) => a[Math.floor(Math.random() * a.length)];
  const fill = (tpl, amt) => tpl.split("{amt}").join(amt);

  const ONES = ["zero", "one", "two", "three", "four", "five", "six",
    "seven", "eight", "nine", "ten", "eleven", "twelve", "thirteen",
    "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"];
  const TENS = ["", "", "twenty", "thirty", "forty", "fifty", "sixty",
    "seventy", "eighty", "ninety"];
  function words(n) {
    if (n < 20) return ONES[n];
    if (n < 100) return TENS[Math.floor(n / 10)] + (n % 10 ? "-" + ONES[n % 10] : "");
    return String(n);
  }

  // Canonical (numeric) renderings — used in math + handling text.
  const canonCash = (n) => "$" + n.toLocaleString("en-US");
  const canonBtc = (n) => n + " BTC";

  // Spoken renderings — varied phrasing, used only in the customer
  // statement line (never in the math, which needs the numeric form).
  function spokenCash(n) {
    const forms = ["$" + n.toLocaleString("en-US")];
    if (n % 1000 === 0 && n / 1000 <= 25) forms.push(words(n / 1000) + " grand");
    if (n % 1000 === 0) forms.push("$" + n / 1000 + "k");
    if (n % 100 === 0 && n < 1000) forms.push(words(n / 100) + " hundred");
    return pick(forms);
  }

  function spokenBtc(n) {
    const forms = [n + " BTC", n + " bitcoin"];
    if (n === 0.5) forms.push("half a coin", "half a bitcoin");
    if (n === 0.25) forms.push("a quarter of a coin");
    if (n === 0.1) forms.push("a tenth of a coin");
    if (n === 0.05) forms.push("point oh five bitcoin");
    return pick(forms);
  }

  // CAD tiers with curated amounts. btc[] values are sized to fall
  // in the same CAD bucket at a rough working price — illustrative
  // sizing only, not an encoded rate.
  const TIERS = [
    {
      id: 1, label: "Tier 1 · $100–$1,000",
      cash: [100, 150, 200, 250, 300, 400, 500, 600, 750, 800, 900],
      btc: [0.002, 0.004, 0.006, 0.008, 0.01],
    },
    {
      id: 2, label: "Tier 2 · $1,000–$5,000",
      cash: [1000, 1200, 1500, 2000, 2500, 3000, 3500, 4000, 4500],
      btc: [0.015, 0.02, 0.025, 0.03, 0.04, 0.05],
    },
    {
      id: 3, label: "Tier 3 · $5,000–$10,000",
      cash: [5000, 5500, 6000, 6500, 7000, 7500, 8000, 8500, 9000, 9500],
      btc: [0.06, 0.07, 0.08, 0.09, 0.1],
    },
    {
      id: 4, label: "Tier 4 · >$10,000",
      cash: [11000, 12000, 13000, 15000, 18000, 20000, 25000],
      btc: [0.12, 0.15, 0.2, 0.25, 0.3, 0.5],
    },
  ];

  const CONVERSIONS = [
    {
      pin: "cash",
      tag: "Cash → BTC · customer pinned cash in",
      templates: [
        "I've got {amt} cash — turn it into Bitcoin.",
        "Here's {amt}. Load up my wallet.",
        "Can I put {amt} into bitcoin?",
        "{amt} in cash. How much BTC is that?",
        "Wanna buy some bitcoin with {amt}.",
      ],
      handling: (amt) => ({
        clarify: [
          "Wallet ready? Have them pull up the receive address.",
          "Confirm the cash denomination breakdown before you start counting.",
        ],
        math: `BTC_out = ${amt} ÷ ASK   (ASK = MID × (1 + s); pull live MID)`,
        procedure: [
          "Read the receive address back aloud — never trust the clipboard.",
          "Count the cash; check quality (no obvious counterfeits, no unexplained banded bricks).",
          "Pull live MID; compute ASK.",
          "State the BTC amount and the ASK out loud; get a verbal accept.",
          "Send BTC; show the broadcast txid.",
          "Record the transaction per shop record-keeping policy.",
        ],
        pitfalls: [
          "Clipboard-swap malware: confirm the address in character groups, not at a glance.",
          "ASK ≠ the price they saw on Google — explain the spread up front, not after they object.",
          "You read the address, they type or scan it. Don't touch their device.",
        ],
      }),
    },
    {
      pin: "btc",
      tag: "Cash → BTC · customer pinned BTC out",
      templates: [
        "I want exactly {amt}. What's that cost me?",
        "Need {amt} — how much cash?",
        "Give me {amt}.",
        "Looking to grab {amt} today. What's the cash?",
        "Can you sell me {amt}?",
      ],
      handling: (amt) => ({
        clarify: [
          `Confirm ${amt} exactly — read the decimal places back to them.`,
          "Wallet ready?",
        ],
        math: `cash_in = ${amt} × ASK   (round per shop rounding policy)`,
        procedure: [
          "Confirm the receive address (read it back aloud).",
          "Pull live MID; compute ASK; multiply.",
          "Quote the cash amount; get a verbal accept.",
          "Take the cash; count and verify before sending any BTC.",
          "Send BTC; show the txid; record.",
        ],
        pitfalls: [
          "They may have walked in expecting a different BTC amount — re-confirm which side they pinned.",
          "Rounding asymmetry (BTC down, cash up) reads as sneaky if hidden — state it plainly.",
        ],
      }),
    },
    {
      pin: "btc",
      tag: "BTC → Cash · customer pinned BTC in",
      templates: [
        "I'm sending {amt} — what do I get back?",
        "Cashing out {amt} today.",
        "How much for {amt}?",
        "Selling {amt}. What's my payout?",
        "Got {amt} to sell. How much cash?",
      ],
      handling: (amt) => ({
        clarify: [
          `Confirm ${amt} exactly.`,
          "Method: scan the operator deposit QR vs. paste an address.",
        ],
        math: `cash_out = ${amt} × BID   (BID = MID × (1 − s); pull live MID)`,
        procedure: [
          "Generate a fresh deposit address in the operator wallet (never reuse).",
          "Show the QR; have them stage the send on their device.",
          "Pull live MID; compute BID; quote the cash; get a verbal accept.",
          "Wait for confirmations per shop policy before paying out.",
          "Count and hand over the cash; record.",
        ],
        pitfalls: [
          "Zero-conf payout = double-spend risk; confirmation count is policy, not negotiable.",
          "Low mempool fee → stuck tx. Have a policy line (wait? RBF guidance? send back?).",
          "They must scan YOUR QR — not reuse an old address of their own. Verify.",
        ],
      }),
    },
    {
      pin: "cash",
      tag: "BTC → Cash · customer pinned cash out",
      templates: [
        "I need exactly {amt} in my hand. How much do I send?",
        "Gotta walk out with {amt} — how much BTC?",
        "Can you do {amt}? I'll send whatever it takes.",
        "Need {amt} cash. What's that in bitcoin?",
        "{amt} out the door. How much do I send over?",
      ],
      handling: (amt) => ({
        clarify: [
          `Confirm ${amt} exact, not "about".`,
          `Rounding: round BTC up so they're guaranteed ≥ ${amt}, or use a clean BTC amount and accept a few dollars over/under — decide with them.`,
        ],
        math: `BTC_in = ${amt} ÷ BID   (round to the satoshi per shop policy)`,
        procedure: [
          "Quote the BTC amount with the cash payout side by side.",
          "Generate a deposit address; show the QR; they send EXACTLY the quoted BTC.",
          "Wait for confirmations per shop policy.",
          `Pay out ${amt}; record.`,
        ],
        pitfalls: [
          "They may eyeball it and send approximate BTC. Under → top-up or partial refund; over → refund the overage. Have a policy.",
          "Denomination mix: check the till can make the payout before quoting.",
        ],
      }),
    },
  ];

  const STRUCTURING = {
    tag: "Red flag · structuring (smurfing)",
    variants: [
      {
        label: "Variant · serial same-day visits",
        templates: [
          "I'll do {amt} now and come back a few more times today — keeps it under the limit, right?",
          "Can we keep each one under a grand so there's no ID?",
          "I'd rather do a few smaller ones through the day than one big buy.",
        ],
      },
      {
        label: "Variant · split on the spot",
        templates: [
          "Let's just run it as a few separate {amt} tickets instead of one big one.",
          "No paperwork if we break it up under the limits, yeah?",
          "Can you split this into chunks under a thousand?",
        ],
      },
      {
        label: "Variant · proxy / smurf ring",
        templates: [
          "My buddy'll do {amt}, then I'll do {amt}, then my cousin.",
          "If a few of us each stay under a grand, no ID needed, right?",
          "I've got some friends with me — we'll each do a small one.",
        ],
      },
    ],
    handling: {
      clarify: [
        "Recognize the pattern: ticket sizes deliberately under the $1k ID line and the total kept under the $10k report line. The pattern itself is the signal.",
        "Do NOT coach them on staying under thresholds, and do NOT split a ticket to accommodate the request.",
      ],
      math: null,
      procedure: [
        "Same person, same type of transaction within 24 hours aggregates into a single large-transaction report once the total hits $10k — splitting doesn't avoid it.",
        "The $1k ID requirement applies per transaction; chopping under it is the red flag, not a workaround.",
        "Require ID per shop policy. If they refuse or walk away, the attempt is itself documentable and reportable.",
        "Document the interaction and escalate to the shop's compliance officer.",
        "File a Suspicious Transaction Report if there are reasonable grounds — STRs have no dollar minimum and cover attempted transactions.",
      ],
      pitfalls: [
        "\"Sure, let's just do a few smaller ones\" = facilitating structuring = a compliance violation, with personal liability.",
        "A smurf ring (friends each doing sub-$1k 'on behalf of' one person) still aggregates — same red flag, don't be fooled by separate faces.",
        "Tipping off is prohibited: don't tell the customer a report is being or will be filed. Stay neutral and professional.",
      ],
    },
  };

  function genTrade(tierSel) {
    const tier = tierSel && tierSel !== "any"
      ? TIERS.find((t) => t.id === Number(tierSel)) || pick(TIERS)
      : pick(TIERS);
    const conv = pick(CONVERSIONS);
    const amtNum = conv.pin === "cash" ? pick(tier.cash) : pick(tier.btc);
    const spoken = conv.pin === "cash" ? spokenCash(amtNum) : spokenBtc(amtNum);
    const canon = conv.pin === "cash" ? canonCash(amtNum) : canonBtc(amtNum);
    const h = conv.handling(canon);
    return {
      category: "trade",
      tag: conv.tag,
      line: fill(pick(conv.templates), spoken),
      context: tier.label,
      clarify: h.clarify,
      math: h.math,
      procedure: h.procedure,
      pitfalls: h.pitfalls,
    };
  }

  function genRedflag() {
    const v = pick(STRUCTURING.variants);
    const small = canonCash(pick([800, 850, 900, 950]));
    const h = STRUCTURING.handling;
    return {
      category: "redflag",
      tag: STRUCTURING.tag,
      line: fill(pick(v.templates), small),
      context: v.label,
      clarify: h.clarify,
      math: h.math,
      procedure: h.procedure,
      pitfalls: h.pitfalls,
    };
  }

  // opts: { categories: ["trade","redflag"], tier: "any"|1|2|3|4 }
  function generate(opts) {
    opts = opts || {};
    const cats = opts.categories && opts.categories.length
      ? opts.categories : ["trade"];
    return pick(cats) === "redflag" ? genRedflag() : genTrade(opts.tier);
  }

  window.TCSDrills = { generate, TIERS };
})();
