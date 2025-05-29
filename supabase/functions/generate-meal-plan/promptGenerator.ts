
import { MEAL_PLAN_PROMPTS } from '../../../src/utils/promptTemplates.js';

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
