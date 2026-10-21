import { NextResponse } from "next/server";
import { z } from "zod";

import { asOfDate } from "@/lib/receipt-shopping/asOfDate";
import { DataAccessError, loadInventory } from "@/lib/receipt-shopping/data";
import {
  buildCandidates,
  buildRankingRequest,
  callRanker,
  DEFAULT_CANDIDATES,
  MAX_CANDIDATES,
  pickCandidateIds,
  rankerConfig,
  RankerError,
  toTargets,
  type CandidateMapRow,
  type GoalsRow,
} from "@/lib/receipt-shopping/gateway";
import { errorResponse, parseBody } from "@/lib/receipt-shopping/http";
import { RULE_VERSION, isUsable, type RankingResponse } from "@/types/receipt";
import { createClient } from "@/utils/supabase/server";

const Body = z.strictObject({
  candidate_recipe_ids: z.array(z.number().int().positive()).min(1).max(MAX_CANDIDATES).optional(),
  limit: z.number().int().min(1).max(MAX_CANDIDATES).optional(),
});

const MAP_COLUMNS = "recipe_id, ingredient_id, relative_unit_100, Ingredient ( unit )";

/**
 * POST /api/receipt-recommendations — server-side gateway to the receipt ranker.
 *
 * The browser sends at most which recipes to consider; the server supplies the
 * rest from its own reads: the caller's full inventory (not the page's filtered
 * view), confirmed nutrient targets, and today's date by the shared rule.
 *
 * Body (optional): { candidate_recipe_ids?: number[], limit?: number }
 * Without ids, candidates are the recipes sharing the most usable ingredients.
 *
 * 200 RankingResponse · 400 bad body · 401 no session · 500 database error
 * 502 the ranker is down, failed, or answered outside the contract
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

  const body = await parseBody(req, Body, { allowEmpty: true });
  if (!body.ok) return body.response;

  try {
    const as_of_date = asOfDate();
    const inventory = await loadInventory(supabase, user.id);

    let candidateIds: number[];
    if (body.value.candidate_recipe_ids) {
      const requested = [...new Set(body.value.candidate_recipe_ids)];
      const { data, error } = await supabase.from("Recipe").select("id").in("id", requested);
      if (error) throw new DataAccessError("Failed to read the recipes", error);
      candidateIds = ((data ?? []) as { id: number }[])
        .map((r) => Number(r.id))
        .sort((a, b) => a - b);
    } else {
      const usableIds = [
        ...new Set(
          inventory
            .filter((r) => isUsable(r.expiration_date, as_of_date))
            .map((r) => r.ingredient_id)
        ),
      ];
      if (usableIds.length === 0) {
        candidateIds = [];
      } else {
        const { data, error } = await supabase
          .from("Recipe-Ingredient_Map")
          .select(MAP_COLUMNS)
          .in("ingredient_id", usableIds);
        if (error) throw new DataAccessError("Failed to match recipes to the inventory", error);
        candidateIds = pickCandidateIds(
          inventory,
          (data ?? []) as CandidateMapRow[],
          as_of_date,
          body.value.limit ?? DEFAULT_CANDIDATES
        );
      }
    }

    if (candidateIds.length === 0) {
      const empty: RankingResponse = { rule_version: RULE_VERSION, as_of_date, results: [] };
      return NextResponse.json(empty);
    }

    const { data: mapRows, error: mapError } = await supabase
      .from("Recipe-Ingredient_Map")
      .select(MAP_COLUMNS)
      .in("recipe_id", candidateIds);
    if (mapError) throw new DataAccessError("Failed to read recipe ingredients", mapError);
    const candidates = buildCandidates(candidateIds, (mapRows ?? []) as CandidateMapRow[], {
      inventory,
      asOf: as_of_date,
    });

    const { data: goals, error: goalsError } = await supabase
      .from("nutrient_goals")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();
    if (goalsError) throw new DataAccessError("Failed to read nutrient goals", goalsError);

    let consumed: GoalsRow | null = null;
    if ((goals as GoalsRow | null)?.confirmed_at) {
      const { data, error } = await supabase
        .from("nutrient_tracking")
        .select("*")
        .eq("user_id", user.id)
        .eq("date", as_of_date)
        .maybeSingle();
      if (error) throw new DataAccessError("Failed to read today's intake", error);
      consumed = data as GoalsRow | null;
    }

    const request = buildRankingRequest(
      as_of_date,
      candidates,
      inventory,
      toTargets(goals as GoalsRow | null, consumed)
    );
    const ranked = await callRanker(request, rankerConfig());
    return NextResponse.json(ranked);
  } catch (err) {
    if (err instanceof RankerError) {
      console.error("POST /api/receipt-recommendations:", err.message);
      return NextResponse.json({ error: "Ranking service unavailable" }, { status: 502 });
    }
    return errorResponse(err, "POST /api/receipt-recommendations");
  }
}
