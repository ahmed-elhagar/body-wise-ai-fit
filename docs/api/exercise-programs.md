
# Exercise Programs API

AI-powered exercise program generation with personalized workouts and progress tracking.

## 🏋️ Exercise Program Endpoints

### Generate Exercise Program
**Endpoint**: `POST /functions/v1/generate-exercise-program`

**Request Body**:
```json
{
  "userId": "user-uuid",
  "preferences": {
    "workoutType": "home",
    "fitnessLevel": "beginner",
    "goalType": "weight_loss",
    "preferredDuration": 45,
    "availableEquipment": ["dumbbells", "resistance_bands"],
    "muscleGroupFocus": ["upper_body", "core"],
    "workoutsPerWeek": 4,
    "language": "en"
  },
  "weekOffset": 0
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "programId": "program-uuid",
    "programName": "4-Week Home Weight Loss Program",
    "weekStartDate": "2024-01-15",
    "workoutsCreated": 16,
    "exercisesCreated": 64,
    "estimatedCalories": 2800,
    "workoutType": "home",
    "difficultyLevel": "beginner"
  },
  "creditsRemaining": 4,
  "message": "Exercise program generated successfully"
}
```

**React Native Implementation**:
```javascript
const generateExerciseProgram = async (preferences) => {
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
**Method**: Database Function Call

```javascript
const getCurrentProgram = async (userId) => {
  const { data, error } = await supabase.rpc('get_current_exercise_program', {
    user_id_param: userId
  });
  
  if (error) throw error;
  return data;
};
```

**Response Structure**:
```json
{
  "id": "program-uuid",
  "programName": "Home Strength Building",
  "difficultyLevel": "intermediate",
  "workoutType": "home",
  "currentWeek": 2,
  "weekStartDate": "2024-01-15",
  "dailyWorkouts": [
    {
      "id": "workout-uuid",
      "dayNumber": 1,
      "workoutName": "Upper Body Strength",
      "estimatedDuration": 45,
      "estimatedCalories": 220,
      "muscleGroups": ["chest", "shoulders", "triceps"],
      "completed": false,
      "exercises": [
        {
          "id": "exercise-uuid",
          "name": "Push-ups",
          "sets": 3,
          "reps": "8-12",
          "restSeconds": 60,
          "muscleGroups": ["chest", "triceps"],
          "instructions": "Keep body straight, lower chest to floor",
          "equipment": "bodyweight",
          "difficulty": "beginner",
          "orderNumber": 1,
          "completed": false
        }
      ]
    }
  ]
}
```

## 💪 Workout Management

### Start Workout Session
```javascript
const startWorkout = async (workoutId) => {
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
```javascript
const completeWorkout = async (workoutId, metrics) => {
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
```

### Track Exercise Performance
**Endpoint**: `POST /functions/v1/track-exercise-performance`

**Request Body**:
```json
{
  "exerciseId": "exercise-uuid",
  "userId": "user-uuid",
  "action": "completed",
  "progressData": {
    "sets_completed": 3,
    "reps_completed": "12",
    "weight_used": 15,
    "notes": "Felt strong today"
  },
  "timestamp": "2024-01-15T10:30:00Z"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Performance tracked successfully",
  "performanceMetrics": {
    "exercise_name": "Push-ups",
    "target_sets": 3,
    "actual_sets": 3,
    "completion_rate": 100,
    "exceeded_target": false
  }
}
```

## 🔄 Exercise Exchange

### Exchange Exercise
**Endpoint**: `POST /functions/v1/exchange-exercise`

**Request Body**:
```json
{
  "exerciseId": "exercise-uuid",
  "reason": "equipment_unavailable",
  "userProfile": {
    "fitnessLevel": "beginner",
    "availableEquipment": ["bodyweight"],
    "injuries": ["lower_back"]
  },
  "language": "en"
}
```

**Response**:
```json
{
  "success": true,
  "newExercise": {
    "name": "Modified Push-ups",
    "sets": 3,
    "reps": "8-10",
    "restSeconds": 60,
    "instructions": "Perform on knees if needed",
    "equipment": "bodyweight",
    "muscleGroups": ["chest", "triceps"],
    "difficulty": "beginner"
  },
  "creditsUsed": 1,
  "creditsRemaining": 3
}
```

## 📊 Progress Analytics

### Get Workout Statistics
```javascript
const getWorkoutStats = async (userId, timeRange = '30d') => {
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
```javascript
const getMuscleGroupProgress = async (userId, timeRange = '30d') => {
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
  
  const muscleGroupStats = data.reduce((acc, exercise) => {
    exercise.muscle_groups?.forEach(muscle => {
      acc[muscle] = (acc[muscle] || 0) + 1;
    });
    return acc;
  }, {});
  
  return muscleGroupStats;
};
```

## 🎯 Exercise Recommendations

### Get Exercise Recommendations
**Endpoint**: `POST /functions/v1/get-exercise-recommendations`

**Request Body**:
```json
{
  "userId": "user-uuid",
  "preferences": {
    "targetMuscleGroups": ["chest", "triceps"],
    "equipment": ["dumbbells"],
    "difficulty": "intermediate",
    "duration": 30
  },
  "count": 5
}
```

**Response**:
```json
{
  "success": true,
  "recommendations": [
    {
      "name": "Dumbbell Chest Press",
      "sets": 3,
      "reps": "10-12",
      "restSeconds": 90,
      "muscleGroups": ["chest", "triceps"],
      "equipment": "dumbbells",
      "difficulty": "intermediate",
      "instructions": "Lie on bench, press dumbbells up and together"
    }
  ],
  "creditsUsed": 1
}
```

## 🔄 Real-time Updates

### Workout Progress Subscription
```javascript
const subscribeToWorkoutProgress = (workoutId, callback) => {
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
```javascript
const subscribeToProgramCompletion = (programId, callback) => {
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

## 🏃 Workout Types & Equipment

### Workout Types
- **Home**: Bodyweight and minimal equipment
- **Gym**: Full gym equipment access
- **Outdoor**: Park/outdoor space workouts
- **Hybrid**: Combination of home and gym

### Equipment Categories
- **Bodyweight**: No equipment needed
- **Dumbbells**: Adjustable weights
- **Resistance Bands**: Portable resistance
- **Kettlebells**: Functional training
- **Machines**: Gym equipment
- **Cardio**: Treadmill, bike, etc.

### Difficulty Levels
- **Beginner**: Basic movements, lower intensity
- **Intermediate**: Compound movements, moderate intensity
- **Advanced**: Complex movements, high intensity

## 🚫 Error Handling

### Common Error Codes
```javascript
const EXERCISE_ERRORS = {
  'INSUFFICIENT_CREDITS': 'You need more credits to generate programs',
  'PROGRAM_NOT_FOUND': 'Exercise program not found',
  'WORKOUT_ALREADY_COMPLETED': 'This workout has been completed',
  'INVALID_EXERCISE_DATA': 'Invalid exercise parameters',
  'AI_GENERATION_FAILED': 'Failed to generate exercises'
};
```

This comprehensive exercise API provides personalized workout generation, progress tracking, and intelligent exercise recommendations with real-time capabilities.
