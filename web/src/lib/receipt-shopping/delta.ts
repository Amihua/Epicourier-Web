/**
 * Pantry delta (M3): what a recipe still needs after the user's usable stock.
 *
 * Owner: Andy Yu. Contract: `p2/contracts/receipt-v1.md` §7.
 *
 *   missing = max(required - available_usable, 0)
 *
 * Pure: no network, no database, no clock. The caller passes `as_of_date`.
 *
 * Rules, in the order they are applied per ingredient:
 * 1. Requirements for the same ingredient are summed, then scaled by `servings` (D1).
 * 2. A `null` requirement is `unknown_requirement`; `0` means zero and adds nothing.
 * 3. Usable stock is the sum over every unexpired row of that ingredient, across
 *    locations. A row expiring on `as_of_date` is still usable; one before it is not.
 * 4. If the comparable rows already cover the requirement, there is no line.
 * 5. Otherwise, if an unexpired row has no unit, the line is `missing_unit` (D2);
 *    if one has a unit in another dimension, `incompatible_unit`. Those rows might
 *    cover the gap, so subtracting without them would be a guess.
 * 6. Otherwise the shortfall is rounded *up* to 0.01 — a shopping list should never
 *    under-buy — and reported in the requirement's display unit ("100g" -> "g").
 */

import {
  isUsable,
  type InventorySnapshot,
  type IsoDate,
  type Requirement,
  type ShoppingDelta,
  type UnresolvedDelta,
  type UnresolvedReason,
} from "@/types/receipt";
import { convert, parseUnit, toDisplayQuantity } from "./units";

export interface DeltaInput {
  as_of_date: IsoDate;
  /** Positive integer multiplier for requirements only (decision D1). Defaults to 1. */
  servings?: number;
  requirements: Requirement[];
  /** The user's full inventory; rows for other ingredients are ignored. */
  inventory: InventorySnapshot[];
}

export interface DeltaResult {
  deltas: ShoppingDelta[];
  unresolved: UnresolvedDelta[];
}

/** Thrown for input that no rule can give a meaning to. Callers map it to HTTP 422. */
export class DeltaInputError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DeltaInputError";
  }
}

/** Below this, a difference is floating-point noise rather than a shortfall. */
const EPSILON = 1e-9;

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

/** True for a real calendar date in `YYYY-MM-DD` form (rejects 2026-02-30). */
export function isIsoDate(value: unknown): value is IsoDate {
  if (typeof value !== "string" || !ISO_DATE.test(value)) return false;
  const parsed = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
}

/** Rounds up to two decimals, ignoring float noise so 150.0000000001 stays 150. */
export function ceilToCents(value: number): number {
  return Math.ceil(Math.round(value * 1e6) / 1e4) / 100;
}

function validate(input: DeltaInput): number {
  if (!isIsoDate(input.as_of_date)) {
    throw new DeltaInputError(`as_of_date must be a YYYY-MM-DD date, got ${input.as_of_date}`);
  }
  const servings = input.servings ?? 1;
  if (!Number.isInteger(servings) || servings < 1) {
    throw new DeltaInputError(`servings must be a positive integer, got ${servings}`);
  }
  for (const req of input.requirements) {
    if (!Number.isInteger(req.ingredient_id) || req.ingredient_id <= 0) {
      throw new DeltaInputError(`requirement has an invalid ingredient_id: ${req.ingredient_id}`);
    }
    if (req.quantity !== null && !(Number.isFinite(req.quantity) && req.quantity >= 0)) {
      throw new DeltaInputError(
        `requirement for ingredient ${req.ingredient_id} has an invalid quantity: ${req.quantity}`
      );
    }
  }
  const seen = new Set<string>();
  for (const row of input.inventory) {
    if (seen.has(row.inventory_id)) {
      throw new DeltaInputError(`inventory row ${row.inventory_id} appears twice`);
    }
    seen.add(row.inventory_id);
    if (!(Number.isFinite(row.quantity) && row.quantity >= 0)) {
      throw new DeltaInputError(
        `inventory row ${row.inventory_id} has an invalid quantity: ${row.quantity}`
      );
    }
    if (row.expiration_date !== null && !isIsoDate(row.expiration_date)) {
      throw new DeltaInputError(
        `inventory row ${row.inventory_id} has an invalid expiration_date: ${row.expiration_date}`
      );
    }
  }
  return servings;
}

type Need =
  | { kind: "unknown" }
  | { kind: "incompatible" }
  | { kind: "missing_unit" }
  | { kind: "known"; quantity: number; unit: string; via: string };

/** Sums one ingredient's requirements into a single quantity in a display unit. */
function totalNeed(reqs: Requirement[], servings: number): Need {
  if (reqs.some((r) => r.quantity === null)) return { kind: "unknown" };
  // Zero is zero whatever the unit says, so a unitless zero is not an unresolved line.
  if (reqs.every((r) => r.quantity === 0))
    return { kind: "known", quantity: 0, unit: reqs[0].unit, via: reqs[0].unit };
  const first = toDisplayQuantity(0, reqs[0].unit);
  if (first === null) return { kind: "missing_unit" };
  let total = 0;
  for (const r of reqs) {
    const q = convert(r.quantity as number, r.unit, first.unit);
    if (q === null) return { kind: "incompatible" };
    total += q;
  }
  // `via` is the recipe's own unit. Stock converts through it, so a pantry in grams
  // still meets a need shown in items ("1 large (50 g)" displayed as pcs).
  return { kind: "known", quantity: total * servings, unit: first.unit, via: reqs[0].unit };
}

/**
 * Computes the shopping delta for one recipe against the user's inventory.
 * Output order is by `ingredient_id`, so input order never changes the result.
 */
export function computePantryDelta(input: DeltaInput): DeltaResult {
  const servings = validate(input);

  const byIngredient = new Map<number, Requirement[]>();
  for (const req of input.requirements) {
    const list = byIngredient.get(req.ingredient_id) ?? [];
    list.push(req);
    byIngredient.set(req.ingredient_id, list);
  }

  const deltas: ShoppingDelta[] = [];
  const unresolved: UnresolvedDelta[] = [];
  const flag = (ingredient_id: number, reason: UnresolvedReason) =>
    unresolved.push({ ingredient_id, reason });

  const ids = [...byIngredient.keys()].sort((a, b) => a - b);
  for (const ingredientId of ids) {
    const need = totalNeed(byIngredient.get(ingredientId)!, servings);
    if (need.kind === "unknown") {
      flag(ingredientId, "unknown_requirement");
      continue;
    }
    if (need.kind === "missing_unit") {
      flag(ingredientId, "missing_unit");
      continue;
    }
    if (need.kind === "incompatible") {
      flag(ingredientId, "incompatible_unit");
      continue;
    }
    if (need.quantity <= EPSILON) continue;

    let usable = 0;
    let hasNullUnit = false;
    let hasIncompatible = false;
    for (const row of input.inventory) {
      if (row.ingredient_id !== ingredientId) continue;
      if (!isUsable(row.expiration_date, input.as_of_date)) continue;
      if (parseUnit(row.unit) === null) {
        hasNullUnit = true;
        continue;
      }
      const viaRecipeUnit = convert(row.quantity, row.unit, need.via);
      const converted =
        convert(row.quantity, row.unit, need.unit) ??
        (viaRecipeUnit === null ? null : convert(viaRecipeUnit, need.via, need.unit));
      if (converted === null) {
        hasIncompatible = true;
        continue;
      }
      usable += converted;
    }

    const missing = ceilToCents(Math.max(need.quantity - usable, 0));
    if (missing <= 0) continue;
    if (hasNullUnit) {
      flag(ingredientId, "missing_unit");
      continue;
    }
    if (hasIncompatible) {
      flag(ingredientId, "incompatible_unit");
      continue;
    }
    deltas.push({ ingredient_id: ingredientId, missing_qty: missing, unit: need.unit });
  }

  return { deltas, unresolved };
}
