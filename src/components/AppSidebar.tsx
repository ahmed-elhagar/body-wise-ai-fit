
import React from "react";
import { 
  Sidebar, 
  SidebarContent 
} from "./ui/sidebar";
import { useI18n } from "@/hooks/useI18n";
import { cn } from "@/lib/utils";
import {
  AppSidebarHeader,
  SidebarNavigation,
  SidebarCoachPanel,
  SidebarAdminPanel,
  AppSidebarFooter
} from "./sidebar";

const AppSidebar = () => {
  const { isRTL } = useI18n();

  return (
    <Sidebar 
      className={cn(
        "border-r border-gray-200 bg-white",
        isRTL && "border-r-0 border-l border-gray-200"
      )} 
      side={isRTL ? "right" : "left"}
      data-sidebar="sidebar"
    >
      <AppSidebarHeader />

      <SidebarContent className="p-0 bg-white" data-sidebar="content">
        <SidebarNavigation />
        <SidebarCoachPanel />
        <SidebarAdminPanel />
      </SidebarContent>

      <AppSidebarFooter />
    </Sidebar>
  );
};

export default AppSidebar;
