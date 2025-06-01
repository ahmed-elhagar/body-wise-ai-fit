
import { useMealPlanDialogs } from "@/hooks/useMealPlanDialogs";
import { useMealPlanHandlers } from "@/hooks/useMealPlanHandlers";
import AIGenerationDialog from "@/components/AIGenerationDialog";
import AddSnackDialog from "@/components/AddSnackDialog";
import ShoppingListDrawer from "@/components/shopping-list/ShoppingListDrawer";
import MealRecipeDialog from "@/components/old_MealRecipeDialog";
import MealExchangeDialog from "@/components/MealExchangeDialog";

interface MealPlanDialogsContainerProps {
  showAddSnackDialog: boolean;
  onCloseAddSnackDialog: () => void;
  showShoppingListDialog: boolean;
  onCloseShoppingListDialog: () => void;
  currentWeekPlan?: any;
  selectedDayNumber?: number;
  weeklyPlanId?: string;
  onRefresh?: () => void;
}

const MealPlanDialogsContainer = ({
  showAddSnackDialog,
  onCloseAddSnackDialog,
  showShoppingListDialog,
  onCloseShoppingListDialog,
  currentWeekPlan,
  selectedDayNumber = 1,
  weeklyPlanId,
  onRefresh
}: MealPlanDialogsContainerProps) => {
  const {
    showAIDialog,
    setShowAIDialog,
    aiPreferences,
    setAiPreferences,
    showRecipeDialog,
    setShowRecipeDialog,
    showExchangeDialog,
    setShowExchangeDialog,
    selectedMeal,
    setSelectedMeal,
    selectedMealIndex
  } = useMealPlanDialogs();

  const { handleRecipeGenerated } = useMealPlanHandlers(
    setSelectedMeal,
    () => {},
    setShowRecipeDialog,
    setShowExchangeDialog
  );

  // Calculate current day calories for snack dialog
  const currentDayCalories = currentWeekPlan?.dailyMeals
    ?.filter((meal: any) => meal.day_number === selectedDayNumber)
    ?.reduce((sum: number, meal: any) => sum + (meal.calories || 0), 0) || 0;

  const targetDayCalories = currentWeekPlan?.weeklyPlan?.total_calories 
    ? Math.round(currentWeekPlan.weeklyPlan.total_calories / 7) 
    : 2000;

  const handleGenerateAI = async () => {
    // This will be handled by the parent component that uses this container
    setShowAIDialog(false);
  };

  return (
    <>
      {/* AI Generation Dialog */}
      <AIGenerationDialog
        isOpen={showAIDialog}
        onClose={() => setShowAIDialog(false)}
        preferences={aiPreferences}
        onPreferencesChange={setAiPreferences}
        onGenerate={handleGenerateAI}
        isGenerating={false}
      />

      {/* Add Snack Dialog */}
      <AddSnackDialog
        isOpen={showAddSnackDialog}
        onClose={onCloseAddSnackDialog}
        selectedDay={selectedDayNumber}
        weeklyPlanId={weeklyPlanId || ''}
        onSnackAdded={() => {
          onCloseAddSnackDialog();
          onRefresh?.();
        }}
        currentDayCalories={currentDayCalories}
        targetDayCalories={targetDayCalories}
      />

      {/* Shopping List Dialog */}
      <ShoppingListDrawer
        isOpen={showShoppingListDialog}
        onClose={onCloseShoppingListDialog}
        weeklyPlan={currentWeekPlan}
        weekId={weeklyPlanId}
        onShoppingListUpdate={onRefresh}
      />

      {/* Recipe Dialog */}
      {selectedMeal && (
        <MealRecipeDialog
          isOpen={showRecipeDialog}
          onClose={() => setShowRecipeDialog(false)}
          meal={selectedMeal}
          onRecipeGenerated={handleRecipeGenerated}
        />
      )}

      {/* Exchange Dialog */}
      {selectedMeal && (
        <MealExchangeDialog
          isOpen={showExchangeDialog}
          onClose={() => setShowExchangeDialog(false)}
          currentMeal={selectedMeal}
          onExchange={() => {
            setShowExchangeDialog(false);
            onRefresh?.();
          }}
        />
      )}
    </>
  );
};

export default MealPlanDialogsContainer;
