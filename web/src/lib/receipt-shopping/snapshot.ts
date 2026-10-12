/**
 * Snapshot identity for a shopping preview (contract §7).
 *
 * Owner: Andy Yu. `snapshot_id` fingerprints exactly the data the delta was
 * computed from: the recipe's requirements, the servings multiplier, and the
 * user's inventory rows *for the ingredients that recipe uses*. Rows for other
 * ingredients are left out on purpose, so adding milk does not make a pasta
 * preview stale. The date is not part of it — confirm compares the recomputed
 * delta separately, which catches a row that expired overnight.
 */

import { createHash } from "crypto";

import { RULE_VERSION, type InventorySnapshot, type Requirement } from "@/types/receipt";

export interface SnapshotInput {
  recipe_id: number;
  servings: number;
  requirements: Requirement[];
  inventory: InventorySnapshot[];
}

/** Stable JSON: object keys sorted, so the same data always hashes the same. */
function canonical(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(canonical).join(",")}]`;
  if (value !== null && typeof value === "object") {
    const entries = Object.entries(value as Record<string, unknown>)
      .filter(([, v]) => v !== undefined)
      .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0));
    return `{${entries.map(([k, v]) => `${JSON.stringify(k)}:${canonical(v)}`).join(",")}}`;
  }
  return JSON.stringify(value);
}

export function snapshotId(input: SnapshotInput): string {
  const used = new Set(input.requirements.map((r) => r.ingredient_id));
  const requirements = input.requirements
    .map((r) => ({ ingredient_id: r.ingredient_id, quantity: r.quantity, unit: r.unit }))
    .sort((a, b) => a.ingredient_id - b.ingredient_id || canonical(a).localeCompare(canonical(b)));
  const inventory = input.inventory
    .filter((row) => used.has(row.ingredient_id))
    .map((row) => ({
      inventory_id: row.inventory_id,
      ingredient_id: row.ingredient_id,
      quantity: row.quantity,
      unit: row.unit,
      expiration_date: row.expiration_date,
    }))
    .sort((a, b) =>
      a.inventory_id < b.inventory_id ? -1 : a.inventory_id > b.inventory_id ? 1 : 0
    );

  const digest = createHash("sha256")
    .update(
      canonical({
        rule_version: RULE_VERSION,
        recipe_id: input.recipe_id,
        servings: input.servings,
        requirements,
        inventory,
      })
    )
    .digest("hex");
  return `snap_${digest}`;
}
