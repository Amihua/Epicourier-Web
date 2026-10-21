/**
 * @jest-environment node
 */

import {
  areCompatible,
  convert,
  leadingAmount,
  parseUnit,
  toDisplayQuantity,
} from "@/lib/receipt-shopping/units";

describe("parseUnit", () => {
  it.each([
    ["g", "mass", 1, "g"],
    ["Grams", "mass", 1, "g"],
    ["kg", "mass", 1000, "kg"],
    ["mg", "mass", 0.001, "mg"],
    ["ml", "volume", 1, "ml"],
    ["L", "volume", 1000, "L"],
    ["pieces", "count", 1, "pcs"],
  ])("reads %s as %s", (raw, dimension, toBase, display) => {
    expect(parseUnit(raw)).toEqual({ dimension, toBase, display });
  });

  it("folds a numeric prefix into the multiplier, as Ingredient.unit stores base units", () => {
    expect(parseUnit("100g")).toEqual({ dimension: "mass", toBase: 100, display: "g" });
    expect(parseUnit("100 ml")).toEqual({ dimension: "volume", toBase: 100, display: "ml" });
  });

  it("reads a decimal prefix", () => {
    expect(parseUnit("0.5 kg")).toEqual({ dimension: "mass", toBase: 500, display: "kg" });
  });

  it("treats a bare number as a count of pieces", () => {
    expect(parseUnit("12")).toEqual({ dimension: "count", toBase: 12, display: "pcs" });
  });

  it.each([null, undefined, "", "   ", "0g", "0 ml"])("returns null for %p", (raw) => {
    expect(parseUnit(raw as string | null | undefined)).toBeNull();
  });

  it("is case and whitespace insensitive, and ignores a trailing period", () => {
    expect(parseUnit("  TBSP. ")).toEqual(parseUnit("tbsp"));
  });

  it("gives an unknown unit its own dimension, singular and plural alike", () => {
    expect(parseUnit("cloves")?.dimension).toBe("other:clove");
    expect(parseUnit("clove")?.dimension).toBe("other:clove");
  });

  it("does not strip the s from words ending in ss", () => {
    expect(parseUnit("glass")?.dimension).toBe("other:glass");
  });
});

describe("areCompatible", () => {
  it("accepts units in the same dimension", () => {
    expect(areCompatible("g", "kg")).toBe(true);
    expect(areCompatible("100g", "g")).toBe(true);
    expect(areCompatible("cup", "ml")).toBe(true);
  });

  it("rejects mass against volume, since density is unknown", () => {
    expect(areCompatible("g", "ml")).toBe(false);
  });

  it("rejects a count against a mass", () => {
    expect(areCompatible("pieces", "g")).toBe(false);
  });

  it("rejects a missing unit on either side", () => {
    expect(areCompatible(null, "g")).toBe(false);
    expect(areCompatible("g", "")).toBe(false);
  });

  it("rejects two different unknown units", () => {
    expect(areCompatible("clove", "head")).toBe(false);
  });
});

describe("convert", () => {
  it("converts kilograms to grams", () => {
    expect(convert(1.5, "kg", "g")).toBe(1500);
  });

  it("converts a prefixed base unit into its plain unit", () => {
    expect(convert(2.5, "100g", "g")).toBe(250);
  });

  it("converts litres to millilitres", () => {
    expect(convert(2, "L", "ml")).toBe(2000);
  });

  it("is the identity for the same unit", () => {
    expect(convert(7, "pcs", "pieces")).toBe(7);
  });

  it("returns null instead of guessing across dimensions", () => {
    expect(convert(1, "cup", "g")).toBeNull();
  });

  it("returns null for a missing source unit (decision D2)", () => {
    expect(convert(2, null, "L")).toBeNull();
  });
});

describe("toDisplayQuantity", () => {
  it("re-expresses 2.5 x '100g' as 250 g", () => {
    expect(toDisplayQuantity(2.5, "100g")).toEqual({ quantity: 250, unit: "g" });
  });

  it("leaves an unprefixed unit alone", () => {
    expect(toDisplayQuantity(3, "kg")).toEqual({ quantity: 3, unit: "kg" });
  });

  it("handles an unknown unit with a prefix", () => {
    expect(toDisplayQuantity(0.5, "2 cloves")).toEqual({ quantity: 1, unit: "cloves" });
  });

  it("returns null for an empty unit", () => {
    expect(toDisplayQuantity(1, "")).toBeNull();
  });
});

describe("fractions and approximate amounts (#33)", () => {
  it.each([
    ["1/2 cup", 0.5],
    ["1 1/2 cup", 1.5],
    ["½ cup", 0.5],
    ["1½ cups", 1.5],
    ["¼ cup", 0.25],
    ["3/4 cup", 0.75],
  ])("%s is %p cups", (raw, cups) => {
    const parsed = parseUnit(raw)!;
    expect(parsed.dimension).toBe("volume");
    expect(parsed.toBase).toBeCloseTo(236.5882365 * cups, 6);
    expect(parsed.display).toBe("cup");
  });

  it("reads '1/4 tsp' as a quarter teaspoon", () => {
    expect(parseUnit("1/4 tsp")!.toBase).toBeCloseTo(4.92892159375 / 4, 9);
  });

  it("takes an approximate amount at face value", () => {
    expect(parseUnit("~5 g")).toEqual({ dimension: "mass", toBase: 5, display: "g" });
  });

  it("still rejects a zero fraction", () => {
    expect(parseUnit("0/2 cup")).toBeNull();
  });
});

describe("leadingAmount", () => {
  it.each([
    ["100 g", 100, "g"],
    ["1/2 cup", 0.5, "cup"],
    ["2 ½ tbsp", 2.5, "tbsp"],
    ["~3 cloves", 3, "cloves"],
  ])("%s", (text, amount, rest) => {
    expect(leadingAmount(text)).toEqual({ amount, rest });
  });

  it("returns null without an amount", () => {
    expect(leadingAmount("pinch")).toBeNull();
  });
});

describe("descriptive words after a known unit (#33)", () => {
  it.each([
    ["100 g peeled", "mass", 100, "g"],
    ["5 g cooked", "mass", 5, "g"],
    ["40 g florets", "mass", 40, "g"],
    ["1 cup chopped", "volume", 236.5882365, "cup"],
    ["2 pieces diced", "count", 2, "pcs"],
  ])("%s", (raw, dimension, toBase, display) => {
    expect(parseUnit(raw)).toEqual({ dimension, toBase, display });
  });

  it("does not guess when the first word is not a unit", () => {
    expect(parseUnit("1 large egg")?.dimension).toBe("other:large egg");
  });

  it("does not treat a two-word unit like 'fl oz' as ounces of mass", () => {
    expect(parseUnit("2 fl oz")?.dimension).not.toBe("mass");
  });
});

describe("bracketed metric amounts (#33)", () => {
  it.each([
    ["1 tbsp (15 ml)", "volume", 15, "ml"],
    ["each (20g)", "mass", 20, "g"],
    ["1 large (50 g)", "mass", 50, "g"],
    ["1 sprig (2g)", "mass", 2, "g"],
    ["1 link (75 g)", "mass", 75, "g"],
    ["1/2 cup (120 g)", "mass", 120, "g"],
    ["1 medium (~150 g)", "mass", 150, "g"],
    ["1 lemon (juice, 30 g)", "mass", 30, "g"],
    ["1 cup (200 g cooked)", "mass", 200, "g"],
  ])("%s is %s, %p %s", (raw, dimension, toBase, display) => {
    expect(parseUnit(raw)).toMatchObject({ dimension, toBase, display });
  });

  it("uses the part outside the brackets when they hold no measure", () => {
    expect(parseUnit("1 cup (cooked)")).toEqual(parseUnit("1 cup"));
  });

  it("does not take a count inside the brackets as the measure", () => {
    expect(parseUnit("1 tin (2 cans)")?.dimension).toBe("other:tin");
  });

  it("lets the olive-oil example from the issue meet a pantry in ml", () => {
    // 15% of "1 tbsp (15 ml)" against 500 ml of stock: convertible, no unresolved line.
    expect(convert(0.15, "1 tbsp (15 ml)", "ml")).toBeCloseTo(2.25, 9);
    expect(areCompatible("1 tbsp (15 ml)", "500 ml")).toBe(true);
    expect(areCompatible("1 tbsp (15 ml)", "L")).toBe(true);
  });

  it("displays a bracketed unit in its metric unit", () => {
    expect(toDisplayQuantity(0.15, "1 tbsp (15 ml)")).toEqual({ quantity: 2.25, unit: "ml" });
  });
});

describe("counted items against a unit stated by weight (#33)", () => {
  it.each([
    ["1 large (50 g)", 50],
    ["each (20g)", 20],
    ["2 cloves (6 g)", 3],
    ["1 breast (200 g)", 200],
  ])("%s weighs %p g per item", (raw, grams) => {
    expect(parseUnit(raw)?.perItem).toBe(grams);
  });

  it("does not give a household measure a per-item weight", () => {
    expect(parseUnit("1 tbsp (15 ml)")?.perItem).toBeUndefined();
    expect(parseUnit("1/2 cup (120 g)")?.perItem).toBeUndefined();
  });

  it("converts 6 pieces to 300 g of large eggs, and back", () => {
    expect(convert(6, "pieces", "1 large (50 g)")).toBe(6);
    expect(convert(6, "1 large (50 g)", "g")).toBe(300);
    expect(convert(2, "1 large (50 g)", "pieces")).toBe(2);
  });

  it("converts cloves of garlic counted singly", () => {
    expect(convert(4, "pcs", "2 cloves (6 g)")).toBe(2);
  });

  it("treats a counted unit as compatible with a count but not with a volume", () => {
    expect(areCompatible("pieces", "1 large (50 g)")).toBe(true);
    expect(areCompatible("ml", "1 large (50 g)")).toBe(false);
  });

  it("still refuses a count against a plain weight", () => {
    expect(convert(6, "pieces", "g")).toBeNull();
  });

  it("displays a counted unit as items", () => {
    expect(toDisplayQuantity(2, "1 large (50 g)")).toEqual({ quantity: 2, unit: "pcs" });
    expect(toDisplayQuantity(1, "2 cloves (6 g)")).toEqual({ quantity: 2, unit: "pcs" });
  });
});
