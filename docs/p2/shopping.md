# M3: pantry delta, shopping preview and confirm

**Owner:** Andy Yu · **Written:** 2026-10-12 · **Contract:** [`p2/contracts/receipt-v1.md`](https://github.com/Amihua/Epicourier-Web/blob/se26f-p2/p2/contracts/receipt-v1.md) §7–§9

M3 turns "this recipe" into "what I still have to buy". It subtracts the user's usable stock
from the recipe's needs. It shows the result as a preview and writes it to a shopping list only
when the user confirms. A confirm is applied at most once, however often it is sent.

```
missing = max(required − available_usable, 0)
```

## What is in this module

| Piece | File | What it does |
|---|---|---|
| Unit rules | `web/src/lib/receipt-shopping/units.ts` | Parses "100g", "1 cup", "kg", "pieces". Converts within one dimension only. |
| Delta | `web/src/lib/receipt-shopping/delta.ts` | Pure function. Has no network, no database and no clock. |
| Requirement adapter | `web/src/lib/receipt-shopping/requirements.ts` | Turns `relative_unit_100` and `Ingredient.unit` into a contract `Requirement`. |
| Snapshot | `web/src/lib/receipt-shopping/snapshot.ts` | Fingerprints the data a preview came from. |
| Date rule | `web/src/lib/receipt-shopping/asOfDate.ts` | Today's date in `RECEIPT_TIME_ZONE` (default America/New_York). |
| Preview API | `web/src/app/api/receipt-shopping/preview/route.ts` | Read-only. Computes the delta and stores it as a preview. |
| Confirm API | `web/src/app/api/receipt-shopping/confirm/route.ts` | Detects staleness, then makes the atomic, idempotent write. |
| Gateway | `web/src/app/api/receipt-recommendations/route.ts` | Builds a server-side `RankingRequest` and forwards it to the Python ranker. |
| UI | `web/src/components/shopping/ReceiptShoppingPreview.tsx` | Shows the preview, Confirm and Cancel. For Feiyang to mount. |
| Schema | `supabase/migrations/20261012000000_receipt_shopping_delta.sql` | Preview and confirmation tables, plus `apply_receipt_shopping_delta`. |
| Schema | `supabase/migrations/20261012000100_nutrient_goals_confirmed_at.sql` | `nutrient_goals.confirmed_at` (contract §6). |

## The rules, in order

For each ingredient the recipe uses:

1. Requirements for the same ingredient are summed, then multiplied by `servings` (D1, a
   positive integer that defaults to 1).
2. A `null` requirement is reported as `unknown_requirement`. A `0` means zero and adds nothing.
3. Usable stock is the **sum of every unexpired row** for that ingredient, across pantry, fridge
   and freezer. A row expiring *on* `as_of_date` still counts. A row that expired *before*
   that date does not.
4. If the comparable rows already cover the need, there is no line.
5. Otherwise, the line is unresolved in two cases. If any unexpired row has no unit, it is
   `missing_unit` (D2). If any has a unit in another dimension (pieces against grams), it is
   `incompatible_unit`. Those rows might cover the gap, so subtracting without them would be
   a guess.
6. Otherwise the shortfall is **rounded up** to 0.01, because a list should never under-buy.
   It is reported in the requirement's display unit. A shortfall counted in items rounds up to
   whole items, so 1.8 eggs short buys 2.

## How units are read (#33)

`Ingredient.unit` in the shipped dataset is usually a household measure with its metric amount
in brackets. `units.ts` reads it in this order:

| Form | Example | Read as |
|---|---|---|
| bracketed metric amount | `1 tbsp (15 ml)`, `1/2 cup (120 g)`, `1 lemon (juice, 30 g)` | 15 ml, 120 g, 30 g |
| bracketed amount on a counted item | `1 large (50 g)`, `each (20g)`, `2 cloves (6 g)` | 50 g, 20 g, 6 g — and one item weighs 50, 20 or 3 g |
| brackets with no amount | `1 cup (cooked)` | the part outside: 1 cup |
| fractions and approximations | `1/2 cup`, `1 1/2 cup`, `½ tsp`, `~5 g` | 0.5 cup, 1.5 cup, 0.5 tsp, 5 g |
| descriptive words after a unit | `100 g peeled`, `5 g cooked` | 100 g, 5 g |

A counted item converts to and from a pantry that counts pieces: 6 pieces of `1 large (50 g)`
is 300 g. Such needs display as `pcs`. No other pair of dimensions converts. Mass never becomes
volume, because density is unknown.

Coverage over the 448 dataset units went from 181 (40.4%) to 441 (98.4%). The seven left are
`to taste`, `few drops`, `serving` and four leaf or sprig counts with no weight. They stay
unresolved on purpose. `unitCatalogue.test.ts` fails CI if coverage drops below 95%.

The ranker (Python) matches units by exact string. The gateway therefore states each requirement
in the unit the user's stock is kept in when the two convert: 250 g becomes 0.25 kg for a pantry
in kg, and half an egg becomes 0.5 pieces for a pantry that counts eggs.

Output is ordered by `ingredient_id`, so input order never changes the answer. The property
tests check this over 25 generated cases × 20 shuffles.

## A schema fact the contract should record: `relative_unit_100` is a percentage

Contract §1 calls `relative_unit_100` "the required quantity expressed in `Ingredient.unit`". The
repository says it is a **percentage of a base unit**, so the quantity is `relative_unit_100 / 100`
of `Ingredient.unit`. The evidence:

- The data pipeline prompt (`data/prompts`) defines it as "50 for half of base unit", with base
  units such as "100g" and "1 cup".
- The recipe page renders it as `{Ingredient.unit} X {relative_unit_100}%`
  (`web/src/app/dashboard/recipes/[id]/page.tsx:78`).
- Every nutrient and shopping call site divides it by 100 before use.

So 250 against "100g" means 2.5 × 100 g = 250 g. `toRequirements` divides by 100, and the unit
parser folds the "100" prefix in. The gateway sends the ranker the normalised form
(`{quantity: 250, unit: "g"}`), the same shape as the golden fixture. **Sihao's scorer receives
display units and never sees "100g".** This needs a contract note from Wenbo. The code does not
depend on the wording.

## API

All three routes take ids only. The server reads the list, recipe, inventory and goals itself, under
the caller's session, and every query filters on `user_id` explicitly on top of RLS.

### `POST /api/receipt-shopping/preview`

```json
{ "recipe_id": 101, "servings": 1, "list_id": "<uuid>" }
```

- `200` returns the `PreviewResponse` exactly: `{ preview_id, snapshot_id, deltas, unresolved }`.
- `400` means the body is invalid. The body is a strict object, so client-sent `deltas` are
  rejected.
- `401` means there is no session.
- `404` means the list or recipe is not found, or the list is not the caller's.
- `422` means stored stock could not be interpreted (for example, a negative quantity).
- `500` means the database read failed. Nothing is saved.

It writes one row to `shopping_delta_previews` and **nothing to any list**.

### `POST /api/receipt-shopping/confirm`

```json
{ "preview_id": "<uuid>", "request_id": "<uuid>" }
```

1. It reloads the caller's preview.
2. If the preview is not applied yet, it recomputes the delta from current stock and today's
   date. If the snapshot or the lines changed, it returns **`409 stale`** and writes nothing.
   This also catches stock that expired overnight.
3. It calls `apply_receipt_shopping_delta`, which:
   - locks the preview row;
   - replays a known `request_id`;
   - answers `stale` if another request already applied this preview;
   - otherwise writes the lines and the confirmation in one transaction.

| Outcome | HTTP | Body | Header |
|---|---|---|---|
| written now | 200 | `{status: "applied", written, skipped}` | — |
| same `request_id` again | 200 | the original result | `Idempotent-Replayed: true` |
| stock changed | 409 | `{status: "stale", written: [], skipped: []}` | `X-Receipt-Reason: inventory_changed` |
| preview already applied | 409 | `stale` | `X-Receipt-Reason: preview_already_applied` |
| `request_id` reused for another preview | 409 | `failed` | `X-Receipt-Reason: request_id_reused` |
| write failed | 500 | `{status: "failed", …}`, **nothing written** | `X-Receipt-Reason: write_failed` |

The body is always the contract's exact `{status, written, skipped}`. Reasons travel in headers,
so `additionalProperties: false` holds. `skipped` lists the unresolved lines that were not written.

### `POST /api/receipt-recommendations` (gateway)

```json
{ "candidate_recipe_ids": [3, 9], "limit": 20 }      // both optional; {} or no body is fine
```

The server builds the `RankingRequest` from its own reads:

- the caller's **full** inventory, not the page's filtered view;
- candidates: either the given ids that exist, or the recipes sharing the most distinct
  *usable* ingredients (ties by lower id);
- `targets`: only when `nutrient_goals.confirmed_at` is set, with today's `nutrient_tracking`
  row as `consumed_today`.

It posts the request to `BACKEND_URL + RECEIPT_RANK_PATH`, which defaults to
`http://localhost:8000/receipt/rank`. When `RECEIPT_INTERNAL_TOKEN` is set, it sends that
value as `X-Internal-Token`. A response that is not receipt-v1 for the same date, or that
ranks a recipe nobody asked about, becomes a `502`. With no candidates it answers
`{results: []}` without calling Python.

**For Sihao:** the Python side needs `POST /receipt/rank`, taking a `RankingRequest` and returning
a `RankingResponse`. When `RECEIPT_INTERNAL_TOKEN` is set in its environment, it should reject a
missing or wrong `X-Internal-Token` header. Both values are environment variables, so the path
can change without code changes.

## For Feiyang: mounting the preview

```tsx
import ReceiptShoppingPreview from "@/components/shopping/ReceiptShoppingPreview";

<ReceiptShoppingPreview
  recipe_id={recipe.id}
  servings={1}
  list_id={selectedListId}
  onComplete={(result) => { /* close dialog, toast `${result.written.length} items added` */ }}
  onCancel={() => setOpen(false)}
/>
```

Props are the contract's `ShoppingPreviewProps`, plus optional `onCancel`. There is also
`getNames`, which tests use to inject names. The component fetches on mount and holds one
`request_id` per preview, so a double click or a retry never adds twice. It explains every
unresolved line in words, so state is not shown by colour alone. To switch the inventory page
to the gateway, replace the browser call to `${BACKEND_URL}/inventory-recommend` with
`POST /api/receipt-recommendations`.

## Evidence

| Claim (plan acceptance) | Where it is shown |
|---|---|
| Needs 500 g, has 200 g usable → adds only 300 g | `delta.test.ts` "the plan's acceptance example"; `routes.test.ts` "computes the delta…" |
| Cancel writes nothing | `ReceiptShoppingPreview.test.tsx` "cancel calls onCancel and never confirms"; preview route test "writes nothing" |
| A repeated confirm takes effect once | DB round trip checks 4, 5 and both concurrency races; UI "sends one confirm for a double click", "retries … with the same request id" |
| A list the user has no access to cannot be written | DB round trip checks 2, 6 and 11; preview route 404 test |
| The client cannot rewrite a preview's lines or a confirmation, even by calling Supabase directly | DB round trip checks 12 and 13 (column-level grants: only `applied_at` is updatable) |
| A failure never returns a false success | DB round trip check 8 (half-way failure rolls back); confirm route "returns failed, never success"; UI "does not trust a 200 whose body is not 'applied'" |
| Real database round trip | `scripts/p2/db-roundtrip.sh` (below) |

### Running it

```bash
cd web
npx jest -c jest.node.config.ts __tests__/node/p2/shopping     # 198 tests: units, delta, snapshot, routes, gateway
npx jest -c jest.jsdom.config.ts __tests__/jsdom/p2/shopping   # 26 tests: the preview component
cd ..
scripts/p2/db-roundtrip.sh                                     # real Postgres, needs initdb/pg_ctl/psql
```

The round trip needs Postgres server binaries. They are found on `PATH`, in `PG_BIN`, or in the
usual Debian and Homebrew locations. Without Docker, `pip install pgserver` ships them. The
round trip applies a small Supabase stand-in (`supabase/tests/p2/shim.sql`), then the real
shopping, inventory and goals migrations and both M3 migrations verbatim. Then it runs 13
sequential checks and 2 concurrency races. If the row lock is removed from the function, the
first race fails, so the check is not vacuous.

Last run on 2026-10-12, against PostgreSQL 16.2:

```
sequential checks: PASS
== concurrency: two different requests for one preview
   ok: first applied, second stale, one line written
== concurrency: the same request sent twice at once (double click, retry)
   ok: first applied, second replayed, one line written
PASS: M3 database round trip (postgres (PostgreSQL) 16.2)
```

The full web suite was also run on 2026-10-12, so the old tests still pass:
1318 passed, 1 skipped (pre-existing), 0 failed.

## Known limits

- **Check-then-write window.** Staleness is checked in the route, and the write happens in the
  database function a moment later. A stock edit that lands between the two is not detected.
  Idempotency and at-most-once apply do not depend on this window: they are enforced by the
  row lock and the unique keys.
- **Not run against hosted Supabase yet.** The round trip uses plain Postgres plus a stand-in for
  `auth.uid()` and the roles. The migration still has to be pushed to the team project. After
  that, `supabase gen types typescript` should replace the hand-written additions in
  `web/src/types/supabase.ts`.
- **No Python endpoint yet.** The gateway is tested against a stubbed ranker. It returns 502
  until `/receipt/rank` exists.
- **Units convert within one dimension, plus the counted-item bridge.** Metric mass and volume,
  US kitchen volume (tsp, tbsp, cup), oz, lb and counts convert. Mass never converts to volume,
  because density is unknown. An unknown pairing is reported as `incompatible_unit` rather than
  guessed. Very small amounts, such as 0.25 g of parsley, are shown as computed and not as "a
  pinch".
- **One line per confirm.** Confirm adds new list lines. It does not merge them into an existing
  line for the same ingredient, which would change a row the user may have edited.
