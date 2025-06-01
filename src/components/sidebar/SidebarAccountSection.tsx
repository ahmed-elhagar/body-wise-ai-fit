
import { Bell, User } from "lucide-react"
import { Link, useLocation } from "react-router-dom"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Badge } from "@/components/ui/badge"
import { useI18n } from "@/hooks/useI18n"
import { useNotifications } from "@/hooks/useNotifications"

const SidebarAccountSection = () => {
  const { t, isRTL } = useI18n()
  const location = useLocation()
  const { unreadCount: notificationCount = 0 } = useNotifications()

  const isActive = (path: string) => location.pathname === path

  const utilityItems = [
    {
      title: t("Notifications"),
      url: "/notifications",
      icon: Bell,
      badge: notificationCount > 0 ? notificationCount : undefined,
    },
    {
      title: t("Profile"),
      url: "/profile",
      icon: User,
    },
  ]

  return (
    <SidebarGroup>
      <SidebarGroupLabel className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 py-2">
        {t("Account")}
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {utilityItems.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton 
                asChild 
                className={`${isActive(item.url) ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600' : 'text-gray-700 hover:bg-gray-50'} transition-colors`}
              >
                <Link to={item.url} className="flex items-center gap-3 px-3 py-2 rounded-lg">
                  <item.icon className="h-5 w-5" />
                  <span className="font-medium">{item.title}</span>
                  {item.badge && (
                    <Badge variant="destructive" className="ml-auto text-xs">
                      {item.badge > 9 ? '9+' : item.badge}
                    </Badge>
                  )}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}

export default SidebarAccountSection
