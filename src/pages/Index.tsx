
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
  const [forceTimeout, setForceTimeout] = useState(false);

  // Aggressive timeout protection to prevent infinite loading
  useEffect(() => {
    if (!hasNavigated) {
      const timeout = setTimeout(() => {
        console.warn('⚠️ Index - Critical timeout reached, forcing navigation');
        setForceTimeout(true);
        
        // Force navigation immediately without checking auth state
        startTransition(() => {
          if (user?.id) {
            console.log('Index - Timeout: Forcing navigation to dashboard');
            navigate("/dashboard", { replace: true });
          } else {
            console.log('Index - Timeout: Forcing navigation to landing');
            navigate("/landing", { replace: true });
          }
          setHasNavigated(true);
        });
      }, 5000); // Reduced to 5 seconds for faster recovery

      return () => clearTimeout(timeout);
    }
  }, [hasNavigated, user?.id, navigate]);

  // Primary navigation logic - only run if not timed out
  useEffect(() => {
    if (!loading && !hasNavigated && !forceTimeout) {
      console.log("Index - Auth resolved:", { 
        isAuthenticated: !!user,
        userId: user?.id?.substring(0, 8) + '...' || 'none'
      });
      
      startTransition(() => {
        if (user?.id) {
          console.log("Index - Redirecting to dashboard");
          navigate("/dashboard", { replace: true });
        } else {
          console.log("Index - Redirecting to landing");
          navigate("/landing", { replace: true });
        }
        setHasNavigated(true);
      });
    }
  }, [user?.id, loading, navigate, hasNavigated, forceTimeout]);

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

  // Timeout recovery UI
  if (forceTimeout) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="p-6 bg-orange-50 border-orange-200 max-w-md">
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle className="h-6 w-6 text-orange-600" />
            <h2 className="text-lg font-semibold text-orange-800">Loading Timeout</h2>
          </div>
          <p className="text-orange-700 mb-4">
            The app took too long to initialize. Redirecting now...
          </p>
          <div className="space-y-2">
            <Button 
              onClick={() => window.location.reload()} 
              className="w-full bg-orange-600 text-white hover:bg-orange-700"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh Page
            </Button>
            <Button 
              onClick={forceLogout} 
              variant="outline"
              className="w-full border-orange-600 text-orange-600 hover:bg-orange-50"
            >
              Clear Data & Restart
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // Simplified loading state while determining where to redirect
  if (loading && !hasNavigated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">FitFatta</h1>
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Initializing...</p>
          <p className="text-sm text-gray-500 mt-2">Checking your authentication status</p>
          {/* Progress indicator */}
          <div className="mt-4 text-xs text-gray-400">
            This should only take a few seconds...
          </div>
        </div>
      </div>
    );
  }

  // This should rarely be reached due to the navigation logic above
  return null;
};

export default Index;
