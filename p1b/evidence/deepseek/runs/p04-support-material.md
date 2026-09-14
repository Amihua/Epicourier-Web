# P04 — The support material we have not read yet (deepseek-v4-pro)

- Run date: 2026-09-13
- Model: `deepseek-v4-pro`
- Method: single-shot API call, fresh context (no conversation memory), no web browsing tool available via API (model priors)
- Params: temperature=0.3
- Duration: 213.5s  Meta: {"usage": {"prompt_tokens": 1689, "completion_tokens": 14303, "total_tokens": 15992, "prompt_tokens_details": {"cached_tokens": 1664}, "completion_tokens_details": {"reasoning_tokens": 11125}, "prompt_cache_hit_tokens": 1664, "prompt_cache_miss_tokens": 25}, "reasoning_len": 44312}

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

Assumption: I am rating for a US/EU-facing consumer web app that stores personal, health-adjacent nutrition data, makes AI recommendations, and uses Supabase and Gemini. If you narrow the market to one country, some MUST-READs can be downgraded.

I have not cited URLs as live because I have not retrieved them in this session; each source below is real and findable by exact title/publisher/document number.

## 1. Law and regulation

| # | Real, findable source | Use cases touched | Rating |
|---|---|---|---|
| 1 | EU General Data Protection Regulation, Regulation (EU) 2016/679 | Account sign-in/registration, nutrient dashboard, AI preferences, CSV export, sharing with Gemini | MUST-READ |
| 2 | GDPR Article 9 and Article 25/32: special-category data, data protection by design/by default, security of processing | Nutrient goals, free-text health/diet preferences, AI meal-plan recommendations | MUST-READ |
| 3 | GDPR Article 22 and EDPB guidelines on automated decision-making | AI meal-plan recommendation from free-text goals | MUST-READ |
| 4 | GDPR Article 20 and recital on data portability | Dashboard CSV/text export, meal-plan export | MUST-READ |
| 5 | UK GDPR and Data Protection Act 2018 | Same as GDPR if UK users are supported | SHOULD-READ |
| 6 | California Consumer Privacy Act, as amended by CPRA | Account data, export rights, sharing with Gemini, deletion requests | MUST-READ if California users are allowed |
| 7 | FTC Health Breach Notification Rule, 16 CFR Part 318 | Nutrient dashboard, wellness goals, AI recommendations; US health-adjacent data shared with a vendor | MUST-READ |
| 8 | HIPAA Privacy Rule, 45 CFR Parts 160/164 | Clarifies whether the app is or is not a covered entity/BA; relevant before making any HIPAA compliance claim | SHOULD-READ |
| 9 | Children’s Online Privacy Protection Act, 15 U.S.C. §§ 6501–6506 | Account registration if age gating is absent | SHOULD-READ |
| 10 | EU AI Act, Regulation (EU) 2024/1689 | AI meal-plan recommendation, transparency that users are seeing AI output | MUST-READ |
| 11 | EU ePrivacy Directive 2002/58/EC and national cookie rules | Website analytics, cookies, tracking around sign-in/browsing | SHOULD-READ |
| 12 | EU Unfair Commercial Practices Directive 2005/29/EC | Marketing and UI claims about green/sustainability score, health/nutrition advice | SHOULD-READ |
| 13 | FTC Act Section 5, 15 U.S.C. § 45 | US claims about green/sustainability score, nutrient benefits, AI advice | SHOULD-READ |
| 14 | EU Nutrition and Health Claims Regulation, Regulation (EC) No 1924/2006 | Nutrient dashboard, recipe detail, meal-plan text making “high protein,” “healthy,” or other claims | MUST-READ |
| 15 | EU Food Information to Consumers Regulation, Regulation (EU) No 1169/2011 | Reference intakes, nutrient display values, recipe detail | SHOULD-READ |
| 16 | FDA food-labeling nutrient rules, 21 CFR 101.9 | US percent Daily Value display in recipe detail and nutrient dashboard | MUST-READ if US nutrient labels are shown |
| 17 | EU General Food Law, Regulation (EC) No 178/2002 | AI advice about expired food, inventory expiry warnings, food-safety suggestions | SHOULD-READ |
| 18 | Americans with Disabilities Act Title III and web accessibility case law | Whole web UI: browsing, calendar, inventory, forms | MUST-READ |
| 19 | US Section 508, 29 U.S.C. § 794d | Whole web UI if any US government or educational procurement context applies | SHOULD-READ |
| 20 | European Accessibility Act, Directive (EU) 2019/882 | Whole web UI marketed to EU consumers | MUST-READ |
| 21 | EU Green Claims Directive proposal, COM/2023/166 final | Green/sustainability score and any environmental claim in recipe detail | SHOULD-READ |

## 2. Security, accessibility, and software standards

| # | Real, findable source | Use cases touched | Rating |
|---|---|---|---|
| 22 | OWASP Application Security Verification Standard, current 5.x | All authenticated flows; IDOR, validation, access control | MUST-READ |
| 23 | OWASP Top 10 Web Application Security Risks, current edition | All web use cases | MUST-READ |
| 24 | OWASP API Security Top 10 | Backend endpoints for shopping list, inventory, purchased transfer, share links | MUST-READ |
| 25 | OWASP Top 10 for LLM Applications, current edition | AI meal-plan recommendation, AI recipe suggestions from inventory | MUST-READ |
| 26 | OWASP Authentication Cheat Sheet | Account registration/sign-in, session handling | SHOULD-READ |
| 27 | OWASP Password Storage Cheat Sheet | Account registration/sign-in | SHOULD-READ |
| 28 | OWASP Input Validation Cheat Sheet | Shopping-item quantity, expiryDays, free-text goals/preferences | SHOULD-READ |
| 29 | MITRE CWE Top 25 Most Dangerous Software Weaknesses, current year | General defect prevention across all backend flows | SHOULD-READ |
| 30 | MITRE CWE-639: Authorization Bypass Through User-Controlled Key | Shopping-item update, purchased transfer, share-link ownership | MUST-READ |
| 31 | NIST SP 800-63B Digital Identity Guidelines: Authentication and Lifecycle Management | Account registration/sign-in, password policy, recovery | SHOULD-READ |
| 32 | NIST AI Risk Management Framework 1.0 | AI meal-plan recommendation risk, prompt injection boundary, test strategy | SHOULD-READ |
| 33 | NIST SP 800-61 Rev. 2 Computer Security Incident Handling Guide | Breach response plan if Gemini, Supabase, or user data is compromised | SHOULD-READ |
| 34 | ISO/IEC 27001:2022 | Security management baseline, useful for a one-month project only as a checklist | SKIM |
| 35 | ISO/IEC 27701:2019 | Privacy management extension; useful for GDPR alignment | SKIM |
| 36 | ISO/IEC 25010 SQuaRE product quality model | Security, usability, maintainability, performance criteria | SKIM |
| 37 | ISO 9241-210:2019 Human-centred design | Whole meal-planning workflow and inventory UI | SHOULD-READ |
| 38 | W3C WCAG 2.2 | All web UI: recipe browsing, forms, tables, color-coding, calendar | MUST-READ |
| 39 | EN 301 549 Accessibility requirements for ICT | EU accessibility compliance for web UI | SHOULD-READ |
| 40 | W3C note on cognitive accessibility: “Making Content Usable for People with Cognitive and Learning Disabilities” | Nutrient dashboard, expiry color-coding, AI meal-plan text comprehension | SHOULD-READ |

## 3. Platform, dependency, license, and data-source material

| # | Real, findable source | Use cases touched | Rating |
|---|---|---|---|
| 41 | Supabase Row Level Security documentation | Shopping list, inventory, purchased transfer, share links; fixes IDOR and ownership issues | MUST-READ |
| 42 | PostgreSQL Row Security Policies documentation | Database-level ownership boundaries for all shared/user-owned data | MUST-READ |
| 43 | Supabase Auth and API keys documentation | Service-role key handling, JWT claims, authenticated ownership | MUST-READ |
| 44 | Supabase Terms of Service and Status Page | Data hosting, availability, on-call risk, platform limits | MUST-READ |
| 45 | Vercel/Next.js environment-variable and build documentation | `npm run build`, `SUPABASE_SERVICE_ROLE_KEY`, deployment variables | MUST-READ |
| 46 | Linux Foundation SPDX License List and license-identifier definitions | Reviewing dependency licenses for the web/backend stack | SHOULD-READ |
| 47 | Next.js LICENSE file and package metadata | Whole front end | SHOULD-READ |
| 48 | React LICENSE file | Whole front end | SKIM |
| 49 | Tailwind CSS LICENSE file | Whole visual UI | SKIM |
| 50 | TypeScript LICENSE file | Build tooling | SKIM |
| 51 | FastAPI LICENSE file | Backend API routes | SHOULD-READ |
| 52 | Pydantic LICENSE file and constrained-fields documentation | Backend input validation for quantities, goals, preferences, expiryDays | MUST-READ |
| 53 | PostgreSQL license | Database layer | SKIM |
| 54 | Supabase client library LICENSE file | Frontend/backend Supabase client | SKIM |
| 55 | Google Gemini API Additional Terms and Generative AI Prohibited Use Policy | AI meal-plan recommendation, AI recipe suggestions | MUST-READ |
| 56 | Google Cloud Data Processing Addendum | Personal data sent to Gemini, EU data transfers | SHOULD-READ |
| 57 | Google Generative AI API system-instruction and safety-setting documentation | Prompt-injection boundary, free-text goal/preference handling | MUST-READ |
| 58 | USDA FoodData Central terms and data citation guide | Recipe detail nutrients, nutrient dashboard data, if used | MUST-READ if used |
| 59 | Open Food Facts database license/ODbL | Recipe/ingredient nutrient data, if used | SHOULD-READ if used |
| 60 | The recipe/nutrient data provider’s API terms and attribution requirements, identified from the codebase import list | Recipe browsing, nutrient dashboard, AI recipe suggestions | MUST-READ once identified |
| 61 | `npm audit` output and Python dependency vulnerability scanner report | Whole app dependency risk | MUST-READ |
| 62 | Pydantic Field and type-constraint documentation | Fixing negative/zero/non-finite quantity, unbounded goal length, invalid storage location | MUST-READ |
| 63 | TypeScript runtime-validation library documentation for the chosen validator | Storage location cast, purchase-state boolean coercion, share-link `expiryDays` | SHOULD-READ |

## 4. Domain knowledge: nutrition, food safety, sustainability

| # | Real, findable source | Use cases touched | Rating |
|---|---|---|---|
| 64 | Dietary Guidelines for Americans, current 2025–2030 edition, HHS/USDA | Custom nutrient goals, meal plans, green/sustainability score, nutrient dashboard | MUST-READ |
| 65 | National Academies Dietary Reference Intakes and Recommended Dietary Allowances | Safe upper limits, custom nutrient goals, dashboard thresholds | MUST-READ |
| 66 | WHO Healthy Diet factsheet | Meal-plan recommendations, nutrient goals, sustainability framing | SHOULD-READ |
| 67 | USDA FoodKeeper or FoodSafety.gov storage-time guidance | Pantry/fridge/freezer expiry color-coding, low-stock thresholds, AI expiring-ingredient suggestions | MUST-READ |
| 68 | FDA Food Code 2022 | Food-safety aspects of expired/critical warnings and AI reuse of expired ingredients | SHOULD-READ |
| 69 | EFSA Dietary Reference Values for the EU | EU nutrient-goal defaults and reference intakes | SHOULD-READ |
| 70 | American Heart Association dietary guidance | AI meal-plan goals involving heart-health, sodium, fat, or cardiovascular language | SHOULD-READ |
| 71 | Academy of Nutrition and Dietetics evidence-based practice guidelines | Boundaries between general wellness and clinical nutrition advice | SHOULD-READ |
| 72 | American Diabetes Association Standards of Care, nutrition therapy chapter | AI goal text mentioning diabetes, glucose, low-carb, or medical conditions | MUST-READ if such goals are accepted |
| 73 | EAT-Lancet Commission summary report on healthy diets from sustainable food systems | Green/sustainability score, sustainable meal-plan recommendations | SHOULD-READ |
| 74 | Poore & Nemecek 2018, “Reducing food’s environmental impacts through producers and consumers,” Science | Environmental data behind ingredient-level sustainability scoring | SHOULD-READ |
| 75 | FAO/WHO Sustainable Healthy Diets Guiding Principles | Meal-plan recommendation and green-score logic | SHOULD-READ |
| 76 | Harvard T.H. Chan School of Public Health Nutrition Source | Plain-language nutrition checks for recipe detail and meal plans | SKIM |
| 77 | Our World in Data “Environmental Impacts of Food Production” | Data source for green/sustainability score comparisons | SHOULD-READ |

## 5. Human factors, usability, and operational/on-call load

| # | Real, findable source | Use cases touched | Rating |
|---|---|---|---|
| 78 | Nielsen Norman Group 10 Usability Heuristics for User Interface Design | Whole UI: sign-in, calendar, inventory, shopping-list flows | MUST-READ |
| 79 | Nielsen Norman Group dashboard and chart readability guidance | Nutrient dashboard with daily/weekly/monthly trends | SHOULD-READ |
| 80 | Steve Krug, *Don’t Make Me Think* | Sign-in, meal planning, inventory, shopping-list simplicity | SHOULD-READ |
| 81 | Don Norman, *The Design of Everyday Things* | Human error in purchase transfer, inventory updates, and meal scheduling | SHOULD-READ |
| 82 | ISO 9241-11:2018 Ergonomics of human-system interaction: Usability definitions | Whole product test planning | SKIM |
| 83 | Google Site Reliability Engineering book | On-call load, monitoring, alerting if this project is operated after launch | SHOULD-READ |
| 84 | Google SRE Workbook, monitoring and alerting chapters | Sustainable on-call load for graduate-student maintainers | SHOULD-READ |
| 85 | PagerDuty Incident Management Handbook or equivalent incident-response guide | Incident response, owner load, escalation paths | SKIM |
| 86 | Supabase status page and incident history | Platform outage risk, on-call dependency, data availability | SHOULD-READ |
| 87 | Vercel status page and deployment documentation | Frontend deployment risk, build failures, environment variables | SHOULD-READ |

The highest-leverage items for this project, given the defects already found, are: Supabase RLS/Postgres row security, OWASP ASVS/API/LLM Top 10, Pydantic constraints, WCAG 2.2, GDPR/CCPA, the FTC Health Breach Notification Rule, USDA FoodKeeper shelf-life data, the Dietary Guidelines/DRIs, and the Gemini API terms. Those would most directly change the one-month build-and-test plan.
