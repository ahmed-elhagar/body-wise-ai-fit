
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChefHat, Sparkles, Wand2 } from "lucide-react";
import { useI18n } from "@/hooks/useI18n";
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
  const { t } = useI18n();

  if (!currentWeekPlan) {
    return (
      <Card className="p-8 text-center bg-gradient-to-br from-white via-fitness-primary/5 to-pink-50 border-0 shadow-xl backdrop-blur-sm">
        <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-fitness-primary to-pink-500 rounded-3xl flex items-center justify-center shadow-lg transform rotate-3 hover:rotate-0 transition-transform duration-300">
          <ChefHat className="w-12 h-12 text-white" />
        </div>
        
        <h3 className="text-3xl font-bold text-gray-800 mb-3 bg-gradient-to-r from-fitness-primary to-pink-600 bg-clip-text text-transparent">
          {t('mealPlan.noMealPlan')}
        </h3>
        
        <p className="text-gray-600 mb-8 max-w-md mx-auto leading-relaxed text-lg">
          {t('mealPlan.generateFirstPlan')}
        </p>
        
        <div className="space-y-4">
          <Button 
            onClick={onGenerate} 
            className="bg-fitness-gradient hover:opacity-90 text-white shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 px-8 py-4 text-lg font-semibold rounded-2xl"
            aria-label={t('mealPlan.generateMealPlan')}
          >
            <Sparkles className="w-6 h-6 mr-3" />
            {t('mealPlan.generateMealPlan')}
          </Button>
          
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
            <Wand2 className="w-4 h-4" />
            <span>{t('mealPlan.aiPowered')}</span>
          </div>
        </div>
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
