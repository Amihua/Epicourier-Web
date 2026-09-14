# P05 — Who else is in the room? (deepseek-v4-pro)

- Run date: 2026-09-13
- Model: `deepseek-v4-pro`
- Method: single-shot API call, fresh context (no conversation memory), no web browsing tool available via API (model priors)
- Params: temperature=0.3
- Duration: 110.6s  Meta: {"usage": {"prompt_tokens": 1611, "completion_tokens": 7702, "total_tokens": 9313, "prompt_tokens_details": {"cached_tokens": 1408}, "completion_tokens_details": {"reasoning_tokens": 6704}, "prompt_cache_hit_tokens": 1408, "prompt_cache_miss_tokens": 203}, "reasoning_len": 31918}

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

Our stakeholders so far: customer, staff, admin.

That list is lazy. Extend it. Consider: who pays, who profits, who is harmed, who is ignored, who regulates, who maintains this at 3 a.m., who gets sued when it fails, whose job changes because it exists.

For each new stakeholder: what they fear about our product, and one design decision that would win them over. Output as a table.
```

## Raw model output

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
