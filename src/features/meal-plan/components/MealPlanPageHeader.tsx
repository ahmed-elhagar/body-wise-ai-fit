
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, Shuffle, UtensilsCrossed, ChevronLeft, ChevronRight, Calendar, Grid3X3, ShoppingCart } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface MealPlanPageHeaderProps {
  onGenerateAI: () => void;
  onShuffle: () => void;
  onShowShoppingList: () => void;
  isGenerating: boolean;
  isShuffling: boolean;
  hasWeeklyPlan: boolean;
  currentWeekOffset: number;
  setCurrentWeekOffset: (offset: number) => void;
  weekStartDate: Date;
  viewMode: 'daily' | 'weekly';
  onViewModeChange: (mode: 'daily' | 'weekly') => void;
}

export const MealPlanPageHeader = ({
  onGenerateAI,
  onShuffle,
  onShowShoppingList,
  isGenerating,
  isShuffling,
  hasWeeklyPlan,
  currentWeekOffset,
  setCurrentWeekOffset,
  weekStartDate,
  viewMode,
  onViewModeChange
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
          </div>

          {/* Action Buttons */}
          <div className={`flex gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
            {hasWeeklyPlan && (
              <Button
                onClick={onShowShoppingList}
                variant="outline"
                size="icon"
                className="bg-white/10 border-white/30 text-white hover:bg-white/20 hover:text-white backdrop-blur-sm"
              >
                <ShoppingCart className="w-4 h-4" />
              </Button>
            )}
            
            {hasWeeklyPlan && (
              <Button
                onClick={onShuffle}
                disabled={isGenerating || isShuffling}
                variant="outline"
                size="icon"
                className="bg-white/10 border-white/30 text-white hover:bg-white/20 hover:text-white backdrop-blur-sm"
              >
                <Shuffle className="w-4 h-4" />
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

        {/* Navigation Controls - Combined in single row */}
        <div className={`flex items-center justify-between mt-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
          {/* View Mode Toggle */}
          <div className={`flex gap-1 bg-white/20 p-1 rounded-lg backdrop-blur-sm ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onViewModeChange('daily')}
              className={`flex items-center gap-2 px-4 py-2 h-9 text-sm font-medium transition-all ${
                viewMode === 'daily' 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-white hover:bg-white/10'
              }`}
            >
              <Calendar className="w-4 h-4" />
              {t('mealPlan.dailyView') || 'Daily'}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onViewModeChange('weekly')}
              className={`flex items-center gap-2 px-4 py-2 h-9 text-sm font-medium transition-all ${
                viewMode === 'weekly' 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-white hover:bg-white/10'
              }`}
            >
              <Grid3X3 className="w-4 h-4" />
              {t('mealPlan.weeklyView') || 'Weekly'}
            </Button>
          </div>

          {/* Week Navigation */}
          <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurrentWeekOffset(currentWeekOffset - 1)}
              className="h-9 w-9 p-0 text-white hover:bg-white/20"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            
            <div className="text-center min-w-[180px]">
              <div className="text-sm font-medium text-white bg-white/10 rounded-lg px-4 py-2 backdrop-blur-sm">
                {getWeekDateRange()}
              </div>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurrentWeekOffset(currentWeekOffset + 1)}
              className="h-9 w-9 p-0 text-white hover:bg-white/20"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};
