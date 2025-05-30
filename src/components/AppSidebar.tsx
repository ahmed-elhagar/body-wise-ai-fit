
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { 
  Home, 
  UtensilsCrossed, 
  Dumbbell, 
  TrendingUp, 
  Target,
  User, 
  LogOut, 
  Apple,
  Shield,
  MessageCircle,
  Scale,
  Settings
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/contexts/LanguageContext";
import { useLocation, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useRole } from "@/hooks/useRole";

const AppSidebar = () => {
  const { t, isRTL } = useLanguage();
  const { user } = useAuth();
  const location = useLocation();
  const { isAdmin, isCoach } = useRole();

  const navigationItems = [
    {
      title: t('navigation.dashboard'),
      url: "/dashboard",
      icon: Home,
    },
    {
      title: t('navigation.mealPlan'),
      url: "/meal-plan",
      icon: UtensilsCrossed,
    },
    {
      title: t('Food Tracker'),
      url: "/food",
      icon: Apple,
    },
    {
      title: t('navigation.exercise'),
      url: "/exercise",
      icon: Dumbbell,
    },
    {
      title: t('navigation.progress'),
      url: "/progress",
      icon: TrendingUp,
    },
    {
      title: t('Goals'),
      url: "/goals",
      icon: Target,
    },
    {
      title: t('navigation.profile'),
      url: "/profile",
      icon: User,
    },
  ];

  return (
    <Sidebar className="border-r border-gray-200 bg-white shadow-sm">
      <SidebarTrigger className="fixed top-4 left-4 z-50 md:hidden bg-white shadow-md border border-gray-200" />
      
      <SidebarHeader className="border-b border-gray-100 p-4">
        <Link 
          to="/dashboard" 
          className="flex items-center space-x-3 hover:bg-gray-50 rounded-lg p-2 transition-colors group"
        >
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-gradient-to-br from-blue-600 to-purple-600 text-white font-bold">
              FT
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
              {t('navigation.appName')}
            </span>
            <span className="text-xs text-gray-500">Fitness Companion</span>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent className="px-3 py-4">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 mb-3">
            {t('navigation.menu')}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {navigationItems.map((item) => {
                const isActive = location.pathname === item.url || location.pathname.startsWith(item.url + '/');
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                      asChild 
                      isActive={isActive}
                      className={`
                        relative w-full justify-start px-3 py-3 rounded-xl transition-all duration-200 group
                        ${isActive 
                          ? 'bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 shadow-sm border border-blue-200/50' 
                          : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                        }
                      `}
                    >
                      <Link to={item.url} className="flex items-center space-x-3">
                        <div className={`
                          p-1.5 rounded-lg transition-colors
                          ${isActive 
                            ? 'bg-blue-100 text-blue-600' 
                            : 'text-gray-500 group-hover:bg-gray-100 group-hover:text-gray-700'
                          }
                        `}>
                          <item.icon className="h-4 w-4" />
                        </div>
                        <span className="font-medium">{item.title}</span>
                        {isActive && (
                          <div className="absolute right-3 w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {(isAdmin || isCoach) && (
          <SidebarGroup className="mt-8">
            <SidebarGroupLabel className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 mb-3">
              Administration
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="space-y-1">
                {isAdmin && (
                  <SidebarMenuItem>
                    <SidebarMenuButton 
                      asChild 
                      isActive={location.pathname === "/admin"}
                      className={`
                        w-full justify-start px-3 py-3 rounded-xl transition-all duration-200 group
                        ${location.pathname === "/admin" 
                          ? 'bg-gradient-to-r from-purple-50 to-pink-50 text-purple-700 shadow-sm border border-purple-200/50' 
                          : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                        }
                      `}
                    >
                      <Link to="/admin" className="flex items-center space-x-3">
                        <div className={`
                          p-1.5 rounded-lg transition-colors
                          ${location.pathname === "/admin" 
                            ? 'bg-purple-100 text-purple-600' 
                            : 'text-gray-500 group-hover:bg-gray-100 group-hover:text-gray-700'
                          }
                        `}>
                          <Shield className="h-4 w-4" />
                        </div>
                        <span className="font-medium">Admin Panel</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )}
                {isCoach && (
                  <SidebarMenuItem>
                    <SidebarMenuButton 
                      asChild 
                      isActive={location.pathname === "/coach"}
                      className={`
                        w-full justify-start px-3 py-3 rounded-xl transition-all duration-200 group
                        ${location.pathname === "/coach" 
                          ? 'bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 shadow-sm border border-green-200/50' 
                          : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                        }
                      `}
                    >
                      <Link to="/coach" className="flex items-center space-x-3">
                        <div className={`
                          p-1.5 rounded-lg transition-colors
                          ${location.pathname === "/coach" 
                            ? 'bg-green-100 text-green-600' 
                            : 'text-gray-500 group-hover:bg-gray-100 group-hover:text-gray-700'
                          }
                        `}>
                          <MessageCircle className="h-4 w-4" />
                        </div>
                        <span className="font-medium">Coach Panel</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter className="border-t border-gray-100 p-4">
        {user ? (
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-2 rounded-lg bg-gray-50">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-gray-300 text-gray-700 text-xs">
                  {user.email?.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{user.email}</p>
                <Badge variant="secondary" className="mt-1">
                  {isAdmin ? 'Admin' : isCoach ? 'Coach' : 'User'}
                </Badge>
              </div>
            </div>
            <Link to="/auth?logout=true" className="w-full">
              <Button variant="ghost" size="sm" className="w-full justify-start text-gray-600 hover:text-red-600 hover:bg-red-50">
                <LogOut className="mr-2 h-4 w-4" />
                {t('navigation.signOut')}
              </Button>
            </Link>
          </div>
        ) : (
          <Link to="/auth" className="w-full">
            <Button variant="default" className="w-full bg-blue-600 hover:bg-blue-700">
              {t('navigation.signIn')}
            </Button>
          </Link>
        )}
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
};

export default AppSidebar;
