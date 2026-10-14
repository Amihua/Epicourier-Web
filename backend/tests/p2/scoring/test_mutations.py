"""Dependency-free mutation tests for the highest-risk scoring decisions.

Each seeded mutant changes one production decision. A witness first has to pass
against the real module, then must fail or raise against the mutant. This gives
us executable mutation coverage without adding a shared test dependency.
"""

from __future__ import annotations

import sys
from dataclasses import dataclass
from datetime import datetime
from pathlib import Path
from types import ModuleType
from typing import Callable

import pytest

from api import receipt_scorer, target_math
from api.receipt_models import NutrientTargets, RankingRequest

API_DIR = Path(__file__).resolve().parents[3] / "api"


def ranking_request(
    *,
    required: float = 10,
    quantity: float = 10,
    unit: str | None = "g",
    expiration_date: str | None = None,
) -> RankingRequest:
    return RankingRequest.model_validate(
        {
            "rule_version": "receipt-v1",
            "as_of_date": "2026-10-10",
            "candidates": [
                {
                    "recipe_id": 1,
                    "requirements": [
                        {"ingredient_id": 10, "quantity": required, "unit": "g"}
                    ],
                }
            ],
            "inventory": [
                {
                    "inventory_id": "row",
                    "ingredient_id": 10,
                    "quantity": quantity,
                    "unit": unit,
                    "location": "pantry",
                    "expiration_date": expiration_date,
                }
            ],
            "targets": None,
        }
    )


def witness_expiry_date_boundary(module: ModuleType) -> None:
    result = module.score_rankings(
        ranking_request(expiration_date="2026-10-10")
    ).results[0]
    assert result.items[0].available_qty == 10
    assert result.items[0].status == "ok"


def witness_exact_inventory_coverage(module: ModuleType) -> None:
    result = module.score_rankings(ranking_request()).results[0]
    assert result.subtotals.inventory == 1
    assert result.rank_score == 1


def witness_units_are_not_guessed(module: ModuleType) -> None:
    result = module.score_rankings(ranking_request(unit=None, quantity=100)).results[0]
    assert result.items[0].available_qty == 0
    assert result.items[0].status == "unresolved_unit"


def witness_tie_breaks_by_lower_recipe_id(module: ModuleType) -> None:
    request = RankingRequest.model_validate(
        {
            "rule_version": "receipt-v1",
            "as_of_date": "2026-10-10",
            "candidates": [
                {"recipe_id": 2, "requirements": []},
                {"recipe_id": 1, "requirements": []},
            ],
            "inventory": [],
            "targets": None,
        }
    )
    assert [item.recipe_id for item in module.score_rankings(request).results] == [1, 2]


def witness_expiry_window_includes_day_three(module: ModuleType) -> None:
    result = module.score_rankings(
        ranking_request(required=10, quantity=5, expiration_date="2026-10-13")
    ).results[0]
    assert result.subtotals.expiry == 1


def witness_expiry_points_are_added(module: ModuleType) -> None:
    result = module.score_rankings(
        ranking_request(required=10, quantity=5, expiration_date="2026-10-11")
    ).results[0]
    assert result.rank_score == 1


def nutrient_targets(
    daily: float = 100,
    consumed: dict[str, float] | None = None,
) -> NutrientTargets:
    return NutrientTargets(
        confirmed_at=datetime.fromisoformat("2026-10-10T08:00:00+00:00"),
        daily={"protein_g": daily},
        consumed_today=consumed if consumed is not None else {"protein_g": 80},
    )


def witness_missing_recipe_nutrient_is_incomplete(module: ModuleType) -> None:
    result = module.calculate_target_contribution(nutrient_targets(), {})
    assert result.outcome.incomplete == ["protein_g"]
    assert result.points == 0


def witness_target_overage_direction(module: ModuleType) -> None:
    result = module.calculate_target_contribution(nutrient_targets(), {"protein_g": 30})
    assert result.outcome.remaining == {"protein_g": 0}
    assert result.outcome.over == {"protein_g": 10}


def witness_decimal_rounds_half_up(module: ModuleType) -> None:
    assert module.round_half_up(2.685) == 2.69


@dataclass(frozen=True)
class Mutation:
    name: str
    source: str
    old: str
    new: str
    witness: Callable[[ModuleType], None]


MUTATIONS = [
    Mutation(
        "expiry_on_as_of_date_becomes_expired",
        "receipt_scorer.py",
        "row.expiration_date >= as_of_date",
        "row.expiration_date > as_of_date",
        witness_expiry_date_boundary,
    ),
    Mutation(
        "exact_inventory_coverage_no_longer_counts",
        "receipt_scorer.py",
        ("return INVENTORY_MATCH_POINTS if available_qty >= required_qty else 0.0"),
        ("return INVENTORY_MATCH_POINTS if available_qty > required_qty else 0.0"),
        witness_exact_inventory_coverage,
    ),
    Mutation(
        "inventory_units_are_ignored",
        "receipt_scorer.py",
        "row for row in usable_rows if row.unit == requirement.unit",
        "row for row in usable_rows if True",
        witness_units_are_not_guessed,
    ),
    Mutation(
        "tie_break_prefers_higher_recipe_id",
        "receipt_scorer.py",
        "(-result.rank_score, result.recipe_id)",
        "(-result.rank_score, -result.recipe_id)",
        witness_tie_breaks_by_lower_recipe_id,
    ),
    Mutation(
        "expiry_day_three_is_excluded",
        "receipt_scorer.py",
        "0 <= days_left <= EXPIRY_WINDOW_DAYS",
        "0 <= days_left < EXPIRY_WINDOW_DAYS",
        witness_expiry_window_includes_day_three,
    ),
    Mutation(
        "expiry_points_are_subtracted",
        "receipt_scorer.py",
        "inventory_points + expiry_points + nutrition_points",
        "inventory_points - expiry_points + nutrition_points",
        witness_expiry_points_are_added,
    ),
    Mutation(
        "one_missing_nutrient_source_is_treated_as_complete",
        "target_math.py",
        "consumed is None or recipe_value is None",
        "consumed is None and recipe_value is None",
        witness_missing_recipe_nutrient_is_incomplete,
    ),
    Mutation(
        "target_overage_direction_is_reversed",
        "target_math.py",
        "max(total - daily, 0.0)",
        "max(daily - total, 0.0)",
        witness_target_overage_direction,
    ),
    Mutation(
        "half_up_is_replaced_by_half_even",
        "target_math.py",
        "from decimal import ROUND_HALF_UP, Decimal",
        "from decimal import ROUND_HALF_EVEN as ROUND_HALF_UP, Decimal",
        witness_decimal_rounds_half_up,
    ),
]


def load_mutant(mutation: Mutation) -> ModuleType:
    path = API_DIR / mutation.source
    source = path.read_text()
    assert source.count(mutation.old) == 1, (
        f"mutation point {mutation.name!r} is missing or ambiguous"
    )
    mutated = source.replace(mutation.old, mutation.new, 1)
    module = ModuleType(f"test_mutant_{mutation.name}")
    module.__file__ = str(path)
    sys.modules[module.__name__] = module
    exec(compile(mutated, str(path), "exec"), module.__dict__)
    return module


@pytest.mark.parametrize("mutation", MUTATIONS, ids=lambda item: item.name)
def test_real_implementation_passes_every_mutation_witness(mutation: Mutation) -> None:
    module = receipt_scorer if mutation.source == "receipt_scorer.py" else target_math
    mutation.witness(module)


@pytest.mark.parametrize("mutation", MUTATIONS, ids=lambda item: item.name)
def test_seeded_mutation_is_killed(mutation: Mutation) -> None:
    mutant = load_mutant(mutation)
    try:
        mutation.witness(mutant)
    except Exception:
        return
    pytest.fail(f"mutation survived: {mutation.name}")
