/**
 * Unit parsing and conversion for the pantry delta (M3).
 *
 * Owner: Andy Yu. Two facts from the schema shape this file:
 *
 * - `Ingredient.unit` is a *base unit* that may carry a numeric prefix — the data
 *   pipeline prompt asks for "100g" or "1 cup", and the recipe page renders
 *   `{unit} X {relative_unit_100}%`. So "100g" means one unit of 100 g.
 * - `user_inventory.unit` is free text and nullable ("g", "kg", "pieces", null).
 *
 * Conversion is only allowed inside one dimension. A unit this file does not
 * recognise is still comparable with itself (so "clove" matches "cloves"), but
 * never with anything else. When two units cannot be compared the caller gets
 * `null` and must report the line as unresolved instead of guessing.
 */

export type Dimension = "mass" | "volume" | "count" | `other:${string}`;

export interface ParsedUnit {
  /** Dimension used to decide whether two units can be compared at all. */
  dimension: Dimension;
  /** Multiplier from one of this unit to the dimension's base (g, ml, piece). */
  toBase: number;
  /** Unit name to show the user, without any numeric prefix ("100g" -> "g"). */
  display: string;
}

interface KnownUnit {
  dimension: "mass" | "volume" | "count";
  toBase: number;
  display: string;
}

const KNOWN: Record<string, KnownUnit> = {};

function define(names: string[], unit: KnownUnit) {
  for (const name of names) KNOWN[name] = unit;
}

define(["mg", "milligram", "milligrams"], { dimension: "mass", toBase: 0.001, display: "mg" });
define(["g", "gr", "gram", "grams", "gramme", "grammes"], {
  dimension: "mass",
  toBase: 1,
  display: "g",
});
define(["kg", "kgs", "kilogram", "kilograms"], { dimension: "mass", toBase: 1000, display: "kg" });
define(["oz", "ounce", "ounces"], { dimension: "mass", toBase: 28.349523125, display: "oz" });
define(["lb", "lbs", "pound", "pounds"], { dimension: "mass", toBase: 453.59237, display: "lb" });

define(["ml", "milliliter", "milliliters", "millilitre", "millilitres"], {
  dimension: "volume",
  toBase: 1,
  display: "ml",
});
define(["l", "liter", "liters", "litre", "litres"], {
  dimension: "volume",
  toBase: 1000,
  display: "L",
});
define(["tsp", "teaspoon", "teaspoons"], {
  dimension: "volume",
  toBase: 4.92892159375,
  display: "tsp",
});
define(["tbsp", "tablespoon", "tablespoons"], {
  dimension: "volume",
  toBase: 14.78676478125,
  display: "tbsp",
});
define(["cup", "cups"], { dimension: "volume", toBase: 236.5882365, display: "cup" });

define(["piece", "pieces", "pc", "pcs", "unit", "units", "each", "item", "items", "whole"], {
  dimension: "count",
  toBase: 1,
  display: "pcs",
});

const PREFIX = /^(\d+(?:\.\d+)?)\s*(.*)$/;

/** Lower-cases, trims, collapses spaces and drops a trailing period ("tbsp." -> "tbsp"). */
function normaliseWord(raw: string): string {
  return raw.trim().toLowerCase().replace(/\s+/g, " ").replace(/\.$/, "");
}

/** Crude singular for unknown units, so "cloves" and "clove" compare equal. */
function singular(word: string): string {
  return word.length > 2 && word.endsWith("s") && !word.endsWith("ss") ? word.slice(0, -1) : word;
}

/**
 * Parses a unit string, including a numeric prefix such as "100g" or "1 cup".
 * Returns `null` for null, empty, or zero-sized units ("0g"), which callers
 * report as `missing_unit`.
 */
export function parseUnit(raw: string | null | undefined): ParsedUnit | null {
  if (raw === null || raw === undefined) return null;
  const text = normaliseWord(raw);
  if (text === "") return null;

  let factor = 1;
  let name = text;
  const match = PREFIX.exec(text);
  if (match) {
    factor = Number(match[1]);
    name = normaliseWord(match[2]);
    // A bare number ("100") names a count of 100 things, not a unit we can trust.
    if (name === "") name = "piece";
  }
  if (!(factor > 0) || !Number.isFinite(factor)) return null;

  const known = KNOWN[name];
  if (known) {
    return { dimension: known.dimension, toBase: known.toBase * factor, display: known.display };
  }
  const key = singular(name);
  return { dimension: `other:${key}`, toBase: factor, display: name };
}

/** True when both units parse and share a dimension. */
export function areCompatible(a: string | null | undefined, b: string | null | undefined) {
  const pa = parseUnit(a);
  const pb = parseUnit(b);
  return pa !== null && pb !== null && pa.dimension === pb.dimension;
}

/**
 * Converts `quantity` from one unit to another. Returns `null` when either unit
 * is missing or the two are in different dimensions — never a guess.
 */
export function convert(
  quantity: number,
  from: string | null | undefined,
  to: string | null | undefined
): number | null {
  const pf = parseUnit(from);
  const pt = parseUnit(to);
  if (pf === null || pt === null || pf.dimension !== pt.dimension) return null;
  return (quantity * pf.toBase) / pt.toBase;
}

/**
 * Re-expresses a quantity stated in a prefixed base unit in its display unit:
 * 2.5 of "100g" becomes 250 of "g". Unprefixed units pass through unchanged.
 */
export function toDisplayQuantity(
  quantity: number,
  unit: string
): { quantity: number; unit: string } | null {
  const parsed = parseUnit(unit);
  if (parsed === null) return null;
  const displayUnit = parseUnit(parsed.display);
  // `display` is always parseable, but guard so a future edit cannot divide by zero.
  if (displayUnit === null || displayUnit.dimension !== parsed.dimension) return null;
  return { quantity: (quantity * parsed.toBase) / displayUnit.toBase, unit: parsed.display };
}
