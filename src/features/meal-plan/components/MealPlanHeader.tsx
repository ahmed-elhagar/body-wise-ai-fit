
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
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
  const { t } = useLanguage();

  return (
    <Card className="bg-gradient-to-r from-emerald-50 to-green-50 border-emerald-200">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-emerald-900 mb-2">
              {t('Smart Meal Planning')}
            </h1>
            <p className="text-emerald-700">
              {t('AI-powered personalized nutrition')}
            </p>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={hasWeeklyPlan ? onRegeneratePlan : onGenerateAI}
              disabled={isGenerating}
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              {hasWeeklyPlan ? <RefreshCw className="w-4 h-4 mr-2" /> : <Sparkles className="w-4 h-4 mr-2" />}
              {isGenerating ? t('Generating...') : (hasWeeklyPlan ? t('Regenerate Plan') : t('Generate AI Meal Plan'))}
            </Button>
            
            {hasWeeklyPlan && (
              <>
                <Button
                  onClick={onShuffle}
                  variant="outline"
                  disabled={isShuffling}
                  className="border-emerald-300 text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800"
                >
                  <Shuffle className="w-4 h-4 mr-2" />
                  {isShuffling ? t('Shuffling...') : t('Shuffle Meals')}
                </Button>
                
                <Button
                  onClick={onShowShoppingList}
                  variant="outline"
                  className="border-emerald-300 text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800"
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  {t('Shopping List')}
                </Button>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MealPlanHeader;
