
import React, { useState } from 'react';
import { useMealPlanState } from '@/hooks/useMealPlanState';
import { useEnhancedShoppingListEmail } from '@/hooks/useEnhancedShoppingListEmail';
import { useEnhancedMealShuffle } from '@/hooks/useEnhancedMealShuffle';
import { useLifePhaseNutrition } from '@/hooks/useLifePhaseNutrition';
import { EnhancedErrorBoundary } from '@/components/ui/enhanced-error-boundary';
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
  
  // Enhanced shopping list functionality
  const { 
    sendShoppingListEmail, 
    isLoading: isEmailLoading 
  } = useEnhancedShoppingListEmail();

  console.log('🔍 MealPlanContainer state:', {
    isLoading: mealPlanState.isLoading,
    authLoading: mealPlanState.authLoading,
    hasData: !!mealPlanState.currentWeekPlan,
    hasError: !!mealPlanState.error,
    errorMessage: mealPlanState.error?.message,
    isGenerating: mealPlanState.isGenerating,
    hasUser: !!mealPlanState.user
  });

  // Show loading state while auth or data is loading
  if (mealPlanState.isLoading) {
    console.log('📋 Showing loading state...');
    return (
      <EnhancedErrorBoundary>
        <LoadingState />
      </EnhancedErrorBoundary>
    );
  }

  // Handle errors with recovery options
  if (mealPlanState.error) {
    console.error('💥 Error in MealPlanContainer:', mealPlanState.error);
    return (
      <EnhancedErrorBoundary>
        <div className="min-h-screen flex items-center justify-center p-4">
          <Card className="max-w-lg w-full p-8 text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-red-600 mb-2">
              {t('errorLoadingMealPlan', 'Error Loading Meal Plan')}
            </h3>
            <p className="text-gray-600 mb-4">
              {mealPlanState.error.message || t('somethingWentWrong', 'Something went wrong while loading your meal plan.')}
            </p>
            <div className="space-y-3">
              <Button 
                onClick={mealPlanState.clearError || mealPlanState.refetch}
                className="w-full"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                {t('tryAgain', 'Try Again')}
              </Button>
              <Button 
                onClick={() => window.location.href = '/dashboard'}
                variant="outline" 
                className="w-full"
              >
                <Home className="w-4 h-4 mr-2" />
                {t('goToDashboard', 'Go to Dashboard')}
              </Button>
            </div>
          </Card>
        </div>
      </EnhancedErrorBoundary>
    );
  }

  // No user (should not happen due to protected routes, but safety check)
  if (!mealPlanState.user) {
    console.warn('⚠️ No user in MealPlanContainer');
    return (
      <EnhancedErrorBoundary>
        <div className="min-h-screen flex items-center justify-center">
          <Card className="p-8 text-center">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              {t('authenticationRequired', 'Authentication Required')}
            </h3>
            <p className="text-gray-600 mb-4">
              {t('pleaseSignIn', 'Please sign in to access your meal plan.')}
            </p>
            <Button onClick={() => window.location.href = '/auth'}>
              {t('signIn', 'Sign In')}
            </Button>
          </Card>
        </div>
      </EnhancedErrorBoundary>
    );
  }

  console.log('✅ Rendering main meal plan content');

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
    <EnhancedErrorBoundary>
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
    </EnhancedErrorBoundary>
  );
};
