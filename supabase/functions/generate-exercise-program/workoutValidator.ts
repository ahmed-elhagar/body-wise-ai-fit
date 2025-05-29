
export const parseAIResponse = (content: string) => {
  try {
    console.log('Raw content:', content);
    
    // Clean the content - remove markdown formatting and extra whitespace
    let cleanedContent = content.trim();
    
    // Remove markdown code blocks if present
    if (cleanedContent.startsWith('```json') || cleanedContent.startsWith('```')) {
      cleanedContent = cleanedContent.replace(/^```(json)?\s*/, '');
      cleanedContent = cleanedContent.replace(/```\s*$/, '');
    }
    
    // Remove any trailing incomplete text that might cause JSON parsing issues
    const lastBraceIndex = cleanedContent.lastIndexOf('}');
    if (lastBraceIndex !== -1) {
      cleanedContent = cleanedContent.substring(0, lastBraceIndex + 1);
    }
    
    console.log('Cleaned content length:', cleanedContent.length);
    console.log('Cleaned content preview:', cleanedContent.substring(0, 500));
    
    const parsed = JSON.parse(cleanedContent);
    console.log('Successfully parsed JSON');
    return parsed;
  } catch (error) {
    console.error('Failed to parse OpenAI response:', error);
    console.error('Content that failed to parse:', content.substring(0, 1000));
    throw new Error('Failed to parse AI response. Please try again.');
  }
};

export const validateWorkoutProgram = (program: any) => {
  console.log('Validating workout program...');
  
  if (!program) {
    throw new Error('No program data received');
  }

  if (!program.programOverview) {
    throw new Error('Program overview is missing');
  }

  if (!program.weeks || !Array.isArray(program.weeks)) {
    throw new Error('Program weeks data is missing or invalid');
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
        console.log(`Warning: Workout ${workout.workoutName} has no exercises`);
      }
    }
  }

  console.log('Workout program validation passed');
  return true;
};
