# P1a Gemini Test-to-Use-Case Traceability

## Scope and rules

- Design baseline: the 20 use cases in `p1a/use-cases/p1a_gemini/use-cases.md`. Every `UC<n>` in this document refers to that list's numbering.
- "Our tests" means tests under `web/tests/p1a/` and `backend/tests/sihao/p1a/`.
- Each distinct test function is one row. Parameterized executions are grouped under their function name.
- A mapping is made only when the assertion or inspected source contract directly supports the use case. `?` means that the behavior is outside Gemini's top 20 or the relationship is not established.
- The contract suite checks visible source contracts without importing the Next.js runtime. It is useful evidence, but it is weaker than a runtime or end-to-end test.
- **Naming hazard.** The functions in `web/tests/p1a/use-case-contracts.test.ts` are named `test_uc1…test_uc20` after a different use-case numbering, which was the design baseline when the suite was written. Those numbers carry no meaning here; every row below was re-mapped from what the test asserts to the use case whose scenario or extension covers it. Six rows land on a different number than their name suggests, and two land nowhere.

## Our tests ↔ use cases

| Test name | Use case(s) | What it proves |
|---|---|---|
| `attack_share_creation_requires_an_authenticated_user` | ? | The share-creation route contains an authentication guard; sharing a shopping list is not a goal in Gemini UC1–UC20. |
| `attack_share_creation_verifies_list_ownership` | ? | The route should verify shopping-list ownership; sharing is outside the top 20, and the test currently exposes a missing check. |
| `attack_share_creation_rejects_unbounded_expiry_days` | ? | Share-token expiry should be bounded; no Gemini use case specifies sharing or link lifetime. |
| `attack_transfer_verifies_each_shopping_item_belongs_to_the_user` | UC19 | Transferring purchased items must not accept another user's shopping item; the attack test exposes the authorization gap. |
| `attack_transfer_undo_verifies_each_shopping_item_belongs_to_the_user` | UC19 | Reversing a transfer must enforce ownership of each item; the attack test exposes the authorization gap. |
| `attack_transfer_rejects_zero_and_negative_quantities` | UC19 | The quantity adjustment allowed by UC19 extension 3a must not admit zero or negative amounts into inventory. |
| `attack_transfer_rejects_unknown_storage_locations` | UC19 | The storage assignment in UC19 step 3 accepts only pantry, fridge, and freezer. |
| `attack_shopping_item_update_rejects_negative_quantity` | UC18 | A shopping-list item cannot be updated to a negative quantity. |
| `attack_shopping_item_update_does_not_coerce_false_string_to_true` | UC18 | Toggling an item's purchased state must not interpret the string `"false"` as checked. |
| `attack_achievement_check_rejects_unknown_trigger_values` | ? | Achievement evaluation accepts only known trigger categories. Gemini mentions reward badges inside UC20's stakeholder interests but names no achievement use case, so this has no owner. |
| `attack_inventory_endpoint_rejects_an_unauthenticated_request` | UC11, UC12, UC13, UC14 | Inventory retrieval is guarded by authentication; this is the shared precondition ("the user is authenticated and accessing their inventory") of all four Gemini inventory use cases. |
| `attack_shared_list_lookup_requires_a_nonempty_token` | ? | Shared-list lookup should reject empty tokens; sharing has no Gemini use case. |
| `test_marks_past_inventory_as_expired` | UC12, UC14 | Expiry classification identifies already expired stock, feeding UC12's recalculated urgency and UC14's expiring-item analysis. |
| `test_marks_inventory_expiring_within_two_days_as_critical` | UC12, UC14 | Expiry classification treats near-term expiry as critical. |
| `test_marks_inventory_expiring_within_seven_days_as_warning` | UC12, UC14 | Expiry classification treats seven-day expiry as a warning. |
| `test_treats_missing_expiration_date_as_unknown` | UC11, UC12 | The optional expiration date of UC11 step 2 yields a defined unknown state rather than a false alert. |
| `test_excludes_already_expired_items_from_expiring_soon_list` | UC14 | The expiring-item identification in UC14 step 2 does not conflate expired and upcoming stock. |
| `test_sorts_items_without_expiration_dates_last` | ? | Inventory expiry sorting puts undated items last. Gemini has no inventory-review use case, so display ordering has no owner. |
| `test_flags_quantity_equal_to_minimum_as_low_stock` | ? | Stock at its configured minimum is considered low; low-stock alerting is absent from Gemini UC1–UC20. |
| `test_does_not_flag_stock_without_a_minimum` | ? | Missing minimum-stock metadata does not create a false alert; same design gap. |
| `test_counts_critical_and_low_items_in_low_stock_total` | ? | The inventory summary combines critical and low-stock items; same design gap. |
| `test_reports_recipe_ingredient_matches_and_missing_items` | UC14, UC3 | Inventory-based matching distinguishes available and missing ingredients, supporting UC14 step 4 and the inventory match scores of UC3. |
| `test_treats_a_recipe_without_ingredients_as_fully_matched` | UC14 | Matching handles an empty ingredient requirement deterministically. |
| `test_calculates_inventory_coverage_without_counting_unrelated_items` | UC14 | The coverage score of UC14 step 3 uses required ingredients only. |
| `test_uc1_rejects_duplicate_registration_email` | UC1 | Registration visibly handles an existing-email response, matching UC1 extension 3c (static contract). |
| `test_uc2_redirects_successful_sign_in_to_recipes` | UC2 | Successful authentication visibly routes the user into the application (static contract). |
| `test_uc3_reports_an_empty_recipe_search` | UC3 | Catalog search visibly provides an empty-result state (static contract). |
| `test_uc4_returns_not_found_for_an_unknown_recipe` | UC4 | Recipe lookup visibly returns no detail for an unknown ID (static contract). |
| `test_uc5_rejects_an_empty_recommendation_goal` | UC5 | AI meal recommendation visibly rejects a blank goal (static contract). |
| `test_uc6_requires_a_date_before_scheduling_a_meal` | UC6 | Calendar scheduling visibly requires a selected date (static contract). |
| `test_uc7_rejects_a_non_boolean_meal_status` | UC7 | Meal-completion update visibly validates Boolean status (static contract). |
| `test_uc8_reports_a_failed_nutrient_summary_request` | UC8 | Nutrient analytics visibly exposes a load failure (static contract). |
| `test_uc9_reports_a_failed_nutrient_goal_save` | UC9 | Daily-goal saving visibly exposes a failure (static contract). |
| `test_uc10_rejects_an_export_range_with_reversed_dates` | UC10 | Nutrient export visibly rejects an inverted date range (static contract). |
| `test_uc11_offers_retry_when_achievements_fail_to_load` | ? | Achievement loading visibly offers recovery after failure. Despite its name it does not map to Gemini UC11 (add inventory item); Gemini has no achievements use case at all (static contract). |
| `test_uc12_reports_a_failed_challenge_join` | UC20 | Joining a community challenge visibly reports a failed request (static contract). |
| `test_uc13_requires_authentication_to_view_inventory` | UC11, UC12, UC13, UC14 | Inventory access visibly requires a signed-in user, the shared precondition of the four inventory use cases (static contract). |
| `test_uc14_rejects_an_inventory_item_without_an_ingredient` | UC11 | Adding inventory visibly requires an ingredient, matching UC11 extension 2b (static contract). |
| `test_uc15_rejects_an_invalid_inventory_location` | UC12 | Updating an inventory item visibly rejects an unsupported storage location (static contract). |
| `test_uc16_rejects_an_empty_batch_delete` | UC13 | Batch deletion visibly rejects an empty selection (static contract). |
| `test_uc17_rejects_recipe_suggestions_for_empty_inventory` | UC14 | Suggestion generation visibly rejects an empty inventory, matching UC14 extension 1a (static contract). |
| `test_uc18_requires_a_shopping_list_name` | UC15 | List creation visibly prompts for a name ("Please enter a list name"), matching UC15 extension 2a as corrected. This test is what disproved the extension's original "provides a default name" alternative (static contract). |
| `test_uc19_rejects_generation_when_no_meals_exist` | UC16 | Calendar-driven generation visibly handles a range with no meals, matching UC16 extension 3a (static contract). |
| `test_uc20_rejects_transfer_of_another_users_shopping_item` | UC19 | The intended transfer contract requires item ownership; the check is currently absent. |
| `test_attack_rejects_meal_goal_larger_than_4096_characters` | UC5 | The backend rejects an oversized natural-language meal goal. |
| `test_attack_rejects_inventory_preference_larger_than_4096_characters` | UC14 | The backend rejects oversized inventory-suggestion preferences. |
| `test_attack_rejects_inventory_item_name_larger_than_512_characters` | UC14 | The backend bounds ingredient-name input. |
| `test_attack_rejects_zero_inventory_quantity` | UC14 | Suggestion generation rejects zero quantity. |
| `test_attack_rejects_negative_inventory_quantity` | UC14 | Suggestion generation rejects negative quantity. |
| `test_attack_prompt_delimits_untrusted_preferences_from_instructions` | UC14 | User preferences are delimited from model instructions in the suggestion prompt. |
| `test_attack_rejects_non_finite_inventory_quantity` | UC14 | Suggestion generation rejects non-finite numeric quantities. |
| `test_rejects_empty_personalization_goal` | UC5 | The request model rejects a blank recommendation goal. |
| `test_rejects_unsupported_meal_counts` | UC5 | AI meal recommendation enforces its supported meal-count range. |
| `test_rejects_empty_inventory_recommendation_request` | UC14 | The request model rejects suggestion with no inventory items. |
| `test_rejects_inventory_recipe_count_outside_supported_range` | UC14 | The suggestion count is bounded. |
| `test_rejects_inventory_item_without_a_name` | UC14 | Each inventory item supplied to suggestion generation requires a name. |
| `test_marks_expired_ingredients_for_recommendation_priority` | UC14 | The prompt prioritizes already expired ingredients explicitly, which is the waste-reduction interest of UC14. |
| `test_marks_ingredients_expiring_today_as_urgent` | UC14 | The prompt marks same-day expiry as urgent. |
| `test_ignores_invalid_expiration_text_without_dropping_item` | UC14 | Invalid expiry text does not silently remove an otherwise usable item. |
| `test_recommendation_prompt_includes_preferences_and_exact_count` | UC14 | The model prompt contains the user's preferences and requested result count. |
| `test_request_model_defaults_to_five_inventory_recipes` | UC14 | The suggestion request defaults to five recipes. |
| `test_request_model_rejects_more_than_ten_inventory_recipes` | UC14 | The request model rejects more than ten recipes. |
| `test_returns_structured_inventory_recommendations` | UC14 | A model response is returned as the structured recipe suggestions of UC14 step 4. |

## Orphans in both directions

### Use cases with no mapped test

| UC | Status | What is needed |
|---|---|---|
| UC17 Add recipe ingredients to shopping list | **No mapped test** | Nothing in `web/tests/p1a/` or `backend/tests/sihao/p1a/` touches `web/src/components/shopping/AddToCartButton.tsx`, `AddToShoppingListModal.tsx`, or `POST /api/shopping-lists/[id]/items`. The suite was written against a use-case list that did not name this goal, so no test was ever designed for it. Needs at least a contract test for the ingredient-selection dialog and a runtime test for appending a selected ingredient subset to a chosen list. |

The remaining nineteen use cases each have at least one mapped test, but that is not coverage. UC1–UC10, UC13, UC15, UC16, and UC20 rely wholly on static contract tests, which prove that a guard or failure branch is visible in source, not that the feature works at runtime. UC14 has by far the strongest behavioral coverage (nineteen runtime tests), followed by UC12 and UC19. UC19 has attack coverage but currently exposes authorization failures rather than confirming protection. Happy-path, actor-to-system execution is missing for all twenty use cases.

### Tests with no mapped use case

| Test | Mapping | What is needed |
|---|---|---|
| `attack_share_creation_requires_an_authenticated_user` | ? | Add a "Share shopping list" use case; it is a distinct actor goal and should not be folded into UC15 or UC18. |
| `attack_share_creation_verifies_list_ownership` | ? | The sharing use case must state owner authorization. |
| `attack_share_creation_rejects_unbounded_expiry_days` | ? | The sharing use case must specify link lifetime and invalid-expiry behavior. |
| `attack_shared_list_lookup_requires_a_nonempty_token` | ? | The sharing use case must define recipient access and invalid-token behavior. |
| `attack_achievement_check_rejects_unknown_trigger_values` | ? | Add a "Review achievements" use case. The feature is real (`web/src/app/dashboard/achievements/page.tsx`, `POST /api/achievements/check`), and Gemini's own session log shows it read that page and still omitted the goal. |
| `test_uc11_offers_retry_when_achievements_fail_to_load` | ? | Same omission, seen from the frontend. |
| `test_sorts_items_without_expiration_dates_last` | ? | Add an inventory-review use case, or state ordering and alerting guarantees inside UC11–UC14. |
| `test_flags_quantity_equal_to_minimum_as_low_stock` | ? | Same: low-stock alerting is real behavior with no Gemini goal. |
| `test_does_not_flag_stock_without_a_minimum` | ? | Same. |
| `test_counts_critical_and_low_items_in_low_stock_total` | ? | Same. |

Ten orphans in total. The four sharing orphans are genuine product-level design omissions: sharing a shopping list is a real feature with a real security surface and no use case at all. The two achievement orphans are a plain omission of a goal the product implements — `web/src/app/dashboard/achievements/page.tsx` exists and is reachable from the dashboard. The remaining four follow from folding inventory viewing into the add, update, delete, and suggest use cases. That folding is defensible as use-case design, but it has a measurable traceability cost: four tests of real, user-visible behavior lose their owner, because expiry ordering and low-stock alerting are properties of *reviewing* inventory, not of any single write operation.

## Project's original tests: coverage of UC1–UC20

This assessment excludes both P1a test directories and is keyed to Gemini's numbering. "Direct" means an original test imports and exercises the relevant component or route; it does not imply a real external-service or full-browser integration.

| UC | Original-test verdict | Evidence and blind spot |
|---|---|---|
| UC1 Register account | Direct, mocked | `signup.test.tsx` and `signup.action.ts` cover validation, duplicate email, and success; real Supabase account creation is not demonstrated. |
| UC2 Authenticate session | Direct, mocked | `signin.test.tsx`, `signin.action.ts`, `middleware.test.ts`, and `public-pages.spec.ts` cover form, action, and route protection; a real authenticated session is fixture-dependent. |
| UC3 Search recipe catalog | Direct | `searchbar.test.tsx`, `pagination.test.tsx`, `page.test.tsx`, and `use-recipe.test.tsx` cover search and browsing; production data-source integration remains mocked. |
| UC4 View recipe details | Direct | `util.test.ts` exercises `getRecipeDetail`, including an unknown ID; there is no isolated browser journey from catalog to a production-backed detail page. |
| UC5 Request AI meal recommendations | Direct | `backend/tests/test_recommender.py` and `ai-recommendations.spec.ts` cover recommendation behavior and UI; the model service is mocked or environment-dependent. |
| UC6 Schedule meal on calendar | Direct | `AddMealModal.test.tsx` and `eventsApi.test.ts` cover meal creation; no complete real-calendar journey. |
| UC7 Update meal completion status | Direct | `eventsIdApi.test.ts` plus nutrient/dashboard consumers cover status updates; cross-service persistence is mocked. |
| UC8 View nutrient analytics | Direct | `nutrients-page.test.tsx`, `PercentLineChart.test.tsx`, and `useNutrientDashboard.test.tsx` cover summaries and rendering; real stored meal history is not exercised end to end, and this suite emits React `act(...)` warnings. |
| UC9 Set daily nutrient goals | Direct | `GoalDialog.test.tsx` and `nutrientGoalsApi.test.ts` cover UI and API paths; real database persistence is mocked. |
| UC10 Export nutrient data report | Direct | `useNutrientExport.test.tsx` and `nutrientsExportApi.test.ts` cover export behavior; downloaded-file correctness in a real browser is not demonstrated. |
| UC11 Add inventory item | Direct | `inventory/AddInventoryModal.test.tsx`, `inventoryApi.test.ts` POST, `hooks/useInventory.test.ts`, and `inventory-management.spec.ts` cover creation; the merge-on-duplicate path of extension 2a is exercised, but hostile boundary inputs were largely absent before P1a. |
| UC12 Update inventory item | Direct | `inventory/EditInventoryModal.test.tsx`, `inventory/ExpirationBadge.test.tsx`, `utils/expiration.test.ts`, and `inventoryApi.test.ts` PUT cover updates and recalculated urgency; concurrency and cross-user ownership are not demonstrated, and the frontend/backend disagreement on zero quantity is not covered by any original assertion. |
| UC13 Delete inventory items in batch | Direct | `inventoryBatchDeleteApi.test.ts` and `inventory/BatchDeleteDialog.test.tsx` cover removal, including the confirmation step; partial-failure and transaction behavior are not covered. |
| UC14 Generate recipe suggestions from inventory | Direct and broad | `backend/tests/test_inventory_recommender.py`, `RecipeRecommendationModal.test.tsx`, `utils/recipeMatch.test.ts`, `hooks/useExpiringItems.test.ts`, and `ai-recommendations.spec.ts` cover suggestions; real LLM behavior and prompt attacks are not covered by the original suite. |
| UC15 Create shopping list | Direct | `shoppingListsApi.test.ts` POST and `shopping-list-lifecycle.spec.ts` cover creation, including an empty list; authorization boundaries were blind. |
| UC16 Auto-generate shopping list from meal calendar | Direct | `shoppingListsApi.test.ts` imports and tests the generate route; real meal-plan integration is mocked, and no original test covers the repeated-meal deduplication recorded against UC16's postcondition. |
| UC17 Add recipe ingredients to shopping list | **Indirect only** | No original test imports `AddToCartButton.tsx`, `AddToShoppingListModal.tsx`, or the `[id]/items` route. The nearest evidence is `RecipeRecommendationModal.test.tsx`, which asserts that an `onAddToShoppingList` callback fires with the expected ingredient names from the *recommendation* modal; the callback's implementation is not exercised. This is the weakest use case in the whole matrix: neither the original suite nor ours reaches the route that performs the addition. |
| UC18 Manage shopping list items | Partial, weaker than it appears | `shoppingListsApi.test.ts` covers list-level GET/PUT/DELETE and reads nested `shopping_list_items` from a mocked JOIN, and `shopping-list-lifecycle.spec.ts` has a "displays progress when items are checked" case. The item-level routes (`[id]/items` and `[id]/items/[itemId]`) are imported by no original test. `SmartCartWidget.test.tsx` and `smartCartWidgetApi.test.ts` cover the dashboard widget, not item management. |
| UC19 Transfer purchased items to inventory | Direct and broad | `inventoryTransferApi.test.ts`, `TransferFlow.test.tsx`, `hooks/useTransferToInventory.test.tsx`, and `transfer-flow.spec.ts` cover review, transfer, and undo; original tests do not verify ownership of each supplied item ID. |
| UC20 Join community challenge | Direct | `challengesApi.test.ts` (including the join route), `ChallengeCard.test.tsx`, `challengeReset.test.ts`, and `gamificationIntegration.test.ts` cover challenge operations; multi-user and real-time behavior are not demonstrated. |

### Two original suites that assert nothing about the product

`__tests__/unit/smart-cart-e2e.test.ts` and `__tests__/node/smartCartComprehensive.test.ts` are named as if they were the deepest shopping and inventory coverage in the repository. They import no application code. Their cases construct literal objects and then assert on those same literals — `list.items.push(item); expect(list.items.length).toBe(1)` in the first, and tautologies such as `const critical = "critical"; expect(critical).toBe("critical")` in the second. They pass unconditionally and would keep passing if every shopping and inventory route were deleted.

This matters for traceability, not just for style. Read by filename, these two files look like evidence for UC11–UC19; read by assertion, they are evidence for nothing. Any coverage claim about the smart-cart workflow that rests on them is unsupported, which is part of why UC17 and UC18 above are rated far lower than a file listing would suggest.

### Verdict on the original suite

Nineteen of Gemini's twenty use cases have at least one identifiable original test surface. The exception is UC17, which has only an indirect callback assertion. Coverage is uneven: nutrition, gamification, inventory writes, and the transfer flow have many component and API tests; shopping-list *item* operations and recipe-detail navigation are thin, and two prominent smart-cart suites contribute nothing.

The main blind spots are:

1. **Authorization and object ownership.** Original transfer tests authenticate the caller but do not prove that every referenced list or item belongs to that caller. P1a attacks expose this gap in UC19 and in the out-of-scope sharing feature.
2. **Hostile input boundaries.** Negative, zero, and non-finite quantities, unbounded strings, invalid locations, and string-to-Boolean coercion were not systematically covered.
3. **LLM prompt and cost abuse.** Original recommender tests mock model calls but do not bound user-controlled prompt material or test prompt delimiting.
4. **Real integrations.** Supabase, Gemini, notification delivery, and the Playwright journeys are mocked, skipped when unavailable, or dependent on fixtures; passing tests do not prove production services work together. The original backend suite additionally does not collect without `GEMINI_KEY`, because the Gemini client is constructed at import time.
5. **Tests that cannot fail.** The two smart-cart suites above pass regardless of application behavior.
6. **Design omissions.** Share links, achievements (`achievementsApi.test.ts`, `AchievementToast.test.tsx`), low-stock alerting (`hooks/useLowStockItems.test.ts`, `utils/lowStock.test.ts`, `inventory/LowStockBanner.test.tsx`), push notifications, logout, and UI primitives have original tests but no goal in Gemini UC1–UC20. They are evidence that the use-case set needs revision, not coverage of an existing UC.

## Evidence inspected

- Design baseline: `p1a/use-cases/p1a_gemini/use-cases.md`, with its verification table and post-verification corrections; derivation method in `p1a/prompts/gemini/response.md`
- Own frontend tests: `web/tests/p1a/security-attack-cases.test.ts`, `inventory-behavior.test.ts`, `use-case-contracts.test.ts`
- Own backend tests: `backend/tests/sihao/p1a/test_adversarial_inputs.py`, `test_recommender_behavior.py`
- Original backend tests: `backend/tests/test_recommender.py`, `test_inventory_recommender.py`
- Original frontend tests: `web/__tests__/jsdom/`, `web/__tests__/node/`, `web/__tests__/unit/`, and `web/e2e/`
- Source read to settle UC17 and UC18 coverage: `web/src/components/shopping/AddToCartButton.tsx`, `AddToShoppingListModal.tsx`, `web/src/app/api/shopping-lists/[id]/items/route.ts`, `web/src/app/api/shopping-lists/[id]/items/[itemId]/route.ts`
- Execution results for these same tests are recorded in `p1a/traceability/final-traceability.md` and the raw logs under `p1a/evidence/own-tests/`
