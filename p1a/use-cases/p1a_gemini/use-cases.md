# Epicourier-Web Use Cases

## UC1: Register account

| Part | Content |
|---|---|
| **Name** | Register account |
| **Primary actor** | New user |
| **Stakeholders & interests** | **New user**: Wants to create a personalized account to track meals, manage inventory, and receive AI recommendations.<br>**System administrator**: Wants valid, secure user credentials and properly isolated user data. |
| **Preconditions** | The user has internet access and is not currently authenticated. |
| **Trigger** | The user chooses to sign up for a new account. |
| **Main success scenario** | 1. The user provides a unique username, valid email address, and a secure password.<br>2. The user submits the registration request.<br>3. The system validates the uniqueness and format of the submitted information.<br>4. The system creates the new user account and confirms successful registration.<br>5. The system directs the user to sign in to their new account. |
| **Extensions** | 3a: A required field is empty or the email format is invalid.<br>&nbsp;&nbsp;&nbsp;&nbsp;1. The system displays a validation error indicating the missing or invalid field.<br>&nbsp;&nbsp;&nbsp;&nbsp;2. The user corrects the entry and resubmits.<br>3b: The chosen password does not meet security criteria or passwords do not match.<br>&nbsp;&nbsp;&nbsp;&nbsp;1. The system alerts the user of the password constraint violation.<br>&nbsp;&nbsp;&nbsp;&nbsp;2. The user enters conforming matching passwords and resubmits.<br>3c: The email address is already registered.<br>&nbsp;&nbsp;&nbsp;&nbsp;1. The system informs the user that an account with that email already exists.<br>&nbsp;&nbsp;&nbsp;&nbsp;2. The user provides a different email address or navigates to sign in. |
| **Postconditions** | A user profile is established in the system, ready for authentication. |

---

## UC2: Authenticate session

| Part | Content |
|---|---|
| **Name** | Authenticate session |
| **Primary actor** | Registered user |
| **Stakeholders & interests** | **Registered user**: Wants secure access to their private meal plans, pantry records, and dietary analytics.<br>**Platform**: Wants to safeguard user data and ensure authenticated access to protected features. |
| **Preconditions** | The user has a registered account. |
| **Trigger** | The user initiates a sign-in attempt. |
| **Main success scenario** | 1. The user enters their registered email address and password.<br>2. The user submits the sign-in request.<br>3. The system verifies the credentials.<br>4. The system starts an authenticated session and directs the user to their personalized dashboard. |
| **Extensions** | 1a: The user submits incomplete credentials.<br>&nbsp;&nbsp;&nbsp;&nbsp;1. The system prompts the user to fill in the missing email or password.<br>&nbsp;&nbsp;&nbsp;&nbsp;2. The user completes the fields and resubmits.<br>3a: The email or password does not match system records.<br>&nbsp;&nbsp;&nbsp;&nbsp;1. The system rejects the attempt and displays an invalid credentials warning.<br>&nbsp;&nbsp;&nbsp;&nbsp;2. The user re-enters their credentials and resubmits. |
| **Postconditions** | An active authenticated session is established, unlocking access to user-specific data. |

---

## UC3: Search recipe catalog

| Part | Content |
|---|---|
| **Name** | Search recipe catalog |
| **Primary actor** | Authenticated user |
| **Stakeholders & interests** | **Authenticated user**: Wants to find recipes matching specific keywords, ingredients, dietary tags, or home inventory match levels.<br>**System**: Wants to provide fast, relevant recipe discovery. |
| **Preconditions** | The user is authenticated and the recipe catalog is available. |
| **Trigger** | The user navigates to the recipe collection and enters search or filter criteria. |
| **Main success scenario** | 1. The user specifies search keywords, ingredient filters, dietary tags, or inventory match thresholds.<br>2. The system queries the recipe catalog using the selected criteria.<br>3. The system evaluates recipe ingredient overlap against the user's available inventory.<br>4. The system presents matching recipes annotated with prep time, green sustainability score, and inventory match percentage. |
| **Extensions** | 2a: No recipes match the query or filter criteria.<br>&nbsp;&nbsp;&nbsp;&nbsp;1. The system presents an empty state informing the user that no recipes match.<br>&nbsp;&nbsp;&nbsp;&nbsp;2. The user modifies or clears search filters to broaden results.<br>3a: The user changes sorting (e.g., match percentage high-to-low).<br>&nbsp;&nbsp;&nbsp;&nbsp;1. The system reorders and redisplays the results accordingly. |
| **Postconditions** | The user views a filtered, sorted list of recipes matching their search parameters. |

---

## UC4: View recipe details

| Part | Content |
|---|---|
| **Name** | View recipe details |
| **Primary actor** | Authenticated user |
| **Stakeholders & interests** | **Authenticated user**: Wants full culinary instructions, exact ingredient quantities, green scores, and nutritional breakdown for a recipe. |
| **Preconditions** | The recipe exists in the platform catalog. |
| **Trigger** | The user selects a recipe card from the catalog or recommendation list. |
| **Main success scenario** | 1. The user selects a specific recipe to inspect.<br>2. The system retrieves full recipe details including preparation time, eco/green score, step-by-step description, tags, ingredient list with exact proportions, and aggregated nutritional values.<br>3. The system displays the comprehensive recipe profile to the user. |
| **Extensions** | 2a: The requested recipe cannot be found or is unavailable.<br>&nbsp;&nbsp;&nbsp;&nbsp;1. The system displays a not found notice.<br>&nbsp;&nbsp;&nbsp;&nbsp;2. The user navigates back to the recipe catalog. |
| **Postconditions** | The user reviews the complete recipe instructions, nutritional profile, and ingredient requirements. |

---

## UC5: Request AI meal recommendations

| Part | Content |
|---|---|
| **Name** | Request AI meal recommendations |
| **Primary actor** | Authenticated user |
| **Stakeholders & interests** | **Authenticated user**: Wants an AI-crafted daily meal plan that fulfills specific health or dietary goals (e.g., high-protein, calorie deficit, specific cuisines).<br>**Nutrition Coach/AI engine**: Wants to provide nutritionally sound and diverse meal options. |
| **Preconditions** | The user is authenticated. |
| **Trigger** | The user submits a natural-language dietary goal and desired meal count. |
| **Main success scenario** | 1. The user inputs their dietary or fitness goal and selects the desired number of daily meals (3, 5, or 7).<br>2. The user submits the recommendation request.<br>3. The system translates the natural-language goal into nutritional targets and generates a diverse meal plan.<br>4. The system presents the recommended recipes along with AI reasoning explaining why each meal fits the goal. |
| **Extensions** | 1a: The user submits an empty goal description.<br>&nbsp;&nbsp;&nbsp;&nbsp;1. The system prompts the user to enter a goal description.<br>3a: The recommendation service encounters an unexpected processing failure.<br>&nbsp;&nbsp;&nbsp;&nbsp;1. The system notifies the user of the generation failure.<br>&nbsp;&nbsp;&nbsp;&nbsp;2. The user adjusts their prompt or retries. |
| **Postconditions** | A personalized meal plan with AI rationale is delivered and ready to be scheduled. |

---

## UC6: Schedule meal on calendar

| Part | Content |
|---|---|
| **Name** | Schedule meal on calendar |
| **Primary actor** | Authenticated user |
| **Stakeholders & interests** | **Authenticated user**: Wants to organize daily cooking routines by assigning recipes to specific calendar dates and meal types (breakfast, lunch, dinner). |
| **Preconditions** | The user is authenticated and has chosen a recipe to schedule. |
| **Trigger** | The user chooses to add a recipe to their meal calendar. |
| **Main success scenario** | 1. The user initiates scheduling for a chosen recipe.<br>2. The user selects a target calendar date, meal type (breakfast, lunch, dinner), and optional cooking notes.<br>3. The user confirms the schedule entry.<br>4. The system records the planned meal and places it on the user's meal calendar in an active (uncompleted) state.<br>5. The system confirms the scheduled meal. |
| **Extensions** | 2a: The user cancels the scheduling dialog.<br>&nbsp;&nbsp;&nbsp;&nbsp;1. The system closes the modal without saving.<br>3a: The user leaves required date or meal type fields unspecified.<br>&nbsp;&nbsp;&nbsp;&nbsp;1. The system prompts the user to complete all required fields. |
| **Postconditions** | The meal is scheduled on the user's calendar and available for grocery planning and completion tracking. |

---

## UC7: Update meal completion status

| Part | Content |
|---|---|
| **Name** | Update meal completion status |
| **Primary actor** | Authenticated user |
| **Stakeholders & interests** | **Authenticated user**: Wants to log eaten meals to track daily nutritional intake, maintain logging streaks, and earn achievements.<br>**Gamification engine**: Wants accurate activity records to evaluate challenge criteria. |
| **Preconditions** | The user has scheduled meals on their calendar. |
| **Trigger** | The user marks a scheduled meal as completed or incomplete. |
| **Main success scenario** | 1. The user locates a scheduled meal entry on their calendar.<br>2. The user toggles the meal status to completed.<br>3. The system updates the meal record.<br>4. The system recalibrates the user's daily nutrient consumption, logging streak, and challenge progress.<br>5. The system updates the visual appearance of the calendar entry and displays a confirmation. |
| **Extensions** | 2a: The user toggles a previously completed meal back to incomplete.<br>&nbsp;&nbsp;&nbsp;&nbsp;1. The system reverts the status and recalculates nutrient summaries accordingly.<br>3a: The update fails due to a network interruption.<br>&nbsp;&nbsp;&nbsp;&nbsp;1. The system displays an error alert and preserves the previous status. |
| **Postconditions** | The meal completion state is updated and reflected across nutrient analytics, streaks, and challenges. |

---

## UC8: View nutrient analytics

| Part | Content |
|---|---|
| **Name** | View nutrient analytics |
| **Primary actor** | Authenticated user |
| **Stakeholders & interests** | **Authenticated user**: Wants clear insights into daily macronutrient consumption (calories, protein, carbs, fats) and historical weekly/monthly adherence against personal goals. |
| **Preconditions** | The user is authenticated. |
| **Trigger** | The user navigates to the nutrient tracking dashboard. |
| **Main success scenario** | 1. The user opens the nutrient analytics section.<br>2. The system aggregates nutritional values from all completed meals for the current day, past 7 days, and historical months.<br>3. The system computes macro proportions and percentage progress against defined nutrient goals.<br>4. The system presents the daily totals, macro split breakdown, and interactive trend charts. |
| **Extensions** | 2a: No meals have been logged for the selected period.<br>&nbsp;&nbsp;&nbsp;&nbsp;1. The system displays empty indicators and invites the user to log meals.<br>4a: The user changes the monthly historical range (e.g., 3, 6, or 12 months).<br>&nbsp;&nbsp;&nbsp;&nbsp;1. The system re-aggregates data and redraws the monthly trend line. |
| **Postconditions** | The user reviews their current and historical dietary data. |

---

## UC9: Set daily nutrient goals

| Part | Content |
|---|---|
| **Name** | Set daily nutrient goals |
| **Primary actor** | Authenticated user |
| **Stakeholders & interests** | **Authenticated user**: Wants customized daily targets for calories, protein, carbohydrates, fats, fiber, and sodium.<br>**Analytics dashboard**: Needs baseline targets to calculate percentage adherence on trend charts. |
| **Preconditions** | The user is authenticated and viewing the nutrient command center. |
| **Trigger** | The user chooses to set or update their daily nutrient targets. |
| **Main success scenario** | 1. The user opens the nutrient goal configuration interface.<br>2. The system loads any previously defined goals or standard baseline presets.<br>3. The user inputs or modifies target quantities for daily calories and macronutrients/micronutrients.<br>4. The user submits the new goals.<br>5. The system saves the target values and updates all dashboard progress gauges accordingly. |
| **Extensions** | 3a: The user inputs invalid numerical values (e.g., negative numbers).<br>&nbsp;&nbsp;&nbsp;&nbsp;1. The system displays an input error and prevents submission.<br>&nbsp;&nbsp;&nbsp;&nbsp;2. The user corrects the invalid values.<br>3b: The user selects a recommended preset template.<br>&nbsp;&nbsp;&nbsp;&nbsp;1. The system autofills the fields with the preset values for user review. |
| **Postconditions** | Daily nutrient targets are updated and used as benchmarks for analytics and gamification streaks. |

---

## UC10: Export nutrient data report

| Part | Content |
|---|---|
| **Name** | Export nutrient data report |
| **Primary actor** | Authenticated user |
| **Stakeholders & interests** | **Authenticated user**: Wants portable copies of their nutritional history (CSV or text) to share with healthcare providers or retain for personal records. |
| **Preconditions** | The user has logged meal and nutrition data within the chosen date range. |
| **Trigger** | The user requests a nutrient report export. |
| **Main success scenario** | 1. The user specifies a date range and desired export format (CSV spreadsheet or formatted text report).<br>2. The user initiates the export.<br>3. The system compiles the historical daily records, macro summaries, and meal counts for the specified period.<br>4. The system delivers the formatted export file to the user's device. |
| **Extensions** | 1a: The user specifies an invalid date range (e.g., start date after end date).<br>&nbsp;&nbsp;&nbsp;&nbsp;1. The system alerts the user to correct the date bounds.<br>3a: No data exists for the selected date window.<br>&nbsp;&nbsp;&nbsp;&nbsp;1. The system produces a report reflecting zero logged entries for the range. |
| **Postconditions** | A nutritional report file is downloaded to the user's device without altering stored records. |

---

## UC11: Add inventory item

| Part | Content |
|---|---|
| **Name** | Add inventory item |
| **Primary actor** | Authenticated user |
| **Stakeholders & interests** | **Authenticated user**: Wants an accurate digital record of ingredients currently stored at home to avoid duplicate purchases and enable smart recipe matching. |
| **Preconditions** | The user is authenticated and accessing their inventory. |
| **Trigger** | The user chooses to add a new item to their home inventory. |
| **Main success scenario** | 1. The user opens the add-item form.<br>2. The user selects an ingredient from the catalog and specifies quantity, measurement unit, storage location (pantry, fridge, freezer), and optional expiration date.<br>3. The user submits the item.<br>4. The system records the ingredient in the user's inventory.<br>5. The system recalculates inventory counts and displays the new item in the corresponding location view. |
| **Extensions** | 2a: The user enters an ingredient already present in the same storage location.<br>&nbsp;&nbsp;&nbsp;&nbsp;1. The system merges the new quantity into the existing record or updates expiration.<br>2b: A required field (ingredient or quantity) is missing.<br>&nbsp;&nbsp;&nbsp;&nbsp;1. The system prompts the user to provide the required values. |
| **Postconditions** | The ingredient is tracked in the user's inventory and ready for expiration alerts and recipe matching. |

---

## UC12: Update inventory item

| Part | Content |
|---|---|
| **Name** | Update inventory item |
| **Primary actor** | Authenticated user |
| **Stakeholders & interests** | **Authenticated user**: Wants to keep pantry/fridge records accurate after cooking, moving items between storage locations, or updating expiration dates. |
| **Preconditions** | The ingredient item exists in the user's inventory. |
| **Trigger** | The user selects an existing inventory item to modify. |
| **Main success scenario** | 1. The user selects an item card and opens the edit interface.<br>2. The user modifies the quantity, measurement unit, storage location, notes, or expiration date.<br>3. The user saves the modifications.<br>4. The system validates and updates the inventory item record.<br>5. The system refreshes the inventory display with the updated attributes and recalculated expiration urgency. |
| **Extensions** | 2a: The user enters a zero or negative quantity.<br>&nbsp;&nbsp;&nbsp;&nbsp;1. The system rejects the value with a validation error and does not submit the change. (Corrected after source verification — see Corrections below.) |
| **Postconditions** | The inventory item attributes are updated, ensuring accurate recipe match scoring and expiration warnings. |

---

## UC13: Delete inventory items in batch

| Part | Content |
|---|---|
| **Name** | Delete inventory items in batch |
| **Primary actor** | Authenticated user |
| **Stakeholders & interests** | **Authenticated user**: Wants to quickly purge multiple consumed, discarded, or expired ingredients in a single action. |
| **Preconditions** | The user has items listed in their inventory. |
| **Trigger** | The user enables batch selection mode in the inventory manager. |
| **Main success scenario** | 1. The user activates multi-select mode in the inventory view.<br>2. The user selects multiple inventory items to be removed.<br>3. The user requests deletion of the selected items.<br>4. The system prompts for confirmation showing the total number of items to delete.<br>5. The user confirms the batch deletion.<br>6. The system removes all selected items simultaneously and updates global inventory counters. |
| **Extensions** | 2a: The user uses "Select All" to pick all items currently visible.<br>&nbsp;&nbsp;&nbsp;&nbsp;1. The system marks all displayed items for deletion.<br>5a: The user cancels the confirmation dialog.<br>&nbsp;&nbsp;&nbsp;&nbsp;1. The system dismisses the dialog and preserves all inventory items. |
| **Postconditions** | The selected items are removed from inventory and inventory statistics update immediately. |

---

## UC14: Generate recipe suggestions from inventory

| Part | Content |
|---|---|
| **Name** | Generate recipe suggestions from inventory |
| **Primary actor** | Authenticated user |
| **Stakeholders & interests** | **Authenticated user**: Wants recipe recommendations based on ingredients currently on hand, prioritizing items that expire soon to minimize food waste.<br>**Sustainability advocate**: Wants to reduce household food spoilage. |
| **Preconditions** | The user has at least one ingredient recorded in their inventory. |
| **Trigger** | The user requests recipe suggestions from the inventory manager. |
| **Main success scenario** | 1. The user triggers the inventory recipe suggestion action.<br>2. The system analyzes all available ingredients and identifies expiring items.<br>3. The AI engine evaluates catalog recipes, computing ingredient coverage scores and applying bonus weights to expiring ingredients.<br>4. The system presents recommended recipes highlighting match percentages, expiring ingredients utilized, missing items required, and contextual AI reasoning. |
| **Extensions** | 1a: The user's inventory is empty.<br>&nbsp;&nbsp;&nbsp;&nbsp;1. The system alerts the user that ingredients must be added first before generating suggestions.<br>4a: A suggested recipe is missing certain ingredients.<br>&nbsp;&nbsp;&nbsp;&nbsp;1. The user triggers adding missing items to a shopping list. |
| **Postconditions** | The user receives customized, waste-reducing recipe suggestions tailored to their current pantry. |

---

## UC15: Create shopping list

| Part | Content |
|---|---|
| **Name** | Create shopping list |
| **Primary actor** | Authenticated user |
| **Stakeholders & interests** | **Authenticated user**: Wants to create distinct, named grocery lists to organize shopping for weekly staples or special occasions. |
| **Preconditions** | The user is authenticated. |
| **Trigger** | The user chooses to create a new shopping list. |
| **Main success scenario** | 1. The user initiates shopping list creation.<br>2. The user enters a name for the list and an optional description.<br>3. The user submits the creation form.<br>4. The system creates the shopping list and displays it in the user's shopping list collection. |
| **Extensions** | 2a: The user submits an empty list name.<br>&nbsp;&nbsp;&nbsp;&nbsp;1. The system provides a default name or prompts for a name.<br>3a: The user cancels the creation modal.<br>&nbsp;&nbsp;&nbsp;&nbsp;1. The system closes the dialog without creating a list. |
| **Postconditions** | A new empty shopping list is created and ready for item additions. |

---

## UC16: Auto-generate shopping list from meal calendar

| Part | Content |
|---|---|
| **Name** | Auto-generate shopping list from meal calendar |
| **Primary actor** | Authenticated user |
| **Stakeholders & interests** | **Authenticated user**: Wants to automatically convert a week of scheduled meals into a consolidated grocery list without manually calculating ingredient totals. |
| **Preconditions** | The user has scheduled meals within the selected date range. |
| **Trigger** | The user initiates shopping list generation from the calendar or shopping section. |
| **Main success scenario** | 1. The user selects a date range of scheduled meals and provides an optional list title.<br>2. The user initiates generation.<br>3. The system inspects all scheduled recipes within that date window.<br>4. The system extracts and aggregates identical ingredients (combining duplicate quantities across recipes).<br>5. The system creates a new shopping list populated with the aggregated grocery items.<br>6. The system presents the generated shopping list to the user. |
| **Extensions** | 3a: No meals are scheduled within the selected date range.<br>&nbsp;&nbsp;&nbsp;&nbsp;1. The system warns the user that no scheduled recipes were found in that date range.<br>&nbsp;&nbsp;&nbsp;&nbsp;2. The user selects a different date range. |
| **Postconditions** | A consolidated shopping list is created containing the aggregated ingredients of each distinct recipe scheduled in the period. (Corrected after source verification — see Corrections below.) |

---

## UC17: Add recipe ingredients to shopping list

| Part | Content |
|---|---|
| **Name** | Add recipe ingredients to shopping list |
| **Primary actor** | Authenticated user |
| **Stakeholders & interests** | **Authenticated user**: Wants to quickly transfer all or selected ingredients from a recipe detail page directly into an existing or new grocery list. |
| **Preconditions** | The user is viewing a recipe detail page. |
| **Trigger** | The user clicks to add recipe ingredients to their shopping list. |
| **Main success scenario** | 1. The user initiates adding ingredients from the recipe page.<br>2. The system presents a selection dialog showing all recipe ingredients and the user's available shopping lists.<br>3. The user selects the target shopping list (or opts to create a new one) and verifies the ingredients to include.<br>4. The user confirms the addition.<br>5. The system appends the ingredients to the chosen shopping list and confirms success. |
| **Extensions** | 3a: The user unchecks specific ingredients they already have at home.<br>&nbsp;&nbsp;&nbsp;&nbsp;1. The system adds only the selected subset of ingredients to the list.<br>3b: The user creates a new list directly within the dialog.<br>&nbsp;&nbsp;&nbsp;&nbsp;1. The system creates the new list and populates it with the selected ingredients. |
| **Postconditions** | The target shopping list is updated with the selected recipe ingredients. |

---

## UC18: Manage shopping list items

| Part | Content |
|---|---|
| **Name** | Manage shopping list items |
| **Primary actor** | Authenticated user |
| **Stakeholders & interests** | **Authenticated user**: Wants to check off items while in the store, add spontaneous custom grocery items, and remove unwanted items. |
| **Preconditions** | The user is viewing an active shopping list. |
| **Trigger** | The user interacts with items on their shopping list. |
| **Main success scenario** | 1. The user views their categorized shopping list.<br>2. The user adds custom grocery items by name, or toggles item checkmarks as purchased while shopping.<br>3. The system updates item states in real time, moving checked items to completed status and calculating shopping progress percentage.<br>4. The user deletes unwanted items from the list.<br>5. The system removes the item and updates the remaining grocery count. |
| **Extensions** | 2a: The user enters an empty item name when attempting to add an item.<br>&nbsp;&nbsp;&nbsp;&nbsp;1. The system ignores the empty submission and prompts for valid text.<br>4a: The user deletes an item.<br>&nbsp;&nbsp;&nbsp;&nbsp;1. The system removes the item and updates category groupings immediately. |
| **Postconditions** | The shopping list accurately reflects current purchase progress and item modifications. |

---

## UC19: Transfer purchased items to inventory

| Part | Content |
|---|---|
| **Name** | Transfer purchased items to inventory |
| **Primary actor** | Authenticated user |
| **Stakeholders & interests** | **Authenticated user**: Wants to seamlessly transfer checked groceries into their home inventory without re-entering ingredient details manually.<br>**Smart Cart workflow**: Wants continuity between grocery shopping and pantry tracking. |
| **Preconditions** | The shopping list contains checked (purchased) items linked to valid ingredients. |
| **Trigger** | The user selects the transfer-to-inventory action on a shopping list. |
| **Main success scenario** | 1. The user initiates transfer of purchased items from their shopping list.<br>2. The system displays a transfer review dialog listing checked items.<br>3. The user assigns or confirms storage locations (pantry, fridge, freezer) and optional expiration dates for each item.<br>4. The user confirms the transfer.<br>5. The system creates or updates corresponding inventory items in the user's pantry.<br>6. The system removes transferred items from the shopping list (or archives the completed list). |
| **Extensions** | 3a: The user adjusts quantities or deselects specific items before confirming.<br>&nbsp;&nbsp;&nbsp;&nbsp;1. The system transfers only the selected items with the adjusted quantities.<br>6a: All items in the list have been transferred.<br>&nbsp;&nbsp;&nbsp;&nbsp;1. The system completes the list, archives it, and returns the user to the shopping overview. |
| **Postconditions** | Transferred items are now tracked in the user's inventory and removed from the active shopping list. |

---

## UC20: Join community challenge

| Part | Content |
|---|---|
| **Name** | Join community challenge |
| **Primary actor** | Authenticated user |
| **Stakeholders & interests** | **Authenticated user**: Wants to participate in structured weekly or monthly dietary challenges to build healthy habits and earn achievement badges.<br>**Community ecosystem**: Wants to drive engagement and habit consistency. |
| **Preconditions** | Active community challenges exist in the system and the user is authenticated. |
| **Trigger** | The user browses available challenges and chooses to join one. |
| **Main success scenario** | 1. The user navigates to the challenges section.<br>2. The system presents active weekly, monthly, and special challenges with target metrics, duration, and reward badges.<br>3. The user selects an active challenge and clicks to join.<br>4. The system registers the user's participation.<br>5. The system switches the challenge into the user's active/joined list and begins tracking progress against the target metric. |
| **Extensions** | 3a: The user has already joined the selected challenge.<br>&nbsp;&nbsp;&nbsp;&nbsp;1. The system indicates that the challenge is already active for the user.<br>5a: The user logs qualifying meals or activities.<br>&nbsp;&nbsp;&nbsp;&nbsp;1. The system updates the progress bar and days remaining until target completion. |
| **Postconditions** | The user is actively enrolled in the challenge with progress tracked against logging activities. |

---

## Verification Table

| UC | Permitted product evidence | File and line | Confidence | Concern |
|---|---|---|---|---|
| UC1 | Account registration form, validation, and sign up action handler | `web/src/app/signup/page.tsx:1-128`<br>`web/src/app/signup/actions.ts:1-40` | High | None |
| UC2 | User authentication form, credential validation, and sign in session action handler | `web/src/app/signin/page.tsx:1-95`<br>`web/src/app/signin/actions.ts:1-35` | High | None |
| UC3 | Recipe catalog page with search bar, tag/ingredient filters, inventory match scores, and sorting | `web/src/app/dashboard/recipes/page.tsx:14-126`<br>`web/src/app/api/recipes/route.ts:1-80` | High | None |
| UC4 | Recipe detail page presenting prep time, eco green score, ingredient proportions, and nutrient breakdown | `web/src/app/dashboard/recipes/[id]/page.tsx:18-99`<br>`AGENT-PLAN/03-API-SPECIFICATIONS.md:115-142` | High | None |
| UC5 | AI recommendation page and FastAPI endpoints translating natural-language goals into meal plans | `web/src/app/dashboard/recommender/page.tsx:27-102`<br>`backend/api/index.py:47-62`<br>`backend/api/recommender.py:1-100` | High | None |
| UC6 | AddMealModal and calendar events endpoint to assign recipes to dates and meal types | `web/src/components/ui/AddMealModal.tsx:1-120`<br>`web/src/app/api/events/route.ts:1-60`<br>`AGENT-PLAN/03-API-SPECIFICATIONS.md:272-314` | High | None |
| UC7 | Calendar meal interaction handler and PATCH endpoint updating meal completion status | `web/src/app/dashboard/calendar/page.tsx:174-196`<br>`web/src/app/api/events/[id]/route.ts:1-50`<br>`AGENT-PLAN/03-API-SPECIFICATIONS.md:318-355` | High | None |
| UC8 | Nutrient dashboard page calculating daily macros, macro pie split, and weekly/monthly trend charts | `web/src/app/dashboard/nutrients/page.tsx:32-294`<br>`web/src/app/api/nutrients/daily/route.ts:1-90`<br>`AGENT-PLAN/03-API-SPECIFICATIONS.md:391-480` | High | None |
| UC9 | GoalDialog component and nutrient goals API endpoint supporting custom daily targets | `web/src/app/dashboard/nutrients/components/GoalDialog.tsx:1-120`<br>`web/src/app/api/nutrients/goals/route.ts:1-70`<br>`AGENT-PLAN/03-API-SPECIFICATIONS.md:547-624` | High | None |
| UC10 | Nutrient export hook and export API route generating CSV spreadsheets and text reports | `web/src/app/dashboard/nutrients/useNutrientExport.ts:1-80`<br>`web/src/app/api/nutrients/export/route.ts:1-80`<br>`AGENT-PLAN/03-API-SPECIFICATIONS.md:484-543` | High | None |
| UC11 | AddInventoryModal and inventory API route storing ingredients with locations and expiration dates | `web/src/components/inventory/AddInventoryModal.tsx:1-150`<br>`web/src/app/api/inventory/route.ts:1-90`<br>`docs/user-guides/inventory-management.md:23-49` | High | None |
| UC12 | EditInventoryModal and inventory ID API endpoint for updating quantities, notes, and locations | `web/src/components/inventory/EditInventoryModal.tsx:1-150`<br>`web/src/app/api/inventory/[id]/route.ts:1-80`<br>`docs/user-guides/inventory-management.md:63-79` | High | None |
| UC13 | Multi-select state on inventory page, BatchDeleteDialog, and batch-delete API route | `web/src/app/dashboard/inventory/page.tsx:198-254`<br>`web/src/components/inventory/BatchDeleteDialog.tsx:1-80`<br>`web/src/app/api/inventory/batch-delete/route.ts:1-50` | High | None |
| UC14 | Inventory suggest recipes flow and backend FastAPI endpoint prioritizing expiring ingredients | `web/src/app/dashboard/inventory/page.tsx:117-169`<br>`backend/api/index.py:64-94`<br>`backend/api/inventory_recommender.py:1-150` | High | None |
| UC15 | Shopping lists management page, CreateListModal, and shopping lists API route | `web/src/app/dashboard/shopping/page.tsx:26-66`<br>`web/src/components/shopping/CreateListModal.tsx:1-80`<br>`web/src/app/api/shopping-lists/route.ts:1-70` | High | None |
| UC16 | GenerateShoppingListModal and calendar shopping list aggregation generator API route | `web/src/components/shopping/GenerateShoppingListModal.tsx:1-120`<br>`web/src/app/api/shopping-lists/generate/route.ts:1-100`<br>`docs/user-guides/shopping-lists.md:66-77` | High | None |
| UC17 | AddToCartButton on recipe detail page, modal selection dialog, and list items API route | `web/src/components/shopping/AddToCartButton.tsx:1-51`<br>`web/src/components/shopping/AddToShoppingListModal.tsx:1-60`<br>`web/src/app/api/shopping-lists/[id]/items/route.ts:1-80` | High | None |
| UC18 | Shopping list detail page handling item additions, inline checkboxes, and item deletions | `web/src/app/dashboard/shopping/[id]/page.tsx:118-209`<br>`web/src/app/api/shopping-lists/[id]/items/[itemId]/route.ts:1-70` | High | None |
| UC19 | TransferToInventoryModal, shopping list transfer handler, and inventory transfer API route | `web/src/app/dashboard/shopping/[id]/page.tsx:214-234`<br>`web/src/components/shopping/TransferFlow/TransferToInventoryModal.tsx:1-150`<br>`web/src/app/api/inventory/transfer/route.ts:1-80` | High | None |
| UC20 | Challenges dashboard page, participation tracking, and challenges join API route | `web/src/app/dashboard/challenges/page.tsx:61-85`<br>`web/src/app/api/challenges/join/route.ts:1-60`<br>`AGENT-PLAN/03-API-SPECIFICATIONS.md:1026-1063` | High | None |

---

## Corrections after human verification

Two claims in the model's original output were found to contradict source during
line-level verification and have been corrected above. The original wording is
preserved here for the cross-model record; full evidence and method are in the
Gemini derivation record (`p1a/prompts/gemini/derivation-record.md`).

1. **UC12 extension 2a** originally claimed that reducing a quantity to zero makes
   the system prompt the user to confirm removal of the item. No such flow exists:
   `web/src/components/inventory/EditInventoryModal.tsx` rejects `qty <= 0` as
   invalid input before any request is sent (quantity input `min="0.01"`), and no
   removal prompt exists in the modal or in the PUT handler of
   `web/src/app/api/inventory/[id]/route.ts`. The extension was rewritten to
   describe the real behavior: zero or negative quantity is rejected with a
   validation error.

2. **UC16 postcondition** originally claimed the generated list contains "all
   ingredients needed for the scheduled period." In
   `web/src/app/api/shopping-lists/generate/route.ts`, recipe IDs are deduplicated
   with `new Set(...)` before ingredients are fetched, so a recipe scheduled N
   times in the range contributes its ingredients exactly once; quantities do not
   scale with meal repetition. The postcondition was reworded to the guarantee the
   code actually provides: the aggregated ingredients of each distinct recipe
   scheduled in the period.
