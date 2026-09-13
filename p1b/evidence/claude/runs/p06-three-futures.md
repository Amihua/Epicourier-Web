# P06-three-futures

**Workflow:** P1b Claude decide and commit (run 3)  
**Phase:** Classify  
**Model:** Claude Opus 5 (1M context), `claude-opus-5[1m]`  
**Agent id:** `a8aaafcbb310a28f6`  
**Tool calls:** 35 total — 2 web searches, 8 pages fetched  
**Raw transcript:** `raw/agent-a8aaafcbb310a28f6.jsonl` (full tool-call trace, retained)

---

## Prompt, exactly as issued

```text
Propose three distinct futures for this product. Do NOT blend them into one compromise;
keeping them distinct is the point of the exercise.

Epicourier-Web: Next.js 15 / TypeScript / Tailwind front end; FastAPI + Python back end;
Supabase/PostgreSQL; Google Gemini 2.5 Flash for recommendation. Twenty implemented use cases:
accounts, recipe browsing with an "inventory match percentage", recipe detail with nutrients and
a green score, AI meal-plan recommendation from a free-text goal (3/5/7 meals), calendar
scheduling and meal-completion tracking, a nutrient dashboard with trends/goals/CSV export,
achievements + streaks + challenges, pantry/fridge/freezer inventory with expiry colour-coding
and low-stock thresholds, AI recipe suggestions that prioritise expiring OR ALREADY EXPIRED
ingredients, shopping lists from a plan or a recipe, and a "purchased" transfer that moves
checked shopping-list items into inventory.

THE VERIFIED MARKET, as established by our own survey on 2026-09-13. Five independent discovery
agents ran 146 web searches and fetched 238 pages; a separate adversarial fact-checker then
re-fetched every claim. 18 products reached verification; 14 CONFIRMED live, 4 dead:

CONFIRMED LIVE: Samsung Food (Samsung), Eat This Much, Plan to Eat, Paprika Recipe Manager 3,
AnyList, SideChef, Prepear, SuperCook, NoWaste, KitchenPal, Eatvora, PantryWise, Xpiry,
"OH, a potato!".
DEAD / WITHDRAWN: Mealime (vendor notice: "Mealime will be discontinued as of October 21, 2026",
acquired by Albertsons, migrating users to Meals Hub); Kitche (acquired by Remy Feb 2025, App
Store id 1521215203 returns 404 in both GB and US storefronts); Fridgely (iOS id 988016972
delisted; its own site's store links 404; developer's site footer still says "© 2017"); CozZo.

THE DECISIVE COLUMN: explains_why_recommended is "unknown" or "partial" for all 14 confirmed
products. The strongest thing anyone ships is Samsung Food's match score — "Each recipe will show
how well it matches" — which is a number, not a reason. SuperCook's apparent explanation was
CORRECTED from "yes" to "unknown" by the fact-checker: it is a filter, not an explanation.

FOUR FINDINGS THAT CHANGE THE PLAN:
1. Plan to Eat BUILT a pantry inventory, then REMOVED it, and published why:
   https://learn.plantoeat.com/help/a-digital-pantry-inventory-does-it-really-help — "In early
   versions of Plan to Eat we had a feature called the Pantry..." Its replacement, the Staples
   List, is explicitly static and does NOT deduct from the shopping list. A major vendor tried
   our core mechanic and retreated from it.
2. Eat This Much does NOT plan from expiry. Its own help centre says "We don't have..." a
   pantry-only generator; it prioritises LEFTOVERS and decrements the pantry by assumed
   consumption timing ("We remove ingredients from your pantry after you're supposed to have
   eaten them"), never by shelf life. Pantry is a Premium feature.
3. Samsung Food DOES prioritise near-use-by items and DOES close the cooking loop ("mark the
   recipe as 'Made It'. The app will suggest removing the ingredients"). Our own check could not
   reach samsungfood.com/food-plus/ (HTTP 403); this rests on the support centre and third
   parties.
4. Grocy, the open-source rival, publishes an integer "Due Score" formula — an auditable ranking
   already exists in the wild, in a self-hosted product.

GAP VERDICTS after adversarial interrogation (five confirming + five refuting items hunted for
each, each marked FOUND or NOT_FOUND):
- G1 "no product shows a per-recommendation rationale naming the specific pantry item, its expiry
  date, the constraint and the substitution, auditable and correctable" — GAP_SURVIVES.
  Evidence: a systematic sweep of 222 live US App Store listings via the iTunes Search API found
  no explanation-of-recommendation language; 14/14 verified rivals are unknown/partial. Refuting
  evidence found: academic prior art exists (arXiv 2601.02374, explainable food recommendation),
  so this is a MARKET gap, not a research novelty. Buildable in 160 h: yes.
- G2 "nothing measures afterwards whether the plan reduced waste" — GAP_DEAD. FridgeBuddy ships
  "Waste tracker: see what you eat vs. what you throw"; SeePantry ships "dollars saved, items
  rescued, and CO2 avoided — calculated with EPA WARM data"; Fango, Trepo and Eat This Much all
  measure against a target. AND the measurement itself is out of budget: the closest published
  trial (JMIR Formative Research PMC9482070) ran 6 students for a month per app and found no
  change in food waste, concluding "Large-scale studies with longer duration are needed".
- G3 "no product treats the pantry as uncertain" — GAP_NARROWED. False as written: SeePantry
  states usage estimates with one-tap correction, Fango presents shelf life as an adjustable AI
  estimate, Samsung Food confirms consumption after cooking. What survives: nobody PROPAGATES
  that uncertainty into the recommendation — nothing ranks a plan by the probability its
  ingredients are actually present, and nothing asks a targeted verification question before
  committing a week.
- G4 "nothing connects a calorie/training target to this week's groceries" — GAP_DEAD. Eat This
  Much does the whole chain; Prospre does per-training-day macro cycling; Cooklist generates
  missing-ingredients-only lists.

OUR OWN ENGINEERING POSITION, re-derived from the repository on 2026-09-13 (not from the P1a
write-up — every defect was re-grepped against the current working tree):

- P1a run logs, ours, auditable: Web functional 32 tests 31 PASS / 1 FAIL; Backend 18 cases
  18 PASS. Including adversarial: Web 44 executed 33 PASS / 11 FAIL; Backend 25 executed 18 PASS
  / 7 FAIL. The inherited suite passed 1,095/1,096 in 3.6 s — that is the PREVIOUS team's suite
  and must never be used as our boast.
- 18 recorded FAILs collapse to 17 distinct source defects, plus 1 new one found in this audit.
  All 18 confirmed still present. Total competent fix + regression test effort: ~24.25 h.
- METHODOLOGICAL CAVEAT WE MUST DISCLOSE: most of the P1a "security tests" are source-text greps
  (e.g. expect(route).toContain('.eq("user_id", user.id)')), not executed attacks. Reporting 11
  failures without saying this inflates their credibility.
- THE HEADLINE IDOR IS PROBABLY A FALSE POSITIVE AT SYSTEM LEVEL. shopping_list_items has no
  user_id column; RLS enforces ownership through the parent list; the route uses the cookie-bound
  anon client. The "fix" the failing test demands would query a column that does not exist.
- THE REAL BUG UNDER UC20 IS BETTER THAN THE CLAIMED ONE. RLS does block the cross-user write,
  but web/src/app/api/inventory/transfer/route.ts never inspects how many rows the update
  touched (:98 checks only checkError; the DELETE path at :152 discards the result), so it
  returns success:true and transferred_count:N for transfers that did not happen — while the
  inventory row WAS inserted. That is silent data loss, and UC20's postcondition then deletes the
  completed list.
- THE ONE GENUINELY UNMITIGATED HOLE: web/src/app/api/shopping-lists/share/route.ts builds a bare
  anon client, never calls auth.getUser, never checks that shoppingListId belongs to the caller,
  and feeds expiryDays straight into Date.setDate(). Its table, shopping_list_shares, has NO
  migration, NO ENABLE ROW LEVEL SECURITY and NO policy anywhere in supabase/migrations/. Every
  other authorization finding was downgraded because we could read the policy that catches it;
  here there is nothing to read. ~8.75 h to fix properly (migration + RLS policy, then auth, then
  ownership query, then bound expiryDays).
- quantity || 1 at transfer/route.ts:65,:80,:167 — user_inventory.quantity is
  DECIMAL(10,2) NOT NULL DEFAULT 1 with NO CHECK constraint. Negatives persist; 0 becomes 1.
  Unguarded data corruption, 1.5 h.
- SCHEMA BLOCKER FOR ANY "LOT" LANGUAGE: user_inventory upserts by
  (user_id, ingredient_id, location) and SUMS quantities into one row. There are no per-purchase
  lots, no per-lot expiry, no provenance. A promise to "show which pantry LOT caused this ranking"
  is not representable in the current schema. Either add the table or say "item", not "lot".
- SAFETY EXPOSURE NEITHER ANALYST CAUGHT UNTIL NOW: UC17 prioritises ingredients that are
  expiring OR ALREADY EXPIRED, and the prompt labels them "EXPIRED"/"EXPIRING NOW". The product
  actively recommends cooking food it believes has expired. That is a food-safety question, not a
  ranking question.
- The free-text goal (UC5) and preference (UC17) are unbounded and are interpolated directly into
  the Gemini prompt with no untrusted-data boundary.

HARD BUDGET: four graduate students, ONE MONTH, ~10 h/person/week = about 160 person-hours TOTAL,
to build AND test. The team must ALSO produce a report, a poster and a demo out of that same 160.

THE PRE-MORTEM'S FINDING (our own C5 prompt, run on 2026-09-13): in the failure scenario, only 29
of 160 hours reached the feature. The rest went to environment setup repeated four times in
private (a defect P1a had already diagnosed), 9 h of Friday merge conflicts, 12 h making demo
data look real, 7 h asking Gemini to explain Gemini (fluent, unstable, twice citing pantry items
that did not exist), 26 h of report written in the last 48 hours, and 26 h of unrequested
visible features (a Waste Warrior badge, an explanation-verbosity setting, an animated timeline).
The single week-1 decision that caused it: the team decided the deliverable was a PANEL, not a
NUMBER. Its top-ranked prevention, by failure-prevented-per-hour: freeze the claims before the
code — write the Results paragraph with numeric blanks and, beside each blank, the exact query
that fills it; delete any sentence whose query does not exist.

RULES: Do not invent products or sources. Use WebSearch/WebFetch for any market claim (load with
ToolSearch "select:WebSearch,WebFetch" if absent). Quote real page text. Write "unknown" rather
than something plausible. Separate fact, inference and hypothesis. Respect the 160-hour budget in
every recommendation.

Produce SAFE (the obvious next step), BOLD (a real bet) and WILD (probably wrong, but
instructive). For each:
- Elevator pitch, two sentences.
- What four students could build AND TEST of it in one month — be concrete about which files and
  which tests, given that our team has never yet changed a production file in this codebase.
- The biggest risk.
- The kill signal: "we abandon this version if we see ___" — an observable condition with a
  number and a date, not a feeling.

Two warnings the assignment makes explicit: dull milestones lose marks, and impossible ones lose
more. A SAFE option that is merely "fix the bugs and add a panel" will be marked dull. Make SAFE
genuinely defensible rather than genuinely boring, or say honestly that it cannot be.

Finish with a recommendation and the reason, in one paragraph, no hedging.
```

## Searches actually run

- `Grocy "due score" formula stock overview documentation`
- `Samsung Food "Made It" mark recipe suggest removing ingredients pantry support`

## Pages actually fetched

- https://learn.plantoeat.com/help/a-digital-pantry-inventory-does-it-really-help   — asked: Quote verbatim what this page says about the Pantry feature that was removed, why it was removed, and what the
- https://grocy.info/changelog   — asked: Search this changelog for "due score" or "Due score" and quote verbatim every sentence that describes how the 
- https://www.fsis.usda.gov/food-safety/safe-food-handling-and-preparation/food-safety-basics/food-product-dating   — asked: Quote verbatim what this page says about whether food is safe after the date on the package passes, about "Bes
- https://www.fda.gov/consumers/consumer-updates/confused-date-labels-packaged-foods   — asked: Quote verbatim what this page says about whether a date label indicates food safety, about "Best if Used By", 
- https://support.samsungfood.com/en/articles/8425689-how-does-the-pantry-work   — asked: Quote verbatim anything about how the pantry works, whether recipes are matched to pantry items, whether a mat
- https://ask.usda.gov/s/article/How-long-can-you-store-food-after-the-sell-by-date   — asked: Quote verbatim what USDA says about food safety after the sell-by or use-by date passes, and about infant form
- https://www.mealime.com/   — asked: Quote verbatim any notice about Mealime being discontinued, the date, and any mention of Albertsons or Meals H
- https://www.foodsafety.gov/food-safety-charts/food-safety-basics   — asked: Quote verbatim anything about date labels, use-by dates, and whether food is safe after the date passes.

## Response

# Three Futures for Epicourier

**Verification note (2026-09-13).** Every repository claim below was re-checked against the working tree today by reading the file. Market claims were re-fetched live this session where possible: Plan to Eat ✓, Grocy ✓, Mealime ✓. **Could not verify this session** (WebSearch budget exhausted at 200/200; USDA FSIS 403, FDA 404, foodsafety.gov 403, Samsung Food support 404): Samsung Food's behaviour and any regulator's date-label guidance. Those remain as the survey left them, and nothing below leans on them.

---

## New facts from today's repository read that change the options

These are things the brief did not have. Each was re-grepped, not remembered.

**F1 — The corpus is 50 recipes, not thousands.** `backend/dataset/recipes-supabase.csv` = 50 data rows; `ingredients-supabase.csv` = 448; `recipe_ingredient_map-supabase.csv` = 528. `format_recipes_for_prompt(recipe_data, limit=80)` (`inventory_recommender.py:107`) therefore truncates *nothing* today. This is the single most important fact for scoping: **a deterministic ranker over this corpus can be exhaustively tested in a unit suite.** Every "AI" claim we make is a claim about 50 recipes, and we can enumerate all of them.

**F2 — The match score the UI prints is written by the model, not computed.** `RecommendedRecipe.match_score` (`inventory_recommender.py:51`) is a model-authored integer. The "formula" at lines 159–162 — `Base score = (available ingredients / total required) * 100` — is *prompt text addressed to Gemini*, not code. `RecipeRecommendationModal.tsx:304` renders it as `{recipe.match_score}%` in 2xl bold. Same for `expiring_ingredients_used` (line 53), rendered at `:324-333` as "Uses N expiring ingredients: …". Nothing recomputes either from the dates we hold. **We already ship exactly the thing the survey says is the market's weakness — a number that is not a reason — and ours is worse, because ours is not even arithmetic.**

**F3 — The brief overstates the expired-food exposure, and the true version is sharper.** Priority rule 1 (`:153`) prioritises `⚠️ EXPIRING SOON` and `⏰ USE SOON` — it does **not** name `❌ EXPIRED`. Rule 5 (`:157`) says only: `NEVER: Do not recommend recipes that ONLY use ❌ EXPIRED items`. So the accurate statement is: *expired items are passed into the prompt, labelled, and permitted in any recipe that also contains one non-expired ingredient.* That is still a food-safety decision made by prompt text, but say it precisely or the fact-checker will correct us the way SuperCook was corrected.

**F4 — We have a clean deterministic asset already.** `web/src/utils/inventory/recipeMatch.ts` is 188 lines, pure, zero dependencies, already unit-tested by the previous team. `calculateRecipeMatch` (`:29`) does set-membership on `ingredient_id` and **ignores quantity and expiry entirely** — so a row with `quantity = 0` (or negative, per the `|| 1` bug) or an item three weeks past date still counts as 100% available. That is a hole and a gift: the hole is a defect we can name, and the module is the seed of an auditable ranker that needs no new infrastructure.

**F5 — A second unmitigated hole, worse than the share route, and executable with one curl.** `web/src/app/api/users/route.ts:8-13` is `GET /api/users`, no `auth.getUser`, using `supabaseServer` — which is built from `SUPABASE_SERVICE_ROLE_KEY` (`web/src/lib/supabaseServer.ts:5`). It returns `id, fullname, email` for **every user**, ordered by signup. The service-role key bypasses RLS, so unlike the share route there is not even a policy that *might* catch it. And `grep -rn '/api/users' web/src web/__tests__ web/e2e` returns only the route's own comments: **it has zero callers.** Deleting it is a five-minute, zero-regression change. This is the only finding in our whole audit that is a genuine executed attack rather than a source grep — it fixes the methodological caveat by existing.

**F6 — The browser talks to FastAPI directly, unauthenticated.** `web/src/app/dashboard/inventory/page.tsx:29` reads `NEXT_PUBLIC_PYTHON_BACKEND_URL` and `:141` fetches `${BACKEND_URL}/inventory-recommend` **from the client**, bypassing Next.js auth. `backend/api/index.py:27` sets `allow_origins=["*"]` and `/inventory-recommend` has no auth at all. Anyone can spend our Gemini quota.

**F7 — UC17's free-text preference is unreachable from the UI.** The payload at `page.tsx:152-155` sends only `inventory` and `num_recipes`. `preferences` exists in `types/data.ts:594` and in the Pydantic model but is never populated by any screen. The reachable untrusted-text surfaces are UC5's `goal` and the ingredient `name` strings — a smaller, more honest claim than "two unbounded fields".

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

Each option below therefore commits to ≤ 100 h and names its frozen claims.

---

# SAFE — **The Receipt**

> *We stop letting a language model invent the percentage we print in 2xl bold, and compute it instead — from a published integer formula, per recommendation, with a line-item receipt naming each pantry item, its expiry date, its points and the running total, every line correctable in one tap. Gemini stays, demoted from judge to copywriter, and we measure how often it used to name food you do not own.*

This is not "fix the bugs and add a panel." The thesis is specific and arguable: **an auditable ranking formula already exists in the wild — Grocy publishes theirs — so the contribution is not the formula, it is publishing ours per-recommendation, and deliberately setting one term differently.** Grocy awards *"20 points per expired ingredient"*. We publish ours and set expired to **0**, and defend that choice on the poster (F3). That is a defensible engineering position with a named rival, a named disagreement, and a reason.

### What four students build and test in one month (~96 h)

*First production edit, day 1, for a team that has never made one:* `rm web/src/app/api/users/route.ts` — zero callers (F5), closes an unauthenticated service-role PII endpoint, and gives everyone the merge-and-deploy muscle before anything hard.

**New production files**
- `web/src/utils/inventory/rankRecipes.ts` — pure. `rankRecipes(recipes, inventory, today)` → `{recipe_id, score, terms[]}` where each term is `{ingredient_id, ingredient_name, kind: 'expired'|'overdue'|'due_soon'|'available'|'missing', expiration_date, points}`. Reuses `calculateRecipeMatch` from `recipeMatch.ts` for the coverage half; the expiry half ports Grocy's published integers **with the citation in a code comment** and `expired: 0`. Invariant: `score === terms.reduce(sum of points)`. *(14 h)*
- `web/src/utils/inventory/verifyExplanation.ts` — `verify(text, inventory)` → `{ok, unknownTerms[]}`. Any ingredient name the model asserts that is not in the user's pantry is flagged; the sentence is suppressed, not silently kept. Matches against the 448-row catalog. *(8 h)*
- `web/src/app/api/recommendations/rank/route.ts` — authenticated via `createClient` from `@/utils/supabase/server`, reads the caller's `user_inventory` under RLS, ranks server-side, returns list + receipt. Replaces the client→FastAPI call and closes F6. *(10 h)*
- `web/src/components/inventory/RecommendationReceipt.tsx` — the line items, the total, and a **"this is wrong"** control deep-linking to the inventory row. *(10 h)*
- `supabase/migrations/2026xxxx_shopping_list_shares.sql` — the missing table, `ENABLE ROW LEVEL SECURITY`, and policies. *(3 h)*

**Edited production files**
- `RecipeRecommendationModal.tsx:304` — computed score replaces `recipe.match_score`; `:343-419` mounts the receipt. `:324-333` recomputes `expiring_ingredients_used` from dates instead of trusting the model. *(6 h)*
- `web/src/app/dashboard/inventory/page.tsx:141` → `/api/recommendations/rank`; `:172` implements `handleAddMissingToShoppingList` against the existing `POST /api/shopping-lists/[id]/items`, closing F8. *(8 h)*
- `web/src/app/api/inventory/transfer/route.ts` — reject non-positive/non-finite quantity at `:65,:80,:167` (replacing `|| 1`); runtime-validate `location` against the four values; **and the real UC20 bug: add `.select("id")` to the `shopping_list_items` update at `:93` and the delete at `:152`, and treat a zero-row result as a failure** so `transferred_count` can no longer report transfers that did not happen. *(6 h)*
- `web/src/app/api/shopping-lists/share/route.ts` — cookie-bound client, `auth.getUser`, ownership query, `expiryDays` clamped to integer 1–30. *(6 h)*
- `backend/api/inventory_recommender.py:140-181` — the prompt no longer asks for `match_score`; it asks only for prose about a ranking it is handed. *(3 h)*

**Tests**
- `web/__tests__/unit/rankRecipes.test.ts` *(new)* — over the real 50-recipe corpus (F1): score is an integer; determinism across 1,000 input shuffles; each term's points equal the published table; **`score === Σ terms.points` for all 50 × 10 seeded pantries** (the receipt adds up); `quantity <= 0` is never "available" — the hole in `recipeMatch.ts:54` (F4). *(10 h)*
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

---

# BOLD — **"I'm not sure yet"**

> *Epicourier stops pretending it knows what is in your fridge: it ranks a week by the probability its ingredients are actually still there, and before committing seven meals it asks you exactly one question — the one whose answer would most change the plan. And it refuses to build a meal around food its own data says is past its date, saying so out loud instead of ranking it first.*

This is the only surviving half of G3, stated as the survey stated it: *nobody propagates that uncertainty into the recommendation — nothing ranks a plan by the probability its ingredients are actually present, and nothing asks a targeted verification question before committing a week.* SeePantry corrects usage, Fango makes shelf life adjustable, Samsung Food confirms after cooking — **all three correct the pantry after the fact; none let doubt reach the ranking before the fact.** It also answers Plan to Eat's published objection on their own terms: they retreated because *"there is no way for your real inventory and your Plan to Eat inventory to ever remain synchronized."* Correct. So do not claim synchrony — model the desynchrony and price it.

### What four students build and test in one month (~98 h)

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
- `web/__tests__/unit/nextQuestion.test.ts` *(new)* — selected item is the true argmax over the 50-recipe corpus by exhaustive enumeration (possible only because of F1); a pantry with exactly one ambiguous item always selects it; ties are stable. *(10 h)*
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
**The confidence number is unfalsifiable.** We have no ground truth for what is in anyone's fridge, so `p_present` is a prior dressed as a measurement — and if we print "78% confident" without being able to justify 78, we have done precisely what we accuse fourteen rivals of doing: shipped a number instead of a reason, one layer deeper and harder to catch. The only defence is to publish the table, never fit it, and report calibration solely against the confirmations we actually collect.

### Kill signal
**By 2026-10-04 (end of week 3), across ≥ 8 testers, we abandon confidence-gating if either: (a) fewer than 50% of verification questions shown are answered, or (b) of items scored ≥ 80% present, fewer than 80% are confirmed present when asked — a calibration error above 20 points.** Either outcome means the number is not measuring anything, and shipping it would make us the fifteenth product with an unexplained score.

---

# WILD — **Ask, Don't Store** (the Two-Minute Pantry)

> *Plan to Eat built our core mechanic, removed it, and published exactly why — so we build the Epicourier that believes them: no persistent inventory at all, just one question a week — "what's in there you're worried about?" — answered in free text in under two minutes and deleted after seven days. Then we run it head-to-head against our own full inventory (UC13–16) behind a flag and let the numbers decide which product we actually are.*

This is probably wrong. It is instructive because it takes the single most dangerous piece of refuting evidence in the entire survey — a major vendor tried our core mechanic and retreated, in writing — and converts it from a footnote we hope nobody reads into an experiment we ran. Nobody else in this market can run it, because nobody else has both arms.

### What four students build and test in one month (~88 h)

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

---

## Recommendation

**Build SAFE.** The decisive column says every confirmed rival ships a number rather than a reason, and today's repository read shows that our own headline number is not even a number — it is a string of digits a language model chose, printed in 2xl bold at `RecipeRecommendationModal.tsx:304`, beside a list of "expiring ingredients" the same model wrote from memory rather than from the expiry dates sitting in our own database; we are not merely failing to close the gap, we are the clearest instance of it, and that is a finding we can demonstrate on stage in forty seconds. SAFE is the only one of the three whose central claim can be *measured* inside 160 hours, because the corpus is 50 recipes and 448 ingredients and can be enumerated exhaustively in a unit test, which means the Results paragraph's blanks have queries that already run rather than queries that need eight recruited testers and a week of calendar time that the report, poster and demo will take instead; BOLD's central number is a prior we cannot falsify and WILD's central number is a parser accuracy that decides nothing about the product. It is not dull, because its thesis is not "we added a panel" — it is that Grocy already publishes an auditable integer formula awarding *"20 points per expired ingredient"*, that we publish ours per-recommendation with that term set to zero, and that we can defend the disagreement; and it lands, as by-products, the one genuinely unmitigated hole plus the zero-caller service-role endpoint that leaks every user's email, the silent-data-loss bug under UC20 that the failing test was pointing past, and the first executed attack in a body of evidence that is otherwise eleven greps. BOLD is the better product and the right thing to build in month two, once the ranker it would weight actually exists; WILD belongs in the report as the two paragraphs that show we read the evidence against ourselves and knew what it would have cost to test it.

**Sources:** [Plan to Eat — A Digital Pantry Inventory: Does It Really Help?](https://learn.plantoeat.com/help/a-digital-pantry-inventory-does-it-really-help) · [Grocy Changelog (v4.7.0, due score)](https://grocy.info/changelog) · [Mealime](https://www.mealime.com/)
