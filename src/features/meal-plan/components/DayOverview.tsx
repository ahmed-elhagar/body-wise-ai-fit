
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Utensils, Target, ShoppingCart } from "lucide-react";
import { format } from 'date-fns';
import { useMealPlanTranslations } from '@/utils/mealPlanTranslations';
import { getDayName } from '@/utils/mealPlanUtils';
import { EnhancedMealCard } from './EnhancedMealCard';
import { AddMealCard } from './AddMealCard';
import ShoppingListDrawer from '@/components/shopping-list/ShoppingListDrawer';
import type { DailyMeal } from '../types';

interface DayOverviewProps {
  selectedDayNumber: number;
  dailyMeals: DailyMeal[];
  totalCalories: number;
  totalProtein: number;
  targetDayCalories: number;
  onViewMeal: (meal: DailyMeal) => void;
  onExchangeMeal: (meal: DailyMeal) => void;
  onAddSnack: () => void;
  weekStartDate: Date;
  weeklyPlan?: any;
}

export const DayOverview = ({
  selectedDayNumber,
  dailyMeals,
  totalCalories,
  totalProtein,
  targetDayCalories,
  onViewMeal,
  onExchangeMeal,
  onAddSnack,
  weekStartDate,
  weeklyPlan
}: DayOverviewProps) => {
  const [showShoppingList, setShowShoppingList] = useState(false);
  
  const {
    dailyProgress,
    calorieProgress,
    consumed,
    target,
    cal,
    protein,
    mealTypes,
    language,
    shoppingList
  } = useMealPlanTranslations();

  const calorieProgressPercent = Math.min((totalCalories / targetDayCalories) * 100, 100);
  const remainingCalories = Math.max(0, targetDayCalories - totalCalories);

  // Group meals by type
  const mealsByType = dailyMeals.reduce((acc, meal) => {
    if (!acc[meal.meal_type]) {
      acc[meal.meal_type] = [];
    }
    acc[meal.meal_type].push(meal);
    return acc;
  }, {} as Record<string, DailyMeal[]>);

  // Define meal type order and create meal grid
  const mealTypeOrder = ['breakfast', 'lunch', 'dinner', 'snack1', 'snack2'];
  const allMeals: Array<{ type: 'meal' | 'add'; meal?: DailyMeal; mealType?: string }> = [];

  mealTypeOrder.forEach(mealType => {
    const mealsForType = mealsByType[mealType] || [];
    mealsForType.forEach(meal => {
      allMeals.push({ type: 'meal', meal });
    });
    
    // Add "add meal" card for empty snack slots
    if (['snack1', 'snack2'].includes(mealType) && mealsForType.length === 0) {
      allMeals.push({ type: 'add', mealType: 'snack' });
    }
  });

  return (
    <div className="space-y-6">
      {/* Compact Day Header with Actions */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-fitness-primary-900">
            {getDayName(selectedDayNumber)}
          </h2>
          <p className="text-fitness-primary-600">
            {format(new Date(weekStartDate.getTime() + (selectedDayNumber - 1) * 24 * 60 * 60 * 1000), 'MMMM d, yyyy')}
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          {weeklyPlan?.dailyMeals && weeklyPlan.dailyMeals.length > 0 && (
            <Button
              onClick={() => setShowShoppingList(true)}
              variant="outline"
              size="sm"
              className="border-fitness-primary-300 bg-white text-fitness-primary-600 hover:bg-fitness-primary-50"
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              {shoppingList}
            </Button>
          )}
        </div>
      </div>

      {/* Compact Daily Progress Card */}
      <Card className="bg-gradient-to-r from-fitness-primary-50 to-fitness-accent-50 border-fitness-primary-200">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg text-fitness-primary-900">
            <Utensils className="w-5 h-5 text-fitness-primary-600" />
            {dailyProgress}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0 space-y-4">
          {/* Calorie Progress Bar */}
          <div>
            <div className="flex justify-between items-center text-sm mb-2">
              <span className="text-fitness-primary-700">{calorieProgress}</span>
              <span className="font-medium text-fitness-primary-900">{totalCalories}/{targetDayCalories} {cal}</span>
            </div>
            <Progress value={calorieProgressPercent} className="h-3 bg-white/50">
              <div 
                className="h-full bg-gradient-to-r from-fitness-primary-500 to-fitness-primary-600 rounded-full transition-all duration-300"
                style={{ width: `${calorieProgressPercent}%` }}
              />
            </Progress>
          </div>
          
          {/* Compact Stats Grid */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 text-center border border-white/50 shadow-sm">
              <div className="text-2xl font-bold text-orange-600">{totalCalories}</div>
              <div className="text-xs text-fitness-primary-600 font-medium">{consumed}</div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 text-center border border-white/50 shadow-sm">
              <div className="text-2xl font-bold text-green-600">{totalProtein.toFixed(1)}g</div>
              <div className="text-xs text-fitness-primary-600 font-medium">{protein}</div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 text-center border border-white/50 shadow-sm">
              <div className="text-2xl font-bold text-blue-600">{remainingCalories}</div>
              <div className="text-xs text-fitness-primary-600 font-medium">Remaining</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Meals Grid */}
      {allMeals.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {allMeals.map((item, index) => (
            <div key={index}>
              {item.type === 'meal' && item.meal ? (
                <EnhancedMealCard
                  meal={item.meal}
                  onViewMeal={onViewMeal}
                  onExchangeMeal={onExchangeMeal}
                />
              ) : (
                <AddMealCard
                  mealType={item.mealType}
                  onAddMeal={onAddSnack}
                />
              )}
            </div>
          ))}
        </div>
      ) : (
        // Empty State
        <Card className="border-dashed border-2 border-fitness-primary-300 bg-gradient-to-br from-fitness-primary-50 to-white">
          <CardContent className="p-8 text-center">
            <Target className="w-16 h-16 mx-auto mb-4 text-fitness-primary-400" />
            <h3 className="text-xl font-semibold mb-2 text-fitness-primary-800">No meals planned for this day</h3>
            <p className="text-fitness-primary-600 mb-6 max-w-md mx-auto">
              Start planning your meals to reach your daily nutrition goals.
            </p>
            <AddMealCard mealType="snack" onAddMeal={onAddSnack} />
          </CardContent>
        </Card>
      )}

      {/* Shopping List Drawer */}
      {weeklyPlan && (
        <ShoppingListDrawer
          isOpen={showShoppingList}
          onClose={() => setShowShoppingList(false)}
          weeklyPlan={weeklyPlan}
          weekId={weeklyPlan?.weeklyPlan?.id}
          onShoppingListUpdate={() => {
            console.log('Shopping list updated');
          }}
        />
      )}
    </div>
  );
};
