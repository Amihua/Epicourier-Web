#!/usr/bin/env python3
"""M0 offline evaluation harness for the receipt contract v1.

Checks a receipt against the frozen contract and against hand-written expectations.
No network, no Gemini key, no Supabase, no third-party packages: it has to run in CI
before any dependency install, and it has to keep working while the backend cannot be
imported offline (api/recommender.py:121 builds a Gemini client at module level).

Exit code is 0 only if every case reached its declared outcome. A case with
"must_pass": false is expected to be rejected; if the harness fails to reject it, that
is a harness failure, because a suite that cannot fail proves nothing.

    python3 p2/eval/run_eval.py
    python3 p2/eval/run_eval.py --case corrupted
"""

from __future__ import annotations

import argparse
import json
import random
import sys
from pathlib import Path

CASES_DIR = Path(__file__).parent / "cases"
FIXTURE = Path(__file__).parent.parent / "contracts" / "fixtures" / "ranking-request.golden.json"

RULE_VERSION = "receipt-v1"
VALID_STATUS = {"ok", "missing", "expired", "unresolved_unit", "unknown_requirement"}
VALID_SOURCE = {"inventory", "expiry", "nutrition", "global"}


def round_points(value: float) -> float:
    """Contract §5: rounded once, at the end, to 2 dp."""
    return round(value + 1e-12, 2)


def requirements_by_recipe(fixture: dict) -> dict[int, dict[int, float | None]]:
    out: dict[int, dict[int, float | None]] = {}
    for cand in fixture["candidates"]:
        servings = cand.get("servings", 1)
        reqs: dict[int, float | None] = {}
        for req in cand["requirements"]:
            qty = req["quantity"]
            reqs[req["ingredient_id"]] = None if qty is None else qty * servings
        out[cand["recipe_id"]] = reqs
    return out


def check_receipt(receipt: dict, fixture: dict) -> list[str]:
    """Return a list of contract violations. Empty means the receipt is sound."""
    problems: list[str] = []
    as_of = receipt.get("as_of_date")

    if receipt.get("rule_version") != RULE_VERSION:
        problems.append(f"rule_version: expected {RULE_VERSION!r}, got {receipt.get('rule_version')!r}")
    if as_of != fixture_as_of(fixture):
        problems.append(f"as_of_date: expected {fixture_as_of(fixture)!r}, got {as_of!r}")

    required = requirements_by_recipe(fixture)
    results = receipt.get("results", [])

    # Contract §4: rank_score desc, then recipe_id asc.
    keys = [(-r["rank_score"], r["recipe_id"]) for r in results]
    if keys != sorted(keys):
        order = [(r["recipe_id"], r["rank_score"]) for r in results]
        problems.append(f"ordering_violation: results are not rank_score desc then recipe_id asc: {order}")

    for res in results:
        rid = res["recipe_id"]
        items = res.get("items", [])

        # Contract §5: the receipt must add up, which is the whole point of a receipt.
        total = round_points(sum(i["points"] for i in items))
        if total != round_points(res["rank_score"]):
            problems.append(
                f"points_sum_mismatch: recipe {rid} items sum to {total} but rank_score is {res['rank_score']}"
            )

        subtotal = round_points(sum(res["subtotals"].values()))
        if subtotal != round_points(res["rank_score"]):
            problems.append(
                f"subtotal_mismatch: recipe {rid} subtotals sum to {subtotal} but rank_score is {res['rank_score']}"
            )

        for item in items:
            iid = item["ingredient_id"]

            if item["status"] not in VALID_STATUS:
                problems.append(f"bad_status: recipe {rid} ingredient {iid} has status {item['status']!r}")
            if item["source"] not in VALID_SOURCE:
                problems.append(f"bad_source: recipe {rid} ingredient {iid} has source {item['source']!r}")

            # Contract §5: expired stock is not available. Expiring ON as_of_date is still usable.
            exp = item.get("expiration_date")
            if exp is not None and as_of is not None and exp < as_of:
                if item["available_qty"] != 0:
                    problems.append(
                        f"expired_counted_as_available: recipe {rid} ingredient {iid} expired {exp} "
                        f"but reports available_qty {item['available_qty']}"
                    )
                if item["status"] != "expired":
                    problems.append(
                        f"expired_wrong_status: recipe {rid} ingredient {iid} expired {exp} "
                        f"but status is {item['status']!r}"
                    )

            if item["available_qty"] < 0:
                problems.append(f"negative_available: recipe {rid} ingredient {iid}")

            # The requirement in the receipt must be the requirement in the fixture.
            # This is what catches (relative_unit_100 || 100) turning a 0 into 100.
            if item["source"] == "inventory" and rid in required and iid in required[rid]:
                expected_req = required[rid][iid]
                actual_req = item["required_qty"]
                if expected_req is None and actual_req is not None:
                    problems.append(
                        f"unknown_requirement_defaulted: recipe {rid} ingredient {iid} has no stated "
                        f"quantity but the receipt claims {actual_req}"
                    )
                elif expected_req is not None and actual_req != expected_req:
                    label = "zero_requirement_defaulted" if expected_req == 0 else "requirement_mismatch"
                    problems.append(
                        f"{label}: recipe {rid} ingredient {iid} requires {expected_req} "
                        f"but the receipt claims {actual_req}"
                    )

            if item["status"] == "unknown_requirement" and item["required_qty"] is not None:
                problems.append(
                    f"unknown_requirement_with_quantity: recipe {rid} ingredient {iid} "
                    f"claims {item['required_qty']}"
                )

        targets = res.get("targets")
        if targets is not None:
            # Contract §6: overage is preserved, not clamped away.
            for key, value in targets.get("remaining", {}).items():
                if value < 0:
                    problems.append(f"negative_remaining: recipe {rid} nutrient {key} is {value}")
            for key, value in targets.get("over", {}).items():
                if value < 0:
                    problems.append(f"negative_over: recipe {rid} nutrient {key} is {value}")

    return problems


def fixture_as_of(fixture: dict) -> str:
    return fixture["as_of_date"]


def check_shuffle_invariance(fixture: dict, rounds: int = 20, seed: int = 20261010) -> list[str]:
    """Contract §4: perturbing inventory order must not change anything.

    Until the scorer exists this checks the harness's own view of the input: the usable
    quantity per (recipe, ingredient) must be identical under every shuffle. A scorer that
    takes the first matching row instead of summing fails the same check later.
    """
    problems: list[str] = []
    rng = random.Random(seed)
    baseline = None
    for _ in range(rounds):
        inventory = list(fixture["inventory"])
        rng.shuffle(inventory)
        usable: dict[int, float] = {}
        for row in inventory:
            exp = row["expiration_date"]
            if exp is not None and exp < fixture["as_of_date"]:
                continue
            if row["unit"] is None:
                continue
            usable[row["ingredient_id"]] = usable.get(row["ingredient_id"], 0) + row["quantity"]
        snapshot = tuple(sorted(usable.items()))
        if baseline is None:
            baseline = snapshot
        elif snapshot != baseline:
            problems.append(f"order_dependence: shuffled inventory produced {snapshot}, expected {baseline}")
            break
    return problems


def run_case(path: Path, fixture: dict) -> bool:
    case = json.loads(path.read_text())
    name = case["name"]
    must_pass = case["must_pass"]
    problems = check_receipt(case["receipt"], fixture)

    if must_pass:
        if problems:
            print(f"FAIL  {name}: expected a sound receipt, found {len(problems)} violation(s)")
            for p in problems:
                print(f"        {p}")
            return False
        print(f"ok    {name}: {len(case['receipt']['results'])} receipts, no violations")
        return True

    # Negative case: the harness is on trial, not the receipt.
    expected = set(case.get("expected_failures", []))
    found = {p.split(":", 1)[0] for p in problems}
    if not problems:
        print(f"FAIL  {name}: the harness accepted a receipt that was corrupted on purpose")
        return False
    missed = expected - found
    if missed:
        print(f"FAIL  {name}: planted defects not detected: {sorted(missed)}")
        for p in problems:
            print(f"        detected: {p}")
        return False
    print(f"ok    {name}: rejected as required, {len(problems)} violation(s), all {len(expected)} planted defects found")
    for p in problems:
        print(f"        {p}")
    return True


def main() -> int:
    parser = argparse.ArgumentParser(description="M0 offline receipt evaluation")
    parser.add_argument("--case", help="run a single case by name")
    args = parser.parse_args()

    fixture = json.loads(FIXTURE.read_text())
    paths = sorted(CASES_DIR.glob("*.json"))
    if args.case:
        paths = [p for p in paths if p.stem == args.case]
        if not paths:
            print(f"no case named {args.case!r}")
            return 2

    print(f"M0 · rule_version={RULE_VERSION} · as_of_date={fixture['as_of_date']} · {len(paths)} case(s)\n")
    ok = all([run_case(p, fixture) for p in paths])

    shuffle_problems = check_shuffle_invariance(fixture)
    if shuffle_problems:
        print("\nFAIL  shuffle-invariance:")
        for p in shuffle_problems:
            print(f"        {p}")
        ok = False
    else:
        print("\nok    shuffle-invariance: 20 inventory orderings produced identical usable quantities")

    print("\nPASS" if ok else "\nFAILED")
    return 0 if ok else 1


if __name__ == "__main__":
    sys.exit(main())
