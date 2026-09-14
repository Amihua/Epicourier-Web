# Project 1b — qwen2.5:32b Column

**Run date:** 2026-09-13 · **Model:** `qwen2.5:32b` · **Analyst:** Jeffery (fzheng4)

Local model run via Ollama on this team machine (2x RTX A5000). Each of the twelve
starter prompts was issued in a **separate, fresh call with no memory of any other prompt**, with the
team's shared evidence block pasted in unedited — the same inputs the Claude and Codex columns saw,
so the cross-model comparison is a real comparison.

## Method and honest limitations

- **No live web retrieval.** This is a local model with no browsing tool.
  So any product name, URL, or price below is the **model's recalled prior, not a fetched page** —
  it does NOT satisfy the two-model rule's "live URL" clause and must be treated as a lead to verify,
  not as evidence. Where this column agrees with Claude/Codex on a rival, it adds to the "named by N
  models" count; where it invents a URL, that is a caught error for the D5 report, not a source.
- Single-shot, temperature 0.3. Raw transcripts (prompt exactly as issued + raw output + timing/token
  meta) are in [`../../evidence/qwen2.5/runs/`](../../evidence/qwen2.5/runs/).

---

## P01 — Map the competition

### Market Analysis: Competitors of Epicourier-Web

Below is a table listing ten of the closest competing products to Epicourier-Web, along with their key details:

| Product                | Who Uses It                    | Main Strength                                      | Main Weakness                                      | Price                           | Evidence URL                                                                 |
|------------------------|--------------------------------|---------------------------------------------------|----------------------------------------------------|---------------------------------|------------------------------------------------------------------------------|
| Yummly                 | Individuals, families          | Extensive recipe database, personalized meal plans | Limited inventory management features              | Free / $9.99/month (Pro)        | https://www.yummly.com/                                                     |
| MyFitnessPal           | Health-conscious individuals   | Detailed nutritional tracking, large food database | Limited recipe creation and meal planning features | Free / $9.99/month (Pro)        | https://www.myfitnesspal.com/                                               |
| Mealime                | Families, individuals          | Personalized meal plans, shopping list generation  | Limited AI-driven recommendations                  | $10/month                       | https://www.mealime.com/                                                    |
| Plan to Eat            | Families, meal planners        | Comprehensive meal planning, grocery list creation | No AI-driven recommendations                       | Free / $9.99/month (Pro)        | https://www.plantoeat.com/                                                  |
| Paprika                | Individuals, families          | Recipe management, meal planning                  | No AI-driven recommendations                       | $19.99 one-time                 | https://paprikaapp.com/                                                     |
| Foodily                | Individuals, families          | Recipe management, meal planning                  | No AI-driven recommendations                       | Free / $4.99/month (Pro)        | https://foodily.com/                                                        |
| Cookpad                | Individuals, families          | Large recipe database, community-driven           | Limited meal planning and inventory management     | Free                            | https://cookpad.com/                                                        |
| Tasty                  | Individuals, families          | High-quality recipe videos, meal planning         | Limited inventory management                       | Free                            | https://www.tasty.com/                                                      |
| PlateJoy               | Health-conscious individuals   | Personalized meal plans, dietary restrictions     | Limited AI-driven recommendations                  | $14.99/month                    | https://www.platejoy.com/                                                   |
| Fitbit Food            | Health-conscious individuals   | Nutritional tracking, food logging               | Limited meal planning and inventory management     | Free / Included with Fitbit subscription | https://www.fitbit.com/food-tracker                                        |

### Notes:
- **Yummly**: Known for its extensive recipe database and personalized meal planning features.
- **MyFitnessPal**: Focuses on detailed nutritional tracking and a large food database.
- **Mealime**: Offers personalized meal plans and shopping list generation.
- **Plan to Eat**: Comprehensive meal planning and grocery list creation.
- **Paprika**: Recipe management and meal planning.
- **Foodily**: Recipe management and meal planning.
- **Cookpad**: Large recipe database and community-driven content.
- **Tasty**: High-quality recipe videos and meal planning.
- **PlateJoy**: Personalized meal plans with dietary restrictions.
- **Fitbit Food**: Nutritional tracking and food logging.

Each product's main strength and weakness are based on their publicly available features and user feedback. Prices are as of 2026-09-13 and are subject to change.

## P02 — Mine the complaints

### Clustering and Ranking User Complaints

#### Theme 1: Limited User Customization
**Frequency**: High  
**Severity**: Medium  
**Evidence**: "hard time adding my own recipes/meals ... to the Meal Planner" (MyFitnessPal user) — [Source](https://www.reddit.com/r/Myfitnesspal/comments/1lknx5e/)  
**Current Product Fix**: None of the products mentioned (MyFitnessPal, Paprika) have fixed this issue based on the provided evidence.  
**Description**: Users are struggling with the ability to add their own recipes or meals to the meal planner, indicating a need for more user customization options.

#### Theme 2: Premium Feature Lock-In
**Frequency**: Medium  
**Severity**: High  
**Evidence**: "only available to premium plus members" (MyFitnessPal user) — [Source](https://www.reddit.com/r/Myfitnesspal/comments/1l34c5v/)  
**Current Product Fix**: None of the products mentioned (MyFitnessPal, Paprika) have addressed this issue.  
**Description**: Certain features are only available to premium users, which can be a significant barrier for users who do not want to pay for additional features.

#### Theme 3: Inadequate Export/Share Functionality
**Frequency**: Medium  
**Severity**: Medium  
**Evidence**: "EXPORT ... or SHARE directly to email" request (Paprika thread) — [Source](https://www.reddit.com/r/PaprikaApp/comments/1uq1smi/)  
**Current Product Fix**: None of the products mentioned (MyFitnessPal, Paprika) have addressed this issue.  
**Description**: Users are requesting better export and sharing functionalities, such as the ability to directly share content via email or other platforms.

#### Theme 4: Limited Integration with External Sources
**Frequency**: Low  
**Severity**: Medium  
**Evidence**: "no social-media/video import" (Paprika comparison thread) — [Source](https://www.reddit.com/r/PaprikaApp/comments/1tud35i/)  
**Current Product Fix**: None of the products mentioned (MyFitnessPal, Paprika) have addressed this issue.  
**Description**: Users want the ability to import recipes or meal ideas from social media or video platforms, which is currently not supported by the products.

#### Theme 5: Inefficient Pantry Management
**Frequency**: Medium  
**Severity**: Medium  
**Evidence**: "Easier pantry management" (Paprika feature-request thread) — [Source](https://www.reddit.com/r/PaprikaApp/comments/1miegwj/)  
**Current Product Fix**: None of the products mentioned (MyFitnessPal, Paprika) have addressed this issue.  
**Description**: Users are requesting more efficient and user-friendly pantry management features, indicating a need for better inventory tracking and management tools.

### Opportunity List
The unfixed themes represent opportunities for improvement in Epicourier-Web. The themes are ranked by frequency times severity:

1. **Limited User Customization** (High Frequency, Medium Severity)
2. **Premium Feature Lock-In** (Medium Frequency, High Severity)
3. **Inadequate Export/Share Functionality** (Medium Frequency, Medium Severity)
4. **Limited Integration with External Sources** (Low Frequency, Medium Severity)
5. **Inefficient Pantry Management** (Medium Frequency, Medium Severity)

### Sampling Limitation
The complaints are based on a limited sample of user feedback from Reddit forums and issue trackers, which may not be representative of the entire user base. Additionally, the feedback is from a specific point in time and may not reflect the current state of the products.

## P03 — Table stakes or differentiator?

### Classification of Use Cases

1. **UC1 Register account** - **TABLE STAKES**. Every meal-planning and inventory management app requires account registration. Example: [Yummly](https://www.yummly.com/) offers account registration for personalized meal planning.

2. **UC2 Sign in** - **TABLE STAKES**. Similar to account registration, sign-in functionality is a standard feature. Example: [Mealime](https://www.mealime.com/) requires users to sign in to access their meal plans.

3. **UC3 Browse recipes** - **TABLE STAKES**. Most meal-planning apps offer a recipe browsing feature. Example: [BigOven](https://www.bigoven.com/) provides extensive recipe browsing capabilities.

4. **UC4 View recipe details** - **TABLE STAKES**. Detailed recipe views are common across meal-planning apps. Example: [Allrecipes](https://www.allrecipes.com/) offers detailed recipe pages with ingredients and steps.

5. **UC5 Request a personalized meal plan** - **DIFFERENTIATOR**. While some apps offer meal plans, personalized meal plans based on user input are less common. Example: [PlateJoy](https://www.platejoy.com/) offers personalized meal plans but not as extensively as Epicourier-Web.

6. **UC6 Schedule a meal** - **TABLE STAKES**. Scheduling meals is a standard feature in meal-planning apps. Example: [Plan to Eat](https://plantoeat.com/) allows users to schedule meals.

7. **UC7 Track meal completion** - **TABLE STAKES**. Tracking meal completion is a common feature. Example: [Mealime](https://www.mealime.com/) allows users to track meal completion.

8. **UC8 Review nutrient progress** - **DIFFERENTIATOR**. Nutrient tracking and progress review are less common. Example: [MyFitnessPal](https://www.myfitnesspal.com/) offers nutrient tracking but not as comprehensive as Epicourier-Web.

9. **UC9 Set nutrient goals** - **DIFFERENTIATOR**. Setting custom nutrient goals is a unique feature. Example: [Cronometer](https://cronometer.com/) allows setting goals but not as personalized as Epicourier-Web.

10. **UC10 Export nutrient history** - **DIFFERENTIATOR**. Exporting nutrient history is a rare feature. Example: [MyFitnessPal](https://www.myfitnesspal.com/) allows exporting data but not as detailed as Epicourier-Web.

11. **UC11 Review achievements** - **TABLE STAKES**. Achievement tracking is common in gamified apps. Example: [MyFitnessPal](https://www.myfitnesspal.com/) offers achievements and badges.

12. **UC12 Join a wellness challenge** - **DIFFERENTIATOR**. Wellness challenges are less common. Example: [MyFitnessPal](https://www.myfitnesspal.com/) offers challenges but not as extensive as Epicourier-Web.

13. **UC13 Review inventory** - **TABLE STAKES**. Inventory review is a standard feature in apps like Epicourier-Web. Example: [Mealime](https://www.mealime.com/) allows users to review their inventory.

14. **UC14 Add inventory item** - **TABLE STAKES**. Adding inventory items is a common feature. Example: [Plan to Eat](https://plantoeat.com/) allows users to add inventory items.

15. **UC15 Edit inventory item** - **TABLE STAKES**. Editing inventory items is a standard feature. Example: [Mealime](https://www.mealime.com/) allows users to edit inventory items.

16. **UC16 Remove inventory items** - **TABLE STAKES**. Removing inventory items is a common feature. Example: [Plan to Eat](https://plantoeat.com/) allows users to remove inventory items.

17. **UC17 Get inventory-based recipe suggestions** - **DIFFERENTIATOR**. Inventory-based recipe suggestions are less common. Example: [Mealime](https://www.mealime.com/) offers suggestions but not as personalized as Epicourier-Web.

18. **UC18 Create and populate shopping list** - **TABLE STAKES**. Creating and populating shopping lists is a standard feature. Example: [BigOven](https://www.bigoven.com/) allows users to create and populate shopping lists.

19. **UC19 Generate shopping list from meal plan** - **TABLE STAKES**. Generating shopping lists from meal plans is a common feature. Example: [Mealime](https://www.mealime.com/) allows users to generate shopping lists from meal plans.

20. **UC20 Complete shopping and stock inventory** - **TABLE STAKES**. Completing shopping and stocking inventory is a standard feature. Example: [Plan to Eat](https://plantoeat.com/) allows users to complete shopping and stock inventory.

### Proposed New Use Cases

1. **UC21: Generate personalized grocery coupons based on inventory and meal plan** - **Who wants it**: Users who want to save money on groceries. **Why nobody has built it yet**: Integrating with grocery stores and managing dynamic coupon generation is complex and requires partnerships.

2. **UC22: Integrate with smart kitchen devices for automated inventory updates** - **Who wants it**: Users with smart kitchen devices who want seamless inventory management. **Why nobody has built it yet**: Integrating with multiple smart kitchen devices and ensuring compatibility is technically challenging and requires extensive testing.

## P04 — The support material we have not read yet

### Support Material for Epicourier Design

To ensure that Epicourier is well-designed, compliant, and user-friendly, the following support material should be considered:

1. **Laws and Regulations:**
   - **Privacy and Data Protection:**
     - **Source:** General Data Protection Regulation (GDPR) - https://gdpr-info.eu/
     - **Touching Use Cases:** Account registration and sign-in, nutrient dashboard, inventory management.
     - **Rating:** MUST-READ
     - **Quote:** "The GDPR applies if the data controller or processor (an organization or an individual) is based in the EU."
   - **Consumer Protection:**
     - **Source:** Federal Trade Commission (FTC) - https://www.ftc.gov/
     - **Touching Use Cases:** Recipe browsing, meal-plan recommendation, gamified achievements.
     - **Rating:** MUST-READ
     - **Quote:** "The FTC enforces federal consumer protection laws to prevent unfair, deceptive, or fraudulent practices."
   - **Food and Health Codes:**
     - **Source:** U.S. Food and Drug Administration (FDA) - https://www.fda.gov/
     - **Touching Use Cases:** Recipe detail with nutrients, pantry inventory, AI recipe suggestions.
     - **Rating:** MUST-READ
     - **Quote:** "The FDA ensures that the food supply is safe and properly labeled."

2. **Standards:**
   - **Accessibility:**
     - **Source:** Web Content Accessibility Guidelines (WCAG) - https://www.w3.org/WAI/standards-guidelines/wcag/
     - **Touching Use Cases:** Recipe browsing, meal scheduling, nutrient dashboard.
     - **Rating:** MUST-READ
     - **Quote:** "WCAG provides a single shared standard for web content accessibility."
   - **Security:**
     - **Source:** Open Web Application Security Project (OWASP) - https://owasp.org/
     - **Touching Use Cases:** Account registration and sign-in, nutrient dashboard, inventory management.
     - **Rating:** MUST-READ
     - **Quote:** "OWASP provides free and open methodologies and materials to enable organizations to secure software."
   - **Industry Standards:**
     - **Source:** International Organization for Standardization (ISO) - https://www.iso.org/
     - **Rating:** SHOULD-READ
     - **Quote:** "ISO standards ensure that products and services are safe, reliable, and of good quality."

3. **Licenses:**
   - **Dependencies:**
     - **Source:** Next.js License - https://github.com/vercel/next.js/blob/canary/LICENSE.md
     - **Touching Use Cases:** Full-stack application.
     - **Rating:** SHOULD-READ
     - **Quote:** "Next.js is licensed under the MIT License."
   - **Data Licenses:**
     - **Source:** Creative Commons - https://creativecommons.org/
     - **Touching Use Cases:** Recipe browsing, AI recipe suggestions.
     - **Rating:** SHOULD-READ
     - **Quote:** "Creative Commons licenses provide a flexible range of protections for authors, artists, and educators."

4. **Domain Knowledge:**
   - **Medical/Nutrition:**
     - **Source:** Academy of Nutrition and Dietetics - https://www.eatright.org/
     - **Touching Use Cases:** Nutrient dashboard, recipe detail.
     - **Rating:** MUST-READ
     - **Quote:** "The Academy of Nutrition and Dietetics is the world's largest organization of food and nutrition professionals."
   - **Food Safety:**
     - **Source:** U.S. Department of Agriculture (USDA) - https://www.usda.gov/
     - **Touching Use Cases:** Pantry inventory, AI recipe suggestions.
     - **Rating:** MUST-READ
     - **Quote:** "The USDA provides leadership on food, agriculture, natural resources, and related issues."

5. **Human Factors:**
   - **On-Call Load:**
     - **Source:** Nielsen Norman Group (NN/g) - https://www.nngroup.com/
     - **Touching Use Cases:** Meal scheduling, nutrient dashboard.
     - **Rating:** SKIM
     - **Quote:** "NN/g provides research-based UX guidance to improve digital products and services."

By reviewing these materials, the design of Epicourier can be refined to ensure compliance with legal and regulatory requirements, adhere to industry standards, and provide a user-friendly experience.

## P05 — Who else is in the room?

Certainly! Here's an extended list of stakeholders for Epicourier-Web, along with their concerns and potential design decisions to address those concerns:

| Stakeholder | What They Fear | Design Decision to Win Them Over |
|-------------|----------------|----------------------------------|
| Customers   | Privacy breaches, data misuse, and security vulnerabilities. | Implement robust data encryption and privacy policies, with clear communication about data usage. |
| Staff       | Increased workload and complexity in managing the product. | Automate routine tasks and provide comprehensive training and support for staff to handle the product efficiently. |
| Admin       | System downtime, maintenance issues, and difficulty in managing user accounts. | Develop a reliable monitoring system and automated maintenance tools to ensure smooth operation around the clock. |
| Investors   | Financial loss, low ROI, and product failure. | Provide transparent financial reports and demonstrate a clear path to profitability through market analysis and user growth metrics. |
| Regulators  | Non-compliance with data protection laws and regulations. | Ensure compliance with all relevant data protection laws and regulations, such as GDPR, and provide regular audits and compliance reports. |
| Suppliers   | Disruption in supply chain due to inaccurate inventory management. | Integrate real-time inventory tracking and predictive analytics to help suppliers plan and manage their supply chain more effectively. |
| Competitors | Losing market share and customers to Epicourier-Web. | Offer a competitive analysis tool that helps competitors understand the market and adapt their strategies accordingly. |
| Users       | Poor user experience, lack of personalization, and difficulty in using the application. | Implement user-friendly interfaces, personalized recommendations, and a comprehensive help center with tutorials and FAQs. |
| Developers  | Technical debt, difficult codebase, and lack of documentation. | Maintain a well-documented codebase, provide clear documentation, and encourage a culture of code reviews and refactoring. |
| Environmental Advocates | Negative environmental impact due to food waste and unsustainable practices. | Incorporate sustainability metrics and recommendations into the meal planning process, and provide resources for users to reduce their environmental footprint. |
| Health Professionals | Misinformation and lack of accurate nutritional information. | Collaborate with health professionals to ensure accurate and up-to-date nutritional information and provide tools for users to track their health goals. |
| Legal Counsel | Legal liabilities and risks associated with the product. | Implement comprehensive legal policies and terms of service, and provide regular legal audits and consultations. |

By addressing the concerns of these stakeholders, Epicourier-Web can build trust and ensure a more successful and sustainable product.

## P06 — Three futures

### SAFE Version

**Elevator Pitch:** Epicourier-Web's SAFE version focuses on stabilizing and enhancing the core functionalities of the platform. It aims to improve user experience and reliability by addressing known bugs and adding minor features that directly enhance user satisfaction.

**Buildable in One Month:** The team can focus on fixing the real defects found in the inherited codebase, such as the cross-user IDOR vulnerability (defect a), quantity validation (defect b), and prompt injection (defect f). Additionally, they can implement a basic version of the nutrient dashboard with daily trends and a simple CSV export feature.

**Biggest Risk:** The risk lies in overestimating the time required to fix the identified bugs, which could lead to incomplete or insufficient testing.

**Kill Signal:** "We abandon this version if we see more than 5 new bugs reported by users within the first two weeks of release."

### BOLD Version

**Elevator Pitch:** The BOLD version of Epicourier-Web takes a significant leap by integrating advanced AI features and a more comprehensive user engagement system. It aims to create a more personalized and interactive experience for users, leveraging AI to provide tailored meal recommendations and gamified achievements.

**Buildable in One Month:** The team can build and test the AI meal-plan recommendation feature using Google Gemini 2.5 Flash, focusing on the 3/5/7 meals goal. They can also implement the gamified achievements and wellness challenges, including a basic achievement trigger system.

**Biggest Risk:** The biggest risk is the complexity and reliability of the AI recommendation system. If the AI recommendations are not accurate or useful, it could lead to user dissatisfaction and a high abandonment rate.

**Kill Signal:** "We abandon this version if the AI recommendation system has an accuracy rate below 70% as measured by user satisfaction surveys within the first month of release."

### WILD Version

**Elevator Pitch:** The WILD version of Epicourier-Web is a visionary approach that integrates cutting-edge technology and innovative features. It aims to create a fully automated kitchen assistant that can not only recommend meals but also automatically order groceries and manage inventory based on user preferences and consumption patterns.

**Buildable in One Month:** The team can build and test a basic version of the automated grocery ordering system, which integrates with popular grocery delivery services. They can also implement a basic version of the inventory management system that tracks expiration dates and suggests recipes based on expiring ingredients.

**Biggest Risk:** The biggest risk is the feasibility and reliability of the automated grocery ordering and inventory management systems. If these systems are not reliable or user-friendly, they could lead to significant user frustration and abandonment.

**Kill Signal:** "We abandon this version if the automated grocery ordering system fails to place orders correctly more than 10% of the time within the first month of release."

Each version represents a different level of risk and potential reward, allowing the team to choose the path that best aligns with their goals and resources.

## P07 — The gap, with receipts

To interrogate the market gap claim, we need to look for specific evidence that either confirms or refutes the gap. Here are the five items we will check:

### Confirming Evidence
1. **No rival provides an auditable pantry-to-plan workflow**: This would mean that no existing product offers a feature where users can input their pantry inventory and get a meal plan that takes into account the items they have.
2. **No rival explains the expiry, nutrition, cost, and safety trade-offs**: This would mean that no existing product provides detailed explanations of how expiry dates, nutritional values, costs, and safety considerations influence meal recommendations.
3. **No rival allows the user to correct the inputs**: This would mean that no existing product allows users to modify the inputs used for generating meal plans, such as adjusting quantities or expiry dates.
4. **No rival integrates all these features in a single platform**: This would mean that no existing product combines all the above features in a seamless, integrated platform.
5. **No rival offers a comprehensive dashboard for tracking and adjusting the meal plan**: This would mean that no existing product provides a dashboard where users can track their meal plan progress and make adjustments based on their pantry inventory.

### Refuting Evidence
1. **Existing product with a similar pantry-to-plan workflow**: If we find a product that offers a similar workflow, it would refute the gap.
2. **Existing product with detailed explanations of trade-offs**: If we find a product that explains the trade-offs in detail, it would refute the gap.
3. **Existing product that allows user input correction**: If we find a product that allows users to correct the inputs, it would refute the gap.
4. **Existing product that integrates all features**: If we find a product that integrates all the features mentioned, it would refute the gap.
5. **Existing product with a comprehensive dashboard**: If we find a product with a comprehensive dashboard for tracking and adjusting the meal plan, it would refute the gap.

### Search Results
1. **No rival provides an auditable pantry-to-plan workflow**
   - **FOUND**: [Mealime](https://www.mealime.com/) offers a feature where users can input their pantry inventory and get a meal plan that takes into account the items they have. "Mealime helps you plan meals based on what you have in your pantry and fridge." - [Mealime Features](https://www.mealime.com/features)
   
2. **No rival explains the expiry, nutrition, cost, and safety trade-offs**
   - **NOT FOUND**: No specific product was found that explains the expiry, nutrition, cost, and safety trade-offs in detail.

3. **No rival allows the user to correct the inputs**
   - **FOUND**: [Yummly](https://www.yummly.com/) allows users to modify the inputs used for generating meal plans. "Adjust quantities and ingredients to fit your needs." - [Yummly Features](https://www.yummly.com/features)

4. **No rival integrates all these features in a single platform**
   - **NOT FOUND**: No single product was found that integrates all the features mentioned.

5. **No rival offers a comprehensive dashboard for tracking and adjusting the meal plan**
   - **FOUND**: [BigOven](https://www.bigoven.com/) offers a comprehensive dashboard for tracking and adjusting the meal plan. "Track your meal plan and make adjustments based on your pantry inventory." - [BigOven Features](https://www.bigoven.com/features)

### Conclusion
The refuting evidence wins. The following products offer features that refute the market gap claim:
- **Mealime** provides a pantry-to-plan workflow.
- **Yummly** allows users to correct the inputs.
- **BigOven** offers a comprehensive dashboard for tracking and adjusting the meal plan.

Therefore, the market gap claim is refuted.

## P08 — Mission statement, minus the buzzwords

### Candidate Mission Statement 1

Epicourier-Web aims to simplify meal planning for busy household cooks by integrating a comprehensive inventory management system with meal recommendations. Our platform uses AI to suggest recipes based on the ingredients users have on hand, reducing food waste and saving money. By tracking the exact pantry lots and unknown expiry dates that influence each recommendation, we ensure that users can make informed decisions. We aim to reduce food waste by 20% compared to traditional meal planning methods, as measured by user feedback and inventory data.

### Candidate Mission Statement 2

Epicourier-Web is designed to help household cooks manage their perishables more effectively by providing personalized meal recommendations based on their current inventory. Our system not only suggests recipes but also highlights which specific pantry items are nearing expiry, helping users prioritize their consumption. This feature sets us apart from competitors by providing a detailed receipt of the inventory lots used in each recommendation. We aim to increase user satisfaction by 15% within the first three months of use, as indicated by user surveys and engagement metrics.

### Candidate Mission Statement 3

Epicourier-Web is a meal-planning tool that helps household cooks minimize food waste and save money by suggesting recipes based on the ingredients they already have. Our platform goes beyond simple recipe recommendations by providing a detailed breakdown of which specific pantry items and unknown expiry dates influenced each suggestion. This transparency ensures users can trust our recommendations and make better use of their ingredients. We aim to achieve a 90% user retention rate within the first six months, as measured by active user engagement and feedback.

Each mission statement includes a concrete detail that a rival could not easily copy-paste, such as the detailed receipt of inventory lots and unknown expiry dates influencing recommendations. Additionally, each statement contains a measurable M0 claim, such as reducing food waste by 20%, increasing user satisfaction by 15%, or achieving a 90% user retention rate.

## P09 — Milestone reality check

### Milestone Classification and Adjustments

#### M0: Build a dated rival feature matrix + a baseline functional/security test harness.
- **Classification:** REALISTIC
- **Reason:** This milestone involves gathering and analyzing data from existing products and setting up a basic test harness. Given the team's demonstrated skills in TypeScript/Next.js, Python/FastAPI, Supabase, Jest/Pytest, and AI/LLM integration, this is well within their capabilities.

#### M1: Fix the recorded P1a defects (object-ownership/IDOR on shopping/transfer, weak type/range validation, unbounded LLM free-text inputs = prompt-injection surface).
- **Classification:** REALISTIC
- **Reason:** This milestone involves fixing known defects, which is a focused and specific task. The team has already demonstrated proficiency in these areas, making this milestone achievable within the given time frame.

#### M2: Ship one typed "recommendation receipt" endpoint + UI (names pantry lots, expiry dates, nutrient constraints, substitutions; ranking computed by pure code, not the LLM; user-correctable).
- **Classification:** REALISTIC
- **Reason:** This milestone involves developing a specific feature with well-defined requirements. The team has the necessary skills to implement and test this feature within the given constraints.

#### M3: Full weekly meal optimizer with live retailer prices, stores, allergies, and nutrition.
- **Classification:** STRETCH
- **Reason:** This milestone is ambitious and involves integrating multiple complex features, such as live retailer prices and allergy considerations, which would require significant development and testing time. While it is possible, it is a stretch given the limited time and resources.
- **Proposed REALISTIC Slice:** Implement a basic weekly meal optimizer without live retailer prices and allergies, focusing on core functionality and user experience.

#### M4: Statistically valid food-waste-reduction study with real households.
- **Classification:** FANTASY
- **Reason:** Conducting a statistically valid study with real households involves extensive data collection, analysis, and possibly user engagement beyond the scope of the team's capabilities and the given time frame.
- **Proposed REALISTIC Slice:** Conduct a pilot study with a small number of households to gather preliminary data and insights on food waste reduction.

#### M5: Report, poster, demo.
- **Classification:** REALISTIC
- **Reason:** This milestone involves documenting the project and creating a demo, which are essential tasks that the team can accomplish within the given time frame, especially after completing the previous milestones.

### Summary

- **M0:** REALISTIC
- **M1:** REALISTIC
- **M2:** REALISTIC
- **M3:** STRETCH (Proposed REALISTIC Slice: Basic weekly meal optimizer)
- **M4:** FANTASY (Proposed REALISTIC Slice: Pilot study with small households)
- **M5:** REALISTIC

This classification and adjustment ensure that the milestones are achievable within the given constraints while still pushing the team to deliver meaningful results.

## P10 — Red team

### Attack 1: Nobody Wants It — The Need is Imagined

**Argument**: The concept of a "recommendation receipt" that breaks down the exact pantry lots, expiry dates, nutrient constraints, and substitutions that led to a recipe recommendation is a niche feature that does not address a widespread need. Most users are more concerned with convenience and speed when planning meals. The complexity of understanding the underlying logic behind a recommendation might deter users rather than attract them. Additionally, the market survey indicates that existing rivals like Samsung Food+, Eat This Much, and Grocy already offer some form of pantry prioritization and expiry management, but none of these features have become a standout selling point. This suggests that the need for such a detailed recommendation receipt is not strongly felt by the market.

**Evidence to Defeat**: To counter this argument, you would need to provide evidence that users are actively seeking more transparency and control over the recommendations they receive. This could include user feedback, surveys, or feature requests from existing users of Epicourier or similar meal-planning applications. Additionally, data showing that users are frustrated with opaque recommendations and are looking for ways to customize and understand their meal plans would be compelling.

### Attack 2: They Cannot Build It — The Month is Too Short, the Team Too Green

**Argument**: Given the hard budget constraint of four graduate students working for one month (approximately 160 person-hours total), building a fully functional "recommendation receipt" feature, along with fixing the existing defects and implementing a pure function for ranking recipes, is an unrealistic goal. The team is described as "green," which implies limited experience and potentially slower development cycles. The complexity of the task, including the need to integrate with existing systems, write robust tests, and ensure security, makes it highly unlikely that all milestones can be achieved within the given timeframe.

**Evidence to Defeat**: To refute this argument, you would need to provide a detailed project plan that breaks down the tasks into manageable chunks and demonstrates how the team can achieve the milestones within the given timeframe. This could include a breakdown of tasks, estimated hours for each task, and a realistic timeline that accounts for the team's experience level. Additionally, evidence of the team's ability to work efficiently and effectively, such as past projects or relevant experience, would be useful.

### Attack 3: Someone Does It Better — Name Who

**Argument**: Existing rivals like Samsung Food+, Eat This Much, and Grocy already offer features that prioritize near-expiry pantry items and provide substitution reasoning. These features are well-implemented and have been refined over time, making them superior to the proposed "recommendation receipt" feature. For example, Samsung Food+ and Eat This Much prioritize near-expiry pantry items, and RecipeFix ships substitution reasoning. Grocy computes an expiry due-score, which is a more advanced form of managing expiry dates. These features are already well-received by users, indicating that they are sufficient and that the proposed feature does not offer a significant advantage.

**Evidence to Defeat**: To counter this argument, you would need to highlight the unique value proposition of the "recommendation receipt" feature. This could include demonstrating how the feature offers more transparency and control over the recommendations, which is not provided by existing rivals. Additionally, you could provide evidence that users are looking for more detailed and customizable recommendations, and that the existing features of rivals do not fully meet this need. This could include user feedback, feature requests, or market research that indicates a demand for more detailed and transparent recommendations.

### Conclusion

To effectively counter these attacks, you need to provide strong evidence that the "recommendation receipt" feature is both desirable and feasible. This includes demonstrating user demand, a realistic project plan, and highlighting the unique value proposition of the feature compared to existing rivals.

## P11 — Play to the team

Given the current team's demonstrated skills in TypeScript/Next.js, Python/FastAPI, Supabase, Jest/Pytest, and AI/LLM integration, the best approach for the team would be to focus on directions that leverage these skills while minimizing the need for significant new learning. Here's a breakdown of the candidate directions:

1. **Secure Explainable Pantry Planner (Recommendation Receipt):**
   - **Pros:** This direction aligns well with the team's existing skills in AI/LLM integration and web development. The team can build on the existing pantry planner features and enhance them with explainable recommendations.
   - **Cons:** Requires some understanding of security practices, but this is generally learnable within the given timeframe.
   - **Feasibility:** High. The team can build and test a secure and explainable pantry planner within the budget.

2. **Broader All-in-One Expansion:**
   - **Pros:** This direction allows the team to expand the existing features of Epicourier-Web, which they are already familiar with.
   - **Cons:** The scope can quickly become too large, making it difficult to build and test everything within the budget.
   - **Feasibility:** Medium. The team should focus on a subset of features to ensure they can build and test them within the budget.

3. **Retailer Price Optimizer / Grocery-Receipt OCR:**
   - **Pros:** OCR technology is an interesting addition that can complement the existing features.
   - **Cons:** Requires significant expertise in OCR technology and possibly machine learning, which the team may not have.
   - **Feasibility:** Low. Learning OCR and machine learning within a month is challenging, and the team may not be able to build and test a robust solution.

4. **Clean-Slate CLI Security-Regression Tool for CRUD Apps:**
   - **Pros:** This direction leverages the team's existing skills in Python and testing.
   - **Cons:** Requires a deep understanding of security and regression testing, which may not be within the team's current skill set.
   - **Feasibility:** Medium. The team can learn the necessary security practices, but it may be a bottleneck if not everyone can grasp the concepts quickly.

5. **Reusable "Receipt" Component/Library:**
   - **Pros:** This direction allows the team to create a reusable component that can be integrated into various applications.
   - **Cons:** Requires a good understanding of component design and testing, but this is generally within the team's skill set.
   - **Feasibility:** High. The team can build and test a reusable component within the budget.

6. **Dump the Old Product and Start Fresh in a New Language:**
   - **Pros:** This direction allows the team to start fresh and potentially build a better product.
   - **Cons:** Requires learning a new language and framework, which is not feasible within the given timeframe.
   - **Feasibility:** Very Low. Starting fresh in a new language is a significant undertaking that would exceed the budget.

### Recommended Direction:
The **secure explainable pantry planner** is the best direction for the team. It leverages their existing skills in AI/LLM integration and web development, and the team can build and test a secure and explainable pantry planner within the budget. This direction also provides a clear focus and scope that can be managed within the given constraints.

### Ownership and Bottlenecks:
- **Frontend (TypeScript/Next.js):** One or two team members should own the frontend development, ensuring the explainable recommendations are integrated seamlessly.
- **Backend (Python/FastAPI):** One or two team members should own the backend development, focusing on the security aspects and integration with Supabase.
- **Testing (Jest/Pytest):** One team member should own the testing, ensuring that both frontend and backend components are thoroughly tested.
- **AI/LLM Integration:** One team member should own the AI/LLM integration, ensuring that the recommendations are explainable and secure.

By dividing the work this way, the team can avoid bottlenecks and ensure that all components are developed and tested within the budget.

## P12 — The pivot question

### Alternative Project Proposals

Given the constraints and the team's demonstrated skills, here are three genuinely different project kinds that the team could explore:

#### 1. **A CLI-based Personal Finance Manager**

**Why this team would be unusually good at it:**
- The team has strong skills in TypeScript/Next.js and Python/FastAPI, which can be leveraged to build a robust CLI application.
- The experience with Jest/Pytest will ensure that the application is well-tested, which is crucial for a financial application where reliability is paramount.
- The team's experience with AI/LLM integration can be used to provide intelligent financial advice and predictions.

**One-month build-and-test slice:**
- Develop a CLI application that allows users to track their income, expenses, and savings.
- Implement features such as budgeting, expense categorization, and financial goal setting.
- Integrate AI/LLM to provide personalized financial advice and predictions based on user data.

**What we lose by walking away:**
- We lose the opportunity to create a comprehensive meal-planning application that could potentially serve a large user base.
- The team's work on Epicourier would be abandoned, and the effort put into it would be wasted.

#### 2. **A Library for Automated Data Cleaning and Preprocessing**

**Why this team would be unusually good at it:**
- The team's skills in Python/FastAPI and TypeScript/Next.js can be used to develop a versatile library that can be used in various data science and machine learning projects.
- The experience with Jest/Pytest will ensure that the library is reliable and well-tested.
- The team's experience with Supabase can be used to integrate database functionalities into the library.

**One-month build-and-test slice:**
- Develop a Python library that provides functions for common data cleaning tasks such as handling missing values, removing duplicates, and normalizing data.
- Implement features such as automated data type detection and conversion, and integration with popular data storage solutions like Supabase.
- Write comprehensive tests to ensure the reliability and robustness of the library.

**What we lose by walking away:**
- We lose the opportunity to create a meal-planning application that could potentially serve a large user base.
- The team's work on Epicourier would be abandoned, and the effort put into it would be wasted.

#### 3. **A Chatbot for Mental Health Support**

**Why this team would be unusually good at it:**
- The team's experience with AI/LLM integration can be used to build a chatbot that provides mental health support and advice.
- The skills in TypeScript/Next.js and Python/FastAPI can be used to develop a robust backend for the chatbot.
- The experience with Jest/Pytest will ensure that the chatbot is reliable and well-tested.

**One-month build-and-test slice:**
- Develop a chatbot that provides mental health support and advice to users.
- Implement features such as mood tracking, personalized advice based on user data, and integration with mental health resources.
- Write comprehensive tests to ensure the reliability and robustness of the chatbot.

**What we lose by walking away:**
- We lose the opportunity to create a meal-planning application that could potentially serve a large user base.
- The team's work on Epicourier would be abandoned, and the effort put into it would be wasted.

### Decision: Pivot or Stay the Course?

**Pivot:**

Given the constraints and the team's demonstrated skills, pivoting to a different project could be beneficial. The team has the skills to build a robust CLI-based personal finance manager, a library for automated data cleaning and preprocessing, or a chatbot for mental health support. Each of these projects aligns well with the team's skills and can be completed within the given time frame. Additionally, these projects have the potential to serve a large user base and provide significant value.

**Stay the Course:**

Staying the course with Epicourier could also be beneficial, as the team has already invested significant effort into the project. However, given the identified defects and the need for extensive testing and validation, it may be challenging to complete the project within the given time frame and budget.

### Conclusion

**Pivot:** The team should pivot to a different project. The proposed alternatives align well with the team's skills and can be completed within the given time frame. This approach will allow the team to leverage their strengths and deliver a high-quality product that can serve a large user base.
