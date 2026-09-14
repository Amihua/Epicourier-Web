# P06 — Three futures (qwen2.5:32b)

- Run date: 2026-09-13
- Model: `qwen2.5:32b`
- Method: single-shot API call, fresh context (no conversation memory), no web retrieval (offline model priors)
- Params: temperature=0.3
- Duration: 20.6s  Meta: {"eval_count": 611, "prompt_eval_count": 1591}

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

### SAFE Version

**Elevator Pitch:** Epicourier-Web's SAFE version focuses on stabilizing and enhancing the core functionalities of the platform. It aims to improve user experience and reliability by addressing known bugs and adding minor features that directly enhance user satisfaction.

**Buildable in One Month:** The team can focus on fixing the real defects found in the inherited codebase, such as the cross-user IDOR vulnerability (defect a), quantity validation (defect b), and prompt injection (defect f). Additionally, they can implement a basic version of the nutrient dashboard with daily trends and a simple CSV export feature.

**Biggest Risk:** The risk lies in overestimating the time required to fix the identified bugs, which could lead to incomplete or insufficient testing.

**Kill Signal:** "We abandon this version if we see more than 5 new bugs reported by users within the first two weeks of release."

### BOLD Version

**Elevator Pitch:** The BOLD version of Epicourier-Web takes a significant leap by integrating advanced AI features and a more comprehensive user engagement system. It aims to create a more personalized and interactive experience for users, leveraging AI to provide tailored meal recommendations and gamified achievements.

**Buildable in One Month:** The team can build and test the AI meal-plan recommendation feature using Google Gemini 2.5 Flash, focusing on the 3/5/7 meals goal. They can also implement the gamified achievements and wellness challenges, including a basic achievement trigger system.

**Biggest Risk:** The biggest risk is the complexity and reliability of the AI recommendation system. If the AI recommendations are not accurate or useful, it could lead to user dissatisfaction and a high abandonment rate.

**Kill Signal:** "We abandon this version if the AI recommendation system has an accuracy rate below 70% as measured by user satisfaction surveys within the first month of release."

### WILD Version

**Elevator Pitch:** The WILD version of Epicourier-Web is a visionary approach that integrates cutting-edge technology and innovative features. It aims to create a fully automated kitchen assistant that can not only recommend meals but also automatically order groceries and manage inventory based on user preferences and consumption patterns.

**Buildable in One Month:** The team can build and test a basic version of the automated grocery ordering system, which integrates with popular grocery delivery services. They can also implement a basic version of the inventory management system that tracks expiration dates and suggests recipes based on expiring ingredients.

**Biggest Risk:** The biggest risk is the feasibility and reliability of the automated grocery ordering and inventory management systems. If these systems are not reliable or user-friendly, they could lead to significant user frustration and abandonment.

**Kill Signal:** "We abandon this version if the automated grocery ordering system fails to place orders correctly more than 10% of the time within the first month of release."

Each version represents a different level of risk and potential reward, allowing the team to choose the path that best aligns with their goals and resources.
