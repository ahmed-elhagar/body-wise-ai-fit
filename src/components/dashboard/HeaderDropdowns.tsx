
import React from 'react';
import { Button } from '@/components/ui/button';
import { Bell, Settings, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useI18n } from '@/hooks/useI18n';
import { useNavigate } from 'react-router-dom';

interface HeaderDropdownsProps {
  userName?: string;
  unreadNotifications?: number;
  onProfileClick?: () => void;
  onSettingsClick?: () => void;
  onNotificationsClick?: () => void;
}

const HeaderDropdowns = ({
  userName = 'User',
  unreadNotifications = 0,
  onProfileClick,
  onSettingsClick,
  onNotificationsClick
}: HeaderDropdownsProps) => {
  const { t, isRTL } = useI18n();
  const navigate = useNavigate();

  const handleProfileClick = () => {
    if (onProfileClick) {
      onProfileClick();
    } else {
      navigate('/profile');
    }
  };

  const handleSettingsClick = () => {
    if (onSettingsClick) {
      onSettingsClick();
    } else {
      navigate('/settings');
    }
  };

  const handleNotificationsClick = () => {
    if (onNotificationsClick) {
      onNotificationsClick();
    } else {
      // Default notification handling
      console.log('Show notifications');
    }
  };

  return (
    <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
      {/* Notifications */}
      <Button
        variant="ghost"
        size="sm"
        onClick={handleNotificationsClick}
        className="relative text-white hover:bg-white/20"
      >
        <Bell className="w-5 h-5" />
        {unreadNotifications > 0 && (
          <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs bg-red-500">
            {unreadNotifications}
          </Badge>
        )}
      </Button>

      {/* Settings */}
      <Button
        variant="ghost"
        size="sm"
        onClick={handleSettingsClick}
        className="text-white hover:bg-white/20"
      >
        <Settings className="w-5 h-5" />
      </Button>

      {/* Profile */}
      <Button
        variant="ghost"
        size="sm"
        onClick={handleProfileClick}
        className={`flex items-center gap-2 text-white hover:bg-white/20 ${isRTL ? 'flex-row-reverse' : ''}`}
      >
        <User className="w-5 h-5" />
        <span className="hidden md:inline">{userName}</span>
      </Button>
    </div>
  );
};

export default HeaderDropdowns;
