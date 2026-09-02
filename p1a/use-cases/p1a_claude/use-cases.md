# Epicourier Project 1a — Claude Reverse-Engineered Use Cases

These use cases were derived from the repository code as-is. The main success scenarios contain only happy-path behavior; code-visible alternatives and failures are recorded as extensions. Source references use repository-relative file paths and line numbers.

## UC1: Register account

| Part | Content |
|---|---|
| **Name** | Register account |
| **Primary actor** | Visitor |
| **Stakeholders & interests** | Visitor: obtain a usable account. Platform: one valid account per email address, carrying a display name. |
| **Preconditions** | Visitor is not signed in and can reach the registration page. |
| **Trigger** | Visitor decides to create an Epicourier account. |
| **Main success scenario** | 1. Visitor supplies a username, an email address, a password, and a password confirmation. 2. System checks the supplied values are complete and well formed. 3. Visitor submits the registration. 4. System confirms the email address is not already registered. 5. System creates the account. 6. System attaches the username to the new account. 7. System confirms creation and directs the visitor to sign in. |
| **Extensions** | 2a: A required field is empty → system reports the missing field and does not submit (`web/src/app/signup/page.tsx:36-70`). 2b: Email is malformed → system reports an invalid address (`web/src/app/signup/page.tsx:46-50`). 2c: Password fails the strength rule or is shorter than eight characters → system reports the requirement (`web/src/app/signup/page.tsx:57-66`). 2d: Confirmation does not equal the password → system reports the mismatch (`web/src/app/signup/page.tsx:71-74`). 4a: Email already belongs to an account → system refuses and identifies the email conflict (`web/src/app/signup/actions.ts:21-23`). 6a: Account was created but the username could not be attached → system reports partial creation and advises signing in to update the profile (`web/src/app/signup/actions.ts:50-72`). |
| **Postconditions** | An account exists for the email address, carrying the chosen username, and the visitor is at the sign-in page. |

## UC2: Sign in

| Part | Content |
|---|---|
| **Name** | Sign in |
| **Primary actor** | Registered user |
| **Stakeholders & interests** | User: reach personal meal, inventory, and nutrition data. Platform: admit only holders of valid credentials; every other area stays closed until then. |
| **Preconditions** | User holds an account and currently has no session. |
| **Trigger** | User asks to enter the application. |
| **Main success scenario** | 1. User supplies an email address and a password. 2. System checks both are present and the address is well formed. 3. User submits the credentials. 4. System authenticates the credentials and establishes a session. 5. System opens the recipe collection. |
| **Extensions** | 2a: Email is absent or malformed → system reports the field error and does not submit (`web/src/app/signin/page.tsx:31-39`). 2b: Password is absent → system reports the missing password (`web/src/app/signin/page.tsx:41-43`). 4a: Credentials are rejected → system states “Incorrect email or password” and raises a failure notice (`web/src/app/signin/page.tsx:61-69`). 1a: User requests any protected area without a session → system sends the user to sign in first (`web/src/utils/supabase/middleware.ts:37-47`). |
| **Postconditions** | User holds an authenticated session and is viewing the recipe collection (`web/src/app/signin/actions.ts:25`). |

## UC3: Browse recipes

| Part | Content |
|---|---|
| **Name** | Browse recipes |
| **Primary actor** | User |
| **Stakeholders & interests** | User: find a recipe worth cooking, ideally one they can already make. Platform: surface recipes fitting the user’s search, dietary tags, and current ingredients. |
| **Preconditions** | User is signed in; recipe data is available. |
| **Trigger** | User opens the recipe collection or changes a search or filter choice. |
| **Main success scenario** | 1. System presents the recipe collection alongside the user’s current ingredients. 2. User narrows by search text, ingredient, or dietary tag. 3. User chooses how closely recipes must match the ingredients on hand. 4. User chooses an ordering. 5. System presents the matching recipes with their ingredient-match standing. 6. User moves between result pages. |
| **Extensions** | 2a: User changes a search or filter → system returns to the first page of results (`web/src/app/dashboard/recipes/page.tsx:47,54,75,93`). 3a: User asks only for recipes they can make now → system keeps recipes matching at least 80 percent of required ingredients (`web/src/app/api/recipes/route.ts:97-98`). 3b: User asks for partially makeable recipes → system keeps the 50-to-80 percent band (`web/src/app/api/recipes/route.ts:99-102`). 5a: Nothing matches the active criteria → system states “No recipes found” (`web/src/app/dashboard/recipes/page.tsx:110`). 5b: The recipe request fails → system records the failure and stops loading (`web/src/hooks/use-recipe.tsx:66-69`). |
| **Postconditions** | User has seen one page of recipes satisfying the active criteria, each labelled with how much of it they can already make. |

## UC4: View recipe details

| Part | Content |
|---|---|
| **Name** | View recipe details |
| **Primary actor** | User |
| **Stakeholders & interests** | User: judge whether to cook this. Platform: present preparation effort, sustainability standing, ingredients, and nutrition honestly. |
| **Preconditions** | A recipe has been identified from a search result, a recommendation, or a calendar entry. |
| **Trigger** | User opens a recipe. |
| **Main success scenario** | 1. System retrieves the identified recipe. 2. System presents its name, image, preparation time, green score, and description. 3. System presents its dietary tags. 4. System presents its ingredients and quantities. 5. System presents its aggregated nutrient values. 6. System offers the recipe’s ingredients for shopping. |
| **Extensions** | 1a: No recipe carries the given identifier → system reports the recipe was not found (`web/src/app/api/recipes/[id]/route.ts:10-11`). 2a: Recipe carries no image → system omits the image rather than presenting a broken one (`web/src/app/dashboard/recipes/[id]/page.tsx:29-31`). 3a: Recipe carries no tags → system states that no tags are available (`web/src/app/dashboard/recipes/[id]/page.tsx:60`). |
| **Postconditions** | User has seen every detail the system holds for that recipe. |

## UC5: Request a personalized meal plan

| Part | Content |
|---|---|
| **Name** | Request a personalized meal plan |
| **Primary actor** | User |
| **Stakeholders & interests** | User: a plan matched to a stated health goal. Platform: interpret a free-text goal and return a defensible set of recipes. Operator: bound the cost of each request. |
| **Preconditions** | User is signed in and the recommendation service is reachable. |
| **Trigger** | User states a dietary or health goal and asks for a plan. |
| **Main success scenario** | 1. User states a goal in their own words. 2. User chooses how many meals the plan should contain. 3. User submits the request. 4. System interprets and expands the stated goal. 5. System selects recipes matching the expanded goal. 6. System presents the expanded goal and the recommended meals. |
| **Extensions** | 1a: Goal is blank → system asks the user to enter a goal and does not submit (`web/src/app/dashboard/recommender/page.tsx:31`), and the service refuses it independently (`backend/api/index.py:51-52`). 2a: Meal count is not 3, 5, or 7 → system refuses the count (`web/src/app/dashboard/recommender/page.tsx:35`), and the service refuses it independently (`backend/api/index.py:55-58`). 4a: The recommendation service is unreachable or errors → system reports the service response to the user (`web/src/app/api/recommender/route.tsx:16-18`, `web/src/app/dashboard/recommender/page.tsx:50`). 5a: A recommended recipe cannot be matched back to a stored recipe → system records the lookup failure and continues with the rest (`web/src/app/dashboard/recommender/page.tsx:75-84`). |
| **Postconditions** | User has seen an expanded reading of their goal and a plan of the requested size. |

## UC6: Schedule a meal

| Part | Content |
|---|---|
| **Name** | Schedule a meal |
| **Primary actor** | User |
| **Stakeholders & interests** | User: commit a recipe to a specific day and mealtime. Platform: hold a calendar that later drives shopping lists and nutrition totals. |
| **Preconditions** | User is signed in and has chosen a recipe. |
| **Trigger** | User decides to place a recipe on a particular day. |
| **Main success scenario** | 1. User selects a recipe. 2. User selects the date. 3. User selects the mealtime. 4. User confirms. 5. System records the scheduled meal against the user. 6. System shows the meal on the calendar. |
| **Extensions** | 4a: Recipe, date, or mealtime is missing → system refuses to record the entry (`web/src/app/api/events/route.ts:114-117`). 5a: The entry cannot be stored → system reports the failure (`web/src/app/api/events/route.ts:153`). 6a: The calendar cannot be retrieved → system records the retrieval failure (`web/src/app/dashboard/calendar/page.tsx:92`). |
| **Postconditions** | The meal is recorded on the user’s calendar and counts toward shopping-list generation and nutrient totalling. |

## UC7: Mark a scheduled meal complete

| Part | Content |
|---|---|
| **Name** | Mark a scheduled meal complete |
| **Primary actor** | User |
| **Stakeholders & interests** | User: record what was actually eaten, not merely what was planned. Platform: completion is the event that drives streaks, challenges, and achievements. |
| **Preconditions** | User is signed in and a scheduled meal exists on their calendar. |
| **Trigger** | User opens a scheduled meal and changes its status. |
| **Main success scenario** | 1. User opens a scheduled meal. 2. User marks it completed. 3. System records the new status against that entry. 4. System confirms the change. 5. System counts the completion toward the user’s streaks and challenge progress. |
| **Extensions** | 3a: Status is not a completed/not-completed value → system refuses the change (`web/src/app/api/events/[id]/route.ts:71`). 3b: The entry does not exist or does not belong to this user → system reports the entry was not found or the user is unauthorized (`web/src/app/api/events/[id]/route.ts:87-88`). 4a: The change cannot be stored → system reports the error to the user (`web/src/app/dashboard/calendar/page.tsx:188-193`). |
| **Postconditions** | The entry carries its new status and downstream progress reflects it. |

## UC8: Review nutrient trends

| Part | Content |
|---|---|
| **Name** | Review nutrient trends |
| **Primary actor** | User |
| **Stakeholders & interests** | User: see what they actually ate against what they intended. Platform: totals must be traceable to logged meals, never estimated. |
| **Preconditions** | User is signed in. |
| **Trigger** | User opens nutrient tracking or changes the reporting period. |
| **Main success scenario** | 1. User opens nutrient tracking. 2. User chooses a date or reporting period. 3. System totals the nutrients from the meals logged in that window. 4. System presents macronutrient standing against the user’s goals. 5. System presents the trend across the period. 6. System presents the additional nutrients. |
| **Extensions** | 2a: The date is not a valid calendar date → system refuses the request (`web/src/app/api/nutrients/daily/route.ts:67`). 2b: The reporting period is not one the system offers → system refuses the period (`web/src/app/api/nutrients/daily/route.ts:105`). 3a: A logged meal references a recipe or ingredient the system cannot resolve → system omits that contribution and continues totalling (`web/src/app/api/nutrients/daily/route.ts:163,169`). 3b: The data cannot be loaded → system reports the failure and offers to retry (`web/src/app/dashboard/nutrients/page.tsx:59-70`). 5a: No meals fall in the window → system states that no trend data exists yet and asks for meals (`web/src/app/dashboard/nutrients/page.tsx:245`). |
| **Postconditions** | User has seen their intake for the chosen window, set against their goals. |

## UC9: Set nutrient goals

| Part | Content |
|---|---|
| **Name** | Set nutrient goals |
| **Primary actor** | User |
| **Stakeholders & interests** | User: define what “on target” means for them. Platform: a stored goal is the baseline every later chart is read against. |
| **Preconditions** | User is signed in. |
| **Trigger** | User decides to define or revise a daily nutrient target. |
| **Main success scenario** | 1. User opens goal setting. 2. System presents the currently stored goal. 3. User states the target values. 4. User saves. 5. System stores the goal against the user. 6. System presents subsequent nutrient views against the new goal. |
| **Extensions** | 2a: The existing goal cannot be retrieved → system states the goal is unavailable but continues presenting intake (`web/src/app/dashboard/nutrients/page.tsx:110-112`). 3a: The submitted goal names no recognised nutrient field → system refuses the payload (`web/src/app/api/nutrients/goals/route.ts:37-55,109`). 4a: The submission is not readable → system refuses it (`web/src/app/api/nutrients/goals/route.ts:104`). 5a: The goal cannot be stored → system reports the storage failure (`web/src/app/api/nutrients/goals/route.ts:149`). |
| **Postconditions** | A daily nutrient goal is stored for the user and governs later nutrient views. |

## UC10: Export a nutrient report

| Part | Content |
|---|---|
| **Name** | Export a nutrient report |
| **Primary actor** | User |
| **Stakeholders & interests** | User: take their record to a clinician or keep it personally. Healthcare recipient: a readable, dated record. Platform: export only the requesting user’s own data. |
| **Preconditions** | User is signed in and has logged meals in the period of interest. |
| **Trigger** | User asks to download their nutrition record for a date range. |
| **Main success scenario** | 1. User chooses a start date and an end date. 2. User chooses the report form. 3. User requests the export. 4. System totals nutrients per day across the range. 5. System returns the report as a download. |
| **Extensions** | 1a: Either date is missing → system refuses the request (`web/src/app/api/nutrients/export/route.ts:362-365`). 1b: A date is not written as a calendar date → system refuses and states the expected form (`web/src/app/api/nutrients/export/route.ts:373`). 1c: The range is otherwise incoherent → system refuses the range (`web/src/app/api/nutrients/export/route.ts:379`). 2a: The requested form is neither offered form → system refuses it (`web/src/app/api/nutrients/export/route.ts:357-358`). 2b: The user asks for a PDF → system returns a text summary rather than a PDF file, as the source concedes (`web/src/app/api/nutrients/export/route.ts:328`). 4a: A day in the range has no logged meal → system omits that day rather than reporting zeroes (`web/src/app/api/nutrients/export/route.ts:130`). |
| **Postconditions** | User holds a dated record of their own intake across the requested range. |

## UC11: Review earned achievements

| Part | Content |
|---|---|
| **Name** | Review earned achievements |
| **Primary actor** | User |
| **Stakeholders & interests** | User: see progress recognised. Platform: recognition must follow real logged activity, not mere visits. |
| **Preconditions** | User is signed in. |
| **Trigger** | User opens achievements, or completes an action that may earn one. |
| **Main success scenario** | 1. User opens achievements. 2. System measures the user’s activity against each achievement’s condition. 3. System records any newly satisfied achievement. 4. System presents earned achievements alongside those still outstanding. 5. System announces anything newly earned. |
| **Extensions** | 2a: The achievement definitions cannot be read → system reports the failure and offers to retry (`web/src/app/api/achievements/route.ts:75`, `web/src/app/dashboard/achievements/page.tsx:88-95`). 2b: The user’s earned record cannot be read → system reports the failure (`web/src/app/api/achievements/route.ts:103`). 3a: A re-check is requested without stating what triggered it → system refuses the check (`web/src/app/api/achievements/check/route.ts:67-68`). 4a: Nothing has been earned yet → system states so and encourages continued use (`web/src/app/dashboard/achievements/page.tsx:181`). |
| **Postconditions** | The user’s earned achievements reflect their logged activity as of this moment. |

## UC12: Join a challenge

| Part | Content |
|---|---|
| **Name** | Join a challenge |
| **Primary actor** | User |
| **Stakeholders & interests** | User: a time-boxed target with a reward. Platform: one live participation per user per challenge, while a lapsed participation must not block a fresh one. |
| **Preconditions** | User is signed in and an active challenge is on offer. |
| **Trigger** | User chooses to take part in a challenge. |
| **Main success scenario** | 1. User browses the offered challenges. 2. User selects one and joins. 3. System confirms the challenge is on offer and active. 4. System records the user’s participation. 5. System begins tracking progress toward the challenge target. 6. System presents the challenge among the user’s active ones. |
| **Extensions** | 2a: No challenge is identified in the request → system refuses (`web/src/app/api/challenges/join/route.ts:37-40`). 3a: The challenge does not exist or is not active → system reports it is unavailable (`web/src/app/api/challenges/join/route.ts:53`). 4a: The user already holds a live participation in this challenge → system refuses the duplicate (`web/src/app/api/challenges/join/route.ts:72-97`). 4b: An earlier participation has lapsed → system treats it as stale and allows joining afresh (`web/src/app/api/challenges/join/route.ts:72-97`). 4c: Participation cannot be recorded → system reports the failure to the user (`web/src/app/dashboard/challenges/page.tsx:71-81`). 6a: The user has completed none yet → system states so (`web/src/app/dashboard/challenges/page.tsx:299`). |
| **Postconditions** | The user holds an active participation and their progress is being counted against the target. |

## UC13: Add an ingredient to inventory

| Part | Content |
|---|---|
| **Name** | Add an ingredient to inventory |
| **Primary actor** | User |
| **Stakeholders & interests** | User: know what is in the house without opening a cupboard. Platform: inventory drives expiry warnings, recipe matching, and waste reduction. |
| **Preconditions** | User is signed in and the ingredient exists in the catalogue. |
| **Trigger** | User acquires an ingredient and records it. |
| **Main success scenario** | 1. User identifies the ingredient from the catalogue. 2. User states the quantity and unit. 3. User states where it is stored. 4. User optionally states an expiry date, a low-stock threshold, and a note. 5. System records the item against the user. 6. System presents the item with its expiry standing. |
| **Extensions** | 1a: No ingredient is identified → system refuses (`web/src/app/api/inventory/route.ts:178-179`). 1b: The identified ingredient is not in the catalogue → system reports it was not found (`web/src/app/api/inventory/route.ts:193-194`). 2a: Quantity is absent or negative → system refuses (`web/src/app/api/inventory/route.ts:182-183`). 3a: No storage place is stated → system files the item in the pantry (`web/src/app/api/inventory/route.ts:198`). 5a: The same ingredient is already stored in the same place → system adds the new quantity to the existing entry rather than creating a duplicate, and overwrites the stored expiry date with the incoming one (`web/src/app/api/inventory/route.ts:207-233`). 5b: The item cannot be stored → system reports the failure (`web/src/app/api/inventory/route.ts:259`). |
| **Postconditions** | The ingredient is recorded in the user’s inventory with a quantity, a place, and an expiry standing. |

## UC14: Review inventory and expiry alerts

| Part | Content |
|---|---|
| **Name** | Review inventory and expiry alerts |
| **Primary actor** | User |
| **Stakeholders & interests** | User: use food before it spoils and notice what is running out. Household: less waste and less money thrown away. Platform: expiry standing must be truthful, since recommendations are built on it. |
| **Preconditions** | User is signed in and holds inventory items. |
| **Trigger** | User opens their inventory, or filters it. |
| **Main success scenario** | 1. User opens the inventory. 2. System presents every stored item, soonest expiry first. 3. System marks each item’s expiry standing. 4. System marks items that have fallen to their low-stock threshold. 5. System summarises the totals by storage place and by expiry standing. 6. User narrows the view by place or by ingredient name. |
| **Extensions** | 2a: User is unauthorized → system asks the user to sign in to view their inventory (`web/src/app/dashboard/inventory/page.tsx:86-95`, `web/src/app/api/inventory/route.ts:59-61`). 2b: The inventory cannot be loaded → system reports the failure (`web/src/app/dashboard/inventory/page.tsx:101-106`). 3a: The expiry date has passed → system marks the item expired (`web/src/app/api/inventory/route.ts:30-31`). 3b: The item expires within two days → system marks it critical (`web/src/app/api/inventory/route.ts:32-33`). 3c: The item expires within seven days → system marks it a warning (`web/src/app/api/inventory/route.ts:34-35`). 3d: The item carries no expiry date → system marks the standing unknown rather than guessing (`web/src/app/api/inventory/route.ts:18-20`). 4a: The item carries no low-stock threshold → system does not treat it as low stock (`web/src/app/api/inventory/route.ts:133`). |
| **Postconditions** | User has seen every stored item with a truthful expiry standing and knows which items are urgent. |

## UC15: Remove inventory items in bulk

| Part | Content |
|---|---|
| **Name** | Remove inventory items in bulk |
| **Primary actor** | User |
| **Stakeholders & interests** | User: clear out what has been eaten or thrown away, without deleting one item at a time. Platform: a bulk removal must never reach another user’s items. |
| **Preconditions** | User is signed in and holds inventory items. |
| **Trigger** | User selects several items and asks to remove them. |
| **Main success scenario** | 1. User selects the items to remove. 2. User confirms the removal. 3. System removes those of the selected items that belong to the user. 4. System presents the reduced inventory. |
| **Extensions** | 1a: Nothing is selected → system refuses an empty removal (`web/src/app/api/inventory/batch-delete/route.ts:25-26`). 1b: The selection is not a list of item identifiers → system refuses it (`web/src/app/api/inventory/batch-delete/route.ts:30-31`). 3a: User is unauthorized → system refuses the removal (`web/src/app/api/inventory/batch-delete/route.ts:18`). 3b: The removal fails → system reports the failure (`web/src/app/api/inventory/batch-delete/route.ts:43`). |
| **Postconditions** | The selected items no longer appear in the user’s inventory. |

## UC16: Get recipe suggestions from what is on hand

| Part | Content |
|---|---|
| **Name** | Get recipe suggestions from what is on hand |
| **Primary actor** | User |
| **Stakeholders & interests** | User: cook tonight without shopping, and use up what is about to spoil. Household: less waste. Platform: this is the product’s headline claim and rests on an external language service. |
| **Preconditions** | User is signed in, holds inventory items, and the recommendation service is reachable. |
| **Trigger** | User asks what they can cook with what they have. |
| **Main success scenario** | 1. User asks for suggestions from their inventory. 2. System passes the stored items, with their expiry standing, to the recommendation service. 3. Service favours recipes using ingredients that expire soonest. 4. System presents the suggested recipes with what is covered and what is missing. 5. User takes the missing ingredients toward a shopping list. |
| **Extensions** | 1a: The inventory is empty → system asks the user to add ingredients first (`web/src/app/dashboard/inventory/page.tsx:117-126`), and the service refuses it independently (`backend/api/index.py:73-74`). 1b: The requested number of recipes is outside the offered range → service refuses the request (`backend/api/index.py:77-80`). 2a: The recommendation service is unreachable → system reports that suggestions could not be generated and names the backend as the likely cause (`web/src/app/dashboard/inventory/page.tsx:153,158-166`). 3a: The service errors while composing suggestions → service reports the failure rather than returning a partial plan (`backend/api/index.py:89-94`). |
| **Postconditions** | User has seen recipes they can largely make now, prioritised by what is about to spoil. |

## UC17: Create a shopping list

| Part | Content |
|---|---|
| **Name** | Create a shopping list |
| **Primary actor** | User |
| **Stakeholders & interests** | User: organise a shop. Platform: a named list is the container everything else in the shopping flow hangs from. |
| **Preconditions** | User is signed in. |
| **Trigger** | User decides to start a new list. |
| **Main success scenario** | 1. User opens their shopping lists. 2. User asks for a new list. 3. User names it and optionally describes it. 4. User confirms. 5. System records the list against the user. 6. System presents it among the user’s lists. |
| **Extensions** | 1a: User is unauthorized → system asks the user to sign in (`web/src/app/dashboard/shopping/page.tsx:34-40`). 3a: The name is blank → system refuses to create the list (`web/src/app/api/shopping-lists/route.ts:85-86`). 5a: The list cannot be stored → system reports the failure (`web/src/app/api/shopping-lists/route.ts:102`). 6a: The user holds no lists → system states so and invites the first one (`web/src/app/dashboard/shopping/page.tsx:107`). |
| **Postconditions** | A named, empty shopping list exists and belongs to the user. |

## UC18: Add items to a shopping list

| Part | Content |
|---|---|
| **Name** | Add items to a shopping list |
| **Primary actor** | User |
| **Stakeholders & interests** | User: capture what to buy. Platform: matching a free-text entry to a catalogue ingredient is what later allows the bought item to become inventory. |
| **Preconditions** | User is signed in and owns the list. |
| **Trigger** | User realises something is needed and records it. |
| **Main success scenario** | 1. User opens one of their lists. 2. User names the item to buy. 3. System matches the name against the ingredient catalogue. 4. System records the item on the list, carrying the matched ingredient and its unit where one was found. 5. System presents the item on the list, unchecked. |
| **Extensions** | 1a: The list does not exist or does not belong to the user → system reports the list was not found (`web/src/app/api/shopping-lists/[id]/items/route.ts:26-35`). 2a: The item name is blank → system refuses to add it (`web/src/app/api/shopping-lists/[id]/items/route.ts:42-43`). 3a: No catalogue ingredient matches the name → system records the item by name alone, without a catalogue link (`web/src/app/api/shopping-lists/[id]/items/route.ts:53-65`). 4a: The item cannot be stored → system reports the failure and tells the user the item was not added (`web/src/app/dashboard/shopping/[id]/page.tsx:131-141`). |
| **Postconditions** | The item stands on the list, unchecked, linked to a catalogue ingredient where one matched. |

## UC19: Generate a shopping list from the meal calendar

| Part | Content |
|---|---|
| **Name** | Generate a shopping list from the meal calendar |
| **Primary actor** | User |
| **Stakeholders & interests** | User: shop for the week already planned, without transcribing recipes by hand. Platform: the calendar is the authority on what will be cooked. |
| **Preconditions** | User is signed in and has scheduled meals in the chosen period. |
| **Trigger** | User asks for a shopping list covering a date range. |
| **Main success scenario** | 1. User chooses a start date and an end date. 2. User requests generation. 3. System collects the meals scheduled in that range. 4. System gathers the ingredients those recipes require. 5. System creates a list carrying those ingredients. 6. System presents the generated list. |
| **Extensions** | 1a: Either date is missing → system refuses the request (`web/src/app/api/shopping-lists/generate/route.ts:34-35`). 1b: The user has no stored profile → system reports the profile was not found (`web/src/app/api/shopping-lists/generate/route.ts:47`). 3a: No meals are scheduled in the range → system reports there is nothing to generate from (`web/src/app/api/shopping-lists/generate/route.ts:83-86`). 3b: The calendar cannot be read → system reports the failure (`web/src/app/api/shopping-lists/generate/route.ts:80`). 4a: A required ingredient cannot be resolved → system omits it and continues with the rest (`web/src/app/api/shopping-lists/generate/route.ts:142`). 5a: The list cannot be created → system reports the failure (`web/src/app/api/shopping-lists/generate/route.ts:186`). |
| **Postconditions** | A shopping list exists covering everything the scheduled meals require in that range. |

## UC20: Transfer purchased items into inventory

| Part | Content |
|---|---|
| **Name** | Transfer purchased items into inventory |
| **Primary actor** | User |
| **Stakeholders & interests** | User: close the loop from shopping to kitchen without typing everything twice. Platform: this is the join between the shopping and inventory halves of the product. |
| **Preconditions** | User is signed in, has bought items from one of their lists, and those items carry a catalogue ingredient. |
| **Trigger** | User returns from shopping and moves bought items into the kitchen record. |
| **Main success scenario** | 1. User selects the purchased items on the list. 2. User states where each will be stored and, where known, its expiry date. 3. User confirms the transfer. 4. System records each item in the user’s inventory. 5. System reports what was transferred. 6. System presents the new items under their expiry standing. |
| **Extensions** | 1a: Nothing is selected → system refuses the transfer (`web/src/app/api/inventory/transfer/route.ts:32-33`). 1b: A selected item carries no catalogue ingredient → system refuses the transfer and names the requirement (`web/src/app/api/inventory/transfer/route.ts:38-42`). 2a: No storage place is stated → system files the item in the pantry (`web/src/app/api/inventory/transfer/route.ts:57,82`). 3a: User is unauthorized → system refuses the transfer (`web/src/app/api/inventory/transfer/route.ts:25`). 4a: The same ingredient is already stored in the same place → system adds the quantity to the existing entry rather than creating a duplicate (`web/src/app/api/inventory/transfer/route.ts:60-69`). 4b: One item fails to transfer → system records that item’s failure and continues with the remaining items (`web/src/app/api/inventory/transfer/route.ts:71-74,86-87`). |
| **Postconditions** | Purchased items appear in the user’s inventory with quantity, place, and expiry standing, and feed later inventory review and suggestion. |

## Coverage boundary

The repository contains additional user-facing behavior (for example sign-out, single-item inventory editing, checking items off a list, push-notification subscription, streak maintenance, and the dashboard summary widget), but these were not promoted into the requested top 20 because the selected set prioritizes the major planning, nutrition, inventory, gamification, and grocery workflows evidenced by the current implementation. They should be reconsidered when the team reconciles outputs from the other LLMs.

Three further behaviors were examined and deliberately excluded as unsupported rather than deferred. Shopping-list sharing is implemented at `web/src/app/api/shopping-lists/share/route.ts` but is unreachable: no interface code calls it, the link it returns points at `/share/shopping/<token>` for which no route exists in the build manifest, and the user guide lists sharing as "Coming Soon" (`docs/user-guides/shopping-lists.md:95`). Theme selection, data export, and privacy management appear in settings but are rendered disabled (`web/src/app/dashboard/settings/page.tsx:119,134-139`). Neither is a use case this product supports today.

## Clean-room disclosure

The governing prompt forbids consulting test artifacts and requires that any breach be disclosed rather than concealed. Two breaches occurred and are recorded here.

First, before this task began the same session had opened `backend/tests/conftest.py`, the import headers of the two backend test modules, the Jest and Playwright configuration files, and the file names of `web/__tests__/**` and `web/e2e/*.spec.ts`, while verifying that the project builds and runs. No use case, extension, or citation above derives from any of them; all twenty were derived from `README.md`, `docs/user-guides/`, `web/src/`, `backend/api/`, and the route manifest emitted by `next build`. The residual risk is that exposure to test file names may have biased which features felt salient.

Second, the opening sixty lines of the Codex run's output were displayed during drafting, and four citations in early drafts of UC3 and UC4 were carried over from it rather than read from source. Each described a real behavior, but none of the four line ranges was accurate: `recipes/[id]/page.tsx:28-37` is in fact `:29-31`; `recipes/[id]/page.tsx:57-68` is in fact `:60`; `use-recipe.tsx:58-70` is in fact `:66-69`; and `recipes/page.tsx:44-55` is in fact `:47,54,75,93`. All four were re-read from source and corrected before this document was finalized. Because that exposure also revealed the names of UC1 through UC5, **agreement between this run and the Codex run on UC1-UC5 is not independent and must not be counted as cross-model confirmation.** UC6 through UC20 were named and derived before any part of the Codex output beyond its first sixty lines was seen.
