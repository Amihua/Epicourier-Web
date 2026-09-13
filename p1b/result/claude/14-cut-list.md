# The Cut List — the order of sacrifice, decided now

**Prompt:** C7 (ours) · **Run date:** 2026-09-13 · **Model:** Claude Opus 5 (1M context), `claude-opus-5[1m]`

P09 sorts milestones while the month still looks long. What actually happens is that week 3 arrives and something has to go. This decides the order now, with a dated trigger for each cut and — the part that makes it enforceable — the exact poster sentence that has to come off when each cut fires.

---

> ## ⚠ SUPERSEDED BASE — read this before quoting any number below
>
> **Every figure in this file is keyed to the 94.75 h NOW plan.** That plan was re-costed on
> 2026-09-13: [`13-name-the-test.md`](13-name-the-test.md) builds the M0 tests line by line and
> reaches **24 h for N4, not 18**, so the plan is **100.75 h**. Rather than edit a dozen scattered
> figures and risk new arithmetic errors, the whole file is re-keyed here, once:
>
> | Reads below | Should read | Working |
> |---|---|---|
> | NOW plan 94.75 h | **100.75 h** | N4 18.0 → 24.0 |
> | Margin 5.25 h (5%) | **−0.75 h** — the margin is gone, not thin | 100.75 against 100 h capacity |
> | Post-Cut-1 plan 86.00 h, margin 14.00 | **92.00 h, margin +8.00** | 100.75 − 8.75 |
> | Post-Cuts-1-to-5 plan 72.50 h | **78.50 h** | 100.75 − 22.25 |
> | Cut 2 trigger 57.62 h | **61.64 h** | 67% of 92.00 |
> | Cut 6 trigger 77.40 h | **82.80 h** | 90% of 92.00 |
> | Cut 6 trigger, post-Cut-5 65.25 h | **70.65 h** | 90% of 78.50 |
> | Cut 1 fires at 5.25/100 = 5.25% | **fires harder** — the margin is negative, so the condition is met outright | |
>
> **The irreducible core is the one figure this cannot settle, and we do not invent it.** The
> re-cost adds 6 h to N4, and *neither* [`12`](12-milestones.md) *nor* [`13`](13-name-the-test.md)
> says whether those 6 h are cuttable harness work or core M0 work. If cuttable, the ten cuts
> return 46.75 h and **the core stays 54.00 h**. If core, the cuts return 40.75 h and **the core is
> 60.00 h**. Both still fit the 100 h capacity, which is why the file's conclusion survives — but
> the number to put on a poster is **unknown until someone splits N4's 24 h into cuttable and
> non-cuttable**, and that is a twenty-minute job nobody has done.
>
> The stale figures are left visible below rather than overwritten, so the correction is auditable.

---

**BUDGET VERDICT (first line, as requested): the irreducible core is 54.00 h and it does NOT exceed the budget — it fits inside the 100 h of feature capacity with 46.00 h to spare. The finding is therefore the inverse of the feared one: nothing essential is at risk from the budget. What is at risk is that 40.75 h of the current 94.75 h plan is optional work being defended at a 5.25 h margin, so in week 4 the optional work will be defended and the core will be what gets rushed. The cut list below exists to make that impossible by deciding the order today.**

> ### ⚠ Correction 2026-09-13 — the 46.00 h of spare may be 24.00 h, and the sibling file says the opposite
>
> [`13-name-the-test.md`](13-name-the-test.md), same run date and same model, reaches the **opposite**
> budget verdict — *"the full 61 h of test-build sits inside N2+N3+N4+N5a (74 h combined), leaving 13 h
> for implementation in those milestones — that does not close"* — and neither file acknowledged the
> other. **Both can be true, because they cost different plans:** 13 prices tests for all thirteen
> claims against the full 94.75 h NOW plan; this file prices only what survives all ten cuts. What is
> *not* reconcilable as printed is the test-build inside the 54.00 h core, which books **9.0 h**
> (N4a 7.0 + N4b 2.0) for the two tests 13 prices at **8.0 h** (T1 + T2), and books **nothing** for
> the other five tests of claims the core retains:
>
> | | h |
> |---|---|
> | Tests of the **seven** claims that survive all ten cuts, per 13's hour column (T1 4 + T2 4 + T3 5 + T4 4 + T6 4 + T8 5 + T9 4) | **30.0** |
> | Booked here as line items (N4a + N4b) | **9.0** |
> | Not booked anywhere in this table (T3 5 + T4 4 + T6 4 + T8 5 + T9 4) | **22.0** |
>
> **If N2a/N2b/N3a/N3b/N5a1's hours do not already include writing T3, T4, T6, T8 and T9, the core is
> 54.00 + 22.00 = 76.00 h and the spare is 100 − 76 = 24.00 h, not 46.00 h.** If they do, 54.00 h
> stands. **Open question — this file does not say which, and the 46.00 h figure is on the poster, so
> the team must state it before that figure is quoted.** The same note is carried in
> [`13-name-the-test.md`](13-name-the-test.md) so neither file can be read alone.
>
> *Separately: this file prices the live baseline at **6.0 h** (Cut 2) and 13 prices the same artifact
> (F0) at **9 h**. Neither number is derived, so there is nothing to reconcile* to *— the team must set
> one figure.*

Method note: every repository fact used to price a cut was re-grepped by me in the working tree today (2026-09-13). Confirmed first-hand: `inventory_recommender.py` is 245 lines; `match_score: int  # 0-100` at :50 and `num_recipes: int = Field(default=5, ge=1, le=10)` at :42; **⚠ the "zero validation calls" claim is withdrawn, 2026-09-13.** The case-**sensitive** `grep -c "validate\|verify\|check"` does return **0**, but that is an artifact of case: `grep -in` returns **1** hit — line **238**, a comment reading `# Validate and return`, sitting directly on the `RecommendedRecipe(**rec)` call at :239–241 that **does** run Pydantic validation on the model's output. **A marker re-running the exact command this document invited them to re-run would have falsified it.** What survives is strictly stronger and is now the published form: on the same Pydantic model, `num_recipes` at :42 has its bounds **enforced** by `Field(ge=1, le=10)`, while `match_score` at :50 carries its range **only in a comment** — *the one field the user actually sees is the one field the schema declines to constrain*, and nothing anywhere recomputes it. Also confirmed first-hand: "## Scoring Guidelines:" at :159 with the +15/+10 prose at :160-161; `RecipeRecommendationModal.tsx` renders `{recipe.reason}` at :298 and `{recipe.match_score}%` at :304; `inventory/page.tsx:141` is a bare `fetch(\`${BACKEND_URL}/inventory-recommend\`)`; `transfer/route.ts` writes `quantity: item.quantity || 1` and `expiration_date: item.expiration_date || existingItem.expiration_date` on the merge path, and the delete path discards its result; `share/route.ts:9` builds the client with no `auth.getUser` anywhere in the file and does `expiryDate.setDate(expiryDate.getDate() + expiryDays)` at :20 on a body-supplied `expiryDays = 7` (:15); `shopping_list_shares` appears in **0 of 13** files under `supabase/migrations/`. Corpus re-parsed as CSV today: **50** recipes, **448** ingredients, **528** map rows — the 50 × 10 = 500 offline cell count is sound.

---

## THE CALENDAR THE CUTS ARE PINNED TO

| | Dates | Feature hours available |
|---|---|---|
| W1 | Mon 2026-09-14 – Sun 2026-09-20 | ~33 |
| W2 | Mon 2026-09-21 – Sun 2026-09-27 | ~33 |
| W3 | Mon 2026-09-28 – **Sun 2026-10-04 (FEATURE FREEZE 23:59)** | ~34 |
| W4 | Mon 2026-10-05 – Sun 2026-10-11 | **0 — report, poster, demo, integration only** |

160 h total − 60 h overhead = 100 h of feature capacity, and all 100 of it lives in W1–W3 (40 h/week × 3 = 120, minus ~20 h of overhead that must land early: report skeleton, poster draft, weekly merge). W4 is the pre-mortem's "26 h of report written in the last 48 hours" scenario made structurally impossible. **A milestone not merged to main by 2026-10-04 23:59 is cut by definition, whether or not its trigger fired.**

Standing cut checkpoint — **⚠ corrected 2026-09-13.** This line read: *"Saturday 18:00, every week (Sep 20, Sep 27, Oct 4), plus Wednesday 18:00 gates on Sep 30 and Oct 7 … No cut is ever discussed off-checkpoint."* Two things were wrong with the part of this document that calls itself *"the part that makes it enforceable"*.

**(i) The weekday names were wrong.** 2026-09-20, 2026-09-27 and 2026-10-04 are all **Sundays** — the calendar table three lines above already labels them "Sun". Relabelled; the dates are unchanged, because 2026-10-04 is the feature freeze and is load-bearing.

**(ii) Half the triggers fired off-checkpoint.** Five of the ten cuts carried triggers on instants that were not checkpoints at all — Thu Oct 1 (Cut 5), Fri Oct 2 (Cuts 6 and 7), and Sun Oct 4 **12:00** (Cuts 8 and 9, four hours before the 18:00 checkpoint). The rule was broken by its own cut list. **Resolved by naming those instants as checkpoints rather than by moving any cut's date**, so no cut's timing changes. **The Wed Oct 7 gate is deleted**: it falls after the Oct 4 feature freeze, W4 has 0 feature hours, and no cut can fire there.

**The checkpoint list, corrected:** **Sun 2026-09-20 18:00 · Sun 2026-09-27 18:00 · Wed 2026-09-30 18:00 · Thu 2026-10-01 18:00 · Fri 2026-10-02 18:00 · Sun 2026-10-04 12:00 · Sun 2026-10-04 18:00 (feature-freeze checkpoint).** One person reads the burn-down aloud, the triggers below are checked in order, and any cut that fires is executed *and its poster sentence deleted in the same sitting*. No cut is ever discussed off-checkpoint — and every trigger below now names one of these seven instants, with the two exceptions that are not discussions at all: **Cut 1**, already fired at plan freeze on 2026-09-13, and **Cut 10**, which fires automatically at the 2026-10-04 23:59 feature freeze under the standing rule three lines above.

> **⚠ Open question 2026-09-13 — who maintains the burn-down?** The instruction *"one person reads the burn-down aloud"* names no person and no artifact. **Cuts 2 and 6 depend on "cumulative feature hours", and Cut 1's already-fired condition depended on the margin — but no line item in the 54.00 h core or the 60 h of overhead creates or maintains a burn-down, no tool is named, and no one is assigned.** Those triggers rest on self-reported hours from four students that the plan never budgets for collecting. The two fixes are (a) add the burn-down to N1a explicitly — a committed CSV of hours-by-milestone updated at each checkpoint, with one named owner, which would raise N1a above 3.0 h — or (b) replace both hours triggers with merge-state triggers, which are observable for free from git and which the other eight cuts already use successfully. **We are not picking one here, and we are not inventing an owner or an hour figure.** Until the team picks, treat the hours halves of Cuts 2 and 6 as unenforceable and their merge-state halves as the parts that actually fire.

Planned cumulative feature burn against the post-Cut-1 plan of 86.00 h: **W1 ≤ 29 h (34%), W2 ≤ 58 h (67%), W3 ≤ 86 h (100%).**

> **⚠ Corrected 2026-09-13 — hour triggers are now fractions of the *current* plan, not absolutes.**
> Every absolute hour threshold in this document was set against the 86.00 h post-Cut-1 plan, but the
> plan **shrinks every time an earlier cut fires**. Worked through: Cuts 1–5 return 8.75 + 3.5 + 4.0 +
> 2.0 + 4.0 = **22.25 h**, so the post-cut plan is 94.75 − 22.25 = **72.50 h**, and cumulative hours
> can then **never exceed 78** — which made Cut 6's *"> 78 h"* condition **structurally unreachable,
> and unreachable in exactly the scenario the trigger exists for** (things are going badly and cuts
> are firing). Cut 2's *"> 58 h"* has the same defect the moment any cut after Cut 1 fires.
> **Every hours trigger below is therefore restated as a percentage of the plan as it stands at that
> checkpoint, with the recomputed threshold printed beside it so the person reading the burn-down
> aloud can evaluate it without arithmetic.**

---

## THE STRICT CUT LIST — first to last

Ordered by inverse load on the single number we are publishing. Cut 1 is the cheapest thing to lose; Cut 10 is the last thing standing before the core.

### CUT 1 — N5b, the share-route hardening (8.75 h) → margin 5.25 → **14.00**

**What is cut.** The whole of N5b: the missing `shopping_list_shares` migration, `ENABLE ROW LEVEL SECURITY` plus policy, the `auth.getUser` refactor of `share/route.ts`, the ownership query on `shoppingListId`, the `expiryDays` bound.

**Still honestly claimed.** Everything P1a already earned. The defect is *found, evidenced, reproduced, and re-confirmed on 2026-09-13* — an unauthenticated route inserting on a body-supplied id into a table that has no migration, no RLS and no policy in 13 migration files, with an unbounded expiry. That is a finding, and findings are the P1a deliverable. We report it as **found and not fixed, with the fix costed at 8.75 h and the reason we declined stated**: it is our first Supabase migration, our first RLS policy and an auth refactor, on a route the receipt does not touch.

> **⚠ Correction 2026-09-13 — half that reason is contradicted by our own core.** The
> *migration-inexperience* half does not survive contact with the irreducible core below, which
> **retains N5a1** — whose test (13's T9) explicitly requires *"after the new migration, a direct SQL
> insert of quantity ≤ 0 is rejected by `CHECK (quantity > 0)`"* — and **retains N1b's "seeded local
> Supabase"**. The capability this cut declares too unfamiliar to buy at 8.75 h is assumed **available
> for free** twice inside the core. Either the first-migration cost belongs in N1b's 6.0 h explicitly
> (with a note that N5a1 reuses it), or the inexperience argument comes out of this cut. **The
> "not on the receipt's path" half is untouched by this and is sufficient on its own.**
>
> **We are not settling it here: whether the share route is in or out of scope at all is open team
> decision (c)**, on which [`12-milestones.md`](12-milestones.md) says drop N5b, this file cuts it,
> and [`13-name-the-test.md`](13-name-the-test.md)'s budget reconciliation leaves it open. What this
> correction fixes is the *reason given*, not the decision.

**The poster must STOP saying:** ~~"We closed the unauthenticated share route and added the missing `shopping_list_shares` table with row-level security."~~ Replace with: "We found it, proved it, and priced it at 8.75 h; we did not fix it, because it is not on the receipt's path."

**Trigger.** **Already fired, 2026-09-13.** Condition: at plan freeze, margin < 10% of feature budget. 5.25/100 = 5.25%. This cut is not conditional and is not revisited — it is executed before week 1 begins.

---

### CUT 2 — N4's live Gemini baseline, reduced to one archived snapshot (3.5 of 6.0 h) → **17.50**

**What is cut.** The repeatable live-baseline harness. What survives is one run: 10 seeded pantries × 3 repeats against today's build, responses snapshotted to JSON, disagreement rate X computed from that file, never re-run. **30 calls, once, yielding up to 300 recommendation objects over 100 distinct (pantry, rank-position) cells.** *(⚠ Corrected 2026-09-13: this read "~100 calls, once". 10 pantries × 3 repeats is **30** calls, not ~100; at the `le=10` cap each returns up to 10 recommendations, so the archive holds up to **300** scored objects. Three different counts of this one artifact were in circulation across the two files — see [`13-name-the-test.md`](13-name-the-test.md) F0, corrected to match.)*

**Still honestly claimed.** "**0 of 300** displayed scores decompose into line items" *(corrected 2026-09-13 from 0/100)* and a measured X — from an archived artifact any reader can open. The brief's own scoping correction stands and is now the published form: `num_recipes` is capped at `le=10` (`inventory_recommender.py:42`, confirmed today), so 10 pantries yield at most **100 distinct cells per repeat — 300 returned recommendations across the 3 repeats** — not 500. The larger denominator is also the better poster number.

**The poster must STOP saying:** ~~"A baseline of 0/500 recorded by the same harness against today's build."~~ Replace with: "A baseline of **0/300**, recorded once on <date> across 30 live calls and archived as JSON; the 500-cell figure is the offline determinism corpus, not the baseline." *(Corrected 2026-09-13 from 0/100 — see above. [`11b-mission-final.md`](11b-mission-final.md) was given that second pass and now reads 0/300.)*

**Trigger.** **Sun 2026-09-27, 18:00** *(corrected 2026-09-13 — Sep 27 is a Sunday).* Fires if the committed baseline script has not yet made one successful authenticated live call and written its JSON, **or** cumulative feature hours exceed **67% of the plan as it then stands** — *recomputed threshold: **57.62 h**, if only Cut 1 has fired (86.00 h plan)* — with N2 not merged green on main. *(⚠ The absolute "> 58 h" was corrected 2026-09-13; see the burn-line note above.)*

---

### CUT 3 — N3's relocation of ranking to the server (4.0 h) → **21.50**

**What is cut.** The new authenticated route that assembles inventory and runs the N2 scorer server-side. Ranking stays where it is computed today; the N2 module is imported and run client-side over data the client already holds. **The 2.0 h auth header on `inventory/page.tsx:141` is NOT cut** — it moves into the core (Cut 3 keeps it).

**Still honestly claimed.** The scorer is deterministic, pure and tested, and the number on screen is produced by it. Determinism does not depend on where it runs, and the 500-cell offline proof runs the same module.

> **⚠ Correction 2026-09-13 — "we also still claim the quota leak is closed, because it is" does not
> follow from this cut.** If this cut fires, *"the model no longer ranks anything"* (the replacement
> sentence below) and the N2 scorer runs client-side over data the client already holds — which means
> `/inventory-recommend` **has no remaining caller**, and N3b spends **2.0 h of uncuttable core budget
> authenticating a route that should instead be deleted.** The two branches price out differently:
>
> - **If the Gemini *narration* survives** (something still calls the route to produce prose), N3b's
>   2.0 h stands and this file must say **what** calls it. It does not currently say.
> - **If the narration does not survive**, N3b should be replaced by *"delete the unauthenticated call
>   at `inventory/page.tsx:141` and the `BACKEND_URL` constant at `:29`"* (≈0.5 h), banking **1.5 h** —
>   and deletion is a strictly stronger poster claim than authentication.
>
> **Open question: does the Gemini narration survive Project 2? We do not have that decision and are
> not making it.** Until it is made, the "quota leak is closed" sentence is unsupported and should not
> be printed.

**The poster must STOP saying:** ~~"Ranking is computed server-side under the user's own credentials; the client only renders."~~ Replace with: "Ranking is computed by a pure module with no network access; it currently runs in the client. The model no longer ranks anything."

**Trigger.** **Wed 2026-09-30, 18:00.** Fires if no route handler that accepts an authenticated request and returns a list ranked by the N2 module is merged to main.

---

### CUT 4 — the receipt's second and third surfaces (2.0 h) → **23.50**

**What is cut.** Rendering the receipt anywhere except `RecipeRecommendationModal.tsx`. No receipt on the inventory card, none in the dashboard list.

**Still honestly claimed.** The receipt exists, in the one place the score is presented in 2xl bold (:303-307). Every claim about decomposition is about that surface and says so.

**The poster must STOP saying:** ~~"Every score in the app opens into its terms."~~ Replace with: "The recommendation score opens into its terms."

**Trigger.** **Wed 2026-09-30, 18:00.** Fires if the receipt has not rendered end-to-end from real data on a machine that is not its author's.

---

### CUT 5 — N2's property-based test generator (4.0 h) → **27.50**

**What is cut.** The generator (hypothesis / fast-check) and its shrinking. Replaced by 12 hand-written table-driven cases over the committed fixtures, asserting the same three properties on fixed inputs.

**Still honestly claimed.** The three invariants are still asserted and still green: every line item resolves to an input row; total equals the sum of line items; permuting input order does not change output. The third is additionally proven at system level by N4's 20-shuffle run, which is the stronger evidence anyway.

> **⚠ Two corrections 2026-09-13.**
>
> **(i) That last clause undermines this cut's position in the ordering.** This list claims to be
> *"ordered by inverse load on the single number we are publishing"*. If the 20-shuffle run is the
> stronger evidence *anyway*, then the generator was never carrying load on the published number and
> belongs at Cut 1 or Cut 2, not Cut 5. **We have not reordered the list** — reordering cascades
> through every running total below and through five dated triggers, and the ordering is a team call,
> not a repair. **The inconsistency is recorded here instead: on this list's own stated criterion,
> Cut 5 is mis-placed and should be taken earlier than its position implies.**
>
> **(ii) `hypothesis` and `fast-check` are not interchangeable, and neither is simply available.**
> `hypothesis>=6.141.1` is in `backend/pyproject.toml:24` — a **Python** library. `fast-check` does
> **not** appear in `web/package.json` at all, so it would be a **new dependency**, not a switch. Which
> of the two is even relevant depends on **open team decision (b) — Python or TypeScript for the
> scorer**, which this file assumes as TypeScript-under-Jest without saying so and
> [`13-name-the-test.md`](13-name-the-test.md) assumes the same way. **We are not settling (b) here.**
> The 4.0 h price is for whichever generator the language decision implies, and if (b) lands on
> TypeScript the price must also carry adding `fast-check`.

The corpus is exhaustively enumerable — 50 recipes, 448 ingredients, 528 map rows, re-parsed today — so "exhaustive over the corpus" is a truthful and *available* phrase where "property-tested" is not.

**The poster must STOP saying:** ~~"The scorer is property-tested."~~ Replace with: "The scorer's three invariants are asserted over 12 cases and over all 500 offline cells."

**Trigger.** **Thu 2026-10-01, 18:00.** Fires if the generator has not produced one green CI run, or has been red for more than 48 h.

---

### CUT 6 — N5a's affected-row-count checks in the transfer route (3.5 h) → **31.00**

**What is cut.** Inspecting affected row counts so `success: true` stops being returned for writes that did not happen. **⚠ Corrected 2026-09-13 — this sentence conflated two different writes on two different paths and stamped the conflation "both re-confirmed today".** The UC20 defect proper is on the **forward** path: `transfer/route.ts:93–96` marks the shopping item with `.update({ is_checked: true })`, `:98` checks only `checkError` — which is **null when the update matches zero rows** — so the item is pushed to `transferredItems` and counted by `:112`. **There is no DELETE on `shopping_list_items` anywhere in the file.** The `.delete()` at `:170` is against **`user_inventory`**, on the **reverse/undo** path, and never touches `transferred_count`; it is a *second*, separate unchecked write and is described as such from now on, not folded into UC20. Both statements re-read in the tree today. [`13-name-the-test.md`](13-name-the-test.md) T11 carried the same conflation and is corrected there too.

**Still honestly claimed.** This is the P1a reversal we are proudest of: the *real* UC20 defect is better than the one we originally claimed, and we corrected ourselves in public. It is found, evidenced, and re-confirmed in the working tree on 2026-09-13. Not fixed, priced at 3.5 h, and the reason stated: it is a silent-data-loss bug on the shopping-list→inventory path, not on the receipt's read path.

**The poster must STOP saying:** ~~"We fixed the silent data loss in the inventory transfer route."~~ Replace with: "We found the silent data loss that our own first report had mis-described, and we say so."

**Trigger.** **Fri 2026-10-02, 18:00.** Fires if cumulative feature hours exceed **90% of the plan as it then stands** and the transfer-route branch is not merged. *Recomputed thresholds to read aloud: **77.40 h** if only Cut 1 has fired (86.00 h plan), down to **65.25 h** if Cuts 1–5 have all fired (72.50 h plan).* **⚠ Corrected 2026-09-13:** this read *"> 78"*, an absolute against a plan that shrinks — once Cuts 1–5 return their 22.25 h the plan is 72.50 h and cumulative hours **can never reach 78**, so this trigger was structurally unreachable in precisely the scenario it exists for. See the burn-line note above.

---

### CUT 7 — the live baseline, entirely (remaining 2.5 h) → **33.50**

**What is cut.** All live Gemini calls. No baseline number from today's build at all.

**Still honestly claimed.** The baseline becomes a *source-level* claim, which is stronger than it sounds and costs zero hours: `match_score` is model-authored (`inventory_recommender.py:50`), the scoring rules are English prose addressed to a language model (:159-161), and — **⚠ replacing the withdrawn grep claim, 2026-09-13** — **the schema constrains the field the user never sees and declines to constrain the one they do**: `num_recipes: int = Field(default=5, ge=1, le=10)` at **:42** has its bounds *enforced*, while `match_score: int  # 0-100` at **:50**, on the same model, carries its range **only in a comment**. Nothing recomputes it. Two line numbers a reader can open side by side.

> **Why the grep is gone.** This paragraph previously ended: *"`grep -c \"validate\|verify\|check\"` over the 245-line file returns **0**. No line of code anywhere recomputes or checks that number. We can state that as fact with a file, a line and a command a reader can re-run."* **The command returns 0 only because it is case-sensitive.** `grep -in` returns **1** hit — line 238, `# Validate and return`, sitting on the `RecommendedRecipe(**rec)` call that *does* run Pydantic validation on the model's output. The one claim that survived all ten cuts, and appeared verbatim in the core poster paragraph below, was falsifiable by **the exact command this document invited a marker to re-run**. The :42/:50 contrast above is demonstrable, strictly stronger, and says the thing we actually mean.

We still cannot state a *rate*; that is what this cut costs.

**The poster must STOP saying:** ~~"Across 3 repeat runs the current build's scores disagree at rate X."~~ Replace with: "The current build's score is model-authored and unconstrained: `inventory_recommender.py:50` declares `match_score: int` with its range in a comment, while `:42` on the same model enforces `ge=1, le=10` on a field the user never sees." *(⚠ The earlier replacement sentence ended "and zero validation calls in 245 lines" — withdrawn 2026-09-13 as false; see above.)*

**Trigger.** **Fri 2026-10-02, 18:00.** Fires if the reduced snapshot from Cut 2 has still not been produced, or any live-call path has failed at two consecutive checkpoints.

---

### CUT 8 — N4's correctability measure (3.0 h) → **36.50**

**What is cut.** The recorded fraction of the 500 rankings whose order changes after one flagged line is corrected.

**Still honestly claimed.** Determinism and decomposition — the tautological half, which is still the whole of the receipt's promise. We lose the half that no careful coding can guarantee in advance, and we say *exactly that* rather than letting its absence pass unnoticed: "we did not measure whether correcting a line changes what the user is shown; we state it as the first thing Project 3 should measure, and the harness is committed and ready to measure it."

**The poster must STOP saying:** ~~"Correcting one line changes the ranking in N% of cases."~~ Replace with: "Correction is wired; its effect on ranking is unmeasured, and that is the open question we hand forward."

**Trigger.** **Sun 2026-10-04, 12:00.** Fires if the correction write path is not merged and writing.

---

### CUT 9 — N3's one-tap correction write path (6.0 h) → **42.50**

**What is cut.** The whole correction affordance. The receipt becomes read-only. (Cut 8 must already have fired — correctability cannot outlive the mechanism it measures, which is why it is cut first.)

**Still honestly claimed.** The receipt: a total, its line items, each with an inventory row id, an ingredient name, an expiry date, points and the rule that awarded them — all decomposing to the displayed total in 500/500 cells, byte-identical across 20 shuffles. The user can *audit* every number. They cannot yet *fix* one. That is a smaller claim and an entirely honest one, and it is still more than the app does today, where the number comes from a prompt.

**The poster must STOP saying:** ~~"Every line is correctable in one tap."~~ Replace with: "Every line is inspectable; correction is the next milestone and the scorer already takes corrected inventory as input."

**Trigger.** **Sun 2026-10-04, 12:00.** Fires if no merged PR makes a corrected line persist.

---

### CUT 10 — N5a's earlier-of-two expiry merge (3.5 h) → **46.00**

**What is cut.** Changing `item.expiration_date || existingItem.expiration_date` (`transfer/route.ts:66`, confirmed today) to the earlier of the two.

**Still honestly claimed.** The receipt prints the expiry date it read from the row, and the points that date earns under the published table. It is arithmetically faithful to the stored data. We then disclose, in one sentence on the poster and one paragraph in the report, that **the stored data can itself be wrong**: restocking overwrites the stored expiry with the incoming one while summing quantities, so fresh spinach on old spinach makes the aggregate row look fresh. Found, evidenced, priced at 3.5 h, not fixed. This is the cheapest cut on the list to *disclose* (≈0.5 h of writing) and the most expensive to leave silent, because silence would make the receipt's freshness claim untrue rather than merely incomplete.

**The poster must STOP saying:** ~~"The dates the receipt prints are the true earliest expiry for that ingredient."~~ Replace with: "The receipt prints the stored expiry date; we found and did not fix a restock merge that can overwrite it with a later one, and here is the line number."

**Trigger.** **Sun 2026-10-04, 23:59 — feature freeze.** Unmerged is cut, automatically, no discussion.

---

## THE IRREDUCIBLE CORE — **54.00 h**

What remains after all ten cuts. Nothing here has a trigger, because nothing here may be cut.

| Item | h | Why it cannot go |
|---|---|---|
| **N1a** Claim freeze: Results paragraph with numeric blanks, each blank beside the exact query that fills it; sentences with no query deleted; committed by **2026-09-15** | 3.0 | The pre-mortem's top-ranked prevention by failure-prevented-per-hour. It is also what makes this cut list executable — you cannot delete a poster sentence on schedule unless the sentences exist in week 1. |
| **N1b** One-command environment: `make dev` / devcontainer + seeded local Supabase | 6.0 | P1a diagnosed this defect; the failure scenario spent it four times in private. It is the only line item that pays for itself in the same month, and the seeded fixtures are also the demo data — which is how the 12 h of "making demo data look real" never happens. |
| **N1c** Harness skeleton | 3.0 | N4's 500-cell run has to land somewhere, and it has to exist before the code it measures, or it will be written to agree with the code. |
| **N2a** Pure scorer: `(recipe_ingredients, inventory_rows, today) → {total, line_items[]}`; coverage half ported from `recipeMatch.ts` (188 lines, pure, dependency-free) | 8.0 | This is the project. |
| **N2b** Expiry half as a published integer table, Grocy's due score cited in a code comment, the "20 points per expired ingredient" term deliberately zero | 6.0 | Without the published terms there is no receipt, only a different opaque number. The zeroed term is a food-safety position we defend, and defending it in public is a deliverable. |
| **N2c** Fixtures and corpus loader over 50 recipes / 448 ingredients / 528 map rows | 4.0 | Feeds N4 and the demo both. |
| **N2e** Integration and review of the scorer | 2.0 | **⚠ Blank, flagged 2026-09-13 — and the blank is the finding.** In a table whose premise is *"Nothing here has a trigger, because nothing here may be cut"* and whose third column is headed *"Why it cannot go"*, this row's justification cell was **empty** — the clearest evidence that the core is partly what the author *kept* rather than what *cannot be cut*. **We are not inventing a justification to fill it.** The two honest resolutions: name the reason (if there is one) or **fold the 2.0 h into N2a**, which would leave the core total unchanged. **Open question for the team.** Until it is answered, this row should be read as *not yet shown to be uncuttable*. |
| **N3a** Render line items beneath the score in `RecipeRecommendationModal.tsx` (contract exists at :298, :303-307, :328-330) | 8.0 | An unpublished receipt is a unit test. |
| **N3b** Auth on the client→FastAPI call at `inventory/page.tsx:141` | 2.0 | It spends our Gemini quota for anyone who knows the URL, today. Two hours, and it is the only security fix that survives every cut — it is also the one the demo would otherwise expose live on a projector. **⚠ Contingent, flagged 2026-09-13:** if Cut 3 fires, the ranking runs client-side and the model *"no longer ranks anything"*, so `/inventory-recommend` has **no remaining caller** and this row authenticates a route that should be **deleted** (≈0.5 h, banking 1.5 h) rather than hardened. **Open question — does the Gemini narration survive? See Cut 3.** The 2.0 h figure is only correct on the branch where something still calls the route, and this file never says what that something is. |
| **N4a** Offline: 50 recipes × 10 pantries = 500 cells, displayed total equals sum of displayed line items, 500/500 | 7.0 | The number on the poster. |
| **N4b** 20 shuffles of inventory input order, ordering byte-identical | 2.0 | The claim that separates a deterministic scorer from a lucky one. |
| **N5a1** Reject non-positive and non-finite quantities at the write (`quantity \|\| 1` at `transfer/route.ts:65, :80, :167` against `DECIMAL(10,2) NOT NULL DEFAULT 1` with no CHECK) | 3.0 | Negatives persist and 0 silently becomes 1. **⚠ Justification corrected 2026-09-13 — it read "so the receipt would print points for food that is not there. This is the one security item the receipt's honesty is literally made of." That does not follow.** The scorer as specified never reads quantity at all: [`13-name-the-test.md`](13-name-the-test.md) T6 enumerates its branches — expired, ≤1 d, ≤3 d, ≤7 d, >7 d, NULL date, not in pantry, duplicate ingredient, 0-ingredient recipe — and **quantity is not among them**. The receipt's honesty against absent food is secured by **one `quantity > 0` filter predicate inside the pure scorer being written anyway at N2a (≈0 h)**, not by a 3.0 h write-path fix plus a DB migration on a route this same document elsewhere argues is off the receipt's path (Cut 1, Cut 6, Cut 10). **Two open questions the team must settle, and we are not settling either:** (1) does the scorer filter non-positive quantities, and if so is that predicate in N2a rather than here? (2) is the write-path fix still wanted on **data-integrity** grounds — which is a defensible reason, just not the receipt-path reason printed here? **If N5a1 is demoted to a disclosed-not-fixed finding alongside Cuts 6 and 10, the irreducible core is 54.00 − 3.00 = 51.00 h.** The 54.00 h total below is left standing because the decision is not ours. |
| **TOTAL** | **54.00** | *Re-added 2026-09-13: 3.0 + 6.0 + 3.0 + 8.0 + 6.0 + 4.0 + 2.0 + 8.0 + 2.0 + 7.0 + 2.0 + 3.0 = **54.00** — the sum is correct. The running totals down the cut list were re-added too: the ten cuts return 8.75 + 3.5 + 4.0 + 2.0 + 4.0 + 3.5 + 2.5 + 3.0 + 6.0 + 3.5 = **40.75 h**, and 94.75 − 40.75 = **54.00**. Every "→ **N**" figure in the cut headings checks out. What does not check out is what the 54.00 **covers** — see the three notes above (N2e, N3b, N5a1) and the budget correction at the top of this file.* |

**54.00 h of feature work + 60 h of report/poster/demo/integration = 114 h of 160. Slack: 46 h.**

> **⚠ Read that line with the correction at the top of this file.** The 46 h of slack holds only if the
> 54.00 h already includes writing T3, T4, T6, T8 and T9 — the tests of five claims this core retains.
> If it does not, the core is **54.00 + 22.00 = 76.00 h**, total commitment is **136 h of 160**, and
> slack is **24 h**. Separately, if N5a1 is demoted (see its row above) the core is **51.00 h**. Three
> figures are therefore live — **51.00 / 54.00 / 76.00** — and **the team must pick before any of them
> is printed.** We are not picking.

What the core alone lets the poster say, with every blank filled by a committed query:

> The app prints a match percentage in 2xl bold that a language model wrote and no line of code recomputes. On one Pydantic model, `num_recipes: int = Field(default=5, ge=1, le=10)` at `inventory_recommender.py:42` has its bounds enforced, while `match_score: int  # 0-100` at `:50` carries its range only in a comment — the one field the user sees is the one field the schema declines to constrain. We replaced it with arithmetic and published the terms. Across 50 recipes × 10 pantries, the displayed total equals the sum of the displayed line items in 500 of 500 cases, and the ordering is byte-identical across 20 shuffles of the input.

*(⚠ Corrected 2026-09-13. The first sentence previously read "…no line of code **checks** — `inventory_recommender.py:50`, and **zero validation calls in 245 lines**." That second clause was false — `grep -in "validate\|verify\|check"` returns line 238, `# Validate and return`, on a call that does run Pydantic validation — and it appeared here, in the one paragraph this document says survives all ten cuts. The :42/:50 contrast replacing it is demonstrable, is strictly stronger, and is the claim we actually mean. See Cut 7.)*

That paragraph survives all ten cuts. Every sentence in it has a query behind it. It is a number, not a panel.

---

## NOT ON THIS LIST, DELIBERATELY

**Never cut, at any hours remaining:** all 12.0 h of N1. If the team is far enough behind that N1 looks cuttable, the correct response is to cut Cuts 8–10 early, not to cut the thing that makes cutting possible.

**Never added, at any hours remaining** — the pre-mortem's 26 h of unrequested visible features, named now so that adding one is a visible violation rather than a judgment call: the Waste Warrior badge, the explanation-verbosity setting, the animated timeline, and anything else that renders. Adding a visible feature after 2026-09-20 requires cutting a named item from the core, and there is nothing in the core that can be cut.

**Not cuttable, but re-shaped:** the 60 h of overhead. The demo is a 3-minute recorded screen capture of the harness run and one receipt, seeded from the same fixtures as N2c — not a live click-through, which is what turns 10 h into 22.

**If the core itself slips after 2026-10-04:** there is no Cut 11.

> **⚠ Corrected 2026-09-13 — the designated last-resort lever returns almost no hours.** This section
> read: *"The last lever is N, not honesty — shrink the corpus from 50 × 10 to 50 × 3 and print the
> smaller number with the same query beside it. '150 of 150' is a true sentence. A 500 we did not run
> is not."* **The 500 cells are evaluated by a pure offline function whose runtime is milliseconds.**
> Shrinking N does not return compute time, because compute time was never the cost. The **only**
> hours it can return are unwritten fixture-authoring hours inside N2c's 4.0 h — a fraction of them,
> and only if the seven additional pantries have not already been written. Priced honestly:
> **saves ≈2 h of fixture authoring, and only if invoked before the pantries are authored in W1.**
> Invoked after 2026-10-04, as this section proposes, it returns **zero**.
>
> **What it is still good for is unchanged and worth keeping:** *"150 of 150" is a true sentence and a
> 500 we did not run is not* — so if the corpus is short, print the short number with its query. That
> is an **honesty** lever, not an **hours** lever, and this section had it filed under the wrong
> heading.
>
> **Open question — what actually returns hours at that point?** The candidates we can see are
> already spent: dropping correctability to a stated open question **is Cut 8**, and by this point
> every cut has fired. Shipping the receipt behind a feature flag on a single pantry is the only
> unspent idea we have, and **it is not costed anywhere, so we are not pricing it here.** The honest
> statement of this section today is: **after 2026-10-04 there is no lever left that returns hours,
> which is precisely why the ten cuts above have dated triggers.**