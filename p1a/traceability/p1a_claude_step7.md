# P1a Claude — Step 7: Judging the Project's Own Tests

Step 7 of the assignment: having formed an independent view of the design
(the 20 use cases in `p1a/use-cases/p1a_claude/use-cases.md`), now look at the
tests the project already had, and say where they are blind.

The clean-room constraint that governed steps 1-6 is deliberately lifted here.
Everything below is read from `web/__tests__/`, `web/e2e/`, `backend/tests/test_*.py`
and `data/test_recipe.py` — the inherited suites. Our own team's additions under
`web/tests/p1a/` and `backend/tests/sihao/` are excluded, because the question is
what the codebase arrived with.

Raw runs: `p1a/evidence/baseline/2026-08-29-claude-step7-web-raw.txt` and
`p1a/evidence/baseline/2026-08-29-claude-step7-backend-raw.txt`.

## What the inherited suite actually is

| Suite | Result |
|---|---|
| Web (`web/__tests__/`), 70 files | **1095 passed, 1 skipped, 0 failed**, 3.6 s |
| Backend (`backend/tests/test_*.py`) | **24 failed, 19 passed, 1 skipped** with a dummy API key; **cannot be collected at all** without one |
| End-to-end (`web/e2e/`, 6 spec files) | Not runnable: `global-setup.ts` requires a live Supabase project and a real test account |

The headline number is genuine. 1095 web tests really do pass on a year-old
codebase, in under four seconds, with no flakes across repeated runs. That is
better than most inherited projects. The blindness is not in the count.

## Where it is blind

### B1 — Five of our twenty use cases have an untested primary route

Of the 34 API routes under `web/src/app/api/`, 23 are imported by some inherited
test and **11 are not imported by any**:

| Untested route | Use case it carries |
|---|---|
| `/api/recipes` | **UC3 Browse recipes** |
| `/api/recipes/[id]` | **UC4 View recipe details** |
| `/api/recommender` | **UC5 Request a personalized meal plan** |
| `/api/nutrients/daily` | **UC8 Review nutrient trends** |
| `/api/shopping-lists/[id]/items` | **UC18 Add items to a shopping list** |
| `/api/shopping-lists/[id]/items/[itemId]` | checking an item off a list |
| `/api/shopping-lists/share` | the share feature (see B4) |
| `/api/ingredients`, `/api/tags` | catalogue lookup behind UC3 and UC13 |
| `/api/recommendations` | recommendation retrieval |
| `/api/users` | profile retrieval |

UC3 and UC4 are the recipe-browsing core of the product; UC5 is the AI meal
planner the README leads with. None of their routes is exercised. The 80-percent
and 50-to-80-percent match bands cited in UC3 (`api/recipes/route.ts:97-102`) are
pure in-memory logic with no test at all.

The gap is partly masked at the hook and component layer — `use-recipe.test.tsx`
has 17 cases and `useNutrientDashboard.test.tsx` has 25 — but those mock the
route away. A hook test proves the component handles a shape; it cannot prove the
route produces that shape.

### B2 — 16 percent of the suite tests library wrappers, not the product

171 of 1095 cases (15.6 percent) sit in 15 files that map to no use case:

```
32  ui-field        28  ui-input-group   20  ui-dropdown-menu
32  use-toast       18  ui-sidebar       10  layout
 7  ui-button        6  ui-sheet          5  use-mobile
 4  next-config      3  landing           2  ui-separator
 2  ui-skeleton      1  ui-accordion      1  page
```

These are thin wrappers over Radix and shadcn primitives. `ui-field` alone
carries more cases (32) than the whole of sign-in, sign-up, middleware and logout
combined (34). The suite is heavily weighted toward the code least likely to
break and least specific to this product.

### B3 — The backend suite cannot pass, and the CI is arranged so nobody notices

`backend/api/recommender.py:121` executes `client = load_gemini_client()` at module
scope. `api/index.py` imports that module, and `tests/conftest.py` imports
`api.index`. So with no `GEMINI_KEY`, pytest fails during collection:

```
ValueError: Missing key inputs argument!
ImportError while loading conftest 'backend/tests/conftest.py'
```

With a dummy key, collection succeeds and 24 of 44 cases fail, every one of them
with `httpx.ConnectError` or `httpx.ReadTimeout`: `test_recommender.py` reaches
the live Gemini and Supabase services. Those are integration tests wearing unit
test clothing. They cannot pass without paid credentials, and with credentials
they bill on every run.

The split is clean: `test_inventory_recommender.py`, which mocks properly, passes
15 of 16. `test_recommender.py`, which does not, passes 4 of 28.

This explains an oddity in the CI. `.github/workflows/ci-pytest.yml` is titled
"Backend CI" but contains a single `lint` job running Ruff. **It never invokes
pytest.** Given the above it could not; the job would always be red. The result is
that the backend's own tests have never run in CI.

### B4 — The suite is silent on a feature that is wholly broken

Our F1 finding (see `p1a/traceability/p1a_claude_traceability.md`): shopping-list
sharing has no ownership check (`api/shopping-lists/share/route.ts:15-31`), returns a
link to `/share/shopping/<token>` for which no route exists in the build manifest,
and is called by nothing in the interface. The inherited suite has no test for it,
which is consistent — but it means the suite cannot tell a maintainer that an
entire documented feature is dead.

### B5 — The suite never proves the product builds

No workflow under `.github/workflows/` runs `npm run build`. Following `INSTALL.md`
exactly, the build fails: `Failed to collect page data for /api/achievements`,
`supabaseKey is required`. `SUPABASE_SERVICE_ROLE_KEY` is read by the code but
documented in neither `INSTALL.md` nor `web/.env.example`. A suite of 1095 green
unit tests coexists with a product that a new contributor cannot compile.

## Verdict

The inherited tests are **broad at the component layer and thin at the boundary**.
They answer "does this component render and this helper compute" very well, and
"does a user goal complete end to end" hardly at all. Coverage of our twenty use
cases is real for the inventory and gamification workflows, partial for nutrition,
and effectively absent for recipe browsing, recipe detail, and AI meal planning —
the three the product markets itself on.

The most useful single sentence for the next maintainer: **the green badge covers
the frontend unit tests and nothing else.** The production build is never built in
CI, the backend suite is never run in CI and cannot pass if it were, and the
end-to-end suite needs credentials no contributor is given.
