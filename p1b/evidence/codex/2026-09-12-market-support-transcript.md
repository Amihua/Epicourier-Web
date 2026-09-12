# Project 1b — Codex Market-Support Exploration Log

Date: 2026-09-12  
Scope: new prompts P13–P20 and market support for three proposed updates.  
Method: official product/help pages first, then selected user reports for pain/workaround evidence. A vendor feature page proves capability, not demand. A single review proves an example, not frequency.

## Query family 1 — Recommendation to To Buy List

Searched workflow terms including recommendation, recipe, meal plan, one-click shopping list, missing ingredients, pantry subtraction, list consolidation, and confirmation.

Findings:

- Samsung Food says any recipe or meal plan can become a smart shopping list with one click.
- Samsung Food help documents both “Add Plan to Shopping List” and adding an individual recipe.
- Mealime advertises an automatic grocery list generated from a weekly meal plan.
- A public user request explicitly asks for selecting a meal and automatically adding its ingredients to a grocery list.
- A Samsung Food store review reports a failure mode: adding a recipe can add everything rather than correctly excluding Food List items.

Adjudication: the broad feature is market-supported but already common. The narrower requirement is inventory-aware delta generation with quantity consolidation, a preview, and explicit confirmation.

## Query family 2 — Device/platform adaptation

Searched Web, iOS, Android, phone, tablet, synchronization, smart fridge, connected oven, regional capability, wearable, and graceful degradation.

Findings:

- Samsung Food supports Web/iOS/Android and says saved mobile changes are reflected in Web.
- Samsung Food exposes profiles, shopping lists, recipes, and planning on supported Samsung fridges.
- Samsung documents sending recipe instructions to supported SmartThings ovens, with model and region restrictions.
- SideChef officially describes smartphone/tablet use.
- Cronometer says several wearable/health integrations are mobile-only, illustrating platform capability asymmetry.

Adjudication: “responsive/cross-platform” is table stakes and not a credible standalone gap. A testable wedge is continuity with explicit capability states: the same plan/list survives device changes, while unsupported sensors/appliances degrade to manual input without data loss.

## Query family 3 — Gym calorie deficit

Searched calorie deficit, net calorie target, exercise calorie adjustment, negative adjustment, workout-day macros, wearable import, energy expenditure, double counting, meal plan, and grocery list.

Findings:

- MyFitnessPal calculates a net calorie target from the user's goal and adjusts remaining calories using logged exercise.
- MyFitnessPal lets Premium users disable exercise-calorie increases or choose how added calories distribute across macros.
- MyFitnessPal documents negative adjustments when a connected tracker reports lower expenditure than expected.
- Cronometer derives an energy target from weight goals, imports activity/exercise from devices, supports workout-day macro schedules, and warns users to prevent double counting.
- Cronometer's integration documentation lists Garmin, Oura, Fitbit, Withings, WHOOP, Polar, Suunto, Apple Health, Samsung Health, and Health Connect, among others.
- User discussions show a real decision problem: whether training-day activity should increase calories/carbohydrates and how integrations disagree.

Adjudication: calorie-deficit tracking is a mature crowded market, and estimating exercise calories introduces safety and accuracy risk. A plausible Epicourier bridge is to accept a user- or tracker-supplied daily calorie/macro target, show provenance, and recommend meals plus missing grocery items. Epicourier should not calculate exercise burn in the one-month slice.

## Prompt outcomes

- P13 exposed the difference between “recipe + list both exist” and a proven end-to-end workflow.
- P14 separated vendor investment from user demand.
- P15 broke vague device adaptation into six different capabilities.
- P16 added fitness trackers, grocery tools, health ecosystems, and spreadsheets as substitutes.
- P17 refuted broad novelty claims early.
- P18 converted complaints into testable requirements without inventing frequency.
- P19 kept the gym feature non-clinical and made double counting/provenance explicit.
- P20 prevented selecting all three features without capacity evidence.

The normalized evidence matrix, recommendation, and sources are in p1b/result/codex/market-support.md.
