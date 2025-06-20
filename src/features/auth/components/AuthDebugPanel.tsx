
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';

const AuthDebugPanel = () => {
  const { user, session, loading, error } = useAuth();

  return (
    <Card className="w-full max-w-2xl mx-auto mt-4">
      <CardHeader>
        <CardTitle>Auth Debug Panel</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Badge variant={loading ? "secondary" : "default"}>
            Status: {loading ? "Loading" : "Ready"}
          </Badge>
        </div>
        
        {error && (
          <div className="text-red-600">
            Error: {typeof error === 'string' ? error : error.message || 'Unknown error'}
          </div>
        )}
        
        <div>
          <h3 className="font-semibold">Authentication State:</h3>
          <div className="text-sm">
            User: {user ? 'Authenticated' : 'Not authenticated'}
          </div>
          <div className="text-sm">
            Session: {session ? 'Active' : 'None'}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AuthDebugPanel;
