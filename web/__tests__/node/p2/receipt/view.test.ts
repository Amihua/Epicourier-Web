/**
 * Pure receipt-view rules (P2 M2), checked against the M0 hand-computed case so
 * the panel's arithmetic is tied to the contract rather than to this test.
 */

import fs from "fs";
import path from "path";

import {
  buildCorrection,
  checkSums,
  formFromRow,
  formatPoints,
  formatQty,
  formatScore,
  groupBySource,
  ingredientNamesOf,
  rowsForLine,
  shortfall,
  toInventorySnapshot,
  toInventorySnapshots,
  STATUS_TEXT,
  WARNING_TEXT,
  SOURCE_ORDER,
} from "@/lib/receipt/view";
import type {
  InventorySnapshot,
  RankedRecipe,
  RankingResponse,
  ReceiptItem,
} from "@/types/receipt";

const HAND_COMPUTED = path.resolve(__dirname, "../../../../../p2/eval/cases/hand-computed.json");

function loadHandComputed(): RankingResponse {
  const raw = JSON.parse(fs.readFileSync(HAND_COMPUTED, "utf8")) as { receipt: RankingResponse };
  return raw.receipt;
}

const line = (over: Partial<ReceiptItem>): ReceiptItem => ({
  ingredient_id: 1,
  required_qty: 100,
  available_qty: 100,
  unit: "g",
  expiration_date: null,
  source: "inventory",
  points: 1,
  status: "ok",
  ...over,
});

const receipt = (over: Partial<RankedRecipe>): RankedRecipe => ({
  recipe_id: 1,
  rank_score: 0,
  subtotals: { inventory: 0, expiry: 0, nutrition: 0 },
  items: [],
  targets: null,
  warnings: [],
  ...over,
});

describe("checkSums", () => {
  it("accepts every receipt in the M0 hand-computed case", () => {
    const { results } = loadHandComputed();
    expect(results.length).toBeGreaterThan(0);
    for (const r of results) {
      const sums = checkSums(r);
      expect(sums.matches).toBe(true);
      expect(sums.lineTotal).toBe(r.rank_score);
    }
  });

  it("reports per-source sums that agree with the stated subtotals in the fixture", () => {
    const { results } = loadHandComputed();
    const first = results.find((r) => r.recipe_id === 101)!;
    const sums = checkSums(first);
    expect(sums.bySource.inventory).toBe(first.subtotals.inventory);
    expect(sums.bySource.expiry).toBe(first.subtotals.expiry);
    expect(sums.bySource.nutrition).toBe(first.subtotals.nutrition);
    expect(sums.bySource.global).toBe(0);
  });

  it("flags a receipt whose lines do not reach its score", () => {
    const bad = receipt({ rank_score: 3, items: [line({ points: 1 }), line({ points: 1 })] });
    const sums = checkSums(bad);
    expect(sums.matches).toBe(false);
    expect(sums.lineTotal).toBe(2);
    expect(sums.rankScore).toBe(3);
  });

  it("compares after the contract's rounding, not on raw floats", () => {
    // 0.1 + 0.2 is not 0.3 in IEEE754; after two-decimal rounding it must be.
    const r = receipt({ rank_score: 0.3, items: [line({ points: 0.1 }), line({ points: 0.2 })] });
    expect(checkSums(r).matches).toBe(true);
  });

  it("treats an empty receipt with a zero score as adding up", () => {
    expect(checkSums(receipt({ rank_score: 0 })).matches).toBe(true);
  });

  it("counts negative lines", () => {
    const r = receipt({ rank_score: -0.5, items: [line({ points: 1 }), line({ points: -1.5 })] });
    expect(checkSums(r).matches).toBe(true);
  });
});

describe("groupBySource", () => {
  it("orders groups inventory, expiry, nutrition, global and drops empty ones", () => {
    const items = [
      line({ source: "global", ingredient_id: 9 }),
      line({ source: "expiry", ingredient_id: 2 }),
      line({ source: "inventory", ingredient_id: 1 }),
    ];
    expect(groupBySource(items).map((g) => g.source)).toEqual(["inventory", "expiry", "global"]);
    expect(SOURCE_ORDER).toEqual(["inventory", "expiry", "nutrition", "global"]);
  });

  it("keeps the scorer's order inside a group", () => {
    const items = [
      line({ ingredient_id: 14 }),
      line({ ingredient_id: 11 }),
      line({ ingredient_id: 13 }),
    ];
    expect(groupBySource(items)[0].items.map((i) => i.ingredient_id)).toEqual([14, 11, 13]);
  });

  it("puts the fixture's expiry line in its own group after the pantry lines", () => {
    const { results } = loadHandComputed();
    const groups = groupBySource(results.find((r) => r.recipe_id === 101)!.items);
    expect(groups.map((g) => [g.source, g.items.length])).toEqual([
      ["inventory", 4],
      ["expiry", 1],
    ]);
  });
});

describe("shortfall", () => {
  it("is required minus available, never below zero, and null when unknown", () => {
    expect(shortfall({ required_qty: 500, available_qty: 350 })).toBe(150);
    expect(shortfall({ required_qty: 200, available_qty: 300 })).toBe(0);
    expect(shortfall({ required_qty: 0, available_qty: 0 })).toBe(0);
    expect(shortfall({ required_qty: null, available_qty: 50 })).toBeNull();
  });
});

describe("formatting", () => {
  it("formats quantities with their unit and a dash for unknown", () => {
    expect(formatQty(350, "g")).toBe("350 g");
    expect(formatQty(0.5, "cup")).toBe("0.5 cup");
    expect(formatQty(2, null)).toBe("2");
    expect(formatQty(null, "g")).toBe("—");
    expect(formatQty(1.005, "g")).toBe("1.01 g");
  });

  it("formats points with an explicit sign and two decimals", () => {
    expect(formatPoints(1)).toBe("+1.00");
    expect(formatPoints(-0.25)).toBe("−0.25");
    expect(formatPoints(0)).toBe("0.00");
    expect(formatPoints(1.005)).toBe("+1.01");
  });

  it("formats scores unsigned with two decimals", () => {
    expect(formatScore(3)).toBe("3.00");
    expect(formatScore(1234.5)).toBe("1,234.50");
  });

  it("has words for every status, source and warning code", () => {
    for (const status of ["ok", "missing", "expired", "unresolved_unit", "unknown_requirement"]) {
      expect(STATUS_TEXT[status as keyof typeof STATUS_TEXT]).toMatch(/\w/);
    }
    for (const code of [
      "targets_unconfirmed",
      "missing_nutrient_data",
      "unresolved_unit",
      "unknown_requirement",
      "expired_stock_excluded",
    ]) {
      expect(WARNING_TEXT[code as keyof typeof WARNING_TEXT]).toMatch(/\w/);
    }
  });
});

const STOCK: InventorySnapshot[] = [
  {
    inventory_id: "r-fridge",
    ingredient_id: 11,
    quantity: 200,
    unit: "g",
    location: "fridge",
    expiration_date: "2026-10-12",
  },
  {
    inventory_id: "r-freezer",
    ingredient_id: 11,
    quantity: 150,
    unit: "g",
    location: "freezer",
    expiration_date: "2026-10-10",
  },
  {
    inventory_id: "r-other",
    ingredient_id: 12,
    quantity: 300,
    unit: "g",
    location: "pantry",
    expiration_date: null,
  },
];

describe("rowsForLine", () => {
  it("matches by ingredient_id only and never by name", () => {
    const rows = rowsForLine({ ingredient_id: 11 }, STOCK);
    expect(rows.map((r) => r.inventory_id)).toEqual(["r-freezer", "r-fridge"]);
  });

  it("is stable under input order", () => {
    const shuffled = [STOCK[2], STOCK[0], STOCK[1]];
    expect(rowsForLine({ ingredient_id: 11 }, shuffled)).toEqual(
      rowsForLine({ ingredient_id: 11 }, STOCK)
    );
  });

  it("returns nothing for an ingredient the user does not hold", () => {
    expect(rowsForLine({ ingredient_id: 99 }, STOCK)).toEqual([]);
  });
});

describe("buildCorrection", () => {
  const row = STOCK[0];

  it("starts the form from the row", () => {
    expect(formFromRow(row)).toEqual({ quantity: "200", expiration_date: "2026-10-12" });
    expect(formFromRow(STOCK[2])).toEqual({ quantity: "300", expiration_date: "" });
  });

  it("sends only the fields that changed", () => {
    expect(buildCorrection(row, { quantity: "350", expiration_date: "2026-10-12" })).toEqual({
      ok: true,
      patch: { quantity: 350 },
    });
    expect(buildCorrection(row, { quantity: "200", expiration_date: "2026-11-01" })).toEqual({
      ok: true,
      patch: { expiration_date: "2026-11-01" },
    });
    expect(buildCorrection(row, { quantity: "0", expiration_date: "" })).toEqual({
      ok: true,
      patch: { quantity: 0, expiration_date: null },
    });
  });

  it("refuses a form that changes nothing", () => {
    const result = buildCorrection(row, formFromRow(row));
    expect(result).toEqual({ ok: false, message: "Nothing changed." });
  });

  it("refuses an empty, negative or non-numeric quantity in words", () => {
    expect(buildCorrection(row, { quantity: "", expiration_date: "" }).ok).toBe(false);
    expect(buildCorrection(row, { quantity: "-1", expiration_date: "" }).ok).toBe(false);
    expect(buildCorrection(row, { quantity: "lots", expiration_date: "" }).ok).toBe(false);
    expect(buildCorrection(row, { quantity: "Infinity", expiration_date: "" }).ok).toBe(false);
    const r = buildCorrection(row, { quantity: "abc", expiration_date: "" });
    expect(r.ok === false && r.message).toMatch(/number/i);
  });

  it("refuses a malformed date and accepts an empty one as 'no expiry'", () => {
    expect(buildCorrection(row, { quantity: "200", expiration_date: "31/10/2026" }).ok).toBe(false);
    expect(buildCorrection(row, { quantity: "200", expiration_date: "2026-13-40" }).ok).toBe(false);
    expect(buildCorrection(row, { quantity: "200", expiration_date: "" })).toEqual({
      ok: true,
      patch: { expiration_date: null },
    });
  });

  it("accepts a decimal quantity", () => {
    expect(buildCorrection(row, { quantity: "0.5", expiration_date: "2026-10-12" })).toEqual({
      ok: true,
      patch: { quantity: 0.5 },
    });
  });
});

describe("page adapters", () => {
  const item = {
    id: "row-1",
    ingredient_id: 11,
    quantity: 200,
    unit: "g",
    location: "fridge" as const,
    expiration_date: "2026-10-12",
    ingredient: { id: 11, name: "Chicken breast" },
  };

  it("maps an inventory row to the contract's snapshot shape", () => {
    expect(toInventorySnapshot(item)).toEqual({
      inventory_id: "row-1",
      ingredient_id: 11,
      quantity: 200,
      unit: "g",
      location: "fridge",
      expiration_date: "2026-10-12",
    });
    expect(toInventorySnapshots([item])).toHaveLength(1);
  });

  it("collects display names and skips rows with no name", () => {
    const nameless = { ingredient_id: 12, ingredient: { id: 12, name: null } };
    const names = ingredientNamesOf([item, nameless] as unknown as Parameters<
      typeof ingredientNamesOf
    >[0]);
    expect(names).toEqual({ 11: "Chicken breast" });
  });
});
