# P09 — Milestone reality check (deepseek-v4-pro)

- Run date: 2026-09-13
- Model: `deepseek-v4-pro`
- Method: single-shot API call, fresh context (no conversation memory), no web browsing tool available via API (model priors)
- Params: temperature=0.3
- Duration: 89.2s  Meta: {"usage": {"prompt_tokens": 1815, "completion_tokens": 5998, "total_tokens": 7813, "prompt_tokens_details": {"cached_tokens": 1408}, "completion_tokens_details": {"reasoning_tokens": 5447}, "prompt_cache_hit_tokens": 1408, "prompt_cache_miss_tokens": 407}, "reasoning_len": 23480}

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

The team: four graduate students, one month to build AND test, roughly ten hours per person per week (~160 person-hours total). Skills: Individual member biographies are UNKNOWN. Collective, repository-demonstrated skills only: TypeScript/Next.js, Python/FastAPI, Supabase, Jest/Pytest, and AI/LLM integration.

Our draft milestones:
- M0: build a dated rival feature matrix + a baseline functional/security test harness.
- M1: fix the recorded P1a defects (object-ownership/IDOR on shopping/transfer, weak type/range
  validation, unbounded LLM free-text inputs = prompt-injection surface).
- M2: ship one typed "recommendation receipt" endpoint + UI (names pantry lots, expiry dates,
  nutrient constraints, substitutions; ranking computed by pure code, not the LLM; user-correctable).
- M3: full weekly meal optimizer with live retailer prices, stores, allergies, and nutrition.
- M4: statistically valid food-waste-reduction study with real households.
- M5: report, poster, demo.

Classify each: REALISTIC / STRETCH / FANTASY, with one sentence of why, judged against the hours above — not against a funded startup. For every FANTASY, propose the largest slice of it that would be REALISTIC. Dull milestones lose marks, impossible ones lose more.
```

## Raw model output

## Milestone classification

| Milestone | Verdict | Why (one sentence) | If FANTASY: largest REALISTIC slice |
|---|---|---|---|
| **M0 — rival matrix + baseline functional/security harness** | **REALISTIC** | The inherited repo already has a green 1,095-test web suite and a working backend harness, so this is bounded research plus selected security regression tests, roughly 15–20 person-hours, not new infrastructure. | — |
| **M1 — fix recorded P1a defects** | **REALISTIC** | The defects are already diagnosed with reproducing tests, and most fixes are local ownership/validation/bound checks plus regression coverage, likely 40–60 person-hours including Supabase RLS work. | — |
| **M2 — typed recommendation receipt endpoint + UI** | **STRETCH** | A schema-validated endpoint plus editable UI with pure-code ranking and substitution logic is buildable from the existing recipe/pantry/nutrient use cases, but only if scope is frozen and M3/M4 are cut; otherwise it runs the team past 160 person-hours. | — |
| **M3 — full weekly meal optimizer with live retailer prices, stores, allergies, nutrition** | **FANTASY** | Live retailer price/store integrations plus a credible optimizer and validation is multiple external integration projects, and it cannot fit after M0–M2 in a one-month, 160-hour build-and-test budget. | A one-week optimizer over existing recipes and pantry lots, with allergies as hard constraints and nutrition targets, using a static or user-editable price table for one store instead of live retailer APIs. |
| **M4 — statistically valid food-waste-reduction study with real households** | **FANTASY** | A statistically valid household study requires ethics/IRB, recruitment, controlled measurement, and enough sample/design rigor, which is a multi-month research project, not a one-month software milestone. | A small non-statistical pilot with 5–8 volunteer households using the app’s own inventory/expiry logs plus a two-week waste diary, reported as descriptive pre/post observations and an effect-size estimate for a future study. |
| **M5 — report, poster, demo** | **REALISTIC** | These are bounded outputs derived from artifacts already produced or planned, and they fit in the final 15–20 person-hours. | — |

**Bottom line:** the viable one-month scope is **M0 + M1 + M2 + M5**. M3 and M4 should not be attempted as written; take only the realistic slices above if any remaining time exists.
