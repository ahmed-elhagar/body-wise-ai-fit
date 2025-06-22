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
  User,
  Camera,
  Scale,
  Settings,
  LucideIcon
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
import { useI18n } from "@/shared/hooks/useI18n";
import { cn } from "@/lib/utils";

interface NavigationItem {
  href: string;
  icon: LucideIcon;
  label: string;
  category: 'main' | 'fitness' | 'progress' | 'account';
}

export const SidebarMainNavigation = () => {
  const { t, isRTL } = useI18n();
  const location = useLocation();
  const { state, isMobile } = useSidebar();
  const isCollapsed = state === "collapsed" && !isMobile;

  const navigationItems: NavigationItem[] = [
    // Main
    { href: "/dashboard", icon: Home, label: "Dashboard", category: 'main' },
    
    // Fitness & Nutrition
    { href: "/meal-plan", icon: Utensils, label: "Meal Plan", category: 'fitness' },
    { href: "/food-tracker", icon: Calendar, label: "Food Tracker", category: 'fitness' },
    { href: "/exercise", icon: Dumbbell, label: "Exercise", category: 'fitness' },
    { href: "/weight-tracking", icon: Scale, label: "Weight Tracking", category: 'fitness' },
    
    // Progress & Goals
    { href: "/goals", icon: Target, label: "Goals", category: 'progress' },
    { href: "/progress", icon: BarChart3, label: "Progress", category: 'progress' },
    { href: "/chat", icon: MessageSquare, label: "AI Chat", category: 'progress' },
    
    // Account
    { href: "/profile", icon: User, label: "Profile", category: 'account' },
    { href: "/settings", icon: Settings, label: "Settings", category: 'account' },
  ];

  const groupedItems = navigationItems.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, NavigationItem[]>);

  const categoryLabels = {
    main: "Dashboard",
    fitness: "Fitness & Nutrition", 
    progress: "Progress & Goals",
    account: "Account"
  };

  const renderNavigationGroup = (category: string, items: NavigationItem[]) => (
    <SidebarGroup key={category}>
      {!isCollapsed && (
        <SidebarGroupLabel className={cn(
          "text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-3",
          isRTL && "text-right font-arabic"
        )}>
          {categoryLabels[category as keyof typeof categoryLabels]}
        </SidebarGroupLabel>
      )}
      
      <SidebarGroupContent>
        <SidebarMenu className={cn("space-y-1", isCollapsed ? "px-1" : "px-2")}>
          {items.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  isActive={isActive}
                  tooltip={isCollapsed ? item.label : undefined}
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
                        {item.label}
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

  return (
    <div className="space-y-2">
      {Object.entries(groupedItems).map(([category, items]) => 
        renderNavigationGroup(category, items)
      )}
    </div>
  );
};

export default SidebarMainNavigation;
