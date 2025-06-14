
import React from 'react';
import { useMealPlanState } from '../hooks/useMealPlanState';
import { MealPlanPageLayout } from './MealPlanPageLayout';
import { ErrorBoundary } from '@/components/ErrorBoundary';

export const MealPlanPageContainer = () => {
  const mealPlanState = useMealPlanState();

  return (
    <ErrorBoundary>
      <MealPlanPageLayout {...mealPlanState} />
    </ErrorBoundary>
  );
};

export default MealPlanPageContainer;
