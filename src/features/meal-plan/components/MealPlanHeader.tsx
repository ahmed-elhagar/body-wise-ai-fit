import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Shuffle, ShoppingCart, RefreshCw, UtensilsCrossed, Zap } from "lucide-react";
import { useI18n } from '@/hooks/useI18n';
import { useCentralizedCredits } from "@/hooks/useCentralizedCredits";

interface MealPlanHeaderProps {
  onGenerateAI: () => void;
  onShuffle: () => void;
  onShowShoppingList: () => void;
  onRegeneratePlan: () => void;
  isGenerating: boolean;
  isShuffling?: boolean;
  hasWeeklyPlan: boolean;
}

const MealPlanHeader = ({
  onGenerateAI,
  onShuffle,
  onShowShoppingList,
  onRegeneratePlan,
  isGenerating,
  isShuffling = false,
  hasWeeklyPlan
}: MealPlanHeaderProps) => {
  const { t, isRTL } = useI18n();

  const { remaining: userCredits, isPro, hasCredits } = useCentralizedCredits();

  const displayCredits = isPro ? 'Unlimited' : `${userCredits} credits`;

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

  const handleShowShoppingList = () => {
    console.log('🛒 Shopping list button clicked - using enhanced drawer');
    onShowShoppingList();
  };

  return (
    <Card className="bg-gradient-to-r from-fitness-primary-600 via-fitness-primary-700 to-fitness-accent-600 border-0 shadow-xl rounded-2xl overflow-hidden">
      <div className="px-5 py-3">
        <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
          {/* Left: Enhanced Title Section */}
          <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm border border-white/30">
              <UtensilsCrossed className="w-5 h-5 text-white" />
            </div>
            <div className={isRTL ? 'text-right' : 'text-left'}>
              <h1 className="text-xl font-bold text-white mb-0.5 tracking-tight">
                {t('mealPlan:title')}
              </h1>
              <p className="text-fitness-primary-100 text-sm font-medium">
                {t('mealPlan:personalizedNutrition')}
              </p>
              
              {/* AI Credits Badge - Using centralized credits */}
              <div className="mt-1">
                <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm font-medium text-xs hover:bg-white/30">
                  <Zap className="w-3 h-3 mr-1" />
                  {displayCredits}
                </Badge>
              </div>
            </div>
          </div>

          {/* Right: Compact Action Buttons */}
          <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            {hasWeeklyPlan && (
              <div className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Button
                  onClick={handleShuffleMeals}
                  disabled={isGenerating || isShuffling}
                  variant="outline"
                  size="sm"
                  className="bg-white/10 border-white/30 text-white hover:bg-white/20 hover:text-white backdrop-blur-sm transition-all duration-200 hover:scale-105 px-2 h-8"
                >
                  {isShuffling ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Shuffle className="w-4 h-4" />
                  )}
                  <span className="hidden sm:inline ml-2 text-xs">{t('mealPlan:shuffle')}</span>
                </Button>

                <Button
                  onClick={handleShowShoppingList}
                  variant="outline"
                  size="sm"
                  className="bg-white/10 border-white/30 text-white hover:bg-white/20 hover:text-white backdrop-blur-sm transition-all duration-200 hover:scale-105 px-2 h-8"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span className="hidden sm:inline ml-2 text-xs">{t('mealPlan:shop')}</span>
                </Button>
              </div>
            )}

            <Button
              onClick={handleGenerateAI}
              disabled={isGenerating || isShuffling || !hasCredits}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold px-3 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 h-8 border-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isGenerating ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4" />
              )}
              <span className="hidden sm:inline ml-2 text-xs font-medium">{t('mealPlan:aiPlan')}</span>
            </Button>
          </div>
        </div>
        
        {/* No credits warning */}
        {!hasCredits && (
          <div className="mt-3 px-4 py-2 bg-red-500/20 border border-red-500/30 rounded-lg backdrop-blur-sm">
            <p className="text-sm text-white font-medium text-center">
              No AI credits remaining. Upgrade to continue generating plans.
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};

export default MealPlanHeader;
