# Play to the Team

**Prompt:** P11 · **Run date:** 2026-09-13 · **Model:** Claude Opus 5 (1M context), `claude-opus-5[1m]`

The rival Codex analyst called this prompt *"least useful, because member biographies were unavailable"*. We disagree: that is a property of the run, not of the prompt. Biographies are still missing — and the report should say so — but the repository is an evidence source that was available and went unread, and reading it changed the plan.

---

# Direction and Ownership — Epicourier P1b

**Prepared 2026-09-13. Every repository claim below was re-verified against the working tree today; commands and line numbers are given so you can re-run them.**

---

## 0. First, the methodological question, because everything else rests on it

**Position: git history is admissible, but only for a narrow proposition, and the Codex analyst's error was not using it — it was switching propositions without switching evidence.**

Admissibility is never absolute; it is always relative to the claim the evidence is offered for. Git history is:

- **Strong evidence for existential claims.** "This artifact exists, this account committed it, on this date, touching these files." A commit is a positive existence proof.
- **Weak-to-worthless evidence for universal claims about ability.** Absence of a commit is consistent with pair programming under one author, work in another repo, a non-committing role, a teammate pushing on your behalf, or a division of labor the log cannot see. Absence of evidence is not evidence of absence.

So the correct verdict is: **admissible for what a team has demonstrated in this codebase; inadmissible for what any individual can do.**

**The rival analyst's error, quoted in place so a marker can check it without leaving the page.** Codex §11 ([`../codex/README.md`](../codex/README.md), line 162) reads, **in full**:

> *"Repository evidence demonstrates collective TypeScript/Next.js, Python/FastAPI, Supabase, Jest/Pytest, and AI integration work, **but not which current member owns each skill**."*

> ***Corrected 2026-09-13.*** This paragraph previously carried no quote, no section number and no file:line, and charged Codex with *selective* skepticism — rejecting git when it constrains a conclusion and rehabilitating it three sections later when it flatters one. **That charge is withdrawn here, as [`06-disagreement-with-codex.md`](06-disagreement-with-codex.md) already withdrew it**: the clause our earlier draft cut off at the comma — *"but not which current member owns each skill"* — is precisely the demonstrated-versus-owned distinction we are arguing for, and Codex's own ledger logs its check as "Repository inspection", so it did not reject the source and then rehabilitate it. Quoting a source to the comma and convicting it on the half you kept is the error this document exists to avoid, and we made it.

**What survives with the hedge shown — and it is a narrower charge than the one withdrawn.** The hedge concedes the *individual* question and keeps the *collective* one, and the collective one is where the fallacy sits. The first clause attributes to **"the team"** work demonstrated by the upstream authors — `SN-F-QR` (120 commits), `seojinseojin` (62), `Joe Zhou` (57) and the rest of the 2025 team, 467 commits ending 2025-12-07 — and Codex's inspection had no `--since` cut separating those from ours. That is a fallacy of composition: the repository contains 467 commits of Next.js/FastAPI/Supabase competence; the repository is ours (as a fork); therefore the competence is ours. Possession of a codebase is not possession of the skills that produced it. Inheriting a house does not make you a carpenter. The hedge blunts this from a knockout to a scoping objection; it does not dissolve it, because a capability column that silently contains someone else's 467 commits is still the wrong column to schedule 160 hours against.

**Four distortions our own log demonstrates, which must be disclosed whenever we cite git at all:**

1. **Commit count is not effort.** `wenboli721`'s 14 commits are GitHub web-UI single-file operations — "Add files via upload", "Create README.md", "Delete p1a/prompts/gemini/readme.md" — and that UI emits one commit per file. Sihao's 21 commits include 554 lines of test code (*corrected 2026-09-13: was "570", which counted a 15-line Jest config and a 1-line `__init__.py` — see §1*). The two numbers are not the same unit.
2. **Merge commits are not authorship.** `Amihua`'s 15 commits touch **zero** files (`git log --author=Amihua --name-only` returns nothing).
3. **Identity is unstable.** `wenboli` and `wenboli721` share the email `a1270995940@gmail.com` — two accounts, one person.
4. **Authorship metadata is self-asserted.** It records who pushed, not who thought.

**The operating rule for our report:** cite git for artifacts, authors, dates, and file types touched. Phrase every skill claim as "demonstrated in this repository," never as "the team is proficient in." And note the claim is cheap to refute — the way to defeat "we have not demonstrated X" is to do X, which is exactly why it is safe to plan against.

**Why this matters practically:** for the question we actually face — can we commit 160 hours safely? — *demonstration* is the right construct, not ability. You schedule against what has been observed. Unproven ability is a hypothesis; you can bet a weekend on it, not a month.

---

## 1. What the repository proves about us (FACT, re-verified today)

`git log --since=2026-08-01 --name-only`, 63 commits, file types per author:

| Author | Files touched |
|---|---|
| Sihao Liu | 48 .md, 10 .txt, **4 .ts, 3 .py** |
| Mr-Jeffery | 5 .txt, 5 .md, **3 .sh, 3 .py** |
| andyyuyc | 6 .md, 2 .txt |
| wenboli + wenboli721 | 34 .md, 1 .txt, 2 .gitkeep |
| Amihua | *(none — 15 merge commits)* |

**Zero files under `web/src`, `backend/api`, or `supabase/` were touched by our team.** Confirmed: `git log --since=2026-08-01 --name-only --pretty=format: | grep -E '^(web/src|backend/api|supabase)'` returns empty. *Corrected 2026-09-13: the pattern printed here previously tested only two of the three directories it was offered as confirming, so a third of a "verified" claim had no command behind it. The pattern above includes `supabase`, was re-run today, and returns empty.*

Total executable output of the team in P1a: **554 lines of test code across 5 test files**, plus a 15-line `jest.config.ts` and a 1-line `__init__.py` that the glob also matched — **570 lines across 7 files** for `wc -l web/tests/p1a/*.ts backend/tests/sihao/p1a/*.py`.

> *Corrected 2026-09-13:* the "570 lines" figure was being quoted as lines of test code. It is not — the glob swept in 16 lines of config and scaffolding. **The number to use everywhere, including §5 and the poster, is 5 test files / 554 lines of test code.** Counts re-run today: `inventory-behavior.test.ts` 120, `security-attack-cases.test.ts` 111, `use-case-contracts.test.ts` 107, `test_recommender_behavior.py` 165, `test_adversarial_inputs.py` 51 → **554**; plus `jest.config.ts` 15 and `__init__.py` 1 → 570.

**Every one of those 7 files was first committed by a single person.** All 5 test files — **3 TypeScript** (`security-attack-cases.test.ts`, `inventory-behavior.test.ts`, `use-case-contracts.test.ts`) and **2 Pytest** (`test_adversarial_inputs.py`, `test_recommender_behavior.py`) — were added by Sihao Liu on 2026-08-29. The 3 automation scripts (a separate set, not among the 7 above) were added by Mr-Jeffery. This drives §5.

---

## 2. Which direction lets THIS team build and test the most

**Recommendation: (a), the grounded auditable recommendation — with three defects from (c) folded in, and one idea from (b) rebuilt as a deterministic rule.**

The decisive argument is not that (a) is easier. It is that **(a) converts the project's central artifact from untestable to testable, and testing is the only skill this team has demonstrated at all — by one member, and part of what it demonstrated was the wrong kind of test.**

> ***Corrected 2026-09-13.*** This sentence read "testing is the one thing this team has demonstrated **densely**", which is contradicted twice inside this same file: §5 shows **100% of the 554 lines came from one person**, and §7 shows that most P1a "security tests" are **source-text greps, not executed attacks**. Single-sourced and partly mis-aimed is thin, not dense. **The recommendation for (a) survives the weaker premise and is stronger for surviving it:** (a) is the direction that makes the team's one demonstrated skill *applicable to the central artifact*, and it is the direction under which the bus-factor and grep-versus-attack defects are fixable by doing the work rather than by acquiring a skill nobody has shown. A direction chosen because a strength is deep would collapse when the strength turns out to be shallow; this one does not.

You cannot write a regression test for "why did the LLM rank this first." The oracle does not exist. A deterministic Python ranker makes the oracle free: same fixture in, identical ranking and identical rationale out, asserted. *(Cross-reference added 2026-09-13: **the scorer's language is an open team decision and this file is one side of it.** §6 here budgets "deterministic ranker + Pytest" and R2 owns it in `backend/api/`; [`12-milestones.md`](12-milestones.md) N2 describes it as a port that reuses the TypeScript `recipeMatch.ts`, and [`13-name-the-test.md`](13-name-the-test.md) runs T6/T9/T10/T11 under Jest. **Unresolved — not settled here.** The argument in this section holds under either language, because what makes the oracle free is determinism and purity, not the runtime.)* For a team whose proven skill is Pytest and Jest, moving the product's core into the region where that skill applies is the highest-leverage structural decision available. Every other direction leaves the team's strength pointed at the periphery.

Three further advantages that fall out for free:

- **It neutralises the prompt-injection exposure structurally.** `build_recommendation_prompt` in `backend/api/inventory_recommender.py` does `pref_section = preferences if preferences else "None specified"` and interpolates it straight into the f-string, with no boundary. OWASP LLM01 is explicit: *"Separate and clearly denote untrusted content to limit its influence on user prompts."* Under (a), untrusted free text can no longer change the **ranking** — only the prose around it. Direction (c) would have to fix this defensively; (a) gets it architecturally.
- **It produces a demo and a poster from the same work.** A ranking that names the actual inventory rows behind it, and lets the user correct one and watch the order change, is one artifact that satisfies build, test, demo, and poster.
- **It keeps the inherited 1,096-test suite as a safety net.** Important distinction: that suite is the previous team's and must never appear as our result — but using it as a regression harness for our changes is entirely legitimate. It is not our achievement; it is our seatbelt.

**Scope discipline that (a) must accept:** `user_inventory` has `CONSTRAINT unique_user_ingredient_location UNIQUE (user_id, ingredient_id, location)` and the transfer route sums into that single row. There are no lots. The rationale must say **"item," not "lot."** Further: `updated_at` is reset to `NOW()` on every modification by `trigger_user_inventory_updated_at`, and `created_at` on a summed row reflects only the first purchase. **The rationale must therefore make no provenance or age claims at all** — cite ingredient, quantity, location, and `expiration_date`, all of which are real. Naming a field that exists is the entire point of an auditable rationale; inventing one defeats it.

---

## 3. Which direction is the trap

**(b), uncertainty-aware ranking. It fails on three independent grounds, any one of which is fatal.**

1. **Missing skill.** Nobody has demonstrated probability modeling or calibration. This is the least of the three problems.
2. **Missing data — the schema destroys the signal (b) depends on.** The staleness input does not exist. There is one row per `(user_id, ingredient_id, location)` with quantities summed, and the only moving timestamp is `updated_at`, which a `BEFORE UPDATE` trigger sets to `NOW()` on *any* change. Buy milk Sept 1, buy milk Sept 13: one row, quantity 2, `updated_at` = Sept 13. The age of the September 1 milk is unrecoverable. Calibrating a staleness model on that column means fitting a model to a timestamp that means something else. Recovering it requires a per-purchase lot table, a backfill, and rewrites of every read path — that is the whole month, and it ships no user-visible feature.
3. **Missing calendar.** Calibration needs ground truth ("was the ingredient actually there?"), which requires a user study or weeks of instrumented longitudinal logging. Human-subjects review is an institutional dependency that does not compress when you work harder.

And the failure mode is public. On a poster, "73% likely present" invites exactly one question — *how do you know?* — and the honest answer is "we don't." Direction (a) invites the same question and answers it: "because this inventory row says so, here it is, and you can correct it."

**(c) is not a trap but is a non-deliverable.** It spends 24.25 h of 160 and leaves ~100 h idle with nothing to demo. Worse, "fix all 18" includes fixing the headline IDOR — and I confirmed today that `shopping_list_items` has no `user_id` column (`CREATE TABLE` at `supabase/migrations/20251129020000_shopping_list_items.sql` declares `shopping_list_id, ingredient_id, item_name, quantity, unit, category, is_checked, position, notes, created_at`). Writing the fix that test demands would **introduce** a bug to satisfy an assertion. That is the strongest possible argument against shipping (c) as stated: the suite is wrong about its own headline finding.

**(d) is not a close call.** 160 hours, zero production commits in the current stack, against 467 commits of existing work — and it throws away the regression harness that makes any change safe.

---

## 4. The missing skills: weekend, or redesign?

Three distinct skills, three different verdicts. Do not treat them as one.

**Skill 1 — Writing a Supabase migration with RLS policies. VERDICT: learnable, the weekend of Saturday 19 – Sunday 20 September 2026.**
This is pattern transfer against working in-repo exemplars, not new knowledge. `supabase/migrations/` holds 13 migrations, and three (`20251129010000_shopping_lists.sql`, `20251129020000_shopping_list_items.sql`, `20251129030000_user_inventory.sql`) are structurally identical templates, each with `ENABLE ROW LEVEL SECURITY` and policies you can copy. Concrete weekend deliverable: a migration creating `shopping_list_shares` with RLS, a `CHECK (quantity > 0)` on `user_inventory`, and an executed test proving a cross-user select returns zero rows. Two people, one keyboard.

> ***Corrected 2026-09-13 — this weekend was scheduled without being costed, and it collides with the cut order.***
> **(1) Cost it.** "Two people, one keyboard" across Saturday and Sunday is roughly **16–20 person-hours**, against the **8.75 h** the identical work is priced at in [`12-milestones.md`](12-milestones.md) N5b and [`03-engineering-evidence.md`](03-engineering-evidence.md) (D1 2.5 + D2 1.75 + D3 1.0 + D11 3.5). The gap is not an error in either number: 8.75 h is the *fix* estimate; the weekend is a *skill-acquisition* exercise that happens to produce the fix, and pairing doubles the person-hours by design. **It must be budgeted as ~16–20 person-hours of learning, not as 8.75 h of delivery**, and §6 below does not currently carry it either way.
> **(2) The scope collision, named and not settled.** [`12-milestones.md`](12-milestones.md) and [`14-cut-list.md`](14-cut-list.md) CUT 1 both make the share-route hardening **the first thing to cut**; this section schedules it as a named weekend, and §6 below budgets it as one of three **in-scope** defects. **Whether the share route ships or is reported found-and-not-fixed is one of the four open team decisions, and this document does not pick.** What the team must decide, explicitly, at the first cut checkpoint: *(i)* share route ships — then the weekend and its ~16–20 person-hours are in the budget and N5b is not cut; or *(ii)* share route is reported found, proved, priced at 8.75 h and **not fixed** — then this weekend still has value as skill acquisition, but its deliverable must be retargeted to a migration the plan actually needs (the `CHECK (quantity > 0)` on `user_inventory`, which N5a requires either way) and **the poster must stop saying the share route was closed**. Picking (i) silently by leaving this paragraph unchanged is the outcome to avoid.

**Skill 2 — Shipping any production change to the Next.js App Router. VERDICT: not a weekend skill; de-risk by making the first one trivial and immediate.**
Within the first three days, ship one small but real change to `web/src` through the full PR process. The point is not to learn Next.js. The point is to discover whether local dev, env vars, the Supabase connection, and CI actually work *while there is still time*. In month one the framework is almost never the risk; the environment is.

**Skill 3 — Running a user study / calibrating a probability model. VERDICT: redesign around it.**
The blocker is institutional and calendrical, not intellectual. The redesign: replace *"estimate the probability the ingredient is present"* with *"deterministically ask about the items whose absence would change the ranking."* Same user benefit, no calibration, no study — and the selection rule is itself unit-testable: **ask about item X if and only if flipping X's presence changes the top-ranked plan.** That converts an unanswerable statistical question into a testable combinatorial one, which is precisely the trade this team should be making everywhere.

---

## 5. Ownership, and the bottleneck

### Roles (assign by role now; see below for how to earn names)

| Role | Owns | Done when |
|---|---|---|
| **R1 Schema & Authorization** | `supabase/migrations/`, the `shopping_list_shares` migration + RLS, `quantity` CHECK, affected-rows checks in `transfer/route.ts` | An executed test shows cross-user access returns zero rows |
| **R2 Ranking Core** | Deterministic ranker + typed rationale in `backend/api/`. Pure functions, no I/O | Same fixture yields byte-identical ranking and rationale, asserted |
| **R3 Surface & Correction Loop** | Rationale rendering in `web/src`, correct-inputs-and-re-rank | A user changes a value in the running app and sees the ranking change |
| **R4 Evidence & Deliverables** | Test harness and standard, CI gate, disclosures, report, poster, demo | Every report claim traces to a run log or a file and line |

**The anti-bottleneck mechanism is contract-first, and it costs 6 hours.** On day one, before anyone builds, the whole team freezes one JSON shape — the ranked-plan-plus-rationale type — and commits fixture files. After that R2 builds against fixtures, R3 renders fixtures, R1 migrates independently, R4 tests fixtures. Nobody blocks anybody for two weeks. This is the single most important structural decision in the plan.

**R4, honestly.** *Corrected 2026-09-13:* this line read *"R4 is not a consolation role. It owns the team's one proven differentiator and roughly 30 hours of scheduled work"* — and by this file's own tables that was not true twice over. **Remedy 1 below removes test authorship from R4** ("whoever writes the code writes its test"), so R4 does not own the differentiator; and the only 30.0 h line in §6 is **"Report, poster, demo recording, rehearsal"**, so "roughly 30 hours" traced to documentation, which is the consolation role the sentence denied. The defensible case is the one worth making instead: **R4 owns the harness, the testing standard, the CI gate, and every graded deliverable** — on §6's own lines that is the **30.0 h** deliverables block plus an unquantified share of the **14.0 h** integration/CI/review block, i.e. **up to 44.0 h of the 134.25 h subtotal**, the largest single concentration of scheduled hours in the plan. **How the 14.0 h splits between R4 and the rest of the team is not allocated anywhere — unknown**, and allocating it is a five-minute decision at the day-one contract freeze. Whether that is a consolation role is a judgement the team should make with those numbers on the table, not one this sentence should have settled by assertion.

### What the evidence supports right now (weak, stated as such)

**FACT:** Sihao is the only person who has committed executable tests here; Mr-Jeffery is the only person who has committed automation; andyyuyc and wenboli have committed only `.md`/`.txt` in this window; the `Amihua` account performs all PR merges.

**INFERENCE:** Sihao is a candidate for R2 or R4; Mr-Jeffery for R2 or the CI half of R4; whoever operates `Amihua` is already doing integration and should hold the CI gate.

**Explicitly NOT an inference:** that andyyuyc and wenboli cannot code. The log shows we *do not know*. And one of them should take R1 or R3 anyway — concentrating all code on the two who already have commits rebuilds the exact bottleneck we are removing.

**UNKNOWN:** which person operates the `Amihua` account. Branch names (`p1a-Andy`, `p1a-Sihao`, `p1a-Jeffery`, `p1a-wenbo`) suggest a fork owner merging everyone's work, but the log does not prove the mapping.

### The evidence that would let us assign by NAME (do this in 48 hours, costs ~6 person-hours)

1. **A 90-minute timed calibration exercise, identical for all four, in this repo:** add a failing test for the `quantity || 1` defect, make it pass, open the PR. Record time-to-green and where each person stalled. This produces exactly what the missing biographies would have produced, and it is auditable.
2. **A prior-stack inventory with artifacts** — a repo, a course, a job where they shipped TypeScript/React, SQL/Postgres, Python. Claims without artifacts get recorded as claims.
3. **A real availability declaration.** The 10 h/person/week is an *assumption*. If one person has four, the plan changes. Say so out loud.

### The single highest-risk dependency on one person

**Sihao Liu — because 100% of the team's committed executable output in P1a is attributed to him.** All **3 TypeScript test files and all 2 Pytest files; every one of those 554 lines** (*corrected 2026-09-13: this read "4 TypeScript test files and all 3 Pytest files … 570 lines", which promoted file-type counts into test-file counts and folded 16 lines of Jest config and `__init__.py` into "executable output" — see §1*).

> ***Corrected 2026-09-13 — the risk claim itself was overstated, by exactly the inference §0 forbids.*** This paragraph said *"testing currently has a bus factor of 1."* That is a universal claim about ability inferred from absence of commits, which §0 of this very file calls **"weak-to-worthless"** and **"consistent with pair programming under one author"**. We convicted the Codex analyst of switching propositions without switching evidence and then did it in our own risk section. **The artifact claim the evidence actually supports: all committed test authorship in this window is attributed to one account, so we hold no artifact showing that anyone else on this team can author a test here.** Bus factor is **unknown**, not 1 — and the 90-minute timed calibration exercise proposed above is exactly the thing that settles it, because it produces an artifact per person instead of an inference from silence. Schedule it before quoting any bus-factor number.

The planning consequence does not depend on the overstatement, which is why it is safe to keep: my recommended direction leans *harder* on testing than P1a did, so the plan as written would concentrate that risk further rather than relieve it.

**Removal, in order of cost-effectiveness:**

1. **Re-assign test authorship by component, not by person.** R1 writes the RLS tests, R2 the ranker tests, R3 the rendering tests. R4 owns the *harness and the standard*, and reviews. Rule: whoever writes the code writes its test. This costs **no additional scheduled hours — it is the same tests, differently assigned — but it is not free**: *corrected 2026-09-13, the previous wording claimed it "takes the bus factor from 1 to 4 in week one at zero additional hours", and neither half holds.* Three of the four members have **no demonstrated test authorship in this repository**, so the reassignment moves work onto unproven authors at an **unknown ramp cost**, and what it produces on day one is **four nominal test owners, not four demonstrated ones**. **Four demonstrated test authors is the outcome to be verified in week one, not the claimed effect of the assignment** — and the 90-minute calibration exercise plus the first green PR from each of the four is what verifies it. If the ramp cost turns out to be material, it lands on the milestones, and there is no reserve line named for it here.
2. **Forbid sole authorship on the critical path for two weeks.** Pair the 19–20 September migration weekend with one of the two people who have no code commits yet.
3. **Convert tacit knowledge into an artifact.** R4's first deliverable, due 20 September: a one-page `TESTING.md` — how to run each suite, what a real assertion looks like, and the explicit rule that source-text greps are documentation, not attack tests. A written standard survives an absence; a person does not.
4. **Second-order, lower stakes:** Mr-Jeffery is the sole author of all automation. Same remedy.

---

## 6. Budget: 160 hours, honestly — **SUPERSEDED as a plan; retained as a work-type view**

> ***Corrected 2026-09-13.*** Two same-day, same-model graded documents were publishing irreconcilable budgets for the same month. **[`12-milestones.md`](12-milestones.md) is the single budget of record** — it is the graded D3 deliverable, it carries the N4 re-cost, and it is the one the cut list is keyed to. The table below is a **decomposition by work type, not a plan**, and where it disagrees with 12-milestones, 12-milestones governs. The disagreements are listed rather than harmonised, because harmonising them silently would hide the one that matters:
>
> | Line here | Hours here | 12-milestones | There | Δ |
> |---|---|---|---|---|
> | Report, poster, demo recording, rehearsal | 30.0 | fixed overhead: report 24 + poster 12 + demo 10 | **46.0** | **16.0** |
> | Contract freeze + fixtures | 6.0 | N1 (claim freeze + one-command env + harness skeleton) | **12.0** | 6.0 |
> | Deterministic ranker + Pytest | 30.0 | N2 | **24.0** | 6.0 |
> | Rationale rendering + Jest (28.0) **+** correction loop API + re-rank (14.0) | 42.0 | N3 | **22.0** | **20.0** |
> | Three in-scope defects + regression tests | 12.25 | N5 (N5a 10.0 + N5b 8.75) | **18.75** | 6.5 |
> | Integration, CI, review | 14.0 | integration/merge/review/meeting | 14.0 | 0 |
> | **— no line at all —** | **0** | N4: M0 harness, recorded baseline, correctability measure | **24.0** | **24.0** |
>
> **The 24.0 h hole is the serious one.** This table has no line for the M0 harness and recorded baseline, which [`12-milestones.md`](12-milestones.md) (N4, re-costed to 24 h) and [`13-name-the-test.md`](13-name-the-test.md) (F0+T1+T2+T5 = 24 h, built test by test) both make the graded centrepiece. A budget that omits the centrepiece is not a budget.
>
> **Two of the deltas are already diagnosed and one is not.** The **6.5 h** defect delta is exactly the unexplained block inside 12's N5a (3.5 h of triage-priced work carried at 10.0 h) — see the N5a note there; this table's 12.25 h is the triage-sourced figure (8.75 + 1.5 + 2.0). The **16.0 h** deliverables delta and the **20.0 h** rendering delta have **no stated cause in either document — unknown**; a line-by-line reconciliation at the day-one contract freeze is what would settle them, and it is the cheapest thing on this page. Until that happens, **quote 12-milestones, not this table.**
>
> *Arithmetic check, recomputed today:* the subtotal below is correct as a sum — 30.0 + 6.0 + 30.0 + 28.0 + 14.0 + 12.25 + 14.0 = **134.25**, and 134.25 + 25.75 = 160.0 (reserve = 16.1%). It is the line items, not the addition, that disagree with the plan of record.

| Work | Hours |
|---|---|
| Report, poster, demo recording, rehearsal | 30.0 |
| Contract freeze + fixtures (whole team, day 1) | 6.0 |
| Deterministic ranker + Pytest | 30.0 |
| Rationale rendering + correction surface + Jest | 28.0 |
| Correction loop API + re-rank | 14.0 |
| Three in-scope defects + regression tests | 12.25 |
| Integration, CI, review | 14.0 |
| **Subtotal** | **134.25** |
| **Reserve (16%)** | **25.75** |

The three in-scope defects, and nothing else: the share-route hole (8.75 h), `quantity || 1` (1.5 h), and the transfer route's unchecked affected-rows (~2 h) — 8.75 + 1.5 + 2.0 = 12.25, all three taken from the per-defect triage in [`03-engineering-evidence.md`](03-engineering-evidence.md). *Cross-reference added 2026-09-13:* **whether the share-route hole is in scope at all is an open team decision and is contradicted elsewhere** — [`12-milestones.md`](12-milestones.md) N5b and [`14-cut-list.md`](14-cut-list.md) CUT 1 both make it the first thing cut, while this line and §4's weekend keep it in. **This document does not pick**; if it is cut, this line becomes two defects at 3.5 h and the report carries the share route as found-and-not-fixed at 8.75 h. The other 15 go into the report as documented-but-unfixed with effort estimates. That is a credible engineering position; "we fixed all 18" is not, because one of the 18 should not be fixed.

**Cut line, declared in advance:** the correction loop degrades first — it becomes "edit inventory on the existing page, re-run the ranker." The rationale never gets cut, because it is the thesis.

Two reserve-funded items worth naming (~3.5 h total): delimiting the untrusted preference block in the Gemini prompt, and the expired-food change below.

---

## 7. Two items that are not ranking problems and must not be solved by ranking

**Food safety.** `backend/api/inventory_recommender.py:157` states the rule as: `5. **NEVER**: Do not recommend recipes that ONLY use ❌ EXPIRED items`. That permits recommending a recipe using expired items *alongside* fresh ones, and expired items are never removed from the inventory block sent to the model. Meanwhile `expiration_date` is an unvalidated user-typed `DATE` column, not a regulatory label at all.

External check, and it cuts both ways. FDA on date labels: *"The most common is to inform consumers and retailers of the date to which they can expect the food to retain its desired quality and flavor,"* and *"Consumers should examine foods for signs of spoilage that are past their 'Best if used by' date. If the products have changed noticeably in color, consistency or texture, consumers may want to avoid eating them."* So the product has no basis to assert "expired, unsafe" **or** "expired, discard." The correct move is to stop asserting: in the deterministic ranker, exclude past-date items from scoring, surface them in a separate check-these list with neutral wording, and let the human decide. One unit test covers it. ~2 h.

> *Cross-reference added 2026-09-13:* **this is one side of an open team decision, and the other side is written down too.** This section says **exclude** past-date items from scoring; [`12-milestones.md`](12-milestones.md) N2 instead keeps them in the score with Grocy's expired term **set to zero**, and its P1 says replace the prose rule with an **enforced filter**. These are different systems: a zero-weighted expired item can still be *named on the receipt*; an excluded one cannot, and only one of them is what T6's fixture in [`13-name-the-test.md`](13-name-the-test.md) asserts. **Unresolved — the team picks, not this document.** The FDA reasoning above supports "stop asserting a safety verdict" under either, which is why the argument is safe to keep while the mechanism is open.

**The honest headline for the poster.** Not "18 failures." The strongest and truest claim available is: *we found our own headline security finding was a false positive at system level, and found a worse real bug underneath it* — the transfer route returns `success: true` and a non-zero `transferred_count` for writes RLS silently blocked, while the inventory row was already inserted. Also disclose that most P1a "security tests" are source-text greps (`expect(post).toContain('.eq("user_id", user.id)')`), not executed attacks. The fix is cheap for the defects §6 lists as in scope. The route is real: `web/src/app/api/shopping-lists/share/route.ts` — 96 lines, zero `auth.getUser` calls, confirmed by grep today.

> ***Corrected 2026-09-13 — the test we specified proves nothing.*** This read: *"an unauthenticated POST … asserting it does not return 200 is a real attack that takes minutes."* **Against a database built from this repo's 13 migrations, `shopping_list_shares` does not exist** (`grep -r shopping_list_shares supabase/` returns nothing — re-verified today; it is our own finding D11). The insert therefore throws and the handler returns non-200 **no matter who calls it**, so a test asserting "not 200" **passes for the wrong reason** and demonstrates nothing about authorization. Under our own rule that source-text greps are not attacks, a test that cannot distinguish a refused request from a missing table is not an attack either.
>
> **The unchecked precondition, stated rather than assumed: does the deployed Supabase project actually have a `shopping_list_shares` table?** We do not know — **unknown**. The repository cannot answer it; only someone with access to the deployed project can, and that is a five-minute check, not a research task. The two branches differ completely: if the table exists out-of-band, the route is a live unauthenticated insert with unknown policies; if it does not, the share feature is dead on any fresh deploy. Both are ship-blocking, for different reasons, and we should not write either one down as fact yet.
>
> **The discriminating test, whichever branch holds:** assert on the *reason* for the failure, not the status alone — the unauthenticated POST must fail with **401/403**, and the test must **fail** if the error is a `relation "shopping_list_shares" does not exist` (Postgres `42P01`). Run it against an environment where the table exists — which, if N5b ships, is the migration this section's §4 weekend produces, and if N5b is cut, is a seeded local Supabase built for the test. Either way the assertion is written the same way, and only then does it take minutes.

---

**Sources:**
- [How to Cut Food Waste and Maintain Food Safety | FDA](https://www.fda.gov/food/consumers/how-cut-food-waste-and-maintain-food-safety)
- [Food Product Dating | USDA FSIS](https://www.fsis.usda.gov/food-safety/safe-food-handling-and-preparation/food-safety-basics/food-product-dating) (returned HTTP 403 to automated fetch; cited from search result summary only, not quoted)
- [LLM01:2025 Prompt Injection | OWASP Gen AI Security Project](https://genai.owasp.org/llmrisk/llm01-prompt-injection/)

**Key files:** `web/src/app/api/shopping-lists/share/route.ts`, `web/src/app/api/inventory/transfer/route.ts`, `supabase/migrations/20251129030000_user_inventory.sql`, `supabase/migrations/20251129020000_shopping_list_items.sql`, `backend/api/inventory_recommender.py`