/**
 * Server-side reads for the shopping delta. Every query is scoped to the signed-in
 * user explicitly, on top of RLS, so a missing policy cannot widen what we read.
 *
 * Owner: Andy Yu. Callers pass the request-scoped client from
 * `@/utils/supabase/server`; nothing here trusts data sent by the browser.
 */

import type { SupabaseClient } from "@supabase/supabase-js";

import type {
  InventorySnapshot,
  Requirement,
  ShoppingDelta,
  UnresolvedDelta,
} from "@/types/receipt";
import {
  toInventorySnapshots,
  toRequirements,
  type InventoryRow,
  type RecipeIngredientRow,
} from "./requirements";

/** The thing asked for does not exist, or is not this user's. Maps to HTTP 404. */
export class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "NotFoundError";
  }
}

/** The database answered with an error. Maps to HTTP 500; the detail is logged, not returned. */
export class DataAccessError extends Error {
  constructor(
    message: string,
    readonly cause?: unknown
  ) {
    super(message);
    this.name = "DataAccessError";
  }
}

export interface OwnedList {
  id: string;
  is_archived: boolean;
}

export async function loadOwnedList(
  db: SupabaseClient,
  userId: string,
  listId: string
): Promise<OwnedList> {
  const { data, error } = await db
    .from("shopping_lists")
    .select("id, is_archived")
    .eq("id", listId)
    .eq("user_id", userId)
    .maybeSingle();
  if (error) throw new DataAccessError("Failed to read the shopping list", error);
  if (!data) throw new NotFoundError("Shopping list not found");
  return data as OwnedList;
}

export async function loadRequirements(
  db: SupabaseClient,
  recipeId: number
): Promise<Requirement[]> {
  const { data: recipe, error: recipeError } = await db
    .from("Recipe")
    .select("id")
    .eq("id", recipeId)
    .maybeSingle();
  if (recipeError) throw new DataAccessError("Failed to read the recipe", recipeError);
  if (!recipe) throw new NotFoundError("Recipe not found");

  const { data, error } = await db
    .from("Recipe-Ingredient_Map")
    .select("ingredient_id, relative_unit_100, Ingredient ( unit )")
    .eq("recipe_id", recipeId);
  if (error) throw new DataAccessError("Failed to read the recipe's ingredients", error);
  return toRequirements((data ?? []) as RecipeIngredientRow[]);
}

/**
 * The user's inventory, optionally limited to some ingredients. An empty
 * `ingredientIds` list short-circuits to no rows rather than to every row.
 */
export async function loadInventory(
  db: SupabaseClient,
  userId: string,
  ingredientIds?: number[]
): Promise<InventorySnapshot[]> {
  if (ingredientIds && ingredientIds.length === 0) return [];
  let query = db
    .from("user_inventory")
    .select("id, ingredient_id, quantity, unit, location, expiration_date")
    .eq("user_id", userId);
  if (ingredientIds) query = query.in("ingredient_id", ingredientIds);
  const { data, error } = await query;
  if (error) throw new DataAccessError("Failed to read the inventory", error);
  return toInventorySnapshots((data ?? []) as InventoryRow[]);
}

export interface StoredPreview {
  id: string;
  user_id: string;
  shopping_list_id: string;
  recipe_id: number;
  servings: number;
  as_of_date: string;
  snapshot_id: string;
  deltas: ShoppingDelta[];
  unresolved: UnresolvedDelta[];
  applied_at: string | null;
}

export async function savePreview(
  db: SupabaseClient,
  preview: Omit<StoredPreview, "id" | "applied_at">
): Promise<string> {
  const { data, error } = await db
    .from("shopping_delta_previews")
    .insert(preview)
    .select("id")
    .single();
  if (error || !data) throw new DataAccessError("Failed to save the preview", error);
  return (data as { id: string }).id;
}

export async function loadPreview(
  db: SupabaseClient,
  userId: string,
  previewId: string
): Promise<StoredPreview> {
  const { data, error } = await db
    .from("shopping_delta_previews")
    .select(
      "id, user_id, shopping_list_id, recipe_id, servings, as_of_date, snapshot_id, deltas, unresolved, applied_at"
    )
    .eq("id", previewId)
    .eq("user_id", userId)
    .maybeSingle();
  if (error) throw new DataAccessError("Failed to read the preview", error);
  if (!data) throw new NotFoundError("Preview not found");
  const row = data as StoredPreview;
  return { ...row, recipe_id: Number(row.recipe_id), servings: Number(row.servings) };
}
