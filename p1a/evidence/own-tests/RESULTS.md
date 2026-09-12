# D3 Own-Test Results — 2026-08-29

## Execution summary

| Suite | Tests defined | Command | What happened |
|---|---:|---|---|
| Web P1a | 32 | `cd web && npm test -- --config tests/p1a/jest.config.ts --runInBand` | **31 PASS, 1 FAIL** — UC20 ownership contract failed (`exit 1`). |
| Backend P1a | 18 cases (12 functions, including parameterized cases) | `cd backend && uv run pytest tests/sihao/p1a -q` | **18 PASS**, with one third-party Pydantic deprecation warning (`exit 0`). |
| Backend syntax check | 1 test module | `cd backend && python3 -m py_compile tests/sihao/p1a/test_recommender_behavior.py` | **PASS** — no syntax error. This does not prove runtime behavior. |

The initial blocked logs are retained as setup evidence. After dependencies were installed under `/mnt/data1/sliu78`, both suites executed. No product code was changed.

## Results table

| Test | Why we tried it | Expected | What happened |
|---|---|---|---|
| `test_marks_past_inventory_as_expired` | UC13 requires truthful expiry status. | Past date classified `expired`. | **PASS**. |
| `test_marks_inventory_expiring_within_two_days_as_critical` | UC13 uses urgent expiry status. | Date within two days classified `critical`. | **PASS**. |
| `test_marks_inventory_expiring_within_seven_days_as_warning` | UC13 uses warning expiry status. | Date within seven days classified `warning`. | **PASS**. |
| `test_treats_missing_expiration_date_as_unknown` | UC13 permits items with no expiry. | Unknown status and readable label. | **PASS**. |
| `test_excludes_already_expired_items_from_expiring_soon_list` | UC13 distinguishes expired from expiring. | Only future in-range item returned. | **PASS**. |
| `test_sorts_items_without_expiration_dates_last` | UC13 presents urgent items first. | Dated items precede undated items. | **PASS**. |
| `test_flags_quantity_equal_to_minimum_as_low_stock` | UC13 exposes low-stock state. | Threshold equality is low stock. | **PASS**. |
| `test_does_not_flag_stock_without_a_minimum` | UC13 allows no threshold. | Status is unknown, not low. | **PASS**. |
| `test_counts_critical_and_low_items_in_low_stock_total` | UC13 summary must match item states. | Counts and total equal fixture data. | **PASS**. |
| `test_reports_recipe_ingredient_matches_and_missing_items` | UC3/UC17 show inventory fit. | One of two ingredients produces 50% with correct lists. | **PASS**. |
| `test_treats_a_recipe_without_ingredients_as_fully_matched` | UC3 needs defined empty-recipe behavior. | Empty requirement is 100% match. | **PASS**. |
| `test_calculates_inventory_coverage_without_counting_unrelated_items` | UC17 recommendations depend on real overlap. | Coverage is one third. | **PASS**. |
| `test_uc1_rejects_duplicate_registration_email` | UC1 extension requires duplicate detection. | Duplicate-email branch remains present. | **PASS**. |
| `test_uc2_redirects_successful_sign_in_to_recipes` | UC2 postcondition is recipe dashboard access. | Successful login redirects to recipes. | **PASS**. |
| `test_uc3_reports_an_empty_recipe_search` | UC3 extension defines no-result feedback. | Empty-state message remains present. | **PASS**. |
| `test_uc4_returns_not_found_for_an_unknown_recipe` | UC4 must handle unknown recipe IDs. | Missing recipe invokes not-found handling. | **PASS**. |
| `test_uc5_rejects_an_empty_recommendation_goal` | UC5 requires a stated goal. | Empty-goal message remains present. | **PASS**. |
| `test_uc6_requires_a_date_before_scheduling_a_meal` | UC6 cannot schedule without a date. | Missing-date message remains present. | **PASS**. |
| `test_uc7_rejects_a_non_boolean_meal_status` | UC7 status must be completed/not completed. | Non-Boolean status rejected. | **PASS**. |
| `test_uc8_reports_a_failed_nutrient_summary_request` | UC8 must expose unavailable data. | Fetch-failure handling remains present. | **PASS**. |
| `test_uc9_reports_a_failed_nutrient_goal_save` | UC9 must not claim an unsaved goal succeeded. | Save failure remains visible. | **PASS**. |
| `test_uc10_rejects_an_export_range_with_reversed_dates` | UC10 requires a coherent interval. | Reversed dates rejected. | **PASS**. |
| `test_uc11_offers_retry_when_achievements_fail_to_load` | UC11 needs recovery from loading failure. | Error and Retry remain present. | **PASS**. |
| `test_uc12_reports_a_failed_challenge_join` | UC12 must expose join failure. | Failure message remains present. | **PASS**. |
| `test_uc13_requires_authentication_to_view_inventory` | UC13 inventory is private. | Unauthenticated request returns 401. | **PASS**. |
| `test_uc14_rejects_an_inventory_item_without_an_ingredient` | UC14 requires a catalog ingredient. | Missing ingredient rejected. | **PASS**. |
| `test_uc15_rejects_an_invalid_inventory_location` | UC15 supports a closed location set. | Unknown location rejected. | **PASS**. |
| `test_uc16_rejects_an_empty_batch_delete` | UC16 must not issue an empty delete. | Empty identifier array rejected. | **PASS**. |
| `test_uc17_rejects_recipe_suggestions_for_empty_inventory` | UC17 has no basis without inventory. | Empty inventory rejected visibly. | **PASS**. |
| `test_uc18_requires_a_shopping_list_name` | UC18 requires an identifiable list. | Blank name rejected. | **PASS**. |
| `test_uc19_rejects_generation_when_no_meals_exist` | UC19 depends on scheduled meals. | No-meal range rejected. | **PASS**. |
| `test_uc20_rejects_transfer_of_another_users_shopping_item` | UC20 must not mutate another user’s list item. | Checked-item update is scoped to authenticated ownership. | **FAIL** — the shopping-item update is scoped only by item ID, not authenticated ownership; this is a real authorization gap. |
| `test_rejects_empty_personalization_goal` | UC5 requires meaningful recommendation input. | HTTP 400 with goal error. | **PASS**. |
| `test_rejects_unsupported_meal_counts` | UC5 only offers 3, 5, or 7 meals. | Each unsupported count returns HTTP 400. | **PASS**. |
| `test_rejects_empty_inventory_recommendation_request` | UC17 needs inventory input. | HTTP 400 with empty-inventory error. | **PASS**. |
| `test_rejects_inventory_recipe_count_outside_supported_range` | UC17 supports 1–10 results. | Counts 0 and 11 return validation error. | **PASS**. |
| `test_rejects_inventory_item_without_a_name` | UC17 prompt requires ingredient identity. | Missing name returns validation error. | **PASS**. |
| `test_marks_expired_ingredients_for_recommendation_priority` | UC17 must distinguish unsafe expired stock. | Prompt text marks item expired. | **PASS**. |
| `test_marks_ingredients_expiring_today_as_urgent` | UC17 prioritizes immediate expiry. | Prompt text marks “EXPIRING NOW.” | **PASS**. |
| `test_ignores_invalid_expiration_text_without_dropping_item` | UC17 tolerates malformed optional expiry. | Item remains, invalid expiry annotation omitted. | **PASS**. |
| `test_recommendation_prompt_includes_preferences_and_exact_count` | UC17 must preserve constraints sent to AI. | Prompt includes preference, exact count, and JSON rule. | **PASS**. |
| `test_request_model_defaults_to_five_inventory_recipes` | UC17 UI requests five by default. | Request model defaults to five. | **PASS**. |
| `test_request_model_rejects_more_than_ten_inventory_recipes` | UC17 enforces the documented upper bound. | Model validation raises an error. | **PASS**. |
| `test_returns_structured_inventory_recommendations` | UC17 UI needs structured recommendations. | Endpoint returns recipe and shopping suggestions. | **PASS**. |

## Reproduction commands

Run the suites from the repository root:

```bash
cd web
npm test -- --config tests/p1a/jest.config.ts --runInBand

cd ../backend
uv run pytest tests/sihao/p1a -q
```

The recorded reruns are preserved at `p1a/evidence/own-tests/2026-08-29-web-p1a-rerun-raw.txt` and `p1a/evidence/own-tests/2026-08-29-backend-p1a-rerun-raw.txt`. The Web rerun produced 31 PASS and 1 FAIL; the Backend rerun produced 18 PASS.
