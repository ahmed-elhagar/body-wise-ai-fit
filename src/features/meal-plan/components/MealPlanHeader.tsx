
import React from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles, Shuffle, ShoppingCart, RefreshCw } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface MealPlanHeaderProps {
  onGenerateAI: () => void;
  onShuffle: () => void;
  onShowShoppingList: () => void;
  onRegeneratePlan: () => void;
  isGenerating: boolean;
  isShuffling: boolean;
  hasWeeklyPlan: boolean;
}

const MealPlanHeader = ({
  onGenerateAI,
  onShuffle,
  onShowShoppingList,
  onRegeneratePlan,
  isGenerating,
  isShuffling,
  hasWeeklyPlan
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
      
      <div className="flex items-center gap-2 w-full sm:w-auto">
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
          disabled={isGenerating}
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
