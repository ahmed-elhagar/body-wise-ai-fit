
import { Badge } from "@/components/ui/badge";
import DailySummary from "@/components/DailySummary";
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
  totalCalories,
  totalProtein,
  onShowShoppingList,
  onShowRecipe,
  onExchangeMeal
}: MealPlanContentProps) => {
  const { t, isRTL } = useLanguage();

  const dayNames = [
    t('day.monday'), t('day.tuesday'), t('day.wednesday'), 
    t('day.thursday'), t('day.friday'), t('day.saturday'), t('day.sunday')
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">
      <div className="lg:col-span-1 lg:order-1 order-2">
        <DailySummary
          totalCalories={totalCalories}
          totalProtein={totalProtein}
          onShowShoppingList={onShowShoppingList}
        />
      </div>

      <div className="lg:col-span-3 lg:order-2 order-1">
        <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 ${isRTL ? 'text-right' : 'text-left'}`}>
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2 sm:mb-0">
            {isRTL ? `${t('mealPlan.daysMeals')}${dayNames[selectedDayNumber - 1]}` : `${dayNames[selectedDayNumber - 1]}${t('mealPlan.daysMeals')}`}
          </h2>
          <Badge variant="outline" className="bg-white/80 self-start sm:self-auto">
            {todaysMeals.length} {t('mealPlan.mealsPlanned')}
          </Badge>
        </div>
        
        <div className="space-y-3 sm:space-y-4">
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
    </div>
  );
};

export default MealPlanContent;
