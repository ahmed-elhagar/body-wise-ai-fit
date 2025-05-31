
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { useI18n } from "@/hooks/useI18n";
import { useSidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { Sparkles, Menu, X } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";

export const SidebarHeader = () => {
  const { user } = useAuth();
  const { profile } = useProfile();
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

  const getUserInitials = (firstName?: string, lastName?: string, email?: string) => {
    if (firstName && lastName) {
      return `${firstName[0]}${lastName[0]}`.toUpperCase();
    }
    if (firstName) {
      return firstName.slice(0, 2).toUpperCase();
    }
    if (email) {
      return email.slice(0, 2).toUpperCase();
    }
    return 'U';
  };

  return (
    <div className={cn("p-4 border-b", isRTL && "text-right")}>
      <div className={cn("flex items-center gap-3", isRTL && "flex-row-reverse")}>
        <div className="w-8 h-8 bg-fitness-gradient rounded-lg flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        {state === "expanded" && !isCollapsing && (
          <div className={cn("flex-1", isRTL && "text-right")}>
            <h1 className="font-bold text-lg bg-fitness-gradient bg-clip-text text-transparent">
              {t("FitFatta")}
            </h1>
            <p className="text-xs text-muted-foreground">
              {t("AI-Powered Fitness")}
            </p>
          </div>
        )}
        <SidebarTrigger className={cn("ml-auto", isRTL && "mr-auto ml-0")}>
          {state === "expanded" ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        </SidebarTrigger>
      </div>

      {/* User Profile Section */}
      {user && state === "expanded" && !isCollapsing && (
        <div className={cn("flex items-center gap-3 p-3 rounded-lg bg-muted/30 mt-4", isRTL && "flex-row-reverse")}>
          <Avatar className="w-10 h-10">
            <AvatarFallback className="bg-fitness-gradient text-white font-semibold">
              {getUserInitials(profile?.first_name, profile?.last_name, user.email)}
            </AvatarFallback>
          </Avatar>
          
          <div className={cn("flex-1 min-w-0", isRTL && "text-right")}>
            <p className="font-medium text-sm truncate">
              {profile?.first_name && profile?.last_name 
                ? `${profile.first_name} ${profile.last_name}`
                : profile?.first_name || user.email?.split('@')[0] || t("user")
              }
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {user.email}
            </p>
            {profile?.ai_generations_remaining !== undefined && (
              <div className={cn("flex items-center gap-1 mt-1", isRTL && "flex-row-reverse justify-end")}>
                <Sparkles className="w-3 h-3 text-primary" />
                <span className="text-xs text-primary font-medium">
                  {profile.ai_generations_remaining}/5 {t("AI Credits")}
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
