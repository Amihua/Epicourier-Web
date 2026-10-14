from __future__ import annotations

import json
from pathlib import Path

from fastapi.testclient import TestClient

from api.index import app

ROOT = Path(__file__).resolve().parents[4]
FIXTURE = ROOT / "p2" / "contracts" / "fixtures" / "ranking-request.golden.json"


def payload() -> dict:
    return json.loads(FIXTURE.read_text())


def test_receipt_rank_runs_without_external_credentials(monkeypatch) -> None:
    monkeypatch.delenv("GEMINI_KEY", raising=False)
    monkeypatch.delenv("NEXT_PUBLIC_SUPABASE_URL", raising=False)
    monkeypatch.delenv("NEXT_PUBLIC_SUPABASE_ANON_KEY", raising=False)
    monkeypatch.delenv("RECEIPT_INTERNAL_TOKEN", raising=False)

    response = TestClient(app).post("/receipt/rank", json=payload())

    assert response.status_code == 200
    assert response.json()["rule_version"] == "receipt-v1"
    assert [result["recipe_id"] for result in response.json()["results"]] == [
        101,
        102,
        103,
    ]


def test_receipt_api_returns_ranking_points_not_legacy_percentage(monkeypatch) -> None:
    monkeypatch.delenv("RECEIPT_INTERNAL_TOKEN", raising=False)

    response = TestClient(app).post("/receipt/rank", json=payload())
    first = response.json()["results"][0]

    assert response.status_code == 200
    assert first["rank_score"] == 3.0
    assert "match_score" not in first


def test_receipt_rank_rejects_invalid_input_with_details(monkeypatch) -> None:
    monkeypatch.delenv("RECEIPT_INTERNAL_TOKEN", raising=False)
    invalid = payload()
    invalid["inventory"][0]["quantity"] = -1

    response = TestClient(app).post("/receipt/rank", json=invalid)

    assert response.status_code == 422
    assert response.json()["detail"][0]["loc"][-1] == "quantity"


def test_receipt_rank_requires_configured_internal_token(monkeypatch) -> None:
    monkeypatch.setenv("RECEIPT_INTERNAL_TOKEN", "gateway-secret")
    client = TestClient(app)

    missing = client.post("/receipt/rank", json=payload())
    wrong = client.post(
        "/receipt/rank",
        json=payload(),
        headers={"X-Internal-Token": "wrong"},
    )
    accepted = client.post(
        "/receipt/rank",
        json=payload(),
        headers={"X-Internal-Token": "gateway-secret"},
    )

    assert missing.status_code == 401
    assert wrong.status_code == 401
    assert accepted.status_code == 200


def test_global_nutrition_warning_has_no_fake_ingredient_id(monkeypatch) -> None:
    monkeypatch.delenv("RECEIPT_INTERNAL_TOKEN", raising=False)
    request = payload()
    request["targets"] = {
        "confirmed_at": "2026-10-10T08:00:00Z",
        "daily": {"protein_g": 100},
        "consumed_today": {"protein_g": 80},
    }

    response = TestClient(app).post("/receipt/rank", json=request)
    warning = next(
        item
        for item in response.json()["results"][0]["warnings"]
        if item["code"] == "missing_nutrient_data"
    )

    assert response.status_code == 200
    assert "ingredient_id" not in warning
