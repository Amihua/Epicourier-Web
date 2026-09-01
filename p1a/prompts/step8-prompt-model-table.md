# P1a Step 8 — Prompt × Model Table

## What this table is

Step 8 asks that our keeper prompts be run on every LLM and that the result be recorded as a prompt × model table, with disagreements resolved by naming the model we believed and the evidence that settled it. This file is that table, plus the disagreement record.

Rules used to fill it:

- A cell is filled only where a run actually happened and its output is preserved in this repository. Cells for runs that did not happen say so; they are not left ambiguous.
- Every verdict is stated as what the run produced and what checking it against source revealed, not as an impression of the model.
- "Caught errors" counts claims that contradicted source and were corrected, with the evidence recorded in that model's derivation record.

## Prompt inventory

| ID | Prompt | Preserved at | Purpose |
|---|---|---|---|
| **P01** | Clean-room reverse-engineering prompt: derive exactly 20 user-facing use cases in the required format, from product artifacts only, with a verification table; forbidden sources listed explicitly. | `p1a/README.md`, used verbatim with its two placeholders filled from the course format file (the structure table and UC1 only) | D2 — the use-case set |
| **P02** | Evidence-fetch prompt: "open `<file>`, show me the complete code for `<area>`, do not summarize, do not conclude." Repeated per file under audit. | Pattern recorded in `p1a/prompts/gemini/derivation-record.md`; not a single archived file, because it is instantiated per file | Verification — turns the agent into a retrieval tool and keeps the judgment human |
| **P05** | Traceability prompt: map every test under `web/tests/p1a/` and `backend/tests/sihao/p1a/` to the use-case set, then assess the project's own tests against those use cases. | Codex response preserved unchanged at `p1a/prompts/codex/P05-response.md` | D4 — traceability matrix |

## The table

| | **Codex** | **Gemini** (Antigravity CLI, Gemini 3.7 Flash, reasoning high) | **Claude** |
|---|---|---|---|
| **P01** — 20 use cases, clean room | **Ran.** 20 well-formed use cases with verification table → `p1a/use-cases/p1a_codex/use-cases.md`. Names *Review achievements* and *Review inventory* as standalone goals. Omits adding recipe ingredients to a shopping list, and covers shopping-item check-off only inside its shopping-completion flow. | **Ran.** 20 well-formed use cases with a 55-row verification table → `p1a/use-cases/p1a_gemini/use-cases.md`. Names *Add recipe ingredients to shopping list* and *Manage shopping list items* as standalone goals. Omits achievements entirely and folds inventory viewing into the four inventory write/suggest use cases. **5 claims contradicted source and were corrected** (see below). Citations: 53 of 55 resolve exactly; 2 overshoot the file length. | **PENDING — teammate to fill.** No Claude use-case set or derivation record exists anywhere under `p1a/`, although the Gemini record cites "the Claude derivation record" for the test baseline and for build/run verification. Those citations currently resolve to nothing in the repository. |
| **P02** — evidence fetch, no summarizing | Verification of this run relied on comparing the generated output against the raw Jest and Pytest logs, rather than on per-file code retrieval. | **Ran, repeatedly. Earned its keep — this is the highest-value prompt in the set.** Every one of the five caught errors came from this pattern: the agent returns code verbatim, the human judges the claim. Two errors were caught in the first pass, three in a second pass that audited all 20 use cases and checked all 55 citations programmatically. | **PENDING.** |
| **P05** — traceability from tests + use cases | **Ran.** Produced the Codex-baseline traceability. **Wrong in a specific, checkable way:** it described several *failing* adversarial tests as though the intended protections were present (unauthenticated share creation, unknown achievement triggers, zero and non-finite quantities, prompt delimiting). | P01 was deliberately the only prompt run on Gemini, to keep that run comparable with the others. | **PENDING.** |

## Caught errors per model

| Model | Errors caught | How |
|---|---|---|
| Codex (P05) | Several failing tests reported as passing protections | Compared the generated prose against the raw Jest and Pytest logs in `p1a/evidence/own-tests/`. Corrected in `p1a/traceability/final-traceability.md`, which now carries an explicit type/result/evidence column per test; the original response is preserved unchanged for the record. |
| Gemini (P01) | 5, plus 2 padded citations | All five via P02. In order: (1) an invented confirm-to-delete flow for zero quantity; (2) an overstated "all ingredients needed for the period" postcondition, contradicted by `new Set(...)` deduplication of recipe IDs; (3) a claimed *unique username* check where only email uniqueness exists; (4) a claimed default list name where both the modal and the API reject an empty name; (5) a claimed *archive* of a completed shopping list where the code performs a hard `DELETE` with cascading items. Full evidence in `p1a/prompts/gemini/derivation-record.md`. |
| Claude | PENDING | — |

Error 3 is the one worth reading twice: the first verification pass had explicitly **cleared** that claim, reading a pre-signup `.eq("email", ...)` query as evidence for a username-uniqueness claim. The sign-off is kept in the record and marked wrong, because the failure was in our checking, not only in the model.

## Where the models disagreed, and what settled it

| Disagreement | Which we believed | Evidence that settled it |
|---|---|---|
| Is *add recipe ingredients to shopping list* a real user goal? Gemini names it (its UC17); Codex omits it. | **Gemini.** | Source, not vote: `web/src/components/shopping/AddToCartButton.tsx` is rendered by the recipe detail page, `AddToShoppingListModal.tsx` presents ingredient checkboxes with a create-new-list branch, and `POST /api/shopping-lists/[id]/items` performs the addition. The Claude run independently reported the same Codex omission, so two models agree — but the code is what settled it. Consequence recorded in the traceability: this is the one use case with **no test at all**, in either suite. |
| Is *review achievements* a real user goal? Codex names it (its UC11); Gemini omits it. | **Codex.** | `web/src/app/dashboard/achievements/page.tsx` exists and is reachable from the dashboard, and `POST /api/achievements/check` is exercised by both the original `achievementsApi.test.ts` and our `attack_achievement_check_rejects_unknown_trigger_values`. Gemini's own session log shows it read that page during exploration and still left the goal out — a pure omission, not a judgment call. Under the Gemini baseline this costs two tests their owner. |
| Should inventory *viewing* be its own use case? Codex says yes (its UC13); Gemini folds it into add/update/delete/suggest. | **Codex, on traceability grounds only.** | Neither reading is wrong as design. But four tests of real, user-visible behavior — undated-item sort order, and the three low-stock alerting tests — are properties of reviewing inventory, not of any single write. Under the Gemini baseline they have no owning use case; under the Codex baseline they do. Settled by counting orphans, not by preference. |
| Does a completed shopping list get archived or deleted? The Gemini use case said archived; the code says deleted. | **The code.** | `handleCompleteList` sends `DELETE /api/shopping-lists/{id}`; that route runs a hard `.delete()` and the items cascade. An `is_archived` field exists on the list type, which is almost certainly what the model pattern-matched on, but nothing writes it. This is a model-versus-source disagreement rather than model-versus-model, and it is the most consequential single correction we made: archived implies recoverable, deleted is not. |

## Per-model strengths and weaknesses, on this repository specifically

- **Codex.** Produces the most complete-looking artifacts and the best-organised traceability structure, and its use-case granularity happens to fit this repository's test suite better than Gemini's. Weakness: it narrates intent as if it were observed behavior — on P05 it reported absent protections as present, which is the single most dangerous failure mode for a testing assignment, because a green-sounding report is exactly what nobody re-checks.
- **Gemini via Antigravity CLI.** Fast, broad repository exploration; consistently well-formed output; real citations that resolve to real files. Weaknesses, all now evidenced: it decorates real behavior with invented UX conventions (a confirm-to-delete flow, a default list name), it overstates guarantees into determinism (complete-period coverage, "archives", prompt-embedded score weights read as computed scores), it rounds citation line ranges upward past the end of the file, and its "Sources" footer cites unrelated public forks of this project that must be ignored during verification.
- **Claude.** PENDING — teammate to fill.

## Local / fourth model

PENDING — one sentence required by D5, either the local model's result or why none ran.
