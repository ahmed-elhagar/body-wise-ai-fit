import { useState, useCallback, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { addDays, format, startOfWeek } from 'date-fns';
import { getCurrentWeekDates, formatDateForMealPlan } from '../utils/mealPlanUtils';
import type { WeeklyMealPlan, DailyMeal } from '../types';

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
  } = useQuery<{ weeklyPlan: WeeklyMealPlan; dailyMeals: DailyMeal[] }>(
    ['weeklyMealPlan', user?.id, weekStartDateFormatted],
    async () => {
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
        throw new Error(weeklyPlanError.message);
      }

      if (!weeklyPlan) {
        console.log('No weekly meal plan found, returning null');
        return null;
      }

      const { data: dailyMeals, error: dailyMealsError } = await supabase
        .from('daily_meals')
        .select('*')
        .eq('weekly_meal_plan_id', weeklyPlan.id);

      if (dailyMealsError) {
        console.error('Error fetching daily meals:', dailyMealsError);
        throw new Error(dailyMealsError.message);
      }

      console.log(`Successfully fetched meal plan with ${dailyMeals?.length || 0} daily meals`);

      return { weeklyPlan, dailyMeals: dailyMeals || [] };
    },
    {
      enabled: !!user?.id,
      retry: false,
    }
  );

  const { mutate: createWeeklyPlan, isLoading: isCreatingPlan } = useMutation(
    async (meals: Omit<DailyMeal, 'id'>[]) => {
      if (!user?.id) {
        throw new Error('User not authenticated');
      }

      console.log(`Creating new weekly meal plan for user ${user.id} and week starting ${weekStartDateFormatted}`);

      const { data: newWeeklyPlan, error: weeklyPlanError } = await supabase
        .from('weekly_meal_plans')
        .insert([{ user_id: user.id, week_start_date: weekStartDateFormatted }])
        .select('*')
        .single();

      if (weeklyPlanError) {
        console.error('Error creating weekly meal plan:', weeklyPlanError);
        throw new Error(weeklyPlanError.message);
      }

      if (!newWeeklyPlan) {
        throw new Error('Failed to create weekly meal plan');
      }

      const mealsToInsert = meals.map(meal => ({
        ...meal,
        weekly_meal_plan_id: newWeeklyPlan.id,
      }));

      const { data: newDailyMeals, error: dailyMealsError } = await supabase
        .from('daily_meals')
        .insert(mealsToInsert)
        .select('*');

      if (dailyMealsError) {
        console.error('Error creating daily meals:', dailyMealsError);
        throw new Error(dailyMealsError.message);
      }

      console.log(`Successfully created new meal plan with ${newDailyMeals?.length || 0} daily meals`);

      return { weeklyPlan: newWeeklyPlan, dailyMeals: newDailyMeals };
    },
    {
      onSuccess: () => {
        console.log('Successfully created meal plan, invalidating query');
        queryClient.invalidateQueries(['weeklyMealPlan', user?.id, weekStartDateFormatted]);
        toast.success('Meal plan generated successfully!');
      },
      onError: (error: any) => {
        console.error('Error creating meal plan:', error);
        toast.error(error.message || 'Failed to generate meal plan');
      },
      onSettled: () => {
        setIsGenerating(false);
      },
    }
  );

  const { mutate: updateDailyMeals, isLoading: isUpdatingMeals } = useMutation(
    async (meals: DailyMeal[]) => {
      if (!weeklyPlanData?.weeklyPlan?.id) {
        throw new Error('No weekly meal plan found to update');
      }

      console.log(`Updating daily meals for weekly plan ${weeklyPlanData.weeklyPlan.id}`);

      const updates = meals.map(meal =>
        supabase
          .from('daily_meals')
          .update(meal)
          .eq('id', meal.id)
      );

      const results = await Promise.all(updates);

      const errors = results.filter(result => result.error);
      if (errors.length > 0) {
        console.error('Error updating daily meals:', errors);
        throw new Error(errors.map(error => error.error?.message).join('\n'));
      }

      console.log(`Successfully updated ${meals.length} daily meals`);

      return meals;
    },
    {
      onSuccess: () => {
        console.log('Successfully updated daily meals, invalidating query');
        queryClient.invalidateQueries(['weeklyMealPlan', user?.id, weekStartDateFormatted]);
        toast.success('Meal plan updated successfully!');
      },
      onError: (error: any) => {
        console.error('Error updating meal plan:', error);
        toast.error(error.message || 'Failed to update meal plan');
      },
    }
  );

  const { mutate: shuffleMeals, isLoading: isShufflingMeals } = useMutation(
    async (meals: DailyMeal[]) => {
      if (!weeklyPlanData?.weeklyPlan?.id) {
        throw new Error('No weekly meal plan found to shuffle');
      }

      console.log(`Shuffling meals for weekly plan ${weeklyPlanData.weeklyPlan.id}`);

      const shuffledMeals = meals.map(meal => ({
        ...meal,
        name: `${meal.name} (Shuffled)`,
      }));

      const updates = shuffledMeals.map(meal =>
        supabase
          .from('daily_meals')
          .update(meal)
          .eq('id', meal.id)
      );

      const results = await Promise.all(updates);

      const errors = results.filter(result => result.error);
      if (errors.length > 0) {
        console.error('Error shuffling meals:', errors);
        throw new Error(errors.map(error => error.error?.message).join('\n'));
      }

      console.log(`Successfully shuffled ${meals.length} daily meals`);

      return shuffledMeals;
    },
    {
      onSuccess: () => {
        console.log('Successfully shuffled meals, invalidating query');
        queryClient.invalidateQueries(['weeklyMealPlan', user?.id, weekStartDateFormatted]);
        toast.success('Meals shuffled successfully!');
      },
      onError: (error: any) => {
        console.error('Error shuffling meals:', error);
        toast.error(error.message || 'Failed to shuffle meals');
      },
      onSettled: () => {
        setIsShuffling(false);
      },
    }
  );

  const handleDateSelect = (date: Date) => {
    console.log('📅 Selected date:', date);
    setSelectedDate(date);
  };

  const handleGenerate = useCallback(
    async (meals: Omit<DailyMeal, 'id'>[]) => {
      setIsGenerating(true);
      try {
        await createWeeklyPlan(meals);
      } catch (error) {
        console.error('Failed to generate meal plan:', error);
        toast.error('Failed to generate meal plan');
      } finally {
        setIsGenerating(false);
      }
    },
    [createWeeklyPlan]
  );

  const handleUpdate = useCallback(
    async (meals: DailyMeal[]) => {
      try {
        await updateDailyMeals(meals);
      } catch (error) {
        console.error('Failed to update meal plan:', error);
        toast.error('Failed to update meal plan');
      }
    },
    [updateDailyMeals]
  );

  const handleShuffle = useCallback(
    async () => {
      setIsShuffling(true);
      if (weeklyPlanData?.dailyMeals) {
        try {
          await shuffleMeals(weeklyPlanData.dailyMeals);
        } catch (error) {
          console.error('Failed to shuffle meals:', error);
          toast.error('Failed to shuffle meals');
        } finally {
          setIsShuffling(false);
        }
      } else {
        toast.error('No meals to shuffle');
        setIsShuffling(false);
      }
    },
    [shuffleMeals, weeklyPlanData?.dailyMeals]
  );

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
    isCreatingPlan,
    handleGenerate,
    handleUpdate,
    isUpdatingMeals,
    isShuffling,
    isShufflingMeals,
    handleShuffle,
    showShoppingList,
    handleShowShoppingList,
    handleCloseShoppingList,
  };
};
