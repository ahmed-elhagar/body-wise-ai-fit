
// DRY prompt templates - extracted from scattered code
export const MEAL_PLAN_PROMPTS = {
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

export const RECIPE_PROMPTS = {
  SYSTEM: `You are a culinary expert. Generate a detailed recipe with step-by-step instructions, ingredient quantities, and cooking tips for the meal provided.`,
  
  USER_TEMPLATE: (mealName: string, calories: number, cuisine: string = 'international', maxPrepTime: number = 45, restrictions: string = 'none') => 
    `Create a detailed recipe for: ${mealName}
Target calories: ${calories}
Cuisine: ${cuisine}
Max prep time: ${maxPrepTime} minutes
Dietary restrictions: ${restrictions}

Include:
- Exact ingredient quantities
- Step-by-step instructions
- Cooking tips
- Nutritional breakdown`
};

export const EXERCISE_PROMPTS = {
  SYSTEM: `You are a certified fitness trainer. Create structured workout programs based on user goals, fitness level, and available equipment.`,
  
  PROGRAM_TEMPLATE: (duration: string, goal: string, level: string, timePerDay: number, equipment: string, targetMuscles: string) => 
    `Design a ${duration}-week program for:
Goal: ${goal}
Fitness level: ${level}
Available time: ${timePerDay} minutes/day
Equipment: ${equipment}
Target muscles: ${targetMuscles}

Include warm-up, main exercises with sets/reps, and cool-down.`
};
