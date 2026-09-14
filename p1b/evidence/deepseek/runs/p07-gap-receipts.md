# P07 — The gap, with receipts (deepseek-v4-pro)

- Run date: 2026-09-13
- Model: `deepseek-v4-pro`
- Method: single-shot API call, fresh context (no conversation memory), no web browsing tool available via API (model priors)
- Params: temperature=0.3
- Duration: 119.8s  Meta: {"usage": {"prompt_tokens": 1647, "completion_tokens": 7708, "total_tokens": 9355, "prompt_tokens_details": {"cached_tokens": 1408}, "completion_tokens_details": {"reasoning_tokens": 6688}, "prompt_cache_hit_tokens": 1408, "prompt_cache_miss_tokens": 239}, "reasoning_len": 29713}

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

We claim this market gap: "No rival provides an auditable pantry-to-plan workflow that explains the expiry, nutrition, cost, and safety trade-offs behind a recommendation and lets the user correct the inputs."

Interrogate the claim. What evidence would CONFIRM the gap is real? List five findable items. What evidence would REFUTE it (an existing product we missed, evidence that nobody wants it)? For each item, mark FOUND (with source) or NOT FOUND. If the refuting evidence wins, say so plainly. We want at least one gap killed; a run that confirms everything checked nothing.
```

## Raw model output

# Gap interrogated: *“No rival provides an auditable pantry-to-plan workflow that explains the expiry, nutrition, cost, and safety trade-offs behind a recommendation and lets the user correct the inputs.”*

## Honesty status of this run

I could not execute live web retrieval in this session. Under the evidence rules pasted into this run, that means **no product can be named as FOUND and no quote can be supplied as actual retrieved page text**. Anything I “remember” about Cooklist, SuperCook, Fridgely, Samsung Food, etc. is model memory, not evidence. Per your own rule:

> An honest empty result is worth more than a plausible invention.

So this is an honest empty-result run. It is not a gap-confirming run. That itself kills one version of the gap: **the claim cannot be accepted as a market finding on this run**.

---

## A. What would CONFIRM the gap is real

| # | Findable item that would confirm the gap | Status | Source |
|---|---|---|---|
| C1 | A direct search for `"expiry" "nutrition" "cost" "safety" "explain"` combined with meal-planning/pantry terms returns **no competitor page** describing all four explained trade-offs. | **NOT FOUND** — no live search performed | n/a |
| C2 | A review of official feature/help pages for the top 10 pantry-to-recipe or meal-planning products shows **none document an auditable recommendation trace** that says why a meal was suggested. | **NOT FOUND** — no pages retrieved | n/a |
| C3 | A search of app-store descriptions for phrases like “explains why,” “recommendation reasons,” or “expiry/nutrition/cost/safety trade-off” returns **no relevant rival**. | **NOT FOUND** — no app-store pages retrieved | n/a |
| C4 | A help-center search across rival products for “why was this recommendation made” or “correct recommended meal” returns **no vendor documentation**. | **NOT FOUND** — no help-center pages retrieved | n/a |
| C5 | Independent evidence that users want an explainable pantry-to-plan workflow: reviews, forum threads, feature requests, or survey/UX research. | **NOT FOUND** — no reviews/research retrieved | n/a |

---

## B. What would REFUTE the gap

| # | Findable item that would refute or weaken the gap | Status | Source |
|---|---|---|---|
| R1 | A rival whose official page describes **pantry/ingredient inventory → meal plan**, with **expiry prioritization** and **user-correctable inventory**. This would kill the “no rival provides pantry-to-plan” core. | **NOT FOUND** — candidate leads exist in memory, but no live page was retrieved, so I cannot assert them as evidence | n/a |
| R2 | A rival whose official page describes **recipe recommendations based on what you already have**, with an explicit way to add/remove/correct ingredients. That would kill the “no one lets the user correct inputs” part. | **NOT FOUND** — same reason | n/a |
| R3 | A rival whose official page describes **expiry tracking plus recipe suggestions** but not the full four-factor explanation. That would weaken the claim by showing the pantry/expiry workflow is not novel. | **NOT FOUND** — no live page retrieved | n/a |
| R4 | A rival whose official page describes **meal planning with nutrition and cost/budget filters**. That would weaken the nutrition/cost portion of the claimed gap. | **NOT FOUND** — no live page retrieved | n/a |
| R5 | Evidence that **nobody wants this**: low search volume, no feature-request threads, reviews that do not mention explanation, or a failed/abandoned product with the same idea. | **NOT FOUND** — no search/analytics data retrieved | n/a |

---

## C. Verdict

**The refuting evidence does not win, because no refuting evidence was actually retrieved.**

But neither does the confirmation evidence.

The correct verdict for this run is:

> **The gap is NOT CONFIRMED.**  
> The claim is a universal negative — “no rival provides this” — and it was tested with zero live retrievals. Under the evidence rules, that is not a market gap; it is an unsupported assertion.

So the gap killed here is:

> **The broad claim that “no rival provides an auditable pantry-to-plan workflow…” survives this run as a credible market gap.**

It does not survive this run. It only survives as a hypothesis worth re-testing with live web access. To actually adjudicate it, the next run must retrieve and quote official pages from the known pantry/meal-planning rival space and either produce a matching product or explicitly report empty searches.
