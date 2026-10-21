# Project 2 — checkpoint summary

**Maintained by:** Wenbo Li · **Last verified:** 2026-10-16 · **Checkpoint SHA:** `4a68e5329dc25af5035809a943ef9f639df47fdf` (`se26f-p2`)

Every row was checked against the repository, the merged PRs and the CI runs on the date above. A
figure with no run behind it says so rather than appearing as a result.

## 1. Status by milestone

| Milestone | Owner | Status | Merged PR | Evidence to open |
|---|---|---|---|---|
| **M0** — contract, CI, offline evaluation | Wenbo | **Done**, with two scoped gaps below | [#20](https://github.com/Amihua/Epicourier-Web/pull/20) → `8d61430` | `python3 p2/eval/run_eval.py`; `m0-results` artifact on any `se26f-p2` run |
| **M0a** — evaluation wired to the real scorer | Wenbo | **In review** | [#25](https://github.com/Amihua/Epicourier-Web/pull/25) | same command; the `scorer-vs-hand-computed` line |
| **M1** — deterministic scoring | Sihao | **Done** | [#23](https://github.com/Amihua/Epicourier-Web/pull/23) → `bacf4fa`, [#24](https://github.com/Amihua/Epicourier-Web/pull/24) → `4cdaf6b` | `backend/api/receipt_scorer.py`, `receipt_models.py`, `target_math.py`; `backend/tests/p2/` |
| **M2** — receipt panel and corrections | Feiyang | **Done** | [#22](https://github.com/Amihua/Epicourier-Web/pull/22) → `4a68e53` | `web/src/components/receipt/`, `web/src/hooks/useReceiptRanking.ts`, `web/__tests__/jsdom/p2/` |
| **M3** — pantry delta, preview and confirm | Andy | **Done** | [#21](https://github.com/Amihua/Epicourier-Web/pull/21) → `25ae44c` | `web/src/app/api/receipt-shopping/{preview,confirm}/route.ts`, `web/src/lib/receipt-shopping/`, `web/__tests__/node/p2/` |

Two migrations landed with M3: `20261012000000_receipt_shopping_delta.sql` and
`20261012000100_nutrient_goals_confirmed_at.sql`.

## 2. CI on the integration branch

All four jobs green on `se26f-p2` at the checkpoint SHA.

| Job | Workflow | What it gates |
|---|---|---|
| 🧾 M0 Receipt Evaluation | `ci-m0-eval.yml` | contract JSON well-formed; M0 passes; the corrupted case is still rejected |
| 🐍 Backend CI — Pytest | `ci-pytest.yml` | `backend/tests/p2`, no `continue-on-error` |
| 🐍 Backend CI — lint | `ci-pytest.yml` | Ruff |
| Run Jest Tests | `ci-jest.yml` | `next typegen` → `tsc --noEmit` → Jest → coverage |

Before this project none of these ran on the integration branch: the backend workflow triggered only
on PRs targeting `main` and ran no tests at all, and the web workflow's push trigger was `main` only.

## 3. The M0 result worth showing

The expectations in `p2/eval/cases/hand-computed.json` were written from the contract **before any
scorer existed**. The scorer was then written independently against the same contract. They agree on
every value:

| | hand-computed | scorer |
|---|---|---|
| recipe 101 | 3.0 — inventory 2.0 / expiry 1.0 / nutrition 0.0 | identical |
| recipe 102 | 1.0 — inventory 1.0 / expiry 0.0 / nutrition 0.0 | identical |
| recipe 103 | 0.0, empty receipt | identical |

All 15 receipt lines match on `required_qty`, `available_qty`, `status` and `points`, including the
four cases a scorer gets wrong quietly: a requirement of `0` that stays `0`, a row expiring exactly
on `as_of_date` that is still usable, an expired row at zero available, and a null stored unit left
unresolved rather than compared.

**The suite can fail, and this was tested rather than assumed.** `p2/eval/cases/corrupted.json`
carries four planted defects and is rejected on every run; CI asserts that rejection in its own step.
Editing a hand-computed value to 7.5 and flipping one status produced two precise failures naming the
recipe, ingredient and field.

M0 also caught a defect in the contract before any scorer existed: `status` was conflating *is this
inventory row usable* with *was this requirement met*, which came apart on an expired row for an
ingredient the recipe requires `0` of. Resolved in the contract, not by loosening the check.

## 4. Numbers that are not collected

Stated here so no one copies them out of an earlier document as results.

| Figure | Status |
|---|---|
| `0/300` — returned scores that decompose into line items | **Definitional and verified.** `RecommendedRecipe` in `backend/api/inventory_recommender.py` has `match_score` and a free-text `reason` and no per-ingredient field, so nothing can decompose. Verified by reading the schema; no calls needed. Denominator: 30 calls / 100 cells / up to 300 returned objects. |
| `X` — cross-repeat variance of the old recommender | **NOT COLLECTED.** Needs 30 live model calls that have not been made. Not estimated, not inherited. |
| 500-cell determinism corpus | **Not built.** The golden fixture is 3 recipes × 5 inventory rows. Scaling to 50 × 10 is the next M0 task. |

## 5. Known limitations

| Limitation | Why it is open |
|---|---|
| The pytest job is scoped to `backend/tests/p2` | `api/recommender.py:121` runs `client = load_gemini_client()` at import, so `tests/test_recommender.py`, `tests/test_inventory_recommender.py` and `tests/sihao/` fail at collection without a key. A CI step attempts full-suite collection every run and uploads the log, so the claim is re-proved rather than asserted. The fix is that one line made lazy. |
| The `lint` job keeps three `continue-on-error` flags | Removing them blind would red-light every PR if the tree has Ruff violations. Needs one measured run first. |
| `npm ci` cannot install the committed lock file | Missing `@swc/core` platform binaries under npm 11+. CI uses `npm install`. |
| `user_inventory` is absent from the generated `web/src/types/supabase.ts` | The generated types are stale; inventory types in the contract are hand-written from the migration. |
| No end-to-end run against a real database is recorded here | M3's tests cover the logic and the migration puts idempotency in the database — `request_id` is a `PRIMARY KEY`, `preview_id` is `UNIQUE`, and the function takes a row lock on the preview. A real round trip is a separate claim and is not made. |

## 6. What each of us opens at the checkpoint

| Milestone | Speaker | Open this |
|---|---|---|
| M0 | Wenbo | `python3 p2/eval/run_eval.py` live; the corrupted case; the `m0-results` artifact |
| M1 | Sihao | the rule version, the same input twice, the tie rule, the order-perturbation and boundary tests |
| M2 | Feiyang | a receipt expanded, an inventory item corrected and re-ranked, persistence across a refresh, narrow screen |
| M3 | Andy | the 500 − 200 = 300 example, cancel writing nothing, confirm writing, a replayed `request_id` applying once, permission failure |

## 7. Open decisions

**D1 and D2 still need four-way sign-off**, recorded in `p2/contracts/receipt-v1.md` §2. The code
currently implements both proposals:

- **D1** — `Recipe` has no `servings` column; a caller-supplied multiplier defaulting to 1 scales
  requirements only.
- **D2** — `user_inventory.unit` is nullable; a null unit is `unresolved_unit` rather than a fallback
  to `Ingredient.unit`.

Both are implemented and tested. Signing them off is recording the decision, not changing the code.
