
import { useMealPlanCore } from "./useMealPlanCore";
import { useMealPlanDialogs } from "@/features/meal-plan/hooks/useMealPlanDialogs";
import { useMealPlanAIActions } from "./useMealPlanAIActions";

export const useMealPlanState = () => {
  // Core state management
  const coreState = useMealPlanCore();
  
  // Dialog state management
  const dialogsState = useMealPlanDialogs();
  
  // AI actions
  const aiActions = useMealPlanAIActions(coreState, dialogsState);

  // Explicitly combine all state properties to ensure nothing is lost
  const combinedState = {
    // Core state - explicitly list all properties
    currentWeekOffset: coreState.currentWeekOffset,
    setCurrentWeekOffset: coreState.setCurrentWeekOffset,
    selectedDayNumber: coreState.selectedDayNumber,
    setSelectedDayNumber: coreState.setSelectedDayNumber,
    weekStartDate: coreState.weekStartDate,
    dailyMeals: coreState.dailyMeals,
    todaysMeals: coreState.todaysMeals,
    totalCalories: coreState.totalCalories,
    totalProtein: coreState.totalProtein,
    targetDayCalories: coreState.targetDayCalories,
    currentWeekPlan: coreState.currentWeekPlan,
    isLoading: coreState.isLoading,
    isGenerating: coreState.isGenerating,
    error: coreState.error,
    isError: coreState.isError,
    aiLoadingState: coreState.aiLoadingState,
    setAiLoadingState: coreState.setAiLoadingState,
    nutritionContext: coreState.nutritionContext,
    userCredits: coreState.userCredits,
    generateMealPlan: coreState.generateMealPlan,
    refetch: coreState.refetch,
    clearError: coreState.clearError,
    user: coreState.user,
    language: coreState.language,
    authLoading: coreState.authLoading,
    
    // Dialog state - explicitly list all properties
    showAIDialog: dialogsState.showAIDialog,
    setShowAIDialog: dialogsState.setShowAIDialog,
    showRecipeDialog: dialogsState.showRecipeDialog,
    setShowRecipeDialog: dialogsState.setShowRecipeDialog,
    showExchangeDialog: dialogsState.showExchangeDialog,
    setShowExchangeDialog: dialogsState.setShowExchangeDialog,
    showAddSnackDialog: dialogsState.showAddSnackDialog,
    setShowAddSnackDialog: dialogsState.setShowAddSnackDialog,
    showShoppingListDialog: dialogsState.showShoppingListDialog,
    setShowShoppingListDialog: dialogsState.setShowShoppingListDialog,
    selectedMeal: dialogsState.selectedMeal,
    setSelectedMeal: dialogsState.setSelectedMeal,
    selectedMealIndex: dialogsState.selectedMealIndex,
    setSelectedMealIndex: dialogsState.setSelectedMealIndex,
    aiPreferences: dialogsState.aiPreferences,
    setAiPreferences: dialogsState.setAiPreferences,
    openAIDialog: dialogsState.openAIDialog,
    closeAIDialog: dialogsState.closeAIDialog,
    openRecipeDialog: dialogsState.openRecipeDialog,
    closeRecipeDialog: dialogsState.closeRecipeDialog,
    openExchangeDialog: dialogsState.openExchangeDialog,
    closeExchangeDialog: dialogsState.closeExchangeDialog,
    openAddSnackDialog: dialogsState.openAddSnackDialog,
    closeAddSnackDialog: dialogsState.closeAddSnackDialog,
    openShoppingListDialog: dialogsState.openShoppingListDialog,
    closeShoppingListDialog: dialogsState.closeShoppingListDialog,
    updateAIPreferences: dialogsState.updateAIPreferences,
    handleAddSnack: dialogsState.handleAddSnack,
    setDialogs: dialogsState.setDialogs,
    
    // AI actions
    handleGenerateAIPlan: aiActions.handleGenerateAIPlan
  };

  console.log('🔍 useMealPlanState combined properties:', Object.keys(combinedState));

  return combinedState;
};
