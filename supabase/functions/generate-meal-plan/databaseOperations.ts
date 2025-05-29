
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';
import { getMealImageUrl } from './imageGenerator.ts';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

interface UserProfile {
  id: string;
  fitness_goal?: string;
  [key: string]: any;
}

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

export const checkAndDecrementGenerations = async (userProfile: UserProfile) => {
  const { data: profileData, error: profileError } = await supabase
    .from('profiles')
    .select('ai_generations_remaining')
    .eq('id', userProfile.id)
    .single();
    
  if (profileError) {
    throw new Error('Failed to check AI generations remaining');
  }
  
  if (profileData.ai_generations_remaining <= 0) {
    throw new Error('You have reached your AI generation limit. Please contact admin to increase your limit.');
  }

  return profileData;
};

export const saveWeeklyPlan = async (userProfile: UserProfile, generatedPlan: GeneratedPlan, preferences: any, dailyCalories: number) => {
  const today = new Date();
  const currentDay = today.getDay();
  const daysSinceSaturday = currentDay === 6 ? 0 : currentDay + 1;
  const weekStartDate = new Date(today);
  weekStartDate.setDate(today.getDate() - daysSinceSaturday);
  
  console.log('Deleting existing plan for week:', weekStartDate.toISOString().split('T')[0]);
  const { error: deleteError } = await supabase
    .from('weekly_meal_plans')
    .delete()
    .eq('user_id', userProfile.id)
    .eq('week_start_date', weekStartDate.toISOString().split('T')[0]);
  
  if (deleteError) {
    console.error('Error deleting existing plan:', deleteError);
  }

  const { data: weeklyPlan, error: weeklyError } = await supabase
    .from('weekly_meal_plans')
    .insert({
      user_id: userProfile.id,
      week_start_date: weekStartDate.toISOString().split('T')[0],
      generation_prompt: {
        userProfile,
        preferences,
        generatedAt: new Date().toISOString()
      },
      total_calories: generatedPlan.weekSummary?.totalCalories || dailyCalories * 7,
      total_protein: generatedPlan.weekSummary?.totalProtein || 700,
      total_carbs: generatedPlan.weekSummary?.totalCarbs || 2100,
      total_fat: generatedPlan.weekSummary?.totalFat || 490
    })
    .select()
    .single();

  if (weeklyError) {
    console.error('Error saving weekly plan:', weeklyError);
    throw weeklyError;
  }

  return weeklyPlan;
};

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
          alternatives: meal.alternatives || [],
          image_url: imageUrl
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

export const decrementUserGenerations = async (userProfile: UserProfile, profileData: any) => {
  const { error: decrementError } = await supabase
    .from('profiles')
    .update({
      ai_generations_remaining: profileData.ai_generations_remaining - 1,
      updated_at: new Date().toISOString()
    })
    .eq('id', userProfile.id);
    
  if (decrementError) {
    console.error('Failed to decrement AI generations:', decrementError);
    throw new Error('Failed to update generation count');
  }

  return profileData.ai_generations_remaining - 1;
};
