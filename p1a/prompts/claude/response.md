# P1a Claude Use-Case Derivation Record

## Scope and rules

- Model: Claude Opus 5, run through Claude Code with full repository access.
- Prompt: the clean-room reverse-engineering prompt in `p1a/README.md`, run once, unmodified except for filling its two placeholders from the course format file (the structure table and UC1 only).
- Output: the 20 use cases in `p1a/use-cases/p1a_claude/use-cases.md`; per-use-case evidence in `p1a/traceability/p1a_claude_traceability.md`.
- Permitted sources only: `README.md`, `INSTALL.md`, `docs/user-guides/`, `web/src/`, `backend/api/`, `supabase/migrations/`, and the route manifest emitted by `next build`. No test artifact was used as evidence for any use case.
- Every extension carries a file and line read from source. Claims that could not be supported were dropped rather than softened.

## Prompt as run

The prompt in `p1a/README.md` was used verbatim. Its two placeholders were filled with the use-case structure table and the single worked example UC1 from the course format file, as the prompt directs. Nothing else was added, and no follow-up prompt widened the task.

## What the model got wrong, and how it was caught

Recorded for D5. Zero caught errors would read as zero checking.

| # | What went wrong | How it was caught | Resolution |
|---|---|---|---|
| 1 | Four citations in early drafts of UC3 and UC4 were carried from the Codex output displayed earlier in the session, not read from source. | Each was re-opened in `web/src/` before the document was finalized. | All four line ranges were wrong. `recipes/[id]/page.tsx:28-37` is `:29-31`; `:57-68` is `:60`; `use-recipe.tsx:58-70` is `:66-69`; `recipes/page.tsx:44-55` is `:47,54,75,93`. Corrected, and disclosed in the use-case document. |
| 2 | Exposure to the Codex output also revealed the names of UC1 through UC5. | Noticed while writing the disclosure section. | UC1-UC5 are marked non-independent. Agreement with the Codex run on those five is not cross-model confirmation and must not be counted as such. |
| 3 | Test artifacts had been opened earlier in the session while verifying that the project builds. | Audited against the prompt's forbidden-source list before drafting. | Disclosed. No use case, extension, or citation derives from them. Residual risk is that test file names may have biased feature salience. |

## Verification performed beyond reading

The project was built and run before the use cases were written, so that behavior claims could be checked rather than assumed.

- `npm ci` in `web/`: clean, 992 packages.
- `npm test`: 1095 passed, 1 skipped, 0 failed.
- `npx tsc --noEmit`, `npm run lint`, `npx prettier --check .`: all clean.
- `npm run build`: **fails** when following `INSTALL.md`. Stops at `Failed to collect page data for /api/achievements` with `supabaseKey is required`. Succeeds once `SUPABASE_SERVICE_ROLE_KEY` is supplied, which neither `INSTALL.md` nor `web/.env.example` documents.
- `npm run dev`: ready in 951 ms. `/signin` returns 200 with rendered markup; `/dashboard` returns 307 to `/signin`, confirming the session gate cited in UC2.
- `uv sync` and `uvicorn api.index:app` in `backend/`: server starts and serves three routes. The backend cannot import at all without a Gemini key, because `backend/api/recommender.py:121` constructs the client at module load. This is cited in UC16.

## Cross-model note

At the time of writing, `p1a/use-cases/` holds the Codex run and this run. Comparing the two:

- Eighteen of twenty use cases correspond in substance.
- Codex names `Edit inventory item`, which this run omitted. The behavior is real: `web/src/app/api/inventory/[id]/route.ts:89-183`. This run missed it.
- This run names `Add items to a shopping list`, which Codex omitted. The behavior is real: `web/src/app/api/shopping-lists/[id]/items/route.ts:12-121`. Codex missed it.
- Neither divergence is a hallucination. Both are omissions, in opposite directions, which is the clearest argument in this project so far for running more than one model.
- UC1-UC5 are excluded from the agreement count for the contamination reason above.

---

# D5 conclusion — Claude

## Which prompts earned their keep

Only one scripted prompt was run: the team's clean-room prompt in `p1a/README.md`.
Everything else was ad-hoc probing during verification. Judged honestly:

| Prompt or technique | Earned its keep? | Why |
|---|---|---|
| The team clean-room prompt (`p1a/README.md`) | **Yes, decisively.** | The forbidden-source list is what forced derivation from `web/src/` and `backend/api/` rather than paraphrase of existing test names. Without it, step 7 would have had nothing independent to judge against. |
| Its "mark UNSUPPORTED rather than guess" rule | **Yes.** | It is why shopping-list sharing and the disabled settings rows landed in the coverage boundary instead of becoming fake use cases. A softer prompt would have produced twenty confident use cases including three that do not exist. |
| Its demand for file-and-line evidence | **Yes.** | It is the only reason the four borrowed citations were catchable. A prompt asking for prose descriptions would have hidden the error permanently. |
| Building and running the product before writing | **Yes, the highest-value step.** | Findings F2, F3, B3 and B5 are impossible to reach by reading. `npm run build` failing on the documented instructions is not visible in source. |
| Enumerating routes from the `next build` manifest | **Yes.** | It gave a complete denominator (34 routes), which turned "the tests feel thin" into "11 routes have no test." |
| Asking the model to self-assess coverage without running anything | **No.** | Early attempts to reason about test coverage from file names produced confident, wrong groupings. Only parsing the actual verbose run gave usable numbers. |
| Free-form "find the bugs in this repo" probing | **No.** | Produced generic observations already covered by the linter. Every finding that survived came from a specific question with a checkable answer. |

## Strengths and weaknesses of this model, on this repository

**Strength.** Reading breadth with verification. 34 API routes, 70 test suites and
about 160 source files were traversed, and each claim was tied back to a line. The
model was also able to actually run the toolchain — `npm ci`, `jest`, `tsc`,
`next build`, `uv sync`, `pytest`, `uvicorn` — and several of the strongest
findings exist only because a command failed, not because a file read oddly.

**Weakness, demonstrated rather than hypothesised.** Given another model's output
in the same context, it reused four citations from it and presented them as its
own reading. All four were wrong. It also asserted twice that files were present
on a remote branch based on a stale local ref, without checking the branch through
an independent channel; both assertions were false at the time they were made. The
common failure is the same: **treating a convenient nearby source as verified.**
It self-corrects when asked to re-derive, but it does not reliably self-check
unprompted.

**Practical consequence for the team.** Anything this model cites should be
spot-checked against the line it names. It is reliable about *what the code does*
and unreliable about *where it said the code was*, unless the citation is re-opened.

## Local model, and where the authoritative Step 8 table lives

This run did not execute a local model. That is a statement about this run only:
the team's fourth model, **qwen2.5:32b served locally through Ollama**, was run by
another member via `p1a/scripts/run_local_model.py`, with its prompt, raw
completion, and extracted use cases preserved under `p1a/prompts/qwen2.5/` and
`p1a/use-cases/p1a_qwen2.5/`. The D5 local-model requirement is satisfied at team
level.

**The canonical Step 8 prompt x model table is `p1a/prompts/step8-prompt-model-table.md`,
not this file.** That table covers all four runs (Codex, Gemini, Claude,
qwen2.5:32b), records caught errors per model, and adjudicates the disagreements
against source. Where this document and that table differ, the table governs.

What this document adds that the table does not repeat is the run-level detail
above: which prompts earned their keep in this session, what this model got wrong
and how it was caught, and what was verified by executing the product rather than
by reading it.

## This run's contribution to the cross-model picture

Two points from this run that bear on the team table:

- **Both divergences involving this run were omissions, not hallucinations.** Codex
  named `Edit inventory item`, which this run missed (`web/src/app/api/inventory/[id]/route.ts:89-183`).
  This run named `Add items to a shopping list`, which Codex missed
  (`web/src/app/api/shopping-lists/[id]/items/route.ts:12-121`); Gemini named it too.
  Neither model invented anything. A hallucination is caught by one careful reader;
  **an omission is invisible to a single model no matter how careful it is.** That is
  the argument for running four rather than one, and it is confirmed by the team
  table's own conclusion that no model's set is a superset of the others.

- **UC1-UC5 from this run must be excluded from any agreement count.** The first sixty
  lines of the Codex output, including those five headings, were visible during
  drafting. Agreement on UC1-UC5 measures exposure, not convergence. Independent
  agreement between this run and Codex is therefore 13 of 15 on UC6-UC20, not 18 of 20.
  The team table records this disclosure; it is repeated here so the figure is not
  quoted from this document without it.

## Step 7 — the inherited test suite

Performed after the use cases were fixed, with the clean-room constraint lifted as
the assignment directs. Full analysis in `p1a/traceability/p1a_claude_step7.md`;
raw runs in `p1a/evidence/baseline/2026-08-29-claude-step7-*.txt`.

Headline: the inherited web suite is 1095 passing tests in 3.6 seconds and is
genuinely healthy at the component layer, but **11 of the 34 API routes are imported
by no inherited test**, and five of those carry use cases from this run - UC3 browse
recipes, UC4 recipe detail, UC5 personalized meal plan, UC8 nutrient trends, UC18
add items to a list. The three the product markets itself on are among them.
16 percent of the suite tests Radix and shadcn wrappers that map to no use case.
The backend suite cannot be collected without a Gemini key and fails 24 of 44 with
network errors when given a dummy one, which is why `ci-pytest.yml` runs Ruff and
never invokes pytest. No workflow runs `npm run build`.

**The green badge covers the frontend unit tests and nothing else.**
