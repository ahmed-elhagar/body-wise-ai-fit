
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { AuthHeader } from "@/components/auth/AuthHeader";
import { AuthForm } from "@/components/auth/AuthForm";
import { AuthToggle } from "@/components/auth/AuthToggle";
import EnhancedPageLoading from "@/components/ui/enhanced-page-loading";

const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const { signIn, signUp, user, loading: authLoading } = useAuth();
  const { profile, isLoading: profileLoading, updateProfile } = useProfile();
  const navigate = useNavigate();

  // Redirect logic for authenticated users
  useEffect(() => {
    if (authLoading || !user) return;

    console.log('Auth - User authenticated, checking redirect:', {
      userId: user.id,
      hasProfile: !!profile,
      profileLoading,
      onboardingCompleted: profile?.onboarding_completed
    });
    
    if (profileLoading) {
      console.log('Auth - Profile still loading, waiting...');
      return;
    }

    // Check if user has completed onboarding
    if (!profile || !profile.onboarding_completed || !profile.first_name || !profile.last_name) {
      console.log('Auth - Redirecting to onboarding (incomplete profile)');
      navigate('/onboarding', { replace: true });
    } else {
      console.log('Auth - Redirecting to dashboard (complete profile)');
      navigate('/dashboard', { replace: true });
    }
  }, [user, profile, profileLoading, authLoading, navigate]);

  const validateForm = (data: { email: string; password: string; firstName?: string; lastName?: string }) => {
    if (!data.email || !data.password) {
      toast.error('Email and password are required');
      return false;
    }
    
    if (data.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return false;
    }
    
    if (isSignUp && (!data.firstName || !data.lastName)) {
      toast.error('First name and last name are required');
      return false;
    }
    
    return true;
  };

  const handleAuth = async (data: { email: string; password: string; firstName?: string; lastName?: string }) => {
    if (!validateForm(data)) return;
    
    setLoading(true);
    try {
      if (isSignUp) {
        await signUp(data.email, data.password, { 
          first_name: data.firstName, 
          last_name: data.lastName 
        });
        console.log('Sign up successful, user will be redirected after profile creation');
        toast.success('Account created successfully!');
        
        // Create initial profile with signup data
        if (data.firstName && data.lastName) {
          try {
            await updateProfile({
              first_name: data.firstName,
              last_name: data.lastName,
              onboarding_completed: false
            });
            console.log('Initial profile created with signup data');
          } catch (error) {
            console.error('Failed to create initial profile:', error);
          }
        }
        
        // Let useEffect handle redirection based on auth state
      } else {
        await signIn(data.email, data.password);
        console.log('Sign in successful');
        toast.success('Welcome back!');
        // For signin, let the useEffect handle redirection based on auth state
      }
    } catch (error: any) {
      console.error('Auth error:', error);
      toast.error(error.message || `Failed to ${isSignUp ? 'sign up' : 'sign in'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = () => {
    setIsSignUp(!isSignUp);
  };

  // Show loading if user exists and we're determining where to redirect
  if (user && (authLoading || profileLoading)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <EnhancedPageLoading
          isLoading={true}
          type="general"
          title="Setting Up Your Account"
          description="Please wait while we prepare your dashboard..."
          timeout={5000}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4">
      <Card className="w-full max-w-md p-8 bg-white/90 backdrop-blur-sm border-0 shadow-2xl">
        <AuthHeader isSignUp={isSignUp} />
        <AuthForm 
          isSignUp={isSignUp} 
          onSubmit={handleAuth} 
          loading={loading || authLoading} 
        />
        <AuthToggle 
          isSignUp={isSignUp} 
          onToggle={handleToggle} 
          loading={loading || authLoading} 
        />
      </Card>
    </div>
  );
};

export default Auth;
