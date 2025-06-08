
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  Home, 
  Utensils, 
  Dumbbell, 
  BarChart3, 
  Target,
  MessageSquare,
  Calendar,
  User
} from "lucide-react";
import { 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton, 
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  useSidebar
} from "@/components/ui/sidebar";
import { useI18n } from "@/hooks/useI18n";
import { cn } from "@/lib/utils";

interface NavigationItem {
  href: string;
  icon: React.ComponentType<any>;
  labelKey: string;
}

export const SidebarMainNavigation = () => {
  const { t, isRTL } = useI18n();
  const location = useLocation();
  const { state, isMobile } = useSidebar();
  const isCollapsed = state === "collapsed" && !isMobile;

  const mainItems: NavigationItem[] = [
    { href: "/dashboard", icon: Home, labelKey: "navigation:dashboard" },
    { href: "/meal-plan", icon: Utensils, labelKey: "navigation:mealPlan" },
    { href: "/exercise", icon: Dumbbell, labelKey: "navigation:exercise" },
    { href: "/progress", icon: BarChart3, labelKey: "navigation:progress" },
    { href: "/goals", icon: Target, labelKey: "navigation:goals" },
    { href: "/food-tracker", icon: Calendar, labelKey: "navigation:foodTracker" },
    { href: "/chat", icon: MessageSquare, labelKey: "navigation:aiChat" },
  ];

  return (
    <SidebarGroup>
      {!isCollapsed && (
        <SidebarGroupLabel className={cn(
          "text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-3",
          isRTL && "text-right font-arabic"
        )}>
          {t("navigation:menu")}
        </SidebarGroupLabel>
      )}
      
      <SidebarGroupContent>
        <SidebarMenu className={cn("space-y-1", isCollapsed ? "px-1" : "px-2")}>
          {mainItems.map((item) => {
            const isActive = location.pathname === item.href;
            const label = t(item.labelKey);
            
            return (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  isActive={isActive}
                  tooltip={isCollapsed ? label : undefined}
                  className={cn(
                    "w-full text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-colors rounded-lg",
                    isActive && "bg-blue-50 text-blue-700 shadow-sm",
                    isActive && !isRTL && "border-r-2 border-blue-600",
                    isActive && isRTL && "border-l-2 border-blue-600",
                    isCollapsed && "justify-center p-2"
                  )}
                >
                  <Link 
                    to={item.href} 
                    className={cn(
                      "flex items-center w-full",
                      isCollapsed ? "justify-center" : "gap-3 px-3 py-2",
                      isRTL && !isCollapsed && "flex-row-reverse text-right"
                    )}
                  >
                    <item.icon className="h-5 w-5 flex-shrink-0" />
                    {!isCollapsed && (
                      <span className={cn("font-medium truncate", isRTL && "font-arabic")}>
                        {label}
                      </span>
                    )}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};

export default SidebarMainNavigation;
