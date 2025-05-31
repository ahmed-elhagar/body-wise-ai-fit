
import React from "react";
import {
  LayoutDashboard,
  UtensilsCrossed,
  Apple,
  Dumbbell,
  Target,
  User,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton, 
  SidebarGroup 
} from "@/components/ui/sidebar";
import { useI18n } from "@/hooks/useI18n";
import { useUnreadComments } from "@/hooks/useUnreadComments";
import { cn } from "@/lib/utils";

interface NavigationItem {
  href: string;
  icon: React.ComponentType<any>;
  label: string;
  hasNotification?: boolean;
}

const SidebarNavigation = () => {
  const { tFrom, isRTL } = useI18n();
  const tNav = tFrom('navigation');
  const location = useLocation();
  const { hasUnreadComments } = useUnreadComments();

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

  return (
    <SidebarGroup className="px-4 py-6">
      <SidebarMenu className="space-y-2">
        {navigationItems.map((item) => {
          const isActive = location.pathname === item.href || 
                         (item.href === "/dashboard" && location.pathname === "/");
          return renderNavItem(item, isActive);
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
};

export default SidebarNavigation;
