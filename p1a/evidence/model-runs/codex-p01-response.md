## UC1: Create account

| Part | Content |
|---|---|
| **Name** | Create account |
| **Primary actor** | New user |
| **Stakeholders & interests** | New user: secure access to personalized features. Platform: valid, unique account information. |
| **Preconditions** | User is not signed in and can access the registration page. |
| **Trigger** | User decides to register for Epicourier. |
| **Main success scenario** | 1. User provides a username, email address, password, and matching password confirmation. 2. System validates the information. 3. System creates the account and associated user profile. 4. System confirms success and directs the user to sign in. |
| **Extensions** | 2a: Required or formatted information is invalid → system identifies the affected fields. 2b: Passwords do not match or the password is too weak → system rejects submission and explains the requirement. 3a: Account creation fails or the email is already registered → system reports the error without creating another account. |
| **Postconditions** | A new account and user profile exist, and the user can proceed to sign in. |

## UC2: Sign in

| Part | Content |
|---|---|
| **Name** | Sign in |
| **Primary actor** | Registered user |
| **Stakeholders & interests** | User: secure access to personal data and features. Platform: prevent unauthorized access. |
| **Preconditions** | User has an Epicourier account and is signed out. |
| **Trigger** | User submits sign-in credentials. |
| **Main success scenario** | 1. User enters an email address and password. 2. System validates the input. 3. System authenticates the credentials. 4. System establishes the user session and opens the recipe collection. |
| **Extensions** | 2a: Email or password is missing or malformed → system displays field-specific validation. 3a: Credentials are incorrect → system reports that the email or password is incorrect. 3b: Authentication encounters an unexpected failure → system asks the user to try again. |
| **Postconditions** | An authenticated session exists and the user can access protected features. |

## UC3: Find recipes

| Part | Content |
|---|---|
| **Name** | Find recipes |
| **Primary actor** | Registered user |
| **Stakeholders & interests** | User: quickly discover suitable meals. Platform: return relevant, understandable results. |
| **Preconditions** | User is signed in and recipe data is available. |
| **Trigger** | User opens the recipe collection or specifies search criteria. |
| **Main success scenario** | 1. User searches by text or chooses ingredient and tag criteria. 2. System retrieves matching recipes. 3. User optionally filters or sorts recipes by inventory-match percentage. 4. System presents the resulting recipe collection and supports moving through result pages. |
| **Extensions** | 2a: No recipe matches the criteria → system reports that no recipes were found. 2b: Recipe retrieval is still in progress → system displays a loading state. 3a: The user has no matching inventory ingredients → system may place recipes in the lower match categories. |
| **Postconditions** | The user is shown recipes matching the active search, filters, sorting, and page selection. |

## UC4: View recipe

| Part | Content |
|---|---|
| **Name** | View recipe |
| **Primary actor** | Registered user |
| **Stakeholders & interests** | User: assess whether and how to prepare a meal. Nutrition-conscious user: understand nutrient content. |
| **Preconditions** | A recipe exists and the user has selected it. |
| **Trigger** | User opens a recipe from a recipe result or recommendation. |
| **Main success scenario** | 1. System retrieves the selected recipe. 2. System presents its name, image, preparation time, sustainability score, and description. 3. System presents tags and required ingredients. 4. System presents calculated nutrient information. |
| **Extensions** | 1a: Recipe cannot be found → system displays its not-found outcome. 2a: Optional image or tags are absent → system omits the image or reports that no tags are available while showing the remaining details. |
| **Postconditions** | The user has the available preparation, ingredient, sustainability, and nutrition details for the recipe. |

## UC5: Add recipe ingredients

| Part | Content |
|---|---|
| **Name** | Add recipe ingredients |
| **Primary actor** | Registered user |
| **Stakeholders & interests** | User: obtain the ingredients needed for a chosen recipe. Platform: avoid losing existing shopping-list contents. |
| **Preconditions** | User is viewing a recipe with ingredients and has access to shopping lists. |
| **Trigger** | User decides to add the recipe’s ingredients to a shopping list. |
| **Main success scenario** | 1. User requests to add the recipe ingredients. 2. System presents the user’s available shopping lists. 3. User selects an existing list or supplies a name for a new list. 4. System adds the recipe ingredients and confirms success. |
| **Extensions** | 2a: Shopping lists cannot be loaded → system reports the failure. 3a: User chooses to create a list but provides no valid name → system does not submit the request. 4a: An ingredient or list update fails → system reports the error without claiming success. |
| **Postconditions** | The selected shopping list contains the recipe ingredients, or a new list containing them exists. |

## UC6: Generate meal plan

| Part | Content |
|---|---|
| **Name** | Generate meal plan |
| **Primary actor** | Registered user |
| **Stakeholders & interests** | User: receive meals aligned with a health or dietary goal. Platform: provide relevant and explainable recommendations. |
| **Preconditions** | User is signed in and the recommendation service is available. |
| **Trigger** | User asks for a personalized daily plan. |
| **Main success scenario** | 1. User describes a goal and selects three, five, or seven meals. 2. System validates the request. 3. System generates an expanded nutrition plan and recommended recipes. 4. System presents each recommendation with its ingredients, tags, recipe content, and reason for recommendation. |
| **Extensions** | 2a: Goal is blank → system asks the user to enter a goal. 2b: Meal count is not supported → system requires three, five, or seven meals. 3a: Recommendation generation fails → system reports the service error and presents no false results. |
| **Postconditions** | A personalized plan and its recommended meals are available for the user to review. |

## UC7: Schedule recommended meal

| Part | Content |
|---|---|
| **Name** | Schedule recommended meal |
| **Primary actor** | Registered user |
| **Stakeholders & interests** | User: turn a recommendation into a concrete meal plan. Platform: preserve the chosen recipe, date, and meal type accurately. |
| **Preconditions** | The user has generated a recommendation that corresponds to a stored recipe. |
| **Trigger** | User chooses to add a recommended recipe to the calendar. |
| **Main success scenario** | 1. User selects a recommended recipe for scheduling. 2. User chooses a date and breakfast, lunch, or dinner. 3. System creates an incomplete calendar entry for that recipe. 4. System confirms the addition. |
| **Extensions** | 1a: Recommendation has no corresponding stored recipe identifier → scheduling is unavailable for that recommendation. 2a: No date is selected → system asks the user to select one. 3a: Calendar entry creation fails → system reports the failure and retains no success claim. |
| **Postconditions** | The selected recipe is scheduled on the chosen date with the chosen meal type. |

## UC8: Review meal calendar

| Part | Content |
|---|---|
| **Name** | Review meal calendar |
| **Primary actor** | Registered user |
| **Stakeholders & interests** | User: understand upcoming and past meal plans. Platform: display the user’s schedule accurately. |
| **Preconditions** | User is signed in and can access the calendar. |
| **Trigger** | User opens the meal calendar. |
| **Main success scenario** | 1. System retrieves the user’s planned meals. 2. System groups scheduled entries for display on their dates. 3. User switches among month, week, or day views and selects a scheduled meal. 4. System presents the meal’s type, date, status, and available recipe details. |
| **Extensions** | 1a: No meals have been scheduled → system displays an empty calendar. 3a: Several meals occupy the selected calendar entry → system lets the user move among their details. |
| **Postconditions** | The user can see the current meal schedule and the details of selected entries. |

## UC9: Complete planned meal

| Part | Content |
|---|---|
| **Name** | Complete planned meal |
| **Primary actor** | Registered user |
| **Stakeholders & interests** | User: maintain an accurate meal history. Nutrition and achievement features: receive accurate completion data. |
| **Preconditions** | At least one meal is scheduled on the calendar. |
| **Trigger** | User indicates that a planned meal was completed. |
| **Main success scenario** | 1. User opens a scheduled meal. 2. User marks the meal as completed. 3. System updates the meal’s status. 4. System reloads the calendar and confirms completion. |
| **Extensions** | 2a: User selects a group of meals → system can mark all displayed meals completed. 2b: User reverses a completed meal → system marks it incomplete. 3a: Status update fails → system reports the error and does not confirm completion. |
| **Postconditions** | The selected meal or meals have the requested completion status. |

## UC10: Generate shopping list

| Part | Content |
|---|---|
| **Name** | Generate shopping list |
| **Primary actor** | Registered user |
| **Stakeholders & interests** | User: obtain one consolidated grocery list from planned meals. Platform: derive ingredients from only the requested schedule range. |
| **Preconditions** | User is signed in and has scheduled meals. |
| **Trigger** | User requests a shopping list from the meal calendar. |
| **Main success scenario** | 1. User chooses a date range and included meal types. 2. User supplies a list name. 3. System gathers ingredients from matching planned meals and aggregates them. 4. System creates the shopping list and reports its item count. |
| **Extensions** | 1a: Date range is invalid or no meal type is selected → system rejects the request with an explanation. 2a: List name is empty → system asks for a name. 3a: No qualifying meals or ingredients are found → system reports that it cannot generate a populated list. 4a: Creation fails → system reports the failure. |
| **Postconditions** | A named shopping list containing aggregated ingredients from the selected meal plan exists. |

## UC11: Create shopping list

| Part | Content |
|---|---|
| **Name** | Create shopping list |
| **Primary actor** | Registered user |
| **Stakeholders & interests** | User: organize grocery needs in a separate list. Platform: associate the list with the correct user. |
| **Preconditions** | User is signed in and can access shopping lists. |
| **Trigger** | User decides to start a new shopping list. |
| **Main success scenario** | 1. User supplies a list name and optional description. 2. System validates the request. 3. System creates the list for the user. 4. System closes the creation flow and displays the refreshed list collection. |
| **Extensions** | 1a: Name is blank → system prevents creation. 3a: User is no longer authenticated → system requests sign-in. 3b: List creation fails → system reports the error and keeps the creation flow available. |
| **Postconditions** | A new shopping list owned by the user exists. |

## UC12: Maintain shopping list

| Part | Content |
|---|---|
| **Name** | Maintain shopping list |
| **Primary actor** | Registered user |
| **Stakeholders & interests** | User: keep grocery-list metadata and lifecycle current. Platform: preserve recoverability when a list is removed. |
| **Preconditions** | User owns at least one shopping list. |
| **Trigger** | User decides to rename, describe, or remove a shopping list. |
| **Main success scenario** | 1. User selects a list to edit. 2. User changes its name or description. 3. System saves and displays the updated list. 4. When the list is no longer needed, user confirms deletion and system archives it. |
| **Extensions** | 2a: Updated name is invalid → system rejects the change. 3a: Saving fails → system reports the error and retains the prior stored values. 4a: User cancels deletion → system leaves the list active. 4b: User invokes the offered undo action → system restores the archived list. |
| **Postconditions** | The list contains the saved metadata or is archived according to the user’s confirmed action. |

## UC13: Manage shopping items

| Part | Content |
|---|---|
| **Name** | Manage shopping items |
| **Primary actor** | Registered user |
| **Stakeholders & interests** | User: maintain an accurate grocery checklist and shopping progress. Platform: persist item state reliably. |
| **Preconditions** | User owns and has opened a shopping list. |
| **Trigger** | User adds or updates an item while preparing or using the list. |
| **Main success scenario** | 1. User enters an item to add. 2. System adds it to the list. 3. User marks items checked as they are obtained. 4. System saves the checked state and updates progress. 5. User may remove an item that is no longer required. |
| **Extensions** | 1a: Item name is blank → system prevents submission. 2a: Item creation fails → system reports the failure. 3a: User marks all remaining items complete → system checks each remaining item. 5a: Item deletion fails → system reports the failure and refreshes the list state. |
| **Postconditions** | The shopping list’s items, checked states, and progress reflect the successful user actions. |

## UC14: Transfer purchases

| Part | Content |
|---|---|
| **Name** | Transfer purchases |
| **Primary actor** | Registered user |
| **Stakeholders & interests** | User: update home inventory after shopping without re-entering purchases. Inventory feature: receive quantities, storage locations, and expiration information. |
| **Preconditions** | User has a shopping list containing purchased items linked to known ingredients. |
| **Trigger** | User marks an individual item as purchased or completes shopping for checked items. |
| **Main success scenario** | 1. User selects one purchased item or a batch of checked items. 2. User confirms quantities, locations, and expiration dates. 3. System transfers the selected items into inventory. 4. System removes transferred items from the shopping list. 5. When the list is exhausted, system completes the list and returns the user to the list collection. |
| **Extensions** | 1a: A checked item lacks a known ingredient association → system excludes it from inventory transfer. 2a: Required transfer details are invalid → system asks the user to correct them. 3a: Transfer fails → system reports the error and refreshes the shopping list. |
| **Postconditions** | Successfully transferred purchases exist in inventory and no longer remain as pending shopping-list items. |

## UC15: Add inventory item

| Part | Content |
|---|---|
| **Name** | Add inventory item |
| **Primary actor** | Registered user |
| **Stakeholders & interests** | User: maintain an accurate record of food on hand. Waste-reduction features: receive quantity and expiration data. |
| **Preconditions** | User is signed in and can access inventory. |
| **Trigger** | User decides to record an ingredient currently on hand. |
| **Main success scenario** | 1. User searches for and selects a known ingredient. 2. User supplies quantity, unit, storage location, and optional expiration date, minimum quantity, and notes. 3. System validates and stores the inventory item. 4. System confirms success and refreshes the inventory. |
| **Extensions** | 1a: No ingredient is selected → system asks the user to select one. 2a: Quantity is invalid → system rejects the submission. 3a: The ingredient is already recorded in that location or storage fails → system reports the error rather than creating an invalid duplicate. |
| **Postconditions** | The selected ingredient is recorded in the user’s inventory with the supplied details. |

## UC16: Maintain inventory item

| Part | Content |
|---|---|
| **Name** | Maintain inventory item |
| **Primary actor** | Registered user |
| **Stakeholders & interests** | User: keep quantities, storage, and freshness information accurate. Recommendation and alert features: operate on current data. |
| **Preconditions** | User owns at least one inventory item. |
| **Trigger** | User decides to update or remove an inventory item. |
| **Main success scenario** | 1. User selects an inventory item. 2. User changes its quantity, unit, location, expiration date, minimum quantity, or notes. 3. System validates and saves the changes. 4. If the item is no longer held, user confirms deletion and system removes it. |
| **Extensions** | 2a: Updated quantity or minimum quantity is invalid → system rejects the change. 3a: Saving fails → system reports the error and does not claim success. 4a: User cancels deletion → system retains the item. 4b: User selects multiple items for removal → system requests batch confirmation and removes the authorized set. |
| **Postconditions** | The inventory reflects the successfully saved changes or confirmed removals. |

## UC17: Review inventory alerts

| Part | Content |
|---|---|
| **Name** | Review inventory alerts |
| **Primary actor** | Registered user |
| **Stakeholders & interests** | User: identify food requiring timely use or replenishment. Sustainability stakeholders: reduce avoidable food waste. |
| **Preconditions** | User has inventory items, including expiration or minimum-quantity information where applicable. |
| **Trigger** | User opens inventory or chooses an alert summary. |
| **Main success scenario** | 1. System retrieves the user’s inventory. 2. System highlights items expiring soon and items below their minimum quantity. 3. User chooses an alert summary or storage location. 4. System filters the inventory to the relevant items. 5. User may search the filtered inventory by ingredient name. |
| **Extensions** | 2a: No items meet an alert condition → system omits or shows an empty alert state. 4a: User clears the alert or location filter → system restores the full inventory view. 5a: Search has no matches → system presents an empty filtered result. |
| **Postconditions** | The user can identify the inventory items needing timely use or replenishment. |

## UC18: Get inventory recommendations

| Part | Content |
|---|---|
| **Name** | Get inventory recommendations |
| **Primary actor** | Registered user |
| **Stakeholders & interests** | User: find meals that use available and expiring ingredients. Platform: provide transparent coverage and missing-ingredient information. |
| **Preconditions** | User is signed in, has inventory items, and the inventory recommendation service is available. |
| **Trigger** | User requests recipe suggestions from inventory. |
| **Main success scenario** | 1. System gathers the user’s available ingredients and expiration information. 2. System requests recipes suited to that inventory. 3. System ranks and returns recommendations. 4. System presents match coverage, missing ingredients, expiring ingredients used, and recommendation reasoning. 5. User opens a suggested recipe for more detail. |
| **Extensions** | 1a: Inventory is empty → system asks the user to add ingredients first. 2a: Recommendation service fails → system reports that suggestions could not be generated. 3a: No recipes are returned → system presents an empty recommendation result. 4a: User requests adding missing ingredients to a shopping list → system labels this action as coming soon and does not claim the ingredients were added. |
| **Postconditions** | The user receives available inventory-based recipe suggestions and can inspect a selected recipe. |

## UC19: Review nutrient progress

| Part | Content |
|---|---|
| **Name** | Review nutrient progress |
| **Primary actor** | Registered user |
| **Stakeholders & interests** | User: understand nutrition over time. Health professional or personal archive recipient: receive portable nutrition records when requested. |
| **Preconditions** | User is signed in; completed meal data may exist. |
| **Trigger** | User opens nutrient tracking or requests an export. |
| **Main success scenario** | 1. User selects a daily, weekly, or monthly period and reference date. 2. System calculates nutrient totals from the user’s completed meals. 3. System presents calories, macronutrients, trends, and progress relative to goals. 4. User optionally chooses an export format and date range. 5. System produces and downloads the nutrition report. |
| **Extensions** | 2a: No completed-meal nutrient data exists for the period → system displays an empty-data state. 2b: Nutrient retrieval fails → system reports the problem and offers a retry. 4a: Export parameters are invalid → system rejects the request. 5a: Export generation fails → system reports the failure without downloading a misleading report. |
| **Postconditions** | The user has viewed nutrition progress for the chosen period and, if requested successfully, has an exported report. |

## UC20: Set nutrient goal

| Part | Content |
|---|---|
| **Name** | Set nutrient goal |
| **Primary actor** | Registered user |
| **Stakeholders & interests** | User: compare actual intake with personal daily targets. Platform: retain one current set of valid targets. |
| **Preconditions** | User is signed in and can access nutrient tracking. |
| **Trigger** | User chooses to set or edit nutrient goals. |
| **Main success scenario** | 1. System loads the user’s current goals, if any. 2. User enters daily targets for calories, protein, carbohydrates, fats, sodium, and fiber, or applies recommended values. 3. System validates the targets. 4. System saves the goals. 5. System recalculates and displays nutrient progress against the saved targets. |
| **Extensions** | 1a: Existing goals cannot be loaded → system reports the loading problem. 3a: A target is invalid → system identifies the invalid goal rather than saving it. 4a: Saving fails → system reports the failure and retains the previously stored goals. |
| **Postconditions** | Valid daily nutrient goals are stored and available for progress calculations. |

| UC | Permitted product evidence | File and line | Confidence | Concern |
|---|---|---|---|---|
| UC1 | Registration form validates username, email, password, and confirmation, then creates the account and redirects to sign-in. | `web/src/app/signup/page.tsx:31`; `web/src/app/signup/page.tsx:82`; `web/src/app/signup/page.tsx:117`; `web/src/app/signup/actions.ts:8` | High | Account creation can still depend on external authentication configuration. |
| UC2 | Sign-in validates credentials, authenticates with a password, and redirects to the recipe dashboard. | `web/src/app/signin/page.tsx:21`; `web/src/app/signin/page.tsx:55`; `web/src/app/signin/actions.ts:8`; `web/src/app/signin/actions.ts:18`; `web/src/app/signin/actions.ts:25` | High | None material. |
| UC3 | Recipe collection accepts text, ingredient, and tag filters plus inventory-match filtering, sorting, and pagination. | `web/src/app/dashboard/recipes/page.tsx:14`; `web/src/app/dashboard/recipes/page.tsx:25`; `web/src/app/dashboard/recipes/page.tsx:44`; `web/src/app/dashboard/recipes/page.tsx:58`; `web/src/app/dashboard/recipes/page.tsx:119` | High | Match quality depends on the accuracy of the user’s inventory. |
| UC4 | Recipe detail displays core metadata, ingredients, tags, and calculated nutrients, with not-found handling. | `web/src/app/dashboard/recipes/[id]/page.tsx:18`; `web/src/app/dashboard/recipes/[id]/page.tsx:21`; `web/src/app/dashboard/recipes/[id]/page.tsx:39`; `web/src/app/dashboard/recipes/[id]/page.tsx:52`; `web/src/app/dashboard/recipes/[id]/page.tsx:71`; `web/src/app/dashboard/recipes/[id]/page.tsx:87` | High | No preparation-instruction field distinct from the recipe description is displayed here. |
| UC5 | Recipe details expose an add-to-cart action that receives the recipe’s ingredients and supports shopping-list selection or creation. | `web/src/app/dashboard/recipes/[id]/page.tsx:40`; `web/src/app/dashboard/recipes/[id]/page.tsx:43`; `web/src/components/shopping/AddToCartButton.tsx:20` | Medium | The detailed interaction is encapsulated in the component; behavior depends on shopping-list service availability. |
| UC6 | User submits a free-text goal and supported meal count; the system returns an expanded plan and recommended recipes. | `web/src/app/dashboard/recommender/page.tsx:20`; `web/src/app/dashboard/recommender/page.tsx:27`; `web/src/app/dashboard/recommender/page.tsx:42`; `web/src/app/dashboard/recommender/page.tsx:60`; `web/src/app/dashboard/recommender/page.tsx:108`; `web/src/app/dashboard/recommender/page.tsx:214` | High | Results depend on the recommendation backend and its configured model service. |
| UC7 | Recommended recipes use the meal modal, which records recipe, date, meal type, and incomplete status through the events service. | `web/src/app/dashboard/recommender/page.tsx:7`; `web/src/components/ui/AddMealModal.tsx:24`; `web/src/components/ui/AddMealModal.tsx:29`; `web/src/components/ui/AddMealModal.tsx:39`; `web/src/components/ui/AddMealModal.tsx:42` | High | Scheduling requires a recommendation that can be associated with a stored recipe ID. |
| UC8 | Calendar loads events, provides month/week/day views, opens selected events, and presents meal details. | `web/src/app/dashboard/calendar/page.tsx:86`; `web/src/app/dashboard/calendar/page.tsx:159`; `web/src/app/dashboard/calendar/page.tsx:303`; `web/src/app/dashboard/calendar/page.tsx:319`; `web/src/app/dashboard/calendar/page.tsx:323`; `web/src/components/ui/MealDetailModal.tsx:121` | High | None material. |
| UC9 | Calendar entries can be marked complete or incomplete individually or in a displayed group. | `web/src/app/dashboard/calendar/page.tsx:174`; `web/src/app/dashboard/calendar/page.tsx:181`; `web/src/components/ui/MealDetailModal.tsx:87`; `web/src/components/ui/MealDetailModal.tsx:103`; `web/src/components/ui/MealDetailModal.tsx:176` | High | Nutrient and achievement consequences are derived elsewhere and may not update instantaneously. |
| UC10 | Calendar exposes implemented shopping-list generation with date range, meal-type selection, and a creation request. | `web/src/app/dashboard/calendar/page.tsx:242`; `web/src/app/dashboard/calendar/page.tsx:312`; `web/src/components/shopping/GenerateShoppingListModal.tsx:82`; `web/src/components/shopping/GenerateShoppingListModal.tsx:104`; `web/src/components/shopping/GenerateShoppingListModal.tsx:159`; `web/src/components/shopping/GenerateShoppingListModal.tsx:233` | High | User guide labels an older version of this capability “Coming Soon,” but current product code implements it. |
| UC11 | Shopping page opens a creation modal, which collects list information and creates a list. | `web/src/app/dashboard/shopping/page.tsx:63`; `web/src/app/dashboard/shopping/page.tsx:87`; `web/src/app/dashboard/shopping/page.tsx:94`; `web/src/components/shopping/CreateShoppingListModal.tsx:36`; `web/src/components/shopping/CreateShoppingListModal.tsx:65` | High | None material. |
| UC12 | Dedicated edit and delete flows update list metadata, archive lists, and provide restoration through undo. | `web/src/components/shopping/EditListModal.tsx:40`; `web/src/components/shopping/DeleteListDialog.tsx:42`; `web/src/components/shopping/DeleteListDialog.tsx:47`; `web/src/components/shopping/DeleteListDialog.tsx:74`; `web/src/components/shopping/DeleteListDialog.tsx:89` | High | “Delete” is implemented as an archival update rather than permanent removal. |
| UC13 | Open list supports adding, checking, deleting, and bulk-completing items while calculating progress. | `web/src/app/dashboard/shopping/[id]/page.tsx:298`; `web/src/app/dashboard/shopping/[id]/page.tsx:518`; `web/src/app/dashboard/shopping/[id]/page.tsx:563`; `web/src/app/dashboard/shopping/[id]/page.tsx:616`; `web/src/app/dashboard/shopping/[id]/page.tsx:635` | High | The visible quick-add flow captures an item name; richer quantities depend on generated or preexisting items. |
| UC14 | Purchased linked items can be transferred individually or in a checked batch, after which completed lists are removed. | `web/src/app/dashboard/shopping/[id]/page.tsx:235`; `web/src/app/dashboard/shopping/[id]/page.tsx:264`; `web/src/app/dashboard/shopping/[id]/page.tsx:596`; `web/src/app/dashboard/shopping/[id]/page.tsx:652`; `web/src/app/dashboard/shopping/[id]/page.tsx:666` | High | Items without an ingredient ID are not eligible for the implemented inventory-transfer controls. |
| UC15 | Inventory addition includes ingredient search, quantity and storage details, expiration, and low-stock threshold, followed by creation. | `web/src/components/inventory/AddInventoryModal.tsx:58`; `web/src/components/inventory/AddInventoryModal.tsx:102`; `web/src/components/inventory/AddInventoryModal.tsx:127`; `web/src/components/inventory/AddInventoryModal.tsx:135`; `web/src/components/inventory/AddInventoryModal.tsx:316` | High | Ingredient must be found in the product’s ingredient catalog. |
| UC16 | Inventory edit saves item fields; individual and batch deletion flows remove selected items. | `web/src/components/inventory/EditInventoryModal.tsx:61`; `web/src/components/inventory/EditInventoryModal.tsx:79`; `web/src/components/inventory/EditInventoryModal.tsx:211`; `web/src/components/inventory/DeleteInventoryDialog.tsx:37`; `web/src/components/inventory/DeleteInventoryDialog.tsx:43`; `web/src/app/dashboard/inventory/page.tsx:398` | High | “Mark as used” described in the guide is not relied upon because current inspected product code primarily exposes edit and delete. |
| UC17 | Inventory loads filtered data, exposes expiration and low-stock summaries, filters by location/alert state, and searches by ingredient name. | `web/src/app/dashboard/inventory/page.tsx:58`; `web/src/app/dashboard/inventory/page.tsx:84`; `web/src/app/dashboard/inventory/page.tsx:179`; `web/src/app/dashboard/inventory/page.tsx:192`; `web/src/app/dashboard/inventory/page.tsx:353`; `web/src/components/inventory/InventorySearchBar.tsx:14` | High | Alert usefulness depends on users supplying expiration dates and minimum quantities. |
| UC18 | Inventory recommendation flow rejects empty inventory, calls the inventory recommender, and displays suggestions; missing-item transfer is explicitly unfinished. | `web/src/app/dashboard/inventory/page.tsx:117`; `web/src/app/dashboard/inventory/page.tsx:120`; `web/src/app/dashboard/inventory/page.tsx:141`; `web/src/app/dashboard/inventory/page.tsx:161`; `web/src/app/dashboard/inventory/page.tsx:171`; `web/src/app/dashboard/inventory/page.tsx:174` | High | “Add missing items” is not implemented and is therefore excluded from the successful postcondition. |
| UC19 | Nutrient dashboard retrieves period data, displays goal-relative trends, and exports selected nutrition data. | `web/src/app/dashboard/nutrients/useNutrientDashboard.ts:134`; `web/src/app/dashboard/nutrients/useNutrientDashboard.ts:98`; `web/src/app/dashboard/nutrients/page.tsx:80`; `web/src/app/dashboard/nutrients/page.tsx:242`; `web/src/app/dashboard/nutrients/useNutrientExport.ts:28`; `web/src/app/dashboard/nutrients/useNutrientExport.ts:34` | High | Meaningful results require completed meals with recipe nutrient data. |
| UC20 | Nutrient dashboard loads, validates, and saves calorie, protein, carbohydrate, fat, sodium, and fiber goals. | `web/src/app/dashboard/nutrients/useNutrientDashboard.ts:34`; `web/src/app/dashboard/nutrients/useNutrientDashboard.ts:43`; `web/src/app/dashboard/nutrients/useNutrientDashboard.ts:240`; `web/src/app/dashboard/nutrients/useNutrientDashboard.ts:281`; `web/src/app/dashboard/nutrients/useNutrientDashboard.ts:284`; `web/src/app/dashboard/nutrients/page.tsx:94` | High | Targets are user-defined guidance; the product does not establish that they are medical advice. |