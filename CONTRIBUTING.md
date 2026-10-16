# Contributing Guide

Thank you for your interest in contributing to **Epicourier-Web**!
This document provides a quick overview of how to contribute.
For the complete workflow, please read our detailed
[Git Branching, Merging, and Release Convention](https://github.com/epicourier-team/Epicourier-Web/wiki/Git-Branching,-Merging,-and-Release-Convention).

## 1. Getting Started

1. **Fork** the repository on GitHub.
2. **Clone** your fork:

   ```bash
   git clone https://github.com/<your-username>/Epicourier-Web.git
   cd Epicourier-Web
   ```

3. Set the upstream remote:

   ```bash
   git remote add upstream https://github.com/epicourier-team/Epicourier-Web.git
   ```

## 2. Branch Naming

Follow our naming convention:

```
<issue-number>-<type>/<short-description>
```

For large, multi-domain features:

```
<issue-number>-<type>/<short-description>/<domain>
```

Examples:

- `123-feature/add-login-api`
- `123-feature/add-login-api/backend`
- `145-hotfix/fix-token-expiration`

For a full explanation, see the
[Branching Convention Wiki](https://github.com/epicourier-team/Epicourier-Web/wiki/Git-Branching,-Merging,-and-Release-Convention).

## 3. Making Changes

1. Create a new branch from `main`:

   ```bash
   git checkout main
   git pull
   git checkout -b 123-feature/add-login-api
   ```

2. Make your changes and commit with a
   [Conventional Commit message](https://www.conventionalcommits.org/en/v1.0.0/):

   ```
   feat: add login API for user authentication
   ```

3. Run tests before submitting:

   ```bash
   npm run test
   ```

## 4. Submitting a Pull Request

1. Push your branch to your fork:

   ```bash
   git push origin 123-feature/add-login-api
   ```

2. Open a **Pull Request** to the corresponding branch:

   - Typically → `main`
   - For multi-domain work → parent feature branch (e.g., `123-feature/add-login-api`)

3. Include in the PR:

   - A short **summary** of the change
   - `Fixes #<issue-number>` in the description
   - **How you tested** the change (commands, screenshots, logs)
   - Any specific notes for reviewers

4. Request **at least two reviewers**.
5. Merge only through **GitHub UI → “Create a merge commit”**
   (no squash/rebase).

## 5. Main Branch Rules

- No direct commits or pushes
- No local merges into `main`
- 2 reviewer approvals required
- CI checks must pass before merging

These rules are enforced via **Branch Protection Settings**.

## 6. Run and Test Locally

```bash
npm install
npm run dev:full
npm run test
```

## 7. Local Supabase Development

We use a local Supabase instance for development and testing.

### Setup & Run

1. **Start Supabase**:

   ```bash
   supabase start
   ```

   This will spin up the local database, auth, and other services.

2. **Stop Supabase**:

   ```bash
   supabase stop
   ```

3. **Reset Database** (Apply migrations & seed data):
   ```bash
   supabase db reset
   ```

### Migrations

- **Create a migration**:
  ```bash
  supabase db diff -f <migration_name>
  ```
- **Apply migrations**:
  Automatically applied when running `start` or `db reset`.

---

## Coding standards

Every one of these is enforced in CI, so a pull request that ignores them goes red rather than
through review. The config file is the authority; this section says what it means and why.

| Area | Tool | Config | Run it locally |
|---|---|---|---|
| TypeScript style | ESLint | `web/eslint.config.mjs` | `cd web && npx eslint .` |
| TypeScript formatting | Prettier | `web/.prettierrc` | `cd web && npx prettier --check .` |
| TypeScript types | `tsc --strict` | `web/tsconfig.json` | `cd web && npx next typegen && npx tsc --noEmit` |
| Python lint and format | Ruff | `backend/pyproject.toml` | `cd backend && uv run ruff check . && uv run ruff format --check .` |

Two things that are easy to get wrong:

- **`npx tsc --noEmit` needs `next typegen` first.** `next-env.d.ts` is gitignored, so a fresh
  checkout has no ambient declarations for image imports and the check fails for a reason that has
  nothing to do with your change.
- **Format only the files you changed.** `npm run format` rewrites the whole web project. A pull
  request carrying a repository-wide reformat is unreviewable and will be asked to split.

## How to extend the system safely

### The contract comes first

`p2/contracts/receipt-v1.md` is frozen, and the JSON schema beside it sets `additionalProperties:
false` on every definition. That is deliberate: a consumer that invents a field fails a test instead
of quietly diverging from the other three modules.

So if your change needs a field that is not in the contract, the order is:

1. open an issue describing the field and why;
2. merge a contract pull request — the prose, the JSON schema and `web/src/types/receipt.ts`
   together, with the Python models in step;
3. only then change the producer or the consumer.

Changing a consumer first works on your machine and breaks the moment someone else's module reads
the same payload.

### Rules the scorer must keep

These are the ones that look like details and are not. Each is covered by a test that fails if you
break it:

- **A requirement of `0` means zero.** Never substitute a default for it. `(value || 100)` does
  exactly that and is a live defect in `web/src/app/api/nutrients/daily/route.ts:171`.
- **Missing data is unknown, not zero.** An ingredient with no nutrient figures is
  `unknown_requirement`, never 0 g of protein.
- **Expired stock is unusable, and the boundary is exclusive.** A row expiring *on* `as_of_date` is
  still usable; only strictly earlier is expired.
- **Usable quantity sums across locations.** The unique constraint is
  `(user_id, ingredient_id, location)`, so one ingredient legitimately appears several times. Reading
  the first matching row is a bug that only shows up when the array order changes.
- **`sum(items[].points)` equals `rank_score` exactly.** Round once, at the end. A receipt that does
  not add up is not a receipt.
- **Never derive a date from the local clock.** `as_of_date` is supplied. Fixtures use `2026-10-10`.

### Writing a test that is worth having

- **Do not compute an expected value with the function under test.** It will pass forever and prove
  nothing. Hand-compute it, or derive it from the contract.
- **Make sure your test can fail.** Break the thing on purpose once and watch it go red before you
  commit. `p2/eval/cases/corrupted.json` exists for this reason, and CI asserts that it is still
  rejected.
- **No clock, no network, no key.** `python3 p2/eval/run_eval.py` runs with none of the three. A test
  that needs a real service belongs in a separate, clearly marked job.

### Before you open a pull request

```bash
python3 p2/eval/run_eval.py                       # M0, no install needed
cd web && npx next typegen && npx tsc --noEmit && npm test
```

Base your branch on the current integration branch and select it by hand when opening the pull
request — the repository default points elsewhere.
