
import { useSidebar } from "@/components/ui/sidebar";
import { useI18n } from "@/hooks/useI18n";
import { Dumbbell, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

export const SidebarHeader = () => {
  const { t, isRTL } = useI18n();
  const { state } = useSidebar();
  const [isCollapsing, setIsCollapsing] = useState(false);

  useEffect(() => {
    if (state === "collapsed") {
      setIsCollapsing(true);
      const timer = setTimeout(() => setIsCollapsing(false), 300);
      return () => clearTimeout(timer);
    }
  }, [state]);

  return (
    <div className={cn(
      "flex items-center gap-3 p-4 border-b bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 text-white relative overflow-hidden",
      isRTL && "flex-row-reverse"
    )}>
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-green-600/20 animate-pulse" />
      
      <div className="relative w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm border border-white/30 shadow-lg">
        <div className="relative">
          <Dumbbell className="w-5 h-5 text-white" />
          <Sparkles className="w-3 h-3 text-yellow-300 absolute -top-1 -right-1 animate-bounce" />
        </div>
      </div>
      
      {state === "expanded" && !isCollapsing && (
        <div className={cn("flex flex-col relative", isRTL && "text-right")}>
          <h1 className="text-xl font-bold tracking-tight text-white drop-shadow-md">
            FitFatta
          </h1>
          <p className="text-xs text-white/90 font-medium flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            {t("Your AI Fitness Companion")}
          </p>
        </div>
      )}
    </div>
  );
};
