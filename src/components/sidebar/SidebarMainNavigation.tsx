
import { Calendar, Home, Utensils, Dumbbell, TrendingUp, MessageCircle } from "lucide-react"
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
import { useUnreadMessages } from "@/hooks/useUnreadMessages"

const SidebarMainNavigation = () => {
  const { t, isRTL } = useI18n()
  const location = useLocation()
  const { data: unreadCount = 0 } = useUnreadMessages()

  const isActive = (path: string) => location.pathname === path

  const mainItems = [
    {
      title: t("Dashboard"),
      url: "/dashboard",
      icon: Home,
    },
    {
      title: t("Meal Plan"),
      url: "/meal-plan", 
      icon: Utensils,
    },
    {
      title: t("Exercise"),
      url: "/exercise",
      icon: Dumbbell,
    },
    {
      title: t("Progress"),
      url: "/progress",
      icon: TrendingUp,
    },
    {
      title: t("Chat"),
      url: "/chat",
      icon: MessageCircle,
      badge: unreadCount > 0 ? unreadCount : undefined,
    },
  ]

  return (
    <SidebarGroup>
      <SidebarGroupLabel className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 py-2">
        {t("Main")}
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {mainItems.map((item) => (
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

export default SidebarMainNavigation
