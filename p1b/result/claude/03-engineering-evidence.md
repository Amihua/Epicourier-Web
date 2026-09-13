# D3 (part) — Engineering Evidence: what Project 1a actually bought us

**Prompt:** C3, *Make Project 1a pay* (ours, not one of the twelve starters) · **Run date:** 2026-09-13 · **Model:** Claude Opus 5 (1M context)

A Project 1a finding is only evidence for Project 1b if the defect is **still there**. This audit re-derived every number from the run logs and re-grepped every defect against the current working tree. It was told explicitly that weakening our own claims was a valid and desirable outcome — and it did weaken two of them.

> **The three results that changed our plan.** (1) Our headline cross-user IDOR is probably a false positive at system level. (2) Most of our P1a web "security tests" are source-text greps, not executed attacks. **Correction, 2026-09-13:** an earlier draft of this file said P1a never disclosed that. It did — `ATTACK-RESULTS.md` ¶1 and `final-traceability.md:12` both state the static/runtime split explicitly. What is true is narrower: the caveat exists in the source artifacts and was dropped from the **summary tables** that quote the failure counts, including ours. (3) The real bug under UC20 is better than the one we claimed: RLS blocks the cross-user write, but the route never checks how many rows it touched, so it reports success for transfers that did not happen — while the inventory row *was* inserted. That is silent data loss.

---

# Project 1a → 1b Engineering Evidence Audit

**Repository:** `the repository root`
**Audit date:** 2026-09-13. Every claim below was re-derived from the files, and every defect was re-grepped against the current working tree.

---

## 1. The 20 canonical use cases (verbatim)

Source: `p1a/use-cases/final-use-cases.md`. The **Heading** column is the `## UC…` line verbatim; the **Name** column is the `| **Name** |` table row verbatim. Note that **three** of them differ slightly between the two (UC5, UC6, UC12) — reproduced exactly as the repo states them, not normalised. *Corrected 2026-09-13: this sentence said "five" while naming three. Re-checked against `p1a/use-cases/final-use-cases.md`: exactly three headings disagree with their `**Name**` row — UC5 ("Request a personalized meal plan" / "Request personalized meal plan"), UC6 ("Schedule a meal" / "Schedule meal"), UC12 ("Join a wellness challenge" / "Join wellness challenge"). The count is three.*

| UC | Heading (verbatim, line) | `**Name**` field (verbatim, line) |
|---|---|---|
| UC1 | `UC1: Register account` (:5) | Register account (:9) |
| UC2 | `UC2: Sign in` (:18) | Sign in (:22) |
| UC3 | `UC3: Browse recipes` (:31) | Browse recipes (:35) |
| UC4 | `UC4: View recipe details` (:44) | View recipe details (:48) |
| UC5 | `UC5: Request a personalized meal plan` (:57) | Request personalized meal plan (:61) |
| UC6 | `UC6: Schedule a meal` (:70) | Schedule meal (:74) |
| UC7 | `UC7: Track meal completion` (:83) | Track meal completion (:87) |
| UC8 | `UC8: Review nutrient progress` (:96) | Review nutrient progress (:100) |
| UC9 | `UC9: Set nutrient goals` (:109) | Set nutrient goals (:113) |
| UC10 | `UC10: Export nutrient history` (:122) | Export nutrient history (:126) |
| UC11 | `UC11: Review achievements` (:135) | Review achievements (:139) |
| UC12 | `UC12: Join a wellness challenge` (:148) | Join wellness challenge (:152) |
| UC13 | `UC13: Review inventory` (:161) | Review inventory (:165) |
| UC14 | `UC14: Add inventory item` (:174) | Add inventory item (:178) |
| UC15 | `UC15: Edit inventory item` (:187) | Edit inventory item (:191) |
| UC16 | `UC16: Remove inventory items` (:200) | Remove inventory items (:204) |
| UC17 | `UC17: Get inventory-based recipe suggestions` (:213) | Get inventory-based recipe suggestions (:217) |
| UC18 | `UC18: Create and populate shopping list` (:226) | Create and populate shopping list (:230) |
| UC19 | `UC19: Generate shopping list from meal plan` (:239) | Generate shopping list from meal plan (:243) |
| UC20 | `UC20: Complete shopping and stock inventory` (:252) | Complete shopping and stock inventory (:256) |

The file contains no shorter per-UC abstract than these; the `**Name**` row is the repo's own one-line summary.

---

## 2. Evidence boast (poster paragraph) — strongest TRUE claim

> **We wrote 63 test functions that ran as 69 executed test cases across two runtimes, recording 18 failures that resolve to 17 distinct defects — 7 of them executed attacks against the real backend request models and prompt builder, 10 of them source-level contract assertions on the web side — against an inherited web suite that reported 1,095 passed / 1 skipped and surfaced none of them.** Our adversarial and contract suites ran on 2026-08-29: 44 Jest executions in `web/tests/p1a` (33 passed, 11 failed) and 25 Pytest executions in `backend/tests/sihao/p1a` (18 passed, 7 failed). Run in isolation, our security suites reported **10 failed of 12** on the web side and **7 failed of 7** on the backend side. Over the same codebase and on the same day, the project's original web suite reported **1,095 passed, 1 skipped, 1,096 total — zero failures — and surfaced none of them**, while the original backend suite did not even collect (`ImportError` on `conftest.py`, `ValueError: Missing key inputs argument!` — the Gemini client is constructed at import time). **59 of our 63 functions map to one of UC1–UC20; the four share-route tests map to none** — because P1a concluded the share flow is a missing 21st use case it never wrote (`p1a/traceability/final-traceability.md:91`: *"Add a distinct **Share shopping list** use case; do not silently fold this separate actor goal into UC18"*), which is itself a finding. Every FAIL is preserved as raw, re-runnable output.

> ⚠ **Corrected 2026-09-13 — three errors in one paragraph, all ours.** The boast above previously read *"63 test functions that executed 69 assertions … found 18 defects that the project's inherited 1,096-case suite did not"*, and closed *"Every one of our 63 functions is mapped to one of UC1–UC20."*
> **(1)** 69 is a count of executed **test cases**, not assertions — the derivation below says "69 executions", and Jest's `44 total` counts cases.
> **(2)** 18 is the count of recorded **FAILs**. §3's own Totals line resolves them to **17 distinct source defects** (D4 was recorded twice), and the eighteenth entry in our defect list, D11, was found by *this audit*, not by any test.
> **(3)** Four of the 63 functions map to `?`, not to a UC (`p1a/traceability/final-traceability.md:17-19` and `:28`) — and three of those four are the share-route tests this file promotes to Blocker 1.
> The paragraph also dropped the static-versus-executed caveat that this file's own lede calls mandatory. It is now carried **inside** the claim, where it cannot be quoted away.

### Exact numbers and their source files

| Number | Exact log line | File | Line |
|---|---|---|---|
| 44 web executions: 11 failed, 33 passed | `Tests:       11 failed, 33 passed, 44 total` | `p1a/evidence/own-tests/2026-08-29-web-p1a-all-with-security-raw.txt` | 1139 |
| 3 web suites: 2 failed, 1 passed | `Test Suites: 2 failed, 1 passed, 3 total` | same | 1138 |
| 25 backend executions: 7 failed, 18 passed | `7 failed, 18 passed, 1 warning in 0.15s` | `p1a/evidence/own-tests/2026-08-29-backend-p1a-all-with-security-raw.txt` | 82 |
| Web security suite alone: 10 failed, 2 passed of 12 | `Tests:       10 failed, 2 passed, 12 total` | `p1a/evidence/own-tests/2026-08-29-web-security-raw.txt` | 1124 |
| Backend security suite alone: 7 failed | `7 failed, 1 warning in 0.11s` | `p1a/evidence/own-tests/2026-08-29-backend-security-raw.txt` | 82 |
| Clean rerun, functional only: 1 failed, 31 passed of 32 | `Tests:       1 failed, 31 passed, 32 total` | `p1a/evidence/own-tests/2026-08-29-web-p1a-rerun-raw.txt` | 35 |
| Clean rerun, backend functional only: 18 passed | `18 passed, 1 warning in 0.11s` | `p1a/evidence/own-tests/2026-08-29-backend-p1a-rerun-raw.txt` | 8 |
| Inherited web suite: 1,095 passed / 1 skipped / 1,096 total | `Tests:       1 skipped, 1095 passed, 1096 total` | `p1a/evidence/baseline/original-web-tests-raw.txt` | 249 |
| Inherited backend suite: did not collect | `ImportError while loading conftest` … `ValueError: Missing key inputs argument!` | `p1a/evidence/baseline/original-backend-tests-raw.txt` | tail |
| Inherited backend suite forced with a dummy key: 24 failed, 19 passed, 1 skipped | `24 failed, 19 passed, 1 skipped, 4 warnings in 9.49s` | `p1a/evidence/baseline/2026-08-29-claude-step7-backend-raw.txt` | 5923 |

**Derivation of "63 functions → 69 executions"** (independently recomputed, and it matches the claim in `p1a/traceability/final-traceability.md`): `web/tests/p1a/inventory-behavior.test.ts` 12 + `security-attack-cases.test.ts` 12 + `use-case-contracts.test.ts` 20 = 44 web functions → 44 executions; `backend/tests/sihao/p1a/test_adversarial_inputs.py` 7 + `test_recommender_behavior.py` 12 = 19 backend functions → 25 executions (Pytest parameterisation adds 6). 44 + 19 = **63 functions**; 44 + 25 = **69 executions**; 33 + 18 = **51 PASS**; 11 + 7 = **18 FAIL**.

### ⚠️ Do not use the "1,130+ tests" figure — flagged

`README.md:54` states:

> "**Tests**: 1,130+ automated test cases covering UI interactions, gamification logic, and backend AI services (Jest/Pytest)."

**This is the previous team's inherited claim and we have no run that supports it. Do not put it on the poster, in the report, or in the video.** Three specific reasons:

1. **We never measured 1,130 of anything.** The only test-count figure our own logs produce for the inherited suite is **1,096** (`original-web-tests-raw.txt:249`, corroborated independently at `p1a/evidence/2026-08-29-web-tests-wenbo-raw.txt:249` and `p1a/evidence/baseline/2026-08-29-claude-step7-web-raw.txt:1690`).
2. **The "backend AI services" half of the claim is contradicted by our own evidence.** The original backend suite did not collect at all in our baseline, and when forced with `GEMINI_KEY=dummy-key-for-testing` it produced **24 failed, 19 passed, 1 skipped** (`2026-08-29-claude-step7-backend-raw.txt:5923`). A claim of "1,130+ passing tests including backend AI services" is not merely unverified — it is falsified by the run we performed.
3. **It would sabotage our actual result.** Our strongest finding is precisely that a large green inherited suite missed 18 real defects. Quoting the inherited number as if it were ours both borrows unearned credit and blunts the contrast that makes our 69 executions worth reporting.

If the number must appear at all, attribute it: *"the inherited README claims 1,130+ tests; our measured baseline is 1,096 web cases passing and a backend suite that does not collect."*

---

## 3. Prioritised defect list

**Legend — CONFIRMED:** re-grepped against the current working tree on 2026-09-13; the guard the test demanded is still absent and the defective expression is still present at the cited line.
**RLS column** is based on `supabase/migrations/` as it exists in this repo, plus which Supabase client each route uses:
- `web/src/utils/supabase/server.ts:7-9` — cookie-bound **anon** client ⇒ RLS runs as the signed-in user.
- `web/src/lib/supabaseServer.ts:4-6` — **`SUPABASE_SERVICE_ROLE_KEY`** ⇒ **RLS is bypassed entirely**.
- `web/src/app/api/shopping-lists/share/route.ts:9-12` — bare `@supabase/supabase-js` **anon** client with no cookies ⇒ DB role is `anon`; no `auth.uid()` policy can ever match.

| # | Defect | File : line | Test(s) that recorded FAIL | Confirmed? | Fix + regression test | RLS / DB mitigation — honest verdict |
|---|---|---|---|---|---|---|
| **D1** | Share POST performs no authentication; builds an anonymous client and inserts | `web/src/app/api/shopping-lists/share/route.ts:8-12`, `:23-31` | `attack_share_creation_requires_an_authenticated_user` | **CONFIRMED** — 0 hits for `auth.getUser|getUserIdentity` in the POST body | 2.5 h | **NO mitigation available.** `shopping_list_shares` **has no migration anywhere in `supabase/migrations/`** (repo-wide grep: the name appears only in this route and in p1a evidence/context files). There is no `ENABLE ROW LEVEL SECURITY` and no policy for it in this repo. Separately, the route runs as role `anon`, so even a correct `auth.uid()` policy could not scope it. |
| **D2** | Share POST never verifies the caller owns `shoppingListId` (IDOR candidate) | `web/src/app/api/shopping-lists/share/route.ts:15`, `:23-31` | `attack_share_creation_verifies_list_ownership` | **CONFIRMED** — 0 hits for `.eq("user_id", user.id)` in POST | 1.75 h | **NO mitigation available** (same reason as D1). This is the one finding where the "subject to RLS" caveat in `ATTACK-RESULTS.md` does **not** rescue us — and also where we cannot yet claim exploitation, because with no table migration the insert may simply 500. Honest statement: *unverifiable at the DB layer because the table is undefined in this repo.* |
| **D3** | `expiryDays` flows unvalidated into `Date.setDate()` | `web/src/app/api/shopping-lists/share/route.ts:15`, `:20` | `attack_share_creation_rejects_unbounded_expiry_days` | **CONFIRMED** — 0 hits for `expiryDays\s*[<>]=?` | 1.0 h | **No DB backstop.** `expires_at` is a timestamptz; a huge or negative value yields a permanent or already-expired link, not a DB error. |
| **D4** | Transfer marks the shopping item checked filtered **only** by item ID | `web/src/app/api/inventory/transfer/route.ts:93-96` | `attack_transfer_verifies_each_shopping_item_belongs_to_the_user` **and** `test_uc20_rejects_transfer_of_another_users_shopping_item` — *corrected 2026-09-13:* **not two independent tests.** `security-attack-cases.test.ts:45-53` and `use-case-contracts.test.ts:98-106` slice the same file between the same two markers (`"// Mark shopping item as checked"` → `"transferredItems.push"`) and assert the same string `.eq("user_id", user.id)`. It is one grep run twice; the duplication is a finding about our suite, not corroboration of the defect | **CONFIRMED** — line 96 is still `.eq("id", item.shopping_item_id);` | 2.0 h | **LIKELY MITIGATED at the DB layer — downgrade the claim.** `supabase/migrations/20251129020000_shopping_list_items.sql:77-93` gates UPDATE on `EXISTS (SELECT 1 FROM shopping_lists sl WHERE sl.id = shopping_list_id AND sl.user_id = auth.uid())`, and this route uses the cookie-bound client. **But the route ignores the 0-row outcome** (line 98 checks only `checkError`), so the real defect is a *silent half-completed transfer*, not cross-user mutation. Report it that way. |
| **D5** | Transfer undo unchecks filtered only by item ID | `web/src/app/api/inventory/transfer/route.ts:152-155` | `attack_transfer_undo_verifies_each_shopping_item_belongs_to_the_user` | **CONFIRMED** — line 155 still `.eq("id", item.shopping_item_id);` | 1.5 h | **LIKELY MITIGATED** by the same UPDATE policy. Worse than D4 in one respect: the DELETE handler does not capture the error at all (`await` with no destructure), so the failure is invisible even in logs. |
| **D6** | `item.quantity \|\| 1` — negative quantities persist; `0` is silently rewritten to `1` | `web/src/app/api/inventory/transfer/route.ts:65`, `:80`, `:167` | `attack_transfer_rejects_zero_and_negative_quantities` | **CONFIRMED** — 0 hits for `item\.quantity\s*<=\s*0` | 1.5 h | **NOT mitigated.** `user_inventory.quantity DECIMAL(10,2) NOT NULL DEFAULT 1` (`20251129030000_user_inventory.sql:15`) carries **no CHECK constraint**. RLS is row ownership, not value validation. Real, unguarded data corruption. |
| **D7** | Storage location passed through a TypeScript cast with no runtime check | `web/src/app/api/inventory/transfer/route.ts:82` (also `:57`, `:163`) | `attack_transfer_rejects_unknown_storage_locations` | **CONFIRMED** — 0 hits for `validLocations` or the literal allowlist | 1.5 h | **MITIGATED at the DB layer.** `20251129030000_user_inventory.sql:17-18` has `CHECK (location IN ('pantry','fridge','freezer','other'))`. An invalid location raises a DB error, which line 86-88 catches into `errors[]`. Report the symptom as a **misleading HTTP 200 carrying a per-item error string**. *Corrected 2026-09-13: this cell said "the ATTACK-RESULTS wording overstates this one". It does not. `ATTACK-RESULTS.md:24` reads "Medium: invalid persisted state **or database errors**" — it had already named both outcomes, and the CHECK constraint simply settles which one occurs. The charge of overstatement was itself an overstatement, against our own artifact — the exact error class this audit exists to catch.* |
| **D8** | `Number(quantity) \|\| 1` accepts negatives; `NaN` becomes `1` | `web/src/app/api/shopping-lists/[id]/items/[itemId]/route.ts:53` | `attack_shopping_item_update_rejects_negative_quantity` | **CONFIRMED** — line 53 unchanged | 1.0 h | **NOT mitigated.** `shopping_list_items.quantity DECIMAL(10,2) DEFAULT 1` (`20251129020000_shopping_list_items.sql:16`) has no CHECK. Note this route **does** verify list ownership at `:26-36`, so this is a pure *validation* defect, not an authorization one — do not file it as an authz finding. |
| **D9** | `Boolean(is_checked)` — the string `"false"` becomes `true` | `web/src/app/api/shopping-lists/[id]/items/[itemId]/route.ts:65` | `attack_shopping_item_update_does_not_coerce_false_string_to_true` | **CONFIRMED** — line 65 unchanged; 0 hits for `typeof is_checked` | 1.0 h | **NOT mitigated.** `is_checked BOOLEAN NOT NULL` accepts the coerced `true` happily. Same route already enforces ownership, so again: validation defect, not authz. |
| **D10** | Achievement `trigger` is presence-checked only; the arbitrary string is then written into `progress` JSONB | guard at `web/src/app/api/achievements/check/route.ts:67-69`; write at `:119` | `attack_achievement_check_rejects_unknown_trigger_values` | **CONFIRMED** — 0 hits for `includes(body.trigger)` | 1.25 h | **NOT mitigated — and RLS is actively bypassed here.** The insert at `:113` uses `supabaseServer`, the **service-role** client. However, `user_id` is set from the server-derived `authUserId` (`:114`), so a caller can only pollute their **own** achievement row. Genuine severity: **low** — unvalidated user input reaching a privileged write, no cross-user impact. Do not inflate it. |
| **D11** | *(found in this audit, not in the P1a record)* `shopping_list_shares` is referenced by shipped code but has **no migration, no schema, and no RLS policy** in the repo | referenced at `web/src/app/api/shopping-lists/share/route.ts:24`, `:67`; absent from all 13 files in `supabase/migrations/` | — (no test; discovered while checking RLS for D1–D3) | **CONFIRMED** — repo-wide grep finds the identifier only in that route and in p1a evidence/context text | 3.5 h | **This is the finding that makes D1–D3 honest.** We cannot say "RLS mitigates the share endpoint" and we cannot say "it is exploitable" — the table is undefined here, so the share feature is either dead on a fresh deploy or backed by an out-of-band table with unknown policies. Both are ship-blocking. |
| **D12** | `goal: str` has no `max_length`; 4,097 chars accepted straight into the Gemini call | `backend/api/index.py:41` (consumed at `:60`) | `test_attack_rejects_meal_goal_larger_than_4096_characters` | **CONFIRMED** — no `max_length` anywhere in `api/index.py` | 0.75 h | N/A — Pydantic layer, no database involved. Cost/quota amplification only. |
| **D13** | `preferences: Optional[str]` unbounded | `backend/api/inventory_recommender.py:41` | `test_attack_rejects_inventory_preference_larger_than_4096_characters` | **CONFIRMED** | 0.5 h | N/A |
| **D14** | `name: str` unbounded (512-char ingredient names accepted) | `backend/api/inventory_recommender.py:31` | `test_attack_rejects_inventory_item_name_larger_than_512_characters` | **CONFIRMED** | 0.5 h | N/A |
| **D15/16/17** | `quantity: float` accepts `0`, `-100`, and `inf` | `backend/api/inventory_recommender.py:32` | `test_attack_rejects_zero_inventory_quantity`, `…_negative_…`, `…_non_finite_…` (3 FAILs, 1 fix) | **CONFIRMED** — field is still bare `quantity: float`, no `Field(gt=0, allow_inf_nan=False)` | 1.5 h total | N/A — but note the contrast: `num_recipes` on the very next line (`:42`) **is** correctly constrained with `Field(default=5, ge=1, le=10)`. The pattern is known to the codebase; it simply was not applied. |
| **D18** | Untrusted `preferences` interpolated directly into the model prompt with no delimiter and no data/instruction boundary | `backend/api/inventory_recommender.py:138`, rendered at `:149-150` | `test_attack_prompt_delimits_untrusted_preferences_from_instructions` | **CONFIRMED** — 0 hits for `<user_preferences>` or "Treat user preferences as data" | 2.5 h | N/A. State this as a **code-level exposure**: we never ran it against a live model, so claim "the untrusted-data boundary is absent", not "we achieved prompt injection". |

**Totals:** 18 recorded FAILs → **17 distinct source defects** (D4 was recorded twice — by `attack_transfer_verifies…` and by the UC20 contract test, which are the *same assertion duplicated across two suites*; see the D4 row), plus **D11** newly found during this audit. **All 18 confirmed still present.** Estimated effort **≈ 24.25 engineer-hours (~3 days)** for competent fixes plus regression tests, assuming the fixes are batched by route as grouped above.

### Honest-scoping summary (this is the stronger result)

> ⚠ **Corrected 2026-09-13.** This section opened *"Of the ten web findings we originally labelled 'High candidate / IDOR, subject to RLS'"*. **It did not.** `p1a/evidence/own-tests/ATTACK-RESULTS.md` labels **four** of the ten web FAILs High — `:18` (**High candidate**, without the IDOR wording), `:19`, `:21`, `:22` (**High candidate / IDOR**) — while `:20`, `:23`, `:24`, `:25` and `:26` are **Medium** and `:27` is **Low/Medium**. 4 + 5 + 1 = 10. Inflating the original claim makes the correction look larger than it is, which is the same defect this section exists to correct. Regrouped below by the label we actually wrote.

**Of the four we labelled High — D1, D2, D4, D5:**

- **2 are genuinely mitigated at the database layer** and should be **downgraded** in the report: D4 and D5 are blocked by the `shopping_list_items` UPDATE policy; their real impact is silent half-completed transfers.
- **2 cannot be adjudicated at the DB layer at all**, because the table they touch does not exist in this repository: D1 and D2 — which is itself the new finding D11.

**Of the six we labelled Medium or Low/Medium — D3, D6, D7, D8, D9, D10:**

- **3 have no database backstop whatsoever** and are exactly as bad as recorded: D6, D8, D9 write unvalidated numbers and coerced booleans into columns with no CHECK constraints.
- **1 more is unadjudicable for the D11 reason**: D3 also writes to the undefined `shopping_list_shares`.
- **1 had RLS assumed where RLS is bypassed**: D10's insert uses the service-role key — but it is *less* severe than we thought, not more, because `user_id` is server-derived.
- **1 we ourselves restated wrongly in this file**: D7's DB-layer symptom is a misleading HTTP 200, not "invalid persisted state" — but ATTACK-RESULTS had already named both outcomes, so the correction is to *our* summary, not to P1a. See the D7 row.

Saying this plainly is a better P1b result than reporting four High-candidate IDORs as though the database layer had been checked. It demonstrates we verified the second layer instead of stopping at the first failing assertion. *Corrected 2026-09-13: this sentence previously said "better than claiming ten live IDORs" — we never claimed ten.*

---

## 4. The defects that MUST be fixed before this ships

> ⚠ **Reconciled 2026-09-13.** This section originally read *"before any new feature ships"*, which contradicts
> [`14-cut-list.md`](14-cut-list.md): its 54 h irreducible core ships the receipt having cut two of the
> three. Both cannot stand, and the cut list is the operative plan. The correct scope is **before
> deploy or handoff, not before a feature branch merges** — with one exception that stays a hard
> gate because the receipt's own honesty depends on it: the quantity validation in Blocker 3, since
> a receipt printing points for food that is not there is worse than no receipt. Blockers 1 and 2
> are release gates, and [`14`](14-cut-list.md) prices them as such. *Corrected 2026-09-13: this
> clause also said "and schedules". It does not — `14` **cuts** N5b (`:36-42`) and excludes Blockers 1
> and 2 from the 54.00 h irreducible core (`:156-174`). That disagreement is open fork (c) and is
> laid out under Blocker 1 below rather than smoothed over here.*

> ⚠ **Added 2026-09-13 — this heading said "the three defects", and the list was missing one.** A later run found a fourth surface this file never mentions, and it is the only one in our whole audit that a marker could reproduce with `curl` instead of a grep. It is now **Blocker 0**, below. The §3 table is deliberately left alone: §3 enumerates defects that a **P1a test recorded**, and no test of ours touches this route.

### Blocker 0 — `GET /api/users` returns every user's email over the service-role client: delete it
`web/src/app/api/users/route.ts:8-16` · **≈ 0.25 h**

Found in [`p1b/evidence/claude/runs/p08-mission.md:153`](../../evidence/claude/runs/p08-mission.md) (F5), which calls it *"a second unmitigated hole, worse than the share route, and executable with one curl."* Re-read today: `export async function GET()` at `:8` takes no arguments, calls no `auth.getUser`, and queries `supabaseServer` — the `SUPABASE_SERVICE_ROLE_KEY` client (`web/src/lib/supabaseServer.ts:4-6`), so **RLS is bypassed by design** — selecting `id, fullname, email` from `User` for **every row**, ordered by signup (`:10-13`). Unlike the share endpoint there is not even a policy that *might* catch it, because the service role is exempt. And `grep -rn "/api/users" web` returns only the route's own comment lines: **it has zero callers.** The fix is `rm web/src/app/api/users/route.ts` — a five-minute, zero-regression deletion. Ranked above Blocker 1 because it is cheaper by a factor of thirty-five and needs no migration, no RLS policy and no design decision. It also repairs this file's own methodology caveat: this one is an executed request, not a source grep.

### Blocker 1 — The entire share endpoint: D1 + D2 + D3 + D11
`web/src/app/api/shopping-lists/share/route.ts` and the missing `supabase/migrations/*_shopping_list_shares.sql` · **≈ 8.75 h**

This is the only surface where we have **no second line of defence and cannot prove we have one**. The POST handler constructs a bare anon client (`:9-12`), never calls `auth.getUser`, never checks that `shoppingListId` belongs to the caller, and feeds `expiryDays` straight into date arithmetic — and the table it writes to, `shopping_list_shares`, has no migration, no `ENABLE ROW LEVEL SECURITY`, and no policy anywhere in this repository. Every other authorization finding we downgraded was downgraded *because we could read the policy that catches it*; here there is nothing to read. Shipping a new feature on top of an endpoint whose backing table is undefined means the next migration, the next `supabase db reset`, or the next environment will behave differently for reasons no one can audit. Fix order: write the migration with an owner-scoped RLS policy first, then add `auth.getUser` + a 401, then the ownership query, then bound `expiryDays` to a small positive integer.

> ⚠ **Open fork — flagged 2026-09-13, and deliberately NOT resolved here.** "Ship-blocking" is this file's verdict. The planning files reach the opposite conclusion about the same 8.75 h of work, and a packet that hides that tells a marker the thing that MUST ship first is the thing we plan to cut:
> - [`12-milestones.md:9`](12-milestones.md) makes *"Drop milestone N5b (share-route hardening, 8.75 h)"* its **headline budget recommendation**, and [`:85`](12-milestones.md) calls the same 8.75 h *"the least evidenced number in this document"*, offering a ~4 h slice (migration + RLS policy only, remaining auth/ownership/bounds work reported as known-open) as the largest realistic version.
> - [`14-cut-list.md:36-42`](14-cut-list.md) cuts N5b outright — *"We found it, proved it, and priced it at 8.75 h; we did not fix it, because it is not on the receipt's path"* — and [`:156-174`](14-cut-list.md) excludes Blockers 1 and 2 from the **54.00 h irreducible core**.
> - [`15-codex-prompt-reruns.md`](15-codex-prompt-reruns.md) gates the project on it.
>
> This is open fork (c), **"Share route in or out"**, in [`18-self-audit.md:92`](18-self-audit.md). **It is the team's to settle, and this document does not settle it.** What survives either way, and is all the poster may assert until the team decides: the defect is real, re-confirmed today at the lines above, and priced at 8.75 h by a method **none of the three files records**.

### Blocker 2 — Transfer ownership scoping and its ignored result: D4 + D5
`web/src/app/api/inventory/transfer/route.ts:93-96` and `:152-155` · **≈ 3.5 h**

This is the only defect recorded by two of our suites (`test_uc20_rejects_transfer_of_another_users_shopping_item` and `attack_transfer_verifies_each_shopping_item_belongs_to_the_user`), and it is the single FAIL in the otherwise-clean 31/32 rerun. *Corrected 2026-09-13: that is far weaker corroboration than it sounded, and this paragraph originally called them "two independent tests" and placed one of them "in the functional contract suite". Both are **static source greps**: `use-case-contracts.test.ts:98-106` and `security-attack-cases.test.ts:45-53` slice the same file between the same two markers and assert the same string, so it is one grep run twice — and the single FAIL in the 31/32 rerun is that same static contract, not a functional test.* What confirms the defect below is reading the route, not the duplication. RLS does block the cross-user write — but the route never looks at how many rows the update touched (`:98` inspects only `checkError`, and the undo path at `:152-155` discards its result entirely — *corrected 2026-09-13: this is an `.update({ is_checked: false })`, **not** a DELETE; the only `.delete()` in the file is `:170`, against `user_inventory`*), so it returns `success: true, transferred_count: N` for transfers that did not happen. UC20's own postcondition then fires: "When no items remain, system removes the completed list." A silently-unchecked item combined with an inventory row that *was* inserted is the precise shape of a data-loss bug, and it sits directly under UC20, the workflow the shopping and inventory features both terminate in. *Corrected 2026-09-13 — this action item re-committed the error the audit's headline reversal exists to undo.* It previously read *"until it scopes by `user_id` **and** asserts the affected-row count"*. Scoping by `user_id` is the exact fix that D4's own RLS column above and [`06-disagreement-with-codex.md`](06-disagreement-with-codex.md) D9 prove **impossible**: `shopping_list_items` has no `user_id` column (`supabase/migrations/20251129020000_shopping_list_items.sql:11-23` — `id, shopping_list_id, ingredient_id, item_name, quantity, unit, category, is_checked, position, notes, created_at`), so the filter would query a column that does not exist and raise a Postgres error. The corrected action item: **nothing new should be built on transfer until it inspects the affected-row count on both the UPDATE at `:93-96` and the undo-UPDATE at `:152-155`, and returns a partial-failure status instead of `success: true`.** Ownership is already enforced by the parent-list RLS policy; there is no `user_id` to scope by, and adding one is the wrong fix.

### Blocker 3 — Quantity and boolean validation on the two persisted write paths: D6 + D8 + D9
`web/src/app/api/inventory/transfer/route.ts:65`, `:80`, `:167` and `web/src/app/api/shopping-lists/[id]/items/[itemId]/route.ts:53`, `:65` · **≈ 3.5 h**

These three are the findings with **zero database mitigation**, confirmed by reading the schema: `user_inventory.quantity` (`20251129030000_user_inventory.sql:15`) and `shopping_list_items.quantity` (`20251129020000_shopping_list_items.sql:16`) are both plain `DECIMAL(10,2)` with no CHECK constraint, and `is_checked BOOLEAN` will store the `true` that `Boolean("false")` produces. The `|| 1` idiom is worse than a rejection: it does not fail, it writes a *different* number than the caller sent. That corrupted quantity then feeds the low-stock and expiry logic that **nine of our passing runtime tests** (`test_flags_quantity_equal_to_minimum_as_low_stock`, `test_counts_critical_and_low_items_in_low_stock_total`, and the UC13 expiry family) certify as correct — so every new feature reading inventory inherits silently wrong inputs while the suite stays green. Fix is small and entirely local: reject non-positive and non-finite quantities with a 400, require `typeof is_checked === "boolean"`, and add the missing CHECK constraints in the same migration.

**Deliberately not on this list:** D10 (achievement trigger) — **the achievements service-role *write* is a cleanup; the service-role *read* at `GET /api/users` is not.** The achievements insert takes unvalidated input, but `user_id` comes from the server-derived `authUserId` (`web/src/app/api/achievements/check/route.ts:114`), so a caller can only pollute their own row. *Corrected 2026-09-13: this paragraph used to justify excluding the achievements write without noticing that its far more serious sibling — the same service-role client, no auth at all, every user's email — was missing from the blocker list entirely. It is now Blocker 0.* D12–D18 (backend Pydantic bounds and prompt delimiting) — real, cheap to fix (**≈ 5.75 h for all seven**; *arithmetic recomputed 2026-09-13: this read "≈ 6.25 h". Adding the §3 rows: D12 0.75 + D13 0.5 + D14 0.5 + D15/16/17 1.5 + D18 2.5 = **5.75 h**. The §3 grand total of 24.25 h is unaffected, because it was summed from the rows rather than from this subtotal — re-added row by row today and it still comes to 24.25*), and they should go in the first P1b sprint, but they are cost/robustness and code-level LLM exposure, not integrity or authorization, and we never ran D18 against a live model.

---

## Files referenced

- `p1a/evidence/own-tests/RESULTS.md`, `p1a/evidence/own-tests/ATTACK-RESULTS.md`
- `p1a/evidence/own-tests/2026-08-29-{web,backend}-p1a-all-with-security-raw.txt`, `…-{web,backend}-security-raw.txt`, `…-{web,backend}-p1a-rerun-raw.txt`, `…-{web,backend}-p1a-raw.txt`
- `p1a/evidence/baseline/original-web-tests-raw.txt`, `original-backend-tests-raw.txt`, `2026-08-29-claude-step7-{web,backend}-raw.txt`
- `p1a/evidence/2026-08-29-web-tests-wenbo-raw.txt`
- `p1a/traceability/final-traceability.md`, `p1a/use-cases/final-use-cases.md`
- `web/tests/p1a/{security-attack-cases,use-case-contracts,inventory-behavior}.test.ts`; `backend/tests/sihao/p1a/{test_adversarial_inputs,test_recommender_behavior}.py`
- `web/src/app/api/shopping-lists/share/route.ts`, `web/src/app/api/shopping-lists/[id]/items/[itemId]/route.ts`, `web/src/app/api/inventory/transfer/route.ts`, `web/src/app/api/inventory/route.ts`, `web/src/app/api/achievements/check/route.ts`, `web/src/app/api/users/route.ts` *(added 2026-09-13 — Blocker 0)*
- `web/src/utils/supabase/server.ts`, `web/src/lib/supabaseServer.ts`
- `backend/api/index.py`, `backend/api/inventory_recommender.py`
- `supabase/migrations/20251129010000_shopping_lists.sql`, `20251129020000_shopping_list_items.sql`, `20251129030000_user_inventory.sql`
- `README.md:54` (the inherited "1,130+" claim — flagged, do not reuse)