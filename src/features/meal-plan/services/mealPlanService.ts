
import { supabase } from '@/integrations/supabase/client';
import { format, startOfWeek, addWeeks } from 'date-fns';
import type { MealPlanFetchResult, DailyMeal } from '../types';

export class MealPlanService {
  static getWeekStartDate(weekOffset: number = 0): Date {
    const today = new Date();
    const currentWeekStart = startOfWeek(today, { weekStartsOn: 6 }); // Saturday = 6
    return addWeeks(currentWeekStart, weekOffset);
  }

  static async fetchMealPlanData(userId: string, weekOffset: number = 0): Promise<MealPlanFetchResult | null> {
    const weekStartDate = this.getWeekStartDate(weekOffset);
    const weekStartDateStr = format(weekStartDate, 'yyyy-MM-dd');

    console.log('📡 Fetching meal plan for user:', userId, 'week:', weekStartDateStr);

    // Fetch weekly plan
    const { data: weeklyPlan, error: weeklyError } = await supabase
      .from('weekly_meal_plans')
      .select('*')
      .eq('user_id', userId)
      .eq('week_start_date', weekStartDateStr)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (weeklyError) {
      console.error('❌ Error fetching weekly plan:', weeklyError);
      throw weeklyError;
    }

    if (!weeklyPlan) {
      console.log('ℹ️ No meal plan found for this week');
      return null;
    }

    // Fetch daily meals
    const { data: dailyMeals, error: mealsError } = await supabase
      .from('daily_meals')
      .select('*')
      .eq('weekly_plan_id', weeklyPlan.id)
      .order('day_number', { ascending: true })
      .order('meal_type', { ascending: true });

    if (mealsError) {
      console.error('❌ Error fetching daily meals:', mealsError);
      throw mealsError;
    }

    const processedMeals = (dailyMeals || []).map(this.processMealData);

    console.log('✅ Meal plan fetched successfully:', {
      weeklyPlanId: weeklyPlan.id,
      dailyMealsCount: processedMeals.length,
      weekStartDate: weeklyPlan.week_start_date
    });

    return {
      weeklyPlan,
      dailyMeals: processedMeals
    };
  }

  static processMealData(meal: any): DailyMeal {
    const parseJsonField = (field: any, fallback: any = []) => {
      if (!field) return fallback;
      if (typeof field === 'string') {
        try {
          return JSON.parse(field);
        } catch {
          return fallback;
        }
      }
      return Array.isArray(field) ? field : fallback;
    };

    return {
      ...meal,
      ingredients: parseJsonField(meal.ingredients, []),
      instructions: parseJsonField(meal.instructions, []),
      alternatives: parseJsonField(meal.alternatives, [])
    };
  }

  static async addSnack(weeklyPlanId: string, dayNumber: number, snack: any): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('daily_meals')
        .insert({
          weekly_plan_id: weeklyPlanId,
          day_number: dayNumber,
          meal_type: 'snack',
          name: snack.name,
          calories: snack.calories,
          protein: snack.protein,
          carbs: snack.carbs,
          fat: snack.fat,
          prep_time: 5,
          cook_time: 0,
          servings: 1,
          ingredients: [{ name: snack.name, quantity: "1", unit: "serving" }],
          instructions: [`Enjoy your ${snack.name}!`],
          recipe_fetched: true
        });

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error adding snack:', error);
      return false;
    }
  }

  static async deleteMeal(mealId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('daily_meals')
        .delete()
        .eq('id', mealId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting meal:', error);
      return false;
    }
  }

  static async updateMeal(mealId: string, updates: Partial<DailyMeal>): Promise<boolean> {
    try {
      // Convert MealIngredient[] to proper JSON format for database
      const dbUpdates: any = { ...updates };
      if (updates.ingredients) {
        dbUpdates.ingredients = updates.ingredients;
      }
      if (updates.instructions) {
        dbUpdates.instructions = updates.instructions;
      }
      if (updates.alternatives) {
        dbUpdates.alternatives = updates.alternatives;
      }

      const { error } = await supabase
        .from('daily_meals')
        .update(dbUpdates)
        .eq('id', mealId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error updating meal:', error);
      return false;
    }
  }

  static getDayName(dayNumber: number): string {
    const days = ['', 'Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    return days[dayNumber] || 'Day';
  }

  static getCurrentSaturdayDay(): number {
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 = Sunday, 6 = Saturday
    
    // Convert to our system where Saturday = 1
    if (dayOfWeek === 6) return 1; // Saturday
    if (dayOfWeek === 0) return 2; // Sunday
    return dayOfWeek + 1; // Monday=2, Tuesday=3, etc.
  }

  static getDateForDay(dayNumber: number, weekStartDate: Date): Date {
    const dayOffset = dayNumber === 1 ? 0 : dayNumber - 1;
    const date = new Date(weekStartDate);
    date.setDate(date.getDate() + dayOffset);
    return date;
  }
}
