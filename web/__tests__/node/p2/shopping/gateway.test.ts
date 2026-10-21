/**
 * @jest-environment node
 */

import { POST as RECOMMEND } from "@/app/api/receipt-recommendations/route";
import { asOfDate } from "@/lib/receipt-shopping/asOfDate";
import {
  buildCandidates,
  inStockUnit,
  callRanker,
  normaliseRequirement,
  pickCandidateIds,
  rankerConfig,
  RankerError,
  toTargets,
  type CandidateMapRow,
} from "@/lib/receipt-shopping/gateway";
import type { InventorySnapshot, RankingRequest, RankingResponse } from "@/types/receipt";
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

function inv(
  id: string,
  ingredient_id: number,
  expiration_date: string | null = null
): InventorySnapshot {
  return {
    inventory_id: id,
    ingredient_id,
    quantity: 100,
    unit: "g",
    location: "pantry",
    expiration_date,
  };
}

function mapRow(recipe_id: number, ingredient_id: number, r = 100, unit = "100g"): CandidateMapRow {
  return { recipe_id, ingredient_id, relative_unit_100: r, Ingredient: { unit } };
}

// ---------------------------------------------------------------------------
describe("normaliseRequirement", () => {
  it("re-expresses 2.5 of '100g' as 250 g", () => {
    expect(normaliseRequirement({ ingredient_id: 1, quantity: 2.5, unit: "100g" })).toEqual({
      ingredient_id: 1,
      quantity: 250,
      unit: "g",
    });
  });

  it("keeps a null quantity null, but still normalises the unit", () => {
    expect(normaliseRequirement({ ingredient_id: 1, quantity: null, unit: "100g" })).toEqual({
      ingredient_id: 1,
      quantity: null,
      unit: "g",
    });
  });

  it("keeps zero as zero", () => {
    expect(normaliseRequirement({ ingredient_id: 1, quantity: 0, unit: "100g" }).quantity).toBe(0);
  });

  it("passes an unparseable unit through for the ranker to report", () => {
    expect(normaliseRequirement({ ingredient_id: 1, quantity: 1, unit: "" })).toEqual({
      ingredient_id: 1,
      quantity: 1,
      unit: "",
    });
  });
});

describe("pickCandidateIds", () => {
  const rows = [
    mapRow(7, 1),
    mapRow(7, 2),
    mapRow(3, 1),
    mapRow(3, 2),
    mapRow(5, 1),
    mapRow(9, 4), // only matches an expired row
  ];
  const inventory = [inv("a", 1), inv("b", 2), inv("c", 4, "2026-10-01")];

  it("ranks by distinct usable ingredients shared, ties by lower recipe id", () => {
    expect(pickCandidateIds(inventory, rows, "2026-10-10", 10)).toEqual([3, 7, 5]);
  });

  it("ignores expired stock when choosing", () => {
    expect(pickCandidateIds(inventory, rows, "2026-10-10", 10)).not.toContain(9);
  });

  it("counts an ingredient once even if it appears twice in a recipe", () => {
    expect(
      pickCandidateIds([inv("a", 1)], [mapRow(1, 1), mapRow(1, 1), mapRow(2, 1)], "2026-10-10", 10)
    ).toEqual([1, 2]);
  });

  it("respects the limit", () => {
    expect(pickCandidateIds(inventory, rows, "2026-10-10", 2)).toEqual([3, 7]);
  });

  it("is independent of row order", () => {
    expect(
      pickCandidateIds([...inventory].reverse(), [...rows].reverse(), "2026-10-10", 10)
    ).toEqual([3, 7, 5]);
  });

  it("returns nothing for an empty pantry", () => {
    expect(pickCandidateIds([], rows, "2026-10-10", 10)).toEqual([]);
  });
});

describe("buildCandidates", () => {
  it("groups each recipe's rows, normalised, with servings 1", () => {
    expect(
      buildCandidates([3, 4], [mapRow(3, 1, 250), mapRow(3, 2, 50, "1 cup"), mapRow(9, 1)])
    ).toEqual([
      {
        recipe_id: 3,
        servings: 1,
        requirements: [
          { ingredient_id: 1, quantity: 250, unit: "g" },
          { ingredient_id: 2, quantity: 0.5, unit: "cup" },
        ],
      },
      { recipe_id: 4, servings: 1, requirements: [] },
    ]);
  });
});

describe("toTargets", () => {
  it("is null without goals", () => {
    expect(toTargets(null, null)).toBeNull();
  });

  it("is null for goals the user has not confirmed", () => {
    expect(toTargets({ calories_kcal: 2000, confirmed_at: null }, null)).toBeNull();
  });

  it("uses confirmed goals and today's intake", () => {
    expect(
      toTargets(
        { calories_kcal: "2000.00", protein_g: 120, confirmed_at: "2026-10-09T12:00:00Z" },
        { calories_kcal: "650.50", protein_g: null }
      )
    ).toEqual({
      confirmed_at: "2026-10-09T12:00:00Z",
      daily: { calories_kcal: 2000, protein_g: 120 },
      consumed_today: { calories_kcal: 650.5, protein_g: 0 },
    });
  });

  it("leaves out a goal that is missing rather than reading it as zero", () => {
    const t = toTargets({ calories_kcal: null, fiber_g: 30, confirmed_at: "x" }, null)!;
    expect(t.daily).toEqual({ fiber_g: 30 });
    expect(t.consumed_today).toEqual({ fiber_g: 0 });
  });
});

describe("rankerConfig", () => {
  it("defaults to the local backend and /receipt/rank", () => {
    expect(rankerConfig({} as NodeJS.ProcessEnv)).toEqual({
      baseUrl: "http://localhost:8000",
      path: "/receipt/rank",
      token: undefined,
      timeoutMs: 15000,
    });
  });

  it("reads the environment, trimming a trailing slash", () => {
    expect(
      rankerConfig({
        BACKEND_URL: "https://api.example.com/",
        RECEIPT_RANK_PATH: "/v1/rank",
        RECEIPT_INTERNAL_TOKEN: "s3cret",
        RECEIPT_RANK_TIMEOUT_MS: "500",
      } as unknown as NodeJS.ProcessEnv)
    ).toEqual({
      baseUrl: "https://api.example.com",
      path: "/v1/rank",
      token: "s3cret",
      timeoutMs: 500,
    });
  });
});

describe("callRanker", () => {
  const request: RankingRequest = {
    rule_version: "receipt-v1",
    as_of_date: "2026-10-10",
    candidates: [{ recipe_id: 3, requirements: [] }],
    inventory: [],
    targets: null,
  };
  const good: RankingResponse = {
    rule_version: "receipt-v1",
    as_of_date: "2026-10-10",
    results: [
      {
        recipe_id: 3,
        rank_score: 1,
        subtotals: { inventory: 1, expiry: 0, nutrition: 0 },
        items: [],
        targets: null,
        warnings: [],
      },
    ],
  };
  const config = { baseUrl: "http://py", path: "/receipt/rank", token: "t", timeoutMs: 1000 };
  const reply = (body: unknown, status = 200) =>
    jest.fn().mockResolvedValue({ ok: status < 300, status, json: () => Promise.resolve(body) });

  it("posts the request with the internal token and returns the response", async () => {
    const fetchImpl = reply(good);
    await expect(callRanker(request, config, fetchImpl)).resolves.toEqual(good);
    const [url, init] = fetchImpl.mock.calls[0];
    expect(url).toBe("http://py/receipt/rank");
    expect(init.headers["X-Internal-Token"]).toBe("t");
    expect(JSON.parse(init.body)).toEqual(request);
  });

  it("sends no token header when none is configured", async () => {
    const fetchImpl = reply(good);
    await callRanker(request, { ...config, token: undefined }, fetchImpl);
    expect(fetchImpl.mock.calls[0][1].headers).not.toHaveProperty("X-Internal-Token");
  });

  it.each([
    ["an error status", reply(good, 500)],
    ["a network failure", jest.fn().mockRejectedValue(new Error("ECONNREFUSED"))],
    [
      "a body that is not JSON",
      jest
        .fn()
        .mockResolvedValue({ ok: true, status: 200, json: () => Promise.reject(new Error("x")) }),
    ],
    ["another rule version", reply({ ...good, rule_version: "receipt-v0" })],
    ["another date", reply({ ...good, as_of_date: "2026-10-11" })],
    ["results that are not a list", reply({ ...good, results: null })],
    [
      "a recipe nobody asked about",
      reply({ ...good, results: [{ ...good.results[0], recipe_id: 99 }] }),
    ],
  ])("rejects %s", async (_label, fetchImpl) => {
    await expect(
      callRanker(request, config, fetchImpl as unknown as typeof fetch)
    ).rejects.toBeInstanceOf(RankerError);
  });
});

// ---------------------------------------------------------------------------
describe("POST /api/receipt-recommendations", () => {
  let fake: FakeSupabase;
  const mockFetch = jest.fn();
  const realFetch = global.fetch;

  function tables() {
    return {
      user_inventory: [
        {
          id: "i1",
          user_id: USER.id,
          ingredient_id: 1,
          quantity: "200",
          unit: "g",
          location: "fridge",
          expiration_date: "2026-10-12",
        },
        {
          id: "i2",
          user_id: USER.id,
          ingredient_id: 2,
          quantity: "1",
          unit: "L",
          location: "fridge",
          expiration_date: null,
        },
        {
          id: "i3",
          user_id: USER.id,
          ingredient_id: 8,
          quantity: "3",
          unit: "pieces",
          location: "pantry",
          expiration_date: "2026-09-01",
        },
        {
          id: "i4",
          user_id: OTHER,
          ingredient_id: 9,
          quantity: "5",
          unit: "g",
          location: "pantry",
          expiration_date: null,
        },
      ],
      Recipe: [{ id: 3 }, { id: 7 }, { id: 9 }],
      "Recipe-Ingredient_Map": [
        mapRow(3, 1, 250),
        mapRow(3, 2, 50, "1 L"),
        mapRow(7, 1),
        mapRow(9, 8),
      ],
      nutrient_goals: [] as Record<string, unknown>[],
      nutrient_tracking: [] as Record<string, unknown>[],
    };
  }

  function withFake(options: FakeOptions = {}) {
    fake = makeFakeSupabase({ user: USER, tables: tables(), ...options });
    (createClient as jest.Mock).mockResolvedValue(fake);
  }

  function rankerReplies(build?: (req: RankingRequest) => unknown, status = 200) {
    mockFetch.mockImplementation(async (_url: string, init: RequestInit) => {
      const req = JSON.parse(String(init.body)) as RankingRequest;
      const body = build
        ? build(req)
        : {
            rule_version: "receipt-v1",
            as_of_date: req.as_of_date,
            results: req.candidates.map((c, i) => ({
              recipe_id: c.recipe_id,
              rank_score: 10 - i,
              subtotals: { inventory: 10 - i, expiry: 0, nutrition: 0 },
              items: [],
              targets: null,
              warnings: [],
            })),
          };
      return { ok: status < 300, status, json: async () => body };
    });
  }

  const sentRequest = () => JSON.parse(String(mockFetch.mock.calls[0][1].body)) as RankingRequest;

  const call = (body?: unknown) =>
    RECOMMEND(
      new Request("http://localhost/api/receipt-recommendations", {
        method: "POST",
        body:
          body === undefined ? undefined : typeof body === "string" ? body : JSON.stringify(body),
      })
    );

  beforeAll(() => {
    global.fetch = mockFetch as unknown as typeof fetch;
  });
  afterAll(() => {
    global.fetch = realFetch;
  });
  beforeEach(() => {
    jest.clearAllMocks();
    (asOfDate as jest.Mock).mockReturnValue("2026-10-10");
    jest.spyOn(console, "error").mockImplementation(() => {});
    rankerReplies();
  });
  afterEach(() => {
    (console.error as jest.Mock).mockRestore();
  });

  it("returns 401 without a session and never calls the ranker", async () => {
    withFake({ user: null });
    expect((await call()).status).toBe(401);
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it.each([
    ["not JSON", "{oops"],
    ["a client-supplied inventory", { inventory: [] }],
    ["non-integer ids", { candidate_recipe_ids: [1.5] }],
    ["too many ids", { candidate_recipe_ids: Array.from({ length: 51 }, (_, i) => i + 1) }],
    ["a zero limit", { limit: 0 }],
  ])("returns 400 for %s", async (_label, body) => {
    withFake();
    expect((await call(body)).status).toBe(400);
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it("accepts an empty body", async () => {
    withFake();
    expect((await call()).status).toBe(200);
  });

  it("sends the caller's full inventory, read by the server, and nobody else's", async () => {
    withFake();
    await call({});
    const sent = sentRequest();
    expect(sent.inventory.map((r) => r.inventory_id).sort()).toEqual(["i1", "i2", "i3"]);
    expect(fake.log.find((q) => q.table === "user_inventory")!.filters).toContainEqual([
      "eq",
      "user_id",
      USER.id,
    ]);
  });

  it("builds a receipt-v1 request for today's date with normalised requirements", async () => {
    withFake();
    await call({});
    const sent = sentRequest();
    expect(sent.rule_version).toBe("receipt-v1");
    expect(sent.as_of_date).toBe("2026-10-10");
    expect(sent.candidates[0]).toEqual({
      recipe_id: 3,
      servings: 1,
      requirements: [
        { ingredient_id: 1, quantity: 250, unit: "g" },
        { ingredient_id: 2, quantity: 0.5, unit: "L" },
      ],
    });
  });

  it("chooses candidates from usable stock only, best overlap first", async () => {
    withFake();
    await call({});
    expect(sentRequest().candidates.map((c) => c.recipe_id)).toEqual([3, 7]);
  });

  it("uses the caller's candidate ids, dropping ones that do not exist", async () => {
    withFake();
    await call({ candidate_recipe_ids: [9, 404, 3] });
    expect(sentRequest().candidates.map((c) => c.recipe_id)).toEqual([3, 9]);
  });

  it("answers an empty result without calling the ranker when nothing matches", async () => {
    withFake({ tables: { ...tables(), user_inventory: [] } });
    const res = await call({});
    expect(await res.json()).toEqual({
      rule_version: "receipt-v1",
      as_of_date: "2026-10-10",
      results: [],
    });
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it("sends null targets while goals are unconfirmed", async () => {
    withFake({
      tables: {
        ...tables(),
        nutrient_goals: [{ user_id: USER.id, calories_kcal: 2000, confirmed_at: null }],
      },
    });
    await call({});
    expect(sentRequest().targets).toBeNull();
  });

  it("sends confirmed targets with today's intake", async () => {
    withFake({
      tables: {
        ...tables(),
        nutrient_goals: [
          { user_id: USER.id, calories_kcal: 2000, confirmed_at: "2026-10-09T00:00:00Z" },
        ],
        nutrient_tracking: [
          { user_id: USER.id, date: "2026-10-09", calories_kcal: 1800 },
          { user_id: USER.id, date: "2026-10-10", calories_kcal: 500 },
        ],
      },
    });
    await call({});
    expect(sentRequest().targets).toEqual({
      confirmed_at: "2026-10-09T00:00:00Z",
      daily: { calories_kcal: 2000 },
      consumed_today: { calories_kcal: 500 },
    });
  });

  it("returns the ranker's response unchanged", async () => {
    withFake();
    const res = await call({});
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.results.map((r: { recipe_id: number }) => r.recipe_id)).toEqual([3, 7]);
  });

  it("returns 502 when the ranker fails", async () => {
    withFake();
    rankerReplies(undefined, 500);
    const res = await call({});
    expect(res.status).toBe(502);
    expect(await res.json()).toEqual({ error: "Ranking service unavailable" });
  });

  it("returns 502 when the ranker answers outside the contract", async () => {
    withFake();
    rankerReplies((req) => ({
      rule_version: "receipt-v1",
      as_of_date: req.as_of_date,
      results: "nope",
    }));
    expect((await call({})).status).toBe(502);
  });

  it("returns 500 when the inventory cannot be read", async () => {
    withFake({ failTables: { user_inventory: "boom" } });
    expect((await call({})).status).toBe(500);
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it("states requirements in the unit the caller's stock is kept in (#33)", async () => {
    const t = tables();
    t.user_inventory[0] = { ...t.user_inventory[0], quantity: "0.2", unit: "kg" };
    withFake({ tables: t });
    await call({});
    expect(sentRequest().candidates[0].requirements[0]).toEqual({
      ingredient_id: 1,
      quantity: 0.25,
      unit: "kg",
    });
  });

  it("returns 500 when goals cannot be read, rather than silently dropping them", async () => {
    withFake({ failTables: { nutrient_goals: "boom" } });
    expect((await call({})).status).toBe(500);
    expect(mockFetch).not.toHaveBeenCalled();
  });
});

describe("inStockUnit (#33)", () => {
  const AS_OF = "2026-10-21";
  const stock = (
    id: string,
    ingredient_id: number,
    quantity: number,
    unit: string | null,
    expiration_date: string | null = null
  ): InventorySnapshot => ({
    inventory_id: id,
    ingredient_id,
    quantity,
    unit,
    location: "pantry",
    expiration_date,
  });

  it("restates grams as the kilograms the pantry is kept in", () => {
    expect(
      inStockUnit(
        { ingredient_id: 1, quantity: 2.5, unit: "100g" },
        [stock("a", 1, 1, "kg")],
        AS_OF
      )
    ).toEqual({ ingredient_id: 1, quantity: 0.25, unit: "kg" });
  });

  it("restates the issue's olive oil, 15% of '1 tbsp (15 ml)', for a pantry in ml", () => {
    expect(
      inStockUnit(
        { ingredient_id: 2, quantity: 0.15, unit: "1 tbsp (15 ml)" },
        [stock("a", 2, 500, "ml")],
        AS_OF
      )
    ).toEqual({ ingredient_id: 2, quantity: 2.25, unit: "ml" });
  });

  it("keeps the display unit when the stock is in another dimension", () => {
    expect(
      inStockUnit(
        { ingredient_id: 3, quantity: 0.5, unit: "1 large (50 g)" },
        [stock("a", 3, 6, "pieces")],
        AS_OF
      )
    ).toEqual({ ingredient_id: 3, quantity: 25, unit: "g" });
  });

  it("ignores rows with no unit and expired rows", () => {
    const rows = [stock("a", 1, 5, null), stock("b", 1, 2, "kg", "2026-10-01")];
    expect(inStockUnit({ ingredient_id: 1, quantity: 2.5, unit: "100g" }, rows, AS_OF)).toEqual({
      ingredient_id: 1,
      quantity: 250,
      unit: "g",
    });
  });

  it("picks the unit holding the most usable stock", () => {
    const rows = [stock("a", 1, 200, "g"), stock("b", 1, 1, "kg")];
    expect(inStockUnit({ ingredient_id: 1, quantity: 3, unit: "100g" }, rows, AS_OF).unit).toBe(
      "kg"
    );
  });

  it("keeps an unknown requirement unknown while still matching the unit", () => {
    expect(
      inStockUnit(
        { ingredient_id: 1, quantity: null, unit: "100g" },
        [stock("a", 1, 1, "kg")],
        AS_OF
      )
    ).toEqual({ ingredient_id: 1, quantity: null, unit: "kg" });
  });

  it("buildCandidates uses the stock's unit when given the stock", () => {
    const [candidate] = buildCandidates([3], [mapRow(3, 1, 250)], {
      inventory: [stock("a", 1, 1, "kg")],
      asOf: AS_OF,
    });
    expect(candidate.requirements).toEqual([{ ingredient_id: 1, quantity: 0.25, unit: "kg" }]);
  });
});
