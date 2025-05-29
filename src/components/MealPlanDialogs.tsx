
import AIGenerationDialog from "@/components/AIGenerationDialog";
import AddSnackDialog from "@/components/AddSnackDialog";
import ShoppingListDialog from "@/components/ShoppingListDialog";
import MealRecipeDialog from "@/components/MealRecipeDialog";
import MealExchangeDialog from "@/components/MealExchangeDialog";
import type { Meal } from "@/types/meal";

interface MealPlanDialogsProps {
  // AI Dialog
  showAIDialog: boolean;
  onCloseAIDialog: () => void;
  aiPreferences: any;
  onPreferencesChange: (preferences: any) => void;
  onGenerateAI: () => void;
  isGenerating: boolean;
  
  // Add Snack Dialog
  showAddSnackDialog: boolean;
  onCloseAddSnackDialog: () => void;
  selectedDay: number;
  weeklyPlanId: string | null;
  onSnackAdded: () => void;
  currentDayCalories: number;
  targetDayCalories: number;
  
  // Shopping List Dialog
  showShoppingListDialog: boolean;
  onCloseShoppingListDialog: () => void;
  shoppingItems: any[];
  
  // Recipe Dialog
  showRecipeDialog: boolean;
  onCloseRecipeDialog: () => void;
  selectedMeal: Meal | null;
  
  // Exchange Dialog
  showExchangeDialog: boolean;
  onCloseExchangeDialog: () => void;
  onExchange: () => void;
}

const MealPlanDialogs = ({
  showAIDialog,
  onCloseAIDialog,
  aiPreferences,
  onPreferencesChange,
  onGenerateAI,
  isGenerating,
  showAddSnackDialog,
  onCloseAddSnackDialog,
  selectedDay,
  weeklyPlanId,
  onSnackAdded,
  currentDayCalories,
  targetDayCalories,
  showShoppingListDialog,
  onCloseShoppingListDialog,
  shoppingItems,
  showRecipeDialog,
  onCloseRecipeDialog,
  selectedMeal,
  showExchangeDialog,
  onCloseExchangeDialog,
  onExchange
}: MealPlanDialogsProps) => {
  return (
    <>
      <AIGenerationDialog
        isOpen={showAIDialog}
        onClose={onCloseAIDialog}
        preferences={aiPreferences}
        onPreferencesChange={onPreferencesChange}
        onGenerate={onGenerateAI}
        isGenerating={isGenerating}
      />

      <AddSnackDialog
        isOpen={showAddSnackDialog}
        onClose={onCloseAddSnackDialog}
        selectedDay={selectedDay}
        weeklyPlanId={weeklyPlanId}
        onSnackAdded={onSnackAdded}
        currentDayCalories={currentDayCalories}
        targetDayCalories={targetDayCalories}
      />

      <ShoppingListDialog
        isOpen={showShoppingListDialog}
        onClose={onCloseShoppingListDialog}
        items={shoppingItems}
      />

      {selectedMeal && (
        <MealRecipeDialog
          isOpen={showRecipeDialog}
          onClose={onCloseRecipeDialog}
          meal={selectedMeal}
        />
      )}

      {selectedMeal && (
        <MealExchangeDialog
          isOpen={showExchangeDialog}
          onClose={onCloseExchangeDialog}
          currentMeal={selectedMeal}
          onExchange={onExchange}
        />
      )}
    </>
  );
};

export default MealPlanDialogs;
