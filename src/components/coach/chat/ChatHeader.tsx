
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ArrowLeft, User, MoreVertical } from 'lucide-react';
import { useI18n } from '@/hooks/useI18n';

interface ChatHeaderProps {
  traineeName: string;
  onBack: () => void;
}

const ChatHeader = ({ traineeName, onBack }: ChatHeaderProps) => {
  const { t } = useI18n();

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
        <h3 className="font-semibold">{traineeName}</h3>
        <p className="text-xs text-gray-500">
          {t('coach:chatWith') || 'Chat with'} {traineeName}
        </p>
      </div>
      
      <Button variant="ghost" size="sm">
        <MoreVertical className="w-4 h-4" />
      </Button>
    </div>
  );
};

export default ChatHeader;
