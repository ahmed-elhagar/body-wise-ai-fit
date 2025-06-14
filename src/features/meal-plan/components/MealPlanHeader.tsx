
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
    <Card className="bg-gradient-to-r from-violet-50 to-purple-50 border-violet-200">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-violet-900 mb-2">
              {t('Smart Meal Planning')}
            </h1>
            <p className="text-violet-700">
              {t('AI-powered personalized nutrition')}
            </p>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={onGenerateAI}
              disabled={isGenerating}
              className="bg-violet-600 hover:bg-violet-700"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              {isGenerating ? t('Generating...') : t('Generate AI Meal Plan')}
            </Button>
            
            {hasWeeklyPlan && (
              <>
                <Button
                  onClick={onShuffle}
                  variant="outline"
                  disabled={isShuffling}
                  className="border-violet-300 text-violet-700 hover:bg-violet-50"
                >
                  <Shuffle className="w-4 h-4 mr-2" />
                  {isShuffling ? t('Shuffling...') : t('Shuffle Meals')}
                </Button>
                
                <Button
                  onClick={onShowShoppingList}
                  variant="outline"
                  className="border-violet-300 text-violet-700 hover:bg-violet-50"
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  {t('Shopping List')}
                </Button>
                
                <Button
                  onClick={onRegeneratePlan}
                  variant="outline"
                  className="border-violet-300 text-violet-700 hover:bg-violet-50"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  {t('Regenerate')}
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
