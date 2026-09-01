- # P1a Gemini Use-Case Derivation Record

  ## Scope and rules

  - Model: Gemini 3.7 Flash (reasoning effort: high), as reported by Antigravity CLI, run through Antigravity CLI (`agy`) v1.1.22 with full repository access. Antigravity CLI is Google's official successor to Gemini CLI, which was retired in June 2026; it is the current free consumer path to Gemini coding agents.
  - Prompt: the clean-room reverse-engineering prompt in `p1a/README.md`, run once, unmodified except for filling its two placeholders from the course format file (the structure table and UC1 only).
  - Output: the 20 use cases and verification table in `p1a/use-cases/p1a_gemini/use-cases.md`. The prompt as run is preserved in `p1a/prompts/gemini/P01-prompt.md`.
  - Permitted sources only. The session tool log shows the model read: README.md; docs/user-guides/ (quick-start, inventory-management, shopping-lists, smart-suggestions); AGENT-PLAN/03-API-SPECIFICATIONS.md and AGENT-PLAN/v1.3.0-SMART-CART-PLAN.md (architecture documents, not testing documents); page components under web/src/app/; selected components under web/src/components/; and backend/api/index.py.
  - Contamination audit: this branch already contains `p1a/use-cases/p1a_codex/`, which is a pre-existing use-case list and therefore a forbidden source under the prompt. The session tool log was audited after the run: the model opened no file under `p1a/`, `web/__tests__/`, `web/e2e/`, `web/tests/`, or `backend/tests/`. Unlike the Claude run, this session contained no prior display of Codex output, so no use case is marked non-independent.

  ## Prompt as run

  The prompt in `p1a/README.md` was used verbatim. Its two placeholders were filled with the use-case structure table and the single worked example UC1 from the course format file, as the prompt directs. Nothing else was added, and no follow-up prompt widened the task.

  ## What the model got wrong, and how it was caught

  Recorded for D5. Zero caught errors would read as zero checking.

  | #    | What went wrong                                              | How it was caught                                            | Resolution                                                   |
  | ---- | ------------------------------------------------------------ | ------------------------------------------------------------ | ------------------------------------------------------------ |
  | 1    | UC12 extension 2a claims that reducing an item's quantity to zero makes the system prompt the user to confirm removal of the item. No such flow exists anywhere. `web/src/components/inventory/EditInventoryModal.tsx` rejects `qty <= 0` as "⚠️ Invalid Quantity" before any request is sent, and its quantity input is constrained to `min="0.01"`. Neither the modal nor the PUT handler in `web/src/app/api/inventory/[id]/route.ts` contains a removal prompt. The real behavior is the opposite of the claim: zero is treated as invalid input, not as a deletion gesture. | The claim was flagged as an unverifiable UI nicety of the kind agents commonly invent, then every quantity-related code path in the edit flow (modal submit handler, quantity input JSX, PUT handler) was read in full. | Extension 2a rewritten to match source: zero or negative quantity is rejected with a validation error. Correction disclosed in the use-case document. |
  | 2    | UC16's postcondition claims the generated shopping list contains "all ingredients needed for the scheduled period." In `web/src/app/api/shopping-lists/generate/route.ts`, recipe IDs are deduplicated with `new Set(...)` before ingredients are fetched, so a recipe scheduled N times in the range contributes its ingredients exactly once — quantities do not scale with how often a meal is scheduled. The step-4 aggregation claim itself is real (an `ingredientMap` keyed by ingredient id sums quantities of ingredients shared across *different* recipes), but the postcondition overstates the guarantee. | The data flow was traced line by line from calendar entries to inserted list items; the `Set` deduplication before the ingredient fetch contradicts the postcondition for repeated meals. | Postcondition reworded to "containing the aggregated ingredients of each distinct recipe scheduled in the period." The repetition gap recorded as a product-level observation, not repaired (report, do not repair). |

  Claims that survived checking (stated so the checking itself is visible):

  - UC1 (register): the uniqueness claim is supported by an explicit pre-signup query on the User table in `web/src/app/signup/actions.ts` — a real check, not a database-error fallback. Format validation is delegated to Supabase auth with rewritten error messages, which at use-case granularity still supports the claim.
  - UC11 (add inventory): the merge-on-duplicate claim in extension 2a is fully supported. `web/src/app/api/inventory/route.ts` POST looks up an existing row by user + ingredient + location and performs `quantity: existing.quantity + quantity`.
  - UC16 step 4 (aggregation across different recipes) and extension 3a (empty date range returns "No meals found") are both supported by the generate route.

  In total, four use cases were audited line-by-line against source, plus spot checks of the verification table's file citations; two errors were found and corrected.

  ## Observations from checking (not use-case errors)

  - Antigravity CLI appends a "Sources" list of GitHub links to its answers even when the content came from local `Read(...)` calls; across turns those links pointed at two different public forks (`epicourier-team/…`, `sdxshuai/…`) of this project. They are web-grounding noise. Verification in this record relied only on content the tool log shows was read from the local working tree.
  - UC11's merge path silently overwrites `unit`, `notes`, and `min_quantity` with the newly submitted values (null when omitted), so merging can erase an earlier note.
  - The generate route inserts list items non-fatally: on insert error it logs and still returns success, so a user could receive a "created" but empty list.
  - Frontend and backend disagree on zero quantity for inventory edits: the modal blocks `qty <= 0`, the PUT API accepts `quantity === 0` (rejects only negatives).

  ## Verification performed beyond reading

  The frontend test suite was rerun locally for this record (2026-08-29, macOS arm64): `npm test` in `web/` gives **1095 passed, 1 skipped, 0 failed** (70 of 71 suites, ~2.9 s), matching the baseline in the Claude derivation record; raw output archived at `p1a/evidence/2026-08-29-web-tests-wenbo-raw.txt`. One environment finding of its own: `npm ci` fails on this machine (npm 11.19) because the committed lock file is missing the `@swc/core` platform-binary entries, while the Claude record reports a clean `npm ci` — the discrepancy is npm-version-dependent lockfile resolution. Tests were run via `npm install` instead, and the resulting lockfile change was discarded rather than committed (report, do not repair). The passing suite also emits unhandled React `act(...)` warnings from `useNutrientDashboard` tests and intentional error-path `console.error` noise — green, but not silent.

  Broader build/run verification (lint, build, dev server, backend startup, including the undocumented `SUPABASE_SERVICE_ROLE_KEY` and Gemini-key findings) is documented in the Claude derivation record and `p1a/evidence/`. Beyond the test rerun, this run's verification consisted of the source-level audits above, performed by pointing the agent at specific files and reading the returned code in full before judging each claim; the agent was instructed to fetch and display code without summarizing or concluding, so every verdict in this record is a human judgment over primary source.

  ## Prompts: which earned their keep

  - P01 (clean-room use-case prompt, from p1a/README.md): earned its keep. One run produced 20 well-formed use cases with a citation table; 18 of 20 audited or spot-checked claims held.
  - Evidence-fetch prompts of the form "open <file>, show me the complete code for <area>, do not summarize, do not conclude": earned their keep. They turn the agent into a retrieval tool and keep the verification judgment human; both caught errors came from this pattern.
  - Not used: no follow-up prompt widened P01, deliberately, to keep this run comparable with the Codex and Claude runs.

  ## Cross-model note

  At the time of writing, `p1a/use-cases/` holds the Codex run and this run; the Claude run is recorded in its derivation record. Comparing this run against Codex:

  Seventeen to eighteen of twenty use cases correspond in substance despite different numbering and phrasing (e.g. Gemini UC13 "Delete inventory items in batch" ≙ Codex UC16 "Remove inventory items"; Gemini UC20 "Join community challenge" ≙ Codex UC12 "Join a wellness challenge").

  Divergences, in both directions:

  - Codex names **Review achievements** (Codex UC11); this run omitted it. The behavior is real — `web/src/app/dashboard/achievements/page.tsx` exists, and the session log shows the model even read that page during exploration and still left it out. A pure omission.
  - Codex names **Review inventory** (Codex UC13) as a standalone viewing goal; this run folded inventory viewing into its add/update/delete/suggest use cases. A granularity choice rather than a missed feature, but a divergence.
  - This run names **Add recipe ingredients to shopping list** (Gemini UC17); Codex omitted it. The behavior is real: `web/src/components/shopping/AddToCartButton.tsx` and `web/src/app/api/shopping-lists/[id]/items/route.ts`. The Claude run independently reported the same Codex omission, so two models confirm it — a gem, not a hallucination.
  - This run names **Manage shopping list items** (Gemini UC18) as its own use case; Codex covers item check-off only inside its shopping-completion flow (Codex UC20). Partial overlap at different granularity.

  None of these divergences is a hallucination; all are omissions or granularity choices, in both directions, consistent with the Claude record's conclusion that no single model finds everything. The two confirmed hallucinations found in this run (UC12 removal prompt, UC16 postcondition) were both *inside* use cases whose existence all models agree on — feature-level agreement across models does not certify detail-level claims, which is why line-level checking remains necessary.

  ## Model strengths and weaknesses on this repo (one-liner for D5)

  Gemini via Antigravity CLI: strong, fast repository exploration and consistently well-formed output with real citations (all 10 sampled cited files existed; sampled line ranges were accurate) — but it decorates real behavior with invented UX conventions (a confirm-to-delete flow) and overstated guarantees (complete-period coverage), and its web-grounding "Sources" footer cites unrelated public forks, which must be ignored during verification.
