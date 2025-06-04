
import { useI18n } from "@/hooks/useI18n"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar"
import { SidebarBranding } from "./sidebar/SidebarBranding"
import { SidebarMainNavigation } from "./sidebar/SidebarMainNavigation"
import { SidebarManagementPanel } from "./sidebar/SidebarManagementPanel"
import { SidebarAccountSection } from "./sidebar/SidebarAccountSection"
import { SidebarFooterActions } from "./sidebar/SidebarFooterActions"
import { cn } from "@/lib/utils"

const AppSidebar = () => {
  const { isRTL } = useI18n()
  const { state, isMobile } = useSidebar()
  const isCollapsed = state === "collapsed"

  return (
    <Sidebar 
      className={cn(
        "border-r border-gray-200 bg-white transition-all duration-300",
        isRTL ? 'border-l border-r-0' : '',
        isCollapsed && !isMobile ? 'w-16' : 'w-64',
        isMobile && 'w-80'
      )}
      collapsible="icon"
    >
      <SidebarHeader className="p-0">
        <SidebarBranding />
      </SidebarHeader>
      
      <SidebarContent className="px-2 py-4 space-y-4 overflow-y-auto">
        <SidebarMainNavigation />
        <SidebarManagementPanel />
        {!isCollapsed && <SidebarAccountSection />}
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-gray-200">
        {!isCollapsed && <SidebarFooterActions />}
      </SidebarFooter>
    </Sidebar>
  )
}

export default AppSidebar
