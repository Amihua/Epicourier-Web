#!/usr/bin/env python3
"""Measure the old recommender's baseline. NOT YET RUN — see p2/baseline/README.md.

Two figures, and they are different kinds of claim:

  (a) decomposable  how many returned scores break down into per-ingredient line
                    items. This is 0/300 by construction and needs no calls at
                    all: InventoryRecommendResponse has match_score and a
                    free-text reason and no per-ingredient field. The script
                    re-derives it from the live model class rather than trusting
                    the number, so it fails if the schema ever gains such a field.

  (b) X             the fraction of (pantry, rank-position) cells whose recipe_id
                    or match_score changes across repeats of identical input.
                    This is the real baseline and it needs 30 live calls.

Archive policy: every raw response body is written to responses/ before anything
is computed, so the measurement can be recomputed without calling again, and so a
reviewer can check the computation against the bodies.

    python3 p2/baseline/run_baseline.py --check-schema-only   # (a), no calls
    python3 p2/baseline/run_baseline.py                       # (a) and (b)
"""

from __future__ import annotations

import argparse
import json
import os
import sys
from datetime import datetime, timezone
from pathlib import Path

HERE = Path(__file__).parent
ROOT = HERE.parents[1]
PANTRIES = HERE / "pantries"
RESPONSES = HERE / "responses"
RESULT = HERE / "baseline-result.json"

REPEATS = 3
NUM_RECIPES = 10          # the cap at inventory_recommender.py
ENDPOINT = "/inventory-recommend"


def check_schema() -> dict:
    """Figure (a), derived from the response model rather than asserted."""
    sys.path.insert(0, str(ROOT / "backend"))
    os.environ.setdefault("GEMINI_KEY", "offline-placeholder-not-a-real-key")
    os.environ.setdefault("NEXT_PUBLIC_SUPABASE_URL", "https://placeholder.supabase.co")
    os.environ.setdefault("NEXT_PUBLIC_SUPABASE_ANON_KEY", "offline-placeholder")
    from api.inventory_recommender import RecommendedRecipe  # noqa: PLC0415

    fields = list(RecommendedRecipe.model_fields)
    per_ingredient_contribution = [
        f for f in fields
        if any(token in f for token in ("line", "item", "contribution", "breakdown", "receipt", "points"))
    ]
    return {
        "response_fields": fields,
        "fields_that_could_carry_a_decomposition": per_ingredient_contribution,
        "decomposable_scores": 0 if not per_ingredient_contribution else None,
        "denominator": {
            "calls": 10 * REPEATS,
            "cells": 10 * NUM_RECIPES,
            "returned_objects_max": 10 * REPEATS * NUM_RECIPES,
        },
        "basis": "definitional: no field in the response model can hold a per-ingredient contribution",
    }


def run_live() -> dict:
    """Figure (b). Requires a running backend and a real model key."""
    try:
        import httpx  # noqa: PLC0415
    except ImportError:
        return {"status": "not_collected", "reason": "httpx is not installed"}

    base = os.environ.get("EPICOURIER_BACKEND_URL")
    if not base:
        return {
            "status": "not_collected",
            "reason": "EPICOURIER_BACKEND_URL is unset; no backend to call",
        }
    if not os.environ.get("GEMINI_KEY") or os.environ["GEMINI_KEY"].startswith("offline-"):
        return {"status": "not_collected", "reason": "no real GEMINI_KEY in the environment"}
    if not PANTRIES.is_dir() or not any(PANTRIES.glob("*.json")):
        return {"status": "not_collected", "reason": f"no pantry fixtures in {PANTRIES}"}

    RESPONSES.mkdir(exist_ok=True)
    cells: dict[tuple[str, int], list[tuple[object, object]]] = {}

    for pantry_file in sorted(PANTRIES.glob("*.json")):
        payload = json.loads(pantry_file.read_text())
        payload["num_recipes"] = NUM_RECIPES
        for repeat in range(REPEATS):
            response = httpx.post(f"{base}{ENDPOINT}", json=payload, timeout=120)
            response.raise_for_status()
            body = response.json()
            # Archive before computing anything.
            (RESPONSES / f"{pantry_file.stem}-r{repeat}.json").write_text(
                json.dumps(body, indent=1, sort_keys=True) + "\n"
            )
            for position, rec in enumerate(body.get("recommendations", [])):
                cells.setdefault((pantry_file.stem, position), []).append(
                    (rec.get("recipe_id"), rec.get("match_score"))
                )

    unstable = sum(1 for values in cells.values() if len(set(values)) > 1)
    return {
        "status": "collected",
        "cells": len(cells),
        "repeats": REPEATS,
        "unstable_cells": unstable,
        "X": round(unstable / len(cells), 4) if cells else None,
        "archive": str(RESPONSES.relative_to(ROOT)),
    }


def main() -> int:
    parser = argparse.ArgumentParser(description="old-recommender baseline")
    parser.add_argument("--check-schema-only", action="store_true")
    args = parser.parse_args()

    result = {
        "measured_at": datetime.now(timezone.utc).isoformat(timespec="seconds"),
        "commit": os.environ.get("GITHUB_SHA", "unknown"),
        "decomposability": check_schema(),
        "variance": {"status": "skipped", "reason": "--check-schema-only"}
        if args.check_schema_only
        else run_live(),
    }

    print(json.dumps(result, indent=2))
    RESULT.write_text(json.dumps(result, indent=2) + "\n")

    d = result["decomposability"]
    print(
        f"\n(a) decomposable scores: {d['decomposable_scores']}/"
        f"{d['denominator']['returned_objects_max']} — {d['basis']}",
        file=sys.stderr,
    )
    v = result["variance"]
    if v["status"] == "collected":
        print(f"(b) X = {v['X']} over {v['cells']} cells", file=sys.stderr)
    else:
        print(f"(b) X: NOT COLLECTED — {v['reason']}", file=sys.stderr)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
