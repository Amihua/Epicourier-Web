# D3 — Milestones: Before / Now / Future

**Prompt:** P09 · **Run date:** 2026-09-13 · **Model:** Claude Opus 5 (1M context), `claude-opus-5[1m]`

Every NOW milestone carries an hours estimate and a REALISTIC / STRETCH / FANTASY verdict judged against 160 person-hours *minus* report, poster and demo. The budget verdict is the first line of the answer, by instruction.

---

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