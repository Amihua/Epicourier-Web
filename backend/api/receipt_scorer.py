"""Offline, deterministic ranking for receipt-v1 recipe candidates."""

from __future__ import annotations

from datetime import date
from typing import Iterable, List, Optional, Sequence, Tuple

from api.receipt_models import (
    InventorySnapshot,
    NutrientTargets,
    RankedRecipe,
    RankingRequest,
    RankingResponse,
    ReceiptItem,
    RecipeCandidate,
    Requirement,
    ScoreSubtotals,
    Warning,
)
from api.target_math import calculate_target_contribution, round_half_up

INVENTORY_MATCH_POINTS = 1.0
EXPIRY_RESCUE_POINTS = 1.0
EXPIRY_WINDOW_DAYS = 3

WARNING_ORDER = {
    "unknown_requirement": 0,
    "unresolved_unit": 1,
    "expired_stock_excluded": 2,
    "missing_nutrient_data": 3,
    "targets_unconfirmed": 4,
}


def score_rankings(request: RankingRequest) -> RankingResponse:
    """Score every candidate and return a stable total ordering."""

    inventory = sorted(
        request.inventory,
        key=lambda row: (row.ingredient_id, row.inventory_id),
    )
    results = [
        score_candidate(candidate, inventory, request.as_of_date, request.targets)
        for candidate in request.candidates
    ]
    results.sort(key=lambda result: (-result.rank_score, result.recipe_id))
    return RankingResponse(as_of_date=request.as_of_date, results=results)


def score_candidate(
    candidate: RecipeCandidate,
    inventory: Sequence[InventorySnapshot],
    as_of_date: date,
    targets: Optional[NutrientTargets],
) -> RankedRecipe:
    """Build an auditable receipt for one recipe candidate."""

    items: List[ReceiptItem] = []
    expiry_items: List[ReceiptItem] = []
    warnings: List[Warning] = []
    inventory_points = 0.0
    expiry_points = 0.0

    rows_by_ingredient = {}
    for row in inventory:
        rows_by_ingredient.setdefault(row.ingredient_id, []).append(row)

    for requirement in sorted(
        candidate.requirements, key=lambda item: item.ingredient_id
    ):
        rows = rows_by_ingredient.get(requirement.ingredient_id, [])
        item, item_warnings, match_points, urgency_points = _score_requirement(
            candidate,
            requirement,
            rows,
            as_of_date,
        )
        items.append(item)
        warnings.extend(item_warnings)
        inventory_points += match_points
        expiry_points += urgency_points

        if urgency_points:
            expiry_items.append(
                ReceiptItem(
                    ingredient_id=requirement.ingredient_id,
                    required_qty=None,
                    available_qty=item.available_qty,
                    unit=item.unit,
                    expiration_date=item.expiration_date,
                    source="expiry",
                    points=urgency_points,
                    status="ok",
                )
            )

    items.extend(expiry_items)

    nutrition_points = 0.0
    target_outcome = None
    if targets is not None:
        target_result = calculate_target_contribution(targets, recipe_nutrients=None)
        target_outcome = target_result.outcome
        nutrition_points = target_result.points
        if target_outcome.incomplete:
            keys = ", ".join(target_outcome.incomplete)
            items.append(
                ReceiptItem(
                    ingredient_id=-1,
                    required_qty=None,
                    available_qty=0,
                    unit=None,
                    expiration_date=None,
                    source="nutrition",
                    points=0,
                    status="unknown_requirement",
                )
            )
            warnings.append(
                Warning(
                    code="missing_nutrient_data",
                    message=(
                        f"recipe {candidate.recipe_id} has no nutrient totals for "
                        f"confirmed targets: {keys}"
                    ),
                )
            )

    subtotals = ScoreSubtotals(
        inventory=round_half_up(inventory_points),
        expiry=round_half_up(expiry_points),
        nutrition=round_half_up(nutrition_points),
    )
    rank_score = round_half_up(inventory_points + expiry_points + nutrition_points)
    warnings.sort(
        key=lambda warning: (
            WARNING_ORDER[warning.code],
            warning.ingredient_id if warning.ingredient_id is not None else -1,
            warning.message,
        )
    )

    return RankedRecipe(
        recipe_id=candidate.recipe_id,
        rank_score=rank_score,
        subtotals=subtotals,
        items=items,
        targets=target_outcome,
        warnings=warnings,
    )


def inventory_contribution(
    required_qty: Optional[float], available_qty: float
) -> float:
    """Award one ranking point when a known requirement is fully covered."""

    if required_qty is None:
        return 0.0
    return INVENTORY_MATCH_POINTS if available_qty >= required_qty else 0.0


def expiry_contribution(
    required_qty: Optional[float],
    available_qty: float,
    expiration_dates: Iterable[Optional[date]],
    as_of_date: date,
    inventory_points: float,
) -> float:
    """Give partial-credit urgency to an otherwise-uncovered requirement.

    This avoids double-counting a fully covered ingredient while still moving a
    recipe with usable, soon-expiring stock ahead of an equally incomplete one.
    """

    if (
        required_qty is None
        or required_qty <= 0
        or available_qty <= 0
        or inventory_points > 0
    ):
        return 0.0

    for expiration_date in expiration_dates:
        if expiration_date is None:
            continue
        days_left = (expiration_date - as_of_date).days
        if 0 <= days_left <= EXPIRY_WINDOW_DAYS:
            return EXPIRY_RESCUE_POINTS
    return 0.0


def _score_requirement(
    candidate: RecipeCandidate,
    requirement: Requirement,
    rows: Sequence[InventorySnapshot],
    as_of_date: date,
) -> Tuple[ReceiptItem, List[Warning], float, float]:
    required_qty = (
        None
        if requirement.quantity is None
        else requirement.quantity * candidate.servings
    )
    usable_rows = [
        row
        for row in rows
        if row.expiration_date is None or row.expiration_date >= as_of_date
    ]
    expired_rows = [row for row in rows if row not in usable_rows]
    compatible_rows = [row for row in usable_rows if row.unit == requirement.unit]
    unresolved_rows = [row for row in usable_rows if row.unit != requirement.unit]
    available_qty = sum(row.quantity for row in compatible_rows)

    representative = _representative_row(compatible_rows or usable_rows or rows)
    output_unit = (
        requirement.unit
        if compatible_rows or not rows
        else representative.unit
        if representative is not None
        else requirement.unit
    )
    expiration_date = (
        representative.expiration_date if representative is not None else None
    )

    warnings = []
    if required_qty is None:
        status = "unknown_requirement"
        warnings.append(
            Warning(
                code="unknown_requirement",
                message=(
                    f"recipe {candidate.recipe_id} does not state a quantity for "
                    f"ingredient {requirement.ingredient_id}"
                ),
                ingredient_id=requirement.ingredient_id,
            )
        )
    elif not usable_rows and expired_rows:
        status = "expired"
    elif unresolved_rows and not compatible_rows:
        status = "unresolved_unit"
    elif available_qty >= required_qty:
        status = "ok"
    else:
        status = "missing"

    if unresolved_rows:
        if any(row.unit is None for row in unresolved_rows):
            message = (
                f"inventory row for ingredient {requirement.ingredient_id} "
                "stores no unit"
            )
        else:
            units = ", ".join(sorted({str(row.unit) for row in unresolved_rows}))
            message = (
                f"ingredient {requirement.ingredient_id} requires {requirement.unit} "
                f"but inventory stores {units}"
            )
        warnings.append(
            Warning(
                code="unresolved_unit",
                message=message,
                ingredient_id=requirement.ingredient_id,
            )
        )

    for expired_date in sorted(
        {row.expiration_date for row in expired_rows if row.expiration_date is not None}
    ):
        warnings.append(
            Warning(
                code="expired_stock_excluded",
                message=(
                    f"inventory row for ingredient {requirement.ingredient_id} "
                    f"expired on {expired_date.isoformat()}"
                ),
                ingredient_id=requirement.ingredient_id,
            )
        )

    match_points = inventory_contribution(required_qty, available_qty)
    urgency_points = expiry_contribution(
        required_qty,
        available_qty,
        (row.expiration_date for row in compatible_rows),
        as_of_date,
        match_points,
    )
    return (
        ReceiptItem(
            ingredient_id=requirement.ingredient_id,
            required_qty=required_qty,
            available_qty=available_qty,
            unit=output_unit,
            expiration_date=expiration_date,
            source="inventory",
            points=match_points,
            status=status,
        ),
        warnings,
        match_points,
        urgency_points,
    )


def _representative_row(
    rows: Sequence[InventorySnapshot],
) -> Optional[InventorySnapshot]:
    if not rows:
        return None
    return min(rows, key=lambda row: row.inventory_id)
