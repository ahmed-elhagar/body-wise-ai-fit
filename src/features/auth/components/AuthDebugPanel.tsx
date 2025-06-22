
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { RefreshCw, Database, Wifi, AlertTriangle } from 'lucide-react';

interface AuthDebugPanelProps {
  user: any;
  profile: any;
  error?: string | Error | null;
  onRefresh?: () => void;
}

const AuthDebugPanel: React.FC<AuthDebugPanelProps> = ({ user, profile, error, onRefresh }) => {
  if (process.env.NODE_ENV === 'production') return null;

  const getErrorMessage = (err: string | Error | null | undefined): string => {
    if (!err) return 'No error';
    if (typeof err === 'string') return err;
    if (err instanceof Error) return err.message;
    return 'Unknown error';
  };

  return (
    <Card className="p-4 mb-4 border-dashed border-blue-300 bg-blue-50">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-blue-800">Auth Debug Panel</h3>
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
          <span>Auth User:</span>
          <Badge variant={user ? "default" : "destructive"}>
            {user ? user.email || "Authenticated" : "Not authenticated"}
          </Badge>
        </div>
        
        <div className="flex items-center gap-2">
          <Wifi className="w-4 h-4" />
          <span>Profile Data:</span>
          <Badge variant={profile ? "default" : "secondary"}>
            {profile ? `${profile.first_name || 'User'} (${profile.role || 'normal'})` : "Not loaded"}
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

export default AuthDebugPanel;
