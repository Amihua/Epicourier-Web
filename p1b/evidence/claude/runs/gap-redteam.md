# gap:redteam

**Workflow:** P1b Claude market survey (run 1)  
**Phase:** Gap  
**Model:** Claude Opus 5 (1M context), `claude-opus-5[1m]`  
**Agent id:** `a7d0045c8f3d86b29`  
**Tool calls:** 40 total — 19 web searches, 18 pages fetched  
**Raw transcript:** `raw/agent-a7d0045c8f3d86b29.jsonl` (full tool-call trace, retained)

---

## Prompt, exactly as issued

```text
You are hostile to this team's whole plan. Attack it as hard as you honestly can. No
strawmen — every attack must be one a well-informed critic would actually make.

THEIR PRODUCT (the thing they already studied):
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

THE MARKET AS VERIFIED SO FAR:
[
  {
    "name": "Plan to Eat",
    "pantry_inventory": "PARTIAL, not 'yes'. A true pantry was built and removed: 'In early versions of Plan to Eat we had a feature called the Pantry... why we discontinued this feature' (https://learn.plantoeat.com/help/a-digital-pantry-inventory-does-it-really-help). What exists now is the Staples List: 'The Staples list is a static list of frequently purchased items that can be used as a kitchen inventory' and 'We recommend using your Staples List as a pantry/inventory system' - but 'these items will not be automatically removed from your Shopping List' (https://learn.plantoeat.com/doc/use-the-staples-list-for-frequently-purchased-items). No deduction, no on-hand quantities synced to the list.",
    "expiry_tracking": "no / unknown - no expiration or use-by field documented anywhere I retrieved. The only date tracking in the product is the Freezer: 'The Freezer keeps track of the servings, number of meals, and the date frozen' (https://learn.plantoeat.com/help/app-freezer-cooking) - a freeze date, not an expiry date.",
    "plans_from_expiring_food": "unknown / no. Nothing is expiry-driven. The only documented use-it-up path is manual: 'You can also use the With Ingredient filter to then find recipes with the items you know you have and want to use up!' (https://learn.plantoeat.com/doc/use-the-staples-list-for-frequently-purchased-items).",
    "explains_why_recommended": "unknown - no recommendation engine is described at all; the user supplies their own recipes ('Add your recipes, move meals around anytime, and plan in a way that works for you', https://www.plantoeat.com/). Nothing recommends, so nothing explains.",
    "closes_the_loop_on_outcome": "unknown - no page text on cooked/not-cooked, leftovers-wasted, or feedback into the next plan. Vendor-run survey stats on the homepage ('23% Reduction in food costs... reduced from $199 to $152') are self-reported survey outcomes, not an in-product loop.",
    "evidence_url": "https://learn.plantoeat.com/help/a-digital-pantry-inventory-does-it-really-help and https://learn.plantoeat.com/doc/use-the-staples-list-for-frequently-purchased-items"
  },
  {
    "name": "Paprika Recipe Manager 3",
    "pantry_inventory": "YES - 'Use the pantry to keep track of common ingredients you already have at home, such as: salt, pepper, flour, sugar, etc.' and 'Ingredients placed in your pantry will automatically be unchecked when you add recipes or meal plans to your grocery list.' (https://www.paprikaapp.com/help/ios/). Confirmed on Mac too: 'The pantry section keeps track of common ingredients you may have at home.' (https://www.paprikaapp.com/help/mac/).",
    "expiry_tracking": "YES - 'For each pantry item you can record the quantity, purchase date, expiration date, and whether it is in stock or out of stock.' plus sorting: 'You can choose between sorting by: Aisle, Date Added, Expiration Date, or In Stock.' (https://www.paprikaapp.com/help/ios/). Mac guide: 'you can add custom pantry items, change expiration dates and purchased dates, and more.'",
    "plans_from_expiring_food": "unknown - both the iOS and Mac user guides are silent on generating meals or plans from soon-to-expire items. The nearest documented behaviour is restocking, not planning: 'Move to Grocery List - Moves items from the pantry to the grocery list. You can choose between moving all items, moving purchased items, or moving out of stock items.' (https://www.paprikaapp.com/help/ios/).",
    "explains_why_recommended": "unknown / not applicable - Paprika documents no recommendation engine anywhere. The user supplies recipes via the built-in browser ('Paprika's built in web browser allows you to browse for recipes anywhere on the web', https://www.paprikaapp.com/). Nothing recommends, so nothing explains.",
    "closes_the_loop_on_outcome": "WEAK/PARTIAL, better than 'unknown' - the guides document a manual outcome field, 'Rating - A star rating from 0 to 5 for this recipe' with a 'Top Rated' sort (https://www.paprikaapp.com/help/ios/). No cooked/not-cooked, waste, or feedback into planning is described, so this is a recipe metadata field, not real loop closure.",
    "evidence_url": "https://www.paprikaapp.com/help/ios/"
  },
  {
    "name": "Eat This Much",
    "pantry_inventory": "YES, but Premium-only (analyst omitted the paywall). 'The pantry list tracks what foods you already have on hand and how much you should have left based on your meal plans' and 'The Premium subscription plan includes access to the pantry feature' (https://help.eatthismuch.com/help/how-does-the-pantry-system-work).",
    "expiry_tracking": "NO. No use-by or expiry date exists anywhere on the retrieved pages. Depletion is plan-based, not date-based: 'We remove ingredients from your pantry after you're supposed to have eaten them' (https://help.eatthismuch.com/help/how-does-the-pantry-system-work). The pricing page only gestures at freshness: 'so you know when foods (especially the preservative-free ones!) need to be replaced' (https://www.eatthismuch.com/pricing) — that is marketing copy about replacement, not a date-tracking behaviour.",
    "plans_from_expiring_food": "NO, and now positively evidenced rather than assumed: 'We don't have the ability to generate an entire meal plan with just your pantry yet.' (https://help.eatthismuch.com/help/can-i-create-meals-using-only-my-pantry-foods). Weaker behaviour that does exist: 'the weekly planner will still give priority to using up your pantry foods to reduce waste as much as possible, especially if you select Groceries as your generator focus' (same URL).",
    "explains_why_recommended": "unknown — no page I retrieved (homepage, /pricing, or either pantry help article) states that the app explains why a meal or food was chosen.",
    "closes_the_loop_on_outcome": "PARTIAL / assumed, not confirmed — not 'unknown'. 'We remove ingredients from your pantry after you're supposed to have eaten them (we do this automatically when the weekly generator runs, or you can use the \"remove eaten\" option in the upper right to do this manually)' and 'If you don't eat something in your plan and don't want us to remove those ingredients, be sure to remove that item from your planner' (https://help.eatthismuch.com/help/how-does-the-pantry-system-work). The app never asks whether you actually ate it; it assumes and asks you to correct it.",
    "evidence_url": "https://help.eatthismuch.com/help/how-does-the-pantry-system-work"
  },
  {
    "name": "Samsung Food (formerly Whisk)",
    "pantry_inventory": "YES — and it is on the very page the analyst cited. Samsung Food+ bullet: 'Automated pantry management with personalized cooking suggestions.' (https://apps.apple.com/us/app/samsung-food-meal-planner/id1133637674). Corroborated on Google Play: 'Automated pantry suggestions and food tracking'. Documented in detail: 'The Food List is a powerful tool to help you manage your food inventory and reduce food waste. It allows you to manage and track food items stored across various locations, such as your fridge, freezer, pantry, and more.' (https://support.samsungfood.com/hc/en-us/articles/30025317487508-Getting-Started-with-Food-List).",
    "expiry_tracking": "YES — 'Tap any item to edit details such as storage location or use-by date' and 'You can disable use-by-date tracking for certain items if needed.' (https://support.samsungfood.com/hc/en-us/articles/30025317487508-Getting-Started-with-Food-List). Important caveat from the same page: 'Please note that we do not notify users about any items in the Food List that are close to their due date.' So dates are stored and editable but do not fire alerts.",
    "plans_from_expiring_food": "YES for recipe surfacing, Food+ only — 'Recipes that are containing items that are about to expire will be prioritized.' and 'Recipes that use the most ingredients from your Food List will appear first.' ... 'This feature is available with our Food+ subscription.' (https://support.samsungfood.com/hc/en-us/articles/30251599415956-How-to-Search-for-Recipes-Using-Your-Available-Ingredients). UNKNOWN whether the automatic weekly meal-plan generator ('AI-personalized weekly meal plans tailored to your health goals') applies the same expiry priority — no page I retrieved says it does. Do not conflate the two.",
    "explains_why_recommended": "PARTIAL — one quotable behaviour: 'Each recipe will show how well it matches your selected ingredients, helping you quickly decide what to cook.' (https://support.samsungfood.com/hc/en-us/articles/30251599415956-How-to-Search-for-Recipes-Using-Your-Available-Ingredients). That is an ingredient-match score, not a reason. No page describes explaining why a meal plan chose a given meal.",
    "closes_the_loop_on_outcome": "YES, Food+ only — 'Updating Food List After Cooking. This is a premium feature available with our Food+ subscription. 1. After cooking, mark the recipe as \"Made It\". 2. The app will suggest removing the used ingredients from your Food List, helping you keep track of what's left.' (https://support.samsungfood.com/hc/en-us/articles/30025317487508-Getting-Started-with-Food-List). This is a genuine did-you-cook-it confirmation, unlike Eat This Much's assumed decrement.",
    "evidence_url": "https://support.samsungfood.com/hc/en-us/articles/30025317487508-Getting-Started-with-Food-List"
  },
  {
    "name": "AnyList",
    "pantry_inventory": "NO — upgraded from 'unknown' on evidence of exhaustive absence. AnyList's own Free-vs-Complete comparison table (https://www.anylist.com/features), introduced with 'Explore all the features below to see which plan is right for you', lists ~45 features across Lists, Recipes and Meal Planning and contains zero occurrences of 'pantry', 'inventory' or 'stock'. The closest is 'Use Favorites to build a \"master list\"', which is a reusable staples list, not an inventory of what you currently hold.",
    "expiry_tracking": "NO — zero occurrences of 'expir' anywhere on https://www.anylist.com/features or https://www.anylist.com/complete. The only food-waste mention is a benefit claim, not a feature: 'AnyList Complete easily pays for itself by helping you avoid impulse purchases, cook more meals at home, and prevent food waste' (https://www.anylist.com/features) — that is marketing framing of meal planning, with no described behaviour.",
    "plans_from_expiring_food": "NO — no inventory and no expiry exist, so nothing can plan from them. The meal-planning flow runs the other direction only: 'Easily add some or all of the ingredients for upcoming recipes to your shopping list' (https://www.anylist.com/complete).",
    "explains_why_recommended": "unknown — the page is silent. AnyList does not appear to recommend recipes at all; it stores the ones you supply ('AnyList helps you organize your personal recipes and allows you to easily add recipes from other sources').",
    "closes_the_loop_on_outcome": "NO / unknown — nothing on any retrieved page describes recording what was cooked or eaten. The documented loop is recipe → meal plan calendar → shopping list, terminating at 'Check off items as you shop' (https://www.anylist.com/features). Checking off a purchase is not an outcome.",
    "evidence_url": "https://www.anylist.com/features"
  },
  {
    "name": "SideChef",
    "pantry": "YES — analyst wrongly said unknown. https://www.sidechef.com/my-pantry/ (HTTP 200), <title> verbatim: \"My Pantry - Zero-Waste Meals Using What You Have\"; meta description verbatim: \"Find out what recipes you can make using up ingredients you have at home. Select all ingredients you have and discover meals that use up your pantry inventory.\" Caveat: the interactive body is login-gated, so this is title/meta text, not visible body copy.",
    "expiry": "unknown — no supporting text. The ONLY occurrence of the string \"expir\" anywhere on the retrieved homepage is promotional legal boilerplate, \"Offer subject to change or expire without notice\", which is a false friend, not a feature. \"Real-time Store Inventory\" on the homepage is the RETAILER's stock level, not the user's food or its dates.",
    "plans_from_expiring": "unknown — SideChef plans from what you HAVE, not from what is EXPIRING. Best available text is \"discover meals that use up your pantry inventory\" (https://www.sidechef.com/my-pantry/), which carries no date or expiry dimension.",
    "explains_why": "unknown — https://www.sidechef.com/meal-planner/ says only \"Take charge of your home cooking with FREE personalized meal plans for you and your family.\" \"Personalized\" is a marketing adjective, not a described behaviour, and no per-recipe rationale is shown anywhere.",
    "closes_the_loop_on_outcome": "unknown — nothing tracks what was actually eaten vs binned. The homepage has zero occurrences of \"waste\", \"leftover\", \"use up\" or \"on hand\". The phrase \"reduce food waste\" appears only in the My Pantry meta description as an aspiration, which is a benefit claim, not an outcome-tracking feature.",
    "evidence_url": "https://www.sidechef.com/ ; https://www.sidechef.com/my-pantry/ ; https://www.sidechef.com/premium/ ; https://www.sidechef.com/meal-planner/"
  },
  {
    "name": "Prepear",
    "pantry": "YES, but weak — analyst wrongly said unknown. Prepear's help centre article \"How to Use Your Pantry With Your Grocery List\" (https://help.prepear.com/hc/en-us/articles/360031261271-How-to-Use-Your-Pantry-With-Your-Grocery-List, updated 2026-03-16) says verbatim: \"Your pantry is designed to keep your shopping list uncluttered by everyday items you almost always have on hand\". Important nuance: this is a staples-suppression list, not a quantity-tracked inventory — \"Items on your pantry are removed from your shopping list\". No quantities, no dates.",
    "expiry": "NO (upgraded from unknown on negative evidence) — the homepage has zero occurrences of \"expir\", \"waste\", \"leftover\" or \"inventory\", and a Zendesk API search of the entire Prepear help centre returns count=0 for \"expiration\", count=0 for \"expire\" and count=0 for \"waste\".",
    "plans_from_expiring": "NO — follows from the above; nothing in Prepear records a date, so nothing can be planned from one.",
    "explains_why": "unknown — no page states why any recipe is surfaced. The closest text is an ingredient-provenance reminder on the shopping list, \"Get reminded which recipe calls for this ingredient\" (https://www.prepear.com/), which explains where an ingredient came from, not why a recipe was recommended.",
    "closes_the_loop_on_outcome": "unknown — nothing reports consumed vs wasted. Prepear does close the loop on PURCHASE (\"Order your groceries from right within the app for curbside pickup or delivery\"), but purchase is not outcome; no page tracks whether the food was eaten.",
    "evidence_url": "https://www.prepear.com/ ; https://www.prepear.com/prepear-gold/ ; https://help.prepear.com/hc/en-us/articles/360031261271-How-to-Use-Your-Pantry-With-Your-Grocery-List"
  },
  {
    "name": "Eatvora",
    "pantry_inventory": "yes — App Store listing: \"Tell Eatvora what's in your pantry and it generates recipes\"; also \"AUTOPILOT FOR YOUR PANTRY — Turn on AutoPilot and let Eatvora manage your inventory automatically\"",
    "expiry_tracking": "yes — feature page FAQ: \"Eatvora reduces food waste through five mechanisms: (1) expiration date tracking with proactive alerts\"",
    "plans_from_expiring_food": "yes — \"AI generates recipes from exactly what is in your fridge — before it expires\" and \"Weekly meal planner builds a full week of dinners from your pantry automatically\"",
    "explains_why_recommended": "unknown — analyst's \"unknown\" is CORRECT; zero explanation-of-recommendation text found anywhere on the page (searched \"why we recommend\", \"because\", \"explains\", \"reason\", \"rationale\", \"why this\" — no hits)",
    "closes_the_loop_on_outcome": "yes — \"Tracks every dollar saved from reduced food waste with a real savings counter\"; App Store: \"estimates your savings in real time\"",
    "evidence_url": "https://www.eatvora.app/features/food-waste-reduction"
  },
  {
    "name": "KitchenPal",
    "pantry_inventory": "yes — \"KitchenPal tracks expiration dates across all storage areas\"; site has a dedicated \"Pantry Inventory Tracker - Track all pantry items with expiry dates\"",
    "expiry_tracking": "yes — \"Track expiry dates for all food items across pantry, fridge, and freezer. Automatic date detection for many products.\" plus \"Receive notifications 1-7 days before items expire (you choose).\"",
    "plans_from_expiring_food": "yes — \"Get recipe ideas using ingredients that are about to expire. Turn expiring food into delicious meals.\" and \"Meal Planner - Plan meals around expiring foods\"",
    "explains_why_recommended": "unknown — analyst's \"unknown\" is CORRECT; no text explains why a given recipe is surfaced. Closest is the App Store line \"KitchenPal learns and provides suggestions the more you use it\", which is a marketing adjective, not a described explanation behaviour",
    "closes_the_loop_on_outcome": "yes — \"Track what gets wasted and why. Identify patterns and adjust buying habits to reduce future waste.\" plus FAQ \"Mark it as wasted in the app. This helps track your waste patterns over time\"",
    "evidence_url": "https://kitchenpalapp.com/en/expiry-date-tracker.html"
  },
  {
    "name": "OH, a potato!",
    "pantry_inventory": "yes - 'Scan what you have' and 'Get recipe ideas for what you already have' (https://ohapotato.app/features/); App Store description: 'See what's in the fridge or pantry.'",
    "expiry_tracking": "yes - 'Real-time spoilage warnings and rescue options' (https://ohapotato.app/); App Store description: 'See what's about to go off before it ends up in the bin.'",
    "plans_from_expiring_food": "yes - 'Recipe suggestions: Based on what's at risk, what's seasonal, leftovers' (https://ohapotato.app/)",
    "explains_why_recommended": "unknown - no page text describes a per-suggestion rationale shown to the user. The closest is 'Based on what's at risk, what's seasonal, leftovers', which describes the selection basis, not an explanation surfaced in the UI.",
    "closes_the_loop_on_outcome": "yes - 'Every cooked meal = tracked money and carbon savings' and 'A live dashboard that tracks your impact.' (https://ohapotato.app/features/); 'Track how much money and CO₂ you've saved this month, this year, or all-time.' (https://ohapotato.app/)",
    "evidence_url": "https://ohapotato.app/features/ and https://ohapotato.app/"
  },
  {
    "name": "PantryWise: Food Waste Tracker",
    "pantry_inventory": "yes - 'Pantry, fridge & freezer inventory in one place' (App Store description, https://apps.apple.com/us/app/pantrywise-pantry-manager/id6759767806)",
    "expiry_tracking": "yes - 'Food expiration tracker — get alerts before items go bad' (App Store description); 'Get ahead of expiring groceries with smart alerts and better visibility into what needs to be used first.' (https://pantrywiseapp.com/)",
    "plans_from_expiring_food": "unknown - the site describes a loop where '03 Stay ahead - Bring expiring and easily forgotten items back into view' precedes '04 Cook - Find recipe ideas that make practical use of ingredients already at home' and '05 Plan - Turn those recipe choices into a meal plan that fits the week', but no text states that recipes are selected or ranked BY expiry. Planning from pantry = yes; planning from EXPIRING = not stated. The analyst's 'unknown' is correct here.",
    "explains_why_recommended": "unknown - nothing on either page describes a rationale shown per recipe. Closest text: 'Review inventory and usage insights that help make the next plan more informed.' (https://pantrywiseapp.com/) - an insights dashboard, not a per-recommendation explanation.",
    "closes_the_loop_on_outcome": "yes, but on WASTE not on cooking - 'a dashboard that breaks down your food waste cost to the dollar — per week, per month, and per year' (App Store description) and 'Advanced analytics: full usage/waste history and deeper trend views' (https://pantrywiseapp.com/)",
    "evidence_url": "https://apps.apple.com/us/app/pantrywise-pantry-manager/id6759767806 and https://pantrywiseapp.com/"
  },
  {
    "name": "Xpiry",
    "pantry_inventory": "yes - 'Xpiry looks at what's in your pantry and suggests recipes you can actually make tonight.' plus receipt-scan intake: 'AI reads each item, cleans up the abbreviated names, and files it under the right food category.' (https://xpiry.cjinteractivellc.com/)",
    "expiry_tracking": "yes - 'Xpiry estimates a shelf life for every item based on what it is and where you keep it: fridge, freezer, or shelf.' and 'A daily notification tells you what's about to expire.' (https://xpiry.cjinteractivellc.com/)",
    "plans_from_expiring_food": "partial - recipe SUGGESTIONS are expiry-ranked: 'It prioritizes recipes that use items expiring soon' and 'Ingredients that are running out of time get used first.' But no meal PLAN, calendar, or week view is described anywhere on the page. (https://xpiry.cjinteractivellc.com/)",
    "explains_why_recommended": "partial - the page describes an ingredient-coverage figure attached to each suggestion ('Every suggestion shows how many of the ingredients you already have, along with cook time, difficulty, and macros per serving'), but no page text states that Xpiry gives a reason for a recommendation. A displayed attribute is not a stated rationale. (https://xpiry.cjinteractivellc.com/)",
    "closes_the_loop_on_outcome": "unknown - nothing on the site or the App Store description mentions tracking money saved, CO₂, waste avoided, or any post-cooking outcome. The analyst's 'unknown' is correct.",
    "evidence_url": "https://xpiry.cjinteractivellc.com/ and https://apps.apple.com/us/app/xpiry-food-expiry-ai-recipe/id6756198499"
  },
  {
    "name": "NoWaste: Food Inventory List",
    "pantry_inventory": "yes — \"Inventory lists for your freezer, fridge & pantry\" (App Store description)",
    "expiry_tracking": "yes — \"Sort your food by expiration date, name or category\" (description); reminders appear only in a release note: \"Set up to two expiry date reminders pr food item\" (v7.3.1, 12/16/2025)",
    "plans_from_expiring_food": "unknown — description says \"see what food you need to use first, create a shopping list, plan your meals\" but never ties meal plans or recipes to expiring items; recipes are generated \"based on stock\"",
    "explains_why_recommended": "unknown — no page text describes any reason or rationale shown alongside a recommendation",
    "closes_the_loop_on_outcome": "yes, but release-note evidence only — \"A new \"My numbers\" widget on your profile shows your personal food waste stats\" (Version History v7.4.1, Mar 4)",
    "evidence_url": "https://apps.apple.com/us/app/nowaste-food-inventory-list/id926211004"
  },
  {
    "name": "SuperCook",
    "pantry_inventory": "yes — \"Visit the pantry page in the SuperCook app and choose from a list of 2000+ ingredients\"",
    "expiry_tracking": "no — the pantry is an undated ingredient list; expiry appears only rhetorically (\"before it expired\"), with no dated tracking behaviour described anywhere",
    "plans_from_expiring_food": "no — recipe matching keys off pantry membership only; \"SuperCook instantly analyzes 11 million recipes and finds the ones that match your unique ingredients\"",
    "explains_why_recommended": "unknown — CORRECTED from the analyst's 'yes'. The page describes a filter, never a rationale attached to a recommendation",
    "closes_the_loop_on_outcome": "unknown — the description has a '--Reduce food waste--' section but it describes recipe-finding, not measurement or reporting of what the user actually used or threw away",
    "evidence_url": "https://apps.apple.com/us/app/supercook-recipe-by-ingredient/id1477747816"
  }
]

WHAT THEY WANT TO CLAIM: that there is room for a meal planner that is auditable (shows why it
recommended what it recommended, traceable to specific pantry items and expiry dates), that
treats pantry inventory as uncertain rather than authoritative, and that measures afterwards
whether it actually reduced waste.

Attack on three fronts, each as strongly as you honestly can:
1. NOBODY WANTS IT — the need is imagined. Who has tried to sell auditability to home cooks and
   failed? Is "explain the recommendation" a thing users ask for, or a thing engineers want?
2. THEY CANNOT BUILD IT — 160 person-hours, four graduate students, build AND test. What
   specifically will not fit? What will they get 70% done and have to cut?
3. SOMEONE DOES IT BETTER — name who, with a URL. Search for it; do not speculate.

Then, for EACH attack, state precisely what evidence would defeat it, so the team can go collect
that evidence or concede the point. Use WebSearch and WebFetch to ground attacks 1 and 3 in real
sources; an ungrounded attack is worth less than a grounded one.

Return your answer as prose with clear headings. Be specific, be concrete, name names.
```

## Searches actually run

- `Cooklist app automatically syncs grocery store purchase history pantry inventory`
- `food waste diary self-report underestimate compared to waste composition analysis percentage`
- `users ignore explanations recommender systems study "explanations" not requested by users XAI end users don't want`
- `household food waste app intervention randomized controlled trial no significant reduction smartphone app food waste`
- `Cooklist pantry "running low" predicts what you have left accuracy help docs`
- `Samsung Family Hub AI Vision Inside automatically recognizes food items fridge camera expiration 2025 2026`
- `"Language Models Don't Always Say What They Think" unfaithful explanations chain-of-thought Turpin`
- `recipe app shows reason "because your" expiring ingredient explains why recommended pantry 2026`
- `Gemini app photo of your fridge recipe suggestions official Google feature`
- `dietary self-monitoring adherence declines over time percentage of days recorded study Burke weight loss app`
- `mobile app day 30 retention rate benchmark 2025 food and drink category percentage`
- `survey percentage of people using ChatGPT for meal planning recipes what's in my fridge 2025 2026`
- `grocy "due score" recipes stock journal audit log documentation features`
- `AI meal planner shows reasoning explains why each meal chosen transparent app 2026`
- `Kitche app food waste UK shut down closed discontinued expiry tracking receipt scan`
- `Remy app food waste AI "remy" household meal planning app features expiry inventory`
- `reddit pantry inventory app "too much work" gave up tracking what's in my fridge never keep it updated`
- `HCI study why food waste apps fail household inventory tracking burden qualitative research CHI`
- `explainable food recommender system user study explanations healthy eating Elsweiler research 2020..2026`

## Pages actually fetched

- https://www.sciencedirect.com/science/article/pii/S095965262031310X   — asked: Quote verbatim the abstract and any statements about how much diaries underestimate food waste relative to was
- https://dl.acm.org/doi/10.1145/3565480   — asked: Quote the abstract verbatim. What did the user study find about whether users need or want explanations, and u
- https://pmc.ncbi.nlm.nih.gov/articles/PMC9482070/   — asked: Quote verbatim: the sample size, study duration, which apps were tested, the primary results on food waste cha
- https://cooklist.com/cooklist-app   — asked: Quote verbatim any text about: automatic pantry population from grocery store loyalty accounts, automatic expi
- https://learn.plantoeat.com/help/a-digital-pantry-inventory-does-it-really-help   — asked: Quote verbatim the reasons given for why the Pantry feature was discontinued, and any statements about how muc
- https://www.pantryfy.ai/blog/best-pantry-inventory-apps   — asked: List every app named, and quote verbatim any claims about: explaining WHY a recipe was recommended, showing a 
- https://www.pantrypersona.com/blog/best-pantry-inventory-apps-2026   — asked: Quote verbatim anything about how food gets into the inventory (manual entry burden, abandonment rates, why pe
- https://grocy.info/   — asked: Quote verbatim the feature list, especially anything about stock/inventory tracking, best before / due dates, 
- https://www.thegrocer.co.uk/news/new-ai-household-food-waste-reduction-app-remy-acquires-rival-kitche-to-boost-user-base/701748.article   — asked: Quote verbatim: what Kitche did, its user numbers, why it was acquired, whether the Kitche app was retired, an
- https://apps.apple.com/us/app/remy-ai-kitchen-assistant/id6657992254   — asked: Quote the app description verbatim, especially anything about: setting up the kitchen inventory without barcod
- https://www.remyapp.io/blog/what-is-the-remy-app-ai-kitchen-assistant-explained   — asked: Quote verbatim any claims about: how the inventory is set up and how long it takes, whether it handles uncerta
- https://arxiv.org/pdf/2508.16610   — asked: Quote verbatim the abstract and the main empirical findings about whether users want, notice, or act on explan
- https://www.ncbi.nlm.nih.gov/pmc/articles/PMC9324548/   — asked: Quote verbatim participant statements and author conclusions about: the burden of registering products and exp
- https://www.mdpi.com/2071-1050/15/13/10597   — asked: Quote verbatim the abstract, the sample size and duration, and any findings about inventory-entry burden, user
- https://pmc.ncbi.nlm.nih.gov/articles/PMC9324548/   — asked: Quote verbatim participant statements and author conclusions about: the burden of registering products and exp
- https://doi.org/10.3390/world7030042   — asked: Quote verbatim the statistics about willingness to follow educational advice versus willingness to use a food-
- https://pmc.ncbi.nlm.nih.gov/articles/PMC11835786/   — asked: Quote verbatim: the abstract conclusions, whether explanations changed actual food choice behaviour (not just 
- https://www.mdpi.com/2673-4060/7/3/42   — asked: Quote verbatim the statistics about willingness to follow educational advice versus willingness to use a food-

## Response

# Red-team review: Epicourier-Web's "auditable, uncertain-inventory, outcome-measured meal planner"

**Thesis of this attack:** You found one empty column in a 14-row competitor table (`explains_why_recommended` = unknown everywhere) and read it as a market gap. The alternative hypothesis — which the evidence below supports better — is that fourteen teams, several of them funded, several of them sitting on exactly the data needed, priced that feature and passed. Meanwhile the two legs of your claim that *aren't* empty columns (uncertain inventory, outcome measurement) are already shipped by named competitors, one of which is free and open-source and has a published scoring formula that is more auditable than anything an LLM-backed system can honestly produce.

---

## FRONT 1 — Nobody wants it

### 1.1 The best experimental evidence for your explanation feature is also the worst

The strongest study I can find in your favour is a real-world deployment of exactly your feature: an explanation interface for personalised food recommendations, run in workplace canteens ([JMIR mHealth uHealth, 2025](https://pmc.ncbi.nlm.nih.gov/articles/PMC11835786/)). Its findings: explanations "increased understanding of recommendations and created a sense of control." Its other findings: **41 of 136 participants completed the 7-week study**, users "frequently ignored recommendations when they conflicted with preferences," and the authors conclude explanations "cannot guarantee users will consistently choose healthier options." The paper's own hedge is "might be promising."

So the state of the art on explained food recommendation is: it improves a *perception* (understanding, control), it does not demonstrably change *behaviour*, and ~70% of participants walked away inside seven weeks. You are proposing to build a differentiator whose best published evidence is a self-reported attitude measure with a 70% attrition denominator.

The recommender-systems literature is blunter. [*User Perception of Recommendation Explanation: Are Your Explanations What Users Need?* (ACM TOIS 2023)](https://dl.acm.org/doi/10.1145/3565480) reports that users do not always appreciate explanations, that there is no established understanding of what users actually need from one, and that what users primarily want is **control over whether the explanation appears at all**. That is not a description of a feature people will switch apps for. That is a description of a setting.

### 1.2 "Explains why" is table stakes cosmetics, not a wedge

Netflix has shipped "Because you watched…" for over a decade. Amazon ships "Customers who bought this…". Spotify ships "Based on your listening." Instagram ships "Why am I seeing this ad?" — a feature that exists because of ad-transparency regulation, not because users demanded it. The consumer precedent is unambiguous: an explanation is a **one-line string appended to a card**. It costs a competitor one sprint and one prompt template to match you. It is not defensible, and nobody has ever been able to charge for it.

Worse for you specifically: your own product uses **Google Gemini 2.5 Flash** to recommend. Any of the fourteen competitors in your table can add `"and tell the user in one sentence why you picked it"` to their prompt and ship your entire differentiator in an afternoon. You are not proposing a moat; you are proposing a prompt suffix.

### 1.3 Your product's *premise* is the thing users have already rejected — and a competitor has published the post-mortem

The auditability claim is downstream of a maintained pantry inventory. That is the part users refuse.

Plan to Eat built a real pantry, killed it, and wrote down why ([learn.plantoeat.com](https://learn.plantoeat.com/help/a-digital-pantry-inventory-does-it-really-help)). Verbatim reasons: **"There is no way for your real inventory and your Plan to Eat inventory to ever remain synchronized,"** and **"You're doing the same work, either way."**

Read the first one again, because it is a direct refutation of your second claim. You propose to treat inventory as uncertain rather than authoritative. Plan to Eat's conclusion, from production experience with paying users, is that inventory is not *uncertain* — it is **unsynchronizable**, permanently, and the right product response is to delete the feature, not to model the error bars on it. Your "uncertainty" framing concedes their premise and then proposes to ship the feature anyway with a confidence badge on it. A well-informed critic will ask: at what confidence level does an explanation traceable to a pantry item stop being an audit trail and start being a guess with a footnote?

The behavioural data agrees:

- **Self-monitoring decays fast and universally.** Burke's SMART trial and successor work show dietary self-monitoring adherence peaks in week two and declines from week three; one analysis found **fewer than half the sample still tracking after week 10** ([JMIR mHealth 2017](https://mhealth.jmir.org/2017/2/e8/), [PubMed 31155473](https://pubmed.ncbi.nlm.nih.gov/31155473/)). Pantry tracking is strictly harder than calorie tracking: it requires logging at purchase, at consumption, *and* at disposal.
- **Category retention is catastrophic.** Food & drink apps sit at roughly **3.9% day-30 retention** ([UXCam benchmarks](https://uxcam.com/blog/mobile-app-retention-benchmarks/)). Any feature that only pays off in week four is a feature ~96% of your users will never see.
- **Users have stated the opposite preference to yours.** In a food-waste survey/intervention study, respondents were **87.3% willing to follow educational advice but only 48.1% open to using a food-tracking app**, and asked that apps "be intelligent and demand less work and manual operations, rather than being too advanced with too many functions" ([World 2026, 7(3):42](https://doi.org/10.3390/world7030042)). Your three additions — an explanation panel, a confidence model, and a post-hoc waste-outcome survey — are each strictly *more* functions and *more* manual operations.

### 1.4 Somebody already tried to sell this exact thing and is gone

**Kitche** (UK, launched 2018) did receipt-scanning intake, best-before alerts, expiry-relevant recipes, and — after its 2023 relaunch — financial and environmental impact tracking. That is your feature set minus the explanation panel. It won awards. In a Jersey Co-op partnership it reached **2% of Jersey households**. In February 2025 it was acquired by Remy and **"The Kitche brand will cease to exist in the UK, and the app has been retired"** ([The Grocer](https://www.thegrocer.co.uk/news/new-ai-household-food-waste-reduction-app-remy-acquires-rival-kitche-to-boost-user-base/701748.article), [Tech.eu](https://tech.eu/2025/02/17/restaurant-platform-remy-acquires-food-waste-app-kitche/)).

The acquirer, **Remy**, is free, AI-driven, claims a 25-second inventory setup with no barcode scanning, sends expiry reminders with a recipe attached, and reports "food saved, money saved, CO₂ avoided." Its US App Store listing shows **2 ratings** ([apps.apple.com](https://apps.apple.com/us/app/remy-ai-kitchen-assistant/id6657992254)). Seven years of development, an acquisition, VC framing, a better intake story than yours — and essentially no US traction. That is not a feature gap. That is a demand problem.

### 1.5 The outcome-measurement claim is the weakest of the three, empirically

The one published crossover trial of consumer food-waste apps (TotalCtrl Home and Too Good To Go) found **no significant reduction in food waste** (mean change 0.81 kg, SD 1.5, **P=.13**) and no significant change in food expenses (P=.39), with participants complaining the app was "so… manually… I had to type it in again" and that in "a hectic everyday life" they forgot to use it ([JMIR Formative Research, PMC9482070](https://pmc.ncbi.nlm.nih.gov/articles/PMC9482070/)). n=6, so this is weak evidence — but it is the *only* direct evidence, and it points the wrong way.

And the measurement instrument you would have to use is known-broken. Food-waste diaries capture roughly **60% of what waste-compositional analysis finds** (7–40% underestimation depending on study), driven by behavioural reactivity, misreporting, measurement bias and self-selection — and the literature's explicit conclusion is that **diaries alone are not suitable for tracking household food waste over time or for evaluating interventions** ([ScienceDirect, Waste Management 2021](https://www.sciencedirect.com/science/article/pii/S095965262031310X); [Sustainability 2024, 16(24):11009](https://doi.org/10.3390/su162411009)). Your "measures afterwards whether it actually reduced waste" is an in-app self-report diary with a UI on it. It will produce a number. The number will be reactive (users waste less *because they are logging*), uncalibrated (no baseline, no denominator), and self-selected (only engaged users log). You will not be able to distinguish "our app reduced waste" from "the act of measuring reduced waste" from "only the tidy people kept logging."

### What would defeat Front 1

Concede or collect, in rough order of how hard each is to get:

1. **Direct demand evidence for the explanation.** 15–20 structured interviews or a screener survey with real home cooks in which you show two mock recommendation cards — one bare, one with "Chosen because your spinach expires Thursday and your chicken expires Friday" — and measure *choice*, not *rated helpfulness*. Defeating evidence looks like: a majority preferring the explained card **and** naming a concrete consequence ("I'd trust it enough to cook it"). Attitudinal Likert agreement does not count; the JMIR study already got that and behaviour didn't move.
2. **An unprompted user complaint.** Find ≥10 App Store / Reddit / forum posts where a user complains they *don't know why* an app suggested a meal, or distrusts a suggestion because they can't see what it's based on. If those posts don't exist across 14 products and years of reviews, the need is imagined. (I searched and found complaints about crashes, unreliable imports, quantity tracking, and manual entry — not about missing rationales.)
3. **Evidence that inventory can be kept current without manual effort.** A measured 2-week diary from ≥5 households showing pantry accuracy above some stated threshold without receipt/loyalty import. If you can't clear this bar, Plan to Eat's post-mortem stands and your audit trail points at stale data.
4. **A defensible waste instrument.** Show a measurement design that survives the diary critique — e.g. photo-plus-weight capture (see [FoodImage™ RCT](https://pmc.ncbi.nlm.nih.gov/articles/PMC7409719/)) with a pre-intervention baseline period. If your measurement is a "did you throw it out?" toggle, concede the third claim outright and drop it from the pitch.

---

## FRONT 2 — You cannot build it

### 2.1 The arithmetic

160 person-hours total, four people, four weeks, **build and test**. Realistic deductions before a line of code:

| Item | Hours |
|---|---|
| Coordination: 4 people × 4 weekly syncs × 1h | 16 |
| Env setup, Supabase/Gemini key wrangling, merge conflicts, CI | 12 |
| Course deliverables: report, slides, demo video, README/rubric artifacts | 20 |
| Regression-testing the 20 existing use cases after schema changes | 20 |
| **Remaining for new build + new tests** | **~92** |

Ninety-two hours. Split four ways in a stack most of the team knows unevenly, that is roughly **one engineer-month of focused work** for three architectural changes, not three features.

### 2.2 The thing that specifically does not fit: faithful explanation is an architecture change, not a UI panel

This is the attack that should worry you most, and it is a correctness argument, not a scheduling one.

Your recommender is Gemini 2.5 Flash consuming a free-text goal. If you ask Gemini to *also* output a rationale, what you get is a post-hoc narrative, not a causal account of the ranking. That is not speculation; it is the documented failure mode. Turpin et al., *Language Models Don't Always Say What They Think* (NeurIPS 2023, [arXiv:2305.04388](https://arxiv.org/abs/2305.04388)) show model-produced explanations "can systematically misrepresent the true reason for a model's prediction," and that plausible-but-misleading explanations **increase user trust without justifying it**.

So an LLM-authored "why" string is worse than no explanation: you would be shipping an *auditability* claim backed by a confabulation generator. A well-informed critic will say this in one sentence and your entire differentiator collapses.

The only honest fix is to invert the architecture: build a **deterministic scorer** (inventory match × expiry urgency × dietary constraint × nutrient goal delta), emit a machine-readable provenance record per recommendation (which pantry row, which expiry date, which weight, which points), rank with that, and demote Gemini to *phrasing* a rationale that is generated **from the provenance record only**. That is the right design — and it means:

- rewriting the AI meal-plan recommendation use case you have already shipped and tested,
- defining and defending scoring weights (you have no data to fit them, so they are guesses you must justify),
- building a provenance schema and persisting it per recommendation,
- adding a **faithfulness test suite** — perturb one pantry item's expiry date, assert the ranking *and the rationale* both change in the predicted direction. Without this suite you have not demonstrated auditability, you have demonstrated a text field.

Honest estimate: 30–40 hours including tests, for one person who does nothing else. That alone is ~40% of your remaining budget.

### 2.3 The uncertainty model is a schema migration in disguise

"Inventory as uncertain, not authoritative" means a quantity is no longer a scalar. It becomes something like `(estimate, confidence, last_verified_at, source)`, with a decay function and a correction loop. That touches:

- the DB schema and every query over it,
- the inventory list UI (colour-coding is already four-state: expired/critical/warning/unknown — now cross it with confidence and you have a 12-state visual language to design and test),
- the **inventory match percentage** on recipe browsing (what is a match percentage against a probability distribution?),
- the AI suggestion ranking,
- the shopping-list generation,
- the purchased→inventory transfer flow (new items arrive at high confidence; cooked items decay),
- and the explanation itself, which must now say "probably" — at which point a critic asks what your audit trail is actually auditing.

Realistic: 25–35 hours to do properly, and it is the change most likely to break the 20 shipped use cases. Note also that the hard part is not the code, it is deciding the decay model, and you have **zero consumption data** to fit one. Eat This Much's solution — decrement when the plan says you should have eaten it, and ask the user to correct it ([help.eatthismuch.com](https://help.eatthismuch.com/help/how-does-the-pantry-system-work)) — is the naive version and is already shipped by a competitor.

### 2.4 The outcome measurement is temporally impossible, not merely expensive

You cannot measure whether your app reduced waste inside the window in which you are building the app. A minimally credible within-subject design needs a **baseline period before the intervention exists**, then an intervention period, then analysis. Your intervention does not exist until roughly week 3 of a 4-week project. Even a 1-week baseline + 1-week treatment with n=8 friends is underpowered to the point of meaninglessness — and it is a self-report diary, which the literature says is unsuitable for exactly this purpose (§1.5).

What you can honestly build in the budget is the **instrument**: a waste-logging event, a denominator (items acquired), and a dashboard. What you cannot honestly claim is a *result*. If your report says "our app reduced waste by X%," a reviewer who knows the diary literature will not believe the number, and they will be right.

### 2.5 Testing non-determinism will eat more than you think

Every Gemini-touching path is non-deterministic. You have three options and all cost: (a) golden-set + tolerance assertions (expensive to author, flaky), (b) mock the LLM (fast, tests nothing about the feature you're claiming), (c) don't test it (then your "auditable" claim has no test backing it). Budget 10–15 hours to get option (a) working even minimally, or accept that your headline feature ships untested.

### 2.6 Prediction: what you will get to 70% and have to cut

Stated plainly so you can check me in four weeks:

1. **The confidence model degenerates into a "last updated 6 days ago" badge.** No decay function, no Bayesian anything — a timestamp rendered as grey text. Defensible as UI, indefensible as "treats inventory as uncertain."
2. **The explanation degenerates into a Gemini-authored sentence.** No provenance record, no faithfulness tests, no guarantee the cited pantry item influenced the ranking. This is the 70%-done item that *looks* 100% done in a demo and is 0% done as a claim.
3. **Waste measurement degenerates into a "I threw this out" button** with no denominator and no baseline, plus a chart with n≈12 events from your own team.
4. **Evaluation degenerates into a 5-person convenience demo** with a Likert questionnaire, from which you will report "4.2/5 found the explanations helpful."
5. **Regression coverage on the 20 existing use cases gets cut first**, because it is invisible in a demo.

### 2.7 What you could actually finish in 92 hours (constructive, so the attack is fair)

Drop to **one** claim: *auditable, expiry-traceable recommendation.* Build a deterministic scorer with a published formula, a provenance record, a "why this meal" drawer that renders the provenance (not LLM prose), and a perturbation test suite that proves the explanation is faithful to the ranking. Keep Gemini strictly for wording. Ship the waste-logging instrument with *no* effectiveness claim, framed explicitly as future work. That is ~60 hours of build, ~30 of test, and it is a defensible SE project. The three-legged version is not.

### What would defeat Front 2

1. **A signed work-breakdown at task granularity** — every task ≤4 hours, with an owner and a test listed, summing to ≤92 hours, including the faithfulness suite and the regression pass. If the WBS sums to 140 and you argue "we'll push," concede.
2. **A spike, done in week 1 and timeboxed to 8 hours**, that produces one real recommendation with a persisted provenance record and one passing perturbation test. If that spike lands, my architecture-change estimate is too pessimistic and you should say so with the commit hash.
3. **Evidence of reusable scaffolding.** If your existing repo already persists scoring intermediates, or already has an integration-test harness over the 20 use cases, my 20-hour regression figure drops and my numbers move.
4. **For the measurement claim only:** a measurement protocol with a baseline period that fits in the calendar. I don't think one exists. If you can draw it, I'll concede that leg.

---

## FRONT 3 — Someone does it better

### 3.1 Auditable, expiry-traceable recommendation: Grocy already ships it, with the formula published, for free

**Grocy** (open source, self-hosted, [grocy.info](https://grocy.info/)) has a feature called **Due Score**. From its own changelog, verbatim:

> "A number (new column on the recipes page) which represents a score which is higher the more ingredients, of the corresponding recipe, currently in stock are due soon, overdue or already expired… The score is in detail based on: 1 point for each due soon ingredient (based on the stock setting 'Due soon days'), 10 points per overdue ingredient, 20 points per expired ingredient (or else 0). The corresponding ingredient is also highlighted in red/yellow/grey."
> — [grocy.info/changelog](https://grocy.info/changelog)

Read that against your claim. Expiry-driven ranking: yes. Traceable to specific pantry items: yes — the contributing ingredients are individually highlighted. Auditable: **more auditable than anything you can build on Gemini**, because the weights are integers, published, user-inspectable, and reproducible. Plus stock with due dates, per-entry stock tracking, a stock journal, consume/open actions, and "see at a glance whether everything you need is in stock at home."

Note the sting: your product's own expiry colour-coding is red/amber/grey four-state, the same design, and your ranking is an opaque LLM. On the specific axis you want to claim, **a free hobbyist project beats you on the merits today.**

### 3.2 Inventory-as-uncertain: Cooklist solved the harder version by deleting the problem

**Cooklist** ([cooklist.com/cooklist-app](https://cooklist.com/cooklist-app)) imports purchases from **81 US retailers** via loyalty-card linking or barcode scan, **"automatically calculates expiration dates and notifies you before they expire,"** and models consumption — it "learns which brands you prefer and understands the cadence that your household buys products," with "running low" notifications. That *is* a probabilistic inventory: a purchase-history-derived estimate with a replenishment model, shipped, at consumer scale.

Your version asks the user to type it in and then apologises for being wrong. Cooklist's version doesn't ask. When a critic asks "why would I use yours," the honest answer today is "because ours is a class project."

(Cooklist has real, reported weaknesses — scanning crashes, flaky store imports, no proper quantity granularity, per third-party roundups. Those are *execution* gaps you could attack. "We explain ourselves better" is not one of them.)

### 3.3 Zero-entry inventory: Samsung, with Gemini, in the appliance

Samsung's Bespoke AI Family Hub uses **AI Vision Inside** — an internal camera that recognises items going in and out, with expiry alerts on the 32" panel and recipe recommendations from what's on hand — and Samsung has announced an expanded food-recognition version **built with Google Gemini** ([Samsung Global Newsroom](https://news.samsung.com/global/samsung-expands-ai-capabilities-of-bespoke-ai-refrigerator-family-hub-with-major-updates), [Samsung US](https://www.samsung.com/us/explore/family-hub-refrigerator/overview/)). The recognition set is limited (~33 fresh items) and it's a premium appliance — but the strategic point stands: the intake problem is being solved in hardware by the company that also owns Samsung Food, and it is using the same model you are.

### 3.4 The other two legs of your claim are already "yes" in your own table

You verified these yourself:

- **Expiry-prioritised recipes + loop closure:** Samsung Food Food+ — "Recipes that are containing items that are about to expire will be prioritized," plus a genuine did-you-cook-it confirmation: mark "Made It," app suggests removing used ingredients ([support.samsungfood.com](https://support.samsungfood.com/hc/en-us/articles/30025317487508-Getting-Started-with-Food-List)).
- **Waste outcome measurement:** KitchenPal — "Track what gets wasted and why. Identify patterns and adjust buying habits" ([kitchenpalapp.com](https://kitchenpalapp.com/en/expiry-date-tracker.html)). PantryWise — "a dashboard that breaks down your food waste cost to the dollar — per week, per month, and per year." OH, a potato! — "Every cooked meal = tracked money and carbon savings." Eatvora — "a real savings counter."
- **All three legs in one free app:** **Remy** — expiry-aware reminders that "suggest a recipe that uses it," inventory that updates after cooking, and "See your real impact: food saved, money saved, CO₂ avoided," free on iOS and Android ([remyapp.io](https://www.remyapp.io/blog/what-is-the-remy-app-ai-kitchen-assistant-explained), [App Store](https://apps.apple.com/us/app/remy-ai-kitchen-assistant/id6657992254)).

So of your three claims, two are shipped by multiple named competitors and the third is defeated by an open-source project with a published integer formula. What remains is "all three in one product, on the web, by four students." That is an integration claim, not a novelty claim, and integration claims do not survive a competitive review.

### 3.5 The floor is crowded and the tech is commodity

Two supporting observations, each independently damaging:

- **The category is saturated with near-identical listings.** A single App Store search surfaces FridgeBuddy, Pantrino, Panzy, PantrackR, iPantry, Pantry Check, Fridge and Pantry Inventory, Food Stock, and more — plus 2026-vintage entrants Pantryfy, Recipy, Pantry Persona, NowCook, PantryPic. (These last are SEO-heavy sites; treat their editorial claims as marketing, not evidence — but their *existence* is the evidence.)
- **Your core technology is a weekend tutorial.** Searching for "Gemini + fridge photo → recipes" returns a wall of individual developers' DEV.to and Medium posts and a Gemini API competition entry, all doing multimodal fridge-to-recipe generation ([ai.google.dev/competition/projects/geminicook](https://ai.google.dev/competition/projects/geminicook), and numerous dev.to write-ups). A differentiator that hundreds of hobbyists have independently shipped in a weekend is not a differentiator.

### What would defeat Front 3

1. **Kill Grocy specifically.** Install it, use its Due Score on a real pantry for a week, and document a concrete failure your design fixes — e.g. Due Score ranks by expiry only and ignores nutrient goals and dietary constraints, or it cannot express *partial* stock, or it collapses when the stock is wrong. A demonstrated, reproducible failure of the closest competitor's actual behaviour beats any amount of feature-table arguing. Without this, "auditable expiry-traceable planning" is not yours to claim.
2. **Turn `explains_why_recommended` from "unknown" into "confirmed no."** Your table is honest that most of those cells are *unknown from marketing copy*, which is not the same as absent. Install Samsung Food (Food+ trial), KitchenPal, Remy, Eatvora and Xpiry, generate a recommendation in each, and **screenshot the recommendation card**. If none of the five shows a rationale, you have a real finding. If two of five do, the gap is gone and you should say so before a reviewer does.
3. **Show an axis where integration genuinely creates a new capability.** "Grocy has the score but no nutrient goals; Samsung Food has the loop but paywalls it and doesn't explain; Cooklist has the intake but no explanation" is only interesting if you can name a *user task* that is impossible in each of them individually. Name the task. If you can't, this is a feature bundle, not a product thesis.
4. **Fix the comparison class.** Your table benchmarks against consumer mobile apps. The correct comparison for an auditable ranker is Grocy (open source) and general-purpose LLM assistants (free, already explain themselves conversationally). Redo the table with those two rows in it and see whether the gap survives.

---

## The one question to answer before you commit

Fourteen products, several funded, several sitting on the pantry and expiry data required, independently chose not to ship a recommendation rationale. Plan to Eat built the pantry your claim depends on and deleted it, in public, with reasons. Kitche shipped your feature set for seven years and was retired. Remy ships all three legs for free and has two US ratings.

**What do you know that they don't?**

If the answer is "nothing, but nobody has combined it on the web with a nutrient dashboard," say that plainly and scope the project to one defensible claim (§2.7). If the answer is "explanations build trust," the JMIR deployment already tested that and got understanding without behaviour change and 41-of-136 completion. And if the answer is "we'll measure the waste reduction and prove it" — you have four weeks, no baseline period, and a measurement instrument the literature explicitly rules out for evaluating interventions.

---

**Sources**

- [Plan to Eat — why the Pantry was discontinued](https://learn.plantoeat.com/help/a-digital-pantry-inventory-does-it-really-help)
- [Grocy — ERP beyond your fridge](https://grocy.info/) · [Grocy changelog, Due Score formula](https://grocy.info/changelog)
- [Cooklist — retailer import, auto expiry, purchase cadence](https://cooklist.com/cooklist-app)
- [Samsung Food — expiry-prioritised recipes, "Made It" loop](https://support.samsungfood.com/hc/en-us/articles/30025317487508-Getting-Started-with-Food-List)
- [Samsung — Bespoke AI Family Hub with Gemini](https://news.samsung.com/global/samsung-expands-ai-capabilities-of-bespoke-ai-refrigerator-family-hub-with-major-updates) · [Family Hub overview](https://www.samsung.com/us/explore/family-hub-refrigerator/overview/)
- [KitchenPal — expiry tracking and waste-pattern tracking](https://kitchenpalapp.com/en/expiry-date-tracker.html)
- [Remy — what the app does](https://www.remyapp.io/blog/what-is-the-remy-app-ai-kitchen-assistant-explained) · [Remy on the US App Store (2 ratings)](https://apps.apple.com/us/app/remy-ai-kitchen-assistant/id6657992254)
- [The Grocer — Remy acquires Kitche; Kitche app retired](https://www.thegrocer.co.uk/news/new-ai-household-food-waste-reduction-app-remy-acquires-rival-kitche-to-boost-user-base/701748.article) · [Tech.eu coverage](https://tech.eu/2025/02/17/restaurant-platform-remy-acquires-food-waste-app-kitche/)
- [JMIR Formative Research — food-waste apps crossover trial, no significant reduction](https://pmc.ncbi.nlm.nih.gov/articles/PMC9482070/)
- [Waste Management — diaries vs. waste compositional analysis](https://www.sciencedirect.com/science/article/pii/S095965262031310X) · [Sustainability — under-reporting in food waste diaries](https://doi.org/10.3390/su162411009) · [FoodImage™ RCT](https://pmc.ncbi.nlm.nih.gov/articles/PMC7409719/)
- [JMIR mHealth uHealth — explanation interface for healthy food recommendations](https://pmc.ncbi.nlm.nih.gov/articles/PMC11835786/)
- [ACM TOIS — Are Your Explanations What Users Need?](https://dl.acm.org/doi/10.1145/3565480)
- [Turpin et al., Language Models Don't Always Say What They Think (NeurIPS 2023)](https://arxiv.org/abs/2305.04388)
- [JMIR mHealth — self-monitoring adherence patterns](https://mhealth.jmir.org/2017/2/e8/) · [Defining adherence to mobile dietary self-monitoring](https://pubmed.ncbi.nlm.nih.gov/31155473/)
- [UXCam — mobile app retention benchmarks by industry](https://uxcam.com/blog/mobile-app-retention-benchmarks/)
- [World 2026 — food waste behaviours survey + educational intervention](https://doi.org/10.3390/world7030042) · [Sustainability — Less Is More: integrated mobile application](https://www.mdpi.com/2071-1050/15/13/10597)
- [Google AI — GeminiCook competition entry (fridge-to-recipe as commodity)](https://ai.google.dev/competition/projects/geminicook)
- [Eat This Much — plan-based pantry depletion](https://help.eatthismuch.com/help/how-does-the-pantry-system-work)
