/**
 * @jest-environment jsdom
 */

import { act, renderHook, waitFor } from "@testing-library/react";

import { useReceiptRanking } from "@/hooks/useReceiptRanking";
import type { RankingResponse } from "@/types/receipt";

const mockFetch = jest.fn();
global.fetch = mockFetch as unknown as typeof fetch;

const RANKING: RankingResponse = {
  rule_version: "receipt-v1",
  as_of_date: "2026-10-10",
  results: [
    {
      recipe_id: 101,
      rank_score: 3,
      subtotals: { inventory: 2, expiry: 1, nutrition: 0 },
      items: [],
      targets: null,
      warnings: [],
    },
  ],
};

function json(body: unknown, status = 200) {
  return Promise.resolve({
    ok: status >= 200 && status < 300,
    status,
    json: () => Promise.resolve(body),
  });
}

/** Resolves with the rejection, so a failing call can be awaited inside `act`. */
const failureOf = (p: Promise<unknown>) =>
  p.then(
    () => null,
    (e: unknown) => e
  );

const callsTo = (suffix: string | RegExp) =>
  mockFetch.mock.calls.filter(([url]) =>
    typeof suffix === "string" ? String(url).endsWith(suffix) : suffix.test(String(url))
  );

beforeEach(() => {
  jest.clearAllMocks();
});

describe("useReceiptRanking.rank", () => {
  it("starts idle, then loading, then ready with the gateway's response", async () => {
    mockFetch.mockImplementation(() => json(RANKING));
    const { result } = renderHook(() => useReceiptRanking());
    expect(result.current.phase).toEqual({ kind: "idle" });
    expect(result.current.ranking).toBeNull();

    await act(async () => {
      await result.current.rank({ limit: 5 });
    });

    expect(result.current.phase).toEqual({ kind: "ready", ranking: RANKING });
    expect(result.current.ranking).toEqual(RANKING);
  });

  it("sends ids only to the server-side gateway, never the inventory", async () => {
    mockFetch.mockImplementation(() => json(RANKING));
    const { result } = renderHook(() => useReceiptRanking());
    await act(async () => {
      await result.current.rank({ candidate_recipe_ids: [3, 9], limit: 2 });
    });
    const [url, init] = callsTo("/api/receipt-recommendations")[0];
    expect(url).toBe("/api/receipt-recommendations");
    expect(init.method).toBe("POST");
    expect(JSON.parse(init.body)).toEqual({ candidate_recipe_ids: [3, 9], limit: 2 });
  });

  it("sends an empty object when called with no options", async () => {
    mockFetch.mockImplementation(() => json(RANKING));
    const { result } = renderHook(() => useReceiptRanking());
    await act(async () => {
      await result.current.rank();
    });
    expect(JSON.parse(callsTo("/api/receipt-recommendations")[0][1].body)).toEqual({});
  });

  it("says in words that the ranker is unavailable on a 502", async () => {
    mockFetch.mockImplementation(() => json({ error: "Ranking service unavailable" }, 502));
    const { result } = renderHook(() => useReceiptRanking());
    await act(async () => {
      await result.current.rank();
    });
    expect(result.current.phase).toEqual({
      kind: "error",
      message: "The ranking service is not available right now.",
    });
    expect(result.current.ranking).toBeNull();
  });

  it("asks the user to sign in on a 401", async () => {
    mockFetch.mockImplementation(() => json({ error: "Unauthorized" }, 401));
    const { result } = renderHook(() => useReceiptRanking());
    await act(async () => {
      await result.current.rank();
    });
    expect(result.current.phase).toMatchObject({ kind: "error", message: /sign in/i });
  });

  it("uses the server's error text for other failures and a fallback when there is none", async () => {
    mockFetch.mockImplementationOnce(() =>
      json({ error: "Failed to read recipe ingredients" }, 500)
    );
    const { result } = renderHook(() => useReceiptRanking());
    await act(async () => {
      await result.current.rank();
    });
    expect(result.current.phase).toEqual({
      kind: "error",
      message: "Failed to read recipe ingredients",
    });

    mockFetch.mockImplementationOnce(() =>
      Promise.resolve({ ok: false, status: 500, json: () => Promise.reject(new Error("no body")) })
    );
    await act(async () => {
      await result.current.rank();
    });
    expect(result.current.phase).toEqual({ kind: "error", message: "Could not rank recipes." });
  });

  it("reports a dropped connection", async () => {
    mockFetch.mockImplementation(() => Promise.reject(new TypeError("Failed to fetch")));
    const { result } = renderHook(() => useReceiptRanking());
    await act(async () => {
      await result.current.rank();
    });
    expect(result.current.phase).toEqual({ kind: "error", message: "Could not reach the server." });
  });

  it("keeps the last ranking on screen while a re-rank is loading", async () => {
    let release: (value: unknown) => void = () => {};
    mockFetch
      .mockImplementationOnce(() => json(RANKING))
      .mockImplementationOnce(() => new Promise((resolve) => (release = resolve)));
    const { result } = renderHook(() => useReceiptRanking());
    await act(async () => {
      await result.current.rank();
    });
    act(() => {
      void result.current.rank();
    });
    expect(result.current.phase).toEqual({ kind: "loading" });
    expect(result.current.ranking).toEqual(RANKING);
    await act(async () => {
      release({ ok: true, status: 200, json: () => Promise.resolve(RANKING) });
    });
    expect(result.current.phase.kind).toBe("ready");
  });

  it("ignores a stale response when a newer rank was started", async () => {
    const stale: RankingResponse = { ...RANKING, as_of_date: "2026-10-09" };
    let releaseFirst: (value: unknown) => void = () => {};
    mockFetch
      .mockImplementationOnce(() => new Promise((resolve) => (releaseFirst = resolve)))
      .mockImplementationOnce(() => json(RANKING));
    const { result } = renderHook(() => useReceiptRanking());
    act(() => {
      void result.current.rank();
    });
    await act(async () => {
      await result.current.rank();
    });
    expect(result.current.ranking).toEqual(RANKING);
    await act(async () => {
      releaseFirst({ ok: true, status: 200, json: () => Promise.resolve(stale) });
    });
    expect(result.current.ranking).toEqual(RANKING);
    expect(result.current.phase).toEqual({ kind: "ready", ranking: RANKING });
  });

  it("reset clears the ranking and returns to idle", async () => {
    mockFetch.mockImplementation(() => json(RANKING));
    const { result } = renderHook(() => useReceiptRanking());
    await act(async () => {
      await result.current.rank();
    });
    act(() => result.current.reset());
    expect(result.current.phase).toEqual({ kind: "idle" });
    expect(result.current.ranking).toBeNull();
  });
});

describe("useReceiptRanking.correct (contract §8)", () => {
  function routeFetch(putStatus = 200, putBody: unknown = { id: "row-1" }) {
    mockFetch.mockImplementation((url: string, init?: RequestInit) => {
      if (init?.method === "PUT") return json(putBody, putStatus);
      if (String(url).endsWith("/api/receipt-recommendations")) return json(RANKING);
      return json({});
    });
  }

  it("persists through the inventory API, then re-fetches, then re-ranks, in that order", async () => {
    const order: string[] = [];
    mockFetch.mockImplementation((url: string, init?: RequestInit) => {
      if (init?.method === "PUT") {
        order.push("write");
        return json({ id: "row-1" });
      }
      if (String(url).endsWith("/api/receipt-recommendations")) {
        order.push("rank");
        return json(RANKING);
      }
      return json({});
    });
    const onInventoryChanged = jest.fn(async () => {
      order.push("refetch");
    });
    const { result } = renderHook(() => useReceiptRanking({ onInventoryChanged }));
    await act(async () => {
      await result.current.rank({ limit: 5 });
    });
    order.length = 0;

    await act(async () => {
      await result.current.correct("row-1", { quantity: 350 });
    });

    expect(order).toEqual(["write", "refetch", "rank"]);
    expect(onInventoryChanged).toHaveBeenCalledTimes(1);
  });

  it("PUTs exactly the patch to /api/inventory/{id}", async () => {
    routeFetch();
    const { result } = renderHook(() => useReceiptRanking());
    await act(async () => {
      await result.current.correct("row 1/x", { quantity: 350, expiration_date: null });
    });
    const [url, init] = callsTo(/\/api\/inventory\//)[0];
    expect(url).toBe("/api/inventory/row%201%2Fx");
    expect(init.method).toBe("PUT");
    expect(JSON.parse(init.body)).toEqual({ quantity: 350, expiration_date: null });
  });

  it("re-ranks with the same options as the last rank", async () => {
    routeFetch();
    const { result } = renderHook(() => useReceiptRanking());
    await act(async () => {
      await result.current.rank({ candidate_recipe_ids: [101, 102] });
    });
    await act(async () => {
      await result.current.correct("row-1", { quantity: 1 });
    });
    const rankCalls = callsTo("/api/receipt-recommendations");
    expect(rankCalls).toHaveLength(2);
    expect(JSON.parse(rankCalls[1][1].body)).toEqual({ candidate_recipe_ids: [101, 102] });
  });

  it("rejects when the write fails and neither re-fetches nor re-ranks", async () => {
    routeFetch(400, { error: "Invalid quantity" });
    const onInventoryChanged = jest.fn();
    const { result } = renderHook(() => useReceiptRanking({ onInventoryChanged }));
    const failure = await act(() => failureOf(result.current.correct("row-1", { quantity: -1 })));
    expect(failure).toEqual(new Error("Invalid quantity"));
    expect(onInventoryChanged).not.toHaveBeenCalled();
    expect(callsTo("/api/receipt-recommendations")).toHaveLength(0);
  });

  it("explains a 404 and a 401 in words", async () => {
    routeFetch(404, { error: "Inventory item not found" });
    const { result } = renderHook(() => useReceiptRanking());
    const notFound = await act(() => failureOf(result.current.correct("gone", { quantity: 1 })));
    expect(String(notFound)).toMatch(/no longer exists/);

    routeFetch(401, { error: "Unauthorized" });
    const signedOut = await act(() => failureOf(result.current.correct("row-1", { quantity: 1 })));
    expect(String(signedOut)).toMatch(/sign in/i);
  });

  it("rejects when the connection drops during the write", async () => {
    mockFetch.mockImplementation(() => Promise.reject(new TypeError("Failed to fetch")));
    const { result } = renderHook(() => useReceiptRanking());
    const failure = await act(() => failureOf(result.current.correct("row-1", { quantity: 1 })));
    expect(failure).toBeInstanceOf(TypeError);
  });

  it("does not need the host to pass onInventoryChanged", async () => {
    routeFetch();
    const { result } = renderHook(() => useReceiptRanking());
    await act(async () => {
      await result.current.correct("row-1", { quantity: 2 });
    });
    await waitFor(() => expect(result.current.phase.kind).toBe("ready"));
  });
});
