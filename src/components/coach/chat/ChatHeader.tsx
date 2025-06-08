
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ArrowLeft, User, MoreVertical, Wifi, WifiOff } from 'lucide-react';
import { useI18n } from '@/hooks/useI18n';

interface ChatHeaderProps {
  coachName?: string;
  traineeName?: string;
  isCoachOnline?: boolean;
  isConnected?: boolean;
  coachLastSeen?: string;
  onBack: () => void;
}

const ChatHeader = ({ 
  coachName, 
  traineeName, 
  isCoachOnline, 
  isConnected,
  coachLastSeen,
  onBack 
}: ChatHeaderProps) => {
  const { t } = useI18n();

  const displayName = coachName || traineeName || 'Chat';

  return (
    <div className="flex items-center gap-3 p-4 border-b bg-white">
      <Button variant="ghost" size="sm" onClick={onBack}>
        <ArrowLeft className="w-4 h-4" />
      </Button>
      
      <Avatar className="w-8 h-8">
        <AvatarFallback>
          <User className="w-4 h-4" />
        </AvatarFallback>
      </Avatar>
      
      <div className="flex-1">
        <h3 className="font-semibold">{displayName}</h3>
        <div className="flex items-center gap-2">
          <p className="text-xs text-gray-500">
            {coachName ? t('coach:chatWith') || 'Chat with' : 'Trainee'} {displayName}
          </p>
          {isCoachOnline !== undefined && (
            <div className={`w-2 h-2 rounded-full ${isCoachOnline ? 'bg-green-500' : 'bg-gray-400'}`} />
          )}
          {isConnected !== undefined && (
            isConnected ? (
              <Wifi className="w-3 h-3 text-green-500" />
            ) : (
              <WifiOff className="w-3 h-3 text-red-500" />
            )
          )}
        </div>
      </div>
      
      <Button variant="ghost" size="sm">
        <MoreVertical className="w-4 h-4" />
      </Button>
    </div>
  );
};

export default ChatHeader;
