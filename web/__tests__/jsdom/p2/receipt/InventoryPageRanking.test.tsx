/**
 * @jest-environment jsdom
 *
 * The inventory page's "Suggest Recipes" now goes through the server-side
 * gateway (P2 M2). The browser must send ids only and never post the page's
 * filtered inventory to the Python backend.
 */

import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";

import InventoryPage from "@/app/dashboard/inventory/page";

const mockToast = jest.fn();
jest.mock("@/hooks/use-toast", () => ({
  useToast: () => ({ toast: mockToast }),
}));

const mockFetch = jest.fn();
global.fetch = mockFetch as unknown as typeof fetch;

class ResizeObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}
global.ResizeObserver = ResizeObserverStub as unknown as typeof ResizeObserver;

const ITEM = {
  id: "inv-1",
  user_id: "u",
  ingredient_id: 11,
  quantity: 200,
  unit: "g",
  location: "fridge",
  expiration_date: "2026-10-12",
  min_quantity: null,
  notes: null,
  created_at: "",
  updated_at: "",
  ingredient: { id: 11, name: "Chicken breast" },
  expiration_status: "good",
  days_until_expiration: 5,
  is_low_stock: false,
};

const SUMMARY = {
  total_items: 1,
  expiring_soon: 0,
  expired: 0,
  low_stock: 0,
  by_location: { pantry: 0, fridge: 1, freezer: 0, other: 0 },
};

function json(body: unknown, status = 200) {
  return Promise.resolve({ ok: status < 300, status, json: () => Promise.resolve(body) });
}

beforeEach(() => {
  jest.clearAllMocks();
  mockFetch.mockImplementation((url: string, init?: RequestInit) => {
    const u = String(url);
    if (u.startsWith("/api/inventory")) return json({ items: [ITEM], summary: SUMMARY });
    if (u === "/api/receipt-recommendations") {
      expect(init?.method).toBe("POST");
      return json({ error: "Ranking service unavailable" }, 502);
    }
    if (u === "/api/shopping-lists") return json([]);
    return json({});
  });
});

describe("InventoryPage → receipt ranking", () => {
  it("asks the gateway with ids only and never calls the Python backend from the browser", async () => {
    render(<InventoryPage />);
    const button = await screen.findByRole("button", { name: /suggest recipes/i });
    await waitFor(() => expect(button).toBeEnabled());
    fireEvent.click(button);

    await waitFor(() =>
      expect(mockFetch.mock.calls.some(([u]) => u === "/api/receipt-recommendations")).toBe(true)
    );
    const [, init] = mockFetch.mock.calls.find(([u]) => u === "/api/receipt-recommendations")!;
    expect(JSON.parse(init.body)).toEqual({ limit: 5 });
    expect(mockFetch.mock.calls.some(([u]) => String(u).includes("inventory-recommend"))).toBe(
      false
    );
    expect(mockFetch.mock.calls.some(([u]) => String(u).startsWith("http"))).toBe(false);
  });

  it("shows the ranker's unavailability in words inside the dialog instead of a toast", async () => {
    render(<InventoryPage />);
    const button = await screen.findByRole("button", { name: /suggest recipes/i });
    await waitFor(() => expect(button).toBeEnabled());
    fireEvent.click(button);
    expect(await screen.findByRole("alert")).toHaveTextContent(/not available right now/);
    expect(
      screen.getByRole("heading", { name: "Recipes ranked by your pantry" })
    ).toBeInTheDocument();
    expect(mockToast).not.toHaveBeenCalledWith(expect.objectContaining({ title: "Error" }));
  });
});
