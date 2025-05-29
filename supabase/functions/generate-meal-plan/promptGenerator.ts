
// DRY prompt templates - moved directly into edge function context
const MEAL_PLAN_PROMPTS = {
  SYSTEM_BASE: (totalMeals: number) => `You are a professional nutritionist. Generate EXACTLY 7 days starting from SATURDAY with meals totaling ${totalMeals}. Each meal MUST have: type, name, calories (number), protein, carbs, fat, ingredients (array), instructions (array), prepTime, cookTime, servings. Return ONLY valid JSON - no markdown.`,
  
  SKELETON_ONLY: (nationality: string = 'international', maxPrepTime: number = 45) => 
    `Focus on ${nationality} cuisine with realistic prep times ≤${maxPrepTime} minutes. Generate BASIC meal info only - detailed recipes will be fetched separately on-demand.`,
  
  SNACK_DISTRIBUTION: (breakfast: number, lunch: number, dinner: number, snack1: number, snack2: number) => `
MEAL DISTRIBUTION WITH SNACKS:
- Breakfast: ${breakfast} calories
- Lunch: ${lunch} calories  
- Dinner: ${dinner} calories
- Snack (morning): ${snack1} calories
- Snack (evening): ${snack2} calories`,

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

  // Basic skeleton instructions
  const skeletonInstructions = MEAL_PLAN_PROMPTS.SKELETON_ONLY(
    userProfile?.nationality || 'international',
    parseInt(preferences?.maxPrepTime || '45')
  );

  return `${distribution}

${skeletonInstructions}

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

Generate ${totalMeals} meals total (${mealsPerDay} per day for 7 days) starting from Saturday.
Focus on variety, nutrition balance, and cultural preferences.
Each meal should be realistic and achievable within the prep time limits.`;
};
