/**
 * @jest-environment jsdom
 */

import React from "react";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";

import ReceiptShoppingPreview, {
  formatQuantity,
  newRequestId,
} from "@/components/shopping/ReceiptShoppingPreview";
import type { PreviewResponse } from "@/types/receipt";

const mockFetch = jest.fn();
global.fetch = mockFetch as unknown as typeof fetch;

const LIST = "11111111-1111-4111-8111-111111111111";
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;

const PREVIEW: PreviewResponse = {
  preview_id: "a1000000-0000-4000-8000-000000000001",
  snapshot_id: "snap_abc",
  deltas: [
    { ingredient_id: 11, missing_qty: 300, unit: "g" },
    { ingredient_id: 12, missing_qty: 0.5, unit: "cup" },
  ],
  unresolved: [{ ingredient_id: 15, reason: "missing_unit" }],
};

function json(body: unknown, status = 200) {
  return Promise.resolve({
    ok: status >= 200 && status < 300,
    status,
    json: () => Promise.resolve(body),
  });
}

let getNames: jest.Mock;

function mockNames(rows: { id: number; name: string | null }[]) {
  getNames = jest.fn(async (ids: number[]) =>
    Object.fromEntries(
      rows.filter((r) => r.name && ids.includes(r.id)).map((r) => [r.id, r.name as string])
    )
  );
}

function routeFetch(confirmResponses: Array<() => Promise<unknown>>, preview = PREVIEW) {
  const confirms = [...confirmResponses];
  mockFetch.mockImplementation((url: string) => {
    if (url.endsWith("/preview")) return json(preview);
    const next = confirms.shift();
    return next ? next() : json({ status: "failed", written: [], skipped: [] }, 500);
  });
}

const confirmCalls = () => mockFetch.mock.calls.filter(([url]) => String(url).endsWith("/confirm"));
const previewCalls = () => mockFetch.mock.calls.filter(([url]) => String(url).endsWith("/preview"));

function renderPreview(props: Partial<React.ComponentProps<typeof ReceiptShoppingPreview>> = {}) {
  const onComplete = jest.fn();
  const onCancel = jest.fn();
  render(
    <ReceiptShoppingPreview
      recipe_id={101}
      list_id={LIST}
      onComplete={onComplete}
      onCancel={onCancel}
      getNames={getNames}
      {...props}
    />
  );
  return { onComplete, onCancel };
}

beforeEach(() => {
  jest.clearAllMocks();
  mockNames([
    { id: 11, name: "Chicken breast" },
    { id: 12, name: "Rice" },
    { id: 15, name: "Milk" },
  ]);
});

describe("ReceiptShoppingPreview", () => {
  it("shows a loading state, then the lines to buy", async () => {
    routeFetch([]);
    renderPreview();
    expect(screen.getByRole("status")).toHaveTextContent(/working out/i);
    const list = await screen.findByRole("list", { name: "Items to buy" });
    expect(within(list).getByText("Chicken breast")).toBeInTheDocument();
    expect(within(list).getByText("Buy 300 g")).toBeInTheDocument();
    expect(within(list).getByText("Buy 0.5 cup")).toBeInTheDocument();
  });

  it("asks the server for the preview with ids only, defaulting servings to 1", async () => {
    routeFetch([]);
    renderPreview();
    await screen.findByRole("list", { name: "Items to buy" });
    const [, init] = previewCalls()[0];
    expect(JSON.parse(init.body)).toEqual({ recipe_id: 101, servings: 1, list_id: LIST });
  });

  it("passes servings through", async () => {
    routeFetch([]);
    renderPreview({ servings: 3 });
    await screen.findByRole("list", { name: "Items to buy" });
    expect(JSON.parse(previewCalls()[0][1].body).servings).toBe(3);
  });

  it("explains unresolved lines in words, not only with an icon or colour", async () => {
    routeFetch([]);
    renderPreview();
    const list = await screen.findByRole("list", { name: "Items that could not be calculated" });
    expect(within(list).getByText(/Milk:/)).toBeInTheDocument();
    expect(within(list).getByText(/has no unit/)).toBeInTheDocument();
  });

  it("falls back to the ingredient id when a name is missing", async () => {
    mockNames([{ id: 11, name: null }]);
    routeFetch([]);
    renderPreview();
    expect(await screen.findByText("Ingredient #11")).toBeInTheDocument();
  });

  it("still renders if the name lookup throws", async () => {
    getNames = jest.fn(async () => {
      throw new Error("offline");
    });
    routeFetch([]);
    renderPreview();
    expect(await screen.findByText("Ingredient #12")).toBeInTheDocument();
  });

  it("writes nothing until the user confirms", async () => {
    routeFetch([]);
    renderPreview();
    await screen.findByRole("list", { name: "Items to buy" });
    expect(confirmCalls()).toHaveLength(0);
  });

  it("cancel calls onCancel and never confirms", async () => {
    routeFetch([]);
    const { onCancel, onComplete } = renderPreview();
    await screen.findByRole("list", { name: "Items to buy" });
    await userEvent.click(screen.getByRole("button", { name: "Cancel" }));
    expect(onCancel).toHaveBeenCalledTimes(1);
    expect(confirmCalls()).toHaveLength(0);
    expect(onComplete).not.toHaveBeenCalled();
  });

  it("confirms with the preview id and a v4 request id, then reports success", async () => {
    const result = {
      status: "applied",
      written: [{ item_id: "x" }, { item_id: "y" }],
      skipped: [],
    };
    routeFetch([() => json(result)]);
    const { onComplete } = renderPreview();
    await userEvent.click(await screen.findByRole("button", { name: "Add 2 items to list" }));
    await waitFor(() => expect(onComplete).toHaveBeenCalledWith(result));
    const body = JSON.parse(confirmCalls()[0][1].body);
    expect(body.preview_id).toBe(PREVIEW.preview_id);
    expect(body.request_id).toMatch(UUID);
    expect(screen.getByRole("status")).toHaveTextContent("Added 2 items to your list.");
    expect(screen.queryByRole("button", { name: /add/i })).not.toBeInTheDocument();
  });

  it("sends one confirm for a double click", async () => {
    let release: (v: unknown) => void = () => {};
    routeFetch([
      () =>
        new Promise((resolve) => {
          release = resolve;
        }),
    ]);
    renderPreview();
    const button = await screen.findByRole("button", { name: "Add 2 items to list" });
    await userEvent.dblClick(button);
    expect(confirmCalls()).toHaveLength(1);
    release({
      ok: true,
      status: 200,
      json: () => Promise.resolve({ status: "applied", written: [], skipped: [] }),
    });
    await screen.findByText(/Added 0 items/);
  });

  it("disables the buttons while confirming", async () => {
    routeFetch([() => new Promise(() => {})]);
    renderPreview();
    await userEvent.click(await screen.findByRole("button", { name: "Add 2 items to list" }));
    expect(screen.getByRole("button", { name: /add 2 items/i })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Cancel" })).toBeDisabled();
  });

  it("retries a failed confirm with the same request id, so it cannot apply twice", async () => {
    routeFetch([
      () => Promise.reject(new Error("network down")),
      () => json({ status: "applied", written: [{ item_id: "x" }], skipped: [] }),
    ]);
    const { onComplete } = renderPreview();
    await userEvent.click(await screen.findByRole("button", { name: "Add 2 items to list" }));
    expect(await screen.findByText(/will not add items twice/)).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Try again" }));
    await waitFor(() => expect(onComplete).toHaveBeenCalled());
    const [first, second] = confirmCalls().map(([, init]) => JSON.parse(init.body).request_id);
    expect(second).toBe(first);
  });

  it("shows a failure as a failure, never as success", async () => {
    routeFetch([() => json({ status: "failed", written: [], skipped: [] }, 500)]);
    const { onComplete } = renderPreview();
    await userEvent.click(await screen.findByRole("button", { name: "Add 2 items to list" }));
    expect(await screen.findByText(/Nothing was added/)).toBeInTheDocument();
    expect(onComplete).not.toHaveBeenCalled();
  });

  it("does not trust a 200 whose body is not 'applied'", async () => {
    routeFetch([() => json({ status: "weird", written: [], skipped: [] })]);
    const { onComplete } = renderPreview();
    await userEvent.click(await screen.findByRole("button", { name: "Add 2 items to list" }));
    expect(await screen.findByText(/Nothing was added/)).toBeInTheDocument();
    expect(onComplete).not.toHaveBeenCalled();
  });

  it("on stale, offers a refresh that fetches a new preview and a new request id", async () => {
    routeFetch([
      () => json({ status: "stale", written: [], skipped: [] }, 409),
      () => json({ status: "applied", written: [], skipped: [] }),
    ]);
    renderPreview();
    await userEvent.click(await screen.findByRole("button", { name: "Add 2 items to list" }));
    expect(await screen.findByText(/pantry changed/)).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Refresh" }));
    await userEvent.click(await screen.findByRole("button", { name: "Add 2 items to list" }));
    await waitFor(() => expect(confirmCalls()).toHaveLength(2));
    expect(previewCalls()).toHaveLength(2);
    const [first, second] = confirmCalls().map(([, init]) => JSON.parse(init.body).request_id);
    expect(second).not.toBe(first);
  });

  it("says so when nothing needs buying, and offers no add button", async () => {
    routeFetch([], { ...PREVIEW, deltas: [], unresolved: [] });
    renderPreview();
    expect(await screen.findByText(/You have enough/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Add 0 items to list" })).toBeDisabled();
  });

  it("shows the server's message when the preview fails, with a retry", async () => {
    mockFetch.mockImplementationOnce(() => json({ error: "Shopping list not found" }, 404));
    renderPreview();
    expect(await screen.findByRole("alert")).toHaveTextContent("Shopping list not found");
    mockFetch.mockImplementation(() => json(PREVIEW));
    await userEvent.click(screen.getByRole("button", { name: /Try again/ }));
    expect(await screen.findByRole("list", { name: "Items to buy" })).toBeInTheDocument();
  });

  it("shows a network error when the preview request throws", async () => {
    mockFetch.mockImplementation(() => Promise.reject(new Error("offline")));
    renderPreview();
    expect(await screen.findByRole("alert")).toHaveTextContent("Could not reach the server.");
  });

  it("fetches the preview once even when the host passes a new getNames every render", async () => {
    routeFetch([]);
    const onComplete = jest.fn();
    const { rerender } = render(
      <ReceiptShoppingPreview
        recipe_id={101}
        list_id={LIST}
        onComplete={onComplete}
        getNames={async () => ({})}
      />
    );
    await screen.findByRole("list", { name: "Items to buy" });
    rerender(
      <ReceiptShoppingPreview
        recipe_id={101}
        list_id={LIST}
        onComplete={onComplete}
        getNames={async () => ({})}
      />
    );
    await screen.findByRole("list", { name: "Items to buy" });
    expect(previewCalls()).toHaveLength(1);
  });

  it("works without onCancel", async () => {
    routeFetch([]);
    renderPreview({ onCancel: undefined });
    await screen.findByRole("list", { name: "Items to buy" });
    expect(screen.queryByRole("button", { name: "Cancel" })).not.toBeInTheDocument();
  });
});

describe("helpers", () => {
  it.each([
    [300, "g", "300 g"],
    [0.5, "cup", "0.5 cup"],
    [1234.567, "g", "1,234.57 g"],
    [2, "pcs", "2 pcs"],
  ])("formatQuantity(%p, %p) is %p", (q, unit, expected) => {
    expect(formatQuantity(q, unit)).toBe(expected);
  });

  it("newRequestId returns a v4 UUID", () => {
    expect(newRequestId()).toMatch(UUID);
  });

  it("newRequestId falls back to getRandomValues outside a secure context", () => {
    const original = crypto.randomUUID;
    Object.defineProperty(crypto, "randomUUID", { value: undefined, configurable: true });
    try {
      const ids = new Set(Array.from({ length: 50 }, () => newRequestId()));
      expect(ids.size).toBe(50);
      for (const id of ids) expect(id).toMatch(UUID);
    } finally {
      Object.defineProperty(crypto, "randomUUID", { value: original, configurable: true });
    }
  });
});
