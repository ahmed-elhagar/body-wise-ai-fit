
import { ReactNode } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Navigate, useLocation } from 'react-router-dom';
import { useProfile } from '@/hooks/useProfile';

interface ProtectedRouteProps {
  children: ReactNode;
  requireAuth?: boolean;
  requireProfile?: boolean;
  redirectTo?: string;
}

const ProtectedRoute = ({ 
  children, 
  requireAuth = true,
  requireProfile = false,
  redirectTo = '/auth' 
}: ProtectedRouteProps) => {
  const { user, loading: authLoading } = useAuth();
  const { profile, isLoading: profileLoading } = useProfile();
  const location = useLocation();

  // Show loading while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If authentication is required but user is not authenticated
  if (requireAuth && !user) {
    console.log("ProtectedRoute - Redirecting unauthenticated user to:", redirectTo);
    return <Navigate to={redirectTo} state={{ from: location.pathname }} replace />;
  }

  // If user is authenticated but trying to access auth pages
  if (!requireAuth && user) {
    const from = location.state?.from || '/dashboard';
    console.log("ProtectedRoute - Redirecting authenticated user to:", from);
    return <Navigate to={from} replace />;
  }

  // If profile is required but user profile is not complete
  if (requireProfile && user && !profileLoading && profile && !profile.onboarding_completed) {
    console.log("ProtectedRoute - Redirecting to onboarding (incomplete profile)");
    return <Navigate to="/onboarding" state={{ from: location.pathname }} replace />;
  }

  // All conditions passed, render the children
  return <>{children}</>;
};

export default ProtectedRoute;
