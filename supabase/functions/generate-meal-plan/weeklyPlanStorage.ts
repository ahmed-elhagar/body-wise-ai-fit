
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';
import { format, startOfWeek, addWeeks } from 'https://esm.sh/date-fns@3.6.0';

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

// ENHANCED: Use exact same logic as frontend with date-fns for absolute consistency
const getWeekStartDate = (weekOffset: number = 0): Date => {
  const today = new Date();
  
  // Use Saturday as the start of the week (weekStartsOn: 6) - same as frontend
  const startOfCurrentWeek = startOfWeek(today, { weekStartsOn: 6 });
  
  // Add the week offset to get the target week
  const targetWeek = addWeeks(startOfCurrentWeek, weekOffset);
  
  // Ensure we get a clean date with no time component
  const result = new Date(targetWeek);
  result.setHours(0, 0, 0, 0);
  
  console.log(`📅 BACKEND ENHANCED Week calculation: today=${format(today, 'yyyy-MM-dd')}, weekOffset=${weekOffset}, result=${format(result, 'yyyy-MM-dd')}`);
  
  return result;
};

export const saveWeeklyPlan = async (userProfile: UserProfile, generatedPlan: GeneratedPlan, preferences: any, dailyCalories: number) => {
  // CRITICAL: Use the weekOffset from preferences to ensure exact week match
  const weekOffset = preferences?.weekOffset || 0;
  const weekStartDate = getWeekStartDate(weekOffset);
  const weekStartDateStr = format(weekStartDate, 'yyyy-MM-dd');
  
  console.log('🎯 SAVING Weekly Plan for EXACT week with enhanced consistency:', {
    weekOffset,
    calculatedDate: weekStartDateStr,
    userId: userProfile.id,
    dateFormatted: format(weekStartDate, 'yyyy-MM-dd')
  });
  
  // Delete existing plan for this EXACT week only
  console.log('Deleting existing plan for exact week:', weekStartDateStr);
  const { error: deleteError } = await supabase
    .from('weekly_meal_plans')
    .delete()
    .eq('user_id', userProfile.id)
    .eq('week_start_date', weekStartDateStr);
  
  if (deleteError) {
    console.error('Error deleting existing plan:', deleteError);
  } else {
    console.log('✅ Successfully deleted existing plans for week:', weekStartDateStr);
  }

  const { data: weeklyPlan, error: weeklyError } = await supabase
    .from('weekly_meal_plans')
    .insert({
      user_id: userProfile.id,
      week_start_date: weekStartDateStr,
      generation_prompt: {
        userProfile,
        preferences,
        generatedAt: new Date().toISOString(),
        weekStartDate: weekStartDateStr,
        weekOffset: weekOffset
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

  console.log('✅ Weekly plan saved for EXACT week with enhanced consistency:', {
    id: weeklyPlan.id,
    week_start_date: weeklyPlan.week_start_date,
    user_id: weeklyPlan.user_id,
    weekOffset: weekOffset
  });

  return weeklyPlan;
};
