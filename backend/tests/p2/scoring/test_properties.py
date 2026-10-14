from __future__ import annotations

import json
from datetime import datetime
from pathlib import Path

from hypothesis import given, settings
from hypothesis import strategies as st

from api.receipt_models import NutrientTargets, RankingRequest
from api.receipt_scorer import score_rankings
from api.target_math import calculate_target_contribution

ROOT = Path(__file__).resolve().parents[4]
FIXTURE = ROOT / "p2" / "contracts" / "fixtures" / "ranking-request.golden.json"
GOLDEN = json.loads(FIXTURE.read_text())


@settings(max_examples=20, deadline=None)
@given(order=st.permutations(range(len(GOLDEN["inventory"]))))
def test_inventory_order_never_changes_receipts(order: list[int]) -> None:
    baseline = score_rankings(RankingRequest.model_validate(GOLDEN))
    shuffled = dict(GOLDEN)
    shuffled["inventory"] = [GOLDEN["inventory"][index] for index in order]

    actual = score_rankings(RankingRequest.model_validate(shuffled))

    assert actual.model_dump(mode="json") == baseline.model_dump(mode="json")


@settings(max_examples=50, deadline=None)
@given(
    daily=st.floats(min_value=0, max_value=10000, allow_nan=False),
    consumed=st.floats(min_value=0, max_value=10000, allow_nan=False),
    recipe=st.floats(min_value=0, max_value=10000, allow_nan=False),
)
def test_target_outcomes_keep_overage_and_never_go_negative(
    daily: float,
    consumed: float,
    recipe: float,
) -> None:
    targets = NutrientTargets(
        confirmed_at=datetime.fromisoformat("2026-10-10T08:00:00+00:00"),
        daily={"protein_g": daily},
        consumed_today={"protein_g": consumed},
    )

    result = calculate_target_contribution(targets, {"protein_g": recipe})
    remaining = result.outcome.remaining["protein_g"]
    over = result.outcome.over["protein_g"]

    assert remaining >= 0
    assert over >= 0
    assert remaining == 0 or over == 0


@settings(max_examples=30, deadline=None)
@given(recipe_ids=st.lists(st.integers(), min_size=1, max_size=20, unique=True))
def test_any_all_tie_input_is_sorted_by_recipe_id(recipe_ids: list[int]) -> None:
    payload = {
        "rule_version": "receipt-v1",
        "as_of_date": "2026-10-10",
        "candidates": [
            {"recipe_id": recipe_id, "requirements": []} for recipe_id in recipe_ids
        ],
        "inventory": [],
        "targets": None,
    }

    response = score_rankings(RankingRequest.model_validate(payload))

    assert [recipe.recipe_id for recipe in response.results] == sorted(recipe_ids)
