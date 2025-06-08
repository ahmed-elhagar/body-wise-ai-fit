
import React from "react";
import { Link } from "react-router-dom";
import { SidebarMenuButton, useSidebar } from "@/components/ui/sidebar";
import { useI18n } from "@/hooks/useI18n";
import { cn } from "@/lib/utils";

export const SidebarHeader = () => {
  const { isRTL, t } = useI18n();
  const { state, isMobile } = useSidebar();
  const isCollapsed = state === "collapsed" && !isMobile;

  return (
    <div className={cn(
      "p-4 border-b border-gray-200",
      isRTL && "text-right"
    )}>
      <SidebarMenuButton asChild>
        <Link 
          to="/dashboard" 
          className={cn(
            "flex items-center gap-3 w-full",
            isRTL && "flex-row-reverse"
          )}
        >
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold text-sm">F</span>
          </div>
          {!isCollapsed && (
            <div className={cn("text-left", isRTL && "text-right")}>
              <h1 className={cn(
                "text-lg font-bold text-gray-900",
                isRTL && "font-arabic"
              )}>
                {t("common:fitFatta")}
              </h1>
              <p className={cn(
                "text-xs text-gray-500",
                isRTL && "font-arabic"
              )}>
                {t("dashboard:trackProgress")}
              </p>
            </div>
          )}
        </Link>
      </SidebarMenuButton>
    </div>
  );
};
