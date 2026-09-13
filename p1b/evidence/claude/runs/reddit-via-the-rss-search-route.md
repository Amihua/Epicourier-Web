# Reddit via the RSS search route

**Workflow:** P1b Claude gap-closing (run 5)  
**Phase:** Close  
**Model:** Claude Opus 5 (1M context), `claude-opus-5[1m]`  
**Agent id:** `a9bfea245b688d80d`  
**Tool calls:** 70 total — 0 web searches, 0 pages fetched  
**Raw transcript:** `raw/agent-a9bfea245b688d80d.jsonl` (full tool-call trace, retained)

---

## Prompt, exactly as issued

```text
Our market survey recorded a limitation: **Reddit was unreachable for the entire
session — `WebFetch` on reddit.com and old.reddit.com failed on every attempt.** That cost us the
community voice in our complaint evidence.

**THE ROUTE IS SOLVED — use it.** The RSS search endpoint returns HTTP 200:

    curl -sL -H "User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Safari/537.36" \
      "https://www.reddit.com/r/<sub>/search.rss?q=<query>&restrict_sr=1&limit=25&sort=relevance"

(The .json variant 403s; the .rss variant does not. Some endpoints rate-limit with 429 — pause and
retry rather than concluding failure. Site-wide search also works: /search.rss?q=...)

Mine these subreddits: r/mealprep, r/EatCheapAndHealthy, r/ZeroWaste, r/selfhosted, r/Cooking,
r/MealPrepSunday, r/Frugal, r/homeautomation, r/grocy.

YOU HAVE TWO JOBS, and the first is the important one.

**JOB 1 — replace a citation we had to withdraw.** Our confirming evidence for the gap was a
customer review we could not substantiate: someone asking for "an option to choose how closely
your pantry meets the recipe requirements instead of random broad matches". We pulled it, which
leaves a hole. Go and find a REAL one: an actual person asking, in their own words, for a meal or
pantry app to show its reasoning, to explain why a recipe was suggested, to let them see or
correct what it assumed, or complaining that a suggestion made no sense and they could not tell
why. Quote it EXACTLY with its permalink and date.

If you cannot find one, say so plainly — "not found in this search" — and we will report the gap
as having no demand-side evidence. That is a legitimate and useful outcome, and it is far better
than another citation we cannot defend.

**JOB 2 — the abandonment evidence for G3.** Find people describing how their pantry app inventory
decayed, how manual entry defeated them, or why they stopped. We have App Store reviews for this;
Reddit threads are stronger because they have discussion under them.

EVIDENCE RULES:
- Do NOT invent anything. Every claim needs a URL you actually retrieved this session.
- Quote 5-25 words of ACTUAL text, with the exact URL it came from.
- "unknown" beats plausible. Silence on a page means unknown, never "no".
- A vendor artifact proves a CLAIM WAS MADE, not that a feature ships. Say which you have.
- If a source is a marketing mockup rather than a real capture, SAY SO. We were burned by exactly
  this: a rival's App Store screenshot that looked like proof turned out to have "Sketch" and
  "9:41 AM" in its status bar.
- WebSearch may hit a 200-call session cap. Prefer direct fetches (Bash curl / WebFetch); the
  routes below are already proven to work, so use them rather than rediscovering them.

OUR SURVIVING CLAIM, already narrowed twice:

  "No shipped consumer meal product joins all four facts in one auditable, correctable
   explanation: the NAMED PANTRY ITEM, its ACTUAL EXPIRY DATE, the NUTRIENT CONSTRAINT the dish
   satisfies, and the REASON for the SUBSTITUTION it made."

Known positions: RecipeFix explains substitutions but holds no inventory and no dates. Cooklist
advertises "Your parsley is 7 days old and may expire soon" but the artifact is a vendor mockup.
Remy prints "Using up before they expire: <item> · <qty>" above suggested recipes but states no
date and no reason. Grocy publishes a due-score formula but shows the user a bare integer.

Refuting this claim is MORE valuable to us than confirming it.
```

## Response

- **route worked:** True
- **queries run:**
  - r/mealprep search.rss q=pantry app (route validation)
  - site-wide search.rss q=pantry inventory app gave up
  - site-wide search.rss q=stopped using pantry tracking app
  - site-wide search.rss q=pantry app manual entry tedious
  - r/grocy search.rss q=gave up inventory
  - r/selfhosted search.rss q=grocy inventory out of date
  - site-wide search.rss q=recipe app suggestions make no sense
  - r/ZeroWaste search.rss q=pantry app
  - r/ZeroWaste search.rss q=expiration tracking app
  - r/selfhosted search.rss q=grocy
  - r/selfhosted search.rss q=pantry
  - r/grocy search.rss q=inventory
  - r/Cooking search.rss q=pantry app
  - r/MealPrepSunday search.rss q=pantry app
  - r/Cooking search.rss q=supercook
  - r/Cooking search.rss q=AI recipe hallucinate
  - r/Cooking search.rss q=app explain why recipe
  - comment feed r/mealprep/comments/1rsgprn.rss
  - comment feed r/mealprep/comments/1ci3434.rss
  - comment feed r/mealprep/comments/1myyutk.rss
  - comment feed r/mealprep/comments/1mzfuuy.rss
  - comment feed r/Cooking/comments/1nengp6.rss
  - comment feed r/Cooking/comments/ia80n6.rss
  - comment feed r/Cooking/comments/mzqg7q.rss
  - comment feed r/Cooking/comments/1i1jbo4.rss
  - comment feed r/Cooking/comments/1g9zl57.rss
  - comment feed r/Cooking/comments/1mfd0s3.rss
  - comment feed r/Cooking/comments/1oscj3u.rss
  - comment feed r/grocy/comments/g094di.rss
  - comment feed r/grocy/comments/1e41xuo.rss
  - comment feed r/MealPrepSunday/comments/1t3qcpk.rss
  - regex sweep of all 32 parsed corpora (851 unique entries) for: 'explain why' | 'tell me why' | 'show the reasoning' | 'why it picked/chose/suggested/recommended' | 'no idea why' | 'makes no sense' | 'black box' | 'transparent' | 'arbitrary' | 'couldn't tell why'
  - regex sweep of all corpora for assumption language: 'assume(s/d)' | 'pretends I have' | 'thinks I have'
  - regex sweep of all corpora for abandonment language: 'gave up' | 'stopped using' | 'abandoned' | 'too much work' | 'tedious' | 'up to date' | 'fell off' | 'upkeep'
- **threads:**
  - _item 1_
    - **title:** Do you guys use meal-planning or pantry tracking apps to cook?
    - **url:** https://www.reddit.com/r/Cooking/comments/1nengp6/do_you_guys_use_mealplanning_or_pantry_tracking/
    - **subreddit:** r/Cooking
    - **date:** 2025-09-11
    - **verbatim quote:** always ended up abandoning it after less than a month
    - **what it evidences:** G3 — strongest single abandonment citation. OP names four shipped products by name (Paprika, Recime, Cooklist, KitchenPal) and reports abandoning all of them inside a month. Caveat for defensibility: the thread was auto-removed by AutoModerator for Rule 1, so only one substantive reply survives (a user who switched to Copy Me That). The OP text itself is live and retrievable at this URL.
  - _item 2_
    - **title:** Why do meal planning / recipe apps lose me so fast?
    - **url:** https://www.reddit.com/r/mealprep/comments/1rsgprn/why_do_meal_planning_recipe_apps_lose_me_so_fast/okytnkn/
    - **subreddit:** r/mealprep
    - **date:** 2026-05-10
    - **verbatim quote:** you spend more time managing the app than actually cooking. The ones that force you to enter every single ingredient manually are the worst
    - **what it evidences:** G3 — names the decay mechanism explicitly: manual entry cost exceeds the cooking benefit. This is a comment (u/Ok-Big4349) on a live discussion thread, so it has discussion around it, which is what you wanted over App Store reviews.
  - _item 3_
    - **title:** Why do meal planning / recipe apps lose me so fast?
    - **url:** https://www.reddit.com/r/mealprep/comments/1rsgprn/why_do_meal_planning_recipe_apps_lose_me_so_fast/onxgyxs/
    - **subreddit:** r/mealprep
    - **date:** 2026-05-26
    - **verbatim quote:** start feeling like extra admin work rather than reducing it
    - **what it evidences:** G3 — second independent commenter (u/TotalArthur) on the same thread, describing the same decay curve: apps feel useful while motivation is high, then become admin overhead once 'real life kicks in (busy weeks, changes in plans, missing ingredients)'.
  - _item 4_
    - **title:** How to start with the inventory process - any tips?
    - **url:** https://www.reddit.com/r/grocy/comments/g094di/how_to_start_with_the_inventory_process_any_tips/
    - **subreddit:** r/grocy
    - **date:** 2020-04-13
    - **verbatim quote:** it seems so overwhelming that I have given up everytime
    - **what it evidences:** G3 — abandonment at the cold-start step, from a self-hoster motivated enough to install Grocy on Home Assistant. Evidences that initial inventory capture alone defeats users before any recipe matching happens.
  - _item 5_
    - **title:** How do you update your inventory?
    - **url:** https://www.reddit.com/r/grocy/comments/c9dudc/how_do_you_update_your_inventory/
    - **subreddit:** r/grocy
    - **date:** 2019-07-05
    - **verbatim quote:** most of the time things will be consumed without tracking this in grocy
    - **what it evidences:** G3 — the decay mechanism stated precisely by a committed Grocy user: consumption happens away from the terminal, so the recorded inventory silently diverges from reality. This is the single cleanest statement of WHY pantry inventories rot.
  - _item 6_
    - **title:** How do you inventory something that's not there?
    - **url:** https://www.reddit.com/r/grocy/comments/1e41xuo/how_do_you_inventory_something_thats_not_there/
    - **subreddit:** r/grocy
    - **date:** 2024-07-15
    - **verbatim quote:** glass cleaner shows up as one in stock but in reality I have none
    - **what it evidences:** G3 — decay made concrete, with real discussion under it (7 entries, including Grocy's own maintainer u/berrnd replying). Shows the divergence is a known, recurring workflow problem, not a one-off user error.
  - _item 7_
    - **title:** How Do You Manage Your Pantry Expiration Dates?
    - **url:** https://www.reddit.com/r/Cooking/comments/mzqg7q/how_do_you_manage_your_pantry_expiration_dates/
    - **subreddit:** r/Cooking
    - **date:** 2021-04-27
    - **verbatim quote:** I really don't want to sit and register every single tiny item, because I feel I won't keep it up
    - **what it evidences:** G3 — pre-emptive refusal to adopt. The user has the exact pain the category targets (found food expired weeks after eating it) and still declines, predicting their own abandonment. Strong demand-side evidence that manual entry is the adoption barrier.
  - _item 8_
    - **title:** Using pantry apps requires too much work?
    - **url:** https://www.reddit.com/r/Cooking/comments/ia80n6/using_pantry_apps_requires_too_much_work/
    - **subreddit:** r/Cooking
    - **date:** 2020-08-15
    - **verbatim quote:** they have to do a lot of work by manually having to add items in there
    - **what it evidences:** G3 — the OP question itself, asking whether others share the manual-entry burden and how anyone manages to 'keep using the app'. 12 replies, none of which name a working app; the answers are spreadsheets, pen and paper, and FIFO rotation.
  - _item 9_
    - **title:** Using pantry apps requires too much work?
    - **url:** https://www.reddit.com/r/Cooking/comments/ia80n6/using_pantry_apps_requires_too_much_work/g1lypai/
    - **subreddit:** r/Cooking
    - **date:** 2020-08-15
    - **verbatim quote:** using a notebook and pen honestly works better than an app
    - **what it evidences:** G3 — the substitute-good finding. When the reply set to 'how do you keep using a pantry app' is paper, spreadsheets and FIFO, the category is losing to analog, not to a competitor.
  - _item 10_
    - **title:** Meal planning app without grocery integration
    - **url:** https://www.reddit.com/r/mealprep/comments/1ci3434/meal_planning_app_without_grocery_integration/
    - **subreddit:** r/mealprep
    - **date:** 2024-05-02
    - **verbatim quote:** What I absolutely will not do is enter every single ingredient in my kitchen
    - **what it evidences:** G3 — hard refusal of full inventory capture. Same post also carries the closest real analogue to the withdrawn citation (see replacement_for_withdrawn_citation): 'they only suggest recipes that you have 100% of the items. I substitute and change things all the time'.
  - _item 11_
    - **title:** need_fulfilled_with_shopping_list is 1, even with empty inventory and shopping list
    - **url:** https://www.reddit.com/r/grocy/comments/1o73sbd/need_fulfilled_with_shopping_list_is_1_even_with/
    - **subreddit:** r/grocy
    - **date:** 2025-10-15
    - **verbatim quote:** I'm really confused with just one feature
    - **what it evidences:** SUPPORTS THE SURVIVING CLAIM re: Grocy. A user had to open grocy/migrations/0160.sql on GitHub and read the raw CASE/ROUND SQL to work out why Grocy decided his recipe need was fulfilled. Corroborates 'Grocy publishes a due-score formula but shows the user a bare integer' — the reasoning is not surfaced in the UI, so the user reverse-engineered it from source. Note: this is a confused user debugging, NOT a request for an explanation feature, so it is not a JOB 1 replacement.
  - _item 12_
    - **title:** My favorite (I think the best) Meal Prep app is dead. Long live the Meal Prep app
    - **url:** https://www.reddit.com/r/MealPrepSunday/comments/1t3qcpk/my_favorite_i_think_the_best_meal_prep_app_is/
    - **subreddit:** r/MealPrepSunday
    - **date:** 2026-05-04
    - **verbatim quote:** didn't just assume you had something like spices in the pantry
    - **what it evidences:** CLOSEST PARTIAL to JOB 1's 'correct what it assumed'. A real user listing requirements for a Platejoy replacement asks the app to stop silently assuming pantry contents when building a grocery list. It is an assumption-correction request, but about the GROCERY LIST, not about explaining a recipe suggestion — so it does not close the JOB 1 hole. Quote verified against the live thread (43 entries).
  - _item 13_
    - **title:** Need recipe for Cheerios
    - **url:** https://www.reddit.com/r/Cooking/comments/ugv59v/need_recipe_for_cheerios/
    - **subreddit:** r/Cooking
    - **date:** 2022-05-02
    - **verbatim quote:** they don't have a pantry item specifically for Cheerios, just "breakfast cereal," aka cornflakes in 99% of recipes
    - **what it evidences:** PARTIAL for JOB 1 — a real complaint that SuperCook collapsed his actual named pantry item into a coarse category he cannot correct, producing matches premised on an ingredient he does not have. Touches the NAMED PANTRY ITEM leg of the claim and the 'see or correct what it assumed' idea, but the user never asks for an explanation and never says he could not tell why.
  - _item 14_
    - **title:** Recipe/pantry app
    - **url:** https://www.reddit.com/r/Cooking/comments/1mfd0s3/recipepantry_app/
    - **subreddit:** r/Cooking
    - **date:** 2025-08-02
    - **verbatim quote:** when i see i can make 'thousands' of recipes with what I have, I know that's bs
    - **what it evidences:** PARTIAL for JOB 1 — distrust of an unexplained match count. Closest thing found to the withdrawn citation's 'random broad matches' framing. The user disbelieves SuperCook's output but attributes it to duplicate recipes, not to unexplained reasoning, and asks for no explanation feature.
  - _item 15_
    - **title:** Are there any websites or apps that are actually good at recommending foods based on an ingredient?
    - **url:** https://www.reddit.com/r/Cooking/comments/1oscj3u/are_there_any_websites_or_apps_that_are_actually/
    - **subreddit:** r/Cooking
    - **date:** 2025-11-09
    - **verbatim quote:** not looking for some made up nonsense recipe like "clementine chicken teriyaki marmalade casserole"
    - **what it evidences:** PARTIAL for JOB 1 — 'a suggestion made no sense', the first half of your JOB 1 test. But the second half ('and they could not tell why') is absent: the user diagnoses the cause himself as bad recipe sourcing and asks for better results, not for reasoning. Thread has no surviving replies.
  - _item 16_
    - **title:** Looking for a grocery/inventory/recipe solution!
    - **url:** https://www.reddit.com/r/mealprep/comments/1mzfuuy/looking_for_a_groceryinventoryrecipe_solution/
    - **subreddit:** r/mealprep
    - **date:** 2025-08-25
    - **verbatim quote:** The closest I seemed to get with a solution was Cooklist but turns out there's an annual $60 subscription
    - **what it evidences:** Competitive datapoint on Cooklist: a user who searched all day concluded Cooklist was the closest fit to pantry-inventory + recipe matching, and was blocked by price. User-reported pricing, not verified against Cooklist's own site this session.
  - _item 17_
    - **title:** It's been very hard to find a pantry and recipe management app that really provides what I want
    - **url:** https://www.reddit.com/r/Cooking/comments/1i1jbo4/its_been_very_hard_to_find_a_pantry_and_recipe/
    - **subreddit:** r/Cooking
    - **date:** 2025-01-14
    - **verbatim quote:** I don't want an app suggesting me thousands of uncurated recipes
    - **what it evidences:** Competitive landscape, user-side. One user's hands-on verdicts on four shipped products: SuperCook (good pantry management, cannot hold your own recipes), Paprika (no pantry-aware matching or shopping list), Samsung Food/Whisk ('shopping list does not take into account my pantry'), KitchenPal (own recipes not straightforward). Useful for the 'no shipped product joins these' half of the claim — but it is one user's assessment, not a feature audit.
- **abandonment evidence:**
  - "always ended up abandoning it after less than a month" — r/Cooking, 2025-09-11, naming Paprika, Recime, Cooklist, KitchenPal — https://www.reddit.com/r/Cooking/comments/1nengp6/do_you_guys_use_mealplanning_or_pantry_tracking/
  - "you spend more time managing the app than actually cooking. The ones that force you to enter every single ingredient manually are the worst" — r/mealprep comment, 2026-05-10 — https://www.reddit.com/r/mealprep/comments/1rsgprn/why_do_meal_planning_recipe_apps_lose_me_so_fast/okytnkn/
  - "start feeling like extra admin work rather than reducing it" — r/mealprep comment, 2026-05-26 — https://www.reddit.com/r/mealprep/comments/1rsgprn/why_do_meal_planning_recipe_apps_lose_me_so_fast/onxgyxs/
  - "it seems so overwhelming that I have given up everytime" — r/grocy, 2020-04-13 — https://www.reddit.com/r/grocy/comments/g094di/how_to_start_with_the_inventory_process_any_tips/
  - "most of the time things will be consumed without tracking this in grocy" — r/grocy, 2019-07-05 — https://www.reddit.com/r/grocy/comments/c9dudc/how_do_you_update_your_inventory/
  - "glass cleaner shows up as one in stock but in reality I have none" — r/grocy, 2024-07-15 — https://www.reddit.com/r/grocy/comments/1e41xuo/how_do_you_inventory_something_thats_not_there/
  - "I really don't want to sit and register every single tiny item, because I feel I won't keep it up" — r/Cooking, 2021-04-27 — https://www.reddit.com/r/Cooking/comments/mzqg7q/how_do_you_manage_your_pantry_expiration_dates/
  - "they have to do a lot of work by manually having to add items in there" — r/Cooking, 2020-08-15 — https://www.reddit.com/r/Cooking/comments/ia80n6/using_pantry_apps_requires_too_much_work/
  - "using a notebook and pen honestly works better than an app" — r/Cooking comment, 2020-08-15 — https://www.reddit.com/r/Cooking/comments/ia80n6/using_pantry_apps_requires_too_much_work/g1lypai/
  - "What I absolutely will not do is enter every single ingredient in my kitchen" — r/mealprep, 2024-05-02 — https://www.reddit.com/r/mealprep/comments/1ci3434/meal_planning_app_without_grocery_integration/
  - VENDOR CLAIM, NOT USER TESTIMONY — flagging per your rules: "manual entry creates too much friction... leading people to abandon the app after a few days" is a solo developer's marketing post for Mealify 2.0, r/ProductivityGuide, 2026-09-09 — https://www.reddit.com/r/ProductivityGuide/comments/1wbarbp/built_a_camerabased_pantry_app_where_you_snap_a/ . It proves a competitor ASSERTS the abandonment thesis; it is not independent evidence that users abandon. Do not cite it as user evidence. Its value is corroborative: rivals are building receipt/photo OCR specifically to attack manual entry.
- **replacement for withdrawn citation:** NOT FOUND IN THIS SEARCH. I could not find a real person asking a meal or pantry app to show its reasoning, explain why a recipe was suggested, or state that a suggestion made no sense and they could not tell why. Report the explainability gap as having NO demand-side evidence.
  
  This is a searched negative, not an unsearched one. I indexed 851 unique Reddit entries (posts + comments) across r/mealprep, r/Cooking, r/MealPrepSunday, r/ZeroWaste, r/selfhosted, r/grocy, r/EatCheapAndHealthy, including full comment feeds on the eleven most on-topic threads, and ran a regex sweep for: "explain why", "tell me why", "show the reasoning", "why it picked/chose/suggested/recommended", "no idea why", "couldn't tell why", "makes no sense", "black box", "transparent", "arbitrary", "justify". Hits in a meal/pantry/recipe context: ZERO. The only "transparent" match in the whole corpus was someone describing 1990s HTML spacer GIFs.
  
  What users DO ask for, repeatedly and in volume, is: less manual entry, pantry-aware shopping lists, control over match strictness, and the ability to import their own recipes. Nobody asks to be shown the reasoning. Two readings are consistent with this, and I cannot separate them from Reddit alone: either the demand is latent (users cannot ask for an affordance no shipped product has taught them to expect), or explainability is simply not a felt pain in this category. Either way, do not claim demand-side support.
  
  THREE PARTIAL FINDS, offered as adjacent evidence only, each already weaker than what you asked for — do not let any of them be written up as the withdrawn citation's replacement:
  
  1. CLOSEST TO THE WITHDRAWN CITATION'S ACTUAL CONTENT (match-strictness, not explanation). r/mealprep, 2024-05-02: "they only suggest recipes that you have 100% of the items. I substitute and change things all the time" — https://www.reddit.com/r/mealprep/comments/1ci3434/meal_planning_app_without_grocery_integration/ . The withdrawn review wanted to "choose how closely your pantry meets the recipe requirements"; this user wants the same control from the opposite end (apps too strict rather than too broad), and independently raises substitution. It genuinely replaces the match-threshold half of the withdrawn citation. It does NOT replace the auditable/explained half — no reasoning is requested.
  
  2. CLOSEST TO "correct what it assumed". r/MealPrepSunday, 2026-05-04: "didn't just assume you had something like spices in the pantry" — https://www.reddit.com/r/MealPrepSunday/comments/1t3qcpk/my_favorite_i_think_the_best_meal_prep_app_is/ . A real assumption-correction request, but aimed at grocery-list generation, not at a recipe suggestion's reasoning.
  
  3. CLOSEST TO "a suggestion made no sense". r/Cooking, 2025-11-09: "not looking for some made up nonsense recipe like \"clementine chicken teriyaki marmalade casserole\"" — https://www.reddit.com/r/Cooking/comments/1oscj3u/are_there_any_websites_or_apps_that_are_actually/ . Satisfies the first half of your test and fails the second: he diagnoses the cause himself and asks for better results, never for an explanation.
- **honest limits:** ROUTE: The RSS route works, with a correction worth recording. The bare command as given returned HTTP 429 on my first attempt; it only succeeds behind exponential backoff (I used 6 retries at 7/14/21/28/35/42s, treating any response under 500 bytes as a failure). Roughly a third of all fetches 429'd at least once, and some URLs burned 2-3 minutes in retries. Anyone repeating this must pace it or they will wrongly conclude the route is dead, which is likely what happened in the original session.
  
  SEARCH-SYNTAX FINDING that shaped everything below: Reddit's site-wide search.rss collapses on long natural-language queries — "pantry inventory app gave up" returned r/MakeupRehab, r/transformers and a nosleep story. Only SHORT keyword queries with restrict_sr=1 return usable results. The three site-wide long queries I ran were near-total noise. If the earlier session tried long queries, its yield would have looked like failure even had the route worked.
  
  HIGHEST-VALUE TECHNIQUE, for reuse: appending .rss to a thread permalink returns the full comment tree. This is what produced the strongest G3 quotes — they are comments, not posts, and would be invisible to search alone.
  
  WHAT I DID NOT ESTABLISH:
  - Nothing here tests the surviving claim's four-fact conjunction directly. I did not open RecipeFix, Cooklist, Remy or Grocy this session. I found no Reddit user describing ANY product that joins named item + actual expiry date + nutrient constraint + substitution reason — but silence is unknown, not "no". These subreddits discuss apps by name constantly and no such capability is mentioned; treat that as weak negative evidence at most, never as proof no product ships it.
  - The Grocy finding (1o73sbd) is the only thing I retrieved that bears on the claim's "auditable" half, and it cuts the way you predicted: a user had to read migrations/0160.sql to understand a stock decision. But that is one user debugging one flag, not proof Grocy never explains anything.
  - Dates skew wide (2016-2026). The manual-entry complaint is stable across the whole decade, which strengthens it; the specific product names (Recime, KitchenPal, Cooklist) only appear from ~2024, so verdicts on them rest on few users.
  - Reddit vote counts and thread sizes are not in the RSS payload, so I cannot tell you how well-received any quote was. The 1nengp6 thread — my best single citation — was auto-removed by AutoModerator under Rule 1, meaning its discussion never developed. The OP text is live and quotable, but do not describe it as a well-discussed thread.
  - Several 2026-dated posts in r/mealprep are solo-developer promotional posts, not organic user discussion. I excluded them from user evidence and flagged the one abandonment-relevant vendor claim explicitly.
  - I used zero WebSearch calls; everything came from direct curl against reddit.com. Every URL in this report was retrieved this session, and every quote was verified verbatim by fixed-string grep against the saved payloads before submission. Raw captures are at /private/tmp/claude-501/-Users-andy-Library-Mobile-Documents-com-apple-CloudDocs-Work-1151-CSC510/a80b81cb-3c1b-4ae3-bfc2-7a5213ffdcda/scratchpad/reddit/ if you want to re-verify.
  - No App Store, vendor site, or marketing artifact was consulted, so I add nothing to the Cooklist-mockup question either way.
