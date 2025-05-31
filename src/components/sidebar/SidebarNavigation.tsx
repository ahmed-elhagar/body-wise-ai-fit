
import React from "react";
import { 
  Home, 
  Calendar, 
  Dumbbell, 
  Target, 
  User, 
  Users,
  Settings,
  ShoppingCart,
  Camera,
  MessageSquare
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

  const navigationItems: NavigationItem[] = [
    { href: "/dashboard", icon: Home, label: String(tNav("dashboard")) },
    { href: "/meal-plan", icon: Calendar, label: String(tNav("mealPlan")) },
    { href: "/exercise", icon: Dumbbell, label: String(tNav("exercise")) },
    { href: "/food-tracker", icon: ShoppingCart, label: String(tNav("foodTracker")) },
    { href: "/calorie-checker", icon: Camera, label: String(tNav("calorieChecker")) },
    { href: "/progress", icon: Target, label: String(tNav("progress")) },
    { href: "/ai-chat", icon: MessageSquare, label: String(tNav("aiChat")) },
    { href: "/coach", icon: Users, label: String(tNav("coach")), requiresCoach: true },
    { href: "/profile", icon: User, label: String(tNav("profile")) },
  ];

  const filteredItems = navigationItems.filter(item => 
    !item.requiresCoach || isCoach
  );

  return (
    <SidebarGroup className="px-2">
      <SidebarGroupLabel className={cn(
        "text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-2",
        isRTL && "text-right"
      )}>
        {String(tNav("navigation"))}
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
