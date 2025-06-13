
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';
import { AuthHeader } from '@/components/auth/AuthHeader';
import { AuthForm } from '@/components/auth/AuthForm';
import { AuthToggle } from '@/components/auth/AuthToggle';
import { toast } from 'sonner';

const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user, signIn, signUp, error, clearError } = useAuth();

  // Redirect if already authenticated
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  // Clear errors when switching between modes
  useEffect(() => {
    clearError();
  }, [isSignUp, clearError]);

  const handleSubmit = async (data: {
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
  }) => {
    setLoading(true);
    clearError();

    try {
      if (isSignUp) {
        const metadata = data.firstName && data.lastName ? {
          first_name: data.firstName,
          last_name: data.lastName
        } : undefined;

        const result = await signUp(data.email, data.password, metadata);
        
        if (result?.error) {
          toast.error(result.error.message || 'Failed to create account');
        } else {
          toast.success('Account created successfully! Please check your email to verify your account.');
        }
      } else {
        const result = await signIn(data.email, data.password);
        
        if (result?.error) {
          toast.error(result.error.message || 'Failed to sign in');
        } else {
          toast.success('Welcome back!');
        }
      }
    } catch (err: any) {
      toast.error(err.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-green-50 p-4">
      <div className="max-w-md w-full">
        <Card className="p-8 shadow-xl border-0">
          <AuthHeader isSignUp={isSignUp} />
          
          <AuthForm
            isSignUp={isSignUp}
            onSubmit={handleSubmit}
            loading={loading}
          />
          
          <AuthToggle
            isSignUp={isSignUp}
            onToggle={() => setIsSignUp(!isSignUp)}
            loading={loading}
          />
          
          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{error.message}</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Auth;
