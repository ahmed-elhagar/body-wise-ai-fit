
import React from 'react';
import Layout from '@/components/Layout';
import { MealPlanContainer } from "@/features/meal-plan";

const MealPlan = () => {
  return (
    <Layout>
      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto">
          <div className="container mx-auto px-4 py-6 max-w-7xl">
            <MealPlanContainer />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default MealPlan;
