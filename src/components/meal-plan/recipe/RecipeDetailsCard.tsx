
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Users } from "lucide-react";
import type { DailyMeal } from "@/features/meal-plan/types";

interface RecipeDetailsCardProps {
  meal: DailyMeal;
}

export const RecipeDetailsCard = ({ meal }: RecipeDetailsCardProps) => {
  return (
    <Card>
      <CardContent className="p-4">
        <h3 className="font-semibold mb-3">Meal Details</h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Meal Type:</span>
            <Badge className="capitalize">{meal.meal_type}</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Prep Time:</span>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {meal.prep_time || 0} min
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Cook Time:</span>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {meal.cook_time || 0} min
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Servings:</span>
            <span className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              {meal.servings || 1}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
