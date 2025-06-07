
import React, { ReactNode, startTransition } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Navigate, useLocation } from 'react-router-dom';
import { useProfile } from '@/hooks/useProfile';
import { useRole } from '@/hooks/useRole';
import SimpleLoadingIndicator from '@/components/ui/simple-loading-indicator';

interface ProtectedRouteProps {
  children: ReactNode;
  requireAuth?: boolean;
  requireProfile?: boolean;
  requireRole?: string | string[];
  redirectTo?: string;
}

const ProtectedRoute = React.memo<ProtectedRouteProps>(({ 
  children, 
  requireAuth = true,
  requireProfile = false,
  requireRole,
  redirectTo = '/auth' 
}) => {
  const { user, loading: authLoading, error: authError } = useAuth();
  const { profile, isLoading: profileLoading } = useProfile();
  const { role, isLoading: roleLoading, error: roleError, hasRole, hasAnyRole } = useRole();
  const location = useLocation();

  // Enhanced loading state handling with better performance
  const isLoading = authLoading || (requireProfile && profileLoading) || (requireRole && roleLoading);

  console.log('ProtectedRoute - Current state:', {
    pathname: location.pathname,
    hasUser: !!user,
    hasProfile: !!profile,
    authLoading,
    profileLoading,
    userId: user?.id?.substring(0, 8) + '...' || 'none'
  });

  // Early return for loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <SimpleLoadingIndicator
          message="Loading"
          description="Please wait while we verify your access..."
          size="lg"
        />
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

  // If user is authenticated but trying to access auth pages, redirect to dashboard
  if (!requireAuth && user) {
    console.log("ProtectedRoute - Redirecting authenticated user to dashboard");
    return <Navigate to="/dashboard" replace />;
  }

  // Enhanced role-based access control with better error handling
  if (requireRole && user) {
    let hasRequiredRole = false;
    
    try {
      // Special case: Admin users can access all role-protected routes
      if (role === 'admin') {
        console.log('Admin user granted access to role-protected route');
        hasRequiredRole = true;
      }
      // Standard role check for non-admin users
      else if (Array.isArray(requireRole)) {
        hasRequiredRole = hasAnyRole(requireRole);
      } else {
        hasRequiredRole = hasRole(requireRole);
      }
      
      if (!hasRequiredRole) {
        console.log(`ProtectedRoute - User role '${role}' insufficient for required role(s):`, requireRole);
        return <Navigate to="/dashboard" state={{ error: 'Insufficient permissions' }} replace />;
      }
    } catch (error) {
      console.error('ProtectedRoute - Role check error:', error);
      return <Navigate to="/dashboard" state={{ error: 'Role verification failed' }} replace />;
    }
  }

  // All conditions passed, render the children
  console.log("ProtectedRoute - All conditions passed, rendering children");
  return <>{children}</>;
});

ProtectedRoute.displayName = 'ProtectedRoute';

export default ProtectedRoute;
