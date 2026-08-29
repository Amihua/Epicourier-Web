# Epicourier Project 1a — Codex Reverse-Engineered Use Cases

These use cases were derived from the repository code as-is. The main success scenarios contain only happy-path behavior; code-visible alternatives and failures are recorded as extensions. Source references use repository-relative file paths and line numbers.

## UC1: Register account

| Part | Content |
|---|---|
| **Name** | Register account |
| **Primary actor** | Visitor |
| **Stakeholders & interests** | Visitor: obtain a usable personal account. Platform: create a valid, unique account and associated user profile. |
| **Preconditions** | Visitor is not signed in and can access the sign-up page. |
| **Trigger** | Visitor decides to create an Epicourier account. |
| **Main success scenario** | 1. Visitor supplies a username, email address, password, and matching password confirmation. 2. System validates the supplied values. 3. Visitor submits the registration request. 4. System creates the authentication account. 5. System associates the username with the new user record. 6. System confirms creation and sends the visitor to sign in. |
| **Extensions** | 2a: Password confirmation does not match → system shows a field error and does not submit (`web/src/app/signup/page.tsx:70-77`, `:94-98`). 4a: Email already belongs to an account → system rejects registration and identifies the email conflict (`web/src/app/signup/actions.ts:14-23`). 5a: Account exists but username update fails → system reports partial creation and advises signing in to update the profile (`web/src/app/signup/actions.ts:50-70`). |
| **Postconditions** | A new authentication account and user profile exist; the visitor is directed to the sign-in page. |

## UC2: Sign in

| Part | Content |
|---|---|
| **Name** | Sign in |
| **Primary actor** | Registered user |
| **Stakeholders & interests** | User: access personal planning data. Platform: admit only users with valid credentials. |
| **Preconditions** | User has an account and is signed out. |
| **Trigger** | User chooses to access the authenticated application. |
| **Main success scenario** | 1. User enters an email address and password. 2. System validates that both fields are present and the email has a valid form. 3. User submits the credentials. 4. System authenticates the credentials. 5. System refreshes the authenticated layout state. 6. System opens the recipe dashboard. |
| **Extensions** | 2a: Email is absent or malformed → system displays the corresponding field error and stops (`web/src/app/signin/page.tsx:28-52`). 4a: Credentials are invalid → system translates the response to “Incorrect email or password” and shows a destructive notification (`web/src/app/signin/page.tsx:55-70`). |
| **Postconditions** | User has an authenticated session and is viewing the recipe dashboard. |

## UC3: Browse recipes

| Part | Content |
|---|---|
| **Name** | Browse recipes |
| **Primary actor** | User |
| **Stakeholders & interests** | User: find relevant recipes efficiently. Platform: present recipe choices that reflect search, dietary tags, ingredients, and inventory fit. |
| **Preconditions** | User can access the recipe collection; recipe data is available. |
| **Trigger** | User opens the recipe collection or changes a search/filter choice. |
| **Main success scenario** | 1. System loads recipes and the user’s inventory. 2. User searches by text or selects ingredient and tag filters. 3. User selects an inventory-match category. 4. User selects a match-percentage ordering. 5. System displays the matching recipe page with inventory-match information. 6. User moves between result pages. |
| **Extensions** | 1a: Recipe request fails → the recipe hook records the returned failure and ends loading (`web/src/hooks/use-recipe.tsx:58-70`). 5a: No recipes match → system displays “No recipes found” (`web/src/app/dashboard/recipes/page.tsx:104-111`). 2a: User changes a search or filter → system resets results to page one (`web/src/app/dashboard/recipes/page.tsx:44-55`). |
| **Postconditions** | User has seen a page of recipes matching the active discovery criteria. |

## UC4: View recipe details

| Part | Content |
|---|---|
| **Name** | View recipe details |
| **Primary actor** | User |
| **Stakeholders & interests** | User: understand a recipe before planning or shopping for it. Platform: provide accurate preparation, sustainability, ingredient, tag, and nutrient information. |
| **Preconditions** | A recipe identifier is available from a recipe result or recommendation. |
| **Trigger** | User opens a recipe. |
| **Main success scenario** | 1. System retrieves the recipe identified by the request. 2. System displays its name, image, preparation time, green score, and description. 3. System displays its tags. 4. System displays ingredients and quantities. 5. System displays aggregated nutrient values. 6. System offers the recipe ingredients for shopping. |
| **Extensions** | 1a: The recipe cannot be found → system returns the not-found experience (`web/src/app/dashboard/recipes/[id]/page.tsx:18-23`). 2a: Recipe has no image → system omits the image rather than rendering an invalid one (`web/src/app/dashboard/recipes/[id]/page.tsx:28-37`). 3a: Recipe has no tags → system displays “No tags available” (`web/src/app/dashboard/recipes/[id]/page.tsx:57-68`). |
| **Postconditions** | User has seen all available details for the selected recipe. |

## UC5: Request a personalized meal plan

| Part | Content |
|---|---|
| **Name** | Request personalized meal plan |
| **Primary actor** | User |
| **Stakeholders & interests** | User: receive meals aligned with a stated dietary or wellness goal. Platform: return a usable plan while communicating recommendation failures. AI service: receive a supported request. |
| **Preconditions** | User can access the recommender and its backend service is configured. |
| **Trigger** | User wants meal recommendations for a personal goal. |
| **Main success scenario** | 1. User describes a goal. 2. User requests three, five, or seven meals. 3. System sends the goal and meal count to the recommender service. 4. System receives an expanded goal and recommended recipes. 5. System associates recommendations with known recipe records where possible. 6. System presents the plan and recipes. |
| **Extensions** | 1a: Goal is blank → system asks the user to enter a goal (`web/src/app/dashboard/recommender/page.tsx:27-33`). 2a: Meal count is not three, five, or seven → system rejects the choice (`web/src/app/dashboard/recommender/page.tsx:34-37`). 3a: Backend returns a non-success response → system exposes the response status and error (`web/src/app/dashboard/recommender/page.tsx:42-50`). 5a: Recipe-record lookup fails → system retains the recommendation without the database identifier (`web/src/app/dashboard/recommender/page.tsx:63-95`). |
| **Postconditions** | User has either a displayed personalized plan or a visible explanation that the request failed. |

## UC6: Schedule a meal

| Part | Content |
|---|---|
| **Name** | Schedule meal |
| **Primary actor** | User |
| **Stakeholders & interests** | User: plan a chosen recipe for a particular meal and date. Platform: store the meal under the correct authenticated user. |
| **Preconditions** | User is authenticated and has selected a recipe. |
| **Trigger** | User chooses to add the recipe to the calendar. |
| **Main success scenario** | 1. System presents the selected recipe for scheduling. 2. User chooses a date. 3. User chooses a meal type. 4. User confirms. 5. System creates an incomplete calendar entry for that recipe. 6. System confirms the meal was added. |
| **Extensions** | 2a: No date is selected → system displays “Date Required” and does not submit (`web/src/components/ui/AddMealModal.tsx:29-37`). 5a: Required recipe, date, or meal type is absent → API rejects the entry (`web/src/app/api/events/route.ts:111-119`). 5b: Entry creation fails → system shows a destructive “Failed to add” notification with the returned error (`web/src/components/ui/AddMealModal.tsx:50-64`). |
| **Postconditions** | A calendar entry links the authenticated user, recipe, date, meal type, and incomplete status. |

## UC7: Track meal completion

| Part | Content |
|---|---|
| **Name** | Track meal completion |
| **Primary actor** | User |
| **Stakeholders & interests** | User: see planned meals and record which were consumed. Platform: keep meal status and derived nutrient tracking consistent. |
| **Preconditions** | User is authenticated and has at least one scheduled meal. |
| **Trigger** | User opens the calendar or selects a scheduled meal. |
| **Main success scenario** | 1. System loads the user’s calendar entries. 2. System groups entries by date and meal type. 3. User opens a calendar event to see its meal entries. 4. User changes a meal’s completion status. 5. System updates the owned calendar entry. 6. System synchronizes daily nutrients, refreshes the calendar, and confirms the status. |
| **Extensions** | 1a: User is unauthorized → calendar redirects the user to sign in (`web/src/app/dashboard/calendar/page.tsx:85-94`). 5a: Status is not Boolean → API rejects the update (`web/src/app/api/events/[id]/route.ts:66-72`). 5b: Entry is missing or belongs to another user → API returns not found/unauthorized (`web/src/app/api/events/[id]/route.ts:75-89`). 6a: Nutrient synchronization fails → API reports the synchronization failure (`web/src/app/api/events/[id]/route.ts:93-106`). |
| **Postconditions** | The owned meal has the selected completion state and its day’s nutrient tracking is synchronized. |

## UC8: Review nutrient progress

| Part | Content |
|---|---|
| **Name** | Review nutrient progress |
| **Primary actor** | User |
| **Stakeholders & interests** | User: understand current intake and trends. Platform: summarize completed meal data consistently across time periods. |
| **Preconditions** | User is authenticated; completed meals may have generated nutrient records. |
| **Trigger** | User opens the nutrient dashboard or changes the month range. |
| **Main success scenario** | 1. System identifies today and the requested trend periods. 2. System retrieves today’s nutrient summary. 3. System retrieves seven daily summaries. 4. System retrieves weekly summaries for the current month. 5. System retrieves the selected number of monthly summaries. 6. System presents daily totals and trend datasets. |
| **Extensions** | 2a: A nutrient-summary request fails → system raises “Failed to fetch nutrient data” (`web/src/app/dashboard/nutrients/useNutrientDashboard.ts:133-140`). 2b: No daily record exists → dashboard uses an empty daily nutrient baseline (`web/src/app/dashboard/nutrients/useNutrientDashboard.ts:313-321`). 3a: Some trend periods contain no summary → system filters those empty periods out (`web/src/app/dashboard/nutrients/useNutrientDashboard.ts:203-223`). |
| **Postconditions** | User has seen the available daily, weekly, and monthly nutrient progress. |

## UC9: Set nutrient goals

| Part | Content |
|---|---|
| **Name** | Set nutrient goals |
| **Primary actor** | User |
| **Stakeholders & interests** | User: define personal daily nutrient targets. Platform: persist valid targets and compare progress against them. |
| **Preconditions** | User is authenticated and can access the nutrient dashboard. |
| **Trigger** | User chooses to create or change daily nutrient targets. |
| **Main success scenario** | 1. System loads the user’s existing goal. 2. System initializes the goal form from saved values or recommended defaults. 3. User enters daily calorie, protein, carbohydrate, fat, sodium, and fiber targets. 4. User submits the form. 5. System saves the targets. 6. System confirms the update and closes the goal form. |
| **Extensions** | 1a: Existing goal cannot be loaded → system records and displays a goal-loading error (`web/src/app/dashboard/nutrients/useNutrientDashboard.ts:236-260`). 5a: Goal API rejects the update → system shows “Save failed” with the returned reason (`web/src/app/dashboard/nutrients/useNutrientDashboard.ts:281-307`). |
| **Postconditions** | The user’s current daily nutrient targets are stored and available to the dashboard. |

## UC10: Export nutrient history

| Part | Content |
|---|---|
| **Name** | Export nutrient history |
| **Primary actor** | User |
| **Stakeholders & interests** | User: retain or share a dated nutrition record. Platform: export only the authenticated user’s data in a declared format. |
| **Preconditions** | User is authenticated and can access nutrient reporting. |
| **Trigger** | User requests a CSV or text-summary export for a date range. |
| **Main success scenario** | 1. User selects an export format and date range. 2. System requests nutrient data for the range. 3. System generates CSV or a text-based summary. 4. System supplies a dated filename. 5. Browser downloads the generated file. 6. System confirms successful export. |
| **Extensions** | 1a: No dates are supplied by the UI → system defaults to the thirty days ending today (`web/src/app/dashboard/nutrients/useNutrientExport.ts:13-21`). 2a: Start date follows end date → API rejects the range (`web/src/app/api/nutrients/export/route.ts:369-380`). 3a: Unsupported format is requested → API accepts only `csv` or `pdf` (`web/src/app/api/nutrients/export/route.ts:350-359`). 5a: Export request fails → system shows an “Export Failed” notification (`web/src/app/dashboard/nutrients/useNutrientExport.ts:36-74`). |
| **Postconditions** | A CSV or text-summary nutrition file for the requested period has been downloaded. |

## UC11: Review achievements

| Part | Content |
|---|---|
| **Name** | Review achievements |
| **Primary actor** | User |
| **Stakeholders & interests** | User: see earned rewards and progress toward available rewards. Platform: evaluate achievements against current activity. |
| **Preconditions** | User is authenticated. |
| **Trigger** | User opens achievements or asks the system to check progress. |
| **Main success scenario** | 1. System retrieves earned and available achievements. 2. User switches between earned and available views. 3. User requests a manual achievement check. 4. System evaluates current activity. 5. System identifies newly earned achievements. 6. System refreshes the achievement display. |
| **Extensions** | 1a: Achievement retrieval fails → system displays the returned error and offers Retry (`web/src/app/dashboard/achievements/page.tsx:27-42`, `:88-95`). 4a: Manual check fails → system logs the check error and ends the checking state (`web/src/app/dashboard/achievements/page.tsx:45-70`). 5a: No achievement is newly earned → system leaves the current list unchanged (`web/src/app/dashboard/achievements/page.tsx:60-65`). |
| **Postconditions** | User has seen current achievement status and any newly earned awards. |

## UC12: Join a wellness challenge

| Part | Content |
|---|---|
| **Name** | Join wellness challenge |
| **Primary actor** | User |
| **Stakeholders & interests** | User: choose a motivating challenge and track participation. Platform: prevent invalid participation and show current progress. |
| **Preconditions** | User is authenticated and challenges exist. |
| **Trigger** | User opens challenges and chooses one to join. |
| **Main success scenario** | 1. System retrieves active, joined, and completed challenges. 2. User browses challenges by time or category. 3. User selects an active challenge. 4. System records the user’s participation. 5. System reloads challenge progress. 6. System opens the joined-challenges view. |
| **Extensions** | 1a: Challenge retrieval fails → system displays the returned failure (`web/src/app/dashboard/challenges/page.tsx:43-58`). 4a: Join request fails → system alerts the user with the returned reason (`web/src/app/dashboard/challenges/page.tsx:61-84`). |
| **Postconditions** | The selected challenge is associated with the user and appears in the joined view. |

## UC13: Review inventory

| Part | Content |
|---|---|
| **Name** | Review inventory |
| **Primary actor** | User |
| **Stakeholders & interests** | User: know what food is available, where it is stored, and what needs attention. Platform: expose only the authenticated user’s inventory. |
| **Preconditions** | User is authenticated. |
| **Trigger** | User opens inventory or changes a location/search filter. |
| **Main success scenario** | 1. System loads the user’s inventory summary and items. 2. System calculates expiration and low-stock status. 3. User searches by ingredient name. 4. User filters by pantry, fridge, freezer, or other location. 5. User chooses all items or expiring items. 6. System displays the filtered items and summary. |
| **Extensions** | 1a: User is unauthenticated → API returns unauthorized and UI asks the user to sign in (`web/src/app/api/inventory/route.ts:50-61`; `web/src/app/dashboard/inventory/page.tsx:84-94`). 1b: Inventory request fails → system shows “Failed to load inventory” (`web/src/app/dashboard/inventory/page.tsx:95-107`). 5a: User changes location while viewing expiring items → system returns to the all-items view (`web/src/app/dashboard/inventory/page.tsx:191-203`). |
| **Postconditions** | User has seen their inventory under the selected search, location, and expiration view. |

## UC14: Add inventory item

| Part | Content |
|---|---|
| **Name** | Add inventory item |
| **Primary actor** | User |
| **Stakeholders & interests** | User: record available food accurately. Platform: associate a valid ingredient and quantity with the authenticated user. |
| **Preconditions** | User is authenticated and the ingredient catalog is available. |
| **Trigger** | User chooses to add an item to inventory. |
| **Main success scenario** | 1. User searches for and selects a known ingredient. 2. User supplies quantity and storage location. 3. User optionally supplies unit, expiration date, minimum quantity, and notes. 4. User submits the item. 5. System creates the inventory record. 6. System confirms the addition and refreshes inventory. |
| **Extensions** | 1a: No catalog ingredient is selected → system requires an ingredient (`web/src/components/inventory/AddInventoryModal.tsx:102-112`). 2a: Quantity is not positive → system rejects it as invalid (`web/src/components/inventory/AddInventoryModal.tsx:114-122`). 5a: Same ingredient already exists in the same location → system adds the submitted amount to its existing quantity (`web/src/app/api/inventory/route.ts:197-218`). 5b: Ingredient does not exist → API returns “Ingredient not found” (`web/src/app/api/inventory/route.ts:186-195`). |
| **Postconditions** | Inventory contains the submitted item, or the matching item’s quantity has increased. |

## UC15: Edit inventory item

| Part | Content |
|---|---|
| **Name** | Edit inventory item |
| **Primary actor** | User |
| **Stakeholders & interests** | User: keep quantity, location, expiry, threshold, and notes accurate. Platform: update only inventory owned by the authenticated user. |
| **Preconditions** | User is authenticated and owns the selected inventory item. |
| **Trigger** | User opens an inventory item for editing. |
| **Main success scenario** | 1. System fills the form with the item’s current values. 2. User changes one or more editable values. 3. System validates the quantity. 4. User submits the changes. 5. System updates the owned item and recalculates expiry and low-stock status. 6. System confirms and refreshes inventory. |
| **Extensions** | 3a: Quantity is not positive in the UI → system shows “Invalid Quantity” (`web/src/components/inventory/EditInventoryModal.tsx:61-74`). 5a: Item is absent or not owned by the user → API returns “Inventory item not found” (`web/src/app/api/inventory/[id]/route.ts:107-117`). 5b: Storage location is outside the supported set → API returns “Invalid location” (`web/src/app/api/inventory/[id]/route.ts:135-140`). 5c: Update request body is invalid → API returns an invalid-body error (`web/src/app/api/inventory/[id]/route.ts:181-184`). |
| **Postconditions** | The selected owned inventory item reflects the submitted valid values and recalculated status. |

## UC16: Remove inventory items

| Part | Content |
|---|---|
| **Name** | Remove inventory items |
| **Primary actor** | User |
| **Stakeholders & interests** | User: remove consumed, discarded, or incorrect stock. Platform: delete only items owned by the authenticated user. |
| **Preconditions** | User is authenticated and owns one or more inventory items. |
| **Trigger** | User chooses an item or selection of items to delete. |
| **Main success scenario** | 1. User enters inventory selection mode. 2. User selects one or more displayed items. 3. System presents the selected items for confirmation. 4. User confirms deletion. 5. System deletes the selected owned items. 6. System reports the deleted count and refreshes inventory. |
| **Extensions** | 2a: No items are supplied → batch API rejects the empty identifier array (`web/src/app/api/inventory/batch-delete/route.ts:21-27`). 2b: An identifier is not a string → batch API rejects the selection (`web/src/app/api/inventory/batch-delete/route.ts:29-32`). 5a: Deletion fails → system keeps the user in context and shows a retry message (`web/src/components/inventory/BatchDeleteDialog.tsx:47-65`). |
| **Postconditions** | Selected owned items no longer appear in inventory; unselected items remain. |

## UC17: Get inventory-based recipe suggestions

| Part | Content |
|---|---|
| **Name** | Get inventory-based recipe suggestions |
| **Primary actor** | User |
| **Stakeholders & interests** | User: use available or expiring ingredients and identify missing ingredients. Platform: reduce food waste through relevant recommendations. AI service: receive normalized inventory input. |
| **Preconditions** | User is authenticated, inventory has items, and the recommendation backend is available. |
| **Trigger** | User requests recipe suggestions from the inventory page. |
| **Main success scenario** | 1. System gathers the displayed inventory items. 2. System maps each item to ingredient, quantity, unit, and expiration data. 3. System requests five inventory-based recipes. 4. Recommendation service evaluates inventory fit and expiration urgency. 5. System receives recipe suggestions and missing-ingredient information. 6. System displays the recommendations. |
| **Extensions** | 1a: Inventory is empty → system asks the user to add ingredients first (`web/src/app/dashboard/inventory/page.tsx:117-125`). 3a: Recommendation backend returns an error → system reports that suggestions failed and advises checking the backend (`web/src/app/dashboard/inventory/page.tsx:141-165`). 5a: User asks to add missing ingredients to shopping → system currently reports “Coming Soon” instead of performing the operation (`web/src/app/dashboard/inventory/page.tsx:171-176`). |
| **Postconditions** | User has seen inventory-based suggestions, or a visible reason they could not be generated. |

## UC18: Create shopping list

| Part | Content |
|---|---|
| **Name** | Create shopping list |
| **Primary actor** | User |
| **Stakeholders & interests** | User: organize groceries in a named list. Platform: store lists under the correct authenticated owner. |
| **Preconditions** | User is authenticated and can access shopping lists. |
| **Trigger** | User chooses to create a shopping list. |
| **Main success scenario** | 1. System displays existing active lists and their progress. 2. User starts a new list. 3. User provides a name and optional description. 4. User submits the list. 5. System stores the active list under the user. 6. System confirms creation and refreshes the list collection. |
| **Extensions** | 1a: User is not authenticated → system asks the user to sign in (`web/src/app/dashboard/shopping/page.tsx:26-40`). 3a: Name is blank → system requires a list name (`web/src/components/shopping/CreateListModal.tsx:37-47`). 5a: Storage fails → system displays “Failed to create shopping list” (`web/src/components/shopping/CreateListModal.tsx:65-79`). |
| **Postconditions** | A new active shopping list owned by the user appears in the collection. |

## UC19: Generate shopping list from meal plan

| Part | Content |
|---|---|
| **Name** | Generate shopping list from meal plan |
| **Primary actor** | User |
| **Stakeholders & interests** | User: turn planned meals into a consolidated grocery list. Platform: aggregate recipe ingredients without losing ownership or date scope. |
| **Preconditions** | User is authenticated and has scheduled meals with recipes. |
| **Trigger** | User chooses to generate a shopping list from calendar meals. |
| **Main success scenario** | 1. User selects a start date and end date. 2. User selects one or more meal types and optionally names the list. 3. System retrieves the user’s scheduled recipes in that range. 4. System retrieves and combines their ingredients. 5. System creates a shopping list and its ingredient items. 6. System reports meal/item counts and opens the new list. |
| **Extensions** | 2a: No meal type is selected → system asks for at least one (`web/src/components/shopping/GenerateShoppingListModal.tsx:82-90`). 1a: Start date follows end date → system rejects the range (`web/src/components/shopping/GenerateShoppingListModal.tsx:92-99`). 3a: No meals exist in the range → API returns not found and UI reports “No meals found” (`web/src/app/api/shopping-lists/generate/route.ts:76-87`; `web/src/components/shopping/GenerateShoppingListModal.tsx:115-121`). 4a: Recipe ingredients cannot be retrieved → API reports the failure (`web/src/app/api/shopping-lists/generate/route.ts:102-120`). |
| **Postconditions** | A new owned shopping list contains consolidated ingredients from the selected planned meals. |

## UC20: Complete shopping and stock inventory

| Part | Content |
|---|---|
| **Name** | Complete shopping and stock inventory |
| **Primary actor** | User |
| **Stakeholders & interests** | User: track purchased items and move them into household inventory. Platform: preserve quantities, locations, expiry data, and list progress. |
| **Preconditions** | User is authenticated and owns a shopping list containing items linked to ingredients. |
| **Trigger** | User marks shopping items purchased and chooses to transfer them to inventory. |
| **Main success scenario** | 1. User adds, removes, or checks items while shopping. 2. User selects checked ingredient-linked items for transfer. 3. User assigns storage locations and optional expiration dates. 4. System adds new inventory records or increases matching inventory quantities. 5. System marks transferred shopping items checked. 6. When no items remain, system removes the completed list and returns to shopping lists. |
| **Extensions** | 1a: Item name is blank when adding → API rejects it (`web/src/app/api/shopping-lists/[id]/items/route.ts:38-44`). 1b: Updating or deleting an item fails → UI reloads the list to reverse optimistic state (`web/src/app/dashboard/shopping/[id]/page.tsx:147-177`, `:180-211`). 2a: No eligible item is selected → transfer dialog does not submit (`web/src/components/shopping/TransferFlow/BatchTransferModal.tsx:94-102`). 4a: A particular inventory update/insert fails → API skips that item and returns it in the error collection (`web/src/app/api/inventory/transfer/route.ts:46-114`). 6a: Completing the list fails → UI reports the failure and reloads the list (`web/src/app/dashboard/shopping/[id]/page.tsx:235-261`). |
| **Postconditions** | Successfully transferred purchases are represented in inventory and checked in the shopping list; a fully processed list is removed. |

## Coverage boundary

The repository contains additional user-facing behavior (for example push-notification subscription, shopping-list sharing/printing, and sign-out), but these were not promoted into the requested top 20 because the selected set prioritizes the major planning, nutrition, inventory, gamification, and grocery workflows evidenced by the current implementation. They should be reconsidered when the team reconciles outputs from the other LLMs.
