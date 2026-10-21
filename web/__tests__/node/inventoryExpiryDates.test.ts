/**
 * @jest-environment node
 *
 * Issue #32 at the API: with the clock at 23:30 Eastern on 2026-10-21 (already
 * 2026-10-22 in UTC), raspberries expiring 2026-10-23 are 2 days out in every
 * inventory route, and the "expiring within N days" windows start today, Eastern.
 */

import { NextRequest } from "next/server";

import { GET as GET_EXPIRING } from "@/app/api/inventory/expiring/route";
import { GET as GET_ITEM } from "@/app/api/inventory/[id]/route";
import { GET as GET_LIST } from "@/app/api/inventory/route";
import { createClient } from "@/utils/supabase/server";

jest.mock("@/utils/supabase/server", () => ({ createClient: jest.fn() }));

const USER = { id: "user-1" };
const RASPBERRIES = {
  id: "inv-1",
  user_id: USER.id,
  ingredient_id: 7,
  quantity: 1,
  unit: "box",
  location: "fridge",
  expiration_date: "2026-10-23",
  min_quantity: null,
  notes: null,
  created_at: "2026-10-20T12:00:00Z",
  updated_at: "2026-10-20T12:00:00Z",
  ingredient: { id: 7, name: "Raspberries" },
};

type Call = [string, ...unknown[]];

/** A query builder that records every filter and resolves to `rows`. */
function recordingClient(rows: unknown[]) {
  const calls: Call[] = [];
  const builder: Record<string, unknown> = {};
  for (const method of ["select", "eq", "not", "lte", "gte", "order", "in"]) {
    builder[method] = (...args: unknown[]) => {
      calls.push([method, ...args]);
      return builder;
    };
  }
  builder.single = () => Promise.resolve({ data: rows[0] ?? null, error: null });
  builder.then = (resolve: (v: unknown) => unknown) => resolve({ data: rows, error: null });
  const client = {
    auth: { getUser: async () => ({ data: { user: USER }, error: null }) },
    from: () => builder,
  };
  (createClient as jest.Mock).mockResolvedValue(client);
  return calls;
}

const request = (path: string) => new NextRequest(new URL(path, "http://localhost:3000"));
const filter = (calls: Call[], method: string) =>
  calls.filter((c) => c[0] === method && c[1] === "expiration_date").map((c) => c[2]);

describe("inventory routes count expiry in calendar days, Eastern (#32)", () => {
  const originalZone = process.env.RECEIPT_TIME_ZONE;

  beforeEach(() => {
    delete process.env.RECEIPT_TIME_ZONE;
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2026-10-21T23:30:00-04:00"));
  });

  afterEach(() => {
    jest.useRealTimers();
    if (originalZone === undefined) delete process.env.RECEIPT_TIME_ZONE;
    else process.env.RECEIPT_TIME_ZONE = originalZone;
  });

  it("GET /api/inventory reports 2 days and a critical status", async () => {
    recordingClient([RASPBERRIES]);
    const body = await (await GET_LIST(request("/api/inventory"))).json();
    expect(body.items[0]).toMatchObject({
      days_until_expiration: 2,
      expiration_status: "critical",
    });
  });

  it("GET /api/inventory?expiring_within=7 spans 2026-10-21 to 2026-10-28", async () => {
    const calls = recordingClient([RASPBERRIES]);
    await GET_LIST(request("/api/inventory?expiring_within=7"));
    expect(filter(calls, "gte")).toEqual(["2026-10-21"]);
    expect(filter(calls, "lte")).toEqual(["2026-10-28"]);
  });

  it("GET /api/inventory/[id] reports the same 2 days", async () => {
    recordingClient([RASPBERRIES]);
    const res = await GET_ITEM(request("/api/inventory/inv-1"), {
      params: Promise.resolve({ id: "inv-1" }),
    });
    expect(await res.json()).toMatchObject({ days_until_expiration: 2 });
  });

  it("GET /api/inventory/expiring?days=7 cuts off at 2026-10-28 and reports 2 days", async () => {
    const calls = recordingClient([RASPBERRIES]);
    const body = await (await GET_EXPIRING(request("/api/inventory/expiring?days=7"))).json();
    expect(filter(calls, "lte")).toEqual(["2026-10-28"]);
    expect(JSON.stringify(body)).toContain('"days_until_expiration":2');
  });
});
