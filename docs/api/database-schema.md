# Database Schema Documentation 🗄️

## 🎯 **Overview**

FitFatta uses **24 core tables** with comprehensive Row Level Security (RLS) policies. All tables are designed for scalability, performance, and data integrity.

**Database**: PostgreSQL (Supabase)  
**Security**: Row Level Security (RLS) enabled on all tables  
**Backup**: Automated daily backups with point-in-time recovery

---

## 📊 **Schema Overview**

### **Table Categories**
- **User Management**: 5 tables
- **Meal Planning**: 6 tables  
- **Exercise & Fitness**: 6 tables
- **Progress Tracking**: 4 tables
- **Communication**: 3 tables

### **Total Statistics**
- **24 Core Tables**: Complete application coverage
- **100% RLS Protected**: All data access secured
- **Foreign Key Constraints**: Data integrity enforced
- **Indexed Columns**: Optimized query performance

---

## 👤 **User Management Tables (5)**

### **profiles**
Primary user profile information and preferences.

```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  date_of_birth DATE NOT NULL,
  nationality TEXT NOT NULL,
  height INTEGER NOT NULL, -- centimeters
  weight DECIMAL(5,2) NOT NULL, -- kilograms
  activity_level TEXT NOT NULL CHECK (activity_level IN ('sedentary', 'lightly_active', 'moderately_active', 'very_active', 'extremely_active')),
  primary_goal TEXT NOT NULL CHECK (primary_goal IN ('weight_loss', 'muscle_gain', 'maintenance', 'strength', 'endurance')),
  target_weight DECIMAL(5,2),
  timeline TEXT CHECK (timeline IN ('1_month', '3_months', '6_months', '1_year', 'long_term')),
  cooking_skill TEXT CHECK (cooking_skill IN ('beginner', 'intermediate', 'advanced')),
  preferred_workout_time TEXT CHECK (preferred_workout_time IN ('morning', 'afternoon', 'evening', 'flexible')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
```

### **user_preferences**
Detailed user settings and configurations.

```sql
CREATE TABLE user_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  dietary_restrictions TEXT[] DEFAULT '{}',
  cuisine_preferences TEXT[] DEFAULT '{}',
  language TEXT DEFAULT 'en' CHECK (language IN ('en', 'ar')),
  timezone TEXT DEFAULT 'UTC',
  notification_settings JSONB DEFAULT '{}',
  privacy_settings JSONB DEFAULT '{}',
  theme TEXT DEFAULT 'light' CHECK (theme IN ('light', 'dark', 'auto')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### **user_goals**
Fitness and nutrition goals with tracking.

```sql
CREATE TABLE user_goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  goal_type TEXT NOT NULL CHECK (goal_type IN ('weight', 'body_fat', 'muscle_mass', 'strength', 'endurance', 'nutrition')),
  current_value DECIMAL(10,2),
  target_value DECIMAL(10,2) NOT NULL,
  unit TEXT NOT NULL,
  deadline DATE,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused', 'cancelled')),
  progress_percentage DECIMAL(5,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### **user_equipment**
Available exercise equipment for workout customization.

```sql
CREATE TABLE user_equipment (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  equipment_type TEXT NOT NULL,
  equipment_name TEXT NOT NULL,
  availability TEXT DEFAULT 'available' CHECK (availability IN ('available', 'unavailable', 'limited')),
  location TEXT, -- 'home', 'gym', 'outdoor'
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### **user_sessions**
Session tracking and analytics.

```sql
CREATE TABLE user_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  session_start TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  session_end TIMESTAMP WITH TIME ZONE,
  device_type TEXT,
  browser TEXT,
  ip_address INET,
  location JSONB,
  activities JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

---

## 🍽️ **Meal Planning Tables (6)**

### **meal_plans**
Weekly meal plan storage with nutritional summaries.

```sql
CREATE TABLE meal_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  week_start_date DATE NOT NULL,
  week_end_date DATE NOT NULL,
  total_calories INTEGER,
  total_protein DECIMAL(8,2),
  total_carbs DECIMAL(8,2),
  total_fat DECIMAL(8,2),
  cuisine_type TEXT,
  generation_config JSONB,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'archived')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(user_id, week_start_date)
);
```

### **daily_meals**
Individual meal records with detailed nutrition.

```sql
CREATE TABLE daily_meals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  meal_plan_id UUID NOT NULL REFERENCES meal_plans(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  meal_date DATE NOT NULL,
  meal_type TEXT NOT NULL CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snack')),
  recipe_id UUID REFERENCES recipes(id),
  meal_name TEXT NOT NULL,
  calories INTEGER,
  protein DECIMAL(8,2),
  carbs DECIMAL(8,2),
  fat DECIMAL(8,2),
  fiber DECIMAL(8,2),
  prep_time INTEGER, -- minutes
  cooking_time INTEGER, -- minutes
  difficulty TEXT CHECK (difficulty IN ('easy', 'medium', 'hard')),
  ingredients JSONB,
  instructions JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### **recipes**
Recipe database with cultural tags and nutrition.

```sql
CREATE TABLE recipes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  cuisine_type TEXT NOT NULL,
  cultural_tags TEXT[] DEFAULT '{}',
  dietary_tags TEXT[] DEFAULT '{}', -- vegetarian, gluten_free, etc.
  difficulty TEXT CHECK (difficulty IN ('easy', 'medium', 'hard')),
  prep_time INTEGER, -- minutes
  cooking_time INTEGER, -- minutes
  servings INTEGER DEFAULT 1,
  calories_per_serving INTEGER,
  protein_per_serving DECIMAL(8,2),
  carbs_per_serving DECIMAL(8,2),
  fat_per_serving DECIMAL(8,2),
  ingredients JSONB NOT NULL,
  instructions JSONB NOT NULL,
  image_url TEXT,
  source TEXT,
  rating DECIMAL(3,2) DEFAULT 0,
  rating_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### **ingredients**
Ingredient database with comprehensive nutrition data.

```sql
CREATE TABLE ingredients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  calories_per_100g INTEGER,
  protein_per_100g DECIMAL(8,2),
  carbs_per_100g DECIMAL(8,2),
  fat_per_100g DECIMAL(8,2),
  fiber_per_100g DECIMAL(8,2),
  sugar_per_100g DECIMAL(8,2),
  sodium_per_100g DECIMAL(8,2),
  vitamins JSONB DEFAULT '{}',
  minerals JSONB DEFAULT '{}',
  allergens TEXT[] DEFAULT '{}',
  storage_instructions TEXT,
  shelf_life_days INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### **shopping_lists**
Generated shopping list items with cost tracking.

```sql
CREATE TABLE shopping_lists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  meal_plan_id UUID NOT NULL REFERENCES meal_plans(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  week_start_date DATE NOT NULL,
  items JSONB NOT NULL, -- categorized shopping items
  estimated_cost DECIMAL(10,2),
  actual_cost DECIMAL(10,2),
  completion_status JSONB DEFAULT '{}', -- track completed items
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### **meal_preferences**
User dietary preferences and restrictions.

```sql
CREATE TABLE meal_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  dietary_restrictions TEXT[] DEFAULT '{}',
  food_allergies TEXT[] DEFAULT '{}',
  disliked_foods TEXT[] DEFAULT '{}',
  preferred_cuisines TEXT[] DEFAULT '{}',
  meal_timing_preferences JSONB DEFAULT '{}',
  portion_preferences JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

---

## 💪 **Exercise & Fitness Tables (6)**

### **weekly_exercise_programs**
AI-generated weekly exercise programs with equipment awareness.

```sql
CREATE TABLE weekly_exercise_programs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  program_name TEXT NOT NULL,
  week_start_date TEXT NOT NULL,
  workout_type TEXT CHECK (workout_type IN ('home', 'gym')),
  difficulty_level TEXT CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')),
  current_week INTEGER DEFAULT 1,
  total_estimated_calories INTEGER,
  generation_prompt JSONB,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(user_id, week_start_date, workout_type)
);
```

### **daily_workouts**
Individual workout sessions within weekly programs.

```sql
CREATE TABLE daily_workouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  weekly_program_id UUID NOT NULL REFERENCES weekly_exercise_programs(id) ON DELETE CASCADE,
  day_number INTEGER NOT NULL CHECK (day_number BETWEEN 1 AND 7),
  workout_name TEXT NOT NULL,
  estimated_duration INTEGER, -- minutes
  estimated_calories INTEGER,
  muscle_groups TEXT[] DEFAULT '{}',
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(weekly_program_id, day_number)
);
```

### **exercises**
Individual exercises within daily workouts with performance tracking.

```sql
CREATE TABLE exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  daily_workout_id UUID NOT NULL REFERENCES daily_workouts(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  sets INTEGER,
  reps TEXT, -- "8-10" or "12" for flexible rep ranges
  rest_seconds INTEGER DEFAULT 60,
  equipment TEXT,
  muscle_groups TEXT[] DEFAULT '{}',
  difficulty TEXT CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  instructions TEXT,
  order_number INTEGER DEFAULT 1,
  completed BOOLEAN DEFAULT FALSE,
  actual_sets INTEGER,
  actual_reps TEXT,
  actual_weight DECIMAL(6,2),
  notes TEXT,
  youtube_search_term TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### **exercise_logs**
Individual exercise performance tracking (Future Enhancement).

```sql
-- FUTURE: Enhanced performance tracking
CREATE TABLE exercise_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  exercise_id UUID NOT NULL REFERENCES exercises(id),
  workout_date DATE NOT NULL,
  sets_completed INTEGER,
  reps_completed INTEGER[],
  weight_used DECIMAL(6,2)[],
  duration_seconds INTEGER,
  rest_time_seconds INTEGER,
  form_rating INTEGER CHECK (form_rating BETWEEN 1 AND 5),
  difficulty_rating INTEGER CHECK (difficulty_rating BETWEEN 1 AND 5),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### **form_analysis**
Exercise form analysis results from AI (Future Enhancement).

```sql
-- FUTURE: AI form analysis integration
CREATE TABLE form_analysis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  exercise_id UUID NOT NULL REFERENCES exercises(id),
  exercise_log_id UUID REFERENCES exercise_logs(id),
  analysis_type TEXT CHECK (analysis_type IN ('real_time', 'post_workout')),
  video_url TEXT,
  analysis_results JSONB NOT NULL,
  form_score DECIMAL(4,2) CHECK (form_score BETWEEN 0 AND 100),
  improvement_suggestions JSONB,
  risk_assessment JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### **equipment_exercises**
Exercise-equipment relationship mapping (Future Enhancement).

```sql
-- FUTURE: Enhanced equipment management
CREATE TABLE equipment_exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  exercise_id UUID NOT NULL REFERENCES exercises(id) ON DELETE CASCADE,
  equipment_type TEXT NOT NULL,
  equipment_necessity TEXT CHECK (equipment_necessity IN ('required', 'optional', 'alternative')),
  usage_description TEXT,
  setup_instructions TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(exercise_id, equipment_type)
);
```

---

## 📈 **Progress Tracking Tables (4)**

### **weight_logs**
Weight tracking over time with trend analysis.

```sql
CREATE TABLE weight_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  weight DECIMAL(5,2) NOT NULL, -- kilograms
  log_date DATE NOT NULL,
  log_time TIME,
  measurement_type TEXT DEFAULT 'manual' CHECK (measurement_type IN ('manual', 'scale_sync', 'estimated')),
  notes TEXT,
  trend_direction TEXT, -- calculated: 'up', 'down', 'stable'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(user_id, log_date)
);
```

### **body_measurements**
Body composition and measurement tracking.

```sql
CREATE TABLE body_measurements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  measurement_date DATE NOT NULL,
  body_fat_percentage DECIMAL(5,2),
  muscle_mass DECIMAL(5,2),
  chest_circumference DECIMAL(5,2),
  waist_circumference DECIMAL(5,2),
  hip_circumference DECIMAL(5,2),
  arm_circumference DECIMAL(5,2),
  thigh_circumference DECIMAL(5,2),
  neck_circumference DECIMAL(5,2),
  measurements_unit TEXT DEFAULT 'cm' CHECK (measurements_unit IN ('cm', 'inches')),
  measurement_method TEXT DEFAULT 'manual',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### **progress_photos**
Progress photo storage with metadata.

```sql
CREATE TABLE progress_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  photo_url TEXT NOT NULL,
  photo_type TEXT CHECK (photo_type IN ('front', 'side', 'back', 'custom')),
  taken_date DATE NOT NULL,
  weight_at_photo DECIMAL(5,2),
  body_fat_at_photo DECIMAL(5,2),
  notes TEXT,
  is_public BOOLEAN DEFAULT FALSE,
  analysis_data JSONB, -- AI photo analysis results
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### **achievement_logs**
Goal achievements and milestone tracking.

```sql
CREATE TABLE achievement_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  achievement_type TEXT NOT NULL,
  achievement_name TEXT NOT NULL,
  achievement_description TEXT,
  target_value DECIMAL(10,2),
  achieved_value DECIMAL(10,2),
  achievement_date DATE NOT NULL,
  category TEXT, -- fitness, nutrition, consistency
  badge_earned TEXT,
  points_earned INTEGER DEFAULT 0,
  is_milestone BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

---

## 💬 **Communication Tables (3)**

### **chat_conversations**
AI coaching chat history and context.

```sql
CREATE TABLE chat_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  conversation_title TEXT,
  last_message_at TIMESTAMP WITH TIME ZONE,
  message_count INTEGER DEFAULT 0,
  conversation_context JSONB DEFAULT '{}',
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'archived', 'deleted')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES chat_conversations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  message_type TEXT CHECK (message_type IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### **notifications**
System notifications and user alerts.

```sql
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('workout_reminder', 'meal_time', 'progress_update', 'achievement', 'system')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  data JSONB DEFAULT '{}',
  is_read BOOLEAN DEFAULT FALSE,
  is_pushed BOOLEAN DEFAULT FALSE,
  scheduled_for TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE,
  priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### **email_logs**
Email delivery tracking and templates.

```sql
CREATE TABLE email_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  email_address TEXT NOT NULL,
  email_type TEXT NOT NULL,
  template_name TEXT,
  subject TEXT NOT NULL,
  content TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'delivered', 'failed', 'bounced')),
  sent_at TIMESTAMP WITH TIME ZONE,
  delivered_at TIMESTAMP WITH TIME ZONE,
  opened_at TIMESTAMP WITH TIME ZONE,
  clicked_at TIMESTAMP WITH TIME ZONE,
  error_message TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

---

## 🔐 **Row Level Security (RLS) Policies**

### **Standard User Policies**
Applied to all user-specific tables:

```sql
-- Users can only access their own data
CREATE POLICY "Users access own data" ON [table_name] 
FOR ALL USING (auth.uid() = user_id);

-- Users can insert their own data
CREATE POLICY "Users insert own data" ON [table_name] 
FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own data
CREATE POLICY "Users update own data" ON [table_name] 
FOR UPDATE USING (auth.uid() = user_id);

-- Users can delete their own data
CREATE POLICY "Users delete own data" ON [table_name] 
FOR DELETE USING (auth.uid() = user_id);
```

### **Admin Policies**
For administrative access:

```sql
-- Admins can access all data
CREATE POLICY "Admins access all data" ON [table_name] 
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() 
    AND user_role = 'admin'
  )
);
```

### **Read-only Policies**
For reference tables (exercises, recipes, ingredients):

```sql
-- All authenticated users can read reference data
CREATE POLICY "Authenticated users read reference data" ON [table_name] 
FOR SELECT USING (auth.role() = 'authenticated');
```

---

## 📊 **Database Indexes**

### **Performance Indexes**
```sql
-- User data access patterns
CREATE INDEX idx_profiles_nationality ON profiles(nationality);
CREATE INDEX idx_meal_plans_user_week ON meal_plans(user_id, week_start_date);
CREATE INDEX idx_daily_meals_user_date ON daily_meals(user_id, meal_date);
CREATE INDEX idx_workout_sessions_user_date ON workout_sessions(user_id, session_date);
CREATE INDEX idx_weight_logs_user_date ON weight_logs(user_id, log_date);

-- Search and filtering
CREATE INDEX idx_recipes_cuisine_type ON recipes(cuisine_type);
CREATE INDEX idx_exercises_category ON exercises(category);
CREATE INDEX idx_exercises_muscle_groups ON exercises USING GIN(muscle_groups);
CREATE INDEX idx_recipes_dietary_tags ON recipes USING GIN(dietary_tags);

-- Notification and communication
CREATE INDEX idx_notifications_user_unread ON notifications(user_id, is_read, created_at);
CREATE INDEX idx_chat_conversations_user ON chat_conversations(user_id, last_message_at);
```

### **Unique Constraints**
```sql
-- Prevent duplicate data
ALTER TABLE meal_plans ADD CONSTRAINT unique_user_week 
UNIQUE (user_id, week_start_date);

ALTER TABLE weight_logs ADD CONSTRAINT unique_user_date 
UNIQUE (user_id, log_date);

ALTER TABLE equipment_exercises ADD CONSTRAINT unique_exercise_equipment 
UNIQUE (exercise_id, equipment_type);
```

---

## 🔄 **Database Functions & Triggers**

### **Automatic Timestamps**
```sql
-- Update timestamp function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply to tables with updated_at
CREATE TRIGGER update_profiles_updated_at 
BEFORE UPDATE ON profiles 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### **Data Validation Functions**
```sql
-- BMI calculation
CREATE OR REPLACE FUNCTION calculate_bmi(height_cm INTEGER, weight_kg DECIMAL)
RETURNS DECIMAL AS $$
BEGIN
  RETURN ROUND((weight_kg / POWER(height_cm / 100.0, 2))::DECIMAL, 2);
END;
$$ LANGUAGE plpgsql;

-- Daily calorie needs calculation
CREATE OR REPLACE FUNCTION calculate_daily_calories(
  user_profile profiles
) RETURNS INTEGER AS $$
DECLARE
  bmr DECIMAL;
  activity_multiplier DECIMAL;
BEGIN
  -- Calculate BMR using Mifflin-St Jeor equation
  bmr := 10 * user_profile.weight + 6.25 * user_profile.height - 5 * 
         EXTRACT(YEAR FROM AGE(user_profile.date_of_birth)) + 5;
  
  -- Activity level multipliers
  activity_multiplier := CASE user_profile.activity_level
    WHEN 'sedentary' THEN 1.2
    WHEN 'lightly_active' THEN 1.375
    WHEN 'moderately_active' THEN 1.55
    WHEN 'very_active' THEN 1.725
    WHEN 'extremely_active' THEN 1.9
    ELSE 1.2
  END;
  
  RETURN ROUND(bmr * activity_multiplier);
END;
$$ LANGUAGE plpgsql;
```

---

## 📈 **Performance Optimization**

### **Query Optimization**
- **Composite Indexes**: Multi-column indexes for common query patterns
- **Partial Indexes**: Filtered indexes for specific conditions
- **GIN Indexes**: Array and JSONB column optimization
- **Query Plan Analysis**: Regular EXPLAIN ANALYZE for slow queries

### **Data Archival Strategy**
```sql
-- Archive old data to maintain performance
CREATE TABLE archived_workout_sessions (LIKE workout_sessions);
CREATE TABLE archived_daily_meals (LIKE daily_meals);

-- Archive data older than 2 years
CREATE OR REPLACE FUNCTION archive_old_data()
RETURNS VOID AS $$
BEGIN
  -- Move old workout sessions
  INSERT INTO archived_workout_sessions 
  SELECT * FROM workout_sessions 
  WHERE session_date < CURRENT_DATE - INTERVAL '2 years';
  
  DELETE FROM workout_sessions 
  WHERE session_date < CURRENT_DATE - INTERVAL '2 years';
END;
$$ LANGUAGE plpgsql;
```

---

## 🔒 **Security Features**

### **Data Encryption**
- **At Rest**: AES-256 encryption for all stored data
- **In Transit**: TLS 1.3 for all database connections
- **Field Level**: Sensitive fields encrypted with application-level encryption

### **Audit Logging**
```sql
-- Audit log table
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  table_name TEXT NOT NULL,
  operation TEXT NOT NULL, -- INSERT, UPDATE, DELETE
  user_id UUID,
  old_values JSONB,
  new_values JSONB,
  changed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Audit trigger function
CREATE OR REPLACE FUNCTION audit_trigger()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO audit_logs (table_name, operation, user_id, old_values, new_values)
  VALUES (
    TG_TABLE_NAME,
    TG_OP,
    auth.uid(),
    CASE WHEN TG_OP = 'DELETE' THEN row_to_json(OLD) ELSE NULL END,
    CASE WHEN TG_OP IN ('INSERT', 'UPDATE') THEN row_to_json(NEW) ELSE NULL END
  );
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;
```

---

## 🚀 **Future Enhancements**

### **Planned Schema Extensions**
- **Social Features**: Friend connections, challenges, leaderboards
- **Wearable Integration**: Device data synchronization tables
- **Advanced Analytics**: Machine learning model results storage
- **Telemedicine**: Health provider integration tables

### **Performance Improvements**
- **Partitioning**: Time-based partitioning for large tables
- **Materialized Views**: Pre-computed aggregations for analytics
- **Connection Pooling**: Optimized connection management
- **Read Replicas**: Separate read/write database instances

---

The FitFatta database schema provides a robust, scalable foundation for comprehensive fitness and nutrition tracking with enterprise-grade security and performance optimization. 🗄️✨ 