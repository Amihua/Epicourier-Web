/**
 * @jest-environment node
 */

import { areCompatible, convert, parseUnit, toDisplayQuantity } from "@/lib/receipt-shopping/units";

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
