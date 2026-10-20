#!/usr/bin/env python3
"""Build the 500-cell determinism corpus from the real dataset.

50 recipes x 10 inventory scenarios, drawn from backend/dataset/*.csv rather than
invented, so the corpus exercises the real ingredient ids, units and quantities.

Deterministic by construction: a fixed seed, a fixed `as_of_date`, and quantities
derived from the recipe's own requirement rather than sampled freely. Re-running
this script on the same inputs produces a byte-identical file, which is what lets
the corpus be committed and compared rather than regenerated on each machine.

Every scenario plants the cases a scorer gets wrong quietly. Per the plan each
pantry carries at least two items within 3 days of expiry, at least two within 7,
at least one already expired and at least one with no expiry date at all.

    python3 p2/eval/build_corpus.py
"""

from __future__ import annotations

import csv
import json
import random
from datetime import date, timedelta
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
DATASET = ROOT / "backend" / "dataset"
OUT = Path(__file__).parent / "corpus" / "determinism-500.json"

AS_OF = date(2026, 10, 10)
SEED = 20261010
SCENARIOS = 10

LOCATIONS = ("pantry", "fridge", "freezer")


def load() -> tuple[list[dict], dict[int, dict], dict[int, list[dict]]]:
    with (DATASET / "recipes-supabase.csv").open() as fh:
        recipes = list(csv.DictReader(fh))
    with (DATASET / "ingredients-supabase.csv").open() as fh:
        ingredients = {int(r["id"]): r for r in csv.DictReader(fh)}
    requirements: dict[int, list[dict]] = {}
    with (DATASET / "recipe_ingredient_map-supabase.csv").open() as fh:
        for row in csv.DictReader(fh):
            requirements.setdefault(int(row["recipe_id"]), []).append(row)
    return recipes, ingredients, requirements


def unit_of(ingredient: dict) -> str:
    """`Ingredient.unit` in this dataset reads like '100 g'; the unit is the tail."""
    raw = (ingredient.get("unit") or "").strip()
    parts = raw.split()
    return parts[-1] if parts else "unit"


def build_scenario(
    index: int,
    recipe_id: int,
    reqs: list[dict],
    ingredients: dict[int, dict],
    rng: random.Random,
) -> dict:
    """One (recipe, pantry) cell, with the planted cases the plan asks for."""
    requirements = []
    for r in reqs:
        iid = int(r["ingredient_id"])
        raw = r["relative_unit_100"]
        qty = None if raw in ("", "None", None) else float(raw)
        requirements.append(
            {
                "ingredient_id": iid,
                "quantity": qty,
                "unit": unit_of(ingredients.get(iid, {})),
            }
        )

    # Scenario 0 is the degenerate one on purpose: an empty pantry.
    if index == 0:
        return {"requirements": requirements, "inventory": []}

    inventory = []
    n = 0

    def add(iid: int, qty: float, days: int | None, unit: str | None, loc: str) -> None:
        nonlocal n
        n += 1
        inventory.append(
            {
                "inventory_id": f"{recipe_id:05d}-{index:02d}-{n:03d}",
                "ingredient_id": iid,
                "quantity": qty,
                "unit": unit,
                "location": loc,
                "expiration_date": None if days is None else (AS_OF + timedelta(days=days)).isoformat(),
            }
        )

    ids = [r["ingredient_id"] for r in requirements]
    pool = ids or sorted(ingredients)[:4]

    for pos, iid in enumerate(pool):
        req = next((r for r in requirements if r["ingredient_id"] == iid), None)
        unit = req["unit"] if req else unit_of(ingredients.get(iid, {}))
        need = req["quantity"] if req and req["quantity"] is not None else 100.0

        # Cover some requirements fully, some partly, so `missing` is exercised
        # in both directions rather than always short or always satisfied.
        share = (0.4, 1.0, 0.0, 1.5)[(index + pos) % 4]
        qty = round(need * share, 2) if need else 1.0

        if pos == 0:
            add(iid, qty or 1.0, -2, unit, "pantry")            # already expired
        elif pos == 1:
            add(iid, qty or 1.0, 0, unit, "fridge")             # expires exactly on as_of_date
        elif pos == 2:
            add(iid, qty or 1.0, 2, unit, "fridge")             # within 3 days
        elif pos == 3:
            add(iid, qty or 1.0, 3, unit, "freezer")            # within 3 days, second one
        elif pos == 4:
            add(iid, qty or 1.0, 6, unit, "pantry")             # within 7 days
        elif pos == 5:
            add(iid, qty or 1.0, 7, unit, "pantry")             # within 7 days, second one
        elif pos == 6:
            add(iid, qty or 1.0, None, unit, "pantry")          # no expiry date
        elif pos == 7:
            add(iid, qty or 1.0, 5, None, "fridge")             # null unit, decision D2
        else:
            add(iid, qty or 1.0, 10 + pos, unit, LOCATIONS[pos % 3])

    # Guarantee the planted set even for short recipes, by splitting one
    # ingredient across locations — which the unique constraint permits and which
    # is exactly what catches a scorer that reads only the first matching row.
    first = pool[0]
    unit = next((r["unit"] for r in requirements if r["ingredient_id"] == first), "g")
    for days, loc in ((-5, "freezer"), (1, "freezer"), (4, "pantry"), (None, "fridge")):
        if not any(
            row["ingredient_id"] == first
            and row["location"] == loc
            and row["expiration_date"] == (None if days is None else (AS_OF + timedelta(days=days)).isoformat())
            for row in inventory
        ):
            add(first, round(rng.uniform(10, 120), 2), days, unit, loc)

    return {"requirements": requirements, "inventory": inventory}


def main() -> int:
    recipes, ingredients, requirements = load()
    rng = random.Random(SEED)

    cells = []
    for recipe in recipes:
        rid = int(recipe["id"])
        reqs = requirements.get(rid, [])
        for index in range(SCENARIOS):
            scenario = build_scenario(index, rid, reqs, ingredients, rng)
            cells.append(
                {
                    "cell_id": f"{rid}-{index}",
                    "recipe_id": rid,
                    "recipe_name": recipe["name"],
                    "scenario": index,
                    **scenario,
                }
            )

    doc = {
        "rule_version": "receipt-v1",
        "as_of_date": AS_OF.isoformat(),
        "seed": SEED,
        "source": "backend/dataset/*.csv",
        "cells": cells,
    }
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(doc, indent=1, sort_keys=True) + "\n")

    expired = sum(
        1 for c in cells
        if any(r["expiration_date"] and r["expiration_date"] < AS_OF.isoformat() for r in c["inventory"])
    )
    boundary = sum(
        1 for c in cells
        if any(r["expiration_date"] == AS_OF.isoformat() for r in c["inventory"])
    )
    nullunit = sum(1 for c in cells if any(r["unit"] is None for r in c["inventory"]))
    nodate = sum(1 for c in cells if any(r["expiration_date"] is None for r in c["inventory"]))
    zeroreq = sum(1 for c in cells if any(r["quantity"] == 0 for r in c["requirements"]))
    nullreq = sum(1 for c in cells if any(r["quantity"] is None for r in c["requirements"]))

    print(f"{len(cells)} cells -> {OUT.relative_to(ROOT)}")
    print(f"  with an already-expired row        {expired}")
    print(f"  with a row expiring on as_of_date  {boundary}")
    print(f"  with a row with no expiry date     {nodate}")
    print(f"  with a null stored unit            {nullunit}")
    print(f"  with a requirement of 0            {zeroreq}")
    print(f"  with an unknown requirement        {nullreq}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
