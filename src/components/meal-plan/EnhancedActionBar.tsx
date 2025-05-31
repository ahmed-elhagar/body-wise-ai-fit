
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, ShoppingCart, TrendingUp, Target } from "lucide-react";
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
  const proteinTarget = 150;
  const proteinProgress = Math.min((totalProtein / proteinTarget) * 100, 100);

  return (
    <Card className="bg-gradient-to-r from-white via-fitness-primary-25 to-fitness-accent-25 border-fitness-primary-200 shadow-lg">
      <div className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          {/* Daily Stats Overview */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-fitness-primary-500 to-fitness-primary-600 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-fitness-primary-600 font-medium">Day {selectedDayNumber} Overview</p>
                <p className="text-lg font-bold text-fitness-primary-700">{mealsCount} meals planned</p>
              </div>
            </div>

            <div className="flex items-center gap-6">
              {/* Calories Progress */}
              <div className="text-center">
                <div className="flex items-baseline gap-1 justify-center">
                  <span className="text-xl font-bold text-red-600">{totalCalories}</span>
                  <span className="text-sm text-gray-500">/ {targetDayCalories}</span>
                </div>
                <div className="w-20 bg-gray-200 rounded-full h-2 mt-2">
                  <div 
                    className="bg-gradient-to-r from-red-400 to-red-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(calorieProgress, 100)}%` }}
                  />
                </div>
                <span className="text-xs text-gray-500 mt-1 block">{mealPlanT('calories')}</span>
              </div>

              {/* Protein Progress */}
              <div className="text-center">
                <div className="flex items-baseline gap-1 justify-center">
                  <span className="text-xl font-bold text-blue-600">{totalProtein.toFixed(0)}g</span>
                </div>
                <div className="w-20 bg-gray-200 rounded-full h-2 mt-2">
                  <div 
                    className="bg-gradient-to-r from-blue-400 to-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(proteinProgress, 100)}%` }}
                  />
                </div>
                <span className="text-xs text-gray-500 mt-1 block">{mealPlanT('protein')}</span>
              </div>

              {/* Completion Badge */}
              <Badge 
                className={`${
                  calorieProgress >= 80 
                    ? 'bg-green-100 text-green-700 border-green-200' 
                    : 'bg-orange-100 text-orange-700 border-orange-200'
                } px-3 py-2`}
              >
                <Target className="w-4 h-4 mr-1" />
                {Math.round(calorieProgress)}% {mealPlanT('complete')}
              </Badge>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <Button
              onClick={onAddSnack}
              size="lg"
              className="bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 shadow-lg transform hover:scale-105 transition-all duration-200 px-6"
            >
              <Plus className="w-5 h-5 mr-2" />
              {mealPlanT('addSnack')}
            </Button>
            
            <Button
              onClick={onShowShoppingList}
              size="lg"
              variant="outline"
              className="border-fitness-primary-300 bg-white text-fitness-primary-600 hover:bg-fitness-primary-50 hover:text-fitness-primary-700 shadow-md px-6"
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              {mealPlanT('shoppingList')}
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default EnhancedActionBar;
