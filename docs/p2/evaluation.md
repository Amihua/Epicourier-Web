# M0 evaluation, CI, and reproduction

**Owner:** Wenbo Li · **Written:** 2026-10-10 · **Rule version:** `receipt-v1`

What is measured, what is only asserted, and what has not been collected at all. The distinction is
the point of this file: a number with no run behind it is marked as such rather than inherited from
the P1b report.

## Running M0

```bash
python3 p2/eval/run_eval.py
```

No key, no network, no package install. Exits 0 only if every case reached its declared outcome.
Last local run on 2026-10-10 against commit `4d2ec21`:

```
ok    corrupted: rejected as required, 6 violation(s), all 4 planted defects found
ok    hand-computed: 3 receipts, no violations
ok    shuffle-invariance: 20 inventory orderings produced identical usable quantities
PASS
```

In CI this is `.github/workflows/ci-m0-eval.yml`, on pushes to `se26f-p2` and PRs targeting it, with
the results uploaded as the `m0-results` artifact.

## Why the harness has a case that must fail

`p2/eval/cases/corrupted.json` carries four planted defects and the harness is required to reject
it. Without that, a green M0 is consistent with a harness that checks nothing. The CI job asserts the
rejection in its own step, so the proof fails loudly rather than hiding in a summary line.

The harness has already earned this: it rejected the **hand-computed** case, and it was right. See
§"What M0 caught before any scorer existed" below.

## The baseline numbers, and their actual status

The P1b report carries baseline figures. They are evidence to be checked, not results to copy, and
they divide into two kinds.

### `0/300` — definitional, and verified here

The claim is that none of the scores the current recommender returns decompose into line items.
Confirmed today by reading the schema rather than by making any call:

`backend/api/inventory_recommender.py` defines

```python
class RecommendedRecipe(BaseModel):
    recipe_id: int
    recipe_name: str
    match_score: int  # 0-100
    ingredients_available: List[str]
    ingredients_missing: List[str]
    expiring_ingredients_used: List[str]
    reason: str
```

There is no per-ingredient contribution field anywhere in the response model; `reason` is free text
the model writes. So the figure is **true by construction and needs no live calls**: 0 of the up to
300 returned scores can be decomposed, because the schema has nowhere to put the decomposition.

Denominator, since three different numbers were in circulation during P1b: the archive would be
**30 calls / 100 (pantry, rank-position) cells / up to 300 returned recommendation objects**.

### `X`, the cross-repeat variance — **NOT COLLECTED**

The real baseline measurement is the fraction of (pantry, rank-position) cells whose `recipe_id` or
`match_score` changes across repeats of the same input. That requires **30 live `gemini-2.5-flash`
calls**, and those calls have not been made.

**Status: not collected.** Not estimated, not inherited, not approximated from the P1b prose. Any
poster, report or checkpoint line that needs this number must leave it blank or say "not collected"
until the calls are archived.

Blockers on collecting it, both real today:

- The backend cannot be imported without a key at all — see the next section.
- The Antigravity CLI account used in P1b hit its individual quota; a separate path to the model
  would be needed.

When it is collected, archive all 30 raw JSON bodies, and record the commit SHA, date, data version
and exact command alongside the figure.

## The offline blocker that shapes all of this

```python
# backend/api/recommender.py:121
client = load_gemini_client()
```

That runs at **module import**, so importing `api.recommender` constructs a Gemini client. Everything
downstream inherits it: `api/inventory_recommender.py` imports from it, and therefore
`tests/test_recommender.py`, `tests/test_inventory_recommender.py` and everything under
`tests/sihao/` fail at **collection** in a keyless runner.

Consequences, all visible in the repository rather than argued:

| Consequence | Where |
|---|---|
| The pytest CI job is scoped to `backend/tests/p2` | `.github/workflows/ci-pytest.yml` |
| M0 is a separate dependency-free workflow | `.github/workflows/ci-m0-eval.yml` |
| The CI records a full-suite collection attempt as an artifact | `full-collect.log` |

That last one is deliberate: it proves the claim on every run instead of asserting it here. If
collection ever starts succeeding offline, the log contradicts this section and this section is what
gets fixed.

**The fix is one line made lazy** — `client` resolved at call time rather than import time — and it
is in the backend owner's file, so it is filed rather than done here.

## What M0 caught before any scorer existed

The hand-computed expectation for recipe 101, ingredient 13 said `status: "ok"`: the row had expired,
but the recipe requires `0` of that ingredient, so nothing was missing. The harness rejected it,
because the contract says an expired row is `"expired"`.

Both readings were defensible, which was the real defect: `status` was conflating *is this inventory
row usable* with *was this requirement met*. Resolved in the contract — §5 now states that `status`
describes the row, and that satisfaction is read from `required_qty` against `available_qty` — rather
than by loosening the check.

Worth keeping for D5: the evaluation caught the human. That is the entire argument for not generating
expected values from the code under test.

## How the Ruff state was measured without installing anything

`uv` is not installed on the maintainer's machine, which is why this was open for
several days. It did not need to be: the `lint` job already runs Ruff on every push, and
`continue-on-error` suppresses the *result*, not the *output*. Reading the job log gives
the real answer, including the exact reformatting diff per file:

```
gh run view <run-id> --log | grep -E 'ruff|would be reformatted'
```

Worth remembering generally — a suppressed check still reports, and the log is the
measurement.

## Known gaps, stated rather than left to be discovered

| Gap | Why it is still open |
|---|---|
| The `lint` job in `ci-pytest.yml` keeps **three `continue-on-error` flags** | **Measured, 2026-10-16.** The flags are not hypothetical cover: `ruff check` is clean, but `ruff format --check` reports *"4 files would be reformatted, 24 files already formatted"*, and `continue-on-error` is what turns that into a green job. The four are `api/enhanced_recommender.py`, `tests/sihao/p1a/test_adversarial_inputs.py`, `tests/sihao/p1a/test_recommender_behavior.py` and `tests/p2/test_contract_fixtures.py`. The last one was mine and is now formatted; the other three belong to other owners, and the plan says formatting touches only your own changed files. Removing the flag is a one-line change that becomes safe the moment those three are formatted — it is blocked on their owners, not on a measurement. |
| `npm ci` cannot install this lock file | Recorded in P1a evidence: the committed lock is missing the `@swc/core` platform binaries under npm 11+. CI uses `npm install`. Regenerating the lock is this role's file and is not done yet. |
| `user_inventory` is missing from the generated `web/src/types/supabase.ts` | The generated types are stale. Inventory types in the contract are hand-written from the migration until Andy regenerates. |
| M0 validates supplied receipts, not a scorer | `backend/api/receipt_scorer.py` is M1 and does not exist yet. The harness is written against the contract so it is ready the day it lands. |
| The 500-cell determinism corpus is not built | The golden fixture is 3 recipes × 5 inventory rows. Scaling to 50 × 10 is the next M0 task and needs the scorer. |

## Reproduction, from a clean checkout

```bash
git clone https://github.com/Amihua/Epicourier-Web.git
cd Epicourier-Web
git switch se26f-p2
python3 p2/eval/run_eval.py          # M0, no install needed
cd web && npm install && npx tsc --noEmit && npm test
```

`npm install`, not `npm ci`, for the lock-file reason above. The backend is deliberately absent from
this list: it cannot be installed and run offline today, and saying so is more useful than a command
that fails on someone else's machine.
