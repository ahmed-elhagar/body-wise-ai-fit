
import React, { ReactNode, startTransition } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Navigate, useLocation } from 'react-router-dom';
import { useProfile } from '@/hooks/useProfile';
import { useRole } from '@/hooks/useRole';
import EnhancedPageLoading from '@/components/ui/enhanced-page-loading';

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

  const isLoading = authLoading || (requireProfile && profileLoading) || (requireRole && roleLoading);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <EnhancedPageLoading
          isLoading={true}
          type="general"
          title="Loading"
          description="Please wait while we verify your access..."
          timeout={5000}
        />
      </div>
    );
  }

  if (authError && requireAuth) {
    console.error("ProtectedRoute - Auth error:", authError);
    return <Navigate to={redirectTo} state={{ from: location.pathname, error: 'Authentication failed' }} replace />;
  }

  if (requireAuth && !user) {
    console.log("ProtectedRoute - Redirecting unauthenticated user to:", redirectTo);
    return <Navigate to={redirectTo} state={{ from: location.pathname }} replace />;
  }

  // Special handling for onboarding route
  if (location.pathname === '/onboarding') {
    if (!user) {
      return <>{children}</>;
    } else if (user && profile && profile.onboarding_completed) {
      console.log("ProtectedRoute - Authenticated user with completed onboarding, redirecting to dashboard");
      return <Navigate to="/dashboard" replace />;
    } else if (user && (!profile || !profile.onboarding_completed)) {
      return <>{children}</>;
    }
  }

  // If user is authenticated but trying to access auth pages
  if (!requireAuth && user) {
    if (profile?.onboarding_completed) {
      console.log("ProtectedRoute - Redirecting authenticated user to dashboard");
      return <Navigate to="/dashboard" replace />;
    } else {
      console.log("ProtectedRoute - Redirecting authenticated user to onboarding");
      return <Navigate to="/onboarding" replace />;
    }
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

  // FIXED: More lenient profile completion check
  if (requireProfile && user && !profileLoading && profile) {
    // Only redirect to onboarding if profile explicitly shows onboarding is NOT completed
    // This prevents redirect loops for users who may have completed onboarding but have missing data
    if (profile.onboarding_completed === false) {
      console.log("ProtectedRoute - Redirecting to onboarding (incomplete profile)");
      return <Navigate to="/onboarding" state={{ from: location.pathname }} replace />;
    }
  }

  return <>{children}</>;
});

ProtectedRoute.displayName = 'ProtectedRoute';

export default ProtectedRoute;
