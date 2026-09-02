## UC1: Sign Up
| Part | Content |
|---|---|
| **Name** | Sign up |
| **Primary actor** | New user |
| **Stakeholders & interests** | New user: Wants to create an account to use Epicourier services. Platform: Wants to onboard new users to increase user base. |
| **Preconditions** | User is not logged in and has not created an account. |
| **Trigger** | User decides to sign up for Epicourier. |
| **Main success scenario** | 1. User navigates to the sign-up page. 2. User enters a username, email, and password. 3. User confirms the password. 4. User submits the form. 5. System validates the form and creates a new user account. 6. System sends a confirmation email to the user. |
| **Extensions** | 2a: Username already exists → system displays error and asks for a new username. 2b: Email already exists → system displays error and asks for a new email. 3a: Password does not meet requirements → system displays error and asks for a new password. |
| **Postconditions** | User account is created and user is logged in. |

## UC2: Sign In
| Part | Content |
|---|---|
| **Name** | Sign in |
| **Primary actor** | Registered user |
| **Stakeholders & interests** | Registered user: Wants to access their account. Platform: Wants to authenticate users to provide personalized services. |
| **Preconditions** | User has an account and is not currently logged in. |
| **Trigger** | User decides to sign in to their account. |
| **Main success scenario** | 1. User navigates to the sign-in page. 2. User enters their email and password. 3. User submits the form. 4. System validates the credentials. 5. System logs the user in and redirects to the dashboard. |
| **Extensions** | 2a: Incorrect email or password → system displays error and asks for correct credentials. |
| **Postconditions** | User is logged in and redirected to the dashboard. |

## UC3: View Dashboard
| Part | Content |
|---|---|
| **Name** | View dashboard |
| **Primary actor** | Logged-in user |
| **Stakeholders & interests** | Logged-in user: Wants to view their account overview. Platform: Wants to provide a summary of user's activities and achievements. |
| **Preconditions** | User is logged in. |
| **Trigger** | User navigates to the dashboard. |
| **Main success scenario** | 1. System retrieves user data. 2. System displays the dashboard with user stats, recent meals, active challenges, and recent achievements. |
| **Extensions** | None |
| **Postconditions** | Dashboard is displayed with user data. |

## UC4: View Achievements
| Part | Content |
|---|---|
| **Name** | View achievements |
| **Primary actor** | Logged-in user |
| **Stakeholders & interests** | Logged-in user: Wants to view their achievements. Platform: Wants to motivate users by showing their progress. |
| **Preconditions** | User is logged in. |
| **Trigger** | User navigates to the achievements page. |
| **Main success scenario** | 1. System retrieves user achievements. 2. System displays earned and available achievements. 3. User can manually check for new achievements. |
| **Extensions** | 3a: Error fetching achievements → system displays error and retries on user request. |
| **Postconditions** | Achievements are displayed. |

## UC5: View Nutrient Dashboard
| Part | Content |
|---|---|
| **Name** | View nutrient dashboard |
| **Primary actor** | Logged-in user |
| **Stakeholders & interests** | Logged-in user: Wants to view their nutrient intake. Platform: Wants to provide insights into user's nutritional habits. |
| **Preconditions** | User is logged in. |
| **Trigger** | User navigates to the nutrient dashboard. |
| **Main success scenario** | 1. System retrieves user's nutrient data. 2. System displays daily, weekly, and monthly nutrient trends. 3. User can set nutrient goals. |
| **Extensions** | 3a: Error fetching nutrient data → system displays error and retries on user request. |
| **Postconditions** | Nutrient dashboard is displayed with user data. |

## UC6: View Shopping Lists
| Part | Content |
|---|---|
| **Name** | View shopping lists |
| **Primary actor** | Logged-in user |
| **Stakeholders & interests** | Logged-in user: Wants to view their shopping lists. Platform: Wants to help users manage their grocery lists. |
| **Preconditions** | User is logged in. |
| **Trigger** | User navigates to the shopping lists page. |
| **Main success scenario** | 1. System retrieves user's shopping lists. 2. System displays all shopping lists as cards. 3. User can create a new shopping list. |
| **Extensions** | 3a: Error fetching shopping lists → system displays error and retries on user request. |
| **Postconditions** | Shopping lists are displayed. |

## UC7: View Recipes
| Part | Content |
|---|---|
| **Name** | View recipes |
| **Primary actor** | Logged-in user |
| **Stakeholders & interests** | Logged-in user: Wants to browse recipes. Platform: Wants to provide a variety of recipes to users. |
| **Preconditions** | User is logged in. |
| **Trigger** | User navigates to the recipes page. |
| **Main success scenario** | 1. System retrieves recipes. 2. System displays recipes with filters and sorting options. 3. User can search for recipes. |
| **Extensions** | 3a: Error fetching recipes → system displays error and retries on user request. |
| **Postconditions** | Recipes are displayed with filters and sorting options. |

## UC8: View Challenges
| Part | Content |
|---|---|
| **Name** | View challenges |
| **Primary actor** | Logged-in user |
| **Stakeholders & interests** | Logged-in user: Wants to view available challenges. Platform: Wants to engage users with challenges. |
| **Preconditions** | User is logged in. |
| **Trigger** | User navigates to the challenges page. |
| **Main success scenario** | 1. System retrieves user's challenges. 2. System displays active, joined, and completed challenges. 3. User can join a new challenge. |
| **Extensions** | 3a: Error fetching challenges → system displays error and retries on user request. |
| **Postconditions** | Challenges are displayed. |

## UC9: View Inventory
| Part | Content |
|---|---|
| **Name** | View inventory |
| **Primary actor** | Logged-in user |
| **Stakeholders & interests** | Logged-in user: Wants to view their inventory. Platform: Wants to help users manage their pantry and fridge. |
| **Preconditions** | User is logged in. |
| **Trigger** | User navigates to the inventory page. |
| **Main success scenario** | 1. System retrieves user's inventory items. 2. System displays inventory items with filters and sorting options. 3. User can add a new item to the inventory. |
| **Extensions** | 3a: Error fetching inventory → system displays error and retries on user request. |
| **Postconditions** | Inventory items are displayed. |

## UC10: View Calendar
| Part | Content |
|---|---|
| **Name** | View calendar |
| **Primary actor** | Logged-in user |
| **Stakeholders & interests** | Logged-in user: Wants to view their meal calendar. Platform: Wants to help users plan their meals. |
| **Preconditions** | User is logged in. |
| **Trigger** | User navigates to the calendar page. |
| **Main success scenario** | 1. System retrieves user's calendar entries. 2. System displays the calendar with meal entries. 3. User can add a new meal to the calendar. |
| **Extensions** | 3a: Error fetching calendar entries → system displays error and retries on user request. |
| **Postconditions** | Calendar entries are displayed. |

## UC11: Add Meal to Calendar
| Part | Content |
|---|---|
| **Name** | Add meal to calendar |
| **Primary actor** | Logged-in user |
| **Stakeholders & interests** | Logged-in user: Wants to add a meal to their calendar. Platform: Wants to help users plan their meals. |
| **Preconditions** | User is logged in and on the calendar page. |
| **Trigger** | User decides to add a meal to the calendar. |
| **Main success scenario** | 1. User selects a recipe. 2. User selects a date and meal type. 3. User confirms the addition. 4. System adds the meal to the calendar. |
| **Extensions** | 2a: No date selected → system displays error and asks for a date. 3a: No meal type selected → system displays error and asks for a meal type. |
| **Postconditions** | Meal is added to the calendar. |

## UC12: Generate Shopping List
| Part | Content |
|---|---|
| **Name** | Generate shopping list |
| **Primary actor** | Logged-in user |
| **Stakeholders & interests** | Logged-in user: Wants to generate a shopping list. Platform: Wants to help users manage their grocery lists. |
| **Preconditions** | User is logged in and on the calendar page. |
| **Trigger** | User decides to generate a shopping list. |
| **Main success scenario** | 1. User selects a date range. 2. System generates a shopping list based on the selected meals. 3. User can add the list to their shopping lists. |
| **Extensions** | 2a: No date range selected → system displays error and asks for a date range. |
| **Postconditions** | Shopping list is generated and added to the user's lists. |

## UC13: Edit Inventory Item
| Part | Content |
|---|---|
| **Name** | Edit inventory item |
| **Primary actor** | Logged-in user |
| **Stakeholders & interests** | Logged-in user: Wants to edit an inventory item. Platform: Wants to help users manage their inventory. |
| **Preconditions** | User is logged in and on the inventory page. |
| **Trigger** | User decides to edit an inventory item. |
| **Main success scenario** | 1. User selects an item to edit. 2. User modifies the item details. 3. User confirms the changes. 4. System updates the inventory item. |
| **Extensions** | 2a: No changes made → system displays error and asks for changes. |
| **Postconditions** | Inventory item is updated. |

## UC14: Delete Inventory Item
| Part | Content |
|---|---|
| **Name** | Delete inventory item |
| **Primary actor** | Logged-in user |
| **Stakeholders & interests** | Logged-in user: Wants to delete an inventory item. Platform: Wants to help users manage their inventory. |
| **Preconditions** | User is logged in and on the inventory page. |
| **Trigger** | User decides to delete an inventory item. |
| **Main success scenario** | 1. User selects an item to delete. 2. User confirms the deletion. 3. System deletes the inventory item. |
| **Extensions** | 2a: User cancels the deletion → system cancels the operation. |
| **Postconditions** | Inventory item is deleted. |

## UC15: Add Inventory Item
| Part | Content |
|---|---|
| **Name** | Add inventory item |
| **Primary actor** | Logged-in user |
| **Stakeholders & interests** | Logged-in user: Wants to add an item to their inventory. Platform: Wants to help users manage their inventory. |
| **Preconditions** | User is logged in and on the inventory page. |
| **Trigger** | User decides to add an item to the inventory. |
| **Main success scenario** | 1. User selects an ingredient. 2. User enters the quantity and location. 3. User confirms the addition. 4. System adds the item to the inventory. |
| **Extensions** | 2a: No ingredient selected → system displays error and asks for an ingredient. 3a: No quantity entered → system displays error and asks for a quantity. |
| **Postconditions** | Inventory item is added. |

## UC16: View Settings
| Part | Content |
|---|---|
| **Name** | View settings |
| **Primary actor** | Logged-in user |
| **Stakeholders & interests** | Logged-in user: Wants to view their account settings. Platform: Wants to provide a way for users to customize their experience. |
| **Preconditions** | User is logged in. |
| **Trigger** | User navigates to the settings page. |
| **Main success scenario** | 1. System retrieves user settings. 2. System displays settings options. 3. User can update their settings. |
| **Extensions** | 3a: Error fetching settings → system displays error and retries on user request. |
| **Postconditions** | Settings are displayed. |

## UC17: Update Nutrient Goals
| Part | Content |
|---|---|
| **Name** | Update nutrient goals |
| **Primary actor** | Logged-in user |
| **Stakeholders & interests** | Logged-in user: Wants to update their nutrient goals. Platform: Wants to provide a way for users to set their nutritional targets. |
| **Preconditions** | User is logged in and on the nutrient dashboard page. |
| **Trigger** | User decides to update their nutrient goals. |
| **Main success scenario** | 1. User navigates to the nutrient goals section. 2. User updates the nutrient values. 3. User confirms the changes. 4. System updates the nutrient goals. |
| **Extensions** | 2a: No values entered → system displays error and asks for values. |
| **Postconditions** | Nutrient goals are updated. |

## UC18: View Challenge Progress
| Part | Content |
|---|---|
| **Name** | View challenge progress |
| **Primary actor** | Logged-in user |
| **Stakeholders & interests** | Logged-in user: Wants to view their challenge progress. Platform: Wants to motivate users by showing their progress. |
| **Preconditions** | User is logged in and on the challenges page. |
| **Trigger** | User decides to view a challenge's progress. |
| **Main success scenario** | 1. User selects a challenge. 2. System displays the challenge's progress. 3. User can see their progress towards completing the challenge. |
| **Extensions** | None |
| **Postconditions** | Challenge progress is displayed. |

## UC19: View Recipe Recommendations
| Part | Content |
|---|---|
| **Name** | View recipe recommendations |
| **Primary actor** | Logged-in user |
| **Stakeholders & interests** | Logged-in user: Wants to view recipe recommendations. Platform: Wants to provide personalized recipe suggestions. |
| **Preconditions** | User is logged in and on the recommender page. |
| **Trigger** | User decides to view recipe recommendations. |
| **Main success scenario** | 1. User enters a goal and number of meals. 2. System retrieves and displays recommended recipes. 3. User can view the details of each recommended recipe. |
| **Extensions** | 2a: No goal entered → system displays error and asks for a goal. 2b: No number of meals entered → system displays error and asks for a number. |
| **Postconditions** | Recommended recipes are displayed. |

## UC20: View Meal Planner
| Part | Content |
|---|---|
| **Name** | View meal planner |
| **Primary actor** | Logged-in user |
| **Stakeholders & interests** | Logged-in user: Wants to view their meal planner. Platform: Wants to help users plan their meals for the week. |
| **Preconditions** | User is logged in and on the calendar page. |
| **Trigger** | User decides to view their meal planner. |
| **Main success scenario** | 1. System retrieves the user's meal plan for the week. 2. System displays the meal plan with daily meals. 3. User can add or modify meals in the planner. |
| **Extensions** | 3a: No meals planned → system displays error and asks for meals to be added. |
| **Postconditions** | Meal planner is displayed with user's meals. |

| UC | Permitted product evidence | File and line | Confidence | Concern |
|---|---|---|---|---|
| UC1 | web/src/app/signup/page.tsx | 1-100 | High | None |
| UC2 | web/src/app/signin/page.tsx | 1-100 | High | None |
| UC3 | web/src/app/dashboard/page.tsx | 1-100 | High | None |
| UC4 | web/src/app/dashboard/achievements/page.tsx | 1-100 | High | None |
| UC5 | web/src/app/dashboard/nutrients/page.tsx | 1-100 | High | None |
| UC6 | web/src/app/dashboard/shopping/page.tsx | 1-100 | High | None |
| UC7 | web/src/app/dashboard/recipes/page.tsx | 1-100 | High | None |
| UC8 | web/src/app/dashboard/challenges/page.tsx | 1-100 | High | None |
| UC9 | web/src/app/dashboard/inventory/page.tsx | 1-100 | High | None |
| UC10 | web/src/app/dashboard/calendar/page.tsx | 1-100 | High | None |
| UC11 | web/src/components/ui/AddMealModal.tsx | 1-100 | High | None |
| UC12 | web/src/app/dashboard/calendar/page.tsx | 1-100 | High | None |
| UC13 | web/src/components/inventory/EditInventoryModal.tsx | 1-100 | High | None |
| UC14 | web/src/components/inventory/EditInventoryModal.tsx | 1-100 | High | None |
| UC15 | web/src/components/inventory/AddInventoryModal.tsx | 1-100 | High | None |
| UC16 | web/src/app/dashboard/settings/page.tsx | 1-100 | High | None |
| UC17 | web/src/app/api/nutrients/goals/route.ts | 1-100 | High | None |
| UC18 | web/src/app/dashboard/challenges/page.tsx | 1-100 | High | None |
| UC19 | web/src/app/dashboard/recommender/page.tsx | 1-100 | High | None |
| UC20 | web/src/app/dashboard/calendar/page.tsx | 1-100 | High | None |