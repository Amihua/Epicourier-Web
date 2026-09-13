# audit:team-and-milestones

**Workflow:** P1b Claude self-audit (run 6)  
**Phase:** Read  
**Model:** Claude Opus 5 (1M context), `claude-opus-5[1m]`  
**Agent id:** `a335b00906f9454f6`  
**Tool calls:** 19 total — 0 web searches, 0 pages fetched  
**Raw transcript:** `raw/agent-a335b00906f9454f6.jsonl` (full tool-call trace, retained)

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
  p1b/result/claude/10-team-fit.md
  p1b/result/claude/12-milestones.md

Read them with Bash (cat / sed -n). They are long; read all of them, not the first screen.

Specific to your assignment: 12 is a graded D3 deliverable. Check every hour estimate: which have a stated basis and which are guesses? The plan totals 94.75 h against ~100 h capacity — a 5% margin that the file itself calls the failure mode. Does the document act on its own warning, or just note it? In 10, the git-as-evidence argument is ours against Codex's: is it argued or merely asserted?

You may check things in the repository itself (Bash: grep, sed, cat) where a document's argument
depends on the code. Do not do web research; that has been done to death and is not where the
remaining risk is.
```

## Response

- **findings:**
  - _item 1_
    - **file:** p1b/result/claude/12-milestones.md
    - **heading:** BUDGET VERDICT (first line, as requested)
    - **quoted sentence:** our own pre-mortem says a 5% margin is the failure mode, not the plan
    - **what is wrong:** 07-premortem.md contains no statement about margins at all — grep for margin/slack/buffer/reserve/% returns a single hit, "29 of them (18%) touched the feature on the poster," which is about allocation, not headroom — so the single most load-bearing sentence of a graded deliverable cites an internal document for a claim that document does not make.
    - **category:** WEAK_SOURCE_TREATED_AS_SETTLED
    - **severity:** HIGH
    - **suggested fix:** Either replace with what the pre-mortem actually says ("our pre-mortem's failure mode is 131 of 160 hours going to environment, merge repair and a last-48-hours report") or state the margin judgement as your own with its reasoning, and drop the false attribution.
  - _item 2_
    - **file:** p1b/result/claude/12-milestones.md
    - **heading:** BUDGET VERDICT / NOW milestone table / Classification of every NOW milestone
    - **quoted sentence:** Drop milestone N5b (share-route hardening, 8.75 h) to restore a 14 h margin; that is the single most useful sentence in this document.
    - **what is wrong:** The document never acts on its own recommendation — the milestone table still totals 94.75 h with N5b in it, line 51 still reports "Margin: 5.25 h", and the classification table still plans N5b with a fallback slice — so the plan of record shipped in a graded D3 is the one the document just called the failure mode.
    - **category:** INTERNAL_CONTRADICTION
    - **severity:** HIGH
    - **suggested fix:** Restate the plan of record as 86.00 h / 14.00 h margin with N5b moved to a named FOUND-NOT-FIXED line, exactly as 14-cut-list.md CUT 1 already does; if the cut is conditional, name the trigger date and the owner who makes the call.
  - _item 3_
    - **file:** p1b/result/claude/12-milestones.md
    - **heading:** BUDGET VERDICT (first line, as requested)
    - **quoted sentence:** Drop milestone N5b (share-route hardening, 8.75 h) to restore a 14 h margin
    - **what is wrong:** The work being cut is the one defect this same document proves has no mitigation whatsoever (B4: "no table, no RLS, no policy" in 13 migrations), and the document nowhere states what dropping it costs — a marker will ask "you cut the only hole you proved was unmitigated?" and this file has no answer, though 14-cut-list.md:40-42 and 15-codex-prompt-reruns.md:631 both do.
    - **category:** MARKER_WILL_CHALLENGE
    - **severity:** HIGH
    - **suggested fix:** Add one sentence carrying 14-cut-list's answer into this file: the defect is reported as found, proved, and priced at 8.75 h with the reason for declining stated, and the poster must stop claiming the route was closed.
  - _item 4_
    - **file:** p1b/result/claude/12-milestones.md
    - **heading:** Open question we should carry forward, unresolved and labelled
    - **quoted sentence:** no product shows a rationale *computed from, and checkable against, the specific inventory rows and dates that produced the ranking*
    - **what is wrong:** Later runs narrowed the survivor to a four-way conjunction (named item + actual expiry date + nutrient constraint + reason for substitution in one auditable correctable object), and Remy already prints "Using up before they expire: <item> · <qty>" computed from inventory rows while Cooklist ships item-naming expiry reminders — so the sentence written "to be true either way" is, as worded, already false.
    - **category:** STALE
    - **severity:** HIGH
    - **suggested fix:** Replace with the surviving four-way conjunction verbatim, and name Remy, Cooklist, RecipeFix and Mealie as the products that hold each single leg, so the claim is the conjunction and not the leg.
  - _item 5_
    - **file:** p1b/result/claude/10-team-fit.md
    - **heading:** 2. Which direction lets THIS team build and test the most
    - **quoted sentence:** (a) converts the project's central artifact from untestable to testable, and testing is the one thing this team has demonstrated densely.
    - **what is wrong:** The keystone premise of the whole direction recommendation is contradicted twice inside the same file — §7 states most P1a "security tests" are source-text greps rather than executed attacks, and §5 states 100% of the 570 lines came from one person — which makes the demonstration thin and single-sourced, not dense.
    - **category:** INTERNAL_CONTRADICTION
    - **severity:** HIGH
    - **suggested fix:** Rewrite as "testing is the only skill this team has demonstrated at all, by one member, and part of what it demonstrated was the wrong kind of test" — the recommendation for (a) survives that weaker premise and is stronger for surviving it.
  - _item 6_
    - **file:** p1b/result/claude/10-team-fit.md
    - **heading:** 5. Ownership, and the bottleneck — The single highest-risk dependency on one person
    - **quoted sentence:** The team's one demonstrated differentiator is testing, and testing currently has a bus factor of 1.
    - **what is wrong:** This is precisely the universal-from-absence inference §0 declares "weak-to-worthless" and "consistent with pair programming under one author" — the file convicts the Codex analyst of switching propositions without switching evidence and then does it in its own risk section.
    - **category:** INTERNAL_CONTRADICTION
    - **severity:** HIGH
    - **suggested fix:** Restate as an artifact claim the evidence supports — "all committed test authorship is attributed to one account, so we have no artifact showing anyone else can do it" — and make the 90-minute calibration exercise the thing that settles it, which the file already proposes.
  - _item 7_
    - **file:** p1b/result/claude/12-milestones.md
    - **heading:** N5 — Security and data-integrity floor (18.75 h)
    - **quoted sentence:** *N5a (10 h), on the receipt's critical path:*
    - **what is wrong:** The team's own defect triage prices these same edits at 1.5 h (D6, quantity) + 2.0 h (D4, affected rows) = 3.5 h plus one date-merge change, and 10-team-fit.md §6 uses exactly those figures — so N5a carries roughly 6.5 h of unexplained inflation, which is larger than the 5.25 h margin the entire budget verdict turns on.
    - **category:** ESTIMATE_AS_MEASUREMENT
    - **severity:** HIGH
    - **suggested fix:** Break N5a into its three line items with the triage's own hours beside them (03-engineering-evidence.md:99-102) and justify any delta, or re-cost it at ~5 h and recover the margin without cutting the security milestone.
  - _item 8_
    - **file:** p1b/result/claude/12-milestones.md
    - **heading:** Classification of every NOW milestone — N5
    - **quoted sentence:** its 8.75 h estimate is the least evidenced number in this document
    - **what is wrong:** 8.75 h is the only milestone number in the file with a published derivation (03-engineering-evidence.md:132, from the per-defect triage), whereas N1 12.0, N2 24.0, N3 22.0, N4 18.0, N5a 10.0 and the 60 h overhead split into report 24 / poster 12 / demo 10 / integration 14 appear nowhere with any basis — so the document performs humility about its best-sourced number and then cuts it, leaving six unsourced ones untouched.
    - **category:** ESTIMATE_AS_MEASUREMENT
    - **severity:** HIGH
    - **suggested fix:** Add a one-column "basis" to the milestone table: 8.75 = triage; N2 = ported prose + existing recipeMatch.ts; and mark N1/N3/N4/N5a and the 24/12/10/14 overhead split explicitly as unevidenced allocations, then aim the cut at the unevidenced ones.
  - _item 9_
    - **file:** p1b/result/claude/10-team-fit.md
    - **heading:** 0. First, the methodological question, because everything else rests on it
    - **quoted sentence:** Rejecting the source when it constrains a conclusion and rehabilitating it three sections later when it flatters one is *selective* skepticism, which is not skepticism at all.
    - **what is wrong:** The central accusation against the rival carries no quote, no section number and no file:line in the one file where it is load-bearing — the supporting sentence does exist (p1b/result/codex/README.md:162) but it lives in 06-disagreement-with-codex.md, and it is hedged ("but not which current member owns each skill"), which blunts the fallacy-of-composition charge this paragraph states at full strength.
    - **category:** WEAK_SOURCE_TREATED_AS_SETTLED
    - **severity:** HIGH
    - **suggested fix:** Quote Codex §11 in place with its file:line and its hedge, then argue that "collective … work" still smuggles the upstream team's 467 commits into our capability column — the argument holds with the hedge shown, and a marker can check it without leaving the page.
  - _item 10_
    - **file:** p1b/result/claude/10-team-fit.md
    - **heading:** 6. Budget: 160 hours, honestly (compared against 12-milestones.md)
    - **quoted sentence:** | **Subtotal** | **134.25** |
    - **what is wrong:** Two same-day, same-model graded documents publish irreconcilable budgets for the same month — this one puts report/poster/demo/rehearsal at 30.0 h against 12's 46 h, prices the three in-scope defects at 12.25 h against 12's 18.75 h, prices the ranker at 30 h against N2's 24 h, and has no line at all for the M0 harness and recorded baseline that 12 (18 h) and 13 (24 h) make the graded centerpiece.
    - **category:** INTERNAL_CONTRADICTION
    - **severity:** HIGH
    - **suggested fix:** Delete §6's table and point to 12-milestones as the single budget of record, or reconcile the two line by line — shipping both as-is hands a marker a one-minute inconsistency across your two most quantitative deliverables.
  - _item 11_
    - **file:** p1b/result/claude/10-team-fit.md
    - **heading:** 7. Two items that are not ranking problems — The honest headline for the poster
    - **quoted sentence:** an unauthenticated POST to `web/src/app/api/shopping-lists/share/route.ts` — 96 lines, zero `auth.getUser` calls, confirmed by grep today — asserting it does not return 200 is a real attack that takes minutes.
    - **what is wrong:** Against a database built from this repo's 13 migrations the table does not exist (verified: `shopping_list_shares` appears in no file under supabase/), so the insert throws and the handler returns non-200 no matter who calls it — the proposed test passes for the wrong reason and proves nothing about authorization.
    - **category:** DOES_NOT_FOLLOW
    - **severity:** HIGH
    - **suggested fix:** State the unchecked precondition — does the deployed Supabase project have this table? — and specify a discriminating test: assert the failure is a 401/403 and not a relation-does-not-exist error, or run it against a project where the table exists.
  - _item 12_
    - **file:** p1b/result/claude/12-milestones.md
    - **heading:** Classification of every NOW milestone — N5
    - **quoted sentence:** write the migration and the RLS policy only (~4 h), which converts "no defence exists" into "a defence exists that the route does not yet use"
    - **what is wrong:** The current state is not "no defence exists" — there is no table to write into, so the half-fix creates the write target first and its net safety depends entirely on the policy being right against a route that uses the anon key, an improvement the document asserts rather than establishes.
    - **category:** DOES_NOT_FOLLOW
    - **severity:** MEDIUM
    - **suggested fix:** Say what the slice actually changes ("creates the table this route has been failing into, with RLS denying anon inserts") and make the deliverable the executed test that an anon insert is refused, otherwise the slice is not a defence, it is a new surface.
  - _item 13_
    - **file:** p1b/result/claude/10-team-fit.md
    - **heading:** 1. What the repository proves about us (FACT, re-verified today) / 5. The single highest-risk dependency
    - **quoted sentence:** All 4 TypeScript test files and all 3 Pytest files; every one of those 570 lines.
    - **what is wrong:** §1 of the same file names "All 5 test files" — three .ts and two .py — and on disk there are exactly 3 TypeScript test files plus jest.config.ts and 2 Pytest files plus a 1-line __init__.py, so §5 promotes file-type counts into test-file counts and the "570 lines of executable output" silently includes 16 lines of config and scaffolding.
    - **category:** INTERNAL_CONTRADICTION
    - **severity:** MEDIUM
    - **suggested fix:** Use one number in both places — 5 test files, 554 lines of test code, plus a 15-line Jest config and a 1-line __init__.py — and say the glob included them.
  - _item 14_
    - **file:** p1b/result/claude/10-team-fit.md
    - **heading:** 5. Ownership, and the bottleneck — Removal, in order of cost-effectiveness
    - **quoted sentence:** This takes the bus factor from 1 to 4 in week one at **zero additional hours** — it is the same tests, differently assigned.
    - **what is wrong:** It is not zero-cost and does not reach 4 — the same file establishes that three of four members have no demonstrated test authorship here, so the reassignment moves work onto unproven authors at an unknown cost and produces four nominal test owners, not four demonstrated ones.
    - **category:** DOES_NOT_FOLLOW
    - **severity:** MEDIUM
    - **suggested fix:** Say "at no additional scheduled hours, but at an unknown ramp cost we will measure with the 90-minute calibration exercise," and make bus-factor-4 the outcome to be verified in week one rather than the claimed effect of the assignment.
  - _item 15_
    - **file:** p1b/result/claude/10-team-fit.md
    - **heading:** 5. Ownership, and the bottleneck — Roles
    - **quoted sentence:** R4 is not a consolation role. It owns the team's one proven differentiator and roughly 30 hours of scheduled work.
    - **what is wrong:** Remedy 1 four paragraphs later removes test authorship from R4 ("whoever writes the code writes its test"), and the only 30.0 h line in §6 is "Report, poster, demo recording, rehearsal" — so by the file's own tables R4 owns documentation, which is the consolation role the sentence denies.
    - **category:** INTERNAL_CONTRADICTION
    - **severity:** MEDIUM
    - **suggested fix:** Either trace R4's 30 h to a budget line that is not report/poster/demo, or make the honest case: R4 owns the harness, the standard, the CI gate and the deliverables, and that is 44 h of the 134.25.
  - _item 16_
    - **file:** p1b/result/claude/12-milestones.md
    - **heading:** BEFORE — Project 1a, B2
    - **quoted sentence:** **B2. We designed and executed an adversarial/security pass.** Web: 44 executed, 33 PASS / 11 FAIL.
    - **what is wrong:** Three lines later B4(a) retracts it — "most P1a 'security tests' are source-text greps, not executed attacks" — so the file states the headline number uncaveated at the top of the BEFORE section, which is where a marker reads it first.
    - **category:** INTERNAL_CONTRADICTION
    - **severity:** MEDIUM
    - **suggested fix:** Move the caveat into B2 itself: "44 cases ran, but most assert on source text (`expect(route).toContain(...)`), not on executed requests — see B4(a); the executed subset is N."
  - _item 17_
    - **file:** p1b/result/claude/12-milestones.md
    - **heading:** FUTURE — Project 3, P3
    - **quoted sentence:** the vendor evidence that the problem is real is Plan to Eat's own post-mortem — "There is no way for your real inventory and your Plan to Eat inventory to ever remain synchronized"
    - **what is wrong:** A vendor's own sentence is evidence that a vendor said it, not that the problem is real, and the team's own gap-closing sweep of 851 Reddit entries across eleven explainability phrasings returned zero demand-side hits — this is the same shape as the App Store screenshot that turned out to be a Sketch mockup.
    - **category:** WEAK_SOURCE_TREATED_AS_SETTLED
    - **severity:** MEDIUM
    - **suggested fix:** Downgrade to "one vendor asserts the sync problem is unsolvable in its own product; we have no demand-side evidence that users want an explanation for it (851-entry sweep, zero hits)," and label P3 a hypothesis.
  - _item 18_
    - **file:** p1b/result/claude/12-milestones.md
    - **heading:** Classification of every NOW milestone — N1
    - **quoted sentence:** skipping it is what turns the other four milestones into the 29-of-160-hours scenario
    - **what is wrong:** 29/160 comes from a deliberately fictional autopsy dated forward to 2026-10-13 and written in the past tense on purpose, so quoting it as "the 29-of-160-hours scenario" gives an invented number the standing of a forecast in a document that elsewhere marks every figure's provenance.
    - **category:** ESTIMATE_AS_MEASUREMENT
    - **severity:** MEDIUM
    - **suggested fix:** Write "the failure our pre-mortem imagined, in which only 29 of 160 hours reach the poster's feature" so the number stays clearly fictional.
  - _item 19_
    - **file:** p1b/result/claude/12-milestones.md
    - **heading:** Classification of every NOW milestone (preamble)
    - **quoted sentence:** four graduate students at ~10 h/week, not a funded team
    - **what is wrong:** 10-team-fit.md §5 flags this exact number as unverified — "The 10 h/person/week is an *assumption*. If one person has four, the plan changes. Say so out loud" — and this file states it as a parameter of the classification without the caveat, which means every REALISTIC verdict inherits an unmeasured input.
    - **category:** ESTIMATE_AS_MEASUREMENT
    - **severity:** MEDIUM
    - **suggested fix:** Add one clause: "~10 h/week assumed, not declared; a real availability declaration in week 1 is a precondition for these verdicts."
  - _item 20_
    - **file:** p1b/result/claude/10-team-fit.md
    - **heading:** 4. The missing skills: weekend, or redesign? — Skill 1
    - **quoted sentence:** Concrete weekend deliverable: a migration creating `shopping_list_shares` with RLS, a `CHECK (quantity > 0)` on `user_inventory`, and an executed test proving a cross-user select returns zero rows. Two people, one keyboard.
    - **what is wrong:** This schedules as a named weekend exactly the work 12-milestones and 14-cut-list both make the first thing to cut, and "two people, one keyboard" for a weekend is roughly 16-20 person-hours against the 8.75 h the identical work is priced at in every other document.
    - **category:** INTERNAL_CONTRADICTION
    - **severity:** MEDIUM
    - **suggested fix:** Reconcile with the cut order — keep the weekend as the skill-acquisition exercise but cost it and label it as such, and say plainly whether the share-route fix ships or is reported found-and-not-fixed.
  - _item 21_
    - **file:** p1b/result/claude/10-team-fit.md
    - **heading:** 1. What the repository proves about us (FACT, re-verified today)
    - **quoted sentence:** Confirmed: `git log --since=2026-08-01 --name-only --pretty=format: | grep -E '^(web/src|backend/api)'` returns empty.
    - **what is wrong:** The sentence it is offered as confirming names three directories — web/src, backend/api and supabase/ — but the quoted pattern tests only two, so the third of a claim presented as verified has no evidence shown in a file whose whole premise is reproducible commands.
    - **category:** DOES_NOT_FOLLOW
    - **severity:** MEDIUM
    - **suggested fix:** Change the pattern to `'^(web/src|backend/api|supabase)'` and re-quote the command.
  - _item 22_
    - **file:** p1b/result/claude/12-milestones.md
    - **heading:** N2 — Deterministic scorer, pure module, property-tested (24 h)
    - **quoted sentence:** with its "20 points per expired ingredient" term **deliberately set to zero** — a food-safety position we defend, not an oversight
    - **what is wrong:** The position is never stated, so a marker asking "what position?" gets nothing from this document — the answer (do not reward recommending expired food, and let the human decide) exists in 10-team-fit §7 and the test exists at 13-name-the-test T6, but neither is referenced here.
    - **category:** MARKER_WILL_CHALLENGE
    - **severity:** MEDIUM
    - **suggested fix:** Add the one sentence: "Grocy's term rewards recipes for consuming expired items; we refuse to score food safety, so the term is zero and expired items are surfaced separately — the override is a field in the fixture and flipping it 0→20 is a test."
  - _item 23_
    - **file:** p1b/result/claude/12-milestones.md
    - **heading:** Method note / BUDGET VERDICT / Classification preamble
    - **quoted sentence:** judged against 160 person-hours *minus* report, poster and demo
    - **what is wrong:** The denominator is stated two different ways in the same file — the method note subtracts report/poster/demo (leaving 114 h) while the verdict and the classification preamble subtract report/poster/demo/integration (leaving 100 h) — and every REALISTIC/STRETCH verdict depends on which one applies.
    - **category:** INTERNAL_CONTRADICTION
    - **severity:** LOW
    - **suggested fix:** Use 100 h everywhere and spell the deduction once: report 24 + poster 12 + demo 10 + integration/merge/review/meeting 14 = 60.
  - _item 24_
    - **file:** p1b/result/claude/12-milestones.md
    - **heading:** Classification of every NOW milestone — N3
    - **quoted sentence:** which is why 6 of the 22 h are allocated to it
    - **what is wrong:** No breakdown of N3's 22 h is published anywhere in this file or its siblings, so the sub-allocation is asserted at a precision the plan does not have.
    - **category:** ESTIMATE_AS_MEASUREMENT
    - **severity:** LOW
    - **suggested fix:** Publish the N3 split (render / correction write path / auth move) or drop the "6 of the 22" and say "the correction write path is the genuine unknown in N3."
  - _item 25_
    - **file:** p1b/result/claude/12-milestones.md
    - **heading:** N4 — M0 harness, recorded baseline, correctability measure (18 h)
    - **quoted sentence:** That costs roughly 100-300 live Gemini calls, once, archived.
    - **what is wrong:** 13-name-the-test.md specifies the same baseline as "one prior run against the live `gemini-2.5-flash` endpoint (30 calls, archived as JSON)" — an order-of-magnitude divergence between two same-day documents on the one live-API cost in the plan.
    - **category:** INTERNAL_CONTRADICTION
    - **severity:** LOW
    - **suggested fix:** Pick the number that matches the harness you will actually run (10 pantries × 3 runs = 30 calls) and state it identically in both files.
- **files audited:**
  - /Users/andy/Library/Mobile Documents/com~apple~CloudDocs/Work/1151/CSC510/Epicourier-Web/p1b/result/claude/10-team-fit.md
  - /Users/andy/Library/Mobile Documents/com~apple~CloudDocs/Work/1151/CSC510/Epicourier-Web/p1b/result/claude/12-milestones.md
- **strongest things:**
  - 10-team-fit.md §0 — the admissibility framework is genuinely argued, not asserted: it separates existential claims ("this artifact exists, this account committed it") from universal claims about ability, then backs it with four independently checkable distortions in our own log — Amihua's 15 commits touching zero files, wenboli/wenboli721 sharing one email, web-UI one-commit-per-file inflation, push-vs-thought authorship. That is the part of the file a marker cannot knock over, and it should not be softened.
  - 10-team-fit.md §2 — the scope-discipline paragraph, which constrains the product claim on a schema fact: because `user_inventory` is UNIQUE (user_id, ingredient_id, location) and sums quantities, and `updated_at` is trigger-reset to NOW(), "the rationale must say 'item,' not 'lot'" and "must therefore make no provenance or age claims at all." A document that narrows its own thesis because the database forbids the wider one is rare and is exactly right.
  - 10-team-fit.md §3 — the argument that shipping direction (c) would require writing a fix that introduces a bug, because `shopping_list_items` has no `user_id` column and the failing test demands a query against a column that does not exist. It turns our own headline finding into a methodological result rather than defending it.
  - 12-milestones.md N4 — the scoping correction that retracts a number already on the team's own poster: "the claim 'a baseline of 0/500 recorded by the same harness against today's build' **cannot be produced as written**" because `num_recipes` is `Field(default=5, ge=1, le=10)`, so 10 pantries yield at most 100. Self-inflicted correction of a graded artifact, with the reproducible restatement supplied.
  - 12-milestones.md FANTASY table — each of the three temptations is killed on a structural ground rather than a judgement call (the UNIQUE constraint forbids lots; IRB plus the JMIR null result; direct competition for the same hours), and each is paired with a named largest-realistic-slice, which makes the classification something the team can execute in week 4 rather than a label.
- **overall:** Both files are unusually well-evidenced at the file:line level and both are weakest exactly where they stop citing and start persuading. 10-team-fit's methodological core (§0, §2, §3) is genuinely argued; its attack on the rival and its people-risk section are not — "rehabilitating it three sections later" and "crediting us with the upstream team's TypeScript fluency" carry no quote in the one file where they are load-bearing (the supporting line exists at p1b/result/codex/README.md:162, but it is hedged with "but not which current member owns each skill" and lives in 06, not here), and §5 then commits the exact absence-to-ability inference §0 forbids by declaring a bus factor of 1. The file also asserts "testing is the one thing this team has demonstrated densely" while §5 and §7 establish that it was one person writing mostly source-text greps.
  
  On the specific assignment question for 12: the document notes its warning and does not act on it. The 5.25 h margin is called the failure mode in the first line, the fix is named in the same sentence, and then every subsequent line of the file keeps N5b — the table still totals 94.75, line 51 still prints "Margin: 5.25 h", the classification table still plans N5b with a fallback slice. The acting happens in 14-cut-list.md (CUT 1, margin → 14.00) and 13-name-the-test.md (N4 under-costed by 6 h; N2+N3+N4+N5a "does not close"), which means the graded D3 ships a plan its own siblings have already declared infeasible. Worse, the recommended cut is the only defect the file proves has no mitigation at all, and 12 never states that cost, though 14 and 15 both do.
  
  On the hour estimates: exactly one milestone number has a stated basis. 8.75 h derives from the per-defect triage at 03-engineering-evidence.md:132, and D6 (1.5 h) and D4 (2.0 h) from the table at :99-102. N1 12.0, N2 24.0, N3 22.0, N4 18.0, N5a 10.0, the "6 of the 22 h" split, and the entire 60 h overhead decomposition (report 24 / poster 12 / demo 10 / integration 14) have no derivation anywhere in the repository — they are vibes with a decimal point. The irony worth fixing before a marker finds it: the file calls 8.75 "the least evidenced number in this document" and cuts it, when it is the best-evidenced one; meanwhile N5a prices the same edits the triage costs at 3.5 h at 10.0 h, and that unexplained ~6.5 h is larger than the margin the whole verdict turns on. Reclaiming it from N5a rather than from the security milestone would restore the headroom without dropping the unmitigated hole.
  
  Two staleness items need fixing before submission: 12's closing differentiation sentence is broader than what later runs left standing (the four-way conjunction), and P3's Plan to Eat quote is treated as "evidence that the problem is real" when the 851-entry Reddit sweep returned zero demand-side hits — the same shape as the Sketch-mockup screenshot.
