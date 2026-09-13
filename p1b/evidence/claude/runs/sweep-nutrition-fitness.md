# sweep:nutrition-fitness

**Workflow:** P1b Claude market survey (run 1)  
**Phase:** Sweep  
**Model:** Claude Opus 5 (1M context), `claude-opus-5[1m]`  
**Agent id:** `aa28245574f7d6f7b`  
**Tool calls:** 63 total — 19 web searches, 36 pages fetched  
**Raw transcript:** `raw/agent-aa28245574f7d6f7b.jsonl` (full tool-call trace, retained)

---

## Prompt, exactly as issued

```text
You are a market analyst working for a four-person graduate software-engineering team.

OUR PRODUCT, in one paragraph:
Epicourier-Web is a full-stack meal-planning web application (Next.js 15 / TypeScript / Tailwind
front end; FastAPI + Python back end; Supabase/PostgreSQL; Google Gemini 2.5 Flash for
recommendation). Its twenty implemented use cases cover: account registration and sign-in;
recipe browsing with search, dietary tags and an "inventory match percentage"; recipe detail
with nutrients and a green/sustainability score; AI meal-plan recommendation from a free-text
goal (3/5/7 meals); calendar meal scheduling and meal-completion tracking; a nutrient dashboard
with daily/weekly/monthly trends, custom nutrient goals, and CSV/text export; gamified
achievements, streaks and wellness challenges; pantry/fridge/freezer inventory with expiry
colour-coding (expired / critical / warning / unknown) and low-stock thresholds; AI recipe
suggestions that prioritise ingredients that are expiring or already expired; shopping-list
creation from a meal plan or a recipe; and a "purchased" transfer flow that moves checked
shopping-list items into the user's inventory.

HARD BUDGET CONSTRAINT you must respect in every recommendation: four graduate students,
ONE MONTH, roughly ten hours per person per week (about 160 person-hours TOTAL), to build
AND test the result. Anything that cannot be built and tested in that budget is out of scope.

EVIDENCE RULES — these override any instinct to be helpful:
- A "rival" is a competing software product actually on the market. An LLM is never a rival.
- Do NOT invent products. If you are not certain a product exists, leave it out.
- Every product you name MUST come with a live URL you actually retrieved in this session
  (use WebSearch and WebFetch; if those tools are not in your tool list, load them with
  ToolSearch using the query "select:WebSearch,WebFetch").
- For every feature claim, quote 5-25 words of the ACTUAL page text that supports it, and give
  the exact URL that text came from. If you cannot quote the page, the cell is "unknown".
- Never infer a feature from a marketing adjective. "Smart" is not a feature. "AI-powered" is
  not a feature. Only a described behaviour is a feature.
- Distinguish: product exists / feature exists / users want it / price / quality. Evidence for
  one is not evidence for another.
- Prices change. Record the price exactly as the page states it, plus the URL, plus the note
  that it was checked on 2026-09-13.
- If a search returns nothing usable for an angle, SAY SO. An honest empty result is worth more
  than a plausible invention, and this report is graded on caught errors.

YOUR ASSIGNED SEARCH ANGLE:
Search angle: NUTRITION / FITNESS-FIRST products that have grown meal planning.
Candidates worth checking: MyFitnessPal (Premium and Premium+), Cronometer, MacroFactor,
Lose It!, Noom, Lifesum, Carbon Diet Coach, Fitbit/Google nutrition features. Establish
specifically: do any of them know what is in your pantry? Do any of them tie a calorie or macro
target to the groceries you must buy?

Run at least six distinct web searches and fetch at least eight distinct pages. Then fill the
schema. Set url_retrieved to true ONLY for URLs you actually fetched and read in this session.
For the per-feature columns (pantry, expiry, plans-from-expiring-food, nutrient goals, shopping
list, explains-why-recommended, closes-the-loop) answer "unknown" unless you have page text that
settles it — "unknown" is the correct and expected answer for most cells.

The two columns that matter most to us are explains_why_recommended and closes_the_loop. Look
hard for them, and look hard for evidence that some product DOES do them — finding a rival that
already does it is a more valuable result for us than confirming a gap.
```

## Searches actually run

- `MyFitnessPal Premium meal planning feature recipes`
- `Cronometer meal planning feature pantry inventory`
- `MyFitnessPal meal planner "pantry" grocery list support article`
- `MacroFactor app features explains recommendation adjusts targets expenditure`
- `Lifesum app meal plan grocery list feature how it works`
- `"Lose It!" app meal planning grocery list pantry feature 2026`
- `Carbon Diet Coach app "why" explains adjustment weekly check-in features site`
- `Cronometer features page recipes diary nutrient targets official site`
- `Noom meal plan grocery list feature official noom.com`
- `Fitbit app nutrition food logging feature Google 2026 meal plan`
- `Noom app "grocery list" in-app feature help center support`
- `"Lose It!" app store description meal planning recipes premium features`
- `YAZIO meal plan shopping list feature official yazio.com`
- `meal planner pantry items you already have exclude from grocery list`
- `calorie tracking app track pantry expiration dates suggest recipes expiring food nutrition`
- `MyFitnessPal meal planner review hands-on pantry step check off ingredients you already have`
- `app shows "why this recipe" explanation reason recommended nutrition goal meal plan feature`
- `app reports how much food waste you avoided savings dashboard after the fact`
- `nosh app kitchen inventory receipt scanning weekly analytics food waste official site`

## Pages actually fetched

- https://blog.myfitnesspal.com/myfitnesspal-meal-planner-what-to-know/   — asked: Quote verbatim any text describing: the pantry feature, grocery/shopping list generation, how meal plans are g
- https://www.myfitnesspal.com/premium   — asked: Quote verbatim: the exact prices listed for Premium and Premium+, and any text describing meal planning, pantr
- https://support.myfitnesspal.com/hc/en-us/articles/34603055097869-How-to-use-the-Meal-Planner   — asked: Quote verbatim all text about: the pantry step, the grocery list, how the plan is generated, calorie/macro tar
- https://macrofactor.com/macrofactor/   — asked: Quote verbatim text about: how the app adjusts calorie/macro targets based on actual results, any explanation 
- https://www.prnewswire.com/news-releases/myfitnesspal-debuts-meal-planner-tool-featuring-recipes-inspired-by-sarah-michelle-gellar-302435249.html   — asked: Quote verbatim all text describing the Meal Planner: pantry, grocery list, how plans are built, calorie/macro 
- https://help.lifesum.com/en/article/shopping-list-8mm22c/   — asked: Quote verbatim all text about the shopping list: how it is created, whether it accounts for food you already o
- https://www.loseit.com/premium/   — asked: Quote verbatim any text about meal planning, recipes, grocery/shopping lists, pantry/food inventory, and the e
- https://www.joincarbon.com/blog/release-76   — asked: Quote verbatim text about: explaining WHY macros change, the weekly check-in, progress evaluation, and any men
- https://help.joincarbon.com/en/articles/10338862-how-carbon-evaluates-your-progress-at-your-check-in   — asked: Quote verbatim text about how Carbon evaluates progress against the goal after the fact and adjusts. Give exac
- https://support.myfitnesspal.com/hc/en-us/articles/34347103172877-Meal-Planner   — asked: Quote verbatim all text about the pantry, grocery list, and how the meal plan is generated. Give exact sentenc
- https://cronometer.com/gold/index.html   — asked: Quote verbatim: the exact price of Cronometer Gold, and any text about custom nutrient targets, recipes, meal 
- https://support.cronometer.com/hc/en-us/articles/360018171731-Diary-Overview   — asked: Quote verbatim text about nutrient targets, diary, and any mention of pantry, inventory, expiry dates, grocery
- https://support.google.com/fitbit/answer/14237210?hl=en   — asked: Quote verbatim text about nutrition tracking: what can be logged, nutrient goals/targets, and whether there is
- https://www.noom.com/support/faqs/using-the-app/daily-features/2025/10/your-success-kit-tools-for-in-the-moment-support/   — asked: Quote verbatim text about the Grocery Planner and any other tools: what it does, whether it tracks what you al
- https://www.noom.com/support/faqs/using-the-app/logging-and-tracking/food-and-water/2025/10/how-to-find-and-save-recipes-in-the-noom-app/   — asked: Quote verbatim text about recipes: how they are found/recommended, whether the app explains why a recipe is su
- https://apps.apple.com/us/app/myfitnesspal-calorie-counter/id341232718   — asked: Quote verbatim from the app description any text about: meal planner, pantry, grocery list, recipes, nutrient 
- https://apps.apple.com/us/app/lose-it-calorie-counter/id297368629   — asked: Quote verbatim from the app description any text about: meal planning, recipes, grocery/shopping list, pantry 
- https://www.myfitnesspal.com/meal-planner   — asked: Quote verbatim all text about the meal planner: pantry, grocery list, how plans are generated, calorie/macro t
- https://play.google.com/store/apps/details?id=com.fitnow.loseit&hl=en_US   — asked: Quote verbatim from the app description any text about: meal planning, recipes, grocery/shopping list, pantry 
- https://play.google.com/store/apps/details?id=com.myfitnesspal.android&hl=en_US   — asked: Quote verbatim from the app description any text about: meal planner, pantry, grocery list, recipes, nutrient 
- https://help.yazio.com/hc/en-us/articles/208847005-How-does-Yazio-Pro-support-my-goals   — asked: Quote verbatim all text listing Pro features, especially meal plans, recipes, grocery/shopping lists, nutrient
- https://web.archive.org/web/2026/https://blog.myfitnesspal.com/myfitnesspal-meal-planner-what-to-know/   — asked: Quote verbatim all text about: the pantry feature, grocery list generation, how the meal plan is generated, ca
- https://www.aol.com/tried-myfitnesspals-feature-helped-plan-090303382.html   — asked: Quote verbatim any text describing the MyFitnessPal Meal Planner: the pantry step, the grocery list, budget/ho
- https://filecontent.yazio.com/press/factsheet-yazio-en.pdf   — asked: Quote verbatim any text about features: meal plans, recipes, shopping/grocery list, nutrient goals, pantry/foo
- https://apps.apple.com/us/app/ai-calorie-tracker-by-yazio/id946099227   — asked: Quote verbatim from the app description any text about: meal plans, recipes, shopping/grocery list, pantry or 
- https://www.myfitnesspal.com/premium   — asked: Does the word "pantry" appear anywhere on this page? Quote verbatim any sentence containing "pantry", "already
- https://kitchenpalapp.com/en/   — asked: Quote verbatim text about: pantry inventory, expiration date tracking, recipe suggestions based on expiring it
- https://community.myfitnesspal.com/en/discussion/10935831/methods-of-meal-planning-grocery-lists   — asked: Quote verbatim any text describing what the MyFitnessPal Meal Planner does, particularly any pantry step or gr
- https://apps.apple.com/app/id6756198499   — asked: Quote verbatim from the app description: text about tracking food expiry dates, AI recipe suggestions from wha
- https://mumslounge.com.au/lifestyle/we-tried-the-myfitnesspal-meal-planner-heres-what-you-need-to-know/   — asked: Quote verbatim any text describing the pantry step, the grocery list, budget/household inputs, and whether the
- https://forums.cronometer.com/discussion/2860/pantry-section-and-oracle-integration   — asked: Quote verbatim the user request and any official Cronometer staff reply about whether a pantry/inventory featu
- https://apps.apple.com/us/app/lose-it-calorie-counter/id297368629   — asked: Quote verbatim from the app description any text about: meal planning, recipes, grocery/shopping list, pantry 
- https://lifesum.com/features/   — asked: Quote verbatim text about: meal plans, recipes, shopping/grocery list, macro or nutrient goals, and any pantry
- https://kitche.co/   — asked: Quote verbatim text about: tracking what you have, expiry, recipe suggestions from what you have, and any repo
- https://noshhq.com/   — asked: Quote verbatim text about: pantry/fridge/freezer inventory, expiry date tracking, recipes suggested from what 
- https://apps.apple.com/us/app/nosh-ai-recipes-nutrition/id6749610047   — asked: Quote verbatim from the app description: pantry inventory, expiry dates, recipes from stocked items, macro/cal

## Response

- **angle:** NUTRITION / FITNESS-FIRST products that have grown meal planning — do any of them know what is in your pantry, and does any tie a calorie/macro target to the groceries you must buy?
- **searches run:**
  - MyFitnessPal Premium meal planning feature recipes
  - Cronometer meal planning feature pantry inventory
  - MyFitnessPal meal planner "pantry" grocery list support article
  - MacroFactor app features explains recommendation adjusts targets expenditure
  - Lifesum app meal plan grocery list feature how it works
  - "Lose It!" app meal planning grocery list pantry feature 2026
  - Carbon Diet Coach app "why" explains adjustment weekly check-in features site
  - Cronometer features page recipes diary nutrient targets official site
  - Noom meal plan grocery list feature official noom.com
  - Fitbit app nutrition food logging feature Google 2026 meal plan
  - Noom app "grocery list" in-app feature help center support
  - "Lose It!" app store description meal planning recipes premium features
  - YAZIO meal plan shopping list feature official yazio.com
  - meal planner pantry items you already have exclude from grocery list (site-restricted to myfitnesspal.com)
  - calorie tracking app track pantry expiration dates suggest recipes expiring food nutrition
  - MyFitnessPal meal planner review hands-on pantry step check off ingredients you already have
  - app shows "why this recipe" explanation reason recommended nutrition goal meal plan feature
  - app reports how much food waste you avoided savings dashboard after the fact
  - nosh app kitchen inventory receipt scanning weekly analytics food waste official site
- **rivals:**
  - _item 1_
    - **name:** MyFitnessPal (Premium+ Meal Planner)
    - **vendor:** MyFitnessPal, Inc.
    - **url:** https://www.myfitnesspal.com/premium
    - **url retrieved:** True
    - **quoted evidence:** You can easily log your planned meals to your MyFitnessPal food diary to keep track of your daily macros and calories.
    - **who uses it:** Mainstream calorie counters; the largest consumer nutrition-tracking user base in the US.
    - **price as stated:** Page states Premium+ Annual: "$8.34/mo. $99.99 billed annually" ("Save 67%"); Premium+ Monthly: "$24.99/mo. billed monthly"; Premium Annual: "$79.99" or "$6.67/mo" — https://www.myfitnesspal.com/premium, checked 2026-09-13.
    - **has pantry inventory:** unknown
    - **has expiry tracking:** unknown
    - **plans from expiring food:** unknown
    - **has nutrient goals:** yes
    - **has shopping list:** yes
    - **explains why recommended:** unknown
    - **closes the loop:** unknown
    - **main strength:** This is the closest thing in my angle to a plan-to-groceries loop. The premium page lists "Custom meal planner", "1,500+ tasty recipes", "Automated grocery lists" and "Automated ingredient lists" (https://www.myfitnesspal.com/premium), and the vendor press release states "Members simply input their goals, budget, dietary preferences, and household size to receive a personalized, weekly meal plan with a grocery list for easy shopping" (https://www.prnewswire.com/news-releases/myfitnesspal-debuts-meal-planner-tool-featuring-recipes-inspired-by-sarah-michelle-gellar-302435249.html, retrieved). The App Store listing ties recipes to targets: "1500+ healthy recipes tailored to your calorie, macro, nutrition & fitness goals" (https://apps.apple.com/us/app/myfitnesspal-calorie-counter/id341232718, retrieved). Grocery list syncs to "Instacart, Walmart, Kroger, Amazon Fresh, Whole Foods" on iOS.
    - **main weakness:** I could NOT verify the pantry claim from any page I retrieved. Search snippets repeatedly attribute a pantry step to MyFitnessPal's help centre, but support.myfitnesspal.com and blog.myfitnesspal.com returned HTTP 403 to every fetch attempt (WebFetch, curl with browser UA, Googlebot UA, bingbot UA), and web.archive.org is unfetchable from this session. A targeted re-fetch of https://www.myfitnesspal.com/premium confirmed the words "pantry", "already have", "at home" and "on hand" do NOT appear on that page. An independent hands-on review I did retrieve (https://mumslounge.com.au/lifestyle/we-tried-the-myfitnesspal-meal-planner-heres-what-you-need-to-know/) describes the planner as tailored to "your budget" and that it "autogenerates the grocery list too based on the exact number of meals and people you are feeding" — but that reviewer does not describe a pantry step either. Even if the pantry step exists, every description I saw frames it as a one-time checklist at grocery-list time, not a persistent inventory with quantities, locations or dates.
    - **closes the loop note:** No retrieved page describes any after-the-fact measurement of whether the plan was followed, whether food was wasted, or whether the goal was met.
  - _item 2_
    - **name:** Cronometer / Cronometer Gold
    - **vendor:** Cronometer Software Inc.
    - **url:** https://cronometer.com/gold/index.html
    - **url retrieved:** True
    - **quoted evidence:** Custom macro and micronutrient targets
    - **who uses it:** Micronutrient-focused trackers, quantified-self users, dietitians and clinicians.
    - **price as stated:** Page states "$4.99" per month billed annually at "$59.99", or "$10.99" per month billed monthly — https://cronometer.com/gold/index.html, checked 2026-09-13.
    - **has pantry inventory:** no
    - **has expiry tracking:** unknown
    - **plans from expiring food:** no
    - **has nutrient goals:** yes
    - **has shopping list:** no
    - **explains why recommended:** no
    - **closes the loop:** unknown
    - **main strength:** Deepest nutrient-target model of anything in my angle: the Gold comparison page lists "Custom macro and micronutrient targets" in both Basic and Gold, plus "Recipe Importer: Easily import recipes from your favorite websites" and the ability to "Automate previously logged foods, recipes, and meal entries". This is the strongest evidence in my angle that per-nutrient custom goals are a normal, shipped, paid feature — i.e. our nutrient-goal feature is table stakes, not a differentiator.
    - **main weakness:** No pantry, no grocery list, no plan generation. The canonical Basic-vs-Gold feature page mentions no grocery list, shopping list, or pantry/inventory feature at all. Cronometer's own forum shows the demand exists and the feature does not: a user wrote "It would be amazing if I could instead add my grocery haul to a Pantry section or category in Cronometer. Then, when I'm deciding what to eat for dinner, I could ask the Oracle to suggest a food from the things I already have on hand", and a Cronometer staff account replied "That's a great idea! I'll be sure to add it to our feature request list" (https://forums.cronometer.com/discussion/2860/pantry-section-and-oracle-integration, retrieved). Caveat: that exchange is dated December 2019, so it proves demand and non-existence at that time, not today.
  - _item 3_
    - **name:** MacroFactor
    - **vendor:** KeyLime Labs / Stronger By Science
    - **url:** https://macrofactor.com/macrofactor/
    - **url retrieved:** True
    - **quoted evidence:** Your updated calorie and macro recommendations for the next week are based on your actual energy intake and changes in weight
    - **who uses it:** Evidence-minded lifters and dieters; users who want an algorithmic coach rather than a fixed calculator.
    - **price as stated:** Not retrieved in this session — I did not fetch a MacroFactor pricing page, so I have no price to record.
    - **has pantry inventory:** no
    - **has expiry tracking:** unknown
    - **plans from expiring food:** no
    - **has nutrient goals:** yes
    - **has shopping list:** no
    - **explains why recommended:** no
    - **closes the loop:** yes
    - **main strength:** THIS IS THE CLOSES-THE-LOOP FINDING. MacroFactor measures whether the plan actually worked and re-plans from the measurement: "As you continue to use MacroFactor, we'll continue monitoring your energy intake and changes in weight to update your calculated energy expenditure", and it is explicitly adherence-neutral — "Your updated calorie and macro recommendations for the next week are based on your actual energy intake and changes in weight, not how well you stuck to our recommendations." It also exposes its reasoning: "Your estimated energy expenditure is a deterministic calculation based on your calorie intake and changes in body weight", i.e. "Calories in – Change in stored energy = Calories out." So a shipped consumer product already does outcome-measured re-planning — just on the weight/energy goal.
    - **main weakness:** The loop is closed on bodyweight and energy expenditure only — never on food, groceries or waste. The page I retrieved contains no information at all about meal planning, grocery/shopping lists, or pantry/food inventory. There are no recipes to explain, so explains_why_recommended is "no" in our sense: MacroFactor explains why a NUMBER changed, not why a MEAL was chosen.
  - _item 4_
    - **name:** Carbon Diet Coach
    - **vendor:** Carbon (joincarbon.com)
    - **url:** https://help.joincarbon.com/en/articles/10338862-how-carbon-evaluates-your-progress-at-your-check-in
    - **url retrieved:** True
    - **quoted evidence:** Carbon evaluates your progress using two inputs: your weight data and your tracked intake.
    - **who uses it:** Physique/macro-coaching users who want a weekly algorithmic check-in instead of a human coach.
    - **price as stated:** Not retrieved in this session — I did not fetch a Carbon pricing page, so I have no price to record.
    - **has pantry inventory:** unknown
    - **has expiry tracking:** unknown
    - **plans from expiring food:** unknown
    - **has nutrient goals:** yes
    - **has shopping list:** unknown
    - **explains why recommended:** no
    - **closes the loop:** yes
    - **main strength:** THE STRONGEST EXPLAIN-WHY EVIDENCE I FOUND, and a second closed loop. On evaluation: "At each check-in, Carbon reviews how your weight trended during the week alongside your logged calories and macros relative to your Carbon-provided targets", and "In some cases, if your tracked intake landed outside your targets but your progress still moved in the right direction, Carbon may adjust your targets to reflect what you were actually eating rather than what was prescribed." On explanation: "A coaching message explains the reasoning behind the adjustment in plain language, so you understand not just what changed but why" (same URL). The vendor release adds: "If your macros change, you'll see the reason behind the adjustment" and "You're not just getting new numbers. You're getting the coaching logic behind them" (https://www.joincarbon.com/blog/release-76, retrieved). So a rival DOES ship user-facing recommendation rationale — proof the pattern is commercially viable, and proof it is not novel in the abstract.
    - **main weakness:** The rationale is about macro targets, not about food you own. The release page I retrieved contains no text about meal planning, grocery shopping, recipes, or pantry management. Carbon never picks a recipe, so it can never say "this recipe because your spinach expires Thursday". It also has nothing to say about waste.
  - _item 5_
    - **name:** Lifesum
    - **vendor:** Lifesum AB
    - **url:** https://lifesum.com/features/
    - **url retrieved:** True
    - **quoted evidence:** 7–21 days of pre-planned meals: breakfasts, lunches, dinner and snacks
    - **who uses it:** Consumer dieters in Europe and the US wanting guided diet plans plus calorie tracking.
    - **price as stated:** Not retrieved in this session — I did not fetch a Lifesum pricing page.
    - **has pantry inventory:** no
    - **has expiry tracking:** unknown
    - **plans from expiring food:** no
    - **has nutrient goals:** yes
    - **has shopping list:** yes
    - **explains why recommended:** unknown
    - **closes the loop:** unknown
    - **main strength:** A complete plan-to-list pipeline: the features page lists "7–21 days of pre-planned meals", "Digital shopping lists", recipes "Personalized based on your goal, diet and allergies", and "Support for macros and net carbs" with "Detailed nutritional information". The help centre confirms the list is derived from the plan, not typed by hand: "The shopping list is a help for you in the grocery store, it mirrors the meals and ingredients you have in the meal planner" (https://help.lifesum.com/en/article/shopping-list-8mm22c/, retrieved).
    - **main weakness:** The list is generated from zero — it assumes an empty kitchen. I checked both the canonical features page and the dedicated shopping-list help article; neither contains any text about food you already own at home, a pantry, checking items off into an inventory, or expiry dates. "Personalized based on your goal, diet and allergies" describes inputs, not a shown explanation, so I will not score it as explains-why.
  - _item 6_
    - **name:** Lose It!
    - **vendor:** FitNow, Inc.
    - **url:** https://apps.apple.com/us/app/lose-it-calorie-counter/id297368629
    - **url retrieved:** True
    - **quoted evidence:** meal targets help you calculate suggested nutritional content including macro, carb, protein and overall calorie intake
    - **who uses it:** Mainstream weight-loss calorie counters; long-established MyFitnessPal alternative.
    - **price as stated:** App Store in-app-purchase list showed values including "$9.99" and "$79.99" yearly tiers and a "Lifetime $59.99" option — https://apps.apple.com/us/app/lose-it-calorie-counter/id297368629, checked 2026-09-13. I could not retrieve a labelled vendor pricing page (www.loseit.com is unfetchable from this session), so treat these as unlabelled IAP line items, not confirmed plan prices.
    - **has pantry inventory:** no
    - **has expiry tracking:** unknown
    - **plans from expiring food:** no
    - **has nutrient goals:** yes
    - **has shopping list:** no
    - **explains why recommended:** unknown
    - **closes the loop:** unknown
    - **main strength:** Strong goal/target machinery — "Meal Planning & Targets" and tracking of "macronutrients like protein, carbs, fat, sugar; as well as nutrition, vitamins, minerals, and other health goals", over a food database of "56+ million items and recipes".
    - **main weakness:** "Meal planning" here means allocating calories/macros across meal slots, not producing a shopping trip. The App Store description enumerates the premium feature set and contains no grocery/shopping list and no pantry or food-inventory feature. So Lose It! does NOT tie a macro target to groceries you must buy.
  - _item 7_
    - **name:** YAZIO
    - **vendor:** YAZIO GmbH
    - **url:** https://apps.apple.com/us/app/ai-calorie-tracker-by-yazio/id946099227
    - **url retrieved:** True
    - **quoted evidence:** Smart grocery list for quick, easy shopping.
    - **who uses it:** 100M+ registered users, Europe-heavy consumer calorie tracking (per vendor factsheet).
    - **price as stated:** App Store in-app purchases listed as "12 Months: $47.90", "3 Months: $23.99", "Semi-Annual: $34.99" — https://apps.apple.com/us/app/ai-calorie-tracker-by-yazio/id946099227, checked 2026-09-13.
    - **has pantry inventory:** no
    - **has expiry tracking:** unknown
    - **plans from expiring food:** no
    - **has nutrient goals:** yes
    - **has shopping list:** yes
    - **explains why recommended:** unknown
    - **closes the loop:** unknown
    - **main strength:** Another tracker-first app that grew the full plan→list pipeline: "custom meal plans tailored to your goals", "2,900+ delicious, goal-friendly recipes", "Weekly updates with new healthy meal ideas", and a "Smart grocery list for quick, easy shopping", on top of macro tracking. Scale is real: the vendor press factsheet states "the Yazio app has over 100 million users (December 2025)" and "No. of recipes created by in-house team: 3,000+" (https://filecontent.yazio.com/press/factsheet-yazio-en.pdf, retrieved and text-extracted).
    - **main weakness:** No inventory awareness. I grepped the full extracted text of YAZIO's own December 2025 press factsheet for "shopping", "grocer", "meal plan", "pantry", "fridge" and "expir" — zero matches; the factsheet's own feature list is "a calorie and macronutrient tracker, an innovative AI food scanner, a convenient barcode scanner, detailed analyses and statistics, smart food ratings, automatic activity tracking, an ever-growing recipe database" and fasting trackers. So even the vendor does not treat the grocery list as a headline capability, and nothing anywhere describes knowing what is already in your kitchen.
  - _item 8_
    - **name:** Noom
    - **vendor:** Noom, Inc.
    - **url:** https://www.noom.com/support/faqs/using-the-app/logging-and-tracking/food-and-water/2025/10/how-to-find-and-save-recipes-in-the-noom-app/
    - **url retrieved:** True
    - **quoted evidence:** Each recipe includes prep instructions, calorie details, food color breakdown, and nutrition info.
    - **who uses it:** Behaviour-change/psychology-led weight-loss subscribers.
    - **price as stated:** Not retrieved in this session — I did not fetch a Noom pricing page.
    - **has pantry inventory:** no
    - **has expiry tracking:** unknown
    - **plans from expiring food:** no
    - **has nutrient goals:** unknown
    - **has shopping list:** yes
    - **explains why recommended:** no
    - **closes the loop:** unknown
    - **main strength:** Has an in-app grocery tool that scores a shopping list against its own food model — the Success Kit lists "Grocery Planner (iOS only)" whose described behaviour is to "Calculate your list's green food percentage and get healthy alternatives" (https://www.noom.com/support/faqs/using-the-app/daily-features/2025/10/your-success-kit-tools-for-in-the-moment-support/, retrieved). Recipe browsing supports "Search by Ingredient" and filters by "Meal Type, Calories per Serving, Time to Prepare, Dietary Restrictions".
    - **main weakness:** Ingredient search is a user-typed query, not pantry-driven recommendation — the app does not know what you own. The recipe help page explicitly gives no reason why any recipe is surfaced, and mentions no link between recipes and a grocery list or pantry. The Grocery Planner grades a list you already wrote; it does not build one from a nutrient target, and it is iOS-only.
  - _item 9_
    - **name:** Google Health app (formerly Fitbit)
    - **vendor:** Google
    - **url:** https://support.google.com/fitbit/answer/14237210?hl=en
    - **url retrieved:** True
    - **quoted evidence:** smart goals based on clinical recommendations that you can adjust in your Nutrition settings
    - **who uses it:** Fitbit/Pixel Watch wearers logging food alongside activity and sleep.
    - **price as stated:** Not retrieved in this session — I did not fetch a Fitbit Premium pricing page.
    - **has pantry inventory:** no
    - **has expiry tracking:** unknown
    - **plans from expiring food:** no
    - **has nutrient goals:** yes
    - **has shopping list:** no
    - **explains why recommended:** no
    - **closes the loop:** unknown
    - **main strength:** Low-friction capture plus defensible default targets: "Use the Google Health app to log your daily meals and water intake", with manual entry, barcode scanning, conversational logging ("I ate 1 banana") and photo logging that will "find suggested food entries based on what is contained in your photo". Protein baselines are stated as "1.2 to 1.4 grams per kilogram of body weight"; fat/carb split "20% to 35% fat and the remaining form carbohydrates".
    - **main weakness:** The big-platform incumbent is retreating from meal planning, not advancing into it. The nutrition help page contains no mention of meal planning, recipe suggestions, grocery lists or pantry/food-inventory tracking. Secondary reporting says the May 2026 Fitbit→Google Health rebrand removed calorie-budget "Food Plans" and recipes, but I could not confirm that removal from a first-party page I retrieved, so treat it as unverified.
  - _item 10_
    - **name:** Nosh AI (Recipes & Nutrition)
    - **vendor:** Nosh (noshhq.com)
    - **url:** https://apps.apple.com/us/app/nosh-ai-recipes-nutrition/id6749610047
    - **url retrieved:** True
    - **quoted evidence:** Ingredient Scanner - Track what you have at home to reduce waste
    - **who uses it:** Consumers who want AI recipe generation plus macro tracking in one app; small/new app, not an established incumbent.
    - **price as stated:** Not retrieved in this session — no price text captured from the listing.
    - **has pantry inventory:** yes
    - **has expiry tracking:** unknown
    - **plans from expiring food:** unknown
    - **has nutrient goals:** unknown
    - **has shopping list:** no
    - **explains why recommended:** unknown
    - **closes the loop:** unknown
    - **main strength:** THE CLOSEST SINGLE-APP OVERLAP WITH OUR CONCEPT that I found. The vendor's own App Store description combines home-inventory awareness with macro tracking and plan generation: "Ingredient Scanner - Track what you have at home to reduce waste", "Track your daily macro with detailed analytics", "Personalized Meal Plans - No more guessing what to make", and "Nosh AI generates tasty, practical recipes in under a minute". This is direct evidence that inventory-aware + macro-aware is already being attempted commercially, so we should not claim the combination is unoccupied.
    - **main weakness:** Evidence thin and the claims are shallow. The App Store description contains NO mention of expiry-date tracking, shopping lists, food-waste analytics, or prices. I could not retrieve the body of https://noshhq.com/ (only the page title came back), so the richer marketing claims attributed to it in search summaries are unverified. There is also a naming collision with a separate UK app also called "nosh" on Google Play (package app.F6NHQc92Bw.nosh.technologies) — I did not fetch that one and have deliberately not merged their claims.
  - _item 11_
    - **name:** KitchenPal
    - **vendor:** iCuisto / KitchenPal
    - **url:** https://kitchenpalapp.com/en/
    - **url retrieved:** True
    - **quoted evidence:** Get recipe suggestions based on expiring ingredients in your pantry and fridge inventory.
    - **who uses it:** Household kitchen organisers; pantry-first rather than fitness-first users. Included as a cross-angle check, not as a nutrition-first rival.
    - **price as stated:** Not retrieved in this session — no price text captured from the page.
    - **has pantry inventory:** yes
    - **has expiry tracking:** yes
    - **plans from expiring food:** yes
    - **has nutrient goals:** unknown
    - **has shopping list:** yes
    - **explains why recommended:** unknown
    - **closes the loop:** unknown
    - **main strength:** DIRECTLY OCCUPIES OUR HEADLINE FEATURE. The vendor page states multi-location inventory — "organize your kitchen into pantry, fridge, freezer, bar inventory, cleaning supplies, or create custom sections" — plus "Food expiration tracker sends alerts before items expire to reduce waste", plus the exact behaviour our AI suggestion feature implements: "Get recipe suggestions based on expiring ingredients in your pantry and fridge inventory." Its shopping list is inventory-aware: "Create smart grocery lists in seconds with automated pantry inventory checks." Our expiry-prioritised recipe suggestion is therefore NOT novel and must not be pitched as such.
    - **main weakness:** Nutrition depth is marketing-thin: the page offers only "Healthy recipes app with nutritional information for easy fitness tracking" and "Personalized nutritional recommendations" — adjectives, with no described behaviour for calorie/macro/micronutrient goals, daily/weekly trends or export. It suggests recipes from expiring items but I found no text showing WHY a given recipe was picked (which item, which date), and no text measuring afterwards how much waste was actually avoided.
  - _item 12_
    - **name:** Xpiry: Food Expiry & AI Recipe
    - **vendor:** Xpiry (iOS app)
    - **url:** https://apps.apple.com/app/id6756198499
    - **url retrieved:** True
    - **quoted evidence:** Xpiry tracks food expiration dates and uses AI to suggest recipes based on what's in your kitchen.
    - **who uses it:** iOS consumers focused on not wasting groceries; small indie app, included as a cross-angle check.
    - **price as stated:** Listing states the app is free with in-app purchases of "$3.99 monthly or $39.99 annually" for premium — https://apps.apple.com/app/id6756198499, checked 2026-09-13.
    - **has pantry inventory:** yes
    - **has expiry tracking:** yes
    - **plans from expiring food:** unknown
    - **has nutrient goals:** unknown
    - **has shopping list:** unknown
    - **explains why recommended:** unknown
    - **closes the loop:** unknown
    - **main strength:** Combines expiry urgency with macro-aware recipe filtering — exactly our pitch, at $3.99/month. Its description gives us our urgency buckets almost verbatim: "See all your food organized by urgency - expired, expiring soon, and good for later", with "Receive daily notifications about items that need your attention", plus "Use latest AI model to find recipes from ingredients you own!", "Discover recipes tailored to your goals: high protein, low calories, etc." and "Every recipe includes detailed macro nutrients (calories, protein, carbs, fat)." Intake is low-friction: barcode scan for one item, or "just snap a photo of your grocery receipt" for many.
    - **main weakness:** "Tailored to your goals: high protein, low calories" reads as a recipe FILTER, not a tracked nutrient target with trends — I have no page text showing stored daily goals, dashboards or history, so I scored nutrient goals unknown. Likewise it says recipes come "from ingredients you own" and separately that it sorts by urgency, but no sentence states that the recipe engine PRIORITISES the soonest-to-expire item, so I did not score plans-from-expiring-food as yes. No shopping list, no why-this-recipe explanation, and no after-the-fact waste report in the description.
- **what none of them do:**
  - Nobody in the nutrition/fitness-first category knows what is physically in your kitchen. Across every canonical vendor page I retrieved — Cronometer Gold's Basic-vs-Gold comparison, Lifesum's features page AND its shopping-list help article, Lose It!'s App Store feature list, YAZIO's own December 2025 press factsheet (I grepped the extracted text for pantry/fridge/expir: zero hits), MacroFactor's product page, Carbon's coaching release, and Google Health's nutrition help page — there is no pantry, fridge, freezer or food-inventory feature. Reason I believe it absent: these products monetise logging and targets; an inventory is a second data-entry burden that does not improve the calorie number, and Cronometer staff answered a 2019 user request for exactly this with 'I'll be sure to add it to our feature request list' rather than pointing at a shipped feature.
  - No nutrition-first product tracks per-item expiry dates or plans meals from food that is about to spoil. Not one page I retrieved in this angle contains the word 'expiration' or 'expiry' in a product-feature sense. The only products I found doing it are pantry-first apps outside my angle (KitchenPal, Xpiry) and possibly Nosh AI. Reason: expiry requires storing a date per physical item, which none of the tracker data models carry — their unit of record is a logged eating event, not a possessed object.
  - Nobody explains WHY a specific recipe was recommended, traceable to a specific item you own. This is the clearest gap I found and I looked hard for a counter-example. Carbon and MacroFactor DO ship user-facing rationale — Carbon: 'A coaching message explains the reasoning behind the adjustment in plain language, so you understand not just what changed but why' — but it explains why a NUMBER moved, never why a MEAL was chosen. On the recipe side, Noom's recipe help page describes browsing, filters and 'Search by Ingredient' with no reason given; Lifesum says recipes are 'Personalized based on your goal, diet and allergies', which names inputs, not a shown explanation; MyFitnessPal's press release says members 'input their goals, budget, dietary preferences, and household size' and receive a plan, again inputs only. KitchenPal suggests recipes 'based on expiring ingredients' but no retrieved text surfaces which ingredient or which date drove the pick. Reason it is absent: recipe ranking is treated as taste/diet matching, where a rationale adds little; it only becomes meaningful once the reason is a concrete object with a deadline, which requires the inventory none of them have.
  - Nobody closes the loop on FOOD WASTE. Two products in my angle genuinely close an outcome loop, so the pattern is proven and I must not overclaim novelty: MacroFactor ('Your updated calorie and macro recommendations for the next week are based on your actual energy intake and changes in weight, not how well you stuck to our recommendations') and Carbon ('Carbon evaluates your progress using two inputs: your weight data and your tracked intake'). Both measure bodyweight and intake. Neither measures whether the groceries got eaten, whether anything spoiled, or whether the plan reduced waste. Secondary search surfaced waste-first apps that do report waste after the fact (Kitche, nosh), but I could not retrieve a first-party page for either, so I am recording that as a lead, not a finding.
  - Nobody ties a nutrient target to the food you ALREADY OWN. Several products tie a target to food you must BUY — MyFitnessPal ('1500+ healthy recipes tailored to your calorie, macro, nutrition & fitness goals' plus 'Automated grocery lists'), Lifesum ('Digital shopping lists' mirroring the meal planner), YAZIO ('Smart grocery list for quick, easy shopping') — but every one of those pipelines starts from an empty kitchen and outputs a purchase. The direction 'given this stock and these dates, what should I eat to hit my goal' appears in no retrieved page from a nutrition-first vendor.
  - No single product in my angle shows a persistent multi-location inventory with expiry AND a nutrient dashboard with daily/weekly/monthly trends, custom goals and export. The two halves exist in different products: nutrient depth lives in Cronometer ('Custom macro and micronutrient targets'), inventory-plus-expiry lives in KitchenPal and Xpiry. The crossover apps I found (Nosh AI, Xpiry) have inventory but no retrieved evidence of stored nutrient goals or trend history.
- **honest gaps in my search:** ["THE BIGGEST GAP: I could not verify MyFitnessPal's pantry step from any page I retrieved. support.myfitnesspal.com and blog.myfitnesspal.com returned HTTP 403 to WebFetch and to curl with browser, Googlebot and bingbot user agents; web.archive.org is unfetchable from this session; www.myfitnesspal.com/meal-planner also returned 403; the AOL hands-on article 404'd. Search-engine summaries repeatedly assert a pantry checkbox step exists in MFP's Meal Planner, but a search summary is not page text I read, so I scored MFP pantry as 'unknown' rather than 'yes'. A teammate on a different network, or anyone with an MFP Premium+ account, should settle this — it is the single cell most likely to change our positioning.","Google Play Store listings are JavaScript-rendered and came back empty for both Lose It! and MyFitnessPal, so all app-store evidence I have is from Apple's App Store, and apps.apple.com rate-limited me (HTTP 429) on one attempt. App Store descriptions are vendor marketing copy, not documentation; they overstate and omit.","www.loseit.com is unfetchable from this session entirely, so I have no first-party vendor page for Lose It! — only its App Store listing. Its pricing is therefore an unlabelled list of in-app-purchase line items, not confirmed plan prices.","help.yazio.com returned 403, so YAZIO's canonical Pro feature list is unverified; my YAZIO evidence is the App Store listing plus the vendor press factsheet PDF.","I retrieved NO prices for MacroFactor, Carbon Diet Coach, Lifesum, Noom, Fitbit Premium, Nosh AI or KitchenPal. Do not quote prices for those from me.","I could not test any app. Everything here is from public pages; paywalled in-app behaviour (especially MFP Premium+ Meal Planner and Noom's iOS-only Grocery Planner) is unobserved. Absence of a feature from a marketing page is weak evidence of absence from the product, and I have flagged every cell where that is my only basis.","My Cronometer pantry evidence rests partly on a forum thread dated December 2019. It proves demand existed and the feature did not exist then; it does not prove the feature is still missing in 2026.","The Fitbit/Google Health claim that the May 2026 rebrand removed calorie-budget 'Food Plans' and recipes comes only from secondary tech press in search results — I did not confirm it on a Google first-party page, so I excluded it from the feature cells.","Leads I could not verify and am therefore NOT claiming as findings: 'Kitche' and 'nosh - Reduce food waste' reportedly report the cost of food you binned and weekly waste analytics — kitche.co returned only boilerplate on fetch and I never fetched the UK nosh app. If a teammate confirms either, it would be a genuine rival on closes_the_loop-for-waste, which would materially weaken our strongest differentiator.","There are two unrelated products named 'nosh'. I kept them separate and reported only the one whose App Store listing I actually read (Nosh AI, id6749610047). Do not merge them."]
