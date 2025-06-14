
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
    <Card className="border shadow-sm">
      <CardContent className="p-4">
        <div className="flex flex-col space-y-4">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                {language === 'ar' ? 'خطة الوجبات' : 'Meal Plan'}
              </h1>
              <p className="text-sm text-gray-600">
                {language === 'ar' 
                  ? 'خطط وجباتك بالذكاء الاصطناعي' 
                  : 'AI-powered meal planning'
                }
              </p>
            </div>
            
            {/* Credits Display */}
            <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg">
              <Coins className="w-4 h-4 text-amber-500" />
              <span className="text-sm font-medium text-gray-700">
                {language === 'ar' ? 'الأرصدة' : 'Credits'}: 
              </span>
              <Badge variant="secondary" className="bg-amber-100 text-amber-800">
                {remainingCredits === -1 ? '∞' : remainingCredits}
              </Badge>
            </div>
          </div>

          {/* Action Buttons Section */}
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Main Action Button */}
            <div className="flex-1">
              {hasWeeklyPlan ? (
                <Button
                  onClick={onRegeneratePlan}
                  disabled={isGenerating || remainingCredits === 0}
                  className="w-full"
                  variant="default"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      {language === 'ar' ? 'جاري التوليد...' : 'Regenerating...'}
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2" />
                      {language === 'ar' ? 'إعادة توليد خطة جديدة' : 'Regenerate New Plan'}
                    </>
                  )}
                </Button>
              ) : (
                <Button
                  onClick={onGenerateAI}
                  disabled={isGenerating || remainingCredits === 0}
                  className="w-full"
                  variant="default"
                >
                  {isGenerating ? (
                    <>
                      <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                      {language === 'ar' ? 'جاري التوليد...' : 'Generating...'}
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      {language === 'ar' ? 'توليد خطة ذكية' : 'Generate AI Plan'}
                    </>
                  )}
                </Button>
              )}
            </div>

            {/* Secondary Action Buttons - Only show when there's a plan */}
            {hasWeeklyPlan && (
              <div className="flex gap-2">
                <Button
                  onClick={onShuffle}
                  disabled={isShuffling}
                  variant="outline"
                  size="default"
                  className="flex-1 sm:flex-initial"
                >
                  <Shuffle className="w-4 h-4 sm:mr-2" />
                  <span className="hidden sm:inline">
                    {language === 'ar' ? 'خلط' : 'Shuffle'}
                  </span>
                </Button>
                
                <Button
                  onClick={onShowShoppingList}
                  variant="outline"
                  size="default"
                  className="flex-1 sm:flex-initial"
                >
                  <ShoppingCart className="w-4 h-4 sm:mr-2" />
                  <span className="hidden sm:inline">
                    {language === 'ar' ? 'التسوق' : 'Shopping'}
                  </span>
                </Button>
              </div>
            )}
          </div>

          {/* Status Indicator */}
          {remainingCredits === 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
              <p className="text-sm text-amber-800 text-center">
                {language === 'ar' 
                  ? 'لا توجد أرصدة متاحة. يرجى ترقية خطتك أو انتظار إعادة تعيين الأرصدة.'
                  : 'No credits available. Please upgrade your plan or wait for credits to reset.'
                }
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MealPlanHeader;
