
import React from "react";
import { Crown, ShieldCheck, Users, Settings, BarChart } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton, 
  SidebarGroup,
  SidebarGroupLabel 
} from "@/components/ui/sidebar";
import { useI18n } from "@/hooks/useI18n";
import { useAdmin } from "@/hooks/useAdmin";
import { cn } from "@/lib/utils";

interface NavigationItem {
  href: string;
  icon: React.ComponentType<any>;
  label: string;
  description?: string;
}

const SidebarAdminPanel = () => {
  const { tFrom, isRTL } = useI18n();
  const tNav = tFrom('navigation');
  const location = useLocation();
  const { isAdmin } = useAdmin();

  const adminItems: NavigationItem[] = [
    { 
      href: "/admin/dashboard", 
      icon: ShieldCheck, 
      label: String(tNav("adminDashboard")),
      description: "System overview & controls"
    },
    { 
      href: "/admin/users", 
      icon: Users, 
      label: "User Management",
      description: "Manage all users"
    },
    { 
      href: "/admin/analytics", 
      icon: BarChart, 
      label: "Analytics",
      description: "Platform insights"
    },
    { 
      href: "/admin/settings", 
      icon: Settings, 
      label: "System Settings",
      description: "Configure platform"
    },
  ];

  if (!isAdmin) {
    return null;
  }

  return (
    <SidebarGroup className="px-4 py-2 bg-gradient-to-br from-purple-50 to-indigo-50 mx-2 rounded-lg border border-purple-200">
      <SidebarGroupLabel className={cn(
        "text-xs font-bold text-purple-700 uppercase tracking-wider mb-3 flex items-center gap-2 px-2",
        isRTL && "flex-row-reverse text-right"
      )} data-sidebar="group-label">
        <Crown className="w-4 h-4 text-purple-600" />
        {String(tNav("admin"))}
      </SidebarGroupLabel>
      
      <div className="text-xs text-purple-600 mb-3 px-2 font-medium">
        {String(tNav("systemAdmin"))}
      </div>

      <SidebarMenu className="space-y-1">
        {adminItems.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={isActive}
                className={cn(
                  "w-full text-purple-700 hover:text-purple-900 hover:bg-purple-100 transition-colors rounded-lg",
                  isActive && "bg-purple-100 text-purple-800 border-r-2 border-purple-600 shadow-sm",
                  isRTL && "text-right",
                  isRTL && isActive && "border-r-0 border-l-2 border-purple-600"
                )}
                data-sidebar="menu-button"
              >
                <Link 
                  to={item.href} 
                  className={cn(
                    "flex flex-col gap-1 px-3 py-2 w-full",
                    isRTL && "text-right"
                  )} 
                  data-sidebar="menu-item"
                >
                  <div className={cn(
                    "flex items-center gap-2",
                    isRTL && "flex-row-reverse"
                  )}>
                    <item.icon className="h-4 w-4 flex-shrink-0" />
                    <span className="font-medium text-sm truncate">{item.label}</span>
                  </div>
                  {item.description && (
                    <span className="text-xs text-purple-600 ml-6 truncate">
                      {item.description}
                    </span>
                  )}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
};

export default SidebarAdminPanel;
