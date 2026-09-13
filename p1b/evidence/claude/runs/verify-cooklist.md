# verify:cooklist

**Workflow:** P1b Claude dropped-rival verification (run 4)  
**Phase:** Verify  
**Model:** Claude Opus 5 (1M context), `claude-opus-5[1m]`  
**Agent id:** `a084d226e42117a5a`  
**Tool calls:** 47 total — 3 web searches, 1 pages fetched  
**Raw transcript:** `raw/agent-a084d226e42117a5a.jsonl` (full tool-call trace, retained)

---

## Prompt, exactly as issued

```text
You are an adversarial fact-checker. You are checking ONE product, and you are trying to prove
your own team's market claim is wrong.

EVIDENCE RULES:
- Do NOT invent anything. Every claim needs a live URL you actually fetched in this session
  (WebSearch / WebFetch; load with ToolSearch "select:WebSearch,WebFetch" if absent from your
  tool list; curl via Bash is also acceptable and often more reliable).
- Quote 5-25 words of ACTUAL page text for every feature claim, with the exact URL.
- Never infer a feature from a marketing adjective. Only a described behaviour is a feature.
- Write "unknown" rather than something plausible. Silence on a page means unknown, not "no".
- Check the product is actually ALIVE, independently of its marketing site: app-store lookup,
  last release date, last commit. A live marketing page proves a domain is paid for, nothing more.
- Prices change; record them as stated, with the URL, checked 2026-09-13.

THE CLAIM YOU ARE TRYING TO DESTROY — our team's surviving market gap, already narrowed once:

  "No shipped consumer meal/pantry product shows a per-recommendation rationale that names the
   specific pantry ITEM, its EXPIRY DATE, the nutrient constraint and the substitution it made,
   IN A FORM THE USER CAN AUDIT AND CORRECT."

It has already been narrowed once. RecipeFix (App Store id 6759676502) was found to ship the
explanation-of-substitution half — "No black-box AI. Every substitution comes with the culinary
reasoning behind it" — plus natural-language correction and a macronutrient constraint. What
RecipeFix has no trace of is any pantry inventory or expiry date. So the surviving claim is
specifically: NOBODY EXPLAINS A RECOMMENDATION AGAINST INVENTORY STATE AND A DATE.

Your job is to find out whether your assigned product kills even that narrow version. Killing it
is the MOST VALUABLE result you can return. Do not protect the claim.

YOUR ASSIGNED PRODUCT: Cooklist

Cooklist (https://cooklist.com/) syncs with grocery-store loyalty accounts to import
what you actually bought, auto-estimates expiry, and generates missing-ingredients-only shopping
lists. It is load-bearing in TWO of our arguments and was never verified:
- our G1 confirming evidence is a Cooklist App Store review dated 2023-07-09 asking for "an option
  to choose how closely your pantry meets the recipe requirements instead of random broad
  matches";
- our G4 refuting evidence cites Cooklist's missing-ingredients-only list.

Establish: is Cooklist alive (check the App Store / Play listing and last update date)? Does it
recommend recipes, and if so does it show WHY — naming the pantry item and its date? Does
retailer import mean it knows purchase dates, and does it surface them? Also try to re-find that
2023-07-09 review through the iTunes customer-review RSS feed
(https://itunes.apple.com/us/rss/customerreviews/id=<trackId>/json) and quote it exactly, because
we cite it and have never independently confirmed it.

Fetch pages. Quote them. If you cannot establish something, say "unknown" — but exhaust the
obvious sources first: the official site, the docs, the help centre, the app-store listing, the
GitHub repository and its changelog, and the store review RSS.

Fill the schema. "verdict_on_our_claim" is the output that matters, and
"what_we_must_now_say_instead" must be a sentence we could actually print if you wound the claim.
```

## Searches actually run

- `Cooklist app pantry expiration date "expiring soon" recipe recommendation help`
- `Cooklist app review "expiring soon" pantry recipes walkthrough how it works expiration`
- `Cooklist app "substitution" setting "broad" "exact" pantry recipe match level`

## Pages actually fetched

- https://cooklist.com/   — asked: Quote verbatim any text describing: how recipes are recommended/matched, pantry inventory, expiration/expiry d

## Response

- **product:** Cooklist (Cooklist, Inc.) — iOS "Cooklist: Pantry Meals Recipes" App Store id 1352600944 / Android com.cooklist.android / https://cooklist.com
- **alive:** ALIVE
- **liveness proof:** iTunes Lookup API (https://itunes.apple.com/lookup?id=1352600944&country=us, fetched 2026-09-13): version 1.109.1, currentVersionReleaseDate 2026-06-29T15:47:57Z, releaseDate 2018-07-02, releaseNotes "[+] Fix login connections for Ralphs, Fred Meyer, King Soopers, and other regional stores". Google Play (https://play.google.com/store/apps/details?id=com.cooklist.android&hl=en_US&gl=US) shows "Updated on" / "Jun 17, 2026". Newest customer review retrieved from the iTunes RSS feed is dated 2026-08-05. Company is also shipping a white-label build: https://cooklist.com/llms.txt states "The Kroger AI Meal Assistant went live in December 2025, starting with Fred Meyer". Both stores current within ~3 months; this is a live, actively maintained product, not a parked domain.
- **what it actually does:** Consumer pantry+recipe app. Imports purchases from grocery loyalty accounts ("Connect to 80+ retailers to import your purchases into Cooklist" — App Store screenshot 8, is1-ssl.mzstatic.com asset from the live listing), or from a photographed receipt, or a barcode scan, into a digital pantry; auto-estimates an expiry date per item; matches the pantry against ~1M+ recipes; shows an ingredient ratio per recipe card; proposes in-pantry substitutions for missing ingredients; and generates a shopping list containing only the missing items. App Store description (https://itunes.apple.com/lookup?id=1352600944): "Over 1 million recipes generated by your pantry inventory", "Food and pantry inventory expiration notifications", "Automatic cooking recipes with ingredients that is expiring soon", "only the ingredients you need are added to your grocery shopping list". Marketing site (https://cooklist.com/cooklist-app): "Cooklist automatically calculates expiration dates and notifies you before they expire." and "Since Cooklist already knows the ingredients you have at home it only adds the items that you are missing to your shopping list."
- **adoption signal:** iOS: averageUserRating 4.72842 across userRatingCount 11,297 (itunes lookup, 2026-09-13); App Store page JSON-LD "aggregateRating":{"ratingValue":4.7,"reviewCount":11297}. Listed and updated on Google Play. Self-reported on https://cooklist.com/llms.txt: "5M+ Users — Millions of shoppers across our direct app and white-label retailer suite" and "$10B+ in Transactions". Material — this is a real, widely-installed consumer app, and it also powers Kroger/Fred Meyer's shipped AI Meal Assistant.
- **price as stated:** Free to download ("offers":{"@type":"Offer","price":0,"priceCurrency":"USD"}). In-App Purchases listed on https://apps.apple.com/us/app/cooklist-pantry-meals-recipes/id1352600944 (checked 2026-09-13): "Cooklist Pro Yearly $49.99", "Cooklist Pro Monthly $7.99", "Cooklist Pro Yearly $59.99", "Cooklist Pro Monthly $9.99", "Cooklist Pro Monthly $5.99", "Yearly access to Cooklist Pro $59.99". Third-party user report (https://food.thefuntimesguide.com/cooklist-app-reviews/): "switched to Cooklist Pro for $49.99/yr".
- **has pantry inventory:** yes
- **has expiry dates:** yes
- **ranks or recommends:** yes
- **explains why recommended:** yes
- **names the specific item:** yes
- **names the expiry date:** yes
- **user can correct the input:** yes
- **explanation evidence:** THE KILL SHOT — the per-recommendation rationale, vendor-published, on the live App Store listing. Screenshot #10 of the current listing (image asset https://is1-ssl.mzstatic.com/image/thumb/Purple116/v4/1b/d7/ab/1bd7ab5e-27a6-d95c-e013-5cd4bf7c4bc4/pr_source.jpg/800x1422bb.jpg, enumerated from https://itunes.apple.com/lookup?id=1352600944&country=us and read as an image on 2026-09-13) is captioned "Expiration Reminders / Get alerts when your food is about to expire" and renders the shipped notification verbatim: "Expiration Reminder — Your parsley is 7 days old and may expire soon. Tap to see recipes you can cook with it." That is a recommendation whose stated reason names the specific pantry item and its freshness state, and routes to recipes.
  
  FEATURE CONFIRMED AS SHIPPED, NOT MOCKUP. App Store description (itunes lookup): "Food and pantry inventory expiration notifications" and "Automatic cooking recipes with ingredients that is expiring soon". Independent user, review dated 2023-08-21T20:19:15-07:00, id 1352600944 RSS: "Even tells you whenever your food is about to expire". Two-year user walkthrough (https://food.thefuntimesguide.com/cooklist-app-reviews/): "Cooklist lets you know when you have items in your pantry that are about to expire. I LOVE that feature… That way, you can search for recipes and prepare meals using those ingredients first".
  
  EXPIRY DATES ARE SHOWN PER ITEM AND ARE USER-CORRECTABLE. https://food.thefuntimesguide.com/cooklist-app-reviews/ : "there's no easier way to see a list of every single item that you currently have in your pantry AND when each item expires"; and decisively: "Cooklist automatically tracks the expiration date of every single item you add to your pantry. How? Using AI, it knows the general lifespan of every single food item you enter. And if you want to change the expiration date for an item to the EXACT expiration date that's found on the item's packaging, it's a cinch to do so with one click." Independently corroborated by a hostile App Store reviewer, 2024-09-08T00:52:37-07:00 (author "pharmababy", app version 1.101.1): "I scanned 328 items and entered correct expiration dates for all of them." Same reviewer audits the estimate and finds it wrong — proof the state is inspectable: "the expiring soon feature is not accurate. It lists some things that are over 6 months out and does not list things that expire next month."
  
  SUBSTITUTION IS NAMED, ITEM BY ITEM, AGAINST INVENTORY. https://food.thefuntimesguide.com/cooklist-app-reviews/ : "Each recipe's 'ingredients list' is divided into 2 parts: (1) The ingredients you already have in your pantry. And (2) substitutions you can use from within your pantry for any items that you don't already own. (For example, it will show that you could substitute the chicken breasts that you already have in your pantry for the chicken thighs that the recipe calls for – instead of running to the store.)" App Store review 2024-12-26T14:51:14-07:00: "It gives you substitution option based on what is in your pantry." App Store review 2023-07-04T14:35:38-07:00 (author "SheNoName", v1.86.0): "It gives replacement ingredients considering what you have as well as importing your grocery purchases." The 2024-09-08 reviewer quotes the app's own swap statements: "it suggested I use frozen cubed sweet potatoes (instead of red potatoes) with bottled Caesar dressing (instead of ranch)" — and confirms the substitution behaviour is user-tunable: "the default setting for cooking is set to broad substitutions… You can set the level of substitution that you prefer".
  
  PARTIAL RATIONALE ON EVERY RECIPE CARD. iPad screenshot #3 (https://is1-ssl.mzstatic.com/image/thumb/Purple116/v4/dd/dc/be/dddcbe8b-8937-886e-eb99-0f35df334942/db35433b-d604-43bd-a7f9-c90896bbb959_recipes-ipad.jpg/1152x1536bb.jpg), captioned "Recipes by Ingredients / Products in your pantry are matched to 1 million recipes", shows cards badged "5 / 8", "10 / 16", "10 / 11". Described at https://food.thefuntimesguide.com/cooklist-app-reviews/ : "you'll see the 'ingredient ratio' in the bottom left corner. This shows you how many of the ingredients you already have in your pantry of all the ingredients the recipe calls for."
  
  WHAT I COULD NOT FIND — recorded as absent, not as "no". (a) NUTRIENT CONSTRAINT IN THE RATIONALE: no page states a reason of the form "recommended because it meets your protein/carb target". Nutrition is present only as a per-recipe readout and as diet filters — "Nutrition breakdown including carbs & fats & protein percentages for each recipe" (funtimesguide), and filter chips "LOW CARB", "Keto", "Paleo", "Gluten Free" (iPad screenshots #2 and #3). No per-recommendation nutrient justification found on the site, the store listing, the screenshots, or in 272 customer reviews. (b) CULINARY REASONING FOR A SUBSTITUTION: Cooklist shows WHAT it swapped, never WHY. I found no "here's the reasoning" text anywhere, and the 2024-09-08 reviewer's complaint ("The substitutions it suggested were absolutely absurd… ground beef instead of steak") reads as someone given a swap with no stated justification. (c) THE EXPIRY DATE INSIDE THE RECOMMENDATION TEXT: the reminder states an age ("7 days old"), and the pantry "Expiring Soon" shelf (iPad screenshot #1, https://is1-ssl.mzstatic.com/image/thumb/Purple126/v4/5d/66/b2/5d66b26a-8103-70c8-3b51-070b0ee03cd4/f2dea440-fd6e-4ee5-89fc-4c861dccd4db_pantry_ipad.jpg/1152x1536bb.jpg) badges items with freshness percentages ("40%", "60%", "80%") rather than a printed date. The date exists and is editable on the pantry item record; I found no evidence it is printed on the recommendation itself.
  
  NO HELP CENTRE EXISTS TO CHECK. https://cooklist.com/support returns a JS-only shell with no content; help.cooklist.com and support.cooklist.com do not resolve (curl exit 000); https://cooklist.com/sitemap.xml is 404; cooklist.co serves the same empty shell. There is no public GitHub repo or changelog for this closed-source app. The obvious documentation sources are exhausted.
  
  *** CORRECTION TO OUR OWN G1 CITATION — WE ARE CITING A REVIEW THAT DOES NOT SAY THAT. *** I pulled 272 unique reviews for id 1352600944 from the iTunes RSS feed (https://itunes.apple.com/us/rss/customerreviews/page=1..10/id=1352600944/sortby=mostrecent/json and .../sortby=mosthelpful/json; the endpoint is heavily rate-limited and pages must be retried individually), spanning 2018-06-14 to 2026-08-05 and including all 45 reviews from calendar 2023. There is exactly one review dated 2023-07-09, and it is not ours. Verbatim and in full: 2023-07-09T15:46:13-07:00, 4 stars, author "AngryNorsemen3", app version 1.86.0, title "Best app for food management" — "Look up recipes, plan meals, family can add to shopping list, generates shopping list, and tracks your pantry. / This is an app that does total food management for the family. / BUT, there are some minor tweaks that I would love to see. More stores connected (and eventually coupons and weekly specials included). Also, the auto fill can get confused. I typed in cream cheese jalapeño and it popped up in snacks. Then I edited it to be bacon flavored, and it still showed the jalapeño picture, still had it in snacks, and when I tried to add jalapeños it said it was already in the cart—but no it wasn't. / Highly recommend app!!" Searching the whole 272-review corpus for "how closely" → 0 hits; "meets the recipe" → 0; "recipe requirements" → 0; "broad match" → 0; "random broad" → 0. The sentence we attribute to a 2023-07-09 Cooklist review — "an option to choose how closely your pantry meets the recipe requirements instead of random broad matches" — does not appear at that date and does not appear anywhere in the sample. Caveat: 272 of 11,297 ratings is a sample, so I cannot prove the sentence exists nowhere; but the specific date we cite IS covered and carries different text. Worse for us, the feature that quote asks for already ships: "You can set the level of substitution that you prefer" (2024-09-08 review). G1 must be re-sourced or dropped.
  
  OUR G4 CITATION, BY CONTRAST, IS SOUND. "Since Cooklist already knows the ingredients you have at home it only adds the items that you are missing to your shopping list" (https://cooklist.com/cooklist-app); "simply choose the recipes you want to cook and Cooklist generates a grocery shopping list with only the ingredients that you are missing in your pantry and need to buy" (App Store description); "Cooklist generates a grocery shopping list with ONLY the ingredients that you are missing in your pantry!" (https://food.thefuntimesguide.com/cooklist-app-reviews/).
- **searches and pages:**
  - https://itunes.apple.com/search?term=cooklist&entity=software&country=us&limit=10 — located trackId 1352600944
  - https://itunes.apple.com/lookup?id=1352600944&country=us — version, release dates, full description, screenshot asset URLs
  - https://apps.apple.com/us/app/cooklist-pantry-meals-recipes/id1352600944 — in-app purchase prices, aggregateRating
  - https://play.google.com/store/apps/details?id=com.cooklist.android&hl=en_US&gl=US — 'Updated on Jun 17, 2026', description, developer replies
  - https://itunes.apple.com/us/rss/customerreviews/page=1..10/id=1352600944/sortby=mostrecent/json and .../sortby=mosthelpful/json — 272 unique reviews, 2018-06-14 to 2026-08-05, incl. all 45 of calendar 2023
  - https://is1-ssl.mzstatic.com/image/thumb/Purple116/v4/1b/d7/ab/1bd7ab5e-27a6-d95c-e013-5cd4bf7c4bc4/pr_source.jpg/800x1422bb.jpg — 'Expiration Reminders' screenshot containing the parsley notification
  - https://is1-ssl.mzstatic.com/image/thumb/Purple126/v4/5d/66/b2/5d66b26a-8103-70c8-3b51-070b0ee03cd4/f2dea440-fd6e-4ee5-89fc-4c861dccd4db_pantry_ipad.jpg/1152x1536bb.jpg — 'Expiring Soon' pantry shelf with % freshness badges
  - https://is1-ssl.mzstatic.com/image/thumb/Purple116/v4/dd/dc/be/dddcbe8b-8937-886e-eb99-0f35df334942/db35433b-d604-43bd-a7f9-c90896bbb959_recipes-ipad.jpg/1152x1536bb.jpg — recipe cards with 5/8, 10/16, 10/11 ingredient ratios
  - plus 10 further screenshot assets from the same lookup (pantry list with ALL/RECENT/EXPIRED tabs, receipts screen with purchase dates, shopping list, price comparison, meal planner)
  - https://cooklist.com/ — JS-only shell, title 'Cooklist - Agentic Commerce for Grocery', no readable copy
  - https://cooklist.com/cooklist-app — full consumer marketing copy (expiration, pantry, missing-items-only list)
  - https://cooklist.com/llms.txt — 29.5KB vendor platform document; Kroger/Fred Meyer launch, substitution and personalization architecture
  - https://cooklist.com/support — empty JS shell, no help content
  - https://cooklist.com/sitemap.xml — HTTP 404
  - https://help.cooklist.com/ and https://support.cooklist.com/ — do not resolve (curl exit 000)
  - https://www.cooklist.co/ — HTTP 200, serves the same empty shell as cooklist.com
  - https://food.thefuntimesguide.com/cooklist-app-reviews/ — detailed 2+ year user walkthrough, pub. 2025-04-09 / upd. 2025-09-10; source of the editable-expiry-date and two-part-ingredient-list quotes
  - WebSearch: 'Cooklist app pantry expiration date expiring soon recipe recommendation help'
  - WebSearch: 'Cooklist app review expiring soon pantry recipes walkthrough how it works expiration'
  - WebSearch: 'Cooklist app substitution setting broad exact pantry recipe match level'
- **verdict on our claim:** KILLS_THE_NARROW_CLAIM
- **verdict reasoning:** The narrow claim I was given is "NOBODY EXPLAINS A RECOMMENDATION AGAINST INVENTORY STATE AND A DATE." Cooklist does exactly that, in a shipped, actively-updated app with 11,297 iOS ratings, and it publishes the rationale text on its own store listing: "Your parsley is 7 days old and may expire soon. Tap to see recipes you can cook with it." That single sentence carries the named pantry item, the date-derived freshness fact, the reason, and the recommendation. The underlying expiry date is per-item, visible in the pantry, and hand-correctable with one click — so the rationale's input is auditable and correctable, which was the other half of our defence. Cooklist also names substitutions item-for-item against inventory ("substitute the chicken breasts that you already have in your pantry for the chicken thighs that the recipe calls for"), lets the user tune the substitution aggressiveness, and puts a have/need ratio on every recipe card. Our claim cannot survive in the form "nobody explains against inventory and a date", and it cannot survive in the form "RecipeFix has the explanation half, nobody has the inventory-and-date half" — Cooklist has the inventory-and-date half AND names its substitutions.
  
  What genuinely survives is much smaller, and I want to be precise rather than generous, because two of the four elements really are absent after exhausting the site, the llms.txt, the store listings, all thirteen screenshots, a long third-party walkthrough, and 272 customer reviews. (1) Cooklist never states a nutrient reason for a recommendation — nutrition appears only as a per-recipe readout and as diet filter chips, never as "recommended because it fits your macro target". (2) Cooklist shows WHAT it substituted but never WHY — the exact thing RecipeFix ships ("Every substitution comes with the culinary reasoning behind it"). The hostile 2024-09-08 review is the tell: the user is shown "frozen cubed sweet potatoes (instead of red potatoes)" and has no stated reasoning to argue with, so the only recourse is a global aggressiveness slider. (3) The recommendation states an age ("7 days old"), not the expiry date itself, though the date is on the item record. So no single product yet joins the four facts in one sentence: RecipeFix reasons about substitutions but has no pantry or date; Cooklist has the pantry, the date and the substitution but supplies no reasoning and no nutrient argument.
  
  Separate and urgent: our G1 confirming evidence is misattributed. The one review dated 2023-07-09 is AngryNorsemen3's "Best app for food management", which complains about autofill miscategorising cream cheese jalapeño — it says nothing about broad matches or pantry-closeness. The quoted sentence appears nowhere in a 272-review sample spanning 2018-2026. Pull that citation. Our G4 refuting evidence (missing-ingredients-only list) is confirmed three ways and stands.
- **what we must now say instead:** "Cooklist already explains a recommendation against inventory and a date — it will tell you 'your parsley is 7 days old and may expire soon' and hand you recipes for it, and it lets you correct that expiry date by hand. What no shipped consumer product does is give you the whole argument in one auditable place: the named pantry item AND its expiry date AND the nutrient constraint the dish satisfies AND the culinary reason for the substitution it made — Cooklist shows you what it swapped but never why, and never argues from a nutrient target; RecipeFix argues about the swap but has no pantry and no dates."
