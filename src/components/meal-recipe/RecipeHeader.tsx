
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ChefHat } from "lucide-react";
import type { Meal } from "@/types/meal";

interface RecipeHeaderProps {
  meal: Meal;
}

const RecipeHeader = ({ meal }: RecipeHeaderProps) => {
  return (
    <DialogHeader>
      <DialogTitle className="flex items-center space-x-3">
        <ChefHat className="w-6 h-6 text-fitness-primary" />
        <div>
          <h2 className="text-2xl font-bold text-gray-800">{meal.name}</h2>
          <p className="text-sm text-gray-600">{meal.calories} calories • {meal.servings} serving(s)</p>
        </div>
      </DialogTitle>
    </DialogHeader>
  );
};

export default RecipeHeader;
