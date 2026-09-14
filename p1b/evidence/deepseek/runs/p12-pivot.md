# P12 — The pivot question (deepseek-v4-pro)

- Run date: 2026-09-13
- Model: `deepseek-v4-pro`
- Method: single-shot API call, fresh context (no conversation memory), no web browsing tool available via API (model priors)
- Params: temperature=0.3
- Duration: 94.2s  Meta: {"usage": {"prompt_tokens": 1809, "completion_tokens": 6030, "total_tokens": 7839, "prompt_tokens_details": {"cached_tokens": 1408}, "completion_tokens_details": {"reasoning_tokens": 5090}, "prompt_cache_hit_tokens": 1408, "prompt_cache_miss_tokens": 401}, "reasoning_len": 23430}

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

Forget our current plan for a moment. Here are the facts:
- Team: four graduate students, ~10 hours each per week, one month to build AND test.
- Team skills, honest: Individual member biographies are UNKNOWN. Collective, repository-demonstrated skills only: TypeScript/Next.js, Python/FastAPI, Supabase, Jest/Pytest, and AI/LLM integration.
- What we learned in Project 1a: Epicourier is a Next.js/FastAPI/Supabase meal planner. Our adversarial testing found object-ownership/IDOR gaps on the shopping-list and purchased-transfer paths, weak type/range validation (negatives, Boolean("false")->true), unbounded LLM free-text inputs (a live prompt-injection surface), and a recipe "match percentage" the UI prints in bold that the Gemini LLM writes and no line of our code recomputes.

Is there a DIFFERENT kind of project we should be exploring — one we have not considered because we anchored on the Project 1a product? Propose three genuinely different project kinds (different domain, user, or form: CLI vs web vs library vs bot). For each: why THIS team specifically would be unusually good at it; what a one-month build-and-test slice looks like; what we lose by walking away. Then answer plainly: stay the course, or pivot? No hedging.
```

## Raw model output

No competitor products are named below, so no live-URL evidence is needed. This is a project-kind analysis only.

## Decision

**Pivot.** Stay the course means spending the one-month budget fixing an inherited 20-use-case meal planner. The better use of this team’s demonstrated edge is a small, test-heavy tool aimed at the exact failure class Project 1a already surfaced.

Build **Option 1**: an LLM input/output guardrail library and CLI.

---

## Option 1 — LLM input/output guardrail library/CLI

**Domain:** AI application security / developer tooling  
**User:** developers integrating LLM-generated input or output  
**Form:** Python library + TypeScript library + small CLI

### Why this team specifically

Project 1a gave them direct, reproducible evidence of the problem class:

- unbounded free-text goals and preferences interpolated into Gemini prompts — a live prompt-injection surface;
- an LLM-written “match percentage” printed in bold with no application-level recomputation;
- weak coercions such as `Boolean("false")` becoming `true`.

That is unusually specific preparation. The team also has both Python/FastAPI and TypeScript/Next.js skills, so it can ship the same guardrails to both sides of a modern LLM stack.

### One-month build-and-test slice

Build a small policy/validation core:

- strict input policies: bounded text, enum, strict boolean, numeric range, non-negative integer, URL, length caps;
- output policies for LLM-written claims: require application-side recomputation or fail closed;
- prompt-injection canaries and redaction/deny rules for untrusted free text;
- FastAPI middleware and a Next.js/TypeScript helper;
- Pytest and Jest suites replaying the actual Epicourier failures as fixtures: negative quantities, `Boolean("false")`, >4096-char injection, LLM-written percentage.

Deliverable: two packages, CLI, docs, CI.

### What we lose by walking away

We lose the consumer meal-planning product and its 20 use cases. We keep the defects as test fixtures. That is an acceptable trade because the inherited product is broad and currently untrustworthy.

---

## Option 2 — Supabase/Postgres RLS test harness

**Domain:** database security / developer tooling  
**User:** small teams building on Supabase  
**Form:** CLI / test generator

### Why this team specifically

Project 1a found cross-user IDOR in UC18 and UC20 because shopping-item update and purchased-transfer were scoped by item ID only, with no ownership check. The team has already learned what a missing RLS-boundary failure looks like in real code, and it has Pytest/Jest skills to generate repeatable tests.

### One-month build-and-test slice

A CLI that introspects a Supabase schema and RLS policies, identifies likely ownership relationships from foreign keys, and emits Pytest/Jest tests that create two tenant users and assert cross-user access is denied. Validate it against a known-vulnerable fixture and a hardened fixture.

### What we lose by walking away

We lose the meal-planning product and most of the AI-integration surface. This option is narrower and leans less on the team’s LLM experience.

---

## Option 3 — Verification-first AI code-review bot

**Domain:** developer productivity / security  
**User:** small teams reviewing pull requests  
**Form:** GitHub/GitLab bot or PR CLI

### Why this team specifically

The team knows from direct testing that LLM output cannot be trusted unless it is verified. It also has full-stack and FastAPI skills. A code-review bot that refuses to block on raw LLM claims and instead requires a deterministic failing check matches that exact lesson.

### One-month build-and-test slice

A FastAPI webhook receiver that runs deterministic detectors — Boolean coercion, negative quantity, missing ownership checks, unbounded LLM inputs — and uses an LLM only to explain already-reproduced findings. Test with recorded webhooks and adversarial PR fixtures.

### What we lose by walking away

We lose the meal planner and may spend too much of the 160 hours on GitHub app permissions, hosting, and webhook edge cases. It is a real project, but less contained than Option 1.

---

## Final answer

**Pivot.** Build the LLM input/output guardrail tool. It is the best fit for the team’s demonstrated skills, the one-month constraint, and the exact defects Project 1a already produced.
