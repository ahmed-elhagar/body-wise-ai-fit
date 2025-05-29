
import type { Meal } from "@/types/meal";

interface RecipeImageProps {
  meal: Meal;
  detailedMeal: any;
}

const RecipeImage = ({ meal, detailedMeal }: RecipeImageProps) => {
  const imageUrl = detailedMeal?.image_url || meal.image_url;
  
  if (!imageUrl) return null;

  return (
    <div className="w-full h-64 rounded-lg overflow-hidden">
      <img 
        src={imageUrl} 
        alt={meal.name}
        className="w-full h-full object-cover"
      />
    </div>
  );
};

export default RecipeImage;
