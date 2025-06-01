
import { ReactNode } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Navigate, useLocation } from 'react-router-dom';
import { useProfile } from '@/hooks/useProfile';
import { useRole } from '@/hooks/useRole';

interface ProtectedRouteProps {
  children: ReactNode;
  requireAuth?: boolean;
  requireProfile?: boolean;
  requireRole?: string | string[];
  redirectTo?: string;
}

const ProtectedRoute = ({ 
  children, 
  requireAuth = true,
  requireProfile = false,
  requireRole,
  redirectTo = '/auth' 
}: ProtectedRouteProps) => {
  const { user, loading: authLoading, error: authError } = useAuth();
  const { profile, isLoading: profileLoading } = useProfile();
  const { role, isLoading: roleLoading, error: roleError, hasRole, hasAnyRole } = useRole();
  const location = useLocation();

  // Enhanced loading state handling
  const isLoading = authLoading || (requireProfile && profileLoading) || (requireRole && roleLoading);

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
          {authError && (
            <p className="text-red-500 text-sm mt-2">Authentication error occurred</p>
          )}
          {roleError && (
            <p className="text-red-500 text-sm mt-2">{roleError}</p>
          )}
        </div>
      </div>
    );
  }

  // Enhanced error handling for auth errors
  if (authError && requireAuth) {
    console.error("ProtectedRoute - Auth error:", authError);
    return <Navigate to={redirectTo} state={{ from: location.pathname, error: 'Authentication failed' }} replace />;
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

  // Enhanced role-based access control
  if (requireRole && user) {
    let hasRequiredRole = false;
    
    if (Array.isArray(requireRole)) {
      hasRequiredRole = hasAnyRole(requireRole);
    } else {
      hasRequiredRole = hasRole(requireRole);
    }
    
    if (!hasRequiredRole) {
      console.log(`ProtectedRoute - User role '${role}' insufficient for required role(s):`, requireRole);
      return <Navigate to="/dashboard" state={{ error: 'Insufficient permissions' }} replace />;
    }
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
