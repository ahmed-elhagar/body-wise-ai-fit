
import React from 'react';
import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/components/AppSidebar";
import { CanonicalDashboard } from "@/features/dashboard/components";

const Dashboard = () => {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <div className="flex-1">
          <CanonicalDashboard />
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;
