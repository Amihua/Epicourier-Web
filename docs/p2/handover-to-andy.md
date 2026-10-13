# Handover to Andy — integration, merge queue, and what the contract already fixes for M3

**From:** Wenbo Li (M0, contracts, CI) · **Written:** 2026-10-10 · **Branch:** `se26f-p2`

Everything below was checked against the repository or the GitHub API today. Where something
contradicts the team plan, this says so and names the evidence, because the plan's own repository
observations were written from a different branch state.

---

## 1. `se26f-p2` exists, and here is its start point

```
se26f-p2  =  810020ff454ed3c0f32d968a56da2ec69fd816b5
             "Merge pull request #19 from Amihua/p1b-wenbo"  (tip of se26f-p1b)
```

The plan asks that whoever creates the branch record the start branch and SHA. That is the record.

Why `se26f-p1b` rather than anything else, checked rather than assumed:

| Candidate | Contained in `se26f-p1b`? |
|---|---|
| `feature/comments` | yes — fully merged |
| `p1b-wenbo` | yes — PR #19 merged 2026-09-16 |
| `main` | **no**, but the only thing it carries beyond `se26f-p1b` is `p1a/evidence/1788367947780.jpg` |

So nothing of substance was left behind, and no old branch was blindly merged in.

---

## 2. Two repository settings still need you

| Setting | Current state, from the GitHub API today | Plan item |
|---|---|---|
| **Issues** | `has_issues: false` — still disabled | the plan assigns enabling Issues to you |
| **Branch protection on `se26f-p2`** | none; `GET /branches/se26f-p2/protection` returns 404 | the plan suggests requiring a PR, one peer review, and CI passing |

I cannot do either: my repository permissions are `push` and `triage`, with `admin: false` and
`maintain: false`. Both need an admin.

If the account or plan cannot enforce the branch rule, the plan's fallback applies — the manual merge
queue you are running anyway.

### A correction to the plan, and it matters for PR bases

The plan records the default branch as `feature/comments`, and **that is correct**. I told the team
earlier that it was `main`; I was reading the local `origin/HEAD` cache, which is stale. The
authoritative value from the API is:

```
default_branch: feature/comments
```

The plan's conclusion is unaffected and worth repeating to everyone: **choose `se26f-p2` as the PR
base by hand.** The default will not do it for you, and it points somewhere we are not working.

---

## 3. CI now runs on `se26f-p2`. Here is exactly what, and what it needs

Before this branch, nothing ran on the integration branch at all: `ci-pytest.yml` triggered only on
PRs targeting `main`, and `ci-jest.yml`'s push trigger was `main` only.

| Workflow | Triggers now | Gates |
|---|---|---|
| `ci-pytest.yml` | push to `se26f-p2`, PRs to `main`/`se26f-p2` | Ruff lint (unchanged) **+ a pytest job that actually runs pytest** |
| `ci-jest.yml` | push to `se26f-p2`, PRs | `next typegen` → `tsc --noEmit` → Jest → coverage |
| `ci-m0-eval.yml` | push to `se26f-p2`, PRs | contract JSON well-formed, M0 passes, corrupted case still rejected |

Path filters on all three include `p2/contracts/**` and `p2/eval/**`.

All four jobs are green on PR #20 as of this writing: M0 6s, Pytest 50s, lint 48s, test 2m27s.

### Secrets the workflows reference

```
CODECOV_TOKEN
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
```

These are already wired for the web job. **The new pytest job deliberately does not use them**: it
supplies obvious placeholders instead, because the two module-level clients only need to be
constructible, not connected. If you later add a job that does a real database round trip for M3,
that is the job that needs the real secrets, and it should be separate so it can be skipped when they
are absent.

---

## 4. The schema facts your task 2 asks you to verify — already verified

The plan tells you to confirm the meaning of `relative_unit_100`, `Ingredient.unit`, `servings` and
the nutrient units before building the pantry delta, and warns that the existing conversion code is a
lead rather than a fact. I had to settle the same questions to freeze the contract. Here is what the
schema actually says, so you can start from it rather than repeat the work. Re-check anything you
intend to lean on.

### `relative_unit_100` — and a live defect in the two call sites

It is the required quantity in the ingredient's own unit, against which the `Ingredient` nutrient
columns are stated per 100. Both existing call sites agree on that and **disagree on null handling**:

```ts
const ratio = (map.relative_unit_100 ?? 100) / 100;   // web/src/app/api/nutrients/tracking.ts:90
const ratio = (map.relative_unit_100 || 100) / 100;   // web/src/app/api/nutrients/daily/route.ts:171
```

`||` substitutes for `0` as well as for null, so **a recipe that requires zero of an ingredient is
read as requiring 100 units of it.** The contract states that `0` means zero and `null` means
unknown. The golden fixture carries a `0` requirement precisely so that a delta calculation copying
that line fails a test instead of shipping.

This one is not mine to fix — it is in the nutrient code path — but it will bite the delta if you
reuse the idiom.

### `servings` does not exist

`Recipe` has no `servings` column: `created_at, description, green_score, id, image_url,
min_prep_time, name, owner_id, updated_at`. The plan lists `servings` in both the ranking input and
the preview input. **Open decision D1**, proposal in the contract: a caller-supplied integer
multiplier defaulting to 1 that scales requirements only. Your `PreviewRequest` carries it under the
same rule.

### `user_inventory.unit` is nullable; `Ingredient.unit` is not

From `supabase/migrations/20251129030000_user_inventory.sql`:

```sql
quantity  DECIMAL(10,2) NOT NULL DEFAULT 1,
unit      VARCHAR(50),                       -- nullable
location  VARCHAR(50) NOT NULL DEFAULT 'pantry' CHECK (location IN ('pantry','fridge','freezer','other')),
expiration_date DATE,
CONSTRAINT unique_user_ingredient_location UNIQUE (user_id, ingredient_id, location)
```

**Open decision D2**, proposal: do not fall back to `Ingredient.unit`. Return the line as
`unresolved_unit` and refuse to subtract. The plan's own acceptance criterion for you says a missing
or unconvertible unit must produce an explicit unresolved item rather than a bare subtraction, so the
proposal is the plan's rule written into the type.

### The unique constraint is per location, and the delta has to sum

`UNIQUE (user_id, ingredient_id, location)` means one ingredient legitimately appears in several
rows — pantry, fridge, freezer — each with its own expiry date. Usable quantity for a delta is the
**sum across those rows**, excluding expired ones. The golden fixture has ingredient 11 in two
locations totalling 350 g against a 500 g requirement for exactly this reason: a calculation that
takes the first matching row returns 200 or 150 depending on array order, and M0's 20 shuffles catch
it.

It also means there are **no per-purchase lots**, which is why the receipt promises a named item with
a date and not a batch.

### `user_inventory` is missing from the generated types — your file

`web/src/types/supabase.ts` contains `achievement_definitions`, `Calendar`, `challenges`,
`Ingredient`, `nutrient_goals`, `nutrient_tracking`, `Recipe`, the three map tables, `RecipeTag`,
`streak_history`, `User`, `user_achievements`, `user_challenges` — and **no `user_inventory`**, even
though the migration creates it.

The generated types are stale. Regenerating them is your file in the ownership table. Until then the
inventory types in `web/src/types/receipt.ts` are hand-written from the migration and say so.

---

## 5. What is frozen for M3, and where

Your preview and confirm shapes are in `p2/contracts/receipt-v1.md` §7, with the machine-checkable
form in `receipt-v1.schema.json` and the TypeScript in `web/src/types/receipt.ts`:

```
PreviewRequest  { recipe_id, servings?, list_id }
PreviewResponse { preview_id, snapshot_id, deltas[], unresolved[] }
ConfirmRequest  { preview_id, request_id }
ConfirmResponse { status: "applied"|"stale"|"failed", written[], skipped[] }
```

Four things the contract fixes that your acceptance criteria also demand, so the type and the
criterion cannot drift apart:

- `missing = max(required - available_usable, 0)`, and `available_usable` **excludes expired rows**;
- a confirm against a changed inventory returns `status: "stale"` and **writes nothing**, rather than
  silently writing something different from the preview;
- `request_id` is the idempotency key, enforced in the database — the contract says in the database
  precisely because an in-memory guard does not survive concurrency or multiple instances;
- a partial write reports `failed`. Returning `applied` for a partial write is prohibited.

`deltas[].missing_qty` is `exclusiveMinimum: 0`: a zero delta is not a line, it is an absence. If you
want zero rows to appear in the UI, that is a contract change rather than a producer choice.

**Every definition in the schema is `additionalProperties: false`,** and a test asserts it. If your
route needs a field that is not there, the contract PR comes first — that is the whole point, and it
is one small PR, not a negotiation.

---

## 6. For the merge queue

- **PR #20** (`p2_wenbo` → `se26f-p2`) is the contract and CI PR. The plan's queue has contract,
  shared types and minimum CI merging first, so this is the one to take before the module PRs.
- After it merges, the other three can branch from `se26f-p2` and their PRs will be checked by CI
  that actually runs something.
- **D1 and D2 need four-way sign-off** before Sihao's scorer and your delta harden around either
  answer. They are the only two places the contract does not yet freeze.

### Known gaps I am not hiding in a corner

| Gap | Why it is still open |
|---|---|
| `ci-pytest.yml`'s `lint` job keeps **three `continue-on-error` flags** | Removing them blind would red-light every PR if the tree has Ruff violations. `uv` is not installed on my machine to measure first. Needs one measured run. |
| The pytest job is scoped to `backend/tests/p2` | `api/recommender.py:121` runs `client = load_gemini_client()` at import, so three test directories fail at collection. The fix is that one line made lazy, in the backend owner's file. A CI step attempts full-suite collection on every run and uploads the log, so the claim is re-proved rather than asserted. |
| `npm ci` cannot install the committed lock file | Missing `@swc/core` platform binaries under npm 11+. CI uses `npm install`. Regenerating the lock is my file and is not done. |
| Baseline `X`, the cross-repeat variance | **NOT COLLECTED.** It needs 30 live model calls that have not been made. Not estimated, not inherited from the P1b report. `0/300` is separate and is definitional — the response model has no per-ingredient field at all, so it is verified by reading the schema. |
