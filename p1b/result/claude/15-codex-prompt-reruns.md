# Independent reruns of the Codex analyst's prompts (P13 / P17 / P19 / P20)

**Run date:** 2026-09-13 · **Model:** Claude Opus 5 (1M context), `claude-opus-5[1m]`

The Codex run closed with a list headed *"Evidence still required before the final report"*, whose first item was: **"Run P13, P17, P19, and P20 independently on at least two other LLMs."** This is that rerun on Claude. The prompts are Sihao's, unmodified in method; the evidence is gathered fresh.

> **The headline result is a refutation of our own gap.** P17 was told to assume our gap was false and go prove it, and it succeeded in part — see §2.

> ### Corrections applied 2026-09-13 (audit pass)
>
> This was the largest and least-reviewed file in the set. An audit of it returned twenty-one
> findings; each is corrected **in place** below and carries a dated *Corrected 2026-09-13* clause
> or a note block, so the correction is visible rather than silent. Three are structural and are
> stated once, here:
>
> 1. **This file contains three mutually incompatible budgets** — P19 §6's ~40 h safety set,
>    P20 §5's 7 h funding of it, and P13's competing 115 h recommendation. They are reconciled in
>    the box at the head of **P20 §5**, with the arithmetic recomputed. Short version: **P20 §5
>    governs** as the plan of record (it is the only estimate here with a per-task decomposition
>    and it is this file's own final ruling); P13's block is superseded by P20 §2; P17 §4's numbers
>    are first-pass guesses. The one thing P20 §5 does **not** do is fund P19's SR set, and that
>    gap is left open rather than closed by edit.
> 2. **Vendor-only evidence is now hedged to the standard [`01-market-survey.md`](01-market-survey.md)
>    applies to Cooklist:** *a vendor artifact proves the claim was made, not that the feature
>    ships.* Every
>    RecipeFix and Use It Up claim in §2 and §4 rested on the vendor's own App Store copy, release
>    notes or marketing site with no independent corroboration, and is re-worded accordingly.
> 3. **Three of the team's four open forks run through this file** ([`18-self-audit.md`](18-self-audit.md),
>    *"Not fixed, and deliberately left as an open list"*): **Python or TypeScript** for the
>    scorer, **share route in or out** of scope, and **expired items excluded in code or scored at
>    zero**. This file takes one side of each. Those are flagged at the point of use and are
>    **not** settled here — they are the team's to decide.

---


## 1. P13 — Workflow-proof competitor hunt

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
| **Tandoor Recipes** (self-hosted, v2.6.15, 2026-09-07) | Auto-Planner dialog: picks recipes **at random** from keyword-filtered set, user hits Create; optional "Add to shopping" checkbox | User pref "Exclude Food On Hand" excludes on-hand foods when a meal plan goes to the list; on-hand = **boolean flag**, not quantity | Add-to-Shopping dialog lists every ingredient with checkboxes, on-hand/ignored foods **pre-unchecked**, servings scaler, "Add to Shopping" button; list entries "always grouped by food" | **DIRECT-boolean** — all seven links present, but step 2 is a boolean flag, not subtraction (re-tiered 2026-09-13, see Verdicts) | S1 `cookbook/views/api.py` L1546-1615 + `AutoPlanDialog.vue`; S2 `en.json` key `mealplan_autoexclude_onhand_desc` + `cookbook/helper/shopping_helper.py` L91-110; S3 `AddToShoppingDialog.vue` L123 + `vue3/src/stores/ShoppingStore.ts` L162-165 | FIRST-PARTY (vendor source + docs) | Pantry is on/off per food — no "have 200 g, need 500 g → buy 300 g" math |
| **Mealie** (self-hosted, mealie-next) | Meal planner "random recipe buttons" + Planner Rules that shape which random recipe is inserted | Food-level "On Hand" flag makes that food **unchecked by default** when a recipe is added to a list (per household) | `RecipeDialogAddToShoppingList.vue`: per-ingredient checkboxes, on-hand pre-unchecked, submit = "Add to List"; backend `bulk_create_items` consolidates and merges with **unit conversion** | **DIRECT-boolean** — all seven links present, but step 2 is a boolean flag, not subtraction (re-tiered 2026-09-13, see Verdicts) | S1 docs.mealie.io features page; S2 `frontend/app/lang/messages/en-US.json` (`on-hand-checkbox-label`); S3 `RecipeDialogAddToShoppingList.vue` L309-330 + `mealie/services/household_services/shopping_lists.py` L45-205 | FIRST-PARTY (docs + vendor source) | Same: boolean on-hand, no quantity subtraction; "random" ≠ personalised recommendation |
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

- **DIRECT (quantity-aware):** *none.*
- **DIRECT-boolean:** Tandoor Recipes, Mealie — every one of the seven links, but step 2 is a
  boolean on-hand flag, not quantity subtraction.
- **DIRECT (claimed, not first-party on every step):** Cooklist.
- **PARTIAL:** Eat This Much, Grocy, Paprika, AnyList, KitchenPal, MealBoard
- **ADJACENT:** Mealime, Plan to Eat, SuperCook
- **NOT VERIFIED:** Samsung Food

> *Corrected 2026-09-13: these verdicts previously read "**DIRECT:** Tandoor Recipes, Mealie,
> Cooklist". That contradicted the table and the step definition. Step 2 of the workflow under test
> is "compute ingredients **and subtract pantry stock**", and the table records Tandoor and Mealie
> as boolean on-hand flags with "no quantity subtraction" in the missing-link column — they fail the
> step as defined, so a flat DIRECT overstated them. The tier **DIRECT-boolean** is added rather
> than demoting them to PARTIAL, because they do complete every other link including the confirm
> gate. Cooklist is separated because its steps 4–5 rest on app-store reviewers, not first-party
> documentation. **Carry this caveat into any sentence that cites the count** — the one downstream
> use in this file, §4 (P20) §1 F3 ("P13 found three DIRECT implementations"), is corrected there.*

**Separating the claim types.**
*Fact:* Tandoor and Mealie ship every one of the seven links, proven in vendor source — but step 2 is a boolean on-hand flag, not the quantity subtraction the step defines (re-tiered **DIRECT-boolean** 2026-09-13, see Verdicts); Grocy and Paprika ship links 2-7 but have no recommender; Eat This Much ships links 1-3 with real quantity arithmetic but writes the list without a confirm gate; Cooklist's marketing asserts the whole chain, but its consolidation and preview steps are attested only by app-store reviewers.
*Inference:* "Has recipes + has lists" is common; *quantity-aware* subtraction is rare — only Grocy, Eat This Much and (claimed) Cooklist/KitchenPal do more than a boolean skip. Tandoor's new `InventoryEntry`/`PantryBookingDialog`/`FreezerExpiryDialog` classes in the shipped branch suggest quantity inventory is arriving there, which would close the gap below within a release or two.
*Hypothesis (unverified):* Cooklist's consumer app is being de-prioritised in favour of a B2B "agentic commerce" business — supported only by cooklist.com now rendering as "Cooklist - Agentic Commerce for Grocery" with no consumer feature copy, plus a June-2026 last update. Do not cite this as fact.

**Narrowest surviving gap (one sentence):** No verified product combines all three of a *personalised* dish recommendation, *quantity-aware* pantry subtraction with unit normalisation, and an explicit user-confirmed preview of the shortfall before writing — Grocy has the arithmetic and the confirm but no recommender, Eat This Much has the recommender and the arithmetic but no confirm, and Tandoor/Mealie have the recommender and the confirm but only a boolean on-hand flag.

## Recommendations inside the 160-hour budget

> **SUPERSEDED — corrected 2026-09-13.** Read this block as P13's first-pass output, not as a plan.
> It allocates 55 + 35 + 25 = **115 h** of feature build against the ~100 h of feature capacity
> established in [`12-milestones.md`](12-milestones.md) (160 h − 60 h fixed overhead), and its
> residual line ("~45 h left for tests, traceability and the write-up") budgets **no poster and no
> demo**. Its headline item is F3, which §4 (P20) §2 of this same file scores differentiation **0**,
> saturation **−3**, and places in **NOT IN SCOPE**. **§4 (P20) §5 is the plan of record**; the
> three items below are kept visible because P13's *market* findings are what P20 §2 scores, and
> because deleting a superseded plan hides the disagreement instead of showing it. See the
> correction box at the head of §4 §5.

Epicourier already has the two expensive halves (Gemini expiry-aware recipe suggestions; inventory with expiry; one-click list generation). The gap above is a *small* build, not a new product.

1. **Quantity-aware subtraction + unit normalisation engine — ~55 h.** Canonicalise units (mass/volume/count) with a density table for the top ~100 foods, merge duplicates across accepted dishes by `food_id × canonical_unit`, then write `max(0, needed − on_hand − already_on_list)` (Grocy's formula, which is public and battle-tested). Borrow Mealie's `can_merge`/`merge_items` shape rather than inventing one.
2. **The confirm gate Eat This Much and Cooklist lack — ~35 h.** A diff screen: *needed / you have / to buy*, per line, each toggleable, with a single Confirm that is the only path that writes. *Corrected 2026-09-13: this item previously read "the confirm gate nobody else has" and called it "the differentiator". It is not a differentiator — the table three rows above records four products shipping exactly this gate: **Grocy** ("Uncheck ingredients to not put them on the shopping list" + "Are you sure you want to put all missing ingredients for recipe \"%s\" on the shopping list?"), **Paprika** ("check/uncheck ingredients before they are added"), **Tandoor** (Add-to-Shopping dialog, on-hand foods pre-unchecked) and **Mealie** (`RecipeDialogAddToShoppingList.vue`, per-ingredient checkboxes). The "narrowest surviving gap" sentence above concedes it outright: "Grocy has the arithmetic and the confirm". What is true is the narrow form kept in the heading — Eat This Much writes the list with no confirm gate, and Cooklist's gate is attested only by reviewers.* It is cheap because it is pure UI over the engine in (1).
3. **Truth-in-pantry safeguards — ~25 h.** Cooklist's worst reviews are all inventory-drift ("it thinks you don't have the groceries"); add a staleness indicator, a "treat as unknown" state, and consume-on-cook. ~45 h left for tests, traceability and the write-up — do **not** spend it building a better recommender, which is the one part of the market that is already crowded.

---

## 2. P17 — Disconfirmation sprint

## STRONGEST REFUTATION FIRST

**RecipeFix: Recipe Converter (live, v2.4.0, updated 2026‑07‑19, US App Store id 6759676502) markets the explanation‑of‑substitution half of our gap today, and explicitly markets against black‑box AI.** *(Hedged 2026-09-13 from "ships": every artifact behind this section is the vendor's own — see the correction below.)*

Verbatim from the live listing:

> "CHEF'S NOTES EXPLAIN EVERY CHANGE — No black-box AI. Every substitution comes with the culinary reasoning behind it — why we picked that ingredient, how it affects the cooking process, and what to watch for."

> "REFINE ANY RECIPE — Don't like a substitution? Missing an ingredient? Just tell RecipeFix what to change and it re-adapts on the fly. 'Swap chicken for tofu.' 'I don't have olive oil.' Done."

And an example rationale published on recipefix.app (Vegan Chicken Tacos):

> "Jackfruit is the closest thing to shredded chicken in the plant-based world. The trick is to cook it long enough that it dries out slightly and crisps at the edges"

> *Corrected 2026-09-13:* this was introduced as "a real rendered rationale". It is not a capture
> of the shipped app — it is a sample recipe page on the vendor's own marketing site, i.e.
> vendor-authored collateral. Calling it "real rendered" asserted that the app produced the text
> when the artifact shows only that the vendor published it: the same class of error as the
> Cooklist `Sketch` / `9:41 AM` mockup [`01-market-survey.md`](01-market-survey.md) caught in our
> own G1 table. The standard that file now applies holds here too — **a vendor artifact proves the
> claim was made, not that the feature ships.** Everything in this section about RecipeFix rests on
> two vendor surfaces (the App Store listing and recipefix.app) and on **no** independent artifact.
> The only non-vendor artifact that exists for this app is the pair of review-RSS entries the
> METHOD NOTE records ("RecipeFix: 2"); **this run did not read them**, and reading them is the
> cheapest available corroboration. **Open question: does any non-vendor source show RecipeFix's
> rationale as rendered by the app?** Two review entries and one install would settle it.

It covers **the substitution it made**, **a named reason per substitution**, **user correction in natural language**, and a diet preset (celiac/dairy-free/vegan/keto & low-carb).

> *Corrected 2026-09-13:* the original sentence read "That is four of the six things our gap claims
> nobody ships." The denominator was undefined — the "six things" are enumerated nowhere in this
> file. The conjunction the team actually claims is the **four-way** one fixed in
> [`01-market-survey.md`](01-market-survey.md): *the named pantry item · its actual expiry date ·
> the nutrient constraint the dish satisfies · the reason for the substitution it made*, all in one
> auditable, correctable explanation. Scored against that, RecipeFix has **two of four** — the
> substitution reason, and (weakly) the constraint. It has no pantry inventory and no date, as the
> next sentence says. The constraint cell is the weak half: keto/low-carb on a listing is a **diet
> preset, a filter label**, not a nutrient target, so counting it as "a macronutrient constraint"
> was an over-read of the listing copy. Two of four, not four of six.

What it has **no trace of** is a pantry inventory or an expiry date — confirmed by fetching its own site: no inventory tracking, no expiry, no shelf-life.

**Consequence: our gap as written is too wide. The novel part is not "explains its recommendation" — at least one vendor is selling on that claim. The novel part is "explains it against inventory state and a date."** *(Hedged 2026-09-13 from "that shipped": the conclusion is unchanged, because a rival's marketed claim is enough to cost us the positioning whether or not the feature works as described.)*

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
| 3 | 806-app cross-tab: pantry ∧ expiry ∧ nutrition | **15 apps** (Use It Up, Sously, Trepo, Silo Kitchen, PantryOK, Fresh, PicMeal, Real Plans, Chef AI…). **0 of the 15** contain any explanation-of-recommendation language | (list on request) | **confirms, strongly — about listing *descriptions* only** (caveat added 2026-09-13: this instrument scans description text, not app behaviour; see VERDICT) | high **on the description text**, unknown on behaviour |
| 4 | …of those 15, also mention substitution | 3 (Kitchen Sink, Fresh, Cookbook Master) — all use "swap" as a UI verb ("Swap dishes with one swipe"), none as an explained act | — | confirms | high |
| 5 | 806 apps, rationale-*sentence* patterns: `because it expires`, `expires in X`, `you have X expiring`, `we picked this` | **0 genuine hits.** The 4 raw matches are "uses your phone's camera", "uses your shopping history", "use up your swipes" | — | **confirms — for description text only** (caveat added 2026-09-13; a rationale can ship without being advertised, as Use It Up's version-history text showed) | high **on the description text**, unknown on behaviour |
| 6 | Closest incumbent: Sously: Pantry & Meal Planner | "each one showing what you have and what to grab first"; "Every idea is scored against your actual kitchen"; "Sously flags what to use first" | apps.apple.com/us/app/sously-pantry-meal-planner/id6766727448 | **refutes (weak)** | med |
| 7 | Closest incumbent: Use It Up: Pantry Recipes | "recipes from your real kitchen, **worst-expiring first**"; "See what's expiring, color-coded by urgency" | apps.apple.com/us/app/use-it-up-pantry-recipes/id6775112024 | **refutes (weak)** | med |
| 8 | Google Play, 20 pantry/meal listings, same regex | **0/20 explanation hits** — SuperCook, Cooklist, Whisk/Samsung Food, SideChef, Eat This Much, Plan to Eat, FoodiePrep, Feastr, StashCook, PantryPal, SousChef AI, Delishable AI, PantryToPlate, PantryCheck all clean | play.google.com | confirms — for listing text only (caveat added 2026-09-13; see VERDICT) | high **on the listing text**, unknown on behaviour |
| 9 | Grocy source — is the Due Score real? | **Verified verbatim** in `localization/strings.pot`: `msgid "Due score"` / "The higher this number is, the more ingredients currently in stock are due soon, overdue or already expired". Plus per-recipe strings: "Not enough in stock, %1$s missing, %2$s already on shopping list", "Requirements fulfilled" | raw.githubusercontent.com/grocy/grocy/master/localization/strings.pot | **refutes (strongest non-app)** | high |
| 10 | Discontinued product that tried it — Plan to Eat | **Verified verbatim**: the Pantry meant "Any item that was listed on your Pantry would not appear on your shopping list with the assumption that you already have it"; removal caused "confusion, incorrect shopping lists, multiple trips to the grocery store, and anything but streamlining" | learn.plantoeat.com/help/a-digital-pantry-inventory-does-it-really-help | confirms | high |
| 11 | **Correction to our own finding #1** | That page contains **no mention of a "Staples List."** Our claim that the Staples List is its named replacement and does not deduct is **not supported by this URL** — it must be sourced elsewhere or dropped | same | — | high |
| 12 | Policy/technical reason for absence | Pak'nSave (Foodstuffs) "Savey Meal-bot" generated a chlorine-gas "aromatic water mix", "Mystery Meat Stew", "bleach-infused rice surprise". Vendor response: recipes "are not reviewed by a human being", no guarantee of meals "suitable for consumption", "You must use your own judgement before relying on or making any recipe produced by Savey Meal-bot" | foxnews.com/world/grocery-store-ai-app-suggests-bizarre-sometimes-dangerous-recipes-users-report | **explains absence** | high |
| 13 | Substitute: ChatGPT — what it can't do | "ChatGPT has no pantry tracking capability. You can tell it what you have in a single conversation, but it forgets by the next session." / "It also can't track expiration dates, flag items running low, or prioritize ingredients that are about to go bad." | mealthinker.com/blog/chatgpt-vs-meal-planning-app | confirms | **low — competitor's own blog, self-serving** |
| 14 | Substitute: ChatGPT — what it does do | "ChatGPT creates meals from existing fridge contents prioritized by expiration date"; photo upload of fridge/pantry (4-photo cap); suggests substitutions for missing items. The "independent critique" ("swaps in substitutes, but now you've got a recipe designed around ingredients you don't have, with workarounds patched in") came from a **search summary — that page was never fetched**, so the quote is unretrieved | ~~search summary~~ (unretrieved) + mealthinker.com/blog/ai-meal-planner-vs-chatgpt | **refutes (weak)** — *downgraded 2026-09-13 from "refutes (serious)"* | **low — same competitor's own blog as row 13, self-serving; second source unretrieved** |
| 15 | Substitute: AI accuracy in the wild | "it made errors identifying ingredients from photos" and "suggested unappetizing ingredient combinations" | healthline.com/health/how-to-use-ai-for-food-swaps-and-recipe-ideation | neutral | med |
| 16 | Prior art check — is arXiv 2601.02374 real? | **REAL and correctly cited.** "A Lay User Explainable Food Recommendation System Based on Hybrid Feature Importance Extraction and Large Language Models", Tessa, Cidjeu, Carli, Abchiche, Aldarwishd, Tchappi, Najjar, submitted 10 Dec 2025. SHAP + LLM post-hoc explanation "to enhance user trust and transparency" | arxiv.org/abs/2601.02374 | confirms (no research novelty) | high |
| 17 | Rationale format accepted at consumer scale? | America's Test Kitchen ships **"Why This Recipe Works"** on every recipe — "so you'll know every test kitchen discovery" | apps.apple.com/us/app/americas-test-kitchen/id1365223384 | **refutes the "users don't want reasons" objection** | high |
| 18 | Per-recommendation rationale anywhere in this market? | Cookwise: Meal Planner — "See why each drink pairs with the dish." Per-recommendation *why*, shipped — but for wine pairing, not pantry | apps.apple.com/us/app/cookwise-meal-planner/id6759641268 | refutes (adjacent) | med |
| 19 | SeePantry Kitchen Copilot re-check | "Kitchen Copilot scores every item for waste risk and shows only what matters today" → "eat this first, freeze that tonight, **use this before Thursday**"; "Every suggestion is advisory, and every action can be undone within five seconds." Page shows **no** nutrition constraint and **no** substitution | seepantry.com/food-expiration-tracker | **refutes (item-level only)** | med |
| 20 | MealThinker — does it show its reasoning? | Full listing fetched. Mechanism claimed ("pantry items and expiration dates", "nutrition targets"), **zero** why/because/reason/explain tokens | apps.apple.com/us/app/mealthinker/id6757604137 | confirms | high |
| 21 | Recipy 9-app head-to-head (independent test) | Ranking method disclosed to *reviewers*, never to users: "ranks recipes by ingredient coverage. Recipes using 100% of their ingredients from your pantry appear first." No app criticised for opacity — nobody is asking | recipyapp.com/blog/best-pantry-tracking-apps-2026 | confirms | med |
| 22 | Complaints that users reject explanations | **NOT FOUND IN THIS SEARCH.** Apple's review RSS now returns empty for nearly every app; WebSearch budget gone. Untested, not absent | — | unknown | — |
| 23 | Xpiry (our own CONFIRMED-LIVE list), re-verified independently | v1.8.1, updated 2026‑08‑31, live. Regex for why/explain/reason/because/prioriti/first: **no hits at all** | apps.apple.com/app/id6756198499 | confirms our "unknown" | high |
| 24 | Samsung Food support centre | **HTTP 403** to direct fetch — but **superseded 2026-09-13**: [`17-gap-closing.md`](17-gap-closing.md) retrieved `samsungfood.com/food-plus/` through the Wayback Machine. Food+ is $6.99/mo or $59.99/yr, and every Food+ feature is tagged *"Exclusively on mobile app"*. Finding #3 is first-party now, not third-party | web.archive.org capture of samsungfood.com/food-plus/ | ~~provenance risk unchanged~~ → **provenance risk closed** | high (archived vendor page) |

---

## VERDICT: **GAP SURVIVES, BUT MUST BE RE-SCOPED. Do not present G1 as written.**

**FACT.** Across 806 live US iOS listings and 20 Android listings, exactly one product **advertises** a named per-recommendation rationale with user correction — RecipeFix — and its own site shows no pantry and no expiry. Exactly zero listings combine pantry + expiry + nutrition *and* any explanation language in their description text; that intersection is 15 apps wide and 0 apps deep. **Zero apps anywhere in the corpus *advertise* a rationale sentence naming an item and a date in their listing description.**

> *Corrected 2026-09-13 — the instrument, not the finding, was overstated.* This paragraph
> originally read "exactly one product **ships**…" and "Zero apps anywhere in the corpus **contain**
> a rationale sentence naming an item and a date." The corpus is App Store listing *descriptions*,
> not app behaviour, so it can only support claims about what is **advertised**. §4 (P20) §0.1 of
> this same file demolishes the stronger reading in the one case it tested — "P17 scored this a
> weak refutation because its regex scanned only the description", and the decisive Use It Up text
> turned out to be in the version history, outside the regex's reach. A description-scan cannot
> prove absence of a behaviour; it proves absence of a marketing sentence. **The same caveat applies
> to rows 3, 5 and 8 of the results table, which carry "confirms, strongly / high" on this
> instrument and are annotated there.** What would upgrade any of these from *advertised* to
> *shipped*: installing the apps, which nobody on the team has done for any rival
> ([`01-market-survey.md`](01-market-survey.md) makes the same point about Cooklist).

**FACT.** The auditable-ranking half exists in Grocy (Due Score + "Not enough in stock, %1$s missing"), and the item-level date-reason half exists in SeePantry ("use this before Thursday"). The explained-substitution half is **claimed by** RecipeFix. **All three halves exist in live products — Grocy's in vendor source, SeePantry's and RecipeFix's in vendor copy only (hedged 2026-09-13). Nobody has assembled them.**

**INFERENCE.** The absence is not a capability gap and not a demand gap — ATK has sold "Why This Recipe Works" for decades. It is most likely a **liability gap**: a match score is not an assertion, but "cook this because your chicken expires Thursday" is a food-safety assertion a vendor must stand behind. Pak'nSave is the cautionary tale the whole category watched, and its answer was a disclaimer, not better reasoning. Confidence: medium — this is my reading of one incident plus a market-wide silence, not a vendor statement.

**HYPOTHESIS (untested).** The reason nobody prints the expiry date in the rationale may be simply that no consumer app *knows* it — every app in the corpus either estimates shelf life from category (SeePantry) or asks the user to type it. A rationale that names a date exposes the weakest number in the system. This is the real reason G3's surviving fragment ("nobody propagates uncertainty into the recommendation") and G1 are the same problem.

---

## WHAT I'D CHANGE IN THE PLAN

1. **Re-word G1** to: *"No product that maintains a pantry inventory shows a per-recommendation rationale naming the specific item, the date that drove the choice, and the substitution it made — and RecipeFix proves each element is individually shippable."* This is defensible; the old wording dies to RecipeFix in one screenshot.
2. **Cite RecipeFix as your existence proof, not your competitor — and cite it for exactly what it proves.** "No black-box AI" is **a live listing that markets against black-box AI** in this exact category. *Corrected 2026-09-13: this item previously called it "a live, paying-customer-validated positioning statement". Nothing in this document establishes a single paying customer for RecipeFix. The only artifacts behind it are the vendor's own App Store description and the vendor's own marketing site; the iTunes payload this run fetched carries `userRatingCount` and `averageUserRating`, and **neither figure was recorded, so neither is reported here** — I will not supply a number I did not keep. **Open question: what are RecipeFix's rating count and average rating?** One re-fetch of `itunes.apple.com/lookup?id=6759676502` settles it, and the answer decides whether this is a slide at all: if the count is at or near zero, a months-old unrated app is weaker evidence than the Cooklist listing the team already treats as the confirmation bar, and building a slide on it repeats the Cooklist-mockup failure in [`01-market-survey.md`](01-market-survey.md).* What it de-risks is the **positioning**, not the demand: it shows a vendor betting that explanation sells, not that anyone bought.
3. **Kill or re-source the Staples List claim** in finding #1 — I fetched that URL and it is not there.
4. **Budget.** Within 160 h the honest build is the *joint* of three shipped halves, not novel reasoning: Grocy's due score (integer, auditable), a named-item + date rationale string, RecipeFix-style natural-language correction, plus the disclaimer and correction affordance that Pak'nSave's incident says you will need. Do **not** budget for the arXiv SHAP+LLM pipeline — it is published, post-hoc, and unnecessary.

> *Corrected 2026-09-13 — the hours are removed, not re-derived.* This item originally priced those
> four lines at ~4 h, ~12 h, ~20 h and ~8 h. None of the four figures had a stated basis: no task
> decomposition, no comparable, no reference to a code path. They are **first-pass guesses,
> superseded by §4 (P20) §5**, which is the only estimate in this file built from a per-task
> decomposition against files that were read. Two of them were also wrong in kind, not just in
> precision: the ~20 h line budgets an **LLM re-adaptation loop** that §3 (P19)'s SR-4 and SR-5
> forbid (no model-derived target; model output is a proposal that must pass a validator), and §4
> (P20) §5 never funds it. Restoring a number here would require re-deriving it, which is P20 §5's
> job; the honest move is to leave this item as scope guidance and let one table carry the
> estimates.
5. **Still untested:** whether users *want* the reason. Apple's review feed is dead as an instrument; the ATK precedent is the only evidence either way and it is editorial, not personalized. Flag as the open risk.

---

## 3. P19 — Nutrition safety and competition audit

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
3. **MacroFactor's refusal.** Devices are "quite good at measuring step counts, and quite bad at estimating energy expenditure."
4. **The additive double-count.** **INFERENCE:** an activity multiplier already embeds habitual exercise. Adding logged or device-reported exercise *on top of* a multiplier ≥1.375 counts the same training twice. No planner page I retrieved warns about this. It is the single most likely way a naive implementation inflates a target.

**FACT (in-house — Epicourier already has its own unreconciled pair).** The product ships two calorie numbers that never meet:

- `POST /recommender` returns `goal_expanded` — a `calories_kcal` value **invented by Gemini 2.5 Flash from free text** (`backend/api/recommender.py:128-141`, returned raw at `backend/api/index.py:61`).
- `PUT /api/nutrients/goals` stores `calories_kcal` the user typed (`web/src/app/api/nutrients/goals/route.ts`).

Nothing in the codebase compares them, and the dashboard also offers a third number — `RECOMMENDED_GOALS = { calories_kcal: 2000, ... }` (`web/src/app/dashboard/nutrients/useNutrientDashboard.ts:53`) — presented behind a wand icon labelled **"Use Recommended"** with no source, no derivation, and no disclaimer. **You are already shipping the discrepancy class you were asked to find in rivals.**

---

## 4. Hard safety rules — testable, with the test for each

These bind **regardless of the DEAD verdict**, because `POST /recommender {goal: <free text>}` already reaches Gemini unbounded and returns nutritional targets to the user.

### The four load-bearing code facts

| # | Fact | Location |
|---|---|---|
| F1 | Free-text goal interpolated verbatim into the prompt: `f"**GOAL:** {goal_text}"`. No length cap, no delimiter, no content check. Endpoint validates only non-empty and `numMeals ∈ {3,5,7}`. | `backend/api/recommender.py:128-141`, `144-156`; `backend/api/index.py:47-61` |
| F2 | LLM output returned raw as authoritative nutrition targets: `return response.text.strip()` → surfaced as `goal_expanded`. No schema, no validator, no bounds. | `backend/api/recommender.py:141`, `156`; `backend/api/index.py:61` |
| F3 | **Server accepts any number as a calorie goal.** `if (typeof value !== "number" \|\| Number.isNaN(value))` — so `-500` and `Infinity` both pass and are upserted. Client zod is `.nonnegative()` only (no floor, no ceiling) and is trivially bypassed. | `web/src/app/api/nutrients/goals/route.ts` (`parseGoalPayload`); `web/src/app/dashboard/nutrients/useNutrientDashboard.ts:21-32` |
| F4 | Zero disclaimers repo-wide. | grep, §2 above |

None of the 19 adversarial tests in `p1a/evidence/own-tests/ATTACK-RESULTS.md` covers a calorie floor, a nutrition refusal, a disclaimer, or expired food. This is uncovered ground.

---

**SR-1 — The server is the safety boundary. No nutrition guard may exist only on the client.**
Every constraint in SR-2..SR-10 must hold when the request bypasses the UI.
**Test** `test_nutrition_guards_hold_on_direct_api_call`: for each of `PUT /api/nutrients/goals` and `POST /recommender`, issue a raw HTTP request with a payload the client form would reject. Assert `4xx` and assert the DB row is unchanged. **Currently FAILS** for goals (F3).

**SR-2 — A calorie target below the recorded floor is refused, never silently clamped.**
The floor is a single named server-side constant (`MIN_DAILY_KCAL`) with a `SOURCE` comment naming a citable authority and a retrieval date. It is never an inline literal and never duplicated. *The team sources the number; this report does not prescribe one.* A defensible escalation anchor to start from — NHS, `https://www.nhs.uk/conditions/obesity/treatment/`, retrieved 2026-09-13: *"You may also be able to get support from a dietician to follow a very low calorie diet (under 800 or 1200 calories)"* and *"Very low calorie diets are not suitable or safe for everyone."* Note this frames sub-threshold intake as **dietician-supervised**, which is the refuse-and-refer design, not a clamp.
**Test** `test_calorie_goal_below_floor_is_refused_not_clamped`: POST `MIN_DAILY_KCAL - 1`. Assert HTTP 400, assert the response body contains no calorie number at all (a clamp would leak one), and assert no row was written. Second assertion: `grep -rn` finds exactly one definition of `MIN_DAILY_KCAL` in the repo.

> *Corrected 2026-09-13 — the blocker is narrower than it looks, and it is named rather than
> filled.* An audit flagged that "the team sources the number" leaves the load-bearing constant of
> the load-bearing safety rule unspecified, so the test above cannot be written. **Half of that is
> wrong and half is right.** Wrong: the test *can* be written today — it is parameterised over
> `MIN_DAILY_KCAL` and asserts refuse-not-clamp behaviour, which is independent of the value; it
> will run against whatever constant is committed. Right: **nothing ships until a value is chosen,
> and this report will not choose one.** The NHS page cited above is an anchor, not an answer — it
> names *two* figures ("under 800 or 1200 calories") and frames sub-threshold intake as
> dietician-supervised, which is a statement about supervision, not a product floor.
> **Open question: what value does `MIN_DAILY_KCAL` take, and on whose authority?** Picking one is a
> product-safety decision with a named owner, not a fact this rerun can supply, and inventing a
> number here would be the exact failure this audit exists to stop. What would settle it: one named
> team member selects a conservative threshold, records it in the `SOURCE` comment with the citable
> authority, the retrieval date, and the sentence *"a conservative product-safety threshold, not a
> clinical recommendation"* — and the choice is reviewed in a pull request rather than made inline.

**SR-3 — Every nutrition number crossing a boundary is finite, positive, and bounded above.**
Kills the `Infinity` and negative paths in F3, and caps absurd upper values that make downstream planning meaningless.
**Test** `test_nutrition_fields_reject_non_finite_and_out_of_domain`: parametrize `PUT /api/nutrients/goals` over `[-500, 0, Infinity, -Infinity, NaN, 1e9, "2000"]` for every field in `GOAL_FIELDS`. Assert 400 for all. **Currently FAILS** for `-500`, `Infinity`, `-Infinity`, `1e9`.

**SR-4 — The system must never compute a personalised energy requirement itself, and must never let a model compute one.**
Epicourier stores no height, weight, age, sex or body-fat and must not acquire them for this purpose. It has no validated expenditure model, no weight-trend feedback loop (which is precisely what MacroFactor's expenditure algorithm is), and no clinical review. It may **accept and store** a number the user supplies or brings from elsewhere; it may **never derive** one — not from BMR arithmetic, not from an LLM, not from a "Use Recommended" default presented as advice.
**Test** `test_system_never_derives_an_energy_target`: (a) static — assert no BMR/TDEE coefficient appears anywhere outside test fixtures: `grep -rnE "Mifflin|Harris.?Benedict|Katch|6\.25|4\.92|13\.397|21\.6" backend/api web/src` returns empty. (b) behavioural — call `POST /recommender` with `goal="how many calories should I eat"` 20 times; assert zero responses reach the user containing a digit followed by `kcal`/`calories`. **Currently FAILS**: this is exactly what `nutrition_goal()` is built to do.
**Corollary test** `test_recommended_goals_default_is_labelled_not_prescribed`: assert `RECOMMENDED_GOALS` is not surfaced under any string matching `/recommend/i` unless the same rendered component also carries the SR-8 disclaimer and a source attribution. **Currently FAILS** (`useNutrientDashboard.ts:53` + the "Use Recommended" button in `GoalDialog.tsx`).

**SR-5 — Model output is a proposal, not a target. It passes a schema + range validator before it is displayed, persisted, or used in planning.**
Replace `return response.text.strip()` with structured output parsed into a Pydantic model whose fields carry `ge`/`le` bounds. A parse failure or a range violation is a refusal, not a fallback to raw text.
**Test** `test_model_nutrition_output_is_validated_before_surfacing`: monkeypatch the Gemini client to return, in turn, `"calories_kcal: 400"`, `"calories_kcal: -200"`, `"eat whatever you want"`, and a prompt-injection echo. Assert every case returns a refusal and that `response.text` never appears verbatim in the HTTP body. **Currently FAILS** — raw text is returned unconditionally.

**SR-6 — Enumerated refusal conditions produce a static, non-LLM response.**
Refuse and refer — never round-trip the refusal through the model, because the model is the thing being constrained. Minimum set, each an explicit test case: (a) disordered-eating indicators in the goal text; (b) stated pregnancy or lactation; (c) stated age under 18; (d) a named medical condition or a request to manage one by diet (diabetes, CKD, hypertension, coeliac, allergy severity); (e) drug, supplement or medication dosing; (f) any request for fasting duration or a supervised-only regime.
**Test** `test_refusal_conditions_return_static_copy_without_model_call`: parametrize ≥3 phrasings per condition; assert HTTP 200-with-refusal or 422, assert the mocked model client recorded **zero** calls, and assert the body byte-matches a constant in a `REFUSAL_COPY` module. Separately assert that refusal copy contains a referral line and contains no number.
**Note on scope:** this is a refusal boundary, not clinical triage. It exists so the product stops talking, not so it can assess anyone.

> *Corrected 2026-09-13 — the detector is scoped down, and its weakness is stated up front.* As
> written, (a)–(f) require detecting disordered-eating indicators, pregnancy, minors, named medical
> conditions, drug dosing and fasting requests in **free text, before any model call** — i.e. a
> non-LLM clinical-content classifier this team has never built — while being budgeted inside
> "SR-4 through SR-8 … roughly 14–18 h" shared with four other rules. That is not buildable in that
> envelope and should not be presented as though it were. **The rule is therefore: SR-6 is an
> explicit keyword/phrase list, committed in the repo as data (`REFUSAL_TRIGGERS`), reviewed in a
> pull request, with the matched trigger recorded on every refusal.** Its **false-negative rate is
> high and unmeasured** — any paraphrase outside the list passes straight through, and no honest
> number for that rate exists without a labelled test set the team does not have. It is a
> coarse pre-filter, not a detector. **The real controls are SR-5's output validator (which sees
> what the model actually produced) and SR-8's disclaimer**; SR-6 exists to catch the obvious cases
> cheaply and to make the refusal path exist at all. **Open question: who reviews the trigger list,
> and against what?** A named reviewer and a source for the disordered-eating terms (a published
> screening vocabulary rather than terms invented by us) is what would make this defensible; this
> report does not supply either.

**SR-7 — Refusal precedes generation.** The check runs before any prompt is built or any token is spent; there is no path where a plan is generated and then suppressed.
**Test** `test_refusal_short_circuits_before_prompt_construction`: spy on `build_recommendation_prompt` and the model client; for every SR-6 case assert both spies have zero calls.

**SR-8 — The disclaimer is co-located with every rendered nutrition number, on the same screen, in the same component, and it survives export.**
Not a footer, not settings, not the ToS, not onboarding-once. The market baseline is Prospre's one sentence and Eat This Much's referral sentence (§2); you currently have nothing. The product ships CSV/text export (`/api/nutrients/export`), so the disclaimer must be written into the exported file too — an exported number with no disclaimer is the version that gets forwarded.
**Test** `test_every_nutrition_surface_carries_a_colocated_disclaimer`: enumerate the components that render any `GOAL_FIELD_CONFIG` value or `goal_expanded` (nutrients page, `GoalDialog`, dashboard tile, `MealDetailModal`, recommender page). Render each with jsdom and assert the disclaimer text node is present in the same rendered tree. Plus `test_nutrient_export_contains_disclaimer_header`: assert the first line of every export format matches the constant. **Currently FAILS everywhere.**

**SR-9 — No exercise, step, or device-reported figure may be added to a calorie target until provenance and non-double-counting are both proven in code.**
Epicourier has no wearable integration today; this rule is a *pre-commitment* that keeps the cheapest-looking feature from being the one that ships unguarded. The precondition is: the target's activity component and the incoming activity figure are demonstrably disjoint. Given F1–F4, that proof does not exist and cannot cheaply be made — which is why §1c says don't build it.
**Test** `test_no_activity_figure_reaches_a_calorie_target`: `grep -rn` asserts no arithmetic combines any field named `*burn*`, `*steps*`, `*exercise*`, `*active_energy*` with `calories_kcal`; plus an API test that posts an `exercise_calories` field to `PUT /api/nutrients/goals` and asserts it is rejected as an unknown field rather than silently ignored (silent ignore is how it gets wired up later).

**SR-10 — Every nutrition number ever shown is reconstructible.**
Persist `{input, model+version, prompt hash, raw output, validator verdict, final value, timestamp}` for anything the product displays as a target. Without this you cannot answer "why did it tell me 900."
**Test** `test_every_surfaced_nutrition_number_has_an_audit_row`: run 50 recommender calls against a mocked model; assert audit rows == surfaced-number count, and that replaying each stored input through the validator reproduces the stored final value bit-for-bit.

---

## 5. The rule the team has not thought about

**SR-EXP — The system must never place an item it has labelled EXPIRED into a "cook this" recommendation. Expired items belong in a separate check-or-discard lane, never in the ingredient set of a proposed recipe, and never in a positively-framed badge.**

### Why this is a safety rule, not a quality rule

**FACT — the product ships an unenforced path that permits exactly the opposite, with only a prompt sentence standing in the way.**

> *Corrected 2026-09-13:* this heading previously read "**the product currently does exactly the
> opposite, by design**, with only a soft prompt string standing in the way", labelled FACT. Two
> things were wrong with that. (a) **"By design" is false as stated.** The prompt at
> `inventory_recommender.py:152-157` directs the model to *prioritise* ⚠️ EXPIRING SOON and ⏰ USE
> SOON items — not ❌ EXPIRED ones — and line 157 explicitly says *"**NEVER**: Do not recommend
> recipes that ONLY use ❌ EXPIRED items"*. Nothing anywhere defines `expiring_ingredients_used` as
> including expired rows. (b) **It was an inference about possible model behaviour carrying a FACT
> label, with no observed instance.** §4 (P20) §0.3 of this same file grades the identical claim
> about UC17 "**OVERSTATED**" and narrows it correctly; that narrowing governs, and this section is
> restated to match it. **What is FACT, verified in the tree today:** expired rows are injected into
> the prompt at `:89` as `(EXPIRED N days ago) ❌`; the only guard is prose at `:157`, and it blocks
> only recipes made *entirely* of expired items; and nothing post-parse prevents an expired item
> surfacing in the amber "expiring" badge — `RecommendedRecipe(**rec)` at `:239-243` accepts the
> model's field values as given. That is an **unenforced path**, not an intended behaviour.
> **Open question: does the model actually do it?** Unmeasured. One run of
> `recommend_from_inventory` over an inventory containing past-date rows, with the output pasted
> here, would earn the FACT label for the stronger claim; until someone runs it, the stronger claim
> is not available.

`backend/api/inventory_recommender.py:89` annotates expired stock and hands it to the model:

```python
if days_until < 0:
    line += f" (EXPIRED {abs(days_until)} days ago) ❌"
```

The only guard is prompt line 5 in `build_recommendation_prompt`:

> `5. **NEVER**: Do not recommend recipes that ONLY use ❌ EXPIRED items`

**That rule, read literally, *permits* every recipe that mixes expired food with fresh food.** One fresh onion legitimises three-week-old chicken. It is also a soft natural-language instruction to a 2.5 Flash model with no post-parse enforcement: `recommend_from_inventory` constructs `RecommendedRecipe(**rec)` straight from parsed JSON — `ingredients_available` and `expiring_ingredients_used` are accepted verbatim with no cross-check against which inventory rows were expired.

The frontend then **markets it as a feature**. `web/src/components/inventory/RecipeRecommendationModal.tsx:323-332` renders an amber badge with a clock icon:

> "Uses {N} expiring ingredient{s}: {names}"

There is no expired/expiring distinction anywhere in that path — the field is named `expiring_ingredients_used`, and `web/src/app/dashboard/inventory/page.tsx:133-140` sends **every** inventory row including expired ones with zero filtering. An item 21 days past date **can** arrive back as a green-flag selling point on a recipe card, in the same visual treatment as one expiring tomorrow, and nothing in the path prevents it. *(Hedged 2026-09-13 from "arrives back": no instance has been observed — see the correction above. The absence of a control is verified; the frequency is not.)*

### The root cause the team will miss if it only patches the prompt

**FACT.** `supabase/migrations/20251129030000_user_inventory.sql:19` stores `expiration_date DATE` — one undifferentiated column, commented "Expected expiration date for perishables." There is no label-type field. **The product therefore cannot know whether its own "EXPIRED" flag means unsafe or merely stale.** That distinction is regulatory, not cosmetic — UK Government / FSA, `https://www.gov.uk/understanding-food-labelling/best-before-and-use-by-dates` (retrieved 2026-09-13):

> "Use-by dates relate to the safety of food, whereas best before dates relate to quality."

> "Use-by dates on food labels tell you when the food is no longer safe to eat."

> "After the best before date, the food is usually safe to eat but may not be of the same quality."

**INFERENCE:** the system collapses a safety date and a quality date into one column, then instructs an LLM to prioritise cooking whatever is in it. Stale crackers and unsafe poultry are indistinguishable to every line of code in the path. Under that ignorance the only defensible default is: **an expired item is never an ingredient in a proposal.**

**Second, quieter failure mode — same rule, other direction.** In `format_inventory_with_expiration`, an item with `expiration_date = None` gets **no annotation at all**. The model sees an undated item as indistinguishable from fresh. `getExpirationStatus` in `web/src/utils/inventory/expiration.ts` has a correct `"unknown"` state that the backend prompt path throws away. **Unknown is not fresh**, and the schema makes `expiration_date` nullable, so this is the common case, not the edge case.

### The tests

**SR-EXP-1 — `test_expired_items_are_excluded_from_the_recommender_payload` (server-side filter, not prompt text).**
Build an inventory of 10 items, 4 with `expiration_date` in the past. Call `recommend_from_inventory` with a mocked model. Assert the string `EXPIRED` never appears in the prompt passed to the client, and assert the names of all 4 expired items are absent from `inventory_text`. *The filter must run in Python before prompt construction — a prompt instruction is not a control.* **Currently FAILS.**

> **Open team fork, flagged 2026-09-13, not settled here.** This rule and
> [`10-team-fit.md`](10-team-fit.md) **exclude expired items in code**;
> [`11b-mission-final.md`](11b-mission-final.md) and [`13-name-the-test.md`](13-name-the-test.md)
> instead **score them at zero** ([`18-self-audit.md`](18-self-audit.md), open-fork table). These
> are not the same control: zero points is not exclusion, because a coverage term can still rank an
> expired item into a recipe and into `ingredients_available`. The two positions imply different
> tests — the test above asserts the string `EXPIRED` never reaches the prompt, whereas a
> scored-at-zero design would assert a weight of 0 on a row that *is* still in the prompt. **The
> team decides; this file does not.** Whoever decides should also fix which assertion SR-EXP-1 and
> SR-EXP-2 carry, because as written they only make sense under exclusion.

**SR-EXP-2 — `test_expired_item_never_appears_in_any_returned_recipe` (output enforcement, adversarial model).**
Monkeypatch the model to return a recipe that lists an expired item in `ingredients_available` and in `expiring_ingredients_used` — i.e. simulate the model ignoring the prompt, which is the whole point. Assert `recommend_from_inventory` either drops that recipe or raises; assert no expired item name survives into any field of `InventoryRecommendResponse`. **Currently FAILS — there is no post-parse validation at all.**

**SR-EXP-3 — `test_expired_and_expiring_are_never_rendered_in_the_same_affordance` (jsdom).**
Render `RecipeRecommendationModal` with a recommendation whose `expiring_ingredients_used` contains one past-date item. Assert it does not appear inside the amber "Uses N expiring ingredient" badge. Assert expired items render only in a distinct discard/check element with distinct styling and non-promotional copy. **Currently FAILS.**

**SR-EXP-4 — `test_unknown_expiration_is_not_treated_as_fresh`.**
Pass three items — one dated fresh, one dated past, one with `expiration_date = None`. Assert the prompt annotates the undated item explicitly as unknown-date, and assert it is not counted toward any "expiring ingredients used" score. **Currently FAILS** (the `try/except ValueError` and the `if item.expiration_date` guard both fall through silently).

**SR-EXP-5 — `test_date_label_type_is_recorded_or_the_item_is_treated_as_use_by`.**
Schema-level. Until `user_inventory` carries a label-type column distinguishing use-by from best-before, assert that every past-date item is handled on the **use-by** (safety) branch. Encode the conservative default so that adding the column later is a widening change, never a silent loosening. Assert via a migration test that the column is either present-and-constrained or absent-with-the-safety-default active.

---

## 6. Budget

**FACT.** SR-1 through SR-3 and SR-EXP-1/2 are validator + filter work against code paths I have read: roughly 18–22 h including the tests. SR-4 through SR-8 are refusal copy, a structured-output schema, disclaimer placement and jsdom coverage: roughly 14–18 h. SR-9 and SR-10 are a grep-guard and an audit table: 5–8 h. **Total ≈ 40 h, one quarter of the 160.**

> *Corrected 2026-09-13 — this 40 h is not funded by the plan this same file ships.* §4 (P20) §5
> below carries a single **7 h** "Safety" line, covering the code-level expired-row exclusion, the
> `LEAST()` date merge and disclaimer copy — roughly SR-EXP-1 plus part of SR-8. Folding this
> section's 40 h into that plan takes it from 142.25 h to **175.25 h against 160**, i.e. −15.25 h
> of slack (37 h low end → 172.25; 48 h high end → 183.25). The two numbers are not reconcilable by
> arithmetic, and this correction does **not** pick between them: see the correction box at the head
> of §4 §5 for the full recompute and for the open question — *which SR rules ship this month and
> which are explicitly deferred* — that the team has to answer. The estimates in this paragraph are
> also range estimates from reading code, not measurements; SR-6's share of them is revised at the
> rule itself.

That quarter is affordable *because* P19 is dead: the build budget it would have consumed is free, and the team's own recommendation already routes it to G1. **INFERENCE:** SR-EXP-2 and SR-5 are also the same validator — "check every entity the model named against a real inventory row before surfacing it" — which is the identical mechanism G1's grounding-fidelity harness needs (`gap-interrogate.md`, G1 measurable claim: ">=95% of rationale sentences cite only inventory rows that actually exist"). Build it once, and the safety boundary and the G1 contribution share an implementation.

**HYPOTHESIS, flagged as such and worth 2 h to check before anyone argues about it:** the G1 harness baseline is described as expecting "well under 60%" citation fidelity from the current unconstrained Gemini path. If that holds, the same measurement quantifies how often SR-EXP-2 would have fired — turning a safety guard into a reportable number rather than a compliance checkbox. Do not assume the figure; measure it.

---

## Sources

- [Eat This Much — Calorie Calculator](https://www.eatthismuch.com/calculator)
- [Eat This Much — How does the pantry system work (updated 05 May 2026)](https://help.eatthismuch.com/help/how-does-the-pantry-system-work)
- [Eat This Much — Tutorial #2: Nutrition Target Profiles](https://blog.eatthismuch.com/eat-this-much-tutorial-2-editing-and-creating-your-nutrition-target-profiles/)
- [Prospre — Macro Calculator](https://www.prospre.io/macro-calculator)
- [Prospre — Meal Plan Generator](https://www.prospre.io/meal-plan-generator)
- [Prospre — homepage](https://www.prospre.io/)
- [MacroFactor — Expenditure](https://macrofactor.com/expenditure/)
- [Cooklist — app page](https://cooklist.com/cooklist-app)
- [MyFitnessPal — Should I turn on Negative Calorie Adjustments (HTTP 403, body unretrieved)](https://support.myfitnesspal.com/hc/en-us/articles/360032272152-Should-I-turn-on-Negative-Calorie-Adjustments)
- [MyFitnessPal — Understanding your Calorie Adjustment (HTTP 403, body unretrieved)](https://support.myfitnesspal.com/hc/en-us/articles/360032623871-Understanding-your-Calorie-Adjustment)
- [UK Government — Best before and use-by dates](https://www.gov.uk/understanding-food-labelling/best-before-and-use-by-dates)
- [NHS — Obesity treatment](https://www.nhs.uk/conditions/obesity/treatment/)

**Blocked, for the record (all 2026-09-13, WebFetch and curl with browser UA):** `support.myfitnesspal.com` 403, `blog.myfitnesspal.com` 403, `support.cronometer.com` 403, `fsis.usda.gov` 403, `foodsafety.gov` 403. Cronometer and MyFitnessPal rows in §2 are therefore UNKNOWN on formula and setting, not absent. WebSearch budget was exhausted at 200/200 mid-run; all findings above rest on direct first-party fetches.

**Key repo paths:** `backend/api/recommender.py`, `.../backend/api/inventory_recommender.py`, `.../backend/api/index.py`, `.../web/src/app/api/nutrients/goals/route.ts`, `.../web/src/app/dashboard/nutrients/useNutrientDashboard.ts`, `.../web/src/components/inventory/RecipeRecommendationModal.tsx`, `.../web/src/app/dashboard/inventory/page.tsx`, `.../supabase/migrations/20251129030000_user_inventory.sql`, `.../p1a/evidence/own-tests/ATTACK-RESULTS.md`, `.../p1b/evidence/claude/runs/gap-interrogate.md`

---

## 4. P20 — One-month wedge adjudication

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

That is a live app whose **listing and release notes claim** a pantry inventory with expiry dates, ranking worst-expiring-first, a per-recommendation "why this dish" card, a training signal, and a grocery list. **Its listing and release notes claim F1, F3 and F4 in one binary, last updated nine weeks ago.**

> *Corrected 2026-09-13 — hedged to the standard this team applies to Cooklist.* This paragraph
> originally read "That is a live app holding a pantry inventory … **It contains F1, F3 and F4 in
> one binary, shipped nine weeks ago**", and that unhedged reading is what cut F1's differentiation
> from 3 to 2 and declared G1 "wounded". The entire artifact is **a solo developer's own App Store
> description and release notes for a v1.0.8 app** — an assertion that features exist, not evidence
> that they work. [`01-market-survey.md`](01-market-survey.md) sets the rule after the Cooklist
> `Sketch` mockup: *a vendor artifact proves the claim was made, not that the feature ships.* It
> applies here with more force, not less, because there is no independent artifact of any kind for
> this app. **Neither `userRatingCount` nor `averageUserRating` was recorded from the iTunes payload
> this run fetched, so neither is reported here** — no number is invented to fill the gap. **Open
> question: how many ratings and reviews does Use It Up have?** One re-fetch of
> `itunes.apple.com/lookup?id=6775112024` answers it, and it matters: a one-person v1.0.8 app with
> no reviews is weaker evidence than the 11,297-rating Cooklist listing the team already treats as
> the confirmation bar, and the F1 differentiation score was moved on the strength of it. **The
> score is left at 2 rather than restored to 3** — restoring it would be a second unevidenced move
> in the opposite direction — but the reader should know the −1 rests on vendor copy alone.

**What is still unknown, and it is the whole question:** the v1.0.5 note ties "why this dish" to *WHOOP recovery*, not to expiry. No first-party text shows its rationale naming a pantry item and a date. The iTunes payload carries **no `sellerUrl`**, so there is no vendor site to check — *corrected 2026-09-13: that is not the same as "no remote instrument exists". The same payload carries `screenshotUrls` and `ipadScreenshotUrls`, which were never fetched; see §8 item 1.* I could not resolve this and I will not guess.

**Consequence:** G1 as re-worded by P17 is **wounded, not dead**. "No product that maintains a pantry inventory shows a per-recommendation rationale" is now false in the general case — Use It Up maintains one and shows one. What survives is narrower and must be said precisely: *no product shows a rationale computed from, and checkable against, the specific inventory rows and dates that produced the ranking.*

### 0.2 CODE: our recommender already shows a rationale, and validates none of it

**FACT, new in this audit, and worse than any of the 18 recorded defects.** `backend/api/inventory_recommender.py` is 245 lines. The parsed object is **schema-validated** by Pydantic at `:239-243` (`RecommendedRecipe(**rec)`), **but no code compares `expiring_ingredients_used` or `ingredients_available` against the `user_inventory` rows that were sent in.** What is missing is not validation in general — it is **grounding** validation.

> *Corrected 2026-09-13:* this sentence previously read `grep -n "validate\|verify\|check"` returns
> **zero hits**, and used that as proof of absence. A case-sensitive grep is not proof of absence —
> in a document whose own F5 case is that "most P1a security tests are source-text greps, not
> executed attacks", that is the same failure mode. Re-run case-insensitively today:
> `grep -in "validate\|verify\|check" backend/api/inventory_recommender.py` returns **one hit**,
> `238:    # Validate and return`, and the two lines under it construct Pydantic models, which *is*
> schema validation. The corrected claim above is both true and stronger, because it names the
> specific thing that is absent rather than relying on a string search.

Line 231 parses Gemini's JSON; the parsed object carries `match_score`, `ingredients_available`, `ingredients_missing`, `expiring_ingredients_used` and `reason`. `web/src/components/inventory/RecipeRecommendationModal.tsx` renders them directly — `{recipe.reason}` at :298, the score at :303-307, and at :328-330:

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
*Demand 2:* three vendors pay to say it — RecipeFix's listing, which I re-fetched today, leads with "**No black-box AI. Every substitution comes with the culinary reasoning behind it — why we picked that ingredient, how it affects the cooking process, and what to watch for**" (v2.4.0, live); ATK has sold "Why This Recipe Works" for decades; Use It Up's release notes **claim** "'why this dish' on every card" (vendor copy only — see the hedge in §0.1). Not 3: zero direct user voice. Apple's review RSS is dead as an instrument (P17 row 22) and I could not revive it.
*Saturation −2 (higher than P17 concluded):* RecipeFix ships explained substitution **with natural-language correction**; Grocy **publishes a due-score formula and shows the integer, but does not rank by it** — I re-verified the string verbatim today: `msgid "The higher this number is, the more ingredients currently in stock are due soon, overdue or already expired"` (*corrected 2026-09-13: this cell previously read "Grocy ships the auditable ranking". The artifact quoted does not support that — it is a **tooltip explaining what a number means**, which is neither a ranking nor an audit trail. Later runs established that Grocy surfaces a bare integer plus a colour and does not even sort by it: `'order': [[1, 'asc']]`, alphabetical by name — see [`01-market-survey.md`](01-market-survey.md). This **strengthens** the wedge rather than weakening it: the formula is public and the score is visible, but the user is never shown the ranking it would imply. The −2 saturation stands on the other three products in this cell.*); SeePantry ships item-level date reasons; Use It Up **claims**, in its own release notes, the per-card why *inside a pantry app* (see §0.1). Not −3 only because the specific cell — rationale naming the row **and** its date **and** correctable — is empty in every first-party text I could retrieve.
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
*Saturation −3, the maximum:* Grocy publishes the exact arithmetic, re-verified verbatim today: "**By default the amount to be added to the shopping list is \"needed amount - stock amount - shopping list amount\"**", plus "Not enough in stock, %s ingredient missing" and "Put missing products on shopping list". Eat This Much's help centre, re-fetched today: "**if your meal plans need 2 apples and you already have 1 in your pantry, the grocery list will only tell you to purchase 1 more apple**". *Corrected 2026-09-13: this cell previously ended "P13 found three DIRECT implementations." P13's verdicts have been re-tiered (see §1 Verdicts): **no product is DIRECT with quantity subtraction** — Tandoor and Mealie are DIRECT-boolean (on-hand flag, no arithmetic) and Cooklist's later steps rest on reviewers. The saturation −3 does not depend on that count: Grocy and Eat This Much publish the arithmetic first-party and saturate the cell on their own, as the confidence note below already says.*
*Differentiation 0:* there is nothing left to claim.
*Fit 3:* cheap here. `generate/route.ts` already consolidates duplicates (`ingredientMap`, merging by `ingredient.id`), and `grep -rn "user_inventory" web/src/app/api/shopping-lists/` returns **nothing** — the subtraction is simply absent, and adding it is contained.
*Testability 3:* pure arithmetic; demos beautifully.
*Risk −1:* low but vendor-named — silent subtraction causes missed purchases. That is why the preview is not optional.
*Confidence 3:* Grocy and ETM verbatim today; our own absence by grep. (Caveat: P13's Tandoor `en.json` URL 404'd for me on `develop` today, and Mealie's features page carries no on-hand text — so P13's two DIRECT self-hosted verdicts are **not independently reproduced here**. Immaterial: Grocy and ETM alone saturate the cell.)

**F4 — training-day target → explained meal → list.**
*Demand 2:* real but the market judges the mechanism harmful — MyFitnessPal ships negative adjustments off by default with an article talking users out of them.
*Saturation −3:* Eat This Much publishes Mifflin-St Jeor and the ~500 kcal rule; Prospre publishes three BMR formulas; and as of §0.1, **Use It Up's own release notes claim our entire F4 chain plus our F1 rationale** — WHOOP recovery → ranked deck → "why this dish" → weekly plan → grocery list, since July 4. (Vendor copy, uncorroborated — see the hedge in §0.1. Note the −3 does not depend on it: Eat This Much and Prospre saturate this cell on published formulas alone.)
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

**Engineering table stakes — non-negotiable, inside F5:** `shopping-lists/share/route.ts` is **an unauthenticated insert path with no ownership check and no RLS behind it**. Demoing a product with that endpoint live is not a risk to manage, it is a defect to remove before the demo exists.

> *Corrected 2026-09-13 — the claim is narrowed to what was actually established, and the gap is
> named.* This previously read "is an unauthenticated **write** to a table with no RLS and no
> migration". "Write" was asserted from source reading; **the request was never executed**, which is
> the exact grep-not-attack failure mode F5 exists to fix. Re-read in the tree today, the code says:
> the handler builds a client from `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY`
> (`:9-12`), never calls `auth.getUser`, takes `shoppingListId` and `expiryDays` straight from the
> body (`:15`), inserts into `shopping_list_shares` (`:23-31`), and on any Supabase error does
> `if (error) throw error` into a catch that returns **HTTP 500 "Failed to generate share link"**
> (`:33`, `:44-47`). And `grep -rn "shopping_list_shares" supabase/` returns nothing — the table has
> no migration in this repo. **So the document's own evidence implies the two outcomes are
> different: if the table exists in the deployed project, this is an unauthenticated insert; if it
> does not, the endpoint 500s and writes nothing.** **Open question: does `shopping_list_shares`
> exist in the deployed Supabase project, and what status code does an unauthenticated POST
> actually return?** One POST against a local or staging instance, with the status code recorded,
> settles it — and that run is already funded as the executed adversarial test in §5. Note that
> either answer leaves the defect worth fixing: an endpoint that inserts without an ownership check
> is a hole, and one that 500s is a shipped route with no backing schema.

> **Open team fork, flagged 2026-09-13, not settled here.** This file **gates the whole project** on
> the share route (it is the week-1 security kill signal in §7 and 8.75 h of §5). Four other files
> fund it; [`12-milestones.md`](12-milestones.md) and [`14-cut-list.md`](14-cut-list.md) **cut it**
> — `12` says dropping N5b (8.75 h) is "no longer the prudent option, it is the required one" to
> restore a margin. See the open-fork table in [`18-self-audit.md`](18-self-audit.md). Cutting it
> and gating on it are not reconcilable; **the team decides.**

---

## 4. THE NARROW DIFFERENTIATING WEDGE

Stated in the only form that survives everything found today:

> **Every recommendation Epicourier makes is ranked by an integer computed in Python from named `user_inventory` rows, and shows the rows, dates and constraints that produced that integer — each one traceable to a record the user can correct in one tap, with the ranking recomputed in front of them.**

**What I am explicitly not claiming, and why:**
- Not "no one explains" — RecipeFix's listing markets explained substitution with NL correction, and Use It Up's release notes claim a per-card why *inside a pantry app*. (Both are vendor artifacts with no independent corroboration — §0.1 and §2's RecipeFix correction. Hedging them does **not** restore the claim: a rival's unverified marketing is still enough to lose an argument at a poster session, which is precisely why the wedge is worded narrowly rather than as "no one explains".) **Cite RecipeFix as the existence proof that the positioning sells; cite Use It Up as the reason the claim is worded narrowly.**
- Not "novel" — arXiv 2601.02374 (verified real by P17) is published prior art. This is a **market** gap.
- Not "lot" — the schema cannot represent one. **"Item."**
- Not "we know the date is right" — §0.3 proves we sometimes do not. The rationale must say *earliest known date for this item*, and the merge must take the earlier date.

---

## 5. THE ONE-MONTH VERTICAL SLICE, WITH THE ESTIMATE

> ### Corrected 2026-09-13 — this file prices the same month three incompatible ways
>
> An audit found three budgets in this one document that cannot all be true. They are set out here
> rather than quietly harmonised, and the arithmetic is recomputed, not adjusted.
>
> | Budget | Where | What it spends | Against 160 h |
> |---|---|---|---|
> | **A — P20 §5 (below)** | this section | 64.25 implementation + 20 testing + 58 delivery | **142.25 → 17.75 h slack** |
> | **B — P19 §6 safety set** | §3 (P19) §6 | SR-1..SR-10 ≈ **40 h**, declared binding *"regardless of the DEAD verdict"* | funded here at **7 h**, not 40 |
> | **C — P13 recommendations** | §1 (P13) | 55 + 35 + 25 = **115 h** of feature build, "~45 h left" for everything else | 115 + 45 = 160, **no poster and no demo line at all** |
>
> **A and B are incompatible.** The single "Safety" line below is 7 h and covers only part of
> P19's set (code exclusion of expired rows, the `LEAST()` date merge, disclaimer copy). Funding
> P19's set as P19 prices it: 142.25 − 7 + 40 = **175.25 h → −15.25 h of slack**. Taking P19's
> stated ranges rather than its midpoint: low end (18 + 14 + 5 = 37 h) → 172.25 h, **−12.25**;
> high end (22 + 18 + 8 = 48 h) → 183.25 h, **−23.25**. On no reading does it fit.
>
> **A and C are incompatible.** P13's 115 h of feature build exceeds the ~100 h of feature capacity
> established in [`12-milestones.md`](12-milestones.md) (160 h − 60 h fixed report/poster/demo/
> integration overhead) by 15 h *before* a single test is written, and its residual line budgets no
> poster and no demo. P13's headline item is also F3 — the feature §2 of this same document scores
> differentiation **0**, saturation **−3**, and places in **NOT IN SCOPE**.
>
> **Which governs: A.** P20 §5 is the only estimate in this file with a per-task decomposition, and
> it is this document's own final ruling. P13's recommendation block is marked superseded at the
> point of use; P17 §4's competing numbers are marked as first-pass guesses.
>
> **What is left open, deliberately.** Nothing in this correction decides *which* of P19's SR rules
> ship. Plan A funds 7 h of safety work and P19 says 40 h is mandatory; that is a real, unfunded
> ~33 h hole, not a rounding difference. **Open question for the team: which SR rules are in the
> one-month scope and which are explicitly deferred with a stated reason?** What would settle it is
> a single pass through SR-1..SR-10 and SR-EXP-1..5 marking each *shipping / deferred*, then
> re-deriving the total below. Until that pass happens, **the 17.75 h slack advertised in the table
> is slack against plan A only, and plan A does not carry P19's mandatory work.** Note also that
> the delivery line below (58 h) is 2 h under the 60 h fixed overhead
> [`12-milestones.md`](12-milestones.md) uses, so the two files do not net out identically either.
>
> Related open fork, **not** settled here: this section assumes the scorer is **Python**
> ([`18-self-audit.md`](18-self-audit.md), *"Python or TypeScript"*), while
> [`08`](08-three-futures.md)/[`13`](13-name-the-test.md)/[`14`](14-cut-list.md) put it in
> **TypeScript** behind a 61 h Jest plan. The 10 h scorer line and the 20 h testing line below are
> priced for the Python reading. If the team picks TypeScript, this table must be re-priced.

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
| **TOTAL** — plan A only; see the correction box above. This total does **not** fund P19 §6's ~40 h safety set. | **142.25 / 160 — 17.75 h slack** |

Implementation is **64.25 h**, and **78 h** remains for testing and delivery. *Corrected 2026-09-13: this sentence previously read "well under the 110 h ceiling … and **75.75 h** remains … above the 50 h floor". The subtraction was wrong — 142.25 − 64.25 = **78**, not 75.75 (75.75 is 160 − 84.25, which has already spent the 20 h of testing the sentence claims is still to come). The "110 h ceiling" and "50 h floor" are removed rather than re-derived: neither is sourced anywhere in this file. The bound that is sourced is **~100 h of feature capacity** ([`12-milestones.md`](12-milestones.md): 160 h − 60 h fixed overhead), against which the 84.25 h build-and-test subtotal sits 15.75 h clear — and the comparable NOW plan in that file is 94.75 h, re-costed there to 100.75 h.* The two-feature scope is justified by that estimate. **Adding F3 would cost ~30 h** (6 subtraction + 10 preview/confirm + 6 unit-consolidation edge cases + 8 tests), taking the total to 172 h — over budget, and it is the feature with differentiation 0. Refused.

Sequencing: **F5's share-route fix lands in week 1, before any F1 UI work.** The scorer lands week 2, grounding week 3, UI and safety week 4, with the demo cut on the Friday of week 3 so week 4's slack is real.

---

## 6. SUCCESS METRIC

G2 is dead and measuring waste is out of budget — the closest published trial burned our entire month on 6 students and found nothing. So the metric is about the **artifact**, not the outcome, and it is chosen because the current system has **no mechanism** that could satisfy it. *(Corrected 2026-09-13: this read "because the current system scores 0 on it" — see the baseline correction under item 1. Having no validator is not the same as scoring zero, and the metric's value does not depend on the baseline being zero.)*

1. **Groundedness (primary, hard gate): 100 % of rendered rationale claims resolve to a real `user_inventory` row belonging to the caller, with a date equal to that row's stored date.** Verified by an automated property test over ≥200 generated inventories. Baseline today: **unmeasured — no validation code exists, so the current groundedness rate is unknown.** *Corrected 2026-09-13: this read "Baseline today: **0 % — no validation code exists** (`grep` returns nothing in a 245-line file)." That does not follow. Absence of validation code makes the rate **unverified**, not zero; Gemini may name real inventory rows most of the time, and nobody has looked. §3 (P19) §6 of this same file forbids exactly this move in the adjacent case — "Do not assume the figure; measure it" — so the primary metric's baseline was both a non-sequitur and a self-contradiction. The grep is also not proof of absence, for the reason given in §0.2.*
   **First week-1 task, and it is cheap: measure it.** Run the current unconstrained path over a fixed set of inventories, hand-check every name and date in the rendered rationale against the rows that were sent in, and publish the rate. ~2 h buys a real number and a real before/after; the alternative is a headline improvement from an invented baseline, which is worth nothing on a poster. Until that run happens the honest claim is "the current build checks nothing, and how often it is nonetheless right is unknown."

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

1. **Does Use It Up's "why this dish" card name an item and a date, or only WHOOP recovery?** This is the single decisive unknown and it is *cheap*: one person, one iPhone, 30 minutes. **Remote instruments are weak here, but they are not absent** — *corrected 2026-09-13: this item previously said "No `sellerUrl` exists in the iTunes payload, so no remote instrument can answer it", and routed the question straight to a physical device on that basis. That is false as a general claim. The lookup payload this run already fetched returns `screenshotUrls` and `ipadScreenshotUrls`, and App Store policy requires a privacy-policy URL — at least two cheap remote instruments existed and neither was tried before the question was declared remotely unanswerable.* **Try the screenshots first**: fetch `screenshotUrls` from `itunes.apple.com/lookup?id=6775112024` and read the recommendation card, **noting that screenshots are vendor-produced and may be mockups** — [`01-market-survey.md`](01-market-survey.md) caught exactly that on Cooklist, where the status bar read `Sketch` / `9:41 AM`. A screenshot can therefore *refute* the wedge (if a card names an item and a date, the claim is occupied whether or not the image is a capture) but cannot *confirm* it. **This run did not fetch them**, so the answer is still unknown. **Do the screenshot fetch and, if it is inconclusive, the install, before the wedge goes in the report.**
2. **Does Use It Up's grocery list subtract pantry quantities?** v1.0.3 says "turn the whole plan into a ready-to-shop grocery list" and claims no subtraction. Same phone, same 30 minutes. Determines whether F3 is *also* occupied.
3. **Samsung Food — ~~still missing~~ CLOSED; corrected 2026-09-13, this item is stale.** `support.samsungfood.com` and `samsungfood.com/food-plus/` did return HTTP 403 to three separate sessions, and this item originally concluded "Finding #3 rests entirely on third parties and must be labelled as such in the report until a human opens a browser." **That is no longer true and the instruction would waste the team's effort on a question already answered.** [`17-gap-closing.md`](17-gap-closing.md) retrieved the page through the Wayback Machine (`curl -sL "https://web.archive.org/web/2026/https://samsungfood.com/food-plus/"`): Food+ is **$6.99/month or $59.99/year** with a 7-day trial, and every Food+ feature that matters here — Food List search, automated pantry list, nutrition-goal tracking, AI recipe personalisation, tailored 7-day plans — is tagged first-party as **"Exclusively on mobile app"**, with *"You can only purchase a subscription on a mobile device."* Finding #3 is now first-party, not third-party. **Method note worth carrying forward:** `web.archive.org` was the instrument three sessions of 403s never tried, and the mobile-only result is materially useful rather than incidental — **Epicourier is a web app**, so Samsung Food's strongest pantry and planning features are not available on the surface we compete on. (Row 24 of §2's results table, "Samsung Food support centre — provenance risk unchanged", is superseded by the same capture.)
4. **Whether users want the reason at all.** Apple's review RSS is dead; WebSearch died at query 1 for the third session running. The ATK precedent is editorial, not personalised. **This is the open risk and it is untested, not absent** — say exactly that.
5. **The "Staples List" claim.** Re-source it or delete it. I confirmed today it is not on the cited page. What that page *does* say is better for us anyway, and should replace it.
6. **P13's Tandoor and Mealie verdicts** (re-tiered **DIRECT-boolean** on 2026-09-13; see §1 Verdicts)**.** The cited `en.json` 404'd for me on `develop`; Mealie's features page shows no on-hand text. Not reproduced here. Does not change the ruling — Grocy and Eat This Much saturate F3 on their own — but do not cite Tandoor's source lines in the report without re-resolving the path.
7. **MyFitnessPal's negative-adjustment article bodies** (403 to two tools on two dates). Only matters if F4 is revived. It should not be.

---
