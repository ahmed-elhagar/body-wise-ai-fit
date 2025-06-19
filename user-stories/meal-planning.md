
# Meal Planning User Stories

## AI Meal Plan Generation

**As a** authenticated user
**I want** to generate a personalized 7-day meal plan
**So that** I have structured, nutritious meals that fit my goals and preferences

**Acceptance Criteria:**
- [ ] Generate 7-day meal plan with 3-5 meals per day
- [ ] Include breakfast, lunch, dinner, and optional snacks
- [ ] Calculate total daily calories based on my goals
- [ ] Respect all dietary restrictions and allergies
- [ ] Include cultural foods based on my nationality
- [ ] Show macro breakdown (protein, carbs, fat) for each meal
- [ ] Provide prep time and difficulty for each meal
- [ ] Generate within 30 seconds with progress indicator

**Priority:** High
**Effort:** Large
**Tags:** #core #ai #nutrition

---

**As a** premium user
**I want** unlimited meal plan generations
**So that** I can experiment with different dietary approaches

**Acceptance Criteria:**
- [ ] No daily generation limits for premium users
- [ ] Access to advanced AI models (GPT-4 vs GPT-4o-mini)
- [ ] Additional customization options
- [ ] Priority processing during high-demand periods
- [ ] Save unlimited meal plan variations

**Priority:** Medium
**Effort:** Small
**Tags:** #premium #ai

---

**As a** free user
**I want** to understand my generation limits clearly
**So that** I can make informed decisions about when to generate plans

**Acceptance Criteria:**
- [ ] Clear display of remaining generations (X of 5 used today)
- [ ] Reset time clearly communicated (resets at midnight UTC)
- [ ] Upgrade prompts when approaching/exceeding limits
- [ ] Ability to save generated plans to review later
- [ ] Educational content about premium benefits

**Priority:** Medium
**Effort:** Small
**Tags:** #core #freemium

## Meal Plan Customization

**As a** user viewing my meal plan
**I want** to exchange individual meals I don't like
**So that** I have a plan I'll actually follow

**Acceptance Criteria:**
- [ ] "Don't like this meal" button on each meal
- [ ] Reason selection: dietary preference, ingredients, complexity
- [ ] AI generates 3 alternative meals with similar nutrition
- [ ] One-click replacement with automatic nutrition rebalancing
- [ ] Maintain overall daily calorie and macro targets
- [ ] Track exchange patterns to improve future recommendations

**Priority:** High
**Effort:** Medium
**Tags:** #core #ai #personalization

---

**As a** user with changing preferences
**I want** to modify my dietary restrictions mid-week
**So that** remaining meals reflect my updated needs

**Acceptance Criteria:**
- [ ] Update restrictions from meal plan view
- [ ] Regenerate remaining days with new restrictions
- [ ] Keep completed/logged meals unchanged
- [ ] Nutrition targets adjust based on new restrictions
- [ ] Clear communication about what will change

**Priority:** Medium
**Effort:** Medium
**Tags:** #core #personalization

## Recipe Details & Instructions

**As a** user viewing a meal
**I want** detailed cooking instructions and ingredient lists
**So that** I can successfully prepare the meal

**Acceptance Criteria:**
- [ ] Complete ingredient list with measurements
- [ ] Step-by-step cooking instructions
- [ ] Prep time, cook time, and total time
- [ ] Serving size and scaling options
- [ ] Cooking tips and substitution suggestions
- [ ] Difficulty level indicator
- [ ] Equipment needed list

**Priority:** High
**Effort:** Medium
**Tags:** #core #nutrition

---

**As a** user preparing meals
**I want** to see nutritional information per serving
**So that** I can track my intake accurately

**Acceptance Criteria:**
- [ ] Calories, protein, carbs, fat per serving
- [ ] Micronutrient information when available
- [ ] Percentage of daily values
- [ ] Allergen warnings clearly displayed
- [ ] Sodium, fiber, sugar breakdown
- [ ] Visual macro distribution chart

**Priority:** High
**Effort:** Small
**Tags:** #core #nutrition

## Shopping List Generation

**As a** user with a meal plan
**I want** an automatically generated shopping list
**So that** grocery shopping is efficient and I don't forget ingredients

**Acceptance Criteria:**
- [ ] Aggregate all ingredients from the week's meals
- [ ] Organize by grocery store sections (produce, dairy, etc.)
- [ ] Quantity calculations for all meals
- [ ] Checkbox interface to track purchases
- [ ] Option to remove items I already have
- [ ] Share list via email or text message
- [ ] Print-friendly format

**Priority:** High
**Effort:** Medium
**Tags:** #core #convenience

---

**As a** user planning meals
**I want** to email my shopping list to myself or family
**So that** I have it accessible while shopping

**Acceptance Criteria:**
- [ ] Email button generates formatted shopping list
- [ ] Clean, printable email format
- [ ] Include meal plan overview in email
- [ ] Option to send to multiple email addresses
- [ ] Delivery within 2 minutes of request
- [ ] Mobile-friendly email format

**Priority:** Medium
**Effort:** Small
**Tags:** #core #convenience

## Meal Plan Management

**As a** user with multiple meal plans
**I want** to view and manage my meal plan history
**So that** I can reuse successful plans and track my nutrition over time

**Acceptance Criteria:**
- [ ] List view of all generated meal plans with dates
- [ ] Search and filter meal plans by criteria
- [ ] Duplicate previous successful meal plans
- [ ] Delete unwanted meal plans
- [ ] Export meal plans to PDF
- [ ] Favorite meals for easy access in future plans

**Priority:** Medium
**Effort:** Medium
**Tags:** #core #management

---

**As a** user following a meal plan
**I want** to mark meals as completed
**So that** I can track my adherence and progress

**Acceptance Criteria:**
- [ ] Check-off interface for each meal
- [ ] Progress visualization for the week
- [ ] Streak tracking for consecutive days
- [ ] Weekly completion percentage
- [ ] Reminder notifications for upcoming meals
- [ ] Photo attachment option for completed meals

**Priority:** Medium
**Effort:** Medium
**Tags:** #core #tracking

## Meal Shuffling & Redistribution

**As a** user with a meal plan
**I want** to shuffle meals across different days
**So that** I can adapt to my changing weekly schedule

**Acceptance Criteria:**
- [ ] Drag-and-drop interface to move meals between days
- [ ] Maintain nutritional balance across the week
- [ ] Prevent conflicts (e.g., heavy meals before workouts)
- [ ] Bulk shuffle option for entire meal plan
- [ ] Undo/redo functionality for changes
- [ ] Save shuffled arrangements as new variants

**Priority:** Medium
**Effort:** Large
**Tags:** #core #convenience

## Cultural & Life-Phase Adaptations

**As a** pregnant user
**I want** meal plans adapted for my pregnancy stage
**So that** I get appropriate nutrition for my baby's development

**Acceptance Criteria:**
- [ ] Trimester-specific calorie increases (0/+340/+450)
- [ ] Emphasis on folate, iron, calcium, and DHA
- [ ] Avoid high-mercury fish and raw foods
- [ ] Include pregnancy-safe alternatives
- [ ] Manage nausea with suitable food suggestions
- [ ] Hydration emphasis throughout plan

**Priority:** High
**Effort:** Large
**Tags:** #core #pregnancy #nutrition

---

**As a** breastfeeding user
**I want** meal plans that support milk production
**So that** I maintain energy and provide quality nutrition to my baby

**Acceptance Criteria:**
- [ ] Additional 300-500 calories based on breastfeeding intensity
- [ ] Emphasis on protein, healthy fats, and hydration
- [ ] Include galactagogue foods (oats, flax, etc.)
- [ ] Avoid foods that may cause infant colic
- [ ] Multiple small meals throughout the day
- [ ] Convenient one-handed meal options

**Priority:** High
**Effort:** Large
**Tags:** #core #breastfeeding #nutrition

---

**As a** user observing Ramadan
**I want** meal plans optimized for fasting periods
**So that** I maintain nutrition and energy during the holy month

**Acceptance Criteria:**
- [ ] Two main meals: Suhoor (pre-dawn) and Iftar (sunset)
- [ ] Suhoor meals emphasize slow-release carbs and protein
- [ ] Iftar meals include hydrating foods and balanced nutrition
- [ ] Traditional Ramadan foods included when appropriate
- [ ] Avoid foods that increase thirst during fasting
- [ ] Flexible timing based on local prayer times

**Priority:** Medium
**Effort:** Large
**Tags:** #core #fasting #cultural

---

**As a** user from a specific cultural background
**I want** meal plans featuring traditional foods from my culture
**So that** healthy eating feels familiar and enjoyable

**Acceptance Criteria:**
- [ ] Traditional dishes modified for health goals
- [ ] Authentic spice combinations and cooking methods
- [ ] Seasonal foods based on cultural calendar
- [ ] Family-style meals when culturally appropriate
- [ ] Balance traditional favorites with nutritional needs
- [ ] Recipe notes explaining cultural significance

**Priority:** Medium
**Effort:** Large
**Tags:** #core #cultural #internationalization

## Meal Plan Sharing & Collaboration

**As a** user with a meal plan
**I want** to share my meal plan with family members
**So that** we can coordinate grocery shopping and meal preparation

**Acceptance Criteria:**
- [ ] Generate shareable link for meal plan
- [ ] Email meal plan to family members
- [ ] View-only access for shared users
- [ ] Print-friendly family meal plan format
- [ ] Shopping list includes portions for family size
- [ ] Option to modify shared plans collaboratively

**Priority:** Low
**Effort:** Medium
**Tags:** #social #convenience

---

**As a** user working with a coach
**I want** my coach to review and approve my meal plans
**So that** I get professional guidance on my nutrition

**Acceptance Criteria:**
- [ ] Share meal plan with assigned coach
- [ ] Coach can comment on individual meals
- [ ] Coach approval/modification workflow
- [ ] Notification when coach reviews plan
- [ ] Version history of coach modifications
- [ ] Coach can generate alternative meal plans

**Priority:** Medium
**Effort:** Large
**Tags:** #coaching #professional

## Meal Plan Analytics

**As a** user following meal plans
**I want** to see analytics about my meal plan adherence
**So that** I can understand my eating patterns and improve

**Acceptance Criteria:**
- [ ] Weekly/monthly adherence percentages
- [ ] Most and least followed meal types
- [ ] Nutrition trends over time
- [ ] Favorite and avoided foods analysis
- [ ] Meal timing patterns
- [ ] Comparison with nutrition goals

**Priority:** Low
**Effort:** Medium
**Tags:** #analytics #insights

---

**As a** user interested in nutrition trends
**I want** to see how my nutrition compares to recommendations
**So that** I can make informed decisions about my diet

**Acceptance Criteria:**
- [ ] Daily nutrition vs. recommended values
- [ ] Macro ratio trends over time
- [ ] Micronutrient deficiency identification
- [ ] Hydration tracking integration
- [ ] Weekly nutrition report generation
- [ ] Recommendations for improvement

**Priority:** Medium
**Effort:** Medium
**Tags:** #analytics #nutrition #insights
