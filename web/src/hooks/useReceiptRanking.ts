"use client";

/**
 * Ranking state for the inventory page (P2 M2). Owner: Jeffery Zheng.
 *
 * `rank()` asks the server-side gateway (`POST /api/receipt-recommendations`,
 * PR #21) for a receipt-v1 `RankingResponse`. The browser sends ids at most; the
 * server reads the full inventory itself, so the page's location or search filter
 * never changes what is ranked.
 *
 * `correct()` is the contract's `onCorrect` (§8): it persists through the existing
 * inventory API, then re-fetches the inventory, then re-ranks. It rejects when the
 * write fails, so a caller can show the failure and keep its form open. Changing
 * a number in React state alone is never enough to re-rank.
 */

import { useCallback, useRef, useState } from "react";

import type { InventoryCorrection, RankingResponse } from "@/types/receipt";

export type RankingPhase =
  | { kind: "idle" }
  | { kind: "loading" }
  | { kind: "ready"; ranking: RankingResponse }
  | { kind: "error"; message: string };

export interface RankOptions {
  candidate_recipe_ids?: number[];
  limit?: number;
}

export interface UseReceiptRankingOptions {
  /** Runs after a correction is written and before the re-rank; the page re-fetches here. */
  onInventoryChanged?: () => Promise<void> | void;
}

export interface UseReceiptRankingReturn {
  phase: RankingPhase;
  /** The last successful ranking, kept while a re-rank is in flight. */
  ranking: RankingResponse | null;
  rank: (options?: RankOptions) => Promise<void>;
  correct: (inventoryId: string, patch: InventoryCorrection) => Promise<void>;
  reset: () => void;
}

export const RANK_ERROR_TEXT: Record<number, string> = {
  401: "Please sign in to rank recipes.",
  502: "The ranking service is not available right now.",
};

function describeRankFailure(status: number, body: { error?: unknown } | null): string {
  if (RANK_ERROR_TEXT[status]) return RANK_ERROR_TEXT[status];
  if (body && typeof body.error === "string" && body.error) return body.error;
  return "Could not rank recipes.";
}

function describeWriteFailure(status: number, body: { error?: unknown } | null): string {
  if (status === 401) return "Please sign in to correct your inventory.";
  if (status === 404) return "That inventory row no longer exists.";
  if (body && typeof body.error === "string" && body.error) return body.error;
  return "Could not save the correction.";
}

export function useReceiptRanking(options: UseReceiptRankingOptions = {}): UseReceiptRankingReturn {
  const [phase, setPhase] = useState<RankingPhase>({ kind: "idle" });
  const [ranking, setRanking] = useState<RankingResponse | null>(null);
  const lastOptions = useRef<RankOptions>({});
  const sequence = useRef(0);

  // Kept in a ref so an inline callback from the page never changes `rank`'s identity.
  const onInventoryChanged = useRef(options.onInventoryChanged);
  onInventoryChanged.current = options.onInventoryChanged;

  const rank = useCallback(async (rankOptions: RankOptions = {}) => {
    lastOptions.current = rankOptions;
    const mine = ++sequence.current;
    setPhase({ kind: "loading" });
    try {
      const res = await fetch("/api/receipt-recommendations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(rankOptions),
      });
      if (mine !== sequence.current) return; // a newer request superseded this one
      if (!res.ok) {
        const body = (await res.json().catch(() => null)) as { error?: unknown } | null;
        setPhase({ kind: "error", message: describeRankFailure(res.status, body) });
        return;
      }
      const body = (await res.json()) as RankingResponse;
      if (mine !== sequence.current) return;
      setRanking(body);
      setPhase({ kind: "ready", ranking: body });
    } catch {
      if (mine !== sequence.current) return;
      setPhase({ kind: "error", message: "Could not reach the server." });
    }
  }, []);

  const correct = useCallback(
    async (inventoryId: string, patch: InventoryCorrection) => {
      const res = await fetch(`/api/inventory/${encodeURIComponent(inventoryId)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => null)) as { error?: unknown } | null;
        throw new Error(describeWriteFailure(res.status, body));
      }
      await onInventoryChanged.current?.();
      await rank(lastOptions.current);
    },
    [rank]
  );

  const reset = useCallback(() => {
    sequence.current++;
    setPhase({ kind: "idle" });
    setRanking(null);
  }, []);

  return { phase, ranking, rank, correct, reset };
}
