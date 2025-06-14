
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Bug, ChevronDown, RefreshCw, Trash2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { clearLocalAuthData } from '@/hooks/auth/authHelpers';

const AuthDebugPanel = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, session, loading, error, retryAuth, forceLogout } = useAuth();

  // Only show in development or when there are auth issues
  const shouldShow = import.meta.env.DEV || error || (!user && !loading);

  if (!shouldShow) return null;

  const debugInfo = {
    user: {
      id: user?.id || 'None',
      email: user?.email || 'None',
      role: user?.role || 'None',
      authenticated: !!user,
    },
    session: {
      exists: !!session,
      accessToken: session?.access_token ? 'Present' : 'Missing',
      refreshToken: session?.refresh_token ? 'Present' : 'Missing',
      expiresAt: session?.expires_at ? new Date(session.expires_at * 1000).toLocaleString() : 'None',
    },
    state: {
      loading,
      hasError: !!error,
      errorMessage: error?.message || 'None',
    }
  };

  const handleClearStorage = () => {
    if (confirm('Clear all auth storage? This will require re-login.')) {
      clearLocalAuthData();
      window.location.reload();
    }
  };

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className={`${
              error ? 'bg-red-600 text-white border-red-600 hover:bg-red-700' : 
              'bg-yellow-600 text-white border-yellow-600 hover:bg-yellow-700'
            }`}
          >
            <Bug className="w-4 h-4 mr-2" />
            Auth Debug
            <ChevronDown className={`w-4 h-4 ml-2 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </Button>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <Card className="mt-2 p-4 bg-black/90 text-white border-gray-600 min-w-80 max-w-96">
            <div className="space-y-4">
              {/* User Section */}
              <div>
                <h3 className="font-semibold mb-2">User State</h3>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Authenticated:</span>
                    <Badge variant={debugInfo.user.authenticated ? 'default' : 'destructive'}>
                      {debugInfo.user.authenticated ? 'Yes' : 'No'}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>ID:</span>
                    <span className="text-xs text-gray-300 truncate max-w-32">{debugInfo.user.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Email:</span>
                    <span className="text-xs text-gray-300 truncate max-w-32">{debugInfo.user.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Role:</span>
                    <span className="text-xs text-gray-300">{debugInfo.user.role}</span>
                  </div>
                </div>
              </div>

              {/* Session Section */}
              <div>
                <h3 className="font-semibold mb-2">Session State</h3>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Session:</span>
                    <Badge variant={debugInfo.session.exists ? 'default' : 'destructive'}>
                      {debugInfo.session.exists ? 'Exists' : 'Missing'}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Access Token:</span>
                    <span className="text-xs text-gray-300">{debugInfo.session.accessToken}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Refresh Token:</span>
                    <span className="text-xs text-gray-300">{debugInfo.session.refreshToken}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Expires:</span>
                    <span className="text-xs text-gray-300">{debugInfo.session.expiresAt}</span>
                  </div>
                </div>
              </div>

              {/* App State Section */}
              <div>
                <h3 className="font-semibold mb-2">App State</h3>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Loading:</span>
                    <Badge variant={debugInfo.state.loading ? 'secondary' : 'default'}>
                      {debugInfo.state.loading ? 'Yes' : 'No'}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Error:</span>
                    <Badge variant={debugInfo.state.hasError ? 'destructive' : 'default'}>
                      {debugInfo.state.hasError ? 'Yes' : 'No'}
                    </Badge>
                  </div>
                  {debugInfo.state.hasError && (
                    <div className="text-xs text-red-300 break-words">
                      {debugInfo.state.errorMessage}
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-2 pt-2 border-t border-gray-600">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={retryAuth}
                  className="w-full text-xs"
                >
                  <RefreshCw className="w-3 h-3 mr-1" />
                  Retry Auth
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={forceLogout}
                  className="w-full text-xs"
                >
                  <Trash2 className="w-3 h-3 mr-1" />
                  Force Logout
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClearStorage}
                  className="w-full text-xs"
                >
                  Clear Storage
                </Button>
              </div>
            </div>
          </Card>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default AuthDebugPanel;
