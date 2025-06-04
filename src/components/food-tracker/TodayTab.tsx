
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
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
      {/* Macros Overview */}
      <div className="lg:col-span-1">
        <Card className="sticky top-6">
          <CardHeader>
            <CardTitle className="text-green-700 flex items-center gap-2">
              {t('Daily Nutrition')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <MacroWheel 
              calories={combinedTotals.calories}
              protein={combinedTotals.protein}
              carbs={combinedTotals.carbs}
              fat={combinedTotals.fat}
            />
            
            <div className="mt-6 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">{t('Calories')}</span>
                <span className="font-semibold text-gray-900">
                  {Math.round(combinedTotals.calories)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">{t('Protein')}</span>
                <span className="font-semibold text-gray-900">
                  {Math.round(combinedTotals.protein)}g
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">{t('Carbs')}</span>
                <span className="font-semibold text-gray-900">
                  {Math.round(combinedTotals.carbs)}g
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">{t('Fat')}</span>
                <span className="font-semibold text-gray-900">
                  {Math.round(combinedTotals.fat)}g
                </span>
              </div>
            </div>

            {/* Show meal plan summary if available */}
            {todayMealPlan && todayMealPlan.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-700">{t('Meal Plan Available')}</span>
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
                {t('Today\'s Food Log')} - {format(new Date(), 'MMM d, yyyy')}
              </CardTitle>
              <Button
                onClick={() => setShowAddDialog(true)}
                className="bg-green-600 hover:bg-green-700 text-white"
                size="sm"
              >
                <Plus className="w-4 h-4 mr-2" />
                {t('Add Food')}
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
                  <h3 className="font-medium text-gray-900">{t('Today\'s Meal Plan')}</h3>
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
                  {t('Use the search tab to quickly add these planned meals to your food log')}
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
