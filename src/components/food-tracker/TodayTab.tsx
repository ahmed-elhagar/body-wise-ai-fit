import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Plus, Target, TrendingUp, Award, Clock } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useFoodConsumption, FoodConsumptionLog } from "@/features/food-tracker/hooks";
import EnhancedMacroWheel from "./components/EnhancedMacroWheel";
import EnhancedFoodTimeline from "./components/EnhancedFoodTimeline";
import MobileOptimizedHeader from "./components/MobileOptimizedHeader";
import AddFoodDialog from "./AddFoodDialog/AddFoodDialog";
import { format } from "date-fns";

interface TodayTabProps {
  key?: number;
  onAddFood: () => void;
}

const TodayTab = ({ key: forceRefreshKey, onAddFood }: TodayTabProps) => {
  const { t } = useLanguage();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const { todayConsumption, todayMealPlan, isLoading, forceRefresh } = useFoodConsumption();

  useEffect(() => {
    console.log('🔄 TodayTab mounted/refreshed, fetching data...');
    forceRefresh();
  }, [forceRefresh, forceRefreshKey]);

  const dailyTotals = {
    consumption: todayConsumption?.reduce(
      (acc, item) => ({
        calories: acc.calories + (item.calories_consumed || 0),
        protein: acc.protein + (item.protein_consumed || 0),
        carbs: acc.carbs + (item.carbs_consumed || 0),
        fat: acc.fat + (item.fat_consumed || 0),
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    ) || { calories: 0, protein: 0, carbs: 0, fat: 0 },

    mealPlan: todayMealPlan?.reduce(
      (acc, item) => ({
        calories: acc.calories + (item.calories || 0),
        protein: acc.protein + (item.protein || 0),
        carbs: acc.carbs + (item.carbs || 0),
        fat: acc.fat + (item.fat || 0),
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    ) || { calories: 0, protein: 0, carbs: 0, fat: 0 }
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

  const mealDistribution = todayConsumption?.reduce((acc, item) => {
    const mealTypeKey = item.meal_type || 'snack'; // Ensure meal_type is a string key
    acc[mealTypeKey] = (acc[mealTypeKey] || 0) + 1;
    return acc;
  }, {} as Record<string, number>) || {};

  const totalMeals: number = Object.values(mealDistribution).reduce((sum: number, count: number) => sum + count, 0);

  const handleFoodAdded = async () => {
    console.log('🍎 Food added, closing dialog and refreshing data...');
    setShowAddDialog(false);
    
    // Force immediate refresh with longer delay to ensure DB consistency
    setTimeout(async () => {
      console.log('🔄 Executing delayed refresh...');
      await forceRefresh();
    }, 1000);
  };

  const todayStats = {
    calories: combinedTotals.calories,
    protein: combinedTotals.protein,
    remainingCalories: Math.max(0, dailyGoals.calories - combinedTotals.calories),
    mealsLogged: totalMeals // Now a number
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Mobile optimized header - only show on mobile */}
      <div className="lg:hidden">
        <MobileOptimizedHeader 
          todayStats={todayStats} // todayStats.mealsLogged is now number
          onAddFood={onAddFood}
        />
      </div>

      {/* Main content grid - responsive layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Nutrition Overview - Full width on mobile, 1/3 on desktop */}
        <div className="lg:col-span-1">
          <Card className="h-fit">
            <CardHeader className="pb-4">
              <CardTitle className="text-green-700 flex items-center gap-2">
                <Target className="w-5 h-5" />
                Daily Nutrition
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Enhanced Macro Wheel */}
              <EnhancedMacroWheel 
                calories={combinedTotals.calories}
                protein={combinedTotals.protein}
                carbs={combinedTotals.carbs}
                fat={combinedTotals.fat}
                goalCalories={dailyGoals.calories}
              />
              
              {/* Simplified Progress Bars - Mobile optimized */}
              <div className="space-y-3">
                <h4 className="font-medium text-gray-700 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Goal Progress
                </h4>
                
                {/* Protein Progress */}
                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-600">Protein</span>
                    <span className="text-sm text-gray-500">
                      {Math.round(combinedTotals.protein)}g / {dailyGoals.protein}g
                    </span>
                  </div>
                  <Progress value={progress.protein} className="h-2" />
                </div>

                {/* Carbs Progress */}
                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-600">Carbs</span>
                    <span className="text-sm text-gray-500">
                      {Math.round(combinedTotals.carbs)}g / {dailyGoals.carbs}g
                    </span>
                  </div>
                  <Progress value={progress.carbs} className="h-2" />
                </div>
              </div>

              {/* Quick Stats */}
              <div className="space-y-2 pt-4 border-t border-gray-200">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="text-center p-2 bg-gray-50 rounded">
                    <div className="font-semibold text-gray-900">{totalMeals}</div>
                    <div className="text-gray-600">Meals</div>
                  </div>
                  <div className="text-center p-2 bg-gray-50 rounded">
                    <div className="font-semibold text-gray-900">
                      {Math.max(0, dailyGoals.calories - combinedTotals.calories)}
                    </div>
                    <div className="text-gray-600">Remaining</div>
                  </div>
                </div>
                {combinedTotals.calories > 0 && totalMeals > 0 && ( // totalMeals is number
                  <div className="text-center p-2 bg-green-50 rounded">
                    <div className="font-semibold text-green-900">
                      {Math.round(combinedTotals.calories / totalMeals)} {/* totalMeals is number */}
                    </div>
                    <div className="text-green-600 text-xs">Avg Cal/Meal</div>
                  </div>
                )}
              </div>

              {/* Achievement Badges - Compact */}
              {(progress.calories >= 80 || progress.protein >= 100 || totalMeals >= 3) && ( // totalMeals is number
                <div className="space-y-2">
                  <h4 className="font-medium text-gray-700 flex items-center gap-2">
                    <Award className="w-4 h-4" />
                    Today's Wins
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {progress.calories >= 80 && (
                      <Badge className="text-xs bg-green-100 text-green-800 border-green-200">
                        🎯 Great progress!
                      </Badge>
                    )}
                    {progress.protein >= 100 && (
                      <Badge className="text-xs bg-blue-100 text-blue-800 border-blue-200">
                        💪 Protein goal!
                      </Badge>
                    )}
                    {totalMeals >= 3 && (
                      <Badge className="text-xs bg-purple-100 text-purple-800 border-purple-200">
                        🍽️ Regular meals!
                      </Badge>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Food Timeline - Full width on mobile, 2/3 on desktop */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-gray-900 flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Today's Food Log
                  <Badge variant="outline" className="ml-2">
                    {format(new Date(), 'MMM d')}
                  </Badge>
                </CardTitle>
                <Button
                  onClick={onAddFood}
                  className="hidden lg:flex bg-green-600 hover:bg-green-700 text-white"
                  size="sm"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Food
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <EnhancedFoodTimeline 
                foodLogs={(todayConsumption || []) as FoodConsumptionLog[]} // Ensure type for foodLogs
                onRefetch={forceRefresh}
              />
              
              {/* Show meal plan items if no consumption yet */}
              {(!todayConsumption || todayConsumption.length === 0) && todayMealPlan && todayMealPlan.length > 0 && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                    <h3 className="font-medium text-gray-900">Today's Meal Plan</h3>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {todayMealPlan.map((meal) => (
                      <div key={meal.id} className="flex items-center justify-between p-3 bg-purple-50 rounded-lg border border-purple-200">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-purple-900 truncate">{meal.name}</h4>
                          <p className="text-sm text-purple-600 capitalize">{meal.meal_type}</p>
                        </div>
                        <div className="text-right text-sm text-purple-700 ml-3">
                          <div className="font-medium">{Math.round(meal.calories || 0)} cal</div>
                          <div className="text-xs">
                            {Math.round(meal.protein || 0)}p • {Math.round(meal.carbs || 0)}c • {Math.round(meal.fat || 0)}f
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-3 text-center">
                    Use the add button to quickly log these planned meals
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Floating Add Button for Mobile */}
      <div className="fixed bottom-6 right-6 lg:hidden z-50">
        <Button
          onClick={onAddFood}
          className="w-14 h-14 rounded-full bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
          size="icon"
        >
          <Plus className="w-6 h-6" />
        </Button>
      </div>

      {/* Add Food Dialog - only show if internal dialog is used */}
      <AddFoodDialog
        isOpen={showAddDialog}
        onClose={() => setShowAddDialog(false)}
        onFoodAdded={handleFoodAdded}
      />
    </div>
  );
};

export default TodayTab;
