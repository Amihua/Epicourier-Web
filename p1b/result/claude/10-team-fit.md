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

The rival analyst's failure is worse than over-trusting git. Rejecting the source when it constrains a conclusion and rehabilitating it three sections later when it flatters one is *selective* skepticism, which is not skepticism at all. And the specific fallacy in crediting us with the upstream team's TypeScript fluency is a fallacy of composition: the repository contains 467 commits of Next.js/FastAPI/Supabase competence; the repository is ours (as a fork); therefore the competence is ours. Possession of a codebase is not possession of the skills that produced it. Inheriting a house does not make you a carpenter.

**Four distortions our own log demonstrates, which must be disclosed whenever we cite git at all:**

1. **Commit count is not effort.** `wenboli721`'s 14 commits are GitHub web-UI single-file operations — "Add files via upload", "Create README.md", "Delete p1a/prompts/gemini/readme.md" — and that UI emits one commit per file. Sihao's 21 commits include 570 lines of test code. The two numbers are not the same unit.
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

**Zero files under `web/src`, `backend/api`, or `supabase/` were touched by our team.** Confirmed: `git log --since=2026-08-01 --name-only --pretty=format: | grep -E '^(web/src|backend/api)'` returns empty.

Total executable output of the team in P1a: **570 lines across 7 files** (`wc -l web/tests/p1a/*.ts backend/tests/sihao/p1a/*.py`).

**Every one of those 7 files was first committed by a single person.** All 5 test files (`security-attack-cases.test.ts`, `inventory-behavior.test.ts`, `use-case-contracts.test.ts`, `test_adversarial_inputs.py`, `test_recommender_behavior.py`) were added by Sihao Liu on 2026-08-29. All 3 automation scripts were added by Mr-Jeffery. This drives §5.

---

## 2. Which direction lets THIS team build and test the most

**Recommendation: (a), the grounded auditable recommendation — with three defects from (c) folded in, and one idea from (b) rebuilt as a deterministic rule.**

The decisive argument is not that (a) is easier. It is that **(a) converts the project's central artifact from untestable to testable, and testing is the one thing this team has demonstrated densely.**

You cannot write a regression test for "why did the LLM rank this first." The oracle does not exist. A deterministic Python ranker makes the oracle free: same fixture in, identical ranking and identical rationale out, asserted. For a team whose proven skill is Pytest and Jest, moving the product's core into the region where that skill applies is the highest-leverage structural decision available. Every other direction leaves the team's strength pointed at the periphery.

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

R4 is not a consolation role. It owns the team's one proven differentiator and roughly 30 hours of scheduled work.

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

**Sihao Liu — because 100% of the team's executable output in P1a came from him.** All 4 TypeScript test files and all 3 Pytest files; every one of those 570 lines. The team's one demonstrated differentiator is testing, and testing currently has a bus factor of 1. My recommended direction leans *harder* on testing than P1a did, so the plan as written would concentrate that risk further rather than relieve it.

**Removal, in order of cost-effectiveness:**

1. **Re-assign test authorship by component, not by person.** R1 writes the RLS tests, R2 the ranker tests, R3 the rendering tests. R4 owns the *harness and the standard*, and reviews. Rule: whoever writes the code writes its test. This takes the bus factor from 1 to 4 in week one at **zero additional hours** — it is the same tests, differently assigned.
2. **Forbid sole authorship on the critical path for two weeks.** Pair the 19–20 September migration weekend with one of the two people who have no code commits yet.
3. **Convert tacit knowledge into an artifact.** R4's first deliverable, due 20 September: a one-page `TESTING.md` — how to run each suite, what a real assertion looks like, and the explicit rule that source-text greps are documentation, not attack tests. A written standard survives an absence; a person does not.
4. **Second-order, lower stakes:** Mr-Jeffery is the sole author of all automation. Same remedy.

---

## 6. Budget: 160 hours, honestly

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

The three in-scope defects, and nothing else: the share-route hole (8.75 h), `quantity || 1` (1.5 h), and the transfer route's unchecked affected-rows (~2 h). The other 15 go into the report as documented-but-unfixed with effort estimates. That is a credible engineering position; "we fixed all 18" is not, because one of the 18 should not be fixed.

**Cut line, declared in advance:** the correction loop degrades first — it becomes "edit inventory on the existing page, re-run the ranker." The rationale never gets cut, because it is the thesis.

Two reserve-funded items worth naming (~3.5 h total): delimiting the untrusted preference block in the Gemini prompt, and the expired-food change below.

---

## 7. Two items that are not ranking problems and must not be solved by ranking

**Food safety.** `backend/api/inventory_recommender.py:157` states the rule as: `5. **NEVER**: Do not recommend recipes that ONLY use ❌ EXPIRED items`. That permits recommending a recipe using expired items *alongside* fresh ones, and expired items are never removed from the inventory block sent to the model. Meanwhile `expiration_date` is an unvalidated user-typed `DATE` column, not a regulatory label at all.

External check, and it cuts both ways. FDA on date labels: *"The most common is to inform consumers and retailers of the date to which they can expect the food to retain its desired quality and flavor,"* and *"Consumers should examine foods for signs of spoilage that are past their 'Best if used by' date. If the products have changed noticeably in color, consistency or texture, consumers may want to avoid eating them."* So the product has no basis to assert "expired, unsafe" **or** "expired, discard." The correct move is to stop asserting: in the deterministic ranker, exclude past-date items from scoring, surface them in a separate check-these list with neutral wording, and let the human decide. One unit test covers it. ~2 h.

**The honest headline for the poster.** Not "18 failures." The strongest and truest claim available is: *we found our own headline security finding was a false positive at system level, and found a worse real bug underneath it* — the transfer route returns `success: true` and a non-zero `transferred_count` for writes RLS silently blocked, while the inventory row was already inserted. Also disclose that most P1a "security tests" are source-text greps (`expect(post).toContain('.eq("user_id", user.id)')`), not executed attacks. The fix is cheap for the three in scope: an unauthenticated POST to `web/src/app/api/shopping-lists/share/route.ts` — 96 lines, zero `auth.getUser` calls, confirmed by grep today — asserting it does not return 200 is a real attack that takes minutes.

---

**Sources:**
- [How to Cut Food Waste and Maintain Food Safety | FDA](https://www.fda.gov/food/consumers/how-cut-food-waste-and-maintain-food-safety)
- [Food Product Dating | USDA FSIS](https://www.fsis.usda.gov/food-safety/safe-food-handling-and-preparation/food-safety-basics/food-product-dating) (returned HTTP 403 to automated fetch; cited from search result summary only, not quoted)
- [LLM01:2025 Prompt Injection | OWASP Gen AI Security Project](https://genai.owasp.org/llmrisk/llm01-prompt-injection/)

**Key files:** `web/src/app/api/shopping-lists/share/route.ts`, `web/src/app/api/inventory/transfer/route.ts`, `supabase/migrations/20251129030000_user_inventory.sql`, `supabase/migrations/20251129020000_shopping_list_items.sql`, `backend/api/inventory_recommender.py`