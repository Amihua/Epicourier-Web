import os
import secrets
from functools import lru_cache
from typing import Optional

from dotenv import load_dotenv
from fastapi import Depends, FastAPI, Header, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from supabase import Client, create_client

from api.inventory_recommender import (
    InventoryRecommendRequest,
    recommend_from_inventory,
)
from api.receipt_models import RankingRequest, RankingResponse
from api.receipt_scorer import score_rankings

load_dotenv()

app = FastAPI()

# Allow frontend (Next.js) to call API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/test")
def test_endpoint():
    supabase = load_supabase_client()
    data = supabase.table("Recipe").select("*").limit(5).execute()
    return {"message": data.data}


@lru_cache()
def load_supabase_client() -> Client:
    """Build the legacy Supabase client only for endpoints that need it."""

    url = os.getenv("NEXT_PUBLIC_SUPABASE_URL")
    key = os.getenv("NEXT_PUBLIC_SUPABASE_ANON_KEY")
    if not url or not key:
        raise HTTPException(status_code=503, detail="Supabase is not configured")
    return create_client(url, key)


def create_meal_plan(goal: str, n_meals: int):
    """Lazy adapter for the legacy Gemini recommender."""

    from api.recommender import create_meal_plan as create_legacy_meal_plan

    return create_legacy_meal_plan(goal, n_meals=n_meals)


class RecommendRequest(BaseModel):
    goal: str
    num_meals: int = Field(..., alias="numMeals")

    model_config = {"populate_by_name": True}


@app.post("/recommender")
def recommend_meals(req: RecommendRequest):
    """Main recommender endpoint with input validation."""
    # Validate goal
    if not req.goal or not req.goal.strip():
        raise HTTPException(status_code=400, detail="Goal cannot be empty")

    # Validate number of meals
    if req.num_meals not in [3, 5, 7]:
        raise HTTPException(
            status_code=400, detail="numMeals must be one of 3, 5, or 7"
        )

    plan, expanded_goal = create_meal_plan(req.goal, n_meals=req.num_meals)
    return {"recipes": plan, "goal_expanded": expanded_goal}


@app.post("/inventory-recommend")
def inventory_recommend(req: InventoryRecommendRequest):
    """
    AI-powered recipe recommendations based on user's inventory.

    Prioritizes recipes that use expiring ingredients.
    Uses Gemini 2.5 Flash for intelligent recommendations.
    """
    # Validate inventory
    if not req.inventory:
        raise HTTPException(status_code=400, detail="Inventory cannot be empty")

    # Validate num_recipes
    if req.num_recipes < 1 or req.num_recipes > 10:
        raise HTTPException(
            status_code=400, detail="num_recipes must be between 1 and 10"
        )

    try:
        result = recommend_from_inventory(
            inventory=req.inventory,
            preferences=req.preferences,
            num_recipes=req.num_recipes,
        )
        return result
    except ValueError as e:
        raise HTTPException(status_code=500, detail=str(e))
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Failed to generate recommendations: {str(e)}"
        )


def require_internal_token(
    provided: Optional[str] = Header(default=None, alias="X-Internal-Token"),
) -> None:
    """Require the gateway's shared secret when the service configures one."""

    expected = os.getenv("RECEIPT_INTERNAL_TOKEN")
    if expected and (
        provided is None or not secrets.compare_digest(provided, expected)
    ):
        raise HTTPException(status_code=401, detail="Invalid internal token")


@app.post(
    "/receipt/rank",
    response_model=RankingResponse,
    dependencies=[Depends(require_internal_token)],
)
def receipt_rank(request: RankingRequest) -> RankingResponse:
    """Rank receipt-v1 candidates without network, database or Gemini calls."""

    return score_rankings(request)
