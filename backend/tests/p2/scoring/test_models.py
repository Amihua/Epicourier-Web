from __future__ import annotations

import pytest
from pydantic import ValidationError

from api.receipt_models import RankingRequest


def valid_request() -> dict:
    return {
        "rule_version": "receipt-v1",
        "as_of_date": "2026-10-10",
        "candidates": [
            {
                "recipe_id": 1,
                "requirements": [{"ingredient_id": 11, "quantity": 100, "unit": "g"}],
            }
        ],
        "inventory": [
            {
                "inventory_id": "row-1",
                "ingredient_id": 11,
                "quantity": 100,
                "unit": "g",
                "location": "pantry",
                "expiration_date": None,
            }
        ],
        "targets": None,
    }


def test_accepts_contract_request_and_defaults_servings() -> None:
    request = RankingRequest.model_validate(valid_request())

    assert request.candidates[0].servings == 1
    assert request.as_of_date.isoformat() == "2026-10-10"


@pytest.mark.parametrize(
    ("path", "value"),
    [
        (("candidates", 0, "requirements", 0, "quantity"), -1),
        (("inventory", 0, "quantity"), -1),
        (("inventory", 0, "quantity"), float("inf")),
    ],
)
def test_rejects_invalid_quantities(path: tuple, value: object) -> None:
    payload = valid_request()
    target = payload
    for part in path[:-1]:
        target = target[part]
    target[path[-1]] = value

    with pytest.raises(ValidationError):
        RankingRequest.model_validate(payload)


def test_rejects_invalid_calendar_date() -> None:
    payload = valid_request()
    payload["as_of_date"] = "2026-02-30"

    with pytest.raises(ValidationError, match="valid date"):
        RankingRequest.model_validate(payload)


def test_rejects_unknown_fields() -> None:
    payload = valid_request()
    payload["implicit_today"] = True

    with pytest.raises(ValidationError, match="Extra inputs are not permitted"):
        RankingRequest.model_validate(payload)


def test_rejects_duplicate_inventory_rows_by_id() -> None:
    payload = valid_request()
    payload["inventory"].append(dict(payload["inventory"][0]))

    with pytest.raises(ValidationError, match="each inventory_id once"):
        RankingRequest.model_validate(payload)


def test_rejects_missing_or_unconfirmed_target_timestamp() -> None:
    payload = valid_request()
    payload["targets"] = {
        "daily": {"protein_g": 80},
        "consumed_today": {"protein_g": 25},
    }

    with pytest.raises(ValidationError, match="confirmed_at"):
        RankingRequest.model_validate(payload)
