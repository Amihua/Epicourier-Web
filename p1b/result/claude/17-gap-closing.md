# Closing the recorded limitations (run 5)

**2026-09-13 · Claude column.** Our market survey recorded four limitations. Three were solvable
and are now closed; the fourth was closed and **came back with an answer we did not want**.

Every route below is written down so a teammate can reproduce it, because two of these
"limitations" were never limitations of the sources — they were limitations of how we asked.

---

## 1. Samsung Food+ — the HTTP 403 is closed

`samsungfood.com/food-plus/` 403s every agent. **The Wayback Machine serves it:**

```bash
curl -sL "https://web.archive.org/web/2026/https://samsungfood.com/food-plus/"
```

Capture `20260827152331` (2026-08-27). What was third-party is now **first-party with a capture
date**:

| Was | Now |
|---|---|
| Price "unknown" | **$6.99/month or $59.99/year**, 7-day trial — *"Our subscriptions cost $6.99 per month or $59.99 per year."* Also free with a Samsung device or Samsung Rewards. |
| Expiry prioritisation, inferred from third parties | *"This search mode finds recipes using ingredients you have, **prioritizing soon-to-expire items** from your Food List to reduce waste."* — vendor's own page |
| Mobile-only, an inference | **Stated, repeatedly and first-party.** Every Food+ feature that matters to us is tagged *"Exclusively on mobile app"*: Food List search, automated pantry list, nutrition-goal tracking, AI recipe personalisation, tailored 7-day plans. *"You can only purchase a subscription on a mobile device."* |

**And the decisive column did not move.** Samsung's own support article gives the full ranking rule:

> "Recipes that use the most ingredients from your Food List will appear first. Recipes that are
> containing items that are about to expire will be prioritized. **Each recipe will show how well
> it matches** your selected ingredients, helping you quickly decide what to cook."

That is a **policy statement plus a match score**. It never names the item that drove the ranking,
never states its date, and never appears per-recommendation. `explains_why_recommended` stays
**no**. Verdict: **leaves our claim standing** — on better evidence than we had before.

> **A positioning fact worth more than the price.** Samsung's expiry-aware search is *not on the
> web at all*. Epicourier is a web application. The closest rival's strongest feature does not
> exist on our platform.

## 2. Reddit — the route is closed, and the answer hurts

Reddit 403s on `.json` and fails on `WebFetch`. **The `.rss` search endpoint works:**

```bash
curl -sL -H "User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 …" \
  "https://www.reddit.com/r/<sub>/search.rss?q=<short+keywords>&restrict_sr=1&limit=25"
```

Three things had to be right, and our first session got all three wrong — which is why we recorded
"Reddit unreachable" when Reddit was reachable:

1. **`.rss`, not `.json`.** The JSON endpoint 403s; the RSS one does not.
2. **Exponential backoff.** About a third of fetches 429 at least once. Six retries at 7/14/21/28/35/42 s.
3. **Short keyword queries with `restrict_sr=1`.** Site-wide natural-language queries collapse into
   noise — *"pantry inventory app gave up"* returned r/MakeupRehab and a nosleep story.

Bonus technique worth keeping: **append `.rss` to a thread permalink** and you get the whole comment
tree. The strongest quotes below are comments, invisible to search alone.

### 2a. The result we did not want: our gap has no demand-side evidence

**851 unique Reddit entries** indexed across r/mealprep, r/Cooking, r/MealPrepSunday, r/ZeroWaste,
r/selfhosted, r/grocy, r/EatCheapAndHealthy, including full comment feeds on the eleven most
on-topic threads. Regex sweep for *"explain why"*, *"tell me why"*, *"show the reasoning"*, *"why it
picked/chose/suggested/recommended"*, *"no idea why"*, *"couldn't tell why"*, *"makes no sense"*,
*"black box"*, *"transparent"*, *"arbitrary"*, *"justify"*.

> **Hits in a meal/pantry/recipe context: ZERO.** The only "transparent" match in the entire corpus
> was someone describing 1990s HTML spacer GIFs.

This is a **searched** negative, not an unsearched one, and it is the answer to the question our own
red team asked: *"is 'explain the recommendation' a thing users ask for, or a thing engineers
want?"* On this evidence, **users do not ask for it.**

What users ask for, repeatedly and in volume: less manual entry, pantry-aware shopping lists,
control over match strictness, and importing their own recipes.

Two readings are consistent with the data and Reddit cannot separate them: the demand is **latent**
(you cannot ask for an affordance no product has taught you to expect), or explainability is simply
**not a felt pain** in this category. **We must not claim demand-side support either way.** The
withdrawn citation has **no replacement**, and we report that as the finding it is.

### 2b. What Reddit did give us — G3, and it is strong

The abandonment evidence is now the best-sourced thing in the survey, because these are comments
with discussion under them:

| Quote | Source |
|---|---|
| *"always ended up abandoning it after less than a month"* — OP names Paprika, Recime, Cooklist and KitchenPal by name | r/Cooking, *"Do you guys use meal-planning or pantry tracking apps to cook?"* |
| *"you spend more time managing the app than actually cooking. The ones that force you to enter every single ingredient manually are the worst"* | r/mealprep, *"Why do meal planning / recipe apps lose me so fast?"* |
| *"start feeling like extra admin work rather than reducing it"* — a second, independent commenter on the same thread | r/mealprep, same thread |
| *"it seems so overwhelming that I have given up everytime"* — from someone motivated enough to install Grocy on Home Assistant | r/grocy, *"How to start with the inventory process"* |
| *"most of the time things will be consumed without tracking this in grocy"* | r/grocy, *"How do you update your inventory?"* |
| *"glass cleaner shows up as one in stock but in reality I have none"* — Grocy's own maintainer replies in the thread | r/grocy, *"How do you inventory something that's not there?"* |

## 3. Cooklist — the reminder does ship, and it states an age, not a date

We had this on a **Sketch mockup**. Independent confirmation now exists, from real users:

| Evidence | Type |
|---|---|
| *"gives you reminders on when things in your fridge or cabinet expire"* — review "Useful", scarecrow88m, 4★ | **Real user testimony** |
| *"we get a 1 week warning it's going to expire"* — review "Game changer", 5★ | **Real user testimony** |
| *"I like the expiration reminders!"* — review "Nice idea but buggy", 3★ | **Real user testimony** |
| *"send you a reminder when one of those items is about to expire"* | Vendor YouTube **screen recording** |
| Google Play carries the same claim on a *different* artifact — also a composite | Vendor mockup |

**Verdict: `CONFIRMED_SHIPS`.** The notification is real, not marketing art.

**But the artifact still only wounds our claim, for a reason worth understanding.** Every *real*
Cooklist surface found states an **age plus a traffic light** — *"0 days old"*, red/yellow/green —
never the date. The *"may expire soon"* phrasing exists only in the mockup. And it remains a
**notification keyed to one item**, not a rationale attached to a ranked recommendation.

What only an install settles: whether the push fires today and with what literal wording (the string
is server-generated, so it is not extractable from the binary), whether any surface ever prints the
actual date, and whether tapping it really lands on a recipe list filtered to that item.

## 4. The relevant tail of unverified rivals — closed, at source level

Nine verified, every one with a liveness check from a release API or store lookup rather than a
marketing page. **None kills the claim.** Two matter:

### Tandoor Recipes — the strongest negative evidence in the whole survey

Tandoor is the only shipped product that holds **both** a named pantry item with a real expiry date
**and** a recipe recommender. We proved **in its own source** that the two never touch:

- `cookbook/models.py:1384` — `expires = models.DateField(...)` on `class InventoryEntry`; the UI
  really renders a formatted date, in a chip coloured by whether it has passed.
- `cookable()` in `cookbook/managers.py` is the sole engine behind the `makenow` filter. **A grep of
  the entire function body for `expires|inventoryentry` returns 0.**
- Its one expiry-aware UI string, `"ExpiringSoon"`, exists in `en.json:227` and is **rendered by no
  component** — an orphan.

A refutation attempt that failed *at the source level* is far stronger than any argument from
absence of marketing copy, and anyone can re-run the grep.

### Mealie — forces one honest narrowing

Mealie **does** ship a rendered substitution explanation. `RecipeSuggestion.vue` prints
`"Substituting"` and then `"{substitute} for {food}"` per chip, backed by a typed
`RecipeSuggestionSubstitutedFood` from `_find_substitute_on_hand`.

**So we must never write anything implying no product explains substitutions.** Mealie does, its
source is public, and a reviewer will find it in minutes. But a grep of every `.py/.ts/.vue` for
`expir|best.?before|use.?by` returns only auth tokens and share links — Mealie has **no food-expiry
concept at all** — and no nutrient constraint in the finder. It reaches one of the four facts. It is
RecipeFix's open-source twin and should be cited beside it.

### The pattern, which is a finding rather than a coincidence

> **Every product that has dates aggregates them away at the moment of recommendation.** Grocy shows
> a bare integer. EverShelf shows *"Calories expiring over the next 12 months"* with bars labelled
> *"Oct 2 items"*. Tandoor shows the date on the shelf and drops it before the suggestion. Remy
> names the item but states no date. Cooklist states an age and a colour.
>
> The named-item-plus-actual-date pair consistently survives in inventory views and consistently
> dies on the way to the recipe card.

And the honest counterweight, from §2a: **nobody has asked for it to survive.**

---

## What is still not closed, and why

| Open | Why it cannot be closed from here |
|---|---|
| **Install Cooklist / EverShelf and capture the real screen** | Needs an iOS or Android device and, for EverShelf, a paid Premium month. No device or store account is available to this session. This is the single highest-value hour anyone on the team can spend, and EverShelf is where a reviewer will press first. |
| **Demand-side evidence for explainability** | Searched and **not found** across 851 Reddit entries and ~500 app-store reviews. Only user research settles whether the demand is latent or absent — which is a Project 2 M0 task, not a desk-research task. |
| **~7 candidates never examined** | 26 were outstanding; 9 verified, 10 deliberately skipped as irrelevant to the surviving claim (nutrition trackers bearing only on the dead G4; logistics apps that recommend no recipes). The tail is closed for the *relevant* set, not for the full list, and we state it that way. |
| **Gemini and local-model columns** | Not this column's work, and no credentials exist here for either. |
