
# Exercise Programs Database Schema

Comprehensive database structure for exercise program management in FitFatta React Native/Expo app.

## 📊 Core Tables

### `weekly_exercise_programs` - Main Program Container
```sql
CREATE TABLE weekly_exercise_programs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id),
  program_name text NOT NULL,
  difficulty_level text NOT NULL, -- 'beginner', 'intermediate', 'advanced'
  workout_type text DEFAULT 'home', -- 'home', 'gym', 'outdoor'
  current_week integer DEFAULT 1,
  week_start_date date NOT NULL, -- Always starts on Saturday
  status text DEFAULT 'active', -- 'active', 'paused', 'completed'
  generation_prompt jsonb, -- User preferences for generation
  total_estimated_calories integer,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Performance indexes
CREATE INDEX idx_weekly_exercise_programs_user_date 
ON weekly_exercise_programs(user_id, week_start_date DESC);

CREATE INDEX idx_weekly_exercise_programs_status 
ON weekly_exercise_programs(user_id, status);
```

### `daily_workouts` - Individual Workout Sessions
```sql
CREATE TABLE daily_workouts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  weekly_program_id uuid NOT NULL REFERENCES weekly_exercise_programs(id),
  day_number integer NOT NULL, -- 1-7 (Saturday=1, Friday=7)
  workout_name text NOT NULL,
  estimated_duration integer, -- minutes
  estimated_calories integer,
  muscle_groups text[], -- ['chest', 'shoulders', 'triceps']
  completed boolean DEFAULT false,
  completed_at timestamptz,
  actual_duration integer, -- minutes
  actual_calories integer,
  difficulty_rating integer, -- 1-5 user feedback
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Constraints
ALTER TABLE daily_workouts ADD CONSTRAINT valid_day_number 
CHECK (day_number >= 1 AND day_number <= 7);

ALTER TABLE daily_workouts ADD CONSTRAINT valid_difficulty_rating 
CHECK (difficulty_rating >= 1 AND difficulty_rating <= 5);
```

### `exercises` - Individual Exercise Details
```sql
CREATE TABLE exercises (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  daily_workout_id uuid NOT NULL REFERENCES daily_workouts(id),
  name text NOT NULL,
  order_number integer DEFAULT 1,
  sets integer,
  reps text, -- '10-12' or '30 seconds' for time-based
  rest_seconds integer DEFAULT 60,
  muscle_groups text[], -- ['chest', 'triceps']
  equipment text, -- 'dumbbells', 'bodyweight', 'resistance_band'
  difficulty text DEFAULT 'medium', -- 'easy', 'medium', 'hard'
  instructions text,
  youtube_search_term text, -- For finding exercise videos
  image_url text, -- Exercise demonstration image
  completed boolean DEFAULT false,
  actual_sets integer,
  actual_reps text,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Performance indexes
CREATE INDEX idx_exercises_workout_order 
ON exercises(daily_workout_id, order_number);
```

## 🔗 Relationships & Integration

### User Profile Integration
```sql
-- Exercise programs are personalized based on:
profiles.fitness_goal -- 'weight_loss', 'muscle_gain', 'endurance'
profiles.activity_level -- 'sedentary', 'lightly_active', etc.
profiles.age, weight, height -- For calorie calculations
profiles.health_conditions -- Safety considerations
profiles.preferred_language -- Exercise instructions language
```

### AI Generation Tracking
```sql
-- Every exercise program generation is logged
ai_generation_logs.generation_type = 'exercise_program'
ai_generation_logs.prompt_data -- Contains user preferences
ai_generation_logs.response_data -- AI model response
ai_generation_logs.credits_used -- Always 1 for exercise programs
```

### Progress Tracking Integration
```sql
-- Links to weight tracking
weight_entries.user_id = profiles.id
-- Links to achievements
user_achievements.achievement_id -- Exercise-related achievements
```

## 📱 React Native Data Structures

### TypeScript Interfaces
```typescript
interface WeeklyExerciseProgram {
  id: string;
  programName: string;
  difficultyLevel: 'beginner' | 'intermediate' | 'advanced';
  workoutType: 'home' | 'gym' | 'outdoor';
  currentWeek: number;
  weekStartDate: string; // YYYY-MM-DD
  status: 'active' | 'paused' | 'completed';
  generationPrompt: {
    fitnessGoal: string;
    preferredDuration: number;
    availableEquipment: string[];
    muscleGroupFocus: string[];
    language: 'en' | 'ar';
  };
  totalEstimatedCalories: number;
}

interface DailyWorkout {
  id: string;
  weeklyProgramId: string;
  dayNumber: number;
  workoutName: string;
  estimatedDuration: number;
  estimatedCalories: number;
  muscleGroups: string[];
  completed: boolean;
  completedAt?: string;
  actualDuration?: number;
  actualCalories?: number;
  difficultyRating?: number;
  notes?: string;
  exercises: Exercise[];
}

interface Exercise {
  id: string;
  dailyWorkoutId: string;
  name: string;
  orderNumber: number;
  sets: number;
  reps: string;
  restSeconds: number;
  muscleGroups: string[];
  equipment: string;
  difficulty: 'easy' | 'medium' | 'hard';
  instructions: string;
  youtubeSearchTerm?: string;
  imageUrl?: string;
  completed: boolean;
  actualSets?: number;
  actualReps?: string;
  notes?: string;
}
```

## 🏗️ Database Functions

### Get Current Exercise Program
```sql
CREATE OR REPLACE FUNCTION get_current_exercise_program(
  user_id_param uuid
) RETURNS JSONB AS $$
DECLARE
  result JSONB;
BEGIN
  SELECT jsonb_build_object(
    'program', to_jsonb(wep.*),
    'daily_workouts', daily_workouts.workouts,
    'progress_summary', progress.summary
  ) INTO result
  FROM weekly_exercise_programs wep
  LEFT JOIN LATERAL (
    SELECT jsonb_agg(
      jsonb_build_object(
        'workout', to_jsonb(dw.*),
        'exercises', exercises.exercise_list,
        'completion_rate', exercises.completion_rate
      ) ORDER BY dw.day_number
    ) as workouts
    FROM daily_workouts dw
    LEFT JOIN LATERAL (
      SELECT 
        jsonb_agg(to_jsonb(e.*) ORDER BY e.order_number) as exercise_list,
        ROUND(
          AVG(CASE WHEN e.completed THEN 1.0 ELSE 0.0 END) * 100, 2
        ) as completion_rate
      FROM exercises e
      WHERE e.daily_workout_id = dw.id
    ) exercises ON true
    WHERE dw.weekly_program_id = wep.id
  ) daily_workouts ON true
  LEFT JOIN LATERAL (
    SELECT jsonb_build_object(
      'total_workouts', COUNT(dw.id),
      'completed_workouts', COUNT(dw.id) FILTER (WHERE dw.completed),
      'total_exercises', COUNT(e.id),
      'completed_exercises', COUNT(e.id) FILTER (WHERE e.completed),
      'average_workout_duration', AVG(dw.actual_duration),
      'total_calories_burned', SUM(dw.actual_calories)
    ) as summary
    FROM daily_workouts dw
    LEFT JOIN exercises e ON e.daily_workout_id = dw.id
    WHERE dw.weekly_program_id = wep.id
  ) progress ON true
  WHERE wep.user_id = user_id_param 
  AND wep.status = 'active'
  ORDER BY wep.created_at DESC
  LIMIT 1;
  
  RETURN COALESCE(result, '{}'::jsonb);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### Complete Exercise Function
```sql
CREATE OR REPLACE FUNCTION complete_exercise(
  exercise_id_param uuid,
  actual_sets_param integer,
  actual_reps_param text,
  notes_param text DEFAULT NULL
) RETURNS VOID AS $$
DECLARE
  workout_id uuid;
  workout_completed boolean;
BEGIN
  -- Update exercise
  UPDATE exercises
  SET 
    completed = true,
    actual_sets = actual_sets_param,
    actual_reps = actual_reps_param,
    notes = notes_param,
    updated_at = NOW()
  WHERE id = exercise_id_param
  RETURNING daily_workout_id INTO workout_id;
  
  -- Check if all exercises in workout are completed
  SELECT NOT EXISTS (
    SELECT 1 FROM exercises 
    WHERE daily_workout_id = workout_id 
    AND completed = false
  ) INTO workout_completed;
  
  -- If all exercises completed, mark workout as completed
  IF workout_completed THEN
    UPDATE daily_workouts
    SET 
      completed = true,
      completed_at = NOW(),
      updated_at = NOW()
    WHERE id = workout_id;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

## 📊 Performance Optimizations

### Caching Strategy
```typescript
// Cache keys for React Native AsyncStorage
const CACHE_KEYS = {
  currentProgram: 'exercise_program_current',
  programHistory: 'exercise_program_history_',
  workoutTemplates: 'workout_templates',
  exerciseLibrary: 'exercise_library'
};

// Cache duration (milliseconds)
const CACHE_DURATION = {
  currentProgram: 5 * 60 * 1000, // 5 minutes
  programHistory: 30 * 60 * 1000, // 30 minutes
  workoutTemplates: 24 * 60 * 60 * 1000, // 24 hours
  exerciseLibrary: 7 * 24 * 60 * 60 * 1000 // 7 days
};
```

### Database Optimization
```sql
-- Partial indexes for active programs
CREATE INDEX idx_active_exercise_programs 
ON weekly_exercise_programs(user_id, week_start_date DESC) 
WHERE status = 'active';

-- Composite index for exercise completion tracking
CREATE INDEX idx_exercise_completion 
ON exercises(daily_workout_id, completed, order_number);

-- Index for muscle group filtering
CREATE INDEX idx_exercises_muscle_groups_gin 
ON exercises USING gin(muscle_groups);
```

This schema provides a robust foundation for exercise program management in React Native with proper relationships, performance optimizations, and comprehensive tracking capabilities.
