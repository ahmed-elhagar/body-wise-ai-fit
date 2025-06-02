
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Users } from "lucide-react";
import type { DailyMeal } from "@/features/meal-plan/types";

interface ExchangeCurrentMealCardProps {
  meal: DailyMeal;
}

export const ExchangeCurrentMealCard = ({ meal }: ExchangeCurrentMealCardProps) => {
  return (
    <Card>
      <CardContent className="p-4">
        <h3 className="font-semibold mb-2">Current Meal</h3>
        <p className="mb-3">{meal.name}</p>
        
        <div className="flex flex-wrap gap-2 mb-3">
          <Badge>
            <Clock className="w-3 h-3 mr-1" />
            {(meal.prep_time || 0) + (meal.cook_time || 0)} min
          </Badge>
          <Badge>
            <Users className="w-3 h-3 mr-1" />
            {meal.servings || 1} serving{(meal.servings || 1) !== 1 ? 's' : ''}
          </Badge>
          <Badge>
            {meal.calories || 0} cal
          </Badge>
        </div>

        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className="bg-gray-50 p-2 rounded text-center">
            <span className="font-medium text-green-600">{meal.protein || 0}g</span>
            <div className="text-gray-600">protein</div>
          </div>
          <div className="bg-gray-50 p-2 rounded text-center">
            <span className="font-medium text-blue-600">{meal.carbs || 0}g</span>
            <div className="text-gray-600">carbs</div>
          </div>
          <div className="bg-gray-50 p-2 rounded text-center">
            <span className="font-medium text-yellow-600">{meal.fat || 0}g</span>
            <div className="text-gray-600">fat</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
