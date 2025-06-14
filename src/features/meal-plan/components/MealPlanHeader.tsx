
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Sparkles, Shuffle, ShoppingCart, RefreshCw, Coins } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface MealPlanHeaderProps {
  onGenerateAI: () => void;
  onShuffle: () => void;
  onShowShoppingList: () => void;
  onRegeneratePlan: () => void;
  isGenerating: boolean;
  isShuffling: boolean;
  hasWeeklyPlan: boolean;
  remainingCredits?: number;
}

const MealPlanHeader = ({
  onGenerateAI,
  onShuffle,
  onShowShoppingList,
  onRegeneratePlan,
  isGenerating,
  isShuffling,
  hasWeeklyPlan,
  remainingCredits = 0
}: MealPlanHeaderProps) => {
  const { language } = useLanguage();

  return (
    <Card className="border-0 shadow-lg bg-gradient-to-r from-white to-blue-50/30">
      <CardContent className="p-6">
        <div className="flex flex-col space-y-6">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {language === 'ar' ? 'خطة الوجبات' : 'Meal Plan'}
              </h1>
              <p className="text-gray-600 text-sm">
                {language === 'ar' 
                  ? 'خطط وجباتك بالذكاء الاصطناعي' 
                  : 'AI-powered personalized meal planning'
                }
              </p>
            </div>
            
            {/* Credits Display */}
            <div className="flex items-center gap-2 bg-white/70 backdrop-blur-sm px-4 py-2 rounded-full border border-gray-200 shadow-sm">
              <Coins className="w-4 h-4 text-amber-500" />
              <span className="text-sm font-medium text-gray-700">
                {language === 'ar' ? 'الأرصدة' : 'Credits'}: 
              </span>
              <Badge variant="secondary" className="bg-amber-100 text-amber-800 font-semibold">
                {remainingCredits === -1 ? '∞' : remainingCredits}
              </Badge>
            </div>
          </div>

          {/* Action Buttons Section */}
          <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
            {/* Main AI Plan Button */}
            <div className="flex-1">
              <Button
                onClick={hasWeeklyPlan ? onRegeneratePlan : onGenerateAI}
                disabled={isGenerating || remainingCredits === 0}
                className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl font-semibold text-base"
                size="lg"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                    {language === 'ar' ? 'جاري التوليد...' : 'Generating...'}
                  </>
                ) : hasWeeklyPlan ? (
                  <>
                    <RefreshCw className="w-5 h-5 mr-2" />
                    {language === 'ar' ? 'إعادة توليد خطة' : 'Regenerate Plan'}
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-2" />
                    {language === 'ar' ? 'خطة ذكية' : 'AI Plan'}
                  </>
                )}
              </Button>
            </div>

            {/* Secondary Action Buttons - Only show when there's a plan */}
            {hasWeeklyPlan && (
              <div className="flex gap-3">
                <Button
                  onClick={onShuffle}
                  disabled={isShuffling}
                  variant="outline"
                  size="lg"
                  className="h-12 w-12 p-0 rounded-xl border-2 hover:bg-blue-50 hover:border-blue-300 transition-colors"
                  title={language === 'ar' ? 'خلط الوجبات' : 'Shuffle Meals'}
                >
                  <Shuffle className="w-5 h-5 text-blue-600" />
                </Button>
                
                <Button
                  onClick={onShowShoppingList}
                  variant="outline"
                  size="lg"
                  className="h-12 w-12 p-0 rounded-xl border-2 hover:bg-green-50 hover:border-green-300 transition-colors"
                  title={language === 'ar' ? 'قائمة التسوق' : 'Shopping List'}
                >
                  <ShoppingCart className="w-5 h-5 text-green-600" />
                </Button>
              </div>
            )}
          </div>

          {/* Status Indicator */}
          {remainingCredits === 0 && (
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
                  <Coins className="w-4 h-4 text-amber-600" />
                </div>
                <div>
                  <p className="text-amber-800 font-medium text-sm">
                    {language === 'ar' 
                      ? 'لا توجد أرصدة متاحة'
                      : 'No credits available'
                    }
                  </p>
                  <p className="text-amber-700 text-xs">
                    {language === 'ar' 
                      ? 'يرجى ترقية خطتك أو انتظار إعادة تعيين الأرصدة'
                      : 'Please upgrade your plan or wait for credits to reset'
                    }
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MealPlanHeader;
