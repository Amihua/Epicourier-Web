# The Pivot Question — stay or go?

**Prompt:** P12 · **Run date:** 2026-09-13 · **Model:** Claude Opus 5 (1M context), `claude-opus-5[1m]`

Asked with the Project 1a product deliberately set aside, because the risk this prompt exists to catch is anchoring. The team's demonstrated output in Project 1a was ~~adversarial testing and evidence discipline~~ **evidence discipline and document auditing** (*corrected 2026-09-13*), not shipping features — so at least one option that plays to *that* was required.

> *Why the narrowing.* This same file calls our P1a "security tests" *"`toContain` greps"* and our biggest methodological embarrassment, and concedes the headline IDOR was a false positive at system level. **Adversarial testing is therefore not a demonstrated skill here; it is the thing we did badly.** What the tree does demonstrate is evidence discipline — `p1a/traceability/` with four per-model traceability documents and a reconciled `final-traceability.md`, plus a retraction we made against ourselves. The options below should rest on that and not on the other.

---

> ## ⚠ This file dissents from the rest of the column, and the dissent is unresolved
>
> Every other deliverable here — [`08`](08-three-futures.md), [`11b`](11b-mission-final.md),
> [`12`](12-milestones.md), [`14`](14-cut-list.md), [`15`](15-codex-prompt-reruns.md) — builds
> **the receipt, inside Epicourier**. This file, which is prompt P12 run cold with the product
> deliberately set aside, returns **Pivot**. We are not editing its verdict to match the others,
> because the whole point of P12 is to be answered without knowing what the rest of the plan says.
>
> **Its argument is the strongest objection anyone has raised, and nothing in the column answers
> it:** the chosen plan puts on its critical path the three things this team has **zero commits
> behind** — a production `.tsx` change, a Supabase migration, and an RLS policy — while the
> 24.25 h defect estimate is priced for a competent fixer rather than for us.
>
> **This is a decision the team has to make, not one this document made.** Note that the verdict
> carries its own escape hatch: if a non-product artifact is outside the rubric, it recommends
> staying in Epicourier and spending the budget turning the greppy P1a suite into executed
> attacks. That narrow version is compatible with [`12`](12-milestones.md)'s N5a and is the
> obvious reconciliation if the team wants one.
>
> Recorded here rather than resolved, because a pivot question that always answers "stay" was
> never a question.
>
> *Added 2026-09-13:* the "zero commits behind" argument quoted above **does not separate the two
> options as cleanly as it reads** — Kind 1 needs seed SQL by its own admission and its demo
> deliverable is a production `.ts` change. The honest, narrower version is in the Verdict's
> correction below. The dissent itself stands; only its strongest-sounding sentence is narrowed.

---

## 0. What I re-verified before answering (all commands run 2026-09-13 against the working tree)

I did not take the brief's git claim on faith. Re-run on `the repository root`:

`git log --since=2026-08-01 --name-only --format='' | sed 's/.*\.//' | sort | uniq -c | sort -rn`

```
  81 md    18 txt    6 py    4 ts    3 sh    2 gitkeep    1 jsonl
```

63 commits. **Zero `.tsx`. Zero `.sql`. Zero paths under `supabase/`.** The four `.ts` files are, in full:

```
web/tests/p1a/inventory-behavior.test.ts
web/tests/p1a/jest.config.ts
web/tests/p1a/security-attack-cases.test.ts
web/tests/p1a/use-case-contracts.test.ts
```

Three test files and a Jest config. The brief is accurate and, if anything, generous: we have not touched a production source file *or* a schema file. Corroborating facts I pulled while checking:

- **`shopping_list_shares` exists nowhere in SQL.** `grep -rn "shopping_list_shares"` returns hits only in `p1a/evidence/own-tests/*`, `p1a/scripts/context*.txt`, and the route itself. 13 migrations exist; 9 contain `ENABLE ROW LEVEL SECURITY`; the declared tables are `achievement_definitions, challenges, nutrient_goals, nutrient_tracking, shopping_list_items, shopping_lists, streak_history, user_achievements, user_challenges, user_inventory`. The shares table is not among them. Confirmed.
- **Corpus size: 33 files match `web/src/app/api/**/route.ts`.** That number matters below.
- **A 19th defect, newly observed, marked INFERENCE (not executed):** the undo path in `web/src/app/api/inventory/transfer/route.ts` does a read-modify-write — `const newQuantity = existingItem.quantity - (item.quantity || 1)` after a separate `.select()` — with no atomic decrement and no version check. Two concurrent undos lose an update. I did not execute this; treat as hypothesis until run.
- **A capacity fact nobody has written down.** Commits by author since 2026-08-01: Sihao Liu 21, `Amihua` 15, `wenboli721` 14 + `wenboli` 7 (= 21), `andyyuyc` 4, `Mr-Jeffery` 2. Two of the four named students account for 6 of 63 commits. Also, `Amihua` is a **fifth** identity not mapped to any of the four named members — whether that is Andy's second account or a fifth person is **unknown**, and the report should say so rather than guess. ~~Any 160-hour plan that assumes four evenly-loaded people is contradicted by our own history.~~ *Corrected 2026-09-13:* **commits are not hours.** 81 of the **115** file-touches in that histogram are `.md` from a documentation phase (*corrected 2026-09-13: an earlier version said "99"; the histogram sums to 115, and these are file-**touches**, not unique files — the very unit-mixing this correction is about*), so this histogram substantially records *who ran the report-generation scripts*, not who worked. The defensible reading is the narrow one: **"6 of 63 commits" supports "two members committed little to the P1a write-up", and it is a weak but non-zero signal that load was uneven. We have no hours data at all**, and the inference that those two will contribute few hours to a *build* phase — a different kind of work — does not follow from it. **What would settle it: ask the four members what they actually spent on P1a.** That is one message and it should be sent before any hours figure in this file is treated as load-bearing; until then, no recommendation here should rest on it as a spine.

Working budget I hold every option to: ~~160 total − ~35 h (report, poster, demo) − ~15 h (environment, coordination, the four-person async tax our commit distribution predicts) = **~110 h of actual build-and-test.** Each option below is priced against 110, and only one of them fits.~~

> *Corrected 2026-09-13 — the budget was inflated and the "only one fits" claim was false.*
>
> **The capacity figure.** The team's own [`12-milestones.md`](12-milestones.md) fixes the overhead at **60 h** — report 24, poster 12, demo 10, integration/merge/review/meeting 14 — leaving **160 − 60 = 100 h** of build-and-test, and [`08-three-futures.md`](08-three-futures.md) reaches the same 60/100 **totals** on the same date — though not the same composition: 08 puts the 12 h one-command environment inside the 60 h overhead, while 12 puts it inside N1, inside the 100 h. Same totals, different contents; noted so nobody reconciles the two by adding them. This file invented 10 h of extra capacity by pricing overhead at 50 h, then priced all three options at exactly that inflated figure. **The working budget is 100 h.**
>
> **The "only one fits" claim, recomputed from this file's own line items:**
>
> | Option | Line items | Sum |
> |---|---|---:|
> | Kind 1 | 25 + 35 + 15 + 20 (**baseline**) | **95 h** |
> | Kind 1 | + 15 h the text itself labels *"Stretch, not baseline"* | 110 h |
> | Kind 2 | 20 + 30 + 20 + 15 + 25 | **110 h** |
> | Kind 3 | 20 + 30 + 25 + 20 + 15 | **110 h** |
>
> All three totalled **exactly 110**, so against a 110 h budget nothing distinguished them by cost and the sentence was contradicted by every section that followed it. Against the true **100 h**: **Kind 1's 95 h baseline is the only one that fits, with 5 h of margin** — and its own 15 h stretch item does not fit on top of it. Kind 2 and Kind 3 are each **10 h over** and are **not re-cut here**; which line comes out of each is an open question this file does not answer, and the option headers below still carry their as-written sums.

---

## Project Kind 1 — `rls-diff`: an executed-attack authorization harness (CLI + library + CI check)

**Different form** (CLI/library, no UI), **different user** (developers and reviewers on Postgres/Supabase RLS stacks), **different domain** (appsec tooling, not food).

**Why this team specifically.** Our file histogram *is* the shape of this artifact: `.py` + `.sh` + `.ts` test files + `.md`. We have already shipped runnable tooling in this repo — `p1a/scripts/gather_context.sh`, `gather_context_mini.sh`, `gather_context_slim.sh`, `run_local_model.py`, `run_step7.py` — so "team writes a script that produces evidence" is demonstrated, not aspirational. And we hold the asset a security tool cannot buy: **18 self-labelled candidate defects in a real app, one of them already retracted** (*corrected 2026-09-13: this read "a labelled ground-truth set of 18 confirmed defects"*), including one hole with literally no policy to read. A tool's recall against a labelled set is a measurable result; that is a report and a poster — **but only if the set is made into ground truth first.**

> *Why the downgrade, stated here and not only in the validation paragraph.* Our headline IDOR was a false positive at system level, the 19th defect above is marked **INFERENCE (not executed)**, and the labels were produced by the same LLM-assisted reading this tool would automate — so recall measured against them measures **agreement with ourselves**, not detection. **Rule for the recall denominator: a candidate enters it only after an executed reproduction** (the two-user HTTP attack of the executed pass), and everything else is reported separately as unconfirmed. How many of the 18 survive that bar is **unknown today** — nobody has run them — and this file does not guess a number. The executed pass is what converts the asset into one; until it runs, "ground truth" is the wrong word and the poster must not use it.

**The honest prior-art check.** Supabase already ships most of the database half. Its docs state you can "Create a basic test to verify RLS is enabled across an entire schema" via `select tests.rls_enabled('public');`, plus `tests.authenticate_as()` to "Switch contexts" and `policies_are()` to "test all policies on a named table." So **do not build an RLS linter** — that is solved, and claiming novelty there would be exactly the kind of unearned assertion we are criticising Codex for. The unsolved join is one level up: pgTAP tests the *database*, and cannot see that `web/src/app/api/shopping-lists/share/route.ts` constructs a bare `createClient(NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY)`, never calls `auth.getUser`, and inserts into a table that is not in the schema at all. Route → table → migration → policy is the gap, over a 33-file corpus.

**One-month slice — 95 h baseline, plus a 15 h stretch item = 110 h.** *(Re-totalled 2026-09-13: the 95 h baseline is the only option total in this file that fits the corrected 100 h budget; the stretch item does not fit on top of it.)*
- Static pass (~25 h): parse the 33 route files for `.from("<table>")`, how the client was constructed (bare vs cookie-bound), presence of `auth.getUser`, presence of an ownership predicate; join against tables declared in `supabase/migrations/`. Output one table: route × table × RLS-declared? × auth-checked?. This alone re-derives the `shopping_list_shares` finding mechanically.
- Executed pass (~35 h): local Supabase, seed users A and B, replay each mutating route as A against B's rows, assert deny **at the HTTP layer**. This is what retires the methodological caveat: greps become attacks. **Named risk:** this needs seed SQL, the one skill with zero commits behind it. Budget 8 of those 35 as learning and lean on `tests.create_supabase_user()` rather than authoring policies.
- Response/rowcount oracle (~15 h): assert that a mutation route's success payload is consistent with rows actually affected. This catches the two `shopping_list_items` updates in `transfer/route.ts` — `is_checked: true` at `:95` and `is_checked: false` at `:154` (*corrected 2026-09-13: this read `:98` and `:152`; read today, `:98` is the `if (checkError)` test and `:152` the `await supabase` of the second update, and neither is the call. [`08-three-futures.md`](08-three-futures.md) had the same site as ":93 and the delete at :152" and is corrected to match; [`12-milestones.md`](12-milestones.md) still says `:98`. The `.delete()` at `:170` is against `user_inventory` — a different table, and the read-modify-write at `:167` recorded as an unexecuted hypothesis above*) — **generically** rather than as a one-off, and it is the most genuinely novel piece — silent `success:true` on a zero-row RLS-blocked update is a bug class, not a bug.
- Validation + write-up (~20 h): run against our own 18 (plus the concurrency hypothesis), report recall and false-positive rate honestly, *including* that our headline IDOR was a false positive at system level — that disclosure is the credibility of the whole project.
- Stretch, not baseline (~15 h if it exists): fix the transfer row-count check as the demo's before/after. The share-route fix at ~8.75 h requires writing a migration and an RLS policy; do not put a skill with zero demonstrated commits on the critical path.

**What we lose.** The "we extended a product" arc. Sixteen of the eighteen defects stay in the tree. If the rubric rewards a user-facing feature, a CLI with a terminal demo scores worse than a screen. **Unknown: whether the course rubric permits a new artifact rather than extending the P1a product.** That is a go/no-go question for the instructor, and it should be asked before any hours are spent.

---

## Project Kind 2 — a claim-to-evidence auditor (bot)

**Different form** (GitHub PR bot / CLI), **different user** (anyone publishing prose claims about a codebase — reviewers, students, and specifically people reviewing LLM-agent output), **different domain** (document integrity).

**Why this team specifically.** This is the one thing we provably did better than the competing analyst, and the git record shows it: 81 `.md` + 18 `.txt` of 99 touched files, and `p1a/traceability/` already contains `p1a_claude_traceability.md`, `p1a_codex_traceability.md`, `p1a_gemini_traceability.md`, `p1a_claude_step7.md` and a reconciled `final-traceability.md`. That directory is a hand-built, four-model version of this tool's output. We re-grepped every defect against the current tree on 2026-09-13; we caught an analyst rejecting git evidence in one section and leaning on it three sections later; we downgraded our own headline finding. Claim → evidence → verdict, with fact/inference/hypothesis kept separate, is our demonstrated competence stated as a product.

**Build.** Claim extractor (LLM over a Markdown doc) → evidence locator (grep/AST over the tree) → verdict per claim: *supported* (with `file:line`), *contradicted*, or *unverifiable-in-tree*, each forced to carry a fact/inference/hypothesis label. Plus a drift mode: re-run an old report against `HEAD` and flag claims that have gone stale. Two-model adversarial referee (one asserts, one refutes) — multi-model orchestration is already demonstrated across `p1a/prompts/{claude,codex,gemini,qwen2.5}` and `p1b/prompts/`.

**One-month slice (110 h as written — 10 h over the corrected 100 h capacity, not re-cut here):** extractor 20, locator 30, verdict + report rendering 20, bot wiring 15, evaluation 25 — where the eval set is our own P1a write-up, every claim hand-labelled supported / false-positive / superseded. We are the only team that owns that labelled set, because we are the only team that produced a document and then audited it.

**What we lose.** No security artifact, no product change, and the food app is untouched. The real risk is that this reads as an LLM wrapper: unless the report carries measured precision/recall against the hand-labelled set, it is a demo, not a result. If the eval is cut for time, the project is worthless — so the eval is the deliverable, not the polish.

---

## Project Kind 3 — a domain-safety eval corpus + runner for LLM features (benchmark + empirical report)

**Different form** (corpus + runner + measurement paper), **different user** (LLM app developers; the research/course audience), **different domain** (safety oracles, not recipes).

**Why this team specifically.** Adversarial input design is in the tree under two names: `backend/tests/sihao/p1a/test_adversarial_inputs.py` and `web/tests/p1a/security-attack-cases.test.ts`. Multi-model orchestration is in the tree as four prompt directories and `p1a/evidence/model-runs/codex-p01-transcript.jsonl`. And we own two specific, real seeds: UC5 goal and UC17 preference are unbounded free text interpolated directly into the Gemini prompt with no untrusted-data boundary — textbook OWASP LLM01, which OWASP defines as occurring "when an attacker manipulates the input given to an LLM in order to override, bypass, or alter the model's intended instructions" — and the stranger one, that UC17 prioritises ingredients the system itself labels `"EXPIRED"` / `"EXPIRING NOW"`, so the product recommends cooking food it believes has expired.

**The honest prior-art check.** promptfoo already exists and is "an open-source tool that helps identify and remediate many of the vulnerabilities outlined in the OWASP LLM Top 10," producing "a comprehensive report card that enumerates the OWASP Top 10 vulnerabilities and their severities," driven from a CLI. **We must not build a red-team framework.** Generic injection detection is done. What is not done is the *domain* oracle: "did the assistant instruct a user to eat something the system's own data says is expired" is not a plugin anyone ships, and it is a safety question rather than a ranking question. Build ours as assertions/plugins on top of an existing runner if that is cheaper than a runner of our own.

**One-month slice (110 h as written — 10 h over the corrected 100 h capacity, not re-cut here):** oracle definition + labelling rubric 20; ~150-case corpus (injection via goal/preference, expired-ingredient scenarios, quantity edge cases including the `quantity || 1` path where `0` becomes `1` and negatives persist against a `DECIMAL(10,2) NOT NULL DEFAULT 1` column with no `CHECK`) 30; runner across ≥2 model families 25; measurement with inter-rater agreement on a hand-labelled subset 20; ship one mitigation (an untrusted-data boundary plus a hard expiry filter) and re-measure 15.

**What we lose.** All of the authorization and data-integrity work, including the one genuinely unmitigated hole. And the failure mode is thin results: "models do the unsafe thing X% of the time" is a slide, not a project, unless the before/after mitigation number lands.

**Schema constraint that binds all three, restated because it kills a tempting framing:** `user_inventory` upserts on `(user_id, ingredient_id, location)` and sums quantities into one row. No lots, no per-lot expiry, no provenance. Any option that promises to show "which pantry **lot** drove this" is promising something the schema cannot represent. Say **item**, or add the table and pay for it.

---

## Verdict

**Pivot — but pivot the form, not the subject: stop treating Epicourier as the product to extend and start treating it as the labelled corpus for a tool we build, and build Project Kind 1.** The case is not that the current plan is uninteresting; it is that the current plan puts a production `.tsx`/`.ts` change, a Supabase migration and an RLS policy **on its critical path**, all three being things this team has zero commits behind, while the ~24.25 h estimate is priced for a competent fixer rather than for us.

> *Corrected 2026-09-13 — this argument was overstated, and the overstatement was load-bearing.* As first written it said the current plan requires "precisely the three things this team has zero commits behind", implying Kind 1 escapes them. **It does not.** Kind 1's executed pass admits in its own line item that *"this needs seed SQL, the one skill with zero commits behind it"* and budgets 8 of its 35 h as learning; it runs against a local Supabase; and the verdict's own demo deliverable — *"the `transfer/route.ts` row-count check"* — **is a production `.ts` change**. The capability gap therefore disqualifies the status quo and the replacement to a similar degree, and the honest claim is narrower and still worth making:
>
> **Kind 1 moves the migration-and-RLS work off the critical path; it does not eliminate it.** If the seed SQL turns out to be beyond us, Kind 1 loses its executed pass — its whole thesis — so the risk is *relocated and capped at 8 priced hours of learning*, not removed. **That 8 h is the honest price of the capability argument, and it is the number the team should interrogate, not "zero commits behind" as a disqualifier that Kind 1 also trips.** And see the correction at §0: the commit histogram is a weak signal of load, not a measurement of hours, so it cannot carry this argument on its own either.

Kind 1 puts **most** of its hours on file types we have actually shipped (`.py`, `.sh`, `.ts` tests, `.md`) with the SQL exposure priced and bounded, converts our biggest methodological embarrassment into the product thesis (our "security tests" were `toContain` greps; this tool executes the attack instead), keeps the 18 **self-labelled candidate defects — one already retracted, and none yet reproduced by execution** — as a recall set no other team can obtain *once the executed pass turns them into one*, and still ends with a real production fix — the `transfer/route.ts` row-count check at `:95` and `:154` — as the demo's before/after, with the 8.75 h migration-shaped share-route fix deliberately off the critical path (which is [08's open decision (c)](08-three-futures.md) seen from the other side: `12` and `14` also cut it, `08`'s SAFE option prices it in). Do one thing first, before writing any code: ask the instructor whether the rubric permits a non-product artifact, because if the answer is no, then the correct move is the narrow version of the same idea — stay in Epicourier, spend the ~~110~~ **100 h** (*corrected 2026-09-13, see §0*) turning the greppy P1a suite into executed two-user attacks plus the two fixes those attacks prove, and let the harness be the by-product rather than the headline.

Sources:
- [pgTAP: Unit Testing | Supabase Docs](https://supabase.com/docs/guides/database/extensions/pgtap)
- [Advanced pgTAP Testing | Supabase Docs](https://supabase.com/docs/guides/local-development/testing/pgtap-extended)
- [Testing Overview | Supabase Docs](https://supabase.com/docs/guides/local-development/testing/overview)
- [Row Level Security | Supabase Docs](https://supabase.com/docs/guides/database/postgres/row-level-security)
- [OWASP LLM Top 10 | Promptfoo](https://www.promptfoo.dev/docs/red-team/owasp-llm-top-10/)