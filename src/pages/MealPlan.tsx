
import { useState } from "react";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import { useDynamicMealPlan } from "@/hooks/useDynamicMealPlan";
import { useAIMealPlan } from "@/hooks/useAIMealPlan";
import { getMealPlanWeekDates, getSaturdayOfWeek, getCurrentSaturdayDay } from "@/utils/mealPlanUtils";
import MealPlanLayout from "@/components/MealPlanLayout";
import MealPlanLoadingScreen from "@/components/MealPlanLoadingScreen";
import MealPlanHeader from "@/components/MealPlanHeader";
import WeeklyNavigation from "@/components/WeeklyNavigation";
import DaySelector from "@/components/DaySelector";
import MealPlanActions from "@/components/MealPlanActions";
import MealPlanContent from "@/components/MealPlanContent";
import EmptyMealPlan from "@/components/EmptyMealPlan";
import WeeklyMealPlanView from "@/components/WeeklyMealPlanView";
import AIGenerationDialog from "@/components/AIGenerationDialog";
import AddSnackDialog from "@/components/AddSnackDialog";
import ShoppingListDialog from "@/components/ShoppingListDialog";
import MealRecipeDialog from "@/components/MealRecipeDialog";
import MealExchangeDialog from "@/components/MealExchangeDialog";
import type { Meal } from "@/types/meal";

const MealPlan = () => {
  const { t } = useLanguage();
  const [currentWeekOffset, setCurrentWeekOffset] = useState(0);
  const [selectedDayNumber, setSelectedDayNumber] = useState(getCurrentSaturdayDay());
  const [viewMode, setViewMode] = useState<'daily' | 'weekly'>('daily');
  const [showAIDialog, setShowAIDialog] = useState(false);
  const [showAddSnackDialog, setShowAddSnackDialog] = useState(false);
  const [showShoppingListDialog, setShowShoppingListDialog] = useState(false);
  const [showRecipeDialog, setShowRecipeDialog] = useState(false);
  const [showExchangeDialog, setShowExchangeDialog] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);
  const [selectedMealIndex, setSelectedMealIndex] = useState<number>(-1);

  const { generateMealPlan, isGenerating } = useAIMealPlan();

  const weekStartDate = getSaturdayOfWeek(new Date(), currentWeekOffset);
  const { weekStartDateStr } = getMealPlanWeekDates(weekStartDate);

  const {
    mealPlan,
    todaysMeals,
    totalCalories,
    totalProtein,
    isLoading,
    refetch
  } = useDynamicMealPlan(weekStartDateStr, selectedDayNumber);

  const handleRegeneratePlan = () => {
    setShowAIDialog(true);
  };

  const handleGenerateAIPlan = (preferences: any) => {
    generateMealPlan(preferences);
    setShowAIDialog(false);
  };

  const handleShowRecipe = (meal: Meal) => {
    setSelectedMeal(meal);
    setShowRecipeDialog(true);
  };

  const handleExchangeMeal = (meal: Meal, index: number) => {
    setSelectedMeal(meal);
    setSelectedMealIndex(index);
    setShowExchangeDialog(true);
  };

  const handleFinalizePlan = () => {
    toast.success(t('mealPlan.planFinalized'));
  };

  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const currentDay = new Date().toLocaleDateString('en-US', { weekday: 'long' });

  if (isGenerating) {
    return (
      <MealPlanLoadingScreen message={t('mealPlan.generating')} />
    );
  }

  if (isLoading) {
    return (
      <MealPlanLoadingScreen message={t('mealPlan.loading')} />
    );
  }

  return (
    <MealPlanLayout>
      <div className="space-y-4 sm:space-y-6">
        <MealPlanHeader
          currentDate={currentDate}
          currentDay={currentDay}
          onShowAIDialog={() => setShowAIDialog(true)}
          onRegeneratePlan={handleRegeneratePlan}
          isGenerating={isGenerating}
          dietType={mealPlan?.weekSummary?.dietType}
          totalWeeklyCalories={mealPlan?.weekSummary?.totalCalories}
        />

        <WeeklyNavigation
          currentWeekOffset={currentWeekOffset}
          onWeekChange={setCurrentWeekOffset}
          weekStartDate={weekStartDate}
        />

        {viewMode === 'daily' && (
          <DaySelector
            selectedDay={selectedDayNumber.toString()}
            onDayChange={(day) => setSelectedDayNumber(parseInt(day))}
            weekStartDate={weekStartDate}
          />
        )}

        <MealPlanActions
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          onAddSnack={() => setShowAddSnackDialog(true)}
          onFinalizePlan={handleFinalizePlan}
          showAddSnack={viewMode === 'daily' && mealPlan !== null}
        />

        {!mealPlan ? (
          <EmptyMealPlan onGeneratePlan={() => setShowAIDialog(true)} />
        ) : viewMode === 'weekly' ? (
          <WeeklyMealPlanView
            mealPlan={mealPlan}
            onShowRecipe={handleShowRecipe}
            onExchangeMeal={handleExchangeMeal}
          />
        ) : (
          <MealPlanContent
            selectedDayNumber={selectedDayNumber}
            todaysMeals={todaysMeals}
            totalCalories={totalCalories}
            totalProtein={totalProtein}
            onShowShoppingList={() => setShowShoppingListDialog(true)}
            onShowRecipe={handleShowRecipe}
            onExchangeMeal={handleExchangeMeal}
          />
        )}

        <AIGenerationDialog
          open={showAIDialog}
          onOpenChange={setShowAIDialog}
          onGenerate={handleGenerateAIPlan}
          isGenerating={isGenerating}
        />

        <AddSnackDialog
          open={showAddSnackDialog}
          onOpenChange={setShowAddSnackDialog}
          onAddSnack={() => {
            refetch();
            setShowAddSnackDialog(false);
          }}
        />

        <ShoppingListDialog
          open={showShoppingListDialog}
          onOpenChange={setShowShoppingListDialog}
          meals={todaysMeals}
        />

        {selectedMeal && (
          <MealRecipeDialog
            open={showRecipeDialog}
            onOpenChange={setShowRecipeDialog}
            meal={selectedMeal}
          />
        )}

        {selectedMeal && (
          <MealExchangeDialog
            open={showExchangeDialog}
            onOpenChange={setShowExchangeDialog}
            currentMeal={selectedMeal}
            onExchange={() => {
              refetch();
              setShowExchangeDialog(false);
            }}
          />
        )}
      </div>
    </MealPlanLayout>
  );
};

export default MealPlan;
