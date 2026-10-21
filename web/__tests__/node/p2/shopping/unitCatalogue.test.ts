/**
 * @jest-environment node
 *
 * Issue #33: most `Ingredient.unit` values in the shipped dataset did not parse to
 * a measurable unit, so receipt lines and shopping deltas were unresolved for most
 * recipes. This reads every unit in backend/dataset and holds the share that
 * parses to mass, volume or a count above a threshold, so a regression fails CI.
 */

import fs from "fs";
import path from "path";

import { parseUnit } from "@/lib/receipt-shopping/units";

const CSV = path.resolve(__dirname, "../../../../../backend/dataset/ingredients-supabase.csv");

/** Minimal CSV reader: enough for this file, whose quoted fields may hold commas. */
function readUnits(file: string): string[] {
  const lines = fs.readFileSync(file, "utf8").split(/\r?\n/).filter(Boolean);
  const header = lines[0].split(",");
  const unitIndex = header.indexOf("unit");
  return lines.slice(1).map((line) => {
    const fields: string[] = [];
    let field = "";
    let quoted = false;
    for (const ch of line) {
      if (ch === '"') quoted = !quoted;
      else if (ch === "," && !quoted) {
        fields.push(field);
        field = "";
      } else field += ch;
    }
    fields.push(field);
    return fields[unitIndex];
  });
}

const MEASURABLE = new Set(["mass", "volume", "count"]);

describe("dataset unit coverage (#33)", () => {
  const units = readUnits(CSV);
  const unresolved = units.filter((u) => {
    const parsed = parseUnit(u);
    return parsed === null || !MEASURABLE.has(parsed.dimension);
  });

  it("reads the whole ingredient catalogue", () => {
    expect(units).toHaveLength(448);
  });

  it("parses at least 95% of ingredient units to mass, volume or a count", () => {
    const share = (units.length - unresolved.length) / units.length;
    // On failure, show what is left so the next rule is easy to pick.
    if (share < 0.95) console.log([...new Set(unresolved)].sort().join("\n"));
    expect(share).toBeGreaterThanOrEqual(0.95);
  });
});
