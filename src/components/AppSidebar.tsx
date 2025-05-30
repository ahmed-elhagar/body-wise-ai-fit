
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
  User, 
  Settings, 
  LogOut, 
  Apple,
  Shield,
  MessageCircle,
  Scale,
  Star,
  Calculator
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
      title: "Weight Tracking",
      url: "/weight-tracking",
      icon: Scale,
    },
    {
      title: t('navigation.progress'),
      url: "/progress",
      icon: TrendingUp,
    },
    {
      title: t('navigation.profile'),
      url: "/profile",
      icon: User,
    },
  ];

  const { isAdmin, isCoach } = useRole();

  return (
    <Sidebar className="md:w-64">
      <SidebarTrigger className="fixed top-2 left-2 z-50 md:hidden" />
      <SidebarContent>
        <SidebarHeader>
          <Link to="/dashboard" className="flex items-center space-x-3">
            <Avatar className="h-9 w-9">
              <AvatarFallback>FT</AvatarFallback>
            </Avatar>
            <span className="font-bold">{t('navigation.appName')}</span>
          </Link>
        </SidebarHeader>
        <SidebarMenu>
          <SidebarGroup>
            <SidebarGroupLabel>{t('navigation.menu')}</SidebarGroupLabel>
            <SidebarGroupContent>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={location.pathname === item.url}>
                    <Link to={item.url} className="flex items-center space-x-2">
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarGroupContent>
          </SidebarGroup>
          {(isAdmin || isCoach) && (
            <SidebarGroup>
              <SidebarGroupLabel>Admin</SidebarGroupLabel>
              <SidebarGroupContent>
                {isAdmin && (
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={location.pathname === "/admin"}>
                      <Link to="/admin" className="flex items-center space-x-2">
                        <Shield className="h-4 w-4" />
                        <span>Admin Panel</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )}
                {isCoach && (
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={location.pathname === "/coach"}>
                      <Link to="/coach" className="flex items-center space-x-2">
                        <MessageCircle className="h-4 w-4" />
                        <span>Coach Panel</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )}
              </SidebarGroupContent>
            </SidebarGroup>
          )}
        </SidebarMenu>
        <SidebarFooter>
          {user ? (
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium">{user.email}</p>
                <Badge variant="secondary">
                  {isAdmin ? 'Admin' : isCoach ? 'Coach' : 'User'}
                </Badge>
              </div>
              <Link to="/auth?logout=true">
                <Button variant="ghost" size="sm">
                  <LogOut className="mr-2 h-4 w-4" />
                  {t('navigation.signOut')}
                </Button>
              </Link>
            </div>
          ) : (
            <Link to="/auth">
              <Button variant="secondary">{t('navigation.signIn')}</Button>
            </Link>
          )}
        </SidebarFooter>
      </SidebarContent>
      <SidebarRail>
        <SidebarTrigger />
        <SidebarMenuButton />
        <SidebarMenu>
          {navigationItems.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild isActive={location.pathname === item.url}>
                <Link to={item.url}>
                  <item.icon className="h-4 w-4" />
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarRail>
    </Sidebar>
  );
};

export default AppSidebar;
