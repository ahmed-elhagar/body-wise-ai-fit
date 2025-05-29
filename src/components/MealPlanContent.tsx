
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChefHat, Plus } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import CompactDailyView from "@/components/CompactDailyView";
import type { Meal } from "@/types/meal";

interface MealPlanContentProps {
  viewMode: 'daily' | 'weekly';
  currentWeekPlan: any;
  todaysMeals: Meal[];
  onGenerate: () => void;
  onShowRecipe: (meal: Meal) => void;
  onExchangeMeal: (meal: Meal, index: number) => void;
  onAddSnack: () => void;
  onShowShoppingList: () => void;
}

const MealPlanContent = ({
  viewMode,
  currentWeekPlan,
  todaysMeals,
  onGenerate,
  onShowRecipe,
  onExchangeMeal,
  onAddSnack,
  onShowShoppingList
}: MealPlanContentProps) => {
  const { t } = useLanguage();

  if (!currentWeekPlan) {
    return (
      <Card className="p-8 text-center bg-white/80 backdrop-blur-sm">
        <ChefHat className="w-16 h-16 mx-auto mb-4 text-gray-400" />
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          {t('noMealPlan')}
        </h3>
        <p className="text-gray-600 mb-6">
          {t('generateFirstPlan')}
        </p>
        <Button onClick={onGenerate} className="bg-fitness-gradient text-white">
          <Plus className="w-4 h-4 mr-2" />
          {t('generateMealPlan')}
        </Button>
      </Card>
    );
  }

  if (viewMode === 'daily') {
    const totalCalories = todaysMeals.reduce((sum, meal) => sum + (meal.calories || 0), 0);
    const totalProtein = todaysMeals.reduce((sum, meal) => sum + (meal.protein || 0), 0);

    return (
      <CompactDailyView
        todaysMeals={todaysMeals}
        totalCalories={totalCalories}
        totalProtein={totalProtein}
        onShowRecipe={onShowRecipe}
        onExchangeMeal={onExchangeMeal}
        onAddSnack={onAddSnack}
        onShowShoppingList={onShowShoppingList}
        onGenerate={onGenerate}
      />
    );
  }

  return null;
};

export default MealPlanContent;
