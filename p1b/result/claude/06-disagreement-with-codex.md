# D5 (part) — Cross-model disagreement: Claude vs Codex

**Prompt:** C4, *Disagreement forcing* (ours) · **Run date:** 2026-09-13 · **Model:** Claude Opus 5 (1M context)

The rubric says *"All models agreed on everything" reads as one model used three times.* Running the same prompt on several models and hoping they differ leaves the most valuable output to chance. This prompt makes disagreement the deliverable: Claude was shown the Codex analyst's actual conclusions (from [`../codex/README.md`](../codex/README.md)) and scored on where it dissents and on what evidence would settle each dispute.

Twelve disagreements were registered. Claude lost some of them on checking, which is recorded below rather than quietly dropped.

---

# Second-Analyst Review — Epicourier-Web P1b

**Run date:** 2026-09-13. **Analyst:** Claude (Opus 5). **Target:** Codex P1b output at `p1b/result/codex/README.md`.

---

## DISAGREEMENT REGISTER

| # | Topic | Codex position | Claude position | Evidence that would settle it | Status after my check |
|---|---|---|---|---|---|
| **D1** | Git history as skill evidence | D5 ledger: "Git contributors reveal team skills → REJECT; require real biographies" | Admissible and decisive. Git is weak on who *owns* a skill, strong on what the team has *demonstrated* — and here it changes the plan | A validated VCS-as-expertise method + actually running the inspection on this repo | **Codex is wrong.** Its "caught error" is itself an error. I ran the inspection in ~5 min and it materially changes M1/M2 risk |
| **D2** | Codex §11 "Repository evidence demonstrates collective TypeScript/Next.js, Python/FastAPI, Supabase … work" | Asserted as team capability | This describes the **upstream** team (467 commits, ended 2025-12-07), not ours. Our team's 63 commits touch **zero** production files | `git log --since=2026-08-01 --name-only` | **Confirmed error.** Also self-contradictory: Codex rejected git evidence in D5, then used it in §11 |
| **D3** | Broad expiry-aware gap is "DEAD", pillar 2: Eat This Much | "Eat This Much advertises pantry-prioritized automatic planning" as refuting evidence | Category error. ETM prioritises **leftovers** and decrements pantry by **meal-plan consumption timing**, explicitly not shelf life | ETM's own pantry help page | **Refuted.** Pillar 2 does not support the expiry claim |
| **D4** | Broad expiry gap, pillar 1: Samsung Food | Food+ prioritizes near-use-by items | Substantially supported — but Codex's cited URL is unverifiable to me, and it is a **search mode**, not automatic plan generation | The Samsung page itself | **Codex mostly right**, weaker than stated. `samsungfood.com/food-plus/` returned **HTTP 403** to me; corroborated only via third parties |
| **D5** | Killing a gap on vendor marketing copy | Treated vendor pages as sufficient to kill | A feature page proves a claim was made. I went and got user-side evidence Codex didn't | App-store/forum reports on whether Food List actually holds usable expiry data | **Partial.** Found real weaknesses (no quantity field; manual-only entry) but **no** user evidence that Use It Up is broken. Not a full caught error |
| **D6** | SAFE vs BOLD | "Choose SAFE unless early user evidence supports BOLD" | SAFE-as-specified is *both* dull *and* riskier than Codex thinks. Explanations are known to raise acceptance **regardless of correctness** | Bansal et al., CHI 2021 | **Codex's own named risk ("decorative explanations") is an empirically documented default outcome.** Keep SAFE's scope, change its metric |
| **D7** | Measurable claim "4 of 5 users can explain why the top recipe ranked first" | Defensible kill signal | Unfalsifiable theatre. It measures comprehension of a UI, not decision quality, and n=5 cannot support a pass/fail threshold | Nielsen's own guidance; Faulkner 2003 variance data | **Indefensible as stated.** Nielsen: quantitative metrics need **20** users. Replacement proposed below |
| **D8** | Prompt 11 "least useful because biographies were unavailable" | Property of the prompt | Property of the **run**. Codex declined the one available evidence source, then blamed the prompt | Whether the question was answerable by other means | **Property of the run.** Prompt 11 produced the single most decision-relevant finding in my run |
| **D9** | P1a defect (a): cross-user IDOR on shopping-item update / purchased transfer | Adopted uncritically; becomes Mission C and a hard M1 deliverable | **Likely a false positive at system level.** `shopping_list_items` has no `user_id` column; RLS enforces ownership via parent list; route uses the anon key + session cookie | A two-user runtime test against a migrated DB | **Highest-value disagreement.** The "fix" the failing test demands would query a non-existent column |
| **D10** | P1a suite methodology | Treated the 7 + 11 failures as equivalent findings | The "security tests" are **source-text greps** (`expect(route).toContain('.eq("user_id", user.id)')`), not executed attacks. Neither P1a nor Codex says so | Read the test file | **Confirmed.** Materially inflates the credibility of the failure count |
| **D11** | M1 "~35 h, REALISTIC" | Realistic | Wrong in both directions. Several items are one-line schema constraints; one item may need no fix at all; and the team has never changed a production file here | Time-box a spike | **Disputed.** Re-scope proposed below |
| **D12** | FTC Health Breach Notification Rule as MUST | MUST-read | Demote to SHOULD for a non-deployed course project. WCAG/ASVS earn MUST; HBNR is a deployment-conditional | FTC's own scoping language | **Minor.** FTC says amendments "underscores the Rule's application to most health apps" — real, but conditional on real users |

---

## 1. The disagreements, with the evidence

### D1 / D2 — Git history (the one Codex threw away)

**Codex's position.** Its D5 caught-error ledger says: *"Git contributors reveal team skills → Repository inspection → REJECT; require real biographies."*

**My position.** Codex confused two different questions. "Who owns skill X?" is badly answered by git. "What has this team demonstrated in this codebase?" is *well* answered by git, and that second question is the one the milestone plan actually depends on.

There is a validated method for exactly this. Mockus & Herbsleb's *Expertise Browser* (ICSE 2002) builds expertise measures from version-control deltas and states its own epistemic limit plainly — the paper argues that experience atoms *"provide a reasonable, although not infallible, way of measuring expertise"* and *"presents evidence to validate this quantification as a measure of expertise."* The paper also records that developers were already doing this informally: *"developers often used change history to identify who had experience with a particular file."* Codex rejected an approach the literature validates, and rejected it without doing it.

**So I did it.** Repo at the repository:

| Measure | Value |
|---|---|
| Total commits now / at fork | 530 / 467 → **63 commits are ours** |
| Files touched since 2026-08-01, by type | 81 `.md`, 18 `.txt`, 6 `.py`, 4 `.ts`, 3 `.sh` |
| **Production source files touched by our team** | **0** |
| Code files touched | 7, **all under `web/tests/p1a/` or `backend/tests/sihao/p1a/`** |
| Test LOC added / deleted | **+860 / −1** |
| Authors of *every* `.ts` and `.py` test file | **Sihao Liu (one person)** |
| Production TS/TSX/PY files in repo (excl. tests, node_modules) | **9,232** |
| Per-member output | Sihao: 48 md + code; Wenbo: 22 md only; Andy: 6 md only; Jeffery: 5 md + 3 sh; Amihua: merges only |

Command used: `git log --since=2026-08-01 --name-only --format=''`, cross-checked with `--numstat`.

**Why this matters more than a biography.** Codex rated M1 (35 h of production fixes) and M2 (45 h, "one typed receipt endpoint and UI") as REALISTIC. Both require the team's **first ever** production-code change in a 9,232-file inherited codebase, and today all demonstrated code capability sits in **one** of four people. A biography saying "I know React" would not have told you that. The git log does. This is an actionable finding: the plan needs a week-1 warm-up commit per person against production code, or M2 is single-point-of-failure work.

**Fact vs inference.** The counts are fact. "Only one member can currently ship production code" is *inference* — the other three may be strong engineers who happened to draw the documentation tasks. That is precisely why the right verdict on prompt 11 is "run it **and** get biographies", not "reject it".

**D2 specifically:** Codex §11's sentence *"Repository evidence demonstrates collective TypeScript/Next.js, Python/FastAPI, Supabase, Jest/Pytest, and AI integration work"* is true of `SN-F-QR` (120 commits), `seojinseojin` (62), `Joe Zhou` (57) and the rest of the 2025 upstream team. It is not true of us. Codex both rejected git evidence and leaned on it, in the same document, and got it backwards.

---

### D3 / D4 / D5 — Is the expiry gap actually dead?

Codex killed the project's founding hypothesis on two pillars. **One holds. One does not.**

**Pillar 2 collapses.** Eat This Much's own knowledge base says the pantry *"tracks what foods you already have on hand and how much you should have left based on your meal plans"*, that *"the meal planner will prioritize using any leftovers you have on hand to reduce food waste"*, and that items are removed *"after you're supposed to have eaten them."* There is no expiry-date field and no shelf-life prioritisation on that page. **Pantry-prioritised ≠ expiry-prioritised.** Codex used a leftovers-and-consumption-schedule feature as evidence against an expiry-date feature. That is a caught error, and it is Codex's, not ours.

**Pillar 1 largely holds.** Samsung Food does claim expiry prioritisation: search results consistently describe a *"Use It Up"* search mode that prioritises soon-to-expire Food List items. Two caveats Codex should have stated:
- Codex's cited URL, `https://samsungfood.com/food-plus/`, returns **HTTP 403** to my fetcher, as does every `support.samsungfood.com` article. I could not independently read Codex's primary source. I am not alleging fabrication — the claim is corroborated elsewhere — but "verified with a live page" is stronger than what I can reproduce today.
- It is a **recipe search mode**, not automatic expiry-driven *plan generation*. Samsung's own US product page contains no text about Food List, expiry, or use-by dates at all.

**Did I catch Codex killing the gap on marketing copy?** Partly, and I will not overstate it. I went looking for users saying Food List prioritisation is broken. What I actually found:
- A pantry-app survey: *"The site describes a food list you keep by hand and does not advertise barcode or receipt scanning, so the pantry stays accurate only as long as you keep typing into it."*
- App-store-derived reporting that Samsung Food *"has a 'Food List' to track pantry items, but it doesn't let you add quantities."*
- A competitor review: *"I didn't find a way to track leftovers, frozen meals, or batch-cooked recipes"* and *"The suggested meal plans didn't reflect my dietary preferences."*
- Samsung Community reports of Family Hub food lists with expiration dates disappearing (403 to me; search-snippet only — **treat as unverified**).

**Honest verdict:** I found no user evidence that Use It Up is broken. I found substantial evidence that its **input** is fragile. So the corrected finding is not "the gap is alive" — it is **"the gap moved."** The unsolved problem is not ranking by expiry; it is *knowing what is in the fridge and when it dies*. See §3.

**Both reviews should log:** the two sources with commercial incentive against Samsung (MealThinker, Plan to Eat) were the most quotable and the least trustworthy. MealThinker sells a competing planner. Weight accordingly.

---

### D6 / D7 — SAFE is not safe, and the metric is the reason

**Codex's SAFE future** is a recommendation receipt, with kill signal *"Abandon if 4/5 users cannot explain the top ranking."* Codex names the risk as "Decorative explanations." It then picks a metric that **cannot detect that risk**.

This is not a hunch. Bansal et al., CHI 2021 (verbatim from the paper's abstract): *"explanations increased the chance that humans will accept the AI's recommendation, regardless of its correctness."* And: *"While we observed complementary improvements from AI augmentation, they were not increased by explanations."*

Read that against Codex's design. A receipt that makes users confidently accept a *wrong* ranking scores **5/5 on Codex's metric** and passes the kill gate. The metric rewards the failure mode. That is not a safe future; it is a future whose only defence mechanism is disabled.

**On the statistics.** Nielsen's own article — the canonical defence of 5-user testing — is about *discovering usability problems*, and its companion guidance states plainly: *"Quantitative Studies (usability metrics): Test **20** Users."* Faulkner (2003, *Behavior Research Methods*), sampling from 60 real participants, found that *some random sets of 5 found 99% of problems; other sets found only 55%* (figure from search summary; I did not fetch the paywalled full text — treat the exact numbers as second-hand, the direction as solid). A 4-of-5 threshold sits inside that noise band. It is a coin flip wearing a lab coat.

**What I would put in the mission statement instead** — same budget, falsifiable, and it tests the thing that matters:

> Seed each participant's pantry with **three planted errors** (one wrong quantity, one wrong expiry date, one item already consumed). Run 10 participants, within-subject, receipt vs. no receipt, order counterbalanced. **Claim: with the receipt, participants detect and correct ≥ 60% of planted errors, versus ≤ 20% without it, and the median time-to-first-correction is under 45 seconds.**

Why this is better: it is behavioural not self-report; it has a control condition, which Codex's design lacks entirely; it measures *appropriate reliance* rather than comprehension, so it can actually fail; 10 participants × 15 min is ~4 hours of sessions, well inside budget; and it directly probes the Bansal failure mode. It also has a real kill signal: if the receipt does not change correction rate, the receipt is decoration and you say so in the report — which is a **good** result, not a dull one.

**On "is SAFE too safe to score well?"** Yes, as written. Codex's M2 deliverable is "one typed receipt endpoint and UI" — a JSON schema and a disclosure panel. Rendering the reasons your own code already computed is table stakes engineering, not a claim. The *claim* is the experiment above. Same code, same hours; the difference is whether you ship a feature or ship a finding. Recommend: **SAFE scope, BOLD-grade evaluation.**

**On BOLD, a defect Codex did not flag.** Codex's BOLD compares outcomes against *"a self-reported baseline."* Self-reported food waste is documented to be badly biased: a validation study found *"the questionnaire accounting for only 61% of the food waste recorded in the waste collection through kitchen caddies"* (639 g/week by questionnaire vs 1,042 g by caddy), and cites prior work showing *"a tenfold discrepancy between a survey measure based on perceived average food waste per week and extrapolations from waste composition analysis."* Codex flagged self-report **burden**; it did not flag self-report **bias**. A before/after against a self-reported baseline is not a weak measurement — it is a measurement whose error is larger than any effect a one-week pilot could produce. BOLD is worse than Codex said, for a reason Codex missed.

---

### D9 / D10 — The IDOR may not exist, and Codex built a mission on it

This is the finding I would put first in any handover.

P1a defect (a) — *"shopping-item update and 'purchased' transfer are scoped by item ID only, with no authenticated-ownership check"* — became Codex's Mission C (*"No cross-user item mutation may succeed in the two-user fixture"*) and a headline M1 deliverable. I went and read the code and the schema.

**What the failing test actually asserts** (`web/tests/p1a/security-attack-cases.test.ts`):
```js
const shoppingUpdate = between(post, "// Mark shopping item as checked", "transferredItems.push");
expect(shoppingUpdate).toContain('.eq("user_id", user.id)');
```
It is a **string search over source text**. It executes no request, authenticates no user, and touches no database.

**What the system actually does:**
1. `supabase/migrations/20251129020000_shopping_list_items.sql` — the table has columns `id, shopping_list_id, ingredient_id, item_name, quantity, unit, category, is_checked, position, notes, created_at`. **There is no `user_id` column.**
2. The same migration enables RLS and defines UPDATE policy `"Users can update items in own shopping lists"` with both `USING` and `WITH CHECK` on `EXISTS (SELECT 1 FROM public.shopping_lists sl WHERE sl.id = shopping_list_id AND sl.user_id = auth.uid())`. Ownership is enforced **through the parent list**.
3. `web/src/app/api/inventory/transfer/route.ts` imports `createClient` from `@/utils/supabase/server`, which is `createServerClient(NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, {cookies})` — **anon key + user session**, so RLS applies. It calls `supabase.auth.getUser()` at both `POST` and `DELETE`.
4. `SUPABASE_SERVICE_ROLE_KEY` appears in exactly **one** file, `web/src/lib/supabaseServer.ts`, which the transfer route does **not** import.

**Consequence.** The remediation the failing test demands — adding `.eq("user_id", user.id)` to a `shopping_list_items` update — would filter on a column that does not exist and produce a Postgres error. Making the test green would break the feature. Meanwhile the actual cross-user attack is very likely already refused by the database.

**What I have not proven.** I did not run a two-user request against a migrated instance. RLS protects only if the migrations were applied — and P1a itself documented that thirteen migrations are undocumented and one needed patching, so "applied correctly" is not free. So: **hypothesis, strongly supported by code and schema reading — the IDOR is a false positive; the honest next step is an 8-hour two-user runtime fixture that settles it either way.** That fixture is worth building regardless, because it is the test P1a should have written.

**Where the real service-role exposure is.** `supabaseServer` (RLS-bypassing) is imported by `api/achievements/route.ts`, `api/achievements/check/route.ts`, `api/recommendations/route.ts`, `api/users/route.ts`, and `lib/pushNotifications.ts`. I checked the one Codex's list touches: `achievements/check` **does** authenticate (returns 401, derives `authUserId` from the session, and inserts with `user_id: authUserId`, not a body-supplied id). So that one is defensible. `api/recommendations/route.ts` queries via `supabaseServer` with no visible auth — **unknown**, worth one hour. Neither Codex nor P1a noticed that the service-role/RLS-bypass boundary is the security question in this codebase, and that it sits somewhere other than where the failing test points.

**D10 generalised:** of the 18 adversarial failures both of us have been quoting, the web ones are entirely source-grep assertions. The backend ones are genuinely better — `InventoryItem(ingredient_id=1, name="Egg", quantity=float("inf"))` → `DID NOT RAISE ValidationError` is a real executed defect. The report should grade its own evidence: **7 executed backend failures ≫ 10 static web assertions.**

---

### D11 — Re-scoping M1

Given D9/D10, Codex's flat "~35 h, REALISTIC" is not a reality check, it is a placeholder. My split:

| Item | Codex | Mine | Why |
|---|---|---|---|
| Pydantic bounds: goal/preference ≤ 4096, name ≤ 512, quantity finite & > 0 | in the 35 h | **~6 h** | Executed failures; each is a field constraint. Cheapest real security win in the project |
| `Boolean("false")`, `quantity \|\| 1`, storage-location cast | in the 35 h | **~5 h** | Genuine type-coercion bugs, trivially fixed and trivially tested |
| Prompt-injection boundary (untrusted-data delimiting) | in the 35 h | **~8 h** | The one architectural fix here. Backend test `test_attack_prompt_delimits_untrusted_preferences_from_instructions` fails for real |
| Cross-user IDOR "fix" | in the 35 h | **~0 h fix, 8 h test** | Build the two-user runtime fixture first. If RLS holds, the deliverable is the *proof*, not a patch |
| Freed capacity | — | **~8 h** | Goes to the planted-error experiment in D7 |

---

## 2. Where I agree — and which of it I actually verified

I re-derived these rather than accepting them.

| Codex conclusion | How I verified it | Result |
|---|---|---|
| P1a's auditable numbers (Web 31/32, Backend 18/18) | Read the raw logs directly: `2026-08-29-web-p1a-rerun-raw.txt` ends `Tests: 1 failed, 31 passed, 32 total`; backend rerun ends `18 passed, 1 warning in 0.11s` | **Verified.** Also verified the adversarial arithmetic: web 12 sec tests → `10 failed, 2 passed`, so 32+12=44, 31+2=33 pass, 1+10=11 fail ✓; backend `7 failed` → 18+7=25, 18 pass, 7 fail ✓ |
| Don't cite the inherited "1,130+ tests" boast | The files named `…-p1a-raw.txt` contain `npm: command not found` (exit 127) and `No module named pytest` — the *first* attempt failed and only the rerun succeeded | **Agree, and it generalises.** Even our own evidence directory needs reading to the bottom before citing |
| Statistically valid waste-reduction proof = FANTASY | Found the strongest instance: a crossover pilot of food-waste apps reported *"mean change 0.81, SD 1.5 kg; P=.13"* — **n = 6 students, two months** | **Agree, with more force than Codex had.** A funded published trial with twice our duration could not reach significance |
| Refusing to pad the rival list to ten | Independent judgment | **Agree, strongly.** This is the single most professional call in Codex's report and should be defended in the poster, not apologised for |
| OWASP ASVS 5.0 as a MUST-read | Fetched the OWASP project page: *"[30 May 2025] ASVS Version 5.0.0 is released LIVE at Global AppSec EU Barcelona 2025!"* | **Verified.** The version number is real, not hallucinated |
| Prompt-injection is a live surface (OWASP LLM01) | The backend prompt-delimiting test genuinely fails at runtime; goals are interpolated into the Gemini prompt | **Verified and agree.** This is the most defensible security item in the whole plan |
| Mission A/B/C should not promise clinical or medical claims | Independent judgment | **Agree** |
| Recipe-to-list and cross-platform are incumbent table stakes (P13–P20 follow-up) | Consistent with everything I saw on rival pages | **Agree** |

**The agreement that matters most:** Codex's instinct to demand live URLs and to write "unknown" is correct, and its report is more honest than most. My disagreements are about what it did with the evidence *after* collecting it — twice, it let a source-shaped object stand in for a checked claim (ETM's pantry page; P1a's grep-test).

---

## 3. What we both probably missed, because we are two LLMs reading web pages about a domain that lives in kitchens

**The binding constraint is inventory decay, and neither of us built a plan around it.**

Every one of Epicourier's twenty use cases that differentiates it — inventory match percentage, expiry colour-coding, low-stock thresholds, expiry-prioritised AI suggestions, shopping-list-to-pantry transfer — is **downstream of an inventory record that is true**. Both of us spent our analysis on what happens *after* that record exists: how to rank it (Codex), how to explain the ranking (Codex), how to secure it (both). Neither of us asked whether the record survives contact with a real kitchen.

The people who actually used these apps told us, and we both read past it:

- Trial participants, in their own words: *"too many manual operations in the apps to induce permanent use"* and *"It did not give me any good overview. I think it took too much time to register (manually) in the app-fridge."*
- A pantry-app survey: *"You scan every barcode, type what has no barcode, open the app when you get home, and remember to subtract the chicken after you cook it"*, and *"manual tracking decays, fast, even for people who signed up specifically to do it."*
- And the sentence that should be on our poster: *"A pantry list you cannot trust is worse than none at all, because now you are shopping against a fiction and checking the shelf anyway."*

This is not a gap you find in a feature matrix, because **no vendor advertises the rate at which its users stop updating the pantry.** It is invisible to the exact method both of us used. Two LLMs comparing marketing pages will converge on "the rivals have expiry prioritisation, so the gap is dead" — while the actual lived failure is that nobody's Food List is accurate by week three, which is why Samsung shipped photo-based ingredient capture and why "it doesn't let you add quantities" is a top complaint.

**Codex came within one step of this and turned away.** Its complaint table ranks *"Pantry maintenance is tedious"* as theme #2 and names the opportunity as a *"Low-friction confirm/correct workflow."* Then all three of its futures — SAFE, BOLD, WILD — **assume an accurate pantry** and none of them addresses ingest. Its own #2 finding contradicts its own recommendation, and it did not notice. I nearly made the same mistake by arguing about the receipt's metric instead of the receipt's inputs.

**Why this is good news for the project.** Epicourier *already ships* the single best low-friction ingest mechanism available without OCR: the **"purchased" transfer flow that moves checked shopping-list items into inventory**. That is the moment when a user is already in the app, already touching each item, and already knows what they bought. Codex classified it as *"Possible differentiator, not unique"* and moved on. It is not a differentiator — it is the **load-bearing wall**. And it is the flow with the alleged IDOR, the `quantity || 1` bug, the `Boolean("false")` bug, and the unvalidated storage location. In other words: the highest-leverage surface in the product is also the buggiest, and both of us classified it as a table-stakes checkbox.

**Two measurements no rival publishes and we could take this month:**
1. **Staleness.** For each pilot user, at the end of week 1, ask them to walk to the fridge and compare it to the app. Report *percent of inventory rows that are wrong* and *median age of last edit*. This is 20 minutes per user and it is a number nobody in this market has published.
2. **Ingest yield.** What fraction of items entering the pantry arrive via the transfer flow versus manual typing — and does raising that fraction reduce staleness?

That reframes the mission without leaving budget: **not "explain the ranking" but "keep the pantry true enough that the ranking means anything, and show the user when it isn't."** Note that this *keeps* Codex's receipt — the receipt is the natural place to surface "we ranked this using 3 items you last touched 11 days ago, and 1 with no date." Same artefact, honest claim, and a measurement that can fail.

**One more kitchen fact, from reading our own product spec rather than the web.** Epicourier's AI suggestions *"prioritise ingredients that are expiring **or already expired**."* Recommending that a user cook already-expired food is a food-safety exposure no rival would ship, and it is a safety question, not a ranking question. Codex's eleven-row stakeholder table covers allergens, accessibility, regulators and clinicians — and contains no row for this. It should be a hard product rule (never rank an expired item into a plan; surface it only in a "discard or check" lane), a test, and a line in the report.

---

## Sources

Fetched and quoted directly in this session:
- [NN/g — Why You Only Need to Test with 5 Users](https://www.nngroup.com/articles/why-you-only-need-to-test-with-5-users/)
- [Mockus & Herbsleb — Expertise Browser (ICSE 2002, PDF)](https://herbsleb.org/web-pubs/pdfs/mockus-expertise-2002.pdf)
- [Bansal et al. — Does the Whole Exceed its Parts? (CHI 2021, PDF)](https://idl.cs.washington.edu/files/2021-AIExplanationsTeamPerformance-CHI.pdf)
- [Eat This Much — How does the pantry list work?](https://help.eatthismuch.com/knowledge_base/topics/how-does-the-pantry-system-work)
- [Samsung US — Samsung Food product page](https://www.samsung.com/us/home-appliances/samsung-food/)
- [Plan to Eat — Samsung Food Review: Pros and Cons](https://www.plantoeat.com/blog/2026/01/samsung-food-review-pros-and-cons/) *(competitor-published)*
- [MealThinker — Samsung Food App 2026](https://mealthinker.com/blog/samsung-food-alternative) *(competitor-published)*
- [PantryPersona — Best Pantry Inventory Apps 2026](https://www.pantrypersona.com/blog/best-pantry-inventory-apps-2026)
- [JMIR Formative Res. — Smartphone apps to reduce food waste, crossover pilot (PMC9482070)](https://pmc.ncbi.nlm.nih.gov/articles/PMC9482070/)
- [A validated survey to measure household food waste (PMC6889683)](https://pmc.ncbi.nlm.nih.gov/articles/PMC6889683/)
- [RCT of a household food waste reduction intervention (PMC9361971)](https://pmc.ncbi.nlm.nih.gov/articles/PMC9361971/)
- [OWASP ASVS project page](https://owasp.github.io/www-project-application-security-verification-standard)
- [FTC — Health Breach Notification Rule: The Basics for Business](https://www.ftc.gov/business-guidance/resources/health-breach-notification-rule-basics-business)

Search-snippet only, **not independently fetched** — treat as weaker: Faulkner 2003 sample-size figures ([Springer](https://link.springer.com/article/10.3758/BF03195514)); Samsung Food "Use It Up" prioritisation; Samsung Community expiry-list reports.

Returned **HTTP 403** to me, so Codex's primary Samsung sources are **unverified on my run**: `https://samsungfood.com/food-plus/`, all `support.samsungfood.com` articles, `us.community.samsung.com`.

Local evidence: `p1a/evidence/own-tests/*-rerun-raw.txt`, `*-security-raw.txt`, `web/tests/p1a/security-attack-cases.test.ts`, `web/src/app/api/inventory/transfer/route.ts`, `web/src/utils/supabase/server.ts`, `web/src/lib/supabaseServer.ts`, `supabase/migrations/20251129020000_shopping_list_items.sql`, and `git log` on the repo at `the repository root`.