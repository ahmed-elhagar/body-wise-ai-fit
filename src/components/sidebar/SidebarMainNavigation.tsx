
import React from "react";
import { 
  Home, 
  Calendar, 
  Dumbbell, 
  Target, 
  ShoppingCart,
  Camera,
  MessageSquare,
  Bell,
  TrendingUp,
  Scale,
  Users,
  User,
  BarChart3
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
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
import { useRole } from "@/hooks/useRole";
import { cn } from "@/lib/utils";

interface NavigationItem {
  href: string;
  icon: React.ComponentType<any>;
  label: string;
  badge?: string;
  requiresCoach?: boolean;
}

export const SidebarMainNavigation = () => {
  const { isRTL } = useI18n();
  const location = useLocation();
  const { isCoach, isAdmin } = useRole();
  const { state, isMobile } = useSidebar();
  const isCollapsed = state === "collapsed" && !isMobile;

  // Main Navigation Items
  const mainNavigationItems: NavigationItem[] = [
    { href: "/dashboard", icon: Home, label: "Dashboard" },
  ];

  // Fitness & Nutrition Items
  const fitnessNavigationItems: NavigationItem[] = [
    { href: "/meal-plan", icon: Calendar, label: "Meal Plan" },
    { href: "/food-tracker", icon: ShoppingCart, label: "Food Tracker" },
    { href: "/calorie-checker", icon: Camera, label: "Calorie Checker" },
    { href: "/exercise", icon: Dumbbell, label: "Exercise" },
    { href: "/weight-tracking", icon: Scale, label: "Weight Tracking" },
  ];

  // Progress & Goals Items
  const progressNavigationItems: NavigationItem[] = [
    { href: "/goals", icon: Target, label: "Goals" },
    { href: "/progress", icon: TrendingUp, label: "Progress" },
    { href: "/analytics", icon: BarChart3, label: "Analytics" },
  ];

  // Communication & Settings Items - Fixed broken routes
  const communicationNavigationItems: NavigationItem[] = [
    { href: "/chat", icon: MessageSquare, label: "AI Chat" }, // Fixed: was /ai-chat
    { href: "/notifications", icon: Bell, label: "Notifications" },
    { href: "/coach", icon: Users, label: "Coach Dashboard", requiresCoach: true },
    { href: "/profile", icon: User, label: "Profile" },
  ];

  const renderNavigationSection = (items: NavigationItem[], title: string) => {
    const filteredItems = items.filter(item => 
      !item.requiresCoach || isCoach || isAdmin
    );

    if (filteredItems.length === 0) return null;

    return (
      <SidebarGroup>
        {!isCollapsed && (
          <SidebarGroupLabel className={cn(
            "text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-3",
            isRTL && "text-right"
          )}>
            {title}
          </SidebarGroupLabel>
        )}
        
        <SidebarGroupContent>
          <SidebarMenu className={cn("space-y-1", isCollapsed ? "px-1" : "px-2")}>
            {filteredItems.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive}
                    tooltip={isCollapsed ? item.label : undefined}
                    className={cn(
                      "w-full text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-colors rounded-lg",
                      isActive && "bg-blue-50 text-blue-700 border-r-2 border-blue-600 shadow-sm",
                      isRTL && "text-right",
                      isRTL && isActive && "border-r-0 border-l-2 border-blue-600",
                      isCollapsed && "justify-center p-2"
                    )}
                  >
                    <Link 
                      to={item.href} 
                      className={cn(
                        "flex items-center w-full",
                        isCollapsed ? "justify-center" : "gap-3 px-3 py-2",
                        isRTL && !isCollapsed && "flex-row-reverse"
                      )}
                    >
                      <item.icon className={cn(
                        "flex-shrink-0",
                        isCollapsed ? "h-5 w-5" : "h-5 w-5"
                      )} />
                      {!isCollapsed && (
                        <>
                          <span className="font-medium truncate">{item.label}</span>
                          {item.badge && (
                            <span className="ml-auto text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                              {item.badge}
                            </span>
                          )}
                        </>
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

  return (
    <div className="space-y-4">
      {renderNavigationSection(mainNavigationItems, "Dashboard")}
      {renderNavigationSection(fitnessNavigationItems, "Fitness & Nutrition")}
      {renderNavigationSection(progressNavigationItems, "Progress & Goals")}
      {renderNavigationSection(communicationNavigationItems, "Communication")}
    </div>
  );
};

export default SidebarMainNavigation;
