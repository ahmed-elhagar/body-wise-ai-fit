
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Card } from "@/components/ui/card";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

const Index = () => {
  const navigate = useNavigate();
  const { user, loading, error, retryAuth, forceLogout } = useAuth();

  useEffect(() => {
    // Only redirect after loading is complete and we have a definitive auth state
    if (!loading) {
      console.log("Index - Auth state determined:", { 
        isAuthenticated: !!user,
        userId: user?.id?.substring(0, 8) + '...' || 'none'
      });
      
      if (user?.id) {
        // User is authenticated with valid ID, redirect to dashboard
        console.log("Index - Redirecting authenticated user to dashboard");
        navigate("/dashboard", { replace: true });
      } else {
        // User is not authenticated, redirect to landing
        console.log("Index - Redirecting unauthenticated user to landing");
        navigate("/landing", { replace: true });
      }
    }
  }, [user, loading, navigate]);

  // Enhanced error handling for auth errors
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="p-6 bg-red-50 border-red-200 max-w-md">
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle className="h-6 w-6 text-red-600" />
            <h2 className="text-lg font-semibold text-red-800">Authentication Error</h2>
          </div>
          <p className="text-red-700 mb-4">
            There was an issue with authentication. Please try again or force a fresh start.
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

  // Show loading state while determining where to redirect
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">FitFatta</h1>
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Initializing...</p>
        </div>
      </div>
    );
  }

  // This component should not render anything as it redirects immediately
  return null;
};

export default Index;
