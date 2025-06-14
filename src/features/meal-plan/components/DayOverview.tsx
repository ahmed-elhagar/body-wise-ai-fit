
import React from 'react';
import { Card } from "@/components/ui/card";
import { format, addDays } from 'date-fns';
import { useTranslation } from 'react-i18next';
import MealTypeSection from "./daily-view/MealTypeSection";
import DailyNutritionSummary from "./daily-view/DailyNutritionSummary";
import EmptyDailyState from "./daily-view/EmptyDailyState";
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
}

const DayOverview = ({
  selectedDayNumber,
  dailyMeals,
  totalCalories,
  totalProtein,
  targetDayCalories,
  onViewMeal,
  onExchangeMeal,
  onAddSnack,
  weekStartDate
}: DayOverviewProps) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  // Calculate the actual date for the selected day
  const selectedDate = addDays(weekStartDate, selectedDayNumber - 1);
  const formattedDate = format(selectedDate, 'EEEE, MMM d');

  // Group meals by type
  const mealsByType = {
    breakfast: dailyMeals.filter(meal => meal.meal_type === 'breakfast'),
    lunch: dailyMeals.filter(meal => meal.meal_type === 'lunch'),
    dinner: dailyMeals.filter(meal => meal.meal_type === 'dinner'),
    snack: dailyMeals.filter(meal => 
      meal.meal_type?.includes('snack') || meal.name?.includes('🍎')
    ),
  };

  const handleShowShoppingList = () => {
    // This will be handled by the parent component
    console.log('Shopping list requested');
  };

  if (dailyMeals.length === 0) {
    return <EmptyDailyState onGenerate={() => console.log('Generate requested')} />;
  }

  return (
    <div className="space-y-4">
      {/* Day Header */}
      <Card className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 border-0 shadow-sm">
        <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div>
            <h1 className="text-xl font-bold text-gray-800">{formattedDate}</h1>
            <p className="text-sm text-gray-600">{t('common.day')} {selectedDayNumber}</p>
          </div>
          <div className={`text-right ${isRTL ? 'text-left' : ''}`}>
            <div className="text-2xl font-bold text-blue-600">{totalCalories}</div>
            <div className="text-xs text-gray-500">{t('common.calories')}</div>
          </div>
        </div>
      </Card>

      {/* Nutrition Summary */}
      <DailyNutritionSummary
        totalCalories={totalCalories}
        totalProtein={totalProtein}
        onShowShoppingList={handleShowShoppingList}
        onAddSnack={onAddSnack}
      />

      {/* Meals by Type */}
      <div className="space-y-3">
        {Object.entries(mealsByType).map(([mealType, meals]) => (
          <MealTypeSection
            key={mealType}
            mealType={mealType}
            meals={meals}
            onShowRecipe={onViewMeal}
            onExchangeMeal={(meal, index) => onExchangeMeal(meal)}
          />
        ))}
      </div>
    </div>
  );
};

export default DayOverview;
