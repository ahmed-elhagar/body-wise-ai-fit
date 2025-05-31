
import React from "react";
import {
  LayoutDashboard,
  UtensilsCrossed,
  Apple,
  Dumbbell,
  Target,
  User,
  Users,
  Settings,
  ShieldCheck,
  LogOut,
  Crown,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  Sidebar, 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton, 
  SidebarContent, 
  SidebarGroup, 
  SidebarGroupLabel,
  SidebarHeader,
  SidebarFooter 
} from "./ui/sidebar";
import { useAuth } from "@/hooks/useAuth";
import { useI18n } from "@/hooks/useI18n";
import { cn } from "@/lib/utils";
import { useAdmin } from "@/hooks/useAdmin";
import { useCoach } from "@/hooks/useCoach";
import { useUnreadComments } from "@/hooks/useUnreadComments";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import LanguageToggle from "./LanguageToggle";
import { toast } from "sonner";

interface NavigationItem {
  href: string;
  icon: React.ComponentType<any>;
  label: string;
  hasNotification?: boolean;
}

const AppSidebar = () => {
  const { t, tFrom, isRTL } = useI18n();
  const tNav = tFrom('navigation');
  const location = useLocation();
  const navigate = useNavigate();
  const { hasUnreadComments } = useUnreadComments();
  const { user, signOut } = useAuth();
  const { isAdmin } = useAdmin();
  const { trainees } = useCoach();
  
  // Check if user is a coach (has trainees)
  const isCoach = trainees && trainees.length > 0;

  const navigationItems: NavigationItem[] = [
    { href: "/dashboard", icon: LayoutDashboard, label: String(tNav("dashboard")) },
    { href: "/meal-plan", icon: UtensilsCrossed, label: String(tNav("mealPlan")) },
    { 
      href: "/food-tracker", 
      icon: Apple, 
      label: String(tNav("foodTracker")),
      hasNotification: hasUnreadComments 
    },
    { href: "/exercise", icon: Dumbbell, label: String(tNav("exercise")) },
    { href: "/goals", icon: Target, label: String(tNav("goals")) },
    { href: "/profile", icon: User, label: String(tNav("profile")) },
  ];

  const coachItems: NavigationItem[] = [
    { href: "/coach/trainees", icon: Users, label: String(tNav("trainees")) },
    { href: "/coach/settings", icon: Settings, label: String(tNav("coachSettings")) },
  ];

  const adminItems: NavigationItem[] = [
    { href: "/admin/dashboard", icon: ShieldCheck, label: String(tNav("adminDashboard")) },
  ];

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success(String(t('common:success')));
      navigate("/auth");
    } catch (error) {
      toast.error(String(t('common:error')));
    }
  };

  const renderNavItem = (item: NavigationItem, isActive: boolean) => (
    <SidebarMenuItem key={item.href}>
      <SidebarMenuButton
        asChild
        isActive={isActive}
        className={cn(
          "w-full text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors relative",
          isActive && "bg-blue-50 text-blue-600 border-r-2 border-blue-600",
          isRTL && "text-right",
          isRTL && isActive && "border-r-0 border-l-2 border-blue-600"
        )}
        data-sidebar="menu-button"
      >
        <Link 
          to={item.href} 
          className={cn(
            "flex items-center gap-3 px-3 py-2 relative w-full",
            isRTL && "flex-row-reverse"
          )} 
          data-sidebar="menu-item"
        >
          <item.icon className="h-5 w-5 flex-shrink-0" />
          <span className="font-medium truncate">{item.label}</span>
          {item.hasNotification && (
            <div className={cn(
              "absolute w-2 h-2 bg-red-500 rounded-full",
              isRTL ? "top-1 left-1" : "top-1 right-1"
            )}></div>
          )}
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );

  const getUserInitials = () => {
    if (!user?.email) return "U";
    return user.email.charAt(0).toUpperCase();
  };

  const getUserDisplayName = () => {
    if (user?.user_metadata?.first_name) {
      return `${user.user_metadata.first_name} ${user.user_metadata.last_name || ''}`.trim();
    }
    return user?.email?.split('@')[0] || 'User';
  };

  return (
    <Sidebar 
      className={cn(
        "border-r border-gray-200 bg-white",
        isRTL && "border-r-0 border-l border-gray-200"
      )} 
      side={isRTL ? "right" : "left"}
      data-sidebar="sidebar"
    >
      {/* Header */}
      <SidebarHeader className="p-6 border-b border-gray-200 bg-gradient-to-br from-blue-50 to-indigo-50" data-sidebar="header">
        <div className={cn(
          "flex items-center gap-3 mb-4",
          isRTL && "flex-row-reverse"
        )}>
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
            <Dumbbell className="w-5 h-5 text-white" />
          </div>
          <div className={isRTL ? "text-right" : ""}>
            <h2 className="font-bold text-xl text-gray-900">{String(t('common:appName'))}</h2>
            <p className="text-sm text-gray-600 font-medium">{String(t('common:aiPoweredFitness'))}</p>
          </div>
        </div>

        {/* User Info */}
        {user && (
          <div className={cn(
            "flex items-center gap-3 p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-white/50 shadow-sm",
            isRTL && "flex-row-reverse"
          )}>
            <Avatar className="w-10 h-10 ring-2 ring-blue-100">
              <AvatarImage src={user.user_metadata?.avatar_url} />
              <AvatarFallback className="bg-gradient-to-br from-blue-600 to-purple-600 text-white font-semibold">
                {getUserInitials()}
              </AvatarFallback>
            </Avatar>
            <div className={cn(
              "flex-1 min-w-0",
              isRTL && "text-right"
            )}>
              <p className="font-semibold text-gray-900 truncate text-sm">
                {getUserDisplayName()}
              </p>
              <p className="text-gray-500 truncate text-xs">{user.email}</p>
            </div>
          </div>
        )}
      </SidebarHeader>

      <SidebarContent className="p-0 bg-white" data-sidebar="content">
        {/* Main Navigation */}
        <SidebarGroup className="px-4 py-6">
          <SidebarMenu className="space-y-2">
            {navigationItems.map((item) => {
              const isActive = location.pathname === item.href || 
                             (item.href === "/dashboard" && location.pathname === "/");
              return renderNavItem(item, isActive);
            })}
          </SidebarMenu>
        </SidebarGroup>

        {/* Coach Panel */}
        {isCoach && (
          <SidebarGroup className="px-4 py-2">
            <SidebarGroupLabel className={cn(
              "text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2 px-2",
              isRTL && "flex-row-reverse text-right"
            )} data-sidebar="group-label">
              <Users className="w-4 h-4" />
              {String(tNav("coachPanel"))}
            </SidebarGroupLabel>
            <SidebarMenu className="space-y-1">
              {coachItems.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      className={cn(
                        "w-full text-gray-600 hover:text-gray-900 hover:bg-green-50 transition-colors",
                        isActive && "bg-green-50 text-green-700 border-r-2 border-green-600",
                        isRTL && "text-right",
                        isRTL && isActive && "border-r-0 border-l-2 border-green-600"
                      )}
                      data-sidebar="menu-button"
                    >
                      <Link 
                        to={item.href} 
                        className={cn(
                          "flex items-center gap-3 px-3 py-2 w-full",
                          isRTL && "flex-row-reverse"
                        )} 
                        data-sidebar="menu-item"
                      >
                        <item.icon className="h-5 w-5 flex-shrink-0" />
                        <span className="font-medium truncate">{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroup>
        )}

        {/* Admin Panel */}
        {isAdmin && (
          <SidebarGroup className="px-4 py-2">
            <SidebarGroupLabel className={cn(
              "text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2 px-2",
              isRTL && "flex-row-reverse text-right"
            )} data-sidebar="group-label">
              <Crown className="w-4 h-4" />
              {String(tNav("admin"))}
            </SidebarGroupLabel>
            <SidebarMenu className="space-y-1">
              {adminItems.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      className={cn(
                        "w-full text-gray-600 hover:text-gray-900 hover:bg-purple-50 transition-colors",
                        isActive && "bg-purple-50 text-purple-700 border-r-2 border-purple-600",
                        isRTL && "text-right",
                        isRTL && isActive && "border-r-0 border-l-2 border-purple-600"
                      )}
                      data-sidebar="menu-button"
                    >
                      <Link 
                        to={item.href} 
                        className={cn(
                          "flex items-center gap-3 px-3 py-2 w-full",
                          isRTL && "flex-row-reverse"
                        )} 
                        data-sidebar="menu-item"
                      >
                        <item.icon className="h-5 w-5 flex-shrink-0" />
                        <span className="font-medium truncate">{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroup>
        )}
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter className="p-4 border-t border-gray-200 bg-gray-50/50" data-sidebar="footer">
        {/* Language Toggle */}
        <div className="mb-3">
          <LanguageToggle />
        </div>

        {/* Logout Button */}
        <Button
          onClick={handleSignOut}
          variant="ghost"
          className={cn(
            "w-full text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors font-medium",
            isRTL && "flex-row-reverse"
          )}
        >
          <LogOut className={cn("h-4 w-4", isRTL ? "ml-2" : "mr-2")} />
          <span>{String(tNav("logout"))}</span>
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
