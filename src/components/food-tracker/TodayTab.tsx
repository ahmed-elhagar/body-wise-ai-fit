
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Plus, Target, TrendingUp, Award, Clock } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useFoodConsumption } from "@/hooks/useFoodConsumption";
import MacroWheel from "./components/MacroWheel";
import FoodLogTimeline from "./components/FoodLogTimeline";
import AddFoodDialog from "./AddFoodDialog/AddFoodDialog";
import { format } from "date-fns";

const TodayTab = ({ key: forceRefreshKey }: { key?: number }) => {
  const { t } = useLanguage();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const { todayConsumption, todayMealPlan, isLoading, forceRefresh } = useFoodConsumption();

  // Force a refresh when component mounts or key changes
  useEffect(() => {
    console.log('🔄 TodayTab mounted/refreshed, fetching data...');
    forceRefresh();
  }, [forceRefresh, forceRefreshKey]);

  // Debug consumption data changes
  useEffect(() => {
    console.log('📊 TodayTab data updated:', {
      consumptionCount: todayConsumption?.length || 0,
      mealPlanCount: todayMealPlan?.length || 0,
      consumptionItems: todayConsumption?.slice(0, 2),
      mealPlanItems: todayMealPlan?.slice(0, 2)
    });
  }, [todayConsumption, todayMealPlan]);

  // Calculate daily totals from both consumption and meal plan
  const dailyTotals = {
    // Totals from logged consumption
    consumption: todayConsumption?.reduce(
      (acc, item) => ({
        calories: acc.calories + (item.calories_consumed || 0),
        protein: acc.protein + (item.protein_consumed || 0),
        carbs: acc.carbs + (item.carbs_consumed || 0),
        fat: acc.fat + (item.fat_consumed || 0),
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    ) || { calories: 0, protein: 0, carbs: 0, fat: 0 },

    // Totals from meal plan (planned but not necessarily consumed)
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

  // Combined totals (consumption takes priority)
  const combinedTotals = {
    calories: dailyTotals.consumption.calories,
    protein: dailyTotals.consumption.protein,
    carbs: dailyTotals.consumption.carbs,
    fat: dailyTotals.consumption.fat,
  };

  // Calculate daily goals and progress (example targets - could be user-specific)
  const dailyGoals = {
    calories: 2000,
    protein: 150,
    carbs: 250,
    fat: 65
  };

  const progress = {
    calories: Math.min((combinedTotals.calories / dailyGoals.calories) * 100, 100),
    protein: Math.min((combinedTotals.protein / dailyGoals.protein) * 100, 100),
    carbs: Math.min((combinedTotals.carbs / dailyGoals.carbs) * 100, 100),
    fat: Math.min((combinedTotals.fat / dailyGoals.fat) * 100, 100)
  };

  // Calculate meal distribution
  const mealDistribution = todayConsumption?.reduce((acc, item) => {
    acc[item.meal_type] = (acc[item.meal_type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>) || {};

  const totalMeals = Object.values(mealDistribution).reduce((sum, count) => sum + count, 0);

  const handleFoodAdded = async () => {
    console.log('🍎 Food added, closing dialog and refreshing data...');
    setShowAddDialog(false);
    
    // Force immediate refresh with longer delay to ensure DB consistency
    setTimeout(async () => {
      console.log('🔄 Executing delayed refresh...');
      await forceRefresh();
    }, 1000);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  console.log('📊 TodayTab rendering with data:', {
    consumptionCount: todayConsumption?.length || 0,
    mealPlanCount: todayMealPlan?.length || 0,
    combinedTotals
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Streamlined Daily Nutrition Panel */}
      <div className="lg:col-span-1">
        <Card className="sticky top-6">
          <CardHeader>
            <CardTitle className="text-green-700 flex items-center gap-2">
              <Target className="w-5 h-5" />
              Daily Nutrition
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Macro Wheel */}
            <MacroWheel 
              calories={combinedTotals.calories}
              protein={combinedTotals.protein}
              carbs={combinedTotals.carbs}
              fat={combinedTotals.fat}
            />
            
            {/* Progress Bars - Simplified */}
            <div className="space-y-3">
              <h4 className="font-medium text-gray-700 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Goal Progress
              </h4>
              
              {/* Calories Progress */}
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-600">Calories</span>
                  <span className="text-sm text-gray-500">
                    {Math.round(combinedTotals.calories)} / {dailyGoals.calories}
                  </span>
                </div>
                <Progress value={progress.calories} className="h-2" />
              </div>

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
            </div>

            {/* Quick Stats */}
            <div className="space-y-2 pt-4 border-t border-gray-200">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Meals Logged</span>
                <span className="font-medium text-gray-900">{totalMeals}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Remaining Calories</span>
                <span className="font-medium text-gray-900">
                  {Math.max(0, dailyGoals.calories - combinedTotals.calories)}
                </span>
              </div>
              {combinedTotals.calories > 0 && totalMeals > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Avg Cal/Meal</span>
                  <span className="font-medium text-gray-900">
                    {Math.round(combinedTotals.calories / totalMeals)}
                  </span>
                </div>
              )}
            </div>

            {/* Achievement Badges - Only show relevant ones */}
            {(progress.calories >= 80 || progress.protein >= 100 || totalMeals >= 3) && (
              <div className="space-y-3">
                <h4 className="font-medium text-gray-700 flex items-center gap-2">
                  <Award className="w-4 h-4" />
                  Achievements
                </h4>
                <div className="space-y-2">
                  {progress.calories >= 80 && (
                    <Badge className="w-full justify-center bg-green-100 text-green-800">
                      🎯 Great calorie progress!
                    </Badge>
                  )}
                  {progress.protein >= 100 && (
                    <Badge className="w-full justify-center bg-blue-100 text-blue-800">
                      💪 Protein goal achieved!
                    </Badge>
                  )}
                  {totalMeals >= 3 && (
                    <Badge className="w-full justify-center bg-purple-100 text-purple-800">
                      🍽️ Regular meal pattern!
                    </Badge>
                  )}
                </div>
              </div>
            )}

            {/* Show meal plan summary if available and no consumption */}
            {(!todayConsumption || todayConsumption.length === 0) && todayMealPlan && todayMealPlan.length > 0 && (
              <div className="pt-4 border-t border-gray-200">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-700">Meal Plan Available</span>
                </div>
                <p className="text-xs text-gray-500">
                  {todayMealPlan.length} planned meals ({Math.round(dailyTotals.mealPlan.calories)} cal)
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Food Timeline */}
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-gray-900">
                Today's Food Log - {format(new Date(), 'MMM d, yyyy')}
              </CardTitle>
              <Button
                onClick={() => setShowAddDialog(true)}
                className="bg-green-600 hover:bg-green-700 text-white"
                size="sm"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Food
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <FoodLogTimeline 
              foodLogs={todayConsumption || []}
              onRefetch={forceRefresh}
            />
            
            {/* Show meal plan items if no consumption yet */}
            {(!todayConsumption || todayConsumption.length === 0) && todayMealPlan && todayMealPlan.length > 0 && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <h3 className="font-medium text-gray-900">Today's Meal Plan</h3>
                </div>
                <div className="space-y-3">
                  {todayMealPlan.map((meal) => (
                    <div key={meal.id} className="flex items-center justify-between p-3 bg-purple-50 rounded-lg border border-purple-200">
                      <div>
                        <h4 className="font-medium text-purple-900">{meal.name}</h4>
                        <p className="text-sm text-purple-600 capitalize">{meal.meal_type}</p>
                      </div>
                      <div className="text-right text-sm text-purple-700">
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

      {/* Floating Add Button for Mobile */}
      <div className="fixed bottom-6 right-6 lg:hidden">
        <Button
          onClick={() => setShowAddDialog(true)}
          className="w-14 h-14 rounded-full bg-green-600 hover:bg-green-700 text-white shadow-lg"
          size="icon"
        >
          <Plus className="w-6 h-6" />
        </Button>
      </div>

      {/* Add Food Dialog */}
      <AddFoodDialog
        isOpen={showAddDialog}
        onClose={() => setShowAddDialog(false)}
        onFoodAdded={handleFoodAdded}
      />
    </div>
  );
};

export default TodayTab;
