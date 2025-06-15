
# FitFatta Database Schema Documentation

## 📊 Core Tables Overview

This document provides a complete reference for all database tables, relationships, and constraints in the FitFatta fitness platform. Use this as a blueprint for your React Native/Expo app's data models and API integrations.

## 🔐 User Management Tables

### `profiles` - User Profile Data
```sql
CREATE TABLE profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text,
  first_name text,
  last_name text,
  age integer,
  gender text, -- 'male', 'female', 'other'
  height numeric, -- in centimeters
  weight numeric, -- in kilograms
  fitness_goal text, -- 'weight_loss', 'weight_gain', 'muscle_gain', 'maintenance', 'general_fitness'
  activity_level text, -- 'sedentary', 'lightly_active', 'moderately_active', 'very_active', 'extremely_active'
  dietary_restrictions text[], -- ['vegetarian', 'vegan', 'gluten_free', 'dairy_free', 'halal', 'kosher']
  allergies text[], -- ['nuts', 'shellfish', 'eggs', 'soy', 'dairy']
  nationality text,
  preferred_language text DEFAULT 'en', -- 'en', 'ar'
  
  -- Life Phase Support
  pregnancy_trimester smallint, -- 1, 2, 3 or NULL
  breastfeeding_level text, -- 'exclusive', 'partial' or NULL
  fasting_type text, -- 'ramadan', 'islamic', 'intermittent' or NULL
  
  -- Health & Conditions
  health_conditions text[], -- ['diabetes', 'hypertension', 'heart_disease']
  special_conditions jsonb DEFAULT '[]',
  
  -- App Features
  ai_generations_remaining integer DEFAULT 5,
  role user_role DEFAULT 'normal', -- ENUM: 'normal', 'admin', 'coach'
  profile_completion_score integer DEFAULT 0,
  
  -- Metadata
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  last_seen timestamptz DEFAULT now(),
  is_online boolean DEFAULT false
);
```

**React Native Considerations:**
- Store user data in AsyncStorage for offline access
- Implement profile completion progress UI
- Handle life-phase specific features (pregnancy, fasting)
- Support both metric and imperial units with conversion

### `subscriptions` - Premium Features
```sql
CREATE TABLE subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id),
  stripe_customer_id text,
  stripe_subscription_id text,
  stripe_price_id text,
  status text NOT NULL DEFAULT 'inactive', -- 'active', 'inactive', 'canceled', 'past_due'
  plan_type text, -- 'monthly', 'yearly'
  current_period_start timestamptz,
  current_period_end timestamptz,
  cancel_at_period_end boolean DEFAULT false,
  trial_end timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
```

**React Native Considerations:**
- Integrate with React Native IAP for iOS/Android payments
- Cache subscription status for premium feature gating
- Handle subscription state changes via webhooks

## 🍽️ Meal Planning Tables

### `weekly_meal_plans` - 7-Day Meal Plans
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

**React Native Implementation Guide:**
```javascript
// Example meal plan data structure for React Native
const MealPlan = {
  weekStartDate: '2024-01-15', // Saturday
  days: [
    {
      dayNumber: 1,
      dayName: 'Saturday',
      meals: [
        {
          id: 'uuid',
          type: 'breakfast',
          name: 'Avocado Toast',
          calories: 350,
          protein: 12,
          carbs: 35,
          fat: 18,
          prepTime: 10,
          cookTime: 5,
          ingredients: ['bread', 'avocado', 'salt'],
          instructions: ['Toast bread', 'Mash avocado', 'Spread on toast'],
          imageUrl: 'https://...'
        }
        // ... more meals
      ]
    }
    // ... 6 more days
  ]
}
```

## 💪 Exercise Program Tables

### `weekly_exercise_programs` - Workout Programs
```sql
CREATE TABLE weekly_exercise_programs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id),
  program_name text NOT NULL,
  difficulty_level text, -- 'beginner', 'intermediate', 'advanced'
  workout_type text DEFAULT 'home', -- 'home', 'gym'
  current_week integer DEFAULT 1,
  week_start_date date NOT NULL,
  total_estimated_calories integer,
  generation_prompt jsonb,
  status text DEFAULT 'active', -- 'active', 'completed', 'paused'
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
```

### `daily_workouts` - Daily Workout Sessions
```sql
CREATE TABLE daily_workouts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  weekly_program_id uuid NOT NULL REFERENCES weekly_exercise_programs(id),
  day_number integer NOT NULL, -- 1-7
  workout_name text NOT NULL,
  estimated_duration integer, -- minutes
  estimated_calories integer,
  muscle_groups text[], -- ['chest', 'triceps', 'shoulders']
  completed boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
```

### `exercises` - Individual Exercises
```sql
CREATE TABLE exercises (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  daily_workout_id uuid NOT NULL REFERENCES daily_workouts(id),
  name text NOT NULL,
  sets integer,
  reps text, -- '8-12', '10', 'AMRAP'
  rest_seconds integer,
  muscle_groups text[],
  instructions text,
  youtube_search_term text,
  equipment text, -- 'dumbbells', 'bodyweight', 'barbell'
  difficulty text, -- 'beginner', 'intermediate', 'advanced'
  order_number integer DEFAULT 1,
  completed boolean DEFAULT false,
  notes text,
  actual_sets integer, -- User's actual performance
  actual_reps text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
```

**React Native Workout Timer Implementation:**
```javascript
// Example exercise tracking for React Native
const ExerciseTracker = {
  currentExercise: {
    id: 'uuid',
    name: 'Push-ups',
    sets: 3,
    reps: '10-15',
    restSeconds: 60,
    completed: false,
    actualSets: 0,
    actualReps: ''
  },
  workoutTimer: {
    isActive: false,
    currentSet: 1,
    restTimeRemaining: 0,
    workoutStartTime: Date.now()
  }
}
```

## 📊 Tracking & Analytics Tables

### `weight_entries` - Body Weight Tracking
```sql
CREATE TABLE weight_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id),
  weight numeric NOT NULL,
  body_fat_percentage numeric,
  muscle_mass numeric,
  notes text,
  recorded_at timestamptz DEFAULT now()
);
```

### `food_consumption_log` - Food Intake Tracking
```sql
CREATE TABLE food_consumption_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id),
  food_item_id uuid NOT NULL REFERENCES food_items(id),
  quantity_g numeric NOT NULL DEFAULT 100,
  calories_consumed numeric NOT NULL,
  protein_consumed numeric NOT NULL,
  carbs_consumed numeric NOT NULL,
  fat_consumed numeric NOT NULL,
  meal_type text DEFAULT 'snack',
  meal_image_url text, -- Photo of the meal
  source text DEFAULT 'manual', -- 'manual', 'ai_analysis', 'barcode'
  ai_analysis_data jsonb, -- AI photo analysis results
  notes text,
  consumed_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);
```

## 🍕 Food Database Tables

### `food_items` - Food Nutrition Database
```sql
CREATE TABLE food_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  brand text,
  category text NOT NULL DEFAULT 'general',
  calories_per_100g numeric NOT NULL DEFAULT 0,
  protein_per_100g numeric NOT NULL DEFAULT 0,
  carbs_per_100g numeric NOT NULL DEFAULT 0,
  fat_per_100g numeric NOT NULL DEFAULT 0,
  fiber_per_100g numeric DEFAULT 0,
  sugar_per_100g numeric DEFAULT 0,
  sodium_per_100g numeric DEFAULT 0,
  serving_size_g numeric DEFAULT 100,
  serving_description text,
  confidence_score numeric DEFAULT 0.8, -- AI confidence in nutrition data
  verified boolean DEFAULT false,
  image_url text,
  source text DEFAULT 'manual', -- 'manual', 'ai_generated', 'usda'
  cuisine_type text DEFAULT 'general',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
```

## 🤖 AI & Logging Tables

### `ai_generation_logs` - AI Usage Tracking
```sql
CREATE TABLE ai_generation_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id),
  generation_type text NOT NULL, -- 'meal_plan', 'exercise_program', 'food_analysis'
  prompt_data jsonb NOT NULL,
  response_data jsonb,
  status text NOT NULL, -- 'pending', 'completed', 'failed'
  credits_used integer DEFAULT 1,
  error_message text,
  created_at timestamptz DEFAULT now()
);
```

## 📱 App-Specific Tables

### `user_preferences` - App Settings
```sql
CREATE TABLE user_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id),
  preferred_language text DEFAULT 'en',
  theme_preference text DEFAULT 'light', -- 'light', 'dark', 'system'
  measurement_units text DEFAULT 'metric', -- 'metric', 'imperial'
  email_notifications boolean DEFAULT true,
  push_notifications boolean DEFAULT true,
  meal_reminder_times jsonb DEFAULT '{"breakfast": "08:00", "lunch": "12:00", "dinner": "18:00"}',
  workout_reminder_time time DEFAULT '18:00:00',
  automatic_meal_planning boolean DEFAULT true,
  automatic_exercise_planning boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
```

## 🔗 Key Relationships & Constraints

### Foreign Key Relationships
```
profiles (1) → weekly_meal_plans (many)
weekly_meal_plans (1) → daily_meals (many)
profiles (1) → weekly_exercise_programs (many)
weekly_exercise_programs (1) → daily_workouts (many)
daily_workouts (1) → exercises (many)
profiles (1) → weight_entries (many)
profiles (1) → food_consumption_log (many)
food_items (1) → food_consumption_log (many)
```

### Important Indexes for Performance
```sql
-- Meal plan queries
CREATE INDEX idx_weekly_meal_plans_user_date ON weekly_meal_plans(user_id, week_start_date);
CREATE INDEX idx_daily_meals_weekly_plan ON daily_meals(weekly_plan_id, day_number);

-- Exercise program queries
CREATE INDEX idx_exercise_programs_user_date ON weekly_exercise_programs(user_id, week_start_date);
CREATE INDEX idx_daily_workouts_program ON daily_workouts(weekly_program_id, day_number);
CREATE INDEX idx_exercises_workout ON exercises(daily_workout_id, order_number);

-- Tracking queries
CREATE INDEX idx_weight_entries_user_date ON weight_entries(user_id, recorded_at);
CREATE INDEX idx_food_consumption_user_date ON food_consumption_log(user_id, consumed_at);

-- Food search
CREATE INDEX idx_food_items_name_gin ON food_items USING gin(name gin_trgm_ops);
```

## 📱 React Native Data Flow Recommendations

### 1. Offline-First Architecture
```javascript
// Store critical data locally
const localStorageKeys = {
  userProfile: 'user_profile',
  currentMealPlan: 'current_meal_plan',
  todayWorkout: 'today_workout',
  userPreferences: 'user_preferences'
}
```

### 2. Sync Strategy
```javascript
// Sync priorities for React Native
const syncPriorities = {
  high: ['user_profile', 'today_meals', 'today_workout'],
  medium: ['weight_entries', 'exercise_progress'],
  low: ['meal_history', 'workout_history']
}
```

### 3. Background Sync
```javascript
// Background tasks for React Native
const backgroundTasks = [
  'sync_meal_completion',
  'sync_workout_progress', 
  'sync_weight_entries',
  'upload_food_photos'
]
```

This schema provides a solid foundation for building a comprehensive fitness app with meal planning, exercise tracking, AI features, and user progress monitoring.
