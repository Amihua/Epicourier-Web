# Backend API reference

Generated from source docstrings by `docs/generate_backend_api.py`. Do not edit by hand:
CI regenerates this and fails if it is stale.

The generator reads the source with `ast` and never imports it, because importing anything
that reaches `api/recommender.py:121` builds a model client and fails without a key.

- [`receipt_models.py`](receipt_models.md)
- [`receipt_scorer.py`](receipt_scorer.md)
- [`target_math.py`](target_math.md)
