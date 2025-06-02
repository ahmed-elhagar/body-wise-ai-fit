import React, { useState } from 'react';
import { useMealPlanPage } from '@/hooks/useMealPlanPage';
import { DayOverview } from './DayOverview';
import { WeeklyMealPlanView } from './WeeklyMealPlanView';
import { EmptyWeekState } from './EmptyWeekState';
import { MealPlanPageHeader } from './MealPlanPageHeader';
import { Button } from '@/components/ui/button';
import { Calendar, Grid3X3 } from 'lucide-react';
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

  const handleShuffleMeals = async () => {
    if (currentWeekPlan?.weeklyPlan?.id) {
      const success = await shuffleMeals(currentWeekPlan.weeklyPlan.id);
      if (success) {
        window.location.reload();
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 space-y-4">
      {/* Page Header */}
      <MealPlanPageHeader
        onGenerateAI={openAIDialog}
        onShuffle={handleShuffleMeals}
        isGenerating={isGenerating}
        isShuffling={isShuffling}
        hasWeeklyPlan={!!currentWeekPlan?.weeklyPlan}
        currentWeekOffset={currentWeekOffset}
        setCurrentWeekOffset={setCurrentWeekOffset}
        weekStartDate={weekStartDate}
      />

      {/* View Mode Toggle and Day Navigation */}
      {currentWeekPlan?.weeklyPlan && (
        <div className="bg-white rounded-lg border shadow-sm p-4">
          {/* View Mode Toggle */}
          <div className={`flex items-center justify-between mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className={`flex gap-1 bg-gray-100 p-1 rounded-lg ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Button
                variant={viewMode === 'daily' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('daily')}
                className={`flex items-center gap-2 px-4 py-2 h-9 ${
                  viewMode === 'daily' 
                    ? 'bg-white shadow-sm text-blue-600' 
                    : 'text-gray-600 hover:text-blue-600'
                }`}
              >
                <Calendar className="w-4 h-4" />
                {t('mealPlan.dailyView') || 'Daily'}
              </Button>
              <Button
                variant={viewMode === 'weekly' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('weekly')}
                className={`flex items-center gap-2 px-4 py-2 h-9 ${
                  viewMode === 'weekly' 
                    ? 'bg-white shadow-sm text-blue-600' 
                    : 'text-gray-600 hover:text-blue-600'
                }`}
              >
                <Grid3X3 className="w-4 h-4" />
                {t('mealPlan.weeklyView') || 'Weekly'}
              </Button>
            </div>
          </div>

          {/* Day Selection (Daily View Only) */}
          {viewMode === 'daily' && (
            <div className={`grid grid-cols-7 gap-2 ${isRTL ? 'direction-rtl' : ''}`}>
              {[1, 2, 3, 4, 5, 6, 7].map((dayNumber) => {
                const isSelected = selectedDayNumber === dayNumber;
                const isToday = new Date().toDateString() === new Date(weekStartDate.getTime() + (dayNumber - 1) * 24 * 60 * 60 * 1000).toDateString();
                
                return (
                  <Button
                    key={dayNumber}
                    variant={isSelected ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedDayNumber(dayNumber)}
                    className={`flex flex-col items-center h-16 relative p-2 ${
                      isSelected ? 'bg-blue-600 hover:bg-blue-700 text-white border-blue-600' : 'hover:bg-blue-50 border-gray-200'
                    }`}
                  >
                    <span className="font-semibold text-sm">
                      {getDayName(dayNumber).slice(0, 3)}
                    </span>
                    <span className="text-xs opacity-75 mt-1">
                      {getDayDate(dayNumber).split('/')[1]}/{getDayDate(dayNumber).split('/')[2]}
                    </span>
                    {isToday && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-orange-500 rounded-full border-2 border-white"></div>
                    )}
                  </Button>
                );
              })}
            </div>
          )}
        </div>
      )}

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
