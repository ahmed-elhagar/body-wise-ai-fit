
import { Calendar, Home, Utensils, Dumbbell, TrendingUp, Shield, Users, MessageCircle, User, Bell, LogOut } from "lucide-react"
import { Link, useLocation } from "react-router-dom"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from "@/components/ui/sidebar"
import { Badge } from "@/components/ui/badge"
import { useI18n } from "@/hooks/useI18n"
import { useRole } from "@/hooks/useRole"
import { useUnreadMessages } from "@/hooks/useUnreadMessages"
import { useNotifications } from "@/hooks/useNotifications"
import { useAuth } from "@/hooks/useAuth"
import LanguageToggle from "./LanguageToggle"

const AppSidebar = () => {
  const { t, isRTL } = useI18n()
  const location = useLocation()
  const { isCoach, isAdmin } = useRole()
  const { data: unreadCount = 0 } = useUnreadMessages()
  const { unreadCount: notificationCount = 0 } = useNotifications()
  const { signOut } = useAuth()

  const isActive = (path: string) => location.pathname === path

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  // Main navigation items
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

  // Utility items (removed Settings from here since it's in Profile)
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

  // Admin items
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

  return (
    <Sidebar className={`border-r border-gray-200 bg-white ${isRTL ? 'border-l border-r-0' : ''}`}>
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">FG</span>
          </div>
          <span className="font-bold text-xl text-gray-900">FitGenius</span>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
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

        {adminItems.length > 0 && (
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
        )}

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
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-gray-200">
        <div className="space-y-2">
          <LanguageToggle />
          <SidebarMenuButton 
            onClick={handleSignOut}
            className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <LogOut className="h-4 w-4 mr-2" />
            <span className="font-medium">{t("Sign Out")}</span>
          </SidebarMenuButton>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}

export default AppSidebar
