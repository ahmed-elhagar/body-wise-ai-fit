
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-gradient-to-r from-violet-50 via-purple-50 to-indigo-50 p-6 rounded-xl border border-violet-100 shadow-sm">
      <div className="flex-1">
        <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
          {language === 'ar' ? 'خطة الوجبات' : 'Meal Plan'}
        </h1>
        <p className="text-gray-600 mt-1 text-sm sm:text-base">
          {language === 'ar' 
            ? 'خطط وجباتك الأسبوعية بذكاء' 
            : 'Plan your weekly meals intelligently'
          }
        </p>
      </div>
      
      <div className="flex items-center gap-3 w-full sm:w-auto">
        {/* Credits Display */}
        <div className="flex items-center gap-2 text-sm bg-white/80 px-3 py-2 rounded-lg border border-violet-200 shadow-sm">
          <Coins className="w-4 h-4 text-yellow-500" />
          <span className="font-medium text-violet-700">
            {language === 'ar' ? 'الأرصدة' : 'Credits'}: 
          </span>
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-yellow-200">
            {remainingCredits === -1 ? '∞' : remainingCredits}
          </Badge>
        </div>

        {hasWeeklyPlan && (
          <>
            <Button
              onClick={onShuffle}
              disabled={isShuffling}
              variant="outline"
              size="sm"
              className="flex items-center gap-2 bg-white/80 hover:bg-white border-violet-200 hover:border-violet-300 text-violet-700 hover:text-violet-800"
            >
              <Shuffle className="w-4 h-4" />
              <span className="hidden sm:inline">
                {language === 'ar' ? 'خلط' : 'Shuffle'}
              </span>
            </Button>
            
            <Button
              onClick={onShowShoppingList}
              variant="outline"
              size="sm"
              className="flex items-center gap-2 bg-white/80 hover:bg-white border-violet-200 hover:border-violet-300 text-violet-700 hover:text-violet-800"
            >
              <ShoppingCart className="w-4 h-4" />
              <span className="hidden sm:inline">
                {language === 'ar' ? 'قائمة التسوق' : 'Shopping'}
              </span>
            </Button>
          </>
        )}
        
        <Button
          onClick={hasWeeklyPlan ? onRegeneratePlan : onGenerateAI}
          disabled={isGenerating || remainingCredits === 0}
          className="flex items-center gap-2 bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 flex-1 sm:flex-initial"
        >
          {hasWeeklyPlan ? (
            <>
              <RefreshCw className="w-4 h-4" />
              <span className="whitespace-nowrap">
                {language === 'ar' ? 'إعادة توليد' : 'Regenerate'}
              </span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span className="whitespace-nowrap">
                {language === 'ar' ? 'توليد خطة ذكية' : 'Generate AI Plan'}
              </span>
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default MealPlanHeader;
