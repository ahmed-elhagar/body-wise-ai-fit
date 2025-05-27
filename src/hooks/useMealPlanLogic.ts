
import { useState } from "react";
import { toast } from "sonner";
import { useAIMealPlan } from "@/hooks/useAIMealPlan";
import { useDynamicMealPlan } from "@/hooks/useDynamicMealPlan";
import type { Meal, ShoppingItem } from "@/types/meal";
import { getCategoryForIngredient } from "@/utils/mealPlanUtils";

export const useMealPlanLogic = () => {
  const { generateMealPlan, isGenerating } = useAIMealPlan();
  
  const [showAIDialog, setShowAIDialog] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState<any>(null);
  const [showRecipeDialog, setShowRecipeDialog] = useState(false);
  const [showShoppingDialog, setShowShoppingDialog] = useState(false);
  const [showExchangeDialog, setShowExchangeDialog] = useState(false);
  const [currentWeekOffset, setCurrentWeekOffset] = useState(0);
  const [selectedDayNumber, setSelectedDayNumber] = useState(1);
  
  const [aiPreferences, setAiPreferences] = useState({
    duration: "1",
    cuisine: "",
    maxPrepTime: "30",
    mealTypes: "5"
  });

  const { currentWeekPlan, isLoading, getWeekStartDate } = useDynamicMealPlan(currentWeekOffset);

  const handleGenerateAIPlan = () => {
    console.log('Generating AI meal plan with preferences:', aiPreferences);
    generateMealPlan(aiPreferences);
    setShowAIDialog(false);
  };

  const handleRegeneratePlan = () => {
    console.log('Regenerating meal plan with preferences:', aiPreferences);
    generateMealPlan(aiPreferences);
    toast.success("Regenerating your meal plan...");
  };

  const handleShowRecipe = (meal: Meal) => {
    console.log('Showing recipe for meal:', meal);
    setSelectedMeal(meal);
    setShowRecipeDialog(true);
  };

  const handleExchangeMeal = (meal: Meal, index: number) => {
    const alternatives = [
      {
        type: "lunch",
        time: "1:00 PM",
        name: "Grilled Chicken Salad",
        calories: meal.calories + 10,
        protein: meal.protein,
        carbs: meal.carbs - 5,
        fat: meal.fat,
        ingredients: [
          { name: "Grilled chicken breast", quantity: "4", unit: "oz" },
          { name: "Mixed greens", quantity: "2", unit: "cups" }
        ],
        instructions: [
          "Season and grill chicken breast until cooked through",
          "Combine greens and top with sliced chicken"
        ],
        prepTime: 10,
        cookTime: 15,
        servings: 1,
        image: "🥗",
        youtubeId: "dQw4w9WgXcQ"
      }
    ];
    
    setSelectedMeal({ current: meal, alternatives, index });
    setShowExchangeDialog(true);
  };

  const handleShowShoppingList = () => {
    if (!currentWeekPlan?.dailyMeals) return;
    
    const shoppingItems: ShoppingItem[] = currentWeekPlan.dailyMeals
      .filter(meal => meal.day_number === selectedDayNumber)
      .flatMap(meal => {
        const ingredients = Array.isArray(meal.ingredients) ? meal.ingredients : [];
        return ingredients.map((ingredient: any) => ({
          name: ingredient.name || 'Unknown ingredient',
          quantity: ingredient.quantity || "1",
          unit: ingredient.unit || "serving",
          category: getCategoryForIngredient(ingredient.name || '')
        }));
      });
    
    setSelectedMeal({ items: shoppingItems });
    setShowShoppingDialog(true);
  };

  return {
    // State
    showAIDialog,
    selectedMeal,
    showRecipeDialog,
    showShoppingDialog,
    showExchangeDialog,
    currentWeekOffset,
    selectedDayNumber,
    aiPreferences,
    currentWeekPlan,
    isLoading,
    isGenerating,
    
    // Setters
    setShowAIDialog,
    setShowRecipeDialog,
    setShowShoppingDialog,
    setShowExchangeDialog,
    setCurrentWeekOffset,
    setSelectedDayNumber,
    setAiPreferences,
    
    // Handlers
    handleGenerateAIPlan,
    handleRegeneratePlan,
    handleShowRecipe,
    handleExchangeMeal,
    handleShowShoppingList,
    
    // Utilities
    getWeekStartDate
  };
};
