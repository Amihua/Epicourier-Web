# complaints:oss-issues

**Workflow:** P1b Claude market survey (run 1)  
**Phase:** Complaints  
**Model:** Claude Opus 5 (1M context), `claude-opus-5[1m]`  
**Agent id:** `a023f520e8114784f`  
**Tool calls:** 43 total — 1 web searches, 8 pages fetched  
**Raw transcript:** `raw/agent-a023f520e8114784f.jsonl` (full tool-call trace, retained)

---

## Prompt, exactly as issued

```text
You are mining real user complaints about products like ours, for a requirements document.

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

YOUR SOURCE ASSIGNMENT:
Mine the PUBLIC ISSUE TRACKERS of open-source rivals — grocy/grocy, mealie-recipes/mealie,
TandoorRecipes/recipes, TomBursch/kitchenowl on GitHub. Search their open and closed issues and
discussions for: expiry handling, waste, "why was this suggested", pantry accuracy, barcode
scanning pain, shopping-list-to-pantry sync. These are the highest-quality complaint evidence
available because each one has a permanent URL, a date, and a thread of other users agreeing.

Cluster what you find into themes. Rank by frequency times severity. For each theme quote ONE
complaint verbatim — copied exactly, not paraphrased — with the URL it came from, and say
whether any current product has fixed it (name it, with a URL) or whether none has.

Be explicit that this is a convenience sample and not a frequency estimate. Do not manufacture
a quote. If you cannot find a real quote for a theme, drop the theme.
```

## Searches actually run

- `docs.tandoor.dev pantry "on hand" food inventory expiration`

## Pages actually fetched

- https://grocy.info/changelog   — asked: Search this changelog for any entry about the purchase view due date being overwritten or reset when the Locat
- https://docs.tandoor.dev/features/shopping/   — asked: Quote verbatim any sentences describing pantry / "on hand" behaviour, especially: automatically marking items 
- https://docs.tandoor.dev/features/shopping_list/   — asked: Quote verbatim any sentences about "on hand", pantry, automatically marking food on hand when checked off a sh
- https://docs.tandoor.dev/features/food/   — asked: Quote verbatim any sentences about "on hand", pantry, inventory, expiration or expiry dates. Copy exact wordin
- https://docs.tandoor.dev/features/shopping/   — asked: Quote verbatim, exactly as written, any bullet or sentence containing the phrase "on hand". Also quote anythin
- https://github.com/grocy/grocy   — asked: Quote verbatim the README's feature list bullets about stock/inventory, due dates or best-before dates, and re
- https://kitchenowl.org/   — asked: Quote verbatim the list of features this product advertises. I specifically need to know whether it advertises
- https://grocy.info/   — asked: Quote verbatim the feature descriptions, especially anything about stock/inventory, best before / due dates, e

## Response

- **themes:**
  - _item 1_
    - **theme:** Shopping-list → pantry transfer is manual, or the setting exists but silently does nothing (directly our "purchased" transfer use case)
    - **verbatim quote:** Enabling Auto On Hand would make me think, that after checking an ingredient off my shopping list, they would appear in my pantry. After enabling and checking off ingredients off my shopping list, nothing gets added to the pantry.
    - **quote source url:** https://github.com/TandoorRecipes/recipes/issues/4636
    - **already fixed by:** PARTIALLY — grocy fixed it, Tandoor and KitchenOwl have not. grocy shipped a "Shopping list to stock workflow" after grocy#98 (18 comments, 2018); a later user comment on that thread states the catch verbatim: "you must have the 'default due days' set for every item in the shopping list" (https://github.com/grocy/grocy/issues/98#issuecomment-3032549850). grocy's changelog also records "Fixed that the 'Add all list items to stock' shopping list workflow did not work for more than ~6 items" (v4.3.0, https://github.com/grocy/grocy/blob/master/changelog/76_4.3.0_2024-12-23.md). Tandoor: NOT fixed — TandoorRecipes/recipes#4701 "Auto add to Pantry" is still OPEN (created 2026-06-15), asking "When items are ticked off a shopping list, automatically add to pantry, with a popup to choose quantity and expiry." (https://github.com/TandoorRecipes/recipes/issues/4701). KitchenOwl: NOT fixed — proposed only, as Phase 2 of an open feature request (https://github.com/TomBursch/kitchenowl/issues/1040).
    - **frequency signal:** Strongest cross-repo signal I found: 3 of the 4 assigned trackers. grocy#98 (18 comments), grocy#2261, grocy#1239, grocy#1248, grocy#1837, Tandoor#4636, Tandoor#4701, KitchenOwl#1040 Phase 2. Convenience sample from keyword search, not a frequency estimate.
    - **severity:** High — this is one of our twenty implemented use cases end-to-end. The Tandoor case is the worst failure mode: the toggle exists, the user enables it, and nothing happens with no error. A silent no-op is worse than an absent feature because the user stops hand-entering and their pantry quietly drifts wrong.
  - _item 2_
    - **theme:** Unit/quantity math breaks the "do I have enough?" calculation — the engine behind our inventory match percentage
    - **verbatim quote:** When I have e.g. 500g of minced meat, but I need 750g, it adds 750g to my list, instead of 250
    - **quote source url:** https://github.com/TandoorRecipes/recipes/issues/4636#issuecomment-4274612494
    - **already fixed by:** NONE that I could verify. This complaint was posted 47 minutes AFTER the maintainer closed the issue as "It is working as expected" (https://github.com/TandoorRecipes/recipes/issues/4636#issuecomment-4274546041), and received no reply — so it is not tracked anywhere I could find. grocy has repeatedly hit the same class of bug: grocy#1239 reports the shopping-list tooltip saying "Add 225 Pieces to stock" instead of "Add 5 Pieces to stock" (https://github.com/grocy/grocy/issues/1239), and grocy#2865 "/api/stock/products/{productId}/add endpoint ignores purchase quantity unit and product-specific conversions" (https://github.com/grocy/grocy/issues/2865). I found no product that demonstrably gets partial-quantity availability right.
    - **frequency signal:** Moderate but recurring across two repos over five years (grocy#1239 in 2020, grocy#2028, grocy#2865 in 2026, Tandoor#4636 in 2026). Low reaction counts — this is a quiet bug class that individual users hit rather than rally around. Convenience sample.
    - **severity:** High — binary on-hand/not-on-hand is easy; partial quantities are where every one of these products breaks. Our "inventory match percentage" is a fraction, so it is structurally exposed to exactly this bug, and a wrong percentage is silently wrong: the user sees 80% and has no way to tell it should have been 40%.
  - _item 3_
    - **theme:** Camera barcode capture is unreliable — the scan itself misreads or returns different results from the same image
    - **verbatim quote:** the barcode recognition is hit or miss, with miss happening more often.
    - **quote source url:** https://github.com/grocy/grocy/issues/362
    - **already fixed by:** PARTIALLY, by grocy — and its own changelog hedges. grocy v4.5.0 (2025-03-28) records verbatim: "The component used (so far [Quagga2](https://github.com/ericblade/quagga2)) that powers the camera barcode scanner was replaced by [ZXing](https://github.com/zxing-js/library) which should perform overall better" (https://github.com/grocy/grocy/blob/master/changelog/80_4.5.0_2025-03-28.md). Note "should perform overall better" is the maintainer's own hedge, not a fix claim. Separately, grocy added Open Food Facts barcode lookup in v4.4.0 (https://github.com/grocy/grocy/blob/master/changelog/77_4.4.0_2025-01-24.md) — but that solves product identification, not capture reliability. The two are different problems and I am keeping them separate.
    - **frequency signal:** Highest raw issue count of any theme here: ~10 distinct grocy issues spanning 2019-2026 (#362, #749, #857, #1023, #1634, #1762, #2496, #2583, #2603, #2802). Sustained over seven years and across two different scanner engines. Convenience sample, but the duration is itself meaningful.
    - **severity:** Medium for us, High as a warning — Epicourier-Web has NO barcode scanning today. The evidence says this is a multi-year reliability tarpit, not a weekend feature. Read it as a scoping caution, not a gap to rush to fill.
  - _item 4_
    - **theme:** The recommender fails silently and gives no reason — users have to reverse-engineer why nothing (or the wrong thing) was suggested
    - **verbatim quote:** the planner automatically uses AND for the keywords and then does not find any recpies with 'beef' AND 'chicken' and silently ignores the error?
    - **quote source url:** https://github.com/TandoorRecipes/recipes/issues/2930#issuecomment-1969808472
    - **already fixed by:** Mealie fixed its version; Tandoor has not. Mealie: maintainer michael-genson wrote "this behavior is addressed in: https://github.com/mealie-recipes/mealie/pull/4346" and "the new query filter editor will let you control the logic more granularly" (https://github.com/mealie-recipes/mealie/issues/3945#issuecomment-2406475447). Tandoor: NOT fixed — the maintainer promised "a toast that displays a message along the lines of 'Could not find recipes with tags beef and chicken'" back in Feb 2024 (https://github.com/TandoorRecipes/recipes/issues/2930#issuecomment-1969889102), but two years later TandoorRecipes/recipes#4419 (OPEN, 2026-02-07) is still requesting the inclusive-keyword toggle and still reports "the Smart Planning dialog only uses recipes that match ALL selected keywords at the same time" (https://github.com/TandoorRecipes/recipes/issues/4419).
    - **frequency signal:** Two of four repos, with unusually long threads — Tandoor#2930 (9 comments) and Mealie#3945 (16 comments). Long threads here indicate diagnostic difficulty, not popularity: in Tandoor#2930 it took ~4 weeks and three users before anyone identified the AND semantics. Convenience sample.
    - **severity:** High — this is the sharpest transferable lesson for our Gemini meal-plan use case. Their failure was a 2-keyword AND with no explanation; ours would be an LLM returning an unexplained plan from a free-text goal, which is strictly harder to reverse-engineer. Note the asymmetry: their users could eventually deduce the rule because it was deterministic. Ours cannot.
  - _item 5_
    - **theme:** Recipe-first apps ship no pantry at all, so users run a second app alongside and the two drift
    - **verbatim quote:** we currently need to manage the wanted groceries inside Kitchenowl and the inventory in Homebox, which is not very neat. Mistakes happen.
    - **quote source url:** https://github.com/TomBursch/kitchenowl/issues/1032
    - **already fixed by:** grocy and Tandoor have; KitchenOwl has NOT. grocy is built around stock (https://grocy.info/). Tandoor added a pantry in 2026 — maintainer vabene1111: "I just implemented it rather quick and dirty as I wanted to use it myself" (https://github.com/TandoorRecipes/recipes/issues/4708#issuecomment-4769614911). KitchenOwl: still absent — its own homepage feature list at https://kitchenowl.org/ advertises households, recipes, shopping lists, meal plan and expense splitting ("Households allow you to work on recipes, expenses, shopping lists, and meal plans together") and mentions no pantry, inventory or expiry tracking at all. The request has been open since Feb 2022: https://github.com/TomBursch/kitchenowl/issues/10
    - **frequency signal:** Best reaction-based signal in this sample: KitchenOwl#10 (10 reactions, open since 2022-02), #1040 (5 reactions), #1032 (2 reactions), #517 (closed); plus Tandoor#2661 (open since 2023-10). Reactions are the closest thing to a vote in this data, and these are the only issues I found carrying meaningful ones. Convenience sample.
    - **severity:** Medium for us — we already have pantry/fridge/freezer, so this is validation rather than a gap. Its real value is that it identifies which rivals are NOT competing with us on inventory at all.
  - _item 6_
    - **theme:** A user-entered expiry date is silently overwritten by an unrelated field edit
    - **verbatim quote:** the due date is **silently reset** to the auto-calculated value — discarding any date the user had already entered manually.
    - **quote source url:** https://github.com/grocy/grocy/issues/2894
    - **already fixed by:** YES, by grocy — but it took ~5 months. grocy v4.7.0 (2026-08-28) records verbatim: "Fixed that changing the location on the purchase page re-initialized the due date based on product defaults (if any)" (https://github.com/grocy/grocy/blob/master/changelog/82_4.7.0_2026-08-28.md). CORRECTION WORTH FLAGGING: a summarizer first attributed this fix to v4.6.0; I checked the raw changelog files and v4.6.0 (2026-03-06) predates the 2026-03-27 report, so that was wrong. The fix is v4.7.0.
    - **frequency signal:** Weak — and I want to be explicit that I initially over-counted it. grocy#2894 and grocy#2895 look like two independent reports filed hours apart, but I checked the authors and BOTH are the user Githki; #2895 is the same person re-filing after the maintainer rejected the AI-generated content in #2894. So this is ONE reporter, not two. Convenience sample.
    - **severity:** High despite low frequency — severity here comes from silence, not volume. The user believes the real printed expiry date was saved; the pantry then colour-codes against a fabricated default. Every downstream feature we have (colour-coding, expiring-first AI suggestions, waste avoidance) inherits the bad date with no visible symptom. Low report counts are expected for bugs users cannot see.
  - _item 7_
    - **theme:** No proactive expiry alerting — users build external automation to get told before food goes off
    - **verbatim quote:** When food is about to expire I've set up an n8n automation that sends me a notification a week in advance.
    - **quote source url:** https://github.com/TandoorRecipes/recipes/issues/4708#issuecomment-4780897279
    - **already fixed by:** NONE of the four, in-product. This user had to wire up an external workflow tool (n8n) against Tandoor. Tandoor did fix pantry sorting by expiry date in the same thread — maintainer vabene1111: "I changed that in yesterdays release" (https://github.com/TandoorRecipes/recipes/issues/4708#issuecomment-4769614911) — but sorting a list you must remember to open is not notification. grocy's related request for consumption-rate-based warnings, TandoorRecipes-adjacent grocy#2559, remains OPEN since 2024-08-01 (https://github.com/grocy/grocy/issues/2559).
    - **frequency signal:** Weak in count (essentially 2 sources: Tandoor#4708 comment, grocy#2559) but high in quality. A user who invests in standing up a separate automation platform to patch a gap is stronger evidence of unmet need than several upvotes. Convenience sample.
    - **severity:** Medium-High — our colour-coding (expired/critical/warning/unknown) is pull-based: it only works if the user opens the app. This user's workaround shows the pull model is insufficient for the one job that is time-critical.
  - _item 8_
    - **theme:** Expiry threshold buckets are inconsistent with each other and are not user-configurable
    - **verbatim quote:** Now there is a discrepancy in color coding of products. This new algorithm is misleading me.
    - **quote source url:** https://github.com/grocy/grocy/issues/2341
    - **already fixed by:** PARTIALLY, by grocy. The inconsistency was fixed in v4.1.0 (2024-02-09), which records verbatim: "Fixed that the status filter \"_n_ products are overdue\" on the stock overview page also counted/included stock entries due today or tomorrow" (https://github.com/grocy/grocy/blob/master/changelog/74_4.1.0_2024-02-09.md). But the reporter's second request — that the threshold be configurable ("I can imagine it can be beneficiary for some users if it would be optional") — was NOT granted; no such option appears in the changelog. Related and also unresolved at product level: grocy#2136 and grocy#2825 both ask for "no expiration date" to be settable per-product rather than per-purchase (https://github.com/grocy/grocy/issues/2136, https://github.com/grocy/grocy/issues/2825).
    - **frequency signal:** Weak-moderate, single repo: grocy#2341, plus grocy#2136 and grocy#2825 on the adjacent "items that legitimately never expire" problem. Convenience sample.
    - **severity:** Medium — we ship four buckets (expired/critical/warning/unknown) with, as far as this report is concerned, fixed thresholds. grocy's bug was precisely two views disagreeing about which bucket an item was in. Any place we compute a bucket twice is exposed to the same defect, and the unresolved half (configurability, and per-product "never expires") maps onto our "unknown" bucket.
  - _item 9_
    - **theme:** Per-item data entry makes post-shopping intake so slow that users abandon the inventory
    - **verbatim quote:** just quickly scanning things out of the shopping bags and shoving them in the fridge, vs. manually having to enter data on every item
    - **quote source url:** https://github.com/grocy/grocy/issues/2802
    - **already fixed by:** NOT fixed as behaviour — the outcome was a documentation change only. The reporter's own follow-up notes the resolution was a docs PR (https://github.com/grocy/grocy/issues/2802#issuecomment-2326100823), and the reporter's own EDIT 2 states the deeper fix was never made: "a more proper fix _might_ need to be a default amount for purchase *per product*" (https://github.com/grocy/grocy/issues/2802). Corroborating, grocy#2496 shows scan mode erroneously reporting it could not fill fields it had in fact filled (https://github.com/grocy/grocy/issues/2496), and grocy#2603 shows it submitting before fields populate (https://github.com/grocy/grocy/issues/2603).
    - **frequency signal:** Moderate, single repo, but with unusually blunt abandonment language. grocy#2802, #2496, #2603, #2771, #2177. Convenience sample.
    - **severity:** Medium-High — the same reporter wrote that the friction was enough to block household adoption outright. Our "purchased" transfer flow is the exact equivalent moment. If moving checked items into inventory demands per-item expiry and quantity input, the evidence says users stop doing it, and a pantry nobody updates poisons our match percentage and our expiring-first AI suggestions.
  - _item 10_
    - **theme:** No waste/spoilage statistics — users cannot see what they actually threw away
    - **verbatim quote:** I'd love to se some statistics on how much food goes to waste, and some functions to help reducing waste.
    - **quote source url:** https://github.com/grocy/grocy/issues/504
    - **already fixed by:** SPLIT — the suggestion half is fixed, the statistics half is not. The same sentence continues "Maybe get grocy to propose meals from the list of soon expiring food", and grocy DOES now do that: grocy.info states verbatim "A \"Due Score\" indicates which recipes are good for using up stock items that are due soon or already overdue, to help not waste them" (https://grocy.info/, checked 2026-09-13). The statistics half is NOT fixed: the consolidated tracking issue grocy#64, which explicitly lists "Percentage of spoiled products", has been OPEN since 2018-09-24 with 9 reactions (https://github.com/grocy/grocy/issues/64), and grocy.info advertises no waste reporting. CAUTION: grocy#504 shows as "closed as completed", but reading the thread it was closed 11 minutes after filing by being quoted into the still-open #64 — closed here does not mean shipped.
    - **frequency signal:** grocy#64 carries 9 reactions and 11 comments and has stayed open for 8 years, with several independent users adding spoilage-analysis asks (oakbrad, teitrand). That combination of duration and repeat asks is the better signal here, not the count. Convenience sample.
    - **severity:** Medium — we have a nutrient dashboard with trends and CSV export but no waste dimension. grocy's Due Score shows the prevention half is table stakes among serious rivals; the measurement half is genuinely unserved in this sample, and we already have the trend/export machinery to carry it.
  - _item 11_
    - **theme:** The recommender draws from a biased subset and repeats itself
    - **verbatim quote:** When I use the Meal Planner to plan a random dinner, it sometimes selects the exact same dish I had yesterday.
    - **quote source url:** https://github.com/mealie-recipes/mealie/issues/3647
    - **already fixed by:** SPLIT. The biased-subset half IS fixed by Mealie: merged PR #4435 "fix: Random Recipes not choosing from all recipes" explains verbatim "Our way of choosing a random recipe in the frontend assumes all recipes are loaded, but since we're paginating they're not" (https://github.com/mealie-recipes/mealie/pull/4435, merged 2024-10-29), closing mealie#4250 where a user reported "it only picks from around 100 of my most recently added recipes" (https://github.com/mealie-recipes/mealie/issues/4250). The repetition half is NOT fixed: mealie#3647 was closed without a fix, maintainer boc-the-git writing "I'm going to close this and suggest this is best as a feature request that will require a fair bit of discussion" (https://github.com/mealie-recipes/mealie/issues/3647#issuecomment-2135853559).
    - **frequency signal:** Weak-moderate, concentrated in one repo: mealie#3647, #4250, #3945, plus Tandoor#4359. Convenience sample.
    - **severity:** Medium — our 3/5/7-meal AI plans are generated in one shot, so intra-plan repetition and day-to-day repetition across successive plans are both live risks. Mealie's pagination bug is also a useful specific warning: if we pass only a page of candidate recipes to Gemini, we reproduce their biased-subset defect while it looks like a model quality problem.
  - _item 12_
    - **theme:** The pantry list silently truncates, so the inventory the user sees is not the inventory they have
    - **verbatim quote:** If you have 51 items, it only shows 50 items, no matter you choose 10 per page or 100 per page or All.
    - **quote source url:** https://github.com/TandoorRecipes/recipes/issues/4689
    - **already fixed by:** YES, by Tandoor, quickly. Maintainer vabene1111 closed it with "did not see the issue or PR but fixed it with the last update myself. Thaks." (https://github.com/TandoorRecipes/recipes/issues/4689#issuecomment-4823060090), ~3 weeks after the 2026-06-03 report.
    - **frequency signal:** Single report, single repo — the weakest frequency evidence in this set, and I am including it only because the failure mode is directly transferable, not because it is common. Convenience sample.
    - **severity:** Medium — a silent cap is the pantry-accuracy failure users cannot detect. For us it would also corrupt derived numbers: an inventory match percentage or an expiring-items AI prompt computed over a truncated list is wrong with no visible symptom. Worth an explicit pagination check on our inventory and expiry queries.
- **sampling limitation:** THIS IS A CONVENIENCE SAMPLE, NOT A FREQUENCY ESTIMATE. Do not put percentages on any of it.
  
  HOW IT WAS GATHERED: keyword searches via the authenticated `gh` CLI across exactly four repos — grocy/grocy, mealie-recipes/mealie, TandoorRecipes/recipes, TomBursch/kitchenowl — on terms I chose in advance (expiry, expiration, expired, waste, barcode, scan mode, pantry, inventory, shopping list/stock, meal plan suggestion, random recipe). Every issue body, comment and changelog line quoted above was retrieved in this session.
  
  SIX SPECIFIC REASONS THE COUNTS ARE NOT MEANINGFUL:
  
  1. Self-selection. Filing a GitHub issue requires a GitHub account and tolerance for maintainer pushback. The grocy threads show exactly why that filter is severe: maintainer replies in this sample include "The 'Suggested fix' is such pure bullshit" (#2894) and "I'm allergic to when each and every single detail not fitting personally you on a first sight is reported as a Bug" (#2520). Users who bounce off that leave no trace. Non-technical users — arguably our primary audience — are almost entirely absent from this data.
  
  2. Keyword bias. I only found themes I thought to search for. Absence of a theme here is NOT evidence users do not want it. Notably, my searches for expiry NOTIFICATIONS ("notification expiring soon", "notify expiration") returned essentially nothing usable, and my searches for "thrown away spoiled" and "food waste track" returned almost nothing. I am reporting that as an honest empty result. The one notification data point I have surfaced incidentally, inside an unrelated thread.
  
  3. Severe repo skew. grocy dominates because it is the only one of the four organised around inventory, and it has ~8 years of issues. That is an artifact of which repos I was assigned and how old they are, not a measure of where users hurt most.
  
  4. "Closed" does not mean "fixed", and I caught three cases of this. grocy#2520 shows state_reason=completed but was in fact REJECTED by the maintainer. grocy#504 shows completed but was consolidated into grocy#64, still open after 8 years. grocy#2802 was closed by a DOCUMENTATION change while the reporter's actual fix suggestion went unimplemented. I read closing comments rather than trusting status fields, and anyone reusing this data should too.
  
  5. One error I made and corrected, disclosed for calibration. I initially treated grocy#2894 and grocy#2895 as two independent reporters filing the same expiry-overwrite bug hours apart — a strong frequency signal. Checking the authors showed BOTH are the user Githki; the second is a re-file after the first was rejected. It is one reporter. I have corrected the count in that theme. Separately, a page-summarizer attributed the fix for that bug to grocy v4.6.0; reading the raw changelog files showed v4.6.0 (2026-03-06) predates the 2026-03-27 report, and the real fix is v4.7.0 (2026-08-28). Both quoted claims come from the raw files, not the summary.
  
  6. Reaction counts are a weak proxy. Only five issues in this entire sample carry meaningful reactions (KitchenOwl#10 at 10, grocy#64 at 9, KitchenOwl#1040 at 5, KitchenOwl#1032 at 2, Tandoor#2661 at 1). Most carry zero. I have leaned on thread length, duration-open, and independent re-reports instead, and said so per theme.
  
  SCOPE NOT COVERED: this is open-source trackers only. I did not mine app-store reviews, Reddit (r/grocy is referenced repeatedly by grocy's maintainer as the support venue and almost certainly holds a different and larger complaint population), or any commercial rival's feedback channel. Commercial meal-planning products have no public tracker, so they are structurally invisible here — their absence from this report says nothing about their quality or their users' complaints.
  
  ONE STRUCTURAL GAP WORTH NAMING: none of the four rivals uses an LLM for meal recommendation, so there is NO direct evidence in this sample about complaints against LLM-generated meal plans. My theme on recommender opacity is drawn from deterministic keyword-matching planners. The inference to our Gemini use case is mine, not the users' — and it is an inference that cuts against us, since their users could eventually deduce a deterministic rule and ours cannot.
