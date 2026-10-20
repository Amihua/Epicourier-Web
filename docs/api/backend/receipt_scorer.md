# `backend/api/receipt_scorer.py`

Offline, deterministic ranking for receipt-v1 recipe candidates.

## Contents

- [`score_rankings`](#score_rankings) — function
- [`score_candidate`](#score_candidate) — function
- [`inventory_contribution`](#inventory_contribution) — function
- [`expiry_contribution`](#expiry_contribution) — function

## `score_rankings`

```python
score_rankings(request: RankingRequest) -> RankingResponse
```

Score every candidate and return a stable total ordering.

## `score_candidate`

```python
score_candidate(candidate: RecipeCandidate, inventory: Sequence[InventorySnapshot], as_of_date: date, targets: Optional[NutrientTargets]) -> RankedRecipe
```

Build an auditable receipt for one recipe candidate.

## `inventory_contribution`

```python
inventory_contribution(required_qty: Optional[float], available_qty: float) -> float
```

Award one ranking point when a known requirement is fully covered.

## `expiry_contribution`

```python
expiry_contribution(required_qty: Optional[float], available_qty: float, expiration_dates: Iterable[Optional[date]], as_of_date: date, inventory_points: float) -> float
```

Give partial-credit urgency to an otherwise-uncovered requirement.

This avoids double-counting a fully covered ingredient while still moving a
recipe with usable, soon-expiring stock ahead of an equally incomplete one.
