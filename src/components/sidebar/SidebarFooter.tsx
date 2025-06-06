
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useI18n } from "@/hooks/useI18n";
import { useSidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { Settings, LogOut, Shield, Users } from "lucide-react";
import { SidebarMenuButton } from "@/components/ui/sidebar";
import { useRole } from "@/hooks/useRole";
import { toast } from "sonner";

export const SidebarFooter = () => {
  const { user, signOut } = useAuth();
  const { t, isRTL } = useI18n();
  const navigate = useNavigate();
  const { state } = useSidebar();
  const { isAdmin, isCoach } = useRole();
  const [isCollapsing, setIsCollapsing] = useState(false);

  useEffect(() => {
    if (state === "collapsed") {
      setIsCollapsing(true);
      const timer = setTimeout(() => setIsCollapsing(false), 300);
      return () => clearTimeout(timer);
    } else {
      setIsCollapsing(false);
    }
  }, [state]);

  const handleSignOut = async () => {
    try {
      toast.info("Signing out...");
      await signOut();
      navigate('/auth');
    } catch (error) {
      console.error('Error signing out:', error);
      // Even if there's an error, still navigate to auth page
      navigate('/auth');
    }
  };

  if (!user) return null;

  return (
    <div className="p-4 border-t">
      <div className="space-y-2">
        {/* Admin Panel Access */}
        {isAdmin && (
          <SidebarMenuButton
            onClick={() => navigate('/admin')}
            className={cn("w-full justify-start", "text-purple-600 hover:text-purple-700 hover:bg-purple-50")}
            aria-label={t("Admin")}
          >
            <Shield className="w-4 h-4 mr-2" />
            {state === "expanded" && !isCollapsing && (
              <span>{t("Admin")}</span>
            )}
          </SidebarMenuButton>
        )}
        
        {/* Coach Dashboard Access */}
        {(isCoach || isAdmin) && (
          <SidebarMenuButton
            onClick={() => navigate('/coach')}
            className={cn("w-full justify-start", "text-green-600 hover:text-green-700 hover:bg-green-50")}
            aria-label={t("Coach Dashboard")}
          >
            <Users className="w-4 h-4 mr-2" />
            {state === "expanded" && !isCollapsing && (
              <span>{t("Coach Dashboard")}</span>
            )}
          </SidebarMenuButton>
        )}
        
        {/* Settings */}
        <SidebarMenuButton
          onClick={() => navigate('/profile')}
          className="w-full justify-start"
          aria-label={t("Settings")}
        >
          <Settings className="w-4 h-4 mr-2" />
          {state === "expanded" && !isCollapsing && (
            <span>{t("Settings")}</span>
          )}
        </SidebarMenuButton>

        {/* Logout - Force display regardless of role */}
        <SidebarMenuButton
          onClick={handleSignOut}
          className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
          aria-label={t("Logout")}
        >
          <LogOut className="w-4 h-4 mr-2" />
          {state === "expanded" && !isCollapsing && (
            <span>{t("Logout")}</span>
          )}
        </SidebarMenuButton>
      </div>
    </div>
  );
};
