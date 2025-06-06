
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useI18n } from "@/hooks/useI18n";
import { useSidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { Settings, LogOut, Shield, Users, User } from "lucide-react";
import { SidebarMenuButton } from "@/components/ui/sidebar";
import { useRole } from "@/hooks/useRole";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";

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
      navigate('/auth');
    }
  };

  const getDisplayName = () => {
    if (user?.user_metadata?.first_name || user?.user_metadata?.last_name) {
      return `${user.user_metadata.first_name || ''} ${user.user_metadata.last_name || ''}`.trim();
    }
    return user?.email?.split('@')[0] || 'User';
  };

  if (!user) return null;

  return (
    <div className="p-3 border-t bg-gradient-to-r from-gray-50 to-gray-100">
      {/* Clickable User Info Section */}
      {state === "expanded" && !isCollapsing && (
        <div 
          className="mb-4 p-3 bg-white rounded-lg shadow-sm border cursor-pointer hover:bg-gray-50 transition-colors"
          onClick={() => navigate('/profile')}
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {getDisplayName()}
              </p>
              <p className="text-xs text-gray-500">
                {isAdmin ? "Admin" : isCoach ? "Coach" : "User"}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-1">
        {/* Role-based Navigation */}
        {(isAdmin || isCoach) && (
          <>
            {/* Admin Panel Access */}
            {isAdmin && (
              <SidebarMenuButton
                onClick={() => navigate('/admin')}
                className={cn(
                  "w-full justify-start text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition-colors",
                  "border border-purple-200 hover:border-purple-300"
                )}
                aria-label="Admin"
              >
                <Shield className="w-4 h-4 mr-2" />
                {state === "expanded" && !isCollapsing && (
                  <span className="font-medium">Admin</span>
                )}
              </SidebarMenuButton>
            )}
            
            {/* Coach Dashboard Access */}
            <SidebarMenuButton
              onClick={() => navigate('/coach')}
              className={cn(
                "w-full justify-start text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors",
                "border border-green-200 hover:border-green-300"
              )}
              aria-label="Coach Dashboard"
            >
              <Users className="w-4 h-4 mr-2" />
              {state === "expanded" && !isCollapsing && (
                <span className="font-medium">Coach Dashboard</span>
              )}
            </SidebarMenuButton>

            {state === "expanded" && !isCollapsing && (
              <Separator className="my-2" />
            )}
          </>
        )}
        
        {/* Settings */}
        <SidebarMenuButton
          onClick={() => navigate('/settings')}
          className="w-full justify-start text-gray-600 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
          aria-label="Settings"
        >
          <Settings className="w-4 h-4 mr-2" />
          {state === "expanded" && !isCollapsing && (
            <span>Settings</span>
          )}
        </SidebarMenuButton>

        {/* Logout */}
        <SidebarMenuButton
          onClick={handleSignOut}
          className={cn(
            "w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors",
            "border border-red-200 hover:border-red-300 font-medium"
          )}
          aria-label="Logout"
        >
          <LogOut className="w-4 h-4 mr-2" />
          {state === "expanded" && !isCollapsing && (
            <span>Logout</span>
          )}
        </SidebarMenuButton>
      </div>
    </div>
  );
};
