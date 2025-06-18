
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/features/profile";
import { ChevronDown, ChevronUp, RefreshCw, Trash2, User } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

const DebugPanel = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { user, loading: authLoading, error: authError, forceLogout, retryAuth } = useAuth();
  const { profile, isLoading: profileLoading, error: profileError } = useProfile();

  const clearLocalStorage = () => {
    if (confirm('Clear all local storage? This will require re-login.')) {
      localStorage.clear();
      sessionStorage.clear();
      window.location.reload();
    }
  };

  const handleForceLogout = async () => {
    if (confirm('Force logout? You will need to login again.')) {
      await forceLogout();
    }
  };

  return (
    <Card className="fixed bottom-4 right-4 w-80 bg-yellow-50 border-yellow-200 z-50">
      <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
        <CollapsibleTrigger asChild>
          <div className="p-4 cursor-pointer hover:bg-yellow-100 transition-colors">
            <div className="flex items-center justify-between text-yellow-800">
              <span className="font-semibold flex items-center gap-2">
                <User className="w-4 h-4" />
                Debug Panel
              </span>
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </div>
          </div>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <div className="px-4 pb-4 space-y-3 text-sm">
            <div>
              <h4 className="font-semibold text-yellow-800 mb-2">Auth State:</h4>
              <div className="space-y-1 text-yellow-700">
                <div>User ID: {user?.id?.substring(0, 8) + '...' || 'None'}</div>
                <div>Email: {user?.email || 'None'}</div>
                <div>Loading: {authLoading ? 'Yes' : 'No'}</div>
                <div>Error: {authError?.message || 'None'}</div>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-yellow-800 mb-2">Profile State:</h4>
              <div className="space-y-1 text-yellow-700">
                <div>Profile ID: {profile?.id?.substring(0, 8) + '...' || 'None'}</div>
                <div>Name: {profile?.first_name && profile?.last_name ? `${profile.first_name} ${profile.last_name}` : 'None'}</div>
                <div>Profile Complete: {profile?.profile_completion_score >= 80 ? 'Yes' : 'No'}</div>
                <div>Loading: {profileLoading ? 'Yes' : 'No'}</div>
                <div>Error: {profileError?.message || 'None'}</div>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-yellow-800 mb-2">Current Route:</h4>
              <div className="text-yellow-700">{window.location.pathname}</div>
            </div>

            <div className="space-y-2 pt-2 border-t border-yellow-300">
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
                onClick={handleForceLogout}
                className="w-full text-xs"
              >
                <Trash2 className="w-3 h-3 mr-1" />
                Force Logout
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={clearLocalStorage}
                className="w-full text-xs"
              >
                Clear Storage
              </Button>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};

export default DebugPanel;
