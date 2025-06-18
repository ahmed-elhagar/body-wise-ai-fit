
// Edge function compatible prompt service
export interface PromptConfig {
  systemMessage: string;
  userPrompt: string;
  responseFormat: string;
  temperature?: number;
  maxTokens?: number;
}

export interface LanguageConfig {
  language: string;
  isRTL: boolean;
  responseInstructions: string;
}

// Language configurations for edge functions
export const getLanguageConfig = (language: string): LanguageConfig => {
  const configs: Record<string, LanguageConfig> = {
    'ar': {
      language: 'Arabic',
      isRTL: true,
      responseInstructions: 'Respond with all text content, names, instructions, and descriptions in Arabic. Use Arabic names for exercises, foods, and measurements.'
    },
    'en': {
      language: 'English',
      isRTL: false,
      responseInstructions: 'Respond with all text content in English.'
    }
  };
  
  return configs[language] || configs['en'];
};

// Simplified prompt creators for edge functions
export const createMealPlanPrompt = (userProfile: any, preferences: any, dailyCalories: number): PromptConfig => {
  const langConfig = getLanguageConfig(preferences?.language || 'en');
  const includeSnacks = preferences?.includeSnacks || false;
  const mealsPerDay = includeSnacks ? 5 : 3;
  
  const systemMessage = `You are a professional nutritionist AI. Create personalized meal plans based on user data. 
CRITICAL: Generate EXACTLY 7 days of meals. Each day must have exactly ${mealsPerDay} meals.
${langConfig.responseInstructions}
Always return valid JSON only - no markdown formatting.`;

  const userPrompt = `Create a comprehensive 7-day meal plan for:

USER PROFILE:
- Age: ${userProfile?.age || 25}, Gender: ${userProfile?.gender || 'not specified'}
- Weight: ${userProfile?.weight || 70}kg, Height: ${userProfile?.height || 170}cm
- Activity Level: ${userProfile?.activity_level || 'moderate'}
- Daily Calorie Target: ${dailyCalories} calories
- Nationality: ${userProfile?.nationality || 'International'}

PREFERENCES:
- Cuisine Types: ${preferences?.cuisineTypes?.join(', ') || 'mixed'}
- Dietary Restrictions: ${preferences?.dietaryRestrictions?.join(', ') || 'none'}
- Allergies: ${preferences?.allergies?.join(', ') || 'none'}
- Max Prep Time: ${preferences?.maxPrepTime || 30} minutes
- Include Snacks: ${includeSnacks ? 'Yes (5 meals/day)' : 'No (3 meals/day)'}`;

  const responseFormat = `{
  "days": [
    {
      "day": 1,
      "meals": [
        {
          "type": "breakfast",
          "name": "meal name",
          "calories": number,
          "protein": number,
          "carbs": number,
          "fat": number,
          "prep_time": number,
          "cook_time": number,
          "servings": number,
          "ingredients": ["ingredient 1", "ingredient 2"],
          "instructions": ["step 1", "step 2"],
          "alternatives": ["alternative 1", "alternative 2"]
        }
      ]
    }
  ]
}`;

  return { systemMessage, userPrompt, responseFormat, temperature: 0.7, maxTokens: 4000 };
};
