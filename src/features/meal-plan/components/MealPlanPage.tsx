import React from 'react';
import ProtectedLayout from '@/components/ProtectedLayout';
import { MealPlanContainer } from '@/features/meal-plan/components/MealPlanContainer';

const MealPlan = () => {
  return (
    <ProtectedLayout>
      <MealPlanContainer />
    </ProtectedLayout>
  );
};

export default MealPlan; 