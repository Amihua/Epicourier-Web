# P19-nutrition-safety-rerun

**Workflow:** P1b Claude decide and commit (run 3)  
**Phase:** Classify  
**Model:** Claude Opus 5 (1M context), `claude-opus-5[1m]`  
**Agent id:** `a8a47010e4c786d5b`  
**Tool calls:** 54 total — 3 web searches, 21 pages fetched  
**Raw transcript:** `raw/agent-a8a47010e4c786d5b.jsonl` (full tool-call trace, retained)

---

## Prompt, exactly as issued

```text
You are a sports-nutrition product analyst and safety red team (P19, written by the Codex
analyst on our team, rerun independently here).

RULES: Do not invent products or sources. Use WebSearch/WebFetch for any market claim (load with
ToolSearch "select:WebSearch,WebFetch" if absent). Quote real page text. Write "unknown" rather
than something plausible. Separate fact, inference and hypothesis. Respect the 160-hour budget in
every recommendation.

Compare how rivals calculate or display: baseline energy | weight-goal deficit | logged exercise
| wearable activity | negative adjustment | macro changes | workout-day templates |
double-count prevention | minimum-calorie guard | meal/recipe/list output.

Require FIRST-PARTY sources for any formula or setting. Mark UNKNOWN when the calculation is
opaque — most are. Identify discrepancies between device-reported calories and planner calories.
Do NOT give medical advice and do NOT prescribe a deficit.

Our own survey already recorded this gap as DEAD (Eat This Much does target -> plan -> grocery
list; Prospre does per-training-day macro cycling; Cooklist does missing-ingredients-only lists).
Your job is to check that verdict independently and to establish the SAFETY boundary regardless
of the verdict, because our product already ships a free-text goal that reaches an LLM unbounded.

Then answer two questions:
1. Is the DEAD verdict correct? Say so plainly either way, with sources.
2. What are the hard safety rules any nutrition-adjacent recommendation in our product must
   follow — minimum-calorie floors, refusal conditions, disclaimer placement, what the system
   must never compute itself? Give them as testable rules, each with the test that checks it.

Include one rule our team has not thought about: our product currently recommends cooking
ingredients it has itself labelled EXPIRED. Treat that as a safety requirement and write the
rule and the test.
```

## Searches actually run

- `Eat This Much calorie target exercise adjustment help documentation`
- `MyFitnessPal "negative calorie adjustment" support article exercise calories`
- `Prospre "training days" macros rest day meal planner help`

## Pages actually fetched

- https://www.eatthismuch.com/calculator   — asked: Quote verbatim any text describing: how the calorie target is computed (BMR/TDEE formula name, e.g. Mifflin-St
- https://support.myfitnesspal.com/hc/en-us/articles/360032623871-Understanding-your-Calorie-Adjustment   — asked: Quote verbatim: how the calorie adjustment is computed from a connected device, what formula or comparison is 
- https://www.prospre.io/   — asked: Quote verbatim any text about: calorie/macro target calculation, training day vs rest day macro cycling, exerc
- https://macrofactorapp.com/expenditure/   — asked: Quote verbatim any text about: how energy expenditure is calculated, whether fitness trackers / wearables / sm
- https://www.prospre.io/macro-calculator   — asked: Quote verbatim: the formula or method used to calculate calories and macros, activity level options, weight-go
- https://macrofactor.com/expenditure/   — asked: Quote verbatim any text about: how energy expenditure is calculated, whether fitness trackers / wearables / sm
- https://help.eatthismuch.com/help/how-does-the-pantry-system-work   — asked: Quote verbatim the full text of this article, especially anything about pantry items, expiration or use-by dat
- https://support.cronometer.com/hc/en-us/articles/360019353111-Exercise-Calories-and-Energy-Burned   — asked: Quote verbatim: how exercise calories affect the calorie budget, any setting for adding exercise calories back
- https://www.strongrfastr.com/   — asked: Quote verbatim any text about: meal plans built around a workout schedule, different macros on training vs res
- https://www.strongrfastr.com/meal-planner   — asked: Quote verbatim any text about: how calorie and macro targets are set, whether macros differ on workout days vs
- https://help.prospre.io/   — asked: List the help article titles available. Quote verbatim anything about macro targets, training days, rest days,
- https://www.prospre.io/meal-plan-generator   — asked: Quote verbatim any text about: setting different macros for different days of the week, macro cycling, trainin
- https://www.nhs.uk/live-well/healthy-weight/managing-your-weight/very-low-calorie-diets/   — asked: Quote verbatim: the definition of a very low calorie diet including any kcal threshold number, any statement a
- https://www.fsis.usda.gov/food-safety/safe-food-handling-and-preparation/food-safety-basics/food-product-dating   — asked: Quote verbatim: what "Best if Used By", "Use By", "Sell By" and "Freeze By" dates mean, whether these dates ar
- https://www.nhs.uk/conditions/obesity/treatment/   — asked: Quote verbatim any text containing a calorie number, especially about very low calorie diets, 800 calories, me
- https://www.fda.gov/consumers/consumer-updates/how-cut-food-waste-and-maintain-food-safety   — asked: Quote verbatim: what date labels on packaged food mean, whether they are safety dates, which product has a use
- https://www.food.gov.uk/safety-hygiene/use-by-and-best-before-dates   — asked: Quote verbatim: the difference between "use by" and "best before" dates, which one is about safety, what happe
- https://cooklist.com/cooklist-app   — asked: Quote verbatim any text about: pantry inventory, expiration date calculation and notifications, recipes using 
- https://www.food.gov.uk/safety-hygiene/best-before-and-use-by-dates   — asked: Quote verbatim: the difference between "use by" and "best before" dates, which is about safety and which about
- https://www.gov.uk/understanding-food-labelling   — asked: Quote verbatim: the difference between "use by" and "best before" dates, which is about safety and which about
- https://www.gov.uk/understanding-food-labelling/best-before-and-use-by-dates   — asked: Quote verbatim: the difference between "use by" and "best before" dates, which is about safety and which about

## Response

# P19 Independent Re-run — Training/Deficit-to-Groceries Gap + Nutrition Safety Boundary

Rerun date 2026-09-13. Prior verdict under test: **DEAD** (Codex analyst, `p1b/result/claude/01-market-survey.md:143`, `p1b/evidence/claude/runs/gap-interrogate.md:569-583`).

---

## 1. Verdict: the DEAD verdict is CORRECT

**Plainly: yes, P19 is dead. I confirm it independently, and I found it to be *more* dead than the team argued — but on a different axis than the team checked, and one of the team's three supporting claims is overstated.**

### 1a. What I confirmed first-party

**Eat This Much covers baseline energy → deficit → macros → plan → grocery list → pantry discount, with published formulas.** From `https://www.eatthismuch.com/calculator` (retrieved 2026-09-13):

> "We use the **Mifflin-St Jeor equation**" — Male: "BMR = 10W + 6.25H - 5A + 5"; Female: "BMR = 10W + 6.25H - 5A - 161"

> Sedentary "BMR × 1.2" · Lightly Active "BMR × 1.375" · Moderately Active "BMR × 1.55" · Very Athletic "BMR × 1.725" · Extremely Athletic "BMR × 1.9"

> "A one-pound-per-week setting, for example, starts with an adjustment of about 500 Calories per day."

And the pantry-discount half, from `https://help.eatthismuch.com/help/how-does-the-pantry-system-work` (Last updated 05 May, 2026):

> "the amounts reflect how much you already have on hand in the pantry. This way, you're not buying more of what you already have."

**Prospre covers three BMR formulas, deficit, weekday macro variation, plan, grocery list.** From `https://www.prospre.io/macro-calculator`: Harris-Benedict (revised 1984) "BMR = 13.397m + 4.799h - 5.677a + 88.362"; Mifflin-St. Jeor "BMR = 9.99m + 6.25h - 4.92a + c"; Katch-McArdle "BMR = 21.6m x (1 - BF% / 100) + 370"; "To calculate TDEE, BMR is multiplied by a Physical Activity Factor"; "A 500 calorie difference will result in roughly 1lb (0.45kg) per week weight change". From `https://www.prospre.io/meal-plan-generator`: "With our app, you can set different macros for each day of the week to do whatever macro cycling goals you have." From `https://www.prospre.io/`: "Get a grocery list with everything you need to follow your meal plan. Auto-fill your cart Amazon Fresh".

**Cooklist covers missing-ingredients-only lists.** From `https://cooklist.com/cooklist-app` (retrieved independently, 2026-09-13): "Since Cooklist already knows the ingredients you have at home it only adds the items that you are missing to your shopping list." Also "Cooklist automatically calculates expiration dates and notifies you before they expire."

All three legs of the team's DEAD verdict reproduce.

### 1b. Where I disagree with the team's reasoning (correction, not reversal)

**INFERENCE.** The team wrote that "Prospre ships per-training-day macro cycling" and used it to kill the "but ours links a TRAINING calendar" rescue. Prospre's own quote does not say that. "set different macros for each day of the week" is a **manual weekday assignment**, not a training-calendar-driven or workout-log-driven adjustment. No Prospre page I retrieved mentions exercise logging, a workout schedule, or a wearable. The team's claim is stronger than its own source. Anyone re-reading `gap-interrogate.md:569` should not repeat the phrase "per-training-day."

### 1c. Why the gap is nonetheless deader than argued — the axis nobody checked

The four P19 axes that Eat This Much and Prospre genuinely do **not** cover are *logged exercise*, *wearable activity*, *negative adjustment*, and *double-count prevention*. That looks like a live sliver. It is not, for a reason the team's evidence never reached:

**The most technically credible rival in this market has publicly and deliberately refused to build it.** From `https://macrofactor.com/expenditure/` (retrieved 2026-09-13):

> "Even if you have a smartwatch, you have a device that's quite good at measuring step counts, and quite bad at estimating energy expenditure. When given the option, we lean in favor of using more accurate data sources."

> "step counts won't be used to additively increase or decrease your calorie targets on individual days. Rather, step data will be incorporated into MacroFactor's algorithms in a manner similar to the data you're already logging (weight and nutrition data), meaning it will smoothly and progressively increase or decrease your estimated expenditure and calorie targets over time."

And where the feature *does* exist — MyFitnessPal's calorie adjustments — the vendor ships it **off by default** and maintains a dedicated article titled *"Should I turn on Negative Calorie Adjustments?"* to talk users through the harm. (**UNVERIFIED BODY:** `support.myfitnesspal.com/hc/en-us/articles/360032272152` and `.../360032623871` returned **HTTP 403** to WebFetch *and* to curl with a browser user-agent on 2026-09-13. Article titles and URLs are confirmed from the search index; I have no verbatim first-party text and am not quoting any. Someone with a browser should open these two — it is the one cheap follow-up here.)

**INFERENCE:** the residue of P19 is not an unbuilt feature. It is a feature the market built, found harmful enough to default off, and that the strongest competitor publicly declines to ship on accuracy grounds. Spending 160 hours re-implementing a $5/month commodity is the team's stated reason for DEAD; spending it re-implementing the *known-bad half* of that commodity is worse. **DEAD stands.**

### 1d. The one thing that would have saved it, and why it does not

**FACT.** No product I retrieved joins expiry-driven pantry planning to a calorie/macro target. Cooklist has expiry and no macro goals ("The webpage does not explicitly mention features for... calorie tracking, or macro goals"). Eat This Much has macros, but its help centre never mentions expiration dates at all and states pantry-only generation is out of reach ("The chances of finding an ample selection of recipes that fit your pantry _and_ your nutrition targets _and_ your meal preferences is very low"). That intersection is genuinely empty — but it is the team's G1/G3 territory, already funded, and it does not describe P19's training-adjusted-target claim. It does not rescue P19.

---

## 2. Rival comparison across the ten P19 axes

Every cell is first-party or marked UNKNOWN. "UNKNOWN" = opaque or not present on pages I actually retrieved — not "probably absent."

| Axis | Eat This Much | Prospre | MacroFactor | Cooklist | MyFitnessPal |
|---|---|---|---|---|---|
| Baseline energy | **Mifflin-St Jeor, published with coefficients** | **3 formulas published** (H-B '84, MSJ, Katch-McArdle) | "estimate BMR, then multiply by an activity correction factor" — factor value UNKNOWN | none | UNRETRIEVED (403) |
| Weight-goal deficit | "about 500 Calories per day" for 1 lb/wk | "A 500 calorie difference ≈ 1lb (0.45kg) per week" | UNKNOWN | none | UNRETRIEVED (403) |
| Logged exercise | **Absent from retrieved pages** | **Absent from retrieved pages** | **Explicitly not additive** (quoted above) | none | Documented feature, body UNRETRIEVED |
| Wearable activity | **Absent from retrieved pages** | **Absent from retrieved pages** | **Explicitly refused** (quoted above) | none | Documented, body UNRETRIEVED |
| Negative adjustment | UNKNOWN | UNKNOWN | N/A by design | none | **Named feature, off by default; body UNRETRIEVED** |
| Macro changes | "set macro quantities as either a range or a percentage of your calories" (blog tutorial #2) | yes, per-day | yes (tracker) | diet filters only | UNRETRIEVED |
| Workout-day templates | UNKNOWN | **Weekday, not training-driven** (see 1b) | no | none | UNKNOWN |
| Double-count prevention | N/A (no exercise input found) | N/A | **This is the design** | N/A | The adjustment mechanic *is* the reconciliation; asymmetric default |
| **Minimum-calorie guard** | **NOT FOUND on calculator page** | **"No minimum-calorie floor is specified"** | **"no statements regarding minimum calorie thresholds"** | N/A | UNRETRIEVED |
| Meal/recipe/list output | plan + list + pantry discount | plan + list + Amazon Fresh | **none — not a planner** | **missing-only list**, no macro target | Premium meal plans (unverified) |

**The most important row is the one the team never asked about: the minimum-calorie guard is absent from every first-party page I could retrieve across all three planners.** Nobody publishes a floor. That is not permission to skip one — it is why §4 exists.

### Disclaimers — the market baseline you are below

| Product | Verbatim disclaimer |
|---|---|
| Eat This Much | "This calculator provides an estimate for informational purposes and is not a substitute for professional medical advice. Individual calorie needs can vary for reasons the calculator cannot measure. **Consult a healthcare professional or registered dietitian before making significant changes to your diet or exercise routine.**" |
| Prospre | "**This is for informational purposes only, and is not medical advice.**" |
| **Epicourier** | **None. Zero.** `grep -rni "disclaimer\|medical advice\|dietitian\|consult a"` across `web/src`, `backend/api` and all root `*.md` returns exactly one hit — a README line about CSV export "for healthcare or personal archiving." |

---

## 3. Device-reported vs planner-reported calories — the discrepancies

**FACT (market).** Four distinct "calories burned" quantities circulate under one name:

1. **ETM's static band.** A self-declared multiplier of 1.2–1.9 applied to BMR once, held constant across the whole plan period. A wearable reports a different number every day. These are not the same quantity and no page reconciles them.
2. **MFP's asymmetric default.** Positive adjustments shown by default, negative adjustments off by default (per article titles; body unretrieved). **INFERENCE:** an asymmetric default resolves the disagreement by honouring the device only when it *raises* the budget. Whatever the intent, the arithmetic consequence is one-directional inflation.
3. **MacroFactor's refusal.** Devices are "quite good at measuring step counts, and quite bad at estimating energy expenditure."
4. **The additive double-count.** **INFERENCE:** an activity multiplier already embeds habitual exercise. Adding logged or device-reported exercise *on top of* a multiplier ≥1.375 counts the same training twice. No planner page I retrieved warns about this. It is the single most likely way a naive implementation inflates a target.

**FACT (in-house — Epicourier already has its own unreconciled pair).** The product ships two calorie numbers that never meet:

- `POST /recommender` returns `goal_expanded` — a `calories_kcal` value **invented by Gemini 2.5 Flash from free text** (`backend/api/recommender.py:128-141`, returned raw at `backend/api/index.py:61`).
- `PUT /api/nutrients/goals` stores `calories_kcal` the user typed (`web/src/app/api/nutrients/goals/route.ts`).

Nothing in the codebase compares them, and the dashboard also offers a third number — `RECOMMENDED_GOALS = { calories_kcal: 2000, ... }` (`web/src/app/dashboard/nutrients/useNutrientDashboard.ts:53`) — presented behind a wand icon labelled **"Use Recommended"** with no source, no derivation, and no disclaimer. **You are already shipping the discrepancy class you were asked to find in rivals.**

---

## 4. Hard safety rules — testable, with the test for each

These bind **regardless of the DEAD verdict**, because `POST /recommender {goal: <free text>}` already reaches Gemini unbounded and returns nutritional targets to the user.

### The four load-bearing code facts

| # | Fact | Location |
|---|---|---|
| F1 | Free-text goal interpolated verbatim into the prompt: `f"**GOAL:** {goal_text}"`. No length cap, no delimiter, no content check. Endpoint validates only non-empty and `numMeals ∈ {3,5,7}`. | `backend/api/recommender.py:128-141`, `144-156`; `backend/api/index.py:47-61` |
| F2 | LLM output returned raw as authoritative nutrition targets: `return response.text.strip()` → surfaced as `goal_expanded`. No schema, no validator, no bounds. | `backend/api/recommender.py:141`, `156`; `backend/api/index.py:61` |
| F3 | **Server accepts any number as a calorie goal.** `if (typeof value !== "number" \|\| Number.isNaN(value))` — so `-500` and `Infinity` both pass and are upserted. Client zod is `.nonnegative()` only (no floor, no ceiling) and is trivially bypassed. | `web/src/app/api/nutrients/goals/route.ts` (`parseGoalPayload`); `web/src/app/dashboard/nutrients/useNutrientDashboard.ts:21-32` |
| F4 | Zero disclaimers repo-wide. | grep, §2 above |

None of the 19 adversarial tests in `p1a/evidence/own-tests/ATTACK-RESULTS.md` covers a calorie floor, a nutrition refusal, a disclaimer, or expired food. This is uncovered ground.

---

**SR-1 — The server is the safety boundary. No nutrition guard may exist only on the client.**
Every constraint in SR-2..SR-10 must hold when the request bypasses the UI.
**Test** `test_nutrition_guards_hold_on_direct_api_call`: for each of `PUT /api/nutrients/goals` and `POST /recommender`, issue a raw HTTP request with a payload the client form would reject. Assert `4xx` and assert the DB row is unchanged. **Currently FAILS** for goals (F3).

**SR-2 — A calorie target below the recorded floor is refused, never silently clamped.**
The floor is a single named server-side constant (`MIN_DAILY_KCAL`) with a `SOURCE` comment naming a citable authority and a retrieval date. It is never an inline literal and never duplicated. *The team sources the number; this report does not prescribe one.* A defensible escalation anchor to start from — NHS, `https://www.nhs.uk/conditions/obesity/treatment/`, retrieved 2026-09-13: *"You may also be able to get support from a dietician to follow a very low calorie diet (under 800 or 1200 calories)"* and *"Very low calorie diets are not suitable or safe for everyone."* Note this frames sub-threshold intake as **dietician-supervised**, which is the refuse-and-refer design, not a clamp.
**Test** `test_calorie_goal_below_floor_is_refused_not_clamped`: POST `MIN_DAILY_KCAL - 1`. Assert HTTP 400, assert the response body contains no calorie number at all (a clamp would leak one), and assert no row was written. Second assertion: `grep -rn` finds exactly one definition of `MIN_DAILY_KCAL` in the repo.

**SR-3 — Every nutrition number crossing a boundary is finite, positive, and bounded above.**
Kills the `Infinity` and negative paths in F3, and caps absurd upper values that make downstream planning meaningless.
**Test** `test_nutrition_fields_reject_non_finite_and_out_of_domain`: parametrize `PUT /api/nutrients/goals` over `[-500, 0, Infinity, -Infinity, NaN, 1e9, "2000"]` for every field in `GOAL_FIELDS`. Assert 400 for all. **Currently FAILS** for `-500`, `Infinity`, `-Infinity`, `1e9`.

**SR-4 — The system must never compute a personalised energy requirement itself, and must never let a model compute one.**
Epicourier stores no height, weight, age, sex or body-fat and must not acquire them for this purpose. It has no validated expenditure model, no weight-trend feedback loop (which is precisely what MacroFactor's expenditure algorithm is), and no clinical review. It may **accept and store** a number the user supplies or brings from elsewhere; it may **never derive** one — not from BMR arithmetic, not from an LLM, not from a "Use Recommended" default presented as advice.
**Test** `test_system_never_derives_an_energy_target`: (a) static — assert no BMR/TDEE coefficient appears anywhere outside test fixtures: `grep -rnE "Mifflin|Harris.?Benedict|Katch|6\.25|4\.92|13\.397|21\.6" backend/api web/src` returns empty. (b) behavioural — call `POST /recommender` with `goal="how many calories should I eat"` 20 times; assert zero responses reach the user containing a digit followed by `kcal`/`calories`. **Currently FAILS**: this is exactly what `nutrition_goal()` is built to do.
**Corollary test** `test_recommended_goals_default_is_labelled_not_prescribed`: assert `RECOMMENDED_GOALS` is not surfaced under any string matching `/recommend/i` unless the same rendered component also carries the SR-8 disclaimer and a source attribution. **Currently FAILS** (`useNutrientDashboard.ts:53` + the "Use Recommended" button in `GoalDialog.tsx`).

**SR-5 — Model output is a proposal, not a target. It passes a schema + range validator before it is displayed, persisted, or used in planning.**
Replace `return response.text.strip()` with structured output parsed into a Pydantic model whose fields carry `ge`/`le` bounds. A parse failure or a range violation is a refusal, not a fallback to raw text.
**Test** `test_model_nutrition_output_is_validated_before_surfacing`: monkeypatch the Gemini client to return, in turn, `"calories_kcal: 400"`, `"calories_kcal: -200"`, `"eat whatever you want"`, and a prompt-injection echo. Assert every case returns a refusal and that `response.text` never appears verbatim in the HTTP body. **Currently FAILS** — raw text is returned unconditionally.

**SR-6 — Enumerated refusal conditions produce a static, non-LLM response.**
Refuse and refer — never round-trip the refusal through the model, because the model is the thing being constrained. Minimum set, each an explicit test case: (a) disordered-eating indicators in the goal text; (b) stated pregnancy or lactation; (c) stated age under 18; (d) a named medical condition or a request to manage one by diet (diabetes, CKD, hypertension, coeliac, allergy severity); (e) drug, supplement or medication dosing; (f) any request for fasting duration or a supervised-only regime.
**Test** `test_refusal_conditions_return_static_copy_without_model_call`: parametrize ≥3 phrasings per condition; assert HTTP 200-with-refusal or 422, assert the mocked model client recorded **zero** calls, and assert the body byte-matches a constant in a `REFUSAL_COPY` module. Separately assert that refusal copy contains a referral line and contains no number.
**Note on scope:** this is a refusal boundary, not clinical triage. It exists so the product stops talking, not so it can assess anyone.

**SR-7 — Refusal precedes generation.** The check runs before any prompt is built or any token is spent; there is no path where a plan is generated and then suppressed.
**Test** `test_refusal_short_circuits_before_prompt_construction`: spy on `build_recommendation_prompt` and the model client; for every SR-6 case assert both spies have zero calls.

**SR-8 — The disclaimer is co-located with every rendered nutrition number, on the same screen, in the same component, and it survives export.**
Not a footer, not settings, not the ToS, not onboarding-once. The market baseline is Prospre's one sentence and Eat This Much's referral sentence (§2); you currently have nothing. The product ships CSV/text export (`/api/nutrients/export`), so the disclaimer must be written into the exported file too — an exported number with no disclaimer is the version that gets forwarded.
**Test** `test_every_nutrition_surface_carries_a_colocated_disclaimer`: enumerate the components that render any `GOAL_FIELD_CONFIG` value or `goal_expanded` (nutrients page, `GoalDialog`, dashboard tile, `MealDetailModal`, recommender page). Render each with jsdom and assert the disclaimer text node is present in the same rendered tree. Plus `test_nutrient_export_contains_disclaimer_header`: assert the first line of every export format matches the constant. **Currently FAILS everywhere.**

**SR-9 — No exercise, step, or device-reported figure may be added to a calorie target until provenance and non-double-counting are both proven in code.**
Epicourier has no wearable integration today; this rule is a *pre-commitment* that keeps the cheapest-looking feature from being the one that ships unguarded. The precondition is: the target's activity component and the incoming activity figure are demonstrably disjoint. Given F1–F4, that proof does not exist and cannot cheaply be made — which is why §1c says don't build it.
**Test** `test_no_activity_figure_reaches_a_calorie_target`: `grep -rn` asserts no arithmetic combines any field named `*burn*`, `*steps*`, `*exercise*`, `*active_energy*` with `calories_kcal`; plus an API test that posts an `exercise_calories` field to `PUT /api/nutrients/goals` and asserts it is rejected as an unknown field rather than silently ignored (silent ignore is how it gets wired up later).

**SR-10 — Every nutrition number ever shown is reconstructible.**
Persist `{input, model+version, prompt hash, raw output, validator verdict, final value, timestamp}` for anything the product displays as a target. Without this you cannot answer "why did it tell me 900."
**Test** `test_every_surfaced_nutrition_number_has_an_audit_row`: run 50 recommender calls against a mocked model; assert audit rows == surfaced-number count, and that replaying each stored input through the validator reproduces the stored final value bit-for-bit.

---

## 5. The rule the team has not thought about

**SR-EXP — The system must never place an item it has labelled EXPIRED into a "cook this" recommendation. Expired items belong in a separate check-or-discard lane, never in the ingredient set of a proposed recipe, and never in a positively-framed badge.**

### Why this is a safety rule, not a quality rule

**FACT — the product currently does exactly the opposite, by design, with only a soft prompt string standing in the way.**

`backend/api/inventory_recommender.py:89` annotates expired stock and hands it to the model:

```python
if days_until < 0:
    line += f" (EXPIRED {abs(days_until)} days ago) ❌"
```

The only guard is prompt line 5 in `build_recommendation_prompt`:

> `5. **NEVER**: Do not recommend recipes that ONLY use ❌ EXPIRED items`

**That rule, read literally, *permits* every recipe that mixes expired food with fresh food.** One fresh onion legitimises three-week-old chicken. It is also a soft natural-language instruction to a 2.5 Flash model with no post-parse enforcement: `recommend_from_inventory` constructs `RecommendedRecipe(**rec)` straight from parsed JSON — `ingredients_available` and `expiring_ingredients_used` are accepted verbatim with no cross-check against which inventory rows were expired.

The frontend then **markets it as a feature**. `web/src/components/inventory/RecipeRecommendationModal.tsx:323-332` renders an amber badge with a clock icon:

> "Uses {N} expiring ingredient{s}: {names}"

There is no expired/expiring distinction anywhere in that path — the field is named `expiring_ingredients_used`, and `web/src/app/dashboard/inventory/page.tsx:133-140` sends **every** inventory row including expired ones with zero filtering. An item 21 days past date arrives back as a green-flag selling point on a recipe card, in the same visual treatment as one expiring tomorrow.

### The root cause the team will miss if it only patches the prompt

**FACT.** `supabase/migrations/20251129030000_user_inventory.sql:19` stores `expiration_date DATE` — one undifferentiated column, commented "Expected expiration date for perishables." There is no label-type field. **The product therefore cannot know whether its own "EXPIRED" flag means unsafe or merely stale.** That distinction is regulatory, not cosmetic — UK Government / FSA, `https://www.gov.uk/understanding-food-labelling/best-before-and-use-by-dates` (retrieved 2026-09-13):

> "Use-by dates relate to the safety of food, whereas best before dates relate to quality."

> "Use-by dates on food labels tell you when the food is no longer safe to eat."

> "After the best before date, the food is usually safe to eat but may not be of the same quality."

**INFERENCE:** the system collapses a safety date and a quality date into one column, then instructs an LLM to prioritise cooking whatever is in it. Stale crackers and unsafe poultry are indistinguishable to every line of code in the path. Under that ignorance the only defensible default is: **an expired item is never an ingredient in a proposal.**

**Second, quieter failure mode — same rule, other direction.** In `format_inventory_with_expiration`, an item with `expiration_date = None` gets **no annotation at all**. The model sees an undated item as indistinguishable from fresh. `getExpirationStatus` in `web/src/utils/inventory/expiration.ts` has a correct `"unknown"` state that the backend prompt path throws away. **Unknown is not fresh**, and the schema makes `expiration_date` nullable, so this is the common case, not the edge case.

### The tests

**SR-EXP-1 — `test_expired_items_are_excluded_from_the_recommender_payload` (server-side filter, not prompt text).**
Build an inventory of 10 items, 4 with `expiration_date` in the past. Call `recommend_from_inventory` with a mocked model. Assert the string `EXPIRED` never appears in the prompt passed to the client, and assert the names of all 4 expired items are absent from `inventory_text`. *The filter must run in Python before prompt construction — a prompt instruction is not a control.* **Currently FAILS.**

**SR-EXP-2 — `test_expired_item_never_appears_in_any_returned_recipe` (output enforcement, adversarial model).**
Monkeypatch the model to return a recipe that lists an expired item in `ingredients_available` and in `expiring_ingredients_used` — i.e. simulate the model ignoring the prompt, which is the whole point. Assert `recommend_from_inventory` either drops that recipe or raises; assert no expired item name survives into any field of `InventoryRecommendResponse`. **Currently FAILS — there is no post-parse validation at all.**

**SR-EXP-3 — `test_expired_and_expiring_are_never_rendered_in_the_same_affordance` (jsdom).**
Render `RecipeRecommendationModal` with a recommendation whose `expiring_ingredients_used` contains one past-date item. Assert it does not appear inside the amber "Uses N expiring ingredient" badge. Assert expired items render only in a distinct discard/check element with distinct styling and non-promotional copy. **Currently FAILS.**

**SR-EXP-4 — `test_unknown_expiration_is_not_treated_as_fresh`.**
Pass three items — one dated fresh, one dated past, one with `expiration_date = None`. Assert the prompt annotates the undated item explicitly as unknown-date, and assert it is not counted toward any "expiring ingredients used" score. **Currently FAILS** (the `try/except ValueError` and the `if item.expiration_date` guard both fall through silently).

**SR-EXP-5 — `test_date_label_type_is_recorded_or_the_item_is_treated_as_use_by`.**
Schema-level. Until `user_inventory` carries a label-type column distinguishing use-by from best-before, assert that every past-date item is handled on the **use-by** (safety) branch. Encode the conservative default so that adding the column later is a widening change, never a silent loosening. Assert via a migration test that the column is either present-and-constrained or absent-with-the-safety-default active.

---

## 6. Budget

**FACT.** SR-1 through SR-3 and SR-EXP-1/2 are validator + filter work against code paths I have read: roughly 18–22 h including the tests. SR-4 through SR-8 are refusal copy, a structured-output schema, disclaimer placement and jsdom coverage: roughly 14–18 h. SR-9 and SR-10 are a grep-guard and an audit table: 5–8 h. **Total ≈ 40 h, one quarter of the 160.**

That quarter is affordable *because* P19 is dead: the build budget it would have consumed is free, and the team's own recommendation already routes it to G1. **INFERENCE:** SR-EXP-2 and SR-5 are also the same validator — "check every entity the model named against a real inventory row before surfacing it" — which is the identical mechanism G1's grounding-fidelity harness needs (`gap-interrogate.md`, G1 measurable claim: ">=95% of rationale sentences cite only inventory rows that actually exist"). Build it once, and the safety boundary and the G1 contribution share an implementation.

**HYPOTHESIS, flagged as such and worth 2 h to check before anyone argues about it:** the G1 harness baseline is described as expecting "well under 60%" citation fidelity from the current unconstrained Gemini path. If that holds, the same measurement quantifies how often SR-EXP-2 would have fired — turning a safety guard into a reportable number rather than a compliance checkbox. Do not assume the figure; measure it.

---

## Sources

- [Eat This Much — Calorie Calculator](https://www.eatthismuch.com/calculator)
- [Eat This Much — How does the pantry system work (updated 05 May 2026)](https://help.eatthismuch.com/help/how-does-the-pantry-system-work)
- [Eat This Much — Tutorial #2: Nutrition Target Profiles](https://blog.eatthismuch.com/eat-this-much-tutorial-2-editing-and-creating-your-nutrition-target-profiles/)
- [Prospre — Macro Calculator](https://www.prospre.io/macro-calculator)
- [Prospre — Meal Plan Generator](https://www.prospre.io/meal-plan-generator)
- [Prospre — homepage](https://www.prospre.io/)
- [MacroFactor — Expenditure](https://macrofactor.com/expenditure/)
- [Cooklist — app page](https://cooklist.com/cooklist-app)
- [MyFitnessPal — Should I turn on Negative Calorie Adjustments (HTTP 403, body unretrieved)](https://support.myfitnesspal.com/hc/en-us/articles/360032272152-Should-I-turn-on-Negative-Calorie-Adjustments)
- [MyFitnessPal — Understanding your Calorie Adjustment (HTTP 403, body unretrieved)](https://support.myfitnesspal.com/hc/en-us/articles/360032623871-Understanding-your-Calorie-Adjustment)
- [UK Government — Best before and use-by dates](https://www.gov.uk/understanding-food-labelling/best-before-and-use-by-dates)
- [NHS — Obesity treatment](https://www.nhs.uk/conditions/obesity/treatment/)

**Blocked, for the record (all 2026-09-13, WebFetch and curl with browser UA):** `support.myfitnesspal.com` 403, `blog.myfitnesspal.com` 403, `support.cronometer.com` 403, `fsis.usda.gov` 403, `foodsafety.gov` 403. Cronometer and MyFitnessPal rows in §2 are therefore UNKNOWN on formula and setting, not absent. WebSearch budget was exhausted at 200/200 mid-run; all findings above rest on direct first-party fetches.

**Key repo paths:** `/Users/andy/Library/Mobile Documents/com~apple~CloudDocs/Work/1151/CSC510/Epicourier-Web/backend/api/recommender.py`, `.../backend/api/inventory_recommender.py`, `.../backend/api/index.py`, `.../web/src/app/api/nutrients/goals/route.ts`, `.../web/src/app/dashboard/nutrients/useNutrientDashboard.ts`, `.../web/src/components/inventory/RecipeRecommendationModal.tsx`, `.../web/src/app/dashboard/inventory/page.tsx`, `.../supabase/migrations/20251129030000_user_inventory.sql`, `.../p1a/evidence/own-tests/ATTACK-RESULTS.md`, `.../p1b/evidence/claude/runs/gap-interrogate.md`
