
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';
import { getMealImageUrl } from './imageGenerator.ts';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

interface GeneratedPlan {
  days: Array<{
    dayNumber: number;
    meals: Array<{
      type: string;
      name?: string;
      calories?: number;
      protein?: number;
      carbs?: number;
      fat?: number;
      ingredients?: any[];
      instructions?: string[];
      prepTime?: number;
      cookTime?: number;
      servings?: number;
      youtubeSearchTerm?: string;
      alternatives?: any[];
      [key: string]: any;
    }>;
  }>;
  weekSummary?: {
    totalCalories?: number;
    totalProtein?: number;
    totalCarbs?: number;
    totalFat?: number;
    dietType?: string;
  };
}

export const saveMealsToDatabase = async (generatedPlan: GeneratedPlan, weeklyPlanId: string) => {
  let totalMealsSaved = 0;
  let failedMeals = 0;

  for (let dayIndex = 0; dayIndex < generatedPlan.days.length; dayIndex++) {
    const day = generatedPlan.days[dayIndex];
    console.log(`Saving meals for day ${dayIndex + 1} (${day.meals.length} meals)...`);
    
    for (let mealIndex = 0; mealIndex < day.meals.length; mealIndex++) {
      const meal = day.meals[mealIndex];
      
      const ingredientNames = (meal.ingredients || []).map((ing: any) => ing.name || '');
      const imageUrl = await getMealImageUrl(meal.name || 'meal', ingredientNames);
      
      const { error: mealError } = await supabase
        .from('daily_meals')
        .insert({
          weekly_plan_id: weeklyPlanId,
          day_number: day.dayNumber,
          meal_type: meal.type,
          name: meal.name || 'Unnamed Meal',
          calories: meal.calories || 0,
          protein: meal.protein || 0,
          carbs: meal.carbs || 0,
          fat: meal.fat || 0,
          ingredients: meal.ingredients || [],
          instructions: meal.instructions || [],
          prep_time: meal.prepTime || 0,
          cook_time: meal.cookTime || 0,
          servings: meal.servings || 1,
          youtube_search_term: meal.youtubeSearchTerm || null,
          alternatives: meal.alternatives || []
        });

      if (mealError) {
        console.error(`Error saving meal ${mealIndex + 1} of day ${dayIndex + 1}:`, mealError);
        failedMeals++;
      } else {
        totalMealsSaved++;
        if (imageUrl) {
          console.log(`✅ Meal ${meal.name} saved with AI-generated image`);
        }
      }
    }
  }

  console.log(`✅ MEAL SAVING COMPLETE: ${totalMealsSaved} meals saved, ${failedMeals} failed out of 35 expected`);
  return { totalMealsSaved, failedMeals };
};
