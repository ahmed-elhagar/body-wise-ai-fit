
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
        "border-r border-gray-200 bg-white transition-all duration-300 ease-in-out",
        isRTL ? 'border-l border-r-0' : '',
        isCollapsed && !isMobile ? 'w-16' : 'w-64',
        isMobile && 'w-80 shadow-lg z-50'
      )}
      collapsible="icon"
    >
      <SidebarHeader className="p-0 border-b border-gray-200">
        <SidebarBranding />
      </SidebarHeader>
      
      <SidebarContent className={cn(
        "py-4 space-y-4 overflow-y-auto overflow-x-hidden",
        isCollapsed && !isMobile ? "px-1" : "px-2"
      )}>
        <SidebarMainNavigation />
        <SidebarManagementPanel />
        {(!isCollapsed || isMobile) && <SidebarAccountSection />}
      </SidebarContent>

      <SidebarFooter className={cn(
        "border-t border-gray-200 bg-white",
        isCollapsed && !isMobile ? "p-2" : "p-4"
      )}>
        {(!isCollapsed || isMobile) && <SidebarFooterActions />}
      </SidebarFooter>
    </Sidebar>
  )
}

export default AppSidebar
