
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Users, Zap } from "lucide-react";
import type { DailyMeal } from "@/features/meal-plan/types";

interface ExchangeCurrentMealCardProps {
  meal: DailyMeal;
}

export const ExchangeCurrentMealCard = ({ meal }: ExchangeCurrentMealCardProps) => {
  return (
    <Card className="border-2 border-blue-100 bg-blue-50">
      <CardContent className="p-4">
        <h3 className="font-semibold text-blue-700 mb-2 flex items-center gap-2">
          <Zap className="w-4 h-4" />
          Current Meal
        </h3>
        <p className="font-medium text-lg mb-3">{meal.name}</p>
        
        <div className="flex flex-wrap gap-2 mb-3">
          <Badge variant="outline" className="text-xs">
            <Clock className="w-3 h-3 mr-1" />
            {(meal.prep_time || 0) + (meal.cook_time || 0)} min
          </Badge>
          <Badge variant="outline" className="text-xs">
            <Users className="w-3 h-3 mr-1" />
            {meal.servings} serving{meal.servings !== 1 ? 's' : ''}
          </Badge>
          <Badge className="bg-green-100 text-green-700 text-xs">
            {meal.calories} cal
          </Badge>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <div className="bg-white p-2 rounded text-center">
            <span className="font-medium text-green-600 text-sm">{meal.protein}g</span>
            <div className="text-xs text-gray-600">protein</div>
          </div>
          <div className="bg-white p-2 rounded text-center">
            <span className="font-medium text-blue-600 text-sm">{meal.carbs}g</span>
            <div className="text-xs text-gray-600">carbs</div>
          </div>
          <div className="bg-white p-2 rounded text-center">
            <span className="font-medium text-yellow-600 text-sm">{meal.fat}g</span>
            <div className="text-xs text-gray-600">fat</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
