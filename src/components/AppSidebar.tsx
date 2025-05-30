
import React from "react";
import {
  Home,
  UtensilsCrossed,
  Dumbbell,
  TrendingUp,
  Settings,
  Scale,
  Search,
  MessageSquare,
  Star,
  Users,
  LogOut,
  Globe,
} from "lucide-react";
import {
  Sidebar,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarContent,
} from "@/components/ui/sidebar";
import { Link, useLocation } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useRole } from "@/hooks/useRole";
import { Button } from "@/components/ui/button";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const location = useLocation();
  const { t, language, setLanguage, isRTL } = useLanguage();
  const { user, signOut } = useAuth();
  const { profile } = useProfile();
  const { role, isPro, isCoach, isAdmin } = useRole();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Sign out failed:", error);
    }
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ar' : 'en');
  };

  const navigation = [
    {
      title: t("Dashboard"),
      url: "/dashboard",
      icon: Home,
      isActive: location.pathname === "/dashboard",
    },
    {
      title: t("Meal Plan"),
      url: "/meal-plan",
      icon: UtensilsCrossed,
      isActive: location.pathname === "/meal-plan",
    },
    {
      title: t("Exercise"),
      url: "/exercise",
      icon: Dumbbell,
      isActive: location.pathname === "/exercise",
    },
    {
      title: t("Progress"),
      url: "/progress",
      icon: TrendingUp,
      isActive: location.pathname === "/progress",
    },
    {
      title: "Weight Tracking",
      url: "/weight-tracking",
      icon: Scale,
      isActive: location.pathname === "/weight-tracking",
    },
    {
      title: "Calorie Checker",
      url: "/calorie-checker",
      icon: Search,
      isActive: location.pathname === "/calorie-checker",
    },
    {
      title: "AI Chat",
      url: "/ai-chat",
      icon: MessageSquare,
      isActive: location.pathname === "/ai-chat",
    },
  ];

  // Add role-specific navigation items
  if (!isPro && (role === 'normal')) {
    navigation.push({
      title: "Upgrade to Pro",
      url: "/pro",
      icon: Star,
      isActive: location.pathname === "/pro",
    });
  }

  if (isCoach) {
    navigation.push({
      title: "Coach Dashboard",
      url: "/coach",
      icon: Users,
      isActive: location.pathname === "/coach",
    });
  }

  if (isAdmin) {
    navigation.push({
      title: "Admin Panel",
      url: "/admin",
      icon: Settings,
      isActive: location.pathname === "/admin",
    });
  }

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="border-b border-border/50">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link to="/dashboard" className="font-semibold hover:bg-accent/50 transition-colors">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-sm">
                  <Dumbbell className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-bold text-foreground">FitGenius</span>
                  <span className="truncate text-xs text-muted-foreground">AI Fitness Companion</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="px-2 py-4">
        <SidebarMenu className="space-y-1">
          {navigation.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                variant={item.isActive ? "default" : "outline"}
                size="lg"
                asChild
                className={`transition-all duration-200 ${
                  item.isActive 
                    ? "bg-blue-600 text-white shadow-md hover:bg-blue-700" 
                    : "hover:bg-accent/50 text-foreground"
                }`}
              >
                <Link to={item.url} className="w-full">
                  <item.icon className="size-4" />
                  <span className="font-medium">{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="border-t border-border/50 p-2">
        <SidebarMenu className="space-y-2">
          {/* User Profile Section */}
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton 
                  size="lg" 
                  className="hover:bg-accent/50 transition-colors border border-border/30 bg-background/50"
                >
                  <Avatar className="size-8 border-2 border-background shadow-sm">
                    <AvatarImage src={user?.user_metadata?.avatar_url} />
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white text-sm font-bold">
                      {profile?.first_name?.[0]}{profile?.last_name?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <div className="flex items-center gap-2">
                      <span className="truncate font-semibold text-foreground">
                        {profile?.first_name} {profile?.last_name}
                      </span>
                      {isPro && <Badge className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20 text-xs px-1.5 py-0.5">PRO</Badge>}
                      {isCoach && <Badge className="bg-blue-500/10 text-blue-600 border-blue-500/20 text-xs px-1.5 py-0.5">COACH</Badge>}
                      {isAdmin && <Badge className="bg-red-500/10 text-red-600 border-red-500/20 text-xs px-1.5 py-0.5">ADMIN</Badge>}
                    </div>
                    <span className="truncate text-xs text-muted-foreground">{profile?.email}</span>
                  </div>
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="cursor-pointer">
                    <Settings className="size-4 mr-2" />
                    {t("Profile")}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-red-600 focus:text-red-600">
                  <LogOut className="size-4 mr-2" />
                  {t("Sign Out")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>

          {/* Language Toggle */}
          <SidebarMenuItem>
            <Button
              variant="outline"
              size="sm"
              onClick={toggleLanguage}
              className="w-full justify-start bg-background/50 border-border/30 hover:bg-accent/50 transition-colors"
            >
              <Globe className="size-4 mr-2" />
              <span className="font-medium">
                {language === 'en' ? 'العربية' : 'English'}
              </span>
            </Button>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
