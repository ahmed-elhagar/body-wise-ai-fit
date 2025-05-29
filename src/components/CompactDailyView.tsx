
import { useLanguage } from "@/contexts/LanguageContext";
import DailyNutritionSummary from "./daily-view/DailyNutritionSummary";
import EmptyDailyState from "./daily-view/EmptyDailyState";
import MealTypeSection from "./daily-view/MealTypeSection";
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

const CompactDailyView = ({
  todaysMeals,
  totalCalories,
  totalProtein,
  onShowRecipe,
  onExchangeMeal,
  onAddSnack,
  onShowShoppingList,
  onGenerate
}: CompactDailyViewProps) => {
  const { t } = useLanguage();

  if (todaysMeals.length === 0) {
    return <EmptyDailyState onGenerate={onGenerate} />;
  }

  // Group meals by type for better organization
  const mealsByType = {
    breakfast: todaysMeals.filter(meal => (meal.meal_type || meal.type) === 'breakfast'),
    lunch: todaysMeals.filter(meal => (meal.meal_type || meal.type) === 'lunch'),
    dinner: todaysMeals.filter(meal => (meal.meal_type || meal.type) === 'dinner'),
    snack: todaysMeals.filter(meal => 
      (meal.meal_type || meal.type)?.includes('snack') || 
      meal.name?.includes('🍎')
    )
  };

  return (
    <div className="space-y-3" role="main" aria-label={t('todaysMeals')}>
      {/* Compact Summary Card */}
      <DailyNutritionSummary
        totalCalories={totalCalories}
        totalProtein={totalProtein}
        onShowShoppingList={onShowShoppingList}
        onAddSnack={onAddSnack}
      />

      {/* Compact Meal Sections */}
      <div className="space-y-2">
        {Object.entries(mealsByType).map(([mealType, meals]) => (
          <MealTypeSection
            key={mealType}
            mealType={mealType}
            meals={meals}
            onShowRecipe={onShowRecipe}
            onExchangeMeal={onExchangeMeal}
          />
        ))}
      </div>
    </div>
  );
};

export default CompactDailyView;
