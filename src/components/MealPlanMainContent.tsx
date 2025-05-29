
import WeeklyNavigation from "@/components/WeeklyNavigation";
import DaySelector from "@/components/DaySelector";
import MealPlanActions from "@/components/MealPlanActions";
import MealPlanContent from "@/components/MealPlanContent";
import EmptyMealPlan from "@/components/EmptyMealPlan";
import WeeklyMealPlanView from "@/components/WeeklyMealPlanView";
import type { Meal } from "@/types/meal";

interface MealPlanMainContentProps {
  // Navigation
  currentWeekOffset: number;
  onWeekChange: (offset: number) => void;
  weekStartDate: Date;
  
  // Day Selection
  selectedDayNumber: number;
  onDaySelect: (day: number) => void;
  
  // View Mode
  viewMode: 'daily' | 'weekly';
  onViewModeChange: (mode: 'daily' | 'weekly') => void;
  
  // Actions
  onAddSnack: () => void;
  onFinalizePlan: () => void;
  onGenerate: () => void;
  
  // Data
  currentWeekPlan: any;
  todaysMeals: Meal[];
  totalCalories: number;
  totalProtein: number;
  
  // Handlers
  onShowShoppingList: () => void;
  onShowRecipe: (meal: Meal) => void;
  onExchangeMeal: (meal: Meal, index: number) => void;
}

const MealPlanMainContent = ({
  currentWeekOffset,
  onWeekChange,
  weekStartDate,
  selectedDayNumber,
  onDaySelect,
  viewMode,
  onViewModeChange,
  onAddSnack,
  onFinalizePlan,
  onGenerate,
  currentWeekPlan,
  todaysMeals,
  totalCalories,
  totalProtein,
  onShowShoppingList,
  onShowRecipe,
  onExchangeMeal
}: MealPlanMainContentProps) => {
  return (
    <div className="space-y-4 sm:space-y-6">
      <WeeklyNavigation
        currentWeekOffset={currentWeekOffset}
        onWeekChange={onWeekChange}
        weekStartDate={weekStartDate}
      />

      {viewMode === 'daily' && (
        <DaySelector
          selectedDayNumber={selectedDayNumber}
          onDaySelect={onDaySelect}
        />
      )}

      <MealPlanActions
        viewMode={viewMode}
        onViewModeChange={onViewModeChange}
        onAddSnack={onAddSnack}
        onFinalizePlan={onFinalizePlan}
        showAddSnack={viewMode === 'daily' && currentWeekPlan !== null}
      />

      {!currentWeekPlan ? (
        <EmptyMealPlan onGenerate={onGenerate} />
      ) : viewMode === 'weekly' ? (
        <WeeklyMealPlanView
          weeklyPlan={currentWeekPlan.weeklyPlan}
          onShowRecipe={onShowRecipe}
          onExchangeMeal={onExchangeMeal}
        />
      ) : (
        <MealPlanContent
          selectedDayNumber={selectedDayNumber}
          todaysMeals={todaysMeals}
          totalCalories={totalCalories}
          totalProtein={totalProtein}
          onShowShoppingList={onShowShoppingList}
          onShowRecipe={onShowRecipe}
          onExchangeMeal={onExchangeMeal}
        />
      )}
    </div>
  );
};

export default MealPlanMainContent;
