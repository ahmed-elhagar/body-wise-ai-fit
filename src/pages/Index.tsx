
import { useEffect, startTransition, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Card } from "@/components/ui/card";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

const Index = () => {
  const navigate = useNavigate();
  const { user, loading, error, retryAuth, forceLogout } = useAuth();
  const [hasNavigated, setHasNavigated] = useState(false);
  const [timeoutReached, setTimeoutReached] = useState(false);

  // Debug logging
  useEffect(() => {
    console.log('Index - State:', { 
      loading, 
      hasUser: !!user, 
      hasNavigated,
      timeoutReached,
      userId: user?.id?.substring(0, 8) + '...' || 'none'
    });
  }, [loading, user, hasNavigated, timeoutReached]);

  // Timeout safety net - if loading takes too long, force a decision
  useEffect(() => {
    const timeoutTimer = setTimeout(() => {
      if (!hasNavigated) {
        console.log('Index - Timeout reached, forcing navigation decision');
        setTimeoutReached(true);
        
        // Force navigation even if loading
        startTransition(() => {
          if (user?.id) {
            console.log('Index - Timeout: Redirecting to dashboard');
            navigate("/dashboard", { replace: true });
          } else {
            console.log('Index - Timeout: Redirecting to landing');
            navigate("/landing", { replace: true });
          }
          setHasNavigated(true);
        });
      }
    }, 8000); // 8 second timeout

    return () => clearTimeout(timeoutTimer);
  }, [hasNavigated, user?.id, navigate]);

  // Main navigation logic
  useEffect(() => {
    if (!loading && !hasNavigated && !timeoutReached) {
      console.log('Index - Auth resolved, navigating:', { 
        isAuthenticated: !!user,
        userId: user?.id?.substring(0, 8) + '...' || 'none'
      });
      
      startTransition(() => {
        if (user?.id) {
          console.log('Index - Redirecting to dashboard');
          navigate("/dashboard", { replace: true });
        } else {
          console.log('Index - Redirecting to landing');
          navigate("/landing", { replace: true });
        }
        setHasNavigated(true);
      });
    }
  }, [user?.id, loading, navigate, hasNavigated, timeoutReached]);

  // Enhanced error handling
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="p-6 bg-red-50 border-red-200 max-w-md">
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle className="h-6 w-6 text-red-600" />
            <h2 className="text-lg font-semibold text-red-800">Authentication Error</h2>
          </div>
          <p className="text-red-700 mb-4">
            Authentication failed. Please try again or start fresh.
          </p>
          <div className="space-y-2">
            <Button 
              onClick={retryAuth} 
              className="w-full bg-red-600 text-white hover:bg-red-700"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Retry Authentication
            </Button>
            <Button 
              onClick={forceLogout} 
              variant="outline"
              className="w-full border-red-600 text-red-600 hover:bg-red-50"
            >
              Force Fresh Start
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // Loading state with debug info
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">FitFatta</h1>
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">
          {timeoutReached ? 'Navigation timeout - redirecting...' : 'Initializing...'}
        </p>
        <p className="text-sm text-gray-500 mt-2">
          {loading ? 'Checking authentication...' : 'Preparing redirect...'}
        </p>
        
        {/* Debug info in development */}
        {import.meta.env.DEV && (
          <div className="mt-4 text-xs text-gray-400 bg-gray-100 p-2 rounded">
            Loading: {loading.toString()} | User: {user ? 'Yes' : 'No'} | Navigated: {hasNavigated.toString()}
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
