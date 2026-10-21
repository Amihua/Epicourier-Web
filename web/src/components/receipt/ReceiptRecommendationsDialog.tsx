"use client";

/**
 * Ranked recipes with their receipts (P2 M2). Owner: Jeffery Zheng.
 *
 * The host page owns the ranking state (`useReceiptRanking`) and passes it in,
 * so this dialog only renders: loading, an error with a retry, an empty result,
 * or one `ReceiptPanel` per ranked recipe. From each receipt the user can open
 * Andy's `ReceiptShoppingPreview` to add what is missing to a shopping list;
 * nothing is written until they confirm there.
 *
 * `rank_score` is ranking points and is never shown in the old percentage slot.
 */

import { ChevronDown, ChevronUp, Loader2, RefreshCw, ShoppingCart } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import ReceiptPanel from "@/components/receipt/ReceiptPanel";
import ReceiptShoppingPreview, {
  fetchIngredientNames,
  type NameLookup,
} from "@/components/shopping/ReceiptShoppingPreview";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { RankingPhase } from "@/hooks/useReceiptRanking";
import { formatScore } from "@/lib/receipt/view";
import { supabase } from "@/lib/supabaseClient";
import type { ShoppingListWithStats } from "@/types/data";
import type {
  ConfirmResponse,
  InventorySnapshot,
  RankedRecipe,
  RankingResponse,
  ReceiptPanelProps,
} from "@/types/receipt";

export type ShoppingListOption = Pick<ShoppingListWithStats, "id" | "name">;

export interface ReceiptRecommendationsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  phase: RankingPhase;
  /** The last successful ranking; stays on screen while a re-rank is in flight. */
  ranking: RankingResponse | null;
  /** The user's full stock, for corrections. */
  inventory: readonly InventorySnapshot[];
  /** Ingredient names the host already knows (from its inventory rows). */
  names?: Record<number, string>;
  onCorrect: ReceiptPanelProps["onCorrect"];
  onRetry: () => void;
  /** Called after a shopping confirm is applied, with the contract's response. */
  onShoppingComplete?: (recipeId: number, result: ConfirmResponse) => void;
  /** Display names for recipe ids. Defaults to a read of `Recipe`. */
  getRecipeNames?: NameLookup;
  /** Display names for ingredient ids the host does not know. Defaults to a read of `Ingredient`. */
  getIngredientNames?: NameLookup;
  /** The user's active shopping lists. Defaults to `GET /api/shopping-lists`. */
  getShoppingLists?: () => Promise<ShoppingListOption[]>;
}

export const fetchRecipeNames: NameLookup = async (ids) => {
  const { data } = await supabase.from("Recipe").select("id, name").in("id", ids);
  const map: Record<number, string> = {};
  for (const row of (data ?? []) as { id: number; name: string | null }[]) {
    if (row.name) map[row.id] = row.name;
  }
  return map;
};

export async function fetchShoppingLists(): Promise<ShoppingListOption[]> {
  const res = await fetch("/api/shopping-lists");
  if (!res.ok) return [];
  const lists = (await res.json()) as ShoppingListWithStats[];
  return lists.filter((l) => !l.is_archived).map((l) => ({ id: l.id, name: l.name }));
}

export default function ReceiptRecommendationsDialog({
  isOpen,
  onClose,
  phase,
  ranking,
  inventory,
  names = {},
  onCorrect,
  onRetry,
  onShoppingComplete,
  getRecipeNames = fetchRecipeNames,
  getIngredientNames = fetchIngredientNames,
  getShoppingLists = fetchShoppingLists,
}: ReceiptRecommendationsDialogProps) {
  const [recipeNames, setRecipeNames] = useState<Record<number, string>>({});
  const [lookedUp, setLookedUp] = useState<Record<number, string>>({});
  const [lists, setLists] = useState<ShoppingListOption[] | null>(null);
  const [expanded, setExpanded] = useState<number | null>(null);

  // Refs so hosts passing inline functions do not re-trigger the lookups.
  const lookups = useRef({ getRecipeNames, getIngredientNames, getShoppingLists });
  lookups.current = { getRecipeNames, getIngredientNames, getShoppingLists };

  const results = useMemo(() => ranking?.results ?? [], [ranking]);

  // Names for recipes and for ingredients the host's inventory does not cover.
  useEffect(() => {
    if (results.length === 0) return;
    let cancelled = false;
    const recipeIds = results.map((r) => r.recipe_id);
    const unknownIngredients = [
      ...new Set(
        results
          .flatMap((r) => [
            ...r.items.map((i) => i.ingredient_id),
            ...r.warnings.flatMap((w) => (w.ingredient_id !== undefined ? [w.ingredient_id] : [])),
          ])
          .filter((id) => names[id] === undefined)
      ),
    ];
    void (async () => {
      try {
        const found = await lookups.current.getRecipeNames(recipeIds);
        if (!cancelled) setRecipeNames((prev) => ({ ...prev, ...found }));
      } catch {
        // Names are display-only; the ids still identify every recipe.
      }
      if (unknownIngredients.length === 0) return;
      try {
        const found = await lookups.current.getIngredientNames(unknownIngredients);
        if (!cancelled) setLookedUp((prev) => ({ ...prev, ...found }));
      } catch {
        // Same: display-only.
      }
    })();
    return () => {
      cancelled = true;
    };
    // `names` is a derived map the host rebuilds on every fetch; comparing its
    // contents here would re-run on each inventory refresh for nothing.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [results]);

  // Shopping lists, once per open.
  useEffect(() => {
    if (!isOpen) return;
    let cancelled = false;
    setLists(null);
    void (async () => {
      try {
        const found = await lookups.current.getShoppingLists();
        if (!cancelled) setLists(found);
      } catch {
        if (!cancelled) setLists([]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [isOpen]);

  // Open the top result the first time results arrive.
  useEffect(() => {
    if (results.length > 0 && expanded === null) setExpanded(results[0].recipe_id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [results]);

  const ingredientNames = useMemo(() => ({ ...lookedUp, ...names }), [lookedUp, names]);
  const reranking = phase.kind === "loading" && ranking !== null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="flex max-h-[90vh] max-w-[min(48rem,calc(100%-1rem))] flex-col gap-0 overflow-hidden rounded-none border-2 border-black p-0 shadow-[4px_4px_0_0_rgba(0,0,0,1)]">
        <div className="border-b-2 border-black p-6">
          <DialogHeader>
            <DialogTitle className="text-xl">Recipes ranked by your pantry</DialogTitle>
            <DialogDescription>
              Each recipe comes with a receipt you can add up yourself. Scores are ranking points,
              not percentages.
              {ranking && ` Stock counted as of ${ranking.as_of_date}.`}
            </DialogDescription>
          </DialogHeader>
        </div>

        {phase.kind === "loading" && ranking === null ? (
          <div role="status" aria-live="polite" className="flex items-center gap-2 p-6 text-sm">
            <Loader2 className="animate-spin" aria-hidden="true" />
            Ranking recipes against your pantry…
          </div>
        ) : phase.kind === "error" ? (
          <div role="alert" className="space-y-3 p-6 text-sm">
            <p>{phase.message}</p>
            <Button variant="outline" onClick={onRetry}>
              <RefreshCw aria-hidden="true" /> Try again
            </Button>
          </div>
        ) : results.length === 0 ? (
          <p className="p-6 text-sm">
            Nothing to rank yet. Add ingredients that recipes use, then try again.
          </p>
        ) : (
          <ScrollArea className="min-h-0 min-w-0 flex-1 [&>[data-radix-scroll-area-viewport]>div]:block!">
            <ol className="space-y-4 p-6" aria-label="Ranked recipes">
              {results.map((recipe, index) => (
                <li key={recipe.recipe_id} className="rounded-none border-2 border-black">
                  <RecipeHeader
                    recipe={recipe}
                    index={index}
                    name={recipeNames[recipe.recipe_id] ?? null}
                    open={expanded === recipe.recipe_id}
                    onToggle={() =>
                      setExpanded(expanded === recipe.recipe_id ? null : recipe.recipe_id)
                    }
                  />
                  {expanded === recipe.recipe_id && (
                    <div className="space-y-4 border-t-2 border-black p-4">
                      <ReceiptPanel
                        receipt={recipe}
                        recipeName={recipeNames[recipe.recipe_id] ?? null}
                        names={ingredientNames}
                        inventory={inventory}
                        onCorrect={onCorrect}
                        reranking={reranking}
                      />
                      <ShoppingSection
                        recipe={recipe}
                        lists={lists}
                        onComplete={(result) => onShoppingComplete?.(recipe.recipe_id, result)}
                        getNames={(ids) =>
                          Promise.resolve(
                            Object.fromEntries(
                              ids
                                .filter((id) => ingredientNames[id] !== undefined)
                                .map((id) => [id, ingredientNames[id]])
                            )
                          )
                        }
                      />
                    </div>
                  )}
                </li>
              ))}
            </ol>
          </ScrollArea>
        )}

        <div className="flex justify-end border-t-2 border-black p-4">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ---------------------------------------------------------------------------

interface RecipeHeaderProps {
  recipe: RankedRecipe;
  index: number;
  name: string | null;
  open: boolean;
  onToggle: () => void;
}

function RecipeHeader({ recipe, index, name, open, onToggle }: RecipeHeaderProps) {
  const label = name ?? `Recipe #${recipe.recipe_id}`;
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={open}
      className="flex w-full items-center justify-between gap-4 p-4 text-left"
    >
      <span className="flex items-center gap-3">
        <span className="flex size-6 items-center justify-center bg-black text-xs font-bold text-white">
          {index + 1}
        </span>
        <span className="font-semibold">{label}</span>
      </span>
      <span className="flex items-center gap-3">
        <span>
          <span className="font-bold">{formatScore(recipe.rank_score)}</span> points
        </span>
        {open ? <ChevronUp aria-hidden="true" /> : <ChevronDown aria-hidden="true" />}
      </span>
    </button>
  );
}

// ---------------------------------------------------------------------------

interface ShoppingSectionProps {
  recipe: RankedRecipe;
  lists: ShoppingListOption[] | null;
  onComplete: (result: ConfirmResponse) => void;
  getNames: NameLookup;
}

function ShoppingSection({ recipe, lists, onComplete, getNames }: ShoppingSectionProps) {
  const [listId, setListId] = useState<string>("");
  const [open, setOpen] = useState(false);
  const selectId = `list-for-${recipe.recipe_id}`;

  useEffect(() => {
    if (lists && lists.length > 0 && !lists.some((l) => l.id === listId)) setListId(lists[0].id);
  }, [lists, listId]);

  if (lists === null) {
    return (
      <p role="status" className="text-muted-foreground text-sm">
        Loading your shopping lists…
      </p>
    );
  }
  if (lists.length === 0) {
    return (
      <p className="text-sm">
        To add what is missing, first create a shopping list on the Shopping page.
      </p>
    );
  }

  if (open && listId) {
    return (
      <div className="rounded-md border">
        <ReceiptShoppingPreview
          recipe_id={recipe.recipe_id}
          servings={1}
          list_id={listId}
          onComplete={onComplete}
          onCancel={() => setOpen(false)}
          getNames={getNames}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-end gap-2 text-sm">
      <label htmlFor={selectId} className="flex flex-col text-xs">
        Shopping list
        <select
          id={selectId}
          value={listId}
          onChange={(e) => setListId(e.target.value)}
          className="h-8 rounded-md border bg-transparent px-2 text-sm"
        >
          {lists.map((l) => (
            <option key={l.id} value={l.id}>
              {l.name}
            </option>
          ))}
        </select>
      </label>
      <Button type="button" variant="outline" size="sm" onClick={() => setOpen(true)}>
        <ShoppingCart aria-hidden="true" /> Add what&apos;s missing to this list
      </Button>
    </div>
  );
}
