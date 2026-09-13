# P03-table-stakes

**Workflow:** P1b Claude decide and commit (run 3)  
**Phase:** Classify  
**Model:** Claude Opus 5 (1M context), `claude-opus-5[1m]`  
**Agent id:** `a74195552d536426c`  
**Tool calls:** 27 total — 5 web searches, 3 pages fetched  
**Raw transcript:** `raw/agent-a74195552d536426c.jsonl` (full tool-call trace, retained)

---

## Prompt, exactly as issued

```text
You are classifying our existing feature set against the verified market, so the team knows
what it must merely match and what could actually distinguish it.

Epicourier-Web: Next.js 15 / TypeScript / Tailwind front end; FastAPI + Python back end;
Supabase/PostgreSQL; Google Gemini 2.5 Flash for recommendation. Twenty implemented use cases:
accounts, recipe browsing with an "inventory match percentage", recipe detail with nutrients and
a green score, AI meal-plan recommendation from a free-text goal (3/5/7 meals), calendar
scheduling and meal-completion tracking, a nutrient dashboard with trends/goals/CSV export,
achievements + streaks + challenges, pantry/fridge/freezer inventory with expiry colour-coding
and low-stock thresholds, AI recipe suggestions that prioritise expiring OR ALREADY EXPIRED
ingredients, shopping lists from a plan or a recipe, and a "purchased" transfer that moves
checked shopping-list items into inventory.

THE TWENTY CANONICAL USE CASES (verbatim names from p1a/use-cases/final-use-cases.md):
UC1 Register account. UC2 Sign in. UC3 Browse recipes (search, dietary tags, ingredient filters,
inventory-match category and match-percentage ordering). UC4 View recipe details (nutrients,
tags, green score, offer ingredients for shopping). UC5 Request a personalized meal plan
(free-text goal, 3/5/7 meals, via Gemini). UC6 Schedule a meal (calendar entry). UC7 Track meal
completion (and sync daily nutrients). UC8 Review nutrient progress (daily/weekly/monthly).
UC9 Set nutrient goals. UC10 Export nutrient history (CSV/text, date range). UC11 Review
achievements. UC12 Join a wellness challenge. UC13 Review inventory (expiry status, low stock,
location filters). UC14 Add inventory item. UC15 Edit inventory item. UC16 Remove inventory items
(batch). UC17 Get inventory-based recipe suggestions (Gemini, prioritises expiring/expired).
UC18 Create and populate shopping list. UC19 Generate shopping list from meal plan.
UC20 Complete shopping and stock inventory (the "purchased" transfer).

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

HARD BUDGET: four graduate students, ONE MONTH, ~10 h/person/week = about 160 person-hours TOTAL,
to build AND test. The team must ALSO produce a report, a poster and a demo out of that same 160.
RULES: Do not invent products or sources. Use WebSearch/WebFetch for any market claim (load with
ToolSearch "select:WebSearch,WebFetch" if absent). Quote real page text. Write "unknown" rather
than something plausible. Separate fact, inference and hypothesis. Respect the 160-hour budget in
every recommendation.

Classify EACH of the twenty use cases as TABLE STAKES (every rival has it; we must too) or
DIFFERENTIATOR (rare or absent in rivals). One sentence of justification each — NAME the rival
that has it, with a URL, or state plainly that none of the fourteen verified products does.
Be strict: our green score, our achievements and our inventory-match percentage all FEEL
distinctive, so check them hardest. Where our verified matrix says "unknown" rather than "no",
say so — "unknown" is not evidence of absence and must not be laundered into a differentiator.

Then propose TWO use cases that appear in NO current product but follow naturally from ours. For
each: who wants it, why nobody has built it yet, and — this is the part most teams skip — what
the most likely reason is that it is ABSENT BECAUSE IT IS A BAD IDEA rather than because it is
an opportunity.

Output a 20-row markdown table, then the two proposed use cases in full use-case format
(Name / Primary actor / Stakeholders / Preconditions / Trigger / Main success scenario /
Extensions / Postconditions), then a short "what our matrix cannot tell us" paragraph.
```

## Searches actually run

- `Samsung Food "match score" recipes pantry "how well it matches"`
- `Samsung Food recipe carbon footprint eco score sustainability rating app`
- `"Samsung Food" "health score" recipe nutrient density support article`
- `NoWaste app food inventory statistics CO2 money wasted tracking features`
- `Paprika Recipe Manager grocery list move purchased items to pantry automatically`

## Pages actually fetched

- https://support.samsungfood.com/hc/en-us/articles/30251599415956-How-to-Search-for-Recipes-Using-Your-Available-Ingredients   — asked: Reproduce the article text verbatim. Quote exactly any sentences about a match score, how well a recipe matche
- https://grocy.info/   — asked: Quote verbatim any text about a "Due Score" for recipes, about stock/inventory, expiration/due dates, shopping
- https://www.paprikaapp.com/help/ios/   — asked: Quote verbatim everything in the Pantry and Grocery List sections: the fields recorded per pantry item (quanti

## Response

## 1. Twenty use cases, classified

Verdicts use the 14 CONFIRMED-LIVE set as the bar. Where our matrix says `unknown` I say `unknown`. New evidence retrieved **today, 2026-09-13**, is marked *(checked today)*; WebSearch hit its 200-call session cap mid-task, so today's checks were made with direct WebFetch and Apple's public iTunes lookup/search API (reproducible: `https://itunes.apple.com/lookup?id=<trackId>&country=us`).

| # | Use case | Verdict | Justification (one sentence) |
|---|---|---|---|
| UC1 | Register account | **TABLE STAKES** | Every rival gates its product behind an account — Prepear's own homepage carries "Sign Up For Free" and "Create a Free Account" (https://www.prepear.com/) — and no account is a feature, it is a prerequisite. |
| UC2 | Sign in | **TABLE STAKES** | Universal, and demonstrably so: our fact-checker could not read SideChef's pantry body copy because "the page body is client-rendered behind a sign-in" (https://www.sidechef.com/my-pantry/). |
| UC3 | Browse recipes (search, tags, ingredient filters, inventory-match category + match-% ordering) | **TABLE STAKES** | KitchenPal's live listing says it will "automatically get recipes which match your existing food inventory (not available on any other recipe app)" *(checked today, https://apps.apple.com/us/app/id1084982489)*, SuperCook "finds recipes that use as many of your ingredients as possible" (https://play.google.com/store/apps/details?id=com.supercook.app), and Samsung Food shows "how well it matches" — our 80/50 buckets and the two-way percentage sort are a presentation choice on a commodity capability, not a new capability. |
| UC4 | View recipe details (nutrients, tags, **green score**, offer ingredients for shopping) | **TABLE STAKES** | Nutrients and tags are saturated — Samsung Food advertises "detailed nutrition information and health scores on over 218,500 recipes" *(checked today, id 1133637674)* and Xpiry says "Every recipe includes detailed macro nutrients (calories, protein, carbs, fat)" *(checked today, id 6756198499)* — and the green score is **not** a defensible exception: none of the fourteen ships a per-recipe environmental score (nearest are Samsung's *health* score and Eatvora's kitchen-level waste "letter grade"), but ours is produced by one line of prompt, `- Estimate green_score by environmental impact (plant-based = higher).` (`data/prompts/system_prompt.txt:53`), which is an unverifiable number, not a differentiator. |
| UC5 | Request a personalized meal plan (free-text goal, 3/5/7 meals, Gemini) | **TABLE STAKES** | Eat This Much: "Tell us your diet goals, the foods you like, your budget, and what your schedule looks like, and we'll automatically generate a complete meal plan to meet your targets" *(checked today, id 981637806)*; Samsung Food: "AI-personalized weekly meal plans tailored to your health goals" *(checked today)* — free text as the input widget is a UI variation on a shipped product. |
| UC6 | Schedule a meal (calendar entry) | **TABLE STAKES** | AnyList: "plan your week: assign recipes to days on the meal planning calendar" *(checked today, id 522167641)*; Paprika: "meal planner - plan your meals using our daily, weekly, or monthly calendars" *(checked today, id 1303222868)*. |
| UC7 | Track meal completion (and sync daily nutrients) | **TABLE STAKES** | Samsung Food Food+: "After cooking, mark the recipe as 'Made It'. The app will suggest removing the used ingredients from your Food List" (https://support.samsungfood.com/hc/en-us/articles/30025317487508-Getting-Started-with-Food-List), and Eat This Much logs "meals marked 'I ate this'" *(checked today)*. |
| UC8 | Review nutrient progress (daily/weekly/monthly) | **TABLE STAKES** | Samsung Food ships "Nutrition tracking with adaptive meal plans to help you meet your goals" *(checked today)* and Eat This Much is a tracker by design; honest caveat — whether any of the fourteen renders a *monthly trend series* is **unknown**, not "no", and unknown is not a moat. |
| UC9 | Set nutrient goals | **TABLE STAKES** | Eat This Much states targets verbatim on its homepage ("At least 90g Carbs, At least 40g Fat, At least 90g Protein"; "your nutrition targets can be whatever you want", https://www.eatthismuch.com/). |
| UC10 | Export nutrient history (CSV/text, date range) | **DIFFERENTIATOR — but the worthless kind** | No nutrient-history CSV export appears in any of the fourteen (nearest: KitchenPal "Export Your Pantry List", Eatvora "Download a PDF report", Paprika "export your meal plans to calendar", Eat This Much auto-exporting nutrition to Apple Health — all *(checked today)*, none of them nutrient history), and our own complaints sweep found **zero** of 4,513 App Store reviews asking for export, so this is rarity without demand. |
| UC11 | Review achievements (+ streaks) | **DIFFERENTIATOR — with a death certificate attached** | A keyword sweep I ran today over the live US App Store descriptions of the confirmed rivals returned **zero** hits for achievement / badge / streak / gamif / leaderboard / reward; the one product that did ship it — Kitche's "bronze, silver and gold spoons" (https://kitche.co/impact/) — is **dead** (App Store id 1521215203 returns 404 in GB and US), and our own stakeholder analysis flags streak mechanics as ED-reinforcing, so absence here is a market verdict, not an opening. |
| UC12 | Join a wellness challenge | **DIFFERENTIATOR — same caveat** | Same sweep, same zero; the closest live thing is Eatvora's real-world "Join monthly Eatvora Day community events in your area… earn community points" *(checked today, id 6759806556)*, which is volunteering, not an in-app wellness challenge — and the FTC dark-patterns report our support material cites warns these mechanics "tend to have even stronger effects when they are combined", which is exactly what UC11+UC12+colour-coded urgency do on one screen. |
| UC13 | Review inventory (expiry status, low stock, location filters) | **TABLE STAKES** | Xpiry: "See all your food organized by urgency - expired, expiring soon, and good for later"; KitchenPal: "[recently finished, running low, frequently bought]" and "organize your kitchen into pantry, fridge food, freezer… or create your own"; NoWaste: "Sort your food by expiration date, name or category" — all three *(checked today)*, which covers our colour-coding, low-stock thresholds and location filters between them. |
| UC14 | Add inventory item | **TABLE STAKES — and we are behind** | KitchenPal "Set quantities & food expiry dates… (we detect expiry automatically for items like fridge food / produce)" and Xpiry "just snap a photo of your grocery receipt" *(both checked today)*; rivals scan, we type, and our own review corpus says manual entry is what kills pantry features ("it was tedious and I was too frustrated to do it again"). |
| UC15 | Edit inventory item | **TABLE STAKES** | Samsung Food: "Tap any item to edit details such as storage location…"; Paprika's Mac guide: "you can add custom pantry items, change expiration dates and purchased dates, and more" (https://www.paprikaapp.com/help/ios/). |
| UC16 | Remove inventory items (batch) | **TABLE STAKES** | Paprika documents batch pantry operations by state ("moving all items, moving purchased items, or moving out of stock items", https://www.paprikaapp.com/help/ios/, *re-fetched today*) and Eatvora's AutoPilot "even marks forgotten expired items as discarded" *(checked today)*. |
| UC17 | Inventory-based recipe suggestions prioritising expiring / already expired | **TABLE STAKES** | Eatvora: "generates recipes that use your expiring ingredients first"; Samsung Food: "recipes that are containing items that are about to expire will be prioritized"; KitchenPal: "recipe ideas using ingredients that are about to [expire]" — and the *already-expired* half, the only sliver nobody consumer-facing claims, is already published as an auditable formula by Grocy ("A 'Due Score' indicates which recipes are good for using up stock items that are due soon **or already overdue**", https://grocy.info/, *re-fetched today*), so our version is a hosted re-implementation of a free feature plus a food-safety liability. |
| UC18 | Create and populate shopping list (incl. from a recipe) | **TABLE STAKES** | AnyList: "instant shopping lists: add all ingredients from a recipe" *(checked today)*; Prepear: "Prepear automatically creates your grocery list for you" (https://www.prepear.com/); Samsung Food: "Instantly turn any recipe or meal plan into a smart shopping list with one click" (https://samsungfood.com/). |
| UC19 | Generate shopping list from meal plan | **TABLE STAKES** | Plan to Eat: "When you add recipes to your calendar, the shopping list will automatically populate an organized list of ingredients" (https://www.plantoeat.com/); Eatvora's Shopping Planner "pulls from five sources at once: low-stock pantry items, your grocery lists, ingredients for planned meals…" *(checked today)*. |
| UC20 | Complete shopping and stock inventory (the "purchased" transfer) | **TABLE STAKES — this is the row the team will not like** | Paprika documents our exact flow, verbatim, re-fetched today: **"Move to Pantry: Moves items from the grocery list into the pantry. You can choose between moving all items, or moving only purchased items."** (https://www.paprikaapp.com/help/ios/), Grocy ships "Add all list items to stock" / "Shopping list to stock workflow", and Plan to Eat has *deliberately rejected* auto-deduction and published why ("Removing items from someone's shopping list without them knowing about it is never a good idea", https://learn.plantoeat.com/help/a-digital-pantry-inventory-does-it-really-help) — so the mechanic is both built and argued about; our only unclaimed ground is the transparency of the transfer, not the transfer. |

**Score: 17 table stakes, 3 differentiators — and all three differentiators are ones we should be nervous about.** The three features that "feel" distinctive fail hardest: the inventory-match percentage is a number on top of SuperCook's and KitchenPal's commodity matching, the green score is a single Gemini instruction with no method or units, and achievements/streaks are absent from the live market largely because the product that shipped them died.

---

## 2. Two proposed use cases

### UC21: Audit and correct the reason a meal was recommended

| Part | Content |
|---|---|
| **Name** | Audit and correct recommendation rationale |
| **Primary actor** | User who has just received a meal plan or an inventory-based suggestion |
| **Stakeholders & interests** | User: decide whether to trust a suggestion before shopping or cooking, and fix it when its premise is wrong. Platform: convert a silent LLM ranking into a checkable claim, and harvest corrections as free inventory repair. Recommender service: receive corrected pantry state on the next call. Grader/report: a falsifiable claim is testable in a way "AI-powered" is not. |
| **Preconditions** | User is authenticated; at least one recommendation (UC5 or UC17) has been generated; the inventory rows used to produce it are still retrievable by id. |
| **Trigger** | User opens the "why this?" control on a recommended meal. |
| **Main success scenario** | 1. System retrieves the typed rationale record stored with the recommendation. 2. System displays, per recommended meal: each inventory item it counted on, with that item's stored expiry date and location; the goal constraint it was satisfying; and the ingredients it treated as missing. 3. System labels each named fact with its provenance (user-entered date, defaulted date, or estimated nutrient value). 4. User marks one named item "I don't have this" or corrects its date/quantity. 5. System writes the correction to the inventory row and re-runs the ranking with the corrected state. 6. System presents the revised plan and shows which meals changed and which did not. |
| **Extensions** | 2a: The recommendation has no stored rationale (legacy or failed generation) → system shows "no rationale recorded" and offers regeneration; it never invents one after the fact. 2b: A named inventory row was deleted since generation → system shows the item as removed with its last known values rather than silently dropping it. 4a: The correction empties the pantry below the plan's requirements → system returns fewer meals with the shortfall stated, never a padded plan. 5a: Re-ranking fails or the model is unavailable → the original plan and the correction both persist; the user is told the plan is now stale. 5b: The corrected item was already consumed via UC7 → system reconciles instead of double-decrementing. |
| **Postconditions** | The recommendation carries a stored, user-visible rationale; any correction is persisted to inventory and reflected in the current plan; an audit row records what was claimed, what was corrected, and when. |
| **Who wants it** | The user segment our own review corpus documents: the Cooklist reviewer (2023-07-09) asking for "an option to choose how closely your pantry meets the recipe requirements instead of random broad matches", and the SuperCook reviewers who see "recipes with ingredients I don't have… it'll show things checked off that I don't have in my pantry". Secondarily, *us*: corrections are the only cheap repair mechanism for a decaying pantry. |
| **Why nobody has built it** | G1 survived interrogation: `explains_why_recommended` is unknown/partial for 14/14 confirmed products, a 222-listing App Store sweep found no explanation-of-recommendation language, and the strongest shipped thing is Samsung Food's match score — a number, not a reason. Vendors state the policy once in marketing ("our algorithms will use it up with priority", "uses your expiring ingredients first") where it is cheap and unfalsifiable; per-recipe claims are neither. Note honestly: the idea is solved in the literature (arXiv 2601.02374), so this is a *market* gap, not a novel idea. |
| **Most likely reason it is absent because it is a BAD idea** | An explanation is a load-bearing promise made on top of data we know is bad. Our nutrient substrate is Gemini-generated (the cited study puts Gemini at MAPE 64.2% on energy, 109.9% on protein), our expiry dates are user-typed with no label-type distinction, and Plan to Eat's published retreat says pantries go stale. A rationale that names "your spinach, expiring Tuesday" converts every one of those silent errors into a visible, quotable, wrong statement — and users forgive a bad *suggestion* far more readily than a bad *justification*. Vendors may have found exactly this: explanation raises support load and perceived error rate without raising retention, and it invites the one sentence no vendor wants in writing ("eat the chicken that expired two days ago"). If we ship it, the honest form is a rationale about *what the system believes and where that belief came from*, never about food safety. |
| **Budget** | ≈28 h of the 160 (typed rationale contract + storage, one UI panel, correction write-path with the UC20 row-count bug fixed first, 5-user comprehension test: can 4/5 say which item drove the pick?). |

### UC22: Confirm the few items that decide the week, before committing to a plan

| Part | Content |
|---|---|
| **Name** | Pre-plan inventory verification |
| **Primary actor** | User requesting a 5- or 7-meal plan |
| **Stakeholders & interests** | User: not spend a week cooking around food that rotted or was eaten last Thursday. Platform: bound the cost of stale inventory without demanding a full re-count. Recommender: receive a confidence-weighted pantry rather than a boolean one. |
| **Preconditions** | User is authenticated; inventory holds at least one item; each item carries a last-confirmed timestamp (new field). |
| **Trigger** | User requests a plan of 5 or 7 meals (not 3 — see extension 1a). |
| **Main success scenario** | 1. System drafts a candidate plan from current inventory. 2. System computes, for each pantry item the draft depends on, how much the plan would change if that item were absent, and how long it has been since the item was confirmed. 3. System asks about at most three items, highest decision-value first: "Still have the 400 g chicken thighs you added on the 2nd?" 4. User answers yes / no / changed quantity for each, or skips. 5. System updates inventory and last-confirmed timestamps from the answers. 6. System returns the plan with a stated confidence label naming how many of its ingredients are confirmed, assumed, or unknown. |
| **Extensions** | 1a: Plan size is 3 → verification is skipped; the questioning cost is not repaid over three meals. 3a: No item exceeds the decision-value threshold → no question is asked and the plan is returned immediately. 4a: User skips → plan is returned labelled "unverified", with no question repeated for that item for 7 days. 4b: User answers "no" to an item the whole plan hinged on → system re-drafts before presenting, rather than presenting a plan it now knows is wrong. 6a: Confidence cannot be computed (no timestamps on legacy rows) → label reads "unknown", never "high". |
| **Postconditions** | Up to three inventory rows are freshly confirmed with timestamps; the plan is stored with a confidence label and the answers that produced it; skipped items are suppressed from re-asking for a set period. |
| **Who wants it** | Users who abandoned pantry features because they went stale — the NoWaste reviewer ("it was tedious and I was too frustrated to do it again") and the Eat This Much reviewer whose pantry items "would disappear every time I went to auto generate a new menu". They will not re-count a pantry; three questions is a price they might pay. |
| **Why nobody has built it** | This is the one survivor of G3 after it was narrowed: SeePantry offers one-tap correction of usage estimates, Fango presents shelf life as an adjustable AI estimate, and Samsung Food confirms consumption *after* cooking — but nothing found in the survey **propagates** that uncertainty forward, ranks a plan by the probability its ingredients are present, or asks a targeted question *before* committing a week. Every incumbent treats the pantry as true until corrected. |
| **Most likely reason it is absent because it is a BAD idea** | It puts an interrogation in front of the payoff, against the entire direction of the market: Xpiry scans receipts, NoWaste scans barcodes, Cooklist imports loyalty-card purchases across 81+ retailers — all of them spending engineering effort to ask users *fewer* questions. A pre-plan quiz makes the product feel less intelligent, not more ("I told you what I have — why are you asking?"), and it is exactly the friction Plan to Eat blamed when it removed its Pantry. Worse for us, we cannot prove it works: the closest published trial (JMIR Formative Research, PMC9482070) ran six students per app for a month and found no change in food waste, so four students with 160 hours can measure comprehension and plan-change rate but never waste reduction — which means this could ship, feel clever, and be unfalsifiable. |
| **Budget** | ≈16 h (one `last_confirmed_at` column, a deterministic decision-value heuristic — not a model call — a three-question modal, and a deterministic fixture test that the same inventory always yields the same three questions). |

---

## 3. What our matrix cannot tell us

The matrix is a record of what vendors *write down*, on pages we could *retrieve*, on *one day*. Four consequences the team must not launder away. First, `unknown` is doing heavy lifting: Samsung Food is the closest rival on almost every row we care about, and `samsungfood.com/food-plus/` returned HTTP 403 to us in the original survey **and** the support article returned 403 again today, so every Samsung claim above rests on its support centre and third parties, never on the vendor's own feature page — SideChef's and Eatvora's pantry internals are likewise login-gated or self-marketed. Second, marketing copy proves a feature is *claimed*, not that it exists, works, or is any good: nobody on this team has installed a single rival, so every "table stakes" verdict means "a rival says it does this", and every "differentiator" means "no page we retrieved says anyone does this" — which the 222-listing App Store sweep strengthens but cannot make into proof. Third, the cap is real: 54 candidates were deduplicated to 18 verified and 14 confirmed, Reddit was unreachable for the entire survey, "OH, a potato!" has no US App Store listing we could query today, and our WebSearch budget ran out at 200 calls mid-classification, so today's verification came from direct fetches and Apple's lookup API rather than fresh discovery. Fourth, and most important for planning: the matrix measures *presence*, never *demand, quality, or retention* — it cannot tell us that anyone wants an explanation (G1's refuting search for "evidence users do not want explanations" came back NOT_FOUND, and absence of counter-evidence is not demand), it cannot tell us why Kitche died with the feature set we are calling our differentiator, and it cannot tell us whether Paprika's "Move to Pantry" is actually used by anyone. Presence data can kill an idea, as it just killed UC20 as a differentiator; it can never confirm one.
