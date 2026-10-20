/**
 * Receipt contract v1 — TypeScript side.
 *
 * Owner: Wenbo Li. The normative document is `p2/contracts/receipt-v1.md`; the
 * machine-checkable form is `p2/contracts/receipt-v1.schema.json`. Sihao owns the
 * matching Python models. Contract tests keep the three in step — change this file
 * only through a contract PR, never inside a feature PR.
 *
 * Frozen 2026-10-10.
 */

export const RULE_VERSION = "receipt-v1" as const;
export type RuleVersion = typeof RULE_VERSION;

/** Calendar date, `YYYY-MM-DD`. Never produced from a machine's local clock. */
export type IsoDate = string;

export const FIXTURE_AS_OF_DATE: IsoDate = "2026-10-10";

export type InventoryLocation = "pantry" | "fridge" | "freezer" | "other";

/** Nutrient keys follow the `Ingredient` column names, e.g. `protein_g`, `calories_kcal`. */
export type NutrientMap = Record<string, number>;

// ---------------------------------------------------------------------------
// Ranking input
// ---------------------------------------------------------------------------

export interface Requirement {
  ingredient_id: number;
  /**
   * Required amount in `unit`.
   * `null` means the recipe does not state it and the line is unresolved.
   * `0` means zero and is never rewritten to a default — see the
   * `relative_unit_100` note in the contract.
   * Must be `>= 0`. The Python model rejects negatives, and the JSON schema was
   * tightened to match after the corpus check surfaced the difference.
   */
  quantity: number | null;
  /** From `Ingredient.unit`, which is NOT NULL in the schema. */
  unit: string;
}

export interface RecipeCandidate {
  recipe_id: number;
  /**
   * Open decision D1. `Recipe` has no servings column; this is a caller-supplied
   * multiplier that scales requirements only, never nutrient targets.
   */
  servings?: number;
  requirements: Requirement[];
}

export interface InventorySnapshot {
  inventory_id: string;
  ingredient_id: number;
  quantity: number;
  /**
   * Open decision D2. `user_inventory.unit` is nullable. A null unit must not be
   * silently read as `Ingredient.unit`; it produces an `unresolved_unit` line.
   */
  unit: string | null;
  location?: InventoryLocation;
  expiration_date: IsoDate | null;
}

export interface NutrientTargets {
  /** Targets are used only when confirmed; otherwise they are ignored and warned about. */
  confirmed_at: string;
  daily: NutrientMap;
  consumed_today: NutrientMap;
}

export interface RankingRequest {
  rule_version: RuleVersion;
  as_of_date: IsoDate;
  candidates: RecipeCandidate[];
  /** The user's full authorised inventory, not the subset the current page filters. */
  inventory: InventorySnapshot[];
  targets: NutrientTargets | null;
}

// ---------------------------------------------------------------------------
// Ranking output
// ---------------------------------------------------------------------------

export type ReceiptItemSource = "inventory" | "expiry" | "nutrition" | "global";

export type ReceiptItemStatus =
  | "ok"
  | "missing"
  | "expired"
  | "unresolved_unit"
  | "unknown_requirement";

export interface ReceiptItem {
  ingredient_id: number;
  /** Display only. `Ingredient.name` is nullable and matching on it is prohibited. */
  ingredient_name?: string | null;
  required_qty: number | null;
  /** Usable quantity. A row expiring strictly before `as_of_date` contributes 0. */
  available_qty: number;
  unit: string | null;
  expiration_date: IsoDate | null;
  source: ReceiptItemSource;
  /** Signed. `sum(items[].points)` equals `rank_score` exactly after rounding. */
  points: number;
  status: ReceiptItemStatus;
}

export interface TargetOutcome {
  remaining: NutrientMap;
  /** Amount past the target. Clamping to zero without reporting the overage is prohibited. */
  over: NutrientMap;
  /** Nutrient keys with missing source data. Missing data is never treated as zero. */
  incomplete: string[];
}

export type WarningCode =
  | "targets_unconfirmed"
  | "missing_nutrient_data"
  | "unresolved_unit"
  | "unknown_requirement"
  | "expired_stock_excluded";

export interface ReceiptWarning {
  code: WarningCode;
  message: string;
  ingredient_id?: number;
}

export interface RankedRecipe {
  recipe_id: number;
  /**
   * Ranking points, NOT a percentage. This value may not be rendered in the
   * existing `match_score` percentage slot in `RecipeRecommendationModal`.
   */
  rank_score: number;
  subtotals: { inventory: number; expiry: number; nutrition: number };
  items: ReceiptItem[];
  targets: TargetOutcome | null;
  warnings: ReceiptWarning[];
}

export interface RankingResponse {
  rule_version: RuleVersion;
  as_of_date: IsoDate;
  /** Ordered by `rank_score` desc, then `recipe_id` asc. Input order must not affect this. */
  results: RankedRecipe[];
}

// ---------------------------------------------------------------------------
// Shopping preview and confirm
// ---------------------------------------------------------------------------

export interface PreviewRequest {
  recipe_id: number;
  servings?: number;
  list_id: string;
}

export interface ShoppingDelta {
  ingredient_id: number;
  /** `max(required - available_usable, 0)`, where usable excludes expired rows. */
  missing_qty: number;
  unit: string;
}

export type UnresolvedReason = "missing_unit" | "incompatible_unit" | "unknown_requirement";

export interface UnresolvedDelta {
  ingredient_id: number;
  reason: UnresolvedReason;
}

export interface PreviewResponse {
  preview_id: string;
  snapshot_id: string;
  deltas: ShoppingDelta[];
  unresolved: UnresolvedDelta[];
}

export interface ConfirmRequest {
  preview_id: string;
  /** Idempotency key, enforced in the database rather than in memory. */
  request_id: string;
}

/** `stale` means inventory moved since the preview: nothing is written. */
export type ConfirmStatus = "applied" | "stale" | "failed";

export interface ConfirmResponse {
  status: ConfirmStatus;
  written: unknown[];
  skipped: unknown[];
}

// ---------------------------------------------------------------------------
// UI props
// ---------------------------------------------------------------------------

export interface InventoryCorrection {
  quantity?: number;
  expiration_date?: IsoDate | null;
  unit?: string | null;
}

export interface ReceiptPanelProps {
  receipt: Readonly<RankedRecipe>;
  /** Must persist through the inventory API, then re-fetch and re-rank. */
  onCorrect: (inventoryId: string, patch: InventoryCorrection) => Promise<void>;
}

export interface ShoppingPreviewProps {
  recipe_id: number;
  servings?: number;
  list_id: string;
  onComplete: (result: ConfirmResponse) => void;
}

// ---------------------------------------------------------------------------
// Helpers shared by consumers and by the M0 evaluator
// ---------------------------------------------------------------------------

/** Rounding is applied once, at the end, to 2 decimal places, half-up. */
export function roundPoints(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

/** A row is usable only if it has no expiry, or expires on or after `asOfDate`. */
export function isUsable(expiration: IsoDate | null, asOfDate: IsoDate): boolean {
  return expiration === null || expiration >= asOfDate;
}

/** Total order: `rank_score` desc, then `recipe_id` asc. */
export function compareRanked(a: RankedRecipe, b: RankedRecipe): number {
  return b.rank_score - a.rank_score || a.recipe_id - b.recipe_id;
}
