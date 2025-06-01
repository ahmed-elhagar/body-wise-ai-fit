
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Shuffle, ShoppingCart, RefreshCw, UtensilsCrossed, Zap } from "lucide-react";
import { useMealPlanTranslations } from "@/utils/mealPlanTranslations";

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

  const handleShuffleMeals = async () => {
    console.log('🔄 Shuffle button clicked');
    try {
      await onShuffle();
      console.log('✅ Shuffle completed successfully');
    } catch (error) {
      console.error('❌ Shuffle failed:', error);
    }
  };

  const handleGenerateAI = async () => {
    console.log('✨ Generate AI button clicked');
    try {
      await onGenerateAI();
      console.log('✅ AI generation completed successfully');
    } catch (error) {
      console.error('❌ AI generation failed:', error);
    }
  };

  return (
    <Card className="bg-gradient-to-r from-fitness-primary-600 via-fitness-primary-700 to-fitness-accent-600 border-0 shadow-xl rounded-2xl overflow-hidden">
      <div className="px-6 py-5">
        <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
          {/* Left: Enhanced Title Section */}
          <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/30">
              <UtensilsCrossed className="w-8 h-8 text-white" />
            </div>
            <div className={isRTL ? 'text-right' : 'text-left'}>
              <h1 className="text-3xl font-bold text-white mb-1 tracking-tight">
                {title || 'Smart Meal Plan'}
              </h1>
              <p className="text-fitness-primary-100 text-sm font-medium leading-relaxed">
                {personalizedNutrition || 'AI-powered personalized nutrition planning'}
              </p>
              
              {/* AI Credits Badge */}
              <div className="mt-2">
                <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm font-medium">
                  <Zap className="w-3 h-3 mr-1" />
                  Unlimited AI Credits
                </Badge>
              </div>
            </div>
          </div>

          {/* Right: Action Buttons */}
          <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
            {hasWeeklyPlan && (
              <div className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Button
                  onClick={handleShuffleMeals}
                  disabled={isGenerating}
                  variant="outline"
                  size="sm"
                  className="bg-white/10 border-white/30 text-white hover:bg-white/20 hover:text-white backdrop-blur-sm transition-all duration-200 hover:scale-105"
                >
                  {isGenerating ? (
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
                  className="bg-white/10 border-white/30 text-white hover:bg-white/20 hover:text-white backdrop-blur-sm transition-all duration-200 hover:scale-105"
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Shopping
                </Button>
              </div>
            )}

            <Button
              onClick={handleGenerateAI}
              disabled={isGenerating}
              className="bg-white text-fitness-primary-600 hover:bg-fitness-primary-50 font-semibold px-6 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
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
