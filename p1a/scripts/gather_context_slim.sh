#!/bin/bash
# Slim context: keep under ~300KB (~75K tokens) for qwen2.5:14b 128K window
set -e
cd "$(git rev-parse --show-toplevel)"
OUT="p1a/scripts/context_slim.txt"
MAX_LINES=150  # truncate individual files beyond this

add_file() {
  local f="$1"
  [ -f "$f" ] || return
  echo -e "\n--- $f ---" >> "$OUT"
  head -n $MAX_LINES "$f" >> "$OUT"
  local total=$(wc -l < "$f")
  if [ "$total" -gt "$MAX_LINES" ]; then
    echo -e "\n[... truncated at $MAX_LINES of $total lines ...]" >> "$OUT"
  fi
}

echo "=== README.md ===" > "$OUT"
cat README.md >> "$OUT"

echo -e "\n=== INSTALL.md ===" >> "$OUT"
cat INSTALL.md >> "$OUT"

echo -e "\n=== docs/user-guides/ ===" >> "$OUT"
for f in docs/user-guides/quick-start.md docs/user-guides/shopping-lists.md \
         docs/user-guides/inventory-management.md docs/user-guides/smart-suggestions.md; do
  add_file "$f"
done

echo -e "\n=== Pages (user-facing) ===" >> "$OUT"
for f in web/src/app/signup/page.tsx web/src/app/signup/actions.ts \
         web/src/app/signin/page.tsx web/src/app/signin/actions.ts \
         web/src/app/dashboard/page.tsx \
         web/src/app/dashboard/achievements/page.tsx \
         web/src/app/dashboard/nutrients/page.tsx \
         web/src/app/dashboard/nutrients/useNutrientDashboard.ts \
         web/src/app/dashboard/nutrients/useNutrientExport.ts \
         web/src/app/dashboard/shopping/page.tsx \
         web/src/app/dashboard/recipes/page.tsx \
         web/src/app/dashboard/challenges/page.tsx \
         web/src/app/dashboard/inventory/page.tsx \
         web/src/app/dashboard/calendar/page.tsx \
         web/src/app/dashboard/recommender/page.tsx \
         web/src/app/dashboard/settings/page.tsx; do
  add_file "$f"
done

echo -e "\n=== API routes ===" >> "$OUT"
find web/src/app/api -name "route.ts" -o -name "route.tsx" | sort | while read f; do
  add_file "$f"
done

echo -e "\n=== Key components ===" >> "$OUT"
for f in web/src/components/ui/AddMealModal.tsx \
         web/src/components/inventory/AddInventoryModal.tsx \
         web/src/components/inventory/EditInventoryModal.tsx \
         web/src/components/inventory/BatchDeleteDialog.tsx \
         web/src/components/shopping/CreateListModal.tsx \
         web/src/components/shopping/GenerateShoppingListModal.tsx \
         web/src/components/shopping/TransferFlow/BatchTransferModal.tsx; do
  add_file "$f"
done

echo -e "\n=== Hooks ===" >> "$OUT"
for f in web/src/hooks/*.ts web/src/hooks/*.tsx; do
  [ -f "$f" ] && add_file "$f"
done

echo -e "\n=== Backend API ===" >> "$OUT"
for f in backend/api/index.py backend/api/recommender.py \
         backend/api/enhanced_recommender.py backend/api/inventory_recommender.py; do
  add_file "$f"
done

echo -e "\n=== DB schema (first migration) ===" >> "$OUT"
add_file supabase/migrations/20251121052639_remote_schema.sql
# Just list the other migration filenames for reference
echo -e "\n--- Other migrations (names only) ---" >> "$OUT"
ls supabase/migrations/*.sql | grep -v 20251121 >> "$OUT"

wc -l "$OUT"
wc -c "$OUT"
echo "Context written to $OUT"
