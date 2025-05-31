
import RecipeDialog from "./meal-recipe/RecipeDialog";
import type { Meal } from "@/types/meal";

interface MealRecipeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  meal: Meal;
  onRecipeGenerated?: () => void;
}

const MealRecipeDialog = ({ isOpen, onClose, meal, onRecipeGenerated }: MealRecipeDialogProps) => {
  return (
    <RecipeDialog
      isOpen={isOpen}
      onClose={onClose}
      meal={meal}
      onRecipeGenerated={onRecipeGenerated}
    />
  );
};

export default MealRecipeDialog;
