
import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useMealRecipe } from "@/hooks/useMealRecipe";
import type { Meal } from "@/types/meal";
import RecipeHeader from "./meal-recipe/RecipeHeader";
import RecipeImage from "./meal-recipe/RecipeImage";
import NutritionCards from "./meal-recipe/NutritionCards";
import RecipeGenerationCard from "./meal-recipe/RecipeGenerationCard";
import IngredientsCard from "./meal-recipe/IngredientsCard";
import InstructionsCard from "./meal-recipe/InstructionsCard";
import RecipeActionButtons from "./meal-recipe/RecipeActionButtons";

interface MealRecipeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  meal: Meal;
  onRecipeGenerated?: () => void;
}

const MealRecipeDialog = ({ isOpen, onClose, meal, onRecipeGenerated }: MealRecipeDialogProps) => {
  const { generateRecipe, isGeneratingRecipe } = useMealRecipe();
  const [detailedMeal, setDetailedMeal] = useState<any>(null);

  const hasDetailedRecipe = detailedMeal?.ingredients?.length > 0 && detailedMeal?.instructions?.length > 0;

  const handleGenerateRecipe = async () => {
    if (!meal.id) {
      console.error('No meal ID available for recipe generation');
      return;
    }
    
    const result = await generateRecipe(meal.id);
    if (result) {
      console.log('✅ Recipe generated, updating detailed meal:', result);
      setDetailedMeal(result);
      
      if (onRecipeGenerated) {
        onRecipeGenerated();
      }
    }
  };

  useEffect(() => {
    if (isOpen) {
      if (meal.ingredients?.length > 0 && meal.instructions?.length > 0) {
        setDetailedMeal(meal);
      } else {
        setDetailedMeal(null);
      }
    }
  }, [isOpen, meal]);

  const openYouTubeSearch = () => {
    const searchTerm = detailedMeal?.youtube_search_term || detailedMeal?.youtubeId || `${meal.name} recipe`;
    const youtubeUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(searchTerm)}`;
    window.open(youtubeUrl, '_blank');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-white to-gray-50 border-0 shadow-2xl">
        <div className="space-y-6 p-6">
          <RecipeHeader meal={meal} />
          
          <RecipeImage meal={meal} detailedMeal={detailedMeal} />
          
          <NutritionCards meal={meal} />

          <RecipeGenerationCard
            hasDetailedRecipe={hasDetailedRecipe}
            mealId={meal.id}
            isGeneratingRecipe={isGeneratingRecipe}
            onGenerateRecipe={handleGenerateRecipe}
          />

          {hasDetailedRecipe && (
            <>
              <IngredientsCard ingredients={detailedMeal.ingredients} />
              <InstructionsCard instructions={detailedMeal.instructions} />
              <RecipeActionButtons 
                onOpenYouTube={openYouTubeSearch}
                onClose={onClose}
              />
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MealRecipeDialog;
