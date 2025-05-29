
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Utensils } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import MealItem from "./MealItem";
import type { Meal } from "@/types/meal";

interface DayMealCardProps {
  dayName: string;
  dayNumber: number;
  dayMeals: any[];
  onShowRecipe: (meal: Meal) => void;
  onExchangeMeal: (meal: Meal, dayNumber: number, mealIndex: number) => void;
}

const DayMealCard = ({ dayName, dayNumber, dayMeals, onShowRecipe, onExchangeMeal }: DayMealCardProps) => {
  const { t, isRTL } = useLanguage();

  const dayCalories = dayMeals.reduce((sum: number, meal: any) => sum + (meal.calories || 0), 0);
  const dayProtein = dayMeals.reduce((sum: number, meal: any) => sum + (meal.protein || 0), 0);

  return (
    <Card className="p-6 bg-white/90 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
      {/* Day Header */}
      <div className={`flex items-center justify-between mb-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
        <h4 className="text-lg font-bold text-gray-800 group-hover:text-fitness-primary transition-colors">
          {dayName}
        </h4>
        <div className={`flex flex-col gap-1 ${isRTL ? 'items-start' : 'items-end'}`}>
          <Badge variant="outline" className="bg-fitness-primary/10 text-fitness-primary font-semibold">
            {dayCalories} {t('mealPlan.cal')}
          </Badge>
          {dayProtein > 0 && (
            <span className="text-xs text-gray-600">{dayProtein}g {t('mealPlan.protein')}</span>
          )}
        </div>
      </div>
      
      {/* Meals List */}
      <div className="space-y-4">
        {dayMeals.length > 0 ? (
          dayMeals.map((meal: any, mealIndex: number) => (
            <MealItem
              key={mealIndex}
              meal={meal}
              mealIndex={mealIndex}
              dayNumber={dayNumber}
              onShowRecipe={onShowRecipe}
              onExchangeMeal={onExchangeMeal}
            />
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Utensils className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">{t('mealPlan.noMealsPlanned')}</p>
          </div>
        )}
      </div>
    </Card>
  );
};

export default DayMealCard;
