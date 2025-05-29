
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

  // Enhanced meal grouping with proper snack handling
  const mealsByType = {
    breakfast: todaysMeals.filter(meal => {
      const mealType = meal.meal_type || meal.type;
      return mealType === 'breakfast' && !meal.name?.includes('🍎');
    }),
    lunch: todaysMeals.filter(meal => {
      const mealType = meal.meal_type || meal.type;
      return mealType === 'lunch' && !meal.name?.includes('🍎');
    }),
    dinner: todaysMeals.filter(meal => {
      const mealType = meal.meal_type || meal.type;
      return mealType === 'dinner' && !meal.name?.includes('🍎');
    }),
    snack: todaysMeals.filter(meal => 
      meal.name?.includes('🍎') || 
      (meal.meal_type || meal.type)?.includes('snack')
    )
  };

  console.log('🍽️ Meal grouping debug:', {
    totalMeals: todaysMeals.length,
    breakfast: mealsByType.breakfast.length,
    lunch: mealsByType.lunch.length,
    dinner: mealsByType.dinner.length,
    snack: mealsByType.snack.length,
    snackMeals: mealsByType.snack.map(m => ({ name: m.name, type: m.meal_type }))
  });

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
