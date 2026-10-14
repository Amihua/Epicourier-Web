"""Pydantic models for the frozen P2 receipt-v1 contract.

The models deliberately reject unknown fields and invalid quantities so bad
ranking inputs fail at the API boundary instead of producing a plausible but
incorrect receipt.
"""

from __future__ import annotations

import math
import re
from datetime import date, datetime
from typing import Dict, List, Literal, Optional

from pydantic import BaseModel, ConfigDict, Field, field_validator, model_validator

RULE_VERSION = "receipt-v1"
NUTRIENT_KEY = re.compile(r"^[a-z][a-z0-9_]*$")


class ContractModel(BaseModel):
    """Base model matching the contract's additionalProperties=false rule."""

    model_config = ConfigDict(extra="forbid")


class Requirement(ContractModel):
    ingredient_id: int
    quantity: Optional[float] = Field(ge=0)
    unit: str = Field(min_length=1)

    @field_validator("quantity")
    @classmethod
    def quantity_must_be_finite(cls, value: Optional[float]) -> Optional[float]:
        if value is not None and not math.isfinite(value):
            raise ValueError("quantity must be finite")
        return value

    @field_validator("unit")
    @classmethod
    def unit_must_not_be_blank(cls, value: str) -> str:
        if not value.strip():
            raise ValueError("unit must not be blank")
        return value


class RecipeCandidate(ContractModel):
    recipe_id: int
    servings: int = Field(default=1, ge=1)
    requirements: List[Requirement]

    @field_validator("requirements")
    @classmethod
    def requirements_must_be_unique(
        cls, requirements: List[Requirement]
    ) -> List[Requirement]:
        ingredient_ids = [item.ingredient_id for item in requirements]
        if len(ingredient_ids) != len(set(ingredient_ids)):
            raise ValueError("requirements must contain each ingredient_id once")
        return requirements


class InventorySnapshot(ContractModel):
    inventory_id: str = Field(min_length=1)
    ingredient_id: int
    quantity: float = Field(ge=0)
    unit: Optional[str]
    location: Literal["pantry", "fridge", "freezer", "other"] = "other"
    expiration_date: Optional[date]

    @field_validator("quantity")
    @classmethod
    def quantity_must_be_finite(cls, value: float) -> float:
        if not math.isfinite(value):
            raise ValueError("quantity must be finite")
        return value

    @field_validator("unit")
    @classmethod
    def unit_must_not_be_blank(cls, value: Optional[str]) -> Optional[str]:
        if value is not None and not value.strip():
            raise ValueError("unit must be null or a non-blank string")
        return value


def _validate_nutrient_map(values: Dict[str, float]) -> Dict[str, float]:
    for key, value in values.items():
        if not NUTRIENT_KEY.fullmatch(key):
            raise ValueError(f"invalid nutrient key: {key!r}")
        if not math.isfinite(value) or value < 0:
            raise ValueError(f"nutrient {key!r} must be finite and non-negative")
    return values


class NutrientTargets(ContractModel):
    confirmed_at: datetime
    daily: Dict[str, float]
    consumed_today: Dict[str, float]

    @field_validator("daily", "consumed_today")
    @classmethod
    def nutrient_values_must_be_valid(
        cls, values: Dict[str, float]
    ) -> Dict[str, float]:
        return _validate_nutrient_map(values)


class RankingRequest(ContractModel):
    rule_version: Literal["receipt-v1"]
    as_of_date: date
    candidates: List[RecipeCandidate] = Field(min_length=1)
    inventory: List[InventorySnapshot]
    targets: Optional[NutrientTargets]

    @model_validator(mode="after")
    def identifiers_must_be_unique(self) -> "RankingRequest":
        recipe_ids = [candidate.recipe_id for candidate in self.candidates]
        if len(recipe_ids) != len(set(recipe_ids)):
            raise ValueError("candidates must contain each recipe_id once")

        inventory_ids = [item.inventory_id for item in self.inventory]
        if len(inventory_ids) != len(set(inventory_ids)):
            raise ValueError("inventory must contain each inventory_id once")
        return self


class ReceiptItem(ContractModel):
    ingredient_id: int
    ingredient_name: Optional[str] = None
    required_qty: Optional[float]
    available_qty: float = Field(ge=0)
    unit: Optional[str]
    expiration_date: Optional[date]
    source: Literal["inventory", "expiry", "nutrition", "global"]
    points: float
    status: Literal[
        "ok", "missing", "expired", "unresolved_unit", "unknown_requirement"
    ]


class ScoreSubtotals(ContractModel):
    inventory: float
    expiry: float
    nutrition: float


class TargetOutcome(ContractModel):
    remaining: Dict[str, float]
    over: Dict[str, float]
    incomplete: List[str]


class Warning(ContractModel):
    code: Literal[
        "targets_unconfirmed",
        "missing_nutrient_data",
        "unresolved_unit",
        "unknown_requirement",
        "expired_stock_excluded",
    ]
    message: str
    ingredient_id: Optional[int] = None


class RankedRecipe(ContractModel):
    recipe_id: int
    rank_score: float
    subtotals: ScoreSubtotals
    items: List[ReceiptItem]
    targets: Optional[TargetOutcome]
    warnings: List[Warning]


class RankingResponse(ContractModel):
    rule_version: Literal["receipt-v1"] = RULE_VERSION
    as_of_date: date
    results: List[RankedRecipe]
