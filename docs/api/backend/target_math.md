# `backend/api/target_math.py`

Deterministic nutrient-target calculations for receipt scoring.

## Contents

- [`round_half_up`](#round_half_up) — function
- [`TargetCalculation`](#targetcalculation) — class
- [`calculate_target_contribution`](#calculate_target_contribution) — function

## `round_half_up`

```python
round_half_up(value: float, places: int=2) -> float
```

Round a finite number using the receipt-v1 half-up rule.

## `TargetCalculation`

**class**

Target state plus its unrounded ranking-point contribution.

Fields:

- `outcome: TargetOutcome`
- `points: float`

## `calculate_target_contribution`

```python
calculate_target_contribution(targets: NutrientTargets, recipe_nutrients: Optional[Mapping[str, Optional[float]]]) -> TargetCalculation
```

Calculate remaining targets, overages, completeness and ranking points.

A complete nutrient can earn at most one ranking point, proportional to the
fraction of the pre-recipe remainder that it fills. Overshooting never adds
more points. Missing consumed or recipe values are listed in ``incomplete``
and earn no points; they are never interpreted as nutrient value zero.
