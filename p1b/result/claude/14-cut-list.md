# The Cut List — the order of sacrifice, decided now

**Prompt:** C7 (ours) · **Run date:** 2026-09-13 · **Model:** Claude Opus 5 (1M context), `claude-opus-5[1m]`

P09 sorts milestones while the month still looks long. What actually happens is that week 3 arrives and something has to go. This decides the order now, with a dated trigger for each cut and — the part that makes it enforceable — the exact poster sentence that has to come off when each cut fires.

---

**BUDGET VERDICT (first line, as requested): the irreducible core is 54.00 h and it does NOT exceed the budget — it fits inside the 100 h of feature capacity with 46.00 h to spare. The finding is therefore the inverse of the feared one: nothing essential is at risk from the budget. What is at risk is that 40.75 h of the current 94.75 h plan is optional work being defended at a 5.25 h margin, so in week 4 the optional work will be defended and the core will be what gets rushed. The cut list below exists to make that impossible by deciding the order today.**

Method note: every repository fact used to price a cut was re-grepped by me in the working tree today (2026-09-13). Confirmed first-hand: `inventory_recommender.py` is 245 lines and `grep -c "validate\|verify\|check"` returns **0**; `match_score: int  # 0-100` at :50 and `num_recipes: int = Field(default=5, ge=1, le=10)` at :42; "## Scoring Guidelines:" at :159 with the +15/+10 prose at :160-161; `RecipeRecommendationModal.tsx` renders `{recipe.reason}` at :298 and `{recipe.match_score}%` at :304; `inventory/page.tsx:141` is a bare `fetch(\`${BACKEND_URL}/inventory-recommend\`)`; `transfer/route.ts` writes `quantity: item.quantity || 1` and `expiration_date: item.expiration_date || existingItem.expiration_date` on the merge path, and the delete path discards its result; `share/route.ts:9` builds the client with no `auth.getUser` anywhere in the file and does `expiryDate.setDate(expiryDate.getDate() + expiryDays)` at :20 on a body-supplied `expiryDays = 7` (:15); `shopping_list_shares` appears in **0 of 13** files under `supabase/migrations/`. Corpus re-parsed as CSV today: **50** recipes, **448** ingredients, **528** map rows — the 50 × 10 = 500 offline cell count is sound.

---

## THE CALENDAR THE CUTS ARE PINNED TO

| | Dates | Feature hours available |
|---|---|---|
| W1 | Mon 2026-09-14 – Sun 2026-09-20 | ~33 |
| W2 | Mon 2026-09-21 – Sun 2026-09-27 | ~33 |
| W3 | Mon 2026-09-28 – **Sun 2026-10-04 (FEATURE FREEZE 23:59)** | ~34 |
| W4 | Mon 2026-10-05 – Sun 2026-10-11 | **0 — report, poster, demo, integration only** |

160 h total − 60 h overhead = 100 h of feature capacity, and all 100 of it lives in W1–W3 (40 h/week × 3 = 120, minus ~20 h of overhead that must land early: report skeleton, poster draft, weekly merge). W4 is the pre-mortem's "26 h of report written in the last 48 hours" scenario made structurally impossible. **A milestone not merged to main by 2026-10-04 23:59 is cut by definition, whether or not its trigger fired.**

Standing cut checkpoint: **Saturday 18:00, every week (Sep 20, Sep 27, Oct 4), plus Wednesday 18:00 gates on Sep 30 and Oct 7.** One person reads the burn-down aloud, the triggers below are checked in order, and any cut that fires is executed *and its poster sentence deleted in the same sitting*. No cut is ever discussed off-checkpoint.

Planned cumulative feature burn against the post-Cut-1 plan of 86.00 h: **W1 ≤ 29 h, W2 ≤ 58 h, W3 ≤ 86 h.**

---

## THE STRICT CUT LIST — first to last

Ordered by inverse load on the single number we are publishing. Cut 1 is the cheapest thing to lose; Cut 10 is the last thing standing before the core.

### CUT 1 — N5b, the share-route hardening (8.75 h) → margin 5.25 → **14.00**

**What is cut.** The whole of N5b: the missing `shopping_list_shares` migration, `ENABLE ROW LEVEL SECURITY` plus policy, the `auth.getUser` refactor of `share/route.ts`, the ownership query on `shoppingListId`, the `expiryDays` bound.

**Still honestly claimed.** Everything P1a already earned. The defect is *found, evidenced, reproduced, and re-confirmed on 2026-09-13* — an unauthenticated route inserting on a body-supplied id into a table that has no migration, no RLS and no policy in 13 migration files, with an unbounded expiry. That is a finding, and findings are the P1a deliverable. We report it as **found and not fixed, with the fix costed at 8.75 h and the reason we declined stated**: it is our first Supabase migration, our first RLS policy and an auth refactor, on a route the receipt does not touch.

**The poster must STOP saying:** ~~"We closed the unauthenticated share route and added the missing `shopping_list_shares` table with row-level security."~~ Replace with: "We found it, proved it, and priced it at 8.75 h; we did not fix it, because it is not on the receipt's path."

**Trigger.** **Already fired, 2026-09-13.** Condition: at plan freeze, margin < 10% of feature budget. 5.25/100 = 5.25%. This cut is not conditional and is not revisited — it is executed before week 1 begins.

---

### CUT 2 — N4's live Gemini baseline, reduced to one archived snapshot (3.5 of 6.0 h) → **17.50**

**What is cut.** The repeatable live-baseline harness. What survives is one run: 10 seeded pantries × 3 repeats against today's build, responses snapshotted to JSON, disagreement rate X computed from that file, never re-run. ~100 calls, once.

**Still honestly claimed.** "0 of 100 displayed scores decompose into line items" and a measured X — from an archived artifact any reader can open. The brief's own scoping correction stands and is now the published form: `num_recipes` is capped at `le=10` (`inventory_recommender.py:42`, confirmed today), so 10 pantries yield at most 100 baseline recommendations, not 500.

**The poster must STOP saying:** ~~"A baseline of 0/500 recorded by the same harness against today's build."~~ Replace with: "A baseline of 0/100, recorded once on <date> and archived as JSON; the 500-cell figure is the offline determinism corpus, not the baseline."

**Trigger.** **Sat 2026-09-27, 18:00.** Fires if the committed baseline script has not yet made one successful authenticated live call and written its JSON, **or** cumulative feature hours > 58 with N2 not merged green on main.

---

### CUT 3 — N3's relocation of ranking to the server (4.0 h) → **21.50**

**What is cut.** The new authenticated route that assembles inventory and runs the N2 scorer server-side. Ranking stays where it is computed today; the N2 module is imported and run client-side over data the client already holds. **The 2.0 h auth header on `inventory/page.tsx:141` is NOT cut** — it moves into the core (Cut 3 keeps it).

**Still honestly claimed.** The scorer is deterministic, pure and tested, and the number on screen is produced by it. Determinism does not depend on where it runs, and the 500-cell offline proof runs the same module. We also still claim the quota leak is closed, because it is.

**The poster must STOP saying:** ~~"Ranking is computed server-side under the user's own credentials; the client only renders."~~ Replace with: "Ranking is computed by a pure module with no network access; it currently runs in the client. The model no longer ranks anything."

**Trigger.** **Wed 2026-09-30, 18:00.** Fires if no route handler that accepts an authenticated request and returns a list ranked by the N2 module is merged to main.

---

### CUT 4 — the receipt's second and third surfaces (2.0 h) → **23.50**

**What is cut.** Rendering the receipt anywhere except `RecipeRecommendationModal.tsx`. No receipt on the inventory card, none in the dashboard list.

**Still honestly claimed.** The receipt exists, in the one place the score is presented in 2xl bold (:303-307). Every claim about decomposition is about that surface and says so.

**The poster must STOP saying:** ~~"Every score in the app opens into its terms."~~ Replace with: "The recommendation score opens into its terms."

**Trigger.** **Wed 2026-09-30, 18:00.** Fires if the receipt has not rendered end-to-end from real data on a machine that is not its author's.

---

### CUT 5 — N2's property-based test generator (4.0 h) → **27.50**

**What is cut.** The generator (hypothesis / fast-check) and its shrinking. Replaced by 12 hand-written table-driven cases over the committed fixtures, asserting the same three properties on fixed inputs.

**Still honestly claimed.** The three invariants are still asserted and still green: every line item resolves to an input row; total equals the sum of line items; permuting input order does not change output. The third is additionally proven at system level by N4's 20-shuffle run, which is the stronger evidence anyway. The corpus is exhaustively enumerable — 50 recipes, 448 ingredients, 528 map rows, re-parsed today — so "exhaustive over the corpus" is a truthful and *available* phrase where "property-tested" is not.

**The poster must STOP saying:** ~~"The scorer is property-tested."~~ Replace with: "The scorer's three invariants are asserted over 12 cases and over all 500 offline cells."

**Trigger.** **Thu 2026-10-01, 18:00.** Fires if the generator has not produced one green CI run, or has been red for more than 48 h.

---

### CUT 6 — N5a's affected-row-count checks in the transfer route (3.5 h) → **31.00**

**What is cut.** Inspecting affected row counts so `success: true` stops being returned for writes that did not happen (`transfer/route.ts` — :98 checks only `checkError`, the DELETE path discards its result; both re-confirmed today).

**Still honestly claimed.** This is the P1a reversal we are proudest of: the *real* UC20 defect is better than the one we originally claimed, and we corrected ourselves in public. It is found, evidenced, and re-confirmed in the working tree on 2026-09-13. Not fixed, priced at 3.5 h, and the reason stated: it is a silent-data-loss bug on the shopping-list→inventory path, not on the receipt's read path.

**The poster must STOP saying:** ~~"We fixed the silent data loss in the inventory transfer route."~~ Replace with: "We found the silent data loss that our own first report had mis-described, and we say so."

**Trigger.** **Fri 2026-10-02, 18:00.** Fires if cumulative feature hours > 78 and the transfer-route branch is not merged.

---

### CUT 7 — the live baseline, entirely (remaining 2.5 h) → **33.50**

**What is cut.** All live Gemini calls. No baseline number from today's build at all.

**Still honestly claimed.** The baseline becomes a *source-level* claim, which is stronger than it sounds and costs zero hours: `match_score` is model-authored (`inventory_recommender.py:50`), the scoring rules are English prose addressed to a language model (:159-161), and `grep -c "validate\|verify\|check"` over the 245-line file returns **0**. No line of code anywhere recomputes or checks that number. We can state that as fact with a file, a line and a command a reader can re-run — we simply cannot state a *rate*.

**The poster must STOP saying:** ~~"Across 3 repeat runs the current build's scores disagree at rate X."~~ Replace with: "The current build's score is model-authored and unchecked: `inventory_recommender.py:50`, and zero validation calls in 245 lines."

**Trigger.** **Fri 2026-10-02, 18:00.** Fires if the reduced snapshot from Cut 2 has still not been produced, or any live-call path has failed at two consecutive checkpoints.

---

### CUT 8 — N4's correctability measure (3.0 h) → **36.50**

**What is cut.** The recorded fraction of the 500 rankings whose order changes after one flagged line is corrected.

**Still honestly claimed.** Determinism and decomposition — the tautological half, which is still the whole of the receipt's promise. We lose the half that no careful coding can guarantee in advance, and we say *exactly that* rather than letting its absence pass unnoticed: "we did not measure whether correcting a line changes what the user is shown; we state it as the first thing Project 3 should measure, and the harness is committed and ready to measure it."

**The poster must STOP saying:** ~~"Correcting one line changes the ranking in N% of cases."~~ Replace with: "Correction is wired; its effect on ranking is unmeasured, and that is the open question we hand forward."

**Trigger.** **Sun 2026-10-04, 12:00.** Fires if the correction write path is not merged and writing.

---

### CUT 9 — N3's one-tap correction write path (6.0 h) → **42.50**

**What is cut.** The whole correction affordance. The receipt becomes read-only. (Cut 8 must already have fired — correctability cannot outlive the mechanism it measures, which is why it is cut first.)

**Still honestly claimed.** The receipt: a total, its line items, each with an inventory row id, an ingredient name, an expiry date, points and the rule that awarded them — all decomposing to the displayed total in 500/500 cells, byte-identical across 20 shuffles. The user can *audit* every number. They cannot yet *fix* one. That is a smaller claim and an entirely honest one, and it is still more than the app does today, where the number comes from a prompt.

**The poster must STOP saying:** ~~"Every line is correctable in one tap."~~ Replace with: "Every line is inspectable; correction is the next milestone and the scorer already takes corrected inventory as input."

**Trigger.** **Sun 2026-10-04, 12:00.** Fires if no merged PR makes a corrected line persist.

---

### CUT 10 — N5a's earlier-of-two expiry merge (3.5 h) → **46.00**

**What is cut.** Changing `item.expiration_date || existingItem.expiration_date` (`transfer/route.ts:66`, confirmed today) to the earlier of the two.

**Still honestly claimed.** The receipt prints the expiry date it read from the row, and the points that date earns under the published table. It is arithmetically faithful to the stored data. We then disclose, in one sentence on the poster and one paragraph in the report, that **the stored data can itself be wrong**: restocking overwrites the stored expiry with the incoming one while summing quantities, so fresh spinach on old spinach makes the aggregate row look fresh. Found, evidenced, priced at 3.5 h, not fixed. This is the cheapest cut on the list to *disclose* (≈0.5 h of writing) and the most expensive to leave silent, because silence would make the receipt's freshness claim untrue rather than merely incomplete.

**The poster must STOP saying:** ~~"The dates the receipt prints are the true earliest expiry for that ingredient."~~ Replace with: "The receipt prints the stored expiry date; we found and did not fix a restock merge that can overwrite it with a later one, and here is the line number."

**Trigger.** **Sun 2026-10-04, 23:59 — feature freeze.** Unmerged is cut, automatically, no discussion.

---

## THE IRREDUCIBLE CORE — **54.00 h**

What remains after all ten cuts. Nothing here has a trigger, because nothing here may be cut.

| Item | h | Why it cannot go |
|---|---|---|
| **N1a** Claim freeze: Results paragraph with numeric blanks, each blank beside the exact query that fills it; sentences with no query deleted; committed by **2026-09-15** | 3.0 | The pre-mortem's top-ranked prevention by failure-prevented-per-hour. It is also what makes this cut list executable — you cannot delete a poster sentence on schedule unless the sentences exist in week 1. |
| **N1b** One-command environment: `make dev` / devcontainer + seeded local Supabase | 6.0 | P1a diagnosed this defect; the failure scenario spent it four times in private. It is the only line item that pays for itself in the same month, and the seeded fixtures are also the demo data — which is how the 12 h of "making demo data look real" never happens. |
| **N1c** Harness skeleton | 3.0 | N4's 500-cell run has to land somewhere, and it has to exist before the code it measures, or it will be written to agree with the code. |
| **N2a** Pure scorer: `(recipe_ingredients, inventory_rows, today) → {total, line_items[]}`; coverage half ported from `recipeMatch.ts` (188 lines, pure, dependency-free) | 8.0 | This is the project. |
| **N2b** Expiry half as a published integer table, Grocy's due score cited in a code comment, the "20 points per expired ingredient" term deliberately zero | 6.0 | Without the published terms there is no receipt, only a different opaque number. The zeroed term is a food-safety position we defend, and defending it in public is a deliverable. |
| **N2c** Fixtures and corpus loader over 50 recipes / 448 ingredients / 528 map rows | 4.0 | Feeds N4 and the demo both. |
| **N2e** Integration and review of the scorer | 2.0 | |
| **N3a** Render line items beneath the score in `RecipeRecommendationModal.tsx` (contract exists at :298, :303-307, :328-330) | 8.0 | An unpublished receipt is a unit test. |
| **N3b** Auth on the client→FastAPI call at `inventory/page.tsx:141` | 2.0 | It spends our Gemini quota for anyone who knows the URL, today. Two hours, and it is the only security fix that survives every cut — it is also the one the demo would otherwise expose live on a projector. |
| **N4a** Offline: 50 recipes × 10 pantries = 500 cells, displayed total equals sum of displayed line items, 500/500 | 7.0 | The number on the poster. |
| **N4b** 20 shuffles of inventory input order, ordering byte-identical | 2.0 | The claim that separates a deterministic scorer from a lucky one. |
| **N5a1** Reject non-positive and non-finite quantities at the write (`quantity \|\| 1` at `transfer/route.ts:65, :80, :167` against `DECIMAL(10,2) NOT NULL DEFAULT 1` with no CHECK) | 3.0 | Negatives persist and 0 silently becomes 1, so the receipt would print points for food that is not there. This is the one security item the receipt's honesty is literally made of. |
| **TOTAL** | **54.00** | |

**54.00 h of feature work + 60 h of report/poster/demo/integration = 114 h of 160. Slack: 46 h.**

What the core alone lets the poster say, with every blank filled by a committed query:

> The app prints a match percentage in 2xl bold that a language model wrote and no line of code checks — `inventory_recommender.py:50`, and zero validation calls in 245 lines. We replaced it with arithmetic and published the terms. Across 50 recipes × 10 pantries, the displayed total equals the sum of the displayed line items in 500 of 500 cases, and the ordering is byte-identical across 20 shuffles of the input.

That paragraph survives all ten cuts. Every sentence in it has a query behind it. It is a number, not a panel.

---

## NOT ON THIS LIST, DELIBERATELY

**Never cut, at any hours remaining:** all 12.0 h of N1. If the team is far enough behind that N1 looks cuttable, the correct response is to cut Cuts 8–10 early, not to cut the thing that makes cutting possible.

**Never added, at any hours remaining** — the pre-mortem's 26 h of unrequested visible features, named now so that adding one is a visible violation rather than a judgment call: the Waste Warrior badge, the explanation-verbosity setting, the animated timeline, and anything else that renders. Adding a visible feature after 2026-09-20 requires cutting a named item from the core, and there is nothing in the core that can be cut.

**Not cuttable, but re-shaped:** the 60 h of overhead. The demo is a 3-minute recorded screen capture of the harness run and one receipt, seeded from the same fixtures as N2c — not a live click-through, which is what turns 10 h into 22.

**If the core itself slips after 2026-10-04:** there is no Cut 11. The last lever is *N*, not honesty — shrink the corpus from 50 × 10 to 50 × 3 and print the smaller number with the same query beside it. "150 of 150" is a true sentence. A 500 we did not run is not.