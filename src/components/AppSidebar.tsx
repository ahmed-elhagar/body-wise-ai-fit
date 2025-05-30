
import {
  Calendar,
  Home,
  User,
  Utensils,
  Activity,
  TrendingUp,
  Settings,
  ChevronUp,
  User2,
} from "lucide-react"

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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/hooks/useAuth"
import { useNavigate } from "react-router-dom"
import { useLanguage } from "@/contexts/LanguageContext"
import LanguageToggle from "@/components/LanguageToggle"

const items = [
  {
    title: "dashboard",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "mealPlan",
    url: "/meal-plan",
    icon: Utensils,
  },
  {
    title: "exercise",
    url: "/exercise",
    icon: Activity,
  },
  {
    title: "progress",
    url: "/progress",
    icon: TrendingUp,
  },
  {
    title: "profile",
    url: "/profile",
    icon: User,
  },
]

export function AppSidebar() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const { t, isRTL } = useLanguage()

  const handleSignOut = async () => {
    try {
      await signOut()
      navigate("/")
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  return (
    <Sidebar variant="inset" className="border-r border-border/40">
      <SidebarHeader className="h-16 border-b border-border/40">
        <div className={`flex items-center gap-2 px-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <Activity className="h-6 w-6 text-fitness-primary" />
          <span className="font-bold text-lg text-fitness-primary">
            {t('navigation.appName')}
          </span>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className={isRTL ? 'text-right' : ''}>{t('navigation.menu')}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url} className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <item.icon className="h-4 w-4" />
                      <span>{t(`navigation.${item.title}`)}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter>
        <div className="px-3 py-2 border-t border-border/40">
          <LanguageToggle />
        </div>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className={`data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground ${isRTL ? 'flex-row-reverse' : ''}`}
                >
                  <div className={`flex items-center gap-2 flex-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">{user?.email}</span>
                      <span className="truncate text-xs">{t('navigation.account')}</span>
                    </div>
                  </div>
                  <ChevronUp className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg bg-white shadow-lg border border-border/40"
                side={isRTL ? "left" : "right"}
                align="end"
                sideOffset={4}
              >
                <DropdownMenuItem className={`gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <User2 className="h-4 w-4" />
                  <span>{t('navigation.account')}</span>
                </DropdownMenuItem>
                <DropdownMenuItem className={`gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <Settings className="h-4 w-4" />
                  <span>{t('navigation.settings')}</span>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className={`gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 ${isRTL ? 'flex-row-reverse' : ''}`}
                  onClick={handleSignOut}
                >
                  <span>{t('navigation.signOut')}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
