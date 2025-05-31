
import { useSidebar } from "@/components/ui/sidebar";
import { useI18n } from "@/hooks/useI18n";
import { Dumbbell } from "lucide-react";
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
      "flex items-center gap-3 p-4 border-b bg-gradient-to-r from-green-600 to-blue-600 text-white",
      isRTL && "flex-row-reverse"
    )}>
      <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
        <Dumbbell className="w-5 h-5" />
      </div>
      {state === "expanded" && !isCollapsing && (
        <div className={cn("flex flex-col", isRTL && "text-right")}>
          <h1 className="text-lg font-bold tracking-tight">FitFatta</h1>
          <p className="text-xs text-white/80 font-medium">{t("Your AI Fitness Companion")}</p>
        </div>
      )}
    </div>
  );
};
