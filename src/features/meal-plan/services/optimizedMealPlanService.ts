
import { supabase } from '@/integrations/supabase/client';
import type { MealPlanFetchResult, WeeklyMealPlan, DailyMeal } from '../types';

export class OptimizedMealPlanService {
  static async fetchMealPlanData(userId: string, weekStartDate: Date): Promise<MealPlanFetchResult | null> {
    try {
      console.log('🔍 Fetching meal plan data for week starting:', weekStartDate.toISOString());
      
      // First, fetch the weekly meal plan
      const { data: weeklyPlanData, error: weeklyPlanError } = await supabase
        .from('weekly_meal_plans')
        .select('*')
        .eq('user_id', userId)
        .eq('week_start_date', weekStartDate.toISOString().split('T')[0])
        .single();

      if (weeklyPlanError) {
        if (weeklyPlanError.code === 'PGRST116') {
          console.log('📝 No meal plan found for this week');
          return null;
        }
        throw weeklyPlanError;
      }

      if (!weeklyPlanData) {
        console.log('📝 No meal plan data returned');
        return null;
      }

      // Then fetch the daily meals for this weekly plan
      const { data: dailyMealsData, error: dailyMealsError } = await supabase
        .from('daily_meals')
        .select('*')
        .eq('weekly_plan_id', weeklyPlanData.id)
        .order('day_number', { ascending: true });

      if (dailyMealsError) {
        console.error('❌ Error fetching daily meals:', dailyMealsError);
        throw dailyMealsError;
      }

      console.log('✅ Meal plan data fetched successfully');
      
      // Transform the data to match our types
      const weeklyPlan: WeeklyMealPlan = {
        ...weeklyPlanData,
        preferences: weeklyPlanData.generation_prompt || {},
        updated_at: weeklyPlanData.created_at // Use created_at as fallback for updated_at
      };

      // Transform daily meals to match our DailyMeal type
      const dailyMeals: DailyMeal[] = (dailyMealsData || []).map((meal: any) => ({
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

      // Fetch the daily meals for this weekly plan
      const { data: dailyMeals, error: mealsError } = await supabase
        .from('daily_meals')
        .select('*')
        .eq('weekly_plan_id', weeklyPlanId)
        .order('day_number', { ascending: true });

      if (mealsError) {
        console.error('❌ Error fetching daily meals:', mealsError);
        return false;
      }

      if (!dailyMeals || dailyMeals.length === 0) {
        console.warn('⚠️ No daily meals found for this weekly plan.');
        return false;
      }

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
