
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/contexts/LanguageContext';
import { useMealPlanData } from '@/hooks/meal-plan/useMealPlanData';
import { useMealPlanNavigation } from './useMealPlanNavigation';
import { useMealPlanCalculations } from './useMealPlanCalculations';

export const useMealPlanCore = () => {
  const { user } = useAuth();
  const { language } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
  
  // Navigation state
  const {
    currentWeekOffset,
    setCurrentWeekOffset,
    selectedDayNumber,
    setSelectedDayNumber,
    weekStartDate
  } = useMealPlanNavigation();

  // Core meal plan data
  const {
    data: currentWeekPlan,
    isLoading: isMealPlanLoading,
    error: mealPlanError,
    refetch: refetchMealPlan,
  } = useMealPlanData(currentWeekOffset);

  // Calculations
  const {
    dailyMeals,
    todaysMeals,
    totalCalories,
    totalProtein,
    targetDayCalories,
  } = useMealPlanCalculations(currentWeekPlan, selectedDayNumber);

  return {
    // Core state
    user,
    language,
    isLoading: isLoading || isMealPlanLoading,
    
    // Data
    currentWeekPlan,
    dailyMeals,
    todaysMeals,
    
    // Navigation
    currentWeekOffset,
    setCurrentWeekOffset,
    selectedDayNumber,
    setSelectedDayNumber,
    weekStartDate,
    
    // Calculations
    totalCalories,
    totalProtein,
    targetDayCalories,
    
    // Actions
    refetchMealPlan,
    mealPlanError,
  };
};
