
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { UtensilsCrossed, Sparkles, Shuffle, ShoppingCart, MoreVertical } from "lucide-react";
import { useMealPlanTranslation } from "@/utils/translationHelpers";

interface EnhancedMealPlanHeaderProps {
  onGenerateAI: () => void;
  onShuffle: () => void;
  onShowShoppingList: () => void;
  isGenerating: boolean;
  hasWeeklyPlan: boolean;
}

const EnhancedMealPlanHeader = ({
  onGenerateAI,
  onShuffle,
  onShowShoppingList,
  isGenerating,
  hasWeeklyPlan
}: EnhancedMealPlanHeaderProps) => {
  const { mealPlanT } = useMealPlanTranslation();

  return (
    <Card className="bg-white border-fitness-primary-100 shadow-sm">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left: Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-fitness-primary-500 to-fitness-primary-600 rounded-xl flex items-center justify-center">
              <UtensilsCrossed className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-fitness-primary-800">
                {mealPlanT('title')}
              </h1>
              <p className="text-sm text-fitness-primary-600">
                Smart nutrition planning for your healthy lifestyle
              </p>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-3">
            {/* Primary Generate AI Button */}
            <Button
              onClick={onGenerateAI}
              disabled={isGenerating}
              size="sm"
              className="bg-gradient-to-r from-fitness-primary-500 to-fitness-primary-600 hover:from-fitness-primary-600 hover:to-fitness-primary-700 text-white shadow-lg"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              {hasWeeklyPlan ? mealPlanT('regenerate') : mealPlanT('generateAIMealPlan')}
            </Button>

            {/* Actions Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="icon-sm"
                  className="border-fitness-primary-300 text-fitness-primary-600 hover:bg-fitness-primary-50"
                >
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 bg-white border-fitness-primary-200 shadow-lg z-50">
                <DropdownMenuItem
                  onClick={onShowShoppingList}
                  className="flex items-center gap-2 text-fitness-primary-700 hover:bg-fitness-primary-50"
                >
                  <ShoppingCart className="w-4 h-4" />
                  {mealPlanT('shoppingList')}
                </DropdownMenuItem>
                {hasWeeklyPlan && (
                  <DropdownMenuItem
                    onClick={onShuffle}
                    disabled={isGenerating}
                    className="flex items-center gap-2 text-fitness-primary-700 hover:bg-fitness-primary-50"
                  >
                    <Shuffle className="w-4 h-4" />
                    {mealPlanT('shuffleMeals')}
                  </DropdownMenuItem>
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
