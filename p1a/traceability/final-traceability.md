# P1a Final Test Traceability (Human-Verified)

## Verification basis

This is the corrected D4 artifact. The original Codex response is preserved unchanged at `p1a/prompts/codex/P05-response.md`. Results below were checked against:

- `p1a/evidence/own-tests/2026-08-29-web-p1a-all-with-security-raw.txt`: **44 executed, 33 PASS, 11 FAIL**.
- `p1a/evidence/own-tests/2026-08-29-backend-p1a-all-with-security-raw.txt`: **25 executed, 18 PASS, 7 FAIL**.
- Parameterization explains why 63 distinct functions produced 69 executions.

`Static contract` means executable inspection of a visible source guard; it does not execute the route. `Runtime` executes application functions/models, usually with external services mocked. A FAIL proves the expected protection was absent at the tested layer, not necessarily exploitable against deployed Supabase RLS.

## Our tests ↔ use cases

| Test | UC | Type | Result | Evidence / interpretation |
|---|---|---|---|---|
| `attack_share_creation_requires_an_authenticated_user` | ? | Static contract | **FAIL** | No explicit application-layer authentication guard; Supabase RLS was not evaluated. |
| `attack_share_creation_verifies_list_ownership` | ? | Static contract | **FAIL** | No ownership query before share creation; possible IDOR subject to RLS verification. |
| `attack_share_creation_rejects_unbounded_expiry_days` | ? | Static contract | **FAIL** | `expiryDays` reaches date arithmetic without a bounded positive-integer check. |
| `attack_transfer_verifies_each_shopping_item_belongs_to_the_user` | UC20 | Static contract | **FAIL** | Checked-item update is filtered by item ID, not authenticated ownership. |
| `attack_transfer_undo_verifies_each_shopping_item_belongs_to_the_user` | UC20 | Static contract | **FAIL** | Undo unchecks by item ID without a visible ownership constraint. |
| `attack_transfer_rejects_zero_and_negative_quantities` | UC20 | Static contract | **FAIL** | Negative quantity is accepted and zero is changed to one by `quantity || 1`. |
| `attack_transfer_rejects_unknown_storage_locations` | UC20 | Static contract | **FAIL** | A TypeScript cast supplies no runtime location validation. |
| `attack_shopping_item_update_rejects_negative_quantity` | UC18 | Static contract | **FAIL** | `Number(quantity) || 1` accepts a negative quantity. |
| `attack_shopping_item_update_does_not_coerce_false_string_to_true` | UC18 | Static contract | **FAIL** | `Boolean("false")` becomes true and changes purchase state. |
| `attack_achievement_check_rejects_unknown_trigger_values` | UC11 | Static contract | **FAIL** | Only trigger presence is checked; arbitrary trigger values are accepted. |
| `attack_inventory_endpoint_rejects_an_unauthenticated_request` | UC13 | Static contract | **PASS** | An explicit authentication guard and 401 response are present. |
| `attack_shared_list_lookup_requires_a_nonempty_token` | ? | Static contract | **PASS** | Missing share token is explicitly rejected; token entropy/expiry was not tested. |
| `test_marks_past_inventory_as_expired` | UC13 | Runtime | **PASS** | A past expiry date is classified as expired. |
| `test_marks_inventory_expiring_within_two_days_as_critical` | UC13 | Runtime | **PASS** | An item expiring within two days is critical. |
| `test_marks_inventory_expiring_within_seven_days_as_warning` | UC13 | Runtime | **PASS** | An item expiring within seven days is a warning. |
| `test_treats_missing_expiration_date_as_unknown` | UC13 | Runtime | **PASS** | Missing expiry produces an unknown state. |
| `test_excludes_already_expired_items_from_expiring_soon_list` | UC13 | Runtime | **PASS** | Expired stock is excluded from the future expiring-soon list. |
| `test_sorts_items_without_expiration_dates_last` | UC13 | Runtime | **PASS** | Undated inventory sorts after dated items. |
| `test_flags_quantity_equal_to_minimum_as_low_stock` | UC13 | Runtime | **PASS** | Quantity equal to the configured minimum is low stock. |
| `test_does_not_flag_stock_without_a_minimum` | UC13 | Runtime | **PASS** | Missing minimum metadata does not create a false low-stock alert. |
| `test_counts_critical_and_low_items_in_low_stock_total` | UC13 | Runtime | **PASS** | The summary count combines critical and low items correctly. |
| `test_reports_recipe_ingredient_matches_and_missing_items` | UC17 | Runtime | **PASS** | Matching reports available and missing ingredients and the correct percentage. |
| `test_treats_a_recipe_without_ingredients_as_fully_matched` | UC17 | Runtime | **PASS** | An empty ingredient requirement has defined 100% behavior. |
| `test_calculates_inventory_coverage_without_counting_unrelated_items` | UC17 | Runtime | **PASS** | Coverage counts only ingredients required by the recipe. |
| `test_uc1_rejects_duplicate_registration_email` | UC1 | Static contract | **PASS** | Expected duplicate-email statement exists; registration was not executed. |
| `test_uc2_redirects_successful_sign_in_to_recipes` | UC2 | Static contract | **PASS** | Expected successful-login redirect exists; sign-in was not executed. |
| `test_uc3_reports_an_empty_recipe_search` | UC3 | Static contract | **PASS** | Expected no-results message exists; browsing was not executed. |
| `test_uc4_returns_not_found_for_an_unknown_recipe` | UC4 | Static contract | **PASS** | Expected unknown-ID handling exists; detail navigation was not executed. |
| `test_uc5_rejects_an_empty_recommendation_goal` | UC5 | Static contract | **PASS** | Expected blank-goal rejection exists; endpoint behavior was not executed. |
| `test_uc6_requires_a_date_before_scheduling_a_meal` | UC6 | Static contract | **PASS** | Expected missing-date guard exists; scheduling was not executed. |
| `test_uc7_rejects_a_non_boolean_meal_status` | UC7 | Static contract | **PASS** | Expected Boolean validation exists; status update was not executed. |
| `test_uc8_reports_a_failed_nutrient_summary_request` | UC8 | Static contract | **PASS** | Expected load-error branch exists; nutrient retrieval was not executed. |
| `test_uc9_reports_a_failed_nutrient_goal_save` | UC9 | Static contract | **PASS** | Expected save-error branch exists; goal persistence was not executed. |
| `test_uc10_rejects_an_export_range_with_reversed_dates` | UC10 | Static contract | **PASS** | Expected inverted-range guard exists; export was not executed. |
| `test_uc11_offers_retry_when_achievements_fail_to_load` | UC11 | Static contract | **PASS** | Error and Retry statements exist; achievement loading was not executed. |
| `test_uc12_reports_a_failed_challenge_join` | UC12 | Static contract | **PASS** | Expected join-error handling exists; challenge joining was not executed. |
| `test_uc13_requires_authentication_to_view_inventory` | UC13 | Static contract | **PASS** | Expected 401 guard exists; route execution was not performed by this test. |
| `test_uc14_rejects_an_inventory_item_without_an_ingredient` | UC14 | Static contract | **PASS** | Expected ingredient requirement exists; creation was not executed. |
| `test_uc15_rejects_an_invalid_inventory_location` | UC15 | Static contract | **PASS** | Expected closed location set exists; editing was not executed. |
| `test_uc16_rejects_an_empty_batch_delete` | UC16 | Static contract | **PASS** | Expected empty-selection guard exists; deletion was not executed. |
| `test_uc17_rejects_recipe_suggestions_for_empty_inventory` | UC17 | Static contract | **PASS** | Expected empty-inventory rejection exists; route was not executed. |
| `test_uc18_requires_a_shopping_list_name` | UC18 | Static contract | **PASS** | Expected blank-name guard exists; list creation was not executed. |
| `test_uc19_rejects_generation_when_no_meals_exist` | UC19 | Static contract | **PASS** | Expected no-meals branch exists; generation was not executed. |
| `test_uc20_rejects_transfer_of_another_users_shopping_item` | UC20 | Static contract | **FAIL** | Update is scoped only by item ID; expected ownership statement is absent. |
| `test_attack_rejects_meal_goal_larger_than_4096_characters` | UC5 | Runtime | **FAIL** | Pydantic accepts the oversized goal; no maximum length is enforced. |
| `test_attack_rejects_inventory_preference_larger_than_4096_characters` | UC17 | Runtime | **FAIL** | Pydantic accepts oversized preferences before prompt construction. |
| `test_attack_rejects_inventory_item_name_larger_than_512_characters` | UC17 | Runtime | **FAIL** | Pydantic accepts the oversized ingredient name. |
| `test_attack_rejects_zero_inventory_quantity` | UC17 | Runtime | **FAIL** | Pydantic accepts quantity `0`; no positive lower bound is enforced. |
| `test_attack_rejects_negative_inventory_quantity` | UC17 | Runtime | **FAIL** | Pydantic accepts negative inventory quantity. |
| `test_attack_prompt_delimits_untrusted_preferences_from_instructions` | UC17 | Runtime | **FAIL** | Injection-like preference text is interpolated directly without an explicit untrusted-data boundary. |
| `test_attack_rejects_non_finite_inventory_quantity` | UC17 | Runtime | **FAIL** | Pydantic accepts infinity; finite-number validation is absent. |
| `test_rejects_empty_personalization_goal` | UC5 | Runtime | **PASS** | The endpoint returns HTTP 400 for a blank goal. |
| `test_rejects_unsupported_meal_counts` | UC5 | Runtime, parameterized | **PASS** | Unsupported meal counts return HTTP 400. |
| `test_rejects_empty_inventory_recommendation_request` | UC17 | Runtime | **PASS** | Empty inventory returns HTTP 400. |
| `test_rejects_inventory_recipe_count_outside_supported_range` | UC17 | Runtime, parameterized | **PASS** | Counts outside 1–10 fail validation. |
| `test_rejects_inventory_item_without_a_name` | UC17 | Runtime | **PASS** | Missing item name fails request validation. |
| `test_marks_expired_ingredients_for_recommendation_priority` | UC17 | Runtime | **PASS** | Generated prompt labels expired ingredients. |
| `test_marks_ingredients_expiring_today_as_urgent` | UC17 | Runtime | **PASS** | Generated prompt marks same-day expiry as urgent. |
| `test_ignores_invalid_expiration_text_without_dropping_item` | UC17 | Runtime | **PASS** | Malformed optional expiry is omitted while the item remains. |
| `test_recommendation_prompt_includes_preferences_and_exact_count` | UC17 | Runtime | **PASS** | Prompt contains the supplied preference, exact count, and JSON constraint. |
| `test_request_model_defaults_to_five_inventory_recipes` | UC17 | Runtime | **PASS** | Request model defaults to five results. |
| `test_request_model_rejects_more_than_ten_inventory_recipes` | UC17 | Runtime | **PASS** | Request model rejects a count above ten. |
| `test_returns_structured_inventory_recommendations` | UC17 | Runtime, mocked model | **PASS** | Endpoint parses mocked model output into structured recommendations. |

## Orphans in both directions

### Use cases with no mapped test

None: every UC1–UC20 has at least one mapped function. This is not complete behavioral coverage. UC1–UC12 and UC14–UC20 rely partly or wholly on source-contract checks; the major remaining gap is happy-path actor-to-system runtime/E2E coverage.

### Tests with no mapped use case

| Test | Status | Interpretation / evidence needed |
|---|---|---|
| `attack_share_creation_requires_an_authenticated_user` | ? | Add a distinct **Share shopping list** use case; do not silently fold this separate actor goal into UC18. |
| `attack_share_creation_verifies_list_ownership` | ? | The sharing use case must state owner authorization. |
| `attack_share_creation_rejects_unbounded_expiry_days` | ? | The sharing use case must state link lifetime and invalid-expiry behavior. |
| `attack_shared_list_lookup_requires_a_nonempty_token` | ? | The sharing use case must state recipient access and invalid-token behavior. |

These tests are valuable evidence that the current top-20 design may omit a real user goal. Reconcile this with Claude and Gemini before replacing a weaker use case.

## Project's original tests: execution and coverage

### Actual baseline runs

| Suite | Command | Actual result | Raw evidence |
|---|---|---|---|
| Original Web Jest (P1a excluded) | `npm test -- --runInBand --testPathIgnorePatterns='/tests/p1a/'` | **PASS**: 70 suites passed, 1 skipped; 1095 tests passed, 1 skipped | `p1a/evidence/baseline/original-web-tests-raw.txt` |
| Original Backend Pytest | `uv run pytest tests/test_recommender.py tests/test_inventory_recommender.py -q` | **BLOCKED during collection**: missing `GEMINI_KEY`; Gemini client is created at import time | `p1a/evidence/baseline/original-backend-tests-raw.txt` |
| Original browser E2E | Not run in this baseline | **NOT RUN** | Requires a running application and configured test account/services. |

The Web PASS proves the mocked/unit/component/API assertions ran locally. It does not prove Supabase, Gemini, notifications, or the Playwright user journeys work against real services.

### Per-use-case verdict

| UC | Verdict | Original evidence that actually ran | Remaining blind spot |
|---|---|---|---|
| UC1 | Partial – mocked component/action | Signup component and action suites passed. | No real Supabase registration. |
| UC2 | Partial – mocked component/action | Sign-in, action, and middleware suites passed. | No real authenticated-session E2E. |
| UC3 | Partial – unit/component | Recipe page, search, pagination, and hook suites passed. | Production recipe data and browser journey unverified. |
| UC4 | Partial – unit-level | `getRecipeDetail` utility tests passed. | No complete browse-to-detail user flow. |
| UC5 | Partial – Web/model mocked; backend blocked | AI recommendation UI passed; original backend recommender did not collect without a key. | Real Gemini output and backend behavior unverified in this run. |
| UC6 | Partial – component/API | Add-meal and events API suites passed. | Real calendar persistence/E2E unverified. |
| UC7 | Partial – API/hook | Event update and nutrient consumer tests passed. | Cross-service completion persistence unverified. |
| UC8 | Partial – component/hook | Nutrient page/chart/dashboard suites passed. | Real stored meal history unverified; React `act(...)` warnings occurred. |
| UC9 | Partial – component/API | Goal dialog and nutrient-goal API suites passed. | Real database persistence unverified. |
| UC10 | Partial – hook/API | Nutrient export hook/API suites passed. | Real browser download/content unverified. |
| UC11 | Partial – component/API | Achievement API/toast/gamification suites passed. | Production persistence/concurrent awards unverified. |
| UC12 | Partial – component/API | Challenge card/API/reset/integration suites passed. | Multi-user and real-time behavior unverified. |
| UC13 | Partial but broad – component/API/unit | Inventory page, hooks, API, expiry, and low-stock suites passed. | Real database authorization/E2E unverified. |
| UC14 | Partial – component/API | Add modal and inventory API suites passed. | Hostile boundary values and real persistence unverified. |
| UC15 | Partial – component/API | Edit modal and inventory API suites passed. | Concurrency and cross-user ownership unverified. |
| UC16 | Partial – component/API | Batch-delete dialog/API suites passed. | Partial failure and transaction semantics unverified. |
| UC17 | Partial but broad – Web unit/component; backend blocked | Recommendation modal and recipe-matching suites passed. | Original backend suite did not collect; real LLM and prompt attacks unverified. |
| UC18 | Partial but broad – component/API/unit | Shopping-list API, smart-cart, and widgets passed. | Ownership boundaries and Boolean type confusion unverified. |
| UC19 | Partial – API-level | `shoppingListsApi.test.ts` generate-route assertions passed. | Real meal-plan/database integration unverified. |
| UC20 | Partial but broad – component/API/unit | Transfer API/hook/component suites passed. | Per-item ownership is not enforced by visible application code; browser E2E not run. |

## Original-suite blind spots

1. **Authorization and ownership:** authentication mocks do not prove each supplied list/item belongs to the caller.
2. **Hostile boundaries:** negative, zero, non-finite, oversized, invalid-enum, and wrong-type values were not systematic.
3. **LLM prompt/cost abuse:** model calls are mocked; prompt injection and input amplification were absent.
4. **Real integrations:** Web tests passed with mocks, original Backend collection requires `GEMINI_KEY`, and Playwright E2E was not run.
5. **Design omissions:** sharing, push notifications, logout, and UI infrastructure have tests but no goal in UC1–UC20.

## D5 caught-error record

Codex originally described several failing adversarial tests as if the intended protections were present. The team caught this by comparing the generated traceability prose against the raw Jest/Pytest outputs. Examples include unauthenticated share creation, unknown achievement triggers, zero/non-finite quantities, and prompt delimiting. The original response remains preserved; this file corrects each claim using explicit test type, result, and observed evidence.
