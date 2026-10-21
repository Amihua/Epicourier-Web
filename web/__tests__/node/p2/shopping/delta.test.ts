/**
 * @jest-environment node
 */

import fs from "fs";
import path from "path";

import {
  ceilToCents,
  computePantryDelta,
  DeltaInputError,
  isIsoDate,
  wholeItems,
  type DeltaInput,
} from "@/lib/receipt-shopping/delta";
import type { InventorySnapshot, RankingRequest, Requirement } from "@/types/receipt";

const AS_OF = "2026-10-10";

let rowCounter = 0;
function row(overrides: Partial<InventorySnapshot> & { ingredient_id: number }): InventorySnapshot {
  rowCounter += 1;
  return {
    inventory_id: `00000000-0000-4000-8000-${String(rowCounter).padStart(12, "0")}`,
    quantity: 0,
    unit: "g",
    location: "pantry",
    expiration_date: null,
    ...overrides,
  };
}

function req(ingredient_id: number, quantity: number | null, unit = "g"): Requirement {
  return { ingredient_id, quantity, unit };
}

function delta(input: Partial<DeltaInput>) {
  return computePantryDelta({ as_of_date: AS_OF, requirements: [], inventory: [], ...input });
}

describe("computePantryDelta — the plan's acceptance example", () => {
  it("needs 500 g, has 200 g usable, adds only 300 g", () => {
    const result = delta({
      requirements: [req(1, 500)],
      inventory: [row({ ingredient_id: 1, quantity: 200 })],
    });
    expect(result).toEqual({
      deltas: [{ ingredient_id: 1, missing_qty: 300, unit: "g" }],
      unresolved: [],
    });
  });
});

describe("computePantryDelta — golden fixture (p2/contracts/fixtures)", () => {
  const fixturePath = path.resolve(
    __dirname,
    "../../../../../p2/contracts/fixtures/ranking-request.golden.json"
  );
  const golden = JSON.parse(fs.readFileSync(fixturePath, "utf8")) as RankingRequest;
  const forRecipe = (id: number) => {
    const candidate = golden.candidates.find((c) => c.recipe_id === id)!;
    return computePantryDelta({
      as_of_date: golden.as_of_date,
      servings: candidate.servings,
      requirements: candidate.requirements,
      inventory: golden.inventory,
    });
  };

  it("recipe 101: short 150 g of ingredient 11 (200 fridge + 150 freezer, both usable)", () => {
    expect(forRecipe(101).deltas).toEqual([{ ingredient_id: 11, missing_qty: 150, unit: "g" }]);
  });

  it("recipe 101: a zero requirement is zero, even with only expired stock", () => {
    expect(forRecipe(101).deltas.find((d) => d.ingredient_id === 13)).toBeUndefined();
    expect(forRecipe(101).unresolved.find((u) => u.ingredient_id === 13)).toBeUndefined();
  });

  it("recipe 101: a null requirement is unknown_requirement, not a default", () => {
    expect(forRecipe(101).unresolved).toEqual([
      { ingredient_id: 14, reason: "unknown_requirement" },
    ]);
  });

  it("recipe 102: two servings need 200 g of 11, covered by 350 g", () => {
    expect(forRecipe(102).deltas).toEqual([]);
  });

  it("recipe 102: a null stored unit is missing_unit, never subtracted (D2)", () => {
    expect(forRecipe(102).unresolved).toEqual([{ ingredient_id: 15, reason: "missing_unit" }]);
  });

  it("recipe 103: no requirements gives an empty, defined result", () => {
    expect(forRecipe(103)).toEqual({ deltas: [], unresolved: [] });
  });
});

describe("computePantryDelta — expiry", () => {
  it("excludes a row that expired the day before as_of_date", () => {
    const result = delta({
      requirements: [req(1, 100)],
      inventory: [row({ ingredient_id: 1, quantity: 100, expiration_date: "2026-10-09" })],
    });
    expect(result.deltas).toEqual([{ ingredient_id: 1, missing_qty: 100, unit: "g" }]);
  });

  it("keeps a row that expires exactly on as_of_date", () => {
    const result = delta({
      requirements: [req(1, 100)],
      inventory: [row({ ingredient_id: 1, quantity: 100, expiration_date: AS_OF })],
    });
    expect(result.deltas).toEqual([]);
  });

  it("keeps a row with no expiry date", () => {
    const result = delta({
      requirements: [req(1, 100)],
      inventory: [row({ ingredient_id: 1, quantity: 100, expiration_date: null })],
    });
    expect(result.deltas).toEqual([]);
  });

  it("ignores an expired row with a null unit instead of reporting missing_unit", () => {
    const result = delta({
      requirements: [req(1, 100)],
      inventory: [
        row({ ingredient_id: 1, quantity: 5, unit: null, expiration_date: "2026-10-01" }),
      ],
    });
    expect(result).toEqual({
      deltas: [{ ingredient_id: 1, missing_qty: 100, unit: "g" }],
      unresolved: [],
    });
  });
});

describe("computePantryDelta — summing and units", () => {
  it("sums rows of one ingredient across locations", () => {
    const result = delta({
      requirements: [req(1, 1000)],
      inventory: [
        row({ ingredient_id: 1, quantity: 300, location: "fridge" }),
        row({ ingredient_id: 1, quantity: 300, location: "freezer" }),
        row({ ingredient_id: 1, quantity: 300, location: "pantry" }),
      ],
    });
    expect(result.deltas).toEqual([{ ingredient_id: 1, missing_qty: 100, unit: "g" }]);
  });

  it("converts kilograms of stock against a gram requirement", () => {
    const result = delta({
      requirements: [req(1, 1500)],
      inventory: [row({ ingredient_id: 1, quantity: 1, unit: "kg" })],
    });
    expect(result.deltas).toEqual([{ ingredient_id: 1, missing_qty: 500, unit: "g" }]);
  });

  it("reads a '100g' base unit: 2.5 of it is 250 g", () => {
    const result = delta({
      requirements: [req(1, 2.5, "100g")],
      inventory: [row({ ingredient_id: 1, quantity: 100, unit: "g" })],
    });
    expect(result.deltas).toEqual([{ ingredient_id: 1, missing_qty: 150, unit: "g" }]);
  });

  it("sums duplicate requirement rows for one ingredient", () => {
    const result = delta({ requirements: [req(1, 100), req(1, 50)] });
    expect(result.deltas).toEqual([{ ingredient_id: 1, missing_qty: 150, unit: "g" }]);
  });

  it("ignores stock of other ingredients", () => {
    const result = delta({
      requirements: [req(1, 100)],
      inventory: [row({ ingredient_id: 2, quantity: 1000 })],
    });
    expect(result.deltas).toEqual([{ ingredient_id: 1, missing_qty: 100, unit: "g" }]);
  });

  it("does not let surplus of one ingredient offset another", () => {
    const result = delta({
      requirements: [req(1, 100), req(2, 100)],
      inventory: [row({ ingredient_id: 1, quantity: 500 })],
    });
    expect(result.deltas).toEqual([{ ingredient_id: 2, missing_qty: 100, unit: "g" }]);
  });

  it("matches singular and plural of an unknown unit", () => {
    const result = delta({
      requirements: [req(1, 3, "cloves")],
      inventory: [row({ ingredient_id: 1, quantity: 1, unit: "clove" })],
    });
    expect(result.deltas).toEqual([{ ingredient_id: 1, missing_qty: 2, unit: "cloves" }]);
  });
});

describe("computePantryDelta — unresolved lines", () => {
  it("reports incompatible_unit when the only stock is in another dimension", () => {
    const result = delta({
      requirements: [req(1, 200, "g")],
      inventory: [row({ ingredient_id: 1, quantity: 3, unit: "pieces" })],
    });
    expect(result).toEqual({
      deltas: [],
      unresolved: [{ ingredient_id: 1, reason: "incompatible_unit" }],
    });
  });

  it("does not report anything when comparable stock already covers the need", () => {
    const result = delta({
      requirements: [req(1, 200)],
      inventory: [
        row({ ingredient_id: 1, quantity: 250 }),
        row({ ingredient_id: 1, quantity: 3, unit: null, location: "fridge" }),
      ],
    });
    expect(result).toEqual({ deltas: [], unresolved: [] });
  });

  it("prefers missing_unit over incompatible_unit when both kinds of row exist", () => {
    const result = delta({
      requirements: [req(1, 200)],
      inventory: [
        row({ ingredient_id: 1, quantity: 3, unit: "pieces", location: "fridge" }),
        row({ ingredient_id: 1, quantity: 3, unit: null, location: "pantry" }),
      ],
    });
    expect(result.unresolved).toEqual([{ ingredient_id: 1, reason: "missing_unit" }]);
  });

  it("treats a zero requirement with no unit as zero, not as unresolved", () => {
    expect(delta({ requirements: [req(1, 0, "")] })).toEqual({ deltas: [], unresolved: [] });
  });

  it("reports missing_unit for a requirement whose unit is empty", () => {
    const result = delta({ requirements: [req(1, 100, "")] });
    expect(result.unresolved).toEqual([{ ingredient_id: 1, reason: "missing_unit" }]);
  });

  it("reports incompatible_unit when one ingredient's requirements disagree", () => {
    const result = delta({ requirements: [req(1, 100, "g"), req(1, 1, "cup")] });
    expect(result.unresolved).toEqual([{ ingredient_id: 1, reason: "incompatible_unit" }]);
  });

  it("treats a null among duplicate requirements as unknown", () => {
    const result = delta({ requirements: [req(1, 100), req(1, null)] });
    expect(result.unresolved).toEqual([{ ingredient_id: 1, reason: "unknown_requirement" }]);
  });
});

describe("computePantryDelta — servings (D1)", () => {
  it("scales requirements by servings", () => {
    const result = delta({
      servings: 3,
      requirements: [req(1, 100)],
      inventory: [row({ ingredient_id: 1, quantity: 100 })],
    });
    expect(result.deltas).toEqual([{ ingredient_id: 1, missing_qty: 200, unit: "g" }]);
  });

  it("defaults servings to 1", () => {
    expect(delta({ requirements: [req(1, 100)] }).deltas[0].missing_qty).toBe(100);
  });

  it.each([0, -1, 1.5, Number.NaN])("rejects servings = %p", (servings) => {
    expect(() => delta({ servings, requirements: [req(1, 1)] })).toThrow(DeltaInputError);
  });
});

describe("computePantryDelta — rounding", () => {
  it("rounds a shortfall up to the next 0.01", () => {
    const result = delta({ requirements: [req(1, 0.001, "kg")] });
    expect(result.deltas).toEqual([{ ingredient_id: 1, missing_qty: 0.01, unit: "kg" }]);
  });

  it("does not turn float noise into an extra cent", () => {
    const result = delta({
      requirements: [req(1, 0.3, "kg")],
      inventory: [row({ ingredient_id: 1, quantity: 0.1, unit: "kg" })],
    });
    expect(result.deltas[0].missing_qty).toBe(0.2);
  });

  it("never emits a zero missing_qty (the schema requires > 0)", () => {
    const result = delta({
      requirements: [req(1, 100.000000001)],
      inventory: [row({ ingredient_id: 1, quantity: 100 })],
    });
    expect(result.deltas).toEqual([]);
  });
});

describe("computePantryDelta — invalid input", () => {
  it("rejects a malformed as_of_date", () => {
    expect(() => delta({ as_of_date: "10/10/2026" })).toThrow(DeltaInputError);
  });

  it("rejects an impossible calendar date", () => {
    expect(() => delta({ as_of_date: "2026-02-30" })).toThrow(DeltaInputError);
  });

  it("rejects a negative requirement", () => {
    expect(() => delta({ requirements: [req(1, -5)] })).toThrow(/invalid quantity/);
  });

  it("rejects a non-finite requirement", () => {
    expect(() => delta({ requirements: [req(1, Infinity)] })).toThrow(DeltaInputError);
  });

  it("rejects a negative inventory quantity", () => {
    expect(() =>
      delta({ requirements: [req(1, 5)], inventory: [row({ ingredient_id: 1, quantity: -1 })] })
    ).toThrow(DeltaInputError);
  });

  it("rejects a duplicated inventory row, which would double-count stock", () => {
    const r = row({ ingredient_id: 1, quantity: 100 });
    expect(() => delta({ requirements: [req(1, 150)], inventory: [r, r] })).toThrow(/twice/);
  });

  it("rejects a malformed expiration date", () => {
    expect(() =>
      delta({
        requirements: [req(1, 5)],
        inventory: [row({ ingredient_id: 1, quantity: 1, expiration_date: "soon" })],
      })
    ).toThrow(DeltaInputError);
  });

  it("rejects a non-positive ingredient id", () => {
    expect(() => delta({ requirements: [req(0, 5)] })).toThrow(DeltaInputError);
  });
});

describe("computePantryDelta — properties", () => {
  // Deterministic pseudo-random generator so every run checks the same cases.
  function lcg(seed: number) {
    let s = seed;
    return () => {
      s = (s * 1664525 + 1013904223) % 4294967296;
      return s / 4294967296;
    };
  }

  function randomCase(seed: number): DeltaInput {
    const rand = lcg(seed);
    const units = ["g", "kg", null, "pieces", "100g"];
    const dates = [null, "2026-10-09", "2026-10-10", "2026-10-11"];
    const requirements = Array.from({ length: 4 }, (_, i) =>
      req(i + 1, rand() < 0.1 ? null : Math.round(rand() * 800), rand() < 0.5 ? "g" : "100g")
    );
    const inventory = Array.from({ length: 8 }, () =>
      row({
        ingredient_id: 1 + Math.floor(rand() * 5),
        quantity: Math.round(rand() * 400),
        unit: units[Math.floor(rand() * units.length)],
        expiration_date: dates[Math.floor(rand() * dates.length)],
      })
    );
    return { as_of_date: AS_OF, servings: 1 + Math.floor(rand() * 3), requirements, inventory };
  }

  function shuffled<T>(items: T[], seed: number): T[] {
    const rand = lcg(seed);
    const copy = [...items];
    for (let i = copy.length - 1; i > 0; i -= 1) {
      const j = Math.floor(rand() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  it("is unchanged by 20 orderings of inventory and requirements, over 25 cases", () => {
    for (let seed = 1; seed <= 25; seed += 1) {
      const input = randomCase(seed);
      const expected = computePantryDelta(input);
      for (let k = 1; k <= 20; k += 1) {
        const permuted = {
          ...input,
          inventory: shuffled(input.inventory, seed * 100 + k),
          requirements: shuffled(input.requirements, seed * 1000 + k),
        };
        expect(computePantryDelta(permuted)).toEqual(expected);
      }
    }
  });

  it("never asks for more than the requirement, and never a non-positive amount", () => {
    for (let seed = 1; seed <= 50; seed += 1) {
      const input = randomCase(seed);
      for (const d of computePantryDelta(input).deltas) {
        expect(d.missing_qty).toBeGreaterThan(0);
        const need = input.requirements
          .filter((r) => r.ingredient_id === d.ingredient_id)
          .reduce((sum, r) => sum + (r.unit === "100g" ? r.quantity! * 100 : r.quantity!), 0);
        expect(d.missing_qty).toBeLessThanOrEqual(ceilToCents(need * (input.servings ?? 1)));
      }
    }
  });

  it("adding usable stock never increases what is missing", () => {
    for (let seed = 1; seed <= 50; seed += 1) {
      const input = randomCase(seed);
      const before = computePantryDelta(input);
      const after = computePantryDelta({
        ...input,
        inventory: [...input.inventory, row({ ingredient_id: 1, quantity: 50, unit: "g" })],
      });
      const beforeQty = before.deltas.find((d) => d.ingredient_id === 1)?.missing_qty ?? 0;
      const afterQty = after.deltas.find((d) => d.ingredient_id === 1)?.missing_qty ?? 0;
      expect(afterQty).toBeLessThanOrEqual(beforeQty);
    }
  });

  it("orders output by ingredient_id", () => {
    for (let seed = 1; seed <= 25; seed += 1) {
      const { deltas, unresolved } = computePantryDelta(randomCase(seed));
      const ids = deltas.map((d) => d.ingredient_id);
      expect(ids).toEqual([...ids].sort((a, b) => a - b));
      const uids = unresolved.map((u) => u.ingredient_id);
      expect(uids).toEqual([...uids].sort((a, b) => a - b));
    }
  });

  it("never reports one ingredient as both a delta and unresolved", () => {
    for (let seed = 1; seed <= 50; seed += 1) {
      const { deltas, unresolved } = computePantryDelta(randomCase(seed));
      const both = deltas.filter((d) =>
        unresolved.some((u) => u.ingredient_id === d.ingredient_id)
      );
      expect(both).toEqual([]);
    }
  });
});

describe("helpers", () => {
  it.each([
    ["2026-10-10", true],
    ["2024-02-29", true],
    ["2026-02-29", false],
    ["2026-13-01", false],
    ["2026-1-01", false],
    [20261010, false],
  ])("isIsoDate(%p) is %p", (value, expected) => {
    expect(isIsoDate(value)).toBe(expected);
  });

  it.each([
    [150, 150],
    [150.0000000001, 150],
    [0.001, 0.01],
    [2.501, 2.51],
    [0.1 + 0.2, 0.3],
  ])("ceilToCents(%p) is %p", (value, expected) => {
    expect(ceilToCents(value)).toBe(expected);
  });
});

describe("computePantryDelta — the dataset's bracketed units (#33)", () => {
  it("olive oil: 15% of '1 tbsp (15 ml)' is covered by 500 ml, so no line", () => {
    const result = delta({
      requirements: [req(2, 0.15, "1 tbsp (15 ml)")],
      inventory: [row({ ingredient_id: 2, quantity: 500, unit: "ml" })],
    });
    expect(result).toEqual({ deltas: [], unresolved: [] });
  });

  it("olive oil with an empty pantry asks for 2.25 ml, not '0.03 tbsp (15 ml)'", () => {
    expect(delta({ requirements: [req(2, 0.15, "1 tbsp (15 ml)")] }).deltas).toEqual([
      { ingredient_id: 2, missing_qty: 2.25, unit: "ml" },
    ]);
  });

  it("eggs: 3 large eggs against 1 counted egg asks for 2 pcs", () => {
    const result = delta({
      requirements: [req(3, 3, "1 large (50 g)")],
      inventory: [row({ ingredient_id: 3, quantity: 1, unit: "pieces" })],
    });
    expect(result.deltas).toEqual([{ ingredient_id: 3, missing_qty: 2, unit: "pcs" }]);
  });

  it("eggs: stock kept in grams still meets a need shown in items", () => {
    const result = delta({
      requirements: [req(3, 3, "1 large (50 g)")],
      inventory: [row({ ingredient_id: 3, quantity: 60, unit: "g" })],
    });
    // 150 g needed, 60 g held: 90 g short is 1.8 eggs, bought as 2.
    expect(result.deltas).toEqual([{ ingredient_id: 3, missing_qty: 2, unit: "pcs" }]);
  });

  it("half an egg short is still one egg to buy", () => {
    expect(delta({ requirements: [req(3, 0.5, "1 large (50 g)")] }).deltas).toEqual([
      { ingredient_id: 3, missing_qty: 1, unit: "pcs" },
    ]);
  });

  it("an egg-sized need against a volume of stock stays unresolved", () => {
    const result = delta({
      requirements: [req(3, 1, "1 large (50 g)")],
      inventory: [row({ ingredient_id: 3, quantity: 200, unit: "ml" })],
    });
    expect(result.unresolved).toEqual([{ ingredient_id: 3, reason: "incompatible_unit" }]);
  });
});

describe("wholeItems", () => {
  it.each([
    [1.8, 2],
    [2, 2],
    [2.0000000001, 2],
    [0.01, 1],
  ])("wholeItems(%p) is %p", (value, expected) => {
    expect(wholeItems(value)).toBe(expected);
  });
});
