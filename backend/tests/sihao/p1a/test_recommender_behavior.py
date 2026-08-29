from datetime import datetime, timedelta
from unittest.mock import patch

from fastapi.testclient import TestClient
from pydantic import ValidationError
import pytest

from api.index import app
from api.inventory_recommender import (
    InventoryItem,
    InventoryRecommendRequest,
    InventoryRecommendResponse,
    RecommendedRecipe,
    build_recommendation_prompt,
    format_inventory_with_expiration,
)


client = TestClient(app)


def date_from_today(days: int) -> str:
    return (datetime.now() + timedelta(days=days)).strftime("%Y-%m-%d")


def test_rejects_empty_personalization_goal():
    response = client.post("/recommender", json={"goal": "   ", "numMeals": 3})
    assert response.status_code == 400
    assert response.json()["detail"] == "Goal cannot be empty"


@pytest.mark.parametrize("meal_count", [0, 1, 4, 6, 8, 100])
def test_rejects_unsupported_meal_counts(meal_count: int):
    response = client.post(
        "/recommender", json={"goal": "balanced meals", "numMeals": meal_count}
    )
    assert response.status_code == 400
    assert response.json()["detail"] == "numMeals must be one of 3, 5, or 7"


def test_rejects_empty_inventory_recommendation_request():
    response = client.post("/inventory-recommend", json={"inventory": [], "num_recipes": 3})
    assert response.status_code == 400
    assert response.json()["detail"] == "Inventory cannot be empty"


@pytest.mark.parametrize("recipe_count", [0, 11])
def test_rejects_inventory_recipe_count_outside_supported_range(recipe_count: int):
    response = client.post(
        "/inventory-recommend",
        json={
            "inventory": [{"ingredient_id": 1, "name": "Egg", "quantity": 2}],
            "num_recipes": recipe_count,
        },
    )
    assert response.status_code == 422


def test_rejects_inventory_item_without_a_name():
    response = client.post(
        "/inventory-recommend",
        json={"inventory": [{"ingredient_id": 1, "quantity": 2}], "num_recipes": 3},
    )
    assert response.status_code == 422


def test_marks_expired_ingredients_for_recommendation_priority():
    formatted = format_inventory_with_expiration(
        [
            InventoryItem(
                ingredient_id=1,
                name="Milk",
                quantity=1,
                unit="L",
                expiration_date=date_from_today(-1),
            )
        ]
    )
    assert "EXPIRED" in formatted
    assert "❌" in formatted


def test_marks_ingredients_expiring_today_as_urgent():
    formatted = format_inventory_with_expiration(
        [
            InventoryItem(
                ingredient_id=1,
                name="Milk",
                quantity=1,
                expiration_date=date_from_today(0),
            )
        ]
    )
    assert "expires TODAY" in formatted
    assert "EXPIRING NOW" in formatted


def test_ignores_invalid_expiration_text_without_dropping_item():
    formatted = format_inventory_with_expiration(
        [
            InventoryItem(
                ingredient_id=1,
                name="Rice",
                quantity=2,
                unit="kg",
                expiration_date="not-a-date",
            )
        ]
    )
    assert formatted == "- Rice: 2.0 kg"


def test_recommendation_prompt_includes_preferences_and_exact_count():
    prompt = build_recommendation_prompt(
        inventory_text="- Egg: 2 units",
        recipes_text="ID:1 | Omelette | Ingredients: Egg",
        preferences="vegetarian",
        num_recipes=3,
    )
    assert "recommend exactly 3 recipes" in prompt
    assert "vegetarian" in prompt
    assert "Respond ONLY with valid JSON" in prompt


def test_request_model_defaults_to_five_inventory_recipes():
    request = InventoryRecommendRequest(
        inventory=[InventoryItem(ingredient_id=1, name="Egg", quantity=2)]
    )
    assert request.num_recipes == 5


def test_request_model_rejects_more_than_ten_inventory_recipes():
    with pytest.raises(ValidationError):
        InventoryRecommendRequest(
            inventory=[InventoryItem(ingredient_id=1, name="Egg", quantity=2)],
            num_recipes=11,
        )


@patch("api.index.recommend_from_inventory")
def test_returns_structured_inventory_recommendations(mock_recommend):
    mock_recommend.return_value = InventoryRecommendResponse(
        recommendations=[
            RecommendedRecipe(
                recipe_id=7,
                recipe_name="Omelette",
                match_score=90,
                ingredients_available=["Egg"],
                ingredients_missing=["Butter"],
                expiring_ingredients_used=["Egg"],
                reason="Uses available eggs",
            )
        ],
        shopping_suggestions=["Butter"],
        overall_reasoning="Use expiring food first.",
    )

    response = client.post(
        "/inventory-recommend",
        json={"inventory": [{"ingredient_id": 1, "name": "Egg", "quantity": 2}]},
    )

    assert response.status_code == 200
    assert response.json()["recommendations"][0]["recipe_name"] == "Omelette"
    assert response.json()["shopping_suggestions"] == ["Butter"]
