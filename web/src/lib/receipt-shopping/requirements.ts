/**
 * Adapter from database rows to contract `Requirement`s.
 *
 * Owner: Andy Yu. `"Recipe-Ingredient_Map".relative_unit_100` is a percentage of
 * the ingredient's base unit, not a quantity in it. Evidence, all in this repo:
 *
 * - the data pipeline prompt (`data/prompts`) defines it as
 *   "50 for half of base unit", with base units such as "100g" or "1 cup";
 * - the recipe page renders it as `{Ingredient.unit} X {relative_unit_100}%`;
 * - every nutrient and shopping call site divides it by 100 before use.
 *
 * So the requirement is `relative_unit_100 / 100` of `Ingredient.unit`, and the
 * delta's unit parser turns "2.5 x 100g" into 250 g. `null` stays `null`
 * (unknown) and `0` stays `0` — never the `|| 100` default.
 */

import type { InventoryLocation, InventorySnapshot, Requirement } from "@/types/receipt";

/** One row of `Recipe-Ingredient_Map` joined to `Ingredient`. */
export interface RecipeIngredientRow {
  ingredient_id: number | null;
  relative_unit_100: number | string | null;
  Ingredient: { unit: string | null } | { unit: string | null }[] | null;
}

/** One row of `user_inventory` as PostgREST returns it (DECIMAL may arrive as a string). */
export interface InventoryRow {
  id: string;
  ingredient_id: number | string;
  quantity: number | string;
  unit: string | null;
  location: string | null;
  expiration_date: string | null;
}

function toNumberOrNull(value: number | string | null): number | null {
  if (value === null || value === undefined || value === "") return null;
  const n = typeof value === "number" ? value : Number(value);
  return Number.isFinite(n) ? n : null;
}

export function toRequirements(rows: RecipeIngredientRow[]): Requirement[] {
  const out: Requirement[] = [];
  for (const row of rows) {
    if (row.ingredient_id === null) continue;
    const ingredient = Array.isArray(row.Ingredient) ? row.Ingredient[0] : row.Ingredient;
    const percent = toNumberOrNull(row.relative_unit_100);
    out.push({
      ingredient_id: Number(row.ingredient_id),
      quantity: percent === null ? null : percent / 100,
      unit: ingredient?.unit ?? "",
    });
  }
  return out;
}

const LOCATIONS: InventoryLocation[] = ["pantry", "fridge", "freezer", "other"];

export function toInventorySnapshots(rows: InventoryRow[]): InventorySnapshot[] {
  return rows.map((row) => ({
    inventory_id: row.id,
    ingredient_id: Number(row.ingredient_id),
    quantity: Number(row.quantity),
    unit: row.unit,
    location: LOCATIONS.includes(row.location as InventoryLocation)
      ? (row.location as InventoryLocation)
      : "other",
    expiration_date: row.expiration_date ? row.expiration_date.slice(0, 10) : null,
  }));
}
