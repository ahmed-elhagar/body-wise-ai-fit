
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { useRole } from "@/hooks/useRole";
import { useI18n } from "@/hooks/useI18n";
import { supabase } from "@/integrations/supabase/client";
import { useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  UtensilsCrossed,
  Camera,
  Dumbbell,
  Target,
  User,
  BarChart3,
  Scale,
  Settings,
  LogOut,
  Users,
  Shield,
  Sparkles,
  Menu,
  X
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";

export function AppSidebar() {
  const { user, signOut } = useAuth();
  const { profile, isLoading: profileLoading } = useProfile();
  const { isAdmin, isCoach } = useRole();
  const { t, isRTL } = useI18n();
  const location = useLocation();
  const navigate = useNavigate();
  const { state, toggleSidebar } = useSidebar();
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

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/auth');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const getUserInitials = (firstName?: string, lastName?: string, email?: string) => {
    if (firstName && lastName) {
      return `${firstName[0]}${lastName[0]}`.toUpperCase();
    }
    if (firstName) {
      return firstName.slice(0, 2).toUpperCase();
    }
    if (email) {
      return email.slice(0, 2).toUpperCase();
    }
    return 'U';
  };

  return (
    <Sidebar 
      className={cn(
        "sidebar-rtl bg-white border-border transition-all duration-300",
        isRTL && "border-s border-e-0"
      )}
      collapsible="icon"
    >
      <SidebarHeader className={cn("p-4 border-b", isRTL && "text-right")}>
        <div className={cn("flex items-center gap-3", isRTL && "flex-row-reverse")}>
          <div className="w-8 h-8 bg-fitness-gradient rounded-lg flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          {state === "expanded" && !isCollapsing && (
            <div className={cn("flex-1", isRTL && "text-right")}>
              <h1 className="font-bold text-lg bg-fitness-gradient bg-clip-text text-transparent">
                {t("FitFatta")}
              </h1>
              <p className="text-xs text-muted-foreground">
                {t("AI-Powered Fitness")}
              </p>
            </div>
          )}
          <SidebarTrigger className={cn("ml-auto", isRTL && "mr-auto ml-0")}>
            {state === "expanded" ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </SidebarTrigger>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2">
        <ScrollArea className="flex-1">
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

          {(isAdmin || isCoach) && (
            <>
              <Separator className="my-4" />
              <SidebarMenu>
                {isCoach && (
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      onClick={() => handleNavigation('/coach')}
                      className={cn(
                        "nav-link-rtl w-full justify-start",
                        location.pathname === '/coach' && "bg-primary/10 text-primary"
                      )}
                    >
                      <Users className="w-5 h-5 icon-start" />
                      {state === "expanded" && !isCollapsing && (
                        <div className={cn("flex items-center gap-2", isRTL && "flex-row-reverse")}>
                          <span>{t("Coach")}</span>
                          <Badge variant="secondary" className="bg-blue-100 text-blue-700 text-xs">
                            {t("Professional Coach")}
                          </Badge>
                        </div>
                      )}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )}

                {isAdmin && (
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      onClick={() => handleNavigation('/admin')}
                      className={cn(
                        "nav-link-rtl w-full justify-start",
                        location.pathname === '/admin' && "bg-primary/10 text-primary"
                      )}
                    >
                      <Shield className="w-5 h-5 icon-start" />
                      {state === "expanded" && !isCollapsing && (
                        <div className={cn("flex items-center gap-2", isRTL && "flex-row-reverse")}>
                          <span>{t("Admin")}</span>
                          <Badge variant="destructive" className="text-xs">
                            {t("System administration and management")}
                          </Badge>
                        </div>
                      )}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )}
              </SidebarMenu>
            </>
          )}
        </ScrollArea>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t">
        {user && (
          <div className="space-y-3">
            {/* User Profile Section */}
            <div className={cn("flex items-center gap-3 p-3 rounded-lg bg-muted/30", isRTL && "flex-row-reverse")}>
              <Avatar className="w-10 h-10">
                <AvatarFallback className="bg-fitness-gradient text-white font-semibold">
                  {getUserInitials(profile?.first_name, profile?.last_name, user.email)}
                </AvatarFallback>
              </Avatar>
              
              {state === "expanded" && !isCollapsing && (
                <div className={cn("flex-1 min-w-0", isRTL && "text-right")}>
                  <p className="font-medium text-sm truncate">
                    {profile?.first_name && profile?.last_name 
                      ? `${profile.first_name} ${profile.last_name}`
                      : profile?.first_name || user.email?.split('@')[0] || t("user")
                    }
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {user.email}
                  </p>
                  {profile?.ai_generations_remaining !== undefined && (
                    <div className={cn("flex items-center gap-1 mt-1", isRTL && "flex-row-reverse justify-end")}>
                      <Sparkles className="w-3 h-3 text-primary" />
                      <span className="text-xs text-primary font-medium">
                        {profile.ai_generations_remaining}/5 {t("AI Credits")}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Settings and Logout */}
            <div className="space-y-1">
              <SidebarMenuButton
                onClick={() => handleNavigation('/profile')}
                className="nav-link-rtl w-full justify-start"
                aria-label={t("Settings")}
              >
                <Settings className="w-4 h-4 icon-start" />
                {state === "expanded" && !isCollapsing && (
                  <span>{t("Settings")}</span>
                )}
              </SidebarMenuButton>

              <SidebarMenuButton
                onClick={handleSignOut}
                className="nav-link-rtl w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
                aria-label={t("Logout")}
              >
                <LogOut className="w-4 h-4 icon-start" />
                {state === "expanded" && !isCollapsing && (
                  <span>{t("Logout")}</span>
                )}
              </SidebarMenuButton>
            </div>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
