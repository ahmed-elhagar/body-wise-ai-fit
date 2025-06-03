
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Card } from "@/components/ui/card";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

const Index = () => {
  const navigate = useNavigate();
  const { user, loading, error, retryAuth, forceLogout } = useAuth();
  const [hasNavigated, setHasNavigated] = useState(false);

  // Debug logging
  useEffect(() => {
    console.log('Index - State:', { 
      loading, 
      hasUser: !!user, 
      hasNavigated,
      userId: user?.id?.substring(0, 8) + '...' || 'none',
      error: error?.message || null
    });
  }, [loading, user, hasNavigated, error]);

  // Simplified navigation logic - only run when auth loading is complete
  useEffect(() => {
    // Don't navigate if still loading, already navigated, or has error
    if (loading || hasNavigated || error) {
      return;
    }

    console.log('Index - Ready to navigate:', { 
      isAuthenticated: !!user,
      userId: user?.id?.substring(0, 8) + '...' || 'none'
    });
    
    // Use setTimeout to avoid potential race conditions
    const navigationTimer = setTimeout(() => {
      if (user?.id) {
        console.log('Index - Redirecting to dashboard');
        navigate("/dashboard", { replace: true });
      } else {
        console.log('Index - Redirecting to landing');
        navigate("/landing", { replace: true });
      }
      setHasNavigated(true);
    }, 100); // Small delay to ensure state is stable

    return () => clearTimeout(navigationTimer);
  }, [loading, hasNavigated, user?.id, navigate, error]);

  // Force navigation after timeout to prevent infinite loading
  useEffect(() => {
    const forceNavigationTimer = setTimeout(() => {
      if (!hasNavigated && !error) {
        console.log('Index - Force navigation after timeout');
        if (user?.id) {
          navigate("/dashboard", { replace: true });
        } else {
          navigate("/landing", { replace: true });
        }
        setHasNavigated(true);
      }
    }, 5000); // 5 second max wait

    return () => clearTimeout(forceNavigationTimer);
  }, [hasNavigated, user?.id, navigate, error]);

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
            {error.message || 'Authentication failed. Please try again or start fresh.'}
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
            <Button 
              onClick={() => navigate('/auth')}
              variant="outline"
              className="w-full"
            >
              Go to Login
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // Simplified loading state
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">FitFatta</h1>
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">
          {loading ? 'Checking authentication...' : 'Preparing your experience...'}
        </p>
        
        {/* Debug info in development */}
        {import.meta.env.DEV && (
          <div className="mt-4 text-xs text-gray-400 bg-gray-100 p-2 rounded">
            Loading: {loading.toString()} | User: {user ? 'Yes' : 'No'} | Nav: {hasNavigated.toString()}
          </div>
        )}
        
        {/* Emergency fallback button in case of hang */}
        {!loading && !hasNavigated && (
          <div className="mt-6">
            <Button 
              onClick={() => navigate('/auth')}
              variant="outline"
              className="text-sm"
            >
              Go to Login Page
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
