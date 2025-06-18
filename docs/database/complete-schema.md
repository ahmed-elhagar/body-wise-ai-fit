
# FitFatta Complete Database Schema

## 📊 Database Overview

**Database Type**: PostgreSQL (Supabase)  
**Security Model**: Row Level Security (RLS)  
**Authentication**: Supabase Auth  
**Total Tables**: 24 core tables  

## 🔐 User Management Schema

### `profiles` - Core User Data
```sql
CREATE TABLE profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  email text,
  first_name text,
  last_name text,
  age integer,
  gender text,
  height numeric, -- centimeters
  weight numeric, -- kilograms
  
  -- Fitness Profile
  fitness_goal text,
  activity_level text,
  body_shape text,
  body_fat_percentage numeric,
  
  -- Dietary Profile
  dietary_restrictions text[],
  allergies text[],
  nationality text,
  preferred_foods text[],
  
  -- Life Phase Support
  pregnancy_trimester smallint,
  breastfeeding_level text,
  fasting_type text,
  condition_start_date date,
  
  -- Health Data
  health_conditions text[],
  special_conditions jsonb DEFAULT '[]',
  last_health_assessment_date date,
  
  -- App Configuration
  preferred_language text DEFAULT 'en',
  ai_generations_remaining integer DEFAULT 5,
  role user_role DEFAULT 'normal',
  profile_completion_score integer DEFAULT 0,
  profile_visibility text DEFAULT 'private',
  onboarding_completed boolean DEFAULT false,
  
  -- Social Features
  bio text,
  location text,
  timezone text DEFAULT 'UTC',
  is_online boolean DEFAULT false,
  last_seen timestamptz DEFAULT now(),
  
  -- Metadata
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
```

### `user_preferences` - App Settings
```sql
CREATE TABLE user_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) NOT NULL,
  
  -- UI Preferences
  preferred_language text DEFAULT 'en',
  theme_preference text DEFAULT 'light',
  measurement_units text DEFAULT 'metric',
  profile_visibility text DEFAULT 'private',
  
  -- Notifications
  email_notifications boolean DEFAULT true,
  push_notifications boolean DEFAULT true,
  sms_notifications boolean DEFAULT false,
  marketing_emails boolean DEFAULT false,
  progress_reminders boolean DEFAULT true,
  
  -- Feature Settings
  automatic_meal_planning boolean DEFAULT true,
  automatic_exercise_planning boolean DEFAULT true,
  ai_suggestions boolean DEFAULT true,
  data_sharing_analytics boolean DEFAULT true,
  data_sharing_research boolean DEFAULT false,
  
  -- Reminders
  meal_reminder_times jsonb DEFAULT '{"breakfast": "08:00", "lunch": "12:00", "dinner": "18:00"}',
  workout_reminder_time time DEFAULT '18:00:00',
  
  -- Timestamps
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
```

### `onboarding_progress` - User Journey Tracking
```sql
CREATE TABLE onboarding_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) NOT NULL,
  
  -- Step Progress
  current_step integer DEFAULT 1,
  total_steps integer DEFAULT 5,
  completion_percentage integer DEFAULT 0,
  
  -- Individual Steps
  welcome_viewed boolean DEFAULT false,
  welcome_viewed_at timestamptz,
  basic_info_completed boolean DEFAULT false,
  basic_info_completed_at timestamptz,
  demographics_completed boolean DEFAULT false,
  demographics_completed_at timestamptz,
  fitness_goals_completed boolean DEFAULT false,
  fitness_goals_completed_at timestamptz,
  body_shape_completed boolean DEFAULT false,
  body_shape_completed_at timestamptz,
  dietary_preferences_completed boolean DEFAULT false,
  dietary_preferences_completed_at timestamptz,
  health_assessment_completed boolean DEFAULT false,
  health_assessment_completed_at timestamptz,
  goals_setup_completed boolean DEFAULT false,
  goals_setup_completed_at timestamptz,
  preferences_completed boolean DEFAULT false,
  preferences_completed_at timestamptz,
  profile_review_completed boolean DEFAULT false,
  profile_review_completed_at timestamptz,
  
  -- Skip Tracking
  skipped_steps text[] DEFAULT '{}',
  skip_reasons jsonb DEFAULT '{}',
  
  -- Completion
  started_at timestamptz DEFAULT now(),
  completed_at timestamptz,
  updated_at timestamptz DEFAULT now()
);
```

## 🍽️ Meal Planning Schema

### `weekly_meal_plans` - 7-Day Meal Plans
```sql
CREATE TABLE weekly_meal_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) NOT NULL,
  week_start_date date NOT NULL, -- Always Saturday
  
  -- Nutrition Totals
  total_calories integer,
  total_protein numeric,
  total_carbs numeric,
  total_fat numeric,
  
  -- Generation Context
  generation_prompt jsonb,
  life_phase_context jsonb DEFAULT '{}',
  
  created_at timestamptz DEFAULT now()
);
```

### `daily_meals` - Individual Meals
```sql
CREATE TABLE daily_meals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  weekly_plan_id uuid REFERENCES weekly_meal_plans(id) NOT NULL,
  day_number integer NOT NULL, -- 1-7 (Saturday=1)
  meal_type text NOT NULL, -- 'breakfast', 'lunch', 'dinner', 'snack'
  
  -- Meal Details
  name text NOT NULL,
  calories integer,
  protein numeric,
  carbs numeric,
  fat numeric,
  prep_time integer, -- minutes
  cook_time integer, -- minutes
  servings integer DEFAULT 1,
  
  -- Recipe Data
  ingredients jsonb, -- ["ingredient1", "ingredient2"]
  instructions text[], -- ["step1", "step2"]
  alternatives jsonb, -- Alternative suggestions
  
  -- Media
  youtube_search_term text,
  image_url text,
  
  -- Status
  recipe_fetched boolean DEFAULT false,
  
  created_at timestamptz DEFAULT now()
);
```

## 💪 Exercise Program Schema

### `weekly_exercise_programs` - Workout Programs
```sql
CREATE TABLE weekly_exercise_programs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) NOT NULL,
  
  -- Program Details
  program_name text NOT NULL,
  difficulty_level text, -- 'beginner', 'intermediate', 'advanced'
  workout_type text DEFAULT 'home', -- 'home', 'gym'
  current_week integer DEFAULT 1,
  week_start_date date NOT NULL,
  
  -- Metrics
  total_estimated_calories integer,
  
  -- Generation Context
  generation_prompt jsonb,
  
  -- Status
  status text DEFAULT 'active', -- 'active', 'completed', 'paused'
  
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
```

### `daily_workouts` - Daily Sessions
```sql
CREATE TABLE daily_workouts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  weekly_program_id uuid REFERENCES weekly_exercise_programs(id) NOT NULL,
  day_number integer NOT NULL, -- 1-7
  
  -- Workout Details
  workout_name text NOT NULL,
  estimated_duration integer, -- minutes
  estimated_calories integer,
  muscle_groups text[], -- ['chest', 'triceps']
  
  -- Completion
  completed boolean DEFAULT false,
  
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
```

### `exercises` - Individual Exercises
```sql
CREATE TABLE exercises (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  daily_workout_id uuid REFERENCES daily_workouts(id) NOT NULL,
  
  -- Exercise Details
  name text NOT NULL,
  sets integer,
  reps text, -- '8-12', '10', 'AMRAP'
  rest_seconds integer,
  muscle_groups text[],
  equipment text, -- 'dumbbells', 'bodyweight'
  difficulty text, -- 'beginner', 'intermediate', 'advanced'
  order_number integer DEFAULT 1,
  
  -- Instructions
  instructions text,
  youtube_search_term text,
  
  -- Progress Tracking
  completed boolean DEFAULT false,
  actual_sets integer,
  actual_reps text,
  notes text,
  
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
```

## 📊 Food & Nutrition Schema

### `food_items` - Master Food Database
```sql
CREATE TABLE food_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  brand text,
  category text DEFAULT 'general',
  cuisine_type text DEFAULT 'general',
  barcode text UNIQUE,
  
  -- Nutrition per 100g
  calories_per_100g numeric DEFAULT 0,
  protein_per_100g numeric DEFAULT 0,
  carbs_per_100g numeric DEFAULT 0,
  fat_per_100g numeric DEFAULT 0,
  fiber_per_100g numeric DEFAULT 0,
  sugar_per_100g numeric DEFAULT 0,
  sodium_per_100g numeric DEFAULT 0,
  
  -- Serving Info
  serving_size_g numeric DEFAULT 100,
  serving_description text,
  
  -- Quality Metrics
  confidence_score numeric DEFAULT 0.8,
  verified boolean DEFAULT false,
  source text DEFAULT 'manual',
  image_url text,
  
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
```

### `food_consumption_log` - User Food Tracking
```sql
CREATE TABLE food_consumption_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) NOT NULL,
  food_item_id uuid REFERENCES food_items(id) NOT NULL,
  
  -- Consumption Details
  quantity_g numeric DEFAULT 100,
  meal_type text DEFAULT 'snack',
  consumed_at timestamptz DEFAULT now(),
  
  -- Calculated Nutrition
  calories_consumed numeric NOT NULL,
  protein_consumed numeric NOT NULL,
  carbs_consumed numeric NOT NULL,
  fat_consumed numeric NOT NULL,
  
  -- AI Analysis
  meal_image_url text,
  ai_analysis_data jsonb,
  source text DEFAULT 'manual', -- 'manual', 'ai_analysis', 'barcode'
  notes text,
  
  created_at timestamptz DEFAULT now()
);
```

## 📈 Progress Tracking Schema

### `weight_entries` - Body Weight Tracking
```sql
CREATE TABLE weight_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) NOT NULL,
  weight numeric NOT NULL,
  body_fat_percentage numeric,
  muscle_mass numeric,
  notes text,
  recorded_at timestamptz DEFAULT now()
);
```

### `user_goals` - Goal Management
```sql
CREATE TABLE user_goals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) NOT NULL,
  
  -- Goal Definition
  title text NOT NULL,
  description text,
  goal_type text NOT NULL,
  category text NOT NULL,
  
  -- Metrics
  target_value numeric,
  current_value numeric DEFAULT 0,
  target_unit text,
  
  -- Timeline
  start_date date DEFAULT CURRENT_DATE,
  target_date date,
  
  -- Properties
  status text DEFAULT 'active',
  priority text DEFAULT 'medium',
  difficulty text DEFAULT 'medium',
  
  -- Progress
  milestones jsonb DEFAULT '[]',
  tags text[],
  notes text,
  
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
```

## 🤖 AI & System Schema

### `ai_generation_logs` - AI Usage Tracking
```sql
CREATE TABLE ai_generation_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) NOT NULL,
  
  -- Generation Details
  generation_type text NOT NULL,
  prompt_data jsonb NOT NULL,
  response_data jsonb,
  
  -- Status
  status text NOT NULL, -- 'pending', 'completed', 'failed'
  error_message text,
  credits_used integer DEFAULT 1,
  
  -- Context
  condition_type text,
  extra_calories integer DEFAULT 0,
  
  created_at timestamptz DEFAULT now()
);
```

### `subscriptions` - Premium Features
```sql
CREATE TABLE subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) NOT NULL,
  
  -- Stripe Integration
  stripe_customer_id text,
  stripe_subscription_id text,
  stripe_price_id text,
  
  -- Subscription Details
  status text DEFAULT 'inactive',
  plan_type text,
  interval text,
  
  -- Billing Periods
  current_period_start timestamptz,
  current_period_end timestamptz,
  trial_end timestamptz,
  cancel_at_period_end boolean DEFAULT false,
  
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
```

## 🏗️ Database Functions & Triggers

### Core Functions
- `handle_new_user()` - Auto-create profile on signup
- `calculate_calorie_offset()` - Life-phase calorie adjustments
- `check_and_use_ai_generation()` - Credit management
- `complete_ai_generation()` - Log AI completion
- `search_food_items()` - Food search with similarity
- `shuffle_weekly_meals()` - Meal randomization
- `update_profile_completion_score()` - Progress calculation

### Security Functions
- `get_user_role()` - Role-based access
- `is_pro_user()` - Subscription status
- `is_admin()` - Admin privilege check
- `has_role()` - General role checking

### Performance Optimizations
```sql
-- Critical Indexes
CREATE INDEX idx_weekly_meal_plans_user_date ON weekly_meal_plans(user_id, week_start_date);
CREATE INDEX idx_daily_meals_plan_day ON daily_meals(weekly_plan_id, day_number);
CREATE INDEX idx_exercises_workout_order ON exercises(daily_workout_id, order_number);
CREATE INDEX idx_food_consumption_user_date ON food_consumption_log(user_id, consumed_at);
CREATE INDEX idx_ai_logs_user_type ON ai_generation_logs(user_id, generation_type);

-- Full-text Search
CREATE INDEX idx_food_items_search ON food_items USING gin(to_tsvector('english', name));
```

## 📱 React Native Integration Notes

### Offline-First Strategy
- Cache user profile and preferences locally
- Store current meal plan and workout data
- Sync critical changes when online
- Handle conflict resolution gracefully

### Performance Considerations
- Use pagination for large datasets
- Implement optimistic updates for user actions
- Cache frequently accessed lookup data
- Minimize real-time queries

### Security Implementation
- All tables use Row Level Security (RLS)
- User data isolated by `auth.uid()`
- API calls require valid JWT tokens
- Sensitive operations require re-authentication

This schema provides a robust foundation for building a comprehensive fitness application with meal planning, exercise tracking, AI features, and user progress monitoring.
