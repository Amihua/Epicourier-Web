"use client";

/**
 * Shopping preview for one recipe (P2 M3). Owner: Andy Yu.
 *
 * Shows what the recipe still needs after the user's usable stock, and adds it to a
 * shopping list only when the user confirms. Cancel writes nothing.
 *
 * Props follow `ShoppingPreviewProps` in `@/types/receipt` (contract §8), plus an
 * optional `onCancel` so the host can close its dialog. The host page (Jeffery)
 * imports this file directly and decides where it sits.
 *
 * One `request_id` is minted per preview and reused for every confirm attempt of
 * that preview, so a double click or a retry after a network error is applied once.
 */

import { AlertTriangle, Check, Loader2, RefreshCw, ShoppingCart } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabaseClient";
import type {
  ConfirmResponse,
  PreviewResponse,
  ShoppingPreviewProps,
  UnresolvedReason,
} from "@/types/receipt";

export type NameLookup = (ids: number[]) => Promise<Record<number, string>>;

export interface ReceiptShoppingPreviewProps extends ShoppingPreviewProps {
  onCancel?: () => void;
  /** Display names for ingredient ids. Defaults to a read of `Ingredient`. */
  getNames?: NameLookup;
}

/** Names are display-only (contract §10); a line without one shows its id. */
export const fetchIngredientNames: NameLookup = async (ids) => {
  const { data } = await supabase.from("Ingredient").select("id, name").in("id", ids);
  const map: Record<number, string> = {};
  for (const row of (data ?? []) as { id: number; name: string | null }[]) {
    if (row.name) map[row.id] = row.name;
  }
  return map;
};

type Phase =
  | { kind: "loading" }
  | { kind: "load-error"; message: string }
  | { kind: "ready" }
  | { kind: "confirming" }
  | { kind: "applied"; result: ConfirmResponse }
  | { kind: "stale" }
  | { kind: "failed"; message: string };

const REASON_TEXT: Record<UnresolvedReason, string> = {
  missing_unit: "Your stock has no unit, so it can't be compared. Add a unit in your inventory.",
  incompatible_unit: "Your stock is in a unit that can't be converted to the recipe's unit.",
  unknown_requirement: "The recipe doesn't say how much is needed.",
};

export function formatQuantity(quantity: number, unit: string): string {
  const rounded = Math.round(quantity * 100) / 100;
  return `${rounded.toLocaleString("en-US", { maximumFractionDigits: 2 })} ${unit}`;
}

/**
 * A v4 UUID. `crypto.randomUUID` only exists in secure contexts, so a demo opened
 * over plain http on a LAN address falls back to `getRandomValues`.
 */
export function newRequestId(): string {
  if (typeof crypto.randomUUID === "function") return crypto.randomUUID();
  const b = crypto.getRandomValues(new Uint8Array(16));
  b[6] = (b[6] & 0x0f) | 0x40;
  b[8] = (b[8] & 0x3f) | 0x80;
  const h = Array.from(b, (x) => x.toString(16).padStart(2, "0")).join("");
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20)}`;
}

export default function ReceiptShoppingPreview({
  recipe_id,
  servings,
  list_id,
  onComplete,
  onCancel,
  getNames = fetchIngredientNames,
}: ReceiptShoppingPreviewProps) {
  const [phase, setPhase] = useState<Phase>({ kind: "loading" });
  const [preview, setPreview] = useState<PreviewResponse | null>(null);
  const [names, setNames] = useState<Record<number, string>>({});
  const requestId = useRef<string>(newRequestId());
  const confirming = useRef(false);

  // Kept in a ref so a host passing an inline function does not re-trigger the fetch.
  const getNamesRef = useRef(getNames);
  getNamesRef.current = getNames;

  const loadNames = useCallback(async (ids: number[]) => {
    if (ids.length === 0) return;
    try {
      setNames(await getNamesRef.current(ids));
    } catch {
      // Names are display-only; the ids still identify every line.
    }
  }, []);

  const loadPreview = useCallback(async () => {
    setPhase({ kind: "loading" });
    try {
      const res = await fetch("/api/receipt-shopping/preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recipe_id, servings: servings ?? 1, list_id }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setPhase({ kind: "load-error", message: body.error ?? "Could not compute what to buy." });
        return;
      }
      const body = (await res.json()) as PreviewResponse;
      requestId.current = newRequestId();
      setPreview(body);
      setPhase({ kind: "ready" });
      void loadNames([
        ...body.deltas.map((d) => d.ingredient_id),
        ...body.unresolved.map((u) => u.ingredient_id),
      ]);
    } catch {
      setPhase({ kind: "load-error", message: "Could not reach the server." });
    }
  }, [recipe_id, servings, list_id, loadNames]);

  useEffect(() => {
    void loadPreview();
  }, [loadPreview]);

  const confirm = useCallback(async () => {
    if (!preview || confirming.current) return;
    confirming.current = true;
    setPhase({ kind: "confirming" });
    try {
      const res = await fetch("/api/receipt-shopping/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ preview_id: preview.preview_id, request_id: requestId.current }),
      });
      const body = (await res.json().catch(() => null)) as ConfirmResponse | null;
      if (res.ok && body?.status === "applied") {
        setPhase({ kind: "applied", result: body });
        onComplete(body);
      } else if (body?.status === "stale") {
        setPhase({ kind: "stale" });
      } else {
        setPhase({ kind: "failed", message: "Nothing was added to your list. You can try again." });
      }
    } catch {
      setPhase({
        kind: "failed",
        message: "The connection dropped. Trying again is safe: it will not add items twice.",
      });
    } finally {
      confirming.current = false;
    }
  }, [preview, onComplete]);

  const nameOf = (id: number) => names[id] ?? `Ingredient #${id}`;

  if (phase.kind === "loading") {
    return (
      <div role="status" aria-live="polite" className="flex items-center gap-2 p-4 text-sm">
        <Loader2 className="animate-spin" aria-hidden="true" />
        Working out what you still need…
      </div>
    );
  }

  if (phase.kind === "load-error" || !preview) {
    return (
      <div role="alert" className="space-y-3 p-4 text-sm">
        <p className="flex items-center gap-2">
          <AlertTriangle aria-hidden="true" />
          {phase.kind === "load-error" ? phase.message : "Could not compute what to buy."}
        </p>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => void loadPreview()}>
            <RefreshCw aria-hidden="true" /> Try again
          </Button>
          {onCancel && (
            <Button variant="ghost" onClick={onCancel}>
              Close
            </Button>
          )}
        </div>
      </div>
    );
  }

  const { deltas, unresolved } = preview;
  const busy = phase.kind === "confirming";
  const done = phase.kind === "applied";

  return (
    <section aria-labelledby="receipt-shopping-title" className="space-y-4 p-4 text-sm">
      <h3 id="receipt-shopping-title" className="flex items-center gap-2 text-base font-semibold">
        <ShoppingCart aria-hidden="true" /> What you still need
      </h3>

      {deltas.length === 0 ? (
        <p>You have enough of everything this recipe needs that can be measured.</p>
      ) : (
        <ul aria-label="Items to buy" className="divide-y rounded-md border">
          {deltas.map((d) => (
            <li
              key={d.ingredient_id}
              className="flex flex-wrap items-baseline justify-between gap-2 px-3 py-2"
            >
              <span className="font-medium">{nameOf(d.ingredient_id)}</span>
              <span>Buy {formatQuantity(d.missing_qty, d.unit)}</span>
            </li>
          ))}
        </ul>
      )}

      {unresolved.length > 0 && (
        <div>
          <h4 className="mb-1 font-medium">Not added — check these yourself</h4>
          <ul aria-label="Items that could not be calculated" className="space-y-1">
            {unresolved.map((u) => (
              <li key={u.ingredient_id} className="flex gap-2">
                <AlertTriangle className="mt-0.5 shrink-0" aria-hidden="true" />
                <span>
                  <span className="font-medium">{nameOf(u.ingredient_id)}:</span>{" "}
                  {REASON_TEXT[u.reason]}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div role="status" aria-live="polite" className="min-h-5">
        {done && (
          <p className="flex items-center gap-2">
            <Check aria-hidden="true" /> Added {phase.result.written.length} item
            {phase.result.written.length === 1 ? "" : "s"} to your list.
          </p>
        )}
        {phase.kind === "stale" && (
          <p>Your pantry changed since this was calculated. Refresh to see the new amounts.</p>
        )}
        {phase.kind === "failed" && <p>{phase.message}</p>}
      </div>

      <div className="flex flex-wrap gap-2">
        {phase.kind === "stale" ? (
          <Button onClick={() => void loadPreview()}>
            <RefreshCw aria-hidden="true" /> Refresh
          </Button>
        ) : (
          !done && (
            <Button onClick={() => void confirm()} disabled={busy || deltas.length === 0}>
              {busy ? <Loader2 className="animate-spin" aria-hidden="true" /> : null}
              {phase.kind === "failed"
                ? "Try again"
                : `Add ${deltas.length} item${deltas.length === 1 ? "" : "s"} to list`}
            </Button>
          )
        )}
        {onCancel && (
          <Button variant="ghost" onClick={onCancel} disabled={busy}>
            {done ? "Close" : "Cancel"}
          </Button>
        )}
      </div>
    </section>
  );
}
