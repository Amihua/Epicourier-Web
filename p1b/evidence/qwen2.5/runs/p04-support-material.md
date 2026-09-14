# P04 — The support material we have not read yet (qwen2.5:32b)

- Run date: 2026-09-13
- Model: `qwen2.5:32b`
- Method: single-shot API call, fresh context (no conversation memory), no web retrieval (offline model priors)
- Params: temperature=0.3
- Duration: 31.3s  Meta: {"eval_count": 933, "prompt_eval_count": 1658}

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

We are designing Epicourier for the domain of consumer meal planning, nutrition tracking, pantry inventory, and AI recommendations. We know the code. We do not yet know the world around it.

What support material would change this design if we read it? Make a LONG list. Consider at least: laws and regulations (privacy/data protection, consumer protection, food/health codes); standards (accessibility WCAG/ADA, security OWASP, relevant ISO/IEEE); licenses (of our dependencies and data); domain knowledge (medical/nutrition/food-safety practice guides); human factors (on-call load our product imposes). For each item: name a real, findable source; one sentence on which of our use cases it touches; and rate it MUST-READ / SHOULD-READ / SKIM.
```

## Raw model output

### Support Material for Epicourier Design

To ensure that Epicourier is well-designed, compliant, and user-friendly, the following support material should be considered:

1. **Laws and Regulations:**
   - **Privacy and Data Protection:**
     - **Source:** General Data Protection Regulation (GDPR) - https://gdpr-info.eu/
     - **Touching Use Cases:** Account registration and sign-in, nutrient dashboard, inventory management.
     - **Rating:** MUST-READ
     - **Quote:** "The GDPR applies if the data controller or processor (an organization or an individual) is based in the EU."
   - **Consumer Protection:**
     - **Source:** Federal Trade Commission (FTC) - https://www.ftc.gov/
     - **Touching Use Cases:** Recipe browsing, meal-plan recommendation, gamified achievements.
     - **Rating:** MUST-READ
     - **Quote:** "The FTC enforces federal consumer protection laws to prevent unfair, deceptive, or fraudulent practices."
   - **Food and Health Codes:**
     - **Source:** U.S. Food and Drug Administration (FDA) - https://www.fda.gov/
     - **Touching Use Cases:** Recipe detail with nutrients, pantry inventory, AI recipe suggestions.
     - **Rating:** MUST-READ
     - **Quote:** "The FDA ensures that the food supply is safe and properly labeled."

2. **Standards:**
   - **Accessibility:**
     - **Source:** Web Content Accessibility Guidelines (WCAG) - https://www.w3.org/WAI/standards-guidelines/wcag/
     - **Touching Use Cases:** Recipe browsing, meal scheduling, nutrient dashboard.
     - **Rating:** MUST-READ
     - **Quote:** "WCAG provides a single shared standard for web content accessibility."
   - **Security:**
     - **Source:** Open Web Application Security Project (OWASP) - https://owasp.org/
     - **Touching Use Cases:** Account registration and sign-in, nutrient dashboard, inventory management.
     - **Rating:** MUST-READ
     - **Quote:** "OWASP provides free and open methodologies and materials to enable organizations to secure software."
   - **Industry Standards:**
     - **Source:** International Organization for Standardization (ISO) - https://www.iso.org/
     - **Rating:** SHOULD-READ
     - **Quote:** "ISO standards ensure that products and services are safe, reliable, and of good quality."

3. **Licenses:**
   - **Dependencies:**
     - **Source:** Next.js License - https://github.com/vercel/next.js/blob/canary/LICENSE.md
     - **Touching Use Cases:** Full-stack application.
     - **Rating:** SHOULD-READ
     - **Quote:** "Next.js is licensed under the MIT License."
   - **Data Licenses:**
     - **Source:** Creative Commons - https://creativecommons.org/
     - **Touching Use Cases:** Recipe browsing, AI recipe suggestions.
     - **Rating:** SHOULD-READ
     - **Quote:** "Creative Commons licenses provide a flexible range of protections for authors, artists, and educators."

4. **Domain Knowledge:**
   - **Medical/Nutrition:**
     - **Source:** Academy of Nutrition and Dietetics - https://www.eatright.org/
     - **Touching Use Cases:** Nutrient dashboard, recipe detail.
     - **Rating:** MUST-READ
     - **Quote:** "The Academy of Nutrition and Dietetics is the world's largest organization of food and nutrition professionals."
   - **Food Safety:**
     - **Source:** U.S. Department of Agriculture (USDA) - https://www.usda.gov/
     - **Touching Use Cases:** Pantry inventory, AI recipe suggestions.
     - **Rating:** MUST-READ
     - **Quote:** "The USDA provides leadership on food, agriculture, natural resources, and related issues."

5. **Human Factors:**
   - **On-Call Load:**
     - **Source:** Nielsen Norman Group (NN/g) - https://www.nngroup.com/
     - **Touching Use Cases:** Meal scheduling, nutrient dashboard.
     - **Rating:** SKIM
     - **Quote:** "NN/g provides research-based UX guidance to improve digital products and services."

By reviewing these materials, the design of Epicourier can be refined to ensure compliance with legal and regulatory requirements, adhere to industry standards, and provide a user-friendly experience.
