
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { UtensilsCrossed, Sparkles, Shuffle, ShoppingCart, MoreVertical, RefreshCcw } from "lucide-react";
import { useMealPlanTranslations } from "@/hooks/useMealPlanTranslations";

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
  const { t, translations } = useMealPlanTranslations();

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
                {translations.title}
              </h1>
              <p className="text-sm text-fitness-primary-600">
                {translations.smartMealPlanning}
              </p>
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
                disabled={isGenerating}
                className="flex items-center gap-2 text-fitness-primary-700 hover:bg-fitness-primary-50 cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                {translations.generateAIMealPlan}
              </DropdownMenuItem>
              {hasWeeklyPlan && (
                <DropdownMenuItem
                  onClick={onRegeneratePlan}
                  disabled={isGenerating}
                  className="flex items-center gap-2 text-fitness-primary-700 hover:bg-fitness-primary-50 cursor-pointer"
                >
                  <RefreshCcw className="w-4 h-4" />
                  {t('regenerate', 'Regenerate')}
                </DropdownMenuItem>
              )}
              {hasWeeklyPlan && (
                <DropdownMenuItem
                  onClick={onShuffle}
                  disabled={isGenerating}
                  className="flex items-center gap-2 text-fitness-primary-700 hover:bg-fitness-primary-50 cursor-pointer"
                >
                  <Shuffle className="w-4 h-4" />
                  {t('shuffleMeals', 'Shuffle Meals')}
                </DropdownMenuItem>
              )}
              <DropdownMenuItem
                onClick={onShowShoppingList}
                className="flex items-center gap-2 text-fitness-primary-700 hover:bg-fitness-primary-50 cursor-pointer"
              >
                <ShoppingCart className="w-4 h-4" />
                {t('shoppingList', 'Shopping List')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </Card>
  );
};

export default EnhancedMealPlanHeader;
