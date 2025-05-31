
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
          <div className={`w-14 h-14 ${isSnack ? 'bg-gradient-to-br from-green-500 to-emerald-600' : 'bg-gradient-to-br from-purple-500 to-pink-500'} rounded-2xl flex items-center justify-center shadow-lg`}>
            {isSnack ? <Apple className="w-7 h-7 text-white" /> : <ChefHat className="w-7 h-7 text-white" />}
          </div>
          <div>
            <DialogTitle className="text-2xl lg:text-3xl font-bold text-white leading-tight">
              {isSnack ? meal.name.replace('🍎 ', '') : meal.name}
            </DialogTitle>
            <p className="text-purple-200 font-medium mt-1">
              {isSnack ? 'Healthy Snack Recipe' : 'Delicious Meal Recipe'}
            </p>
          </div>
        </div>
      </div>
      
      <div className="flex flex-wrap items-center gap-3">
        <Badge className={`${isSnack ? 'bg-green-500/20 text-green-300 border-green-500/30' : 'bg-purple-500/20 text-purple-300 border-purple-500/30'} font-medium backdrop-blur-sm`}>
          <Clock className="w-3 h-3 mr-1" />
          {(meal.prepTime || 0) + (meal.cookTime || 0) || (isSnack ? 5 : 20)} min
        </Badge>
        <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30 font-medium backdrop-blur-sm">
          <Users className="w-3 h-3 mr-1" />
          {meal.servings || 1} serving{meal.servings !== 1 ? 's' : ''}
        </Badge>
        <Badge className={`${isSnack ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' : 'bg-pink-500/20 text-pink-300 border-pink-500/30'} font-medium backdrop-blur-sm`}>
          {meal.calories} calories
        </Badge>
        {isSnack && (
          <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30 font-medium backdrop-blur-sm">
            🍎 Snack
          </Badge>
        )}
      </div>
    </DialogHeader>
  );
};

export default RecipeHeader;
