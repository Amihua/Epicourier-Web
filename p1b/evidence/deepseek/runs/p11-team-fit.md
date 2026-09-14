# P11 — Play to the team (deepseek-v4-pro)

- Run date: 2026-09-13
- Model: `deepseek-v4-pro`
- Method: single-shot API call, fresh context (no conversation memory), no web browsing tool available via API (model priors)
- Params: temperature=0.3
- Duration: 111.4s  Meta: {"usage": {"prompt_tokens": 1730, "completion_tokens": 6947, "total_tokens": 8677, "prompt_tokens_details": {"cached_tokens": 1408}, "completion_tokens_details": {"reasoning_tokens": 5227}, "prompt_cache_hit_tokens": 1408, "prompt_cache_miss_tokens": 322}, "reasoning_len": 23883}

## Prompt, exactly as issued

```
# Project 1b — Shared Evidence Block (Claude runs)

Every Claude prompt in this run was issued with the same evidence block pasted into it. This
matters: a cross-model comparison is only meaningful if each model received the same inputs. If
a teammate reruns these prompts on Gemini or a local model, paste this file, unedited, into the
prompt.

Run date: **2026-09-13**. Model: **Claude Opus 5 (1M context)**, `claude-opus-5[1m]`, driven from
Claude Code with web search and web fetch enabled.

---

## A. The product, in one paragraph

> Epicourier-Web is a full-stack meal-planning web application (Next.js 15 / TypeScript /
> Tailwind front end; FastAPI + Python back end; Supabase/PostgreSQL; Google Gemini 2.5 Flash for
> recommendation). Its twenty implemented use cases cover: account registration and sign-in;
> recipe browsing with search, dietary tags and an "inventory match percentage"; recipe detail
> with nutrients and a green/sustainability score; AI meal-plan recommendation from a free-text
> goal (3/5/7 meals); calendar meal scheduling and meal-completion tracking; a nutrient dashboard
> with daily/weekly/monthly trends, custom nutrient goals, and CSV/text export; gamified
> achievements, streaks and wellness challenges; pantry/fridge/freezer inventory with expiry
> colour-coding (expired / critical / warning / unknown) and low-stock thresholds; AI recipe
> suggestions that prioritise ingredients that are expiring or already expired; shopping-list
> creation from a meal plan or a recipe; and a "purchased" transfer flow that moves checked
> shopping-list items into the user's inventory.

## B. The hard budget constraint

Pasted into **every** prompt, per the assignment's instruction that a model which does not know
the budget will design a two-year product:

> HARD BUDGET CONSTRAINT you must respect in every recommendation: four graduate students,
> ONE MONTH, roughly ten hours per person per week (about 160 person-hours TOTAL), to build
> AND test the result. Anything that cannot be built and tested in that budget is out of scope.

## C. The evidence rules

Pasted into every prompt that touches the outside world. This block is the hallucinated-rival
filter at the prompt level; the two-model rule is the filter at the team level.

> - A "rival" is a competing software product actually on the market. An LLM is never a rival.
> - Do NOT invent products. If you are not certain a product exists, leave it out.
> - Every product you name MUST come with a live URL you actually retrieved in this session.
> - For every feature claim, quote 5–25 words of the ACTUAL page text that supports it, and give
>   the exact URL that text came from. If you cannot quote the page, the cell is "unknown".
> - Never infer a feature from a marketing adjective. "Smart" is not a feature. "AI-powered" is
>   not a feature. Only a described behaviour is a feature.
> - Distinguish: product exists / feature exists / users want it / price / quality. Evidence for
>   one is not evidence for another.
> - Prices change. Record the price exactly as the page states it, plus the URL, plus the note
>   that it was checked on 2026-09-13.
> - If a search returns nothing usable for an angle, SAY SO. An honest empty result is worth more
>   than a plausible invention, and this report is graded on caught errors.

## D. What Project 1a established

Auditable numbers only. The inherited README's "1,130+ automated test cases" is the **previous
team's** claim and is deliberately excluded from every prompt; our own run logs are the source.

- Forked at 467 commits, 79 test files, last upstream commit 2025-12-07.
- Inherited web suite: **1,095 of 1,096 passed** in 3.6 s, no flakes across repeated runs.
- Our own functional tests: **Web 32 tests, 31 PASS / 1 FAIL**; **Backend 18 cases, 18 PASS**.
- Including our adversarial tests: **Web 44 executed, 33 PASS / 11 FAIL**; **Backend 25 executed,
  18 PASS / 7 FAIL**.

Real defects our tests found:

| # | Defect | Where |
|---|---|---|
| a | Shopping-item update and the "purchased" transfer are scoped by item ID only, with no authenticated-ownership check — a cross-user IDOR subject to Supabase RLS | UC18, UC20 |
| b | Quantity validation accepts negative, zero and non-finite values; `quantity \|\| 1` silently turns 0 into 1 | UC17, UC20 |
| c | `Boolean("false")` coerces to `true` and flips purchase state | UC18 |
| d | Storage location is validated only by a TypeScript cast, so any string passes at runtime | UC20 |
| e | Achievement trigger values are unchecked | UC11 |
| f | Pydantic accepts unbounded free-text goals and preferences (>4096 chars) that are interpolated straight into the Gemini prompt with no untrusted-data boundary — a live prompt-injection surface | UC5, UC17 |
| g | Share-link creation has no ownership check and no bound on `expiryDays` | — |

Documentation defect: `npm run build` fails on a missing, undocumented `SUPABASE_SERVICE_ROLE_KEY`;
three further environment variables the code reads are undocumented; thirteen migrations and five
CSV imports are required and unmentioned; one migration needed patching because the base schema
empties `search_path`.

## E. The twenty canonical use cases

Not restated here. Prompts that need them were given the verbatim table from
[`p1a/use-cases/final-use-cases.md`](../../../p1a/use-cases/final-use-cases.md), extracted from the
repository rather than from model memory.

## F. The rival analyst's output

Prompts C4 (disagreement forcing) and the adjudication step were additionally given a summary of
the **Codex** run recorded at [`p1b/result/codex/README.md`](../../result/codex/README.md), so that
Claude was arguing against a real rival analyst's real conclusions rather than against a
strawman it invented for itself.


---

## TASK (Project 1b starter prompt, issued to an independent analyst)

Here are the skills of the current team, stated honestly:
Individual member biographies are UNKNOWN. Collective, repository-demonstrated skills only: TypeScript/Next.js, Python/FastAPI, Supabase, Jest/Pytest, and AI/LLM integration.

Candidate directions for our product:
- secure explainable pantry planner (the recommendation receipt);
- broader all-in-one expansion (more planner features);
- retailer price optimizer / grocery-receipt OCR;
- clean-slate CLI security-regression tool for CRUD apps;
- reusable "receipt" component/library;
- dump the old product and start fresh in a new language.

Given these skills — not the skills we wish we had — what is a good approach? Which direction lets this team build and test the most in one month, and why? Which direction is a trap (needs a skill nobody has)? Where one needed skill is missing, is it learnable in a weekend or should we redesign around it? Who should own what, so nobody is a bottleneck?
```

## Raw model output

## Independent analyst recommendation

**Bottom line: choose the secure explainable pantry planner, with the “recommendation receipt” as the new user-facing capability.** It is the only direction that stays entirely inside the team’s demonstrated skills, reuses an already-tested codebase, and turns Project 1a’s concrete defect list into a bounded one-month work package.

I am deliberately not naming rival products here. No live competitor pages were retrieved for this decision, and under the evidence rules an unnamed product I cannot quote is safer than an invented one.

---

## Why this wins the 160-hour budget

The team has demonstrated: TypeScript/Next.js, Python/FastAPI, Supabase, Jest/Pytest, and AI/LLM integration. The existing product already exercises all of these.

Project 1a supplied a ready backlog of real defects:

- IDOR in shopping-item update and “purchased” transfer.
- Negative/zero/non-finite quantity handling.
- `Boolean("false")` coercion.
- Storage-location validation by TypeScript cast only.
- Unbounded Gemini prompt input — prompt injection.
- Share-link ownership and `expiryDays` issues.
- Missing env docs, migrations, CSV imports, and build failure.

Those are not vague roadmap ideas; they are already discovered, reproducible, and testable. The secure explainable pantry planner direction is therefore mostly hardening plus one feature: a user-visible, auditable recommendation receipt showing what the AI recommended, why, and which inventory evidence supported it.

A “receipt” here should mean:

> A structured, saved explanation of an AI meal plan or inventory transfer: the user’s goal, constraints, matched inventory, expiring items used, nutrients, sustainability score, and cited evidence for each recommendation.

That is much smaller than a new product.

---

## Direction-by-direction assessment

| Direction | Verdict | Main reason |
|---|---|---|
| Secure explainable pantry planner | **Select** | Fits skills, existing code, existing tests, concrete defect backlog, bounded scope |
| Broader all-in-one expansion | Not selected | Feasible, but scope is unbounded and would likely become feature-accumulation without finishing security |
| Retailer price optimizer / grocery-receipt OCR | **Trap** | Requires OCR/computer vision, retailer data access, price normalization, and likely scraping or API relationships none of the skills demonstrate |
| Clean-slate CLI security-regression tool for CRUD apps | Trap unless drastically narrowed | Generic static analysis/taint detection across CRUD apps is a research-size problem, not a one-month one |
| Reusable receipt component/library | Premature | Could be extracted after the in-app receipt works; packaging and API maintenance are unproven skills and add risk |
| Dump old product and start in a new language | Trap | No evidence of another language/toolchain, discards a mostly green 1,095-test suite, and wastes the p1a audit |

The secure explainable pantry planner maximizes **build and test**, because every change maps to a regression test, and the inherited suite already provides a large safety net.

---

## What I would build in one month

### Must have

1. **Fix the Project 1a security defects**
   - Add authenticated ownership checks to UC18/UC20.
   - Enforce Supabase RLS for shopping items and transfers.
   - Validate quantity as finite and positive.
   - Parse booleans correctly.
   - Use a runtime whitelist for storage location.
   - Bound free-text goal/preferences before Gemini interpolation.
   - Add share-link ownership and expiry validation.

2. **Add the recommendation receipt**
   - Gemini output constrained to a JSON schema, not free text.
   - Receipt stored with the user ID.
   - Receipt shows: user goal, constraints, inventory used, expiring/expired items, match percentage, nutrients, sustainability score, and a short evidence string.
   - Receipt is read-only and owned by the user.

3. **Fix the build/documentation defect**
   - Make `npm run build` pass without undocumented `SUPABASE_SERVICE_ROLE_KEY`.
   - Document the env vars, migrations, and CSV imports.

### Should have if time permits

- Achievement trigger validation.
- Low-risk UI polish for the receipt.
- CSV/text export of receipts or plans.

### Must not do

- Add more planner features.
- Attempt OCR or price optimization.
- Extract a standalone library in the first month.
- Rewrite any major part of the stack.

### Definition of done

- All p1a defects above are either fixed with regression tests or explicitly marked out-of-scope with a reason.
- The inherited suite passes: 1,095/1,096 or better.
- New backend security/adversarial tests pass.
- New frontend interaction tests pass.
- `npm run build` passes with documented env.
- A user can enter a free-text goal and receive an AI meal plan with a stored receipt.

---

## Time allocation

| Workstream | Hours | Owner role |
|---|---|---|
| Security hardening: UC18/UC20, RLS, validation, share links | 50 | Backend/API owner |
| AI receipt pipeline: prompt boundary, JSON schema, receipt storage | 35 | AI integration owner |
| Frontend receipt UX and shopping-transfer flow | 35 | Frontend owner |
| Test harness, adversarial suites, build docs, CI | 20 | QA/integration owner |
| Final integration, demo, run-log documentation | 20 | Whole team |

Total: **160 hours**.

---

## Ownership without bottlenecks

Because individual biographies are unknown, roles should be assigned by artifact, not by person.

Proposed ownership:

- **Backend/API owner:** shopping list, transfer, RLS, validation, share links.
- **AI integration owner:** prompt template, input boundary, Gemini output schema, receipt storage.
- **Frontend owner:** receipt component, transfer UX, plan view.
- **QA/integration owner:** regression harness, adversarial tests, build/docs/CI, release integration.

To prevent bottlenecks:

- Prompt templates and receipt schemas live in version-controlled files, not in one person’s head.
- RLS/security changes are paired-reviewed by at least one other person.
- The release integrator rotates weekly.
- Every merge requires passing tests.
- The QA owner does not own product features; they own proof that features work.

The most likely bottleneck is the backend/API owner, because security fixes span multiple use cases. The mitigation is to pair that owner with the AI or QA owner on the highest-risk items, and to make the test harness runnable by everyone.

---

## The trap directions and missing skills

The clearest trap is **retailer price optimizer / grocery-receipt OCR**.

It requires:

- Receipt OCR or computer vision.
- Retailer price data access.
- Price normalization across stores, brands, package sizes, and dates.
- Scraping or formal API relationships the team has no evidence of having.

Those are not weekend learnable. Reliable receipt OCR alone is a specialized problem, and pricing data has legal and access issues. The right move is to redesign around it by not doing it in this budget.

A secondary trap is the **clean-slate CLI security-regression tool for CRUD apps**. Detecting IDOR or missing ownership checks generically across arbitrary applications requires static analysis, AST/parser work, per-framework adapters, and a lot of test infrastructure. The team knows how to test one app, but that is not the same as building a tool that tests many apps. That skill gap is not weekend learnable either.

The **new-language rewrite** is also a trap because it throws away the strongest evidence the team has: a working, mostly green suite in a stack they already know.

---

## Final recommendation

Build the **secure explainable pantry planner** as a hardening-and-receipt release. Treat Project 1a’s defect list as the initial backlog. Add only one visible feature: the stored, testable recommendation receipt. Pair security changes, keep prompt/schema files version-controlled, rotate the integrator, and finish only when the inherited suite, new security tests, new receipt tests, and documented build all pass.
