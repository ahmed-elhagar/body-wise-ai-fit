
import { useLocation, useNavigate } from "react-router-dom";
import { useI18n } from "@/hooks/useI18n";
import { useSidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  UtensilsCrossed,
  Camera,
  Dumbbell,
  Target,
  User,
  BarChart3,
  Scale,
} from "lucide-react";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export const SidebarNavigation = () => {
  const { t, isRTL } = useI18n();
  const location = useLocation();
  const navigate = useNavigate();
  const { state } = useSidebar();
  const [isCollapsing, setIsCollapsing] = useState(false);

  useEffect(() => {
    if (state === "collapsed") {
      setIsCollapsing(true);
      const timer = setTimeout(() => setIsCollapsing(false), 300);
      return () => clearTimeout(timer);
    }
  }, [state]);

  const navigationItems = [
    { 
      title: t("Dashboard"), 
      icon: LayoutDashboard, 
      href: "/dashboard" 
    },
    { 
      title: t("Meal Plan"), 
      icon: UtensilsCrossed, 
      href: "/meal-plan" 
    },
    { 
      title: t("Food Tracker"), 
      icon: Camera, 
      href: "/food-tracker" 
    },
    { 
      title: t("Exercise"), 
      icon: Dumbbell, 
      href: "/exercise" 
    },
    { 
      title: t("Goals"), 
      icon: Target, 
      href: "/goals" 
    },
    { 
      title: t("Profile"), 
      icon: User, 
      href: "/profile" 
    },
    { 
      title: t("Progress"), 
      icon: BarChart3, 
      href: "/progress" 
    },
    { 
      title: t("Weight Tracking"), 
      icon: Scale, 
      href: "/weight-tracking" 
    },
  ];

  const handleNavigation = (href: string) => {
    navigate(href);
  };

  return (
    <SidebarMenu>
      {navigationItems.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.href;
        
        return (
          <SidebarMenuItem key={item.href}>
            <SidebarMenuButton
              onClick={() => handleNavigation(item.href)}
              className={cn(
                "nav-link-rtl w-full justify-start transition-all duration-200",
                isActive && "bg-primary/10 text-primary border-e-2 border-primary",
                !isActive && "hover:bg-muted/50",
                isRTL && isActive && "border-s-2 border-e-0"
              )}
              aria-label={item.title}
            >
              <Icon className={cn("w-5 h-5 icon-start", isActive && "text-primary")} />
              {state === "expanded" && !isCollapsing && (
                <span className={cn("font-medium", isActive && "text-primary")}>
                  {item.title}
                </span>
              )}
            </SidebarMenuButton>
          </SidebarMenuItem>
        );
      })}
    </SidebarMenu>
  );
};
