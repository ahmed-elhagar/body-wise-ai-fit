
# Dashboard & Analytics Database Schema

Comprehensive database structure for dashboard analytics, user insights, and performance tracking in React Native/Expo app.

## 📊 Analytics Tables

### `user_activity_logs` - Activity Tracking
```sql
CREATE TABLE user_activity_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id),
  
  -- Activity Details
  activity_type text NOT NULL, -- 'meal_plan_generated', 'workout_completed', 'food_logged'
  activity_category text NOT NULL, -- 'nutrition', 'fitness', 'ai_generation', 'social'
  activity_data jsonb DEFAULT '{}',
  
  -- Context
  session_id text,
  device_type text, -- 'mobile', 'tablet', 'web'
  app_version text,
  platform text, -- 'ios', 'android', 'web'
  
  -- Metrics
  duration_seconds integer, -- Time spent on activity
  engagement_score numeric, -- Calculated engagement metric
  
  created_at timestamptz DEFAULT now()
);

-- Indexes for analytics queries
CREATE INDEX idx_user_activity_logs_user_date 
ON user_activity_logs(user_id, created_at DESC);

CREATE INDEX idx_user_activity_logs_type_date 
ON user_activity_logs(activity_type, created_at DESC);

CREATE INDEX idx_user_activity_logs_category 
ON user_activity_logs(activity_category, created_at DESC);
```

### `dashboard_metrics` - Pre-calculated Dashboard Data
```sql
CREATE TABLE dashboard_metrics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id),
  metric_date date NOT NULL,
  
  -- Nutrition Metrics
  calories_consumed numeric DEFAULT 0,
  calories_target numeric DEFAULT 0,
  calories_adherence_percentage numeric DEFAULT 0,
  protein_consumed numeric DEFAULT 0,
  carbs_consumed numeric DEFAULT 0,
  fat_consumed numeric DEFAULT 0,
  
  -- Fitness Metrics
  workouts_completed integer DEFAULT 0,
  workouts_planned integer DEFAULT 0,
  workout_adherence_percentage numeric DEFAULT 0,
  exercises_completed integer DEFAULT 0,
  total_workout_duration integer DEFAULT 0, -- minutes
  calories_burned numeric DEFAULT 0,
  
  -- AI Usage Metrics
  ai_generations_used integer DEFAULT 0,
  meal_plans_generated integer DEFAULT 0,
  exercise_programs_generated integer DEFAULT 0,
  
  -- Engagement Metrics
  app_sessions integer DEFAULT 0,
  total_app_time integer DEFAULT 0, -- minutes
  features_used text[] DEFAULT '{}',
  
  -- Progress Metrics
  weight_entries integer DEFAULT 0,
  goal_progress_updates integer DEFAULT 0,
  achievement_unlocks integer DEFAULT 0,
  
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  UNIQUE(user_id, metric_date)
);

-- Indexes for dashboard queries
CREATE INDEX idx_dashboard_metrics_user_date 
ON dashboard_metrics(user_id, metric_date DESC);
```

### `weekly_progress_summaries` - Weekly Analytics
```sql
CREATE TABLE weekly_progress_summaries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id),
  week_start_date date NOT NULL, -- Always Saturday
  week_number integer NOT NULL, -- Week of year
  year integer NOT NULL,
  
  -- Weekly Totals
  total_calories_consumed numeric DEFAULT 0,
  total_calories_burned numeric DEFAULT 0,
  total_workouts_completed integer DEFAULT 0,
  total_workout_duration integer DEFAULT 0,
  total_meals_logged integer DEFAULT 0,
  
  -- Weekly Averages
  avg_daily_calories numeric DEFAULT 0,
  avg_workout_duration numeric DEFAULT 0,
  avg_adherence_percentage numeric DEFAULT 0,
  
  -- Progress Indicators
  weight_change_kg numeric DEFAULT 0,
  body_fat_change_percentage numeric DEFAULT 0,
  fitness_improvement_score numeric DEFAULT 0,
  
  -- Behavioral Metrics
  consistency_score numeric DEFAULT 0, -- 0-100 based on daily logging
  engagement_score numeric DEFAULT 0, -- 0-100 based on app usage
  goal_progress_score numeric DEFAULT 0, -- 0-100 based on goal completion
  
  -- Achievements & Milestones
  new_achievements text[] DEFAULT '{}',
  milestones_reached text[] DEFAULT '{}',
  
  created_at timestamptz DEFAULT now(),
  
  UNIQUE(user_id, week_start_date)
);
```

### `app_usage_analytics` - Detailed Usage Tracking
```sql
CREATE TABLE app_usage_analytics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id),
  
  -- Session Information
  session_id text NOT NULL,
  session_start timestamptz NOT NULL,
  session_end timestamptz,
  session_duration integer, -- seconds
  
  -- Device & Platform
  device_info jsonb DEFAULT '{}', -- Device model, OS version, etc.
  app_version text,
  build_number text,
  
  -- Navigation & Features
  screens_visited text[] DEFAULT '{}',
  features_used text[] DEFAULT '{}',
  actions_performed jsonb DEFAULT '{}', -- Action counts
  
  -- Performance Metrics
  crash_occurred boolean DEFAULT false,
  error_count integer DEFAULT 0,
  api_calls_made integer DEFAULT 0,
  offline_time integer DEFAULT 0, -- seconds
  
  created_at timestamptz DEFAULT now()
);

-- Index for session analysis
CREATE INDEX idx_app_usage_analytics_user_session 
ON app_usage_analytics(user_id, session_start DESC);
```

## 🎯 Goal & Achievement Tracking

### `goal_progress_entries` - Detailed Goal Tracking
```sql
CREATE TABLE goal_progress_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id),
  goal_id uuid NOT NULL REFERENCES user_goals(id),
  
  -- Progress Data
  previous_value numeric,
  new_value numeric,
  progress_delta numeric,
  progress_percentage numeric,
  
  -- Entry Context
  entry_type text DEFAULT 'manual', -- 'manual', 'automatic', 'calculated'
  data_source text, -- 'user_input', 'meal_log', 'workout_completion', 'weight_entry'
  notes text,
  
  -- Milestone Tracking
  milestone_reached boolean DEFAULT false,
  milestone_data jsonb DEFAULT '{}',
  
  created_at timestamptz DEFAULT now()
);
```

### `achievement_progress` - Achievement System
```sql
CREATE TABLE achievement_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id),
  achievement_id text NOT NULL, -- 'first_workout', 'week_streak', 'weight_goal'
  
  -- Progress Tracking
  current_progress numeric DEFAULT 0,
  target_progress numeric NOT NULL,
  progress_percentage numeric DEFAULT 0,
  
  -- Status
  is_completed boolean DEFAULT false,
  completed_at timestamptz,
  
  -- Metadata
  achievement_data jsonb DEFAULT '{}',
  tier text DEFAULT 'bronze', -- 'bronze', 'silver', 'gold', 'platinum'
  
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  UNIQUE(user_id, achievement_id)
);
```

## 📱 React Native Data Structures

### TypeScript Interfaces
```typescript
interface DashboardMetrics {
  userId: string;
  metricDate: string;
  
  // Nutrition
  caloriesConsumed: number;
  caloriesTarget: number;
  caloriesAdherencePercentage: number;
  proteinConsumed: number;
  carbsConsumed: number;
  fatConsumed: number;
  
  // Fitness
  workoutsCompleted: number;
  workoutsPlanned: number;
  workoutAdherencePercentage: number;
  exercisesCompleted: number;
  totalWorkoutDuration: number;
  caloriesBurned: number;
  
  // AI Usage
  aiGenerationsUsed: number;
  mealPlansGenerated: number;
  exerciseProgramsGenerated: number;
  
  // Engagement
  appSessions: number;
  totalAppTime: number;
  featuresUsed: string[];
  
  // Progress
  weightEntries: number;
  goalProgressUpdates: number;
  achievementUnlocks: number;
}

interface WeeklyProgressSummary {
  userId: string;
  weekStartDate: string;
  weekNumber: number;
  year: number;
  
  // Totals
  totalCaloriesConsumed: number;
  totalCaloriesBurned: number;
  totalWorkoutsCompleted: number;
  totalWorkoutDuration: number;
  totalMealsLogged: number;
  
  // Averages
  avgDailyCalories: number;
  avgWorkoutDuration: number;
  avgAdherencePercentage: number;
  
  // Progress
  weightChangeKg: number;
  bodyFatChangePercentage: number;
  fitnessImprovementScore: number;
  
  // Behavioral
  consistencyScore: number;
  engagementScore: number;
  goalProgressScore: number;
  
  // Achievements
  newAchievements: string[];
  milestonesReached: string[];
}

interface UserActivityLog {
  id: string;
  userId: string;
  activityType: string;
  activityCategory: 'nutrition' | 'fitness' | 'ai_generation' | 'social';
  activityData: any;
  sessionId?: string;
  deviceType: 'mobile' | 'tablet' | 'web';
  appVersion: string;
  platform: 'ios' | 'android' | 'web';
  durationSeconds?: number;
  engagementScore?: number;
  createdAt: string;
}
```

## 🏗️ Database Functions

### Calculate Daily Dashboard Metrics
```sql
CREATE OR REPLACE FUNCTION calculate_daily_dashboard_metrics(
  user_id_param uuid,
  date_param date DEFAULT CURRENT_DATE
) RETURNS JSONB AS $$
DECLARE
  nutrition_data RECORD;
  fitness_data RECORD;
  ai_usage_data RECORD;
  engagement_data RECORD;
  result JSONB;
BEGIN
  -- Get nutrition metrics
  SELECT 
    COALESCE(SUM(calories_consumed), 0) as calories_consumed,
    COALESCE(SUM(protein_consumed), 0) as protein_consumed,
    COALESCE(SUM(carbs_consumed), 0) as carbs_consumed,
    COALESCE(SUM(fat_consumed), 0) as fat_consumed,
    COUNT(*) as meals_logged
  INTO nutrition_data
  FROM food_consumption_log
  WHERE user_id = user_id_param 
  AND DATE(consumed_at) = date_param;
  
  -- Get fitness metrics
  SELECT 
    COUNT(*) FILTER (WHERE completed = true) as workouts_completed,
    COUNT(*) as workouts_planned,
    COALESCE(SUM(actual_duration), 0) as total_workout_duration,
    COALESCE(SUM(actual_calories), 0) as calories_burned
  INTO fitness_data
  FROM daily_workouts dw
  JOIN weekly_exercise_programs wep ON wep.id = dw.weekly_program_id
  WHERE wep.user_id = user_id_param
  AND DATE(dw.created_at) = date_param;
  
  -- Get AI usage metrics
  SELECT 
    COUNT(*) as ai_generations_used,
    COUNT(*) FILTER (WHERE generation_type = 'meal_plan') as meal_plans_generated,
    COUNT(*) FILTER (WHERE generation_type = 'exercise_program') as exercise_programs_generated
  INTO ai_usage_data
  FROM ai_generation_logs
  WHERE user_id = user_id_param
  AND DATE(created_at) = date_param;
  
  -- Get engagement metrics
  SELECT 
    COUNT(DISTINCT session_id) as app_sessions,
    COALESCE(SUM(duration_seconds), 0) / 60 as total_app_time_minutes,
    array_agg(DISTINCT activity_type) as features_used
  INTO engagement_data
  FROM user_activity_logs
  WHERE user_id = user_id_param
  AND DATE(created_at) = date_param;
  
  -- Build result JSON
  result := jsonb_build_object(
    'nutrition', jsonb_build_object(
      'calories_consumed', nutrition_data.calories_consumed,
      'protein_consumed', nutrition_data.protein_consumed,
      'carbs_consumed', nutrition_data.carbs_consumed,
      'fat_consumed', nutrition_data.fat_consumed,
      'meals_logged', nutrition_data.meals_logged
    ),
    'fitness', jsonb_build_object(
      'workouts_completed', fitness_data.workouts_completed,
      'workouts_planned', fitness_data.workouts_planned,
      'total_workout_duration', fitness_data.total_workout_duration,
      'calories_burned', fitness_data.calories_burned,
      'adherence_percentage', 
        CASE 
          WHEN fitness_data.workouts_planned > 0 
          THEN ROUND((fitness_data.workouts_completed::numeric / fitness_data.workouts_planned) * 100, 2)
          ELSE 0 
        END
    ),
    'ai_usage', jsonb_build_object(
      'total_generations', ai_usage_data.ai_generations_used,
      'meal_plans_generated', ai_usage_data.meal_plans_generated,
      'exercise_programs_generated', ai_usage_data.exercise_programs_generated
    ),
    'engagement', jsonb_build_object(
      'app_sessions', engagement_data.app_sessions,
      'total_app_time_minutes', engagement_data.total_app_time_minutes,
      'features_used', engagement_data.features_used
    )
  );
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### Generate Weekly Progress Summary
```sql
CREATE OR REPLACE FUNCTION generate_weekly_progress_summary(
  user_id_param uuid,
  week_start_date_param date
) RETURNS uuid AS $$
DECLARE
  summary_id uuid;
  week_end_date date;
  weekly_data RECORD;
  progress_data RECORD;
  behavioral_data RECORD;
BEGIN
  week_end_date := week_start_date_param + INTERVAL '6 days';
  
  -- Calculate weekly aggregates
  SELECT 
    -- Nutrition totals
    COALESCE(SUM(dm.calories_consumed), 0) as total_calories_consumed,
    COALESCE(SUM(dm.calories_burned), 0) as total_calories_burned,
    COALESCE(AVG(dm.calories_consumed), 0) as avg_daily_calories,
    
    -- Fitness totals
    COALESCE(SUM(dm.workouts_completed), 0) as total_workouts_completed,
    COALESCE(SUM(dm.total_workout_duration), 0) as total_workout_duration,
    COALESCE(AVG(dm.total_workout_duration), 0) as avg_workout_duration,
    
    -- Adherence
    COALESCE(AVG(dm.workout_adherence_percentage), 0) as avg_adherence_percentage,
    
    -- Engagement
    COALESCE(SUM(dm.app_sessions), 0) as total_app_sessions,
    COALESCE(SUM(dm.total_app_time), 0) as total_app_time
  INTO weekly_data
  FROM dashboard_metrics dm
  WHERE dm.user_id = user_id_param
  AND dm.metric_date BETWEEN week_start_date_param AND week_end_date;
  
  -- Calculate progress indicators
  SELECT 
    COALESCE(
      (SELECT weight FROM weight_entries 
       WHERE user_id = user_id_param 
       AND DATE(recorded_at) <= week_end_date 
       ORDER BY recorded_at DESC LIMIT 1) -
      (SELECT weight FROM weight_entries 
       WHERE user_id = user_id_param 
       AND DATE(recorded_at) <= week_start_date_param - INTERVAL '1 day'
       ORDER BY recorded_at DESC LIMIT 1), 0
    ) as weight_change_kg,
    
    -- Calculate consistency score (0-100)
    CASE 
      WHEN COUNT(dm.metric_date) = 7 THEN 100
      ELSE ROUND((COUNT(dm.metric_date)::numeric / 7) * 100, 2)
    END as consistency_score
  INTO progress_data
  FROM dashboard_metrics dm
  WHERE dm.user_id = user_id_param
  AND dm.metric_date BETWEEN week_start_date_param AND week_end_date;
  
  -- Insert weekly summary
  INSERT INTO weekly_progress_summaries (
    user_id, week_start_date, week_number, year,
    total_calories_consumed, total_calories_burned, total_workouts_completed,
    total_workout_duration, avg_daily_calories, avg_workout_duration,
    avg_adherence_percentage, weight_change_kg, consistency_score
  ) VALUES (
    user_id_param, week_start_date_param, 
    EXTRACT(WEEK FROM week_start_date_param)::integer,
    EXTRACT(YEAR FROM week_start_date_param)::integer,
    weekly_data.total_calories_consumed, weekly_data.total_calories_burned,
    weekly_data.total_workouts_completed, weekly_data.total_workout_duration,
    weekly_data.avg_daily_calories, weekly_data.avg_workout_duration,
    weekly_data.avg_adherence_percentage, progress_data.weight_change_kg,
    progress_data.consistency_score
  ) RETURNING id INTO summary_id;
  
  RETURN summary_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### Log User Activity
```sql
CREATE OR REPLACE FUNCTION log_user_activity(
  user_id_param uuid,
  activity_type_param text,
  activity_category_param text,
  activity_data_param jsonb DEFAULT '{}',
  session_id_param text DEFAULT NULL,
  duration_seconds_param integer DEFAULT NULL
) RETURNS uuid AS $$
DECLARE
  activity_id uuid;
  engagement_score numeric;
BEGIN
  -- Calculate engagement score based on activity type and duration
  engagement_score := CASE activity_category_param
    WHEN 'ai_generation' THEN 10
    WHEN 'fitness' THEN 8
    WHEN 'nutrition' THEN 6
    WHEN 'social' THEN 4
    ELSE 2
  END;
  
  -- Bonus for longer engagement
  IF duration_seconds_param IS NOT NULL AND duration_seconds_param > 60 THEN
    engagement_score := engagement_score * (1 + LEAST(duration_seconds_param / 300.0, 2));
  END IF;
  
  INSERT INTO user_activity_logs (
    user_id, activity_type, activity_category, activity_data,
    session_id, duration_seconds, engagement_score
  ) VALUES (
    user_id_param, activity_type_param, activity_category_param, activity_data_param,
    session_id_param, duration_seconds_param, engagement_score
  ) RETURNING id INTO activity_id;
  
  RETURN activity_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

## 📊 Analytics Views

### User Dashboard Summary View
```sql
CREATE VIEW user_dashboard_summary AS
SELECT 
  p.id as user_id,
  p.first_name,
  p.last_name,
  p.profile_completion_score,
  p.ai_generations_remaining,
  
  -- Current week metrics
  dm_current.calories_consumed as today_calories,
  dm_current.workouts_completed as today_workouts,
  dm_current.workout_adherence_percentage as current_adherence,
  
  -- Weekly progress
  wps.consistency_score as week_consistency,
  wps.weight_change_kg as week_weight_change,
  wps.total_workouts_completed as week_workouts,
  
  -- Recent activity
  recent_activity.last_activity,
  recent_activity.activity_count
  
FROM profiles p
LEFT JOIN dashboard_metrics dm_current ON (
  dm_current.user_id = p.id 
  AND dm_current.metric_date = CURRENT_DATE
)
LEFT JOIN weekly_progress_summaries wps ON (
  wps.user_id = p.id 
  AND wps.week_start_date = date_trunc('week', CURRENT_DATE)::date
)
LEFT JOIN LATERAL (
  SELECT 
    MAX(created_at) as last_activity,
    COUNT(*) as activity_count
  FROM user_activity_logs ual
  WHERE ual.user_id = p.id
  AND ual.created_at >= CURRENT_DATE - INTERVAL '7 days'
) recent_activity ON true;
```

This comprehensive analytics schema provides robust tracking, insights, and dashboard capabilities for React Native with proper performance optimization and user engagement metrics.
