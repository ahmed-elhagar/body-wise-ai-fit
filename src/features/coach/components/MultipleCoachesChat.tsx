
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users } from 'lucide-react';

const MultipleCoachesChat: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5" />
          Coach Collaboration
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600">Multi-coach chat functionality coming soon.</p>
      </CardContent>
    </Card>
  );
};

export default MultipleCoachesChat;
