
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { ChevronDown, ChevronUp } from "lucide-react";

const DebugPanel = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { user, loading: authLoading, error: authError } = useAuth();
  const { profile, isLoading: profileLoading, error: profileError } = useProfile();

  return (
    <Card className="fixed bottom-4 right-4 w-80 bg-yellow-50 border-yellow-200 z-50">
      <div className="p-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between text-yellow-800"
        >
          <span className="font-semibold">Debug Panel</span>
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </Button>
        
        {isExpanded && (
          <div className="mt-4 space-y-3 text-sm">
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
          </div>
        )}
      </div>
    </Card>
  );
};

export default DebugPanel;
