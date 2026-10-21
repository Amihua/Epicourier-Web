# Project 2 — rubric self-assessment

**Maintained by:** Wenbo Li · **Assessed:** 2026-10-16 · **Re-measured:** 2026-10-20 · **Branch:** `se26f-p2`
**Scale:** 0 = none · 1 = a little · 2 = somewhat · 3 = a lot

Five rows are spot-checked at the demo, and a self-score that does not hold up costs more than an
honest low one. So every score below is the score the evidence supports, and where the evidence is
thin the row says 0 or 1 and says why. **Rows scored 0 are not oversights; they are work not done.**

Running total: **65 / 96**, re-measured against the integration branch on 2026-10-20. Up from 63: Pages went live, Discussions was enabled, and the commit count grew — and down one, because the teaser badge now 404s on a placeholder URL. Every figure below was measured today, not carried over.

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

## Teamwork — 15 / 21

| # | Row | Score | Evidence | Why this score |
|---|---|:-:|---|---|
| T1 | Many commits, small and frequent | **3** | [commits](https://github.com/Amihua/Epicourier-Web/commits/se26f-p2) | 89 commits since 2026-10-10 across four people, in genuinely small units — the M0 work alone is seventeen separate commits rather than one drop. The rubric calls hundreds normal for a semester; this is ten days. |
| T2 | Commits come from different people | **3** | [insights/contributors](https://github.com/Amihua/Epicourier-Web/graphs/contributors) | All four members committed during P2: 35 / 16 / 12 / 7. |
| T3 | Workload spread, even if one is more productive | **2** | [contributors](https://github.com/Amihua/Epicourier-Web/graphs/contributors) | 35 / 25 / 17 / 7 since 2026-10-10 — closer than it was, and still a 5× gap between top and bottom. Honest 2; the row allows one member to be more productive, not one to be five times the least. |
| T4 | Members work across many parts, not one silo each | **2** | [PRs #20–#25](https://github.com/Amihua/Epicourier-Web/pulls?q=is%3Apr) | File ownership was deliberate this sprint — the plan assigns one owner per file to avoid conflicts — so some siloing is by design. Against that, andyyuyc touched 122 files and Jeffery 65, and cross-module review happened in PR comments. |
| T5 | Short release cycles, prompt merges | **2** | [merged PRs](https://github.com/Amihua/Epicourier-Web/pulls?q=is%3Apr+is%3Amerged) | Seven PRs merged into the integration branch. #20 and #21 went in within hours. Not a 3: #25 sat open four days while its scope grew, which is the pattern this row warns about. |
| T6 | Shared tool configs, updated by several people | **2** | `web/tsconfig.json`, `web/eslint.config.mjs`, `backend/pyproject.toml`, `.github/workflows/` | Shared and actively updated — tsconfig ES2017→ES2018, Ruff isort config, four workflows. Still a 2: nearly all of those edits come from one owner, which the sprint plan intends but the row does not reward. |
| T7 | Any member can run and demo it on their own machine | **1** | [`docs/p2/evaluation.md`](../../docs/p2/evaluation.md) | **Honest 1.** The maintainer of this file cannot run the application: it needs Supabase credentials that have not been shared, and the backend cannot start without a model key. M0 and the web suite run anywhere; the product does not. |

## Issues and discussion — 1 / 15

| # | Row | Score | Evidence | Why this score |
|---|---|:-:|---|---|
| I1 | Many issue reports exist | **0** | [issues](https://github.com/Amihua/Epicourier-Web/issues) | Issues were enabled since the last assessment, and **none has been filed**. The findings that should be issues are written down in commits and documents instead. |
| I2 | Issues get closed | **0** | — | Nothing has been opened, so nothing has been closed. |
| I3 | Issues discussed before closing | **0** | — | Discussion happens in pull requests and off-platform and is not mirrored into issues. |
| I4 | A large share of issues concern failing cases | **0** | — | The failing cases exist and are documented — the suppressed Ruff gate, two time-dependent test defects, the build's undeclared environment variables — but as commits and documents, not as issues. This is the single cheapest block on the sheet and it is now unblocked. |
| I5 | An active chat or forum, QR on the poster | **2** | [discussions](https://github.com/Amihua/Epicourier-Web/discussions) · [`p2/poster/`](../poster) | Discussions is enabled with 2 threads, and the poster carries a QR code pointing at it. Not a 3: two threads is not an active forum, and most coordination still happens off-platform where a tutor cannot see it. |

**This block is the cheapest four marks available to the team**, and it is blocked on one admin
action: enabling Issues. Several already-written findings would become issues immediately.

## Tests — 11 / 12

| # | Row | Score | Evidence | Why this score |
|---|---|:-:|---|---|
| Q1 | Tests exist, expected and failure cases, 50 good / 100 better | **3** | `web/__tests__`, `web/tests`, `backend/tests` | **1,481 cases run green** — 1,406 Jest (1,405 passing, 1 skipped) and 75 pytest, well past "100 is better". **Corrected 2026-10-20:** this row previously said 1,510 from 1,412 Jest, which counted `it(`/`test(` declarations by grep rather than executed tests; the figures above are from an actual run. Failure cases are a deliberate category: `p2/eval/cases/corrupted.json` must fail, and the P1a adversarial suite exists to expose gaps. |
| Q2 | Tests are a serious share of the codebase, ~30% common | **3** | measured 2026-10-16 | **50.1%** — 30,217 lines of test against 30,108 of product code. |
| Q3 | Tests run automatically on every commit via CI | **3** | [Actions](https://github.com/Amihua/Epicourier-Web/actions) | Five jobs on every push to `se26f-p2` and every PR to it: M0 evaluation, pytest, Ruff, docs-freshness, and the web job (typegen → type-check → Jest → build → coverage). None carries `continue-on-error`. |
| Q4 | Coverage measured and shown on a badge | **2** | `README.md` | Measured by the web job and the badge points at this repository. Still a 2: Codecov has no data for `Amihua/Epicourier-Web`, so the badge renders "unknown" rather than a number. The row asks for the tool's number. |

## Docs — 11 / 18

| # | Row | Score | Evidence | Why this score |
|---|---|:-:|---|---|
| D1 | Generated docs, not ugly | **3** | **[amihua.github.io/Epicourier-Web](https://amihua.github.io/Epicourier-Web/)** | Pages is live, building from `se26f-p2/docs`. Two generators feed it — `ast` for the backend, TypeDoc for the contract types — and a CI job fails when either output is stale, so the site cannot drift from the code. Index, WHY, every guide and both API trees verified to return 200. |
| D2 | WHAT: per-class and per-function descriptions | **2** | [`docs/api/backend/`](../../docs/api/backend) | The generator marks undocumented public symbols as such, and the four P2 modules have none. Not a 3: the inherited code is still largely undocumented, and the generated reference covers the P2 modules rather than the whole codebase. |
| D3 | HOW: mini-tutorials with worked examples | **3** | [`docs/guides/`](../../docs/guides) | Four guides, each built on a command the reader runs: the evaluation in a minute with nothing installed; adding a scoring rule by writing the expectation first and watching it fail; changing the contract, worked through the real case where the schema was looser than the model; and local setup ordered by how little you need. |
| D4 | WHY: docs that motivate the project | **3** | [`docs/WHY.md`](../../docs/WHY.md) | Opens on the schema that makes the current score undecomposable, names the cost — not that users cannot see an explanation, but that the team cannot tell whether a change improved the ranking or moved it — and states what the project does not claim, including the baseline that is not collected. |
| D5 | Teaser video, 12–30 s, top of the README | **0** | `README.md:18` | The slot exists at the top of the README, beside the badges — and its URL is still the literal placeholder `VIDEO_ID`, so the badge image **404s**. Worse than absent until the video is recorded. |
| D6 | Feature walkthrough video, 2–5 min, linked from README | **0** | `README.md:26` | Not recorded; the README says "link coming". The upstream team's demo is now correctly attributed to them rather than presented as ours. |

## Standard files and bling — 26 / 30

| # | Row | Score | Evidence | Why this score |
|---|---|:-:|---|---|
| S1 | README with all badges, each working when clicked | **2** | `README.md` | Fourteen badges. **Thirteen return 200; the teaser badge 404s**, because its URL is still the literal `VIDEO_ID` placeholder. The row says every badge must work when clicked, and one does not — so this is a 2 until the video exists, not a 3 with a footnote. |
| S2 | `.gitignore` keeps out what must not be committed | **3** | `.gitignore`, `web/.gitignore` | Covers env files, build output, node_modules; `web/.env.local` is confirmed ignored. No secret is tracked. |
| S3 | `INSTALL.md` | **2** | `INSTALL.md` | Present and usable, and `web/.env.example` now declares `SUPABASE_SERVICE_ROLE_KEY` and the VAPID pair, both of which a build needs and neither of which was listed. Still a 2: it does not yet say that the backend cannot start without a model key, which is the first thing a new contributor hits. |
| S4 | `LICENSE.md` | **3** | `LICENSE.md` | Present. |
| S5 | `CODE-OF-CONDUCT.md` | **3** | `CODE_OF_CONDUCT.md` | Present. |
| S6 | `CONTRIBUTING.md`, with standards and how to extend safely | **3** | [`CONTRIBUTING.md`](../../CONTRIBUTING.md) | Renamed to the name the rubric asks for, and extended with both halves it asks for: coding standards with the config that enforces each and the command to run it, and how to extend safely — contract first, the six scoring rules that look like details, and how to write a test that can fail. |
| S7 | Style checker, formatter, syntax checker — config in repo and badge in README | **3** | `web/eslint.config.mjs`, `web/.prettierrc`, `backend/pyproject.toml`, `web/tsconfig.json` | Four configs, all in CI, all with a badge. **Scored 3 on 2026-10-16, corrected to 2, then back to 3 on 2026-10-19 — this time with the gate observed working.** Removing `continue-on-error` had not been enough: the step still reported success while Ruff printed "Found 14 errors". It now exits on Ruff's own code, and CI has since gone **red twice** on real lint failures and green again once all seventeen were fixed. A gate that has been watched fail and recover is the thing this row is asking about. |
| S8 | Zenodo DOI badge | **2** | `README.md` | Present and resolving. Still the upstream record's DOI rather than a release of this fork, so it evidences their archive and not our work. Re-minting needs a release on this repository. |
| S9 | `THIRD_PARTY_LIBRARIES.md` listing dependencies and licences | **2** | `THIRD_PARTY_LIBRARIES.md` | Present and real. Predates P2, so the dependencies added since are not in it. |
| S10 | Visible, disclosed AI use, including evidence a human checked the output | **3** | [`p1a/`](../../p1a), [`p1b/`](../../p1b), [`AGENT-PLAN/`](../../AGENT-PLAN) | **The strongest row in this assessment.** Four models are evidenced with preserved transcripts, not claims. Every run has a derivation record naming what the model got wrong and how it was caught — five corrected claims in the Gemini column alone, each with the source line that disproved it. One record documents a verification that was itself wrong and marks it so. `p1b/prompts/step8-prompt-model-table.md` carries the prompt × model comparison with disagreements and what settled each. |

---

## Where the marks are, ranked by marks per hour

**31 of the 96 are still on the table, and 23 of them need no new code.**

| # | Work | Rows | Worth | Blocked on |
|---|---|---|---|---|
| 1 | **File the issues that are already written.** Issues is enabled and empty. The suppressed Ruff gate, both time-dependent test defects, the two undeclared build variables and the module-level model client are each a failing case with a commit that closes it — exactly the "test fails, issue opens, fix closes it" pattern I4 asks for. | I1–I4 | **12** | nobody |
| 2 | **Record the two videos.** The teaser slot exists and 404s on a placeholder; the walkthrough says "link coming". | D5, D6, S1 | **7** | Supabase credentials |
| 3 | **Configure Codecov for this repository.** The badge points here and has no data behind it. | Q4 | 1 | repo admin |
| 4 | **Mint a Zenodo DOI for a release of this fork.** | S8 | 1 | repo admin |
| 5 | **Make the forum active.** Two threads is not an active channel. | I5 | 1 | the team |

Item 1 is the whole reason this sheet scores 65 rather than 77, and it is a writing task against findings that already exist.

## Rows that cannot honestly reach 3

Stated so nobody spends time trying. **T3** is 35 / 25 / 17 / 7 commits — a real spread with a 5× gap, and inflating it is one click to disprove. **T4** is deliberately siloed because the sprint plan assigns one owner per file. **T7** stays at 1 until the maintainer of this sheet can run the application, which needs credentials. **T6** is shared config edited almost entirely by one owner — intended by the plan, not rewarded by the row.


## Rows a spot-check would most likely pick, and what to open

| Row | Open this |
|---|---|
| Q1 / Q2 | the test directories and the counts above; both are reproducible in one command |
| Q3 | any `se26f-p2` Actions run, four jobs green |
| S10 | `p1b/prompts/step8-prompt-model-table.md`, then any derivation record's caught-error table |
| T7 | this assessment — the honest 1 is the answer, and the reason is written down |
| Q4 / S1 | the README badge URLs, which currently name the wrong repository |

---

## How these numbers were produced

Every figure was measured on 2026-10-20 against `origin/se26f-p2`, not carried over from an earlier
pass. The commands, so a spot-check can repeat them:

```bash
git log origin/se26f-p2 --since=2026-10-10 --format='%an' | sort | uniq -c   # commits per person
cd web && npx jest --silent                                                  # test counts
gh api repos/Amihua/Epicourier-Web --jq '{has_issues,has_discussions,has_pages}'
gh issue list --state all --limit 100                                        # 0 issues
curl -o /dev/null -w '%{http_code}' <each badge URL>                         # 13 x 200, 1 x 404
```

The totals in this document are computed from the table by script rather than typed. Three earlier
revisions each had the header disagreeing with the rows, which is exactly the kind of error a
spot-check finds first.
