
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Users, ChefHat, ArrowRight } from "lucide-react";

interface ExchangeAlternativeCardProps {
  alternative: any;
  index: number;
  isExchanging: boolean;
  onSelect: (alternative: any) => void;
  onExpand: (alternative: any) => void;
}

export const ExchangeAlternativeCard = ({
  alternative,
  index,
  isExchanging,
  onSelect,
  onExpand
}: ExchangeAlternativeCardProps) => {
  return (
    <Card className="border border-gray-200 hover:border-green-300 transition-colors">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1">
            <h4 className="font-semibold text-gray-800 mb-1">{alternative.name}</h4>
            {alternative.cuisine_type && (
              <Badge variant="outline" className="text-xs mb-2">
                {alternative.cuisine_type}
              </Badge>
            )}
          </div>
          <Badge className="bg-green-100 text-green-700 text-xs ml-2">
            {alternative.calories} cal
          </Badge>
        </div>

        <div className="flex flex-wrap gap-2 mb-3">
          <Badge variant="outline" className="text-xs">
            <Clock className="w-3 h-3 mr-1" />
            {(alternative.prep_time || 0) + (alternative.cook_time || 0)} min
          </Badge>
          <Badge variant="outline" className="text-xs">
            <Users className="w-3 h-3 mr-1" />
            {alternative.servings} serving{alternative.servings !== 1 ? 's' : ''}
          </Badge>
          {alternative.difficulty && (
            <Badge variant="outline" className="text-xs">
              <ChefHat className="w-3 h-3 mr-1" />
              {alternative.difficulty}
            </Badge>
          )}
        </div>

        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="bg-gray-50 p-2 rounded text-center">
            <span className="font-medium text-green-600 text-sm">{alternative.protein}g</span>
            <div className="text-xs text-gray-600">protein</div>
          </div>
          <div className="bg-gray-50 p-2 rounded text-center">
            <span className="font-medium text-blue-600 text-sm">{alternative.carbs}g</span>
            <div className="text-xs text-gray-600">carbs</div>
          </div>
          <div className="bg-gray-50 p-2 rounded text-center">
            <span className="font-medium text-yellow-600 text-sm">{alternative.fat}g</span>
            <div className="text-xs text-gray-600">fat</div>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={() => onExpand(alternative)}
            variant="outline"
            size="sm"
            className="flex-1"
          >
            View Details
          </Button>
          <Button
            onClick={() => onSelect(alternative)}
            disabled={isExchanging}
            size="sm"
            className="flex-1 bg-green-500 hover:bg-green-600 text-white"
          >
            {isExchanging ? (
              'Exchanging...'
            ) : (
              <>
                <ArrowRight className="w-4 h-4 mr-1" />
                Exchange
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
