
interface UserProfile {
  age?: number;
  gender?: string;
  weight?: number;
  height?: number;
  fitness_goal?: string;
  activity_level?: string;
  nationality?: string;
}

interface Preferences {
  cuisine?: string;
  maxPrepTime?: string;
  [key: string]: any;
}

export const generateMealPlanPrompt = (userProfile: UserProfile, preferences: Preferences, dailyCalories: number): string => {
  return `Generate a complete 7-day meal plan starting from SATURDAY and ending on FRIDAY with EXACTLY 35 meals (7 days × 5 meals per day: breakfast, lunch, dinner, snack1, snack2).

USER PROFILE:
- Age: ${userProfile?.age}, Gender: ${userProfile?.gender}
- Weight: ${userProfile?.weight}kg, Height: ${userProfile?.height}cm
- Goal: ${userProfile?.fitness_goal}, Activity: ${userProfile?.activity_level}
- Nationality: ${userProfile?.nationality}
- Target: ${dailyCalories} calories daily

CRITICAL REQUIREMENTS:
1. EXACTLY 7 days (Saturday to Friday)
2. EXACTLY 5 meals per day
3. TOTAL: 35 meals - NO EXCEPTIONS
4. Valid JSON only - no markdown formatting
5. All nutritional values must be numbers
6. Focus on ${userProfile?.nationality || 'international'} cuisine with authentic local dishes
7. Include detailed cooking instructions and cultural context
8. Provide comprehensive ingredient lists with exact measurements
9. Week starts on Saturday (day 1) and ends on Friday (day 7)

Return ONLY this JSON structure:

{
  "weekSummary": {
    "totalCalories": ${dailyCalories * 7},
    "avgDailyCalories": ${dailyCalories},
    "totalProtein": 700,
    "totalCarbs": 2100,
    "totalFat": 490,
    "dietType": "${userProfile?.fitness_goal === 'weight_loss' ? 'Weight Loss' : 'Balanced'}"
  },
  "days": [
    {
      "dayNumber": 1,
      "dayName": "Saturday",
      "totalCalories": ${dailyCalories},
      "meals": [
        {
          "type": "breakfast",
          "name": "Traditional ${userProfile?.nationality || 'International'} Breakfast",
          "calories": ${Math.round(dailyCalories * 0.25)},
          "protein": 20,
          "carbs": 45,
          "fat": 12,
          "fiber": 8,
          "sugar": 15,
          "description": "A nutritious and culturally authentic breakfast to start your day",
          "ingredients": [
            {"name": "main ingredient", "quantity": "100", "unit": "g", "calories": 120, "protein": 8, "carbs": 20, "fat": 3},
            {"name": "secondary ingredient", "quantity": "50", "unit": "g", "calories": 80, "protein": 4, "carbs": 15, "fat": 2}
          ],
          "instructions": [
            "Step 1: Detailed preparation instruction",
            "Step 2: Cooking method with timing",
            "Step 3: Plating and serving suggestions"
          ],
          "prepTime": 10,
          "cookTime": 15,
          "servings": 1,
          "youtubeSearchTerm": "${userProfile?.nationality || 'traditional'} breakfast recipe",
          "cuisine": "${userProfile?.nationality || 'international'}",
          "difficulty": "easy",
          "tips": "Chef tips for best results",
          "nutritionBenefits": "Health benefits of this meal",
          "culturalInfo": "Cultural significance and variations"
        }
      ]
    }
  ]
}

Generate all 7 days starting from Saturday following this exact pattern. Each day must have exactly 5 meals. Vary the meal names and ingredients but keep authentic ${userProfile?.nationality || 'international'} flavors and traditional cooking methods.`;
};
