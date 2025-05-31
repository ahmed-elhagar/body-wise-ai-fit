
import React from "react";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { SidebarFooter } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useI18n } from "@/hooks/useI18n";
import LanguageToggle from "@/components/LanguageToggle";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const AppSidebarFooter = () => {
  const { tFrom, isRTL } = useI18n();
  const tNav = tFrom('navigation');
  const navigate = useNavigate();
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success("Successfully signed out");
      navigate("/auth");
    } catch (error) {
      toast.error("Error signing out");
    }
  };

  return (
    <SidebarFooter className="p-4 border-t border-gray-200 bg-gray-50/50" data-sidebar="footer">
      {/* Language Toggle */}
      <div className="mb-3">
        <LanguageToggle />
      </div>

      {/* Logout Button */}
      <Button
        onClick={handleSignOut}
        variant="ghost"
        className={cn(
          "w-full text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors font-medium",
          isRTL && "flex-row-reverse"
        )}
      >
        <LogOut className={cn("h-4 w-4", isRTL ? "ml-2" : "mr-2")} />
        <span>{String(tNav("logout"))}</span>
      </Button>
    </SidebarFooter>
  );
};

export default AppSidebarFooter;
