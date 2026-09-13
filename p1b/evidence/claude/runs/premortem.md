# premortem

**Workflow:** P1b Claude independent prompts (run 2)  
**Phase:** Contend  
**Model:** Claude Opus 5 (1M context), `claude-opus-5[1m]`  
**Agent id:** `abe538f7d9402dc22`  
**Tool calls:** 7 total — 0 web searches, 0 pages fetched  
**Raw transcript:** `raw/agent-abe538f7d9402dc22.jsonl` (full tool-call trace, retained)

---

## Prompt, exactly as issued

```text
Write a failure autopsy IN ADVANCE. This is a pre-mortem, and it is a prompt of our own
invention, not one of the twelve starters.

Assume it is one month from 2026-09-13. The project FAILED: the team demoed something dull, the
poster did not sell it, and the marker wrote "ambitious claims, thin evidence".

THE PLAN THAT FAILED:
Epicourier-Web is a full-stack meal-planning web application (Next.js 15 / TypeScript / Tailwind
front end; FastAPI + Python back end; Supabase/PostgreSQL; Google Gemini 2.5 Flash for
recommendation). Its twenty implemented use cases cover: account registration and sign-in;
recipe browsing with search, dietary tags and an "inventory match percentage"; recipe detail
with nutrients and a green/sustainability score; AI meal-plan recommendation from a free-text
goal (3/5/7 meals); calendar meal scheduling and meal-completion tracking; a nutrient dashboard
with daily/weekly/monthly trends, custom nutrient goals, and CSV/text export; gamified
achievements, streaks and wellness challenges; pantry/fridge/freezer inventory with expiry
colour-coding and low-stock thresholds; AI recipe suggestions that prioritise ingredients that
are expiring or already expired; shopping-list creation from a meal plan or a recipe; and a
"purchased" transfer flow that moves checked shopping-list items into the user's inventory.

The proposed extension: make the AI meal recommendation auditable — show which pantry lots,
expiry dates and nutrient constraints caused a recipe to rank, let the user correct the inputs,
and measure afterwards whether it changed what got thrown away.

HARD BUDGET CONSTRAINT, to be respected in every recommendation: four graduate students,
ONE MONTH, about ten hours per person per week (roughly 160 person-hours TOTAL), to build
AND test the result.

WHAT PROJECT 1A ESTABLISHED, with auditable numbers (do not inflate these, and do not use the
inherited README's "1,130+ tests" boast, which is the previous team's claim, not ours):
- The team forked Epicourier-Web at 467 commits, 79 test files, last upstream commit 2025-12-07.
- The inherited web suite passed 1,095 of 1,096 tests in 3.6 seconds with no flakes.
- The team wrote its own tests: Web P1a 32 tests, 31 PASS / 1 FAIL. Backend P1a 18 cases, 18 PASS.
- With adversarial tests included: Web 44 executed, 33 PASS / 11 FAIL; Backend 25 executed,
  18 PASS / 7 FAIL.
- Real defects found: (a) shopping-item update and "purchased" transfer are scoped by item ID
  only, with no authenticated-ownership check — a cross-user IDOR subject to Supabase RLS;
  (b) quantity validation accepts negative, zero, and non-finite values (quantity || 1 turns 0
  into 1); (c) Boolean("false") coerces to true and flips purchase state; (d) storage location
  is validated only by a TypeScript cast, so any string passes at runtime; (e) achievement
  trigger values are unchecked; (f) Pydantic accepts unbounded free-text goals and preferences
  (>4096 chars) that are interpolated straight into the Gemini prompt with no untrusted-data
  boundary — a live prompt-injection surface; (g) share-link creation has no ownership check and
  no bound on expiryDays.
- Documentation defect: npm run build fails on a missing, undocumented SUPABASE_SERVICE_ROLE_KEY;
  three further env vars the code reads are undocumented; thirteen migrations and five CSV
  imports are required and unmentioned; one migration needed patching because the base schema
  empties search_path.

Write the autopsy as if it already happened. Be specific and unkind:
- Week by week, what actually consumed the hours? Name the specific task that ran long. (Hint:
  in a four-person student team it is almost never the feature; it is environment setup, merge
  conflicts, the one person who went quiet, and the report written in the last 48 hours.)
- Which single decision, made in week 1, caused the failure?
- What did the team build that nobody asked for?
- What did the team NOT build that the poster promised?
- Where did the evidence turn out to be thinner than claimed?

Then, and only then, work backwards: list the five changes to make NOW, this week, that would
have prevented each failure. Rank them by how much failure each one prevents per hour spent.

End with the single sentence the team should write on the wall.
```

## Response

# Failure Autopsy — Epicourier-Web P1b Extension
**Written in advance, 2026-09-13. Dated as if 2026-10-13. Verdict on the sheet: "ambitious claims, thin evidence."**

---

## 0. The one number that explains everything

160 person-hours were spent. **29 of them (18%) touched the feature on the poster.** The other 131 went to environment setup, merge repair, demo-data seeding, a dead-end LLM explanation experiment, and a report written in the last 48 hours. The marker did not write "thin evidence" because the team was lazy. They wrote it because the team spent five sixths of its budget on everything except the claim.

---

## 1. Week by week: where the hours actually went

### Week 1 (Sep 14–20) — 41h logged, 5h on the extension
- **20h — local environment, four people, independently.** `npm run build` died on the undocumented `SUPABASE_SERVICE_ROLE_KEY`. Then three more env vars the code reads and INSTALL.md does not mention. Then thirteen migrations in `supabase/migrations/`, applied in order, one of which had to be patched because the base schema empties `search_path`. Then five CSV imports. Two people did the whole sequence twice because the first Supabase project was created on a personal account nobody else could admin. **This was a known, documented, already-diagnosed defect from P1a. The team fixed it four times in private instead of once in the repo.**
- 6h — a 90-minute scoping meeting ×4 people, which produced a feature list and a drawer wireframe. It did not produce a metric, an instrument, or a baseline date.
- 4h — re-running P1a evidence to confirm it still reproduced.
- 3h — Gemini key provisioning and free-tier 429s.
- 3h — branch protection, `.coderabbit.yaml`, an argument about Tailwind.
- 5h — the "Why this recipe?" drawer mock.

### Week 2 (Sep 21–27) — 38h logged, 11h on the extension
- **9h — merge conflicts.** Three people branched off `web/src/types/data.ts` and `web/src/app/dashboard/recommender/` on Monday and nobody integrated until Friday night. The Friday merge took one person four hours alone.
- **7h — discovering, in week 2, that there are no lots.** `web/src/app/api/inventory/transfer/route.ts` upserts by `user_id + ingredient_id + location` and *sums quantities into one row*. `user_inventory` therefore has no per-purchase lot, no per-lot expiry, no provenance. The poster's central promise — "show which pantry lots caused a recipe to rank" — was **not representable in the schema**, and a two-hour read of `supabase/migrations/20251129030000_user_inventory.sql` in week 1 would have said so. Half of week 2's design was built on a table that does not exist.
- 6h — chasing the single inherited failing test because the CI badge looked bad. Nobody was grading the inherited suite.
- **5h of unearned budget — teammate D went quiet.** Two job interviews and another course's midterm. D owned the *correction* path (user edits the inputs, system re-ranks). The task sat untouched for nine days because nobody wanted to have the conversation, and it was never reassigned.
- 11h — drawer UI against mocked data.

### Week 3 (Sep 28–Oct 4) — 43h logged, 9h on the extension
- **12h — making the demo look real.** Recipes with no nutrient rows render zeros. Re-seeding re-fires achievements. The five CSVs were re-imported three times. This is the single most under-budgeted task in every student project and it happened again here.
- **8h — the waste study that never started.** A Google Form was designed, five people were recruited, six days of self-reported discards were collected. No baseline period. No control. No pre-registration. No instrumented event — the app never learned that anything was thrown away.
- **7h — asking Gemini to explain Gemini.** Because no deterministic score existed, `build_prompt()` in `backend/api/inventory_recommender.py` was extended to ask the model for its own rationale. The rationales were fluent, unstable across reruns, and twice cited pantry items that were not in the inventory. Two people spent the week prompt-tuning it into *looking* consistent. **This is post-hoc rationalisation, not an audit trail, and the marker spotted it in ninety seconds.**
- 6h — scope creep (§3).
- 10h — coursework collisions, a laptop with a half-applied migration, a three-hour Supabase free-tier pause mid-session.

### Week 4 (Oct 5–12) — 38h logged, 4h on the extension
- **26h — poster and report, all four people, Oct 10–12, in one Google Doc, simultaneously.** The results section was written before the results existed, and the numbers were back-filled Sunday afternoon.
- 6h — the IDOR fix, written on a branch that conflicted with the drawer branch, never merged. The poster says "hardened." `web/src/app/api/shopping-lists/[id]/items/[itemId]/route.ts` still ends its update with `.eq("id", itemId)` and nothing else.
- 4h — no rehearsal; instead, four hours at 11pm fixing a cold Supabase instance that 500'd during the dry run.
- 2h — security "fixes" nobody re-tested.

---

## 2. The single week-1 decision that caused the failure

**The team decided the deliverable was a panel, not a number.**

In the Monday scoping meeting they produced a wireframe of the audit drawer and a list of what it would display. They did not produce: the outcome metric, the table that stores it, the query that reports it, or the date the baseline starts. Every subsequent failure is a corollary:

- No metric → no instrument → no baseline → the waste claim had to be manufactured in week 3 from a six-day convenience sample (§5).
- A panel to display → the ranking stayed inside the LLM → the panel had nothing real to render → Gemini was asked to explain itself → the "audit" was a story, not a trace.
- A wireframe instead of a schema read → the lot blocker surfaced on day 12 instead of day 3.
- A feature backlog instead of a claim list → no cut list → scope creep had nothing to run into.

Everything in this autopsy is downstream of one hour on Monday of week 1.

---

## 3. What the team built that nobody asked for

- A **"Waste Warrior" achievement badge and streak**. The codebase has a gamification system, so gamification was added. 4h.
- An **explanation-verbosity setting** (concise / detailed / nerd). 2h.
- A **model-comparison toggle** (Gemini 2.5 Flash vs Flash-Lite) with no evaluation harness to compare anything. 3h.
- An **animated audit timeline** with staggered transitions. 3h.
- A **CSV export of the audit log**, duplicating `web/src/app/api/nutrients/export/route.ts`. 2h.
- **Playwright scaffolding** that never ran in CI and was not in the report. 4h.
- A **re-skin of the inventory cards**. 2h.
- A fix for the **one inherited failing test**, which was not ours and was not graded. 6h.

**26 person-hours — nearly as much as the entire feature received.** Every one of these is visible on a screen, which is exactly why they got built: they produce the feeling of progress without the risk of measurement.

---

## 4. What the team did NOT build that the poster promised

| Poster promise | Shipped |
|---|---|
| "show which pantry **lots**, expiry dates and nutrient constraints caused a recipe to rank" | A drawer showing ingredient names and a Gemini-authored sentence. No lots — the schema has none. No constraint trace — no constraints are computed. |
| "**let the user correct the inputs**" | Read-only. D owned the write-back path; D went quiet; nobody reassigned it. There is no re-rank, therefore no counterfactual, therefore nothing to audit against. |
| "**measure afterwards whether it changed what got thrown away**" | No discard event, no `discarded_at`, no `discard_reason`, no baseline period. A six-day, n=5, self-reported survey, reported as a percentage. |
| "we hardened the ownership checks found in P1a" | Unmerged branch. The unscoped update is still in `main`. |
| "we identified and mitigated a prompt-injection surface" | Identified in P1a. Mitigated: no. `RecommendRequest.goal: str` in `backend/api/index.py` is still unbounded and still flows into the prompt string. |

---

## 5. Where the evidence turned out to be thinner than claimed

- **"1,095 / 1,096 passing" is borrowed credit.** It is the previous team's suite, testing the previous team's code. It is on our poster in 48-point type and it says nothing about our extension.
- **"in 3.6 seconds" is a confession, not a boast.** Eleven hundred tests in 3.6 seconds means essentially nothing touches a database, a network, or Gemini. The suite proves the code compiles against mocks.
- **The poster showed 18/18 backend and hid 7/25.** With adversarial cases included: Web 33/44, Backend 18/25. The failures were *ours*, they were *real*, and they were *reported as discoveries while remaining unfixed*. Finding a defect and leaving it is evidence of reading, not of engineering — and the marker asked, out loud, "so how many did you fix?"
- **"7 defects found" omits "0 defects fixed."**
- **The IDOR is conditional and the condition was never checked.** "Subject to Supabase RLS" — nobody ever inspected whether RLS was enabled on `shopping_list_items` in the deployed project. A conditional exploit with an unexamined condition is a hypothesis.
- **The prompt-injection demo is n=1.** One crafted goal string, one local run, no taxonomy, no defense, no re-test, no screenshot in the appendix.
- **The waste delta is the worst offender.** n=5, six days, self-reported, no baseline window, no control arm, no pre-registration, participants were the developers' roommates — and it was reported to two significant figures. A sample that cannot support one digit was printed with two. That single line is what earned "ambitious claims, thin evidence."

---

## 6. The five changes to make NOW — ranked by failure prevented per hour

| # | Change (do it this week) | Hours | What it kills | Ratio |
|---|---|---|---|---|
| **1** | **Freeze the claims before the code.** Write the poster's Results paragraph today with numeric blanks, and beside each blank write the exact SQL/endpoint that fills it. Any sentence whose query does not exist is deleted from the poster now, not in week 4. | **2** | The marker's exact verdict. Converts "ambitious claims" into "claims we can fill." | **Highest** |
| **2** | **One-command bootstrap, verified on someone else's laptop.** Commit `.env.example` with all four vars including `SUPABASE_SERVICE_ROLE_KEY`, a `make bootstrap` that applies the 13 migrations (with the `search_path` patch) and the 5 CSV imports, and a seed script with nutrient rows. Done when a teammate clones fresh and runs the app in under 15 minutes. | **3** | ~20 person-hours of week 1, ~12 hours of week 3 demo-data panic, and the 11pm cold-instance demo failure. | **~10:1** |
| **3** | **Ship the ruler before the feature.** Add `inventory_events` (or `discarded_at` + `discard_reason` + `quantity`) and a one-tap "threw this out" control, and **start logging the baseline this week.** A one-month project can buy exactly two weeks of baseline, and only if it starts on day 3. | **5** | The entire "measure afterwards" promise, which is otherwise unpurchaseable at any price in week 3. | **High** |
| **4** | **Make the ranking deterministic; demote the LLM to phrasing.** Extract a pure `score(recipe, inventory_rows, goals) -> {score, contributions[]}` in `backend/api/inventory_recommender.py`, unit-test it on fixed inputs with no API key, pass its output *as data* into the prompt and into the UI. The drawer then renders the same struct the ranker used. Also decide in writing, this week, whether `inventory_lots` gets added or the poster says "batch" instead of "lot." | **8** | The post-hoc-rationalisation trap, the hallucinated pantry items, the untestable panel, the week-2 schema ambush — and it removes the free-text goal from the ranking path, which is also defect (f). | **Lowest ratio, highest floor — without it there is nothing honest to demo** |
| **5** | **Cadence and tripwires.** Wednesday integration merge to `main`, never Friday. One branch per person, WIP limit 1. A named owner per poster panel. **No push in 5 days = the task is reassigned, automatically, without a conversation.** Report frozen day 26, poster printed day 27. | **2 setup + 1/wk** | 9h of merge repair, D's 5 lost hours plus the promise they took down with them, and the 26-hour report weekend. | **High** |

Do 1, 2 and 5 on Monday — seven hours total. Do 3 by Wednesday. Do 4 across weeks 1–2 and cut every item in §3 to pay for it.

---

## The sentence for the wall

**Ship the ruler before the feature: if we cannot name the query that fills the blank, the sentence does not go on the poster.**
