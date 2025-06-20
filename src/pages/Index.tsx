
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Navigate } from 'react-router-dom';
import { toast } from 'sonner';

const Index = () => {
  const { user, signOut, error, isLoading } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('Signed out successfully');
    } catch (err) {
      toast.error('Failed to sign out');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-600">
              {typeof error === 'string' ? error : error.message || 'An unexpected error occurred'}
            </p>
            <Button className="mt-4" onClick={() => window.location.reload()}>
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="max-w-md">
        <CardHeader>
          <CardTitle>Welcome to FitFatta AI</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">Your personalized fitness and nutrition companion.</p>
          <div className="space-y-2">
            <Button asChild className="w-full">
              <a href="/auth">Get Started</a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;
