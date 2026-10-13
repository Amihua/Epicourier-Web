# Receipt contract v1

**Owner:** Wenbo Li (M0, contracts, CI) · **Frozen:** 2026-10-10 · **Rule version string:** `receipt-v1`

This is the interface the four P2 workstreams build against. It is frozen: a change needs an issue
plus a contract PR merged *before* any consumer is updated. Python models are maintained by Sihao and
the TypeScript types by Wenbo; the contract tests are what keep the two honest.

Field semantics below were checked against the real schema today, not assumed from the existing code.
Where the schema contradicts the plan, this document says so and proposes the resolution rather than
quietly picking one.

## 1. Schema facts this contract rests on

Verified on 2026-10-10 against `supabase/migrations/` and `web/src/types/supabase.ts`.

| Fact | Source | Consequence for the contract |
|---|---|---|
| `user_inventory` is `UNIQUE (user_id, ingredient_id, location)` with a summed `quantity` | `supabase/migrations/20251129030000_user_inventory.sql:26` | **There are no per-purchase lots.** A receipt line is per *inventory row*, which is one ingredient in one location, carrying one expiry date. A receipt may not promise "which batch". |
| `user_inventory.unit` is `VARCHAR(50)` and **nullable** | same file, line 16 | A stored quantity may have no unit. The contract must define this case rather than silently comparing numbers. |
| `Ingredient.unit` is `NOT NULL` | `web/src/types/supabase.ts:161` | There is always a fallback unit available per ingredient. |
| `"Recipe-Ingredient_Map".relative_unit_100` is **nullable** | `web/src/types/supabase.ts:377` | A recipe may not state how much of an ingredient it needs. |
| **`Recipe` has no `servings` column** | `web/src/types/supabase.ts:295-306` | The plan's input list names `servings`. It does not exist in the data. See §2. |
| `user_inventory` is **absent from the generated `supabase.ts`** | checked today: the file contains `Ingredient`, `Recipe`, `nutrient_goals`, `user_challenges` and others, but no `user_inventory` | The generated types are stale. Regenerating them is Andy's file (`web/src/types/supabase.ts`); until then, inventory types in this contract are written by hand from the migration. |

### `relative_unit_100`, and a defect found while reading it

Existing nutrient code treats it as *quantity in the ingredient's own unit, per 100 of which the
`Ingredient` nutrient columns are stated*:

```ts
const ratio = (map.relative_unit_100 ?? 100) / 100;   // web/src/app/api/nutrients/tracking.ts:90
const ratio = (map.relative_unit_100 || 100) / 100;   // web/src/app/api/nutrients/daily/route.ts:171
```

**These two lines are not the same function.** `?? 100` substitutes only for `null`; `|| 100`
substitutes for `null`, `undefined` **and `0`** — so a recipe that legitimately requires 0 of an
ingredient is scored as requiring 100 units of it. The two call sites disagree today.

This contract fixes the meaning: **`relative_unit_100` is the required quantity expressed in
`Ingredient.unit`, and `null` means the requirement is unknown. `0` means zero and is never rewritten
to 100.** A `null` requirement produces an `unresolved` receipt line, never a silent default.

The defect itself is out of scope for the contract PR; it is filed for the nutrient owner rather than
fixed here.

## 2. Open decisions the four of us must sign off

These are the only places this contract does not yet freeze. Both need an answer today, because
consumers are blocked on them.

**D1 — `servings`.** The plan lists `servings` in the ranking input and the preview input, and the
`Recipe` table has no such column. Three options: (a) drop it from v1 and score one recipe as one
batch; (b) keep it as a caller-supplied positive integer multiplier that scales *requirements only*,
never nutrient targets; (c) add a column, which is a migration and therefore Andy's, and is not
one-week work. **Proposed: (b), defaulting to 1.** It is the only option that keeps the field in the
interface without inventing data, and the multiplier is explicit in the receipt so a reader can check
it.

**D2 — missing inventory unit.** When `user_inventory.unit` is `null`, do we (a) fall back to
`Ingredient.unit` and compare, or (b) treat the line as `unresolved_unit` and refuse to subtract?
**Proposed: (b).** Falling back assumes the user's 2 of something are 2 of the ingredient's unit, and
that assumption is exactly how a shopping list ends up with 300 g of a thing the user has 3 bags of.
An unresolved line is visible; a wrong subtraction is not.

## 3. Ranking input

```
RankingRequest {
  rule_version:   "receipt-v1"          required, literal
  as_of_date:     "YYYY-MM-DD"          required, no implicit local date anywhere
  candidates:     RecipeCandidate[]     required, >= 1
  inventory:      InventorySnapshot[]   required, may be empty
  targets:        NutrientTargets|null   null when the user has not confirmed targets
}

RecipeCandidate {
  recipe_id:      integer               required
  servings:       integer >= 1          default 1, scales requirements only (D1)
  requirements:   Requirement[]         required, may be empty
}

Requirement {
  ingredient_id:  integer               required
  quantity:       number|null           required key; null = requirement unknown
  unit:           string                required, from Ingredient.unit
}

InventorySnapshot {
  inventory_id:     string (uuid)       required
  ingredient_id:    integer             required
  quantity:         number              required
  unit:             string|null         required key; null handled per D2
  location:         "pantry"|"fridge"|"freezer"|"other"
  expiration_date:  "YYYY-MM-DD"|null   required key
}

NutrientTargets {
  confirmed_at:   ISO-8601 timestamp    targets are only usable when confirmed
  daily:          { <nutrient_key>: number }
  consumed_today: { <nutrient_key>: number }
}
```

The inventory passed in must be the user's **full authorised inventory**, not the subset the current
page is filtering. The server re-reads it; a client-supplied snapshot is never trusted for the write
path.

## 4. Ranking output

```
RankingResponse {
  rule_version:   "receipt-v1"
  as_of_date:     "YYYY-MM-DD"          echoed from the request
  results:        RankedRecipe[]        ordered, best first
}

RankedRecipe {
  recipe_id:      integer
  rank_score:     number                ranking points, NOT a percentage (see below)
  subtotals: {
    inventory:    number
    expiry:       number
    nutrition:    number
  }
  items:          ReceiptItem[]
  targets:        TargetOutcome|null
  warnings:       Warning[]
}
```

**`rank_score` is ranking points, not a percentage.** The existing UI prints `match_score` as a bold
percentage; an arbitrary accumulated point total may not be rendered in that slot. If a 0–100 figure
is wanted it must be defined separately and named differently (`coverage_pct`), computed as a real
ratio, and it is not in v1.

**Ordering is total and reproducible.** Sort by `rank_score` descending, then by `recipe_id`
ascending. Identical input with identical `as_of_date` must produce an identical response, including
order. Perturbing the order of the `inventory` array must not change any output.

## 5. Receipt item

One line per *contributing inventory row or requirement*, so a reader can add the column up by hand
and reach `rank_score`.

```
ReceiptItem {
  ingredient_id:   integer
  ingredient_name: string|null          display only; never an identity key
  required_qty:    number|null
  available_qty:   number               usable quantity only (see below)
  unit:            string|null
  expiration_date: "YYYY-MM-DD"|null
  source:          "inventory" | "expiry" | "nutrition" | "global"
  points:          number               signed; the amount this line added to rank_score
  status:          "ok" | "missing" | "expired" | "unresolved_unit" | "unknown_requirement"
}
```

Rules that are frozen, because they are where a scorer quietly goes wrong:

- **Expired stock is not available.** An inventory row whose `expiration_date` is strictly before
  `as_of_date` contributes `available_qty: 0` and `status: "expired"`. It may not be counted toward
  coverage. Expiry *urgency* may add points through a `source: "expiry"` line; already-expired stock
  may not.
- **`status` describes the inventory row, not whether the requirement was met.** These come apart,
  and the M0 harness caught the author of this document getting it wrong: a row that is expired while
  the recipe requires `0` of that ingredient is `"expired"`, even though nothing is missing. Read
  satisfaction from `required_qty` against `available_qty`; read usability from `status`. An expired
  row is `"expired"` whatever the requirement happens to be.
- **Missing nutrient data is not zero.** An ingredient with `null` nutrients produces
  `status: "unknown_requirement"` on the nutrition line, and the nutrition subtotal states that it is
  incomplete. It is never silently treated as 0 g of protein.
- **Global contributions are separate lines.** Anything not attributable to one ingredient uses
  `source: "global"` and appears as its own row. `sum(items[].points) == rank_score` must hold
  exactly, after the documented rounding.
- **Rounding** is applied once, at the end, to 2 decimal places, half-up. Subtotals are rounded from
  unrounded components, not from rounded lines.

## 6. Targets

```
TargetOutcome {
  remaining:  { <nutrient_key>: number }   >= 0
  over:       { <nutrient_key>: number }   >= 0, the amount past the target
  incomplete: string[]                      nutrient keys with missing source data
}
```

Exceeding a target must preserve the excess in `over`. Clamping the remainder to zero without
reporting the overage is prohibited: "0 left" and "600 kcal past it" are different facts.

Targets are used only when `confirmed_at` is present. Unconfirmed targets are ignored and recorded in
`warnings`.

## 7. Shopping preview and confirm

```
PreviewRequest  { recipe_id, servings, list_id }
PreviewResponse {
  preview_id:   string            identifies the snapshot this preview was computed from
  snapshot_id:  string            inventory state the delta was computed against
  deltas:       [ { ingredient_id, missing_qty, unit } ]
  unresolved:   [ { ingredient_id, reason: "missing_unit"|"incompatible_unit"|"unknown_requirement" } ]
}

ConfirmRequest  { preview_id, request_id }
ConfirmResponse { written: [...], skipped: [...], status: "applied"|"stale"|"failed" }
```

`missing = max(required - available_usable, 0)`. `available_usable` excludes expired rows, per §5.
The server recomputes from its own read of the user's inventory; `deltas` submitted by a client are
never trusted. If inventory changed since the preview, the confirm returns `status: "stale"` and
writes nothing — it may not silently write something different from what was previewed. `request_id`
makes confirm idempotent, enforced in the database rather than in memory.

Nothing is written to a shopping list before the user confirms. A partial write must report failure;
returning `success` for a partial write is prohibited.

## 8. UI props

```
ReceiptPanel      { receipt: RankedRecipe (read-only), onCorrect: (inventory_id, patch) => Promise }
ShoppingPreview   { recipe_id, servings, list_id, onComplete: (ConfirmResponse) => void }
```

`onCorrect` must persist through the existing inventory API and then trigger a re-fetch and
re-rank. Changing a number in React state alone does not satisfy M2.

## 9. Fixed test date

All fixtures use `as_of_date: "2026-10-10"`. Production callers compute the date by a shared rule;
no code path may fall back to the local clock of whichever machine is running, because that makes the
same input produce different output tomorrow.

## 10. Identity

Ingredients are matched by `ingredient_id`. Names are display-only and may be `null` in the schema;
matching on a name is prohibited.
