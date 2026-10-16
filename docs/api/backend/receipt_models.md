# `backend/api/receipt_models.py`

Pydantic models for the frozen P2 receipt-v1 contract.

The models deliberately reject unknown fields and invalid quantities so bad
ranking inputs fail at the API boundary instead of producing a plausible but
incorrect receipt.

## Contents

- [`ContractModel`](#contractmodel) — class
- [`Requirement`](#requirement) — class
- [`RecipeCandidate`](#recipecandidate) — class
- [`InventorySnapshot`](#inventorysnapshot) — class
- [`NutrientTargets`](#nutrienttargets) — class
- [`RankingRequest`](#rankingrequest) — class
- [`ReceiptItem`](#receiptitem) — class
- [`ScoreSubtotals`](#scoresubtotals) — class
- [`TargetOutcome`](#targetoutcome) — class
- [`Warning`](#warning) — class
- [`RankedRecipe`](#rankedrecipe) — class
- [`RankingResponse`](#rankingresponse) — class

## `ContractModel`

**class**

Base model matching the contract's additionalProperties=false rule.

## `Requirement`

**class**

Fields:

- `ingredient_id: int`
- `quantity: Optional[float]`
- `unit: str`

### `quantity_must_be_finite(cls, value: Optional[float]) -> Optional[float]`

### `unit_must_not_be_blank(cls, value: str) -> str`

## `RecipeCandidate`

**class**

Fields:

- `recipe_id: int`
- `servings: int`
- `requirements: List[Requirement]`

### `requirements_must_be_unique(cls, requirements: List[Requirement]) -> List[Requirement]`

## `InventorySnapshot`

**class**

Fields:

- `inventory_id: str`
- `ingredient_id: int`
- `quantity: float`
- `unit: Optional[str]`
- `location: Literal['pantry', 'fridge', 'freezer', 'other']`
- `expiration_date: Optional[date]`

### `quantity_must_be_finite(cls, value: float) -> float`

### `unit_must_not_be_blank(cls, value: Optional[str]) -> Optional[str]`

## `NutrientTargets`

**class**

Fields:

- `confirmed_at: datetime`
- `daily: Dict[str, float]`
- `consumed_today: Dict[str, float]`

### `nutrient_values_must_be_valid(cls, values: Dict[str, float]) -> Dict[str, float]`

## `RankingRequest`

**class**

Fields:

- `rule_version: Literal['receipt-v1']`
- `as_of_date: date`
- `candidates: List[RecipeCandidate]`
- `inventory: List[InventorySnapshot]`
- `targets: Optional[NutrientTargets]`

### `identifiers_must_be_unique(self) -> 'RankingRequest'`

## `ReceiptItem`

**class**

Fields:

- `ingredient_id: int`
- `ingredient_name: Optional[str]`
- `required_qty: Optional[float]`
- `available_qty: float`
- `unit: Optional[str]`
- `expiration_date: Optional[date]`
- `source: Literal['inventory', 'expiry', 'nutrition', 'global']`
- `points: float`
- `status: Literal['ok', 'missing', 'expired', 'unresolved_unit', 'unknown_requirement']`

## `ScoreSubtotals`

**class**

Fields:

- `inventory: float`
- `expiry: float`
- `nutrition: float`

## `TargetOutcome`

**class**

Fields:

- `remaining: Dict[str, float]`
- `over: Dict[str, float]`
- `incomplete: List[str]`

## `Warning`

**class**

Fields:

- `code: Literal['targets_unconfirmed', 'missing_nutrient_data', 'unresolved_unit', 'unknown_requirement', 'expired_stock_excluded']`
- `message: str`
- `ingredient_id: Optional[int]`

## `RankedRecipe`

**class**

Fields:

- `recipe_id: int`
- `rank_score: float`
- `subtotals: ScoreSubtotals`
- `items: List[ReceiptItem]`
- `targets: Optional[TargetOutcome]`
- `warnings: List[Warning]`

## `RankingResponse`

**class**

Fields:

- `rule_version: Literal['receipt-v1']`
- `as_of_date: date`
- `results: List[RankedRecipe]`
