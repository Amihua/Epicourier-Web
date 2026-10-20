# M0 — the hypothesis this evaluation is testing

**Owner:** Wenbo Li · **Rule version:** `receipt-v1` · **Stated:** 2026-10-16

The checkpoint asks for a measurable hypothesis with a metric, a threshold and a baseline, and for a
runnable eval in the repository wired to CI. This is that statement. The eval is
`p2/eval/run_eval.py`; CI runs it on every push to `se26f-p2` in `.github/workflows/ci-m0-eval.yml`.

## The risk being killed

The number the product shows today is written by a language model and cannot be reproduced or
checked. `RecommendedRecipe` returns a `match_score` and a free-text `reason`, and no line of our code
recomputes either. A user who disagrees with a recommendation has nothing to inspect, and we have no
way to tell whether a change to the ranking made it better or merely different.

The project's claim is that the ranking can be made **reproducible and auditable** without giving up
the model's explanation. M0 exists to find out whether that claim survives contact with the real
data, early, while there is still time to re-plan.

## H1 — every displayed total is the sum of its displayed parts

> **Metric.** The fraction of scored receipts where `sum(items[].points)` equals `rank_score`
> exactly, after the contract's rounding.
>
> **Threshold.** **500 / 500 = 100%.** Zero tolerance. A receipt that does not add up is not a
> receipt; one failure falsifies the claim rather than lowering a score.
>
> **Baseline.** **0 / 300.** No score the old recommender returns can decompose at all, because
> `RecommendedRecipe` has no field that could carry a per-ingredient contribution. Derived from the
> model class by `p2/baseline/run_baseline.py --check-schema-only`, not asserted.

## H2 — identical input produces identical output

> **Metric.** The fraction of sampled cells whose `rank_score` and receipt lines are unchanged when
> the inventory array is shuffled, over 20 shuffles each.
>
> **Threshold.** **100% of sampled cells, 20/20 shuffles.** Any order dependence falsifies it.
>
> **Baseline.** `X`, the old recommender's cross-repeat variance on identical input. **NOT
> COLLECTED** — it needs 30 live model calls that have not been made. The comparison is therefore
> one-sided today: we can show the new path is stable, and we cannot yet quantify how unstable the
> old one is. Stated rather than filled with an estimate.

## H3 — a correction moves the score in the direction the rules say

> **Metric.** The number of correction cases whose observed effect matches the direction predicted
> from the contract before running: covering a shortfall, expiring a covered ingredient, resolving a
> missing unit, and relocating stock between locations.
>
> **Threshold.** **4 / 4.** The fourth, relocation, must produce *no* change; a scorer that moves the
> score when nothing usable changed fails as surely as one that ignores a real edit.
>
> **Baseline.** Not applicable. The old path has no correction loop to compare against.

## What a failure means

The checkpoint rules say a failed M0 triggers a spiral review rather than a grade penalty. If any
threshold is missed, the procedure is: report the number as measured, hold the review, and record the
decision — persevere, re-plan, or descope — in an issue. Do not adjust the threshold to fit the
result.

## Why these thresholds are not free

Each one is falsifiable by a specific mistake that a reasonable implementation makes:

| Threshold | The mistake it catches |
|---|---|
| H1 at 100% | rounding each line instead of once at the end; adding a display clamp that is not a line |
| H2 at 100% | reading "the first matching inventory row" rather than summing across locations, which the unique constraint on `(user, ingredient, location)` makes a real case |
| H3 relocation case | grouping the receipt by inventory row instead of by ingredient |

The corpus is built to contain all three situations: 450 of its 500 cells carry an already-expired
row, 450 carry a row expiring exactly on `as_of_date`, and one ingredient is deliberately split
across locations.

## Evidence to open at the checkpoint

```bash
python3 p2/eval/run_eval.py                     # the measurement, with metrics against thresholds
python3 p2/eval/run_eval.py --case corrupted    # the harness rejecting a planted defect
python3 p2/baseline/run_baseline.py --check-schema-only   # the H1 baseline, derived
```

CI artifact `m0-results` on any `se26f-p2` run carries the same output.
