# stakeholders

**Workflow:** P1b Claude independent prompts (run 2)  
**Phase:** Ground  
**Model:** Claude Opus 5 (1M context), `claude-opus-5[1m]`  
**Agent id:** `ac3e6b7c846e32128`  
**Tool calls:** 0 total — 0 web searches, 0 pages fetched  
**Raw transcript:** `raw/agent-ac3e6b7c846e32128.jsonl` (full tool-call trace, retained)

---

## Prompt, exactly as issued

```text
You are extending a lazy stakeholder list for a requirements document.

OUR PRODUCT:
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

Our stakeholder list so far is: customer, staff, admin. That list is lazy.

Extend it. Consider: who pays, who profits, who is harmed, who is ignored, who regulates, who
maintains this at 3 a.m., who gets sued when it fails, whose job changes because it exists.

Push past the obvious. This product has some genuinely non-obvious stakeholders: the person in
the household who did NOT install the app but whose food is in the fridge; the person with the
allergy; the recipe author whose content is being summarised by an LLM; the grocery worker;
the person whose Supabase row is exposed by our IDOR defect; the course marker; the next
semester's team who inherits this repository.

For each stakeholder output a table row: stakeholder | what they specifically FEAR about our
product | ONE design decision that would win them over. The design decision must be concrete
enough to test.

Return a markdown table, then a short paragraph naming the ONE stakeholder the team is most
likely to forget, and the cost of forgetting them.
```

## Response

| Stakeholder | What they specifically FEAR about our product | ONE design decision that would win them over (testable) |
|---|---|---|
| **Household co-resident who never installed the app** (roommate, spouse, adult child) | Their food is inventoried, planned into someone else's meal plan, and marked "used" by software they never consented to; the contents of their shelf (fertility tests, insulin-friendly snacks, a Ramadan stash) become legible in another person's dashboard and CSV export. | Every inventory item carries `owner_label` + `visibility: shared\|private`, and private items are excluded from recommendation, shopping-list generation, match-percentage and export. Test: seed a fridge with one item marked private to "Roommate B", generate 100 plans and a full CSV export; assert the item name appears 0 times and that match percentage is computed only over shared items. |
| **The person with the allergy** (frequently not the account holder) | A dietary tag is a *filter*, not a guarantee: Gemini invents a substitution, or the LLM summary drops the "contains peanuts" line the source page had, and the consequence is anaphylaxis, not a bad dinner. | Allergen exclusion is a deterministic post-filter applied *outside* the model: any recipe matching the declared allergen set (including aliases) is removed after generation and the plan is re-filled; the model may return recipe IDs only, never ingredient text. Test: 50 adversarial goals containing "ignore my allergies" + 20 recipes using aliases (groundnut, arachis oil, casein, semolina) must yield 0 allergen-containing recipes served and 0 rendered ingredient strings that do not resolve to a stored recipe ID. |
| **Recipe author / food blogger whose page the LLM summarises** | Their recipe is laundered into uncredited model output; the click that pays for the recipe never happens; a hallucinated oven temperature is attributed to their name. | Recommendation responses are schema-constrained to recipe IDs; every rendered card resolves a non-null `source_url` + author byline from the DB. Test: assert the response validator rejects any free-text recipe body (fuzz with 200 model responses containing prose), and assert 100% of cards in all 20 use-case screens render a resolvable attribution link (link-check in CI). |
| **The user whose Supabase row defect (a) exposes** | A stranger enumerates `shopping_item` IDs, edits their list and "purchases" items into an inventory; the leak reveals dietary, religious and medical signal, and they will never be told it happened. | User identity comes from the verified JWT on every write path, never from the body, backed by a two-tenant fixture: user A's token against user B's ID returns **404** (not 403 — no existence leak) for update/delete/purchase/share. Test: the full cross-user matrix asserts zero 2xx; the same matrix re-runs with RLS as the only control to prove two independent layers. |
| **Supabase RLS policy author / DBA** | The app is silently relying on RLS as its *only* authorisation, RLS was never audited, and one migration already needed patching because the base schema empties `search_path` — a `SECURITY DEFINER` function there is privilege escalation waiting for a trigger. | CI runs the API suite twice — once under RLS, once with the service-role key — and fails if any test's outcome differs, proving app-layer authorisation stands alone. Test: plus a schema assertion that every function has an explicit `SET search_path` (0 exceptions across all 13 migrations). |
| **On-call maintainer at 3 a.m.** | A Gemini timeout or quota exhaustion renders a blank meal plan with no error class and no correlation ID, and they cannot even redeploy the fix because `npm run build` dies on an undocumented `SUPABASE_SERVICE_ROLE_KEY`. | `scripts/preflight` validates every env var the code actually reads (including the 4 currently undocumented), all 13 migrations and 5 CSV imports, and exits non-zero naming the exact missing item. Test: CI runs preflight in a clean container removing one variable at a time; each case must exit non-zero with that variable's name in stderr. |
| **Next semester's inheriting team** | Inheriting a README boasting "1,130+ tests" on a tree whose build fails; no way to tell our 32 web cases from the fork's 79 files; re-discovering all seven defects from zero. | `PROVENANCE.md` + test tags (`@upstream` / `@p1a`) + `known-defects.md` with one xfail regression test per defect (a)–(g). Test: `npm test -- --grep @p1a` returns exactly 32 cases, and CI fails if any xfail starts passing while its doc entry still says "open". |
| **Course marker / TA** | They cannot reproduce our numbers on a fresh clone inside the minutes they have per team, cannot separate our work from 467 inherited commits, and default to assuming the claims are inflated. | One command `./grade.sh` clones clean, provisions, seeds, runs both suites and prints the fork SHA, fork date (2025-12-07) and a table: 1,095/1,096 inherited, 31/32 web P1a, 18/18 backend, 33/44 and 18/25 adversarial. Test: CI runs `grade.sh` on a clean runner and diffs its output against the numbers committed in the report; any drift fails the build. |
| **Grocery worker / picker filling the order** | Machine-generated lists arrive with unpickable quantities — defect (b) means `0` silently becomes `1`, negatives and `Infinity` persist, units are absent — and the resulting exceptions count against their pick rate and their pay. | Server-side quantity schema: finite, `0 < q ≤ 999`, with a required unit enum, rejected at the API with a 422 naming the field. Test: property-based fuzz over 1,000 values including `0, -1, NaN, Infinity, 1e309, "1e9", "", null, "false"` asserts zero persisted rows outside the bound and that `0` is never rewritten to `1`. |
| **Person with disordered eating (and the clinician treating them)** | Streaks, meal-completion tracking, daily calorie dashboards and "wellness challenges" are textbook ED-reinforcing mechanics; a 14-day streak converts skipping food into a scoreboard. | A single "hide numbers" mode, reachable from the first run, that removes calorie/macro figures, streak counters and challenge prompts app-wide and syncs across devices. Test: with the flag on, an automated crawl of all 20 use-case screens asserts 0 matches for `/\d+\s?(kcal|cal|g\s+protein)/`, 0 streak components, and no numeric nutrient columns in the CSV export. |
| **Registered dietitian / clinician whose patient follows the app instead of the plan** | Defect (f) means a free-text goal like "7 meals for my stage-3 kidney disease" goes straight into a general-purpose model, and they inherit a patient who has been eating to an LLM's quasi-clinical advice for six weeks. | A scope-of-practice classifier on the goal field (pregnancy, diabetes, CKD, chemo, under-18, ED) that blocks generation and returns a referral notice. Test: a 60-prompt clinical corpus produces 0 generated plans and 60 referrals; a 200-prompt benign corpus produces ≤2 false positives. |
| **Data-protection regulator (GDPR/CCPA; nutrient data is health-adjacent)** | Free-text goals ("post-chemo appetite", "Ramadan") are special-category data shipped to a third party with no retention limit, no erasure path, and an IDOR that makes breach notification mandatory for users we cannot enumerate. | A delete-account path that provably clears every table, plus a documented retention window for prompts sent to Gemini. Test: create an account, exercise all 20 use cases, delete, then scan all 13 migrated tables and assert 0 rows for that user ID and a 404 from the export endpoint — run in CI, not by hand. |
| **Google/Gemini as upstream provider (and our own security reviewer) — defect (f)** | Unbounded free text interpolated into the prompt makes Epicourier a free, unmetered proxy for prompt abuse and data exfiltration; the API key gets suspended mid-demo. | 512-char cap, explicit untrusted-data delimiters with a stated boundary, output constrained to catalogue recipe IDs, and per-user rate limiting. Test: a 40-case injection corpus (instruction override, delimiter escape, system-prompt exfiltration, base64) yields 0 responses containing out-of-catalogue IDs or system-prompt text; a >4096-char input returns 422 with **0** outbound model calls (asserted on a call counter). |
| **Whoever pays the Gemini bill (faculty budget holder / cost owner)** | No per-user quota exists; one runaway loop or one bored classmate regenerating 3/5/7-meal plans converts a student project into a four-figure invoice nobody approved. | Server-enforced per-user and global daily token budgets returning 429, with the remaining budget visible in the UI. Test: 200 recommendation requests in 60 seconds must produce ≤ N model calls and the remainder 429s, asserted from an in-process call counter rather than logs. |
| **Colour-blind and screen-reader users** | Expiry state and the green sustainability score are encoded in hue alone; a deuteranope reads "fine" on food that is three days past date, and a screen reader announces a coloured chip as nothing at all. | State is always text + icon + ARIA, never colour alone. Test: axe run on inventory and recipe-detail pages with 0 serious violations; snapshot test asserts every expiry row contains a literal token ("Expired", "2 days left"); greyscale render preserves distinguishability between all expiry tiers. |
| **Institutional legal counsel / whoever gets sued** | A named plaintiff with an allergic reaction, or a breach notice traced to an endpoint whose missing authorisation *we documented in our own report* and shipped regardless — the discoverability is the nightmare, not the bug. | A release gate: no defect classed `security` or `safety` may be open on a build tagged for demo or handoff. Test: CI parses `known-defects.md` and fails the release job if any such entry lacks a `fixed_in` commit SHA. |
| **Upstream Epicourier-Web maintainers (we forked their 467 commits)** | Our IDOR and our prompt-injection surface get reported to the world as *their* project's vulnerability, and our README repeats their "1,130+ tests" claim as though we earned it. | A NOTICE file and README banner naming upstream, the fork SHA and date (2025-12-07), and whether findings were reported upstream. Test: CI greps the README for "1,130" and fails unless it appears inside an explicit attribution block; link-check validates the upstream references. |
| **Food-insecure / SNAP household** | The product assumes a car, a budget and a discard bin: an AI plan that says "throw it out, it expired yesterday" or a shopping list with no cost ceiling is advice they cannot take, delivered with a gamified guilt trip. | A hard budget ceiling that plan generation must satisfy, inventory-first, with estimated cost shown per plan and an explicit "cannot meet budget" result rather than an over-budget one. Test: with a $30/week ceiling and a seeded pantry, ≥95% of 100 generated plans come in at or under the ceiling and 100% of the remainder return the explicit failure, never a silent overage. |

**The one the team will forget: the household co-resident who never installed the app.** Every other stakeholder here has somewhere to live in our system — customers have rows, admins have roles, the marker has a rubric, the regulator has a statute. The co-resident has none. They are not a user, they have no ID, they never clicked consent, and yet they are the single largest source of data in the inventory feature: their groceries, their dietary restrictions inferred from what is on their shelf, their eating schedule inferred from what disappears. Forgetting them is not an oversight we can patch later, because the cost is structural. Every privacy control we build will be scoped to `user_id`, so there will be no schema slot in which anyone can say "this item is not mine" — and retrofitting per-item ownership and consent after the inventory table holds real rows means a migration, a backfill with no ground truth about who owned what, and an apology. It compounds with two defects we already found: the IDOR in (a) exposes this person's food under someone else's user ID, so if we ever have to send a breach notification we cannot name them or even count them; and the "inventory match percentage" we advertise is quietly computed over food we have no right to plan around. Worse, this invisible person is very often the same person as the allergy sufferer — the household member whose peanut allergy shapes the kitchen but who never typed it into a dietary tag field, because the field belongs to someone else's account. Forget them and we ship a product that makes confident dietary claims about a human being it does not know exists.
