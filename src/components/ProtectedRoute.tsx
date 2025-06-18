
import React, { ReactNode, startTransition } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Navigate, useLocation } from 'react-router-dom';
import { useProfile } from '@/features/profile';
import { useRole } from '@/hooks/useRole';
import EnhancedPageLoading from '@/components/EnhancedPageLoading';

interface ProtectedRouteProps {
  children: ReactNode;
  requireAuth?: boolean;
  requireProfile?: boolean;
  requireRole?: string | string[];
  redirectTo?: string;
  preventAuthenticatedAccess?: boolean;
}

const ProtectedRoute = React.memo<ProtectedRouteProps>(({ 
  children, 
  requireAuth = true,
  requireProfile = false,
  requireRole,
  redirectTo = '/auth',
  preventAuthenticatedAccess = false
}) => {
  const { user, loading: authLoading, error: authError } = useAuth();
  const { profile, isLoading: profileLoading } = useProfile();
  const { role, isLoading: roleLoading, error: roleError, hasRole, hasAnyRole } = useRole();
  const location = useLocation();

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
    preventAuthenticatedAccess,
    profileCompleted: profile?.onboarding_completed,
    userId: user?.id?.substring(0, 8) + '...' || 'none'
  });

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

  if (authError && requireAuth) {
    console.error("ProtectedRoute - Auth error:", authError);
    return <Navigate to={redirectTo} state={{ from: location.pathname, error: 'Authentication failed' }} replace />;
  }

  if (roleError && requireRole) {
    console.error("ProtectedRoute - Role error:", roleError);
    return <Navigate to="/dashboard" state={{ error: 'Role verification failed' }} replace />;
  }

  // Prevent authenticated users from accessing auth pages
  if (preventAuthenticatedAccess && user) {
    console.log("ProtectedRoute - Redirecting authenticated user away from auth page");
    return <Navigate to="/dashboard" replace />;
  }

  // If authentication is required but user is not authenticated
  if (requireAuth && !user) {
    console.log("ProtectedRoute - Redirecting unauthenticated user to:", redirectTo);
    return <Navigate to={redirectTo} state={{ from: location.pathname }} replace />;
  }

  // Enhanced role-based access control
  if (requireRole && user) {
    let hasRequiredRole = false;
    
    try {
      if (role === 'admin') {
        console.log('Admin user granted access to role-protected route');
        hasRequiredRole = true;
      }
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

  // Enhanced profile completion check - only redirect if profile is truly incomplete
  if (requireProfile && user) {
    // If we don't have profile data yet but are not loading, wait
    if (!profile && !profileLoading) {
      console.log("ProtectedRoute - No profile data but not loading, waiting...");
      return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
          <EnhancedPageLoading
            title="Loading Profile"
            description="Please wait while we load your profile..."
            estimatedTime={2}
          />
        </div>
      );
    }
    
    // Only redirect if we have profile data and it's genuinely incomplete
    if (profile && (!profile.onboarding_completed && !profile.first_name && !profile.last_name)) {
      console.log("ProtectedRoute - Profile incomplete, redirecting to signup");
      return <Navigate to="/signup" state={{ from: location.pathname }} replace />;
    }
  }

  console.log("ProtectedRoute - All conditions passed, rendering children");
  return <>{children}</>;
});

ProtectedRoute.displayName = 'ProtectedRoute';

export default ProtectedRoute;
