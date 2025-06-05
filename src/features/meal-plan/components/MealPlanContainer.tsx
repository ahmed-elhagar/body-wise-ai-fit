
import React from 'react';
import { useMealPlanPage } from '@/hooks/useMealPlanPage';
import { MealPlanLoadingStates } from '@/components/meal-plan/MealPlanLoadingStates';
import MealPlanErrorState from '@/components/meal-plan/MealPlanErrorState';
import { MealPlanContent } from './MealPlanContent';

export const MealPlanContainer = () => {
  const mealPlanState = useMealPlanPage();

  // Show inline loading states when generating or shuffling
  if (mealPlanState.isGenerating) {
    return (
      <div className="min-h-screen p-6">
        <div className="max-w-7xl mx-auto">
          <MealPlanLoadingStates
            isGenerating={mealPlanState.isGenerating}
            isLoading={false}
            isShuffling={false}
            inline={true}
          />
        </div>
      </div>
    );
  }

  // Show error state if there's an error
  if (mealPlanState.error) {
    return <MealPlanErrorState onRetry={mealPlanState.refetch} />;
  }

  // Show main content
  return <MealPlanContent {...mealPlanState} />;
};
