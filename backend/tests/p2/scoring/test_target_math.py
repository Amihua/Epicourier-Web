from __future__ import annotations

from datetime import datetime

import pytest

from api.receipt_models import NutrientTargets
from api.target_math import calculate_target_contribution, round_half_up


def targets() -> NutrientTargets:
    return NutrientTargets(
        confirmed_at=datetime.fromisoformat("2026-10-10T08:00:00+00:00"),
        daily={"calories_kcal": 2000, "protein_g": 100},
        consumed_today={"calories_kcal": 1900, "protein_g": 80},
    )


def test_preserves_remaining_and_overage() -> None:
    result = calculate_target_contribution(
        targets(),
        {"calories_kcal": 250, "protein_g": 30},
    )

    assert result.outcome.remaining == {"calories_kcal": 0, "protein_g": 0}
    assert result.outcome.over == {"calories_kcal": 150, "protein_g": 10}
    assert result.outcome.incomplete == []
    assert result.points == 2.0


def test_partial_progress_earns_proportional_points() -> None:
    result = calculate_target_contribution(
        targets(),
        {"calories_kcal": 25, "protein_g": 10},
    )

    assert result.outcome.remaining == {"calories_kcal": 75, "protein_g": 10}
    assert result.points == 0.75


def test_missing_recipe_nutrients_are_incomplete_not_zero() -> None:
    result = calculate_target_contribution(targets(), None)

    assert result.outcome.remaining == {"calories_kcal": 100, "protein_g": 20}
    assert result.outcome.over == {"calories_kcal": 0, "protein_g": 0}
    assert result.outcome.incomplete == ["calories_kcal", "protein_g"]
    assert result.points == 0


def test_current_overage_survives_when_recipe_data_is_missing() -> None:
    over_target = targets().model_copy(
        update={"consumed_today": {"calories_kcal": 2100, "protein_g": 80}}
    )

    result = calculate_target_contribution(over_target, None)

    assert result.outcome.remaining["calories_kcal"] == 0
    assert result.outcome.over["calories_kcal"] == 100
    assert "calories_kcal" in result.outcome.incomplete


@pytest.mark.parametrize("value", [-1, float("inf"), float("nan")])
def test_rejects_invalid_recipe_nutrients(value: float) -> None:
    with pytest.raises(ValueError, match="finite non-negative"):
        calculate_target_contribution(targets(), {"protein_g": value})


def test_rounds_half_up_instead_of_bankers_rounding() -> None:
    assert round_half_up(2.675) == 2.68
