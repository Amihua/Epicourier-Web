# Installation Guide

What you can run depends on what you have. This page goes from "nothing installed" to the full app.
For more detail on each step, see [docs/guides/04-local-setup.md](docs/guides/04-local-setup.md).

## Requirements

| To run | You need |
|---|---|
| The M0 evaluation | Python 3.9+ only. No packages, no keys, no network. |
| The web app and its tests | Node.js **20+** and npm |
| The backend and its tests | Python **3.11** and [uv](https://docs.astral.sh/uv/) |
| The full application | All of the above, a Supabase project, and a Google Gemini API key |

## Clone the repository

```bash
git clone https://github.com/Amihua/Epicourier-Web.git
cd Epicourier-Web
git checkout se26f-p2
```

If you plan to contribute, fork the repository first and clone your fork. See
[CONTRIBUTING.md](CONTRIBUTING.md).

---

## 1. Run the evaluation (no install)

```bash
python3 p2/eval/run_eval.py
```

You should see the three M0 claims checked against their thresholds and a final `PASS`.

---

## 2. Web app

### Install

```bash
cd web
npm install          # not `npm ci`: the lock file is missing @swc/core platform binaries under npm 11+
npx next typegen     # creates next-env.d.ts, which is gitignored; tsc fails without it
```

### Environment variables

```bash
cp .env.example .env.local
```

Edit `web/.env.local`:

| Variable | Description | Required |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anonymous key | Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key. `next build` fails without it | Yes |
| `NEXT_PUBLIC_VAPID_PUBLIC_KEY` | VAPID public key for push notifications | Yes, for `next build` |
| `VAPID_PRIVATE_KEY` | VAPID private key | Yes, for `next build` |
| `VAPID_SUBJECT` | Contact, e.g. `mailto:you@example.com` | Yes, for `next build` |
| `BACKEND_URL` | Where the FastAPI backend runs. Default `http://localhost:8000` | No |
| `RECEIPT_INTERNAL_TOKEN` | Shared secret with the backend. Must match the backend value if set | No |

Generate a VAPID key pair with:

```bash
npx web-push generate-vapid-keys
```

### Run the tests

```bash
npx tsc --noEmit
npm test
```

---

## 3. Backend

> **The backend will not start without a Gemini key.** `api/recommender.py` creates the Gemini
> client when it is imported, so a missing `GEMINI_KEY` fails at startup, not at the first request.

### Install

```bash
cd backend
uv sync
```

### Environment variables

The backend reads `backend/.env` through `python-dotenv`, relative to the directory you start it
in. Create `backend/.env`:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
GEMINI_KEY=your_google_gemini_api_key
# Optional: if set, the web app must send the same value
# RECEIPT_INTERNAL_TOKEN=some_shared_secret
```

Get a Gemini key at <https://aistudio.google.com/apikey>.

### Run the tests

```bash
uv run pytest tests/p2
```

`tests/p2` runs without any key. The older suites (`tests/test_recommender.py`,
`tests/test_inventory_recommender.py`) need `GEMINI_KEY` set, for the reason above.

---

## 4. Start the application

From `web/`:

```bash
npm run dev:full     # frontend and backend together
npm run dev          # frontend only, http://localhost:3000
```

`npm run dev:backend` (and therefore `dev:full`) calls `make dev` in `backend/`. On a machine without
`make` (plain Windows), start the backend directly in a second terminal instead:

```bash
cd backend
uv run uvicorn api.index:app --reload --host 0.0.0.0 --port 8000
```

---

## Troubleshooting

| Symptom | Cause and fix |
|---|---|
| `npm ci` fails with missing `@swc/core` binaries | Use `npm install`. |
| `tsc` errors on image imports in landing components | Run `npx next typegen` first. |
| Backend exits at startup mentioning Gemini or an API key | `GEMINI_KEY` is missing from `backend/.env`. |
| `make: arch: command not found` | You are not on Apple Silicon. Use the `uvicorn` command above. |
| `next build` fails during page-data collection | `SUPABASE_SERVICE_ROLE_KEY` or a VAPID variable is missing from `web/.env.local`. |
