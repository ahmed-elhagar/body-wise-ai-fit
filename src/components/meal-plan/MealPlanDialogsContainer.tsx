
import { useMealPlanPage } from "@/hooks/useMealPlanPage";
import EnhancedRecipeDialog from "./EnhancedRecipeDialog";
import EnhancedAddSnackDialog from "./EnhancedAddSnackDialog";
import MealPlanDialogs from "../MealPlanDialogs";
import MealExchangeDialog from "./MealExchangeDialog";

interface MealPlanDialogsContainerProps {
  showAddSnackDialog: boolean;
  onCloseAddSnackDialog: () => void;
  showShoppingListDialog: boolean;
  onCloseShoppingListDialog: () => void;
}

const MealPlanDialogsContainer = ({
  showAddSnackDialog,
  onCloseAddSnackDialog,
  showShoppingListDialog,
  onCloseShoppingListDialog
}: MealPlanDialogsContainerProps) => {
  const {
    // Data
    currentWeekPlan,
    selectedDayNumber,
    totalCalories,
    targetDayCalories,
    shoppingItems,
    
    // Dialogs
    showAIDialog,
    setShowAIDialog,
    showRecipeDialog,
    setShowRecipeDialog,
    showExchangeDialog,
    setShowExchangeDialog,
    selectedMeal,
    selectedMealIndex,
    aiPreferences,
    setAiPreferences,
    
    // Actions
    handleGenerateAIPlan,
    handleRecipeGenerated,
    refetch,
    isGenerating
  } = useMealPlanPage();

  const handleExchangeComplete = async () => {
    setShowExchangeDialog(false);
    await refetch();
  };

  return (
    <>
      {/* Enhanced Recipe Dialog */}
      <EnhancedRecipeDialog
        isOpen={showRecipeDialog}
        onClose={() => setShowRecipeDialog(false)}
        meal={selectedMeal}
        onRecipeGenerated={handleRecipeGenerated}
      />

      {/* Enhanced Add Snack Dialog */}
      <EnhancedAddSnackDialog
        isOpen={showAddSnackDialog}
        onClose={onCloseAddSnackDialog}
        selectedDay={selectedDayNumber}
        weeklyPlanId={currentWeekPlan?.weeklyPlan?.id || null}
        onSnackAdded={refetch}
        currentDayCalories={totalCalories}
        targetDayCalories={targetDayCalories}
      />

      {/* Enhanced Exchange Dialog */}
      <MealExchangeDialog
        isOpen={showExchangeDialog}
        onClose={() => setShowExchangeDialog(false)}
        currentMeal={selectedMeal}
        onExchange={handleExchangeComplete}
      />

      {/* All Other Dialogs */}
      <MealPlanDialogs
        showAIDialog={showAIDialog}
        onCloseAIDialog={() => setShowAIDialog(false)}
        aiPreferences={aiPreferences}
        onPreferencesChange={setAiPreferences}
        onGenerateAI={handleGenerateAIPlan}
        isGenerating={isGenerating}
        
        showAddSnackDialog={false}
        onCloseAddSnackDialog={() => {}}
        selectedDay={selectedDayNumber}
        weeklyPlanId={currentWeekPlan?.weeklyPlan?.id || null}
        onSnackAdded={refetch}
        currentDayCalories={totalCalories}
        targetDayCalories={targetDayCalories}
        
        showShoppingListDialog={showShoppingListDialog}
        onCloseShoppingListDialog={onCloseShoppingListDialog}
        shoppingItems={shoppingItems}
        
        showRecipeDialog={false}
        onCloseRecipeDialog={() => {}}
        selectedMeal={null}
        
        showExchangeDialog={false}
        onCloseExchangeDialog={() => {}}
        selectedMealIndex={selectedMealIndex}
        onExchange={() => refetch()}
        
        onRecipeGenerated={handleRecipeGenerated}
      />
    </>
  );
};

export default MealPlanDialogsContainer;
