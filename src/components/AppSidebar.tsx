
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
import { useLanguage } from "@/contexts/LanguageContext";
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
  const { t, isRTL } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const { hasUnreadComments } = useUnreadComments();
  const { user, signOut } = useAuth();
  const { isAdmin } = useAdmin();
  const { trainees } = useCoach();
  const isCoach = trainees && trainees.length > 0;

  const navigationItems: NavigationItem[] = [
    { href: "/dashboard", icon: LayoutDashboard, label: t("Dashboard") },
    { href: "/meal-plan", icon: UtensilsCrossed, label: t("Meal Plan") },
    { 
      href: "/food-tracker", 
      icon: Apple, 
      label: t("Food Tracker"),
      hasNotification: hasUnreadComments 
    },
    { href: "/exercise", icon: Dumbbell, label: t("Exercise") },
    { href: "/goals", icon: Target, label: t("Goals") },
    { href: "/profile", icon: User, label: t("Profile") },
  ];

  const coachItems: NavigationItem[] = [
    { href: "/coach/trainees", icon: Users, label: t("Trainees") },
    { href: "/coach/settings", icon: Settings, label: t("Coach Settings") },
  ];

  const adminItems: NavigationItem[] = [
    { href: "/admin/dashboard", icon: ShieldCheck, label: t("Admin Dashboard") },
  ];

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success(t("Success"));
      navigate("/auth");
    } catch (error) {
      toast.error(t("Error"));
    }
  };

  const renderNavItem = (item: NavigationItem, isActive: boolean) => (
    <SidebarMenuItem key={item.href}>
      <SidebarMenuButton
        asChild
        isActive={isActive}
        className={cn(
          "w-full justify-start text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors",
          isActive && "bg-blue-50 text-blue-600 border-r-2 border-blue-600",
          isRTL && "flex-row-reverse"
        )}
      >
        <Link to={item.href} className="flex items-center gap-3 px-3 py-2 relative">
          <item.icon className="h-5 w-5 flex-shrink-0" />
          <span className="font-medium">{item.label}</span>
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
    <Sidebar className="border-r border-gray-200">
      {/* Header */}
      <SidebarHeader className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
            <Dumbbell className="w-4 h-4 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-lg text-gray-900">FitFatta</h2>
            <p className="text-xs text-gray-500">{t("nav.aiPoweredFitness")}</p>
          </div>
        </div>

        {/* User Info */}
        {user && (
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <Avatar className="w-8 h-8">
              <AvatarImage src={user.user_metadata?.avatar_url} />
              <AvatarFallback className="bg-blue-600 text-white text-sm">
                {getUserInitials()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm text-gray-900 truncate">
                {getUserDisplayName()}
              </p>
              <p className="text-xs text-gray-500 truncate">{user.email}</p>
            </div>
          </div>
        )}
      </SidebarHeader>

      <SidebarContent className="p-0">
        {/* Main Navigation */}
        <SidebarGroup className="px-3 py-4">
          <SidebarMenu className="space-y-1">
            {navigationItems.map((item) => {
              const isActive = location.pathname === item.href || 
                             (item.href === "/dashboard" && location.pathname === "/");
              return renderNavItem(item, isActive);
            })}
          </SidebarMenu>
        </SidebarGroup>

        {/* Coach Panel */}
        {isCoach && (
          <SidebarGroup className="px-3 py-2">
            <SidebarGroupLabel className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-2">
              <Users className="w-4 h-4" />
              {t("Coach Panel")}
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
                        "w-full justify-start text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors",
                        isActive && "bg-green-50 text-green-600 border-r-2 border-green-600",
                        isRTL && "flex-row-reverse"
                      )}
                    >
                      <Link to={item.href} className="flex items-center gap-3 px-3 py-2">
                        <item.icon className="h-5 w-5 flex-shrink-0" />
                        <span className="font-medium">{item.label}</span>
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
          <SidebarGroup className="px-3 py-2">
            <SidebarGroupLabel className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-2">
              <Crown className="w-4 h-4" />
              {t("Admin")}
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
                        "w-full justify-start text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors",
                        isActive && "bg-purple-50 text-purple-600 border-r-2 border-purple-600",
                        isRTL && "flex-row-reverse"
                      )}
                    >
                      <Link to={item.href} className="flex items-center gap-3 px-3 py-2">
                        <item.icon className="h-5 w-5 flex-shrink-0" />
                        <span className="font-medium">{item.label}</span>
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
      <SidebarFooter className="p-4 border-t border-gray-200">
        {/* Language Toggle */}
        <div className="mb-3">
          <LanguageToggle />
        </div>

        {/* Logout Button */}
        <Button
          onClick={handleSignOut}
          variant="ghost"
          className={cn(
            "w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors",
            isRTL && "flex-row-reverse"
          )}
        >
          <LogOut className="h-4 w-4 mr-2" />
          <span className="font-medium">{t("Logout")}</span>
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
