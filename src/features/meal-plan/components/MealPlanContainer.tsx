
import React from 'react';
import { MealPlanPage } from './MealPlanPage';
import { useMealPlanCore } from '../hooks/useMealPlanCore';
import { useMealPlanNavigation } from '../hooks/useMealPlanNavigation';
import { useMealPlanDialogs } from '../hooks/useMealPlanDialogs';

export const MealPlanContainer: React.FC = () => {
  const mealPlanCore = useMealPlanCore();
  const navigation = useMealPlanNavigation();
  const dialogs = useMealPlanDialogs();

  return (
    <MealPlanPage
      {...mealPlanCore}
      {...navigation}
      {...dialogs}
    />
  );
};
