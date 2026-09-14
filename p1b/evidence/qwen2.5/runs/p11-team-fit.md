# P11 — Play to the team (qwen2.5:32b)

- Run date: 2026-09-13
- Model: `qwen2.5:32b`
- Method: single-shot API call, fresh context (no conversation memory), no web retrieval (offline model priors)
- Params: temperature=0.3
- Duration: 28.9s  Meta: {"eval_count": 855, "prompt_eval_count": 1701}

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

Given the current team's demonstrated skills in TypeScript/Next.js, Python/FastAPI, Supabase, Jest/Pytest, and AI/LLM integration, the best approach for the team would be to focus on directions that leverage these skills while minimizing the need for significant new learning. Here's a breakdown of the candidate directions:

1. **Secure Explainable Pantry Planner (Recommendation Receipt):**
   - **Pros:** This direction aligns well with the team's existing skills in AI/LLM integration and web development. The team can build on the existing pantry planner features and enhance them with explainable recommendations.
   - **Cons:** Requires some understanding of security practices, but this is generally learnable within the given timeframe.
   - **Feasibility:** High. The team can build and test a secure and explainable pantry planner within the budget.

2. **Broader All-in-One Expansion:**
   - **Pros:** This direction allows the team to expand the existing features of Epicourier-Web, which they are already familiar with.
   - **Cons:** The scope can quickly become too large, making it difficult to build and test everything within the budget.
   - **Feasibility:** Medium. The team should focus on a subset of features to ensure they can build and test them within the budget.

3. **Retailer Price Optimizer / Grocery-Receipt OCR:**
   - **Pros:** OCR technology is an interesting addition that can complement the existing features.
   - **Cons:** Requires significant expertise in OCR technology and possibly machine learning, which the team may not have.
   - **Feasibility:** Low. Learning OCR and machine learning within a month is challenging, and the team may not be able to build and test a robust solution.

4. **Clean-Slate CLI Security-Regression Tool for CRUD Apps:**
   - **Pros:** This direction leverages the team's existing skills in Python and testing.
   - **Cons:** Requires a deep understanding of security and regression testing, which may not be within the team's current skill set.
   - **Feasibility:** Medium. The team can learn the necessary security practices, but it may be a bottleneck if not everyone can grasp the concepts quickly.

5. **Reusable "Receipt" Component/Library:**
   - **Pros:** This direction allows the team to create a reusable component that can be integrated into various applications.
   - **Cons:** Requires a good understanding of component design and testing, but this is generally within the team's skill set.
   - **Feasibility:** High. The team can build and test a reusable component within the budget.

6. **Dump the Old Product and Start Fresh in a New Language:**
   - **Pros:** This direction allows the team to start fresh and potentially build a better product.
   - **Cons:** Requires learning a new language and framework, which is not feasible within the given timeframe.
   - **Feasibility:** Very Low. Starting fresh in a new language is a significant undertaking that would exceed the budget.

### Recommended Direction:
The **secure explainable pantry planner** is the best direction for the team. It leverages their existing skills in AI/LLM integration and web development, and the team can build and test a secure and explainable pantry planner within the budget. This direction also provides a clear focus and scope that can be managed within the given constraints.

### Ownership and Bottlenecks:
- **Frontend (TypeScript/Next.js):** One or two team members should own the frontend development, ensuring the explainable recommendations are integrated seamlessly.
- **Backend (Python/FastAPI):** One or two team members should own the backend development, focusing on the security aspects and integration with Supabase.
- **Testing (Jest/Pytest):** One team member should own the testing, ensuring that both frontend and backend components are thoroughly tested.
- **AI/LLM Integration:** One team member should own the AI/LLM integration, ensuring that the recommendations are explainable and secure.

By dividing the work this way, the team can avoid bottlenecks and ensure that all components are developed and tested within the budget.
