# P1a Step 8 — Final Use-Case Reconciliation

This record explains how the Codex baseline was reconciled with Gemini, Claude, and qwen2.5 findings to select the final 20 use cases. Decisions are settled by product source and traceability impact, not model vote alone.

## Step 8 reconciliation and selection rationale

| Candidate behavior | Model findings | Final decision | Evidence-based reason |
|---|---|---|---|
| Review achievements | Codex, Claude, and qwen2.5 include it; Gemini omits it. | **Keep as UC11.** | The achievements page and manual check endpoint implement a user-facing goal. Omitting it would orphan achievement tests. |
| Review inventory | Codex, Claude, and qwen2.5 make it standalone; Gemini folds viewing into inventory mutations. | **Keep as UC13.** | Expiry ordering and low-stock alerts are review behavior rather than add/edit/remove behavior, and have dedicated tests. |
| Add recipe ingredients to a shopping list | Gemini identifies the recipe-specific flow; Claude identifies item addition; Codex omits it. | **Keep within UC18.** | `AddToCartButton.tsx`, `AddToShoppingListModal.tsx`, and the list-item API confirm selection of recipe ingredients and addition to an existing or newly created list. Folding it into UC18 preserves the required total of 20 without hiding the goal. |
| Create an empty shopping list | Codex, Gemini, and Claude include it. | **Keep as the new-list extension of UC18.** | Creation is real but is the setup path for the broader goal of obtaining a populated shopping list; it does not need a second slot beside UC18. |
| Manage item check-off and deletion | Gemini makes it standalone; Codex includes it in the end-to-end shopping completion flow. | **Keep within UC20.** | Check-off and removal support completing shopping and stocking inventory; keeping the broader workflow avoids duplicating closely coupled item-state steps. |
| Nutrient export | Hosted models cover it; qwen2.5 omits it. | **Keep as UC10.** | Source implements CSV and a text-based summary under the `pdf` format parameter. UC10 states the actual output and does not claim a true PDF. |
| AI meal recommendations, recipe details, meal completion, and transfer to inventory | Hosted models include these goals; qwen2.5 misses some or all. | **Keep as UC4, UC5, UC7, and UC20.** | Each is an implemented end-to-end user goal central to planning, tracking, or the shopping-to-inventory loop. Qwen omissions reflect weaker coverage, not absent product behavior. |
| Page-navigation goals such as View page | qwen2.5 names nine use cases this way. | **Do not promote.** | Navigation is not an actor goal and violates the required verb-plus-noun, implementation-independent use-case framing. The underlying goals are already represented. |
| Push subscriptions, sharing, printing, sign-out, dashboard summaries, and streak maintenance | Present in repository or model coverage boundaries but outside the selected top 20. | **Do not promote.** | They are secondary/supporting behaviors or narrower than the retained planning, nutrition, inventory, gamification, and grocery workflows. They remain candidates for future expansion. |

## Final coverage boundary

The final list contains exactly 20 source-supported, user-facing goals. It deliberately favors complete workflows and test-owning behavior over page enumeration and small supporting actions. No model is treated as authoritative by vote alone: Codex supplies the baseline, while every retained addition or omission from the other models is settled by product source and traceability impact.