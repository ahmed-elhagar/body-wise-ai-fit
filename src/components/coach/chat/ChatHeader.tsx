
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CardTitle } from "@/components/ui/card";
import { ArrowLeft, UserCheck, Wifi, WifiOff } from "lucide-react";
import { cn } from "@/lib/utils";

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
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const formatLastSeen = (lastSeen?: string) => {
    if (!lastSeen) return 'Never';
    
    const date = new Date(lastSeen);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-t-xl pb-4">
      <div className="flex items-center gap-3 p-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="text-white hover:bg-white/20 p-2"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        
        <Avatar className="h-10 w-10">
          <AvatarFallback className="bg-white/20 text-white font-semibold">
            {getInitials(coachName)}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1">
          <CardTitle className="text-lg font-bold text-white mb-1">
            {coachName}
          </CardTitle>
          <div className="flex items-center gap-2">
            <div className={cn(
              "w-2 h-2 rounded-full",
              isCoachOnline ? "bg-green-300" : "bg-white/50"
            )} />
            <span className="text-green-100 text-sm">
              {isCoachOnline ? "Online" : `Last seen ${formatLastSeen(coachLastSeen)}`}
            </span>
            <div className="flex items-center gap-1 ml-2">
              {isConnected ? (
                <Wifi className="w-3 h-3 text-green-200" />
              ) : (
                <WifiOff className="w-3 h-3 text-red-200" />
              )}
              <span className="text-xs text-green-100">
                {isConnected ? "Connected" : "Reconnecting..."}
              </span>
            </div>
          </div>
        </div>
        
        <Badge variant="secondary" className="bg-white/20 text-white border-white/20">
          <UserCheck className="w-3 h-3 mr-1" />
          Coach
        </Badge>
      </div>
    </div>
  );
};

export default ChatHeader;
