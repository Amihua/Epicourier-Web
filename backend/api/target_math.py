"""Deterministic nutrient-target calculations for receipt scoring."""

from __future__ import annotations

import math
from dataclasses import dataclass
from decimal import ROUND_HALF_UP, Decimal
from typing import Mapping, Optional

from api.receipt_models import NutrientTargets, TargetOutcome

NUTRITION_POINTS_PER_TARGET = 1.0


def round_half_up(value: float, places: int = 2) -> float:
    """Round a finite number using the receipt-v1 half-up rule."""

    if not math.isfinite(value):
        raise ValueError("value must be finite")
    quantum = Decimal("1").scaleb(-places)
    return float(Decimal(str(value)).quantize(quantum, rounding=ROUND_HALF_UP))


@dataclass(frozen=True)
class TargetCalculation:
    """Target state plus its unrounded ranking-point contribution."""

    outcome: TargetOutcome
    points: float


def calculate_target_contribution(
    targets: NutrientTargets,
    recipe_nutrients: Optional[Mapping[str, Optional[float]]],
) -> TargetCalculation:
    """Calculate remaining targets, overages, completeness and ranking points.

    A complete nutrient can earn at most one ranking point, proportional to the
    fraction of the pre-recipe remainder that it fills. Overshooting never adds
    more points. Missing consumed or recipe values are listed in ``incomplete``
    and earn no points; they are never interpreted as nutrient value zero.
    """

    nutrients = recipe_nutrients or {}
    _validate_recipe_nutrients(nutrients)

    remaining = {}
    over = {}
    incomplete = []
    points = 0.0

    for key in sorted(targets.daily):
        daily = targets.daily[key]
        consumed = targets.consumed_today.get(key)
        recipe_value = nutrients.get(key)

        if consumed is None or recipe_value is None:
            incomplete.append(key)
            known_consumed = consumed if consumed is not None else 0.0
            remaining[key] = round_half_up(max(daily - known_consumed, 0.0))
            over[key] = round_half_up(max(known_consumed - daily, 0.0))
            continue

        total = consumed + recipe_value
        remaining[key] = round_half_up(max(daily - total, 0.0))
        over[key] = round_half_up(max(total - daily, 0.0))

        remainder_before_recipe = max(daily - consumed, 0.0)
        if remainder_before_recipe > 0:
            filled = min(recipe_value, remainder_before_recipe)
            points += (filled / remainder_before_recipe) * NUTRITION_POINTS_PER_TARGET

    return TargetCalculation(
        outcome=TargetOutcome(
            remaining=remaining,
            over=over,
            incomplete=incomplete,
        ),
        points=points,
    )


def _validate_recipe_nutrients(
    recipe_nutrients: Mapping[str, Optional[float]],
) -> None:
    for key, value in recipe_nutrients.items():
        if value is None:
            continue
        if not math.isfinite(value) or value < 0:
            raise ValueError(
                f"recipe nutrient {key!r} must be null or a finite non-negative number"
            )
