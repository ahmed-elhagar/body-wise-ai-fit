
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChefHat, Plus } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import MealCard from "@/components/MealCard";
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

  if (!currentWeekPlan) {
    return (
      <Card className="p-8 text-center bg-white/80 backdrop-blur-sm">
        <ChefHat className="w-16 h-16 mx-auto mb-4 text-gray-400" />
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          {t('mealPlan.noMealPlan')}
        </h3>
        <p className="text-gray-600 mb-6">
          {t('mealPlan.generateFirstPlan')}
        </p>
        <Button onClick={onGenerate} className="bg-fitness-gradient text-white">
          <Plus className="w-4 h-4 mr-2" />
          {t('mealPlan.generateMealPlan')}
        </Button>
      </Card>
    );
  }

  if (viewMode === 'daily' && (!todaysMeals || todaysMeals.length === 0)) {
    return (
      <Card className="p-8 text-center bg-white/80 backdrop-blur-sm">
        <ChefHat className="w-16 h-16 mx-auto mb-4 text-gray-400" />
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          {t('mealPlan.noMealsToday')}
        </h3>
        <p className="text-gray-600 mb-6">
          {t('mealPlan.generateNewPlan')}
        </p>
        <Button onClick={onGenerate} className="bg-fitness-gradient text-white">
          <Plus className="w-4 h-4 mr-2" />
          {t('mealPlan.generateMealPlan')}
        </Button>
      </Card>
    );
  }

  if (viewMode === 'daily') {
    return (
      <div className="space-y-6">
        {/* Meal Type Sections */}
        {['breakfast', 'lunch', 'dinner'].map((mealType) => {
          const mealsForType = todaysMeals.filter(meal => (meal.meal_type || meal.type) === mealType);
          
          if (mealsForType.length === 0) return null;

          return (
            <div key={mealType} className="space-y-4">
              <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Badge 
                  variant="outline" 
                  className="px-3 py-1 bg-fitness-gradient text-white border-0"
                >
                  {t(mealType)}
                </Badge>
                <div className="h-px bg-gray-200 flex-1" />
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {mealsForType.map((meal, index) => {
                  // Ensure meal has youtubeId property
                  const mealWithYoutubeId = {
                    ...meal,
                    youtubeId: meal.youtubeId || meal.youtube_search_term || ''
                  };
                  
                  return (
                    <MealCard
                      key={`${meal.id}-${index}`}
                      meal={mealWithYoutubeId}
                      onShowRecipe={() => onShowRecipe(mealWithYoutubeId)}
                      onExchangeMeal={() => onExchangeMeal(mealWithYoutubeId, index)}
                    />
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* Snacks Section */}
        {todaysMeals.some(meal => (meal.meal_type || meal.type) === 'snack') && (
          <div className="space-y-4">
            <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Badge 
                variant="outline" 
                className="px-3 py-1 bg-purple-gradient text-white border-0"
              >
                {t('snacks')}
              </Badge>
              <div className="h-px bg-gray-200 flex-1" />
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {todaysMeals
                .filter(meal => (meal.meal_type || meal.type) === 'snack')
                .map((meal, index) => {
                  const mealWithYoutubeId = {
                    ...meal,
                    youtubeId: meal.youtubeId || meal.youtube_search_term || ''
                  };
                  
                  return (
                    <MealCard
                      key={`${meal.id}-${index}`}
                      meal={mealWithYoutubeId}
                      onShowRecipe={() => onShowRecipe(mealWithYoutubeId)}
                      onExchangeMeal={() => onExchangeMeal(mealWithYoutubeId, index)}
                    />
                  );
                })}
            </div>
          </div>
        )}
      </div>
    );
  }

  return null;
};

export default MealPlanContent;
