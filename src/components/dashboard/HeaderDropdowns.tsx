
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, User, Settings, LogOut } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useI18n } from '@/hooks/useI18n';

interface HeaderDropdownsProps {
  userName: string;
  unreadNotifications: number;
  onProfileClick: () => void;
  onSettingsClick: () => void;
  onNotificationsClick: () => void;
  onLogoutClick: () => void;
}

const HeaderDropdowns = ({
  userName,
  unreadNotifications,
  onProfileClick,
  onSettingsClick,
  onNotificationsClick,
  onLogoutClick
}: HeaderDropdownsProps) => {
  const { t, isRTL } = useI18n();

  return (
    <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
      {/* Notifications */}
      <Button variant="ghost" size="sm" onClick={onNotificationsClick} className="relative">
        <Bell className="w-5 h-5" />
        {unreadNotifications > 0 && (
          <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center bg-red-500 text-white text-xs">
            {unreadNotifications}
          </Badge>
        )}
      </Button>

      {/* User Menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <User className="w-5 h-5" />
            <span className="hidden md:inline">{userName}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align={isRTL ? 'start' : 'end'} className="w-56">
          <DropdownMenuItem onClick={onProfileClick} className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <User className="w-4 h-4" />
            {t('navigation:profile') || 'Profile'}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onSettingsClick} className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Settings className="w-4 h-4" />
            {t('navigation:settings') || 'Settings'}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={onLogoutClick} className={`flex items-center gap-2 text-red-600 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <LogOut className="w-4 h-4" />
            {t('navigation:logout') || 'Logout'}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default HeaderDropdowns;
