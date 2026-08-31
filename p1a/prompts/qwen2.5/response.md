## UC1: Sign Up

| Part | Content |
|---|---|
| **Name** | Sign Up |
| **Primary actor** | New User |
| **Stakeholders & interests** | New User: Wants to create an account to access the platform's features. Platform: Wants to onboard new users for engagement and data. |
| **Preconditions** | User is not logged in. |
| **Trigger** | User decides to sign up for an account. |
| **Main success scenario** | 1. User navigates to the sign-up page. 2. User fills out the sign-up form with required information (username, email, password). 3. User confirms the password. 4. User submits the form. 5. System validates the form data. 6. System creates a new user account. 7. System redirects the user to the login page. |
| **Extensions** | 2a: Invalid email format → system displays an error message. 2b: Password does not meet requirements → system displays an error message. 2c: Passwords do not match → system displays an error message. 5a: User with the same email already exists → system displays an error message. |
| **Postconditions** | User account is created and stored in the system; user is redirected to the login page. |

## UC2: Sign In

| Part | Content |
|---|---|
| **Name** | Sign In |
| **Primary actor** | Registered User |
| **Stakeholders & interests** | Registered User: Wants to access their account. Platform: Wants to authenticate users for security and personalized experience. |
| **Preconditions** | User has an account and is not currently logged in. |
| **Trigger** | User decides to sign in to their account. |
| **Main success scenario** | 1. User navigates to the sign-in page. 2. User enters their email and password. 3. User submits the form. 4. System verifies the credentials. 5. System logs the user in. 6. System redirects the user to the dashboard. |
| **Extensions** | 2a: Incorrect email or password → system displays an error message. 4a: Account is not verified → system displays an error message. |
| **Postconditions** | User is authenticated and redirected to the dashboard. |

## UC3: View Dashboard

| Part | Content |
|---|---|
| **Name** | View Dashboard |
| **Primary actor** | Logged-in User |
| **Stakeholders & interests** | Logged-in User: Wants to see an overview of their account. Platform: Wants to provide a centralized view of user activity and progress. |
| **Preconditions** | User is logged in. |
| **Trigger** | User navigates to the dashboard. |
| **Main success scenario** | 1. System fetches user data. 2. System displays the dashboard with user stats, recent meals, active challenges, and recent achievements. |
| **Extensions** | 1a: Error fetching user data → system displays an error message. |
| **Postconditions** | Dashboard is displayed with user-specific data. |

## UC4: View Achievements

| Part | Content |
|---|---|
| **Name** | View Achievements |
| **Primary actor** | Logged-in User |
| **Stakeholders & interests** | Logged-in User: Wants to see their achievements and progress. Platform: Wants to motivate users through gamification. |
| **Preconditions** | User is logged in. |
| **Trigger** | User navigates to the achievements page. |
| **Main success scenario** | 1. System fetches user achievements. 2. System displays earned and available achievements. |
| **Extensions** | 1a: Error fetching achievements → system displays an error message. |
| **Postconditions** | Achievements are displayed with progress and earned badges. |

## UC5: Check Achievements

| Part | Content |
|---|---|
| **Name** | Check Achievements |
| **Primary actor** | Logged-in User |
| **Stakeholders & interests** | Logged-in User: Wants to manually check for new achievements. Platform: Wants to ensure users are aware of their progress. |
| **Preconditions** | User is logged in and on the achievements page. |
| **Trigger** | User clicks the "Check Achievements" button. |
| **Main success scenario** | 1. System checks for new achievements. 2. System updates the achievements list. |
| **Extensions** | 1a: No new achievements → system displays a message. 1b: Error checking achievements → system displays an error message. |
| **Postconditions** | Achievements list is updated with any new achievements. |

## UC6: View Nutrient Dashboard

| Part | Content |
|---|---|
| **Name** | View Nutrient Dashboard |
| **Primary actor** | Logged-in User |
| **Stakeholders & interests** | Logged-in User: Wants to track their nutrient intake. Platform: Wants to provide users with health insights. |
| **Preconditions** | User is logged in. |
| **Trigger** | User navigates to the nutrient dashboard. |
| **Main success scenario** | 1. System fetches nutrient data. 2. System displays daily, weekly, and monthly nutrient trends. |
| **Extensions** | 1a: Error fetching nutrient data → system displays an error message. |
| **Postconditions** | Nutrient dashboard is displayed with user-specific data. |

## UC7: Set Nutrient Goals

| Part | Content |
|---|---|
| **Name** | Set Nutrient Goals |
| **Primary actor** | Logged-in User |
| **Stakeholders & interests** | Logged-in User: Wants to set personal nutrient goals. Platform: Wants to provide users with personalized health targets. |
| **Preconditions** | User is logged in and on the nutrient dashboard. |
| **Trigger** | User clicks the "Set Goals" button. |
| **Main success scenario** | 1. User inputs their nutrient goals. 2. User submits the form. 3. System saves the nutrient goals. |
| **Extensions** | 1a: Invalid input → system displays an error message. 2a: Error saving goals → system displays an error message. |
| **Postconditions** | Nutrient goals are saved and displayed on the dashboard. |

## UC8: View Challenges

| Part | Content |
|---|---|
| **Name** | View Challenges |
| **Primary actor** | Logged-in User |
| **Stakeholders & interests** | Logged-in User: Wants to see available challenges. Platform: Wants to engage users through gamification. |
| **Preconditions** | User is logged in. |
| **Trigger** | User navigates to the challenges page. |
| **Main success scenario** | 1. System fetches user challenges. 2. System displays active, joined, and completed challenges. |
| **Extensions** | 1a: Error fetching challenges → system displays an error message. |
| **Postconditions** | Challenges are displayed with progress and status. |

## UC9: Join Challenge

| Part | Content |
|---|---|
| **Name** | Join Challenge |
| **Primary actor** | Logged-in User |
| **Stakeholders & interests** | Logged-in User: Wants to join a challenge. Platform: Wants to engage users through gamification. |
| **Preconditions** | User is logged in and on the challenges page. |
| **Trigger** | User clicks the "Join" button for a challenge. |
| **Main success scenario** | 1. System checks if the user can join the challenge. 2. System updates the user's challenge status. 3. System redirects the user to the joined challenges tab. |
| **Extensions** | 1a: User already joined → system displays a message. 1b: Error joining challenge → system displays an error message. |
| **Postconditions** | User's challenge status is updated and displayed. |

## UC10: View Calendar

| Part | Content |
|---|---|
| **Name** | View Calendar |
| **Primary actor** | Logged-in User |
| **Stakeholders & interests** | Logged-in User: Wants to see their meal schedule. Platform: Wants to provide users with a meal planning tool. |
| **Preconditions** | User is logged in. |
| **Trigger** | User navigates to the calendar page. |
| **Main success scenario** | 1. System fetches user calendar data. 2. System displays the calendar with meal entries. |
| **Extensions** | 1a: Error fetching calendar data → system displays an error message. |
| **Postconditions** | Calendar is displayed with user-specific meal entries. |

## UC11: Add Meal to Calendar

| Part | Content |
|---|---|
| **Name** | Add Meal to Calendar |
| **Primary actor** | Logged-in User |
| **Stakeholders & interests** | Logged-in User: Wants to add a meal to their calendar. Platform: Wants to provide users with a meal planning tool. |
| **Preconditions** | User is logged in and on the calendar page. |
| **Trigger** | User clicks the "Add Meal" button. |
| **Main success scenario** | 1. User selects a recipe and date. 2. User submits the form. 3. System adds the meal to the calendar. |
| **Extensions** | 1a: Invalid date or meal type → system displays an error message. 2a: Error adding meal → system displays an error message. |
| **Postconditions** | Meal is added to the calendar and displayed. |

## UC12: View Recipes

| Part | Content |
|---|---|
| **Name** | View Recipes |
| **Primary actor** | Logged-in User |
| **Stakeholders & interests** | Logged-in User: Wants to browse recipes. Platform: Wants to provide users with a recipe collection. |
| **Preconditions** | User is logged in. |
| **Trigger** | User navigates to the recipes page. |
| **Main success scenario** | 1. System fetches recipes. 2. System displays the recipe collection. |
| **Extensions** | 1a: Error fetching recipes → system displays an error message. |
| **Postconditions** | Recipes are displayed with filtering and sorting options. |

## UC13: View Inventory

| Part | Content |
|---|---|
| **Name** | View Inventory |
| **Primary actor** | Logged-in User |
| **Stakeholders & interests** | Logged-in User: Wants to see their inventory. Platform: Wants to provide users with an inventory management tool. |
| **Preconditions** | User is logged in. |
| **Trigger** | User navigates to the inventory page. |
| **Main success scenario** | 1. System fetches user inventory. 2. System displays the inventory with item details. |
| **Extensions** | 1a: Error fetching inventory → system displays an error message. |
| **Postconditions** | Inventory is displayed with item details and status. |

## UC14: Add Item to Inventory

| Part | Content |
|---|---|
| **Name** | Add Item to Inventory |
| **Primary actor** | Logged-in User |
| **Stakeholders & interests** | Logged-in User: Wants to add an item to their inventory. Platform: Wants to provide users with an inventory management tool. |
| **Preconditions** | User is logged in and on the inventory page. |
| **Trigger** | User clicks the "Add Item" button. |
| **Main success scenario** | 1. User fills out the item details. 2. User submits the form. 3. System adds the item to the inventory. |
| **Extensions** | 1a: Invalid item details → system displays an error message. 2a: Error adding item → system displays an error message. |
| **Postconditions** | Item is added to the inventory and displayed. |

## UC15: Edit Item in Inventory

| Part | Content |
|---|---|
| **Name** | Edit Item in Inventory |
| **Primary actor** | Logged-in User |
| **Stakeholders & interests** | Logged-in User: Wants to edit an item in their inventory. Platform: Wants to provide users with an inventory management tool. |
| **Preconditions** | User is logged in and on the inventory page. |
| **Trigger** | User clicks the "Edit" button for an item. |
| **Main success scenario** | 1. User modifies the item details. 2. User submits the form. 3. System updates the item in the inventory. |
| **Extensions** | 1a: Invalid item details → system displays an error message. 2a: Error updating item → system displays an error message. |
| **Postconditions** | Item details are updated and displayed. |

## UC16: Delete Item from Inventory

| Part | Content |
|---|---|
| **Name** | Delete Item from Inventory |
| **Primary actor** | Logged-in User |
| **Stakeholders & interests** | Logged-in User: Wants to delete an item from their inventory. Platform: Wants to provide users with an inventory management tool. |
| **Preconditions** | User is logged in and on the inventory page. |
| **Trigger** | User clicks the "Delete" button for an item. |
| **Main success scenario** | 1. User confirms the deletion. 2. System deletes the item from the inventory. |
| **Extensions** | 1a: Error deleting item → system displays an error message. |
| **Postconditions** | Item is deleted from the inventory. |

## UC17: View Shopping Lists

| Part | Content |
|---|---|
| **Name** | View Shopping Lists |
| **Primary actor** | Logged-in User |
| **Stakeholders & interests** | Logged-in User: Wants to see their shopping lists. Platform: Wants to provide users with a shopping list management tool. |
| **Preconditions** | User is logged in. |
| **Trigger** | User navigates to the shopping lists page. |
| **Main success scenario** | 1. System fetches user shopping lists. 2. System displays the shopping lists with item details. |
| **Extensions** | 1a: Error fetching shopping lists → system displays an error message. |
| **Postconditions** | Shopping lists are displayed with item details and status. |

## UC18: Create Shopping List

| Part | Content |
|---|---|
| **Name** | Create Shopping List |
| **Primary actor** | Logged-in User |
| **Stakeholders & interests** | Logged-in User: Wants to create a new shopping list. Platform: Wants to provide users with a shopping list management tool. |
| **Preconditions** | User is logged in and on the shopping lists page. |
| **Trigger** | User clicks the "Create List" button. |
| **Main success scenario** | 1. User fills out the list details. 2. User submits the form. 3. System creates the shopping list. |
| **Extensions** | 1a: Invalid list details → system displays an error message. 2a: Error creating list → system displays an error message. |
| **Postconditions** | Shopping list is created and displayed. |

## UC19: Generate Shopping List

| Part | Content |
|---|---|
| **Name** | Generate Shopping List |
| **Primary actor** | Logged-in User |
| **Stakeholders & interests** | Logged-in User: Wants to generate a shopping list from their meal plan. Platform: Wants to provide users with a convenient way to manage their groceries. |
| **Preconditions** | User is logged in and on the calendar page. |
| **Trigger** | User clicks the "Generate Shopping List" button. |
| **Main success scenario** | 1. User selects the date range and meal types. 2. User submits the form. 3. System generates the shopping list. |
| **Extensions** | 1a: Invalid date range or meal types → system displays an error message. 2a: Error generating list → system displays an error message. |
| **Postconditions** | Shopping list is generated and displayed. |

## UC20: View Settings

| Part | Content |
|---|---|
| **Name** | View Settings |
| **Primary actor** | Logged-in User |
| **Stakeholders & interests** | Logged-in User: Wants to see and modify their account settings. Platform: Wants to provide users with control over their account preferences. |
| **Preconditions** | User is logged in. |
| **Trigger** | User navigates to the settings page. |
| **Main success scenario** | 1. System fetches user settings. 2. System displays the settings with options to modify. |
| **Extensions** | 1a: Error fetching settings → system displays an error message. |
| **Postconditions** | Settings are displayed with options to modify. |

| UC | Permitted product evidence | File and line | Confidence | Concern |
|---|---|---|---|---|
| UC1 | README.md, INSTALL.md, web/src/app/signup/page.tsx | README.md:1, INSTALL.md:1, web/src/app/signup/page.tsx:1-28 | High | None |
| UC2 | README.md, INSTALL.md, web/src/app/signin/page.tsx | README.md:1, INSTALL.md:1, web/src/app/signin/page.tsx:1-28 | High | None |
| UC3 | README.md, web/src/app/dashboard/page.tsx | README.md:1, web/src/app/dashboard/page.tsx:1-28 | High | None |
| UC4 | README.md, web/src/app/dashboard/achievements/page.tsx | README.md:1, web/src/app/dashboard/achievements/page.tsx:1-28 | High | None |
| UC5 | README.md, web/src/app/dashboard/achievements/page.tsx | README.md:1, web/src/app/dashboard/achievements/page.tsx:1-28 | High | None |
| UC6 | README.md, web/src/app/dashboard/nutrients/page.tsx | README.md:1, web/src/app/dashboard/nutrients/page.tsx:1-28 | High | None |
| UC7 | README.md, web/src/app/api/nutrients/goals/route.ts | README.md:1, web/src/app/api/nutrients/goals/route.ts:1-28 | High | None |
| UC8 | README.md, web/src/app/dashboard/challenges/page.tsx | README.md:1, web/src/app/dashboard/challenges/page.tsx:1-28 | High | None |
| UC9 | README.md, web/src/app/api/challenges/join/route.ts | README.md:1, web/src/app/api/challenges/join/route.ts:1-28 | High | None |
| UC10 | README.md, web/src/app/dashboard/calendar/page.tsx | README.md:1, web/src/app/dashboard/calendar/page.tsx:1-28 | High | None |
| UC11 | README.md, web/src/components/ui/AddMealModal.tsx | README.md:1, web/src/components/ui/AddMealModal.tsx:1-28 | High | None |
| UC12 | README.md, web/src/app/dashboard/recipes/page.tsx | README.md:1, web/src/app/dashboard/recipes/page.tsx:1-28 | High | None |
| UC13 | README.md, web/src/app/dashboard/inventory/page.tsx | README.md:1, web/src/app/dashboard/inventory/page.tsx:1-28 | High | None |
| UC14 | README.md, web/src/components/inventory/AddInventoryModal.tsx | README.md:1, web/src/components/inventory/AddInventoryModal.tsx:1-28 | High | None |
| UC15 | README.md, web/src/components/inventory/EditInventoryModal.tsx | README.md:1, web/src/components/inventory/EditInventoryModal.tsx:1-28 | High | None |
| UC16 | README.md, web/src/components/inventory/EditInventoryModal.tsx | README.md:1, web/src/components/inventory/EditInventoryModal.tsx:1-28 | High | None |
| UC17 | README.md, web/src/app/dashboard/shopping/page.tsx | README.md:1, web/src/app/dashboard/shopping/page.tsx:1-28 | High | None |
| UC18 | README.md, web/src/components/shopping/CreateListModal.tsx | README.md:1, web/src/components/shopping/CreateListModal.tsx:1-28 | High | None |
| UC19 | README.md, web/src/components/shopping/GenerateShoppingListModal.tsx | README.md:1, web/src/components/shopping/GenerateShoppingListModal.tsx:1-28 | High | None |
| UC20 | README.md, web/src/app/dashboard/settings/page.tsx | README.md:1, web/src/app/dashboard/settings/page.tsx:1-28 | High | None |