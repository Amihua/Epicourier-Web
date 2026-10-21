"use client";

/**
 * Receipt panel for one ranked recipe (P2 M2). Owner: Jeffery Zheng.
 *
 * Shows a `RankedRecipe` as a receipt a reader can add up by hand: one line per
 * contributing stock row or requirement, the signed points each line added, the
 * subtotals, and whether the lines reach the score. Every state is written in
 * words, never shown by colour or icon alone.
 *
 * Props follow `ReceiptPanelProps` in `@/types/receipt` (contract §8). The host
 * supplies `onCorrect`, which must persist through the inventory API and then
 * re-fetch and re-rank; the panel only collects the correction and reports the
 * outcome. Corrections are offered for a line only when the host also passes the
 * user's stock rows (`inventory`) and a row matches the line's `ingredient_id`.
 *
 * `rank_score` is ranking points, not a percentage, and is labelled as such.
 */

import { AlertTriangle, Check, Loader2, Pencil } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  STATUS_TEXT,
  WARNING_TEXT,
  buildCorrection,
  checkSums,
  formFromRow,
  formatPoints,
  formatQty,
  formatScore,
  groupBySource,
  rowsForLine,
  type CorrectionForm,
} from "@/lib/receipt/view";
import type {
  InventorySnapshot,
  ReceiptItem,
  ReceiptPanelProps,
  TargetOutcome,
} from "@/types/receipt";

export interface ReceiptPanelComponentProps extends ReceiptPanelProps {
  /** Display name for the recipe; the receipt carries only an id. */
  recipeName?: string | null;
  /** Ingredient names by id, display only (contract §10). */
  names?: Record<number, string>;
  /** The user's stock rows. Without them the panel is read-only. */
  inventory?: readonly InventorySnapshot[];
  /** True while the host is re-ranking after a correction. */
  reranking?: boolean;
}

type LineKey = string;
const keyOf = (item: ReceiptItem, index: number): LineKey =>
  `${item.source}:${item.ingredient_id}:${index}`;

export default function ReceiptPanel({
  receipt,
  onCorrect,
  recipeName,
  names = {},
  inventory,
  reranking = false,
}: ReceiptPanelComponentProps) {
  const [editing, setEditing] = useState<LineKey | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  // A new receipt means the host re-ranked: close any open form and clear the notice.
  useEffect(() => {
    setEditing(null);
  }, [receipt]);

  const sums = checkSums(receipt);
  const groups = groupBySource(receipt.items);
  const nameOf = (item: ReceiptItem) =>
    names[item.ingredient_id] ?? item.ingredient_name ?? `Ingredient #${item.ingredient_id}`;
  const title = recipeName
    ? `Receipt for ${recipeName}`
    : `Receipt for recipe #${receipt.recipe_id}`;
  const headingId = `receipt-${receipt.recipe_id}-title`;

  return (
    <section aria-labelledby={headingId} className="space-y-4 text-sm">
      <header className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 id={headingId} className="text-base font-semibold">
          {title}
        </h3>
        <p>
          <span className="text-lg font-bold" data-testid="rank-score">
            {formatScore(receipt.rank_score)}
          </span>{" "}
          <span>ranking points</span>
        </p>
      </header>

      <dl className="grid grid-cols-3 gap-2" aria-label="Subtotals">
        <div>
          <dt className="text-muted-foreground">What you have</dt>
          <dd className="font-medium">{formatPoints(receipt.subtotals.inventory)}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Expiry</dt>
          <dd className="font-medium">{formatPoints(receipt.subtotals.expiry)}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Nutrition</dt>
          <dd className="font-medium">{formatPoints(receipt.subtotals.nutrition)}</dd>
        </div>
      </dl>

      {receipt.items.length === 0 ? (
        <p>This recipe lists nothing that could be scored.</p>
      ) : (
        // The table keeps its columns and scrolls sideways on a narrow screen, so
        // Points and Correct stay reachable instead of being cut off (#31).
        <div className="overflow-x-auto">
          <table className="w-full border-collapse" aria-label="Receipt lines">
            <thead>
              <tr className="text-muted-foreground text-left text-xs uppercase">
                <th scope="col" className="py-1 pr-2 font-medium">
                  Ingredient
                </th>
                <th scope="col" className="py-1 pr-2 font-medium">
                  Needed
                </th>
                <th scope="col" className="py-1 pr-2 font-medium">
                  Usable
                </th>
                <th scope="col" className="py-1 pr-2 font-medium">
                  Expires
                </th>
                <th scope="col" className="py-1 pr-2 font-medium">
                  Status
                </th>
                <th scope="col" className="py-1 text-right font-medium">
                  Points
                </th>
                {inventory && (
                  <th scope="col" className="py-1 pl-2">
                    <span className="sr-only">Correct</span>
                  </th>
                )}
              </tr>
            </thead>
            {groups.map((group) => (
              <tbody key={group.source} data-source={group.source}>
                <tr>
                  <th
                    scope="rowgroup"
                    colSpan={inventory ? 7 : 6}
                    className="border-t pt-2 pb-1 text-left text-xs font-semibold"
                  >
                    {group.label}
                  </th>
                </tr>
                {group.items.map((item) => {
                  const index = receipt.items.indexOf(item);
                  const key = keyOf(item, index);
                  const rows =
                    inventory && item.source === "inventory" ? rowsForLine(item, inventory) : [];
                  const open = editing === key;
                  return (
                    <LineRows
                      key={key}
                      item={item}
                      name={nameOf(item)}
                      rows={rows}
                      correctable={Boolean(inventory)}
                      open={open}
                      busy={reranking}
                      onOpen={() => {
                        setNotice(null);
                        setEditing(open ? null : key);
                      }}
                      onClose={() => setEditing(null)}
                      onCorrect={onCorrect}
                      onSaved={(message) => setNotice(message)}
                    />
                  );
                })}
              </tbody>
            ))}
            <tfoot>
              <tr className="border-t font-medium">
                <th scope="row" colSpan={5} className="py-1 pr-2 text-left">
                  Lines add up to
                </th>
                <td className="py-1 text-right" data-testid="line-total">
                  {formatPoints(sums.lineTotal)}
                </td>
                {inventory && <td />}
              </tr>
            </tfoot>
          </table>
        </div>
      )}

      <p role={sums.matches ? undefined : "alert"} className="flex items-center gap-2">
        {sums.matches ? (
          <>
            <Check aria-hidden="true" className="size-4" />
            The lines add up to the score.
          </>
        ) : (
          <>
            <AlertTriangle aria-hidden="true" className="size-4" />
            The lines add up to {formatPoints(sums.lineTotal)} but the score says{" "}
            {formatScore(sums.rankScore)}. This receipt does not add up.
          </>
        )}
      </p>

      <Targets targets={receipt.targets} />

      {receipt.warnings.length > 0 && (
        <div>
          <h4 className="mb-1 font-medium">Notes</h4>
          <ul aria-label="Warnings" className="space-y-1">
            {receipt.warnings.map((w, i) => (
              <li key={`${w.code}:${w.ingredient_id ?? "-"}:${i}`} className="flex gap-2">
                <AlertTriangle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                <span>
                  {w.ingredient_id !== undefined && (
                    <span className="font-medium">
                      {names[w.ingredient_id] ?? `Ingredient #${w.ingredient_id}`}:{" "}
                    </span>
                  )}
                  {w.message || WARNING_TEXT[w.code]}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div role="status" aria-live="polite" className="min-h-5">
        {reranking ? (
          <p className="flex items-center gap-2">
            <Loader2 className="size-4 animate-spin" aria-hidden="true" /> Saved. Re-ranking with
            your corrected stock…
          </p>
        ) : (
          notice && <p>{notice}</p>
        )}
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------

interface LineRowsProps {
  item: ReceiptItem;
  name: string;
  rows: InventorySnapshot[];
  correctable: boolean;
  open: boolean;
  busy: boolean;
  onOpen: () => void;
  onClose: () => void;
  onCorrect: ReceiptPanelProps["onCorrect"];
  onSaved: (message: string) => void;
}

function LineRows({
  item,
  name,
  rows,
  correctable,
  open,
  busy,
  onOpen,
  onClose,
  onCorrect,
  onSaved,
}: LineRowsProps) {
  const canCorrect = correctable && item.source === "inventory" && rows.length > 0;
  return (
    <>
      <tr className="align-top">
        <td className="py-1 pr-2 font-medium">{name}</td>
        <td className="py-1 pr-2">{formatQty(item.required_qty, item.unit)}</td>
        <td className="py-1 pr-2">{formatQty(item.available_qty, item.unit)}</td>
        <td className="py-1 pr-2">{item.expiration_date ?? "—"}</td>
        <td className="py-1 pr-2">{STATUS_TEXT[item.status]}</td>
        <td className="py-1 text-right tabular-nums">{formatPoints(item.points)}</td>
        {correctable && (
          <td className="py-1 pl-2 text-right">
            {canCorrect ? (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={onOpen}
                disabled={busy}
                aria-expanded={open}
                aria-label={`Correct ${name}`}
              >
                <Pencil aria-hidden="true" /> Correct
              </Button>
            ) : item.source === "inventory" ? (
              <span className="text-muted-foreground text-xs">Not in your inventory</span>
            ) : null}
          </td>
        )}
      </tr>
      {open && (
        <tr>
          <td colSpan={7} className="pb-2">
            <CorrectionForms
              name={name}
              rows={rows}
              onCorrect={onCorrect}
              onClose={onClose}
              onSaved={onSaved}
            />
          </td>
        </tr>
      )}
    </>
  );
}

// ---------------------------------------------------------------------------

interface CorrectionFormsProps {
  name: string;
  rows: InventorySnapshot[];
  onCorrect: ReceiptPanelProps["onCorrect"];
  onClose: () => void;
  onSaved: (message: string) => void;
}

function CorrectionForms({ name, rows, onCorrect, onClose, onSaved }: CorrectionFormsProps) {
  return (
    <div className="space-y-2 rounded-md border p-3" role="group" aria-label={`Correct ${name}`}>
      <p className="text-muted-foreground text-xs">
        Fix what you actually have. Saving updates your inventory and re-ranks every recipe.
      </p>
      {rows.map((row) => (
        <RowForm key={row.inventory_id} row={row} onCorrect={onCorrect} onSaved={onSaved} />
      ))}
      <Button type="button" variant="ghost" size="sm" onClick={onClose}>
        Close
      </Button>
    </div>
  );
}

interface RowFormProps {
  row: InventorySnapshot;
  onCorrect: ReceiptPanelProps["onCorrect"];
  onSaved: (message: string) => void;
}

function RowForm({ row, onCorrect, onSaved }: RowFormProps) {
  const [form, setForm] = useState<CorrectionForm>(() => formFromRow(row));
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const label = row.location ? `${row.location}` : "stock";
  const qtyId = `qty-${row.inventory_id}`;
  const dateId = `exp-${row.inventory_id}`;

  const save = async () => {
    const result = buildCorrection(row, form);
    if (!result.ok) {
      setError(result.message);
      return;
    }
    setError(null);
    setPending(true);
    try {
      await onCorrect(row.inventory_id, result.patch);
      onSaved("Correction saved.");
    } catch (err) {
      setError(
        err instanceof Error && err.message ? err.message : "Could not save the correction."
      );
    } finally {
      setPending(false);
    }
  };

  return (
    <form
      className="flex flex-wrap items-end gap-2"
      aria-label={`${label} row`}
      onSubmit={(e) => {
        e.preventDefault();
        void save();
      }}
    >
      <span className="w-16 capitalize">{label}</span>
      <label htmlFor={qtyId} className="flex flex-col text-xs">
        Quantity{row.unit ? ` (${row.unit})` : ""}
        <Input
          id={qtyId}
          inputMode="decimal"
          value={form.quantity}
          onChange={(e) => setForm({ ...form, quantity: e.target.value })}
          disabled={pending}
          className="h-8 w-28"
        />
      </label>
      <label htmlFor={dateId} className="flex flex-col text-xs">
        Expires
        <Input
          id={dateId}
          type="date"
          value={form.expiration_date}
          onChange={(e) => setForm({ ...form, expiration_date: e.target.value })}
          disabled={pending}
          className="h-8 w-40"
        />
      </label>
      <Button type="submit" size="sm" disabled={pending}>
        {pending ? <Loader2 className="animate-spin" aria-hidden="true" /> : null}
        {pending ? "Saving…" : "Save"}
      </Button>
      {error && (
        <p role="alert" className="basis-full">
          {error}
        </p>
      )}
    </form>
  );
}

// ---------------------------------------------------------------------------

function Targets({ targets }: { targets: TargetOutcome | null }) {
  if (!targets) {
    return <p className="text-muted-foreground">No confirmed nutrient targets were used.</p>;
  }
  const remaining = Object.entries(targets.remaining);
  const over = Object.entries(targets.over).filter(([, v]) => v > 0);
  return (
    <div className="space-y-1" aria-label="Nutrient targets">
      <h4 className="font-medium">Against your targets</h4>
      {remaining.length > 0 && (
        <p>Left today: {remaining.map(([k, v]) => `${k} ${formatScore(v)}`).join(", ")}</p>
      )}
      {over.length > 0 && (
        <p>Past the target: {over.map(([k, v]) => `${k} ${formatScore(v)}`).join(", ")}</p>
      )}
      {targets.incomplete.length > 0 && <p>Missing data for: {targets.incomplete.join(", ")}</p>}
    </div>
  );
}
