import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Plus, Target, TrendingUp, Award, Clock } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useFoodConsumption, FoodConsumptionLog } from "@/features/food-tracker/hooks";
import FoodLogTimeline from "./FoodLogTimeline";
import SimpleFoodTracker from "./SimpleFoodTracker";
import { format } from "date-fns";

interface TodayTabProps {
  key?: number;
  onAddFood: () => void;
}

const TodayTab = ({ key: forceRefreshKey, onAddFood }: TodayTabProps) => {
  const { t } = useLanguage();
  const { todayConsumption, todayMealPlan, isLoading, forceRefresh } = useFoodConsumption();

  useEffect(() => {
    console.log('🔄 TodayTab mounted/refreshed, fetching data...');
    forceRefresh();
  }, [forceRefresh, forceRefreshKey]);

  const dailyTotals = {
    consumption: (todayConsumption || []).reduce(
      (acc, item) => ({
        calories: acc.calories + (item.calories_consumed || 0),
        protein: acc.protein + (item.protein_consumed || 0),
        carbs: acc.carbs + (item.carbs_consumed || 0),
        fat: acc.fat + (item.fat_consumed || 0),
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    ),
    mealPlan: (todayMealPlan || []).reduce(
      (acc, item) => ({
        calories: acc.calories + (item.calories || 0),
        protein: acc.protein + (item.protein || 0),
        carbs: acc.carbs + (item.carbs || 0),
        fat: acc.fat + (item.fat || 0),
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    )
  };

  const combinedTotals = {
    calories: dailyTotals.consumption.calories,
    protein: dailyTotals.consumption.protein,
    carbs: dailyTotals.consumption.carbs,
    fat: dailyTotals.consumption.fat,
  };

  const dailyGoals = {
    calories: 2000,
    protein: 150,
    carbs: 250,
    fat: 65
  };

  const progress = {
    calories: dailyGoals.calories > 0 ? Math.min((combinedTotals.calories / dailyGoals.calories) * 100, 100) : 0,
    protein: dailyGoals.protein > 0 ? Math.min((combinedTotals.protein / dailyGoals.protein) * 100, 100) : 0,
    carbs: dailyGoals.carbs > 0 ? Math.min((combinedTotals.carbs / dailyGoals.carbs) * 100, 100) : 0,
    fat: dailyGoals.fat > 0 ? Math.min((combinedTotals.fat / dailyGoals.fat) * 100, 100) : 0
  };

  const mealDistribution = (todayConsumption || []).reduce((acc, item) => {
    const mealTypeKey = item.meal_type || 'snack'; 
    acc[mealTypeKey] = (acc[mealTypeKey] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const totalMeals: number = Object.values(mealDistribution).reduce((sum: number, count: number) => sum + count, 0);

  const todayStats = {
    calories: combinedTotals.calories,
    protein: combinedTotals.protein,
    remainingCalories: Math.max(0, dailyGoals.calories - combinedTotals.calories),
    mealsLogged: totalMeals 
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <SimpleFoodTracker 
      refreshKey={forceRefreshKey}
      onAddFood={onAddFood}
    />
  );
};

export default TodayTab;
