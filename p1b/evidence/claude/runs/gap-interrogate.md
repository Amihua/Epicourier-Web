# gap:interrogate

**Workflow:** P1b Claude market survey (run 1)  
**Phase:** Gap  
**Model:** Claude Opus 5 (1M context), `claude-opus-5[1m]`  
**Agent id:** `a48eefe71b7d13774`  
**Tool calls:** 32 total — 8 web searches, 9 pages fetched  
**Raw transcript:** `raw/agent-a48eefe71b7d13774.jsonl` (full tool-call trace, retained)

---

## Prompt, exactly as issued

```text
You are testing market-gap claims to destruction. Your reward is KILLING a bad gap now
rather than at the poster session.

OUR PRODUCT:
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

VERIFIED RIVAL FEATURE MATRIX (only products that survived fact-checking):
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

ERRORS ALREADY CAUGHT IN THIS RUN (so you know how unreliable the first pass was):
[
  {
    "product": "Mealime",
    "correction": "URL resolves (HTTP 200) and the headline quote is verbatim - no misquote here. The analyst's version drops the lead-in; the full sentence is 'To our wonderful Mealime users, we regret to inform you that Mealime will be discontinued as of October 21, 2026.'"
  },
  {
    "product": "Mealime",
    "correction": "Category error in keeping Mealime in the rival set with a 'main strength': the same page says the product is being retired into a different company's app - 'Mealime was acquired by Albertsons Companies in 2021' and 'we're transitioning customers to Meals Hub as our primary recipe and meal-planning platform on our Albertsons Cos. store apps.' The successor product is Meals Hub inside Albertsons grocery apps, which the analyst never names. Competing against a product that ceases to exist in ~5 weeks is not a finding."
  },
  {
    "product": "Mealime",
    "correction": "Wrong URL in the product 'url' field: https://www.mealime.com/closing is the shutdown notice, not the product page. The 'main_strength' quote is not on that page - it is on https://www.mealime.com/. Anyone re-checking the strength at the stated product URL finds nothing."
  },
  {
    "product": "Mealime",
    "correction": "Price framing error: 'It's Free' is a download call-to-action button label on the homepage, not a pricing statement, and Mealime publishes no Pro price figure anywhere on mealime.com or support.mealime.com (there is a 'Mealime Pro' support category with no figures). The analyst presents a button label as the product's price position."
  },
  {
    "product": "Mealime",
    "correction": "Price note is materially incomplete for 2026-09-13: it reports only that Pro subscribers 'will not be charged further', and omits the decisive sentence on the same page - 'From this point forward, we will wind down Mealime's paid subscriptions, and all Pro recipes & features will become available to all Mealime users.' As of today Mealime is fully free for everyone, not merely paused for existing subscribers."
  },
  {
    "product": "Mealime",
    "correction": "'Join over 4,500,000 others' is repeated as fact without noting it conflicts with Mealime's own US App Store listing, which claims 'With over 7 million users adopting healthier, stress-free lifestyles' (https://apps.apple.com/us/app/mealime-meal-plans-recipes/id1079999103). Both are unaudited vendor marketing; neither is a verified user count."
  },
  {
    "product": "Mealime",
    "correction": "Omission relevant to any migration or data-portability comparison: '/closing' states 'All personal data will be deleted when the Mealime application is shut down.' and 'Certain preferences and settings will need to be established directly within Meals Hub.'"
  },
  {
    "product": "Mealime",
    "correction": "Not an error, recorded for completeness: the all-'unknown' feature row is defensible. I independently checked support.mealime.com and found no pantry, inventory, or expiry article, so the honest cells really are 'unknown' leaning no."
  },
  {
    "product": "Plan to Eat",
    "correction": "pantry='yes' is unsupported by the only URL the analyst cited. The strings 'pantry', 'staple', 'inventory' and 'expir' appear ZERO times in the full rendered text of https://www.plantoeat.com/ (verified by grep on the fetched HTML). A feature was marked 'yes' with no quotable page text behind it."
  },
  {
    "product": "Plan to Eat",
    "correction": "pantry='yes' is contradicted by the vendor's own documentation. https://learn.plantoeat.com/help/a-digital-pantry-inventory-does-it-really-help says the Pantry existed and was removed: 'In early versions of Plan to Eat we had a feature called the Pantry... Here is what we learned, why we discontinued this feature, and why we don't think it makes sense to have an online ingredient inventory built into Plan to Eat', and 'Plan to Eat is not your kitchen and it doesn't know what you have.' Marking pantry 'yes' inverts the vendor's stated position."
  },
  {
    "product": "Plan to Eat",
    "correction": "The nearest live feature is weaker than 'pantry' and the analyst never found it: the Staples List is explicitly static and does NOT deduct from the shopping list - 'While these items will not be automatically removed from your Shopping List, this will allow you to easily check to see what you have on hand' (https://learn.plantoeat.com/doc/use-the-staples-list-for-frequently-purchased-items). The correct cell is 'partial', not 'yes'."
  },
  {
    "product": "Plan to Eat",
    "correction": "Price is right but incomplete: missed 'Purchasing through the Apple App Store is $54.99 because Apple charges us a fee for payments made through the app' (https://learn.plantoeat.com/help/how-much-does-plan-to-eat-cost). An iOS buyer pays $54.99/yr, 12% more than the quoted $49. Also missed the 14-day no-card trial, the 60-day refund policy, and the absence of any free tier."
  },
  {
    "product": "Plan to Eat",
    "correction": "plans_from_expiring='unknown' was recorded without checking the help centre, which does document the only use-it-up mechanism: 'You can also use the With Ingredient filter to then find recipes with the items you know you have and want to use up!' It is manual and not expiry-driven, so the cell stays 'no/unknown' - but the analyst reached the right cell by not looking rather than by checking."
  },
  {
    "product": "Plan to Eat",
    "correction": "expiry='unknown' likewise missed the one date-tracking feature in the product, the Freezer: 'The Freezer keeps track of the servings, number of meals, and the date frozen' (https://learn.plantoeat.com/help/app-freezer-cooking). Still not expiry tracking, but it is the relevant adjacent feature and it was not surfaced."
  },
  {
    "product": "Plan to Eat",
    "correction": "Not errors: the quoted_evidence sentence, the price sentence '$5.95/mo or $49/year if you choose to subscribe', and the main_strength sentence 'The meal planning calendar lets you plan ahead for any length of time, save meal plans to reuse in the future' are all verbatim on https://www.plantoeat.com/. The URL resolves HTTP 200 and the product is real (iOS app 'Plan to Eat' by Plan to Eat, LLC, v4.0.6, updated 2026-09-09)."
  },
  {
    "product": "Paprika Recipe Manager 3",
    "correction": "Price claim is wrong about the site: 'the site says each platform version is sold separately without giving figures' is false. https://www.paprikaapp.com/windows/ states 'Buy Now $29.99' and '$29.99 is the sale price in US dollars, actual pricing may vary depending on country/currency and sales tax/VAT.' The analyst generalised from the two pages they happened to fetch to the whole site, and reported an absence that does not exist."
  },
  {
    "product": "Paprika Recipe Manager 3",
    "correction": "Prices were obtainable and should have been recorded, as of 2026-09-13: iOS $4.99 (apps.apple.com/us/app/paprika-recipe-manager-3/id1303222868), Mac $29.99 (id1303222628), Windows $29.99 (official site). This matters to the comparison: Paprika is a one-time purchase per platform with no subscription ('Paprika Cloud Sync is included with your purchase of the app and there are no extra fees'), a fundamentally different model from Plan to Eat's $49/yr - and the analyst's 'not stated' hid that difference."
  },
  {
    "product": "Paprika Recipe Manager 3",
    "correction": "Homepage quote is mis-attributed and altered. 'Keep track of your groceries and what you have on hand' is NOT visible body copy on https://www.paprikaapp.com/. It exists only as the title/alt attribute of a screenshot thumbnail, reading in full 'The pantry - keep track of your groceries and what you have on hand.' The analyst capitalised the fragment and dropped 'The pantry - ', presenting an image caption as a homepage feature statement. The homepage's visible feature list (Seamless Cloud Sync, Web Importing, Smart Grocery Lists, Interactive Recipes, Tools to Help You Cook, Monthly Meal Planning) never mentions the pantry at all."
  },
  {
    "product": "Paprika Recipe Manager 3",
    "correction": "plans_from_expiring='no' is a denial the pages do not support. Both user guides are simply silent on it, and per the evidence rule silence means 'unknown', not 'no'. A hard 'no' in a competitive matrix asserts the vendor does not do something, which no retrieved page states."
  },
  {
    "product": "Paprika Recipe Manager 3",
    "correction": "closes_loop='unknown' under-reports: the guides do document a per-recipe outcome field - 'Rating - A star rating from 0 to 5 for this recipe' - and a 'Top Rated' sort. It is weak evidence (manual metadata, no cooking/waste outcome, no feedback into planning), but it is quotable page text and 'partial' is more accurate than 'unknown'."
  },
  {
    "product": "Paprika Recipe Manager 3",
    "correction": "Scraping caution, not an analyst error, but it would have burned them: https://www.paprikaapp.com/ contains an HTML-commented banner reading 'Annual Thanksgiving & Black Friday Sale - All versions of Paprika are currently on sale until the end of November.' It is inside <!-- --> and is NOT live on 2026-09-13, but naive HTML-to-markdown converters surface it as visible text. Do not cite it as a current promotion."
  },
  {
    "product": "Paprika Recipe Manager 3",
    "correction": "Not errors: https://www.paprikaapp.com/help/ios/ resolves HTTP 200; both quoted sentences ('...quantity, purchase date, expiration date, and whether it is in stock or out of stock' and 'Ingredients placed in your pantry will automatically be unchecked when you add recipes or meal plans to your grocery list') are verbatim on that page; pantry='yes' and expiry='yes' are correctly supported; and the homepage does say 'Please note: each version of Paprika is sold separately.' The product is real and current (App Store v3.8.5, updated 2026-07-16, Hindsight Labs LLC)."
  },
  {
    "product": "Eat This Much",
    "correction": "MAIN STRENGTH IS CONTRADICTED BY THE ANALYST'S OWN CITED SOURCE. They claimed Eat This Much is 'the only assigned rival that generates plans FROM inventory against nutrient targets in one loop.' The help centre they cited says the opposite, twice: 'We don't have the ability to generate an entire meal plan with just your pantry yet. The chances of finding an ample selection of recipes that fit your pantry and your nutrition targets and your meal preferences is very low, and too difficult for our algorithms at the moment.' (https://help.eatthismuch.com/help/how-does-the-pantry-system-work and https://help.eatthismuch.com/help/can-i-create-meals-using-only-my-pantry-foods, both retrieved 2026-09-13, both 'Last updated on 05 May, 2026'). The exact capability they named — pantry plus nutrient targets in one generation loop — is the exact capability the vendor says it cannot do."
  },
  {
    "product": "Eat This Much",
    "correction": "The word 'priority' in the homepage quote was over-read. 'Our algorithms will use it up with priority' describes re-ranking inside an already-generated plan, not generating a plan from inventory. The pricing page says the same weaker thing: 'Easily see meal suggestions that use up what's in your pantry' (https://www.eatthismuch.com/pricing) — suggestions, not plans."
  },
  {
    "product": "Eat This Much",
    "correction": "PRICE WAS RECOVERABLE; THE ANALYST USED THE WRONG URL. They reported 'Could not capture' from https://www.eatthismuch.com/app/pricing, which is the logged-in web-app route and does return only 'Eat This Much uses features that your browser does not support' (I reproduced that, 200, 14,587 bytes). But the marketing site's own top navigation links to /pricing, not /app/pricing. https://www.eatthismuch.com/pricing returns 200 and is fully server-rendered with figures: 'Free $0.00 / month', 'Premium $5.00 / month *With annual subscription', 'Professional Varies Per client pricing'. Checked 2026-09-13. The href is literally href=\"/pricing\" in the homepage HTML they already had."
  },
  {
    "product": "Eat This Much",
    "correction": "Pantry is a paid feature and this was not disclosed. The analyst recorded pantry='yes' with no tier qualifier. 'The Premium subscription plan includes access to the pantry feature' (https://help.eatthismuch.com/help/how-does-the-pantry-system-work). The pricing page confirms the pantry sits above the Free tier, whose listed features stop at 'Generate daily meals plans / Track what you eat / Add foods from barcodes / Create custom foods and recipes / Schedule recurring foods'."
  },
  {
    "product": "Eat This Much",
    "correction": "closes_loop='unknown' is wrong — the analyst's own cited page documents the mechanism. It is an assumed-consumption decrement ('We remove ingredients from your pantry after you're supposed to have eaten them'), which is a real, quotable behaviour and should have been recorded as partial, with the caveat that no outcome is ever confirmed by the user."
  },
  {
    "product": "Eat This Much",
    "correction": "expiry='no' reached the right answer with no evidence offered. It does hold up — nothing on the homepage, /pricing, or either pantry help article mentions expiry or use-by dates — but the analyst cited nothing, and the /pricing page contains a sentence that superficially cuts the other way ('so you know when foods ... need to be replaced'), which they never retrieved or addressed."
  },
  {
    "product": "Eat This Much",
    "correction": "The 'only assigned rival' superlative is false on a second, independent count: Samsung Food, which the analyst marked 'unknown' on every cell, documents a pantry with use-by dates AND expiry-prioritised recipe surfacing AND a post-cooking inventory decrement. See the Samsung Food verdict."
  },
  {
    "product": "Eat This Much",
    "correction": "NOT AN ERROR, recorded for completeness: the homepage quote is verbatim-accurate. I confirmed 'Add what you already own to the virtual pantry and our algorithms will use it up with priority.' in the raw HTML of https://www.eatthismuch.com/ (200, 52,094 bytes). So are 'At least 90g Carbs At least 40g Fat At least 90g Protein', 'Want to set specific macro targets?', 'Review your meals for the week and the grocery list automatically updates.', and both help-doc quotes. The URL https://help.eatthismuch.com/help/how-does-the-pantry-system-work is also canonical — the page self-links to that exact slug."
  },
  {
    "product": "Samsung Food (formerly Whisk)",
    "correction": "pantry='unknown' IS WRONG, AND THE EVIDENCE WAS ON THE PAGE THEY QUOTED FROM. The Samsung Food+ feature list on https://apps.apple.com/us/app/samsung-food-meal-planner/id1133637674 contains six bullets. The analyst quoted two of them ('AI-personalized weekly meal plans tailored to your health goals.' and 'Nutrition tracking with adaptive meal plans to help you meet your goals.') and skipped the one sitting between them: 'Automated pantry management with personalized cooking suggestions.' I extracted the full description from the page's JSON-LD block (script id=software-application). Google Play's independent listing says the same: 'Automated pantry suggestions and food tracking'."
  },
  {
    "product": "Samsung Food (formerly Whisk)",
    "correction": "expiry='unknown' IS WRONG. Samsung Food's official help centre documents editable use-by dates per item: 'Tap any item to edit details such as storage location or use-by date' / 'Edit Use-by date' / 'You can disable use-by-date tracking for certain items if needed.' (https://support.samsungfood.com/hc/en-us/articles/30025317487508-Getting-Started-with-Food-List, updated 2025-05-15, retrieved 2026-09-13)."
  },
  {
    "product": "Samsung Food (formerly Whisk)",
    "correction": "plans_from_expiring='unknown' IS WRONG. 'Recipes that are containing items that are about to expire will be prioritized.' (https://support.samsungfood.com/hc/en-us/articles/30251599415956-How-to-Search-for-Recipes-Using-Your-Available-Ingredients, updated 2026-03-24, retrieved 2026-09-13). This is the single capability the analyst awarded to Eat This Much as a unique strength, and Eat This Much explicitly does not have it while Samsung Food does."
  },
  {
    "product": "Samsung Food (formerly Whisk)",
    "correction": "closes_loop='unknown' IS WRONG. 'After cooking, mark the recipe as \"Made It\". The app will suggest removing the used ingredients from your Food List' (same Food List help URL). Samsung Food closes the loop on actual cooking outcome; Eat This Much only assumes consumption. The analyst's matrix inverts the real ranking on this dimension."
  },
  {
    "product": "Samsung Food (formerly Whisk)",
    "correction": "THE REQUIRED INDEPENDENT SEARCH STEP WAS NOT PERFORMED. All five Samsung cells came back 'unknown' because the analyst never looked past the App Store listing. Samsung Food's help centre (support.samsungfood.com) answers four of the five. Note for reproducibility: support.samsungfood.com and samsungfood.com both return HTTP 403 to curl and to WebFetch; the content is retrievable through the Zendesk JSON API, e.g. https://support.samsungfood.com/api/v2/help_center/en-us/articles/30025317487508.json (200). A 403 on the marketing domain is not evidence of absence."
  },
  {
    "product": "Samsung Food (formerly Whisk)",
    "correction": "CATALOGUE SIZE IS MISQUOTED BY CONFLATION. The analyst wrote 'Largest catalogue ... \"Access detailed nutrition information and health scores on over 218,500 recipes\"'. 218,500 is the count of recipes carrying nutrition/health scores, not the catalogue. The catalogue figure on the same page is a different bullet: 'Discover over 240,000 public recipes, including 124,000 fully guided ones.' Using the nutrition-scored subtotal as the catalogue size understates it by ~21,500 and mislabels what the number measures."
  },
  {
    "product": "Samsung Food (formerly Whisk)",
    "correction": "'Largest catalogue ... of anything I retrieved' is an unsupported superlative. The analyst retrieved no catalogue size for Eat This Much or AnyList — neither page states one — so there was nothing to compare against. The claim is unfalsifiable from the evidence gathered."
  },
  {
    "product": "Samsung Food (formerly Whisk)",
    "correction": "PRICE ATTRIBUTION IS AN INFERENCE PRESENTED AS PAGE TEXT. The analyst wrote 'App Store listing shows Samsung Food+ at $6.99 monthly and $59.99 yearly'. The listing's In-App Purchases block reads only 'Monthly $6.99' and 'Yearly $59.99' — the string 'Samsung Food+' does not appear in that block. The prices and the free tier are otherwise correct."
  },
  {
    "product": "Samsung Food (formerly Whisk)",
    "correction": "NOT AN ERROR, recorded for completeness: all four quoted strings are verbatim on the page — 'Plan your weekly meals, turn them into smart shopping lists, and share them with friends or family.', 'Access detailed nutrition information and health scores on over 218,500 recipes.', 'Nutrition tracking with adaptive meal plans to help you meet your goals.', and 'AI-personalized weekly meal plans tailored to your health goals.' The URL resolves (200, 703,549 bytes), app name 'Samsung Food: Meal Planner', developer 'Whisk food', copyright '© 2026 Foodient Ltd.', 4.8 from 6,337 ratings. The '(formerly Whisk)' framing is accurate."
  },
  {
    "product": "Samsung Food (formerly Whisk)",
    "correction": "WARNING for anyone re-running this check: a naive keyword grep of that App Store page for 'expir' returns hits, but every one of them belongs to a DIFFERENT app in the 'You Might Also Like' shelf — chiefly Cooklist ('Food and pantry inventory expiration notifications', 'Automatic cooking recipes with ingredients that is expiring soon'). None are Samsung Food's text. Samsung Food's own description contains zero occurrences of 'expir'. Quotes must be taken from the software-application JSON-LD record, not the raw page."
  }
]

Consider these four candidate gaps, and any better one you find:
G1. No product explains WHY a recipe was recommended in terms the user can audit and correct —
    which pantry lots, which expiry dates, which nutrient constraint, which substitution.
G2. No product closes the loop: nothing measures, after the fact, whether the plan it produced
    actually reduced the food you threw away or hit the target you set.
G3. No product treats the pantry as uncertain — everything assumes the inventory is accurate,
    which is exactly why people abandon pantry apps.
G4. No product connects a training/calorie-deficit target to the specific groceries you must buy
    this week, given what you already have.

For EACH: list five findable items that would CONFIRM the gap (reviews begging for it, dead
products that tried it, forum threads, competitor roadmaps that dodge it) and the evidence that
would REFUTE it (an existing product we missed, evidence nobody wants it). Then actually go
look for each item and mark it FOUND with a source, or NOT_FOUND.

If the refuting evidence wins, say GAP_DEAD plainly. We want at least one gap killed in this
run; a run that confirms everything is a run that checked nothing.

Finally, for each surviving gap, state a measurable claim with a metric, a threshold and a
baseline — something four students could actually evaluate inside one month.
```

## Searches actually run

- `meal planning app macro targets automatic grocery list "grocery list" calorie deficit weekly`
- `recipe recommendation app "why this recipe" explanation reason recommended pantry ingredients`
- `reddit pantry inventory app "too much work" keeping updated abandoned stopped using`
- `reddit meal planning app pantry tracking "gave up" OR "stopped using" inventory never accurate`
- `Cooklist "pantry check" confirm still have items automatically predicts what you have used`
- `"food waste" app "measured" OR "study" meal planning app reduce food waste evidence randomized`
- `study household food inventory app "manual entry" burden abandonment barrier adoption pantry tracking research`
- `"explainable" recipe recommendation "food waste" user study explanation why recommended 2025`

## Pages actually fetched

- https://www.eatthismuch.com/   — asked: Quote verbatim any text about: calorie/macro targets, weight goals, generating a weekly grocery/shopping list 
- https://www.prospre.io/meal-plan-generator   — asked: Quote verbatim any text about: calorie/macro targets, weight loss or deficit, grocery list generation, pantry 
- https://play.google.com/store/apps/details?id=com.prospre&hl=en_US   — asked: Quote verbatim the full app description, especially any text about grocery lists, macro targets, pantry, ingre
- https://www.prospre.io/   — asked: Quote verbatim all feature descriptions, especially: grocery list, macro/calorie goals, pantry or ingredients 
- https://cooklist.co/   — asked: Quote verbatim any text about: "pantry check", confirming or verifying what you still have, estimating how muc
- https://cooklist.com/cooklist-app   — asked: Quote verbatim any text about: pantry check, verifying or confirming what you still have, predicting/estimatin
- https://recipyapp.com/blog/best-pantry-tracking-apps-2026   — asked: Quote verbatim any sentences about why people abandon pantry apps, manual entry, inventory drifting out of syn
- https://arxiv.org/abs/2601.02374   — asked: Quote verbatim the abstract's claims about explainability in food recommendation, and any statement about whet
- https://pmc.ncbi.nlm.nih.gov/articles/PMC9482070/   — asked: Quote verbatim: the sample size, study duration, which apps were tested, and the stated conclusion about wheth

## Response

- **candidate gaps:**
  - _item 1_
    - **gap statement:** No shipped consumer meal/pantry product shows a per-recommendation rationale that names the specific pantry item, its expiry date, the nutrient constraint and the substitution it made, in a form the user can audit and correct.
    - **who wants it:** Users of ingredient-matching pantry apps (Cooklist, Samsung Food, SuperCook) who reject substitutions they cannot see — concretely the Cooklist App Store reviewer of 2023-07-09 who asked for 'an option to choose how closely your pantry meets the recipe requirements instead of random broad matches'.
    - **confirming evidence:**
      - _item 1_
        - **item:** A review begging for auditable/correctable substitution logic
        - **status:** FOUND
        - **source:** Cooklist iTunes customer-review RSS (retrieved 2026-09-13 via https://itunes.apple.com/us/rss/customerreviews/page=1/id=1352600944/sortBy=mostRecent/json ; app page https://apps.apple.com/us/app/cooklist-pantry-meals-recipes/id1352600944 HTTP 200). 1-star, 2023-07-09, 'Broad matches are just annoying': 'Their broad match was some toxic waste candy that I had in my pantry' and 'there should be an option to choose how closely your pantry meets the recipe requirements instead of random broad matches'. The user can see the OUTPUT is wrong but has no surfaced reason to correct.
      - _item 2_
        - **item:** Systematic sweep of the live App Store catalogue for explanation-of-recommendation language
        - **status:** FOUND
        - **source:** 222 unique live US App Store listings harvested 2026-09-13 via the iTunes Search API (8 queries: 'pantry recipe ai', 'fridge recipes ingredients', 'meal plan pantry expiry', 'food inventory expiration', 'use up leftovers app', 'pantry tracker recipes', 'ai meal planner groceries', 'kitchen inventory recipe suggestions'). Regex for explain/tells-you-why/reason-it-picked/rationale returned exactly TWO hits, neither a personalised recommendation rationale. Negative result, reported as such.
      - _item 3_
        - **item:** The market leader's best 'explanation' is a match score, not a reason
        - **status:** FOUND
        - **source:** Samsung Food support centre, already in the verified matrix: 'Each recipe will show how well it matches your selected ingredients, helping you quickly decide what to cook.' (https://support.samsungfood.com/hc/en-us/articles/30251599415956-How-to-Search-for-Recipes-Using-Your-Available-Ingredients). A percentage is an output, not an auditable reason, and no page describes explaining why a MEAL PLAN chose a meal.
      - _item 4_
        - **item:** A dead product that shipped recommendation explanations and failed
        - **status:** NOT_FOUND
        - **source:** No such product surfaced in the 222-listing sweep or in any search this session. Honest empty result — do not claim a graveyard exists.
      - _item 5_
        - **item:** A competitor roadmap/changelog explicitly deferring explanations
        - **status:** NOT_FOUND
        - **source:** No public roadmap retrieved for any rival. Eat This Much's help centre does publish a capability denial ('We don't have the ability to generate an entire meal plan with just your pantry yet', https://help.eatthismuch.com/help/can-i-create-meals-using-only-my-pantry-foods) but that is about pantry-only generation, NOT about explanation. Do not conflate.
      - _item 6_
        - **item:** Rivals in the verified matrix scoring unknown/partial on explains_why_recommended
        - **status:** FOUND
        - **source:** Verified rival matrix supplied to this run: 14 of 14 products are 'unknown' or 'partial' on explains_why_recommended. The two 'partial' cells (Samsung Food match score; Xpiry ingredient-coverage figure) are displayed attributes, not stated rationales.
    - **refuting evidence:**
      - _item 1_
        - **item:** A shipped app that explains why a RECIPE was recommended to you
        - **status:** NOT_FOUND
        - **source:** The only two 'why' hits in 222 listings are off-target and I am recording them so nobody re-finds them and thinks the gap is dead: (1) Cookwise, 'See why each drink pairs with the dish' (https://apps.apple.com/us/app/cookwise-meal-planner/id6759641268, HTTP 200) — a sommelier drink pairing, not a meal recommendation, and not pantry/nutrient/expiry grounded; (2) America's Test Kitchen, recipes 'include "Why This Recipe Works" so you'll know every test kitchen discovery' (https://apps.apple.com/us/app/americas-test-kitchen/id1365223384) — static editorial copy attached to the recipe for all readers, not a per-user rationale.
      - _item 2_
        - **item:** Academic prior art that already solves explainable food recommendation
        - **status:** FOUND
        - **source:** https://arxiv.org/abs/2601.02374 (retrieved 2026-09-13), 'A Lay User Explainable Food Recommendation System Based on Hybrid Feature Importance Extraction and Large Language Models' — abstract states it 'provides more elaborated explanations of the results of food recommendation systems' and gives 'more comprehensive explanations to lay user, compared to those in the literature'. IMPORTANT: this refutes RESEARCH novelty, not the market gap. A paper is not a rival. It does mean the team must not claim to have invented explainable food recommendation. (A second hit, XFoodRec at https://doi.org/10.1145/3805712.3808380, appeared in the search index but I did not retrieve the page, so I am not counting it as evidence.)
      - _item 3_
        - **item:** Evidence that users do not want explanations
        - **status:** NOT_FOUND
        - **source:** No review, forum post or study found arguing explanations are unwanted. Caveat: absence of counter-evidence is weak; I also found no review explicitly asking for 'tell me why', only the Cooklist review asking for control over the substitution.
    - **verdict:** GAP_SURVIVES
    - **narrowed to:** Narrow it from 'nobody explains' to the defensible version: no product surfaces a rationale grounded in specific, checkable inventory rows (item, lot, expiry date) and the constraint that selected them, with an inline correction affordance. Market-gap only — explainable food recommendation is an active research area.
    - **measurable claim:** Two metrics, both runnable offline plus one small lab session, ~40 person-hours total. (a) GROUNDING FIDELITY: over 200 auto-generated meal recommendations from 20 seeded pantries, >=95% of rationale sentences cite only inventory rows that actually exist in the user's Supabase inventory AND state the correct expiry date, verified by an automated harness that string-matches every cited item/date back to the DB. Baseline: Epicourier's current unconstrained Gemini 2.5 Flash free-text output scored by the same harness (measure it first; expect well under 60% because nothing currently constrains citation). Report a hallucinated-citation rate, not a vibe. (b) AUDIT-AND-CORRECT: within-subjects, n=12, each participant sees 6 recommendations where one pantry assumption is deliberately wrong. Metric = success rate at identifying and correcting the wrong assumption within 60s. Threshold: >=80% with the rationale panel vs <=40% with the current inventory-match-percentage-only view (the shipped-competitor baseline, equivalent to Samsung Food's match score). Wilcoxon signed-rank, alpha 0.05.
    - **buildable in 160 hours:** yes
  - _item 2_
    - **gap statement:** No product closes the loop: nothing measures, after the fact, whether the plan it produced actually reduced the food you threw away or hit the target you set.
    - **who wants it:** Claimed audience was households trying to verify their meal planner works. Moot — the claim is factually false.
    - **confirming evidence:**
      - _item 1_
        - **item:** Traditional meal planners (Plan to Eat, Paprika, AnyList, SideChef, Prepear) have no outcome loop
        - **status:** FOUND
        - **source:** Verified rival matrix: all five score unknown/no on closes_the_loop_on_outcome; Paprika's best is a manual 0-5 star rating (https://www.paprikaapp.com/help/ios/). True, but only for the recipe-manager segment, not for the food-waste segment.
      - _item 2_
        - **item:** Peer-reviewed evidence that these apps fail to change waste
        - **status:** FOUND
        - **source:** https://pmc.ncbi.nlm.nih.gov/articles/PMC9482070/ (JMIR Formative Research, retrieved 2026-09-13): '6 students from different study programs (mean age 24.7, SD 2.9)', apps 'Too-Good-To-Go' and 'TotalCtrl Home', 1 month each. Conclusion verbatim: 'Use of apps designed to reduce food waste and personal costs and to improve healthy eating did not result in any measurable effects, that is, no change in food waste.' NOTE: this attacks the VALUE of the loop, it does not support the claim that no product has one.
      - _item 3_
        - **item:** Reviews asking for post-hoc waste measurement
        - **status:** NOT_FOUND
        - **source:** No such review found in the ~200 App Store reviews pulled this session (KitchenPal, NoWaste, Pantry Check, Cooklist, Eat This Much, Samsung Food).
      - _item 4_
        - **item:** A dead product that tried outcome measurement
        - **status:** NOT_FOUND
        - **source:** None surfaced.
      - _item 5_
        - **item:** A competitor roadmap deferring outcome measurement
        - **status:** NOT_FOUND
        - **source:** None retrieved.
    - **refuting evidence:**
      - _item 1_
        - **item:** A shipped product that measures eaten vs. thrown away
        - **status:** FOUND
        - **source:** FridgeBuddy, App Store description under 'Insights & statistics': 'Waste tracker: see what you eat vs. what you throw away' and 'Track your consumption habits over time' (https://apps.apple.com/us/app/pantry-fridge-fridgebuddy/id1500190823, HTTP 200 verified 2026-09-13). This is exactly the behaviour the gap says does not exist.
      - _item 2_
        - **item:** A shipped product that lets you SET a target and then reports performance against it
        - **status:** FOUND
        - **source:** Fango - AI Food Expiry Tracker (https://apps.apple.com/us/app/fango-ai-food-expiry-tracker/id6761494637, HTTP 200): 'Stats: food rescued, food wasted and your rescue rate — week to year' and 'A monthly savings goal you set yourself, or switch off entirely'. Also reconciles the actual outcome per item: 'Act straight from the notification: eaten, wasted, postpone or freeze'. Set-a-target-then-measure-against-it is shipped.
      - _item 3_
        - **item:** A shipped product that feeds measured waste back into the next plan/list
        - **status:** FOUND
        - **source:** Trepo (https://apps.apple.com/us/app/trepo/id6764135986, HTTP 200): 'Trepo sees what you're running low on, what your meal plan needs, and what you've been wasting - then builds your grocery list automatically' and 'TRACK WHAT YOU WASTE. See exactly what gets thrown away and why.' That is measurement feeding the next planning cycle — the full loop.
      - _item 4_
        - **item:** A shipped planner that measures plan adherence against the nutrition target and re-tunes
        - **status:** FOUND
        - **source:** Eat This Much App Store description (https://apps.apple.com/us/app/eat-this-much-meal-planner/id981637806, HTTP 200, retrieved via iTunes lookup 2026-09-13): 'As you follow the plans, you can track what you did or didn't eat, and if you deviate from the plans, we make it easy to readjust your targets for the next week to stay on track.' Directly refutes the 'hit the target you set' half.
      - _item 5_
        - **item:** Further shipped instances (breadth, so this is not one outlier)
        - **status:** FOUND
        - **source:** SeePantry: 'See dollars saved, items rescued, and CO2 avoided — calculated with EPA WARM data' (https://apps.apple.com/us/app/seepantry-meals-recipes-lists/id6759475699); plus the verified matrix already contained KitchenPal ('Track what gets wasted and why'), PantryWise (food-waste cost dashboard per week/month/year), OH a potato! ('Every cooked meal = tracked money and carbon savings'), Eatvora ('a real savings counter'). Seven-plus independent products.
    - **verdict:** GAP_DEAD
    - **narrowed to:** Nothing survives worth building. The only residue is CAUSAL ATTRIBUTION — proving the plan caused the reduction rather than merely co-occurring with it — and that is an experimental-design problem, not a product feature, and it is out of budget (see measurable_claim).
    - **measurable claim:** GAP_DEAD, and the fallback is also dead: NOT EVALUABLE IN 160 HOURS. Any claim of the form 'our plan reduces measured food waste by X% vs baseline' is unfalsifiable at this scale — the closest published trial (JMIR Formative Research, https://pmc.ncbi.nlm.nih.gov/articles/PMC9482070/) ran 6 students for a month per app and found 'no change in food waste', and its own authors conclude 'Large-scale studies with longer duration are needed'. Four students with 160 hours cannot beat that design. Do not put a waste-reduction percentage on the poster; you cannot defend it.
  - _item 3_
    - **gap statement:** No product treats the pantry as uncertain — everything assumes the inventory is accurate, which is exactly why people abandon pantry apps.
    - **who wants it:** Households three weeks into a pantry app whose inventory has drifted — e.g. the NoWaste reviewer (2020-02-27) who scanned 20 items, lost them, and said 'it was tedious and I was too frustrated to do it again'.
    - **confirming evidence:**
      - _item 1_
        - **item:** A major vendor that BUILT a pantry, killed it, and said the reason was that it cannot know your kitchen
        - **status:** FOUND
        - **source:** Plan to Eat, https://learn.plantoeat.com/help/a-digital-pantry-inventory-does-it-really-help (in the verified matrix): 'In early versions of Plan to Eat we had a feature called the Pantry... why we discontinued this feature' and 'Plan to Eat is not your kitchen and it doesn't know what you have.' This is the strongest single item in the whole run — a dead feature killed for exactly this reason.
      - _item 2_
        - **item:** Reviews showing inventory data is wrong in practice
        - **status:** FOUND
        - **source:** NoWaste iTunes review RSS (id=926211004, retrieved 2026-09-13): 2-star 2020-01-16, 'putting in inaccurate expirations dates for certain items'; 4-star 2019-07-17, 'once in a while when you scan the barcode, the wrong expiration date pops up'; 3-star 2019-11-22, 'This app keeps putting my dry beans in my fridge'.
      - _item 3_
        - **item:** Reviews showing abandonment from entry burden
        - **status:** FOUND
        - **source:** Same RSS corpus. NoWaste 4-star 2020-02-27: 'it was tedious and I was too frustrated to do it again'. NoWaste 1-star 2019-05-17: 'Everything I scanned wasn't in the system and I was manually adding everything. After a fee items, I said screw it and moved on to another app.' KitchenPal 2-star 2023-03-15 (id=1084982489): 'After trying to add the first few items, I gave up in frustration.' KitchenPal 4-star 2023-11-18: 'I gave up after two ingredients.'
      - _item 4_
        - **item:** An industry write-up naming inventory drift as the cause of death
        - **status:** FOUND
        - **source:** https://recipyapp.com/blog/best-pantry-tracking-apps-2026 (retrieved 2026-09-13): 'You set up the app on day one with 40 items. You add five on day two. By week two you forget once or twice. By week three the inventory has drifted out of sync with reality' and 'the app becomes worse than useless: it is actively giving you wrong information.' BIAS WARNING: this is a competing app vendor's own marketing blog, not neutral research. Cite it as an industry claim, never as a finding.
      - _item 5_
        - **item:** A rival that silently assumes consumption rather than confirming it
        - **status:** FOUND
        - **source:** Eat This Much, https://help.eatthismuch.com/help/how-does-the-pantry-system-work (verified matrix): 'We remove ingredients from your pantry after you're supposed to have eaten them' and 'If you don't eat something in your plan and don't want us to remove those ingredients, be sure to remove that item from your planner.' The app never asks; it assumes and makes the user clean up.
    - **refuting evidence:**
      - _item 1_
        - **item:** A shipped product that models how much you ACTUALLY use, states the estimate, and invites correction
        - **status:** FOUND
        - **source:** SeePantry (https://apps.apple.com/us/app/seepantry-meals-recipes-lists/id6759475699, HTTP 200 verified 2026-09-13): 'PORTION INTELLIGENCE — LEARNS HOW MUCH YOU ACTUALLY USE. Buy a dozen eggs but only get through 8 before they expire? SeePantry notices, and says so before you buy more — "You usually use about 8 eggs" — with a one-tap adjust.' Also 'SUB-UNIT TRACKING' deducting 5 cloves rather than a whole head, showing '5 cloves left'. This is a learned consumption model plus a correction affordance. It directly contradicts 'everything assumes the inventory is accurate'.
      - _item 2_
        - **item:** A shipped product that presents expiry as an ESTIMATE the user is asked to adjust
        - **status:** FOUND
        - **source:** Fango (https://apps.apple.com/us/app/fango-ai-food-expiry-tracker/id6761494637, HTTP 200): 'AI suggests a shelf life for every item; adjust anything before adding' and 'AI recognizes the products and estimates shelf life: fridge, freezer or pantry'. Corroborated by Pantry Check reviewers describing the same behaviour: 'I love that I can just keep scanning, and the guesstimated expiration date is usually really close' (5-star 2023-08-16, id=966702368 review RSS). Dates are already treated as inferred, not measured.
      - _item 3_
        - **item:** A shipped product that reconciles the record against reality instead of assuming
        - **status:** FOUND
        - **source:** Samsung Food (verified matrix): 'After cooking, mark the recipe as "Made It". The app will suggest removing the used ingredients from your Food List' (https://support.samsungfood.com/hc/en-us/articles/30025317487508-Getting-Started-with-Food-List). Fango goes further with per-item outcome reconciliation from the notification: 'eaten, wasted, postpone or freeze'.
      - _item 4_
        - **item:** A product that propagates inventory uncertainty INTO the recommendation (ranks or gates a plan on the probability the ingredients are still there, or asks a targeted verification question before committing)
        - **status:** NOT_FOUND
        - **source:** Nothing in the 222-listing sweep, the 14-product verified matrix, or any help centre retrieved this session describes this. Every product that models uncertainty (SeePantry, Fango, Eat This Much) collapses it to a point estimate before the recommender ever sees it. This is the only surviving sliver.
      - _item 5_
        - **item:** Evidence nobody wants uncertainty handling
        - **status:** NOT_FOUND
        - **source:** None found.
    - **verdict:** GAP_NARROWED
    - **narrowed to:** The stated gap is FALSE as written — SeePantry learns and states usage estimates with one-tap correction, Fango presents shelf life as an adjustable AI estimate, Samsung Food confirms consumption after cooking. What survives is one step downstream: no product propagates that uncertainty into the recommendation. Nothing ranks a meal plan by the probability its ingredients are actually present, and nothing asks a targeted verification question ('still have the chicken thighs?') before committing a week. HONEST CAVEAT FOR THE TEAM: this sliver overlaps heavily with G1 — a 'we are not sure you still have X, confirm?' prompt IS an auditable-rationale affordance. Do not pitch G1 and G3 as two contributions; they are one.
    - **measurable claim:** Fully offline simulation, no human subjects, ~30 person-hours. Build a drift simulator over Epicourier's own inventory schema: seed 20 pantries of 60 items each, then silently delete k% of rows to model drift (k = 0, 15, 30, 45). Metric = COOKABLE-PLAN RATE: of the 7 meals in a generated plan, the fraction whose ingredients are all actually present in the ground-truth pantry. Baseline = Epicourier's current inventory-match-percentage ranking, measured on the identical seeds. Threshold to claim the contribution: at k=30% drift, uncertainty-aware ranking plus at most 3 targeted verification questions raises cookable-plan rate to >=85%, against a measured baseline (run it before you pick the number — do not assume it). Secondary metric = questions asked per plan, which must stay <=3 or the cure is the abandonment disease. Report the full k-sweep curve, not a single point.
    - **buildable in 160 hours:** yes
  - _item 4_
    - **gap statement:** No product connects a training/calorie-deficit target to the specific groceries you must buy this week, given what you already have.
    - **who wants it:** Claimed audience was people in a cut or a training block who want the shopping list to follow from the macro target. Moot — this is the shipped core product of at least two established rivals.
    - **confirming evidence:**
      - _item 1_
        - **item:** Recipe-manager rivals lack nutrition-target-driven grocery generation
        - **status:** FOUND
        - **source:** Verified matrix: Plan to Eat, Paprika, AnyList, Prepear all document no recommendation engine at all ('Add your recipes, move meals around anytime', https://www.plantoeat.com/). True but irrelevant — they are a different product category and were never the competitor for this claim.
      - _item 2_
        - **item:** Reviews asking for target-to-grocery-list
        - **status:** NOT_FOUND
        - **source:** No such review in the ~200 reviews pulled this session.
      - _item 3_
        - **item:** A dead product that tried it
        - **status:** NOT_FOUND
        - **source:** None surfaced.
      - _item 4_
        - **item:** A competitor roadmap deferring it
        - **status:** NOT_FOUND
        - **source:** None retrieved.
      - _item 5_
        - **item:** Eat This Much admitting it cannot plan from the pantry alone
        - **status:** FOUND
        - **source:** https://help.eatthismuch.com/help/can-i-create-meals-using-only-my-pantry-foods (verified matrix): 'We don't have the ability to generate an entire meal plan with just your pantry yet.' CAREFUL: this is a denial of PANTRY-ONLY generation. G4 does not ask for pantry-only; it asks for target-driven planning that accounts for what you have. Eat This Much does that. This quote does not save the gap.
    - **refuting evidence:**
      - _item 1_
        - **item:** One product doing the entire chain: calorie/macro target -> weekly plan -> grocery list -> discounting what you already own
        - **status:** FOUND
        - **source:** Eat This Much. Target: 'I want to eat [X] calories', 'At least 90g Carbs At least 40g Fat At least 90g Protein' and 'Want to set specific macro targets?' (https://www.eatthismuch.com/, retrieved 2026-09-13). Weekly list: 'Review your meals for the week and the grocery list automatically updates.' (same page) and 'As a premium user, we'll automatically generate a week of meal plans and send them to you with a grocery list via email' (https://apps.apple.com/us/app/eat-this-much-meal-planner/id981637806, HTTP 200). What you already have: 'Add what you already own to the virtual pantry and our algorithms will use it up with priority.' (homepage) and 'Manage your virtual pantry (with a premium account)' (App Store). Every clause of G4 is quotable from one vendor. PRICE, checked 2026-09-13: 'Free $0.00 / month', 'Premium $5.00 / month *With annual subscription' (https://www.eatthismuch.com/pricing).
      - _item 2_
        - **item:** A second, independent product doing target -> weekly groceries, including per-training-day periodisation
        - **status:** FOUND
        - **source:** Prospre - Meal Planner (https://apps.apple.com/us/app/prospre-meal-planner/id1464400657, HTTP 200, developer Prospre Nutrition Inc., retrieved via iTunes lookup 2026-09-13): 'Using your goals and favorite foods, Prospre will automatically plan your meals for the week and tell you exactly what to buy in the grocery store'; 'AUTOMATIC GROCERY LISTS - Get a complete grocery list with the amounts you need to follow your plan'; 'Set your calorie and macronutrient goals'. The TRAINING half specifically: 'With our app, you can set different macros for each day of the week to do whatever macro cycling goals you have.' (https://www.prospre.io/meal-plan-generator, retrieved 2026-09-13). CAVEAT recorded honestly: I found NO pantry/on-hand feature in Prospre — 'pantry' and 'expir' appear zero times in its listing. Prospre kills the target->groceries half, not the 'given what you already have' half.
      - _item 3_
        - **item:** A product doing the 'given what you already have' half explicitly at grocery-list generation
        - **status:** FOUND
        - **source:** Cooklist (https://apps.apple.com/us/app/cooklist-pantry-meals-recipes/id1352600944, HTTP 200): 'simply choose the recipes you want to cook and Cooklist generates a grocery shopping list with only the ingredients that you are missing in your pantry and need to buy.'
      - _item 4_
        - **item:** Newer entrants combining macro tracking, pantry and auto grocery lists
        - **status:** FOUND
        - **source:** Trepo: 'Replace your meal planner, grocery list, macro tracker, inventory manager, and recipe app' and 'Trepo sees what you're running low on, what your meal plan needs... then builds your grocery list automatically' (https://apps.apple.com/us/app/trepo/id6764135986). Souper: 'connects what you eat with what you actually have at home', 'Set personal nutrition goals during onboarding', 'Home inventory for fridge, freezer, and pantry cupboard' (https://apps.apple.com/us/app/souper-pantry-tracker/id6776030353). Both HTTP 200 verified 2026-09-13.
      - _item 5_
        - **item:** Evidence nobody wants it
        - **status:** NOT_FOUND
        - **source:** Not applicable — demand is evidently high enough that multiple funded products ship it.
    - **verdict:** GAP_DEAD
    - **narrowed to:** Nothing defensible survives. The obvious rescue — 'but ours links a TRAINING calendar, not just a calorie number' — is already occupied by Prospre's per-day macro cycling. The other rescue — 'but ours does it from the pantry' — is Eat This Much's shipped pantry-priority generator plus Cooklist's missing-ingredients-only list. Building this would be re-implementing a $5/month commodity with 160 hours and no differentiator.
    - **measurable claim:** GAP_DEAD — no claim recommended. If the team insists on keeping the feature as table stakes rather than as the contribution, the only honest framing is a parity check, not a novelty claim: 'for 30 seeded goal statements, the generated shopping list omits >=90% of items already present in the user's inventory at sufficient quantity', with the baseline being Epicourier's own current shopping-list-from-meal-plan flow measured the same way. That is a regression test, not a poster finding. Spend the budget on G1 instead.
