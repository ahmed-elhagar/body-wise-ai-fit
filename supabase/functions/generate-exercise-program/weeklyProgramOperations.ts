
import { addDays, format, startOfWeek } from 'https://esm.sh/date-fns@3.6.0';

export const deleteExistingPrograms = async (
  supabase: any,
  userId: string,
  workoutType: string,
  weekStartDate: string
) => {
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
};
