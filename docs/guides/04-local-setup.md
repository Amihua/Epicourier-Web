# Set up locally

What you can run depends on what you have. This page is ordered by how little you need.

## Nothing at all

```bash
python3 p2/eval/run_eval.py
```

The evaluation is dependency-free on purpose — no package install, no key, no network — so it still
works when the rest of the stack cannot be installed. Same for the documentation build:

```bash
python3 docs/generate_backend_api.py --check
```

## Node, for the web suite

```bash
cd web
npm install          # NOT npm ci — see below
npx next typegen     # generates next-env.d.ts, which is gitignored
npx tsc --noEmit
npm test
```

Two things that bite everyone once:

- **`npm ci` fails on this lock file** under npm 11+: the committed lock is missing the `@swc/core`
  platform binaries. Use `npm install` until the lock is regenerated.
- **`tsc` without `next typegen` first** fails on image imports in three landing components, because
  `next-env.d.ts` is gitignored and a fresh checkout does not have it. The error looks unrelated to
  your change.

## Node plus credentials, for the application

`web/.env.local` needs, at minimum:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

The third is not optional and was missing from `.env.example` until recently. Several route modules
construct a Supabase client at **import** time, so a build fails at page-data collection without it,
with an error that names a route rather than the variable.

A build also needs a real VAPID pair, because `api/achievements/check` calls `setVapidDetails` at
import and the library rejects any public key that is not 65 bytes decoded:

```bash
npx web-push generate-vapid-keys
```

Then:

```bash
cd web && npm run dev:full
```

## Python, for the backend

```bash
brew install uv
cd backend && uv run pytest tests/p2 -q
```

`tests/p2` and not the whole suite, and that is a limitation rather than a preference.
`api/recommender.py:121` runs `client = load_gemini_client()` at module level, so importing anything
that reaches it — `tests/test_recommender.py`, `tests/test_inventory_recommender.py`, everything
under `tests/sihao/` — fails at **collection** without a model key.

CI works around it with a placeholder key. The real fix is one line made lazy, and it is tracked in
`docs/p2/evaluation.md`.

## What still will not run

The old recommender endpoint needs a real model key, so the baseline measurement in `p2/baseline/`
reports `not_collected` rather than a number. That is deliberate: the script refuses to invent a
figure it could not measure.
