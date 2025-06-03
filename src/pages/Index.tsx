
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

  // Navigation logic - simplified
  useEffect(() => {
    if (loading || hasNavigated || error) {
      return;
    }

    console.log('Index - Ready to navigate:', { 
      isAuthenticated: !!user,
      userId: user?.id?.substring(0, 8) + '...' || 'none'
    });
    
    const timer = setTimeout(() => {
      if (user?.id) {
        console.log('Index - Redirecting to dashboard');
        navigate("/dashboard", { replace: true });
      } else {
        console.log('Index - Redirecting to landing');
        navigate("/landing", { replace: true });
      }
      setHasNavigated(true);
    }, 100);

    return () => clearTimeout(timer);
  }, [loading, hasNavigated, user?.id, navigate, error]);

  // Force navigation after 3 seconds to prevent hanging
  useEffect(() => {
    const forceTimer = setTimeout(() => {
      if (!hasNavigated && !error) {
        console.log('Index - Force navigation timeout');
        if (user?.id) {
          navigate("/dashboard", { replace: true });
        } else {
          navigate("/landing", { replace: true });
        }
        setHasNavigated(true);
      }
    }, 3000);

    return () => clearTimeout(forceTimer);
  }, [hasNavigated, user?.id, navigate, error]);

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

  // Loading state
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">FitFatta</h1>
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">
          {loading ? 'Checking authentication...' : 'Redirecting...'}
        </p>
        
        {/* Emergency fallback after 5 seconds */}
        {!hasNavigated && (
          <div className="mt-6">
            <Button 
              onClick={() => navigate('/auth')}
              variant="outline"
              className="text-sm"
            >
              Go to Login
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
