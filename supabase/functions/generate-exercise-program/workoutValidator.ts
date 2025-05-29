
export const parseAIResponse = (content: string) => {
  try {
    console.log('🔍 Parsing AI response, content length:', content.length);
    
    // Clean the content - remove markdown formatting and extra whitespace
    let cleanedContent = content.trim();
    
    // Remove markdown code blocks if present
    if (cleanedContent.startsWith('```json') || cleanedContent.startsWith('```')) {
      cleanedContent = cleanedContent.replace(/^```(json)?\s*/, '');
      cleanedContent = cleanedContent.replace(/```\s*$/, '');
      cleanedContent = cleanedContent.trim();
    }
    
    // Find the JSON object boundaries
    const firstBrace = cleanedContent.indexOf('{');
    const lastBrace = cleanedContent.lastIndexOf('}');
    
    if (firstBrace === -1 || lastBrace === -1 || firstBrace >= lastBrace) {
      throw new Error('No valid JSON object found in response');
    }
    
    // Extract only the JSON part
    const jsonContent = cleanedContent.substring(firstBrace, lastBrace + 1);
    
    console.log('🧹 Cleaned content preview:', jsonContent.substring(0, 200) + '...');
    
    const parsed = JSON.parse(jsonContent);
    console.log('✅ Successfully parsed JSON response');
    return parsed;
  } catch (error) {
    console.error('❌ Failed to parse AI response:', error);
    console.error('📝 Raw content preview:', content.substring(0, 500));
    throw new Error(`Failed to parse AI response: ${error.message}`);
  }
};

export const validateWorkoutProgram = (program: any) => {
  console.log('🔍 Validating workout program structure...');
  
  if (!program) {
    throw new Error('No program data received from AI');
  }

  if (!program.programOverview) {
    throw new Error('Program overview is missing from AI response');
  }

  if (!program.weeks || !Array.isArray(program.weeks)) {
    throw new Error('Program weeks data is missing or invalid');
  }

  if (program.weeks.length === 0) {
    throw new Error('Program must have at least one week of workouts');
  }

  // Validate each week
  for (const week of program.weeks) {
    if (!week.workouts || !Array.isArray(week.workouts)) {
      throw new Error(`Week ${week.weekNumber || 'unknown'} is missing workouts array`);
    }

    if (week.workouts.length === 0) {
      console.log(`⚠️ Warning: Week ${week.weekNumber} has no workouts`);
      continue;
    }

    // Validate each workout
    for (const workout of week.workouts) {
      if (!workout.day || !workout.workoutName) {
        throw new Error(`Invalid workout structure in week ${week.weekNumber}`);
      }

      if (!workout.exercises || !Array.isArray(workout.exercises)) {
        console.log(`⚠️ Warning: Workout ${workout.workoutName} has no exercises`);
        continue;
      }

      // Validate exercises
      for (const exercise of workout.exercises) {
        if (!exercise.name) {
          throw new Error(`Exercise missing name in workout ${workout.workoutName}`);
        }
      }
    }
  }

  console.log('✅ Workout program validation completed successfully');
  return true;
};
