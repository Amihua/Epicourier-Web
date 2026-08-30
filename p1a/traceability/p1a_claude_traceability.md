# Epicourier Project 1a — Claude Use-Case Verification

Companion to `p1a/use-cases/p1a_claude/use-cases.md`. Every use case in that
document is listed here with the permitted product artifact it was derived from,
the file and line that proves the behavior, a confidence rating, and the concern
raised while reading the source. Nothing in this table derives from a test
artifact; see the clean-room disclosure at the end of the use-case document.

| UC | Permitted product evidence | File and line | Confidence | Concern |
|---|---|---|---|---|
| UC1 Register account | Registration form validation and account-creation action | `web/src/app/signup/page.tsx:31-78`; `web/src/app/signup/actions.ts:14-75` | High | The duplicate-email check reads a profile row before the account is created; two simultaneous registrations are not visibly guarded against. |
| UC2 Sign in | Sign-in form, sign-in action, session gate | `web/src/app/signin/page.tsx:21-94`; `web/src/app/signin/actions.ts:18-25`; `web/src/utils/supabase/middleware.ts:33-47` | High | None. Confirmed by running the app: an unauthenticated request to a protected path is redirected to `/signin`. |
| UC3 Browse recipes | Recipe listing with match filters and paging | `web/src/app/api/recipes/route.ts:13-125`; `web/src/app/dashboard/recipes/page.tsx:15-110`; `web/src/hooks/use-recipe.tsx:66-69` | High | Match mode fetches every matching recipe and filters in memory (`route.ts:82`); a source comment concedes the approach is simplified (`route.ts:53`). |
| UC4 View recipe details | Recipe detail page and single-recipe retrieval | `web/src/app/dashboard/recipes/[id]/page.tsx:23-61`; `web/src/app/api/recipes/[id]/route.ts:4-11` | High | None. |
| UC5 Request a personalized meal plan | Recommender page, proxy route, and service contract | `web/src/app/dashboard/recommender/page.tsx:27-98`; `web/src/app/api/recommender/route.tsx:5-24`; `backend/api/index.py:40-61` | High | The meal-count rule is enforced twice, in the page and in the service, and the two copies must be kept in step by hand. |
| UC6 Schedule a meal | Calendar entry creation | `web/src/app/api/events/route.ts:96-153`; `web/src/app/dashboard/calendar/page.tsx:92-126` | High | None. |
| UC7 Mark a scheduled meal complete | Calendar entry status change | `web/src/app/api/events/[id]/route.ts:50-105`; `web/src/app/dashboard/calendar/page.tsx:174-193` | High | None. |
| UC8 Review nutrient trends | Daily and periodic nutrient totalling | `web/src/app/api/nutrients/daily/route.ts:44-229`; `web/src/app/dashboard/nutrients/page.tsx:36-245` | High | Unresolvable recipes and ingredients are skipped silently (`daily/route.ts:163,169`), so a total can under-report without telling the user. |
| UC9 Set nutrient goals | Goal retrieval and storage | `web/src/app/api/nutrients/goals/route.ts:37-149`; `web/src/app/dashboard/nutrients/page.tsx:110-112` | High | None. |
| UC10 Export a nutrient report | Export endpoint with format and range validation | `web/src/app/api/nutrients/export/route.ts:335-415` | High | The "pdf" option does not produce a PDF. The source states it returns a text summary and keeps the name "for API consistency" (`export/route.ts:328`). A user asking for a PDF does not receive one. |
| UC11 Review earned achievements | Achievement definitions, earned records, and re-check | `web/src/app/api/achievements/route.ts:52-227`; `web/src/app/api/achievements/check/route.ts:47-165`; `web/src/app/dashboard/achievements/page.tsx:24-181` | High | Progress measurement is reimplemented in `achievements/route.ts`, `achievements/check/route.ts`, and `challenges/route.ts`; the three must agree by hand. |
| UC12 Join a challenge | Challenge listing and join, with stale-participation handling | `web/src/app/api/challenges/join/route.ts:20-129`; `web/src/app/api/challenges/route.ts:43-235`; `web/src/app/dashboard/challenges/page.tsx:40-109` | High | Join failure surfaces through a raw browser alert rather than the notification mechanism used everywhere else (`challenges/page.tsx:81`). |
| UC13 Add an ingredient to inventory | Inventory item creation with merge-on-duplicate | `web/src/app/api/inventory/route.ts:160-265` | High | The merge overwrites the stored expiry date with the incoming one (`route.ts:214`), so adding a fresh batch silently extends the recorded expiry of older stock. |
| UC14 Review inventory and expiry alerts | Inventory listing, expiry classification, low-stock flag | `web/src/app/api/inventory/route.ts:14-153`; `web/src/app/dashboard/inventory/page.tsx:63-106` | High | `calculateExpirationStatus` exists in three verbatim copies: `inventory/route.ts:14-39`, `inventory/[id]/route.ts:8-33`, `inventory/expiring/route.ts:12-40`. One rule, three places to change. |
| UC15 Remove inventory items in bulk | Bulk removal with ownership scoping | `web/src/app/api/inventory/batch-delete/route.ts:8-51` | High | None. Ownership is scoped inside the query. |
| UC16 Get recipe suggestions from what is on hand | Inventory-driven suggestion flow and service contract | `web/src/app/dashboard/inventory/page.tsx:117-167`; `backend/api/index.py:64-94`; `backend/api/inventory_recommender.py:19`; `docs/user-guides/smart-suggestions.md:9-22` | High | The service reaches an external language model and cannot start without a key: `backend/api/recommender.py:121` constructs the client at module load, so the entire backend fails to import when the key is absent. Confirmed by running it. |
| UC17 Create a shopping list | Shopping list creation | `web/src/app/api/shopping-lists/route.ts:68-107`; `web/src/app/dashboard/shopping/page.tsx:34-107` | High | None. |
| UC18 Add items to a shopping list | Item creation with catalogue matching | `web/src/app/api/shopping-lists/[id]/items/route.ts:12-121`; `web/src/app/dashboard/shopping/[id]/page.tsx:118-141` | High | An unmatched item is stored by name only, which quietly disqualifies it from UC20, and the user is never told. |
| UC19 Generate a shopping list from the meal calendar | Generation from calendar entries | `web/src/app/api/shopping-lists/generate/route.ts:16-220` | High | Unresolvable ingredients are skipped silently (`generate/route.ts:142`), so a generated list can be incomplete without saying so. |
| UC20 Transfer purchased items into inventory | Transfer endpoint with merge and per-item error collection | `web/src/app/api/inventory/transfer/route.ts:15-127`; `web/src/hooks/useTransferToInventory.tsx`; `web/src/components/shopping/TransferFlow/` | High | The transfer writes inventory scoped to the authenticated user, but never verifies that the named shopping item belongs to that user before consuming it. |

## Findings recorded outside the twenty

These are properties of the product rather than user goals. They are recorded
here because they bear on where the project's own coverage is blind.

### F1 — An unreachable feature that also emits a dead link

`web/src/app/api/shopping-lists/share/route.ts` implements share-link creation and
retrieval. Three independent problems:

1. No ownership check. `POST` takes `shoppingListId` straight from the request body
   and mints a share token for it (`share/route.ts:15-31`). Unlike every other list
   route it never confirms the caller owns that list, and it builds its own client
   from the anonymous key (`share/route.ts:9-12`) instead of the session-bound
   server client used elsewhere.
2. The link points at a page that does not exist. The returned link is
   `/share/shopping/<token>` (`share/route.ts:36`). There is no `web/src/app/share/`
   directory and `next build` emits no `/share` route, confirmed in the build
   manifest. Every generated link is dead.
3. Nothing calls it. The only "Share" control in the product is an export menu
   offering clipboard and print (`web/src/app/dashboard/shopping/[id]/page.tsx:481-495`).

### F2 — Undocumented required configuration

`web/.env.example` and `INSTALL.md` omit four settings the code reads:
`SUPABASE_SERVICE_ROLE_KEY`, `BACKEND_URL`, `NEXT_PUBLIC_PYTHON_BACKEND_URL` and
`NEXT_PUBLIC_APP_URL`, plus the backend's `GEMINI_KEY`. Following `INSTALL.md`
exactly, `npm run build` fails. Confirmed: the build stops at
`Failed to collect page data for /api/achievements` with `supabaseKey is required`,
and succeeds once `SUPABASE_SERVICE_ROLE_KEY` is supplied.

### F3 — Why F2 survived: the build is never built in CI

No workflow under `.github/workflows/` runs `npm run build`. `ci-pytest.yml` is
titled "Backend CI" but contains only a Ruff lint job and never invokes pytest.
The green CI badge therefore covers frontend unit tests only; the production
build, the backend suite and the end-to-end suite all sit outside it.

### F4 — Duplicated rules that can drift

The expiry-classification rule exists in three verbatim copies (UC14). Meal and
streak progress measurement is reimplemented across three route files (UC11).
Neither has a single source of truth.
