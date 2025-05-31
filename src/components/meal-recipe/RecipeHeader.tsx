
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
        <div className="w-12 h-12 bg-fitness-accent-500 rounded-lg flex items-center justify-center">
          <ChefHat className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-fitness-primary-700">{meal.name}</h2>
          <p className="text-sm text-fitness-primary-600">{meal.calories} calories • {meal.servings} serving(s)</p>
        </div>
      </DialogTitle>
    </DialogHeader>
  );
};

export default RecipeHeader;
