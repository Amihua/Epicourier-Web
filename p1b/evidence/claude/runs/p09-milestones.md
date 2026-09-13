# P09-milestones

**Workflow:** P1b Claude decide and commit (run 3)  
**Phase:** Commit  
**Model:** Claude Opus 5 (1M context), `claude-opus-5[1m]`  
**Agent id:** `ac6ec3fe64075b319`  
**Tool calls:** 4 total — 0 web searches, 0 pages fetched  
**Raw transcript:** `raw/agent-ac6ec3fe64075b319.jsonl` (full tool-call trace, retained)

---

## Prompt, exactly as issued

```text
Milestone reality check.

THE TEAM: four graduate students, one month to build AND test, roughly ten hours per person per
week, who must also produce a report, a poster and a demo from the same budget.

THE TEAM, stated as honestly as the evidence allows:
- Four graduate students: Andy (andyyuyc), Sihao Liu, Jeffery (Mr-Jeffery), Wenbo Li.
- Individual biographies have NOT been collected. That is a real gap and the report should say so.
- What the repository DOES prove, from git log --since=2026-08-01 --name-only on our fork: our
  team's ~63 commits during Project 1a touch almost exclusively .md, .txt, .sh, .py and a handful
  of .ts TEST files. Our team has not yet changed a production source file in this codebase.
  The TypeScript/Next.js/FastAPI/Supabase fluency visible in the repository belongs to the
  UPSTREAM team (467 commits, ending 2025-12-07), not to us.
- Demonstrated by us in P1a: writing Jest and Pytest tests, adversarial/security test design,
  evidence discipline, multi-model prompt orchestration, technical writing.
- NOT yet demonstrated by us: shipping a production change to this Next.js app, writing a
  Supabase migration, changing the FastAPI recommender, running a user study.
- Note the methodological point: git history is weak evidence about who OWNS a skill but strong
  evidence about what the team has DEMONSTRATED. The rival Codex analyst rejected this source
  outright and then, three sections later, used repository evidence to assert team capability —
  attributing the upstream team's skills to us. Do not repeat that error.

OUR OWN ENGINEERING POSITION, re-derived from the repository on 2026-09-13 (not from the P1a
write-up — every defect was re-grepped against the current working tree):

- P1a run logs, ours, auditable: Web functional 32 tests 31 PASS / 1 FAIL; Backend 18 cases
  18 PASS. Including adversarial: Web 44 executed 33 PASS / 11 FAIL; Backend 25 executed 18 PASS
  / 7 FAIL. The inherited suite passed 1,095/1,096 in 3.6 s — that is the PREVIOUS team's suite
  and must never be used as our boast.
- 18 recorded FAILs collapse to 17 distinct source defects, plus 1 new one found in this audit.
  All 18 confirmed still present. Total competent fix + regression test effort: ~24.25 h.
- METHODOLOGICAL CAVEAT WE MUST DISCLOSE: most of the P1a "security tests" are source-text greps
  (e.g. expect(route).toContain('.eq("user_id", user.id)')), not executed attacks. Reporting 11
  failures without saying this inflates their credibility.
- THE HEADLINE IDOR IS PROBABLY A FALSE POSITIVE AT SYSTEM LEVEL. shopping_list_items has no
  user_id column; RLS enforces ownership through the parent list; the route uses the cookie-bound
  anon client. The "fix" the failing test demands would query a column that does not exist.
- THE REAL BUG UNDER UC20 IS BETTER THAN THE CLAIMED ONE. RLS does block the cross-user write,
  but web/src/app/api/inventory/transfer/route.ts never inspects how many rows the update
  touched (:98 checks only checkError; the DELETE path at :152 discards the result), so it
  returns success:true and transferred_count:N for transfers that did not happen — while the
  inventory row WAS inserted. That is silent data loss, and UC20's postcondition then deletes the
  completed list.
- THE ONE GENUINELY UNMITIGATED HOLE: web/src/app/api/shopping-lists/share/route.ts builds a bare
  anon client, never calls auth.getUser, never checks that shoppingListId belongs to the caller,
  and feeds expiryDays straight into Date.setDate(). Its table, shopping_list_shares, has NO
  migration, NO ENABLE ROW LEVEL SECURITY and NO policy anywhere in supabase/migrations/. Every
  other authorization finding was downgraded because we could read the policy that catches it;
  here there is nothing to read. ~8.75 h to fix properly (migration + RLS policy, then auth, then
  ownership query, then bound expiryDays).
- quantity || 1 at transfer/route.ts:65,:80,:167 — user_inventory.quantity is
  DECIMAL(10,2) NOT NULL DEFAULT 1 with NO CHECK constraint. Negatives persist; 0 becomes 1.
  Unguarded data corruption, 1.5 h.
- SCHEMA BLOCKER FOR ANY "LOT" LANGUAGE: user_inventory upserts by
  (user_id, ingredient_id, location) and SUMS quantities into one row. There are no per-purchase
  lots, no per-lot expiry, no provenance. A promise to "show which pantry LOT caused this ranking"
  is not representable in the current schema. Either add the table or say "item", not "lot".
- SAFETY EXPOSURE NEITHER ANALYST CAUGHT UNTIL NOW: UC17 prioritises ingredients that are
  expiring OR ALREADY EXPIRED, and the prompt labels them "EXPIRED"/"EXPIRING NOW". The product
  actively recommends cooking food it believes has expired. That is a food-safety question, not a
  ranking question.
- The free-text goal (UC5) and preference (UC17) are unbounded and are interpolated directly into
  the Gemini prompt with no untrusted-data boundary.

THE PRE-MORTEM'S FINDING (our own C5 prompt, run on 2026-09-13): in the failure scenario, only 29
of 160 hours reached the feature. The rest went to environment setup repeated four times in
private (a defect P1a had already diagnosed), 9 h of Friday merge conflicts, 12 h making demo
data look real, 7 h asking Gemini to explain Gemini (fluent, unstable, twice citing pantry items
that did not exist), 26 h of report written in the last 48 hours, and 26 h of unrequested
visible features (a Waste Warrior badge, an explanation-verbosity setting, an animated timeline).
The single week-1 decision that caused it: the team decided the deliverable was a PANEL, not a
NUMBER. Its top-ranked prevention, by failure-prevented-per-hour: freeze the claims before the
code — write the Results paragraph with numeric blanks and, beside each blank, the exact query
that fills it; delete any sentence whose query does not exist.

THE CHOSEN DIRECTION (from our wedge adjudication):
# P20 RERUN — ONE-MONTH WEDGE ADJUDICATION
**Adjudicator: Claude, independent rerun 2026-09-13. Every repo defect re-grepped against the working tree today; every market claim re-fetched today or explicitly marked unknown.**

---

## 0. METHOD NOTE AND WHAT CHANGED

**FACT.** WebSearch was exhausted (200/200) on my first query — the third consecutive session (P13, P17, this one) to hit that wall. Discovery ran on direct WebFetch of App Store listings, the iTunes lookup API, vendor help centres, and vendor source. Repo claims ran on `grep`/`sed` against the current tree. Nothing below is recalled; sources are named per claim.

**Two findings change the ruling.** One is a market fact that narrows the wedge. One is a code fact that sharpens it.

### 0.1 MARKET: the wedge is being colonised right now, by one person, since July

**FACT.** "Use It Up: Pantry Recipes", US App Store id 6775112024, v1.0.8, `currentVersionReleaseDate` **2026-07-28**, seller "MICHAEL GEORGE JOSEPH" (iTunes lookup API, fetched today). P17 scored this a *weak* refutation because its regex scanned only the description. The decisive text is in the **version history**, verbatim:

> **v1.0.5 (Jul 4):** "WHOOP-optimized recipe discovery: swipe a deck ranked for how you've recovered and trained today, **with a 'why this dish' explanation on every card**."

> **v1.0.3 (Jun 25):** "Meal Planner — build a weekly plan around the food already in your kitchen, swap any meal you're not feeling, and **turn the whole plan into a ready-to-shop grocery list**."

> **Description:** "tracks what's about to expire and tells you what to cook tonight using the food that needs eating first… recipes from your real kitchen, **worst-expiring first**"

That is a live app holding a pantry inventory with expiry dates, ranking worst-expiring-first, shipping a per-recommendation "why this dish" card, connecting a training signal, and emitting a grocery list. **It contains F1, F3 and F4 in one binary, shipped nine weeks ago.**

**What is still unknown, and it is the whole question:** the v1.0.5 note ties "why this dish" to *WHOOP recovery*, not to expiry. No first-party text shows its rationale naming a pantry item and a date. The iTunes payload carries **no `sellerUrl`**, so there is no site to check. I could not resolve this and I will not guess.

**Consequence:** G1 as re-worded by P17 is **wounded, not dead**. "No product that maintains a pantry inventory shows a per-recommendation rationale" is now false in the general case — Use It Up maintains one and shows one. What survives is narrower and must be said precisely: *no product shows a rationale computed from, and checkable against, the specific inventory rows and dates that produced the ranking.*

### 0.2 CODE: our recommender already shows a rationale, and validates none of it

**FACT, new in this audit, and worse than any of the 18 recorded defects.** `backend/api/inventory_recommender.py` is 245 lines. `grep -n "validate\|verify\|check"` returns **zero hits**. Line 231 parses Gemini's JSON; the parsed object carries `match_score`, `ingredients_available`, `ingredients_missing`, `expiring_ingredients_used` and `reason`. `web/src/components/inventory/RecipeRecommendationModal.tsx` renders them directly — `{recipe.reason}` at :298, the score at :303-307, and at :328-330:

> `Uses {recipe.expiring_ingredients_used.length} expiring ingredient… {recipe.expiring_ingredients_used.join(", ")}`

Nothing cross-checks those names against the `user_inventory` rows that were sent in. **The product already tells the user which of their food is expiring, and has no code path that verifies the claim.** The "Scoring Guidelines" at :159-162 (`+15` for 2+ expiring items, `base = available/total * 100`) are English sentences addressed to a language model, not arithmetic.

### 0.3 Corrections to the brief I was handed

| Brief claim | Verdict | Evidence |
|---|---|---|
| "UC17… The product actively recommends cooking food it believes has expired" | **OVERSTATED** | `inventory_recommender.py:157` contains a guard: `5. **NEVER**: Do not recommend recipes that ONLY use ❌ EXPIRED items`. The real exposure is narrower and still real: expired rows are injected at :89 as `(EXPIRED N days ago) ❌`, the guard blocks only recipes made *entirely* of them, and the guard is a prompt sentence, not a code path. Nothing enforces it. |
| Plan to Eat's "Staples List" is the named replacement and does not deduct | **NOT SUPPORTED — drop it** (confirms P17 row 11) | I re-fetched `learn.plantoeat.com/help/a-digital-pantry-inventory-does-it-really-help` today and asked explicitly. **No mention of a Staples List anywhere on that page.** |
| Headline IDOR is a false positive; real bug is the unchecked row count | **CONFIRMED** | `transfer/route.ts` checks only `checkError` on the `is_checked` update; the DELETE path (`~:170`) awaits with no destructuring at all. |
| `share/route.ts` is the one unmitigated hole | **CONFIRMED, first-hand** | The file opens with `createClient(NEXT_PUBLIC_SUPABASE_URL!, NEXT_PUBLIC_SUPABASE_ANON_KEY!)`, never calls `auth.getUser`, inserts on `shoppingListId` straight from the body, and does `expiryDate.setDate(expiryDate.getDate() + expiryDays)` unbounded. `grep -rn "shopping_list_shares" supabase/` returns **nothing** — no table, no `ENABLE ROW LEVEL SECURITY`, no policy. |
| No lots in the schema | **CONFIRMED** | `20251129030000_user_inventory.sql`: `CONSTRAINT unique_user_ingredient_location UNIQUE (user_id, ingredient_id, location)`, `quantity DECIMAL(10,2) NOT NULL DEFAULT 1`, no CHECK. Say **"item"**, never "lot". |

**FACT, new, and it directly threatens F1's headline promise.** `transfer/route.ts:66` merges a restock as `expiration_date: item.expiration_date || existingItem.expiration_date`. The incoming date **overwrites** the stored one whenever present, while quantities are summed. So after buying fresh spinach on top of old spinach, the single aggregate row carries the *later* date over *both* portions. A rationale that prints that date would overstate freshness — a food-safety-relevant error introduced by the rationale feature itself. One-line mitigation (`LEAST(existing, incoming)`, ~1 h) folded into F1's scope below.

---

## 1. SCORES

Penalties are shown as negatives and are **not** folded into a positive total. `NET = demand + differentiation + fit + testability + confidence − saturation − risk` (range −6…+15).

| feature | user-demand 0-3 | incumbent saturation 0-3 (PENALTY) | differentiation 0-3 | implementation fit 0-3 | testability in 1 month 0-3 | safety/privacy risk 0-3 (PENALTY) | evidence confidence 0-3 | **NET** |
|---|---|---|---|---|---|---|---|---|
| **F1 grounded rationale** | 2 | **−2** | 2 | 3 | 3 | **−2** | 3 | **+9** |
| **F2 uncertainty-aware ranking** | 2 | **−1** | 3 | 1 | 1 | **−1** | 2 | **+7** |
| **F3 pantry-subtracted list** | 3 | **−3** | 0 | 3 | 3 | **−1** | 3 | **+8** |
| **F4 training target → meal → list** | 2 | **−3** | 0 | 1 | 1 | **−3** | 3 | **+1** |
| **F5 hardened baseline, executed suite** | 1 | **0** | 0 | 3 | 3 | **0** | 3 | **+10** |

**Read the F5 row correctly.** It nets highest because it carries no penalties, not because it differentiates. A feature with demand 1 and differentiation 0 cannot be a wedge. F5's high net is the arithmetic telling you it is a *floor*, not a *product*.

### Rationale, every cell

**F1 — grounded rationale.**
*Demand 2:* three vendors pay to say it — RecipeFix's listing, which I re-fetched today, leads with "**No black-box AI. Every substitution comes with the culinary reasoning behind it — why we picked that ingredient, how it affects the cooking process, and what to watch for**" (v2.4.0, live); ATK has sold "Why This Recipe Works" for decades; Use It Up added "'why this dish' on every card". Not 3: zero direct user voice. Apple's review RSS is dead as an instrument (P17 row 22) and I could not revive it.
*Saturation −2 (higher than P17 concluded):* RecipeFix ships explained substitution **with natural-language correction**; Grocy ships the auditable ranking — I re-verified verbatim today: `msgid "The higher this number is, the more ingredients currently in stock are due soon, overdue or already expired"`; SeePantry ships item-level date reasons; Use It Up ships the per-card why *inside a pantry app*. Not −3 only because the specific cell — rationale naming the row **and** its date **and** correctable — is empty in every first-party text I could retrieve.
*Differentiation 2, down from 3:* Use It Up costs us the "nobody explains" claim. The honest wedge is now *computed and checkable*, not *explained*.
*Fit 3:* the highest in the table, and it is a port rather than a build. The UI contract already exists (`:298`, `:303`, `:328`); the data is already assembled (`format_inventory_with_expiration`, :68-100); the scoring rules already exist as English at :159-162 and need only move into Python.
*Testability 3:* a deterministic integer scorer needs no network and no LLM. Hypothesis is already vendored in `backend/.venv`. "Every name in the rationale resolves to a row in the input" is a property test, not a study.
*Risk −2:* printing a date makes a food-safety assertion you must stand behind — Pak'nSave is the category's cautionary tale. Compounded by the :157 guard being prose, by expired rows reaching the prompt at all, and by the date-overwrite bug in §0.3. Mitigable (~7 h, scoped below), not zero.
*Confidence 3:* every element re-verified today, first-party or from the tree.

**F2 — uncertainty-aware ranking.**
*Demand 2:* the best evidence in the entire corpus is Plan to Eat's post-mortem, which I re-fetched today — a vendor that built this and quit: "**There is no way for your real inventory and your Plan to Eat inventory to ever remain synchronized**" and "**Removing items from someone's shopping list without them knowing about it is never a good idea.**" That evidences the *problem*, not appetite for this *solution*.
*Saturation −1:* genuinely low. SeePantry and Fango expose estimates with correction; nobody propagates uncertainty into a rank.
*Differentiation 3:* the emptiest cell in the survey.
*Fit 1:* **our schema forbids it.** The UNIQUE constraint sums everything into one row; there are no lots, no purchase dates, no consumption log. "Probability the item is present" has nothing to condition on. You would have to build the evidence base first.
*Testability 1:* you can test that the code computes the number it claims; you cannot test that the number is *right*. The nearest published trial (JMIR PMC9482070) ran 6 students for a month and found no change — and that is the whole of our budget spent on measurement alone.
*Risk −1:* modest; failure mode is hiding food the user owns.
*Confidence 2:* G3's surviving fragment rests on absence-of-evidence across sweeps and I could not re-test it after the search budget died.

**F3 — pantry-subtracted, missing-items-only list with preview.**
*Demand 3, the highest in the table:* Plan to Eat's removal post is demand evidence *with a vendor-named failure mode that the preview gate directly answers*. Eat This Much, Grocy, Tandoor, Mealie, Paprika and Cooklist all ship a version.
*Saturation −3, the maximum:* Grocy publishes the exact arithmetic, re-verified verbatim today: "**By default the amount to be added to the shopping list is \"needed amount - stock amount - shopping list amount\"**", plus "Not enough in stock, %s ingredient missing" and "Put missing products on shopping list". Eat This Much's help centre, re-fetched today: "**if your meal plans need 2 apples and you already have 1 in your pantry, the grocery list will only tell you to purchase 1 more apple**". P13 found three DIRECT implementations.
*Differentiation 0:* there is nothing left to claim.
*Fit 3:* cheap here. `generate/route.ts` already consolidates duplicates (`ingredientMap`, merging by `ingredient.id`), and `grep -rn "user_inventory" web/src/app/api/shopping-lists/` returns **nothin

THE MISSION STATEMENT CANDIDATES:
CANDIDATE 1 — THE RECEIPT

All fourteen live products our survey verified on 2026-09-13 tell you that a recipe matches and none tells you why; the strongest thing anyone ships is Samsung Food's "each recipe will show how well it matches", which is a number, not a reason. Ours is worse than theirs, because the percentage we print in 2xl bold at RecipeRecommendationModal.tsx:304 comes from RecommendedRecipe.match_score at backend/api/inventory_recommender.py:51 — a field Gemini writes and no line of our code recomputes from the dates we already hold. Epicourier will compute that score in a pure module over the fifty-recipe corpus in backend/dataset/recipes-supabase.csv, using a published integer table — Grocy's due score, cited in a code comment, with its "20 points per expired ingredient" term deliberately set to zero — and print the receipt beneath it: each pantry item, its expiry date, its points, the running total, every line correctable in one tap, with Gemini demoted from judge to the prose that describes a ranking it was handed. The measurable claim M0 will test offline: across 50 recipes × 10 seeded pantries = 500 recommendations, the displayed total equals the sum of the displayed line items in 500/500 cases and the ordering is byte-identical across 20 shuffles of inventory input order, against a baseline of 0/500 recorded by the same harness against today's build. A user who believes the recommendation is wrong can then point at the one line that is wrong and watch the ranking move, instead of arguing with a percentage nobody — including us — can reproduce.

CANDIDATE 2 — THE VERIFIED SENTENCE

Recommenders in this market talk, and nothing checks that what they say is true: the decisive column of our survey is "unknown" or "partial" for 14/14 confirmed rivals, and SuperCook's apparent explanation was corrected from "yes" to "unknown" by our own fact-checker because a filter is not an explanation. Our text is not even a model's opinion — recommender.py:210-213 emits the template f"Selected because it aligns with goal '{goal_text}' and differs from other meals.", the user's own free-text goal echoed back, while UC17's prose is generated from a prompt that the user's ingredient names are interpolated into with no untrusted-data boundary. Epicourier will put a gate between the model and the screen: verifyExplanation checks every ingredient the explanation asserts against the 448-row catalog in backend/dataset/ingredients-supabase.csv and the caller's own user_inventory read under RLS, suppresses any sentence naming food the user does not own, and marks the suppression visibly rather than hiding it — and the ranking moves server-side behind an authenticated route, closing the client-to-FastAPI call at dashboard/inventory/page.tsx:141 that today spends our Gemini quota for anyone who knows the URL. The measurable claim M0 will test offline: on a fixed corpus of 100 stored explanations, 50 of them mutated by an automated injector that swaps in an ingredient the seeded pantry does not contain, the gate flags ≥49/50 mutated cases and falsely flags ≤1/50 clean ones, against a baseline of 0/50 detection on today's build, where no checking code path exists. Everything Epicourier says about your food is then either checkable against a row you can see, or it is not said.

CANDIDATE 3 — THE HONEST PANTRY

Plan to Eat built a pantry inventory, removed it, and published why — "There is no way for your real inventory and your Plan to Eat inventory to ever remain synchronized" — so the question that decides whether a pantry feature is worth shipping is not whether it exists but whether it admits what it does not know. Ours does not admit anything: calculateRecipeMatch at web/src/utils/inventory/recipeMatch.ts:29 does set membership on ingredient_id and ignores quantity and expiry entirely, so a row sitting at quantity 0 — or negative, courtesy of quantity || 1 at api/inventory/transfer/route.ts:65 against a DECIMAL column with no CHECK constraint — or three weeks past its date still counts as fully available, and prompt rule 5 at inventory_recommender.py:157 forbids only recipes made *entirely* of expired items. Epicourier will make availability a dated, quantity-aware judgement: non-positive and non-finite quantities are rejected at the write, items past their expiration_date contribute zero and are shown with the date that disqualified them, and before a seven-meal plan is committed the app asks one targeted question about the single item whose true state would most change the ordering. The measurable claim M0 will test offline: on 50 recipes × 10 seeded pantries containing planted rows at quantity 0, quantity −5, and expiration_date in the past, 0/500 recommendations report any such item as available, against a baseline of 500/500 recorded by the same harness on today's build, where every planted row is counted as present by construction. The pantry stops being a claim about your kitchen and becomes a dated record you can correct, which is the only version of this feature a vendor who has already retreated from it did not try.

---

PICK: CANDIDATE 1 — THE RECEIPT

Why. It is the only one of the three aimed at the single gap that survived adversarial interrogation (G1; G2 and G4 are dead, G3 is narrowed to a claim about propagating uncertainty that Candidate 3 only half delivers). It is buildable inside the ~100 h of feature-and-test left after the 60 h of fixed overhead, because its core asset already exists and is pure, dependency-free and unit-tested: recipeMatch.ts supplies the coverage half, and the expiry half is an integer table. Its claim is falsifiable by a harness that runs in seconds over a 50-row corpus we can enumerate exhaustively, with no users, no field study, and no dependence on the two things our own verification could not reach this session (Samsung Food behind HTTP 403, and regulator date-label guidance). And it forces the honest version of our own position into the product rather than into a footnote — we ship the market's weakness today, in a worse form, and the fix is visible on screen.

The sentence a marker challenges first. Sentence 4: "the displayed total equals the sum of the displayed line items in 500/500 cases and the ordering is byte-identical across 20 shuffles of inventory input order, against a baseline of 0/500." The challenge is that this is a tautology dressed as a result — if you write the code so the total is the sum, of course the test passes; you have measured that addition works, and a 0/500 baseline is guaranteed because the current build has no line items to sum.

How we defend it. First, restate what is under test: not that addition works, but that the number shown to the user is the number the system actually ranked with, and that it is stable under nuisance variation in the input. Today's build fails both properties for reasons that are structural, not accidental — inventory_recommender.py:51 has the model author the integer, so there is nothing to sum and no reason for two runs over the same pantry to agree — and we report the baseline as the same harness executed against the current build on the same 500 cases, including the observed run-to-run disagreement rate of today's match_score, so the 0/500 is a measurement and not a definition. Second, we concede the formula is not the contribution and say so on the poster: Grocy already publishes an auditable due score, so our contribution is per-recommendation publication of the terms plus one named, defended disagreement — Grocy's 20 points per expired ingredient against our 0, which is a food-safety position we take deliberately given that rule 5 at inventory_recommender.py:157 currently lets expired items ride along. Third, we add the non-tautological half of the same harness: the correctability measure — after a single flagged line is corrected, the recorded fraction of the 500 rankings whose order changes, which no amount of careful coding can guarantee in 

RULES: Do not invent products or sources. Use WebSearch/WebFetch for any market claim (load with
ToolSearch "select:WebSearch,WebFetch" if absent). Quote real page text. Write "unknown" rather
than something plausible. Separate fact, inference and hypothesis. Respect the 160-hour budget in
every recommendation.

Draft the milestone list in the three groups the poster requires, 3-5 each:
- BEFORE: what was done in Project 1a. Use only numbers from our own run logs; never the
  inherited "1,130+ tests" figure.
- NOW: the plan for this month (Project 2).
- FUTURE: what comes after (Project 3).

Then classify EVERY "NOW" milestone REALISTIC / STRETCH / FANTASY with one sentence of why,
judged against 160 person-hours minus report/poster/demo — NOT against a funded startup. For
every FANTASY, propose the largest slice of it that would be REALISTIC.

Give an hours estimate for every NOW milestone and total them. If the total exceeds the budget,
say so in the first line of your answer — that is the most useful thing you can tell us.

Remember both failure modes: dull milestones lose marks, and impossible ones lose more.
```

## Response

**BUDGET VERDICT (first line, as requested): the NOW plan totals 94.75 h against the ~100 h that remains after 60 h of report/poster/demo/integration overhead — it does NOT exceed the budget, but it clears it by only 5.25 h (5%), and our own pre-mortem says a 5% margin is the failure mode, not the plan. Drop milestone N5b (share-route hardening, 8.75 h) to restore a 14 h margin; that is the single most useful sentence in this document.**

Method note: every repository fact below was re-grepped against the working tree today (2026-09-13) by me — file paths, line numbers and row counts are first-hand. No market page was re-fetched this session (WebSearch budget was already exhausted in the adjudication run); every market claim is carried forward from the adjudication with its attribution intact and is marked as such. Where I could not verify, I write **unknown**.

Two corrections to the brief, both first-hand, both scope-relevant, are flagged inline at N4 and N2.

---

## BEFORE — Project 1a (our own run logs only)

**B1. We wrote and executed a functional test suite against an inherited codebase.**
Web: 32 tests, 31 PASS / 1 FAIL. Backend: 18 cases, 18 PASS. These are the tests *we* authored. The inherited suite's 1,095/1,096 in 3.6 s is the upstream team's result and appears nowhere on our poster.

**B2. We designed and executed an adversarial/security pass.**
Web: 44 executed, 33 PASS / 11 FAIL. Backend: 25 executed, 18 PASS / 7 FAIL. 18 recorded FAILs.

**B3. We triaged the failures to distinct source defects and costed them.**
18 FAILs collapse to 17 distinct defects; all 17 re-confirmed present in the working tree on 2026-09-13; the audit found an 18th. Competent fix + regression-test estimate: 24.25 h. The 18th is the worst of them: `backend/api/inventory_recommender.py` is 245 lines and `grep -n "validate\|verify\|check"` returns zero hits, while `RecipeRecommendationModal.tsx` renders the model's unchecked claims directly — `{recipe.reason}` at :298, the score at :303-307, and the expiring-ingredient names at :328-330 (all four confirmed by me today).

**B4. We corrected our own findings rather than defending them — the methodological deliverable.**
Three reversals, all re-verified today: (a) most P1a "security tests" are source-text greps, not executed attacks, and must be reported as such; (b) the headline IDOR is probably a system-level false positive — `shopping_list_items` has no `user_id` column and RLS enforces ownership through the parent list, so the fix the failing test demands would query a column that does not exist; (c) the real UC20 defect is better than the claimed one — `web/src/app/api/inventory/transfer/route.ts` never inspects affected row counts (:98 checks only `checkError`; the DELETE path discards its result), so it returns `success: true` with a `transferred_count` for transfers that did not happen, after the inventory row was already inserted. Silent data loss. Separately confirmed today: `web/src/app/api/shopping-lists/share/route.ts` builds a bare anon client, never calls `auth.getUser`, inserts on a body-supplied `shoppingListId`, and does `expiryDate.setDate(expiryDate.getDate() + expiryDays)` unbounded — and `shopping_list_shares` appears in **no** file under `supabase/migrations/` (13 migrations, listed today): no table, no RLS, no policy.

**B5. We surveyed the market first-party and ran a pre-mortem on ourselves.**
14 live products verified by direct fetch on 2026-09-13 (adjudication record, not re-fetched by me today), including one — "Use It Up: Pantry Recipes", App Store id 6775112024, v1.0.8 — that wounds our differentiation claim and is reported as wounding it. The pre-mortem named the week-1 decision that causes failure (treating the deliverable as a panel, not a number) and its top prevention by failure-prevented-per-hour: freeze the claims before the code.

*Honest gap to state on the poster: individual team biographies were not collected. What the repository proves is what we have **demonstrated** (tests, adversarial design, evidence discipline, technical writing), not what any of us **owns** as a skill. We have not yet shipped a production change to this Next.js app, written a Supabase migration, or changed the FastAPI recommender. The TypeScript/FastAPI fluency visible in this repository is the upstream team's (467 commits, ending 2025-12-07).*

---

## NOW — Project 2 (this month)

Direction: **THE RECEIPT.** Today the app prints a match percentage in 2xl bold at `RecipeRecommendationModal.tsx:304` that comes from `RecommendedRecipe.match_score` (`inventory_recommender.py:51` — confirmed today, the field is model-authored) and no line of our code recomputes it. The "Scoring Guidelines" at `inventory_recommender.py:159-162` are English sentences addressed to a language model. We move them into arithmetic and publish the terms.

| # | NOW milestone | Hours |
|---|---|---|
| N1 | Claim freeze, one-command environment, harness skeleton | 12.0 |
| N2 | Deterministic scorer as a pure module, property-tested | 24.0 |
| N3 | The receipt on screen + authenticated server-side ranking | 22.0 |
| N4 | M0 harness, recorded baseline, correctability measure | 18.0 |
| N5 | Security and data-integrity floor (N5a 10.0 + N5b 8.75) | 18.75 |
| | **Total** | **94.75** |

Against 160 h − 60 h fixed overhead (report 24, poster 12, demo 10, integration/merge/review/meeting 14) = **100 h. Margin: 5.25 h.**

**N1 — Claim freeze, reproducible environment, harness skeleton (12 h).**
Write the Results paragraph on day 2 with numeric blanks, and beside each blank the exact query or harness invocation that fills it; delete any sentence whose query does not exist. Commit it. In the same milestone, land one committed setup path (`make dev` / devcontainer + a seeded local Supabase) so environment setup happens once in public instead of four times in private — P1a already diagnosed that defect and the pre-mortem shows it eating the month. Includes the empty harness that N2/N4 fill.

**N2 — Deterministic scorer, pure module, property-tested (24 h).**
Port `inventory_recommender.py:159-162` from prompt prose into a pure function over `(recipe_ingredients, inventory_rows, today)` returning `{total, line_items[]}` where each line item is `(inventory row id, ingredient name, expiry date, points, rule)`. Coverage half reuses `web/src/utils/inventory/recipeMatch.ts` (I read it today: pure, dependency-free, set membership on `ingredient_id`). Expiry half is a published integer table, Grocy's due score cited in a code comment, with its "20 points per expired ingredient" term **deliberately set to zero** — a food-safety position we defend, not an oversight. Property tests: every name in a line item resolves to a row in the input; total equals the sum of line items; permuting input order does not change output.
*Scoping correction, first-hand:* the corpus is real and exhaustively enumerable — `backend/dataset/recipes-supabase.csv` parses to exactly **50 rows**, `ingredients-supabase.csv` to **448**, and `recipe_ingredient_map-supabase.csv` exists, so the 50×10 = 500 offline cell count in the mission statement is sound.

**N3 — The receipt on screen, and the ranking moved server-side (22 h).**
Render the line items beneath the score in `RecipeRecommendationModal.tsx` (the UI contract already exists at :298, :303-307, :328-330), each line correctable in one tap, with Gemini demoted from judge to the prose describing a ranking it was handed. Includes closing the unauthenticated client→FastAPI call at `web/src/app/dashboard/inventory/page.tsx:141` (confirmed today: a bare `fetch` to `${BACKEND_URL}/inventory-recommend` with no auth header), which today spends our Gemini quota for anyone who knows the URL.

**N4 — M0 harness, recorded baseline, correctability measure (18 h).**
Offline: across 50 recipes × 10 seeded pantries = 500 recommendations, displayed total equals the sum of displayed line items in 500/500, and ordering is byte-identical across 20 shuffles of inventory input order. Baseline: the same harness against today's build, responses snapshotted to JSON so the baseline is auditable and never needs re-running. Correctability: after one flagged line is corrected, the recorded fraction of the 500 rankings whose order changes — the non-tautological half, which no amount of careful coding can guarantee in advance.
*Scoping correction, first-hand, and it changes a number on the poster:* the claim "a baseline of 0/500 recorded by the same harness against today's build" **cannot be produced as written.** `InventoryRecommendRequest.num_recipes` is `Field(default=5, ge=1, le=10)` — today's build returns at most 10 recommendations per pantry, so 10 seeded pantries yield at most 100, not 500. State the baseline in its reproducible form: *0 of 100 displayed scores decompose into line items, and across 3 repeat runs of the same 10 pantries the returned recipe sets and scores disagree at rate X* — with X measured, not asserted. That costs roughly 100-300 live Gemini calls, once, archived.

**N5 — Security and data-integrity floor (18.75 h).**
*N5a (10 h), on the receipt's critical path:* reject non-positive and non-finite quantities at the write (`quantity || 1` at `transfer/route.ts:65, :80, :167` against `user_inventory.quantity DECIMAL(10,2) NOT NULL DEFAULT 1` with no CHECK — negatives persist and 0 silently becomes 1, so the receipt would print points for food that isn't there); change the restock merge at `transfer/route.ts:66` from `item.expiration_date || existingItem.expiration_date` to the earlier of the two (confirmed today — the incoming date currently overwrites the stored one while quantities are summed, so fresh spinach on old spinach makes the whole aggregate row look fresh, and a receipt printing that date would overstate freshness); check affected row counts in the transfer route so `success: true` stops being returned for writes that did not happen.
*N5b (8.75 h), not on the critical path:* `share/route.ts` — write the missing migration for `shopping_list_shares`, `ENABLE ROW LEVEL SECURITY` plus a policy, then `auth.getUser`, then the ownership query on `shoppingListId`, then bound `expiryDays`.

---

## Classification of every NOW milestone

Judged against 160 person-hours minus 60 h of report/poster/demo/integration — four graduate students at ~10 h/week, not a funded team.

| # | Verdict | Why, in one sentence |
|---|---|---|
| N1 | **REALISTIC** | It is writing and configuration, not research; it is the pre-mortem's highest-yield prevention, and skipping it is what turns the other four milestones into the 29-of-160-hours scenario. |
| N2 | **REALISTIC** | The scoring rules already exist as English at `inventory_recommender.py:159-162` and the coverage half already exists as tested, dependency-free code in `recipeMatch.ts`, so this is a port plus an integer table, and it is the only milestone whose difficulty we can bound in advance. |
| N3 | **REALISTIC** | The UI contract, the data assembly and the render sites already exist; the genuine unknown is the one-tap correction write path, which is why 6 of the 22 h are allocated to it and why N4's correctability measure is the thing that would expose a shortcut. |
| N4 | **STRETCH** | The offline half runs in seconds over a corpus we can enumerate exhaustively and is REALISTIC on its own; the recorded live baseline depends on ~100-300 Gemini calls against a non-deterministic endpoint, which is the part that slips. *Largest realistic slice if it slips:* publish the offline 500/500 and 20-shuffle results in full, and report the baseline as a single archived 10-pantry × 3-run snapshot with the disagreement rate computed from it — one run, recorded once, never re-run. |
| N5 | **STRETCH as a whole; N5a alone is REALISTIC** | N5a is three bounded edits to one file that the receipt's honesty actually depends on; N5b is our first-ever Supabase migration plus an RLS policy plus an auth refactor, attempted by a team that has never written a migration in this repository, and its 8.75 h estimate is the least evidenced number in this document. *Largest realistic slice of N5b:* write the migration and the RLS policy only (~4 h), which converts "no defence exists" into "a defence exists that the route does not yet use", and report the remaining auth/ownership/bounds work as known-open with the file and line named — the honest version, and it returns 4.75 h to the margin. |

**No NOW milestone is FANTASY, by construction — we removed them before writing the list.** The three the team will be tempted to re-add mid-month, and the largest realistic slice of each:

| Tempting addition | Verdict | Largest realistic slice |
|---|---|---|
| Uncertainty-aware ranking ("probability the item is still present") | **FANTASY** | The schema forbids it: `20251129030000_user_inventory.sql` has `UNIQUE (user_id, ingredient_id, location)` and sums quantities into one row, so there are no lots, no purchase dates and no consumption log to condition on. Realistic slice: ship one honest flag — "this item's quantity was last confirmed N days ago" — computed from `updated_at`, with no probability claimed. And say **"item"**, never "lot". |
| A user study showing the receipt changes what people cook | **FANTASY** | The nearest published trial (JMIR PMC9482070) ran 6 students for a month and found no change; that is our entire budget spent on measurement alone, with IRB on top. Realistic slice: 4 scripted walkthroughs with teammates on the seeded pantries, reported as usability observations with the word "study" nowhere near them. |
| A verification gate that checks every sentence the model writes (Candidate 2's `verifyExplanation`) | **FANTASY this month** | It needs a mutation corpus, an injector, and a suppression UI on top of everything in N2-N4, and it competes directly with the receipt for the same hours. Realistic slice: since N2 already resolves every line item to an input row, hard-suppress the `expiring_ingredients_used` render at `RecipeRecommendationModal.tsx:328-330` whenever a name does not resolve — roughly 2 h, folded into N3, delivering the safety property without the apparatus. |

---

## FUTURE — Project 3

**P1. Move food safety from prose into code.** `inventory_recommender.py:157` reads `5. **NEVER**: Do not recommend recipes that ONLY use ❌ EXPIRED items` — a sentence addressed to a model, not a code path, while expired rows are injected at :89 as `(EXPIRED N days ago) ❌`. Replace it with an enforced filter, and resolve the open policy question of what a date label on screen commits us to (regulator guidance: **unknown**, not retrieved).

**P2. Per-purchase lots.** Add the table the current schema forbids — per-lot quantity, purchase date, expiry, provenance — replacing the summing UNIQUE constraint. This is the precondition for every remaining item on this list, and the precondition for ever writing the word "lot" in our own copy.

**P3. Uncertainty-aware ranking on top of lots plus a correction log.** The emptiest cell in our market survey (differentiation 3, fit 1 today); the vendor evidence that the problem is real is Plan to Eat's own post-mortem — "There is no way for your real inventory and your Plan to Eat inventory to ever remain synchronized" (adjudication record, verified 2026-09-13, not re-fetched by me).

**P4. The verification gate, fully built.** Every ingredient an explanation asserts, checked against the 448-row catalog and the caller's own `user_inventory` read under RLS, with suppression made visible rather than hidden — with the mutation corpus and injector that make the ≥49/50 detection claim testable.

**P5. The measurement Project 2 cannot afford.** A within-subject evaluation of whether a checkable receipt changes cooking choices, powered against the null result the nearest published trial actually found.

**Open question we should carry forward, unresolved and labelled:** whether "Use It Up" (App Store id 6775112024) computes its per-card "why this dish" from pantry rows and dates or only from a WHOOP recovery signal. Its v1.0.5 note ties the explanation to recovery, its iTunes payload carries no `sellerUrl`, and no first-party text settles it. **Unknown.** Our surviving claim is written to be true either way: no product shows a rationale *computed from, and checkable against, the specific inventory rows and dates that produced the ranking*.
