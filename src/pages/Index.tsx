
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const Index = () => {
  const navigate = useNavigate();
  const { user, loading, error } = useAuth();

  useEffect(() => {
    console.log('Index - Auth state:', { 
      loading, 
      hasUser: !!user, 
      userId: user?.id?.substring(0, 8) + '...' || 'none',
      error: error?.message || null
    });

    // Simple navigation logic without complex state
    if (!loading) {
      if (user?.id) {
        console.log('Index - Redirecting to dashboard');
        navigate("/dashboard", { replace: true });
      } else {
        console.log('Index - Redirecting to auth');
        navigate("/auth", { replace: true });
      }
    }
  }, [loading, user?.id, navigate, error]);

  // Simple loading state
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">FitFatta</h1>
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">
          {error ? 'Checking authentication...' : 'Loading...'}
        </p>
        
        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">
              Authentication issue detected. Redirecting to login...
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
