
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Flame, Zap, Beef, ShoppingCart, Plus } from "lucide-react";

interface DailyNutritionSummaryProps {
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  targetCalories?: number;
  onShowShoppingList?: () => void;
  onAddSnack?: () => void;
}

export const DailyNutritionSummary = ({
  totalCalories,
  totalProtein,
  totalCarbs,
  totalFat,
  targetCalories = 2000,
  onShowShoppingList,
  onAddSnack
}: DailyNutritionSummaryProps) => {
  const progressPercentage = (totalCalories / targetCalories) * 100;

  return (
    <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">Daily Nutrition</h3>
            <Badge variant={progressPercentage > 100 ? "destructive" : "default"}>
              {Math.round(progressPercentage)}%
            </Badge>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-orange-500" />
              <div>
                <p className="text-xs text-gray-600">Calories</p>
                <p className="font-semibold">{totalCalories}/{targetCalories}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Beef className="w-4 h-4 text-red-500" />
              <div>
                <p className="text-xs text-gray-600">Protein</p>
                <p className="font-semibold">{totalProtein}g</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-yellow-500" />
              <div>
                <p className="text-xs text-gray-600">Carbs</p>
                <p className="font-semibold">{totalCarbs}g</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-purple-500 rounded-full"></div>
              <div>
                <p className="text-xs text-gray-600">Fat</p>
                <p className="font-semibold">{totalFat}g</p>
              </div>
            </div>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full transition-all duration-300" 
              style={{ width: `${Math.min(progressPercentage, 100)}%` }}
            ></div>
          </div>

          {(onShowShoppingList || onAddSnack) && (
            <div className="flex gap-2 pt-2">
              {onShowShoppingList && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onShowShoppingList}
                  className="flex-1"
                >
                  <ShoppingCart className="w-4 h-4 mr-1" />
                  Shopping List
                </Button>
              )}
              {onAddSnack && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onAddSnack}
                  className="flex-1"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Snack
                </Button>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DailyNutritionSummary;
