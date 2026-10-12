/**
 * @jest-environment node
 */

import { POST as CONFIRM } from "@/app/api/receipt-shopping/confirm/route";
import { POST as PREVIEW } from "@/app/api/receipt-shopping/preview/route";
import { asOfDate } from "@/lib/receipt-shopping/asOfDate";
import { createClient } from "@/utils/supabase/server";

import {
  makeFakeSupabase,
  type FakeOptions,
  type FakeSupabase,
} from "../../../p2-support/fakeSupabase";

jest.mock("@/utils/supabase/server", () => ({ createClient: jest.fn() }));
jest.mock("@/lib/receipt-shopping/asOfDate", () => ({ asOfDate: jest.fn(() => "2026-10-10") }));

const USER = { id: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa" };
const OTHER = "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb";
const LIST = "11111111-1111-4111-8111-111111111111";
const OTHER_LIST = "22222222-2222-4222-8222-222222222222";
const REQUEST_ID = "c1000000-0000-4000-8000-000000000001";

/**
 * Recipe 101 needs 500 g of chicken (500% of a "100g" base unit) and 1 cup of rice.
 * The user has 200 g of chicken in the fridge and nothing else.
 */
function baseTables() {
  return {
    shopping_lists: [
      { id: LIST, user_id: USER.id, is_archived: false },
      { id: OTHER_LIST, user_id: OTHER, is_archived: false },
    ],
    Recipe: [{ id: 101 }],
    "Recipe-Ingredient_Map": [
      { recipe_id: 101, ingredient_id: 11, relative_unit_100: 500, Ingredient: { unit: "100g" } },
      { recipe_id: 101, ingredient_id: 12, relative_unit_100: 100, Ingredient: { unit: "1 cup" } },
    ],
    user_inventory: [
      {
        id: "inv-1",
        user_id: USER.id,
        ingredient_id: 11,
        quantity: "200.00",
        unit: "g",
        location: "fridge",
        expiration_date: "2026-10-12",
      },
      // Another user's chicken must never count toward this user's stock.
      {
        id: "inv-2",
        user_id: OTHER,
        ingredient_id: 11,
        quantity: "5000.00",
        unit: "g",
        location: "pantry",
        expiration_date: null,
      },
    ],
    shopping_list_items: [],
  };
}

let fake: FakeSupabase;

function withFake(options: FakeOptions = {}) {
  fake = makeFakeSupabase({ user: USER, tables: baseTables(), ...options });
  (createClient as jest.Mock).mockResolvedValue(fake);
  return fake;
}

function post(url: string, body: unknown) {
  return new Request(`http://localhost${url}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
}

const preview = (body: unknown) => PREVIEW(post("/api/receipt-shopping/preview", body));
const confirm = (body: unknown) => CONFIRM(post("/api/receipt-shopping/confirm", body));

beforeEach(() => {
  jest.clearAllMocks();
  (asOfDate as jest.Mock).mockReturnValue("2026-10-10");
  jest.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
  (console.error as jest.Mock).mockRestore();
});

// ---------------------------------------------------------------------------
describe("POST /api/receipt-shopping/preview", () => {
  it("returns 401 without a session", async () => {
    withFake({ user: null });
    const res = await preview({ recipe_id: 101, list_id: LIST });
    expect(res.status).toBe(401);
  });

  it("returns 400 for a body that is not JSON", async () => {
    withFake();
    const res = await preview("{not json");
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ error: "Request body must be JSON" });
  });

  it.each([
    [{ list_id: LIST }, "recipe_id"],
    [{ recipe_id: 101 }, "list_id"],
    [{ recipe_id: "101", list_id: LIST }, "recipe_id"],
    [{ recipe_id: 101, list_id: "not-a-uuid" }, "list_id"],
    [{ recipe_id: 101, list_id: LIST, servings: 0 }, "servings"],
    [{ recipe_id: 101, list_id: LIST, servings: 1.5 }, "servings"],
  ])("returns 400 for %p, naming %s", async (body, field) => {
    withFake();
    const res = await preview(body);
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.details.map((d: { path: string }) => d.path)).toContain(field);
  });

  it("rejects client-supplied deltas instead of trusting them", async () => {
    withFake();
    const res = await preview({
      recipe_id: 101,
      list_id: LIST,
      deltas: [{ ingredient_id: 11, missing_qty: 1, unit: "g" }],
    });
    expect(res.status).toBe(400);
  });

  it("returns 404 for a list owned by someone else, and saves nothing", async () => {
    withFake();
    const res = await preview({ recipe_id: 101, list_id: OTHER_LIST });
    expect(res.status).toBe(404);
    expect(fake.tables.shopping_delta_previews).toBeUndefined();
  });

  it("returns 404 for an unknown recipe", async () => {
    withFake();
    const res = await preview({ recipe_id: 999, list_id: LIST });
    expect(res.status).toBe(404);
    expect(await res.json()).toEqual({ error: "Recipe not found" });
  });

  it("computes the delta from the server's own read: 500 g needed, 200 g held, 300 g missing", async () => {
    withFake();
    const res = await preview({ recipe_id: 101, list_id: LIST });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(Object.keys(body).sort()).toEqual(["deltas", "preview_id", "snapshot_id", "unresolved"]);
    expect(body.deltas).toEqual([
      { ingredient_id: 11, missing_qty: 300, unit: "g" },
      { ingredient_id: 12, missing_qty: 1, unit: "cup" },
    ]);
    expect(body.unresolved).toEqual([]);
    expect(body.snapshot_id).toMatch(/^snap_[0-9a-f]{64}$/);
  });

  it("does not count another user's inventory", async () => {
    withFake();
    await preview({ recipe_id: 101, list_id: LIST });
    const inventoryQuery = fake.log.find((q) => q.table === "user_inventory")!;
    expect(inventoryQuery.filters).toContainEqual(["eq", "user_id", USER.id]);
  });

  it("stores the preview for the caller, with the date it was computed for", async () => {
    withFake();
    const body = await (await preview({ recipe_id: 101, list_id: LIST, servings: 2 })).json();
    const [stored] = fake.tables.shopping_delta_previews;
    expect(stored).toMatchObject({
      id: body.preview_id,
      user_id: USER.id,
      shopping_list_id: LIST,
      recipe_id: 101,
      servings: 2,
      as_of_date: "2026-10-10",
      snapshot_id: body.snapshot_id,
      deltas: body.deltas,
    });
  });

  it("writes nothing to the shopping list (preview only)", async () => {
    withFake();
    await preview({ recipe_id: 101, list_id: LIST });
    expect(fake.tables.shopping_list_items).toEqual([]);
    expect(fake.log.filter((q) => q.op === "insert").map((q) => q.table)).toEqual([
      "shopping_delta_previews",
    ]);
  });

  it("scales by servings", async () => {
    withFake();
    const body = await (await preview({ recipe_id: 101, list_id: LIST, servings: 2 })).json();
    expect(body.deltas[0]).toEqual({ ingredient_id: 11, missing_qty: 800, unit: "g" });
  });

  it("excludes stock that expired before today", async () => {
    withFake();
    (asOfDate as jest.Mock).mockReturnValue("2026-10-13");
    const body = await (await preview({ recipe_id: 101, list_id: LIST })).json();
    expect(body.deltas[0]).toEqual({ ingredient_id: 11, missing_qty: 500, unit: "g" });
  });

  it("reports a null stock unit as unresolved rather than subtracting it", async () => {
    const tables = baseTables();
    tables.user_inventory[0].unit = null as unknown as string;
    withFake({ tables });
    const body = await (await preview({ recipe_id: 101, list_id: LIST })).json();
    expect(body.unresolved).toEqual([{ ingredient_id: 11, reason: "missing_unit" }]);
    expect(body.deltas.map((d: { ingredient_id: number }) => d.ingredient_id)).toEqual([12]);
  });

  it("returns 422 when stored stock cannot be interpreted", async () => {
    const tables = baseTables();
    tables.user_inventory[0].quantity = "-3";
    withFake({ tables });
    const res = await preview({ recipe_id: 101, list_id: LIST });
    expect(res.status).toBe(422);
  });

  it("returns 500 and saves nothing when the inventory read fails", async () => {
    withFake({ failTables: { user_inventory: "connection reset" } });
    const res = await preview({ recipe_id: 101, list_id: LIST });
    expect(res.status).toBe(500);
    expect(await res.json()).toEqual({ error: "Failed to read the inventory" });
    expect(fake.tables.shopping_delta_previews).toBeUndefined();
  });

  it("returns 500 when the preview cannot be saved", async () => {
    withFake({ failTables: { shopping_delta_previews: "insert failed" } });
    const res = await preview({ recipe_id: 101, list_id: LIST });
    expect(res.status).toBe(500);
  });
});

// ---------------------------------------------------------------------------
describe("POST /api/receipt-shopping/confirm", () => {
  const applied = (written: unknown[] = [{ item_id: "x" }], replayed = false) => ({
    data: { status: "applied", written, skipped: [], replayed },
    error: null,
  });

  async function previewThenConfirm(options: FakeOptions = {}, mutate?: (f: FakeSupabase) => void) {
    withFake(options);
    const previewBody = await (await preview({ recipe_id: 101, list_id: LIST })).json();
    mutate?.(fake);
    const res = await confirm({ preview_id: previewBody.preview_id, request_id: REQUEST_ID });
    return { res, previewBody };
  }

  it("returns 401 without a session", async () => {
    withFake({ user: null });
    const res = await confirm({ preview_id: REQUEST_ID, request_id: REQUEST_ID });
    expect(res.status).toBe(401);
  });

  it.each([
    [{ preview_id: "nope", request_id: REQUEST_ID }],
    [{ preview_id: REQUEST_ID }],
    [{ preview_id: REQUEST_ID, request_id: REQUEST_ID, deltas: [] }],
  ])("returns 400 for %p", async (body) => {
    withFake();
    expect((await confirm(body)).status).toBe(400);
  });

  it("returns 404 for a preview that is not the caller's, without calling the database function", async () => {
    withFake();
    fake.tables.shopping_delta_previews = [
      {
        id: "a1000000-0000-4000-8000-000000000009",
        user_id: OTHER,
        recipe_id: 101,
        servings: 1,
        applied_at: null,
      },
    ];
    const res = await confirm({
      preview_id: "a1000000-0000-4000-8000-000000000009",
      request_id: REQUEST_ID,
    });
    expect(res.status).toBe(404);
    expect(fake.rpc).not.toHaveBeenCalled();
  });

  it("applies an unchanged preview through the atomic database function", async () => {
    const { res, previewBody } = await previewThenConfirm({ rpc: () => applied() });
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({
      status: "applied",
      written: [{ item_id: "x" }],
      skipped: [],
    });
    expect(fake.rpc).toHaveBeenCalledWith("apply_receipt_shopping_delta", {
      p_preview_id: previewBody.preview_id,
      p_request_id: REQUEST_ID,
    });
    expect(res.headers.get("Idempotent-Replayed")).toBeNull();
  });

  it("is stale, and writes nothing, when the stock changed after the preview", async () => {
    const { res } = await previewThenConfirm({ rpc: () => applied() }, (f) => {
      f.tables.user_inventory[0].quantity = "450.00";
    });
    expect(res.status).toBe(409);
    expect(await res.json()).toEqual({ status: "stale", written: [], skipped: [] });
    expect(res.headers.get("X-Receipt-Reason")).toBe("inventory_changed");
    expect(fake.rpc).not.toHaveBeenCalled();
  });

  it("is stale when a relevant row is added after the preview", async () => {
    const { res } = await previewThenConfirm({ rpc: () => applied() }, (f) => {
      f.tables.user_inventory.push({
        id: "inv-3",
        user_id: USER.id,
        ingredient_id: 12,
        quantity: "1",
        unit: "cup",
        location: "pantry",
        expiration_date: null,
      });
    });
    expect(res.status).toBe(409);
  });

  it("is stale when stock expired overnight, even though no row changed", async () => {
    const { res } = await previewThenConfirm({ rpc: () => applied() }, () => {
      (asOfDate as jest.Mock).mockReturnValue("2026-10-13");
    });
    expect(res.status).toBe(409);
    expect(fake.rpc).not.toHaveBeenCalled();
  });

  it("is not stale when an unrelated ingredient changes", async () => {
    const { res } = await previewThenConfirm({ rpc: () => applied() }, (f) => {
      f.tables.user_inventory.push({
        id: "inv-4",
        user_id: USER.id,
        ingredient_id: 99,
        quantity: "2",
        unit: "L",
        location: "fridge",
        expiration_date: null,
      });
    });
    expect(res.status).toBe(200);
  });

  it("marks a replayed request with Idempotent-Replayed", async () => {
    const { res } = await previewThenConfirm({ rpc: () => applied([{ item_id: "x" }], true) });
    expect(res.status).toBe(200);
    expect(res.headers.get("Idempotent-Replayed")).toBe("true");
  });

  it("lets the database answer a retry of an applied preview, even after stock changed", async () => {
    withFake({ rpc: () => applied([{ item_id: "x" }], true) });
    const previewBody = await (await preview({ recipe_id: 101, list_id: LIST })).json();
    fake.tables.shopping_delta_previews[0].applied_at = "2026-10-10T12:00:00Z";
    fake.tables.user_inventory[0].quantity = "0";
    const res = await confirm({ preview_id: previewBody.preview_id, request_id: REQUEST_ID });
    expect(res.status).toBe(200);
    expect(res.headers.get("Idempotent-Replayed")).toBe("true");
  });

  it("returns 409 when the preview was already applied by another request", async () => {
    const { res } = await previewThenConfirm({
      rpc: () => ({
        data: { status: "stale", written: [], skipped: [], replayed: false },
        error: null,
      }),
    });
    expect(res.status).toBe(409);
    expect(res.headers.get("X-Receipt-Reason")).toBe("preview_already_applied");
    expect(await res.json()).toEqual({ status: "stale", written: [], skipped: [] });
  });

  it("returns failed, never success, when the write fails", async () => {
    const { res } = await previewThenConfirm({
      rpc: () => ({ data: null, error: { message: "deadlock detected" } }),
    });
    expect(res.status).toBe(500);
    expect(await res.json()).toEqual({ status: "failed", written: [], skipped: [] });
    expect(res.headers.get("X-Receipt-Reason")).toBe("write_failed");
  });

  it("returns 409 failed when a request_id is reused for a different preview", async () => {
    const { res } = await previewThenConfirm({
      rpc: () => ({ data: null, error: { message: "request_id_reused" } }),
    });
    expect(res.status).toBe(409);
    expect(res.headers.get("X-Receipt-Reason")).toBe("request_id_reused");
  });

  it("returns 404 when the list was deleted between preview and confirm", async () => {
    const { res } = await previewThenConfirm({
      rpc: () => ({ data: null, error: { message: "list_not_found" } }),
    });
    expect(res.status).toBe(404);
  });

  it("treats an unexpected status from the database as a failure", async () => {
    const { res } = await previewThenConfirm({
      rpc: () => ({ data: { status: "maybe", written: [], skipped: [] }, error: null }),
    });
    expect(res.status).toBe(500);
    expect((await res.json()).status).toBe("failed");
  });

  it("returns 500 when the preview cannot be read", async () => {
    withFake({ failTables: { shopping_delta_previews: "timeout" } });
    const res = await confirm({ preview_id: REQUEST_ID, request_id: REQUEST_ID });
    expect(res.status).toBe(500);
  });
});
