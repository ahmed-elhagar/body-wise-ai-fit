
import React from 'react';
import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/components/AppSidebar";
import { MealPlanContainer } from "@/features/meal-plan";
import { PageErrorBoundary, FeatureErrorBoundary } from "@/components/error-boundaries";

const MealPlan = () => {
  return (
    <PageErrorBoundary pageName="Meal Plan">
      <SidebarProvider>
        <div className="flex min-h-screen w-full">
          <AppSidebar />
          <div className="flex-1 p-6">
            <FeatureErrorBoundary featureName="Meal Plan">
              <MealPlanContainer />
            </FeatureErrorBoundary>
          </div>
        </div>
      </SidebarProvider>
    </PageErrorBoundary>
  );
};

export default MealPlan;
