# audit:tests-and-cuts

**Workflow:** P1b Claude self-audit (run 6)  
**Phase:** Read  
**Model:** Claude Opus 5 (1M context), `claude-opus-5[1m]`  
**Agent id:** `adc5890fc642c1d3f`  
**Tool calls:** 13 total — 0 web searches, 0 pages fetched  
**Raw transcript:** `raw/agent-adc5890fc642c1d3f.jsonl` (full tool-call trace, retained)

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
  p1b/result/claude/13-name-the-test.md
  p1b/result/claude/14-cut-list.md

Read them with Bash (cat / sed -n). They are long; read all of them, not the first screen.

Specific to your assignment: 13 defines the M0 evaluation our D2 measurable claim depends on — check that each threshold is actually decidable and each baseline is actually obtainable before the change. 14 orders the cuts with dated triggers: check the arithmetic (do the returned hours sum correctly?), check that each trigger is observable, and check that the "irreducible core" really is irreducible rather than just what the author liked.

You may check things in the repository itself (Bash: grep, sed, cat) where a document's argument
depends on the code. Do not do web research; that has been done to death and is not where the
remaining risk is.
```

## Response

- **findings:**
  - _item 1_
    - **file:** p1b/result/claude/14-cut-list.md
    - **heading:** CUT 7 — the live baseline, entirely / THE IRREDUCIBLE CORE (poster paragraph)
    - **quoted sentence:** `grep -c "validate\|verify\|check"` over the 245-line file returns **0**. No line of code anywhere recomputes or checks that number. We can state that as fact with a file, a line and a command a reader can re-run
    - **what is wrong:** The command returns 0 only because grep is case-sensitive: `grep -in` returns 1 hit, and it is line 238, a comment reading `# Validate and return`, sitting directly on the `RecipeRecommendedRecipe(**rec)` call that DOES run Pydantic validation on the model's output — so the one claim that survives all ten cuts and appears verbatim in the core poster paragraph (line 180, "zero validation calls in 245 lines") is falsified by the exact command the document invites a marker to re-run.
    - **category:** WEAK_SOURCE_TREATED_AS_SETTLED
    - **severity:** HIGH
    - **suggested fix:** Replace the grep with the demonstrable and strictly stronger claim: `match_score: int  # 0-100` at :50 carries its range only in a comment, while `num_recipes: int = Field(default=5, ge=1, le=10)` at :42 on the same model enforces its bounds — so the field the user sees is the one field the schema declines to constrain, and nothing recomputes it. Cite :42 and :50 side by side and drop the word "zero validation".
  - _item 2_
    - **file:** p1b/result/claude/13-name-the-test.md
    - **heading:** Budget reconciliation (three lines) — vs 14's BUDGET VERDICT
    - **quoted sentence:** The full 61 h of test-build sits inside N2+N3+N4+N5a (74 h combined), leaving 13 h for implementation in those milestones — that does not close
    - **what is wrong:** File 14's opening verdict, same run date and same model, asserts the opposite — "it fits inside the 100 h of feature capacity with 46.00 h to spare... nothing essential is at risk from the budget" — and 14's irreducible core allocates only 9 h (N4a+N4b) to tests that 13 prices at 17 h (F0+T1+T2), so the two documents reach contradictory budget verdicts and neither acknowledges the other.
    - **category:** INTERNAL_CONTRADICTION
    - **severity:** HIGH
    - **suggested fix:** Pick one reconciliation and make both files carry it. The honest version is 14's with 13's correction applied: the core is 54.00 h of implementation PLUS the test-build for the surviving claims, which 13 prices at roughly 24 h (F0+T1+T2+T5) — so state the core as ~70 h, not 54, or state explicitly that the 54 h core figure already embeds its tests and re-derive N4a/N4b from 13's hour column.
  - _item 3_
    - **file:** p1b/result/claude/13-name-the-test.md
    - **heading:** T10 — The date on the receipt is the date that actually disqualifies the food
    - **quoted sentence:** Today: `item.expiration_date \|\| existingItem.expiration_date` at `transfer/route.ts:66` overwrites the stored date while `:65` sums quantities — measured, expect **4/8** (it is right only when the incoming date is NULL or already earlier)
    - **what is wrong:** The document's own stated rule yields at least 6/8, not 4/8: the eight cases are later-incoming (wrong), earlier-incoming (right), a second later-incoming (wrong), NULL-incoming (right), NULL-existing (right), equal (right), and three differing-`location` cases that never reach the merge path at all (right by construction) — so the number contradicts the parenthetical printed beside it, and the word "measured" is attached to a figure nobody ran.
    - **category:** DOES_NOT_FOLLOW
    - **severity:** HIGH
    - **suggested fix:** Either enumerate the eight cases explicitly with their expected today-values and let the count fall where it falls, or drop the figure and write "baseline to be measured in the first harness run" — and change "measured, expect N" to "predicted, not yet run" everywhere it appears (T7, T9, T10, T11).
  - _item 4_
    - **file:** p1b/result/claude/13-name-the-test.md
    - **heading:** T10 — The date on the receipt is the date that actually disqualifies the food
    - **quoted sentence:** The date on the receipt is the date that actually disqualifies the food
    - **what is wrong:** `user_inventory` upserts by (user_id, ingredient_id, location) and SUMS quantities with no per-purchase lots, so no single stored date can be the date that disqualifies the food: the current rule makes the aggregate row look too fresh, and the proposed earliest-of-two fix (14's Cut 10, priced 3.5 h) makes it look too stale — the fix does not make the benefit true, it inverts the error, and neither file says so.
    - **category:** DOES_NOT_FOLLOW
    - **severity:** HIGH
    - **suggested fix:** Restate the benefit as what the schema can support: "the receipt prints the date stored on the row it read, and names the row". Move the earliest-of-two change out of the benefit column and into a disclosed limitation, and say in one sentence that without per-purchase lots neither merge direction is correct.
  - _item 5_
    - **file:** p1b/result/claude/14-cut-list.md
    - **heading:** CUT 6 — N5a's affected-row-count checks / CUT 2 — N4's live Gemini baseline
    - **quoted sentence:** **Fri 2026-10-02, 18:00.** Fires if cumulative feature hours > 78 and the transfer-route branch is not merged.
    - **what is wrong:** The trigger is an absolute hour count against a plan that shrinks every time an earlier cut fires: after Cuts 1–5 return 22.25 h the post-cut plan is 72.50 h, so cumulative hours can never exceed 78 and Cut 6 becomes structurally unreachable — the same defect disables Cut 2's "> 58" clause, and it disables them in exactly the scenario (things are going badly, cuts are firing) the triggers exist for.
    - **category:** DOES_NOT_FOLLOW
    - **severity:** HIGH
    - **suggested fix:** Express every hour trigger as a fraction of the CURRENT post-cut plan, not an absolute: "fires if cumulative hours exceed 90% of the remaining plan", and print the recomputed threshold beside each cut so the checkpoint reader can evaluate it aloud.
  - _item 6_
    - **file:** p1b/result/claude/14-cut-list.md
    - **heading:** THE CALENDAR THE CUTS ARE PINNED TO — standing cut checkpoint
    - **quoted sentence:** Standing cut checkpoint: **Saturday 18:00, every week (Sep 20, Sep 27, Oct 4), plus Wednesday 18:00 gates on Sep 30 and Oct 7.** ... No cut is ever discussed off-checkpoint.
    - **what is wrong:** 2026-09-20, 09-27 and 10-04 are all Sundays (the calendar table three lines above labels them "Sun"), and five of the ten cuts carry triggers on days that are not checkpoints at all — Thu Oct 1 (Cut 5), Fri Oct 2 (Cuts 6 and 7), and Sun Oct 4 at 12:00 (Cuts 8 and 9, four hours before the 18:00 checkpoint) — so the rule the document calls "the part that makes it enforceable" is broken by half its own triggers and gets its own weekday names wrong.
    - **category:** INTERNAL_CONTRADICTION
    - **severity:** HIGH
    - **suggested fix:** Relabel the weekly checkpoint as Sunday 18:00 (or move it to Sat Sep 19 / Sep 26 / Oct 3), and snap every cut trigger onto a named checkpoint instant; the Oct 7 gate should be deleted, since it falls after the Oct 4 feature freeze and no cut can fire there.
  - _item 7_
    - **file:** p1b/result/claude/13-name-the-test.md
    - **heading:** T11 — `success: true` is reported only for writes that happened
    - **quoted sentence:** A 3-item transfer where the `shopping_list_items` DELETE is forced to affect 0 rows (row removed between insert and delete), × 6 forced-failure variants
    - **what is wrong:** There is no DELETE on `shopping_list_items` in `transfer/route.ts` — the forward path marks items with `.update({ is_checked: true })` at :93–96, and the file's only `.delete()` is at :170 against `user_inventory` in the reverse/undo handler, which never touches `transferred_count` at :112 — so the fixture describes an operation that does not exist and the test as written cannot be built; file 14 line 98 repeats the same conflation and stamps it "both re-confirmed today".
    - **category:** WEAK_SOURCE_TREATED_AS_SETTLED
    - **severity:** HIGH
    - **suggested fix:** Rewrite the fixture around the real mechanism: force the `is_checked` UPDATE at :93–96 to match zero rows (delete the shopping item between the inventory write and the update); assert that the route inspects the affected count rather than only `checkError`. Remove :170 from both files' descriptions of UC20, or describe it separately as a second unchecked write on the undo path.
  - _item 8_
    - **file:** p1b/result/claude/13-name-the-test.md
    - **heading:** T3 — The number on screen is the number the system ranked with
    - **quoted sentence:** Today: 1 reference at `:304`; 50/50 render the model's number
    - **what is wrong:** `grep -c match_score RecipeRecommendationModal.tsx` returns 4 — lines 303, 304, 306 and 307 — and the same table row's own fixture cell already says "today: `RecipeRecommendationModal.tsx:303–304` and `:306–307`", so the baseline contradicts its own row and undercounts the thing the test is supposed to drive to zero by a factor of four.
    - **category:** INTERNAL_CONTRADICTION
    - **severity:** HIGH
    - **suggested fix:** Change the baseline to "Today: 4 references at :303, :304, :306, :307" and state the threshold as 0 of 4, which also makes the before/after delta legible on the poster.
  - _item 9_
    - **file:** p1b/result/claude/14-cut-list.md
    - **heading:** CUT 1 — N5b, the share-route hardening / THE IRREDUCIBLE CORE (N5a1)
    - **quoted sentence:** it is our first Supabase migration, our first RLS policy and an auth refactor, on a route the receipt does not touch
    - **what is wrong:** The stated reason for cutting N5b is migration inexperience, yet the irreducible core retains N5a1, whose test (13's T9) explicitly requires "after the new migration, a direct SQL insert of quantity ≤ 0 is rejected by `CHECK (quantity > 0)`", and retains N1b's "seeded local Supabase" — so the capability the document declares too unfamiliar to buy at 8.75 h is assumed available for free inside the core.
    - **category:** INTERNAL_CONTRADICTION
    - **severity:** HIGH
    - **suggested fix:** Either drop the inexperience argument from Cut 1 and cut N5b purely on "not on the receipt's path" (which is sufficient on its own), or move the first-migration cost into N1b's 6.0 h explicitly and note that N5a1 reuses it.
  - _item 10_
    - **file:** p1b/result/claude/14-cut-list.md
    - **heading:** THE IRREDUCIBLE CORE — 54.00 h (N5a1)
    - **quoted sentence:** Negatives persist and 0 silently becomes 1, so the receipt would print points for food that is not there. This is the one security item the receipt's honesty is literally made of.
    - **what is wrong:** Nothing in the scorer as specified (13's T6 enumerates its branches: expired, ≤1 d, ≤3 d, ≤7 d, >7 d, NULL date, not in pantry, duplicate ingredient, 0-ingredient recipe — quantity is not among them) reads quantity at all, so the receipt's honesty is secured by one `quantity > 0` predicate in the pure scorer being written anyway at N2a, not by a 3.0 h write-path fix plus a migration on a route the document elsewhere argues is off the receipt's path.
    - **category:** DOES_NOT_FOLLOW
    - **severity:** HIGH
    - **suggested fix:** Move the quantity floor into N2a as a filter predicate (≈0 h), demote N5a1 to a disclosed-not-fixed finding alongside Cuts 6 and 10, and re-state the core as 51.00 h — or, if the write-path fix is genuinely wanted, justify it on data-integrity grounds rather than on a receipt path it does not sit on.
  - _item 11_
    - **file:** p1b/result/claude/13-name-the-test.md
    - **heading:** T5 — Correct one line and the ranking moves (the non-tautological half)
    - **quoted sentence:** Fails if the fraction is **< 0.20** (receipt is decorative: corrections do not reach the ranking) **or > 0.95** (receipt is chaotic: any edit reshuffles everything). Pre-registered; no amount of careful coding guarantees landing inside the band
    - **what is wrong:** 0.20 and 0.95 have no derivation anywhere in the document — no prior, no pilot, no reference system — so the only non-tautological threshold in the entire M0 evaluation, the one the closing paragraph names as "the only outcome we cannot engineer around", is a model-invented band with two decimal places and the pre-registration ritual is being used to launder it.
    - **category:** ESTIMATE_AS_MEASUREMENT
    - **severity:** HIGH
    - **suggested fix:** Either derive the band (e.g. from the rank-position distribution of the top flagged item across the ten pantries, computed offline before the scorer is written, and show that computation), or drop the band entirely and pre-register only the direction and the reporting rule: "we report the fraction as it comes out, whatever it is" — which is the stance the closing paragraph already takes and is defensible without an invented number.
  - _item 12_
    - **file:** p1b/result/claude/13-name-the-test.md
    - **heading:** U3 — UNTESTABLE as stated — downgrade to a dated citation
    - **quoted sentence:** "All fourteen live products tell you a recipe matches and none tells you why" ... keep the 2026-09-13 archived snapshots in `p1b/evidence/` and cite them with the date, do not re-assert as current
    - **what is wrong:** Later runs establish that this claim was never true as of that date, not merely un-re-runnable: RecipeFix ships substitution reasoning, Mealie renders "Substituting: {substitute} for {food}" in public shipped source, Remy prints "Using up before they expire: <item> · <qty>", and Cooklist's expiry reminders are confirmed shipping by real user reviews — so dating the citation preserves a false sentence rather than retiring it, and the "Samsung Food returned HTTP 403" justification is stale against the first-party Wayback capture.
    - **category:** STALE
    - **severity:** HIGH
    - **suggested fix:** Delete the fourteen-products sentence outright rather than downgrading it, and replace the gap statement with the four-way conjunction that actually survives — named item + actual expiry date + nutrient constraint + reason for the substitution, in one auditable correctable object — with the four counter-examples cited by name as the reason the narrower claim is the one being made.
  - _item 13_
    - **file:** p1b/result/claude/14-cut-list.md
    - **heading:** THE IRREDUCIBLE CORE — 54.00 h (N2e)
    - **quoted sentence:** | **N2e** Integration and review of the scorer | 2.0 | |
    - **what is wrong:** In a table whose entire premise is that "Nothing here has a trigger, because nothing here may be cut" and whose third column is headed "Why it cannot go", this row's justification cell is empty — the single clearest evidence that the core is partly what the author kept rather than what cannot be cut.
    - **category:** UNACTIONABLE
    - **severity:** HIGH
    - **suggested fix:** Fill the cell or fold the 2.0 h into N2a. If integration and review genuinely cannot be cut, the reason is that N2a/N2b/N2c are written by different people and the seams are where the invariants break — say that.
  - _item 14_
    - **file:** p1b/result/claude/13-name-the-test.md
    - **heading:** F0 — BASELINE ROW (do this first)
    - **quoted sentence:** **3 repeats** = 30 live `gemini-2.5-flash` calls (`:217`); archive all 30 raw JSON bodies ... (a) is 0/100 **by construction**
    - **what is wrong:** 30 calls at `num_recipes=10` return 300 recommendations, not 100, so the denominator in assertion (a) — and in T1's baseline "F0(a): 0/100" and T4's "across 100 recommendations" — is one repeat's worth, while file 14's Cut 2 describes the same artifact as "~100 calls, once"; three different counts of the same run are in circulation.
    - **category:** INTERNAL_CONTRADICTION
    - **severity:** MEDIUM
    - **suggested fix:** Fix the denominator to 0/300 across all three rows, and correct 14's Cut 2 to "30 calls, once, yielding 300 recommendations" — the larger denominator is also the better poster number.
  - _item 15_
    - **file:** p1b/result/claude/13-name-the-test.md
    - **heading:** T8 — The ranking moved behind an authenticated route and stops spending our quota
    - **quoted sentence:** grep finds no `NEXT_PUBLIC_PYTHON_BACKEND_URL` under `web/src/app/dashboard/` ... Today, same harness against FastAPI: **3/3 accepted, 3 Gemini calls, 2 grep hits** (`dashboard/inventory/page.tsx:29` and `:141`
    - **what is wrong:** That string occurs exactly once in the whole `web/src` tree, at :29; line 141 reads `fetch(\`${BACKEND_URL}/inventory-recommend\`)` and contains no such token — so the baseline is 1, not 2, and the test as literally specified is passed by renaming the constant while leaving the call intact, which is the same source-text-grep-as-security-test pattern already flagged against P1a.
    - **category:** WEAK_SOURCE_TREATED_AS_SETTLED
    - **severity:** MEDIUM
    - **suggested fix:** Replace the grep condition with an executed assertion: the call-counting spy records 0 calls when the dashboard page is rendered, plus an AST check that no module under `web/src/app/dashboard/` imports a cross-origin fetch target. Correct the baseline to 1 hit.
  - _item 16_
    - **file:** p1b/result/claude/13-name-the-test.md
    - **heading:** T8 — fixture, case (c)
    - **quoted sentence:** (c) valid session for user A naming user B's inventory
    - **what is wrong:** Today's FastAPI endpoint takes `inventory: List[InventoryItem]` in the request body, so there is no inventory to "name" and no ownership boundary to cross — case (c) is not expressible against the pre-change build, which makes the stated baseline "3/3 accepted" a count of three things only two of which exist.
    - **category:** DOES_NOT_FOLLOW
    - **severity:** MEDIUM
    - **suggested fix:** State the baseline as 2/2 accepted against FastAPI and note that (c) has no pre-change analogue because the current route accepts an arbitrary caller-supplied inventory — which is itself the stronger finding and should be said in one sentence.
  - _item 17_
    - **file:** p1b/result/claude/14-cut-list.md
    - **heading:** THE IRREDUCIBLE CORE — 54.00 h (N3b) / CUT 3
    - **quoted sentence:** **N3b** Auth on the client→FastAPI call at `inventory/page.tsx:141` | 2.0 | It spends our Gemini quota for anyone who knows the URL, today.
    - **what is wrong:** Cut 3's own replacement sentence says "The model no longer ranks anything" and the N2 scorer runs client-side over data the client already holds, which means the `/inventory-recommend` call has no remaining caller — spending 2.0 h of uncuttable core budget authenticating a route that should be deleted, and then claiming "the quota leak is closed, because it is" on that basis.
    - **category:** DOES_NOT_FOLLOW
    - **severity:** MEDIUM
    - **suggested fix:** Decide whether the Gemini narration survives. If it does, keep N3b and say what still calls the route; if it does not, replace N3b with "delete the unauthenticated call at :141 and the BACKEND_URL constant at :29" (≈0.5 h) and bank 1.5 h — deletion is a stronger poster claim than authentication.
  - _item 18_
    - **file:** p1b/result/claude/14-cut-list.md
    - **heading:** If the core itself slips after 2026-10-04
    - **quoted sentence:** the last lever is *N*, not honesty — shrink the corpus from 50 × 10 to 50 × 3 and print the smaller number with the same query beside it. "150 of 150" is a true sentence.
    - **what is wrong:** The 500 cells are evaluated by a pure offline function whose runtime is milliseconds, so shrinking the corpus returns essentially no hours — at best a fraction of N2c's 4.0 h of fixture authoring, and only if the seven pantries have not already been written — which makes the document's designated last-resort lever one that cannot relieve the pressure it is offered for.
    - **category:** UNACTIONABLE
    - **severity:** MEDIUM
    - **suggested fix:** Name a lever that actually returns hours at that point: drop T5/correctability reporting to a stated open question (already Cut 8), or ship the receipt behind a feature flag on one pantry. If the corpus lever is kept, price it honestly as "saves ~2 h of fixture authoring, only if invoked before 2026-09-21".
  - _item 19_
    - **file:** p1b/result/claude/13-name-the-test.md
    - **heading:** T4 — Every line names a pantry item you own, with the date that produced its points
    - **quoted sentence:** the count of names in `expiring_ingredients_used` (rendered at `:328–330`) across 100 recommendations that match **no** row in the 448-name catalog, reported as n/N
    - **what is wrong:** No matching rule is specified, and the names in question are free text emitted by a language model, so whether "cherry tomatoes" matches the catalog's "Tomatoes, cherry" is a decision the team gets to make after seeing the archive — the baseline number is therefore adjustable after the fact, which is precisely what the pre-registration discipline elsewhere in the file is meant to prevent.
    - **category:** WEAK_SOURCE_TREATED_AS_SETTLED
    - **severity:** MEDIUM
    - **suggested fix:** Pre-register the normalisation in N1 alongside the T5 correction rule: casefold, strip punctuation, singularise, exact match only; commit the normaliser as code before the F0 archive is opened, and report both the strict and normalised counts.
  - _item 20_
    - **file:** p1b/result/claude/13-name-the-test.md
    - **heading:** T1 / T6 — the displayed total, and the published integer table
    - **quoted sentence:** `total === line_items.reduce((a,l)=>a+l.points,0)` and `Number.isInteger(total)` and every `points` is an integer (no float path)
    - **what is wrong:** The receipt total is an unbounded Grocy-style point count, but the surface it replaces renders `{recipe.match_score}%` at :304 and file 14's N3a keeps that contract (":298, :303-307"), so every test can pass 500/500 while the screen prints a point total with a percent sign — no test anywhere in the file checks the unit of the number the user reads, which is the first thing a marker looking at a screenshot will ask.
    - **category:** MARKER_WILL_CHALLENGE
    - **severity:** MEDIUM
    - **suggested fix:** Add a one-line assertion to T1 that the rendered string's unit matches the scorer's declared unit (a `unit` field on the DTO, asserted against the rendered suffix), and say in N3a whether the percent sign is being removed or the total normalised to 0–100 with the normalisation booked as its own line item.
  - _item 21_
    - **file:** p1b/result/claude/13-name-the-test.md
    - **heading:** T13 — Every number we print has a query that produced it
    - **quoted sentence:** Today the mission statement contains **2** unproducible numbers — the "500-case baseline" against `num_recipes: int = Field(default=5, ge=1, le=10)`
    - **what is wrong:** The count says two and the parenthetical exhibits one; the second is never named anywhere in the file, so the headline number of the row that polices unproducible numbers is itself unproducible.
    - **category:** INTERNAL_CONTRADICTION
    - **severity:** MEDIUM
    - **suggested fix:** Name the second number or change the count to 1. Given the audit above, an easy true second is the "1 reference at :304" figure in T3, which is 4.
  - _item 22_
    - **file:** p1b/result/claude/13-name-the-test.md
    - **heading:** Hours column and Budget reconciliation
    - **quoted sentence:** **Total test-build** | **61**
    - **what is wrong:** Every one of the fourteen hour figures that sums to 61 — F0's 9 h for a script that makes 30 HTTP calls, T5's 7 h, T8's 5 h — is stated without any basis, no analogy to a completed task and no decomposition, yet these numbers drive the under-costing verdict on N4, the drop-N5b recommendation, and the cut order in the last sentence; file 14 independently prices the same live baseline at 6.0 h, so the two documents disagree on the one item they both cost.
    - **category:** ESTIMATE_AS_MEASUREMENT
    - **severity:** MEDIUM
    - **suggested fix:** Mark the Hours column "estimated, no measured basis" in the header, reconcile F0 to 14's 6.0 h or explain the 3 h difference, and re-run the budget reconciliation paragraph on the reconciled figures.
  - _item 23_
    - **file:** p1b/result/claude/13-name-the-test.md
    - **heading:** Budget reconciliation (three lines)
    - **quoted sentence:** Cut order if it still does not close: T12 (3 h) and T13 (2 h) are process, not product; T7 (3 h) is partly subsumed by T3; that buys 8 h and nothing below that line can be cut without deleting a claim.
    - **what is wrong:** Eight hours does not close the stated gap — 61 − 8 = 53 h of test-build against 74 h of milestone, leaving 21 h for implementation that file 14 prices at 33 h in those same milestones — so the paragraph ends on a reassuring cadence its own arithmetic refutes, and it nominates for cutting the test of N1a/N1b, which file 14 declares uncuttable ("Never cut, at any hours remaining: all 12.0 h of N1").
    - **category:** DOES_NOT_FOLLOW
    - **severity:** MEDIUM
    - **suggested fix:** Finish the arithmetic in the same sentence: "that buys 8 h and still leaves the plan ~12 h short, which is the reason the cut list exists" — and remove T13 from the cut order, since it is the only test of the item the sibling document calls uncuttable.
  - _item 24_
    - **file:** p1b/result/claude/14-cut-list.md
    - **heading:** CUT 5 — N2's property-based test generator
    - **quoted sentence:** The third is additionally proven at system level by N4's 20-shuffle run, which is the stronger evidence anyway.
    - **what is wrong:** If the 20-shuffle run is stronger evidence anyway, the generator was never worth 4.0 h and belongs at Cut 1, not Cut 5 — the sentence undermines the ordering claim "Ordered by inverse load on the single number we are publishing"; separately, `hypothesis` is a Python library already in `backend/pyproject.toml` while the scorer is TypeScript under Jest, and `fast-check` is not in `web/package.json`, so the two tools offered as interchangeable are not.
    - **category:** DOES_NOT_FOLLOW
    - **severity:** MEDIUM
    - **suggested fix:** Move the generator to Cut 1 or Cut 2 and say the 20-shuffle run supersedes it; drop `hypothesis` from the sentence and note that `fast-check` would be a new dependency.
  - _item 25_
    - **file:** p1b/result/claude/14-cut-list.md
    - **heading:** Standing cut checkpoint / CUT 2 and CUT 6 triggers
    - **quoted sentence:** One person reads the burn-down aloud, the triggers below are checked in order
    - **what is wrong:** Four triggers depend on "cumulative feature hours", but no line item in the 54.00 h core or the 60 h overhead creates or maintains a burn-down, no tool is named, and no one is assigned — so the observability of a third of the cut list rests on self-reported hours from four students that the plan never budgets for collecting.
    - **category:** UNACTIONABLE
    - **severity:** MEDIUM
    - **suggested fix:** Add the burn-down to N1a's 3.0 h explicitly (a committed CSV of hours-by-milestone updated at each checkpoint, one named owner), or replace every hours trigger with a merge-state trigger, which is observable for free from git and which the other six cuts already use successfully.
  - _item 26_
    - **file:** p1b/result/claude/13-name-the-test.md
    - **heading:** U1 — UNTESTABLE — DELETE
    - **quoted sentence:** none possible: "can point at" has no offline operationalisation
    - **what is wrong:** The true reason to delete this is stronger and is not given: a sweep of 851 Reddit entries across eleven explainability phrasings returned zero hits in any meal, pantry or recipe context, so there is no demand-side evidence that anyone wants to point at the line at all — deleting it as merely "untestable in one month" implies the benefit is real but out of reach, and leaves D2's "so what" resting on an unevidenced premise that neither file names.
    - **category:** STALE
    - **severity:** MEDIUM
    - **suggested fix:** Add one line to U1: the benefit is deleted both because it is not testable offline and because the demand sweep (851 entries, eleven phrasings, zero hits) found no one asking for it; state the measurable claim as an engineering property of our own artifact, not a user benefit.
  - _item 27_
    - **file:** p1b/result/claude/14-cut-list.md
    - **heading:** CUT 8 / CUT 9 triggers
    - **quoted sentence:** (Cut 8 must already have fired — correctability cannot outlive the mechanism it measures, which is why it is cut first.)
    - **what is wrong:** Cuts 8 and 9 carry the identical trigger instant (Sun 2026-10-04, 12:00) on conditions that are the same condition in two phrasings — "the correction write path is not merged and writing" versus "no merged PR makes a corrected line persist" — so they fire simultaneously and the claimed ordering dependency does no work; worse, Cut 8's trigger observes whether the mechanism merged, not whether the 3.0 h measurement is feasible, which is the thing Cut 8 is actually about.
    - **category:** DOES_NOT_FOLLOW
    - **severity:** LOW
    - **suggested fix:** Give Cut 8 an earlier and distinct trigger that observes its own subject — e.g. Wed 2026-09-30 18:00, fires if the correction harness cannot produce a top-5 Kendall-tau delta on one seeded pantry — and leave Cut 9 on the freeze.
  - _item 28_
    - **file:** p1b/result/claude/13-name-the-test.md
    - **heading:** T12 — The whole thing reproduces from a clean clone
    - **quoted sentence:** run `make dev`; then `npm test && uv run pytest` ... **≤1** command, **≤15** min wall clock, on **4/4** team machines
    - **what is wrong:** The fixture specifies three commands and the threshold demands at most one, so the test fails by construction; and the baseline ("each of the 4 of us does it once and records the manual-step count") requires four people's time that the row's 3 h price does not appear to include.
    - **category:** INTERNAL_CONTRADICTION
    - **severity:** LOW
    - **suggested fix:** Set the threshold to "≤1 command to a running stack, ≤2 further commands to green suites" and add the four-person baseline pass as a named half-hour on the W1 calendar.
  - _item 29_
    - **file:** p1b/result/claude/14-cut-list.md
    - **heading:** THE IRREDUCIBLE CORE — 54.00 h (N2a) / CUT 1 vs U2 in file 13
    - **quoted sentence:** **N2a** Pure scorer ... coverage half ported from `recipeMatch.ts` (188 lines, pure, dependency-free) | 8.0 | This is the project.
    - **what is wrong:** 8.0 h is the largest scorer line and its entire justification is a four-word aphorism, for work the row itself describes as a port of an existing dependency-free module that already exports `calculateCoverageScore`; separately, N2b's 6.0 h is justified partly by "The zeroed term is a food-safety position we defend", which file 13's U2 marks UNTESTABLE and instructs be deleted from the mission statement.
    - **category:** ESTIMATE_AS_MEASUREMENT
    - **severity:** LOW
    - **suggested fix:** Decompose N2a into port (≈2 h, `calculateCoverageScore` exists at `web/src/utils/inventory/recipeMatch.ts:176`), line-item emission (≈4 h) and DTO plus tie-break (≈2 h); and reconcile N2b with U2 by keeping the zeroed term as an engineering deviation with a stated reason rather than a defended food-safety position.
- **files audited:**
  - /Users/andy/Library/Mobile Documents/com~apple~CloudDocs/Work/1151/CSC510/Epicourier-Web/p1b/result/claude/13-name-the-test.md
  - /Users/andy/Library/Mobile Documents/com~apple~CloudDocs/Work/1151/CSC510/Epicourier-Web/p1b/result/claude/14-cut-list.md
- **strongest things:**
  - 13-name-the-test.md — the U1–U5 block, placed first on purpose, that DELETES five benefits outright rather than softening them ('Claims that cannot be tested inside one month are marked UNTESTABLE and deleted from the mission statement, not softened'). Deleting your own best-sounding claims and putting them at the top of the page is the single most credible thing in either file, and a marker will read it as evidence the rest was written in good faith. Protect it; just fix U3's stale content and U1's stated reason.
  - 13-name-the-test.md — the F0-first design that turns the baseline into a committed archive: 'one prior run against the live gemini-2.5-flash endpoint (30 calls, archived as JSON) supplying the baseline so that no marker ever has to re-run it or hold an API key', paired with the volunteered admission that T1 and T2 'are trivial and today's build does not have them'. Pre-empting the triviality objection in the document's own closing paragraph is exactly right and should not be edited out.
  - 14-cut-list.md — the arithmetic, which closes exactly and independently in two directions: the ten cuts return 8.75+3.5+4+2+4+3.5+2.5+3+6+3.5 = 40.75 h, every running margin figure (14.00 → 17.50 → 21.50 → 23.50 → 27.50 → 31.00 → 33.50 → 36.50 → 42.50 → 46.00) is correct, 94.75 − 40.75 = 54.00 matches the core table's twelve rows summed, and the cut hours re-aggregate to N1 12 + N2 24 + N3 22 + N4 18 + N5a 10 + N5b 8.75 = 94.75. I checked all of it; none of it is off by a single decimal.
  - 14-cut-list.md — the 'The poster must STOP saying: <struck sentence>. Replace with: <exact replacement>' mechanism on all ten cuts. This is what converts a cut list from an intention into an enforceable artifact, and the pairing with 'any cut that fires is executed and its poster sentence deleted in the same sitting' is the strongest process idea in either document. Keep it verbatim.
- **overall:** Neither file is sound as it stands, but they fail in opposite ways and the damage is concentrated in about six places.
  
  14-cut-list.md is arithmetically immaculate and structurally clever — I verified every hour figure, every running margin, and the milestone re-aggregation, and all of it closes exactly. Its problems are argumentative, and one of them is severe: the sentence the irreducible core's poster paragraph is built on — 'grep -c "validate\\|verify\\|check" over the 245-line file returns 0 ... No line of code anywhere recomputes or checks that number' — is true only because grep is case-sensitive. Run it with -i and you get one hit: line 238, a comment reading `# Validate and return`, attached to the Pydantic construction that does validate the model's output. The document explicitly invites a marker to re-run the command. That is the Sketch-mockup failure repeating itself, this time on our own claimed first-hand verification, and it is in the one paragraph the file says 'survives all ten cuts'. The narrower claim available underneath it is actually stronger and fully demonstrable: match_score: int  # 0-100 at :50 carries its range in a comment while num_recipes at :42 on the same model enforces ge=1, le=10 — the field the user reads is the one field the schema declines to constrain.
  
  13-name-the-test.md has the better epistemics (the UNTESTABLE-and-delete block is genuinely admirable) and the worse execution. Its baselines are the assignment's question and the answer is: five of thirteen are predictions wearing the word 'measured' ('measured, expect 4/8', 'expect 0/7', 'expect 6/6', '5/5 would change'), two are arithmetically wrong against the repository I just checked (T3 says 1 match_score reference where there are 4, contradicting its own fixture cell; T8 says 2 grep hits for NEXT_PUBLIC_PYTHON_BACKEND_URL where there is 1), one names a code path that does not exist (T11's 'shopping_list_items DELETE' — the forward path does .update({is_checked:true}) at :93-96, and the file's only .delete() is on user_inventory at :170 in the undo handler), and one — T10's benefit, 'the date that actually disqualifies the food' — is unachievable in a schema that sums quantities with no per-purchase lots, where the proposed 3.5 h fix merely inverts the error. The 0.20–0.95 band in T5, which the closing paragraph correctly identifies as the only outcome the team cannot engineer around, has no derivation of any kind.
  
  The two files also render opposite budget verdicts on the same day: 13 says 'that does not close', 14 opens with 'nothing essential is at risk from the budget'. And the 'irreducible core' is not quite irreducible — N2e's justification cell is literally empty, N5a1's 3.0 h is defended on a receipt path the receipt does not read (a quantity>0 predicate in the pure scorer does the same job for free), N3b spends 2.0 h authenticating a route that Cut 3's own replacement sentence retires, and N5b is cut for migration inexperience while the core quietly assumes a migration and a seeded local Supabase.
  
  Ranked triage if you fix only five things: the grep sentence; the 13-vs-14 budget contradiction; T10's unachievable benefit; the absolute-hour triggers (Cut 2's >58 and Cut 6's >78) that become unreachable as earlier cuts shrink the plan; and the checkpoint calendar, which calls three Sundays 'Saturday' and dates five of ten triggers on days it declares off-limits for discussing cuts.
