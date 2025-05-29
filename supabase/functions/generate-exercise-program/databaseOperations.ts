
export const storeWorkoutProgram = async (
  supabase: any,
  generatedProgram: any,
  userData: any,
  preferences: any
) => {
  const userId = userData?.userId;
  if (!userId) {
    throw new Error('User ID is required');
  }

  // Create weekly program record
  const { data: weeklyProgram, error: weeklyError } = await supabase
    .from('weekly_exercise_programs')
    .insert({
      user_id: userId,
      program_name: generatedProgram.programOverview?.name || `${preferences?.workoutType || 'Home'} Fitness Program`,
      difficulty_level: preferences?.fitnessLevel || 'beginner',
      week_start_date: new Date().toISOString().split('T')[0],
      generation_prompt: {
        workoutType: preferences?.workoutType || 'home',
        preferences,
        userData
      }
    })
    .select()
    .single();

  if (weeklyError) {
    console.error('Error creating weekly program:', weeklyError);
    throw new Error('Failed to save weekly program');
  }

  // Store daily workouts and exercises
  for (const week of generatedProgram.weeks) {
    for (const workout of week.workouts) {
      await storeDailyWorkout(supabase, workout, weeklyProgram.id);
    }
  }

  return weeklyProgram;
};

const storeDailyWorkout = async (supabase: any, workout: any, weeklyProgramId: string) => {
  // Create daily workout
  const { data: dailyWorkout, error: dailyError } = await supabase
    .from('daily_workouts')
    .insert({
      weekly_program_id: weeklyProgramId,
      day_number: workout.day,
      workout_name: workout.workoutName,
      estimated_duration: workout.estimatedDuration,
      estimated_calories: workout.estimatedCalories,
      muscle_groups: workout.muscleGroups
    })
    .select()
    .single();

  if (dailyError) {
    console.error('Error creating daily workout:', dailyError);
    return;
  }

  // Store exercises for this workout
  if (workout.exercises && Array.isArray(workout.exercises)) {
    await storeExercises(supabase, workout.exercises, dailyWorkout.id);
  }
};

const storeExercises = async (supabase: any, exercises: any[], dailyWorkoutId: string) => {
  const exercisesToInsert = exercises.map(exercise => ({
    daily_workout_id: dailyWorkoutId,
    name: exercise.name,
    sets: exercise.sets,
    reps: exercise.reps,
    rest_seconds: exercise.restSeconds,
    muscle_groups: exercise.muscleGroups,
    instructions: exercise.instructions,
    youtube_search_term: exercise.youtubeSearchTerm,
    equipment: exercise.equipment,
    difficulty: exercise.difficulty,
    order_number: exercise.orderNumber || 1
  }));

  const { error: exerciseError } = await supabase
    .from('exercises')
    .insert(exercisesToInsert);

  if (exerciseError) {
    console.error('Error creating exercises:', exerciseError);
  }
};
