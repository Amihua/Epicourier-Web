# P06 — Three futures (deepseek-v4-pro)

- Run date: 2026-09-13
- Model: `deepseek-v4-pro`
- Method: single-shot API call, fresh context (no conversation memory), no web browsing tool available via API (model priors)
- Params: temperature=0.3
- Duration: 102.8s  Meta: {"usage": {"prompt_tokens": 1618, "completion_tokens": 6602, "total_tokens": 8220, "prompt_tokens_details": {"cached_tokens": 1408}, "completion_tokens_details": {"reasoning_tokens": 5625}, "prompt_cache_hit_tokens": 1408, "prompt_cache_miss_tokens": 210}, "reasoning_len": 24545}

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

Our product: see the evidence block above.

Propose three versions: SAFE (obvious next step), BOLD (a real bet), and WILD (probably wrong, but instructive). For each: elevator pitch (two sentences); what four students could build AND test of it in one month; the biggest risk; the kill signal ("we abandon this version if we see ___", an observable condition with a number and a date). Do not blend them into one compromise.
```

## Raw model output

Scope note: no external products are named below, so no evidence URLs are required by the evidence rules. All product facts come from the shared evidence block.

## SAFE — “Hardened 1.1: close the known holes”

**Elevator pitch.** Turn Project 1a’s defect list into a trustworthy baseline: close the IDOR, validation, and prompt-injection surfaces before anyone tries to show the app outside the course. This is the unglamorous release that makes every later version safer to build.

**What four students could build AND test in one month:**

- **Backend owner:** add authenticated ownership checks to UC18/UC20 and Supabase RLS; harden quantity, boolean, storage location, achievement trigger, prompt-length, and `expiryDays` inputs.
- **Frontend owner:** fix `quantity || 1`, `Boolean("false")`, and storage-location runtime validation; surface permission/validation errors properly.
- **QA owner:** grow adversarial coverage from 44 web / 25 backend to roughly 80 web / 45 backend; write a regression test for every 1a defect a–g; keep the inherited 1,095-test suite stable.
- **Docs/DevOps owner:** make `npm run build` succeed with a documented `SUPABASE_SERVICE_ROLE_KEY`; document all env vars, 13 migrations, 5 CSV imports, and the `search_path` patch.

**Biggest risk.** The ownership/RLS changes are cross-cutting and may break legitimate multi-user flows that the current tests do not see.

**Kill signal.** Abandon the full release on **2026-09-27** if fewer than **6 of 7 defects a–g** are fixed with a passing regression test; otherwise keep the closed defects and cut the remaining scope.

---

## BOLD — “Zero-Waste Engine”

**Elevator pitch.** The product already collects expiry and inventory data; this version makes avoiding waste the product’s center of gravity instead of a filtering sidebar. Users get an expiry action queue, a household waste ledger, and shopping duplicate blocking that turns inventory data into visible money and food saved.

**What four students could build AND test in one month:**

- **Backend owner:** add a `waste_log` table and endpoints for logging wasted ingredients, cost estimates, and weekly waste-avoidance totals; block shopping-list items already present in inventory unless explicitly allowed.
- **AI/prompt owner:** change the Gemini recommendation boundary so expiring ingredients are explicitly prioritized and the response format is testable; use a mocked Gemini backend for deterministic tests.
- **Frontend owner:** expiry action queue sorted by expired/critical/warning; waste log UI; weekly “waste avoided/saved” summary with CSV export.
- **QA/user-test owner:** scripted recommendation tests with the AI mock; API validation tests for waste logs and duplicate blocking; 10-person usability pilot covering one waste-logging flow.

**Biggest risk.** The underlying AI layer is non-deterministic, so the core value may not hold outside a mocked test harness, and manual waste logging may feel like a chore.

**Kill signal.** Abandon on **2026-10-04** if fewer than **35 of 50** mocked recommendation trials place at least one expiring ingredient in the top-3 suggested meals.

---

## WILD — “Autonomous Fridge-to-Checkout Loop”

**Elevator pitch.** A user approves a plan and the app orders the missing ingredients, then checks the delivery into inventory automatically. This is probably wrong for one month because real retailer APIs, payment, and fulfillment are outside the student budget.

**What four students could build AND test in one month:**

- **Backend owner:** build a mock grocery-provider API and an order state machine covering plan → cart → order → partial fill → delivery → inventory check-in.
- **Integration owner:** map shopping-list items to mock store SKUs; reconcile delivered quantities with inventory.
- **Frontend owner:** “Buy missing items” flow, simulated order tracking, and voice-captured meal-plan input via browser speech recognition.
- **QA owner:** end-to-end simulated order tests, out-of-stock/partial-fill/cancel cases, and delivery-to-inventory reconciliation.

**Biggest risk.** Even if the mock is good, the real-world value depends on external partners, payment credentials, and live inventory availability that cannot be tested in 160 person-hours.

**Kill signal.** Abandon on **2026-09-20** if fewer than **20 of 25** scripted mock order-state transitions pass end-to-end; the mock may survive only as a test fixture, not as a product direction.
