
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
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Sidebar, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarContent, SidebarGroup, SidebarGroupLabel } from "./ui/sidebar";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";
import { useAdmin } from "@/hooks/useAdmin";
import { useCoach } from "@/hooks/useCoach";
import { useUnreadComments } from "@/hooks/useUnreadComments";

interface NavigationItem {
  href: string;
  icon: React.ComponentType<any>;
  label: string;
  hasNotification?: boolean;
}

const AppSidebar = () => {
  const { t, isRTL } = useLanguage();
  const location = useLocation();
  const { hasUnreadComments } = useUnreadComments();

  const { user } = useAuth();
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
    { href: "/coach/settings", icon: Settings, label: t("Settings") },
  ];

  const adminItems: NavigationItem[] = [
    { href: "/admin/dashboard", icon: ShieldCheck, label: t("Admin Dashboard") },
  ];

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

  return (
    <Sidebar className="border-r border-gray-200">
      <SidebarContent className="p-0">
        <SidebarGroup className="px-3 py-4">
          <SidebarMenu className="space-y-1">
            {navigationItems.map((item) => {
              const isActive = location.pathname === item.href || 
                             (item.href === "/dashboard" && location.pathname === "/");
              return renderNavItem(item, isActive);
            })}
          </SidebarMenu>
        </SidebarGroup>

        {isCoach && (
          <SidebarGroup className="px-3 py-2">
            <SidebarGroupLabel className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
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
                        isActive && "bg-blue-50 text-blue-600 border-r-2 border-blue-600",
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

        {isAdmin && (
          <SidebarGroup className="px-3 py-2">
            <SidebarGroupLabel className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
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
                        isActive && "bg-blue-50 text-blue-600 border-r-2 border-blue-600",
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
    </Sidebar>
  );
};

export default AppSidebar;
