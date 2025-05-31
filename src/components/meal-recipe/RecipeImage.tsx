
import type { Meal } from "@/types/meal";

interface RecipeImageProps {
  meal: Meal;
  detailedMeal: any;
}

const RecipeImage = ({ meal, detailedMeal }: RecipeImageProps) => {
  const imageUrl = detailedMeal?.image_url || meal.image_url;
  
  if (!imageUrl) return null;

  return (
    <div className="w-full h-72 rounded-2xl overflow-hidden shadow-lg">
      <img 
        src={imageUrl} 
        alt={meal.name}
        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
      />
    </div>
  );
};

export default RecipeImage;
