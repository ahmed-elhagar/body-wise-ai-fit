
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
    <div className="space-y-3 px-2 sm:px-4 max-w-7xl mx-auto">
      {/* Compact Navigation Section */}
      <div className="sticky top-0 z-10 bg-gray-50/95 backdrop-blur-sm -mx-2 sm:-mx-4 px-2 sm:px-4 py-2 border-b border-gray-200/50">
        <CompactNavigation
          currentWeekOffset={currentWeekOffset}
          onWeekChange={onWeekChange}
          weekStartDate={weekStartDate}
          selectedDayNumber={selectedDayNumber}
          onDaySelect={onDaySelect}
          viewMode={viewMode}
          onViewModeChange={onViewModeChange}
        />
      </div>

      {!currentWeekPlan ? (
        <div className="px-2 sm:px-0">
          <EmptyMealPlan onGenerate={onGenerate} />
        </div>
      ) : (
        <div className="space-y-3">
          {/* Action Section with Summary - Only for weekly view */}
          <ActionSection
            viewMode={viewMode}
            totalCalories={totalCalories}
            totalProtein={totalProtein}
            onShowShoppingList={onShowShoppingList}
            onAddSnack={onAddSnack}
            showAddSnack={false}
            showShoppingList={false}
          />

          {/* Main Content */}
          <div className="px-2 sm:px-0">
            {viewMode === 'weekly' ? (
              <WeeklyMealPlanView
                weeklyPlan={currentWeekPlan}
                onShowRecipe={onShowRecipe}
                onExchangeMeal={onExchangeMeal}
              />
            ) : (
              <MealPlanContent
                viewMode={viewMode}
                currentWeekPlan={currentWeekPlan}
                todaysMeals={todaysMeals}
                onGenerate={onGenerate}
                onShowRecipe={onShowRecipe}
                onExchangeMeal={onExchangeMeal}
                onAddSnack={onAddSnack}
                onShowShoppingList={onShowShoppingList}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MealPlanMainContent;
