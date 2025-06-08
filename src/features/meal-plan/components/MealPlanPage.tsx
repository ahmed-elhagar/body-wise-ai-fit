
import React from 'react';
import { Card } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { useMealPlanCore } from '../hooks/useMealPlanCore';

export const MealPlanPage: React.FC = () => {
  const { t } = useLanguage();
  const {
    currentWeekPlan,
    dailyMeals,
    totalCalories,
    totalProtein,
    targetDayCalories,
    isLoading,
    selectedDayNumber,
    weekStartDate
  } = useMealPlanCore();
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
        <div className="container mx-auto px-4 py-6">
          <Card className="p-6">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
      <div className="container mx-auto px-4 py-6">
        <Card className="p-6">
          <h1 className="text-2xl font-bold mb-4">{t('mealPlan.title')}</h1>
          
          {currentWeekPlan ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-blue-800">Day {selectedDayNumber}</h3>
                  <p className="text-sm text-blue-600">{weekStartDate?.toLocaleDateString()}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-green-800">Calories</h3>
                  <p className="text-sm text-green-600">{totalCalories} / {targetDayCalories}</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-purple-800">Protein</h3>
                  <p className="text-sm text-purple-600">{totalProtein}g</p>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold mb-3">Today's Meals ({dailyMeals?.length || 0})</h3>
                <div className="grid gap-3">
                  {dailyMeals && dailyMeals.length > 0 ? (
                    dailyMeals.map((meal, index) => (
                      <Card key={index} className="p-4">
                        <h4 className="font-medium">{meal.name}</h4>
                        <p className="text-sm text-gray-600">{meal.calories} calories • {meal.protein}g protein</p>
                      </Card>
                    ))
                  ) : (
                    <p className="text-gray-500">No meals planned for this day.</p>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600 mb-4">No meal plan found for this week.</p>
              <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                Generate Meal Plan
              </button>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default MealPlanPage;
