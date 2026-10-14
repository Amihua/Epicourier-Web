from __future__ import annotations

import json
from pathlib import Path

from api.receipt_models import RankingRequest
from api.receipt_scorer import score_rankings

ROOT = Path(__file__).resolve().parents[4]
FIXTURE = ROOT / "p2" / "contracts" / "fixtures" / "ranking-request.golden.json"
EXPECTED = ROOT / "p2" / "eval" / "cases" / "hand-computed.json"


def load_golden_request() -> RankingRequest:
    return RankingRequest.model_validate_json(FIXTURE.read_text())


def test_matches_independent_hand_computed_receipt() -> None:
    response = score_rankings(load_golden_request())
    expected = json.loads(EXPECTED.read_text())["receipt"]
    actual = response.model_dump(mode="json")

    assert actual["rule_version"] == expected["rule_version"]
    assert actual["as_of_date"] == expected["as_of_date"]
    assert [item["recipe_id"] for item in actual["results"]] == [101, 102, 103]

    assert len(actual["results"]) == len(expected["results"])
    for actual_recipe, expected_recipe in zip(actual["results"], expected["results"]):
        assert actual_recipe["recipe_id"] == expected_recipe["recipe_id"]
        assert actual_recipe["rank_score"] == expected_recipe["rank_score"]
        assert actual_recipe["subtotals"] == expected_recipe["subtotals"]
        assert actual_recipe["targets"] == expected_recipe["targets"]
        assert (
            _without_optional_display_fields(actual_recipe["items"])
            == expected_recipe["items"]
        )
        assert (
            _without_null_ingredient_ids(actual_recipe["warnings"])
            == expected_recipe["warnings"]
        )


def test_empty_inventory_produces_explainable_missing_lines() -> None:
    payload = load_golden_request().model_dump()
    payload["inventory"] = []

    response = score_rankings(RankingRequest.model_validate(payload))
    recipe = next(item for item in response.results if item.recipe_id == 102)

    assert recipe.rank_score == 0
    assert [item.status for item in recipe.items] == ["missing", "missing"]
    assert all(item.available_qty == 0 for item in recipe.items)


def test_expired_stock_is_excluded_but_date_boundary_is_usable() -> None:
    response = score_rankings(load_golden_request())
    recipe = next(item for item in response.results if item.recipe_id == 101)
    by_ingredient = {
        item.ingredient_id: item for item in recipe.items if item.source == "inventory"
    }

    assert by_ingredient[11].available_qty == 350
    assert by_ingredient[13].available_qty == 0
    assert by_ingredient[13].status == "expired"


def test_ties_are_ordered_by_recipe_id() -> None:
    payload = load_golden_request().model_dump()
    payload["candidates"] = [
        {"recipe_id": 9, "requirements": []},
        {"recipe_id": 2, "requirements": []},
        {"recipe_id": 5, "requirements": []},
    ]

    response = score_rankings(RankingRequest.model_validate(payload))

    assert [recipe.recipe_id for recipe in response.results] == [2, 5, 9]


def test_duplicate_ingredient_rows_are_summed_across_locations() -> None:
    response = score_rankings(load_golden_request())
    recipe = next(item for item in response.results if item.recipe_id == 102)
    ingredient = next(item for item in recipe.items if item.ingredient_id == 11)

    assert ingredient.required_qty == 200
    assert ingredient.available_qty == 350
    assert ingredient.points == 1


def test_confirmed_targets_report_missing_recipe_nutrition() -> None:
    payload = load_golden_request().model_dump()
    payload["targets"] = {
        "confirmed_at": "2026-10-10T08:00:00Z",
        "daily": {"protein_g": 100},
        "consumed_today": {"protein_g": 80},
    }

    response = score_rankings(RankingRequest.model_validate(payload))

    assert all(recipe.subtotals.nutrition == 0 for recipe in response.results)
    assert all(
        recipe.targets is not None and recipe.targets.incomplete == ["protein_g"]
        for recipe in response.results
    )
    assert all(
        any(warning.code == "missing_nutrient_data" for warning in recipe.warnings)
        for recipe in response.results
    )
    assert all(
        next(
            item for item in recipe.items if item.source == "nutrition"
        ).ingredient_name
        == "Confirmed nutrient targets"
        for recipe in response.results
    )


def _without_optional_display_fields(items: list[dict]) -> list[dict]:
    return [
        {key: value for key, value in item.items() if key != "ingredient_name"}
        for item in items
    ]


def _without_null_ingredient_ids(warnings: list[dict]) -> list[dict]:
    return [
        {
            key: value
            for key, value in warning.items()
            if not (key == "ingredient_id" and value is None)
        }
        for warning in warnings
    ]
