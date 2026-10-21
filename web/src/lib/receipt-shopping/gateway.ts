/**
 * Building blocks for the server-side recommendation gateway (P2, plan task 7).
 *
 * Owner: Andy Yu. Today the inventory page posts whatever items it is showing
 * straight to the Python backend from the browser, so a filtered page ranks a
 * filtered pantry and the backend trusts the browser. The gateway replaces that:
 * the server reads the signed-in user's full inventory and confirmed targets
 * itself, builds a contract `RankingRequest`, and forwards it to the ranker.
 *
 * Everything here is pure except `callRanker`, which takes `fetch` as a parameter.
 */

import {
  RULE_VERSION,
  isUsable,
  type InventorySnapshot,
  type IsoDate,
  type NutrientTargets,
  type RankingRequest,
  type RankingResponse,
  type RecipeCandidate,
  type Requirement,
} from "@/types/receipt";
import { toRequirements, type RecipeIngredientRow } from "./requirements";
import { convert, toDisplayQuantity } from "./units";

export const MAX_CANDIDATES = 50;
export const DEFAULT_CANDIDATES = 20;

/** A map row that also says which recipe it belongs to. */
export interface CandidateMapRow extends RecipeIngredientRow {
  recipe_id: number | string;
}

/**
 * Re-expresses a requirement in its display unit, so the ranker sees "250 g"
 * rather than "2.5 of 100g" — the same shape as the golden fixture. A unit that
 * does not parse is passed through untouched for the ranker to report.
 */
export function normaliseRequirement(req: Requirement): Requirement {
  if (req.quantity === null) {
    const unit = toDisplayQuantity(1, req.unit)?.unit ?? req.unit;
    return { ...req, unit };
  }
  const display = toDisplayQuantity(req.quantity, req.unit);
  return display ? { ingredient_id: req.ingredient_id, ...display } : req;
}

/**
 * Picks recipes that use the most distinct ingredients the user can still use
 * today. Ties go to the lower recipe id so the choice is reproducible.
 */
export function pickCandidateIds(
  inventory: InventorySnapshot[],
  mapRows: CandidateMapRow[],
  asOf: IsoDate,
  limit: number
): number[] {
  const usable = new Set(
    inventory.filter((r) => isUsable(r.expiration_date, asOf)).map((r) => r.ingredient_id)
  );
  const overlap = new Map<number, Set<number>>();
  for (const row of mapRows) {
    if (row.ingredient_id === null || !usable.has(Number(row.ingredient_id))) continue;
    const recipeId = Number(row.recipe_id);
    const set = overlap.get(recipeId) ?? new Set<number>();
    set.add(Number(row.ingredient_id));
    overlap.set(recipeId, set);
  }
  return [...overlap.entries()]
    .sort(([a, sa], [b, sb]) => sb.size - sa.size || a - b)
    .slice(0, limit)
    .map(([id]) => id);
}

/**
 * Re-expresses a requirement in the unit the user's stock of that ingredient is
 * stored in, when the two convert. The ranker matches units by exact string, so
 * "250 g" against a pantry kept in "kg" would otherwise be unresolved (#33). With
 * usable stock in several convertible units, the unit holding the most wins, ties
 * by name. Without any, the display unit from `normaliseRequirement` is kept.
 */
export function inStockUnit(
  req: Requirement,
  inventory: InventorySnapshot[],
  asOf: IsoDate
): Requirement {
  const normalised = normaliseRequirement(req);
  const held = new Map<string, number>();
  for (const row of inventory) {
    if (row.ingredient_id !== req.ingredient_id || row.unit === null) continue;
    if (!isUsable(row.expiration_date, asOf)) continue;
    const amount = convert(row.quantity, row.unit, normalised.unit);
    if (amount === null) continue;
    held.set(row.unit, (held.get(row.unit) ?? 0) + amount);
  }
  if (held.size === 0) return normalised;

  const [unit] = [...held.entries()].sort(
    ([ua, a], [ub, b]) => b - a || (ua < ub ? -1 : ua > ub ? 1 : 0)
  )[0];
  if (unit === normalised.unit) return normalised;
  if (normalised.quantity === null) return { ...normalised, unit };
  const quantity = convert(normalised.quantity, normalised.unit, unit);
  return quantity === null ? normalised : { ingredient_id: req.ingredient_id, quantity, unit };
}

/**
 * Groups map rows into one candidate per recipe id, in the order given. With the
 * user's stock, each requirement is stated in the unit that stock uses.
 */
export function buildCandidates(
  recipeIds: number[],
  mapRows: CandidateMapRow[],
  stock?: { inventory: InventorySnapshot[]; asOf: IsoDate }
): RecipeCandidate[] {
  const restate = stock
    ? (req: Requirement) => inStockUnit(req, stock.inventory, stock.asOf)
    : normaliseRequirement;
  return recipeIds.map((recipe_id) => ({
    recipe_id,
    servings: 1,
    requirements: toRequirements(mapRows.filter((r) => Number(r.recipe_id) === recipe_id)).map(
      restate
    ),
  }));
}

export const TARGET_KEYS = [
  "calories_kcal",
  "protein_g",
  "carbs_g",
  "fats_g",
  "sodium_mg",
  "fiber_g",
] as const;

export type GoalsRow = Partial<Record<(typeof TARGET_KEYS)[number], number | string | null>> & {
  confirmed_at?: string | null;
};

/**
 * Contract §6: targets are used only once the user has confirmed them. An
 * unconfirmed goals row gives `null`, and the ranker records the warning.
 * A goal that is null or not a number is left out rather than read as zero.
 */
export function toTargets(
  goals: GoalsRow | null,
  consumed: GoalsRow | null
): NutrientTargets | null {
  if (!goals?.confirmed_at) return null;
  const daily: Record<string, number> = {};
  const consumedToday: Record<string, number> = {};
  for (const key of TARGET_KEYS) {
    const goal = goals[key];
    if (goal === null || goal === undefined || goal === "") continue;
    const value = Number(goal);
    if (!Number.isFinite(value)) continue;
    daily[key] = value;
    const eaten = consumed?.[key];
    const eatenValue = eaten === null || eaten === undefined ? 0 : Number(eaten);
    consumedToday[key] = Number.isFinite(eatenValue) ? eatenValue : 0;
  }
  return { confirmed_at: goals.confirmed_at, daily, consumed_today: consumedToday };
}

export function buildRankingRequest(
  asOf: IsoDate,
  candidates: RecipeCandidate[],
  inventory: InventorySnapshot[],
  targets: NutrientTargets | null
): RankingRequest {
  return { rule_version: RULE_VERSION, as_of_date: asOf, candidates, inventory, targets };
}

export class RankerError extends Error {
  constructor(
    message: string,
    readonly upstreamStatus?: number
  ) {
    super(message);
    this.name = "RankerError";
  }
}

export interface RankerConfig {
  baseUrl: string;
  path: string;
  /** Shared secret the ranker checks, so only this server can call it. */
  token?: string;
  timeoutMs: number;
}

export function rankerConfig(env: NodeJS.ProcessEnv = process.env): RankerConfig {
  return {
    baseUrl: (env.BACKEND_URL || "http://localhost:8000").replace(/\/$/, ""),
    path: env.RECEIPT_RANK_PATH || "/receipt/rank",
    token: env.RECEIPT_INTERNAL_TOKEN || undefined,
    timeoutMs: Number(env.RECEIPT_RANK_TIMEOUT_MS) || 15000,
  };
}

/**
 * Sends the request to the ranker and checks the answer is a receipt-v1
 * response for the same date, holding only recipes that were asked about.
 */
export async function callRanker(
  request: RankingRequest,
  config: RankerConfig,
  fetchImpl: typeof fetch = fetch
): Promise<RankingResponse> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (config.token) headers["X-Internal-Token"] = config.token;

  let res: Response;
  try {
    res = await fetchImpl(`${config.baseUrl}${config.path}`, {
      method: "POST",
      headers,
      body: JSON.stringify(request),
      signal: AbortSignal.timeout(config.timeoutMs),
    });
  } catch (err) {
    throw new RankerError(`Ranking service unreachable: ${(err as Error).message}`);
  }
  if (!res.ok) {
    throw new RankerError(`Ranking service answered ${res.status}`, res.status);
  }

  const body = (await res.json().catch(() => null)) as RankingResponse | null;
  if (
    !body ||
    body.rule_version !== RULE_VERSION ||
    body.as_of_date !== request.as_of_date ||
    !Array.isArray(body.results)
  ) {
    throw new RankerError("Ranking service returned a response that is not receipt-v1");
  }
  const asked = new Set(request.candidates.map((c) => c.recipe_id));
  if (body.results.some((r) => !asked.has(r.recipe_id))) {
    throw new RankerError("Ranking service returned a recipe that was not a candidate");
  }
  return body;
}
