
import { EnhancedRecipeDialog } from "../EnhancedRecipeDialog";
import MealPlanExchangeDialog from "../MealPlanExchangeDialog";
import EnhancedAddSnackDialog from "../EnhancedAddSnackDialog";
import MealPlanAIDialog from "../MealPlanAIDialog";
import EnhancedShoppingListDrawer from "@/components/shopping-list/EnhancedShoppingListDrawer";
import type { DailyMeal, MealPlanPreferences, MealPlanFetchResult } from "@/types/mealPlan";

interface MealPlanDialogsProps {
  // Dialog states
  showAIDialog: boolean;
  setShowAIDialog: (show: boolean) => void;
  showRecipeDialog: boolean;
  setShowRecipeDialog: (show: boolean) => void;
  showExchangeDialog: boolean;
  setShowExchangeDialog: (show: boolean) => void;
  showAddSnackDialog: boolean;
  setShowAddSnackDialog: (show: boolean) => void;
  showShoppingListDialog: boolean;
  setShowShoppingListDialog: (show: boolean) => void;
  
  // Selected items
  selectedMeal: DailyMeal | null;
  selectedMealIndex: number;
  
  // AI preferences
  aiPreferences: MealPlanPreferences;
  setAiPreferences: (preferences: MealPlanPreferences) => void;
  
  // Actions
  handleGenerateAI: () => Promise<boolean>;
  onRefetch: () => void;
  
  // Data
  mealPlanData: MealPlanFetchResult | null;
  selectedDayNumber: number;
  weekStartDate: Date;
}

const MealPlanDialogs = ({
  showAIDialog,
  setShowAIDialog,
  showRecipeDialog,
  setShowRecipeDialog,
  showExchangeDialog,
  setShowExchangeDialog,
  showAddSnackDialog,
  setShowAddSnackDialog,
  showShoppingListDialog,
  setShowShoppingListDialog,
  selectedMeal,
  selectedMealIndex,
  aiPreferences,
  setAiPreferences,
  handleGenerateAI,
  onRefetch,
  mealPlanData,
  selectedDayNumber,
  weekStartDate
}: MealPlanDialogsProps) => {
  return (
    <>
      {/* AI Generation Dialog */}
      <MealPlanAIDialog
        open={showAIDialog}
        onOpenChange={setShowAIDialog}
        preferences={aiPreferences}
        onPreferencesChange={setAiPreferences}
        onGenerate={handleGenerateAI}
        isGenerating={false}
      />

      {/* Recipe Dialog */}
      {selectedMeal && (
        <EnhancedRecipeDialog
          isOpen={showRecipeDialog}
          onClose={() => setShowRecipeDialog(false)}
          meal={selectedMeal}
        />
      )}

      {/* Exchange Dialog */}
      {selectedMeal && (
        <MealPlanExchangeDialog
          open={showExchangeDialog}
          onOpenChange={setShowExchangeDialog}
          meal={selectedMeal}
          mealIndex={selectedMealIndex}
        />
      )}

      {/* Add Snack Dialog */}
      <EnhancedAddSnackDialog
        isOpen={showAddSnackDialog}
        onClose={() => setShowAddSnackDialog(false)}
        selectedDay={selectedDayNumber}
        weeklyPlanId={mealPlanData?.weeklyPlan?.id || null}
        onSnackAdded={onRefetch}
        currentDayCalories={0}
        targetDayCalories={2000}
      />

      {/* Shopping List Dialog */}
      <EnhancedShoppingListDrawer
        isOpen={showShoppingListDialog}
        onClose={() => setShowShoppingListDialog(false)}
        weeklyPlan={mealPlanData}
        weekId={mealPlanData?.weeklyPlan?.id}
        onShoppingListUpdate={onRefetch}
      />
    </>
  );
};

export default MealPlanDialogs;
