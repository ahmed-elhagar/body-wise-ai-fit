
import AIGenerationDialog from "./AIGenerationDialog";
import AddSnackDialog from "./AddSnackDialog";
import ShoppingListDialog from "./ShoppingListDialog";
import MealRecipeDialog from "./MealRecipeDialog";
import MealExchangeDialog from "./MealExchangeDialog";
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
  selectedMealIndex: number;
  onExchange: () => void;
  
  // New callback for recipe generation
  onRecipeGenerated?: () => void;
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
  selectedMealIndex,
  onExchange,
  onRecipeGenerated
}: MealPlanDialogsProps) => {
  return (
    <>
      {/* Enhanced AI Generation Dialog */}
      <AIGenerationDialog
        isOpen={showAIDialog}
        onClose={onCloseAIDialog}
        preferences={aiPreferences}
        onPreferencesChange={onPreferencesChange}
        onGenerate={onGenerateAI}
        isGenerating={isGenerating}
      />

      {/* Enhanced Add Snack Dialog */}
      <AddSnackDialog
        isOpen={showAddSnackDialog}
        onClose={onCloseAddSnackDialog}
        selectedDay={selectedDay}
        weeklyPlanId={weeklyPlanId}
        onSnackAdded={onSnackAdded}
        currentDayCalories={currentDayCalories}
        targetDayCalories={targetDayCalories}
      />

      {/* Enhanced Shopping List Dialog */}
      <ShoppingListDialog
        isOpen={showShoppingListDialog}
        onClose={onCloseShoppingListDialog}
        items={shoppingItems}
      />

      {/* Enhanced Recipe Dialog */}
      {selectedMeal && (
        <MealRecipeDialog
          isOpen={showRecipeDialog}
          onClose={onCloseRecipeDialog}
          meal={selectedMeal}
          onRecipeGenerated={onRecipeGenerated}
        />
      )}

      {/* Enhanced Exchange Dialog */}
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
