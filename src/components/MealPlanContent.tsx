
import { Badge } from "@/components/ui/badge";
import MealCard from "@/components/MealCard";
import { useLanguage } from "@/contexts/LanguageContext";
import type { Meal } from "@/types/meal";

interface MealPlanContentProps {
  selectedDayNumber: number;
  todaysMeals: Meal[];
  totalCalories: number;
  totalProtein: number;
  onShowShoppingList: () => void;
  onShowRecipe: (meal: Meal) => void;
  onExchangeMeal: (meal: Meal, index: number) => void;
}

const MealPlanContent = ({
  selectedDayNumber,
  todaysMeals,
  onShowRecipe,
  onExchangeMeal
}: MealPlanContentProps) => {
  const { t, isRTL } = useLanguage();

  const dayNames = [
    t('day.saturday'), t('day.sunday'), t('day.monday'), 
    t('day.tuesday'), t('day.wednesday'), t('day.thursday'), t('day.friday')
  ];

  return (
    <div>
      <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 ${isRTL ? 'text-right' : 'text-left'}`}>
        <h2 className="text-lg font-semibold text-gray-800 mb-2 sm:mb-0">
          {dayNames[selectedDayNumber - 1]} {t('mealPlan.meals')}
        </h2>
        <Badge variant="outline" className="bg-white/80 self-start sm:self-auto text-sm">
          {todaysMeals.length} {t('mealPlan.mealsPlanned')}
        </Badge>
      </div>
      
      {/* Meals grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {todaysMeals.map((meal: Meal, index) => (
          <MealCard
            key={index}
            meal={meal}
            onShowRecipe={onShowRecipe}
            onExchangeMeal={(mealToExchange: Meal) => onExchangeMeal(mealToExchange, index)}
          />
        ))}
      </div>
    </div>
  );
};

export default MealPlanContent;
