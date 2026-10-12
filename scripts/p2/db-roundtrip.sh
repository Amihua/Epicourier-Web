#!/usr/bin/env bash
# Database round trip for the P2 M3 migration (receipt shopping delta).
#
# Starts a throwaway Postgres, applies a small Supabase stand-in
# (supabase/tests/p2/shim.sql), the real shopping/inventory migrations and the M3
# migration verbatim, then runs the assertions in
# supabase/tests/p2/receipt_shopping_delta.test.sql plus two concurrency checks
# that need two live sessions. Exits non-zero on the first failed check.
#
# Needs Postgres server binaries (initdb, pg_ctl, psql). They are found on PATH,
# in PG_BIN, or in the usual Debian/Homebrew locations. Without Docker or a
# Supabase project, `pip install pgserver` also ships them.
#
#   scripts/p2/db-roundtrip.sh
#   PG_BIN=/path/to/bin scripts/p2/db-roundtrip.sh

set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
MIGRATIONS="$ROOT/supabase/migrations"
TESTS="$ROOT/supabase/tests/p2"

find_bin() {
  if [[ -n "${PG_BIN:-}" ]]; then echo "$PG_BIN"; return; fi
  if command -v initdb >/dev/null 2>&1; then dirname "$(command -v initdb)"; return; fi
  for dir in /usr/lib/postgresql/*/bin /opt/homebrew/opt/postgresql@*/bin /usr/local/opt/postgresql@*/bin; do
    if [[ -x "$dir/initdb" ]]; then echo "$dir"; return; fi
  done
  echo "No Postgres binaries found; set PG_BIN" >&2
  exit 2
}

BIN="$(find_bin)"
WORK="$(mktemp -d)"
PORT="${PG_PORT:-55432}"

cleanup() {
  "$BIN/pg_ctl" -D "$WORK/data" -m immediate stop >/dev/null 2>&1 || true
  rm -rf "$WORK"
}
trap cleanup EXIT

"$BIN/initdb" -D "$WORK/data" -U postgres -A trust >/dev/null
"$BIN/pg_ctl" -D "$WORK/data" -l "$WORK/log" -w \
  -o "-p $PORT -k $WORK -c listen_addresses=''" start >/dev/null

PSQL=("$BIN/psql" -h "$WORK" -p "$PORT" -U postgres -d postgres -X -q -v ON_ERROR_STOP=1)

echo "== applying stand-in and migrations"
"${PSQL[@]}" -f "$TESTS/shim.sql"
for migration in \
  20251129010000_shopping_lists.sql \
  20251129020000_shopping_list_items.sql \
  20251129030000_user_inventory.sql \
  20251130100000_fix_shopping_list_items_ingredient_type.sql \
  20261012000000_receipt_shopping_delta.sql; do
  echo "   $migration"
  "${PSQL[@]}" -f "$MIGRATIONS/$migration"
done

echo "== sequential checks"
"${PSQL[@]}" -f "$TESTS/receipt_shopping_delta.test.sql"

# ---------------------------------------------------------------------------
# Concurrency: two sessions confirm at the same moment. Session one holds its
# transaction open for a second after applying; session two must wait on the
# preview's row lock and then see session one's result.

as_a() {
  cat <<SQL
BEGIN;
SET LOCAL request.jwt.claim.sub = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';
SET LOCAL ROLE authenticated;
$1
COMMIT;
SQL
}

race() {
  local preview="$1" first_request="$2" second_request="$3"
  as_a "SELECT public.apply_receipt_shopping_delta('$preview', '$first_request') ->> 'status'; SELECT pg_sleep(1);" \
    | "${PSQL[@]}" -A -t >"$WORK/first.out" &
  local first_pid=$!
  sleep 0.3
  as_a "SELECT public.apply_receipt_shopping_delta('$preview', '$second_request')::TEXT;" \
    | "${PSQL[@]}" -A -t >"$WORK/second.out"
  wait "$first_pid"
}

count_items() {
  "${PSQL[@]}" -A -t -c \
    "SELECT count(*) FROM public.shopping_list_items WHERE notes LIKE 'Shortfall%' AND quantity = $1"
}

"${PSQL[@]}" -c "
INSERT INTO public.shopping_delta_previews
  (id, user_id, shopping_list_id, recipe_id, as_of_date, snapshot_id, deltas)
VALUES
  ('a1000000-0000-4000-8000-000000000005', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
   '11111111-1111-4111-8111-111111111111', 101, '2026-10-10', 'snap_5',
   '[{\"ingredient_id\": 12, \"missing_qty\": 7, \"unit\": \"cup\"}]');"

echo "== concurrency: two different requests for one preview"
race a1000000-0000-4000-8000-000000000004 \
  c1000000-0000-4000-8000-000000000007 c1000000-0000-4000-8000-000000000008
grep -qx applied "$WORK/first.out" || { echo "FAIL: first session: $(cat "$WORK/first.out")"; exit 1; }
grep -q '"status": "stale"' "$WORK/second.out" || { echo "FAIL: second session: $(cat "$WORK/second.out")"; exit 1; }
[[ "$(count_items 2)" == 1 ]] || { echo "FAIL: preview 4 written $(count_items 2) times"; exit 1; }
echo "   ok: first applied, second stale, one line written"

echo "== concurrency: the same request sent twice at once (double click, retry)"
race a1000000-0000-4000-8000-000000000005 \
  c1000000-0000-4000-8000-000000000009 c1000000-0000-4000-8000-000000000009
grep -qx applied "$WORK/first.out" || { echo "FAIL: first session: $(cat "$WORK/first.out")"; exit 1; }
grep -q '"replayed": true' "$WORK/second.out" || { echo "FAIL: second session: $(cat "$WORK/second.out")"; exit 1; }
[[ "$(count_items 7)" == 1 ]] || { echo "FAIL: preview 5 written $(count_items 7) times"; exit 1; }
echo "   ok: first applied, second replayed, one line written"

echo "PASS: M3 database round trip ($("$BIN/postgres" --version))"
