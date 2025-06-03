
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { UtensilsCrossed, Sparkles, Shuffle, ShoppingCart, Zap, RefreshCw } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface EnhancedMealPlanHeaderProps {
  onGenerateAI: () => void;
  onShuffle: () => void;
  onShowShoppingList: () => void;
  isGenerating: boolean;
  hasWeeklyPlan: boolean;
}

export const EnhancedMealPlanHeader = ({
  onGenerateAI,
  onShuffle,
  onShowShoppingList,
  isGenerating,
  hasWeeklyPlan
}: EnhancedMealPlanHeaderProps) => {
  const { t, isRTL } = useLanguage();

  return (
    <Card className="relative overflow-hidden bg-gradient-to-r from-fitness-primary-600 via-fitness-primary-700 to-fitness-accent-600 border-0 shadow-xl rounded-2xl">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12" />
      
      <div className="relative z-10 p-6">
        <div className={`flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 ${isRTL ? 'lg:flex-row-reverse' : ''}`}>
          {/* Title Section */}
          <div className={`space-y-3 ${isRTL ? 'text-right' : 'text-left'}`}>
            <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/30 shadow-lg">
                <UtensilsCrossed className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">
                  {t('mealPlan.smartMealPlanning') || 'Smart Meal Planning'}
                </h1>
                <p className="text-fitness-primary-100 text-lg font-medium mb-3">
                  {t('mealPlan.personalizedNutrition') || 'AI-powered personalized nutrition plans'}
                </p>
                
                {/* AI Credits Badge */}
                <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm px-4 py-2 font-semibold shadow-md hover:bg-white/30 transition-all duration-200">
                  <Zap className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                  {t('mealPlan.unlimitedAI') || 'Unlimited AI Generation'}
                </Badge>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
            {hasWeeklyPlan && (
              <>
                <Button
                  onClick={onShuffle}
                  disabled={isGenerating}
                  variant="outline"
                  size="lg"
                  className="bg-white/10 border-white/30 text-white hover:bg-white/20 hover:text-white backdrop-blur-sm transition-all duration-300 hover:scale-105 px-6 py-3 font-semibold shadow-lg"
                >
                  {isGenerating ? (
                    <RefreshCw className={`w-5 h-5 ${isRTL ? 'ml-3' : 'mr-3'} animate-spin`} />
                  ) : (
                    <Shuffle className={`w-5 h-5 ${isRTL ? 'ml-3' : 'mr-3'}`} />
                  )}
                  {t('mealPlan.shuffleMeals') || 'Shuffle'}
                </Button>

                <Button
                  onClick={onShowShoppingList}
                  variant="outline"
                  size="lg"
                  className="bg-white/10 border-white/30 text-white hover:bg-white/20 hover:text-white backdrop-blur-sm transition-all duration-300 hover:scale-105 px-6 py-3 font-semibold shadow-lg"
                >
                  <ShoppingCart className={`w-5 h-5 ${isRTL ? 'ml-3' : 'mr-3'}`} />
                  {t('mealPlan.shoppingList') || 'Shopping'}
                </Button>
              </>
            )}

            <Button
              onClick={onGenerateAI}
              disabled={isGenerating}
              size="lg"
              className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white border-0 shadow-lg px-8 py-3 rounded-xl font-bold text-lg transition-all duration-300 hover:shadow-xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isGenerating ? (
                <RefreshCw className={`w-6 h-6 ${isRTL ? 'ml-3' : 'mr-3'} animate-spin`} />
              ) : (
                <Sparkles className={`w-6 h-6 ${isRTL ? 'ml-3' : 'mr-3'}`} />
              )}
              {isGenerating ? 
                (t('mealPlan.generating') || 'Generating...') : 
                (t('mealPlan.generateAIPlan') || 'AI Plan')
              }
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};
