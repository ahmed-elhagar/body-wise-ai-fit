
export const validateWorkoutProgram = (generatedProgram: any): void => {
  if (!generatedProgram.weeks || !Array.isArray(generatedProgram.weeks)) {
    throw new Error('Invalid exercise program structure received from AI');
  }

  // Validate program overview
  if (!generatedProgram.programOverview) {
    throw new Error('Program overview is missing');
  }

  // Validate each week
  for (const week of generatedProgram.weeks) {
    if (!week.workouts || !Array.isArray(week.workouts)) {
      throw new Error(`Invalid workouts structure in week ${week.weekNumber}`);
    }

    // Validate each workout
    for (const workout of week.workouts) {
      if (!workout.exercises || !Array.isArray(workout.exercises)) {
        throw new Error(`Invalid exercises structure in workout ${workout.workoutName}`);
      }

      // Validate each exercise
      for (const exercise of workout.exercises) {
        if (!exercise.name || !exercise.sets || !exercise.reps) {
          throw new Error(`Invalid exercise structure: ${exercise.name || 'Unknown exercise'}`);
        }
      }
    }
  }
};

export const parseAIResponse = (content: string): any => {
  try {
    // Clean the response to ensure it's valid JSON
    const cleanedContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    return JSON.parse(cleanedContent);
  } catch (parseError) {
    console.error('Failed to parse OpenAI response:', parseError);
    console.error('Raw content:', content);
    throw new Error('Failed to parse AI response. Please try again.');
  }
};
