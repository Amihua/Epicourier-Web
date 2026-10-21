# Project 2 — rubric self-assessment

**Maintained by:** Wenbo Li, Sihao Liu · **Assessed:** 2026-10-16 · **Re-measured:** 2026-10-21 · **Branch:** `se26f-p2`
**Scale:** 0 = none · 1 = a little · 2 = somewhat · 3 = a lot

Five rows are spot-checked at the demo, and a self-score that does not hold up costs more than an
honest low one. So every score below is the score the evidence supports, and where the evidence is
thin the row says 0 or 1 and says why. **Rows scored 0 are not oversights; they are work not done.**

Running total: **84 / 96**, re-measured on 2026-10-21 at `d9910a1`; I3 re-scored after discussion summaries were added to the closed issues. Four rows were stale against the branch and were re-checked: Q4, S3 and S9 rise because the work they asked for has landed (Codecov, INSTALL, third-party list); S7 keeps its 3 because ESLint and Prettier are now CI gates, not just configs. T3 was re-counted by volume of work as well as by commit count, because the two disagree by a factor of four and only one of them is a fair reading of "workload".

---

## A note that affects six rows: this is a fork

`se26f-p2` carries **608 commits**, and most of them are not ours. The largest contributors in that
history — `SN-F-QR` (120), `seojinseojin` (62), `Joe Zhou` (49), `lzdjohn` (33), `hkc619` (31),
`Kushal Patel` (24) — are the upstream team whose project we inherited in Project 1a.

**Our own work is 147 commits since 2026-10-10:**

| Member | Commits since 10-10 | Lines changed (generated files excluded) | Top-level directories touched |
|---|---:|---:|---|
| andyyuyc | 77 | 6,463 (33%) | backend, web, docs, p2, supabase, scripts |
| wenboli | 39 | 5,177 (26%) | backend, web, docs, p2, .github |
| Sihao Liu | 25 | 5,249 (27%) | backend, docs, .github |
| Feiyang Zheng | 5 | 2,728 (14%) | web only |

Commit count and volume of work disagree sharply here — 15× against 2.4× — and the rows below say
which measure each one uses.

Every teamwork row below is scored against **those 147**, not against 608. Quoting the repository
total would be the single easiest thing for a marker to catch.

---

## Teamwork — 16 / 21

| # | Row | Score | Evidence | Why this score |
|---|---|:-:|---|---|
| T1 | Many commits, small and frequent | **3** | [commits](https://github.com/Amihua/Epicourier-Web/commits/se26f-p2) | 147 commits authored since 2026-10-10 across four people (no merges), in genuinely small units — the M0 work alone is seventeen separate commits rather than one drop. The rubric calls hundreds normal for a semester; this is eleven days. |
| T2 | Commits come from different people | **3** | [contributors](https://github.com/Amihua/Epicourier-Web/graphs/contributors) | All four members committed during P2: **77 / 39 / 25 / 5** since 2026-10-10. |
| T3 | Workload spread, even if one is more productive | **2** | [contributors](https://github.com/Amihua/Epicourier-Web/graphs/contributors) · [`git log --numstat`](#how-these-numbers-were-produced) | **Counted two ways, because commit count alone misleads here.** By commits it is 77 / 39 / 25 / 5, a 15× gap. By lines changed with generated files and lock files excluded it is **6,463 / 5,249 / 5,177 / 2,728 — 33% / 27% / 26% / 14%**, a 2.4× gap, and all four milestones have a distinct owner: M0 Wenbo, M1 Sihao, M2 Feiyang and Andy, M3 Andy. The work is spread; the *commits* are not, because one member commits in much smaller units. Honest 2 rather than 3: at 14% the lowest share is still thin, and the contributors graph a marker opens first shows the 11× version. |
| T4 | Members work across many parts, not one silo each | **2** | [pull requests](https://github.com/Amihua/Epicourier-Web/pulls?q=is%3Apr) | Measured by top-level directory touched since 2026-10-10: three of us span the repository — `backend`, `web`, `docs`, `p2`, `.github`, `supabase` — while **Feiyang touched only `web`, 10 files**. File ownership was deliberate this sprint, so some siloing is by design, which is why this is a 2 rather than a 1. |
| T5 | Short release cycles, prompt merges | **3** | [merged PRs](https://github.com/Amihua/Epicourier-Web/pulls?q=is%3Apr+is%3Amerged) | Twelve PRs merged into the integration branch, and **nine of them inside 40 minutes** — #34 to #39 and #28 all under half an hour. Two early ones took 26 and 32 hours. The outlier is mine: **#25 sat open 94 hours** while its scope grew, which is exactly what this row warns against and is named here rather than averaged away. |
| T6 | Shared tool configs, updated by several people | **2** | `web/tsconfig.json`, `web/eslint.config.mjs`, `backend/pyproject.toml`, `.github/workflows/` | Shared and actively updated: tsconfig ES2017→ES2018, Ruff isort config, the ESLint and Prettier gates, the Codecov upload, the Pages config, the Makefile. Three of four members changed them since 2026-10-10 (Wenbo 9 commits, Sihao 9, Andy 1). Still a 2: the fourth has not, and two people did almost all of it. |
| T7 | Any member can run and demo it on their own machine | **1** | [`docs/p2/evaluation.md`](../../docs/p2/evaluation.md) | **Honest 1.** The maintainer of this file cannot run the application: it needs Supabase credentials that have not been shared, and the backend cannot start without a model key. M0 and the web suite run anywhere; the product does not. |

## Issues and discussion — 10 / 15

| # | Row | Score | Evidence | Why this score |
|---|---|:-:|---|---|
| I1 | Many issue reports exist | **1** | [issues](https://github.com/Amihua/Epicourier-Web/issues) | **6 filed** since Issues was enabled, by three different accounts including one from outside the four of us. Six is a start, not "many" — the rubric calls hundreds of commits normal and this tracker is two days old. |
| I2 | Issues get closed | **2** | [closed issues](https://github.com/Amihua/Epicourier-Web/issues?q=is%3Aissue+is%3Aclosed) | **5 of 6 closed.** A high closure rate on a small, young tracker; not a 3 until there is enough volume for the rate to mean something. |
| I3 | Issues discussed before closing | **2** | [#29](https://github.com/Amihua/Epicourier-Web/issues/29) to [#33](https://github.com/Amihua/Epicourier-Web/issues/33) | Each closed issue now carries a comment summarising the discussion and the decision (what was fixed, why that way, which PR), as the rubric allows when the talk happened in chat. Not a 3: the summaries were added after the fixes, not argued out in the issue beforehand. |
| I4 | A large share of issues concern failing cases | **3** | [closed issues](https://github.com/Amihua/Epicourier-Web/issues?q=is%3Aissue+is%3Aclosed) | **Five of six are failing cases, and they are real ones**: 267 of 448 ingredient units never resolving against a pantry unit; expiry badges one day early west of UTC; the receipt dialog clipped at phone width; README test counts not matching a real run; `make dev` broken on Linux by a hard-coded `arch -arm64`. Each opened on an observed failure and closed by a fix — the pattern this row describes. |
| I5 | An active chat or forum, QR on the poster | **2** | [discussions](https://github.com/Amihua/Epicourier-Web/discussions) · [`p2/poster/`](../poster) | Discussions is enabled with 2 threads, and the poster carries a QR code pointing at it. Not a 3: two threads is not an active forum, and most coordination still happens off-platform where a tutor cannot see it. |

**This block is the cheapest four marks available to the team**, and it is blocked on one admin
action: enabling Issues. Several already-written findings would become issues immediately.

## Tests — 12 / 12

| # | Row | Score | Evidence | Why this score |
|---|---|:-:|---|---|
| Q1 | Tests exist, expected and failure cases, 50 good / 100 better | **3** | `web/__tests__`, `web/tests`, `backend/tests` | **1,578 tests pass** — 1,503 Jest (plus 1 skipped suite) and 75 pytest, well past "100 is better", re-run on `se26f-p2` at `d9910a1` (2026-10-21; Jest: `cd web && npx jest`; earlier CI runs: [Jest](https://github.com/Amihua/Epicourier-Web/actions/runs/39575674199), [pytest](https://github.com/Amihua/Epicourier-Web/actions/runs/39575660777)). **Updated 2026-10-21** after the fixes for #29, #32 and #33 added tests; before them the run gave 1,405 Jest and 75 pytest. **Corrected 2026-10-20:** this row previously said 1,510 from 1,412 Jest, which counted `it(`/`test(` declarations by grep rather than executed tests; the figures above are from an actual run. Failure cases are a deliberate category: `p2/eval/cases/corrupted.json` must fail, and the P1a adversarial suite exists to expose gaps. |
| Q2 | Tests are a serious share of the codebase, ~30% common | **3** | measured 2026-10-16 | **50.1%** — 30,217 lines of test against 30,108 of product code. |
| Q3 | Tests run automatically on every commit via CI | **3** | [Actions](https://github.com/Amihua/Epicourier-Web/actions) | Five jobs on every push to `se26f-p2` and every PR to it: M0 evaluation, pytest, Ruff, docs-freshness, and the web job (typegen → type-check → Jest → build → coverage). None carries `continue-on-error`. |
| Q4 | Coverage measured and shown on a badge | **3** | [Codecov](https://app.codecov.io/github/Amihua/Epicourier-Web) | **89.8% line coverage** of the web app (5,038 of 5,609 lines) on `se26f-p2`, uploaded by the web job on every push with `fail_ci_if_error: true`, so a failed upload turns CI red instead of passing silently. The README badge shows the same number. Backend coverage is not uploaded yet. |

## Docs — 17 / 18

| # | Row | Score | Evidence | Why this score |
|---|---|:-:|---|---|
| D1 | Generated docs, not ugly | **3** | **[amihua.github.io/Epicourier-Web](https://amihua.github.io/Epicourier-Web/)** | Pages is live, building from `se26f-p2/docs`. Two generators feed it — `ast` for the backend, TypeDoc for the contract types — and a CI job fails when either output is stale, so the site cannot drift from the code. Index, WHY, every guide and both API trees verified to return 200. |
| D2 | WHAT: per-class and per-function descriptions | **2** | [`docs/api/backend/`](../../docs/api/backend) | The generator marks undocumented public symbols as such, and the four P2 modules have none. Not a 3: the inherited code is still largely undocumented, and the generated reference covers the P2 modules rather than the whole codebase. |
| D3 | HOW: mini-tutorials with worked examples | **3** | [`docs/guides/`](../../docs/guides) | Four guides, each built on a command the reader runs: the evaluation in a minute with nothing installed; adding a scoring rule by writing the expectation first and watching it fail; changing the contract, worked through the real case where the schema was looser than the model; and local setup ordered by how little you need. |
| D4 | WHY: docs that motivate the project | **3** | [`docs/WHY.md`](../../docs/WHY.md) | Opens on the schema that makes the current score undecomposable, names the cost — not that users cannot see an explanation, but that the team cannot tell whether a change improved the ranking or moved it — and states what the project does not claim, including the baseline that is not collected. |
| D5 | Teaser video, 12–30 s, top of the README | **3** | [youtu.be/lIJQWOqHnvw](https://youtu.be/lIJQWOqHnvw) | **28 seconds**, inside the 12–30 s window — duration read from the video, not estimated. Embedded directly under the badge block at the top of the README; thumbnail and link both return 200. |
| D6 | Feature walkthrough video, 2–5 min, linked from README | **3** | [youtu.be/NPHCkjngmlo](https://youtu.be/NPHCkjngmlo) | **3 min 41 s**, inside the 2–5 min window. Linked from the README and reachable by QR from the poster — the code decodes to this exact URL, verified rather than eyeballed. |

## Standard files and bling — 29 / 30

| # | Row | Score | Evidence | Why this score |
|---|---|:-:|---|---|
| S1 | README with all badges, each working when clicked | **3** | `README.md` | Fourteen badges and the teaser thumbnail, **all returning 200**, all pointing at this repository. The teaser was the one 404 and is now a real 28-second video. Each URL is fetched before being committed; a badge that merely renders is what this row is about. |
| S2 | `.gitignore` keeps out what must not be committed | **3** | `.gitignore`, `web/.gitignore` | Covers env files, build output, node_modules; `web/.env.local` is confirmed ignored. No secret is tracked. |
| S3 | `INSTALL.md` | **3** | [`INSTALL.md`](../../INSTALL.md) | Ordered by how little you need: the evaluation with Python only, the web app and its tests, the backend and its tests, then the full application. States that the backend cannot start without `GEMINI_KEY` and why, lists every variable for `web/.env.local` and `backend/.env`, and ends with a troubleshooting table. The Apple-Silicon-only `make dev` it once had to work around was fixed in #29. |
| S4 | `LICENSE.md` | **3** | `LICENSE.md` | Present. |
| S5 | `CODE-OF-CONDUCT.md` | **3** | `CODE_OF_CONDUCT.md` | Present. |
| S6 | `CONTRIBUTING.md`, with standards and how to extend safely | **3** | [`CONTRIBUTING.md`](../../CONTRIBUTING.md) | Renamed to the name the rubric asks for, and extended with both halves it asks for: coding standards with the config that enforces each and the command to run it, and how to extend safely — contract first, the six scoring rules that look like details, and how to write a test that can fail. |
| S7 | Style checker, formatter, syntax checker — config in repo and badge in README | **3** | `web/eslint.config.mjs`, `web/.prettierrc`, `backend/pyproject.toml`, `web/tsconfig.json`, [`ci-jest.yml`](../../.github/workflows/ci-jest.yml) | Four configs, all enforced in CI, all with a badge: ESLint (`--max-warnings=0`) and Prettier (`--check`) in the web job, Ruff lint and format in the backend job, `tsc --noEmit` in the web job. ESLint and Prettier were configured but not run until `d9910a1`; turning Prettier on found four unformatted test files, fixed in the same commit. **Ruff was scored 3 on 2026-10-16, corrected to 2, then back to 3 on 2026-10-19, this time with the gate observed working.** Removing `continue-on-error` had not been enough: the step still reported success while Ruff printed "Found 14 errors". It now exits on Ruff's own code, and CI has since gone **red twice** on real lint failures and green again once all seventeen were fixed. A gate that has been watched fail and recover is the thing this row is asking about. |
| S8 | Zenodo DOI badge | **2** | `README.md` | Present and resolving. Still the upstream record's DOI rather than a release of this fork, so it evidences their archive and not our work. Re-minting needs a release on this repository. |
| S9 | `THIRD_PARTY_LIBRARIES.md` listing dependencies and licences | **3** | [`THIRD_PARTY_LIBRARIES.md`](../../THIRD_PARTY_LIBRARIES.md) | All 84 direct dependencies (69 web, 15 backend), with the version pinned by each lock file and the licence. The two MPL-2.0 packages are named and their compatibility with MIT explained. Ends with the commands that reproduce the list. |
| S10 | Visible, disclosed AI use, including evidence a human checked the output | **3** | [`p1a/`](../../p1a), [`p1b/`](../../p1b), [`AGENT-PLAN/`](../../AGENT-PLAN) | **The strongest row in this assessment.** Four models are evidenced with preserved transcripts, not claims. Every run has a derivation record naming what the model got wrong and how it was caught — five corrected claims in the Gemini column alone, each with the source line that disproved it. One record documents a verification that was itself wrong and marks it so. [`p1b/result/claude/06-disagreement-with-codex.md`](../../p1b/result/claude/06-disagreement-with-codex.md) records where two models disagreed and what settled each. |

---

## Where the marks are, ranked by marks per hour

**12 of 96 remain.** The two largest blocks closed this week: the videos and the issue tracker.

| # | Work | Rows | Worth | Blocked on |
|---|---|---|---|---|
| 1 | **Keep the tracker moving, and discuss in the issue before closing.** Six issues is a start, and the discussion summaries were added after the fixes. New issues should be discussed in the issue itself. | I1, I3 | **3** | the team |
| 2 | **Mint a Zenodo DOI for a release of this fork.** The present DOI is the upstream record's. | S8 | 1 | repo admin |
| 3 | **Make the forum active.** Two threads is not a channel. | I5 | 1 | the team |
| 4 | **Document the inherited code**, which is most of the repository. | D2 | 1 | nobody |

## Rows that cannot honestly reach 3

Stated so nobody spends time trying. **T3** is 77 / 39 / 25 / 5 commits, a 15× gap between top and bottom, and inflating it is one click to disprove. **T4** is deliberately siloed because the sprint plan assigns one owner per file. **T7** stays at 1 until the maintainer of this sheet can run the application, which needs credentials. **T6** is shared config edited by three of four members, but almost all of it by two.


## Rows a spot-check would most likely pick, and what to open

| Row | Open this |
|---|---|
| Q1 / Q2 | the test directories and the counts above; both are reproducible in one command |
| Q3 | any `se26f-p2` Actions run, five workflows green (web, backend, M0, docs, Pages) |
| S10 | `p1b/result/claude/06-disagreement-with-codex.md`, then any derivation record's caught-error table |
| T7 | this assessment — the honest 1 is the answer, and the reason is written down |
| Q4 / S1 | the Codecov dashboard (89.8% on `se26f-p2`) and the README badges, each of which opens its source |

---

## How these numbers were produced

Every figure was measured on 2026-10-20 against `origin/se26f-p2`, not carried over from an earlier
pass. The commands, so a spot-check can repeat them:

```bash
git log origin/se26f-p2 --since=2026-10-10 --format='%an' | sort | uniq -c   # commits per person
git log origin/se26f-p2 --since=2026-10-10 --author=X --numstat --format='' \
  -- . ':(exclude)*.lock' ':(exclude)package-lock.json' ':(exclude)p2/eval/corpus/*' \
     ':(exclude)docs/api/*' ':(exclude)*.pdf' ':(exclude)*.png' ':(exclude)*.svg'   # lines changed
cd web && npx jest --silent                                                  # test counts
gh api repos/Amihua/Epicourier-Web --jq '{has_issues,has_discussions,has_pages}'
gh issue list --state all --limit 100                                        # 0 issues
curl -o /dev/null -w '%{http_code}' <each badge URL>                         # 13 x 200, 1 x 404
```

The totals in this document are computed from the table by script rather than typed. Three earlier
revisions each had the header disagreeing with the rows, which is exactly the kind of error a
spot-check finds first.
