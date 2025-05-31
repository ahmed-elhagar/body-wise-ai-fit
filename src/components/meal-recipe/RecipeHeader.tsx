
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ChefHat, Clock, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Meal } from "@/types/meal";

interface RecipeHeaderProps {
  meal: Meal;
}

const RecipeHeader = ({ meal }: RecipeHeaderProps) => {
  return (
    <DialogHeader className="text-center space-y-4">
      <div className="flex justify-center">
        <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center shadow-lg">
          <ChefHat className="w-8 h-8 text-white" />
        </div>
      </div>
      
      <DialogTitle className="text-3xl font-bold text-gray-800 leading-tight">
        {meal.name}
      </DialogTitle>
      
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Badge variant="secondary" className="bg-orange-100 text-orange-700 border-orange-200">
          <Clock className="w-3 h-3 mr-1" />
          {(meal.prepTime || 0) + (meal.cookTime || 0)} min
        </Badge>
        <Badge variant="secondary" className="bg-blue-100 text-blue-700 border-blue-200">
          <Users className="w-3 h-3 mr-1" />
          {meal.servings} serving{meal.servings !== 1 ? 's' : ''}
        </Badge>
        <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-200">
          {meal.calories} calories
        </Badge>
      </div>
    </DialogHeader>
  );
};

export default RecipeHeader;
