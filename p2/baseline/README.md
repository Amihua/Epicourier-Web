# Baseline of the old recommender

**Status: (a) derived, (b) NOT COLLECTED.** The script exists so that the measurement is defined and
repeatable now, and so that whoever has a key can produce the number without first reinventing the
method.

## The two figures are different kinds of claim

**(a) Decomposable scores — `0/300`, definitional.**
`InventoryRecommendResponse` returns `RecommendedRecipe` objects with `recipe_id`, `recipe_name`,
`match_score`, two ingredient name lists, and a free-text `reason`. There is no field that can hold a
per-ingredient contribution, so no returned score can decompose into line items. No calls are needed
to establish this, and `run_baseline.py --check-schema-only` re-derives it by reading
`RecommendedRecipe.model_fields` rather than repeating the number — if the schema ever gains such a
field, the script stops reporting 0 instead of going stale.

Denominator, since three versions circulated during P1b: **30 calls / 100 (pantry, rank-position)
cells / up to 300 returned objects.**

**(b) `X`, cross-repeat variance — the real baseline.**
The fraction of cells whose `recipe_id` or `match_score` changes when the identical request is sent
again. It needs 30 live calls and they have not been made.

## Why (b) is not collected

| Requirement | State today |
|---|---|
| A real `GEMINI_KEY` | not available to the maintainer |
| A running backend to call | `api/recommender.py:121` builds the model client at import, so the service cannot start without that key either |
| 10 pantry fixtures in `pantries/` | **not written** — see below |

Nothing here is an estimate. Any report, poster or checkpoint line that needs `X` leaves it blank or
says "not collected".

## To collect it

1. Write ten pantry fixtures into `pantries/P01.json` … `P10.json`, each a valid
   `InventoryRecommendRequest` body, 6–30 inventory rows drawn from
   `backend/dataset/ingredients-supabase.csv`. Per the measurement design each pantry plants at least
   two items within 3 days of expiry, at least two within 7, at least one already expired, and at
   least one with no `expiration_date`. The 500-cell corpus generator
   (`p2/eval/build_corpus.py`) already produces inventories with exactly that shape and can be
   adapted rather than rewritten.
2. Start the backend with a real key.
3. Run it:

   ```bash
   EPICOURIER_BACKEND_URL=http://localhost:8000 GEMINI_KEY=<real key> \
     python3 p2/baseline/run_baseline.py
   ```

4. Commit `baseline-result.json` **and** the raw bodies under `responses/`. The script archives every
   response before computing anything, so the figure can be recomputed and checked against the
   bodies without calling again.
5. Record the commit SHA, the date, the dataset version and the exact command next to the number
   wherever it is quoted.

## What the script will not do

It will not fall back to a cached or estimated value when the key is missing. With no key it reports
`status: "not_collected"` with the reason, and the exit code stays 0 so the offline half remains
usable in CI — the absence is data, not a failure.
