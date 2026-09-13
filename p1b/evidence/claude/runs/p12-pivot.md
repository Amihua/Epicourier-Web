# P12-pivot

**Workflow:** P1b Claude decide and commit (run 3)  
**Phase:** Classify  
**Model:** Claude Opus 5 (1M context), `claude-opus-5[1m]`  
**Agent id:** `ad86941daf99d6898`  
**Tool calls:** 13 total — 3 web searches, 2 pages fetched  
**Raw transcript:** `raw/agent-ad86941daf99d6898.jsonl` (full tool-call trace, retained)

---

## Prompt, exactly as issued

```text
Forget the current plan for a moment. Here are the facts, nothing else.

HARD BUDGET: four graduate students, ONE MONTH, ~10 h/person/week = about 160 person-hours TOTAL,
to build AND test. The team must ALSO produce a report, a poster and a demo out of that same 160.

THE TEAM, stated as honestly as the evidence allows:
- Four graduate students: Andy (andyyuyc), Sihao Liu, Jeffery (Mr-Jeffery), Wenbo Li.
- Individual biographies have NOT been collected. That is a real gap and the report should say so.
- What the repository DOES prove, from git log --since=2026-08-01 --name-only on our fork: our
  team's ~63 commits during Project 1a touch almost exclusively .md, .txt, .sh, .py and a handful
  of .ts TEST files. Our team has not yet changed a production source file in this codebase.
  The TypeScript/Next.js/FastAPI/Supabase fluency visible in the repository belongs to the
  UPSTREAM team (467 commits, ending 2025-12-07), not to us.
- Demonstrated by us in P1a: writing Jest and Pytest tests, adversarial/security test design,
  evidence discipline, multi-model prompt orchestration, technical writing.
- NOT yet demonstrated by us: shipping a production change to this Next.js app, writing a
  Supabase migration, changing the FastAPI recommender, running a user study.
- Note the methodological point: git history is weak evidence about who OWNS a skill but strong
  evidence about what the team has DEMONSTRATED. The rival Codex analyst rejected this source
  outright and then, three sections later, used repository evidence to assert team capability —
  attributing the upstream team's skills to us. Do not repeat that error.

WHAT WE LEARNED IN PROJECT 1A:
OUR OWN ENGINEERING POSITION, re-derived from the repository on 2026-09-13 (not from the P1a
write-up — every defect was re-grepped against the current working tree):

- P1a run logs, ours, auditable: Web functional 32 tests 31 PASS / 1 FAIL; Backend 18 cases
  18 PASS. Including adversarial: Web 44 executed 33 PASS / 11 FAIL; Backend 25 executed 18 PASS
  / 7 FAIL. The inherited suite passed 1,095/1,096 in 3.6 s — that is the PREVIOUS team's suite
  and must never be used as our boast.
- 18 recorded FAILs collapse to 17 distinct source defects, plus 1 new one found in this audit.
  All 18 confirmed still present. Total competent fix + regression test effort: ~24.25 h.
- METHODOLOGICAL CAVEAT WE MUST DISCLOSE: most of the P1a "security tests" are source-text greps
  (e.g. expect(route).toContain('.eq("user_id", user.id)')), not executed attacks. Reporting 11
  failures without saying this inflates their credibility.
- THE HEADLINE IDOR IS PROBABLY A FALSE POSITIVE AT SYSTEM LEVEL. shopping_list_items has no
  user_id column; RLS enforces ownership through the parent list; the route uses the cookie-bound
  anon client. The "fix" the failing test demands would query a column that does not exist.
- THE REAL BUG UNDER UC20 IS BETTER THAN THE CLAIMED ONE. RLS does block the cross-user write,
  but web/src/app/api/inventory/transfer/route.ts never inspects how many rows the update
  touched (:98 checks only checkError; the DELETE path at :152 discards the result), so it
  returns success:true and transferred_count:N for transfers that did not happen — while the
  inventory row WAS inserted. That is silent data loss, and UC20's postcondition then deletes the
  completed list.
- THE ONE GENUINELY UNMITIGATED HOLE: web/src/app/api/shopping-lists/share/route.ts builds a bare
  anon client, never calls auth.getUser, never checks that shoppingListId belongs to the caller,
  and feeds expiryDays straight into Date.setDate(). Its table, shopping_list_shares, has NO
  migration, NO ENABLE ROW LEVEL SECURITY and NO policy anywhere in supabase/migrations/. Every
  other authorization finding was downgraded because we could read the policy that catches it;
  here there is nothing to read. ~8.75 h to fix properly (migration + RLS policy, then auth, then
  ownership query, then bound expiryDays).
- quantity || 1 at transfer/route.ts:65,:80,:167 — user_inventory.quantity is
  DECIMAL(10,2) NOT NULL DEFAULT 1 with NO CHECK constraint. Negatives persist; 0 becomes 1.
  Unguarded data corruption, 1.5 h.
- SCHEMA BLOCKER FOR ANY "LOT" LANGUAGE: user_inventory upserts by
  (user_id, ingredient_id, location) and SUMS quantities into one row. There are no per-purchase
  lots, no per-lot expiry, no provenance. A promise to "show which pantry LOT caused this ranking"
  is not representable in the current schema. Either add the table or say "item", not "lot".
- SAFETY EXPOSURE NEITHER ANALYST CAUGHT UNTIL NOW: UC17 prioritises ingredients that are
  expiring OR ALREADY EXPIRED, and the prompt labels them "EXPIRED"/"EXPIRING NOW". The product
  actively recommends cooking food it believes has expired. That is a food-safety question, not a
  ranking question.
- The free-text goal (UC5) and preference (UC17) are unbounded and are interpolated directly into
  the Gemini prompt with no untrusted-data boundary.

RULES: Do not invent products or sources. Use WebSearch/WebFetch for any market claim (load with
ToolSearch "select:WebSearch,WebFetch" if absent). Quote real page text. Write "unknown" rather
than something plausible. Separate fact, inference and hypothesis. Respect the 160-hour budget in
every recommendation.

Question: is there a DIFFERENT kind of project we should be exploring — one we have not
considered because we anchored on the Project 1a product?

Propose three genuinely different project kinds (different domain, different user, or different
FORM: CLI vs web vs library vs bot vs test harness). For each:
- Why THIS team, specifically, would be unusually good at it. Ground this in what our git history
  actually shows we did in Project 1a, not in what we wish we were good at.
- What a one-month build-and-test slice looks like.
- What we lose by walking away from the current plan.

Note honestly: this team's demonstrated output in P1a is adversarial testing, evidence
discipline and multi-model orchestration — not shipping product features. A project that plays to
THAT is a real option and you should consider at least one.

Then answer plainly: stay the course, or pivot? One paragraph. No hedging.
```

## Searches actually run

- `Supabase testing Row Level Security policies pgTAP documentation`
- `OWASP Top 10 for LLM Applications LLM01 prompt injection`
- `promptfoo red team LLM vulnerability scanner open source`

## Pages actually fetched

- https://supabase.com/docs/guides/local-development/testing/pgtap-extended   — asked: Quote verbatim any text about testing RLS policies, the tests.rls_enabled helper, tests.authenticate_as, and w
- https://www.promptfoo.dev/docs/red-team/owasp-llm-top-10/   — asked: Quote verbatim: what is promptfoo, what does its red team feature do, and how does it map to OWASP LLM Top 10?

## Response

## 0. What I re-verified before answering (all commands run 2026-09-13 against the working tree)

I did not take the brief's git claim on faith. Re-run on `/Users/andy/Library/Mobile Documents/com~apple~CloudDocs/Work/1151/CSC510/Epicourier-Web`:

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
- **A capacity fact nobody has written down.** Commits by author since 2026-08-01: Sihao Liu 21, `Amihua` 15, `wenboli721` 14 + `wenboli` 7 (= 21), `andyyuyc` 4, `Mr-Jeffery` 2. Two of the four named students account for 6 of 63 commits. Also, `Amihua` is a **fifth** identity not mapped to any of the four named members — whether that is Andy's second account or a fifth person is **unknown**, and the report should say so rather than guess. Any 160-hour plan that assumes four evenly-loaded people is contradicted by our own history.

Working budget I hold every option to: 160 total − ~35 h (report, poster, demo) − ~15 h (environment, coordination, the four-person async tax our commit distribution predicts) = **~110 h of actual build-and-test.** Each option below is priced against 110, and only one of them fits.

---

## Project Kind 1 — `rls-diff`: an executed-attack authorization harness (CLI + library + CI check)

**Different form** (CLI/library, no UI), **different user** (developers and reviewers on Postgres/Supabase RLS stacks), **different domain** (appsec tooling, not food).

**Why this team specifically.** Our file histogram *is* the shape of this artifact: `.py` + `.sh` + `.ts` test files + `.md`. We have already shipped runnable tooling in this repo — `p1a/scripts/gather_context.sh`, `gather_context_mini.sh`, `gather_context_slim.sh`, `run_local_model.py`, `run_step7.py` — so "team writes a script that produces evidence" is demonstrated, not aspirational. And we hold the asset a security tool cannot buy: **a labelled ground-truth set of 18 confirmed defects in a real app**, including one hole with literally no policy to read. A tool's recall against a labelled set is a measurable result; that is a report and a poster.

**The honest prior-art check.** Supabase already ships most of the database half. Its docs state you can "Create a basic test to verify RLS is enabled across an entire schema" via `select tests.rls_enabled('public');`, plus `tests.authenticate_as()` to "Switch contexts" and `policies_are()` to "test all policies on a named table." So **do not build an RLS linter** — that is solved, and claiming novelty there would be exactly the kind of unearned assertion we are criticising Codex for. The unsolved join is one level up: pgTAP tests the *database*, and cannot see that `web/src/app/api/shopping-lists/share/route.ts` constructs a bare `createClient(NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY)`, never calls `auth.getUser`, and inserts into a table that is not in the schema at all. Route → table → migration → policy is the gap, over a 33-file corpus.

**One-month slice (~110 h).**
- Static pass (~25 h): parse the 33 route files for `.from("<table>")`, how the client was constructed (bare vs cookie-bound), presence of `auth.getUser`, presence of an ownership predicate; join against tables declared in `supabase/migrations/`. Output one table: route × table × RLS-declared? × auth-checked?. This alone re-derives the `shopping_list_shares` finding mechanically.
- Executed pass (~35 h): local Supabase, seed users A and B, replay each mutating route as A against B's rows, assert deny **at the HTTP layer**. This is what retires the methodological caveat: greps become attacks. **Named risk:** this needs seed SQL, the one skill with zero commits behind it. Budget 8 of those 35 as learning and lean on `tests.create_supabase_user()` rather than authoring policies.
- Response/rowcount oracle (~15 h): assert that a mutation route's success payload is consistent with rows actually affected. This catches `transfer/route.ts:98` and `:152` **generically** rather than as a one-off, and it is the most genuinely novel piece — silent `success:true` on a zero-row RLS-blocked update is a bug class, not a bug.
- Validation + write-up (~20 h): run against our own 18 (plus the concurrency hypothesis), report recall and false-positive rate honestly, *including* that our headline IDOR was a false positive at system level — that disclosure is the credibility of the whole project.
- Stretch, not baseline (~15 h if it exists): fix the transfer row-count check as the demo's before/after. The share-route fix at ~8.75 h requires writing a migration and an RLS policy; do not put a skill with zero demonstrated commits on the critical path.

**What we lose.** The "we extended a product" arc. Sixteen of the eighteen defects stay in the tree. If the rubric rewards a user-facing feature, a CLI with a terminal demo scores worse than a screen. **Unknown: whether the course rubric permits a new artifact rather than extending the P1a product.** That is a go/no-go question for the instructor, and it should be asked before any hours are spent.

---

## Project Kind 2 — a claim-to-evidence auditor (bot)

**Different form** (GitHub PR bot / CLI), **different user** (anyone publishing prose claims about a codebase — reviewers, students, and specifically people reviewing LLM-agent output), **different domain** (document integrity).

**Why this team specifically.** This is the one thing we provably did better than the competing analyst, and the git record shows it: 81 `.md` + 18 `.txt` of 99 touched files, and `p1a/traceability/` already contains `p1a_claude_traceability.md`, `p1a_codex_traceability.md`, `p1a_gemini_traceability.md`, `p1a_claude_step7.md` and a reconciled `final-traceability.md`. That directory is a hand-built, four-model version of this tool's output. We re-grepped every defect against the current tree on 2026-09-13; we caught an analyst rejecting git evidence in one section and leaning on it three sections later; we downgraded our own headline finding. Claim → evidence → verdict, with fact/inference/hypothesis kept separate, is our demonstrated competence stated as a product.

**Build.** Claim extractor (LLM over a Markdown doc) → evidence locator (grep/AST over the tree) → verdict per claim: *supported* (with `file:line`), *contradicted*, or *unverifiable-in-tree*, each forced to carry a fact/inference/hypothesis label. Plus a drift mode: re-run an old report against `HEAD` and flag claims that have gone stale. Two-model adversarial referee (one asserts, one refutes) — multi-model orchestration is already demonstrated across `p1a/prompts/{claude,codex,gemini,qwen2.5}` and `p1b/prompts/`.

**One-month slice (~110 h):** extractor 20, locator 30, verdict + report rendering 20, bot wiring 15, evaluation 25 — where the eval set is our own P1a write-up, every claim hand-labelled supported / false-positive / superseded. We are the only team that owns that labelled set, because we are the only team that produced a document and then audited it.

**What we lose.** No security artifact, no product change, and the food app is untouched. The real risk is that this reads as an LLM wrapper: unless the report carries measured precision/recall against the hand-labelled set, it is a demo, not a result. If the eval is cut for time, the project is worthless — so the eval is the deliverable, not the polish.

---

## Project Kind 3 — a domain-safety eval corpus + runner for LLM features (benchmark + empirical report)

**Different form** (corpus + runner + measurement paper), **different user** (LLM app developers; the research/course audience), **different domain** (safety oracles, not recipes).

**Why this team specifically.** Adversarial input design is in the tree under two names: `backend/tests/sihao/p1a/test_adversarial_inputs.py` and `web/tests/p1a/security-attack-cases.test.ts`. Multi-model orchestration is in the tree as four prompt directories and `p1a/evidence/model-runs/codex-p01-transcript.jsonl`. And we own two specific, real seeds: UC5 goal and UC17 preference are unbounded free text interpolated directly into the Gemini prompt with no untrusted-data boundary — textbook OWASP LLM01, which OWASP defines as occurring "when an attacker manipulates the input given to an LLM in order to override, bypass, or alter the model's intended instructions" — and the stranger one, that UC17 prioritises ingredients the system itself labels `"EXPIRED"` / `"EXPIRING NOW"`, so the product recommends cooking food it believes has expired.

**The honest prior-art check.** promptfoo already exists and is "an open-source tool that helps identify and remediate many of the vulnerabilities outlined in the OWASP LLM Top 10," producing "a comprehensive report card that enumerates the OWASP Top 10 vulnerabilities and their severities," driven from a CLI. **We must not build a red-team framework.** Generic injection detection is done. What is not done is the *domain* oracle: "did the assistant instruct a user to eat something the system's own data says is expired" is not a plugin anyone ships, and it is a safety question rather than a ranking question. Build ours as assertions/plugins on top of an existing runner if that is cheaper than a runner of our own.

**One-month slice (~110 h):** oracle definition + labelling rubric 20; ~150-case corpus (injection via goal/preference, expired-ingredient scenarios, quantity edge cases including the `quantity || 1` path where `0` becomes `1` and negatives persist against a `DECIMAL(10,2) NOT NULL DEFAULT 1` column with no `CHECK`) 30; runner across ≥2 model families 25; measurement with inter-rater agreement on a hand-labelled subset 20; ship one mitigation (an untrusted-data boundary plus a hard expiry filter) and re-measure 15.

**What we lose.** All of the authorization and data-integrity work, including the one genuinely unmitigated hole. And the failure mode is thin results: "models do the unsafe thing X% of the time" is a slide, not a project, unless the before/after mitigation number lands.

**Schema constraint that binds all three, restated because it kills a tempting framing:** `user_inventory` upserts on `(user_id, ingredient_id, location)` and sums quantities into one row. No lots, no per-lot expiry, no provenance. Any option that promises to show "which pantry **lot** drove this" is promising something the schema cannot represent. Say **item**, or add the table and pay for it.

---

## Verdict

**Pivot — but pivot the form, not the subject: stop treating Epicourier as the product to extend and start treating it as the labelled corpus for a tool we build, and build Project Kind 1.** The case is not that the current plan is uninteresting; it is that the current plan requires, on its critical path, precisely the three things this team has zero commits behind — a production `.tsx`/`.ts` change, a Supabase migration, and an RLS policy — while the ~24.25 h estimate is priced for a competent fixer, not for us, and two of our four named members have 6 commits between them. Kind 1 puts every hour on file types we have actually shipped (`.py`, `.sh`, `.ts` tests, `.md`), converts our biggest methodological embarrassment into the product thesis (our "security tests" were `toContain` greps; this tool executes the attack instead), keeps all 18 defects as a ground-truth recall set that no other team can obtain, and still ends with a real production fix — the `transfer/route.ts` row-count check — as the demo's before/after, with the 8.75 h migration-shaped share-route fix deliberately off the critical path. Do one thing first, before writing any code: ask the instructor whether the rubric permits a non-product artifact, because if the answer is no, then the correct move is the narrow version of the same idea — stay in Epicourier, spend the 110 h turning the greppy P1a suite into executed two-user attacks plus the two fixes those attacks prove, and let the harness be the by-product rather than the headline.

Sources:
- [pgTAP: Unit Testing | Supabase Docs](https://supabase.com/docs/guides/database/extensions/pgtap)
- [Advanced pgTAP Testing | Supabase Docs](https://supabase.com/docs/guides/local-development/testing/pgtap-extended)
- [Testing Overview | Supabase Docs](https://supabase.com/docs/guides/local-development/testing/overview)
- [Row Level Security | Supabase Docs](https://supabase.com/docs/guides/database/postgres/row-level-security)
- [OWASP LLM Top 10 | Promptfoo](https://www.promptfoo.dev/docs/red-team/owasp-llm-top-10/)
