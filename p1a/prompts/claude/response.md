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
