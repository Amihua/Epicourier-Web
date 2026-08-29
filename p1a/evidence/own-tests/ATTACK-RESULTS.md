# P1a Adversarial Test Results — 2026-08-29

## Scope and interpretation

These tests ran locally and made no requests to a real Supabase instance, Gemini, or another external target. Web tests are executable source-level security contracts: a failure proves the required guard is absent from the inspected operation, but does not by itself prove exploitation against a deployed database because Supabase row-level security may add another layer. Backend tests instantiate the actual Pydantic request models and prompt builder, so their accepted inputs are directly confirmed behavior.

## Summary

| Suite | Result | Interpretation |
|---|---|---|
| Web security contracts | **2 PASS, 10 FAIL** | Two visible guards exist; ten expected authorization or validation guards are absent. |
| Backend malicious inputs | **0 PASS, 7 FAIL** | All seven adversarial values were accepted or embedded without the expected safety boundary. |

## Results table

| Test | Why we tried it | Expected | What happened |
|---|---|---|---|
| `attack_share_creation_requires_an_authenticated_user` | Unauthenticated user creates a share token for an arbitrary shopping-list ID. | Authenticate caller and return 401 otherwise. | **FAIL** — share POST constructs an anonymous Supabase client and performs no user check. **High candidate**: unauthorized share creation, subject to database RLS verification. |
| `attack_share_creation_verifies_list_ownership` | Authenticated or anonymous caller supplies another user’s shopping-list ID to share POST. | Verify list ownership before inserting the share. | **FAIL** — no ownership query is present. **High candidate / IDOR**: disclosure link for another user’s list, subject to RLS. |
| `attack_share_creation_rejects_unbounded_expiry_days` | Caller submits negative, huge, or nonnumeric `expiryDays`. | Enforce a small positive integer range. | **FAIL** — value is passed directly into date arithmetic. Medium: malformed or effectively permanent links and resource abuse. |
| `attack_transfer_verifies_each_shopping_item_belongs_to_the_user` | Caller transfers another user’s shopping item by guessed ID. | Verify each shopping item belongs to the authenticated user before mutation. | **FAIL** — checked update is filtered only by shopping-item ID. **High candidate / IDOR**: cross-user state mutation, subject to RLS. |
| `attack_transfer_undo_verifies_each_shopping_item_belongs_to_the_user` | Caller undoes another user’s shopping transfer by guessed ID. | Verify ownership before unchecking. | **FAIL** — uncheck is filtered only by item ID. **High candidate / IDOR**, plus inconsistent inventory/list state. |
| `attack_transfer_rejects_zero_and_negative_quantities` | Transfer includes zero or negative quantity. | Reject non-positive values. | **FAIL** — `item.quantity \|\| 1` accepts negative values and converts zero to one. Medium: inventory corruption. |
| `attack_transfer_rejects_unknown_storage_locations` | Transfer supplies an unknown storage location. | Allow only pantry/fridge/freezer/other. | **FAIL** — TypeScript cast supplies no runtime validation. Medium: invalid persisted state or database errors. |
| `attack_shopping_item_update_rejects_negative_quantity` | Shopping-item update supplies negative quantity. | Return 400. | **FAIL** — `Number(quantity) \|\| 1` accepts negative numbers. Medium: invalid shopping data. |
| `attack_shopping_item_update_does_not_coerce_false_string_to_true` | Shopping-item update sends string `"false"`. | Reject wrong type or preserve false. | **FAIL** — `Boolean("false")` evaluates to true. Medium: type-confusion changes purchase state. |
| `attack_achievement_check_rejects_unknown_trigger_values` | Achievement check sends an arbitrary trigger value. | Enforce documented trigger allowlist. | **FAIL** — only presence is checked. Low/Medium: inaccurate audit/progress metadata. |
| `attack_inventory_endpoint_rejects_an_unauthenticated_request` | Unauthenticated user reads inventory. | Return 401. | **PASS** — explicit authentication guard exists. Guard present. |
| `attack_shared_list_lookup_requires_a_nonempty_token` | Shared-list lookup omits its token. | Return 400. | **PASS** — missing token is rejected. Guard present; token entropy/expiry not exercised. |
| `test_attack_rejects_meal_goal_larger_than_4096_characters` | Meal goal exceeds 4096 characters. | Reject before AI processing. | **FAIL** — request model accepts it. Medium: cost/resource amplification. |
| `test_attack_rejects_inventory_preference_larger_than_4096_characters` | Inventory preferences exceed 4096 characters. | Reject before prompt construction. | **FAIL** — request model accepts it. Medium: cost/resource amplification. |
| `test_attack_rejects_inventory_item_name_larger_than_512_characters` | Ingredient name exceeds 512 characters. | Reject malformed catalog input. | **FAIL** — model accepts it. Low/Medium: prompt and logging amplification. |
| `test_attack_rejects_zero_or_negative_inventory_quantity` | Inventory quantity is zero or negative. | Require a finite positive value. | **FAIL** — both are accepted. Medium: invalid recommendation inputs. |
| `test_attack_rejects_non_finite_inventory_quantity` | Inventory quantity is infinity. | Require a finite value. | **FAIL** — infinity is accepted. Medium: invalid serialization/calculation behavior. |
| `test_attack_prompt_delimits_untrusted_preferences_from_instructions` | Preferences contain “Ignore previous instructions”. | Delimit untrusted data and explicitly deny instruction authority. | **FAIL** — text is interpolated directly into the model prompt. Medium candidate: prompt injection; no live-model exploit was attempted. |

## Raw evidence

- `2026-08-29-web-security-raw.txt`: complete Jest output, 10 failed and 2 passed.
- `2026-08-29-backend-security-raw.txt`: complete Pytest output, 7 failed.

## Recommended next verification (report-only for P1a)

1. Inspect Supabase RLS policies for `shopping_list_shares` and `shopping_list_items` to determine whether A1/A2/A4/A5 are exploitable or blocked at the database layer.
2. Exercise the four authorization cases against an isolated local Supabase seed with two test users; never use production data.
3. Run the prompt-injection case against a mocked deterministic model/evaluator, or record it as a code-level exposure rather than claiming successful exfiltration.
4. Do not patch these findings during Project 1a; map each to UC18/UC20 and preserve failing output in the report/video.
