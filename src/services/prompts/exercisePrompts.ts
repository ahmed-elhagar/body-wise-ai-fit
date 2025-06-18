
import { PromptConfig } from './types';
import { getLanguageConfig } from './languageConfig';

export const createExerciseProgramPrompt = (
  userProfile: any,
  preferences: any,
  workoutType: 'home' | 'gym'
): PromptConfig => {
  const langConfig = getLanguageConfig(preferences?.userLanguage || 'en');
  
  const systemMessage = `You are a certified fitness trainer AI. Create safe, effective workout programs.
${langConfig.responseInstructions}
Always return valid JSON only - no markdown formatting.`;

  const userPrompt = `Create a comprehensive 1-week ${workoutType} workout program for:

USER PROFILE:
- Age: ${userProfile?.age || 25}, Gender: ${userProfile?.gender || 'not specified'}
- Weight: ${userProfile?.weight || 70}kg, Height: ${userProfile?.height || 170}cm
- Activity Level: ${userProfile?.activity_level || 'moderate'}
- Fitness Goal: ${preferences?.goalType || 'general fitness'}
- Fitness Level: ${preferences?.fitnessLevel || 'beginner'}
- Available Time: ${preferences?.availableTime || 45} minutes per session
- Health Conditions: ${userProfile?.health_conditions?.join(', ') || 'none'}

PROGRAM REQUIREMENTS:
- Create exactly 7 days (determine training vs rest days based on fitness level)
- Beginner: 3-4 training days, Intermediate: 4-5 training days, Advanced: 5-6 training days
- ${workoutType === 'gym' ? 'Use gym equipment (weights, machines, cables)' : 'Bodyweight exercises only'}
- ${workoutType === 'gym' ? '5-8 exercises per training day' : '4-7 exercises per training day'}
- Progressive difficulty based on fitness level
- Target different muscle groups
- Include warm-up and cool-down guidance
- Proper form instructions and safety notes`;

  const responseFormat = `{
  "programOverview": {
    "name": "program name",
    "duration": "1 week",
    "difficulty": "fitness level",
    "description": "program description"
  },
  "weeks": [{
    "weekNumber": 1,
    "workouts": [
      {
        "day": 1,
        "workoutName": "workout name",
        "estimatedDuration": number,
        "estimatedCalories": number,
        "muscleGroups": ["muscle1", "muscle2"],
        "exercises": [
          {
            "name": "exercise name",
            "sets": number,
            "reps": "reps",
            "restSeconds": number,
            "muscleGroups": ["muscle1"],
            "instructions": "detailed instructions",
            "youtubeSearchTerm": "search term",
            "equipment": "equipment needed",
            "difficulty": "difficulty level",
            "orderNumber": number
          }
        ]
      }
    ]
  }]
}`;

  return {
    systemMessage,
    userPrompt,
    responseFormat,
    temperature: 0.3,
    maxTokens: 4000
  };
};

export const createExerciseExchangePrompt = (
  originalExercise: any,
  reason: string,
  preferences: any,
  userLanguage: string = 'en'
): PromptConfig => {
  const langConfig = getLanguageConfig(userLanguage as 'en' | 'ar');
  
  const systemMessage = `You are a fitness expert AI. Provide suitable exercise alternatives that target the same muscle groups.
${langConfig.responseInstructions}
Always return valid JSON only - no markdown formatting.`;

  const userPrompt = `Find a suitable alternative for this exercise:

CURRENT EXERCISE:
- Name: ${originalExercise.name}
- Sets: ${originalExercise.sets || 3}
- Reps: ${originalExercise.reps || '12'}
- Equipment: ${originalExercise.equipment || 'bodyweight'}
- Muscle Groups: ${originalExercise.muscle_groups?.join(', ') || 'full body'}
- Instructions: ${originalExercise.instructions || 'No instructions'}

EXCHANGE REASON: ${reason}

AVAILABLE EQUIPMENT: ${preferences?.equipment?.join(', ') || 'any suitable equipment'}

REQUIREMENTS:
- Target the same muscle groups
- Match difficulty level
- Consider available equipment
- Address the exchange reason
- Maintain similar workout structure`;

  const responseFormat = `{
  "name": "exercise name",
  "sets": ${originalExercise.sets || 3},
  "reps": "${originalExercise.reps || '12'}",
  "rest_seconds": ${originalExercise.rest_seconds || 60},
  "muscle_groups": ${JSON.stringify(originalExercise.muscle_groups || ['full_body'])},
  "equipment": "required equipment",
  "difficulty": "${originalExercise.difficulty || 'intermediate'}",
  "instructions": "detailed instructions",
  "youtube_search_term": "search term for tutorial"
}`;

  return {
    systemMessage,
    userPrompt,
    responseFormat,
    temperature: 0.7,
    maxTokens: 1000
  };
};
