
# Food Analysis & Nutrition Database Schema

Comprehensive database structure for food analysis, nutrition tracking, and AI-powered food recognition in React Native/Expo app.

## 📊 Core Tables

### `food_items` - Master Food Database
```sql
CREATE TABLE food_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  brand text,
  category text NOT NULL DEFAULT 'general',
  cuisine_type text DEFAULT 'general',
  barcode text UNIQUE, -- For barcode scanning
  
  -- Nutrition per 100g
  calories_per_100g numeric NOT NULL DEFAULT 0,
  protein_per_100g numeric NOT NULL DEFAULT 0,
  carbs_per_100g numeric NOT NULL DEFAULT 0,
  fat_per_100g numeric NOT NULL DEFAULT 0,
  fiber_per_100g numeric DEFAULT 0,
  sugar_per_100g numeric DEFAULT 0,
  sodium_per_100g numeric DEFAULT 0,
  
  -- Serving information
  serving_size_g numeric DEFAULT 100,
  serving_description text, -- '1 cup', '1 medium apple'
  
  -- Data quality and sources
  confidence_score numeric DEFAULT 0.8, -- AI confidence 0-1
  verified boolean DEFAULT false, -- Human verified
  source text DEFAULT 'manual', -- 'manual', 'ai_analysis', 'barcode'
  image_url text,
  
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Indexes for fast food search
CREATE INDEX idx_food_items_name_gin ON food_items USING gin(name gin_trgm_ops);
CREATE INDEX idx_food_items_category ON food_items(category);
CREATE INDEX idx_food_items_cuisine ON food_items(cuisine_type);
CREATE INDEX idx_food_items_barcode ON food_items(barcode) WHERE barcode IS NOT NULL;
CREATE INDEX idx_food_items_verified ON food_items(verified, confidence_score DESC);
```

### `food_consumption_log` - User Food Tracking
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
  
  -- AI analysis data
  meal_image_url text, -- Photo of the meal
  ai_analysis_data jsonb, -- AI recognition results
  source text DEFAULT 'manual', -- 'manual', 'ai_photo', 'barcode'
  notes text,
  
  created_at timestamptz DEFAULT now()
);

-- Performance indexes
CREATE INDEX idx_food_consumption_user_date 
ON food_consumption_log(user_id, consumed_at DESC);

CREATE INDEX idx_food_consumption_meal_type 
ON food_consumption_log(user_id, meal_type, consumed_at DESC);
```

### `food_database` - AI-Generated Food Database
```sql
CREATE TABLE food_database (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  cuisine_type text DEFAULT 'general',
  
  -- Nutrition per standard unit
  calories_per_unit numeric NOT NULL DEFAULT 0,
  protein_per_unit numeric NOT NULL DEFAULT 0,
  carbs_per_unit numeric NOT NULL DEFAULT 0,
  fat_per_unit numeric NOT NULL DEFAULT 0,
  fiber_per_unit numeric DEFAULT 0,
  sugar_per_unit numeric DEFAULT 0,
  
  -- Unit information
  unit_type text NOT NULL DEFAULT 'serving', -- 'serving', '100g', 'piece'
  confidence_score numeric DEFAULT 0.8,
  source text DEFAULT 'ai_analysis',
  last_analyzed timestamptz DEFAULT now(),
  
  created_at timestamptz DEFAULT now()
);

-- Search index
CREATE INDEX idx_food_database_name_gin ON food_database USING gin(name gin_trgm_ops);
```

### `user_favorite_foods` - Personal Food Library
```sql
CREATE TABLE user_favorite_foods (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id),
  food_item_id uuid NOT NULL REFERENCES food_items(id),
  
  -- Customization
  custom_name text, -- User's personal name for the food
  custom_serving_size_g numeric,
  notes text,
  
  created_at timestamptz DEFAULT now(),
  
  UNIQUE(user_id, food_item_id)
);
```

### `food_search_history` - Search Analytics
```sql
CREATE TABLE food_search_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id),
  search_term text NOT NULL,
  search_type text DEFAULT 'text', -- 'text', 'barcode', 'image'
  results_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Analytics index
CREATE INDEX idx_food_search_user_date 
ON food_search_history(user_id, created_at DESC);
```

## 🔗 Integration with Other Systems

### Meal Plan Integration
```sql
-- Link consumption to meal plans
ALTER TABLE food_consumption_log 
ADD COLUMN meal_plan_id uuid REFERENCES weekly_meal_plans(id);

-- Track adherence to meal plans
CREATE VIEW meal_plan_adherence AS
SELECT 
  wmp.id as meal_plan_id,
  wmp.user_id,
  COUNT(fcl.id) as logged_meals,
  SUM(fcl.calories_consumed) as actual_calories,
  wmp.total_calories as planned_calories,
  ROUND(
    (SUM(fcl.calories_consumed) / NULLIF(wmp.total_calories, 0)) * 100, 2
  ) as adherence_percentage
FROM weekly_meal_plans wmp
LEFT JOIN food_consumption_log fcl ON fcl.meal_plan_id = wmp.id
GROUP BY wmp.id, wmp.user_id, wmp.total_calories;
```

### Coach Integration
```sql
-- Coach comments on food logs
CREATE TABLE meal_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  meal_log_id uuid NOT NULL REFERENCES food_consumption_log(id),
  coach_id uuid NOT NULL REFERENCES profiles(id),
  trainee_id uuid NOT NULL REFERENCES profiles(id),
  body text NOT NULL,
  created_at timestamptz DEFAULT now()
);
```

## 📱 React Native Data Structures

### TypeScript Interfaces
```typescript
interface FoodItem {
  id: string;
  name: string;
  brand?: string;
  category: string;
  cuisineType: string;
  barcode?: string;
  
  // Nutrition per 100g
  caloriesPer100g: number;
  proteinPer100g: number;
  carbsPer100g: number;
  fatPer100g: number;
  fiberPer100g?: number;
  sugarPer100g?: number;
  sodiumPer100g?: number;
  
  // Serving info
  servingSizeG: number;
  servingDescription?: string;
  
  // Quality metrics
  confidenceScore: number;
  verified: boolean;
  source: 'manual' | 'ai_analysis' | 'barcode';
  imageUrl?: string;
}

interface FoodConsumptionEntry {
  id: string;
  userId: string;
  foodItemId: string;
  foodItem?: FoodItem;
  
  // Consumption details
  quantityG: number;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  consumedAt: string;
  
  // Calculated nutrition
  caloriesConsumed: number;
  proteinConsumed: number;
  carbsConsumed: number;
  fatConsumed: number;
  
  // AI analysis
  mealImageUrl?: string;
  aiAnalysisData?: AIAnalysisData;
  source: 'manual' | 'ai_photo' | 'barcode';
  notes?: string;
}

interface AIAnalysisData {
  recognizedFoods: string[];
  confidence: number;
  portions: {
    foodName: string;
    estimatedQuantity: number;
    confidence: number;
  }[];
  totalCaloriesEstimate: number;
  analysisModel: string;
  processingTime: number;
}
```

## 🏗️ Database Functions

### Search Food Items
```sql
CREATE OR REPLACE FUNCTION search_food_items(
  search_term text,
  category_filter text DEFAULT NULL,
  limit_count integer DEFAULT 20
) RETURNS TABLE(
  id uuid,
  name text,
  brand text,
  category text,
  cuisine_type text,
  calories_per_100g numeric,
  protein_per_100g numeric,
  carbs_per_100g numeric,
  fat_per_100g numeric,
  fiber_per_100g numeric,
  sugar_per_100g numeric,
  sodium_per_100g numeric,
  serving_size_g numeric,
  serving_description text,
  confidence_score numeric,
  verified boolean,
  image_url text,
  similarity_score real
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    f.id, f.name, f.brand, f.category, f.cuisine_type,
    f.calories_per_100g, f.protein_per_100g, f.carbs_per_100g, f.fat_per_100g,
    f.fiber_per_100g, f.sugar_per_100g, f.sodium_per_100g,
    f.serving_size_g, f.serving_description, f.confidence_score,
    f.verified, f.image_url,
    similarity(f.name, search_term) as similarity_score
  FROM food_items f
  WHERE 
    (category_filter IS NULL OR f.category = category_filter)
    AND (
      f.name ILIKE '%' || search_term || '%' 
      OR f.brand ILIKE '%' || search_term || '%'
      OR similarity(f.name, search_term) > 0.2
    )
  ORDER BY 
    f.verified DESC,
    CASE 
      WHEN f.name ILIKE search_term || '%' THEN 1
      WHEN f.name ILIKE '%' || search_term || '%' THEN 2
      ELSE 3
    END,
    similarity(f.name, search_term) DESC,
    f.confidence_score DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;
```

### Get Daily Nutrition Summary
```sql
CREATE OR REPLACE FUNCTION get_daily_nutrition_summary(
  user_id_param uuid,
  date_param date DEFAULT CURRENT_DATE
) RETURNS JSONB AS $$
DECLARE
  result JSONB;
BEGIN
  SELECT jsonb_build_object(
    'date', date_param,
    'total_calories', COALESCE(SUM(calories_consumed), 0),
    'total_protein', COALESCE(SUM(protein_consumed), 0),
    'total_carbs', COALESCE(SUM(carbs_consumed), 0),
    'total_fat', COALESCE(SUM(fat_consumed), 0),
    'meal_breakdown', meals.breakdown,
    'food_entries', entries.food_list
  ) INTO result
  FROM food_consumption_log fcl
  LEFT JOIN LATERAL (
    SELECT jsonb_object_agg(
      meal_type,
      jsonb_build_object(
        'calories', meal_calories,
        'protein', meal_protein,
        'carbs', meal_carbs,
        'fat', meal_fat,
        'food_count', food_count
      )
    ) as breakdown
    FROM (
      SELECT 
        meal_type,
        SUM(calories_consumed) as meal_calories,
        SUM(protein_consumed) as meal_protein,
        SUM(carbs_consumed) as meal_carbs,
        SUM(fat_consumed) as meal_fat,
        COUNT(*) as food_count
      FROM food_consumption_log
      WHERE user_id = user_id_param 
      AND DATE(consumed_at) = date_param
      GROUP BY meal_type
    ) meal_summary
  ) meals ON true
  LEFT JOIN LATERAL (
    SELECT jsonb_agg(
      jsonb_build_object(
        'id', fcl2.id,
        'food_name', fi.name,
        'quantity_g', fcl2.quantity_g,
        'calories', fcl2.calories_consumed,
        'meal_type', fcl2.meal_type,
        'consumed_at', fcl2.consumed_at
      ) ORDER BY fcl2.consumed_at
    ) as food_list
    FROM food_consumption_log fcl2
    JOIN food_items fi ON fi.id = fcl2.food_item_id
    WHERE fcl2.user_id = user_id_param 
    AND DATE(fcl2.consumed_at) = date_param
  ) entries ON true
  WHERE fcl.user_id = user_id_param 
  AND DATE(fcl.consumed_at) = date_param;
  
  RETURN COALESCE(result, jsonb_build_object(
    'date', date_param,
    'total_calories', 0,
    'total_protein', 0,
    'total_carbs', 0,
    'total_fat', 0,
    'meal_breakdown', '{}',
    'food_entries', '[]'
  ));
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### Log Food Consumption
```sql
CREATE OR REPLACE FUNCTION log_food_consumption(
  user_id_param uuid,
  food_item_id_param uuid,
  quantity_g_param numeric,
  meal_type_param text,
  consumed_at_param timestamptz DEFAULT NOW(),
  meal_image_url_param text DEFAULT NULL,
  notes_param text DEFAULT NULL
) RETURNS uuid AS $$
DECLARE
  food_item RECORD;
  log_id uuid;
  calories_consumed numeric;
  protein_consumed numeric;
  carbs_consumed numeric;
  fat_consumed numeric;
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
  
  -- Insert consumption log
  INSERT INTO food_consumption_log (
    user_id, food_item_id, quantity_g, meal_type, consumed_at,
    calories_consumed, protein_consumed, carbs_consumed, fat_consumed,
    meal_image_url, notes, source
  ) VALUES (
    user_id_param, food_item_id_param, quantity_g_param, meal_type_param, consumed_at_param,
    calories_consumed, protein_consumed, carbs_consumed, fat_consumed,
    meal_image_url_param, notes_param, 
    CASE WHEN meal_image_url_param IS NOT NULL THEN 'ai_photo' ELSE 'manual' END
  ) RETURNING id INTO log_id;
  
  RETURN log_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

## 📊 Performance Optimizations

### Materialized Views for Analytics
```sql
-- Daily nutrition aggregates
CREATE MATERIALIZED VIEW daily_nutrition_stats AS
SELECT 
  user_id,
  DATE(consumed_at) as consumption_date,
  COUNT(*) as total_entries,
  SUM(calories_consumed) as total_calories,
  SUM(protein_consumed) as total_protein,
  SUM(carbs_consumed) as total_carbs,
  SUM(fat_consumed) as total_fat,
  COUNT(DISTINCT meal_type) as meal_types_logged
FROM food_consumption_log
GROUP BY user_id, DATE(consumed_at);

-- Refresh function
CREATE OR REPLACE FUNCTION refresh_nutrition_stats() RETURNS void AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY daily_nutrition_stats;
END;
$$ LANGUAGE plpgsql;
```

### Caching Strategy for React Native
```typescript
// Cache keys for AsyncStorage
const CACHE_KEYS = {
  recentFoods: 'food_recent_',
  favoriteFoods: 'food_favorites_',
  todayNutrition: 'nutrition_today_',
  foodDatabase: 'food_database_cache'
};

// Cache duration
const CACHE_DURATION = {
  recentFoods: 24 * 60 * 60 * 1000, // 24 hours
  favoriteFoods: 7 * 24 * 60 * 60 * 1000, // 7 days
  todayNutrition: 5 * 60 * 1000, // 5 minutes
  foodDatabase: 30 * 24 * 60 * 60 * 1000 // 30 days
};
```

This comprehensive food analysis schema provides robust nutrition tracking, AI-powered food recognition, and seamless integration with meal planning and coaching features.
