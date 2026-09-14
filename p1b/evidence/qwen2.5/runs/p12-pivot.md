# P12 — The pivot question (qwen2.5:32b)

- Run date: 2026-09-13
- Model: `qwen2.5:32b`
- Method: single-shot API call, fresh context (no conversation memory), no web retrieval (offline model priors)
- Params: temperature=0.3
- Duration: 31.5s  Meta: {"eval_count": 923, "prompt_eval_count": 1786}

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

### Alternative Project Proposals

Given the constraints and the team's demonstrated skills, here are three genuinely different project kinds that the team could explore:

#### 1. **A CLI-based Personal Finance Manager**

**Why this team would be unusually good at it:**
- The team has strong skills in TypeScript/Next.js and Python/FastAPI, which can be leveraged to build a robust CLI application.
- The experience with Jest/Pytest will ensure that the application is well-tested, which is crucial for a financial application where reliability is paramount.
- The team's experience with AI/LLM integration can be used to provide intelligent financial advice and predictions.

**One-month build-and-test slice:**
- Develop a CLI application that allows users to track their income, expenses, and savings.
- Implement features such as budgeting, expense categorization, and financial goal setting.
- Integrate AI/LLM to provide personalized financial advice and predictions based on user data.

**What we lose by walking away:**
- We lose the opportunity to create a comprehensive meal-planning application that could potentially serve a large user base.
- The team's work on Epicourier would be abandoned, and the effort put into it would be wasted.

#### 2. **A Library for Automated Data Cleaning and Preprocessing**

**Why this team would be unusually good at it:**
- The team's skills in Python/FastAPI and TypeScript/Next.js can be used to develop a versatile library that can be used in various data science and machine learning projects.
- The experience with Jest/Pytest will ensure that the library is reliable and well-tested.
- The team's experience with Supabase can be used to integrate database functionalities into the library.

**One-month build-and-test slice:**
- Develop a Python library that provides functions for common data cleaning tasks such as handling missing values, removing duplicates, and normalizing data.
- Implement features such as automated data type detection and conversion, and integration with popular data storage solutions like Supabase.
- Write comprehensive tests to ensure the reliability and robustness of the library.

**What we lose by walking away:**
- We lose the opportunity to create a meal-planning application that could potentially serve a large user base.
- The team's work on Epicourier would be abandoned, and the effort put into it would be wasted.

#### 3. **A Chatbot for Mental Health Support**

**Why this team would be unusually good at it:**
- The team's experience with AI/LLM integration can be used to build a chatbot that provides mental health support and advice.
- The skills in TypeScript/Next.js and Python/FastAPI can be used to develop a robust backend for the chatbot.
- The experience with Jest/Pytest will ensure that the chatbot is reliable and well-tested.

**One-month build-and-test slice:**
- Develop a chatbot that provides mental health support and advice to users.
- Implement features such as mood tracking, personalized advice based on user data, and integration with mental health resources.
- Write comprehensive tests to ensure the reliability and robustness of the chatbot.

**What we lose by walking away:**
- We lose the opportunity to create a meal-planning application that could potentially serve a large user base.
- The team's work on Epicourier would be abandoned, and the effort put into it would be wasted.

### Decision: Pivot or Stay the Course?

**Pivot:**

Given the constraints and the team's demonstrated skills, pivoting to a different project could be beneficial. The team has the skills to build a robust CLI-based personal finance manager, a library for automated data cleaning and preprocessing, or a chatbot for mental health support. Each of these projects aligns well with the team's skills and can be completed within the given time frame. Additionally, these projects have the potential to serve a large user base and provide significant value.

**Stay the Course:**

Staying the course with Epicourier could also be beneficial, as the team has already invested significant effort into the project. However, given the identified defects and the need for extensive testing and validation, it may be challenging to complete the project within the given time frame and budget.

### Conclusion

**Pivot:** The team should pivot to a different project. The proposed alternatives align well with the team's skills and can be completed within the given time frame. This approach will allow the team to leverage their strengths and deliver a high-quality product that can serve a large user base.
