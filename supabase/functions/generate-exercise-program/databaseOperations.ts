
import { addDays, format, startOfWeek } from 'https://esm.sh/date-fns@3.6.0';

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

  const workoutType = preferences?.workoutType || 'home';
  
  // Calculate week start date from preferences or use current week
  const weekStartDate = preferences?.weekStartDate || format(startOfWeek(new Date()), 'yyyy-MM-dd');
  
  console.log('🗄️ Storing workout program:', {
    workoutType,
    weekStartDate,
    userId
  });

  // Check if there's already a program for this week and workout type
  const { data: existingProgram } = await supabase
    .from('weekly_exercise_programs')
    .select('id')
    .eq('user_id', userId)
    .eq('workout_type', workoutType)
    .eq('week_start_date', weekStartDate)
    .maybeSingle();

  // If program exists, delete it and create new one
  if (existingProgram) {
    console.log('🔄 Replacing existing program for week:', weekStartDate);
    
    // Delete related data first
    await supabase
      .from('exercises')
      .delete()
      .in('daily_workout_id', 
        supabase
          .from('daily_workouts')
          .select('id')
          .eq('weekly_program_id', existingProgram.id)
      );
    
    await supabase
      .from('daily_workouts')
      .delete()
      .eq('weekly_program_id', existingProgram.id);
    
    await supabase
      .from('weekly_exercise_programs')
      .delete()
      .eq('id', existingProgram.id);
  }

  // Create weekly program record with workout type and specific week
  const { data: weeklyProgram, error: weeklyError } = await supabase
    .from('weekly_exercise_programs')
    .insert({
      user_id: userId,
      program_name: generatedProgram.programOverview?.name || `${workoutType === 'gym' ? 'Gym' : 'Home'} Fitness Program`,
      difficulty_level: preferences?.fitnessLevel || 'beginner',
      week_start_date: weekStartDate,
      workout_type: workoutType,
      current_week: 1,
      status: 'active',
      generation_prompt: {
        workoutType,
        preferences,
        userData,
        weekStartDate
      }
    })
    .select()
    .single();

  if (weeklyError) {
    console.error('❌ Error creating weekly program:', weeklyError);
    throw new Error('Failed to save weekly program');
  }

  console.log('✅ Created weekly program:', weeklyProgram.program_name);

  // Store daily workouts and exercises
  for (const week of generatedProgram.weeks) {
    for (const workout of week.workouts) {
      await storeDailyWorkout(supabase, workout, weeklyProgram.id);
    }
  }

  return weeklyProgram;
};

const storeDailyWorkout = async (supabase: any, workout: any, weeklyProgramId: string) => {
  // Skip rest days - they'll be handled by the frontend
  if (workout.isRestDay) {
    return;
  }

  // Create daily workout
  const { data: dailyWorkout, error: dailyError } = await supabase
    .from('daily_workouts')
    .insert({
      weekly_program_id: weeklyProgramId,
      day_number: workout.day,
      workout_name: workout.workoutName,
      estimated_duration: workout.estimatedDuration,
      estimated_calories: workout.estimatedCalories,
      muscle_groups: workout.muscleGroups,
      completed: false
    })
    .select()
    .single();

  if (dailyError) {
    console.error('❌ Error creating daily workout:', dailyError);
    return;
  }

  // Store exercises for this workout
  if (workout.exercises && Array.isArray(workout.exercises)) {
    await storeExercises(supabase, workout.exercises, dailyWorkout.id);
  }
};

const storeExercises = async (supabase: any, exercises: any[], dailyWorkoutId: string) => {
  const exercisesToInsert = exercises.map((exercise, index) => ({
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
    order_number: exercise.orderNumber || index + 1,
    completed: false
  }));

  const { error: exerciseError } = await supabase
    .from('exercises')
    .insert(exercisesToInsert);

  if (exerciseError) {
    console.error('❌ Error creating exercises:', exerciseError);
  } else {
    console.log('✅ Created', exercisesToInsert.length, 'exercises');
  }
};
