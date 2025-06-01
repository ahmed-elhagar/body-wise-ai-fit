
import { Shield, Users } from "lucide-react"
import { Link, useLocation } from "react-router-dom"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useI18n } from "@/hooks/useI18n"
import { useRole } from "@/hooks/useRole"

const SidebarManagementPanel = () => {
  const { t, isRTL } = useI18n()
  const location = useLocation()
  const { isCoach, isAdmin } = useRole()

  const isActive = (path: string) => location.pathname === path

  const adminItems = [
    ...(isCoach ? [{
      title: t("Coach Panel"),
      url: "/coach",
      icon: Users,
    }] : []),
    ...(isAdmin ? [{
      title: t("Admin Panel"),
      url: "/admin",
      icon: Shield,
    }] : []),
  ]

  if (adminItems.length === 0) {
    return null
  }

  return (
    <SidebarGroup>
      <SidebarGroupLabel className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 py-2">
        {t("Management")}
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {adminItems.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton 
                asChild 
                className={`${isActive(item.url) ? 'bg-green-50 text-green-700 border-r-2 border-green-600' : 'text-gray-700 hover:bg-gray-50'} transition-colors`}
              >
                <Link to={item.url} className="flex items-center gap-3 px-3 py-2 rounded-lg">
                  <item.icon className="h-5 w-5" />
                  <span className="font-medium">{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}

export default SidebarManagementPanel
