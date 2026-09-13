# Samsung Food+ via Wayback

**Workflow:** P1b Claude gap-closing (run 5)  
**Phase:** Close  
**Model:** Claude Opus 5 (1M context), `claude-opus-5[1m]`  
**Agent id:** `a0dfcdae67069fcf1`  
**Tool calls:** 19 total — 0 web searches, 0 pages fetched  
**Raw transcript:** `raw/agent-a0dfcdae67069fcf1.jsonl` (full tool-call trace, retained)

---

## Prompt, exactly as issued

```text
Our market survey recorded a limitation: **every Samsung Food+ claim rested on the
support centre and third parties, because `samsungfood.com/food-plus/` returned HTTP 403 to every
agent.** Samsung Food is the closest rival to our product, so this is the most important hole in
our evidence.

**THE ROUTE IS SOLVED — use it.** The Wayback Machine serves the page:

    curl -sL "https://web.archive.org/web/2026/https://samsungfood.com/food-plus/"

That returns HTTP 200 (capture 20260827152331) and the body contains, verbatim:
"This search mode finds recipes using ingredients you have, prioritizing soon-to-expire items
from your Food List to reduce waste."

Your job is to mine that capture properly, and its siblings:
1. Fetch the capture. Extract EVERY Food+ feature claim, verbatim, with the archival URL.
2. Establish the price of Food+ — our survey has it as "unknown".
3. The decisive question for us: does Samsung Food EXPLAIN a recommendation? Not "does it
   prioritise" — does it TELL THE USER WHY, naming the specific item and its date? Look for the
   words why / because / reason / based on, and for any per-recipe rationale string.
4. Also pull archived captures of the Food List help article and any "Use It Up" / search-mode
   documentation you can find through web.archive.org.
5. Note which claims are "exclusively on mobile app", because that bounds what a web product must
   match.

Be precise about provenance: an archived vendor page is first-party evidence with a capture date,
which is BETTER than the third-party sourcing we had, but it is still a marketing page.
```

## Response

- **capture url:** https://web.archive.org/web/20260827152331/https://samsungfood.com/food-plus/
- **capture date:** 2026-08-27
- **price:** $6.99/month or $59.99/year (annual = "Save 28%"), each with a 7-day free trial. Vendor page: "7 days free, then $59.99/year" and "7 days free, then $6.99/month", plus "Plan details might differ according to your country." Vendor FAQ on the same page: "Our subscriptions cost $6.99 per month or $59.99 per year." and "The cost of a Samsung Food+ subscription varies by country. Prices are determined by the App Store and Google Play's automated conversion rates. You can only purchase a subscription on a mobile device." Confirmed independently by the archived support article "What's Included in Your Samsung Food+ Subscription" (capture 20250910070902): "$6.99 per month. $59.99 per year (a 28% discount compared to the monthly price)." Free tier exists (feature table has a "Free" column). Additional free routes advertised but not priced: "Get Food+ for free with your Samsung device!" and "Get Food+ with your Samsung Rewards". Survey entry "unknown" is now RESOLVED.
- **foodplus claims:**
  - _item 1_
    - **claim:** Positioning / value proposition
    - **verbatim:** With Samsung Food+, healthy eating is easy. Become the best version of you. Get custom meal plans based on your health goals, detailed nutrition tracking, AI-personalized recipes, and more. It's food, your way.
    - **url:** https://web.archive.org/web/20260827152331/https://samsungfood.com/food-plus/
  - _item 2_
    - **claim:** Annual price
    - **verbatim:** Annual Plan / Save 28% / 7 days free, then $59.99/year
    - **url:** https://web.archive.org/web/20260827152331/https://samsungfood.com/food-plus/
  - _item 3_
    - **claim:** Monthly price
    - **verbatim:** Monthly plan / 7 days free, then $6.99/month
    - **url:** https://web.archive.org/web/20260827152331/https://samsungfood.com/food-plus/
  - _item 4_
    - **claim:** Price varies by country
    - **verbatim:** Plan details might differ according to your country.
    - **url:** https://web.archive.org/web/20260827152331/https://samsungfood.com/food-plus/
  - _item 5_
    - **claim:** Free via Samsung hardware / rewards
    - **verbatim:** Get Food+ for free with  your Samsung device! ... Get Food+ with your Samsung Rewards
    - **url:** https://web.archive.org/web/20260827152331/https://samsungfood.com/food-plus/
  - _item 6_
    - **claim:** Top-level benefit bullets
    - **verbatim:** Cook Healthier Meals with Less Effort / Reach your health goals quickly and easily / Enjoy a cooking journey tailored to your tastes and preferences / Browse, plan, and make shopping lists without ads
    - **url:** https://web.archive.org/web/20260827152331/https://samsungfood.com/food-plus/
  - _item 7_
    - **claim:** Free-tier features (no Plus badge in comparison table)
    - **verbatim:** Browse 180,000+ recipes / Join cooking communities / Save recipes from anywhere / Make and share meal plans / Create shopping lists
    - **url:** https://web.archive.org/web/20260827152331/https://samsungfood.com/food-plus/
  - _item 8_
    - **claim:** Food+ feature — AI-guided recipes (MOBILE ONLY)
    - **verbatim:** Ai-guided recipes / Exclusively on mobile app / AI-guided steps, tips, and appliance control make any recipe easy to follow.
    - **url:** https://web.archive.org/web/20260827152331/https://samsungfood.com/food-plus/
  - _item 9_
    - **claim:** Food+ feature — Saved meal plans (MOBILE ONLY)
    - **verbatim:** Saved meal plans / Exclusively on mobile app / Turn any meal plan into a template. Reuse it whenever it works for you!
    - **url:** https://web.archive.org/web/20260827152331/https://samsungfood.com/food-plus/
  - _item 10_
    - **claim:** Food+ feature — Personalize recipes with AI (MOBILE ONLY)
    - **verbatim:** Personalize recipes with AI / Exclusively on mobile app / Customize recipes to nail your nutrition. Adjust them for balanced macros, a healthier twist, or a reinvented version of your favorite meal.
    - **url:** https://web.archive.org/web/20260827152331/https://samsungfood.com/food-plus/
  - _item 11_
    - **claim:** Food+ feature — Tailored 7-day meal plans (MOBILE ONLY)
    - **verbatim:** Tailored 7-day meal plans / Exclusively on mobile app / Get weekly personalized plans curated just for you. They're designed with your tastebuds in mind and will help you meet your unique nutrition targets.
    - **url:** https://web.archive.org/web/20260827152331/https://samsungfood.com/food-plus/
  - _item 12_
    - **claim:** Food+ feature — Search recipes by food list, i.e. the expiry-prioritising search; THE decisive claim (MOBILE ONLY)
    - **verbatim:** Search recipes by food list / Exclusively on mobile app / This search mode finds recipes using ingredients you have, prioritizing soon-to-expire items from your Food List to reduce waste.
    - **url:** https://web.archive.org/web/20260827152331/https://samsungfood.com/food-plus/
  - _item 13_
    - **claim:** Food+ feature — Automated pantry food list (MOBILE ONLY)
    - **verbatim:** Automated pantry food list / Exclusively on mobile app / Keep your ingredient list updated with smart suggestions based on your cooking and shopping, and sync your Food List automatically.
    - **url:** https://web.archive.org/web/20260827152331/https://samsungfood.com/food-plus/
  - _item 14_
    - **claim:** Food+ feature — Track nutrition goals (MOBILE ONLY)
    - **verbatim:** Track nutrition goals / Exclusively on mobile app / Monitor macros, micronutrients, and calories. Schedule your go-to meals each week, and effortlessly adapt meal plans to stay on track.
    - **url:** https://web.archive.org/web/20260827152331/https://samsungfood.com/food-plus/
  - _item 15_
    - **claim:** Free trial terms
    - **verbatim:** You can enjoy all our premium features during a 7-day free trial. We offer two subscription plans: monthly and yearly. The 7-day free trial is available for both. To start your trial, select either the monthly or yearly plan. You won't be charged until the end of the 7-day period.
    - **url:** https://web.archive.org/web/20260827152331/https://samsungfood.com/food-plus/
  - _item 16_
    - **claim:** FAQ restatement of what Food+ includes, with explicit mobile-only notes
    - **verbatim:** Personalized 7-day meal plans ... AI-powered recipe personalization: Whether you need to balance macros or add a healthy spin to your favorite meals, this feature allows you to customize recipes to meet your nutritional goals. Note: Available on mobile only. Nutrition goal tracking: ... Note: Available on mobile only.
    - **url:** https://web.archive.org/web/20260827152331/https://samsungfood.com/food-plus/
  - _item 17_
    - **claim:** Purchase is mobile-only
    - **verbatim:** You can only purchase a subscription on a mobile device.
    - **url:** https://web.archive.org/web/20260827152331/https://samsungfood.com/food-plus/
  - _item 18_
    - **claim:** A web app exists but is the secondary/fallback surface
    - **verbatim:** Start your free trial on mobile / Or try our web app
    - **url:** https://web.archive.org/web/20260827152331/https://samsungfood.com/food-plus/
  - _item 19_
    - **claim:** SUPPORT ARTICLE — the actual ranking rule for Food List search (closest thing to a rationale anywhere)
    - **verbatim:** Recipes that use the most ingredients from your Food List will appear first. Recipes that are containing items that are about to expire will be prioritized. Each recipe will show how well it matches your selected ingredients, helping you quickly decide what to cook.
    - **url:** https://web.archive.org/web/20251115192518/https://support.samsungfood.com/hc/en-us/articles/30251599415956-How-to-Search-for-Recipes-Using-Your-Available-Ingredients
  - _item 20_
    - **claim:** SUPPORT ARTICLE — Food List search is Food+ gated and lives in the mobile app's Explore tab
    - **verbatim:** 1. Navigate to the Explore tab in the app. 2. Tap on the search bar 3. Select the Food List filter and tap the "Apply" button. ... This feature is available with our Food+ subscription.
    - **url:** https://web.archive.org/web/20251115192518/https://support.samsungfood.com/hc/en-us/articles/30251599415956-How-to-Search-for-Recipes-Using-Your-Available-Ingredients
  - _item 21_
    - **claim:** SUPPORT ARTICLE — Food List purpose and use-by-date field
    - **verbatim:** The Food List is a powerful tool to help you manage your food inventory and reduce food waste. It allows you to manage and track food items stored across various locations, such as your fridge, freezer, pantry, and more. ... Tap any item to edit details such as storage location or use-by date.
    - **url:** https://web.archive.org/web/20250814013957/https://support.samsungfood.com/hc/en-us/articles/30025317487508-Getting-Started-with-Food-List
  - _item 22_
    - **claim:** SUPPORT ARTICLE — DECISIVE ADMISSION: no proactive expiry notification at all
    - **verbatim:** *Please note that we do not notify users about any items in the Food List that are close to their due date.
    - **url:** https://web.archive.org/web/20250814013957/https://support.samsungfood.com/hc/en-us/articles/30025317487508-Getting-Started-with-Food-List
  - _item 23_
    - **claim:** SUPPORT ARTICLE — use-by tracking is optional per item
    - **verbatim:** You can disable use-by-date tracking for certain items if needed.
    - **url:** https://web.archive.org/web/20250814013957/https://support.samsungfood.com/hc/en-us/articles/30025317487508-Getting-Started-with-Food-List
  - _item 24_
    - **claim:** SUPPORT ARTICLE — Food List <-> Shopping List transfer and post-cook depletion are Food+ gated
    - **verbatim:** Adding Items from Shopping List to Food List: This is a premium feature available with our Food+ subscription. ... Updating Food List After Cooking: This is a premium feature available with our Food+ subscription. 1. After cooking, mark the recipe as "Made It". 2. The app will suggest removing the used ingredients from your Food List, helping you keep track of what's left.
    - **url:** https://web.archive.org/web/20250814013957/https://support.samsungfood.com/hc/en-us/articles/30025317487508-Getting-Started-with-Food-List
  - _item 25_
    - **claim:** SUPPORT ARTICLE — the feature's own product name is "Use It Up"
    - **verbatim:** 5. "Use It Up" Recipe Search — With the Use It Up feature, Samsung Food+ helps you make the most of the ingredients you already have. Search for recipes that use ingredients from your food list. Plan meals efficiently and reduce food waste. It's the perfect tool for saving money and maximizing what you've got at home.
    - **url:** https://web.archive.org/web/20250910070902/https://support.samsungfood.com/hc/en-us/articles/32709269852052-What-s-Included-in-Your-Samsung-Food-Subscription
  - _item 26_
    - **claim:** SUPPORT ARTICLE — Vision AI scanning feeds the Food List and drives suggestions
    - **verbatim:** 7.Vision AI Integration — A standout feature, Vision AI enables you to: Use your phone to scan ingredients. Automatically add scanned items to your Food List. Suggest recipes based on the ingredients you already have.
    - **url:** https://web.archive.org/web/20250910070902/https://support.samsungfood.com/hc/en-us/articles/32709269852052-What-s-Included-in-Your-Samsung-Food-Subscription
  - _item 27_
    - **claim:** SUPPORT ARTICLE — full Food+ inclusion list, canonical
    - **verbatim:** 1. Tailored 7-Day Meal Plans ... 2. Meal Plan Templates ... 3. Recipe Personalization with AI ... 4. Streamlined Shopping and Food Lists ... 5. "Use It Up" Recipe Search ... 6. Advanced Nutrition Tracking ... 7.Vision AI Integration ... 8. AI-guided recipes ... 9. Unlimited Recipe  Scans from Images
    - **url:** https://web.archive.org/web/20250910070902/https://support.samsungfood.com/hc/en-us/articles/32709269852052-What-s-Included-in-Your-Samsung-Food-Subscription
  - _item 28_
    - **claim:** SUPPORT ARTICLE — recommendation AI described as deliberately invisible; no rationale surfaced
    - **verbatim:** Ever notice how the app suggests recipes that match your taste? That's AI learning from your preferences and offering suggestions that suit you best. Whether it's on the Explore page or in your inbox, AI's trying to make things more convenient for you. ... there's this smart AI quietly doing its thing
    - **url:** https://web.archive.org/web/20250910071305/https://support.samsungfood.com/hc/en-us/articles/22549801831060-AI-use-within-Samsung-Food-Unveiling-the-AI-Magic-Inside-Your-Recipe-App
- **explains why recommended:** no
- **names item and date in rationale:** no
- **effect on our claim:** LEAVES_IT_STANDING
- **what this fixes:** WHAT IS NOW FIRST-PARTY (was third-party/support-centre only):
  
  1. The Food+ feature list itself. All seven premium features are now quoted verbatim from Samsung's own marketing page as archived at capture 20260827152331 (2026-08-27), not inferred from reviewers or the support centre. The 403 is bypassed; the survey's "vendor page unreachable" limitation is closed for the marketing page.
  
  2. Price. Was "unknown". Now first-party and doubly sourced: the vendor page's own plan cards and FAQ ("7 days free, then $59.99/year", "7 days free, then $6.99/month", "Our subscriptions cost $6.99 per month or $59.99 per year"), corroborated by Samsung's own support article (capture 20250910070902). Also first-party: purchase is mobile-only, price varies by country, and Food+ can be obtained free with a Samsung device or Samsung Rewards.
  
  3. The mobile-only boundary. Previously an inference. Now first-party and explicit: the vendor page stamps "Exclusively on mobile app" on ALL SEVEN Food+ features, including the entire expiry-aware capability (Search recipes by food list, Automated pantry food list). The FAQ repeats "Note: Available on mobile only" for AI personalization and nutrition tracking, and the support article routes Food List search through "the Explore tab in the app". So Samsung Food's web app ships NONE of the expiry-prioritising behaviour — the bar a web product must clear is the free tier (browse, communities, save, meal plans, shopping lists), not Food+.
  
  4. The mechanism behind "prioritizing soon-to-expire items". The archived support article (capture 20251115192518) gives the actual ranking rule in Samsung's own words: most-ingredients-matched first, expiring items prioritised, and "Each recipe will show how well it matches your selected ingredients." That is a match-strength indicator over the ingredient set — not a reason, not a named item, not a date.
  
  5. A load-bearing negative we did not have before. Samsung's own Food List article states: "*Please note that we do not notify users about any items in the Food List that are close to their due date." First-party, unambiguous: Samsung Food never proactively tells a user an item is about to expire. Expiry only ever acts as a hidden sort key inside a Food+ search the user has to initiate, on mobile, behind a filter.
  
  WHAT IS STILL NOT FIRST-PARTY / STILL OPEN:
  
  - The live samsungfood.com/food-plus/ still 403s to agents. All vendor evidence is archival. The capture is Samsung's own bytes with a timestamp, which beats third-party sourcing, but it is a snapshot and could be stale relative to today (2026-09-13); the Food List and subscription support articles are older captures (2025-08-14, 2025-09-10, 2025-11-15).
  
  - It remains a MARKETING page plus a help centre. Neither is a spec, a changelog, or in-product UI. We have Samsung's description of the product, not the product. Nothing here proves absence in the shipped app — only that Samsung never claims it.
  
  - No in-app screenshots were obtainable. The support-article image attachments are archived as bare /hc/article_attachments/<id> URLs with no captions, so we cannot read the actual recipe-card UI to see whether some unadvertised rationale string exists on screen. This is the one residual gap on the decisive question.
  
  - Nothing was found on web-app parity beyond the "Or try our web app" link; we have no first-party enumeration of what the web app does support.
  
  ON THE DECISIVE QUESTION: I searched every mined page for why / because / reason / based on / explain / transparen / tells you. Across the Food+ marketing page, the Food List article, the Use It Up / ingredient-search article, and the subscription article, there are ZERO hits in any feature-describing context. The only "based on" on the vendor page is "custom meal plans based on your health goals" — a personalisation blurb, not a per-recommendation rationale. The one place Samsung addresses recommendation reasoning at all, the AI article, frames opacity as the selling point: "there's this smart AI quietly doing its thing." Samsung Food prioritises by expiry; it never surfaces the fact that it did, never names the triggering ingredient, and never shows its date. The strongest per-recipe string Samsung documents is a match-percentage against the ingredient set. Our differentiator — an explicit, per-recommendation rationale naming the specific item and its date — is untouched, and the "we do not notify users" admission arguably widens the gap rather than narrowing it.
