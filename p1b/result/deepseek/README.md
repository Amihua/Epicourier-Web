# Project 1b — deepseek-v4-pro Column

**Run date:** 2026-09-13 · **Model:** `deepseek-v4-pro` · **Analyst:** Jeffery (fzheng4)

Third cloud model, DeepSeek V4 (a reasoning model), via the OpenAI-compatible API. Each of the twelve
starter prompts was issued in a **separate, fresh call with no memory of any other prompt**, with the
team's shared evidence block pasted in unedited — the same inputs the Claude and Codex columns saw,
so the cross-model comparison is a real comparison.

## Method and honest limitations

- **No live web retrieval.** The DeepSeek API call had no browsing tool enabled.
  So any product name, URL, or price below is the **model's recalled prior, not a fetched page** —
  it does NOT satisfy the two-model rule's "live URL" clause and must be treated as a lead to verify,
  not as evidence. Where this column agrees with Claude/Codex on a rival, it adds to the "named by N
  models" count; where it invents a URL, that is a caught error for the D5 report, not a source.
- Single-shot, temperature 0.3. Raw transcripts (prompt exactly as issued + raw output + timing/token
  meta) are in [`../../evidence/deepseek/runs/`](../../evidence/deepseek/runs/).

---

## P01 — Map the competition

## Ten closest competing products

Ordered roughly by overlap with Epicourier-Web: meal planning, recipe browsing, pantry/inventory, shopping lists, nutrition, and AI/automation.

| Product | Who uses it | Main strength | Main weakness | Price | Evidence URL |
|---|---|---|---|---|---|
| **Cooklist** | Households wanting pantry-aware meal planning and grocery sync | Links grocery purchases to recipes and pantry inventory; meal planning around what you already have | No evidence of free-text AI meal planner, nutrient dashboard, streaks/achievements, or expiry colour-coding | Unknown | https://cooklist.com |
| **Supercook** | Home cooks with ingredients to use up | Recipe search by entering ingredients you have; reduces food waste | Not a full meal planner/calendar; lacks nutrition trends and shopping-to-pantry transfer | Unknown | https://www.supercook.com |
| **Eat This Much** | Fitness/meal-prep users with calorie/macro goals | Generates meal plans automatically from nutrition/diet targets; grocery list | No evidence of pantry expiry tracking or purchased-item transfer | Unknown | https://www.eatthismuch.com |
| **Mealime** | Busy singles, couples, families wanting simple meal plans | Simple meal planning, dietary preferences, grocery lists, nutrition info | No evidence of inventory expiry/AI use-up suggestions or gamified challenges | Unknown | https://www.mealime.com |
| **Samsung Food** | Home cooks saving recipes and planning meals | Recipe saving, meal planner, shopping list; large ecosystem | No evidence of expiry colour-coding or free-text AI meal-plan goals | Unknown | https://samsungfood.com |
| **BigOven** | Family meal planners and leftover users | Meal planning, grocery lists, “use up leftovers” suggestions | No evidence of AI free-text meal plans, nutrient dashboard, or inventory expiry | Unknown | https://www.bigoven.com |
| **Plan to Eat** | Organized meal planners and recipe keepers | Drag-and-drop meal planner, recipe organization, auto-generated grocery list | No evidence of AI recommendation, expiry tracking, or gamification | Unknown | https://www.plantoeat.com |
| **AnyList** | Households managing shared groceries and recipes | Shared grocery lists, recipe import, meal planning | No evidence of pantry expiry/AI meal generation or purchased-transfer flow | Unknown | https://www.anylist.com |
| **Paprika** | Recipe collectors and meal planners | Recipe management, pantry, grocery lists, meal plans | No evidence of AI recommendations, nutrition dashboard, or challenges | Unknown | https://www.paprikaapp.com |
| **Yummly** | Home cooks discovering personalized recipes | Personalized recipes by taste/diet, shopping list | No evidence of full pantry expiry, AI use-up suggestions, or purchased-transfer flow | Unknown | https://www.yummly.com |

**Evidence caveat:** I could not independently retrieve these pages in this session, so the URLs above are product homepages from prior knowledge, and the price cells are marked `Unknown` rather than guessed. Under the evidence rules in the brief, feature and price cells should be re-verified against the live pages before use.

## P02 — Mine the complaints

## Clustering and ranking

**Evidence note:** I treated the five quoted strings and URLs in the prompt as the evidence record. I did not successfully retrieve the live Reddit pages in this response, so any “fixed by current product?” status is marked **not established** rather than asserting a market fact.

Severity scale used: **1 = minor convenience, 5 = blocks or severely degrades a core loop.**

| Rank | Theme | Complaints clustered | Frequency / 5 | Severity | Score | Representative verbatim quote | Fixed by any current product? |
|---|---|---|---:|---:|---:|---|---|
| 1 | **Manual data-management burden** — adding one’s own foods/recipes and maintaining pantry items | #1, #2 | 2 | 4 (daily core workflow friction) | **8** | `"hard time adding my own recipes/meals ... to the Meal Planner"` — https://www.reddit.com/r/Myf

## P03 — Table stakes or differentiator?

## Methodological note

I did **not** perform any live web retrieval in this session, so under the supplied evidence rules I cannot name rival products, give live URLs, or quote page text. Every competitor feature claim is therefore marked **unknown**. The classifications below are based on the use-case definitions and the Project 1a product description only.

| UC | Classification | Justification | Rival evidence |
|---|---|---|---|
| UC1 Register account | TABLE STAKES | Account creation is baseline plumbing for any personalized multi-user system. | Unknown — no live URL retrieved |
| UC2 Sign in | TABLE STAKES | Sign-in is the unavoidable paired operation with registration before user-scoped actions. | Unknown |
| UC3 Browse recipes | TABLE STAKES | Recipe browsing/search is the core content surface a recipe or meal-planning product cannot omit. | Unknown |
| UC4 View recipe details | TABLE STAKES | A detail view follows directly from browsing and carries the base information users expect. | Unknown |
| UC5 Request a personalized meal plan | DIFFERENTIATOR | Free-text goal to AI-generated 3/5/7-meal plans is a specific behavior, not universal manual/template planning.

## P04 — The support material we have not read yet

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

## P05 — Who else is in the room?

Customer, staff, and admin are already covered. Additional stakeholders:

| New stakeholder | What they fear about Epicourier-Web | One design decision that would win them over |
|---|---|---|
| 3 a.m. on-call maintainer — the current students | A live incident from the known IDOR, prompt-injection, or quantity-validation defects, with no audit trail or runbook. | Harden all mutations with authenticated ownership checks, strict positive/finite quantity validation, server-side input sanitization, request IDs, and audit logs. |
| Next cohort / future maintainer | A clean clone will not build because the service-role key, three further env vars, thirteen migrations, and five CSV imports are undocumented. | A one-command bootstrap script and README quickstart that CI tests from a fresh clone to a passing test suite. |
| Data protection regulator — GDPR/CCPA | Free-text goals and preferences may contain health, dietary, or religious data sent to Gemini without explicit consent, retention, or deletion controls. | Granular consent before AI features, a local-only mode, data export/delete, and short-lived retention for prompt text. |
| Health / medical-device regulator — FDA/FTC | Nutrient dashboards, AI meal plans, and sustainability scores become implied health claims or unregulated medical advice. | A conspicuous non-medical disclaimer; no disease or treatment claims; traceable nutrition data sources. |
| User with severe food allergy | AI suggestions or recipe search may fail to filter a deadly allergen. | Mandatory allergen profile applied as a hard filter across search, AI suggestions, meal plans, and shopping lists, with cross-contact labels. |
| User with an eating disorder / disordered eating history | Streaks, completion tracking, calorie goals, and wellness challenges encourage restriction, guilt, or relapse. | A neutral mode that disables gamification, streaks, and calorie-focused messaging while preserving planning functionality. |
| Accessibility advocate / disabled user | Calendar and dashboard interactions may be unusable with a screen reader or keyboard. | WCAG 2.2 AA as definition-of-done, with keyboard and screen reader checks in CI. |
| Low-income / food-insecure user | Default recipes assume expensive ingredients; core features may become paywalled or stigmatizing. | Budget filter and cost-per-serving display, with core meal planning kept free. |
| Dietitian / nutrition professional | A confident AI meal plan undermines professional advice because users cannot see uncertainty or sourcing. | Exportable professional review package and source-linked nutrient data; high-risk goals prompt “discuss with your clinician.” |
| Public health / food safety authority | Suggestions that prioritise expired ingredients may cause foodborne illness. | Follow official food-safety guidance; never recommend high-risk expired foods, and warn clearly for any expiry-based suggestion. |
| University legal counsel / risk office | The team is sued for allergic reaction, illness, data breach, or harmful AI advice. | Terms of use, liability boundary, incident response plan, and privacy/security review before launch. |
| Cloud / API provider — Supabase, Google Gemini | Service-role key leakage, prompt injection, API abuse, or ToS violations. | Secrets in a secret manager, server-side sanitization of untrusted free text, rate limits, and quotas. |
| Environmental / sustainability auditor | The “green/sustainability score” becomes greenwashing because method and data are opaque. | Publish the scoring method and data sources; label the score as an estimate, not eco-certification. |
| Grocery retailer / personal shopper / courier | Structured shopping lists create substitution, expiry, or quantity errors that workers are blamed for. | Structured item schema with quantity, unit, storage, allergen, substitute, and expiry fields. |
| Security researcher | Responsible disclosure of the IDOR and input-validation flaws is ignored or punished. | A `security.txt` file, safe-harbor policy, and public credit for verified fixes. |
| Caregiver / household manager | One profile cannot safely model multiple people’s allergies, diets, schedules, or budgets. | Household profiles with per-member constraints applied to the planner and shopping lists. |
| Non-English / international user | US-centric units, ingredients, language, and date formats make the app unusable. | An i18n/l10n framework with metric/imperial toggle and regional ingredient aliases. |
| Child user / parent — COPPA / age-appropriate design | Minors may be subject to data collection or gamified manipulation. | Age gate and no under-13 account without verified parental consent. |
| Funder / future acquirer | There is no auditable evidence the product can be built and tested within budget; investment is risky. | Keep the auditable run-log and evidence rules from Project 1a in every release, including failures and bad results. |

## P06 — Three futures

Scope note: no external products are named below, so no evidence URLs are required by the evidence rules. All product facts come from the shared evidence block.

## SAFE — “Hardened 1.1: close the known holes”

**Elevator pitch.** Turn Project 1a’s defect list into a trustworthy baseline: close the IDOR, validation, and prompt-injection surfaces before anyone tries to show the app outside the course. This is the unglamorous release that makes every later version safer to build.

**What four students could build AND test in one month:**

- **Backend owner:** add authenticated ownership checks to UC18/UC20 and Supabase RLS; harden quantity, boolean, storage location, achievement trigger, prompt-length, and `expiryDays` inputs.
- **Frontend owner:** fix `quantity || 1`, `Boolean("false")`, and storage-location runtime validation; surface permission/validation errors properly.
- **QA owner:** grow adversarial coverage from 44 web / 25 backend to roughly 80 web / 45 backend; write a regression test for every 1a defect a–g; keep the inherited 1,095-test suite stable.
- **Docs/DevOps owner:** make `npm run build` succeed with a documented `SUPABASE_SERVICE_ROLE_KEY`; document all env vars, 13 migrations, 5 CSV imports, and the `search_path` patch.

**Biggest risk.** The ownership/RLS changes are cross-cutting and may break legitimate multi-user flows that the current tests do not see.

**Kill signal.** Abandon the full release on **2026-09-27** if fewer than **6 of 7 defects a–g** are fixed with a passing regression test; otherwise keep the closed defects and cut the remaining scope.

---

## BOLD — “Zero-Waste Engine”

**Elevator pitch.** The product already collects expiry and inventory data; this version makes avoiding waste the product’s center of gravity instead of a filtering sidebar. Users get an expiry action queue, a household waste ledger, and shopping duplicate blocking that turns inventory data into visible money and food saved.

**What four students could build AND test in one month:**

- **Backend owner:** add a `waste_log` table and endpoints for logging wasted ingredients, cost estimates, and weekly waste-avoidance totals; block shopping-list items already present in inventory unless explicitly allowed.
- **AI/prompt owner:** change the Gemini recommendation boundary so expiring ingredients are explicitly prioritized and the response format is testable; use a mocked Gemini backend for deterministic tests.
- **Frontend owner:** expiry action queue sorted by expired/critical/warning; waste log UI; weekly “waste avoided/saved” summary with CSV export.
- **QA/user-test owner:** scripted recommendation tests with the AI mock; API validation tests for waste logs and duplicate blocking; 10-person usability pilot covering one waste-logging flow.

**Biggest risk.** The underlying AI layer is non-deterministic, so the core value may not hold outside a mocked test harness, and manual waste logging may feel like a chore.

**Kill signal.** Abandon on **2026-10-04** if fewer than **35 of 50** mocked recommendation trials place at least one expiring ingredient in the top-3 suggested meals.

---

## WILD — “Autonomous Fridge-to-Checkout Loop”

**Elevator pitch.** A user approves a plan and the app orders the missing ingredients, then checks the delivery into inventory automatically. This is probably wrong for one month because real retailer APIs, payment, and fulfillment are outside the student budget.

**What four students could build AND test in one month:**

- **Backend owner:** build a mock grocery-provider API and an order state machine covering plan → cart → order → partial fill → delivery → inventory check-in.
- **Integration owner:** map shopping-list items to mock store SKUs; reconcile delivered quantities with inventory.
- **Frontend owner:** “Buy missing items” flow, simulated order tracking, and voice-captured meal-plan input via browser speech recognition.
- **QA owner:** end-to-end simulated order tests, out-of-stock/partial-fill/cancel cases, and delivery-to-inventory reconciliation.

**Biggest risk.** Even if the mock is good, the real-world value depends on external partners, payment credentials, and live inventory availability that cannot be tested in 160 person-hours.

**Kill signal.** Abandon on **2026-09-20** if fewer than **20 of 25** scripted mock order-state transitions pass end-to-end; the mock may survive only as a test fixture, not as a product direction.

## P07 — The gap, with receipts

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

## P08 — Mission statement, minus the buzzwords

### Candidate 1

1. Household cooks waste perishables because meal suggestions hide the reasoning behind them and treat unknown expiry dates as silent gaps.  
2. Epicourier-Web gives those cooks a meal planner that turns pantry, fridge, and freezer inventory into Gemini 2.5 Flash recommendations with a per-plan receipt.  
3. The receipt lists the exact pantry lots that caused each recommendation, marks each lot as expired, critical, warning, or unknown, and separates causal inputs from ignored stock.  
4. That audit trail lets a cook see that tonight’s soup was chosen because lot #17 spinach expires Thursday and lot #9 stock has an unknown expiry, not because of a generic preference.  
5. M0 claim: at M0, 80% of generated meal plans will show a receipt naming every inventory lot that influenced the recommendation, against a baseline of 0% in the inherited Epicourier product.

### Candidate 2

1. Household cooks cannot act on AI meal suggestions when the system cannot prove that expiring stock, rather than generic taste, drove the plan.  
2. Epicourier-Web records a provenance receipt alongside each meal recommendation generated by Gemini 2.5 Flash.  
3. The receipt names each pantry, fridge, or freezer lot used as an input, including lots with expired or critical expiry status and lots whose expiry is unknown.  
4. A cook can follow the exact path from expiring chicken thighs or an unlabelled freezer container to the recommended meal, and can then decide to eat, freeze, or discard with evidence.  
5. M0 claim: at M0, 70% of recommendations that use an expiring or unknown-expiry lot will cite that lot on the receipt, up from a baseline of 0% because the current recommendation path stores no provenance.

### Candidate 3

1. Household cooks managing perishables need a system that treats missing expiry data as a first-class signal, not a blank field.  
2. Epicourier-Web builds meal plans from pantry, fridge, and freezer stock using Gemini 2.5 Flash, and attaches a receipt to each plan.  
3. The receipt shows which specific lots with known expiry states pushed a meal into the plan, and which unknown-expiry lots were considered but could not be verified.  
4. This distinction lets a cook see that the plan avoids the unknown-date salmon and uses the expiring milk, which is safer than a recommendation that hides uncertainty.  
5. M0 claim: at M0, 60% of unknown-expiry lots that appear in a recommendation path will be listed separately on the receipt, compared with a baseline of 0% in the current Epicourier UI.

## P09 — Milestone reality check

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

## P10 — Red team

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

## P11 — Play to the team

## Independent analyst recommendation

**Bottom line: choose the secure explainable pantry planner, with the “recommendation receipt” as the new user-facing capability.** It is the only direction that stays entirely inside the team’s demonstrated skills, reuses an already-tested codebase, and turns Project 1a’s concrete defect list into a bounded one-month work package.

I am deliberately not naming rival products here. No live competitor pages were retrieved for this decision, and under the evidence rules an unnamed product I cannot quote is safer than an invented one.

---

## Why this wins the 160-hour budget

The team has demonstrated: TypeScript/Next.js, Python/FastAPI, Supabase, Jest/Pytest, and AI/LLM integration. The existing product already exercises all of these.

Project 1a supplied a ready backlog of real defects:

- IDOR in shopping-item update and “purchased” transfer.
- Negative/zero/non-finite quantity handling.
- `Boolean("false")` coercion.
- Storage-location validation by TypeScript cast only.
- Unbounded Gemini prompt input — prompt injection.
- Share-link ownership and `expiryDays` issues.
- Missing env docs, migrations, CSV imports, and build failure.

Those are not vague roadmap ideas; they are already discovered, reproducible, and testable. The secure explainable pantry planner direction is therefore mostly hardening plus one feature: a user-visible, auditable recommendation receipt showing what the AI recommended, why, and which inventory evidence supported it.

A “receipt” here should mean:

> A structured, saved explanation of an AI meal plan or inventory transfer: the user’s goal, constraints, matched inventory, expiring items used, nutrients, sustainability score, and cited evidence for each recommendation.

That is much smaller than a new product.

---

## Direction-by-direction assessment

| Direction | Verdict | Main reason |
|---|---|---|
| Secure explainable pantry planner | **Select** | Fits skills, existing code, existing tests, concrete defect backlog, bounded scope |
| Broader all-in-one expansion | Not selected | Feasible, but scope is unbounded and would likely become feature-accumulation without finishing security |
| Retailer price optimizer / grocery-receipt OCR | **Trap** | Requires OCR/computer vision, retailer data access, price normalization, and likely scraping or API relationships none of the skills demonstrate |
| Clean-slate CLI security-regression tool for CRUD apps | Trap unless drastically narrowed | Generic static analysis/taint detection across CRUD apps is a research-size problem, not a one-month one |
| Reusable receipt component/library | Premature | Could be extracted after the in-app receipt works; packaging and API maintenance are unproven skills and add risk |
| Dump old product and start in a new language | Trap | No evidence of another language/toolchain, discards a mostly green 1,095-test suite, and wastes the p1a audit |

The secure explainable pantry planner maximizes **build and test**, because every change maps to a regression test, and the inherited suite already provides a large safety net.

---

## What I would build in one month

### Must have

1. **Fix the Project 1a security defects**
   - Add authenticated ownership checks to UC18/UC20.
   - Enforce Supabase RLS for shopping items and transfers.
   - Validate quantity as finite and positive.
   - Parse booleans correctly.
   - Use a runtime whitelist for storage location.
   - Bound free-text goal/preferences before Gemini interpolation.
   - Add share-link ownership and expiry validation.

2. **Add the recommendation receipt**
   - Gemini output constrained to a JSON schema, not free text.
   - Receipt stored with the user ID.
   - Receipt shows: user goal, constraints, inventory used, expiring/expired items, match percentage, nutrients, sustainability score, and a short evidence string.
   - Receipt is read-only and owned by the user.

3. **Fix the build/documentation defect**
   - Make `npm run build` pass without undocumented `SUPABASE_SERVICE_ROLE_KEY`.
   - Document the env vars, migrations, and CSV imports.

### Should have if time permits

- Achievement trigger validation.
- Low-risk UI polish for the receipt.
- CSV/text export of receipts or plans.

### Must not do

- Add more planner features.
- Attempt OCR or price optimization.
- Extract a standalone library in the first month.
- Rewrite any major part of the stack.

### Definition of done

- All p1a defects above are either fixed with regression tests or explicitly marked out-of-scope with a reason.
- The inherited suite passes: 1,095/1,096 or better.
- New backend security/adversarial tests pass.
- New frontend interaction tests pass.
- `npm run build` passes with documented env.
- A user can enter a free-text goal and receive an AI meal plan with a stored receipt.

---

## Time allocation

| Workstream | Hours | Owner role |
|---|---|---|
| Security hardening: UC18/UC20, RLS, validation, share links | 50 | Backend/API owner |
| AI receipt pipeline: prompt boundary, JSON schema, receipt storage | 35 | AI integration owner |
| Frontend receipt UX and shopping-transfer flow | 35 | Frontend owner |
| Test harness, adversarial suites, build docs, CI | 20 | QA/integration owner |
| Final integration, demo, run-log documentation | 20 | Whole team |

Total: **160 hours**.

---

## Ownership without bottlenecks

Because individual biographies are unknown, roles should be assigned by artifact, not by person.

Proposed ownership:

- **Backend/API owner:** shopping list, transfer, RLS, validation, share links.
- **AI integration owner:** prompt template, input boundary, Gemini output schema, receipt storage.
- **Frontend owner:** receipt component, transfer UX, plan view.
- **QA/integration owner:** regression harness, adversarial tests, build/docs/CI, release integration.

To prevent bottlenecks:

- Prompt templates and receipt schemas live in version-controlled files, not in one person’s head.
- RLS/security changes are paired-reviewed by at least one other person.
- The release integrator rotates weekly.
- Every merge requires passing tests.
- The QA owner does not own product features; they own proof that features work.

The most likely bottleneck is the backend/API owner, because security fixes span multiple use cases. The mitigation is to pair that owner with the AI or QA owner on the highest-risk items, and to make the test harness runnable by everyone.

---

## The trap directions and missing skills

The clearest trap is **retailer price optimizer / grocery-receipt OCR**.

It requires:

- Receipt OCR or computer vision.
- Retailer price data access.
- Price normalization across stores, brands, package sizes, and dates.
- Scraping or formal API relationships the team has no evidence of having.

Those are not weekend learnable. Reliable receipt OCR alone is a specialized problem, and pricing data has legal and access issues. The right move is to redesign around it by not doing it in this budget.

A secondary trap is the **clean-slate CLI security-regression tool for CRUD apps**. Detecting IDOR or missing ownership checks generically across arbitrary applications requires static analysis, AST/parser work, per-framework adapters, and a lot of test infrastructure. The team knows how to test one app, but that is not the same as building a tool that tests many apps. That skill gap is not weekend learnable either.

The **new-language rewrite** is also a trap because it throws away the strongest evidence the team has: a working, mostly green suite in a stack they already know.

---

## Final recommendation

Build the **secure explainable pantry planner** as a hardening-and-receipt release. Treat Project 1a’s defect list as the initial backlog. Add only one visible feature: the stored, testable recommendation receipt. Pair security changes, keep prompt/schema files version-controlled, rotate the integrator, and finish only when the inherited suite, new security tests, new receipt tests, and documented build all pass.

## P12 — The pivot question

No competitor products are named below, so no live-URL evidence is needed. This is a project-kind analysis only.

## Decision

**Pivot.** Stay the course means spending the one-month budget fixing an inherited 20-use-case meal planner. The better use of this team’s demonstrated edge is a small, test-heavy tool aimed at the exact failure class Project 1a already surfaced.

Build **Option 1**: an LLM input/output guardrail library and CLI.

---

## Option 1 — LLM input/output guardrail library/CLI

**Domain:** AI application security / developer tooling  
**User:** developers integrating LLM-generated input or output  
**Form:** Python library + TypeScript library + small CLI

### Why this team specifically

Project 1a gave them direct, reproducible evidence of the problem class:

- unbounded free-text goals and preferences interpolated into Gemini prompts — a live prompt-injection surface;
- an LLM-written “match percentage” printed in bold with no application-level recomputation;
- weak coercions such as `Boolean("false")` becoming `true`.

That is unusually specific preparation. The team also has both Python/FastAPI and TypeScript/Next.js skills, so it can ship the same guardrails to both sides of a modern LLM stack.

### One-month build-and-test slice

Build a small policy/validation core:

- strict input policies: bounded text, enum, strict boolean, numeric range, non-negative integer, URL, length caps;
- output policies for LLM-written claims: require application-side recomputation or fail closed;
- prompt-injection canaries and redaction/deny rules for untrusted free text;
- FastAPI middleware and a Next.js/TypeScript helper;
- Pytest and Jest suites replaying the actual Epicourier failures as fixtures: negative quantities, `Boolean("false")`, >4096-char injection, LLM-written percentage.

Deliverable: two packages, CLI, docs, CI.

### What we lose by walking away

We lose the consumer meal-planning product and its 20 use cases. We keep the defects as test fixtures. That is an acceptable trade because the inherited product is broad and currently untrustworthy.

---

## Option 2 — Supabase/Postgres RLS test harness

**Domain:** database security / developer tooling  
**User:** small teams building on Supabase  
**Form:** CLI / test generator

### Why this team specifically

Project 1a found cross-user IDOR in UC18 and UC20 because shopping-item update and purchased-transfer were scoped by item ID only, with no ownership check. The team has already learned what a missing RLS-boundary failure looks like in real code, and it has Pytest/Jest skills to generate repeatable tests.

### One-month build-and-test slice

A CLI that introspects a Supabase schema and RLS policies, identifies likely ownership relationships from foreign keys, and emits Pytest/Jest tests that create two tenant users and assert cross-user access is denied. Validate it against a known-vulnerable fixture and a hardened fixture.

### What we lose by walking away

We lose the meal-planning product and most of the AI-integration surface. This option is narrower and leans less on the team’s LLM experience.

---

## Option 3 — Verification-first AI code-review bot

**Domain:** developer productivity / security  
**User:** small teams reviewing pull requests  
**Form:** GitHub/GitLab bot or PR CLI

### Why this team specifically

The team knows from direct testing that LLM output cannot be trusted unless it is verified. It also has full-stack and FastAPI skills. A code-review bot that refuses to block on raw LLM claims and instead requires a deterministic failing check matches that exact lesson.

### One-month build-and-test slice

A FastAPI webhook receiver that runs deterministic detectors — Boolean coercion, negative quantity, missing ownership checks, unbounded LLM inputs — and uses an LLM only to explain already-reproduced findings. Test with recorded webhooks and adversarial PR fixtures.

### What we lose by walking away

We lose the meal planner and may spend too much of the 160 hours on GitHub app permissions, hosting, and webhook edge cases. It is a real project, but less contained than Option 1.

---

## Final answer

**Pivot.** Build the LLM input/output guardrail tool. It is the best fit for the team’s demonstrated skills, the one-month constraint, and the exact defects Project 1a already produced.
