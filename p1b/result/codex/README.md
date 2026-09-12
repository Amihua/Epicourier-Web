# Project 1b — Codex Results

Run date: 2026-09-12  
Constraint applied throughout: four graduate students, one month, about 160 person-hours total, to build **and test**.

## Executive result

The initial gap hypothesis — “current products do not plan from expiring pantry food” — is refuted. Samsung Food+ publicly describes meal plans based on a Food List that prioritize ingredients nearing their use-by date, and Eat This Much advertises pantry-prioritized automatic planning.

The narrower candidate is an **auditable recommendation receipt**: show which pantry lots, expiry or unknown states, nutrition constraints, and substitutions caused a recipe to rank, then let the user correct the inputs. This is still a hypothesis, not a proven market gap. It requires a second-model check, a dated rival feature matrix, and user interviews.

## 1. Market survey

| Product | Users | Main strength | Main weakness/unknown | Price checked 2026-09-12 | Evidence |
|---|---|---|---|---|---|
| Samsung Food / Food+ | Home cooks wanting an all-in-one planner | Recipes, planning, shopping, nutrition, Food List, near-use-by prioritization | Exact Food+ price unknown | Free app; Food+ unknown | https://samsungfood.com/food-plus/ |
| Eat This Much | Dieters wanting automated plans | Nutrition targets, pantry priority, leftovers, grocery lists | Weekly pantry workflow is premium | Free; Premium $5/month billed annually | https://www.eatthismuch.com/pricing |
| Mealime | Busy households | Simple personalized plans and organized grocery lists | Pantry/expiry support not established | Free; Pro unknown | https://www.mealime.com/ |
| Paprika | Recipe collectors and household planners | Recipe import, meal calendar, pantry, grocery lists | No verified AI outcome evaluation | Windows $29.99 sale; others unknown | https://www.paprikaapp.com/windows/ |
| SideChef | Guided home cooks | Personalized plans, step-by-step recipes, grocery ordering | Pantry/expiry support not established | Core planning free | https://www.sidechef.com/meal-planner/ |
| MyFitnessPal Premium+ | Nutrition trackers | Deep logging plus meal planning and grocery lists | User reports say saved recipes may not flow into planner | Official checked price unknown | https://support.myfitnesspal.com/hc/en-us/articles/34889191368077-The-difference-between-Free-Premium-and-Premium |
| SuperCook | Ingredient-first cooks | Recipe discovery from current pantry ingredients | Planning, nutrition goals, and outcome evidence unknown | unknown | https://play.google.com/store/apps/details?id=com.supercook.app |

Only seven rivals were supported in this run. Three remembered names were excluded rather than padded without verification. The final cross-model table must state whether each survivor was named by two models or supported by a live URL.

## 2. Complaint themes

This is a small convenience sample, not population-level frequency data.

| Rank | Theme | Evidence | Existing fix? | Opportunity |
|---|---|---|---|---|
| 1 | Planner cannot reuse a user's own recipes | MyFitnessPal user: “hard time adding my own recipes/meals ... to the Meal Planner” | Paprika supports owned/imported recipes | Preserve provenance and allow locked user recipes |
| 2 | Pantry maintenance is tedious | Paprika thread asks for “Easier pantry management” | Samsung Food automates parts of a Food List | Low-friction confirm/correct workflow |
| 3 | Premium-tier frustration | MyFitnessPal user: “only available to premium plus members” | Free alternatives exist | Transparent limits and exportability; not unique |
| 4 | Weak social/video import | Paprika comparison reports no social-media import | Some newer tools claim this | Too large and peripheral for this month |
| 5 | Export/share gaps | User asks to “EXPORT ... or SHARE directly to email” | Coverage varies | Standard export is table stakes |

Sources:

- https://www.reddit.com/r/Myfitnesspal/comments/1lknx5e/adding_custom_recipesmeals_to_meal_planner/
- https://www.reddit.com/r/PaprikaApp/comments/1miegwj/what_features_are_you_all_looking_for_in_a/
- https://www.reddit.com/r/Myfitnesspal/comments/1l34c5v/have_you_all_tried_the_new_meal_planner/
- https://www.reddit.com/r/PaprikaApp/comments/1tud35i/comparison_of_popular_recipe_apps/
- https://www.reddit.com/r/PaprikaApp/comments/1uq1smi/parika_4_vs_cookbookmanager_app/

## 3. Table stakes and differentiators

| Current Epicourier use cases | Classification | Reason |
|---|---|---|
| Register/sign in | TABLE STAKES | Account-backed planners support profiles |
| Browse/view recipes | TABLE STAKES | Samsung Food, SideChef, and Paprika center on recipes |
| Personalized plan/schedule/meal completion | TABLE STAKES | Eat This Much, Mealime, Samsung Food, and MyFitnessPal overlap |
| Nutrient progress/goals/export | TABLE STAKES | MyFitnessPal and Eat This Much specialize here |
| Achievements/challenges | Weak DIFFERENTIATOR | Not observed on checked planner pages, but generic gamification is easy to copy |
| Review/add/edit/remove inventory | TABLE STAKES in pantry segment | Paprika, SuperCook, Samsung Food, and Eat This Much have pantry concepts |
| Inventory recipe suggestions | TABLE STAKES | Samsung Food, Eat This Much, and SuperCook overlap |
| Shopping list/create from plan | TABLE STAKES | Most verified rivals overlap |
| Complete shopping and stock pantry | Possible differentiator, not unique | Paprika supports moving purchases to pantry; Epicourier also has an ownership-test failure |

Two hypotheses not observed on checked pages:

1. Recommendation receipt: expose exact pantry lots, unknown dates, constraints, substitutions, and confidence.
2. Closed-loop outcome: record cooked/discarded/still-held items and compare with a baseline.

“Not observed” is not proof that no rival offers them.

## 4. Support material

| Priority | Source | Affected area |
|---|---|---|
| MUST | FTC Health Breach Notification Rule: https://www.ftc.gov/business-guidance/resources/health-breach-notification-rule-basics-business | Identifiable nutrition/account data and breach response |
| MUST | FTC Mobile Health Apps tool: https://www.ftc.gov/business-guidance/resources/mobile-health-apps-interactive-tool | Health/privacy claims and applicable rules |
| MUST | FDA food allergen guidance: https://www.fda.gov/food/nutrition-food-labeling-and-critical-foods/food-allergies | Recipe and recommendation safety wording |
| MUST | WCAG 2.2: https://www.w3.org/TR/wcag/ | All Web UI and tests |
| MUST | OWASP ASVS 5.0: https://owasp.org/projects/asvs | Authentication, ownership, validation, APIs |
| MUST | OWASP LLM01 prompt injection: https://genai.owasp.org/llmrisk/llm01-prompt-injection/ | AI preference/input boundary |
| MUST | Supabase RLS docs: https://supabase.com/docs/guides/database/postgres/row-level-security | Private per-user data |
| MUST | Root and dependency licenses | Distribution and SBOM |
| SHOULD | USDA FoodData Central API: https://fdc.nal.usda.gov/api-guide/ | Nutrient/ingredient provenance |
| SHOULD | NIST Privacy Framework: https://www.nist.gov/privacy-framework | Collection, retention, deletion |
| SHOULD | NIST AI RMF: https://www.nist.gov/itl/ai-risk-management-framework | Explanation, monitoring, human override |
| SHOULD | Google SRE workbook: https://sre.google/workbook/table-of-contents/ | Failure handling and ownership |

Applicability depends on deployment and jurisdiction; this is a reading list, not legal advice.

## 5. Stakeholders

| Stakeholder | Fear | Winning design decision |
|---|---|---|
| Household member/caregiver | Another person's allergy is ignored | Explicit per-person constraints; no “medically safe” guarantee |
| Nutrition-data subject | Profiling or breach | Minimize data, export/delete, clear retention |
| Grocery shopper | Wrong quantities or duplicates | Editable units and provenance before pantry transfer |
| Recipe author | Uncredited copying | Preserve source URL and attribution |
| Dietitian/clinician | Suggestions are mistaken for treatment | Scope education from medical advice |
| Accessibility user | Color-only or inaccessible status | WCAG 2.2 AA acceptance tests |
| Security reviewer | Cross-user access/model leakage | Fix ownership first and threat-model data flows |
| Maintainer | Brittle integrations | Bounded inputs, safe logs, feature flags, rollback |
| Regulator | Unsupported claims | Claim-to-test evidence register |
| Course marker | Claims without runs | Versioned prompts, transcripts, tests, caught-error log |
| Budget-limited household | Unaffordable suggestions | Optional ceilings and explicit unknown prices |

## 6. Three futures

| Future | One-month build-and-test slice | Risk | Kill signal |
|---|---|---|---|
| SAFE: secure recommendation receipt | Fix recorded high-risk failures; add one typed reason schema and one UI; unit/security plus five task tests | Decorative explanations | Abandon if 4/5 users cannot explain the top ranking |
| BOLD: closed-loop waste outcome | One weekly workflow for cooked/discarded/still-held items and a feasibility dashboard | Self-report burden and too-short study | Abandon impact claim if fewer than 60% finish check-in |
| WILD: receipt-camera/price optimizer | Prototype one receipt format into a review queue | OCR/entity matching consumes the month | Kill if fixture accuracy is under 90% after week 1 or exceeds 40 hours |

Recommendation: choose SAFE unless early user evidence supports BOLD.

## 7. Gap with receipts

Confirming evidence:

- FOUND: users request easier pantry management.
- FOUND: users report difficulty using owned recipes in a planner.
- NOT FOUND: interviews showing users want decision-level receipts.
- NOT FOUND: rival pages showing measured before/after household waste outcomes.

Refuting evidence:

- FOUND: Samsung Food+ prioritizes Food List items nearing use-by dates.
- FOUND: Eat This Much combines pantry priority, nutrition, automatic plans, and grocery lists.
- FOUND: SuperCook offers ingredient-first discovery.
- FOUND: Paprika supports shopping-list-to-pantry behavior.
- NOT FOUND in this limited search: a rival exposing equivalent typed decision receipts.

Verdict: the broad expiry-aware gap is dead. The auditability/outcome gap remains only a hypothesis.

## 8. Mission candidates

**A — recommended.** Household cooks often distrust pantry-based meal suggestions because they cannot see which expiry and nutrition facts drove the choice. We will extend Epicourier with a recommendation receipt that names the exact pantry lots used, flags unknown dates, and shows each constraint and substitution. The user remains the decision maker and can correct inventory before accepting a plan. In a five-user task test, at least four users must correctly explain why the top recipe ranked first without developer help. This makes recommendation quality inspectable rather than relying on an AI label.

**B.** Food-waste apps often stop after suggesting a recipe, so they cannot show whether food was actually saved. We will add a one-week closed loop recording cooked, discarded, and still-held pantry items against a self-reported baseline. Each plan carries a receipt connecting expiring items to meals and outcomes. At least 60% of pilot participants must complete the final check-in, or the impact claim is dropped. The result is feasibility evidence, not a causal waste-reduction claim.

**C.** Shared household grocery flows can create unsafe or unauthorized changes when ownership and constraints are implicit. We will secure Epicourier's list-to-pantry path and expose who can change each item, where its quantity came from, and what remains uncertain. P1a's failing cross-user transfer contract becomes a required passing regression before new planning behavior ships. No cross-user item mutation may succeed in the two-user fixture. The benefit begins with enforced trust boundaries.

## 9. Milestone reality check

| Milestone | Rating | Decision |
|---|---|---|
| M0 rival matrix, five interviews, baseline task/security tests | REALISTIC | About 20 hours |
| M1 recorded ownership, type/range, input-boundary fixes | REALISTIC | About 35 hours; only known failures |
| M2 one typed receipt endpoint and UI | REALISTIC | About 45 hours |
| Full weekly optimizer with live prices, allergies, stores, and nutrition | FANTASY | Slice to one ranking path using existing data |
| Statistically valid food-waste impact proof | FANTASY | Slice to feasibility and completion rate |
| Test/report/poster/demo reserve | REALISTIC | Reserve 40–50 hours |

Do not build OCR, live retailer integrations, native apps, or clinical recommendations this month.

## 10. Red team

1. **Nobody wants it.** Auditability may be the team's engineering preference rather than a household pain. Evidence needed: in five observed tasks, at least three users independently question a ranking and at least four correctly use/prefer the receipt.
2. **The team cannot build it.** The existing app still has ownership and malicious-input failures, and team biographies are unknown. Evidence needed: all recorded high-risk regressions green by the end of week 1 and a typed vertical slice by mid-week 2.
3. **A rival already does it better.** Samsung Food+, Eat This Much, and SuperCook cover most pantry-planning value. Evidence needed: dated feature matrix, second-model verification, and user evidence that the missing receipt changes a decision.

Until then, describe this as an evaluated trust experiment, not a proven market-leading waste reducer.

## 11. Play to the team

Repository evidence demonstrates collective TypeScript/Next.js, Python/FastAPI, Supabase, Jest/Pytest, and AI integration work, but not which current member owns each skill.

- Best direction: secure typed receipt on the existing stack.
- Trap: retailer price optimization, OCR, clinical claims, or native rewrite.
- Weekend-learnable: basic WCAG checks and structured usability sessions.
- Not safely weekend-learnable: clinical dietetics, legal conclusions, robust OCR/entity resolution.
- Placeholder ownership: frontend/accessibility; API/schema/model boundary; database authorization/test fixtures; user research/evaluation/evidence. Replace with real names and cross-review.

## 12. Pivot question

| Different project | One-month slice | What is lost |
|---|---|---|
| CLI security regression pack for CRUD apps | Reusable two-user ownership, coercion, and range checks | Consumer meal/waste story |
| Browser recommendation-receipt library | Typed schema, React component, one Epicourier adapter, comprehension test | Full closed-loop planner |
| Course-team evidence-ledger bot | Link prompts, claims, sources, tests, and caught errors | Food-domain reuse |

Decision: **stay the course, but narrow sharply**. Reuse the existing inventory/recommendation path and adversarial tests. Pivot to the receipt library only if interviews reject the household use case but show broader demand.

## D5 caught-error ledger

| Initial temptation | Check | Correction |
|---|---|---|
| Expiry-aware pantry planning is absent | Samsung Food and Eat This Much official pages | Refuted |
| Shopping-to-pantry transfer is unique | Paprika evidence and current P1a test | Not unique; Epicourier ownership guard also fails |
| Fill ten rivals from memory | Live-source requirement | Keep seven supported candidates; do not pad |
| Git contributors reveal team skills | Repository inspection | Reject; require real biographies |
| One month can prove waste reduction | Capacity/study-duration check | Measure feasibility/comprehension only |
| Use README's inherited “1,130+ tests” boast | Raw P1a reruns | Cite auditable Web 31/32 and Backend 18/18 runs |

## Prompt usefulness and Codex assessment

Most useful: prompts 1, 7, and 10, because they killed an unsupported gap; prompt 9 protected test/report capacity. Least useful: prompt 11, because member biographies were unavailable. Prompt 8 becomes useful only after gap and red-team checks.

Codex strength: conservative source handling, explicit unknowns, measurable kill signals, and linkage to failing tests. Weakness: this is a single-model run, complaint sampling is small, some prices/features remain unknown, and no real user interviews were performed.

## Follow-up market-support study

New P13–P20 prompts and evidence for recipe-to-To-Buy, device/platform adaptation, and gym calorie-deficit features are summarized in `p1b/result/codex/market-support.md`. The study treats recipe-to-list and cross-platform support as established incumbent capabilities and recommends testing a narrower training-day target -> explained meal -> pantry-aware missing-item list workflow.
