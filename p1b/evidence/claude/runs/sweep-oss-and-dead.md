# sweep:oss-and-dead

**Workflow:** P1b Claude market survey (run 1)  
**Phase:** Sweep  
**Model:** Claude Opus 5 (1M context), `claude-opus-5[1m]`  
**Agent id:** `a3003719f35d9bfe8`  
**Tool calls:** 57 total — 16 web searches, 21 pages fetched  
**Raw transcript:** `raw/agent-a3003719f35d9bfe8.jsonl` (full tool-call trace, retained)

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
Search angle: OPEN SOURCE AND GRAVEYARD. Two jobs.
(a) Self-hosted / open-source rivals: Grocy, Mealie, Tandoor Recipes, KitchenOwl, Cooklist.
For these, the GitHub repository, its README, and its open issues are first-party evidence —
use them, and note star counts and last-release dates as adoption signals.
(b) DEAD PRODUCTS: find meal-planning, pantry, or food-waste products that shut down, were
acquired and killed, or have not shipped in years (for example Pepperplate, Cooklist, Whisk's
absorption into Samsung Food, Chefling, NoshList-style pantry apps). A graveyard is evidence
about a gap: it may mean nobody wants the thing, or that it was tried too early. Record the
shutdown notice URL where one exists.

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

- `Grocy github open source ERP for your groceries pantry expiry`
- `Mealie self-hosted recipe manager meal planner shopping list github`
- `Tandoor Recipes github meal plan shopping list nutrition`
- `KitchenOwl github self-hosted grocery list meal planner expiration`
- `Mealie github issue pantry inventory expiration date feature request`
- `grocy "due score" recipes documentation how calculated`
- `Pepperplate shutting down discontinued service meal planning app`
- `Chefling app shut down discontinued pantry inventory app`
- `Whisk app Samsung Food rebrand shut down whisk.com`
- `Kitche food waste app shut down closing UK`
- `Cooklist app discontinued pantry grocery status 2025`
- `Yummly app shutting down Whirlpool discontinued`
- `"NoWaste" app food inventory statistics wasted food tracking`
- `TandoorRecipes recipes github issue "pantry" OR "food inventory" stock tracking feature request`
- `open source github self-hosted food waste tracker statistics "thrown away" pantry expiry`
- `nowasteapp.com blog "waste stats" OR "my numbers" food waste statistics feature`

## Pages actually fetched

- https://github.com/grocy/grocy   — asked: Quote verbatim the README feature list, especially anything about: stock/pantry inventory, expiry/due dates, r
- https://github.com/mealie-recipes/mealie   — asked: Quote verbatim the README feature list. Look specifically for: pantry/inventory tracking, expiration dates, me
- https://github.com/TandoorRecipes/recipes   — asked: Quote verbatim the README feature list. Look for: pantry/inventory, expiration/expiry, meal plan, shopping lis
- https://github.com/tombursch/kitchenowl   — asked: Quote verbatim the README feature list. Look for: pantry/inventory, expiration/expiry dates, meal plan, shoppi
- https://grocy.info/   — asked: Quote verbatim the feature list on this page. I especially need exact sentences about: stock/inventory trackin
- https://github.com/mealie-recipes/mealie/discussions/2448   — asked: Quote verbatim what the requester asks for regarding pantry/inventory and expiration tracking, and quote verba
- https://docs.tandoor.dev/   — asked: Quote verbatim the feature list. Look for: pantry/inventory/stock tracking, expiry, food waste, nutrition, mea
- https://tandoor.dev/   — asked: Quote verbatim any text about nutrition/nutritional values, pantry or stock or on-hand ingredients, food waste
- https://www.remyapp.io/announcements/remy-acquires-kitche   — asked: Quote verbatim: what happens to the Kitche app/brand (retired? shut down? date?), what Kitche did (pantry trac
- https://apps.apple.com/us/app/cooklist-pantry-meals-recipes/id1352600944   — asked: Quote verbatim the app description text, especially anything about: pantry inventory, expiration/expiring food
- https://www.chefling.info/pantry-management   — asked: Quote verbatim any text about pantry inventory, expiration date tracking, recipe suggestions based on what you
- https://apps.apple.com/us/app/pepperplate-cooking-planner/id403188971   — asked: Report the exact "Updated"/version date, the version number, the price, and quote verbatim the app description
- https://thespoon.tech/whirlpool-lays-off-entire-team-for-cooking-and-recipe-app-yummly/   — asked: Quote verbatim the key sentences about the Yummly layoffs and shutdown, including dates, what Whirlpool said, 
- https://kitchenowl.org/   — asked: Quote verbatim the feature list and any pricing text. Look specifically for: pantry/inventory/stock, expiratio
- https://apps.apple.com/us/app/nowaste-food-inventory-list/id926211004   — asked: Quote verbatim the app description, especially any text about: freezer/fridge/pantry lists, expiration dates, 
- https://docs.tandoor.dev/features/shopping/   — asked: Quote verbatim anything about "on hand" foods, pantry, inventory, ignoring items already in stock, and expiry.
- https://play.google.com/store/apps/details?id=com.khcreations.nowaste&hl=en   — asked: Quote verbatim the full app description, especially any bullet or sentence about waste statistics, "my numbers
- https://github.com/dadaloop82/EverShelf   — asked: Quote verbatim the README feature list. Look for: pantry inventory, expiry tracking, shopping list, recipe sug
- https://github.com/mealie-recipes/mealie/discussions/318   — asked: Quote verbatim any requests in this feature-request megathread about pantry/inventory tracking, expiration dat
- https://cooklist.com/   — asked: What does this company now say it does? Quote verbatim the headline and main description. Is the consumer pant
- https://www.prnewswire.com/news-releases/chefling-app-provides-consumers-with-a-simple-way-to-minimize-food-waste-with-intuitive-recipe-suggestions-300669084.html   — asked: Quote verbatim what the Chefling app did: pantry inventory, expiration date tracking, recipe suggestions based

## Response

- **angle:** OPEN SOURCE AND GRAVEYARD — (a) self-hosted/open-source rivals using GitHub repos, READMEs, release notes and issue trackers as first-party evidence; (b) dead, absorbed or stalled meal-planning / pantry / food-waste products.
- **searches run:**
  - Grocy github open source ERP for your groceries pantry expiry
  - Mealie self-hosted recipe manager meal planner shopping list github
  - Tandoor Recipes github meal plan shopping list nutrition
  - KitchenOwl github self-hosted grocery list meal planner expiration
  - Mealie github issue pantry inventory expiration date feature request
  - grocy "due score" recipes documentation how calculated
  - Pepperplate shutting down discontinued service meal planning app
  - Chefling app shut down discontinued pantry inventory app
  - Whisk app Samsung Food rebrand shut down whisk.com
  - Kitche food waste app shut down closing UK
  - Cooklist app discontinued pantry grocery status 2025
  - Yummly app shutting down Whirlpool discontinued
  - "NoWaste" app food inventory statistics wasted food tracking
  - TandoorRecipes recipes github issue "pantry" OR "food inventory" stock tracking feature request
  - open source github self-hosted food waste tracker statistics "thrown away" pantry expiry
  - nowasteapp.com blog "waste stats" OR "my numbers" food waste statistics feature
  - (direct API/HTTP retrievals, not search) api.github.com repo + releases for grocy/mealie/tandoor/kitchenowl/EverShelf/SaveEats; api.github.com issue search for pantry/expiry/nutrition; itunes.apple.com lookup+search for Cooklist/NoWaste/Pepperplate/Chefling; dig+curl for chefling.info, pepperplate.com, whisk.com, kitche.co, yummly.com
- **rivals:**
  - _item 1_
    - **name:** Grocy
    - **vendor:** Bernd Bestel (grocy.info), MIT-licensed open source
    - **url:** https://grocy.info/
    - **url retrieved:** True
    - **quoted evidence:** A "Due Score" indicates which recipes are good for using up stock items that are due soon or already overdue
    - **has pantry inventory:** yes
    - **has expiry tracking:** yes
    - **plans from expiring food:** yes
    - **has nutrient goals:** no
    - **has shopping list:** yes
    - **explains why recommended:** yes
    - **closes the loop:** no
    - **price as stated:** No price is stated on grocy.info or the GitHub repo; the repo is MIT-licensed self-hosted software (https://github.com/grocy/grocy, retrieved 2026-09-13). Checked on 2026-09-13.
    - **who uses it:** Self-hosters / homelab users. GitHub API on 2026-09-13: 9,486 stars, 134 open issues, latest release v4.7.1 published 2026-09-04.
    - **main strength:** This is the single most dangerous rival for our differentiator, and it is free. Grocy does not just prioritise expiring food, it PUBLISHES THE RANKING FORMULA. From the official changelog (https://grocy.info/changelog, retrieved 2026-09-13): "A number (new column on the recipes page) which represents a score which is higher the more ingredients, of the corresponding recipe, currently in stock are due soon, overdue or already expired" and "The score is in detail based on: 1 point for each due soon ingredient (based on the stock setting 'Due soon days') 10 points per overdue ingredient 20 points per expired ingredient (or else 0)". The official docs also confirm per-ingredient traceability: "If you select a recipe, you can also see all at once what you have in stock" (https://raw.githubusercontent.com/grocy/grocy-docs/master/tutorials/cooking.md, retrieved 2026-09-13). It also has minimum-stock thresholds ("Define minimum stock amounts of your loved products"), meal plan ("Plan your daily meals based on your recipes"), and one-click shopping list — i.e. it covers our pantry + expiry + low-stock + plan + list + expiry-driven-recommendation stack.
    - **main weakness:** Two real gaps. (1) Nutrition: a full-text grep of the official changelog returned ZERO hits for "nutrition"; calories appear only as displayed totals ("Added that the calories per serving are now also shown") — there is no nutrient goal, no trend dashboard, no export. (2) It never closes the loop: it records spoilage as a journal flag ("On the stock journal page, it's now visible if a consume-booking was spoiled") but the only aggregate report is spending — "New Feature: Stock reports ... The first report (more to come) 'Spendings'". Nothing compares outcome against a goal. Also: no AI/free-text goal input, no gamification, PHP self-host install required.
  - _item 2_
    - **name:** Mealie
    - **vendor:** mealie-recipes (AGPL open source)
    - **url:** https://github.com/mealie-recipes/mealie
    - **url retrieved:** True
    - **quoted evidence:** Use the **Meal Planner** to plan your what you'll cook for the next week
    - **has pantry inventory:** no
    - **has expiry tracking:** no
    - **plans from expiring food:** no
    - **has nutrient goals:** no
    - **has shopping list:** yes
    - **explains why recommended:** no
    - **closes the loop:** unknown
    - **price as stated:** No price stated; AGPL self-hosted open source (README, retrieved 2026-09-13). Checked on 2026-09-13.
    - **who uses it:** The largest self-hosted recipe/meal-plan community in this space. GitHub API on 2026-09-13: 13,206 stars, 212 open issues, latest release v3.25.1 published 2026-09-04, code pushed 2026-09-13.
    - **main strength:** Biggest installed base and the most polished meal-planner + shopping-list combination of the open-source four: "Put the necessary ingredients on your **Shopping List**, organised into sections", plus URL recipe import and 35+ translations.
    - **main weakness:** The market-gap evidence we most wanted. A maintainer explicitly REFUSED pantry tracking on https://github.com/mealie-recipes/mealie/discussions/2448 (retrieved 2026-09-13): "This is something we probably won't get into it, because the constant manual upkeep required to keep this up to date is something we don't want mealie to represent" — and pointed users at Grocy instead. Only a binary workaround exists: an "on hand" flag that "automatically deselects the food when adding a recipe to your shopping list". A community PR to add per-recipe pantry matching is still UNMERGED — https://github.com/mealie-recipes/mealie/pull/8176 (opened 2026-08-22, state open, merged false, verified via GitHub API 2026-09-13), which itself admits "This checks whether a food is marked on hand, not whether the household has a sufficient quantity." So Mealie has no inventory, no expiry, no percentage match, and no expiry-driven recommendation. Nutrition: the feature megathread marks "Calculate Nutrition Data" with an X as unlikely to be implemented (https://github.com/mealie-recipes/mealie/discussions/318).
  - _item 3_
    - **name:** Tandoor Recipes
    - **vendor:** TandoorRecipes (open source, plus a hosted tier at tandoor.dev)
    - **url:** https://api.github.com/repos/TandoorRecipes/recipes/releases/tags/2.6.0
    - **url retrieved:** True
    - **quoted evidence:** **added** Pantry (Inventory Booking) ... track expiry dates for different foods ... integrations with shopping/planning and cooking are planned for the future
    - **has pantry inventory:** yes
    - **has expiry tracking:** yes
    - **plans from expiring food:** no
    - **has nutrient goals:** no
    - **has shopping list:** yes
    - **explains why recommended:** unknown
    - **closes the loop:** unknown
    - **price as stated:** WebFetch of https://tandoor.dev/ (2026-09-13) reported four tiers: free EUR0/mo, Basic EUR1.99/mo, Standard EUR3.49/mo, Premium AI EUR4.99/mo, plus self-hosted open source. CAVEAT: my own raw-HTML extract of the same page did not contain those figures (pricing sits behind a separate /pricing route I did not fetch), so treat the exact numbers as unconfirmed. Checked on 2026-09-13.
    - **who uses it:** GitHub API on 2026-09-13: 8,591 stars, 373 open issues, latest release 2.6.15 published 2026-09-07. Same release URL in human form: https://github.com/TandoorRecipes/recipes/releases/tag/2.6.0 (2026-03-26).
    - **main strength:** Tandoor is the rival moving fastest INTO our territory. Release 2.6.0 (2026-03-26) added a real pantry: "configure multiple locations (freezer, shelf, ...) where you book foods in, out and inbetween", "track expiry dates for different foods", and "added support for the new pantry system in make now" (make now = which recipes you can cook now). Release 2.6.14 (2026-09-06) added an "add to pantry button to recipe context menu". It also already computes nutrition — "Automatically calculate nutritional values, prices, diet points or anything else based on your recipes ingredients" (https://tandoor.dev/, retrieved 2026-09-13) — and has an auto meal planner.
    - **main weakness:** The pantry is not yet wired into planning: the same release note says "integrations with shopping/planning and cooking are planned for the future". Nothing in any release note or on docs.tandoor.dev mentions ranking recipes by what is expiring, and https://docs.tandoor.dev/features/shopping/ (retrieved 2026-09-13) contains no mention of pantry, on-hand or expiry at all. Nutrition is calculation only — I found no goal-setting, trend dashboard or export. Docs also warn "This application is not meant to be run as a public page".
  - _item 4_
    - **name:** KitchenOwl
    - **vendor:** Tom Bursch (AGPLv3 open source)
    - **url:** https://kitchenowl.org/
    - **url retrieved:** True
    - **quoted evidence:** KitchenOwl adapts to you! It learns the order you usually tick off items and suggests recipes you like
    - **has pantry inventory:** no
    - **has expiry tracking:** no
    - **plans from expiring food:** no
    - **has nutrient goals:** unknown
    - **has shopping list:** yes
    - **explains why recommended:** no
    - **closes the loop:** no
    - **price as stated:** No pricing text appears on kitchenowl.org (retrieved 2026-09-13); AGPLv3 self-hosted. Checked on 2026-09-13.
    - **who uses it:** GitHub API on 2026-09-13: 3,678 stars, 339 open issues, latest release v0.7.10 published 2026-07-26 (the stalest release date of the four).
    - **main strength:** Real-time multi-user household sync and the only one of the four with cost-splitting: "Households allow you to work on recipes, expenses, shopping lists, and meal plans together" and "After your shopping trip simply enter the expense and divide it between all members accordingly".
    - **main weakness:** No inventory and no expiry at all. The README feature list mentions neither, and a GitHub issue-title search of the repo for expiration/expiry returned exactly ONE result, an unrelated JWT token PR (https://api.github.com/search/issues?q=repo:tombursch/kitchenowl+expiration+OR+expiry+in:title, run 2026-09-13). Its recipe suggestion is preference-based and unexplained — "suggests recipes you like" is the entire described behaviour, with no stated reason surfaced to the user.
  - _item 5_
    - **name:** EverShelf
    - **vendor:** dadaloop82 (MIT open source, self-hosted)
    - **url:** https://github.com/dadaloop82/EverShelf
    - **url retrieved:** True
    - **quoted evidence:** Scan, locations, expiry, opened packs, favourites, CSV import/export
    - **has pantry inventory:** yes
    - **has expiry tracking:** yes
    - **plans from expiring food:** unknown
    - **has nutrient goals:** unknown
    - **has shopping list:** yes
    - **explains why recommended:** unknown
    - **closes the loop:** unknown
    - **price as stated:** No price stated; MIT-licensed self-hosted open source. Checked on 2026-09-13.
    - **who uses it:** Very early adoption. GitHub API on 2026-09-13: 113 stars, 8 forks, repo created 2026-03-10, last push 2026-09-10.
    - **main strength:** A brand-new open-source entrant aimed squarely at our concept and, notably, built on the same LLM family we use: README lists "Gemini . OpenAI . Llama — identify, OCR expiry, recipes, chat", "Smart list, anti-waste qty", and "Steps, TTS, timers, zero-waste tips". Proof that a small team CAN ship pantry+expiry+AI-recipes in this budget class — and a warning that the concept is no longer novel.
    - **main weakness:** Six months old, 113 stars, one maintainer — not yet a market force. The README does not mention nutrition data, waste statistics or reports, so I cannot confirm any of the columns we care about most; "zero-waste tips" is a described behaviour but tells us nothing about ranking or explanation.
  - _item 6_
    - **name:** Cooklist
    - **vendor:** Cooklist, Inc.
    - **url:** https://apps.apple.com/us/app/cooklist-pantry-meals-recipes/id1352600944
    - **url retrieved:** True
    - **quoted evidence:** Over 1 million cooking recipes are then matched to the groceries you have in your fridge and pantry
    - **has pantry inventory:** yes
    - **has expiry tracking:** yes
    - **plans from expiring food:** yes
    - **has nutrient goals:** unknown
    - **has shopping list:** yes
    - **explains why recommended:** unknown
    - **closes the loop:** unknown
    - **price as stated:** App Store listing: Free, with in-app purchases "Cooklist Pro Monthly $5.99 / $7.99 / $9.99" and "Cooklist Pro Yearly $49.99 / $59.99". Checked on 2026-09-13.
    - **who uses it:** Consumers who link grocery loyalty cards. iTunes lookup API on 2026-09-13: version 1.109.1, current version released 2026-06-29, first released 2018-07-02 — alive, not dead.
    - **main strength:** CORRECTION TO THE BRIEF: Cooklist is NOT open source — it is a proprietary product of Cooklist, Inc. It is also the live rival closest to our expiry-driven AI suggestion feature: the App Store description states "Automatic cooking recipes with ingredients that is expiring soon", "Food and pantry inventory expiration notifications", "Always know what ingredients you have on hand with our pantry check", and "Shop by choosing recipes and only the ingredients you need are added to your grocery shopping list". Its loyalty-card auto-import removes the manual-entry burden that Mealie's maintainer cited as the reason to refuse pantry entirely.
    - **main weakness:** The company appears to have pivoted away from the consumer app: https://cooklist.com/ (retrieved 2026-09-13) now carries the page title "Cooklist - Agentic Commerce for Grocery". I could not quote body text — the site is a JS-rendered SPA and only the title tag was retrievable, so treat the pivot as suggestive, not proven. On features, the description mentions nutrition lookup ("Use the ingredient scanner to find nutrition facts") but I found no text about nutrient goals, no text explaining WHY a given recipe was surfaced, and no text about measuring waste avoided afterwards.
  - _item 7_
    - **name:** NoWaste: Food Inventory List
    - **vendor:** KH Creations ApS (one-person team, per nowasteapp.com)
    - **url:** https://play.google.com/store/apps/details?id=com.khcreations.nowaste&hl=en
    - **url retrieved:** True
    - **quoted evidence:** Inventory lists for your freezer, fridge & pantry ... Sort your food by expiration date, name or category
    - **has pantry inventory:** yes
    - **has expiry tracking:** yes
    - **plans from expiring food:** unknown
    - **has nutrient goals:** unknown
    - **has shopping list:** yes
    - **explains why recommended:** unknown
    - **closes the loop:** unknown
    - **price as stated:** App Store listing: Free with in-app purchases "NoWaste Pro Annual: $6.99" and "NoWaste Pro Lifetime: $29.99". Checked on 2026-09-13.
    - **who uses it:** Consumers focused on food waste. iTunes lookup API on 2026-09-13: version 7.4.8, current version released 2026-08-10, first released 2014-10-15 — twelve years old and still shipping.
    - **main strength:** The closest match to our fridge/freezer/pantry split with expiry colour-coding: "With lists for your freezer, fridge and pantry, you always know what food you have, how much you have, when it expires and what you can cook" (https://www.nowasteapp.com/, retrieved 2026-09-13), plus "Track expiry dates", "Scan barcodes instantly", "Never buy duplicates", "Reduce waste to 3-4%".
    - **main weakness:** IMPORTANT NEGATIVE RESULT: search engines told me NoWaste has a "Waste Stats" feature and a "My numbers" widget showing money saved — i.e. exactly the closes-the-loop capability we were hunting for. I could NOT verify it. Neither the full Google Play description (extracted from raw HTML on 2026-09-13) nor nowasteapp.com contains the strings "waste stats", "my numbers", or any statistics feature. I am recording it as unknown rather than as a rival capability. Separately, the store description contains no recipe-recommendation behaviour at all beyond "plan your meals".
  - _item 8_
    - **name:** Remy
    - **vendor:** Remy (remyapp.io), acquirer of Kitche
    - **url:** https://www.remyapp.io/announcements/remy-acquires-kitche
    - **url retrieved:** True
    - **quoted evidence:** know what food they have, when it expires, and what they can make with it
    - **has pantry inventory:** yes
    - **has expiry tracking:** yes
    - **plans from expiring food:** unknown
    - **has nutrient goals:** unknown
    - **has shopping list:** unknown
    - **explains why recommended:** unknown
    - **closes the loop:** unknown
    - **price as stated:** No price stated on the announcement page. Checked on 2026-09-13.
    - **who uses it:** UK/Europe households; the page describes Remy as launched January 2025 and the acquisition as announced 2025-02-17.
    - **main strength:** Live, funded, and consolidating the category — it bought its main UK rival. The one-sentence product description matches our inventory-to-recipe loop and goes further into commerce: "while automatically buying anything that's missing directly from their smartphones".
    - **main weakness:** I only read the acquisition announcement, not the product site, so every feature column except pantry/expiry is unknown. "Automatically buying" is auto-purchase, which is not evidence of a shopping-list artifact, so I left has_shopping_list as unknown rather than guessing.
  - _item 9_
    - **name:** Chefling (DEAD)
    - **vendor:** Chefling, Inc. — defunct
    - **url:** https://www.prnewswire.com/news-releases/chefling-app-provides-consumers-with-a-simple-way-to-minimize-food-waste-with-intuitive-recipe-suggestions-300669084.html
    - **url retrieved:** True
    - **quoted evidence:** easily add items to your pantry, monitor freshness and receive notifications when items are about to expire
    - **has pantry inventory:** yes
    - **has expiry tracking:** yes
    - **plans from expiring food:** yes
    - **has nutrient goals:** unknown
    - **has shopping list:** yes
    - **explains why recommended:** unknown
    - **closes the loop:** unknown
    - **price as stated:** No price recoverable — the product is gone. Checked on 2026-09-13.
    - **who uses it:** Nobody now. Previously VC-backed (The Spoon reported a $1M raise) with a PantryChic hardware partnership.
    - **main strength:** THE most important graveyard finding for our team. In 2018 Chefling shipped almost exactly our feature set, including our 'purchased' transfer flow verbatim: "click to add items to your shopping list; once purchased, swipe on the item or scan your receipt to add items to your pantry", plus expiry notifications and recipe suggestions "leveraging both new and existing pantry ingredients", under the release title "Chefling App Provides Consumers with a Simple Way to Minimize Food Waste with Intuitive Recipe Suggestions" (dated 2018-06-20).
    - **main weakness:** It is dead and there is NO shutdown notice anywhere — it simply evaporated, which is the normal outcome in this category. My own retrievals on 2026-09-13: dig and curl for chefling.info and www.chefling.info both return "Could not resolve host" (NXDOMAIN); an iTunes Search API query for "chefling" returns five apps, none of them by Chefling, Inc. (the only current 'Chefling: Meal Planner' is an unrelated 2026 app by a different developer, id6806912705). Read this as: a funded team built our exact loop, and manual-upkeep-heavy pantry apps have a history of dying quietly.
  - _item 10_
    - **name:** Kitche (DEAD / absorbed)
    - **vendor:** Kitche — acquired by Remy, brand retired
    - **url:** https://kitche.co/
    - **url retrieved:** True
    - **quoted evidence:** Kitche is a free food waste app designed to save you money and reduce your food waste at home
    - **has pantry inventory:** unknown
    - **has expiry tracking:** unknown
    - **plans from expiring food:** unknown
    - **has nutrient goals:** unknown
    - **has shopping list:** unknown
    - **explains why recommended:** unknown
    - **closes the loop:** unknown
    - **price as stated:** Page states the app was free ("Kitche is a free food waste app"). Checked on 2026-09-13.
    - **who uses it:** Was UK households; the acquisition page says "Kitche has empowered tens of thousands of households across the UK to reduce food waste, save money" since 2018.
    - **main strength:** A UK award-winning, free, single-purpose household food-waste app that reached tens of thousands of households — evidence that the food-waste framing does pull users, at least in a market with strong public messaging behind it.
    - **main weakness:** Zombie evidence. kitche.co still returns HTTP 200 with full marketing copy on 2026-09-13, yet the product was absorbed: "Although Kitche's independent journey is ending, its legacy will thrive as part of Remy" (https://www.remyapp.io/announcements/remy-acquires-kitche, retrieved 2026-09-13, acquisition announced 2025-02-17). A live website is NOT evidence a product is alive. I could not verify Kitche's individual features from first-party text, so every feature cell is unknown.
  - _item 11_
    - **name:** Yummly (DEAD)
    - **vendor:** Whirlpool Corporation
    - **url:** https://thespoon.tech/whirlpool-lays-off-entire-team-for-cooking-and-recipe-app-yummly/
    - **url retrieved:** True
    - **quoted evidence:** Appliance giant Whirlpool has let its entire Yummly team go.
    - **has pantry inventory:** unknown
    - **has expiry tracking:** unknown
    - **plans from expiring food:** unknown
    - **has nutrient goals:** unknown
    - **has shopping list:** unknown
    - **explains why recommended:** unknown
    - **closes the loop:** unknown
    - **price as stated:** Not recoverable — service discontinued. Checked on 2026-09-13.
    - **who uses it:** Formerly one of the largest recipe/meal-planning audiences in the category (acquired by Whirlpool in 2017).
    - **main strength:** The clearest proof that scale and a corporate parent do not protect a meal-planning product. The Spoon piece (published 2024-04-03) also records the original 2017 thesis, which reads exactly like our pitch: "The Yummly acquisition will allow these consumers to dramatically reduce the stress from meal planning."
    - **main weakness:** I could not find an official Whirlpool shutdown-notice page. My own first-party substitute, run 2026-09-13: curl of https://yummly.com/ and https://www.yummly.com/ both 301-redirect to https://www.kitchenaid.com/recipes — the domain has been folded into an appliance brand's recipe section. Secondary sources put the shutdown at 2024-12-20 after the April 2024 layoffs, but I did not fetch a first-party page stating that date, so I am not asserting it.
  - _item 12_
    - **name:** Pepperplate (STALLED, not formally dead)
    - **vendor:** Pepperplate Inc.
    - **url:** https://apps.apple.com/us/app/pepperplate-cooking-planner/id403188971
    - **url retrieved:** True
    - **quoted evidence:** Manage your recipes, create menus, shop with ease and cook like a pro on your iPad and iPhone.
    - **has pantry inventory:** unknown
    - **has expiry tracking:** unknown
    - **plans from expiring food:** no
    - **has nutrient goals:** unknown
    - **has shopping list:** yes
    - **explains why recommended:** no
    - **closes the loop:** unknown
    - **price as stated:** App Store: Free, with in-app purchases; listing cites a $2.99/month membership. Checked on 2026-09-13.
    - **who uses it:** Long-tail legacy users; the app is still downloadable.
    - **main strength:** Still listed and still charging — proof that a menu/recipe/shopping-list app can coast for years on an existing base.
    - **main weakness:** I found NO shutdown announcement, so the brief's premise that Pepperplate shut down is not supported. What I can prove instead is abandonment: iTunes lookup API on 2026-09-13 gives version 3.2.0 with currentVersionReleaseDate 2023-04-01 — nearly three and a half years without a release, on a paid subscription. User reviews on the listing report the consequences: "since they started charging money that the app doesn't ever get updated" and "my devices aren't syncing anymore". Categorise as zombie, not corpse.
  - _item 13_
    - **name:** Whisk (brand retired into Samsung Food)
    - **vendor:** Whisk, a subsidiary of the Samsung Group
    - **url:** https://whisk.com/
    - **url retrieved:** True
    - **quoted evidence:** Whisk built the software that became Samsung Food, and continues
    - **has pantry inventory:** unknown
    - **has expiry tracking:** unknown
    - **plans from expiring food:** unknown
    - **has nutrient goals:** unknown
    - **has shopping list:** unknown
    - **explains why recommended:** unknown
    - **closes the loop:** unknown
    - **price as stated:** No price stated on whisk.com; it is now a corporate page, not a product page. Checked on 2026-09-13.
    - **who uses it:** Samsung appliance/SmartThings customers, via the Samsung Food app.
    - **main strength:** Confirms the acquisition-and-absorption pattern from first-party text: whisk.com (retrieved 2026-09-13) now reads "Whisk is a subsidiary of the Samsung Group. We operate and maintain Samsung Food, build grocery and recipe-shopping integrations" — the consumer brand is gone but the engineering team and product live on inside a hardware company.
    - **main weakness:** I deliberately did NOT evaluate Samsung Food itself (samsungfood.com was outside my angle and I did not fetch it), so every feature column is unknown and should be filled by whoever has the commercial-apps angle. Note for the team: a fridge-maker owning a meal-planning app is the most likely source of real pantry-inventory competition, because the hardware solves the manual-entry problem.
- **what none of them do:**
  - NOBODY CLOSES THE LOOP. Across all thirteen entries, closes_the_loop is 'no' or 'unknown' — I found not one page describing a retrospective measurement of whether a plan reduced waste or hit a goal. The strongest near-miss is Grocy, and it stops short by design: it flags spoilage per transaction ('On the stock journal page, it's now visible if a consume-booking was spoiled') and can group the journal ('Added a grouped/summarized stock journal ... summarized transactions per product, transaction type and user'), but its only actual report is money — 'New Feature: Stock reports ... The first report (more to come) "Spendings"' (https://grocy.info/changelog, retrieved 2026-09-13). Nothing anywhere compares an outcome to a goal after the fact. Caveat: search results claimed NoWaste has 'Waste Stats'; I could not find that string on its store listing or website, so I am reporting the gap as unverified-but-unrefuted rather than proven.
  - NO NATURAL-LANGUAGE 'WHY THIS RECIPE'. Only Grocy explains a recommendation at all, and it does so as an integer with a published rule (1 / 10 / 20 points for due-soon / overdue / expired ingredients). KitchenOwl's entire stated mechanism is 'suggests recipes you like'; Tandoor's 'make now' has pantry support but no page text about what it shows the user; Mealie's per-recipe pantry card is an unmerged PR. Reason I believe it absent: these are rule-based or search-based systems where the ranking is a filter, not an explanation, and none of them has an LLM in the recommendation path to render a rationale.
  - NO EXPIRY-DRIVEN RECOMMENDATION *PLUS* NUTRIENT GOALS IN ONE PRODUCT. The capability splits cleanly down the middle of the open-source field: Grocy has inventory, expiry and the Due Score but zero occurrences of 'nutrition' in its official changelog (calories are displayed, never targeted); Tandoor and Mealie have nutrition values but Tandoor's pantry is explicitly not yet wired to planning ('integrations with shopping/planning and cooking are planned for the future') and Mealie's maintainers refused pantry outright. Reason: the two features come from different communities — household-logistics tooling versus recipe-library tooling.
  - NO FREE-TEXT GOAL TO MEAL PLAN. None of the four named open-source projects documents taking a natural-language goal ('lose weight, high protein, use up my spinach') and returning a 3/5/7-meal plan. Tandoor has an auto planner with 'AND/OR option to meal plan auto planner' (release 2.6.0) — that is boolean tag logic, not a goal statement. Reason I believe it absent: these projects predate cheap LLM inference and their planners are deterministic filters.
  - NO GAMIFICATION. Achievements, streaks and wellness challenges appear in none of the READMEs, release notes, feature pages or docs I read for Grocy, Mealie, Tandoor, KitchenOwl or EverShelf. Reason: the self-hosted audience optimises for data control and automation, not motivation loops — which also means our achievements/streaks work buys us no defensive moat against them, only against each other.
  - NO NUTRIENT TREND DASHBOARD OR EXPORT. I found no daily/weekly/monthly nutrient trend view, custom nutrient goal, or CSV/text nutrient export in any of the thirteen. The closest is Grocy showing 'the total costs and calories per day ... in the header of each day column' on the meal plan — a per-day figure, not a trend, goal or export.
- **honest gaps in my search:** "Things I could not establish, and why.\n\n1. The single highest-value unverified claim: search engines asserted NoWaste has a 'Waste Stats' feature and a 'My numbers' widget showing money saved by eating food on time — literally the closes-the-loop capability the team asked me to hunt for. I extracted the FULL Google Play description from raw HTML and read nowasteapp.com in full; neither contains those strings or any statistics feature. I have marked it unknown. Someone should install the app or find a changelog before we claim in a report that nobody measures outcomes.\n\n2. cooklist.com is a JavaScript SPA; the only text I could retrieve was the page title, 'Cooklist - Agentic Commerce for Grocery'. The pivot away from the consumer app is therefore suggestive, not proven. The consumer app itself is definitely alive (App Store version 1.109.1, released 2026-06-29 per the iTunes lookup API).\n\n3. No first-party shutdown notice exists for Chefling or Yummly. For Chefling I substituted my own retrievals (NXDOMAIN on chefling.info; absent from the App Store). For Yummly I substituted the yummly.com -> kitchenaid.com/recipes 301 redirect. The widely repeated Yummly shutdown date of 2024-12-20 comes from secondary blogs I did not fetch, so I have not asserted it.\n\n4. The brief's premise that Pepperplate shut down is NOT supported by anything I found. It is stale (last iOS release 2023-04-01) and still charging, which is a different and arguably more useful story. Likewise, Cooklist was listed in my brief as open source; it is a proprietary product of Cooklist, Inc. with no public repository that I found.\n\n5. Tandoor's price tiers came from the WebFetch summarizer reading https://tandoor.dev/; my own raw-HTML extract of that URL did not contain the figures (pricing lives on a /pricing route I did not fetch). Treat EUR0 / EUR1.99 / EUR3.49 / EUR4.99 as unconfirmed.\n\n6. Four of my quotes reached me through the WebFetch summarizer rather than raw HTML I parsed myself — the Mealie discussion #2448 maintainer refusal, the Mealie #318 megathread, the Cooklist and Pepperplate App Store descriptions, and the EverShelf README. Every Grocy quote, the Tandoor release-note quotes, the NoWaste Play description, the whisk.com text and the kitche.co text I extracted from raw HTML myself and can reproduce exactly.\n\n7. I never logged into any product. All open-source feature judgements come from README / release notes / docs / issue text, so a feature that exists but is undocumented would read as 'unknown' or 'no' here. Grocy's demo at demo.grocy.info and Tandoor's 'make now' screen are the two places where hands-on checking would most change my answers — specifically whether either surfaces a per-ingredient reason to the user.\n\n8. I did not evaluate Samsung Food, Plan to Eat, Paprika, AnyList, SuperCook or any other live commercial app — out of my angle. SuperCook in particular (cook-from-what-you-have search) is a plausible holder of the explains-why capability and nobody on this team has checked it as far as I know.\n\n9. Scope note on budget relevance, since every recommendation must respect 160 person-hours: Grocy already ships our expiry-driven ranking WITH a published formula, for free, at 9,486 stars. Our defensible ground is what its own changelog proves it lacks — nutrient goals, trends, export, and any retrospective measurement — not the expiring-food recommendation itself."
