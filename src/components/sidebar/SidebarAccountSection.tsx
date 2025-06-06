
import React from "react";
import { 
  User, 
  Crown, 
  Shield, 
  Star,
  Sparkles
} from "lucide-react";
import { 
  SidebarGroup,
  SidebarGroupContent,
  useSidebar
} from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/useAuth";
import { useRole } from "@/hooks/useRole";
import { useSubscription } from "@/hooks/useSubscription";
import { useI18n } from "@/hooks/useI18n";
import { useProfile } from "@/hooks/useProfile";
import { cn } from "@/lib/utils";

export const SidebarAccountSection = () => {
  const { user } = useAuth();
  const { profile } = useProfile();
  const { role, isAdmin, isCoach } = useRole();
  const { subscription } = useSubscription();
  const { isRTL } = useI18n();
  const { state } = useSidebar();
  
  const isCollapsed = state === "collapsed";
  const isPro = subscription?.status === 'active';
  
  const getDisplayName = () => {
    if (profile?.first_name || profile?.last_name) {
      return `${profile.first_name || ''} ${profile.last_name || ''}`.trim();
    }
    if (user?.user_metadata?.first_name || user?.user_metadata?.last_name) {
      return `${user.user_metadata.first_name || ''} ${user.user_metadata.last_name || ''}`.trim();
    }
    return user?.email?.split('@')[0] || 'User';
  };

  const getInitials = () => {
    const name = getDisplayName();
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const getRoleIcon = () => {
    if (isAdmin) {
      return <Shield className="w-3 h-3 text-red-600" />;
    }
    if (isCoach) {
      return <Star className="w-3 h-3 text-green-600" />;
    }
    if (isPro) {
      return <Crown className="w-3 h-3 text-yellow-600" />;
    }
    return null;
  };

  const getRoleText = () => {
    if (isAdmin) return "Admin";
    if (isCoach) return "Coach";
    if (isPro) return "Pro";
    return "User";
  };

  if (!user || isCollapsed) return null;

  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <div className="px-4 py-2 border-b border-gray-200">
          {/* Compact User Profile */}
          <div className={cn(
            "flex items-center gap-2",
            isRTL && "flex-row-reverse"
          )}>
            <div className={cn(
              "relative w-8 h-8 rounded-lg flex items-center justify-center text-white font-semibold text-xs shadow-sm",
              isPro 
                ? "bg-gradient-to-br from-yellow-500 to-orange-500" 
                : isAdmin 
                  ? "bg-gradient-to-br from-red-500 to-pink-500"
                  : isCoach
                    ? "bg-gradient-to-br from-green-500 to-emerald-500"
                    : "bg-gradient-to-br from-blue-500 to-indigo-500"
            )}>
              {getInitials()}
              {isPro && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full flex items-center justify-center">
                  <Sparkles className="w-1.5 h-1.5 text-white" />
                </div>
              )}
            </div>
            
            <div className={cn("flex-1 min-w-0", isRTL && "text-right")}>
              <div className="flex items-center gap-1">
                <div className="font-medium text-gray-900 truncate text-sm">
                  {getDisplayName()}
                </div>
                {getRoleIcon()}
              </div>
              <div className="text-xs text-gray-500 truncate">
                {getRoleText()}
              </div>
            </div>
          </div>
        </div>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};

export default SidebarAccountSection;
