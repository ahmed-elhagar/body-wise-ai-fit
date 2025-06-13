
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { AuthHeader } from "@/components/auth/AuthHeader";
import { AuthForm } from "@/components/auth/AuthForm";
import SimpleLoadingIndicator from "@/components/ui/simple-loading-indicator";
import ProtectedRoute from "@/components/ProtectedRoute";

const Auth = () => {
  const [loading, setLoading] = useState(false);
  
  const { signIn, user, loading: authLoading } = useAuth();
  const { profile, isLoading: profileLoading } = useProfile();
  const navigate = useNavigate();

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
      // Navigation is handled by ProtectedRoute
    } catch (error: any) {
      console.error('Auth - Sign in error:', error);
      toast.error(error.message || 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute requireAuth={false} preventAuthenticatedAccess={true}>
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
              Don't have an account? Join FitFatta
            </button>
          </div>
        </Card>
      </div>
    </ProtectedRoute>
  );
};

export default Auth;
