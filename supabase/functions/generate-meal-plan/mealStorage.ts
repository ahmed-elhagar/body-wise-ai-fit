
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
      ingredients?: any[];
      instructions?: any[];
    }>;
  }>;
}

export const saveMealsToDatabase = async (generatedPlan: AIGeneratedPlan, weeklyPlanId: string) => {
  let totalMealsSaved = 0;
  let failedMeals = 0;

  console.log(`Starting to save ${generatedPlan.days.length} days of meals to centralized food database...`);

  for (const day of generatedPlan.days) {
    console.log(`Processing day ${day.dayNumber} (${day.dayName}) with ${day.meals.length} meals...`);
    
    for (const meal of day.meals) {
      try {
        // Save meal to centralized food_items table
        const { data: foodItem, error: foodError } = await supabase
          .from('food_items')
          .upsert({
            name: meal.name,
            category: 'meal',
            cuisine_type: meal.cuisine || 'general',
            calories_per_100g: Math.round((meal.calories || 0) / (meal.servings || 1) * 100 / 100),
            protein_per_100g: Math.round((meal.protein || 0) / (meal.servings || 1) * 100 / 100 * 10) / 10,
            carbs_per_100g: Math.round((meal.carbs || 0) / (meal.servings || 1) * 100 / 100 * 10) / 10,
            fat_per_100g: Math.round((meal.fat || 0) / (meal.servings || 1) * 100 / 100 * 10) / 10,
            fiber_per_100g: Math.round((meal.fiber || 0) / (meal.servings || 1) * 100 / 100 * 10) / 10,
            sugar_per_100g: Math.round((meal.sugar || 0) / (meal.servings || 1) * 100 / 100 * 10) / 10,
            serving_size_g: 100 * (meal.servings || 1),
            serving_description: `${meal.servings || 1} serving(s)`,
            source: 'ai_meal_plan',
            confidence_score: 0.9,
            verified: false
          }, { 
            onConflict: 'name',
            ignoreDuplicates: false 
          })
          .select()
          .single();

        if (foodError) {
          console.error(`Error saving food item "${meal.name}":`, foodError);
          // Continue with daily meal even if food item fails
        }

        // Save the daily meal reference
        const { error: mealError } = await supabase
          .from('daily_meals')
          .insert({
            weekly_plan_id: weeklyPlanId,
            day_number: day.dayNumber,
            meal_type: meal.type,
            name: meal.name,
            calories: Math.round(meal.calories || 0),
            protein: Math.round((meal.protein || 0) * 10) / 10,
            carbs: Math.round((meal.carbs || 0) * 10) / 10,
            fat: Math.round((meal.fat || 0) * 10) / 10,
            ingredients: meal.ingredients || [],
            instructions: meal.instructions || [],
            prep_time: meal.prepTime || 0,
            cook_time: meal.cookTime || 0,
            servings: meal.servings || 1,
            youtube_search_term: `${meal.name} recipe how to make`,
            recipe_fetched: true,
            alternatives: []
          });

        if (mealError) {
          console.error(`Error saving daily meal "${meal.name}":`, mealError);
          failedMeals++;
        } else {
          totalMealsSaved++;
          console.log(`✅ Saved meal to centralized database: ${meal.name} (${meal.calories} cal)`);
        }
      } catch (error) {
        console.error(`Failed to process meal "${meal.name}":`, error);
        failedMeals++;
      }
    }
  }

  console.log(`✅ CENTRALIZED MEAL SAVING COMPLETE: ${totalMealsSaved} saved, ${failedMeals} failed`);
  
  return { totalMealsSaved, failedMeals };
};
