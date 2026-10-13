# M0 — offline evaluation harness

**Owner:** Wenbo Li · **Rule version under test:** `receipt-v1`

M0 answers one question: *given a fixed input, is the receipt the scorer produced the receipt a
human computed by hand?* It runs with no Gemini key, no Supabase connection and no network.

## The rule that shapes this harness

**Expected values may not come from the scorer.** If the expectation for a total is produced by
calling the same function under test, the test asserts that the code equals itself and passes
forever. So:

- every expectation in `cases/` is written by hand, from the contract, before the scorer runs;
- at least one case is a **deliberately corrupted receipt**, and the harness must *fail* on it. A
  suite that cannot fail has not been shown to work;
- the harness exits non-zero when anything fails, so CI can tell.

## Layout

```
p2/eval/
  README.md            this file
  run_eval.py          the runner; exits non-zero on any failure
  cases/
    hand-computed.json   expectations written by hand from the contract
    corrupted.json       a receipt with a planted defect; the harness must reject it
```

## What a case asserts

| Check | Why it is here |
|---|---|
| `sum(items[].points) == rank_score` | Contract §5. A scorer that rounds per line instead of once at the end fails this. |
| expired rows contribute `available_qty: 0` | Contract §5. The boundary case — expiring *on* `as_of_date` — is still usable. |
| a requirement of `0` stays `0` | The existing `nutrients/daily/route.ts:171` reads `(relative_unit_100 \|\| 100) / 100`, turning 0 into 100. |
| a `null` requirement is `unknown_requirement` | Not a default, not a zero. |
| rows for one ingredient in two locations are **summed** | The unique constraint is per `(user, ingredient, location)`. |
| order is `rank_score` desc then `recipe_id` asc | Contract §4. |
| 20 inventory shuffles give an identical response | A scorer that reads "the first matching row" is order-dependent and fails here. |
| target overage is preserved in `over` | Contract §6. Clamping to zero loses a fact. |

## Running it

```bash
python3 p2/eval/run_eval.py                    # all cases
python3 p2/eval/run_eval.py --case corrupted   # one case
```

The runner is dependency-free on purpose: it must run in CI before `uv sync` or `npm install` have
any bearing, and it must keep working when the backend cannot be imported offline — see
`docs/p2/evaluation.md`.

## Status

The harness and its cases are in place and the corrupted case is proven to fail. **The scorer it
will be pointed at does not exist yet** (`backend/api/receipt_scorer.py` is Sihao's, M1). Until it
lands, `run_eval.py` validates receipts supplied as JSON, which is what lets the corrupted case be
written and proven now rather than after the scorer exists.
