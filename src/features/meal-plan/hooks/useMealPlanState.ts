
import { useState, useCallback, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { addDays, format, startOfWeek } from 'date-fns';
import { getCurrentWeekDates, formatDateForMealPlan, convertDatabaseMeal } from '../utils/mealPlanUtils';
import type { WeeklyMealPlan, DailyMeal, MealPlanFetchResult } from '../types';

interface UseMealPlanStateProps {
  initialDate?: Date;
}

export const useMealPlanState = ({ initialDate }: UseMealPlanStateProps = {}) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [selectedDate, setSelectedDate] = useState(initialDate || new Date());
  const [isGenerating, setIsGenerating] = useState(false);
  const [isShuffling, setIsShuffling] = useState(false);
  const [showShoppingList, setShowShoppingList] = useState(false);

  const weekDates = useMemo(() => getCurrentWeekDates(), []);
  const selectedDateFormatted = useMemo(() => formatDateForMealPlan(selectedDate), [selectedDate]);

  const weekStartDate = useMemo(() => {
    return startOfWeek(selectedDate, { weekStartsOn: 0 });
  }, [selectedDate]);

  const weekStartDateFormatted = useMemo(() => {
    return format(weekStartDate, 'yyyy-MM-dd');
  }, [weekStartDate]);

  const {
    data: weeklyPlanData,
    isLoading: isPlanLoading,
    error: planError,
    refetch
  } = useQuery({
    queryKey: ['weeklyMealPlan', user?.id, weekStartDateFormatted],
    queryFn: async (): Promise<MealPlanFetchResult | null> => {
      if (!user?.id) {
        console.warn('No user ID - skipping meal plan fetch');
        return null;
      }

      console.log(`Fetching meal plan for user ${user.id} and week starting ${weekStartDateFormatted}`);

      const { data: weeklyPlan, error: weeklyPlanError } = await supabase
        .from('weekly_meal_plans')
        .select('*')
        .eq('user_id', user.id)
        .eq('week_start_date', weekStartDateFormatted)
        .single();

      if (weeklyPlanError) {
        console.error('Error fetching weekly meal plan:', weeklyPlanError);
        if (weeklyPlanError.code === 'PGRST116') {
          return null;
        }
        throw new Error(weeklyPlanError.message);
      }

      if (!weeklyPlan) {
        console.log('No weekly meal plan found, returning null');
        return null;
      }

      const { data: dailyMeals, error: dailyMealsError } = await supabase
        .from('daily_meals')
        .select('*')
        .eq('weekly_plan_id', weeklyPlan.id);

      if (dailyMealsError) {
        console.error('Error fetching daily meals:', dailyMealsError);
        throw new Error(dailyMealsError.message);
      }

      const convertedMeals = (dailyMeals || []).map(convertDatabaseMeal);

      console.log(`Successfully fetched meal plan with ${convertedMeals.length} daily meals`);

      return { 
        weeklyPlan: weeklyPlan as WeeklyMealPlan, 
        dailyMeals: convertedMeals 
      };
    },
    enabled: !!user?.id,
    retry: false,
  });

  // Calculate derived properties
  const currentWeekPlan = weeklyPlanData;
  const dailyMeals = useMemo(() => {
    if (!weeklyPlanData?.dailyMeals) return [];
    const today = new Date();
    const todayDayNumber = today.getDay() === 0 ? 7 : today.getDay(); // Sunday = 7, Monday = 1
    return weeklyPlanData.dailyMeals.filter(meal => meal.day_number === todayDayNumber);
  }, [weeklyPlanData?.dailyMeals]);

  const totalCalories = useMemo(() => {
    return dailyMeals.reduce((total, meal) => total + (meal.calories || 0), 0);
  }, [dailyMeals]);

  const totalProtein = useMemo(() => {
    return dailyMeals.reduce((total, meal) => total + (meal.protein || 0), 0);
  }, [dailyMeals]);

  const targetDayCalories = useMemo(() => {
    if (weeklyPlanData?.weeklyPlan?.total_calories) {
      return Math.round(weeklyPlanData.weeklyPlan.total_calories / 7);
    }
    return 2000; // Default fallback
  }, [weeklyPlanData?.weeklyPlan?.total_calories]);

  const handleDateSelect = (date: Date) => {
    console.log('📅 Selected date:', date);
    setSelectedDate(date);
  };

  const handleShowShoppingList = () => {
    console.log('🛒 Showing shopping list');
    setShowShoppingList(true);
  };

  const handleCloseShoppingList = () => {
    console.log('❌ Closing shopping list');
    setShowShoppingList(false);
  };

  return {
    selectedDate,
    selectedDateFormatted,
    weekStartDate,
    weekStartDateFormatted,
    weekDates,
    handleDateSelect,
    weeklyPlanData,
    isPlanLoading,
    planError,
    isGenerating,
    setIsGenerating,
    isShuffling,
    setIsShuffling,
    showShoppingList,
    handleShowShoppingList,
    handleCloseShoppingList,
    refetch,
    // Additional properties for compatibility
    currentWeekPlan,
    dailyMeals,
    totalCalories,
    totalProtein,
    targetDayCalories
  };
};
