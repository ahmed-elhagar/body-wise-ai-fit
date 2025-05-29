
import { useLanguage } from "@/contexts/LanguageContext";
import WeeklyPlanHeader from "./weekly-meal-plan/WeeklyPlanHeader";
import DayMealCard from "./weekly-meal-plan/DayMealCard";
import type { Meal } from "@/types/meal";

interface WeeklyMealPlanViewProps {
  weeklyPlan: any;
  onShowRecipe: (meal: Meal) => void;
  onExchangeMeal: (meal: Meal, dayNumber: number, mealIndex: number) => void;
}

const WeeklyMealPlanView = ({ weeklyPlan, onShowRecipe, onExchangeMeal }: WeeklyMealPlanViewProps) => {
  const { t } = useLanguage();
  
  const dayNames = [
    t('day.saturday'), t('day.sunday'), t('day.monday'), 
    t('day.tuesday'), t('day.wednesday'), t('day.thursday'), t('day.friday')
  ];
  
  const getDietType = () => {
    if (!weeklyPlan?.dailyMeals?.length) return t('mealPlan.balanced');
    
    const allIngredients = weeklyPlan.dailyMeals
      .flatMap((meal: any) => meal.ingredients || [])
      .map((ing: any) => (typeof ing === 'string' ? ing : ing.name || '').toLowerCase());
    
    const hasAnimalProducts = allIngredients.some((ing: string) => 
      ing.includes('meat') || ing.includes('chicken') || ing.includes('beef') || 
      ing.includes('pork') || ing.includes('fish') || ing.includes('salmon') ||
      ing.includes('tuna') || ing.includes('dairy') || ing.includes('cheese') ||
      ing.includes('milk') || ing.includes('egg')
    );
    
    const hasHighProtein = weeklyPlan.dailyMeals.some((meal: any) => (meal.protein || 0) > 25);
    const hasLowCarb = weeklyPlan.dailyMeals.some((meal: any) => (meal.carbs || 0) < 10);
    
    if (!hasAnimalProducts) return t('mealPlan.vegetarian');
    if (hasLowCarb && hasHighProtein) return t('mealPlan.keto');
    if (hasHighProtein) return t('mealPlan.highProtein');
    return t('mealPlan.balanced');
  };

  const getMealsByDay = (dayNumber: number) => {
    return weeklyPlan?.dailyMeals?.filter((meal: any) => meal.day_number === dayNumber) || [];
  };

  const dietType = getDietType();
  
  // Calculate weekly totals from daily meals
  const weeklyCalories = weeklyPlan?.dailyMeals?.reduce((sum: number, meal: any) => sum + (meal.calories || 0), 0) || 0;
  const weeklyProtein = weeklyPlan?.dailyMeals?.reduce((sum: number, meal: any) => sum + (meal.protein || 0), 0) || 0;

  return (
    <div className="space-y-6">
      <WeeklyPlanHeader
        dietType={dietType}
        weeklyCalories={weeklyCalories}
        weeklyProtein={weeklyProtein}
      />

      {/* Enhanced Weekly Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {dayNames.map((dayName, index) => {
          const dayNumber = index + 1;
          const dayMeals = getMealsByDay(dayNumber);
          
          return (
            <DayMealCard
              key={dayNumber}
              dayName={dayName}
              dayNumber={dayNumber}
              dayMeals={dayMeals}
              onShowRecipe={onShowRecipe}
              onExchangeMeal={onExchangeMeal}
            />
          );
        })}
      </div>
    </div>
  );
};

export default WeeklyMealPlanView;
