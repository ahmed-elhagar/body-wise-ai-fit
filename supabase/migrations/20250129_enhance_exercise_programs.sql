
-- Add missing columns to weekly_exercise_programs table
ALTER TABLE weekly_exercise_programs 
ADD COLUMN IF NOT EXISTS workout_type text DEFAULT 'home',
ADD COLUMN IF NOT EXISTS current_week integer DEFAULT 1,
ADD COLUMN IF NOT EXISTS status text DEFAULT 'active',
ADD COLUMN IF NOT EXISTS updated_at timestamp with time zone DEFAULT now();

-- Add missing columns to daily_workouts table  
ALTER TABLE daily_workouts
ADD COLUMN IF NOT EXISTS completed boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS updated_at timestamp with time zone DEFAULT now();

-- Add missing columns to exercises table
ALTER TABLE exercises
ADD COLUMN IF NOT EXISTS completed boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS notes text,
ADD COLUMN IF NOT EXISTS actual_sets integer,
ADD COLUMN IF NOT EXISTS actual_reps text,
ADD COLUMN IF NOT EXISTS created_at timestamp with time zone DEFAULT now(),
ADD COLUMN IF NOT EXISTS updated_at timestamp with time zone DEFAULT now();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_weekly_exercise_programs_user_created 
ON weekly_exercise_programs(user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_daily_workouts_weekly_program_day 
ON daily_workouts(weekly_program_id, day_number);

CREATE INDEX IF NOT EXISTS idx_exercises_daily_workout_order 
ON exercises(daily_workout_id, order_number);

-- Create a function to get current exercise program similar to meal plan
CREATE OR REPLACE FUNCTION get_current_exercise_program(user_id_param uuid)
RETURNS TABLE (
  id uuid,
  program_name text,
  difficulty_level text,
  workout_type text,
  current_week integer,
  week_start_date date,
  created_at timestamp with time zone,
  daily_workouts_count bigint
) 
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    wep.id,
    wep.program_name,
    wep.difficulty_level,
    wep.workout_type,
    wep.current_week,
    wep.week_start_date,
    wep.created_at,
    COUNT(dw.id) as daily_workouts_count
  FROM weekly_exercise_programs wep
  LEFT JOIN daily_workouts dw ON wep.id = dw.weekly_program_id
  WHERE wep.user_id = user_id_param
  GROUP BY wep.id, wep.program_name, wep.difficulty_level, wep.workout_type, 
           wep.current_week, wep.week_start_date, wep.created_at
  ORDER BY wep.created_at DESC
  LIMIT 1;
END;
$$;
