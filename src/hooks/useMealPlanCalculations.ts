
import { useMemo, useCallback } from "react";
import { useProfile } from "@/hooks/useProfile";
import type { Meal } from "@/types/meal";

export const useMealPlanCalculations = (currentWeekPlan: any, selectedDayNumber: number) => {
  const { profile } = useProfile();

  // Memoized conversion from DailyMeal to Meal type
  const convertDailyMealToMeal = useCallback((dailyMeal: any): Meal => ({
    id: dailyMeal.id,
    type: dailyMeal.meal_type || 'meal',
    meal_type: dailyMeal.meal_type,
    time: dailyMeal.meal_type === 'breakfast' ? '08:00' : 
          dailyMeal.meal_type === 'lunch' ? '12:00' :
          dailyMeal.meal_type === 'dinner' ? '18:00' : '15:00',
    name: dailyMeal.name || 'Unnamed Meal',
    calories: Math.round(dailyMeal.calories || 0),
    protein: Math.round((dailyMeal.protein || 0) * 10) / 10,
    carbs: Math.round((dailyMeal.carbs || 0) * 10) / 10,
    fat: Math.round((dailyMeal.fat || 0) * 10) / 10,
    ingredients: Array.isArray(dailyMeal.ingredients) ? dailyMeal.ingredients : [],
    instructions: Array.isArray(dailyMeal.instructions) ? dailyMeal.instructions : [],
    cookTime: dailyMeal.cook_time || 15,
    prepTime: dailyMeal.prep_time || 10,
    servings: dailyMeal.servings || 1,
    image: dailyMeal.image_url || '',
    image_url: dailyMeal.image_url || '',
    youtubeId: dailyMeal.youtube_search_term || '',
    youtube_search_term: dailyMeal.youtube_search_term
  }), []);

  // Memoized today's meals with better filtering and debugging
  const todaysMeals = useMemo(() => {
    const todaysDailyMeals = currentWeekPlan?.dailyMeals?.filter(meal => 
      meal.day_number === selectedDayNumber
    ) || [];
    
    console.log('🍽️ TODAY\'S MEALS DEBUG:', {
      selectedDayNumber,
      totalDailyMeals: currentWeekPlan?.dailyMeals?.length || 0,
      filteredMealsCount: todaysDailyMeals.length,
      meals: todaysDailyMeals.map(m => ({ day: m.day_number, type: m.meal_type, name: m.name, calories: m.calories }))
    });
    
    return todaysDailyMeals.map(convertDailyMealToMeal);
  }, [currentWeekPlan?.dailyMeals, selectedDayNumber, convertDailyMealToMeal]);
  
  // Enhanced nutrition calculations with proper data validation
  const { totalCalories, totalProtein } = useMemo(() => {
    const calories = todaysMeals.reduce((sum, meal) => {
      const mealCalories = Number(meal.calories) || 0;
      return sum + mealCalories;
    }, 0);
    
    const protein = todaysMeals.reduce((sum, meal) => {
      const mealProtein = Number(meal.protein) || 0;
      return sum + mealProtein;
    }, 0);

    console.log('📊 NUTRITION CALCULATIONS:', {
      selectedDay: selectedDayNumber,
      mealsCount: todaysMeals.length,
      totalCalories: calories,
      totalProtein: protein,
      mealBreakdown: todaysMeals.map(m => ({
        name: m.name,
        calories: m.calories,
        protein: m.protein
      }))
    });
    
    return {
      totalCalories: Math.round(calories),
      totalProtein: Math.round(protein * 10) / 10
    };
  }, [todaysMeals, selectedDayNumber]);

  // Calculate target calories from user profile
  const getTargetDayCalories = useCallback(() => {
    if (profile?.weight && profile?.height && profile?.age) {
      const weight = Number(profile.weight);
      const height = Number(profile.height);
      const age = Number(profile.age);
      
      let bmr = 0;
      if (profile.gender === 'male') {
        bmr = 10 * weight + 6.25 * height - 5 * age + 5;
      } else {
        bmr = 10 * weight + 6.25 * height - 5 * age - 161;
      }
      
      const activityMultipliers = {
        'sedentary': 1.2,
        'lightly_active': 1.375,
        'moderately_active': 1.55,
        'very_active': 1.725,
        'extremely_active': 1.9
      };
      
      const multiplier = activityMultipliers[profile.activity_level as keyof typeof activityMultipliers] || 1.375;
      
      let calorieAdjustment = 1;
      if (profile.fitness_goal === 'lose_weight') {
        calorieAdjustment = 0.85;
      } else if (profile.fitness_goal === 'gain_weight') {
        calorieAdjustment = 1.15;
      }
      
      return Math.round(bmr * multiplier * calorieAdjustment);
    }
    
    return 2000; // Default fallback
  }, [profile]);

  const targetDayCalories = getTargetDayCalories();

  return {
    todaysMeals,
    totalCalories,
    totalProtein,
    targetDayCalories,
    convertDailyMealToMeal
  };
};
