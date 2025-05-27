
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

  // Check if profile is complete (required fields)
  const isProfileComplete = profile && 
    profile.first_name && 
    profile.last_name && 
    profile.age && 
    profile.gender && 
    profile.height && 
    profile.weight && 
    profile.body_shape && 
    profile.fitness_goal && 
    profile.activity_level;

  if (requireProfile && !isProfileComplete) {
    return <Navigate to="/onboarding" replace />;
  }

  return <>{children}</>;
}
