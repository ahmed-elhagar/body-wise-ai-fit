
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Users } from "lucide-react";

interface CompactMealCardProps {
  meal: {
    name: string;
    calories: number;
    protein: number;
    prep_time?: number;
    servings?: number;
    meal_type: string;
  };
  onClick?: () => void;
}

export const CompactMealCard = ({ meal, onClick }: CompactMealCardProps) => {
  return (
    <Card 
      className="cursor-pointer hover:shadow-md transition-shadow bg-white border border-gray-200"
      onClick={onClick}
    >
      <CardContent className="p-3">
        <div className="flex justify-between items-start mb-2">
          <h4 className="font-medium text-sm text-gray-900 line-clamp-2">{meal.name}</h4>
          <Badge variant="outline" className="ml-2 text-xs">
            {meal.calories} cal
          </Badge>
        </div>
        
        <div className="flex items-center gap-3 text-xs text-gray-500">
          <span>{meal.protein}g protein</span>
          {meal.prep_time && (
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {meal.prep_time}min
            </div>
          )}
          {meal.servings && (
            <div className="flex items-center gap-1">
              <Users className="w-3 h-3" />
              {meal.servings}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CompactMealCard;
