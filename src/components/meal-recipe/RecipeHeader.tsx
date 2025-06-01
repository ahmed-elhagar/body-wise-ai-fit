
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ChefHat, Clock, Users, Apple } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Meal } from "@/types/meal";

interface RecipeHeaderProps {
  meal: Meal;
}

const RecipeHeader = ({ meal }: RecipeHeaderProps) => {
  const isSnack = meal.name.includes('🍎') || meal.type === 'snack';
  
  return (
    <DialogHeader className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className={`w-14 h-14 ${isSnack ? 'bg-gradient-to-br from-fitness-accent-500 to-fitness-accent-600' : 'bg-gradient-to-br from-fitness-primary-500 to-fitness-primary-600'} rounded-2xl flex items-center justify-center shadow-lg`}>
            {isSnack ? <Apple className="w-7 h-7 text-white" /> : <ChefHat className="w-7 h-7 text-white" />}
          </div>
          <div>
            <DialogTitle className="text-2xl lg:text-3xl font-bold text-fitness-primary-700 leading-tight">
              {isSnack ? meal.name.replace('🍎 ', '') : meal.name}
            </DialogTitle>
            <p className="text-fitness-primary-600 font-medium mt-1">
              {isSnack ? 'Healthy Snack Recipe' : 'Delicious Meal Recipe'}
            </p>
          </div>
        </div>
      </div>
      
      <div className="flex flex-wrap items-center gap-3">
        <Badge className={`${isSnack ? 'bg-fitness-accent-100 text-fitness-accent-700 border-fitness-accent-200' : 'bg-fitness-primary-100 text-fitness-primary-700 border-fitness-primary-200'} font-medium`}>
          <Clock className="w-3 h-3 mr-1" />
          {(meal.prepTime || 0) + (meal.cookTime || 0) || (isSnack ? 5 : 20)} min
        </Badge>
        <Badge className="bg-fitness-orange-100 text-fitness-orange-700 border-fitness-orange-200 font-medium">
          <Users className="w-3 h-3 mr-1" />
          {meal.servings || 1} serving{meal.servings !== 1 ? 's' : ''}
        </Badge>
        <Badge className={`${isSnack ? 'bg-green-100 text-green-700 border-green-200' : 'bg-purple-100 text-purple-700 border-purple-200'} font-medium`}>
          {meal.calories} calories
        </Badge>
        {isSnack && (
          <Badge className="bg-fitness-accent-100 text-fitness-accent-700 border-fitness-accent-200 font-medium">
            🍎 Snack
          </Badge>
        )}
      </div>
    </DialogHeader>
  );
};

export default RecipeHeader;
