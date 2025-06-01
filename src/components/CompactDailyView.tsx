
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Plus, TrendingUp } from "lucide-react";
import { useI18n } from "@/hooks/useI18n";
import MealCard from "@/components/MealCard";
import type { Meal } from "@/types/meal";

interface CompactDailyViewProps {
  meals: Meal[];
  selectedDay: number;
  onShowRecipe: (meal: Meal) => void;
  onExchangeMeal: (meal: Meal) => void;
  onAddSnack: () => void;
}

const CompactDailyView = ({
  meals,
  selectedDay,
  onShowRecipe,
  onExchangeMeal,
  onAddSnack
}: CompactDailyViewProps) => {
  const { t, isRTL } = useI18n();

  const totalCalories = meals.reduce((sum, meal) => sum + (meal.calories || 0), 0);
  const totalProtein = meals.reduce((sum, meal) => sum + (meal.protein || 0), 0);

  return (
    <div className="space-y-6">
      {/* Day Header */}
      <Card className="p-6 bg-gradient-to-r from-blue-50 to-indigo-100 border-blue-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CalendarDays className="w-6 h-6 text-blue-600" />
            <div>
              <h2 className="text-xl font-bold text-blue-800">
                {t('Day')} {selectedDay}
              </h2>
              <p className="text-blue-600">
                {meals.length} {t('meals planned')}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-center">
              <Badge className="bg-red-100 text-red-700 border-red-200">
                <TrendingUp className="w-3 h-3 mr-1" />
                {totalCalories} cal
              </Badge>
            </div>
            <div className="text-center">
              <Badge className="bg-green-100 text-green-700 border-green-200">
                {totalProtein.toFixed(0)}g protein
              </Badge>
            </div>
            <Button
              onClick={onAddSnack}
              size="sm"
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              {t('Add Snack')}
            </Button>
          </div>
        </div>
      </Card>

      {/* Meals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {meals.map((meal) => {
          // Ensure id is present - use a default if missing
          const mealWithId: Meal = {
            ...meal,
            id: meal.id || `meal-${Math.random().toString(36).substr(2, 9)}`,
            image: meal.image || meal.image_url || ""
          };
          
          return (
            <MealCard
              key={mealWithId.id}
              meal={mealWithId}
              onShowRecipe={onShowRecipe}
              onExchangeMeal={onExchangeMeal}
            />
          );
        })}
      </div>
      
      {meals.length === 0 && (
        <Card className="p-12 text-center">
          <p className="text-gray-500 mb-4">{t('No meals planned for this day')}</p>
          <Button onClick={onAddSnack} variant="outline">
            <Plus className="w-4 h-4 mr-2" />
            {t('Add First Meal')}
          </Button>
        </Card>
      )}
    </div>
  );
};

export default CompactDailyView;
