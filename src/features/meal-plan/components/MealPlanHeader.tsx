
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
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          {language === 'ar' ? 'خطة الوجبات' : 'Meal Plan'}
        </h1>
        <p className="text-gray-600 mt-1">
          {language === 'ar' 
            ? 'خطط وجباتك الأسبوعية بذكاء' 
            : 'Plan your weekly meals intelligently'
          }
        </p>
      </div>
      
      <div className="flex items-center gap-2">
        {hasWeeklyPlan && (
          <>
            <Button
              onClick={onShuffle}
              disabled={isShuffling}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <Shuffle className="w-4 h-4" />
              {language === 'ar' ? 'خلط' : 'Shuffle'}
            </Button>
            
            <Button
              onClick={onShowShoppingList}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <ShoppingCart className="w-4 h-4" />
              {language === 'ar' ? 'قائمة التسوق' : 'Shopping List'}
            </Button>
          </>
        )}
        
        <Button
          onClick={hasWeeklyPlan ? onRegeneratePlan : onGenerateAI}
          disabled={isGenerating}
          className="flex items-center gap-2 bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700"
        >
          {hasWeeklyPlan ? (
            <>
              <RefreshCw className="w-4 h-4" />
              {language === 'ar' ? 'إعادة توليد' : 'Regenerate'}
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              {language === 'ar' ? 'توليد خطة ذكية' : 'Generate AI Plan'}
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default MealPlanHeader;
