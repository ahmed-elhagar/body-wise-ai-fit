
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';
import { getMealImageUrl } from './imageGenerator.ts';

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
      imagePrompt?: string;
      ingredients: Array<{
        name: string;
        quantity: string;
        unit: string;
        calories?: number;
        protein?: number;
        carbs?: number;
        fat?: number;
      }>;
      instructions: string[];
      prepTime: number;
      cookTime: number;
      servings: number;
      youtubeSearchTerm?: string;
      cuisine?: string;
      difficulty?: string;
      tips?: string;
      nutritionBenefits?: string;
      culturalInfo?: string;
    }>;
  }>;
}

export const saveMealsToDatabase = async (generatedPlan: AIGeneratedPlan, weeklyPlanId: string) => {
  let totalMealsSaved = 0;
  let failedMeals = 0;

  console.log(`Starting to save ${generatedPlan.days.length} days of meals...`);

  for (const day of generatedPlan.days) {
    console.log(`Processing day ${day.dayNumber} (${day.dayName}) with ${day.meals.length} meals...`);
    
    for (const meal of day.meals) {
      try {
        // Generate AI image for the meal using the enhanced prompt
        const imagePrompt = meal.imagePrompt || `Professional food photography of ${meal.name}, beautifully plated on a white plate, natural lighting, overhead view, appetizing presentation`;
        const imageUrl = await getMealImageUrl(meal.name, imagePrompt);
        
        // Prepare meal data for database insertion
        const mealData = {
          weekly_plan_id: weeklyPlanId,
          day_number: day.dayNumber,
          meal_type: meal.type,
          name: meal.name,
          calories: Math.round(meal.calories || 0),
          protein: Math.round((meal.protein || 0) * 10) / 10, // Round to 1 decimal
          carbs: Math.round((meal.carbs || 0) * 10) / 10,
          fat: Math.round((meal.fat || 0) * 10) / 10,
          ingredients: meal.ingredients || [],
          instructions: meal.instructions || [],
          prep_time: meal.prepTime || 0,
          cook_time: meal.cookTime || 0,
          servings: meal.servings || 1,
          youtube_search_term: meal.youtubeSearchTerm || `${meal.name} recipe how to make`,
          image_url: imageUrl,
          alternatives: []
        };

        const { error: mealError } = await supabase
          .from('daily_meals')
          .insert(mealData);

        if (mealError) {
          console.error(`Error saving meal "${meal.name}" for day ${day.dayNumber}:`, mealError);
          failedMeals++;
        } else {
          totalMealsSaved++;
          console.log(`✅ Saved meal: ${meal.name} (${meal.calories} cal)`);
        }
      } catch (error) {
        console.error(`Failed to process meal "${meal.name}":`, error);
        failedMeals++;
      }
    }
  }

  console.log(`✅ MEAL SAVING COMPLETE: ${totalMealsSaved} saved, ${failedMeals} failed`);
  
  if (totalMealsSaved < 30) {
    console.warn(`⚠️  WARNING: Only ${totalMealsSaved} meals saved out of expected 35`);
  }

  return { totalMealsSaved, failedMeals };
};
