# audit:engineering-and-disagreement

**Workflow:** P1b Claude self-audit (run 6)  
**Phase:** Read  
**Model:** Claude Opus 5 (1M context), `claude-opus-5[1m]`  
**Agent id:** `ad55aa877ffcfde44`  
**Tool calls:** 41 total — 0 web searches, 0 pages fetched  
**Raw transcript:** `raw/agent-ad55aa877ffcfde44.jsonl` (full tool-call trace, retained)

---

## Prompt, exactly as issued

```text
YOU ARE AUDITING OUR OWN WORK, and you are looking for BAD ARGUMENTS, not bad facts.

The facts have already been checked mechanically and they passed: 149 file:line references
resolve, no line number runs past the end of its file, and the git claims were verified against
the repository. Do NOT spend your time re-checking those.

Hunt for these instead:

1. **Conclusions that do not follow from their evidence.** A number quoted, then a claim made that
   the number does not support.
2. **Confident assertions resting on a weak source.** This is the failure mode that has already
   burned us once: a rival's App Store screenshot looked like proof and turned out to be a Sketch
   mockup with "9:41 AM" in the status bar. Find the equivalents — where does this document treat
   a claim as settled when the underlying artifact only shows that someone asserted it?
3. **Estimates presented as measurements.** Hour figures, percentages and rates that were invented
   by a language model and are now being quoted as if derived. Say which ones have a stated basis
   and which are vibes with a decimal point.
4. **Internal contradictions** within the file.
5. **Staleness** against the ESTABLISHED list below.
6. **Things a marker would challenge first**, and whether the document already has an answer.
7. **Load-bearing recommendations nobody could act on** — advice too vague to execute, or that
   assumes a capability the team has not demonstrated.

Be specific: quote the sentence, give the heading it sits under, and say what is wrong in one
sentence. Rank by how much damage it would do if a marker found it before we did.

If a file is sound, say so and name the two strongest things in it. A clean audit is a real
result — but an audit that finds nothing in ten thousand words of model-generated prose is
usually an audit that did not read.

WHAT LATER RUNS ESTABLISHED. Anything in these files that contradicts the following is stale and
you should flag it:

- G2 (nothing measures waste outcomes) and G4 (nothing links a calorie target to groceries) are
  DEAD. Five shipping products measure outcomes; Eat This Much / Prospre / Cooklist cover G4.
- G1 has been narrowed TWICE. RecipeFix ships substitution reasoning ("No black-box AI"). Cooklist
  ships expiry reminders naming the item — CONFIRMED SHIPPING by real user reviews, though the
  famous "your parsley is 7 days old" artifact is a Sketch MOCKUP and every real Cooklist surface
  states an AGE plus a traffic light, not a date. Mealie renders "Substituting: {substitute} for
  {food}" in public shipped source. Remy prints "Using up before they expire: <item> · <qty>".
  Grocy publishes a due-score formula but shows a bare integer and does not even sort by it.
  WHAT SURVIVES is only the four-way conjunction: named item + actual expiry date + nutrient
  constraint + reason for the substitution, in one auditable correctable object.
- THE GAP HAS NO DEMAND-SIDE EVIDENCE. A sweep of 851 Reddit entries for eleven explainability
  phrasings returned ZERO hits in any meal/pantry/recipe context. We cannot claim anyone wants it.
- Samsung Food+ is now first-party via a Wayback capture: $6.99/mo or $59.99/yr, and every Food+
  feature that matters is "Exclusively on mobile app" — our product is a WEB app.
- Our headline P1a cross-user IDOR is probably a FALSE POSITIVE at system level
  (shopping_list_items has no user_id column; RLS enforces ownership via the parent list).
  The real defect under UC20 is that the transfer route never inspects affected row counts, so it
  reports success for writes that did not happen. The genuinely unmitigated hole is the share
  route, whose table shopping_list_shares has NO migration, NO RLS and NO policy in the repo.
- Most P1a "security tests" are source-text greps, not executed attacks.
- user_inventory upserts by (user_id, ingredient_id, location) and SUMS quantities: there are NO
  per-purchase lots. Any promise about "lots" is not representable.
- BUDGET: four graduate students, ~160 person-hours TOTAL, which must also cover report, poster
  and demo. The milestone file totals the NOW plan at 94.75 h against ~100 h of feature capacity;
  the cut list puts the irreducible core at 54.00 h.

YOUR ASSIGNMENT: audit these files, in full, from the repository:
  p1b/result/claude/03-engineering-evidence.md
  p1b/result/claude/06-disagreement-with-codex.md

Read them with Bash (cat / sed -n). They are long; read all of them, not the first screen.

Specific to your assignment: These two carry our engineering credibility. 03 is the repository audit that our D3 rests on; 06 is the cross-model disagreement register that our D5 rests on. In 06 especially, check whether each "Status after my check" is actually supported by a check that was performed, or whether some are assertions dressed as verdicts.

You may check things in the repository itself (Bash: grep, sed, cat) where a document's argument
depends on the code. Do not do web research; that has been done to death and is not where the
remaining risk is.
```

## Response

- **files audited:**
  - /Users/andy/Library/Mobile Documents/com~apple~CloudDocs/Work/1151/CSC510/Epicourier-Web/p1b/result/claude/03-engineering-evidence.md
  - /Users/andy/Library/Mobile Documents/com~apple~CloudDocs/Work/1151/CSC510/Epicourier-Web/p1b/result/claude/06-disagreement-with-codex.md
- **findings:**
  - _item 1_
    - **file:** p1b/result/claude/06-disagreement-with-codex.md
    - **heading:** DISAGREEMENT REGISTER — D10 / §D9-D10 'The IDOR may not exist'
    - **quoted sentence:** The "security tests" are **source-text greps** (`expect(route).toContain('.eq("user_id", user.id)')`), not executed attacks. Neither P1a nor Codex says so.
    - **what is wrong:** P1a says so, in the first paragraph of `p1a/evidence/own-tests/ATTACK-RESULTS.md` — "Web tests are executable source-level security contracts: a failure proves the required guard is absent from the inspected operation, but does not by itself prove exploitation... Backend tests instantiate the actual Pydantic request models and prompt builder, so their accepted inputs are directly confirmed behavior" — and again in `p1a/traceability/final-traceability.md:12` ("`Static contract` ... does not execute the route"), so our flagship methodological reversal accuses our own artifact of a concealment it did not commit, and 03's lede repeats the same charge ("reporting eleven failures without saying so inflates them") while listing ATTACK-RESULTS.md in its own Files-referenced block.
    - **category:** DOES_NOT_FOLLOW
    - **severity:** HIGH
    - **suggested fix:** Rewrite D10 to: "P1a disclosed the static/runtime split in ATTACK-RESULTS.md ¶1 and final-traceability.md ¶4; Codex then quoted the failure counts without carrying that caveat forward, and so did our own summary tables." That is still a real finding against Codex and against our summaries, and it survives a marker opening the file.
  - _item 2_
    - **file:** p1b/result/claude/03-engineering-evidence.md
    - **heading:** 4. The three defects that MUST be fixed before any new feature ships
    - **quoted sentence:** **Deliberately not on this list:** D10 (achievement trigger) — service-role write of unvalidated input is a pattern worth fixing, but `user_id` is server-derived, so a user can only pollute their own row; it is a cleanup, not a blocker.
    - **what is wrong:** The blocker list and its explicit exclusions omit `GET /api/users` (`web/src/app/api/users/route.ts:8-16`), which uses the RLS-bypassing service-role client with no `auth.getUser` and returns `id, fullname, email` for every user — a later run (`p1b/evidence/claude/runs/p08-mission.md:153`, F5) calls it "worse than the share route" and "the only finding in our whole audit that is a genuine executed attack rather than a source grep", and it has zero callers, so it is a five-minute deletion that 03 never mentions.
    - **category:** STALE
    - **severity:** HIGH
    - **suggested fix:** Add it as Blocker 0 at ~0.25 h (`rm web/src/app/api/users/route.ts`, zero callers), and rewrite D10's exclusion note to read "the achievements service-role write is a cleanup; the service-role *read* at /api/users is not" — this also repairs the grep-only methodology complaint, because this one is executable with curl.
  - _item 3_
    - **file:** p1b/result/claude/06-disagreement-with-codex.md
    - **heading:** 1. The disagreements, with the evidence — D1 / D2, table row 'Production TS/TSX/PY files in repo (excl. tests, node_modules)'
    - **quoted sentence:** Both require the team's **first ever** production-code change in a 9,232-file inherited codebase, and today all demonstrated code capability sits in **one** of four people.
    - **what is wrong:** 9,232 is overwhelmingly `backend/.venv` — a local, untracked Python virtualenv contributing 9,075 of those files; git tracks 192 non-test `.ts/.tsx/.py` files and `web/src` holds 164, so the figure is wrong by roughly 50× and the rhetorical weight it carries ("a 9,232-file inherited codebase", used twice) evaporates when a marker runs `git ls-files`.
    - **category:** ESTIMATE_AS_MEASUREMENT
    - **severity:** HIGH
    - **suggested fix:** Replace with "192 tracked non-test TS/TSX/PY files, 164 of them in `web/src`" and state the command (`git ls-files '*.ts' '*.tsx' '*.py' | grep -vi test | wc -l`). The single-point-of-failure argument is actually *stronger* against a 192-file codebase, because it removes the 'nobody could learn that' escape hatch. While editing, fix the same table's '530 / 467 → 63' (repo now reports 531 / 64) and '7 code files, **all** under `web/tests/p1a/` or `backend/tests/sihao/p1a/`' — two of them are `p1a/scripts/run_local_model.py` and `run_step7.py`.
  - _item 4_
    - **file:** p1b/result/claude/06-disagreement-with-codex.md
    - **heading:** 1. The disagreements, with the evidence — D1 / D2 ("D2 specifically")
    - **quoted sentence:** Codex both rejected git evidence and leaned on it, in the same document, and got it backwards.
    - **what is wrong:** The contradiction is manufactured by truncating Codex's sentence at the comma: `p1b/result/codex/README.md:162` reads in full "...Jest/Pytest, and AI integration work, **but not which current member owns each skill**", which is precisely the demonstration-vs-ownership distinction D1 accuses Codex of confusing, and Codex's ledger row logs its Check as "Repository inspection", contradicting D1's "rejected it without doing it".
    - **category:** WEAK_SOURCE_TREATED_AS_SETTLED
    - **severity:** HIGH
    - **suggested fix:** Quote Codex's sentence whole, drop the self-contradiction charge, and narrow D2 to what survives: Codex attributed the demonstrated stack to "the team" without separating 467 upstream commits from our 64, and its 'Repository inspection' check plainly did not include a `--since` cut. That is a real, defensible caught error; the current version dies the moment a marker opens codex/README.md:162.
  - _item 5_
    - **file:** p1b/result/claude/03-engineering-evidence.md
    - **heading:** 2. Evidence boast (poster paragraph) — strongest TRUE claim
    - **quoted sentence:** Every one of our 63 functions is mapped to one of UC1–UC20, and every FAIL is preserved as raw, re-runnable output.
    - **what is wrong:** The traceability file 03 cites as corroboration maps four of them to `?`, not to a UC — `p1a/traceability/final-traceability.md:17-19` and `:28` show `attack_share_creation_requires_an_authenticated_user`, `…_verifies_list_ownership`, `…_rejects_unbounded_expiry_days` and `attack_shared_list_lookup_requires_a_nonempty_token` with an explicit `?` in the UC column, and three of those four are the very defects 03 promotes to Blocker 1.
    - **category:** INTERNAL_CONTRADICTION
    - **severity:** HIGH
    - **suggested fix:** Change to "59 of our 63 functions map to a use case; the four share-route tests map to none, because P1a concluded the share flow is a missing 21st use case (final-traceability.md:91) — which is itself a finding." The honest version is more interesting than the boast.
  - _item 6_
    - **file:** p1b/result/claude/03-engineering-evidence.md
    - **heading:** 2. Evidence boast (poster paragraph) — strongest TRUE claim
    - **quoted sentence:** **We wrote 63 test functions that executed 69 assertions across two runtimes, and they found 18 defects that the project's inherited 1,096-case suite did not.**
    - **what is wrong:** Three defects in one sentence: 69 is a count of test-case *executions* (the document's own derivation paragraph says "69 executions", and Jest's "44 total" counts cases, not assertions); §3's own Totals line says "18 recorded FAILs → **17 distinct source defects**" with the eighteenth (D11) found by this audit and not by any test; and the paragraph labelled the poster text omits the grep caveat that 03's own lede declares mandatory.
    - **category:** INTERNAL_CONTRADICTION
    - **severity:** HIGH
    - **suggested fix:** Rewrite as: "63 test functions, 69 executed test cases across two runtimes, recording 18 failures that resolve to 17 distinct defects — 7 of them executed model-level attacks, 10 of them source-level contract assertions — against an inherited web suite that reported 1,095 passed / 1 skipped and surfaced none of them." Same strength, and it survives cross-checking against §3.
  - _item 7_
    - **file:** p1b/result/claude/03-engineering-evidence.md
    - **heading:** 4. The three defects that MUST be fixed before any new feature ships — Blocker 2
    - **quoted sentence:** Nothing new should be built on transfer until it scopes by `user_id` **and** asserts the affected-row count.
    - **what is wrong:** `shopping_list_items` has no `user_id` column (`supabase/migrations/20251129020000_shopping_list_items.sql:11-23`), so the prescribed fix is the exact one that 03's own D4 row ("RLS gates UPDATE on EXISTS(...sl.user_id = auth.uid())") and 06's D9 ("would filter on a column that does not exist and produce a Postgres error") prove impossible — the report's action item re-commits the error the audit's headline reversal exists to correct.
    - **category:** INTERNAL_CONTRADICTION
    - **severity:** HIGH
    - **suggested fix:** Replace the clause with "...until it inspects the affected-row count on both the UPDATE at :93-96 and the DELETE at :152-155, and returns a partial-failure status instead of `success: true`. Ownership is already enforced by the parent-list RLS policy; there is no `user_id` to scope by, and adding one is the wrong fix."
  - _item 8_
    - **file:** p1b/result/claude/06-disagreement-with-codex.md
    - **heading:** D6 / D7 — SAFE is not safe, and the metric is the reason ("What I would put in the mission statement instead")
    - **quoted sentence:** **Claim: with the receipt, participants detect and correct ≥ 60% of planted errors, versus ≤ 20% without it, and the median time-to-first-correction is under 45 seconds.**
    - **what is wrong:** Two paragraphs after invoking Nielsen's "Quantitative Studies (usability metrics): Test **20** Users" and Faulkner's variance to declare a 4-of-5 threshold "a coin flip wearing a lab coat", the replacement proposes n=10 with three invented thresholds (60%, 20%, 45 s) and no power calculation, effect-size source, or pilot basis — the same objection kills it, and a marker will notice the document convicted itself.
    - **category:** ESTIMATE_AS_MEASUREMENT
    - **severity:** HIGH
    - **suggested fix:** Either state the thresholds as pre-registered, arbitrary decision rules ("we chose 60/20 before running; they are a decision rule, not a prediction") and add the within-subject justification for why n=10 is defensible where n=5 between-subjects was not, or drop the numbers and make the claim directional ("correction rate is higher with the receipt than without, paired, one-tailed"). Also fix "10 participants × 15 min is ~4 hours of sessions" — that is 2.5 h.
  - _item 9_
    - **file:** p1b/result/claude/03-engineering-evidence.md
    - **heading:** 4. The three defects that MUST be fixed before any new feature ships — Blocker 1
    - **quoted sentence:** This is the only surface where we have **no second line of defence and cannot prove we have one**.
    - **what is wrong:** Our own planning files reach the opposite conclusion about the same work: `12-milestones.md:9` makes "Drop milestone N5b (share-route hardening, 8.75 h)" its headline recommendation and `:83` calls its 8.75 h estimate "the least evidenced number in this document", while `14-cut-list.md:156-174` excludes Blockers 1 and 2 entirely from the 54.00 h irreducible core — so the packet tells a marker that the thing that MUST ship first is the thing we plan to cut.
    - **category:** INTERNAL_CONTRADICTION
    - **severity:** HIGH
    - **suggested fix:** Reconcile explicitly in 03: "Blocker 1 is ship-blocking for a *deployed* product; for a four-person course project it is cut to its 4 h core (write the migration + RLS policy) and the remaining auth/ownership/bounds work is reported as known-open with file and line, per 12-milestones N5b." Pick one position across all three files before the poster is written.
  - _item 10_
    - **file:** p1b/result/claude/06-disagreement-with-codex.md
    - **heading:** D11 — Re-scoping M1
    - **quoted sentence:** Given D9/D10, Codex's flat "~35 h, REALISTIC" is not a reality check, it is a placeholder.
    - **what is wrong:** The replacement column sums to exactly 35 h (6+5+8+8+8), so the re-scope disputes Codex's number and reproduces it; worse, its line items contradict 03's own per-defect estimates written the same day by the same model — the prompt-delimiting fix is 2.5 h in 03's D18 and "~8 h" here (3.2×), the Pydantic bounds are 3.25 h in 03 (D12-D17) and "~6 h" here, the coercion bugs 3.5 h in 03 (D6+D8+D9) and "~5 h" here — which demonstrates that none of these hour figures has a derivation.
    - **category:** ESTIMATE_AS_MEASUREMENT
    - **severity:** HIGH
    - **suggested fix:** Reconcile the two tables to one set of numbers, label every hour figure as a planning estimate with its basis stated ("one field constraint + one test per defect, 30 min each, measured against the D12-D14 pattern"), and change D11's verdict from "wrong in both directions" to "correct in aggregate, wrong in distribution — here is the split", which is what the table actually shows.
  - _item 11_
    - **file:** p1b/result/claude/06-disagreement-with-codex.md
    - **heading:** 3. What we both probably missed... ("The people who actually used these apps told us")
    - **quoted sentence:** And the sentence that should be on our poster: *"A pantry list you cannot trust is worse than none at all, because now you are shopping against a fiction and checking the shelf anyway."*
    - **what is wrong:** The bullet list is introduced as users speaking, but this sentence and the "manual tracking decays, fast" quote come from PantryPersona's "Best Pantry Inventory Apps 2026" listicle — SEO content marketing that 06 elsewhere calls "a pantry-app survey" — so we are nominating a blog's prose as our poster headline while the ESTABLISHED position is that an 851-entry Reddit sweep returned zero demand-side hits.
    - **category:** WEAK_SOURCE_TREATED_AS_SETTLED
    - **severity:** HIGH
    - **suggested fix:** Separate the bullets by source class: the two trial-participant quotes are from a published study and can be cited; the PantryPersona lines are a vendor-adjacent blog and must be labelled as such and dropped from the poster. If we want a poster sentence about pantry decay, it has to be our own measurement (the staleness number in §3's proposal), not a listicle.
  - _item 12_
    - **file:** p1b/result/claude/03-engineering-evidence.md
    - **heading:** 3. Prioritised defect list — Honest-scoping summary (this is the stronger result)
    - **quoted sentence:** Of the ten web findings we originally labelled "High candidate / IDOR, subject to RLS":
    - **what is wrong:** Only four of the ten web FAILs carry that label in `p1a/evidence/own-tests/ATTACK-RESULTS.md` (the two share rows and the two transfer rows); five are labelled Medium and one Low/Medium, so the "we over-claimed and then corrected ourselves" narrative inflates the original claim in order to make the correction look larger.
    - **category:** DOES_NOT_FOLLOW
    - **severity:** MEDIUM
    - **suggested fix:** Change to "Of the four web findings we labelled 'High candidate / IDOR, subject to RLS', two are mitigated at the DB layer and two cannot be adjudicated because the table is undefined; of the six we labelled Medium or Low, one (D7) was overstated and three have no DB backstop at all." The corrected sentence is accurate and loses nothing.
  - _item 13_
    - **file:** p1b/result/claude/03-engineering-evidence.md
    - **heading:** 3. Prioritised defect list — D7 row
    - **quoted sentence:** **MITIGATED at the DB layer — the ATTACK-RESULTS wording overstates this one.**
    - **what is wrong:** ATTACK-RESULTS.md's D7 row reads "Medium: invalid persisted state **or database errors**" — it already named the outcome 03 says it missed, so the charge of overstatement is itself an overstatement against our own artifact, which is exactly the error class this audit exists to catch.
    - **category:** INTERNAL_CONTRADICTION
    - **severity:** MEDIUM
    - **suggested fix:** Change to "MITIGATED at the DB layer — ATTACK-RESULTS listed both outcomes ('invalid persisted state or database errors'); the CHECK constraint settles it as the second, so report the symptom as a misleading HTTP 200 carrying a per-item error string."
  - _item 14_
    - **file:** p1b/result/claude/03-engineering-evidence.md
    - **heading:** 3. Prioritised defect list — D4 row / 4. Blocker 2
    - **quoted sentence:** `attack_transfer_verifies_each_shopping_item_belongs_to_the_user` **and** `test_uc20_rejects_transfer_of_another_users_shopping_item` (two independent tests, one defect)
    - **what is wrong:** They are not independent: `web/tests/p1a/use-case-contracts.test.ts:98-106` and `security-attack-cases.test.ts:45-53` slice the same file between the same two markers (`"// Mark shopping item as checked"` → `"transferredItems.push"`) and assert the same string `.eq("user_id", user.id)` — it is one grep run twice, so the corroboration Blocker 2 leans on is a copy-paste, and the "single FAIL in the otherwise-clean 31/32 functional rerun" is also a grep, not a functional test.
    - **category:** DOES_NOT_FOLLOW
    - **severity:** MEDIUM
    - **suggested fix:** Say so plainly: "caught twice, but by the same assertion duplicated across two suites — the duplication is a finding about our suite, not corroboration of the defect." And drop "in the functional contract suite" from Blocker 2, since that test is a static contract too.
  - _item 15_
    - **file:** p1b/result/claude/06-disagreement-with-codex.md
    - **heading:** 3. What we both probably missed — "Why this is good news for the project"
    - **quoted sentence:** Epicourier *already ships* the single best low-friction ingest mechanism available without OCR: the **"purchased" transfer flow that moves checked shopping-list items into inventory**.
    - **what is wrong:** The schema cannot carry what the thesis needs: `user_inventory` has `UNIQUE (user_id, ingredient_id, location)` and the transfer route merges with `quantity: existingItem.quantity + (item.quantity || 1)` and `expiration_date: item.expiration_date || existingItem.expiration_date` (`web/src/app/api/inventory/transfer/route.ts:64-68`), so there are no per-purchase lots and a new purchase silently overwrites the old stock's expiry date — which makes the §3 receipt line ("3 items you last touched 11 days ago, and 1 with no date") and the per-row staleness measurement unrepresentable, and "single best available" an unsourced superlative.
    - **category:** DOES_NOT_FOLLOW
    - **severity:** MEDIUM
    - **suggested fix:** Add the constraint to the argument rather than around it: "the transfer flow is the right ingest point, but the schema sums lots into one row per (user, ingredient, location) and the merge path overwrites the incumbent expiry date — so the first work item is a lots table or an explicit 'oldest date wins' rule, and no claim about per-item dates can be made until then." That is a better finding than the superlative, and it is a defect neither 03 nor P1a recorded.
  - _item 16_
    - **file:** p1b/result/claude/06-disagreement-with-codex.md
    - **heading:** 3. What we both probably missed — "One more kitchen fact"
    - **quoted sentence:** Recommending that a user cook already-expired food is a food-safety exposure no rival would ship, and it is a safety question, not a ranking question.
    - **what is wrong:** Our own `02-table-stakes-vs-differentiator.md:31` states the opposite with a re-fetched first-party quote — Grocy's Due Score "indicates which recipes are good for using up stock items that are due soon **or already overdue**" — so "no rival would ship" is false by our own evidence, and the sourcing is also mislabelled: the quoted product-spec line comes from our own prompt preamble (`p1b/evidence/claude/runs/sweep-ai-appliance.md:27`), not from a spec.
    - **category:** STALE
    - **severity:** MEDIUM
    - **suggested fix:** Rewrite as "Grocy ships exactly this (due score includes 'already overdue'), so the exposure is not unique — but Grocy is self-hosted and unbranded, and we would be a hosted consumer web app making the same recommendation. Keep the hard product rule and the test; drop 'no rival would ship'." And attribute the prioritisation behaviour to `backend/api/inventory_recommender.py:72` (`❌ EXPIRED: Already expired`), which is the real source.
  - _item 17_
    - **file:** p1b/result/claude/06-disagreement-with-codex.md
    - **heading:** DISAGREEMENT REGISTER — D4 / "Pillar 1 largely holds"
    - **quoted sentence:** `samsungfood.com/food-plus/` returned **HTTP 403** to me; corroborated only via third parties
    - **what is wrong:** Superseded: a later run obtained a first-party Wayback capture of Food+ giving $6.99/mo or $59.99/yr and marking every Food+ feature that matters "Exclusively on mobile app" — which both settles D4 in Codex's favour on first-party evidence and adds the decisive fact 06 never states, that our product is a web app and the rival feature is mobile-only.
    - **category:** STALE
    - **severity:** MEDIUM
    - **suggested fix:** Replace the 403 caveat with the Wayback capture, change the D4 status to "Codex right, on first-party evidence we later obtained", and add the platform asymmetry — it is the strongest surviving competitive point in the packet and 06 is where a marker will look for it.
  - _item 18_
    - **file:** p1b/result/claude/06-disagreement-with-codex.md
    - **heading:** D9 / D10 — "Where the real service-role exposure is"
    - **quoted sentence:** `api/recommendations/route.ts` queries via `supabaseServer` with no visible auth — **unknown**, worth one hour.
    - **what is wrong:** The file is twenty lines and reads only the public `Recipe` catalog (`id, name, description, image_url, green_score, min_prep_time`), so it was settleable in thirty seconds and carries no exposure — while the adjacent file 06 lists in the same sentence, `api/users/route.ts`, dumps every user's email over the service-role client and is left unexamined; the paragraph asserts "the service-role/RLS-bypass boundary is the security question in this codebase" after checking two of five importers and flagging the harmless one.
    - **category:** UNACTIONABLE
    - **severity:** MEDIUM
    - **suggested fix:** Check all five importers (it is ten minutes), state the result per route, and move the budget line from `recommendations` (0 h, public catalog, no exposure) to `users` (0.25 h, delete it — zero callers). Keep the thesis; it is correct, and it pays off one file over from where the paragraph stops.
  - _item 19_
    - **file:** p1b/result/claude/06-disagreement-with-codex.md
    - **heading:** 2. Where I agree — and which of it I actually verified (row: "Statistically valid waste-reduction proof = FANTASY")
    - **quoted sentence:** **Agree, with more force than Codex had.** A funded published trial with twice our duration could not reach significance
    - **what is wrong:** The cited pilot ran two months and the same document elsewhere describes our study as "a one-week pilot" — that is roughly eight times our duration, not twice, and understating the ratio weakens the very argument the row is making.
    - **category:** INTERNAL_CONTRADICTION
    - **severity:** MEDIUM
    - **suggested fix:** Change to "with roughly eight times our planned duration and a funded protocol" — and if our pilot length is not actually one week, fix the other reference instead so the two agree.
  - _item 20_
    - **file:** p1b/result/claude/03-engineering-evidence.md
    - **heading:** 1. The 20 canonical use cases (verbatim)
    - **quoted sentence:** Note that five of them differ slightly between the two (UC5, UC6, UC12) — reproduced exactly as the repo states them, not normalised.
    - **what is wrong:** Three are named and three is the correct count — checked against `p1a/use-cases/final-use-cases.md`, where only UC5, UC6 and UC12 differ between heading and `**Name**` row — so the first substantive sentence of the audit contains a counting error a marker gets for free.
    - **category:** INTERNAL_CONTRADICTION
    - **severity:** MEDIUM
    - **suggested fix:** Change "five" to "three".
  - _item 21_
    - **file:** p1b/result/claude/03-engineering-evidence.md
    - **heading:** 4. The three defects that MUST be fixed before any new feature ships — "Deliberately not on this list"
    - **quoted sentence:** D12–D18 (backend Pydantic bounds and prompt delimiting) — real, cheap to fix (≈ 6.25 h for all seven)
    - **what is wrong:** The table's own figures for those seven sum to 5.75 h (0.75 + 0.5 + 0.5 + 1.5 + 2.5), and since the 24.25 h grand total is internally consistent, this is a stray half-hour that invites a marker to re-add every column.
    - **category:** INTERNAL_CONTRADICTION
    - **severity:** LOW
    - **suggested fix:** Change "≈ 6.25 h" to "5.75 h".
  - _item 22_
    - **file:** p1b/result/claude/06-disagreement-with-codex.md
    - **heading:** D9 / D10 — "D10 generalised"
    - **quoted sentence:** of the 18 adversarial failures both of us have been quoting, the web ones are entirely source-grep assertions ... **7 executed backend failures ≫ 10 static web assertions.**
    - **what is wrong:** 18 minus 7 backend is 11 web, not 10 — the eleventh is `test_uc20_rejects_transfer_of_another_users_shopping_item` from the contract suite, which is also a grep, so the correct and stronger line is 11 static web assertions, and calling all 18 "adversarial" misdescribes that one.
    - **category:** INTERNAL_CONTRADICTION
    - **severity:** LOW
    - **suggested fix:** Change to "7 executed backend failures ≫ 11 static web assertions (10 from the security suite plus the UC20 contract test, which is a grep too)".
  - _item 23_
    - **file:** p1b/result/claude/03-engineering-evidence.md
    - **heading:** 3. Prioritised defect list — Totals
    - **quoted sentence:** **All 18 confirmed still present.** Estimated effort **≈ 24.25 engineer-hours (~3 days)** for competent fixes plus regression tests
    - **what is wrong:** The legend defines CONFIRMED as "the guard the test demanded is still absent and the defective expression is still present at the cited line" — i.e. the source text is unchanged, not that any defect is exploitable — yet D11 has no test at all and is still marked CONFIRMED, and "~3 days" silently converts hours into calendar days at one full-time engineer, against a team of four graduate students at ~10 h/week with 160 person-hours total for everything including report, poster and demo.
    - **category:** MARKER_WILL_CHALLENGE
    - **severity:** LOW
    - **suggested fix:** Change to "All 18 confirmed still present **in source** (D11 confirmed by absence from all 13 migration files, not by a test). ≈ 24.25 engineer-hours — roughly a quarter of the project's 100 h of feature capacity, not 'three days'."
- **strongest things:**
  - 03 §2 'Exact numbers and their source files' — an eleven-row table binding every quoted figure to a file and a line number, including the ones that weaken us (the forced-baseline '24 failed, 19 passed'). This is the most auditable artifact in the packet and it held up under every check I ran; protect it, and make the poster paragraph above it match it.
  - 03 §2 '⚠️ Do not use the "1,130+ tests" figure' — a self-denying ordinance with three independent corroborations of the real number (1,096) and a written replacement sentence. A document that forbids its own team from using a flattering number, and says why in three reasons, is the single most credible page here.
  - 06 D9 — the IDOR false-positive, derived from four verified steps (no `user_id` column in the migration; the RLS policy's `EXISTS` on the parent list; the transfer route's cookie-bound anon client; `SUPABASE_SERVICE_ROLE_KEY` confined to one unimported file) and ending with an explicit 'What I have not proven' paragraph that names the missing two-user runtime test. Every step reproduced against the repo.
  - 06's source grading — the Sources block splits 'fetched and quoted directly' from 'search-snippet only, treat as weaker' from 'returned HTTP 403, unverified on my run', and §3 turns the same scepticism on itself ('I nearly made the same mistake'). That discipline is exactly what stops the next Sketch-mockup incident and should be the packet's house style.
- **overall:** Neither file is sound as written, and the damage is concentrated in the two paragraphs each one exists to produce: 03's poster boast and 06's methodological reversal.
  
  The worst finding is shared by both. 06's D10 ("Neither P1a nor Codex says so") and 03's lede ("reporting eleven failures without saying so") accuse our own P1a artifact of concealing that the web security tests are source greps. P1a disclosed it twice — in the opening paragraph of ATTACK-RESULTS.md, which 03 lists in its own Files-referenced block, and in final-traceability.md's header. Our flagship reversal is aimed at the wrong target; the real target is that Codex and our own summary tables quoted the counts without carrying the caveat forward, which is a smaller but survivable finding.
  
  Second: both files miss `GET /api/users` — service-role client, no auth, returns every user's id, fullname and email, zero callers. 06 lists the file among the service-role importers, declares that boundary "the security question in this codebase", then checks the two harmless routes and budgets an hour for the twenty-line one that reads the public recipe catalog. 03's "three defects that MUST be fixed" omits it entirely. A later run (p08-mission F5) calls it "worse than the share route" and "the only genuine executed attack" in the whole audit — so the fix for 06's own methodology complaint was sitting one file from where the paragraph stopped.
  
  Third: 06's "9,232-file inherited codebase", load-bearing twice for the single-point-of-failure argument, is 9,075 files of `backend/.venv`. Git tracks 192 non-test TS/TSX/PY files. The argument gets stronger when corrected, which is the good news.
  
  On the assignment's specific question — are the "Status after my check" verdicts backed by checks? Mostly yes, and impressively so: D9 and D10 I reproduced step by step against the schema, the policy, the client construction and the test files. But three verdicts are assertions wearing verdict clothes. D2's "Confirmed error. Also self-contradictory" is manufactured by truncating Codex's sentence at a comma — the dropped half ("but not which current member owns each skill") states the exact distinction D1 accuses Codex of confusing. D1's "rejected it without doing it" is contradicted by the Codex ledger row 06 itself quotes, whose Check column reads "Repository inspection". And D10's "Confirmed" rests on the false premise above.
  
  On estimates: none of the hour figures in either file has a stated basis, and the proof is that the two documents disagree with each other by up to 3.2× on the same fix, written by the same model on the same day (D18 prompt delimiting: 2.5 h in 03, ~8 h in 06). 06's D11 calls Codex's 35 h "a placeholder" and then re-derives exactly 35 h. D7's replacement experiment dismisses a 4-of-5 threshold on Nielsen's "you need 20 users" and then proposes n=10 with invented 60%/20%/45-second thresholds — the one a marker will enjoy most.
  
  Everything here is fixable by editing prose, not by redoing work. The underlying engineering in both files is better than the sentences wrapped around it — which is why the poster paragraph and the disagreement register, the two pieces that will actually be read, are where the effort should go.
