
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Sparkles, 
  Shuffle, 
  Plus, 
  ShoppingCart, 
  UtensilsCrossed,
  MoreVertical,
  Target,
  TrendingUp
} from "lucide-react";
import { useMealPlanTranslation } from "@/utils/translationHelpers";

interface EnhancedMealPlanHeaderProps {
  onGenerateAI: () => void;
  onShuffle: () => void;
  onAddSnack: () => void;
  onShowShoppingList: () => void;
  isGenerating: boolean;
  hasWeeklyPlan: boolean;
  totalCalories: number;
  totalProtein: number;
  targetDayCalories: number;
  mealsCount: number;
  selectedDayNumber: number;
}

const EnhancedMealPlanHeader = ({
  onGenerateAI,
  onShuffle,
  onAddSnack,
  onShowShoppingList,
  isGenerating,
  hasWeeklyPlan,
  totalCalories,
  totalProtein,
  targetDayCalories,
  mealsCount,
  selectedDayNumber
}: EnhancedMealPlanHeaderProps) => {
  const { mealPlanT } = useMealPlanTranslation();
  
  const calorieProgress = Math.min((totalCalories / targetDayCalories) * 100, 100);
  const proteinTarget = 150;
  const proteinProgress = Math.min((totalProtein / proteinTarget) * 100, 100);

  return (
    <Card className="bg-gradient-to-r from-fitness-primary-50 via-white to-fitness-accent-50 border-fitness-primary-200 shadow-lg">
      <div className="p-6">
        <div className="flex items-center justify-between">
          {/* Left: Title and Stats */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-fitness-primary-500 to-fitness-primary-600 rounded-xl flex items-center justify-center shadow-lg">
                <UtensilsCrossed className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-fitness-primary-700">
                  {mealPlanT('title')}
                </h1>
                <p className="text-fitness-primary-600 font-medium">
                  {mealPlanT('aiPoweredNutrition')}
                </p>
              </div>
            </div>

            {/* Daily Stats */}
            {hasWeeklyPlan && (
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-fitness-primary-500 to-fitness-primary-600 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-fitness-primary-600 font-medium">Day {selectedDayNumber}</p>
                    <p className="text-lg font-bold text-fitness-primary-700">{mealsCount} meals</p>
                  </div>
                </div>

                {/* Progress Indicators */}
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <div className="flex items-baseline gap-1 justify-center">
                      <span className="text-xl font-bold text-red-600">{totalCalories}</span>
                      <span className="text-sm text-gray-500">/{targetDayCalories}</span>
                    </div>
                    <div className="w-20 bg-gray-200 rounded-full h-2 mt-1">
                      <div 
                        className="bg-gradient-to-r from-red-400 to-red-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min(calorieProgress, 100)}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-500">{mealPlanT('calories')}</span>
                  </div>

                  <div className="text-center">
                    <div className="flex items-baseline gap-1 justify-center">
                      <span className="text-xl font-bold text-blue-600">{totalProtein.toFixed(0)}g</span>
                    </div>
                    <div className="w-20 bg-gray-200 rounded-full h-2 mt-1">
                      <div 
                        className="bg-gradient-to-r from-blue-400 to-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min(proteinProgress, 100)}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-500">{mealPlanT('protein')}</span>
                  </div>

                  <Badge 
                    className={`${
                      calorieProgress >= 80 
                        ? 'bg-green-100 text-green-700 border-green-200' 
                        : 'bg-orange-100 text-orange-700 border-orange-200'
                    } px-3 py-2`}
                  >
                    <Target className="w-4 h-4 mr-1" />
                    {Math.round(calorieProgress)}%
                  </Badge>
                </div>
              </div>
            )}
          </div>

          {/* Right: Actions Dropdown */}
          <div className="flex items-center gap-3">
            {/* Primary Generate Button */}
            <Button
              onClick={onGenerateAI}
              disabled={isGenerating}
              className="bg-gradient-to-r from-fitness-primary-500 to-fitness-primary-600 text-white hover:from-fitness-primary-600 hover:to-fitness-primary-700 shadow-lg px-6"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              {hasWeeklyPlan ? mealPlanT('regenerate') : mealPlanT('generateAIMealPlan')}
            </Button>

            {/* Actions Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-fitness-primary-300 bg-white text-fitness-primary-600 hover:bg-fitness-primary-50 shadow-md px-4"
                >
                  <MoreVertical className="w-5 h-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                align="end" 
                className="w-56 bg-white border-fitness-primary-200 shadow-xl"
                sideOffset={8}
              >
                {hasWeeklyPlan && (
                  <>
                    <DropdownMenuItem
                      onClick={onShuffle}
                      disabled={isGenerating}
                      className="cursor-pointer hover:bg-fitness-primary-50 focus:bg-fitness-primary-50"
                    >
                      <Shuffle className="w-4 h-4 mr-3 text-fitness-accent-600" />
                      <span className="font-medium">{mealPlanT('shuffleMeals')}</span>
                    </DropdownMenuItem>
                    
                    <DropdownMenuItem
                      onClick={onAddSnack}
                      className="cursor-pointer hover:bg-fitness-primary-50 focus:bg-fitness-primary-50"
                    >
                      <Plus className="w-4 h-4 mr-3 text-green-600" />
                      <span className="font-medium">{mealPlanT('addSnack')}</span>
                    </DropdownMenuItem>
                    
                    <DropdownMenuSeparator className="bg-fitness-primary-100" />
                    
                    <DropdownMenuItem
                      onClick={onShowShoppingList}
                      className="cursor-pointer hover:bg-fitness-primary-50 focus:bg-fitness-primary-50"
                    >
                      <ShoppingCart className="w-4 h-4 mr-3 text-fitness-primary-600" />
                      <span className="font-medium">{mealPlanT('shoppingList')}</span>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default EnhancedMealPlanHeader;
