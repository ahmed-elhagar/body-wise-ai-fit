
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';

const DebugPanel = () => {
  const { user, session, loading, error } = useAuth();

  return (
    <Card className="w-full max-w-2xl mx-auto mt-4">
      <CardHeader>
        <CardTitle>Debug Panel</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Badge variant={loading ? "secondary" : "default"}>
            Loading: {loading ? "Yes" : "No"}
          </Badge>
        </div>
        
        {error && (
          <div className="text-red-600">
            Error: {typeof error === 'string' ? error : error.message || 'Unknown error'}
          </div>
        )}
        
        <div>
          <h3 className="font-semibold">User:</h3>
          <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto">
            {user ? JSON.stringify(user, null, 2) : 'No user'}
          </pre>
        </div>
        
        <div>
          <h3 className="font-semibold">Session:</h3>
          <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto">
            {session ? JSON.stringify(session, null, 2) : 'No session'}
          </pre>
        </div>
      </CardContent>
    </Card>
  );
};

export default DebugPanel;
