
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

  // Enhanced loading state handling with better performance
  const isLoading = authLoading || (requireProfile && profileLoading) || (requireRole && roleLoading);

  console.log('ProtectedRoute - Current state:', {
    pathname: location.pathname,
    hasUser: !!user,
    hasProfile: !!profile,
    onboardingCompleted: profile?.onboarding_completed,
    authLoading,
    profileLoading,
    userId: user?.id?.substring(0, 8) + '...' || 'none'
  });

  // Early return for loading state
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

  // Special handling for onboarding route - allow access if user exists
  if (location.pathname === '/onboarding') {
    if (!user) {
      // Unauthenticated users can access onboarding (includes signup)
      console.log("ProtectedRoute - Allowing unauthenticated access to onboarding");
      return <>{children}</>;
    } else if (user && profile && profile.onboarding_completed) {
      // Authenticated users who completed onboarding should go to dashboard
      console.log("ProtectedRoute - User completed onboarding, redirecting to dashboard");
      return <Navigate to="/dashboard" replace />;
    } else {
      // Authenticated users who haven't completed onboarding can continue
      console.log("ProtectedRoute - User authenticated but onboarding not completed, allowing access");
      return <>{children}</>;
    }
  }

  // If user is authenticated but trying to access auth pages, redirect appropriately
  if (!requireAuth && user) {
    if (profile?.onboarding_completed) {
      console.log("ProtectedRoute - Redirecting authenticated user with completed onboarding to dashboard");
      return <Navigate to="/dashboard" replace />;
    } else if (!profile?.onboarding_completed) {
      console.log("ProtectedRoute - Redirecting authenticated user with incomplete onboarding to onboarding");
      return <Navigate to="/onboarding" replace />;
    }
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

  // Critical fix: Check onboarding completion for protected routes
  if (requireAuth && user && profile && !profile.onboarding_completed && location.pathname !== '/onboarding') {
    console.log("ProtectedRoute - User authenticated but onboarding not completed, redirecting to onboarding");
    return <Navigate to="/onboarding" state={{ from: location.pathname }} replace />;
  }

  // All conditions passed, render the children
  console.log("ProtectedRoute - All conditions passed, rendering children");
  return <>{children}</>;
});

ProtectedRoute.displayName = 'ProtectedRoute';

export default ProtectedRoute;
