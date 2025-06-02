
import React from 'react';
import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/components/AppSidebar";
import { MealPlanContainer } from "@/features/meal-plan/components/MealPlanContainer";
import { ErrorBoundary } from "@/components/ErrorBoundary";

const MealPlan = () => {
  return (
    <ErrorBoundary>
      <SidebarProvider>
        <div className="flex min-h-screen w-full">
          <AppSidebar />
          <div className="flex-1 p-6">
            <MealPlanContainer />
          </div>
        </div>
      </SidebarProvider>
    </ErrorBoundary>
  );
};

export default MealPlan;
