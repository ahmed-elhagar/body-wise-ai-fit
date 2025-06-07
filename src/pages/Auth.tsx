
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { AuthHeader } from "@/components/auth/AuthHeader";
import { AuthForm } from "@/components/auth/AuthForm";

// Simple loading component
const SimpleLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
  </div>
);

const Auth = () => {
  const [loading, setLoading] = useState(false);
  
  const { signIn, user, loading: authLoading } = useAuth();
  const { profile, isLoading: profileLoading } = useProfile();
  const navigate = useNavigate();

  // Redirect logic for authenticated users
  useEffect(() => {
    // Only proceed if auth is not loading and we have a user
    if (authLoading || !user) {
      console.log('Auth - Auth still loading or no user, waiting...', { authLoading, hasUser: !!user });
      return;
    }

    console.log('Auth - User authenticated, checking redirect:', {
      userId: user.id?.substring(0, 8) + '...',
      hasProfile: !!profile,
      profileLoading,
      hasBasicInfo: profile?.first_name && profile?.last_name
    });
    
    // If profile is still loading, wait
    if (profileLoading) {
      console.log('Auth - Profile still loading, waiting...');
      return;
    }

    // Check if user has basic profile info
    if (!profile || !profile.first_name || !profile.last_name) {
      console.log('Auth - Redirecting to signup (incomplete profile)');
      navigate('/signup', { replace: true });
    } else {
      console.log('Auth - Redirecting to dashboard (complete profile)');
      navigate('/dashboard', { replace: true });
    }
  }, [user, profile, profileLoading, authLoading, navigate]);

  const validateForm = (data: { email: string; password: string }) => {
    if (!data.email || !data.password) {
      toast.error('Email and password are required');
      return false;
    }
    
    if (data.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return false;
    }
    
    return true;
  };

  const handleSignIn = async (data: { email: string; password: string }) => {
    if (!validateForm(data)) return;
    
    setLoading(true);
    try {
      console.log('Auth - Starting sign in process for:', data.email);
      await signIn(data.email, data.password);
      console.log('Auth - Sign in successful');
      toast.success('Welcome back!');
      // Let useEffect handle redirection based on auth state
    } catch (error: any) {
      console.error('Auth - Sign in error:', error);
      toast.error(error.message || 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  // Show loading if user exists and we're determining where to redirect
  if (user && (authLoading || profileLoading)) {
    return <SimpleLoader />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4">
      <Card className="w-full max-w-md p-8 bg-white/90 backdrop-blur-sm border-0 shadow-2xl">
        <AuthHeader isSignUp={false} />
        
        <AuthForm 
          isSignUp={false}
          onSubmit={handleSignIn} 
          loading={loading || authLoading} 
        />
        
        <div className="text-center mt-6">
          <button
            onClick={() => navigate('/signup')}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium hover:underline"
            disabled={loading || authLoading}
          >
            Don't have an account? Join FitGenius
          </button>
        </div>
      </Card>
    </div>
  );
};

export default Auth;
