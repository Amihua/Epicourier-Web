# P01 — Market survey, direct-rivals angle (Gemini column)

**Model:** Gemini, run in the Gemini web app · **Run date:** 2026-09-13 · **Analyst:** Wenbo (wli56)

The prompt is the `## Prompt, exactly as issued` block of the Claude column's
`sweep-direct-planners.md`, pasted unedited from
[`../../prompts/gemini/P01-ready-to-paste.txt`](../../prompts/gemini/P01-ready-to-paste.txt).

**Why the web app rather than the CLI.** The Antigravity CLI's native `search_web` tool was returning
`503 MODEL_CAPACITY_EXHAUSTED` from its `gemini-3.5-flash-lite` backend — reproduced across five
different models, so the fault is the tool's, not the analyst's — and the CLI account then hit its
individual quota, with a reset roughly a week out. The full failure record is
[`01-market-survey-failed-headless-attempt.md`](01-market-survey-failed-headless-attempt.md). The web
app has its own search grounding and answered.

A first web-app session had no browsing tools at all and correctly refused to invent anything,
marking all sixty feature cells `unknown`; that attempt and what it still got wrong are recorded at
[`../../evidence/gemini/runs/2026-09-13-P01-webapp-attempt.md`](../../evidence/gemini/runs/2026-09-13-P01-webapp-attempt.md).
The survey below is the second session, which had search.

---

## Verification notes — read before citing any row

Three claims in this output were checked after the fact and do not stand as written. They are listed
here rather than silently corrected, because what the model produced is the record.

**1. The PlateJoy row is void. The product is gone.** The survey lists PlateJoy as a live rival priced
at "$12.99/month or $99/year". Checked independently on 2026-09-13:

```
nslookup www.platejoy.com   →  ** server can't find www.platejoy.com: NXDOMAIN
nslookup platejoy.com       →  *** Can't find platejoy.com: No answer
curl -L https://www.platejoy.com/  →  HTTP 000 (no connection)
```

The domain registration is abandoned. The model's evidence for both PlateJoy feature cells comes from
`https://www.frugalforless.com/platejoy-review/`, a third-party review blog that is reachable (HTTP
200) and describes the product in the present tense. The product page itself was never retrieved.
**Do not cite the PlateJoy row.** A dead product entered a rival table because a live third-party page
was accepted in place of a live product page.

**2. The Samsung Food+ quotations are unconfirmed.** Two quotes are attributed to
`https://samsungfood.com/food-plus/`. That URL returns **HTTP 403** to a normal browser user-agent
from this machine, as it did to every agent in the Claude column's run. The quoted text may have come
from a search snippet or cache rather than from the page. Until the model is asked to state which,
treat these two cells as unverified. The other Samsung URL it cites,
`https://www.samsung.com/ca/refrigerators/family-hub/`, is genuinely reachable (HTTP 200) and its
quote may be used.

**3. Two rows rest on sources that are not the product.**

| Row | Source cited | Problem |
|---|---|---|
| AnyList, "no pantry tracker" | `pare.recipes/compare/anylist` | A competitor-comparison site. A negative capability claim about a product, sourced to a rival's marketing comparison. |
| Prepear, pantry inventory | An App Store **user review**: *"A list of what's in my pantry… what! what! ... Really easy to use."* | A review is not a feature description. It evidences that a user believes the feature exists, not that it does. |

Both URLs resolve, so these are sourcing-quality downgrades rather than fabrications, but neither
should be printed as vendor-confirmed.

## What this run establishes for the two-model rule

The rule is *named by two of our LLMs, **or** one gives a live URL*. This session had no access to the
repository or to any other column's output, so the products it names are named independently.

| Rival | Status before | Status now |
|---|---|---|
| **Plan to Eat** | live URL only (Claude) | **two models** |
| **AnyList** | live URL only (Claude) | **two models** |
| **Prepear** | live URL only (Claude) | **two models** |
| Mealime — discontinuing 2026-10-21 | one model's reading of the notice | **two models**, independently |

Not upgraded, and still resting on a single model: **Cooklist, Eatvora, KitchenPal, Remy, Grocy,
NoWaste, PantryWise, Xpiry, "OH, a potato!", MyFitnessPal Premium+.** This session verified the ten
candidates the prompt supplied and did not go looking beyond them, so it adds nothing to the rivals
the Claude column found on its own.

---

# Market Analysis Report: Direct Rivals for Epicourier-Web

**Prepared by:** Graduate Market Analyst · **Date:** September 13, 2026
**Context:** Direct-rival analysis for Epicourier-Web (Next.js 15, FastAPI, Supabase, Gemini 2.5 Flash).
**Budget constraint:** 4 graduate students, 1 month, ~160 total person-hours for development and testing.

## 1. Executive summary

The core job of Epicourier-Web and its direct competitors is "plan meals, get a grocery list". Among
the direct rivals analysed — Mealime, Plan to Eat, Eat This Much, SideChef, Samsung Food, Paprika
Recipe Manager, Prepear, AnyList, PlateJoy — behaviour differs most around kitchen inventory, AI
features, and shopping automation.

**The closed-loop gap is almost universal.** Shopping lists operate as one-way syncs
(plan → list → online grocer). Almost no platform automatically executes a "purchased" transfer that
moves checked items into a structured pantry. Plan to Eat explicitly abandoned automated pantry
inventory because discrepancies between real kitchens and the app angered users. AnyList relies on
manual list management. Samsung Food supports a pantry list via smart-fridge syncing but offers no
simple tap-to-transfer loop.

**The "explains why recommended" gap.** SideChef, Eat This Much and Samsung Food all offer
algorithmic or AI recommendation, and none of them explain the reasoning or the trade-off to the user
— for example "recommended because your spinach expires in 1 day and you need 25g more protein
today". Generation is presented as a black box.

**Scope recommendations under 160 person-hours.** Double down on explanation: it needs little extra
engineering, since a rationale field can be added to the existing Gemini JSON response. Keep the
closed loop explicit rather than automatic — a modal "transfer checked items to pantry?" — because
automated syncing is a known failure mode in commercial apps.

## 2. Competitive analysis matrix

All product details, pricing and feature claims are as the model reported them on 2026-09-13. Read
the verification notes above before citing the PlateJoy, Samsung Food, AnyList or Prepear rows.

| Product | Live URL retrieved | Pantry inventory | Expiry tracking | Plans from expiring food | Nutrient goals | Shopping list | Explains why recommended | Closes the loop | Price and notes (2026-09-13) |
|---|---|---|---|---|---|---|---|---|---|
| Mealime | Yes | unknown | unknown | unknown | Yes | Yes | unknown | unknown | Free basic; Pro $2.99/month. **Announced shutdown 2026-10-21.** |
| Plan to Eat | Yes | Yes, via Staples workaround | unknown | unknown | unknown | Yes | unknown | No | $5.95/month or $39/year; 14-day trial |
| Eat This Much | Yes | Yes | unknown | unknown | Yes | Yes | unknown | unknown | Free daily planner; Premium $5/mo billed annually, or $14.99/mo |
| SideChef | Yes | unknown | unknown | unknown | unknown | Yes | unknown | unknown | Free to download; premium options |
| Samsung Food | Yes | Yes | Yes | Yes | Yes | Yes | unknown | unknown | Free basic; Food+ $6.99/month or $59.99/year |
| Paprika Recipe Manager | Yes | Yes | Yes | unknown | unknown | Yes | unknown | **Yes** | $4.99 mobile; $19.99 desktop, one-time per platform |
| Prepear | Yes | Yes | unknown | unknown | unknown | Yes | unknown | unknown | Free version; Gold $119.99/year |
| AnyList | Yes | No, manual custom list only | unknown | unknown | unknown | Yes | unknown | unknown | Free basic; Complete $9.99/year individual, $14.99/year family |
| ~~PlateJoy~~ | ~~Yes~~ | — | — | — | — | — | — | — | **VOID — domain returns NXDOMAIN; see verification note 1** |

## 3. Quoted feature evidence

**Mealime** — shopping list: *"When you choose recipes for the week, all of the ingredient you'll need
are combined into a convenient grocery list."* · nutrient goals: *"Mealime Pro includes the following
additional features: ... View nutritional information (calories, macros, micros)"* ·
`https://play.google.com/store/apps/details?id=com.mealime`

**Plan to Eat** — no automated pantry: *"Your shopping list will populate every item in your planned
recipes (see above: no pantry feature). We encourage you to 'shop' in your kitchen and tap off items
you already have..."* · `https://www.plantoeat.com/blog/2024/01/plan-to-eat-hacks-the-shopping-list/`
· shopping list: *"The Mini Planner in your Shopping List allows you to adjust your meal plan while
looking at your Shopping List."* · `https://learn.plantoeat.com/help/the-mini-planner`

**Eat This Much** — pantry: *"Reduce food waste with pantry tracking."* · nutrient goals: *"Generate
meal plans that meet your calorie and macro targets in seconds."* · shopping list: *"Grocery lists are
automatically created from your meal plans."* ·
`https://play.google.com/store/apps/details?id=com.eatthismuch`

**SideChef** — shopping list: *"Easily create a grocery list, and shop ingredients directly from
Instacart, Walmart, Amazon Fresh, Target, and more online grocers."* ·
`https://apps.apple.com/id/app/sidechef-recipes-meal-planner/id905229928`

**Samsung Food** — pantry and expiry: *"Samsung Food lets you create a list of the food in your
refrigerator and manage expiry dates, so you have what you need when you need it"* ·
`https://www.samsung.com/ca/refrigerators/family-hub/` **(reachable, HTTP 200 — usable)**
· plans from expiring food: *"This search mode finds recipes using ingredients you have, prioritizing
soon-to-expire items from your Food List to reduce waste."* · nutrient goals: *"Monitor macros,
micronutrients, and calories. Schedule your go-to meals each week, and effortlessly adapt meal plans
to stay on track."* · both attributed to `https://samsungfood.com/food-plus/` **(HTTP 403 — see
verification note 2)**

**Paprika Recipe Manager** — pantry and expiry: *"Add custom ingredients to the pantry. Track
quantities, purchase dates, and expiration dates."* · closes the loop: *"Move items back and forth
between the pantry and grocery list."* ·
`https://apps.apple.com/us/app/paprika-recipe-manager-3/id1303222628`

**Prepear** — shopping list: *"Prepear automatically creates your grocery list for you. Customize it
and add those other things you need..."* · `https://www.prepear.com/` · pantry claim rests on an App
Store user review — see verification note 3

**AnyList** — shopping list from meal plan: *"Creating a grocery list from your meal plan has never
been easier. Just select a date range and AnyList will automatically show you all of the required
ingredients."* · `https://www.anylist.com/meal-planning` · the "no pantry" claim rests on a
competitor-comparison site — see verification note 3

## 4. Strategic analysis

The domain splits into two paradigms. **Organiser tools** — Paprika, AnyList, Plan to Eat — give
excellent organisation and sync but require the user to import recipes and make every decision.
**Generator tools** — Eat This Much, Samsung Food, Mealime — plan automatically from macro targets or
dietary profiles, and operate as black boxes that never explain the generation logic.

**Where Epicourier-Web could win.** None of the rivals show rationale text. With Gemini already
integrated, requiring a reasoning string in the model's structured output costs little and separates
the product from every app above. On the closed loop, only Paprika documents explicit movement of
items between grocery list and pantry, and Plan to Eat publicly warned against automated pantry
syncing because it breaks down in real kitchens — so an explicit, user-confirmed transfer is both the
gap and the safer build.

**Budget strategy.** Do not build automated background syncing, and do not auto-subtract pantry items
on meal completion; the edge cases will consume the month. Keep the purchased-transfer flow manual and
explicit: an endpoint that takes checked shopping items and upserts them into the inventory table.
Put the Gemini rationale in a structured response field and render it as a "why this was suggested"
badge.

**One caution on the effort estimates in this section.** The model attached hour figures to both
recommendations. Nothing in the session measured anything, and it was not given the codebase, so
those numbers are assertions, not estimates. They are omitted here rather than reprinted as findings.
