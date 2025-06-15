
# Meal Plan Database Schema

This document details the database structure for the meal plan feature in FitFatta, designed for React Native/Expo implementation.

## 📊 Core Tables

### `weekly_meal_plans` - Main Meal Plan Container
```sql
CREATE TABLE weekly_meal_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id),
  week_start_date date NOT NULL, -- Always starts on Saturday
  total_calories integer,
  total_protein numeric,
  total_carbs numeric,
  total_fat numeric,
  generation_prompt jsonb, -- Stores user preferences used for generation
  life_phase_context jsonb DEFAULT '{}', -- Pregnancy, breastfeeding, fasting adjustments
  created_at timestamptz DEFAULT now()
);
```

**Key Points for React Native:**
- `week_start_date` always uses Saturday as week start (weekStartsOn: 6)
- `life_phase_context` contains special dietary adjustments
- One user can have multiple plans for different weeks

### `daily_meals` - Individual Meals
```sql
CREATE TABLE daily_meals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  weekly_plan_id uuid NOT NULL REFERENCES weekly_meal_plans(id),
  day_number integer NOT NULL, -- 1-7 (Saturday=1, Friday=7)
  meal_type text NOT NULL, -- 'breakfast', 'lunch', 'dinner', 'snack'
  name text NOT NULL,
  calories integer,
  protein numeric,
  carbs numeric,
  fat numeric,
  prep_time integer, -- minutes
  cook_time integer, -- minutes
  servings integer DEFAULT 1,
  ingredients jsonb, -- ["ingredient1", "ingredient2"]
  instructions text[], -- ["step1", "step2"]
  alternatives jsonb, -- Alternative meal suggestions
  youtube_search_term text, -- For finding cooking videos
  image_url text, -- AI-generated meal image
  recipe_fetched boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);
```

**React Native Implementation Notes:**
- `ingredients` is stored as JSONB array for flexibility
- `instructions` is PostgreSQL text array for step-by-step recipes
- `alternatives` contains backup meal options when user dislikes current meal
- `youtube_search_term` enables video recipe integration

## 🔗 Relationships with Other Tables

### User Profile Integration
```sql
-- Meal plans are always linked to user profiles
weekly_meal_plans.user_id → profiles.id

-- Profile data affects meal generation:
profiles.age, weight, height, gender -- BMR calculation
profiles.activity_level -- TDEE multiplier
profiles.dietary_restrictions -- ['vegetarian', 'halal', 'keto']
profiles.allergies -- ['nuts', 'dairy']
profiles.nationality -- Cultural food preferences
profiles.pregnancy_trimester, breastfeeding_level -- Life phase adjustments
profiles.fitness_goal -- 'weight_loss', 'muscle_gain', etc.
```

### AI Generation Tracking
```sql
-- Every meal plan generation is logged
ai_generation_logs.user_id → profiles.id
ai_generation_logs.generation_type = 'meal_plan'
ai_generation_logs.prompt_data -- Contains generation parameters
ai_generation_logs.response_data -- Contains AI model response
ai_generation_logs.credits_used -- Always 1 for meal plans
```

### Food Consumption Tracking
```sql
-- Users can log actual food consumption
food_consumption_log.user_id → profiles.id
food_consumption_log.meal_type -- Links to daily_meals.meal_type
-- This enables comparison between planned vs actual intake
```

## 📱 React Native Data Structure

### Meal Plan State Structure
```typescript
interface WeeklyMealPlan {
  id: string;
  weekStartDate: string; // YYYY-MM-DD format (Saturday)
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  generationPrompt: {
    cuisine?: string;
    maxPrepTime?: string;
    includeSnacks: boolean;
    language: 'en' | 'ar';
  };
  lifePhaseContext: {
    isPregnant?: boolean;
    pregnancyTrimester?: number;
    isBreastfeeding?: boolean;
    breastfeedingLevel?: 'exclusive' | 'partial';
    extraCalories: number;
  };
}

interface DailyMeal {
  id: string;
  weeklyPlanId: string;
  dayNumber: number; // 1-7
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  prepTime: number;
  cookTime: number;
  servings: number;
  ingredients: string[];
  instructions: string[];
  alternatives: string[];
  youtubeSearchTerm?: string;
  imageUrl?: string;
  recipeFetched: boolean;
}
```

## 🗓️ Week Calculation Logic

### Saturday-Based Week System
```typescript
// Week start calculation for React Native
const calculateWeekStart = (weekOffset: number = 0) => {
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 = Sunday, 6 = Saturday
  
  // Calculate days to reach Saturday
  const daysToSaturday = dayOfWeek === 6 ? 0 : (6 - dayOfWeek) % 7;
  
  // Get current week's Saturday
  const currentSaturday = new Date(today);
  currentSaturday.setDate(today.getDate() - dayOfWeek + 6);
  
  // Apply week offset
  const targetWeek = new Date(currentSaturday);
  targetWeek.setDate(currentSaturday.getDate() + (weekOffset * 7));
  
  return targetWeek.toISOString().split('T')[0]; // YYYY-MM-DD
};
```

## 🏗️ Database Constraints & Indexes

### Performance Indexes
```sql
-- Essential indexes for meal plan queries
CREATE INDEX idx_weekly_meal_plans_user_date 
ON weekly_meal_plans(user_id, week_start_date DESC);

CREATE INDEX idx_daily_meals_weekly_plan 
ON daily_meals(weekly_plan_id, day_number, meal_type);

-- For meal search and alternatives
CREATE INDEX idx_daily_meals_name_gin 
ON daily_meals USING gin(name gin_trgm_ops);
```

### Data Validation
```sql
-- Ensure valid day numbers
ALTER TABLE daily_meals ADD CONSTRAINT valid_day_number 
CHECK (day_number >= 1 AND day_number <= 7);

-- Ensure valid meal types
ALTER TABLE daily_meals ADD CONSTRAINT valid_meal_type 
CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snack'));

-- Positive nutrition values
ALTER TABLE daily_meals ADD CONSTRAINT positive_calories 
CHECK (calories >= 0);
```

## 🔄 Data Flow for React Native

### Offline-First Strategy
```typescript
// Local storage keys for offline capability
const STORAGE_KEYS = {
  currentMealPlan: 'meal_plan_current',
  mealPlanCache: 'meal_plan_cache_',
  userPreferences: 'meal_preferences'
};

// Sync priority for meal plan data
const SYNC_PRIORITIES = {
  high: ['current_week_meals', 'today_meals'],
  medium: ['next_week_meals', 'nutrition_totals'],
  low: ['meal_history', 'alternative_meals']
};
```

### Cache Strategy
```typescript
// Cache meal plans by week for offline access
interface MealPlanCache {
  weekStartDate: string;
  weeklyPlan: WeeklyMealPlan;
  dailyMeals: DailyMeal[];
  lastUpdated: number;
  expiresAt: number; // 7 days from creation
}
```

This database schema provides the foundation for building a comprehensive meal planning system in React Native that supports cultural preferences, life-phase nutrition, and offline-first functionality.
