
import CompactNavigation from "@/components/CompactNavigation";
import MealPlanContent from "@/components/MealPlanContent";
import EmptyMealPlan from "@/components/EmptyMealPlan";
import WeeklyMealPlanView from "@/components/WeeklyMealPlanView";
import ActionSection from "@/components/ActionSection";
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
    <div className="space-y-4">
      {/* Compact Navigation Section */}
      <CompactNavigation
        currentWeekOffset={currentWeekOffset}
        onWeekChange={onWeekChange}
        weekStartDate={weekStartDate}
        selectedDayNumber={selectedDayNumber}
        onDaySelect={onDaySelect}
        viewMode={viewMode}
        onViewModeChange={onViewModeChange}
      />

      {!currentWeekPlan ? (
        <EmptyMealPlan onGenerate={onGenerate} />
      ) : (
        <>
          {/* Action Section with Summary and Buttons */}
          <ActionSection
            viewMode={viewMode}
            totalCalories={totalCalories}
            totalProtein={totalProtein}
            onShowShoppingList={onShowShoppingList}
            onAddSnack={onAddSnack}
            showAddSnack={viewMode === 'daily' && currentWeekPlan !== null}
            showShoppingList={currentWeekPlan !== null && (viewMode === 'daily' ? todaysMeals.length > 0 : true)}
          />

          {/* Main Content */}
          {viewMode === 'weekly' ? (
            <WeeklyMealPlanView
              weeklyPlan={currentWeekPlan}
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
        </>
      )}
    </div>
  );
};

export default MealPlanMainContent;
