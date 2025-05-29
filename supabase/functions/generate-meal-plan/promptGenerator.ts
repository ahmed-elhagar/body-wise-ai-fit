
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
  const cuisine = preferences?.cuisine || `${nationality} cuisine`;
  
  const mealTypes = includeSnacks 
    ? 'breakfast, lunch, dinner, snack1, snack2' 
    : 'breakfast, lunch, dinner';
  
  const totalMeals = includeSnacks ? 35 : 21;
  const mealsPerDay = includeSnacks ? 5 : 3;

  return `You are a professional nutritionist specializing in ${cuisine}. Create a complete 7-day meal plan with EXACTLY ${totalMeals} meals (${mealsPerDay} meals per day for 7 days).

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
- Focus: Authentic ${cuisine} dishes with proper nutrition

CRITICAL REQUIREMENTS:
1. EXACTLY 7 days starting from Saturday (day 1) to Friday (day 7)
2. EXACTLY ${mealsPerDay} meals per day: ${mealTypes}
3. Total meals: ${totalMeals} (no more, no less)
4. Return ONLY valid JSON - no markdown or code blocks
5. All nutritional values must be numbers (not strings)
6. Each meal prep time must be ≤ ${maxPrepTime} minutes
7. Include detailed ingredients with measurements
8. Provide comprehensive cooking instructions
9. Consider allergies and dietary restrictions
10. Include realistic YouTube search terms for each meal
11. Provide detailed descriptions for AI image generation

${includeSnacks ? `
MEAL DISTRIBUTION WITH SNACKS:
- Breakfast: ${Math.round(dailyCalories * 0.25)} calories (≤ ${maxPrepTime} min prep)
- Lunch: ${Math.round(dailyCalories * 0.35)} calories (≤ ${maxPrepTime} min prep)
- Dinner: ${Math.round(dailyCalories * 0.30)} calories (≤ ${maxPrepTime} min prep)
- Snack1: ${Math.round(dailyCalories * 0.05)} calories (≤ 10 min prep)
- Snack2: ${Math.round(dailyCalories * 0.05)} calories (≤ 10 min prep)
` : `
MEAL DISTRIBUTION WITHOUT SNACKS:
- Breakfast: ${Math.round(dailyCalories * 0.30)} calories (≤ ${maxPrepTime} min prep)
- Lunch: ${Math.round(dailyCalories * 0.40)} calories (≤ ${maxPrepTime} min prep)
- Dinner: ${Math.round(dailyCalories * 0.30)} calories (≤ ${maxPrepTime} min prep)
`}

Return this EXACT JSON structure:

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
          "imagePrompt": "Professional food photography of [meal name], beautifully plated, natural lighting, appetizing presentation, ${cuisine} style",
          "ingredients": [
            {
              "name": "main ingredient",
              "quantity": "100",
              "unit": "g",
              "calories": 150,
              "protein": 12,
              "carbs": 20,
              "fat": 5
            }
          ],
          "instructions": [
            "Step 1: Detailed preparation with timing (${Math.floor(maxPrepTime * 0.3)} min)",
            "Step 2: Cooking method with temperature (${Math.floor(maxPrepTime * 0.6)} min)",
            "Step 3: Plating and serving suggestions (${Math.floor(maxPrepTime * 0.1)} min)"
          ],
          "prepTime": ${Math.min(Math.floor(maxPrepTime * 0.4), 10)},
          "cookTime": ${Math.min(Math.floor(maxPrepTime * 0.6), maxPrepTime - 10)},
          "servings": 1,
          "youtubeSearchTerm": "${cuisine} breakfast recipe how to make",
          "cuisine": "${cuisine}",
          "difficulty": "easy",
          "tips": "Chef tips for best results within ${maxPrepTime} minutes",
          "nutritionBenefits": "Health benefits of key ingredients",
          "culturalInfo": "Cultural significance and variations"
        }${includeSnacks ? `,
        {
          "type": "snack1",
          "name": "Healthy ${cuisine} Snack",
          "calories": ${Math.round(dailyCalories * 0.05)},
          "protein": 3,
          "carbs": 8,
          "fat": 2,
          "fiber": 2,
          "sugar": 3,
          "description": "Light and healthy snack",
          "imagePrompt": "Professional food photography of healthy snack, beautifully presented, ${cuisine} style",
          "ingredients": [...],
          "instructions": ["Quick preparation in 5 minutes"],
          "prepTime": 5,
          "cookTime": 0,
          "servings": 1,
          "youtubeSearchTerm": "healthy ${cuisine} snack recipe",
          "cuisine": "${cuisine}",
          "difficulty": "easy"
        },
        {
          "type": "snack2",
          "name": "Another Healthy ${cuisine} Snack",
          "calories": ${Math.round(dailyCalories * 0.05)},
          "protein": 3,
          "carbs": 8,
          "fat": 2,
          "fiber": 2,
          "sugar": 3,
          "description": "Light and healthy evening snack",
          "imagePrompt": "Professional food photography of healthy snack, beautifully presented, ${cuisine} style",
          "ingredients": [...],
          "instructions": ["Quick preparation in 5 minutes"],
          "prepTime": 5,
          "cookTime": 0,
          "servings": 1,
          "youtubeSearchTerm": "healthy ${cuisine} evening snack",
          "cuisine": "${cuisine}",
          "difficulty": "easy"
        }` : ''}
      ]
    }
  ]
}

Generate all 7 days following this pattern. Each day must have exactly ${mealsPerDay} meals with the specified types. Focus on authentic ${cuisine} while meeting nutritional requirements, prep time constraints (≤ ${maxPrepTime} min), and avoiding allergens. Make sure YouTube search terms are specific and likely to return actual cooking videos.`;
};
