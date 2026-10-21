# Project 2: Repo Rubric (self-assessed)

- **Project:** Epicourier, receipt-based recipe ranking
- **Repository:** <https://github.com/Amihua/Epicourier-Web> (branch `se26f-p2`)
- **Docs site:** <https://amihua.github.io/Epicourier-Web/>
- **Team:** Yichen (Andy) Yu, Wenbo Li, Sihao Liu, Feiyang Zheng
- **Measured:** 2026-10-21 at commit `d9910a1`
- **Scale:** 0 = none, 1 = a little, 2 = somewhat, 3 = a lot

Every score is the one the linked evidence supports. Commit counts cover our own P2 work since
2026-10-10 only; most of the 600+ commits in the history belong to the Fall '25 team whose project we
forked. Detailed reasoning for each row: [`p2/rubric/self-assessment.md`](https://github.com/Amihua/Epicourier-Web/blob/se26f-p2/p2/rubric/self-assessment.md).

## Teamwork, visible in GitHub

| Item | Evidence | Score 0-3 |
|---|---|:-:|
| Many commits: hundreds by the end is normal for teams that commit small | [Commits on se26f-p2](https://github.com/Amihua/Epicourier-Web/commits/se26f-p2): 147 commits since 2026-10-10 (no merges), in small units | 3 |
| Commits come from different people | [Contributors](https://github.com/Amihua/Epicourier-Web/graphs/contributors): all four members committed in P2 (77 / 39 / 25 / 5, no merges) | 3 |
| Workload is spread over the whole team | Same graph. Three members are close by volume of work; the fourth is well behind by commit count | 2 |
| Team members work across many parts of the code, not one silo each | [Merged PRs](https://github.com/Amihua/Epicourier-Web/pulls?q=is%3Apr+is%3Amerged): three members touched `backend`, `web`, `docs`, `p2`, `.github` or `supabase`; one stayed in `web` | 2 |
| Short release cycles: frequent small commits, merged promptly | [Merged PRs](https://github.com/Amihua/Epicourier-Web/pulls?q=is%3Apr+is%3Amerged): 12 PRs merged, #34 to #39 each within 30 minutes of opening | 3 |
| Whole team uses the same tools: config files in the repo, updated by many different people | [`ci-jest.yml` history](https://github.com/Amihua/Epicourier-Web/commits/se26f-p2/.github/workflows/ci-jest.yml), `web/tsconfig.json`, `web/eslint.config.mjs`, `web/.prettierrc`, `backend/pyproject.toml`: edited by three of four members | 2 |
| Whole team can run the system | Demo. The M0 eval and both test suites run on any machine with no key; the full app needs Supabase and Gemini credentials not yet set up on every machine | 1 |
| **Subtotal** | | **16 / 21** |

## Issues and discussion

| Item | Evidence | Score 0-3 |
|---|---|:-:|
| Issue reports: there are many | [Issues](https://github.com/Amihua/Epicourier-Web/issues?q=is%3Aissue): 6 filed by three accounts, one from outside the team | 1 |
| Issues are being closed | [Closed issues](https://github.com/Amihua/Epicourier-Web/issues?q=is%3Aissue+is%3Aclosed): 5 of 6 closed, each by a linked PR (#34 to #39) | 2 |
| Issues are discussed before they are closed | Every closed issue carries a summary of the discussion and the decision, e.g. [#29](https://github.com/Amihua/Epicourier-Web/issues/29), [#32](https://github.com/Amihua/Epicourier-Web/issues/32). Much of the talk happened in chat and PRs, so these are summaries added afterwards | 2 |
| A large share of issues relate to handling failing cases | 5 of 6 are failing cases with a reproduction, e.g. [#29](https://github.com/Amihua/Epicourier-Web/issues/29) `make dev` fails on Linux, [#33](https://github.com/Amihua/Epicourier-Web/issues/33) 267 of 448 units never resolve | 3 |
| Chat channel / discussion forum exists and is active; the poster QR points at it | [Discussions](https://github.com/Amihua/Epicourier-Web/discussions): pinned start-here thread and a Project 3 thread; poster QR points here | 2 |
| **Subtotal** | | **10 / 15** |

## Tests

| Item | Evidence | Score 0-3 |
|---|---|:-:|
| Tests exist: 50 is good, 100 is better; expected cases and failure cases both | [README, Testing](https://github.com/Amihua/Epicourier-Web/tree/se26f-p2#testing): 1,578 tests pass (1,503 Jest plus 1 skipped, 75 pytest). Failure cases are deliberate: [`corrupted.json`](https://github.com/Amihua/Epicourier-Web/blob/se26f-p2/p2/eval/cases/corrupted.json) must be rejected | 3 |
| Tests are a serious share of the code base (30 percent is common) | 50.1%: 30,217 lines of test against 30,108 of product code | 3 |
| Tests run automatically on every commit (CI) | [Actions](https://github.com/Amihua/Epicourier-Web/actions): every push runs Jest, pytest, M0 eval, Ruff, ESLint, Prettier, `tsc` and a docs check | 3 |
| Coverage is measured; the badge shows the number | [Codecov](https://app.codecov.io/github/Amihua/Epicourier-Web): 89.8% of web app lines on `se26f-p2`; README badge shows it | 3 |
| **Subtotal** | | **12 / 12** |

## Docs

| Item | Evidence | Score 0-3 |
|---|---|:-:|
| Docs are generated, and the format is not ugly | [Docs site](https://amihua.github.io/Epicourier-Web/) on GitHub Pages; API reference generated from docstrings and by TypeDoc, CI fails if stale | 3 |
| Docs, the WHAT: point descriptions of each class/function | [Backend API](https://amihua.github.io/Epicourier-Web/api/backend/), [Web types](https://amihua.github.io/Epicourier-Web/api/web/): every public symbol in the P2 modules; inherited code not covered | 2 |
| Docs, the HOW: mini-tutorials with worked examples | [Guides](https://github.com/Amihua/Epicourier-Web/tree/se26f-p2/docs/guides): run the evaluation, add a scoring rule, change the contract, local setup | 3 |
| Docs, the WHY: the docs tell a story | [WHY.md](https://amihua.github.io/Epicourier-Web/WHY.html) and the [docs landing page](https://amihua.github.io/Epicourier-Web/) | 3 |
| Teaser video (12-30 s), prominent at the TOP of README beside the badges | [Teaser, 28 s](https://youtu.be/lIJQWOqHnvw), embedded under the badges | 3 |
| Feature walk-through video (2-5 min), linked in README | [Walk-through, 3 min 41 s](https://youtu.be/NPHCkjngmlo), linked in README and by poster QR | 3 |
| **Subtotal** | | **17 / 18** |

## Standard files and bling

| Item | Evidence | Score 0-3 |
|---|---|:-:|
| README.md: all the badges above, all working when clicked | [README](https://github.com/Amihua/Epicourier-Web/tree/se26f-p2): live badges for web CI, backend CI, M0, docs, coverage, tests, plus style tools and DOI | 3 |
| .gitignore: lists what must not enter the repo | [`.gitignore`](https://github.com/Amihua/Epicourier-Web/blob/se26f-p2/.gitignore): env files, build output, `node_modules`; no secret tracked | 3 |
| INSTALL.md: how to install | [`INSTALL.md`](https://github.com/Amihua/Epicourier-Web/blob/se26f-p2/INSTALL.md): from Python-only eval to full app, every env var, troubleshooting | 3 |
| LICENSE.md: rules of use | [`LICENSE.md`](https://github.com/Amihua/Epicourier-Web/blob/se26f-p2/LICENSE.md): MIT | 3 |
| CODE-OF-CONDUCT.md: rules of behavior | [`CODE_OF_CONDUCT.md`](https://github.com/Amihua/Epicourier-Web/blob/se26f-p2/CODE_OF_CONDUCT.md) | 3 |
| CONTRIBUTING.md: coding standards, plus tips on how to extend without breaking it | [`CONTRIBUTING.md`](https://github.com/Amihua/Epicourier-Web/blob/se26f-p2/CONTRIBUTING.md): standards with the command for each, contract-first extension | 3 |
| Style checker, formatter, syntax checker: config files in repo, badges in README | ESLint, Prettier, Ruff, `tsc`: configs in repo, all four [enforced in CI](https://github.com/Amihua/Epicourier-Web/blob/se26f-p2/.github/workflows/ci-jest.yml), badge for each | 3 |
| DOI badge from Zenodo | [DOI 10.5281/zenodo.17537732](https://doi.org/10.5281/zenodo.17537732): resolves, but it is the upstream project's record, not a release of this fork | 2 |
| THIRD_PARTY_LIBRARIES.md: every dependency, with its license | [`THIRD_PARTY_LIBRARIES.md`](https://github.com/Amihua/Epicourier-Web/blob/se26f-p2/THIRD_PARTY_LIBRARIES.md): all 84 direct dependencies with version and licence | 3 |
| AI use is visible and disclosed, plus evidence a human checked the AI's output | [`p1b/`](https://github.com/Amihua/Epicourier-Web/tree/se26f-p2/p1b) prompts, runs and results for five models; [model disagreements and how they were settled](https://github.com/Amihua/Epicourier-Web/blob/se26f-p2/p1b/result/claude/06-disagreement-with-codex.md); [`AGENT-PLAN/`](https://github.com/Amihua/Epicourier-Web/tree/se26f-p2/AGENT-PLAN); [`.coderabbit.yaml`](https://github.com/Amihua/Epicourier-Web/blob/se26f-p2/.coderabbit.yaml) | 3 |
| **Subtotal** | | **29 / 30** |

## Sum

| Block | Score |
|---|:-:|
| Teamwork | 16 / 21 |
| Issues and discussion | 10 / 15 |
| Tests | 12 / 12 |
| Docs | 17 / 18 |
| Standard files and bling | 29 / 30 |
| **Sum** | **84 / 96** |
