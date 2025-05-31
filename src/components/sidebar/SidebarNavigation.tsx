
import React from "react";
import { 
  Home, 
  Calendar, 
  Dumbbell, 
  Target, 
  User, 
  Users,
  ShoppingCart,
  Camera,
  MessageSquare,
  Bell,
  TrendingUp,
  Scale
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton, 
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent
} from "@/components/ui/sidebar";
import { useI18n } from "@/hooks/useI18n";
import { useCoach } from "@/hooks/useCoach";
import { cn } from "@/lib/utils";

interface NavigationItem {
  href: string;
  icon: React.ComponentType<any>;
  label: string;
  badge?: string;
  requiresCoach?: boolean;
}

export const SidebarNavigation = () => {
  const { tFrom, isRTL } = useI18n();
  const tNav = tFrom('navigation');
  const location = useLocation();
  const { isCoach } = useCoach();

  // Main Navigation Items
  const mainNavigationItems: NavigationItem[] = [
    { href: "/dashboard", icon: Home, label: String(tNav("dashboard")) },
  ];

  // Fitness & Nutrition Items
  const fitnessNavigationItems: NavigationItem[] = [
    { href: "/meal-plan", icon: Calendar, label: String(tNav("mealPlan")) },
    { href: "/food-tracker", icon: ShoppingCart, label: String(tNav("foodTracker")) },
    { href: "/calorie-checker", icon: Camera, label: String(tNav("calorieChecker")) },
    { href: "/exercise", icon: Dumbbell, label: String(tNav("exercise")) },
    { href: "/weight-tracking", icon: Scale, label: "Weight Tracking" },
  ];

  // Progress & Goals Items
  const progressNavigationItems: NavigationItem[] = [
    { href: "/goals", icon: Target, label: String(tNav("goals")) },
    { href: "/progress", icon: TrendingUp, label: String(tNav("progress")) },
  ];

  // Tools & Settings Items
  const toolsNavigationItems: NavigationItem[] = [
    { href: "/notifications", icon: Bell, label: "Notifications" },
    { href: "/ai-chat", icon: MessageSquare, label: String(tNav("aiChat")) },
    { href: "/coach", icon: Users, label: String(tNav("coach")), requiresCoach: true },
    { href: "/profile", icon: User, label: String(tNav("profile")) },
  ];

  const renderNavigationSection = (items: NavigationItem[], title: string) => {
    const filteredItems = items.filter(item => 
      !item.requiresCoach || isCoach
    );

    if (filteredItems.length === 0) return null;

    return (
      <SidebarGroup className="px-2">
        <SidebarGroupLabel className={cn(
          "text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-2",
          isRTL && "text-right"
        )}>
          {title}
        </SidebarGroupLabel>
        
        <SidebarGroupContent>
          <SidebarMenu className="space-y-1">
            {filteredItems.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive}
                    className={cn(
                      "w-full text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-colors rounded-lg",
                      isActive && "bg-blue-50 text-blue-700 border-r-2 border-blue-600 shadow-sm",
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
                      {item.badge && (
                        <span className="ml-auto text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                          {item.badge}
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

  return (
    <div className="space-y-4">
      {renderNavigationSection(mainNavigationItems, String(tNav("dashboard")))}
      {renderNavigationSection(fitnessNavigationItems, "Fitness & Nutrition")}
      {renderNavigationSection(progressNavigationItems, "Progress & Goals")}
      {renderNavigationSection(toolsNavigationItems, "Tools & Settings")}
    </div>
  );
};
