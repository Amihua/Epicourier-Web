# P17-disconfirmation-rerun

**Workflow:** P1b Claude decide and commit (run 3)  
**Phase:** Classify  
**Model:** Claude Opus 5 (1M context), `claude-opus-5[1m]`  
**Agent id:** `ab2358b9a53cf62ae`  
**Tool calls:** 58 total — 12 web searches, 23 pages fetched  
**Raw transcript:** `raw/agent-ab2358b9a53cf62ae.jsonl` (full tool-call trace, retained)

---

## Prompt, exactly as issued

```text
You are running a disconfirmation sprint (P17, written by the Codex analyst on our team,
rerun independently here). ASSUME OUR PROPOSED GAP IS FALSE and go prove it.

THE GAP UNDER ATTACK: "No shipped consumer meal/pantry product shows a per-recommendation
rationale that names the specific pantry item, its expiry date, the nutrient constraint and the
substitution it made, in a form the user can audit and correct."

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

RULES: Do not invent products or sources. Use WebSearch/WebFetch for any market claim (load with
ToolSearch "select:WebSearch,WebFetch" if absent). Quote real page text. Write "unknown" rather
than something plausible. Separate fact, inference and hypothesis. Respect the 160-hour budget in
every recommendation.

Generate AT LEAST TWELVE distinct search formulations, deliberately varying: synonyms
("why this recipe", "reason", "rationale", "explanation", "because you have", "based on your"),
legacy product names, help-centre terminology, app-store marketing wording, and workflow verbs.
Then search for:
- an incumbent already doing it;
- a discontinued product that tried it;
- complaints showing users reject explanations;
- a technical or policy reason it remains absent;
- a simpler workaround users prefer (for example: just asking ChatGPT, which explains itself by
  default and is free — take this one seriously, it is the strongest substitute).

Output: query | result | URL | confirms / refutes / neutral | confidence.

LEAD WITH THE STRONGEST REFUTATION. If no refutation is found, write "not found in this search",
never "does not exist". A search that refutes our own gap is the most valuable result you can
return, and you should want to find one.
```

## Searches actually run

- `recipe app "why this recipe" explanation pantry expiring ingredients recommendation`
- `meal planning app "because you have" expiring ingredient recommendation reason shown`
- `ChatGPT meal plan from pantry photo expiration dates explains reasoning substitution`
- `app "tells you why" recipe suggested "use it up" expiry date nutrition swap`
- `Cooklist app "expiring" recipe suggestion shows reason why explanation pantry`
- `SeePantry app recipe recommendation "why" explanation expiring item reason`
- `AI recipe app "explains why" OR "reason for each" recommendation "uses your" expiring ingredient 2026`
- `"meal plan" app users complain "too much explanation" OR "don't care why" AI reasoning recipe reddit`
- `nutrition app ingredient swap "we swapped" OR "swapped because" explains protein macro reason recipe`
- `Samsung Food Food+ AI 2026 "why" recipe recommended explanation expiring ingredients Vision AI`
- `Foodsmart OR "Season Health" OR Nourish medically tailored meal recommendation explains "chosen for your" nutrient`
- `Instacart OR Kroger OR Walmart app recipe "recommended because" you bought expiring explanation AI 2026`

## Pages actually fetched

- https://www.wiselist.app/meal-planning-with-expiring-food/   — asked: Quote verbatim any text describing how the app explains WHY a recipe or meal is recommended. Look for phrases 
- https://apps.apple.com/us/app/allspice-recipe-meal-planner/id6740096350   — asked: Quote verbatim the full app description. Focus on any language about explaining WHY a recipe is recommended, u
- https://www.foodieprep.ai/blog/meal-planning-apps-with-builtin-grocery-lists-a-2026-sidebyside-review   — asked: Quote verbatim any text about apps that EXPLAIN why a recipe or meal was recommended — reasoning, rationale, "
- https://mealthinker.com/blog/ai-meal-planner-vs-chatgpt   — asked: Quote verbatim anything about whether ChatGPT/Gemini/Claude EXPLAIN their meal recommendations (reasoning, why
- https://seepantry.com/food-expiration-tracker   — asked: Quote VERBATIM every sentence describing the "Kitchen Copilot", how it scores or ranks items, and any text whe
- https://apps.apple.com/us/app/mealthinker/id6757604137   — asked: Quote the full app description VERBATIM. I need to know whether the app SHOWS the user a reason/rationale for 
- https://recipyapp.com/blog/best-pantry-tracking-apps-2026   — asked: This is a head-to-head test of 9 pantry apps. Quote VERBATIM any statement about whether any app explains WHY 
- https://www.pann-app.com/blog/ai-recipe-generator-how-it-works   — asked: Quote VERBATIM anything about an AI recipe generator explaining WHY it chose a recipe — reasoning shown to the
- https://foxnews.com/world/grocery-store-ai-app-suggests-bizarre-sometimes-dangerous-recipes-users-report.amp   — asked: Quote VERBATIM the key facts: which retailer, which app, what the app did (generate recipes from ingredients u
- https://html.duckduckgo.com/html/?q=%22Savey+Meal-Bot%22+Pak%27nSave+recipe+AI+chlorine+disclaimer+restricted   — asked: List the result titles, URLs and snippets verbatim.
- https://html.duckduckgo.com/html/?q=meal+planning+app+%22explains+why%22+recipe+recommended+pantry+expiry+rationale   — asked: List the result titles, URLs and snippets verbatim.
- https://www.mojeek.com/search?q=meal+planner+app+%22explains+why%22+recipe+recommended+pantry+expiry   — asked: List every result title, URL and snippet verbatim.
- https://lite.duckduckgo.com/lite/?q=%22why+this+recipe%22+pantry+app+expiring+ingredient+explanation   — asked: List every result title, URL and snippet verbatim.
- https://search.marcia.cc/search?q=test   — asked: Does this return search results? List anything present.
- https://mealthinker.com/blog/chatgpt-vs-meal-planning-app   — asked: Quote VERBATIM everything about (a) whether ChatGPT explains its reasoning / why it picked a meal, (b) ChatGPT
- https://learn.plantoeat.com/help/a-digital-pantry-inventory-does-it-really-help   — asked: Quote VERBATIM the passage about the removed Pantry feature: what it was, why they removed it, what users said
- https://docs.grocy.info/   — asked: Find and quote VERBATIM any description of the "due score", recipe fulfillment, or how Grocy ranks/scores what
- https://recipefix.app/   — asked: Quote VERBATIM any example of a "Chef's Note" — the actual rationale text the app shows for a substitution. I 
- https://support.samsungfood.com/hc/en-us/search?query=expiring   — asked: List article titles and any text about prioritizing ingredients that are expiring, match scores, or explaining
- https://www.hellojackalo.com/blogs/news/how-to-use-chatgpt-for-meal-planning   — asked: Quote VERBATIM any sample ChatGPT output or prompt where ChatGPT gives a REASON for a meal choice — e.g. namin
- https://arxiv.org/abs/2601.02374   — asked: What is the title, authors, date and abstract of this paper? Is it about explainable food/recipe recommendatio
- https://www.healthline.com/health/how-to-use-ai-for-food-swaps-and-recipe-ideation   — asked: Quote VERBATIM anything about AI (ChatGPT and similar) explaining WHY it suggests a food swap or recipe — givi
- https://support.samsungfood.com/hc/en-us/articles/10913832455442   — asked: What is this article about? Quote verbatim anything about pantry, expiring ingredients, recipe match scores, o

## Response

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
