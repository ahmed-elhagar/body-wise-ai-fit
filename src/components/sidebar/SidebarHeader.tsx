
import React from "react";
import { Dumbbell } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SidebarHeader } from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/useAuth";
import { useI18n } from "@/hooks/useI18n";
import { cn } from "@/lib/utils";

const AppSidebarHeader = () => {
  const { t, isRTL } = useI18n();
  const { user } = useAuth();

  const getUserInitials = () => {
    if (!user?.email) return "U";
    return user.email.charAt(0).toUpperCase();
  };

  const getUserDisplayName = () => {
    if (user?.user_metadata?.first_name) {
      return `${user.user_metadata.first_name} ${user.user_metadata.last_name || ''}`.trim();
    }
    return user?.email?.split('@')[0] || 'User';
  };

  return (
    <SidebarHeader className="p-6 border-b border-gray-200 bg-gradient-to-br from-blue-50 to-indigo-50" data-sidebar="header">
      <div className={cn(
        "flex items-center gap-3 mb-4",
        isRTL && "flex-row-reverse"
      )}>
        <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
          <Dumbbell className="w-5 h-5 text-white" />
        </div>
        <div className={isRTL ? "text-right" : ""}>
          <h2 className="font-bold text-xl text-gray-900">{String(t('common:appName'))}</h2>
          <p className="text-sm text-gray-600 font-medium">{String(t('common:aiPoweredFitness'))}</p>
        </div>
      </div>

      {/* User Info */}
      {user && (
        <div className={cn(
          "flex items-center gap-3 p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-white/50 shadow-sm",
          isRTL && "flex-row-reverse"
        )}>
          <Avatar className="w-10 h-10 ring-2 ring-blue-100">
            <AvatarImage src={user.user_metadata?.avatar_url} />
            <AvatarFallback className="bg-gradient-to-br from-blue-600 to-purple-600 text-white font-semibold">
              {getUserInitials()}
            </AvatarFallback>
          </Avatar>
          <div className={cn(
            "flex-1 min-w-0",
            isRTL && "text-right"
          )}>
            <p className="font-semibold text-gray-900 truncate text-sm">
              {getUserDisplayName()}
            </p>
            <p className="text-gray-500 truncate text-xs">{user.email}</p>
          </div>
        </div>
      )}
    </SidebarHeader>
  );
};

export default AppSidebarHeader;
