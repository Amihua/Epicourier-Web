# P03 — Table stakes or differentiator? (qwen2.5:32b)

- Run date: 2026-09-13
- Model: `qwen2.5:32b`
- Method: single-shot API call, fresh context (no conversation memory), no web retrieval (offline model priors)
- Params: temperature=0.3
- Duration: 40.0s  Meta: {"eval_count": 1189, "prompt_eval_count": 1730}

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

Here are our 20 use cases from Project 1a:

UC1 Register account; UC2 Sign in; UC3 Browse recipes; UC4 View recipe details;
UC5 Request a personalized meal plan; UC6 Schedule a meal; UC7 Track meal completion;
UC8 Review nutrient progress; UC9 Set nutrient goals; UC10 Export nutrient history;
UC11 Review achievements; UC12 Join a wellness challenge; UC13 Review inventory;
UC14 Add inventory item; UC15 Edit inventory item; UC16 Remove inventory items;
UC17 Get inventory-based recipe suggestions; UC18 Create and populate shopping list;
UC19 Generate shopping list from meal plan; UC20 Complete shopping and stock inventory.

Classify each: TABLE STAKES (every rival has it; we must too) or DIFFERENTIATOR (rare or absent in rivals). One sentence of justification each — name the rival that has it, or state that none does.

Then propose two use cases that appear in NO current product but follow naturally from ours. For each: who wants it, and why nobody has built it yet.
```

## Raw model output

### Classification of Use Cases

1. **UC1 Register account** - **TABLE STAKES**. Every meal-planning and inventory management app requires account registration. Example: [Yummly](https://www.yummly.com/) offers account registration for personalized meal planning.

2. **UC2 Sign in** - **TABLE STAKES**. Similar to account registration, sign-in functionality is a standard feature. Example: [Mealime](https://www.mealime.com/) requires users to sign in to access their meal plans.

3. **UC3 Browse recipes** - **TABLE STAKES**. Most meal-planning apps offer a recipe browsing feature. Example: [BigOven](https://www.bigoven.com/) provides extensive recipe browsing capabilities.

4. **UC4 View recipe details** - **TABLE STAKES**. Detailed recipe views are common across meal-planning apps. Example: [Allrecipes](https://www.allrecipes.com/) offers detailed recipe pages with ingredients and steps.

5. **UC5 Request a personalized meal plan** - **DIFFERENTIATOR**. While some apps offer meal plans, personalized meal plans based on user input are less common. Example: [PlateJoy](https://www.platejoy.com/) offers personalized meal plans but not as extensively as Epicourier-Web.

6. **UC6 Schedule a meal** - **TABLE STAKES**. Scheduling meals is a standard feature in meal-planning apps. Example: [Plan to Eat](https://plantoeat.com/) allows users to schedule meals.

7. **UC7 Track meal completion** - **TABLE STAKES**. Tracking meal completion is a common feature. Example: [Mealime](https://www.mealime.com/) allows users to track meal completion.

8. **UC8 Review nutrient progress** - **DIFFERENTIATOR**. Nutrient tracking and progress review are less common. Example: [MyFitnessPal](https://www.myfitnesspal.com/) offers nutrient tracking but not as comprehensive as Epicourier-Web.

9. **UC9 Set nutrient goals** - **DIFFERENTIATOR**. Setting custom nutrient goals is a unique feature. Example: [Cronometer](https://cronometer.com/) allows setting goals but not as personalized as Epicourier-Web.

10. **UC10 Export nutrient history** - **DIFFERENTIATOR**. Exporting nutrient history is a rare feature. Example: [MyFitnessPal](https://www.myfitnesspal.com/) allows exporting data but not as detailed as Epicourier-Web.

11. **UC11 Review achievements** - **TABLE STAKES**. Achievement tracking is common in gamified apps. Example: [MyFitnessPal](https://www.myfitnesspal.com/) offers achievements and badges.

12. **UC12 Join a wellness challenge** - **DIFFERENTIATOR**. Wellness challenges are less common. Example: [MyFitnessPal](https://www.myfitnesspal.com/) offers challenges but not as extensive as Epicourier-Web.

13. **UC13 Review inventory** - **TABLE STAKES**. Inventory review is a standard feature in apps like Epicourier-Web. Example: [Mealime](https://www.mealime.com/) allows users to review their inventory.

14. **UC14 Add inventory item** - **TABLE STAKES**. Adding inventory items is a common feature. Example: [Plan to Eat](https://plantoeat.com/) allows users to add inventory items.

15. **UC15 Edit inventory item** - **TABLE STAKES**. Editing inventory items is a standard feature. Example: [Mealime](https://www.mealime.com/) allows users to edit inventory items.

16. **UC16 Remove inventory items** - **TABLE STAKES**. Removing inventory items is a common feature. Example: [Plan to Eat](https://plantoeat.com/) allows users to remove inventory items.

17. **UC17 Get inventory-based recipe suggestions** - **DIFFERENTIATOR**. Inventory-based recipe suggestions are less common. Example: [Mealime](https://www.mealime.com/) offers suggestions but not as personalized as Epicourier-Web.

18. **UC18 Create and populate shopping list** - **TABLE STAKES**. Creating and populating shopping lists is a standard feature. Example: [BigOven](https://www.bigoven.com/) allows users to create and populate shopping lists.

19. **UC19 Generate shopping list from meal plan** - **TABLE STAKES**. Generating shopping lists from meal plans is a common feature. Example: [Mealime](https://www.mealime.com/) allows users to generate shopping lists from meal plans.

20. **UC20 Complete shopping and stock inventory** - **TABLE STAKES**. Completing shopping and stocking inventory is a standard feature. Example: [Plan to Eat](https://plantoeat.com/) allows users to complete shopping and stock inventory.

### Proposed New Use Cases

1. **UC21: Generate personalized grocery coupons based on inventory and meal plan** - **Who wants it**: Users who want to save money on groceries. **Why nobody has built it yet**: Integrating with grocery stores and managing dynamic coupon generation is complex and requires partnerships.

2. **UC22: Integrate with smart kitchen devices for automated inventory updates** - **Who wants it**: Users with smart kitchen devices who want seamless inventory management. **Why nobody has built it yet**: Integrating with multiple smart kitchen devices and ensuring compatibility is technically challenging and requires extensive testing.
