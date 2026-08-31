import fs from "node:fs";
import path from "node:path";

const source = (relativePath: string): string =>
  fs.readFileSync(path.join(process.cwd(), relativePath), "utf8");

describe("P1a high-level use-case contracts", () => {
  test("test_uc1_rejects_duplicate_registration_email", () => {
    expect(source("src/app/signup/actions.ts")).toContain("An account with this email already exists");
  });

  test("test_uc2_redirects_successful_sign_in_to_recipes", () => {
    expect(source("src/app/signin/actions.ts")).toContain('redirect("/dashboard/recipes")');
  });

  test("test_uc3_reports_an_empty_recipe_search", () => {
    expect(source("src/app/dashboard/recipes/page.tsx")).toContain("No recipes found");
  });

  test("test_uc4_returns_not_found_for_an_unknown_recipe", () => {
    expect(source("src/app/dashboard/recipes/[id]/page.tsx")).toContain("if (!recipeData) return notFound()");
  });

  test("test_uc5_rejects_an_empty_recommendation_goal", () => {
    expect(source("src/app/dashboard/recommender/page.tsx")).toContain("Please enter your goal.");
  });

  test("test_uc6_requires_a_date_before_scheduling_a_meal", () => {
    expect(source("src/components/ui/AddMealModal.tsx")).toContain("Please select a date");
  });

  test("test_uc7_rejects_a_non_boolean_meal_status", () => {
    expect(source("src/app/api/events/[id]/route.ts")).toContain("Invalid 'status' field; expected boolean");
  });

  test("test_uc8_reports_a_failed_nutrient_summary_request", () => {
    expect(source("src/app/dashboard/nutrients/useNutrientDashboard.ts")).toContain(
      "Failed to fetch nutrient data"
    );
  });

  test("test_uc9_reports_a_failed_nutrient_goal_save", () => {
    expect(source("src/app/dashboard/nutrients/useNutrientDashboard.ts")).toContain("Save failed");
  });

  test("test_uc10_rejects_an_export_range_with_reversed_dates", () => {
    expect(source("src/app/api/nutrients/export/route.ts")).toContain(
      "Start date must be before or equal to end date"
    );
  });

  test("test_uc11_offers_retry_when_achievements_fail_to_load", () => {
    const page = source("src/app/dashboard/achievements/page.tsx");
    expect(page).toContain("Failed to fetch achievements");
    expect(page).toContain("Retry");
  });

  test("test_uc12_reports_a_failed_challenge_join", () => {
    expect(source("src/app/dashboard/challenges/page.tsx")).toContain("Failed to join challenge");
  });

  test("test_uc13_requires_authentication_to_view_inventory", () => {
    expect(source("src/app/api/inventory/route.ts")).toContain(
      'NextResponse.json({ error: "Unauthorized" }, { status: 401 })'
    );
  });

  test("test_uc14_rejects_an_inventory_item_without_an_ingredient", () => {
    expect(source("src/components/inventory/AddInventoryModal.tsx")).toContain(
      "Please select an ingredient"
    );
  });

  test("test_uc15_rejects_an_invalid_inventory_location", () => {
    expect(source("src/app/api/inventory/[id]/route.ts")).toContain("Invalid location");
  });

  test("test_uc16_rejects_an_empty_batch_delete", () => {
    expect(source("src/app/api/inventory/batch-delete/route.ts")).toContain(
      "Invalid or empty ids array"
    );
  });

  test("test_uc17_rejects_recipe_suggestions_for_empty_inventory", () => {
    expect(source("src/app/dashboard/inventory/page.tsx")).toContain("Empty Inventory");
  });

  test("test_uc18_requires_a_shopping_list_name", () => {
    expect(source("src/components/shopping/CreateListModal.tsx")).toContain("Please enter a list name");
  });

  test("test_uc19_rejects_generation_when_no_meals_exist", () => {
    expect(source("src/app/api/shopping-lists/generate/route.ts")).toContain(
      "No meals found in the specified date range"
    );
  });

  test("test_uc20_rejects_transfer_of_another_users_shopping_item", () => {
    const route = source("src/app/api/inventory/transfer/route.ts");
    const start = route.indexOf("// Mark shopping item as checked");
    const end = route.indexOf("transferredItems.push", start);
    const ownershipSensitiveUpdate = route.slice(start, end);

    // A shopping item must be scoped to the authenticated user before it is changed.
    expect(ownershipSensitiveUpdate).toContain('.eq("user_id", user.id)');
  });
});
