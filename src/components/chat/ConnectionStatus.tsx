
import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Wifi, WifiOff, AlertTriangle, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ConnectionStatusProps {
  isConnected: boolean;
  className?: string;
  showText?: boolean;
}

const ConnectionStatus = ({ isConnected, className, showText = true }: ConnectionStatusProps) => {
  const [connectionQuality, setConnectionQuality] = useState<'excellent' | 'good' | 'poor' | 'offline'>('offline');
  const [lastConnected, setLastConnected] = useState<Date | null>(null);

  useEffect(() => {
    if (isConnected) {
      setConnectionQuality('excellent');
      setLastConnected(new Date());
    } else {
      setConnectionQuality('offline');
    }
  }, [isConnected]);

  // Simulate connection quality based on time since last connection
  useEffect(() => {
    if (!isConnected || !lastConnected) return;

    const interval = setInterval(() => {
      const timeSinceLastConnection = Date.now() - lastConnected.getTime();
      
      if (timeSinceLastConnection < 5000) {
        setConnectionQuality('excellent');
      } else if (timeSinceLastConnection < 15000) {
        setConnectionQuality('good');
      } else if (timeSinceLastConnection < 30000) {
        setConnectionQuality('poor');
      } else {
        setConnectionQuality('offline');
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isConnected, lastConnected]);

  const getStatusConfig = () => {
    switch (connectionQuality) {
      case 'excellent':
        return {
          icon: <CheckCircle className="w-3 h-3 text-green-500" />,
          text: 'Connected',
          color: 'bg-green-100 text-green-800 border-green-200',
          pulse: false
        };
      case 'good':
        return {
          icon: <Wifi className="w-3 h-3 text-blue-500" />,
          text: 'Connected',
          color: 'bg-blue-100 text-blue-800 border-blue-200',
          pulse: false
        };
      case 'poor':
        return {
          icon: <AlertTriangle className="w-3 h-3 text-yellow-500" />,
          text: 'Unstable',
          color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
          pulse: true
        };
      case 'offline':
        return {
          icon: <WifiOff className="w-3 h-3 text-red-500" />,
          text: 'Disconnected',
          color: 'bg-red-100 text-red-800 border-red-200',
          pulse: true
        };
    }
  };

  const config = getStatusConfig();

  return (
    <Badge 
      variant="outline" 
      className={cn(
        'flex items-center gap-1 text-xs font-medium border transition-all duration-200',
        config.color,
        config.pulse && 'animate-pulse',
        className
      )}
    >
      {config.icon}
      {showText && <span>{config.text}</span>}
    </Badge>
  );
};

export default ConnectionStatus;
