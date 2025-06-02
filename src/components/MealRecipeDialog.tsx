
import RecipeDialog from "./meal-recipe/RecipeDialog";
import type { DailyMeal } from "@/features/meal-plan/types";

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
    type: meal.meal_type,
    time: "12:00", // Default time since DailyMeal doesn't have time
    name: meal.name,
    calories: meal.calories,
    protein: meal.protein,
    carbs: meal.carbs,
    fat: meal.fat,
    ingredients: meal.ingredients.map(ingredient => ({
      name: ingredient.name,
      quantity: ingredient.quantity || "1",
      unit: ingredient.unit || "piece"
    })),
    instructions: meal.instructions || [],
    prepTime: meal.prep_time || 0,
    cookTime: meal.cook_time || 0,
    servings: meal.servings || 1,
    youtube_search_term: meal.youtube_search_term,
    image_url: meal.image_url,
    image: meal.image_url || "" // Map image_url to image
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
