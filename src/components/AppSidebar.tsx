
import { useI18n } from "@/hooks/useI18n"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar"
import { SidebarBranding } from "./sidebar/SidebarBranding"
import { SidebarMainNavigation } from "./sidebar/SidebarMainNavigation"
import { SidebarManagementPanel } from "./sidebar/SidebarManagementPanel"
import { SidebarAccountSection } from "./sidebar/SidebarAccountSection"
import { SidebarFooterActions } from "./sidebar/SidebarFooterActions"

const AppSidebar = () => {
  const { isRTL } = useI18n()

  return (
    <Sidebar className={`border-r border-gray-200 bg-white ${isRTL ? 'border-l border-r-0' : ''}`}>
      <SidebarHeader className="p-4">
        <SidebarBranding />
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarMainNavigation />
        <SidebarManagementPanel />
        <SidebarAccountSection />
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-gray-200">
        <SidebarFooterActions />
      </SidebarFooter>
    </Sidebar>
  )
}

export default AppSidebar
