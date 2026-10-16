"""Contract tests: the Python side must agree with the frozen JSON contract.

These are the tests the P2 CI job runs. They import no application module, so they
stay runnable while `api.recommender` cannot be imported offline — see
docs/p2/evaluation.md.
"""

from __future__ import annotations

import json
from pathlib import Path

import pytest

CONTRACTS = Path(__file__).resolve().parents[3] / "p2" / "contracts"
SCHEMA = CONTRACTS / "receipt-v1.schema.json"
FIXTURE = CONTRACTS / "fixtures" / "ranking-request.golden.json"

RULE_VERSION = "receipt-v1"
AS_OF_DATE = "2026-10-10"


@pytest.fixture(scope="module")
def schema() -> dict:
    return json.loads(SCHEMA.read_text())


@pytest.fixture(scope="module")
def golden() -> dict:
    return json.loads(FIXTURE.read_text())


def test_contract_files_exist() -> None:
    assert SCHEMA.is_file(), f"missing {SCHEMA}"
    assert FIXTURE.is_file(), f"missing {FIXTURE}"


def test_schema_declares_every_contract_object(schema: dict) -> None:
    expected = {
        "RankingRequest",
        "RankingResponse",
        "ReceiptItem",
        "RankedRecipe",
        "PreviewRequest",
        "PreviewResponse",
        "ConfirmRequest",
        "ConfirmResponse",
    }
    assert expected <= set(schema["$defs"]), expected - set(schema["$defs"])


def test_every_definition_rejects_unknown_fields(schema: dict) -> None:
    """A consumer that invents a field must fail the check, not diverge quietly.

    `additionalProperties` may be `false`, or a schema when the object is a map
    with arbitrary keys and constrained values — `nutrientMap` is the latter.
    What it may not be is `true` or absent, which lets anything through.
    """
    lax = []
    for name, body in schema["$defs"].items():
        if body.get("type") != "object":
            continue
        extra = body.get("additionalProperties", True)
        if extra is False or isinstance(extra, dict):
            continue
        lax.append(name)
    assert lax == [], f"definitions allowing arbitrary unknown fields: {lax}"


def test_nutrient_map_constrains_its_values(schema: dict) -> None:
    """The one deliberate open map must still pin its value type and key shape."""
    nm = schema["$defs"]["nutrientMap"]
    assert nm["additionalProperties"] == {"type": "number"}
    assert "pattern" in nm["propertyNames"]


def test_golden_fixture_matches_the_frozen_rule_version_and_date(golden: dict) -> None:
    assert golden["rule_version"] == RULE_VERSION
    assert golden["as_of_date"] == AS_OF_DATE


def test_receipt_item_status_and_source_enums_are_closed(schema: dict) -> None:
    item = schema["$defs"]["ReceiptItem"]["properties"]
    assert set(item["status"]["enum"]) == {
        "ok",
        "missing",
        "expired",
        "unresolved_unit",
        "unknown_requirement",
    }
    assert set(item["source"]["enum"]) == {"inventory", "expiry", "nutrition", "global"}


def test_zero_requirement_is_representable_and_present(golden: dict) -> None:
    """A requirement of 0 must survive the contract, because `|| 100` turns it into 100."""
    quantities = [
        req["quantity"] for cand in golden["candidates"] for req in cand["requirements"]
    ]
    assert 0 in quantities, "the golden fixture must carry a zero requirement"
    assert None in quantities, "the golden fixture must carry an unknown requirement"


def test_fixture_carries_the_expiry_boundary_row(golden: dict) -> None:
    """A row expiring exactly on as_of_date is still usable; a scorer using <= fails only here."""
    dates = [row["expiration_date"] for row in golden["inventory"]]
    assert AS_OF_DATE in dates, "no row expires exactly on as_of_date"
    assert any(d is not None and d < AS_OF_DATE for d in dates), (
        "no already-expired row"
    )
    assert None in dates, "no row without an expiry date"


def test_fixture_has_one_ingredient_in_two_locations(golden: dict) -> None:
    """The unique constraint is per (user, ingredient, location), so usable quantity sums."""
    seen: dict[int, int] = {}
    for row in golden["inventory"]:
        seen[row["ingredient_id"]] = seen.get(row["ingredient_id"], 0) + 1
    assert any(count >= 2 for count in seen.values()), "no ingredient appears twice"


def test_fixture_has_a_null_unit_row(golden: dict) -> None:
    """user_inventory.unit is nullable; decision D2 says that is unresolved, not a fallback."""
    assert any(row["unit"] is None for row in golden["inventory"])
