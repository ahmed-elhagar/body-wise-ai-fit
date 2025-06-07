
import React, { ReactNode, startTransition } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Navigate, useLocation } from 'react-router-dom';
import { useProfile } from '@/hooks/useProfile';
import { useRole } from '@/hooks/useRole';
import EnhancedPageLoading from '@/components/EnhancedPageLoading';

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
    userRole: role,
    authLoading,
    profileLoading,
    roleLoading,
    requireRole,
    userId: user?.id?.substring(0, 8) + '...' || 'none'
  });

  // Early return for loading state with enhanced loading component
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <EnhancedPageLoading
          title="Verifying Access"
          description="Please wait while we verify your permissions..."
          estimatedTime={3}
        />
      </div>
    );
  }

  // Enhanced error handling for auth errors
  if (authError && requireAuth) {
    console.error("ProtectedRoute - Auth error:", authError);
    return <Navigate to={redirectTo} state={{ from: location.pathname, error: 'Authentication failed' }} replace />;
  }

  // Role error handling
  if (roleError && requireRole) {
    console.error("ProtectedRoute - Role error:", roleError);
    return <Navigate to="/dashboard" state={{ error: 'Role verification failed' }} replace />;
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
        console.log(`Role check for multiple roles [${requireRole.join(', ')}]:`, hasRequiredRole);
      } else {
        hasRequiredRole = hasRole(requireRole);
        console.log(`Role check for '${requireRole}':`, hasRequiredRole);
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

  // Profile completion check for authenticated users
  if (requireProfile && user && (!profile || !profile.onboarding_completed)) {
    console.log("ProtectedRoute - Redirecting to complete profile");
    return <Navigate to="/signup" state={{ from: location.pathname }} replace />;
  }

  // All conditions passed, render the children
  console.log("ProtectedRoute - All conditions passed, rendering children");
  return <>{children}</>;
});

ProtectedRoute.displayName = 'ProtectedRoute';

export default ProtectedRoute;
