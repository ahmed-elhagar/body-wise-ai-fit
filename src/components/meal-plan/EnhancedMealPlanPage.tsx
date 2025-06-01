
import { useState } from "react";
import { addDays } from "date-fns";
import { useMealPlanPage } from "@/hooks/useMealPlanPage";
import EnhancedLoadingIndicator from "@/components/ui/enhanced-loading-indicator";
import MealPlanHeroSection from "./MealPlanHeroSection";
import MealPlanStatsPanel from "./MealPlanStatsPanel";
import MealPlanWeekNavigationCompact from "./MealPlanWeekNavigationCompact";
import MealPlanMealsDisplay from "./MealPlanMealsDisplay";

const EnhancedMealPlanPage = () => {
  const [viewMode, setViewMode] = useState<'daily' | 'weekly'>('daily');
  const {
    currentWeekOffset,
    setCurrentWeekOffset,
    selectedDayNumber,
    setSelectedDayNumber,
    weekStartDate,
    currentWeekPlan,
    todaysMeals,
    totalCalories,
    totalProtein,
    targetDayCalories,
    isLoading,
    handleShowRecipe,
    handleExchangeMeal,
    handleGenerateAIPlan,
    setShowAIDialog,
    setShowShoppingDialog
  } = useMealPlanPage();

  const selectedDate = addDays(weekStartDate, selectedDayNumber - 1);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="flex items-center justify-center min-h-screen">
          <EnhancedLoadingIndicator
            status="loading"
            type="meal-plan"
            message="Loading Your Meal Plan"
            description="Preparing your personalized nutrition journey..."
            size="lg"
            variant="card"
            showSteps={true}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-7xl mx-auto p-4 md:p-6">
        
        {/* Hero Section */}
        <MealPlanHeroSection
          selectedDate={selectedDate}
          selectedDayNumber={selectedDayNumber}
          totalCalories={totalCalories}
          onShowShoppingDialog={() => setShowShoppingDialog(true)}
          onShowAIDialog={() => setShowAIDialog(true)}
        />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          
          {/* Stats Sidebar */}
          <div className="xl:col-span-1">
            <MealPlanStatsPanel
              totalCalories={totalCalories}
              totalProtein={totalProtein}
              targetDayCalories={targetDayCalories}
            />
          </div>

          {/* Main Content */}
          <div className="xl:col-span-3 space-y-6">
            
            {/* Week Navigation */}
            <MealPlanWeekNavigationCompact
              currentWeekOffset={currentWeekOffset}
              setCurrentWeekOffset={setCurrentWeekOffset}
              weekStartDate={weekStartDate}
              selectedDayNumber={selectedDayNumber}
              setSelectedDayNumber={setSelectedDayNumber}
            />

            {/* Meals Display */}
            <MealPlanMealsDisplay
              selectedDate={selectedDate}
              todaysMeals={todaysMeals}
              currentWeekPlan={currentWeekPlan}
              handleShowRecipe={handleShowRecipe}
              handleExchangeMeal={handleExchangeMeal}
              setShowAIDialog={setShowAIDialog}
            />

          </div>
        </div>

      </div>
    </div>
  );
};

export default EnhancedMealPlanPage;
