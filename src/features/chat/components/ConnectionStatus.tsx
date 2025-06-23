
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Wifi, WifiOff } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ConnectionStatusProps {
  isConnected: boolean;
  showText?: boolean;
  className?: string;
}

const ConnectionStatus: React.FC<ConnectionStatusProps> = ({ 
  isConnected, 
  showText = true, 
  className 
}) => {
  return (
    <Badge 
      variant={isConnected ? "default" : "destructive"}
      className={cn(
        "flex items-center gap-1 text-xs",
        isConnected 
          ? "bg-green-100 text-green-700 border-green-200 hover:bg-green-200" 
          : "bg-red-100 text-red-700 border-red-200 hover:bg-red-200",
        className
      )}
    >
      {isConnected ? (
        <Wifi className="h-3 w-3" />
      ) : (
        <WifiOff className="h-3 w-3" />
      )}
      {showText && (
        <span>{isConnected ? 'Connected' : 'Disconnected'}</span>
      )}
    </Badge>
  );
};

export default ConnectionStatus;
