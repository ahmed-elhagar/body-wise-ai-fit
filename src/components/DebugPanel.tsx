
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { Eye, EyeOff, Bug, Database, Zap } from 'lucide-react';

const DebugPanel = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { user, isAdmin } = useAuth();

  // Only show for admins
  if (!isAdmin) return null;

  const debugInfo = {
    userId: user?.id,
    userEmail: user?.email,
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent,
    viewport: `${window.innerWidth}x${window.innerHeight}`,
    url: window.location.href
  };

  const toggleVisibility = () => setIsVisible(!isVisible);

  if (!isVisible) {
    return (
      <Button
        onClick={toggleVisibility}
        variant="outline"
        size="sm"
        className="fixed bottom-4 right-4 z-50 bg-red-500/10 border-red-500/20"
      >
        <Bug className="w-4 h-4" />
        Debug
      </Button>
    );
  }

  return (
    <Card className="fixed bottom-4 right-4 z-50 w-80 max-h-96 overflow-y-auto bg-black/90 text-white border-red-500/20">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between text-sm">
          <span className="flex items-center gap-2">
            <Bug className="w-4 h-4" />
            Debug Panel
          </span>
          <Button
            onClick={toggleVisibility}
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0"
          >
            <EyeOff className="w-3 h-3" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="text-xs space-y-2">
        <div className="grid grid-cols-2 gap-2">
          <Badge variant="outline" className="justify-start">
            <Database className="w-3 h-3 mr-1" />
            DB: Connected
          </Badge>
          <Badge variant="outline" className="justify-start">
            <Zap className="w-3 h-3 mr-1" />
            API: Active
          </Badge>
        </div>
        
        <div className="space-y-1">
          <div><strong>User:</strong> {debugInfo.userEmail}</div>
          <div><strong>ID:</strong> {debugInfo.userId?.slice(0, 8)}...</div>
          <div><strong>Time:</strong> {new Date(debugInfo.timestamp).toLocaleTimeString()}</div>
          <div><strong>Viewport:</strong> {debugInfo.viewport}</div>
        </div>

        <div className="pt-2 border-t border-gray-700">
          <Button
            onClick={() => console.log('Full Debug Info:', debugInfo)}
            variant="outline"
            size="sm"
            className="w-full text-xs"
          >
            Log Full Info
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DebugPanel;
