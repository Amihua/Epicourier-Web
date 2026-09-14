# P10 — Red team (deepseek-v4-pro)

- Run date: 2026-09-13
- Model: `deepseek-v4-pro`
- Method: single-shot API call, fresh context (no conversation memory), no web browsing tool available via API (model priors)
- Params: temperature=0.3
- Duration: 121.1s  Meta: {"usage": {"prompt_tokens": 1974, "completion_tokens": 8000, "total_tokens": 9974, "prompt_tokens_details": {"cached_tokens": 1408}, "completion_tokens_details": {"reasoning_tokens": 6752}, "prompt_cache_hit_tokens": 1408, "prompt_cache_miss_tokens": 566}, "reasoning_len": 31246}

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

You are hostile to our proposal. Below: our mission statement, milestones, and market survey.

MISSION: Extend Epicourier with a "recommendation receipt" that names the exact pantry lots, expiry dates, nutrient constraints, and substitutions that caused a recipe to rank, computed by a pure function (not the Gemini LLM) and correctable by the user. Measurable M0: across 50 recipes x 10 seeded pantries (500 recommendations), the displayed total equals the sum of the displayed line items in 500/500 cases and the ordering is byte-identical across 20 shuffles of inventory input order.

MILESTONES:
- M0: build a dated rival feature matrix + a baseline functional/security test harness.
- M1: fix the recorded P1a defects (object-ownership/IDOR on shopping/transfer, weak type/range
  validation, unbounded LLM free-text inputs = prompt-injection surface).
- M2: ship one typed "recommendation receipt" endpoint + UI (names pantry lots, expiry dates,
  nutrient constraints, substitutions; ranking computed by pure code, not the LLM; user-correctable).
- M3: full weekly meal optimizer with live retailer prices, stores, allergies, and nutrition.
- M4: statistically valid food-waste-reduction study with real households.
- M5: report, poster, demo.

MARKET SURVEY: Verified live rivals include Samsung Food/Food+, Eat This Much, Mealime, Paprika, SideChef, MyFitnessPal, SuperCook, Cooklist, Grocy, Mealie, Tandoor, KitchenOwl, RecipeFix, Prospre. Samsung Food+ and Eat This Much already prioritize near-expiry pantry items; RecipeFix ships substitution reasoning; Grocy computes an expiry due-score.

Attack on three fronts: (1) nobody wants it — the need is imagined; (2) they cannot build it — the month is too short, the team too green; (3) someone does it better — name who. Make each attack as strong as you honestly can; no strawmen. Then, for each attack, state what evidence would defeat it.
```

## Raw model output

# Hostile analyst response

I am treating the supplied “MARKET SURVEY” as **unverified** unless it is accompanied by live URLs and page quotes. That itself becomes part of the attack.

## Attack 1 — Nobody wants it

The mission’s measurable M0 is not a demand metric. It says:

- across 500 recommendations, displayed total equals sum of displayed line items in 500/500 cases;
- ordering is byte-identical across 20 shuffles of inventory input order.

That is an arithmetic-integrity and determinism property. A pure function can satisfy it with zero users. The proposal could hit M0 while no human ever opens the receipt, trusts it, corrects it, or changes behavior because of it.

No supplied evidence shows users want a “recommendation receipt.” There are no user interviews, no support tickets, no query logs, no usability tests, no willingness-to-pay data, no retention data, no A/B test. Under the evidence rules, **product exists / feature exists / users want it** are separate claims. The market survey asserts that some products have related features, but it does not show people want a line-item explanation of exact lots, expiry dates, nutrient constraints, and substitutions.

The receipt may even be a negative feature. If the ranking is good, the receipt is clutter; if the ranking is wrong, the product is asking users to debug a ranking engine. “User-correctable” is not obviously valuable — it is extra work. The proposal has not shown that corrections are used downstream, that users prefer the receipt to a simpler explanation, or that the receipt changes meal-planning behavior.

What would defeat this attack:

- Evidence from current Epicourier users: logged requests, usability failures, support tickets, or interviews showing they cannot understand or trust recommendations.
- A controlled comparison showing the receipt improves real behavior: recipe selection speed, meal completion, waste reduction, retention, or willingness to pay.
- Usage data showing a “why this recipe?” affordance is opened and acted on, not merely shipped.

---

## Attack 2 — They cannot build it

The hard budget is **160 person-hours total**, including building and testing. The milestones include M3 and M4:

- M3: “full weekly meal optimizer with live retailer prices, stores, allergies, and nutrition”
- M4: “statistically valid food-waste-reduction study with real households”

Each of these could consume the entire budget alone. Together, plus M0/M1/M2, they are impossible. The prompt itself says anything that cannot be built and tested in the budget is out of scope — yet M3 and M4 remain in the plan. That is an internal contradiction.

Even M1 is not a small prerequisite. Project 1a found real defects:

- shopping-item update and purchased-transfer IDOR / missing ownership check;
- weak quantity validation: negative, zero, non-finite values, `quantity || 1`;
- `Boolean("false")` coercion;
- unbounded free-text goals/preferences interpolated into the Gemini prompt — a prompt-injection surface;
- missing docs, environment variables, migrations.

Fixing IDOR/RLS, validation, and prompt injection with tests across an inherited 1,096-test suite is security-sensitive and time-consuming. A rushed fix can regress passing tests or leave new edge cases.

M2 is not a trivial endpoint. It requires a typed contract, a deterministic pure-function ranking, pantry-lot/expiry/nutrient/substitution data, user corrections, and a 500-case test harness. The team’s own adversarial testing found 11 web failures and 7 backend failures, so hidden issues are likely.

M3 requires live retailer price feeds or scraping, store availability, allergy handling, nutrition data, and optimization — with changing live data. M4 requires recruiting real households, data collection, statistical power, and possibly ethics/IRB constraints. Neither fits in the remaining hours.

No hour-by-hour estimate is provided, and no milestone has been cut. This is a wishlist, not a budget-respecting plan.

What would defeat this attack:

- A time-boxed plan totaling ≤160 hours with M3 and M4 explicitly descoped.
- P1a defects fixed, merged, and all inherited/own tests passing before M2 begins.
- A running vertical slice of M2 now, with time logs showing it fits.
- Evidence the team has previously shipped a live-price optimizer or a household study in comparable time.
- An honest descope: M0–M2 may be feasible; M3–M4 are not.

---

## Attack 3 — Someone does it better

The supplied market survey already claims the core feature is not absent:

- Samsung Food+ and Eat This Much already prioritize near-expiry pantry items.
- RecipeFix ships substitution reasoning.
- Grocy computes an expiry due-score.

If those claims are true, then the proposed differentiator is not “nobody does this,” but rather “we render an explanation of something others already prioritize.” An incumbent can add a receipt-like explanation if users demand it.

However, under the evidence rules, I cannot verify these claims because no live URL or page quote was retrieved in this session. So the strongest admissible version of this attack is: **the proposal has not met its own evidence standard**, and therefore has not shown either that rivals do it or that the rivals do it worse.

| Product | Claim from supplied survey | Live URL retrieved this session | Page quote | Verdict |
|---|---:|---:|---:|---|
| Samsung Food+ | prioritizes near-expiry pantry items | unknown | unknown | unverified |
| Eat This Much | prioritizes near-expiry pantry items | unknown | unknown | unverified |
| RecipeFix | ships substitution reasoning | unknown | unknown | unverified |
| Grocy | computes expiry due-score | unknown | unknown | unverified |

If forced to name the most dangerous: **Grocy** is the closest listed threat because a pure-code expiry due-score already looks like the deterministic, non-LL
