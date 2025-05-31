
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { AppSidebarHeader, SidebarNavigation, AppSidebarFooter } from "@/components/sidebar";
import SidebarAdminPanel from "@/components/sidebar/SidebarAdminPanel";
import SidebarCoachPanel from "@/components/sidebar/SidebarCoachPanel";

export const AppSidebar = () => {
  return (
    <Sidebar className="border-r border-gray-200 bg-white">
      <SidebarHeader>
        <AppSidebarHeader />
      </SidebarHeader>
      
      <SidebarContent className="overflow-y-auto">
        <SidebarNavigation />
        <SidebarCoachPanel />
        <SidebarAdminPanel />
      </SidebarContent>
      
      <SidebarFooter>
        <AppSidebarFooter />
      </SidebarFooter>
    </Sidebar>
  );
};
