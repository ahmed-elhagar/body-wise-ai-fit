
import React from 'react';
import { useMealPlanState } from '@/hooks/useMealPlanState';
import { MealPlanContent } from './MealPlanContent';
import { MealPlanDialogs } from './dialogs/MealPlanDialogs';
import { MealPlanNavigation } from './MealPlanNavigation';
import MealPlanHeader from './MealPlanHeader';

export const MealPlanContainer = () => {
  const mealPlanState = useMealPlanState();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-4 space-y-6">
        <MealPlanHeader 
          onShowAIDialog={mealPlanState.openAIDialog}
          isGenerating={mealPlanState.isGenerating}
        />
        
        <MealPlanNavigation 
          currentWeekOffset={mealPlanState.currentWeekOffset}
          onWeekChange={mealPlanState.setCurrentWeekOffset}
          weekStartDate={mealPlanState.weekStartDate}
        />
        
        <MealPlanContent {...mealPlanState} />
        
        <MealPlanDialogs {...mealPlanState} />
      </div>
    </div>
  );
};
