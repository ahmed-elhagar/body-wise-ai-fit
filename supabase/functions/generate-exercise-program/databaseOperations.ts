
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
    // Delete existing programs for this user, week, and workout type
    await deleteExistingPrograms(supabase, userId, workoutType, weekStartDate);

    // Small delay to ensure database consistency
    await new Promise(resolve => setTimeout(resolve, 200));

    // Create new weekly program record
    const weeklyProgram = await createWeeklyProgram(
      supabase, 
      generatedProgram, 
      userData, 
      preferences, 
      weekStartDate, 
      workoutType
    );

    // Store daily workouts and exercises
    const result = await storeWorkoutPrograms(supabase, generatedProgram, weeklyProgram.id);
    
    console.log('✅ Program storage complete:', {
      programId: weeklyProgram.id,
      workoutsCreated: result.totalWorkoutsCreated,
      exercisesCreated: result.totalExercisesCreated
    });

    return weeklyProgram;
    
  } catch (error) {
    console.error('❌ Error in storeWorkoutProgram:', error);
    throw error;
  }
};
