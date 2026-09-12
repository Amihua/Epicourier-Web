# Project 1b — New Competitor-Discovery Prompts

These prompts extend the twelve starters. They are designed for the three proposed Epicourier updates:

1. recommended dish -> automatically add missing ingredients to To Buy List;
2. device/platform adaptation;
3. gym calorie-deficit-aware meal recommendations.

Global constraints for every prompt:

- Four graduate students have one month, about 160 person-hours, to build and test.
- A rival is a marketed product, never an LLM.
- Do not infer a feature from marketing adjectives.
- A capability is FOUND only with a live product/help/store/documentation URL and a quoted or tightly paraphrased feature statement.
- Separate product existence, feature existence, user demand, price, and quality; evidence for one does not prove the others.
- Mark unsupported cells UNKNOWN.
- Record the page title, URL, access date, and whether the source is FIRST-PARTY, STORE LISTING, USER REPORT, or THIRD-PARTY.
- Search for refuting evidence before recommending a gap.

## P13 — Workflow-proof competitor hunt

You are a product intelligence analyst. Test this exact workflow, not keyword similarity:

<workflow with actor, trigger, inputs, state changes, and observable result>

Build a table:

product | exact step 1 | exact step 2 | exact step 3 | fully supported? | evidence URL per step | evidence type | missing link

A product counts as a direct rival only if one source proves the full workflow or separate sources prove every step. “Has recipes” plus “has lists” does not prove recipe-to-list automation. Search official help centers and app-store listings before blogs. End with DIRECT / PARTIAL / ADJACENT / NOT VERIFIED and state the narrowest surviving gap.

Use with feature 1:
Actor selects an automatically recommended dish -> system calculates ingredients -> subtracts pantry/on-hand items -> consolidates quantities -> previews changes -> user confirms -> only missing items enter To Buy List.

## P14 — Demand triangulation, not feature counting

For this candidate feature:

<feature and named audience>

Find evidence in four independent buckets:

A. observed behavior or explicit request from users;
B. recurring complaint or workaround;
C. incumbent product investment or paid-tier placement;
D. measurable adoption, rating, search, or conversion signal.

Output:

signal | claim supported | source | date | evidence class | strength 0-3 | limitation

Do not count a vendor feature page as proof users want the feature. Do not count one Reddit thread as frequency. Conclude STRONG / MODERATE / WEAK / NO MARKET SUPPORT and list the cheapest validation study that could change the conclusion.

## P15 — Capability-boundary matrix for device/platform claims

“Cross-platform” is too vague. For each rival, verify separately:

web | iOS | Android | tablet layout | sync continuity | offline behavior | wearable import | smart-appliance control | regional restrictions | source

Then execute one realistic scenario across platforms and distinguish:

- UI responsiveness;
- account/data synchronization;
- device sensor import;
- appliance control;
- accessibility/adaptive input;
- graceful degradation when a capability is unavailable.

Do not award a check from an icon or generic “works everywhere” statement. End by identifying which layer users complain about and which layer four students can test in one month.

## P16 — Substitute and adjacent-rival search

The user may solve this problem without a meal-planning app. Starting from the job:

<job to be done>

Search five rival categories: direct apps, fitness/nutrition trackers, grocery/list tools, wearable ecosystems, and manual workarounds/spreadsheets. Output:

category | product/workaround | job completed | switching cost | advantage over us | live evidence | direct/adjacent/substitute

Then state whether the proposed feature wins against the user's current workaround, not merely against Epicourier's direct rivals.

## P17 — Negative-evidence and disconfirmation sprint

Assume our proposed gap is false. Generate at least twelve search formulations using synonyms, legacy product names, help-center terminology, app-store wording, and workflow verbs. Search for:

- an incumbent already doing it;
- a discontinued product that tried it;
- complaints showing users reject it;
- technical or policy reasons it remains absent;
- a simpler workaround users prefer.

For each: query | result | URL | confirms/refutes/neutral | confidence. The final answer must lead with the strongest refutation. If no refutation is found, say “not found in this search,” never “does not exist.”

## P18 — Review-to-requirement extractor

Given these real review excerpts:

<paste dated excerpts with URLs>

Extract only testable needs. Output:

verbatim excerpt | user job | failure point | proposed requirement | acceptance test | frequency evidence | safety risk

Reject excerpts that are vague, unverifiable, or unrelated. Consolidate duplicates. Do not turn praise into a requirement. For each accepted requirement, name at least one rival that already addresses it and one remaining edge case.

## P19 — Gym calorie-deficit safety and competition audit

You are a sports-nutrition product analyst and safety red team. Compare how rivals calculate or display:

baseline energy | weight-goal deficit | logged exercise | wearable activity | negative adjustment | macro changes | workout-day templates | double-count prevention | minimum-calorie guard | meal/recipe/list output

Require first-party sources for formulas/settings. Mark UNKNOWN when the calculation is opaque. Identify discrepancies between device calories and planner calories. Do not give medical advice or prescribe a deficit.

Then propose the smallest non-clinical Epicourier slice that turns an already supplied daily energy/macro target into recipes and a missing-ingredient list. The slice must not estimate exercise burn itself. Provide safety disclaimers, user overrides, test oracles, and a kill signal.

## P20 — One-month wedge adjudicator

Score each proposed feature using evidence gathered above:

feature | user-demand evidence 0-3 | incumbent saturation 0-3 | differentiation 0-3 | implementation fit 0-3 | testability in one month 0-3 | safety/privacy risk 0-3 | evidence confidence 0-3

Show the rationale for every score. Saturation and risk are penalties; do not hide them inside a positive total. Output:

- table-stakes requirement;
- narrow differentiating wedge;
- one-month vertical slice;
- success metric;
- kill signal;
- evidence still missing.

Choose one primary feature and at most one supporting feature. “Build all three” is not permitted unless the total work is independently estimated below 110 implementation hours, leaving at least 50 hours for testing and delivery.
