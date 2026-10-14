"""Differential tests against small independent reference implementations."""

from __future__ import annotations

from datetime import datetime
from typing import Optional

import pytest
from hypothesis import given, settings
from hypothesis import strategies as st

from api.receipt_models import NutrientTargets, RankingRequest
from api.receipt_scorer import score_rankings
from api.target_math import calculate_target_contribution

AS_OF = datetime.fromisoformat("2026-10-10T00:00:00+00:00").date()

ROW = st.tuples(
    st.integers(min_value=0, max_value=100),
    st.sampled_from(["g", "kg", None]),
    st.one_of(st.none(), st.integers(min_value=-2, max_value=6)),
)


def iso_date(offset: Optional[int]) -> Optional[str]:
    if offset is None:
        return None
    return date_from_offset(offset).isoformat()


def date_from_offset(offset: int):
    from datetime import timedelta

    return AS_OF + timedelta(days=offset)


def reference_requirement(
    required: Optional[int],
    servings: int,
    rows: list[tuple[int, Optional[str], Optional[int]]],
) -> dict:
    """A deliberately direct oracle, with no production helper calls."""

    scaled = None if required is None else required * servings
    usable = [row for row in rows if row[2] is None or row[2] >= 0]
    expired = [row for row in rows if row[2] is not None and row[2] < 0]
    compatible = [row for row in usable if row[1] == "g"]
    unresolved = [row for row in usable if row[1] != "g"]
    available = sum(row[0] for row in compatible)

    if scaled is None:
        status = "unknown_requirement"
    elif not usable and expired:
        status = "expired"
    elif unresolved and not compatible:
        status = "unresolved_unit"
    elif available >= scaled:
        status = "ok"
    else:
        status = "missing"

    inventory_points = 1.0 if scaled is not None and available >= scaled else 0.0
    urgent = any(row[2] is not None and 0 <= row[2] <= 3 for row in compatible)
    expiry_points = (
        1.0
        if scaled is not None
        and scaled > 0
        and available > 0
        and inventory_points == 0
        and urgent
        else 0.0
    )
    warning_codes = set()
    if scaled is None:
        warning_codes.add("unknown_requirement")
    if unresolved:
        warning_codes.add("unresolved_unit")
    if expired:
        warning_codes.add("expired_stock_excluded")

    return {
        "required": scaled,
        "available": available,
        "status": status,
        "inventory_points": inventory_points,
        "expiry_points": expiry_points,
        "warning_codes": warning_codes,
    }


@settings(max_examples=150, deadline=None)
@given(
    required=st.one_of(st.none(), st.integers(min_value=0, max_value=100)),
    servings=st.integers(min_value=1, max_value=4),
    rows=st.lists(ROW, min_size=0, max_size=6),
)
def test_scorer_matches_independent_inventory_oracle(
    required: Optional[int],
    servings: int,
    rows: list[tuple[int, Optional[str], Optional[int]]],
) -> None:
    inventory = [
        {
            "inventory_id": f"row-{index}",
            "ingredient_id": 10,
            "quantity": quantity,
            "unit": unit,
            "location": "pantry",
            "expiration_date": iso_date(offset),
        }
        for index, (quantity, unit, offset) in enumerate(rows)
    ]
    request = RankingRequest.model_validate(
        {
            "rule_version": "receipt-v1",
            "as_of_date": AS_OF.isoformat(),
            "candidates": [
                {
                    "recipe_id": 1,
                    "servings": servings,
                    "requirements": [
                        {"ingredient_id": 10, "quantity": required, "unit": "g"}
                    ],
                }
            ],
            "inventory": inventory,
            "targets": None,
        }
    )
    expected = reference_requirement(required, servings, rows)

    result = score_rankings(request).results[0]
    line = next(item for item in result.items if item.source == "inventory")

    assert line.required_qty == expected["required"]
    assert line.available_qty == expected["available"]
    assert line.status == expected["status"]
    assert line.points == expected["inventory_points"]
    assert result.subtotals.inventory == expected["inventory_points"]
    assert result.subtotals.expiry == expected["expiry_points"]
    assert result.rank_score == (
        expected["inventory_points"] + expected["expiry_points"]
    )
    assert {warning.code for warning in result.warnings} == expected["warning_codes"]


def reference_targets(
    daily: int,
    consumed: Optional[int],
    recipe: Optional[int],
) -> tuple[int, int, bool, float]:
    if consumed is None or recipe is None:
        known_consumed = consumed if consumed is not None else 0
        return (
            max(daily - known_consumed, 0),
            max(known_consumed - daily, 0),
            True,
            0.0,
        )

    total = consumed + recipe
    remainder_before = max(daily - consumed, 0)
    points = min(recipe, remainder_before) / remainder_before if remainder_before else 0
    return max(daily - total, 0), max(total - daily, 0), False, points


@settings(max_examples=150, deadline=None)
@given(
    daily=st.integers(min_value=0, max_value=10000),
    consumed=st.one_of(st.none(), st.integers(min_value=0, max_value=10000)),
    recipe=st.one_of(st.none(), st.integers(min_value=0, max_value=10000)),
)
def test_target_math_matches_independent_oracle(
    daily: int,
    consumed: Optional[int],
    recipe: Optional[int],
) -> None:
    targets = NutrientTargets(
        confirmed_at=datetime.fromisoformat("2026-10-10T08:00:00+00:00"),
        daily={"protein_g": daily},
        consumed_today={} if consumed is None else {"protein_g": consumed},
    )
    nutrients = {} if recipe is None else {"protein_g": recipe}
    expected_remaining, expected_over, incomplete, expected_points = reference_targets(
        daily, consumed, recipe
    )

    actual = calculate_target_contribution(targets, nutrients)

    assert actual.outcome.remaining["protein_g"] == expected_remaining
    assert actual.outcome.over["protein_g"] == expected_over
    assert ("protein_g" in actual.outcome.incomplete) is incomplete
    assert actual.points == pytest.approx(expected_points)
