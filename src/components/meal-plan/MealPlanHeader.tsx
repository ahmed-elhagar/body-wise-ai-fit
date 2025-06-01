
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Shuffle, ShoppingCart, RefreshCw, UtensilsCrossed } from "lucide-react";
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
    onShuffle();
  };

  return (
    <Card className="bg-white border-fitness-primary-200 shadow-lg rounded-2xl overflow-hidden">
      <div className="bg-gradient-to-r from-fitness-primary-600 via-fitness-primary-700 to-fitness-accent-600 px-6 py-4">
        <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
          {/* Left: Enhanced Title Section */}
          <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <UtensilsCrossed className="w-7 h-7 text-white" />
            </div>
            <div className={isRTL ? 'text-right' : 'text-left'}>
              <h1 className="text-2xl font-bold text-white mb-1">
                {title || 'Meal Plan'}
              </h1>
              <p className="text-fitness-primary-100 text-sm font-medium">
                {personalizedNutrition || 'Personalized nutrition planning'}
              </p>
            </div>
          </div>

          {/* Right: Action Buttons */}
          <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
            {hasWeeklyPlan && (
              <div className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Button
                  onClick={handleShuffleMeals}
                  disabled={isShuffling || isGenerating}
                  variant="outline"
                  size="sm"
                  className="bg-white/10 border-white/30 text-white hover:bg-white/20 hover:text-white backdrop-blur-sm"
                >
                  {isShuffling ? (
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Shuffle className="w-4 h-4 mr-2" />
                  )}
                  Shuffle
                </Button>

                <Button
                  onClick={onShowShoppingList}
                  variant="outline"
                  size="sm"
                  className="bg-white/10 border-white/30 text-white hover:bg-white/20 hover:text-white backdrop-blur-sm"
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Shopping
                </Button>
              </div>
            )}

            <Button
              onClick={onGenerateAI}
              disabled={isGenerating}
              className="bg-white text-fitness-primary-600 hover:bg-fitness-primary-50 font-semibold px-6 py-2 rounded-lg shadow-lg hover:shadow-xl transition-all"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  {generating || 'Generating...'}
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  {generateAIMealPlan || 'Generate AI Plan'}
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
