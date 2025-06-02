
import React, { useState } from 'react';
import { useMealPlanState } from '@/hooks/useMealPlanState';
import { useEnhancedShoppingListEmail } from '@/hooks/useEnhancedShoppingListEmail';
import { useEnhancedMealShuffle } from '@/hooks/useEnhancedMealShuffle';
import { useLifePhaseNutrition } from '@/hooks/useLifePhaseNutrition';
import { MealPlanPageHeader } from './MealPlanPageHeader';
import { MealPlanNavigation } from './MealPlanNavigation';
import { MealPlanContent } from './MealPlanContent';
import { MealPlanDialogs } from './dialogs/MealPlanDialogs';
import { LifePhaseRibbon } from '@/components/meal-plan/LifePhaseRibbon';
import { LoadingState } from './LoadingState';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw, Home } from "lucide-react";
import { useMealPlanTranslations } from "@/hooks/useMealPlanTranslations";

export const MealPlanContainer = () => {
  const [viewMode, setViewMode] = useState<'daily' | 'weekly'>('daily');
  const { shuffleMeals, isShuffling } = useEnhancedMealShuffle();
  const { nutritionContext } = useLifePhaseNutrition();
  const { t } = useMealPlanTranslations();
  
  const mealPlanState = useMealPlanState();
  
  const { 
    sendShoppingListEmail, 
    isLoading: isEmailLoading 
  } = useEnhancedShoppingListEmail();

  console.log('🔍 MealPlanContainer render state:', {
    isLoading: mealPlanState.isLoading,
    authLoading: mealPlanState.authLoading,
    hasData: !!mealPlanState.currentWeekPlan,
    hasError: !!mealPlanState.error,
    hasUser: !!mealPlanState.user,
    timestamp: new Date().toISOString()
  });

  // Show loading state - simplified condition
  if (mealPlanState.isLoading) {
    return <LoadingState />;
  }

  // Handle authentication - redirect instead of showing auth required
  if (!mealPlanState.user && !mealPlanState.authLoading) {
    // Redirect to auth page
    window.location.href = '/auth';
    return null;
  }

  // Handle errors with recovery options
  if (mealPlanState.error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-lg w-full p-8 text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-red-600 mb-2">
            {t('errorLoadingMealPlan')}
          </h3>
          <p className="text-gray-600 mb-4">
            {mealPlanState.error.message || t('somethingWentWrong')}
          </p>
          <div className="space-y-3">
            <Button 
              onClick={mealPlanState.clearError || mealPlanState.refetch}
              className="w-full"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              {t('tryAgain')}
            </Button>
            <Button 
              onClick={() => window.location.href = '/dashboard'}
              variant="outline" 
              className="w-full"
            >
              <Home className="w-4 h-4 mr-2" />
              {t('goToDashboard')}
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const handleShuffleMeals = async () => {
    if (mealPlanState.currentWeekPlan?.weeklyPlan?.id) {
      const success = await shuffleMeals(mealPlanState.currentWeekPlan.weeklyPlan.id);
      if (success) {
        await mealPlanState.refetch();
      }
    }
  };

  const handleSendShoppingListEmail = async (): Promise<boolean> => {
    return await sendShoppingListEmail(mealPlanState.currentWeekPlan);
  };

  return (
    <div className="container mx-auto px-4 py-6 space-y-4">
      {/* Life Phase Nutrition Banner */}
      {(nutritionContext.isPregnant || nutritionContext.isBreastfeeding || nutritionContext.isMuslimFasting) && (
        <LifePhaseRibbon
          pregnancyTrimester={nutritionContext.pregnancyTrimester}
          breastfeedingLevel={nutritionContext.breastfeedingLevel}
          fastingType={nutritionContext.fastingType}
          extraCalories={nutritionContext.extraCalories}
        />
      )}

      {/* Page Header */}
      <MealPlanPageHeader
        onGenerateAI={mealPlanState.openAIDialog}
        onShuffle={handleShuffleMeals}
        onShowShoppingList={() => mealPlanState.setDialogs?.(prev => ({ ...prev, showShoppingListDialog: true }))}
        isGenerating={mealPlanState.isGenerating}
        isShuffling={isShuffling}
        hasWeeklyPlan={!!mealPlanState.currentWeekPlan?.weeklyPlan}
      />

      {/* Navigation */}
      <MealPlanNavigation
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        currentWeekOffset={mealPlanState.currentWeekOffset}
        onWeekOffsetChange={mealPlanState.setCurrentWeekOffset}
        selectedDayNumber={mealPlanState.selectedDayNumber}
        onDayChange={mealPlanState.setSelectedDayNumber}
        weekStartDate={mealPlanState.weekStartDate}
        hasWeeklyPlan={!!mealPlanState.currentWeekPlan?.weeklyPlan}
      />

      {/* Main Content */}
      <MealPlanContent
        viewMode={viewMode}
        currentWeekPlan={mealPlanState.currentWeekPlan}
        selectedDayNumber={mealPlanState.selectedDayNumber}
        dailyMeals={mealPlanState.dailyMeals}
        totalCalories={mealPlanState.totalCalories}
        totalProtein={mealPlanState.totalProtein}
        targetDayCalories={mealPlanState.targetDayCalories}
        weekStartDate={mealPlanState.weekStartDate}
        currentWeekOffset={mealPlanState.currentWeekOffset}
        isGenerating={mealPlanState.isGenerating}
        onViewMeal={mealPlanState.openRecipeDialog}
        onExchangeMeal={mealPlanState.openExchangeDialog}
        onAddSnack={mealPlanState.handleAddSnack}
        onGenerateAI={mealPlanState.openAIDialog}
        setCurrentWeekOffset={mealPlanState.setCurrentWeekOffset}
        setSelectedDayNumber={mealPlanState.setSelectedDayNumber}
      />

      {/* Enhanced Dialogs */}
      <MealPlanDialogs
        showAIDialog={mealPlanState.showAIDialog}
        onCloseAIDialog={mealPlanState.closeAIDialog}
        aiPreferences={mealPlanState.aiPreferences}
        onGenerateAI={mealPlanState.handleGenerateAIPlan}
        isGenerating={mealPlanState.isGenerating}
        currentWeekOffset={mealPlanState.currentWeekOffset}
        showAddSnackDialog={mealPlanState.showAddSnackDialog}
        onCloseAddSnackDialog={mealPlanState.closeAddSnackDialog}
        selectedDayNumber={mealPlanState.selectedDayNumber}
        totalCalories={mealPlanState.totalCalories || 0}
        targetDayCalories={mealPlanState.targetDayCalories || 2000}
        weeklyPlanId={mealPlanState.currentWeekPlan?.weeklyPlan?.id}
        weekStartDate={mealPlanState.weekStartDate}
        onSnackAdded={mealPlanState.refetch}
        showExchangeDialog={mealPlanState.showExchangeDialog}
        onCloseExchangeDialog={mealPlanState.closeExchangeDialog}
        selectedMeal={mealPlanState.selectedMeal}
        onMealExchanged={mealPlanState.refetch}
        showRecipeDialog={mealPlanState.showRecipeDialog}
        onCloseRecipeDialog={mealPlanState.closeRecipeDialog}
        onRecipeUpdated={mealPlanState.refetch}
        showShoppingListDialog={mealPlanState.showShoppingListDialog || false}
        onCloseShoppingListDialog={() => mealPlanState.setDialogs?.(prev => ({ ...prev, showShoppingListDialog: false }))}
        enhancedShoppingItems={[]}
        onSendShoppingListEmail={handleSendShoppingListEmail}
        userCredits={mealPlanState.userCredits}
        hasWeeklyPlan={!!mealPlanState.currentWeekPlan?.weeklyPlan}
        isEmailLoading={isEmailLoading}
        currentWeekPlan={mealPlanState.currentWeekPlan}
      />
    </div>
  );
};
