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
import { Sidebar, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "./ui/sidebar";
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

  const navigationItems = [
    { href: "/", icon: LayoutDashboard, label: t("Dashboard") },
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

  const coachItems = [
    { href: "/coach/trainees", icon: Users, label: t("Trainees") },
    { href: "/coach/settings", icon: Settings, label: t("Settings") },
  ];

  const adminItems = [
    { href: "/admin/dashboard", icon: ShieldCheck, label: t("Admin Dashboard") },
  ];

  const renderNavItem = (item: NavigationItem, isActive: boolean) => (
    <SidebarMenuButton
      key={item.href}
      asChild
      isActive={isActive}
      className={cn(
        "w-full justify-start text-gray-600 hover:text-gray-900 hover:bg-gray-100",
        isActive && "bg-blue-50 text-blue-600 border-r-2 border-blue-600"
      )}
    >
      <Link to={item.href} className="flex items-center gap-3 px-3 py-2 relative">
        <item.icon className="h-5 w-5" />
        <span className="font-medium">{item.label}</span>
        {item.hasNotification && (
          <div className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></div>
        )}
      </Link>
    </SidebarMenuButton>
  );

  return (
    <Sidebar>
      <SidebarMenu>
        {navigationItems.map((item) => {
          const isActive = location.pathname === item.href;
          return renderNavItem(item, isActive);
        })}
      </SidebarMenu>

      {isCoach && (
        <>
          <SidebarMenuItem>{t("Coach Panel")}</SidebarMenuItem>
          <SidebarMenu>
            {coachItems.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <SidebarMenuButton
                  key={item.href}
                  asChild
                  isActive={isActive}
                  className={cn(
                    "w-full justify-start text-gray-600 hover:text-gray-900 hover:bg-gray-100",
                    isActive && "bg-blue-50 text-blue-600 border-r-2 border-blue-600"
                  )}
                >
                  <Link to={item.href} className="flex items-center gap-3 px-3 py-2">
                    <item.icon className="h-5 w-5" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              );
            })}
          </SidebarMenu>
        </>
      )}

      {isAdmin && (
        <>
          <SidebarMenuItem>{t("Admin")}</SidebarMenuItem>
          <SidebarMenu>
            {adminItems.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <SidebarMenuButton
                  key={item.href}
                  asChild
                  isActive={isActive}
                  className={cn(
                    "w-full justify-start text-gray-600 hover:text-gray-900 hover:bg-gray-100",
                    isActive && "bg-blue-50 text-blue-600 border-r-2 border-blue-600"
                  )}
                >
                  <Link to={item.href} className="flex items-center gap-3 px-3 py-2">
                    <item.icon className="h-5 w-5" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              );
            })}
          </SidebarMenu>
        </>
      )}
    </Sidebar>
  );
};

export default AppSidebar;
