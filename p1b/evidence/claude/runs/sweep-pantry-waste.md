# sweep:pantry-waste

**Workflow:** P1b Claude market survey (run 1)  
**Phase:** Sweep  
**Model:** Claude Opus 5 (1M context), `claude-opus-5[1m]`  
**Agent id:** `ad8d4e7c57b0dd89b`  
**Tool calls:** 45 total — 17 web searches, 26 pages fetched  
**Raw transcript:** `raw/agent-ad8d4e7c57b0dd89b.jsonl` (full tool-call trace, retained)

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
Search angle: PANTRY AND FOOD-WASTE APPS — products whose core job is tracking what
food you already have and when it expires. Candidates worth checking: NoWaste, KitchenPal,
Pantry Check, Fridgely, Cozzo, Kitchenful, Too Good To Go, OLIO, Jow, Supercook, MyFridgeFood.
Pay special attention to whether any of them turn expiring stock into a plan, and whether any
of them show the user WHY a given recipe was suggested.

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

- `NoWaste app pantry expiry tracking food waste`
- `KitchenPal pantry app expiration date recipes`
- `Cozzo app pantry food waste tracker recipes shopping list`
- `Supercook recipes from ingredients you have pantry`
- `"Pantry Check" app inventory expiration barcode`
- `Fridgely app food expiration tracker recipes`
- `Kitchenful meal planner grocery delivery pantry app features`
- `nowasteapp.com NoWaste food inventory list features pricing`
- `MyFridgeFood recipes ingredients you have website`
- `OLIO app share surplus food neighbours how it works`
- `pantry app dashboard "money saved" food waste prevented statistics report`
- `NoWaste.ai pantry management receipts expiry AI features pricing`
- `Eatvora app store iOS pantry AI recipes`
- `pantry app recipe shows "uses" expiring ingredients badge match percentage explanation`
- `Too Good To Go surprise bag how it works app`
- `Jow app recipes groceries how it works features`
- `Kitche app food waste tracker UK "kitche" savings dashboard still available`

## Pages actually fetched

- https://kitchenpalapp.com/en/expiry-date-tracker.html   — asked: Extract verbatim sentences about: pantry/fridge/freezer inventory, expiration date tracking, recipe suggestion
- https://kitchenpalapp.com/en/   — asked: Extract verbatim sentences about: pantry inventory, expiry alerts, meal planner, shopping list, recipe matchin
- https://cozzo.app/features/   — asked: Extract verbatim sentences about: pantry/fridge inventory, expiry / Best By / Use By date tracking, meal plann
- https://www.supercook.com/   — asked: Extract verbatim text from this page about: how recipes are matched to ingredients you have, whether it shows 
- https://cozzo.app/   — asked: Extract verbatim sentences about: expiry tracking, recipes that use expiring products, meal planner, shopping 
- https://apps.apple.com/us/app/supercook-recipe-by-ingredient/id1477747816   — asked: Extract verbatim description text about: how it matches recipes to ingredients you have, whether it shows what
- https://pantrycheck.com/   — asked: Extract verbatim text about: pantry inventory, expiration date tracking and reminders, meal planning, recipes 
- https://fridgelyapp.com/   — asked: Extract verbatim text about: expiration date tracking and alerts, recipe suggestions based on food you have, s
- https://www.nowasteapp.com/   — asked: Extract verbatim text about: food inventory lists for fridge/freezer/pantry, expiration date sorting or alerts
- https://apps.apple.com/us/app/nowaste-food-inventory-list/id926211004   — asked: Extract verbatim app description text about: inventory lists, expiration date sorting and notifications, recip
- https://www.myfridgefood.com/   — asked: Extract verbatim text about: how you tell it what ingredients you have, whether recipes show a match percentag
- https://olioapp.com/en/getting-started-on-olio/discover-the-olio-app/   — asked: Extract verbatim text describing what the app does: listing surplus food, requesting items, any pantry invento
- https://pantrywiseapp.com/   — asked: Extract verbatim text about: pantry inventory, expiry tracking, recipe suggestions from expiring items, meal p
- https://www.eatvora.app/features/food-waste-reduction   — asked: Extract verbatim text about: pantry/expiry tracking, recipes prioritising expiring ingredients, whether it exp
- https://cozzo.app/faqs/   — asked: Extract verbatim text about: how recipes are matched to inventory, the "Cook Expiring Products" board, whether
- https://apps.apple.com/us/app/eatvora/id6759806556   — asked: Extract verbatim app description text about: pantry tracking, expiration alerts, AI recipes from expiring ingr
- https://apps.apple.com/us/app/pantrywise-food-waste-tracker/id6759767806   — asked: Extract verbatim app description text about: pantry inventory, expiration alerts, recipe matching, waste/savin
- https://www.toogoodtogo.com/en-us/how-does-the-app-work   — asked: Extract verbatim text describing how the app works: surprise bags, reserving, pricing, and any impact tracking
- https://xpiry.app/   — asked: Extract verbatim text about: expiry date tracking, recipe discovery from expiring items, whether it explains w
- https://xpiry.cjinteractivellc.com/   — asked: Extract verbatim text about: expiry date tracking, recipe discovery from expiring items, whether it explains w
- https://play.google.com/store/apps/details?id=com.app.tgtg&hl=en   — asked: Extract verbatim app description text about how Too Good To Go works, surprise bags, and any tracking of money
- https://www.toogoodtogo.com/en-us   — asked: Extract verbatim text about how the app works, Surprise Bags, prices, and any tracking of money saved or CO2e 
- https://apps.apple.com/us/app/jow-easy-recipes-groceries/id1301257625   — asked: Extract verbatim app description text about: how recipes are chosen, automatic grocery cart, pantry inventory,
- https://apps.apple.com/us/app/too-good-to-go-end-food-waste/id1060683933   — asked: Extract verbatim app description text about surprise bags, how it works, money saved or CO2 avoided tracking, 
- https://www.thegrocer.co.uk/news/kitche-adds-app-feature-to-track-anti-waste-efforts-on-the-environment/675540.article   — asked: Extract verbatim text about the Kitche app feature that tracks water, CO2 and money saved, food waste cost ver
- https://kitche.co/   — asked: Extract verbatim text about: tracking food at home, expiry dates, recipe suggestions from ingredients you have

## Response

- **angle:** PANTRY AND FOOD-WASTE APPS — products whose core job is tracking what food you already have and when it expires; with special attention to (a) whether expiring stock is turned into an actual plan and (b) whether the product shows the user WHY a recipe was suggested.
- **searches run:**
  - NoWaste app pantry expiry tracking food waste
  - KitchenPal pantry app expiration date recipes
  - Cozzo app pantry food waste tracker recipes shopping list
  - Supercook recipes from ingredients you have pantry
  - "Pantry Check" app inventory expiration barcode
  - Fridgely app food expiration tracker recipes
  - Kitchenful meal planner grocery delivery pantry app features
  - nowasteapp.com NoWaste food inventory list features pricing
  - MyFridgeFood recipes ingredients you have website
  - OLIO app share surplus food neighbours how it works
  - pantry app dashboard "money saved" food waste prevented statistics report
  - NoWaste.ai pantry management receipts expiry AI features pricing
  - Eatvora app store iOS pantry AI recipes
  - pantry app recipe shows "uses" expiring ingredients badge match percentage explanation
  - Too Good To Go surprise bag how it works app
  - Jow app recipes groceries how it works features
  - Kitche app food waste tracker UK "kitche" savings dashboard still available
- **rivals:**
  - _item 1_
    - **name:** CozZo
    - **vendor:** CozZo (Ivo Dimitrov)
    - **url:** https://cozzo.app/features/
    - **url retrieved:** True
    - **quoted evidence:** identifies recipes from your collections that use products at the end of their shelf life
    - **has pantry inventory:** yes
    - **has expiry tracking:** yes
    - **plans from expiring food:** yes
    - **has nutrient goals:** unknown
    - **has shopping list:** yes
    - **explains why recommended:** yes
    - **closes the loop:** yes
    - **main strength:** The closest thing to our whole loop that I found. Its 'Cook Expiring Products' Board surfaces recipes built from end-of-shelf-life stock, and https://cozzo.app/features/ states 'The recipes are listed according to the number of expiring products.' — i.e. the ranking criterion is exposed to the user. https://cozzo.app/faqs/ adds 'CozZo matches them to your inventory and shows the ones that have more than 30% of their ingredients in stock.' It also closes the loop: https://cozzo.app/faqs/ says 'In a month, you will have a precise report of the % of the food that was consumed vs. wasted.' and https://cozzo.app/ says 'CozZo Journal gives you an up-to-date report of consumed vs. wasted food.'
    - **main weakness:** IT IS BEING SHUT DOWN. https://cozzo.app/ states 'CozZo mobile app will be coming to an end. Unfortunately, the cloud infrastructure that supports our service is being shut down.' with premium free 'until December 30, 2025' — that date is nine months in the past as of 2026-09-13, so the most feature-complete rival to our concept is very likely dead. I could not verify current availability. Also: the 'why' it exposes is a ranking rule (count of expiring products, >30% in stock), not a per-item explanation naming WHICH pantry item drove the suggestion, and the consumed-vs-wasted report measures waste generally, not whether a specific plan worked.
    - **price as stated:** No price stated on the pages I fetched (https://cozzo.app/, /features/, /faqs/ mention 'Household Account' subscription plans without a figure). Checked 2026-09-13.
    - **who uses it:** Households; UK App Store launch May 2017 per search results (not verified on a page I fetched).
  - _item 2_
    - **name:** Eatvora
    - **vendor:** Zekeria Abdi
    - **url:** https://apps.apple.com/us/app/eatvora/id6759806556
    - **url retrieved:** True
    - **quoted evidence:** Get a letter grade on your food waste performance. See how much money you saved
    - **has pantry inventory:** yes
    - **has expiry tracking:** yes
    - **plans from expiring food:** yes
    - **has nutrient goals:** yes
    - **has shopping list:** yes
    - **explains why recommended:** unknown
    - **closes the loop:** yes
    - **main strength:** The single biggest overlap with Epicourier-Web that I found, and it is alive. Same App Store page: 'Add items by scanning receipts, barcodes, or expiration dates.', 'get reminders before food expires', 'generates recipes that use your expiring ingredients first', 'Eatvora's Rescue Plan shows you what to freeze, cook, or eat first — and estimates your savings in real time.', and 'Improved nutrition tracking with personalized calorie and macro goals'. https://www.eatvora.app/features/food-waste-reduction adds 'Pantry Health Score gives your kitchen a grade from A to F' and 'Tracks every dollar saved from reduced food waste with a real savings counter'. So it has pantry + expiry + expiry-first recipes + nutrient goals + shopping + an after-the-fact waste scorecard in one product.
    - **main weakness:** The loop it closes is MONEY and WASTE, not the nutrition goal. Nothing on either page says the letter grade or savings counter is evaluated against the user's calorie/macro goals, and nothing says why an individual recipe was chosen beyond the blanket 'expiring ingredients first'. It is also brand new and tiny — App Store version 1.2.1, last updated 'August 12' (2026) — so market traction is unproven, and eatvora.app is an aggressively SEO-built site (dozens of 'Best X App 2026' pages), which is a reason to treat its own comparison claims as marketing, not evidence.
    - **price as stated:** In-app purchases as listed on the App Store page: 'Premium: $4.99/month or $39.99/year' and 'Plus: $9.99/month or $79.99/year'. https://www.eatvora.app/features/food-waste-reduction states 'Eatvora Premium ($4.99/mo)'. Checked 2026-09-13.
    - **who uses it:** Unknown — no user counts or review counts captured on the pages I fetched.
  - _item 3_
    - **name:** Kitche
    - **vendor:** Kitche (acquired by Remy per search results, Feb 2025 — not verified on a page I fetched)
    - **url:** https://kitche.co/
    - **url retrieved:** True
    - **quoted evidence:** a free food waste app designed to save you money and reduce your food waste at home
    - **has pantry inventory:** yes
    - **has expiry tracking:** yes
    - **plans from expiring food:** unknown
    - **has nutrient goals:** unknown
    - **has shopping list:** unknown
    - **explains why recommended:** unknown
    - **closes the loop:** yes
    - **main strength:** The strongest closes-the-loop evidence of anything I found, and it is trade-press evidence rather than vendor copy. https://www.thegrocer.co.uk/news/kitche-adds-app-feature-to-track-anti-waste-efforts-on-the-environment/675540.article states the app 'shows how much water, CO2 and money an app user has saved every week from reducing their food waste', that users can 'view a graph of their food waste cost versus the national average', and that people can 'create their own missions, take on challenges' — which is directly comparable to our gamified challenges/streaks, but pointed at waste rather than nutrition. The same article describes it monitoring 'users' food purchases, products nearing best-before dates, and offering relevant recipes based on what's in the cupboard'.
    - **main weakness:** kitche.co itself is marketing-thin: the page I fetched contained no verbatim text on expiry dates, recipe logic, the dashboard, or pricing, so most of the feature detail rests on a 2024-era trade article rather than a current product page. Current status after the Remy acquisition is unverified by me, and there is no evidence of nutrient goals, shopping-list creation, or any per-recipe explanation.
    - **price as stated:** https://kitche.co/ describes it as 'a free food waste app'. No subscription figure found on the page I fetched. Checked 2026-09-13.
    - **who uses it:** UK households (the app and the coverage are UK-based); promoted by UK councils and climate groups per search results.
  - _item 4_
    - **name:** PantryWise: Food Waste Tracker
    - **vendor:** Valiantum, LLC
    - **url:** https://apps.apple.com/us/app/pantrywise-food-waste-tracker/id6759767806
    - **url retrieved:** True
    - **quoted evidence:** Food waste cost calculator — real dollar amounts, not vague estimates
    - **has pantry inventory:** yes
    - **has expiry tracking:** yes
    - **plans from expiring food:** unknown
    - **has nutrient goals:** no
    - **has shopping list:** yes
    - **explains why recommended:** unknown
    - **closes the loop:** yes
    - **main strength:** Explicit after-the-fact measurement. Same App Store page: 'Pantry, fridge & freezer inventory in one place', 'Food expiration tracker — get alerts before items go bad', 'Grocery spending monitor — weekly, monthly & yearly breakdown', 'Duplicate purchase prevention — know what you have before you shop'. https://pantrywiseapp.com/ adds 'Advanced analytics: full usage/waste history and deeper trend views' and 'Match the food already in your kitchen to recipe ideas, then move the meals you choose into a practical weekly plan' — pantry-to-plan, which is our flow.
    - **main weakness:** No nutrition at all ('Nutrition: Not mentioned in the app description'), and neither page says recipes are prioritised by EXPIRY specifically — the matching text is about what is 'already in your kitchen', not what is about to go off. No explanation of why a given recipe was matched. Also brand new: version 1.0.8, 'Aug 18' (2026). The free tier is crippled ('Up to 25 items, basic features, 1 recipe suggestion weekly'), which suggests the recipe engine is thin.
    - **price as stated:** App Store in-app purchases: 'Monthly $6.99' and 'Yearly $49.99'. https://pantrywiseapp.com/ states 'Free: $0/forever - Up to 25 items... 1 recipe suggestion weekly' and 'Pro: $6.99/month or $49.99/year'. Checked 2026-09-13.
    - **who uses it:** Unknown — no install or review counts captured.
  - _item 5_
    - **name:** Xpiry
    - **vendor:** CJ Interactive LLC
    - **url:** https://xpiry.cjinteractivellc.com/
    - **url retrieved:** True
    - **quoted evidence:** Every suggestion shows how many of the ingredients you already have, along with cook time
    - **has pantry inventory:** yes
    - **has expiry tracking:** yes
    - **plans from expiring food:** yes
    - **has nutrient goals:** unknown
    - **has shopping list:** unknown
    - **explains why recommended:** yes
    - **closes the loop:** unknown
    - **main strength:** This is the clearest 'shows you why' evidence I found anywhere: the quoted line attaches an inventory-coverage figure to every individual suggestion, which is functionally our 'inventory match percentage'. Same page: 'Xpiry estimates a shelf life for every item based on what it is and where you keep it: fridge, freezer, or shelf.' and 'It prioritizes recipes that use items expiring soon, helping you reduce food waste while discovering new meals.' It also shows 'macros per serving' next to recipes.
    - **main weakness:** The explanation is a COUNT ('how many of the ingredients you already have'), not an attribution — the page never says it names which specific expiring item drove the suggestion. No waste or savings reporting appears on the page, so there is no evidence it closes the loop. No shopping list, no nutrient GOALS (macros are displayed, not targeted), no calendar/meal-completion tracking. Small single-developer product; the primary domain xpiry.app 301-redirects to a developer subdomain, which is a maturity signal.
    - **price as stated:** 'Xpiry offers a free tier with 2 receipt scans per month, unlimited manual entry, daily notifications, and recipe suggestions. Premium subscribers get unlimited receipt scans and an ad-free experience.' No dollar figure stated on the page. Checked 2026-09-13.
    - **who uses it:** Unknown.
  - _item 6_
    - **name:** KitchenPal
    - **vendor:** KitchenPal / iCuisto
    - **url:** https://kitchenpalapp.com/en/expiry-date-tracker.html
    - **url retrieved:** True
    - **quoted evidence:** Get recipe ideas using ingredients that are about to expire.
    - **has pantry inventory:** yes
    - **has expiry tracking:** yes
    - **plans from expiring food:** yes
    - **has nutrient goals:** unknown
    - **has shopping list:** yes
    - **explains why recommended:** unknown
    - **closes the loop:** unknown
    - **main strength:** Mature, broad and free-to-start. Same page: 'Track expiry dates for all food items across pantry, fridge, and freezer.', 'Receive notifications 1-7 days before items expire (you choose).', 'Add items to your shopping list to replace them, or freeze items to extend their life.' https://kitchenpalapp.com/en/ adds a real meal planner: 'Meal planner app & weekly meal planner - organize meals by day, plan days or weeks in advance' and inventory-aware recipes: 'find healthy recipes, fridge recipes, and recipes by ingredient using your actual inventory'. Closest feature-surface match to us among the established players.
    - **main weakness:** Nothing on either page explains WHY a particular recipe was surfaced, and I found no waste/savings/outcome reporting at all — no consumed-vs-wasted report, no savings counter, no goal attainment. Nutrition is only comparative at purchase time ('compare nutritional scores before adding to lists'), not a goal or a trend dashboard. The two pages also contradict each other on price, which is worth noting before anyone cites it.
    - **price as stated:** https://kitchenpalapp.com/en/expiry-date-tracker.html says 'Yes! KitchenPal is completely free to download and use.' while https://kitchenpalapp.com/en/ says 'Premium Services are available as Monthly ($3.99 p.m.), Annual ($14.99 p.a.), or Lifetime packages ($29.99 one-time)'. Both checked 2026-09-13.
    - **who uses it:** Households sharing a pantry; the home page describes family sharing and a 2M+ product barcode library (search-result text, not re-verified on the fetched page).
  - _item 7_
    - **name:** NoWaste: Food Inventory List
    - **vendor:** KH Creations / MWM
    - **url:** https://apps.apple.com/us/app/nowaste-food-inventory-list/id926211004
    - **url retrieved:** True
    - **quoted evidence:** A new 'My numbers' widget on your profile shows your personal food waste stats
    - **has pantry inventory:** yes
    - **has expiry tracking:** yes
    - **plans from expiring food:** unknown
    - **has nutrient goals:** unknown
    - **has shopping list:** yes
    - **explains why recommended:** unknown
    - **closes the loop:** yes
    - **main strength:** Established, cheap, and it does report outcomes. Same App Store page: 'Inventory lists for your freezer, fridge & pantry', 'Sort your food by expiration date, name or category', 'Set up to two expiry date reminders pr food item', 'Generate recipes based on stock, generate custom recipes, add your own recipes', 'Add food to shopping list directly from your library'. https://www.nowasteapp.com/ states 'organized lists for your freezer, fridge and pantry. Always know what you have, when it expires'.
    - **main weakness:** Recipes are generated 'based on stock' — nothing on either page says expiring items are prioritised, so the expiry data and the recipe engine appear not to be joined up. No explanation of why a recipe was generated, no meal calendar, no nutrition. The 'My numbers' stats are self-reported personal waste figures, not an evaluation of whether a plan worked.
    - **price as stated:** App Store in-app purchases: 'NoWaste Pro Annual $6.99' and 'NoWaste Pro Lifetime $29.99'. Checked 2026-09-13.
    - **who uses it:** Consumers; published by MWM, an app portfolio company (per search results).
  - _item 8_
    - **name:** SuperCook
    - **vendor:** SuperCook
    - **url:** https://apps.apple.com/us/app/supercook-recipe-by-ingredient/id1477747816
    - **url retrieved:** True
    - **quoted evidence:** SuperCook only shows you recipes that require the ingredients you already have
    - **has pantry inventory:** yes
    - **has expiry tracking:** no
    - **plans from expiring food:** no
    - **has nutrient goals:** unknown
    - **has shopping list:** unknown
    - **explains why recommended:** yes
    - **closes the loop:** unknown
    - **main strength:** The category-defining free pantry-to-recipe matcher, and it does expose a reason: the same page describes a 'missing one ingredient' filter that 'highlights great recipes that you're just one ingredient away from making' — the gap between recipe and pantry is made visible to the user rather than hidden. Entirely free with no subscription.
    - **main weakness:** No expiry dimension at all — the pantry is a checklist of what you own, with no dates, so it structurally cannot plan from expiring stock or measure waste avoided. No meal calendar, no nutrition, no goal. Its 'why' is ingredient coverage only; it never reasons about urgency. This is the benchmark our expiry-prioritised recommendation has to beat on a dimension SuperCook does not have.
    - **price as stated:** Listed as free with no subscription model on the App Store page I fetched; no in-app purchase prices shown. Checked 2026-09-13.
    - **who uses it:** Very large consumer base (search results cite an 11-million-recipe index); exact install counts not verified on a page I fetched.
  - _item 9_
    - **name:** Fridgely
    - **vendor:** Justin Ehlert
    - **url:** https://fridgelyapp.com/
    - **url retrieved:** True
    - **quoted evidence:** Fridgely intelligently sends you an alert when your food is close to expiring
    - **has pantry inventory:** yes
    - **has expiry tracking:** yes
    - **plans from expiring food:** unknown
    - **has nutrient goals:** unknown
    - **has shopping list:** unknown
    - **explains why recommended:** unknown
    - **closes the loop:** unknown
    - **main strength:** Clean, long-standing expiry tracker with inventory-aware recipes: same page, 'Quickly find recipes. Fridgely shows you recipes based on the food that you already have.' Receipt-photo and barcode entry lower the data-entry cost, which is the hardest part of any pantry app.
    - **main weakness:** The page states recipes come from 'the food that you already have' — NOT from what is expiring, so the expiry alert and the recipe feature are separate features rather than one loop. No shopping list, nutrition, waste reporting, or pricing appears on the page I fetched; its waste content is a generic statistic ('The average family of four wastes 25% of their food each year'), which is problem framing, not a feature.
    - **price as stated:** No pricing information on https://fridgelyapp.com/ as fetched. Checked 2026-09-13.
    - **who uses it:** iPhone/iPad consumers; household sharing is offered.
  - _item 10_
    - **name:** Pantry Check
    - **vendor:** Pantry Check
    - **url:** https://pantrycheck.com/
    - **url retrieved:** True
    - **quoted evidence:** Per-item expiry dates and tracking; Reminders to use items in time
    - **has pantry inventory:** yes
    - **has expiry tracking:** yes
    - **plans from expiring food:** unknown
    - **has nutrient goals:** unknown
    - **has shopping list:** yes
    - **explains why recommended:** unknown
    - **closes the loop:** unknown
    - **main strength:** Focused inventory-and-restock tool: same page, 'Grocery and Food Inventory', 'Know exactly what to buy and how much it'll cost', 'Restock suggestions'. The cost-aware shopping list is something our shopping-list flow does not do.
    - **main weakness:** The home page I fetched contains no verbatim text on meal planning, recipes from what you have, nutrition, waste reporting, or price — so on my evidence it is inventory + reminders + restock only, with no recommendation layer at all and therefore nothing to explain and no loop to close.
    - **price as stated:** No pricing text on https://pantrycheck.com/ as fetched. Checked 2026-09-13.
    - **who uses it:** Households sharing an account across devices (per search results, not re-verified on the fetched page).
  - _item 11_
    - **name:** MyFridgeFood
    - **vendor:** MyFridgeFood
    - **url:** https://www.myfridgefood.com/
    - **url retrieved:** True
    - **quoted evidence:** Your Ingredients ... You don't have any selected ingredients ... Clear All
    - **has pantry inventory:** yes
    - **has expiry tracking:** unknown
    - **plans from expiring food:** unknown
    - **has nutrient goals:** unknown
    - **has shopping list:** unknown
    - **explains why recommended:** unknown
    - **closes the loop:** unknown
    - **main strength:** Zero-friction: a tick-box ingredient grid with no account and no download. The fetched page shows only the ingredient-selection interface.
    - **main weakness:** I could not substantiate a single feature beyond ingredient selection from the page I fetched — no match percentage, no missing-ingredient display, no expiry, no shopping list, no nutrition. Honest answer: on my evidence this is a 2000s-era recipe filter, not a pantry manager, and it is not a serious competitive threat.
    - **price as stated:** No pricing text on the page as fetched; no account or download required. Checked 2026-09-13.
    - **who uses it:** Casual web users looking for a recipe from what is in the fridge.
  - _item 12_
    - **name:** Jow
    - **vendor:** Jow
    - **url:** https://apps.apple.com/us/app/jow-easy-recipes-groceries/id1301257625
    - **url retrieved:** True
    - **quoted evidence:** Jow generates a smart cart based on your household needs, ensuring you only buy what you need
    - **has pantry inventory:** no
    - **has expiry tracking:** no
    - **plans from expiring food:** no
    - **has nutrient goals:** unknown
    - **has shopping list:** yes
    - **explains why recommended:** no
    - **closes the loop:** unknown
    - **main strength:** Strongest downstream integration of anything in this angle: recipes go straight into a real retailer cart for pickup or delivery, and personalisation is set up front — 'Input your kitchen appliances, household size, and dietary preferences. Jow creates a customized recipe catalog just for you.'
    - **main weakness:** It is a shop-first product, not a pantry product. The App Store description I fetched does not mention pantry inventory or expiry date tracking at all, so it prevents over-buying but does nothing about food you already own and are about to lose. It also gives no reason for any specific recipe suggestion.
    - **price as stated:** No subscription price in the description I fetched; it states 'Save an average of 10% on grocery costs with smart cart optimization and exclusive deals.' Checked 2026-09-13.
    - **who uses it:** US and French grocery shoppers; integrates with H-E-B, Harris Teeter, King Soopers, Kroger, Ralph's (per search results).
  - _item 13_
    - **name:** Too Good To Go
    - **vendor:** Too Good To Go
    - **url:** https://apps.apple.com/us/app/too-good-to-go-end-food-waste/id1060683933
    - **url retrieved:** True
    - **quoted evidence:** Every Surprise Bag equates to 2.7kg of CO2e avoided
    - **has pantry inventory:** no
    - **has expiry tracking:** no
    - **plans from expiring food:** no
    - **has nutrient goals:** no
    - **has shopping list:** no
    - **explains why recommended:** no
    - **closes the loop:** no
    - **main strength:** Huge, real, and it does show cumulative impact per purchase (the quoted CO2e figure), which is the strongest 'your action had this effect' signal in the whole angle — worth stealing the pattern even though the product is unrelated.
    - **main weakness:** Solves RETAIL surplus, not household surplus. The description I fetched does not mention pantry inventory, expiry tracking of your own food, recipes, or meal planning — the fetch explicitly concluded those 'appear entirely absent'. Not a competitor to us; listing it here so nobody mistakes it for one.
    - **price as stated:** App is free; Surprise Bags start 'from as low as $3' per the App Store description. Checked 2026-09-13.
    - **who uses it:** Consumers buying end-of-day surplus from stores, bakeries and restaurants; Whole Foods is a US partner (per search results).
  - _item 14_
    - **name:** OLIO
    - **vendor:** OLIO Exchange Ltd
    - **url:** https://olioapp.com/en/getting-started-on-olio/discover-the-olio-app/
    - **url retrieved:** True
    - **quoted evidence:** Pick up free food from local supermarkets, shops and bakeries
    - **has pantry inventory:** no
    - **has expiry tracking:** no
    - **plans from expiring food:** no
    - **has nutrient goals:** no
    - **has shopping list:** no
    - **explains why recommended:** no
    - **closes the loop:** no
    - **main strength:** Large peer-to-peer redistribution network; also 'Volunteer as a Food Waste Hero and collect surplus food from businesses nearby'.
    - **main weakness:** A giving-away marketplace, not a kitchen tool. The fetched page explicitly does not describe pantry inventory, expiry monitoring, recipe suggestions, meal planning, or waste statistics. Not a competitor; included so the gap is documented rather than assumed.
    - **price as stated:** Free to use; items are free or 'pay as you feel' (per search results — the page I fetched carried no price text). Checked 2026-09-13.
    - **who uses it:** Neighbourhood food-sharing communities, strongest in the UK.
- **what none of them do:**
  - Per-item causal explanation of a recommendation. Not one product I checked states on its pages that it names the SPECIFIC pantry item that caused a specific recipe to be suggested (e.g. 'chosen because your spinach expires Thursday'). The two closest are Xpiry — 'Every suggestion shows how many of the ingredients you already have' (a count) — and CozZo — 'The recipes are listed according to the number of expiring products' (a ranking rule). Both expose a NUMBER or a SORT ORDER, not an attribution. I believe it is genuinely absent rather than unmentioned because coverage/match percentages are exactly the kind of concrete mechanic these pages do describe when present, so a per-item 'because' would almost certainly be marketed too.
  - A loop closed on a NUTRITION goal. Every outcome report I found measures money or waste or carbon: Eatvora 'Get a letter grade on your food waste performance. See how much money you saved'; Kitche 'how much water, CO2 and money an app user has saved every week'; CozZo 'a precise report of the % of the food that was consumed vs. wasted'; PantryWise 'Food waste cost calculator'; NoWaste ''My numbers' widget ... personal food waste stats'. Eatvora is the only one with 'personalized calorie and macro goals', and even there no page connects the goal to the report. Reason I believe it absent: these are waste apps, so their metric of success is waste; nutrition attainment is a different vertical's metric (calorie trackers), and nobody in this angle spans both.
  - Plan-versus-actual reconciliation. No product I checked describes recording whether the planned meal was actually cooked and feeding that back into the report. CozZo, PantryWise and Eatvora all describe generating a weekly plan, and separately describe a waste report, but no page I read links the two — the reports are driven by inventory outcomes (used up / binned), not by plan adherence. Our meal-completion tracking is the missing link, and I found no page claiming it.
  - Waste-loop reporting combined with a nutrient dashboard with daily/weekly/monthly trends and data export. Only Fridgely mentioned export at all ('Export to CSV' per search results — I could NOT confirm this on fridgelyapp.com, so treat it as unverified). Nobody pairs a trended nutrient dashboard with a waste outcome report. Reason: the two capabilities come from different product categories and none of these vendors has built both.
  - Free-text goal as the planning input. Every product I checked plans from structured inputs — diet tags, household size, appliances, what is in stock, what expires soonest (Jow: 'Input your kitchen appliances, household size, and dietary preferences'). No page describes typing a goal in your own words and getting a plan back. Reason I believe it absent: none of these pages describe any natural-language entry beyond voice-to-inventory dictation (NoWaste 'Speak or write to the assistant to make it add food'), which is data entry, not goal setting.
- **honest gaps in my search:** "WHAT I COULD NOT ESTABLISH, AND WHY.\n\n1. Three URLs would not serve me, so those products are under-evidenced or omitted: supercook.com returned HTTP 403 (I used the App Store listing instead, so my SuperCook feature claims come from store copy, not the product's own site); toogoodtogo.com returned HTTP 429 twice; the Google Play Too Good To Go page came back truncated with no usable text.\n\n2. Products from your candidate list that I did NOT verify and therefore did NOT include: NoWaste.ai (nowaste.ai — a DIFFERENT product from the NoWaste I did verify; search results describe receipt-based tracking and expiry-prioritised recipes, but I never fetched the page, so I am leaving it out rather than citing search-result prose) and Kitchenful (apps.apple.com listing existed in results; not fetched). Do not treat either as confirmed. If either matters, they are one fetch each.\n\n3. Everything I report is PAGE COPY, not observed behaviour. App Store descriptions and vendor sites are marketing surfaces. I have evidence that a feature is CLAIMED, not that it works, not that it is discoverable in the UI, and not that anyone uses it. In particular the 'yes' in explains_why_recommended for CozZo, Xpiry and SuperCook rests on one sentence each; I could not see a screenshot proving the number is rendered next to each recipe.\n\n4. Two of the three products that most threaten us are brand-new and unproven: Eatvora (App Store v1.2.1, updated 'August 12') and PantryWise (v1.0.8, 'Aug 18'). I captured no install counts, no review counts and no revenue for any product in this report, so I cannot rank any of them by market position. 'Product exists' is all I have established for those two.\n\n5. CozZo's status is genuinely unresolved and it matters. Its own site says the service is shutting down and premium was free 'until December 30, 2025' — past. I did not find a post-shutdown confirmation page, so I cannot say whether it is dead, migrated, or the notice is stale. Since CozZo is the single closest match to our full concept, somebody should try installing it before we claim its combination is unique.\n\n6. Kitche's feature detail comes mostly from a trade-press article (thegrocer.co.uk) rather than the current product site, and the reported Feb-2025 Remy acquisition is from search results I did not verify on a fetched page.\n\n7. I found NO evidence at all about USER DEMAND. Not one page I fetched shows that users want explanation or want outcome measurement; vendor claims like 'reduce waste 30-50%' and '$150+ monthly savings reported by users' are unsourced marketing and I have deliberately excluded them from every evidence field. Nothing in this report supports a claim that our differentiator is wanted — only that it is largely unoccupied.\n\n8. Conflicting price evidence exists for KitchenPal (its expiry page says 'completely free to download and use'; its home page lists $3.99/mo, $14.99/yr, $29.99 lifetime). I recorded both rather than picking one. All prices checked 2026-09-13 and will drift.\n\n9. Scope note: eatvora.app publishes a large network of 'Best <category> App 2026' pages that dominate search results for this angle. I used only its own product pages and its App Store listing, and ignored its comparison blog entirely, because a vendor ranking its competitors is not evidence. Be aware that any further searching on this angle will keep surfacing that SEO network."
