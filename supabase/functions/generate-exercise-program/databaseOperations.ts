
import { addDays, format, startOfWeek } from 'https://esm.sh/date-fns@3.6.0';
import { deleteExistingPrograms, createWeeklyProgram } from './weeklyProgramOperations.ts';
import { storeWorkoutPrograms } from './workoutOperations.ts';

export const storeWorkoutProgram = async (
  supabase: any,
  generatedProgram: any,
  userData: any,
  preferences: any
) => {
  const userId = userData?.userId;
  if (!userId) {
    throw new Error('User ID is required for program storage');
  }

  const workoutType = preferences?.workoutType || 'home';
  
  // Calculate week start date with proper handling
  let weekStartDate;
  if (preferences?.weekStartDate) {
    weekStartDate = preferences.weekStartDate;
  } else if (preferences?.weekOffset !== undefined) {
    const currentWeekStart = startOfWeek(new Date());
    weekStartDate = format(addDays(currentWeekStart, preferences.weekOffset * 7), 'yyyy-MM-dd');
  } else {
    weekStartDate = format(startOfWeek(new Date()), 'yyyy-MM-dd');
  }
  
  console.log('🗄️ Starting workout program storage:', {
    workoutType,
    weekStartDate,
    weekOffset: preferences?.weekOffset,
    userId: userId.substring(0, 8) + '...',
    programName: generatedProgram?.programOverview?.name
  });

  try {
    // Delete existing programs for this user, week, and workout type with enhanced cleanup
    await deleteExistingPrograms(supabase, userId, workoutType, weekStartDate);

    // Wait for database consistency
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Create new weekly program record with enhanced data
    const weeklyProgram = await createWeeklyProgram(
      supabase, 
      generatedProgram, 
      userData, 
      preferences, 
      weekStartDate, 
      workoutType
    );

    if (!weeklyProgram || !weeklyProgram.id) {
      throw new Error('Failed to create weekly program record');
    }

    console.log('✅ Weekly program created:', weeklyProgram.id);

    // Store daily workouts and exercises with improved error handling
    const result = await storeWorkoutPrograms(supabase, generatedProgram, weeklyProgram.id);
    
    console.log('🎉 Program storage completed successfully:', {
      programId: weeklyProgram.id,
      programName: weeklyProgram.program_name,
      workoutsCreated: result.totalWorkoutsCreated,
      exercisesCreated: result.totalExercisesCreated,
      workoutType,
      weekStartDate
    });

    return {
      ...weeklyProgram,
      workoutsCreated: result.totalWorkoutsCreated,
      exercisesCreated: result.totalExercisesCreated
    };
    
  } catch (error) {
    console.error('❌ Critical error in storeWorkoutProgram:', error);
    
    // Enhanced cleanup on error
    try {
      console.log('🧹 Attempting cleanup after error...');
      await deleteExistingPrograms(supabase, userId, workoutType, weekStartDate);
      console.log('✅ Cleanup completed successfully');
    } catch (cleanupError) {
      console.error('⚠️ Failed to clean up after error:', cleanupError);
    }
    
    throw new Error(`Database storage failed: ${error.message}`);
  }
};
