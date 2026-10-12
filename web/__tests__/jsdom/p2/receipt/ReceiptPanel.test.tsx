/**
 * @jest-environment jsdom
 */

import React from "react";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import fs from "fs";
import path from "path";

import ReceiptPanel from "@/components/receipt/ReceiptPanel";
import type { InventorySnapshot, RankedRecipe, RankingResponse } from "@/types/receipt";

const HAND_COMPUTED = path.resolve(__dirname, "../../../../../p2/eval/cases/hand-computed.json");
const FIXTURE = (JSON.parse(fs.readFileSync(HAND_COMPUTED, "utf8")) as { receipt: RankingResponse })
  .receipt;
const RECIPE_101 = FIXTURE.results.find((r) => r.recipe_id === 101)!;
const RECIPE_102 = FIXTURE.results.find((r) => r.recipe_id === 102)!;
const RECIPE_103 = FIXTURE.results.find((r) => r.recipe_id === 103)!;

const NAMES: Record<number, string> = {
  11: "Chicken breast",
  12: "Rice",
  13: "Spinach",
  14: "Garlic",
  15: "Milk",
};

/** The golden fixture's inventory, as the page would hand it over. */
const STOCK: InventorySnapshot[] = [
  {
    inventory_id: "inv-11-fridge",
    ingredient_id: 11,
    quantity: 200,
    unit: "g",
    location: "fridge",
    expiration_date: "2026-10-12",
  },
  {
    inventory_id: "inv-11-freezer",
    ingredient_id: 11,
    quantity: 150,
    unit: "g",
    location: "freezer",
    expiration_date: "2026-10-10",
  },
  {
    inventory_id: "inv-12",
    ingredient_id: 12,
    quantity: 300,
    unit: "g",
    location: "pantry",
    expiration_date: null,
  },
  {
    inventory_id: "inv-13",
    ingredient_id: 13,
    quantity: 80,
    unit: "g",
    location: "fridge",
    expiration_date: "2026-10-09",
  },
  {
    inventory_id: "inv-15",
    ingredient_id: 15,
    quantity: 2,
    unit: null,
    location: "fridge",
    expiration_date: "2026-10-20",
  },
];

function renderPanel(
  receipt: RankedRecipe,
  props: Partial<React.ComponentProps<typeof ReceiptPanel>> = {}
) {
  const onCorrect = jest.fn(async () => {});
  const view = render(
    <ReceiptPanel receipt={receipt} onCorrect={onCorrect} names={NAMES} {...props} />
  );
  return { onCorrect, ...view };
}

describe("ReceiptPanel: reading the receipt", () => {
  it("labels the score as ranking points, not a percentage", () => {
    renderPanel(RECIPE_101, { recipeName: "Chicken rice" });
    expect(screen.getByRole("heading", { name: "Receipt for Chicken rice" })).toBeInTheDocument();
    expect(screen.getByTestId("rank-score")).toHaveTextContent("3.00");
    expect(screen.getByText("ranking points")).toBeInTheDocument();
    expect(screen.queryByText(/%/)).not.toBeInTheDocument();
  });

  it("falls back to the recipe id when no name is known", () => {
    renderPanel(RECIPE_101);
    expect(screen.getByRole("heading", { name: "Receipt for recipe #101" })).toBeInTheDocument();
  });

  it("shows the stated subtotals with signs", () => {
    renderPanel(RECIPE_101);
    const subtotals = screen.getByLabelText("Subtotals");
    expect(within(subtotals).getByText("What you have").nextElementSibling).toHaveTextContent(
      "+2.00"
    );
    expect(within(subtotals).getByText("Expiry").nextElementSibling).toHaveTextContent("+1.00");
    expect(within(subtotals).getByText("Nutrition").nextElementSibling).toHaveTextContent("0.00");
  });

  it("renders one row per line with needed, usable, expiry, status in words and signed points", () => {
    renderPanel(RECIPE_101);
    const table = screen.getByRole("table", { name: "Receipt lines" });
    const rows = within(table).getAllByRole("row");
    // header + 2 group headings + 5 lines + footer
    expect(rows).toHaveLength(1 + 2 + 5 + 1);

    const chicken = within(table).getAllByText("Chicken breast")[0].closest("tr")!;
    expect(within(chicken).getByText("500 g")).toBeInTheDocument();
    expect(within(chicken).getByText("350 g")).toBeInTheDocument();
    expect(within(chicken).getByText("2026-10-12")).toBeInTheDocument();
    expect(within(chicken).getByText("Short")).toBeInTheDocument();
    expect(within(chicken).getByText("0.00")).toBeInTheDocument();

    const spinach = within(table).getByText("Spinach").closest("tr")!;
    expect(within(spinach).getByText("Expired, not counted")).toBeInTheDocument();
    // Requires 0 g and 0 g is usable: both cells say so, and the row still reads "expired".
    expect(within(spinach).getAllByText("0 g")).toHaveLength(2);
    expect(within(spinach).getByText("2026-10-09")).toBeInTheDocument();
    expect(within(spinach).getByText("+1.00")).toBeInTheDocument();

    const garlic = within(table).getByText("Garlic").closest("tr")!;
    const cells = within(garlic)
      .getAllByRole("cell")
      .map((c) => c.textContent);
    // ingredient, needed (unknown), usable, expires (none), status, points
    expect(cells).toEqual(["Garlic", "—", "0 g", "—", "Recipe doesn't say how much", "0.00"]);
  });

  it("groups lines by source, pantry first then expiry", () => {
    renderPanel(RECIPE_101);
    const groups = screen.getAllByRole("rowgroup").filter((g) => g.tagName === "TBODY");
    expect(groups.map((g) => g.getAttribute("data-source"))).toEqual(["inventory", "expiry"]);
    expect(within(groups[0]).getByText("What you have")).toBeInTheDocument();
    expect(within(groups[1]).getByText("Use it before it expires")).toBeInTheDocument();
  });

  it("says the lines add up to the score when they do", () => {
    renderPanel(RECIPE_101);
    expect(screen.getByTestId("line-total")).toHaveTextContent("+3.00");
    expect(screen.getByText("The lines add up to the score.")).toBeInTheDocument();
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("raises an alert in words when the lines do not reach the score", () => {
    const broken: RankedRecipe = { ...RECIPE_101, rank_score: 4 };
    renderPanel(broken);
    const alert = screen.getByRole("alert");
    expect(alert).toHaveTextContent("The lines add up to +3.00 but the score says 4.00");
    expect(alert).toHaveTextContent("does not add up");
  });

  it("explains an unresolved unit line in words", () => {
    renderPanel(RECIPE_102);
    const milk = screen.getByText("Milk").closest("tr")!;
    expect(within(milk).getByText("No unit on your stock")).toBeInTheDocument();
    expect(within(milk).getByText("2")).toBeInTheDocument();
    const warnings = screen.getByRole("list", { name: "Warnings" });
    expect(within(warnings).getByText(/Milk:/)).toBeInTheDocument();
    expect(within(warnings).getByText(/stores no unit/)).toBeInTheDocument();
  });

  it("lists every warning with the ingredient's name", () => {
    renderPanel(RECIPE_101);
    const warnings = within(screen.getByRole("list", { name: "Warnings" })).getAllByRole(
      "listitem"
    );
    expect(warnings).toHaveLength(2);
    expect(warnings[0]).toHaveTextContent("Garlic:");
    expect(warnings[1]).toHaveTextContent("Spinach:");
    expect(warnings[1]).toHaveTextContent("expired on 2026-10-09");
  });

  it("renders an empty receipt without crashing and with a defined zero", () => {
    renderPanel(RECIPE_103);
    expect(screen.getByTestId("rank-score")).toHaveTextContent("0.00");
    expect(screen.getByText("This recipe lists nothing that could be scored.")).toBeInTheDocument();
    expect(screen.getByText("The lines add up to the score.")).toBeInTheDocument();
    expect(screen.queryByRole("table")).not.toBeInTheDocument();
  });

  it("uses the line's own name, then the id, when the host knows no name", () => {
    renderPanel(
      {
        ...RECIPE_102,
        items: [{ ...RECIPE_102.items[0], ingredient_name: "From scorer" }, RECIPE_102.items[1]],
      },
      { names: {} }
    );
    expect(screen.getByText("From scorer")).toBeInTheDocument();
    expect(screen.getByText("Ingredient #15")).toBeInTheDocument();
  });
});

describe("ReceiptPanel: targets", () => {
  it("says when no confirmed targets were used", () => {
    renderPanel(RECIPE_101);
    expect(screen.getByText("No confirmed nutrient targets were used.")).toBeInTheDocument();
  });

  it("reports remaining, overage and incomplete keys without clamping", () => {
    const withTargets: RankedRecipe = {
      ...RECIPE_101,
      targets: {
        remaining: { protein_g: 20, fiber_g: 0 },
        over: { calories_kcal: 600, protein_g: 0 },
        incomplete: ["vitamin_c_mg"],
      },
    };
    renderPanel(withTargets);
    const box = screen.getByLabelText("Nutrient targets");
    expect(within(box).getByText(/Left today: protein_g 20.00, fiber_g 0.00/)).toBeInTheDocument();
    expect(within(box).getByText(/Past the target: calories_kcal 600.00/)).toBeInTheDocument();
    expect(within(box).queryByText(/protein_g 0.00/)).not.toBeInTheDocument();
    expect(within(box).getByText(/Missing data for: vitamin_c_mg/)).toBeInTheDocument();
  });
});

describe("ReceiptPanel: correcting a line (contract §8)", () => {
  it("is read-only when the host passes no inventory", () => {
    renderPanel(RECIPE_101);
    expect(screen.queryByRole("button", { name: /correct/i })).not.toBeInTheDocument();
  });

  it("offers a correction only for pantry lines that have a stock row", () => {
    renderPanel(RECIPE_101, { inventory: STOCK });
    expect(screen.getByRole("button", { name: "Correct Chicken breast" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Correct Spinach" })).toBeInTheDocument();
    // Garlic (14) is not in stock: nothing to correct, said in words.
    expect(screen.queryByRole("button", { name: "Correct Garlic" })).not.toBeInTheDocument();
    const garlic = screen.getByText("Garlic").closest("tr")!;
    expect(within(garlic).getByText("Not in your inventory")).toBeInTheDocument();
    // The expiry line for chicken is not a stock row and gets no button of its own.
    expect(screen.getAllByRole("button", { name: "Correct Chicken breast" })).toHaveLength(1);
  });

  it("opens one form per stock row, pre-filled from the row", async () => {
    const user = userEvent.setup();
    renderPanel(RECIPE_101, { inventory: STOCK });
    await user.click(screen.getByRole("button", { name: "Correct Chicken breast" }));
    const group = screen.getByRole("group", { name: "Correct Chicken breast" });
    const forms = within(group).getAllByRole("form");
    expect(forms).toHaveLength(2);
    expect(within(group).getByRole("form", { name: "freezer row" })).toBeInTheDocument();
    const fridge = within(group).getByRole("form", { name: "fridge row" });
    expect(within(fridge).getByLabelText(/Quantity \(g\)/)).toHaveValue("200");
    expect(within(fridge).getByLabelText("Expires")).toHaveValue("2026-10-12");
  });

  it("sends the smallest patch for that row through onCorrect", async () => {
    const user = userEvent.setup();
    const { onCorrect } = renderPanel(RECIPE_101, { inventory: STOCK });
    await user.click(screen.getByRole("button", { name: "Correct Chicken breast" }));
    const fridge = screen.getByRole("form", { name: "fridge row" });
    const qty = within(fridge).getByLabelText(/Quantity/);
    await user.clear(qty);
    await user.type(qty, "350");
    await user.click(within(fridge).getByRole("button", { name: "Save" }));
    await waitFor(() => expect(onCorrect).toHaveBeenCalledTimes(1));
    expect(onCorrect).toHaveBeenCalledWith("inv-11-fridge", { quantity: 350 });
    expect(await screen.findByText("Correction saved.")).toBeInTheDocument();
  });

  it("submits on Enter as well as on Save, and never twice for one save", async () => {
    const user = userEvent.setup();
    let resolve: () => void = () => {};
    const onCorrect = jest.fn(() => new Promise<void>((r) => (resolve = r)));
    renderPanel(RECIPE_102, { inventory: STOCK, onCorrect });
    await user.click(screen.getByRole("button", { name: "Correct Chicken breast" }));
    const fridge = screen.getByRole("form", { name: "fridge row" });
    const qty = within(fridge).getByLabelText(/Quantity/);
    await user.clear(qty);
    await user.type(qty, "210{enter}");
    expect(onCorrect).toHaveBeenCalledTimes(1);
    expect(within(fridge).getByRole("button", { name: /saving/i })).toBeDisabled();
    expect(qty).toBeDisabled();
    await user.click(within(fridge).getByRole("button", { name: /saving/i }));
    expect(onCorrect).toHaveBeenCalledTimes(1);
    resolve();
    await waitFor(() => expect(within(fridge).getByRole("button", { name: "Save" })).toBeEnabled());
  });

  it("refuses an invalid form in words without calling onCorrect", async () => {
    const user = userEvent.setup();
    const { onCorrect } = renderPanel(RECIPE_101, { inventory: STOCK });
    await user.click(screen.getByRole("button", { name: "Correct Rice" }));
    const form = screen.getByRole("form", { name: "pantry row" });
    const qty = within(form).getByLabelText(/Quantity/);
    await user.clear(qty);
    await user.type(qty, "-5");
    await user.click(within(form).getByRole("button", { name: "Save" }));
    expect(within(form).getByRole("alert")).toHaveTextContent(/zero or more/);
    expect(onCorrect).not.toHaveBeenCalled();
  });

  it("refuses to save a form that changes nothing", async () => {
    const user = userEvent.setup();
    const { onCorrect } = renderPanel(RECIPE_101, { inventory: STOCK });
    await user.click(screen.getByRole("button", { name: "Correct Rice" }));
    const form = screen.getByRole("form", { name: "pantry row" });
    await user.click(within(form).getByRole("button", { name: "Save" }));
    expect(within(form).getByRole("alert")).toHaveTextContent("Nothing changed.");
    expect(onCorrect).not.toHaveBeenCalled();
  });

  it("shows the host's failure in words and keeps the form open", async () => {
    const user = userEvent.setup();
    const onCorrect = jest.fn(async () => {
      throw new Error("Invalid quantity");
    });
    renderPanel(RECIPE_101, { inventory: STOCK, onCorrect });
    await user.click(screen.getByRole("button", { name: "Correct Rice" }));
    const form = screen.getByRole("form", { name: "pantry row" });
    const qty = within(form).getByLabelText(/Quantity/);
    await user.clear(qty);
    await user.type(qty, "250");
    await user.click(within(form).getByRole("button", { name: "Save" }));
    expect(await within(form).findByRole("alert")).toHaveTextContent("Invalid quantity");
    expect(screen.getByRole("form", { name: "pantry row" })).toBeInTheDocument();
    expect(qty).toHaveValue("250");
    expect(within(form).getByRole("button", { name: "Save" })).toBeEnabled();
  });

  it("falls back to a generic message when the failure has no text", async () => {
    const user = userEvent.setup();
    const onCorrect = jest.fn(async () => {
      throw "boom";
    });
    renderPanel(RECIPE_101, { inventory: STOCK, onCorrect });
    await user.click(screen.getByRole("button", { name: "Correct Rice" }));
    const form = screen.getByRole("form", { name: "pantry row" });
    await user.clear(within(form).getByLabelText(/Quantity/));
    await user.type(within(form).getByLabelText(/Quantity/), "1");
    await user.click(within(form).getByRole("button", { name: "Save" }));
    expect(await within(form).findByRole("alert")).toHaveTextContent(
      "Could not save the correction."
    );
  });

  it("closes the form when the host hands over a re-ranked receipt", async () => {
    const user = userEvent.setup();
    const { rerender, onCorrect } = renderPanel(RECIPE_101, { inventory: STOCK });
    await user.click(screen.getByRole("button", { name: "Correct Rice" }));
    expect(screen.getByRole("group", { name: "Correct Rice" })).toBeInTheDocument();
    const reranked: RankedRecipe = { ...RECIPE_101, rank_score: 3 };
    rerender(
      <ReceiptPanel receipt={reranked} onCorrect={onCorrect} names={NAMES} inventory={STOCK} />
    );
    expect(screen.queryByRole("group", { name: "Correct Rice" })).not.toBeInTheDocument();
  });

  it("tells the user it is re-ranking and blocks new corrections meanwhile", () => {
    renderPanel(RECIPE_101, { inventory: STOCK, reranking: true });
    expect(screen.getByRole("status")).toHaveTextContent(/Re-ranking/);
    expect(screen.getByRole("button", { name: "Correct Rice" })).toBeDisabled();
  });

  it("closes the form from its Close button and toggles from the line button", async () => {
    const user = userEvent.setup();
    renderPanel(RECIPE_101, { inventory: STOCK });
    const button = screen.getByRole("button", { name: "Correct Rice" });
    await user.click(button);
    expect(button).toHaveAttribute("aria-expanded", "true");
    await user.click(
      within(screen.getByRole("group", { name: "Correct Rice" })).getByRole("button", {
        name: "Close",
      })
    );
    expect(screen.queryByRole("group", { name: "Correct Rice" })).not.toBeInTheDocument();
    await user.click(button);
    await user.click(button);
    expect(screen.queryByRole("group", { name: "Correct Rice" })).not.toBeInTheDocument();
  });
});
