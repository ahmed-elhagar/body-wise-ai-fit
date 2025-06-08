
import { Card } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState, useEffect } from "react";
import MealCardImage from "@/components/meal-card/MealCardImage";
import NutritionGrid from "@/components/meal-card/NutritionGrid";
import MealDetails from "@/components/meal-card/MealDetails";
import IngredientsPreview from "@/components/meal-card/IngredientsPreview";
import MealActionButtons from "@/components/meal-card/MealActionButtons";

interface Ingredient {
  name: string;
  quantity: string;
  unit: string;
}

interface Meal {
  id?: string;
  type: string;
  time: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  ingredients: Ingredient[];
  instructions: string[];
  cookTime: number;
  prepTime: number;
  servings: number;
  imageUrl?: string;
  image: string;
  image_url?: string; // Database field
}

interface MealCardProps {
  meal: Meal;
  onShowRecipe: (meal: Meal) => void;
  onExchangeMeal: (meal: Meal) => void;
}

const MealCard = ({ meal, onShowRecipe, onExchangeMeal }: MealCardProps) => {
  const { isRTL } = useLanguage();
  
  // Enhanced image state management with proper meal ID tracking
  const [mealImage, setMealImage] = useState<string | null>(
    meal.image_url || meal.imageUrl || null
  );
  const [isLoadingImage, setIsLoadingImage] = useState(false);
  const [currentMealId, setCurrentMealId] = useState(meal.id);

  // Reset image when meal changes (fixes caching issue)
  useEffect(() => {
    if (meal.id !== currentMealId) {
      console.log(`🔄 Meal changed from ${currentMealId} to ${meal.id}, resetting image`);
      setCurrentMealId(meal.id);
      setMealImage(meal.image_url || meal.imageUrl || null);
      setIsLoadingImage(false);
    }
  }, [meal.id, currentMealId]);

  // Update image when meal data changes (e.g., after recipe generation)
  useEffect(() => {
    if (meal.image_url && meal.image_url !== mealImage && meal.id === currentMealId) {
      console.log(`📸 Updating meal image for ${meal.name}:`, {
        oldImage: mealImage,
        newImage: meal.image_url
      });
      setMealImage(meal.image_url);
    }
  }, [meal.image_url, meal.imageUrl, mealImage, meal.id, currentMealId]);

  const generateMealImage = async () => {
    if (isLoadingImage || mealImage) return;
    
    setIsLoadingImage(true);
    try {
      const response = await fetch('/api/generate-meal-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mealName: meal.name.replace('🍎 ', ''),
          ingredients: meal.ingredients.slice(0, 3).map(ing => ing.name).join(', ')
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setMealImage(data.imageUrl);
      }
    } catch (error) {
      console.error('Failed to generate meal image:', error);
    } finally {
      setIsLoadingImage(false);
    }
  };

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/95 backdrop-blur-sm overflow-hidden">
      <div className="relative">
        <MealCardImage
          meal={meal}
          mealImage={mealImage}
          isLoadingImage={isLoadingImage}
          onGenerateImage={generateMealImage}
        />

        <div className={`p-3 sm:p-4 ${isRTL ? 'text-right' : 'text-left'}`}>
          <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2 sm:mb-3 group-hover:text-fitness-primary transition-colors line-clamp-2">
            {meal.name.replace('🍎 ', '')}
          </h3>
          
          <NutritionGrid
            calories={meal.calories}
            protein={meal.protein}
            carbs={meal.carbs}
            fat={meal.fat}
          />

          <MealDetails
            prepTime={meal.prepTime}
            cookTime={meal.cookTime}
            servings={meal.servings}
            ingredients={meal.ingredients}
          />

          <IngredientsPreview ingredients={meal.ingredients} />
          
          <MealActionButtons
            meal={meal}
            onShowRecipe={onShowRecipe}
            onExchangeMeal={onExchangeMeal}
          />
        </div>
      </div>
    </Card>
  );
};

export default MealCard;
