# cross-file-contradictions

**Workflow:** P1b Claude self-audit (run 6)  
**Phase:** Cross  
**Model:** Claude Opus 5 (1M context), `claude-opus-5[1m]`  
**Agent id:** `aa54602ac04a1a482`  
**Tool calls:** 34 total — 0 web searches, 0 pages fetched  
**Raw transcript:** `raw/agent-aa54602ac04a1a482.jsonl` (full tool-call trace, retained)

---

## Prompt, exactly as issued

```text
You are looking for ONE thing only: places where two files in this deliverable set CONTRADICT
each other. Not staleness inside one file — genuine disagreement between files that a marker
reading both would notice.

WHAT LATER RUNS ESTABLISHED. Anything in these files that contradicts the following is stale and
you should flag it:

- G2 (nothing measures waste outcomes) and G4 (nothing links a calorie target to groceries) are
  DEAD. Five shipping products measure outcomes; Eat This Much / Prospre / Cooklist cover G4.
- G1 has been narrowed TWICE. RecipeFix ships substitution reasoning ("No black-box AI"). Cooklist
  ships expiry reminders naming the item — CONFIRMED SHIPPING by real user reviews, though the
  famous "your parsley is 7 days old" artifact is a Sketch MOCKUP and every real Cooklist surface
  states an AGE plus a traffic light, not a date. Mealie renders "Substituting: {substitute} for
  {food}" in public shipped source. Remy prints "Using up before they expire: <item> · <qty>".
  Grocy publishes a due-score formula but shows a bare integer and does not even sort by it.
  WHAT SURVIVES is only the four-way conjunction: named item + actual expiry date + nutrient
  constraint + reason for the substitution, in one auditable correctable object.
- THE GAP HAS NO DEMAND-SIDE EVIDENCE. A sweep of 851 Reddit entries for eleven explainability
  phrasings returned ZERO hits in any meal/pantry/recipe context. We cannot claim anyone wants it.
- Samsung Food+ is now first-party via a Wayback capture: $6.99/mo or $59.99/yr, and every Food+
  feature that matters is "Exclusively on mobile app" — our product is a WEB app.
- Our headline P1a cross-user IDOR is probably a FALSE POSITIVE at system level
  (shopping_list_items has no user_id column; RLS enforces ownership via the parent list).
  The real defect under UC20 is that the transfer route never inspects affected row counts, so it
  reports success for writes that did not happen. The genuinely unmitigated hole is the share
  route, whose table shopping_list_shares has NO migration, NO RLS and NO policy in the repo.
- Most P1a "security tests" are source-text greps, not executed attacks.
- user_inventory upserts by (user_id, ingredient_id, location) and SUMS quantities: there are NO
  per-purchase lots. Any promise about "lots" is not representable.
- BUDGET: four graduate students, ~160 person-hours TOTAL, which must also cover report, poster
  and demo. The milestone file totals the NOW plan at 94.75 h against ~100 h of feature capacity;
  the cut list puts the irreducible core at 54.00 h.

THE FILES, all under p1b/result/claude/ — read them with Bash:
01-market-survey.md, 02-table-stakes-vs-differentiator.md, 02b-stakeholders.md,
03-engineering-evidence.md, 05-caught-errors.md, 06-disagreement-with-codex.md, 07-premortem.md,
08-three-futures.md, 09-pivot.md, 10-team-fit.md, 11-mission-statements.md, 11b-mission-final.md,
12-milestones.md, 13-name-the-test.md, 14-cut-list.md, 15-codex-prompt-reruns.md,
16-prompt-report.md, 17-gap-closing.md, README.md

Look especially for:
- **Hour estimates that disagree.** 12-milestones, 14-cut-list, 03-engineering-evidence and
  15-codex-prompt-reruns all cost the same work. Do their numbers agree? Build a table of every
  costed item and show where two files price the same thing differently.
- **The recommended direction.** 08-three-futures, 09-pivot, 15's P20, 11b-mission-final and
  12-milestones each pick something. Do they all pick the SAME thing? If 08 recommends BOLD and
  the mission ships SAFE, that is a contradiction a marker will find in seconds.
- **The defect list.** 03-engineering-evidence downgraded our headline IDOR; do 02b-stakeholders,
  07-premortem, 08-three-futures and 12-milestones still treat it as established?
- **What we claim about rivals.** Does any file still assert something runs 4 and 5 overturned?
- **The measurable claim.** 11b-mission-final, 13-name-the-test and 12-milestones each state it.
  Are the metric, threshold and baseline identical in all three, word for word in substance?

Output a table of contradictions: | # | Claim A (file, quote) | Claim B (file, quote) | Which is
right, or how to reconcile | Severity |

Then say plainly whether this set reads as one coherent document or as nineteen files by
nineteen authors.
```

## Response

## A. The hours table — every costed item, every file that prices it

Bold = the files disagree. `—` = that file does not cost the item.

| Costed item | 03-engineering-evidence | 08-three-futures | 09-pivot | 10-team-fit | 12-milestones | 13-name-the-test | 14-cut-list | 15 (P20) | 02 (UC21/22) |
|---|---|---|---|---|---|---|---|---|---|
| Share route: migration + RLS + `auth.getUser` + ownership + `expiryDays` bound | **8.75** (Blocker 1) | **9.0** (3 migration + 6 route) | 8.75 ("off the critical path") | 8.75 (in scope) | 8.75 (N5b) | — | 8.75 (Cut 1, **already fired**) | 8.75 (**week 1, before any UI**) | — |
| `quantity \|\| 1` rejection at the write | **1.5** (D6) | in a 6 h bundle | — | **1.5** | in N5a (10 h) | **4** (T9) | **3.0** (N5a1) | **1.5** | — |
| Transfer affected-row-count check (the real UC20 bug) | **3.5** (D4+D5) | in same 6 h bundle | 15 h "rowcount oracle" (generic) | **~2** | in N5a | **4** (T11) | **3.5** (Cut 6) | **3** | — |
| Restock merge → earliest expiry (`LEAST`) | not listed as a defect | — | — | — | in N5a | **3** (T10) | **3.5** (Cut 10) | **~1 h** ("one-line mitigation") | — |
| `Boolean("false")` / shopping-item quantity (D8, D9) | 2.0 | — | — | — | **absent from the plan** | — | **absent** | — | — |
| Pydantic bounds D12–D17 | 6.25 (all seven incl. D18) | — | — | — | absent | — | absent | — | — |
| Prompt-injection boundary (D18) | **2.5** | — | — | ~1.5 (reserve) | absent | — | absent | — | — |
| All 18 defects, competent fix + regression | 24.25 | — | 24.25 | 24.25 | 24.25 (B3) | — | — | — | — |
| Deterministic scorer / ranker | — | 24 (14 code + 10 test) | — | **30** (ranker + Pytest) | **24** (N2) | (inside 61 h test-build) | **24** | **16** (10 + 6) | — |
| Receipt UI + one-tap correction | — | 24 | — | **42** (28 + 14) | **22** (N3) | — | **22** | **12** | **≈28 total** for the whole UC |
| M0 harness / evaluation | — | 19 (tests) | — | — | **18** (N4) | **24** — "N4 is under-costed by 6 h" | **18** | 20 (unit + property) | — |
| Live Gemini baseline run | — | — | — | — | in N4 | **9** (F0) | **6.0** (Cut 2 + Cut 7) | — | — |
| Correctability measure | — | — | — | — | in N4 | **7** (T5) | **3.0** (Cut 8) | — | — |
| Executed attack suite (replaces greps) | — | 7 (5 + 2) | **35** | — | absent | in T8–T11 | absent | **8** | — |
| One-command environment | — | **12** | in the 15 h tax | in the 14 h integration | **12** (N1, incl. claim freeze + harness) | **3** (T12) | **6.0** (N1b) | in the 20 h coordination | — |
| Uncertainty-aware ranking / pre-plan verification | — | **~98** (BOLD) | — | "the trap" | **FANTASY** | — | — | not in scope (F2) | **≈16 h** (UC22) |
| **Fixed overhead (report/poster/demo/integration)** | — | **60** | **50** | **44** (30 + 14) | **60** | — | **60** | **58** | — |
| **Feature-and-test capacity** | — | **100** | **110** | **90.25** (+25.75 reserve) | **100** (plan 94.75) | 61 h of tests alone vs 74 h of milestones | **100** (core 54.00) | **84.25** (total 142.25/160) | — |

Internally, 12 and 14 reconcile to the digit (N1 12, N2 24, N3 22, N4 18, N5 18.75 = 94.75; cuts 40.75; core 54.00). Everything else disagrees.

## B. The contradictions

| # | Claim A (file, quote) | Claim B (file, quote) | Which is right / how to reconcile | Severity |
|---|---|---|---|---|
| 1 | **09-pivot**: "**Pivot — but pivot the form, not the subject** … stop treating Epicourier as the product to extend and start treating it as the labelled corpus for a tool we build, and **build Project Kind 1**" (an appsec CLI, no UI) | **08**: "**Build SAFE**"; **11b**: the receipt; **12**: "Direction: **THE RECEIPT**"; **14**, **10**, **15** all build inside Epicourier | 08/11b/12/14 are right — they are the D2/D3 deliverables. 09 must be reframed as "the option we priced and declined, and why", with an explicit closing line pointing at 12. As it stands, the pivot file's verdict paragraph reads as the team's decision. | **Critical** |
| 2 | **16-prompt-report**: "**P12 — The pivot question** \| Answered '**stay the course**', which is what the team would have done anyway." | **09-pivot** (which *is* P12): "**Pivot** … build Project Kind 1 … ask the instructor whether the rubric permits a non-product artifact" | 16 is describing a file that says the opposite. Either 09's verdict is rewritten to "stay", or 16's row is rewritten. This is the cheapest contradiction in the set for a marker to find — the report says what the file says, and the file says otherwise. | **Critical** |
| 3 | **11b-mission-final** (the print-ready version): "**Baseline** \| The same harness run against today's build, **on the same 500 cases**" | **12**: "the claim 'a baseline of 0/500 recorded by the same harness against today's build' **cannot be produced as written** … 10 pantries yield at most 100, not 500"; **14 Cut 2**: "The poster must STOP saying ~~'A baseline of 0/500'~~ → 'A baseline of **0/100**'"; **13 T13**: "the mission statement contains **2** unproducible numbers" | 12/13/14 are right (`num_recipes … le=10`). 11b — the one file labelled "the version to print" — still carries the number three other files were written to delete. Fix 11b to "0/100, archived once", and keep 500 only for the offline determinism corpus. | **Critical** |
| 4 | **11b**: "We will move the ranking out of the model into **a pure Python function**"; **10**: "Deterministic ranker + **Pytest** … in `backend/api/`"; **15**: "Deterministic scorer **in Python** … Hypothesis property tests" | **08**: "`web/src/utils/inventory/rankRecipes.ts` — pure"; **13**: every test is "Jest, `web/tests/p2/receipt-invariants.test.ts`"; **14 Cut 3**: "Ranking is computed by a pure module … **it currently runs in the client**" | Unresolved in the set. A Python function cannot be the module that "runs in the client", and the 61 h test plan in 13 is entirely Jest. Pick one runtime and rewrite the other three files' file paths; the TS version is the one with a costed test suite behind it. | **High** |
| 5 | **03**: "**The three defects that MUST be fixed before any new feature ships**" — Blocker 1 share route (8.75 h), Blocker 2 transfer row-count (3.5 h), Blocker 3 quantity/boolean (3.5 h); "**Nothing new should be built on transfer until** it scopes by `user_id` **and** asserts the affected-row count" | **14**: Cut 1 (share) "**Already fired, 2026-09-13** … not conditional and is not revisited"; Cut 6 (row-count) "Not fixed, priced at 3.5 h"; D8/D9 appear in no milestone at all. The 54 h core ships the receipt with **none** of the three blockers fully closed | Both cannot stand. Either 03 downgrades "MUST before any feature" to "must before *deploy*", or the cut list's core absorbs Blocker 2. Right now D3's own evidence file forbids the plan D3 proposes. | **Critical** |
| 6 | **15 (P20 §5)**: "Sequencing: **F5's share-route fix lands in week 1, before any F1 UI work**"; kill signal: "If the migration plus RLS exceeds 12 h … **freeze F1 UI work until it lands**"; **10**: "The three in-scope defects, and nothing else: **the share-route hole (8.75 h)** …" | **12**: "**Drop milestone N5b (share-route hardening, 8.75 h)** … that is the single most useful sentence in this document"; **14 Cut 1**: already cut; **09**: "do not put a skill with zero demonstrated commits on the critical path" | Four files fund it, two kill it, one gates the whole project on it. Pick: if 14's Cut 1 stands, 15's sequencing sentence and 10's budget row must be struck. | **High** |
| 7 | **15 §6.5**: "**Comprehension** (the only affordable human evidence, **5 users**, ~2 h): … '**≥4/5** answer correctly'"; **02 UC21 Budget**: "**5-user comprehension test: can 4/5 say which item drove the pick?**" | **11**: "A five-user comprehension test was **explicitly ruled out** as the measurable claim"; **13 U1**: "**UNTESTABLE — DELETE**"; **06 D7**: "Unfalsifiable theatre … a 4-of-5 threshold sits inside that noise band. **It is a coin flip wearing a lab coat**"; **12**: a user study is **FANTASY** | 11/13/06/12 are right and say so with citations (Nielsen: 20 users for metrics). 15 and 02 re-import the exact metric this column spent a whole disagreement killing. Strike it from both. | **High** |
| 8 | **06 D7** proposes instead: "**Run 10 participants, within-subject**, receipt vs no receipt … participants detect and correct **≥60%** of planted errors versus **≤20%** without" and concludes "**SAFE scope, BOLD-grade evaluation**"; **06 §3** adds two field measurements ("walk to the fridge", ingest yield) | **11b**: "Project 2's M0 evaluation tests this **offline with no human subjects**"; **13**: every human-subject row is deleted; **12**: user study = FANTASY | 11b/12/13 win on budget. But 06 is the file that *refuted* the metric and its replacement is never adopted or rejected anywhere — the disagreement register ends with a recommendation the plan silently ignores. Add one line to 12 or 13 saying the planted-error study is deferred to Project 3 and why. | **High** |
| 9 | **07-premortem §6, prevention #3**: "**Ship the ruler before the feature.** Add `inventory_events` (or `discarded_at` + `discard_reason`) and a one-tap '**threw this out**' control, and **start logging the baseline this week**" — 5 h, ranked "High" | **01 G2**: "**DEAD** … **No waste-reduction percentage goes on our poster**"; **11b**: "Not any reduction in food waste"; **12/14**: no such milestone exists | 01/11b/12 are right; G2 is dead twice over (five shipping rivals + PMC9482070). The pre-mortem's third-highest-value prevention buys an instrument for a claim the survey forbids. Replace #3 with N1's claim-freeze. | **High** |
| 10 | **17 §3**: Cooklist "**Verdict: `CONFIRMED_SHIPS`.** The notification is real, not marketing art" (three named user reviews + a vendor screen recording); **11b**: "Cooklist ships expiry reminders (**confirmed by real user reviews, not just its mockup**)" | **01 Amendment 2**: "a vendor artifact proves *the claim was made*, not that the feature ships … **install Cooklist**, trigger an expiration reminder, and screenshot the real behaviour"; **05 §3**: "downgraded from *kills* to **endangers, unverified**"; **16**: "**endangered, not settled**, the action item is to install the app"; **README**: same | 17 is the later run and is right — but the correction never propagated. 01, 05, 16 and README still print the pre-run-5 verdict and an action item ("install the app") that run 5 partly discharged. One sentence in each: *"Superseded by 17 §3: CONFIRMED_SHIPS; what an install still settles is whether any surface prints the date."* | **High** |
| 11 | **17 §1**: Samsung Food+ "What was third-party is now **first-party with a capture date**" — $6.99/mo, $59.99/yr, "Exclusively on mobile app"; **01**: "**CLOSED**" | **02 §3**: "every Samsung claim above rests on its support centre and third parties, **never on the vendor's own feature page**"; **15 §8.3**: "Finding #3 rests **entirely on third parties** and must be labelled as such in the report **until a human opens a browser**"; **08** verification note: "Could not verify this session … Samsung Food's behaviour" | 17 is right. 15's instruction to label the report is now a false instruction, and 02's "Fourth consequence" paragraph overstates a limitation that was closed the same day. Also nothing outside 17 uses the strongest fact it produced — Food+ is mobile-only and **we are a web app**. | **Medium-High** |
| 12 | **12 B5**: "**14 live products verified** by direct fetch on 2026-09-13 … **including one — 'Use It Up: Pantry Recipes'**, App Store id 6775112024" | **01**: the table of "**the fourteen confirmed live rivals**" does not contain Use It Up (AnyList, Eat This Much, Eatvora, KitchenPal, NoWaste, OH a potato!, PantryWise, Paprika, Plan to Eat, Prepear, Samsung Food, SideChef, SuperCook, Xpiry) | 01 defines the fourteen; Use It Up was found later, in 15's P20, and is a **fifteenth**. 12's sentence makes the survey's headline count wrong. Also: the product 15 calls the one "colonising the wedge" appears nowhere in the market-survey deliverable — add it to 01 as a dated late addition. | **High** |
| 13 | **16 §4**: "14 confirmed live + 4 confirmed dead, **from 54 deduplicated candidates**" | **05 §2**: "The market-survey workflow reported '54 candidate products deduplicated' … **True figures: 63 raw mentions → 48 distinct → 21 verified**"; **README**: "Verification reached **30 of 48**"; **02**: "**48 distinct candidates**" | 05 is right and says the correction was applied — but not to 16. Change 54 → 48. | **Medium** |
| 14 | **01 G3**: "Its replacement, **the Staples List**, is explicitly static and does **not** deduct from the shopping list" (cited to the Plan to Eat post-mortem page) | **15 P20 §0.3**: "**NOT SUPPORTED — drop it** … I re-fetched [the page] today and asked explicitly. **No mention of a Staples List anywhere on that page**"; and §8.5: "Re-source it or delete it" | 15 is the later first-hand fetch. 01 still carries it, and 05 records it as a *caught error* in Plan to Eat's favour, so the survey is citing as evidence a sentence its own rerun says is not on the page. Delete or re-source in 01. | **High** |
| 15 | **11b**: Grocy's expired term "deliberately set to zero, **because we will not rank food we have ourselves labelled expired into a meal**" | **10 §7**: "in the deterministic ranker, **exclude past-date items from scoring**, surface them in a separate check-these list … ~2 h"; **15 §6.3**: "**Zero expired items reachable by the rationale path**, enforced in code"; **12**: enforcement is **P1 under FUTURE / Project 3**; **13 U2**: the normative clause is "**UNTESTABLE — DELETE**" | Four different food-safety policies for the same line of code. Zero *points* is not exclusion — coverage still ranks an expired item — so 11b's justifying clause is not true of 11b's own mechanism. Decide: exclude in code (10/15) or score-at-zero (11b/13 T6), and make 11b's sentence match. | **High** |
| 16 | **13**: "Core M0 is F0+T1+T2+T5 = **24 h** against **N4's 18 h**, so **N4 is under-costed by 6 h** … the full 61 h of test-build sits inside N2+N3+N4+N5a (74 h combined), leaving 13 h for implementation — **that does not close**" | **12**: N4 = 18.0; "the NOW plan totals 94.75 h … it does **NOT** exceed the budget" | 13 is right and flags it honestly, but 12 was never updated, so the D3 milestone table a marker reads first still shows a plan that 13 proves does not close. Re-cost N4 to 24 and re-run the margin (it goes negative → N5b must go, which is what 12 and 14 already conclude for a weaker reason). | **High** |
| 17 | **02 UC22 Budget**: "**≈16 h** (one `last_confirmed_at` column, a deterministic decision-value heuristic … a three-question modal…)" | **12**: "Uncertainty-aware ranking … **FANTASY** — the schema forbids it"; **08 BOLD** prices the same capability at **~98 h** | 12 is right on the schema; 08 is right on the price. 02's 16 h is off by a factor of six and is the number a marker will quote back if UC22 is proposed. Re-cost or mark UC22 explicitly as FANTASY-per-D3. | **High** |
| 18 | **02 UC21 "Who wants it"**: "the **Cooklist reviewer (2023-07-09)** asking for 'an option to choose how closely your pantry meets the recipe requirements instead of random broad matches'" | **01 / 05 / 16**: that citation is **withdrawn** — "There is exactly one review dated 2023-07-09 … about autofill miscategorising cream cheese jalapeño"; **17 §2a / 11b / README**: "**our gap has no demand-side evidence**" | The withdrawn quote is still doing load-bearing work in a use-case deliverable. 02 flagged the *"Why nobody has built it"* cell as superseded but left the *"Who wants it"* cell untouched. This is the one contradiction that looks like the fabricated-citation problem 05 congratulates itself for catching. Delete the quote from 02. | **Critical** |
| 19 | **02b-stakeholders** (narrative, "The one the team will forget"): "**the IDOR in (a) exposes this person's food under someone else's user ID**, so if we ever have to send a breach notification we cannot name them" | **03**: "our headline cross-user IDOR is **probably a false positive at system level**"; 02b's own correction block at the foot corrects only the *two table rows*, not this paragraph | 03 is right. The correction note must also cover the closing narrative, or delete the clause — otherwise the file both asserts and retracts the same defect on one page. | **Medium-High** |
| 20 | **02b**: "`npm test -- --grep @p1a` returns **exactly 32 cases**" | **03 / 12**: our web work is **44 executions** (32 functional + 12 security) and **63 functions / 69 executions** overall | 03 is right; 02b's 32 silently drops our security suite, which is the half the whole report is built on. | **Low-Medium** |
| 21 | **15 §6.2**: determinism = "identical inventory + recipe set produces byte-identical ranking across **100 runs**"; §6.1 groundedness over "**≥200 generated inventories**", baseline **0%** | **11b / 12 / 13 / 14**: "**byte-identical across 20 shuffles**", 500 cells, baseline measured | Same claim, three different thresholds and two different metrics (groundedness vs receipt-sums). 15 predates the C6/C7 freeze; restate its §6 in 13's terms or mark it superseded. | **Medium** |
| 22 | **07-premortem §5**: "The IDOR is conditional and the condition was never checked — **nobody ever inspected whether RLS was enabled on `shopping_list_items`**" | **03 / 06 D9 / 15**: the UPDATE policy on `shopping_list_items` was read, quoted and cited by migration and line | The pre-mortem is dated forward and is fiction, but this sentence is a factual claim about what the team did, and it is now false. One footnote: "written before C3; the condition *was* checked." | **Low-Medium** |
| 23 | **08** verification note: "Could not verify this session … **Samsung Food's behaviour and any regulator's date-label guidance**"; 08 nowhere mentions Cooklist, Remy, Mealie, Use It Up or the Reddit null result | **17 / 01 / 05**: all of those were established the same day; the four-way conjunction and the zero-demand finding are the surviving claim | 08's three futures are argued against the *pre-run-4/5* market. SAFE survives on repository facts, so the recommendation stands — but BOLD's thesis ("nobody propagates uncertainty") and WILD's framing were never re-checked against runs 4–5. Add a dated header to 08 saying which evidence vintage it uses. | **Medium** |

## C. Does this read as one document?

No. It reads as **two coherent documents and a cloud of stragglers.**

There is a genuine spine, and it is good: `01 → 05 → 17` (market, corrections, closing the limitations) and `03 → 12 → 14 → 13` (defects, milestones, cuts, tests). Within each of those chains the numbers reconcile to the digit — 12 and 14 agree on all five milestones and on the 94.75 / 40.75 / 54.00 arithmetic, and 13 disagrees with 12 *deliberately and in writing*. That is one author being careful.

The problem is everything that sits between the chains. **09 recommends pivoting away from the product every other file is building, and 16 reports that it recommended the opposite.** The mission statement that is explicitly labelled "the version to print" still carries the 500-case baseline that two later files were written specifically to delete, and specifies a **Python** module while the entire 61-hour test plan is **Jest**. The engineering-evidence file declares three blockers that "MUST be fixed before any new feature ships", and the cut list ships the feature having cut two of them. The five-user comprehension test is killed in 06, 11 and 13 — and then reappears, unflagged, in 15 and 02. The withdrawn Cooklist review, which 05 holds up as the report's proudest self-catch, is still quoted as evidence of demand in 02.

The tell is directional: **every contradiction runs the same way — later runs corrected earlier ones, and the corrections were appended to the files that made them rather than pushed into the files that depend on them.** 17 closed Samsung and Cooklist; 01, 02, 05, 08, 15, 16 and README never heard. 13 re-costed N4; 12 never heard. That is fixable in about two hours: a single "superseded by" pass keyed to runs 4 and 5, plus a decision on four open forks (pivot or not, Python or TypeScript, share route in or out, expired-items excluded or scored-at-zero). Until that pass happens, a marker reading 09 next to 12, or 11b next to 14, finds the disagreement in under a minute — and items 1, 2, 3, 5 and 18 are the ones they will find first.
