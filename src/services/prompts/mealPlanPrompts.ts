
import { PromptConfig } from './types';
import { getLanguageConfig } from './languageConfig';

export const createMealPlanPrompt = (
  userProfile: any,
  preferences: any,
  dailyCalories: number
): PromptConfig => {
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
- Include Snacks: ${includeSnacks ? 'Yes (5 meals/day)' : 'No (3 meals/day)'}

REQUIREMENTS:
- Generate exactly 7 days starting from Saturday
- Each day must have exactly ${mealsPerDay} meals
- Meal types: ${includeSnacks ? 'breakfast, snack, lunch, snack, dinner' : 'breakfast, lunch, dinner'}
- All nutrition values per 100g
- Realistic prep and cook times
- Cultural authenticity for specified cuisine`;

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

  return {
    systemMessage,
    userPrompt,
    responseFormat,
    temperature: 0.7,
    maxTokens: 4000
  };
};
