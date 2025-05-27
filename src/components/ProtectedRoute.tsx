
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
  requireProfile = true, 
  adminOnly = false 
}: ProtectedRouteProps) {
  const { user, loading: authLoading, isAdmin } = useAuth();
  const { profile, isLoading: profileLoading } = useProfile();

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

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  // Only check for profile completion if explicitly required and profile exists
  // Allow users to access the app even with incomplete profiles unless specifically requiring complete profile
  if (requireProfile && profile) {
    // Check for truly essential fields only
    const hasEssentialInfo = profile.first_name && profile.last_name;
    
    // Only redirect to onboarding if completely missing essential profile data
    if (!hasEssentialInfo) {
      return <Navigate to="/onboarding" replace />;
    }
  }

  return <>{children}</>;
}
