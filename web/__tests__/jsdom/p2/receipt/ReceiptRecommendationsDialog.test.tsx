/**
 * @jest-environment jsdom
 */

import React from "react";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import fs from "fs";
import path from "path";

import ReceiptRecommendationsDialog, {
  fetchShoppingLists,
} from "@/components/receipt/ReceiptRecommendationsDialog";
import type { RankingPhase } from "@/hooks/useReceiptRanking";
import type { InventorySnapshot, RankingResponse } from "@/types/receipt";

const mockFetch = jest.fn();
global.fetch = mockFetch as unknown as typeof fetch;

// Radix ScrollArea measures itself on interaction; jsdom has no ResizeObserver.
class ResizeObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}
global.ResizeObserver = ResizeObserverStub as unknown as typeof ResizeObserver;

const HAND_COMPUTED = path.resolve(__dirname, "../../../../../p2/eval/cases/hand-computed.json");
const RANKING = (JSON.parse(fs.readFileSync(HAND_COMPUTED, "utf8")) as { receipt: RankingResponse })
  .receipt;

const STOCK: InventorySnapshot[] = [
  {
    inventory_id: "inv-11",
    ingredient_id: 11,
    quantity: 350,
    unit: "g",
    location: "fridge",
    expiration_date: "2026-10-12",
  },
];
const NAMES = { 11: "Chicken breast", 12: "Rice" };
const LISTS = [
  { id: "list-a", name: "Weekly shop" },
  { id: "list-b", name: "Party" },
];
const PREVIEW = {
  preview_id: "a1000000-0000-4000-8000-000000000001",
  snapshot_id: "snap",
  deltas: [{ ingredient_id: 11, missing_qty: 150, unit: "g" }],
  unresolved: [],
};

function json(body: unknown, status = 200) {
  return Promise.resolve({ ok: status < 300, status, json: () => Promise.resolve(body) });
}

function renderDialog(
  phase: RankingPhase,
  props: Partial<React.ComponentProps<typeof ReceiptRecommendationsDialog>> = {}
) {
  const onClose = jest.fn();
  const onRetry = jest.fn();
  const onCorrect = jest.fn(async () => {});
  const onShoppingComplete = jest.fn();
  const getRecipeNames = jest.fn(async () => ({ 101: "Chicken rice", 102: "Milk toast" }));
  const getIngredientNames = jest.fn(async (ids: number[]) =>
    Object.fromEntries(ids.map((id) => [id, `Looked up #${id}`]))
  );
  const getShoppingLists = jest.fn(async () => LISTS);
  const view = render(
    <ReceiptRecommendationsDialog
      isOpen
      onClose={onClose}
      phase={phase}
      ranking={phase.kind === "ready" ? phase.ranking : null}
      inventory={STOCK}
      names={NAMES}
      onCorrect={onCorrect}
      onRetry={onRetry}
      onShoppingComplete={onShoppingComplete}
      getRecipeNames={getRecipeNames}
      getIngredientNames={getIngredientNames}
      getShoppingLists={getShoppingLists}
      {...props}
    />
  );
  return {
    onClose,
    onRetry,
    onCorrect,
    onShoppingComplete,
    getRecipeNames,
    getIngredientNames,
    getShoppingLists,
    ...view,
  };
}

beforeEach(() => {
  jest.clearAllMocks();
  mockFetch.mockImplementation(() => json({}));
});

describe("ReceiptRecommendationsDialog: phases", () => {
  it("shows a loading state before the first ranking", () => {
    renderDialog({ kind: "loading" });
    expect(screen.getByRole("status")).toHaveTextContent(/Ranking recipes/);
  });

  it("shows the error in words with a retry", async () => {
    const user = userEvent.setup();
    const { onRetry } = renderDialog({
      kind: "error",
      message: "The ranking service is not available right now.",
    });
    expect(screen.getByRole("alert")).toHaveTextContent("not available right now");
    await user.click(screen.getByRole("button", { name: /try again/i }));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it("says when there is nothing to rank", () => {
    renderDialog({ kind: "ready", ranking: { ...RANKING, results: [] } });
    expect(screen.getByText(/Nothing to rank yet/)).toBeInTheDocument();
  });

  it("closes through the Close button", async () => {
    const user = userEvent.setup();
    const { onClose } = renderDialog({ kind: "ready", ranking: RANKING });
    // The dialog's own X button is also named "Close"; the footer button is the one with text.
    await user.click(screen.getByText("Close", { selector: "button" }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});

describe("ReceiptRecommendationsDialog: results", () => {
  it("lists recipes in the scorer's order with points, not percentages, and the as-of date", async () => {
    renderDialog({ kind: "ready", ranking: RANKING });
    const list = screen.getByRole("list", { name: "Ranked recipes" });
    // Direct children only: an open receipt nests its own warnings list.
    const items = Array.from(list.children) as HTMLElement[];
    expect(items).toHaveLength(3);
    await within(items[0]).findByText("Chicken rice");
    expect(within(items[0]).getByRole("button", { name: /Chicken rice/ })).toHaveTextContent(
      "3.00 points"
    );
    expect(within(items[1]).getByText("Milk toast")).toBeInTheDocument();
    expect(within(items[2]).getByText("Recipe #103")).toBeInTheDocument();
    expect(screen.queryByText(/%/)).not.toBeInTheDocument();
    expect(screen.getByText(/Stock counted as of 2026-10-10/)).toBeInTheDocument();
  });

  it("opens the top receipt by default and toggles the others", async () => {
    const user = userEvent.setup();
    renderDialog({ kind: "ready", ranking: RANKING });
    expect(
      await screen.findByRole("heading", { name: "Receipt for Chicken rice" })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: "Receipt for Milk toast" })
    ).not.toBeInTheDocument();
    await user.click(await screen.findByRole("button", { name: /Milk toast/ }));
    expect(screen.getByRole("heading", { name: "Receipt for Milk toast" })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /Milk toast/ }));
    expect(
      screen.queryByRole("heading", { name: "Receipt for Milk toast" })
    ).not.toBeInTheDocument();
  });

  it("looks up only the ingredient names the host does not know", async () => {
    const { getIngredientNames, getRecipeNames } = renderDialog({
      kind: "ready",
      ranking: RANKING,
    });
    await waitFor(() => expect(getIngredientNames).toHaveBeenCalledTimes(1));
    const asked = [...getIngredientNames.mock.calls[0][0]].sort();
    expect(asked).toEqual([13, 14, 15]);
    expect(getRecipeNames).toHaveBeenCalledWith([101, 102, 103]);
    expect(await screen.findByText("Looked up #13")).toBeInTheDocument();
    expect(screen.getAllByText("Chicken breast").length).toBeGreaterThan(0);
  });

  it("keeps working when name lookups fail", async () => {
    renderDialog(
      { kind: "ready", ranking: RANKING },
      {
        getRecipeNames: jest.fn(async () => {
          throw new Error("down");
        }),
        getIngredientNames: jest.fn(async () => {
          throw new Error("down");
        }),
      }
    );
    expect(
      await screen.findByRole("heading", { name: "Receipt for recipe #101" })
    ).toBeInTheDocument();
    expect(screen.getByText("Ingredient #13")).toBeInTheDocument();
  });

  it("passes corrections straight through to the host", async () => {
    const user = userEvent.setup();
    const { onCorrect } = renderDialog({ kind: "ready", ranking: RANKING });
    await user.click(await screen.findByRole("button", { name: "Correct Chicken breast" }));
    const form = screen.getByRole("form", { name: "fridge row" });
    await user.clear(within(form).getByLabelText(/Quantity/));
    await user.type(within(form).getByLabelText(/Quantity/), "500");
    await user.click(within(form).getByRole("button", { name: "Save" }));
    await waitFor(() => expect(onCorrect).toHaveBeenCalledWith("inv-11", { quantity: 500 }));
  });

  it("keeps the last receipts on screen and says it is re-ranking while a re-rank loads", async () => {
    renderDialog({ kind: "loading" }, { ranking: RANKING });
    expect(
      await screen.findByRole("heading", { name: "Receipt for Chicken rice" })
    ).toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent(/Re-ranking/);
    expect(screen.getByRole("button", { name: "Correct Chicken breast" })).toBeDisabled();
  });
});

describe("ReceiptRecommendationsDialog: adding what is missing", () => {
  it("offers the user's lists and mounts the shopping preview for the chosen one", async () => {
    const user = userEvent.setup();
    mockFetch.mockImplementation((url: string) =>
      String(url).endsWith("/preview") ? json(PREVIEW) : json({})
    );
    renderDialog({ kind: "ready", ranking: RANKING });
    const select = await screen.findByLabelText("Shopping list");
    expect(
      within(select)
        .getAllByRole("option")
        .map((o) => o.textContent)
    ).toEqual(["Weekly shop", "Party"]);
    await user.selectOptions(select, "list-b");
    await user.click(screen.getByRole("button", { name: /Add what's missing/ }));
    const toBuy = await screen.findByRole("list", { name: "Items to buy" });
    const [, init] = mockFetch.mock.calls.find(([u]) => String(u).endsWith("/preview"))!;
    expect(JSON.parse(init.body)).toEqual({ recipe_id: 101, servings: 1, list_id: "list-b" });
    expect(within(toBuy).getByText("Buy 150 g")).toBeInTheDocument();
    // The preview gets its names from the dialog, not from a second lookup.
    expect(within(toBuy).getByText("Chicken breast")).toBeInTheDocument();
  });

  it("reports an applied confirm to the host with the recipe id", async () => {
    const user = userEvent.setup();
    const applied = { status: "applied", written: [{}, {}], skipped: [] };
    mockFetch.mockImplementation((url: string) => {
      if (String(url).endsWith("/preview")) return json(PREVIEW);
      if (String(url).endsWith("/confirm")) return json(applied);
      return json({});
    });
    const { onShoppingComplete } = renderDialog({ kind: "ready", ranking: RANKING });
    await user.click(await screen.findByRole("button", { name: /Add what's missing/ }));
    await user.click(await screen.findByRole("button", { name: /Add 1 item to list/ }));
    await waitFor(() => expect(onShoppingComplete).toHaveBeenCalledWith(101, applied));
  });

  it("cancelling the preview writes nothing and returns to the button", async () => {
    const user = userEvent.setup();
    mockFetch.mockImplementation((url: string) =>
      String(url).endsWith("/preview") ? json(PREVIEW) : json({})
    );
    renderDialog({ kind: "ready", ranking: RANKING });
    await user.click(await screen.findByRole("button", { name: /Add what's missing/ }));
    await screen.findByRole("list", { name: "Items to buy" });
    await user.click(screen.getByRole("button", { name: "Cancel" }));
    expect(screen.getByRole("button", { name: /Add what's missing/ })).toBeInTheDocument();
    expect(mockFetch.mock.calls.some(([u]) => String(u).endsWith("/confirm"))).toBe(false);
  });

  it("tells the user to create a list first when they have none", async () => {
    renderDialog(
      { kind: "ready", ranking: RANKING },
      { getShoppingLists: jest.fn(async () => []) }
    );
    expect(await screen.findByText(/first create a shopping list/)).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /Add what's missing/ })).not.toBeInTheDocument();
  });

  it("treats a failed list fetch as no lists", async () => {
    renderDialog(
      { kind: "ready", ranking: RANKING },
      {
        getShoppingLists: jest.fn(async () => {
          throw new Error("down");
        }),
      }
    );
    expect(await screen.findByText(/first create a shopping list/)).toBeInTheDocument();
  });
});

describe("fetchShoppingLists", () => {
  it("reads active lists from the API and drops archived ones", async () => {
    mockFetch.mockImplementation(() =>
      json([
        { id: "a", name: "Active", is_archived: false },
        { id: "b", name: "Old", is_archived: true },
      ])
    );
    expect(await fetchShoppingLists()).toEqual([{ id: "a", name: "Active" }]);
    expect(mockFetch).toHaveBeenCalledWith("/api/shopping-lists");
  });

  it("returns nothing on a failed read", async () => {
    mockFetch.mockImplementation(() => json({ error: "Unauthorized" }, 401));
    expect(await fetchShoppingLists()).toEqual([]);
  });
});
