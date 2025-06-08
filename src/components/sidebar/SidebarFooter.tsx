
import React from "react";
import { Link } from "react-router-dom";
import { User, Settings, LogOut } from "lucide-react";
import { 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton,
  useSidebar
} from "@/components/ui/sidebar";
import { useI18n } from "@/hooks/useI18n";
import { useProfile } from "@/hooks/useProfile";
import { cn } from "@/lib/utils";

export const SidebarFooter = () => {
  const { t, isRTL } = useI18n();
  const { profile } = useProfile();
  const { state, isMobile } = useSidebar();
  const isCollapsed = state === "collapsed" && !isMobile;

  const footerItems = [
    { href: "/profile", icon: User, labelKey: "navigation:profile" },
    { href: "/settings", icon: Settings, labelKey: "navigation:settings" },
  ];

  if (isCollapsed) {
    return (
      <div className="p-2">
        <SidebarMenu>
          {footerItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton asChild tooltip={t(item.labelKey)}>
                <Link to={item.href} className="flex justify-center p-2">
                  <item.icon className="h-5 w-5" />
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-2">
      {/* User Info */}
      <div className={cn(
        "flex items-center gap-3 p-3 rounded-lg bg-gray-50",
        isRTL && "flex-row-reverse text-right"
      )}>
        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
          <User className="h-4 w-4 text-white" />
        </div>
        <div className={cn("flex-1 min-w-0", isRTL && "text-right")}>
          <p className={cn(
            "text-sm font-medium text-gray-900 truncate",
            isRTL && "font-arabic"
          )}>
            {profile?.first_name || t("common:profile")}
          </p>
          <p className={cn(
            "text-xs text-gray-500 truncate",
            isRTL && "font-arabic"
          )}>
            {profile?.email || t("navigation:profile")}
          </p>
        </div>
      </div>

      {/* Footer Menu */}
      <SidebarMenu className="space-y-1">
        {footerItems.map((item) => (
          <SidebarMenuItem key={item.href}>
            <SidebarMenuButton asChild>
              <Link 
                to={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors",
                  isRTL && "flex-row-reverse text-right"
                )}
              >
                <item.icon className="h-4 w-4 flex-shrink-0" />
                <span className={cn(
                  "text-sm font-medium truncate",
                  isRTL && "font-arabic"
                )}>
                  {t(item.labelKey)}
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </div>
  );
};
