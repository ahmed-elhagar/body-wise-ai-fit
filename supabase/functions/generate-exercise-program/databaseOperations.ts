
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

  try {
    // First, delete ALL existing programs for this user, week, and workout type
    console.log('🧹 Cleaning up existing programs for user:', userId.substring(0, 8) + '...', 'week:', weekStartDate, 'type:', workoutType);
    
    // Get all existing programs to delete
    const { data: existingPrograms, error: fetchError } = await supabase
      .from('weekly_exercise_programs')
      .select('id')
      .eq('user_id', userId)
      .eq('workout_type', workoutType)
      .eq('week_start_date', weekStartDate);

    if (fetchError) {
      console.error('❌ Error fetching existing programs:', fetchError);
      throw new Error('Failed to fetch existing programs: ' + fetchError.message);
    }

    if (existingPrograms && existingPrograms.length > 0) {
      console.log('🔄 Found', existingPrograms.length, 'existing programs to delete');
      
      for (const program of existingPrograms) {
        console.log('🗑️ Deleting program:', program.id);
        
        // Get all workouts for this program
        const { data: workouts, error: workoutFetchError } = await supabase
          .from('daily_workouts')
          .select('id')
          .eq('weekly_program_id', program.id);
          
        if (!workoutFetchError && workouts && workouts.length > 0) {
          const workoutIds = workouts.map(w => w.id);
          console.log('🗑️ Deleting', workoutIds.length, 'workouts');
          
          // Delete all exercises for these workouts
          const { error: exerciseDeleteError } = await supabase
            .from('exercises')
            .delete()
            .in('daily_workout_id', workoutIds);
            
          if (exerciseDeleteError) {
            console.error('❌ Error deleting exercises:', exerciseDeleteError);
          } else {
            console.log('✅ Deleted exercises for workouts');
          }
          
          // Delete all workouts
          const { error: workoutDeleteError } = await supabase
            .from('daily_workouts')
            .delete()
            .eq('weekly_program_id', program.id);
            
          if (workoutDeleteError) {
            console.error('❌ Error deleting workouts:', workoutDeleteError);
          } else {
            console.log('✅ Deleted workouts for program');
          }
        }
        
        // Finally delete the program
        const { error: programDeleteError } = await supabase
          .from('weekly_exercise_programs')
          .delete()
          .eq('id', program.id);
          
        if (programDeleteError) {
          console.error('❌ Error deleting program:', programDeleteError);
          throw new Error('Failed to delete existing program: ' + programDeleteError.message);
        } else {
          console.log('✅ Deleted program:', program.id);
        }
      }
    } else {
      console.log('📭 No existing programs found to delete');
    }

    // Small delay to ensure database consistency
    await new Promise(resolve => setTimeout(resolve, 100));

    // Create new weekly program record
    console.log('🆕 Creating new program...');
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

    console.log('✅ Created weekly program:', weeklyProgram.program_name, 'ID:', weeklyProgram.id);

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

    console.log(`✅ Program creation complete! Created ${totalWorkoutsCreated} workouts with ${totalExercisesCreated} exercises`);

    return weeklyProgram;
    
  } catch (error) {
    console.error('❌ Error in storeWorkoutProgram:', error);
    throw error;
  }
};

const storeDailyWorkout = async (supabase: any, workout: any, weeklyProgramId: string) => {
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

const storeExercises = async (supabase: any, exercises: any[], dailyWorkoutId: string) => {
  if (!exercises || exercises.length === 0) {
    return 0;
  }

  try {
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
  } catch (error) {
    console.error('❌ Error in storeExercises:', error);
    return 0;
  }
};
