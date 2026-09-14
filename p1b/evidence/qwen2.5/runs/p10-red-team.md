# P10 — Red team (qwen2.5:32b)

- Run date: 2026-09-13
- Model: `qwen2.5:32b`
- Method: single-shot API call, fresh context (no conversation memory), no web retrieval (offline model priors)
- Params: temperature=0.3
- Duration: 26.5s  Meta: {"eval_count": 770, "prompt_eval_count": 1950}

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

### Attack 1: Nobody Wants It — The Need is Imagined

**Argument**: The concept of a "recommendation receipt" that breaks down the exact pantry lots, expiry dates, nutrient constraints, and substitutions that led to a recipe recommendation is a niche feature that does not address a widespread need. Most users are more concerned with convenience and speed when planning meals. The complexity of understanding the underlying logic behind a recommendation might deter users rather than attract them. Additionally, the market survey indicates that existing rivals like Samsung Food+, Eat This Much, and Grocy already offer some form of pantry prioritization and expiry management, but none of these features have become a standout selling point. This suggests that the need for such a detailed recommendation receipt is not strongly felt by the market.

**Evidence to Defeat**: To counter this argument, you would need to provide evidence that users are actively seeking more transparency and control over the recommendations they receive. This could include user feedback, surveys, or feature requests from existing users of Epicourier or similar meal-planning applications. Additionally, data showing that users are frustrated with opaque recommendations and are looking for ways to customize and understand their meal plans would be compelling.

### Attack 2: They Cannot Build It — The Month is Too Short, the Team Too Green

**Argument**: Given the hard budget constraint of four graduate students working for one month (approximately 160 person-hours total), building a fully functional "recommendation receipt" feature, along with fixing the existing defects and implementing a pure function for ranking recipes, is an unrealistic goal. The team is described as "green," which implies limited experience and potentially slower development cycles. The complexity of the task, including the need to integrate with existing systems, write robust tests, and ensure security, makes it highly unlikely that all milestones can be achieved within the given timeframe.

**Evidence to Defeat**: To refute this argument, you would need to provide a detailed project plan that breaks down the tasks into manageable chunks and demonstrates how the team can achieve the milestones within the given timeframe. This could include a breakdown of tasks, estimated hours for each task, and a realistic timeline that accounts for the team's experience level. Additionally, evidence of the team's ability to work efficiently and effectively, such as past projects or relevant experience, would be useful.

### Attack 3: Someone Does It Better — Name Who

**Argument**: Existing rivals like Samsung Food+, Eat This Much, and Grocy already offer features that prioritize near-expiry pantry items and provide substitution reasoning. These features are well-implemented and have been refined over time, making them superior to the proposed "recommendation receipt" feature. For example, Samsung Food+ and Eat This Much prioritize near-expiry pantry items, and RecipeFix ships substitution reasoning. Grocy computes an expiry due-score, which is a more advanced form of managing expiry dates. These features are already well-received by users, indicating that they are sufficient and that the proposed feature does not offer a significant advantage.

**Evidence to Defeat**: To counter this argument, you would need to highlight the unique value proposition of the "recommendation receipt" feature. This could include demonstrating how the feature offers more transparency and control over the recommendations, which is not provided by existing rivals. Additionally, you could provide evidence that users are looking for more detailed and customizable recommendations, and that the existing features of rivals do not fully meet this need. This could include user feedback, feature requests, or market research that indicates a demand for more detailed and transparent recommendations.

### Conclusion

To effectively counter these attacks, you need to provide strong evidence that the "recommendation receipt" feature is both desirable and feasible. This includes demonstrating user demand, a realistic project plan, and highlighting the unique value proposition of the feature compared to existing rivals.
