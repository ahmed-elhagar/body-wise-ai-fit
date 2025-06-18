
import { PromptConfig } from './types';
import { getLanguageConfig } from './languageConfig';

export const createFoodAnalysisPrompt = (userLanguage: string = 'en'): PromptConfig => {
  const langConfig = getLanguageConfig(userLanguage as 'en' | 'ar');
  
  const systemMessage = `You are a nutrition analysis expert. Analyze food images and provide accurate nutritional information.
${langConfig.responseInstructions}
Always return valid JSON only - no markdown formatting.`;

  const userPrompt = `Analyze this food image and identify all food items with their nutritional information.

ANALYSIS REQUIREMENTS:
- Identify 1-5 main food items
- Estimate serving sizes based on visual cues
- Provide nutrition values per 100g
- Use appropriate food categories
- Make realistic estimates for calories and macros
- Consider preparation methods (fried, grilled, etc.)`;

  const responseFormat = `{
  "foodItems": [
    {
      "name": "food name",
      "category": "protein|vegetables|fruits|grains|dairy|nuts|beverages|snacks|general",
      "cuisine": "cuisine type",
      "calories": number_per_100g,
      "protein": number_per_100g,
      "carbs": number_per_100g,
      "fat": number_per_100g,
      "fiber": number_per_100g,
      "sugar": number_per_100g,
      "quantity": "estimated serving description"
    }
  ],
  "overallConfidence": 0.8,
  "cuisineType": "cuisine",
  "suggestions": "brief analysis"
}`;

  return {
    systemMessage,
    userPrompt,
    responseFormat,
    temperature: 0.1,
    maxTokens: 1000
  };
};
