# sweep:direct-planners

**Workflow:** P1b Claude market survey (run 1)  
**Phase:** Sweep  
**Model:** Claude Opus 5 (1M context), `claude-opus-5[1m]`  
**Agent id:** `af6b69006c470fea4`  
**Tool calls:** 42 total — 13 web searches, 27 pages fetched  
**Raw transcript:** `raw/agent-af6b69006c470fea4.jsonl` (full tool-call trace, retained)

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
Search angle: DIRECT RIVALS — consumer meal-planning apps and web services whose core
job is "plan meals, get a grocery list". Candidates worth checking (check them, do not assume):
Mealime, Plan to Eat, Paprika Recipe Manager, Eat This Much, PlateJoy, SideChef, Samsung Food
(formerly Whisk), Prepear, AnyList, Yummly. Find the ten closest to our product.

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

- `Mealime meal planning app grocery list features`
- `Plan to Eat meal planner pantry inventory shopping list`
- `Samsung Food app pantry expiring ingredients meal plan`
- `"Eat This Much" automatic meal planner nutrition goals macros`
- `Plan to Eat "staples" pantry feature how it works shopping list already have`
- `app that suggests recipes based on food expiring soon fridge inventory reduce food waste 2026`
- `Yummly app shut down discontinued Whirlpool`
- `PlateJoy meal planning service 2026 still available shut down`
- `meal planning app shows "why this recipe was recommended" explanation reason suggested`
- `meal planning app tracks food waste reduced money saved dashboard "how much you saved"`
- `Eatvora app app store pantry expiry tracker reviews`
- `"Eat This Much" virtual pantry "use it up" help article how pantry works`
- `Kitche app uses up food you already have recipe suggestions savings tracker`

## Pages actually fetched

- https://www.mealime.com/   — asked: Quote exact sentences from this page about: meal planning, grocery/shopping list generation, pantry inventory,
- https://www.plantoeat.com/   — asked: Quote exact sentences from this page about: meal planning calendar, automatic grocery/shopping list, pantry or
- https://www.plantoeat.com/pages/features/   — asked: List every feature described, with verbatim quotes. Especially look for: pantry/staples inventory, "what you h
- https://samsungfood.com/   — asked: Quote exact sentences about: meal planning, shopping list, pantry/fridge inventory, expiring or expiration of 
- https://www.samsung.com/us/home-appliances/samsung-food/   — asked: Quote exact sentences about: meal planning, shopping list, pantry or fridge inventory, expiring food / expirat
- https://learn.plantoeat.com/help/the-staples-list   — asked: Quote verbatim what the Staples List is and does. Does it track expiration dates? Does it automatically subtra
- https://play.google.com/store/apps/details?id=com.foodient.whisk&hl=en_US   — asked: Quote the app description verbatim, especially anything about: pantry, fridge inventory, expiring food, food w
- https://apps.apple.com/us/app/samsung-food-meal-planner/id1133637674   — asked: Quote the app description verbatim. Look specifically for: pantry, fridge inventory, expiring food, food waste
- https://www.eatthismuch.com/   — asked: Quote exact sentences about: automatic meal plan generation, calorie/macro/nutrient targets, grocery list, pan
- https://www.eatthismuch.com/features/   — asked: Quote verbatim everything about the virtual pantry, using up ingredients you own, grocery list, nutrient targe
- https://www.paprikaapp.com/   — asked: Quote verbatim all feature descriptions, especially: pantry, grocery list, meal planner, nutrition, expiration
- https://www.anylist.com/   — asked: Quote verbatim all feature descriptions, especially: grocery/shopping list, meal planning calendar, pantry or 
- https://www.platejoy.com/   — asked: Quote verbatim everything about: personalized meal plans, how plans are personalized, grocery list, pantry/inv
- https://www.paprikaapp.com/help/ios/   — asked: Quote verbatim the Pantry section: what it tracks, does it track expiration dates, does it link to grocery lis
- https://ohapotato.app/features/   — asked: Quote verbatim: features about pantry/inventory, expiry dates, meal planning from expiring food, shopping list
- https://cozzo.app/   — asked: Quote verbatim: features about food inventory, expiry date tracking, meal planning, shopping list, recipes fro
- https://www.sidechef.com/   — asked: Quote verbatim: features about meal planning, shopping list, pantry/inventory, expiring food, nutrition goals,
- https://www.prepear.com/   — asked: Quote verbatim: features about meal planning calendar, shopping list, pantry/inventory, expiration, nutrition,
- https://www.eatthismuch.com/app/pricing   — asked: Quote the exact prices and plan names verbatim as shown on the page.
- https://kitchenpalapp.com/en/expiry-date-tracker.html   — asked: Quote verbatim: what it tracks, expiry dates, recipe suggestions from expiring items, shopping list, meal plan
- https://www.mealime.com/pricing   — asked: Quote verbatim the plan names and exact prices, and what each plan includes (especially nutrition, pantry).
- https://www.eatvora.app/features/food-waste-reduction   — asked: Quote verbatim: expiry tracking, recipes generated from expiring items, savings/waste dashboard, meal planning
- https://www.mealime.com/closing   — asked: Quote verbatim the shutdown announcement: exact dates, what happens to accounts and subscriptions.
- https://apps.apple.com/us/app/eatvora/id6759806556   — asked: Quote verbatim the app description and the in-app purchase prices exactly as listed. Look for pantry, expiry, 
- https://www.samsung.com/us/support/answer/ANS10006833/   — asked: Quote verbatim anything about tracking food expiration dates in the fridge, pantry/inventory, and recipe recom
- https://help.eatthismuch.com/help/how-does-the-pantry-system-work   — asked: Quote verbatim the whole article. Especially: what the pantry tracks, whether expiration dates are tracked, an
- https://kitche.co/the-app/   — asked: Quote verbatim: what the app tracks, expiry/use-by dates, recipe suggestions from what you have, meal planning

## Response

- **angle:** DIRECT RIVALS — consumer meal-planning apps and web services whose core job is "plan meals, get a grocery list." Assigned candidate list checked in full (Mealime, Plan to Eat, Paprika, Eat This Much, PlateJoy, SideChef, Samsung Food, Prepear, AnyList, Yummly), plus adjacent pantry/waste planners pulled in because they sit closer to our expiry-driven differentiators than most of the assigned list does.
- **searches run:**
  - Mealime meal planning app grocery list features
  - Plan to Eat meal planner pantry inventory shopping list
  - Samsung Food app pantry expiring ingredients meal plan
  - "Eat This Much" automatic meal planner nutrition goals macros
  - Plan to Eat "staples" pantry feature how it works shopping list already have
  - app that suggests recipes based on food expiring soon fridge inventory reduce food waste 2026
  - Yummly app shut down discontinued Whirlpool
  - PlateJoy meal planning service 2026 still available shut down
  - meal planning app shows "why this recipe was recommended" explanation reason suggested
  - meal planning app tracks food waste reduced money saved dashboard "how much you saved"
  - Eatvora app app store pantry expiry tracker reviews
  - "Eat This Much" virtual pantry "use it up" help article how pantry works
  - Kitche app uses up food you already have recipe suggestions savings tracker
- **rivals:**
  - _item 1_
    - **name:** Mealime
    - **vendor:** Mealime Meals Inc. (Albertsons Companies)
    - **url:** https://www.mealime.com/closing
    - **url retrieved:** True
    - **quoted evidence:** Mealime will be discontinued as of October 21, 2026.
    - **main strength:** Fast weekly planning with an auto-sorted grocery list; homepage says "Grocery shop once per week with an organized, 'done for you' shopping list." (https://www.mealime.com/, retrieved 2026-09-13).
    - **main weakness:** It is being shut down. The vendor's own /closing page announces discontinuation on 2026-10-21 and says "Pro subscribers will not be charged any additional subscription fees"; users are pointed to Albertsons' Meals Hub. Treat it as a departing rival, not a live benchmark.
    - **price as stated:** Homepage states "It's Free" and "Join over 4,500,000 others for free today." The /closing page says Pro subscribers will not be charged further before 2026-10-21. Checked on 2026-09-13.
    - **who uses it:** Homepage claims "over 4,500,000" users; general home cooks wanting quick weeknight dinners.
    - **has pantry inventory:** unknown
    - **has expiry tracking:** unknown
    - **plans from expiring food:** unknown
    - **has nutrient goals:** unknown
    - **has shopping list:** yes
    - **explains why recommended:** unknown
    - **closes the loop:** unknown
  - _item 2_
    - **name:** Plan to Eat
    - **vendor:** Plan to Eat, LLC
    - **url:** https://www.plantoeat.com/
    - **url retrieved:** True
    - **quoted evidence:** When you add recipes to your calendar, the shopping list will automatically populate an organized list of ingredients
    - **main strength:** The calendar-to-shopping-list pipeline is the most mature of anything I retrieved: "The meal planning calendar lets you plan ahead for any length of time, save meal plans to reuse in the future" (same URL).
    - **main weakness:** Its pantry analogue is deliberately dumb. Their own help page says "The Staples List is a static list where you can take inventory and store items you purchase frequently" and that "Manually added items will remain on your shopping list, regardless of the date range" — no quantities-driven deduction, no dates, no planning from it (https://learn.plantoeat.com/help/the-staples-list, retrieved 2026-09-13).
    - **price as stated:** "Only $5.95/mo or $49/year if you choose to subscribe." (https://www.plantoeat.com/, checked on 2026-09-13)
    - **who uses it:** Recipe-hoarding home cooks who import from blogs and want one weekly shop.
    - **has pantry inventory:** yes
    - **has expiry tracking:** unknown
    - **plans from expiring food:** unknown
    - **has nutrient goals:** unknown
    - **has shopping list:** yes
    - **explains why recommended:** unknown
    - **closes the loop:** unknown
  - _item 3_
    - **name:** Paprika Recipe Manager 3
    - **vendor:** Hindsight Labs LLC
    - **url:** https://www.paprikaapp.com/help/ios/
    - **url retrieved:** True
    - **quoted evidence:** the quantity, purchase date, expiration date, and whether it is in stock or out of stock
    - **main strength:** This is the closest thing to our inventory module in the assigned rival set, and the only one on that list with per-item expiration dates plus a pantry-aware list: "Ingredients placed in your pantry will automatically be unchecked when you add recipes or meal plans to your grocery list" (same URL). Homepage adds "Keep track of your groceries and what you have on hand" (https://www.paprikaapp.com/).
    - **main weakness:** It stores dates but does nothing with them. I read the complete Pantry section of the iOS help and it describes only quantity/dates/stock status and a "Move to Grocery List" action — no recipe suggestion, no expiry colour-coding, no ranking by urgency. Paprika has no recommender at all, so there is nothing to explain and no outcome to measure.
    - **price as stated:** Not stated on either page I retrieved; the site says each platform version is sold separately without giving figures. Checked on 2026-09-13.
    - **who uses it:** Power users who want a local/offline recipe database across iOS, Mac, Android and Windows.
    - **has pantry inventory:** yes
    - **has expiry tracking:** yes
    - **plans from expiring food:** no
    - **has nutrient goals:** unknown
    - **has shopping list:** yes
    - **explains why recommended:** unknown
    - **closes the loop:** unknown
  - _item 4_
    - **name:** Eat This Much
    - **vendor:** Eat This Much, Inc.
    - **url:** https://www.eatthismuch.com/
    - **url retrieved:** True
    - **quoted evidence:** Add what you already own to the virtual pantry and our algorithms will use it up with priority.
    - **main strength:** The only assigned rival that generates plans FROM inventory against nutrient targets in one loop. Homepage shows explicit targets — "At least 90g Carbs, At least 40g Fat, At least 90g Protein" and "Want to set specific macro targets?" — plus "Review your meals for the week and the grocery list automatically updates." Their help doc confirms the mechanism: the pantry "tracks what foods you already have on hand and how much you should have left based on your meal plans" and "The meal planner will prioritize using any leftovers you have on hand to reduce food waste" (https://help.eatthismuch.com/help/how-does-the-pantry-system-work, retrieved 2026-09-13).
    - **main weakness:** The prioritisation is invisible and undated. The full pantry help article never mentions expiration dates — items are removed based on when the plan says you should have eaten them, not on shelf life. And the user is never told which pantry item drove a given meal; the "use it up with priority" policy is stated once in marketing and never surfaced per recipe.
    - **price as stated:** Could not capture. https://www.eatthismuch.com/app/pricing returned only "Eat This Much uses features that your browser does not support" — the page is JavaScript-only. Checked on 2026-09-13.
    - **who uses it:** Macro-tracking lifters, cutters and bulkers; CNN Underscored ranked it #1 meal planning app (third-party claim, not fetched from vendor).
    - **has pantry inventory:** yes
    - **has expiry tracking:** no
    - **plans from expiring food:** no
    - **has nutrient goals:** yes
    - **has shopping list:** yes
    - **explains why recommended:** unknown
    - **closes the loop:** unknown
  - _item 5_
    - **name:** Samsung Food (formerly Whisk)
    - **vendor:** Samsung Electronics
    - **url:** https://apps.apple.com/us/app/samsung-food-meal-planner/id1133637674
    - **url retrieved:** True
    - **quoted evidence:** Plan your weekly meals, turn them into smart shopping lists, and share them with friends or family.
    - **main strength:** Largest catalogue plus goal-linked nutrition of anything I retrieved: "Access detailed nutrition information and health scores on over 218,500 recipes" and, for Food+, "Nutrition tracking with adaptive meal plans to help you meet your goals" (same URL). Also "AI-personalized weekly meal plans tailored to your health goals."
    - **main weakness:** Pantry and expiry are marketing adjacency, not documented behaviour. The App Store description does not mention pantry or fridge inventory at all; samsungfood.com returned HTTP 403 so I could not check the vendor's own feature page; and Samsung's Family Hub support page only says the Meal Planner "allows you to select dietary preferences and ingredients you enjoy" — expiry tracking there is tied to the physical fridge's View Inside, not to the app (https://www.samsung.com/us/support/answer/ANS10006833/, retrieved 2026-09-13). Its "health scores" are also not the same as a sustainability score.
    - **price as stated:** App Store listing shows Samsung Food+ at $6.99 monthly and $59.99 yearly; free tier exists. Checked on 2026-09-13.
    - **who uses it:** Broad consumer base; Samsung appliance owners; grocery-delivery shoppers (listing cites 23 retailers across 4 regions).
    - **has pantry inventory:** unknown
    - **has expiry tracking:** unknown
    - **plans from expiring food:** unknown
    - **has nutrient goals:** yes
    - **has shopping list:** yes
    - **explains why recommended:** unknown
    - **closes the loop:** unknown
  - _item 6_
    - **name:** AnyList
    - **vendor:** Purple Cover, Inc.
    - **url:** https://www.anylist.com/
    - **url retrieved:** True
    - **quoted evidence:** Plan your meals for the coming weeks on a calendar, then easily add ingredients for upcoming recipes
    - **main strength:** Best-in-class shared list mechanics — "Any changes made to a shared list will show up instantly to everyone sharing the list" and it "suggests common items as you type, and automatically groups items by category" (same URL). Household sync is a feature we do not have.
    - **main weakness:** It is a list app with a recipe box bolted on. The homepage describes no pantry, no expiry, no nutrition and no recommendation of any kind — there is nothing in it that would explain a suggestion or measure an outcome.
    - **price as stated:** Not stated on the page I retrieved; "AnyList Complete" premium tier is described by feature only, with no figures shown. Checked on 2026-09-13.
    - **who uses it:** Couples and families running a shared grocery list; Siri users.
    - **has pantry inventory:** unknown
    - **has expiry tracking:** unknown
    - **plans from expiring food:** unknown
    - **has nutrient goals:** unknown
    - **has shopping list:** yes
    - **explains why recommended:** unknown
    - **closes the loop:** unknown
  - _item 7_
    - **name:** SideChef
    - **vendor:** SideChef Group Limited
    - **url:** https://www.sidechef.com/
    - **url retrieved:** True
    - **quoted evidence:** order all the ingredients of any recipe on SideChef in just one click
    - **main strength:** Shopping list terminates in an actual transaction — Walmart delivery/pickup with "update serving sizes, swap for your favorite brands, add or remove items" at checkout (same URL). Our shopping list stops at a checkbox.
    - **main weakness:** The page describes "Personalize Your Plan" and a "Personalized Meal Plan" but never says what the personalisation reads from or how it decides — that is a marketing adjective, not a behaviour. No pantry, expiry or nutrient-goal behaviour described anywhere on the page I retrieved.
    - **price as stated:** Core features described as free; the only price sentence on the page is about groceries, not subscription: "Prices are the same, we do not charge any additional markups." Premium cooking classes sold separately, price not shown. Checked on 2026-09-13.
    - **who uses it:** US Walmart shoppers; step-by-step guided-cooking users.
    - **has pantry inventory:** unknown
    - **has expiry tracking:** unknown
    - **plans from expiring food:** unknown
    - **has nutrient goals:** unknown
    - **has shopping list:** yes
    - **explains why recommended:** unknown
    - **closes the loop:** unknown
  - _item 8_
    - **name:** Prepear
    - **vendor:** Prepear (Super Healthy Kids)
    - **url:** https://www.prepear.com/
    - **url retrieved:** True
    - **quoted evidence:** Prepear automatically creates your grocery list for you.
    - **main strength:** Clean manual meal-plan-to-list flow: "Create Your Own Custom Meal Plans" and "Add your favorite recipes to your Meal Plan in seconds" (same URL).
    - **main weakness:** Thinnest of the direct rivals on everything we care about. The homepage contains no pantry, no expiry, no nutrition, no recommendation and no pricing text at all — it is a manual planner, so there is no recommendation to explain and no goal to measure against.
    - **price as stated:** Not stated anywhere on the page I retrieved. Checked on 2026-09-13.
    - **who uses it:** Family meal planners coming from the Super Healthy Kids audience.
    - **has pantry inventory:** unknown
    - **has expiry tracking:** unknown
    - **plans from expiring food:** unknown
    - **has nutrient goals:** unknown
    - **has shopping list:** yes
    - **explains why recommended:** unknown
    - **closes the loop:** unknown
  - _item 9_
    - **name:** CozZo
    - **vendor:** CozZo
    - **url:** https://cozzo.app/
    - **url retrieved:** True
    - **quoted evidence:** CozZo Journal gives you an up-to-date report of consumed vs. wasted food
    - **main strength:** The single most direct hit on our closes_the_loop column, and it is a full planner too: "Dual-view 'At Home' catalogs give you a digital picture of your fridge, pantry, freezer", "CozZo inventory tracks 'Best By' and 'Use By' dates for all foods", "A versatile meal planner, integrated with CozZo recipes and food inventories", and "CozZo's AI matches imported or homemade recipes to stocked products" (all same URL). The Journal also gives "a detailed monthly product use breakdown." This is essentially our pantry + expiry + planner + waste-outcome stack in one shipped product.
    - **main weakness:** The page I retrieved carries a shutdown notice (premium unlocked free, wind-down referenced with a December 30, 2025 date) — so as of 2026-09-13 this is a dying product. Also, matching recipes to "stocked products" is stock-based, not expiry-ranked, and the Journal reports consumed-vs-wasted at the item level; nothing on the page attributes waste reduction back to a specific meal plan.
    - **price as stated:** No price shown; the page only states premium features are unlocked for free during the wind-down. Checked on 2026-09-13.
    - **who uses it:** Households running a shared fridge/pantry inventory.
    - **has pantry inventory:** yes
    - **has expiry tracking:** yes
    - **plans from expiring food:** unknown
    - **has nutrient goals:** unknown
    - **has shopping list:** yes
    - **explains why recommended:** unknown
    - **closes the loop:** yes
  - _item 10_
    - **name:** Eatvora
    - **vendor:** Zekeria Abdi (App Store developer of record)
    - **url:** https://www.eatvora.app/features/food-waste-reduction
    - **url retrieved:** True
    - **quoted evidence:** Tracks every dollar saved from reduced food waste with a real savings counter
    - **main strength:** Hits BOTH of our priority columns at once and overlaps our differentiators almost exactly. On planning from expiring food: "AI generates recipes from exactly what is in your fridge — before it expires", "Weekly meal planner builds a full week of dinners from your pantry automatically", "Track expiration dates — get alerts before food reaches its use-by or best-before date", and a shop-the-gaps list — "buy only what your meal plan needs that is not in your pantry" (all same URL). App Store listing confirms the mechanism verbatim: "Tell Eatvora what's in your pantry and it generates recipes that use your expiring ingredients first" (https://apps.apple.com/us/app/eatvora/id6759806556, retrieved 2026-09-13). It also ships a "Pantry Health Score gives your kitchen a grade from A to F."
    - **main weakness:** Two caveats. (1) Credibility: eatvora.app publishes its own "Best Food Inventory App in 2026" and "Best Pantry App in 2026" roundups that rank Eatvora first, so its comparison pages are self-marketing, not neutral evidence — I trust only the App Store listing and the direct feature sentences. (2) Even here the savings counter is item-level (money at risk from expiring items), not an attribution of savings to a generated plan, and no page I retrieved mentions nutrient goals or a nutrient dashboard.
    - **price as stated:** App Store in-app purchases listed as Premium $4.99/month, Premium $39.99/year, Plus $9.99/month, Plus $79.99/year, with a free tier for "core pantry tracking and expiration alerts" (https://apps.apple.com/us/app/eatvora/id6759806556). Checked on 2026-09-13.
    - **who uses it:** Households focused on food-waste and grocery-spend reduction; iOS only as far as I could verify.
    - **has pantry inventory:** yes
    - **has expiry tracking:** yes
    - **plans from expiring food:** yes
    - **has nutrient goals:** unknown
    - **has shopping list:** yes
    - **explains why recommended:** unknown
    - **closes the loop:** yes
  - _item 11_
    - **name:** KitchenPal
    - **vendor:** KitchenPal
    - **url:** https://kitchenpalapp.com/en/expiry-date-tracker.html
    - **url retrieved:** True
    - **quoted evidence:** Track expiry dates for all food items across pantry, fridge, and freezer
    - **main strength:** Matches our storage-location model exactly (pantry/fridge/freezer) and does expiry-driven suggestion: "Get recipe ideas using ingredients that are about to expire", with "Scan product barcodes to automatically add items with manufacturer expiration dates pre-filled" — barcode capture is a real onboarding advantage over our manual entry. It also closes a loop: "Track what gets wasted and why" (all same URL).
    - **main weakness:** "Track what gets wasted and why" is a waste log, not a measurement of whether a plan worked — nothing on the page connects the log back to a generated meal plan or a stated goal. No nutrition or nutrient-goal behaviour described, and no price disclosed on the page I retrieved.
    - **price as stated:** Not stated on the page I retrieved; the page cites $800–1,200 annual user savings but no subscription figure. Checked on 2026-09-13.
    - **who uses it:** Expiry-anxious households; barcode scanners.
    - **has pantry inventory:** yes
    - **has expiry tracking:** yes
    - **plans from expiring food:** yes
    - **has nutrient goals:** unknown
    - **has shopping list:** yes
    - **explains why recommended:** unknown
    - **closes the loop:** yes
  - _item 12_
    - **name:** Kitche
    - **vendor:** Kitche (UK)
    - **url:** https://kitche.co/the-app/
    - **url retrieved:** True
    - **quoted evidence:** track how much CO2, water and money you save and earn rewards
    - **main strength:** Closes the loop on the sustainability axis we already gesture at with our green score, and gamifies it: "Keep track of what you have at home", "easily Import products and RECEIVE reminders of when to use them", "Search 1000s of RECIPES filtered by WHAT you HAVE at home and diet" (all same URL). CO2/water/money saved plus rewards is our achievements-and-green-score idea already shipped.
    - **main weakness:** Recipe filtering is by what you HAVE, not by what is expiring — the page never says urgency ranks the results. No shopping list or meal-plan calendar is described on the page I retrieved, and nothing explains why a specific recipe surfaced.
    - **price as stated:** Not stated on the page I retrieved. Checked on 2026-09-13.
    - **who uses it:** UK households; receipt-scanning users. (Third-party sources say Kitche was acquired by Remy in Feb 2025 — I did not verify this from a vendor page.)
    - **has pantry inventory:** yes
    - **has expiry tracking:** unknown
    - **plans from expiring food:** unknown
    - **has nutrient goals:** unknown
    - **has shopping list:** unknown
    - **explains why recommended:** unknown
    - **closes the loop:** yes
  - _item 13_
    - **name:** OH, a potato!
    - **vendor:** OH, a potato!
    - **url:** https://ohapotato.app/features/
    - **url retrieved:** True
    - **quoted evidence:** Every cooked meal = tracked money and carbon savings
    - **main strength:** The cleanest example of cook-then-measure I found — "A live dashboard that tracks your impact" and "See your savings in € and CO₂" are tied to meal COMPLETION, which is exactly the hook our meal-completion tracking already has and does not yet use. Also does "Scan what you have", "Get recipe ideas for what you already have", "Waste-reduction grocery lists", "Plan weekly meals", plus gamification ("grow your pet Potato").
    - **main weakness:** The page never mentions expiry dates, so the "what you already have" suggestion is stock-based rather than urgency-based; no nutrition or nutrient goals appear anywhere; and the impact dashboard is a per-meal savings tally, not a comparison against a plan's stated objective.
    - **price as stated:** Not stated on the page I retrieved. Checked on 2026-09-13.
    - **who uses it:** EU/euro-zone households (savings shown in €); couples sharing the cooking load.
    - **has pantry inventory:** yes
    - **has expiry tracking:** unknown
    - **plans from expiring food:** unknown
    - **has nutrient goals:** unknown
    - **has shopping list:** yes
    - **explains why recommended:** unknown
    - **closes the loop:** yes
- **what none of them do:**
  - PER-RECOMMENDATION EXPLANATION TRACEABLE TO A SPECIFIC PANTRY ITEM. Zero of the thirteen products I fetched showed a user-facing rationale for an individual suggestion. This is the strongest result I have. The pattern is consistent: vendors state a POLICY once, in marketing voice, and never surface it per recipe. Eat This Much says "our algorithms will use it up with priority"; Eatvora says it "generates recipes that use your expiring ingredients first"; CozZo says its AI "matches imported or homemade recipes to stocked products." None of those is "we suggested Shakshuka because your eggs expire Tuesday and your tomatoes are already 2 days over." I looked for it deliberately with a dedicated search and found no vendor page describing an explanation UI. Caveat: this is absent from every page I RETRIEVED — an in-app screen I cannot see could contradict it, and I tested nothing hands-on.
  - AN AFTER-THE-FACT MEASURE OF WHETHER A GENERATED PLAN WORKED. Five products close a loop of some kind — CozZo ("consumed vs. wasted food"), Eatvora ("real savings counter"), KitchenPal ("Track what gets wasted and why"), Kitche ("how much CO2, water and money you save"), OH a potato! ("Every cooked meal = tracked money and carbon savings"). But every one of those counters is ITEM-level: it tallies what rotted or what was rescued. Not one page attributes the outcome back to a plan or a stated goal — none says "the 5-meal plan you generated on the 3rd used 7 of the 9 items it targeted" or "you set a protein goal and this plan got you to 82% of it." The plan and the measurement are separate surfaces in all five. Our free-text goal input plus our meal-completion tracking plus our nutrient dashboard are already three-quarters of that bridge and nobody I checked has built it.
  - BOTH HALVES IN ONE PRODUCT. The market I retrieved splits cleanly and the split is total. The nutrient-goal products (Eat This Much, Samsung Food) have documented macro/health targets and NO waste-outcome measure on any page I fetched. The waste-outcome products (CozZo, Eatvora, KitchenPal, Kitche, OH a potato!) have documented savings dashboards and NO nutrient goals on any page I fetched. I found no product holding a nutrient dashboard, an expiry-driven planner and an outcome measure at once. Reason I believe it absent: these come from two different product lineages — calorie/macro tools and food-waste tools — and neither vendor set has commercial reason to chase the other's metric.
  - EXPLAINING A RECOMMENDATION IN TERMS OF A USER'S OWN FREE-TEXT GOAL. Every planner I checked takes structured input — diet tags, macro numbers, allergens, servings, "200 personalization options" (Mealime). None of the pages I retrieved describes accepting an open-ended sentence of intent and then justifying the resulting plan against it. Absent, I believe, because structured input is what a deterministic solver needs; the LLM-era version of this is new enough that nobody in my sample has shipped it as a described feature.
  - A NUMERIC PER-RECIPE INVENTORY-MATCH FIGURE SHOWN ON THE BROWSE SURFACE. CozZo "matches ... recipes to stocked products" and Kitche filters "by WHAT you HAVE at home", but no page I retrieved states a percentage or score per recipe. Flagging this as the weakest item on the list: it is a small UI affordance, easy to have missed on a screenshot I could not read, and I would not build strategy on it.
- **honest gaps in my search:** "THREE OF MY TEN ASSIGNED CANDIDATES ARE DEAD OR DYING — the most important thing I found. (1) Mealime: vendor's own page, which I fetched, says \"Mealime will be discontinued as of October 21, 2026.\" That is five weeks from today. (2) PlateJoy: www.platejoy.com failed DNS resolution when I tried to fetch it (getaddrinfo ENOTFOUND) — that failure is my own direct evidence; third-party sources say it shut down July 2025, which I did NOT verify from a vendor page. (3) Yummly: shut down 20 Dec 2024 per multiple third-party sources; I could not verify from the vendor because the site is gone. Do not put PlateJoy or Yummly in a comparison table. Also CozZo's own page carries a wind-down notice. Roughly a third of this category has died in two years, which is itself a finding about the market.\n\nPAGES I COULD NOT GET: samsungfood.com returned HTTP 403, so my Samsung Food evidence is the App Store listing and a Samsung support article, not the product's own feature page — its pantry story is therefore genuinely unresolved, and a search snippet claiming \"automated pantry management\" is snippet text I could not confirm on any page. plantoeat.com/pages/features returned 404. eatthismuch.com/features returned 404. The Eat This Much pricing page is JavaScript-only and rendered as a browser-upgrade message, so I have NO price for them. The Google Play listing for Samsung Food came back truncated and unusable.\n\nPRICES I DO NOT HAVE: Paprika, AnyList, SideChef subscription, Prepear, KitchenPal, Kitche, OH a potato!, Eat This Much, CozZo. I have real prices only for Plan to Eat ($5.95/mo or $49/year), Samsung Food+ ($6.99/mo, $59.99/yr) and Eatvora ($4.99/$39.99 Premium, $9.99/$79.99 Plus). All checked 2026-09-13.\n\nWHERE I WROTE \"no\" RATHER THAN \"unknown\": only four cells, and all four are absence-from-the-vendor's-own-dedicated-documentation rather than an explicit denial by the vendor. Paprika plans_from_expiring_food = no (I read the complete Pantry section of the iOS help; it enumerates the pantry's actions and recipe suggestion is not among them). Eat This Much has_expiry_tracking = no and plans_from_expiring_food = no (their dedicated help article 'how does the pantry system work' describes removal as tied to when a meal is scheduled, never to shelf life). Treat these as strong inferences, not quotes.\n\nSOURCE-QUALITY WARNING: several sites surfacing in these searches (eatvora.app, foodieprep.ai, mealthinker.com, promealplan.com, and similar) publish their own 'best app of 2026' rankings that place themselves first. I used eatvora.app only for its own product's feature sentences and cross-checked its existence and pricing against the Apple App Store listing. I ignored the roundup sites entirely as evidence about anyone else.\n\nWHAT I DID NOT ESTABLISH AT ALL: I installed and used nothing. Every claim here is marketing copy or help documentation, which is evidence that a FEATURE IS CLAIMED, not that it exists, works, or is any good. I have no evidence on quality, no evidence on user demand, and no evidence that anyone wants an explanation of why a recipe was recommended — that last point matters, because our two priority columns are gaps I can confirm are unfilled but cannot confirm anyone is asking to have filled. I also did not check Android-only or non-US products beyond what surfaced, did not check grocery-retailer-native planners (Albertsons Meals Hub, which is where Mealime users are being sent, is an unexamined and now significant rival), and did not cover recipe-manager-only tools like MealBoard that appeared in results but which I did not fetch."
