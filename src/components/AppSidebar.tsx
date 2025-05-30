
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
} from "lucide-react";
import {
  Sidebar,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { useLocation, useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useRole } from "@/hooks/useRole";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const location = useLocation();
  const { t, language, setLanguage, isRTL } = useLanguage();
  const { user, signOut } = useAuth();
  const { profile } = useProfile();
  const { role, isPro, isCoach, isAdmin } = useRole();

  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate("/auth");
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
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="/dashboard" className="font-semibold">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-fitness-primary text-sidebar-primary-foreground">
                  <Dumbbell className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">FitGenius</span>
                  <span className="truncate text-xs">
                    {isPro && <Badge className="bg-yellow-500 text-black text-xs">PRO</Badge>}
                    {isCoach && <Badge className="bg-blue-500 text-white text-xs">COACH</Badge>}
                    {isAdmin && <Badge className="bg-red-500 text-white text-xs">ADMIN</Badge>}
                  </span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarMenu>
        {navigation.map((item) => (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton
              variant={item.isActive ? "default" : "outline"}
              size="lg"
              asChild
            >
              <a href={item.url}>
                <item.icon className="size-4" />
                <span>{item.title}</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton size="lg">
                  <Avatar className="size-7">
                    <AvatarImage src={user?.user_metadata?.avatar_url} />
                    <AvatarFallback>{profile?.first_name?.[0]}{profile?.last_name?.[0]}</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">{profile?.first_name} {profile?.last_name}</span>
                    <span className="truncate text-xs">{profile?.email}</span>
                  </div>
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => navigate("/profile")}>
                  {t("Profile")}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                  {t("Sign Out")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" onClick={toggleLanguage}>
              {isRTL ? "English" : "العربية"}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
