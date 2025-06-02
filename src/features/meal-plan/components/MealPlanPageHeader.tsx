
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, Shuffle, UtensilsCrossed, ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface MealPlanPageHeaderProps {
  onGenerateAI: () => void;
  onShuffle: () => void;
  isGenerating: boolean;
  isShuffling: boolean;
  hasWeeklyPlan: boolean;
  currentWeekOffset: number;
  setCurrentWeekOffset: (offset: number) => void;
  weekStartDate: Date;
}

export const MealPlanPageHeader = ({
  onGenerateAI,
  onShuffle,
  isGenerating,
  isShuffling,
  hasWeeklyPlan,
  currentWeekOffset,
  setCurrentWeekOffset,
  weekStartDate
}: MealPlanPageHeaderProps) => {
  const { t, isRTL } = useLanguage();

  const getWeekDateRange = () => {
    const endDate = new Date(weekStartDate);
    endDate.setDate(endDate.getDate() + 6);
    return `${weekStartDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`;
  };

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
                <p className="text-blue-100 text-lg">
                  {t('mealPlan.personalizedNutrition') || 'Personalized nutrition plans powered by AI'}
                </p>
              </div>
            </div>
            
            {/* Week Navigation */}
            <div className={`flex items-center gap-3 mt-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentWeekOffset(currentWeekOffset - 1)}
                className="h-8 w-8 p-0 text-white hover:bg-white/20"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              
              <div className="text-center min-w-[140px]">
                <div className="text-sm font-medium text-white">
                  {getWeekDateRange()}
                </div>
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentWeekOffset(currentWeekOffset + 1)}
                className="h-8 w-8 p-0 text-white hover:bg-white/20"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className={`flex gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
            {hasWeeklyPlan && (
              <Button
                onClick={onShuffle}
                disabled={isGenerating || isShuffling}
                variant="outline"
                className="bg-white/10 border-white/30 text-white hover:bg-white/20 hover:text-white backdrop-blur-sm px-6 py-2"
              >
                <Shuffle className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                {t('mealPlan.shuffleMeals') || 'Shuffle'}
              </Button>
            )}
            
            <Button
              onClick={onGenerateAI}
              disabled={isGenerating}
              className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white border-0 px-8 py-2 font-semibold"
            >
              <Sparkles className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
              {isGenerating ? (t('generating') || 'Generating...') : (t('mealPlan.generateAI') || 'AI Generate')}
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};
