/**
 * Pure helpers behind the receipt panel (P2 M2). Owner: Jeffery Zheng.
 *
 * Nothing here touches the network, the DOM or the clock, so every rule the
 * panel relies on can be checked in a node test against the contract fixtures.
 * The normative document is `p2/contracts/receipt-v1.md`.
 */

import type { InventoryItemWithDetails } from "@/types/data";
import {
  roundPoints,
  type InventoryCorrection,
  type InventorySnapshot,
  type RankedRecipe,
  type ReceiptItem,
  type ReceiptItemSource,
  type ReceiptItemStatus,
  type WarningCode,
} from "@/types/receipt";

// ---------------------------------------------------------------------------
// From the page's inventory rows to the contract's shape
// ---------------------------------------------------------------------------

/** The contract's view of a stock row (§3), which is what a correction is keyed by. */
export function toInventorySnapshot(
  item: Pick<
    InventoryItemWithDetails,
    "id" | "ingredient_id" | "quantity" | "unit" | "location" | "expiration_date"
  >
): InventorySnapshot {
  return {
    inventory_id: item.id,
    ingredient_id: item.ingredient_id,
    quantity: item.quantity,
    unit: item.unit,
    location: item.location,
    expiration_date: item.expiration_date,
  };
}

export function toInventorySnapshots(
  items: readonly Parameters<typeof toInventorySnapshot>[0][]
): InventorySnapshot[] {
  return items.map(toInventorySnapshot);
}

/** Ingredient names the page already holds, keyed by id. Display only (§10). */
export function ingredientNamesOf(
  items: readonly Pick<InventoryItemWithDetails, "ingredient_id" | "ingredient">[]
): Record<number, string> {
  const names: Record<number, string> = {};
  for (const item of items) {
    const name = item.ingredient?.name;
    if (name) names[item.ingredient_id] = name;
  }
  return names;
}

// ---------------------------------------------------------------------------
// Words for every state, so nothing is shown by colour or icon alone
// ---------------------------------------------------------------------------

export const STATUS_TEXT: Record<ReceiptItemStatus, string> = {
  ok: "Covered",
  missing: "Short",
  expired: "Expired, not counted",
  unresolved_unit: "No unit on your stock",
  unknown_requirement: "Recipe doesn't say how much",
};

export const SOURCE_TEXT: Record<ReceiptItemSource, string> = {
  inventory: "What you have",
  expiry: "Use it before it expires",
  nutrition: "Nutrition",
  global: "Other",
};

export const WARNING_TEXT: Record<WarningCode, string> = {
  targets_unconfirmed: "Your nutrient targets are not confirmed, so they were ignored.",
  missing_nutrient_data: "Some nutrient data is missing, so the nutrition score is incomplete.",
  unresolved_unit: "A stock row has no unit, so it could not be compared.",
  unknown_requirement: "The recipe does not state a quantity for an ingredient.",
  expired_stock_excluded: "Expired stock was left out of the count.",
};

/** The order sources are listed in: the pantry first, then why, then the rest. */
export const SOURCE_ORDER: readonly ReceiptItemSource[] = [
  "inventory",
  "expiry",
  "nutrition",
  "global",
];

// ---------------------------------------------------------------------------
// Formatting
// ---------------------------------------------------------------------------

/** `350 g`, `0.5 cup`, `2` (no unit), `—` for an unknown quantity. */
export function formatQty(quantity: number | null, unit: string | null): string {
  if (quantity === null || Number.isNaN(quantity)) return "—";
  // Same half-up rule as the points, so 1.005 shows as 1.01 rather than 1.
  const rounded = roundPoints(quantity);
  const text = rounded.toLocaleString("en-US", { maximumFractionDigits: 2 });
  return unit ? `${text} ${unit}` : text;
}

/** Signed, two decimals, always with a sign so a reader can add the column up. */
export function formatPoints(points: number): string {
  const rounded = roundPoints(points);
  const text = Math.abs(rounded).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  if (rounded < 0) return `−${text}`;
  if (rounded > 0) return `+${text}`;
  return text;
}

/** Unsigned, two decimals, for the score line and the subtotals. */
export function formatScore(points: number): string {
  return roundPoints(points).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

// ---------------------------------------------------------------------------
// Does the receipt add up?
// ---------------------------------------------------------------------------

export interface SumCheck {
  /** `sum(items[].points)` after the contract's rounding. */
  lineTotal: number;
  /** What the receipt claims. */
  rankScore: number;
  /** True when the two agree exactly after rounding (contract §5). */
  matches: boolean;
  /** Per-source sums of the lines, for display next to the stated subtotals. */
  bySource: Record<ReceiptItemSource, number>;
}

/**
 * The frozen rule is `sum(items[].points) == rank_score` exactly, after the
 * documented rounding. The panel shows the result in words either way: a receipt
 * that does not add up is a defect the reader must be able to see, not a number
 * to quietly trust.
 */
export function checkSums(receipt: Readonly<RankedRecipe>): SumCheck {
  const bySource: Record<ReceiptItemSource, number> = {
    inventory: 0,
    expiry: 0,
    nutrition: 0,
    global: 0,
  };
  let raw = 0;
  for (const item of receipt.items) {
    raw += item.points;
    bySource[item.source] += item.points;
  }
  const lineTotal = roundPoints(raw);
  const rankScore = roundPoints(receipt.rank_score);
  for (const key of SOURCE_ORDER) bySource[key] = roundPoints(bySource[key]);
  return { lineTotal, rankScore, matches: lineTotal === rankScore, bySource };
}

// ---------------------------------------------------------------------------
// Grouping and ordering for display
// ---------------------------------------------------------------------------

export interface SourceGroup {
  source: ReceiptItemSource;
  label: string;
  items: ReceiptItem[];
}

/**
 * Groups lines by source in `SOURCE_ORDER`, keeping the scorer's order within a
 * group. Empty groups are left out. The scorer's own order is the audit order,
 * so lines are never re-sorted inside a group.
 */
export function groupBySource(items: readonly ReceiptItem[]): SourceGroup[] {
  return SOURCE_ORDER.map((source) => ({
    source,
    label: SOURCE_TEXT[source],
    items: items.filter((item) => item.source === source),
  })).filter((group) => group.items.length > 0);
}

/** `required − available`, clamped at zero, or `null` when the requirement is unknown. */
export function shortfall(
  item: Pick<ReceiptItem, "required_qty" | "available_qty">
): number | null {
  if (item.required_qty === null) return null;
  return Math.max(item.required_qty - item.available_qty, 0);
}

// ---------------------------------------------------------------------------
// Which stock rows a line can correct
// ---------------------------------------------------------------------------

/**
 * Stock rows behind a receipt line. Matching is by `ingredient_id` only
 * (contract §10). Rows are ordered by location then id so the list is stable
 * however the inventory arrived.
 */
export function rowsForLine(
  item: Pick<ReceiptItem, "ingredient_id">,
  inventory: readonly InventorySnapshot[]
): InventorySnapshot[] {
  return inventory
    .filter((row) => row.ingredient_id === item.ingredient_id)
    .sort(
      (a, b) =>
        (a.location ?? "").localeCompare(b.location ?? "") ||
        a.inventory_id.localeCompare(b.inventory_id)
    );
}

// ---------------------------------------------------------------------------
// Turning a form into a correction
// ---------------------------------------------------------------------------

export interface CorrectionForm {
  /** Text from the quantity input. */
  quantity: string;
  /** Text from the date input, `YYYY-MM-DD` or empty for "no expiry". */
  expiration_date: string;
}

export type CorrectionResult =
  | { ok: true; patch: InventoryCorrection }
  | { ok: false; message: string };

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

export function formFromRow(
  row: Pick<InventorySnapshot, "quantity" | "expiration_date">
): CorrectionForm {
  return { quantity: String(row.quantity), expiration_date: row.expiration_date ?? "" };
}

/**
 * Builds the smallest patch that changes the row. Only fields that differ from
 * the row are sent, so a correction never rewrites what the user did not touch.
 * Returns a message in words when the form cannot be applied, and refuses a
 * form that changes nothing, because sending it would re-rank for no reason.
 */
export function buildCorrection(
  row: Pick<InventorySnapshot, "quantity" | "expiration_date">,
  form: CorrectionForm
): CorrectionResult {
  const patch: InventoryCorrection = {};

  const qtyText = form.quantity.trim();
  if (qtyText === "") return { ok: false, message: "Enter a quantity." };
  const quantity = Number(qtyText);
  if (!Number.isFinite(quantity) || quantity < 0) {
    return { ok: false, message: "Quantity must be a number of zero or more." };
  }
  if (quantity !== row.quantity) patch.quantity = quantity;

  const dateText = form.expiration_date.trim();
  let expiration: string | null;
  if (dateText === "") {
    expiration = null;
  } else if (ISO_DATE.test(dateText) && !Number.isNaN(Date.parse(`${dateText}T00:00:00Z`))) {
    expiration = dateText;
  } else {
    return { ok: false, message: "Expiry must be a date like 2026-10-31, or empty for none." };
  }
  if (expiration !== (row.expiration_date ?? null)) patch.expiration_date = expiration;

  if (Object.keys(patch).length === 0) {
    return { ok: false, message: "Nothing changed." };
  }
  return { ok: true, patch };
}
