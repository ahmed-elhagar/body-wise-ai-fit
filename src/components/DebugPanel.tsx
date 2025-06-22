
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { RefreshCw, Database, Wifi, AlertTriangle } from 'lucide-react';

interface DebugPanelProps {
  user: any;
  profile: any;
  error?: string | Error | null;
  onRefresh?: () => void;
}

const DebugPanel: React.FC<DebugPanelProps> = ({ user, profile, error, onRefresh }) => {
  if (process.env.NODE_ENV === 'production') return null;

  const getErrorMessage = (err: string | Error | null | undefined): string => {
    if (!err) return 'No error';
    if (typeof err === 'string') return err;
    if (err instanceof Error) return err.message;
    return 'Unknown error';
  };

  return (
    <Card className="p-4 mb-4 border-dashed border-orange-300 bg-orange-50">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-orange-800">Debug Panel</h3>
        {onRefresh && (
          <Button variant="outline" size="sm" onClick={onRefresh}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        )}
      </div>
      
      <div className="space-y-2 text-sm">
        <div className="flex items-center gap-2">
          <Database className="w-4 h-4" />
          <span>User:</span>
          <Badge variant={user ? "default" : "destructive"}>
            {user ? "Authenticated" : "Not authenticated"}
          </Badge>
        </div>
        
        <div className="flex items-center gap-2">
          <Wifi className="w-4 h-4" />
          <span>Profile:</span>
          <Badge variant={profile ? "default" : "secondary"}>
            {profile ? "Loaded" : "Not loaded"}
          </Badge>
        </div>
        
        {error && (
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5" />
            <span>Error:</span>
            <span className="text-red-600">{getErrorMessage(error)}</span>
          </div>
        )}
      </div>
    </Card>
  );
};

export default DebugPanel;
