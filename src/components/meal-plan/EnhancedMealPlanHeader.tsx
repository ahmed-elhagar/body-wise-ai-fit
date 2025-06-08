
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { UtensilsCrossed, Sparkles, Shuffle, ShoppingCart, MoreVertical, RefreshCcw, Zap } from "lucide-react";
import { useI18n } from "@/hooks/useI18n";
import { useCentralizedCredits } from "@/hooks/useCentralizedCredits";
import { Badge } from "@/components/ui/badge";

interface EnhancedMealPlanHeaderProps {
  onGenerateAI: () => void;
  onShuffle: () => void;
  onShowShoppingList: () => void;
  onRegeneratePlan: () => void;
  isGenerating: boolean;
  hasWeeklyPlan: boolean;
}

const EnhancedMealPlanHeader = ({
  onGenerateAI,
  onShuffle,
  onShowShoppingList,
  onRegeneratePlan,
  isGenerating,
  hasWeeklyPlan
}: EnhancedMealPlanHeaderProps) => {
  const { t } = useI18n();
  const { remaining: userCredits, isPro, hasCredits } = useCentralizedCredits();

  const displayCredits = isPro ? 'Unlimited' : `${userCredits} credits`;

  return (
    <Card className="bg-white border-fitness-primary-100 shadow-sm">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left: Title and Credits */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-fitness-primary-500 to-fitness-primary-600 rounded-xl flex items-center justify-center">
              <UtensilsCrossed className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-fitness-primary-800">
                Meal Plan
              </h1>
              <div className="flex items-center gap-3">
                <p className="text-sm text-fitness-primary-600">
                  Smart nutrition planning for your healthy lifestyle
                </p>
                <Badge className="bg-gradient-to-r from-fitness-primary-500 to-fitness-accent-500 text-white border-0">
                  <Zap className="w-3 h-3 mr-1" />
                  {displayCredits}
                </Badge>
              </div>
            </div>
          </div>

          {/* Right: Actions Dropdown */}
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
            <DropdownMenuContent align="end" className="w-56 bg-white border-fitness-primary-200 shadow-lg z-[110]">
              <DropdownMenuItem
                onClick={onGenerateAI}
                disabled={isGenerating || !hasCredits}
                className="flex items-center gap-2 text-fitness-primary-700 hover:bg-fitness-primary-50 cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                {t('mealPlan.generateAIMealPlan')}
              </DropdownMenuItem>
              {hasWeeklyPlan && (
                <DropdownMenuItem
                  onClick={onRegeneratePlan}
                  disabled={isGenerating || !hasCredits}
                  className="flex items-center gap-2 text-fitness-primary-700 hover:bg-fitness-primary-50 cursor-pointer"
                >
                  <RefreshCcw className="w-4 h-4" />
                  {t('mealPlan.regenerate')}
                </DropdownMenuItem>
              )}
              {hasWeeklyPlan && (
                <DropdownMenuItem
                  onClick={onShuffle}
                  disabled={isGenerating}
                  className="flex items-center gap-2 text-fitness-primary-700 hover:bg-fitness-primary-50 cursor-pointer"
                >
                  <Shuffle className="w-4 h-4" />
                  {t('mealPlan.shuffleMeals')}
                </DropdownMenuItem>
              )}
              <DropdownMenuItem
                onClick={onShowShoppingList}
                className="flex items-center gap-2 text-fitness-primary-700 hover:bg-fitness-primary-50 cursor-pointer"
              >
                <ShoppingCart className="w-4 h-4" />
                {t('mealPlan.shoppingList')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        {/* No credits warning */}
        {!hasCredits && (
          <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-sm text-amber-700">
              You've reached your AI generation limit. Upgrade your plan for unlimited access.
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};

export default EnhancedMealPlanHeader;
