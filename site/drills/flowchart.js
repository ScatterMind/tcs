/* Mermaid flowchart for trade-mechanics decision flow.
 * Kept as a string here so it's the single source of truth alongside
 * scenarios.js. If a branch changes in the scenarios, mirror it here. */

(function () {
  const diagram = `flowchart TD
  Start([Customer arrives]) --> Greet[Greet · ask intent]
  Greet --> Dir{Direction?}

  Dir -->|Cash to BTC| C2B
  Dir -->|BTC to Cash| B2C
  Dir -->|Unclear / reversed terms| Restate[Restate direction in plain terms]
  Restate --> Dir

  C2B[Cash to BTC] --> Wallet{Wallet ready?}
  Wallet -->|No| WalletSetup[Hand setup printout · customer sets up themselves · hands off their device]
  WalletSetup --> Wallet
  Wallet -->|Yes| C2BPin{Customer pinned which side?}

  C2BPin -->|Cash amount| MathC2BCash["BTC_out = cash / ASK"]
  C2BPin -->|BTC amount| MathC2BBTC["cash_in = BTC × ASK"]
  C2BPin -->|Approximate| Pin[Clarify · pin one side · restate exactly]
  Pin --> C2BPin

  MathC2BCash --> AddrVerify[Verify receive address aloud · customer confirms]
  MathC2BBTC --> AddrVerify
  AddrVerify --> CountCash[Count cash · verify quality]
  CountCash --> Quote1[Pull live MID · compute ASK · quote out loud]
  Quote1 --> Accept1{Customer accepts?}
  Accept1 -->|No| End1([End / re-quote])
  Accept1 -->|Yes| Send[Send BTC · show txid]
  Send --> Record1[Record transaction per shop record-keeping policy]
  Record1 --> Done1([Done])

  B2C[BTC to Cash] --> B2CPin{Customer pinned which side?}
  B2CPin -->|BTC amount| MathB2CBTC["cash_out = BTC × BID"]
  B2CPin -->|Cash amount| MathB2CCash["BTC_in = cash / BID"]
  B2CPin -->|Approximate| Pin2[Clarify · pin one side · restate exactly]
  Pin2 --> B2CPin

  MathB2CBTC --> GenAddr[Generate fresh operator deposit address]
  MathB2CCash --> GenAddr
  GenAddr --> ShowQR[Show QR · customer scans · verify they have your address]
  ShowQR --> Quote2[Pull live MID · compute BID · quote out loud]
  Quote2 --> Accept2{Customer accepts?}
  Accept2 -->|No| End2([End / re-quote])
  Accept2 -->|Yes| Broadcast[Customer broadcasts send]
  Broadcast --> Wait[Wait for confirmations per shop policy]
  Wait --> Payout[Count and pay out cash]
  Payout --> Record2[Record transaction per shop record-keeping policy]
  Record2 --> Done2([Done])

  classDef edgeNote fill:#fff3cd,stroke:#856404,color:#856404;
  Edge1["Stale quote? Recompute. Do not honor expired quotes ad-hoc."]:::edgeNote
  Edge2["Price moved mid-trade? Within shop tolerance honor. Outside re-quote."]:::edgeNote
  Edge3["Mid-vs-ask pushback? Show spread up front · do not hide it."]:::edgeNote
  Quote1 -.- Edge1
  Quote1 -.- Edge2
  Quote1 -.- Edge3
  Quote2 -.- Edge1
  Quote2 -.- Edge2
  Quote2 -.- Edge3

  classDef warn fill:#f8d7da,stroke:#721c24,color:#721c24;
  WalletSetup:::warn
  AddrVerify:::warn
  Wait:::warn
`;

  window.TCSFlowchart = { diagram };
})();
