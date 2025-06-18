import { Card, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, MessageSquare, Circle, Wifi, WifiOff } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface ChatHeaderProps {
  coachName: string;
  isCoachOnline: boolean;
  coachLastSeen?: string;
  isConnected: boolean;
  onBack: () => void;
}

const ChatHeader = ({ 
  coachName, 
  isCoachOnline, 
  coachLastSeen, 
  isConnected, 
  onBack 
}: ChatHeaderProps) => {
  const { t } = useLanguage();

  const formatLastSeen = (lastSeen?: string) => {
    if (!lastSeen) return 'Unknown';
    
    const date = new Date(lastSeen);
    const now = new Date();
    const diffMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <CardHeader className="border-b bg-white">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={onBack}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            {t('Back')}
          </Button>
          
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center text-white font-medium">
                {coachName.charAt(0).toUpperCase()}
              </div>
              <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white flex items-center justify-center ${
                isCoachOnline ? 'bg-green-500' : 'bg-gray-400'
              }`}>
                <Circle className="w-2 h-2 fill-current" />
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900">{coachName}</h3>
              <div className="flex items-center gap-2 text-sm">
                <span className={isCoachOnline ? 'text-green-600' : 'text-gray-500'}>
                  {isCoachOnline ? 'Online' : `Last seen ${formatLastSeen(coachLastSeen)}`}
                </span>
                <span className="text-gray-400">•</span>
                <MessageSquare className="w-4 h-4 text-gray-400" />
                <span className="text-gray-500">{t('Direct Messages')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Connection Status */}
        <div className="flex items-center gap-2">
          <Badge 
            variant={isConnected ? "default" : "destructive"} 
            className="flex items-center gap-1"
          >
            {isConnected ? (
              <Wifi className="w-3 h-3" />
            ) : (
              <WifiOff className="w-3 h-3" />
            )}
            {isConnected ? t('Connected') : t('Disconnected')}
          </Badge>
        </div>
      </div>
    </CardHeader>
  );
};

export default ChatHeader;
