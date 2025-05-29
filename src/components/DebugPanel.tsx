
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Bug, ChevronDown, Database, Zap, User, Settings } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { supabase } from '@/integrations/supabase/client';

const DebugPanel = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const { user, session } = useAuth();
  const { profile } = useProfile();

  // Only show debug panel in development or for admin users
  const shouldShow = import.meta.env.DEV || profile?.user_roles?.some(role => role.role === 'admin');

  if (!shouldShow) return null;

  const debugInfo = {
    user: {
      id: user?.id || 'Not authenticated',
      email: user?.email || 'No email',
      authenticated: !!user,
      sessionValid: !!session,
    },
    profile: {
      onboardingCompleted: profile?.onboarding_completed || false,
      aiGenerationsRemaining: profile?.ai_generations_remaining || 0,
      preferredLanguage: profile?.preferred_language || 'en',
    },
    system: {
      environment: import.meta.env.MODE,
      supabaseUrl: import.meta.env.VITE_SUPABASE_URL ? 'Configured' : 'Missing',
      buildTime: new Date().toISOString(),
    }
  };

  const clearAllData = async () => {
    if (confirm('Clear all local storage data? This will log you out.')) {
      localStorage.clear();
      sessionStorage.clear();
      await supabase.auth.signOut();
      window.location.reload();
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="bg-black/80 text-white border-gray-600 hover:bg-black/90"
          >
            <Bug className="w-4 h-4 mr-2" />
            Debug
            <ChevronDown className={`w-4 h-4 ml-2 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </Button>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <Card className="mt-2 p-4 bg-black/90 text-white border-gray-600 min-w-80 max-w-96">
            <div className="space-y-4">
              {/* User Section */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <User className="w-4 h-4" />
                  <span className="font-semibold">Authentication</span>
                </div>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Status:</span>
                    <Badge variant={debugInfo.user.authenticated ? 'default' : 'destructive'}>
                      {debugInfo.user.authenticated ? 'Authenticated' : 'Not authenticated'}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Session:</span>
                    <Badge variant={debugInfo.user.sessionValid ? 'default' : 'destructive'}>
                      {debugInfo.user.sessionValid ? 'Valid' : 'Invalid'}
                    </Badge>
                  </div>
                  {showAdvanced && (
                    <>
                      <div className="text-xs text-gray-400 break-all">
                        ID: {debugInfo.user.id}
                      </div>
                      <div className="text-xs text-gray-400 break-all">
                        Email: {debugInfo.user.email}
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Profile Section */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Database className="w-4 h-4" />
                  <span className="font-semibold">Profile</span>
                </div>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Onboarding:</span>
                    <Badge variant={debugInfo.profile.onboardingCompleted ? 'default' : 'secondary'}>
                      {debugInfo.profile.onboardingCompleted ? 'Complete' : 'Incomplete'}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>AI Credits:</span>
                    <Badge variant={debugInfo.profile.aiGenerationsRemaining > 0 ? 'default' : 'destructive'}>
                      {debugInfo.profile.aiGenerationsRemaining}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Language:</span>
                    <span className="text-gray-300">{debugInfo.profile.preferredLanguage}</span>
                  </div>
                </div>
              </div>

              {/* System Section */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Settings className="w-4 h-4" />
                  <span className="font-semibold">System</span>
                </div>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Environment:</span>
                    <Badge variant={debugInfo.system.environment === 'development' ? 'default' : 'secondary'}>
                      {debugInfo.system.environment}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Supabase:</span>
                    <Badge variant={debugInfo.system.supabaseUrl === 'Configured' ? 'default' : 'destructive'}>
                      {debugInfo.system.supabaseUrl}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-2 pt-2 border-t border-gray-600">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="w-full text-xs"
                >
                  {showAdvanced ? 'Hide Advanced' : 'Show Advanced'}
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={clearAllData}
                  className="w-full text-xs"
                >
                  <Zap className="w-3 h-3 mr-1" />
                  Clear All Data
                </Button>
              </div>
            </div>
          </Card>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default DebugPanel;
