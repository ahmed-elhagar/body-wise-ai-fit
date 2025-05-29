
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
}

export const generateMealPlanPrompt = (userProfile: UserProfile, preferences: Preferences, dailyCalories: number): string => {
  const nationality = userProfile?.nationality || 'international';
  const allergies = userProfile?.allergies?.length ? userProfile.allergies.join(', ') : 'None';
  const restrictions = userProfile?.dietary_restrictions?.length ? userProfile.dietary_restrictions.join(', ') : 'None';
  
  return `You are a professional nutritionist specializing in ${nationality} cuisine. Create a complete 7-day meal plan with EXACTLY 35 meals (5 meals per day for 7 days).

USER PROFILE:
- Age: ${userProfile?.age}, Gender: ${userProfile?.gender}
- Weight: ${userProfile?.weight}kg, Height: ${userProfile?.height}cm
- Goal: ${userProfile?.fitness_goal}, Activity: ${userProfile?.activity_level}
- Nationality: ${nationality}
- Allergies: ${allergies}
- Dietary Restrictions: ${restrictions}
- Daily Calorie Target: ${dailyCalories}

PREFERENCES:
- Cuisine: ${preferences?.cuisine || 'Mixed'}
- Max Prep Time: ${preferences?.maxPrepTime || '45'} minutes
- Focus: Authentic ${nationality} dishes with proper nutrition

CRITICAL REQUIREMENTS:
1. EXACTLY 7 days starting from Saturday (day 1) to Friday (day 7)
2. EXACTLY 5 meals per day: breakfast, lunch, dinner, snack1, snack2
3. Total meals: 35 (no more, no less)
4. Return ONLY valid JSON - no markdown or code blocks
5. All nutritional values must be numbers (not strings)
6. Include detailed ingredients with measurements
7. Provide comprehensive cooking instructions
8. Consider allergies and dietary restrictions

MEAL DISTRIBUTION:
- Breakfast: ${Math.round(dailyCalories * 0.25)} calories
- Lunch: ${Math.round(dailyCalories * 0.35)} calories  
- Dinner: ${Math.round(dailyCalories * 0.30)} calories
- Snack1: ${Math.round(dailyCalories * 0.05)} calories
- Snack2: ${Math.round(dailyCalories * 0.05)} calories

Return this EXACT JSON structure:

{
  "weekSummary": {
    "totalCalories": ${dailyCalories * 7},
    "avgDailyCalories": ${dailyCalories},
    "totalProtein": ${Math.round(dailyCalories * 7 * 0.15 / 4)},
    "totalCarbs": ${Math.round(dailyCalories * 7 * 0.50 / 4)},
    "totalFat": ${Math.round(dailyCalories * 7 * 0.35 / 9)},
    "dietType": "${userProfile?.fitness_goal === 'weight_loss' ? 'Weight Loss' : userProfile?.fitness_goal === 'muscle_gain' ? 'Muscle Building' : 'Balanced Nutrition'}"
  },
  "days": [
    {
      "dayNumber": 1,
      "dayName": "Saturday",
      "totalCalories": ${dailyCalories},
      "meals": [
        {
          "type": "breakfast",
          "name": "Traditional ${nationality} Breakfast",
          "calories": ${Math.round(dailyCalories * 0.25)},
          "protein": 25,
          "carbs": 45,
          "fat": 15,
          "fiber": 8,
          "sugar": 12,
          "description": "Nutritious ${nationality} breakfast to start your day",
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
            "Step 1: Detailed preparation with timing",
            "Step 2: Cooking method with temperature",
            "Step 3: Plating and serving suggestions"
          ],
          "prepTime": 10,
          "cookTime": 15,
          "servings": 1,
          "youtubeSearchTerm": "${nationality} breakfast recipe",
          "cuisine": "${nationality}",
          "difficulty": "easy",
          "tips": "Chef tips for best results",
          "nutritionBenefits": "Health benefits of key ingredients",
          "culturalInfo": "Cultural significance and variations"
        }
      ]
    }
  ]
}

Generate all 7 days following this pattern. Each day must have exactly 5 meals with the specified types. Focus on authentic ${nationality} cuisine while meeting nutritional requirements and avoiding allergens.`;
};
