# Receipt scoring v1

**Owner:** Sihao Liu · **Rule version:** `receipt-v1` · **Contract:**
[`p2/contracts/receipt-v1.md`](../../p2/contracts/receipt-v1.md)

This module ranks candidate recipes with pure Python. It does not read a database,
call Gemini, use the network, or consult the machine clock. The caller must provide
an explicit `as_of_date`, the full authorised inventory snapshot, candidates, and
confirmed targets when available.

`rank_score` is a sum of **ranking points**, not a percentage. Do not display it in
the legacy `match_score` percentage UI.

## Rules and weights

The implementation is split across:

- `backend/api/receipt_models.py`: strict receipt-v1 request/response validation;
- `backend/api/receipt_scorer.py`: inventory, expiry, receipt, and ordering logic;
- `backend/api/target_math.py`: target remainder, overage, completeness, and
  nutrition-point calculations.

### Inventory contribution

Each requirement with a known quantity earns `1.0` point when usable inventory in
the exact same unit fully covers `quantity * servings`; otherwise it earns `0.0`.
Inventory rows with the same ingredient and unit are summed across locations.

A zero requirement is a real zero and is satisfied. A `null` requirement is
`unknown_requirement` and never becomes zero or a default. A negative or non-finite
quantity is rejected with a validation error.

Units are deliberately not guessed or converted in the ranker. A null or different
inventory unit is excluded and reported as `unresolved_unit`. Andy's shopping-delta
module owns compatible unit conversion for shopping previews.

### Expiry contribution

Expired means `expiration_date < as_of_date`. Expired rows contribute zero usable
quantity; a row expiring exactly on `as_of_date` is still usable.

An otherwise-uncovered, positive requirement earns `1.0` expiry-rescue point when
it has some usable matching stock expiring in 0–3 days. A requirement already earning
its inventory point gets no additional expiry point. This prevents double-counting
while moving a recipe that can consume urgent partial stock ahead of an equally
incomplete recipe.

When several rows are combined, the row with the lexicographically smallest stable
`inventory_id` supplies the displayed expiration date. Input array order therefore
cannot change the receipt.

### Nutrition contribution

For independently supplied recipe nutrient totals, each complete target can earn up
to `1.0` point:

```text
min(recipe_amount, remaining_before_recipe) / remaining_before_recipe
```

Overshooting earns no extra points. `remaining` and `over` are both returned, so an
overage is never hidden by clamping the remainder to zero.

The frozen v1 ranking request does not contain recipe nutrient totals. Consequently,
the API marks every confirmed target as `incomplete`, adds a
`missing_nutrient_data` warning and awards `0.0` nutrition points. Missing source
data is never treated as nutrient value zero. The standalone target function is
ready for a future contract revision that explicitly supplies those totals.

### Total, rounding, and ties

```text
rank_score = inventory subtotal + expiry subtotal + nutrition subtotal
```

Values use decimal half-up rounding to two places. Rounding is applied after adding
unrounded contributions. Receipt item points and subtotals are constructed so both
sum to the final `rank_score`.

Results sort by `rank_score` descending, then by `recipe_id` ascending. Requirements
and inventory rows are normalised to stable orders, so identical values and date
produce identical output regardless of input array order.

## API

`POST /receipt/rank` accepts a `RankingRequest` and returns a `RankingResponse`.
Invalid dates, quantities, duplicate IDs, unknown fields, blank units, or an
unconfirmed target object receive FastAPI's explanatory `422` response.

If `RECEIPT_INTERNAL_TOKEN` is configured in the Python service, callers must send
the same value in `X-Internal-Token`; a missing or wrong value receives `401`. With
no token configured, local offline calls remain available.

Example from the repository root:

```bash
cd backend
.venv/bin/uvicorn api.index:app --host 127.0.0.1 --port 8000
curl -X POST http://127.0.0.1:8000/receipt/rank \
  -H 'Content-Type: application/json' \
  --data-binary @../p2/contracts/fixtures/ranking-request.golden.json
```

The golden request ranks recipes `101`, `102`, `103` with scores `3.0`, `1.0`,
`0.0`, matching the independently hand-computed receipt in
`p2/eval/cases/hand-computed.json`.

## Verification

Run only this module's offline suite:

```bash
cd backend
.venv/bin/python -m pytest -q tests/p2/scoring tests/p2/test_contract_fixtures.py
```

The suite covers the hand-computed answer, empty inventory, expired stock, the exact
date boundary, duplicate ingredient rows, missing units and nutrients, invalid input,
tie ordering, repeated inventory permutations, target overages, API authentication,
and operation without external credentials.
