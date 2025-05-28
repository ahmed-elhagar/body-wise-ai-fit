
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { Navigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useEffect } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireProfile?: boolean;
  adminOnly?: boolean;
}

export default function ProtectedRoute({ 
  children, 
  requireProfile = false, 
  adminOnly = false 
}: ProtectedRouteProps) {
  const { user, loading: authLoading, isAdmin } = useAuth();
  const { profile, isLoading: profileLoading } = useProfile();

  useEffect(() => {
    console.log('ProtectedRoute - Current state:', { 
      userExists: !!user,
      userId: user?.id,
      userEmail: user?.email, 
      authLoading, 
      profileLoading,
      isAdmin,
      profileExists: !!profile,
      requireProfile,
      adminOnly
    });
  }, [user, authLoading, profileLoading, isAdmin, profile, requireProfile, adminOnly]);

  // Show loading while authentication is being determined
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-fitness-primary mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If no user, redirect to auth
  if (!user) {
    console.log('ProtectedRoute - No user, redirecting to auth');
    return <Navigate to="/auth" replace />;
  }

  // Check admin access
  if (adminOnly && !isAdmin) {
    console.log('ProtectedRoute - Admin required but user is not admin');
    return <Navigate to="/dashboard" replace />;
  }

  // If profile is not required, show content immediately
  if (!requireProfile) {
    return <>{children}</>;
  }

  // Profile is required - show loading while profile loads
  if (profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-fitness-primary mx-auto mb-4" />
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  // Profile is required but doesn't exist
  if (!profile) {
    console.log('ProtectedRoute - No profile found, redirecting to onboarding');
    return <Navigate to="/onboarding" replace />;
  }
  
  // Validate profile belongs to current user
  if (profile.id !== user.id) {
    console.error('ProtectedRoute - Profile/User ID mismatch, forcing logout');
    return <Navigate to="/auth" replace />;
  }
  
  // Profile exists but missing essential data or onboarding not completed
  if (!profile.first_name || !profile.last_name || !profile.onboarding_completed) {
    console.log('ProtectedRoute - Profile incomplete, redirecting to onboarding');
    return <Navigate to="/onboarding" replace />;
  }

  return <>{children}</>;
}
