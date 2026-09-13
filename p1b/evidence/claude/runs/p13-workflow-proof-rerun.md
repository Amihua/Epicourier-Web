# P13-workflow-proof-rerun

**Workflow:** P1b Claude decide and commit (run 3)  
**Phase:** Classify  
**Model:** Claude Opus 5 (1M context), `claude-opus-5[1m]`  
**Agent id:** `a1af74c97e7e1d0b3`  
**Tool calls:** 84 total — 3 web searches, 29 pages fetched  
**Raw transcript:** `raw/agent-a1af74c97e7e1d0b3.jsonl` (full tool-call trace, retained)

---

## Prompt, exactly as issued

```text
You are a product intelligence analyst. This prompt (P13) was written by the Codex analyst on
our team, which asked that it be rerun independently on at least two other models. You are the
independent rerun. Do not look for the answer Codex got; run the method.

RULES: Do not invent products or sources. Use WebSearch/WebFetch for any market claim (load with
ToolSearch "select:WebSearch,WebFetch" if absent). Quote real page text. Write "unknown" rather
than something plausible. Separate fact, inference and hypothesis. Respect the 160-hour budget in
every recommendation.

Test this EXACT workflow, not keyword similarity:

  Actor accepts an automatically recommended dish -> system computes required ingredients ->
  subtracts pantry/on-hand items -> consolidates duplicate ingredients and units -> previews the
  change -> user confirms -> ONLY the missing items enter the shopping list.

Build a table:
product | exact step 1 | exact step 2 | exact step 3 | fully supported? | evidence URL per step |
evidence type (FIRST-PARTY / STORE LISTING / USER REPORT / THIRD-PARTY) | missing link

A product counts as a DIRECT rival only if one source proves the full workflow, or separate
sources prove every step. "Has recipes" plus "has lists" does not prove recipe-to-list
automation, and an automatic subtraction of pantry stock is a separate claim again. Search
official help centres and app-store listings before blogs.

End with DIRECT / PARTIAL / ADJACENT / NOT VERIFIED per product, and state the narrowest
surviving gap in one sentence.
```

## Searches actually run

- `meal planner app automatically subtracts pantry items from shopping list only missing ingredients`
- `grocy recipe "add not fulfilled products to shopping list" documentation`
- `Samsung Food meal plan shopping list "already have" pantry inventory help`

## Pages actually fetched

- https://cooklist.com/   — asked: Quote exact text describing: recipe recommendations, pantry tracking, generating a grocery list of only missin
- https://apps.apple.com/us/app/cooklist-pantry-meals-recipes/id1352600944   — asked: Quote exact text from the app description about pantry tracking, recipe suggestions based on what you have, an
- https://kitchenpalapp.com/en/   — asked: Quote exact text about: recipe recommendations/suggestions, pantry inventory, shopping list generation that ch
- https://docs.grocy.info/   — asked: Quote exact text about recipes, "requirements fulfilled", adding missing/not-fulfilled products to the shoppin
- https://raw.githubusercontent.com/grocy/grocy-docs/master/tutorials/cooking.md   — asked: Return the full text of this document verbatim, especially any sentences about recipes, missing products, shop
- https://docs.tandoor.dev/features/shopping/   — asked: Quote exact text about adding recipes or meal plans to the shopping list, automatic addition, "on hand"/pantry
- https://docs.mealie.io/documentation/getting-started/features/   — asked: Quote exact text about shopping lists, adding recipe ingredients to a shopping list, consolidating/combining d
- https://www.paprikaapp.com/help/ios/   — asked: Quote exact text about the Pantry feature, adding recipe ingredients to the Grocery List, whether the grocery 
- https://www.anylist.com/help   — asked: Quote exact text about adding recipe ingredients to a shopping list, selecting which ingredients to add, combi
- https://www.paprikaapp.com/help/ios/#groceries   — asked: Quote verbatim the full Groceries/Grocery List section, especially any sentences about "Add to Grocery List", 
- https://help.anylist.com/   — asked: List the help topics available. Quote any text about adding recipe ingredients to a list, meal plan, or pantry
- https://help.anylist.com/recipes/   — asked: List article titles and quote any text about adding recipe ingredients to a shopping list, choosing which ingr
- https://help.mealime.com/   — asked: List the help topics/articles. Quote any text about grocery list generation, pantry items or items you already
- https://support.mealime.com/   — asked: List the help topics/articles with their URLs. Quote any text about grocery list generation, pantry items or i
- https://help.anylist.com/getting-started/   — asked: Quote text about adding recipes to a shopping list, the meal plan, and any pantry feature. Include article lin
- https://support.mealime.com/category/69-grocery-list   — asked: List every article title and URL in this Grocery List category, and quote any text about items you already hav
- https://www.anylist.com/help/recipes   — asked: Quote text about adding recipe ingredients to a shopping list and any selection or pantry behavior.
- https://support.mealime.com/article/75-how-the-grocery-list-works   — asked: Quote the article verbatim as fully as possible, especially anything about ingredients being combined/grouped,
- https://help.anylist.com/recipes   — asked: List article titles and quote text about adding recipe ingredients to a shopping list, ingredient selection, a
- https://support.mealime.com/category/68-meal-plans   — asked: List article titles and URLs. Quote any text about how recipes are suggested or recommended to the user, perso
- https://apps.apple.com/us/app/anylist-grocery-shopping-list/id522167641   — asked: Quote exact text from the description about recipes, adding recipe ingredients to lists, meal planning, and an
- https://support.samsungfood.com/hc/en-us   — asked: List the help categories and article titles. Quote any text about shopping lists, meal plans, adding recipe in
- https://play.google.com/store/apps/details?id=com.whisk.android&hl=en_US   — asked: Quote exact text from the Samsung Food app description about meal planning, AI recipe recommendations, shoppin
- https://www.eatthismuch.com/   — asked: Quote exact text about automatic meal plan generation, grocery list generation, and any pantry/inventory featu
- https://support.eatthismuch.com/   — asked: List help article titles and URLs. Quote any text about the pantry, the grocery list, and whether pantry items
- https://apps.apple.com/us/app/eat-this-much-meal-planner/id981637806   — asked: Quote exact description text about automatic meal plan generation, grocery lists, and pantry ("already have") 
- https://play.google.com/store/apps/details?id=com.foodient.whisk&hl=en_US   — asked: Quote exact description text about meal planning, AI/recipe recommendations, shopping list generation from rec
- https://www.paprikaapp.com/help/mac/   — asked: Quote verbatim the Pantry section in full (including any mention of quantities, in stock, aisle, expiration) a
- https://samsungfood.com/   — asked: Quote exact text about meal planning, AI meal plans, shopping list generation from meal plans, and any pantry 

## Response

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
*Fact:* Tandoor and Mealie ship every one of the seven links, proven in vendor source; Grocy and Paprika ship links 2-7 but have no recommender; Eat This Much ships links 1-3 with real quantity arithmetic but writes the list without a confirm gate; Cooklist's marketing asserts the whole chain, but its consolidation and preview steps are attested only by app-store reviewers.
*Inference:* "Has recipes + has lists" is common; *quantity-aware* subtraction is rare — only Grocy, Eat This Much and (claimed) Cooklist/KitchenPal do more than a boolean skip. Tandoor's new `InventoryEntry`/`PantryBookingDialog`/`FreezerExpiryDialog` classes in the shipped branch suggest quantity inventory is arriving there, which would close the gap below within a release or two.
*Hypothesis (unverified):* Cooklist's consumer app is being de-prioritised in favour of a B2B "agentic commerce" business — supported only by cooklist.com now rendering as "Cooklist - Agentic Commerce for Grocery" with no consumer feature copy, plus a June-2026 last update. Do not cite this as fact.

**Narrowest surviving gap (one sentence):** No verified product combines all three of a *personalised* dish recommendation, *quantity-aware* pantry subtraction with unit normalisation, and an explicit user-confirmed preview of the shortfall before writing — Grocy has the arithmetic and the confirm but no recommender, Eat This Much has the recommender and the arithmetic but no confirm, and Tandoor/Mealie have the recommender and the confirm but only a boolean on-hand flag.

## Recommendations inside the 160-hour budget

Epicourier already has the two expensive halves (Gemini expiry-aware recipe suggestions; inventory with expiry; one-click list generation). The gap above is a *small* build, not a new product.

1. **Quantity-aware subtraction + unit normalisation engine — ~55 h.** Canonicalise units (mass/volume/count) with a density table for the top ~100 foods, merge duplicates across accepted dishes by `food_id × canonical_unit`, then write `max(0, needed − on_hand − already_on_list)` (Grocy's formula, which is public and battle-tested). Borrow Mealie's `can_merge`/`merge_items` shape rather than inventing one.
2. **The confirm gate nobody else has — ~35 h.** A diff screen: *needed / you have / to buy*, per line, each toggleable, with a single Confirm that is the only path that writes. This is the differentiator against Eat This Much and Cooklist, and it is cheap because it is pure UI over the engine in (1).
3. **Truth-in-pantry safeguards — ~25 h.** Cooklist's worst reviews are all inventory-drift ("it thinks you don't have the groceries"); add a staleness indicator, a "treat as unknown" state, and consume-on-cook. ~45 h left for tests, traceability and the write-up — do **not** spend it building a better recommender, which is the one part of the market that is already crowded.
