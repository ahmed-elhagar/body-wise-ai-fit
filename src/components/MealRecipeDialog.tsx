
import RecipeDialog from "./meal-recipe/RecipeDialog";
import type { DailyMeal } from "@/hooks/useMealPlanData";

interface MealRecipeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  meal: DailyMeal;
  onRecipeGenerated?: () => void;
}

const MealRecipeDialog = ({ isOpen, onClose, meal, onRecipeGenerated }: MealRecipeDialogProps) => {
  console.log('🍽️ MealRecipeDialog rendered:', {
    isOpen,
    mealName: meal?.name,
    mealId: meal?.id
  });

  // Convert DailyMeal to Meal type for RecipeDialog
  const convertedMeal = meal ? {
    id: meal.id,
    name: meal.name,
    calories: meal.calories,
    protein: meal.protein,
    carbs: meal.carbs,
    fat: meal.fat,
    ingredients: meal.ingredients || [],
    instructions: meal.instructions || [],
    prepTime: meal.prep_time || 0,
    cookTime: meal.cook_time || 0,
    servings: meal.servings || 1,
    youtube_search_term: meal.youtube_search_term,
    image_url: meal.image_url
  } : null;

  if (!convertedMeal) {
    return null;
  }

  return (
    <RecipeDialog
      isOpen={isOpen}
      onClose={onClose}
      meal={convertedMeal}
      onRecipeGenerated={onRecipeGenerated}
    />
  );
};

export default MealRecipeDialog;
