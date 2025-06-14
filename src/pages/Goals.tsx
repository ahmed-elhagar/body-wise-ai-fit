
import React from 'react';
import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/components/AppSidebar";
import { GoalsDashboard } from "@/features/goals/components";

const Goals = () => {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <div className="flex-1 p-6">
          <GoalsDashboard />
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Goals;
