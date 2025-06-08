
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Shuffle, UtensilsCrossed, ShoppingCart, Zap } from 'lucide-react';
import { useI18n } from '@/hooks/useI18n';
import { useCentralizedCredits } from '@/hooks/useCentralizedCredits';

interface MealPlanPageHeaderProps {
  onGenerateAI: () => void;
  onShuffle: () => void;
  onShowShoppingList: () => void;
  isGenerating: boolean;
  isShuffling: boolean;
  hasWeeklyPlan: boolean;
}

export const MealPlanPageHeader = ({
  onGenerateAI,
  onShuffle,
  onShowShoppingList,
  isGenerating,
  isShuffling,
  hasWeeklyPlan
}: MealPlanPageHeaderProps) => {
  const { t, isRTL } = useI18n();
  const { remaining: userCredits, isPro, hasCredits } = useCentralizedCredits();

  const displayCredits = isPro ? 'Unlimited' : `${userCredits} credits`;

  return (
    <Card className="mb-6 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 border-0 text-white overflow-hidden">
      <div className="p-6 relative">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16" />
        
        <div className={`flex flex-col lg:flex-row lg:items-center justify-between gap-4 ${isRTL ? 'lg:flex-row-reverse' : ''}`}>
          {/* Title Section */}
          <div className={`space-y-2 ${isRTL ? 'text-right' : 'text-left'}`}>
            <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <UtensilsCrossed className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white mb-1">
                  {t('mealPlan.smartMealPlanning') || 'Smart Meal Planning'}
                </h1>
                <div className="flex items-center gap-3">
                  <p className="text-blue-100 text-lg">
                    {t('mealPlan.personalizedNutrition') || 'Personalized nutrition plans powered by AI'}
                  </p>
                  <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm">
                    <Zap className="w-3 h-3 mr-1" />
                    {displayCredits}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className={`flex gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
            {hasWeeklyPlan && (
              <Button
                onClick={onShowShoppingList}
                variant="outline"
                size="icon"
                className="bg-white/10 border-white/30 text-white hover:bg-white/20 hover:text-white backdrop-blur-sm"
              >
                <ShoppingCart className="w-4 h-4" />
              </Button>
            )}
            
            {hasWeeklyPlan && (
              <Button
                onClick={onShuffle}
                disabled={isGenerating || isShuffling}
                variant="outline"
                size="icon"
                className="bg-white/10 border-white/30 text-white hover:bg-white/20 hover:text-white backdrop-blur-sm"
              >
                <Shuffle className="w-4 h-4" />
              </Button>
            )}
            
            <Button
              onClick={onGenerateAI}
              disabled={isGenerating || !hasCredits}
              className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white border-0 px-8 py-2 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Sparkles className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
              {isGenerating ? (t('generating') || 'Generating...') : (t('mealPlan.generateAI') || 'AI Generate')}
            </Button>
          </div>
        </div>
        
        {/* No credits warning */}
        {!hasCredits && (
          <div className="mt-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg backdrop-blur-sm">
            <p className="text-sm text-white font-medium text-center">
              No AI credits remaining. Upgrade your plan for unlimited access.
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};
