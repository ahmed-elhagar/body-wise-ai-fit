
import { storeExercises } from './exerciseOperations.ts';

export const storeDailyWorkout = async (supabase: any, workout: any, weeklyProgramId: string) => {
  // Skip rest days - they'll be handled by the frontend
  if (workout.isRestDay || !workout.exercises || workout.exercises.length === 0) {
    console.log(`Skipping workout ${workout.workoutName || 'Unknown'} - no exercises`);
    return null;
  }

  try {
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

    console.log('✅ Created daily workout:', dailyWorkout.workout_name, 'for day', workout.day);

    // Store exercises for this workout
    const exerciseCount = await storeExercises(supabase, workout.exercises, dailyWorkout.id);
    
    return { exerciseCount };
  } catch (error) {
    console.error('❌ Error in storeDailyWorkout:', error);
    return null;
  }
};

export const storeWorkoutPrograms = async (
  supabase: any,
  generatedProgram: any,
  weeklyProgramId: string
) => {
  let totalWorkoutsCreated = 0;
  let totalExercisesCreated = 0;

  for (const week of generatedProgram.weeks) {
    if (!week.workouts || !Array.isArray(week.workouts)) {
      console.log('Warning: Week has no workouts array');
      continue;
    }

    for (const workout of week.workouts) {
      const result = await storeDailyWorkout(supabase, workout, weeklyProgramId);
      if (result) {
        totalWorkoutsCreated++;
        totalExercisesCreated += result.exerciseCount;
      }
    }
  }

  console.log(`✅ Program creation complete! Created ${totalWorkoutsCreated} workouts with ${totalExercisesCreated} exercises`);
  
  return {
    totalWorkoutsCreated,
    totalExercisesCreated
  };
};
