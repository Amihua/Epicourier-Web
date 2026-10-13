import { NextResponse } from "next/server";
import { z } from "zod";

import { asOfDate } from "@/lib/receipt-shopping/asOfDate";
import {
  loadInventory,
  loadOwnedList,
  loadRequirements,
  savePreview,
} from "@/lib/receipt-shopping/data";
import { computePantryDelta } from "@/lib/receipt-shopping/delta";
import { errorResponse, parseBody } from "@/lib/receipt-shopping/http";
import { snapshotId } from "@/lib/receipt-shopping/snapshot";
import type { PreviewResponse } from "@/types/receipt";
import { createClient } from "@/utils/supabase/server";

const PreviewBody = z.strictObject({
  recipe_id: z.number().int().positive(),
  servings: z.number().int().min(1).max(100).optional(),
  list_id: z.uuid(),
});

/**
 * POST /api/receipt-shopping/preview — contract receipt-v1 §7.
 *
 * Computes what a recipe still needs after the user's usable stock, and stores it
 * as a preview. Writes nothing to any shopping list: that only happens on confirm.
 * The server reads the list, recipe and inventory itself; the body carries ids only.
 *
 * Body: { recipe_id, servings?, list_id }
 * 200 PreviewResponse · 400 bad body · 401 no session · 404 list/recipe not found
 * 422 stored data the delta cannot interpret · 500 database error
 */
export async function POST(req: Request) {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await parseBody(req, PreviewBody);
  if (!body.ok) return body.response;
  const { recipe_id, list_id } = body.value;
  const servings = body.value.servings ?? 1;

  try {
    await loadOwnedList(supabase, user.id, list_id);
    const requirements = await loadRequirements(supabase, recipe_id);
    const ingredientIds = [...new Set(requirements.map((r) => r.ingredient_id))];
    const inventory = await loadInventory(supabase, user.id, ingredientIds);

    const as_of_date = asOfDate();
    const { deltas, unresolved } = computePantryDelta({
      as_of_date,
      servings,
      requirements,
      inventory,
    });
    const snapshot_id = snapshotId({ recipe_id, servings, requirements, inventory });

    const preview_id = await savePreview(supabase, {
      user_id: user.id,
      shopping_list_id: list_id,
      recipe_id,
      servings,
      as_of_date,
      snapshot_id,
      deltas,
      unresolved,
    });

    const response: PreviewResponse = { preview_id, snapshot_id, deltas, unresolved };
    return NextResponse.json(response);
  } catch (err) {
    return errorResponse(err, "POST /api/receipt-shopping/preview");
  }
}
