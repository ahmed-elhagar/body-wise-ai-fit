
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { Navigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

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

  console.log('ProtectedRoute - Auth state:', { user: !!user, authLoading, profileLoading, isAdmin });
  console.log('ProtectedRoute - Profile:', profile);

  if (authLoading || profileLoading) {
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

  // If profile is required but doesn't exist or lacks essential fields
  if (requireProfile) {
    if (!profile || !profile.first_name || !profile.last_name) {
      console.log('ProtectedRoute - Profile required but missing essential fields');
      return <Navigate to="/onboarding" replace />;
    }
  }

  return <>{children}</>;
}
