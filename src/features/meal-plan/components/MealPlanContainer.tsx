
import React, { useState } from 'react';
import { useMealPlanPage } from '@/hooks/useMealPlanPage';
import { DayOverview } from './DayOverview';
import { WeeklyMealPlanView } from './WeeklyMealPlanView';
import { EmptyWeekState } from './EmptyWeekState';
import { Button } from '@/components/ui/button';
import { Calendar, Grid3X3, ChevronLeft, ChevronRight, Sparkles, Shuffle } from 'lucide-react';
import { AIGenerationDialog } from './dialogs/AIGenerationDialog';
import { AddSnackDialog } from './dialogs/AddSnackDialog';
import { ExchangeDialog } from './dialogs/ExchangeDialog';
import { RecipeDialog } from './dialogs/RecipeDialog';
import { useEnhancedMealShuffle } from '@/hooks/useEnhancedMealShuffle';
import EnhancedLoadingIndicator from '@/components/ui/enhanced-loading-indicator';
import { useLanguage } from '@/contexts/LanguageContext';
import type { DailyMeal } from '@/hooks/useMealPlanData';

export const MealPlanContainer = () => {
  const [viewMode, setViewMode] = useState<'daily' | 'weekly'>('daily');
  const { t, isRTL } = useLanguage();
  const { shuffleMeals, isShuffling } = useEnhancedMealShuffle();
  
  const {
    // Navigation
    currentWeekOffset,
    setCurrentWeekOffset,
    selectedDayNumber,
    setSelectedDayNumber,
    weekStartDate,
    
    // Data
    currentWeekPlan,
    isLoading,
    error,
    
    // Calculations
    dailyMeals,
    totalCalories,
    totalProtein,
    targetDayCalories,
    
    // Dialog states
    showAIDialog,
    showAddSnackDialog,
    showExchangeDialog,
    showRecipeDialog,
    selectedMeal,
    aiPreferences,
    
    // Dialog actions
    openAIDialog,
    closeAIDialog,
    openAddSnackDialog,
    closeAddSnackDialog,
    openExchangeDialog,
    closeExchangeDialog,
    openRecipeDialog,
    closeRecipeDialog,
    
    // Main actions
    isGenerating,
    handleGenerateAIPlan,
    handleViewMeal,
    handleExchangeMeal,
    handleAddSnack,
    refetch,
    
    // Credit system
    userCredits
  } = useMealPlanPage();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <EnhancedLoadingIndicator
          status="loading"
          type="general"
          message="Loading meal plan..."
          variant="card"
          size="lg"
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-8">
          <h3 className="text-lg font-semibold text-red-600 mb-2">Error loading meal plan</h3>
          <p className="text-gray-600">{error.message}</p>
          <button 
            onClick={refetch}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const getDayName = (dayNumber: number) => {
    const dayNames = [
      t('saturday') || 'Saturday',
      t('sunday') || 'Sunday', 
      t('monday') || 'Monday',
      t('tuesday') || 'Tuesday',
      t('wednesday') || 'Wednesday',
      t('thursday') || 'Thursday',
      t('friday') || 'Friday'
    ];
    return dayNames[dayNumber - 1] || 'Day ' + dayNumber;
  };

  const getDayDate = (dayNumber: number) => {
    const date = new Date(weekStartDate);
    date.setDate(date.getDate() + (dayNumber - 1));
    return date.toLocaleDateString();
  };

  const getWeekDateRange = () => {
    const endDate = new Date(weekStartDate);
    endDate.setDate(endDate.getDate() + 6);
    return `${weekStartDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`;
  };

  const handleShuffleMeals = async () => {
    if (weeklyPlan?.weeklyPlan?.id) {
      const success = await shuffleMeals(weeklyPlan.weeklyPlan.id);
      if (success) {
        window.location.reload();
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-2 space-y-3">
      {/* Compact Navigation Header */}
      <div className="bg-white rounded-lg border shadow-sm p-3">
        {/* Top Row: View Toggle + Week Navigation */}
        <div className="flex items-center justify-between mb-3">
          {/* View Mode Toggle */}
          {currentWeekPlan?.weeklyPlan && (
            <div className={`flex gap-1 bg-gray-100 p-1 rounded-lg ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Button
                variant={viewMode === 'daily' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('daily')}
                className={`flex items-center gap-1 text-xs px-2 py-1 h-7 ${
                  viewMode === 'daily' 
                    ? 'bg-white shadow-sm text-blue-600' 
                    : 'text-gray-600 hover:text-blue-600'
                }`}
              >
                <Calendar className="w-3 h-3" />
                {t('mealPlan.dailyView') || 'Daily'}
              </Button>
              <Button
                variant={viewMode === 'weekly' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('weekly')}
                className={`flex items-center gap-1 text-xs px-2 py-1 h-7 ${
                  viewMode === 'weekly' 
                    ? 'bg-white shadow-sm text-blue-600' 
                    : 'text-gray-600 hover:text-blue-600'
                }`}
              >
                <Grid3X3 className="w-3 h-3" />
                {t('mealPlan.weeklyView') || 'Weekly'}
              </Button>
            </div>
          )}

          {/* Week Navigation */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurrentWeekOffset(currentWeekOffset - 1)}
              className="h-7 w-7 p-0"
            >
              <ChevronLeft className="w-3 h-3" />
            </Button>
            
            <div className="text-center min-w-[120px]">
              <div className="text-xs font-medium text-gray-900">
                {getWeekDateRange()}
              </div>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurrentWeekOffset(currentWeekOffset + 1)}
              className="h-7 w-7 p-0"
            >
              <ChevronRight className="w-3 h-3" />
            </Button>
          </div>

          {/* Actions */}
          <div className="flex gap-1">
            {currentWeekPlan?.weeklyPlan?.id && (
              <Button
                onClick={handleShuffleMeals}
                disabled={isShuffling}
                variant="outline"
                size="sm"
                className="h-7 px-2 text-xs"
              >
                <Shuffle className="w-3 h-3 mr-1" />
                {t('mealPlan.shuffleMeals') || 'Shuffle'}
              </Button>
            )}
            <Button
              onClick={openAIDialog}
              disabled={isGenerating}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white h-7 px-3 text-xs"
              size="sm"
            >
              <Sparkles className="w-3 h-3 mr-1" />
              {isGenerating ? (t('generating') || 'Generating...') : (t('mealPlan.generateAI') || 'AI Generate')}
            </Button>
          </div>
        </div>

        {/* Day Selection (Daily View Only) */}
        {viewMode === 'daily' && currentWeekPlan?.weeklyPlan && (
          <div className={`grid grid-cols-7 gap-1 ${isRTL ? 'direction-rtl' : ''}`}>
            {[1, 2, 3, 4, 5, 6, 7].map((dayNumber) => {
              const isSelected = selectedDayNumber === dayNumber;
              const isToday = new Date().toDateString() === new Date(weekStartDate.getTime() + (dayNumber - 1) * 24 * 60 * 60 * 1000).toDateString();
              
              return (
                <Button
                  key={dayNumber}
                  variant={isSelected ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedDayNumber(dayNumber)}
                  className={`flex flex-col items-center h-10 relative text-xs ${
                    isSelected ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'hover:bg-blue-50'
                  }`}
                >
                  <span className="font-medium text-xs">
                    {getDayName(dayNumber).slice(0, 3)}
                  </span>
                  <span className="text-xs opacity-75">
                    {getDayDate(dayNumber).split('/')[1]}
                  </span>
                  {isToday && (
                    <div className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
                  )}
                </Button>
              );
            })}
          </div>
        )}
      </div>

      {/* Main Content */}
      {currentWeekPlan?.weeklyPlan ? (
        viewMode === 'daily' ? (
          <DayOverview
            selectedDayNumber={selectedDayNumber}
            dailyMeals={dailyMeals || []}
            totalCalories={totalCalories || 0}
            totalProtein={totalProtein || 0}
            targetDayCalories={targetDayCalories || 2000}
            onViewMeal={handleViewMeal}
            onExchangeMeal={handleExchangeMeal}
            onAddSnack={handleAddSnack}
            weekStartDate={weekStartDate}
            weeklyPlan={currentWeekPlan}
            showAddSnackButton={true}
            currentWeekOffset={currentWeekOffset}
            setCurrentWeekOffset={setCurrentWeekOffset}
            setSelectedDayNumber={setSelectedDayNumber}
            onGenerateAI={openAIDialog}
            isGenerating={isGenerating}
          />
        ) : (
          <WeeklyMealPlanView
            weeklyPlan={currentWeekPlan}
            onViewMeal={handleViewMeal}
            onExchangeMeal={handleExchangeMeal}
            weekStartDate={weekStartDate}
          />
        )
      ) : (
        <EmptyWeekState
          onGenerateAI={openAIDialog}
          isGenerating={isGenerating}
        />
      )}

      {/* Dialogs */}
      <AIGenerationDialog
        isOpen={showAIDialog}
        onClose={closeAIDialog}
        preferences={aiPreferences}
        onGenerate={handleGenerateAIPlan}
        isGenerating={isGenerating}
        weekOffset={currentWeekOffset}
      />

      <AddSnackDialog
        isOpen={showAddSnackDialog}
        onClose={closeAddSnackDialog}
        currentDayCalories={totalCalories || 0}
        targetDayCalories={targetDayCalories || 2000}
        selectedDay={selectedDayNumber}
        weeklyPlanId={currentWeekPlan?.weeklyPlan?.id}
        onSnackAdded={refetch}
      />

      <ExchangeDialog
        isOpen={showExchangeDialog}
        onClose={closeExchangeDialog}
        meal={selectedMeal as DailyMeal | null}
        onMealExchanged={refetch}
      />

      <RecipeDialog
        isOpen={showRecipeDialog}
        onClose={closeRecipeDialog}
        meal={selectedMeal as DailyMeal | null}
      />
    </div>
  );
};
