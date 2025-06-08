
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Card } from "@/components/ui/card";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

const Index = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading, error, retryAuth, forceLogout } = useAuth();
  const [hasNavigated, setHasNavigated] = useState(false);

  // Debug logging
  useEffect(() => {
    console.log('Index - State:', { 
      authLoading, 
      hasUser: !!user, 
      hasNavigated,
      userId: user?.id?.substring(0, 8) + '...' || 'none',
      error: error?.message || null
    });
  }, [authLoading, user, hasNavigated, error]);

  // Navigation logic
  useEffect(() => {
    // Don't navigate if still loading, already navigated, or there's an error
    if (authLoading || hasNavigated || error) {
      console.log('Index - Not ready to navigate:', { authLoading, hasNavigated, hasError: !!error });
      return;
    }

    // No user - go to landing immediately
    if (!user) {
      console.log('Index - No user, redirecting to landing');
      navigate("/landing", { replace: true });
      setHasNavigated(true);
      return;
    }

    // User exists - go to dashboard (removed profile completion check)
    console.log('Index - User authenticated, redirecting to dashboard');
    navigate("/dashboard", { replace: true });
    setHasNavigated(true);
  }, [authLoading, hasNavigated, user, navigate, error]);

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="p-6 bg-red-50 border-red-200 max-w-md">
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle className="h-6 w-6 text-red-600" />
            <h2 className="text-lg font-semibold text-red-800">Authentication Error</h2>
          </div>
          <p className="text-red-700 mb-4">
            {error.message || 'Authentication failed. Please try again.'}
          </p>
          <div className="space-y-2">
            <Button 
              onClick={retryAuth} 
              className="w-full bg-red-600 text-white hover:bg-red-700"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Retry
            </Button>
            <Button 
              onClick={forceLogout} 
              variant="outline"
              className="w-full border-red-600 text-red-600 hover:bg-red-50"
            >
              Start Fresh
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // Simple loading without extra text - just redirect immediately
  return null;
};

export default Index;
