
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Bell, Settings, User, LogOut, ChevronDown } from 'lucide-react';
import { useI18n } from '@/hooks/useI18n';

interface HeaderDropdownsProps {
  userName: string;
  unreadNotifications: number;
  onProfileClick: () => void;
  onSettingsClick: () => void;
  onNotificationsClick: () => void;
  onLogout: () => void;
}

const HeaderDropdowns = ({
  userName,
  unreadNotifications,
  onProfileClick,
  onSettingsClick,
  onNotificationsClick,
  onLogout
}: HeaderDropdownsProps) => {
  const { t } = useI18n();

  return (
    <div className="flex items-center gap-4">
      {/* Notifications */}
      <Button
        variant="ghost"
        size="sm"
        onClick={onNotificationsClick}
        className="relative"
      >
        <Bell className="w-5 h-5" />
        {unreadNotifications > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
            {unreadNotifications > 9 ? '9+' : unreadNotifications}
          </span>
        )}
      </Button>

      {/* User Menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="flex items-center gap-2">
            <Avatar className="w-6 h-6">
              <AvatarFallback>
                <User className="w-4 h-4" />
              </AvatarFallback>
            </Avatar>
            <span className="hidden md:inline">{userName}</span>
            <ChevronDown className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={onProfileClick}>
            <User className="w-4 h-4 mr-2" />
            {t('dashboard:profile') || 'Profile'}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onSettingsClick}>
            <Settings className="w-4 h-4 mr-2" />
            {t('dashboard:settings') || 'Settings'}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            {t('dashboard:logout') || 'Logout'}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default HeaderDropdowns;
