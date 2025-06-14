
import React from 'react';
import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/components/AppSidebar";
import { MealPlanPageContainer } from "@/features/meal-plan";

const MealPlan = () => {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <div className="flex-1 p-6">
          <MealPlanPageContainer />
        </div>
      </div>
    </SidebarProvider>
  );
};

export default MealPlan;
