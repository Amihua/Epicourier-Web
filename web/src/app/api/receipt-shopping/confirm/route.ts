import { NextResponse } from "next/server";
import { z } from "zod";

import { asOfDate } from "@/lib/receipt-shopping/asOfDate";
import { loadInventory, loadPreview, loadRequirements } from "@/lib/receipt-shopping/data";
import { computePantryDelta, type DeltaResult } from "@/lib/receipt-shopping/delta";
import { errorResponse, parseBody } from "@/lib/receipt-shopping/http";
import { snapshotId } from "@/lib/receipt-shopping/snapshot";
import type { ConfirmResponse, ConfirmStatus } from "@/types/receipt";
import { createClient } from "@/utils/supabase/server";

const ConfirmBody = z.strictObject({
  preview_id: z.uuid(),
  request_id: z.uuid(),
});

interface ApplyResult {
  status: ConfirmStatus;
  written: unknown[];
  skipped: unknown[];
  replayed: boolean;
}

/** Errors the database function raises on purpose, by message, and their HTTP status. */
const KNOWN_FAILURES: Record<string, { status: number }> = {
  preview_not_found: { status: 404 },
  list_not_found: { status: 404 },
  request_id_reused: { status: 409 },
  not_authenticated: { status: 401 },
};

function confirmJson(body: ConfirmResponse, status: number, headers?: Record<string, string>) {
  return NextResponse.json(body, { status, headers });
}

function sameDelta(a: DeltaResult, b: DeltaResult): boolean {
  const key = (r: DeltaResult) =>
    JSON.stringify({
      deltas: r.deltas.map((d) => [d.ingredient_id, Number(d.missing_qty), d.unit]),
      unresolved: r.unresolved.map((u) => [u.ingredient_id, u.reason]),
    });
  return key(a) === key(b);
}

/**
 * POST /api/receipt-shopping/confirm — contract receipt-v1 §7.
 *
 * Writes a preview's lines to its shopping list, at most once.
 *
 * 1. The preview is read back under the caller's id; the body carries ids only.
 * 2. Unless the preview was already applied (a retry, answered by the database),
 *    the delta is recomputed from the current inventory and today's date. If the
 *    snapshot or the lines differ, the answer is `stale` and nothing is written.
 * 3. `apply_receipt_shopping_delta` writes the lines and the confirmation in one
 *    transaction. `request_id` is its primary key, so a repeated request replays
 *    the stored result instead of writing again.
 *
 * Body: { preview_id, request_id }
 * 200 applied (header Idempotent-Replayed: true on a replay) · 409 stale or a
 * reused request_id · 400/401/404 as usual · 500 failed, with nothing written.
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

  const body = await parseBody(req, ConfirmBody);
  if (!body.ok) return body.response;
  const { preview_id, request_id } = body.value;

  try {
    const preview = await loadPreview(supabase, user.id, preview_id);

    if (preview.applied_at === null) {
      const requirements = await loadRequirements(supabase, preview.recipe_id);
      const ingredientIds = [...new Set(requirements.map((r) => r.ingredient_id))];
      const inventory = await loadInventory(supabase, user.id, ingredientIds);
      const current = computePantryDelta({
        as_of_date: asOfDate(),
        servings: preview.servings,
        requirements,
        inventory,
      });
      const snapshot = snapshotId({
        recipe_id: preview.recipe_id,
        servings: preview.servings,
        requirements,
        inventory,
      });
      if (snapshot !== preview.snapshot_id || !sameDelta(current, preview)) {
        return confirmJson({ status: "stale", written: [], skipped: [] }, 409, {
          "X-Receipt-Reason": "inventory_changed",
        });
      }
    }

    const { data, error } = await supabase.rpc("apply_receipt_shopping_delta", {
      p_preview_id: preview_id,
      p_request_id: request_id,
    });

    if (error) {
      // The body stays the contract's exact shape; the reason travels in a header.
      const known = KNOWN_FAILURES[error.message];
      if (!known) console.error("POST /api/receipt-shopping/confirm: apply failed", error);
      return confirmJson({ status: "failed", written: [], skipped: [] }, known?.status ?? 500, {
        "X-Receipt-Reason": known ? error.message : "write_failed",
      });
    }

    const result = data as ApplyResult;
    const response: ConfirmResponse = {
      status: result.status,
      written: result.written ?? [],
      skipped: result.skipped ?? [],
    };
    if (result.status === "stale") {
      return confirmJson(response, 409, { "X-Receipt-Reason": "preview_already_applied" });
    }
    if (result.status !== "applied") {
      console.error("POST /api/receipt-shopping/confirm: unexpected result", result);
      return confirmJson({ status: "failed", written: [], skipped: [] }, 500);
    }
    return confirmJson(
      response,
      200,
      result.replayed ? { "Idempotent-Replayed": "true" } : undefined
    );
  } catch (err) {
    return errorResponse(err, "POST /api/receipt-shopping/confirm");
  }
}
