
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, Plus } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import MealCard from "./MealCard";
import type { Meal } from "@/types/meal";

interface MealPlanContentProps {
  viewMode: 'daily' | 'weekly';
  currentWeekPlan: any;
  todaysMeals: Meal[];
  onGenerate: () => void;
  onShowRecipe: (meal: Meal) => void;
  onExchangeMeal: (meal: Meal, index: number) => void;
}

const MealPlanContent = ({
  viewMode,
  currentWeekPlan,
  todaysMeals,
  onGenerate,
  onShowRecipe,
  onExchangeMeal
}: MealPlanContentProps) => {
  const { t, isRTL } = useLanguage();

  // If no meal plan exists, show generation prompt
  if (!currentWeekPlan) {
    return (
      <Card className={`p-6 sm:p-8 text-center bg-gradient-to-br from-blue-50 to-indigo-100 border-0 shadow-lg ${isRTL ? 'text-right' : 'text-left'}`}>
        <div className="max-w-md mx-auto space-y-4">
          <div className="w-16 h-16 bg-fitness-gradient rounded-full flex items-center justify-center mx-auto">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800">
            {t('mealPlan.noActivePlan')}
          </h3>
          <p className="text-gray-600 text-sm">
            {t('mealPlan.personalizedProfile')}
          </p>
          <Button 
            onClick={onGenerate}
            className="bg-fitness-gradient hover:opacity-90 text-white px-6 py-2"
          >
            <Sparkles className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
            {t('mealPlan.generateAIMealPlan')}
          </Button>
        </div>
      </Card>
    );
  }

  // If meal plan exists but no meals for today, show add meals option
  if (todaysMeals.length === 0) {
    return (
      <Card className={`p-6 sm:p-8 text-center bg-gradient-to-br from-gray-50 to-slate-100 border-0 shadow-lg ${isRTL ? 'text-right' : 'text-left'}`}>
        <div className="max-w-md mx-auto space-y-4">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto">
            <Plus className="w-8 h-8 text-gray-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800">
            {t('mealPlan.noMealsPlanned')}
          </h3>
          <Button 
            onClick={onGenerate}
            variant="outline"
            className="border-fitness-primary text-fitness-primary hover:bg-fitness-primary hover:text-white px-6 py-2"
          >
            <Sparkles className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
            {t('mealPlan.generateAIMealPlan')}
          </Button>
        </div>
      </Card>
    );
  }

  // Show meals content
  return (
    <div className="space-y-4">
      {/* Meals Header */}
      <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
        <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <h2 className="text-lg font-semibold text-gray-800">
            {viewMode === 'daily' ? t('mealPlan.meals') : t('mealPlan.weeklyMealPlan')}
          </h2>
          <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
            {todaysMeals.length} {t('mealPlan.mealsPlanned')}
          </span>
        </div>
      </div>

      {/* Meals Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
        {todaysMeals.map((meal, index) => (
          <MealCard
            key={`${meal.id}-${index}`}
            meal={meal}
            onShowRecipe={onShowRecipe}
            onExchangeMeal={(meal) => onExchangeMeal(meal, index)}
          />
        ))}
      </div>
    </div>
  );
};

export default MealPlanContent;
