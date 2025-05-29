
import { addDays, format, startOfWeek } from 'https://esm.sh/date-fns@3.6.0';

export const deleteExistingPrograms = async (
  supabase: any,
  userId: string,
  workoutType: string,
  weekStartDate: string
) => {
  console.log('🧹 Cleaning up existing programs for user:', userId.substring(0, 8) + '...', 'week:', weekStartDate, 'type:', workoutType);
  
  try {
    // Get all existing programs to delete with better error handling
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
      
      const programIds = existingPrograms.map(p => p.id);
      
      // Get all workouts for these programs
      const { data: workouts, error: workoutFetchError } = await supabase
        .from('daily_workouts')
        .select('id')
        .in('weekly_program_id', programIds);
        
      if (!workoutFetchError && workouts && workouts.length > 0) {
        const workoutIds = workouts.map(w => w.id);
        console.log('🗑️ Deleting', workoutIds.length, 'workouts and their exercises');
        
        // Delete all exercises for these workouts first
        const { error: exerciseDeleteError } = await supabase
          .from('exercises')
          .delete()
          .in('daily_workout_id', workoutIds);
          
        if (exerciseDeleteError) {
          console.error('❌ Error deleting exercises:', exerciseDeleteError);
          throw new Error('Failed to delete exercises: ' + exerciseDeleteError.message);
        } else {
          console.log('✅ Deleted exercises for workouts');
        }
        
        // Delete all workouts
        const { error: workoutDeleteError } = await supabase
          .from('daily_workouts')
          .delete()
          .in('weekly_program_id', programIds);
          
        if (workoutDeleteError) {
          console.error('❌ Error deleting workouts:', workoutDeleteError);
          throw new Error('Failed to delete workouts: ' + workoutDeleteError.message);
        } else {
          console.log('✅ Deleted workouts for programs');
        }
      }
      
      // Finally delete the programs
      const { error: programDeleteError } = await supabase
        .from('weekly_exercise_programs')
        .delete()
        .in('id', programIds);
        
      if (programDeleteError) {
        console.error('❌ Error deleting programs:', programDeleteError);
        throw new Error('Failed to delete existing programs: ' + programDeleteError.message);
      } else {
        console.log('✅ Deleted', programIds.length, 'programs');
      }
    } else {
      console.log('📭 No existing programs found to delete');
    }
  } catch (error) {
    console.error('❌ Error in deleteExistingPrograms:', error);
    throw error;
  }
};

export const createWeeklyProgram = async (
  supabase: any,
  generatedProgram: any,
  userData: any,
  preferences: any,
  weekStartDate: string,
  workoutType: string
) => {
  console.log('🆕 Creating new program...');
  
  try {
    const { data: weeklyProgram, error: weeklyError } = await supabase
      .from('weekly_exercise_programs')
      .insert({
        user_id: userData.userId,
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
    return weeklyProgram;
  } catch (error) {
    console.error('❌ Error in createWeeklyProgram:', error);
    throw error;
  }
};
