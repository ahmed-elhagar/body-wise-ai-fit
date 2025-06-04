
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  Settings, 
  Shield, 
  Users,
  BarChart3,
  Database
} from "lucide-react";
import { 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton, 
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent
} from "@/components/ui/sidebar";
import { useRole } from "@/hooks/useRole";
import { useI18n } from "@/hooks/useI18n";
import { cn } from "@/lib/utils";

export const SidebarManagementPanel = () => {
  const { isAdmin, isCoach } = useRole();
  const { isRTL } = useI18n();
  const location = useLocation();

  // Don't show management panel for regular users
  if (!isAdmin && !isCoach) return null;

  const managementItems = [
    ...(isAdmin ? [
      { href: "/admin", icon: Shield, label: "Admin Panel" },
      { href: "/admin/users", icon: Users, label: "User Management" },
      { href: "/admin/analytics", icon: BarChart3, label: "Analytics" },
      { href: "/admin/system", icon: Database, label: "System" },
    ] : []),
    ...(isCoach ? [
      { href: "/coach", icon: Users, label: "Trainees" },
      { href: "/coach/analytics", icon: BarChart3, label: "Coach Analytics" },
    ] : []),
  ];

  if (managementItems.length === 0) return null;

  return (
    <SidebarGroup>
      <SidebarGroupLabel className={cn(
        "text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-3",
        isRTL && "text-right"
      )}>
        {isAdmin ? "Administration" : "Coaching"}
      </SidebarGroupLabel>
      
      <SidebarGroupContent>
        <SidebarMenu className="space-y-1 px-2">
          {managementItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  isActive={isActive}
                  className={cn(
                    "w-full text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-colors rounded-lg",
                    isActive && "bg-purple-50 text-purple-700 border-r-2 border-purple-600 shadow-sm",
                    isRTL && "text-right",
                    isRTL && isActive && "border-r-0 border-l-2 border-purple-600"
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
      </SidebarGroupContent>
    </SidebarGroup>
  );
};

export default SidebarManagementPanel;
