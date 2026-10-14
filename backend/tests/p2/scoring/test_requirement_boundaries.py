"""Requirement-derived boundary tests for Sihao's receipt-v1 implementation."""

from __future__ import annotations

from datetime import datetime

import pytest
from pydantic import ValidationError

from api.receipt_models import NutrientTargets, RankingRequest
from api.receipt_scorer import score_rankings
from api.target_math import calculate_target_contribution


def request_with(
    *,
    candidates: list[dict],
    inventory: list[dict],
    targets: dict | None = None,
) -> RankingRequest:
    return RankingRequest.model_validate(
        {
            "rule_version": "receipt-v1",
            "as_of_date": "2026-10-10",
            "candidates": candidates,
            "inventory": inventory,
            "targets": targets,
        }
    )


def stock(
    inventory_id: str,
    ingredient_id: int,
    quantity: float,
    unit: str | None,
    expiration_date: str | None,
) -> dict:
    return {
        "inventory_id": inventory_id,
        "ingredient_id": ingredient_id,
        "quantity": quantity,
        "unit": unit,
        "location": "pantry",
        "expiration_date": expiration_date,
    }


def test_servings_scale_requirements_but_not_inventory() -> None:
    request = request_with(
        candidates=[
            {
                "recipe_id": 1,
                "servings": 2,
                "requirements": [{"ingredient_id": 10, "quantity": 10, "unit": "g"}],
            }
        ],
        inventory=[stock("row", 10, 15, "g", None)],
    )

    line = score_rankings(request).results[0].items[0]

    assert line.required_qty == 20
    assert line.available_qty == 15
    assert line.status == "missing"
    assert line.points == 0


def test_expiry_window_includes_day_three_but_not_day_four() -> None:
    request = request_with(
        candidates=[
            {
                "recipe_id": 1,
                "requirements": [{"ingredient_id": 10, "quantity": 10, "unit": "g"}],
            },
            {
                "recipe_id": 2,
                "requirements": [{"ingredient_id": 20, "quantity": 10, "unit": "g"}],
            },
        ],
        inventory=[
            stock("day-3", 10, 5, "g", "2026-10-13"),
            stock("day-4", 20, 5, "g", "2026-10-14"),
        ],
    )

    by_id = {result.recipe_id: result for result in score_rankings(request).results}

    assert by_id[1].subtotals.expiry == 1
    assert by_id[2].subtotals.expiry == 0


@pytest.mark.parametrize("stored_unit", [None, "kg"])
def test_missing_or_incompatible_units_are_never_subtracted(
    stored_unit: str | None,
) -> None:
    request = request_with(
        candidates=[
            {
                "recipe_id": 1,
                "requirements": [{"ingredient_id": 10, "quantity": 10, "unit": "g"}],
            }
        ],
        inventory=[stock("row", 10, 1000, stored_unit, None)],
    )

    result = score_rankings(request).results[0]
    line = result.items[0]

    assert line.available_qty == 0
    assert line.status == "unresolved_unit"
    assert line.points == 0
    assert [warning.code for warning in result.warnings] == ["unresolved_unit"]


def test_expired_quantity_is_excluded_when_a_usable_row_also_exists() -> None:
    request = request_with(
        candidates=[
            {
                "recipe_id": 1,
                "requirements": [{"ingredient_id": 10, "quantity": 5, "unit": "g"}],
            }
        ],
        inventory=[
            stock("expired", 10, 100, "g", "2026-10-09"),
            stock("usable", 10, 2, "g", "2026-10-10"),
        ],
    )

    result = score_rankings(request).results[0]
    line = result.items[0]

    assert line.available_qty == 2
    assert line.status == "missing"
    assert any(warning.code == "expired_stock_excluded" for warning in result.warnings)


@pytest.mark.parametrize(
    ("field", "replacement", "message"),
    [
        ("rule_version", "receipt-v0", "receipt-v1"),
        ("as_of_date", "2026-13-01", "valid date"),
    ],
)
def test_request_rejects_unsupported_rule_or_invalid_date(
    field: str,
    replacement: str,
    message: str,
) -> None:
    payload = {
        "rule_version": "receipt-v1",
        "as_of_date": "2026-10-10",
        "candidates": [{"recipe_id": 1, "requirements": []}],
        "inventory": [],
        "targets": None,
    }
    payload[field] = replacement

    with pytest.raises(ValidationError, match=message):
        RankingRequest.model_validate(payload)


def test_request_rejects_duplicate_recipe_and_requirement_ids() -> None:
    duplicate_recipes = {
        "rule_version": "receipt-v1",
        "as_of_date": "2026-10-10",
        "candidates": [
            {"recipe_id": 1, "requirements": []},
            {"recipe_id": 1, "requirements": []},
        ],
        "inventory": [],
        "targets": None,
    }
    with pytest.raises(ValidationError, match="each recipe_id once"):
        RankingRequest.model_validate(duplicate_recipes)

    duplicate_requirements = dict(duplicate_recipes)
    duplicate_requirements["candidates"] = [
        {
            "recipe_id": 1,
            "requirements": [
                {"ingredient_id": 10, "quantity": 1, "unit": "g"},
                {"ingredient_id": 10, "quantity": 2, "unit": "g"},
            ],
        }
    ]
    with pytest.raises(ValidationError, match="each ingredient_id once"):
        RankingRequest.model_validate(duplicate_requirements)


def test_missing_consumed_value_is_incomplete_not_implicitly_zero() -> None:
    targets = NutrientTargets(
        confirmed_at=datetime.fromisoformat("2026-10-10T08:00:00+00:00"),
        daily={"protein_g": 100},
        consumed_today={},
    )

    result = calculate_target_contribution(targets, {"protein_g": 30})

    assert result.outcome.remaining == {"protein_g": 100}
    assert result.outcome.over == {"protein_g": 0}
    assert result.outcome.incomplete == ["protein_g"]
    assert result.points == 0


def test_zero_daily_target_never_divides_by_zero_and_preserves_overage() -> None:
    targets = NutrientTargets(
        confirmed_at=datetime.fromisoformat("2026-10-10T08:00:00+00:00"),
        daily={"sodium_mg": 0},
        consumed_today={"sodium_mg": 2},
    )

    result = calculate_target_contribution(targets, {"sodium_mg": 3})

    assert result.outcome.remaining == {"sodium_mg": 0}
    assert result.outcome.over == {"sodium_mg": 5}
    assert result.points == 0


def test_every_receipt_adds_up_by_lines_and_subtotals() -> None:
    request = request_with(
        candidates=[
            {
                "recipe_id": 1,
                "requirements": [
                    {"ingredient_id": 10, "quantity": 10, "unit": "g"},
                    {"ingredient_id": 20, "quantity": 5, "unit": "g"},
                ],
            }
        ],
        inventory=[
            stock("covered", 10, 10, "g", None),
            stock("urgent", 20, 2, "g", "2026-10-11"),
        ],
    )

    result = score_rankings(request).results[0]

    assert round(sum(item.points for item in result.items), 2) == result.rank_score
    assert round(sum(result.subtotals.model_dump().values()), 2) == result.rank_score
