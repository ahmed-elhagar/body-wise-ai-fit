
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
    userId: userId.substring(0, 8) + '...'
  });

  // Check if there's already a program for this week and workout type with more specific query
  const { data: existingPrograms, error: fetchError } = await supabase
    .from('weekly_exercise_programs')
    .select('id')
    .eq('user_id', userId)
    .eq('workout_type', workoutType)
    .eq('week_start_date', weekStartDate);

  if (fetchError) {
    console.error('❌ Error checking for existing programs:', fetchError);
    throw new Error('Failed to check for existing programs: ' + fetchError.message);
  }

  // If programs exist, delete them all first
  if (existingPrograms && existingPrograms.length > 0) {
    console.log('🔄 Found', existingPrograms.length, 'existing programs for week:', weekStartDate, 'type:', workoutType);
    
    for (const program of existingPrograms) {
      // Delete related data in correct order (exercises first, then workouts, then program)
      const { data: workoutIds } = await supabase
        .from('daily_workouts')
        .select('id')
        .eq('weekly_program_id', program.id);
      
      if (workoutIds && workoutIds.length > 0) {
        const workoutIdArray = workoutIds.map(w => w.id);
        
        // Delete exercises first
        const { error: exerciseDeleteError } = await supabase
          .from('exercises')
          .delete()
          .in('daily_workout_id', workoutIdArray);
          
        if (exerciseDeleteError) {
          console.error('❌ Error deleting exercises:', exerciseDeleteError);
        }
        
        // Then delete workouts
        const { error: workoutDeleteError } = await supabase
          .from('daily_workouts')
          .delete()
          .eq('weekly_program_id', program.id);
          
        if (workoutDeleteError) {
          console.error('❌ Error deleting workouts:', workoutDeleteError);
        }
      }
      
      // Finally delete the program
      const { error: programDeleteError } = await supabase
        .from('weekly_exercise_programs')
        .delete()
        .eq('id', program.id);
        
      if (programDeleteError) {
        console.error('❌ Error deleting program:', programDeleteError);
      } else {
        console.log('✅ Deleted existing program:', program.id);
      }
    }
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
        preferences: {
          goalType: preferences?.goalType,
          fitnessLevel: preferences?.fitnessLevel,
          availableTime: preferences?.availableTime
        },
        userData: {
          age: userData?.age,
          gender: userData?.gender,
          weight: userData?.weight,
          height: userData?.height
        },
        weekStartDate
      }
    })
    .select()
    .single();

  if (weeklyError) {
    console.error('❌ Error creating weekly program:', weeklyError);
    throw new Error('Failed to save weekly program: ' + weeklyError.message);
  }

  console.log('✅ Created weekly program:', weeklyProgram.program_name);

  // Store daily workouts and exercises
  let totalWorkoutsCreated = 0;
  let totalExercisesCreated = 0;

  for (const week of generatedProgram.weeks) {
    if (!week.workouts || !Array.isArray(week.workouts)) {
      console.log('Warning: Week has no workouts array');
      continue;
    }

    for (const workout of week.workouts) {
      const result = await storeDailyWorkout(supabase, workout, weeklyProgram.id);
      if (result) {
        totalWorkoutsCreated++;
        totalExercisesCreated += result.exerciseCount;
      }
    }
  }

  console.log(`✅ Created ${totalWorkoutsCreated} workouts with ${totalExercisesCreated} exercises`);

  return weeklyProgram;
};

const storeDailyWorkout = async (supabase: any, workout: any, weeklyProgramId: string) => {
  // Skip rest days - they'll be handled by the frontend
  if (workout.isRestDay || !workout.exercises || workout.exercises.length === 0) {
    console.log(`Skipping workout ${workout.workoutName || 'Unknown'} - no exercises`);
    return null;
  }

  // Create daily workout
  const { data: dailyWorkout, error: dailyError } = await supabase
    .from('daily_workouts')
    .insert({
      weekly_program_id: weeklyProgramId,
      day_number: workout.day,
      workout_name: workout.workoutName || 'Untitled Workout',
      estimated_duration: workout.estimatedDuration || 45,
      estimated_calories: workout.estimatedCalories || 300,
      muscle_groups: workout.muscleGroups || [],
      completed: false
    })
    .select()
    .single();

  if (dailyError) {
    console.error('❌ Error creating daily workout:', dailyError);
    return null;
  }

  // Store exercises for this workout
  const exerciseCount = await storeExercises(supabase, workout.exercises, dailyWorkout.id);
  
  return { exerciseCount };
};

const storeExercises = async (supabase: any, exercises: any[], dailyWorkoutId: string) => {
  if (!exercises || exercises.length === 0) {
    return 0;
  }

  const exercisesToInsert = exercises.map((exercise, index) => ({
    daily_workout_id: dailyWorkoutId,
    name: exercise.name || 'Unnamed Exercise',
    sets: exercise.sets || 3,
    reps: exercise.reps || '10',
    rest_seconds: exercise.restSeconds || 60,
    muscle_groups: exercise.muscleGroups || [],
    instructions: exercise.instructions || '',
    youtube_search_term: exercise.youtubeSearchTerm || exercise.name,
    equipment: exercise.equipment || 'bodyweight',
    difficulty: exercise.difficulty || 'beginner',
    order_number: exercise.orderNumber || index + 1,
    completed: false
  }));

  const { error: exerciseError } = await supabase
    .from('exercises')
    .insert(exercisesToInsert);

  if (exerciseError) {
    console.error('❌ Error creating exercises:', exerciseError);
    return 0;
  } else {
    console.log('✅ Created', exercisesToInsert.length, 'exercises');
    return exercisesToInsert.length;
  }
};
