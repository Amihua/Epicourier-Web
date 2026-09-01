#!/bin/bash
# Minimal context: ~100KB for reliable 14B model instruction following
set -e
cd "$(git rev-parse --show-toplevel)"
OUT="p1a/scripts/context_mini.txt"
MAX=80

add() { [ -f "$1" ] && echo -e "\n--- $1 ---" >> "$OUT" && head -n $MAX "$1" >> "$OUT"; }

echo "=== README.md ===" > "$OUT"
head -n 60 README.md >> "$OUT"

echo -e "\n=== INSTALL.md ===" >> "$OUT"
head -n 40 INSTALL.md >> "$OUT"

echo -e "\n=== Pages ===" >> "$OUT"
for f in web/src/app/signup/page.tsx web/src/app/signin/page.tsx \
         web/src/app/dashboard/page.tsx \
         web/src/app/dashboard/achievements/page.tsx \
         web/src/app/dashboard/nutrients/page.tsx \
         web/src/app/dashboard/shopping/page.tsx \
         web/src/app/dashboard/recipes/page.tsx \
         web/src/app/dashboard/challenges/page.tsx \
         web/src/app/dashboard/inventory/page.tsx \
         web/src/app/dashboard/calendar/page.tsx \
         web/src/app/dashboard/recommender/page.tsx \
         web/src/app/dashboard/settings/page.tsx; do
  add "$f"
done

echo -e "\n=== API routes ===" >> "$OUT"
for f in web/src/app/api/events/route.ts \
         web/src/app/api/recipes/route.ts \
         web/src/app/api/recipes/[id]/route.ts \
         web/src/app/api/inventory/route.ts \
         web/src/app/api/inventory/[id]/route.ts \
         web/src/app/api/inventory/batch-delete/route.ts \
         web/src/app/api/inventory/transfer/route.ts \
         web/src/app/api/shopping-lists/route.ts \
         web/src/app/api/shopping-lists/generate/route.ts \
         web/src/app/api/shopping-lists/[id]/route.ts \
         web/src/app/api/achievements/route.ts \
         web/src/app/api/achievements/check/route.ts \
         web/src/app/api/challenges/route.ts \
         web/src/app/api/challenges/join/route.ts \
         web/src/app/api/nutrients/goals/route.ts \
         web/src/app/api/nutrients/export/route.ts \
         web/src/app/api/nutrients/daily/route.ts \
         web/src/app/api/events/[id]/route.ts \
         web/src/app/api/users/route.ts \
         web/src/app/api/recommender/route.tsx; do
  add "$f"
done

echo -e "\n=== Backend API ===" >> "$OUT"
for f in backend/api/recommender.py backend/api/inventory_recommender.py; do
  add "$f"
done

echo -e "\n=== Key components ===" >> "$OUT"
for f in web/src/components/ui/AddMealModal.tsx \
         web/src/components/inventory/AddInventoryModal.tsx \
         web/src/components/inventory/EditInventoryModal.tsx \
         web/src/components/shopping/CreateListModal.tsx \
         web/src/components/shopping/GenerateShoppingListModal.tsx; do
  add "$f"
done

wc -l "$OUT"; wc -c "$OUT"
