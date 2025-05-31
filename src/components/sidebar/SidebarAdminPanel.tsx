
import React from "react";
import { Crown, ShieldCheck } from "lucide-react";
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
}

const SidebarAdminPanel = () => {
  const { tFrom, isRTL } = useI18n();
  const tNav = tFrom('navigation');
  const location = useLocation();
  const { isAdmin } = useAdmin();

  const adminItems: NavigationItem[] = [
    { href: "/admin/dashboard", icon: ShieldCheck, label: String(tNav("adminDashboard")) },
  ];

  if (!isAdmin) {
    return null;
  }

  return (
    <SidebarGroup className="px-4 py-2">
      <SidebarGroupLabel className={cn(
        "text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2 px-2",
        isRTL && "flex-row-reverse text-right"
      )} data-sidebar="group-label">
        <Crown className="w-4 h-4" />
        {String(tNav("admin"))}
      </SidebarGroupLabel>
      <SidebarMenu className="space-y-1">
        {adminItems.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={isActive}
                className={cn(
                  "w-full text-gray-600 hover:text-gray-900 hover:bg-purple-50 transition-colors",
                  isActive && "bg-purple-50 text-purple-700 border-r-2 border-purple-600",
                  isRTL && "text-right",
                  isRTL && isActive && "border-r-0 border-l-2 border-purple-600"
                )}
                data-sidebar="menu-button"
              >
                <Link 
                  to={item.href} 
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 w-full",
                    isRTL && "flex-row-reverse"
                  )} 
                  data-sidebar="menu-item"
                >
                  <item.icon className="h-5 w-5 flex-shrink-0" />
                  <span className="font-medium truncate">{item.label}</span>
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
