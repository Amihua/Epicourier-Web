# D1 — Market Survey (Claude analyst)
**Run date:** 2026-09-13 · **Model:** Claude Opus 5 (1M context), `claude-opus-5[1m]` · **Method:** five independent discovery agents, each given a different search angle and no sight of the others' work, followed by an adversarial fact-checker that re-fetched every claim.
**Audit trail across all five runs:** 220 web searches and 534 `WebFetch` retrievals (plus `curl`
fetches, which are not counted), recorded in [`../../evidence/claude/runs/`](../../evidence/claude/runs/) with the prompt as issued, the searches actually run, and the pages actually retrieved, per agent.

---
## How this table was built, and why that matters
The assignment's rule is that a competing product counts only if two of our LLMs name it, or one gives a live URL. We applied a stricter rule to our own column, because a live URL proves a domain is paid for, not that a product ships. Every row below was produced twice: once by a discovery agent, and once by a fact-checker whose instructions were to *catch the first agent out* and which was given no credit for agreeing.

That second pass returned **142 specific corrections across 18 products** — including two products the first pass reported as live rivals that are not on the market at all. The corrections are the subject of [D5](16-prompt-report.md); the table here is what survived them.

## The fourteen confirmed live rivals

Prices and features checked 2026-09-13. `unknown` means the page is silent, and is not evidence of absence.

| Product | Who uses it | Main strength | Main weakness | Price as stated | Evidence URL |
|---|---|---|---|---|---|
| **AnyList** | Couples and families running a shared grocery list; Siri users. | Best-in-class shared list mechanics — "Any changes made to a shared list will show up instantly to everyone sharing the list" and it "suggests common | It is a list app with a recipe box bolted on. The homepage describes no pantry, no expiry, no nutrition and no recommendation of any kind — there is n | 'AnyList Complete is just $9.99 / year for an individual or $14.99 / year for a household.' (https://www.anylist.com/complete). The comparis | https://www.anylist.com/ |
| **Eat This Much** | Macro-tracking lifters, cutters and bulkers; CNN Underscored ranked it #1 meal planning ap | The only assigned rival that generates plans FROM inventory against nutrient targets in one loop. Homepage shows explicit targets — "At least 90g Carb | The prioritisation is invisible and undated. The full pantry help article never mentions expiration dates — items are removed based on when the plan s | Free $0.00 / month; Premium $5.00 / month *With annual subscription; Professional 'Varies / Per client pricing'. Source: https://www.eatthis | https://www.eatthismuch.com/ |
| **Eatvora** | Households focused on food-waste and grocery-spend reduction; iOS only as far as I could v | Hits BOTH of our priority columns at once and overlaps our differentiators almost exactly. On planning from expiring food: "AI generates recipes from | Two caveats. (1) Credibility: eatvora.app publishes its own "Best Food Inventory App in 2026" and "Best Pantry App in 2026" roundups that rank Eatvora | VERIFIED ACCURATE. App Store In-App Purchases block lists exactly: "Plus Yearly" $79.99, "Premium Yearly" $39.99, "Plus" $9.99, "Premium" $4 | https://www.eatvora.app/features/food-waste-reduction |
| **KitchenPal** | Expiry-anxious households; barcode scanners. | Matches our storage-location model exactly (pantry/fridge/freezer) and does expiry-driven suggestion: "Get recipe ideas using ingredients that are abo | "Track what gets wasted and why" is a waste log, not a measurement of whether a plan worked — nothing on the page connects the log back to a generated | ANALYST WRONG — price IS stated on the page, and the store contradicts it. Page hero: "Free for iOS and Android." Page FAQ: "Is the expiry d | https://kitchenpalapp.com/en/expiry-date-tracker.html |
| **NoWaste: Food Inventory List** | Consumers; published by MWM, an app portfolio company (per search results). | Established, cheap, and it does report outcomes. Same App Store page: 'Inventory lists for your freezer, fridge & pantry', 'Sort your food by expirati | Recipes are generated 'based on stock' — nothing on either page says expiring items are prioritised, so the expiry data and the recipe engine appear n | Confirmed exactly as stated. Apple's embedded In-App Purchases annotation reads textPairs: ["NoWaste Pro Lifetime","$29.99"],["NoWaste Pro A | https://apps.apple.com/us/app/nowaste-food-inventory-list/id926211004 |
| **OH, a potato!** | EU/euro-zone households (savings shown in €); couples sharing the cooking load. | The cleanest example of cook-then-measure I found — "A live dashboard that tracks your impact" and "See your savings in € and CO₂" are tied to meal CO | The page never mentions expiry dates, so the "what you already have" suggestion is stock-based rather than urgency-based; no nutrition or nutrient goa | No price appears anywhere on ohapotato.app (no /pricing/ page exists - https://ohapotato.app/pricing/ returns HTTP 404; /faq/ also 404s). Ap | https://ohapotato.app/features/ |
| **PantryWise: Food Waste Tracker** | Unknown — no install or review counts captured. | Explicit after-the-fact measurement. Same App Store page: 'Pantry, fridge & freezer inventory in one place', 'Food expiration tracker — get alerts bef | No nutrition at all ('Nutrition: Not mentioned in the app description'), and neither page says recipes are prioritised by EXPIRY specifically — the ma | App Store listing (https://apps.apple.com/us/app/pantrywise-pantry-manager/id6759767806): app price 'Free'; In-App Purchases section lists e | https://apps.apple.com/us/app/pantrywise-food-waste-tracker/id6759767806 |
| **Paprika Recipe Manager 3** | Power users who want a local/offline recipe database across iOS, Mac, Android and Windows. | This is the closest thing to our inventory module in the assigned rival set, and the only one on that list with per-item expiration dates plus a pantr | It stores dates but does nothing with them. I read the complete Pantry section of the iOS help and it describes only quantity/dates/stock status and a | The price IS published. Windows: "Buy Now $29.99" plus "$29.99 is the sale price in US dollars, actual pricing may vary depending on country | https://www.paprikaapp.com/help/ios/ |
| **Plan to Eat** | Recipe-hoarding home cooks who import from blogs and want one weekly shop. | The calendar-to-shopping-list pipeline is the most mature of anything I retrieved: "The meal planning calendar lets you plan ahead for any length of t | Its pantry analogue is deliberately dumb. Their own help page says "The Staples List is a static list where you can take inventory and store items you | "Only $5.95/mo or $49/year if you choose to subscribe." (https://www.plantoeat.com/, appears twice, verbatim - analyst correct). Incomplete | https://www.plantoeat.com/ |
| **Prepear** | Family meal planners coming from the Super Healthy Kids audience. | Clean manual meal-plan-to-list flow: "Create Your Own Custom Meal Plans" and "Add your favorite recipes to your Meal Plan in seconds" (same URL). | Thinnest of the direct rivals on everything we care about. The homepage contains no pantry, no expiry, no nutrition, no recommendation and no pricing | IS stated, contrary to the analyst. https://www.prepear.com/prepear-gold/ verbatim: "Start My 14-Day Free Trial of Prepear Gold Then, $9.99/ | https://www.prepear.com/ |
| **Samsung Food (formerly Whisk)** | Broad consumer base; Samsung appliance owners; grocery-delivery shoppers (listing cites 23 | Largest catalogue plus goal-linked nutrition of anything I retrieved: "Access detailed nutrition information and health scores on over 218,500 recipes | Pantry and expiry are marketing adjacency, not documented behaviour. The App Store description does not mention pantry or fridge inventory at all; sam | App Store listing 'In-App Purchases: Yes — Monthly $6.99, Yearly $59.99'; the app itself is free (JSON-LD offers price 0). The listing does | https://apps.apple.com/us/app/samsung-food-meal-planner/id1133637674 |
| **SideChef** | US Walmart shoppers; step-by-step guided-cooking users. | Shopping list terminates in an actual transaction — Walmart delivery/pickup with "update serving sizes, swap for your favorite brands, add or remove i | The page describes "Personalize Your Plan" and a "Personalized Meal Plan" but never says what the personalisation reads from or how it decides — that | SideChef Premium IS publicly priced, contrary to the analyst. https://www.sidechef.com/premium/ states verbatim: "Subscribe Now for Your 7-D | https://www.sidechef.com/ |
| **SuperCook** | Very large consumer base (search results cite an 11-million-recipe index); exact install c | The category-defining free pantry-to-recipe matcher, and it does expose a reason: the same page describes a 'missing one ingredient' filter that 'high | No expiry dimension at all — the pantry is a checklist of what you own, with no dates, so it structurally cannot plan from expiring stock or measure w | Confirmed. formattedPrice = "Free"; the App Store page contains no 'In-App Purchases' section and zero occurrences of the string 'In-App Pur | https://apps.apple.com/us/app/supercook-recipe-by-ingredient/id1477747816 |
| **Xpiry** | Unknown. | This is the clearest 'shows you why' evidence I found anywhere: the quoted line attaches an inventory-coverage figure to every individual suggestion, | The explanation is a COUNT ('how many of the ingredients you already have'), not an attribution — the page never says it names which specific expiring | The marketing page states no dollar figure - verbatim: 'Xpiry offers a free tier with 2 receipt scans per month, unlimited manual entry, dai | https://xpiry.cjinteractivellc.com/ |

## The four dead ones — and why a graveyard is evidence

Three products our first-pass analyst reported as live rivals are withdrawn. Finding them is not a footnote: a market that is *shedding* entrants tells us something a feature table cannot.

| Product | Status | Proof | What it tells us |
|---|---|---|---|
| **Mealime** | Discontinued 2026-10-21 | Vendor notice: "we regret to inform you that Mealime will be discontinued as of October 21, 2026" — https://www.mealime.com/closing | A 4.5M-user planner, acquired by Albertsons in 2021, is being folded into a retailer's app. Standalone meal planning is consolidating into grocery retail. |
| **Kitche** | Retired after acquisition | App Store id 1521215203 returns HTTP 404 in **both** GB and US storefronts; iTunes lookup returns `resultCount: 0`. Acquired by Remy, Feb 2025 (The Grocer, tech.eu). Its marketing site is still live and still says "DOWNLOAD THE FREE KITCHE APP TODAY!" | Kitche shipped the CO₂/money-saved-plus-rewards concept for seven years and did not sustain it standalone. Weak evidence *against* gamified waste-saving as a business. |
| **Fridgely** | Delisted | iOS id 988016972 delisted; the App Store links **on Fridgely's own site** 404; the two apps now called "Fridgely" are unrelated name collisions by different developers; the developer's site footer reads "© 2017 Jump Space LLC" | A zombie marketing site. Our first-pass analyst read it as a shipping rival — see D5. |
| **CozZo** | Discontinued | Recorded by the fact-checker | — |

> **Control test, so the 404s mean what we say they mean.** The same fetch method, in the same session, returned HTTP 200 and `resultCount: 1` for Eatvora, KitchenPal and SuperCook. The failures are specific to the dead products, not an artefact of being rate-limited.

## The feature matrix: what none of them do

Five columns, chosen because they are where our product could differ. Cells are filled only from retrieved page text.

| Product | Pantry | Expiry dates | Plans from expiring food | **Explains *why* it recommended** | Measures the outcome |
|---|---|---|---|---|---|
| AnyList | NO — upgraded from 'unknown' on evidence of exhaustive absen | NO — zero occurrences of 'expir' anywhere on https://www.any | NO — no inventory and no expiry exist, so nothing can plan f | unknown — the page is silent. AnyList does not appear to recommend recipes at al | NO / unknown — nothing on any retrieved page describes recording what |
| Eat This Much | YES, but Premium-only (analyst omitted the paywall). 'The pa | NO. No use-by or expiry date exists anywhere on the retrieve | NO, and now positively evidenced rather than assumed: 'We do | unknown — no page I retrieved (homepage, /pricing, or either pantry help article | PARTIAL / assumed, not confirmed — not 'unknown'. 'We remove ingredien |
| Eatvora | yes — App Store listing: "Tell Eatvora what's in your pantry | yes — feature page FAQ: "Eatvora reduces food waste through | yes — "AI generates recipes from exactly what is in your fri | unknown — analyst's "unknown" is CORRECT; zero explanation-of-recommendation tex | yes — "Tracks every dollar saved from reduced food waste with a real s |
| KitchenPal | yes — "KitchenPal tracks expiration dates across all storage | yes — "Track expiry dates for all food items across pantry, | yes — "Get recipe ideas using ingredients that are about to | unknown — analyst's "unknown" is CORRECT; no text explains why a given recipe is | yes — "Track what gets wasted and why. Identify patterns and adjust bu |
| NoWaste: Food Inventory List | yes — "Inventory lists for your freezer, fridge & pantry" (A | yes — "Sort your food by expiration date, name or category" | unknown — description says "see what food you need to use fi | unknown — no page text describes any reason or rationale shown alongside a recom | yes, but release-note evidence only — "A new "My numbers" widget on yo |
| OH, a potato! | yes - 'Scan what you have' and 'Get recipe ideas for what yo | yes - 'Real-time spoilage warnings and rescue options' (http | yes - 'Recipe suggestions: Based on what's at risk, what's s | unknown - no page text describes a per-suggestion rationale shown to the user. T | yes - 'Every cooked meal = tracked money and carbon savings' and 'A li |
| PantryWise: Food Waste Tracker | yes - 'Pantry, fridge & freezer inventory in one place' (App | yes - 'Food expiration tracker — get alerts before items go | unknown - the site describes a loop where '03 Stay ahead - B | unknown - nothing on either page describes a rationale shown per recipe. Closest | yes, but on WASTE not on cooking - 'a dashboard that breaks down your |
| Paprika Recipe Manager 3 | YES - 'Use the pantry to keep track of common ingredients yo | YES - 'For each pantry item you can record the quantity, pur | unknown - both the iOS and Mac user guides are silent on gen | unknown / not applicable - Paprika documents no recommendation engine anywhere. | WEAK/PARTIAL, better than 'unknown' - the guides document a manual out |
| Plan to Eat | PARTIAL, not 'yes'. A true pantry was built and removed: 'In | no / unknown - no expiration or use-by field documented anyw | unknown / no. Nothing is expiry-driven. The only documented | unknown - no recommendation engine is described at all; the user supplies their | unknown - no page text on cooked/not-cooked, leftovers-wasted, or feed |
| Prepear | unknown | unknown | unknown | unknown | unknown — nothing reports consumed vs wasted. Prepear does close the l |
| Samsung Food (formerly Whisk) | YES — and it is on the very page the analyst cited. Samsung | YES — 'Tap any item to edit details such as storage location | YES for recipe surfacing, Food+ only — 'Recipes that are con | PARTIAL — one quotable behaviour: 'Each recipe will show how well it matches you | YES, Food+ only — 'Updating Food List After Cooking. This is a premium |
| SideChef | unknown | unknown | unknown | unknown | unknown — nothing tracks what was actually eaten vs binned. The homepa |
| SuperCook | yes — "Visit the pantry page in the SuperCook app and choose | no — the pantry is an undated ingredient list; expiry appear | no — recipe matching keys off pantry membership only; "Super | unknown — CORRECTED from the analyst's 'yes'. The page describes a filter, never | unknown — the description has a '--Reduce food waste--' section but it |
| Xpiry | yes - 'Xpiry looks at what's in your pantry and suggests rec | yes - 'Xpiry estimates a shelf life for every item based on | partial - recipe SUGGESTIONS are expiry-ranked: 'It prioriti | partial - the page describes an ingredient-coverage figure attached to each sugg | unknown - nothing on the site or the App Store description mentions tr |

### Added by the fourth verification run (2026-09-13)

Three rivals the first verification pass had dropped, verified afterwards because they turned out
to be load-bearing. They are listed separately rather than spliced into the table above, so the
record shows *when* each was checked.

| Product | Status | Explains why? | Evidence | Adoption |
|---|---|---|---|---|
| **Cooklist** | ALIVE, v1.109.1 (2026-06-29) | **CLAIMED — vendor mockup** | Store screenshot 10, *"Expiration Reminders"*: *"Your parsley is 7 days old and may expire soon. Tap to see recipes you can cook with it."* **We opened the image: its status bar reads `Sketch` / `9:41 AM`, so it is marketing art, not a device capture** (screenshot 9 in the same listing *is* a real capture). Expresses age, not the date. Shows *what* it substituted but never *why*. Expiry dates are per-item and hand-correctable. | **11,297 iOS ratings, 4.73 avg** — a real incumbent |
| **Remy** | ALIVE, v5.1.0 (2026-09-03) | **PARTIAL** | Verified from the live web bundle's i18n table and render function, not marketing copy: `expiringBadge.label = "Using up before they expire:"`, rendered as `<ingredient> · <qty> <unit>` directly above the suggested recipe cards. Inventory audit loop exists (*"Are these still good?"* → Used All / Wasted All / Keep). No date in the rationale, no nutrient reason, substitutions shown but never justified. | 2 US / 15 GB ratings, 1K+ Play installs — **prior art, not an incumbent** |
| **Grocy** 4.7.1 | ALIVE, released 2026-09-04 | **PARTIAL** | Formula published in the changelog — *"1 point for each due soon ingredient … 10 points per overdue ingredient 20 points per expired ingredient"* — and confirmed verbatim in `migrations/0249.sql`. But the UI renders `due_score` as a bare integer plus a colour class, the ingredient carries no date and no tooltip, the API returns the aggregate undecomposed, and the recipe list is **not sorted by it** (`'order': [[1, 'asc']]`, alphabetical). No nutrient constraint anywhere. | 9,486 GitHub stars, ~87 contributors, MIT |

### A fifteenth rival, added later still

**Use It Up: Pantry Recipes** (US App Store id 6775112024, v1.0.8, updated 2026-07-28) surfaced in
the P20 adjudication *after* the fourteen-product table was built, and it is cited in
[`06`](06-disagreement-with-codex.md), [`12`](12-milestones.md) and
[`15`](15-codex-prompt-reruns.md) as wounding our differentiation. It belongs here too, so the
count is not wrong by one:

> *"Use It Up tracks what's about to expire and tells you what to cook tonight using the food that
> needs eating first."* — its own App Store description, re-fetched 2026-09-13.

**Materiality: 3 ratings.** A solo-developer app with essentially no user base. Cite it as prior
art demonstrating that the idea is being attempted, never as an incumbent — and note that the
claim is a *policy statement* ("tracks what's about to expire"), not a per-recommendation
rationale, so it does not reach the four-way conjunction either.

Our own red team had named Grocy the number-one threat to this claim. It turned out to be the
least dangerous of the three: it has the formula and does not show it. **Cooklist, which nobody
flagged, is the one that endangers the claim** — and the only way to settle it is to install the
app, which no one on this team has yet done for any rival.

The matrix has one empty column. **`explains_why_recommended` is `unknown` or `partial` for all
fourteen products in the table above** — a finding that the fourth run then overturned for a
fifteenth, Cooklist, which the cap had dropped. The strongest thing anyone ships is Samsung Food's match score —
*"Each recipe will show how well it matches"* — which is a number, not a reason. SuperCook's
apparent explanation was **corrected from `yes` to `unknown`** by the fact-checker: it is a
filter (`missing one ingredient`), not an explanation, and the text supporting it turned out to
be a 2022 changelog entry for an app that has not shipped an update in four years.

An empty column is a weak kind of evidence, so we went looking for a stronger kind. A separate
agent harvested **222 unique live US App Store listings** through the iTunes Search API across
eight query families and searched every description for explanation-of-recommendation language.
It found none. That method is recorded, reproducible, and it is the strongest negative evidence
in this report.

---

## The gap, with receipts

We wrote down four candidate gaps and then tried to kill each one. For each we listed five
findable items that would *confirm* it and the evidence that would *refute* it, then went and
looked for every item and marked it FOUND or NOT_FOUND. **Two of the four died.**

### G1 — Auditable recommendation rationale · **NARROWED TWICE** *(read the two amendments below before citing this)*

> No shipped consumer meal or pantry product shows a per-recommendation rationale that names the
> specific pantry item, its expiry date, the nutrient constraint and the substitution it made, in
> a form the user can audit and correct.

| Evidence sought | Result |
|---|---|
| A review begging for auditable substitution logic | ~~FOUND~~ → **WITHDRAWN, 2026-09-13.** The citation was misattributed and we have pulled it. See [Amendment 2](#amendment-2-same-day--the-citation-we-pulled-and-the-second-narrowing). |
| Systematic sweep of the live catalogue for explanation language | **FOUND (negative)** — 222 App Store listings, eight query families, zero hits |
| The market leader's best "explanation" | **FOUND** — Samsung Food's match *score*, not a reason |
| A dead product that shipped explanations and failed | **NOT_FOUND** — honest empty result |
| A competitor roadmap deferring explanations | **NOT_FOUND** — no public roadmaps retrieved |
| *Refuting:* an incumbent already doing it | **NOT_FOUND** |
| *Refuting:* academic prior art | **FOUND** — arXiv 2601.02374, explainable food recommendation |
| *Refuting:* evidence users do not want explanations | **NOT_FOUND** — and absence of counter-evidence is not evidence of demand |

**Verdict: a market gap, not a research novelty.** The idea is solved in the literature and
unshipped in the market. That is a defensible thing to say and a weaker thing than "nobody has
thought of this" — we say the weaker thing.

> #### Amendment, same day — G1 was too wide, and our own disconfirmation sprint proved it
>
> After this section was written, we ran [P17](15-codex-prompt-reruns.md#2-p17--disconfirmation-sprint),
> a prompt whose entire instruction is *assume our gap is false and go prove it*. It partly
> succeeded, and we record the refutation rather than burying it.
>
> **RecipeFix: Recipe Converter** (US App Store id 6759676502, v2.4.0, updated 2026-07-19) ships
> the explanation half today and markets directly against opaque AI:
>
> > "CHEF'S NOTES EXPLAIN EVERY CHANGE — No black-box AI. Every substitution comes with the
> > culinary reasoning behind it — why we picked that ingredient, how it affects the cooking
> > process, and what to watch for."
>
> It also takes correction in natural language ("Swap chicken for tofu", "I don't have olive
> oil") and handles a macronutrient constraint (keto/low-carb). That is **four of the six things
> our gap claimed nobody ships.** What it has no trace of — confirmed by fetching its own site —
> is any pantry inventory or expiry date.
>
> **G1 as first written is dead. The surviving claim is narrower and we state it in the narrow
> form:** explaining a recommendation *against inventory state and a date* is unshipped. "We
> explain our recommendations" is no longer ours to claim, and it does not go on the poster.
>
> This is the single most useful thing the Claude run produced, and it came from a prompt
> designed to make us lose.

> #### Amendment 2, same day — the citation we pulled, and the second narrowing
>
> A fourth verification run went back for the three rivals the verification cap had dropped that
> were actually load-bearing. Two things came out of it, and the first is a correction to
> ourselves.
>
> **We withdrew a citation.** The G1 table above originally cited a Cooklist customer review dated
> 2023-07-09 asking for "an option to choose how closely your pantry meets the recipe requirements
> instead of random broad matches". The fact-checker pulled **272 unique Cooklist reviews** from
> the iTunes review RSS (`itunes.apple.com/us/rss/customerreviews/id=1352600944`), spanning
> 2018-06-14 to 2026-08-05 and including **all 45 reviews from calendar 2023**. There is exactly
> one review dated 2023-07-09 — 4 stars, author `AngryNorsemen3`, titled *"Best app for food
> management"* — and it is about autofill miscategorising cream cheese jalapeño. Searching the
> whole 272-review corpus: `"how closely"` → 0 hits, `"recipe requirements"` → 0, `"broad match"`
> → 0. The sentence is not there. 272 of 11,297 ratings is a sample and cannot prove the sentence
> exists nowhere, but **the date we cited is covered and carries different text**, so the citation
> is withdrawn rather than re-dated. Worse for us: the feature that quote asked for already ships
> — *"You can set the level of substitution that you prefer"* (Cooklist review, 2024-09-08).
>
> **Cooklist wounds the narrow claim badly — and the evidence needs one caveat we found
> ourselves.** Its US App Store listing (11,297 ratings, 4.73 avg, v1.109.1) carries a screenshot
> headed *"Expiration Reminders / Get alerts when your food is about to expire"*, rendering a push
> notification:
>
> > "Your parsley is 7 days old and may expire soon. Tap to see recipes you can cook with it."
>
> That is the named pantry item, a date-derived fact, a reason and a recommendation in one
> sentence. **But we opened the image before citing it, and it is a Sketch mockup, not a device
> capture** — its status bar reads `Sketch` at `9:41 AM`, Apple's default mockup values — while
> other screenshots in the same listing (the receipt scanner, shot 9) are genuine captures with a
> real status bar and a real photographed receipt. By our own evidence rules, a vendor artifact
> proves *the claim was made*, not that the feature ships.
>
> Two further limits, stated so nobody over-reads this in either direction:
> 1. It expresses **age** ("7 days old"), not the expiry date. The date exists on the item record
>    and is hand-correctable, but it is not in the sentence.
> 2. It is a **notification keyed to one item**, not a rationale attached to a ranked
>    recommendation. Item → recipes, rather than recommendation → because.
>
> **Verdict: the narrow form of G1 is at serious risk and must not be asserted.** It is not
> proven dead, and it is certainly not safe. The one action that settles it costs an afternoon:
> **install Cooklist, trigger an expiration reminder, and screenshot the real behaviour.** Our own
> red team already made this point in general — nobody on this team has installed a single rival —
> and this is where it bites. Until someone does that, the honest poster sentence is the
> conjunction below, not "nobody explains".
>
> **Remy and Grocy wound it further.** Remy's chat prints *"Using up before they expire:
> &lt;ingredient&gt; · &lt;qty&gt;"* directly above the recipes it suggests — verified from the i18n
> table and render function in its live web bundle, not from marketing copy. Grocy publishes its
> due-score formula (*"1 point for each due soon ingredient … 10 points per overdue … 20 points
> per expired"*), confirmed verbatim in `migrations/0249.sql`. Neither states the date in the
> rationale; Grocy surfaces the score only as a bare integer plus a colour, and does not even sort
> by it (`'order': [[1, 'asc']]` — alphabetical by name).
>
> **What we are still entitled to claim, and nothing more:**
>
> > No shipped consumer meal product joins all four facts in one auditable, correctable
> > explanation: the **named pantry item**, its **actual expiry date**, the **nutrient constraint**
> > the dish satisfies, and the **reason for the substitution** it made. Cooklist shows what it
> > swapped but never why, and never argues from a nutrient target. RecipeFix argues about the
> > swap but holds no inventory and no dates. Remy has the inventory and the dates but states
> > neither the date nor a reason. Grocy has the formula but shows the user an integer.
>
> And the honest caveat the team must carry to the poster: **this is a conjunction gap, not a
> moat.** Remy already holds every input — dates, macros, swaps — and a chat surface to say it in.
> This is months of runway, not a defensible position, and claiming otherwise is the fastest way
> to lose the argument at the poster session.

### G2 — Closing the loop on waste outcomes · **DEAD**

Killed by five separate shipping products, each verified: FridgeBuddy (*"Waste tracker: see what
you eat vs. what you throw"*), SeePantry (*"dollars saved, items rescued, and CO₂ avoided —
calculated with EPA WARM data"*), Fango, Trepo, and Eat This Much's adherence reporting.

It is doubly dead, because the *measurement* is also out of budget. The closest published trial
([JMIR Formative Research, PMC9482070](https://pmc.ncbi.nlm.nih.gov/articles/PMC9482070/)) ran
six students for a month per app and found **no change in food waste**, concluding that
"large-scale studies with longer duration are needed". Four students with 160 hours cannot beat
that design. **No waste-reduction percentage goes on our poster.**

### G3 — Treating the pantry as uncertain · **NARROWED**

False as originally written. SeePantry states usage estimates with one-tap correction; Fango
presents shelf life as an adjustable AI estimate; Samsung Food confirms consumption after
cooking. What survives is one step downstream: **nobody propagates that uncertainty into the
recommendation.** Nothing ranks a plan by the probability its ingredients are still present, and
nothing asks a targeted verification question before committing a week of meals.

The confirming evidence here is the best in the whole survey, because it is a *vendor's own
retreat*:

> **Plan to Eat built a pantry inventory, removed it, and published the reason.**
> [learn.plantoeat.com/help/a-digital-pantry-inventory-does-it-really-help](https://learn.plantoeat.com/help/a-digital-pantry-inventory-does-it-really-help)
> — "In early versions of Plan to Eat we had a feature called the Pantry…". Its replacement, the
> Staples List, is explicitly static and does **not** deduct from the shopping list.

Supporting it: NoWaste reviewers describing exactly the decay ("it was tedious and I was too
frustrated to do it again"; "putting in inaccurate expiry…"), and Eat This Much *assuming*
consumption rather than confirming it ("We remove ingredients from your pantry after you're
supposed to have eaten them").

### G4 — Calorie/training target → this week's groceries · **DEAD**

Eat This Much ships the entire chain. Prospre ships per-training-day macro cycling. Cooklist
ships missing-ingredients-only lists. Building this would be re-implementing a $5/month commodity
with 160 hours and no differentiator.

---

## What we could not establish — and what we went back and closed

Three of the four limitations first recorded here have since been closed. The full account, with
the working routes so a teammate can reproduce them, is [`17-gap-closing.md`](17-gap-closing.md).

| First recorded as | Status now |
|---|---|
| **Reddit unreachable** — every `WebFetch` on reddit.com and old.reddit.com failed | **CLOSED.** The `.rss` search endpoint works with exponential backoff and *short* keyword queries. 851 entries indexed. Our original failure was three wrong choices, not a wall. |
| **`samsungfood.com/food-plus/` returns HTTP 403** — every Samsung claim rested on third parties | **CLOSED.** The Wayback capture `20260827152331` serves it. Food+ price resolved ($6.99/mo, $59.99/yr), and every Food+ feature that matters is first-party confirmed as *"Exclusively on mobile app"*. |
| **Verification capped at 18 of 48** | **CLOSED FOR THE RELEVANT SET.** 21 verified, then 9 more (Mealie, Tandoor, KitchenOwl, EverShelf, Nosh AI, ChefGPT, Pantry Check, MyFridgeFood, Jow). 10 more were deliberately skipped as irrelevant and named as skipped. ~7 remain unexamined. |
| **No user interviews** | **STILL OPEN.** Unchanged, and now more important than it was — see below. |

### The one that got worse when we looked

Reopening Reddit was supposed to replace a citation we had withdrawn. It did the opposite.

A regex sweep across **851 Reddit entries** for *"explain why"*, *"why it picked/chose/suggested"*,
*"no idea why"*, *"black box"*, *"arbitrary"*, *"justify"* and eight more variants returned
**zero hits in any meal, pantry or recipe context**. The withdrawn citation has **no replacement**.

> **Our gap has no demand-side evidence.** We can show that no product joins the four facts. We
> cannot show that anyone wants them joined. The absence is searched, not assumed, and it is
> reported here rather than left for a marker to notice.

Either the demand is latent — people cannot ask for an affordance no shipped product has taught
them to expect — or explainability is not a felt pain in this category. Desk research cannot
separate those, and only user research can. That makes it a Project 2 M0 task.

### Still true, and still limiting

- **No user interviews were performed.** Every claim about what users want is inferred from written
  complaints by people who chose to write them.
- **The paywall gap is our biggest single exposure.** EverShelf's recipe engine is Premium and was
  not purchased; Nosh AI's generation is partly Pro-gated; ChefGPT sits behind a sign-in. For the
  three closed products with the most plausible architecture we verified the marketing surface, not
  the running paid feature. If a reviewer presses on one product, it will be EverShelf.
- **No rival has been installed.** Not one, by anyone on this team. It is the cheapest remaining
  improvement to our evidence and it is an hour's work.
- **Complaint evidence remains a convenience sample.** More sources now, and better ones, but still
  not a frequency estimate.
