# Add a scoring rule

Worked example: give a recipe a bonus when every ingredient it needs is already in the pantry.

The order matters. Write the expectation first, by hand, then the code. Doing it the other way round
produces a test that agrees with whatever the code does, which is the one mistake this project is
built to avoid.

## 1. Write the expectation by hand

Open `p2/eval/cases/hand-computed.json` and work out, from the contract rather than from the code,
what the new receipt should say. For the golden fixture, recipe 102 covers both its requirements
once the unit question is set aside, so it would earn the bonus and recipe 101 would not.

Add the line you expect to see:

```json
{
  "ingredient_id": 11,
  "required_qty": null,
  "available_qty": 350,
  "unit": "g",
  "expiration_date": null,
  "source": "global",
  "points": 2.0,
  "status": "ok"
}
```

`source: "global"` because the bonus belongs to the recipe rather than to one ingredient, and the
contract requires anything not attributable to a single ingredient to be its own line. Update
`rank_score` and the matching subtotal so the receipt still adds up.

## 2. Run the evaluation and watch it fail

```bash
python3 p2/eval/run_eval.py
```

```
FAIL  scorer-vs-hand-computed:
        scorer_lines: recipe 102 hand-computed [(11, 'global'), ...], scorer [...]
```

This is the point of the exercise. You now have a failing test that describes the behaviour you
want, written before the behaviour exists.

## 3. Implement it

In `backend/api/receipt_scorer.py`, add the contribution and emit a line for it. Three rules the
existing checks will enforce whether or not you remember them:

- the line's `points` must be included in `rank_score`, because `sum(items[].points) == rank_score`
  is asserted on all 500 corpus cells;
- it must not depend on the order of the `inventory` array, which 20 shuffles per sampled cell will
  catch;
- expired rows must not count toward "everything is in the pantry" — `available_qty` is already 0 for
  them, so read that rather than the raw quantity.

## 4. Run it again

```bash
python3 p2/eval/run_eval.py
```

Green means the code matches an expectation you wrote before writing the code.

## 5. Add the case to the corpus

The golden fixture is three recipes. Properties that hold for three can fail for fifty:

```bash
python3 p2/eval/build_corpus.py
python3 p2/eval/run_eval.py
```

The generator is deterministic — fixed seed, fixed date — so the regenerated file is byte-identical
unless your change altered it, and the diff shows exactly what moved.
