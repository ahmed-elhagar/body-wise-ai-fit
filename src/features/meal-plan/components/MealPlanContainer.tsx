
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCreditSystem } from '@/hooks/useCreditSystem';
import { LoadingState } from './LoadingState';
import { EmptyWeekState } from './EmptyWeekState';
import { DayOverview } from './DayOverview';
import { UnifiedNavigation } from './navigation/UnifiedNavigation';
import { AIGenerationDialog } from './dialogs/AIGenerationDialog';
import { RecipeDialog } from './dialogs/RecipeDialog';
import { ExchangeDialog } from './dialogs/ExchangeDialog';
import { AddSnackDialog } from './dialogs/AddSnackDialog';
import { useMealPlanCore, useMealPlanNavigation, useMealPlanCalculations, useMealPlanDialogs } from '../hooks';

export const MealPlanContainer = () => {
  const { t } = useLanguage();
  const { credits } = useCreditSystem();
  
  // Use centralized hooks
  const navigation = useMealPlanNavigation();
  const dialogs = useMealPlanDialogs();
  
  const { 
    data: mealPlanData, 
    isLoading, 
    error, 
    refetch 
  } = useMealPlanCore(navigation.currentWeekOffset);
  
  const calculations = useMealPlanCalculations(mealPlanData, navigation.selectedDayNumber);

  console.log('🍽️ MealPlanContainer State:', {
    hasData: !!mealPlanData,
    isLoading,
    currentWeekOffset: navigation.currentWeekOffset,
    selectedDay: navigation.selectedDayNumber,
    totalMeals: calculations.dailyMeals.length,
    credits: credits.remaining
  });

  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    console.error('❌ Meal plan error:', error);
    return (
      <div className="text-center py-8 text-red-600">
        <p>{t('mealPlan.error') || 'Error loading meal plan'}</p>
        <button onClick={() => refetch()} className="mt-2 text-blue-600 hover:underline">
          {t('common.retry') || 'Retry'}
        </button>
      </div>
    );
  }

  const handleRefresh = async () => {
    await refetch();
  };

  return (
    <div className="space-y-6">
      {/* Navigation */}
      <UnifiedNavigation
        currentWeekOffset={navigation.currentWeekOffset}
        setCurrentWeekOffset={navigation.setCurrentWeekOffset}
        selectedDayNumber={navigation.selectedDayNumber}
        setSelectedDayNumber={navigation.setSelectedDayNumber}
        weekStartDate={navigation.weekStartDate}
        onGenerateAI={() => dialogs.setShowAIDialog(true)}
        onRefresh={handleRefresh}
        hasWeeklyPlan={!!mealPlanData?.weeklyPlan}
        credits={credits}
      />

      {/* Main Content */}
      {!mealPlanData?.weeklyPlan ? (
        <EmptyWeekState onGenerateClick={() => dialogs.setShowAIDialog(true)} />
      ) : (
        <DayOverview
          selectedDayNumber={navigation.selectedDayNumber}
          dailyMeals={calculations.dailyMeals}
          totalCalories={calculations.totalCalories}
          totalProtein={calculations.totalProtein}
          targetDayCalories={calculations.targetDayCalories}
          onViewMeal={dialogs.openRecipeDialog}
          onExchangeMeal={dialogs.openExchangeDialog}
          onAddSnack={dialogs.openAddSnackDialog}
          weekStartDate={navigation.weekStartDate}
        />
      )}

      {/* Dialogs */}
      <AIGenerationDialog
        isOpen={dialogs.showAIDialog}
        onClose={() => dialogs.setShowAIDialog(false)}
        preferences={dialogs.aiPreferences}
        setPreferences={dialogs.setAiPreferences}
        weekOffset={navigation.currentWeekOffset}
        onSuccess={handleRefresh}
      />

      <RecipeDialog
        isOpen={dialogs.showRecipeDialog}
        onClose={() => dialogs.setShowRecipeDialog(false)}
        meal={dialogs.selectedMeal}
      />

      <ExchangeDialog
        isOpen={dialogs.showExchangeDialog}
        onClose={() => dialogs.setShowExchangeDialog(false)}
        meal={dialogs.selectedMeal}
        onSuccess={handleRefresh}
      />

      <AddSnackDialog
        isOpen={dialogs.showAddSnackDialog}
        onClose={() => dialogs.setShowAddSnackDialog(false)}
        selectedDay={navigation.selectedDayNumber}
        weeklyPlanId={mealPlanData?.weeklyPlan?.id || null}
        onSnackAdded={handleRefresh}
        currentDayCalories={calculations.totalCalories}
        targetDayCalories={calculations.targetDayCalories}
      />
    </div>
  );
};
