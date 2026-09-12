# Market Support for Three Proposed Project 1b Updates

Research date: 2026-09-12

## Decision summary

| Candidate | Market support | Incumbent saturation | Best interpretation |
|---|---|---|---|
| Recommended dish -> To Buy List | STRONG for the broad workflow | HIGH | Table stakes; differentiate on pantry-aware missing-item delta, consolidation, preview, and confirmation |
| Device/platform adaptation | MODERATE for continuity; strong incumbent evidence | HIGH | Supporting quality requirement, not the main product gap |
| Gym calorie deficit | STRONG for calorie/exercise tracking | HIGH and safety-sensitive | Potential wedge only when bridging an external target to explainable meals and shopping; do not estimate exercise burn |

Recommended primary slice: **training-day-aware recommended meal -> pantry-aware To Buy List**, where the user supplies or confirms the calorie/macro target. Supporting requirement: consistent Web/mobile behavior and clear manual fallback. Do not promise novel calorie-deficit calculation or smart-appliance coverage.

## Feature 1 — Recommended dish automatically adds to To Buy List

### Market evidence

| Evidence | What it supports | Type | Limitation |
|---|---|---|---|
| Samsung Food: “Instantly turn any recipe or meal plan into a smart shopping list with one click.” https://samsungfood.com/ | Workflow is established | First-party | Does not prove satisfaction |
| Samsung Food help documents adding a full plan or individual recipe to a shopping list. https://support.samsungfood.com/hc/en-us/articles/35369657798548-Getting-Started-with-Meal-Planner | Exact interaction exists | First-party help | Recommendation origin is not essential to list conversion |
| Mealime advertises an automatic grocery list from the weekly plan. https://www.mealime.com/ | Rival investment | First-party | Pantry subtraction details unknown |
| User asks for a meal to “automatically add” ingredients to a grocery list. https://www.reddit.com/r/cookingforbeginners/comments/18667uy/meal_planning_app_that_creates_grocery_list/ | Explicit user job | User report | One thread; no frequency estimate |
| Samsung Food review says adding ingredients adds everything despite Food List contents. https://play.google.com/store/apps/details?id=com.foodient.whisk | Concrete missing-item failure | Store user report | One review; behavior/version may change |

### Requirement worth testing

When a user accepts a recommended recipe, Epicourier computes required quantities, subtracts confirmed usable pantry quantities, consolidates duplicate ingredients/units, displays a preview with provenance, and adds only confirmed missing quantities to To Buy List.

Acceptance signals:

- 100% deterministic fixture agreement for pantry subtraction and consolidation.
- No list mutation before confirmation.
- Repeating the action does not silently duplicate quantities.
- At least 4/5 task-test users can identify what will be added and why.
- Kill the differentiator claim if major rivals already provide the same missing-item preview and users show no preference.

## Feature 2 — Device/platform adaptation

### Market evidence

| Evidence | What it supports | Type | Limitation |
|---|---|---|---|
| Samsung Food supports Web/iOS/Android and says saved mobile changes reflect in Web. https://support.samsungfood.com/hc/en-us/articles/35369657798548-Getting-Started-with-Meal-Planner | Cross-platform continuity | First-party help | Does not prove offline conflict handling |
| Samsung Food allows access on supported Samsung fridges. https://samsungfood.com/download/ | Appliance surface exists | First-party | Ecosystem-specific |
| Samsung documents supported SmartThings oven control and regional restrictions. https://www.samsung.com/us/home-appliances/samsung-food/ | Appliance control plus capability boundaries | First-party | Limited devices/regions |
| SideChef supports smartphones and tablets. https://www.sidechef.com/faq/ | Multi-form-factor expectation | First-party | Exact adaptive behavior unknown |
| Cronometer says some device integrations are mobile-only. https://support.cronometer.com/hc/en-us/articles/360024748771-Mobile-Integrations | Platform asymmetry is real | First-party help | Different product category |

### Requirement worth testing

The same accepted meal and To Buy List state is usable on desktop and narrow mobile view. If wearable or appliance capability is absent, the UI clearly offers manual input and never drops or changes the plan.

Acceptance signals:

- Responsive tests at agreed desktop/mobile widths.
- Cross-session sync test for plan/list state.
- Capability flag test for available/unavailable integration.
- Keyboard and WCAG 2.2 status-message checks.
- Do not call this a differentiator unless user evidence identifies continuity/degradation as a switching reason.

Out of scope for one month: native iOS/Android apps, offline conflict resolution, multiple wearable APIs, and smart-appliance control.

## Feature 3 — Gym calorie deficit

### Market evidence

| Evidence | What it supports | Type | Limitation |
|---|---|---|---|
| MyFitnessPal calculates daily net calories from food and exercise. https://support.myfitnesspal.com/hc/en-us/articles/360032626011-How-does-MyFitnessPal-work | Mature calorie-deficit job | First-party help | Formula quality is not independently validated here |
| MyFitnessPal changes daily calorie/macro goals after exercise and allows Premium control. https://support.myfitnesspal.com/hc/en-us/articles/360032623851-Why-do-my-daily-nutrient-values-and-my-calorie-goal-change-when-I-log-exercise | Exercise adjustment and macro control | First-party help | Not direct recipe/list generation |
| MyFitnessPal supports negative tracker adjustments. https://support.myfitnesspal.com/hc/en-us/articles/360032272152-Negative-Calorie-Adjustments | Demand for accurate deficit feedback | First-party help | Depends on connected partner data |
| Cronometer models BMR, activity, tracker activity, exercise, and warns against double counting. https://support.cronometer.com/hc/en-us/articles/31974307318420-Energy-Expenditure | Proven complexity and safety boundary | First-party help | Not proof users want Epicourier |
| Cronometer supports workout-day macro schedules. https://support.cronometer.com/hc/en-us/articles/33180044162836-Mobile-Targets | Training-day target variation exists | First-party help | May be paid/configuration dependent |
| User discussion asks whether training-day activity should increase calories/carbs and cites integration trade-offs. https://www.reddit.com/r/MacroFactor/comments/1l3i4fm/ | Concrete decision pain | User report | One discussion |

### Requirement worth testing

Epicourier accepts a user-confirmed daily energy and macro target, labeled with its source and timestamp. It does not estimate workout burn. It ranks recipes against remaining target and pantry state, explains the trade-off, and previews only missing ingredients for To Buy List.

Acceptance signals:

- Identical input produces deterministic target math.
- Exercise calories are never imported twice.
- Stale/missing target data is visibly marked and requires confirmation.
- The system never describes output as medical advice or guarantees a weight-loss rate.
- At least 4/5 users can identify target source, remaining calories, and why a meal was recommended.
- Kill the feature if users prefer using MyFitnessPal/Cronometer plus a normal grocery list, or if integration work cannot preserve 50 hours for testing/delivery.

## P20 scorecard

Scores: 0–3. Saturation and risk are penalties.

| Feature | Demand | Saturation penalty | Differentiation | Stack fit | One-month testability | Safety/privacy penalty | Evidence confidence |
|---|---:|---:|---:|---:|---:|---:|---:|
| Recipe -> To Buy List | 3 | 3 | 1 broad / 2 narrow | 3 | 3 | 1 | 3 |
| Device/platform adaptation | 2 | 3 | 1 | 3 for responsive Web / 0 for hardware | 3 responsive / 0 hardware | 1 | 2 |
| Gym calorie deficit | 3 | 3 | 2 for meal+list bridge | 2 | 2 | 3 | 3 for tracking market / 1 for bridge demand |

## Proposed one-month vertical slice

1. User manually enters or confirms a training-day calorie/macro target; no wearable integration in M0.
2. Epicourier recommends one meal and shows a typed explanation: target source/time, remaining energy/macros, pantry items used, missing items, and unknowns.
3. User previews and confirms missing ingredients before To Buy List mutation.
4. The workflow passes deterministic calculation, authorization, idempotency, mobile/desktop, accessibility, and five-user comprehension tests.

This combines the strongest implementation fit of feature 1 with a narrower feature-3 audience. Feature 2 is an acceptance-quality requirement rather than a separate product.

## Evidence still required before the final report

- Run P13, P17, P19, and P20 independently on at least two other LLMs.
- Verify whether Samsung Food, Eat This Much, MyFitnessPal Premium+, or Cronometer already combine training-adjusted targets with automatic recipes and pantry-subtracted shopping lists.
- Collect at least five gym-going meal planners' current workflows and switching objections.
- Capture current prices and regional availability from official pages.
- Replace broad “Gym users” with a named segment, such as recreational lifters who meal-prep and already track macros.
- Obtain team skill biographies and estimate integration/testing hours.
