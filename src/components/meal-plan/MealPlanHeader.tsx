
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Shuffle, ShoppingCart, RefreshCw } from "lucide-react";
import { useMealPlanTranslations } from "@/utils/mealPlanTranslations";
import { useMealShuffle } from "@/hooks/useMealShuffle";

interface MealPlanHeaderProps {
  onGenerateAI: () => void;
  onShuffle: () => void;
  onShowShoppingList: () => void;
  onRegeneratePlan: () => void;
  isGenerating: boolean;
  hasWeeklyPlan: boolean;
}

const MealPlanHeader = ({
  onGenerateAI,
  onShuffle,
  onShowShoppingList,
  onRegeneratePlan,
  isGenerating,
  hasWeeklyPlan
}: MealPlanHeaderProps) => {
  const { 
    title, 
    smartMealPlanning, 
    personalizedNutrition, 
    generateAIMealPlan,
    generating,
    isRTL 
  } = useMealPlanTranslations();

  const { shuffleMeals, isShuffling } = useMealShuffle();

  const handleShuffleMeals = async () => {
    // This would need the weekly plan ID - you might need to pass this as a prop
    // For now, calling the existing shuffle function
    onShuffle();
  };

  return (
    <Card className="bg-gradient-to-r from-fitness-primary-600 via-fitness-primary-700 to-fitness-primary-800 text-white shadow-2xl border-0">
      <div className="p-6">
        <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className={isRTL ? 'text-right' : 'text-left'}>
            <h1 className="text-3xl font-bold mb-2 text-white">
              {title}
            </h1>
            <div className="space-y-1">
              <h2 className="text-xl font-semibold text-fitness-accent-100">
                {smartMealPlanning}
              </h2>
              <p className="text-fitness-primary-100 opacity-90">
                {personalizedNutrition}
              </p>
            </div>
          </div>

          <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
            {hasWeeklyPlan && (
              <>
                <Button
                  onClick={handleShuffleMeals}
                  disabled={isShuffling}
                  variant="outline"
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20 hover:text-white"
                >
                  {isShuffling ? (
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Shuffle className="w-4 h-4 mr-2" />
                  )}
                  Shuffle Meals
                </Button>

                <Button
                  onClick={onShowShoppingList}
                  variant="outline"
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20 hover:text-white"
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Shopping List
                </Button>
              </>
            )}

            <Button
              onClick={onGenerateAI}
              disabled={isGenerating}
              className="bg-gradient-to-r from-fitness-accent-500 to-fitness-accent-600 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  {generating}
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  {generateAIMealPlan}
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default MealPlanHeader;
