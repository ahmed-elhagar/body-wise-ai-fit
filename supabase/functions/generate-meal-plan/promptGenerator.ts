
// Enhanced prompt templates for better JSON structure generation
const MEAL_PLAN_PROMPTS = {
  JSON_STRUCTURE_EXAMPLE: (includeSnacks: boolean) => `
REQUIRED JSON STRUCTURE (copy this format exactly):
{
  "days": [
    {
      "dayNumber": 1,
      "dayName": "Saturday",
      "meals": [
        {
          "type": "breakfast",
          "name": "Spanish Omelette",
          "calories": 500,
          "protein": 25,
          "carbs": 40,
          "fat": 30,
          "ingredients": ["eggs", "potatoes", "onion"],
          "instructions": ["Step 1", "Step 2"],
          "prepTime": 15,
          "cookTime": 30,
          "servings": 2
        }${includeSnacks ? `,
        {
          "type": "snack1",
          "name": "Greek Yogurt",
          "calories": 150,
          "protein": 15,
          "carbs": 20,
          "fat": 5,
          "ingredients": ["Greek yogurt", "honey"],
          "instructions": ["Mix yogurt with honey"],
          "prepTime": 2,
          "cookTime": 0,
          "servings": 1
        }` : ''}
      ]
    }
  ]
}`,

  MEAL_TYPES: (includeSnacks: boolean) => 
    includeSnacks ? 'breakfast, lunch, dinner, snack1, snack2' : 'breakfast, lunch, dinner',
  
  SNACK_DISTRIBUTION: (breakfast: number, lunch: number, dinner: number, snack1: number, snack2: number) => `
MEAL DISTRIBUTION WITH SNACKS:
- Breakfast: ${breakfast} calories
- Lunch: ${lunch} calories  
- Dinner: ${dinner} calories
- Snack 1 (morning): ${snack1} calories
- Snack 2 (evening): ${snack2} calories`,

  NO_SNACK_DISTRIBUTION: (breakfast: number, lunch: number, dinner: number) => `
MEAL DISTRIBUTION WITHOUT SNACKS:
- Breakfast: ${breakfast} calories
- Lunch: ${lunch} calories
- Dinner: ${dinner} calories`
};

export const generateMealPlanPrompt = (userProfile: any, preferences: any, dailyCalories: number, includeSnacks: boolean) => {
  const mealsPerDay = includeSnacks ? 5 : 3;
  const totalMeals = mealsPerDay * 7;
  
  // Calculate meal distribution
  let distribution;
  if (includeSnacks) {
    const breakfast = Math.round(dailyCalories * 0.25);
    const lunch = Math.round(dailyCalories * 0.35);
    const dinner = Math.round(dailyCalories * 0.30);
    const snack1 = Math.round(dailyCalories * 0.05);
    const snack2 = Math.round(dailyCalories * 0.05);
    distribution = MEAL_PLAN_PROMPTS.SNACK_DISTRIBUTION(breakfast, lunch, dinner, snack1, snack2);
  } else {
    const breakfast = Math.round(dailyCalories * 0.25);
    const lunch = Math.round(dailyCalories * 0.40);
    const dinner = Math.round(dailyCalories * 0.35);
    distribution = MEAL_PLAN_PROMPTS.NO_SNACK_DISTRIBUTION(breakfast, lunch, dinner);
  }

  return `Generate a 7-day meal plan starting from Saturday with the following requirements:

${distribution}

${MEAL_PLAN_PROMPTS.JSON_STRUCTURE_EXAMPLE(includeSnacks)}

CRITICAL REQUIREMENTS:
1. Generate EXACTLY 7 days (dayNumber: 1-7, starting Saturday)
2. Each day must have EXACTLY ${mealsPerDay} meals
3. Meal types: ${MEAL_PLAN_PROMPTS.MEAL_TYPES(includeSnacks)}
4. Return ONLY valid JSON matching the structure above
5. No markdown formatting, no explanations

User Profile:
- Age: ${userProfile?.age || 30}
- Gender: ${userProfile?.gender || 'not specified'}
- Weight: ${userProfile?.weight || 70}kg
- Height: ${userProfile?.height || 170}cm
- Activity Level: ${userProfile?.activity_level || 'moderate'}
- Fitness Goal: ${userProfile?.fitness_goal || 'maintain'}
- Nationality: ${userProfile?.nationality || 'international'}

Preferences:
- Cuisine: ${preferences?.cuisine || 'mixed'}
- Max Prep Time: ${preferences?.maxPrepTime || 45} minutes
- Diet Type: ${preferences?.mealTypes || 'all'}

Dietary Restrictions: ${userProfile?.dietary_restrictions?.join(', ') || 'none'}
Allergies: ${userProfile?.allergies?.join(', ') || 'none'}

Generate ${totalMeals} meals total following the exact JSON structure shown above.`;
};
