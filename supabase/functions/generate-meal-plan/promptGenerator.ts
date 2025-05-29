
import { MEAL_PLAN_PROMPTS } from '../../../src/utils/promptTemplates.ts';

interface UserProfile {
  age?: number;
  gender?: string;
  weight?: number;
  height?: number;
  fitness_goal?: string;
  activity_level?: string;
  nationality?: string;
  allergies?: string[];
  dietary_restrictions?: string[];
}

interface Preferences {
  cuisine?: string;
  maxPrepTime?: string;
  duration?: string;
  mealTypes?: string;
  includeSnacks?: boolean;
}

export const generateMealPlanPrompt = (userProfile: UserProfile, preferences: Preferences, dailyCalories: number, includeSnacks: boolean = true): string => {
  const nationality = userProfile?.nationality || 'international';
  const allergies = userProfile?.allergies?.length ? userProfile.allergies.join(', ') : 'None';
  const restrictions = userProfile?.dietary_restrictions?.length ? userProfile.dietary_restrictions.join(', ') : 'None';
  const maxPrepTime = parseInt(preferences?.maxPrepTime || '45');
  
  const selectedCuisine = preferences?.cuisine || 'mixed';
  const cuisine = selectedCuisine === 'mixed' ? `${nationality} cuisine` : selectedCuisine;
  
  const totalMeals = includeSnacks ? 35 : 21;
  const mealsPerDay = includeSnacks ? 5 : 3;

  // Use DRY prompt templates
  const systemPrompt = MEAL_PLAN_PROMPTS.SYSTEM_BASE
    .replace('{totalMeals}', totalMeals.toString());

  const skeletonInstructions = MEAL_PLAN_PROMPTS.SKELETON_ONLY
    .replace('{nationality}', nationality)
    .replace('{maxPrepTime}', maxPrepTime.toString());

  const distributionPrompt = includeSnacks 
    ? MEAL_PLAN_PROMPTS.SNACK_DISTRIBUTION
        .replace('{breakfast}', Math.round(dailyCalories * 0.25).toString())
        .replace('{lunch}', Math.round(dailyCalories * 0.35).toString())
        .replace('{dinner}', Math.round(dailyCalories * 0.30).toString())
        .replace('{snack1}', Math.round(dailyCalories * 0.05).toString())
        .replace('{snack2}', Math.round(dailyCalories * 0.05).toString())
    : MEAL_PLAN_PROMPTS.NO_SNACK_DISTRIBUTION
        .replace('{breakfast}', Math.round(dailyCalories * 0.30).toString())
        .replace('{lunch}', Math.round(dailyCalories * 0.40).toString())
        .replace('{dinner}', Math.round(dailyCalories * 0.30).toString());

  console.log(`🍽️ PROMPT GENERATION: includeSnacks=${includeSnacks}, totalMeals=${totalMeals}, mealsPerDay=${mealsPerDay}`);

  return `${systemPrompt} ${skeletonInstructions}

USER PROFILE:
- Age: ${userProfile?.age}, Gender: ${userProfile?.gender}
- Weight: ${userProfile?.weight}kg, Height: ${userProfile?.height}cm
- Goal: ${userProfile?.fitness_goal}, Activity: ${userProfile?.activity_level}
- Nationality: ${nationality}
- Allergies: ${allergies}
- Dietary Restrictions: ${restrictions}
- Daily Calorie Target: ${dailyCalories}

PREFERENCES:
- Cuisine: ${cuisine}
- Max Prep Time: ${maxPrepTime} minutes per meal
- Include Snacks: ${includeSnacks ? 'Yes' : 'No'}

CRITICAL REQUIREMENTS:
1. EXACTLY 7 days starting from Saturday (day 1) to Friday (day 7)
2. EXACTLY ${mealsPerDay} meals per day: ${includeSnacks ? 'breakfast, lunch, dinner, snack, snack' : 'breakfast, lunch, dinner'}
3. Total meals: ${totalMeals} (no more, no less)
4. Return ONLY valid JSON - no markdown or code blocks
5. All nutritional values must be numbers (not strings)
6. BASIC meal info only - no detailed ingredients, instructions, or cooking details
7. Consider allergies and dietary restrictions
8. Realistic prep times ≤ ${maxPrepTime} minutes
9. Use ONLY these meal types: breakfast, lunch, dinner${includeSnacks ? ', snack' : ''}

${distributionPrompt}

Return this EXACT JSON structure with BASIC meal info only:

{
  "weekSummary": {
    "totalCalories": ${dailyCalories * 7},
    "avgDailyCalories": ${dailyCalories},
    "totalProtein": ${Math.round(dailyCalories * 7 * 0.15 / 4)},
    "totalCarbs": ${Math.round(dailyCalories * 7 * 0.50 / 4)},
    "totalFat": ${Math.round(dailyCalories * 7 * 0.35 / 9)},
    "dietType": "${userProfile?.fitness_goal === 'weight_loss' ? 'Weight Loss' : userProfile?.fitness_goal === 'muscle_gain' ? 'Muscle Building' : 'Balanced Nutrition'}",
    "includeSnacks": ${includeSnacks},
    "maxPrepTime": ${maxPrepTime},
    "cuisine": "${cuisine}"
  },
  "days": [
    {
      "dayNumber": 1,
      "dayName": "Saturday",
      "totalCalories": ${dailyCalories},
      "meals": [
        {
          "type": "breakfast",
          "name": "Traditional ${cuisine} Breakfast",
          "calories": ${Math.round(dailyCalories * (includeSnacks ? 0.25 : 0.30))},
          "protein": 25,
          "carbs": 45,
          "fat": 15,
          "fiber": 8,
          "sugar": 12,
          "description": "Nutritious ${cuisine} breakfast to start your day",
          "prepTime": ${Math.min(Math.floor(maxPrepTime * 0.4), 15)},
          "cookTime": ${Math.min(Math.floor(maxPrepTime * 0.6), maxPrepTime - 15)},
          "servings": 1,
          "cuisine": "${cuisine}",
          "difficulty": "easy"
        }${includeSnacks ? `,
        {
          "type": "snack",
          "name": "Healthy ${cuisine} Snack",
          "calories": ${Math.round(dailyCalories * 0.05)},
          "protein": 3,
          "carbs": 8,
          "fat": 2,
          "fiber": 2,
          "sugar": 3,
          "description": "Light and healthy snack",
          "prepTime": 5,
          "cookTime": 0,
          "servings": 1,
          "cuisine": "${cuisine}",
          "difficulty": "easy"
        },
        {
          "type": "snack", 
          "name": "Another Healthy ${cuisine} Snack",
          "calories": ${Math.round(dailyCalories * 0.05)},
          "protein": 3,
          "carbs": 8,
          "fat": 2,
          "fiber": 2,
          "sugar": 3,
          "description": "Light and healthy evening snack",
          "prepTime": 5,
          "cookTime": 0,
          "servings": 1,
          "cuisine": "${cuisine}",
          "difficulty": "easy"
        }` : ''}
      ]
    }
  ]
}

Generate all 7 days following this pattern. Each day must have exactly ${mealsPerDay} meals with the specified types. Focus on authentic ${cuisine} while meeting nutritional requirements and avoiding allergens. Keep it SIMPLE - detailed recipes will be fetched separately when needed.`;
};
