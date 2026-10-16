# Project 2 — rubric self-assessment

**Maintained by:** Wenbo Li · **Assessed:** 2026-10-16 · **Branch:** `se26f-p2`
**Scale:** 0 = none · 1 = a little · 2 = somewhat · 3 = a lot

Five rows are spot-checked at the demo, and a self-score that does not hold up costs more than an
honest low one. So every score below is the score the evidence supports, and where the evidence is
thin the row says 0 or 1 and says why. **Rows scored 0 are not oversights; they are work not done.**

Running total: **46 / 96**. The three weakest blocks are documentation, issues, and the two videos.

---

## A note that affects six rows: this is a fork

`se26f-p2` carries **608 commits**, and most of them are not ours. The largest contributors in that
history — `SN-F-QR` (120), `seojinseojin` (62), `Joe Zhou` (49), `lzdjohn` (33), `hkc619` (31),
`Kushal Patel` (24) — are the upstream team whose project we inherited in Project 1a.

**Our own work is 73 commits since 2026-10-10:**

| Member | Commits since 10-10 | Distinct files touched, all time |
|---|---:|---:|
| andyyuyc | 35 | 122 |
| Sihao Liu | 16 | 66 |
| wenboli | 12 | 39 |
| Jeffery | 7 | 65 |

Every teamwork row below is scored against **those 73**, not against 608. Quoting the repository
total would be the single easiest thing for a marker to catch.

---

## Teamwork — 14 / 21

| # | Row | Score | Evidence | Why this score |
|---|---|:-:|---|---|
| T1 | Many commits, small and frequent | **2** | [commits on se26f-p2](https://github.com/Amihua/Epicourier-Web/commits/se26f-p2) | 73 commits in six days across four people, in small units — this branch alone has eight separate M0 commits rather than one. Not a 3: the pace is concentrated in two bursts around the merge windows rather than steady. |
| T2 | Commits come from different people | **3** | [insights/contributors](https://github.com/Amihua/Epicourier-Web/graphs/contributors) | All four members committed during P2: 35 / 16 / 12 / 7. |
| T3 | Workload spread, even if one is more productive | **2** | same | 35 to 7 is a real spread but a 5× gap between the top and bottom contributor. Honest 2, not 3. |
| T4 | Members work across many parts, not one silo each | **2** | [PRs #20–#25](https://github.com/Amihua/Epicourier-Web/pulls?q=is%3Apr) | File ownership was deliberate this sprint — the plan assigns one owner per file to avoid conflicts — so some siloing is by design. Against that, andyyuyc touched 122 files and Jeffery 65, and cross-module review happened in PR comments. |
| T5 | Short release cycles, prompt merges | **2** | [merged PRs](https://github.com/Amihua/Epicourier-Web/pulls?q=is%3Apr+is%3Amerged) | #20, #21 merged within hours of opening; #22–#24 the next day. Not a 3: #25 has been open while its scope grew. |
| T6 | Shared tool configs, updated by several people | **2** | `web/tsconfig.json`, `web/eslint.config.mjs`, `web/.prettierrc`, `backend/pyproject.toml`, `.github/workflows/` | Configs are shared and are being updated — tsconfig ES2017→ES2018 and three workflows this sprint — but nearly all of those edits are from one owner, which is what the plan intends and what keeps this off 3. |
| T7 | Any member can run and demo it on their own machine | **1** | [`docs/p2/evaluation.md`](../../docs/p2/evaluation.md) | **Honest 1.** The maintainer of this file cannot run the application: it needs Supabase credentials that have not been shared, and the backend cannot start without a model key. M0 and the web suite run anywhere; the product does not. |

## Issues and discussion — 1 / 15

| # | Row | Score | Evidence | Why this score |
|---|---|:-:|---|---|
| I1 | Many issue reports exist | **0** | repository settings | **Issues are disabled on the repository** (`has_issues: false`). There are none to count. |
| I2 | Issues get closed | **0** | — | Nothing to close. |
| I3 | Issues discussed before closing | **0** | — | Discussion happened in PR review and off-platform, and was not mirrored into issues. |
| I4 | A large share of issues concern failing cases | **0** | — | The failing cases exist and are documented — the suppressed Ruff failure, the flaky date test, the build's undeclared environment variables — but as commits and documents, not as issues. |
| I5 | An active chat or forum, QR on the poster | **1** | — | The team coordinates off-platform. No forum link exists yet and the poster is not built, so the QR target does not exist. |

**This block is the cheapest four marks available to the team**, and it is blocked on one admin
action: enabling Issues. Several already-written findings would become issues immediately.

## Tests — 9 / 12

| # | Row | Score | Evidence | Why this score |
|---|---|:-:|---|---|
| Q1 | Tests exist, expected and failure cases, 50 good / 100 better | **3** | `web/__tests__`, `web/tests`, `backend/tests` | **1510 cases** — 1412 Jest, 98 pytest — well past "100 is better". Failure cases are a deliberate category: `p2/eval/cases/corrupted.json` must fail, and the P1a adversarial suite exists to expose gaps. |
| Q2 | Tests are a serious share of the codebase, ~30% common | **3** | measured 2026-10-16 | **50.1%** — 30,217 lines of test against 30,108 of product code. |
| Q3 | Tests run automatically on every commit via CI | **3** | [Actions](https://github.com/Amihua/Epicourier-Web/actions) | Four jobs on every push to `se26f-p2` and every PR to it: M0, Pytest, Ruff, and the web job (typegen → type-check → Jest → build → coverage). |
| Q4 | Coverage measured and shown on a badge | **0** | `README.md` | Coverage *is* measured — the web job uploads to Codecov — but **the README badge points at `sdxshuai/Epicourier-Web`, the upstream repository, not ours.** It renders, so it looks fine and reports someone else's number. Scored 0 deliberately. |

## Docs — 1 / 18

| # | Row | Score | Evidence | Why this score |
|---|---|:-:|---|---|
| D1 | Generated docs, not ugly | **0** | — | No documentation site is generated. |
| D2 | WHAT: per-class and per-function descriptions | **1** | `backend/api/receipt_scorer.py`, `p2/eval/run_eval.py`, `web/src/types/receipt.ts` | New P2 modules carry real docstrings that explain why a rule exists, not just what the function takes. Inherited code is largely undocumented, and nothing is published. |
| D3 | HOW: mini-tutorials with worked examples | **0** | — | `p2/eval/README.md` and `p2/baseline/README.md` come closest, but they are runbooks for two scripts, not tutorials for the system. |
| D4 | WHY: docs that motivate the project | **0** | — | The P1b report tells that story; nothing in the repository documentation does. |
| D5 | Teaser video, 12–30 s, top of the README | **0** | — | Not made. Blocked on running the application. |
| D6 | Feature walkthrough video, 2–5 min, linked from README | **0** | — | Not made. The README links the **upstream team's** demo video, which is not ours and must not be presented as ours. |

## Standard files and bling — 21 / 30

| # | Row | Score | Evidence | Why this score |
|---|---|:-:|---|---|
| S1 | README with all badges, each working when clicked | **1** | `README.md` | Badges exist, but the CI and Codecov badges point at `sdxshuai/Epicourier-Web`. They load, which is worse than being broken: they display a different repository's status. Build, style, format and syntax badges are absent. |
| S2 | `.gitignore` keeps out what must not be committed | **3** | `.gitignore`, `web/.gitignore` | Covers env files, build output, node_modules; `web/.env.local` is confirmed ignored. No secret is tracked. |
| S3 | `INSTALL.md` | **2** | `INSTALL.md` | Present and usable, and `web/.env.example` was corrected this sprint to declare `SUPABASE_SERVICE_ROLE_KEY` and the VAPID pair, both of which a build needs and neither of which was listed. Not a 3: it still says `npm ci`-era setup and does not mention that the backend cannot start without a model key. |
| S4 | `LICENSE.md` | **3** | `LICENSE.md` | Present. |
| S5 | `CODE-OF-CONDUCT.md` | **3** | `CODE_OF_CONDUCT.md` | Present. |
| S6 | `CONTRIBUTING.md`, with standards and how to extend safely | **1** | `CONTRIBUTE.md` | The file is named `CONTRIBUTE.md`, not the name the rubric asks for, and it covers workflow rather than coding standards or how to extend the system safely. |
| S7 | Style checker, formatter, syntax checker — config in repo and badge in README | **1** | `web/eslint.config.mjs`, `web/.prettierrc`, `backend/pyproject.toml` (Ruff), `web/tsconfig.json` | All four configs exist and three run in CI. **No badge for any of them**, and the Ruff format check is still wrapped in `continue-on-error`, so it reports failure as success — measured: 4 files would be reformatted. |
| S8 | Zenodo DOI badge | **2** | `README.md` | A DOI badge is present and resolves. It belongs to the upstream record rather than to a release of this repository, so it needs re-minting before it evidences our work. |
| S9 | `THIRD_PARTY_LIBRARIES.md` listing dependencies and licences | **2** | `THIRD_PARTY_LIBRARIES.md` | Present and real. Predates P2, so the dependencies added since are not in it. |
| S10 | Visible, disclosed AI use, including evidence a human checked the output | **3** | [`p1a/`](../../p1a), [`p1b/`](../../p1b), [`AGENT-PLAN/`](../../AGENT-PLAN) | **The strongest row in this assessment.** Four models are evidenced with preserved transcripts, not claims. Every run has a derivation record naming what the model got wrong and how it was caught — five corrected claims in the Gemini column alone, each with the source line that disproved it. One record documents a verification that was itself wrong and marks it so. `p1b/prompts/step8-prompt-model-table.md` carries the prompt × model comparison with disagreements and what settled each. |

---

## Where the marks are, if anyone has an hour

Ranked by marks per hour, all of it independent of anyone else except the first:

1. **Enable Issues and file the findings already written** — up to 12 points in a block currently scoring 1. The failing cases are documented; they just are not issues.
2. **Repoint the CI and Codecov badges at `Amihua/Epicourier-Web`, and add build / lint / format / type badges** — turns Q4 from 0 and S1 from 1 into defensible scores, and removes the risk of presenting another repository's status as ours.
3. **Rename `CONTRIBUTE.md` to `CONTRIBUTING.md` and add coding standards** — S6 from 1.
4. **Generate a documentation site** — the docs block scores 1 of 18 and is the largest single hole.
5. **Record the two videos** — 6 points, blocked on credentials.

## Rows a spot-check would most likely pick, and what to open

| Row | Open this |
|---|---|
| Q1 / Q2 | the test directories and the counts above; both are reproducible in one command |
| Q3 | any `se26f-p2` Actions run, four jobs green |
| S10 | `p1b/prompts/step8-prompt-model-table.md`, then any derivation record's caught-error table |
| T7 | this assessment — the honest 1 is the answer, and the reason is written down |
| Q4 / S1 | the README badge URLs, which currently name the wrong repository |
