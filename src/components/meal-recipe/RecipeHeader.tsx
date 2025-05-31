
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ChefHat, Clock, Users, Apple } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Meal } from "@/types/meal";

interface RecipeHeaderProps {
  meal: Meal;
}

const RecipeHeader = ({ meal }: RecipeHeaderProps) => {
  const isSnack = meal.name.includes('🍎') || meal.meal_type === 'snack';
  
  return (
    <DialogHeader className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className={`w-14 h-14 ${isSnack ? 'bg-gradient-to-br from-emerald-500 to-green-600' : 'bg-gradient-to-br from-blue-500 to-indigo-600'} rounded-2xl flex items-center justify-center shadow-lg`}>
            {isSnack ? <Apple className="w-7 h-7 text-white" /> : <ChefHat className="w-7 h-7 text-white" />}
          </div>
          <div>
            <DialogTitle className="text-2xl lg:text-3xl font-bold text-gray-800 leading-tight">
              {isSnack ? meal.name.replace('🍎 ', '') : meal.name}
            </DialogTitle>
            <p className="text-gray-600 font-medium mt-1">
              {isSnack ? 'Healthy Snack Recipe' : 'Delicious Meal Recipe'}
            </p>
          </div>
        </div>
      </div>
      
      <div className="flex flex-wrap items-center gap-3">
        <Badge className={`${isSnack ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : 'bg-blue-100 text-blue-700 border-blue-200'} font-medium`}>
          <Clock className="w-3 h-3 mr-1" />
          {(meal.prepTime || 0) + (meal.cookTime || 0) || (isSnack ? 5 : 20)} min
        </Badge>
        <Badge className="bg-orange-100 text-orange-700 border-orange-200 font-medium">
          <Users className="w-3 h-3 mr-1" />
          {meal.servings || 1} serving{meal.servings !== 1 ? 's' : ''}
        </Badge>
        <Badge className={`${isSnack ? 'bg-green-100 text-green-700 border-green-200' : 'bg-purple-100 text-purple-700 border-purple-200'} font-medium`}>
          {meal.calories} calories
        </Badge>
        {isSnack && (
          <Badge className="bg-amber-100 text-amber-700 border-amber-200 font-medium">
            🍎 Snack
          </Badge>
        )}
      </div>
    </DialogHeader>
  );
};

export default RecipeHeader;
