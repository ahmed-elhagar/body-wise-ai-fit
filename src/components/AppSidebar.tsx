
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
  ChevronRight,
  Menu
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
    <Sidebar collapsible="icon" className="border-r border-gray-200 bg-white">
      <SidebarHeader className="border-b border-gray-100 p-4">
        <div className="flex items-center justify-between">
          <Link 
            to="/dashboard" 
            className="flex items-center space-x-3 hover:bg-gray-50 rounded-lg p-2 transition-colors group-data-[collapsible=icon]:justify-center"
          >
            <Avatar className="h-10 w-10 bg-gradient-to-br from-blue-600 to-purple-600">
              <AvatarFallback className="bg-gradient-to-br from-blue-600 to-purple-600 text-white font-bold">
                FT
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col group-data-[collapsible=icon]:hidden">
              <span className="font-bold text-gray-900">{t('navigation.appName')}</span>
              <span className="text-xs text-gray-500">Fitness Tracker</span>
            </div>
          </Link>
          <div className="hidden lg:block">
            <SidebarTrigger className="h-8 w-8 hover:bg-gray-100" />
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2 py-4">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 mb-2 group-data-[collapsible=icon]:hidden">
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
                      tooltip={item.title}
                      className={`
                        relative w-full justify-start px-3 py-2.5 rounded-lg transition-all duration-200
                        ${isActive 
                          ? 'bg-blue-50 text-blue-700 shadow-sm border border-blue-200' 
                          : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                        }
                      `}
                    >
                      <Link to={item.url} className="flex items-center space-x-3">
                        <item.icon className={`h-5 w-5 ${isActive ? 'text-blue-600' : 'text-gray-500'}`} />
                        <span className="font-medium group-data-[collapsible=icon]:hidden">{item.title}</span>
                        {isActive && (
                          <div className="absolute right-2 w-2 h-2 bg-blue-600 rounded-full group-data-[collapsible=icon]:hidden"></div>
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
          <SidebarGroup className="mt-6">
            <SidebarGroupLabel className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 mb-2 group-data-[collapsible=icon]:hidden">
              Admin
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="space-y-1">
                {isAdmin && (
                  <SidebarMenuItem>
                    <SidebarMenuButton 
                      asChild 
                      tooltip="Admin Panel"
                      className={`
                        w-full justify-start px-3 py-2.5 rounded-lg transition-all duration-200
                        ${location.pathname === "/admin" 
                          ? 'bg-purple-50 text-purple-700 shadow-sm border border-purple-200' 
                          : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                        }
                      `}
                    >
                      <Link to="/admin" className="flex items-center space-x-3">
                        <Shield className={`h-5 w-5 ${location.pathname === "/admin" ? 'text-purple-600' : 'text-gray-500'}`} />
                        <span className="font-medium group-data-[collapsible=icon]:hidden">Admin Panel</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )}
                {isCoach && (
                  <SidebarMenuItem>
                    <SidebarMenuButton 
                      asChild 
                      tooltip="Coach Panel"
                      className={`
                        w-full justify-start px-3 py-2.5 rounded-lg transition-all duration-200
                        ${location.pathname === "/coach" 
                          ? 'bg-green-50 text-green-700 shadow-sm border border-green-200' 
                          : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                        }
                      `}
                    >
                      <Link to="/coach" className="flex items-center space-x-3">
                        <MessageCircle className={`h-5 w-5 ${location.pathname === "/coach" ? 'text-green-600' : 'text-gray-500'}`} />
                        <span className="font-medium group-data-[collapsible=icon]:hidden">Coach Panel</span>
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
            <div className="flex items-center space-x-3 p-2 rounded-lg bg-gray-50 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:space-x-0">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-gray-300 text-gray-700 text-xs">
                  {user.email?.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0 group-data-[collapsible=icon]:hidden">
                <p className="text-sm font-medium text-gray-900 truncate">{user.email}</p>
                <Badge variant="secondary" className="mt-1 text-xs">
                  {isAdmin ? 'Admin' : isCoach ? 'Coach' : 'User'}
                </Badge>
              </div>
            </div>
            <Link to="/auth?logout=true" className="w-full">
              <Button variant="ghost" size="sm" className="w-full justify-start text-gray-600 hover:text-red-600 hover:bg-red-50 group-data-[collapsible=icon]:justify-center">
                <LogOut className="h-4 w-4 group-data-[collapsible=icon]:mr-0 mr-2" />
                <span className="group-data-[collapsible=icon]:hidden">{t('navigation.signOut')}</span>
              </Button>
            </Link>
          </div>
        ) : (
          <Link to="/auth" className="w-full">
            <Button variant="default" className="w-full bg-blue-600 hover:bg-blue-700 group-data-[collapsible=icon]:px-2">
              <span className="group-data-[collapsible=icon]:hidden">{t('navigation.signIn')}</span>
              <span className="group-data-[collapsible=icon]:block hidden">Sign In</span>
            </Button>
          </Link>
        )}
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
};

export default AppSidebar;
