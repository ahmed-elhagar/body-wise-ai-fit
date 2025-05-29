
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChefHat, Plus, Sparkles } from "lucide-react";
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
      <Card className="p-8 text-center bg-gradient-to-br from-health-soft-blue to-white border-2 border-health-border-light shadow-health rounded-2xl backdrop-blur-sm">
        <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-health-primary to-health-secondary rounded-2xl flex items-center justify-center shadow-health">
          <ChefHat className="w-10 h-10 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-health-text-primary mb-3">
          {t('noMealPlan')}
        </h3>
        <p className="text-health-text-secondary mb-8 max-w-md mx-auto leading-relaxed">
          {t('generateFirstPlan')}
        </p>
        <Button 
          onClick={onGenerate} 
          className="bg-health-gradient hover:opacity-90 text-white shadow-health hover:shadow-elevated transform hover:scale-105 transition-all duration-300 px-8 py-3 text-lg font-semibold rounded-xl"
        >
          <Sparkles className="w-5 h-5 mr-2" />
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
