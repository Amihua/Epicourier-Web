# P08-mission

**Workflow:** P1b Claude decide and commit (run 3)  
**Phase:** Adjudicate  
**Model:** Claude Opus 5 (1M context), `claude-opus-5[1m]`  
**Agent id:** `a25a7b6c404848755`  
**Tool calls:** 0 total — 0 web searches, 0 pages fetched  
**Raw transcript:** `raw/agent-a25a7b6c404848755.jsonl` (full tool-call trace, retained)

---

## Prompt, exactly as issued

```text
Write three candidate mission statements.

A mission statement gives the WHY (the challenge), the WHAT (the thing we build), and the SO WHAT
(the benefit). Five sentences each.

FACTS ABOUT OUR PRODUCT AND SITUATION:
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

CANDIDATE DIRECTIONS FROM OUR THREE-FUTURES ANALYSIS:
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
- `p1b/scripts/attack_users_endpoint.sh` *(new)* — a real curl against a local dev server with two seeded users, before and afte

BANNED WORDS — the statement is rejected if it contains any of them: leverage, empower, seamless,
revolutionize, revolutionise, cutting-edge, innovative, solution.

HARD REQUIREMENTS:
1. Each candidate must contain ONE concrete detail a rival could not copy-paste — a number from
   our own run logs, a named file, a specific defect, a specific dataset.
2. The SO WHAT must include ONE MEASURABLE CLAIM with a metric, a threshold and a baseline, which
   Project 2's M0 evaluation will actually test. Our marker will check this. A comprehension test
   on five users is NOT acceptable as the measurable claim — Nielsen's own guidance is that
   quantitative metrics need about twenty users, so n=5 cannot support a pass/fail threshold.
   Prefer a claim measurable OFFLINE by an automated harness, because that is the only kind this
   team can actually run inside 160 hours.
3. Do not promise anything the schema cannot represent. In particular user_inventory has no
   per-purchase lots — write "item", not "lot", unless the milestone explicitly adds the table.
4. Do not promise measured food-waste reduction. The published trial closest to that design
   (JMIR PMC9482070) found no change with six students over a month; we cannot beat it.

Write three candidates. Then pick one, say why, and state exactly which sentence of it is the
part a marker would challenge first and how we would defend it.
```

## Response

CANDIDATE 1 — THE RECEIPT

All fourteen live products our survey verified on 2026-09-13 tell you that a recipe matches and none tells you why; the strongest thing anyone ships is Samsung Food's "each recipe will show how well it matches", which is a number, not a reason. Ours is worse than theirs, because the percentage we print in 2xl bold at RecipeRecommendationModal.tsx:304 comes from RecommendedRecipe.match_score at backend/api/inventory_recommender.py:51 — a field Gemini writes and no line of our code recomputes from the dates we already hold. Epicourier will compute that score in a pure module over the fifty-recipe corpus in backend/dataset/recipes-supabase.csv, using a published integer table — Grocy's due score, cited in a code comment, with its "20 points per expired ingredient" term deliberately set to zero — and print the receipt beneath it: each pantry item, its expiry date, its points, the running total, every line correctable in one tap, with Gemini demoted from judge to the prose that describes a ranking it was handed. The measurable claim M0 will test offline: across 50 recipes × 10 seeded pantries = 500 recommendations, the displayed total equals the sum of the displayed line items in 500/500 cases and the ordering is byte-identical across 20 shuffles of inventory input order, against a baseline of 0/500 recorded by the same harness against today's build. A user who believes the recommendation is wrong can then point at the one line that is wrong and watch the ranking move, instead of arguing with a percentage nobody — including us — can reproduce.

CANDIDATE 2 — THE VERIFIED SENTENCE

Recommenders in this market talk, and nothing checks that what they say is true: the decisive column of our survey is "unknown" or "partial" for 14/14 confirmed rivals, and SuperCook's apparent explanation was corrected from "yes" to "unknown" by our own fact-checker because a filter is not an explanation. Our text is not even a model's opinion — recommender.py:210-213 emits the template f"Selected because it aligns with goal '{goal_text}' and differs from other meals.", the user's own free-text goal echoed back, while UC17's prose is generated from a prompt that the user's ingredient names are interpolated into with no untrusted-data boundary. Epicourier will put a gate between the model and the screen: verifyExplanation checks every ingredient the explanation asserts against the 448-row catalog in backend/dataset/ingredients-supabase.csv and the caller's own user_inventory read under RLS, suppresses any sentence naming food the user does not own, and marks the suppression visibly rather than hiding it — and the ranking moves server-side behind an authenticated route, closing the client-to-FastAPI call at dashboard/inventory/page.tsx:141 that today spends our Gemini quota for anyone who knows the URL. The measurable claim M0 will test offline: on a fixed corpus of 100 stored explanations, 50 of them mutated by an automated injector that swaps in an ingredient the seeded pantry does not contain, the gate flags ≥49/50 mutated cases and falsely flags ≤1/50 clean ones, against a baseline of 0/50 detection on today's build, where no checking code path exists. Everything Epicourier says about your food is then either checkable against a row you can see, or it is not said.

CANDIDATE 3 — THE HONEST PANTRY

Plan to Eat built a pantry inventory, removed it, and published why — "There is no way for your real inventory and your Plan to Eat inventory to ever remain synchronized" — so the question that decides whether a pantry feature is worth shipping is not whether it exists but whether it admits what it does not know. Ours does not admit anything: calculateRecipeMatch at web/src/utils/inventory/recipeMatch.ts:29 does set membership on ingredient_id and ignores quantity and expiry entirely, so a row sitting at quantity 0 — or negative, courtesy of quantity || 1 at api/inventory/transfer/route.ts:65 against a DECIMAL column with no CHECK constraint — or three weeks past its date still counts as fully available, and prompt rule 5 at inventory_recommender.py:157 forbids only recipes made *entirely* of expired items. Epicourier will make availability a dated, quantity-aware judgement: non-positive and non-finite quantities are rejected at the write, items past their expiration_date contribute zero and are shown with the date that disqualified them, and before a seven-meal plan is committed the app asks one targeted question about the single item whose true state would most change the ordering. The measurable claim M0 will test offline: on 50 recipes × 10 seeded pantries containing planted rows at quantity 0, quantity −5, and expiration_date in the past, 0/500 recommendations report any such item as available, against a baseline of 500/500 recorded by the same harness on today's build, where every planted row is counted as present by construction. The pantry stops being a claim about your kitchen and becomes a dated record you can correct, which is the only version of this feature a vendor who has already retreated from it did not try.

---

PICK: CANDIDATE 1 — THE RECEIPT

Why. It is the only one of the three aimed at the single gap that survived adversarial interrogation (G1; G2 and G4 are dead, G3 is narrowed to a claim about propagating uncertainty that Candidate 3 only half delivers). It is buildable inside the ~100 h of feature-and-test left after the 60 h of fixed overhead, because its core asset already exists and is pure, dependency-free and unit-tested: recipeMatch.ts supplies the coverage half, and the expiry half is an integer table. Its claim is falsifiable by a harness that runs in seconds over a 50-row corpus we can enumerate exhaustively, with no users, no field study, and no dependence on the two things our own verification could not reach this session (Samsung Food behind HTTP 403, and regulator date-label guidance). And it forces the honest version of our own position into the product rather than into a footnote — we ship the market's weakness today, in a worse form, and the fix is visible on screen.

The sentence a marker challenges first. Sentence 4: "the displayed total equals the sum of the displayed line items in 500/500 cases and the ordering is byte-identical across 20 shuffles of inventory input order, against a baseline of 0/500." The challenge is that this is a tautology dressed as a result — if you write the code so the total is the sum, of course the test passes; you have measured that addition works, and a 0/500 baseline is guaranteed because the current build has no line items to sum.

How we defend it. First, restate what is under test: not that addition works, but that the number shown to the user is the number the system actually ranked with, and that it is stable under nuisance variation in the input. Today's build fails both properties for reasons that are structural, not accidental — inventory_recommender.py:51 has the model author the integer, so there is nothing to sum and no reason for two runs over the same pantry to agree — and we report the baseline as the same harness executed against the current build on the same 500 cases, including the observed run-to-run disagreement rate of today's match_score, so the 0/500 is a measurement and not a definition. Second, we concede the formula is not the contribution and say so on the poster: Grocy already publishes an auditable due score, so our contribution is per-recommendation publication of the terms plus one named, defended disagreement — Grocy's 20 points per expired ingredient against our 0, which is a food-safety position we take deliberately given that rule 5 at inventory_recommender.py:157 currently lets expired items ride along. Third, we add the non-tautological half of the same harness: the correctability measure — after a single flagged line is corrected, the recorded fraction of the 500 rankings whose order changes, which no amount of careful coding can guarantee in advance and which tests whether the receipt is connected to anything. If the marker still calls the invariant trivial, the correct answer is that it is trivial and we do not have it, which is precisely the finding the survey produced about fourteen competitors as well.
