
import React from 'react';
import { Button } from '@/components/ui/button';
import { Bell, Settings, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useI18n } from '@/hooks/useI18n';

interface HeaderDropdownsProps {
  userName: string;
  unreadNotifications: number;
  onProfileClick: () => void;
  onSettingsClick: () => void;
  onNotificationsClick: () => void;
}

const HeaderDropdowns = ({
  userName,
  unreadNotifications,
  onProfileClick,
  onSettingsClick,
  onNotificationsClick
}: HeaderDropdownsProps) => {
  const { t, isRTL } = useI18n();

  return (
    <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
      {/* Notifications */}
      <Button
        variant="ghost"
        size="sm"
        onClick={onNotificationsClick}
        className="relative"
      >
        <Bell className="w-5 h-5" />
        {unreadNotifications > 0 && (
          <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs">
            {unreadNotifications}
          </Badge>
        )}
      </Button>

      {/* Settings */}
      <Button
        variant="ghost"
        size="sm"
        onClick={onSettingsClick}
      >
        <Settings className="w-5 h-5" />
      </Button>

      {/* Profile */}
      <Button
        variant="ghost"
        size="sm"
        onClick={onProfileClick}
        className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}
      >
        <User className="w-5 h-5" />
        <span className="hidden md:inline">{userName}</span>
      </Button>
    </div>
  );
};

export default HeaderDropdowns;
