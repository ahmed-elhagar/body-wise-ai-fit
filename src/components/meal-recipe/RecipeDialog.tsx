
import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useMealRecipe } from "@/hooks/useMealRecipe";
import type { Meal } from "@/types/meal";
import RecipeHeader from "./RecipeHeader";
import RecipeImage from "./RecipeImage";
import NutritionCards from "./NutritionCards";
import RecipeGenerationCard from "./RecipeGenerationCard";
import IngredientsCard from "./IngredientsCard";
import InstructionsCard from "./InstructionsCard";
import RecipeActionButtons from "./RecipeActionButtons";

interface RecipeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  meal: Meal;
  onRecipeGenerated?: () => void;
}

const RecipeDialog = ({ isOpen, onClose, meal, onRecipeGenerated }: RecipeDialogProps) => {
  const { generateRecipe, isGeneratingRecipe } = useMealRecipe();
  const [detailedMeal, setDetailedMeal] = useState<any>(null);

  const hasDetailedRecipe = detailedMeal?.ingredients?.length > 0 && detailedMeal?.instructions?.length > 0;
  const isSnack = meal.name.includes('🍎') || meal.meal_type === 'snack';

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
      <DialogContent className="max-w-4xl max-h-[95vh] overflow-hidden bg-gradient-to-br from-slate-50 to-blue-50 border-0 shadow-2xl rounded-3xl p-0">
        <div className="relative overflow-y-auto max-h-[95vh]">
          <div className="sticky top-0 z-10 bg-gradient-to-r from-white/95 to-blue-50/95 backdrop-blur-sm border-b border-gray-200/50 p-6 pb-4">
            <RecipeHeader meal={meal} />
          </div>

          <div className="p-6 space-y-8">
            {/* Recipe Image */}
            <RecipeImage meal={meal} detailedMeal={detailedMeal} />

            {/* Nutrition Cards */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                {isSnack ? '🍎' : '🍽️'} 
                {isSnack ? 'Snack Nutrition' : 'Meal Nutrition'}
              </h3>
              <NutritionCards meal={meal} />
            </div>

            {/* Recipe Generation */}
            <RecipeGenerationCard
              hasDetailedRecipe={hasDetailedRecipe}
              mealId={meal.id}
              isGeneratingRecipe={isGeneratingRecipe}
              onGenerateRecipe={handleGenerateRecipe}
            />

            {/* Ingredients */}
            {hasDetailedRecipe && detailedMeal?.ingredients?.length > 0 && (
              <IngredientsCard ingredients={detailedMeal.ingredients} />
            )}

            {/* Instructions */}
            {hasDetailedRecipe && detailedMeal?.instructions?.length > 0 && (
              <InstructionsCard instructions={detailedMeal.instructions} />
            )}

            {/* Action Buttons */}
            {hasDetailedRecipe && (
              <RecipeActionButtons 
                onOpenYouTube={openYouTubeSearch}
                onClose={onClose}
              />
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RecipeDialog;
