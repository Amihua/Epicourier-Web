# Golden fixture cases

Every case here exists because it is a place a scorer can be wrong while still
looking right. `as_of_date` is `2026-10-10` in all of them, per contract §9.

## `ranking-request.golden.json`

| Entity | What it pins down |
|---|---|
| requirement `ingredient_id: 13`, `quantity: 0` | **Zero is zero.** The existing `nutrients/daily/route.ts:171` writes `(relative_unit_100 \|\| 100) / 100`, which turns this into a requirement for 100 g. A scorer that reproduces that bug fails here. |
| requirement `ingredient_id: 14`, `quantity: null` | Unknown requirement. Must produce `status: "unknown_requirement"`, not a default and not a zero. |
| inventory row `…0003` (ingredient 13), expires `2026-10-09` | Expired the day before `as_of_date`. `available_qty` must be `0` and `status: "expired"`. It may not count toward coverage. |
| inventory row `…0005` (ingredient 11), expires `2026-10-10` | **Boundary: expires exactly on `as_of_date`.** Still usable — the contract says *strictly* before. A scorer using `<=` fails here and nowhere else. |
| inventory rows `…0001` + `…0005`, both ingredient 11, different locations | The unique constraint is per `(user, ingredient, location)`, so one ingredient legitimately appears twice. Usable total is 200 + 150 = 350 g against a 500 g requirement, so recipe 101 is short 150 g — not short 300 g, and not satisfied. |
| inventory row `…0004`, `unit: null` | Open decision D2. Under the proposal this is `unresolved_unit`, and the 1 L requirement of recipe 102 is **not** satisfied by the 2 units on hand. |
| candidate `102`, `servings: 2` | Open decision D1. Requirements scale to 200 g and 2 L; nutrient targets would not scale if they were present. |
| candidate `103`, empty `requirements` | A recipe that requires nothing. Must produce a defined score and an empty receipt rather than a crash or a `null`. |
| `targets: null` | No confirmed targets. The nutrition subtotal must be present and explicable, not omitted. |

## Hand-computed expectations

These are worked by hand, not by the scorer, so that M0 has an independent
reference. Coverage below means usable quantity against requirement; point
values are left to the scoring rules and are checked separately.

| Recipe | Ingredient | Required | Usable | Expected line status |
|---|---|---|---|---|
| 101 | 11 | 500 g | 350 g (200 fridge + 150 freezer, both unexpired) | `missing` |
| 101 | 12 | 200 g | 300 g (no expiry) | `ok` |
| 101 | 13 | 0 g | 0 g (only row expired) | `ok` — requirement is zero and is met trivially |
| 101 | 14 | unknown | 0 g | `unknown_requirement` |
| 102 | 11 | 200 g (100 × 2 servings) | 350 g | `ok` |
| 102 | 15 | 2 L (1 × 2 servings) | unresolved — stored unit is null | `unresolved_unit` |
| 103 | — | — | — | empty receipt |

## Order perturbation

M0 shuffles the `inventory` array 20 times and requires an identical response
each time, including the order of `results` and of `items`. The two rows for
ingredient 11 make this meaningful: a scorer that takes "the first matching row"
instead of summing gives 200 or 150 depending on the shuffle.
