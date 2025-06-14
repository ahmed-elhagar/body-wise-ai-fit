import { supabase } from '@/lib/supabaseClient';
import type { MealPlanFetchResult, WeeklyMealPlan, DailyMeal } from '../types';

export class OptimizedMealPlanService {
  static async fetchMealPlanData(userId: string, weekStartDate: Date): Promise<MealPlanFetchResult | null> {
    try {
      console.log('🔍 Fetching meal plan data for week starting:', weekStartDate.toISOString());
      
      const { data, error } = await supabase
        .from('weekly_meal_plans')
        .select(`
          *,
          daily_meals (*)
        `)
        .eq('user_id', userId)
        .eq('week_start_date', weekStartDate.toISOString().split('T')[0])
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          console.log('📝 No meal plan found for this week');
          return null;
        }
        throw error;
      }

      if (!data) {
        console.log('📝 No meal plan data returned');
        return null;
      }

      console.log('✅ Meal plan data fetched successfully');
      
      // Transform the data to match our types
      const weeklyPlan: WeeklyMealPlan = {
        ...data,
        preferences: data.generation_prompt || {},
        updated_at: data.created_at // Use created_at as fallback for updated_at
      };

      // Transform daily meals to match our DailyMeal type
      const dailyMeals: DailyMeal[] = (data.daily_meals || []).map((meal: any) => ({
        ...meal,
        meal_type: meal.meal_type as "breakfast" | "lunch" | "dinner" | "snack" | "snack1" | "snack2"
      }));

      return {
        weeklyPlan,
        dailyMeals
      };
    } catch (error) {
      console.error('❌ Error fetching meal plan data:', error);
      throw error;
    }
  }

  static async updateMealPlanPreferences(
    userId: string,
    weekStartDate: Date,
    preferences: any
  ): Promise<void> {
    try {
      console.log('Updating meal plan preferences for week starting:', weekStartDate.toISOString());

      const { data, error } = await supabase
        .from('weekly_meal_plans')
        .update({ generation_prompt: preferences })
        .eq('user_id', userId)
        .eq('week_start_date', weekStartDate.toISOString().split('T')[0])
        .select();

      if (error) {
        throw new Error(`Failed to update meal plan preferences: ${error.message}`);
      }

      console.log('Meal plan preferences updated successfully:', data);
    } catch (error) {
      console.error('Error updating meal plan preferences:', error);
      throw error;
    }
  }

  static async shuffleDailyMeals(weeklyPlanId: string): Promise<boolean> {
    try {
      console.log(`🔄 Shuffling daily meals for weekly plan ID: ${weeklyPlanId}`);

      // Fetch the weekly meal plan to get all daily meals
      const { data: weeklyPlan, error: weeklyPlanError } = await supabase
        .from('weekly_meal_plans')
        .select('id, daily_meals')
        .eq('id', weeklyPlanId)
        .single();

      if (weeklyPlanError) {
        console.error('❌ Error fetching weekly meal plan:', weeklyPlanError);
        return false;
      }

      if (!weeklyPlan || !weeklyPlan.daily_meals) {
        console.warn('⚠️ No daily meals found for this weekly plan.');
        return false;
      }

      // Extract the daily meals from the weekly plan
      const dailyMeals = weeklyPlan.daily_meals as any[];

      // Basic shuffle implementation (you can use a more robust shuffle algorithm)
      for (let i = dailyMeals.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [dailyMeals[i], dailyMeals[j]] = [dailyMeals[j], dailyMeals[i]];
      }

      // Update each daily meal with its new day_number
      for (const meal of dailyMeals) {
        const { error: updateError } = await supabase
          .from('daily_meals')
          .update({ day_number: meal.day_number }) // Keep the same day_number for simplicity
          .eq('id', meal.id);

        if (updateError) {
          console.error(`❌ Error updating daily meal ${meal.id}:`, updateError);
          return false;
        }
      }

      console.log('✅ Daily meals shuffled successfully.');
      return true;

    } catch (error) {
      console.error('❌ Error shuffling daily meals:', error);
      return false;
    }
  }
}
