
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

interface AIGeneratedPlan {
  days: Array<{
    dayNumber: number;
    dayName: string;
    meals: Array<{
      type: string;
      name: string;
      calories: number;
      protein: number;
      carbs: number;
      fat: number;
      fiber?: number;
      sugar?: number;
      description?: string;
      prepTime: number;
      cookTime: number;
      servings: number;
      cuisine?: string;
      difficulty?: string;
    }>;
  }>;
}

export const saveMealsToDatabase = async (generatedPlan: AIGeneratedPlan, weeklyPlanId: string) => {
  let totalMealsSaved = 0;
  let failedMeals = 0;

  console.log(`Starting to save ${generatedPlan.days.length} days of BASIC meals...`);

  for (const day of generatedPlan.days) {
    console.log(`Processing day ${day.dayNumber} (${day.dayName}) with ${day.meals.length} meals...`);
    
    for (const meal of day.meals) {
      try {
        // Prepare basic meal data for database insertion (no detailed recipe data)
        const mealData = {
          weekly_plan_id: weeklyPlanId,
          day_number: day.dayNumber,
          meal_type: meal.type,
          name: meal.name,
          calories: Math.round(meal.calories || 0),
          protein: Math.round((meal.protein || 0) * 10) / 10,
          carbs: Math.round((meal.carbs || 0) * 10) / 10,
          fat: Math.round((meal.fat || 0) * 10) / 10,
          ingredients: [], // Empty - will be populated when recipe is requested
          instructions: [], // Empty - will be populated when recipe is requested
          prep_time: meal.prepTime || 0,
          cook_time: meal.cookTime || 0,
          servings: meal.servings || 1,
          youtube_search_term: `${meal.name} recipe how to make`, // Basic search term
          image_url: null, // No image initially - will be generated when recipe is requested
          alternatives: [],
          recipe_fetched: false // Track if detailed recipe has been fetched
        };

        const { error: mealError } = await supabase
          .from('daily_meals')
          .insert(mealData);

        if (mealError) {
          console.error(`Error saving meal "${meal.name}" for day ${day.dayNumber}:`, mealError);
          failedMeals++;
        } else {
          totalMealsSaved++;
          console.log(`✅ Saved basic meal: ${meal.name} (${meal.calories} cal)`);
        }
      } catch (error) {
        console.error(`Failed to process meal "${meal.name}":`, error);
        failedMeals++;
      }
    }
  }

  console.log(`✅ BASIC MEAL SAVING COMPLETE: ${totalMealsSaved} saved, ${failedMeals} failed`);
  
  return { totalMealsSaved, failedMeals };
};
