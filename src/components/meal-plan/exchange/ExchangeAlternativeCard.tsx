
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Users } from "lucide-react";

interface MealAlternative {
  name: string;
  reason: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  ingredients: Array<{
    name: string;
    quantity: string;
    unit: string;
  }>;
  instructions: string[];
  prep_time: number;
  cook_time: number;
  servings: number;
}

interface ExchangeAlternativeCardProps {
  alternative: MealAlternative;
  index: number;
  isExchanging: boolean;
  onSelect: (alternative: MealAlternative) => void;
  onExpand: (alternative: MealAlternative) => void;
}

export const ExchangeAlternativeCard = ({
  alternative,
  index,
  isExchanging,
  onSelect,
  onExpand
}: ExchangeAlternativeCardProps) => {
  return (
    <Card 
      key={index} 
      className="cursor-pointer hover:bg-gray-50 transition-colors" 
      onClick={() => onExpand(alternative)}
    >
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h4 className="font-medium text-gray-900 mb-1">{alternative.name}</h4>
            <p className="text-sm text-blue-600 mb-3 italic">{alternative.reason}</p>
            
            {/* Nutrition badges */}
            <div className="flex flex-wrap gap-2 mb-3">
              <Badge variant="secondary" className="text-xs">
                {alternative.calories} cal
              </Badge>
              <Badge variant="outline" className="text-xs">
                {alternative.protein}g protein
              </Badge>
              <Badge variant="outline" className="text-xs">
                {alternative.carbs}g carbs
              </Badge>
              <Badge variant="outline" className="text-xs">
                {alternative.fat}g fat
              </Badge>
            </div>

            {/* Time and servings info */}
            <div className="flex gap-4 text-sm text-gray-600 mb-3">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {alternative.prep_time + alternative.cook_time} min
              </span>
              <span className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                {alternative.servings} serving{alternative.servings !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
          
          <Button
            onClick={(e) => {
              e.stopPropagation();
              onSelect(alternative);
            }}
            disabled={isExchanging}
            size="sm"
            className="ml-4"
          >
            {isExchanging ? 'Exchanging...' : 'Select'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
