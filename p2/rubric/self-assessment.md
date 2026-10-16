# Project 2 — rubric self-assessment

**Maintained by:** Wenbo Li · **Assessed:** 2026-10-16 (revised the same day after the badge, Ruff and CONTRIBUTING work) · **Branch:** `se26f-p2`
**Scale:** 0 = none · 1 = a little · 2 = somewhat · 3 = a lot

Five rows are spot-checked at the demo, and a self-score that does not hold up costs more than an
honest low one. So every score below is the score the evidence supports, and where the evidence is
thin the row says 0 or 1 and says why. **Rows scored 0 are not oversights; they are work not done.**

Running total: **63 / 96**, up from 46 earlier today: badges, Ruff and CONTRIBUTING took it to 54, and the documentation work took it to 64. The weakest block is now issues (1/15), which is structurally blocked, and the two video rows, which need credentials.

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

## Tests — 11 / 12

| # | Row | Score | Evidence | Why this score |
|---|---|:-:|---|---|
| Q1 | Tests exist, expected and failure cases, 50 good / 100 better | **3** | `web/__tests__`, `web/tests`, `backend/tests` | **1510 cases** — 1412 Jest, 98 pytest — well past "100 is better". Failure cases are a deliberate category: `p2/eval/cases/corrupted.json` must fail, and the P1a adversarial suite exists to expose gaps. |
| Q2 | Tests are a serious share of the codebase, ~30% common | **3** | measured 2026-10-16 | **50.1%** — 30,217 lines of test against 30,108 of product code. |
| Q3 | Tests run automatically on every commit via CI | **3** | [Actions](https://github.com/Amihua/Epicourier-Web/actions) | Four jobs on every push to `se26f-p2` and every PR to it: M0, Pytest, Ruff, and the web job (typegen → type-check → Jest → build → coverage). |
| Q4 | Coverage measured and shown on a badge | **2** | `README.md` | Coverage is measured and the badge now points at `Amihua/Epicourier-Web`; it was pointing at the upstream repository and reporting another project's number. Not a 3 until Codecov is configured for this repository and the badge shows a real percentage rather than "unknown". |

## Docs — 10 / 18

| # | Row | Score | Evidence | Why this score |
|---|---|:-:|---|---|
| D1 | Generated docs, not ugly | **2** | [`docs/api/backend/`](../../docs/api/backend) · [`docs/api/web/`](../../docs/api/web) | Two generators, both runnable from a clean checkout, wired into a CI job that fails when the output is stale. Not a 3: it is a folder of pages in the repository, not a published site — GitHub Pages needs an admin to enable. |
| D2 | WHAT: per-class and per-function descriptions | **2** | [`docs/api/backend/`](../../docs/api/backend) | The generator marks undocumented public symbols as such, and the four P2 modules have none. Not a 3: the inherited code is still largely undocumented, and the generated reference covers the P2 modules rather than the whole codebase. |
| D3 | HOW: mini-tutorials with worked examples | **3** | [`docs/guides/`](../../docs/guides) | Four guides, each built on a command the reader runs: the evaluation in a minute with nothing installed; adding a scoring rule by writing the expectation first and watching it fail; changing the contract, worked through the real case where the schema was looser than the model; and local setup ordered by how little you need. |
| D4 | WHY: docs that motivate the project | **3** | [`docs/WHY.md`](../../docs/WHY.md) | Opens on the schema that makes the current score undecomposable, names the cost — not that users cannot see an explanation, but that the team cannot tell whether a change improved the ranking or moved it — and states what the project does not claim, including the baseline that is not collected. |
| D5 | Teaser video, 12–30 s, top of the README | **0** | — | Not made. Blocked on running the application. |
| D6 | Feature walkthrough video, 2–5 min, linked from README | **0** | — | Not made. The README links the **upstream team's** demo video, which is not ours and must not be presented as ours. |

## Standard files and bling — 27 / 30

| # | Row | Score | Evidence | Why this score |
|---|---|:-:|---|---|
| S1 | README with all badges, each working when clicked | **3** | `README.md` | Twelve badges, all pointing at this repository: web CI, backend CI, M0 evaluation, coverage, test count, test share, ESLint, Prettier, Ruff, tsc, DOI, status. Every URL was fetched and returns 200 before being committed, and the three stale relative links found while checking were fixed. |
| S2 | `.gitignore` keeps out what must not be committed | **3** | `.gitignore`, `web/.gitignore` | Covers env files, build output, node_modules; `web/.env.local` is confirmed ignored. No secret is tracked. |
| S3 | `INSTALL.md` | **2** | `INSTALL.md` | Present and usable, and `web/.env.example` now declares `SUPABASE_SERVICE_ROLE_KEY` and the VAPID pair, both of which a build needs and neither of which was listed. Still a 2: it does not yet say that the backend cannot start without a model key, which is the first thing a new contributor hits. |
| S4 | `LICENSE.md` | **3** | `LICENSE.md` | Present. |
| S5 | `CODE-OF-CONDUCT.md` | **3** | `CODE_OF_CONDUCT.md` | Present. |
| S6 | `CONTRIBUTING.md`, with standards and how to extend safely | **3** | [`CONTRIBUTING.md`](../../CONTRIBUTING.md) | Renamed to the name the rubric asks for, and extended with both halves it asks for: coding standards with the config that enforces each and the command to run it, and how to extend safely — contract first, the six scoring rules that look like details, and how to write a test that can fail. |
| S7 | Style checker, formatter, syntax checker — config in repo and badge in README | **3** | `web/eslint.config.mjs`, `web/.prettierrc`, `backend/pyproject.toml`, `web/tsconfig.json` | Four configs, all in CI, all with a badge. The `continue-on-error` flags that made the Ruff format check report failure as success are gone, and the four files it was failing on are formatted, so the green is now worth something. |
| S8 | Zenodo DOI badge | **2** | `README.md` | A DOI badge is present and resolves. It belongs to the upstream record rather than to a release of this repository, so it needs re-minting before it evidences our work. |
| S9 | `THIRD_PARTY_LIBRARIES.md` listing dependencies and licences | **2** | `THIRD_PARTY_LIBRARIES.md` | Present and real. Predates P2, so the dependencies added since are not in it. |
| S10 | Visible, disclosed AI use, including evidence a human checked the output | **3** | [`p1a/`](../../p1a), [`p1b/`](../../p1b), [`AGENT-PLAN/`](../../AGENT-PLAN) | **The strongest row in this assessment.** Four models are evidenced with preserved transcripts, not claims. Every run has a derivation record naming what the model got wrong and how it was caught — five corrected claims in the Gemini column alone, each with the source line that disproved it. One record documents a verification that was itself wrong and marks it so. `p1b/prompts/step8-prompt-model-table.md` carries the prompt × model comparison with disagreements and what settled each. |

---

## Where the marks are, if anyone has an hour

Ranked by marks per hour, all of it independent of anyone else except the first:

Done since the first pass, worth 8 points: badges repointed and completed (S1 1→3, Q4 0→2), Ruff
enforced for real with its four files formatted (S7 1→3), and CONTRIBUTING renamed and extended
(S6 1→3).

What is left, and who it needs:

1. **Enable Issues and file the findings already written** — up to 12 points in a block scoring 1.
   Needs an admin; `has_issues` is false. The failing cases are documented already, they are just
   not issues.
2. **Publish the generated reference as a site** — D1 2→3. The pages exist; GitHub Pages needs an
   admin to enable, the same person who can enable Issues.
3. **Record the two videos** — 6 points, blocked on Supabase credentials.
4. **Configure Codecov for this repository** — Q4 2→3; the badge points here now but has no data.
5. **Mint a Zenodo DOI for a release of this repository** — S8 2→3; the present DOI is the upstream
   record's.

### Rows that cannot honestly reach 3

Stated so nobody spends time trying. T3 is 35 / 16 / 12 / 7 commits — a real spread with a 5× gap,
and inflating it is checkable in one click. T4 is deliberately siloed this sprint because the plan
assigns one owner per file. T7 stays at 1 until the maintainer of this file can run the application,
which needs credentials. I1–I4 are structurally 0 while Issues are disabled.

## Rows a spot-check would most likely pick, and what to open

| Row | Open this |
|---|---|
| Q1 / Q2 | the test directories and the counts above; both are reproducible in one command |
| Q3 | any `se26f-p2` Actions run, four jobs green |
| S10 | `p1b/prompts/step8-prompt-model-table.md`, then any derivation record's caught-error table |
| T7 | this assessment — the honest 1 is the answer, and the reason is written down |
| Q4 / S1 | the README badge URLs, which currently name the wrong repository |
