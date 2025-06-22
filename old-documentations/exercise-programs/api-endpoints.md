
# Exercise Programs API Endpoints

Comprehensive API documentation for exercise program management in React Native/Expo app.

## 🏋️ Exercise Program Endpoints

### Generate Exercise Program
```typescript
// POST /functions/v1/generate-exercise-program
interface GenerateExerciseProgramRequest {
  userId: string;
  preferences: {
    workoutType: 'home' | 'gym' | 'outdoor';
    fitnessLevel: 'beginner' | 'intermediate' | 'advanced';
    goalType: 'weight_loss' | 'muscle_gain' | 'endurance' | 'strength';
    preferredDuration: number; // minutes
    availableEquipment: string[];
    muscleGroupFocus: string[];
    workoutsPerWeek: number;
    language: 'en' | 'ar';
  };
  weekOffset?: number; // Default 0 (current week)
}

interface GenerateExerciseProgramResponse {
  success: boolean;
  data: {
    programId: string;
    programName: string;
    weekStartDate: string;
    workoutsCreated: number;
    exercisesCreated: number;
    estimatedCalories: number;
  };
  creditsRemaining: number;
  message: string;
}

// Usage in React Native
const generateProgram = async (preferences: ExercisePreferences) => {
  const { data, error } = await supabase.functions.invoke('generate-exercise-program', {
    body: {
      userId: user.id,
      preferences,
      weekOffset: 0
    }
  });
  
  if (error) throw error;
  return data;
};
```

### Get Current Exercise Program
```typescript
// GET via Supabase client
const getCurrentProgram = async (userId: string) => {
  const { data, error } = await supabase.rpc('get_current_exercise_program', {
    user_id_param: userId
  });
  
  if (error) throw error;
  return data;
};

// Response structure
interface CurrentExerciseProgramResponse {
  program: WeeklyExerciseProgram;
  daily_workouts: DailyWorkoutWithExercises[];
  progress_summary: {
    total_workouts: number;
    completed_workouts: number;
    total_exercises: number;
    completed_exercises: number;
    average_workout_duration: number;
    total_calories_burned: number;
  };
}
```

### Get Exercise Program History
```typescript
// GET via Supabase client
const getProgramHistory = async (userId: string, limit: number = 10) => {
  const { data, error } = await supabase
    .from('weekly_exercise_programs')
    .select(`
      *,
      daily_workouts!inner(
        id,
        day_number,
        workout_name,
        completed,
        actual_duration,
        actual_calories
      )
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);
    
  if (error) throw error;
  return data;
};
```

## 🏃 Workout Management Endpoints

### Start Workout Session
```typescript
// PATCH via Supabase client
const startWorkout = async (workoutId: string) => {
  const { data, error } = await supabase
    .from('daily_workouts')
    .update({
      started_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
    .eq('id', workoutId)
    .select()
    .single();
    
  if (error) throw error;
  return data;
};
```

### Complete Workout Session
```typescript
// PATCH via Supabase client
const completeWorkout = async (workoutId: string, metrics: WorkoutMetrics) => {
  const { data, error } = await supabase
    .from('daily_workouts')
    .update({
      completed: true,
      completed_at: new Date().toISOString(),
      actual_duration: metrics.duration,
      actual_calories: metrics.calories,
      difficulty_rating: metrics.difficultyRating,
      notes: metrics.notes,
      updated_at: new Date().toISOString()
    })
    .eq('id', workoutId)
    .select()
    .single();
    
  if (error) throw error;
  return data;
};

interface WorkoutMetrics {
  duration: number; // minutes
  calories: number;
  difficultyRating: number; // 1-5
  notes?: string;
}
```

### Get Workout Details
```typescript
// GET via Supabase client
const getWorkoutDetails = async (workoutId: string) => {
  const { data, error } = await supabase
    .from('daily_workouts')
    .select(`
      *,
      exercises!inner(
        *
      )
    `)
    .eq('id', workoutId)
    .order('exercises(order_number)', { ascending: true })
    .single();
    
  if (error) throw error;
  return data;
};
```

## 💪 Exercise Management Endpoints

### Complete Exercise
```typescript
// Use database function for atomic operation
const completeExercise = async (
  exerciseId: string, 
  actualSets: number, 
  actualReps: string,
  notes?: string
) => {
  const { error } = await supabase.rpc('complete_exercise', {
    exercise_id_param: exerciseId,
    actual_sets_param: actualSets,
    actual_reps_param: actualReps,
    notes_param: notes
  });
  
  if (error) throw error;
};
```

### Update Exercise Progress
```typescript
// PATCH via Supabase client
const updateExerciseProgress = async (exerciseId: string, progress: ExerciseProgress) => {
  const { data, error } = await supabase
    .from('exercises')
    .update({
      actual_sets: progress.actualSets,
      actual_reps: progress.actualReps,
      notes: progress.notes,
      updated_at: new Date().toISOString()
    })
    .eq('id', exerciseId)
    .select()
    .single();
    
  if (error) throw error;
  return data;
};

interface ExerciseProgress {
  actualSets?: number;
  actualReps?: string;
  notes?: string;
}
```

### Exchange Exercise (AI-Powered)
```typescript
// POST /functions/v1/exchange-exercise
interface ExchangeExerciseRequest {
  exerciseId: string;
  reason: 'too_difficult' | 'equipment_unavailable' | 'injury_concern' | 'preference';
  userProfile: UserProfile;
  language: 'en' | 'ar';
}

interface ExchangeExerciseResponse {
  success: boolean;
  newExercise: Exercise;
  creditsUsed: number;
  creditsRemaining: number;
}

const exchangeExercise = async (request: ExchangeExerciseRequest) => {
  const { data, error } = await supabase.functions.invoke('exchange-exercise', {
    body: request
  });
  
  if (error) throw error;
  return data;
};
```

## 📊 Analytics & Progress Endpoints

### Get Workout Statistics
```typescript
// GET via Supabase client
const getWorkoutStats = async (userId: string, timeRange: string = '30d') => {
  const startDate = new Date();
  const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
  startDate.setDate(startDate.getDate() - days);
  
  const { data, error } = await supabase
    .from('daily_workouts')
    .select(`
      id,
      completed,
      actual_duration,
      actual_calories,
      difficulty_rating,
      completed_at,
      weekly_exercise_programs!inner(user_id)
    `)
    .eq('weekly_exercise_programs.user_id', userId)
    .gte('completed_at', startDate.toISOString())
    .order('completed_at', { ascending: false });
    
  if (error) throw error;
  
  // Calculate statistics
  const stats = {
    totalWorkouts: data.length,
    completedWorkouts: data.filter(w => w.completed).length,
    totalDuration: data.reduce((sum, w) => sum + (w.actual_duration || 0), 0),
    totalCalories: data.reduce((sum, w) => sum + (w.actual_calories || 0), 0),
    averageDifficulty: data.length > 0 
      ? data.reduce((sum, w) => sum + (w.difficulty_rating || 0), 0) / data.length 
      : 0,
    completionRate: data.length > 0 
      ? (data.filter(w => w.completed).length / data.length) * 100 
      : 0
  };
  
  return stats;
};
```

### Get Muscle Group Progress
```typescript
// GET via Supabase client
const getMuscleGroupProgress = async (userId: string, timeRange: string = '30d') => {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - (timeRange === '7d' ? 7 : 30));
  
  const { data, error } = await supabase
    .from('exercises')
    .select(`
      muscle_groups,
      completed,
      daily_workouts!inner(
        completed_at,
        weekly_exercise_programs!inner(user_id)
      )
    `)
    .eq('daily_workouts.weekly_exercise_programs.user_id', userId)
    .eq('completed', true)
    .gte('daily_workouts.completed_at', startDate.toISOString());
    
  if (error) throw error;
  
  // Process muscle group statistics
  const muscleGroupStats = data.reduce((acc, exercise) => {
    exercise.muscle_groups?.forEach(muscle => {
      acc[muscle] = (acc[muscle] || 0) + 1;
    });
    return acc;
  }, {} as Record<string, number>);
  
  return muscleGroupStats;
};
```

## 🔄 Real-time Updates

### Workout Progress Subscription
```typescript
// Subscribe to workout progress updates
const subscribeToWorkoutProgress = (workoutId: string, callback: (progress: any) => void) => {
  return supabase
    .channel(`workout-progress-${workoutId}`)
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'exercises',
        filter: `daily_workout_id=eq.${workoutId}`
      },
      (payload) => callback(payload.new)
    )
    .subscribe();
};
```

### Program Completion Subscription
```typescript
// Subscribe to program completion events
const subscribeToProgramCompletion = (programId: string, callback: (completion: any) => void) => {
  return supabase
    .channel(`program-completion-${programId}`)
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'daily_workouts',
        filter: `weekly_program_id=eq.${programId}`
      },
      (payload) => {
        if (payload.new.completed) {
          callback(payload.new);
        }
      }
    )
    .subscribe();
};
```

## 🚫 Error Handling

### Common Error Responses
```typescript
interface ExerciseAPIError {
  error: string;
  code: string;
  details?: any;
  statusCode: number;
}

// Common error codes
const ERROR_CODES = {
  INSUFFICIENT_CREDITS: 'INSUFFICIENT_CREDITS',
  PROGRAM_NOT_FOUND: 'PROGRAM_NOT_FOUND',
  WORKOUT_ALREADY_COMPLETED: 'WORKOUT_ALREADY_COMPLETED',
  INVALID_EXERCISE_DATA: 'INVALID_EXERCISE_DATA',
  AI_GENERATION_FAILED: 'AI_GENERATION_FAILED',
  DATABASE_ERROR: 'DATABASE_ERROR'
};
```

### React Native Error Handling
```typescript
const handleExerciseAPIError = (error: ExerciseAPIError) => {
  switch (error.code) {
    case ERROR_CODES.INSUFFICIENT_CREDITS:
      return 'You need more credits to generate exercise programs. Upgrade to Pro for unlimited access.';
    case ERROR_CODES.PROGRAM_NOT_FOUND:
      return 'Exercise program not found. Please generate a new program.';
    case ERROR_CODES.WORKOUT_ALREADY_COMPLETED:
      return 'This workout has already been completed.';
    default:
      return 'An unexpected error occurred. Please try again.';
  }
};
```

This comprehensive API documentation provides all the endpoints needed for a complete exercise program management system in React Native with proper error handling and real-time capabilities.
