import {
  formatExpirationDate,
  getExpirationStatus,
  getExpiringItems,
  sortByExpiration,
} from "@/utils/inventory/expiration";
import {
  getLowStockItems,
  getLowStockSummary,
  getStockStatus,
  isLowStock,
} from "@/utils/inventory/lowStock";
import {
  calculateCoverageScore,
  calculateRecipeMatch,
  getMatchLabel,
} from "@/utils/inventory/recipeMatch";

const isoDateFromToday = (days: number): string => {
  const date = new Date();
  date.setHours(12, 0, 0, 0);
  date.setDate(date.getDate() + days);
  return date.toISOString().split("T")[0];
};

describe("P1a inventory behavior derived from UC3, UC13, and UC17", () => {
  test("test_marks_past_inventory_as_expired", () => {
    expect(getExpirationStatus(isoDateFromToday(-1))).toBe("expired");
  });

  test("test_marks_inventory_expiring_within_two_days_as_critical", () => {
    expect(getExpirationStatus(isoDateFromToday(2))).toBe("critical");
  });

  test("test_marks_inventory_expiring_within_seven_days_as_warning", () => {
    expect(getExpirationStatus(isoDateFromToday(7))).toBe("warning");
  });

  test("test_treats_missing_expiration_date_as_unknown", () => {
    expect(getExpirationStatus(null)).toBe("unknown");
    expect(formatExpirationDate(null)).toBe("No expiration date");
  });

  test("test_excludes_already_expired_items_from_expiring_soon_list", () => {
    const items = [
      { id: "expired", expiration_date: isoDateFromToday(-1) },
      { id: "soon", expiration_date: isoDateFromToday(3) },
    ];
    expect(getExpiringItems(items, 7).map((item) => item.id)).toEqual(["soon"]);
  });

  test("test_sorts_items_without_expiration_dates_last", () => {
    const items = [
      { id: "none", expiration_date: null },
      { id: "later", expiration_date: isoDateFromToday(5) },
      { id: "first", expiration_date: isoDateFromToday(1) },
    ];
    expect(sortByExpiration(items).map((item) => item.id)).toEqual(["first", "later", "none"]);
  });

  test("test_flags_quantity_equal_to_minimum_as_low_stock", () => {
    expect(isLowStock(2, 2)).toBe(true);
    expect(getStockStatus(2, 2)).toBe("low");
  });

  test("test_does_not_flag_stock_without_a_minimum", () => {
    expect(isLowStock(0, null)).toBe(false);
    expect(getStockStatus(0, null)).toBe("unknown");
  });

  test("test_counts_critical_and_low_items_in_low_stock_total", () => {
    const summary = getLowStockSummary([
      { quantity: 0, min_quantity: 2 },
      { quantity: 2, min_quantity: 2 },
      { quantity: 5, min_quantity: 2 },
      { quantity: 1, min_quantity: null },
    ]);
    expect(summary).toEqual({
      criticalCount: 1,
      lowCount: 1,
      adequateCount: 1,
      unknownCount: 1,
      totalLow: 2,
    });
    expect(getLowStockItems([
      { quantity: 0, min_quantity: 2 },
      { quantity: 5, min_quantity: 2 },
    ])).toHaveLength(1);
  });

  test("test_reports_recipe_ingredient_matches_and_missing_items", () => {
    const result = calculateRecipeMatch(
      [
        { ingredient_id: 1, ingredient: { id: 1, name: "Egg" } as never },
        { ingredient_id: 2, ingredient: { id: 2, name: "Milk" } as never },
      ],
      [{ ingredient_id: 1 }]
    );
    expect(result.matchPercentage).toBe(50);
    expect(result.availableIngredients).toEqual(["Egg"]);
    expect(result.missingIngredients).toEqual(["Milk"]);
    expect(result.isPartialMatch).toBe(true);
  });

  test("test_treats_a_recipe_without_ingredients_as_fully_matched", () => {
    const result = calculateRecipeMatch([], []);
    expect(result.matchPercentage).toBe(100);
    expect(result.isFullMatch).toBe(true);
  });

  test("test_calculates_inventory_coverage_without_counting_unrelated_items", () => {
    expect(
      calculateCoverageScore(
        [{ ingredient_id: 1 }, { ingredient_id: 2 }, { ingredient_id: 3 }],
        [{ ingredient_id: 1 }, { ingredient_id: 99 }]
      )
    ).toBeCloseTo(1 / 3);
    expect(getMatchLabel(0)).toBe("No ingredients available");
  });
});
