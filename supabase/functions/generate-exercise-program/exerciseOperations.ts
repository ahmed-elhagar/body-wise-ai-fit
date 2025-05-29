
export const storeExercises = async (supabase: any, exercises: any[], dailyWorkoutId: string) => {
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
