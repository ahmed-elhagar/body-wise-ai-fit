
import { useState } from "react";
import { toast } from "sonner";
import { useAIMealPlan } from "@/hooks/useAIMealPlan";
import { useDynamicMealPlan } from "@/hooks/useDynamicMealPlan";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import type { Meal, ShoppingItem } from "@/types/meal";
import { getCategoryForIngredient } from "@/utils/mealPlanUtils";

export const useMealPlanLogic = () => {
  const { user } = useAuth();
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
    console.log('Opening meal exchange for:', meal.name);
    const mealId = currentWeekPlan?.dailyMeals?.find(m => 
      m.day_number === selectedDayNumber && 
      m.name === meal.name
    )?.id;
    
    setSelectedMeal({ current: meal, index, mealId });
    setShowExchangeDialog(true);
  };

  const handleMealExchange = async (alternative: any) => {
    try {
      if (!user?.id || !selectedMeal?.mealId) {
        toast.error('Unable to exchange meal');
        return;
      }

      console.log('Exchanging meal with:', alternative.name);

      // Update the meal in the database
      const { error } = await supabase
        .from('daily_meals')
        .update({
          name: alternative.name,
          calories: alternative.calories,
          protein: alternative.protein,
          carbs: alternative.carbs,
          fat: alternative.fat,
          ingredients: alternative.ingredients || [],
          instructions: alternative.instructions || [],
          prep_time: alternative.prepTime || 0,
          cook_time: alternative.cookTime || 0,
          servings: alternative.servings || 1
        })
        .eq('id', selectedMeal.mealId)
        .eq('weekly_plan_id', currentWeekPlan?.weeklyPlan?.id);

      if (error) {
        console.error('Error updating meal:', error);
        toast.error('Failed to exchange meal');
        return;
      }

      toast.success(`Meal exchanged to ${alternative.name}!`);
      
      // Refresh the meal plan data
      window.location.reload();
      
    } catch (error) {
      console.error('Error in meal exchange:', error);
      toast.error('Failed to exchange meal');
    }
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
    setSelectedMeal,
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
    handleMealExchange,
    handleShowShoppingList,
    
    // Utilities
    getWeekStartDate
  };
};
