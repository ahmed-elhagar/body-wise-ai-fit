
import React from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Crown, User } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { useSubscription } from "@/hooks/useSubscription";
import { useI18n } from "@/hooks/useI18n";
import { cn } from "@/lib/utils";
import ProMemberBadge from "@/components/ui/pro-member-badge";

const SidebarUserProfile = () => {
  const { user } = useAuth();
  const { profile } = useProfile();
  const { isProMember } = useSubscription();
  const { tFrom, isRTL } = useI18n();
  const tNav = tFrom('navigation');

  if (!user || !profile) return null;

  const displayName = profile.first_name && profile.last_name 
    ? `${profile.first_name} ${profile.last_name}`
    : user.email?.split('@')[0] || 'User';

  const initials = profile.first_name && profile.last_name
    ? `${profile.first_name[0]}${profile.last_name[0]}`
    : (user.email?.[0] || 'U').toUpperCase();

  return (
    <div className={cn(
      "flex items-center gap-3 p-3 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-200",
      isRTL && "flex-row-reverse"
    )}>
      <Avatar className="h-10 w-10 border-2 border-blue-300">
        <AvatarFallback className="bg-blue-100 text-blue-700 font-semibold">
          {initials}
        </AvatarFallback>
      </Avatar>
      
      <div className={cn("flex-1 min-w-0", isRTL && "text-right")}>
        <div className="flex items-center gap-2 mb-1">
          <p className="text-sm font-medium text-gray-900 truncate">
            {displayName}
          </p>
          {isProMember && (
            <ProMemberBadge variant="compact" />
          )}
        </div>
        
        <div className="flex items-center gap-2">
          {profile.role && profile.role !== 'normal' && (
            <Badge className={cn(
              "text-xs",
              profile.role === 'admin' ? 'bg-red-100 text-red-800' : 'bg-purple-100 text-purple-800'
            )}>
              {profile.role}
            </Badge>
          )}
          
          <p className="text-xs text-gray-500 truncate">
            {user.email}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SidebarUserProfile;
