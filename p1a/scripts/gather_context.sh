#!/bin/bash
# Gather permitted source files for local LLM use-case generation
# Excludes: tests, test plans, coverage reports per clean-room constraint
set -e
cd "$(git rev-parse --show-toplevel)"
OUT="p1a/scripts/context.txt"

echo "=== README.md ===" > "$OUT"
cat README.md >> "$OUT"

echo -e "\n=== INSTALL.md ===" >> "$OUT"
cat INSTALL.md >> "$OUT"

echo -e "\n=== docs/ ===" >> "$OUT"
for f in docs/README.md docs/user-guides/*.md docs/releases/*.md; do
  [ -f "$f" ] && echo -e "\n--- $f ---" >> "$OUT" && cat "$f" >> "$OUT"
done

echo -e "\n=== web/src/app/ pages ===" >> "$OUT"
for f in web/src/app/page.tsx \
         web/src/app/layout.tsx \
         web/src/app/signup/page.tsx web/src/app/signup/actions.ts \
         web/src/app/signin/page.tsx web/src/app/signin/actions.ts \
         web/src/app/dashboard/page.tsx web/src/app/dashboard/action.ts web/src/app/dashboard/layout.tsx \
         web/src/app/dashboard/achievements/page.tsx \
         web/src/app/dashboard/nutrients/page.tsx \
         web/src/app/dashboard/nutrients/useNutrientDashboard.ts \
         web/src/app/dashboard/nutrients/useNutrientExport.ts \
         web/src/app/dashboard/settings/page.tsx \
         web/src/app/dashboard/shopping/page.tsx \
         web/src/app/dashboard/recipes/page.tsx \
         web/src/app/dashboard/challenges/page.tsx \
         web/src/app/dashboard/inventory/page.tsx \
         web/src/app/dashboard/calendar/page.tsx \
         web/src/app/dashboard/recommender/page.tsx; do
  [ -f "$f" ] && echo -e "\n--- $f ---" >> "$OUT" && cat "$f" >> "$OUT"
done

echo -e "\n=== web/src/app/api/ routes ===" >> "$OUT"
find web/src/app/api -name "route.ts" -o -name "route.tsx" | sort | while read f; do
  echo -e "\n--- $f ---" >> "$OUT" && cat "$f" >> "$OUT"
done

echo -e "\n=== web/src/components/ (key modals & UI) ===" >> "$OUT"
for f in web/src/components/ui/AddMealModal.tsx \
         web/src/components/ui/MealDetailModal.tsx \
         web/src/components/ui/SmartCartWidget.tsx \
         web/src/components/ui/ChallengeCard.tsx \
         web/src/components/ui/NotificationPrompt.tsx \
         web/src/components/ui/recipecard.tsx; do
  [ -f "$f" ] && echo -e "\n--- $f ---" >> "$OUT" && cat "$f" >> "$OUT"
done
for f in $(find web/src/components/inventory web/src/components/shopping -name "*.tsx" 2>/dev/null | sort); do
  echo -e "\n--- $f ---" >> "$OUT" && cat "$f" >> "$OUT"
done

echo -e "\n=== web/src/hooks/ ===" >> "$OUT"
for f in web/src/hooks/*.ts web/src/hooks/*.tsx; do
  [ -f "$f" ] && echo -e "\n--- $f ---" >> "$OUT" && cat "$f" >> "$OUT"
done

echo -e "\n=== backend/api/ ===" >> "$OUT"
for f in backend/api/index.py backend/api/recommender.py backend/api/enhanced_recommender.py backend/api/inventory_recommender.py; do
  [ -f "$f" ] && echo -e "\n--- $f ---" >> "$OUT" && cat "$f" >> "$OUT"
done

echo -e "\n=== supabase/migrations/ ===" >> "$OUT"
for f in supabase/migrations/*.sql; do
  [ -f "$f" ] && echo -e "\n--- $f ---" >> "$OUT" && cat "$f" >> "$OUT"
done

wc -l "$OUT"
wc -c "$OUT"
echo "Context written to $OUT"
