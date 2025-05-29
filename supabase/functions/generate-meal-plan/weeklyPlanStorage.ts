
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

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

// CRITICAL FIX: Use exact same logic as frontend getWeekStartDate
const getWeekStartDate = (weekOffset: number = 0): Date => {
  const today = new Date();
  
  // Use same logic as frontend: find Saturday start of week
  const currentDayOfWeek = today.getDay(); // 0=Sunday, 6=Saturday
  
  // Calculate days to get to Saturday (start of week)
  let daysToSaturday: number;
  if (currentDayOfWeek === 6) {
    // Today is Saturday
    daysToSaturday = 0;
  } else {
    // Calculate days back to previous Saturday
    daysToSaturday = currentDayOfWeek + 1;
  }
  
  // Start from Saturday of current week
  const startDate = new Date(today);
  startDate.setDate(today.getDate() - daysToSaturday);
  
  // Add the week offset
  startDate.setDate(startDate.getDate() + (weekOffset * 7));
  
  // Reset to start of day to ensure consistency
  startDate.setHours(0, 0, 0, 0);
  
  console.log(`📅 BACKEND Week calculation (FIXED): today=${today.toISOString().split('T')[0]}, currentDay=${currentDayOfWeek}, daysToSaturday=${daysToSaturday}, weekOffset=${weekOffset}, result=${startDate.toISOString().split('T')[0]}`);
  
  return startDate;
};

export const saveWeeklyPlan = async (userProfile: UserProfile, generatedPlan: GeneratedPlan, preferences: any, dailyCalories: number) => {
  // CRITICAL FIX: Use the weekOffset from preferences
  const weekOffset = preferences?.weekOffset || 0;
  const weekStartDate = getWeekStartDate(weekOffset);
  const weekStartDateStr = weekStartDate.toISOString().split('T')[0];
  
  console.log('🎯 SAVING Weekly Plan with CONSISTENT date for offset', weekOffset, ':', weekStartDateStr);
  
  // Delete existing plan for this week
  console.log('Deleting existing plan for week:', weekStartDateStr);
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

  console.log('✅ Weekly plan saved successfully with CONSISTENT date:', {
    id: weeklyPlan.id,
    week_start_date: weeklyPlan.week_start_date,
    user_id: weeklyPlan.user_id,
    created_at: weeklyPlan.created_at,
    weekOffset: weekOffset
  });

  return weeklyPlan;
};
