
import React from "react";
import { useSidebar } from "@/components/ui/sidebar";
import { useI18n } from "@/hooks/useI18n";
import { Dumbbell, Sparkles, Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { useSubscription } from "@/hooks/useSubscription";
import { Button } from "@/components/ui/button";

export const SidebarBranding = () => {
  const { t, isRTL } = useI18n();
  const { state, toggleSidebar, isMobile } = useSidebar();
  const { user } = useAuth();
  const { subscription } = useSubscription();
  
  const isPro = subscription?.status === 'active';
  const isCollapsed = state === "collapsed";

  return (
    <div className={cn(
      "flex items-center justify-between p-4 border-b transition-all duration-200",
      isPro 
        ? "bg-gradient-to-r from-yellow-500 via-orange-500 to-amber-500 text-white border-yellow-300" 
        : "bg-gradient-to-r from-green-600 to-blue-600 text-white border-blue-300",
      isRTL && "flex-row-reverse"
    )}>
      <div className={cn(
        "flex items-center gap-3",
        isRTL && "flex-row-reverse"
      )}>
        <div className={cn(
          "relative w-10 h-10 rounded-xl flex items-center justify-center backdrop-blur-sm shadow-lg",
          isPro ? "bg-white/20" : "bg-white/20"
        )}>
          <Dumbbell className="w-6 h-6" />
          {isPro && (
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-300 rounded-full flex items-center justify-center">
              <Sparkles className="w-2 h-2 text-yellow-700" />
            </div>
          )}
        </div>
        
        {!isCollapsed && (
          <div className={cn("flex flex-col", isRTL && "text-right")}>
            <h1 className="text-lg font-bold tracking-tight flex items-center gap-2">
              FitGenius
              {isPro && (
                <span className="text-xs bg-white/20 px-2 py-1 rounded-full font-medium">
                  PRO
                </span>
              )}
            </h1>
            <p className="text-xs opacity-90 font-medium">
              {isPro ? "Premium AI Fitness Companion" : "Your AI Fitness Companion"}
            </p>
          </div>
        )}
      </div>

      {/* Toggle button for desktop, always visible on mobile */}
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleSidebar}
        className={cn(
          "text-white hover:bg-white/20 transition-colors",
          isCollapsed ? "w-8 h-8" : "w-8 h-8",
          isMobile && "flex"
        )}
      >
        <Menu className="w-4 h-4" />
      </Button>
    </div>
  );
};

export default SidebarBranding;
