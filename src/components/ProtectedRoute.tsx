
import React, { ReactNode } from 'react';
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
  const { role, isLoading: roleLoading, hasRole, hasAnyRole } = useRole();
  const location = useLocation();

  const isLoading = authLoading || (requireProfile && profileLoading) || (requireRole && roleLoading);

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <EnhancedPageLoading
          isLoading={true}
          type="general"
          title="Verifying Access"
          description="Please wait while we verify your permissions..."
          timeout={5000}
        />
      </div>
    );
  }

  // Handle authentication errors
  if (authError && requireAuth) {
    console.error("ProtectedRoute - Auth error:", authError);
    return <Navigate to={redirectTo} state={{ from: location.pathname, error: 'Authentication failed' }} replace />;
  }

  // Redirect unauthenticated users
  if (requireAuth && !user) {
    console.log("ProtectedRoute - Redirecting unauthenticated user to:", redirectTo);
    return <Navigate to={redirectTo} state={{ from: location.pathname }} replace />;
  }

  // Special handling for auth pages when user is authenticated
  if (['/auth', '/landing', '/register'].includes(location.pathname) && user) {
    if (profile?.onboarding_completed) {
      console.log("ProtectedRoute - Redirecting authenticated user to dashboard");
      return <Navigate to="/dashboard" replace />;
    } else {
      console.log("ProtectedRoute - Redirecting authenticated user to onboarding");
      return <Navigate to="/onboarding" replace />;
    }
  }

  // Special handling for onboarding route
  if (location.pathname === '/onboarding') {
    if (!user) {
      return <Navigate to="/auth" replace />;
    } else if (user && profile?.onboarding_completed) {
      console.log("ProtectedRoute - Onboarding completed, redirecting to dashboard");
      return <Navigate to="/dashboard" replace />;
    }
    // Allow access to onboarding for authenticated users who haven't completed it
    return <>{children}</>;
  }

  // Enhanced role-based access control
  if (requireRole && user) {
    let hasRequiredRole = false;
    
    try {
      // Admin always has access
      if (role === 'admin') {
        console.log('Admin user granted access to role-protected route');
        hasRequiredRole = true;
      }
      // Check if user has required role(s)
      else if (Array.isArray(requireRole)) {
        hasRequiredRole = hasAnyRole(requireRole);
        console.log(`User role '${role}' checked against required roles:`, requireRole, 'Result:', hasRequiredRole);
      } else {
        hasRequiredRole = hasRole(requireRole);
        console.log(`User role '${role}' checked against required role:`, requireRole, 'Result:', hasRequiredRole);
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

  // Profile completion check
  if (requireProfile && user && !profileLoading && profile) {
    // Only redirect to onboarding if profile explicitly shows onboarding is NOT completed
    if (profile.onboarding_completed === false) {
      console.log("ProtectedRoute - Redirecting to onboarding (incomplete profile)");
      return <Navigate to="/onboarding" state={{ from: location.pathname }} replace />;
    }
  }

  return <>{children}</>;
});

ProtectedRoute.displayName = 'ProtectedRoute';

export default ProtectedRoute;
