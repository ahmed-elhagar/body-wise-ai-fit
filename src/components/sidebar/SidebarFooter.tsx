
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useI18n } from "@/hooks/useI18n";
import { useSidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { Settings, LogOut } from "lucide-react";
import { SidebarMenuButton } from "@/components/ui/sidebar";

export const SidebarFooter = () => {
  const { user, signOut } = useAuth();
  const { t, isRTL } = useI18n();
  const navigate = useNavigate();
  const { state } = useSidebar();
  const [isCollapsing, setIsCollapsing] = useState(false);

  useEffect(() => {
    if (state === "collapsed") {
      setIsCollapsing(true);
      const timer = setTimeout(() => setIsCollapsing(false), 300);
      return () => clearTimeout(timer);
    }
  }, [state]);

  const handleSignOut = async () => {
    try {
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
      <div className="space-y-1">
        <SidebarMenuButton
          onClick={() => navigate('/profile')}
          className="nav-link-rtl w-full justify-start"
          aria-label={t("Settings")}
        >
          <Settings className="w-4 h-4 icon-start" />
          {state === "expanded" && !isCollapsing && (
            <span>{t("Settings")}</span>
          )}
        </SidebarMenuButton>

        <SidebarMenuButton
          onClick={handleSignOut}
          className="nav-link-rtl w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
          aria-label={t("Logout")}
        >
          <LogOut className="w-4 h-4 icon-start" />
          {state === "expanded" && !isCollapsing && (
            <span>{t("Logout")}</span>
          )}
        </SidebarMenuButton>
      </div>
    </div>
  );
};
