
export const parseAIResponse = (content: string) => {
  console.log('Raw content:', content);
  
  try {
    // Clean the content - remove markdown code blocks if present
    let cleanContent = content.trim();
    
    // Remove markdown code blocks
    if (cleanContent.startsWith('```json')) {
      cleanContent = cleanContent.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    } else if (cleanContent.startsWith('```')) {
      cleanContent = cleanContent.replace(/^```\s*/, '').replace(/\s*```$/, '');
    }
    
    // Find JSON content between braces if it's embedded in text
    const jsonMatch = cleanContent.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      cleanContent = jsonMatch[0];
    }
    
    console.log('Cleaned content length:', cleanContent.length);
    console.log('Cleaned content preview:', cleanContent.substring(0, 500));
    
    const parsed = JSON.parse(cleanContent);
    console.log('Successfully parsed JSON');
    return parsed;
  } catch (error) {
    console.error('Failed to parse OpenAI response:', error);
    console.error('Content that failed to parse:', content.substring(0, 1000));
    throw new Error('Failed to parse AI response. Please try again.');
  }
};

export const validateWorkoutProgram = (program: any) => {
  console.log('Validating workout program:', program);
  
  if (!program) {
    throw new Error('Program is null or undefined');
  }

  if (!program.programOverview) {
    throw new Error('Program overview is missing');
  }

  if (!program.weeks || !Array.isArray(program.weeks)) {
    throw new Error('Program weeks are missing or invalid');
  }

  if (program.weeks.length === 0) {
    throw new Error('Program must have at least one week');
  }

  // Validate each week
  for (const week of program.weeks) {
    if (!week.workouts || !Array.isArray(week.workouts)) {
      throw new Error(`Week ${week.weekNumber} is missing workouts`);
    }

    // Validate each workout
    for (const workout of week.workouts) {
      if (!workout.exercises || !Array.isArray(workout.exercises)) {
        throw new Error(`Workout on day ${workout.day} is missing exercises`);
      }

      if (workout.exercises.length === 0) {
        throw new Error(`Workout on day ${workout.day} has no exercises`);
      }

      // Validate each exercise
      for (const exercise of workout.exercises) {
        if (!exercise.name) {
          throw new Error('Exercise is missing name');
        }
        if (!exercise.sets) {
          throw new Error(`Exercise ${exercise.name} is missing sets`);
        }
        if (!exercise.reps) {
          throw new Error(`Exercise ${exercise.name} is missing reps`);
        }
      }
    }
  }

  console.log('Workout program validation passed');
  return true;
};
