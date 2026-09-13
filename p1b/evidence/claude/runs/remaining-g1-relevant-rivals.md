# Remaining G1-relevant rivals

**Workflow:** P1b Claude gap-closing (run 5)  
**Phase:** Close  
**Model:** Claude Opus 5 (1M context), `claude-opus-5[1m]`  
**Agent id:** `a086dde899a79aeb1`  
**Tool calls:** 46 total — 0 web searches, 3 pages fetched  
**Raw transcript:** `raw/agent-a086dde899a79aeb1.jsonl` (full tool-call trace, retained)

---

## Prompt, exactly as issued

```text
Our verification was capped, and the cap already cost us once — Cooklist was in the
dropped set and it nearly killed our claim. Close the rest of the relevant tail.

26 distinct candidate products remain unverified. Most are irrelevant to our surviving claim:
nutrition trackers (Cronometer, MacroFactor, Lifesum, Lose It!, Noom, YAZIO, MyFitnessPal) bear
only on a gap we already declared dead, and logistics apps (Too Good To Go, OLIO, Instacart)
recommend no recipes at all. Skip those and SAY you skipped them.

**Verify these nine, which could plausibly explain a recommendation:**
Mealie, Tandoor Recipes, KitchenOwl (the open-source family, like Grocy — use their GitHub repos,
READMEs, docs and issue trackers as first-party evidence, and check last release date), EverShelf,
Nosh AI, ChefGPT, Pantry Check, MyFridgeFood, Jow.

For each: is it alive (last release / last update / store lookup — a live marketing page proves
nothing)? Does it RECOMMEND or only search? And the decisive column: does it show the user WHY,
naming the specific item and its date?

For the open-source three, you can do something you cannot do with a closed app: **read the
source or the templates.** If a project renders a reason string, it is in the code. Grep for it.
That is the strongest evidence available anywhere in this survey, and it is free.

EVIDENCE RULES:
- Do NOT invent anything. Every claim needs a URL you actually retrieved this session.
- Quote 5-25 words of ACTUAL text, with the exact URL it came from.
- "unknown" beats plausible. Silence on a page means unknown, never "no".
- A vendor artifact proves a CLAIM WAS MADE, not that a feature ships. Say which you have.
- If a source is a marketing mockup rather than a real capture, SAY SO. We were burned by exactly
  this: a rival's App Store screenshot that looked like proof turned out to have "Sketch" and
  "9:41 AM" in its status bar.
- WebSearch may hit a 200-call session cap. Prefer direct fetches (Bash curl / WebFetch); the
  routes below are already proven to work, so use them rather than rediscovering them.

OUR SURVIVING CLAIM, already narrowed twice:

  "No shipped consumer meal product joins all four facts in one auditable, correctable
   explanation: the NAMED PANTRY ITEM, its ACTUAL EXPIRY DATE, the NUTRIENT CONSTRAINT the dish
   satisfies, and the REASON for the SUBSTITUTION it made."

Known positions: RecipeFix explains substitutions but holds no inventory and no dates. Cooklist
advertises "Your parsley is 7 days old and may expire soon" but the artifact is a vendor mockup.
Remy prints "Using up before they expire: <item> · <qty>" above suggested recipes but states no
date and no reason. Grocy publishes a due-score formula but shows the user a bare integer.

Refuting this claim is MORE valuable to us than confirming it.
```

## Pages actually fetched

- https://www.chefgpt.xyz/   — asked: What does this product do? Does it use a pantry inventory with expiration dates? Does it recommend recipes and
- https://evershelf.joshumi.com/   — asked: Describe the recipe suggestion / meal plan feature. Does the app suggest recipes because a specific inventory 
- https://www.chefgpt.xyz/pantry-chef   — asked: Does this feature use expiration dates for pantry items? When it suggests a recipe, does it show the user WHY 

## Response

- **checked:**
  - _item 1_
    - **name:** Tandoor Recipes
    - **alive:** ALIVE. Release 2.6.15 published 2026-09-07; repo pushed_at 2026-09-11; 8,591 stars; archived=false (GitHub API /repos/TandoorRecipes/recipes and /releases/latest, retrieved this session).
    - **explains why:** no
    - **evidence:** SOURCE-LEVEL PROOF, the strongest artifact in this survey. Tandoor genuinely HAS pantry expiry dates: cookbook/models.py:1384 `expires = models.DateField(null=True, blank=True)` on `class InventoryEntry`, and the UI really renders a formatted date - vue3/src/pages/InventoryBookingPage.vue:47 `DateTime.fromJSDate(inventoryEntry.expires).toLocaleString(DateTime.DATE_MED)` inside a chip colored error/success by whether it is past. So it owns the NAMED ITEM + ACTUAL DATE pair. But the recommender never touches it. The only suggestion path is the `makenow` filter - cookbook/views/api.py:1778 documents it as "Filter recipes that can be made with OnHand food" - which calls `cookable()` in cookbook/managers.py. I read that function in full: it builds `available = _is_available(household, shopping_users)`, expands through substitutes, then annotates `missing_foods=Count(...)` and does `.filter(missing_foods__lte=missing)`. A grep of the whole `def cookable` body for `expires|inventoryentry` returns a count of 0. The expiry column and the recommender are two disconnected subsystems in the same product. Two further confirmations: (a) the locale string `"ExpiringSoon": "Expiring Soon"` exists in vue3/src/locales/en.json:227, but grepping the entire repo for `ExpiringSoon` outside /locales/ returns nothing - it is an orphaned string rendered by no component; (b) substitutions are admin SETUP, not explanation: FoodEditor.vue:130 offers a `Substitutes` multi-select whose help text is "substitute_help", and the substitution silently widens the match - `missing_foods` appears only at managers.py:392 and :402 and is surfaced in no serializer or component, so the user sees neither which food was substituted nor why. Nutrition is absent entirely: grep for `nutrit|calor|protein` in cookbook/helper/recipe_search.py returns zero hits.
    - **threat to our claim:** MEDIUM
    - **url:** https://github.com/TandoorRecipes/recipes/blob/master/cookbook/managers.py
    - **recommends:** Recommends (a real on-hand cookability filter), but the explanation is strictly weaker than Grocy's: Grocy at least shows a bare integer, Tandoor shows nothing at all - the missing_foods count never leaves the query. Cite Tandoor as the survey's cleanest proof that holding expiry dates and recommending recipes in ONE shipped product still does not produce a joined explanation. This is a refutation attempt that failed at the source level, which is the most defensible form of negative evidence we have.
  - _item 2_
    - **name:** Mealie
    - **alive:** ALIVE. Release v3.25.1 published 2026-09-04; repo pushed_at 2026-09-13 (today); 13,206 stars; archived=false (GitHub API, retrieved this session).
    - **explains why:** partial
    - **evidence:** The single closest thing to a counterexample on the SUBSTITUTION leg, and I confirmed it in shipped source rather than marketing. Mealie's finder returns a typed substitution explanation to the client: mealie/schema/recipe/recipe_suggestion.py defines `class RecipeSuggestionSubstitutedFood(MealieModel)` documented as "A food the recipe calls for that the user doesn't have, and the one covering it.", carried on `RecipeSuggestionResponseItem` as `substituted_foods: list[RecipeSuggestionSubstitutedFood]`. The backend picks it in mealie/repos/_recipe_suggestions.py via `_find_substitute_on_hand`, whose docstring reads "The first substitute food the user has on hand, or None." And the frontend genuinely RENDERS it - RecipeSuggestion.vue line 44 emits `$t("recipe-finder.substituting")` then loops `substitutedFoods` into chips at line 55 calling `$t("recipe-finder.substitute-for-food", {substitute, food})`. The en-US locale resolves those to `"substituting": "Substituting"` and `"substitute-for-food": "{substitute} for {food}"` (frontend/app/lang/messages/en-US.json:646-647). So a shipped screen really does say e.g. "Substituting: chicken broth for chicken stock". CRUCIALLY, that is the only leg it reaches. Mealie has NO food-expiry concept whatsoever: I grepped every .py/.ts/.vue for `expir|best.?before|use.?by` and every single hit is auth or sharing infrastructure - `expiresAt` token refresh in use-auth-backend.ts, `link-expires` on group exports, `recipe-share.expiration-date` on share links, `lockout_expires_at` on user lockout. There is no expiry field on any food or pantry item. No nutrient constraint either: grep for `nutrit|calorie|protein|macro` across _recipe_suggestions.py, recipe_suggestion.py and the finder page returns zero. Also note the substitution model CAN hold free text - IngredientFoodSubstitutionModel's docstring says a substitution "can be another food ('chicken broth'), a free-text workaround ('water and a bouillon cube'), or a food with a caveat attached" - but `RecipeSuggestionSubstitutedFood` carries only `food` and `substitute_food`, NOT the note, so the finder names the swap without giving its reason.
    - **threat to our claim:** MEDIUM
    - **url:** https://github.com/mealie-recipes/mealie/blob/master/mealie/repos/_recipe_suggestions.py
    - **recommends:** Recommends, and is the one product in the survey that verifiably ships a rendered substitution explanation. Narrow our wording so we never imply nobody explains substitutions - Mealie does, and it is free to inspect, so a reviewer will find it. Position it exactly like RecipeFix: owns the substitution leg, holds no expiry dates at all (provably - the grep is clean), and applies no nutrient constraint. Our claim is about the JOIN, and Mealie cannot reach two of the four facts.
  - _item 3_
    - **name:** KitchenOwl
    - **alive:** ALIVE but slowest of the three. Release v0.7.10 published 2026-07-26; repo pushed_at 2026-08-29; 3,678 stars; archived=false (GitHub API, retrieved this session).
    - **explains why:** no
    - **evidence:** Suggestions exist but are explicitly a weighted random draw, not reasoning. backend/app/models/recipe.py:67-68 declares `suggestion_score` and `suggestion_rank`; the comment at line 66 reads "Internal meal planner suggestion score and rank". I read `compute_suggestion_ranking` in full: it does `choose = randint(1, suggestion_sum)` and walks the recipe list subtracting scores to assign ranks - a lottery weighted by score, under the comment "iteratively assign increasing suggestion rank to random recipes weighted by their score". `find_suggestions` then just orders by `suggestion_rank`. There is no item, no date, no reason, and nothing rendered to justify a pick. On expiry the result is flatly negative: grepping all .py/.dart/.arb for `expir|best.?before` yields only `delete_expired()` on OIDC/password-reset tokens (backend/app/models/oidc.py:65, challenge_password_reset.py:54), a session-expired API error string, and a French translation about a long-lived token not expiring. No food expiry field exists anywhere in the product.
    - **threat to our claim:** NONE
    - **url:** https://github.com/TomBursch/kitchenowl/blob/main/backend/app/models/recipe.py
    - **recommends:** Recommends, but by randomness - the weakest explanation of any product surveyed. Safe to dismiss in one line; if anything it strengthens us, since its 'suggestion' is provably arbitrary.
  - _item 4_
    - **name:** EverShelf
    - **alive:** ALIVE and new. iOS v1.0.2, currentVersionReleaseDate 2026-08-19, original releaseDate 2026-03-30 (iTunes lookup id=6759439940, retrieved this session).
    - **explains why:** no
    - **evidence:** Architecturally the closest closed product - it is the only one whose own store listing pairs expiry tracking WITH inventory-driven recipe suggestion. Free tier lists "Expiration tracking and inventory overview" and "Organize supplies by location, keep track of expiration dates"; Premium lists "Meal plans built around your inventory" and "Recipe suggestions based on food you already have". But they are listed as separate features and nothing claims the suggestion cites a date. I went past the text to the pixels. CAVEAT FIRST, since this is exactly the trap that burned us: both screenshots are vendor MARKETING COMPOSITES, not real captures - each has a headline set above a device frame and the status bar reads the canonical Apple mockup time 9:41. Treat as a claim about intent, not proof of shipped behavior. That said, they refute rather than support a join. The expiry screen (02-food-balance-expiration.png) is pure AGGREGATE, Grocy-style: an "Expiration Calendar" subtitled "Calories expiring over the next 12 months", drawn as monthly bars labeled only with counts - "Oct 2 items", "Nov 3 items", "Dec 1 item" - above food-group coverage rows like "Dairy / fortified soy 6.3 days" and "Vegetables 9.8 days". No item is named, no date is shown. The meals screen (08-meal-plans.png, headline "Plan a week from your pantry") is a MANUAL weekly planner: dated slots (Monday, Aug 17) with Breakfast "Peanut Butter Applesauce Oats" and Dinner "Tomato Chickpea Pasta", each section offering "Add Recipe" / "Add Item" buttons. There is no reason string anywhere on the card - not an item, not a date, not a substitution. The decisive point: even in art the vendor fully controls and had every incentive to make maximally impressive, no why-line appears. Its nearest nutrient concept is MyPlate-style food-group coverage in cup-eq/oz-eq per day, which is a stockpile-adequacy metric, not a per-dish nutrient constraint. Marketing site evershelf.joshumi.com describes the preparedness plan and inventory only and does not document a recipe or meal-plan feature at all.
    - **threat to our claim:** MEDIUM
    - **url:** https://is1-ssl.mzstatic.com/image/thumb/PurpleSource211/v4/96/b7/71/96b77185-bb2a-7aba-e0a2-24026991b9e1/08-meal-plans.png/900x1400bb.png
    - **recommends:** Recommends (Premium), and holds dates - so name it explicitly in the paper as the closest architectural approach, then say what is missing. Two honest limits to disclose: the recipe engine is behind a paywall I did not purchase, and my screenshot evidence is vendor composite art. Our strongest defensible sentence is that no available EverShelf artifact - store text, marketing site, or the vendor's own promotional screens - shows a recommendation annotated with a named item, its date, or a substitution reason. Flag this as the top candidate for a hands-on paid trial if a reviewer presses.
  - _item 5_
    - **name:** Nosh AI
    - **alive:** ALIVE. iOS v1.8.0, currentVersionReleaseDate 2026-07-04 (iTunes lookup id=6749610047, LEIK PTY LTD, retrieved this session).
    - **explains why:** no
    - **evidence:** Interesting because it holds a pantry AND nutrition in one app, so it is the closest to the NUTRIENT leg - yet it has no dates at all. I regex-scanned the COMPLETE store description for expir|expiry|best.?by|use.?by|go bad and got ZERO hits. The pantry is explicitly dateless: "Location-Based Sorting - Separate Pantry, Fridge, Freezer", "Scan-to-Inventory", "Searchable Inventory", and "Ingredient Scanner - Track what you have at home to reduce waste". Waste is framed as an outcome, never via a date. Recommendation is real but ingredient-matched, not expiry-ranked: "Inventory-Based Recipes - Input your ingredients, get instant meal ideas" and "generates tasty, practical recipes in under a minute using what's already in your digital pantry". Nutrition is tracking-side, not a generation constraint: "Macro tracking", "Nutrition Feedback - Track calorie, protein, fat, carb, fiber stats". Screenshot 2 (again a MARKETING COMPOSITE - angled device frames under the headline "Never Run Out of Meal Ideas", so not a real capture) shows recipe cards carrying per-dish macro bars (Pro 61g / Carb 59g / Fat 25g, 651 cal) and ingredient tags (Chicken, Shrimp, Pasta). So it displays nutrient NUMBERS but never states a constraint the dish satisfies, and shows no why-line, no date, and no substitution.
    - **threat to our claim:** LOW
    - **url:** https://is1-ssl.mzstatic.com/image/thumb/PurpleSource221/v4/31/0a/60/310a6058-c636-ccd4-68b3-6d7faa759163/2.png/900x1400bb.png
    - **recommends:** Recommends from a dateless pantry. Useful as our example that pantry+nutrition coexisting in a live 2026 app still yields no auditable reason: it labels dishes with macros rather than explaining that a dish was chosen to meet a constraint.
  - _item 6_
    - **name:** Pantry Check
    - **alive:** ALIVE - and I nearly misjudged this one, which is worth recording. iOS looks abandoned at v2.9.1 / 2025-06-18 (15 months stale), but the Android listing says "Updated on Sep 12, 2026" - yesterday. Checking only one store would have wrongly killed it.
    - **explains why:** no
    - **evidence:** Genuinely strong on the first two facts and absent on the rest. Store text claims "Automatic expiration reminders", "The best barcode scanner", "Current inventory & usage timeline" and "track best by dates, avoid food waste". The Play listing confirms "Scan barcodes to build your pantry, fridge, and freezer inventory in seconds, get reminders before food expires, and generate smart shopping lists from what you actually need." But its output is SHOPPING, not cooking: "Smart shopping lists, based on usage and inventory". I scanned both listings for recipe language and found none - the word recipe does not appear. The only meal reference is the soft phrase "plan meals with what you have", with no recipe engine described anywhere. It is an inventory/reminder product whose expiry knowledge terminates in a notification and a shopping list.
    - **threat to our claim:** LOW
    - **url:** https://play.google.com/store/apps/details?id=com.pantrycheck.pantrycheck&hl=en_US
    - **recommends:** Does NOT recommend recipes - no recipe feature found in either store listing. It fails the claim at the first gate. Include the cross-store liveness note in our methodology: single-store checks produce false 'dead' verdicts.
  - _item 7_
    - **name:** MyFridgeFood
    - **alive:** SPLIT, and the split matters. Website live (HTTP 200, 381KB, 2026 copyright, fetched this session). iOS app effectively abandoned: v2.0.7, currentVersionReleaseDate 2023-02-03 - over three and a half years stale.
    - **explains why:** no
    - **evidence:** Mechanically disqualified, and its own copy proves it. The site is a checkbox ingredient picker: the live page renders "WHAT'S IN YOUR FRIDGE?" above a flat alphabetical checklist ("Click Here For All Ingredients: AllSpice, Almond Extract, Almonds, American Cheese..."). Nothing is stored as an inventory and no item carries a date - the user re-ticks boxes each visit. The store description is unusually self-incriminating for our purposes: "Check off what you have and see where you can go!" and "Recipes can be filtered by specific ingredients (i.e. if your cucumbers are about to go bad and you need a recipe), categories..., and by nutritional information (Fat, Calories, etc...)". That parenthetical is the whole finding - the vendor describes the USER noticing the cucumbers are about to go bad and then filtering manually. The expiry reasoning lives in the human's head; the software never sees a date and therefore can never cite one. Nutrition is likewise a user-applied filter, not a stated constraint the dish satisfies.
    - **threat to our claim:** NONE
    - **url:** https://www.myfridgefood.com/
    - **recommends:** SEARCH ONLY, not recommendation - and no inventory, so it cannot reach any of the four facts. This is the cleanest quotable example in the whole survey of expiry reasoning being offloaded to the user; the 'if your cucumbers are about to go bad' line is worth citing verbatim in the paper.
  - _item 8_
    - **name:** ChefGPT (chefgpt.xyz)
    - **alive:** AMBIGUOUS - report as questionable, not alive. Site responds 200 with a working Sign In and subscription management, but its only dated surface has stalled: every post on /blog is Dec 27-31, 2025, most recent "Japanese Recipes for a Game Night Dinner, Dec 31, 2025" - roughly nine months of silence. No changelog or version string is exposed. Per your rule a live marketing page proves nothing, and I found no release artifact. Note also that the iOS apps named ChefGPT are unrelated third parties ("ChefGPT: AI Calories Tracker" by MIU Digital; "AI Recipe Generator: ChefGPT" by Esra Aydin), not this vendor - do not cite them as its shipping evidence.
    - **explains why:** unknown
    - **evidence:** Waste-framed but dateless, on vendor text alone. The homepage says the product "learns what you have and suggests recipes to help you use it all-before anything goes to waste" and, on the pantry feature, "Add ingredients as you shop or cook, and ChefGPT keeps your pantry organized." That is the closest any closed product came to our framing in prose - but the page never mentions expiration dates, never claims a recommendation cites a specific item, and does not mention substitutions at all. The /pantry-chef feature route returned HTTP 404, and the site exposes only /, /blog, /privacy and /terms as internal routes, so no deeper feature documentation is publicly reachable. I have a CLAIM that it suggests recipes to use food before it spoils; I have NO evidence of a date being stored, and no evidence of a rendered reason.
    - **threat to our claim:** LOW
    - **url:** https://www.chefgpt.xyz/
    - **recommends:** Recommends. Mark honestly as UNKNOWN on the decisive column rather than 'no' - the product is behind a sign-in I did not cross and its feature pages 404, so silence here is genuinely silence. Its weak liveness signal (blog dead since Dec 2025) means even a reviewer who found a reason string would struggle to call it a shipped consumer product in 2026.
  - _item 9_
    - **name:** Jow
    - **alive:** ALIVE, the most commercially active of the nine. iOS v22.6.0, currentVersionReleaseDate 2026-08-31; claims "JOIN OVER 7 MILION USERS WORLDWIDE" (iTunes lookup id=1301257625, retrieved this session).
    - **explains why:** no
    - **evidence:** Wrong side of the purchase entirely - it fills carts rather than reading shelves, so it never holds an inventory to have dates on. My regex scan of the full description for expir|expiry|best.?by|go bad returned ZERO hits. The documented flow is procurement, not consumption: "Jow generates a smart cart based on your household needs, ensuring you only buy what you need" and "Jow will automatically order all the ingredients from your selected supermarket." Personalization is preference-based and stated up front - "Input your kitchen appliances, household size, and dietary preferences. Jow creates a customized recipe catalog just for you" - not driven by anything currently in the home. Even its waste claim is purchase-side: "Avoid Food Waste: Buy only what you need", i.e. waste is prevented by under-buying, never by cooking an aging item. No pantry inventory, no dates, no substitution explanation, no nutrient constraint (diet options like vegetarian/vegan/gluten-free are catalog filters).
    - **threat to our claim:** NONE
    - **url:** https://apps.apple.com/us/app/jow-easy-recipes-groceries/id1301257625
    - **recommends:** Recommends recipes, but from a preference profile with no inventory behind it - it cannot reach fact one, so the remaining three are moot. Dismiss in one line.
- **any kills the claim:** No. Nothing found this session refutes the claim, and I went looking to break it rather than confirm it. The four-way join survives all nine.
  
  The two products that came closest each failed on an axis I could verify directly rather than infer:
  
  TANDOOR is the important one, because it is the only shipped product in the entire survey that demonstrably holds BOTH a named pantry item with a real expiry date AND a recipe recommender - and I proved in its own source that the two never touch. `InventoryEntry.expires` is a real DateField rendered as a real formatted date; `cookable()`, the sole engine behind the `makenow` recommendation filter, contains zero references to expiry (grep count: 0 over the full function body). Its one expiry-aware UI string, `ExpiringSoon`, is orphaned - present in locale JSON, rendered by no component. That is a refutation attempt that failed at the source level, which is far stronger evidence than any absence-of-marketing-copy argument we could make about a closed app.
  
  MEALIE forces one honest narrowing. It genuinely ships a rendered substitution explanation - `RecipeSuggestion.vue` prints `"Substituting"` then `"{substitute} for {food}"` per chip, backed by a typed `RecipeSuggestionSubstitutedFood` from `_find_substitute_on_hand`. So we must not write anything implying no shipped product explains substitutions; Mealie does, its source is public, and a reviewer will find it in minutes. But Mealie has no food-expiry concept anywhere in its codebase (every `expir` hit is auth tokens or share links) and no nutrient constraint in the finder, so it reaches one of four facts. It is RecipeFix's open-source twin and should be cited beside it.
  
  Also worth stating as a positive pattern rather than a coincidence: every product that HAS dates aggregates them away at the moment of recommendation. Grocy shows a bare integer; EverShelf shows "Calories expiring over the next 12 months" with bars labeled "Oct 2 items"; Tandoor shows the date on the shelf but drops it before the suggestion; Remy names the item but states no date. The named-item-plus-actual-date pair consistently survives in inventory views and consistently dies on the way to the recipe card. That is a real, defensible finding, not just an absence.
- **coverage statement:** VERIFIED THIS SESSION (9 of 9 assigned): Mealie, Tandoor, KitchenOwl, EverShelf, Nosh AI, ChefGPT, Pantry Check, MyFridgeFood, Jow. Every one has a liveness check from a release API or store lookup retrieved today, not a marketing page. Eight are resolved on the decisive column; ChefGPT is recorded as UNKNOWN, not "no".
  
  EVIDENCE STRENGTH, honestly tiered:
  - STRONGEST (source-level, independently reproducible): Mealie, Tandoor, KitchenOwl. I cloned all three and read the actual recommendation functions and rendered templates. These are near-unfalsifiable claims - anyone can run the same greps. Tandoor's zero-hit grep inside `cookable()` and Mealie's rendered `"{substitute} for {food}"` are the two highest-value artifacts produced.
  - MEDIUM (vendor text + pixels, with the mockup caveat applied): EverShelf, Nosh AI. Both screenshot sets are MARKETING COMPOSITES, not real captures - EverShelf's two frames carry the canonical 9:41 mockup status bar under a marketing headline, and Nosh AI's is angled device art. I say so explicitly rather than passing them off as captures. They still cut against a join, because even vendor-controlled aspirational art shows no reason string.
  - WEAKEST (vendor claim only): ChefGPT. Site up, /pantry-chef 404s, no feature docs reachable, blog dead since Dec 31 2025. I have a claim that it suggests recipes "before anything goes to waste" and no evidence about dates or reasons. Reported as unknown.
  
  WHAT REMAINS UNVERIFIED, and the cap we must state:
  - SKIPPED AS INSTRUCTED (10): the seven nutrition trackers (Cronometer, MacroFactor, Lifesum, Lose It!, Noom, YAZIO, MyFitnessPal), which bear only on the gap already declared dead, and the three logistics apps (Too Good To Go, OLIO, Instacart), which recommend no recipes. I did not check these and am not asserting anything about them.
  - UNTOUCHED REMAINDER: 26 candidates were outstanding; 9 verified + 10 declared skipped leaves roughly 7 I neither examined nor was assigned. The tail is closed for the relevant set, NOT for the full candidate list.
  - PAYWALL GAP, our single biggest exposure: EverShelf's recipe engine is Premium and I did not purchase it. Nosh AI's recipe generation is likewise partly Pro-gated, and ChefGPT sits behind sign-in. So for the three closed products with the most plausible architecture, I verified the marketing surface and, where available, the vendor's own screens - not the running paid feature. If a reviewer presses on any single product, it will be EverShelf, and the correct response is to buy one month and capture the real screen.
  
  SAFE WORDING GIVEN ALL OF THE ABOVE: we can assert that across every product examined, no artifact shows a recommendation annotated with all four facts, and we can assert the Tandoor and Mealie findings as verified fact at source level. We should NOT assert exhaustiveness over all consumer meal products, and should state the paywall limitation in the same breath as the claim.
