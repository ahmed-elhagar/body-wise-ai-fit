
import React from "react";
import { 
  User, 
  Crown, 
  Shield, 
  Star,
  Sparkles,
  Settings,
  LogOut
} from "lucide-react";
import { 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton, 
  SidebarGroup,
  SidebarGroupContent,
  useSidebar
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useRole } from "@/hooks/useRole";
import { useSubscription } from "@/hooks/useSubscription";
import { useI18n } from "@/hooks/useI18n";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const SidebarAccountSection = () => {
  const { user } = useAuth();
  const { role, isAdmin, isCoach } = useRole();
  const { subscription } = useSubscription();
  const { isRTL } = useI18n();
  const { state } = useSidebar();
  
  const isCollapsed = state === "collapsed";
  const isPro = subscription?.status === 'active';
  
  const getDisplayName = () => {
    if (user?.user_metadata?.first_name || user?.user_metadata?.last_name) {
      return `${user.user_metadata.first_name || ''} ${user.user_metadata.last_name || ''}`.trim();
    }
    return user?.email?.split('@')[0] || 'User';
  };

  const getInitials = () => {
    const name = getDisplayName();
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const getRoleBadge = () => {
    if (isAdmin) {
      return (
        <Badge className="bg-red-100 text-red-800 border-red-200 text-xs px-2 py-1">
          <Shield className="w-3 h-3 mr-1" />
          Admin
        </Badge>
      );
    }
    if (isCoach) {
      return (
        <Badge className="bg-green-100 text-green-800 border-green-200 text-xs px-2 py-1">
          <Star className="w-3 h-3 mr-1" />
          Coach
        </Badge>
      );
    }
    if (isPro) {
      return (
        <Badge className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white border-0 text-xs px-2 py-1">
          <Crown className="w-3 h-3 mr-1" />
          Pro
        </Badge>
      );
    }
    return (
      <Badge variant="secondary" className="text-xs px-2 py-1">
        {role || 'User'}
      </Badge>
    );
  };

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      toast.success('Signed out successfully');
    } catch (error) {
      toast.error('Failed to sign out');
    }
  };

  if (!user) return null;

  // If collapsed, don't show the account section
  if (isCollapsed) {
    return null;
  }

  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <div className="px-2 space-y-3">
          {/* User Profile Card */}
          <div className={cn(
            "p-4 rounded-xl border transition-all duration-200",
            isPro 
              ? "bg-gradient-to-br from-yellow-50 via-orange-50 to-amber-50 border-yellow-200 shadow-md" 
              : "bg-gray-50 border-gray-200 hover:bg-gray-100"
          )}>
            <div className={cn(
              "flex items-center gap-3",
              isRTL && "flex-row-reverse"
            )}>
              <div className={cn(
                "relative w-12 h-12 rounded-xl flex items-center justify-center text-white font-semibold text-sm shadow-sm",
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
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center">
                    <Sparkles className="w-3 h-3 text-white" />
                  </div>
                )}
              </div>
              
              <div className={cn("flex-1 min-w-0", isRTL && "text-right")}>
                <div className="font-semibold text-gray-900 truncate text-sm">
                  {getDisplayName()}
                </div>
                <div className="text-xs text-gray-500 truncate">
                  {user.email}
                </div>
                <div className="mt-1">
                  {getRoleBadge()}
                </div>
              </div>
            </div>
          </div>

          {/* Pro Status Banner */}
          {isPro && (
            <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white p-3 rounded-lg text-center">
              <div className="flex items-center justify-center gap-2 text-sm font-semibold">
                <Crown className="w-4 h-4" />
                <span>Pro Member</span>
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="text-xs opacity-90 mt-1">
                Premium features unlocked
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <SidebarMenu className="space-y-1">
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                className="w-full text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-colors rounded-lg"
                tooltip="Settings"
              >
                <Button 
                  variant="ghost" 
                  className={cn(
                    "w-full justify-start gap-3 px-3 py-2 h-auto",
                    isRTL && "flex-row-reverse"
                  )}
                >
                  <Settings className="h-4 w-4" />
                  <span>Settings</span>
                </Button>
              </SidebarMenuButton>
            </SidebarMenuItem>
            
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                className="w-full text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors rounded-lg"
                tooltip="Sign Out"
              >
                <Button 
                  variant="ghost" 
                  onClick={handleSignOut}
                  className={cn(
                    "w-full justify-start gap-3 px-3 py-2 h-auto text-red-600 hover:text-red-700 hover:bg-red-50",
                    isRTL && "flex-row-reverse"
                  )}
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sign Out</span>
                </Button>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </div>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};

export default SidebarAccountSection;
