import fs from "node:fs";
import path from "node:path";

const source = (relativePath: string): string =>
  fs.readFileSync(path.join(process.cwd(), relativePath), "utf8");

const between = (text: string, startMarker: string, endMarker: string): string => {
  const start = text.indexOf(startMarker);
  const end = text.indexOf(endMarker, start + startMarker.length);
  expect(start).toBeGreaterThanOrEqual(0);
  expect(end).toBeGreaterThan(start);
  return text.slice(start, end);
};

describe("P1a non-destructive adversarial security contracts", () => {
  test("attack_share_creation_requires_an_authenticated_user", () => {
    const post = between(
      source("src/app/api/shopping-lists/share/route.ts"),
      "export async function POST",
      "export async function GET"
    );
    expect(post).toMatch(/auth\.getUser|getUserIdentity/);
    expect(post).toContain("status: 401");
  });

  test("attack_share_creation_verifies_list_ownership", () => {
    const post = between(
      source("src/app/api/shopping-lists/share/route.ts"),
      "export async function POST",
      "export async function GET"
    );
    expect(post).toContain('.eq("user_id", user.id)');
  });

  test("attack_share_creation_rejects_unbounded_expiry_days", () => {
    const post = between(
      source("src/app/api/shopping-lists/share/route.ts"),
      "export async function POST",
      "export async function GET"
    );
    expect(post).toMatch(/expiryDays\s*[<>]=?/);
    expect(post).toContain("status: 400");
  });

  test("attack_transfer_verifies_each_shopping_item_belongs_to_the_user", () => {
    const post = between(
      source("src/app/api/inventory/transfer/route.ts"),
      "export async function POST",
      "export async function DELETE"
    );
    const shoppingUpdate = between(post, "// Mark shopping item as checked", "transferredItems.push");
    expect(shoppingUpdate).toContain('.eq("user_id", user.id)');
  });

  test("attack_transfer_undo_verifies_each_shopping_item_belongs_to_the_user", () => {
    const undo = source("src/app/api/inventory/transfer/route.ts").split(
      "export async function DELETE"
    )[1];
    const shoppingUpdate = between(undo, "// Uncheck shopping item", "// Delete or reduce inventory");
    expect(shoppingUpdate).toContain('.eq("user_id", user.id)');
  });

  test("attack_transfer_rejects_zero_and_negative_quantities", () => {
    const route = source("src/app/api/inventory/transfer/route.ts");
    expect(route).toMatch(/item\.quantity\s*<=\s*0/);
    expect(route).toContain("status: 400");
  });

  test("attack_transfer_rejects_unknown_storage_locations", () => {
    const route = source("src/app/api/inventory/transfer/route.ts");
    expect(route).toMatch(/validLocations|\["pantry",\s*"fridge",\s*"freezer",\s*"other"\]/);
  });

  test("attack_shopping_item_update_rejects_negative_quantity", () => {
    const put = between(
      source("src/app/api/shopping-lists/[id]/items/[itemId]/route.ts"),
      "export async function PUT",
      "export async function DELETE"
    );
    expect(put).toMatch(/quantity\s*<\s*0|quantity\s*<=\s*0/);
  });

  test("attack_shopping_item_update_does_not_coerce_false_string_to_true", () => {
    const put = between(
      source("src/app/api/shopping-lists/[id]/items/[itemId]/route.ts"),
      "export async function PUT",
      "export async function DELETE"
    );
    expect(put).not.toContain("Boolean(is_checked)");
    expect(put).toMatch(/typeof is_checked.*boolean/);
  });

  test("attack_achievement_check_rejects_unknown_trigger_values", () => {
    const route = source("src/app/api/achievements/check/route.ts");
    expect(route).toMatch(/\[.*meal_logged.*nutrient_viewed.*manual.*\]/s);
    expect(route).toMatch(/includes\(body\.trigger\)/);
  });

  test("attack_inventory_endpoint_rejects_an_unauthenticated_request", () => {
    const route = source("src/app/api/inventory/route.ts");
    expect(route).toContain('NextResponse.json({ error: "Unauthorized" }, { status: 401 })');
  });

  test("attack_shared_list_lookup_requires_a_nonempty_token", () => {
    const get = source("src/app/api/shopping-lists/share/route.ts").split(
      "export async function GET"
    )[1];
    expect(get).toContain("Share token required");
    expect(get).toContain("status: 400");
  });
});
