/**
 * @jest-environment jsdom
 *
 * Issue #31: on a phone-width screen the receipt dialog was clipped (Points
 * column, Correct buttons and Close cut off). jsdom does no layout, so the fix
 * was measured in headless Chrome at 390, 360 and 1440 px; these tests pin the
 * structure that measurement depends on, so it cannot quietly come undone.
 */

import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import fs from "fs";
import path from "path";

import ReceiptPanel from "@/components/receipt/ReceiptPanel";
import ReceiptRecommendationsDialog from "@/components/receipt/ReceiptRecommendationsDialog";
import type { RankingResponse } from "@/types/receipt";

class ResizeObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}
global.ResizeObserver = ResizeObserverStub as unknown as typeof ResizeObserver;

const HAND_COMPUTED = path.resolve(__dirname, "../../../../../p2/eval/cases/hand-computed.json");
const RANKING = (JSON.parse(fs.readFileSync(HAND_COMPUTED, "utf8")) as { receipt: RankingResponse })
  .receipt;
const WIDTH_CAP = "max-w-[min(48rem,calc(100%-1rem))]";

function renderDialog() {
  render(
    <ReceiptRecommendationsDialog
      isOpen
      onClose={() => {}}
      phase={{ kind: "ready", ranking: RANKING }}
      ranking={RANKING}
      inventory={[]}
      onCorrect={async () => {}}
      onRetry={() => {}}
      getRecipeNames={async () => ({})}
      getIngredientNames={async () => ({})}
      getShoppingLists={async () => []}
    />
  );
  return screen.getByRole("dialog");
}

describe("receipt dialog layout on narrow screens (#31)", () => {
  it("caps the dialog at the screen width less 1rem, below and above the sm breakpoint", () => {
    const classes = renderDialog().className.split(/\s+/);
    expect(classes).toContain(WIDTH_CAP);
    expect(classes).toContain(`sm:${WIDTH_CAP}`);
    expect(classes).not.toContain("sm:max-w-lg");
  });

  it("is a flex column, so the footer stays inside the dialog", () => {
    const classes = renderDialog().className.split(/\s+/);
    expect(classes).toEqual(expect.arrayContaining(["flex", "flex-col"]));
    expect(classes).not.toContain("grid");
  });

  it("lets the scroll area shrink instead of growing to the widest receipt", () => {
    renderDialog();
    const list = screen.getByRole("list", { name: "Ranked recipes" });
    const scrollRoot = list.closest(".relative.overflow-hidden") as HTMLElement;
    expect(scrollRoot.className.split(/\s+/)).toEqual(
      expect.arrayContaining(["min-w-0", "min-h-0", "flex-1"])
    );
  });
});

describe("receipt table on narrow screens (#31)", () => {
  it("sits in its own sideways scroller, so Points and Correct stay reachable", () => {
    render(<ReceiptPanel receipt={RANKING.results[0]} onCorrect={async () => {}} />);
    const table = screen.getByRole("table", { name: "Receipt lines" });
    expect(table.parentElement).toHaveClass("overflow-x-auto");
  });
});
