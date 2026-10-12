/**
 * @jest-environment node
 */

import { asOfDate, DEFAULT_TIME_ZONE, receiptTimeZone } from "@/lib/receipt-shopping/asOfDate";
import { snapshotId, type SnapshotInput } from "@/lib/receipt-shopping/snapshot";
import { toInventorySnapshots, toRequirements } from "@/lib/receipt-shopping/requirements";
import { computePantryDelta } from "@/lib/receipt-shopping/delta";

describe("asOfDate", () => {
  const originalTz = process.env.RECEIPT_TIME_ZONE;
  afterEach(() => {
    if (originalTz === undefined) delete process.env.RECEIPT_TIME_ZONE;
    else process.env.RECEIPT_TIME_ZONE = originalTz;
  });

  it("formats as YYYY-MM-DD", () => {
    expect(asOfDate(new Date("2026-10-10T15:00:00Z"), "UTC")).toBe("2026-10-10");
  });

  it("uses the named zone, not the machine clock: 02:00 UTC is still yesterday in New York", () => {
    expect(asOfDate(new Date("2026-10-11T02:00:00Z"), "America/New_York")).toBe("2026-10-10");
    expect(asOfDate(new Date("2026-10-11T02:00:00Z"), "UTC")).toBe("2026-10-11");
  });

  it("defaults to America/New_York", () => {
    delete process.env.RECEIPT_TIME_ZONE;
    expect(receiptTimeZone()).toBe(DEFAULT_TIME_ZONE);
    expect(asOfDate(new Date("2026-10-11T02:00:00Z"))).toBe("2026-10-10");
  });

  it("honours RECEIPT_TIME_ZONE", () => {
    process.env.RECEIPT_TIME_ZONE = "Asia/Shanghai";
    expect(asOfDate(new Date("2026-10-10T20:00:00Z"))).toBe("2026-10-11");
  });
});

describe("snapshotId", () => {
  const base: SnapshotInput = {
    recipe_id: 7,
    servings: 1,
    requirements: [
      { ingredient_id: 1, quantity: 5, unit: "100g" },
      { ingredient_id: 2, quantity: 1, unit: "cup" },
    ],
    inventory: [
      {
        inventory_id: "a",
        ingredient_id: 1,
        quantity: 200,
        unit: "g",
        location: "fridge",
        expiration_date: "2026-10-12",
      },
      {
        inventory_id: "b",
        ingredient_id: 9,
        quantity: 1,
        unit: "L",
        location: "fridge",
        expiration_date: null,
      },
    ],
  };

  it("is stable and prefixed", () => {
    expect(snapshotId(base)).toBe(snapshotId(base));
    expect(snapshotId(base)).toMatch(/^snap_[0-9a-f]{64}$/);
  });

  it("does not depend on array order", () => {
    const reordered = {
      ...base,
      requirements: [...base.requirements].reverse(),
      inventory: [...base.inventory].reverse(),
    };
    expect(snapshotId(reordered)).toBe(snapshotId(base));
  });

  it("changes when a relevant row's quantity changes", () => {
    const changed = {
      ...base,
      inventory: [{ ...base.inventory[0], quantity: 150 }, base.inventory[1]],
    };
    expect(snapshotId(changed)).not.toBe(snapshotId(base));
  });

  it("changes when a relevant row's expiry changes", () => {
    const changed = {
      ...base,
      inventory: [{ ...base.inventory[0], expiration_date: "2026-10-20" }, base.inventory[1]],
    };
    expect(snapshotId(changed)).not.toBe(snapshotId(base));
  });

  it("changes when a relevant row is added", () => {
    const changed = {
      ...base,
      inventory: [...base.inventory, { ...base.inventory[0], inventory_id: "c" }],
    };
    expect(snapshotId(changed)).not.toBe(snapshotId(base));
  });

  it("ignores rows for ingredients the recipe does not use", () => {
    const changed = {
      ...base,
      inventory: [base.inventory[0], { ...base.inventory[1], quantity: 99 }],
    };
    expect(snapshotId(changed)).toBe(snapshotId(base));
  });

  it("ignores the location of a row, which does not affect the delta", () => {
    const changed = {
      ...base,
      inventory: [{ ...base.inventory[0], location: "pantry" as const }, base.inventory[1]],
    };
    expect(snapshotId(changed)).toBe(snapshotId(base));
  });

  it("changes with servings and recipe", () => {
    expect(snapshotId({ ...base, servings: 2 })).not.toBe(snapshotId(base));
    expect(snapshotId({ ...base, recipe_id: 8 })).not.toBe(snapshotId(base));
  });
});

describe("toRequirements", () => {
  it("turns relative_unit_100 into a fraction of the base unit", () => {
    expect(
      toRequirements([{ ingredient_id: 3, relative_unit_100: 250, Ingredient: { unit: "100g" } }])
    ).toEqual([{ ingredient_id: 3, quantity: 2.5, unit: "100g" }]);
  });

  it("keeps 0 as 0, never the `|| 100` default", () => {
    expect(
      toRequirements([{ ingredient_id: 3, relative_unit_100: 0, Ingredient: { unit: "100g" } }])
    ).toEqual([{ ingredient_id: 3, quantity: 0, unit: "100g" }]);
  });

  it("keeps null as null (unknown requirement)", () => {
    expect(
      toRequirements([{ ingredient_id: 3, relative_unit_100: null, Ingredient: { unit: "g" } }])
    ).toEqual([{ ingredient_id: 3, quantity: null, unit: "g" }]);
  });

  it("parses a numeric string from PostgREST", () => {
    expect(
      toRequirements([
        { ingredient_id: 3, relative_unit_100: "50", Ingredient: [{ unit: "1 cup" }] },
      ])
    ).toEqual([{ ingredient_id: 3, quantity: 0.5, unit: "1 cup" }]);
  });

  it("skips map rows with no ingredient", () => {
    expect(
      toRequirements([{ ingredient_id: null, relative_unit_100: 10, Ingredient: null }])
    ).toEqual([]);
  });

  it("uses an empty unit when the join is missing, which the delta reports as missing_unit", () => {
    const requirements = toRequirements([
      { ingredient_id: 3, relative_unit_100: 100, Ingredient: null },
    ]);
    expect(
      computePantryDelta({ as_of_date: "2026-10-10", requirements, inventory: [] }).unresolved
    ).toEqual([{ ingredient_id: 3, reason: "missing_unit" }]);
  });

  it("end to end: 250% of '100g' against 200 g in stock is short 50 g", () => {
    const requirements = toRequirements([
      { ingredient_id: 3, relative_unit_100: 250, Ingredient: { unit: "100g" } },
    ]);
    const inventory = toInventorySnapshots([
      {
        id: "x",
        ingredient_id: 3,
        quantity: "200.00",
        unit: "g",
        location: "pantry",
        expiration_date: null,
      },
    ]);
    expect(
      computePantryDelta({ as_of_date: "2026-10-10", requirements, inventory }).deltas
    ).toEqual([{ ingredient_id: 3, missing_qty: 50, unit: "g" }]);
  });
});

describe("toInventorySnapshots", () => {
  it("coerces DECIMAL strings and BIGINT ids to numbers", () => {
    expect(
      toInventorySnapshots([
        {
          id: "x",
          ingredient_id: "12",
          quantity: "1.50",
          unit: "kg",
          location: "freezer",
          expiration_date: "2026-11-01",
        },
      ])
    ).toEqual([
      {
        inventory_id: "x",
        ingredient_id: 12,
        quantity: 1.5,
        unit: "kg",
        location: "freezer",
        expiration_date: "2026-11-01",
      },
    ]);
  });

  it("maps an unknown location to 'other' and trims a timestamp to its date", () => {
    const [snap] = toInventorySnapshots([
      {
        id: "x",
        ingredient_id: 1,
        quantity: 1,
        unit: "g",
        location: "garage",
        expiration_date: "2026-11-01T00:00:00+00:00",
      },
    ]);
    expect(snap.location).toBe("other");
    expect(snap.expiration_date).toBe("2026-11-01");
  });

  it("leaves an unparseable quantity as NaN so the delta rejects it", () => {
    const inventory = toInventorySnapshots([
      {
        id: "x",
        ingredient_id: 1,
        quantity: "lots",
        unit: "g",
        location: "pantry",
        expiration_date: null,
      },
    ]);
    expect(() =>
      computePantryDelta({
        as_of_date: "2026-10-10",
        requirements: [{ ingredient_id: 1, quantity: 1, unit: "g" }],
        inventory,
      })
    ).toThrow(/invalid quantity/);
  });
});
