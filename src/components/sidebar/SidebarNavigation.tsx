
import React from "react";
import { Home, Utensils, Dumbbell, Target, User, TrendingUp, MessageCircle, Calculator } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton, 
  SidebarGroup,
  SidebarGroupLabel 
} from "@/components/ui/sidebar";
import { useI18n } from "@/hooks/useI18n";
import { cn } from "@/lib/utils";

interface NavigationItem {
  href: string;
  icon: React.ComponentType<any>;
  label: string;
}

export const SidebarNavigation = () => {
  const { tFrom, isRTL } = useI18n();
  const tNav = tFrom('navigation');
  const location = useLocation();

  const mainItems: NavigationItem[] = [
    { href: "/dashboard", icon: Home, label: String(tNav("dashboard")) },
    { href: "/meal-plan", icon: Utensils, label: String(tNav("mealPlan")) },
    { href: "/exercise", icon: Dumbbell, label: String(tNav("exercise")) },
    { href: "/goals", icon: Target, label: String(tNav("goals")) },
    { href: "/progress", icon: TrendingUp, label: String(tNav("progress")) },
    { href: "/profile", icon: User, label: String(tNav("profile")) },
  ];

  const toolItems: NavigationItem[] = [
    { href: "/calorie-checker", icon: Calculator, label: String(tNav("calorieChecker")) },
    { href: "/food-tracker", icon: Utensils, label: String(tNav("foodTracker")) },
    { href: "/weight-tracking", icon: TrendingUp, label: String(tNav("weightTracking")) },
    { href: "/ai-chat", icon: MessageCircle, label: String(tNav("aiChat")) },
  ];

  return (
    <>
      <SidebarGroup className="px-4 py-2">
        <SidebarGroupLabel className={cn(
          "text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 px-2",
          isRTL && "text-right"
        )}>
          {String(tNav("main"))}
        </SidebarGroupLabel>
        <SidebarMenu className="space-y-1">
          {mainItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  isActive={isActive}
                  className={cn(
                    "w-full text-gray-600 hover:text-gray-900 hover:bg-blue-50 transition-colors",
                    isActive && "bg-blue-50 text-blue-700 border-r-2 border-blue-600",
                    isRTL && "text-right",
                    isRTL && isActive && "border-r-0 border-l-2 border-blue-600"
                  )}
                >
                  <Link 
                    to={item.href} 
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 w-full",
                      isRTL && "flex-row-reverse"
                    )}
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

      <SidebarGroup className="px-4 py-2">
        <SidebarGroupLabel className={cn(
          "text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 px-2",
          isRTL && "text-right"
        )}>
          {String(tNav("tools"))}
        </SidebarGroupLabel>
        <SidebarMenu className="space-y-1">
          {toolItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  isActive={isActive}
                  className={cn(
                    "w-full text-gray-600 hover:text-gray-900 hover:bg-orange-50 transition-colors",
                    isActive && "bg-orange-50 text-orange-700 border-r-2 border-orange-600",
                    isRTL && "text-right",
                    isRTL && isActive && "border-r-0 border-l-2 border-orange-600"
                  )}
                >
                  <Link 
                    to={item.href} 
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 w-full",
                      isRTL && "flex-row-reverse"
                    )}
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
    </>
  );
};
