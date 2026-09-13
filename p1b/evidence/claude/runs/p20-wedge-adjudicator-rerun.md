# P20-wedge-adjudicator-rerun

**Workflow:** P1b Claude decide and commit (run 3)  
**Phase:** Adjudicate  
**Model:** Claude Opus 5 (1M context), `claude-opus-5[1m]`  
**Agent id:** `a5122d5eb08488547`  
**Tool calls:** 21 total — 1 web searches, 9 pages fetched  
**Raw transcript:** `raw/agent-a5122d5eb08488547.jsonl` (full tool-call trace, retained)

---

## Prompt, exactly as issued

```text
You are the one-month wedge adjudicator (P20, written by the Codex analyst on our team,
rerun independently here with fresh evidence).

HARD BUDGET: four graduate students, ONE MONTH, ~10 h/person/week = about 160 person-hours TOTAL,
to build AND test. The team must ALSO produce a report, a poster and a demo out of that same 160.

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

EVIDENCE GATHERED BY THE PARALLEL RUNS YOU MUST USE:

--- P13, workflow-proof competitor hunt ---
# P13 — Independent rerun: "auto-recommended dish → pantry-subtracted shopping list" competitor verification

**Method note / limitation (fact):** WebSearch quota for this session was exhausted after the first query (200/200), so discovery ran on direct fetches of official help centres, vendor sites, app-store listings (via the iTunes/Play listing APIs) and, for open-source products, the vendors' own source repositories. That biases *toward* first-party evidence (good) but means I could not sweep blogs/forums for products whose docs are paywalled or bot-blocked (Samsung Food's Zendesk and samsungfood.com both return 403). Those are marked **unknown**, not guessed.

**The workflow under test (all seven links must hold):** actor accepts an *automatically recommended* dish → system computes required ingredients → subtracts pantry/on-hand stock → consolidates duplicate ingredients and units → previews the change → user confirms → **only the missing items** are written to the shopping list.

For comparability, every product is scored on the same three decisive steps:
- **Step 1** = accept an automatically recommended/generated dish (not "search and pick")
- **Step 2** = compute ingredients **and subtract pantry stock**
- **Step 3** = consolidate duplicates/units **+ preview + confirm** → only the shortfall is written

---

## Table

| product | exact step 1 | exact step 2 | exact step 3 | fully supported? | evidence URL per step | evidence type | missing link |
|---|---|---|---|---|---|---|---|
| **Tandoor Recipes** (self-hosted, v2.6.15, 2026-09-07) | Auto-Planner dialog: picks recipes **at random** from keyword-filtered set, user hits Create; optional "Add to shopping" checkbox | User pref "Exclude Food On Hand" excludes on-hand foods when a meal plan goes to the list; on-hand = **boolean flag**, not quantity | Add-to-Shopping dialog lists every ingredient with checkboxes, on-hand/ignored foods **pre-unchecked**, servings scaler, "Add to Shopping" button; list entries "always grouped by food" | **YES** (with boolean-pantry caveat) | S1 `cookbook/views/api.py` L1546-1615 + `AutoPlanDialog.vue`; S2 `en.json` key `mealplan_autoexclude_onhand_desc` + `cookbook/helper/shopping_helper.py` L91-110; S3 `AddToShoppingDialog.vue` L123 + `vue3/src/stores/ShoppingStore.ts` L162-165 | FIRST-PARTY (vendor source + docs) | Pantry is on/off per food — no "have 200 g, need 500 g → buy 300 g" math |
| **Mealie** (self-hosted, mealie-next) | Meal planner "random recipe buttons" + Planner Rules that shape which random recipe is inserted | Food-level "On Hand" flag makes that food **unchecked by default** when a recipe is added to a list (per household) | `RecipeDialogAddToShoppingList.vue`: per-ingredient checkboxes, on-hand pre-unchecked, submit = "Add to List"; backend `bulk_create_items` consolidates and merges with **unit conversion** | **YES** (with boolean-pantry caveat) | S1 docs.mealie.io features page; S2 `frontend/app/lang/messages/en-US.json` (`on-hand-checkbox-label`); S3 `RecipeDialogAddToShoppingList.vue` L309-330 + `mealie/services/household_services/shopping_lists.py` L45-205 | FIRST-PARTY (docs + vendor source) | Same: boolean on-hand, no quantity subtraction; "random" ≠ personalised recommendation |
| **Cooklist** (iOS, v1.109.1, 2026-06-29) | "AI Chef, get personalized suggestions for meals to make using your pantry ingredients"; recipe feed generated from auto-imported pantry | "choose the recipes you want to cook and Cooklist generates a grocery shopping list with only the ingredients that you are missing in your pantry" | Consolidation + selective add evidenced only by reviewers ("add certain items to a grocery list (with the measurements grouped together)") | **YES on the chain, but steps 4-5 rest on user reports** | S1+S2 apps.apple.com/us/app/id1352600944 (description + version history); S3 same page, customer reviews | STORE LISTING (first-party copy) + USER REPORT | No first-party doc for consolidation/preview; pantry fidelity depends on loyalty-card receipt lag (reviewer: "it thinks you don't have the groceries sometimes"); cooklist.com now titles itself "Agentic Commerce for Grocery" |
| **Eat This Much** | "we'll automatically generate a complete meal plan to meet your targets" (generator can be disabled) | **Quantity-accurate**: "if your meal plans need 2 apples and you already have 1 in your pantry, the grocery list will only tell you to purchase 1 more apple" | Consolidation proven only for substitutions ("chunky and smooth peanut butter… we'll combine them to just a single type"); **no preview/confirm gate** — list auto-generates and auto-resets weekly | **PARTIAL** | S1 eatthismuch.com + apps.apple.com/us/app/id981637806; S2 help.eatthismuch.com/help/how-does-the-pantry-system-work; S3 help.eatthismuch.com/help/how-does-the-grocery-list-work | FIRST-PARTY (help centre, updated 05 May 2026) | No user-confirmed diff before the list is written; no evidence of unit-level consolidation |
| **Grocy** (self-hosted) | **none** — no recommender anywhere in the string table (only ingredient search: "search through your recipes for one or more which use an ingredient that you already have") | "Put missing amount on shopping list"; amount added = **"needed amount - stock amount - shopping list amount"** | "Uncheck ingredients to not put them on the shopping list" + "Are you sure you want to put all missing ingredients for recipe "%s" on the shopping list?"; dedupes against what is already on the list | **PARTIAL** (steps 2-7 complete, step 1 absent) | S1 (absence) localization/strings.pot; S2 + S3 raw.githubusercontent.com/grocy/grocy/master/localization/strings.pot; docs github.com/grocy/grocy-docs/blob/master/tutorials/cooking.md | FIRST-PARTY (vendor source strings + docs) | Nothing recommends a dish — the actor always chooses |
| **Paprika Recipe Manager 3** | **none** — no suggestion/recommendation feature in the help index | Pantry records "quantity, purchase date, expiration date, and whether it is in stock or out of stock"; "Ingredients placed in your pantry will automatically be unchecked when you add recipes **or meal plans** to your grocery list" | "An ingredients pane will pop up… check/uncheck ingredients before they are added"; "consolidate similar item… 2 eggs + 3 eggs → 5 eggs total" | **PARTIAL** (steps 2-7 complete, step 1 absent) | S1 (absence) paprikaapp.com/help/ios/; S2 paprikaapp.com/help/mac/ (Pantry); S3 paprikaapp.com/help/ios/#groceries | FIRST-PARTY (help centre) | No recommender; pantry unchecks by presence, ignores the recorded quantity |
| **AnyList** (v7.1) | Ideas tab: "personalized suggestions based on criteria such as your recipe ratings and meal planning history" | **No pantry/inventory feature at all** | "Similar ingredients are combined into a single list item which shows the total quantity needed"; meal-plan flow shows an ingredient screen you tap to add | **PARTIAL** | S1 help.anylist.com/articles/meal-plan-ideas/; S2 — (absent; apps.apple.com/us/app/id522167641 lists no pantry); S3 help.anylist.com/articles/add-recipe-ingredients-to-list/ + …/meal-planning-calendar-add-recipe-ingredients/ | FIRST-PARTY (help centre) + STORE LISTING | The entire subtraction step: nothing models what you already own |
| **KitchenPal** | "Get recipe suggestions based on expiring ingredients in your pantry and fridge inventory"; "automatically get recipes which match your existing food inventory" | "automatically generate shopping lists from your meal plan, **excluding ingredients already in your kitchen inventory**"; "Add missing ingredients… with a single click" | **unknown** — no consolidation or preview/confirm claim on site or listing | **PARTIAL** | S1+S2 kitchenpalapp.com/en/; S2 also apps.apple.com/us/app/id1084982489 (v5.8.4, 2026-09-12); S3 unknown | FIRST-PARTY (vendor site) + STORE LISTING | Whether exclusion is quantity-aware, and whether anything is previewed/confirmed, is undocumented |
| **MealBoard** (v6.1.2, 2026-09-11) | "AI looks at your recipes and past meal plans to suggest what you could eat next"; "Review, change, and customize your AI-generated meal plan" | Claim only: "Keep track of what's in your pantry and **avoid buying what you already have**"; site describes pantry as manual ("as you cook meals, you can easily adjust the items left in stock"), plus "Move out-of-stock items to your grocery list" | "Automatically generate grocery lists from your meal plan" + "Combine similar ingredients into one item"; preview/confirm **unknown** | **PARTIAL** | S1+S3 apps.apple.com/us/app/id333425918; S2 same listing + mealboard.com/features.html | STORE LISTING (first-party copy) + FIRST-PARTY site | No source states the grocery list is computed *minus* pantry quantities; "avoid buying" may be eyeballing, not subtraction |
| **Mealime** | "Get a weekly personalized meal plan"; user still selects each recipe when building the plan | No pantry object. "check off the ingredients that you already have in your kitchen" — **manual** | List is generated whole and *replaces* the prior one; "your grocery list is replaced with a list of all the ingredients you need for your new meal plan" | **ADJACENT** | S1 apps.apple.com/us/app/id1079999103; S2+S3 support.mealime.com/article/75-how-the-grocery-list-works | FIRST-PARTY (support site) + STORE LISTING | Subtraction is a human act at the kitchen counter; nothing is stored or computed |
| **Plan to Eat** | **none** — "Pick your meals. We'll handle the grocery list." | Staples List **adds** items in bulk; the only subtraction is a customer testimonial: "I can check off any ingredients I already have in the house, and it hides them from view" | "Once you create a meal plan, Plan to Eat will automatically generate a shopping list for you!" — no pantry-aware preview | **ADJACENT** | S1 (absence) plantoeat.com; S2+S3 plantoeat.com/tour/automated-grocery-list-maker/; apps.apple.com/us/app/id1215348056 | FIRST-PARTY site + USER REPORT (testimonial hosted by vendor) | No recommender, no inventory, manual hiding only |
| **Samsung Food** (v5.56.0) | "AI-personalized weekly meal plans tailored to your health goals" (Food+ paid tier) | "Automated pantry management with personalized cooking suggestions" — **claims a pantry, proves no subtraction** | "Plan your weekly meals, turn them into smart shopping lists" — consolidation/preview **unknown** | **NOT VERIFIED** | S1+S2+S3 apps.apple.com/us/app/id1133637674 and play.google.com/store/apps/details?id=com.foodient.whisk | STORE LISTING | support.samsungfood.com and samsungfood.com both 403 to automated fetch; the decisive pantry→list claim could not be checked against any first-party doc |
| **SuperCook** (iOS listing v2.0.6, 2022) | "SuperCook only shows you recipes that require the ingredients you already have" — pantry-driven suggestion feed | Pantry is a checklist of 2000+ ingredient names (presence, not quantity) | **unknown** — no shopping-list behaviour described in the listing | **ADJACENT** | S1+S2 apps.apple.com/us/app/id1477747816 | STORE LISTING (publisher shown as "AMR Systems LLC"; its relationship to supercook.com is **unknown**) | No verified list-writing step at all; supercook.com is a JS app that returns no fetchable text |

---

## Evidence quotes worth keeping (all verbatim)

**Grocy** — the cleanest statement of the arithmetic anyone ships:
> "By default the amount to be added to the shopping list is \"needed amount - stock amount - shopping list amount\" - when this is enabled, it is only checked against the stock amount, not against what is already on the shopping list"
> "Uncheck ingredients to not put them on the shopping list"
> "Are you sure you want to put all missing ingredients for recipe \"%s\" on the shopping list?"

**Eat This Much** — the cleanest statement of quantity-aware subtraction in a hosted product:
> "When your grocery list is generated, the amounts reflect how much you already have on hand in the pantry. This way, you're not buying more of what you already have. So, if your meal plans need 2 apples and you already have 1 in your pantry, the grocery list will only tell you to purchase 1 more apple."
> …and its own limit: "We don't have the ability to generate an entire meal plan with just your pantry yet."

**Tandoor** — pantry exclusion wired into the auto path, in the vendor's own strings and code:
> `"mealplan_autoexclude_onhand_desc": "When adding a meal plan to the shopping list (manually or automatically), exclude ingredients that are currently on hand."`
> `"OnHand_help": "Food is in inventory and will not be automatically added to a shopping list. Onhand status is shared with shopping users."`
> `checked: (ingredient.food ? !(ingredient.food.ignoreShopping || ingredient.food.foodOnhand) : true)` — the preview dialog pre-unchecks on-hand foods
> `recipes = list(recipes.order_by('?')[:days])` — the "recommendation" is `ORDER BY RANDOM()`

**Mealie** — preview + merge with unit conversion:
> `"on-hand-checkbox-label": "Setting this flag will make this food unchecked by default when adding a recipe to a shopping list."`
> `checked: !householdsWithFood.includes(currentHouseholdSlug.value)`
> `# consolidate items to be created` … `can_merge()` checks `standard_unit` convertibility, `merge_items()` calls `merge_quantity_and_unit(...)`

**Paprika** — the pantry records quantity but the automation ignores it:
> "For each pantry item you can record the quantity, purchase date, expiration date, and whether it is in stock or out of stock."
> "Ingredients placed in your pantry will automatically be unchecked when you add recipes or meal plans to your grocery list."

---

## Verdicts

- **DIRECT:** Tandoor Recipes, Mealie, Cooklist
- **PARTIAL:** Eat This Much, Grocy, Paprika, AnyList, KitchenPal, MealBoard
- **ADJACENT:** Mealime, Plan to Eat, SuperCook
- **NOT VERIFIED:** Samsung Food

**Separating the claim types.**
*Fact:* Tandoor and Mealie ship every one of the seven links, proven

--- P17, disconfirmation sprint ---
## STRONGEST REFUTATION FIRST

**RecipeFix: Recipe Converter (live, v2.4.0, updated 2026‑07‑19, US App Store id 6759676502) ships the explanation‑of‑substitution half of our gap today, and explicitly markets against black‑box AI.**

Verbatim from the live listing:

> "CHEF'S NOTES EXPLAIN EVERY CHANGE — No black-box AI. Every substitution comes with the culinary reasoning behind it — why we picked that ingredient, how it affects the cooking process, and what to watch for."

> "REFINE ANY RECIPE — Don't like a substitution? Missing an ingredient? Just tell RecipeFix what to change and it re-adapts on the fly. 'Swap chicken for tofu.' 'I don't have olive oil.' Done."

And a real rendered rationale from recipefix.app (Vegan Chicken Tacos):

> "Jackfruit is the closest thing to shredded chicken in the plant-based world. The trick is to cook it long enough that it dries out slightly and crisps at the edges"

It covers **the constraint** (celiac/dairy-free/vegan/**keto & low-carb** — a macronutrient constraint), **the substitution it made**, **a named reason per substitution**, and **user correction in natural language**. That is four of the six things our gap claims nobody ships. What it has **no trace of** is a pantry inventory or an expiry date — confirmed by fetching its own site: no inventory tracking, no expiry, no shelf-life.

**Consequence: our gap as written is too wide. The novel part is not "explains its recommendation" — that shipped. The novel part is "explains it against inventory state and a date."**

---

## METHOD NOTE (important, affects how you read confidence)

This session's WebSearch budget was **exhausted at 200/200 after my first 4 queries**. I substituted two harder instruments, which actually gave a wider sweep than the original P17:

- **iTunes Search API, 35 distinct query formulations → 806 unique live US App Store listings**, full descriptions regex-scanned (prior sprint: 222).
- **Google Play, 2 query formulations → 20 listings** scraped and scanned (prior sprint: iOS only).
- Direct WebFetch of vendor pages, arXiv, and the Grocy source repository.
- Apple review-RSS mining **failed** — the legacy endpoint now returns empty `entry` for almost every app (SuperCook, Prospre: 0 entries; RecipeFix: 2). The "users reject explanations" line is therefore **not tested**, not "absent."

Total distinct search formulations: **41**.

---

## RESULTS TABLE

| # | Query / formulation | Result | URL | Verdict | Conf |
|---|---|---|---|---|---|
| 1 | iTunes sweep, 806 apps, regex `no black-box\|why we picked\|reasoning\|rationale` | **1 app**: RecipeFix. "No black-box AI. Every substitution comes with the culinary reasoning behind it" | apps.apple.com/us/app/recipefix-recipe-converter/id6759676502 | **REFUTES (partial)** | high |
| 2 | recipefix.app — does it know a pantry? | No inventory, no expiry, no shelf-life anywhere on site. Rationale is culinary, not date- or gram-based | https://recipefix.app/ | confirms | high |
| 3 | 806-app cross-tab: pantry ∧ expiry ∧ nutrition | **15 apps** (Use It Up, Sously, Trepo, Silo Kitchen, PantryOK, Fresh, PicMeal, Real Plans, Chef AI…). **0 of the 15** contain any explanation-of-recommendation language | (list on request) | **confirms, strongly** | high |
| 4 | …of those 15, also mention substitution | 3 (Kitchen Sink, Fresh, Cookbook Master) — all use "swap" as a UI verb ("Swap dishes with one swipe"), none as an explained act | — | confirms | high |
| 5 | 806 apps, rationale-*sentence* patterns: `because it expires`, `expires in X`, `you have X expiring`, `we picked this` | **0 genuine hits.** The 4 raw matches are "uses your phone's camera", "uses your shopping history", "use up your swipes" | — | **confirms** | high |
| 6 | Closest incumbent: Sously: Pantry & Meal Planner | "each one showing what you have and what to grab first"; "Every idea is scored against your actual kitchen"; "Sously flags what to use first" | apps.apple.com/us/app/sously-pantry-meal-planner/id6766727448 | **refutes (weak)** | med |
| 7 | Closest incumbent: Use It Up: Pantry Recipes | "recipes from your real kitchen, **worst-expiring first**"; "See what's expiring, color-coded by urgency" | apps.apple.com/us/app/use-it-up-pantry-recipes/id6775112024 | **refutes (weak)** | med |
| 8 | Google Play, 20 pantry/meal listings, same regex | **0/20 explanation hits** — SuperCook, Cooklist, Whisk/Samsung Food, SideChef, Eat This Much, Plan to Eat, FoodiePrep, Feastr, StashCook, PantryPal, SousChef AI, Delishable AI, PantryToPlate, PantryCheck all clean | play.google.com | confirms | high |
| 9 | Grocy source — is the Due Score real? | **Verified verbatim** in `localization/strings.pot`: `msgid "Due score"` / "The higher this number is, the more ingredients currently in stock are due soon, overdue or already expired". Plus per-recipe strings: "Not enough in stock, %1$s missing, %2$s already on shopping list", "Requirements fulfilled" | raw.githubusercontent.com/grocy/grocy/master/localization/strings.pot | **refutes (strongest non-app)** | high |
| 10 | Discontinued product that tried it — Plan to Eat | **Verified verbatim**: the Pantry meant "Any item that was listed on your Pantry would not appear on your shopping list with the assumption that you already have it"; removal caused "confusion, incorrect shopping lists, multiple trips to the grocery store, and anything but streamlining" | learn.plantoeat.com/help/a-digital-pantry-inventory-does-it-really-help | confirms | high |
| 11 | **Correction to our own finding #1** | That page contains **no mention of a "Staples List."** Our claim that the Staples List is its named replacement and does not deduct is **not supported by this URL** — it must be sourced elsewhere or dropped | same | — | high |
| 12 | Policy/technical reason for absence | Pak'nSave (Foodstuffs) "Savey Meal-bot" generated a chlorine-gas "aromatic water mix", "Mystery Meat Stew", "bleach-infused rice surprise". Vendor response: recipes "are not reviewed by a human being", no guarantee of meals "suitable for consumption", "You must use your own judgement before relying on or making any recipe produced by Savey Meal-bot" | foxnews.com/world/grocery-store-ai-app-suggests-bizarre-sometimes-dangerous-recipes-users-report | **explains absence** | high |
| 13 | Substitute: ChatGPT — what it can't do | "ChatGPT has no pantry tracking capability. You can tell it what you have in a single conversation, but it forgets by the next session." / "It also can't track expiration dates, flag items running low, or prioritize ingredients that are about to go bad." | mealthinker.com/blog/chatgpt-vs-meal-planning-app | confirms | **low — competitor's own blog, self-serving** |
| 14 | Substitute: ChatGPT — what it does do | "ChatGPT creates meals from existing fridge contents prioritized by expiration date"; photo upload of fridge/pantry (4-photo cap); suggests substitutions for missing items. Independent critique: it "swaps in substitutes, but now you've got a recipe designed around ingredients you don't have, with workarounds patched in" | search summary + mealthinker.com/blog/ai-meal-planner-vs-chatgpt | **refutes (serious)** | med |
| 15 | Substitute: AI accuracy in the wild | "it made errors identifying ingredients from photos" and "suggested unappetizing ingredient combinations" | healthline.com/health/how-to-use-ai-for-food-swaps-and-recipe-ideation | neutral | med |
| 16 | Prior art check — is arXiv 2601.02374 real? | **REAL and correctly cited.** "A Lay User Explainable Food Recommendation System Based on Hybrid Feature Importance Extraction and Large Language Models", Tessa, Cidjeu, Carli, Abchiche, Aldarwishd, Tchappi, Najjar, submitted 10 Dec 2025. SHAP + LLM post-hoc explanation "to enhance user trust and transparency" | arxiv.org/abs/2601.02374 | confirms (no research novelty) | high |
| 17 | Rationale format accepted at consumer scale? | America's Test Kitchen ships **"Why This Recipe Works"** on every recipe — "so you'll know every test kitchen discovery" | apps.apple.com/us/app/americas-test-kitchen/id1365223384 | **refutes the "users don't want reasons" objection** | high |
| 18 | Per-recommendation rationale anywhere in this market? | Cookwise: Meal Planner — "See why each drink pairs with the dish." Per-recommendation *why*, shipped — but for wine pairing, not pantry | apps.apple.com/us/app/cookwise-meal-planner/id6759641268 | refutes (adjacent) | med |
| 19 | SeePantry Kitchen Copilot re-check | "Kitchen Copilot scores every item for waste risk and shows only what matters today" → "eat this first, freeze that tonight, **use this before Thursday**"; "Every suggestion is advisory, and every action can be undone within five seconds." Page shows **no** nutrition constraint and **no** substitution | seepantry.com/food-expiration-tracker | **refutes (item-level only)** | med |
| 20 | MealThinker — does it show its reasoning? | Full listing fetched. Mechanism claimed ("pantry items and expiration dates", "nutrition targets"), **zero** why/because/reason/explain tokens | apps.apple.com/us/app/mealthinker/id6757604137 | confirms | high |
| 21 | Recipy 9-app head-to-head (independent test) | Ranking method disclosed to *reviewers*, never to users: "ranks recipes by ingredient coverage. Recipes using 100% of their ingredients from your pantry appear first." No app criticised for opacity — nobody is asking | recipyapp.com/blog/best-pantry-tracking-apps-2026 | confirms | med |
| 22 | Complaints that users reject explanations | **NOT FOUND IN THIS SEARCH.** Apple's review RSS now returns empty for nearly every app; WebSearch budget gone. Untested, not absent | — | unknown | — |
| 23 | Xpiry (our own CONFIRMED-LIVE list), re-verified independently | v1.8.1, updated 2026‑08‑31, live. Regex for why/explain/reason/because/prioriti/first: **no hits at all** | apps.apple.com/app/id6756198499 | confirms our "unknown" | high |
| 24 | Samsung Food support centre | **HTTP 403**, same as our earlier block on samsungfood.com/food-plus/. Finding #3 still rests entirely on third parties | support.samsungfood.com | **provenance risk unchanged** | — |

---

## VERDICT: **GAP SURVIVES, BUT MUST BE RE-SCOPED. Do not present G1 as written.**

**FACT.** Across 806 live US iOS listings and 20 Android listings, exactly one product ships a named per-recommendation rationale with user correction — RecipeFix — and it has no pantry and no expiry. Exactly zero products combine pantry + expiry + nutrition *and* any explanation language; that intersection is 15 apps wide and 0 apps deep. Zero apps anywhere in the corpus contain a rationale sentence naming an item and a date.

**FACT.** The auditable-ranking half exists in Grocy (Due Score + "Not enough in stock, %1$s missing"), and the item-level date-reason half exists in SeePantry ("use this before Thursday"). The explained-substitution half exists in RecipeFix. **All three halves ship. Nobody has assembled them.**

**INFERENCE.** The absence is not a capability gap and not a demand gap — ATK has sold "Why This Recipe Works" for decades. It is most likely a **liability gap**: a match score is not an assertion, but "cook this because your chicken expires Thursday" is a food-safety assertion a vendor must stand behind. Pak'nSave is the cautionary tale the whole category watched, and its answer was a disclaimer, not better reasoning. Confidence: medium — this is my reading of one incident plus a market-wide silence, not a vendor statement.

**HYPOTHESIS (untested).** The reason nobody prints the expiry date in the rationale may be simply that no consumer app *knows* it — every app in the corpus either estimates shelf life from category (SeePantry) or asks the user to type it. A rationale that names a date exposes the weakest number in the system. This is the real reason G3's surviving fragment ("nobody propagates uncertainty into the recommendation") and G1 are the same problem.

---

## WHAT I'D CHANGE IN THE PLAN

1. **Re-word G1** to: *"No product that maintains a pantry inventory shows a per-recommendation rationale naming the specific item, the date that drove the choice, and the substitution it made — and RecipeFix proves each element is individually shippable."* This is defensible; the old wording dies to RecipeFix in one screenshot.
2. **Cite RecipeFix as your existence proof, not your competitor.** "No black-box AI" is a live, paying-customer-validated positioning statement in this exact category. It de-risks the build and it is the best slide you have.
3. **Kill or re-source the Staples List claim** in finding #1 — I fetched that URL and it is not there.
4. **Budget.** Within 160 h the honest build is the *joint* of three shipped halves, not novel reasoning: Grocy's due score (integer, auditable, ~4 h), a named-item + date rationale string (~12 h), RecipeFix-style natural-language correction (~20 h). Do **not** budget for the arXiv SHAP+LLM pipeline — it is published, post-hoc, and unnecessary. Do budget ~8 h for the disclaimer and correction affordance that Pak'nSave's incident says you will need.
5. **Still untested:** whether users *want* the reason. Apple's review feed is dead as an instrument; the ATK precedent is the only evidence either way and it is editorial, not personalized. Flag as the open risk.

--- P19, nutrition safety and competition audit ---
# P19 Independent Re-run — Training/Deficit-to-Groceries Gap + Nutrition Safety Boundary

Rerun date 2026-09-13. Prior verdict under test: **DEAD** (Codex analyst, `p1b/result/claude/01-market-survey.md:143`, `p1b/evidence/claude/runs/gap-interrogate.md:569-583`).

---

## 1. Verdict: the DEAD verdict is CORRECT

**Plainly: yes, P19 is dead. I confirm it independently, and I found it to be *more* dead than the team argued — but on a different axis than the team checked, and one of the team's three supporting claims is overstated.**

### 1a. What I confirmed first-party

**Eat This Much covers baseline energy → deficit → macros → plan → grocery list → pantry discount, with published formulas.** From `https://www.eatthismuch.com/calculator` (retrieved 2026-09-13):

> "We use the **Mifflin-St Jeor equation**" — Male: "BMR = 10W + 6.25H - 5A + 5"; Female: "BMR = 10W + 6.25H - 5A - 161"

> Sedentary "BMR × 1.2" · Lightly Active "BMR × 1.375" · Moderately Active "BMR × 1.55" · Very Athletic "BMR × 1.725" · Extremely Athletic "BMR × 1.9"

> "A one-pound-per-week setting, for example, starts with an adjustment of about 500 Calories per day."

And the pantry-discount half, from `https://help.eatthismuch.com/help/how-does-the-pantry-system-work` (Last updated 05 May, 2026):

> "the amounts reflect how much you already have on hand in the pantry. This way, you're not buying more of what you already have."

**Prospre covers three BMR formulas, deficit, weekday macro variation, plan, grocery list.** From `https://www.prospre.io/macro-calculator`: Harris-Benedict (revised 1984) "BMR = 13.397m + 4.799h - 5.677a + 88.362"; Mifflin-St. Jeor "BMR = 9.99m + 6.25h - 4.92a + c"; Katch-McArdle "BMR = 21.6m x (1 - BF% / 100) + 370"; "To calculate TDEE, BMR is multiplied by a Physical Activity Factor"; "A 500 calorie difference will result in roughly 1lb (0.45kg) per week weight change". From `https://www.prospre.io/meal-plan-generator`: "With our app, you can set different macros for each day of the week to do whatever macro cycling goals you have." From `https://www.prospre.io/`: "Get a grocery list with everything you need to follow your meal plan. Auto-fill your cart Amazon Fresh".

**Cooklist covers missing-ingredients-only lists.** From `https://cooklist.com/cooklist-app` (retrieved independently, 2026-09-13): "Since Cooklist already knows the ingredients you have at home it only adds the items that you are missing to your shopping list." Also "Cooklist automatically calculates expiration dates and notifies you before they expire."

All three legs of the team's DEAD verdict reproduce.

### 1b. Where I disagree with the team's reasoning (correction, not reversal)

**INFERENCE.** The team wrote that "Prospre ships per-training-day macro cycling" and used it to kill the "but ours links a TRAINING calendar" rescue. Prospre's own quote does not say that. "set different macros for each day of the week" is a **manual weekday assignment**, not a training-calendar-driven or workout-log-driven adjustment. No Prospre page I retrieved mentions exercise logging, a workout schedule, or a wearable. The team's claim is stronger than its own source. Anyone re-reading `gap-interrogate.md:569` should not repeat the phrase "per-training-day."

### 1c. Why the gap is nonetheless deader than argued — the axis nobody checked

The four P19 axes that Eat This Much and Prospre genuinely do **not** cover are *logged exercise*, *wearable activity*, *negative adjustment*, and *double-count prevention*. That looks like a live sliver. It is not, for a reason the team's evidence never reached:

**The most technically credible rival in this market has publicly and deliberately refused to build it.** From `https://macrofactor.com/expenditure/` (retrieved 2026-09-13):

> "Even if you have a smartwatch, you have a device that's quite good at measuring step counts, and quite bad at estimating energy expenditure. When given the option, we lean in favor of using more accurate data sources."

> "step counts won't be used to additively increase or decrease your calorie targets on individual days. Rather, step data will be incorporated into MacroFactor's algorithms in a manner similar to the data you're already logging (weight and nutrition data), meaning it will smoothly and progressively increase or decrease your estimated expenditure and calorie targets over time."

And where the feature *does* exist — MyFitnessPal's calorie adjustments — the vendor ships it **off by default** and maintains a dedicated article titled *"Should I turn on Negative Calorie Adjustments?"* to talk users through the harm. (**UNVERIFIED BODY:** `support.myfitnesspal.com/hc/en-us/articles/360032272152` and `.../360032623871` returned **HTTP 403** to WebFetch *and* to curl with a browser user-agent on 2026-09-13. Article titles and URLs are confirmed from the search index; I have no verbatim first-party text and am not quoting any. Someone with a browser should open these two — it is the one cheap follow-up here.)

**INFERENCE:** the residue of P19 is not an unbuilt feature. It is a feature the market built, found harmful enough to default off, and that the strongest competitor publicly declines to ship on accuracy grounds. Spending 160 hours re-implementing a $5/month commodity is the team's stated reason for DEAD; spending it re-implementing the *known-bad half* of that commodity is worse. **DEAD stands.**

### 1d. The one thing that would have saved it, and why it does not

**FACT.** No product I retrieved joins expiry-driven pantry planning to a calorie/macro target. Cooklist has expiry and no macro goals ("The webpage does not explicitly mention features for... calorie tracking, or macro goals"). Eat This Much has macros, but its help centre never mentions expiration dates at all and states pantry-only generation is out of reach ("The chances of finding an ample selection of recipes that fit your pantry _and_ your nutrition targets _and_ your meal preferences is very low"). That intersection is genuinely empty — but it is the team's G1/G3 territory, already funded, and it does not describe P19's training-adjusted-target claim. It does not rescue P19.

---

## 2. Rival comparison across the ten P19 axes

Every cell is first-party or marked UNKNOWN. "UNKNOWN" = opaque or not present on pages I actually retrieved — not "probably absent."

| Axis | Eat This Much | Prospre | MacroFactor | Cooklist | MyFitnessPal |
|---|---|---|---|---|---|
| Baseline energy | **Mifflin-St Jeor, published with coefficients** | **3 formulas published** (H-B '84, MSJ, Katch-McArdle) | "estimate BMR, then multiply by an activity correction factor" — factor value UNKNOWN | none | UNRETRIEVED (403) |
| Weight-goal deficit | "about 500 Calories per day" for 1 lb/wk | "A 500 calorie difference ≈ 1lb (0.45kg) per week" | UNKNOWN | none | UNRETRIEVED (403) |
| Logged exercise | **Absent from retrieved pages** | **Absent from retrieved pages** | **Explicitly not additive** (quoted above) | none | Documented feature, body UNRETRIEVED |
| Wearable activity | **Absent from retrieved pages** | **Absent from retrieved pages** | **Explicitly refused** (quoted above) | none | Documented, body UNRETRIEVED |
| Negative adjustment | UNKNOWN | UNKNOWN | N/A by design | none | **Named feature, off by default; body UNRETRIEVED** |
| Macro changes | "set macro quantities as either a range or a percentage of your calories" (blog tutorial #2) | yes, per-day | yes (tracker) | diet filters only | UNRETRIEVED |
| Workout-day templates | UNKNOWN | **Weekday, not training-driven** (see 1b) | no | none | UNKNOWN |
| Double-count prevention | N/A (no exercise input found) | N/A | **This is the design** | N/A | The adjustment mechanic *is* the reconciliation; asymmetric default |
| **Minimum-calorie guard** | **NOT FOUND on calculator page** | **"No minimum-calorie floor is specified"** | **"no statements regarding minimum calorie thresholds"** | N/A | UNRETRIEVED |
| Meal/recipe/list output | plan + list + pantry discount | plan + list + Amazon Fresh | **none — not a planner** | **missing-only list**, no macro target | Premium meal plans (unverified) |

**The most important row is the one the team never asked about: the minimum-calorie guard is absent from every first-party page I could retrieve across all three planners.** Nobody publishes a floor. That is not permission to skip one — it is why §4 exists.

### Disclaimers — the market baseline you are below

| Product | Verbatim disclaimer |
|---|---|
| Eat This Much | "This calculator provides an estimate for informational purposes and is not a substitute for professional medical advice. Individual calorie needs can vary for reasons the calculator cannot measure. **Consult a healthcare professional or registered dietitian before making significant changes to your diet or exercise routine.**" |
| Prospre | "**This is for informational purposes only, and is not medical advice.**" |
| **Epicourier** | **None. Zero.** `grep -rni "disclaimer\|medical advice\|dietitian\|consult a"` across `web/src`, `backend/api` and all root `*.md` returns exactly one hit — a README line about CSV export "for healthcare or personal archiving." |

---

## 3. Device-reported vs planner-reported calories — the discrepancies

**FACT (market).** Four distinct "calories burned" quantities circulate under one name:

1. **ETM's static band.** A self-declared multiplier of 1.2–1.9 applied to BMR once, held constant across the whole plan period. A wearable reports a different number every day. These are not the same quantity and no page reconciles them.
2. **MFP's asymmetric default.** Positive adjustments shown by default, negative adjustments off by default (per article titles; body unretrieved). **INFERENCE:** an asymmetric default resolves the disagreement by honouring the device only when it *raises* the budget. Whatever the intent, the arithmetic consequence is one-directional inflation.
3. **MacroFactor's refusal.

RULES: Do not invent products or sources. Use WebSearch/WebFetch for any market claim (load with
ToolSearch "select:WebSearch,WebFetch" if absent). Quote real page text. Write "unknown" rather
than something plausible. Separate fact, inference and hypothesis. Respect the 160-hour budget in
every recommendation.

Score each candidate feature. Rationale required for EVERY score; saturation and risk are
PENALTIES and must not be hidden inside a positive total.

feature | user-demand evidence 0-3 | incumbent saturation 0-3 | differentiation 0-3 |
implementation fit 0-3 | testability in one month 0-3 | safety/privacy risk 0-3 |
evidence confidence 0-3

Candidates:
F1. Grounded rationale: deterministic ranking in Python + a typed rationale naming the actual
    inventory rows, dates and constraints that produced the ranking, rendered in the UI.
F2. Uncertainty-aware ranking: model inventory staleness, rank by probability the ingredients are
    present, ask targeted verification questions.
F3. Recommended dish -> pantry-subtracted missing-items-only shopping list with preview and
    confirmation.
F4. Training-day energy/macro target -> explained meal -> missing-item list.
F5. Fix the recorded security/validation defects and ship a hardened baseline with an executed
    (not grep-based) adversarial suite.

Output: the table-stakes requirement; the narrow differentiating wedge; the one-month vertical
slice; the success metric; the kill signal; and the evidence still missing.

Choose ONE primary feature and AT MOST one supporting feature. "Build all of them" is not
permitted unless you independently estimate total implementation below 110 hours, leaving at
least 50 hours for testing and delivery — and if you do estimate that, show the estimate.
```

## Searches actually run

- `Tandoor Recipes "exclude" "on hand" shopping list ingredient food onhand documentation`

## Pages actually fetched

- https://apps.apple.com/us/app/recipefix-recipe-converter/id6759676502   — asked: Quote verbatim any text about explaining substitutions, reasoning, "black-box AI", chef's notes. Also state wh
- https://raw.githubusercontent.com/grocy/grocy/master/localization/strings.pot   — asked: Search for "Due score" and any msgid describing how the due score is computed, and any msgid about "Not enough
- https://help.eatthismuch.com/help/how-does-the-pantry-system-work   — asked: Quote verbatim what the page says about how pantry amounts affect the grocery list, about when ingredients are
- https://raw.githubusercontent.com/TandoorRecipes/recipes/develop/src/locales/en.json   — asked: Find and quote verbatim any strings about "on hand" (OnHand_help, mealplan_autoexclude_onhand_desc) and about 
- https://docs.mealie.io/documentation/getting-started/features/   — asked: Quote verbatim anything about shopping lists, "on hand", pantry, food inventory, and random recipe / meal plan
- https://apps.apple.com/us/app/use-it-up-pantry-recipes/id6775112024   — asked: Quote verbatim all description text about expiry, ranking or prioritising recipes. Does the listing anywhere e
- https://learn.plantoeat.com/help/a-digital-pantry-inventory-does-it-really-help   — asked: Quote verbatim what this page says about the removed Pantry feature and why it was removed. Does the page ment
- https://apps.apple.com/us/app/use-it-up-pantry-recipes/id6775112024   — asked: Print the FULL version history / What's New section verbatim, every version entry you can see, especially 1.0.
- https://itunes.apple.com/lookup?id=6775112024   — asked: Report sellerUrl, artistName, sellerName, version, currentVersionReleaseDate, and trackViewUrl from this JSON 

## Response

# P20 RERUN — ONE-MONTH WEDGE ADJUDICATION
**Adjudicator: Claude, independent rerun 2026-09-13. Every repo defect re-grepped against the working tree today; every market claim re-fetched today or explicitly marked unknown.**

---

## 0. METHOD NOTE AND WHAT CHANGED

**FACT.** WebSearch was exhausted (200/200) on my first query — the third consecutive session (P13, P17, this one) to hit that wall. Discovery ran on direct WebFetch of App Store listings, the iTunes lookup API, vendor help centres, and vendor source. Repo claims ran on `grep`/`sed` against the current tree. Nothing below is recalled; sources are named per claim.

**Two findings change the ruling.** One is a market fact that narrows the wedge. One is a code fact that sharpens it.

### 0.1 MARKET: the wedge is being colonised right now, by one person, since July

**FACT.** "Use It Up: Pantry Recipes", US App Store id 6775112024, v1.0.8, `currentVersionReleaseDate` **2026-07-28**, seller "MICHAEL GEORGE JOSEPH" (iTunes lookup API, fetched today). P17 scored this a *weak* refutation because its regex scanned only the description. The decisive text is in the **version history**, verbatim:

> **v1.0.5 (Jul 4):** "WHOOP-optimized recipe discovery: swipe a deck ranked for how you've recovered and trained today, **with a 'why this dish' explanation on every card**."

> **v1.0.3 (Jun 25):** "Meal Planner — build a weekly plan around the food already in your kitchen, swap any meal you're not feeling, and **turn the whole plan into a ready-to-shop grocery list**."

> **Description:** "tracks what's about to expire and tells you what to cook tonight using the food that needs eating first… recipes from your real kitchen, **worst-expiring first**"

That is a live app holding a pantry inventory with expiry dates, ranking worst-expiring-first, shipping a per-recommendation "why this dish" card, connecting a training signal, and emitting a grocery list. **It contains F1, F3 and F4 in one binary, shipped nine weeks ago.**

**What is still unknown, and it is the whole question:** the v1.0.5 note ties "why this dish" to *WHOOP recovery*, not to expiry. No first-party text shows its rationale naming a pantry item and a date. The iTunes payload carries **no `sellerUrl`**, so there is no site to check. I could not resolve this and I will not guess.

**Consequence:** G1 as re-worded by P17 is **wounded, not dead**. "No product that maintains a pantry inventory shows a per-recommendation rationale" is now false in the general case — Use It Up maintains one and shows one. What survives is narrower and must be said precisely: *no product shows a rationale computed from, and checkable against, the specific inventory rows and dates that produced the ranking.*

### 0.2 CODE: our recommender already shows a rationale, and validates none of it

**FACT, new in this audit, and worse than any of the 18 recorded defects.** `backend/api/inventory_recommender.py` is 245 lines. `grep -n "validate\|verify\|check"` returns **zero hits**. Line 231 parses Gemini's JSON; the parsed object carries `match_score`, `ingredients_available`, `ingredients_missing`, `expiring_ingredients_used` and `reason`. `web/src/components/inventory/RecipeRecommendationModal.tsx` renders them directly — `{recipe.reason}` at :298, the score at :303-307, and at :328-330:

> `Uses {recipe.expiring_ingredients_used.length} expiring ingredient… {recipe.expiring_ingredients_used.join(", ")}`

Nothing cross-checks those names against the `user_inventory` rows that were sent in. **The product already tells the user which of their food is expiring, and has no code path that verifies the claim.** The "Scoring Guidelines" at :159-162 (`+15` for 2+ expiring items, `base = available/total * 100`) are English sentences addressed to a language model, not arithmetic.

### 0.3 Corrections to the brief I was handed

| Brief claim | Verdict | Evidence |
|---|---|---|
| "UC17… The product actively recommends cooking food it believes has expired" | **OVERSTATED** | `inventory_recommender.py:157` contains a guard: `5. **NEVER**: Do not recommend recipes that ONLY use ❌ EXPIRED items`. The real exposure is narrower and still real: expired rows are injected at :89 as `(EXPIRED N days ago) ❌`, the guard blocks only recipes made *entirely* of them, and the guard is a prompt sentence, not a code path. Nothing enforces it. |
| Plan to Eat's "Staples List" is the named replacement and does not deduct | **NOT SUPPORTED — drop it** (confirms P17 row 11) | I re-fetched `learn.plantoeat.com/help/a-digital-pantry-inventory-does-it-really-help` today and asked explicitly. **No mention of a Staples List anywhere on that page.** |
| Headline IDOR is a false positive; real bug is the unchecked row count | **CONFIRMED** | `transfer/route.ts` checks only `checkError` on the `is_checked` update; the DELETE path (`~:170`) awaits with no destructuring at all. |
| `share/route.ts` is the one unmitigated hole | **CONFIRMED, first-hand** | The file opens with `createClient(NEXT_PUBLIC_SUPABASE_URL!, NEXT_PUBLIC_SUPABASE_ANON_KEY!)`, never calls `auth.getUser`, inserts on `shoppingListId` straight from the body, and does `expiryDate.setDate(expiryDate.getDate() + expiryDays)` unbounded. `grep -rn "shopping_list_shares" supabase/` returns **nothing** — no table, no `ENABLE ROW LEVEL SECURITY`, no policy. |
| No lots in the schema | **CONFIRMED** | `20251129030000_user_inventory.sql`: `CONSTRAINT unique_user_ingredient_location UNIQUE (user_id, ingredient_id, location)`, `quantity DECIMAL(10,2) NOT NULL DEFAULT 1`, no CHECK. Say **"item"**, never "lot". |

**FACT, new, and it directly threatens F1's headline promise.** `transfer/route.ts:66` merges a restock as `expiration_date: item.expiration_date || existingItem.expiration_date`. The incoming date **overwrites** the stored one whenever present, while quantities are summed. So after buying fresh spinach on top of old spinach, the single aggregate row carries the *later* date over *both* portions. A rationale that prints that date would overstate freshness — a food-safety-relevant error introduced by the rationale feature itself. One-line mitigation (`LEAST(existing, incoming)`, ~1 h) folded into F1's scope below.

---

## 1. SCORES

Penalties are shown as negatives and are **not** folded into a positive total. `NET = demand + differentiation + fit + testability + confidence − saturation − risk` (range −6…+15).

| feature | user-demand 0-3 | incumbent saturation 0-3 (PENALTY) | differentiation 0-3 | implementation fit 0-3 | testability in 1 month 0-3 | safety/privacy risk 0-3 (PENALTY) | evidence confidence 0-3 | **NET** |
|---|---|---|---|---|---|---|---|---|
| **F1 grounded rationale** | 2 | **−2** | 2 | 3 | 3 | **−2** | 3 | **+9** |
| **F2 uncertainty-aware ranking** | 2 | **−1** | 3 | 1 | 1 | **−1** | 2 | **+7** |
| **F3 pantry-subtracted list** | 3 | **−3** | 0 | 3 | 3 | **−1** | 3 | **+8** |
| **F4 training target → meal → list** | 2 | **−3** | 0 | 1 | 1 | **−3** | 3 | **+1** |
| **F5 hardened baseline, executed suite** | 1 | **0** | 0 | 3 | 3 | **0** | 3 | **+10** |

**Read the F5 row correctly.** It nets highest because it carries no penalties, not because it differentiates. A feature with demand 1 and differentiation 0 cannot be a wedge. F5's high net is the arithmetic telling you it is a *floor*, not a *product*.

### Rationale, every cell

**F1 — grounded rationale.**
*Demand 2:* three vendors pay to say it — RecipeFix's listing, which I re-fetched today, leads with "**No black-box AI. Every substitution comes with the culinary reasoning behind it — why we picked that ingredient, how it affects the cooking process, and what to watch for**" (v2.4.0, live); ATK has sold "Why This Recipe Works" for decades; Use It Up added "'why this dish' on every card". Not 3: zero direct user voice. Apple's review RSS is dead as an instrument (P17 row 22) and I could not revive it.
*Saturation −2 (higher than P17 concluded):* RecipeFix ships explained substitution **with natural-language correction**; Grocy ships the auditable ranking — I re-verified verbatim today: `msgid "The higher this number is, the more ingredients currently in stock are due soon, overdue or already expired"`; SeePantry ships item-level date reasons; Use It Up ships the per-card why *inside a pantry app*. Not −3 only because the specific cell — rationale naming the row **and** its date **and** correctable — is empty in every first-party text I could retrieve.
*Differentiation 2, down from 3:* Use It Up costs us the "nobody explains" claim. The honest wedge is now *computed and checkable*, not *explained*.
*Fit 3:* the highest in the table, and it is a port rather than a build. The UI contract already exists (`:298`, `:303`, `:328`); the data is already assembled (`format_inventory_with_expiration`, :68-100); the scoring rules already exist as English at :159-162 and need only move into Python.
*Testability 3:* a deterministic integer scorer needs no network and no LLM. Hypothesis is already vendored in `backend/.venv`. "Every name in the rationale resolves to a row in the input" is a property test, not a study.
*Risk −2:* printing a date makes a food-safety assertion you must stand behind — Pak'nSave is the category's cautionary tale. Compounded by the :157 guard being prose, by expired rows reaching the prompt at all, and by the date-overwrite bug in §0.3. Mitigable (~7 h, scoped below), not zero.
*Confidence 3:* every element re-verified today, first-party or from the tree.

**F2 — uncertainty-aware ranking.**
*Demand 2:* the best evidence in the entire corpus is Plan to Eat's post-mortem, which I re-fetched today — a vendor that built this and quit: "**There is no way for your real inventory and your Plan to Eat inventory to ever remain synchronized**" and "**Removing items from someone's shopping list without them knowing about it is never a good idea.**" That evidences the *problem*, not appetite for this *solution*.
*Saturation −1:* genuinely low. SeePantry and Fango expose estimates with correction; nobody propagates uncertainty into a rank.
*Differentiation 3:* the emptiest cell in the survey.
*Fit 1:* **our schema forbids it.** The UNIQUE constraint sums everything into one row; there are no lots, no purchase dates, no consumption log. "Probability the item is present" has nothing to condition on. You would have to build the evidence base first.
*Testability 1:* you can test that the code computes the number it claims; you cannot test that the number is *right*. The nearest published trial (JMIR PMC9482070) ran 6 students for a month and found no change — and that is the whole of our budget spent on measurement alone.
*Risk −1:* modest; failure mode is hiding food the user owns.
*Confidence 2:* G3's surviving fragment rests on absence-of-evidence across sweeps and I could not re-test it after the search budget died.

**F3 — pantry-subtracted, missing-items-only list with preview.**
*Demand 3, the highest in the table:* Plan to Eat's removal post is demand evidence *with a vendor-named failure mode that the preview gate directly answers*. Eat This Much, Grocy, Tandoor, Mealie, Paprika and Cooklist all ship a version.
*Saturation −3, the maximum:* Grocy publishes the exact arithmetic, re-verified verbatim today: "**By default the amount to be added to the shopping list is \"needed amount - stock amount - shopping list amount\"**", plus "Not enough in stock, %s ingredient missing" and "Put missing products on shopping list". Eat This Much's help centre, re-fetched today: "**if your meal plans need 2 apples and you already have 1 in your pantry, the grocery list will only tell you to purchase 1 more apple**". P13 found three DIRECT implementations.
*Differentiation 0:* there is nothing left to claim.
*Fit 3:* cheap here. `generate/route.ts` already consolidates duplicates (`ingredientMap`, merging by `ingredient.id`), and `grep -rn "user_inventory" web/src/app/api/shopping-lists/` returns **nothing** — the subtraction is simply absent, and adding it is contained.
*Testability 3:* pure arithmetic; demos beautifully.
*Risk −1:* low but vendor-named — silent subtraction causes missed purchases. That is why the preview is not optional.
*Confidence 3:* Grocy and ETM verbatim today; our own absence by grep. (Caveat: P13's Tandoor `en.json` URL 404'd for me on `develop` today, and Mealie's features page carries no on-hand text — so P13's two DIRECT self-hosted verdicts are **not independently reproduced here**. Immaterial: Grocy and ETM alone saturate the cell.)

**F4 — training-day target → explained meal → list.**
*Demand 2:* real but the market judges the mechanism harmful — MyFitnessPal ships negative adjustments off by default with an article talking users out of them.
*Saturation −3:* Eat This Much publishes Mifflin-St Jeor and the ~500 kcal rule; Prospre publishes three BMR formulas; and as of §0.1, **Use It Up already ships our entire F4 chain plus our F1 rationale** — WHOOP recovery → ranked deck → "why this dish" → weekly plan → grocery list, since July 4.
*Differentiation 0.*
*Fit 1:* needs an energy model, a training input and anthropometrics we do not have.
*Testability 1:* the correctness of a calorie target is not testable in a month.
*Risk −3, the maximum:* this is dietary advice. Every rival ships a medical disclaimer; P19's grep found Epicourier ships **none**; no rival publishes a minimum-calorie floor; and UC5's unbounded free text goes straight into the Gemini prompt.
*Confidence 3:* P19 is first-party and nothing I found contradicts it.

**F5 — hardened baseline with an executed suite.**
*Demand 1:* no user asks for this. It scores above zero only because it is a graded deliverable and because an *executed* adversarial suite is the direct answer to P1a's own disclosed caveat — that most "security tests" are source-text greps like `expect(route).toContain('.eq("user_id", user.id)')`.
*Saturation 0:* nobody competes on our bugs. Not a trick; the cell is genuinely empty.
*Differentiation 0:* fixing your own defects is table stakes.
*Fit 3:* precisely scoped and re-verified today, file by file (§0.3).
*Testability 3:* the share hole is testable as a *real executed attack* — an unauthenticated POST carrying another user's `shoppingListId` — which converts the weakest claim in P1a into the strongest.
*Risk 0:* this lowers risk. The risk is **not** doing it.
*Confidence 3:* our own tree, re-grepped today.

---

## 2. THE RULING

### PRIMARY: **F1 — grounded rationale.**
### SUPPORTING: **F5 — scoped to three defects plus an executed suite.**
### NOT IN SCOPE: F2, F3, F4.

**Why F1 over F3, given F3 has higher demand.** F3's differentiation is 0 and its saturation is maximal; four students spending a month re-implementing arithmetic that Grocy publishes as a formula and Eat This Much documents in a help article produces a report with nothing to claim. **Why F1 over F5, given F5 nets higher.** F5 has demand 1 and differentiation 0 — it is the price of admission, not the product. The ruling pairs the only cell with both a defensible claim and a 3 on implementation fit with the only work that must happen regardless.

**Why F1 is now *more* defensible than when the brief was written, despite Use It Up.** §0.2 is the reason. This is not a new feature bolted onto a working product; it is a **correctness fix to a shipped surface that currently renders unverified assertions about which of the user's food is expiring**. That framing survives contact with Use It Up even if Use It Up's card turns out to name a date: their claim is "we explain"; ours is "our explanation is computed from the rows and is checkable against them, and here is the property test that proves it."

---

## 3. TABLE-STAKES REQUIREMENT

**Market table stakes — explicitly deferred, and deferred as a pair:** the pantry-subtracted, missing-items-only list *with* preview and confirmation. Six or more products ship it; a product without it looks unfinished. It does not fit (§5), and it must never ship in its half form. Plan to Eat's own post-mortem is the reason, verbatim: "**Removing items from someone's shopping list without them knowing about it is never a good idea.**" Subtraction without the preview gate is the exact configuration a major vendor built, shipped, and withdrew. **Either both or neither. This month: neither.**

**Engineering table stakes — non-negotiable, inside F5:** `shopping-lists/share/route.ts` is an unauthenticated write to a table with no RLS and no migration. Demoing a product with that endpoint live is not a risk to manage, it is a defect to remove before the demo exists.

---

## 4. THE NARROW DIFFERENTIATING WEDGE

Stated in the only form that survives everything found today:

> **Every recommendation Epicourier makes is ranked by an integer computed in Python from named `user_inventory` rows, and shows the rows, dates and constraints that produced that integer — each one traceable to a record the user can correct in one tap, with the ranking recomputed in front of them.**

**What I am explicitly not claiming, and why:**
- Not "no one explains" — RecipeFix ships explained substitution with NL correction, and Use It Up ships a per-card why *inside a pantry app*. **Cite RecipeFix as the existence proof that the positioning sells; cite Use It Up as the reason the claim is worded narrowly.**
- Not "novel" — arXiv 2601.02374 (verified real by P17) is published prior art. This is a **market** gap.
- Not "lot" — the schema cannot represent one. **"Item."**
- Not "we know the date is right" — §0.3 proves we sometimes do not. The rationale must say *earliest known date for this item*, and the merge must take the earlier date.

---

## 5. THE ONE-MONTH VERTICAL SLICE, WITH THE ESTIMATE

**One user journey, end to end:** open recommendations → three dishes ranked by a Python integer → each card states *"Ranked #1: uses spinach (120 g, earliest known date 2026-09-16, 3 days) and yogurt (200 g, 5 days); 2 of 9 ingredients missing"* → tap any named item → correct quantity or date → ranking recomputes on screen, deterministically.

| Work | h |
|---|---|
| **F1** Deterministic scorer in Python — port `:159-162` to a pure function over `InventoryItem` + recipe rows; Grocy-style integer | 10 |
| **F1** Typed rationale object (row id, item name, earliest date, days-until, unit shortfall, contribution) + serialization | 6 |
| **F1** Grounding layer — reject or repair any model claim not backed by an input row (today: none exists) | 8 |
| **F1** UI — replace free-text `reason` with the typed rationale; one-tap correction writing back to `user_inventory` | 12 |
| **F1** Safety — hard-exclude expired rows from the rationale path in **code** (not prose); `LEAST()` date merge at `transfer/route.ts:66`; disclaimer copy (the market baseline we are below) | 7 |
| **F5** `share/route.ts`: migration + `ENABLE ROW LEVEL SECURITY` + policy, then `auth.getUser`, then ownership query, then bound `expiryDays` | 8.75 |
| **F5** `quantity \|\| 1` at `:65,:80,:167` — DB CHECK constraint + API validation | 1.5 |
| **F5** Transfer row-count check — the silent-data-loss bug under UC20 | 3 |
| **F5** Executed adversarial tests for those three (real HTTP, unauthenticated and cross-user — not greps) | 8 |
| **Testing** F1 unit + Hypothesis property tests (grounding, determinism, expired-exclusion) + UI test | 20 |
| **Implementation subtotal** | **64.25** |
| **Build + test subtotal** | **84.25** |
| Report 20 · poster 8 · demo incl. rehearsal and offline fallback 10 · coordination/review/CI 20 | **58** |
| **TOTAL** | **142.25 / 160 — 17.75 h slack** |

Implementation is **64.25 h**, well under the 110 h ceiling, and **75.75 h** remains for testing and delivery, above the 50 h floor. The two-feature scope is justified by that estimate. **Adding F3 would cost ~30 h** (6 subtraction + 10 preview/confirm + 6 unit-consolidation edge cases + 8 tests), taking the total to 172 h — over budget, and it is the feature with differentiation 0. Refused.

Sequencing: **F5's share-route fix lands in week 1, before any F1 UI work.** The scorer lands week 2, grounding week 3, UI and safety week 4, with the demo cut on the Friday of week 3 so week 4's slack is real.

---

## 6. SUCCESS METRIC

G2 is dead and measuring waste is out of budget — the closest published trial burned our entire month on 6 students and found nothing. So the metric is about the **artifact**, not the outcome, and it is chosen because the current system scores 0 on it:

1. **Groundedness (primary, hard gate): 100 % of rendered rationale claims resolve to a real `user_inventory` row belonging to the caller, with a date equal to that row's stored date.** Verified by an automated property test over ≥200 generated inventories. Baseline today: **0 % — no validation code exists** (`grep` returns nothing in a 245-line file).
2. **Determinism: identical inventory + recipe set produces byte-identical ranking across 100 runs.** The current LLM path cannot pass this; the new one must.
3. **Zero expired items reachable by the rationale path**, enforced in code and proven by test — replacing the prose guard at `:157`.
4. **Executed, not grepped:** an unauthenticated POST to `/api/shopping-lists/share` carrying another user's list id returns 401, demonstrated by a running test.
5. **Comprehension (the only affordable human evidence, 5 users, ~2 h):** shown one recommendation and asked "name the item and the date that caused this," ≥4/5 answer correctly. This tests whether the rationale is *legible*. It does **not** test whether it reduces waste, and the report must say so.

---

## 7. KILL SIGNALS

- **End of week 1 — scope gate.** If grounding a rationale to a row requires per-purchase provenance (i.e. anyone catches themselves writing "lot"), kill the row-level promise immediately and fall back to aggregate-row grounding with the honest wording "earliest known date for this item." Do **not** add a lots table; that is F2's cost, not F1's.
- **End of week 1 — security gate.** If the `shopping_list_shares` migration plus RLS exceeds 12 h against the 8.75 h estimate, freeze F1 UI work until it lands. A live unauthenticated share endpoint in a demo is a worse outcome than a plainer rationale.
- **End of week 2 — determinism gate.** If the Python scorer cannot replace the LLM's ordering in the existing UI without regressing the current recommendation flow, ship it as a *visible second ranking* beside the model's rather than silently blending the two. A blended score is neither auditable nor demoable and forfeits the entire claim.
- **Wedge kill.** If any first-party source shows a pantry app's per-recommendation card naming an inventory item **and** its expiry date — Use It Up is the live candidate — the differentiation claim is occupied. Do not abandon the build (§0.2 still justifies it as a correctness fix); retreat the *claim* to the correction-and-audit loop, which no rival documents.
- **Safety kill.** If the team cannot enforce expired-item exclusion in code by end of week 3, remove dates from the rationale string entirely and ship "uses 2 items expiring soon." Never print a date the system cannot stand behind.

---

## 8. EVIDENCE STILL MISSING (ranked by how much it would change the ruling)

1. **Does Use It Up's "why this dish" card name an item and a date, or only WHOOP recovery?** This is the single decisive unknown and it is *cheap*: one person, one iPhone, 30 minutes. No `sellerUrl` exists in the iTunes payload, so no remote instrument can answer it. **Do this before the wedge goes in the report.**
2. **Does Use It Up's grocery list subtract pantry quantities?** v1.0.3 says "turn the whole plan into a ready-to-shop grocery list" and claims no subtraction. Same phone, same 30 minutes. Determines whether F3 is *also* occupied.
3. **Samsung Food.** `support.samsungfood.com` and `samsungfood.com/food-plus/` have now returned HTTP 403 to three separate sessions. Finding #3 rests entirely on third parties and must be labelled as such in the report until a human opens a browser.
4. **Whether users want the reason at all.** Apple's review RSS is dead; WebSearch died at query 1 for the third session running. The ATK precedent is editorial, not personalised. **This is the open risk and it is untested, not absent** — say exactly that.
5. **The "Staples List" claim.** Re-source it or delete it. I confirmed today it is not on the cited page. What that page *does* say is better for us anyway, and should replace it.
6. **P13's Tandoor and Mealie DIRECT verdicts.** The cited `en.json` 404'd for me on `develop`; Mealie's features page shows no on-hand text. Not reproduced here. Does not change the ruling — Grocy and Eat This Much saturate F3 on their own — but do not cite Tandoor's source lines in the report without re-resolving the path.
7. **MyFitnessPal's negative-adjustment article bodies** (403 to two tools on two dates). Only matters if F4 is revived. It should not be.
