
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, ShoppingCart, TrendingUp, Target, Zap } from "lucide-react";
import { useMealPlanTranslation } from "@/utils/translationHelpers";

interface EnhancedActionBarProps {
  onAddSnack: () => void;
  onShowShoppingList: () => void;
  totalCalories: number;
  totalProtein: number;
  targetDayCalories: number;
  mealsCount: number;
  selectedDayNumber: number;
}

const EnhancedActionBar = ({
  onAddSnack,
  onShowShoppingList,
  totalCalories,
  totalProtein,
  targetDayCalories,
  mealsCount,
  selectedDayNumber
}: EnhancedActionBarProps) => {
  const { mealPlanT } = useMealPlanTranslation();
  
  const calorieProgress = Math.min((totalCalories / targetDayCalories) * 100, 100);
  const proteinTarget = 150; // Could be dynamic based on user profile
  const proteinProgress = Math.min((totalProtein / proteinTarget) * 100, 100);

  return (
    <Card className="bg-gradient-to-r from-white via-fitness-primary-25 to-fitness-accent-25 border-fitness-primary-200 shadow-lg">
      <div className="p-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Daily Stats Overview */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-fitness-primary-500 to-fitness-primary-600 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-xs text-fitness-primary-600 font-medium">Day {selectedDayNumber} Overview</p>
                <p className="text-sm font-bold text-fitness-primary-700">{mealsCount} meals planned</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Calories Progress */}
              <div className="flex items-center gap-2">
                <div className="text-center">
                  <div className="flex items-baseline gap-1">
                    <span className="text-lg font-bold text-red-600">{totalCalories}</span>
                    <span className="text-xs text-gray-500">/ {targetDayCalories}</span>
                  </div>
                  <div className="w-16 bg-gray-200 rounded-full h-1.5 mt-1">
                    <div 
                      className="bg-gradient-to-r from-red-400 to-red-600 h-1.5 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(calorieProgress, 100)}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-500">calories</span>
                </div>
              </div>

              {/* Protein Progress */}
              <div className="flex items-center gap-2">
                <div className="text-center">
                  <div className="flex items-baseline gap-1">
                    <span className="text-lg font-bold text-blue-600">{totalProtein.toFixed(0)}g</span>
                  </div>
                  <div className="w-16 bg-gray-200 rounded-full h-1.5 mt-1">
                    <div 
                      className="bg-gradient-to-r from-blue-400 to-blue-600 h-1.5 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(proteinProgress, 100)}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-500">protein</span>
                </div>
              </div>

              {/* Completion Badge */}
              <Badge 
                className={`${
                  calorieProgress >= 80 
                    ? 'bg-green-100 text-green-700 border-green-200' 
                    : 'bg-orange-100 text-orange-700 border-orange-200'
                }`}
              >
                <Target className="w-3 h-3 mr-1" />
                {Math.round(calorieProgress)}% Complete
              </Badge>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <Button
              onClick={onAddSnack}
              size="sm"
              className="bg-gradient-to-r from-fitness-accent-500 to-fitness-accent-600 text-white hover:from-fitness-accent-600 hover:to-fitness-accent-700 shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              <Plus className="w-4 h-4 mr-1.5" />
              {mealPlanT('addSnack')}
            </Button>
            
            <Button
              onClick={onShowShoppingList}
              size="sm"
              variant="outline"
              className="border-fitness-primary-300 bg-white text-fitness-primary-600 hover:bg-fitness-primary-50 hover:text-fitness-primary-700 shadow-md"
            >
              <ShoppingCart className="w-4 h-4 mr-1.5" />
              {mealPlanT('shoppingList')}
            </Button>

            <div className="flex items-center gap-1 px-3 py-1.5 bg-fitness-primary-100 rounded-lg">
              <Zap className="w-3 h-3 text-fitness-primary-600" />
              <span className="text-xs font-medium text-fitness-primary-700">AI Powered</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default EnhancedActionBar;
