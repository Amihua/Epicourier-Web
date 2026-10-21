# Epicourier-Web 🍽️

[![Web CI](https://github.com/Amihua/Epicourier-Web/actions/workflows/ci-jest.yml/badge.svg?branch=se26f-p2)](https://github.com/Amihua/Epicourier-Web/actions/workflows/ci-jest.yml)
[![Backend CI](https://github.com/Amihua/Epicourier-Web/actions/workflows/ci-pytest.yml/badge.svg?branch=se26f-p2)](https://github.com/Amihua/Epicourier-Web/actions/workflows/ci-pytest.yml)
[![M0 Evaluation](https://github.com/Amihua/Epicourier-Web/actions/workflows/ci-m0-eval.yml/badge.svg?branch=se26f-p2)](https://github.com/Amihua/Epicourier-Web/actions/workflows/ci-m0-eval.yml)
[![Docs](https://github.com/Amihua/Epicourier-Web/actions/workflows/ci-docs.yml/badge.svg?branch=se26f-p2)](https://github.com/Amihua/Epicourier-Web/actions/workflows/ci-docs.yml)
[![codecov](https://codecov.io/github/Amihua/Epicourier-Web/branch/se26f-p2/graph/badge.svg)](https://codecov.io/github/Amihua/Epicourier-Web)
[![Tests](https://img.shields.io/badge/tests-1578%20passing-brightgreen)](#testing)
[![Test share](https://img.shields.io/badge/test%20code-50.1%25%20of%20repo-brightgreen)](#testing)
[![ESLint](https://img.shields.io/badge/style-ESLint-4B32C3?logo=eslint&logoColor=white)](web/eslint.config.mjs)
[![Prettier](https://img.shields.io/badge/format-Prettier-F7B93E?logo=prettier&logoColor=black)](web/.prettierrc)
[![Ruff](https://img.shields.io/badge/python-Ruff-D7FF64?logo=ruff&logoColor=black)](backend/pyproject.toml)
[![TypeScript](https://img.shields.io/badge/types-tsc%20strict-3178C6?logo=typescript&logoColor=white)](web/tsconfig.json)
[![DOI](https://zenodo.org/badge/DOI/10.5281/zenodo.17537732.svg)](https://doi.org/10.5281/zenodo.17537732)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE.md)

[![Teaser — 28 s](https://img.youtube.com/vi/lIJQWOqHnvw/maxresdefault.jpg)](https://youtu.be/lIJQWOqHnvw)

<sub>▶ **Teaser, 28 seconds** — <https://youtu.be/lIJQWOqHnvw></sub>

**A recipe score you can add up yourself.**

Epicourier recommends recipes from what is already in your kitchen. Until now the match score was written by a language model, and nobody could check it. This branch replaces that number with a **receipt**: one line per pantry item, the points each line earned, and a total that is exactly their sum. Disagree with a line? Correct it, and the ranking moves the way the rules say it should.

📖 **Docs site:** <https://amihua.github.io/Epicourier-Web/>
🎬 **Feature walk-through (3 min 41 s):** <https://youtu.be/NPHCkjngmlo>

---

## Try it in one minute

No install, no API key, no database:

```bash
git clone https://github.com/Amihua/Epicourier-Web.git
cd Epicourier-Web
python3 p2/eval/run_eval.py
```

You should see the three M0 claims checked against their thresholds and a final `PASS`.
[Guide: run the evaluation](docs/guides/01-run-the-evaluation.md)

---

## What Project 2 built

Four merged milestones, each built against one frozen contract ([`receipt-v1`](p2/contracts/receipt-v1.md)) so four people could work in parallel.

| | Milestone | What it delivers | Owner | PRs |
|---|---|---|---|---|
| **M0** | Contract and evaluation | Frozen JSON contract, 500-cell corpus, offline harness in CI that scores against hand-written expectations | Wenbo Li | [#20](https://github.com/Amihua/Epicourier-Web/pull/20), [#25](https://github.com/Amihua/Epicourier-Web/pull/25) |
| **M1** | Deterministic scorer | Pure Python function from pantry + recipe to receipt, with boundary, mutation and differential tests | Sihao Liu | [#23](https://github.com/Amihua/Epicourier-Web/pull/23), [#24](https://github.com/Amihua/Epicourier-Web/pull/24) |
| **M2** | Receipt panel | Expand a recommendation to see its lines, correct an item, watch the list re-rank; corrections persist | Feiyang Zheng | [#22](https://github.com/Amihua/Epicourier-Web/pull/22) |
| **M3** | Shopping from the gap | Preview exactly what is missing, confirm once; a replayed request applies only once | Andy | [#21](https://github.com/Amihua/Epicourier-Web/pull/21) |

### M0: the risk-killer eval

The product rides on one claim: the ranking can be made **reproducible and auditable**. M0 tests it before anything else was built. Full statement in [`p2/eval/HYPOTHESIS.md`](p2/eval/HYPOTHESIS.md).

| | Claim | Threshold | Result | Old recommender |
|---|---|---|---|---|
| **H1** | Every displayed total is the sum of its displayed parts | 100% | **500/500** | 0/300 (its schema cannot decompose a score) |
| **H2** | The same pantry gives the same answer (20 shuffles per cell) | 100% | **25/25** | not collected yet (needs 30 live model calls) |
| **H3** | A correction moves the score the way the rules predict | 4/4 | **4/4** | no correction loop exists |

The harness also carries a case with four planted defects, and CI checks that it is **rejected** on every run. So the eval can fail, and a green badge means it can still see a broken receipt.

---

## Testing

| Suite | Count | Run it |
|---|---:|---|
| Web (Jest) | 1,503 passing (+1 skipped) | `cd web && npm install && npx jest` |
| Backend (pytest) | 75 passing | `cd backend && uv sync && uv run pytest tests/p2` |
| M0 evaluation | 5 checks | `python3 p2/eval/run_eval.py` |

These are executed tests, not a count of `it(`/`test(` declarations. Jest was re-run on
`se26f-p2` at `d9910a1` (2026-10-21); earlier CI runs: [Jest](https://github.com/Amihua/Epicourier-Web/actions/runs/39575674199)
and [pytest](https://github.com/Amihua/Epicourier-Web/actions/runs/39575660777). The skipped Jest
suite is `supabaseConnection.test.ts`, which needs a live database.

Test code is 50.1% of the code base (30,217 test lines against 30,108 product lines). Every push to `se26f-p2` runs all of it in [GitHub Actions](https://github.com/Amihua/Epicourier-Web/actions), plus Ruff, `tsc --noEmit`, and a check that the generated docs are current.

---

## Documentation

| | |
|---|---|
| **Why** | [Why this project exists](docs/WHY.md) |
| **How** | [Run the evaluation](docs/guides/01-run-the-evaluation.md) · [Add a scoring rule](docs/guides/02-add-a-scoring-rule.md) · [Change the contract](docs/guides/03-change-the-contract.md) · [Local setup](docs/guides/04-local-setup.md) |
| **What** | [Backend API](docs/api/backend/) (from docstrings) · [Web types](https://amihua.github.io/Epicourier-Web/api/web/) (TypeDoc) |
| **Contribute** | [INSTALL.md](INSTALL.md) · [CONTRIBUTING.md](CONTRIBUTING.md) · [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) · [THIRD_PARTY_LIBRARIES.md](THIRD_PARTY_LIBRARIES.md) |
| **AI use** | [AGENT-PLAN/](AGENT-PLAN/) · prompt and model comparisons in [`p1b/prompts/`](p1b/prompts/) · [.coderabbit.yaml](.coderabbit.yaml) |

Browse it all as a site: <https://amihua.github.io/Epicourier-Web/>

---

## Tech stack

| | Web app | Backend |
|---|---|---|
| Language | TypeScript | Python 3.11 |
| Framework | Next.js, Tailwind CSS | FastAPI |
| Data | Supabase (PostgreSQL) | Supabase, Google Gemini, Hugging Face |
| Tests | Jest, Testing Library | pytest, Hypothesis |
| Quality | ESLint, Prettier, `tsc` strict | Ruff (lint + format) |

---

## Where this came from

Epicourier was started by the Fall '25 CSC 510 team ([sdxshuai/Epicourier-Web](https://github.com/sdxshuai/Epicourier-Web)), who built the meal planning, nutrition dashboard, gamification and inventory features. This fork, by the Fall '26 team, adds the receipt-based ranking described above. Their original demo: [youtu.be/qbFYmMTnb5M](https://youtu.be/qbFYmMTnb5M).

The DOI above is the original project's Zenodo record. If you use this work, please cite:

> Epicourier Team. (2025). _Epicourier-Web_ [Computer software]. Zenodo. <https://doi.org/10.5281/zenodo.17537732>

## License

[MIT](LICENSE.md)
