import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChefHat, ShoppingCart, Plus } from "lucide-react";
import { useI18n } from "@/hooks/useI18n";
import MealCard from "./MealCard";
import type { Meal } from "@/types/meal";

interface CompactDailyViewProps {
  todaysMeals: Meal[];
  totalCalories: number;
  totalProtein: number;
  onShowRecipe: (meal: Meal) => void;
  onExchangeMeal: (meal: Meal, index: number) => void;
  onAddSnack: () => void;
  onShowShoppingList: () => void;
  onGenerate: () => void;
}

const CompactDailyView = ({ todaysMeals, totalCalories, totalProtein, onShowRecipe, onExchangeMeal, onAddSnack, onShowShoppingList, onGenerate }: CompactDailyViewProps) => {
  const { t, isRTL } = useI18n();

  return (
    <div className="space-y-4">
      {/* Enhanced Meal Cards */}
      {todaysMeals.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {todaysMeals.map((meal, index) => (
            <MealCard
              key={meal.id}
              meal={meal}
              onShowRecipe={onShowRecipe}
              onExchangeMeal={(meal) => onExchangeMeal(meal, index)}
            />
          ))}
        </div>
      ) : (
        <Card className="p-8 text-center bg-gradient-to-br from-white via-fitness-primary/5 to-pink-50 border-0 shadow-xl backdrop-blur-sm">
          <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-fitness-primary to-pink-500 rounded-3xl flex items-center justify-center shadow-lg transform rotate-3 hover:rotate-0 transition-transform duration-300">
            <ChefHat className="w-12 h-12 text-white" />
          </div>
          
          <h3 className="text-3xl font-bold text-gray-800 mb-3 bg-gradient-to-r from-fitness-primary to-pink-600 bg-clip-text text-transparent">
            {t('mealPlan.noMealsToday')}
          </h3>
          
          <p className="text-gray-600 mb-8 max-w-md mx-auto leading-relaxed text-lg">
            {t('mealPlan.noMealsTodayDescription')}
          </p>
          
          <Button 
            onClick={onGenerate} 
            className="bg-fitness-gradient hover:opacity-90 text-white shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 px-8 py-4 text-lg font-semibold rounded-2xl"
            aria-label={t('mealPlan.generateMealPlan')}
          >
            <Plus className="w-6 h-6 mr-3" />
            {t('mealPlan.generateMealPlan')}
          </Button>
        </Card>
      )}

      {/* Enhanced Action Buttons */}
      <div className={`flex justify-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
        <Button
          variant="outline"
          className="bg-gradient-to-br from-white to-health-soft-blue backdrop-blur-sm border-2 border-health-primary/30 text-health-primary hover:bg-health-soft-blue hover:border-health-primary hover:text-health-primary transition-all duration-300 shadow-soft hover:shadow-health font-semibold rounded-xl px-6 py-3 transform hover:scale-105"
          onClick={onShowShoppingList}
        >
          <ShoppingCart className="w-4 h-4 mr-2" />
          {t('mealPlan.shoppingList')}
        </Button>

        <Button
          variant="outline"
          className="bg-gradient-to-br from-white to-health-soft-green backdrop-blur-sm border-2 border-health-secondary/30 text-health-secondary hover:bg-health-soft-green hover:border-health-secondary hover:text-health-secondary transition-all duration-300 shadow-soft hover:shadow-success font-semibold rounded-xl px-6 py-3 transform hover:scale-105"
          onClick={onAddSnack}
        >
          <Plus className="w-4 h-4 mr-2" />
          {t('mealPlan.addSnack')}
        </Button>
      </div>
    </div>
  );
};

export default CompactDailyView;
