# audit:codex-reruns

**Workflow:** P1b Claude self-audit (run 6)  
**Phase:** Read  
**Model:** Claude Opus 5 (1M context), `claude-opus-5[1m]`  
**Agent id:** `a7a1f4f005e433869`  
**Tool calls:** 22 total — 0 web searches, 0 pages fetched  
**Raw transcript:** `raw/agent-a7a1f4f005e433869.jsonl` (full tool-call trace, retained)

---

## Prompt, exactly as issued

```text
YOU ARE AUDITING OUR OWN WORK, and you are looking for BAD ARGUMENTS, not bad facts.

The facts have already been checked mechanically and they passed: 149 file:line references
resolve, no line number runs past the end of its file, and the git claims were verified against
the repository. Do NOT spend your time re-checking those.

Hunt for these instead:

1. **Conclusions that do not follow from their evidence.** A number quoted, then a claim made that
   the number does not support.
2. **Confident assertions resting on a weak source.** This is the failure mode that has already
   burned us once: a rival's App Store screenshot looked like proof and turned out to be a Sketch
   mockup with "9:41 AM" in the status bar. Find the equivalents — where does this document treat
   a claim as settled when the underlying artifact only shows that someone asserted it?
3. **Estimates presented as measurements.** Hour figures, percentages and rates that were invented
   by a language model and are now being quoted as if derived. Say which ones have a stated basis
   and which are vibes with a decimal point.
4. **Internal contradictions** within the file.
5. **Staleness** against the ESTABLISHED list below.
6. **Things a marker would challenge first**, and whether the document already has an answer.
7. **Load-bearing recommendations nobody could act on** — advice too vague to execute, or that
   assumes a capability the team has not demonstrated.

Be specific: quote the sentence, give the heading it sits under, and say what is wrong in one
sentence. Rank by how much damage it would do if a marker found it before we did.

If a file is sound, say so and name the two strongest things in it. A clean audit is a real
result — but an audit that finds nothing in ten thousand words of model-generated prose is
usually an audit that did not read.

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

YOUR ASSIGNMENT: audit these files, in full, from the repository:
  p1b/result/claude/15-codex-prompt-reruns.md

Read them with Bash (cat / sed -n). They are long; read all of them, not the first screen.

Specific to your assignment: This is the biggest file and the least reviewed. It contains P13, P17, P19 and P20 rerun on Claude. P17 is where our gap got refuted, so its evidence matters enormously — audit the RecipeFix finding the way we audited the Cooklist one: what is the artifact, and does it show what the document says it shows? P20 scores features 0-3 on seven axes; check whether the scores are justified per-axis or backfilled to reach a preferred conclusion.

You may check things in the repository itself (Bash: grep, sed, cat) where a document's argument
depends on the code. Do not do web research; that has been done to death and is not where the
remaining risk is.
```

## Response

- **files audited:**
  - /Users/andy/Library/Mobile Documents/com~apple~CloudDocs/Work/1151/CSC510/Epicourier-Web/p1b/result/claude/15-codex-prompt-reruns.md
- **findings:**
  - _item 1_
    - **file:** p1b/result/claude/15-codex-prompt-reruns.md
    - **heading:** P20 §5 THE ONE-MONTH VERTICAL SLICE, WITH THE ESTIMATE
    - **quoted sentence:** **TOTAL** | **142.25 / 160 — 17.75 h slack**
    - **what is wrong:** The same file's P19 §6 declares SR-1..SR-10 binding "regardless of the DEAD verdict" and prices them at "Total ≈ 40 h, one quarter of the 160", but the final plan funds only one 7 h "Safety" line, so the document's own mandatory work pushes the total to roughly 175 h and the advertised 17.75 h slack is negative.
    - **category:** INTERNAL_CONTRADICTION
    - **severity:** HIGH
    - **suggested fix:** Either fold the SR rules into the §5 table and re-derive the total (it will not fit — then cut F5's executed-suite hours or the 20 h report line), or state explicitly in §5 that P19's SR set is descoped to SR-EXP-1 plus a disclaimer, and say which SR rules are deliberately not shipping.
  - _item 2_
    - **file:** p1b/result/claude/15-codex-prompt-reruns.md
    - **heading:** P17 WHAT I'D CHANGE IN THE PLAN, item 2
    - **quoted sentence:** "No black-box AI" is a live, paying-customer-validated positioning statement in this exact category.
    - **what is wrong:** Nothing in the document establishes a single paying customer for RecipeFix — the only artifacts are the vendor's own App Store description and the vendor's own marketing site, and the iTunes payload the run already fetched carries `userRatingCount` and `averageUserRating` which are never quoted.
    - **category:** WEAK_SOURCE_TREATED_AS_SETTLED
    - **severity:** HIGH
    - **suggested fix:** Replace with "a live listing that markets against black-box AI"; report RecipeFix's rating count and review count from the iTunes payload, and if they are near zero say so — a slide built on an unrated months-old app is the Cooklist-mockup failure repeated.
  - _item 3_
    - **file:** p1b/result/claude/15-codex-prompt-reruns.md
    - **heading:** P17 STRONGEST REFUTATION FIRST
    - **quoted sentence:** And a real rendered rationale from recipefix.app (Vegan Chicken Tacos):
    - **what is wrong:** A sample recipe page on the vendor's own marketing site is vendor-authored collateral, not a capture of the shipped app, so calling it "a real rendered rationale" asserts the app produced it when the artifact only shows the vendor published the text — exactly the "9:41 AM" class of error.
    - **category:** WEAK_SOURCE_TREATED_AS_SETTLED
    - **severity:** HIGH
    - **suggested fix:** Downgrade to "an example rationale published on recipefix.app"; note that P17 row 22 found RecipeFix had 2 review-RSS entries and read them, since they are the only non-vendor artifact available for this app.
  - _item 4_
    - **file:** p1b/result/claude/15-codex-prompt-reruns.md
    - **heading:** P20 §6 SUCCESS METRIC, item 1
    - **quoted sentence:** Baseline today: **0 % — no validation code exists** (`grep` returns nothing in a 245-line file).
    - **what is wrong:** Absence of validation code does not make the groundedness rate 0 % — Gemini may well name real inventory rows most of the time — and P19 §6 of this same file explicitly forbids this move ("Do not assume the figure; measure it"), so the primary success metric's baseline is both a non-sequitur and a self-contradiction.
    - **category:** DOES_NOT_FOLLOW
    - **severity:** HIGH
    - **suggested fix:** State the baseline as "unmeasured — no validation code exists, so the current rate is unknown" and make measuring it the first week-1 task; 2 h buys a real number and a real before/after.
  - _item 5_
    - **file:** p1b/result/claude/15-codex-prompt-reruns.md
    - **heading:** P13 Recommendations inside the 160-hour budget, item 2
    - **quoted sentence:** **The confirm gate nobody else has — ~35 h.**
    - **what is wrong:** P13's own table three rows above shows Grocy ("Uncheck ingredients to not put them on the shopping list" + "Are you sure you want to put all missing ingredients..."), Paprika ("check/uncheck ingredients before they are added"), Tandoor and Mealie all shipping exactly this gate, and P13's own "narrowest surviving gap" sentence concedes "Grocy has the arithmetic and the confirm".
    - **category:** INTERNAL_CONTRADICTION
    - **severity:** HIGH
    - **suggested fix:** Rewrite as "the confirm gate Eat This Much and Cooklist lack" and drop the differentiation framing entirely — four products in your own table ship it.
  - _item 6_
    - **file:** p1b/result/claude/15-codex-prompt-reruns.md
    - **heading:** P13 Recommendations inside the 160-hour budget
    - **quoted sentence:** **Quantity-aware subtraction + unit normalisation engine — ~55 h.**
    - **what is wrong:** P13 allocates 55+35+25 = 115 h of feature build (against the established ~100 h feature capacity) to F3 — the exact feature P20 §2 of this same file scores differentiation 0, saturation −3 and places in "NOT IN SCOPE" — and its residual "~45 h left for tests, traceability and the write-up" has no poster or demo line at all.
    - **category:** INTERNAL_CONTRADICTION
    - **severity:** HIGH
    - **suggested fix:** Mark P13's recommendation block as superseded by P20 §2 with a one-line pointer, or delete it; leaving two mutually exclusive 160 h plans in one file hands a marker the contradiction for free.
  - _item 7_
    - **file:** p1b/result/claude/15-codex-prompt-reruns.md
    - **heading:** P20 §1 SCORES — Rationale, every cell — F4
    - **quoted sentence:** and as of §0.1, **Use It Up already ships our entire F4 chain plus our F1 rationale** — WHOOP recovery → ranked deck → "why this dish" → weekly plan → grocery list, since July 4.
    - **what is wrong:** F4 is defined as "training-day *target* → explained meal → list", i.e. an energy/macro target derived from training, and the quoted v1.0.5 release note contains no calorie, macro or target language at all — it says a deck is "ranked for how you've recovered and trained today", which is ranking, not a nutrition target.
    - **category:** DOES_NOT_FOLLOW
    - **severity:** HIGH
    - **suggested fix:** Cut to "Use It Up connects a training signal to recipe ranking; whether it derives a calorie target is unknown" — the −3 saturation is already carried by Eat This Much and Prospre and does not need this.
  - _item 8_
    - **file:** p1b/result/claude/15-codex-prompt-reruns.md
    - **heading:** P20 §0.1 MARKET: the wedge is being colonised right now, by one person, since July
    - **quoted sentence:** That is a live app holding a pantry inventory with expiry dates, ranking worst-expiring-first, shipping a per-recommendation "why this dish" card, connecting a training signal, and emitting a grocery list. **It contains F1, F3 and F4 in one binary, shipped nine weeks ago.**
    - **what is wrong:** The entire artifact is a solo developer's own App Store description and release notes for a v1.0.8 app — an assertion that features exist, not evidence that they work — yet it is used unhedged to cut F1's differentiation from 3 to 2 and to declare G1 "wounded".
    - **category:** WEAK_SOURCE_TREATED_AS_SETTLED
    - **severity:** HIGH
    - **suggested fix:** Write "its listing and release notes claim F1, F3 and F4", and report its rating count; a one-person v1.0.8 app with no reviews is weaker evidence than the Cooklist reviews the team already treats as the confirmation bar.
  - _item 9_
    - **file:** p1b/result/claude/15-codex-prompt-reruns.md
    - **heading:** P20 §8 EVIDENCE STILL MISSING, item 1
    - **quoted sentence:** No `sellerUrl` exists in the iTunes payload, so no remote instrument can answer it.
    - **what is wrong:** False: the iTunes lookup payload the run already fetched returns `screenshotUrls` and `ipadScreenshotUrls`, and App Store policy requires a privacy-policy URL — the "single decisive unknown" had at least two cheap remote instruments that were never tried before it was routed to "one person, one iPhone".
    - **category:** UNACTIONABLE
    - **severity:** HIGH
    - **suggested fix:** Fetch and read Use It Up's screenshots from the lookup payload before the report goes out (noting screenshots are vendor-produced and may be mockups), and reword item 1 to "remote instruments are weak here" rather than "none exist".
  - _item 10_
    - **file:** p1b/result/claude/15-codex-prompt-reruns.md
    - **heading:** P17 VERDICT: GAP SURVIVES, BUT MUST BE RE-SCOPED
    - **quoted sentence:** Zero apps anywhere in the corpus contain a rationale sentence naming an item and a date.
    - **what is wrong:** The corpus is App Store listing *descriptions*, not app behaviour, and P20 §0.1 of this same file demolishes exactly that inference — "P17 scored this a weak refutation because its regex scanned only the description" — so the strongest FACT in P17 is a proof-of-absence the document itself later shows the instrument cannot deliver.
    - **category:** INTERNAL_CONTRADICTION
    - **severity:** HIGH
    - **suggested fix:** Reword to "zero apps *advertise* a rationale sentence naming an item and a date in their listing description" and repeat the caveat on rows 3, 5 and 8, which carry "confirms, strongly / high" on the same instrument.
  - _item 11_
    - **file:** p1b/result/claude/15-codex-prompt-reruns.md
    - **heading:** P19 §5 The rule the team has not thought about (SR-EXP)
    - **quoted sentence:** **FACT — the product currently does exactly the opposite, by design, with only a soft prompt string standing in the way.**
    - **what is wrong:** P20 §0.3 of this same file grades the identical claim about UC17 as "**OVERSTATED**" and narrows it correctly, and the prompt at :152-157 in fact directs the model to prioritise ⚠️/⏰ items and never defines `expiring_ingredients_used` as including ❌ EXPIRED ones — so "by design" is an inference about possible model behaviour labelled FACT, with no observed instance.
    - **category:** INTERNAL_CONTRADICTION
    - **severity:** HIGH
    - **suggested fix:** Restate as P20 did: expired rows are injected at :89, the only guard is prose, and nothing post-parse prevents an expired item surfacing in the amber badge — an unenforced path, not an intended one. Then run it once and paste the actual output if you want the FACT label.
  - _item 12_
    - **file:** p1b/result/claude/15-codex-prompt-reruns.md
    - **heading:** P20 §1 SCORES — Rationale, every cell — F1
    - **quoted sentence:** *Demand 2:* three vendors pay to say it — RecipeFix's listing, which I re-fetched today, leads with "**No black-box AI...**"; ATK has sold "Why This Recipe Works" for decades; Use It Up added "'why this dish' on every card". Not 3: zero direct user voice.
    - **what is wrong:** All three items are supply-side marketing copy scored on a *user-demand* axis, and F5 is scored 1 on the same axis for "no user asks for this" — so vendor copy is worth a full point over nobody-asking, which is backfill, and it is stale against the later 851-entry Reddit sweep that returned zero demand-side hits.
    - **category:** MARKER_WILL_CHALLENGE
    - **severity:** HIGH
    - **suggested fix:** Score F1 demand 1 with the note "supply-side signal only; 851-entry Reddit sweep returned zero explainability hits", recompute NET to +8, and state plainly that the ruling is not driven by the NET column.
  - _item 13_
    - **file:** p1b/result/claude/15-codex-prompt-reruns.md
    - **heading:** P20 §1 SCORES — Rationale, every cell — F1
    - **quoted sentence:** Grocy ships the auditable ranking — I re-verified verbatim today: `msgid "The higher this number is, the more ingredients currently in stock are due soon, overdue or already expired"`
    - **what is wrong:** Later runs established that Grocy shows a bare integer and does not even sort by the due score, and the quoted msgid is a tooltip describing what a number means — it shows neither a ranking nor an audit trail, so "ships the auditable ranking" is not supported by the artifact quoted immediately after it.
    - **category:** STALE
    - **severity:** HIGH
    - **suggested fix:** Rewrite as "Grocy publishes a due-score formula and shows the integer, but does not rank by it"; this strengthens the wedge rather than weakening it and keeps the −2 saturation defensible.
  - _item 14_
    - **file:** p1b/result/claude/15-codex-prompt-reruns.md
    - **heading:** P20 §5 THE ONE-MONTH VERTICAL SLICE, WITH THE ESTIMATE
    - **quoted sentence:** Implementation is **64.25 h**, well under the 110 h ceiling, and **75.75 h** remains for testing and delivery, above the 50 h floor.
    - **what is wrong:** The arithmetic is wrong — 142.25 − 64.25 = 78 h remains for testing and delivery, not 75.75 (that figure is 160 − 84.25, which already excludes the 20 h of testing the sentence claims it covers) — and neither the "110 h ceiling" nor the "50 h floor" is sourced anywhere in the file, while the established feature capacity is ~100 h.
    - **category:** INTERNAL_CONTRADICTION
    - **severity:** MEDIUM
    - **suggested fix:** Fix to 78 h and cite where the ceiling and floor come from (milestone file), or drop both bounds and compare directly against the ~100 h feature capacity and the 94.75 h NOW plan.
  - _item 15_
    - **file:** p1b/result/claude/15-codex-prompt-reruns.md
    - **heading:** P19 §4 Hard safety rules — SR-6
    - **quoted sentence:** assert the mocked model client recorded **zero** calls, and assert the body byte-matches a constant in a `REFUSAL_COPY` module.
    - **what is wrong:** SR-6/SR-7 require detecting disordered-eating indicators, pregnancy, minors, named medical conditions, drug dosing and fasting requests in free text *before* any model call — i.e. a non-LLM classifier the team has never built — and it is budgeted inside "SR-4 through SR-8 ... roughly 14–18 h" shared with four other rules.
    - **category:** UNACTIONABLE
    - **severity:** MEDIUM
    - **suggested fix:** Scope SR-6 to an explicit keyword/regex list committed in the repo, state its known false-negative rate is high, and say that the real control is SR-5's output validator plus the disclaimer — otherwise a marker asks how four students built a clinical-content classifier in a shared 16 h.
  - _item 16_
    - **file:** p1b/result/claude/15-codex-prompt-reruns.md
    - **heading:** P19 §4 Hard safety rules — SR-2
    - **quoted sentence:** *The team sources the number; this report does not prescribe one.*
    - **what is wrong:** The load-bearing constant of the load-bearing safety rule is left unspecified, so `test_calorie_goal_below_floor_is_refused_not_clamped` cannot be written until someone performs clinical sourcing the team is not qualified to do, and the NHS anchor offered ("under 800 or 1200 calories") is itself two numbers, not one.
    - **category:** UNACTIONABLE
    - **severity:** MEDIUM
    - **suggested fix:** Pick 1200 kcal with the NHS URL and retrieval date in the SOURCE comment and say it is a conservative product-safety threshold, not a clinical recommendation — a named defensible number beats an unnamed perfect one.
  - _item 17_
    - **file:** p1b/result/claude/15-codex-prompt-reruns.md
    - **heading:** P20 §8 EVIDENCE STILL MISSING, item 3
    - **quoted sentence:** Finding #3 rests entirely on third parties and must be labelled as such in the report until a human opens a browser.
    - **what is wrong:** Samsung Food+ has since been made first-party via a Wayback capture ($6.99/mo, $59.99/yr, every Food+ feature marked "Exclusively on mobile app"), so this is stale and it directs the team to spend effort on a question already answered — and the mobile-only finding is materially useful because Epicourier is a web app.
    - **category:** STALE
    - **severity:** MEDIUM
    - **suggested fix:** Replace items 3 with the Wayback finding, and add a method note that web.archive.org was the instrument three sessions of 403s never tried.
  - _item 18_
    - **file:** p1b/result/claude/15-codex-prompt-reruns.md
    - **heading:** P20 §0.2 CODE: our recommender already shows a rationale, and validates none of it
    - **quoted sentence:** `grep -n "validate\|verify\|check"` returns **zero hits**.
    - **what is wrong:** A case-sensitive grep is being used as proof of absence in a document whose own F5 case is that "most P1a security tests are source-text greps, not executed attacks" — case-insensitively the file hits `# Validate and return` at :238, and `RecommendedRecipe(**rec)` is genuine Pydantic schema validation; what is actually missing is *grounding* validation against inventory rows.
    - **category:** DOES_NOT_FOLLOW
    - **severity:** MEDIUM
    - **suggested fix:** State it precisely: "the parsed object is schema-validated by Pydantic at :239-243, but no code compares `expiring_ingredients_used` or `ingredients_available` against the `user_inventory` rows that were sent in" — that is the true and stronger claim.
  - _item 19_
    - **file:** p1b/result/claude/15-codex-prompt-reruns.md
    - **heading:** P17 RESULTS TABLE, rows 13–14
    - **quoted sentence:** **refutes (serious)** | med
    - **what is wrong:** Row 14 grades a "refutes (serious)" at medium confidence on mealthinker.com — the same self-serving competitor blog that row 13 correctly flags "**low — competitor's own blog, self-serving**" — and its other source is a "search summary", i.e. a page that was never fetched.
    - **category:** INTERNAL_CONTRADICTION
    - **severity:** MEDIUM
    - **suggested fix:** Downgrade row 14 to low with the same self-serving note, and mark the search-summary half as unretrieved; a serious refutation cannot rest on a rival's marketing blog.
  - _item 20_
    - **file:** p1b/result/claude/15-codex-prompt-reruns.md
    - **heading:** P17 RESULTS TABLE, row 3
    - **quoted sentence:** **15 apps** (Use It Up, Sously, Trepo, Silo Kitchen, PantryOK, Fresh, PicMeal, Real Plans, Chef AI…). **0 of the 15** contain any explanation-of-recommendation language | (list on request)
    - **what is wrong:** The evidence column for a row graded "confirms, strongly / high" is "(list on request)" — the artifact is not produced — and rows 4 and 5, also graded high, carry "—" as their URL; an unproduced list is an assertion, not a citation.
    - **category:** WEAK_SOURCE_TREATED_AS_SETTLED
    - **severity:** MEDIUM
    - **suggested fix:** Paste the 15 app ids and the regex used into an appendix, or drop the confidence to medium; this is the single cheapest fix in the file and it protects the corpus claims that the whole of P17's "confirms" side rests on.
  - _item 21_
    - **file:** p1b/result/claude/15-codex-prompt-reruns.md
    - **heading:** P13 Table / Verdicts
    - **quoted sentence:** **DIRECT:** Tandoor Recipes, Mealie, Cooklist
    - **what is wrong:** Step 2 of the workflow under test is "compute ingredients **and subtract pantry stock**", and Tandoor and Mealie are recorded in the same table as boolean on-hand flags with "no quantity subtraction" — so they fail the defined step yet are labelled "fully supported? YES" and DIRECT, and P20 §1 then propagates "P13 found three DIRECT implementations" with the caveat gone.
    - **category:** INTERNAL_CONTRADICTION
    - **severity:** MEDIUM
    - **suggested fix:** Add a fourth verdict tier ("DIRECT-boolean") or move Tandoor and Mealie to PARTIAL; whichever you choose, carry the caveat into every downstream sentence that cites the count.
  - _item 22_
    - **file:** p1b/result/claude/15-codex-prompt-reruns.md
    - **heading:** P20 §3 TABLE-STAKES REQUIREMENT
    - **quoted sentence:** `shopping-lists/share/route.ts` is an unauthenticated write to a table with no RLS and no migration.
    - **what is wrong:** "Unauthenticated write" is asserted from source reading and never executed, and the document's own evidence (`grep -rn "shopping_list_shares" supabase/` returns nothing) implies the table may not exist, in which case the endpoint currently 500s rather than writing — the same grep-not-attack failure mode F5 exists to fix.
    - **category:** DOES_NOT_FOLLOW
    - **severity:** MEDIUM
    - **suggested fix:** Run the unauthenticated POST once against a local instance and record the actual status code; report it as "an unauthenticated insert path with no ownership check and no RLS behind it" and say whether the table exists in the deployed project.
  - _item 23_
    - **file:** p1b/result/claude/15-codex-prompt-reruns.md
    - **heading:** P20 §0.3 Corrections to the brief I was handed
    - **quoted sentence:** So after buying fresh spinach on top of old spinach, the single aggregate row carries the *later* date over *both* portions.
    - **what is wrong:** The code at :67 takes the *incoming* date whenever it is non-null, which is only the later date some of the time — a restock carrying an earlier date silently overwrites a later stored one, which is the opposite error and is not mentioned.
    - **category:** DOES_NOT_FOLLOW
    - **severity:** LOW
    - **suggested fix:** Say "the incoming date replaces the stored one whenever present, in either direction"; the `LEAST()` fix is still right and the argument for it gets stronger, not weaker.
  - _item 24_
    - **file:** p1b/result/claude/15-codex-prompt-reruns.md
    - **heading:** P20 §6 SUCCESS METRIC, item 5
    - **quoted sentence:** **Comprehension (the only affordable human evidence, 5 users, ~2 h):** shown one recommendation and asked "name the item and the date that caused this," ≥4/5 answer correctly.
    - **what is wrong:** The same document dismisses the nearest published trial for running "6 students for a month and found no change" as a reason F2 is untestable, then adopts n=5 with a ≥4/5 threshold as its own headline human metric — a threshold that cannot distinguish a legible rationale from chance.
    - **category:** MARKER_WILL_CHALLENGE
    - **severity:** MEDIUM
    - **suggested fix:** Keep the study but reframe it as a qualitative comprehension walkthrough with verbatim quotes and no numeric gate, and state that n=5 supports no inference — the honest framing is the one that survives a marker.
  - _item 25_
    - **file:** p1b/result/claude/15-codex-prompt-reruns.md
    - **heading:** P17 WHAT I'D CHANGE IN THE PLAN, item 4
    - **quoted sentence:** Grocy's due score (integer, auditable, ~4 h), a named-item + date rationale string (~12 h), RecipeFix-style natural-language correction (~20 h).
    - **what is wrong:** None of these four figures has a stated basis — no task decomposition, no comparable, no reference to the code paths — and the 20 h line budgets an LLM re-adaptation loop that P19's SR-4/SR-5 in the same file would forbid and P20's final plan never funds.
    - **category:** ESTIMATE_AS_MEASUREMENT
    - **severity:** MEDIUM
    - **suggested fix:** Delete P17 §4's numbers or mark them "first-pass guesses, superseded by P20 §5"; P20's table is the only estimate in the file with a per-task decomposition, so let it be the single source and drop the competing ones in P13 §Recommendations and P17 §4.
  - _item 26_
    - **file:** p1b/result/claude/15-codex-prompt-reruns.md
    - **heading:** P17 STRONGEST REFUTATION FIRST
    - **quoted sentence:** That is four of the six things our gap claims nobody ships.
    - **what is wrong:** The "six things" are never enumerated anywhere in this file, and the surviving gap as established elsewhere is a four-way conjunction (named item + actual expiry date + nutrient constraint + reason), so the fraction has an undefined denominator; the "macronutrient constraint" counted toward it is a keto/low-carb diet preset, which is a filter label, not a nutrient target.
    - **category:** DOES_NOT_FOLLOW
    - **severity:** MEDIUM
    - **suggested fix:** Enumerate the conjunction explicitly and score RecipeFix against it (it has the substitution and the reason; it has no inventory, no date, and a diet tag rather than a nutrient target — two of four, not four of six).
  - _item 27_
    - **file:** p1b/result/claude/15-codex-prompt-reruns.md
    - **heading:** P13 Table (Cooklist row) vs P19 §1a What I confirmed first-party
    - **quoted sentence:** cooklist.com now titles itself "Agentic Commerce for Grocery"
    - **what is wrong:** P13 builds its "consumer app de-prioritised" hypothesis on cooklist.com rendering "with no consumer feature copy", while P19 in the same file quotes consumer feature copy retrieved from cooklist.com/cooklist-app on the same day.
    - **category:** INTERNAL_CONTRADICTION
    - **severity:** LOW
    - **suggested fix:** Restrict the observation to the homepage, note that /cooklist-app still carries full consumer copy, and drop the "June-2026 last update" strand — a 2.5-month-old release is an ordinary cadence, not evidence of abandonment.
  - _item 28_
    - **file:** p1b/result/claude/15-codex-prompt-reruns.md
    - **heading:** P17 RESULTS TABLE, row 16
    - **quoted sentence:** **REAL and correctly cited.** "A Lay User Explainable Food Recommendation System...", submitted 10 Dec 2025.
    - **what is wrong:** An arXiv identifier of 2601.02374 encodes January 2026 as the submission month, which is inconsistent with the stated submission date of 10 Dec 2025 — one of the two is wrong and a marker who knows arXiv numbering will spot it in seconds.
    - **category:** INTERNAL_CONTRADICTION
    - **severity:** LOW
    - **suggested fix:** Re-check the identifier and date pair and correct whichever is wrong; the prior-art point is unaffected but the error undermines the "REAL and correctly cited" verdict it sits inside.
- **strongest things:**
  - P20 §0.3 'Corrections to the brief I was handed' — a five-row table that re-greps the team's own claims against the working tree and knocks down three of them (UC17 'actively recommends expired food' → OVERSTATED; the Plan to Eat 'Staples List' claim → NOT SUPPORTED, drop it; P13's own Tandoor/Mealie DIRECT verdicts → not reproduced). Adversarial discipline pointed at its own side, with the share-route and no-lots findings confirmed first-hand. Protect this table verbatim — it is the most credible thing in 648 lines.
  - P19 §5 SR-EXP, specifically the use-by/best-before collapse: `user_inventory` has one undifferentiated `expiration_date DATE` (verified at supabase/migrations/20251129030000_user_inventory.sql:19), so the system cannot know whether its own EXPIRED flag means unsafe or merely stale, and the paired observation that `format_inventory_with_expiration` annotates a NULL date not at all — 'Unknown is not fresh' — while web/src/utils/inventory/expiration.ts already has a correct 'unknown' state the backend throws away. This is genuinely new, correct against the schema, and nobody else in the evidence base found it.
  - P20 §7 KILL SIGNALS and §4 'What I am explicitly not claiming' — pre-committed retreat positions tied to named, checkable triggers (the Use It Up wedge kill; 'if anyone catches themselves writing lot, fall back to aggregate-row grounding'; 'if expired-item exclusion is not in code by week 3, remove dates from the rationale'). Backed by a real capability: Hypothesis 6.141.1 is a declared dev dependency in backend/pyproject.toml and already used in backend/tests/test_recommender.py, so the property-testing claim behind F1's testability-3 is one of the few capability assertions in the file that checks out.
- **overall:** Not a clean audit. The file is real work — every repo-dependent claim I spot-checked (inventory_recommender.py 245 lines and its prose-only expired guard at :157, the transfer merge at :67, share/route.ts's anon client with no auth.getUser and no shopping_list_shares migration, the UNIQUE (user_id, ingredient_id, location) constraint, the goals route's typeof/NaN-only validation, Hypothesis in pyproject.toml) is accurate, and §0.3 and SR-EXP are genuinely strong. But the argument layer has serious problems, and they cluster in exactly the place my assignment pointed.
  
  On the RecipeFix finding specifically: the artifact is the vendor's own App Store description plus an example recipe page on the vendor's own marketing site. That is a shipped binary plus marketing copy — it shows someone asserted the feature, not that the app does it. The document then escalates it twice: 'a real rendered rationale' (it is vendor collateral) and 'paying-customer-validated' (no rating count, review count, revenue or download figure appears anywhere, and the iTunes payload the run already fetched carries userRatingCount). It nominates that as 'the best slide you have'. This is the Cooklist/Sketch-mockup failure repeated, one bar lower — Cooklist was at least confirmed by real user reviews, RecipeFix by nothing. The same pattern governs the Use It Up finding in P20 §0.1, which is a solo developer's v1.0.8 release notes treated as proof that F1, F3 and F4 ship 'in one binary'.
  
  On P20's scoring: the arithmetic is correct in every row (I checked all five NETs and the stated −6…+15 range), and most cells carry a real per-axis justification. Two cells are backfilled. F1 user-demand 2 is scored entirely on vendor marketing copy while F5 gets 1 for 'no user asks for this' — vendor copy is worth a full point over nobody asking, on a demand axis, in a project where an 851-entry Reddit sweep returned zero. F4 user-demand 2 is justified by the word 'real' and nothing else. More structurally: the rubric picks F5 (+10), the ruling picks F1 (+9), and the document has to argue past its own table twice ('Why F1 over F3'; 'Why F1 over F5'). The arguments are decent, but a marker will ask what the rubric was for.
  
  The single most damaging item is budgetary, not evidential: P19 §6 prices its binding safety rules at ≈40 h and says they hold 'regardless of the DEAD verdict'; P20 §5 funds 7 h of them and prints '142.25 / 160 — 17.75 h slack'. Honour P19 and the plan is ~175 h. Add P13's competing 115 h recommendation for the feature P20 explicitly refuses, and the file contains three mutually incompatible budgets. Fix the budget contradiction and the RecipeFix/Use It Up provenance hedges first; those four edits cost an hour and remove most of the exposure.
