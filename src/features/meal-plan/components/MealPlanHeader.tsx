
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Sparkles, Shuffle, ShoppingCart, RefreshCw, Coins, Zap } from 'lucide-react';
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
    <Card className="border-0 shadow-lg bg-gradient-to-br from-violet-50 via-purple-50 to-indigo-100 overflow-hidden">
      <CardContent className="p-4 sm:p-6">
        <div className="flex flex-col space-y-4">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-violet-500 to-purple-600 flex items-center justify-center shadow-lg">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                    {language === 'ar' ? 'خطة الوجبات الذكية' : 'Smart Meal Plan'}
                  </h1>
                  <p className="text-sm text-gray-600">
                    {language === 'ar' 
                      ? 'خطط وجباتك بالذكاء الاصطناعي' 
                      : 'AI-powered meal planning'
                    }
                  </p>
                </div>
              </div>
            </div>
            
            {/* Credits Display */}
            <div className="flex items-center gap-2 bg-white/70 backdrop-blur-sm px-3 py-2 rounded-lg border border-violet-200 shadow-sm">
              <Coins className="w-4 h-4 text-amber-500" />
              <span className="text-sm font-medium text-gray-700">
                {language === 'ar' ? 'الأرصدة' : 'Credits'}: 
              </span>
              <Badge 
                variant="secondary" 
                className="bg-amber-100 text-amber-800 border-amber-200 font-semibold"
              >
                {remainingCredits === -1 ? '∞' : remainingCredits}
              </Badge>
            </div>
          </div>

          {/* Action Buttons Section */}
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Main AI Action Button */}
            <div className="flex-1">
              {hasWeeklyPlan ? (
                <Button
                  onClick={onRegeneratePlan}
                  disabled={isGenerating || remainingCredits === 0}
                  className="w-full bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 h-12"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      <span>{language === 'ar' ? 'جاري التوليد...' : 'Regenerating...'}</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 mr-2" />
                      <span className="font-medium">
                        {language === 'ar' ? 'إعادة توليد خطة جديدة' : 'Regenerate New Plan'}
                      </span>
                    </>
                  )}
                </Button>
              ) : (
                <Button
                  onClick={onGenerateAI}
                  disabled={isGenerating || remainingCredits === 0}
                  className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 h-12"
                >
                  {isGenerating ? (
                    <>
                      <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                      <span>{language === 'ar' ? 'جاري التوليد...' : 'Generating...'}</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      <span className="font-medium">
                        {language === 'ar' ? 'توليد خطة ذكية' : 'Generate AI Plan'}
                      </span>
                    </>
                  )}
                </Button>
              )}
            </div>

            {/* Secondary Action Buttons */}
            {hasWeeklyPlan && (
              <div className="flex gap-2 sm:gap-3">
                <Button
                  onClick={onShuffle}
                  disabled={isShuffling}
                  variant="outline"
                  size="sm"
                  className="flex-1 sm:flex-initial bg-white/80 hover:bg-white border-violet-200 hover:border-violet-300 text-violet-700 hover:text-violet-800 shadow-sm h-12 px-4"
                >
                  <Shuffle className="w-4 h-4 sm:mr-2" />
                  <span className="hidden sm:inline">
                    {language === 'ar' ? 'خلط' : 'Shuffle'}
                  </span>
                </Button>
                
                <Button
                  onClick={onShowShoppingList}
                  variant="outline"
                  size="sm"
                  className="flex-1 sm:flex-initial bg-white/80 hover:bg-white border-violet-200 hover:border-violet-300 text-violet-700 hover:text-violet-800 shadow-sm h-12 px-4"
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
