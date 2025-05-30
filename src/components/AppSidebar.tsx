
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
import { Link, useNavigate, useLocation } from "react-router-dom"

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
  const location = useLocation()
  const { t, isRTL } = useLanguage()

  const handleSignOut = async () => {
    try {
      await signOut()
      navigate("/")
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  const isActive = (url: string) => {
    return location.pathname === url
  }

  return (
    <Sidebar 
      variant="inset" 
      className={`border-slate-200 bg-gradient-to-b from-slate-50 to-white ${
        isRTL ? 'border-l' : 'border-r'
      }`}
      side={isRTL ? "right" : "left"}
    >
      <SidebarHeader className="h-16 border-b border-slate-200 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className={`flex items-center gap-3 px-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
            <Activity className="h-6 w-6 text-white" />
          </div>
          <span className="font-bold text-xl text-white">
            FitFatta
          </span>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="py-4">
        <SidebarGroup>
          <SidebarGroupLabel className={`text-slate-600 font-semibold text-sm uppercase tracking-wide mb-2 ${isRTL ? 'text-right' : ''}`}>
            {t('navigation.menu')}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {items.map((item) => {
                const active = isActive(item.url)
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link 
                        to={item.url} 
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                          isRTL ? 'flex-row-reverse text-right' : ''
                        } ${
                          active 
                            ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md' 
                            : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                        }`}
                      >
                        <item.icon className={`h-5 w-5 ${active ? 'text-white' : 'text-slate-500'}`} />
                        <span className={`font-medium ${active ? 'text-white' : ''}`}>
                          {t(`navigation.${item.title}`)}
                        </span>
                        {active && (
                          <div className={`w-2 h-2 bg-white rounded-full ${isRTL ? 'mr-auto' : 'ml-auto'}`} />
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="border-t border-slate-200 bg-slate-50/50">
        <div className="px-3 py-3 border-b border-slate-200">
          <LanguageToggle />
        </div>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className={`data-[state=open]:bg-slate-100 data-[state=open]:text-slate-900 hover:bg-slate-100 p-3 ${isRTL ? 'flex-row-reverse' : ''}`}
                >
                  <div className={`flex items-center gap-3 flex-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                      <User2 className="h-4 w-4 text-white" />
                    </div>
                    <div className={`grid flex-1 text-sm leading-tight ${isRTL ? 'text-right' : 'text-left'}`}>
                      <span className="truncate font-semibold text-slate-900">{user?.email}</span>
                      <span className="truncate text-xs text-slate-500">{t('navigation.account')}</span>
                    </div>
                  </div>
                  <ChevronUp className={`size-4 text-slate-400 ${isRTL ? 'mr-auto' : 'ml-auto'}`} />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg bg-white shadow-xl border border-slate-200"
                side={isRTL ? "left" : "right"}
                align="end"
                sideOffset={4}
              >
                <DropdownMenuItem className={`gap-2 py-2.5 text-slate-700 hover:bg-slate-50 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <User2 className="h-4 w-4 text-slate-500" />
                  <span>{t('navigation.account')}</span>
                </DropdownMenuItem>
                <DropdownMenuItem className={`gap-2 py-2.5 text-slate-700 hover:bg-slate-50 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <Settings className="h-4 w-4 text-slate-500" />
                  <span>{t('navigation.settings')}</span>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className={`gap-2 py-2.5 text-red-600 hover:text-red-700 hover:bg-red-50 ${isRTL ? 'flex-row-reverse' : ''}`}
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
