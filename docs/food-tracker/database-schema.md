
# Food Tracker Database Schema

Comprehensive database structure for food tracking, calorie counting, and nutrition monitoring in React Native/Expo app.

## 📊 Core Tables

### `food_consumption_log` - Main Food Tracking
```sql
CREATE TABLE food_consumption_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id),
  food_item_id uuid NOT NULL REFERENCES food_items(id),
  
  -- Consumption details
  quantity_g numeric NOT NULL DEFAULT 100,
  meal_type text DEFAULT 'snack', -- 'breakfast', 'lunch', 'dinner', 'snack'
  consumed_at timestamptz DEFAULT now(),
  
  -- Calculated nutrition (denormalized for performance)
  calories_consumed numeric NOT NULL,
  protein_consumed numeric NOT NULL,
  carbs_consumed numeric NOT NULL,
  fat_consumed numeric NOT NULL,
  fiber_consumed numeric DEFAULT 0,
  sugar_consumed numeric DEFAULT 0,
  sodium_consumed numeric DEFAULT 0,
  
  -- AI analysis data
  meal_image_url text, -- Photo of the meal
  ai_analysis_data jsonb, -- AI recognition results
  ai_confidence_score numeric DEFAULT 0,
  source text DEFAULT 'manual', -- 'manual', 'ai_photo', 'barcode', 'voice'
  
  -- User feedback
  user_rating integer, -- 1-5 satisfaction rating
  notes text,
  
  -- Meal plan integration
  meal_plan_id uuid REFERENCES weekly_meal_plans(id),
  planned_meal_id uuid REFERENCES daily_meals(id),
  
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Performance indexes
CREATE INDEX idx_food_consumption_user_date 
ON food_consumption_log(user_id, consumed_at DESC);

CREATE INDEX idx_food_consumption_meal_type 
ON food_consumption_log(user_id, meal_type, consumed_at DESC);

CREATE INDEX idx_food_consumption_ai_source
ON food_consumption_log(source, ai_confidence_score DESC)
WHERE source IN ('ai_photo', 'voice');
```

### `daily_nutrition_summaries` - Aggregated Daily Data
```sql
CREATE TABLE daily_nutrition_summaries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id),
  date date NOT NULL,
  
  -- Total nutrition for the day
  total_calories numeric DEFAULT 0,
  total_protein numeric DEFAULT 0,
  total_carbs numeric DEFAULT 0,
  total_fat numeric DEFAULT 0,
  total_fiber numeric DEFAULT 0,
  total_sugar numeric DEFAULT 0,
  total_sodium numeric DEFAULT 0,
  
  -- Meal breakdown
  breakfast_calories numeric DEFAULT 0,
  lunch_calories numeric DEFAULT 0,
  dinner_calories numeric DEFAULT 0,
  snack_calories numeric DEFAULT 0,
  
  -- Goal tracking
  calorie_goal numeric,
  protein_goal numeric,
  carb_goal numeric,
  fat_goal numeric,
  
  -- Achievement metrics
  goal_adherence_percentage numeric DEFAULT 0,
  meals_logged integer DEFAULT 0,
  meal_plan_adherence_percentage numeric DEFAULT 0,
  
  -- Water intake tracking
  water_intake_ml integer DEFAULT 0,
  water_goal_ml integer DEFAULT 2000,
  
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  UNIQUE(user_id, date)
);

-- Index for date range queries
CREATE INDEX idx_daily_nutrition_user_date 
ON daily_nutrition_summaries(user_id, date DESC);
```

### `food_photo_analysis` - AI Photo Analysis Results
```sql
CREATE TABLE food_photo_analysis (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id),
  image_url text NOT NULL,
  
  -- Analysis results
  detected_foods jsonb NOT NULL, -- Array of detected food items
  confidence_scores jsonb NOT NULL, -- Confidence for each detection
  portion_estimates jsonb NOT NULL, -- Estimated portions/quantities
  
  -- Calculated nutrition
  estimated_calories numeric,
  estimated_protein numeric,
  estimated_carbs numeric,
  estimated_fat numeric,
  
  -- Processing metadata
  analysis_model text, -- AI model used
  processing_time_ms integer,
  image_quality_score numeric,
  
  -- User verification
  user_verified boolean DEFAULT false,
  user_corrections jsonb, -- User's corrections to AI analysis
  
  -- Consumption logging
  consumption_log_id uuid REFERENCES food_consumption_log(id),
  
  created_at timestamptz DEFAULT now()
);
```

### `nutrition_goals` - Personalized Nutrition Targets
```sql
CREATE TABLE nutrition_goals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id),
  
  -- Daily targets
  daily_calorie_target numeric NOT NULL,
  daily_protein_target numeric NOT NULL,
  daily_carb_target numeric NOT NULL,
  daily_fat_target numeric NOT NULL,
  daily_fiber_target numeric DEFAULT 25,
  daily_sodium_limit numeric DEFAULT 2300,
  daily_sugar_limit numeric DEFAULT 50,
  
  -- Water intake
  daily_water_target_ml integer DEFAULT 2000,
  
  -- Meal distribution preferences
  breakfast_calorie_percentage numeric DEFAULT 25,
  lunch_calorie_percentage numeric DEFAULT 35,
  dinner_calorie_percentage numeric DEFAULT 30,
  snack_calorie_percentage numeric DEFAULT 10,
  
  -- Goal calculation metadata
  calculation_method text DEFAULT 'mifflin_st_jeor',
  bmr numeric, -- Basal Metabolic Rate
  tdee numeric, -- Total Daily Energy Expenditure
  calorie_deficit_surplus numeric DEFAULT 0,
  
  -- Life phase adjustments
  pregnancy_adjustment numeric DEFAULT 0,
  breastfeeding_adjustment numeric DEFAULT 0,
  medical_adjustments jsonb DEFAULT '{}',
  
  -- Validity period
  effective_from date NOT NULL DEFAULT CURRENT_DATE,
  effective_until date,
  is_active boolean DEFAULT true,
  
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
```

## 🔗 React Native Integration

### TypeScript Interfaces
```typescript
interface FoodConsumptionEntry {
  id: string;
  userId: string;
  foodItemId: string;
  foodItem?: FoodItem;
  
  // Consumption details
  quantityG: number;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  consumedAt: string;
  
  // Nutrition
  caloriesConsumed: number;
  proteinConsumed: number;
  carbsConsumed: number;
  fatConsumed: number;
  fiberConsumed: number;
  sugarConsumed: number;
  sodiumConsumed: number;
  
  // AI analysis
  mealImageUrl?: string;
  aiAnalysisData?: any;
  aiConfidenceScore?: number;
  source: 'manual' | 'ai_photo' | 'barcode' | 'voice';
  
  // User feedback
  userRating?: number;
  notes?: string;
  
  // Meal plan integration
  mealPlanId?: string;
  plannedMealId?: string;
}

interface DailyNutritionSummary {
  userId: string;
  date: string;
  
  // Totals
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  totalFiber: number;
  totalSugar: number;
  totalSodium: number;
  
  // Meal breakdown
  breakfastCalories: number;
  lunchCalories: number;
  dinnerCalories: number;
  snackCalories: number;
  
  // Goals
  calorieGoal: number;
  proteinGoal: number;
  carbGoal: number;
  fatGoal: number;
  
  // Achievements
  goalAdherencePercentage: number;
  mealsLogged: number;
  mealPlanAdherencePercentage: number;
  
  // Water
  waterIntakeMl: number;
  waterGoalMl: number;
}
```

## 🏗️ Database Functions

### Log Food Consumption
```sql
CREATE OR REPLACE FUNCTION log_food_consumption(
  user_id_param uuid,
  food_item_id_param uuid,
  quantity_g_param numeric,
  meal_type_param text,
  consumed_at_param timestamptz DEFAULT NOW(),
  meal_image_url_param text DEFAULT NULL,
  source_param text DEFAULT 'manual',
  notes_param text DEFAULT NULL
) RETURNS uuid AS $$
DECLARE
  food_item RECORD;
  log_id uuid;
  calories_consumed numeric;
  protein_consumed numeric;
  carbs_consumed numeric;
  fat_consumed numeric;
  fiber_consumed numeric;
  sugar_consumed numeric;
  sodium_consumed numeric;
BEGIN
  -- Get food item nutrition data
  SELECT * INTO food_item FROM food_items WHERE id = food_item_id_param;
  
  IF food_item IS NULL THEN
    RAISE EXCEPTION 'Food item not found';
  END IF;
  
  -- Calculate nutrition for consumed quantity
  calories_consumed := (food_item.calories_per_100g * quantity_g_param) / 100;
  protein_consumed := (food_item.protein_per_100g * quantity_g_param) / 100;
  carbs_consumed := (food_item.carbs_per_100g * quantity_g_param) / 100;
  fat_consumed := (food_item.fat_per_100g * quantity_g_param) / 100;
  fiber_consumed := (food_item.fiber_per_100g * quantity_g_param) / 100;
  sugar_consumed := (food_item.sugar_per_100g * quantity_g_param) / 100;
  sodium_consumed := (food_item.sodium_per_100g * quantity_g_param) / 100;
  
  -- Insert consumption log
  INSERT INTO food_consumption_log (
    user_id, food_item_id, quantity_g, meal_type, consumed_at,
    calories_consumed, protein_consumed, carbs_consumed, fat_consumed,
    fiber_consumed, sugar_consumed, sodium_consumed,
    meal_image_url, source, notes
  ) VALUES (
    user_id_param, food_item_id_param, quantity_g_param, meal_type_param, consumed_at_param,
    calories_consumed, protein_consumed, carbs_consumed, fat_consumed,
    fiber_consumed, sugar_consumed, sodium_consumed,
    meal_image_url_param, source_param, notes_param
  ) RETURNING id INTO log_id;
  
  -- Update daily summary
  PERFORM update_daily_nutrition_summary(user_id_param, DATE(consumed_at_param));
  
  RETURN log_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### Update Daily Nutrition Summary
```sql
CREATE OR REPLACE FUNCTION update_daily_nutrition_summary(
  user_id_param uuid,
  date_param date
) RETURNS void AS $$
DECLARE
  daily_totals RECORD;
  meal_breakdown RECORD;
  user_goals RECORD;
BEGIN
  -- Calculate daily totals
  SELECT 
    COALESCE(SUM(calories_consumed), 0) as total_calories,
    COALESCE(SUM(protein_consumed), 0) as total_protein,
    COALESCE(SUM(carbs_consumed), 0) as total_carbs,
    COALESCE(SUM(fat_consumed), 0) as total_fat,
    COALESCE(SUM(fiber_consumed), 0) as total_fiber,
    COALESCE(SUM(sugar_consumed), 0) as total_sugar,
    COALESCE(SUM(sodium_consumed), 0) as total_sodium,
    COUNT(*) as meals_logged
  INTO daily_totals
  FROM food_consumption_log
  WHERE user_id = user_id_param 
  AND DATE(consumed_at) = date_param;
  
  -- Calculate meal breakdown
  SELECT 
    COALESCE(SUM(CASE WHEN meal_type = 'breakfast' THEN calories_consumed ELSE 0 END), 0) as breakfast_calories,
    COALESCE(SUM(CASE WHEN meal_type = 'lunch' THEN calories_consumed ELSE 0 END), 0) as lunch_calories,
    COALESCE(SUM(CASE WHEN meal_type = 'dinner' THEN calories_consumed ELSE 0 END), 0) as dinner_calories,
    COALESCE(SUM(CASE WHEN meal_type = 'snack' THEN calories_consumed ELSE 0 END), 0) as snack_calories
  INTO meal_breakdown
  FROM food_consumption_log
  WHERE user_id = user_id_param 
  AND DATE(consumed_at) = date_param;
  
  -- Get user goals
  SELECT * INTO user_goals
  FROM nutrition_goals
  WHERE user_id = user_id_param 
  AND is_active = true
  AND effective_from <= date_param
  AND (effective_until IS NULL OR effective_until >= date_param);
  
  -- Insert or update daily summary
  INSERT INTO daily_nutrition_summaries (
    user_id, date,
    total_calories, total_protein, total_carbs, total_fat,
    total_fiber, total_sugar, total_sodium,
    breakfast_calories, lunch_calories, dinner_calories, snack_calories,
    meals_logged,
    calorie_goal, protein_goal, carb_goal, fat_goal,
    goal_adherence_percentage
  ) VALUES (
    user_id_param, date_param,
    daily_totals.total_calories, daily_totals.total_protein, 
    daily_totals.total_carbs, daily_totals.total_fat,
    daily_totals.total_fiber, daily_totals.total_sugar, daily_totals.total_sodium,
    meal_breakdown.breakfast_calories, meal_breakdown.lunch_calories,
    meal_breakdown.dinner_calories, meal_breakdown.snack_calories,
    daily_totals.meals_logged,
    COALESCE(user_goals.daily_calorie_target, 2000),
    COALESCE(user_goals.daily_protein_target, 150),
    COALESCE(user_goals.daily_carb_target, 250),
    COALESCE(user_goals.daily_fat_target, 65),
    CASE 
      WHEN user_goals.daily_calorie_target > 0 
      THEN ROUND((daily_totals.total_calories / user_goals.daily_calorie_target) * 100, 2)
      ELSE 0 
    END
  )
  ON CONFLICT (user_id, date) 
  DO UPDATE SET
    total_calories = EXCLUDED.total_calories,
    total_protein = EXCLUDED.total_protein,
    total_carbs = EXCLUDED.total_carbs,
    total_fat = EXCLUDED.total_fat,
    total_fiber = EXCLUDED.total_fiber,
    total_sugar = EXCLUDED.total_sugar,
    total_sodium = EXCLUDED.total_sodium,
    breakfast_calories = EXCLUDED.breakfast_calories,
    lunch_calories = EXCLUDED.lunch_calories,
    dinner_calories = EXCLUDED.dinner_calories,
    snack_calories = EXCLUDED.snack_calories,
    meals_logged = EXCLUDED.meals_logged,
    goal_adherence_percentage = EXCLUDED.goal_adherence_percentage,
    updated_at = now();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

This comprehensive food tracker schema provides robust nutrition tracking with AI photo analysis, goal management, and seamless React Native integration for optimal mobile performance.
