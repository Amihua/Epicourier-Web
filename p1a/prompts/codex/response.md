# P1a Codex Test-to-Use-Case Traceability

## Scope and rules

- Design baseline: the 20 use cases in `p1a/use-cases/p1a_codex/use-cases.md`.
- "Our tests" means tests under `web/tests/p1a/` and `backend/tests/sihao/p1a/`.
- Each distinct test function is one row. Parameterized executions are grouped under their function name.
- A mapping is made only when the assertion or inspected source contract directly supports the use case. `?` means that the behavior is outside the current top 20 or the relationship is not established.
- The contract suite checks visible source contracts without importing the Next.js runtime. It is useful evidence, but it is weaker than a runtime or end-to-end test.

## Our tests ↔ use cases

| Test name | Use case(s) | What it proves |
|---|---|---|
| `attack_share_creation_requires_an_authenticated_user` | ? | The share-creation route contains an authentication guard; sharing is not represented by UC1–UC20. |
| `attack_share_creation_verifies_list_ownership` | ? | The route should verify shopping-list ownership; sharing is outside the top 20, and the test currently exposes a missing check. |
| `attack_share_creation_rejects_unbounded_expiry_days` | ? | Share-token expiry should be bounded; no current use case specifies sharing or expiry. |
| `attack_transfer_verifies_each_shopping_item_belongs_to_the_user` | UC20 | Transferring purchases must not accept another user's shopping item; the attack test exposes the authorization gap. |
| `attack_transfer_undo_verifies_each_shopping_item_belongs_to_the_user` | UC20 | Undoing a stock transfer must enforce ownership; the attack test exposes the authorization gap. |
| `attack_transfer_rejects_zero_and_negative_quantities` | UC20 | Purchased items with non-positive quantities must not be stocked. |
| `attack_transfer_rejects_unknown_storage_locations` | UC20 | Transfer accepts only supported inventory locations. |
| `attack_shopping_item_update_rejects_negative_quantity` | UC18 | A shopping-list item cannot be updated to a negative quantity. |
| `attack_shopping_item_update_does_not_coerce_false_string_to_true` | UC18 | The API must not interpret the string `"false"` as a checked Boolean. |
| `attack_achievement_check_rejects_unknown_trigger_values` | UC11 | Achievement evaluation accepts only known trigger categories. |
| `attack_inventory_endpoint_rejects_an_unauthenticated_request` | UC13 | Inventory viewing is guarded by authentication. |
| `attack_shared_list_lookup_requires_a_nonempty_token` | ? | Shared-list lookup should reject empty tokens; sharing has no top-20 use case. |
| `test_marks_past_inventory_as_expired` | UC13 | Inventory status identifies already expired stock. |
| `test_marks_inventory_expiring_within_two_days_as_critical` | UC13 | Inventory status classifies near-term expiry as critical. |
| `test_marks_inventory_expiring_within_seven_days_as_warning` | UC13 | Inventory status classifies seven-day expiry as a warning. |
| `test_treats_missing_expiration_date_as_unknown` | UC13 | Inventory can represent an item whose expiry is unknown. |
| `test_excludes_already_expired_items_from_expiring_soon_list` | UC13 | The expiring-soon view does not conflate expired and upcoming stock. |
| `test_sorts_items_without_expiration_dates_last` | UC13 | Inventory expiry sorting puts undated items last. |
| `test_flags_quantity_equal_to_minimum_as_low_stock` | UC13 | Stock at its configured minimum is considered low. |
| `test_does_not_flag_stock_without_a_minimum` | UC13 | Missing minimum-stock metadata does not create a false alert. |
| `test_counts_critical_and_low_items_in_low_stock_total` | UC13 | The inventory summary combines critical and low-stock items. |
| `test_reports_recipe_ingredient_matches_and_missing_items` | UC17 | Inventory-based matching distinguishes available and missing ingredients. |
| `test_treats_a_recipe_without_ingredients_as_fully_matched` | UC17 | Matching handles an empty ingredient requirement deterministically. |
| `test_calculates_inventory_coverage_without_counting_unrelated_items` | UC17 | Suggested-recipe coverage uses required ingredients only. |
| `test_uc1_rejects_duplicate_registration_email` | UC1 | Registration visibly handles an existing-email response (static contract). |
| `test_uc2_redirects_successful_sign_in_to_recipes` | UC2 | Successful sign-in visibly routes the user to recipes (static contract). |
| `test_uc3_reports_an_empty_recipe_search` | UC3 | Recipe browsing visibly provides an empty-search result (static contract). |
| `test_uc4_returns_not_found_for_an_unknown_recipe` | UC4 | Recipe lookup visibly returns no detail for an unknown ID (static contract). |
| `test_uc5_rejects_an_empty_recommendation_goal` | UC5 | Personalized planning visibly rejects a blank goal (static contract). |
| `test_uc6_requires_a_date_before_scheduling_a_meal` | UC6 | Meal scheduling visibly requires a selected date (static contract). |
| `test_uc7_rejects_a_non_boolean_meal_status` | UC7 | Meal-completion update visibly validates Boolean status (static contract). |
| `test_uc8_reports_a_failed_nutrient_summary_request` | UC8 | Nutrient progress visibly exposes a load failure (static contract). |
| `test_uc9_reports_a_failed_nutrient_goal_save` | UC9 | Nutrient-goal saving visibly exposes a failure (static contract). |
| `test_uc10_rejects_an_export_range_with_reversed_dates` | UC10 | Nutrient export visibly rejects an inverted date range (static contract). |
| `test_uc11_offers_retry_when_achievements_fail_to_load` | UC11 | Achievement loading visibly offers recovery after failure (static contract). |
| `test_uc12_reports_a_failed_challenge_join` | UC12 | Challenge joining visibly reports a failed request (static contract). |
| `test_uc13_requires_authentication_to_view_inventory` | UC13 | Inventory access visibly requires a signed-in user (static contract). |
| `test_uc14_rejects_an_inventory_item_without_an_ingredient` | UC14 | Adding inventory visibly requires an ingredient (static contract). |
| `test_uc15_rejects_an_invalid_inventory_location` | UC15 | Inventory editing visibly rejects an unsupported location (static contract). |
| `test_uc16_rejects_an_empty_batch_delete` | UC16 | Batch removal visibly rejects an empty selection (static contract). |
| `test_uc17_rejects_recipe_suggestions_for_empty_inventory` | UC17 | Inventory recommendations visibly reject an empty inventory (static contract). |
| `test_uc18_requires_a_shopping_list_name` | UC18 | Shopping-list creation visibly requires a name (static contract). |
| `test_uc19_rejects_generation_when_no_meals_exist` | UC19 | Meal-plan generation visibly handles a range with no meals (static contract). |
| `test_uc20_rejects_transfer_of_another_users_shopping_item` | UC20 | The intended transfer contract requires item ownership; the check is currently absent. |
| `test_attack_rejects_meal_goal_larger_than_4096_characters` | UC5 | The backend rejects an oversized meal-planning goal. |
| `test_attack_rejects_inventory_preference_larger_than_4096_characters` | UC17 | The backend rejects oversized inventory recommendation preferences. |
| `test_attack_rejects_inventory_item_name_larger_than_512_characters` | UC17 | The backend bounds ingredient-name input. |
| `test_attack_rejects_zero_inventory_quantity` | UC17 | Inventory recommendations reject zero quantity. |
| `test_attack_rejects_negative_inventory_quantity` | UC17 | Inventory recommendations reject negative quantity. |
| `test_attack_prompt_delimits_untrusted_preferences_from_instructions` | UC17 | User preferences are delimited from model instructions in the recommendation prompt. |
| `test_attack_rejects_non_finite_inventory_quantity` | UC17 | Inventory recommendations reject non-finite numeric quantities. |
| `test_rejects_empty_personalization_goal` | UC5 | The request model rejects a blank personalized-planning goal. |
| `test_rejects_unsupported_meal_counts` | UC5 | Personalized planning enforces its supported meal-count range. |
| `test_rejects_empty_inventory_recommendation_request` | UC17 | The request model rejects recommendation with no inventory items. |
| `test_rejects_inventory_recipe_count_outside_supported_range` | UC17 | Inventory recommendation count is bounded. |
| `test_rejects_inventory_item_without_a_name` | UC17 | Each inventory item supplied to recommendations requires a name. |
| `test_marks_expired_ingredients_for_recommendation_priority` | UC17 | The prompt prioritizes already expired ingredients explicitly. |
| `test_marks_ingredients_expiring_today_as_urgent` | UC17 | The prompt marks same-day expiry as urgent. |
| `test_ignores_invalid_expiration_text_without_dropping_item` | UC17 | Invalid expiry text does not silently remove an otherwise usable item. |
| `test_recommendation_prompt_includes_preferences_and_exact_count` | UC17 | The model prompt contains the user's preferences and requested result count. |
| `test_request_model_defaults_to_five_inventory_recipes` | UC17 | The recommendation request defaults to five recipes. |
| `test_request_model_rejects_more_than_ten_inventory_recipes` | UC17 | The request model rejects more than ten recipes. |
| `test_returns_structured_inventory_recommendations` | UC17 | A model response is returned as structured recipe recommendations. |

## Orphans in both directions

### Use cases with no mapped test

None. Every UC1–UC20 has at least one mapped Codex test.

This does **not** mean complete coverage. UC1–UC12 and UC14–UC20 each rely partly or wholly on static contract tests in `use-case-contracts.test.ts`; those tests prove that a guard or failure branch is visible in source, not that the whole feature works at runtime. The principal real gap is happy-path, actor-to-system execution for all 20 use cases. UC13 and UC17 have the strongest new behavioral coverage; UC20 has attack coverage but currently exposes authorization failures.

### Tests with no mapped use case

| Test | Mapping | What is needed |
|---|---|---|
| `attack_share_creation_requires_an_authenticated_user` | ? | Add a "Share shopping list" use case, or explicitly extend UC18 with sharing. |
| `attack_share_creation_verifies_list_ownership` | ? | Same: the top-20 design currently omits the share actor and authorization rules. |
| `attack_share_creation_rejects_unbounded_expiry_days` | ? | A sharing use case must specify token lifetime/expiry behavior. |
| `attack_shared_list_lookup_requires_a_nonempty_token` | ? | A sharing use case must define recipient access and invalid-token behavior. |

These are not useless tests. They expose a user-visible feature and security surface omitted by the current design; they are traceability orphans until the use-case set is revised.

## Project's original tests: coverage of UC1–UC20

This assessment excludes both P1a test directories. "Direct" means an original test exercises the relevant component/API behavior; it does not imply a real external-service or full-browser integration.

| UC | Original-test verdict | Evidence and blind spot |
|---|---|---|
| UC1 Register account | Direct, mocked | `signup.test.tsx` and `signup.action.ts` cover validation, errors, and success; real Supabase account creation is not demonstrated. |
| UC2 Sign in | Direct, mocked | `signin.test.tsx`, `signin.action.ts`, middleware, and public-page E2E cover form/action/navigation; a real authenticated session is fixture-dependent. |
| UC3 Browse recipes | Direct | Recipe page/search/pagination and `use-recipe.test.tsx` cover browsing behavior; production data-source integration remains mocked. |
| UC4 View recipe details | Direct | `util.test.ts` exercises `getRecipeDetail`, including unknown ID; there is no clearly isolated full browser journey from browsing to a production-backed detail page. |
| UC5 Request a personalized meal plan | Direct | `backend/tests/test_recommender.py` and `ai-recommendations.spec.ts` cover recommendation behavior/UI; the model service is mocked or environment-dependent. |
| UC6 Schedule a meal | Direct | `AddMealModal.test.tsx` and events API tests cover meal creation; no evidence of a complete real-calendar journey. |
| UC7 Track meal completion | Direct | Event-ID and nutrient/dashboard tests cover updating and consuming meal status; cross-service persistence is mocked. |
| UC8 Review nutrient progress | Direct | Nutrient page, chart, and dashboard-hook tests cover summaries and rendering; real stored meal history is not exercised end to end. |
| UC9 Set nutrient goals | Direct | `GoalDialog.test.tsx` and `nutrientGoalsApi.test.ts` cover UI/API paths; real database persistence is mocked. |
| UC10 Export nutrient history | Direct | `useNutrientExport.test.tsx` and `nutrientsExportApi.test.ts` cover export behavior; downloaded-file correctness in a real browser is not clearly demonstrated. |
| UC11 Review achievements | Direct | Achievement API/toast and gamification tests cover award/display logic; production persistence and concurrent awards are not demonstrated. |
| UC12 Join a wellness challenge | Direct | Challenge card/API/reset/integration tests cover challenge operations; multi-user and real-time behavior are not demonstrated. |
| UC13 Review inventory | Direct and broad | Inventory page/hooks/status utilities and inventory E2E cover viewing; backend authorization is mostly mocked. |
| UC14 Add inventory item | Direct | Add modal, inventory API, and inventory E2E cover creation; hostile boundary inputs were largely absent before P1a. |
| UC15 Edit inventory item | Direct | Edit modal and inventory API tests cover updates; concurrency and cross-user ownership are not demonstrated. |
| UC16 Remove inventory items | Direct | Batch-delete dialog/API and inventory E2E cover removal; partial-failure/transaction behavior is not clearly covered. |
| UC17 Get inventory-based recipe suggestions | Direct and broad | Inventory recommender, recommendation modal, recipe matching, and AI E2E cover suggestions; real LLM behavior and prompt attacks are not covered by the original suite. |
| UC18 Create shopping list | Direct and broad | Shopping-list API, smart-cart, lifecycle, and integration tests cover list/item operations; authorization boundaries and Boolean type confusion were blind. |
| UC19 Generate shopping list from meal plan | Direct | `shoppingListsApi.test.ts` imports and tests the generate route; real meal-plan/database integration is mocked. |
| UC20 Complete shopping and stock inventory | Direct and broad | Transfer API/hook/component and transfer E2E cover check-off, transfer, and undo; original tests do not verify ownership of each supplied item ID. |

### Verdict on the original suite

The original suite has at least one identifiable test surface for every UC1–UC20, so there is no top-20 use case that is completely absent by file/assertion inspection. Coverage is uneven: inventory, shopping, nutrition, and gamification have many component/API tests; recipe-detail navigation and several end-to-end success flows are thinner.

The main blind spots are:

1. **Authorization and object ownership.** Original transfer/share tests authenticate the caller but do not prove that every referenced list/item belongs to that caller. P1a attacks expose this gap in UC20 and the out-of-scope sharing feature.
2. **Hostile input boundaries.** Negative/zero/non-finite quantities, unbounded strings, invalid locations, and string-to-Boolean coercion were not systematically covered.
3. **LLM prompt and cost abuse.** Original recommender tests mock model calls but do not bound user-controlled prompt material or test prompt-delimiting behavior.
4. **Real integrations.** Supabase, Gemini, notification delivery, and several browser workflows are mocked, skipped when unavailable, or dependent on fixtures; passing tests do not prove production services work together.
5. **Design omissions.** Share links, push notifications, logout, layout/UI primitives, and some smart-cart actions have original tests but no UC among UC1–UC20. They are evidence that the use-case model may need revision, not coverage of an unrelated UC.

## Evidence inspected

- Own frontend tests: `web/tests/p1a/security-attack-cases.test.ts`, `inventory-behavior.test.ts`, `use-case-contracts.test.ts`
- Own backend tests: `backend/tests/sihao/p1a/test_adversarial_inputs.py`, `test_recommender_behavior.py`
- Original backend tests: `backend/tests/test_recommender.py`, `test_inventory_recommender.py`
- Original frontend tests: `web/__tests__/jsdom/`, `web/__tests__/node/`, `web/__tests__/unit/`, and `web/e2e/`

