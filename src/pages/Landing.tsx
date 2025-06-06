
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { Navigate } from "react-router-dom";
import EnhancedPageLoading from "@/components/ui/enhanced-page-loading";

const Landing = () => {
  const { user, loading: authLoading } = useAuth();
  const { profile, isLoading: profileLoading } = useProfile();

  // Show loading while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <EnhancedPageLoading
          isLoading={true}
          type="general"
          title="Loading"
          description="Please wait..."
          timeout={3000}
        />
      </div>
    );
  }

  // If user is authenticated, redirect based on profile completion
  if (user) {
    if (profileLoading) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
          <EnhancedPageLoading
            isLoading={true}
            type="general"
            title="Loading Profile"
            description="Setting up your account..."
            timeout={3000}
          />
        </div>
      );
    }

    if (profile?.onboarding_completed) {
      return <Navigate to="/dashboard" replace />;
    } else {
      return <Navigate to="/signup" replace />;
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">FitFatta</h1>
          <p className="text-gray-600 mb-8">Your AI-powered fitness companion</p>
          <div className="space-y-4">
            <a
              href="/signup"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Get Started
            </a>
            <a
              href="/auth"
              className="w-full flex justify-center py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Sign In
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
