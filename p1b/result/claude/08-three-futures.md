# Three Futures — SAFE, BOLD, WILD

**Prompt:** P06 · **Run date:** 2026-09-13 · **Model:** Claude Opus 5 (1M context), `claude-opus-5[1m]`

Kept deliberately distinct; the assignment's instruction is not to blend them. Each carries a kill signal that is an observable condition with a number and a date.

---

# Three Futures for Epicourier

**Verification note (2026-09-13).** Every repository claim below was re-checked against the working tree today by reading the file. Market claims were re-fetched live this session where possible: Plan to Eat ✓, Grocy ✓, Mealime ✓. **Could not verify this session** (WebSearch budget exhausted at 200/200; USDA FSIS 403, FDA 404, foodsafety.gov 403, Samsung Food support 404): Samsung Food's behaviour and any regulator's date-label guidance. Those remain as the survey left them.

> *Corrected 2026-09-13:* **"and nothing below leans on them" was false when written.** BOLD's whitespace claim leans on Samsung directly — *"Samsung Food confirms after cooking — all three correct the pantry after the fact"* is the sentence that establishes BOLD's gap. Samsung Food+ has since been re-fetched **first-party** through the Wayback capture `20260827152331` ([`17-gap-closing.md` §1](17-gap-closing.md)), which confirms the expiry-prioritising Food List search and the after-cooking Food List update — and adds a fact this file never mentioned: every Food+ feature involved is tagged *"Exclusively on mobile app"*, while Epicourier is a web application. BOLD's G3 paragraph is amended below. No claim in this file rests on regulator date-label guidance; that half of the sentence stands.

---

## New facts from today's repository read that change the options

These are things the brief did not have. Each was re-grepped, not remembered.

**F1 — The corpus is 50 recipes, not thousands.** `backend/dataset/recipes-supabase.csv` = 50 data rows; `ingredients-supabase.csv` = 448; `recipe_ingredient_map-supabase.csv` = 528. `format_recipes_for_prompt(recipe_data, limit=80)` (`inventory_recommender.py:107`) therefore truncates *nothing* today. This is the single most important fact for scoping: **a deterministic ranker over this corpus can be exhaustively tested in a unit suite.** Every "AI" claim we make is a claim about 50 recipes, and we can enumerate all of them. *Corrected 2026-09-13:* exhaustive **on the recipe axis only**. A ranker's input is (recipes × pantries) and the pantry space is unbounded, so every "exhaustive" claim in this file — including the 50 × 10 = 500-cell figure — means *all 50 recipes against a fixed, stated set of seeded pantries*: a full enumeration of one axis and a sample of the other. Say it that way.

**F2 — The match score the UI prints is written by the model, not computed.** `RecommendedRecipe.match_score` (`inventory_recommender.py:51`) is a model-authored integer. The "formula" at lines 159–162 — `Base score = (available ingredients / total required) * 100` — is *prompt text addressed to Gemini*, not code. `RecipeRecommendationModal.tsx:304` renders it as `{recipe.match_score}%` in 2xl bold. Same for `expiring_ingredients_used` (line 53), rendered at `:324-333` as "Uses N expiring ingredients: …". Nothing recomputes either from the dates we hold. **We already ship exactly the thing the survey says is the market's weakness — a number that is not a reason — and ours is worse, because ours is not even arithmetic.**

**F3 — The brief overstates the expired-food exposure, and the true version is sharper.** Priority rule 1 (`:153`) prioritises `⚠️ EXPIRING SOON` and `⏰ USE SOON` — it does **not** name `❌ EXPIRED`. Rule 5 (`:157`) says only: `NEVER: Do not recommend recipes that ONLY use ❌ EXPIRED items`. So the accurate statement is: *expired items are passed into the prompt, labelled, and permitted in any recipe that also contains one non-expired ingredient.* That is still a food-safety decision made by prompt text, but say it precisely or the fact-checker will correct us the way SuperCook was corrected.

**F4 — We have a clean deterministic asset already.** `web/src/utils/inventory/recipeMatch.ts` is 188 lines, pure, zero dependencies, already unit-tested by the previous team. `calculateRecipeMatch` (`:29`) does set-membership on `ingredient_id` and **ignores quantity and expiry entirely** — so a row with `quantity = 0` (or negative, per the `|| 1` bug) or an item three weeks past date still counts as 100% available. That is a hole and a gift: the hole is a defect we can name, and the module is the seed of an auditable ranker that needs no new infrastructure.

**F5 — A second unmitigated hole, worse than the share route, and executable with one curl.** `web/src/app/api/users/route.ts:8-13` is `GET /api/users`, no `auth.getUser`, using `supabaseServer` — which is built from `SUPABASE_SERVICE_ROLE_KEY` (`web/src/lib/supabaseServer.ts:6`). It returns `id, fullname, email` for **every user**, ordered by signup. The service-role key bypasses RLS, so unlike the share route there is not even a policy that *might* catch it. And `grep -rn '/api/users' web/src web/__tests__ web/e2e` returns only the route's own comments: **it has zero callers.** Deleting it is a five-minute, zero-regression change. ~~This is the only finding in our whole audit that is a genuine executed attack rather than a source grep — it fixes the methodological caveat by existing.~~ *Corrected 2026-09-13:* that was false. F5 was produced by reading `web/src/app/api/users/route.ts` and running `grep -rn '/api/users'` — a source read and a grep, **exactly the method it claimed to escape**; nothing has been executed. The accurate, narrower claim: **this is the finding we can convert into an executed attack for the least work** — one curl against a local dev server with two seeded users, priced at 2 h below as `p1b/scripts/attack_users_endpoint.sh`, which does not yet exist. The methodological caveat is repaired when that script has been run and its output recorded, and not before.

**F6 — The browser talks to FastAPI directly, unauthenticated.** `web/src/app/dashboard/inventory/page.tsx:29` reads `NEXT_PUBLIC_PYTHON_BACKEND_URL` and `:141` fetches `${BACKEND_URL}/inventory-recommend` **from the client**, bypassing Next.js auth. `backend/api/index.py:27` sets `allow_origins=["*"]` and `/inventory-recommend` has no auth at all. Anyone can spend our Gemini quota.

**F7 — UC17's free-text preference is unreachable from the UI.** The payload at `page.tsx:146-149` sends only `inventory` and `num_recipes`. `preferences` exists in `types/data.ts:594` and in the Pydantic model but is never populated by any screen. The reachable untrusted-text surfaces are UC5's `goal` and the ingredient `name` strings — a smaller, more honest claim than "two unbounded fields".

**F8 — The UC17 → shopping-list loop is not closed.** `handleAddMissingToShoppingList` (`page.tsx:172-176`) is `// TODO` plus a "Coming Soon" toast. The "Add N Missing to List" button at `RecipeRecommendationModal.tsx:405-415` does nothing.

**F9 — UC5's `reason` is a template string.** `recommender.py:210-213`: `f"Selected because it aligns with goal '{goal_text}' and differs from other meals."` The goal, echoed back. `create_meal_plan` also never returns a `recipe_id`.

**Verified market text, re-fetched today.** Plan to Eat, on removing the pantry: *"any item that was listed on your Pantry would not appear on your shopping list with the assumption that you already have it in your kitchen"*; *"Anytime we remove shopping list items automatically, we are asking for trouble"*; *"There is no way for your real inventory and your Plan to Eat inventory to ever remain synchronized"*; *"looking through your cupboards is the only way you are going to get a 100% accurate list on every shopping trip."* Grocy's due score, changelog v4.7.0: *"1 point for each due soon ingredient (based on the stock setting 'Due soon days')"*, *"10 points per overdue ingredient"*, *"20 points per expired ingredient"*, *"(or else 0)"*. Mealime's own homepage today: *"Mealime will shut down on October 21, 2026."*

---

## Budget frame applied to all three

The pre-mortem's finding is the binding constraint, not the market. All three plans below assume the same fixed overhead, leaving **~100 h for feature and test**:

| | h | Why |
|---|---:|---|
| Shared environment, built **once** | 12 | One person builds a `make setup` + devcontainer; the other three *verify by running it* and log the time. Kills the 4× private-setup loss. |
| Report / poster / demo, started week 1 | 24 | The Results paragraph is written in week 1 **with numeric blanks and the exact query beside each blank**. Any sentence whose query does not exist is deleted that day. |
| Integration + reserve | 24 | Merge to `main` daily, not Friday. |
| **Feature + test** | **100** | |

Each option below therefore commits to ≤ 100 h and names its frozen claims. *(Corrected 2026-09-13: SAFE does not. See the re-total under SAFE — it is 108 h.)*

---

## Open team decisions this document does not settle (added 2026-09-13)

Four questions are answered differently by different files in this column. Every one of them changes a number or a deliverable below. **This file flags them and picks none of them** — a document that silently picks a side is worse than one that shows the fork.

| # | The fork | Where it is live |
|---|---|---|
| **(a)** | **Pivot or stay.** Every other deliverable builds the receipt inside Epicourier; [`09-pivot.md`](09-pivot.md) returns *Pivot* and its header says the dissent is unresolved. | This file's Recommendation assumes *stay*. It is not evidence against 09. |
| **(b)** | **Python or TypeScript for the scorer.** [`11b-mission-final.md`](11b-mission-final.md) says "a pure **Python** function"; [`12-milestones.md`](12-milestones.md) N2 and [`14-cut-list.md`](14-cut-list.md) N2a port it beside `recipeMatch.ts`. | SAFE and WILD below both name `web/src/utils/inventory/rankRecipes.ts` — **TypeScript, chosen by implication, not by decision.** The 14 h estimate is for that language and does not survive unexamined if the team picks Python. |
| **(c)** | **Share route in scope or out.** [`12-milestones.md`](12-milestones.md) and [`14-cut-list.md`](14-cut-list.md) cut N5b (8.75 h) to restore a margin. | SAFE below prices the `share/route.ts` hardening (6 h) **and** the `shopping_list_shares` migration (3 h) *in*. Those 9 h would more than cover SAFE's 8 h overrun — but removing them is decision (c), not arithmetic, and this file does not remove them. |
| **(d)** | **Expired items excluded in code, or scored at zero.** BOLD removes them from the usable pool entirely; SAFE, [`11b`](11b-mission-final.md) and [`12`](12-milestones.md) set the Grocy expired term to **0 points**, which is not the same thing and does not answer F3. | See the correction under SAFE's thesis. |

---

# SAFE — **The Receipt**

> *We stop letting a language model invent the percentage we print in 2xl bold, and compute it instead — from a published integer formula, per recommendation, with a line-item receipt naming each pantry item, its expiry date, its points and the running total, every line correctable in one tap. Gemini stays, demoted from judge to copywriter, and we measure how often it used to name food you do not own.*

This is not "fix the bugs and add a panel." The thesis is specific and arguable: **an auditable ranking formula already exists in the wild — Grocy publishes theirs — so the contribution is not the formula, it is publishing ours per-recommendation, and deliberately setting one term differently.** Grocy awards *"20 points per expired ingredient"*. We publish ours and set expired to **0**, and defend that choice on the poster (F3). That is a defensible engineering position with a named rival, a named disagreement, and a reason.

> *Corrected 2026-09-13 — two defects in the paragraph above, neither of which this file can repair by itself.*
>
> **1. The receipt as specified is not the differentiator the column now claims.** SAFE's receipt is *named item + expiry date + points + correctable* — three facts and an affordance. The narrowed claim the column holds today ([`11b-mission-final.md`](11b-mission-final.md)) is a **four-way conjunction**: the named pantry item, its actual date, **the nutrient constraint**, and **the reason for a swap**. SAFE contains neither of the last two, so as priced it ships something Grocy, Remy, RecipeFix and Mealie already cover between them, and it does not contain either of the two terms that are the surviving differentiator. The tables exist — `nutrient_goals` and `nutrient_tracking` are real (`supabase/migrations/20251125000000_add_nutrient_goals_table.sql`, `20251122000000_add_nutrient_tracking_table.sql`) — so a nutrient term is buildable. **What a nutrient term and a substitution-reason term would cost is not estimated anywhere in this column, and no estimate is invented here**, which matters because SAFE is already 8 h over budget (see the re-total below). *Open question:* price those two terms, or drop the differentiator framing and pitch SAFE as what it demonstrably is — an honesty-and-defect-repair milestone that makes our own printed number reproducible. **The second is the pitch this file's Recommendation now uses.**
>
> **2. Setting the expired term to 0 does not answer F3.** Zero points means an expired item neither raises nor lowers a recipe's rank, so the hole F3 names — *expired items are permitted in any recipe that also contains one non-expired ingredient* — is **untouched by SAFE**. The reason that would make the disagreement with Grocy "defensible" is also not written down anywhere: the nearest sentence in the column, [`11b`](11b-mission-final.md)'s *"because we will not rank food we have ourselves labelled expired into a meal"*, describes **exclusion**, which is what BOLD does and what a zero score does not do. That fork is [open decision (d)](#open-team-decisions-this-document-does-not-settle) and **this file does not settle it**. Until it is settled, what SAFE does about expired items in recommendations is unknown, and the one-sentence public defence — *"we do not rank food up for being expired, and we do not rank recipes down for containing it, because ___"* — is a blank that whoever makes the decision has to fill.

### What four students build and test in one month (108 h — over budget)

> *Corrected 2026-09-13:* this header read **"~96 h"**, a figure nobody had added up. Re-totalled from the line items below, by adding them:
>
> - **New production files:** 14 + 8 + 10 + 10 + 3 = **45 h**
> - **Edited production files:** 6 + 8 + 6 + 6 + 3 = **29 h**
> - **Tests:** 10 + 4 + 5 + 4 + 5 + 2 + 4 = **34 h**
> - **Total: 108 h.**
>
> The budget frame two sections above allots **100 h** to feature and test, so **SAFE is 8 h over, and it is the only one of the three options that does not fit** — BOLD re-totals to 98 h (57 + 11 + 30) and WILD to 88 h (60 + 2 + 26), both correct as printed. For comparison, [`12-milestones.md`](12-milestones.md) prices the NOW plan at **100.75 h** after re-costing N4, i.e. already **0.75 h over** the same 100 h capacity; at 108 h SAFE is 8 h over. *(Corrected 2026-09-13: an earlier version of this sentence quoted 12 as calling a "5% margin the failure mode" — 12 struck that phrasing the same day as a false attribution to our own pre-mortem, and the margin is in any case now negative, not 5%.)*
>
> **Eight hours must come out, and this file does not choose which.** The largest single candidates are the 6 h `share/route.ts` edit and the 3 h `shopping_list_shares` migration — but cutting those is [open decision (c)](#open-team-decisions-this-document-does-not-settle), which [`12`](12-milestones.md) and [`14`](14-cut-list.md) answer one way and this file answers the other. Two further items below are *unpriced and additional to 108 h*: the `recipeMatch.ts` quantity change (see the note on `rankRecipes.ts`) and the kill-signal baseline run. **The honest state is: SAFE as written does not fit, and what comes out is an open question.**

*First production edit, day 1, for a team that has never made one:* `rm web/src/app/api/users/route.ts` — closes an unauthenticated service-role PII endpoint, and gives everyone the merge-and-deploy muscle before anything hard.

> *Corrected 2026-09-13:* "zero callers" was a grep scoped to `web/src web/__tests__ web/e2e` (F5). Re-run **over the whole repository** today, `/api/users` occurs in 14 files: the route itself, the P1a context dumps (`p1a/scripts/context.txt`, `context_slim.txt`, `context_mini.txt`, `gather_context_mini.sh`), the Codex transcript — and **`p1a/traceability/p1a_claude_step7.md:46`, which maps `/api/users` to "profile retrieval" in our own traceability matrix.** There is still no application caller, so the runtime claim holds and the deletion is safe; but in a course graded against a twenty-use-case traceability matrix this is not a "zero-regression change" while that row stands. **Added to the day-1 task:** strike or annotate the `/api/users` row in `p1a_claude_step7.md` and note the removal in the matrix. Five minutes, and it removes the deletion's obvious objection.

**New production files**
- `web/src/utils/inventory/rankRecipes.ts` — pure. `rankRecipes(recipes, inventory, today)` → `{recipe_id, score, terms[]}` where each term is `{ingredient_id, ingredient_name, kind: 'expired'|'overdue'|'due_soon'|'available'|'missing', expiration_date, points}`. Reuses `calculateRecipeMatch` from `recipeMatch.ts` for the coverage half; the expiry half ports Grocy's published integers **with the citation in a code comment** and `expired: 0`. Invariant: `score === terms.reduce(sum of points)`. *(14 h)*
  - *Corrected 2026-09-13 — the reuse cannot be "unchanged".* `calculateRecipeMatch` takes `inventoryItems: { ingredient_id: number; ingredient?: Ingredient | null }[]` (`recipeMatch.ts:29-31`) and **never receives quantity**, so its set-membership test at `:54` cannot exclude a `quantity <= 0` row — and the test below that asserts exactly that would fail against the function as it stands. Two ways out, both real: widen the inventory parameter to carry quantity and update `recipeMatch.ts`'s existing unit tests, **or** have `rankRecipes` drop non-positive rows before calling it and stop attributing the assertion to `recipeMatch.ts:54`. **No edit to `recipeMatch.ts` is listed or priced in this option, and neither route is estimated here — whichever is chosen, its hours are additional to the 108 h above.**
  - *Language note (2026-09-13):* the `.ts` filename is [open decision (b)](#open-team-decisions-this-document-does-not-settle) settled by implication — [`11b-mission-final.md`](11b-mission-final.md) says the scorer is a pure **Python** function. Not resolved here; the 14 h assumes TypeScript.
- `web/src/utils/inventory/verifyExplanation.ts` — `verify(text, inventory)` → `{ok, unknownTerms[]}`. Any ingredient name the model asserts that is not in the user's pantry is flagged; the sentence is suppressed, not silently kept. Matches against the 448-row catalog. *(8 h)*
- `web/src/app/api/recommendations/rank/route.ts` — authenticated via `createClient` from `@/utils/supabase/server`, reads the caller's `user_inventory` under RLS, ranks server-side, returns list + receipt. Replaces the client→FastAPI call and closes F6. *(10 h)*
- `web/src/components/inventory/RecommendationReceipt.tsx` — the line items, the total, and a **"this is wrong"** control deep-linking to the inventory row. *(10 h)*
- `supabase/migrations/2026xxxx_shopping_list_shares.sql` — the missing table, `ENABLE ROW LEVEL SECURITY`, and policies. *(3 h)*

**Edited production files**
- `RecipeRecommendationModal.tsx:304` — computed score replaces `recipe.match_score`; `:343-419` mounts the receipt. `:324-333` recomputes `expiring_ingredients_used` from dates instead of trusting the model. *(6 h)*
- `web/src/app/dashboard/inventory/page.tsx:141` → `/api/recommendations/rank`; `:172` implements `handleAddMissingToShoppingList` against the existing `POST /api/shopping-lists/[id]/items`, closing F8. *(8 h)*
- `web/src/app/api/inventory/transfer/route.ts` — reject non-positive/non-finite quantity at `:65,:80,:167` (replacing `|| 1`); runtime-validate `location` against the four values; **and the real UC20 bug: add `.select("id")` to the two `shopping_list_items` updates — `is_checked: true` at `:95` (transfer) and `is_checked: false` at `:154` (undo) — and treat a zero-row result as a failure** so `transferred_count` can no longer report transfers that did not happen. *(6 h)*
  - *Corrected 2026-09-13:* this read "the update at `:93` and the delete at `:152`". Read today, **both calls are updates and neither line number points at a call**: `:93` is the `const { error: checkError } = await supabase` binding and `:152` the `await supabase` of the second update; the calls are at `:95` and `:154`. **There is no `shopping_list_items` delete in this route at all.** The only `.delete()` is at `:170`, against `user_inventory` — a different table with a different failure mode (the read-modify-write at `:167` that [`09-pivot.md`](09-pivot.md) §0 records as an *unexecuted* concurrency hypothesis). That delete is **not** covered by this 6 h line item and is not priced here; if the team wants it, price it separately. Note also that [`12-milestones.md`](12-milestones.md) cites this site as `:98`, which is the `if (checkError)` test rather than the call — 08 and 09 are corrected here, `12` is not ours to edit.
- `web/src/app/api/shopping-lists/share/route.ts` — cookie-bound client, `auth.getUser`, ownership query, `expiryDays` clamped to integer 1–30. *(6 h)*
- `backend/api/inventory_recommender.py:140-181` — the prompt no longer asks for `match_score`; it asks only for prose about a ranking it is handed. *(3 h)*

**Tests**
- `web/__tests__/unit/rankRecipes.test.ts` *(new)* — over the real 50-recipe corpus (F1): score is an integer; determinism across 1,000 input shuffles; each term's points equal the published table; **`score === Σ terms.points` for all 50 × 10 seeded pantries** (the receipt adds up); `quantity <= 0` is never "available" *(corrected 2026-09-13: this assertion belongs to `rankRecipes`, not to `recipeMatch.ts:54` — that function never sees quantity (F4 and the note above), so as written the test asserts a behaviour the reused code cannot have)*. *(10 h)*
- `web/__tests__/unit/verifyExplanation.test.ts` *(new)* — the two real hallucinations the pre-mortem recorded, plus synthetic cases. *(4 h)*
- `web/__tests__/node/recommendationsRankApi.test.ts` *(new)* — mirrors the mocking pattern already in `web/__tests__/node/inventoryApi.test.ts` (`jest.mock("@/utils/supabase/server")`): 401 unauthenticated; receipt sums to score. *(5 h)*
- `web/__tests__/node/inventoryTransferApi.test.ts` *(edit existing)* — quantity `0`, `-5`, `Infinity`, `"3"`; and the zero-rows-affected case asserting `success:false`. *(4 h)*
- `web/tests/p1a/security-attack-cases.test.ts` *(edit)* — replace the two `toContain('.eq("user_id", user.id)')` greps with **executed** assertions against mocked clients, and say so in the report. This is the honest answer to the methodological caveat. *(5 h)*
- `p1b/scripts/attack_users_endpoint.sh` *(new)* — a real curl against a local dev server with two seeded users, before and after deletion. **One executed attack beats eleven greps.** *(2 h)*
- `web/e2e/ai-recommendations.spec.ts` *(edit)* — Playwright asserts the visible receipt lines sum to the visible headline number. *(4 h)*

### Frozen Results paragraph (written week 1)
> "Across `___` recommendations generated from `___` seeded pantries over the 50-recipe corpus, the current build named an ingredient absent from the pantry in `___` cases; after the change, `___`."
> **Query:** `npm test -- verifyExplanation` run against recorded baseline and post-change fixtures; count `unknownTerms.length > 0`.
>
> "`___`% of receipts sum exactly to the displayed score (target 100%, n=`___`)."
> **Query:** the `score === Σ terms.points` assertion count in `rankRecipes.test.ts`.
>
> "Median `___` ms per ranking, `0` calls to Gemini on the ranking path."
> **Query:** jest timing output; `grep -c generate_content` on the ranking code path.

### Biggest risk
The grader reads "we replaced the AI with arithmetic" as *removing* the AI from an AI project. Mitigation is structural, not rhetorical: Gemini stays and writes the sentence, and the headline result is only obtainable *because* it stayed — we can only report the before/after hallucination count by keeping the model and checking it.

### Kill signal
**By 2026-09-20 we will have run 100 recommendations across 10 seeded pantries against the *current, unmodified* build and counted how many name an ingredient the pantry does not contain. If that count is ≤ 3 of 100, we abandon the verified-rank framing** — the defect we claim to fix does not occur at a measurable rate, and a receipt for a correct number is decoration. (Fallback in that case: keep only the transfer/share/users defect work and re-pitch as a security milestone.)

> *Corrected 2026-09-13 — three things this gate needs and does not have.*
>
> **The 3-of-100 line has no derivation.** It is not computed from anything; the only base-rate evidence in the plan is *"the two real hallucinations the pre-mortem recorded"* — two observations with no denominator. We are not inventing a justification for it. Read it as what it is: **a pre-registered arbitrary threshold**, chosen before the data and binding because it was written down first, not because 3 is the right number. The same label applies to WILD's *70 of 100* and BOLD's *50% / 80% / 20-point* figures, each marked at its own kill signal.
>
> **The baseline run is unpriced and unowned.** Zero hours anywhere in the 108 h plan pay for it, and the only oracle this file describes for "names an ingredient the pantry does not contain" is `verifyExplanation.ts` — an 8 h deliverable *of the option this gate is supposed to authorise*. So the run is either circular (it needs the artifact it gates) or it is 100 manual transcript reads nobody has budgeted. **Open, and not filled in here: who runs the baseline, against what oracle, in how many hours, and where the count is recorded. Whatever that costs is additional to the 108 h.**
>
> **The date is probably impossible.** 2026-09-20 is seven days out and the run needs a working Gemini-backed dev environment, which the 12 h shared-environment line has not yet produced. The gate should move to the first date after the environment milestone lands — a date this file cannot set, because the environment milestone has no start date in it.

---

# BOLD — **"I'm not sure yet"**

> *Epicourier stops pretending it knows what is in your fridge: it ranks a week by the probability its ingredients are actually still there, and before committing seven meals it asks you exactly one question — the one whose answer would most change the plan. And it refuses to build a meal around food its own data says is past its date, saying so out loud instead of ranking it first.*

This is the only surviving half of G3, stated as the survey stated it: *nobody propagates that uncertainty into the recommendation — nothing ranks a plan by the probability its ingredients are actually present, and nothing asks a targeted verification question before committing a week.* SeePantry corrects usage, Fango makes shelf life adjustable, Samsung Food confirms after cooking — **all three correct the pantry after the fact; none let doubt reach the ranking before the fact.** *Amended 2026-09-13:* the Samsung leg is the item the verification note above listed as unverified, and this paragraph leans on it — the note's "nothing below leans on them" was wrong. Samsung Food+ is now **first-party**: the Wayback capture `20260827152331` of `samsungfood.com/food-plus/` carries the after-cooking Food List update and the expiry-prioritising Food List search, and also states that every Food+ feature involved is *"Exclusively on mobile app"* ([`17-gap-closing.md` §1](17-gap-closing.md)). That strengthens the leg on evidence and weakens the whitespace on relevance: the closest rival's version of this **does not exist on the web at all**, and Epicourier is a web app. Say both halves. It also answers Plan to Eat's published objection on their own terms: they retreated because *"there is no way for your real inventory and your Plan to Eat inventory to ever remain synchronized."* Correct. So do not claim synchrony — model the desynchrony and price it.

### What four students build and test in one month (98 h — re-added 2026-09-13: 57 new + 11 edited + 30 tests = 98, and it fits the 100 h frame)

*First production edit, day 1:* the same `rm .../api/users/route.ts` (F5).

**New production files**
- `supabase/migrations/2026xxxx_inventory_confirmation.sql` — `ALTER TABLE public.user_inventory ADD COLUMN last_confirmed_at TIMESTAMPTZ` plus the `CHECK (quantity > 0)` constraint the table never had. **Note the honest limit: this is a column on a row that `user_inventory` upserts and SUMS by `(user_id, ingredient_id, location)`. There are no lots. Every string in this product and this report says "item", never "lot."** *(5 h)*
- `web/src/utils/inventory/confidence.ts` — pure. `presenceProbability(item, today)` from a **published table** (days since confirmation × location × has-expiry), hand-written, never fitted, small enough to print on the poster. *(12 h)*
- `web/src/utils/inventory/nextQuestion.ts` — pure. `selectVerificationQuestion(plan, inventory)` returns the single item with the largest effect on plan rank, plus the two candidate re-rankings its answer produces. Deterministic tie-break. *(16 h)*
- `web/src/components/inventory/VerifyOneThingCard.tsx` — one question, three buttons (*Yes / No / Less than that*), and a live "this changes meals 2 and 5" preview. **One question, never a checklist** — a checklist is the pantry Plan to Eat deleted. *(12 h)*
- `web/src/app/api/recommendations/rank/route.ts` — as SAFE, but weighted by `presenceProbability`, plan confidence = weakest link. *(12 h)*

**Edited production files**
- `web/src/app/api/inventory/[id]/route.ts` — a confirm branch writing `last_confirmed_at`. *(5 h)*
- `backend/api/inventory_recommender.py:68-104, 152-157` — expired items leave the usable pool entirely and move to a separate "check or discard" block with an explicit refusal instruction, inverting rule 5 (F3). *(6 h)*

**Tests**
- `web/__tests__/unit/confidence.test.ts` *(new)* — monotonicity: p falls as days-since-confirmed rises; p = 1.0 immediately after confirmation; 0 ≤ p ≤ 1 always; freezer decays slower than fridge. *(8 h)*
- `web/__tests__/unit/nextQuestion.test.ts` *(new)* — selected item is the true argmax over **all 50 recipes crossed with a fixed, named set of N seeded pantries** — *corrected 2026-09-13: this read "by exhaustive enumeration (possible only because of F1)", which overclaims. F1 bounds the recipe axis only; `selectVerificationQuestion` searches pantry items × their possible answers × the resulting re-rankings, and none of that is bounded by a 50-recipe corpus. Drop "exhaustive": full enumeration of the recipe axis, a stated sample of the pantry axis, and **N has to be written into the test**, not left implied.* A pantry with exactly one ambiguous item always selects it; ties are stable. *(10 h)*
- `web/__tests__/node/inventoryConfirmApi.test.ts` *(new)* — 401; writes the timestamp; RLS-scoped. *(5 h)*
- `backend/tests/sihao/p1a/test_recommender_behavior.py` *(edit)* — **deliberately invert the currently-PASSING `test_marks_expired_ingredients_for_recommendation_priority`**, and state in the report that we inverted a passing test on purpose and why. *(4 h)*
- Calibration study, 8–12 testers, one week: of items we scored ≥ 80% present, what fraction were confirmed present when asked? **Explicitly not a waste study** — G2 is dead, and the closest published trial (JMIR Formative Research PMC9482070) ran 6 students for a month and found no change, concluding *"Large-scale studies with longer duration are needed."* We say that in the report rather than inviting someone else to say it. *(3 h)*

### Frozen Results paragraph
> "Of `___` items scored ≥ 80% likely present, `___` were confirmed present when asked (calibration error `___` points, n = `___` testers)."
> **Query:** `SELECT` over the confirmation log joined to the stored `presenceProbability` at ask-time.
>
> "The single verification question was answered `___` of `___` times it was shown, median `___` s to answer."
> **Query:** event log on `VerifyOneThingCard`.
>
> "In `___` of `___` cases the answer changed the top-3 meals."
> **Query:** stored pre- and post-answer rankings.

### Biggest risk
**The confidence number is unfalsifiable.** We have no ground truth for what is in anyone's fridge, so `p_present` is a prior dressed as a measurement — and if we print "78% confident" without being able to justify 78, we have done precisely what we accuse fourteen rivals of doing: shipped a number instead of a reason, one layer deeper and harder to catch. The only defence is to publish the table, never fit it, and report calibration solely against the confirmations we actually collect. *Corrected 2026-09-13:* and then say plainly what those confirmations are. **The calibration target is self-reported presence, not ground truth** — the kill signal below resolves itself against "how many are confirmed present when asked", which is the very instrument this paragraph has just declared unfit. A user who is asked "is the spinach still there?" may answer from memory, from the fridge, or from what they think we want to hear; **the direction and size of that bias are unknown to us**, so a measured calibration error of, say, 25 points cannot be split into model error and self-report error. Nothing in our data settles that, and no correction factor is invented here. Report the number as *"calibration against self-report, bias of unknown sign"*, or the poster repeats the original sin one layer further down.

### Kill signal
**By 2026-10-04 (end of week 3), across ≥ 8 testers, we abandon confidence-gating if either: (a) fewer than 50% of verification questions shown are answered, or (b) of items scored ≥ 80% present, fewer than 80% are confirmed present when asked — a calibration error above 20 points.** Either outcome means the number is not measuring anything, and shipping it would make us the fifteenth product with an unexplained score.

> *Corrected 2026-09-13 — as written this is a post-mortem, not a kill.* It cannot fire until `confidence.ts`, `nextQuestion.ts`, `VerifyOneThingCard` and the confirm API are all shipped **and instrumented**, and eight recruited testers have accumulated roughly a week of confirmations — three of the four weeks of a 98 h build. By the date it fires, essentially the whole budget is spent, so "abandon" buys back nothing.
>
> **Add an earlier gate that can actually abort, and keep 2026-10-04 as a reporting checkpoint:** *by end of week 1 (2026-09-20), have eight testers agreed in writing to a week of daily confirmations?* If not, conditions (a) and (b) can never be measured at all and BOLD is dead before the 16 h `nextQuestion.ts` line is started. That gate costs nothing but asking, and it is the only one in this option that fires while the money is still in the bank.
>
> *Two further honesty notes.* The 50% / 80% / 20-point figures have **no derivation** — treat them as pre-registered arbitrary thresholds, binding because they were fixed in advance, not because they were computed. And condition (b) is measured against self-report, not ground truth (see the risk paragraph above); condition (a), the answer rate, is the only one of the two that is cleanly observable.

---

# WILD — **Ask, Don't Store** (the Two-Minute Pantry)

> *Plan to Eat built our core mechanic, removed it, and published exactly why — so we build the Epicourier that believes them: no persistent inventory at all, just one question a week — "what's in there you're worried about?" — answered in free text in under two minutes and deleted after seven days. Then we run it head-to-head against our own full inventory (UC13–16) behind a flag and let the numbers decide which product we actually are.*

This is probably wrong. It is instructive because it takes the single most dangerous piece of refuting evidence in the entire survey — a major vendor tried our core mechanic and retreated, in writing — and converts it from a footnote we hope nobody reads into an experiment we ran. Nobody else in this market can run it, because nobody else has both arms.

### What four students build and test in one month (88 h — re-added 2026-09-13: 60 new + 2 edited + 26 tests = 88, and it fits the 100 h frame)

*Nothing is deleted.* Both arms live behind a flag so the demo shows both side by side; this is an A/B, not a regression.

**New production files**
- `supabase/migrations/2026xxxx_ephemeral_pantry.sql` — `ephemeral_pantry_note (user_id, raw_text, parsed jsonb, created_at, expires_at)`, RLS policies copied verbatim in shape from `user_inventory.sql:76-104` (the four policies are already written and reviewed — reuse, don't reinvent). *(4 h)*
- `web/src/app/dashboard/quick/page.tsx` — one textarea, up to five lines, optional "by when", submit. *(10 h)*
- `web/src/app/api/quick-pantry/route.ts` — authenticated POST/GET; entries past `expires_at` are never returned. *(8 h)*
- `web/src/utils/inventory/parseQuickPantry.ts` — pure. Split lines, fuzzy-match against the 448-row `Ingredient` catalog (trigram overlap; no new dependency), return `{ingredient_id | null, raw, byWhen}`. **This is where the hidden hours live.** *(24 h — deliberately the largest line item)*
- `web/src/utils/inventory/rankRecipes.ts` — the same ranker as SAFE, taking a parsed list. **The ranker must not know which pantry it came from; that is the experimental control and the reason this is cheap.** *(14 h)*

**Edited production files**
- `web/src/app/dashboard/inventory/page.tsx` — add a link. Remove nothing. *(2 h)*

**Tests**
- `web/__tests__/unit/parseQuickPantry.test.ts` *(new)* — 100 hand-written real free-text lines ("half a bag of spinach", "chicken thighs use by friday", "that yogurt"), expected parses, and the assertion that unmatched text never crashes the ranker. *(12 h)*
- `web/__tests__/node/quickPantryApi.test.ts` *(new)* — 401; TTL enforced; RLS scoping. *(6 h)*
- `web/__tests__/unit/rankRecipes.test.ts` *(new)* — **the same test table runs twice**, once from a `user_inventory` fixture and once from an equivalent quick-pantry fixture, asserting identical output. This is the experiment's validity check, and it is the test that makes the comparison mean anything. *(8 h)*
- Within-subject study, 8–12 testers, both arms, one session each. Measured: seconds to first recommendation, items entered, whether the top-3 differs. **Explicitly not waste** (G2 dead; PMC9482070). *(no build cost)*

### Frozen Results paragraph
> "Median time to first recommendation: `___` s (full inventory, n=`___`) vs `___` s (two-minute pantry, n=`___`)."
> **Query:** session timestamps, both arms.
>
> "`___` of `___` free-text lines resolved to a catalog ingredient."
> **Query:** `parseQuickPantry` fixture run.
>
> "The top-3 recommendation differed between arms for `___` of `___` testers."
> **Query:** stored rankings, both arms, per tester.

### Biggest risk
In a course graded against a twenty-use-case traceability matrix, "we built the version without the inventory" reads as **regression, however well-argued** — and the second risk is that the fuzzy matcher is exactly the kind of work that swallows the pre-mortem's 12 h of making demo data look real, because a parser that mostly works is indistinguishable from one that has been hand-tuned to the demo pantry.

### Kill signal
**By 2026-09-27 (end of week 2) we will have run 100 free-text pantry lines collected from ≥ 8 testers through `parseQuickPantry`. We abandon this arm if fewer than 70 of 100 resolve to a catalog `ingredient_id`** — below that the ranker sees a materially different corpus in each arm, the head-to-head is invalid, and we would be reporting a comparison between a parser and a product.

> *Corrected 2026-09-13 — the 100 lines are described two different ways and the gate needs the split made explicit.* The test plan above calls them *"100 hand-written real free-text lines"*, i.e. **written by us**; this gate calls them *"collected from ≥ 8 testers"*. They cannot be both. If they are team-written, the gate is self-graded and the fixture will drift toward whatever the parser already handles; if they are tester-collected, **the recruitment is unpriced** — the study line in this option says *"no build cost"*, which is true of the study and false of the recruiting.
>
> **The split, stated:** the 12 h `parseQuickPantry.test.ts` fixture stays team-written and is for unit tests only; the kill signal runs on a **separate held-out set collected from testers who have never seen the fixture**. *Open, and not filled in here: who recruits them, in how many hours, and by what date — those hours are additional to the 88 h above and are not estimated.*
>
> And the schedule does not work as printed: the gate falls on day 14 while the parser it runs is the plan's **largest single line item (24 h)**. The gate is only meaningful after the parser is finished, so either the parser is front-loaded into weeks 1–2 and the rest of WILD waits, or the gate moves. Either way the 70-of-100 line itself has no derivation — another pre-registered arbitrary threshold, binding because it was fixed in advance.

---

## Recommendation

> ### Correction 2026-09-13 — the warrant under this recommendation has been struck
>
> As first written, the case for SAFE opened on the decisive column: *"every confirmed rival ships a number rather than a reason."* **That is a supply-side finding and nothing more.** The 851-entry Reddit sweep run since ([`17-gap-closing.md` §2a](17-gap-closing.md)) swept eleven phrasings of *"explain why it recommended this"* across r/mealprep, r/Cooking, r/MealPrepSunday, r/ZeroWaste, r/selfhosted, r/grocy and r/EatCheapAndHealthy and returned **zero hits in any meal, pantry or recipe context**. "No rival explains" therefore no longer licenses "users want an explanation", and the sweep cannot tell us whether the demand is latent or simply absent. **SAFE is now the one option of the three with no demand-side evidence at all.**
>
> **And the same corpus points the other way for the two options this section demotes.** The strongest user quotes the team holds are BOLD's thesis and WILD's thesis, verbatim: *"glass cleaner shows up as one in stock but in reality I have none"* — Grocy's own maintainer, which is exactly "the pantry is wrong and the ranking does not know it" — and *"the ones that force you to enter every single ingredient manually are the worst"*, which is exactly "stop storing the inventory". Ranked by user evidence, the order below is **inverted**.
>
> The recommendation is nevertheless **retained**, re-argued on the single ground that survives — SAFE is the only option measurable inside the budget without recruited testers — and the market-gap warrant is struck rather than repaired. Whether measurability is enough to keep SAFE first is a team call; this file no longer claims the market answers it. (The same distinction [`11b-mission-final.md`](11b-mission-final.md) draws: the receipt is a **correctness** claim, not a desirability claim. Today's number is written by a language model and recomputed by nothing, and that is a defect whether or not anyone asked us to fix it.)

**Build SAFE — on measurability, not on market demand.** ~~The decisive column says every confirmed rival ships a number rather than a reason~~ (struck, see above), and today's repository read shows that our own headline number is not even a number — it is a string of digits a language model chose, printed in 2xl bold at `RecipeRecommendationModal.tsx:304`, beside a list of "expiring ingredients" the same model wrote from memory rather than from the expiry dates sitting in our own database; we are not merely failing to close the gap, we are the clearest instance of it, and that is a finding we can demonstrate on stage in forty seconds. SAFE is the only one of the three whose central claim can be *measured* inside 160 hours, because the corpus is 50 recipes and 448 ingredients and every recipe can be enumerated in a unit test against a fixed set of seeded pantries (*corrected 2026-09-13: "enumerated exhaustively" — exhaustive on the recipe axis, sampled on the pantry axis; see F1*), which means the Results paragraph's blanks have queries that already run rather than queries that need eight recruited testers and a week of calendar time that the report, poster and demo will take instead; BOLD's central number is a prior we cannot falsify and WILD's central number is a parser accuracy that decides nothing about the product. It is not dull, because its thesis is not "we added a panel" — it is that Grocy already publishes an auditable integer formula awarding *"20 points per expired ingredient"*, that we publish ours per-recommendation with that term set to zero, and that we can defend the disagreement (*corrected 2026-09-13: the defence has not been written, the zeroed term does not answer F3, and whether expired items are zeroed or excluded is [open decision (d)](#open-team-decisions-this-document-does-not-settle) — see the correction under SAFE's thesis. Pitch SAFE as an honesty-and-defect-repair milestone until that is settled and the missing nutrient and substitution-reason terms are priced*); and it lands, as by-products, the one genuinely unmitigated hole plus the zero-caller service-role endpoint that leaks every user's email, the silent-data-loss bug under UC20 that the failing test was pointing past, and — **if and only if the 2 h `attack_users_endpoint.sh` is actually run** (see the correction at F5) — the first executed attack in a body of evidence that is otherwise eleven greps. **One caveat on the cost:** SAFE as priced is 108 h against 100 h of capacity, and what comes out is unresolved; see the re-total and [open decision (c)](#open-team-decisions-this-document-does-not-settle).

*Corrected 2026-09-13 — the order of the other two, restated honestly.* BOLD is the better product and the right thing to build in month two, once the ranker it would weight actually exists; WILD belongs in the report as the two paragraphs that show we read the evidence against ourselves and knew what it would have cost to test it. **But "month two" and "two paragraphs" are scheduling judgements about what we can measure in four weeks, not judgements that these matter less** — BOLD's and WILD's theses are the two the Reddit corpus actually supports, and SAFE's is the one it does not. A reader who ranks by user evidence should rank them the other way round, and the report should say so rather than hope nobody notices.

*And the largest fork of all sits outside this file:* [`09-pivot.md`](09-pivot.md) answers the prior question — build inside Epicourier at all? — with **Pivot**, and its dissent is unresolved. "Build SAFE" is an answer to *which* future, conditional on staying. See [open decision (a)](#open-team-decisions-this-document-does-not-settle).

**Sources:** [Plan to Eat — A Digital Pantry Inventory: Does It Really Help?](https://learn.plantoeat.com/help/a-digital-pantry-inventory-does-it-really-help) · [Grocy Changelog (v4.7.0, due score)](https://grocy.info/changelog) · [Mealime](https://www.mealime.com/)